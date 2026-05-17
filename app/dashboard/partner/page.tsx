import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { formatCurrency } from '@/lib/business-rules'
import { Users, DollarSign, TrendingUp, Link as LinkIcon, Calendar, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const CALENDAR_LINK = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3BnznimDnHVolTPdHCTHYPbixuhHbl2tGq23RzwYGSA2NvW2h5fgxOWi-vU9H_Nrnfh3YCOl52'

export const metadata = {
  title: 'Dashboard Parceiro',
  description: 'Suas indicações e comissões',
}

export default async function PartnerDashboard() {
  // TEMPORÁRIO: Sem autenticação Clerk, simulando usuário parceiro pendente
  const mockUser = {
    id: 'temp-partner-001',
    email: 'parceiro@teste.com',
    name: 'Parceiro Teste',
    role: 'PARTNER',
  }

  // Verificar se o parceiro já foi validado
  const isValidated = false // Temporariamente sempre falso para mostrar aviso

  return (
    <DashboardShell
      user={{ name: 'Parceiro', email: 'parceiro@teste.com', role: 'PARTNER' as any }}
    >
      {/* Aviso de Validação Pendente */}
      {!isValidated && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 rounded-full p-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎯 Cadastro em Análise
              </h3>
              <p className="text-gray-700 mb-4 text-lg">
                Para ativar sua conta como parceiro, precisamos nos conhecer e validar seu perfil!
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4 border border-orange-100">
                <h4 className="font-semibold text-gray-900 mb-3">Na reunião vamos:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Conhecer você e seu perfil profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Explicar como funciona nossa parceria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Validar se o perfil está alinhado com nossos valores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Ativar sua conta e liberar todas as funcionalidades</span>
                  </li>
                </ul>
              </div>

              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Agendar Reunião de Validação
              </a>
              
              <p className="mt-3 text-sm text-gray-600">
                ⏱️ Reunião online via Google Meet • Duração: 30 minutos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content - Bloqueado se não validado */}
      {isValidated ? (
        <div>
          {/* Conteúdo original do dashboard aqui */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Indicações Ativas</p>
                  <h3 className="text-2xl font-bold">0</h3>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comissão Total</p>
                  <h3 className="text-2xl font-bold">R$ 0,00</h3>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
            <LinkIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Dashboard Bloqueado
          </h3>
          <p className="text-gray-600">
            Agende sua reunião de validação para desbloquear todas as funcionalidades
          </p>
        </div>
      )}
    </DashboardShell>
  )
}

