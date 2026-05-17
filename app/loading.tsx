'use client'

import AnimatedLogo from '@/components/layout/AnimatedLogo'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="text-center">
        <div className="mb-6 text-3xl md:text-4xl text-white">
          <AnimatedLogo />
        </div>
        <div className="flex items-center justify-center gap-2 text-purple-200">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm uppercase tracking-widest">Carregando</span>
        </div>
        <p className="mt-4 text-xs text-purple-300">Aguarde 3 segundos...</p>
      </div>
    </div>
  )
}
