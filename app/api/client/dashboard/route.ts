import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ACCOUNT_COOKIE_NAME, parseAccountSessionToken } from '@/lib/account-auth'
import { z } from 'zod'

const alteracaoSchema = z.object({
  tipo: z.enum(['ADICIONAR_EMAIL', 'UPGRADE_PLANO', 'OUTRO']),
  descricao: z.string().min(5),
  quantidade: z.number().int().min(1).default(1),
})

async function getClientFromSession(request: NextRequest) {
  const token = request.cookies.get(ACCOUNT_COOKIE_NAME)?.value
  const session = parseAccountSessionToken(token)

  let email = session?.selectedRole === 'CLIENT' ? session.email : null

  // 1. Se não houver sessão ativa, tenta buscar por ticket / contractNumber
  const ticket = request.nextUrl.searchParams.get('ticket')
  const emailParam = request.nextUrl.searchParams.get('email')

  if (!email && ticket) {
    const contract = await prisma.contract.findFirst({
      where: {
        OR: [
          { contractNumber: ticket },
          { id: ticket },
        ],
      },
      include: {
        client: true,
      },
    })
    if (contract?.client?.email) {
      email = contract.client.email
    }
  }

  // 2. Se ainda não achou, tenta pelo cookie de perfil salvo no checkout
  if (!email) {
    const profileCookie = request.cookies.get('ssantana_client_profile')?.value
    if (profileCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(profileCookie))
        if (parsed.email) {
          email = parsed.email.toLowerCase()
        }
      } catch {}
    }
  }

  // 3. Fallback para e-mail na URL
  if (!email && emailParam) {
    email = emailParam.toLowerCase()
  }

  if (!email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      projects: {
        include: {
          contract: true,
          payments: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return user
}

// GET: Retorna dados do cliente, contratos, faturas PicPay, cronômetro e detalhes de reunião
export async function GET(request: NextRequest) {
  const user = await getClientFromSession(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    projects: user.projects.map((p) => {
      // Cálculo do cronômetro de implantação / prazo
      const startDate = p.startDate || p.createdAt
      const deadlineDate = p.creditExpiryDate || new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const remainingDays = Math.max(0, Math.ceil((new Date(deadlineDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status,
        totalValue: p.totalValue,
        startDate,
        deadlineDate,
        remainingDays,
        // Informações de Reunião, Atendimento e Créditos
        serviceCredits: p.serviceCredits ?? 1,
        serviceCreditsUsed: p.serviceCreditsUsed ?? 0,
        creditExpiryDate: p.creditExpiryDate || deadlineDate,
        meetingDate: p.meetingDate,
        meetingUrl: p.meetingUrl,
        meetingNotes: p.meetingNotes,
        serviceReport: p.serviceReport,
        completedAt: p.completedAt,
        contract: p.contract ? {
          id: p.contract.id,
          contractNumber: p.contract.contractNumber,
          status: p.contract.status,
          signedAt: p.contract.signedAt,
          pdfUrl: p.contract.pdfUrl,
        } : null,
        payments: p.payments,
      }
    }),
  })
}

// POST: Registrar solicitação de alteração (ex: adicionar conta de e-mail por R$ 15/mês)
export async function POST(request: NextRequest) {
  try {
    const user = await getClientFromSession(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = alteracaoSchema.parse(body)

    let estimatedMonthlyCost = 0
    if (data.tipo === 'ADICIONAR_EMAIL') {
      estimatedMonthlyCost = data.quantidade * 15 // R$ 15/mês por e-mail corporativo adicional
    }

    // Criar notificação para o Admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          type: 'client_request',
          title: `Solicitação do Cliente: ${user.name}`,
          message: `Tipo: ${data.tipo} (${data.quantidade}x). Descrição: ${data.descricao}. Custo estimado: R$ ${estimatedMonthlyCost.toFixed(2)}/mês.`,
          actionUrl: '/admin/dashboard',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Solicitação registrada com sucesso! Custo estimado: R$ ${estimatedMonthlyCost.toFixed(2)}/mês. Nossa equipe técnica entrará em contato.`,
    })
  } catch (error) {
    console.error('Erro ao processar solicitação do cliente:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Falha ao registrar solicitação' }, { status: 500 })
  }
}
