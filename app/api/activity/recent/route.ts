import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Buscar atividades recentes de diferentes tipos
    const [recentLeads, recentProjects, recentPayments] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          serviceType: true,
          createdAt: true,
        },
      }),
      prisma.project.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          client: {
            select: { name: true },
          },
        },
      }),
      prisma.payment.findMany({
        where: { status: 'COMPLETED' },
        orderBy: { paidAt: 'desc' },
        take: 5,
        select: {
          id: true,
          amount: true,
          paidAt: true,
          project: {
            select: {
              title: true,
              client: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ])

    const activities = [
      ...recentLeads.map((lead) => ({
        id: lead.id,
        type: 'lead' as const,
        title: 'Novo Lead Capturado',
        description: `${lead.name} interessado em ${lead.serviceType}`,
        timestamp: lead.createdAt,
      })),
      ...recentProjects.map((project) => ({
        id: project.id,
        type: 'project' as const,
        title: `Projeto: ${project.title}`,
        description: `Status: ${project.status} - Cliente: ${project.client.name}`,
        timestamp: project.updatedAt,
      })),
      ...recentPayments.map((payment) => ({
        id: payment.id,
        type: 'payment' as const,
        title: 'Pagamento Recebido',
        description: `R$ ${payment.amount.toFixed(2)} - ${payment.project.title}`,
        timestamp: payment.paidAt || new Date(),
      })),
    ]

    // Ordenar por timestamp mais recente
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return NextResponse.json({ 
      activities: activities.slice(0, 10) 
    })
  } catch (error) {
    console.error('Erro ao buscar atividades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    )
  }
}
