import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { z } from 'zod'

const manualCommissionSchema = z.object({
  partnerId: z.string().min(1, 'Parceiro é obrigatório'),
  clientId: z.string().optional(),
  clientName: z.string().min(2, 'Nome do cliente é obrigatório'),
  clientEmail: z.string().email().optional(),
  serviceName: z.string().min(2, 'Serviço é obrigatório'),
  grossAmount: z.number().positive('Valor recebido deve ser maior que zero'),
  paymentDate: z.string().min(1, 'Data de pagamento é obrigatória'),
  customRate: z.number().min(0.05).max(0.30).optional(), // Opcional se desejar sobrepor a taxa cadastrada
  notes: z.string().optional(),
})

// GET: Lista comissões registradas e parceiros para o select do formulário
export async function GET(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const statusFilter = searchParams.get('status')

  // Auto-liberação de comissões cujo prazo de 30 dias já venceu
  const now = new Date()
  await prisma.commission.updateMany({
    where: {
      status: 'EM_RETENCAO_30_DIAS',
      releaseDate: { lte: now },
    },
    data: {
      status: 'LIBERADO',
    },
  })

  // Sincronizar saldos dos parceiros baseados no status real das comissões
  const partnersWithCommissions = await prisma.partner.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      commissions: true,
      withdrawals: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Atualizar saldos calculados dinamicamente
  for (const p of partnersWithCommissions) {
    const pendingSum = p.commissions
      .filter((c) => c.status === 'EM_RETENCAO_30_DIAS')
      .reduce((acc, c) => acc + c.amount, 0)
    
    // Saldo liberado líquido subtraído de saques solicitados/pagos
    const totalLiberado = p.commissions
      .filter((c) => c.status === 'LIBERADO')
      .reduce((acc, c) => acc + c.amount, 0)

    const totalSacadoOuSolicitado = p.withdrawals
      .filter((w) => w.status !== 'REJECTED')
      .reduce((acc, w) => acc + w.requestedAmount, 0)

    const availableBal = Math.max(0, Number((totalLiberado - totalSacadoOuSolicitado).toFixed(2)))
    const pendingBal = Number(pendingSum.toFixed(2))

    if (Math.abs(p.availableBalance - availableBal) > 0.01 || Math.abs(p.pendingBalance - pendingBal) > 0.01) {
      await prisma.partner.update({
        where: { id: p.id },
        data: {
          availableBalance: availableBal,
          pendingBalance: pendingBal,
        },
      })
      p.availableBalance = availableBal
      p.pendingBalance = pendingBal
    }
  }

  // Lista de comissões com paginação / filtro
  const commissions = await prisma.commission.findMany({
    where: statusFilter ? { status: statusFilter as any } : undefined,
    include: {
      partner: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      withdrawal: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({
    commissions,
    partners: partnersWithCommissions.map((p) => ({
      id: p.id,
      name: p.user.name,
      email: p.user.email,
      companyName: p.companyName,
      nivelParceiro: p.nivelParceiro,
      commissionRate: p.commissionRate,
      maxAutoDiscountRate: p.maxAutoDiscountRate,
      pendingBalance: p.pendingBalance,
      availableBalance: p.availableBalance,
      totalEarned: p.totalEarned,
      pixKey: p.pixKey,
    })),
    clients,
  })
}

// POST: "Lançar Recebimento Comissionado" pelo Admin
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = manualCommissionSchema.parse(body)

    const partner = await prisma.partner.findUnique({
      where: { id: data.partnerId },
      include: { user: true },
    })

    if (!partner) {
      return NextResponse.json({ error: 'Parceiro não encontrado' }, { status: 404 })
    }

    // Calcula a taxa aplicável:
    // Nível 1 (INDICADOR): 15% (0.15)
    // Nível 2 (COMERCIAL_TREINADO): 20% (0.20), protegido no mínimo de 10% (0.10) se houver cessão de desconto
    let rate = data.customRate ?? partner.commissionRate

    if (!data.customRate) {
      if (partner.nivelParceiro === 'INDICADOR') {
        rate = 0.15
      } else if (partner.nivelParceiro === 'COMERCIAL_TREINADO') {
        const discountGiven = partner.maxAutoDiscountRate || 0
        rate = Math.max(0.10, 0.20 - discountGiven)
      }
    }

    const commissionAmount = Number((data.grossAmount * rate).toFixed(2))
    const paymentDate = new Date(data.paymentDate)
    
    // Regra dos 30 dias de retenção
    const releaseDate = new Date(paymentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    const isAlreadyReleased = releaseDate <= new Date()
    const initialStatus = isAlreadyReleased ? 'LIBERADO' : 'EM_RETENCAO_30_DIAS'

    const commission = await prisma.commission.create({
      data: {
        partnerId: partner.id,
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        serviceName: data.serviceName,
        grossAmount: data.grossAmount,
        paymentDate,
        releaseDate,
        amount: commissionAmount,
        rate,
        status: initialStatus,
        notes: data.notes || `Lançamento manual pelo Admin (${admin.email})`,
      },
    })

    // Atualiza saldos do parceiro
    if (initialStatus === 'EM_RETENCAO_30_DIAS') {
      await prisma.partner.update({
        where: { id: partner.id },
        data: {
          pendingBalance: { increment: commissionAmount },
          totalEarned: { increment: commissionAmount },
        },
      })
    } else {
      await prisma.partner.update({
        where: { id: partner.id },
        data: {
          availableBalance: { increment: commissionAmount },
          totalEarned: { increment: commissionAmount },
        },
      })
    }

    return NextResponse.json({
      success: true,
      commission,
      message: `Recebimento de R$ ${data.grossAmount.toFixed(2)} lançado com sucesso! Comissão de R$ ${commissionAmount.toFixed(2)} registrada em retenção até ${releaseDate.toLocaleDateString('pt-BR')}.`,
    })
  } catch (error) {
    console.error('Erro ao lançar comissão manual:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Falha ao lançar comissão' }, { status: 500 })
  }
}
