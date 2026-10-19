'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles,
  Wrench,
  Globe,
  Mail,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  CreditCard,
  Calendar,
  Lock,
  ExternalLink,
  Copy,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { DynamicPricingConfig, DEFAULT_DYNAMIC_PRICING } from '@/lib/dynamic-pricing'

interface VitrineOfertasProps {
  pricing?: DynamicPricingConfig
  whatsappNumber?: string
}

type ServiceTypeKey = 'SUPORTE_30M' | 'SUPORTE_1H' | 'MVP_IA' | 'SAAS_CLINICAS' | 'EMAIL'

const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ0F7YBCeVqWN-bBLEucbSzyEGjYitSxiVg52jw='

const CLIENT_STORAGE_KEY = 'ssantana_client_checkout_profile'
const CLIENT_COOKIE_KEY = 'ssantana_client_profile'

function getSavedClientData(): { name?: string; email?: string; phone?: string; document?: string } | null {
  if (typeof window === 'undefined') return null
  try {
    // 1. Tentar ler do localStorage
    const raw = window.localStorage.getItem(CLIENT_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
    // 2. Tentar ler dos cookies do navegador
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + CLIENT_COOKIE_KEY + '=([^;]*)'))
    if (match && match[2]) {
      const parsed = JSON.parse(decodeURIComponent(match[2]))
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch (e) {
    console.warn('Erro ao ler dados salvos do cliente:', e)
  }
  return null
}

function persistClientData(data: { name: string; email: string; phone: string; document: string }) {
  if (typeof window === 'undefined') return
  try {
    const json = JSON.stringify(data)
    window.localStorage.setItem(CLIENT_STORAGE_KEY, json)
    // Cookie persistente por 365 dias para recontratação e facilidade do cliente
    const maxAge = 365 * 24 * 60 * 60
    document.cookie = `${CLIENT_COOKIE_KEY}=${encodeURIComponent(json)}; max-age=${maxAge}; path=/; SameSite=Lax`
  } catch (e) {
    console.warn('Erro ao salvar dados do cliente:', e)
  }
}

function clearSavedClientData() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CLIENT_STORAGE_KEY)
    document.cookie = `${CLIENT_COOKIE_KEY}=; max-age=0; path=/;`
  } catch (e) {}
}

export default function VitrineOfertasRapidas({
  pricing = DEFAULT_DYNAMIC_PRICING,
  whatsappNumber = '5571988068222',
}: VitrineOfertasProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // Estado do Modal Pay-Before-Book Gate
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<{
    key: ServiceTypeKey
    title: string
    price: number
    subtitle: string
  } | null>(null)

  // Formulário do cliente com detecção de pré-preenchimento
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    acceptedTerms: false,
  })
  const [isPreFilled, setIsPreFilled] = useState(false)

  // Estados da cobrança / PicPay
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

  // Estado de confirmação de pagamento (Gate liberado)
  const [isPaymentPaid, setIsPaymentPaid] = useState(false)
  const [copiedPix, setCopiedPix] = useState(false)
  const [simulatingPayment, setSimulatingPayment] = useState(false)

  // Carrega dados salvos no storage/cookie ou da sessão ativa ao inicializar
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
    }

    // Se houver sessão de cliente logado, também aproveita dados da conta
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
            if (!prev.name && data.user.name) {
              persistClientData(updated)
              setIsPreFilled(true)
            }
            return updated
          })
        }
      })
      .catch(() => {})
  }, [])

  const updateClientField = (field: 'name' | 'email' | 'phone' | 'document' | 'acceptedTerms', value: any) => {
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
      return updated
    })
  }

  const handleClearPreFilled = () => {
    clearSavedClientData()
    setClientData({
      name: '',
      email: '',
      phone: '',
      document: '',
      acceptedTerms: false,
    })
    setIsPreFilled(false)
  }

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  // Abrir Modal de Checkout Seguro com Trava "Pague Primeiro, Agende Depois"
  const handleOpenCheckoutModal = (
    key: ServiceTypeKey,
    title: string,
    price: number,
    subtitle: string
  ) => {
    setSelectedService({ key, title, price, subtitle })
    setOrderResult(null)
    setIsPaymentPaid(false)
    setOrderError(null)

    // Atualiza com os dados salvos mais recentes
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
    }

    setModalOpen(true)
  }

  // Submissão do Formulário para gerar cobrança PicPay
  const handleGeneratePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return

    if (!clientData.acceptedTerms) {
      setOrderError('Você deve concordar com o termo de reserva e retenção de horário para continuar.')
      return
    }

    // Persiste dados preenchidos para compras e recontratações futuras
    persistClientData({
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      document: clientData.document,
    })
    setIsPreFilled(true)

    setGeneratingOrder(true)
    setOrderError(null)

    try {
      const res = await fetch('/api/payments/picpay-quick-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedService.key,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          document: clientData.document,
          acceptedTerms: clientData.acceptedTerms,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar pedido.')
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

  // Polling automático para detecção do pagamento PAID e liberação do botão do Google Calendar
  useEffect(() => {
    if (!orderResult?.referenceId || isPaymentPaid) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status/${orderResult.referenceId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.paid || data.status === 'PAID' || data.status === 'COMPLETED') {
            setIsPaymentPaid(true)
            clearInterval(interval)
          }
        }
      } catch (e) {
        console.error('Polling error:', e)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [orderResult, isPaymentPaid])

  // Ação para simular aprovação do pagamento em ambiente de testes/demonstração
  const handleSimulatePaymentApproval = async () => {
    if (!orderResult?.referenceId) return
    setSimulatingPayment(true)
    try {
      const res = await fetch(`/api/payments/status/${orderResult.referenceId}?simulate=true`)
      if (res.ok) {
        const data = await res.json()
        if (data.paid || data.status === 'PAID') {
          setIsPaymentPaid(true)
        }
      }
    } catch (e) {
      console.error('Falha ao simular aprovação:', e)
    } finally {
      setSimulatingPayment(false)
    }
  }

  const copyPixToClipboard = async () => {
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
    } catch (err) {
      console.error('Falha ao copiar PIX:', err)
    }
  }

  return (
    <section id="ofertas-entrada" className="py-20 px-4 bg-white dark:bg-zinc-950 transition-colors">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Baixa Barreira de Entrada • Resolução Imediata
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Escolha a Solução Ideal para o Momento da Sua Empresa
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2">
            Contratação ágil com liberação imediata da agenda técnica assim que o pagamento for confirmado via PicPay ou PIX.
          </p>
        </div>

        {/* Grid de 4 Ofertas de Alta Conversão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* OFERTA 1: MVP / Criação de Sites e Sistemas Web com IA */}
          <div className="rounded-3xl border-2 border-sky-500/40 bg-slate-50/50 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white uppercase tracking-wider">
                  Mais Popular
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Criação de Sites e Sistemas com IA (MVP Rápido)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Ideal para tirar ideias do papel, lançar produtos e profissionalizar o negócio com tecnologia de ponta sem gastar milhares de reais.
              </p>

              {/* Preço */}
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-xs text-slate-400 line-through block">
                  De {formatBRL(pricing.mvpSiteIaReferencePrice)}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Entrada a partir de</span>
                  <span className="text-3xl font-black text-sky-600 dark:text-sky-400">
                    {formatBRL(pricing.mvpSiteIaPrice)}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1 block">
                  + Sustentação mensal opcional de apenas {formatBRL(pricing.manutencaoMensalPrice)}/mês.
                </span>
              </div>

              {/* Acordeão */}
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 mb-6">
                <button
                  type="button"
                  onClick={() => toggleAccordion('mvp')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-sky-600 transition"
                >
                  <span>{openAccordion === 'mvp' ? 'Ocultar detalhes' : 'Ver tudo o que está incluso'}</span>
                  {openAccordion === 'mvp' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openAccordion === 'mvp' && (
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-zinc-400 animate-fade-in">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Desenvolvimento ágil com auxílio de IA (Next.js & Tailwind).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Configuração de domínio próprio e hospedagem de alta velocidade.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Otimizado para conversão no celular (Mobile First).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Entrega do primeiro protótipo funcional em poucos dias.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenCheckoutModal(
                  'MVP_IA',
                  'Criação de Sites e Sistemas com IA (MVP Rápido)',
                  pricing.mvpSiteIaPrice,
                  'Entrada para prototipação e kickoff imediato'
                )
              }
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Contratar com PIX / Cartão (PicPay)
            </button>
          </div>

          {/* OFERTA 2: SOS Suporte de TI Remoto (Hora Técnica & 30 min por R$ 40,00) */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 uppercase tracking-wider">
                  Atendimento Imediato
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                SOS Suporte de TI Remoto (Hora Técnica)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Destrave problemas urgentes em computadores, redes e sistemas sem sair do seu escritório.
              </p>

              {/* Preço Proporcional Exato: 30 min R$ 40,00 e 1h R$ 80,00 */}
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Diagnóstico / 30 Minutos:</span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                    {formatBRL(pricing.suporteRapido30MinPrice)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-slate-100 dark:border-zinc-700 pt-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">1 Hora Completa Especializada:</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatBRL(pricing.suporteRemoto1hPrice)}
                  </span>
                </div>
              </div>

              {/* Acordeão */}
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 mb-6">
                <button
                  type="button"
                  onClick={() => toggleAccordion('suporte')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-amber-600 transition"
                >
                  <span>{openAccordion === 'suporte' ? 'Ocultar detalhes' : 'Ver casos comuns resolvidos'}</span>
                  {openAccordion === 'suporte' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openAccordion === 'suporte' && (
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-zinc-400 animate-fade-in">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Configuração de Certificado Digital (A1 / A3 Token) para advogados e contadores.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Limpeza de lentidão, remoção de malwares e ajustes de rede corporativa.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Configuração de roteadores, impressoras e compartilhamentos seguros.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Conexão remota criptografada via AnyDesk / TeamViewer / Google Meet.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() =>
                  handleOpenCheckoutModal(
                    'SUPORTE_30M',
                    'Diagnóstico / Suporte Rápido Remoto (30 Minutos)',
                    pricing.suporteRapido30MinPrice,
                    'Atendimento expresso de 30 minutos com decisor técnico'
                  )
                }
                className="py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Zap className="w-4 h-4" />
                30 Min • {formatBRL(pricing.suporteRapido30MinPrice)}
              </button>

              <button
                onClick={() =>
                  handleOpenCheckoutModal(
                    'SUPORTE_1H',
                    'SOS Suporte de TI Remoto Especializado (1 Hora)',
                    pricing.suporteRemoto1hPrice,
                    'Sessão completa de 1 hora técnica especializada'
                  )
                }
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-bold text-xs sm:text-sm text-center transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Clock className="w-4 h-4 text-amber-500" />
                1 Hora • {formatBRL(pricing.suporteRemoto1hPrice)}
              </button>
            </div>
          </div>

          {/* OFERTA 3: SaaS para Clínicas, Psicólogos e Advogados */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase tracking-wider">
                  Lote Promocional
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                SaaS Clínicas, Psicólogos & Advogados
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Sistema completo: Site próprio, agenda sincronizada ao Google/Outlook e Bot de WhatsApp 24/7.
              </p>

              {/* Preço */}
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-xs text-slate-400 line-through block">
                  Valor normal após 3 meses: {formatBRL(pricing.saasVerticalNormalPrice)}/mês
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatBRL(pricing.saasVerticalPromoPrice)}/mês
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">nos primeiros 3 meses</span>
                </div>
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mt-1 block">
                  ✓ Sem fidelidade • Prazo de implantação: 30 dias após assinatura.
                </span>
              </div>

              {/* Acordeão */}
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 mb-6">
                <button
                  type="button"
                  onClick={() => toggleAccordion('saas')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-emerald-600 transition"
                >
                  <span>{openAccordion === 'saas' ? 'Ocultar detalhes' : 'Ver diferenciais do sistema'}</span>
                  {openAccordion === 'saas' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openAccordion === 'saas' && (
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-zinc-400 animate-fade-in">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Padrão homologado AutoMed Bahia (médicos, dentistas e terapeutas).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Agenda integrada por especialista e por sala de atendimento.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Bot no WhatsApp confirma consultas automaticamente, reduzindo faltas em até 30%.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Contrato com blindagem anti-chargeback (código de 6 dígitos).</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenCheckoutModal(
                  'SAAS_CLINICAS',
                  'SaaS Clínicas, Psicólogos & Escritórios Jurídicos',
                  pricing.saasVerticalPromoPrice,
                  'Mensalidade dos primeiros 3 meses promocionais'
                )
              }
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Garantir Lote Promocional
            </button>
          </div>

          {/* OFERTA 4: E-mail Corporativo Profissional */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 uppercase tracking-wider">
                  Blindagem Antispam
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                E-mail Corporativo Profissional
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Passe autoridade com @suaempresa.com.br. Servidor próprio econômico ou Google Workspace/Microsoft 365.
              </p>

              {/* Preço */}
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <span className="text-xs text-slate-400 line-through block">
                  Setup de referência: {formatBRL(pricing.emailSetupReferencePrice)}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatBRL(pricing.emailMensalPorContaPrice)}/mês
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">por conta de 5GB</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1 block">
                  Setup promocional sob medida a partir de {formatBRL(pricing.emailSetupPromocionalPrice)}.
                </span>
              </div>

              {/* Acordeão */}
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 mb-6">
                <button
                  type="button"
                  onClick={() => toggleAccordion('email')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-indigo-600 transition"
                >
                  <span>{openAccordion === 'email' ? 'Ocultar detalhes' : 'Ver especificações técnicas'}</span>
                  {openAccordion === 'email' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openAccordion === 'email' && (
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-zinc-400 animate-fade-in">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>SPF, DKIM e DMARC configurados para evitar que seus e-mails caiam no Spam.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Acesso via Webmail moderno, Outlook, celular (IMAP/SMTP).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Adicione contas extras a qualquer momento por apenas R$ 15/mês no painel.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenCheckoutModal(
                  'EMAIL',
                  'E-mail Corporativo Profissional Blindado',
                  pricing.emailSetupPromocionalPrice,
                  'Setup de implantação antispam e configuração DNS'
                )
              }
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Configurar E-mail Profissional
            </button>
          </div>

        </div>

      </div>

      {/* MODAL: TRAVA "PAGUE PRIMEIRO, AGENDE DEPOIS" (PAY-BEFORE-BOOK GATE) */}
      {modalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            
            {/* Fechar Modal */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold p-1"
            >
              ✕
            </button>

            {/* Cabeçalho do Modal com Trava */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Trava Obrigatória: Pague Primeiro, Agende Depois</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedService.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {selectedService.subtitle}
              </p>
            </div>

            {/* FASE 1: FORMULÁRIO DO CLIENTE & TERMO DE RETENÇÃO */}
            {!orderResult && (
              <form onSubmit={handleGeneratePayment} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Total a Pagar (PicPay / PIX):</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatBRL(selectedService.price)}
                  </span>
                </div>

                {orderError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                    {orderError}
                  </div>
                )}

                {isPreFilled && (
                  <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs text-sky-800 dark:text-sky-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>Dados pré-preenchidos do seu cadastro.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearPreFilled}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 underline shrink-0 ml-2"
                    >
                      Limpar dados
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Nome Completo / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome ou razão social"
                    value={clientData.name}
                    onChange={(e) => updateClientField('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={clientData.email}
                      onChange={(e) => updateClientField('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(71) 98888-8888"
                      value={clientData.phone}
                      onChange={(e) => updateClientField('phone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    CPF ou CNPJ (Obrigatório para Emissão PicPay) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    value={clientData.document}
                    onChange={(e) => updateClientField('document', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-mono"
                  />
                </div>

                {/* CHECKBOX DO TERMO DE RETENÇÃO E POLÍTICA DE CANCELAMENTO */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                    <input
                      type="checkbox"
                      required
                      checked={clientData.acceptedTerms}
                      onChange={(e) => setClientData({ ...clientData, acceptedTerms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 shrink-0"
                    />
                    <span>
                      <strong>Termo de Reserva da Agenda:</strong> Estou ciente de que o horário será reservado exclusivamente para meu atendimento. Em caso de cancelamento com menos de 24h de antecedência ou não comparecimento (no-show), haverá retenção da taxa técnica para cobrir a reserva do especialista. O link da agenda só será liberado após a confirmação do pagamento.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={generatingOrder}
                  className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {generatingOrder ? 'Gerando Cobrança PicPay...' : 'Gerar Cobrança e Liberar Agenda'}
                </button>
              </form>
            )}

            {/* FASE 2: COBRANÇA GERADA (PIX / QR CODE PICPAY) & TRAVA DE AGENDAMENTO */}
            {orderResult && !isPaymentPaid && (
              <div className="space-y-5 animate-fade-in text-center">
                
                {/* Status da Trava */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0 font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Agenda Temporariamente Bloqueada
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Realize o pagamento no PicPay abaixo. Assim que compensar, a agenda com o Google Calendar será destravada automaticamente nesta tela.
                    </p>
                  </div>
                </div>

                {/* QR Code PIX */}
                {orderResult.qrcode?.base64Image && (
                  <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl border border-slate-200 dark:border-zinc-700 space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 block">
                        Pague com PIX pelo seu Banco
                      </span>
                      <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium mt-0.5">
                        Aponte a câmera do celular no QR Code abaixo:
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                      <img
                        src={orderResult.qrcode.base64Image}
                        alt="QR Code PIX PicPay Oficial"
                        className="w-52 h-52 object-contain"
                      />
                    </div>

                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Valor: {selectedService ? formatBRL(selectedService.price) : 'R$ 50,00'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                        Identificador: {orderResult.referenceId}
                      </span>
                    </div>
                  </div>
                )}

                {/* Copia e Cola PIX */}
                {orderResult.qrcode?.content && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={copyPixToClipboard}
                      className="w-full py-3.5 px-4 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-950 text-sky-800 dark:text-sky-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-sky-300 dark:border-sky-800 transition shadow-sm active:scale-95"
                    >
                      <Copy className="w-4 h-4 text-sky-600" />
                      {copiedPix ? '✓ Código PIX Copiado com Sucesso!' : 'Copiar Código PIX (Copia e Cola)'}
                    </button>
                    {copiedPix && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                        Código pronto! Abra o app do seu banco e escolha a opção &quot;PIX Copia e Cola&quot;.
                      </p>
                    )}
                  </div>
                )}

                {/* Botão para Checkout direto no PicPay */}
                {orderResult.paymentUrl && (
                  <a
                    href={orderResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Pagar no App do PicPay / Cartão de Crédito
                  </a>
                )}

                {/* Botão de simulação quando em modo de teste/demo */}
                {orderResult.isMock && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-left space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Modo Demonstração (Chaves PicPay pendentes)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                      As credenciais oficiais do PicPay podem ser configuradas no painel em <strong>/admin/configuracoes</strong>. Para testar o desbloqueio da agenda agora:
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulatePaymentApproval}
                      disabled={simulatingPayment}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {simulatingPayment ? 'Processando validação...' : 'Simular Pagamento Aprovado e Destravar Agenda'}
                    </button>
                  </div>
                )}

                {/* Indicador de checagem em tempo real */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Aguardando confirmação do banco em tempo real...</span>
                </div>
              </div>
            )}

            {/* FASE 3: PAGAMENTO CONFIRMADO (GATE LIBERADO!) */}
            {isPaymentPaid && (
              <div className="space-y-6 animate-fade-in text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-widest">
                    Status: PAID • Confirmado
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                    Pagamento Aprovado com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                    Sua contratação foi validada. O acesso à agenda do decisor técnico sênior está liberado.
                  </p>
                </div>

                {/* BOTÃO LIBERADO PARA ESCOLHER HORÁRIO NA AGENDA */}
                <a
                  href={GOOGLE_CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-xl transition active:scale-95 border-2 border-emerald-500"
                >
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <span>Pagamento Confirmado: Clique Aqui para Escolher seu Horário na Agenda</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>

                <div className="pt-2">
                  <a
                    href="/painel"
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 underline"
                  >
                    Acessar o Painel do Cliente e acompanhar seu protocolo
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  )
}
