// lib/dynamic-pricing.ts
// Gerenciador central de preços dinâmicos para campanhas de tráfego (Instagram / TikTok)
// Busca no banco de dados (Settings: dynamic_pricing) com valores padrão de baixa barreira de entrada.

import { prisma } from '@/lib/db'

export interface DynamicPricingConfig {
  // 1. MVP / Site com IA (Entrada)
  mvpSiteIaPrice: number // Padrão: R$ 197,00 (de R$ 800,00)
  mvpSiteIaReferencePrice: number // R$ 800,00

  // 2. Manutenção e Hospedagem Mensal
  manutencaoMensalPrice: number // Padrão: R$ 70,00 (de R$ 200,00)
  manutencaoMensalReferencePrice: number // R$ 200,00

  // 3. Suporte TI Remoto Rápido
  suporteRapido30MinPrice: number // Padrão: R$ 40,00 (metade de R$ 80,00)
  suporteRemoto1hPrice: number // Padrão: R$ 80,00

  // 4. E-mail Corporativo
  emailMensalPorContaPrice: number // Padrão: R$ 5,00
  emailSetupPromocionalPrice: number // Padrão: R$ 97,00
  emailSetupReferencePrice: number // Padrão: R$ 200,00

  // 5. SaaS Clínicas / Psicólogos / Advogados
  saasVerticalPromoPrice: number // Padrão: R$ 197,00 (primeiros 3 meses)
  saasVerticalNormalPrice: number // Padrão: R$ 500,00
  saasVerticalSetupPrice: number // R$ 0 ou R$ 400
}

export const DEFAULT_DYNAMIC_PRICING: DynamicPricingConfig = {
  mvpSiteIaPrice: 197.0,
  mvpSiteIaReferencePrice: 800.0,

  manutencaoMensalPrice: 70.0,
  manutencaoMensalReferencePrice: 200.0,

  suporteRapido30MinPrice: 40.0,
  suporteRemoto1hPrice: 80.0,

  emailMensalPorContaPrice: 5.0,
  emailSetupPromocionalPrice: 97.0,
  emailSetupReferencePrice: 200.0,

  saasVerticalPromoPrice: 197.0,
  saasVerticalNormalPrice: 500.0,
  saasVerticalSetupPrice: 400.0,
}

export async function getDynamicPricing(): Promise<DynamicPricingConfig> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'dynamic_pricing' },
    })

    if (!setting?.value || typeof setting.value !== 'object') {
      return DEFAULT_DYNAMIC_PRICING
    }

    const val = setting.value as Partial<DynamicPricingConfig>
    return {
      mvpSiteIaPrice: Number(val.mvpSiteIaPrice) || DEFAULT_DYNAMIC_PRICING.mvpSiteIaPrice,
      mvpSiteIaReferencePrice: Number(val.mvpSiteIaReferencePrice) || DEFAULT_DYNAMIC_PRICING.mvpSiteIaReferencePrice,
      manutencaoMensalPrice: Number(val.manutencaoMensalPrice) || DEFAULT_DYNAMIC_PRICING.manutencaoMensalPrice,
      manutencaoMensalReferencePrice: Number(val.manutencaoMensalReferencePrice) || DEFAULT_DYNAMIC_PRICING.manutencaoMensalReferencePrice,
      suporteRapido30MinPrice: Number(val.suporteRapido30MinPrice) || DEFAULT_DYNAMIC_PRICING.suporteRapido30MinPrice,
      suporteRemoto1hPrice: Number(val.suporteRemoto1hPrice) || DEFAULT_DYNAMIC_PRICING.suporteRemoto1hPrice,
      emailMensalPorContaPrice: Number(val.emailMensalPorContaPrice) || DEFAULT_DYNAMIC_PRICING.emailMensalPorContaPrice,
      emailSetupPromocionalPrice: Number(val.emailSetupPromocionalPrice) || DEFAULT_DYNAMIC_PRICING.emailSetupPromocionalPrice,
      emailSetupReferencePrice: Number(val.emailSetupReferencePrice) || DEFAULT_DYNAMIC_PRICING.emailSetupReferencePrice,
      saasVerticalPromoPrice: Number(val.saasVerticalPromoPrice) || DEFAULT_DYNAMIC_PRICING.saasVerticalPromoPrice,
      saasVerticalNormalPrice: Number(val.saasVerticalNormalPrice) || DEFAULT_DYNAMIC_PRICING.saasVerticalNormalPrice,
      saasVerticalSetupPrice: Number(val.saasVerticalSetupPrice) || DEFAULT_DYNAMIC_PRICING.saasVerticalSetupPrice,
    }
  } catch {
    return DEFAULT_DYNAMIC_PRICING
  }
}
