import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { formatCurrency } from '@/lib/business-rules'
import { FolderKanban, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getAccountSession } from '@/lib/account-auth'

export const metadata = {
  title: 'Meus Projetos',
  description: 'Acompanhe seus projetos',
}

export default async function ClientDashboard() {
  const accountSession = await getAccountSession()

  if (!accountSession?.email || accountSession.selectedRole !== 'CLIENT') {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: accountSession.email },
  })

  if (!dbUser) {
    redirect('/sign-up')
  }

  // Buscar projetos do cliente
  const projects = await prisma.project.findMany({
    where: { clientId: dbUser.id },
    include: {
      contract: {
        select: {
          status: true,
          signedAt: true,
        },
      },
      payments: {
        select: {
          status: true,
          amount: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    pending: projects.filter(p => ['ANALYSIS', 'AWAITING_SIGNATURE', 'AWAITING_PAYMENT'].includes(p.status)).length,
  }

  return (
    <DashboardLayout user={{ ...dbUser, role: 'CLIENT' }} availableRoles={accountSession.roles}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel do cliente: {dbUser.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Acompanhe status, etapas e previsibilidade da sua operacao digital.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FolderKanban className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <Clock className="text-orange-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-3xl font-bold text-gray-600">{stats.pending}</p>
              </div>
              <AlertCircle className="text-gray-600" size={40} />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Meus Projetos</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Ainda nao ha projeto ativo neste perfil.</p>
              <p className="text-sm text-gray-500 mb-5">
                Inicie uma triagem tecnica para abrir escopo com caminho claro de entrega.
              </p>
              <Link
                href="/"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Iniciar triagem tecnica
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/client/projects/${project.id}`}
                  className="block border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Valor</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(project.totalValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Prazo</p>
                      <p className="font-semibold text-gray-900">
                        {project.deliveryDays} dias
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Progresso</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${(project as any).progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">
                          {(project as any).progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ANALYSIS: 'bg-yellow-100 text-yellow-700',
    AWAITING_SIGNATURE: 'bg-blue-100 text-blue-700',
    AWAITING_PAYMENT: 'bg-orange-100 text-orange-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    REVIEW: 'bg-indigo-100 text-indigo-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  const labels: Record<string, string> = {
    ANALYSIS: 'Em Análise',
    AWAITING_SIGNATURE: 'Aguardando Assinatura',
    AWAITING_PAYMENT: 'Aguardando Pagamento',
    IN_PROGRESS: 'Em Desenvolvimento',
    REVIEW: 'Em Revisão',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
    </span>
  )
}
