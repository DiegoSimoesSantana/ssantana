'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: 'Cliente verificado',
    role: 'Setor de varejo',
    avatar: '👩‍💼',
    rating: 5,
    text: 'A Software Santana transformou nossa operação com um sistema de CRM com IA. As vendas aumentaram e a equipe ficou muito mais produtiva!'
  },
  {
    name: 'Cliente verificado',
    role: 'E-commerce',
    avatar: '👨‍💼',
    rating: 5,
    text: 'Precisávamos de um e-commerce urgente. Em poucos dias tínhamos um site completo, responsivo e já vendendo. A entrega foi exatamente no prazo prometido!'
  },
  {
    name: 'Cliente verificado',
    role: 'Educação',
    avatar: '👩',
    rating: 5,
    text: 'O chatbot inteligente economizou tempo da equipe de atendimento e trouxe ROI rápido. Recomendo fortemente!'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Depoimentos
          </h2>
          <p className="text-xl text-gray-600">
            Comentários de clientes verificados
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12 shadow-xl">
          {/* Testimonial Content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={24} fill="#fbbf24" className="text-yellow-400" />
              ))}
            </div>
            <p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
              "{current.text}"
            </p>
            <div>
              <p className="font-bold text-gray-900">{current.name}</p>
              <p className="text-gray-600">{current.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex ? 'bg-primary-600 w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition"
              aria-label="Próximo"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
