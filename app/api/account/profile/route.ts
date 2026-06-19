import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  ACCOUNT_COOKIE_NAME,
  createAccountSessionToken,
  getAccountSession,
  hashUserPassword,
} from '@/lib/account-auth'

const profileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).max(32).optional(),
  newPassword: z.string().min(8).max(120).optional(),
})

export async function PATCH(request: NextRequest) {
  const session = await getAccountSession()
  if (!session?.email) {
    return NextResponse.json({ error: 'Sessao nao encontrada' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = profileSchema.parse(body)

    if (!parsed.name && !parsed.email && !parsed.phone && !parsed.newPassword) {
      return NextResponse.json({ error: 'Nenhuma alteracao informada' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.email } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 })
    }

    const nextEmail = parsed.email?.trim().toLowerCase()
    if (nextEmail && nextEmail !== user.email) {
      const alreadyExists = await prisma.user.findUnique({ where: { email: nextEmail } })
      if (alreadyExists) {
        return NextResponse.json({ error: 'Este e-mail ja esta em uso' }, { status: 409 })
      }
    }

    const updateData: {
      name?: string
      email?: string
      phone?: string
      passwordHash?: string
    } = {}

    if (parsed.name) updateData.name = parsed.name.trim()
    if (nextEmail) updateData.email = nextEmail
    if (parsed.phone) updateData.phone = parsed.phone.trim()
    if (parsed.newPassword) {
      updateData.passwordHash = await hashUserPassword(parsed.newPassword)
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    const response = NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    })

    const emailChanged = nextEmail && nextEmail !== session.email
    if (emailChanged) {
      const token = createAccountSessionToken(
        updatedUser.email,
        session.roles,
        session.selectedRole,
      )
      response.cookies.set(ACCOUNT_COOKIE_NAME, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 7 * 24 * 60 * 60,
      })
    }

    return response
  } catch {
    return NextResponse.json({ error: 'Falha ao atualizar perfil' }, { status: 400 })
  }
}
