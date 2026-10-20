import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { referenceId: string } }
) {
  try {
    const referenceId = params.referenceId

    if (!referenceId) {
      return NextResponse.json({ error: 'referenceId é obrigatório' }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams
    const simulatePaid = searchParams.get('simulate') === 'true'

    // ==========================================
    // 1. CASO SEJA UMA DOAÇÃO (DOA-XXXXX)
    // ==========================================
    if (referenceId.startsWith('DOA-')) {
      const donation = await prisma.donation.findFirst({
        where: {
          OR: [
            { referenceId },
            { paymentLinkId: referenceId },
          ],
        },
      })

      if (donation) {
        if (donation.status === 'PAID') {
          return NextResponse.json({
            paid: true,
            status: 'PAID',
            type: 'DONATION',
            referenceId,
            amount: donation.amount,
            paidAt: donation.paidAt,
            message: 'Doação confirmada com sucesso! Muito obrigado pelo apoio aos projetos gratuitos.',
          })
        }

        let isPaid = simulatePaid
        if (!isPaid) {
          const picpayStatus = await picpay.getPaymentStatus(donation.referenceId, donation.paymentLinkId)
          isPaid = picpayStatus.status === 'completed' || picpayStatus.status === 'paid'
        }

        if (isPaid) {
          const updatedDonation = await prisma.donation.update({
            where: { id: donation.id },
            data: {
              status: 'PAID',
              paidAt: new Date(),
            },
          })

          return NextResponse.json({
            paid: true,
            status: 'PAID',
            type: 'DONATION',
            referenceId,
            amount: updatedDonation.amount,
            paidAt: updatedDonation.paidAt,
            message: 'Doação confirmada com sucesso! Muito obrigado pelo apoio aos projetos gratuitos.',
          })
        }

        return NextResponse.json({
          paid: false,
          status: 'PENDING',
          type: 'DONATION',
          referenceId,
          amount: donation.amount,
        })
      }
    }

    // ==========================================
    // 2. CASO SEJA UM AGENDAMENTO DE REUNIÃO TÉCNICA
    // ==========================================
    const schedule = await prisma.meetingSchedule.findFirst({
      where: {
        OR: [
          { paymentLinkId: referenceId },
          { id: referenceId },
        ],
      },
    })

    if (schedule) {
      if (['VALID', 'CONFIRMED', 'PAID_IN_MEETING', 'COMPLETED'].includes(schedule.status)) {
        return NextResponse.json({
          paid: true,
          status: 'PAID',
          type: 'SCHEDULE',
          referenceId,
          scheduleId: schedule.id,
        })
      }

      let isPaid = simulatePaid
      if (!isPaid) {
        const picpayStatus = await picpay.getPaymentStatus(referenceId, schedule.paymentLinkId)
        isPaid = picpayStatus.status === 'completed' || picpayStatus.status === 'paid'
      }

      if (isPaid) {
        await prisma.meetingSchedule.update({
          where: { id: schedule.id },
          data: {
            status: 'CONFIRMED',
            paidAt: new Date(),
          },
        })

        return NextResponse.json({
          paid: true,
          status: 'PAID',
          type: 'SCHEDULE',
          referenceId,
          scheduleId: schedule.id,
        })
      }
    }

    // ==========================================
    // 3. CONTRATO, PROJETO OU PAGAMENTO GERAL
    // ==========================================
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
        type: 'PAYMENT',
        referenceId,
        paymentId: payment.id,
      })
    }

    const creds = await picpay.getCredentials()
    const isMock = !creds.clientSecret

    let isPaid = false
    let picpayStatus: { status: string; authorizationId?: string } = { status: 'pending' }

    if (simulatePaid) {
      isPaid = true
      picpayStatus = { status: 'completed', authorizationId: `simulated-${Date.now()}` }
    } else {
      picpayStatus = await picpay.getPaymentStatus(referenceId, payment?.externalId)
      isPaid = picpayStatus.status === 'completed' || picpayStatus.status === 'paid'
    }

    if (isPaid && payment) {
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
        type: 'PAYMENT',
        referenceId,
        paymentId: payment.id,
      })
    }

    return NextResponse.json({
      paid: false,
      status: payment?.status || picpayStatus.status || 'PENDING',
      referenceId,
      isMock,
    })
  } catch (error: any) {
    console.error('[Payment Status Polling Error]', error)
    return NextResponse.json({ error: 'Erro ao consultar status' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { referenceId: string } }
) {
  try {
    const referenceId = params.referenceId
    if (!referenceId) {
      return NextResponse.json({ error: 'referenceId é obrigatório' }, { status: 400 })
    }

    // Se for doação, marca como PAID
    if (referenceId.startsWith('DOA-')) {
      const donation = await prisma.donation.findFirst({
        where: {
          OR: [
            { referenceId },
            { paymentLinkId: referenceId },
          ],
        },
      })

      if (donation) {
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        })
        return NextResponse.json({
          paid: true,
          status: 'PAID',
          type: 'DONATION',
          referenceId,
          message: 'Doação validada com sucesso.',
        })
      }
    }

    // Se for agendamento
    const schedule = await prisma.meetingSchedule.findFirst({
      where: {
        OR: [
          { paymentLinkId: referenceId },
          { id: referenceId },
        ],
      },
    })

    if (schedule) {
      await prisma.meetingSchedule.update({
        where: { id: schedule.id },
        data: {
          status: 'CONFIRMED',
          paidAt: new Date(),
        },
      })
      return NextResponse.json({
        paid: true,
        status: 'PAID',
        type: 'SCHEDULE',
        referenceId,
        message: 'Agendamento validado com sucesso.',
      })
    }

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { externalId: referenceId },
          { contract: { contractNumber: referenceId } },
        ],
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Pagamento não localizado' }, { status: 404 })
    }

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
      message: 'Pagamento validado com sucesso.',
    })
  } catch (error: any) {
    console.error('[Payment Manual Confirm Error]', error)
    return NextResponse.json({ error: 'Erro ao confirmar pagamento' }, { status: 500 })
  }
}
