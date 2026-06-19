import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { BUSINESS_RULES } from '@/lib/business-rules'

type ServiceKey =
  | 'MANUTENCAO_MENSAL'
  | 'SETUP_SISTEMA'
  | 'EMAIL_SETUP'
  | 'CONSULTORIA_30_60'

type QueueTargetRole = 'CLIENT' | 'PARTNER'
type ChangeStatus = 'PENDING' | 'APPLIED' | 'CANCELLED'
type QueueStatus = 'QUEUED' | 'SENT'

export type GovernanceService = {
  key: ServiceKey
  label: string
  currentPrice: number
  referencePrice: number
  b2bMaxDiscount: number
  couponMaxDiscount: number
  combinedMaxDiscount: number
  minAllowedPrice: number
  allowAdminOverrideCoupon: boolean
  updatedAt: string
}

export type GovernanceChange = {
  id: string
  serviceKey: ServiceKey
  newPrice: number
  effectiveAt: string
  reason: string
  notifyClients: boolean
  notifyPartners: boolean
  status: ChangeStatus
  createdAt: string
  createdBy: string
  appliedAt?: string
}

export type GovernanceQueueItem = {
  id: string
  changeId: string
  targetRole: QueueTargetRole
  title: string
  message: string
  createdAt: string
  status: QueueStatus
  processedAt?: string
  recipients?: number
}

export type PricingGovernanceState = {
  version: number
  services: GovernanceService[]
  changes: GovernanceChange[]
  queue: GovernanceQueueItem[]
  updatedAt: string
}

const SETTINGS_KEY = 'pricing_governance_v1'

function nowIso() {
  return new Date().toISOString()
}

function defaultServices(): GovernanceService[] {
  const now = nowIso()
  return [
    {
      key: 'MANUTENCAO_MENSAL',
      label: 'Manutencao Mensal',
      currentPrice: BUSINESS_RULES.MANUTENCAO_MENSAL,
      referencePrice: BUSINESS_RULES.MANUTENCAO_MENSAL_REAL,
      b2bMaxDiscount: 0,
      couponMaxDiscount: 0,
      combinedMaxDiscount: 0,
      minAllowedPrice: BUSINESS_RULES.MANUTENCAO_MENSAL,
      allowAdminOverrideCoupon: true,
      updatedAt: now,
    },
    {
      key: 'SETUP_SISTEMA',
      label: 'Setup do Sistema',
      currentPrice: BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO,
      referencePrice: BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL,
      b2bMaxDiscount: 0,
      couponMaxDiscount: 0,
      combinedMaxDiscount: 0,
      minAllowedPrice: BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO,
      allowAdminOverrideCoupon: true,
      updatedAt: now,
    },
    {
      key: 'EMAIL_SETUP',
      label: 'Setup de E-mail',
      currentPrice: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
      referencePrice: BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL,
      b2bMaxDiscount: 0,
      couponMaxDiscount: 0,
      combinedMaxDiscount: 0,
      minAllowedPrice: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
      allowAdminOverrideCoupon: true,
      updatedAt: now,
    },
    {
      key: 'CONSULTORIA_30_60',
      label: 'Consultoria 30-60min',
      currentPrice: BUSINESS_RULES.CONSULTATION_PRICE,
      referencePrice: BUSINESS_RULES.CONSULTATION_PRICE,
      b2bMaxDiscount: 0,
      couponMaxDiscount: 0,
      combinedMaxDiscount: 0,
      minAllowedPrice: BUSINESS_RULES.CONSULTATION_PRICE,
      allowAdminOverrideCoupon: true,
      updatedAt: now,
    },
  ]
}

function createDefaultState(): PricingGovernanceState {
  const now = nowIso()
  return {
    version: 1,
    services: defaultServices(),
    changes: [],
    queue: [],
    updatedAt: now,
  }
}

function normalizeState(value: any): PricingGovernanceState {
  const initial = createDefaultState()
  if (!value || typeof value !== 'object') {
    return initial
  }

  const serviceMap = new Map(initial.services.map((s) => [s.key, s]))
  const rawServices = Array.isArray(value.services) ? value.services : []

  for (const raw of rawServices) {
    if (!raw || typeof raw !== 'object' || typeof raw.key !== 'string') {
      continue
    }

    const key = raw.key as ServiceKey
    const existing = serviceMap.get(key)
    if (!existing) continue

    serviceMap.set(key, {
      key,
      label: typeof raw.label === 'string' ? raw.label : existing.label,
      currentPrice: Number(raw.currentPrice ?? existing.currentPrice),
      referencePrice: Number(raw.referencePrice ?? existing.referencePrice),
      b2bMaxDiscount: Number(raw.b2bMaxDiscount ?? existing.b2bMaxDiscount),
      couponMaxDiscount: Number(raw.couponMaxDiscount ?? existing.couponMaxDiscount),
      combinedMaxDiscount: Number(raw.combinedMaxDiscount ?? existing.combinedMaxDiscount),
      minAllowedPrice: Number(raw.minAllowedPrice ?? existing.minAllowedPrice),
      allowAdminOverrideCoupon:
        typeof raw.allowAdminOverrideCoupon === 'boolean'
          ? raw.allowAdminOverrideCoupon
          : existing.allowAdminOverrideCoupon,
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : existing.updatedAt,
    })
  }

  return {
    version: 1,
    services: Array.from(serviceMap.values()),
    changes: Array.isArray(value.changes) ? value.changes : [],
    queue: Array.isArray(value.queue) ? value.queue : [],
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : initial.updatedAt,
  }
}

export async function loadPricingGovernanceState() {
  const setting = await prisma.settings.findUnique({ where: { key: SETTINGS_KEY } })
  if (!setting) {
    const state = createDefaultState()
    await prisma.settings.create({
      data: {
        key: SETTINGS_KEY,
        value: state as any,
        description: 'Governanca de precos, alteracoes com vigencia e fila de notificacao',
      },
    })
    return state
  }

  const normalized = normalizeState(setting.value)
  return normalized
}

export async function savePricingGovernanceState(state: PricingGovernanceState) {
  const payload = { ...state, updatedAt: nowIso() }
  await prisma.settings.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: payload as any, description: 'Governanca de precos, alteracoes com vigencia e fila de notificacao' },
    create: {
      key: SETTINGS_KEY,
      value: payload as any,
      description: 'Governanca de precos, alteracoes com vigencia e fila de notificacao',
    },
  })
  return payload
}

function enqueueChangeNotifications(state: PricingGovernanceState, change: GovernanceChange) {
  const service = state.services.find((item) => item.key === change.serviceKey)
  if (!service) return

  const targets: QueueTargetRole[] = []
  if (change.notifyClients) targets.push('CLIENT')
  if (change.notifyPartners) targets.push('PARTNER')

  for (const targetRole of targets) {
    const alreadyQueued = state.queue.some(
      (item) => item.changeId === change.id && item.targetRole === targetRole && item.status === 'QUEUED'
    )

    if (alreadyQueued) continue

    state.queue.push({
      id: crypto.randomUUID(),
      changeId: change.id,
      targetRole,
      title: `Atualizacao de preco: ${service.label}`,
      message: `Novo valor de R$ ${change.newPrice} com vigencia em ${new Date(change.effectiveAt).toLocaleString('pt-BR')}. Motivo: ${change.reason}`,
      createdAt: nowIso(),
      status: 'QUEUED',
    })
  }
}

export function applyDuePriceChanges(state: PricingGovernanceState) {
  const now = Date.now()
  let changed = false

  for (const change of state.changes) {
    if (change.status !== 'PENDING') continue
    if (new Date(change.effectiveAt).getTime() > now) continue

    const service = state.services.find((item) => item.key === change.serviceKey)
    if (!service) continue

    service.currentPrice = Number(change.newPrice)
    service.minAllowedPrice = Math.min(service.minAllowedPrice, service.currentPrice)
    service.updatedAt = nowIso()
    change.status = 'APPLIED'
    change.appliedAt = nowIso()
    enqueueChangeNotifications(state, change)
    changed = true
  }

  if (changed) {
    state.updatedAt = nowIso()
  }

  return { state, changed }
}

export async function processPricingQueue(state: PricingGovernanceState) {
  let totalNotifications = 0
  let processedItems = 0

  for (const item of state.queue) {
    if (item.status !== 'QUEUED') continue

    const users = await prisma.user.findMany({
      where: { role: item.targetRole },
      select: { id: true },
      take: 5000,
    })

    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          type: 'pricing',
          title: item.title,
          message: item.message,
          read: false,
          actionUrl: '/#pricing',
          metadata: {
            queueId: item.id,
            changeId: item.changeId,
            targetRole: item.targetRole,
          } as any,
        })),
      })
    }

    item.status = 'SENT'
    item.processedAt = nowIso()
    item.recipients = users.length
    totalNotifications += users.length
    processedItems += 1
  }

  if (processedItems > 0) {
    state.updatedAt = nowIso()
  }

  return { state, processedItems, totalNotifications }
}
