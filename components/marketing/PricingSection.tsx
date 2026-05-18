'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Star, Mail, Globe, Wrench } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'
import { parseReferralCookieValue, REFERRAL_STORAGE_KEY } from '@/lib/referral-tracking'

const pricingPlans = [
  {
    icon: Wrench,
    name: 'Manutenção Mensal',
    description: 'Suporte com valor promocional por 12 meses após assinatura do contrato.',
    price: BUSINESS_RULES.MANUTENCAO_MENSAL,
    priceLabel: `R$ ${BUSINESS_RULES.MANUTENCAO_MENSAL}/mês`,
    originalPrice: BUSINESS_RULES.MANUTENCAO_MENSAL_REAL,
    badge: null,
    popular: false,
    features: [
      `${BUSINESS_RULES.MANUTENCAO_MENSAL_DESCONTO} reais de desconto sobre o valor real`,
      `Valor promocional por ${BUSINESS_RULES.MANUTENCAO_DESCONTO_MESES} meses após assinatura`,
      'Hospedagem em servidor dedicado Linux',
      'Monitoramento de disponibilidade',
      'Pequenas correções e reparos',
      'Suporte via WhatsApp / e-mail',
      'Pode haver ajuste por ampliação: tráfego, disco, memória, CPU e necessidades específicas',
      'Após atingir meta interna de clientes, valor retorna ao preço normal de R$ 200/mês',
    ],
    cta: 'Contratar Manutenção',
    href: '/#contact',
  },
  {
    icon: Globe,
    name: 'Setup do Sistema',
    description: 'Configuração inicial de site, aplicativo ou sistema. Inclui 2h de programação + IA.',
    price: BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO,
    priceLabel: `R$ ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO}`,
    originalPrice: BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL,
    badge: '50% OFF',
    popular: true,
    features: [
      '2h de programação inclusas',
      `${BUSINESS_RULES.SETUP_SISTEMA_TOKENS_DIA.toLocaleString('pt-BR')} tokens/dia de IA`,
      `~${BUSINESS_RULES.SETUP_SISTEMA_PAGINAS_APROX} páginas de programação interligada`,
      'Deploy em produção (Vercel / servidor)',
      'Configuração de domínio .com.br',
      'Responsável técnico no registro.br',
      `Valor real de referência: R$ ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL}`,
      'Sem validade expressa: condição promocional por meta interna',
    ],
    cta: 'Começar Setup',
    href: '/#contact',
  },
  {
    icon: Mail,
    name: 'Configuração de E-mail',
    description: 'Setup completo de e-mail profissional apontando para o domínio da empresa.',
    price: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
    priceLabel: `R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO}`,
    originalPrice: BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL,
    badge: '50% OFF',
    popular: false,
    features: [
      'Por sistema / por domínio',
      'E-mail profissional no domínio próprio',
      'Servidor e-mail Studio Santana',
      `Manutenção: R$ ${BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL}/mês por e-mail`,
      'Parceria Google / Microsoft / Zoho (consultar)',
      'Domínio .com.br = mais credibilidade',
      `Valor real de referência: R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL}`,
      'Sem validade expressa: condição promocional por meta interna',
    ],
    cta: 'Configurar E-mail',
    href: '/#contact',
  },
  {
    icon: Mail,
    name: 'E-mail Próprio (Servidor)',
    description: 'E-mail profissional com IMAP/POP/SMTP/Webmail em servidor próprio Studio Santana.',
    price: BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL,
    priceLabel: `R$ ${BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL}/e-mail mês`,
    originalPrice: null,
    badge: null,
    popular: false,
    features: [
      '5GB por conta de e-mail',
      'IMAP, POP, SMTP e Webmail',
      'Compatível com Outlook, Gmail e similares',
      'Regras de encaminhamento ilimitadas',
      'Adicionar/remover e-mail: R$ 15 por alteração',
      `Setup obrigatório: R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO}`,
    ],
    cta: 'Solicitar E-mail Próprio',
    href: '/education#email',
  },
  {
    icon: Globe,
    name: 'Google / Microsoft / Zoho',
    description: 'Configuração corporativa cloud com setup idêntico e mensalidade variável por dólar.',
    price: null,
    priceLabel: 'Mensal sob consulta (USD)',
    originalPrice: null,
    badge: null,
    popular: false,
    features: [
      `Setup igual: R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO}`,
      'Preço mensal depende de usuários e armazenamento',
      'Inclui avaliação de funcionalidades (Meet, Office, etc.)',
      'Pode variar com oscilação BRL/USD',
      'Recomendado para times em escala',
    ],
    cta: 'Calcular Cloud E-mail',
    href: '/education#email',
  },
  {
    icon: Wrench,
    name: 'Setup de Tráfego Pago',
    description: 'Planejamento e configuração inicial para Meta, Google, TikTok, Kwai, Waze e outros.',
    price: null,
    priceLabel: 'Estimativa via calculadora',
    originalPrice: null,
    badge: 'PNL + UX',
    popular: false,
    features: [
      'Coleta de orçamento por plataforma (dia/semana/mês)',
      'Definição de funil com reuniões estratégicas',
      'Preço estimado inicial + ajuste após reunião',
      'Uso de IA para análise e produtividade',
      'Preço final depende da complexidade real',
    ],
    cta: 'Abrir Calculadora de Tráfego',
    href: '/education#trafego',
  },
]

export default function PricingSection() {
  const [couponInput, setCouponInput] = useState('')
  const [activeCode, setActiveCode] = useState('')
  const [partnerName, setPartnerName] = useState('')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(REFERRAL_STORAGE_KEY) : null
    if (!stored) {
      return
    }

    try {
      const parsed = JSON.parse(stored)
      const attribution = parseReferralCookieValue(encodeURIComponent(JSON.stringify(parsed)))
      const code = attribution?.referralCode || parsed?.referralCode
      const name = attribution?.partnerName || parsed?.partnerName
      if (code) {
        setActiveCode(String(code).toUpperCase())
        setCouponInput(String(code).toUpperCase())
      }
      if (name) {
        setPartnerName(String(name))
      }
    } catch {
      // no-op
    }
  }, [])

  const hasVipCoupon = !!activeCode

  const setupDisplay = useMemo(() => {
    const fullPrice = BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL
    const discounted = BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO
    return {
      fullPrice,
      discounted,
      final: hasVipCoupon ? discounted : fullPrice,
      applied: hasVipCoupon,
    }
  }, [hasVipCoupon])

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase()
    if (!normalized) {
      return
    }
    setActiveCode(normalized)
  }

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Preços Transparentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Sem surpresas. Você sabe exatamente o que vai pagar.
            <br />
            Suporte mensal com preço promocional de <strong>R$ {BUSINESS_RULES.MANUTENCAO_MENSAL}/mês</strong> por 12 meses.
          </p>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Desconto ativo por meta interna de clientes. Validade indeterminada.
          </div>

          <div className="mx-auto mt-2 max-w-3xl rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left">
            <p className="text-sm font-semibold text-cyan-800">Indicacao VIP e Cupom de Parceiro</p>
            <p className="mt-2 text-sm text-cyan-900">
              {hasVipCoupon
                ? `Cupom ${activeCode} ativo. 50% OFF no Setup liberado${partnerName ? ` por indicacao de ${partnerName}` : ''}.`
                : 'Sem cupom ativo: exibimos o preco cheio de ancoragem. Com indicacao VIP ou codigo do parceiro, liberamos 50% OFF no Setup.'}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Digite codigo de cupom/parceiro"
                className="w-full rounded-lg border border-cyan-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Aplicar cupom
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 ${
                plan.popular
                  ? 'border-primary-600 shadow-2xl scale-105'
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star size={14} fill="white" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              {plan.badge && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <plan.icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.name === 'Setup do Sistema' ? (
                  <>
                    <p className={`text-lg ${setupDisplay.applied ? 'text-gray-400 line-through' : 'text-gray-900 font-bold'}`}>
                      R$ {setupDisplay.fullPrice}
                    </p>
                    {setupDisplay.applied && (
                      <p className="text-4xl font-bold text-green-600">R$ {setupDisplay.discounted}</p>
                    )}
                    {!setupDisplay.applied && (
                      <p className="text-sm text-red-500 font-medium mt-1">
                        Cupom de parceiro necessario para liberar 50% OFF
                      </p>
                    )}
                    {setupDisplay.applied && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Cupom {activeCode} aplicado com sucesso (50% OFF)
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {plan.originalPrice && (
                  <p className="text-gray-400 line-through text-lg">
                    R$ {plan.originalPrice}
                  </p>
                )}
                <p className="text-4xl font-bold text-gray-900">{plan.priceLabel}</p>
                  </>
                )}
                {plan.badge && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    Promoção sem validade expressa (sujeita a meta interna)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Notas e extras */}
        <div className="mt-12 max-w-3xl mx-auto space-y-4">
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">📧 Parceria Google / Microsoft / Zoho</h4>
            <p className="text-gray-600 text-sm">
              Para empresas que precisam de ferramentas avançadas além do e-mail (Drive, Meet, Teams, etc.),
              trabalhamos em parceria. O custo é superior ao e-mail básico, mas as funcionalidades extras
              podem valer muito dependendo da empresa.{' '}
              <strong>Solicite uma análise personalizada.</strong>
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">🌐 Por que usar .com.br?</h4>
            <p className="text-gray-600 text-sm">
              O domínio .com.br exige CPF ou CNPJ cadastrado no{' '}
              <a href="https://registro.br" target="_blank" rel="noreferrer" className="underline">registro.br</a>.
              O WHOIS brasileiro mostra quem é o dono — isso gera <strong>confiança real</strong> para seus clientes.
              Recomendamos que o cliente registre diretamente, com o Studio Santana como{' '}
              <strong>responsável técnico</strong> para facilitar manutenção e mudanças de servidor.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">💳 Formas de pagamento</h4>
            <p className="text-gray-600 text-sm">
              Aceitamos <strong>PIX, Cartão de Crédito e PicPay</strong>. O pagamento confirma o agendamento
              imediatamente. Reuniões de 15 minutos (pré-venda) são gratuitas — basta agendar pelo link.
              Reuniões de 30 ou 60 minutos são pagas e confirmadas após o pagamento.
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">📌 Regra do Suporte Mensal</h4>
            <p className="text-gray-600 text-sm">
              O valor de <strong>R$ {BUSINESS_RULES.MANUTENCAO_MENSAL}/mês</strong> é promocional por{' '}
              <strong>{BUSINESS_RULES.MANUTENCAO_DESCONTO_MESES} meses</strong> após assinatura.
              O valor real é <strong>R$ {BUSINESS_RULES.MANUTENCAO_MENSAL_REAL}/mês</strong>, com desconto atual de{' '}
              <strong>R$ {BUSINESS_RULES.MANUTENCAO_MENSAL_DESCONTO}</strong>.
              Pode haver reajuste por ampliação de servidor, tráfego, dados, disco, memória, CPU e requisitos específicos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
