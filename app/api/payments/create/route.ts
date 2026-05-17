import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { z } from 'zod'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const createPaymentSchema = z.object({
  projectId: z.string(),
  installments: z.number().min(1).max(12).default(1),
  method: z.enum(['credit_card', 'pix', 'boleto']),
})

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { projectId, installments, method } = createPaymentSchema.parse(body)

    // Buscar projeto
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        contract: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    // Verificar se o usuário é o cliente do projeto ou admin
    if (project.clientId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    if (!project.contract) {
      return NextResponse.json(
        { error: 'Contrato não encontrado para este projeto' },
        { status: 400 }
      )
    }

    // Criar pagamento no banco (parcela única por enquanto)
    const payment = await prisma.payment.create({
      data: {
        contractId: project.contract.id,
        projectId: project.id,
        clientId: project.clientId,
        amount: project.totalValue,
        installment: 1,
        totalInstallments: 1,
        method,
        provider: 'stripe',
        status: 'PENDING',
      },
    })

    // Criar sessão do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: method === 'credit_card' ? ['card'] : method === 'pix' ? ['pix'] : ['boleto'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: project.title,
              description: project.description,
            },
            unit_amount: Math.round(project.totalValue * 100), // Convertir para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/client/payments/${payment.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/client/payments/${payment.id}?canceled=true`,
      metadata: {
        paymentId: payment.id,
        projectId: project.id,
        clientId: project.clientId,
      },
      customer_email: project.client.email,
    })

    // Atualizar pagamento com dados do Stripe
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        externalId: session.id,
      },
    })

    return NextResponse.json({
      success: true,
      payment,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}

// GET - Listar pagamentos do cliente
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const payments = await prisma.payment.findMany({
      where: dbUser.role === 'ADMIN' ? {} : { clientId: dbUser.id },
      include: {
        project: {
          select: {
            title: true,
            client: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar pagamentos' },
      { status: 500 }
    )
  }
}
