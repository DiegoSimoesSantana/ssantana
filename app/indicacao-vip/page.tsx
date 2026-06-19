import type { Metadata } from 'next'
import { ArrowRight, BadgeCheck, Clock3, MessageCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'

const CALENDAR_LINK =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export const metadata: Metadata = {
  title: 'Atendimento VIP por Indicacao',
  description:
    'Pagina de pouso para clientes indicados, com linguagem acessivel, foco em estabilidade, suporte e fechamento do setup.',
}

export default function ReferredClientLandingPage() {
  const whatsappUrl = `https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw.replace('+', '')}?text=${encodeURIComponent(
    'Vim por indicacao e quero saber como funciona o atendimento VIP.',
  )}`

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-slate-900">
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,83,45,0.18),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(180,83,9,0.12),_transparent_25%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(247,243,235,0.96))]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900 shadow-sm">
            <BadgeCheck className="h-4 w-4" />
            Atendimento VIP via indicacao
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:items-start">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-6xl">
                Seu site precisa parecer profissional e continuar confiavel depois que entra no ar.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                Se voce chegou por indicacao de um designer parceiro, entrou na fila certa. Aqui o foco nao e termo tecnico.
                E resultado pratico: site rapido, e-mail configurado direito e suporte que responde quando o negocio precisa.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Falar no WhatsApp agora
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={CALENDAR_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-900/10 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Agendar apresentacao
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-900/10 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">O que voce contrata na pratica</p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: 'Site rapido e estavel',
                    description: 'Seu cliente abre a pagina sem lentidao, travamento ou susto no lancamento.',
                  },
                  {
                    title: 'E-mail funcionando como deve',
                    description: 'Configuracao para reduzir erro, perda de mensagem e risco de cair no spam.',
                  },
                  {
                    title: 'Suporte tecnico com nome e contexto',
                    description: 'Voce nao cai num atendimento generico. Entramos sabendo que veio por indicacao.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-[#faf6ef] p-4">
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: 'Seu site mais rapido no Google',
              description: 'Estrutura tecnica para o projeto nao ficar bonito so no layout, mas rapido na experiencia real.',
            },
            {
              icon: ShieldCheck,
              title: 'E-mail blindado contra configuracao ruim',
              description: 'Ajustes para diminuir dor comum de autenticacao, entrega e reputacao do dominio.',
            },
            {
              icon: Sparkles,
              title: 'Atendimento VIP sem jargao',
              description: 'Explicamos o necessario em linguagem de negocio, nao com siglas que atrapalham a decisao.',
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Entrada por indicacao</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Voce entrou por um caminho com atendimento priorizado</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-[#faf6ef] p-4">
              <p className="font-semibold text-slate-900">1. Triagem de contexto</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Mapeamos objetivo, urgencia e etapa do seu projeto para direcionar a proposta correta.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-[#faf6ef] p-4">
              <p className="font-semibold text-slate-900">2. Proposta sem ruido tecnico</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Voce recebe o caminho em linguagem de negocio, com escopo e continuidade claros.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-[#faf6ef] p-4">
              <p className="font-semibold text-slate-900">3. Operacao acompanhada</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">A entrega entra com suporte e estabilidade para nao quebrar depois da publicacao.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr,0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Como funciona</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Tres passos para sair do layout e entrar na operacao sem susto.</h2>
            <div className="mt-8 space-y-4">
              {[
                {
                  step: '01',
                  title: 'Entendemos o que precisa entrar no ar',
                  description: 'Site institucional, landing page, email profissional ou estrutura para manter tudo funcionando.',
                },
                {
                  step: '02',
                  title: 'Mostramos o setup e o suporte sem complicar',
                  description: 'Voce entende o que sera feito, o prazo e o que continua acompanhado depois.',
                },
                {
                  step: '03',
                  title: 'Seu designer continua bem posicionado',
                  description: 'A indicacao fica registrada e o atendimento respeita a relacao comercial que ja existe.',
                },
              ].map((item) => (
                <div key={item.step} className="grid gap-4 rounded-2xl border border-slate-200 bg-[#faf6ef] p-5 sm:grid-cols-[72px,1fr]">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-900 to-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Confianca para fechar</p>
            <h2 className="mt-4 text-3xl font-semibold">Seu negocio nao precisa aprender tecnologia para tomar a decisao certa.</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
              <p>
                O trabalho e liderado por perfil tecnico com formacao avancada e experiencia senior em engenharia de software.
                Isso importa porque infraestrutura mal feita aparece depois: lentidao, email falhando, queda em horario ruim e retrabalho.
              </p>
              <p>
                A proposta aqui e simples: colocar a parte tecnica no lugar certo para que o design entregue credibilidade e o negocio
                consiga operar sem susto.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">Condicao comercial mais comum</p>
                <p className="mt-2 text-3xl font-semibold text-white">Setup de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Com orientacao clara, atendimento prioritario via indicacao e continuidade mensal de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(BUSINESS_RULES.MANUTENCAO_MENSAL)} para manter a operacao acompanhada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-6xl rounded-[2.25rem] bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Pronto para o proximo passo</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Voce nao precisa resolver tudo sozinho antes de falar com a equipe tecnica.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Envie uma mensagem, explique o que precisa colocar no ar e receba um caminho claro. Se veio por indicacao, isso ja esta registrado.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Chamar no WhatsApp
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Agendar atendimento
                <Clock3 className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}