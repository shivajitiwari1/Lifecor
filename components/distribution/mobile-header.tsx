'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, Command, Users, Calculator, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/partner', label: 'Command', icon: Command },
  { href: '/partner/clients', label: 'Clients', icon: Users },
  { href: '/partner/quote', label: 'Quote Generator', icon: Calculator },
  { href: '/partner/analytics', label: 'Analytics', icon: BarChart3 },
]

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="md:hidden h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-electric-600 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-lg font-bold">Lifecor</span>
      </Link>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border z-50 py-2 px-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                pathname === item.href ? 'bg-electric-600/20 text-electric-400' : 'text-muted-foreground',
              )}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
