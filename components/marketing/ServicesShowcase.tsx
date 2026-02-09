'use client'

import { Code, Smartphone, Zap, LineChart, Globe, Cpu } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Sites & Sistemas Web',
    description: 'Desenvolvimento de sites profissionais e sistemas web personalizados com foco em performance e UX.',
    features: ['Responsivo', 'SEO Otimizado', 'Alta Performance'],
    price: 'A partir de R$ 2.000'
  },
  {
    icon: Smartphone,
    title: 'Aplicativos Mobile',
    description: 'Apps nativos e híbridos para iOS e Android com integração total ao seu negócio.',
    features: ['iOS & Android', 'Push Notifications', 'Offline-first'],
    price: 'Sob consulta'
  },
  {
    icon: Cpu,
    title: 'Automação com IA',
    description: 'Chatbots inteligentes, análise preditiva e automação de processos com Machine Learning.',
    features: ['LLMs', 'Análise Preditiva', 'Automação'],
    price: 'A partir de R$ 2.500'
  },
  {
    icon: Code,
    title: 'Sistemas Personalizados',
    description: 'ERPs, CRMs e sistemas sob medida para otimizar gestão e produtividade.',
    features: ['Escalável', 'Integrações', 'Cloud-native'],
    price: 'A partir de R$ 4.000'
  },
  {
    icon: LineChart,
    title: 'Business Intelligence',
    description: 'Dashboards e análise de dados em tempo real para decisões baseadas em métricas.',
    features: ['Dashboards', 'Relatórios', 'KPIs'],
    price: 'A partir de R$ 2.800'
  },
  {
    icon: Zap,
    title: 'Consultoria Tech',
    description: 'Reunião de diagnóstico, planejamento e plano de ação imediato. Promoção: 50% OFF!',
    features: ['30-60 minutos', 'Orçamento imediato', 'Plano de ação'],
    price: 'R$ 100 (De R$ 200)'
  }
]

export default function ServicesShowcase() {
  return (
    <section id="services" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções completas de software com IA para impulsionar seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group"
            >
              <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                <service.icon className="text-primary-600 group-hover:text-white transition" size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <ul className="space-y-2 mb-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="border-t pt-4">
                <p className="text-primary-600 font-bold text-lg">{service.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/#contact"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg"
          >
            Solicitar Orçamento Personalizado
          </a>
        </div>
      </div>
    </section>
  )
}
