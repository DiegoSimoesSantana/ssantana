import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { normalizeReferralCode } from '@/lib/referral-tracking'

const updateSchema = z.object({
  refCode: z.string().min(2),
  status: z.enum(['ACCEPTED', 'REJECTED']),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const refCodeParam = searchParams.get('refCode')
    if (!refCodeParam) {
      return NextResponse.json({ error: 'Informe refCode' }, { status: 400 })
    }

    const refCode = normalizeReferralCode(refCodeParam)
    const partner = await prisma.partner.findFirst({
      where: { referralCode: refCode },
      include: {
        user: true,
      },
    })

    if (!partner) {
      return NextResponse.json({ error: 'Parceiro nao encontrado' }, { status: 404 })
    }

    const activeContract = await prisma.partnerContractTerm.findFirst({
      where: { isActive: true },
      orderBy: [{ startsAt: 'desc' }, { createdAt: 'desc' }],
    })

    const acceptance = activeContract
      ? await prisma.partnerContractAcceptance.findFirst({
          where: {
            partnerId: partner.id,
            contractId: activeContract.id,
          },
        })
      : null

    return NextResponse.json({
      partner: {
        id: partner.id,
        name: partner.user.name,
        referralCode: partner.referralCode,
        isActive: partner.isActive,
      },
      activeContract,
      acceptance,
      hasPendingContract: !!activeContract && !acceptance,
    })
  } catch (error) {
    console.error('Erro ao buscar contrato de parceiro:', error)
    return NextResponse.json({ error: 'Erro ao buscar contrato' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = updateSchema.parse(body)
    const refCode = normalizeReferralCode(data.refCode)

    const partner = await prisma.partner.findFirst({
      where: { referralCode: refCode },
      include: { user: true },
    })

    if (!partner) {
      return NextResponse.json({ error: 'Parceiro nao encontrado' }, { status: 404 })
    }

    const activeContract = await prisma.partnerContractTerm.findFirst({
      where: { isActive: true },
      orderBy: [{ startsAt: 'desc' }, { createdAt: 'desc' }],
    })

    if (!activeContract) {
      return NextResponse.json({ error: 'Nao existe contrato ativo' }, { status: 400 })
    }

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null

    const acceptance = await prisma.partnerContractAcceptance.upsert({
      where: {
        partnerId_contractId: {
          partnerId: partner.id,
          contractId: activeContract.id,
        },
      },
      update: {
        status: data.status,
        acceptedAt: new Date(),
        ipAddress,
      },
      create: {
        partnerId: partner.id,
        contractId: activeContract.id,
        status: data.status,
        acceptedAt: new Date(),
        ipAddress,
      },
    })

    if (data.status === 'REJECTED') {
      await prisma.partner.update({
        where: { id: partner.id },
        data: { isActive: false },
      })
    } else if (!partner.isActive) {
      await prisma.partner.update({
        where: { id: partner.id },
        data: { isActive: true },
      })
    }

    return NextResponse.json({ success: true, acceptance })
  } catch (error) {
    console.error('Erro ao registrar aceite de contrato:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados invalidos', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar contrato' }, { status: 500 })
  }
}
