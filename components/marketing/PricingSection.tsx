'use client'

import { Check, Star } from 'lucide-react'
import { BUSINESS_RULES, formatCurrency } from '@/lib/business-rules'

const pricingPlans = [
  {
    name: 'Consultoria',
    description: 'Ideal para quem quer entender viabilidade e custos',
    originalPrice: BUSINESS_RULES.CONSULTATION_PRICE,
    price: BUSINESS_RULES.CONSULTATION_PRICE_PROMO,
    discount: '50% OFF',
    features: [
      'Reunião de 30-60 minutos',
      'Análise de requisitos',
      'Orçamento imediato',
      'Plano de ação detalhado',
      'Válido até Dez/2026'
    ],
    cta: 'Agendar Consultoria',
    popular: false
  },
  {
    name: 'Projeto Simples',
    description: 'Sites, landing pages e sistemas básicos',
    price: 2000,
    features: [
      'Entrega em 5 dias úteis',
      'Design responsivo',
      'SEO otimizado',
      'Hospedagem inclusa (1 mês)',
      'Suporte pós-entrega (30 dias)',
      'Documentação completa',
      'Código compilado'
    ],
    cta: 'Começar Projeto',
    popular: true
  },
  {
    name: 'Projeto Completo',
    description: 'Sistemas robustos com IA e integrações',
    price: null,
    priceLabel: 'Sob consulta',
    features: [
      'Prazo conforme escopo',
      'Inteligência Artificial',
      'Integrações diversas',
      'Escalabilidade garantida',
      'Suporte estendido',
      'Documentação técnica',
      'Código fonte (opcional +3x)'
    ],
    cta: 'Falar com Especialista',
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Preços Transparentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sem surpresas. Você sabe exatamente o que vai pagar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 ${
                plan.popular
                  ? 'border-primary-600 shadow-2xl scale-105'
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star size={14} fill="white" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              {plan.discount && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {plan.discount}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.originalPrice && (
                  <p className="text-gray-400 line-through text-lg">
                    {formatCurrency(plan.originalPrice)}
                  </p>
                )}
                {plan.price ? (
                  <p className="text-4xl font-bold text-gray-900">
                    {formatCurrency(plan.price)}
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{plan.priceLabel}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/#contact"
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            <strong>Código Fonte:</strong> Disponível mediante pagamento de 3x o valor/hora base (R$ 600/hora)
          </p>
          <p className="text-sm text-gray-500">
            Todos os preços incluem documentação completa e código compilado
          </p>
        </div>
      </div>
    </section>
  )
}
