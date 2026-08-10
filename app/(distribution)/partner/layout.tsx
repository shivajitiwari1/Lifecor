import { Sidebar } from '@/components/distribution/sidebar'
import { MobileHeader } from '@/components/distribution/mobile-header'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
