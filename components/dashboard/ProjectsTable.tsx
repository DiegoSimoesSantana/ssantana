'use client'

import { formatCurrency } from '@/lib/business-rules'
import { ProjectStatus } from '@prisma/client'
import { CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  totalValue: number
  status: ProjectStatus
  client: {
    name: string
    email: string
  }
}

interface ProjectsTableProps {
  projects: Project[]
}

const statusLabels: Record<ProjectStatus, string> = {
  ANALYSIS: 'Em Análise',
  AWAITING_SIGNATURE: 'Aguardando Assinatura',
  AWAITING_PAYMENT: 'Aguardando Pagamento',
  IN_PROGRESS: 'Em Desenvolvimento',
  REVIEW: 'Em Revisão',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (projectId: string) => {
    setLoading(projectId)
    try {
      const response = await fetch('/api/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })

      if (response.ok) {
        toast.success('Projeto aprovado! Contrato será gerado.')
        window.location.reload()
      } else {
        toast.error('Erro ao aprovar projeto')
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (projectId: string) => {
    const reason = prompt('Motivo da rejeição:')
    if (!reason) return

    setLoading(projectId)
    try {
      const response = await fetch('/api/projects/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, reason }),
      })

      if (response.ok) {
        toast.success('Projeto rejeitado')
        window.location.reload()
      } else {
        toast.error('Erro ao rejeitar projeto')
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    } finally {
      setLoading(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum projeto pendente de aprovação</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
        >
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="text-sm font-medium text-gray-900">{project.client.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Valor</p>
              <p className="text-sm font-bold text-primary-600">
                {formatCurrency(project.totalValue)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(project.id)}
              disabled={loading === project.id}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle size={16} />
              <span>Aprovar</span>
            </button>
            <button
              onClick={() => handleReject(project.id)}
              disabled={loading === project.id}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <XCircle size={16} />
              <span>Rejeitar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
