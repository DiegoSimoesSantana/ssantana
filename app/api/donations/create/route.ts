import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { picpay } from '@/lib/picpay'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, donorName, donorEmail, donorPhone, donorDocument, message, targetProject } = body

    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || numericAmount < 1.00) {
      return NextResponse.json(
        { success: false, error: 'O valor mínimo de doação para projetos gratuitos é de R$ 1,00.' },
        { status: 400 }
      )
    }

    // Gerar identificador único de referência
    const referenceId = `DOA-${Date.now().toString().slice(-8)}`
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://ssantana.com.br'

    // Separar nome
    const fullName = donorName?.trim() || 'Apoiador Projetos Livres'
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0] || 'Apoiador'
    const lastName = nameParts.slice(1).join(' ') || 'Comunidade'

    // Criar cobrança via PicPay (PIX + Cartão de Crédito)
    let paymentResult
    try {
      paymentResult = await picpay.createPayment({
        referenceId,
        title: `Doação Projetos Gratuitos (${targetProject || 'Comunidade'})`,
        description: message ? `Mensagem: ${message.slice(0, 100)}` : 'Apoio ao desenvolvimento de aplicativos gratuitos e abertos da SSantana.',
        callbackUrl: `${origin}/api/webhooks/picpay`,
        returnUrl: `${origin}/doacoes?status=confirmado&ref=${referenceId}`,
        value: numericAmount,
        buyer: {
          firstName,
          lastName,
          email: donorEmail?.trim() || 'contato@ssantana.com.br',
          phone: donorPhone?.trim() || '5571988068222',
          document: donorDocument?.trim() || '00000000000',
        },
      })
    } catch (picpayErr: any) {
      console.error('Erro ao gerar cobrança PicPay da doação:', picpayErr)
      return NextResponse.json(
        { success: false, error: 'Não foi possível gerar a cobrança de doação. Verifique os dados informados.' },
        { status: 500 }
      )
    }

    // Salvar doação no banco de dados
    const donation = await prisma.donation.create({
      data: {
        referenceId,
        amount: numericAmount,
        donorName: donorName?.trim() || null,
        donorEmail: donorEmail?.trim() || null,
        donorDocument: donorDocument?.trim() || null,
        message: message?.trim() || null,
        targetProject: targetProject || 'Geral',
        paymentLinkId: paymentResult.paymentLinkId || null,
        paymentUrl: paymentResult.paymentUrl,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      referenceId,
      amount: numericAmount,
      paymentUrl: paymentResult.paymentUrl,
      qrcode: paymentResult.qrcode,
    })
  } catch (error: any) {
    console.error('Erro ao processar doação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar a doação.' },
      { status: 500 }
    )
  }
}
