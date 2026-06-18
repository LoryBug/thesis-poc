import { useMemo, useState, type ChangeEvent } from 'react'
import { evaluateConsensus } from '@cm-dss/core'
import { parseCaseJsonImport } from '../lib/case-json'
import { syntheticCases } from '../lib/synthetic-cases'
import { useCaseStore } from '../stores/case.store'
import { useHistoryStore } from '../stores/history.store'

export function EvaluationToolsCard() {
  const [selectedId, setSelectedId] = useState('GC-02')
  const [importStatus, setImportStatus] = useState<string>('')
  const loadFrom = useCaseStore((s) => s.loadFrom)
  const addCase = useHistoryStore((s) => s.addCase)
  const selectedCase = useMemo(
    () => syntheticCases.find((item) => item.id === selectedId) ?? syntheticCases[0],
    [selectedId],
  )

  function handleLoadSyntheticCase() {
    if (!selectedCase) return
    loadFrom(selectedCase.imagingData, selectedCase.metadata)
    setImportStatus('')
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    const parsed = parseCaseJsonImport(await file.text())
    if (parsed.ok === false) {
      setImportStatus(parsed.error)
      return
    }

    loadFrom(parsed.data.imagingData, parsed.data.metadata)
    const result = evaluateConsensus(parsed.data.imagingData)
    addCase({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      metadata: parsed.data.metadata,
      imagingData: parsed.data.imagingData,
      result,
    })
    setImportStatus(`Imported and saved ${parsed.data.metadata?.caseId || file.name}.`)
  }

  return (
    <article className="cm-card cm-tools-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Demo / Import Tools</h2>
          <p>Optional shortcuts for reproducibility. Manual entry below remains the source of truth.</p>
        </div>
        <span className="cm-pill">Optional</span>
      </div>

      <div className="cm-tool-grid">
        <section className="cm-tool-panel">
          <div>
            <h3>Synthetic golden case</h3>
            <p>Load a documented case for demo, screenshots, and regression review.</p>
          </div>

          <label className="cm-field">
            Golden case
            <select className="cm-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
              {syntheticCases.map((item) => (
                <option key={item.id} value={item.id}>{item.id} - {item.title}</option>
              ))}
            </select>
          </label>

          {selectedCase && <p className="cm-tool-note">{selectedCase.description}</p>}

          <button type="button" className="cm-button" onClick={handleLoadSyntheticCase}>Load synthetic case</button>
        </section>

        <section className="cm-tool-panel">
          <div>
            <h3>Case JSON import</h3>
            <p>Load a previously exported case. Scores and traceability are recalculated locally.</p>
          </div>

          <label className="cm-field">
            Case JSON file
            <input className="cm-input" type="file" accept="application/json,.json" onChange={handleImport} />
          </label>

          {importStatus && <p className="cm-tool-note">{importStatus}</p>}
        </section>
      </div>
    </article>
  )
}
