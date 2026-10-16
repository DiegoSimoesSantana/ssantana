'use client'

import Link from 'next/link'
import { ArrowRight, MessageCircle, Calendar, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react'

interface HeroSectionProps {
  whatsappNumber?: string
}

export default function HeroSection({ whatsappNumber = '5571988068222' }: HeroSectionProps) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20diagn%C3%B3stico%20t%C3%A9cnico%20para%20minha%20empresa.`
  const calendarUrl = 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ0F7YBCeVqWN-bBLEucbSzyEGjYitSxiVg52jw='

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-zinc-950 px-4 pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200 dark:border-white/10 transition-colors">
      {/* Luzes de ambientação sutis */}
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        
        {/* Badge de Tráfego / Boas-vindas */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Atendimento Direto com o Decisor Técnico Sênior</span>
        </div>

        {/* Headline de Alta Conversão */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          Desenvolvimento de Sistemas com IA, Suporte de TI e E-mail Blindado{' '}
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            — Comece Hoje com Baixo Investimento.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-zinc-300 font-normal leading-relaxed mb-10">
          Do destrave técnico remoto em minutos à criação do site ou sistema da sua empresa com Inteligência Artificial. Você fala direto com quem decide e executa.
        </p>

        {/* 2 Botões de Ação Imediata (CTA Primário & Secundário) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto mb-12">
          
          <a
            href="#ofertas-entrada"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-xl shadow-sky-600/25 transition active:scale-95"
          >
            <span>Ver Ofertas de Entrada</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-bold text-base transition shadow-sm active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Chamar no WhatsApp Agora</span>
          </a>

        </div>

        {/* Micro-prova de agilidade */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 border-t border-slate-200/60 dark:border-zinc-800/80 pt-8">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Entrada a partir de R$ 40,00</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pagamento Rápido via PIX / Cartão (PicPay)</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Sem burocracia ou intermediários</span>
          </div>
        </div>

      </div>
    </section>
  )
}
