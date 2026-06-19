import { Metadata } from 'next'
import PartnersRecruitmentPage from '@/components/marketing/PartnersRecruitmentPage'

export const metadata: Metadata = {
  title: 'Programa de Parcerias B2B',
  description:
    'Pagina para aliancas B2B com indicacao comissionada e co-desenvolvimento, com regras claras e relacionamento de longo prazo.',
}

export default function PartnersPage() {
  return <PartnersRecruitmentPage />
}
