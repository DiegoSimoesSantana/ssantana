import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import {
  applyDuePriceChanges,
  loadPricingGovernanceState,
  processPricingQueue,
  savePricingGovernanceState,
  type GovernanceChange,
} from '@/lib/pricing-governance'

function ensureAuthorized(session: Awaited<ReturnType<typeof getAdminSession>>) {
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }
  return null
}

export async function GET() {
  const admin = await getAdminSession()
  const unauthorized = ensureAuthorized(admin)
  if (unauthorized) return unauthorized

  let state = await loadPricingGovernanceState()
  const { changed } = applyDuePriceChanges(state)
  if (changed) {
    state = await savePricingGovernanceState(state)
  }

  return NextResponse.json(state)
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession()
  const unauthorized = ensureAuthorized(admin)
  if (unauthorized) return unauthorized

  const body = (await request.json()) as {
    serviceKey?: string
    newPrice?: number
    effectiveAt?: string
    reason?: string
    notifyClients?: boolean
    notifyPartners?: boolean
  }

  const reason = (body.reason || '').trim()
  if (!reason || reason.length < 8) {
    return NextResponse.json({ error: 'Motivo obrigatorio com no minimo 8 caracteres' }, { status: 400 })
  }

  const effectiveAt = body.effectiveAt ? new Date(body.effectiveAt) : null
  if (!effectiveAt || Number.isNaN(effectiveAt.getTime())) {
    return NextResponse.json({ error: 'Data de vigencia invalida' }, { status: 400 })
  }

  const newPrice = Number(body.newPrice)
  if (!Number.isFinite(newPrice) || newPrice <= 0) {
    return NextResponse.json({ error: 'Novo preco deve ser maior que zero' }, { status: 400 })
  }

  let state = await loadPricingGovernanceState()
  const service = state.services.find((item) => item.key === body.serviceKey)
  if (!service) {
    return NextResponse.json({ error: 'Servico invalido' }, { status: 400 })
  }

  const lockedFloor = Number(service.minAllowedPrice ?? service.currentPrice)
  if (newPrice < lockedFloor) {
    return NextResponse.json(
      { error: 'Novo preco nao pode ficar abaixo do piso travado do servico' },
      { status: 400 },
    )
  }

  const change: GovernanceChange = {
    id: crypto.randomUUID(),
    serviceKey: service.key,
    newPrice,
    effectiveAt: effectiveAt.toISOString(),
    reason,
    notifyClients: !!body.notifyClients,
    notifyPartners: !!body.notifyPartners,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    createdBy: admin?.email || 'admin',
  }

  state.changes.unshift(change)
  applyDuePriceChanges(state)
  state = await savePricingGovernanceState(state)

  return NextResponse.json({ success: true, change, state })
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminSession()
  const unauthorized = ensureAuthorized(admin)
  if (unauthorized) return unauthorized

  const body = (await request.json()) as {
    action?: 'cancel' | 'apply_now' | 'process_queue' | 'update_policy'
    changeId?: string
    serviceKey?: GovernanceChange['serviceKey']
    b2bMaxDiscount?: number
    couponMaxDiscount?: number
    combinedMaxDiscount?: number
    minAllowedPrice?: number
    allowAdminOverrideCoupon?: boolean
  }

  let state = await loadPricingGovernanceState()

  if (body.action === 'update_policy') {
    const service = state.services.find((item) => item.key === body.serviceKey)
    if (!service) {
      return NextResponse.json({ error: 'Servico invalido' }, { status: 400 })
    }

    const b2bMaxDiscount = Number(body.b2bMaxDiscount ?? service.b2bMaxDiscount)
    const couponMaxDiscount = Number(body.couponMaxDiscount ?? service.couponMaxDiscount)
    const combinedMaxDiscount = Number(body.combinedMaxDiscount ?? service.combinedMaxDiscount)
    const minAllowedPrice = Number(body.minAllowedPrice ?? service.minAllowedPrice)

    if (
      !Number.isFinite(b2bMaxDiscount) ||
      !Number.isFinite(couponMaxDiscount) ||
      !Number.isFinite(combinedMaxDiscount) ||
      !Number.isFinite(minAllowedPrice)
    ) {
      return NextResponse.json({ error: 'Valores da politica de desconto invalidos' }, { status: 400 })
    }

    if (b2bMaxDiscount < 0 || couponMaxDiscount < 0 || combinedMaxDiscount < 0) {
      return NextResponse.json({ error: 'Descontos maximos nao podem ser negativos' }, { status: 400 })
    }

    if (combinedMaxDiscount > b2bMaxDiscount + couponMaxDiscount) {
      return NextResponse.json({ error: 'Desconto combinado nao pode ultrapassar a soma de B2B + cupom' }, { status: 400 })
    }

    if (minAllowedPrice <= 0 || minAllowedPrice > service.currentPrice) {
      return NextResponse.json({ error: 'Piso minimo deve ser maior que zero e menor/igual ao preco atual' }, { status: 400 })
    }

    service.b2bMaxDiscount = b2bMaxDiscount
    service.couponMaxDiscount = couponMaxDiscount
    service.combinedMaxDiscount = combinedMaxDiscount
    service.minAllowedPrice = minAllowedPrice
    service.allowAdminOverrideCoupon =
      typeof body.allowAdminOverrideCoupon === 'boolean'
        ? body.allowAdminOverrideCoupon
        : service.allowAdminOverrideCoupon
    service.updatedAt = new Date().toISOString()
    state.updatedAt = new Date().toISOString()

    state = await savePricingGovernanceState(state)
    return NextResponse.json({ success: true, state })
  }

  if (body.action === 'process_queue') {
    const result = await processPricingQueue(state)
    state = await savePricingGovernanceState(result.state)
    return NextResponse.json({
      success: true,
      processedItems: result.processedItems,
      totalNotifications: result.totalNotifications,
      state,
    })
  }

  const change = state.changes.find((item) => item.id === body.changeId)
  if (!change) {
    return NextResponse.json({ error: 'Alteracao nao encontrada' }, { status: 404 })
  }

  if (body.action === 'cancel') {
    if (change.status === 'APPLIED') {
      return NextResponse.json({ error: 'Alteracao ja aplicada nao pode ser cancelada' }, { status: 400 })
    }
    change.status = 'CANCELLED'
    state = await savePricingGovernanceState(state)
    return NextResponse.json({ success: true, state })
  }

  if (body.action === 'apply_now') {
    if (change.status !== 'PENDING') {
      return NextResponse.json({ error: 'Somente alteracoes pendentes podem ser aplicadas agora' }, { status: 400 })
    }
    change.effectiveAt = new Date().toISOString()
    applyDuePriceChanges(state)
    state = await savePricingGovernanceState(state)
    return NextResponse.json({ success: true, state })
  }

  return NextResponse.json({ error: 'Acao invalida' }, { status: 400 })
}
