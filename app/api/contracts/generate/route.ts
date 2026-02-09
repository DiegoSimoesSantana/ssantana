import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { formatCurrency, CANCELLATION_RETENTION, MAX_REFUND_NOT_STARTED } from '@/lib/business-rules'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const { projectId } = await request.json()

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        contract: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    // Gerar HTML do contrato
    const contractHtml = generateContractHTML(project)

    // Criar/atualizar contrato no banco
    const contract = await prisma.contract.upsert({
      where: { projectId: project.id },
      create: {
        projectId: project.id,
        clientId: project.clientId,
        totalValue: project.totalValue,
        status: 'PENDING',
        template: project.includesSourceCode ? 'source_code' : 'standard',
        content: {
          html: contractHtml,
          projectTitle: project.title,
          projectDescription: project.description,
          estimatedHours: project.estimatedHours,
          hourlyRate: project.hourlyRate,
          deliveryDays: project.deliveryDays,
        },
        clauses: {
          cancellationPolicy: true,
          sourceCodeRights: project.includesSourceCode,
          aiUsageDisclosure: true,
        },
        paymentSchedule: {
          installments: 1,
          firstPaymentDate: new Date(),
        },
        includesSourceCode: project.includesSourceCode,
      },
      update: {
        content: {
          html: contractHtml,
          projectTitle: project.title,
          projectDescription: project.description,
        },
        status: 'PENDING',
      },
    })

    // TODO: Integrar com ZapSign ou Clicksign
    // const signatureUrl = await sendToSignaturePlatform(contract)

    return NextResponse.json({
      success: true,
      contract,
      contractHtml,
      message: 'Contrato gerado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao gerar contrato:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar contrato' },
      { status: 500 }
    )
  }
}

function generateContractHTML(project: any): string {
  const today = new Date().toLocaleDateString('pt-BR')
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 {
      color: #0284c7;
      text-align: center;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 10px;
    }
    h2 {
      color: #0369a1;
      margin-top: 30px;
    }
    .section {
      margin: 20px 0;
    }
    .highlight {
      background-color: #fef3c7;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .signature-box {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border: 1px solid #ddd;
    }
    th {
      background-color: #0284c7;
      color: white;
    }
  </style>
</head>
<body>
  <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
  <p style="text-align: center; color: #666;">Contrato nº ${project.id}</p>

  <div class="section">
    <h2>1. PARTES</h2>
    <p><strong>CONTRATANTE:</strong> ${project.client.name}</p>
    <p><strong>E-mail:</strong> ${project.client.email}</p>
    <p><strong>CONTRATADA:</strong> Studio Santana AI - Soluções em Inteligência Artificial</p>
  </div>

  <div class="section">
    <h2>2. OBJETO DO CONTRATO</h2>
    <p><strong>Projeto:</strong> ${project.title}</p>
    <p><strong>Descrição:</strong> ${project.description}</p>
    <table>
      <tr>
        <th>Horas Estimadas</th>
        <th>Valor por Hora</th>
        <th>Prazo de Entrega</th>
        <th>Valor Total</th>
      </tr>
      <tr>
        <td>${project.estimatedHours}h</td>
        <td>${formatCurrency(project.hourlyRate)}</td>
        <td>${project.deliveryDays} dias úteis</td>
        <td class="highlight"><strong>${formatCurrency(project.totalValue)}</strong></td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>3. USO DE INTELIGÊNCIA ARTIFICIAL</h2>
    <p>
      A CONTRATADA utiliza ferramentas de Inteligência Artificial (IA) para otimizar o desenvolvimento,
      aumentar a qualidade e reduzir o tempo de entrega. O uso de IA é <span class="highlight">transparente</span> 
      e supervisionado por profissionais experientes.
    </p>
    <p><strong>Benefícios:</strong></p>
    <ul>
      <li>Maior velocidade de desenvolvimento (até 3x mais rápido)</li>
      <li>Código padronizado e de alta qualidade</li>
      <li>Testes automatizados incluídos</li>
      <li>Documentação técnica completa</li>
    </ul>
  </div>

  ${project.includesSourceCode ? `
  <div class="section">
    <h2>4. CÓDIGO-FONTE E PROPRIEDADE INTELECTUAL</h2>
    <p>
      Este projeto <span class="highlight">INCLUI A TRANSFERÊNCIA DO CÓDIGO-FONTE</span> ao CONTRATANTE.
      Após o pagamento integral, o CONTRATANTE terá propriedade completa do código desenvolvido.
    </p>
    <p><strong>O que está incluso:</strong></p>
    <ul>
      <li>Todo o código-fonte do projeto</li>
      <li>Documentação técnica completa</li>
      <li>Acesso ao repositório Git</li>
      <li>Instruções de deploy e manutenção</li>
      <li>30 dias de suporte técnico gratuito</li>
    </ul>
  </div>
  ` : `
  <div class="section">
    <h2>4. PROPRIEDADE INTELECTUAL</h2>
    <p>
      Este projeto <strong>NÃO inclui</strong> a transferência do código-fonte. O CONTRATANTE terá:
    </p>
    <ul>
      <li>Direito de uso da aplicação/sistema desenvolvido</li>
      <li>Hospedagem e manutenção pela CONTRATADA</li>
      <li>Suporte técnico contínuo</li>
      <li>Atualizações de segurança incluídas</li>
    </ul>
    <p>
      <em>Caso deseje adquirir o código-fonte posteriormente, o valor adicional será de 
      ${formatCurrency(project.totalValue * 2)}.</em>
    </p>
  </div>
  `}

  <div class="section">
    <h2>5. PAGAMENTO</h2>
    <p><strong>Valor Total:</strong> <span class="highlight">${formatCurrency(project.totalValue)}</span></p>
    <p><strong>Forma de Pagamento:</strong> À vista via Pix, cartão de crédito ou boleto</p>
    <p><strong>Opção de Parcelamento:</strong> Até 12x no cartão (com juros da operadora)</p>
  </div>

  <div class="section">
    <h2>6. PRAZO DE ENTREGA</h2>
    <p>
      O projeto será entregue em até <span class="highlight">${project.deliveryDays} dias úteis</span> 
      após a confirmação do pagamento.
    </p>
    <p><strong>Garantia de Entrega:</strong> Caso a entrega atrase por responsabilidade da CONTRATADA, 
    o CONTRATANTE receberá 10% de desconto por cada dia de atraso.</p>
  </div>

  <div class="section">
    <h2>7. POLÍTICA DE CANCELAMENTO E REEMBOLSO</h2>
    <p><strong>Se o projeto NÃO foi iniciado:</strong></p>
    <ul>
      <li>Cancelamento possível com reembolso de <span class="highlight">${MAX_REFUND_NOT_STARTED * 100}%</span></li>
      <li>Taxa de processamento: ${CANCELLATION_RETENTION * 100}%</li>
    </ul>
    <p><strong>Se o projeto JÁ foi iniciado:</strong></p>
    <ul>
      <li>Será cobrado o valor proporcional às horas trabalhadas</li>
      <li>Custos de IA e infraestrutura utilizados</li>
      <li>O restante será reembolsado em até 7 dias úteis</li>
    </ul>
  </div>

  <div class="section">
    <h2>8. REVISÕES E ACEITAÇÃO</h2>
    <p>
      O CONTRATANTE terá <span class="highlight">7 dias</span> após a entrega para solicitar ajustes.
      São incluídas até <strong>2 rodadas de revisão</strong> sem custo adicional.
    </p>
  </div>

  <div class="section">
    <h2>9. SUPORTE PÓS-ENTREGA</h2>
    <ul>
      <li><strong>Suporte gratuito:</strong> 30 dias para correção de bugs</li>
      <li><strong>Novas funcionalidades:</strong> Cotadas separadamente</li>
      <li><strong>Manutenção mensal:</strong> Opcional a partir de R$ 500/mês</li>
    </ul>
  </div>

  <div class="section">
    <h2>10. DISPOSIÇÕES FINAIS</h2>
    <p>
      Este contrato entra em vigor na data de assinatura digital por ambas as partes.
      Conflitos serão resolvidos preferencialmente por mediação.
    </p>
  </div>

  <div class="signature-box">
    <p><strong>Data:</strong> ${today}</p>
    <br><br>
    <p>_______________________________________</p>
    <p><strong>${project.client.name}</strong></p>
    <p>CONTRATANTE</p>
    <br><br>
    <p>_______________________________________</p>
    <p><strong>Studio Santana AI</strong></p>
    <p>CONTRATADA</p>
  </div>
</body>
</html>
  `.trim()
}
