'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, Mail, KeyRound, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react'

export default function ValidarContratoPage() {
  const [contractNumber, setContractNumber] = useState('')
  const [email, setEmail] = useState('')
  const [document, setDocument] = useState('')
  const [clientName, setClientName] = useState('')
  const [code, setCode] = useState('')
  
  const [step, setStep] = useState<'REQUEST_CODE' | 'ENTER_CODE' | 'SUCCESS'>('REQUEST_CODE')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<{ contractNumber: string; timestamp: string } | null>(null)

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contracts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractNumber: contractNumber.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          clientName: clientName.trim(),
          document: document.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar código')
      }

      if (data.devCode) {
        setDevCode(data.devCode)
      }

      setStep('ENTER_CODE')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contracts/validate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractNumber: contractNumber.trim().toUpperCase(),
          code: code.trim(),
          document: document.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Código inválido')
      }

      setSuccessInfo({
        contractNumber: data.contractNumber,
        timestamp: data.auditTimestamp,
      })
      setStep('SUCCESS')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-xl flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-8 backdrop-blur">
          
          {/* Header do Card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mb-4 ring-8 ring-sky-50 dark:ring-sky-950/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Validação de Contrato Anti-MED
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2">
              Assinatura digital e protocolo de segurança auditado conforme a Lei 14.063/2020.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* PASSO 1: Solicitar código */}
          {step === 'REQUEST_CODE' && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Número do Contrato
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: SS-2026-0001"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  E-mail do Titular
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Nome Completo ou Razão
                  </label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    CPF ou CNPJ
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-xl transition shadow-lg shadow-sky-600/20 disabled:opacity-50"
              >
                {loading ? 'Disparando Código...' : 'Enviar Código de Validação'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* PASSO 2: Digitar código de 6 dígitos */}
          {step === 'ENTER_CODE' && (
            <form onSubmit={handleValidateCode} className="space-y-5">
              <div className="p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-xs text-sky-800 dark:text-sky-300">
                <p>Enviamos um código de 6 dígitos para o e-mail <strong>{email}</strong> referente ao contrato <strong>{contractNumber}</strong>.</p>
                {devCode && (
                  <p className="mt-2 font-mono font-bold text-amber-600 dark:text-amber-400">
                    [Ambiente Dev] Código Gerado: {devCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2 text-center">
                  Digite o Código de 6 Dígitos
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-800 border-2 border-sky-500 rounded-xl text-center text-2xl font-mono tracking-widest font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('REQUEST_CODE')}
                  className="w-1/3 py-3 px-4 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold rounded-xl text-sm transition"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-2/3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {loading ? 'Autenticando...' : 'Confirmar e Assinar'}
                </button>
              </div>
            </form>
          )}

          {/* PASSO 3: Sucesso */}
          {step === 'SUCCESS' && successInfo && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Contrato {successInfo.contractNumber} Validado!
              </h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                A assinatura eletrônica avançada foi gravada com sucesso. Seu IP, dispositivo e timestamp foram protocolados para garantir total segurança jurídica e conformidade contratual.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-500 dark:text-zinc-400">
                Data do Registro: {new Date(successInfo.timestamp).toLocaleString('pt-BR')}
              </div>
              <div className="pt-2">
                <a
                  href="/painel"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition text-sm shadow-md"
                >
                  Ir para Meu Painel do Cliente
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
