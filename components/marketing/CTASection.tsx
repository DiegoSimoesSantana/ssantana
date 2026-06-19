'use client'

import { ArrowRight, CalendarDays, Mail, Phone, ShieldCheck, Workflow } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'

export default function CTASection() {
  const meetingUrl = BUSINESS_RULES.SCHEDULING.FREE_15MIN_URL
  const whatsappUrl = `https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw}`
  const emailUrl = `mailto:${BUSINESS_RULES.CONTACT.email}`

  return (
    <section id="contact" className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(232,244,240,0.16),_transparent_34%),linear-gradient(135deg,#09131f_0%,#102131_52%,#163240_100%)] px-4 py-20 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-10 lg:p-12">
          <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.25fr,0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/90">Contato executivo</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                Agende uma reunião online e trate diretamente com quem decide escopo, arquitetura e execução.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                O primeiro contato precisa transmitir segurança, clareza e objetividade. Por isso, a entrada comercial acontece com acesso direto,
                agenda definida e canais formais de continuidade.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <article className="rounded-2xl border border-white/12 bg-white/6 p-4">
                  <div className="inline-flex rounded-xl bg-emerald-300/15 p-2 text-emerald-200">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">Agenda objetiva</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Reunião marcada com pauta clara e próximo passo definido ao final.</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-white/6 p-4">
                  <div className="inline-flex rounded-xl bg-sky-300/15 p-2 text-sky-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">Postura profissional</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Alinhamento com transparência comercial, técnica e contratual desde o início.</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-white/6 p-4">
                  <div className="inline-flex rounded-xl bg-amber-300/15 p-2 text-amber-200">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">Continuidade operacional</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Após aprovação, o fluxo segue com organização por prioridade e responsável.</p>
                </article>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-7 py-4 text-base font-semibold text-slate-950 transition hover:brightness-105"
                >
                  Agende uma reunião online
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/8 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/14"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={emailUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/8 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/14"
                >
                  <Mail className="h-4 w-4" />
                  E-mail
                </a>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-white/12 bg-slate-950/45 p-6 shadow-inner shadow-black/20">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Canais disponíveis</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Entrada comercial com presença executiva</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Se preferir, escolha o canal mais adequado para o seu momento. Todos direcionam para atendimento real, sem formulários genéricos e sem perda de contexto.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Reunião online</p>
                  <p className="mt-2 text-sm text-slate-200">Ideal para diagnóstico, definição de escopo e alinhamento estratégico.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">WhatsApp</p>
                  <p className="mt-2 text-sm text-slate-200">Atendimento rápido para continuidade, dúvidas iniciais e encaminhamento comercial.</p>
                  <p className="mt-3 text-sm font-medium text-white">{BUSINESS_RULES.CONTACT.phone}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">E-mail corporativo</p>
                  <p className="mt-2 text-sm text-slate-200">Canal formal para propostas, documentação e tratativas comerciais.</p>
                  <p className="mt-3 text-sm font-medium text-white">{BUSINESS_RULES.CONTACT.email}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
