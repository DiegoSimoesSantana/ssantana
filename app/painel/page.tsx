'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  FileText,
  Clock,
  CreditCard,
  MessageCircle,
  Calendar,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Mail,
  Video,
  Sparkles,
  Heart,
  Gift,
} from 'lucide-react'

const WHATSAPP_VIP_URL = 'https://wa.me/5571999999999?text=Ol%C3%A1%2C%20sou%20cliente%20SSantana%20e%20gostaria%20de%20atendimento%20priorit%C3%A1rio.'
const CALENDAR_DECISOR_URL = 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ0F7YBCeVqWN-bBLEucbSzyEGjYitSxiVg52jw='

type ProjectClient = {
  id: string
  title: string
  description: string
  status: string
  totalValue: number
  startDate: string
  deadlineDate: string
  remainingDays: number
  serviceCredits: number
  serviceCreditsUsed: number
  creditExpiryDate: string | null
  meetingDate: string | null
  meetingUrl: string | null
  meetingNotes: string | null
  serviceReport: string | null
  completedAt: string | null
  contract: {
    id: string
    contractNumber: string | null
    status: string
    signedAt: string | null
    pdfUrl: string | null
  } | null
  payments: Array<{
    id: string
    amount: number
    status: string
    method: string
    paidAt: string | null
  }>
}

type ClientDonation = {
  id: string
  amount: number
  targetProject: string
  referenceId: string
  status: string
  paymentUrl: string | null
  paidAt: string | null
  createdAt: string
  message: string | null
}

export default function PainelClientePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [projects, setProjects] = useState<ProjectClient[]>([])
  const [donations, setDonations] = useState<ClientDonation[]>([])
  const [loading, setLoading] = useState(true)

  // Agendamento e Saldo Mensal (30 min / mês)
  const [agendamentoData, setAgendamentoData] = useState<{
    hasClient: boolean
    hasActiveService: boolean
    monthlyMinutesAllowed: number
    minutesUsedThisMonth: number
    isEligibleFreeMeeting: boolean
    schedules: Array<{
      id: string
      title: string
      description: string | null
      scheduledAt: string
      durationMinutes: number
      meetingUrl: string | null
      notes: string | null
      serviceReport: string | null
      status: string
      paymentRequired: boolean
      paymentUrl: string | null
      amountDue: number | null
    }>
  } | null>(null)

  const [showAgendamentoModal, setShowAgendamentoModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    scheduledAt: '',
    title: 'Reunião Técnica / Alinhamento (30 Min)',
    description: '',
  })
  const [bookingMsg, setBookingMsg] = useState<{ type: 'success' | 'error'; text: string; paymentUrl?: string } | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Modal de Solicitação de Alteração
  const [showAlteracaoModal, setShowAlteracaoModal] = useState(false)
  const [tipoAlteracao, setTipoAlteracao] = useState<'ADICIONAR_EMAIL' | 'UPGRADE_PLANO' | 'OUTRO'>('ADICIONAR_EMAIL')
  const [quantidadeEmails, setQuantidadeEmails] = useState(1)
  const [descricaoAlteracao, setDescricaoAlteracao] = useState('Desejo adicionar conta de e-mail corporativo.')
  const [sendingRequest, setSendingRequest] = useState(false)
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null)

  const loadAgendamentos = async () => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
      const res = await fetch(`/api/client/agendamentos?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setAgendamentoData(data)
      }
    } catch (e) {
      console.error('Erro ao carregar agendamentos:', e)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
      const res = await fetch(`/api/client/dashboard?${params.toString()}`)
      if (res.status === 401) {
        if (!params.get('ticket') && !params.get('email')) {
          window.location.href = '/sign-in'
          return
        }
      }
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setProjects(data.projects || [])
        setDonations(data.donations || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    loadAgendamentos()
  }, [])

  const handleBookMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingMsg(null)
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
      const res = await fetch(`/api/client/agendamentos?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: bookingForm.scheduledAt,
          title: bookingForm.title,
          description: bookingForm.description,
          clientEmail: user?.email,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao agendar reunião')
      setBookingMsg({
        type: 'success',
        text: data.message,
        paymentUrl: data.paymentUrl,
      })
      void loadAgendamentos()
      setTimeout(() => {
        if (!data.paymentUrl) {
          setShowAgendamentoModal(false)
          setBookingMsg(null)
        }
      }, 4000)
    } catch (err: any) {
      setBookingMsg({ type: 'error', text: err.message })
    } finally {
      setBookingLoading(false)
    }
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handleSendAlteracao = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingRequest(true)
    setRequestFeedback(null)

    try {
      const res = await fetch('/api/client/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoAlteracao,
          quantidade: quantidadeEmails,
          descricao: descricaoAlteracao,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar solicitação')
      }

      setRequestFeedback(data.message)
      setTimeout(() => {
        setShowAlteracaoModal(false)
        setRequestFeedback(null)
      }, 3000)
    } catch (err: any) {
      setRequestFeedback(`Erro: ${err.message}`)
    } finally {
      setSendingRequest(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1 max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Área Exclusiva do Cliente
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Paz de Espírito Tecnológica</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Olá, {user?.name || 'Cliente'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Acompanhe seus contratos, status de entrega e conte com suporte direto do decisor técnico.
            </p>
          </div>

          {/* BOTÕES DE ATENDIMENTO & DECISOR COM TRAVA PAY-BEFORE-BOOK */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_VIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              Grupo WhatsApp Prioritário
            </a>

            {projects.some((p) => p.payments.some((pay) => pay.status === 'COMPLETED' || pay.status === 'PAID') || p.status === 'IN_PROGRESS' || p.status === 'COMPLETED') ? (
              <a
                href={CALENDAR_DECISOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs sm:text-sm font-bold transition shadow-md active:scale-95 border border-emerald-500"
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                Pagamento Confirmado: Clique Aqui para Escolher seu Horário na Agenda
              </a>
            ) : (
              <div
                title="Agenda bloqueada. Contrate e confirme o pagamento do serviço primeiro para liberar a escolha de horário."
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-xs sm:text-sm font-semibold cursor-not-allowed opacity-80"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Agenda Bloqueada (Pague Primeiro para Agendar)</span>
              </div>
            )}
          </div>
        </div>

        {/* BENEFÍCIO MENSAL DE REUNIÃO TÉCNICA (30 MINUTOS INCLUSOS / MÊS POR SERVIÇO ATIVO) */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Suporte & Reunião Técnica com o Especialista
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
                    30 Minutos / Mês Inclusos
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cada cliente com serviço ativo possui direito a pelo menos 30 minutos mensais de alinhamento com Diego Santana.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setBookingMsg(null)
                  setShowAgendamentoModal(true)
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
              >
                <Calendar className="w-4 h-4" />
                Agendar Reunião Técnica
              </button>
            </div>
          </div>

          {/* Status da Cota Mensal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Serviços Ativos
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                {agendamentoData?.hasActiveService ? '✓ Possui Serviço em Vigência' : 'Nenhum Serviço Ativo'}
              </p>
              <span className="text-[11px] text-slate-400">
                {agendamentoData?.hasActiveService ? 'Garante cota gratuita de reunião mensal' : 'Atendimento avulso sob consulta'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Saldo de Minutos Neste Mês
              </span>
              <p className="text-sm font-bold text-indigo-300 mt-0.5">
                {agendamentoData?.isEligibleFreeMeeting
                  ? `${Math.max(0, (agendamentoData?.monthlyMinutesAllowed || 30) - (agendamentoData?.minutesUsedThisMonth || 0))} Minutos Disponíveis`
                  : 'Cota Deste Mês Utilizada'}
              </p>
              <span className="text-[11px] text-slate-400">
                {agendamentoData?.minutesUsedThisMonth || 0} min consumidos em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Status de Elegibilidade
              </span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {agendamentoData?.isEligibleFreeMeeting
                  ? '✓ Gratuito (Incluso no Pacote)'
                  : agendamentoData?.hasActiveService
                  ? 'Cota Esgotada (Renovação no próximo dia 1)'
                  : 'Avulso (R$ 50,00)'}
              </p>
              <span className="text-[11px] text-slate-400">
                Atendimento remoto via Google Meet
              </span>
            </div>
          </div>

          {/* Lista de Reuniões Marcadas pelo Cliente */}
          {agendamentoData?.schedules && agendamentoData.schedules.length > 0 && (
            <div className="pt-3 border-t border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Suas Reuniões Agendadas / Histórico
              </h4>
              <div className="space-y-2">
                {agendamentoData.schedules.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">{s.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : s.status === 'CONFIRMED' || s.status === 'VALID'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : s.status === 'PAID_IN_MEETING'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {s.status === 'COMPLETED'
                            ? 'CONCLUÍDA'
                            : s.status === 'CONFIRMED'
                            ? 'CONFIRMADA'
                            : s.status === 'VALID'
                            ? 'VÁLIDA (INCLUSA NO PLANO)'
                            : s.status === 'PAID_IN_MEETING'
                            ? 'PAGO NA REUNIÃO'
                            : 'AGUARDANDO PAGAMENTO'}
                        </span>
                        <span className="text-slate-400">
                          {s.durationMinutes} min
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">
                        📅 <strong>{new Date(s.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</strong>
                        {s.description ? ` • ${s.description}` : ''}
                      </p>
                      {s.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5">{s.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {s.meetingUrl ? (
                        <a
                          href={s.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Entrar na Sala da Reunião
                        </a>
                      ) : (
                        <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-900/60">
                          Link será enviado antes do horário
                        </span>
                      )}

                      {s.paymentRequired && s.paymentUrl && s.status === 'PENDING_PAYMENT' && (
                        <a
                          href={s.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pagar R$ 50
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projetos / SaaS Contratados */}
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-sm">
            <ShieldCheck className="w-12 h-12 text-sky-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum serviço em implantação no momento</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Se você acabou de fechar um contrato, nossa equipe técnica está provisionando seus servidores.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6"
              >
                
                {/* Header do Projeto & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{proj.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{proj.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* SESSÃO DE ATENDIMENTO, REUNIÃO & CRÉDITOS */}
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-700/60 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Sessão Técnica & Crédito de Atendimento
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-zinc-400">
                          Acompanhamento direto com o decisor técnico
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        Créditos: {proj.serviceCredits - (proj.serviceCreditsUsed || 0) > 0 ? `${proj.serviceCredits - (proj.serviceCreditsUsed || 0)} Disponível` : 'Utilizado'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        Válido até: {new Date(proj.creditExpiryDate || proj.deadlineDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Se o serviço já foi concluído pelo técnico */}
                  {proj.status === 'COMPLETED' ? (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Atendimento Concluído com Sucesso!</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400">
                        Serviço finalizado em: {proj.completedAt ? new Date(proj.completedAt).toLocaleDateString('pt-BR') : 'Finalizado pela equipe técnica'}.
                      </p>
                      {proj.serviceReport && (
                        <div className="mt-2 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-emerald-100 dark:border-emerald-900 text-xs text-slate-700 dark:text-zinc-300 whitespace-pre-line">
                          <strong className="block text-slate-900 dark:text-white mb-1">Relatório da Entrega / Resumo:</strong>
                          {proj.serviceReport}
                        </div>
                      )}
                    </div>
                  ) : proj.meetingDate ? (
                    /* Se a reunião foi agendada */
                    <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 block">
                            Horário Agendado com o Decisor Técnico:
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            {new Date(proj.meetingDate).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
                          </h4>
                        </div>

                        {proj.meetingUrl ? (
                          <a
                            href={proj.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 shrink-0"
                          >
                            <Video className="w-4 h-4" />
                            <span>Entrar na Sala Virtual da Reunião</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Link da reunião será disponibilizado em breve</span>
                        )}
                      </div>

                      {proj.meetingNotes && (
                        <div className="text-xs text-slate-600 dark:text-zinc-400 border-t border-sky-100 dark:border-sky-900 pt-2">
                          <strong className="text-slate-800 dark:text-zinc-200">Orientações do Especialista:</strong> {proj.meetingNotes}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Se ainda não agendou a reunião */
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          Aguardando Agendamento
                        </span>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                          Seu pagamento foi confirmado! Escolha o dia e horário que melhor se adapta à sua rotina para realizar a sessão.
                        </p>
                      </div>

                      <a
                        href={CALENDAR_DECISOR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 shrink-0"
                      >
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>Agendar Horário na Agenda Google</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* CRONÔMETRO DE 30 DIAS DE IMPLANTAÇÃO */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-zinc-800/80 dark:to-zinc-800/40 border border-sky-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                        Cronômetro de Implantação do SaaS
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                        {proj.remainingDays} dias restantes
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Meta de entrega: {new Date(proj.deadlineDate).toLocaleDateString('pt-BR')} (prazo máximo de 30 dias após assinatura).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowAlteracaoModal(true)
                      setRequestFeedback(null)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-white dark:bg-zinc-800 hover:bg-sky-50 dark:hover:bg-zinc-700 text-xs font-semibold text-sky-700 dark:text-sky-300 transition shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Solicitar Alteração / Adicionar E-mail (R$ 15)
                  </button>
                </div>

                {/* Grid: Contratos & Faturas PicPay */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card Contrato */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                          Contrato Digital
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-sky-600">
                        {proj.contract?.contractNumber || 'SS-2026-PENDENTE'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                      <p>Status: <strong className="text-emerald-600">{proj.contract?.status || 'Assinado'}</strong></p>
                      <p>Assinado em: {proj.contract?.signedAt ? new Date(proj.contract.signedAt).toLocaleDateString('pt-BR') : 'Protocolo digital registrado'}</p>
                    </div>

                    <a
                      href="/contratos/validar"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Verificar protocolo Anti-MED
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Card Faturas PicPay */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                          Faturas & Pagamentos PicPay
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">PIX / Cartão</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                      <p>Valor Total Contratado: <strong>{formatBRL(proj.totalValue)}</strong></p>
                      <p>Histórico de pagamentos confirmados e comprovantes eletrônicos.</p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pagamento em dia
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

        {/* SEÇÃO: MINHAS DOAÇÕES & APOIO A PROJETOS GRATUITOS */}
        <div className="mt-8 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                Minhas Contribuições & Apoio a Projetos Gratuitos
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Acompanhe o reconhecimento de doações para aplicativos comunitários (ex: Bloqueador de Chamadas de Não Contatos).
              </p>
            </div>
            <a
              href="/doacoes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition"
            >
              <Gift className="w-4 h-4" />
              Apoiar Projetos Gratuitos
            </a>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
              <Heart className="w-7 h-7 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-zinc-400">Nenhuma doação registrada nesta conta.</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                Você pode votar e doar a partir de R$ 1,00 para impulsionar ferramentas abertas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {d.targetProject || 'Geral / Manutenção Comunitária'}
                      </span>
                      {d.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Pagamento Reconhecido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          Aguardando Pagamento
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                      Ref: {d.referenceId} • {new Date(d.createdAt).toLocaleDateString('pt-BR')} às {new Date(d.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {d.paidAt && ` • Reconhecido em: ${new Date(d.paidAt).toLocaleDateString('pt-BR')} às ${new Date(d.paidAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    {d.message && (
                      <p className="text-xs text-slate-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-800 p-2 rounded mt-1">
                        "{d.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Valor</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatBRL(d.amount)}
                      </p>
                    </div>

                    {d.status === 'PENDING' && (
                      <a
                        href="/doacoes"
                        className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition"
                      >
                        Ver QR Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {showAlteracaoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Solicitar Alteração / Adicional
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Atendimento direto pela equipe de engenharia</p>
                </div>
                <button
                  onClick={() => setShowAlteracaoModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {requestFeedback && (
                <div className="mb-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 text-xs text-sky-800 dark:text-sky-300">
                  {requestFeedback}
                </div>
              )}

              <form onSubmit={handleSendAlteracao} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Tipo de Alteração
                  </label>
                  <select
                    value={tipoAlteracao}
                    onChange={(e) => setTipoAlteracao(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  >
                    <option value="ADICIONAR_EMAIL">Adicionar Conta de E-mail Corporativo (R$ 15/mês)</option>
                    <option value="UPGRADE_PLANO">Upgrade de Plano / Infraestrutura</option>
                    <option value="OUTRO">Outra Alteração Técnica</option>
                  </select>
                </div>

                {tipoAlteracao === 'ADICIONAR_EMAIL' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                      Quantidade de Novas Contas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantidadeEmails}
                      onChange={(e) => setQuantidadeEmails(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-bold"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Acréscimo mensal estimado: <strong>{formatBRL(quantidadeEmails * 15)}/mês</strong>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Detalhes do Pedido
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ex: Criar as contas financeiro@empresa.com e contato@empresa.com"
                    value={descricaoAlteracao}
                    onChange={(e) => setDescricaoAlteracao(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-sky-600/20 disabled:opacity-50"
                >
                  {sendingRequest ? 'Enviando Pedido...' : 'Enviar Solicitação para a Equipe'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AGENDAR REUNIÃO TÉCNICA (30 MIN) */}
        {showAgendamentoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Agendar Reunião Técnica (30 Min)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Atendimento exclusivo com Diego Santana (Decisor Técnico)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAgendamentoModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {bookingMsg && (
                <div
                  className={`p-4 rounded-2xl text-xs space-y-2 ${
                    bookingMsg.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <p className="font-semibold">{bookingMsg.text}</p>
                  {bookingMsg.paymentUrl && (
                    <a
                      href={bookingMsg.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pagar R$ 50 via PicPay / PIX
                    </a>
                  )}
                </div>
              )}

              {/* Status do Benefício */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-zinc-300 space-y-1">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 block">
                  Regra do Atendimento:
                </span>
                <p>
                  {agendamentoData?.isEligibleFreeMeeting
                    ? '✓ Esta reunião será coberta pelo seu benefício mensal de 30 minutos por serviço ativo (sem custo adicional).'
                    : 'Atenção: Você já utilizou os 30 min deste mês ou não possui serviço ativo. O agendamento é avulso (taxa técnica de R$ 50,00) que pode ser paga pelo link gerado ou acertada diretamente na reunião.'}
                </p>
              </div>

              <form onSubmit={handleBookMeeting} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Data e Horário Pretendido *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingForm.scheduledAt}
                    onChange={(e) => setBookingForm({ ...bookingForm, scheduledAt: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Horário de Brasília (Atendimentos de Segunda a Sexta, das 09h às 18h).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Assunto / Pauta Principal
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.title}
                    onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                    placeholder="Ex: Alinhamento de escopo, Suporte ao servidor ou Dúvidas"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Descrição Detalhada do que Precisa Resolver
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                    placeholder="Descreva brevemente os pontos que deseja discutir para otimizar os 30 minutos."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAgendamentoModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Processando Agendamento...' : 'Confirmar Solicitação de Agenda'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
