'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DollarSign, PlusCircle, CheckCircle2, Clock, AlertCircle, RefreshCw, UserCheck, ShieldAlert, ArrowUpRight } from 'lucide-react'

type PartnerItem = {
  id: string
  name: string
  email: string
  companyName: string | null
  nivelParceiro: 'INDICADOR' | 'COMERCIAL_TREINADO'
  commissionRate: number
  maxAutoDiscountRate: number
  pendingBalance: number
  availableBalance: number
  totalEarned: number
  pixKey: string | null
}

type ClientItem = {
  id: string
  name: string
  email: string
}

type CommissionItem = {
  id: string
  partner: {
    user: { name: string; email: string }
  }
  clientName: string | null
  serviceName: string | null
  grossAmount: number | null
  amount: number
  rate: number
  status: 'EM_RETENCAO_30_DIAS' | 'LIBERADO' | 'SOLICITADO' | 'PAID' | 'CANCELLED'
  paymentDate: string
  releaseDate: string | null
  notes: string | null
  createdAt: string
}

export default function AdminComissoesPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [clients, setClients] = useState<ClientItem[]>([])
  const [commissions, setCommissions] = useState<CommissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Formulário: Lançar Recebimento Comissionado
  const [selectedPartnerId, setSelectedPartnerId] = useState('')
  const [clientType, setClientType] = useState<'EXISTING' | 'MANUAL'>('MANUAL')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [serviceName, setServiceName] = useState('SaaS Clínicas / Advogados (Assinatura)')
  const [grossAmount, setGrossAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/commissions')
      if (res.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await res.json()
      setPartners(data.partners || [])
      setClients(data.clients || [])
      setCommissions(data.commissions || [])
      if (data.partners?.length > 0 && !selectedPartnerId) {
        setSelectedPartnerId(data.partners[0].id)
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

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId)

  // Cálculo prévio em tempo real
  const calculatedRate = selectedPartner
    ? selectedPartner.nivelParceiro === 'INDICADOR'
      ? 0.15
      : Math.max(0.10, 0.20 - (selectedPartner.maxAutoDiscountRate || 0))
    : 0.15

  const previewCommission = Number(grossAmount) > 0 ? Number(grossAmount) * calculatedRate : 0

  const handleLaunchCommission = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatusMessage(null)

    try {
      const finalClientName = clientType === 'EXISTING'
        ? clients.find(c => c.id === selectedClientId)?.name || clientName
        : clientName

      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: selectedPartnerId,
          clientId: clientType === 'EXISTING' ? selectedClientId : undefined,
          clientName: finalClientName,
          clientEmail: clientEmail || undefined,
          serviceName,
          grossAmount: Number(grossAmount),
          paymentDate,
          notes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao lançar comissão')
      }

      setStatusMessage({ type: 'success', text: data.message })
      setGrossAmount('')
      setNotes('')
      await loadData()
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1 max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Módulo Financeiro Oficial
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Regra de Retenção D+30</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Lançamento e Gestão de Comissões
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Lançamento manual de recebimentos comissionados e acompanhamento da regra de liquidação de 30 dias.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm font-medium transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </button>
            <a
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-sm font-semibold transition"
            >
              Voltar ao Admin
            </a>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card: Formulário Lançar Recebimento Comissionado */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Lançar Recebimento Comissionado
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Calcula alíquota e agenda D+30</p>
              </div>
            </div>

            <form onSubmit={handleLaunchCommission} className="space-y-4">
              
              {/* Seleção de Parceiro */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Parceiro Beneficiário *
                </label>
                <select
                  required
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.nivelParceiro === 'INDICADOR' ? 'Nível 1 - 15%' : 'Nível 2 Comercial - 20%'})
                    </option>
                  ))}
                </select>
                {selectedPartner && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    Nível: <strong className="text-sky-600">{selectedPartner.nivelParceiro}</strong> • Alíquota Efetiva: <strong>{(calculatedRate * 100).toFixed(0)}%</strong>
                  </p>
                )}
              </div>

              {/* Cliente */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                    Cliente Pagador *
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setClientType('MANUAL')}
                      className={`font-medium ${clientType === 'MANUAL' ? 'text-sky-600 underline' : 'text-slate-400'}`}
                    >
                      Digitar
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setClientType('EXISTING')}
                      className={`font-medium ${clientType === 'EXISTING' ? 'text-sky-600 underline' : 'text-slate-400'}`}
                    >
                      Cadastrado
                    </button>
                  </div>
                </div>

                {clientType === 'EXISTING' ? (
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Nome do cliente ou empresa"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                  />
                )}
              </div>

              {/* Serviço Referente */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Serviço Referente *
                </label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                >
                  <option value="SaaS Clínicas / Advogados (Pré-venda R$ 200/mês)">SaaS Clínicas / Advogados (Pré-venda R$ 200/mês)</option>
                  <option value="Setup de Sistema (R$ 400 com desconto)">Setup de Sistema (R$ 400 com desconto)</option>
                  <option value="E-mail Corporativo Multi-Domínio">E-mail Corporativo Multi-Domínio</option>
                  <option value="Suporte Técnico Avulso (R$ 80/h)">Suporte Técnico Avulso (R$ 80/h)</option>
                  <option value="Manutenção e Sustentação (R$ 70/mês)">Manutenção e Sustentação (R$ 70/mês)</option>
                  <option value="MVP / Engenharia Sob Demanda">MVP / Engenharia Sob Demanda</option>
                </select>
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Valor Pago (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="Ex: 400.00"
                    value={grossAmount}
                    onChange={(e) => setGrossAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Data do Pagamento *
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Preview da Comissão */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Comissão Calculada:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatBRL(previewCommission)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Status Inicial:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">EM RETENÇÃO (30 DIAS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Data de Liberação:</span>
                  <span>{new Date(new Date(paymentDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Observações Internas
                </label>
                <textarea
                  rows={2}
                  placeholder="Número de nota, comprovante PIX ou acordo específico..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting ? 'Gravando Recebimento...' : 'Confirmar e Lançar Comissão'}
              </button>
            </form>
          </div>

          {/* Lista de Comissões e Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Resumo de Saldos dos Parceiros */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Saldos Consolidados dos Parceiros
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partners.slice(0, 6).map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{p.nivelParceiro} ({(p.commissionRate * 100).toFixed(0)}%)</p>
                    <div className="mt-2 flex justify-between text-xs pt-2 border-t border-slate-200 dark:border-zinc-700">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Liberado</span>
                        <strong className="text-emerald-600 font-bold">{formatBRL(p.availableBalance)}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Retido (30d)</span>
                        <strong className="text-amber-600 font-semibold">{formatBRL(p.pendingBalance)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Lançamentos Recentes */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Histórico de Comissões Cadastradas
                </h2>
                <span className="text-xs text-slate-500">{commissions.length} registros</span>
              </div>

              {commissions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-zinc-400 text-sm">
                  Nenhuma comissão lançada ainda. Use o formulário ao lado para cadastrar o primeiro recebimento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                        <th className="pb-3 font-semibold">Parceiro</th>
                        <th className="pb-3 font-semibold">Cliente / Serviço</th>
                        <th className="pb-3 font-semibold">Recebido</th>
                        <th className="pb-3 font-semibold">Comissão</th>
                        <th className="pb-3 font-semibold">Liberação</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {commissions.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition">
                          <td className="py-3">
                            <span className="font-semibold block text-slate-900 dark:text-white">{c.partner.user.name}</span>
                            <span className="text-[10px] text-slate-400">{c.partner.user.email}</span>
                          </td>
                          <td className="py-3">
                            <span className="font-medium text-slate-800 dark:text-zinc-200 block">{c.clientName || 'Cliente'}</span>
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate max-w-[180px] block">{c.serviceName}</span>
                          </td>
                          <td className="py-3 font-medium">
                            {c.grossAmount ? formatBRL(c.grossAmount) : '-'}
                          </td>
                          <td className="py-3">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatBRL(c.amount)}</span>
                            <span className="text-[10px] text-slate-400 block">{(c.rate * 100).toFixed(0)}%</span>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-zinc-300">
                            {c.releaseDate ? new Date(c.releaseDate).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="py-3">
                            {c.status === 'EM_RETENCAO_30_DIAS' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                <Clock className="w-3 h-3" />
                                Retenção 30d
                              </span>
                            )}
                            {c.status === 'LIBERADO' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                Liberado
                              </span>
                            )}
                            {c.status === 'PAID' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
                                Pago / PIX
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
