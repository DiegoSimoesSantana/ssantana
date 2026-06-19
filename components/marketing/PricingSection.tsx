'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Star, Mail, Globe, Wrench } from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'
import { parseReferralCookieValue, REFERRAL_STORAGE_KEY } from '@/lib/referral-tracking'

type PublicPricingService = {
  key: 'MANUTENCAO_MENSAL' | 'SETUP_SISTEMA' | 'EMAIL_SETUP' | 'CONSULTORIA_30_60'
  label: string
  currentPrice: number
  referencePrice: number
  updatedAt: string
}

function buildPricingPlans(serviceMap: Record<string, PublicPricingService>, hasVipCoupon: boolean) {
  const manutencaoMensal = serviceMap.MANUTENCAO_MENSAL?.currentPrice ?? BUSINESS_RULES.MANUTENCAO_MENSAL
  const manutencaoPrecoFinal = hasVipCoupon ? 70 : manutencaoMensal
  const setupComercial = serviceMap.SETUP_SISTEMA?.currentPrice ?? BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO
  const setupReferencia = serviceMap.SETUP_SISTEMA?.referencePrice ?? BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL
  const emailSetupComercial = serviceMap.EMAIL_SETUP?.currentPrice ?? BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO

  return [
  {
    icon: Wrench,
    name: 'Manutenção Mensal',
    description: 'Hospedagem e sustentação contínua do seu sistema com preço base flexível.',
    price: manutencaoPrecoFinal,
    priceLabel: `R$ ${manutencaoPrecoFinal}/mês`,
    originalPrice: hasVipCoupon ? manutencaoMensal : null,
    badge: hasVipCoupon ? 'Desconto VIP ativo' : null,
    popular: false,
    features: [
      'Hospedagem em servidor dedicado Linux',
      'Monitoramento de disponibilidade 24/7',
      'Pequenas correções e reparos inclusos',
      'Suporte via WhatsApp / e-mail',
      'Preço base inicial mínimo para operação padrão',
      'Depende da quantidade de informações e dados salvos',
      'Limites definidos de capacidade, tráfego e velocidade de tempo de resposta',
      'Filtros anti-DDoS e camadas extras de proteção sob consulta',
    ],
    cta: 'Contratar Manutenção',
    href: '/precos#contact',
  },
  {
    icon: Globe,
    name: 'Setup do Sistema',
    description: 'Configuração inicial de site, aplicativo ou sistema. Inclui 2h de programação + IA.',
    price: setupComercial,
    priceLabel: `R$ ${setupComercial}`,
    originalPrice: setupReferencia,
    badge: hasVipCoupon ? 'Indicação B2B ativa' : null,
    popular: true,
    features: [
      '2h de programação inclusas',
      `${BUSINESS_RULES.SETUP_SISTEMA_TOKENS_DIA.toLocaleString('pt-BR')} tokens/dia de IA`,
      `~${BUSINESS_RULES.SETUP_SISTEMA_PAGINAS_APROX} páginas de programação interligada`,
      'Deploy em produção (Vercel / servidor)',
      'Configuração de domínio .com.br',
      'Responsável técnico no registro.br',
      `Valor real de referência: R$ ${setupReferencia}`,
      'Desconto aplicado somente com indicação de parceiro B2B ativa',
    ],
    cta: 'Começar Setup',
    href: '/precos#contact',
  },
  {
    icon: Mail,
    name: 'Configuração de E-mail',
    description: 'Setup completo de e-mail profissional no domínio da empresa, sem desconto promocional.',
    price: emailSetupComercial,
    priceLabel: `R$ ${emailSetupComercial}`,
    originalPrice: null,
    badge: null,
    popular: false,
    features: [
      'Por sistema / por domínio',
      'E-mail profissional no domínio próprio',
      'Servidor SSantana Infraestrutura',
      `Manutenção: R$ ${BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL}/mês por e-mail`,
      'Parceria Google / Microsoft / Zoho (consultar)',
      'Domínio .com.br = mais credibilidade',
      'Preço público sem desconto comercial automático',
      'Condições comerciais avaliadas por escopo e necessidade',
    ],
    cta: 'Configurar E-mail',
    href: '/precos#contact',
  },
  {
    icon: Mail,
    name: 'E-mail Próprio (Servidor)',
    description: 'E-mail profissional com IMAP/POP/SMTP/Webmail em servidor próprio SSantana Infraestrutura.',
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
    href: '/email',
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
    href: '/email',
  },
  {
    icon: Star,
    name: 'Consultoria Estratégica',
    description: 'Consultoria com foco em decisão técnica, organização operacional e próximos passos aplicáveis.',
    price: null,
    priceLabel: hasVipCoupon ? 'R$ 200/h com indicação parceira' : 'R$ 400/h',
    originalPrice: null,
    badge: hasVipCoupon ? 'Condição parceira aplicada' : null,
    popular: false,
    features: [
      'Reunião consultiva com diagnóstico prático do cenário atual',
      'Plano objetivo de ações por prioridade e impacto',
      'Feedback pós-reunião para orientar execução',
      'Condição de R$ 200/h liberada somente por parceiro homologado',
    ],
    cta: 'Agendar Consultoria',
    href: '/precos#contact',
  },
  ]
}

export default function PricingSection() {
  const [couponInput, setCouponInput] = useState('')
  const [activeCode, setActiveCode] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [serviceMap, setServiceMap] = useState<Record<string, PublicPricingService>>({})

  useEffect(() => {
    void fetch('/api/pricing/public', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { services?: PublicPricingService[] }) => {
        const services = payload.services || []
        const mapped = services.reduce<Record<string, PublicPricingService>>((acc, item) => {
          acc[item.key] = item
          return acc
        }, {})
        setServiceMap(mapped)
      })
      .catch(() => {
        setServiceMap({})
      })
  }, [])

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

  const pricingPlans = useMemo(() => buildPricingPlans(serviceMap, hasVipCoupon), [serviceMap, hasVipCoupon])

  const setupDisplay = useMemo(() => {
    const fullPrice = serviceMap.SETUP_SISTEMA?.referencePrice ?? BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL
    const discounted = serviceMap.SETUP_SISTEMA?.currentPrice ?? BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO
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
            Escada de Investimento por Serviço
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Do plano de entrada ao cenário enterprise, você visualiza quanto investir e o que recebe em cada nível.
            <br />
            Suporte e hospedagem a partir de <strong>R$ {serviceMap.MANUTENCAO_MENSAL?.currentPrice ?? BUSINESS_RULES.MANUTENCAO_MENSAL}/mês</strong> (ou R$ 70/mês com indicação parceira para planos essenciais).
          </p>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Condições comerciais sujeitas à validação de escopo e elegibilidade.
          </div>

          <div className="mx-auto mt-2 max-w-3xl rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left">
            <p className="text-sm font-semibold text-cyan-800">Indicação VIP e Cupom de Parceiro</p>
            <p className="mt-2 text-sm text-cyan-900">
              {hasVipCoupon
                ? `Cupom ${activeCode} ativo. Desconto no setup liberado${partnerName ? ` por indicação de ${partnerName}` : ''}.`
                : 'Sem cupom ativo: exibimos apenas preço público. Desconto fica disponível somente no setup quando há indicação parceira válida.'}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Digite código de cupom/parceiro"
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

        <div className="mx-auto mb-10 grid max-w-6xl gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">E-mail corporativo: do mais barato ao mais robusto</p>
            <ol className="mt-3 space-y-2 text-sm text-emerald-900">
              <li>1. E-mail próprio em servidor SSANTANA: menor custo mensal por conta.</li>
              <li>2. Setup profissional de domínio e caixas: entrada estruturada e sem improviso.</li>
              <li>3. Google, Microsoft ou Zoho: maior investimento com ecossistema cloud avançado.</li>
            </ol>
          </article>
          <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">Sites e sistemas: da base ao enterprise</p>
            <ol className="mt-3 space-y-2 text-sm text-sky-900">
              <li>1. Setup de entrada: estrutura inicial para começar rápido com padrão profissional.</li>
              <li>2. Sustentação mensal: evolução contínua, correções e previsibilidade operacional.</li>
              <li>3. Projetos sob medida: integrações, APIs e arquitetura para operação em escala.</li>
            </ol>
          </article>
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
                        Cupom de parceiro B2B necessário para liberar o desconto
                      </p>
                    )}
                    {setupDisplay.applied && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Cupom {activeCode} aplicado com sucesso
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
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Condição especial sujeita à validação comercial
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
            <h4 className="font-bold text-gray-900 mb-2">Parceria Google / Microsoft / Zoho</h4>
            <p className="text-gray-600 text-sm">
              Para empresas que precisam de ferramentas avançadas além do e-mail (Drive, Meet, Teams, etc.),
              trabalhamos em parceria. O custo é superior ao e-mail básico, mas as funcionalidades extras
              podem valer muito dependendo da empresa.{' '}
              <strong>Solicite uma análise personalizada.</strong>
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">Como economizar sem comprometer a operação</h4>
            <p className="text-gray-600 text-sm">
              A manutenção mensal e o setup de e-mail ficam com preço público sem desconto automático.
              Para reduzir custo total com segurança, siga nossa trilha educacional com boas práticas de escopo,
              priorização e escolha de infraestrutura.
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-emerald-800 sm:flex-row sm:gap-4">
              <a href="/email" className="underline">Ver guia de economia em e-mail</a>
              <a href="/metodologia" className="underline">Ver trilha educacional completa</a>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">Por que usar .com.br?</h4>
            <p className="text-gray-600 text-sm">
              O domínio .com.br exige CPF ou CNPJ cadastrado no{' '}
              <a href="https://registro.br" target="_blank" rel="noreferrer" className="underline">registro.br</a>.
              O WHOIS brasileiro mostra quem é o dono — isso gera <strong>confiança real</strong> para seus clientes.
              Recomendamos que o cliente registre diretamente, com o Studio Santana como{' '}
              <strong>responsável técnico</strong> para facilitar manutenção e mudanças de servidor.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">Formas de pagamento</h4>
            <p className="text-gray-600 text-sm">
              Aceitamos <strong>PIX e Cartão de Crédito</strong>. O pagamento confirma o agendamento
              imediatamente. Reuniões de 15 minutos (pré-venda) são gratuitas — basta agendar pelo link.
              Reuniões de 30 ou 60 minutos são pagas e confirmadas após o pagamento.
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">Regra do suporte mensal</h4>
            <p className="text-gray-600 text-sm">
              O valor mensal de manutenção base é o mínimo indicado. Pode haver ajuste por ampliação de servidor, tráfego,
              volume de dados, velocidade de tempo de resposta e ativação de camadas de proteção contra ataques (como anti-DDoS e WAF).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
