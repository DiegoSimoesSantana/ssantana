'use client'

import { useEffect, useState } from 'react'

type ContractPayload = {
  partner: {
    id: string
    name: string
    referralCode: string | null
    isActive: boolean
  }
  activeContract: {
    id: string
    version: string
    title: string
    contractText: string
    startsAt: string
  } | null
  acceptance: {
    status: 'ACCEPTED' | 'REJECTED'
    acceptedAt: string
  } | null
  hasPendingContract: boolean
}

type PartnerContractsPanelProps = {
  defaultRefCode?: string
}

export default function PartnerContractsPanel({ defaultRefCode = '' }: PartnerContractsPanelProps) {
  const [refCode, setRefCode] = useState(defaultRefCode)
  const [data, setData] = useState<ContractPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const loadData = async (code: string) => {
    if (!code.trim()) {
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/partners/contracts?refCode=${encodeURIComponent(code.trim().toUpperCase())}`)
      if (!response.ok) {
        throw new Error('Falha ao carregar contratos')
      }
      const json = (await response.json()) as ContractPayload
      setData(json)
      setModalOpen(Boolean(json.hasPendingContract))
    } catch {
      setError('Nao foi possivel carregar os termos do parceiro.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (defaultRefCode) {
      void loadData(defaultRefCode)
    }
  }, [defaultRefCode])

  const updateAcceptance = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!refCode.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/partners/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refCode: refCode.trim().toUpperCase(),
          status,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao atualizar aceite')
      }

      setModalOpen(false)
      await loadData(refCode)
    } catch {
      setError('Nao foi possivel atualizar o aceite agora.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">Termos e Contratos</h3>
      <p className="mt-1 text-sm text-gray-600">
        Consulte o contrato vigente e registre aceite quando houver nova versao.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={refCode}
          onChange={(e) => setRefCode(e.target.value.toUpperCase())}
          placeholder="Codigo do parceiro"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => void loadData(refCode)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="mt-3 text-sm text-gray-600">Atualizando dados...</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {data && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Parceiro: <strong>{data.partner.name}</strong></p>
            <p className="text-sm text-gray-600">Status da conta: <strong>{data.partner.isActive ? 'Ativa' : 'Inativa'}</strong></p>
            {data.acceptance && (
              <p className="text-sm text-gray-600">
                Contrato {data.acceptance.status === 'ACCEPTED' ? 'aceito' : 'recusado'} em{' '}
                <strong>{new Date(data.acceptance.acceptedAt).toLocaleString('pt-BR')}</strong>
              </p>
            )}
          </div>

          {data.activeContract ? (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm uppercase tracking-[0.08em] text-gray-500">Contrato vigente</p>
              <h4 className="mt-1 text-lg font-semibold text-gray-900">{data.activeContract.title}</h4>
              <p className="text-sm text-gray-600">Versao {data.activeContract.version}</p>
              <p className="text-sm text-gray-600">
                Inicio de vigencia: {new Date(data.activeContract.startsAt).toLocaleDateString('pt-BR')}
              </p>
              <div className="mt-3 max-h-56 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                {data.activeContract.contractText}
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Nenhum contrato ativo cadastrado no sistema ainda.
            </p>
          )}
        </div>
      )}

      {modalOpen && data?.activeContract && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-900">Nova versao contratual pendente</h4>
            <p className="mt-1 text-sm text-gray-600">Leia e confirme para manter sua parceria ativa.</p>

            <div className="mt-4 max-h-80 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap">
              {data.activeContract.contractText}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => void updateAcceptance('REJECTED')}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Nao aceito (encerrar parceria)
              </button>
              <button
                type="button"
                onClick={() => void updateAcceptance('ACCEPTED')}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Li e aceito as novas condicoes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
