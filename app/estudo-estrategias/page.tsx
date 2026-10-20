'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  Flame,
  CreditCard,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  Layers,
  FileText
} from 'lucide-react'

const CLIENT_STORAGE_KEY = 'ssantana_client_checkout_profile'
const CLIENT_COOKIE_KEY = 'ssantana_client_profile'

function getSavedClientData(): { name?: string; email?: string; phone?: string; document?: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CLIENT_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + CLIENT_COOKIE_KEY + '=([^;]*)'))
    if (match && match[2]) {
      const parsed = JSON.parse(decodeURIComponent(match[2]))
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch (e) {}
  return null
}

function persistClientData(data: { name: string; email: string; phone: string; document: string }) {
  if (typeof window === 'undefined') return
  try {
    const json = JSON.stringify(data)
    window.localStorage.setItem(CLIENT_STORAGE_KEY, json)
    const maxAge = 365 * 24 * 60 * 60
    document.cookie = `${CLIENT_COOKIE_KEY}=${encodeURIComponent(json)}; max-age=${maxAge}; path=/; SameSite=Lax`
  } catch (e) {}
}

export default function EstudoEstrategiasPage() {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    acceptedTerms: false,
  })
  const [alreadyAcceptedTerms, setAlreadyAcceptedTerms] = useState(false)
  const [checkingTerms, setCheckingTerms] = useState(false)
  const [isPreFilled, setIsPreFilled] = useState(false)

  // Estados de checkout PicPay
  const [generatingOrder, setGeneratingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderResult, setOrderResult] = useState<{
    referenceId: string
    paymentUrl: string
    qrcode: {
      content: string
      base64Image: string
    }
    isMock?: boolean
  } | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [copiedPix, setCopiedPix] = useState(false)
  const [simulating, setSimulating] = useState(false)

  // Checagem de termos pré-aceitos
  const checkTermsStatus = async (email: string) => {
    if (!email || !email.includes('@')) return
    try {
      setCheckingTerms(true)
      const res = await fetch(`/api/account/terms-status?email=${encodeURIComponent(email)}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.alreadyAccepted) {
          setAlreadyAcceptedTerms(true)
          setClientData((prev) => ({ ...prev, acceptedTerms: true }))
        } else {
          setAlreadyAcceptedTerms(false)
        }
      }
    } catch (e) {
    } finally {
      setCheckingTerms(false)
    }
  }

  useEffect(() => {
    const saved = getSavedClientData()
    if (saved && (saved.name || saved.email || saved.phone || saved.document)) {
      setClientData((prev) => ({
        ...prev,
        name: saved.name || prev.name,
        email: saved.email || prev.email,
        phone: saved.phone || prev.phone,
        document: saved.document || prev.document,
      }))
      setIsPreFilled(true)
      if (saved.email) {
        void checkTermsStatus(saved.email)
      }
    }

    void fetch('/api/account/session', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setClientData((prev) => {
            const updated = {
              ...prev,
              name: prev.name || data.user.name || '',
              email: prev.email || data.user.email || '',
            }
            if (updated.email) {
              void checkTermsStatus(updated.email)
            }
            return updated
          })
        }
      })
      .catch(() => {})
  }, [])

  const updateField = (field: 'name' | 'email' | 'phone' | 'document' | 'acceptedTerms', value: any) => {
    setClientData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field !== 'acceptedTerms') {
        persistClientData({
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          document: updated.document,
        })
      }
      if (field === 'email' && typeof value === 'string' && value.includes('@')) {
        void checkTermsStatus(value)
      }
      return updated
    })
  }

  const handleGeneratePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alreadyAcceptedTerms && !clientData.acceptedTerms) {
      setOrderError('Você deve declarar ciência do termo de estudo quantitativo e isenção de risco para prosseguir.')
      return
    }

    persistClientData({
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      document: clientData.document,
    })

    setGeneratingOrder(true)
    setOrderError(null)

    try {
      const res = await fetch('/api/payments/picpay-quick-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'QUANT_M5',
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          document: clientData.document,
          acceptedTerms: alreadyAcceptedTerms ? true : clientData.acceptedTerms,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar pedido de assinatura.')
      }

      setOrderResult({
        referenceId: data.referenceId,
        paymentUrl: data.paymentUrl,
        qrcode: data.qrcode,
        isMock: data.isMock,
      })
    } catch (err: any) {
      setOrderError(err.message || 'Falha na comunicação com o servidor de pagamentos.')
    } finally {
      setGeneratingOrder(false)
    }
  }

  // Polling de pagamento
  useEffect(() => {
    if (!orderResult?.referenceId || isPaid) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status/${orderResult.referenceId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.paid || data.status === 'PAID' || data.status === 'COMPLETED') {
            setIsPaid(true)
            clearInterval(interval)
          }
        }
      } catch (e) {}
    }, 3000)

    return () => clearInterval(interval)
  }, [orderResult, isPaid])

  const copyPix = async () => {
    if (!orderResult?.qrcode?.content) return
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(orderResult.qrcode.content)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = orderResult.qrcode.content
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopiedPix(true)
      setTimeout(() => setCopiedPix(false), 4000)
    } catch (e) {}
  }

  const handleSimulate = async () => {
    if (!orderResult?.referenceId) return
    setSimulating(true)
    try {
      const res = await fetch(`/api/payments/status/${orderResult.referenceId}?simulate=true`)
      if (res.ok) {
        const data = await res.json()
        if (data.paid || data.status === 'PAID') {
          setIsPaid(true)
        }
      }
    } catch (e) {} finally {
      setSimulating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="pt-28 pb-20">
        
        {/* HERO SECTION */}
        <section className="px-4 py-12 sm:py-20 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Laboratório Quantitativo • Backtests Automatizados</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Pare de operar às cegas. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
              O mercado não perdoa &quot;achismos&quot;.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Você já cansou de salas de sinais VIP que operam em gráficos OTC manipulados, escondem os Loss e disparam entradas sem nenhum embasamento técnico?
          </p>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-left max-w-3xl mx-auto shadow-2xl relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              O Que é a Assinatura de Rastreamento Quantitativo?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Nós <strong>não tentamos adivinhar o mercado</strong>. Desenvolvemos um robô rastreador algorítmico 24h no Telegram que monitora o mercado em tempo real, cruza mais de 15 estratégias simultâneas e entrega pré-alertas estatísticos com a porcentagem exata de assertividade (WinRate) antes de cada vela M5 abrir (utilizando até Gale 2 sem proteção).
            </p>
          </div>

          <a
            href="#assinar"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Quero Testar o 1º Mês por R$ 50,00</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </section>

        {/* 5 PILARES DA METODOLOGIA */}
        <section className="px-4 py-16 bg-slate-900/60 border-y border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Transparência e Estatística
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                A Metodologia Quantitativa (O Diferencial Competitivo)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 h-fit">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    🚫 Zero OTC (Mercado 100% Real)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Operamos estritamente em gráficos oficiais onde a análise técnica e o fluxo de mercado realmente funcionam: Forex, Criptomoedas, Ações, Índices e Commodities globais.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 shrink-0 h-fit">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    🔬 Backtest Implacável
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    O sistema processa e cruza mais de 15 estratégias matemáticas distintas para cada ativo simultaneamente, calculando a eficiência em janelas estatísticas recentes.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 h-fit">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    🗑️ Descarte Automático de Estratégias Frias
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Se uma estratégia ou ativo começa a performar abaixo da nossa régua de qualidade, o algoritmo descarta a estratégia na hora. Você só acompanha o que está consistente no dia.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 h-fit">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    ⏳ Pré-Alerta com WinRate Exato
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Você não recebe mensagens &quot;em cima da hora&quot;. O alerta é disparado com antecedência, informando a taxa de acerto histórica daquela confluência (ex: 95%, 98% ou 100%).
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COMPARAÇÃO: SALAS AMADORAS VS LABORATÓRIO QUANTITATIVO */}
        <section className="px-4 py-16 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              De Qual Lado Você Quer Estar?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Traders amadores operam na emoção. Profissionais operam com probabilidade matemática.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 block mb-2">
                ✕ Salas de Sinais Convencionais
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Operações em OTC manipulado pela própria corretora.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Apagam mensagens de Loss e fingem 100% de vitória.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Mandam você entrar às cegas sem nenhuma métrica explicada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Prometem riqueza rápida e levam contas à falência.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-900/40 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2">
                ✓ Nosso Laboratório Quantitativo
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gráficos 100% reais de Forex, Cripto e Commodities oficiais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Histórico auditado e cálculo de probabilidade com backtest aberto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pré-alerta com tempo hábil para análise antes da vela M5 abrir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gestão estatística: você decide se entra ou não com base em números.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE ASSINATURA / CHECKOUT */}
        <section id="assinar" className="px-4 py-16 max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl relative">
            
            <div className="text-center mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Oferta Especial de Boas-Vindas
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                Assinar Laboratório Quantitativo M5
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Acesso imediato ao grupo rastreador 24h no Telegram após confirmação do pagamento.
              </p>
            </div>

            {/* Box de Preço Ancorado */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-6">
              <span className="text-xs text-slate-500 line-through block">
                Valor normal da mensalidade: R$ 150,00/mês
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-4xl font-black text-indigo-400">R$ 50,00</span>
                <span className="text-xs text-slate-300 text-left">
                  no 1º mês <br />
                  <span className="text-emerald-400 font-bold">Economia de R$ 100</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                ✓ Sem fidelidade • Cancele quando quiser • A partir do 2º mês, valor padrão de R$ 150,00/mês.
              </p>
            </div>

            {/* Formulário de Pagamento Seguro */}
            {!orderResult && (
              <form onSubmit={handleGeneratePayment} className="space-y-4">
                
                {orderError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                    {orderError}
                  </div>
                )}

                {isPreFilled && (
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800 flex items-center justify-between text-xs text-indigo-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Dados pré-preenchidos do seu cadastro.</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={clientData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={clientData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      WhatsApp com DDD (para envio do Telegram) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(71) 98888-8888"
                      value={clientData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    CPF ou CNPJ (Obrigatório para emissão da cobrança) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    value={clientData.document}
                    onChange={(e) => updateField('document', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-mono"
                  />
                </div>

                {/* Termos Inteligentes: Se já aceitou anteriormente, exibe badge verde e dispensa re-assinatura */}
                {alreadyAcceptedTerms ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-left space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Termos Contratuais Pré-Aceitos em seu Cadastro</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 leading-relaxed">
                      Identificamos que você já possui cadastro e aceitou os termos gerais em contratações anteriores da SSantana. Não é necessário preencher ou assinar novamente.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800 text-left">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 leading-relaxed">
                      <input
                        type="checkbox"
                        required
                        checked={clientData.acceptedTerms}
                        onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 shrink-0"
                      />
                      <span>
                        <strong>Declaração de Estudo Quantitativo e Isenção de Risco:</strong> Reconheço expressamente que este serviço consiste em um laboratório algorítmico e ferramenta de estudo estatístico com backtests automatizados para análise de mercado. O robô rastreador em tempo real no Telegram NÃO fornece recomendações financeiras nem consultoria de investimentos. Toda e qualquer decisão operacional é de minha exclusiva e total responsabilidade, isentando a SSantana Tecnologia de qualquer obrigação sobre resultados de mercado.
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={generatingOrder}
                  className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {generatingOrder ? 'Gerando Cobrança...' : 'Pagar R$ 50,00 via PIX ou Cartão (PicPay)'}
                </button>
              </form>
            )}

            {/* FASE 2: COBRANÇA GERADA */}
            {orderResult && !isPaid && (
              <div className="space-y-5 text-center animate-fade-in">
                
                {orderResult.qrcode?.base64Image && (
                  <div className="flex flex-col items-center justify-center p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                      Pague com PIX pelo seu Banco
                    </span>
                    <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                      <img
                        src={orderResult.qrcode.base64Image}
                        alt="QR Code PIX"
                        className="w-52 h-52 object-contain"
                      />
                    </div>
                    <span className="text-xs font-bold text-white">
                      Valor do 1º Mês: R$ 50,00
                    </span>
                  </div>
                )}

                {orderResult.qrcode?.content && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={copyPix}
                      className="w-full py-3.5 px-4 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-indigo-800 transition shadow-sm active:scale-95"
                    >
                      <Copy className="w-4 h-4 text-indigo-400" />
                      {copiedPix ? '✓ Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}
                    </button>
                  </div>
                )}

                {orderResult.paymentUrl && (
                  <a
                    href={orderResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pagar com Cartão de Crédito ou PIX no PicPay
                  </a>
                )}

                {orderResult.isMock && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-900/60 text-left space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Modo Demonstração (Testes de Homologação)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulate}
                      disabled={simulating}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {simulating ? 'Validando...' : 'Simular Aprovação e Liberar Acesso ao Telegram'}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Aguardando compensação do banco em tempo real...</span>
                </div>
              </div>
            )}

            {/* FASE 3: CONFIRMADO */}
            {isPaid && (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">
                  Assinatura Confirmada com Sucesso!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Seja bem-vindo ao Laboratório Quantitativo M5. Seu acesso ao grupo rastreador 24h no Telegram foi gerado.
                </p>
                <div className="pt-2">
                  <a
                    href="/painel"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md"
                  >
                    <span>Acessar Painel do Cliente e Link do Telegram</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* DISCLAIMER LEGAL E COMPLIANCE REGULATÓRIO */}
        <section className="px-4 py-8 max-w-3xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-left text-xs text-slate-400 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Aviso Legal, Compliance e Isenção de Responsabilidade</span>
            </div>
            <p>
              O Laboratório Quantitativo SSantana é uma solução de tecnologia que processa dados e executa backtests probabilísticos de estratégias em tempo real. Esta plataforma tem finalidade <strong>estritamente educacional, informativa e de estudo estatístico</strong>.
            </p>
            <p>
              O sistema <strong>não constitui nem substitui consultoria de investimentos, análise de valores mobiliários ou recomendação de compra e venda de ativos</strong> (em plena conformidade com as normas da CVM - Comissão de Valores Mobiliários). O mercado de day trade e operações financeiras envolve alto risco de perda do capital aportado. Rentabilidade e taxas de acerto passadas registradas em backtests <strong>não representam garantia de lucros futuros</strong>. Toda e qualquer decisão operacional realizada pelo usuário em sua própria corretora é de sua integral e exclusiva responsabilidade.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
