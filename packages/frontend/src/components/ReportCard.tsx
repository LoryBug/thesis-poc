import { useState } from 'react'

interface ReportCardProps {
  report: string
  onReset?: () => void
}

export function ReportCard({ report, onReset }: ReportCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Report copiabile</h2>
          <p>Bozza automatica per discussione in Heart Team o meeting.</p>
        </div>
      </div>
      <textarea className="cm-textarea" value={report} readOnly />
      <div className="cm-actions">
        <button type="button" className="cm-button" onClick={handleCopy}>{copied ? 'Copiato' : 'Copia report'}</button>
        {onReset && <button type="button" className="cm-button secondary" onClick={onReset}>Reset</button>}
      </div>
    </article>
  )
}
