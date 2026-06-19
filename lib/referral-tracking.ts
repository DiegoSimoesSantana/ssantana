export const REFERRAL_COOKIE_KEY = 'ssantana_partner_ref'
export const REFERRAL_STORAGE_KEY = 'ssantana_partner_ref'
export const REFERRAL_VISITOR_KEY = 'ssantana_partner_visitor'
export const REFERRAL_SESSION_KEY = 'ssantana_partner_session'
export const REFERRAL_RETURN_TRACKED_PREFIX = 'ssantana_partner_return_tracked'
export const REFERRAL_BANNER_DISMISSED_PREFIX = 'ssantana_partner_banner_dismissed'
export const REFERRAL_LANDING_PATH = '/indicacao-vip'
export const REFERRAL_TTL_DAYS = 90
export const COOKIE_CONSENT_KEY = 'ssantana_cookie_consent'
export const COOKIE_CONSENT_ACCEPTED = 'accepted'
export const COOKIE_CONSENT_REJECTED = 'rejected'

export type ReferralAttribution = {
  partnerId?: string | null
  partnerName?: string | null
  referralCode: string
  partnerDiscountRate?: number | null
  capturedAt: string
  updatedAt: string
  lastLandingPath?: string | null
}

export function buildReferralCookieValue(attribution: ReferralAttribution): string {
  return encodeURIComponent(JSON.stringify(attribution))
}

export function parseReferralCookieValue(value?: string | null): ReferralAttribution | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as ReferralAttribution
  } catch {
    return null
  }
}

export function normalizeReferralCode(value: string): string {
  return value.trim().toUpperCase()
}

export function buildReferralLandingPath(referralCode: string, partnerDiscountRate?: number): string {
  const params = new URLSearchParams({
    ref: normalizeReferralCode(referralCode),
  })

  if (typeof partnerDiscountRate === 'number' && Number.isFinite(partnerDiscountRate) && partnerDiscountRate > 0) {
    params.set('d', partnerDiscountRate.toFixed(4))
  }

  return `${REFERRAL_LANDING_PATH}?${params.toString()}`
}

export function buildReferralLandingUrl(origin: string, referralCode: string, partnerDiscountRate?: number): string {
  return `${origin.replace(/\/$/, '')}${buildReferralLandingPath(referralCode, partnerDiscountRate)}`
}

export function getFirstName(fullName?: string | null): string | null {
  if (!fullName) {
    return null
  }

  const first = fullName.trim().split(/\s+/)[0]
  return first || null
}
