import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import LoadingOverlay from '@/components/layout/LoadingOverlay'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import ReferralAttributionManager from '@/components/tracking/ReferralAttributionManager'
import CookieConsentBanner from '@/components/tracking/CookieConsentBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ssantana.com.br'),
  title: {
    default: 'SSantana | Infraestrutura Gerenciada, SaaS e E-mail Corporativo Blindado',
    template: '%s | SSantana Tecnologia & Infraestrutura',
  },
  description: 'Desenvolvimento ágil de software com Inteligência Artificial, infraestrutura de servidores gerenciada, SaaS vertical para saúde/jurídico e suporte técnico direto com o decisor.',
  keywords: [
    'SSantana Tecnologia',
    'infraestrutura de TI',
    'servidores gerenciados',
    'SaaS clínicas',
    'SaaS advogados',
    'e-mail corporativo blindado',
    'suporte técnico remoto',
    'hora técnica TI',
    'desenvolvimento com IA',
    'MVP ágil',
    'Salvador',
    'Bahia',
    'Brasil',
  ],
  authors: [{ name: 'SSantana Tecnologia & Infraestrutura', url: 'https://ssantana.com.br' }],
  creator: 'SSantana Tecnologia & Infraestrutura',
  publisher: 'SSantana Tecnologia & Infraestrutura',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ssantana.com.br',
    title: 'SSantana | Infraestrutura Gerenciada, SaaS e E-mail Corporativo Blindado',
    description: 'Infraestrutura de TI de alta confiabilidade, sistemas web com IA e atendimento direto com o decisor técnico.',
    siteName: 'SSantana Tecnologia & Infraestrutura',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SSantana Tecnologia & Infraestrutura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSantana | Infraestrutura Gerenciada, SaaS e E-mail Corporativo Blindado',
    description: 'Sistemas com IA, servidores blindados e suporte especializado sob medida.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ClerkProvider condicional - só ativa se houver chaves configuradas
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                       process.env.CLERK_SECRET_KEY
  
  const content = (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "SSantana Tecnologia & Infraestrutura",
              "image": "https://ssantana.com.br/logo.png",
              "description": "Desenvolvimento de software ágil com IA, suporte de TI remoto e e-mail corporativo blindado.",
              "priceRange": "R$ 40,00 - R$ 800",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Salvador",
                "addressRegion": "BA",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -12.9714,
                "longitude": -38.5014
              },
              "url": "https://ssantana.com.br",
              "telephone": "+55-71-98806-8222",
              "email": "contato@ssantana.com.br",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "20:00"
                }
              ],
              "sameAs": [
                "https://www.linkedin.com/company/ssantana-tech",
                "https://github.com/ssantana",
                "https://instagram.com/ssantana.tech"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LoadingOverlay />
          <Suspense fallback={null}>
            <ReferralAttributionManager />
          </Suspense>
          <CookieConsentBanner />
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
  
  // Se tiver chaves do Clerk, usa o provider
  if (hasClerkKeys) {
    return <ClerkProvider>{content}</ClerkProvider>
  }
  
  // Caso contrário, retorna sem autenticação
  return content
}
