import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, FileText, Link2, ShieldCheck, Target, Users, WalletCards } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kit Comercial do Parceiro',
  description:
    'Página com termos completos do programa de indicação SSANTANA, roteiro comercial e kits visuais para apoiar vendas dos parceiros.',
}

export default function PartnerSalesKitPage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb] px-4 py-10 text-slate-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900">
            <BadgeCheck className="h-4 w-4" />
            Kit comercial oficial SSANTANA
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-5xl">
            Objetivo simples: ajudar qualquer parceiro a fechar sem virar suporte técnico.
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700 sm:text-base">
            Esta página substitui o PDF e concentra tudo em um lugar: termos, lógica de comissão, regra de desconto para indicação
            direta e kits visuais prontos para uso em proposta, WhatsApp e página de apresentação.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/criar-conta-parceiro"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Gerar meu link de indicação
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/indicacao-vip"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-900/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Ver página VIP do cliente
              <Users className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Termos comerciais do programa</p>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: 'Comissão base',
                  description:
                    'Faixa de 10% a 20% sobre setup inicial e receitas recorrentes elegíveis (manutenção e upgrades).',
                },
                {
                  title: 'Indicação direta com desconto configurável',
                  description:
                    'O parceiro pode ceder parte da própria comissão para ampliar o desconto do cliente indicado direto.',
                },
                {
                  title: 'Rastreio da indicação',
                  description:
                    'A indicação é registrada por link com parâmetro, cookie e armazenamento local para manter atribuição em retornos do cliente.',
                },
                {
                  title: 'Regra de atribuição',
                  description:
                    'Quando houver mais de uma indicação no ciclo, vale a última indicação válida registrada antes da contratação.',
                },
                {
                  title: 'Repasse mínimo garantido',
                  description:
                    'No repasse com desconto, o parceiro sempre fica com no mínimo 10% de comissão líquida.',
                },
                {
                  title: 'Escopo técnico',
                  description:
                    'A equipe SSANTANA assume implementação, estabilidade e suporte técnico. O parceiro foca em relacionamento e indicação.',
                },
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-[#faf6ef] p-5">
                  <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-900 to-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">Posicionamento para usar na venda</p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              Você nos entrega o cliente, nós garantimos que ele carregue rápido e nunca caia.
            </h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
              <p>
                O cliente final não precisa aprender termos técnicos. A promessa comercial deve ser objetiva:
                estabilidade, suporte que responde e operação sem dor de cabeça.
              </p>
              <p>
                Use esta estrutura de fala: problema atual, risco de manter como está, ganho prático com setup,
                e continuidade mensal para manter o ambiente funcionando.
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">Frase curta recomendada</p>
              <p className="mt-2 text-base leading-7 text-white">
                Seu site pode continuar bonito, mas agora com base técnica para não cair, carregar rápido e manter seu negócio rodando.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Como usar os kits visuais</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Kits no formato de flyer/banner com campo para seu link</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            A lógica é direta: você pode divulgar com seu link geral de indicação ou com link direto de desconto adicional.
            Se optar por dar desconto extra ao cliente, esse valor sai da sua comissão, mantendo repasse mínimo de 10%.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-[#f8f4ec] p-5">
              <div className="inline-flex rounded-xl bg-slate-900 p-2 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Flyer 1 - Link geral do parceiro</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Use quando quiser manter sua comissão cheia dentro da faixa ativa.</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">Sua indicação com atendimento VIP SSANTANA</p>
                <p className="mt-2">Cliente indicado já entra com benefícios ativos da campanha vigente.</p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs">
                  <Link2 className="h-3.5 w-3.5" />
                  {`{SEU_LINK_GERAL}`}
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-[#f8f4ec] p-5">
              <div className="inline-flex rounded-xl bg-slate-900 p-2 text-white">
                <WalletCards className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Flyer 2 - Link direto com desconto adicional</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use quando quiser acelerar fechamento cedendo parte da sua comissão para ampliar o desconto do cliente.
              </p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">Condição especial por indicação direta</p>
                <p className="mt-2">Desconto extra definido pelo parceiro, acumulado ao benefício padrão da campanha.</p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs">
                  <Link2 className="h-3.5 w-3.5" />
                  {`{SEU_LINK_DIRETO_COM_DESCONTO}`}
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-[#f8f4ec] p-5">
              <div className="inline-flex rounded-xl bg-slate-900 p-2 text-white">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Banner de WhatsApp</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Mensagem curta para iniciar conversa sem parecer robô.</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                <p>Oi, [NOME]. Tenho uma indicação técnica que pode te ajudar a manter site estável e rápido.</p>
                <p className="mt-2">Se fizer sentido, envio meu link de atendimento VIP:</p>
                <p className="mt-2 font-mono text-xs text-slate-600">{`{SEU_LINK_GERAL}`}</p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-[#f8f4ec] p-5">
              <div className="inline-flex rounded-xl bg-slate-900 p-2 text-white">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">Bloco para proposta comercial</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Texto pronto para anexar à proposta do parceiro.</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">Resumo de oferta</p>
                <p className="mt-2">
                  Estrutura técnica para estabilidade, desempenho e suporte contínuo. Cliente indicado entra por atendimento VIP com regras transparentes.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#fff9ef] p-5 text-sm leading-7 text-slate-700">
            <p className="font-semibold text-slate-900">Como aplicar em 4 passos</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Ative seu link geral na plataforma de parceiro.</li>
              <li>Defina se vai usar apenas o link geral ou também o link direto com desconto adicional.</li>
              <li>Cole a URL correspondente nos blocos acima e use no canal certo (WhatsApp, proposta, landing).</li>
              <li>Acompanhe no dashboard os acessos e o impacto da sua estratégia na conversão.</li>
            </ol>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">Papel do parceiro</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Relacionamento, confiança e entrada comercial com o cliente. Não precisa prometer parte técnica que não controla.
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="inline-flex rounded-xl bg-amber-100 p-2 text-amber-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">Papel da operação SSANTANA</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Entrega, estabilidade, ajustes e suporte técnico. Isso protege sua reputação junto ao cliente indicado.
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="inline-flex rounded-xl bg-indigo-100 p-2 text-indigo-700">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">Relacionamento de longo prazo</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Quanto melhor a experiência do cliente final, maior a chance de continuidade e novas indicações do mesmo parceiro.
            </p>
          </article>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Outros modelos de parceria</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">Parceria nao se limita a comissao por indicacao</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Se sua empresa deseja co-desenvolvimento, operacao white label ou parceria de entrega integrada, a abordagem e consultiva e feita em reuniao dedicada.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/partners"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Voltar para parcerias B2B
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-900/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Agendar reuniao de alianca
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}