'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Command, Users, BarChart3, Shield, LogOut, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV_PRIMARY = [
  { href: '/partner', icon: Command, label: 'Command' },
  { href: '/partner/clients', icon: Users, label: 'Clients' },
  { href: '/partner/analytics', icon: BarChart3, label: 'Analytics' },
]

const NAV_SECONDARY = [
  { href: '/partner/quote', icon: Calculator, label: 'Quote Generator' },
]

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/partner' ? pathname === '/partner' : pathname.startsWith(href)

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

      <nav className="flex-1 px-3 py-4">
        <p className="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-widest">Workspace</p>
        <div className="space-y-1 mb-6">
          {NAV_PRIMARY.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-600/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-widest">Tools</p>
        <div className="space-y-1">
          {NAV_SECONDARY.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-600/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-border">
        {/* Today's wins counter */}
        <div className="px-3 py-2 mb-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
          <p className="text-xs text-amber-400 font-semibold">3 approved today</p>
          <p className="text-xs text-muted-foreground">Keep it up, Sarah</p>
        </div>
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
