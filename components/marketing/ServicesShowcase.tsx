'use client'

import Link from 'next/link'
import { Code, Smartphone, Zap, LineChart, Globe, Cpu, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Sites & Sistemas Web',
    description: 'Desenvolvimento de sites profissionais e sistemas web personalizados com foco em performance e UX.',
    features: ['Responsivo', 'SEO Otimizado', 'Alta Performance'],
    price: 'Preço inicial sob diagnóstico',
    href: '/metodologia/pt'
  },
  {
    icon: Smartphone,
    title: 'Aplicativos Mobile',
    description: 'Apps nativos e híbridos para iOS e Android com integração total ao seu negócio.',
    features: ['iOS & Android', 'Push Notifications', 'Offline-first'],
    price: 'Sob consulta',
    href: '/metodologia/pt'
  },
  {
    icon: Cpu,
    title: 'Automação com IA',
    description: 'Chatbots inteligentes, análise preditiva e automação de processos com Machine Learning.',
    features: ['LLMs', 'Análise Preditiva', 'Automação'],
    price: 'Sob consulta',
    href: '/metodologia/pt'
  },
  {
    icon: Code,
    title: 'Sistemas Personalizados',
    description: 'ERPs, CRMs e sistemas sob medida com suporte operacional e evolução mensal contínua.',
    features: ['Escalável', 'Integrações', 'Cloud-native'],
    price: 'Suporte base: R$ 140/mês',
    href: '/precos'
  },
  {
    icon: LineChart,
    title: 'E-mail Profissional',
    description: 'Configuração de e-mail no seu domínio .com.br e sustentação em servidor próprio ou cloud (Google/Microsoft/Zoho).',
    features: ['@seudominio.com.br', 'Servidor dedicado', 'R$ 5/mês por e-mail'],
    price: 'Setup: R$ 200',
    href: '/email'
  },
  {
    icon: Zap,
    title: 'Tráfego Pago & Ads',
    description: 'Configuração estratégica e gestão de campanhas no Google, Facebook, Instagram, TikTok e Kwai.',
    features: ['Configuração estratégica', 'Acompanhamento com IA', 'Foco em conversão'],
    price: 'Setup sob orçamento',
    href: '/trafego'
  }
]

export default function ServicesShowcase() {
  return (
    <section id="services" className="py-20 px-4 bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Soluções completas de software com IA e infraestrutura para impulsionar seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition group flex flex-col justify-between"
            >
              <div>
                <div className="bg-primary-100 dark:bg-primary-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition">
                  <service.icon className="text-primary-600 group-hover:text-white transition" size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-6">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t dark:border-white/10 pt-4 flex items-center justify-between gap-2 flex-wrap">
                <p className="text-primary-600 dark:text-primary-400 font-bold text-sm">{service.price}</p>
                {service.href && (
                  <Link
                    href={service.href}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition"
                  >
                    Saiba mais <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/#contact"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg"
          >
            Solicitar Orçamento Personalizado
          </a>
          <Link
            href="/precos"
            className="inline-block bg-white dark:bg-white/10 text-primary-600 dark:text-primary-300 border-2 border-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/20 transition font-semibold text-lg"
          >
            Ver Tabela de Preços Geral
          </Link>
        </div>
      </div>
    </section>
  )
}
