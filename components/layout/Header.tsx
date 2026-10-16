'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AnimatedLogo from './AnimatedLogo'
import AccountLauncher from './AccountLauncher'
import ThemeToggle from './ThemeToggle'
import VipReferralBanner from '../marketing/VipReferralBanner'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <VipReferralBanner />
        <header className="w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
          <nav className="container mx-auto px-4 py-3.5 max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                <AnimatedLogo />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="/#services" className="text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  Soluções
                </Link>
                <Link href="/#pricing" className="text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  Preços de Entrada
                </Link>
                <Link href="/partners" className="text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  Parceiros
                </Link>
                <Link href="/blog" className="text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  Blog
                </Link>
                <Link href="/#contact" className="text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  Contato
                </Link>
              </div>

              {/* CTA Buttons & Theme Toggle */}
              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                <AccountLauncher />
              </div>

              {/* Mobile Menu & Toggle Button */}
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <button
                  className="p-2 text-slate-700 dark:text-zinc-200 hover:text-sky-600"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Abrir menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-slate-100 dark:border-zinc-800 pt-3">
                <Link
                  href="/#services"
                  className="block py-2 text-slate-700 dark:text-zinc-200 hover:text-sky-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Soluções
                </Link>
                <Link
                  href="/#pricing"
                  className="block py-2 text-slate-700 dark:text-zinc-200 hover:text-sky-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Preços de Entrada
                </Link>
                <Link
                  href="/partners"
                  className="block py-2 text-slate-700 dark:text-zinc-200 hover:text-sky-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Parceiros
                </Link>
                <Link
                  href="/blog"
                  className="block py-2 text-slate-700 dark:text-zinc-200 hover:text-sky-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/#contact"
                  className="block py-2 text-slate-700 dark:text-zinc-200 hover:text-sky-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contato
                </Link>
                <div className="pt-2">
                  <AccountLauncher />
                </div>
              </div>
            )}
          </nav>
        </header>
      </div>
      <div className="h-16" /> {/* Spacer */}
    </>
  )
}
