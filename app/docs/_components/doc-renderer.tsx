import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import Link from 'next/link'

interface DocRendererProps {
  fileName: string
  title: string
  description: string
  badge: string
}

export function DocRenderer({ fileName, title, description, badge }: DocRendererProps) {
  const filePath = path.join(process.cwd(), 'docs', fileName)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const htmlContent = marked.parse(raw) as string

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to site
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm font-medium text-foreground">Documentation</span>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {badge}
          </span>
        </div>
      </header>

      {/* Page hero */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Lifecor Platform</p>
          <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-h1:text-2xl prose-h1:font-bold prose-h1:text-foreground prose-h1:mt-0 prose-h1:mb-6 prose-h1:border-b prose-h1:border-border prose-h1:pb-4
            prose-h2:text-xl prose-h2:font-semibold prose-h2:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-3
            prose-h3:text-base prose-h3:font-semibold prose-h3:text-foreground prose-h3:mt-8 prose-h3:mb-3
            prose-h4:text-sm prose-h4:font-semibold prose-h4:text-foreground prose-h4:mt-6 prose-h4:mb-2
            prose-p:text-muted-foreground prose-p:leading-7 prose-p:text-sm
            prose-li:text-muted-foreground prose-li:text-sm prose-li:leading-6
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:text-xs
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:not-italic
            prose-table:text-sm
            prose-thead:border-border
            prose-th:text-foreground prose-th:font-semibold prose-th:text-left
            prose-td:text-muted-foreground prose-td:align-top
            prose-tr:border-border
            prose-hr:border-border
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>Lifecor Platform Documentation</span>
          <Link href="/" className="hover:text-foreground transition-colors">← Return to site</Link>
        </div>
      </footer>
    </div>
  )
}
