'use client'

import { useState, useMemo } from 'react'
import { Megaphone } from 'lucide-react'

type Platform = 'tiktok' | 'instagram' | 'facebook' | 'google' | 'whatsapp' | 'other'

export function TrafficCalculator({ lang = 'pt' }: { lang?: 'pt' | 'en' | 'es' }) {
  const [budgets, setBudgets] = useState<Record<Platform, string>>({
    tiktok: '1000',
    instagram: '800',
    facebook: '600',
    google: '500',
    whatsapp: '300',
    other: '0',
  })

  const labels = {
    pt: {
      title: 'Calculadora de Tráfego Pago',
      subtitle: 'Defina seu orçamento por plataforma',
      monthly: 'Mensal',
      total: 'Orçamento Total',
      setupEstimate: 'Estimativa de Setup',
      details: 'A partir de:',
      setupBase: 'Setup base',
      aiData: 'IA e análise de dados',
      perMonth: 'por mês em mídia',
      disclaimer:
        'Esta é uma estimativa inicial. O preço final será confirmado após reunião estratégica com sua equipe.',
    },
    en: {
      title: 'Traffic Budget Calculator',
      subtitle: 'Define your budget per platform',
      monthly: 'Monthly',
      total: 'Total Budget',
      setupEstimate: 'Setup Estimate',
      details: 'Starting from:',
      setupBase: 'Base setup',
      aiData: 'AI & data analysis',
      perMonth: 'per month in ad spend',
      disclaimer:
        'This is an initial estimate. Final pricing will be confirmed after strategic consultation.',
    },
    es: {
      title: 'Calculadora de Presupuesto de Tráfico',
      subtitle: 'Define tu presupuesto por plataforma',
      monthly: 'Mensual',
      total: 'Presupuesto Total',
      setupEstimate: 'Estimativa de Setup',
      details: 'A partir de:',
      setupBase: 'Setup base',
      aiData: 'IA y análisis de datos',
      perMonth: 'por mes en publicidad',
      disclaimer:
        'Esta es una estimación inicial. El precio final se confirmará después de la consulta estratégica.',
    },
  }

  const platformNames = {
    pt: { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', google: 'Google', whatsapp: 'WhatsApp', other: 'Outro' },
    en: { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', google: 'Google', whatsapp: 'WhatsApp', other: 'Other' },
    es: { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', google: 'Google', whatsapp: 'WhatsApp', other: 'Otro' },
  }

  const t = labels[lang]
  const names = platformNames[lang]

  const estimate = useMemo(() => {
    const monthlyTotal = Object.values(budgets).reduce((sum, val) => {
      const num = Number(val) || 0
      return sum + num
    }, 0)

    const setupBase = 980
    const setupByScale = monthlyTotal * 0.1
    const aiAndData = Math.max(180, monthlyTotal * 0.04)
    const totalSetup = setupBase + setupByScale + aiAndData

    return {
      monthlyTotal,
      setupBase,
      setupByScale,
      aiAndData,
      totalSetup,
    }
  }, [budgets])

  const handleUpdate = (platform: Platform, value: string) => {
    setBudgets((prev) => ({
      ...prev,
      [platform]: value,
    }))
  }

  const platformOrder = ['tiktok', 'instagram', 'facebook', 'google', 'whatsapp', 'other'] as Platform[]

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
      <h3 className="text-2xl font-bold text-amber-300 mb-2 flex items-center gap-2">
        <Megaphone size={24} /> {t.title}
      </h3>
      <p className="text-slate-400 mb-8">{t.subtitle}</p>

      {/* Grid de inputsde plataformas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {platformOrder.map((platform) => (
          <div key={platform}>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">
              {names[platform as keyof typeof names]}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">R$</span>
              <input
                type="number"
                min="0"
                value={budgets[platform]}
                onChange={(e) => handleUpdate(platform, e.target.value)}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-6">
        <div className="mb-5">
          <p className="text-sm text-amber-100/80 mb-1">{t.total} ({t.monthly})</p>
          <p className="text-3xl font-bold text-amber-300">R$ {estimate.monthlyTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="border-t border-amber-300/30 pt-4">
          <p className="text-sm text-amber-100/80 mb-3">{t.setupEstimate}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-amber-100">
              <span>{t.details}</span>
              <span className="font-semibold">R$ {estimate.totalSetup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-xs">
              <span>+ {t.setupBase}</span>
              <span>R$ {estimate.setupBase}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-xs">
              <span>+ {t.aiData}</span>
              <span>R$ {estimate.aiAndData.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 rounded-lg bg-blue-300/10 border border-blue-300/30">
        <p className="text-xs text-blue-100">{t.disclaimer}</p>
      </div>
    </div>
  )
}
