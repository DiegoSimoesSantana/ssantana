import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { getAccountSession } from '@/lib/account-auth'
import { formatCurrency } from '@/lib/business-rules'

export const metadata = { title: 'Pagamentos', description: 'Seus pagamentos' }

export default async function ClientPaymentsPage() {
  const accountSession = await getAccountSession()
  if (!accountSession?.email || accountSession.selectedRole !== 'CLIENT') redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({ where: { email: accountSession.email } })
  if (!dbUser) redirect('/sign-up')

  const payments = await prisma.payment.findMany({
    where: { clientId: dbUser.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout user={{ ...dbUser, role: 'CLIENT' }} availableRoles={accountSession.roles}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Pagamentos e histórico financeiro</h1>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Como interpretar</p>
          <p className="mt-1">
            Pendente indica cobrança em processamento. Pago indica baixa confirmada. Em caso de divergência, acione suporte pelo canal oficial.
          </p>
        </div>
        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            Nenhum pagamento encontrado para este perfil.
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
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (p.status as string) === 'PAID' ? 'bg-green-100 text-green-700' :
                        (p.status as string) === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {(p.status as string) === 'PAID' ? 'Pago' : (p.status as string) === 'PENDING' ? 'Pendente' : String(p.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.method}</td>
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
