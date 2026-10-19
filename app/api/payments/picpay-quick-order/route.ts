import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'
import { getDynamicPricing } from '@/lib/dynamic-pricing'
import { z } from 'zod'

const quickOrderSchema = z.object({
  serviceType: z.enum(['SUPORTE_30M', 'SUPORTE_1H', 'MVP_IA', 'SAAS_CLINICAS', 'EMAIL']),
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone com DDD é obrigatório'),
  document: z.string().min(11, 'CPF ou CNPJ válido é obrigatório'),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'É obrigatório aceitar o termo de retenção para reserva da agenda.' }),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = quickOrderSchema.parse(body)

    const pricing = await getDynamicPricing()

    let title = ''
    let description = ''
    let amount = 40.0

    switch (parsed.serviceType) {
      case 'SUPORTE_30M':
        title = 'Diagnóstico / Suporte Rápido Remoto (30 Minutos)'
        description = 'Atendimento técnico remoto imediato com o decisor sênior (30 min). Sujeito à retenção por no-show.'
        amount = pricing.suporteRapido30MinPrice || 40.0
        break
      case 'SUPORTE_1H':
        title = 'SOS Suporte de TI Remoto Especializado (1 Hora)'
        description = 'Sessão técnica completa de 60 minutos para resolução avançada de infraestrutura ou computadores.'
        amount = pricing.suporteRemoto1hPrice || 80.0
        break
      case 'MVP_IA':
        title = 'Criação de Site / MVP Rápido com IA (Entrada)'
        description = 'Entrada para desenvolvimento ágil de protótipo e lançamento comercial.'
        amount = pricing.mvpSiteIaPrice || 400.0
        break
      case 'SAAS_CLINICAS':
        title = 'SaaS Verticais: Clínicas, Psicólogos & Escritórios (Lote Promocional)'
        description = 'Mensalidade inicial lote pré-venda com agenda e bot WhatsApp integrados.'
        amount = pricing.saasVerticalPromoPrice || 250.0
        break
      case 'EMAIL':
        title = 'E-mail Corporativo Profissional Blindado (Setup)'
        description = 'Configuração de domínio próprio com blindagem antispam SPF, DKIM e DMARC.'
        amount = pricing.emailSetupPromocionalPrice || 150.0
        break
    }

    // 1. Localizar ou criar o usuário cliente
    let user = await prisma.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: parsed.email.toLowerCase(),
          name: parsed.name,
          phone: parsed.phone,
          role: 'CLIENT',
        },
      })
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: parsed.name || user.name,
          phone: parsed.phone || user.phone,
        },
      })
    }

    // 2. Criar contrato numerado anti-fraude (Ex: SS-2026-SUP-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const contractNumber = `SS-2026-${parsed.serviceType.substring(0, 3)}-${randomSuffix}`

    const creditExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Criar projeto de suporte / serviço
    const project = await prisma.project.create({
      data: {
        clientId: user.id,
        title,
        description,
        estimatedHours: parsed.serviceType === 'SUPORTE_30M' ? 0.5 : parsed.serviceType === 'SUPORTE_1H' ? 1.0 : 5.0,
        hourlyRate: 80.0,
        totalValue: amount,
        deliveryDays: 1,
        status: 'AWAITING_PAYMENT',
        serviceCredits: 1,
        creditExpiryDate,
        meetingNotes: 'Atendimento aguardando confirmação do pagamento e agendamento de horário.',
      },
    })

    // Registrar o contrato com o termo de cancelamento e retenção gravado
    const contract = await prisma.contract.create({
      data: {
        projectId: project.id,
        clientId: user.id,
        contractNumber,
        totalValue: amount,
        installments: 1,
        paymentSchedule: [
          {
            installment: 1,
            amount,
            dueDate: new Date().toISOString(),
          },
        ],
        cancellationRetentionRate: 0.50, // 50% de retenção em caso de cancelamento com menos de 24h ou não comparecimento
        clientDocument: parsed.document,
        status: 'SENT',
        content: {
          term: 'Pay-Before-Book Gate: Acesso à agenda liberado exclusivamente após confirmação do pagamento. O cancelamento com menos de 24 horas de antecedência ou o não comparecimento incorre em retenção da hora técnica reservada.',
          clientName: parsed.name,
          clientEmail: parsed.email,
          service: title,
          acceptedAt: new Date().toISOString(),
        },
        clauses: {
          payBeforeBook: true,
          cancellationPolicy: 'Retenção parcial de 50% para reagendamento em <24h ou no-show',
        },
      },
    })

    // Criar registro de pagamento PENDING no banco
    const payment = await prisma.payment.create({
      data: {
        contractId: contract.id,
        projectId: project.id,
        clientId: user.id,
        amount,
        installment: 1,
        totalInstallments: 1,
        method: 'picpay',
        provider: 'picpay',
        status: 'PENDING',
        externalId: contractNumber,
      },
    })

    // 3. Gerar a cobrança no PicPay
    const nameParts = parsed.name.trim().split(' ')
    const firstName = nameParts[0] || 'Cliente'
    const lastName = nameParts.slice(1).join(' ') || 'SSantana'

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://ssantana.com.br'

    const picpayOrder = await picpay.createPayment({
      referenceId: contractNumber,
      title,
      description: `Atendimento expresso de 30 minutos - ${title}`,
      callbackUrl: `${baseUrl}/api/webhooks/picpay`,
      returnUrl: `${baseUrl}/painel?ticket=${contractNumber}`,
      value: amount,
      buyer: {
        firstName,
        lastName,
        document: parsed.document,
        email: parsed.email,
        phone: parsed.phone,
      },
    })

    if (picpayOrder.paymentLinkId) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { externalId: picpayOrder.paymentLinkId },
      })
    }

    const creds = await picpay.getCredentials()
    const isMock = !creds.clientSecret

    return NextResponse.json({
      success: true,
      referenceId: contractNumber,
      paymentId: payment.id,
      paymentLinkId: picpayOrder.paymentLinkId,
      amount,
      title,
      paymentUrl: picpayOrder.paymentUrl,
      qrcode: picpayOrder.qrcode,
      expiresAt: picpayOrder.expiresAt,
      isMock,
    })
  } catch (error: any) {
    console.error('[Quick Order Error]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Falha ao processar pedido de cobrança' },
      { status: 500 }
    )
  }
}
