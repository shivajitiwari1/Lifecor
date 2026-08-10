import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Architecture — Lifecor',
}

function renderLine(line: string, index: number): React.ReactNode {
  // Headings
  if (line.startsWith('#### '))
    return <h4 key={index} className="text-base font-semibold mt-6 mb-1 text-foreground">{line.slice(5)}</h4>
  if (line.startsWith('### '))
    return <h3 key={index} className="text-lg font-semibold mt-8 mb-2 text-foreground">{line.slice(4)}</h3>
  if (line.startsWith('## '))
    return <h2 key={index} className="text-2xl font-bold mt-10 mb-3 text-foreground border-b border-border pb-2">{line.slice(3)}</h2>
  if (line.startsWith('# '))
    return <h1 key={index} className="text-3xl font-bold mb-6 text-foreground">{line.slice(2)}</h1>

  // Horizontal rule
  if (line.trim() === '---')
    return <hr key={index} className="border-border my-6" />

  // Blank line
  if (line.trim() === '')
    return <div key={index} className="h-2" />

  // Table row
  if (line.startsWith('|')) {
    const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1)
    const isSeparator = cells.every(c => /^[-: ]+$/.test(c))
    if (isSeparator) return null
    return (
      <tr key={index} className="border-b border-border">
        {cells.map((cell, i) => (
          <td key={i} className="py-1.5 px-3 text-sm text-muted-foreground">{cell.trim()}</td>
        ))}
      </tr>
    )
  }

  // Bullet list
  if (line.startsWith('- ') || line.startsWith('* '))
    return <li key={index} className="ml-5 list-disc text-muted-foreground text-sm leading-relaxed">{line.slice(2)}</li>

  // Numbered list
  if (/^\d+\. /.test(line))
    return <li key={index} className="ml-5 list-decimal text-muted-foreground text-sm leading-relaxed">{line.replace(/^\d+\. /, '')}</li>

  // Code block fence — handled in block pass below
  if (line.startsWith('```'))
    return null

  // Blockquote
  if (line.startsWith('> '))
    return <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground text-sm my-2">{line.slice(2)}</blockquote>

  // Normal paragraph line
  return <p key={index} className="text-sm text-muted-foreground leading-relaxed mb-1">{line}</p>
}

export default function ArchitecturePage() {
  const filePath = path.join(process.cwd(), 'docs', 'ARCHITECTURE.md')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const lines = raw.split('\n')

  // Two-pass: extract code blocks, then render remaining lines
  const blocks: React.ReactNode[] = []
  let inCode = false
  let codeLang = ''
  let codeLines: string[] = []
  let inTable = false
  let tableRows: React.ReactNode[] = []

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true
        codeLang = line.slice(3).trim()
        codeLines = []
      } else {
        inCode = false
        const key = `code-${i}`
        blocks.push(
          <div key={key} className="my-4">
            {codeLang && <span className="text-xs text-muted-foreground font-mono mb-1 block">{codeLang}</span>}
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs font-mono text-foreground whitespace-pre">
              {codeLines.join('\n')}
            </pre>
          </div>
        )
        codeLang = ''
        codeLines = []
      }
      return
    }

    if (inCode) {
      codeLines.push(line)
      return
    }

    // Table grouping
    if (line.startsWith('|')) {
      if (!inTable) inTable = true
      const cells = line.split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1)
      const isSeparator = cells.every(c => /^[-: ]+$/.test(c))
      if (isSeparator) return
      const isFirst = tableRows.length === 0
      tableRows.push(
        <tr key={i} className={`border-b border-border ${isFirst ? 'bg-muted/40' : ''}`}>
          {cells.map((cell, ci) =>
            isFirst
              ? <th key={ci} className="py-2 px-3 text-sm font-semibold text-foreground text-left">{cell.trim()}</th>
              : <td key={ci} className="py-1.5 px-3 text-sm text-muted-foreground">{cell.trim()}</td>
          )}
        </tr>
      )
      return
    } else if (inTable) {
      inTable = false
      const rows = [...tableRows]
      tableRows = []
      blocks.push(
        <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-lg border border-border">
          <table className="w-full border-collapse">{rows}</table>
        </div>
      )
    }

    const node = renderLine(line, i)
    if (node !== null) blocks.push(node)
  })

  // Flush any remaining table
  if (tableRows.length > 0) {
    blocks.push(
      <div key="table-end" className="overflow-x-auto my-4 rounded-lg border border-border">
        <table className="w-full border-collapse">{tableRows}</table>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {blocks}
      </div>
    </div>
  )
}
