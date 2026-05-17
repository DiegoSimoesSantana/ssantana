'use client'

import { useState, useMemo } from 'react'
import { Clock, Users, Zap } from 'lucide-react'

export function TrafficReviewCustomizer({ lang = 'pt' }: { lang?: 'pt' | 'en' | 'es' }) {
  const [meetingType, setMeetingType] = useState<'setup' | 'review' | 'none'>('setup')
  const [hours, setHours] = useState('2')
  const [frequency, setFrequency] = useState('monthly')
  const [wantsMeeting, setWantsMeeting] = useState(true)

  const labels = {
    pt: {
      title: 'Configurar Reuniões de Tráfego',
      subtitle: 'Escolha como você quer trabalhar com a gente',
      option1: 'Com acompanhamento estratégico',
      option2: 'Sem reuniões (apenas scopo)',
      meetingType: 'Tipo de reunião',
      setup: 'Setup inicial',
      review: 'Revisão de performance',
      hours: 'Quantidade de horas',
      frequency: 'Frequência',
      weekly: 'Semanal',
      biweekly: '15 dias',
      monthly: 'Mensal',
      hoursPerCycle: 'horas por ciclo',
      estimatedCost: 'Custo estimado por ciclo',
      costEstimate: '(R$ 220 hora)',
      noMeetingsNote: 'Você passa: escopo, materiais, textos e briefs. Nossa equipe executa sem reuniões adicionais.',
      readyFor: 'Pronto para começar:',
      withMeetings: 'Com reuniões estratégicas',
      withoutMeetings: 'Sem reuniões - self service',
    },
    en: {
      title: 'Configure Traffic Review Meetings',
      subtitle: 'Choose how you want to work with us',
      option1: 'With strategic support',
      option2: 'Without meetings (scope only)',
      meetingType: 'Meeting type',
      setup: 'Initial setup',
      review: 'Performance review',
      hours: 'Number of hours',
      frequency: 'Frequency',
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      hoursPerCycle: 'hours per cycle',
      estimatedCost: 'Estimated cost per cycle',
      costEstimate: '(BRL 220/hour)',
      noMeetingsNote: 'You provide: scope, materials, copy, and briefs. Our team executes without additional meetings.',
      readyFor: 'Ready to go:',
      withMeetings: 'With strategic meetings',
      withoutMeetings: 'Without meetings - self service',
    },
    es: {
      title: 'Configurar Reuniones de Tráfico',
      subtitle: 'Elige cómo trabajar con nosotros',
      option1: 'Con acompañamiento estratégico',
      option2: 'Sin reuniones (solo alcance)',
      meetingType: 'Tipo de reunión',
      setup: 'Setup inicial',
      review: 'Revisión de performance',
      hours: 'Cantidad de horas',
      frequency: 'Frecuencia',
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
      hoursPerCycle: 'horas por ciclo',
      estimatedCost: 'Costo estimado por ciclo',
      costEstimate: '(R$ 220/hora)',
      noMeetingsNote: 'Usted proporciona: alcance, materiales, textos y briefs. Nuestro equipo ejecuta sin reuniones adicionales.',
      readyFor: 'Listo para comenzar:',
      withMeetings: 'Con reuniones estratégicas',
      withoutMeetings: 'Sin reuniones - self service',
    },
  }

  const t = labels[lang]

  const estimate = useMemo(() => {
    if (!wantsMeeting) return 0
    const hourCount = Math.max(0, Math.round(Number(hours) || 0))
    return hourCount * 220
  }, [wantsMeeting, hours])

  const frequencyLabel = frequency === 'weekly' ? t.weekly : frequency === 'biweekly' ? t.biweekly : t.monthly

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
      <h3 className="text-2xl font-bold text-amber-300 mb-2 flex items-center gap-2">
        <Clock size={24} /> {t.title}
      </h3>
      <p className="text-slate-400 mb-8">{t.subtitle}</p>

      {/* Toggle: com ou sem reuniões */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setWantsMeeting(true)}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
            wantsMeeting
              ? 'bg-amber-400 text-slate-950'
              : 'border border-slate-600 text-slate-200 hover:border-slate-500'
          }`}
        >
          {t.option1}
        </button>
        <button
          onClick={() => setWantsMeeting(false)}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
            !wantsMeeting
              ? 'bg-slate-600 text-white'
              : 'border border-slate-600 text-slate-200 hover:border-slate-500'
          }`}
        >
          {t.option2}
        </button>
      </div>

      {wantsMeeting ? (
        <div className="space-y-6">
          {/* Tipo de reunião */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Zap size={16} /> {t.meetingType}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setMeetingType('setup')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  meetingType === 'setup'
                    ? 'bg-cyan-500 text-white'
                    : 'border border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {t.setup}
              </button>
              <button
                onClick={() => setMeetingType('review')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  meetingType === 'review'
                    ? 'bg-cyan-500 text-white'
                    : 'border border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {t.review}
              </button>
            </div>
          </div>

          {/* Horas */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Clock size={16} /> {t.hours}
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
            <p className="text-xs text-slate-400 mt-2">
              {hours} {t.hoursPerCycle}
            </p>
          </div>

          {/* Frequência */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Users size={16} /> {t.frequency}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="weekly">{t.weekly}</option>
              <option value="biweekly">{t.biweekly}</option>
              <option value="monthly">{t.monthly}</option>
            </select>
          </div>

          {/* Estimativa */}
          <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-5">
            <p className="text-sm text-amber-100 mb-3">
              {t.estimatedCost}
              <br />
              <span className="text-xs text-amber-200/70">{t.costEstimate}</span>
            </p>
            <div className="text-2xl font-bold text-amber-300">
              R$ {estimate.toFixed(2)}
              <span className="text-sm text-amber-200/70 ml-2">/ {frequencyLabel}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-blue-300/40 bg-blue-300/10 p-5">
          <p className="text-sm text-blue-100 leading-6">{t.noMeetingsNote}</p>
          <div className="mt-4 p-3 rounded-lg bg-blue-400/10 border border-blue-300/20">
            <p className="text-xs font-semibold text-blue-200">✓ {t.readyFor}</p>
            <p className="text-sm text-blue-100 mt-1">{t.withoutMeetings}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-300/30">
        <p className="text-xs text-slate-300">
          💡 Customização é flexível: você pode começar sem reuniões e evoluir para acompanhamento posterior.
        </p>
      </div>
    </div>
  )
}
