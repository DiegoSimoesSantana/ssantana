'use client'

import { Calendar, Clock, CheckCircle, Video } from 'lucide-react'

const CALENDAR_LINK = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export default function AIDiagnostic() {
  return (
    <section id="diagnostic" className="py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Calendar size={16} />
            <span className="text-sm font-medium">Agende sua Reunião</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conheça Seu Projeto e Receba Orçamento Personalizado
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Agende uma reunião online de 30-60 minutos. Entendemos suas necessidades e fornecemos orçamento detalhado.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-100">
          {/* Benefícios da Reunião */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                O que você ganha na reunião:
              </h3>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Orçamento Detalhado</h4>
                  <p className="text-gray-600 text-sm">Preço final personalizado para seu projeto</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Planejamento Completo</h4>
                  <p className="text-gray-600 text-sm">Escopo, cronograma e próximos passos definidos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Material Resumido</h4>
                  <p className="text-gray-600 text-sm">Documento completo enviado após a reunião</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Consultoria Especializada</h4>
                  <p className="text-gray-600 text-sm">Tire todas suas dúvidas com nossos experts</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Detalhes da Reunião:
              </h3>
              <div className="flex items-start gap-3">
                <Video className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">100% Online</h4>
                  <p className="text-gray-600 text-sm">Via Google Meet, de onde você estiver</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">30-60 Minutos</h4>
                  <p className="text-gray-600 text-sm">Tempo suficiente para entender tudo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Horário Flexível</h4>
                  <p className="text-gray-600 text-sm">Escolha o melhor dia e horário para você</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para Transformar Seu Negócio?
            </h3>
            <p className="text-lg mb-6 text-purple-100">
              Agende agora sua reunião gratuita e receba seu orçamento personalizado
            </p>
            <a
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-6 h-6" />
              Agendar Minha Reunião Gratuita
            </a>
            <p className="mt-4 text-sm text-purple-200">
              Resposta em até 24 horas • Sem compromisso
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
