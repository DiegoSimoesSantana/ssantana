import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/account-auth'
import { prisma } from '@/lib/db'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export const metadata = { title: 'Comissões', description: 'Suas comissões de parceria' }

export default async function PartnerCommissionsPage() {
  const accountSession = await getAccountSession()
  if (!accountSession?.email || accountSession.selectedRole !== 'PARTNER') redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({ where: { email: accountSession.email } })
  if (!dbUser) redirect('/sign-in')

  const partnerProfile = await prisma.partner.findUnique({
    where: { userId: dbUser.id },
    select: { id: true, companyName: true, referralCode: true, commissions: { orderBy: { paidAt: 'desc' } } },
  })
  if (!partnerProfile) redirect('/sign-in')

  const referralCode = partnerProfile.referralCode || `PARC-${partnerProfile.id.slice(0, 6).toUpperCase()}`

  return (
    <DashboardLayout
      user={{ name: dbUser.name || 'Parceiro', email: dbUser.email, role: 'PARTNER' as any }}
      availableRoles={accountSession.roles}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comissões e repasses</h1>
          <p className="text-gray-600 mt-1">Código ativo de indicação: <span className="font-mono font-bold text-indigo-700">{referralCode}</span></p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
          <p className="font-semibold">Leitura rápida dos status</p>
          <p className="mt-1">Pendente: valor aguardando ciclo de conferência. Pago: repasse concluído. Outros status podem indicar exceções operacionais.</p>
        </div>

        {partnerProfile.commissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            Nenhuma comissão registrada até o momento. Compartilhe seu link e acompanhe o avanço das indicações no funil.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partnerProfile.commissions.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      R$ {c.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (c.status as string) === 'PAID' ? 'bg-green-100 text-green-700' :
                        (c.status as string) === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {(c.status as string) === 'PAID' ? 'Pago' : (c.status as string) === 'PENDING' ? 'Pendente' : String(c.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.paymentMethod || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
