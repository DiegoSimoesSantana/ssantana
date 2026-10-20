'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Heart,
  Phone,
  Shield,
  Zap,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  Lock,
  PlusCircle,
  Copy,
  ExternalLink,
  CreditCard,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Send
} from 'lucide-react'

interface CommunityIdea {
  id: string
  title: string
  description: string
  beneficiary: string | null
  category: string
  status: string
  votesCount: number
  targetUrl?: string | null
  suggestedByName?: string | null
  createdAt: string
}

export default function DoacoesPage() {
  // Estados para doação
  const [selectedAmount, setSelectedAmount] = useState<number>(10)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorDocument, setDonorDocument] = useState('')
  const [donorMessage, setDonorMessage] = useState('')
  const [targetProject, setTargetProject] = useState('Geral')

  const [generatingDonation, setGeneratingDonation] = useState(false)
  const [donationResult, setDonationResult] = useState<{
    referenceId: string
    paymentUrl: string
    amount: number
    qrcode: {
      content: string
      base64Image: string
    }
  } | null>(null)
  const [donationError, setDonationError] = useState<string | null>(null)
  const [copiedPix, setCopiedPix] = useState(false)

  // Estados para ideias comunitárias
  const [ideas, setIdeas] = useState<CommunityIdea[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(true)
  const [votingId, setVotingId] = useState<string | null>(null)
  const [votedIds, setVotedIds] = useState<string[]>([])
  const [voteMessage, setVoteMessage] = useState<string | null>(null)

  // Modal para submeter nova ideia
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newBeneficiary, setNewBeneficiary] = useState('')
  const [newCategory, setNewCategory] = useState('Android / Segurança')
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [submittingIdea, setSubmittingIdea] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Carregar ideias
  const loadIdeas = async () => {
    try {
      const res = await fetch('/api/community/ideas', { cache: 'no-store' })
      const data = await res.json()
      if (data.success && data.ideas) {
        setIdeas(data.ideas)
      }
    } catch (e) {
      console.error('Erro ao carregar projetos comunitários:', e)
    } finally {
      setLoadingIdeas(false)
    }
  }

  useEffect(() => {
    loadIdeas()
    // Carregar IDs votados do localStorage
    try {
      const raw = localStorage.getItem('ssantana_community_voted')
      if (raw) setVotedIds(JSON.parse(raw))
    } catch (e) {}
  }, [])

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount

  // Gerar Doação via PIX / Cartão
  const handleGenerateDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    setDonationError(null)

    if (currentAmount < 1) {
      setDonationError('O valor mínimo de contribuição é de R$ 1,00.')
      return
    }

    setGeneratingDonation(true)
    try {
      const res = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAmount,
          donorName: donorName || undefined,
          donorEmail: donorEmail || undefined,
          donorDocument: donorDocument || undefined,
          message: donorMessage || undefined,
          targetProject,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar cobrança.')
      }

      setDonationResult({
        referenceId: data.referenceId,
        paymentUrl: data.paymentUrl,
        amount: data.amount,
        qrcode: data.qrcode,
      })
    } catch (err: any) {
      setDonationError(err.message || 'Erro ao processar doação.')
    } finally {
      setGeneratingDonation(false)
    }
  }

  // Copiar PIX
  const handleCopyPix = () => {
    if (donationResult?.qrcode?.content) {
      navigator.clipboard.writeText(donationResult.qrcode.content)
      setCopiedPix(true)
      setTimeout(() => setCopiedPix(false), 3000)
    }
  }

  // Votar em projeto
  const handleVote = async (ideaId: string) => {
    if (votedIds.includes(ideaId)) {
      setVoteMessage('Você já registrou seu voto neste projeto!')
      setTimeout(() => setVoteMessage(null), 3000)
      return
    }

    setVotingId(ideaId)
    try {
      const res = await fetch('/api/community/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      })
      const data = await res.json()
      if (data.success) {
        setIdeas((prev) =>
          prev.map((item) => (item.id === ideaId ? { ...item, votesCount: data.votesCount } : item))
        )
        const updated = [...votedIds, ideaId]
        setVotedIds(updated)
        try {
          localStorage.setItem('ssantana_community_voted', JSON.stringify(updated))
        } catch (e) {}
        setVoteMessage('Voto computado com sucesso! Obrigado pelo apoio.')
      } else {
        setVoteMessage(data.message || 'Não foi possível registrar o voto.')
      }
    } catch (e) {
      setVoteMessage('Erro de conexão ao votar.')
    } finally {
      setVotingId(null)
      setTimeout(() => setVoteMessage(null), 3500)
    }
  }

  // Submeter nova ideia
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)
    setSubmittingIdea(true)

    try {
      const res = await fetch('/api/community/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          beneficiary: newBeneficiary,
          category: newCategory,
          suggestedByName: submitterName,
          suggestedByEmail: submitterEmail,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao submeter ideia.')
      }

      setSubmitSuccess('Ideia submetida com sucesso! Ela já entrou na fila de votação.')
      setNewTitle('')
      setNewDescription('')
      setNewBeneficiary('')
      setSubmitterName('')
      setSubmitterEmail('')
      loadIdeas()
      setTimeout(() => {
        setShowSubmitModal(false)
        setSubmitSuccess(null)
      }, 2500)
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao cadastrar ideia.')
    } finally {
      setSubmittingIdea(false)
    }
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-sky-50/60 via-white to-white dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950 py-16 sm:py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Iniciativa Solidária & Tecnologia Livre</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Apoie Projetos Gratuitos e Apps Livres de Anúncios
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              Desenvolvemos e mantemos aplicativos de utilidade pública 100% gratuitos, com zero anúncios e total privacidade.
              Sua doação espontânea — <strong>a partir de R$ 1,00</strong> — mantém nossos servidores ativos e financia novas ferramentas para quem mais precisa.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#fazer-doacao"
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/20 transition flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Apoiar com PIX ou Cartão (A partir de R$ 1)
              </a>
              <a
                href="#projetos-comunidade"
                className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-white font-bold text-sm transition flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4 text-sky-500" />
                Votar nas Próximas Criações
              </a>
            </div>

          </div>
        </section>

        {/* PROJETO CONCLUÍDO EM DESTAQUE: BLOQUEADOR DE CHAMADAS */}
        <section className="py-12 px-4 container mx-auto max-w-5xl">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 text-left max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ Liberado Gratuitamente
                  </span>
                  <span className="text-xs text-indigo-300">Android APK Oficial</span>
                </div>
                <h3 className="text-2xl font-black">Bloqueador de Chamadas de Não Contatos</h3>
                <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                  Criado pela nossa equipe para proteger cidadãos contra golpes bancários e chamadas abusivas de telemarketing.
                  Funciona 100% localmente no aparelho, sem rastreamento, sem propagandas e sem custos.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-300 pt-1">
                  <span>✓ 100% Livre de Anúncios</span>
                  <span>✓ Zero Coleta de Dados</span>
                  <span>✓ Código Blindado</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="/apks-livres/android/bloqueador-de-chamadas"
                  className="px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs text-center transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-indigo-600" />
                  Ver Detalhes do APK
                </a>
                <button
                  onClick={() => {
                    setTargetProject('Bloqueador de Chamadas')
                    const el = document.getElementById('fazer-doacao')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Doar para este App
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* WIDGET DE DOAÇÃO RÁPIDA (PIX OU CARTÃO DE CRÉDITO) */}
        <section id="fazer-doacao" className="py-12 px-4 container mx-auto max-w-4xl">
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                Contribuição Voluntária
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Fazer uma Doação para os Projetos Gratuitos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto">
                Escolha qualquer valor a partir de R$ 1,00. Pague via PIX instantâneo ou Cartão de Crédito.
              </p>
            </div>

            {/* SELEÇÃO DE VALORES */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Selecione ou Digite o Valor (R$):
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[5, 10, 25, 50, 100, 200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(val)
                      setCustomAmount('')
                    }}
                    className={`py-3 px-2 rounded-2xl text-xs font-black transition border ${
                      selectedAmount === val && !customAmount
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                        : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 hover:border-rose-400'
                    }`}
                  >
                    {formatBRL(val)}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Ou digite outro valor livre (a partir de R$ 1,00):
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.50"
                    placeholder="Ex: 15,00"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {/* FORMULÁRIO DE APOIO */}
            {!donationResult ? (
              <form onSubmit={handleGenerateDonation} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1">
                      Seu Nome / Apelido (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: João Silva ou Apoiador Anônimo"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1">
                      Seu E-mail (Opcional - para comprovante)
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1">
                    Destinar Doação para um Projeto Específico:
                  </label>
                  <select
                    value={targetProject}
                    onChange={(e) => setTargetProject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  >
                    <option value="Geral">Fundo Geral de Apps e Projetos Livres</option>
                    <option value="Bloqueador de Chamadas">Bloqueador de Chamadas (Android)</option>
                    <option value="Alerta de Golpes SMS">Identificador & Alerta de Golpes</option>
                    <option value="Calculadora Trabalhista">Calculadora Trabalhista Privada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1">
                    Mensagem de Apoio / Sugestão (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Escreva uma mensagem de incentivo ou sugestão para nossa equipe..."
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs"
                  />
                </div>

                {donationError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300">
                    {donationError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={generatingDonation || currentAmount < 1}
                  className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm transition shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {generatingDonation
                    ? 'Gerando QR Code PIX e Link de Pagamento...'
                    : `Contribuir com ${formatBRL(currentAmount)} via PIX ou Cartão`}
                </button>
              </form>
            ) : (
              /* CARD DE PAGAMENTO DA DOAÇÃO */
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 space-y-5 text-center animate-fade-in">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-700">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Cobrança de Doação Gerada!</span>
                  </div>
                  <button
                    onClick={() => setDonationResult(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                  >
                    Alterar valor
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-500">Valor da Contribuição:</span>
                  <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
                    {formatBRL(donationResult.amount)}
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Ref: {donationResult.referenceId}
                  </span>
                </div>

                {/* QR Code Imagem PNG */}
                {donationResult.qrcode?.base64Image && (
                  <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 inline-block mx-auto">
                    <img
                      src={donationResult.qrcode.base64Image}
                      alt="QR Code PIX Doação"
                      className="w-48 h-48 object-contain mx-auto"
                    />
                    <span className="text-[11px] text-slate-500 font-medium block mt-2">
                      Aponte a câmera do seu banco para ler o QR Code
                    </span>
                  </div>
                )}

                {/* Botões PIX Copia e Cola & Cartão */}
                <div className="space-y-2.5 max-w-md mx-auto">
                  {donationResult.qrcode?.content && (
                    <button
                      onClick={handleCopyPix}
                      className="w-full py-3 px-4 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-sky-300 dark:border-sky-800 transition"
                    >
                      <Copy className="w-4 h-4 text-sky-600" />
                      {copiedPix ? '✓ Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}
                    </button>
                  )}

                  {donationResult.paymentUrl && (
                    <a
                      href={donationResult.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pagar com Cartão de Crédito ou PIX no App
                    </a>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  ❤️ Muito obrigado por ajudar a manter ferramentas livres e seguras no ar!
                </p>
              </div>
            )}

          </div>
        </section>

        {/* SEÇÃO: ESTEIRA DE PROJETOS & VOTAÇÃO DA COMUNIDADE */}
        <section id="projetos-comunidade" className="py-12 px-4 container mx-auto max-w-5xl space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Priorização Participativa
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Projetos Solicitados & Votação da Comunidade
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Vote nas ferramentas que você acha importante existirem. Os mais votados entram diretamente na esteira de desenvolvimento!
              </p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/20 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Sugerir Novo Projeto Gratuito
            </button>
          </div>

          {voteMessage && (
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-semibold text-sky-800 dark:text-sky-300 text-center animate-fade-in">
              {voteMessage}
            </div>
          )}

          {/* LISTA DE PROJETOS E IDEIAS */}
          {loadingIdeas ? (
            <div className="py-12 text-center text-xs text-slate-500 animate-pulse">
              Carregando projetos da comunidade...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ideas.map((idea) => {
                const isVoted = votedIds.includes(idea.id)
                return (
                  <div
                    key={idea.id}
                    className="p-6 rounded-3xl bg-slate-50/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4 hover:border-sky-400 dark:hover:border-sky-600 transition"
                  >
                    <div className="space-y-3">
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                          {idea.category}
                        </span>

                        {idea.status === 'CONCLUIDO' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ✓ Liberado
                          </span>
                        )}
                        {idea.status === 'EM_DESENVOLVIMENTO' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            ⚙ Em Desenvolvimento
                          </span>
                        )}
                        {idea.status === 'VOTACAO' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            🗳 Em Votação
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {idea.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {idea.description}
                      </p>

                      {idea.beneficiary && (
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          <strong>Público Beneficiado:</strong> {idea.beneficiary}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-4 h-4 text-sky-500" />
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {idea.votesCount} {idea.votesCount === 1 ? 'voto' : 'votos'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {idea.targetUrl && (
                          <a
                            href={idea.targetUrl}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-[11px] font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                          >
                            Acessar APK
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleVote(idea.id)}
                          disabled={votingId === idea.id || isVoted}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isVoted
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                          } disabled:opacity-70`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {isVoted ? '✓ Votado' : votingId === idea.id ? 'Votando...' : 'Votar'}
                        </button>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}

        </section>

        {/* MODAL: SUBMETER NOVA IDEIA */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Sugerir Novo Projeto Gratuito
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Sua proposta será exibida publicamente para votação
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {submitSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  {submitSuccess}
                </div>
              )}

              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs text-rose-800 dark:text-rose-300 font-semibold">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmitIdea} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-1">
                    Nome da Ferramenta / Aplicativo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alerta de SMS Falso ou Calculadora de Direitos"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  >
                    <option value="Android / Segurança">Android / Segurança</option>
                    <option value="Web / Utilidade Pública">Web / Utilidade Pública</option>
                    <option value="Acessibilidade / Inclusão">Acessibilidade / Inclusão</option>
                    <option value="Educação / Cidadania">Educação / Cidadania</option>
                    <option value="Outro">Outra Categoria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-1">
                    Descrição do que o app deve fazer *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explique como o app ajudará as pessoas no dia a dia..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-1">
                    Quem se beneficia dessa ferramenta?
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Idosos, autônomos, pequenos comerciantes"
                    value={newBeneficiary}
                    onChange={(e) => setNewBeneficiary(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-1">
                      Seu Nome (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-1">
                      Seu E-mail (Opcional - avisamos se aprovado)
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={submitterEmail}
                      onChange={(e) => setSubmitterEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingIdea}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-lg shadow-sky-600/20 disabled:opacity-50"
                  >
                    {submittingIdea ? 'Submetendo Proposta...' : 'Enviar para Votação Comunitária'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  )
}
