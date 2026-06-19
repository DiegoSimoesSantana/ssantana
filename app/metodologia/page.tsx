import type { Metadata } from 'next'
import KnowledgeBasePage from '@/components/education/KnowledgeBasePage'

export const metadata: Metadata = {
  title: 'Base de Conhecimento de Engenharia | Studio Santana',
  description:
    'Base de conhecimento com filosofia de engenharia, arquitetura por blocos, MVP, stack e liderança técnica.',
}

export default function EducationPage() {
  return <KnowledgeBasePage />
}
