'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, LayoutDashboard, FileText, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/policies', icon: FileText, label: 'Policy Management' },
  { href: '/admin/users', icon: Users, label: 'User Management' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
]

export function AdminMobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="md:hidden h-14 border-b border-border bg-card flex items-center justify-between px-4 relative">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-600 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-lg font-bold">Lifecor Admin</span>
      </Link>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border z-50 py-2 px-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                pathname === item.href ? 'bg-slate-500/20 text-slate-300' : 'text-muted-foreground')}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
