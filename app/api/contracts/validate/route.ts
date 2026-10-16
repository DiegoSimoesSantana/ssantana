import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? new Resend(apiKey) : null
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || 'SSantana Infraestrutura <contato@ssantana.com.br>'
}

function generateNumericCode(length = 6): string {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }
  return code
}

// POST: Enviar código de 6 dígitos para o e-mail do cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractNumber, email, clientName, document } = body

    if (!contractNumber || !email) {
      return NextResponse.json({ error: 'Número do contrato e e-mail são obrigatórios' }, { status: 400 })
    }

    const code = generateNumericCode(6)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora de validade

    // Salvar código no banco
    await prisma.contractValidationCode.create({
      data: {
        contractNumber,
        email: email.toLowerCase().trim(),
        code,
        expiresAt,
        clientName,
        document,
      },
    })

    // Disparar e-mail via Resend
    const resend = getResendClient()
    if (resend) {
      try {
        await resend.emails.send({
          from: getFromAddress(),
          to: [email],
          subject: `Código de Validação Digital (${code}) - Contrato ${contractNumber} - SSantana`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 8px;">
              <h2 style="color: #0f172a; margin-bottom: 8px;">Validação de Contrato Digital</h2>
              <p style="margin-top: 0;">Olá, <strong>${clientName || 'Cliente'}</strong>.</p>
              <p>Para confirmar e validar a assinatura eletrônica do seu contrato <strong>${contractNumber}</strong> da SSantana Infraestrutura, utilize o código de segurança abaixo:</p>
              
              <div style="background-color: #f8fafc; border: 2px dashed #0284c7; padding: 20px; text-align: center; margin: 24px 0; border-radius: 8px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0284c7;">${code}</span>
                <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Válido por 60 minutos</p>
              </div>

              <p style="font-size: 13px; color: #64748b;">
                Este procedimento antifraude registra o aceite inequívoco da prestação dos serviços contratados, garantindo segurança jurídica contra contestações e disputas bancárias.
              </p>
              <p style="margin-top: 24px; font-size: 13px; color: #334155;"><strong>SSantana Infraestrutura & TI</strong></p>
            </div>
          `,
        })
      } catch (emailError) {
        console.warn('Falha ao enviar e-mail com Resend:', emailError)
      }
    } else {
      console.log(`[MOCK EMAIL RESEND] Código para ${email} (Contrato ${contractNumber}): ${code}`)
    }

    return NextResponse.json({
      success: true,
      message: `Código de 6 dígitos enviado para ${email}.`,
      expiresAt,
      // Em ambiente de teste/dev sem Resend, devolvemos uma dica em dev
      isDev: !resend,
      ...(process.env.NODE_ENV !== 'production' && { devCode: code }),
    })
  } catch (error) {
    console.error('Erro ao enviar código de validação:', error)
    return NextResponse.json({ error: 'Erro ao gerar código de validação' }, { status: 500 })
  }
}

// PUT: Validar o código digitado pelo cliente na tela /contratos/validar
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractNumber, code, document } = body

    if (!contractNumber || !code) {
      return NextResponse.json({ error: 'Número do contrato e código são obrigatórios' }, { status: 400 })
    }

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    // Procurar código válido
    const validEntry = await prisma.contractValidationCode.findFirst({
      where: {
        contractNumber,
        code: code.trim(),
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!validEntry) {
      return NextResponse.json(
        { error: 'Código inválido ou expirado. Por favor solicite um novo código.' },
        { status: 400 }
      )
    }

    // Marcar código como utilizado com dados de auditoria
    await prisma.contractValidationCode.update({
      where: { id: validEntry.id },
      data: {
        used: true,
        usedAt: new Date(),
        ipAddress,
        userAgent,
        document: document || validEntry.document,
      },
    })

    // Localizar contrato e gravar aceite digital blindado Anti-MED
    const contract = await prisma.contract.findFirst({
      where: { contractNumber },
      include: { project: true },
    })

    if (contract) {
      const antiMedAudit = {
        validationCodeId: validEntry.id,
        validatedAt: new Date().toISOString(),
        ipAddress,
        userAgent,
        document: document || validEntry.document,
        email: validEntry.email,
        compliance: 'Lei 14.063/2020 (Assinatura Eletrônica Avançada)',
        protection: 'Anti-MED / Anti-Chargeback Protocol SSantana',
      }

      await prisma.contract.update({
        where: { id: contract.id },
        data: {
          status: 'SIGNED',
          signedByClient: true,
          signedAt: new Date(),
          validationCode: code.trim(),
          validationIp: ipAddress,
          validationUserAgent: userAgent,
          clientDocument: document || validEntry.document,
          antiMedAudit,
        },
      })

      // Se o projeto estava aguardando assinatura, atualiza para aguardar pagamento
      if (contract.project && contract.project.status === 'AWAITING_SIGNATURE') {
        await prisma.project.update({
          where: { id: contract.projectId },
          data: { status: 'AWAITING_PAYMENT' },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contrato validado e assinado eletronicamente com sucesso!',
      contractNumber,
      auditTimestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Erro ao validar código de contrato:', error)
    return NextResponse.json({ error: 'Erro ao validar contrato' }, { status: 500 })
  }
}
