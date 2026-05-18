'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, Clock3, Link2, RefreshCcw, ShieldCheck, Wallet } from 'lucide-react'

const PARTNER_COMMISSION_RATE = 0.15
const PF_TAX_RATE = 0.11

type ComparisonData = {
  gross: number
  netPJ: number
  netPF: number
}

// Tabela de alíquotas educativas para RPA (Recibo de Pagamento Autônomo) - PF
const RPA_TAX_BRACKETS = [
  { range: 'Até R$ 1.903,98', inss: 0.08, irrf: 0, total: 0.08 },
  { range: 'R$ 1.903,99 a R$ 2.826,65', inss: 0.09, irrf: 0, total: 0.09 },
  { range: 'R$ 2.826,66 a R$ 3.751,05', inss: 0.11, irrf: 0, total: 0.11 },
  { range: 'Acima de R$ 3.751,05', inss: 0.11, irrf: 0.015, total: 0.125 },
]

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)
}

// Calcula o ganho recorrente mensal do parceiro com base nos clientes indicados.
function calculateMonthlyEarnings(indicatedClients: number, avgMonthlyTicket: number): number {
  return indicatedClients * avgMonthlyTicket * PARTNER_COMMISSION_RATE
}

// Separa os valores de saque para educar sobre retenções no modelo PF.
function calculateWithdrawComparison(totalCommission: number): ComparisonData {
  const netPF = totalCommission * (1 - PF_TAX_RATE)

  return {
    gross: totalCommission,
    netPJ: totalCommission,
    netPF,
  }
}

export default function PartnersRecruitmentPage() {
  const [indicatedClients, setIndicatedClients] = useState(10)
  const [avgMonthlyTicket, setAvgMonthlyTicket] = useState(500)

  const monthlyEarnings = useMemo(
    () => calculateMonthlyEarnings(indicatedClients, avgMonthlyTicket),
    [indicatedClients, avgMonthlyTicket],
  )

  const comparison = useMemo(
    () => calculateWithdrawComparison(monthlyEarnings),
    [monthlyEarnings],
  )

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-slate-100">
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_42%),radial-gradient(circle_at_80%_35%,_rgba(168,85,247,0.12),_transparent_38%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            <BadgeCheck className="h-4 w-4" />
            Programa de Parceiros B2B SSANTANA
          </div>

          <div className="mt-6 max-w-4xl">
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Indique clientes e ganhe 15% de comissao recorrente.
              <span className="mt-2 block text-cyan-200">Enquanto o cliente pagar, voce recebe.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-sm text-slate-300 sm:text-lg">
              Para profissionais de TI, agencias e consultores que querem monetizar sua rede com infraestrutura
              gerenciada de alta performance, sem aumentar a operacao.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              {
                icon: Link2,
                title: 'Link unico e rastreio seguro',
                description: 'Cada parceiro recebe identificacao exclusiva com cookies + codigo de indicacao.',
              },
              {
                icon: ShieldCheck,
                title: 'Saque minimo e protecao',
                description:
                  'Acumule R$ 200 em comissoes e saque 30 dias apos o pagamento confirmado do cliente.',
              },
              {
                icon: Wallet,
                title: 'Pagamento rapido',
                description: 'Receba direto na sua conta via PIX automatizado, sem burocracia operacional.',
              },
              {
                icon: BadgeCheck,
                title: 'Indicacao com 50% OFF no setup',
                description:
                  'Seu link exclusivo ativa automaticamente cupom de 50% no setup para seu indicado, facilitando o fechamento.',
              },
              {
                icon: Clock3,
                title: 'Compras futuras garantidas',
                description:
                  'Salvamos o rastreio em cookie e armazenamento local. Se o lead voltar depois direto ao site, a indicacao continua protegida.',
              },
              {
                icon: RefreshCcw,
                title: 'Regra do ultimo clique',
                description:
                  'Se houver mais de uma indicacao, vale a ultima registrada antes da compra. Follow-up e persistencia contam a seu favor.',
              },
            ].map((rule) => {
              const Icon = rule.icon

              return (
                <article
                  key={rule.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_40px_rgba(2,6,23,0.45)] backdrop-blur"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-cyan-400/15 p-2.5 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{rule.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{rule.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-white sm:text-3xl">
            Por que ser Parceiro SSANTANA?
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🎯',
                title: 'Comissao Recorrente',
                description:
                  'Ganhe 15% mensalmente enquanto o cliente pagar. Construa renda passiva crescente com cada indicacao.',
              },
              {
                icon: '📊',
                title: 'Dashboard Proprio',
                description:
                  'Acompanhe todas as suas indicacoes, comissoes acumuladas e saques em tempo real e transparente.',
              },
              {
                icon: '🚀',
                title: 'Zero Esforco Operacional',
                description:
                  'Compartilhe seu link e pronto. Nos cuidamos da venda, suporte e relacionamento com o cliente.',
              },
              {
                icon: '💰',
                title: 'Saque Facil e Rapido',
                description: 'PIX automatizado, sem burocracia. Saque minimo de R$ 200, creditado em sua conta rapidamente.',
              },
              {
                icon: '🛡️',
                title: 'Comissao Protegida',
                description:
                  'Se o lead clicar no seu link hoje e voltar semanas depois direto ao site, o rastreio salvo no navegador continua defendendo sua comissao.',
              },
              {
                icon: '🤝',
                title: 'Suporte Dedicado',
                description:
                  'Time SSANTANA disponivel para ajudar no acompanhamento, conversoes e otimizacao de suas indicacoes.',
              },
              {
                icon: '🔥',
                title: 'Persistencia Premiada',
                description:
                  'No nosso modelo de atribuicao, a ultima indicacao valida antes do fechamento vence. Quem faz follow-up melhor fecha mais.',
              },
              {
                icon: '📈',
                title: 'Inteligencia de Prospeccao',
                description:
                  'O parceiro acompanha novos acessos unicos e retornos ao site para saber quando insistir no contato e acelerar o fechamento.',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="mb-3 text-2xl">{benefit.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-cyan-300/15 bg-gradient-to-r from-cyan-400/10 via-slate-900 to-indigo-400/10 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Rastreio que joga a seu favor</p>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Seu link nao morre no primeiro clique.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Quando um prospect entra com seu codigo, o sistema guarda a indicacao em cookie e armazenamento local.
                Se ele sair, pensar melhor e voltar depois digitando o endereco direto, continuamos reconhecendo que veio por voce.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                E se outro parceiro entrar na conversa? A regra e objetiva: vale a ultima indicacao registrada antes da compra.
                Isso torna follow-up, relacionamento e insistencia comercial parte real da sua vantagem competitiva.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-white">O que o parceiro enxerga no painel</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-cyan-200">Novos prospectos unicos</p>
                  <p className="mt-1">Contamos apenas a primeira entrada valida por navegador para evitar duplicidade artificial.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-cyan-200">Retornos ao site</p>
                  <p className="mt-1">Cada volta organica do indicado vira sinal de aquecimento para orientar o proximo contato comercial.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-cyan-200">Fila prioritaria para o indicado</p>
                  <p className="mt-1">Quem chega por indicacao recebe atendimento prioritario e entra no funil com contexto comercial mais forte.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="scroll-mt-28 px-4 pb-20 sm:scroll-mt-32 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_10px_45px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Calculadora de Ganhos</p>
              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Projete sua renda passiva mensal</h3>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Ajuste os parametros e veja em tempo real quanto seu canal pode gerar com comissao recorrente.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <label htmlFor="clients">Quantidade de Clientes Indicados</label>
                  <span className="font-semibold text-white">{indicatedClients}</span>
                </div>
                <input
                  id="clients"
                  type="range"
                  min={1}
                  max={100}
                  value={indicatedClients}
                  onChange={(e) => setIndicatedClients(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400"
                />
                <input
                  type="number"
                  min={1}
                  value={indicatedClients}
                  onChange={(e) => setIndicatedClients(Math.max(1, Number(e.target.value) || 1))}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-white outline-none ring-cyan-400 transition focus:ring-2"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <label htmlFor="ticket">Ticket Medio Mensal do Cliente</label>
                  <span className="font-semibold text-white">{formatBRL(avgMonthlyTicket)}</span>
                </div>
                <input
                  id="ticket"
                  type="range"
                  min={100}
                  max={20000}
                  step={50}
                  value={avgMonthlyTicket}
                  onChange={(e) => setAvgMonthlyTicket(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400"
                />
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={avgMonthlyTicket}
                  onChange={(e) => setAvgMonthlyTicket(Math.max(100, Number(e.target.value) || 100))}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-white outline-none ring-cyan-400 transition focus:ring-2"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-[0_12px_55px_rgba(8,47,73,0.35)] sm:p-8">
            <p className="text-sm text-slate-300">Ganhos totais estimados</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-cyan-200 sm:text-5xl">{formatBRL(monthlyEarnings)}</p>
            <p className="mt-2 text-sm text-slate-300">por mes de renda passiva recorrente</p>

            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Comparativo de Saque</h4>

              <div className="rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-emerald-200">Opcao A: PJ / MEI (Recomendado)</p>
                  <span className="rounded-full bg-emerald-300/20 px-2.5 py-1 text-xs font-medium text-emerald-100">
                    100% liquido
                  </span>
                </div>
                <p className="mt-2 text-sm text-emerald-100">Bruto: {formatBRL(comparison.gross)}</p>
                <p className="text-sm text-emerald-100">Liquido: {formatBRL(comparison.netPJ)}</p>
                <p className="mt-2 text-xs text-emerald-100/90">Sem descontos retidos. Receba via PIX.</p>
              </div>

              <div className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-amber-200">Opcao B: Pessoa Fisica (CPF - RPA)</p>
                  <span className="rounded-full bg-amber-300/20 px-2.5 py-1 text-xs font-medium text-amber-100">
                    Imposto na fonte
                  </span>
                </div>
                <p className="mt-2 text-sm text-amber-100">Bruto: {formatBRL(comparison.gross)}</p>
                <p className="text-sm text-amber-100">Liquido: {formatBRL(comparison.netPF)}</p>
                <p className="mt-2 text-xs text-amber-100/90">Sujeito a retencao INSS + IRRF (RPA).</p>
              </div>

              <div className="mt-6 rounded-xl border border-cyan-300/15 bg-cyan-400/5 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
                  Tabela de aliquotas RPA (Pessoa Fisica)
                </p>
                <div className="space-y-2 text-xs text-cyan-100">
                  {RPA_TAX_BRACKETS.map((bracket, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-cyan-300/10 pb-2">
                      <span>{bracket.range}</span>
                      <span className="font-mono">
                        INSS {Math.round(bracket.inss * 100)}% + IRRF {Math.round(bracket.irrf * 100)}% = {Math.round(bracket.total * 100)}% total
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-cyan-100/80">
                  <strong>Nota:</strong> Estas aliquotas sao informativas. O calculo acima usa {Math.round(PF_TAX_RATE * 100)}% como estimativa media.
                  Consulte um contador para sua situacao especifica.
                </p>
              </div>
            </div>

            <a
              href="/criar-conta-parceiro"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Quero me tornar um Parceiro SSANTANA
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
