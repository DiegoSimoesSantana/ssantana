'use client'

import { useState } from 'react'
import { Tag, CheckCircle } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'

interface DiscountInfo {
  label: string
  promoPrice: number
  realPrice: number
  discountPct: number
}

const discounts: DiscountInfo[] = [
  {
    label: 'Setup do Sistema (site/app)',
    promoPrice: BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO,
    realPrice: BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL,
    discountPct: Math.round(BUSINESS_RULES.SETUP_SISTEMA_DESCONTO * 100),
  },
  {
    label: 'Configuração de E-mail (por domínio)',
    promoPrice: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
    realPrice: BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL,
    discountPct: Math.round(BUSINESS_RULES.EMAIL_SETUP_DESCONTO * 100),
  },
]

export default function DiscountPanel() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="text-green-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Promoções Ativas</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 hover:underline"
        >
          {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
        </button>
      </div>

      <div className="space-y-4">
        {discounts.map((d, i) => {
          return (
            <div
              key={i}
              className="rounded-lg p-4 border border-green-200 bg-green-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{d.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900">R$ {d.promoPrice}</span>
                    <span className="text-gray-400 line-through text-sm">R$ {d.realPrice}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">
                      {d.discountPct}% OFF
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-green-700">Promoção ativa</div>
                  <p className="text-xs text-gray-500 mt-0.5">Sem validade expressa</p>
                </div>
              </div>

              {showDetails && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-xs text-gray-600 space-y-1">
                  <p>💰 Preço promocional: <strong>R$ {d.promoPrice}</strong></p>
                  <p>💰 Preço real (após promoção): <strong>R$ {d.realPrice}</strong></p>
                  <p>📅 Promoção sem validade expressa (meta interna)</p>
                  <p className="text-green-700 font-semibold">✅ Promoção ativa — exibida no site</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle size={14} className="text-green-500" />
          <span>
            Suporte mensal: <strong className="text-gray-800">R$ {BUSINESS_RULES.MANUTENCAO_MENSAL}/mês</strong>{' '}
            por {BUSINESS_RULES.MANUTENCAO_DESCONTO_MESES} meses. Valor real:{' '}
            <strong className="text-gray-800">R$ {BUSINESS_RULES.MANUTENCAO_MENSAL_REAL}/mês</strong>.
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <CheckCircle size={14} className="text-green-500" />
          <span>E-mail mensal: <strong className="text-gray-800">R$ {BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL}/mês</strong> por e-mail (preço fixo)</span>
        </div>
      </div>
    </div>
  )
}
