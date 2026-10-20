import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ACCOUNT_COOKIE_NAME, parseAccountSessionToken } from '@/lib/account-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let email = searchParams.get('email')?.toLowerCase().trim()

    // Se não veio por parâmetro, tenta ler da sessão ativa de conta
    if (!email) {
      const sessionToken = request.cookies.get(ACCOUNT_COOKIE_NAME)?.value
      const session = parseAccountSessionToken(sessionToken)
      if (session?.email) {
        email = session.email.toLowerCase().trim()
      }
    }

    if (!email) {
      return NextResponse.json({ alreadyAccepted: false })
    }

    // Verifica se já existe contrato ou aceite prévio deste cliente
    const existingContract = await prisma.contract.findFirst({
      where: {
        OR: [
          { client: { email } },
          { clientDocument: { not: '' } },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const alreadyAccepted = Boolean(
      existingContract &&
      (existingContract.status === 'SIGNED' ||
       existingContract.status === 'SENT' ||
       existingContract.signedAt !== null)
    )

    return NextResponse.json({
      alreadyAccepted,
      client: existingContract?.client || null,
      lastContractNumber: existingContract?.contractNumber || null,
    })
  } catch (error) {
    console.error('[terms-status GET Error]', error)
    return NextResponse.json({ alreadyAccepted: false }, { status: 500 })
  }
}
