import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { parseReferralCookieValue, REFERRAL_COOKIE_KEY } from '@/lib/referral-tracking'

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  serviceType: z.string().optional(),
  message: z.string().optional(),
  company: z.string().optional(),
  budget: z.number().optional(),
  source: z.string().default('website'),
  partnerId: z.string().optional(),
  diagnosticData: z.any().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)
    const referralCookie = request.cookies.get(REFERRAL_COOKIE_KEY)?.value
    const referralAttribution = parseReferralCookieValue(referralCookie)

    let partnerId = validatedData.partnerId
    let source = validatedData.source
    let notes = undefined as Prisma.InputJsonValue | undefined

    if (referralAttribution?.referralCode) {
      partnerId = partnerId || referralAttribution.partnerId || undefined
      source = partnerId ? 'partner' : source
      notes = {
        referralAttribution: {
          referralCode: referralAttribution.referralCode,
          partnerId: referralAttribution.partnerId ?? null,
          partnerName: referralAttribution.partnerName ?? null,
          partnerDiscountRate: referralAttribution.partnerDiscountRate ?? null,
          capturedAt: referralAttribution.capturedAt,
          updatedAt: referralAttribution.updatedAt,
          lastLandingPath: referralAttribution.lastLandingPath ?? null,
        },
      }
    }

    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        serviceType: validatedData.serviceType || 'other',
        message: validatedData.message,
        company: validatedData.company,
        budget: validatedData.budget,
        source,
        partnerId,
        diagnosticData: validatedData.diagnosticData,
        notes,
        status: 'new',
      },
    })

    // TODO: Enviar notificação por email (Resend)
    // TODO: Enviar mensagem para WhatsApp (opcional)
    // TODO: Criar notificação no sistema para admin

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar lead:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const partnerId = searchParams.get('partnerId')

    const where: any = {}
    if (status) where.status = status
    if (partnerId) where.partnerId = partnerId

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar leads' },
      { status: 500 }
    )
  }
}
