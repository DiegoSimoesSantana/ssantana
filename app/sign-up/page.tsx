'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Users, Briefcase } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const calendarLink = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const isPartner = type === 'partner'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            {isPartner ? (
              <Briefcase className="w-8 h-8 text-white" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isPartner ? 'Cadastro de Parceiro' : 'Novo Cliente'}
          </h1>
          
          <p className="text-lg text-gray-300 mb-2">
            {isPartner 
              ? 'Para se tornar um parceiro, precisamos nos conhecer primeiro!'
              : 'Para começar, vamos agendar uma reunião de apresentação'}
          </p>
          
          <p className="text-sm text-gray-400">
            Na reunião, vamos entender seu {isPartner ? 'perfil e validar sua parceria' : 'projeto e dar o orçamento final'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Calendar className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                O que acontece na reunião?
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {isPartner ? (
                  <>
                    <li>• Conhecemos você e seu perfil profissional</li>
                    <li>• Explicamos como funciona a parceria</li>
                    <li>• Validamos se o perfil está alinhado</li>
                    <li>• Enviamos o material e próximos passos</li>
                  </>
                ) : (
                  <>
                    <li>• Entendemos seu projeto e necessidades</li>
                    <li>• Apresentamos soluções personalizadas</li>
                    <li>• Fornecemos orçamento detalhado</li>
                    <li>• Enviamos resumo e próximos passos</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Calendar className="w-5 h-5" />
            Agendar Reunião Agora
            <ArrowRight className="w-5 h-5" />
          </a>

          <Link
            href="/"
            className="flex items-center justify-center w-full text-gray-300 hover:text-white py-3 transition-colors"
          >
            Voltar para página inicial
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          <p>Reunião online via Google Meet</p>
          <p>Duração: 30-60 minutos</p>
        </div>
      </div>
    </div>
  )
}
