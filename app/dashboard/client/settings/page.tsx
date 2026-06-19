import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/account-auth'
import { prisma } from '@/lib/db'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ClientAvatarSettings from '@/components/dashboard/ClientAvatarSettings'
import ClientAccountSettingsForm from '@/components/dashboard/ClientAccountSettingsForm'
import Link from 'next/link'

export const metadata = { title: 'Configurações', description: 'Suas configurações' }

export default async function ClientSettingsPage() {
  const accountSession = await getAccountSession()
  if (!accountSession?.email || accountSession.selectedRole !== 'CLIENT') redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({ where: { email: accountSession.email } })
  if (!dbUser) redirect('/sign-up')

  return (
    <DashboardLayout user={{ ...dbUser, role: 'CLIENT' }} availableRoles={accountSession.roles}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações da conta</h1>
        <ClientAccountSettingsForm
          initialName={dbUser.name}
          initialEmail={dbUser.email}
          initialPhone={dbUser.phone || ''}
        />

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Recomendação</p>
          <p className="mt-1">
            Mantenha telefone e email atualizados para receber avisos de projeto, cobrança e notificações de manutenção.
          </p>
          <Link
            href="/precos"
            className="mt-3 inline-flex rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700"
          >
            Solicitar novo serviço
          </Link>
        </div>

        <ClientAvatarSettings userName={dbUser.name} initialAvatar={dbUser.avatar || null} />
      </div>
    </DashboardLayout>
  )
}
