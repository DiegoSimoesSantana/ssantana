import type { Metadata } from 'next'
import EducationLanding from '@/components/education/EducationLanding'

export const metadata: Metadata = {
  title: 'Trilha PT-BR de Engenharia | Studio Santana',
  description:
    'Trilha em portugues para escopo de software, MVP, e-mail corporativo e suporte tecnico com criterios claros.',
}

export default function EducationPortuguesePage() {
  return <EducationLanding initialLang="pt" lockLanguage />
}
