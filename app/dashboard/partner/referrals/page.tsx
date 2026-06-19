import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/account-auth'
import { prisma } from '@/lib/db'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Users } from 'lucide-react'
import PartnerDirectReferralForm from '@/components/dashboard/PartnerDirectReferralForm'

export const metadata = { title: 'Indicações', description: 'Seus leads indicados' }

export default async function PartnerReferralsPage() {
  const accountSession = await getAccountSession()
  if (!accountSession?.email || accountSession.selectedRole !== 'PARTNER') redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({ where: { email: accountSession.email } })
  if (!dbUser) redirect('/sign-in')

  const partnerProfile = await prisma.partner.findUnique({
    where: { userId: dbUser.id },
    select: {
      id: true,
      companyName: true,
      referralCode: true,
      leads: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, status: true, createdAt: true, serviceType: true },
      },
    },
  })
  if (!partnerProfile) redirect('/sign-in')

  const referralCode = partnerProfile.referralCode || `PARC-${partnerProfile.id.slice(0, 6).toUpperCase()}`

  const statusLabel: Record<string, string> = {
    NEW: 'Novo',
    new: 'Novo',
    CONTACTED: 'Contatado',
    contacted: 'Contatado',
    QUALIFIED: 'Qualificado',
    qualified: 'Qualificado',
    PROPOSAL_SENT: 'Proposta Enviada',
    proposal_sent: 'Proposta Enviada',
    CONVERTED: 'Convertido',
    converted: 'Convertido',
    LOST: 'Perdido',
    lost: 'Perdido',
  }

  const statusColor: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    new: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    QUALIFIED: 'bg-indigo-100 text-indigo-700',
    qualified: 'bg-indigo-100 text-indigo-700',
    PROPOSAL_SENT: 'bg-purple-100 text-purple-700',
    proposal_sent: 'bg-purple-100 text-purple-700',
    CONVERTED: 'bg-green-100 text-green-700',
    converted: 'bg-green-100 text-green-700',
    LOST: 'bg-red-100 text-red-700',
    lost: 'bg-red-100 text-red-700',
  }

  return (
    <DashboardLayout
      user={{ name: dbUser.name || 'Parceiro', email: dbUser.email, role: 'PARTNER' as any }}
      availableRoles={accountSession.roles}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Indicações e prospecção</h1>
            <p className="text-gray-600 mt-1">
              Compartilhe seu link com o código{' '}
              <span className="font-mono font-bold text-indigo-700">{referralCode}</span>
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-6 py-4 text-center">
            <p className="text-xs text-indigo-600 font-medium uppercase">Total de indicações</p>
            <p className="text-4xl font-bold text-indigo-700">{partnerProfile.leads.length}</p>
          </div>
        </div>

        {partnerProfile.leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">Ainda não há indicação registrada.</p>
            <p className="text-gray-400 text-sm mt-2">
              Compartilhe o link do site com o parâmetro{' '}
              <span className="font-mono bg-gray-100 px-1 rounded">/indicacao-vip?ref={referralCode}</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Assim que o contato entrar e avançar no funil, o status aparece nesta página.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partnerProfile.leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.serviceType || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabel[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
          <p className="font-semibold">Indicação direta com desconto adicional</p>
          <p className="mt-1">
            Use o formulário abaixo quando quiser cadastrar PF/PJ com contexto comercial e, se necessário, aplicar desconto cedendo parte da sua comissão dentro das regras da plataforma.
          </p>
        </div>

        <PartnerDirectReferralForm referralCode={referralCode} />
      </div>
    </DashboardLayout>
  )
}
