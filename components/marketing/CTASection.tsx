'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'

export default function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', serviceType: '', message: '' })
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: CTA */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Comece com uma <strong>reunião gratuita de 15 minutos</strong> — sem compromisso.
              Setup a partir de <strong>R$ 400</strong> com 50% OFF até 05/05/2026.
              Promoção: <strong>50% OFF</strong> em consultorias até o final do ano!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  �
                </div>
                <div>
                  <p className="font-semibold">Reunião Grátis (15 min)</p>
                  <a href={BUSINESS_RULES.SCHEDULING.FREE_15MIN_URL || '/#contact'} className="text-lg hover:underline">
                    Agendar agora — sem compromisso
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  📞
                </div>
                <div>
                  <p className="font-semibold">Telefone/WhatsApp</p>
                  <a href={`https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw}`} className="text-lg hover:underline">
                    {BUSINESS_RULES.CONTACT.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  ✉️
                </div>
                <div>
                  <p className="font-semibold">E-mail</p>
                  <a href={`mailto:${BUSINESS_RULES.CONTACT.email}`} className="text-lg hover:underline">
                    {BUSINESS_RULES.CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  💳
                </div>
                <div>
                  <p className="font-semibold">Pagamento</p>
                  <p className="text-base">PIX · Cartão · PicPay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-gray-600">
                  Obrigado pelo contato! Nossa equipe entrará em contato em até 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    Celular/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(71) 98806-8222"
                  />
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-gray-700 font-semibold mb-2">
                    Tipo de Serviço
                  </label>
                  <select
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="consultoria">Consultoria (R$ 100)</option>
                    <option value="website">Site/Sistema Web</option>
                    <option value="app">Aplicativo Mobile</option>
                    <option value="automation">Automação com IA</option>
                    <option value="system">Sistema Personalizado</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Conte-nos sobre seu projeto..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                  <Send size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
