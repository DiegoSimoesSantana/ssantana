'use client'

import Link from 'next/link'
import { BUSINESS_RULES } from '@/lib/business-rules'
import AnimatedLogo from './AnimatedLogo'

export default function Footer() {
  const { CONTACT, SOCIAL } = BUSINESS_RULES

  return (
    <footer className="bg-gray-900 dark:bg-zinc-950 text-gray-300 dark:text-gray-400 border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              <AnimatedLogo className="text-white" />
            </h3>
            <p className="text-sm">
              Desenvolvemos soluções digitais personalizadas com IA que transformam negócios e impulsionam resultados.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className="transition hover:text-primary-400">Sistemas Web</Link></li>
              <li><Link href="/#services" className="transition hover:text-primary-400">Aplicativos Mobile</Link></li>
              <li><Link href="/#services" className="transition hover:text-primary-400">Automação com IA</Link></li>
              <li><Link href="/#services" className="transition hover:text-primary-400">Consultoria Tech</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#about" className="transition hover:text-primary-400">Sobre Nós</Link></li>
              <li><Link href="/#projects" className="transition hover:text-primary-400">Projetos</Link></li>
              <li><Link href="/blog" className="transition hover:text-primary-400">Blog</Link></li>
              <li><Link href="/partners" className="transition hover:text-primary-400">Programa de Parceiros</Link></li>
              <li><Link href="/#contact" className="transition hover:text-primary-400">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 {CONTACT.address.city}, {CONTACT.address.state}</li>
              <li>
                <a href={`tel:${CONTACT.phoneRaw}`} className="transition hover:text-primary-400">📞 {CONTACT.phone}</a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="transition hover:text-primary-400">✉️ {CONTACT.email}</a>
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="transition hover:text-primary-400">LinkedIn</a>
              <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="transition hover:text-primary-400">GitHub</a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-primary-400">Instagram</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Studio Santana. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="transition hover:text-primary-400">Política de Privacidade</Link>
            <Link href="/terms" className="transition hover:text-primary-400">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
