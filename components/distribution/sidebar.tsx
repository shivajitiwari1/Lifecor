'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, GitBranch, Calculator, BarChart3, Shield, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV = [
  { href: '/partner', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/partner/pipeline', icon: GitBranch, label: 'Lead Pipeline' },
  { href: '/partner/clients', icon: Users, label: 'Clients' },
  { href: '/partner/quote', icon: Calculator, label: 'Quote Generator' },
  { href: '/partner/analytics', icon: BarChart3, label: 'Analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-card border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-electric-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold">Lifecor</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-600/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-electric-600/20 text-electric-400 text-xs">SM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Sarah Mitchell</div>
            <div className="text-xs text-muted-foreground">Senior Advisor</div>
          </div>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
