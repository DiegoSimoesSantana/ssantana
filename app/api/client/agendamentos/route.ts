import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'
import { z } from 'zod'

const bookSchema = z.object({
  scheduledAt: z.string().min(1, 'Data e horário são obrigatórios'),
  title: z.string().optional().default('Reunião Técnica / Alinhamento (30 Min)'),
  description: z.string().optional().default('Alinhamento e suporte técnico'),
  clientEmail: z.string().email().optional(),
  ticket: z.string().optional(),
})

// Identificar cliente por ticket, cookie ou query param
async function resolveClient(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const ticket = searchParams.get('ticket') || searchParams.get('referenceId')
  const emailParam = searchParams.get('email')

  let client = null

  if (ticket) {
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
    if (contract?.client) return contract.client
  }

  if (emailParam) {
    client = await prisma.user.findUnique({
      where: { email: emailParam.trim().toLowerCase() },
    })
    if (client) return client
  }

  // Tentar cookie do cliente
  const cookieHeader = req.headers.get('cookie') || ''
  const cookieMatch = cookieHeader.match(/ssantana_client_profile=([^;]+)/)
  if (cookieMatch) {
    try {
      const decoded = JSON.parse(decodeURIComponent(cookieMatch[1]))
      if (decoded.email) {
        client = await prisma.user.findUnique({
          where: { email: decoded.email.trim().toLowerCase() },
        })
        if (client) return client
      }
    } catch {
      // ignore
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const client = await resolveClient(request)

    if (!client) {
      return NextResponse.json({
        hasClient: false,
        hasActiveService: false,
        monthlyMinutesAllowed: 30,
        minutesUsedThisMonth: 0,
        isEligibleFreeMeeting: false,
        activeProjects: [],
        schedules: [],
      })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Buscar projetos/serviços ativos do cliente
    const activeProjects = await prisma.project.findMany({
      where: {
        clientId: client.id,
        status: { in: ['IN_PROGRESS', 'ANALYSIS', 'REVIEW'] },
        OR: [
          { creditExpiryDate: null },
          { creditExpiryDate: { gte: now } },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        serviceCredits: true,
        serviceCreditsUsed: true,
        creditExpiryDate: true,
        monthlyMeetingMinutes: true,
        createdAt: true,
      },
    })

    const hasActiveService = activeProjects.length > 0
    const monthlyMinutesAllowed = hasActiveService ? Math.max(30, activeProjects.reduce((acc, p) => acc + (p.monthlyMeetingMinutes || 30), 0)) : 0

    // Buscar reuniões do mês corrente
    const currentMonthSchedules = await prisma.meetingSchedule.findMany({
      where: {
        clientId: client.id,
        scheduledAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: { in: ['VALID', 'CONFIRMED', 'COMPLETED', 'PAID_IN_MEETING'] },
      },
    })

    const minutesUsedThisMonth = currentMonthSchedules.reduce((acc, s) => acc + (s.durationMinutes || 30), 0)
    const isEligibleFreeMeeting = hasActiveService && minutesUsedThisMonth < monthlyMinutesAllowed

    // Buscar todos os agendamentos do cliente
    const schedules = await prisma.meetingSchedule.findMany({
      where: { clientId: client.id },
      orderBy: { scheduledAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      hasClient: true,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      hasActiveService,
      monthlyMinutesAllowed,
      minutesUsedThisMonth,
      isEligibleFreeMeeting,
      activeProjects,
      schedules,
    })
  } catch (error: any) {
    console.error('[Client Agendamentos GET Error]', error)
    return NextResponse.json({ error: error.message || 'Erro ao consultar agendamentos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = bookSchema.parse(body)

    let client = await resolveClient(request)

    // Fallback: se o e-mail foi passado no body
    if (!client && parsed.clientEmail) {
      client = await prisma.user.findUnique({
        where: { email: parsed.clientEmail.trim().toLowerCase() },
      })
    }

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não identificado. Por favor acerte o formulário ou realize um login/contratação.' },
        { status: 400 }
      )
    }

    const scheduledDate = new Date(parsed.scheduledAt)
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Data de agendamento inválida.' }, { status: 400 })
    }

    const now = new Date()
    const startOfMonth = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), 1)
    const endOfMonth = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth() + 1, 0, 23, 59, 59)

    // Verificar se tem serviço ativo
    const activeProject = await prisma.project.findFirst({
      where: {
        clientId: client.id,
        status: { in: ['IN_PROGRESS', 'ANALYSIS', 'REVIEW'] },
        OR: [
          { creditExpiryDate: null },
          { creditExpiryDate: { gte: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    const hasActiveService = !!activeProject

    // Verificar uso de minutos no mês do agendamento
    const monthMeetings = await prisma.meetingSchedule.findMany({
      where: {
        clientId: client.id,
        scheduledAt: { gte: startOfMonth, lte: endOfMonth },
        status: { in: ['VALID', 'CONFIRMED', 'COMPLETED', 'PAID_IN_MEETING'] },
      },
    })

    const minutesUsed = monthMeetings.reduce((acc, m) => acc + (m.durationMinutes || 30), 0)
    const allowance = activeProject?.monthlyMeetingMinutes || 30
    const isMonthlyIncluded = hasActiveService && minutesUsed < allowance

    let meetingStatus = isMonthlyIncluded ? 'VALID' : 'PENDING_PAYMENT'
    let paymentRequired = !isMonthlyIncluded
    let amountDue = paymentRequired ? 50.00 : 0
    let paymentUrl = null
    let paymentLinkId = null

    // Se exigir pagamento, tentar gerar link no PicPay
    if (paymentRequired) {
      try {
        const nameParts = client.name.trim().split(' ')
        const firstName = nameParts[0] || 'Cliente'
        const lastName = nameParts.slice(1).join(' ') || 'SSantana'
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://ssantana.com.br'

        const picpayOrder = await picpay.createPayment({
          referenceId: 'MEET-' + Date.now().toString().slice(-8),
          title: 'Sessão Técnica / Suporte (30 Min)',
          description: `Atendimento em ${scheduledDate.toLocaleDateString('pt-BR')}`,
          callbackUrl: `${baseUrl}/api/webhooks/picpay`,
          returnUrl: `${baseUrl}/painel`,
          value: amountDue,
          buyer: {
            firstName,
            lastName,
            document: '00000000000',
            email: client.email,
            phone: client.phone || '71988068222',
          },
        })

        paymentUrl = picpayOrder.paymentUrl
        paymentLinkId = picpayOrder.paymentLinkId
      } catch (err) {
        console.warn('[Agendamento PicPay Generation Error]', err)
      }
    }

    const schedule = await prisma.meetingSchedule.create({
      data: {
        clientId: client.id,
        projectId: activeProject?.id || null,
        title: parsed.title,
        description: parsed.description,
        scheduledAt: scheduledDate,
        durationMinutes: 30,
        hasActiveService,
        isMonthlyIncluded,
        status: meetingStatus,
        paymentRequired,
        amountDue,
        paymentUrl,
        paymentLinkId,
        notes: isMonthlyIncluded
          ? 'Reunião inclusa no benefício mensal de serviço ativo (30 min/mês).'
          : 'Reunião avulsa / excedente. Pagamento pendente ou a ser acertado na própria reunião.',
      },
    })

    return NextResponse.json({
      success: true,
      schedule,
      isMonthlyIncluded,
      paymentRequired,
      paymentUrl,
      message: isMonthlyIncluded
        ? 'Reunião agendada com sucesso! Coberta pelo seu pacote de 30 min mensais.'
        : 'Reunião solicitada! Como não há créditos de serviço ativos neste mês, o pagamento de R$ 50,00 poderá ser realizado pelo link ou acertado na reunião.',
    })
  } catch (error: any) {
    console.error('[Client Agendamentos POST Error]', error)
    return NextResponse.json({ error: error.message || 'Erro ao processar agendamento' }, { status: 500 })
  }
}
