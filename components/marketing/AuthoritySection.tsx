'use client'

import { Eye, ShieldCheck, Target } from 'lucide-react'

export default function AuthoritySection() {
  return (
    <section className="bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_38%),linear-gradient(180deg,#f8fbfa_0%,#ffffff_42%,#f1f6f8_100%)] px-4 py-20 dark:bg-zinc-900">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-300">Posicionamento institucional</p>
          <h2 className="mb-4 mt-4 text-4xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Engenharia aplicada ao negócio com transparência total
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            A Studio Santana apoia decisores que precisam estruturar, proteger e evoluir a base tecnológica do negócio.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-12 dark:border-white/10 dark:bg-zinc-900/80">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Sua empresa não contrata apenas código: contrata continuidade operacional, reputação digital e capacidade de crescer com método.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                <div className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <Target className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Missão</p>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  Divulgar conhecimento tecnológico de forma prática e aplicável, transformando estratégia em execução real.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                <div className="inline-flex rounded-lg bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  <Eye className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">Visão</p>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  Estruturar e proteger a base tecnológica de negócios para crescimento saudável, eficiente e sustentável.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                <div className="inline-flex rounded-lg bg-violet-100 p-2 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Valores</p>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  Transparência absoluta, decisões baseadas em dados e responsabilidade técnica em cada etapa.
                </p>
              </article>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              O atendimento e a liderança de seu projeto são feitos de forma direta pelo Engenheiro de Software Sócio da empresa (decisor técnico), garantindo alta capacidade técnica de atendimento. Nosso serviço nunca é delegado a profissionais sem capacidade técnica de te orientar, e nossa equipe de funcionários atua exclusivamente em etapas internas de desenvolvimento e arquitetura.
            </p>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900/40 dark:bg-emerald-900/20">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-300">Seu guardião de servidores</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Arquitetura, infraestrutura e continuidade com liderança técnica sênior</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                A condução técnica combina experiência de engenharia em produção, visão de risco operacional e prática de governança para manter sistemas estáveis,
                e-mails confiáveis e crescimento sustentável sem improviso.
              </p>
            </div>

            <p className="text-md font-semibold text-primary-600 dark:text-primary-400">
              Também unimos consultoria tecnológica com visão de investimentos para apoiar decisões de negócio com mais clareza.
            </p>

            <a
              href="https://www.linkedin.com/in/diegobassa/?locale=pt"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
            >
              Ver perfil no LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
