import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { z } from 'zod'

const approveSchema = z.object({
  projectId: z.string(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin
    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const body = await request.json()
    const { projectId, notes } = approveSchema.parse(body)

    // Atualizar projeto
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        approvedByAdmin: true,
        approvedAt: new Date(),
        approvalNotes: notes,
        status: 'AWAITING_SIGNATURE',
      },
      include: {
        client: true,
      },
    })

    // Criar contrato (rascunho)
    const contract = await prisma.contract.create({
      data: {
        projectId: project.id,
        clientId: project.clientId,
        totalValue: project.totalValue,
        status: 'DRAFT',
        template: project.includesSourceCode ? 'source_code' : 'standard',
        content: {
          projectTitle: project.title,
          projectDescription: project.description,
          estimatedHours: project.estimatedHours,
          hourlyRate: project.hourlyRate,
          deliveryDays: project.deliveryDays,
        },
        clauses: {
          cancellationPolicy: true,
          sourceCodeRights: project.includesSourceCode,
          aiUsageDisclosure: true,
        },
        paymentSchedule: {
          installments: 1,
          firstPaymentDate: new Date(),
        },
        includesSourceCode: project.includesSourceCode,
      },
    })

    // Criar notificação para o cliente
    await prisma.notification.create({
      data: {
        userId: project.clientId,
        type: 'project',
        title: 'Projeto Aprovado!',
        message: `Seu projeto "${project.title}" foi aprovado! O contrato será enviado em breve.`,
        actionUrl: `/dashboard/client/projects/${project.id}`,
      },
    })

    // TODO: Enviar email para o cliente
    // TODO: Gerar PDF do contrato
    // TODO: Enviar para plataforma de assinatura digital

    return NextResponse.json({ 
      success: true, 
      project,
      contract,
      message: 'Projeto aprovado com sucesso! Contrato criado.' 
    })
  } catch (error) {
    console.error('Erro ao aprovar projeto:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao aprovar projeto' },
      { status: 500 }
    )
  }
}
