'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  DollarSign,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { UserRole } from '@prisma/client'
import AnimatedLogo from '@/components/layout/AnimatedLogo'

interface DashboardShellProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
    role: UserRole
    avatar?: string | null
  }
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getNavItems = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/dashboard/admin/leads', icon: Users, label: 'Leads' },
          { href: '/dashboard/admin/projects', icon: FolderKanban, label: 'Projetos' },
          { href: '/dashboard/admin/contracts', icon: FileText, label: 'Contratos' },
          { href: '/dashboard/admin/payments', icon: DollarSign, label: 'Pagamentos' },
          { href: '/dashboard/admin/partners', icon: UserPlus, label: 'Parceiros' },
          { href: '/dashboard/admin/settings', icon: Settings, label: 'Configurações' },
        ]
      case 'PARTNER':
        return [
          { href: '/dashboard/partner', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/dashboard/partner/referrals', icon: Users, label: 'Indicações' },
          { href: '/dashboard/partner/commissions', icon: DollarSign, label: 'Comissões' },
          { href: '/dashboard/partner/settings', icon: Settings, label: 'Configurações' },
        ]
      default:
        return [
          { href: '/dashboard/client', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/dashboard/client/projects', icon: FolderKanban, label: 'Meus Projetos' },
          { href: '/dashboard/client/payments', icon: DollarSign, label: 'Pagamentos' },
          { href: '/dashboard/client/settings', icon: Settings, label: 'Configurações' },
        ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          <AnimatedLogo compact />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="hidden lg:flex items-center px-6 py-4 border-b border-gray-200">
              <Link href="/" className="text-xl font-bold text-primary-600">
                <AnimatedLogo compact />
              </Link>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role === 'ADMIN' ? 'Administrador' : user.role === 'PARTNER' ? 'Parceiro' : 'Cliente'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg transition
                      ${isActive
                        ? 'bg-primary-50 text-primary-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-200">
              <Link
                href="/"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <LogOut size={20} />
                <span>Voltar ao Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
