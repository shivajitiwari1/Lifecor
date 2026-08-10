import { DocRenderer } from '../_components/doc-renderer'

export const metadata = {
  title: 'Platform Architecture — Lifecor',
  description: 'Technical architecture, component structure, and design decisions behind the Lifecor platform.',
}

export default function ArchitecturePage() {
  return (
    <DocRenderer
      fileName="ARCHITECTURE.md"
      title="Platform Architecture"
      description="Technical architecture, component structure, routing, theme system, and key design decisions behind the Lifecor platform."
      badge="Technical Reference"
    />
  )
}
