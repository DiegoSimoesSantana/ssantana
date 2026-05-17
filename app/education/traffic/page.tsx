import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { TrafficCalculator } from '@/components/education/TrafficCalculator'
import { TrafficReviewCustomizer } from '@/components/education/TrafficReviewCustomizer'

export const metadata: Metadata = {
  title: 'Tráfego Pago & PNL | Studio Santana',
  description: 'Setup estratégico de tráfego pago com otimização de conversão e reuniões de acompanhamento customizáveis.',
}

export default function TrafficPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-28 pb-20 px-4 text-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Setup de Tráfego Pago com PNL
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Configuração estratégica para TikTok, Kwai, WhatsApp, Instagram, Facebook, Google, Google Maps, Waze e outros.
              A IA acelera a análise, mas o diferencial está no entendimento do seu negócio e do seu cliente.
            </p>
          </div>

          <div className="space-y-8">
            {/* Calculadora */}
            <section>
              <TrafficCalculator lang="pt" />
            </section>

            {/* Customizar reuniões */}
            <section>
              <TrafficReviewCustomizer lang="pt" />
            </section>

            {/* Detalhes do processo */}
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h3 className="text-2xl font-bold text-cyan-300 mb-6">🎯 Como Funciona</h3>

              <div className="space-y-4">
                {[
                  {
                    title: '1. Coleta de Dados',
                    desc: 'Você nos passa o orçamento por plataforma, seus produtos/serviços e seu público-alvo.',
                  },
                  {
                    title: '2. Análise e Estratégia',
                    desc: 'Nossa equipe define funil, criativos e hipóteses de conversão com suporte de IA.',
                  },
                  {
                    title: '3. Setup Executado',
                    desc: 'Campanhas configuradas, públicos-alvo segmentados, creativos inseridos.',
                  },
                  {
                    title: '4. Reuniões de Acompanhamento',
                    desc: 'Você choose: sem reuniões, setup inicial, ou revisões periódicas de performance.',
                  },
                  {
                    title: '5. Otimização Contínua',
                    desc: 'Ajustes de bid, público, criativos e landing page conforme performance real.',
                  },
                ].map((step, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-600 bg-slate-800 p-4">
                    <h4 className="font-bold text-emerald-300 mb-2">{step.title}</h4>
                    <p className="text-slate-200 text-sm leading-6">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Plataformas suportadas */}
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h3 className="text-2xl font-bold text-amber-300 mb-6">📱 Plataformas Suportadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['TikTok', 'Kwai', 'Instagram', 'Facebook', 'Google Ads', 'Google Maps', 'Waze', 'WhatsApp'].map(
                  (platform) => (
                    <div key={platform} className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-center font-semibold text-slate-100">
                      {platform}
                    </div>
                  )
                )}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Outras plataformas podem ser integradas. Consulte nossa equipe.
              </p>
            </section>

            {/* Nota sobre preço */}
            <div className="rounded-lg border border-blue-300/40 bg-blue-300/10 p-6">
              <p className="text-sm text-blue-100 leading-7">
                <strong>📝 Nota sobre Preços:</strong> A calculadora acima oferece uma estimativa inicial baseada no seu orçamento.
                O preço final é confirmado após reunião estratégica onde alinhamos objetivos, público-alvo e resultados esperados.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <a
                href="/#cta"
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-amber-500/50 transition"
              >
                Solicitar Proposta de Tráfego →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
