import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  ACCOUNT_COOKIE_NAME,
  createAccountSessionToken,
  getAccountSession,
} from '@/lib/account-auth'

const profileSchema = z
  .object({
    selectedRole: z.enum(['CLIENT', 'PARTNER']).optional(),
    role: z.enum(['CLIENT', 'PARTNER']).optional(),
  })
  .refine((data) => !!(data.selectedRole || data.role), {
    message: 'Perfil obrigatorio',
  })

export async function POST(request: NextRequest) {
  const session = await getAccountSession()
  if (!session) {
    return NextResponse.json({ error: 'Sessao nao encontrada' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = profileSchema.parse(body)
    const role = parsed.selectedRole ?? parsed.role

    if (!role) {
      return NextResponse.json({ error: 'Perfil obrigatorio' }, { status: 422 })
    }

    if (!session.roles.includes(role)) {
      return NextResponse.json({ error: 'Perfil nao permitido para este usuario' }, { status: 403 })
    }

    const token = createAccountSessionToken(session.email, session.roles, role)
    const response = NextResponse.json({
      success: true,
      role,
      redirectTo: role === 'PARTNER' ? '/dashboard/partner' : '/dashboard/client',
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
    return NextResponse.json({ error: 'Falha ao selecionar perfil' }, { status: 400 })
  }
}
