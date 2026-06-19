import type { Metadata } from 'next'
import EducationLanding from '@/components/education/EducationLanding'

export const metadata: Metadata = {
  title: 'Ruta de Ingenieria ES | Studio Santana',
  description:
    'Ruta en espanol para MVP, alcance de software, correo corporativo y soporte tecnico con enfoque consultivo.',
}

export default function EducationSpanishPage() {
  return <EducationLanding initialLang="es" lockLanguage />
}
