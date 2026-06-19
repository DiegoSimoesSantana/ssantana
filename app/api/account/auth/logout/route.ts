import { NextResponse } from 'next/server'
import { ACCOUNT_COOKIE_NAME } from '@/lib/account-auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ACCOUNT_COOKIE_NAME, '', {
    path: '/',
    maxAge: 0,
  })
  return response
}
