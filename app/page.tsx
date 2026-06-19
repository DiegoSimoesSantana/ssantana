import HeroSection from '@/components/marketing/HeroSection'
import ServicesShowcase from '@/components/marketing/ServicesShowcase'
import ProcessSection from '@/components/marketing/ProcessSection'
import PricingSection from '@/components/marketing/PricingSection'
import CTASection from '@/components/marketing/CTASection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

import AuthoritySection from '@/components/marketing/AuthoritySection'
import Testimonials from '@/components/marketing/Testimonials'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* 1. Hero: Institutional positioning + guided navigation */}
        <HeroSection />
        
        {/* 2. Services: Easy navigation of services */}
        <ServicesShowcase />

        {/* 3. Process: 5 days methodology */}
        <ProcessSection />

        {/* 4. Pricing: Transparency on costs */}
        <PricingSection />

        {/* 5. Projects: Mini cases and backlinks */}
        <Testimonials />
        
        {/* 6. Authority: Credentials + Trust */}
        <AuthoritySection />

        {/* 7. Institutional CTA: direct contact with owner */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
