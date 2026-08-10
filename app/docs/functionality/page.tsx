import { DocRenderer } from '../_components/doc-renderer'

export const metadata = {
  title: 'Platform Functionality — Lifecor',
  description: 'Step-by-step breakdown of every feature and flow in the Lifecor platform.',
}

export default function FunctionalityPage() {
  return (
    <DocRenderer
      fileName="FUNCTIONALITY.md"
      title="Platform Functionality"
      description="A complete breakdown of every screen, step, and feature across the consumer flow, partner portal, and admin dashboard."
      badge="Product Overview"
    />
  )
}
