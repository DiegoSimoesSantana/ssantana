'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  FileText,
  HelpCircle,
  Building2,
  UserCheck
} from 'lucide-react'

export default function PartnersRecruitmentPage() {
  const [activeClients, setActiveClients] = useState(5)
  const [avgTicket, setAvgTicket] = useState(500)

  // Simulação de Nível 1 (15%) e Nível 2 (20%)
  const simulation = useMemo(() => {
    const grossMonthly = activeClients * avgTicket
    const nivel1Monthly = grossMonthly * 0.15
    const nivel2Monthly = grossMonthly * 0.20

    // Comparativo Tributário de Saque (PJ vs PF)
    const saquePjLiquido = nivel1Monthly // 100% líquido com NFSe
    const saquePfRpa = nivel1Monthly * 0.88 // 12% retido INSS/IRRF
    const retencaoPf = nivel1Monthly * 0.12

    return {
      grossMonthly,
      nivel1Monthly,
      nivel2Monthly,
      saquePjLiquido,
      saquePfRpa,
      retencaoPf,
    }
  }, [activeClients, avgTicket])

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white transition-colors flex flex-col justify-between">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-6xl flex-1">
        
        {/* Top Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-4">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>Programa Oficial de Parceiros SSantana</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Monetize sua Rede com Infraestrutura de TI e Sistemas com IA
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
            Escolha entre atuar como <strong>Afiliado Indicador (15% fixo)</strong> ou como <strong>Parceiro Comercial em Ensino Comissionado (até 20%)</strong>, recebendo treinamento técnico prático e suporte para fechar propostas de alto valor.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/criar-conta-parceiro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition active:scale-95"
            >
              <span>Cadastrar como Parceiro Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-bold text-sm transition"
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Simular Ganhos na Calculadora</span>
            </a>
          </div>
        </div>

        {/* Os 2 Níveis de Parceria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Nível 1: Indicador */}
          <div className="rounded-3xl border-2 border-sky-500/40 bg-white dark:bg-zinc-900 p-8 shadow-sm relative flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 mb-4 inline-block">
                Nível 1 • Entrada Imediata
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Afiliado Indicador
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Ideal para profissionais, contadores, advogados e agências que desejam apenas recomendar nossos serviços e receber comissão recorrente garantida.
              </p>

              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>15% de comissão recorrente fixa</strong> sobre pagamentos confirmados.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Seu link dá automaticamente <strong>50% OFF no Setup</strong> para seu cliente.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Rastreio Last-Click com cookies e local storage sem perda de atribuição.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Saque mínimo liberado a partir de R$ 200,00 via PIX.</span>
                </div>
              </div>
            </div>

            <Link
              href="/criar-conta-parceiro"
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm text-center transition"
            >
              Entrar como Indicador (15%)
            </Link>
          </div>

          {/* Nível 2: Comercial Treinado */}
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-white dark:bg-zinc-900 p-8 shadow-sm relative flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-4 inline-block">
                Nível 2 • Ensino Comissionado
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Comercial Treinado
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Para parceiros em formação que atuam ativamente junto com a SSantana no processo de prospecção e fechamento de clientes.
              </p>

              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>20% de comissão base recorrente</strong> sobre os contratos fechados.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Cessão de desconto flexível de até 10% mantendo sempre o piso de 10% líquido.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Acesso à <strong>Academia Comercial & Kit de Vendas</strong> com roteiros práticos.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Cadastro manual direto de leads PF e PJ com envio de convite formal.</span>
                </div>
              </div>
            </div>

            <Link
              href="/criar-conta-parceiro"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center transition"
            >
              Entrar em Ensino Comissionado (20%)
            </Link>
          </div>

        </div>

        {/* CALCULADORA DE GANHOS INTERATIVA (#calculator) */}
        <section id="calculator" className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-sm mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Planejamento Financeiro
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Calculadora de Ganhos & Comparativo de Saque
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2">
              Veja quanto você pode faturar mensalmente e entenda a vantagem do Funil de Formalização PJ (100% líquido) vs PF (RPA).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Controles de Simulação */}
            <div className="space-y-6 bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-slate-200 dark:border-zinc-700">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-2">
                  <span>Clientes Ativos Mantidos:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{activeClients} clientes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={activeClients}
                  onChange={(e) => setActiveClients(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-2">
                  <span>Ticket Médio por Cliente:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{formatBRL(avgTicket)}/mês</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="3000"
                  step="50"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <p>Volume Total Gerado pelos Clientes: <strong>{formatBRL(simulation.grossMonthly)}/mês</strong></p>
                <p>Comissão Nível 1 (15%): <strong>{formatBRL(simulation.nivel1Monthly)}/mês</strong></p>
                <p>Comissão Nível 2 (20%): <strong>{formatBRL(simulation.nivel2Monthly)}/mês</strong></p>
              </div>
            </div>

            {/* Comparativo Visual de Saque: Opção A (PJ) vs Opção B (PF) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Comparativo Tributário no Saque (Nível 1 - 15%)
              </h3>

              {/* Opção A: PJ/MEI */}
              <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Opção A: PJ ou MEI</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase">
                    100% Líquido
                  </span>
                </div>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatBRL(simulation.saquePjLiquido)}
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Sem nenhuma retenção na fonte. Você emite a NFSe de intermediação e recebe o valor integral via PIX.
                </p>
              </div>

              {/* Opção B: PF / RPA */}
              <div className="p-5 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                    <span className="font-bold text-sm text-slate-800 dark:text-zinc-200">Opção B: Pessoa Física (CPF)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    Retenção Legal RPA (12%)
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatBRL(simulation.saquePfRpa)}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Retenção compulsória de impostos (INSS/IRRF: -{formatBRL(simulation.retencaoPf)}). Líquido pago via PIX.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* FAQ COM CLÁUSULA EXPLÍCITA ANTI-MMN */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-sm mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Perguntas Frequentes & Diretrizes de Conformidade
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Transparência jurídica e governança clara</p>
            </div>
          </div>

          <div className="space-y-6 text-sm divide-y divide-slate-100 dark:divide-zinc-800">
            
            {/* Cláusula Anti-MMN */}
            <div className="pt-6 first:pt-0">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Existe recrutamento multinível (MMN) ou pirâmide no programa?
              </h4>
              <p className="mt-2 text-slate-600 dark:text-zinc-300 leading-relaxed">
                <strong>Não. É terminantemente proibido qualquer formato de MMN ou rede multinível.</strong> O programa da SSantana é estritamente de <strong>afiliação direta de 1º nível</strong>. Você ganha comissão unicamente sobre clientes reais indicados por você que contrataram e pagaram pelos serviços de tecnologia da SSantana. Não há taxa de entrada, nem ganho por cadastro de novos parceiros.
              </p>
            </div>

            <div className="pt-6">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Por que existe uma retenção de 30 dias após o pagamento do cliente?
              </h4>
              <p className="mt-2 text-slate-600 dark:text-zinc-300 leading-relaxed">
                A retenção D+30 é a praxe dos programas de tecnologia para garantir a estabilidade do fluxo financeiro, mitigar riscos de estornos bancários (chargebacks/MED) e assegurar a homologação da entrega técnica do serviço. Após os 30 dias, o valor transita automaticamente para seu saldo liberado.
              </p>
            </div>

            <div className="pt-6">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Como funciona a cessão de desconto de até 10% no Nível 2?
              </h4>
              <p className="mt-2 text-slate-600 dark:text-zinc-300 leading-relaxed">
                No Nível 2 (Comercial Treinado), sua comissão base é de 20%. Para ajudar a destravar vendas difíceis, você pode configurar no seu link até 10% de desconto para o cliente final. A regra do sistema garante que você nunca receba menos que o piso de 10% líquido protegido.
              </p>
            </div>

            <div className="pt-6">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Qual o valor mínimo para solicitar saque?
              </h4>
              <p className="mt-2 text-slate-600 dark:text-zinc-300 leading-relaxed">
                O threshold para liberação do botão de saque no painel é de <strong>R$ 200,00 de saldo liberado</strong>. Atingido esse valor, você escolhe se prefere o resgate como PJ/MEI (100% líquido mediante envio da NFSe) ou PF (com retenção tributária legal de 11% a 13%).
              </p>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
