'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type AdminOverview = {
  partners: Array<any>
  clients: Array<any>
  leads: Array<any>
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [tab, setTab] = useState<'partners' | 'clients' | 'leads'>('partners')

  const load = async () => {
    setLoading(true)
    const session = await fetch('/api/admin/auth/session').then((r) => r.json())
    if (!session.authenticated) {
      router.push('/admin/login')
      return
    }
    setAuthorized(true)
    const data = await fetch('/api/admin/overview').then((r) => r.json())
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
    if (tab === 'partners') return overview.partners
    if (tab === 'clients') return overview.clients
    return overview.leads
  }, [overview, tab])

  const removeItem = async (id: string) => {
    await fetch(`/api/admin/overview?entity=${tab === 'partners' ? 'partner' : tab === 'clients' ? 'client' : 'lead'}&id=${id}`, {
      method: 'DELETE',
    })
    await load()
  }

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading || !authorized) {
    return <main className="min-h-screen bg-slate-950 p-8 text-slate-100">Carregando painel admin...</main>
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Admin Dashboard Geral</h1>
          <button onClick={logout} className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800">
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Parceiros: <strong>{overview?.partners?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Clientes: <strong>{overview?.clients?.length || 0}</strong></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">Leads: <strong>{overview?.leads?.length || 0}</strong></div>
        </div>

        <div className="flex gap-2">
          {(['partners', 'clients', 'leads'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === item ? 'bg-cyan-300 text-slate-900' : 'bg-slate-800 text-white'}`}
            >
              {item === 'partners' ? 'Parceiros' : item === 'clients' ? 'Clientes' : 'Leads'}
            </button>
          ))}
        </div>

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
      </div>
    </main>
  )
}
