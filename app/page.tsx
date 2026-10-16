import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/marketing/HeroSection'
import VitrineOfertasRapidas from '@/components/marketing/VitrineOfertasRapidas'
import AuthoritySection from '@/components/marketing/AuthoritySection'
import CTASection from '@/components/marketing/CTASection'
import { getDynamicPricing } from '@/lib/dynamic-pricing'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const pricing = await getDynamicPricing()

  let whatsappNumber = '5571988068222'
  try {
    const credSetting = await prisma.settings.findUnique({
      where: { key: 'api_credentials' },
    })
    const credVal = (credSetting?.value as Record<string, any>) || {}
    if (credVal.WHATSAPP_NUMBER) {
      whatsappNumber = credVal.WHATSAPP_NUMBER
    }
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white transition-colors">
      <Header />
      <main>
        {/* 1. Hero Direta de Baixa Barreira */}
        <HeroSection whatsappNumber={whatsappNumber} />

        {/* 2. Vitrine de Ofertas de Entrada com Acordeões e PicPay */}
        <VitrineOfertasRapidas pricing={pricing} whatsappNumber={whatsappNumber} />

        {/* 3. Autoridade: Seu Guardião Tecnológico (Mestre Diego + Clientes) */}
        <AuthoritySection />

        {/* 4. Chamada Final de Contato */}
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
