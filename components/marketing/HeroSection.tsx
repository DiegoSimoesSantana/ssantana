'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Briefcase, Building2, Clock3, FileCheck2, Network, PenSquare, ShieldCheck, Sparkles } from 'lucide-react'
import { REFERRAL_COOKIE_KEY, REFERRAL_STORAGE_KEY } from '@/lib/referral-tracking'

const paths = [
  {
    icon: Building2,
    title: 'Institucional e governança',
    description:
      'Conheça visão, valores, método de operação e como estruturamos equipes para proteger o seu crescimento.',
    href: '/metodologia',
    cta: 'Ver estrutura institucional',
  },
  {
    icon: Briefcase,
    title: 'Sites, sistemas e APIs',
    description:
      'Trilha de desenvolvimento com escopo, MVP, evolução e faixas de investimento para cada nível de projeto.',
    href: '/metodologia/pt',
    cta: 'Abrir trilha de desenvolvimento',
  },
  {
    icon: Network,
    title: 'E-mail e infraestrutura',
    description:
      'Compare opções de e-mail da mais econômica à mais robusta, com setup, suporte e critérios de escala.',
    href: '/email',
    cta: 'Ver opções de e-mail',
  },
  {
    icon: PenSquare,
    title: 'Parcerias B2B',
    description:
      'Modelo de indicação e alianças operacionais para agências, consultorias e parceiros de tecnologia.',
    href: '/partners',
    cta: 'Ver modelo B2B',
  },
]

export default function HeroSection() {
  const [hasReferral, setHasReferral] = useState(false)
  const workflowSteps = [
    {
      step: 'Passo 1',
      title: 'Diagnóstico de gargalos',
      description:
        'Mapeamos rapidamente onde você perde tempo, dinheiro ou oportunidade comercial.',
    },
    {
      step: 'Passo 2',
      title: 'Plano de execução viável',
      description:
        'Transformamos a demanda em escopo acionável, com investimento realista e prioridade de entrega.',
    },
    {
      step: 'Passo 3',
      title: 'Ação com responsável definido',
      description:
        'Você inicia com próximo passo claro, responsável técnico e canal direto para acelerar resultado.',
    },
  ]

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const refFromQuery = query.get('ref')
    if (refFromQuery && refFromQuery.trim().length > 0) {
      setHasReferral(true)
      return
    }

    const stored = window.localStorage.getItem(REFERRAL_STORAGE_KEY)
    if (stored) {
      setHasReferral(true)
      return
    }

    const cookieFound = document.cookie
      .split('; ')
      .some((item) => item.startsWith(`${REFERRAL_COOKIE_KEY}=`))
    setHasReferral(cookieFound)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f2eee3] via-[#fdfcf8] to-[#e9f5f2] px-4 pb-20 pt-32 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          {hasReferral && (
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-primary-100 px-4 py-2 text-primary-700 animate-fade-in">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Você recebeu benefício por indicação de parceiro e desbloqueou condição especial de entrada.</span>
            </div>
          )}

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">Studio Santana • Infraestrutura de TI e Engenharia de Sistemas</p>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 animate-slide-up dark:text-white md:text-6xl">
            Infraestrutura de TI e e-mail corporativo
            <span className="bg-gradient-to-r from-emerald-700 to-sky-700 bg-clip-text text-transparent dark:from-emerald-300 dark:to-sky-300">
              {' '}blindados para operação B2B
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 animate-slide-up dark:text-gray-300 md:text-2xl" style={{ animationDelay: '0.1s' }}>
            Você entra com demanda real e sai com direção prática: estabilidade operacional, escopo técnico claro e próximo passo definido.
          </p>

          {/* Value Props */}
          <div className="mb-10 flex flex-wrap justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Visão institucional e comercial no mesmo fluxo</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Escadas de serviço do básico ao avançado</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Diagnóstico por objetivo com próximo passo definido</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/#navegacao-objetivo"
              className="group bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Ver como trabalhamos</span>
              <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
            </Link>
            
            <Link
              href="/#contact"
              className="bg-white dark:bg-white/10 dark:border dark:border-white/20 text-primary-600 dark:text-primary-300 px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/20 transition font-semibold text-lg border-2 border-primary-600"
            >
              Solicitar reunião de diagnóstico
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Portfólio integrado:</p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-400 dark:text-gray-500">
              <span className="font-semibold">Sites e Sistemas</span>
              <span className="font-semibold">Integrações e APIs</span>
              <span className="font-semibold">E-mail corporativo</span>
              <span className="font-semibold">Suporte e manutenção</span>
              <span className="font-semibold">Consultoria e treinamento</span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 text-left sm:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.45s' }}>
            <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
              <div className="inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">Segurança de decisão</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                Escopo, investimento e responsabilidades definidos com linguagem objetiva desde o primeiro contato.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
              <div className="inline-flex rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                <Clock3 className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">Ritmo operacional</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                Atendimento direto com quem decide, reduzindo retrabalho e acelerando aprovações técnicas e comerciais.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
              <div className="inline-flex rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">Governança contínua</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                Método para evolução contínua: implantação, manutenção e acompanhamento com previsibilidade.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white/85 p-6 text-left shadow-sm backdrop-blur animate-fade-in dark:border-white/10 dark:bg-white/[0.04]" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">Provas de confiança</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-transparent">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Contato com decisor técnico</p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  Sem repasse de contexto entre camadas de atendimento. Diagnóstico e direcionamento com quem executa.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-transparent">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Governança comercial clara</p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  Escopo, responsabilidades e condições documentados para reduzir ruído e proteger continuidade.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-transparent">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Parcerias homologadas</p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  Integrações com rede parceira validada para cobertura operacional, jurídica e tecnológica.
                </p>
              </article>
            </div>
          </div>
        </div>

        <div id="navegacao-objetivo" className="mx-auto mt-12 max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
              Como trabalhamos
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Três passos para sair da dúvida e avançar com segurança
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              Um fluxo simples para reduzir ruído, organizar decisão e definir o próximo movimento com objetividade.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {workflowSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-gray-200 bg-white/80 p-6 text-left shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">{item.step}</p>
                <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
              Trilhas de serviço
            </p>
            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Escolha o caminho técnico mais alinhado ao seu objetivo
            </h3>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {paths.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="inline-flex rounded-xl bg-primary-100 p-3 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-primary-700 transition hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    {item.cta}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
