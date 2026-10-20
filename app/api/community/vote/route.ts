import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ideaId } = body

    if (!ideaId) {
      return NextResponse.json({ success: false, error: 'ID do projeto não fornecido.' }, { status: 400 })
    }

    // Identificador único do votante por IP ou cabeçalhos
    const forwardedFor = req.headers.get('x-forwarded-for') || ''
    const ip = forwardedFor.split(',')[0].trim() || 'anon-client'
    const userAgent = req.headers.get('user-agent') || ''
    const voterIdentifier = `${ip}-${userAgent.slice(0, 40)}`

    // Verificar se já votou
    const existingVote = await prisma.communityProjectVote.findUnique({
      where: {
        ideaId_voterIdentifier: {
          ideaId,
          voterIdentifier,
        },
      },
    })

    if (existingVote) {
      return NextResponse.json(
        {
          success: false,
          alreadyVoted: true,
          message: 'Você já registrou seu voto neste projeto.',
        },
        { status: 400 }
      )
    }

    // Registrar voto e incrementar contador atomicamente
    await prisma.$transaction([
      prisma.communityProjectVote.create({
        data: {
          ideaId,
          voterIdentifier,
        },
      }),
      prisma.communityProjectIdea.update({
        where: { id: ideaId },
        data: { votesCount: { increment: 1 } },
      }),
    ])

    const updated = await prisma.communityProjectIdea.findUnique({
      where: { id: ideaId },
      select: { id: true, votesCount: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Voto computado com sucesso! Obrigado pelo apoio ao projeto.',
      votesCount: updated?.votesCount ?? 1,
    })
  } catch (error: any) {
    console.error('Erro ao registrar voto comunitário:', error)
    return NextResponse.json(
      { success: false, error: 'Falha ao registrar voto.' },
      { status: 500 }
    )
  }
}
