import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const [partners, clients, leads] = await Promise.all([
    prisma.partner.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        _count: { select: { leads: true, trackingEvents: true, referrals: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.lead.findMany({
      include: {
        partner: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
  ])

  return NextResponse.json({ partners, clients, leads })
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { entity, id, data } = body as {
    entity: 'partner' | 'client' | 'lead'
    id: string
    data: Record<string, unknown>
  }

  if (entity === 'partner') {
    const updated = await prisma.partner.update({ where: { id }, data: data as any })
    return NextResponse.json({ success: true, updated })
  }

  if (entity === 'client') {
    const updated = await prisma.user.update({ where: { id }, data: data as any })
    return NextResponse.json({ success: true, updated })
  }

  const updated = await prisma.lead.update({ where: { id }, data: data as any })
  return NextResponse.json({ success: true, updated })
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const entity = searchParams.get('entity') as 'partner' | 'client' | 'lead'
  const id = searchParams.get('id')
  if (!entity || !id) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  if (entity === 'partner') {
    await prisma.partner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  }

  if (entity === 'client') {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  }

  await prisma.lead.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
