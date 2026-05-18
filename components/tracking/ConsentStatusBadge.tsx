'use client'

import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_ACCEPTED, COOKIE_CONSENT_KEY } from '@/lib/referral-tracking'

export default function ConsentStatusBadge() {
  const [acceptedAt, setAcceptedAt] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const status = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    const date = window.localStorage.getItem('ssantana_cookie_consent_accepted_at') || ''
    if (status === COOKIE_CONSENT_ACCEPTED) {
      setVisible(true)
      setAcceptedAt(date)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
      <p>
        LGPD ativo. Autorizado em{' '}
        <strong>{acceptedAt ? new Date(acceptedAt).toLocaleString('pt-BR') : 'data indisponível'}</strong>
      </p>
      <button
        type="button"
        className="mt-1 rounded bg-red-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
        onClick={() => {
          const confirmed = window.confirm(
            'Revogar termo LGPD?\n\nSe você é cliente com serviços ativos, cancele os serviços na área do cliente antes de sair.\nSe você é parceiro, a revogação pode encerrar a parceria e bloquear repasses futuros.\n\nDeseja continuar?'
          )

          if (!confirmed) return

          window.localStorage.removeItem(COOKIE_CONSENT_KEY)
          window.localStorage.removeItem('ssantana_cookie_consent_accepted_at')
          window.localStorage.removeItem('ssantana_partner_ref')
          window.sessionStorage.clear()
          document.cookie = 'ssantana_partner_ref=; path=/; max-age=0; samesite=lax'
          alert('Termo revogado. Você será redirecionado para saída segura.')
          window.location.href = 'https://www.google.com.br'
        }}
      >
        Revogar termo
      </button>
    </div>
  )
}
