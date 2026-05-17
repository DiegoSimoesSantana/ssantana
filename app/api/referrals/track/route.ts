import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  buildReferralCookieValue,
  normalizeReferralCode,
  REFERRAL_COOKIE_KEY,
  REFERRAL_TTL_DAYS,
} from '@/lib/referral-tracking'

const trackingSchema = z.object({
  refCode: z.string().min(2),
  visitorKey: z.string().min(8),
  sessionKey: z.string().min(8),
  landingPath: z.string().optional(),
  source: z.enum(['query', 'stored']),
})

function getEventKey(params: {
  eventType: 'NEW_ACCESS' | 'RETURN'
  refCode: string
  visitorKey: string
  sessionKey: string
}) {
  if (params.eventType === 'NEW_ACCESS') {
    return `${params.refCode}:${params.visitorKey}:NEW_ACCESS`
  }

  return `${params.refCode}:${params.visitorKey}:${params.sessionKey}:RETURN`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = trackingSchema.parse(body)
    const refCode = normalizeReferralCode(validatedData.refCode)
    const eventType = validatedData.source === 'query' ? 'NEW_ACCESS' : 'RETURN'
    const eventKey = getEventKey({
      eventType,
      refCode,
      visitorKey: validatedData.visitorKey,
      sessionKey: validatedData.sessionKey,
    })

    let partner:
      | {
          id: string
          companyName: string | null
          user: { name: string }
        }
      | null = null
    let serverTracked = false

    try {
      partner = await prisma.partner.findFirst({
        where: { referralCode: refCode },
        include: { user: true },
      })

      await prisma.referralTrackingEvent.upsert({
        where: { eventKey },
        update: {
          landingPath: validatedData.landingPath,
          partnerId: partner?.id,
          partnerName: partner?.companyName || partner?.user.name,
        },
        create: {
          eventKey,
          eventType,
          referralCode: refCode,
          visitorKey: validatedData.visitorKey,
          sessionKey: validatedData.sessionKey,
          landingPath: validatedData.landingPath,
          partnerId: partner?.id,
          partnerName: partner?.companyName || partner?.user.name,
        },
      })

      serverTracked = true
    } catch (dbError) {
      console.warn('Tracking persistido apenas no navegador; banco indisponível:', dbError)
    }

    const now = new Date().toISOString()
    const attribution = {
      partnerId: partner?.id ?? null,
      partnerName: partner?.companyName || partner?.user.name || null,
      referralCode: refCode,
      capturedAt: now,
      updatedAt: now,
      lastLandingPath: validatedData.landingPath ?? null,
    }

    const response = NextResponse.json({
      success: true,
      attribution,
      serverTracked,
    })

    response.cookies.set(REFERRAL_COOKIE_KEY, buildReferralCookieValue(attribution), {
      path: '/',
      maxAge: REFERRAL_TTL_DAYS * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false,
    })

    return response
  } catch (error) {
    console.error('Erro ao registrar tracking de indicação:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Erro ao registrar tracking' },
      { status: 500 },
    )
  }
}
