'use client'

import { useEffect, useMemo, useState } from 'react'

type Props = {
  referralCode: string
}

type SettingsResponse = {
  commissionRate: number
  autoDiscountRate: number
  minPartnerNetRate: number
  maxAllowedDiscountRate: number
}

type PersonType = 'PF' | 'PJ'

const discountFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

export default function PartnerDirectReferralForm({ referralCode }: Props) {
  const [personType, setPersonType] = useState<PersonType>('PF')
  const [settings, setSettings] = useState<SettingsResponse | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    leadName: '',
    companyName: '',
    responsibleName: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  })

  useEffect(() => {
    const loadSettings = async () => {
      const response = await fetch('/api/partners/referral-settings', { cache: 'no-store' })
      const data = await response.json()
      if (response.ok && data?.settings) {
        setSettings(data.settings)
      }
    }

    loadSettings().catch(() => setFeedback('Não foi possível carregar as configurações de desconto.'))
  }, [])

  const autoLink = useMemo(() => {
    const params = new URLSearchParams({ ref: referralCode })
    if (settings?.autoDiscountRate && settings.autoDiscountRate > 0) {
      params.set('d', settings.autoDiscountRate.toFixed(4))
    }

    return `/indicacao-vip?${params.toString()}`
  }, [referralCode, settings?.autoDiscountRate])

  const netPartnerRate = useMemo(() => {
    if (!settings) return null
    return settings.commissionRate - settings.autoDiscountRate
  }, [settings])

  async function saveSettings() {
    if (!settings) return

    setSavingSettings(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/partners/referral-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoDiscountRate: settings.autoDiscountRate }),
      })

      const data = await response.json()
      if (!response.ok) {
        setFeedback(data?.error || 'Erro ao salvar configurações.')
        return
      }

      setSettings(data.settings)
      setFeedback('Configurações salvas com sucesso.')
    } catch {
      setFeedback('Erro ao salvar configurações.')
    } finally {
      setSavingSettings(false)
    }
  }

  async function submitDirectIndication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!settings) return

    setSubmitting(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/referrals/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personType,
          ...formData,
          directDiscountRate: settings.autoDiscountRate,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setFeedback(data?.error || 'Não foi possível registrar a indicação direta.')
        return
      }

      const emailStatus = data?.email?.success
        ? 'e-mail enviado automaticamente'
        : 'indicação registrada (e-mail pendente por falta de configuração)'

      setFeedback(`Indicação direta registrada com sucesso e ${emailStatus}.`)
      setFormData({
        leadName: '',
        companyName: '',
        responsibleName: '',
        cpfCnpj: '',
        email: '',
        phone: '',
        serviceType: '',
        message: '',
      })
    } catch {
      setFeedback('Erro inesperado ao registrar indicação direta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
        <h2 className="text-xl font-semibold text-indigo-950">Configuração do seu link automático</h2>
        <p className="mt-1 text-sm text-indigo-800">
          Defina o desconto da sua indicação. O repasse líquido do parceiro sempre permanece com no mínimo 10%.
        </p>

        {settings && (
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Desconto automático no link
              </span>
              <input
                type="range"
                min={0}
                max={settings.maxAllowedDiscountRate}
                step={0.005}
                value={settings.autoDiscountRate}
                onChange={(event) =>
                  setSettings((prev) =>
                    prev
                      ? {
                          ...prev,
                          autoDiscountRate: Number(event.target.value),
                        }
                      : prev,
                  )
                }
                className="w-full"
              />
              <div className="mt-1 flex items-center justify-between text-sm text-indigo-900">
                <span>Desconto: {discountFormatter.format(settings.autoDiscountRate)}</span>
                <span>Seu repasse: {netPartnerRate !== null ? discountFormatter.format(netPartnerRate) : '—'}</span>
              </div>
            </label>

            <div className="rounded-lg border border-indigo-100 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Link automático atualizado</p>
              <p className="mt-1 break-all text-sm font-medium text-indigo-950">{autoLink}</p>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              disabled={savingSettings}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingSettings ? 'Salvando...' : 'Salvar configuração de desconto'}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-gray-900">Indicação direta PF/PJ</h2>
        <p className="mt-1 text-sm text-gray-600">
          Cadastre os dados completos do indicado. O sistema dispara e-mail automático com o link da indicação.
        </p>

        <form onSubmit={submitDirectIndication} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Tipo de indicação</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPersonType('PF')}
                aria-pressed={personType === 'PF'}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  personType === 'PF' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pessoa física (CPF)
              </button>
              <button
                type="button"
                onClick={() => setPersonType('PJ')}
                aria-pressed={personType === 'PJ'}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  personType === 'PJ' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pessoa jurídica (CNPJ)
              </button>
            </div>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              {personType === 'PF' ? 'Nome do lead' : 'Nome de contato'}
            </span>
            <input
              required
              value={formData.leadName}
              onChange={(event) => setFormData((prev) => ({ ...prev, leadName: event.target.value }))}
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              {personType === 'PF' ? 'CPF' : 'CNPJ'}
            </span>
            <input
              required
              value={formData.cpfCnpj}
              onChange={(event) => setFormData((prev) => ({ ...prev, cpfCnpj: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          {personType === 'PJ' && (
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Empresa</span>
              <input
                required
                value={formData.companyName}
                onChange={(event) => setFormData((prev) => ({ ...prev, companyName: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
          )}

          {personType === 'PJ' && (
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Responsável</span>
              <input
                required
                value={formData.responsibleName}
                onChange={(event) => setFormData((prev) => ({ ...prev, responsibleName: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
          )}

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">E-mail</span>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Telefone</span>
            <input
              required
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              autoComplete="tel"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Serviço de interesse</span>
            <input
              value={formData.serviceType}
              onChange={(event) => setFormData((prev) => ({ ...prev, serviceType: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Mensagem inicial</span>
            <input
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting || !settings}
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Registrando indicação...' : 'Registrar indicação direta e disparar e-mail'}
            </button>
          </div>
        </form>
      </section>

      {feedback && (
        <div role="status" aria-live="polite" className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">{feedback}</div>
      )}
    </div>
  )
}
