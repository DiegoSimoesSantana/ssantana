'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type ProfileRole = 'ADMIN' | 'CLIENT' | 'PARTNER'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableProfiles, setAvailableProfiles] = useState<ProfileRole[]>([])
  const [selectingProfile, setSelectingProfile] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setAvailableProfiles([])
    setSelectingProfile(false)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(payload.error || 'Falha no login')
        setLoading(false)
        return
      }

      // Admin — redireciona direto
      if (payload.type === 'admin') {
        router.push(payload.redirectTo || '/admin/dashboard')
        return
      }

      // Account — múltiplos perfis
      if (payload.requiresProfileSelection && Array.isArray(payload.profiles)) {
        setAvailableProfiles(payload.profiles)
        setSelectingProfile(true)
        setLoading(false)
        return
      }

      // Account — um perfil
      if (payload.redirectTo) {
        router.push(payload.redirectTo)
        return
      }

      setError('Login não retornou redirecionamento')
      setLoading(false)
    } catch (err) {
      setError('Falha de rede no login')
      setLoading(false)
    }
  }

  const chooseProfile = async (role: ProfileRole) => {
    setLoading(true)
    setError('')

    if (role === 'ADMIN') {
      router.push('/admin/dashboard')
      return
    }

    try {
      const response = await fetch('/api/account/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedRole: role }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error || 'Não foi possível selecionar perfil')
        setLoading(false)
        return
      }

      const redirectTo = role === 'PARTNER' ? '/dashboard/partner' : '/dashboard/client'
      router.push(redirectTo)
    } catch {
      setError('Falha de rede ao selecionar perfil')
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="text-indigo-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Acessar portal</h1>
          </div>
          <p className="text-sm text-gray-600 mb-6 dark:text-slate-300">
            {selectingProfile
              ? 'Escolha o perfil para esta sessao. Voce pode alternar depois dentro do painel.'
              : 'Entre com seu email e senha para continuar no ambiente de cliente, parceiro ou administracao.'}
          </p>

          {!selectingProfile && (
            <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs leading-5 text-indigo-800 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200">
              Acesso centralizado com governanca de perfis. Se sua conta tiver mais de um perfil, a selecao sera exibida no proximo passo.
            </div>
          )}

          {selectingProfile ? (
            <div className="space-y-3">
              {availableProfiles.map((role) => (
                <button
                  key={role}
                  onClick={() => void chooseProfile(role)}
                  disabled={loading}
                  className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-70 transition"
                >
                  {loading
                    ? 'Entrando...'
                    : role === 'ADMIN'
                      ? 'Acessar como Administrador'
                      : role === 'PARTNER'
                        ? 'Acessar como Parceiro'
                        : 'Acessar como Cliente'}
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectingProfile(false)
                  setAvailableProfiles([])
                  setError('')
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Voltar ao login
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block dark:text-slate-200">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block dark:text-slate-200">Senha</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </label>
              {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-70 transition"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
