'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { KeyRound, DollarSign, CheckCircle2, AlertCircle, Save, ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { DEFAULT_DYNAMIC_PRICING, DynamicPricingConfig } from '@/lib/dynamic-pricing'

export default function AdminConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'CREDENCIAIS' | 'PRECOS'>('CREDENCIAIS')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Aba 1: Credenciais
  const [apiCreds, setApiCreds] = useState({
    PICPAY_CLIENT_ID: '',
    PICPAY_CLIENT_SECRET: '',
    PICPAY_WEBHOOK_TOKEN: '',
    WHATSAPP_NUMBER: '5571988068222',
  })

  // Aba 2: Preços Dinâmicos
  const [pricing, setPricing] = useState<DynamicPricingConfig>(DEFAULT_DYNAMIC_PRICING)

  const loadSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/configuracoes')
      if (res.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const data = await res.json()
      if (data.apiCredentials) {
        setApiCreds({
          PICPAY_CLIENT_ID: data.apiCredentials.PICPAY_CLIENT_ID || '',
          PICPAY_CLIENT_SECRET: data.apiCredentials.PICPAY_CLIENT_SECRET || '',
          PICPAY_WEBHOOK_TOKEN: data.apiCredentials.PICPAY_WEBHOOK_TOKEN || '',
          WHATSAPP_NUMBER: data.apiCredentials.WHATSAPP_NUMBER || '5571988068222',
        })
      }
      if (data.dynamicPricing) {
        setPricing(data.dynamicPricing)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'api_credentials',
          data: apiCreds,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar credenciais')

      setStatusMessage({ type: 'success', text: data.message })
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'dynamic_pricing',
          data: pricing,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar preços dinâmicos')

      setStatusMessage({ type: 'success', text: data.message })
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
        
        {/* Header Superior */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Painel do Administrador
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Controle Operacional & Comercial</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Configurações do Ecossistema
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Gerencie credenciais do PicPay/WhatsApp e ajuste preços de campanhas de tráfego sem mexer no código.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Admin
            </a>
            <a
              href="/admin/comissoes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-sm font-semibold transition"
            >
              Ver Comissões
            </a>
          </div>
        </div>

        {/* Feedback Alert */}
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

        {/* Abas */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-8 space-x-2 sm:space-x-4">
          <button
            onClick={() => {
              setActiveTab('CREDENCIAIS')
              setStatusMessage(null)
            }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'CREDENCIAIS'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Credenciais de API e Pagamento (PicPay)
          </button>
          <button
            onClick={() => {
              setActiveTab('PRECOS')
              setStatusMessage(null)
            }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'PRECOS'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Controle Dinâmico de Preços (Tráfego Pago)
          </button>
        </div>

        {/* ABA 1: CREDENCIAIS PICPAY & WHATSAPP */}
        {activeTab === 'CREDENCIAIS' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Credenciais de Checkout & Integração Bancária
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
              As chaves salvas aqui são gravadas de forma persistente no banco de dados e têm precedência sobre as variáveis de ambiente (.env).
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  PICPAY_CLIENT_ID (Seller Token)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 5b2829b3a3c2..."
                  value={apiCreds.PICPAY_CLIENT_ID}
                  onChange={(e) => setApiCreds({ ...apiCreds, PICPAY_CLIENT_ID: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  PICPAY_CLIENT_SECRET (PicPay Token)
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    placeholder="••••••••••••••••••••••••••••••••"
                    value={apiCreds.PICPAY_CLIENT_SECRET}
                    onChange={(e) => setApiCreds({ ...apiCreds, PICPAY_CLIENT_SECRET: e.target.value })}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  PICPAY_WEBHOOK_TOKEN (Opcional - Token Secreto de Notificação)
                </label>
                <input
                  type="text"
                  placeholder="Token de verificação do webhook"
                  value={apiCreds.PICPAY_WEBHOOK_TOKEN}
                  onChange={(e) => setApiCreds({ ...apiCreds, PICPAY_WEBHOOK_TOKEN: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Número de WhatsApp Oficial (Com DDI e DDD)
                </label>
                <input
                  type="text"
                  placeholder="5571988068222"
                  value={apiCreds.WHATSAPP_NUMBER}
                  onChange={(e) => setApiCreds({ ...apiCreds, WHATSAPP_NUMBER: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-sky-600/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Gravando Credenciais...' : 'Salvar Credenciais no Banco'}
              </button>
            </form>
          </div>
        )}

        {/* ABA 2: PREÇOS DINÂMICOS (TRÁFEGO PAGO) */}
        {activeTab === 'PRECOS' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Tabela de Preços para Campanhas de Instagram & TikTok
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
              Ajuste as ofertas de baixa barreira de entrada exibidas na Home (/) e no funil de vendas.
            </p>

            <form onSubmit={handleSavePricing} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. MVP / Site com IA */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    1. MVP / Site com IA (Entrada)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Preço Promocional (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.mvpSiteIaPrice}
                        onChange={(e) => setPricing({ ...pricing, mvpSiteIaPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Preço Âncora / De (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.mvpSiteIaReferencePrice}
                        onChange={(e) => setPricing({ ...pricing, mvpSiteIaReferencePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Manutenção Mensal */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    2. Manutenção & Hospedagem Mensal
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Preço Promocional (R$/mês)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.manutencaoMensalPrice}
                        onChange={(e) => setPricing({ ...pricing, manutencaoMensalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Preço Âncora / De (R$/mês)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.manutencaoMensalReferencePrice}
                        onChange={(e) => setPricing({ ...pricing, manutencaoMensalReferencePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Suporte Técnico Rápido */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    3. Suporte TI Remoto Especializado
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        30 Minutos (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.suporteRapido30MinPrice}
                        onChange={(e) => setPricing({ ...pricing, suporteRapido30MinPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        1 Hora Técnica (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.suporteRemoto1hPrice}
                        onChange={(e) => setPricing({ ...pricing, suporteRemoto1hPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. E-mail Corporativo */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    4. E-mail Corporativo Multi-Domínio
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Mensal por Caixa (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.emailMensalPorContaPrice}
                        onChange={(e) => setPricing({ ...pricing, emailMensalPorContaPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Setup Promocional (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.emailSetupPromocionalPrice}
                        onChange={(e) => setPricing({ ...pricing, emailSetupPromocionalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. SaaS Verticais */}
                <div className="md:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    5. SaaS Verticais (Clínicas, Psicólogos e Escritórios Jurídicos)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Pré-venda (Primeiros 3 meses R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.saasVerticalPromoPrice}
                        onChange={(e) => setPricing({ ...pricing, saasVerticalPromoPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-bold text-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Mensalidade Normal Após 3m (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.saasVerticalNormalPrice}
                        onChange={(e) => setPricing({ ...pricing, saasVerticalNormalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Taxa de Setup/Implantação (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricing.saasVerticalSetupPrice}
                        onChange={(e) => setPricing({ ...pricing, saasVerticalSetupPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Atualizando Preços...' : 'Salvar Novos Preços da Vitrine'}
              </button>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
