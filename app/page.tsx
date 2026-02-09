import HeroSection from '@/components/marketing/HeroSection'
import AIDiagnostic from '@/components/marketing/AIDiagnostic'
import ServicesShowcase from '@/components/marketing/ServicesShowcase'
import PricingSection from '@/components/marketing/PricingSection'
import ProcessSection from '@/components/marketing/ProcessSection'
import Testimonials from '@/components/marketing/Testimonials'
import CTASection from '@/components/marketing/CTASection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero com proposta de valor clara */}
        <HeroSection />
        
        {/* Calculadora Interativa de Potencial de IA */}
        <AIDiagnostic />
        
        {/* Showcase de Serviços */}
        <ServicesShowcase />
        
        {/* Preços Transparentes */}
        <PricingSection />
        
        {/* Processo de 5 dias */}
        <ProcessSection />
        
        {/* Depoimentos */}
        <Testimonials />
        
        {/* CTA Final */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
