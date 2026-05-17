'use client'

import { useEffect } from 'react'
import { Calendar } from 'lucide-react'

const CALENDAR_LINK = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export default function SignInPage() {
  useEffect(() => {
    // Redireciona automaticamente após 2 segundos
    const timer = setTimeout(() => {
      window.location.href = CALENDAR_LINK
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full mb-6 animate-pulse">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Redirecionando para Agendamento...
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Você será redirecionado para nossa agenda em instantes
        </p>
        <a
          href={CALENDAR_LINK}
          className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
        >
          <Calendar className="w-5 h-5" />
          Clique aqui se não for redirecionado
        </a>
      </div>
    </div>
  )
}
