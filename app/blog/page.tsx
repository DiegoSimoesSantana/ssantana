import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog | Studio Santana',
  description:
    'Conteudos sobre governanca de tecnologia, atendimento direto com decisor, software, e-mail corporativo e operacao digital para empresas.',
}

const posts = [
  {
    category: 'Operação e Transparência',
    title: 'Por que falar direto com o Engenheiro Sócio acelera decisões técnicas e contratuais',
    excerpt:
      'Como o contato direto com o decisor técnico reduz retrabalho, evita ruído e melhora a priorização de demandas críticas.',
    href: '/metodologia',
  },
  {
    category: 'Fluxo de Atendimento',
    title: 'Grupo no WhatsApp com Engenheiro Sócio + bot: como funciona o fluxo diário de tarefas',
    excerpt:
      'Explicação prática do modelo de operação: entrada da demanda, priorização e direcionamento interno para a equipe.',
    href: '/metodologia/pt',
  },
  {
    category: 'Governanca',
    title: 'Como reduzir risco operacional em sistemas que ja estao no ar',
    excerpt:
      'Checklist pratico para manter operacao estavel com monitoramento, rotina de manutencao e alinhamento de responsabilidades.',
    href: '/metodologia',
  },
  {
    category: 'E-mail Corporativo',
    title: 'SPF, DKIM e DMARC sem jargao: o minimo para nao cair no spam',
    excerpt:
      'Entenda o essencial da autenticacao de dominio para proteger reputacao e entrega de mensagens.',
    href: '/email',
  },
  {
    category: 'Software',
    title: 'MVP com criterio: como acelerar sem comprometer a base tecnica',
    excerpt:
      'Escopo inicial, validacao e evolucao por ciclos para evitar retrabalho e custo desnecessario.',
    href: '/metodologia/pt',
  },
  {
    category: 'Parcerias B2B',
    title: 'Parcerias homologadas: por que indicamos Brasville e Assegure Online',
    excerpt:
      'Entenda como as parcerias de confiança fortalecem proteção intelectual e continuidade operacional dos clientes.',
    href: '/partners/kit-comercial',
  },
  {
    category: 'Automação Comercial B2B',
    title: 'Indicação automática com PF/PJ: como escalar parceria com baixo esforço operacional',
    excerpt:
      'Mostramos como o fluxo de indicação direta e o envio imediato de e-mail com cupom aceleram fechamento e rastreabilidade.',
    href: '/partners',
  },
]

const categoryStyles: Record<string, string> = {
  'Operação e Transparência': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'Fluxo de Atendimento': 'border-sky-200 bg-sky-50 text-sky-800',
  Governanca: 'border-amber-200 bg-amber-50 text-amber-800',
  'E-mail Corporativo': 'border-cyan-200 bg-cyan-50 text-cyan-800',
  Software: 'border-violet-200 bg-violet-50 text-violet-800',
  'Parcerias B2B': 'border-indigo-200 bg-indigo-50 text-indigo-800',
  'Automação Comercial B2B': 'border-rose-200 bg-rose-50 text-rose-800',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
              Central editorial
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 dark:text-white md:text-5xl">
              Blog de governanca e engenharia aplicada ao negocio
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300 md:text-lg">
              Este espaco concentra conteudos praticos para decisao tecnica sem excesso de jargao.
              Quando fizer sentido, cada pauta encaminha para a trilha de servico correspondente.
            </p>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                <p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${categoryStyles[post.category] || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                  {post.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                <Link
                  href={post.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-primary-700 transition hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                >
                  Ler e seguir para trilha
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
