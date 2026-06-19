import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PricingSection from '@/components/marketing/PricingSection'

export const metadata: Metadata = {
  title: 'Precos e Investimento | Studio Santana',
  description:
    'Escada de investimento dos servicos Studio Santana, com desconto de setup somente para indicacao parceira B2B ativa.',
}

export default function EducationPricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24">
        <PricingSection />
      </main>
      <Footer />
    </>
  )
}
