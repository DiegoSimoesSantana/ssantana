import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'

export async function GET(request: NextRequest) {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    const stats = {
      totalCount: donations.length,
      paidCount: donations.filter((d) => d.status === 'PAID').length,
      paidTotal: donations
        .filter((d) => d.status === 'PAID')
        .reduce((sum, d) => sum + d.amount, 0),
      pendingCount: donations.filter((d) => d.status === 'PENDING').length,
      pendingTotal: donations
        .filter((d) => d.status === 'PENDING')
        .reduce((sum, d) => sum + d.amount, 0),
    }

    return NextResponse.json({
      donations,
      stats,
    })
  } catch (error) {
    console.error('[Admin Donations GET Error]', error)
    return NextResponse.json({ error: 'Erro ao listar doações' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, referenceId, donationId } = body

    if (action === 'sync' && referenceId) {
      const donation = await prisma.donation.findFirst({
        where: { referenceId },
      })

      if (!donation) {
        return NextResponse.json({ error: 'Doação não encontrada' }, { status: 404 })
      }

      const statusData = await picpay.getPaymentStatus(referenceId, donation.paymentLinkId)
      const isPaid = statusData.status === 'completed' || statusData.status === 'paid'

      if (isPaid && donation.status !== 'PAID') {
        const updated = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        })
        return NextResponse.json({
          success: true,
          status: 'PAID',
          updated,
          message: 'Pagamento reconhecido e confirmado com sucesso!',
        })
      }

      return NextResponse.json({
        success: true,
        status: donation.status,
        picpayStatus: statusData.status,
        message: isPaid ? 'Doação já constava como paga.' : 'Doação ainda não identificada como paga no PicPay.',
      })
    }

    if (action === 'sync_all') {
      const pendingDonations = await prisma.donation.findMany({
        where: { status: 'PENDING' },
      })

      let updatedCount = 0

      for (const donation of pendingDonations) {
        try {
          const statusData = await picpay.getPaymentStatus(donation.referenceId, donation.paymentLinkId)
          if (statusData.status === 'completed' || statusData.status === 'paid') {
            await prisma.donation.update({
              where: { id: donation.id },
              data: {
                status: 'PAID',
                paidAt: new Date(),
              },
            })
            updatedCount++
          }
        } catch (e) {
          console.error(`Erro ao sincronizar doação ${donation.referenceId}:`, e)
        }
      }

      return NextResponse.json({
        success: true,
        totalChecked: pendingDonations.length,
        updatedCount,
        message: `Sincronização concluída: ${updatedCount} doação(ões) atualizada(s) para PAGA.`,
      })
    }

    if (action === 'mark_paid' && donationId) {
      const updated = await prisma.donation.update({
        where: { id: donationId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        updated,
        message: 'Doação marcada como PAGA manualmente pelo Administrador.',
      })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    console.error('[Admin Donations POST Error]', error)
    return NextResponse.json({ error: 'Erro ao processar ação de doação' }, { status: 500 })
  }
}
