import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { formatCurrency } from '@/lib/business-rules'
import { Users, DollarSign, TrendingUp, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard Parceiro',
  description: 'Suas indicações e comissões',
}

export default async function PartnerDashboard() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
  })

  if (!dbUser || dbUser.role !== 'PARTNER') {
    redirect('/')
  }

  // Buscar dados do parceiro
  const partner = await prisma.partner.findUnique({
    where: { userId: dbUser.id },
    include: {
      referrals: {
        include: {
          lead: true,
          project: {
            select: {
              title: true,
              totalValue: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      commissions: {
        include: {
          project: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!partner) {
    redirect('/')
  }

  const stats = {
    totalReferrals: partner.referrals.length,
    convertedProjects: partner.referrals.filter(r => r.converted).length,
    pendingCommissions: partner.commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0),
    paidCommissions: partner.commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0),
  }

  const conversionRate = stats.totalReferrals > 0 
    ? ((stats.convertedProjects / stats.totalReferrals) * 100).toFixed(1)
    : '0'

  return (
    <DashboardShell user={dbUser}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {dbUser.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Acompanhe suas indicações e ganhos
          </p>
        </div>

        {/* Link de Indicação */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Seu Link de Indicação</h2>
              <p className="text-primary-100 mb-4">
                Compartilhe e ganhe até 25% de comissão
              </p>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-3 flex items-center space-x-3">
                <code className="text-sm flex-1">
                  {process.env.NEXT_PUBLIC_URL}/?ref={partner.referralCode}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/?ref=${partner.referralCode}`)}
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition font-semibold text-sm"
                >
                  Copiar
                </button>
              </div>
            </div>
            <LinkIcon size={60} className="opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Indicações</p>
              <Users className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalReferrals}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.convertedProjects} convertidas
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Taxa de Conversão</p>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              Média: 15-20%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">A Receber</p>
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(stats.pendingCommissions)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Pendente
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Ganho</p>
              <DollarSign className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(partner.totalEarnings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Histórico total
            </p>
          </div>
        </div>

        {/* Referrals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Últimas Indicações
          </h2>
          
          {partner.referrals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma indicação ainda</p>
              <p className="text-sm text-gray-400">
                Compartilhe seu link para começar a ganhar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {partner.referrals.slice(0, 10).map((referral) => (
                <div
                  key={referral.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {referral.lead.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {referral.lead.email}
                      </p>
                      {referral.project && (
                        <p className="text-sm text-primary-600 mt-2">
                          Projeto: {referral.project.title}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {referral.converted ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Convertido
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Aguardando
                        </span>
                      )}
                      {referral.project && (
                        <p className="text-sm font-bold text-gray-900 mt-2">
                          {formatCurrency(referral.project.totalValue)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commissions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Comissões
          </h2>
          
          {partner.commissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Nenhuma comissão ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Projeto
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Taxa
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Valor
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partner.commissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm">
                        {commission.project.title}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {(commission.rate * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        {formatCurrency(commission.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          commission.status === 'PAID' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {commission.status === 'PAID' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
