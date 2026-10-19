import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // 1. Buscar todos os agendamentos com detalhes do cliente e projeto
    const schedules = await prisma.meetingSchedule.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            serviceCredits: true,
            creditExpiryDate: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 100,
    })

    // 2. Buscar clientes com serviços ativos e calcular cota mensal
    const clientsWithProjects = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        projects: {
          some: {
            status: { in: ['IN_PROGRESS', 'ANALYSIS', 'REVIEW'] },
            OR: [
              { creditExpiryDate: null },
              { creditExpiryDate: { gte: now } },
            ],
          },
        },
      },
      include: {
        projects: {
          where: {
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
          },
        },
        meetingSchedules: {
          where: {
            scheduledAt: { gte: startOfMonth, lte: endOfMonth },
            status: { in: ['VALID', 'CONFIRMED', 'COMPLETED', 'PAID_IN_MEETING'] },
          },
          select: {
            id: true,
            durationMinutes: true,
            status: true,
          },
        },
      },
    })

    const clientSummaries = (clientsWithProjects as any[]).map((c) => {
      const totalAllowanceMinutes = (c.projects || []).reduce((acc: number, p: any) => acc + (p.monthlyMeetingMinutes || 30), 0)
      const minutesUsedThisMonth = (c.meetingSchedules || []).reduce((acc: number, m: any) => acc + (m.durationMinutes || 30), 0)
      const minutesRemaining = Math.max(0, totalAllowanceMinutes - minutesUsedThisMonth)

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        activeProjectsCount: c.projects.length,
        projects: c.projects,
        monthlyAllowanceMinutes: totalAllowanceMinutes,
        minutesUsedThisMonth,
        minutesRemaining,
        hasFreeMinutesAvailable: minutesRemaining > 0,
      }
    })

    // Estatísticas gerais
    const totalActiveClients = clientSummaries.length
    const totalScheduled = schedules.filter((s) => s.status === 'SCHEDULED' || s.status === 'VALID').length
    const totalPendingPayment = schedules.filter((s) => s.status === 'PENDING_PAYMENT').length
    const totalCompleted = schedules.filter((s) => s.status === 'COMPLETED').length

    return NextResponse.json({
      stats: {
        totalActiveClients,
        totalScheduled,
        totalPendingPayment,
        totalCompleted,
      },
      schedules,
      clientSummaries,
    })
  } catch (error: any) {
    console.error('[Admin Agendamentos GET Error]', error)
    return NextResponse.json({ error: error.message || 'Erro ao carregar agendamentos' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      scheduleId,
      status,
      meetingUrl,
      scheduledAt,
      notes,
      serviceReport,
      generatePaymentLink,
      amount,
    } = body

    if (!scheduleId) {
      return NextResponse.json({ error: 'scheduleId é obrigatório' }, { status: 400 })
    }

    const currentSchedule = await prisma.meetingSchedule.findUnique({
      where: { id: scheduleId },
      include: { client: true },
    })

    if (!currentSchedule) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    const updateData: any = {}

    if (status !== undefined) updateData.status = status
    if (meetingUrl !== undefined) updateData.meetingUrl = meetingUrl
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt)
    if (notes !== undefined) updateData.notes = notes
    if (serviceReport !== undefined) updateData.serviceReport = serviceReport

    if (status === 'PAID_IN_MEETING' || status === 'COMPLETED') {
      updateData.paidAt = updateData.paidAt || new Date()
    }

    // Se o Admin solicitou gerar cobrança PicPay sob demanda
    let newPaymentUrl = currentSchedule.paymentUrl
    if (generatePaymentLink) {
      const chargeAmount = Number(amount) || currentSchedule.amountDue || 50.00
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://ssantana.com.br'
      const client = currentSchedule.client

      const nameParts = (client?.name || 'Cliente').trim().split(' ')
      const firstName = nameParts[0] || 'Cliente'
      const lastName = nameParts.slice(1).join(' ') || 'SSantana'

      const picpayOrder = await picpay.createPayment({
        referenceId: 'MEET-' + Date.now().toString().slice(-8),
        title: 'Sessão Técnica / Suporte (30 Min)',
        description: `Atendimento técnico agendado - ${currentSchedule.title}`,
        callbackUrl: `${baseUrl}/api/webhooks/picpay`,
        returnUrl: `${baseUrl}/painel`,
        value: chargeAmount,
        buyer: {
          firstName,
          lastName,
          document: '00000000000',
          email: client?.email || 'contato@ssantana.com.br',
          phone: client?.phone || '71988068222',
        },
      })

      updateData.paymentUrl = picpayOrder.paymentUrl
      updateData.paymentLinkId = picpayOrder.paymentLinkId
      updateData.amountDue = chargeAmount
      updateData.paymentRequired = true
      newPaymentUrl = picpayOrder.paymentUrl
    }

    const updated = await prisma.meetingSchedule.update({
      where: { id: scheduleId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      schedule: updated,
      paymentUrl: newPaymentUrl,
      message: 'Agendamento atualizado com sucesso!',
    })
  } catch (error: any) {
    console.error('[Admin Agendamentos PATCH Error]', error)
    return NextResponse.json({ error: error.message || 'Erro ao atualizar agendamento' }, { status: 500 })
  }
}
