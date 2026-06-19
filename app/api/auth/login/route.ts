import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  ACCOUNT_COOKIE_NAME,
  createAccountSessionToken,
  verifyUserPassword,
  verifyAccountPassword,
} from '@/lib/account-auth'
import { verifyAdminCredentials, ADMIN_COOKIE_NAME, createAdminSessionToken } from '@/lib/admin-auth'

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

type DashboardProfile = 'ADMIN' | 'CLIENT' | 'PARTNER'

function resolveOwnerAdminEmails() {
  const configured = process.env.ADMIN_OWNER_EMAILS || 'diegosimoessantana@gmail.com'
  return configured
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const normalizedEmail = email.toLowerCase().trim()

    const adminAccessByEnv = verifyAdminCredentials(normalizedEmail, password)

    // Tenta login account no mesmo fluxo para permitir seleção entre dashboards
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { partnerProfile: { select: { id: true } } },
    })

    let accountAccess = false
    let accountProfiles: Array<'CLIENT' | 'PARTNER'> = []

    if (user) {
      const validUserPassword = await verifyUserPassword(password, user.passwordHash)
      const validEnvPassword = !user.passwordHash && verifyAccountPassword(password)

      if (validUserPassword || validEnvPassword) {
        accountAccess = true
        accountProfiles = detectProfiles({
          role: user.role,
          hasPartner: !!user.partnerProfile,
        })
      }
    }

    const ownerEmails = resolveOwnerAdminEmails()
    const hasOwnerEmailOverride = accountAccess && ownerEmails.includes(normalizedEmail)
    const hasDbAdminRole = accountAccess && user?.role === 'ADMIN'
    const adminAccess = adminAccessByEnv || hasDbAdminRole || hasOwnerEmailOverride

    if (!adminAccess && !accountAccess) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 })
    }

    const profiles: DashboardProfile[] = []
    if (adminAccess) {
      profiles.push('ADMIN')
    }
    if (accountAccess) {
      profiles.push(...accountProfiles)
    }

    if (profiles.length === 0) {
      return NextResponse.json({ error: 'Usuário sem perfil de acesso' }, { status: 403 })
    }

    const selectedRole: DashboardProfile | undefined = profiles.length === 1 ? profiles[0] : undefined
    const redirectTo =
      selectedRole === 'ADMIN'
        ? '/admin/dashboard'
        : selectedRole === 'PARTNER'
          ? '/dashboard/partner'
          : selectedRole === 'CLIENT'
            ? '/dashboard/client'
            : null

    const response = NextResponse.json({
      success: true,
      type: profiles.length > 1 ? 'multi' : selectedRole === 'ADMIN' ? 'admin' : 'account',
      email: normalizedEmail,
      profiles,
      selectedRole: selectedRole || null,
      requiresProfileSelection: profiles.length > 1,
      redirectTo,
    })

    if (adminAccess) {
      const adminToken = createAdminSessionToken(normalizedEmail)
      response.cookies.set(ADMIN_COOKIE_NAME, adminToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 24 * 60 * 60,
      })
    }

    if (accountAccess) {
      const selectedAccountRole = selectedRole === 'CLIENT' || selectedRole === 'PARTNER' ? selectedRole : undefined
      const accountToken = createAccountSessionToken(normalizedEmail, accountProfiles, selectedAccountRole)
      response.cookies.set(ACCOUNT_COOKIE_NAME, accountToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 7 * 24 * 60 * 60,
      })
    }

    return response
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 422 })
    }
    return NextResponse.json({ error: 'Falha no login' }, { status: 500 })
  }
}
