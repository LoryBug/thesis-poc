import { useState } from 'react'
import { printReport } from '../lib/report'

interface ReportCardProps {
  report: string
  caseId?: string
  onReset?: () => void
}

export function ReportCard({ report, caseId, onReset }: ReportCardProps) {
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
          <h2>Copyable report</h2>
          <p>Automatic draft for Heart Team discussion or case meeting.</p>
        </div>
      </div>
      <textarea className="cm-textarea" value={report} readOnly />
      <div className="cm-actions">
        <button type="button" className="cm-button" onClick={handleCopy}>{copied ? 'Copied ✓' : 'Copy report'}</button>
        <button type="button" className="cm-button secondary" onClick={() => printReport(report, caseId)}>Print / PDF</button>
        {onReset && <button type="button" className="cm-button secondary" onClick={onReset}>Reset</button>}
      </div>
    </article>
  )
}
