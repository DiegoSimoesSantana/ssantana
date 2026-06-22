import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BUSINESS_RULES } from '@/lib/business-rules'
import { Check, X, ShieldAlert, Cpu, ArrowRight, MessageCircle, Calendar, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Diagnóstico de Presença Digital | Studio Santana',
  description: 'Seu site está desatualizado ou você ainda não tem um? Veja a diferença entre ter um canal profissional e perder clientes diariamente.',
}

export default function DiagnosticoSitePage() {
  const whatsappUrl = `https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw}?text=Olá,%20gostaria%20de%20fazer%20um%20diagnóstico%20do%20meu%20site%20ou%20presença%20digital.`
  const meetingUrl = BUSINESS_RULES.SCHEDULING.FREE_15MIN_URL

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="container mx-auto max-w-5xl">
          
          {/* Header de Categoria */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-800 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-200 animate-pulse text-xs font-semibold">
              <ShieldAlert size={14} />
              Avaliação de Risco Comercial & Presença Web
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-14 text-center sm:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-950 dark:text-white leading-tight">
              Seu site está <span className="text-rose-600 dark:text-rose-400">desatualizado</span> ou você ainda <span className="text-rose-600 dark:text-rose-400">não tem um</span>?
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed dark:text-slate-300 max-w-4xl">
              Mais de 80% dos clientes em potencial pesquisam a reputação digital de uma empresa antes de assinar contratos. 
              Um site lento, desatualizado ou a falta dele faz com que você perca vendas todos os dias para concorrentes mais preparados.
            </p>
          </div>

          {/* Quadro Comparativo: Quem Tem vs. Quem Não Tem */}
          <section className="mb-14">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-950 dark:text-white">
              O Contraste: Como o mercado enxerga o seu negócio?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              
              {/* Card - Sem Site / Desatualizado */}
              <article className="rounded-3xl border border-rose-100 bg-rose-50/40 p-8 shadow-sm dark:border-rose-950/20 dark:bg-rose-950/5">
                <div className="inline-flex rounded-xl bg-rose-100 p-3 text-rose-700 dark:bg-rose-950 dark:text-rose-300 mb-6">
                  <X size={24} />
                </div>
                <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-300 mb-4">
                  Sem site ou com site antigo
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Lentidão Crítica:</strong> Páginas demoram mais de 3 segundos para carregar, fazendo com que 53% das visitas desistam.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Mobile Incompatível:</strong> Textos distorcidos e botões que não rodam no celular. Fricção extrema para contatar pelo WhatsApp.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Invisível no Google:</strong> Sem estrutura de SEO para atrair pesquisas locais ou intenção direta de compras.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Amadorismo Visual:</strong> A desatualização passa a impressão de que a empresa parou no tempo ou faliu.
                    </span>
                  </li>
                </ul>
              </article>

              {/* Card - Com Site Studio Santana */}
              <article className="rounded-3xl border border-emerald-200 bg-emerald-50/20 p-8 shadow-md dark:border-emerald-950/30 dark:bg-emerald-950/10">
                <div className="inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-6">
                  <Check size={24} />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-4">
                  Com site moderno Studio Santana
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Velocidade Extrema (Next.js):</strong> Carregamento em milissegundos com renderização otimizada para diminuir rejeição.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Mobile-First & Conversão:</strong> Interface desenhada para celular com atalhos de clique-para-ligar e WhatsApp em um toque.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Indexação e SEO Otimizados:</strong> Código limpo estruturado com metadados corretos para ser encontrado no Google.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Autoridade Corporativa:</strong> Design premium e institucional completo, gerando confiança de nível corporativo.
                    </span>
                  </li>
                </ul>
              </article>

            </div>
          </section>

          {/* Estatísticas de Risco */}
          <section className="mb-14 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-6">Por que você não pode adiar isso?</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-4 border-l-4 border-rose-500 bg-rose-50/20 dark:bg-rose-950/10">
                <span className="block text-3xl font-black text-rose-600 dark:text-rose-400">3 segundos</span>
                <span className="mt-1 block text-sm text-slate-650 dark:text-slate-300">É o limite de tolerância antes de 53% dos usuários abandonarem o carregamento.</span>
              </div>
              <div className="p-4 border-l-4 border-amber-500 bg-amber-50/20 dark:bg-amber-950/10">
                <span className="block text-3xl font-black text-amber-600 dark:text-amber-400">80%+</span>
                <span className="mt-1 block text-sm text-slate-650 dark:text-slate-300">De leads comerciais acessam e validam o design do site corporativo antes de responder a propostas.</span>
              </div>
              <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10">
                <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400">+36%</span>
                <span className="mt-1 block text-sm text-slate-650 dark:text-slate-300">De ganho médio em fechamentos de propostas comerciais de leads validados em site corporativo moderno.</span>
              </div>
            </div>
          </section>

          {/* Modelo de Atendimento Exclusivo */}
          <section className="mb-14 rounded-3xl border border-cyan-100 bg-cyan-50/30 p-8 dark:border-cyan-900/30 dark:bg-cyan-950/10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 p-4 rounded-2xl flex-shrink-0">
                <Cpu size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Com quem você vai desenhar o seu escopo?</h4>
                <p className="text-slate-750 dark:text-slate-300 leading-relaxed text-sm">
                  Na Studio Santana, você não é atendido por intermediários comerciais sem capacidade técnica. A triagem inicial e o planejamento técnico 
                  são realizados de forma **exclusiva pelo Engenheiro de Software Sócio**. Nosso time cuida do código internamente, garantindo atendimento ágil 
                  e alta competência na entrega de sua arquitetura.
                </p>
              </div>
            </div>
          </section>

          {/* Chamada para Ação */}
          <section className="text-center bg-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-6">
                <Sparkles size={12} fill="currentColor" />
                Diagnóstico Técnico Gratuito
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
                Pare de perder clientes para uma presença digital desatualizada
              </h3>
              <p className="text-slate-300 mb-8 text-base md:text-lg leading-relaxed">
                Agende uma avaliação rápida de 15 minutos ou entre em contato diretamente pelo WhatsApp para receber um diagnóstico gratuito dos gargalos de sua presença digital.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-6 shadow-lg shadow-emerald-950/50 transition duration-150"
                >
                  <MessageCircle size={18} />
                  Falar no WhatsApp (Engenheiro Sócio)
                </a>
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:bg-white/15 text-white font-semibold py-4 px-6 transition duration-150"
                >
                  <Calendar size={18} />
                  Agendar Diagnóstico Gratuito (15min)
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
