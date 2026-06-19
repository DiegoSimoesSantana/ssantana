import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { EmailCalculator } from '@/components/education/EmailCalculator'
import { EmailSetupFlow } from '@/components/education/EmailSetupFlow'
import { AddEmailsExisting } from '@/components/education/AddEmailsExisting'

export const metadata: Metadata = {
  title: 'E-mail Corporativo e Sustentação | Studio Santana',
  description: 'Trilha comercial de e-mail corporativo com escada de planos do mais econômico ao mais robusto para operação B2B.',
}

export default function EmailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-950 dark:text-white">
              E-mail corporativo com escada de investimento clara
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed dark:text-slate-300">
              Esta página é o funil comercial de e-mail para empresas que precisam decidir rápido.
              Você compara opções da mais barata à mais robusta, com critérios técnicos e impacto financeiro.
            </p>
          </div>

          <section className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 dark:border-emerald-700/50 dark:from-emerald-900/20 dark:via-slate-900 dark:to-cyan-900/20">
            <h2 className="mb-4 text-2xl font-bold text-emerald-800 dark:text-emerald-300">Do mais barato ao mais caro: qual caminho escolher?</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-emerald-200 bg-white/90 p-4 dark:border-emerald-700/40 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">1. Entrada econômica</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Servidor próprio SSANTANA</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Melhor custo por conta para empresas que priorizam orçamento e controle operacional.</p>
              </article>
              <article className="rounded-xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-700/40 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">2. Estrutura profissional</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Setup completo + gestão contínua</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Ideal para empresas que querem evitar falhas de entrega, spam e perda de comunicação comercial.</p>
              </article>
              <article className="rounded-xl border border-violet-200 bg-white/90 p-4 dark:border-violet-700/40 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">3. Camada premium</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Google, Microsoft ou Zoho</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Maior investimento para times que precisam de ecossistema cloud avançado e colaboração ampliada.</p>
              </article>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/80">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Modelo de atendimento da operação</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
              O atendimento comercial e o suporte inicial de engenharia são feitos de forma direta pelo Engenheiro de Software Sócio da empresa (decisor técnico), garantindo alta capacidade técnica na comunicação. Nossos serviços não são delegados a profissionais sem competência técnica de te orientar, e nossa equipe de funcionários atua exclusivamente em etapas internas de infraestrutura e suporte do sistema.
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/80">
            <h2 className="text-2xl font-bold text-cyan-700 mb-4 dark:text-cyan-300">Fluxo de atendimento</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Novo cliente</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Reunião de alinhamento para mapear riscos, domínio, caixas e política de continuidade.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Cliente ativo</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Atendimentos de continuidade seguem regras contratuais com previsibilidade de custos.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Indicação parceira</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Encaminhamentos de parceiros credenciados entram com prioridade de triagem comercial.</p>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-800/60">
              <h2 className="text-2xl font-bold text-cyan-700 mb-6 dark:text-cyan-300">Entrada para novos clientes</h2>
              <p className="text-slate-700 mb-8 leading-7 dark:text-slate-200">
                Quer iniciar com e-mail profissional no seu domínio? Acompanhe o fluxo de implantação com etapas simples e objetivas.
              </p>
              <EmailSetupFlow lang="pt" />
            </section>

            {/* Calculadora */}
            <section>
              <EmailCalculator lang="pt" />
            </section>

            {/* Cliente existente */}
            <section>
              <AddEmailsExisting lang="pt" />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-emerald-700 mb-6 dark:text-emerald-300">Alternativas em nuvem</h3>
              <p className="text-slate-700 mb-6 leading-7 dark:text-slate-200">
                Também trabalhamos com <strong>Google Workspace, Microsoft 365 e Zoho</strong>.
                O setup é o mesmo (R$ 200), mas a mensalidade varia conforme plano, número de usuários
                e funcionalidades adicionais.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Google Workspace', from: '6-14 USD' },
                  { name: 'Microsoft 365', from: '6-20 USD' },
                  { name: 'Zoho Mail', from: '1-8 USD' },
                ].map((plan) => (
                  <div key={plan.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800">
                    <h4 className="font-bold text-slate-900 mb-2 dark:text-white">{plan.name}</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      a partir de <span className="text-emerald-700 font-semibold dark:text-emerald-300">{plan.from}/usuário</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 dark:text-slate-400">
                *Preços em dólar. Conversão no câmbio do mês. Entre em contato para proposta customizada.
              </p>
            </section>

            <div className="text-center mt-12">
              <a
                href="/#contact"
                className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                Solicitar triagem de e-mail
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
