'use client'

import { ShieldCheck, Award, CheckCircle2, ArrowUpRight, Cpu, Lock } from 'lucide-react'

export default function AuthoritySection() {
  const homologatedClients = [
    { name: 'Brasville', area: 'Logística & Distribuição' },
    { name: 'Assegure Online', area: 'Seguros & Finanças' },
    { name: 'Ariserv', area: 'Serviços Especializados' },
    { name: 'advdourado', area: 'Escritório Jurídico' },
    { name: 'Agente Apice', area: 'Operação Comercial' },
    { name: 'Voth Montagens', area: 'Engenharia Industrial' },
  ]

  return (
    <section className="py-20 px-4 bg-slate-50 dark:bg-zinc-900/60 border-t border-slate-200 dark:border-white/10 transition-colors">
      <div className="container mx-auto max-w-5xl">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
            Autoridade & Prova Social
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Seu Guardião de Servidores & Engenharia de TI
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2">
            Mais de duas décadas de experiência prática para proteger, otimizar e escalar as operações do seu negócio.
          </p>
        </div>

        {/* Card Principal: Liderança Diego Santana */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-lg shadow-sky-600/30">
              DS
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Mestre Diego Simões Santana
                </h3>
                <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                  Mestre em Ciência da Computação • Engenheiro de Software Sênior
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                Com <strong>+22 anos de atuação em Tecnologia da Informação</strong> e <strong>+20 anos no ecossistema de negócios e investimentos</strong>, Diego lidera a arquitetura técnica de cada projeto. Seu atendimento não é terceirizado para estagiários: você conversa e valida escopo diretamente com quem tem competência sênior para solucionar e entregar.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-xs">
                  <span className="font-bold block text-slate-900 dark:text-white">+22 Anos de TI</span>
                  <span className="text-slate-500 dark:text-zinc-400">Engenharia e infraestrutura Linux</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-xs">
                  <span className="font-bold block text-slate-900 dark:text-white">Decisor Técnico</span>
                  <span className="text-slate-500 dark:text-zinc-400">Contato direto sem intermediários</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-xs">
                  <span className="font-bold block text-slate-900 dark:text-white">Blindagem Legal</span>
                  <span className="text-slate-500 dark:text-zinc-400">Contratos auditados Anti-MED</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.linkedin.com/in/diegobassa/?locale=pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 transition"
                >
                  Conectar no LinkedIn
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Casos Reais Homologados */}
        <div>
          <div className="text-center mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Casos Reais Homologados & Atendidos
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {homologatedClients.map((client) => (
              <div
                key={client.name}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-center shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition"
              >
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{client.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 truncate">{client.area}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
