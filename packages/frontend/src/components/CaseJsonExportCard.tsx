import { caseJsonFilename, serializeCaseJsonExport } from '../lib/case-json'
import type { CaseJsonData } from '../lib/case-json'

interface CaseJsonExportCardProps {
  data: CaseJsonData
}

export function CaseJsonExportCard({ data }: CaseJsonExportCardProps) {
  function handleDownload() {
    const blob = new Blob([serializeCaseJsonExport(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = caseJsonFilename(data.metadata)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Case JSON</h2>
          <p>Export metadata, imaging data, consensus output, and traceability for reproducible review.</p>
        </div>
      </div>

      <button type="button" className="cm-button" onClick={handleDownload}>Download case JSON</button>
    </article>
  )
}
