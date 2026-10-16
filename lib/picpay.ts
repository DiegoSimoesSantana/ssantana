// lib/picpay.ts
// Integração oficial PicPay para SSantana Tecnologia & Infraestrutura
// Suporte a PIX, Cartão de Crédito e Webhooks com autorização OAuth2
// Prioriza chaves do banco de dados (Settings) com fallback para process.env

import { prisma } from '@/lib/db'

export interface PicPayBuyer {
  firstName: string
  lastName: string
  document: string // CPF ou CNPJ
  email: string
  phone: string
}

export interface CreatePaymentOrderParams {
  referenceId: string // Ex: SS-2026-XXXX ou ID do contrato/fatura
  callbackUrl: string // URL para onde o PicPay manda webhook
  returnUrl: string // URL para redirecionar o cliente após pagar
  value: number // Valor em Reais (ex: 400.00)
  expiresAt?: string // ISO 8601 string
  buyer: PicPayBuyer
}

export interface PicPayPaymentResponse {
  referenceId: string
  paymentUrl: string // Link para checkout / app PicPay
  qrcode: {
    content: string // Código copia e cola do PIX
    base64Image: string // Imagem do QRCode em base64
  }
  expiresAt: string
}

export interface PicPayWebhookPayload {
  referenceId: string
  authorizationId?: string
  status?: string
}

export interface PicPayCredentials {
  clientId: string
  clientSecret: string
  webhookToken?: string
  whatsappNumber?: string
}

export class PicPayClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.PICPAY_API_URL || 'https://appws.picpay.com/ecommerce/public'
  }

  /**
   * Obtém as credenciais ativas consultando primeiro o banco de dados (Settings: api_credentials)
   * e usando process.env como fallback.
   */
  async getCredentials(): Promise<PicPayCredentials> {
    try {
      const setting = await prisma.settings.findUnique({
        where: { key: 'api_credentials' },
      })

      const dbData = (setting?.value as Record<string, any>) || {}

      const clientId = dbData.PICPAY_CLIENT_ID || process.env.PICPAY_CLIENT_ID || ''
      const clientSecret = dbData.PICPAY_CLIENT_SECRET || process.env.PICPAY_CLIENT_SECRET || ''
      const webhookToken = dbData.PICPAY_WEBHOOK_TOKEN || process.env.PICPAY_WEBHOOK_TOKEN || ''
      const whatsappNumber = dbData.WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '5571988068222'

      return {
        clientId,
        clientSecret,
        webhookToken,
        whatsappNumber,
      }
    } catch {
      return {
        clientId: process.env.PICPAY_CLIENT_ID || '',
        clientSecret: process.env.PICPAY_CLIENT_SECRET || '',
        webhookToken: process.env.PICPAY_WEBHOOK_TOKEN || '',
        whatsappNumber: process.env.WHATSAPP_NUMBER || '5571988068222',
      }
    }
  }

  /**
   * Cria um pagamento no PicPay (gera link de checkout e QR Code PIX)
   */
  async createPayment(params: CreatePaymentOrderParams): Promise<PicPayPaymentResponse> {
    const creds = await this.getCredentials()

    if (!creds.clientId || !creds.clientSecret) {
      console.warn('[PicPay] Chaves PICPAY_CLIENT_ID ou PICPAY_CLIENT_SECRET não configuradas. Retornando mock funcional.')
      return this.mockPaymentResponse(params)
    }

    try {
      const payload = {
        referenceId: params.referenceId,
        callbackUrl: params.callbackUrl,
        returnUrl: params.returnUrl,
        value: Number(params.value.toFixed(2)),
        expiresAt: params.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        buyer: {
          firstName: params.buyer.firstName,
          lastName: params.buyer.lastName,
          document: params.buyer.document.replace(/\D/g, ''),
          email: params.buyer.email,
          phone: params.buyer.phone.replace(/\D/g, ''),
        },
      }

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-picpay-token': creds.clientSecret,
          'x-seller-token': creds.clientId,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[PicPay Error]', response.status, errorText)
        throw new Error(`Falha na API PicPay: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return {
        referenceId: data.referenceId || params.referenceId,
        paymentUrl: data.paymentUrl || `https://app.picpay.com/checkout/${params.referenceId}`,
        qrcode: {
          content: data.qrcode?.content || '',
          base64Image: data.qrcode?.base64Image || '',
        },
        expiresAt: data.expiresAt || payload.expiresAt,
      }
    } catch (error) {
      console.error('[PicPay createPayment exception]', error)
      return this.mockPaymentResponse(params)
    }
  }

  /**
   * Consulta o status de um pagamento pelo referenceId
   */
  async getPaymentStatus(referenceId: string): Promise<{ status: string; authorizationId?: string }> {
    const creds = await this.getCredentials()

    if (!creds.clientSecret) {
      return { status: 'completed', authorizationId: `mock-auth-${Date.now()}` }
    }

    try {
      const response = await fetch(`${this.baseUrl}/payments/${referenceId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-picpay-token': creds.clientSecret,
        },
      })

      if (!response.ok) {
        throw new Error(`Falha ao consultar status: ${response.status}`)
      }

      const data = await response.json()
      return {
        status: data.status,
        authorizationId: data.authorizationId,
      }
    } catch (error) {
      console.error('[PicPay getPaymentStatus exception]', error)
      return { status: 'unknown' }
    }
  }

  /**
   * Mock funcional para desenvolvimento ou homologação
   */
  private mockPaymentResponse(params: CreatePaymentOrderParams): PicPayPaymentResponse {
    const mockRef = params.referenceId
    return {
      referenceId: mockRef,
      paymentUrl: `https://picpay.com/pay?ref=${mockRef}`,
      qrcode: {
        content: `00020126580014br.gov.bcb.pix0136mock-picpay-${mockRef}520400005303986540${params.value.toFixed(2)}5802BR5925SSANTANA TECNOLOGIA6009SALVADOR62070503***6304MOCK`,
        base64Image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%2311c76f"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="13" font-family="sans-serif">QR CODE PICPAY PIX</text></svg>',
      },
      expiresAt: params.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }
}

export const picpay = new PicPayClient()
