import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidade | SSantana Tecnologia & Infraestrutura',
  description: 'Política de Privacidade e Proteção de Dados em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-between transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <article className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          
          <header className="border-b border-slate-200 dark:border-zinc-800 pb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Conformidade com a LGPD (Lei 13.709/2018)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Política de Privacidade e Proteção de Dados
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Última atualização: Outubro de 2026 • SSantana Tecnologia & Infraestrutura
            </p>
          </header>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Nosso Compromisso com a Privacidade</h2>
            <p>
              A <strong>SSantana Tecnologia & Infraestrutura</strong> preza pela transparência, integridade e segurança dos dados de clientes, parceiros comerciais e visitantes de nossos portais. Não comercializamos dados de usuários e coletamos apenas o estritamente necessário para prestar nossos serviços de software, e-mail corporativo e infraestrutura.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Dados Coletados</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de Contato:</strong> Nome, e-mail, telefone/WhatsApp fornecidos voluntariamente em formulários de atendimento ou cadastro de parceiro.</li>
              <li><strong>Dados Fiscais e de Pagamento:</strong> CPF/CNPJ, chave PIX e endereço para emissão de notas fiscais de serviço e contratos eletrônicos.</li>
              <li><strong>Auditoria Jurídica Anti-MED:</strong> Endereço IP, data/hora e identificador do dispositivo no momento do aceite digital de contratos para segurança mútua contra fraudes e contestações bancárias.</li>
              <li><strong>Rastreio de Parceria (Last-Click):</strong> Identificador do parceiro via cookies estritamente necessários para correta atribuição de comissão comercial.</li>
            </ul>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Seus Direitos (Art. 18 da LGPD)</h2>
            <p>
              Você pode a qualquer momento solicitar a confirmação, correção, exclusão ou portabilidade dos seus dados pessoais através do nosso canal de encarregado pelo e-mail <strong>contato@ssantana.com.br</strong>.
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Segurança da Informação</h2>
            <p>
              Todos os tráfegos são criptografados com certificados SSL/TLS modernos, e as credenciais são mantidas em bancos de dados protegidos e servidores Linux dedicados.
            </p>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  )
}
