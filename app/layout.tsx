import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://studio-santana.vercel.app'),
  title: {
    default: 'Studio Santana - Engenharia de Software com AI | Entrega em 5 dias',
    template: '%s | Studio Santana'
  },
  description: 'Desenvolvimento ágil de software com Inteligência Artificial. Sistemas web, MVPs e automação entregues em 5 dias úteis com planejamento preciso e tecnologia de ponta.',
  keywords: [
    'engenharia de software',
    'inteligência artificial',
    'IA',
    'desenvolvimento rápido',
    'sistemas web',
    'automação',
    'Next.js',
    'consultoria tech',
    'desenvolvimento ágil',
    'MVP',
    'prototipagem',
    'Salvador',
    'Bahia',
    'Brasil'
  ],
  authors: [{ name: 'Studio Santana', url: 'https://studio-santana.vercel.app' }],
  creator: 'Studio Santana',
  publisher: 'Studio Santana',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://studio-santana.vercel.app',
    title: 'Studio Santana - Soluções em IA para seu negócio',
    description: 'Transforme suas ideias em realidade com nossa expertise em IA e desenvolvimento ágil. Entrega garantida em 5 dias úteis.',
    siteName: 'Studio Santana',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Studio Santana - Engenharia de Software com AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Santana - Engenharia de Software com AI',
    description: 'Desenvolvimento ágil com IA. Entrega em 5 dias úteis.',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Studio Santana - Engenharia de Software e AI",
                "image": "https://studio-santana.vercel.app/logo.png",
                "description": "Desenvolvimento de software ágil com foco em IA. Criação de sistemas web, MVPs e automação em 5 dias úteis.",
                "priceRange": "R$ 100 - R$ 2000+",
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
                "url": "https://studio-santana.vercel.app",
                "telephone": "+55-71-98806-8222",
                "email": "contato@ssantana.com.br",
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "18:00"
                  }
                ],
                "sameAs": [
                  "https://www.linkedin.com/company/studio-santana",
                  "https://github.com/ssantana",
                  "https://instagram.com/studio.santana"
                ],
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Consultoria de Diagnóstico e Plano de Ação",
                    "description": "Reunião de 30-60min para entendimento de escopo e orçamento imediato. Promoção: 50% de desconto até o final do ano.",
                    "price": "100.00",
                    "priceCurrency": "BRL",
                    "validThrough": "2026-12-31",
                    "availability": "https://schema.org/InStock",
                    "priceValidUntil": "2026-12-31"
                  },
                  {
                    "@type": "Offer",
                    "name": "Desenvolvimento de Sistema Web Simples",
                    "price": "2000.00",
                    "priceCurrency": "BRL",
                    "description": "Desenvolvimento de software sob medida com entrega em 5 dias úteis.",
                    "availability": "https://schema.org/InStock"
                  }
                ]
              })
            }}
          />
        </head>
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
