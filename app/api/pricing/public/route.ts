import { NextResponse } from 'next/server'
import {
  applyDuePriceChanges,
  loadPricingGovernanceState,
  savePricingGovernanceState,
} from '@/lib/pricing-governance'

export const dynamic = 'force-dynamic'

export async function GET() {
  let state = await loadPricingGovernanceState()
  const { changed } = applyDuePriceChanges(state)
  if (changed) {
    state = await savePricingGovernanceState(state)
  }

  return NextResponse.json({
    updatedAt: state.updatedAt,
    services: state.services,
  })
}
