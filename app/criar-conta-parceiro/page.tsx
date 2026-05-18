'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Copy, Link2, UserPlus } from 'lucide-react'

type RegisterResponse = {
  success: boolean
  alreadyExists: boolean
  partner: {
    id: string
    userId: string
    name: string
    email: string
    referralCode: string
    referralUrl: string
  }
}

export default function CreatePartnerAccountPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<RegisterResponse | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName: companyName || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao cadastrar parceiro')
      }

      const data = (await response.json()) as RegisterResponse
      setResult(data)
    } catch {
      setError('Nao foi possivel concluir o cadastro agora. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // no-op
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr,1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-5 inline-flex rounded-full bg-cyan-400/15 p-3 text-cyan-200">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Cadastrar Parceiro</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Finalize seu cadastro e receba agora seu codigo e sua URL de indicacao para compartilhar com clientes.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome completo"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Telefone"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Empresa (opcional)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            />

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Cadastrando...' : 'Gerar meu link de indicacao'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
          <h2 className="text-xl font-semibold text-white">Seu Kit de Indicacao</h2>
          <p className="mt-2 text-sm text-slate-300">
            Depois do cadastro, seu codigo e sua URL aparecem aqui para copiar e usar imediatamente.
          </p>

          {!result && (
            <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
              Preencha o formulario para liberar seu link exclusivo.
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  {result.alreadyExists ? 'Parceiro ja cadastrado' : 'Cadastro concluido'}
                </div>
                <p className="mt-2 text-sm">
                  {result.alreadyExists
                    ? 'Ja encontramos seu cadastro. Este e o mesmo codigo da sua conta.'
                    : 'Seu codigo de indicacao foi gerado com sucesso.'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Codigo do parceiro</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-white">{result.partner.referralCode}</p>
                  <button
                    type="button"
                    onClick={() => copyText(result.partner.referralCode)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">URL para indicar clientes</p>
                <p className="mt-2 break-all text-sm text-cyan-200">{result.partner.referralUrl}</p>
                <button
                  type="button"
                  onClick={() => copyText(result.partner.referralUrl)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-200"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Copiar URL de indicacao
                </button>
              </div>

              <Link
                href={`/dashboard/partner?refCode=${encodeURIComponent(result.partner.referralCode)}`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ir para dashboard do parceiro
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
