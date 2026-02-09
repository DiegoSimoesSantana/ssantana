// Types para o projeto Studio Santana AI

import { UserRole, ProjectStatus, ContractStatus, PaymentStatus, CommissionStatus } from '@prisma/client'

// ============= USER & AUTH =============

export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  role: UserRole
  createdAt: Date
}

// ============= LEADS =============

export interface LeadFormData {
  name: string
  email: string
  phone: string
  company?: string
  serviceType: string
  message?: string
  budget?: number
  source?: string
  partnerId?: string
}

export interface DiagnosticResult {
  title: string
  description: string
  efficiency: number
  timeSaved: number
  estimatedCost: number
  deliveryDays: number
}

// ============= PROJECTS =============

export interface ProjectCreateInput {
  leadId?: string
  clientId: string
  title: string
  description: string
  estimatedHours: number
  hourlyRate: number
  totalValue: number
  includesSourceCode?: boolean
  deliveryDays?: number
  requirements?: any
}

export interface ProjectWithRelations {
  id: string
  title: string
  description: string
  status: ProjectStatus
  totalValue: number
  deliveryDays: number
  startDate?: Date
  dueDate?: Date
  client: {
    id: string
    name: string
    email: string
  }
  contract?: {
    id: string
    status: ContractStatus
    signatureUrl?: string
  }
  payments: {
    id: string
    amount: number
    status: PaymentStatus
    paidAt?: Date
  }[]
}

// ============= CONTRACTS =============

export interface ContractGenerateInput {
  projectId: string
  clientId: string
  template?: string
  clauses?: any
  paymentSchedule: {
    installments: number
    firstPaymentDate: Date
  }
}

export interface ContractData {
  id: string
  projectTitle: string
  clientName: string
  totalValue: number
  deliveryDays: number
  startDate: Date
  clauses: any
  signatureUrl?: string
}

// ============= PAYMENTS =============

export interface PaymentCreateInput {
  contractId: string
  projectId: string
  clientId: string
  amount: number
  installment: number
  totalInstallments: number
  method: 'pix' | 'credit_card' | 'boleto'
  provider?: 'stripe' | 'mercadopago'
}

export interface PaymentWithProject {
  id: string
  amount: number
  status: PaymentStatus
  paidAt?: Date
  project: {
    id: string
    title: string
    client: {
      name: string
      email: string
    }
  }
}

// ============= PARTNERS =============

export interface PartnerProfile {
  id: string
  userId: string
  companyName?: string
  cpfCnpj?: string
  commissionRate: number
  totalEarned: number
  pendingBalance: number
}

export interface PartnerStats {
  totalReferrals: number
  convertedReferrals: number
  conversionRate: number
  totalEarned: number
  pendingCommissions: number
  thisMonthEarnings: number
}

export interface CommissionData {
  id: string
  amount: number
  rate: number
  status: CommissionStatus
  paidAt?: Date
  project: {
    title: string
    totalValue: number
  }
  payment: {
    paidAt?: Date
  }
}

// ============= DASHBOARD =============

export interface DashboardStats {
  totalLeads: number
  newLeadsThisMonth: number
  activeProjects: number
  completedProjects: number
  totalRevenue: number
  pendingPayments: number
  activePartners: number
  pendingCommissions: number
}

export interface RecentActivity {
  id: string
  type: 'lead' | 'project' | 'payment' | 'contract'
  title: string
  description: string
  timestamp: Date
  status: string
}

// ============= AI USAGE =============

export interface AIUsage {
  provider: 'gemini' | 'copilot' | 'openai'
  tokensUsed: number
  cost: number
  purpose: string
  projectId: string
}

export interface ProjectAICosts {
  totalTokens: number
  totalCost: number
  byProvider: {
    gemini: number
    copilot: number
    openai: number
  }
}

// ============= NOTIFICATIONS =============

export interface NotificationData {
  userId: string
  type: 'payment' | 'contract' | 'project' | 'commission' | 'message'
  title: string
  message: string
  actionUrl?: string
  metadata?: any
}

// ============= API RESPONSES =============

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============= FORMS =============

export interface ContactFormData {
  name: string
  email: string
  phone: string
  serviceType: string
  message: string
}

export interface ProjectAcceptanceFormData {
  accepted: boolean
  feedback?: string
  rating?: number
  hasPendencies: boolean
  pendencies?: string[]
}

// ============= FILTERS =============

export interface LeadFilters {
  status?: string
  serviceType?: string
  source?: string
  partnerId?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface ProjectFilters {
  status?: ProjectStatus
  clientId?: string
  dateFrom?: Date
  dateTo?: Date
  minValue?: number
  maxValue?: number
}

// ============= BUSINESS RULES =============

export interface CancellationCalculation {
  refundAmount: number
  retainedAmount: number
  breakdown: {
    hoursWorked: number
    tokensCost: number
    administrativeFee: number
  }
}

export interface CommissionTier {
  min: number
  max?: number
  rate: number
  label: string
}

export interface SourceCodeCalculation {
  baseCost: number
  sourceCodeCost: number
  totalCost: number
}
