import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { z } from 'zod'

const rejectSchema = z.object({
  projectId: z.string(),
  reason: z.string().min(10, 'Motivo deve ter pelo menos 10 caracteres'),
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
    const { projectId, reason } = rejectSchema.parse(body)

    // Atualizar projeto
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'CANCELLED',
        approvalNotes: reason,
      },
      include: {
        client: true,
      },
    })

    // Criar notificação para o cliente
    await prisma.notification.create({
      data: {
        userId: project.clientId,
        type: 'project',
        title: 'Projeto Não Aprovado',
        message: `Infelizmente não podemos prosseguir com "${project.title}". Motivo: ${reason}`,
        actionUrl: `/dashboard/client/projects/${project.id}`,
      },
    })

    // TODO: Enviar email para o cliente com o motivo

    return NextResponse.json({ 
      success: true, 
      project,
      message: 'Projeto rejeitado' 
    })
  } catch (error) {
    console.error('Erro ao rejeitar projeto:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao rejeitar projeto' },
      { status: 500 }
    )
  }
}
