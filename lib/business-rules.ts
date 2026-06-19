// lib/business-rules.ts
// Regras de negócio centralizadas para todo o sistema

export const BUSINESS_RULES = {
  // ========== PREÇOS ==========
  HOURLY_RATE_BASE: 200, // R$ 200/hora base
  HOURLY_RATE_SOURCE_CODE: 600, // R$ 600/hora para código fonte (3x)
  SOURCE_CODE_MULTIPLIER: 3, // Multiplicador para código fonte

  // ========== PLANOS E SERVIÇOS ==========

  // Manutenção Mensal (hospedagem + suporte + reparos pequenos)
  MANUTENCAO_MENSAL: 140, // R$ 140/mês
  MANUTENCAO_MENSAL_REAL: 280, // R$ 280/mês (valor real)
  MANUTENCAO_MENSAL_DESCONTO: 140, // R$ 140 de desconto sobre o valor real
  MANUTENCAO_DESCONTO_MESES: 12, // Válido por 12 meses após assinatura
  MANUTENCAO_PROMO_LABEL: 'Condicoes comerciais conforme contrato', // Label para flag comercial

  // Setup Inicial do Sistema (site, app, qualquer sistema)
  SETUP_SISTEMA_PRECO_REAL: 800, // R$ 800 (preço cheio)
  SETUP_SISTEMA_PRECO_PROMO: 400, // R$ 400 (50% OFF – promoção ativa)
  SETUP_SISTEMA_DESCONTO: 0.5, // 50% de desconto
  SETUP_SISTEMA_PROMO_EXPIRY: '', // Sem validade expressa (promoção por meta interna)
  SETUP_SISTEMA_HORAS: 2, // 2 horas de programação inclusas
  SETUP_SISTEMA_TOKENS_DIA: 1000, // 1000 tokens/dia de IA inclusos
  SETUP_SISTEMA_PAGINAS_APROX: 10, // ~10 páginas de programação interligada

  // Configuração de E-mail (por domínio)
  EMAIL_SETUP_PRECO_REAL: 400, // R$ 400 (preço cheio)
  EMAIL_SETUP_PRECO_PROMO: 200, // R$ 200 (50% OFF – promoção ativa)
  EMAIL_SETUP_DESCONTO: 0.5, // 50% de desconto
  EMAIL_SETUP_PROMO_EXPIRY: '', // Sem validade expressa (promoção por meta interna)

  // E-mail Mensal (por endereço de e-mail / por domínio)
  EMAIL_MENSAL_POR_EMAIL: 5, // R$ 5/mês por e-mail

  // Reunião Rápida (pré-venda)
  REUNIAO_RAPIDA_MINUTOS: 15,
  REUNIAO_RAPIDA_PRECO: 0, // Gratuita

  // Consultoria (reunião paga – 30 ou 60 minutos)
  CONSULTATION_PRICE: 200, // R$ 200 (preço normal)
  CONSULTATION_PRICE_PROMO: 100, // R$ 100 (promoção atual)
  CONSULTATION_DISCOUNT: 0.5, // 50% de desconto até fim do ano
  CONSULTATION_DURATION_MIN: 30, // 30 minutos
  CONSULTATION_DURATION_MAX: 60, // 60 minutos

  // Projeto Simples (Padrão)
  SIMPLE_PROJECT_PRICE: 2000, // R$ 2.000 média
  SIMPLE_PROJECT_DELIVERY_DAYS: 5, // 5 dias úteis

  // ========== AGENDAMENTO ==========
  SCHEDULING: {
    FREE_15MIN_URL: 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ0F7YBCeVqWN-bBLEucbSzyEGjYitSxiVg52jw=',
    PAID_30MIN_URL: '', // TODO: inserir link Calendly/Google 30min pago
    PAID_60MIN_URL: '', // TODO: inserir link Calendly/Google 60min pago
  },

  // ========== PAGAMENTO ==========
  PAYMENT: {
    PICPAY_URL: '', // Removido
    PIX_KEY: '', // TODO: inserir chave Pix
    METHODS: ['PIX', 'Cartão de Crédito'],
  },

  // ========== DOMÍNIO ==========
  DOMAIN: {
    REGISTRO_BR_URL: 'https://registro.br',
    RECOMMENDED_TLD: '.com.br',
    RESPONSAVEL_TECNICO: 'Studio Santana',
  },
  
  // ========== CANCELAMENTOS E REEMBOLSOS ==========
  CANCELLATION_RETENTION: 0.30, // 30% de retenção mínima
  MAX_REFUND_NOT_STARTED: 0.70, // 70% de devolução máxima (não iniciado)
  MAX_REFUND_STARTED: 0, // 0% após início (apenas desconto de horas gastas)
  
  // ========== PRAZOS ==========
  STANDARD_DELIVERY_DAYS: 5, // Prazo padrão de entrega
  CONTRACT_EXPIRY_DAYS: 30, // Contrato expira em 30 dias sem assinatura
  CLIENT_ACCEPTANCE_DAYS: 7, // Cliente tem 7 dias para aceitar entrega
  
  // ========== COMISSÕES DE PARCEIROS ==========
  COMMISSION_TIERS: [
    { min: 0, max: 15000, rate: 0.10, label: '10%' }, // Até R$ 15.000
    { min: 15001, max: 30000, rate: 0.12, label: '12%' }, // R$ 15.001 - R$ 30.000
    { min: 30001, max: 50000, rate: 0.15, label: '15%' }, // R$ 30.001 - R$ 50.000
    { min: 50001, max: 100000, rate: 0.18, label: '18%' }, // R$ 50.001 - R$ 100.000
    { min: 100001, rate: 0.20, label: '20%' }, // Acima de R$ 100.000
  ],
  
  // ========== PAGAMENTO DE PARCEIROS ==========
  PARTNER_PAYMENT: {
    RECURRING: {
      type: 'monthly',
      duration: 12, // 12 meses para projetos parcelados
      description: 'Pagamento mensal proporcional por 12 meses'
    },
    COMPLETED: {
      type: 'immediate',
      description: 'Pagamento integral imediato após aceite do cliente'
    }
  },
  
  // ========== CUSTOS DE IA ==========
  AI_PROVIDERS: {
    GEMINI: {
      name: 'Google Gemini',
      costPer1kTokens: 0.002, // $0.002 por 1k tokens
    },
    COPILOT: {
      name: 'GitHub Copilot',
      monthlyCost: 10, // $10/mês
    },
    OPENAI: {
      name: 'OpenAI GPT-4',
      costPer1kTokens: 0.03, // $0.03 por 1k tokens
    }
  },
  
  // ========== ENTREGÁVEIS ==========
  DELIVERABLES: {
    STANDARD: [
      'Código compilado/build',
      'Documentação técnica',
      'Manual do usuário',
      'Deploy em produção',
      'Suporte pós-entrega (30 dias)'
    ],
    WITH_SOURCE_CODE: [
      'Código compilado/build',
      'Código fonte completo',
      'Documentação técnica detalhada',
      'Manual do usuário',
      'Deploy em produção',
      'Suporte pós-entrega (30 dias)',
      'Repositório Git privado'
    ]
  },
  
  // ========== STATUS ==========
  PROJECT_STATUS: {
    ANALYSIS: {
      label: 'Em Análise',
      description: 'Aguardando aprovação do administrador',
      color: 'yellow'
    },
    AWAITING_SIGNATURE: {
      label: 'Aguardando Assinatura',
      description: 'Contrato enviado para assinatura',
      color: 'blue'
    },
    AWAITING_PAYMENT: {
      label: 'Aguardando Pagamento',
      description: 'Contrato assinado, aguardando pagamento',
      color: 'orange'
    },
    IN_PROGRESS: {
      label: 'Em Desenvolvimento',
      description: 'Projeto em andamento',
      color: 'green'
    },
    REVIEW: {
      label: 'Em Revisão',
      description: 'Aguardando aceite do cliente',
      color: 'purple'
    },
    COMPLETED: {
      label: 'Concluído',
      description: 'Projeto aceito e finalizado',
      color: 'green'
    },
    CANCELLED: {
      label: 'Cancelado',
      description: 'Projeto cancelado',
      color: 'red'
    }
  },
  
  // ========== CONTATO ==========
  CONTACT: {
    phone: '(71) 98806-8222',
    phoneRaw: '5571988068222',
    email: 'contato@ssantana.com.br',
    address: {
      street: 'Rua Manduaçu, 50',
      neighborhood: 'Piatã',
      city: 'Salvador',
      state: 'BA',
      zip: '41650-085',
      country: 'Brasil'
    }
  },
  
  // ========== SOCIAL ==========
  SOCIAL: {
    linkedin: 'https://www.linkedin.com/company/studio-santana',
    github: 'https://github.com/ssantana',
    instagram: 'https://instagram.com/studio.santana',
    facebook: 'https://facebook.com/studio.santana'
  }
} as const

export const CANCELLATION_RETENTION = BUSINESS_RULES.CANCELLATION_RETENTION
export const MAX_REFUND_NOT_STARTED = BUSINESS_RULES.MAX_REFUND_NOT_STARTED
export const STANDARD_DELIVERY_DAYS = BUSINESS_RULES.STANDARD_DELIVERY_DAYS

// ========== HELPER FUNCTIONS ==========

/**
 * Calcula a taxa de comissão baseada no valor do projeto
 */
export function calculateCommissionRate(projectValue: number): number {
  const tier = BUSINESS_RULES.COMMISSION_TIERS.find(
    (t) => projectValue >= t.min && (!('max' in t) || projectValue <= (t as any).max)
  )
  return tier?.rate || 0.1
}

/**
 * Calcula o valor da comissão
 */
export function calculateCommissionAmount(projectValue: number): number {
  const rate = calculateCommissionRate(projectValue)
  return projectValue * rate
}

/**
 * Calcula o valor de reembolso em caso de cancelamento
 */
export function calculateRefundAmount(
  totalValue: number,
  hoursSpent: number,
  hourlyRate: number,
  tokensUsed: number,
  tokenCost: number,
  projectStarted: boolean
): {
  refundAmount: number
  retainedAmount: number
  breakdown: {
    hoursWorked: number
    tokensCost: number
    administrativeFee: number
  }
} {
  const hoursWorked = hoursSpent * hourlyRate
  const tokensCost = tokensUsed * tokenCost
  const workCost = hoursWorked + tokensCost
  
  if (!projectStarted) {
    // Projeto não iniciado: retenção de 30%, devolução máxima de 70%
    const administrativeFee = totalValue * BUSINESS_RULES.CANCELLATION_RETENTION
    const refundAmount = Math.min(
      totalValue - administrativeFee - workCost,
      totalValue * BUSINESS_RULES.MAX_REFUND_NOT_STARTED
    )
    
    return {
      refundAmount: Math.max(0, refundAmount),
      retainedAmount: totalValue - refundAmount,
      breakdown: {
        hoursWorked,
        tokensCost,
        administrativeFee
      }
    }
  } else {
    // Projeto iniciado: desconto apenas trabalho realizado
    const refundAmount = Math.max(0, totalValue - workCost)
    
    return {
      refundAmount,
      retainedAmount: totalValue - refundAmount,
      breakdown: {
        hoursWorked,
        tokensCost,
        administrativeFee: 0
      }
    }
  }
}

/**
 * Calcula o custo total com código fonte
 */
export function calculateSourceCodeCost(baseHours: number): {
  baseCost: number
  sourceCodeCost: number
  totalCost: number
} {
  const baseCost = baseHours * BUSINESS_RULES.HOURLY_RATE_BASE
  const sourceCodeCost = baseHours * BUSINESS_RULES.HOURLY_RATE_SOURCE_CODE
  
  return {
    baseCost,
    sourceCodeCost,
    totalCost: sourceCodeCost // Substitui o base
  }
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Calcula data de vencimento do contrato
 */
export function calculateContractExpiry(
  signedAt: Date = new Date()
): Date {
  const expiry = new Date(signedAt)
  expiry.setDate(expiry.getDate() + BUSINESS_RULES.CONTRACT_EXPIRY_DAYS)
  return expiry
}

/**
 * Calcula prazo de aceite do cliente
 */
export function calculateAcceptanceDeadline(
  deliveredAt: Date = new Date()
): Date {
  const deadline = new Date(deliveredAt)
  deadline.setDate(deadline.getDate() + BUSINESS_RULES.CLIENT_ACCEPTANCE_DAYS)
  return deadline
}
