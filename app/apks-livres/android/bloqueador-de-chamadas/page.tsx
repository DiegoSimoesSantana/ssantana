import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Shield, Zap, Heart, Lock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Bloqueador de Chamadas - Silêncio garantido. Sem anúncios.',
  description:
    'Retome o controle do seu telefone com um filtro inteligente, 100% local e sem anúncios. Desenvolvido por SSantana Ciência da Computação.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function BloqueadorDeChamadasPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Hero Section */}
        <section className="border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <div className="flex justify-center">
              <Phone className="h-16 w-16 text-zinc-900 dark:text-white" strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Bloqueador de Chamadas: Silêncio garantido. Sem assinaturas. Sem anúncios.
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Retome o controle do seu telefone com um filtro inteligente, 100% local e construído com
              foco absoluto na sua privacidade.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <a
                href="https://play.google.com/store/apps/details?id=com.ssantana.bloqueadordechamadas"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
              >
                <Zap className="h-5 w-5" />
                Baixar no Google Play
              </a>
              <a
                href="#doacoes"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900 transition-colors"
              >
                <Heart className="h-5 w-5" />
                Apoiar o Projeto
              </a>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Shield className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Bloqueio Inteligente</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Filtros automáticos para desconhecidos e palavras-chave personalizáveis.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Lock className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Privacidade Local</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  100% processado no seu dispositivo. Zero dados transmitidos.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Zap className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Zero Anúncios</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Sem propagandas intrusivas. Sua tela é apenas sua.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Por que este app existe?
            </h2>

            <div className="space-y-4 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>
                A ideia nasceu de uma frustração real. O volume diário de ligações de spam, telemarketing
                de operadoras, bancos e contatos desconhecidos se tornou insuportável.
              </p>

              <p>
                Ao buscar soluções no mercado, o cenário era sempre o mesmo: os aplicativos que realmente
                funcionavam estavam infestados de anúncios intrusivos ou cobravam mensalidades abusivas
                para liberar as funções básicas.
              </p>

              <p>
                Como especialistas em engenharia de software, decidimos resolver o problema. Criamos um
                bloqueador eficiente, limpo e direto. Nossa missão social com este projeto é simples:
                oferecer uma ferramenta de utilidade pública gratuita, devolvendo a paz aos usuários sem
                transformar a tela do celular em um outdoor de propagandas.
              </p>
            </div>
          </div>
        </section>

        {/* Donations & Transparency */}
        <section id="doacoes" className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Como o projeto se mantém?
            </h2>

            <div className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>
                Este aplicativo é gratuito e livre de anúncios. Para cobrir os custos de desenvolvimento,
                manutenção e hospedagem, adotamos um modelo de contribuição voluntária.
              </p>

              <p>
                Se o app ajudou a melhorar o seu dia a dia, você pode apoiar o projeto com qualquer valor.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Nosso compromisso com a transparência
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                A gestão de pequenas doações pode ser complexa. Por isso, toda contribuição recebida de
                bom grado é contabilizada. Periodicamente, emitimos uma nota fiscal avulsa contemplando a
                soma de todas as doações, garantindo a conformidade fiscal e a transparência do nosso
                trabalho.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 p-6">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                O futuro é guiado por você
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                Todo valor arrecadado alimenta nossa esteira de desenvolvimento. Os doadores terão acesso
                a uma página exclusiva de sugestões, onde poderão votar em enquetes e definir as
                prioridades para novas funcionalidades deste app e a criação de futuras ferramentas
                gratuitas.
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <a
                href="https://buy.stripe.com/sua-url-de-doacao"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-lg"
              >
                <Heart className="h-5 w-5" />
                Apoiar o Projeto
              </a>
            </div>
          </div>
        </section>

        {/* Privacy Policy (Required by Google) */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                Política de Privacidade
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Última atualização: Junho de 2026</p>
            </div>

            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              O Bloqueador de Chamadas foi construído sob o princípio do <em>Privacy by Design</em>.
            </p>

            <div className="rounded-md border-l-4 border-zinc-800 dark:border-zinc-200 bg-white dark:bg-zinc-800 p-6">
              <p className="text-base text-zinc-900 dark:text-white font-medium leading-relaxed">
                A leitura da sua agenda telefônica (permissão READ_CONTACTS) e a interceptação de chamadas
                (via API CallScreeningService) ocorrem de forma <strong>100% local no seu dispositivo</strong>
                , com o único propósito de filtragem.
              </p>
            </div>

            <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                Nenhum dado pessoal, número de telefone, nome de contato ou histórico de ligações é
                coletado, transmitido para nossos servidores, vendido ou compartilhado com terceiros. Suas
                preferências e histórico de bloqueios não saem do seu aparelho.
              </p>

              <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
                <p className="text-sm">
                  <strong>Contato para dúvidas de privacidade:</strong>{' '}
                  <a href="mailto:contato@ssantana.com.br" className="text-blue-600 dark:text-blue-400 hover:underline">
                    contato@ssantana.com.br
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-12 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">Desenvolvido por SSantana Ciência da Computação</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">© 2026 Todos os direitos reservados.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}