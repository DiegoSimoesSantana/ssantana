import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { parseAccountSessionToken, ACCOUNT_COOKIE_NAME } from '@/lib/account-auth'
import {
  getPartnerReferralConfig,
  MAX_PARTNER_COMMISSION_RATE,
  MIN_PARTNER_COMMISSION_RATE,
  mergePartnerReferralConfig,
} from '@/lib/partner-referral-config'

const updateSettingsSchema = z.object({
  autoDiscountRate: z.number().min(0).max(1),
})

async function getPartnerBySession(request: NextRequest) {
  const token = request.cookies.get(ACCOUNT_COOKIE_NAME)?.value
  const session = parseAccountSessionToken(token)

  if (!session?.email || session.selectedRole !== 'PARTNER') {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
    include: { partnerProfile: true },
  })

  return user?.partnerProfile ?? null
}

export async function GET(request: NextRequest) {
  try {
    const partner = await getPartnerBySession(request)
    if (!partner) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 })
    }

    const config = getPartnerReferralConfig(partner.bankAccount)
    const commissionRate = Math.min(
      Math.max(partner.commissionRate || MAX_PARTNER_COMMISSION_RATE, MIN_PARTNER_COMMISSION_RATE),
      MAX_PARTNER_COMMISSION_RATE,
    )

    return NextResponse.json({
      success: true,
      settings: {
        commissionRate,
        autoDiscountRate: config.autoDiscountRate ?? 0,
        minPartnerNetRate: MIN_PARTNER_COMMISSION_RATE,
        maxAllowedDiscountRate: Math.max(0, commissionRate - MIN_PARTNER_COMMISSION_RATE),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar configuracoes de indicacao:', error)
    return NextResponse.json({ error: 'Falha ao buscar configuracoes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const partner = await getPartnerBySession(request)
    if (!partner) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 })
    }

    const body = await request.json()
    const data = updateSettingsSchema.parse(body)

    const commissionRate = Math.min(
      Math.max(partner.commissionRate || MAX_PARTNER_COMMISSION_RATE, MIN_PARTNER_COMMISSION_RATE),
      MAX_PARTNER_COMMISSION_RATE,
    )

    const maxAllowedDiscountRate = Math.max(0, commissionRate - MIN_PARTNER_COMMISSION_RATE)

    if (data.autoDiscountRate > maxAllowedDiscountRate) {
      return NextResponse.json(
        {
          error: 'Desconto acima do permitido para manter repasse minimo de 10%',
          maxAllowedDiscountRate,
        },
        { status: 400 },
      )
    }

    const updatedPartner = await prisma.partner.update({
      where: { id: partner.id },
      data: {
        commissionRate,
        bankAccount: mergePartnerReferralConfig(partner.bankAccount, {
          autoDiscountRate: data.autoDiscountRate,
        }),
      },
    })

    const config = getPartnerReferralConfig(updatedPartner.bankAccount)

    return NextResponse.json({
      success: true,
      settings: {
        commissionRate,
        autoDiscountRate: config.autoDiscountRate ?? 0,
        minPartnerNetRate: MIN_PARTNER_COMMISSION_RATE,
        maxAllowedDiscountRate,
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar configuracoes de indicacao:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados invalidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Falha ao atualizar configuracoes' }, { status: 500 })
  }
}
