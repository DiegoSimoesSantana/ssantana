import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { z } from 'zod'

const updateAtendimentoSchema = z.object({
  projectId: z.string().min(1, 'ID do projeto é obrigatório'),
  meetingDate: z.string().nullable().optional(),
  meetingUrl: z.string().nullable().optional(),
  meetingNotes: z.string().nullable().optional(),
  serviceCredits: z.number().int().min(0).optional(),
  creditExpiryDate: z.string().nullable().optional(),
  serviceReport: z.string().nullable().optional(),
  status: z.enum(['ANALYSIS', 'AWAITING_PAYMENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  markCompleted: z.boolean().optional(),
})

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: { id: true, name: true, email: true, phone: true },
        },
        contract: {
          select: { id: true, contractNumber: true, status: true, signedAt: true },
        },
        payments: {
          select: { id: true, amount: true, status: true, method: true, paidAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({ projects })
  } catch (error: any) {
    console.error('[Admin Atendimentos GET Error]', error)
    return NextResponse.json({ error: 'Erro ao listar atendimentos' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = updateAtendimentoSchema.parse(body)

    const updateData: Record<string, any> = {}

    if (parsed.meetingDate !== undefined) {
      updateData.meetingDate = parsed.meetingDate ? new Date(parsed.meetingDate) : null
    }

    if (parsed.meetingUrl !== undefined) {
      updateData.meetingUrl = parsed.meetingUrl?.trim() || null
    }

    if (parsed.meetingNotes !== undefined) {
      updateData.meetingNotes = parsed.meetingNotes?.trim() || null
    }

    if (parsed.serviceCredits !== undefined) {
      updateData.serviceCredits = parsed.serviceCredits
    }

    if (parsed.creditExpiryDate !== undefined) {
      updateData.creditExpiryDate = parsed.creditExpiryDate ? new Date(parsed.creditExpiryDate) : null
    }

    if (parsed.serviceReport !== undefined) {
      updateData.serviceReport = parsed.serviceReport?.trim() || null
    }

    if (parsed.markCompleted) {
      updateData.status = 'COMPLETED'
      updateData.completedAt = new Date()
      updateData.serviceCreditsUsed = 1
    } else if (parsed.status) {
      updateData.status = parsed.status
      if (parsed.status === 'COMPLETED') {
        updateData.completedAt = new Date()
        updateData.serviceCreditsUsed = 1
      }
    }

    const updated = await prisma.project.update({
      where: { id: parsed.projectId },
      data: updateData,
      include: {
        client: true,
        contract: true,
        payments: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: parsed.markCompleted
        ? 'Serviço marcado como concluído com sucesso!'
        : 'Detalhes do atendimento atualizados com sucesso.',
      project: updated,
    })
  } catch (error: any) {
    console.error('[Admin Atendimentos PATCH Error]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Dados inválidos' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar atendimento' }, { status: 500 })
  }
}
