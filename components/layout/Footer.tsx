import Link from 'next/link'
import { BUSINESS_RULES } from '@/lib/business-rules'

export default function Footer() {
  const { CONTACT, SOCIAL } = BUSINESS_RULES

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Studio Santana</h3>
            <p className="text-sm">
              Desenvolvemos soluções digitais personalizadas com IA que transformam negócios e impulsionam resultados.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition">
                  Sistemas Web
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition">
                  Aplicativos Mobile
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition">
                  Automação com IA
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition">
                  Consultoria Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="hover:text-primary-400 transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-primary-400 transition">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-primary-400 transition">
                  Programa de Parceiros
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-primary-400 transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 {CONTACT.address.city}, {CONTACT.address.state}</li>
              <li>
                <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-primary-400 transition">
                  📞 {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-primary-400 transition">
                  ✉️ {CONTACT.email}
                </a>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition">
                LinkedIn
              </a>
              <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition">
                GitHub
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© {new Date().getFullYear()} Studio Santana. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-primary-400 transition">
              Política de Privacidade
            </Link>
            <Link href="/terms" className="hover:text-primary-400 transition">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
