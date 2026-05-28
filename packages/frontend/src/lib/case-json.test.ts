import { describe, expect, it } from 'vitest'
import { createCaseJsonExport, parseCaseJsonImport, serializeCaseJsonExport, caseJsonFilename } from './case-json'
import type { CaseMetadata } from './storage'
import { syntheticCases } from './synthetic-cases'

const metadata: CaseMetadata = {
  caseId: 'GC-04',
  clinicalContext: 'Suspected cardiac mass',
  location: 'Unspecified',
  note: 'CMR-driven high suspicion',
}

describe('case JSON import/export', () => {
  it('serializes and imports a versioned case export', () => {
    const imagingData = syntheticCases.find((item) => item.id === 'GC-04')!.imagingData
    const raw = serializeCaseJsonExport({ metadata, imagingData })
    const parsed = parseCaseJsonImport(raw)

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.data.metadata?.caseId).toBe('GC-04')
    expect(parsed.data.imagingData).toEqual(imagingData)
  })

  it('imports a direct saved-case-like JSON object', () => {
    const sample = syntheticCases.find((item) => item.id === 'GC-02')!
    const parsed = parseCaseJsonImport(JSON.stringify({ metadata: sample.metadata, imagingData: sample.imagingData }))

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.data.metadata?.caseId).toBe('GC-02')
  })

  it('rejects invalid JSON and malformed imaging data', () => {
    expect(parseCaseJsonImport('{').ok).toBe(false)
    expect(parseCaseJsonImport(JSON.stringify({ imagingData: null })).ok).toBe(false)
  })

  it('creates stable export envelopes and filenames', () => {
    const exported = createCaseJsonExport({ metadata, imagingData: syntheticCases[0]!.imagingData }, '2026-05-28T00:00:00.000Z')

    expect(exported.schema).toBe('cm-dss-case-export')
    expect(exported.version).toBe(1)
    expect(exported.exportedAt).toBe('2026-05-28T00:00:00.000Z')
    expect(caseJsonFilename(metadata)).toBe('gc-04.cm-dss.json')
  })
})
