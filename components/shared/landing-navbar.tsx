'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#benefits', label: 'Benefits' },
  { href: '#partners', label: 'Partners' },
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-bold ${scrolled ? 'text-foreground' : 'text-white'}`}>Lifecor</span>
          </Link>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/demo"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'bg-electric-600 hover:bg-electric-700 text-white'
              )}
            >
              Start Demo
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
