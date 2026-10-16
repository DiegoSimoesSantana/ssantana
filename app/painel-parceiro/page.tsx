'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  GraduationCap,
  FileCheck2,
  DollarSign,
  TrendingUp,
  BookOpen,
  Download,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Users,
  Briefcase,
  HelpCircle,
  FileText
} from 'lucide-react'
import PartnerProspectionStats from '@/components/dashboard/PartnerProspectionStats'
import PartnerDirectReferralForm from '@/components/dashboard/PartnerDirectReferralForm'

type PartnerData = {
  id: string
  name: string
  email: string
  nivelParceiro: 'INDICADOR' | 'COMERCIAL_TREINADO'
  commissionRate: number
  maxAutoDiscountRate: number
  pixKey: string | null
  personType: string | null
  cpfCnpj: string | null
  availableBalance: number
  pendingBalance: number
  totalEarned: number
  canWithdraw: boolean
  minWithdrawalThreshold: number
}

type CommissionItem = {
  id: string
  clientName: string | null
  serviceName: string | null
  grossAmount: number | null
  amount: number
  rate: number
  status: string
  paymentDate: string
  releaseDate: string | null
}

type WithdrawalItem = {
  id: string
  requestedAmount: number
  taxOption: string
  taxAmount: number
  netAmount: number
  status: string
  pixKey: string
  createdAt: string
}

export default function PainelParceiroPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACADEMIA' | 'CONTRATOS' | 'LEADS'>('OVERVIEW')
  const [partner, setPartner] = useState<PartnerData | null>(null)
  const [commissions, setCommissions] = useState<CommissionItem[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([])
  const [loading, setLoading] = useState(true)

  // Modal de Saque (Funil de Formalização)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [taxOption, setTaxOption] = useState<'PJ_MEI' | 'PF_CPF'>('PJ_MEI')
  const [withdrawPixKey, setWithdrawPixKey] = useState('')
  const [nfseUrl, setNfseUrl] = useState('')
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false)
  const [withdrawFeedback, setWithdrawFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modal de Aceite Contratual Bloqueante (se houver novo contrato ativo)
  const [contractPending, setContractPending] = useState(false)
  const [pendingContractVersion, setPendingContractVersion] = useState('2026.1')
  const [acceptingContract, setAcceptingContract] = useState(false)

  const loadPartnerData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/partners/commissions')
      if (res.status === 401) {
        window.location.href = '/sign-in'
        return
      }
      const data = await res.json()
      setPartner(data.partner)
      setCommissions(data.commissions || [])
      setWithdrawals(data.withdrawals || [])
      if (data.partner?.pixKey) {
        setWithdrawPixKey(data.partner.pixKey)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartnerData()
  }, [])

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handleRequestWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingWithdraw(true)
    setWithdrawFeedback(null)

    try {
      const res = await fetch('/api/partners/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          taxOption,
          pixKey: withdrawPixKey,
          nfseUrl: taxOption === 'PJ_MEI' ? nfseUrl : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao solicitar saque')
      }

      setWithdrawFeedback({ type: 'success', text: data.message })
      setWithdrawAmount('')
      await loadPartnerData()
    } catch (err: any) {
      setWithdrawFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmittingWithdraw(false)
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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {partner?.nivelParceiro === 'COMERCIAL_TREINADO'
                  ? 'Nível 2 • Ensino Comissionado (20%)'
                  : 'Nível 1 • Indicador Parceiro (15%)'}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                {partner?.personType === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Painel do Parceiro Comercial
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Acompanhe comissões retidas (D+30), saque liberado, registre leads e acesse o material comercial.
            </p>
          </div>

          {/* Botão de Saque com Threshold R$ 200 */}
          <div>
            <button
              onClick={() => {
                setShowWithdrawModal(true)
                setWithdrawFeedback(null)
                if (partner?.availableBalance) {
                  setWithdrawAmount(partner.availableBalance.toString())
                }
              }}
              disabled={!partner?.canWithdraw}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-md transition ${
                partner?.canWithdraw
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Solicitar Saque (PIX)
            </button>
            {!partner?.canWithdraw && (
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 text-right mt-1">
                Mínimo liberado para saque: R$ 200,00
              </p>
            )}
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-8 space-x-1 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'OVERVIEW'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Visão Geral & Comissões
          </button>
          <button
            onClick={() => setActiveTab('ACADEMIA')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'ACADEMIA'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Academia Comercial & Kit de Vendas
          </button>
          <button
            onClick={() => setActiveTab('CONTRATOS')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'CONTRATOS'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Meus Contratos
          </button>
          <button
            onClick={() => setActiveTab('LEADS')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'LEADS'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Cadastrar Lead Manual
          </button>
        </div>

        {/* CONTEÚDO DA ABA 1: VISÃO GERAL & COMISSÕES */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Grid de Cards de Saldo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Saldo Liberado para Saque
                </span>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                  {formatBRL(partner?.availableBalance || 0)}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                  Disponível para liquidação imediata via PIX (Threshold R$ 200).
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Em Retenção (30 Dias)
                </span>
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
                  {formatBRL(partner?.pendingBalance || 0)}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                  Aguardando prazo de proteção e liquidação bancária.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Total Acumulado Histórico
                </span>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {formatBRL(partner?.totalEarned || 0)}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                  Total gerado em comissões desde o início da parceria.
                </p>
              </div>

            </div>

            {/* Rastreio Híbrido de Prospectos */}
            <PartnerProspectionStats defaultRefCode={`PARC-${partner?.id?.slice(0, 6)?.toUpperCase()}`} />

            {/* Tabela de Comissões */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Extrato de Comissões e Liberações
              </h2>

              {commissions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Nenhuma comissão registrada ainda. Indique clientes ou cadastre leads manuais para começar.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500">
                        <th className="pb-3 font-semibold">Cliente</th>
                        <th className="pb-3 font-semibold">Serviço</th>
                        <th className="pb-3 font-semibold">Valor Cliente</th>
                        <th className="pb-3 font-semibold">Sua Comissão</th>
                        <th className="pb-3 font-semibold">Data do Pagamento</th>
                        <th className="pb-3 font-semibold">Previsão Liberação</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {commissions.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 font-semibold">{c.clientName || 'Cliente'}</td>
                          <td className="py-3 text-slate-600 dark:text-zinc-300">{c.serviceName}</td>
                          <td className="py-3">{c.grossAmount ? formatBRL(c.grossAmount) : '-'}</td>
                          <td className="py-3 font-bold text-emerald-600">
                            {formatBRL(c.amount)} ({(c.rate * 100).toFixed(0)}%)
                          </td>
                          <td className="py-3 text-slate-500">
                            {new Date(c.paymentDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 text-slate-500">
                            {c.releaseDate ? new Date(c.releaseDate).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                c.status === 'LIBERADO'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {c.status === 'LIBERADO' ? 'Liberado p/ Saque' : 'Retenção 30d'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 2: ACADEMIA COMERCIAL & KIT DE VENDAS */}
        {activeTab === 'ACADEMIA' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 uppercase tracking-widest">
                Ensino Comissionado SSantana
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">
                Academia Comercial & Guia Prático de Vendas
              </h2>
              <p className="text-sm text-sky-200 mt-2 max-w-2xl leading-relaxed">
                Aqui você encontra argumentos técnicos simplificados, roteiros de abordagem e explicações claras de cada produto para converter clientes com autoridade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Produto 1: E-mail Corporativo */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">E-mail Corporativo Blindado Multi-Domínio</h3>
                    <p className="text-xs text-slate-500">Servidor Próprio vs Google/Microsoft 365</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                  <p><strong>A Dor do Cliente:</strong> Empresas que ainda usam @gmail.com passam amadorismo e perdem propostas corporativas de alto valor.</p>
                  <p><strong>Solução SSantana:</strong> Setup de R$ 200 com configuração de DNS, SPF, DKIM e DMARC blindado contra spam. Custo de apenas R$ 5/mês por conta de 5GB no servidor próprio gerenciado.</p>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-mono text-[11px]">
                    "Roteiro: 'Fulano, você sabia que propostas enviadas de e-mail comum muitas vezes caem no lixo eletrônico ou geram desconfiança? Nós blindamos seu domínio próprio com entrega garantida na caixa de entrada por apenas R$ 5 ao mês por caixa.'"
                  </p>
                </div>
              </div>

              {/* Produto 2: SaaS Clínicas & Advogados */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">SaaS Clínicas Médicas & Escritórios Jurídicos</h3>
                    <p className="text-xs text-slate-500">Padrão AutoMed Bahia • Agenda + WhatsApp Bot</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                  <p><strong>A Dor do Cliente:</strong> Secretárias sobrecarregadas, faltas de pacientes/clientes sem confirmação e agendas desorganizadas.</p>
                  <p><strong>Solução SSantana:</strong> Site próprio integrado com Google Calendar/Outlook por sala e bot de confirmação WhatsApp 24/7 (via n8n). Pré-venda por R$ 200/mês nos 3 primeiros meses (depois R$ 500/mês), sem fidelidade.</p>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-mono text-[11px]">
                    "Roteiro: 'Doutor, você perde até 30% das consultas por faltas não confirmadas. Nosso sistema avisa e confirma no WhatsApp automaticamente 24h por dia, com valor especial de pré-venda de R$ 200/mês.'"
                  </p>
                </div>
              </div>

              {/* Produto 3: Hora Técnica Especializada */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Suporte Técnico Avulso (R$ 80,00 / hora)</h3>
                    <p className="text-xs text-slate-500">Certificados Digitais, Redes e Computadores</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                  <p><strong>A Dor do Cliente:</strong> Advogados travados sem conseguir assinar petição no PJe/E-SAJ por problema no Token/Certificado Digital A3 ou máquina lenta.</p>
                  <p><strong>Solução SSantana:</strong> Atendimento remoto com Engenheiro Sênior por R$ 80/h com pagamento prévio via PicPay. Resolve na hora sem enrolação.</p>
                </div>
              </div>

              {/* Produto 4: Infraestrutura & MVP */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Guardião de Servidores & Engenharia MVP</h3>
                    <p className="text-xs text-slate-500">+22 anos em TI sob liderança do Eng. Diego Santana</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                  <p><strong>Casos Reais Homologados:</strong> Brasville, Assegure Online, Ariserv, advdourado, Agente Apice e Voth Montagens.</p>
                  <p><strong>Argumento de Ouro:</strong> O cliente fala diretamente com quem resolve e toma decisão técnica, sem camadas de atendimento júnior ou burocracia.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 3: MEUS CONTRATOS */}
        {activeTab === 'CONTRATOS' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Contrato de Parceria Comercial Vigente
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Versão 2026.1 • Registrado com aceite digital e proteção jurídica
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Assinado & Válido
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-xs text-slate-700 dark:text-zinc-300 space-y-3">
              <p><strong>Cláusula 1 (Objeto):</strong> O presente instrumento regula as condições de comissionamento e indicação comercial direta de clientes à SSantana Infraestrutura.</p>
              <p><strong>Cláusula 2 (Alíquota):</strong> Parceiros Indicadores têm direito a 15% fixo sobre valores líquidos pagos. Parceiros em Ensino Comissionado têm alíquota base de 20%, respeitando a cessão máxima de 10% e proteção mínima líquida de 10%.</p>
              <p><strong>Cláusula 3 (Regra Anti-MMN):</strong> O comissionamento é restrito e exclusivo a indicações diretas de 1º nível. É estritamente vedada a formação de redes multinível ou piramidais.</p>
              <p><strong>Cláusula 4 (Retenção D+30 e Liquidação):</strong> As comissões são liberadas 30 dias após o pagamento do cliente para garantir a estabilidade do fluxo financeiro e prevenir chargebacks/MEDs. O resgate mínimo é de R$ 200,00.</p>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 4: CADASTRAR LEAD MANUAL */}
        {activeTab === 'LEADS' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Cadastrar Lead Direto (PF ou PJ)
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
              Registre os dados do prospecto para vincular imediatamente a atribuição ao seu código de parceiro.
            </p>
            <PartnerDirectReferralForm referralCode={partner?.id ? `PARC-${partner.id.slice(0, 6).toUpperCase()}` : 'PARCEIRO'} />
          </div>
        )}

        {/* MODAL: FUNIL DE FORMALIZAÇÃO DE SAQUE */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Solicitação de Saque PIX
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Funil de Formalização Tributária</p>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {withdrawFeedback && (
                <div
                  className={`mb-4 p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
                    withdrawFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {withdrawFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{withdrawFeedback.text}</span>
                </div>
              )}

              <form onSubmit={handleRequestWithdraw} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Valor a Sacar (Mínimo R$ 200,00)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="200"
                    max={partner?.availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-lg font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Saldo liberado disponível: <strong>{formatBRL(partner?.availableBalance || 0)}</strong>
                  </p>
                </div>

                {/* Seleção de Enquadramento Fiscal: Opção A vs Opção B */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2">
                    Enquadramento Fiscal
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setTaxOption('PJ_MEI')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        taxOption === 'PJ_MEI'
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-semibold'
                          : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="block text-xs font-bold">Opção A: PJ / MEI</span>
                      <span className="text-[11px] block mt-1">100% líquido via PIX mediante upload de NFSe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaxOption('PF_CPF')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        taxOption === 'PF_CPF'
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 font-semibold'
                          : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="block text-xs font-bold">Opção B: PF / CPF</span>
                      <span className="text-[11px] block mt-1">Retenção de 11% a 13% (INSS/IRRF) via RPA</span>
                    </button>

                  </div>
                </div>

                {taxOption === 'PJ_MEI' ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                      Link / URL do PDF da NFSe Emitida
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... ou link da nota"
                      value={nfseUrl}
                      onChange={(e) => setNfseUrl(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Emita a NFSe contra SSantana Infraestrutura para receber 100% integral.</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p><strong>Cálculo do Resgate Pessoa Física (RPA):</strong></p>
                    <p>Bruto: {formatBRL(Number(withdrawAmount) || 0)}</p>
                    <p>Retenção INSS/IRRF (12% est.): - {formatBRL((Number(withdrawAmount) || 0) * 0.12)}</p>
                    <p className="font-bold">Líquido a ser depositado via PIX: {formatBRL((Number(withdrawAmount) || 0) * 0.88)}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                    Chave PIX de Destino
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawPixKey}
                    onChange={(e) => setWithdrawPixKey(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingWithdraw || Number(withdrawAmount) < 200}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submittingWithdraw ? 'Processando...' : 'Confirmar Solicitação de Saque'}
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
