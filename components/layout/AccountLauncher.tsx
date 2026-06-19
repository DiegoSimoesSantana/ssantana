'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Grid2x2, LogIn, ShieldCheck, UserRound, X } from 'lucide-react'
import { COOKIE_CONSENT_ACCEPTED, COOKIE_CONSENT_KEY } from '@/lib/referral-tracking'

type MenuItem = {
  label: string
  href: string
  tone: 'primary' | 'default'
}

type SessionPayload = {
  authenticated: boolean
  user?: {
    name: string
    email: string
    role: 'ADMIN' | 'PARTNER' | 'CLIENT'
    avatar: string | null
    dashboardHref: string
    menu: MenuItem[]
    profiles?: Array<'ADMIN' | 'PARTNER' | 'CLIENT'>
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SS'
}

export default function AccountLauncher() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [session, setSession] = useState<SessionPayload>({ authenticated: false })
  const [consentAcceptedAt, setConsentAcceptedAt] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    void fetch('/api/account/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: SessionPayload) => setSession(data))
      .catch(() => setSession({ authenticated: false }))

    const status = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    const acceptedAt = window.localStorage.getItem('ssantana_cookie_consent_accepted_at') || ''
    if (status === COOKIE_CONSENT_ACCEPTED) {
      setConsentAcceptedAt(acceptedAt)
    }
  }, [])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const identityLabel = useMemo(() => {
    if (!session.authenticated || !session.user) {
      return 'Login'
    }

    if (session.user.role === 'ADMIN') return 'Admin'
    if (session.user.role === 'PARTNER') return 'Parceiro'
    return 'Cliente'
  }, [session])

  const revokeConsent = () => {
    const confirmed = window.confirm(
      'Revogar o consentimento LGPD? Se houver servicos ativos ou parceria ativa, isso pode limitar recursos da conta.'
    )

    if (!confirmed) return

    window.localStorage.removeItem(COOKIE_CONSENT_KEY)
    window.localStorage.removeItem('ssantana_cookie_consent_accepted_at')
    window.localStorage.removeItem('ssantana_partner_ref')
    document.cookie = 'ssantana_partner_ref=; path=/; max-age=0; samesite=lax'
    setConsentAcceptedAt('')
    alert('Preferencia LGPD revogada com sucesso.')
  }

  const acceptConsent = () => {
    const now = new Date().toISOString()
    window.localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED)
    window.localStorage.setItem('ssantana_cookie_consent_accepted_at', now)
    setConsentAcceptedAt(now)
  }

  const logoutAdmin = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const logoutAccount = async () => {
    await fetch('/api/account/auth/logout', { method: 'POST' })
    window.location.href = '/sign-in'
  }

  const switchToRole = async (role: 'ADMIN' | 'PARTNER' | 'CLIENT') => {
    if (!session.user) return

    if (role === 'ADMIN') {
      window.location.href = '/admin/dashboard'
      return
    }

    if (session.user.role === 'ADMIN') {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    }

    const response = await fetch('/api/account/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedRole: role }),
    })

    if (!response.ok) {
      return
    }

    window.location.href = role === 'PARTNER' ? '/dashboard/partner' : '/dashboard/client'
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        {!session.authenticated ? (
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <LogIn size={16} />
            Login
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:border-primary-300"
            aria-label="Abrir conta"
            aria-expanded={menuOpen}
            aria-controls="account-launcher-menu"
          >
            {session.user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.avatar} alt={session.user.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                {getInitials(session.user?.name || 'Santana')}
              </span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{identityLabel}</span>
              <span className="block max-w-28 truncate text-sm font-semibold text-slate-800">{session.user?.name}</span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-primary-300"
          aria-label="Abrir atalhos da conta"
          aria-expanded={menuOpen}
          aria-controls="account-launcher-menu"
        >
          {menuOpen ? <X size={18} /> : <Grid2x2 size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div id="account-launcher-menu" className="absolute right-0 z-50 mt-3 w-[min(92vw,22rem)] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
          {session.authenticated && session.user ? (
            <div className="mb-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                {session.user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.avatar} alt={session.user.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {getInitials(session.user.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{session.user.name}</p>
                  <p className="truncate text-xs text-slate-500">{session.user.email}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary-600">{identityLabel}</p>
                </div>
              </div>
              {!session.user.avatar && (
                <p className="mt-3 text-xs text-slate-500">
                  Foto de perfil ainda nao cadastrada. Assim que houver configuracao de perfil, ela aparecera aqui.
                </p>
              )}

            </div>
          ) : (
            <div className="mb-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <UserRound size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Nenhum usuario reconhecido</p>
                  <p className="text-xs text-slate-500">Entre para abrir sua area de cliente, parceiro ou admin.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {session.authenticated && session.user ? (
              session.user.menu.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                    item.tone === 'primary'
                      ? 'border-primary-200 bg-primary-50 text-primary-800 hover:bg-primary-100'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="block">{item.label}</span>
                </Link>
              ))
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-primary-200 bg-primary-50 px-4 py-4 text-sm font-semibold text-primary-800 transition hover:bg-primary-100">
                  Entrar
                </Link>
                <Link href="/partners" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                  Seja parceiro
                </Link>
                <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                  Admin
                </Link>
                <Link href="/#contact" onClick={() => setMenuOpen(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                  Falar com a equipe
                </Link>
              </>
            )}
          </div>

          {session.authenticated && session.user && (session.user.profiles?.length || 0) > 1 && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Trocar visualização de perfil</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {session.user.profiles?.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => void switchToRole(role)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      session.user?.role === role
                        ? 'bg-primary-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {role === 'ADMIN' ? 'Admin' : role === 'PARTNER' ? 'Parceiro' : 'Cliente'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-emerald-700" size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-900">LGPD e dados da conta</p>
                <p className="mt-1 text-xs text-emerald-800">
                  {consentAcceptedAt
                    ? `Consentimento ativo desde ${new Date(consentAcceptedAt).toLocaleString('pt-BR')}`
                    : 'Consentimento ainda nao aprovado neste navegador.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {consentAcceptedAt ? (
                    <button
                      type="button"
                      onClick={revokeConsent}
                      className="rounded-xl bg-emerald-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Revogar LGPD
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={acceptConsent}
                      className="rounded-xl bg-emerald-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Ativar LGPD
                    </button>
                  )}
                  <Link href="/terms" onClick={() => setMenuOpen(false)} className="rounded-xl border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100">
                    Ver termos
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {session.authenticated && session.user?.role === 'ADMIN' && (
            <button
              type="button"
              onClick={logoutAdmin}
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sair do admin
            </button>
          )}

          {session.authenticated && session.user?.role !== 'ADMIN' && (
            <button
              type="button"
              onClick={logoutAccount}
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sair e escolher perfil
            </button>
          )}
        </div>
      )}
    </div>
  )
}
