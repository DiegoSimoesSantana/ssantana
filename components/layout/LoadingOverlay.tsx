'use client'

import { useEffect, useState } from 'react'
import AnimatedLogo from './AnimatedLogo'

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 text-4xl md:text-5xl text-white">
          <AnimatedLogo />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-purple-200">
          Construindo software
        </p>
        <p className="mt-2 text-xs text-purple-300">Aguarde alguns segundos...</p>
      </div>
    </div>
  )
}
