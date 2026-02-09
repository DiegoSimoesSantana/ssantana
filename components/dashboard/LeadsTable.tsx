'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Mail, Phone, Building } from 'lucide-react'
import Link from 'next/link'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string | null
  serviceType: string
  createdAt: Date
  status: string
}

interface LeadsTableProps {
  leads: Lead[]
}

const serviceTypeLabels: Record<string, string> = {
  consultoria: 'Consultoria',
  website: 'Website',
  app: 'Aplicativo',
  automation: 'Automação',
  system: 'Sistema',
  other: 'Outro',
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum lead pendente no momento</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{lead.name}</h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(lead.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
              {serviceTypeLabels[lead.serviceType] || lead.serviceType}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail size={14} />
              <a href={`mailto:${lead.email}`} className="hover:text-primary-600">
                {lead.email}
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone size={14} />
              <a href={`tel:${lead.phone}`} className="hover:text-primary-600">
                {lead.phone}
              </a>
            </div>
            {lead.company && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building size={14} />
                <span>{lead.company}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/dashboard/admin/leads/${lead.id}`}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-semibold text-center"
            >
              Ver Detalhes
            </Link>
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
