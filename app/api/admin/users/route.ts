import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { hashUserPassword } from '@/lib/account-auth'

// GET /api/admin/users — lista todos os usuários
export async function GET(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      passwordHash: true,
      createdAt: true,
      partnerProfile: { select: { id: true, companyName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      hasPassword: !!u.passwordHash,
      createdAt: u.createdAt,
      partner: u.partnerProfile ? { id: u.partnerProfile.id, companyName: u.partnerProfile.companyName } : null,
    }))
  )
}

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  role: z.enum(['CLIENT', 'PARTNER']).default('CLIENT'),
  password: z.string().min(8).optional(),
})

// POST /api/admin/users — cria novo usuário
export async function POST(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const data = createUserSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const passwordHash = data.password ? await hashUserPassword(data.password) : null

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        ...(passwordHash && { passwordHash }),
      },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.errors }, { status: 422 })
    }
    return NextResponse.json({ error: 'Falha ao criar usuário' }, { status: 500 })
  }
}
