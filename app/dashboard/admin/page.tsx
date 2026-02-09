import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import StatsGrid from '@/components/dashboard/StatsGrid'
import LeadsTable from '@/components/dashboard/LeadsTable'
import ProjectsTable from '@/components/dashboard/ProjectsTable'
import RecentActivity from '@/components/dashboard/RecentActivity'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Painel administrativo do Studio Santana',
}

export default async function AdminDashboard() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Buscar dados do usuário no banco
  const dbUser = await prisma.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/')
  }

  // Buscar estatísticas gerais
  const [
    totalLeads,
    newLeadsThisMonth,
    pendingApproval,
    activeProjects,
    totalRevenue,
    pendingPayments,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.project.count({
      where: { status: 'ANALYSIS', approvedByAdmin: false },
    }),
    prisma.project.count({
      where: { status: 'IN_PROGRESS' },
    }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.payment.count({
      where: { status: 'PENDING' },
    }),
  ])

  const stats = [
    {
      title: 'Total de Leads',
      value: totalLeads,
      change: `+${newLeadsThisMonth} este mês`,
      trend: 'up' as const,
    },
    {
      title: 'Aguardando Aprovação',
      value: pendingApproval,
      change: 'Projetos para revisar',
      trend: pendingApproval > 0 ? ('neutral' as const) : ('down' as const),
      urgent: pendingApproval > 0,
    },
    {
      title: 'Projetos Ativos',
      value: activeProjects,
      change: 'Em desenvolvimento',
      trend: 'neutral' as const,
    },
    {
      title: 'Receita Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalRevenue._sum.amount || 0),
      change: `${pendingPayments} pagamentos pendentes`,
      trend: 'up' as const,
    },
  ]

  // Buscar leads pendentes de aprovação
  const leadsForApproval = await prisma.lead.findMany({
    where: { status: 'new' },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // Buscar projetos recentes
  const recentProjects = await prisma.project.findMany({
    where: { approvedByAdmin: false, status: 'ANALYSIS' },
    include: {
      client: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <DashboardShell user={dbUser}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie leads, projetos e aprove novos contratos
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leads Pendentes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Novos Leads
              </h2>
              <span className="text-sm text-gray-500">
                {leadsForApproval.length} pendentes
              </span>
            </div>
            <LeadsTable leads={leadsForApproval} />
          </div>

          {/* Projetos para Aprovação */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Projetos para Aprovar
              </h2>
              <span className="text-sm text-gray-500">
                {recentProjects.length} pendentes
              </span>
            </div>
            <ProjectsTable projects={recentProjects} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Atividade Recente
          </h2>
          <RecentActivity />
        </div>
      </div>
    </DashboardShell>
  )
}
