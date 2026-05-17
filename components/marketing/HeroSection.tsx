'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles size={16} />
            <span className="text-sm font-medium">🔥 50% OFF no Setup — R$ 400 (de R$ 800) até 05/05/2026</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
            Engenharia de Software com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Inteligência Artificial
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Soluções digitais otimizadas e entregues em{' '}
            <span className="font-bold text-primary-600">tempo recorde</span>.
            Chega de projetos longos — usamos IA para acelerar desenvolvimento em até 70%.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Entrega em 5 dias úteis</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Planejamento à prova de falhas</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">Sem enrolação</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/#diagnostic"
              className="group bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Descobrir Potencial de IA</span>
              <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
            </Link>
            
            <Link
              href="/#contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold text-lg border-2 border-primary-600"
            >
              Falar com Especialista
            </Link>

            <Link
              href="/education"
              className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition font-semibold text-lg border-2 border-gray-900"
            >
              Como Projetamos
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-500 text-sm mb-4">Tecnologias que utilizamos:</p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <span className="font-semibold">Next.js</span>
              <span className="font-semibold">React</span>
              <span className="font-semibold">Node.js</span>
              <span className="font-semibold">AI/ML</span>
              <span className="font-semibold">Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
