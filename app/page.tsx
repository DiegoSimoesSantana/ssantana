import HeroSection from '@/components/marketing/HeroSection'
import AIDiagnostic from '@/components/marketing/AIDiagnostic'
import PricingSection from '@/components/marketing/PricingSection'
import LeadJourneySection from '@/components/marketing/LeadJourneySection'
import CTASection from '@/components/marketing/CTASection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero curto e direto: isca de valor */}
        <HeroSection />
        
        {/* Diagnóstico para detectar necessidade */}
        <AIDiagnostic />
        
        {/* Oferta inicial com preços e opções diretas */}
        <PricingSection />

        {/* Fluxo operacional: cliente, parceiro e admin */}
        <LeadJourneySection />
        
        {/* CTA Final */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
