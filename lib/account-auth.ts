import crypto from 'crypto'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const ACCOUNT_COOKIE = 'ssantana_account_session'

type AccountRole = 'CLIENT' | 'PARTNER'

type AccountPayload = {
  email: string
  roles: AccountRole[]
  selectedRole?: AccountRole
  issuedAt: string
}

function getSecret() {
  return process.env.ACCOUNT_AUTH_SECRET || process.env.ADMIN_AUTH_SECRET || 'change-me-account-secret'
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

// Fallback: verifica contra a senha de ambiente (usuários sem passwordHash individual)
export function verifyAccountPassword(password: string) {
  const configuredPassword = process.env.ACCOUNT_AUTH_PASSWORD || process.env.ADMIN_PASSWORD || ''
  return configuredPassword.length >= 8 && password === configuredPassword
}

// Verifica a senha bcrypt individual do usuário no banco
export async function verifyUserPassword(password: string, passwordHash: string | null | undefined): Promise<boolean> {
  if (!passwordHash) return false
  return bcrypt.compare(password, passwordHash)
}

// Gera hash bcrypt para armazenar no banco
export async function hashUserPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function createAccountSessionToken(email: string, roles: AccountRole[], selectedRole?: AccountRole) {
  const issuedAt = Date.now().toString()
  const uniqueRoles = Array.from(new Set(roles))
  const payload = `${email.toLowerCase()}|${uniqueRoles.join(',')}|${selectedRole || ''}|${issuedAt}`
  const signature = signPayload(payload)
  return Buffer.from(`${payload}|${signature}`).toString('base64url')
}

export function parseAccountSessionToken(token: string | undefined) {
  if (!token) return null

  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8')
    const [email, rolesRaw, selectedRoleRaw, issuedAt, signature] = raw.split('|')
    if (!email || !rolesRaw || !issuedAt || !signature) {
      return null
    }

    const payload = `${email}|${rolesRaw}|${selectedRoleRaw || ''}|${issuedAt}`
    const expected = signPayload(payload)
    if (expected !== signature) {
      return null
    }

    const maxAgeMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - Number(issuedAt) > maxAgeMs) {
      return null
    }

    const roles = rolesRaw
      .split(',')
      .map((role) => role.trim())
      .filter((role): role is AccountRole => role === 'CLIENT' || role === 'PARTNER')

    const selectedRole = selectedRoleRaw === 'CLIENT' || selectedRoleRaw === 'PARTNER' ? selectedRoleRaw : undefined

    return {
      email: email.toLowerCase(),
      roles,
      selectedRole,
      issuedAt,
    } satisfies AccountPayload
  } catch {
    return null
  }
}

export async function getAccountSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCOUNT_COOKIE)?.value
  return parseAccountSessionToken(token)
}

export const ACCOUNT_COOKIE_NAME = ACCOUNT_COOKIE
