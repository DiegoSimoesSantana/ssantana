'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Blocks,
  Briefcase,
  CheckCircle2,
  Gift,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { BUSINESS_RULES } from '@/lib/business-rules'

const PARTNER_COMMISSION_RATE_MIN = 0.1
const PARTNER_COMMISSION_RATE_MAX = 0.2
const SETUP_PRICE = BUSINESS_RULES.SETUP_SISTEMA_PRECO_REAL
const MONTHLY_RETAINER = BUSINESS_RULES.MANUTENCAO_MENSAL
const FIRST_COMMISSION_MIN = SETUP_PRICE * PARTNER_COMMISSION_RATE_MIN
const FIRST_COMMISSION_MAX = SETUP_PRICE * PARTNER_COMMISSION_RATE_MAX
const MONTHLY_RECURRING_COMMISSION_MIN = MONTHLY_RETAINER * PARTNER_COMMISSION_RATE_MIN
const MONTHLY_RECURRING_COMMISSION_MAX = MONTHLY_RETAINER * PARTNER_COMMISSION_RATE_MAX
const ANNUAL_LTV_PER_CLIENT_MIN = FIRST_COMMISSION_MIN + MONTHLY_RECURRING_COMMISSION_MIN * 12
const ANNUAL_LTV_PER_CLIENT_MAX = FIRST_COMMISSION_MAX + MONTHLY_RECURRING_COMMISSION_MAX * 12
const WHATSAPP_URL = `https://wa.me/${BUSINESS_RULES.CONTACT.phoneRaw.replace('+', '')}?text=${encodeURIComponent(
  'Quero ativar meu link de indicação do programa de parceiros.',
)}`

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatBRLRange(min: number, max: number): string {
  return `${formatBRL(min)} a ${formatBRL(max)}`
}

export default function PartnersRecruitmentPage() {
  const [activeClients, setActiveClients] = useState(5)
  const [avgTicket, setAvgTicket] = useState(1200)

  const commissionSimulation = useMemo(() => {
    const monthlyMin = activeClients * avgTicket * PARTNER_COMMISSION_RATE_MIN
    const monthlyMax = activeClients * avgTicket * PARTNER_COMMISSION_RATE_MAX
    const yearlyMin = monthlyMin * 12
    const yearlyMax = monthlyMax * 12

    return { monthlyMin, monthlyMax, yearlyMin, yearlyMax }
  }, [activeClients, avgTicket])

  const stats = [
    {
      label: 'Primeira venda validada (setup)',
      value: formatBRLRange(FIRST_COMMISSION_MIN, FIRST_COMMISSION_MAX),
      note: 'Faixa de comissão para a primeira venda, com saque inicial liberado.',
    },
    {
      label: '3 clientes ativos',
      value: formatBRLRange(FIRST_COMMISSION_MIN * 3, FIRST_COMMISSION_MAX * 3),
      note: 'Validação rápida para manter ritmo de indicações.',
    },
    {
      label: 'Recorrência por cliente',
      value: formatBRLRange(MONTHLY_RECURRING_COMMISSION_MIN, MONTHLY_RECURRING_COMMISSION_MAX),
      note: 'Comissão recorrente entre 10% e 20% sobre receitas elegíveis.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#f5efe4] text-slate-900">
      <section className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(180,83,9,0.16),_transparent_30%),radial-gradient(circle_at_85%_20%,_rgba(15,118,110,0.18),_transparent_32%),linear-gradient(180deg,_rgba(255,251,235,0.96),_rgba(245,239,228,0.96))]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900 shadow-sm">
            <BadgeCheck className="h-4 w-4" />
            Programa de indicação SSANTANA
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:items-start">
            <div>
              <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                Canal B2B para agências, consultorias e parceiros estratégicos
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-6xl">
                Programa de Parceiros SSANTANA: receita recorrente com entrega técnica sólida
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                Indique nossos serviços de tecnologia, como desenvolvimento de sistemas SaaS, APIs, infraestrutura de servidores e marketing digital,
                e ganhe repasses recorrentes. Você define a estratégia: pode reter sua comissão integral ou compartilhá-la em forma de desconto
                exclusivo para atrair o cliente por meio de um link automático e personalizado.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/criar-conta-parceiro"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Gerar meu Link de Indicação
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-800/20 bg-teal-800/5 px-6 py-4 text-sm font-semibold text-teal-900 transition hover:bg-teal-800/10"
                >
                  Onboarding rápido no WhatsApp
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_32px_80px_rgba(15,23,42,0.25)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">O argumento que converte</p>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">A primeira indicação precisa virar recompensa rápida.</h2>
              <div className="mt-6 space-y-4">
                {[
                    'Comissão recorrente em faixa de 10% a 20%, com regras claras e leitura simples.',
                  'Seu cliente cai em página de indicação com linguagem comercial, sem jargão técnico.',
                  'Você tem kit de apoio para proposta, follow-up e fechamento com mais previsibilidade.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-300" />
                    <p className="text-sm leading-6 text-slate-200">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 p-5 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">Em 12 meses, um cliente ancorado vale</p>
                <p className="mt-2 text-4xl font-semibold">{formatBRLRange(ANNUAL_LTV_PER_CLIENT_MIN, ANNUAL_LTV_PER_CLIENT_MAX)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  Faixa projetada considerando setup inicial + manutenção mensal, sem contar upgrades adicionais.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-[0_24px_60px_rgba(16,185,129,0.08)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Regra comercial do parceiro</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Flexibilidade de desconto com mínimo líquido protegido</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            O parceiro sempre mantém no mínimo 10% de repasse líquido. Dentro da faixa de comissão aprovada (10% a 20%), ele pode escolher quanto
            quer conceder de desconto ao cliente final no próprio link automático.
          </p>
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900">
            Exemplo prático: comissão de 15%. O parceiro pode conceder 5% de desconto ao cliente e manter 10% de repasse para si.
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Calculadora de ganhos</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Simule sua recorrência como parceiro B2B</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Ajuste os parâmetros para visualizar potencial mensal e anual com comissão de 10% a 20%. É uma simulação comercial para orientar meta de carteira.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Clientes ativos indicados</span>
                <input
                  type="number"
                  min={1}
                  value={activeClients}
                  onChange={(event) => setActiveClients(Math.max(1, Number(event.target.value) || 1))}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Ticket médio mensal por cliente</span>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={avgTicket}
                  onChange={(event) => setAvgTicket(Math.max(100, Number(event.target.value) || 100))}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Mensal (10%)</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-900">{formatBRL(commissionSimulation.monthlyMin)}</p>
              </article>
              <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Mensal (20%)</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-900">{formatBRL(commissionSimulation.monthlyMax)}</p>
              </article>
              <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Anual (10%)</p>
                <p className="mt-2 text-3xl font-semibold text-amber-900">{formatBRL(commissionSimulation.yearlyMin)}</p>
              </article>
              <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Anual (20%)</p>
                <p className="mt-2 text-3xl font-semibold text-amber-900">{formatBRL(commissionSimulation.yearlyMax)}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-amber-50 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">Portfólio B2B: do mais acessível ao mais avançado</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-teal-200 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Entrada rápida</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">E-mail corporativo e sustentação base</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Ideal para primeiros fechamentos com ticket recorrente e entrega percebida rapidamente pelo cliente.</p>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Crescimento comercial</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">Sites profissionais, landing pages e automações</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Perfeito para escalar indicações com entregas visíveis, foco em captação e autoridade digital.</p>
            </article>
            <article className="rounded-2xl border border-slate-300 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Escala enterprise</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">Sistemas sob medida, APIs e operação robusta</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Indicado para contas maiores que exigem arquitetura, integrações e continuidade operacional.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(120,53,15,0.08)] sm:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Confiança para indicar',
                description: 'Seu cliente não associa sua indicação a queda, lentidão ou e-mail falhando.',
              },
              {
                icon: Banknote,
                title: 'Comissão imediata',
                description: 'A primeira venda já gera validação. O modelo favorece tração no início da parceria.',
              },
              {
                icon: WalletCards,
                title: 'Recorrência clara',
                description: 'Faixa de 10% a 20% sobre receitas elegíveis, com potencial de aumento por performance.',
              },
              {
                icon: TrendingUp,
                title: 'Rastreio simples',
                description: 'Link, cookie e painel mostram quando o indicado entrou e quando voltou a demonstrar interesse.',
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-[#fffaf2] p-5">
                  <div className="inline-flex rounded-2xl bg-amber-100 p-3 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="rounded-[2rem] border border-slate-900/10 bg-[#12312f] p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Prova de segurança</p>
            <h2 className="mt-4 text-3xl font-semibold">Seu nome continua protegido depois da indicação.</h2>
            <p className="mt-4 text-sm leading-7 text-teal-50/90 sm:text-base">
              A dor real de qualquer parceiro é indicar um serviço que gere problema depois. A SSANTANA entra como operação técnica
              para manter estabilidade, entrega e suporte responsável com o cliente final.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Base técnica para sustentar arquitetura, operação e tomada de decisão sob pressão.',
                'Experiência prática para estabilidade, deploy e resposta rápida a incidentes.',
                'Atendimento com contexto do parceiro para o cliente se sentir acompanhado desde o início.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Parceiros que já indicam a SSANTANA</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  company: 'Brasiville',
                  domain: 'https://brasville.com.br',
                  text: 'Projeto com acompanhamento contínuo, evolução de site e sustentação de RP interno para rotina operacional.',
                },
                {
                  company: 'Assegure Online',
                  domain: 'https://assegureonline.com.br',
                  text: 'Atuação especializada em proteção intelectual e registro de marcas, em parceria homologada com a SSANTANA.',
                },
                {
                  company: 'Ariserv',
                  domain: 'https://ariserv.com.br',
                  text: 'Sistema de perfil mais robusto, com operação objetiva em fluxos e páginas que a equipe realmente utiliza.',
                },
                {
                  company: 'advdourado',
                  domain: 'https://advdourado.com.br',
                  text: 'Estrutura de captação com páginas internas, subdomínios e apoio de SEO com uso aplicado de IA.',
                },
                {
                  company: 'Agente Apice',
                  domain: 'https://agenteapice.com.br',
                  text: 'Operação digital com foco em captação e comunicação clara para manter ritmo comercial constante.',
                },
                {
                  company: 'Voth Montagens',
                  domain: 'https://vothmontagens.com.br',
                  text: 'Presença online objetiva para suportar contato comercial e apresentação de serviços industriais.',
                },
              ].map((quote) => (
                <div key={quote.company} className="rounded-2xl border border-slate-200 bg-[#f8f4ec] p-5">
                  <p className="text-sm leading-7 text-slate-700">{quote.text}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Caso real: {quote.company}
                  </p>
                  <a
                    href={quote.domain}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-amber-700 transition hover:text-amber-800"
                  >
                    Visitar site
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-500">
              Nota institucional: Brasville e Assegure Online fazem parte da nossa rede de parceiros homologados para demandas estratégicas
              que complementam o ecossistema técnico dos clientes.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Como funciona na prática</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Transparência técnica sem linguagem difícil.</h2>
            <div className="mt-8 space-y-4">
              {[
                {
                  step: '01',
                  title: 'Você gera seu link e envia na proposta',
                  description: 'O cliente entra pela página VIP e recebe atendimento em linguagem acessível, com rastreio ativo.',
                },
                {
                  step: '02',
                  title: 'O sistema guarda a indicação',
                  description: 'Cookie e identificação local mantêm o rastreio ativo mesmo se o cliente sair e voltar depois.',
                },
                {
                  step: '03',
                  title: 'Você acompanha no painel e recebe',
                  description: 'O painel mostra visitas, retornos e status comercial para orientar seu follow-up.',
                },
              ].map((item) => (
                <div key={item.step} className="grid gap-4 rounded-2xl border border-slate-200 bg-[#fffaf2] p-5 sm:grid-cols-[72px,1fr] sm:items-start">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-teal-900/10 bg-gradient-to-br from-teal-900 to-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Preview do dashboard</p>
            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Blocks,
                  title: 'Leads únicos por parceiro',
                  description: 'Você sabe quantos clientes realmente chegaram pela sua indicação.',
                },
                {
                  icon: Briefcase,
                  title: 'Fila comercial',
                  description: 'O painel sinaliza quem voltou ao site e está mais quente para receber follow-up.',
                },
                {
                  icon: Gift,
                  title: 'Indicação Direta e Automatizada',
                  description:
                    'No painel, o parceiro cadastra a indicação PF/PJ e o sistema dispara imediatamente um e-mail personalizado com link e cupom da indicação.',
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex rounded-2xl bg-white/10 p-3 text-amber-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr,1.08fr]">
          <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-100 to-orange-100 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">Kit de habilitação de vendas</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">O parceiro não precisa improvisar argumento técnico.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
              O kit agora está em página completa com termos, exemplos visuais e roteiros práticos para uso comercial.
            </p>
            <Link
              href="/partners/kit-comercial"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Abrir página do kit comercial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Termos em página web',
                description: 'Tudo centralizado em uma página editável, sem dependência de PDF.',
              },
              {
                title: 'Comissão de 10% a 20%',
                description: 'Faixa clara de recorrência e condições para indicação direta com desconto extra ao cliente.',
              },
              {
                title: 'Múltiplos kits para baixar',
                description: 'Blocos visuais para proposta, mensagem e banner com espaço para URL do próprio parceiro.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[2.25rem] bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.3)] sm:p-10 lg:grid-cols-[1fr,0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Fechamento da campanha</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Se o seu cliente confia em você, a parte técnica não pode quebrar essa confiança.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Ative seu link exclusivo, leve o cliente para a landing VIP e acompanhe comissão recorrente em faixa de 10% a 20%.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Faixa de comissão</p>
                <p className="mt-2 text-2xl font-semibold text-white">10% a 20%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Mínimo líquido com desconto</p>
                <p className="mt-2 text-2xl font-semibold text-white">10%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Potencial anual por cliente</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatBRLRange(ANNUAL_LTV_PER_CLIENT_MIN, ANNUAL_LTV_PER_CLIENT_MAX)}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
              <p className="font-semibold text-white">Indicação direta com desconto adicional</p>
              <p className="mt-2">
                O parceiro poderá configurar desconto extra para o cliente indicado, cedendo parte da própria comissão.
                No repasse com desconto, o parceiro sempre fica com no mínimo 10% de comissão líquida por indicação validada.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/criar-conta-parceiro"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Gerar meu Link de Indicação
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Falar com o onboarding
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
