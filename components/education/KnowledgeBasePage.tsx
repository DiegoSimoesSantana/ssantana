import Link from 'next/link'
import { ArrowRight, BookOpenText, BrainCircuit, Layers3, ShieldCheck, Target, Workflow, Mail, Globe2, TrendingUp, MessageCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const sections = [
  { id: 'filosofia', label: 'Filosofia' },
  { id: 'mvp', label: 'MVP e Iteração' },
  { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'stack', label: 'Stack e Critérios' },
  { id: 'lideranca', label: 'Liderança Técnica' },
  { id: 'fora', label: 'O que fica fora' },
]

const principles = [
  'Problema primeiro, tecnologia depois.',
  'Escopo útil antes de complexidade desnecessária.',
  'Arquitetura em blocos para evoluir sem retrabalho.',
  'Decisão técnica alinhada a continuidade operacional.',
]

const architectureBlocks = [
  {
    title: 'Interface',
    text: 'Experiência visual clara, responsiva e orientada à ação do usuário final.',
  },
  {
    title: 'Domínio',
    text: 'Regras do negócio separadas da camada visual para facilitar manutenção.',
  },
  {
    title: 'Integrações',
    text: 'APIs, webhooks e automações conectadas com previsibilidade.',
  },
  {
    title: 'Dados',
    text: 'Banco de dados com estrutura consistente para escalar sem perda de controle.',
  },
]

const stackItems = [
  'Frontend: React, TypeScript, CSS e HTML5',
  'Backend e APIs: Node.js, Python, PHP, Java, C#, C++ e VB quando necessário',
  'Banco de dados: PostgreSQL e integrações com outros motores',
  'Infraestrutura: Linux, cloud, deploy automatizado e monitoramento',
  'IA aplicada: automações e assistentes para produtividade real',
]

export default function KnowledgeBasePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_36%,#eef4f3_100%)] px-4 pb-20 pt-28 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_26%),linear-gradient(180deg,#020617_0%,#0f172a_35%,#111827_100%)] dark:text-slate-100">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-10 dark:border-white/10 dark:bg-slate-950/70">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">Base de conhecimento</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[280px,1fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <BookOpenText className="h-5 w-5" />
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Metodologia de Engenharia</h1>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Página de documentação para entender como pensamos arquitetura, MVP, evolução e continuidade técnica.
                  </p>

                  <nav className="mt-6 space-y-2">
                    {sections.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              <div className="space-y-6">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/60 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">Arquitetura antes do produto</p>
                  <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white md:text-5xl">
                    Sistemas rápidos no MVP, sólidos na evolução.
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
                    Esta página existe para documentar filosofia, critérios e estrutura. Preços, funis e estimativas ficam nas páginas de venda de cada serviço.
                  </p>
                </section>

                <section id="filosofia" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/60 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Filosofia de Engenharia</h3>
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    O foco é resolver o problema certo com a menor complexidade necessária. A entrega começa pelo núcleo útil e cresce com validação,
                    mantendo estabilidade, previsibilidade e clareza de decisão.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {principles.map((item) => (
                      <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{item}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="mvp" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/60 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                      <Workflow className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">MVP e Iteração</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    MVP não é algo incompleto por definição. É a forma de entregar o essencial com critério, testar hipóteses e evoluir sem
                    comprometer a base técnica.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                      'Descoberta orientada ao objetivo',
                      'Planejamento técnico enxuto',
                      'Evolução por ciclos com feedback',
                    ].map((item) => (
                      <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">{item}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="arquitetura" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/60 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Arquitetura por blocos</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Cada solução é dividida em blocos claros para permitir evolução sem quebrar o que já funciona.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {architectureBlocks.map((item) => (
                      <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                        <h4 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="stack" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/60 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                      <BrainCircuit className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Stack e critérios</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    A tecnologia é escolhida como meio, não como fim. O objetivo é segurança, velocidade de entrega e previsibilidade operacional.
                  </p>
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {stackItems.map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                <section id="lideranca" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/60 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Liderança técnica</h3>
                  </div>
                  <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                    A condução técnica combina experiência de produção, visão de risco e responsabilidade operacional para manter sistemas e e-mails
                    confiáveis sem improviso.
                  </p>
                </section>

                <section id="fora" className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/40 dark:bg-amber-900/20 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-200">O que fica fora desta página</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    <li>• Preços detalhados de produtos e serviços.</li>
                    <li>• Calculadoras comerciais de tráfego ou e-mail.</li>
                    <li>• Funis de venda de serviços específicos.</li>
                  </ul>
                  <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    Esses temas vivem nas páginas de serviço e vendas correspondentes para manter esta rota focada em conhecimento e metodologia.
                  </p>
                </section>

                <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.3)] md:p-10">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Contratação Rápida</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">Precisa de ajuda prática em tecnologia e infraestrutura?</h3>
                    <p className="mt-3 text-slate-300 leading-relaxed">
                      Conduzimos sua demanda técnica diretamente com quem decide, sem camadas de atendimento. Escolha a sua necessidade e inicie hoje mesmo.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition flex flex-col justify-between">
                      <div>
                        <div className="inline-flex rounded-lg bg-emerald-900/30 p-2 text-emerald-400 mb-3">
                          <Mail className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-white">E-mail Profissional</h4>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          Setup corporativo blindado e seguro de e-mails em servidor dedicado ou Google/Microsoft/Zoho.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400">Setup: R$ 200</span>
                        <Link href="/email" className="text-xs font-bold text-white underline hover:text-slate-200">
                          Contratar ➔
                        </Link>
                      </div>
                    </article>

                    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition flex flex-col justify-between">
                      <div>
                        <div className="inline-flex rounded-lg bg-cyan-900/30 p-2 text-cyan-400 mb-3">
                          <Globe2 className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-white">Sistemas & MVP</h4>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          Valide sua ideia com um produto digital (site ou app) entregue em 5 dias úteis com código fonte limpo.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-400">A partir de R$ 2.000</span>
                        <Link href="/metodologia/pt" className="text-xs font-bold text-white underline hover:text-slate-200">
                          Iniciar ➔
                        </Link>
                      </div>
                    </article>

                    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition flex flex-col justify-between">
                      <div>
                        <div className="inline-flex rounded-lg bg-violet-900/30 p-2 text-violet-400 mb-3">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-white">Tráfego Pago</h4>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          Estratégia, criativos e setup completo no Google Ads, Instagram, Facebook, TikTok e Kwai.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-violet-400">Foco em Conversão</span>
                        <Link href="/trafego" className="text-xs font-bold text-white underline hover:text-slate-200">
                          Contratar ➔
                        </Link>
                      </div>
                    </article>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row items-center border-t border-white/10 pt-6">
                    <a
                      href="https://wa.me/5571988068222"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-400 shadow-lg shadow-emerald-950/50"
                    >
                      <MessageCircle className="h-5 w-5" /> Falar direto no WhatsApp (Engenheiro Sócio)
                    </a>
                    <Link
                      href="/precos"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Ver Tabela de Preços Geral
                    </Link>
                    <Link
                      href="/partners"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                    >
                      Seja um Parceiro B2B
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
