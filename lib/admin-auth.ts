import crypto from 'crypto'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'ssantana_admin_session'

function getSecret() {
  return process.env.ADMIN_AUTH_SECRET || 'change-me-admin-secret'
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function stripOptionalBrDomain(email: string) {
  return normalizeEmail(email).replace(/\.br$/, '')
}

export function verifyAdminCredentials(email: string, password: string) {
  const allowedEmail = normalizeEmail(process.env.ADMIN_EMAIL || '')
  const allowedPassword = process.env.ADMIN_PASSWORD || ''

  if (!allowedEmail || !allowedPassword) {
    return false
  }

  const providedEmail = normalizeEmail(email)
  const directMatch = providedEmail === allowedEmail
  const fallbackDomainMatch = stripOptionalBrDomain(providedEmail) === stripOptionalBrDomain(allowedEmail)

  return (directMatch || fallbackDomainMatch) && password === allowedPassword
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function createAdminSessionToken(email: string) {
  const issuedAt = Date.now().toString()
  const payload = `${email.toLowerCase()}|${issuedAt}`
  const signature = signPayload(payload)
  return Buffer.from(`${payload}|${signature}`).toString('base64url')
}

export function parseAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null
  }

  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8')
    const [email, issuedAt, signature] = raw.split('|')
    if (!email || !issuedAt || !signature) {
      return null
    }

    const expected = signPayload(`${email}|${issuedAt}`)
    if (expected !== signature) {
      return null
    }

    const maxAgeMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - Number(issuedAt) > maxAgeMs) {
      return null
    }

    return { email }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  return parseAdminSessionToken(token)
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE
