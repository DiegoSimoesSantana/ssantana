import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/account-auth'
import { prisma } from '@/lib/db'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export const metadata = { title: 'Configurações do Parceiro', description: 'Suas configurações de parceria' }

export default async function PartnerSettingsPage() {
  const accountSession = await getAccountSession()
  if (!accountSession?.email || accountSession.selectedRole !== 'PARTNER') redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({ where: { email: accountSession.email } })
  if (!dbUser) redirect('/sign-in')

  const partnerProfile = await prisma.partner.findUnique({
    where: { userId: dbUser.id },
    select: { id: true, companyName: true, referralCode: true },
  })
  if (!partnerProfile) redirect('/sign-in')

  const referralCode = partnerProfile.referralCode || `PARC-${partnerProfile.id.slice(0, 6).toUpperCase()}`

  return (
    <DashboardLayout
      user={{ name: dbUser.name || 'Parceiro', email: dbUser.email, role: 'PARTNER' as any }}
      availableRoles={accountSession.roles}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações da parceria</h1>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Dados da conta</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500 uppercase font-medium">Nome</dt>
              <dd className="mt-1 text-gray-900">{dbUser.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 uppercase font-medium">Email</dt>
              <dd className="mt-1 text-gray-900">{dbUser.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 uppercase font-medium">Código de Indicação</dt>
              <dd className="mt-1 font-mono font-bold text-indigo-700">{referralCode}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 uppercase font-medium">Empresa</dt>
              <dd className="mt-1 text-gray-900">{partnerProfile.companyName || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 uppercase font-medium">Senha individual</dt>
              <dd className="mt-1 text-gray-900">{(dbUser as any).passwordHash ? 'Configurada' : 'Usando senha padrão do sistema'}</dd>
            </div>
          </dl>
          <p className="text-sm text-gray-500 pt-2">
            Para alterar dados sensíveis, redefinir senha ou revisar dados de repasse, entre em contato com o suporte administrativo.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Boa prática operacional</p>
          <p className="mt-1">
            Mantenha email, telefone e dados de identificação atualizados para evitar bloqueio de validação e atraso em repasses.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
