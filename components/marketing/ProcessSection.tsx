export default function ProcessSection() {
  const steps = [
    {
      number: '1',
      title: 'Descoberta',
      description: 'Reunião de entendimento (30-60min) com análise detalhada de requisitos e orçamento imediato.',
      duration: '30-60 min'
    },
    {
      number: '2',
      title: 'Aprovação',
      description: 'Análise interna e aprovação do escopo. Geração e envio do contrato para assinatura digital.',
      duration: '24h'
    },
    {
      number: '3',
      title: 'Contrato & Pagamento',
      description: 'Assinatura do contrato online e confirmação do pagamento da primeira parcela.',
      duration: '1-2 dias'
    },
    {
      number: '4',
      title: 'Desenvolvimento',
      description: 'Início do projeto após pagamento. Desenvolvimento ágil com IA e acompanhamento em tempo real.',
      duration: '5 dias úteis'
    },
    {
      number: '5',
      title: 'Entrega & Revisão',
      description: 'Entrega do projeto completo. Cliente tem 7 dias para revisar e solicitar ajustes do escopo.',
      duration: '7 dias'
    },
    {
      number: '6',
      title: 'Aceite Final',
      description: 'Aceite formal do cliente e liberação de comissões para parceiros. Suporte contínuo disponível.',
      duration: '-'
    }
  ]

  return (
    <section id="process" className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nosso Processo de 5 Dias
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Metodologia ágil e transparente, do diagnóstico à entrega final
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>
                    <p className="text-sm text-primary-600 font-semibold">⏱️ {step.duration}</p>
                  </div>
                </div>

                {/* Number Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Spacer for layout */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/#contact"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg"
          >
            Começar Meu Projeto Agora
          </a>
        </div>
      </div>
    </section>
  )
}
