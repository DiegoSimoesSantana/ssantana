import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Bloqueador de Chamadas',
  description:
    'Política de Privacidade do aplicativo Bloqueador de Chamadas, desenvolvido por SSantana Ciência da Computação.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white px-6 py-12 text-zinc-900">
        <article className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-3 border-b border-zinc-200 pb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Bloqueador de Chamadas</h1>
            <p className="text-base text-zinc-700">
              Desenvolvido por: <strong>SSantana Ciencia da Computacao</strong>
            </p>
          </header>

          <section id="sobre" className="space-y-4">
            <h2 className="text-2xl font-semibold">Sobre o Aplicativo</h2>
            <p>
              O Bloqueador de Chamadas e uma ferramenta utilitaria desenvolvida para dar controle total
              sobre as ligacoes recebidas no ambiente Android. O aplicativo foi projetado sob o principio
              da privacidade absoluta, filtrando chamadas indesejadas diretamente no dispositivo.
            </p>

            <h3 className="text-xl font-semibold">Principais Funcionalidades</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Bloqueio de Numeros Desconhecidos:</strong> Rejeicao automatica de chamadas de
                numeros que nao estao salvos na agenda de contatos do usuario.
              </li>
              <li>
                <strong>Filtro Semantico Personalizado:</strong> Bloqueio imediato de chamadas caso o
                identificador do contato contenha palavras-chave especificas definidas pelo usuario (ex:
                &quot;CHATO&quot;).
              </li>
              <li>
                <strong>Controle de Ativacao:</strong> Chave de ativacao/desativacao momentanea para
                pausar o filtro quando necessario.
              </li>
            </ul>
          </section>

          <section id="politica-privacidade" className="space-y-4 border-t border-zinc-200 pt-10">
            <h2 className="text-2xl font-semibold">Politica de Privacidade</h2>
            <p className="text-sm text-zinc-600">Ultima atualizacao: Junho de 2026</p>

            <div className="rounded-md border-l-4 border-zinc-800 bg-zinc-100 p-4 text-sm sm:text-base">
              A leitura da agenda telefonica ocorre de forma 100% local no dispositivo, com o unico
              proposito de filtragem de chamadas. Nenhum dado pessoal, numero de telefone ou nome de
              contato e coletado, transmitido para servidores externos ou compartilhado com terceiros.
            </div>

            <p>
              Esta Politica de Privacidade governa o uso do aplicativo Bloqueador de Chamadas. O
              compromisso principal deste software e a seguranca e a inviolabilidade dos dados do usuario.
            </p>

            <h3 className="text-xl font-semibold">1. Coleta e Processamento de Dados</h3>
            <p>
              O aplicativo <strong>nao coleta, nao armazena externamente, nao transmite e nao compartilha</strong>{' '}
              nenhuma informacao pessoal, historico de chamadas ou dados da agenda de contatos do usuario.
              Todo o processamento de dados e realizado de forma 100% local e em tempo real no proprio
              dispositivo.
            </p>

            <h3 className="text-xl font-semibold">2. Permissoes Requeridas e Justificativas</h3>
            <p>
              Para executar sua funcao principal, o aplicativo solicita acesso as seguintes permissoes
              sensiveis do ecossistema Android:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>READ_CONTACTS (Ler Contatos):</strong> Necessaria exclusivamente para consultar a
                agenda local e verificar se o numero originador da chamada esta salvo ou se possui termos
                restritos no nome. Essa verificacao e estritamente local.
              </li>
              <li>
                <strong>ANSWER_PHONE_CALLS / Linhas de Controle de Telefonia:</strong> Necessaria para que
                o sistema operacional permita ao aplicativo rejeitar de forma silenciosa e automatizada as
                chamadas classificadas como spam ou indesejadas.
              </li>
            </ul>

            <h3 className="text-xl font-semibold">3. Seguranca dos Dados</h3>
            <p>
              Como o aplicativo opera de maneira isolada e nao possui rotinas de upload ou integracao com
              servidores de terceiros, nao ha risco de vazamento de dados em transito. Os criterios de
              bloqueio e configuracoes sao mantidos na memoria segura do proprio aparelho.
            </p>

            <h3 className="text-xl font-semibold">4. Retencao e Exclusao de Dados</h3>
            <p>
              O aplicativo nao retem historico de dados em bancos de dados persistentes fora do escopo
              operacional do telefone. Caso o usuario desinstale o aplicativo, todas as configuracoes
              locais e preferencias sao permanentemente eliminadas do dispositivo.
            </p>

            <h3 className="text-xl font-semibold">5. Alteracoes nesta Politica</h3>
            <p>
              Reservamo-nos o direito de atualizar esta politica caso novas implementacoes tecnicas exijam
              modificacoes operacionais, sempre mantendo a premissa de nao coletar dados externos.
            </p>
          </section>

          <footer className="border-t border-zinc-200 pt-8 text-sm text-zinc-600">
            <p>© 2026 SSantana Ciencia da Computacao. Todos os direitos reservados.</p>
            <p>Contato para suporte e privacidade: contato@ssantana.com.br</p>
          </footer>
        </article>
      </main>

      <Footer />
    </>
  )
}