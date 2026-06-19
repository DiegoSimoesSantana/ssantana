'use client'

import { useEffect, useState } from 'react'
import { Crown, X } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  buildReferralCookieValue,
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_KEY,
  normalizeReferralCode,
  parseReferralCookieValue,
  type ReferralAttribution,
  REFERRAL_BANNER_DISMISSED_PREFIX,
  REFERRAL_COOKIE_KEY,
  REFERRAL_RETURN_TRACKED_PREFIX,
  REFERRAL_SESSION_KEY,
  REFERRAL_STORAGE_KEY,
  REFERRAL_TTL_DAYS,
  REFERRAL_VISITOR_KEY,
} from '@/lib/referral-tracking'

function ensurePersistentKey(key: string) {
  const current = window.localStorage.getItem(key)
  if (current) {
    return current
  }

  const generated = crypto.randomUUID()
  window.localStorage.setItem(key, generated)
  return generated
}

function ensureSessionKey() {
  const current = window.sessionStorage.getItem(REFERRAL_SESSION_KEY)
  if (current) {
    return current
  }

  const generated = crypto.randomUUID()
  window.sessionStorage.setItem(REFERRAL_SESSION_KEY, generated)
  return generated
}

function readStoredAttribution(): ReferralAttribution | null {
  const storageValue = window.localStorage.getItem(REFERRAL_STORAGE_KEY)

  if (storageValue) {
    try {
      return JSON.parse(storageValue) as ReferralAttribution
    } catch {
      window.localStorage.removeItem(REFERRAL_STORAGE_KEY)
    }
  }

  const cookieMatch = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${REFERRAL_COOKIE_KEY}=`))

  return parseReferralCookieValue(cookieMatch?.split('=').slice(1).join('='))
}

function persistAttribution(attribution: ReferralAttribution) {
  window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(attribution))
  document.cookie = `${REFERRAL_COOKIE_KEY}=${buildReferralCookieValue(attribution)}; path=/; max-age=${REFERRAL_TTL_DAYS * 24 * 60 * 60}; samesite=lax`
}

export default function ReferralAttributionManager() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [attribution, setAttribution] = useState<ReferralAttribution | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const consent = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (consent !== COOKIE_CONSENT_ACCEPTED) {
      return
    }

    const refFromQuery = searchParams.get('ref')
    const discountFromQuery = searchParams.get('d')
    const parsedDiscount = discountFromQuery ? Number(discountFromQuery) : undefined
    const partnerDiscountRate =
      typeof parsedDiscount === 'number' && Number.isFinite(parsedDiscount)
        ? Math.min(Math.max(parsedDiscount, 0), 1)
        : undefined
    const visitorKey = ensurePersistentKey(REFERRAL_VISITOR_KEY)
    const sessionKey = ensureSessionKey()
    const storedAttribution = readStoredAttribution()

    if (!refFromQuery && storedAttribution) {
      setAttribution(storedAttribution)

      const returnTrackingKey = `${REFERRAL_RETURN_TRACKED_PREFIX}:${sessionKey}`
      if (!window.sessionStorage.getItem(returnTrackingKey)) {
        window.sessionStorage.setItem(returnTrackingKey, '1')

        void fetch('/api/referrals/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refCode: storedAttribution.referralCode,
            visitorKey,
            sessionKey,
            landingPath: pathname,
            partnerDiscountRate: storedAttribution.partnerDiscountRate ?? undefined,
            source: 'stored',
          }),
        })
      }

      return
    }

    if (!refFromQuery) {
      return
    }

    const normalizedRefCode = normalizeReferralCode(refFromQuery)

    void fetch('/api/referrals/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refCode: normalizedRefCode,
        visitorKey,
        sessionKey,
        landingPath: pathname,
        partnerDiscountRate,
        source: 'query',
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Falha ao salvar indicação')
        }

        return response.json()
      })
      .then((data: { attribution: ReferralAttribution }) => {
        persistAttribution(data.attribution)
        setAttribution(data.attribution)
        setDismissed(false)
      })
      .catch(() => {
        const fallbackAttribution: ReferralAttribution = {
          referralCode: normalizedRefCode,
          partnerId: null,
          partnerName: null,
          capturedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          partnerDiscountRate: partnerDiscountRate ?? null,
          lastLandingPath: pathname,
        }

        persistAttribution(fallbackAttribution)
        setAttribution(fallbackAttribution)
        setDismissed(false)
      })
  }, [pathname, searchParams])

  useEffect(() => {
    if (!attribution) {
      return
    }

    const dismissalKey = `${REFERRAL_BANNER_DISMISSED_PREFIX}:${attribution.referralCode}`
    setDismissed(window.sessionStorage.getItem(dismissalKey) === '1')
  }, [attribution])

  if (!attribution || dismissed) {
    return null
  }

  const label = attribution.partnerName || `Parceiro ${attribution.referralCode}`

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] sm:left-auto sm:max-w-md">
      <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/95 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-cyan-400/15 p-2 text-cyan-200">
            <Crown className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">Indicação VIP ativa</p>
            <p className="mt-1 text-sm leading-6 text-slate-100">
              Identificamos que voce foi indicado por <strong>{label}</strong>. Seu cupom de indicacao foi ativado e os precos ja consideram desconto especial.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar aviso de indicação"
            className="text-slate-400 transition hover:text-white"
            onClick={() => {
              if (!attribution) {
                return
              }

              window.sessionStorage.setItem(
                `${REFERRAL_BANNER_DISMISSED_PREFIX}:${attribution.referralCode}`,
                '1',
              )
              setDismissed(true)
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
