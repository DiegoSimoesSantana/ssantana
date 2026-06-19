import { Resend } from 'resend'

type DirectIndicationEmailInput = {
  toEmail: string
  leadName: string
  partnerName: string
  referralLink: string
  referralCode: string
  discountRate: number
  whatsappNumber?: string | null
}

let cachedResend: Resend | null = null

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }

  if (!cachedResend) {
    cachedResend = new Resend(apiKey)
  }

  return cachedResend
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || 'Studio SSANTANA <contato@ssantana.com.br>'
}

export async function sendDirectIndicationEmail(input: DirectIndicationEmailInput) {
  const client = getResendClient()
  if (!client) {
    return { success: false, skipped: true, reason: 'RESEND_API_KEY nao configurada' }
  }

  const discountPercent = (input.discountRate * 100).toFixed(0)
  const whatsappLine = input.whatsappNumber
    ? `<p style="margin:0">WhatsApp para atendimento rapido: ${input.whatsappNumber}</p>`
    : ''

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2 style="margin-bottom: 8px;">${input.leadName}, bem-vindo(a) a SSANTANA.</h2>
      <p style="margin-top: 0;">Você recebeu uma indicação direta do parceiro <strong>${input.partnerName}</strong>.</p>
      <p>Condição comercial ativa para esta indicação: <strong>até ${discountPercent}% de desconto</strong>, conforme análise do escopo.</p>
      <p>Cupom exclusivo da sua indicação: <strong>INDICAÇÃO-${input.referralCode}</strong>.</p>
      <p>Acesse o link oficial da sua indicação e avance para o atendimento:</p>
      <p><a href="${input.referralLink}">${input.referralLink}</a></p>
      ${whatsappLine}
      <p style="margin-top: 24px;">Equipe SSANTANA</p>
    </div>
  `

  await client.emails.send({
    from: getFromAddress(),
    to: [input.toEmail],
    subject: 'Sua indicação SSANTANA foi registrada com sucesso',
    html,
  })

  return { success: true, skipped: false }
}
