'use client'

import DashboardShell, { type DashboardShellProps } from './DashboardShell'

interface DashboardLayoutProps extends Omit<DashboardShellProps, 'children'> {
  children: React.ReactNode
}

export default function DashboardLayout({
  children,
  user,
  availableRoles,
}: DashboardLayoutProps) {
  return (
    <DashboardShell user={user} availableRoles={availableRoles}>
      {children}
    </DashboardShell>
  )
}
