import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { EmailCalculator } from '@/components/education/EmailCalculator'
import { EmailSetupFlow } from '@/components/education/EmailSetupFlow'
import { AddEmailsExisting } from '@/components/education/AddEmailsExisting'

export const metadata: Metadata = {
  title: 'E-mail Solutions | Studio Santana',
  description: 'Planos de e-mail próprio e na nuvem com setup rápido e suporte técnico.',
}

export default function EmailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-28 pb-20 px-4 text-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Soluções de E-mail Profissional
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Escolha entre servidor próprio ou soluções em nuvem (Google, Microsoft, Zoho).
              Configuração rápida, suporte técnico incluído.
            </p>
          </div>

          <div className="space-y-8">
            {/* Cliente novo*/}
            <section className="rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-900/80 to-slate-800/60 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6">👤 Cliente Novo?</h2>
              <p className="text-slate-200 mb-8 leading-7">
                Você é novo cliente e quer criar seu servidor de e-mail próprio? Acompanhe o fluxo abaixo:
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

            {/* Cloud alternatives */}
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h3 className="text-2xl font-bold text-emerald-300 mb-6">☁️ Alternativas em Nuvem</h3>
              <p className="text-slate-200 mb-6 leading-7">
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
                  <div key={plan.name} className="rounded-lg border border-slate-600 bg-slate-800 p-4">
                    <h4 className="font-bold text-white mb-2">{plan.name}</h4>
                    <p className="text-sm text-slate-300">
                      a partir de <span className="text-emerald-300 font-semibold">{plan.from}/usuário</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                *Preços em dólar. Conversão no câmbio do mês. Entre em contato para proposta customizada.
              </p>
            </section>

            {/* CTA */}
            <div className="text-center mt-12">
              <a
                href="/#cta"
                className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                Agendar Reunião →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
