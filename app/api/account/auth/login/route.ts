import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  ACCOUNT_COOKIE_NAME,
  createAccountSessionToken,
  verifyAccountPassword,
  verifyUserPassword,
} from '@/lib/account-auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function detectProfiles(user: { role: 'CLIENT' | 'PARTNER' | 'ADMIN'; hasPartner: boolean }) {
  const profiles: Array<'CLIENT' | 'PARTNER'> = []

  if (user.role === 'CLIENT') {
    profiles.push('CLIENT')
  }

  if (user.role === 'PARTNER' || user.hasPartner) {
    profiles.push('PARTNER')
  }

  if (user.role === 'PARTNER' && !profiles.includes('CLIENT')) {
    profiles.push('CLIENT')
  }

  return Array.from(new Set(profiles))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { partnerProfile: { select: { id: true } } },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 })
    }

    // Verifica senha: individual (bcrypt) tem prioridade; fallback = senha de ambiente
    const validUserPassword = await verifyUserPassword(password, user.passwordHash)
    const validEnvPassword = !user.passwordHash && verifyAccountPassword(password)

    if (!validUserPassword && !validEnvPassword) {
      return NextResponse.json({ error: 'Senha invalida' }, { status: 401 })
    }

    const profiles = detectProfiles({
      role: user.role,
      hasPartner: !!user.partnerProfile,
    })

    if (profiles.length === 0) {
      return NextResponse.json({ error: 'Usuario sem perfil de acesso cliente/parceiro' }, { status: 403 })
    }

    const selectedRole = profiles.length === 1 ? profiles[0] : undefined
    const token = createAccountSessionToken(normalizedEmail, profiles, selectedRole)
    const response = NextResponse.json({
      success: true,
      email: normalizedEmail,
      profiles,
      selectedRole: selectedRole || null,
      requiresProfileSelection: profiles.length > 1,
      redirectTo: selectedRole ? (selectedRole === 'PARTNER' ? '/dashboard/partner' : '/dashboard/client') : '/sign-in',
    })

    response.cookies.set(ACCOUNT_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Falha no login de conta' }, { status: 400 })
  }
}
