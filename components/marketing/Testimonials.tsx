'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const cases = [
  {
    name: 'Brasville',
    role: 'Operação e acompanhamento técnico contínuo',
    problem: 'Necessidade de sustentar a rotina operacional com acompanhamento técnico constante e evolução controlada do sistema interno.',
    solution: 'Estrutura de apoio contínuo para manter o RP interno aderente ao fluxo diário e reduzir atritos operacionais.',
    href: 'https://brasville.com.br',
  },
  {
    name: 'Assegure Marcas e Patentes',
    role: 'Presença institucional objetiva',
    problem: 'Criar uma presença digital clara, organizada e compatível com o estágio atual do negócio.',
    solution: 'Projeto em WordPress com estrutura simples, sólida e adequada para comunicação institucional e comercial.',
    href: 'https://assegureonline.com.br',
  },
  {
    name: 'Ariserv',
    role: 'Sistema com aderência operacional',
    problem: 'Sair do básico sem perder simplicidade de uso na rotina da equipe.',
    solution: 'Sistema mais robusto, mas desenhado para uso objetivo e boa aderência operacional no dia a dia.',
    href: 'https://ariserv.com.br',
  },
]

export default function Testimonials() {
  return (
    <section id="projects" className="bg-white px-4 py-20 dark:bg-zinc-950">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-300">Projetos de Referência</p>
          <h2 className="mt-4 text-4xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Projetos Desenvolvidos & Casos de Sucesso
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Abaixo estão alguns dos projetos digitais e sistemas que desenvolvemos e mantemos em produção.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {cases.map((item) => (
            <article
              key={item.name}
              className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:from-zinc-900 dark:to-zinc-900/80"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">{item.name}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{item.role}</h3>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Contexto</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{item.problem}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Resposta</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{item.solution}</p>
                </div>
              </div>

              <Link
                href={item.href}
                target="_blank"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
              >
                Visitar site do projeto
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
