import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'
import { calculateCommissionAmount, STANDARD_DELIVERY_DAYS } from '@/lib/business-rules'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Processar evento
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const paymentId = session.metadata?.paymentId
  const projectId = session.metadata?.projectId

  if (!paymentId || !projectId) {
    console.error('Missing metadata in session')
    return
  }

  // Atualizar pagamento
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'COMPLETED',
      paidAt: new Date(),
      externalId: session.payment_intent as string,
    },
  })

  // Atualizar status do projeto
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + STANDARD_DELIVERY_DAYS)

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: 'IN_PROGRESS',
      startDate: new Date(),
      dueDate: deliveryDate,
    },
    include: {
      client: true,
      lead: {
        include: {
          partner: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      },
    },
  })

  // Calcular e criar comissão se houver parceiro via lead
  const partnerId = project.lead?.partner?.id
  const partnerUserId = project.lead?.partner?.userId

  if (partnerId && partnerUserId) {
    const commissionAmount = calculateCommissionAmount(project.totalValue)
    
    await prisma.commission.create({
      data: {
        paymentId: payment.id,
        partnerId,
        projectId: project.id,
        amount: commissionAmount,
        rate: commissionAmount / project.totalValue,
        status: 'PENDING',
      },
    })

    // Atualizar estatísticas do parceiro
    await prisma.partner.update({
      where: { id: partnerId },
      data: {
        totalEarned: {
          increment: commissionAmount,
        },
        pendingBalance: {
          increment: commissionAmount,
        },
      },
    })

    // Notificar parceiro
    await prisma.notification.create({
      data: {
        userId: partnerUserId,
        type: 'commission',
        title: 'Nova Comissão Gerada!',
        message: `Você ganhou R$ ${commissionAmount.toFixed(2)} pela indicação do projeto "${project.title}"`,
        actionUrl: `/dashboard/partner/commissions`,
      },
    })
  }

  // Criar notificação para o cliente
  await prisma.notification.create({
    data: {
      userId: project.clientId,
      type: 'payment',
      title: 'Pagamento Confirmado!',
      message: `Seu pagamento foi processado com sucesso. O projeto "${project.title}" está iniciando!`,
      actionUrl: `/dashboard/client/projects/${project.id}`,
    },
  })

  // Criar notificação para admin
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
  })

  for (const admin of admins) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        type: 'payment',
        title: 'Novo Pagamento Recebido',
        message: `Pagamento de R$ ${payment.amount.toFixed(2)} confirmado para o projeto "${project.title}"`,
        actionUrl: `/dashboard/admin/projects/${project.id}`,
      },
    })
  }

  // TODO: Enviar email de confirmação para cliente
  // TODO: Enviar email para equipe iniciar desenvolvimento
  // TODO: Criar tarefas iniciais no projeto
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  // Já tratado no checkout.session.completed
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  const payment = await prisma.payment.findFirst({
    where: { externalId: paymentIntent.id },
    include: { project: true },
  })

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    })

    // Notificar cliente
    await prisma.notification.create({
      data: {
        userId: payment.clientId,
        type: 'payment',
        title: 'Falha no Pagamento',
        message: `O pagamento do projeto "${payment.project.title}" falhou. Por favor, tente novamente.`,
        actionUrl: `/dashboard/client/payments/${payment.id}`,
      },
    })
  }
}
