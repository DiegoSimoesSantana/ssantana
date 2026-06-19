'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AnimatedLogo from './AnimatedLogo'
import AccountLauncher from './AccountLauncher'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Serviços
            </Link>
            <Link href="/#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Preços
            </Link>
            <Link href="/metodologia" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Metodologia
            </Link>
            <Link href="/#projects" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Projetos
            </Link>
            <Link href="/partners" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Parceiros
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Blog
            </Link>
            <Link href="/#contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              Contato
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <AccountLauncher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/#services"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              href="/#pricing"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              href="/metodologia"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Metodologia
            </Link>
            <Link
              href="/#projects"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projetos
            </Link>
            <Link
              href="/partners"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Parceiros
            </Link>
            <Link
              href="/blog"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/#contact"
              className="block text-gray-700 hover:text-primary-600 transition"
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
  )
}
