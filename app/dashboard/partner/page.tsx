import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Link as LinkIcon, Calendar, AlertCircle, Download, FileText } from 'lucide-react'
import PartnerProspectionStats from '@/components/dashboard/PartnerProspectionStats'
import PartnerContractsPanel from '@/components/dashboard/PartnerContractsPanel'
import { getAccountSession } from '@/lib/account-auth'
import { buildReferralLandingUrl } from '@/lib/referral-tracking'
import { getPartnerReferralConfig } from '@/lib/partner-referral-config'

const CALENDAR_LINK = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export const metadata = {
  title: 'Dashboard Parceiro',
  description: 'Suas indicações e comissões',
}

export default async function PartnerDashboard() {
  const accountSession = await getAccountSession()
  if (!accountSession?.email || accountSession.selectedRole !== 'PARTNER') {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: accountSession.email },
  })

  if (!dbUser) {
    redirect('/sign-in')
  }

  const partnerProfile = await prisma.partner.findUnique({
    where: { userId: dbUser.id },
    select: { id: true, companyName: true, referralCode: true, bankAccount: true },
  })

  if (!partnerProfile) {
    redirect('/sign-in')
  }

  // Verificar se o parceiro já foi validado
  const isValidated = !!partnerProfile.companyName
  const referralCode = partnerProfile.referralCode || `PARC-${partnerProfile.id.slice(0, 6).toUpperCase()}`
  const autoDiscountRate = getPartnerReferralConfig(partnerProfile.bankAccount).autoDiscountRate ?? 0
  const referralUrl = buildReferralLandingUrl('https://ssantana.com.br', referralCode, autoDiscountRate)

  return (
    <DashboardLayout
      user={{ name: dbUser.name || 'Parceiro', email: dbUser.email, role: 'PARTNER' as any }}
      availableRoles={accountSession.roles}
    >
      <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Seu link unico de divulgacao</p>
        <p className="mt-2 break-all text-sm font-medium text-indigo-900">{referralUrl}</p>
        <p className="mt-2 text-xs text-indigo-700">Use este link para encaminhar contatos para a pagina VIP e manter rastreio de atribuicao com transparencia.</p>
      </div>

      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Kit comercial do parceiro</p>
            <p className="mt-1 text-sm text-emerald-900">
              Regras, roteiro e modelos em um unico lugar para manter padrao de apresentacao comercial.
            </p>
          </div>
          <Link
            href="/partners/kit-comercial"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Abrir kit e baixar modelos
            <Download className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 grid gap-2 text-xs text-emerald-800 sm:grid-cols-3">
          <p className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2">
            <FileText className="h-3.5 w-3.5" />
            Termos comerciais explicados
          </p>
          <p className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2">
            <FileText className="h-3.5 w-3.5" />
            Scripts de venda prontos
          </p>
          <p className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2">
            <FileText className="h-3.5 w-3.5" />
            Modelos para personalizacao
          </p>
        </div>
      </div>

      <PartnerProspectionStats defaultRefCode={referralCode} />
      <PartnerContractsPanel defaultRefCode={referralCode} />

      {/* Aviso de Validação Pendente */}
      {!isValidated && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 rounded-full p-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎯 Cadastro em Análise
              </h3>
              <p className="text-gray-700 mb-4 text-lg">
                Para ativar sua conta como parceiro, precisamos nos conhecer e validar seu perfil!
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4 border border-orange-100">
                <h4 className="font-semibold text-gray-900 mb-3">Na reunião vamos:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Conhecer você e seu perfil profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Explicar como funciona nossa parceria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Validar se o perfil está alinhado com nossos valores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Ativar sua conta e liberar todas as funcionalidades</span>
                  </li>
                </ul>
              </div>

              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Agendar Reunião de Validação
              </a>
              
              <p className="mt-3 text-sm text-gray-600">
                ⏱️ Reunião online via Google Meet • Duração: 30 minutos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content - Bloqueado se não validado */}
      {!isValidated && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
            <LinkIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Dashboard Bloqueado
          </h3>
          <p className="text-gray-600">
            Agende sua reunião de validação para desbloquear todas as funcionalidades
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}

