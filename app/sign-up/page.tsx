'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Users, Briefcase } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const calendarLink = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const isPartner = type === 'partner'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-3xl w-full rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/90">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
              {isPartner ? (
                <Briefcase className="w-8 h-8 text-white" />
              ) : (
                <Users className="w-8 h-8 text-white" />
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {isPartner ? 'Onboarding de parceria' : 'Onboarding de novo cliente'}
            </h1>

            <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
              {isPartner
                ? 'Antes de ativar a parceria completa, fazemos uma reuniao curta de alinhamento.'
                : 'Antes de abrir seu projeto, fazemos uma reuniao curta para mapear escopo e prioridade.'}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Processo objetivo, linguagem simples e proximo passo claro ao final da reuniao.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6 dark:bg-slate-800/70 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  O que acontece na reuniao?
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  {isPartner ? (
                    <>
                      <li>• Entendemos seu perfil comercial e contexto de indicacao</li>
                      <li>• Alinhamos regras, responsabilidades e fluxo de repasse</li>
                      <li>• Definimos proximo passo para ativacao completa</li>
                      <li>• Entregamos caminho de uso do kit e dashboard</li>
                    </>
                  ) : (
                    <>
                      <li>• Mapeamos objetivo, escopo e nivel de urgencia</li>
                      <li>• Organizamos trilha tecnica mais adequada para seu caso</li>
                      <li>• Definimos proposta inicial e cronograma de execucao</li>
                      <li>• Entregamos resumo com proximos passos</li>
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
              className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              Agendar reuniao agora
              <ArrowRight className="w-5 h-5" />
            </a>

            <Link
              href="/"
              className="flex items-center justify-center w-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white py-3 transition-colors"
            >
              Voltar para pagina inicial
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Reuniao online via Google Meet</p>
            <p>Duracao media: 30 a 60 minutos</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
