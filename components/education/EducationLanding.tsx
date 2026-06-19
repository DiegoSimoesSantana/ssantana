'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Code2,
  Database,
  Globe2,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  Sparkles,
  Mail,
  Calculator,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BUSINESS_RULES } from '@/lib/business-rules'

export type Language = 'pt' | 'en' | 'es'
type Period = 'daily' | 'weekly' | 'monthly'

type LangContent = {
  heroTitle: string
  heroSubtitle: string
  mvpTitle: string
  mvpText: string
  processTitle: string
  processSteps: string[]
  blocksTitle: string
  blocksText: string
  oopTitle: string
  oopItems: string[]
  stackTitle: string
  stackText: string
  stackItems: string[]
  leadershipTitle: string
  leadershipText: string
  pricingTitle: string
  pricingText: string
  pricingBullets: string[]
  robustTitle: string
  robustText: string
  securityTitle: string
  securityText: string
  emailOwnTitle: string
  emailOwnText: string
  emailOwnBullets: string[]
  emailCloudTitle: string
  emailCloudText: string
  trafficTitle: string
  trafficText: string
  trafficBullets: string[]
  calcLabelPeriod: string
  calcLabelAmount: string
  calcLabelReviews: string
  calcLabelUsers: string
  calcLabelUsd: string
  calcLabelFx: string
  calcEstimateTitle: string
  calcEstimateDisclaimer: string
  ctaTitle: string
  ctaText: string
  ctaPrimary: string
  ctaSecondary: string
}

const CONTENT: Record<Language, LangContent> = {
  pt: {
    heroTitle: 'Como projetamos sistemas: rápido no MVP, sólido na evolução',
    heroSubtitle:
      'Entregas rápidas são possíveis porque trabalhamos com escopo MVP, etapas claras e validação contínua com feedback do cliente.',
    mvpTitle: 'Entregas em MVP: por que são rápidas?',
    mvpText:
      'No MVP, focamos no problema principal e na funcionalidade que gera resultado imediato. Em vez de tentar construir tudo de uma vez, entregamos o núcleo funcional com alto padrão técnico e visual. Isso reduz retrabalho, acelera validação e evita custo desnecessário no início.',
    processTitle: 'Nosso processo em blocos',
    processSteps: [
      '1) Descoberta orientada a objetivo e métricas de negócio',
      '2) Planejamento técnico e definição do MVP (escopo mínimo útil)',
      '3) Arquitetura em blocos reutilizáveis com orientação a objetos',
      '4) Desenvolvimento incremental com testes e revisão',
      '5) Entrega, feedback do cliente e evolução para versões robustas',
    ],
    blocksTitle: 'Arquitetura por blocos',
    blocksText:
      'Cada sistema é dividido em blocos: Interface, Regras de Negócio, Integrações, Banco de Dados e Observabilidade. Assim, crescemos sem quebrar o que já funciona.',
    oopTitle: 'Boas práticas com orientação a objetos e engenharia',
    oopItems: [
      'Responsabilidade única por módulo e por componente',
      'Separação de camadas: UI, domínio, infraestrutura e dados',
      'Padrões de projeto quando agregam clareza e manutenção',
      'Código testável, legível e com convenções previsíveis',
      'Segurança e performance consideradas desde o início',
    ],
    stackTitle: 'Tecnologias como blocos de construção',
    stackText:
      'A linguagem é ferramenta. O que importa é atingir o objetivo do seu projeto com segurança, velocidade e escalabilidade.',
    stackItems: [
      'Frontend: React, JavaScript/TypeScript, CSS, HTML5',
      'Backend e APIs: Node.js, Python, PHP, Java, C#, C++, VB',
      'Banco de dados: PostgreSQL e integrações com outros bancos quando necessário',
      'Infra: Linux, cloud, automação de deploy e monitoramento',
      'IA aplicada: automações e assistentes com foco em produtividade real',
    ],
    leadershipTitle: 'Experiência de liderança técnica',
    leadershipText:
      'Nossa equipe conta com a experiência do Mestre Diego Simões Santana, com mais de 22 anos em TI e mais de 20 anos em área empresarial e finanças. Isso garante visão prática de negócio, arquitetura robusta e decisões de engenharia alinhadas ao retorno financeiro.',
    pricingTitle: 'Preço inicial claro + evolução por complexidade',
    pricingText:
      `Trabalhamos com preco de entrada para acelerar inicio do projeto. O setup inicial pode evoluir conforme a complexidade real do sistema e os requisitos tecnicos.`,
    pricingBullets: [
      `Suporte/Hospedagem base: R$ ${BUSINESS_RULES.MANUTENCAO_MENSAL}/mês para operação padrão`,
      `Desconto de indicação parceira: pode reduzir a manutenção básica de entrada para R$ 70/mês`,
      `Valor de referência cheio da manutenção: R$ ${BUSINESS_RULES.MANUTENCAO_MENSAL_REAL}/mês`,
      `Escalabilidade: preços sobem conforme tamanho de dados, velocidade, tempo de resposta e segurança (ex: filtros DDoS)`,
      `Setup de sistema: R$ ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO} (de R$ ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL} via indicação parceira)`,
      `Setup de e-mail: R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO} (de R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL})`,
      'Projetos maiores exigem planejamento técnico pago antes da execução completa',
    ],
    robustTitle: 'Projetos robustos exigem planejamento pago',
    robustText:
      'Para sistemas grandes, o próprio desenho de arquitetura já é uma entrega de alto valor. Por isso, antes da implementação completa, realizamos etapa formal de planejamento com pagamento dedicado. Isso protege prazo, orçamento e previsibilidade.',
    securityTitle: 'Como funciona a segurança e o tempo de resposta da hospedagem?',
    securityText:
      'Nossos servidores básicos possuem limites de capacidade, velocidade e tráfego. Caso seu sistema esteja em um nicho muito visado por ataques (como DDoS) ou demande resposta em milissegundos sob alta carga, ativamos camadas especiais de proteção anti-DDoS e firewalls de aplicação.',
    emailOwnTitle: 'Plano de E-mail Próprio (Servidor Studio Santana)',
    emailOwnText:
      'Ideal para empresas que querem baixo custo, controle e domínio próprio. Após setup, você pode criar regras de encaminhamento ilimitadas.',
    emailOwnBullets: [
      `Mensalidade: R$ ${BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL},00 por e-mail`,
      'Espaço: 5GB por conta de e-mail',
      'Protocolos: IMAP, POP, SMTP e Webmail',
      'Compatível com Outlook, Gmail e clientes que suportam IMAP/POP/SMTP',
      'Regras de encaminhamento: ilimitadas na configuração',
      'Adicionar/remover e-mail após setup: custo adicional de R$ 15,00 por alteração',
      `Setup obrigatório do e-mail: R$ ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO} (mesmo setup para todos os cenários de e-mail)`,
    ],
    emailCloudTitle: 'Google, Microsoft e Zoho (parceria)',
    emailCloudText:
      'Também trabalhamos com Google Workspace, Microsoft 365 e Zoho. O setup é o mesmo da configuração de e-mail, mas a mensalidade muda conforme plano, número de usuários, armazenamento e funcionalidades (ex: Business, Meet, OneDrive/Drive).',
    trafficTitle: 'Setup de Tráfego Pago com PNL + UX',
    trafficText:
      'Configuração estratégica para TikTok, Kwai, WhatsApp, Instagram, Facebook, Google, Google Maps, Waze e outros. A IA acelera análise, mas o diferencial está nas reuniões de entendimento: quem é a empresa, quem compra dela e como converter melhor.',
    trafficBullets: [
      'Coletamos orçamento por plataforma (dia/semana/mês)',
      'Definimos funil, criativos e hipóteses com foco em venda',
      'Planejamos reuniões de revisão de setup e ajustes de performance',
      'Preço exibido é estimativa inicial; valor final fecha após reunião estratégica',
    ],
    calcLabelPeriod: 'Período',
    calcLabelAmount: 'Valor',
    calcLabelReviews: 'Reuniões de revisão',
    calcLabelUsers: 'Usuários',
    calcLabelUsd: 'US$ por usuário/mês',
    calcLabelFx: 'Câmbio BRL/USD',
    calcEstimateTitle: 'Estimativa automática (pré-reunião)',
    calcEstimateDisclaimer:
      'Esta calculadora serve para referência inicial. O preço oficial é definido após reunião estratégica de entendimento.',
    ctaTitle: 'Comece com MVP e escale com segurança',
    ctaText:
      'Você entra com um investimento inicial acessível, valida rápido com seu cliente final e evolui em ciclos estruturados.',
    ctaPrimary: 'Agendar Reunião',
    ctaSecondary: 'Ver Preços',
  },
  en: {
    heroTitle: 'How we design systems: fast MVP, solid evolution',
    heroSubtitle:
      'Fast delivery works because we build in MVP scope, clear milestones, and continuous client feedback loops.',
    mvpTitle: 'MVP delivery: why is it fast?',
    mvpText:
      'In MVP mode, we prioritize the core business problem and the functionality that generates immediate value. Instead of building everything at once, we ship a high-quality functional core first, then iterate with real feedback.',
    processTitle: 'Our block-based process',
    processSteps: [
      '1) Goal-driven discovery and business metrics',
      '2) Technical planning and MVP definition',
      '3) Block architecture with object-oriented design',
      '4) Incremental development with tests and review',
      '5) Delivery, client feedback, and robust evolution roadmap',
    ],
    blocksTitle: 'Block architecture',
    blocksText:
      'Each solution is divided into blocks: Interface, Business Rules, Integrations, Database, and Observability. This enables growth without breaking stable features.',
    oopTitle: 'Object-oriented and engineering best practices',
    oopItems: [
      'Single responsibility per module and component',
      'Layer separation: UI, domain, infrastructure, data',
      'Design patterns when they improve clarity and maintenance',
      'Readable, testable, predictable code conventions',
      'Security and performance from day one',
    ],
    stackTitle: 'Technology as building blocks',
    stackText:
      'Language is a tool. What matters is achieving your project goal with speed, security, and scalability.',
    stackItems: [
      'Frontend: React, JavaScript/TypeScript, CSS, HTML5',
      'Backend and APIs: Node.js, Python, PHP, Java, C#, C++, VB',
      'Databases: PostgreSQL and additional engines when required',
      'Infrastructure: Linux, cloud, deployment automation, monitoring',
      'Applied AI: practical automations and productivity-focused assistants',
    ],
    leadershipTitle: 'Senior technical leadership',
    leadershipText:
      'Our team is guided by Mestre Diego Simoes Santana, with 22+ years in IT and 20+ years in business and finance. This combines technical depth with practical business decisions.',
    pricingTitle: 'Clear entry price + complexity-based evolution',
    pricingText:
      `We offer an entry price to start quickly. Current setup starts at BRL ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO} (promo), and evolves according to real complexity.`,
    pricingBullets: [
      `Base Support/Hosting: BRL ${BUSINESS_RULES.MANUTENCAO_MENSAL}/month for standard operations`,
      `Referral Discount: reduces basic maintenance to BRL 70/month with an active B2B partner coupon`,
      `Full Reference Price: BRL ${BUSINESS_RULES.MANUTENCAO_MENSAL_REAL}/month`,
      `Scalability: pricing scales with storage, speed, response times, and protection layers (e.g., anti-DDoS)`,
      `System Setup: BRL ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO} (from BRL ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL} with coupon)`,
      `Email Setup: BRL ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO} (from BRL ${BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL})`,
      'Large projects require paid planning before full build',
    ],
    robustTitle: 'Robust projects require paid planning',
    robustText:
      'For large systems, architecture planning itself is a high-value deliverable. We run a formal paid planning phase before full implementation to protect scope, timeline, and budget.',
    securityTitle: 'How do hosting security and response times work?',
    securityText:
      'Our basic servers have capacity, speed, and traffic limits. If your system operates in a niche highly targeted by attacks (like DDoS) or requires millisecond response times under high loads, we activate special anti-DDoS protection layers and application firewalls.',
    emailOwnTitle: 'Private Email Plan (Studio Santana Server)',
    emailOwnText:
      'Best for low-cost business email with full control and custom domain. After setup, forwarding rules can be created with no fixed limit.',
    emailOwnBullets: [
      `Monthly fee: BRL ${BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL} per mailbox`,
      'Storage: 5GB per mailbox',
      'Protocols: IMAP, POP, SMTP, and Webmail',
      'Compatible with Outlook, Gmail, and IMAP/POP/SMTP clients',
      'Unlimited forwarding rules during configuration',
      'Add/remove mailbox after setup: BRL 15 per change',
      `Mandatory setup: BRL ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO}`,
    ],
    emailCloudTitle: 'Google, Microsoft and Zoho (partnership)',
    emailCloudText:
      'We also deliver Google Workspace, Microsoft 365 and Zoho deployments. Setup price is the same, but monthly subscription depends on users, storage and features (Business, Meet, Office, cloud file storage).',
    trafficTitle: 'Paid Traffic Setup with NLP + UX',
    trafficText:
      'Strategic setup for TikTok, Kwai, WhatsApp, Instagram, Facebook, Google, Google Maps, Waze and more. AI helps speed analysis, but conversion quality comes from strategic meetings to understand your company and buyer profile.',
    trafficBullets: [
      'Collect ad spend by platform (day/week/month)',
      'Define funnel, creative strategy, and conversion goals',
      'Plan setup review meetings for optimization',
      'Displayed price is an initial estimate; final quote after strategy call',
    ],
    calcLabelPeriod: 'Period',
    calcLabelAmount: 'Amount',
    calcLabelReviews: 'Review meetings',
    calcLabelUsers: 'Users',
    calcLabelUsd: 'USD per user/month',
    calcLabelFx: 'FX BRL/USD',
    calcEstimateTitle: 'Automatic estimate (pre-meeting)',
    calcEstimateDisclaimer:
      'This calculator is an initial reference only. Official pricing is confirmed after the strategic meeting.',
    ctaTitle: 'Start with MVP and scale safely',
    ctaText:
      'You start with an affordable entry plan, validate quickly with real users, and scale through structured iterations.',
    ctaPrimary: 'Book a Meeting',
    ctaSecondary: 'See Pricing',
  },
  es: {
    heroTitle: 'Como disenhamos sistemas: MVP rápido, evolución sólida',
    heroSubtitle:
      'Las entregas rápidas funcionan porque trabajamos con alcance MVP, etapas claras y feedback continuo del cliente.',
    mvpTitle: 'Entrega MVP: por qué es rápida?',
    mvpText:
      'En modo MVP priorizamos el problema principal y la funcionalidad que genera valor inmediato. En lugar de construir todo al mismo tempo, entregamos un núcleo funcional de alta calidad y evolucionamos con retroalimentación real.',
    processTitle: 'Nuestro proceso por bloques',
    processSteps: [
      '1) Descubrimiento orientado a objetivos y métricas',
      '2) Planificación técnica y definición del MVP',
      '3) Arquitectura por bloques con orientación a objetos',
      '4) Desarrollo incremental con pruebas y revisión',
      '5) Entrega, feedback del cliente y evolución robusta',
    ],
    blocksTitle: 'Arquitectura por bloques',
    blocksText:
      'Cada solución se divide en bloques: Interfaz, Reglas de Negocio, Integraciones, Base de Datos y Observabilidad. Así crecemos sin romper lo que ya funciona.',
    oopTitle: 'Buenas prácticas con OOP e ingeniería',
    oopItems: [
      'Responsabilidad única por módulo y componente',
      'Separación de capas: UI, dominio, infraestructura, datos',
      'Patrones de diseño cuando mejoran claridad y mantenimiento',
      'Código legible, testeable y predecible',
      'Segurança y performance desde el inicio',
    ],
    stackTitle: 'Tecnologías como bloques de construcción',
    stackText:
      'El lenguaje es una herramienta. Lo importante es alcanzar el objetivo del proyecto con seguridad, velocidad y escalabilidad.',
    stackItems: [
      'Frontend: React, JavaScript/TypeScript, CSS, HTML5',
      'Backend y APIs: Node.js, Python, PHP, Java, C#, C++, VB',
      'Base de datos: PostgreSQL y otros motores cuando sea necesario',
      'Infraestructura: Linux, cloud, automatización de deploy y monitoreo',
      'IA aplicada: automatizaciones y asistentes con foco en productividad real',
    ],
    leadershipTitle: 'Ingeniería y sociedad: visión de propietario',
    leadershipText:
      'Nuestro equipo cuenta con la experiencia del Mestre Diego Simoes Santana, con más de 22 años en TI y finanzas. Al contratar a Studio Santana, usted no solo compra código, sino un socio estratégico que entiende de flujo de caja y arquitectura resiliente.',
    pricingTitle: 'Precio inicial claro + evolución por complejidad',
    pricingText:
      `Trabajamos con precio de entrada para comenzar rápido. Hoy el setup inicial parte de BRL ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO} (promoción) y evoluciona según la complejidad real.`,
    pricingBullets: [
      `Soporte/Hospedaje base: BRL ${BUSINESS_RULES.MANUTENCAO_MENSAL}/mes para operación estándar`,
      `Descuento por recomendación: reduce el mantenimiento básico a BRL 70/mes con cupón activo`,
      `Precio de referencia real: BRL ${BUSINESS_RULES.MANUTENCAO_MENSAL_REAL}/mes`,
      `Escalabilidad: el precio sube según volumen de datos, velocidad, tiempo de respuesta y seguridad (ej. filtros DDoS)`,
      `Setup del sistema: BRL ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_PROMO} (de BRL ${BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL} con cupón)`,
      `Setup de correo: BRL ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO} (de BRL ${BUSINESS_RULES.EMAIL_SETUP_PRECO_REAL})`,
      'Proyectos grandes requieren planificación paga antes de la ejecución completa',
    ],
    robustTitle: 'Proyectos robustos requieren planificación paga',
    robustText:
      'Para sistemas grandes, el diseno de arquitectura ya es una entrega de alto valor. Por eso realizamos una fase formal de planificación con pago dedicado antes de implementar todo.',
    securityTitle: '¿Cómo funciona la seguridad y el tiempo de respuesta del hosting?',
    securityText:
      'Nuestros servidores básicos tienen límites de capacidad, velocidad y tráfico. Si su sistema opera en un nicho altamente atacado (como DDoS) o requiere tiempos de respuesta en milisegundos bajo alta carga, activamos capas especiales de protección anti-DDoS y firewalls de aplicación.',
    emailOwnTitle: 'Plan de correo propio (Servidor Studio Santana)',
    emailOwnText:
      'Ideal para empresas que buscan costo bajo, control y dominio propio. Después del setup, puedes definir reglas de reenvío sin límite fijo.',
    emailOwnBullets: [
      `Mensualidad: BRL ${BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL} por correo`,
      'Espacio: 5GB por cuenta',
      'Protocolos: IMAP, POP, SMTP y Webmail',
      'Compatible con Outlook, Gmail y clientes IMAP/POP/SMTP',
      'Reenvío: reglas ilimitadas en la configuración',
      'Agregar/quitar correo después del setup: BRL 15 por cambio',
      `Setup obligatorio: BRL ${BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO}`,
    ],
    emailCloudTitle: 'Google, Microsoft y Zoho (alianza)',
    emailCloudText:
      'También implementamos Google Workspace, Microsoft 365 y Zoho. El setup es el mismo, pero el costo mensual depende de usuarios, almacenamiento y funcionalidades.',
    trafficTitle: 'Setup de Tráfego Pago con PNL + UX',
    trafficText:
      'Configuración estratégica para TikTok, Kwai, WhatsApp, Instagram, Facebook, Google, Google Maps, Waze y otros. La IA acelera análisis, pero lo más importante son las reuniones para entender empresa y comprador.',
    trafficBullets: [
      'Recogemos presupuesto por plataforma (día/semana/mes)',
      'Definimos embudo, mensajes y objetivos de conversión',
      'Planificamos reuniones de revisión del setup',
      'Precio mostrado es estimación inicial; valor final tras reunión estratégica',
    ],
    calcLabelPeriod: 'Período',
    calcLabelAmount: 'Valor',
    calcLabelReviews: 'Reuniones de revisión',
    calcLabelUsers: 'Usuarios',
    calcLabelUsd: 'US$ por usuario/mes',
    calcLabelFx: 'Cambio BRL/USD',
    calcEstimateTitle: 'Estimación automática (pre-reunión)',
    calcEstimateDisclaimer:
      'Esta calculadora es solo referencia inicial. El precio oficial se confirma tras la reunión estratégica.',
    ctaTitle: 'Empieza con MVP y escala con seguridad',
    ctaText:
      'Comienzas con una inversión inicial accesible, validas rápido con usuarios reales y evolucionas en ciclos estructurados.',
    ctaPrimary: 'Agendar Reunión',
    ctaSecondary: 'Ver Precios',
  },
}

const LANG_BUTTONS: Array<{ value: Language; label: string }> = [
  { value: 'pt', label: 'PT-BR' },
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
]

const PLATFORMS = ['TikTok', 'Kwai', 'WhatsApp', 'Instagram', 'Facebook', 'Google', 'Google Maps', 'Waze'] as const

type BudgetEntry = {
  enabled: boolean
  period: Period
  amount: string
}

const initialBudgets: Record<string, BudgetEntry> = Object.fromEntries(
  PLATFORMS.map((p) => [p, { enabled: false, period: 'daily' as Period, amount: '' }])
)

function periodToMonthly(period: Period, value: number) {
  if (period === 'daily') return value * 30
  if (period === 'weekly') return value * 4.33
  return value
}

function parseMoney(v: string): number {
  const normalized = v.replace(',', '.').trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function brl(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)
}

export default function EducationLanding({
  initialLang = 'pt',
  lockLanguage = false,
}: {
  initialLang?: Language
  lockLanguage?: boolean
}) {
  const [lang, setLang] = useState<Language>(initialLang)
  const [trafficBudgets, setTrafficBudgets] = useState<Record<string, BudgetEntry>>(initialBudgets)
  const [reviewMeetings, setReviewMeetings] = useState('2')
  const [emailUnits, setEmailUnits] = useState('5')
  const [emailChanges, setEmailChanges] = useState('0')
  const [cloudUsers, setCloudUsers] = useState('10')
  const [cloudUsdPerUser, setCloudUsdPerUser] = useState('7')
  const [usdFx, setUsdFx] = useState('5.40')

  const t = useMemo(() => CONTENT[lang], [lang])

  const trafficEstimate = useMemo(() => {
    const monthlyMedia = Object.values(trafficBudgets).reduce((sum, item) => {
      if (!item.enabled) return sum
      const amount = parseMoney(item.amount)
      return sum + periodToMonthly(item.period, amount)
    }, 0)

    const meetings = Math.max(0, Math.round(parseMoney(reviewMeetings)))
    const setupBase = 980
    const setupByScale = monthlyMedia * 0.1
    const aiAndData = Math.max(180, monthlyMedia * 0.04)
    const reviewCost = meetings * 220

    const estimate = setupBase + setupByScale + aiAndData + reviewCost
    return { monthlyMedia, estimate, meetings }
  }, [trafficBudgets, reviewMeetings])

  const ownEmailEstimate = useMemo(() => {
    const units = Math.max(0, Math.round(parseMoney(emailUnits)))
    const changes = Math.max(0, Math.round(parseMoney(emailChanges)))
    return {
      units,
      changes,
      monthly: units * BUSINESS_RULES.EMAIL_MENSAL_POR_EMAIL,
      changesCost: changes * 15,
      setup: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
    }
  }, [emailUnits, emailChanges])

  const cloudEmailEstimate = useMemo(() => {
    const users = Math.max(0, Math.round(parseMoney(cloudUsers)))
    const usdPerUser = parseMoney(cloudUsdPerUser)
    const fx = parseMoney(usdFx)
    const monthlyBrl = users * usdPerUser * fx
    return {
      users,
      monthlyBrl,
      setup: BUSINESS_RULES.EMAIL_SETUP_PRECO_PROMO,
    }
  }, [cloudUsers, cloudUsdPerUser, usdFx])

  function updateBudget(platform: string, patch: Partial<BudgetEntry>) {
    setTrafficBudgets((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        ...patch,
      },
    }))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-28 pb-20 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <section className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/10 dark:text-amber-100 animate-fade-in">
              <Sparkles size={16} />
              Educational Playbook • MVP to Scale
            </div>
            {!lockLanguage && (
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800/70">
                {LANG_BUTTONS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setLang(item.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      lang === item.value
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-150 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
            <h1 className="text-3xl md:text-5xl leading-tight font-black tracking-tight text-slate-950 dark:text-white mb-5">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-200 max-w-4xl leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 mb-4 flex items-center gap-2">
                <Code2 size={20} /> {t.mvpTitle}
              </h2>
              <p className="text-slate-700 dark:text-slate-200 leading-8 text-lg">{t.mvpText}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> {t.processTitle}
              </h2>
              <ul className="space-y-3">
                {t.processSteps.map((step) => (
                  <li key={step} className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-slate-700 leading-7 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                    {step}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {lang === 'pt' && (
            <section className="mt-6 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50/50 via-white to-emerald-50/50 p-7 dark:border-cyan-800/30 dark:from-cyan-950/20 dark:via-slate-900 dark:to-emerald-950/20">
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Desenvolvimento de sites e sistemas: do mais enxuto ao enterprise</h3>
              <p className="mt-3 text-slate-700 dark:text-slate-200 leading-8">
                Use esta escala para orientar proposta comercial, expectativa de prazo e nível de robustez esperado pelo cliente.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-650 dark:text-slate-400">
                O atendimento e a liderança de projeto são sempre feitos diretamente pelo Engenheiro de Software Sócio da empresa (decisor técnico).
                As camadas de desenvolvimento técnico são realizadas de forma interna, garantindo que o atendimento nunca é delegado a profissionais sem a capacidade técnica necessária de te orientar.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-800/40 dark:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">1. Essencial</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Site institucional + captação</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Entrada para negócios que precisam presença digital profissional com baixo risco de implantação.</p>
                </article>
                <article className="rounded-xl border border-cyan-200 bg-white p-4 dark:border-cyan-800/40 dark:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">2. Profissional</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Sistema com regras de negócio</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Ideal para operação com área logada, fluxos internos, integrações e evolução mensal contínua.</p>
                </article>
                <article className="rounded-xl border border-violet-200 bg-white p-4 dark:border-violet-800/40 dark:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">3. Enterprise</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Arquitetura de escala + APIs</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Projetos com alta criticidade, integrações complexas e governança técnica para crescimento acelerado.</p>
                </article>
              </div>
            </section>
          )}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-violet-750 dark:text-violet-300 mb-3 flex items-center gap-2">
                <Code2 size={18} /> {t.blocksTitle}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-8">{t.blocksText}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                <ShieldCheck size={18} /> {t.oopTitle}
              </h3>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {t.oopItems.map((item) => (
                  <li key={item} className="rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 px-3 py-2">• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-cyan-700 dark:text-cyan-300 mb-3 flex items-center gap-2">
                <Database size={18} /> {t.stackTitle}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-7 mb-3">{t.stackText}</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {t.stackItems.map((item) => (
                  <li key={item} className="rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 px-3 py-2">• {item}</li>
                ))}
              </ul>
            </article>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-3">{t.leadershipTitle}</h3>
            <p className="text-lg text-slate-755 dark:text-slate-300 leading-8">{t.leadershipText}</p>
          </section>

          <section id="email" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-3">{t.pricingTitle}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-8 mb-4">{t.pricingText}</p>
              <ul className="space-y-2">
                {t.pricingBullets.map((item) => (
                  <li key={item} className="rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-100">• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-violet-700 dark:text-violet-300 mb-3">{t.robustTitle}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-8 mb-6">{t.robustText}</p>

              <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 px-4 py-4 dark:border-cyan-800/40 dark:bg-cyan-900/10">
                <h4 className="font-bold text-cyan-800 dark:text-cyan-200 mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} /> {t.securityTitle}
                </h4>
                <p className="text-slate-700 dark:text-slate-350 leading-7">{t.securityText}</p>
              </div>
            </article>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 mb-3 flex items-center gap-2">
                <Mail size={20} /> {t.emailOwnTitle}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-8 mb-4">{t.emailOwnText}</p>
              <ul className="space-y-2 mb-5">
                {t.emailOwnBullets.map((item) => (
                  <li key={item} className="rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-100">• {item}</li>
                ))}
              </ul>

              <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 dark:border-cyan-800/40 dark:bg-cyan-900/10">
                <h4 className="font-bold text-cyan-800 dark:text-cyan-200 mb-3 flex items-center gap-2">
                  <Calculator size={16} /> {t.calcEstimateTitle}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <label className="text-sm">
                    <span className="block mb-1 text-slate-700 dark:text-slate-300">Contas de e-mail</span>
                    <input
                      type="number"
                      min={0}
                      value={emailUnits}
                      onChange={(e) => setEmailUnits(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="block mb-1 text-slate-700 dark:text-slate-300">Alterações (add/remove)</span>
                    <input
                      type="number"
                      min={0}
                      value={emailChanges}
                      onChange={(e) => setEmailChanges(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                    />
                  </label>
                </div>
                <p className="text-slate-800 dark:text-slate-200">Setup: <strong>{brl(ownEmailEstimate.setup)}</strong></p>
                <p className="text-slate-800 dark:text-slate-200">Mensal estimado: <strong>{brl(ownEmailEstimate.monthly)}</strong></p>
                <p className="text-slate-800 dark:text-slate-200">Custos de alterações: <strong>{brl(ownEmailEstimate.changesCost)}</strong></p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                <Mail size={20} /> {t.emailCloudTitle}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-8 mb-4">{t.emailCloudText}</p>

              <div className="rounded-xl border border-amber-250 bg-amber-50/50 p-4 space-y-3 dark:border-amber-800/40 dark:bg-amber-900/10">
                <h4 className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <Calculator size={16} /> {t.calcEstimateTitle}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="text-sm">
                    <span className="block mb-1 text-slate-700 dark:text-slate-300">{t.calcLabelUsers}</span>
                    <input
                      type="number"
                      min={0}
                      value={cloudUsers}
                      onChange={(e) => setCloudUsers(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="block mb-1 text-slate-700 dark:text-slate-300">{t.calcLabelUsd}</span>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={cloudUsdPerUser}
                      onChange={(e) => setCloudUsdPerUser(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="block mb-1 text-slate-700 dark:text-slate-300">{t.calcLabelFx}</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={usdFx}
                      onChange={(e) => setUsdFx(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                    />
                  </label>
                </div>
                <p className="text-slate-800 dark:text-slate-200">Setup: <strong>{brl(cloudEmailEstimate.setup)}</strong></p>
                <p className="text-slate-800 dark:text-slate-200">Mensal estimado (BRL): <strong>{brl(cloudEmailEstimate.monthlyBrl)}</strong></p>
                <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                  Valor estimado sujeito a oscilação cambial (USD/BRL) e política de preço dos provedores.
                </p>
              </div>
            </article>
          </section>

          <section id="trafego" className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
              <Megaphone size={20} /> {t.trafficTitle}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-8 mb-4">{t.trafficText}</p>
            <ul className="space-y-2 mb-6">
              {t.trafficBullets.map((item) => (
                <li key={item} className="rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-100">• {item}</li>
              ))}
            </ul>

            <div className="rounded-xl border border-emerald-250 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-900/10">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center gap-2">
                <Calculator size={16} /> {t.calcEstimateTitle}
              </h4>

              <div className="space-y-3">
                {PLATFORMS.map((platform) => {
                  const row = trafficBudgets[platform]
                  return (
                    <div key={platform} className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-lg bg-white border border-slate-150 dark:bg-slate-800/40 dark:border-slate-700/50 p-3">
                      <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={(e) => updateBudget(platform, { enabled: e.target.checked })}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        {platform}
                      </label>
                      <label className="text-sm">
                        <span className="block mb-1 text-slate-600 dark:text-slate-300">{t.calcLabelPeriod}</span>
                        <select
                          value={row.period}
                          onChange={(e) => updateBudget(platform, { period: e.target.value as Period })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                        >
                          <option value="daily">Dia</option>
                          <option value="weekly">Semana</option>
                          <option value="monthly">Mês</option>
                        </select>
                      </label>
                      <label className="text-sm">
                        <span className="block mb-1 text-slate-650 dark:text-slate-300">{t.calcLabelAmount} (R$)</span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={row.amount}
                          onChange={(e) => updateBudget(platform, { amount: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="block mb-1 text-slate-650 dark:text-slate-300">{t.calcLabelReviews}</span>
                        <input
                          type="number"
                          min={0}
                          value={reviewMeetings}
                          onChange={(e) => setReviewMeetings(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white outline-none"
                        />
                      </label>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800/40 dark:bg-emerald-900/10">
                <p className="text-slate-800 dark:text-slate-100">Mídia mensal estimada: <strong>{brl(trafficEstimate.monthlyMedia)}</strong></p>
                <p className="text-slate-800 dark:text-slate-100">Preço estimado de setup: <strong>{brl(trafficEstimate.estimate)}</strong></p>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-2 font-medium">{t.calcEstimateDisclaimer}</p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-emerald-250 bg-gradient-to-r from-emerald-50 to-cyan-50 p-7 md:p-10 dark:border-emerald-800/30 dark:from-emerald-950/20 dark:to-cyan-950/20">
            <h3 className="text-3xl font-black text-slate-950 dark:text-white mb-3">{t.ctaTitle}</h3>
            <p className="text-lg md:text-xl text-slate-700 dark:text-emerald-300 leading-8 mb-6">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                {t.ctaPrimary} <ArrowRight size={18} />
              </Link>
              <Link
                href="/precos"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  )
}
