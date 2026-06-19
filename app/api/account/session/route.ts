import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import { getAccountSession } from '@/lib/account-auth'

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
  const accountSession = await getAccountSession()
  const sessionEmail = adminSession?.email || accountSession?.email

  if (sessionEmail) {
    const dbUser = await prisma.user.findUnique({
      where: { email: sessionEmail },
      include: { partnerProfile: { select: { id: true } } },
    })

    if (!dbUser) {
      return NextResponse.json({ authenticated: false })
    }

    const availableProfiles: Array<'ADMIN' | 'PARTNER' | 'CLIENT'> = []
    if (adminSession) {
      availableProfiles.push('ADMIN')
    }
    if (accountSession?.roles?.includes('PARTNER')) {
      availableProfiles.push('PARTNER')
    }
    if (accountSession?.roles?.includes('CLIENT')) {
      availableProfiles.push('CLIENT')
    }

    const role: 'ADMIN' | 'PARTNER' | 'CLIENT' = adminSession
      ? 'ADMIN'
      : accountSession?.selectedRole === 'PARTNER'
        ? 'PARTNER'
        : 'CLIENT'

    const dashboardHref =
      role === 'ADMIN' ? '/admin/dashboard' : role === 'PARTNER' ? '/dashboard/partner' : '/dashboard/client'

    return NextResponse.json({
      authenticated: true,
      user: {
        name: dbUser.name || 'Usuario Santana',
        email: dbUser.email,
        role,
        avatar: dbUser.avatar || null,
        dashboardHref,
        menu: buildMenu(role),
        profiles: Array.from(new Set(availableProfiles)),
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
        profiles: [role],
      },
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
