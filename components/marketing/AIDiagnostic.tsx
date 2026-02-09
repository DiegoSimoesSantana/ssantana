'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { BUSINESS_RULES, formatCurrency } from '@/lib/business-rules'

export default function AIDiagnostic() {
  const [formData, setFormData] = useState({
    businessType: '',
    challenge: '',
    budget: '',
  })
  const [result, setResult] = useState<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Lógica simplificada de diagnóstico
    const diagnostics: Record<string, any> = {
      'atendimento': {
        title: 'Sistema de Chatbot Inteligente com LLMs',
        efficiency: 60,
        timeSaved: 120,
        estimatedCost: 2500,
        deliveryDays: 5,
        description: 'Automatize respostas e libere sua equipe para atividades estratégicas.'
      },
      'vendas': {
        title: 'CRM com IA Preditiva e Automação de Vendas',
        efficiency: 45,
        timeSaved: 80,
        estimatedCost: 3500,
        deliveryDays: 5,
        description: 'Previsão de vendas, lead scoring e follow-ups automatizados.'
      },
      'processos': {
        title: 'Sistema de Gestão Empresarial com Automação',
        efficiency: 70,
        timeSaved: 150,
        estimatedCost: 4000,
        deliveryDays: 7,
        description: 'Integre processos, elimine tarefas manuais e tenha visão 360° do negócio.'
      },
      'dados': {
        title: 'Dashboard de BI com Análise Preditiva',
        efficiency: 50,
        timeSaved: 60,
        estimatedCost: 2800,
        deliveryDays: 5,
        description: 'Transforme dados em insights acionáveis com IA.'
      }
    }

    const diagnostic = diagnostics[formData.challenge] || diagnostics['processos']
    setResult(diagnostic)
  }

  return (
    <section id="diagnostic" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full mb-4">
            <Calculator size={16} />
            <span className="text-sm font-medium">Análise Gratuita em 60 Segundos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descubra o Potencial de IA para seu Negócio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Responda 3 perguntas rápidas e veja como a IA pode transformar seus resultados
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Negócio */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                1. Qual é o seu tipo de negócio?
              </label>
              <select
                required
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="ecommerce">E-commerce</option>
                <option value="servicos">Serviços</option>
                <option value="saas">SaaS/Tech</option>
                <option value="industria">Indústria</option>
                <option value="saude">Saúde</option>
                <option value="educacao">Educação</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Principal Desafio */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                2. Qual é o seu principal desafio?
              </label>
              <select
                required
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="atendimento">Atendimento ao Cliente Lento</option>
                <option value="vendas">Vendas Estagnadas</option>
                <option value="processos">Processos Manuais e Demorados</option>
                <option value="dados">Falta de Análise de Dados</option>
              </select>
            </div>

            {/* Orçamento */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                3. Qual é o seu orçamento aproximado?
              </label>
              <select
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="2000">Até R$ 2.000</option>
                <option value="5000">R$ 2.000 - R$ 5.000</option>
                <option value="10000">R$ 5.000 - R$ 10.000</option>
                <option value="10000+">Acima de R$ 10.000</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Ver Meu Diagnóstico Personalizado
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-lg animate-slide-up">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎯 Sua Solução Ideal: {result.title}
              </h3>
              <p className="text-gray-600 mb-6">{result.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-600 mb-2">
                    <TrendingUp size={20} />
                    <span className="font-semibold">Eficiência</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">+{result.efficiency}%</p>
                  <p className="text-sm text-gray-600">Redução de custos</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-600 mb-2">
                    <Clock size={20} />
                    <span className="font-semibold">Tempo Liberado</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{result.timeSaved}h</p>
                  <p className="text-sm text-gray-600">Por mês</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-purple-600 mb-2">
                    <DollarSign size={20} />
                    <span className="font-semibold">Investimento</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.estimatedCost)}</p>
                  <p className="text-sm text-gray-600">Valor estimado</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-orange-600 mb-2">
                    <Clock size={20} />
                    <span className="font-semibold">Prazo</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{result.deliveryDays} dias</p>
                  <p className="text-sm text-gray-600">Úteis</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/#contact"
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-center"
                >
                  Quero Implementar Esta Solução
                </a>
                <a
                  href={`https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw}?text=Olá! Vi o diagnóstico de IA e quero saber mais sobre: ${result.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
