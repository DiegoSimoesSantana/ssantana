import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { DEFAULT_DYNAMIC_PRICING, DynamicPricingConfig } from '@/lib/dynamic-pricing'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const [apiCredentialsSetting, dynamicPricingSetting] = await Promise.all([
    prisma.settings.findUnique({ where: { key: 'api_credentials' } }),
    prisma.settings.findUnique({ where: { key: 'dynamic_pricing' } }),
  ])

  const apiCredentials = (apiCredentialsSetting?.value as Record<string, any>) || {
    PICPAY_CLIENT_ID: process.env.PICPAY_CLIENT_ID || '',
    PICPAY_CLIENT_SECRET: process.env.PICPAY_CLIENT_SECRET ? '••••••••••••••••' : '',
    PICPAY_WEBHOOK_TOKEN: process.env.PICPAY_WEBHOOK_TOKEN || '',
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '5571988068222',
  }

  // Se o secret já foi salvo no banco, mascara na leitura
  if (apiCredentials.PICPAY_CLIENT_SECRET && apiCredentials.PICPAY_CLIENT_SECRET !== '••••••••••••••••') {
    apiCredentials.hasClientSecret = true
  }

  const dynamicPricing = (dynamicPricingSetting?.value as unknown as DynamicPricingConfig) || DEFAULT_DYNAMIC_PRICING

  return NextResponse.json({
    apiCredentials,
    dynamicPricing,
  })
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { section, data } = body

    if (section === 'api_credentials') {
      // Se a senha veio como máscara, busca o valor anterior existente no banco
      let finalClientSecret = data.PICPAY_CLIENT_SECRET
      if (!finalClientSecret || finalClientSecret === '••••••••••••••••') {
        const existing = await prisma.settings.findUnique({ where: { key: 'api_credentials' } })
        const oldVal = (existing?.value as Record<string, any>) || {}
        finalClientSecret = oldVal.PICPAY_CLIENT_SECRET || process.env.PICPAY_CLIENT_SECRET || ''
      }

      const payload = {
        PICPAY_CLIENT_ID: data.PICPAY_CLIENT_ID || '',
        PICPAY_CLIENT_SECRET: finalClientSecret,
        PICPAY_WEBHOOK_TOKEN: data.PICPAY_WEBHOOK_TOKEN || '',
        WHATSAPP_NUMBER: data.WHATSAPP_NUMBER || '5571988068222',
      }

      await prisma.settings.upsert({
        where: { key: 'api_credentials' },
        create: {
          key: 'api_credentials',
          value: payload,
          description: 'Credenciais de Pagamento e WhatsApp SSantana',
        },
        update: {
          value: payload,
        },
      })

      return NextResponse.json({ success: true, message: 'Credenciais de API salvas com sucesso!' })
    }

    if (section === 'dynamic_pricing') {
      const payload: DynamicPricingConfig = {
        mvpSiteIaPrice: Number(data.mvpSiteIaPrice) || DEFAULT_DYNAMIC_PRICING.mvpSiteIaPrice,
        mvpSiteIaReferencePrice: Number(data.mvpSiteIaReferencePrice) || DEFAULT_DYNAMIC_PRICING.mvpSiteIaReferencePrice,
        manutencaoMensalPrice: Number(data.manutencaoMensalPrice) || DEFAULT_DYNAMIC_PRICING.manutencaoMensalPrice,
        manutencaoMensalReferencePrice: Number(data.manutencaoMensalReferencePrice) || DEFAULT_DYNAMIC_PRICING.manutencaoMensalReferencePrice,
        suporteRapido30MinPrice: Number(data.suporteRapido30MinPrice) || DEFAULT_DYNAMIC_PRICING.suporteRapido30MinPrice,
        suporteRemoto1hPrice: Number(data.suporteRemoto1hPrice) || DEFAULT_DYNAMIC_PRICING.suporteRemoto1hPrice,
        emailMensalPorContaPrice: Number(data.emailMensalPorContaPrice) || DEFAULT_DYNAMIC_PRICING.emailMensalPorContaPrice,
        emailSetupPromocionalPrice: Number(data.emailSetupPromocionalPrice) || DEFAULT_DYNAMIC_PRICING.emailSetupPromocionalPrice,
        emailSetupReferencePrice: Number(data.emailSetupReferencePrice) || DEFAULT_DYNAMIC_PRICING.emailSetupReferencePrice,
        saasVerticalPromoPrice: Number(data.saasVerticalPromoPrice) || DEFAULT_DYNAMIC_PRICING.saasVerticalPromoPrice,
        saasVerticalNormalPrice: Number(data.saasVerticalNormalPrice) || DEFAULT_DYNAMIC_PRICING.saasVerticalNormalPrice,
        saasVerticalSetupPrice: Number(data.saasVerticalSetupPrice) || DEFAULT_DYNAMIC_PRICING.saasVerticalSetupPrice,
      }

      await prisma.settings.upsert({
        where: { key: 'dynamic_pricing' },
        create: {
          key: 'dynamic_pricing',
          value: payload as any,
          description: 'Preços dinâmicos da vitrine de tráfego pago',
        },
        update: {
          value: payload as any,
        },
      })

      return NextResponse.json({ success: true, message: 'Preços dinâmicos atualizados com sucesso!' })
    }

    return NextResponse.json({ error: 'Seção inválida' }, { status: 400 })
  } catch (error) {
    console.error('Erro ao salvar configurações do Admin:', error)
    return NextResponse.json({ error: 'Falha ao salvar configurações' }, { status: 500 })
  }
}
