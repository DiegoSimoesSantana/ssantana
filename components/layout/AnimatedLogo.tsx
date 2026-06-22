import React from 'react'
import clsx from 'clsx'

interface AnimatedLogoProps {
  className?: string
  showSlogan?: boolean
  compact?: boolean
}

export default function AnimatedLogo({ className, showSlogan = true, compact = false }: AnimatedLogoProps) {
  const titleClasses = compact ? 'text-base font-bold' : 'text-xl md:text-2xl font-black tracking-tight'

  return (
    <span className={clsx('inline-flex flex-col leading-none', className)} aria-label="SSantana">
      <span className={clsx('logo-vibrante', titleClasses)}>SSantana</span>
      {showSlogan && !compact && (
        <span className="mt-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Sistemas & IA
        </span>
      )}
    </span>
  )
}
