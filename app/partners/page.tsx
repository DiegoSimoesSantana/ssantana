import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PartnersRecruitmentPage from '@/components/marketing/PartnersRecruitmentPage'

export const metadata: Metadata = {
  title: 'Programa de Parceiros',
  description: 'Indique clientes e ganhe 15% de comissão recorrente com regras claras e saque via PIX.',
}

export default function PartnersPage() {
  return (
    <>
      <Header />
      <PartnersRecruitmentPage />
      <Footer />
    </>
  )
}
