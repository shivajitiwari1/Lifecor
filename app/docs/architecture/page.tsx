import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'

export const metadata = {
  title: 'Architecture — Lifecor',
}

export default function ArchitecturePage() {
  const filePath = path.join(process.cwd(), 'docs', 'ARCHITECTURE.md')
  const content = fs.readFileSync(filePath, 'utf-8')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold mb-6 text-foreground border-b border-border pb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-semibold mt-6 mb-2 text-foreground">{children}</h4>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            code: ({ children, className }) => {
              const isBlock = className?.includes('language-')
              return isBlock ? (
                <code className="block bg-muted rounded-lg p-4 mb-4 text-sm font-mono overflow-x-auto text-foreground">
                  {children}
                </code>
              ) : (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
              )
            },
            pre: ({ children }) => (
              <pre className="bg-muted rounded-lg p-4 mb-4 overflow-x-auto text-sm">{children}</pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 mb-4 italic text-muted-foreground">{children}</blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className="text-left py-2 px-3 font-semibold text-foreground">{children}</th>
            ),
            td: ({ children }) => (
              <td className="py-2 px-3 text-muted-foreground">{children}</td>
            ),
            hr: () => <hr className="border-border my-8" />,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
            a: ({ href, children }) => (
              <a href={href} className="text-primary underline underline-offset-4 hover:text-primary/80">{children}</a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
