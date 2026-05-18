import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ADMIN_COOKIE_NAME, createAdminSessionToken, verifyAdminCredentials } from '@/lib/admin-auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = createAdminSessionToken(email)
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Falha no login admin' }, { status: 400 })
  }
}
