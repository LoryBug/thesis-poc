import { useMemo, useState } from 'react'
import { syntheticCases } from '../lib/synthetic-cases'
import { useCaseStore } from '../stores/case.store'

export function SyntheticCaseLoader() {
  const [selectedId, setSelectedId] = useState('GC-02')
  const loadFrom = useCaseStore((s) => s.loadFrom)
  const selectedCase = useMemo(
    () => syntheticCases.find((item) => item.id === selectedId) ?? syntheticCases[0],
    [selectedId],
  )

  function handleLoad() {
    if (!selectedCase) return
    loadFrom(selectedCase.imagingData, selectedCase.metadata)
  }

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Synthetic Case Loader</h2>
          <p>Load a documented golden case for demo, screenshots, and regression review.</p>
        </div>
      </div>

      <label className="cm-field">
        Golden case
        <select className="cm-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {syntheticCases.map((item) => (
            <option key={item.id} value={item.id}>{item.id} - {item.title}</option>
          ))}
        </select>
      </label>

      {selectedCase && <p className="mt-3 text-sm" style={{ color: 'var(--cm-muted)' }}>{selectedCase.description}</p>}

      <button type="button" className="cm-button mt-4" onClick={handleLoad}>Load synthetic case</button>
    </article>
  )
}
