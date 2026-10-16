import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ACCOUNT_COOKIE_NAME, parseAccountSessionToken } from '@/lib/account-auth'
import { z } from 'zod'

const withdrawalRequestSchema = z.object({
  amount: z.number().min(200, 'O valor mínimo para solicitação de saque é R$ 200,00'),
  taxOption: z.enum(['PJ_MEI', 'PF_CPF']),
  pixKey: z.string().min(3, 'Chave PIX obrigatória'),
  pixKeyType: z.string().optional(),
  nfseUrl: z.string().optional(),
})

async function getPartnerFromSession(request: NextRequest) {
  const token = request.cookies.get(ACCOUNT_COOKIE_NAME)?.value
  const session = parseAccountSessionToken(token)

  if (!session?.email || session.selectedRole !== 'PARTNER') {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
    include: {
      partnerProfile: {
        include: {
          commissions: true,
          withdrawals: true,
        },
      },
    },
  })

  if (!user?.partnerProfile) {
    return null
  }

  return { user, partner: user.partnerProfile }
}

// GET: Retorna saldos, comissões e histórico de saques do parceiro
export async function GET(request: NextRequest) {
  const auth = await getPartnerFromSession(request)
  if (!auth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { partner } = auth

  // Auto-liberação de comissões retidas cujo prazo já venceu
  const now = new Date()
  await prisma.commission.updateMany({
    where: {
      partnerId: partner.id,
      status: 'EM_RETENCAO_30_DIAS',
      releaseDate: { lte: now },
    },
    data: {
      status: 'LIBERADO',
    },
  })

  // Recalcular saldo disponível em tempo real
  const commissions = await prisma.commission.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: 'desc' },
  })

  const withdrawals = await prisma.partnerWithdrawal.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: 'desc' },
  })

  const pendingSum = commissions
    .filter((c) => c.status === 'EM_RETENCAO_30_DIAS')
    .reduce((acc, c) => acc + c.amount, 0)

  const totalLiberado = commissions
    .filter((c) => c.status === 'LIBERADO')
    .reduce((acc, c) => acc + c.amount, 0)

  const totalEmSaqueOuPago = withdrawals
    .filter((w) => w.status !== 'REJECTED')
    .reduce((acc, w) => acc + w.requestedAmount, 0)

  const availableBalance = Math.max(0, Number((totalLiberado - totalEmSaqueOuPago).toFixed(2)))
  const pendingBalance = Number(pendingSum.toFixed(2))

  return NextResponse.json({
    partner: {
      id: partner.id,
      nivelParceiro: partner.nivelParceiro,
      commissionRate: partner.commissionRate,
      maxAutoDiscountRate: partner.maxAutoDiscountRate,
      pixKey: partner.pixKey,
      personType: partner.personType,
      cpfCnpj: partner.cpfCnpj || partner.document,
      availableBalance,
      pendingBalance,
      totalEarned: partner.totalEarned,
      canWithdraw: availableBalance >= 200,
      minWithdrawalThreshold: 200,
    },
    commissions,
    withdrawals,
  })
}

// POST: Solicitar saque com Funil de Formalização (PJ/MEI vs PF/CPF)
export async function POST(request: NextRequest) {
  try {
    const auth = await getPartnerFromSession(request)
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { partner } = auth
    const body = await request.json()
    const data = withdrawalRequestSchema.parse(body)

    // Recalcular saldo liberado real
    const commissions = await prisma.commission.findMany({
      where: { partnerId: partner.id },
    })

    const withdrawals = await prisma.partnerWithdrawal.findMany({
      where: { partnerId: partner.id },
    })

    const totalLiberado = commissions
      .filter((c) => c.status === 'LIBERADO')
      .reduce((acc, c) => acc + c.amount, 0)

    const totalEmSaqueOuPago = withdrawals
      .filter((w) => w.status !== 'REJECTED')
      .reduce((acc, w) => acc + w.requestedAmount, 0)

    const realAvailable = Math.max(0, Number((totalLiberado - totalEmSaqueOuPago).toFixed(2)))

    if (realAvailable < 200) {
      return NextResponse.json(
        { error: 'Saldo liberado insuficiente. O valor mínimo é de R$ 200,00.' },
        { status: 400 }
      )
    }

    if (data.amount > realAvailable) {
      return NextResponse.json(
        { error: `O valor solicitado (R$ ${data.amount.toFixed(2)}) é maior que seu saldo liberado (R$ ${realAvailable.toFixed(2)}).` },
        { status: 400 }
      )
    }

    // Regras tributárias:
    // Opção A: PJ/MEI -> 100% líquido via PIX mediante upload de NFSe
    // Opção B: PF/CPF -> retenção de 11% (INSS autônomo) a 13% (INSS + IRRF) via RPA
    let taxRate = 0
    let taxAmount = 0
    let netAmount = data.amount

    if (data.taxOption === 'PF_CPF') {
      taxRate = 0.12 // Média tributária 12% de retenção INSS/IRRF
      taxAmount = Number((data.amount * taxRate).toFixed(2))
      netAmount = Number((data.amount - taxAmount).toFixed(2))
    } else {
      taxRate = 0
      taxAmount = 0
      netAmount = data.amount
    }

    const withdrawal = await prisma.partnerWithdrawal.create({
      data: {
        partnerId: partner.id,
        requestedAmount: data.amount,
        taxOption: data.taxOption,
        taxRate,
        taxAmount,
        netAmount,
        pixKey: data.pixKey,
        pixKeyType: data.pixKeyType,
        nfseUrl: data.nfseUrl,
        status: 'PENDING',
        notes: data.taxOption === 'PJ_MEI'
          ? 'Saque PJ/MEI 100% líquido via PIX mediante emissão de NFSe'
          : `Saque PF com retenção legal de ${(taxRate * 100).toFixed(0)}% (R$ ${taxAmount.toFixed(2)}) via RPA. Líquido a pagar: R$ ${netAmount.toFixed(2)}`,
      },
    })

    // Atualiza saldo liberado do parceiro
    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        availableBalance: { decrement: data.amount },
      },
    })

    return NextResponse.json({
      success: true,
      withdrawal,
      message: 'Solicitação de saque enviada com sucesso! Em até 2 dias úteis nossa equipe financeira fará a liquidação via PIX.',
    })
  } catch (error) {
    console.error('Erro ao solicitar saque:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Falha ao solicitar saque' }, { status: 500 })
  }
}
