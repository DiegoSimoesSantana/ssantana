import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'

export async function GET(
  request: NextRequest,
  { params }: { params: { referenceId: string } }
) {
  try {
    const referenceId = params.referenceId

    if (!referenceId) {
      return NextResponse.json({ error: 'referenceId é obrigatório' }, { status: 400 })
    }

    // 1. Verificar no banco de dados se já foi marcado como COMPLETED
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { externalId: referenceId },
          { contract: { contractNumber: referenceId } },
        ],
      },
      include: {
        contract: true,
      },
    })

    if (payment && payment.status === 'COMPLETED') {
      return NextResponse.json({
        paid: true,
        status: 'PAID',
        referenceId,
        paymentId: payment.id,
      })
    }

    // 2. Se ainda estiver pendente no banco, checar diretamente na API do PicPay
    const picpayStatus = await picpay.getPaymentStatus(referenceId)
    const isPaid = picpayStatus.status === 'completed' || picpayStatus.status === 'paid'

    if (isPaid && payment) {
      // Atualiza o banco caso o webhook ainda não tenha chegado
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
          projectReleased: true,
          releasedAt: new Date(),
        },
      })

      if (payment.projectId) {
        await prisma.project.update({
          where: { id: payment.projectId },
          data: {
            status: 'IN_PROGRESS',
            startDate: new Date(),
          },
        })
      }

      if (payment.contractId) {
        await prisma.contract.update({
          where: { id: payment.contractId },
          data: {
            status: 'SIGNED',
            signedAt: new Date(),
          },
        })
      }

      return NextResponse.json({
        paid: true,
        status: 'PAID',
        referenceId,
        paymentId: payment.id,
      })
    }

    return NextResponse.json({
      paid: false,
      status: payment?.status || picpayStatus.status || 'PENDING',
      referenceId,
    })
  } catch (error: any) {
    console.error('[Payment Status Polling Error]', error)
    return NextResponse.json({ error: 'Erro ao consultar status' }, { status: 500 })
  }
}
