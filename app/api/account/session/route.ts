import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

function buildMenu(role: 'ADMIN' | 'PARTNER' | 'CLIENT') {
  if (role === 'ADMIN') {
    return [
      { label: 'Painel Admin', href: '/admin/dashboard', tone: 'primary' },
      { label: 'Parceiros', href: '/admin/dashboard', tone: 'default' },
      { label: 'Leads', href: '/admin/dashboard', tone: 'default' },
      { label: 'Gestao', href: '/admin/dashboard', tone: 'default' },
    ]
  }

  if (role === 'PARTNER') {
    return [
      { label: 'Dashboard', href: '/dashboard/partner', tone: 'primary' },
      { label: 'Indicacoes', href: '/dashboard/partner', tone: 'default' },
      { label: 'Comissoes', href: '/dashboard/partner', tone: 'default' },
      { label: 'Contrato', href: '/dashboard/partner', tone: 'default' },
    ]
  }

  return [
    { label: 'Minha Area', href: '/dashboard/client', tone: 'primary' },
    { label: 'Projetos', href: '/dashboard/client', tone: 'default' },
    { label: 'Pagamentos', href: '/dashboard/client', tone: 'default' },
    { label: 'Suporte', href: '/#contact', tone: 'default' },
  ]
}

export async function GET() {
  const adminSession = await getAdminSession()
  if (adminSession) {
    return NextResponse.json({
      authenticated: true,
      user: {
        name: 'Admin Santana',
        email: adminSession.email,
        role: 'ADMIN',
        avatar: null,
        dashboardHref: '/admin/dashboard',
        menu: buildMenu('ADMIN'),
      },
    })
  }

  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ authenticated: false })
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase()
    if (!email) {
      return NextResponse.json({ authenticated: false })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { partnerProfile: { select: { id: true } } },
    })

    const role = (dbUser?.role || 'CLIENT') as 'ADMIN' | 'PARTNER' | 'CLIENT'
    const dashboardHref = role === 'PARTNER' ? '/dashboard/partner' : role === 'ADMIN' ? '/admin/dashboard' : '/dashboard/client'

    return NextResponse.json({
      authenticated: true,
      user: {
        name: dbUser?.name || clerkUser.firstName || 'Cliente Santana',
        email,
        role,
        avatar: dbUser?.avatar || clerkUser.imageUrl || null,
        dashboardHref,
        menu: buildMenu(role),
      },
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
