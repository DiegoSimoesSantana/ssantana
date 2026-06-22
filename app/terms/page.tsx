import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BUSINESS_RULES } from '@/lib/business-rules'
import { FileText, ShieldCheck, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Termos de Uso e Política de Privacidade (LGPD) | Studio Santana',
  description: 'Termos de Uso e Política de Privacidade em total conformidade com a Lei Geral de Proteção de Dados (LGPD) para o site institucional do Studio Santana.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  const currentYear = new Date().getFullYear()
  const lastUpdated = "22 de Junho de 2026"
  const whatsappUrl = `https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw}?text=Olá,%20li%20os%20termos%20e%20gostaria%20de%20falar%20sobre%20um%20projeto.`

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="container mx-auto max-w-4xl">
          
          {/* Header de Categoria */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-200 text-xs font-semibold">
              <ShieldCheck size={14} />
              Conformidade com a LGPD (Lei 13.709/2018)
            </div>
          </div>

          <article className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-md dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur">
            
            <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
              <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight">
                Termos de Uso e Política de Privacidade
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Última atualização: <strong>{lastUpdated}</strong> • Versão 1.2
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                A navegação em nosso site e o preenchimento de formulários de contato ou cadastros de parceiros B2B atestam a sua <strong>aceitação explícita e consciente</strong> aos termos e políticas descritos a seguir, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </div>
            </header>

            <div className="space-y-8 text-slate-700 dark:text-slate-300 text-base leading-8">
              
              {/* Seção 1 */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="text-primary-600">1.</span> Controle e Escopo da LGPD
                </h2>
                <p>
                  O controlador dos dados coletados através deste site é a <strong>SSantana Ciência da Computação</strong> (representada comercialmente pelo Studio Santana), inscrita no CNPJ sob as leis do Brasil. O armazenamento e tratamento dos dados são realizados estritamente para a finalidade de viabilizar a entrega de software, propostas comerciais e o rastreamento financeiro de indicações de parceiros.
                </p>
              </section>

              {/* Seção 2 */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="text-primary-600">2.</span> Quais dados coletamos?
                </h2>
                <p>
                  Coletamos informações voluntárias e automáticas a depender de suas ações em nosso ambiente digital:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dados Cadastrais (Leads):</strong> Nome, e-mail, telefone corporativo e detalhes do projeto fornecidos ao preencher nossos formulários de triagem ou orçamento.</li>
                  <li><strong>Dados de Parceiros B2B:</strong> Nome, chave PIX, e-mail, telefone e informações financeiras necessárias para a consolidação de pagamentos de comissões.</li>
                  <li><strong>Logs de Consentimento:</strong> Guardamos com segurança a data, o horário e o endereço IP do momento exato de aceitação dos termos ao preencher formulários no site.</li>
                  <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e caminhos de cliques.</li>
                </ul>
              </section>

              {/* Seção 3 */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="text-primary-600">3.</span> Cookies e Rastreamentos de Marketing
                </h2>
                <p>
                  Utilizamos cookies e tecnologias de rastreamento para analisar o desempenho do site, melhorar o carregamento e gerenciar anúncios direcionados nas plataformas. Nos resguardamos no uso das seguintes ferramentas ativas e futuras:
                </p>
                <div className="grid gap-4 mt-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm mb-1">Google Analytics & Google Tag Manager</h3>
                    <p className="text-sm leading-6">Coleta dados anônimos de tráfego, sessões e páginas mais acessadas para otimização contínua de UX e relevância do conteúdo.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm mb-1">Pixels de Remarketing (Meta Pixel e TikTok Ads)</h3>
                    <p className="text-sm leading-6">Disparados para criar campanhas publicitárias qualificadas aos usuários que acessaram nosso site, exibindo propagandas de setups ou de parcerias B2B.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20">
                    <h3 className="font-bold text-slate-950 dark:text-white text-sm mb-1">Rastreamento de Atribuição (Parceiros B2B)</h3>
                    <p className="text-sm leading-6">Utilizamos cookies de sessão locais (`REFERRAL_STORAGE_KEY`) para salvar o código de indicação do parceiro comercial. Isso garante que, caso o lead feche um contrato dentro de 90 dias, a comissão seja paga automaticamente ao parceiro correto.</p>
                  </div>
                </div>
              </section>

              {/* Seção 4 */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="text-primary-600">4.</span> Direitos do Titular dos Dados (Art. 18 LGPD)
                </h2>
                <p>
                  Você, como titular de seus dados pessoais, possui os seguintes direitos assegurados por lei:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Confirmar a existência de tratamento e acessar seus dados.</li>
                  <li>Solicitar a correção de dados incompletos ou inexatos.</li>
                  <li>Exigir a eliminação permanente ou anonimização de informações fornecidas voluntariamente.</li>
                  <li>Revogar a qualquer momento o consentimento de contato promocional ou rastreamento.</li>
                </ul>
                <p>
                  Para exercer seus direitos, envie uma mensagem para o nosso encarregado de privacidade pelo e-mail <strong>{BUSINESS_RULES.CONTACT.email}</strong>.
                </p>
              </section>

              {/* Seção 5 */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="text-primary-600">5.</span> Compartilhamento de Informações
                </h2>
                <p>
                  O Studio Santana <strong>nunca comercializa ou compartilha</strong> seus dados de leads ou de parceiros com terceiros para fins publicitários. O compartilhamento ocorre estritamente com provedores homologados de infraestrutura (como banco de dados seguro da Vercel/Supabase, serviços de e-mail e provedores de autenticação) necessários para manter a estabilidade operacional da plataforma.
                </p>
              </section>

              {/* Seção 6 */}
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="text-primary-600">6.</span> Segurança de Dados
                </h2>
                <p>
                  Nossos sistemas utilizam conexões seguras criptografadas (HTTPS), autenticação multifator para administradores e banco de dados isolado com backups constantes. Nossos colaboradores e parceiros assinam cláusulas rígidas de sigilo profissional para que seus dados permaneçam confidenciais em todas as etapas da operação.
                </p>
              </section>

            </div>

            <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  © {currentYear} SSantana Ciência da Computação. Todos os direitos reservados.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 px-4 text-xs transition duration-150 shadow-md"
                >
                  <MessageCircle size={14} /> Falar com Engenheiro Sócio
                </a>
              </div>
            </footer>

          </article>
          
        </div>
      </main>

      <Footer />
    </>
  )
}
