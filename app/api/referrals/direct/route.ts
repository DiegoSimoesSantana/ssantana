import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { ACCOUNT_COOKIE_NAME, parseAccountSessionToken } from '@/lib/account-auth'
import {
  getPartnerReferralConfig,
  MAX_PARTNER_COMMISSION_RATE,
  MIN_PARTNER_COMMISSION_RATE,
} from '@/lib/partner-referral-config'
import { buildReferralLandingUrl } from '@/lib/referral-tracking'
import { sendDirectIndicationEmail } from '@/lib/partner-email'

const directReferralSchema = z
  .object({
    personType: z.enum(['PF', 'PJ']),
    leadName: z.string().min(2),
    companyName: z.string().optional(),
    responsibleName: z.string().optional(),
    cpfCnpj: z.string().min(11),
    email: z.string().email(),
    phone: z.string().min(10),
    serviceType: z.string().optional(),
    message: z.string().optional(),
    directDiscountRate: z.number().min(0).max(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.personType === 'PJ' && !data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['companyName'],
        message: 'Nome da empresa é obrigatório para PJ',
      })
    }

    if (data.personType === 'PJ' && !data.responsibleName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['responsibleName'],
        message: 'Nome do responsável é obrigatório para PJ',
      })
    }
  })

function getOrigin(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

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

  if (!user?.partnerProfile) {
    return null
  }

  return {
    user,
    partner: user.partnerProfile,
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getPartnerBySession(request)
    if (!auth) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 })
    }

    const body = await request.json()
    const data = directReferralSchema.parse(body)

    const commissionRate = Math.min(
      Math.max(auth.partner.commissionRate || MAX_PARTNER_COMMISSION_RATE, MIN_PARTNER_COMMISSION_RATE),
      MAX_PARTNER_COMMISSION_RATE,
    )

    const configuredRate = getPartnerReferralConfig(auth.partner.bankAccount).autoDiscountRate ?? 0
    const requestedRate = typeof data.directDiscountRate === 'number' ? data.directDiscountRate : configuredRate
    const maxAllowedDiscountRate = Math.max(0, commissionRate - MIN_PARTNER_COMMISSION_RATE)
    const appliedDiscountRate = Math.min(Math.max(requestedRate, 0), maxAllowedDiscountRate)

    const referralCode = auth.partner.referralCode || `PARC-${auth.partner.id.slice(0, 6).toUpperCase()}`
    const referralUrl = buildReferralLandingUrl(getOrigin(request), referralCode, appliedDiscountRate)

    const lead = await prisma.lead.create({
      data: {
        name: data.personType === 'PJ' ? data.companyName || data.leadName : data.leadName,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType || 'partner-direct',
        message: data.message,
        company: data.personType === 'PJ' ? data.companyName : undefined,
        source: 'partner-direct',
        partnerId: auth.partner.id,
        status: 'new',
        notes: {
          directReferral: {
            personType: data.personType,
            leadName: data.leadName,
            companyName: data.companyName ?? null,
            responsibleName: data.responsibleName ?? null,
            cpfCnpj: data.cpfCnpj,
            appliedDiscountRate,
            referralCode,
            referralUrl,
            partnerNetRate: Number((commissionRate - appliedDiscountRate).toFixed(4)),
          },
        },
      },
    })

    await prisma.referral.create({
      data: {
        partnerId: auth.partner.id,
        leadId: lead.id,
      },
    })

    const emailResult = await sendDirectIndicationEmail({
      toEmail: data.email,
      leadName: data.leadName,
      partnerName: auth.user.name || 'Parceiro SSANTANA',
      referralLink: referralUrl,
      referralCode,
      discountRate: appliedDiscountRate,
      whatsappNumber: process.env.BUSINESS_PHONE || null,
    })

    return NextResponse.json({
      success: true,
      lead,
      referralUrl,
      appliedDiscountRate,
      partnerNetRate: Number((commissionRate - appliedDiscountRate).toFixed(4)),
      email: emailResult,
    })
  } catch (error) {
    console.error('Erro ao criar indicacao direta:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados invalidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Falha ao criar indicacao direta' }, { status: 500 })
  }
}
