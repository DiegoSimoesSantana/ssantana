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
  Sparkles
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

export default function PainelClientePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [projects, setProjects] = useState<ProjectClient[]>([])
  const [loading, setLoading] = useState(true)

  // Modal de Solicitação de Alteração
  const [showAlteracaoModal, setShowAlteracaoModal] = useState(false)
  const [tipoAlteracao, setTipoAlteracao] = useState<'ADICIONAR_EMAIL' | 'UPGRADE_PLANO' | 'OUTRO'>('ADICIONAR_EMAIL')
  const [quantidadeEmails, setQuantidadeEmails] = useState(1)
  const [descricaoAlteracao, setDescricaoAlteracao] = useState('Desejo adicionar conta de e-mail corporativo.')
  const [sendingRequest, setSendingRequest] = useState(false)
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null)

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
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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

        {/* MODAL: SOLICITAR ALTERAÇÃO (EX: ADICIONAR CONTA DE E-MAIL POR R$ 15) */}
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

      </main>

      <Footer />
    </div>
  )
}
