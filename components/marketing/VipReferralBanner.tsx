'use client'

import { useEffect, useState } from 'react'
import { parseReferralCookieValue, REFERRAL_COOKIE_KEY, REFERRAL_STORAGE_KEY } from '@/lib/referral-tracking'
import { Sparkles, X } from 'lucide-react'

export default function VipReferralBanner() {
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    // 1. Tenta ler do LocalStorage
    try {
      const stored = window.localStorage.getItem(REFERRAL_STORAGE_KEY)
      if (stored) {
        const parsed = parseReferralCookieValue(stored)
        if (parsed?.partnerName) {
          setPartnerName(parsed.partnerName)
          return
        } else if (parsed?.referralCode) {
          setPartnerName(`Parceiro (${parsed.referralCode})`)
          return
        }
      }
    } catch {
      // ignore
    }

    // 2. Tenta ler dos cookies
    try {
      const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${REFERRAL_COOKIE_KEY}=`))
      if (match) {
        const val = match.split('=')[1]
        const parsed = parseReferralCookieValue(val)
        if (parsed?.partnerName) {
          setPartnerName(parsed.partnerName)
          return
        } else if (parsed?.referralCode) {
          setPartnerName(`Parceiro (${parsed.referralCode})`)
          return
        }
      }
    } catch {
      // ignore
    }
  }, [])

  if (!partnerName || closed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-md transition-all relative z-50">
      <div className="container mx-auto flex items-center justify-between gap-2 max-w-7xl">
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
          <p className="truncate">
            🤝 Indicação VIP ativa: Atendimento Prioritário e Descontos de Entrada Liberados! (Indicado por {partnerName})
          </p>
        </div>
        <button
          onClick={() => setClosed(true)}
          className="text-white/80 hover:text-white shrink-0 p-1 rounded transition"
          aria-label="Fechar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
