import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Termos de Uso e Condições Gerais | SSantana Tecnologia & Infraestrutura',
  description: 'Termos e Condições Gerais de Prestação de Serviços, Desenvolvimento de Software e Programa de Parcerias.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <article className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          
          <header className="border-b border-slate-200 dark:border-zinc-800 pb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-semibold">
              <FileText className="w-4 h-4" />
              <span>Contrato de Adesão & Termos Comerciais</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Termos de Uso e Condições Gerais
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Última atualização: Outubro de 2026 • SSantana Tecnologia & Infraestrutura
            </p>
          </header>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Objeto e Serviços</h2>
            <p>
              Estes Termos regem a navegação no site e a contratação de serviços prestados pela <strong>SSantana Tecnologia & Infraestrutura</strong>, abrangendo desenvolvimento ágil de sites e sistemas web (MVP com IA), suporte técnico remoto especializado, hospedagem gerenciada e provisionamento de e-mail corporativo blindado.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Contrato Digital e Validação Anti-MED</h2>
            <p>
              Toda contratação gera um instrumento particular numerado (SS-2026-XXXX) com validação digital em duas etapas (envio de código de 6 dígitos via e-mail e registro de protocolo com IP, data e dispositivo), resguardando contratante e contratada nos termos da Lei 14.063/2020.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Regras do Programa de Parceiros (Cláusula Anti-MMN)</h2>
            <p>
              O comissionamento é restrito a indicações comerciais diretas de 1º nível (Nível 1 - Indicador 15% e Nível 2 - Comercial Treinado até 20%). É estritamente vedada a constituição de redes de Marketing Multinível (MMN) ou qualquer prática análoga.
            </p>
            <p>
              O resgate mínimo é de R$ 200,00 sobre saldos liberados após 30 dias de retenção legal do pagamento.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Cancelamentos e Retenção Parcial</h2>
            <p>
              Em serviços avulsos de suporte agendado (hora técnica), cancelamentos com menos de 24 horas de antecedência incorrem em taxa de retenção proporcional ao horário reservado na agenda do engenheiro responsável.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Foro e Legislação</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil, elegendo-se o foro da Comarca de Salvador/BA para dirimir eventuais litígios que não possam ser resolvidos amigavelmente por mediação técnica.
            </p>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  )
}
