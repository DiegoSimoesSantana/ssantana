import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { TrafficCalculator } from '@/components/education/TrafficCalculator'
import { TrafficReviewCustomizer } from '@/components/education/TrafficReviewCustomizer'

export const metadata: Metadata = {
  title: 'Tráfego Pago & PNL | Studio Santana',
  description: 'Funil de trafego pago com estrategia, setup e revisoes de performance alinhadas ao contexto do negocio.',
}

export default function TrafficPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-950 dark:text-white">
              Trafego pago com estrategia, nao so configuracao
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed dark:text-slate-300">
              Configuração estratégica para TikTok, Kwai, WhatsApp, Instagram, Facebook, Google, Google Maps, Waze e outros.
              A IA acelera a análise, mas o diferencial está no entendimento do seu negócio e do seu cliente.
            </p>
          </div>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/80">
            <h2 className="text-2xl font-bold text-cyan-700 mb-4 dark:text-cyan-300">Fluxo de entrada desta trilha</h2>
            <p className="text-slate-700 leading-7 dark:text-slate-200">
              Esta pagina e um funil especifico para capatacao de trafego pago. A proposta final so e fechada depois da reuniao de entendimento de contexto, metas e restricoes do negocio.
            </p>
          </section>

          <div className="space-y-8">
            <section>
              <TrafficCalculator lang="pt" />
            </section>

            <section>
              <TrafficReviewCustomizer lang="pt" />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-cyan-700 mb-6 dark:text-cyan-300">Como funciona</h3>

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
                  <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800">
                    <h4 className="font-bold text-emerald-700 mb-2 dark:text-emerald-300">{step.title}</h4>
                    <p className="text-slate-700 text-sm leading-6 dark:text-slate-200">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-amber-700 mb-6 dark:text-amber-300">Plataformas suportadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['TikTok', 'Kwai', 'Instagram', 'Facebook', 'Google Ads', 'Google Maps', 'Waze', 'WhatsApp'].map(
                  (platform) => (
                    <div key={platform} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                      {platform}
                    </div>
                  )
                )}
              </div>
              <p className="text-xs text-slate-500 mt-4 dark:text-slate-400">
                Outras plataformas podem ser integradas. Consulte nossa equipe.
              </p>
            </section>

            <div className="rounded-lg border border-blue-300/40 bg-blue-300/10 p-6">
              <p className="text-sm text-blue-900 leading-7 dark:text-blue-100">
                <strong>Nota sobre precos:</strong> A calculadora acima oferece uma estimativa inicial baseada no seu orçamento.
                O preço final é confirmado após reunião estratégica onde alinhamos objetivos, público-alvo e resultados esperados.
              </p>
            </div>

            <div className="text-center mt-12">
              <a
                href="/#contact"
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-amber-500/50 transition"
              >
                Solicitar triagem de trafego
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
