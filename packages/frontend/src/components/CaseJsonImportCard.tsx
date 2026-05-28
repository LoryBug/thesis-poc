import { useState, type ChangeEvent } from 'react'
import { parseCaseJsonImport } from '../lib/case-json'
import { useCaseStore } from '../stores/case.store'

export function CaseJsonImportCard() {
  const loadFrom = useCaseStore((s) => s.loadFrom)
  const [status, setStatus] = useState<string>('')

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    const parsed = parseCaseJsonImport(await file.text())
    if (parsed.ok === false) {
      setStatus(parsed.error)
      return
    }

    loadFrom(parsed.data.imagingData, parsed.data.metadata)
    setStatus(`Imported ${parsed.data.metadata?.caseId || file.name}. Decision will be recalculated from imaging data.`)
  }

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Import Case JSON</h2>
          <p>Load a previously exported case. Scores and traceability are recalculated locally.</p>
        </div>
      </div>

      <label className="cm-field">
        Case JSON file
        <input className="cm-input" type="file" accept="application/json,.json" onChange={handleImport} />
      </label>

      {status && <p className="mt-3 text-sm" style={{ color: 'var(--cm-muted)' }}>{status}</p>}
    </article>
  )
}
