import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getAccountSession } from '@/lib/account-auth'
import { getAdminSession } from '@/lib/admin-auth'

const bodySchema = z.object({
  avatarDataUrl: z.string().min(50).max(1_500_000),
})

function isValidImageDataUrl(value: string) {
  return /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(value)
}

export async function POST(request: NextRequest) {
  try {
    const accountSession = await getAccountSession()
    const adminSession = await getAdminSession()
    const email = accountSession?.email || adminSession?.email

    if (!email) {
      return NextResponse.json({ error: 'Sessao nao encontrada' }, { status: 401 })
    }

    const body = await request.json()
    const { avatarDataUrl } = bodySchema.parse(body)

    if (!isValidImageDataUrl(avatarDataUrl)) {
      return NextResponse.json({ error: 'Imagem invalida' }, { status: 422 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: avatarDataUrl },
    })

    return NextResponse.json({ success: true, avatar: avatarDataUrl })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Imagem obrigatoria' }, { status: 422 })
    }

    return NextResponse.json({ error: 'Falha ao atualizar foto' }, { status: 500 })
  }
}
