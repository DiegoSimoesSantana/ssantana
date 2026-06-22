import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BUSINESS_RULES } from '@/lib/business-rules'
import { Check, X, ShieldAlert, Cpu, ArrowRight, MessageCircle, Calendar, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'E-mail Profissional & Autoridade B2B | Studio Santana',
  description: 'Sua empresa ainda usa e-mail @gmail ou @hotmail? Veja o impacto comercial e os riscos de segurança ao enviar propostas com e-mails amadores.',
}

export default function EmailProfissionalPage() {
  const whatsappUrl = `https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw}?text=Olá,%20gostaria%20de%20profissionalizar%20o%20e-mail%20da%20minha%20empresa%20com%20domínio%20próprio.`
  const meetingUrl = BUSINESS_RULES.SCHEDULING.FREE_15MIN_URL

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="container mx-auto max-w-5xl">
          
          {/* Header de Categoria */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-250 bg-amber-50 px-4 py-2 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-200 animate-pulse text-xs font-semibold">
              <ShieldAlert size={14} />
              Segurança Digital & Credibilidade Comercial B2B
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-14 text-center sm:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-950 dark:text-white leading-tight">
              Sua empresa envia propostas por <span className="text-amber-600 dark:text-amber-400">@gmail</span> ou <span className="text-amber-600 dark:text-amber-400">@hotmail</span>?
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed dark:text-slate-300 max-w-4xl">
              Mais da metade das empresas descarta fornecedores que utilizam e-mails gratuitos. E-mails genéricos 
              aumentam a taxa de bloqueios de spam e expõem sua empresa a riscos de fraudes financeiras e perda de faturas.
            </p>
          </div>

          {/* Quadro Comparativo: E-mail Gratuito vs. E-mail Profissional */}
          <section className="mb-14">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-950 dark:text-white">
              Quem tem vs. Quem não tem: A visão do cliente final
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              
              {/* Card - E-mails Gratuitos */}
              <article className="rounded-3xl border border-rose-100 bg-rose-50/40 p-8 shadow-sm dark:border-rose-950/20 dark:bg-rose-950/5">
                <div className="inline-flex rounded-xl bg-rose-100 p-3 text-rose-700 dark:bg-rose-950 dark:text-rose-300 mb-6">
                  <X size={24} />
                </div>
                <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-300 mb-4">
                  Uso de e-mails genéricos
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Desconfiança de Faturas:</strong> Clientes hesitam em pagar boletos ou fechar faturas enviadas por e-mails amadores devido ao alto risco de golpes cibernéticos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Entregabilidade Baixa:</strong> Falta de configurações de domínio (SPF, DKIM, DMARC) faz com que suas mensagens caiam direto no Spam ou Lixo Eletrônico.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Perda de Propriedade:</strong> As contas são vinculadas ao indivíduo. Se o funcionário sair do negócio, a empresa perde todo o histórico comercial.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Desgaste da Marca:</strong> Toda comunicação envia a marca de terceiros (@gmail, @hotmail), em vez de divulgar e fortalecer a sua própria marca corporativa.
                    </span>
                  </li>
                </ul>
              </article>

              {/* Card - E-mail Corporativo Profissional */}
              <article className="rounded-3xl border border-emerald-200 bg-emerald-50/20 p-8 shadow-md dark:border-emerald-950/30 dark:bg-emerald-950/10">
                <div className="inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-6">
                  <Check size={24} />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-4">
                  E-mail profissional @suaempresa.com.br
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Segurança e Proteção:</strong> Envio de contratos e faturas com a certeza de identidade protegida, minimizando riscos de interceptação e golpes.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Entregabilidade Blindada:</strong> Assinatura criptográfica que atesta ao servidor do cliente final que o e-mail é legítimo, garantindo a chegada na Caixa de Entrada.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Controle Corporativo Centralizado:</strong> Criação, bloqueio e auditoria de contas de forma rápida e segura. A propriedade dos dados é sempre do negócio.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-750 dark:text-slate-350 text-base">
                      <strong>Presença Institucional Forte:</strong> Cada mensagem enviada divulga seu domínio profissional, agregando seriedade em prospecções frias e negociações B2B.
                    </span>
                  </li>
                </ul>
              </article>

            </div>
          </section>

          {/* Estatísticas de Risco de E-mail */}
          <section className="mb-14 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-6">O real impacto financeiro da escolha de e-mail</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-4 border-l-4 border-rose-500 bg-rose-50/20 dark:bg-rose-950/10">
                <span className="block text-3xl font-black text-rose-600 dark:text-rose-400">57%</span>
                <span className="mt-1 block text-sm text-slate-650 dark:text-slate-300">Dos compradores e diretores B2B relatam descartar propostas financeiras vindas de e-mails públicos.</span>
              </div>
              <div className="p-4 border-l-4 border-amber-500 bg-amber-50/20 dark:bg-amber-950/10">
                <span className="block text-3xl font-black text-amber-600 dark:text-amber-400">1 em cada 4</span>
                <span className="mt-1 block text-sm text-slate-650 dark:text-slate-300">Contratos B2B sofrem atrasos ou cancelamentos causados por e-mails de cobrança que caíram no spam.</span>
              </div>
              <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10">
                <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400">99%</span>
                <span className="mt-1 block text-sm text-slate-650 dark:text-slate-300">De entregabilidade média alcançada com assinaturas de segurança de domínio (SPF/DKIM/DMARC) ativas.</span>
              </div>
            </div>
          </section>

          {/* Atendimento Técnico do Sócio */}
          <section className="mb-14 rounded-3xl border border-cyan-100 bg-cyan-50/30 p-8 dark:border-cyan-900/30 dark:bg-cyan-950/10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 p-4 rounded-2xl flex-shrink-0">
                <Cpu size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Comunicação direta sem camadas comerciais</h4>
                <p className="text-slate-750 dark:text-slate-300 leading-relaxed text-sm">
                  O setup do seu e-mail corporativo (servidor dedicado próprio ou ecossistema Google/Microsoft/Zoho) é planejado e orientado 
                  diretamente pelo **Engenheiro de Software Sócio da empresa**. Não delegamos seu suporte para atendentes juniores sem capacidade técnica de resolução rápida. 
                  Você fala direto com quem executa.
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
                Segurança e Autoridade Digital
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
                Migre para um e-mail corporativo próprio e blinde seu negócio
              </h3>
              <p className="text-slate-300 mb-8 text-base md:text-lg leading-relaxed">
                Nós configuramos seu domínio, configuramos as chaves SPF/DKIM/DMARC e criamos suas caixas de e-mail profissionais. 
                Fale agora com o Engenheiro Sócio ou agende uma reunião rápida de triagem técnica.
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
                  Agendar Triagem Técnica (15min)
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
