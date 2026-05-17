'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AnimatedLogo from './AnimatedLogo'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className="text-gray-700 hover:text-primary-600 transition">
              Serviços
            </Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-primary-600 transition">
              Preços
            </Link>
            <Link href="/education" className="text-gray-700 hover:text-primary-600 transition">
              Educação
            </Link>
            <Link href="/#projects" className="text-gray-700 hover:text-primary-600 transition">
              Projetos
            </Link>
            <Link href="/partners" className="text-gray-700 hover:text-primary-600 transition">
              Parceiros
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-primary-600 transition">
              Contato
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/#diagnostic"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Começar Agora
            </Link>
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
              href="/education"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Educação
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
              href="/#contact"
              className="block text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            <Link
              href="/#diagnostic"
              className="block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Começar Agora
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
