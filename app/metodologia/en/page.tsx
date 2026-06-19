import type { Metadata } from 'next'
import EducationLanding from '@/components/education/EducationLanding'

export const metadata: Metadata = {
  title: 'Engineering Playbook EN | Studio Santana',
  description:
    'English funnel page covering MVP, software scope, corporate email and operational support with clear decision criteria.',
}

export default function EducationEnglishPage() {
  return <EducationLanding initialLang="en" lockLanguage />
}
