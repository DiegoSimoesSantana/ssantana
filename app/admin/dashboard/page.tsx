'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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

export default function AdminDashboardPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [pricing, setPricing] = useState<PricingGovernance | null>(null)
  const [pricingBusy, setPricingBusy] = useState(false)
  const [pricingMessage, setPricingMessage] = useState('')
  const [tab, setTab] = useState<'partners' | 'clients' | 'leads' | 'pricing' | 'users'>('partners')
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
    if (tab === 'pricing' || tab === 'users') return []
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Parceiros: <strong>{overview?.partners?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Clientes: <strong>{overview?.clients?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Leads: <strong>{overview?.leads?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Alteracoes pendentes: <strong>{pendingChanges.length}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Fila de notificacoes: <strong>{queuedNotifications.length}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Atualizacao de precos: <strong>{pricing?.updatedAt ? new Date(pricing.updatedAt).toLocaleString('pt-BR') : '-'}</strong></div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['partners', 'clients', 'leads', 'pricing', 'users'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === item ? 'bg-cyan-300 text-slate-900' : 'bg-slate-800 text-white'}`}
            >
              {item === 'partners' ? 'Parceiros' : item === 'clients' ? 'Clientes' : item === 'leads' ? 'Leads' : item === 'pricing' ? 'Precos B2B' : 'Usuarios'}
            </button>
          ))}
        </div>

        {tab === 'users' ? (
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
