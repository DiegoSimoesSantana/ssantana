'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Calendar, Video, CheckCircle2, Clock, MessageSquare, ExternalLink, Edit3, AlertCircle, CreditCard } from 'lucide-react'

type AdminProject = {
  id: string
  title: string
  description: string
  totalValue: number
  status: string
  serviceCredits: number
  serviceCreditsUsed: number
  creditExpiryDate: string | null
  meetingDate: string | null
  meetingUrl: string | null
  meetingNotes: string | null
  serviceReport: string | null
  completedAt: string | null
  createdAt: string
  client: {
    id: string
    name: string
    email: string
    phone: string
  }
  contract: {
    id: string
    contractNumber: string | null
    status: string
    signedAt: string | null
  } | null
  payments: Array<{
    id: string
    amount: number
    status: string
    method: string
    paidAt: string | null
  }>
}

type AdminOverview = {
  partners: Array<any>
  clients: Array<any>
  leads: Array<any>
}

type PricingService = {
  key: 'MANUTENCAO_MENSAL' | 'SETUP_SISTEMA' | 'EMAIL_SETUP' | 'CONSULTORIA_30_60'
  label: string
  currentPrice: number
  referencePrice: number
  b2bMaxDiscount: number
  couponMaxDiscount: number
  combinedMaxDiscount: number
  minAllowedPrice: number
  allowAdminOverrideCoupon: boolean
  updatedAt: string
}

type PricingChange = {
  id: string
  serviceKey: PricingService['key']
  newPrice: number
  effectiveAt: string
  reason: string
  notifyClients: boolean
  notifyPartners: boolean
  status: 'PENDING' | 'APPLIED' | 'CANCELLED'
  createdAt: string
  createdBy: string
  appliedAt?: string
}

type PricingQueue = {
  id: string
  changeId: string
  targetRole: 'CLIENT' | 'PARTNER'
  title: string
  message: string
  status: 'QUEUED' | 'SENT'
  createdAt: string
  processedAt?: string
  recipients?: number
}

type PricingGovernance = {
  services: PricingService[]
  changes: PricingChange[]
  queue: PricingQueue[]
  updatedAt: string
}

type PricingFormState = {
  serviceKey: PricingService['key']
  newPrice: string
  effectiveAt: string
  reason: string
  notifyClients: boolean
  notifyPartners: boolean
}

type DiscountPolicyFormState = {
  serviceKey: PricingService['key']
  b2bMaxDiscount: string
  couponMaxDiscount: string
  combinedMaxDiscount: string
  minAllowedPrice: string
  allowAdminOverrideCoupon: boolean
}

function isoToLocalDateTime(iso: string) {
  const date = new Date(iso)
  const tzOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
}

function defaultEffectiveAt() {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30)
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16)
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)
}

type AdminUser = {
  id: string
  name: string
  email: string
  role: 'CLIENT' | 'PARTNER' | 'ADMIN'
  phone: string
  hasPassword: boolean
  createdAt: string
  partner: { id: string; companyName: string | null } | null
}

type UserFormState = {
  name: string
  email: string
  phone: string
  role: 'CLIENT' | 'PARTNER'
  password: string
}

type AdminScheduleItem = {
  id: string
  title: string
  description: string | null
  scheduledAt: string
  durationMinutes: number
  meetingUrl: string | null
  notes: string | null
  serviceReport: string | null
  status: string
  hasActiveService: boolean
  isMonthlyIncluded: boolean
  paymentRequired: boolean
  amountDue: number | null
  paymentUrl: string | null
  paidAt: string | null
  client: {
    id: string
    name: string
    email: string
    phone: string
  } | null
  project: {
    id: string
    title: string
    status: string
    serviceCredits: number
    creditExpiryDate: string | null
  } | null
}

type ClientServiceBalance = {
  id: string
  name: string
  email: string
  phone: string
  activeProjectsCount: number
  projects: Array<{
    id: string
    title: string
    status: string
    serviceCredits: number
    monthlyMeetingMinutes: number
  }>
  monthlyAllowanceMinutes: number
  minutesUsedThisMonth: number
  minutesRemaining: number
  hasFreeMinutesAvailable: boolean
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [pricing, setPricing] = useState<PricingGovernance | null>(null)
  const [pricingBusy, setPricingBusy] = useState(false)
  const [pricingMessage, setPricingMessage] = useState('')
  const [tab, setTab] = useState<'atendimentos' | 'partners' | 'clients' | 'leads' | 'pricing' | 'users'>('atendimentos')
  
  // Atendimentos & Reuniões state
  const [atendimentosSubTab, setAtendimentosSubTab] = useState<'marcacoes' | 'clientes_saldos' | 'contratacoes'>('marcacoes')
  const [atendimentos, setAtendimentos] = useState<AdminProject[]>([])
  const [atendimentosLoading, setAtendimentosLoading] = useState(false)
  const [editingAtendimento, setEditingAtendimento] = useState<AdminProject | null>(null)
  const [atendimentoForm, setAtendimentoForm] = useState({
    meetingDate: '',
    meetingUrl: '',
    meetingNotes: '',
    serviceCredits: 1,
    creditExpiryDate: '',
    serviceReport: '',
    status: 'IN_PROGRESS',
  })
  const [savingAtendimento, setSavingAtendimento] = useState(false)
  const [atendimentoMsg, setAtendimentoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Reuniões & Agendamentos state
  const [schedulesList, setSchedulesList] = useState<AdminScheduleItem[]>([])
  const [clientsBalanceList, setClientsBalanceList] = useState<ClientServiceBalance[]>([])
  const [agendamentosStats, setAgendamentosStats] = useState({
    totalActiveClients: 0,
    totalScheduled: 0,
    totalPendingPayment: 0,
    totalCompleted: 0,
  })
  const [editingSchedule, setEditingSchedule] = useState<AdminScheduleItem | null>(null)
  const [scheduleModalForm, setScheduleModalForm] = useState({
    scheduledAt: '',
    meetingUrl: '',
    status: 'SCHEDULED',
    notes: '',
    serviceReport: '',
    amount: '50.00',
  })
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [scheduleActionMsg, setScheduleActionMsg] = useState<{ type: 'success' | 'error'; text: string; paymentUrl?: string } | null>(null)

  const loadMeetingSchedules = async () => {
    try {
      const res = await fetch('/api/admin/agendamentos')
      if (res.ok) {
        const data = await res.json()
        setSchedulesList(data.schedules || [])
        setClientsBalanceList(data.clientSummaries || [])
        if (data.stats) setAgendamentosStats(data.stats)
      }
    } catch (e) {
      console.error('Erro ao carregar agendamentos:', e)
    }
  }

  const loadAtendimentos = async () => {
    setAtendimentosLoading(true)
    try {
      const [resProj] = await Promise.all([
        fetch('/api/admin/atendimentos'),
        loadMeetingSchedules(),
      ])
      if (resProj.ok) {
        const data = await resProj.json()
        setAtendimentos(data.projects || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setAtendimentosLoading(false)
    }
  }

  const openEditAtendimento = (proj: AdminProject) => {
    setEditingAtendimento(proj)
    setAtendimentoMsg(null)
    setAtendimentoForm({
      meetingDate: proj.meetingDate ? isoToLocalDateTime(proj.meetingDate) : '',
      meetingUrl: proj.meetingUrl || '',
      meetingNotes: proj.meetingNotes || '',
      serviceCredits: proj.serviceCredits || 1,
      creditExpiryDate: proj.creditExpiryDate ? proj.creditExpiryDate.slice(0, 10) : '',
      serviceReport: proj.serviceReport || '',
      status: proj.status || 'IN_PROGRESS',
    })
  }

  const saveAtendimento = async (markCompleted: boolean = false) => {
    if (!editingAtendimento) return
    setSavingAtendimento(true)
    setAtendimentoMsg(null)
    try {
      const res = await fetch('/api/admin/atendimentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: editingAtendimento.id,
          meetingDate: atendimentoForm.meetingDate ? new Date(atendimentoForm.meetingDate).toISOString() : null,
          meetingUrl: atendimentoForm.meetingUrl,
          meetingNotes: atendimentoForm.meetingNotes,
          serviceCredits: Number(atendimentoForm.serviceCredits),
          creditExpiryDate: atendimentoForm.creditExpiryDate ? new Date(atendimentoForm.creditExpiryDate).toISOString() : null,
          serviceReport: atendimentoForm.serviceReport,
          status: markCompleted ? 'COMPLETED' : atendimentoForm.status,
          markCompleted,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar atendimento')
      setAtendimentoMsg({ type: 'success', text: data.message })
      void loadAtendimentos()
      setTimeout(() => {
        setEditingAtendimento(null)
        setAtendimentoMsg(null)
      }, 1500)
    } catch (err: any) {
      setAtendimentoMsg({ type: 'error', text: err.message })
    } finally {
      setSavingAtendimento(false)
    }
  }

  const openEditSchedule = (s: AdminScheduleItem) => {
    setEditingSchedule(s)
    setScheduleActionMsg(null)
    setScheduleModalForm({
      scheduledAt: s.scheduledAt ? isoToLocalDateTime(s.scheduledAt) : '',
      meetingUrl: s.meetingUrl || '',
      status: s.status,
      notes: s.notes || '',
      serviceReport: s.serviceReport || '',
      amount: String(s.amountDue || 50.00),
    })
  }

  const saveSchedule = async (extra: { markPaid?: boolean; markCompleted?: boolean; generateLink?: boolean }) => {
    if (!editingSchedule) return
    setSavingSchedule(true)
    setScheduleActionMsg(null)
    try {
      let finalStatus = scheduleModalForm.status
      if (extra.markPaid) finalStatus = 'PAID_IN_MEETING'
      if (extra.markCompleted) finalStatus = 'COMPLETED'

      const res = await fetch('/api/admin/agendamentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: editingSchedule.id,
          scheduledAt: scheduleModalForm.scheduledAt ? new Date(scheduleModalForm.scheduledAt).toISOString() : undefined,
          meetingUrl: scheduleModalForm.meetingUrl,
          status: finalStatus,
          notes: scheduleModalForm.notes,
          serviceReport: scheduleModalForm.serviceReport,
          generatePaymentLink: extra.generateLink,
          amount: Number(scheduleModalForm.amount),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar agendamento')
      setScheduleActionMsg({
        type: 'success',
        text: data.message,
        paymentUrl: data.paymentUrl,
      })
      void loadMeetingSchedules()
      if (!extra.generateLink) {
        setTimeout(() => {
          setEditingSchedule(null)
          setScheduleActionMsg(null)
        }, 1500)
      }
    } catch (err: any) {
      setScheduleActionMsg({ type: 'error', text: err.message })
    } finally {
      setSavingSchedule(false)
    }
  }

  const [pricingForm, setPricingForm] = useState<PricingFormState>({
    serviceKey: 'SETUP_SISTEMA',
    newPrice: '',
    effectiveAt: defaultEffectiveAt(),
    reason: '',
    notifyClients: true,
    notifyPartners: true,
  })
  const [discountPolicyForm, setDiscountPolicyForm] = useState<DiscountPolicyFormState>({
    serviceKey: 'SETUP_SISTEMA',
    b2bMaxDiscount: '0',
    couponMaxDiscount: '0',
    combinedMaxDiscount: '0',
    minAllowedPrice: '0',
    allowAdminOverrideCoupon: true,
  })

  // Users tab state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userFormVisible, setUserFormVisible] = useState(false)
  const [userForm, setUserForm] = useState<UserFormState>({ name: '', email: '', phone: '', role: 'CLIENT', password: '' })
  const [userMsg, setUserMsg] = useState('')
  const [pwModal, setPwModal] = useState<{ userId: string; name: string } | null>(null)
  const [newPw, setNewPw] = useState('')

  const loadUsers = async () => {
    setUsersLoading(true)
    try {
      const data = await fetch('/api/admin/users').then((r) => r.json())
      setUsers(data)
    } finally {
      setUsersLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUserMsg('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          role: userForm.role,
          ...(userForm.password ? { password: userForm.password } : {}),
        }),
      })
      const payload = await res.json()
      if (!res.ok) { setUserMsg(payload.error || 'Erro ao criar usuário'); return }
      setUserMsg('Usuário criado com sucesso!')
      setUserForm({ name: '', email: '', phone: '', role: 'CLIENT', password: '' })
      setUserFormVisible(false)
      void loadUsers()
    } catch { setUserMsg('Erro de rede') }
  }

  const setUserPassword = async () => {
    if (!pwModal || !newPw) return
    const res = await fetch(`/api/admin/users/${pwModal.userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'set_password', password: newPw }),
    })
    const payload = await res.json()
    setUserMsg(res.ok ? payload.message : payload.error)
    setPwModal(null)
    setNewPw('')
    void loadUsers()
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Apagar usuário permanentemente?')) return
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    void loadUsers()
  }

  const loadPricing = async () => {
    const governance = await fetch('/api/admin/pricing/governance', { cache: 'no-store' }).then((r) => r.json())
    setPricing(governance)
    if (!pricingForm.newPrice) {
      const service = governance.services?.find((item: PricingService) => item.key === pricingForm.serviceKey)
      if (service) {
        setPricingForm((current) => ({ ...current, newPrice: String(service.currentPrice) }))
      }
    }

    const policyService = governance.services?.find((item: PricingService) => item.key === discountPolicyForm.serviceKey)
    if (policyService) {
      setDiscountPolicyForm((current) => ({
        ...current,
        b2bMaxDiscount: String(policyService.b2bMaxDiscount ?? 0),
        couponMaxDiscount: String(policyService.couponMaxDiscount ?? 0),
        combinedMaxDiscount: String(policyService.combinedMaxDiscount ?? 0),
        minAllowedPrice: String(policyService.minAllowedPrice ?? policyService.currentPrice),
        allowAdminOverrideCoupon: policyService.allowAdminOverrideCoupon ?? true,
      }))
    }
  }

  const load = async () => {
    setLoading(true)
    const session = await fetch('/api/admin/auth/session').then((r) => r.json())
    if (!session.authenticated) {
      router.push('/sign-in')
      return
    }
    setAuthorized(true)
    const [data] = await Promise.all([
      fetch('/api/admin/overview').then((r) => r.json()),
      loadPricing(),
      loadUsers(),
      loadAtendimentos(),
    ])
    setOverview(data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const rows = useMemo(() => {
    if (!overview) {
      return []
    }
    if (tab === 'pricing' || tab === 'users' || tab === 'atendimentos') return []
    if (tab === 'partners') return overview.partners
    if (tab === 'clients') return overview.clients
    return overview.leads
  }, [overview, tab])

  const pendingChanges = useMemo(
    () => (pricing?.changes || []).filter((change) => change.status === 'PENDING'),
    [pricing]
  )

  const queuedNotifications = useMemo(
    () => (pricing?.queue || []).filter((item) => item.status === 'QUEUED'),
    [pricing]
  )

  const removeItem = async (id: string) => {
    await fetch(`/api/admin/overview?entity=${tab === 'partners' ? 'partner' : tab === 'clients' ? 'client' : 'lead'}&id=${id}`, {
      method: 'DELETE',
    })
    await load()
  }

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/sign-in')
  }

  const createPricingChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPricingBusy(true)
    setPricingMessage('')

    try {
      const response = await fetch('/api/admin/pricing/governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey: pricingForm.serviceKey,
          newPrice: Number(pricingForm.newPrice),
          effectiveAt: new Date(pricingForm.effectiveAt).toISOString(),
          reason: pricingForm.reason,
          notifyClients: pricingForm.notifyClients,
          notifyPartners: pricingForm.notifyPartners,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setPricingMessage(payload.error || 'Falha ao criar alteracao de preco')
        return
      }

      setPricing(payload.state)
      setPricingMessage('Alteracao registrada com sucesso.')
      setPricingForm((current) => ({ ...current, reason: '' }))
    } catch {
      setPricingMessage('Falha de rede ao salvar alteracao de preco')
    } finally {
      setPricingBusy(false)
    }
  }

  const runPricingAction = async (action: 'cancel' | 'apply_now' | 'process_queue', changeId?: string) => {
    setPricingBusy(true)
    setPricingMessage('')

    try {
      const response = await fetch('/api/admin/pricing/governance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, changeId }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setPricingMessage(payload.error || 'Nao foi possivel executar acao')
        return
      }

      setPricing(payload.state)
      if (action === 'process_queue') {
        setPricingMessage(`Fila processada: ${payload.processedItems} lote(s), ${payload.totalNotifications} notificacao(oes).`)
      } else if (action === 'cancel') {
        setPricingMessage('Alteracao cancelada.')
      } else {
        setPricingMessage('Alteracao aplicada imediatamente.')
      }
    } catch {
      setPricingMessage('Erro ao executar acao de governanca')
    } finally {
      setPricingBusy(false)
    }
  }

  const saveDiscountPolicy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPricingBusy(true)
    setPricingMessage('')

    try {
      const response = await fetch('/api/admin/pricing/governance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_policy',
          serviceKey: discountPolicyForm.serviceKey,
          b2bMaxDiscount: Number(discountPolicyForm.b2bMaxDiscount),
          couponMaxDiscount: Number(discountPolicyForm.couponMaxDiscount),
          combinedMaxDiscount: Number(discountPolicyForm.combinedMaxDiscount),
          minAllowedPrice: Number(discountPolicyForm.minAllowedPrice),
          allowAdminOverrideCoupon: discountPolicyForm.allowAdminOverrideCoupon,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setPricingMessage(payload.error || 'Nao foi possivel salvar politica de desconto')
        return
      }

      setPricing(payload.state)
      setPricingMessage('Politica de desconto salva com sucesso.')
    } catch {
      setPricingMessage('Erro ao salvar politica de desconto')
    } finally {
      setPricingBusy(false)
    }
  }

  const pricingServiceOptions = pricing?.services || []
  const selectedPricingService = pricingServiceOptions.find((item) => item.key === pricingForm.serviceKey)
  const maxB2BDiscount = selectedPricingService
    ? Math.max((selectedPricingService.referencePrice || 0) - (selectedPricingService.currentPrice || 0), 0)
    : 0
  const lockedFloor = selectedPricingService?.currentPrice ?? 0

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-slate-950 p-8 text-slate-100">Carregando painel de governanca...</main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-950 p-4 text-slate-100 sm:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Painel de governanca administrativa</h1>
          <button onClick={logout} className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800">
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Atendimentos: <strong>{atendimentos.length}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Parceiros: <strong>{overview?.partners?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Clientes: <strong>{overview?.clients?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Leads: <strong>{overview?.leads?.length || 0}</strong></div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['atendimentos', 'partners', 'clients', 'leads', 'pricing', 'users'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === item ? 'bg-cyan-300 text-slate-900 shadow-md' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
            >
              {item === 'atendimentos' ? 'Atendimentos & Reuniões' : item === 'partners' ? 'Parceiros' : item === 'clients' ? 'Clientes' : item === 'leads' ? 'Leads' : item === 'pricing' ? 'Precos B2B' : 'Usuarios'}
            </button>
          ))}
        </div>

        {tab === 'atendimentos' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-300" />
                  Atendimentos, Reuniões & Clientes Ativos
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Gerencie agendamentos (30 min/mês inclusos por serviço ativo), valide cobranças, links do Google Meet e acompanhe o saldo dos clientes.
                </p>
              </div>
              <button
                onClick={() => void loadAtendimentos()}
                disabled={atendimentosLoading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition border border-slate-700 shrink-0"
              >
                {atendimentosLoading ? 'Atualizando...' : 'Atualizar Dados'}
              </button>
            </div>

            {/* Métricas Rápidas de Atendimentos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Clientes com Serviço Ativo
                </span>
                <p className="text-2xl font-bold text-white">{agendamentosStats.totalActiveClients}</p>
                <span className="text-slate-500 text-[11px]">Direito a 30 min/mês</span>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Reuniões Agendadas
                </span>
                <p className="text-2xl font-bold text-cyan-400">{agendamentosStats.totalScheduled}</p>
                <span className="text-slate-500 text-[11px]">No radar de atendimento</span>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Cobranças Pendentes / Avulsas
                </span>
                <p className="text-2xl font-bold text-amber-400">{agendamentosStats.totalPendingPayment}</p>
                <span className="text-slate-500 text-[11px]">Sem plano ou excedente</span>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Sessões Concluídas
                </span>
                <p className="text-2xl font-bold text-emerald-400">{agendamentosStats.totalCompleted}</p>
                <span className="text-slate-500 text-[11px]">Atendimentos finalizados</span>
              </div>
            </div>

            {/* Sub-Navegação interna */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <button
                onClick={() => setAtendimentosSubTab('marcacoes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  atendimentosSubTab === 'marcacoes'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                📅 Marcações & Reuniões ({schedulesList.length})
              </button>

              <button
                onClick={() => setAtendimentosSubTab('clientes_saldos')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  atendimentosSubTab === 'clientes_saldos'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                👥 Clientes com Serviço Ativo & Cota 30min ({clientsBalanceList.length})
              </button>

              <button
                onClick={() => setAtendimentosSubTab('contratacoes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  atendimentosSubTab === 'contratacoes'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                🛒 Contratações & Pedidos ({atendimentos.length})
              </button>
            </div>

            {/* SUB-ABA 1: MARCAÇÕES & REUNIÕES */}
            {atendimentosSubTab === 'marcacoes' && (
              <div className="space-y-4">
                {schedulesList.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-slate-400 text-sm">Nenhum agendamento ou solicitação de reunião registrada no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {schedulesList.map((s) => {
                      const cleanPhone = (s.client?.phone || '').replace(/\D/g, '')
                      const isPending = s.status === 'PENDING_PAYMENT'
                      const isIncluded = s.isMonthlyIncluded || s.status === 'VALID'
                      const isPaidInMeeting = s.status === 'PAID_IN_MEETING'
                      const isCompleted = s.status === 'COMPLETED'

                      return (
                        <div
                          key={s.id}
                          className="p-5 rounded-2xl border border-white/10 bg-slate-900/90 shadow-md space-y-4"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                    isCompleted
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : isIncluded
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : isPaidInMeeting
                                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                      : isPending
                                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                      : 'bg-sky-950 text-sky-300 border border-sky-800'
                                  }`}
                                >
                                  {isCompleted
                                    ? '✓ CONCLUÍDA'
                                    : isIncluded
                                    ? '✓ VÁLIDA (INCLUSA NO SERVIÇO ATIVO)'
                                    : isPaidInMeeting
                                    ? '✓ PAGO NA REUNIÃO'
                                    : isPending
                                    ? '⚠️ COBRANÇA PENDENTE (R$ 50,00)'
                                    : s.status}
                                </span>

                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                  Duração: {s.durationMinutes} min
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-white mt-1.5">{s.title}</h3>
                              <p className="text-xs text-slate-400">
                                Horário Marcado: <strong className="text-cyan-300 font-mono">{new Date(s.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</strong>
                                {s.description ? ` • ${s.description}` : ''}
                              </p>
                            </div>

                            {/* Ações Rápidas */}
                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(s.client?.name || '')}%2C%20aqui%20%C3%A9%20Diego%20Santana%20referente%20%C3%A0%20sua%20reuni%C3%A3o%20agendada%20para%20${encodeURIComponent(new Date(s.scheduledAt).toLocaleDateString('pt-BR'))}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  WhatsApp
                                </a>
                              )}

                              {s.meetingUrl && (
                                <a
                                  href={s.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  Abrir Sala
                                </a>
                              )}

                              <button
                                onClick={() => openEditSchedule(s)}
                                className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Gerenciar Reunião
                              </button>
                            </div>
                          </div>

                          {/* Detalhes do Cliente e Sala */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Cliente
                              </span>
                              <p className="font-bold text-white">{s.client?.name || 'Cliente'}</p>
                              <p className="text-slate-300">{s.client?.email}</p>
                              <p className="text-slate-400">{s.client?.phone || 'Sem telefone'}</p>
                            </div>

                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Status do Benefício
                              </span>
                              <p className="font-bold text-cyan-300">
                                {s.hasActiveService ? '✓ Cliente com Serviço Ativo' : 'Cliente Avulso (Sem Serviço Ativo)'}
                              </p>
                              <p className="text-slate-400">
                                {s.isMonthlyIncluded ? '30 min mensais inclusos utilizados' : 'Necessita acerto de taxa técnica (R$ 50)'}
                              </p>
                            </div>

                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Sala Virtual (Link da Reunião)
                              </span>
                              {s.meetingUrl ? (
                                <a
                                  href={s.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold truncate block"
                                >
                                  {s.meetingUrl}
                                </a>
                              ) : (
                                <span className="text-amber-400 italic">Nenhum link definido ainda</span>
                              )}
                              {s.paymentUrl && (
                                <a
                                  href={s.paymentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold block pt-1"
                                >
                                  Link de Pagamento PicPay Ativo
                                </a>
                              )}
                            </div>
                          </div>

                          {s.notes && (
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs text-slate-300">
                              <strong className="text-white">Observações / Instruções:</strong> {s.notes}
                            </div>
                          )}

                          {s.serviceReport && (
                            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-200">
                              <strong className="text-white">Parecer / Resumo da Conclusão:</strong> {s.serviceReport}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUB-ABA 2: CLIENTES COM SERVIÇO ATIVO & COTA MENSAL */}
            {atendimentosSubTab === 'clientes_saldos' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200">
                  <p>
                    <strong>Regra do Sistema:</strong> Cada cliente com serviço ativo possui direito a pelo menos 30 minutos de reunião técnica por mês inclusos. Quando o cliente agenda pelo portal, o sistema debita automaticamente de sua cota mensal.
                  </p>
                </div>

                {clientsBalanceList.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-slate-400 text-sm">Nenhum cliente com serviços ativos no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientsBalanceList.map((cb) => {
                      const cleanPhone = (cb.phone || '').replace(/\D/g, '')

                      return (
                        <div
                          key={cb.id}
                          className="p-5 rounded-2xl border border-white/10 bg-slate-900/90 shadow-md space-y-3.5"
                        >
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div>
                              <h3 className="font-bold text-white text-base">{cb.name}</h3>
                              <p className="text-xs text-slate-400">{cb.email} • {cb.phone || 'Sem telefone'}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                cb.hasFreeMinutesAvailable
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {cb.hasFreeMinutesAvailable
                                ? `✓ ${cb.minutesRemaining} min disponíveis`
                                : 'Cota do mês esgotada'}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[10px] text-slate-400 block font-semibold">Cota Mensal</span>
                              <strong className="text-white text-sm">{cb.monthlyAllowanceMinutes} min</strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[10px] text-slate-400 block font-semibold">Usados este Mês</span>
                              <strong className="text-indigo-300 text-sm">{cb.minutesUsedThisMonth} min</strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[10px] text-slate-400 block font-semibold">Saldo Restante</span>
                              <strong className="text-emerald-400 text-sm">{cb.minutesRemaining} min</strong>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                              Serviços Ativos Vinculados:
                            </span>
                            <div className="space-y-1">
                              {cb.projects.map((proj) => (
                                <div
                                  key={proj.id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5 text-xs"
                                >
                                  <span className="font-medium text-slate-200">{proj.title}</span>
                                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                                    {proj.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {cleanPhone && (
                            <a
                              href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(cb.name)}%2C%20aqui%20%C3%A9%20Diego%20Santana.%20Gostaria%20de%20agendar%20sua%20sess%C3%A3o%20t%C3%A9cnica%20deste%20m%C3%AAs%3F`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Convidar para Reunião no WhatsApp
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUB-ABA 3: CONTRATAÇÕES & PEDIDOS (CHECKOUT RÁPIDO) */}
            {atendimentosSubTab === 'contratacoes' && (
              <div className="space-y-4">
                {atendimentosLoading && atendimentos.length === 0 ? (
                  <p className="text-slate-400">Carregando contratações...</p>
                ) : atendimentos.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-slate-400">Nenhum atendimento ou contratação registrada ainda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {atendimentos.map((p) => {
                      const hasPaid = p.payments?.some((pay) => pay.status === 'COMPLETED' || pay.status === 'PAID')
                      const isCompleted = p.status === 'COMPLETED'
                      const cleanPhone = (p.client?.phone || '').replace(/\D/g, '')

                      return (
                        <div
                          key={p.id}
                          className="p-5 rounded-2xl border border-white/10 bg-slate-900/90 shadow-md space-y-4"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                                  {p.contract?.contractNumber || 'SEM-CONTRATO'}
                                </span>
                                <span
                                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                    hasPaid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {hasPaid ? '✓ PAGO' : 'AGUARDANDO PAGAMENTO'}
                                </span>
                                <span
                                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                    isCompleted
                                      ? 'bg-emerald-900 text-emerald-200'
                                      : p.meetingDate
                                      ? 'bg-sky-900 text-sky-200'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {isCompleted ? 'CONCLUÍDO' : p.meetingDate ? 'AGENDADO' : 'EM ABERTO'}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-white mt-1.5">{p.title}</h3>
                              <p className="text-xs text-slate-400">
                                Valor: <strong className="text-emerald-400">{formatBRL(p.totalValue)}</strong> • Contratado em: {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>

                            {/* Ações Rápidas */}
                            <div className="flex items-center gap-2 shrink-0">
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(p.client?.name || '')}%2C%20aqui%20%C3%A9%20Diego%20Santana%20referente%20ao%20seu%20atendimento.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  WhatsApp
                                </a>
                              )}
                              <button
                                onClick={() => openEditAtendimento(p)}
                                className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Gerenciar Atendimento
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Cliente
                              </span>
                              <p className="font-bold text-white">{p.client?.name || 'Cliente'}</p>
                              <p className="text-slate-300">{p.client?.email}</p>
                              <p className="text-slate-400">{p.client?.phone || 'Sem telefone'}</p>
                            </div>

                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Crédito & Validade
                              </span>
                              <p className="font-bold text-cyan-300">
                                {p.serviceCredits} sessão(ões) • {p.serviceCreditsUsed > 0 ? `${p.serviceCreditsUsed} consumida(s)` : 'Disponível'}
                              </p>
                              <p className="text-slate-300">
                                Válido até: {p.creditExpiryDate ? new Date(p.creditExpiryDate).toLocaleDateString('pt-BR') : '30 dias'}
                              </p>
                            </div>

                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Reunião Agendada
                              </span>
                              {p.meetingDate ? (
                                <>
                                  <p className="font-bold text-emerald-300">
                                    📅 {new Date(p.meetingDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                  </p>
                                  {p.meetingUrl ? (
                                    <a
                                      href={p.meetingUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-cyan-400 hover:underline flex items-center gap-1"
                                    >
                                      <Video className="w-3 h-3" /> Abrir Link da Reunião
                                    </a>
                                  ) : (
                                    <span className="text-slate-500 italic">Sem link informado</span>
                                  )}
                                </>
                              ) : (
                                <p className="text-amber-300">⏳ Horário não definido</p>
                              )}
                            </div>
                          </div>

                          {p.meetingNotes && (
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs text-slate-300">
                              <strong className="text-white">Instruções para o cliente:</strong> {p.meetingNotes}
                            </div>
                          )}

                          {p.serviceReport && (
                            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-200">
                              <strong className="text-white">Relatório de Conclusão:</strong> {p.serviceReport}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* MODAL 1: GERENCIAR REUNIÃO / AGENDAMENTO */}
            {editingSchedule && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-5 my-8 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white">Gerenciar Reunião / Agendamento</h3>
                      <p className="text-xs text-slate-400">Cliente: {editingSchedule.client?.name || 'Cliente'}</p>
                    </div>
                    <button
                      onClick={() => setEditingSchedule(null)}
                      className="text-slate-400 hover:text-white text-lg p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {scheduleActionMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-2 ${
                        scheduleActionMsg.type === 'success'
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                          : 'bg-rose-950/80 border border-rose-800 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {scheduleActionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{scheduleActionMsg.text}</span>
                      </div>
                      {scheduleActionMsg.paymentUrl && (
                        <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between gap-2">
                          <span className="truncate font-mono text-[11px] text-white">{scheduleActionMsg.paymentUrl}</span>
                          <a
                            href={scheduleActionMsg.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs shrink-0"
                          >
                            Abrir Link
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Data e Horário do Atendimento
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduleModalForm.scheduledAt}
                        onChange={(e) => setScheduleModalForm({ ...scheduleModalForm, scheduledAt: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Link da Sala Virtual (Google Meet, Zoom ou AnyDesk)
                      </label>
                      <input
                        type="url"
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={scheduleModalForm.meetingUrl}
                        onChange={(e) => setScheduleModalForm({ ...scheduleModalForm, meetingUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Status do Atendimento
                      </label>
                      <select
                        value={scheduleModalForm.status}
                        onChange={(e) => setScheduleModalForm({ ...scheduleModalForm, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="VALID">Válido (Incluso no Serviço Ativo)</option>
                        <option value="CONFIRMED">Confirmado (Agendamento Aprovado)</option>
                        <option value="PENDING_PAYMENT">Pendente de Pagamento (Avulso / Excedente)</option>
                        <option value="PAID_IN_MEETING">Pago na Própria Reunião</option>
                        <option value="COMPLETED">Concluído</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </div>

                    {/* Bloco de Cobrança Instantânea PicPay / PIX */}
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">Cobrança Avulsa / PicPay:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={scheduleModalForm.amount}
                            onChange={(e) => setScheduleModalForm({ ...scheduleModalForm, amount: e.target.value })}
                            className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-right font-bold"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Se o cliente não tiver plano ativo ou precisar acertar a sessão avulsa, gere o link oficial do PicPay abaixo:
                      </p>
                      <button
                        type="button"
                        disabled={savingSchedule}
                        onClick={() => void saveSchedule({ generateLink: true })}
                        className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Gerar Cobrança Instantânea PicPay & Copiar Link
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Orientações e Instruções (Visível no Portal do Cliente)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Conectar 5 minutos antes pelo Google Meet..."
                        value={scheduleModalForm.notes}
                        onChange={(e) => setScheduleModalForm({ ...scheduleModalForm, notes: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Parecer Técnico / O que foi resolvido (Ao Concluir)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ex: Alinhamento de infraestrutura concluído com sucesso..."
                        value={scheduleModalForm.serviceReport}
                        onChange={(e) => setScheduleModalForm({ ...scheduleModalForm, serviceReport: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={savingSchedule}
                        onClick={() => void saveSchedule({ markPaid: true })}
                        className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs transition"
                      >
                        ✓ Pago na Reunião
                      </button>

                      <button
                        type="button"
                        disabled={savingSchedule}
                        onClick={() => void saveSchedule({ markCompleted: true })}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                      >
                        ✓ Marcar como Concluído
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingSchedule(null)}
                        className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={savingSchedule}
                        onClick={() => void saveSchedule({})}
                        className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition"
                      >
                        {savingSchedule ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 2: GERENCIAMENTO DO ATENDIMENTO (PROJETO/CONTRATO) */}
            {editingAtendimento && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-5 my-8 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white">Gerenciar Atendimento</h3>
                      <p className="text-xs text-slate-400">{editingAtendimento.title}</p>
                    </div>
                    <button
                      onClick={() => setEditingAtendimento(null)}
                      className="text-slate-400 hover:text-white text-lg p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {atendimentoMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        atendimentoMsg.type === 'success'
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                          : 'bg-rose-950/80 border border-rose-800 text-rose-200'
                      }`}
                    >
                      {atendimentoMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{atendimentoMsg.text}</span>
                    </div>
                  )}

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Data e Horário da Reunião (Sessão com o Cliente)
                      </label>
                      <input
                        type="datetime-local"
                        value={atendimentoForm.meetingDate}
                        onChange={(e) => setAtendimentoForm({ ...atendimentoForm, meetingDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Link da Sala Virtual (Google Meet, Zoom ou AnyDesk)
                      </label>
                      <input
                        type="url"
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={atendimentoForm.meetingUrl}
                        onChange={(e) => setAtendimentoForm({ ...atendimentoForm, meetingUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Créditos / Sessões
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={atendimentoForm.serviceCredits}
                          onChange={(e) => setAtendimentoForm({ ...atendimentoForm, serviceCredits: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Validade do Crédito
                        </label>
                        <input
                          type="date"
                          value={atendimentoForm.creditExpiryDate}
                          onChange={(e) => setAtendimentoForm({ ...atendimentoForm, creditExpiryDate: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Orientações e Instruções (Visível no Portal do Cliente)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Tenha o AnyDesk aberto ou conecte 5 minutos antes na sala do Google Meet..."
                        value={atendimentoForm.meetingNotes}
                        onChange={(e) => setAtendimentoForm({ ...atendimentoForm, meetingNotes: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Relatório da Entrega / O que foi resolvido (Para conclusão)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ex: Diagnóstico realizado com sucesso. Corrigida falha no DNS e configurado backup automático em nuvem..."
                        value={atendimentoForm.serviceReport}
                        onChange={(e) => setAtendimentoForm({ ...atendimentoForm, serviceReport: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={savingAtendimento}
                      onClick={() => void saveAtendimento(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Marcar Serviço como Concluído
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingAtendimento(null)}
                        className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={savingAtendimento}
                        onClick={() => void saveAtendimento(false)}
                        className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition"
                      >
                        {savingAtendimento ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : tab === 'users' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Usuarios cadastrados</h2>
              <button
                onClick={() => { setUserFormVisible((v) => !v); setUserMsg('') }}
                className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                {userFormVisible ? 'Cancelar' : '+ Novo usuario'}
              </button>
            </div>
            {userMsg && <p className="text-sm text-cyan-200">{userMsg}</p>}
            {userFormVisible && (
              <form onSubmit={createUser} className="rounded-xl border border-slate-600 bg-slate-900 p-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm">
                  <span className="block mb-1 text-slate-300">Nome completo</span>
                  <input required value={userForm.name} onChange={(e) => setUserForm((u) => ({ ...u, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1 text-slate-300">Email</span>
                  <input required type="email" value={userForm.email} onChange={(e) => setUserForm((u) => ({ ...u, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1 text-slate-300">Telefone</span>
                  <input required value={userForm.phone} onChange={(e) => setUserForm((u) => ({ ...u, phone: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1 text-slate-300">Perfil</span>
                  <select value={userForm.role} onChange={(e) => setUserForm((u) => ({ ...u, role: e.target.value as 'CLIENT' | 'PARTNER' }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2">
                    <option value="CLIENT">Cliente</option>
                    <option value="PARTNER">Parceiro</option>
                  </select>
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="block mb-1 text-slate-300">Senha inicial (opcional — min. 8 caracteres)</span>
                  <input type="password" minLength={8} value={userForm.password} onChange={(e) => setUserForm((u) => ({ ...u, password: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2" />
                </label>
                <div className="md:col-span-2">
                  <button type="submit" className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900">
                    Criar usuario
                  </button>
                </div>
              </form>
            )}
            {usersLoading ? (
              <p className="text-slate-400">Carregando...</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-900/80 text-left text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Perfil</th>
                      <th className="px-4 py-3">Senha</th>
                      <th className="px-4 py-3">Criado em</th>
                      <th className="px-4 py-3">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-white/10">
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'PARTNER' ? 'bg-indigo-900 text-indigo-300' : u.role === 'ADMIN' ? 'bg-rose-900 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${u.hasPassword ? 'text-green-400' : 'text-yellow-400'}`}>
                            {u.hasPassword ? 'Individual' : 'Ambiente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setPwModal({ userId: u.id, name: u.name }); setNewPw('') }}
                              className="rounded bg-cyan-700 px-2 py-1 text-xs font-semibold text-white hover:bg-cyan-600"
                            >
                              Definir senha
                            </button>
                            <button
                              onClick={() => void deleteUser(u.id)}
                              className="rounded bg-rose-700 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-600"
                            >
                              Apagar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Password modal */}
            {pwModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-sm rounded-2xl border border-slate-600 bg-slate-900 p-6 space-y-4">
                  <h3 className="font-semibold text-white">Definir senha para {pwModal.name}</h3>
                  <input
                    type="password"
                    placeholder="Nova senha (min. 8 caracteres)"
                    minLength={8}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => void setUserPassword()} className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900">
                      Confirmar
                    </button>
                    <button onClick={() => setPwModal(null)} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-white">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : tab !== 'pricing' ? (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 text-left text-slate-300">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Info</th>
                  <th className="px-4 py-3">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{row.user?.name || row.name || '-'}</td>
                    <td className="px-4 py-3">{row.user?.email || row.email || '-'}</td>
                    <td className="px-4 py-3">
                      {tab === 'partners' ? `Ref: ${row.referralCode || '-'} | Leads: ${row._count?.leads || 0}` : tab === 'clients' ? `Role: ${row.role}` : `Status: ${row.status}`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void removeItem(row.id)}
                        className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-semibold">Agendar Alteracao de Preco</h2>
              <p className="mt-1 text-sm text-slate-300">Aqui você ajusta apenas o preço atual e o desconto B2B permitido. Não exibimos valor de referência para operação.</p>

              <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={createPricingChange}>
                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Servico</span>
                  <select
                    value={pricingForm.serviceKey}
                    onChange={(e) => {
                      const nextKey = e.target.value as PricingService['key']
                      const service = pricingServiceOptions.find((item) => item.key === nextKey)
                      setPricingForm((current) => ({
                        ...current,
                        serviceKey: nextKey,
                        newPrice: service ? String(service.currentPrice) : current.newPrice,
                      }))
                      if (service) {
                        setDiscountPolicyForm((current) => ({
                          ...current,
                          serviceKey: nextKey,
                          b2bMaxDiscount: String(service.b2bMaxDiscount ?? 0),
                          couponMaxDiscount: String(service.couponMaxDiscount ?? 0),
                          combinedMaxDiscount: String(service.combinedMaxDiscount ?? 0),
                          minAllowedPrice: String(service.minAllowedPrice ?? service.currentPrice),
                          allowAdminOverrideCoupon: service.allowAdminOverrideCoupon ?? true,
                        }))
                      }
                    }}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                  >
                    {pricingServiceOptions.map((service) => (
                      <option key={service.key} value={service.key}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Novo preço (R$)</span>
                  <input
                    type="number"
                    min={lockedFloor || 1}
                    step="0.01"
                    value={pricingForm.newPrice}
                    onChange={(e) => setPricingForm((current) => ({ ...current, newPrice: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    required
                  />
                  <p className="mt-1 text-xs text-slate-400">Piso travado do serviço: {formatBRL(lockedFloor)}. Desconto B2B máximo: {formatBRL(maxB2BDiscount)}.</p>
                </label>

                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-slate-300">Vigência da alteração</span>
                  <input
                    type="datetime-local"
                    value={pricingForm.effectiveAt}
                    onChange={(e) => setPricingForm((current) => ({ ...current, effectiveAt: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    required
                  />
                </label>

                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-slate-300">Motivo obrigatório da mudança</span>
                  <textarea
                    value={pricingForm.reason}
                    onChange={(e) => setPricingForm((current) => ({ ...current, reason: e.target.value }))}
                    className="h-24 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    minLength={8}
                    required
                  />
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pricingForm.notifyClients}
                    onChange={(e) => setPricingForm((current) => ({ ...current, notifyClients: e.target.checked }))}
                  />
                    Notificar clientes
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pricingForm.notifyPartners}
                    onChange={(e) => setPricingForm((current) => ({ ...current, notifyPartners: e.target.checked }))}
                  />
                    Notificar parceiros
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={pricingBusy}
                    className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
                  >
                    Salvar alteração
                  </button>
                  <button
                    type="button"
                    disabled={pricingBusy}
                    onClick={() => void runPricingAction('process_queue')}
                    className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
                  >
                    Processar fila de notificações
                  </button>
                </div>
              </form>

              <form className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-700 bg-slate-900/40 p-4 md:grid-cols-2" onSubmit={saveDiscountPolicy}>
                <h3 className="md:col-span-2 text-sm font-semibold text-cyan-200">Regra de desconto por serviço</h3>

                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Serviço da regra</span>
                  <select
                    value={discountPolicyForm.serviceKey}
                    onChange={(e) => {
                      const nextKey = e.target.value as PricingService['key']
                      const service = pricingServiceOptions.find((item) => item.key === nextKey)
                      if (!service) return
                      setDiscountPolicyForm({
                        serviceKey: nextKey,
                        b2bMaxDiscount: String(service.b2bMaxDiscount ?? 0),
                        couponMaxDiscount: String(service.couponMaxDiscount ?? 0),
                        combinedMaxDiscount: String(service.combinedMaxDiscount ?? 0),
                        minAllowedPrice: String(service.minAllowedPrice ?? service.currentPrice),
                        allowAdminOverrideCoupon: service.allowAdminOverrideCoupon ?? true,
                      })
                    }}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                  >
                    {pricingServiceOptions.map((service) => (
                      <option key={service.key} value={service.key}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Desconto máximo B2B (R$)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountPolicyForm.b2bMaxDiscount}
                    onChange={(e) => setDiscountPolicyForm((current) => ({ ...current, b2bMaxDiscount: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Desconto máximo cupom (R$)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountPolicyForm.couponMaxDiscount}
                    onChange={(e) => setDiscountPolicyForm((current) => ({ ...current, couponMaxDiscount: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    required
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-slate-300">Desconto máximo B2B + cupom (R$)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountPolicyForm.combinedMaxDiscount}
                    onChange={(e) => setDiscountPolicyForm((current) => ({ ...current, combinedMaxDiscount: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    required
                  />
                </label>

                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-slate-300">Piso mínimo final do serviço (R$)</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={discountPolicyForm.minAllowedPrice}
                    onChange={(e) => setDiscountPolicyForm((current) => ({ ...current, minAllowedPrice: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"
                    required
                  />
                </label>

                <label className="md:col-span-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={discountPolicyForm.allowAdminOverrideCoupon}
                    onChange={(e) => setDiscountPolicyForm((current) => ({ ...current, allowAdminOverrideCoupon: e.target.checked }))}
                  />
                  Admin pode criar cupom fora da regra para cliente ativo
                </label>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={pricingBusy}
                    className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
                  >
                    Salvar regra de desconto
                  </button>
                </div>
              </form>

              {pricingMessage && <p className="mt-3 text-sm text-cyan-200">{pricingMessage}</p>}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Serviços e preços atuais</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {(pricing?.services || []).map((service) => (
                  <div key={service.key} className="rounded-lg border border-slate-700 bg-slate-900/40 p-3 text-sm">
                    <p className="font-semibold">{service.label}</p>
                    <p>Preço atual: <strong>{formatBRL(service.currentPrice)}</strong></p>
                    <p>Desconto B2B máximo: <strong>{formatBRL(service.b2bMaxDiscount ?? 0)}</strong></p>
                    <p>Desconto cupom máximo: <strong>{formatBRL(service.couponMaxDiscount ?? 0)}</strong></p>
                    <p>Desconto combinado máximo: <strong>{formatBRL(service.combinedMaxDiscount ?? 0)}</strong></p>
                    <p>Piso travado: <strong>{formatBRL(service.minAllowedPrice ?? service.currentPrice)}</strong></p>
                    <p className="text-xs text-slate-300">Override admin: {service.allowAdminOverrideCoupon ? 'Permitido' : 'Bloqueado'}</p>
                    <p className="text-xs text-slate-400">Atualizado em {new Date(service.updatedAt).toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Alterações de preço</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Serviço</th>
                      <th className="px-3 py-2">Novo valor</th>
                      <th className="px-3 py-2">Vigência</th>
                      <th className="px-3 py-2">Motivo</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pricing?.changes || []).map((change) => (
                      <tr key={change.id} className="border-t border-white/10">
                        <td className="px-3 py-2">{change.serviceKey}</td>
                        <td className="px-3 py-2">R$ {change.newPrice}</td>
                        <td className="px-3 py-2">{new Date(change.effectiveAt).toLocaleString('pt-BR')}</td>
                        <td className="px-3 py-2 max-w-md">{change.reason}</td>
                        <td className="px-3 py-2">{change.status}</td>
                        <td className="px-3 py-2">
                          {change.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => void runPricingAction('apply_now', change.id)}
                                className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
                              >
                                Aplicar agora
                              </button>
                              <button
                                type="button"
                                onClick={() => void runPricingAction('cancel', change.id)}
                                className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Fila de notificações</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Destino</th>
                      <th className="px-3 py-2">Titulo</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Criado em</th>
                      <th className="px-3 py-2">Processado em</th>
                      <th className="px-3 py-2">Recebedores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pricing?.queue || []).map((item) => (
                      <tr key={item.id} className="border-t border-white/10">
                        <td className="px-3 py-2">{item.targetRole}</td>
                        <td className="px-3 py-2">{item.title}</td>
                        <td className="px-3 py-2">{item.status}</td>
                        <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString('pt-BR')}</td>
                        <td className="px-3 py-2">{item.processedAt ? new Date(item.processedAt).toLocaleString('pt-BR') : '-'}</td>
                        <td className="px-3 py-2">{item.recipients ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
