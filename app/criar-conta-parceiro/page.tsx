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
  const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF')
  const [document, setDocument] = useState('')
  const [cpfResponsible, setCpfResponsible] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [pixKeyType, setPixKeyType] = useState<'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'RANDOM'>('CPF')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<RegisterResponse | null>(null)

  const validatePixByType = () => {
    const pixValue = pixKey.trim()
    const digits = pixValue.replace(/\D/g, '')

    if (pixKeyType === 'CPF' && digits.length !== 11) {
      return 'Para tipo CPF, informe uma chave com 11 dígitos.'
    }

    if (pixKeyType === 'CNPJ' && digits.length !== 14) {
      return 'Para tipo CNPJ, informe uma chave com 14 dígitos.'
    }

    if (pixKeyType === 'PHONE' && digits.length < 10) {
      return 'Para tipo Telefone, informe DDD + número válido.'
    }

    if (pixKeyType === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixValue)) {
      return 'Para tipo E-mail, informe um e-mail válido.'
    }

    return ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const pixValidationError = validatePixByType()
    if (pixValidationError) {
      setError(pixValidationError)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName: companyName || undefined,
          personType,
          document,
          cpfResponsible: personType === 'PJ' ? cpfResponsible : undefined,
          birthDate,
          pixKey,
          pixKeyType,
          password,
          acceptTerms,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao cadastrar parceiro')
      }

      const data = (await response.json()) as RegisterResponse
      setResult(data)
    } catch {
      setError('Não foi possível concluir o cadastro agora. Tente novamente.')
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
            Esta trilha e para parceria B2B por indicacao. Finalize o cadastro para liberar seu codigo, sua URL e acesso ao painel.
          </p>

          <div className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-100">
            <p className="font-semibold">Como funciona a entrada no programa</p>
            <p className="mt-2">
              O cadastro libera sua estrutura de indicacao imediatamente. Em casos especificos, o time pode solicitar validacao complementar para conformidade de dados de repasse.
            </p>
          </div>

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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={personType}
                onChange={(e) => setPersonType(e.target.value as 'PF' | 'PJ')}
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="PF">Pessoa Física (CPF)</option>
                <option value="PJ">Pessoa Jurídica (CNPJ)</option>
              </select>
              <input
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
                placeholder={personType === 'PJ' ? 'CNPJ' : 'CPF'}
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {personType === 'PJ' && (
              <input
                value={cpfResponsible}
                onChange={(e) => setCpfResponsible(e.target.value)}
                required
                placeholder="CPF do responsável legal"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              />
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={pixKeyType}
                onChange={(e) => setPixKeyType(e.target.value as 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'RANDOM')}
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="CPF">Tipo de chave PIX: CPF</option>
                <option value="CNPJ">Tipo de chave PIX: CNPJ</option>
                <option value="PHONE">Tipo de chave PIX: Telefone</option>
                <option value="EMAIL">Tipo de chave PIX: E-mail</option>
                <option value="RANDOM">Tipo de chave PIX: Aleatória</option>
              </select>
              <input
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                type="date"
                required
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                required
                placeholder="Chave PIX para comissões"
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                minLength={8}
                required
                placeholder="Crie sua senha (mín. 8 caracteres)"
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <p className="rounded-xl border border-amber-300/30 bg-amber-200/10 px-3 py-2 text-xs leading-5 text-amber-100">
              Por favor, certifique-se de que o tipo de chave selecionado corresponde exatamente ao dado inserido no campo anterior
              para garantir que seus repasses de comissão sejam processados sem atrasos pelo nosso sistema automatizado.
            </p>

            <label className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <span>
                Li e aceito os termos de parceria, tratamento de dados, política de comissões e responsabilidades legais.
                Em caso de nova versão contratual, concordo em revisar e aceitar para manter acesso ativo ao programa.
              </span>
            </label>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Cadastrando...' : 'Gerar meu link de indicação'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
          <h2 className="text-xl font-semibold text-white">Seu Kit de Indicação</h2>
          <p className="mt-2 text-sm text-slate-300">
            Depois do cadastro, seu código e sua URL VIP aparecem aqui para copiar e usar imediatamente.
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
            <p className="font-semibold text-white">Fluxo padrao da parceria</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Cadastro com dados de repasse e criacao de senha.</li>
              <li>Liberacao de codigo e link de indicacao.</li>
              <li>Uso do kit comercial e acompanhamento no dashboard.</li>
            </ol>
            <Link
              href="/partners/kit-comercial"
              className="mt-3 inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              Ver kit comercial e regras
            </Link>
          </div>

          {!result && (
            <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
              Preencha o formulário para liberar seu link exclusivo.
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  {result.alreadyExists ? 'Parceiro já cadastrado' : 'Cadastro concluído'}
                </div>
                <p className="mt-2 text-sm">
                  {result.alreadyExists
                    ? 'Já encontramos seu cadastro. Este é o mesmo código da sua conta.'
                    : 'Seu código de indicação foi gerado com sucesso.'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Código do parceiro</p>
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
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Esse link leva o cliente para a landing VIP de indicação com rastreio automático da sua comissão.
                </p>
                <button
                  type="button"
                  onClick={() => copyText(result.partner.referralUrl)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-200"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Copiar URL de indicação
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
