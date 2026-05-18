'use client'

import { useEffect, useState } from 'react'
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_REJECTED,
} from '@/lib/referral-tracking'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored !== COOKIE_CONSENT_ACCEPTED) {
      setVisible(true)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-100 shadow-2xl sm:p-5">
        <p className="text-sm font-semibold text-cyan-200">Uso de Cookies e Dados de Indicacao</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Usamos cookies e armazenamento temporario para manter codigos de indicacao, aplicar cupom de parceiro,
          garantir atribuicao comercial e registrar eventos de prospeccao. Ao aceitar, voce concorda com esse uso
          para atendimento prioritario, analytics e responsabilidade contratual.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_REJECTED)
              setVisible(false)
              window.location.href = 'https://www.google.com.br'
            }}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Recusar e sair
          </button>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED)
              window.localStorage.setItem('ssantana_cookie_consent_accepted_at', new Date().toISOString())
              setVisible(false)
            }}
            className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-200"
          >
            Aceitar e continuar
          </button>
        </div>
      </div>
    </div>
  )
}
