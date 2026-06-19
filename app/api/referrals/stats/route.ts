import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { normalizeReferralCode } from '@/lib/referral-tracking'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const refCodeParam = searchParams.get('refCode')
    const partnerId = searchParams.get('partnerId')

    if (!refCodeParam && !partnerId) {
      return NextResponse.json(
        { error: 'Informe refCode ou partnerId' },
        { status: 400 },
      )
    }

    const where = partnerId
      ? { partnerId }
      : { referralCode: normalizeReferralCode(refCodeParam as string) }

    const [newProspects, returnVisits, lastEvent] = await Promise.all([
      prisma.referralTrackingEvent.count({
        where: {
          ...where,
          eventType: 'NEW_ACCESS',
        },
      }),
      prisma.referralTrackingEvent.count({
        where: {
          ...where,
          eventType: 'RETURN',
        },
      }),
      prisma.referralTrackingEvent.findFirst({
        where,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return NextResponse.json({
      newProspects,
      returnVisits,
      totalTrackedEvents: newProspects + returnVisits,
      lastTrackedAt: lastEvent?.createdAt ?? null,
    })
  } catch (error) {
    console.error('Erro ao buscar métricas de indicação:', error)
    return NextResponse.json({
      newProspects: 0,
      returnVisits: 0,
      totalTrackedEvents: 0,
      lastTrackedAt: null,
      unavailable: true,
    })
  }
}
