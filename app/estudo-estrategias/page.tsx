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
  FileText,
  Smartphone,
  HelpCircle,
  Percent,
  Compass,
  Server,
  BookOpen,
  Send,
  Sliders,
  DollarSign,
  Tag
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
    couponCode: '',
    acceptedTerms: false,
  })
  const [alreadyAcceptedTerms, setAlreadyAcceptedTerms] = useState(false)
  const [checkingTerms, setCheckingTerms] = useState(false)
  const [isPreFilled, setIsPreFilled] = useState(false)

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

  const updateField = (field: 'name' | 'email' | 'phone' | 'document' | 'couponCode' | 'acceptedTerms', value: any) => {
    setClientData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field !== 'acceptedTerms' && field !== 'couponCode') {
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
          couponCode: clientData.couponCode?.trim() || undefined,
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

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="pt-28 pb-20">
        
        {/* 1. HERO SECTION & NOVO POSICIONAMENTO */}
        <section className="px-4 py-12 sm:py-20 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Laboratório Quantitativo • Backtest Institucional 24h</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            Nós não vendemos sinais. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
              Nós construímos Estatística.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 font-semibold max-w-3xl mx-auto mb-4">
            Acompanhe os testes de estresse em mais de 15 estratégias Quantitativas operando em tempo real no mercado financeiro.
          </p>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Um laboratório de pesquisa e backtest para traders que cansaram de &quot;achismos&quot; e querem ver como o mercado reage matematicamente. Se você quer dinheiro fácil, feche esta página. Se quer estudar a probabilidade das velas com dados institucionais, seja bem-vindo ao Laboratório TDT.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#assinar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Testar o 1º Mês por R$ 50,00</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#como-funciona"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm border border-slate-800 transition"
            >
              <span>Ver Produto por Dentro</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Badges de Destaque */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Zero OTC • Mercado 100% Real</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Cruzamento de 15+ Estratégias</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Descarte em Modo Fantasma</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Pré-Alerta com WinRate Aberto</span>
            </div>
          </div>
        </section>

        {/* 2. O QUE É ESTE SERVIÇO? (O MANIFESTO) */}
        <section className="px-4 py-16 bg-slate-900/40 border-y border-slate-800">
          <div className="max-w-4xl mx-auto text-left space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
              <Activity className="w-4 h-4" />
              <span>O Que é Este Serviço? (O Manifesto de Transparência)</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Não é uma &quot;sala VIP de entradas&quot;. É monitoramento estatístico contínuo.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Nós construímos um ecossistema de rastreamento estatístico no Telegram. Não ficamos enviando ordens cegas. Nossos algoritmos (desenvolvidos em Pine Script) monitoram ativos globais 24 horas por dia, rastreando confluências técnicas de <strong>Exaustão, Reversão à Média, Fractais e Zonas Institucionais de Liquidez</strong>.
            </p>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Por que você recebe o relatório (Pré-Alerta) antes?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Para poder estudar o comportamento do ativo na sua própria tela. O robô informa: <em>&quot;A estratégia X está com 98% de acerto nas últimas horas e confluência técnica vai disparar agora na vela M5&quot;</em>. O que você faz com essa informação — se entra na sua conta de demonstração para validar, se opera na conta real ou se apenas assiste o desfecho estatístico — é uma <strong>decisão 100% sua</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200 leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>O Mercado é Soberano:</strong> Nós calculamos o comportamento passado e a consistência matemática recente, nós <strong>não prevemos o futuro</strong>. A estatística pode mostrar 100% de vitórias nas últimas 10 confluências, e a 11ª pode falhar. Em Renda Variável, a única garantia existente é a do risco.
              </div>
            </div>
          </div>
        </section>

        {/* 3. PRODUTO POR DENTRO (MOCKUP DO TELEGRAM & TEMPLATE DO ALERTA) */}
        <section id="como-funciona" className="px-4 py-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Transparência na Prática
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Como o Relatório Chega no seu Celular
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Chega de mensagens confusas (&quot;EURUSD M5 CALL&quot;) sem nenhum contexto. Você recebe o raio-X probabilístico completo antes de decidir qualquer ação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* MOCKUP DO SMARTPHONE (CSS TELEGRAM) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[320px] rounded-[36px] bg-slate-900 border-4 border-slate-700 p-3 shadow-2xl relative shadow-indigo-500/10">
                {/* Notch / Speaker */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

                {/* Topo do Telegram */}
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800 px-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    TDT
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Laboratório Quant M5</p>
                    <p className="text-[10px] text-emerald-400">● 15 robôs ativos em tempo real</p>
                  </div>
                </div>

                {/* Balão da Mensagem */}
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5 shadow-inner">
                  
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      PRÉ-ALERTA M5
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">14:32</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Ativo:</span>
                      <strong className="text-white font-mono">EUR / USD (Forex Real)</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Vela de Entrada:</span>
                      <strong className="text-sky-400 font-mono">14:35 (M5)</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Direção Técnica:</span>
                      <strong className="text-emerald-400 font-bold uppercase tracking-wider">▲ CALL (COMPRA)</strong>
                    </div>
                  </div>

                  {/* Raio-X Estatístico */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-800">
                      <span className="text-slate-400 font-semibold">Assertividade:</span>
                      <span className="text-emerald-400 font-black">98.2% WinRate</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-center text-slate-300">
                      <div className="p-1 rounded bg-slate-950">
                        <span className="block text-slate-500">Direto:</span>
                        <strong className="text-emerald-400">76%</strong>
                      </div>
                      <div className="p-1 rounded bg-slate-950">
                        <span className="block text-slate-500">Gale 1:</span>
                        <strong className="text-sky-400">18%</strong>
                      </div>
                      <div className="p-1 rounded bg-slate-950">
                        <span className="block text-slate-500">Gale 2:</span>
                        <strong className="text-amber-400">4.2%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-tight pt-1">
                    🔬 Estratégia: <strong>TRAP (Armadilha em Falso Rompimento)</strong>. Proteção até Gale 2 sem proteção de taxa.
                  </div>

                  <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-[10px] text-emerald-300 flex items-center justify-between">
                    <span>Status pós-vela:</span>
                    <strong>✓ WIN no G1 (+1 WinRate)</strong>
                  </div>

                </div>

                <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
              </div>
            </div>

            {/* BULLET POINTS EXPLICATIVOS AO LADO */}
            <div className="lg:col-span-7 text-left space-y-5">
              
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1. Pré-Alerta com Antecedência</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Você é avisado minutos antes da vela nascer. Dá tempo de abrir a corretora com calma, verificar o gráfico na sua tela e se posicionar sem desespero.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">2. Ativo e Direção Sem Siglas Confusas</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Par de moedas, vela exata em M5 e direção clara (CALL ou PUT). Sem jargões técnicos para você não perder tempo decifrando mensagens.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">3. Raio-X Estatístico em Tempo Real</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Você vê o histórico detalhado da confluência (Gain Direto, Gale 1, Gale 2 e Loss). O robô entrega a probabilidade calculada; você decide se o risco compensa.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">4. Atualização Imediata e Descarte em &quot;Modo Fantasma&quot;</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Assim que a vela encerra, o robô recalcula o WinRate. Se o ativo esfria e cai para menos de 95%, a estratégia entra no Modo Fantasma e para de enviar sinais até voltar a performar.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. A TESE DO BACKTEST (POR QUE TESTAMOS 15+ ESTRATÉGIAS SIMULTÂNEAS?) */}
        <section className="px-4 py-16 bg-slate-900/60 border-y border-slate-800">
          <div className="max-w-4xl mx-auto text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              A Tese do Backtest Dinâmico
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              &quot;Você não usa pneu de chuva em pista seca. <br className="hidden sm:inline" />
              Por que usaria a mesma estratégia em todos os ativos?&quot;
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              O <strong>EURUSD</strong> tem um padrão de volatilidade completamente diferente do <strong>Bitcoin</strong>. O <strong>Ouro (XAUUSD)</strong> não se movimenta como as moedas do Japão (JPY). Tentar usar um único setup genérico de &quot;Cruzamento de Médias&quot; para tudo é exatamente o motivo pelo qual 90% dos traders quebram a banca.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Mercado Lateral?
                </h4>
                <p className="text-xs text-slate-400">
                  O robô liga os algoritmos de <strong>TRAP (Armadilhas em Falso Rompimento)</strong> e desativa na hora os setups de Pullback.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  Mercado em Tendência Forte?
                </h4>
                <p className="text-xs text-slate-400">
                  O sistema ativa o rastreamento de <strong>Pullback em Médias Exponenciais</strong> e desliga estratégias de contratendência.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-900/50 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <strong>O Trabalho Sujo é Nosso:</strong> Nossos servidores fazem todo o cálculo de backtest pesado 24h. Você só recebe em sua tela as estratégias que estão matematicamente aquecidas e validadas hoje.
              </div>
            </div>
          </div>
        </section>

        {/* 5. A TESE DOS 5 MINUTOS (POR QUE FUGIMOS DO M1?) */}
        <section className="px-4 py-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Engenharia de Execução
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              A Tese dos 5 Minutos (Por que fugimos do M1?)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Muitos &quot;gurus&quot; adoram o gráfico de 1 minuto pela velocidade ilusória. Nossa pesquisa descarta o M1 por 3 razões técnicas cruciais:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 w-fit mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Guerra de Liquidez & Spreads</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  O preço de um ativo não é universal. No gráfico de 1 minuto (M1), uma variação de milissegundos ou um spread maior entre corretoras transforma um Gain legítimo em um Loss amargo.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 w-fit mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">O Tempo de Respiro do M5</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No gráfico de 5 minutos, a vela tem tempo de absorver a força institucional. Em caso de empate técnico (Dojis), o M5 dá tempo hábil para reavaliar e aplicar proteções (Gale 1 e Gale 2) com frieza.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Auditoria Própria da sua Corretora</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ao assinar nosso laboratório, você usa nossos dados de liquidez global para <strong>auditar a sua corretora</strong>. Se a plataforma que você usa sempre diverge da cotação oficial nos segundos finais... é hora de questionar a idoneidade dela.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 6. NOSSO ARSENAL DE PESQUISA (O QUE ESTAMOS TESTANDO?) */}
        <section className="px-4 py-16 bg-slate-900/40 border-y border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Algoritmos em Execução
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                Nosso Arsenal de Pesquisa (O que estamos testando?)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
                Mapeamos as movimentações do mercado financeiro através de confluências com modelos quantitativos:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">TRAP (Falso Rompimento)</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rastreamos quando o preço finge romper uma zona de suporte ou resistência para liquidar os amadores e retorna com agressividade para dentro da zona de liquidez.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">RETRAÇÃO ANÔMALA</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Detectamos velas que esticaram rápido demais (anomalias de desvio padrão em Bandas de Bollinger) e tendem a deixar pavio voltando para a média de preço justo.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <h4 className="text-sm font-bold text-white">PULLBACK DE TENDÊNCIA</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Testamos a tese de &quot;surfar a onda&quot;. Se a tendência primária é de baixa e o mercado respira, monitoramos o toque exato nas médias para continuação do movimento.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">SEQUÊNCIA & EXAUSTÃO</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Estatística pura: qual a probabilidade matemática de um ativo fazer 7 ou 8 velas consecutivas da mesma cor sem nenhum respiro? Rastreamos o ponto de esgotamento.
                </p>
              </div>

            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
              🔒 <strong>Regra de Corte Institucional:</strong> Se uma confluência cai para menos de 95% de assertividade ou não atinge o lastro mínimo de 5 operações de teste, ela entra automaticamente em <strong>Modo Fantasma</strong>. Só expomos o que está matematicamente aprovado.
            </div>
          </div>
        </section>

        {/* 7. PERSONALIZAÇÃO DE FONTES & NEUTRALIDADE */}
        <section className="px-4 py-16 max-w-4xl mx-auto text-left">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>Personalização de Fontes sob Demanda</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Nós não indicamos nem temos afiliação com corretoras.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Nenhuma plataforma de opções binárias é regulamentada pela CVM no Brasil atualmente, portanto, qualquer operação é por sua conta e risco. O nosso foco é o <strong>Dado Global e Institucional</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              💡 <strong>Estudo de Fonte Sob Demanda:</strong> Se você assinar o grupo e quiser que o nosso robô estude um ativo específico ou rastreie a cotação puxando a fonte de liquidez exata da corretora que você utiliza, basta enviar uma mensagem direta para a nossa equipe. Nós adicionamos a sua fonte em nossos servidores para rodar o backtest dedicado para você.
            </div>
          </div>
        </section>

        {/* 8. QUEBRA DE OBJEÇÃO & BÔNUS DE INTEGRAÇÃO */}
        <section className="px-4 py-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/50">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bônus: Guia de Gerenciamento Quant</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tem medo de ficar perdido? Ao assinar, você ganha acesso imediato ao nosso <strong>Guia de Gerenciamento Quant</strong>: aprenda a ler os relatórios de confluência, aplicar a proteção ideal de Gale 1 e Gale 2 para buscar taxas melhores que as do robô e proteger o seu capital.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-900/50">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">O Gatilho da Autonomia (Você no Comando)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Salas de sinais comuns exigem obediência cega. O nosso rastreador exige inteligência. Nós entregamos o radar completo: a confluência, a métrica de acerto e o comportamento do ativo. Se estiver em 98%, você opera com confiança. Se estiver em 92%, pode ignorar. <strong>A matemática é nossa, a decisão final é sua.</strong>
              </p>
            </div>

          </div>
        </section>

        {/* 9. SEÇÃO DE ASSINATURA / CHECKOUT */}
        <section id="assinar" className="px-4 py-16 max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl relative">
            
            <div className="text-center mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Acesso ao Laboratório Quantitativo M5
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                Participe do Grupo de Estudos
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Acesso imediato ao grupo rastreador 24h no Telegram após a confirmação do pagamento.
              </p>
            </div>

            {/* Box de Preço Ancorado com Regra de 1º Mês e Cupons */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-6">
              <span className="text-xs text-slate-500 line-through block">
                Valor padrão da mensalidade: R$ 150,00/mês
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-4xl font-black text-indigo-400">R$ 50,00</span>
                <span className="text-xs text-slate-300 text-left">
                  no 1º mês <br />
                  <span className="text-emerald-400 font-bold">Oferta de Boas-Vindas</span>
                </span>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
                <p>
                  ✓ <strong>1º Mês de Teste:</strong> Apenas R$ 50,00 para você comprovar a assertividade e acompanhar as estatísticas por 30 dias.
                </p>
                <p>
                  ✓ <strong>Meses Seguintes:</strong> R$ 150,00/mês. Cancelamento livre a qualquer momento, sem nenhuma fidelidade ou multa.
                </p>
                <p className="text-indigo-300 pt-0.5">
                  ★ <strong>Cupons de Desconto para Membros:</strong> Membros participativos que contribuem com análises podem pleitear cupons de desconto diretamente com a administração, que avalia concessões personalizadas caso a caso.
                </p>
              </div>
            </div>

            {/* Formulário de Pagamento Seguro */}
            {!orderResult && (
              <form onSubmit={handleGeneratePayment} className="space-y-4 text-left">
                
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

                {/* Campo de Cupom de Desconto Opcional */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Possui um Código de Cupom Administrativo? (Opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Digite seu cupom (se tiver recebido da administração)"
                    value={clientData.couponCode}
                    onChange={(e) => updateField('couponCode', e.target.value.toUpperCase())}
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
                      Identificamos que você já possui cadastro e aceitou os termos contratuais em serviços anteriores da SSantana. Não é necessário preencher ou assinar novamente.
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
                  {generatingOrder ? 'Gerando Cobrança...' : 'Assinar 1º Mês por R$ 50 (PIX / Cartão)'}
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
                      Identificador: {orderResult.referenceId}
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

        {/* 10. SEÇÃO DE PERGUNTAS FREQUENTES (FAQ MATADOR) */}
        <section className="px-4 py-16 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Tire Suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Perguntas Frequentes (FAQ)
            </h2>
          </div>

          <div className="space-y-3 text-left">
            
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(1)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition"
              >
                <span>Preciso de muito dinheiro para começar?</span>
                {openFaq === 1 ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === 1 && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  Não. Você gerencia o seu próprio capital na sua corretora de preferência. É possível começar estudando em conta de demonstração (dinheiro fictício) ou com entradas mínimas de centavos/dólares, aplicando a gestão de banca e proteção de capital ensinada em nosso guia.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(2)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition"
              >
                <span>Em qual corretora o rastreador funciona?</span>
                {openFaq === 2 ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === 2 && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  Funciona na Pocket Option, Quotex, Exness, Binomo e em qualquer corretora onde o ativo esteja aberto, pois a análise do nosso sistema é baseada nas fontes de liquidez globais e institucionais do TradingView. Além disso, se quiser que o robô audite a cotação exata da sua corretora, nós configuramos sob demanda.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(3)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition"
              >
                <span>Se eu não gostar, posso cancelar?</span>
                {openFaq === 3 ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === 3 && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  Sim! Não temos contrato de fidelidade nem pegadinhas. Você paga R$ 50 no primeiro mês de teste, valida a infraestrutura na prática e, se não fizer sentido para o seu operacional, basta cancelar sem nenhuma multa.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(4)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition"
              >
                <span>Os alertas têm atraso (delay)?</span>
                {openFaq === 4 ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === 4 && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  Não, pois trabalhamos com a tecnologia de <strong>PRÉ-ALERTA</strong>. O sistema avisa minutos antes da vela de 5 minutos (M5) iniciar. Isso elimina completamente a correria de tentar pegar ordens em cima da hora com delay de internet.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(5)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition"
              >
                <span>Como funciona o valor das mensalidades e cupons de desconto?</span>
                {openFaq === 5 ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === 5 && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  Apenas o primeiro mês é promocional por R$ 50,00. Os meses seguintes custam o valor normal de R$ 150,00/mês para cobrir os custos operacionais de servidores dedicados e APIs 24h. Caso o membro contribua ativamente na comunidade ou necessite de apoio, a administração pode conceder cupons de desconto caso a caso.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(6)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition"
              >
                <span>Este serviço garante lucros no mercado financeiro?</span>
                {openFaq === 6 ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === 6 && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  Absolutamente não. Em renda variável não existe garantia de retorno. O que entregamos é computação e probabilidade matemática baseada no histórico recente com backtest aberto. Toda decisão de aporte é de inteira responsabilidade do usuário.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 11. DISCLAIMER LEGAL E COMPLIANCE REGULATÓRIO (CVM) */}
        <section className="px-4 py-8 max-w-3xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left text-xs text-slate-400 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Aviso Legal, Compliance e Isenção de Responsabilidade (CVM)</span>
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
