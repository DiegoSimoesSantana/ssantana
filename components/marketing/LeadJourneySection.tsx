import Link from 'next/link'
import { BUSINESS_RULES } from '@/lib/business-rules'

const steps = [
  {
    title: 'Portal do Cliente',
    description:
      'Cadastro rápido para diagnóstico, solicitação de serviço e acompanhamento de status até fechar o projeto.',
    bullets: ['Cadastro inicial guiado', 'Escopo e necessidade detectados', 'Reunião estratégica e proposta'],
    ctaLabel: 'Quero ser Cliente',
    href: '/#contact',
  },
  {
    title: 'Portal de Parceiros',
    description:
      'Cada parceiro recebe link único de indicação e também pode cadastrar clientes para abordagem consultiva.',
    bullets: ['Link exclusivo de indicação', 'Cadastro de leads indicados', 'Regras de abordagem e acompanhamento'],
    ctaLabel: 'Quero ser Parceiro',
    href: '/partners',
  },
  {
    title: 'Painel Administrativo',
    description:
      'Visão central de clientes, parceiros e indicações, com status de pipeline para operação comercial completa.',
    bullets: ['Status: fechado, perdido, concluído, em andamento', 'Gestão de abordagem e follow-up', 'Visão consolidada de conversão'],
    ctaLabel: 'Ver Estratégia Completa',
    href: '/metodologia',
  },
]

export default function LeadJourneySection() {
  return (
    <section className="py-16 px-4 bg-gray-50" id="journey">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Comece Simples, Evolua com Segurança
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            A primeira página é uma isca de valor: entende sua necessidade, direciona para reunião,
            WhatsApp ou compra direta do serviço inicial. Depois, evoluímos seu projeto por etapas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <article key={step.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-700 mb-4 leading-7">{step.description}</p>
              <ul className="space-y-2 mb-5">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm text-gray-700">• {bullet}</li>
                ))}
              </ul>
              <Link
                href={step.href}
                className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                {step.ctaLabel}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
          <p className="text-gray-800 leading-7">
            Atendimento rápido no WhatsApp:{' '}
            <a
              className="font-semibold underline"
              href={`https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              {BUSINESS_RULES.CONTACT.phone}
            </a>
            {' '}para acelerar sua triagem e já sair com próximo passo definido.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-800">Indicação VIP</p>
          <p className="mt-2 text-gray-800 leading-7">
            Quando identificamos que um lead foi indicado por um parceiro, o funil passa a destacar essa referência e o contato entra com
            atendimento prioritário. Isso aumenta a confiança de quem compra e valoriza comercialmente quem indicou.
          </p>
          <p className="mt-3 text-gray-700 leading-7">
            Regra operacional: se existir mais de uma indicação registrada, vale a última indicação salva no sistema antes do fechamento.
            Em outras palavras, persistência comercial faz sentido e pode decidir a comissão.
          </p>
        </div>
      </div>
    </section>
  )
}
