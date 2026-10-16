import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referenceId, authorizationId } = body

    if (!referenceId) {
      return NextResponse.json({ error: 'referenceId é obrigatório' }, { status: 400 })
    }

    console.log(`[PicPay Webhook] Recebido status para ref: ${referenceId}, authId: ${authorizationId}`)

    // Consulta status real na API do PicPay para certificar segurança
    const statusData = await picpay.getPaymentStatus(referenceId)
    const isPaid = statusData.status === 'completed' || statusData.status === 'paid'

    if (!isPaid) {
      return NextResponse.json({ message: `Status recebido: ${statusData.status}` }, { status: 200 })
    }

    // Localizar contrato ou pagamento pelo contractNumber / referenceId
    const contract = await prisma.contract.findFirst({
      where: {
        OR: [
          { contractNumber: referenceId },
          { id: referenceId },
        ],
      },
      include: {
        project: {
          include: {
            lead: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    })

    if (!contract) {
      console.warn(`[PicPay Webhook] Contrato não encontrado para referenceId: ${referenceId}`)
      return NextResponse.json({ message: 'Contrato não encontrado, registrado em log' }, { status: 200 })
    }

    // Criar ou atualizar registro de pagamento
    const payment = await prisma.payment.create({
      data: {
        contractId: contract.id,
        projectId: contract.projectId,
        clientId: contract.clientId,
        amount: contract.totalValue,
        installment: 1,
        totalInstallments: contract.installments || 1,
        method: 'picpay',
        provider: 'picpay',
        externalId: authorizationId || `picpay-${referenceId}`,
        status: 'COMPLETED',
        paidAt: new Date(),
        projectReleased: true,
        releasedAt: new Date(),
      },
    })

    // Atualiza status do projeto para IN_PROGRESS
    await prisma.project.update({
      where: { id: contract.projectId },
      data: {
        status: 'IN_PROGRESS',
        startDate: new Date(),
      },
    })

    // Se houver parceiro vinculado via Lead/Referral, calcular e lançar a comissão em retenção de 30 dias
    const partner = contract.project?.lead?.partner
    if (partner) {
      const now = new Date()
      const releaseDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const commissionRate = partner.commissionRate || (partner.nivelParceiro === 'COMERCIAL_TREINADO' ? 0.20 : 0.15)
      const commissionAmount = Number((contract.totalValue * commissionRate).toFixed(2))

      await prisma.commission.create({
        data: {
          paymentId: payment.id,
          partnerId: partner.id,
          projectId: contract.projectId,
          clientId: contract.clientId,
          serviceName: contract.project?.title || 'Contrato PicPay',
          grossAmount: contract.totalValue,
          paymentDate: now,
          releaseDate,
          amount: commissionAmount,
          rate: commissionRate,
          status: 'EM_RETENCAO_30_DIAS',
          notes: `Comissão gerada automaticamente via Webhook PicPay ref: ${referenceId}`,
        },
      })

      // Atualiza o pendingBalance do parceiro
      await prisma.partner.update({
        where: { id: partner.id },
        data: {
          pendingBalance: { increment: commissionAmount },
          totalEarned: { increment: commissionAmount },
        },
      })
    }

    return NextResponse.json({ success: true, referenceId, status: 'PAID' })
  } catch (error) {
    console.error('[PicPay Webhook Error]', error)
    return NextResponse.json({ error: 'Erro ao processar webhook PicPay' }, { status: 500 })
  }
}
