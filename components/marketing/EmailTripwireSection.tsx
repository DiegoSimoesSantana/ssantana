'use client'

import Link from 'next/link'
import { Mail, Check } from 'lucide-react'
import { useState } from 'react'

export default function EmailTripwireSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Como funciona o E-mail Corporativo?',
      a: 'Você recebe um e-mail profissional no seu domínio (seu-dominio.com.br). Pode ser hospedado em servidores Google, Microsoft ou Zoho. Todos com backup automático, antispam e filtro de segurança.'
    },
    {
      q: 'Quais são os limites de espaço?',
      a: 'Começamos em 50GB por usuário, com opção de expansão ilimitada conforme sua necessidade. Sem surpresas de limite surpresa.'
    },
    {
      q: 'Qual é o tempo de configuração?',
      a: 'Geralmente 24-48h após confirmação. Nosso time cuida de toda a migração de DNS e validação. Você só precisa confirmar o pedido.'
    },
    {
      q: 'E se eu mudar de provedor depois?',
      a: 'Sem problema. Seus dados são seus. Você pode migrar a qualquer momento. Oferecemos suporte completo na transição.'
    },
    {
      q: 'Qual é o suporte?',
      a: 'Suporte técnico 24/5 (seg-sex) por chat, email e telefone. Crítico? Resposta em até 1 hora garantida.'
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blindar sua Comunicação
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            E-mail Corporativo de Alta Performance. Comece agora, escale depois.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Offer */}
          <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              E-mail Premium
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tudo o que sua empresa precisa para comunicação segura e profissional.
            </p>

            <div className="space-y-3 mb-8">
              {[
                '50GB de armazenamento por usuário',
                'Antispam e filtro de segurança avançado',
                'Backup automático diário',
                'Calendário e contatos sincronizados',
                'Acesso mobile native',
                'Suporte técnico 24/5'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                R$ 25<span className="text-lg text-gray-600 dark:text-gray-400">/mês</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">por usuário • Mínimo 1 usuário</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/#contact"
                className="block w-full bg-blue-600 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition font-semibold text-center"
              >
                Contratar Agora
              </Link>
              <button
                onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
                className="block w-full text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition font-semibold"
              >
                Ver Características →
              </button>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Dúvidas Frequentes
            </h3>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <span className={`transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Quer testar com plano básico ou receber consultoria especializada?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-block bg-gray-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition font-semibold"
            >
              Marcar Reunião com Especialista
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
