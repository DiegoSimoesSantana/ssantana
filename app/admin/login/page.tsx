'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        throw new Error('Credenciais inválidas')
      }
      router.push('/admin/dashboard')
    } catch {
      setError('Falha no login admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Entre com seu email e senha de administrador.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email admin"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Senha"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-900 hover:bg-cyan-200 disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar no painel'}
          </button>
        </form>
      </div>
    </main>
  )
}
