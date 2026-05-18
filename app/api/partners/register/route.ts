import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const registerPartnerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  companyName: z.string().optional(),
  personType: z.enum(['PF', 'PJ']),
  document: z.string().min(11),
  cpfResponsible: z.string().optional(),
  birthDate: z.string().min(8),
  pixKey: z.string().min(3),
  acceptTerms: z.literal(true),
}).superRefine((data, ctx) => {
  if (data.personType === 'PJ' && !data.cpfResponsible) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cpfResponsible'],
      message: 'CPF do responsável é obrigatório para PJ',
    })
  }
})

function toCodeSeed(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 8)
}

function randomSuffix() {
  return Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
}

async function generateUniqueReferralCode(name: string) {
  const base = toCodeSeed(name) || 'PARCEIRO'

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `${base}${randomSuffix()}`
    const exists = await prisma.partner.findFirst({
      where: { referralCode: candidate },
      select: { id: true },
    })

    if (!exists) {
      return candidate
    }
  }

  return `${base}${Date.now().toString().slice(-4)}`
}

function getOrigin(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerPartnerSchema.parse(body)
    const origin = getOrigin(request)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: { partnerProfile: true },
    })

    if (existingUser?.partnerProfile?.referralCode) {
      const existingCode = existingUser.partnerProfile.referralCode

      await prisma.partner.update({
        where: { id: existingUser.partnerProfile.id },
        data: {
          companyName: data.companyName,
          personType: data.personType,
          document: data.document,
          cpfResponsible: data.cpfResponsible,
          birthDate: new Date(data.birthDate),
          pixKey: data.pixKey,
          cpfCnpj: data.document,
          isActive: true,
        },
      })

      const activeContract = await prisma.partnerContractTerm.findFirst({
        where: { isActive: true },
        orderBy: [{ startsAt: 'desc' }, { createdAt: 'desc' }],
      })

      if (activeContract) {
        const ipAddress =
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          request.headers.get('x-real-ip') ||
          null

        await prisma.partnerContractAcceptance.upsert({
          where: {
            partnerId_contractId: {
              partnerId: existingUser.partnerProfile.id,
              contractId: activeContract.id,
            },
          },
          update: {
            status: 'ACCEPTED',
            acceptedAt: new Date(),
            ipAddress,
          },
          create: {
            partnerId: existingUser.partnerProfile.id,
            contractId: activeContract.id,
            status: 'ACCEPTED',
            acceptedAt: new Date(),
            ipAddress,
          },
        })
      }

      return NextResponse.json({
        success: true,
        alreadyExists: true,
        partner: {
          id: existingUser.partnerProfile.id,
          userId: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          referralCode: existingCode,
          referralUrl: `${origin}/?ref=${existingCode}`,
        },
      })
    }

    const referralCode = await generateUniqueReferralCode(data.name)

    let userId = existingUser?.id

    if (!userId) {
      const createdUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone,
          role: 'PARTNER',
        },
      })
      userId = createdUser.id
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          phone: data.phone,
          role: 'PARTNER',
        },
      })
    }

    const partner = await prisma.partner.create({
      data: {
        userId,
        companyName: data.companyName,
        personType: data.personType,
        document: data.document,
        cpfResponsible: data.cpfResponsible,
        birthDate: new Date(data.birthDate),
        pixKey: data.pixKey,
        cpfCnpj: data.document,
        referralCode,
      },
    })

    const activeContract = await prisma.partnerContractTerm.findFirst({
      where: { isActive: true },
      orderBy: [{ startsAt: 'desc' }, { createdAt: 'desc' }],
    })

    if (activeContract) {
      const ipAddress =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        null

      await prisma.partnerContractAcceptance.create({
        data: {
          partnerId: partner.id,
          contractId: activeContract.id,
          status: 'ACCEPTED',
          acceptedAt: new Date(),
          ipAddress,
        },
      })
    }

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      partner: {
        id: partner.id,
        userId,
        name: data.name,
        email: data.email.toLowerCase(),
        referralCode,
        referralUrl: `${origin}/?ref=${referralCode}`,
      },
    })
  } catch (error) {
    console.error('Erro ao cadastrar parceiro:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Falha ao cadastrar parceiro' },
      { status: 500 },
    )
  }
}
