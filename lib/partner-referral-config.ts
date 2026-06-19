import { Prisma } from '@prisma/client'

export type PixKeyType = 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'RANDOM'

export type PartnerReferralConfig = {
  pixKeyType?: PixKeyType
  autoDiscountRate?: number
}

const DEFAULT_AUTO_DISCOUNT_RATE = 0

function asObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
}

function toRate(value: unknown): number {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return DEFAULT_AUTO_DISCOUNT_RATE
  }

  return Math.min(Math.max(numeric, 0), 1)
}

function toPixType(value: unknown): PixKeyType | undefined {
  if (
    value === 'CPF' ||
    value === 'CNPJ' ||
    value === 'PHONE' ||
    value === 'EMAIL' ||
    value === 'RANDOM'
  ) {
    return value
  }

  return undefined
}

export function getPartnerReferralConfig(bankAccount: unknown): PartnerReferralConfig {
  const data = asObject(bankAccount)

  return {
    pixKeyType: toPixType(data.pixKeyType),
    autoDiscountRate: toRate(data.autoDiscountRate),
  }
}

export function mergePartnerReferralConfig(
  bankAccount: unknown,
  updates: PartnerReferralConfig,
): Prisma.InputJsonValue {
  const data = asObject(bankAccount)

  const next: Record<string, unknown> = {
    ...data,
  }

  if (updates.pixKeyType) {
    next.pixKeyType = updates.pixKeyType
  }

  if (typeof updates.autoDiscountRate === 'number') {
    next.autoDiscountRate = Math.min(Math.max(updates.autoDiscountRate, 0), 1)
  }

  return next as Prisma.InputJsonValue
}

export const MIN_PARTNER_COMMISSION_RATE = 0.1
export const MAX_PARTNER_COMMISSION_RATE = 0.2
