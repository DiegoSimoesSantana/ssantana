import React from 'react'
import clsx from 'clsx'

interface AnimatedLogoProps {
  className?: string
  showSlogan?: boolean
  compact?: boolean
}

export default function AnimatedLogo({ className, showSlogan = true, compact = false }: AnimatedLogoProps) {
  const titleClasses = compact ? 'text-base' : 'text-current'

  return (
    <span className={clsx('inline-flex flex-col leading-none', className)} aria-label="SSantana.com.br">
      <span className={clsx('font-black tracking-tight text-current', titleClasses)}>SSantana.com.br</span>
      {showSlogan && !compact && (
        <span className="mt-1 text-[11px] font-medium text-current/80">
          Seu sistema ideal
        </span>
      )}
    </span>
  )
}
