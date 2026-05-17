import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Users, TrendingUp, DollarSign, Calculator } from 'lucide-react'
import { BUSINESS_RULES, calculateCommissionAmount, formatCurrency } from '@/lib/business-rules'

export const metadata: Metadata = {
  title: 'Programa de Parceiros',
  description: 'Indique clientes e ganhe comissões de 5% a 25%. Sistema transparente com dashboard exclusivo.',
}

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
              <DollarSign size={16} />
              <span className="text-sm font-medium">Ganhe até 25% de comissão</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Programa de Parceiros
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Indique clientes para a Studio Santana e ganhe comissões recorrentes.
              Sistema 100% transparente com dashboard exclusivo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#calculator"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Calcular Minha Comissão
              </a>
              <a
                href="/sign-up?type=partner"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold border-2 border-primary-600"
              >
                Cadastrar como Parceiro
              </a>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Como Funciona
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Cadastre-se', description: 'Crie sua conta de parceiro gratuitamente' },
                { step: '2', title: 'Indique', description: 'Compartilhe seu link único com potenciais clientes' },
                { step: '3', title: 'Acompanhe', description: 'Veja o status das indicações no seu dashboard' },
                { step: '4', title: 'Receba', description: 'Receba suas comissões mensalmente ou após conclusão' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Tabela de Comissões
            </h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Valor do Projeto</th>
                    <th className="px-6 py-4 text-left">Comissão</th>
                    <th className="px-6 py-4 text-left">Exemplo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {BUSINESS_RULES.COMMISSION_TIERS.map((tier, index) => {
                    const exampleValue = ('max' in tier ? (tier as any).max : 60000)
                    const commission = calculateCommissionAmount(exampleValue)
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {('max' in tier)
                            ? `${formatCurrency(tier.min)} - ${formatCurrency((tier as any).max)}`
                            : `Acima de ${formatCurrency(tier.min)}`}
                        </td>
                        <td className="px-6 py-4 font-bold text-primary-600">{tier.label}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatCurrency(exampleValue)} = {formatCurrency(commission)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center mb-8">
              <Calculator className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Calculadora de Comissões
              </h2>
              <p className="text-gray-600">
                Simule quanto você pode ganhar indicando projetos
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8">
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Valor do Projeto (R$)
                </label>
                <input
                  type="number"
                  id="projectValue"
                  min="0"
                  step="100"
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div id="result" className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-2">Sua Comissão:</p>
                <p className="text-4xl font-bold text-primary-600" id="commissionAmount">R$ 0,00</p>
                <p className="text-sm text-gray-500 mt-2" id="commissionRate">0%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Rules */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Regras de Pagamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Projetos Parcelados
                </h3>
                <p className="text-gray-600 mb-4">
                  Para projetos pagos em parcelas, você recebe sua comissão mensalmente
                  proporcional por até 12 meses.
                </p>
                <p className="text-sm text-gray-500">
                  Exemplo: Projeto de R$ 12.000 em 12x → Comissão mensal de R$ 50 por 12 meses (5%)
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Projetos Concluídos
                </h3>
                <p className="text-gray-600 mb-4">
                  Quando o cliente aceita o projeto finalizado, você recebe
                  sua comissão integral imediatamente.
                </p>
                <p className="text-sm text-gray-500">
                  Exemplo: Projeto de R$ 5.000 aceito → Comissão de R$ 250 paga na mesma semana (5%)
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="/sign-up?type=partner"
                className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
              >
                Começar a Ganhar Comissões Agora
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('projectValue')?.addEventListener('input', function(e) {
          const value = parseFloat(e.target.value) || 0;
          const tiers = ${JSON.stringify(BUSINESS_RULES.COMMISSION_TIERS)};
          
          const tier = tiers.find(t => value >= t.min && (!t.max || value <= t.max));
          const rate = tier?.rate || 0.05;
          const commission = value * rate;
          
          document.getElementById('commissionAmount').textContent = 
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(commission);
          document.getElementById('commissionRate').textContent = 
            (rate * 100).toFixed(0) + '% de comissão';
        });
      `}} />
    </>
  )
}
