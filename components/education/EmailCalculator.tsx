'use client'

import { useState, useMemo } from 'react'
import { Calculator, Mail } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'

export function EmailCalculator({ lang = 'pt' }: { lang?: 'pt' | 'en' | 'es' }) {
  const [emailUnits, setEmailUnits] = useState('5')
  const [emailChanges, setEmailChanges] = useState('0')

  const labels = {
    pt: {
      title: 'Calculadora de E-mail',
      subtitle: 'Plano de E-mail Próprio (Servidor Studio Santana)',
      emailCount: 'Quantidade de e-mails',
      futureChanges: 'Adições futuras (pós-setup)',
      monthlyFee: 'Mensalidade',
      changeCosts: 'Custo de adições',
      setup: 'Setup obrigatório',
      total: 'Investimento Inicial',
    },
    en: {
      title: 'Email Calculator',
      subtitle: 'Private Email Plan (Studio Santana Server)',
      emailCount: 'Number of mailboxes',
      futureChanges: 'Future additions (post-setup)',
      monthlyFee: 'Monthly fee',
      changeCosts: 'Addition costs',
      setup: 'Mandatory setup',
      total: 'Initial Investment',
    },
    es: {
      title: 'Calculadora de E-mail',
      subtitle: 'Plan de E-mail Propio (Servidor Studio Santana)',
      emailCount: 'Cantidad de buzones de correo',
      futureChanges: 'Adiciones futuras (post-setup)',
      monthlyFee: 'Tarifa Mensual',
      changeCosts: 'Costos de adiciones',
      setup: 'Setup obligatorio',
      total: 'Inversión Inicial',
    },
  }

  const t = labels[lang]

  const estimate = useMemo(() => {
    const units = Math.max(0, Math.round(Number(emailUnits) || 0))
    const changes = Math.max(0, Math.round(Number(emailChanges) || 0))
    return {
      units,
      changes,
      monthly: units * BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL,
      changesCost: changes * 15,
      setup: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
    }
  }, [emailUnits, emailChanges])

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
      <h3 className="text-2xl font-bold text-cyan-300 mb-2 flex items-center gap-2">
        <Mail size={24} /> {t.title}
      </h3>
      <p className="text-slate-400 mb-6">{t.subtitle}</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            {t.emailCount}
          </label>
          <input
            type="number"
            min="1"
            value={emailUnits}
            onChange={(e) => setEmailUnits(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            {t.futureChanges}
          </label>
          <input
            type="number"
            min="0"
            value={emailChanges}
            onChange={(e) => setEmailChanges(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-5">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">{t.monthlyFee}:</span>
            <span className="font-semibold text-cyan-300">R$ {estimate.monthly.toFixed(2)}</span>
          </div>
          {estimate.changes > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-300">{t.changeCosts}:</span>
              <span className="font-semibold text-amber-300">R$ {estimate.changesCost.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-cyan-300/20 pt-3 flex justify-between">
            <span className="text-slate-300">{t.setup}:</span>
            <span className="font-semibold text-emerald-300">R$ {estimate.setup.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-cyan-300/30">
            <span className="text-white">{t.total}:</span>
            <span className="text-cyan-200">R$ {(estimate.setup + estimate.changesCost).toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 leading-5">
          Mensalidade recorrente: R$ {estimate.monthly.toFixed(2)}/mês após setup
        </p>
      </div>
    </div>
  )
}
