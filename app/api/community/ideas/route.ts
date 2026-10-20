import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const SEED_IDEAS = [
  {
    title: 'Bloqueador de Chamadas de Não Contatos (Android)',
    description: 'Filtro inteligente 100% local e sem anúncios para bloquear chamadas de spam e números fora da sua agenda telefônica. Privacidade total sem transmissão de dados.',
    beneficiary: 'Qualquer pessoa incomodada com ligações inoportunas de telemarketing e tentativas de golpe.',
    category: 'Android / Segurança',
    status: 'CONCLUIDO',
    targetUrl: '/apks-livres/android/bloqueador-de-chamadas',
    votesCount: 84,
    suggestedByName: 'Diego Santana',
  },
  {
    title: 'Identificador & Alerta de Golpes em SMS e Mensagens',
    description: 'Ferramenta rápida para colar SMS, links ou mensagens suspeitas de falsos bancos/entregas e receber uma análise instantânea de segurança sem precisar de cadastro.',
    beneficiary: 'Cidadãos comuns e idosos frequentemente expostos a golpes financeiros por mensagem.',
    category: 'Web & Android',
    status: 'EM_DESENVOLVIMENTO',
    votesCount: 67,
    suggestedByName: 'Comunidade SSantana',
  },
  {
    title: 'Calculadora Simplificada de Direitos Trabalhistas Sem Coleta de Dados',
    description: 'Simulador claro de rescisão, férias e 13º sem formulários invasivos, sem propagandas e sem exigir CPF ou telefone.',
    beneficiary: 'Trabalhadores e prestadores de serviço que buscam conferir seus cálculos com privacidade.',
    category: 'Web / Utilidade Pública',
    status: 'VOTACAO',
    votesCount: 42,
    suggestedByName: 'Mariana Costa',
  },
  {
    title: 'Guia Interativo de Acessibilidade Digital para Pequenos Negócios',
    description: 'Checklist prático e ferramenta de teste para microempreendedores garantirem que seus sites e catálogos sejam acessíveis a pessoas com deficiência visual.',
    beneficiary: 'Pessoas com deficiência e pequenos empreendedores com foco em inclusão.',
    category: 'Acessibilidade / Web',
    status: 'VOTACAO',
    votesCount: 29,
    suggestedByName: 'Carlos Eduardo',
  },
]

export async function GET() {
  try {
    let ideas = await prisma.communityProjectIdea.findMany({
      orderBy: [
        { votesCount: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Se estiver vazio, realiza o seed inicial com as ideias da comunidade
    if (ideas.length === 0) {
      for (const item of SEED_IDEAS) {
        await prisma.communityProjectIdea.create({
          data: item,
        })
      }
      ideas = await prisma.communityProjectIdea.findMany({
        orderBy: [
          { votesCount: 'desc' },
          { createdAt: 'desc' },
        ],
      })
    }

    return NextResponse.json({
      success: true,
      ideas,
    })
  } catch (error: any) {
    console.error('Erro ao buscar ideias da comunidade:', error)
    return NextResponse.json(
      { success: false, error: 'Falha ao buscar projetos comunitários.' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, beneficiary, category, suggestedByName, suggestedByEmail } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Título e descrição detalhada são obrigatórios.' },
        { status: 400 }
      )
    }

    if (title.trim().length < 5 || description.trim().length < 15) {
      return NextResponse.json(
        { success: false, error: 'Forneça mais detalhes sobre sua proposta de projeto gratuito.' },
        { status: 400 }
      )
    }

    const newIdea = await prisma.communityProjectIdea.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        beneficiary: beneficiary ? beneficiary.trim() : null,
        category: category ? category.trim() : 'Utilidade Pública',
        status: 'VOTACAO',
        votesCount: 1, // Começa com o voto do criador
        suggestedByName: suggestedByName ? suggestedByName.trim() : 'Membro da Comunidade',
        suggestedByEmail: suggestedByEmail ? suggestedByEmail.trim() : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Sua ideia foi submetida com sucesso e já está disponível para votação!',
      idea: newIdea,
    })
  } catch (error: any) {
    console.error('Erro ao submeter ideia comunitária:', error)
    return NextResponse.json(
      { success: false, error: 'Não foi possível cadastrar a ideia no momento.' },
      { status: 500 }
    )
  }
}
