import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { hashUserPassword } from '@/lib/account-auth'

const patchSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('set_password'),
    password: z.string().min(8),
  }),
  z.object({
    action: z.literal('remove_password'),
  }),
  z.object({
    action: z.literal('update'),
    name: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    role: z.enum(['CLIENT', 'PARTNER']).optional(),
  }),
])

// PATCH /api/admin/users/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  try {
    const body = await request.json()
    const data = patchSchema.parse(body)

    if (data.action === 'set_password') {
      const passwordHash = await hashUserPassword(data.password)
      await prisma.user.update({ where: { id }, data: { passwordHash } })
      return NextResponse.json({ success: true, message: 'Senha definida com sucesso' })
    }

    if (data.action === 'remove_password') {
      await prisma.user.update({ where: { id }, data: { passwordHash: null } })
      return NextResponse.json({ success: true, message: 'Senha removida (usa senha de ambiente)' })
    }

    if (data.action === 'update') {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.phone && { phone: data.phone }),
          ...(data.role && { role: data.role }),
        },
        select: { id: true, name: true, email: true, role: true, phone: true },
      })
      return NextResponse.json({ success: true, user: updated })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.errors }, { status: 422 })
    }
    return NextResponse.json({ error: 'Falha ao atualizar usuário' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
