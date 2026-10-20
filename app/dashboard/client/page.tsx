import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { formatCurrency } from '@/lib/business-rules'
import { FolderKanban, Clock, CheckCircle, AlertCircle, Heart, Gift, ExternalLink, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { getAccountSession } from '@/lib/account-auth'

export const metadata = {
  title: 'Meus Projetos & Doações',
  description: 'Acompanhe seus projetos e apoio comunitário',
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

  // Buscar doações do cliente (por email ou documento)
  const donations = await prisma.donation.findMany({
    where: {
      OR: [
        { donorEmail: { equals: dbUser.email, mode: 'insensitive' } },
        ...(dbUser.phone ? [{ donorDocument: dbUser.phone }] : []),
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    pending: projects.filter(p => ['ANALYSIS', 'AWAITING_SIGNATURE', 'AWAITING_PAYMENT'].includes(p.status)).length,
    donationsCount: donations.length,
    donationsTotal: donations.filter(d => d.status === 'PAID').reduce((sum, d) => sum + d.amount, 0),
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Projetos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <FolderKanban className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Em Andamento</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.inProgress}</p>
              </div>
              <Clock className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Concluídos</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Pendentes</p>
                <p className="text-2xl font-bold text-gray-700 mt-1">{stats.pending}</p>
              </div>
              <AlertCircle className="text-gray-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Doações / Apoio</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{stats.donationsCount}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{formatCurrency(stats.donationsTotal)} pagos</p>
              </div>
              <Heart className="text-rose-500 fill-rose-500/20" size={32} />
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

        {/* Doações & Apoio a Projetos Gratuitos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                Minhas Contribuições & Apoio a Projetos Gratuitos
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Contribuições voluntárias destinadas ao desenvolvimento de softwares comunitários e de código aberto.
              </p>
            </div>
            <Link
              href="/doacoes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold transition"
            >
              <Gift className="w-4 h-4" />
              Apoiar Mais Projetos
            </Link>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
              <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Nenhuma doação registrada neste perfil.</p>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Você pode sugerir, votar e apoiar a criação de ferramentas livres e seguras (como o Bloqueador de Chamadas) a partir de R$ 1,00 via PIX ou Cartão.
              </p>
              <Link
                href="/doacoes"
                className="mt-4 inline-block bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Conhecer Projetos Gratuitos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((d) => (
                <div
                  key={d.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-base">
                        {d.targetProject || 'Geral / Manutenção Comunitária'}
                      </span>
                      {d.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Pagamento Reconhecido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Aguardando Pagamento
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      Ref: {d.referenceId} • {new Date(d.createdAt).toLocaleDateString('pt-BR')} às {new Date(d.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {d.paidAt && ` • Reconhecido em: ${new Date(d.paidAt).toLocaleDateString('pt-BR')} às ${new Date(d.paidAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    {d.message && (
                      <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded mt-1">
                        "{d.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Valor da Contribuição</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(d.amount)}
                      </p>
                    </div>

                    {d.status === 'PENDING' && (
                      <Link
                        href={`/doacoes`}
                        className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        Ver QR Code
                      </Link>
                    )}
                  </div>
                </div>
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
