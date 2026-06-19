'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, RefreshCw, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { buildReferralLandingUrl } from '@/lib/referral-tracking'

type ReferralStatsResponse = {
  newProspects: number
  returnVisits: number
  totalTrackedEvents: number
  lastTrackedAt: string | null
  unavailable?: boolean
}

type PartnerProspectionStatsProps = {
  defaultRefCode?: string
}

function formatDateTime(value: string | null) {
  if (!value) {
    return 'Sem eventos ainda'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Sem eventos ainda'
  }

  return parsed.toLocaleString('pt-BR')
}

export default function PartnerProspectionStats({ defaultRefCode = '' }: PartnerProspectionStatsProps) {
  const searchParams = useSearchParams()
  const refFromQuery = searchParams.get('refCode') || searchParams.get('ref') || ''
  const [refCode, setRefCode] = useState((refFromQuery || defaultRefCode).toUpperCase())
  const [activeRefCode, setActiveRefCode] = useState((refFromQuery || defaultRefCode).toUpperCase())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<ReferralStatsResponse | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  const referralUrl = activeRefCode && origin ? buildReferralLandingUrl(origin, activeRefCode) : ''

  useEffect(() => {
    if (!activeRefCode) {
      setStats(null)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/referrals/stats?refCode=${encodeURIComponent(activeRefCode)}`)
        if (!response.ok) {
          throw new Error('Falha ao carregar metricas')
        }

        const data = (await response.json()) as ReferralStatsResponse
        if (!cancelled) {
          setStats(data)
        }
      } catch {
        if (!cancelled) {
          setError('Nao foi possivel carregar as metricas agora.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [activeRefCode])

  const cards = useMemo(() => {
    return [
      {
        title: 'Novos Prospectos (Unicos)',
        value: stats?.newProspects ?? 0,
        hint: 'Primeiras entradas registradas',
        icon: Users,
      },
      {
        title: 'Retornos ao Site',
        value: stats?.returnVisits ?? 0,
        hint: 'Voltas organicas do indicado',
        icon: RefreshCw,
      },
      {
        title: 'Eventos Totais',
        value: stats?.totalTrackedEvents ?? 0,
        hint: `Ultimo evento: ${formatDateTime(stats?.lastTrackedAt ?? null)}`,
        icon: Activity,
      },
    ]
  }, [stats])

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Metricas de Prospeccao</h3>
          <p className="text-sm text-gray-600">
            Dados reais de novos prospectos e retornos com base no rastreio de indicacao.
          </p>
        </div>

        <form
          className="flex w-full gap-2 lg:w-auto"
          onSubmit={(event) => {
            event.preventDefault()
            setActiveRefCode(refCode.trim().toUpperCase())
          }}
        >
          <input
            value={refCode}
            onChange={(event) => setRefCode(event.target.value.toUpperCase())}
            placeholder="Codigo do parceiro"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 lg:w-56"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Atualizar
          </button>
        </form>
      </div>

      {!activeRefCode && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Informe seu codigo de parceiro para visualizar as metricas de prospeccao em tempo real.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {stats?.unavailable && (
        <p className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
          Banco de tracking temporariamente indisponivel. Exibindo fallback seguro.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 inline-flex rounded-md bg-blue-100 p-2 text-blue-700">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? '...' : card.value}</p>
              <p className="mt-2 text-xs text-gray-500">{card.hint}</p>
            </div>
          )
        })}
      </div>

      {activeRefCode && referralUrl && (
        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700">URL do parceiro para indicar</p>
          <p className="mt-2 break-all text-sm text-blue-900">{referralUrl}</p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(referralUrl)
              } catch {
                // no-op
              }
            }}
            className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Copiar URL
          </button>
        </div>
      )}
    </section>
  )
}
