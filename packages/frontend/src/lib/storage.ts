import type { ImagingData } from '@cm-dss/core'
import type { ConsensusResult } from '@cm-dss/core'

export interface SavedCase {
  id: string
  date: string
  imagingData: ImagingData
  result: ConsensusResult
}

const STORAGE_VERSION = 1
const STORAGE_KEY = `cm-dss-history@${STORAGE_VERSION}`

function isSavedCase(value: unknown): value is SavedCase {
  if (typeof value !== 'object' || value === null) return false
  const c = value as Record<string, unknown>
  return typeof c.id === 'string' && typeof c.date === 'string' && typeof c.imagingData === 'object' && typeof c.result === 'object'
}

export function loadCases(): SavedCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const valid = parsed.filter(isSavedCase)
    if (valid.length !== parsed.length) {
      saveCases(valid)
    }
    return valid
  } catch {
    return []
  }
}

export function saveCases(cases: SavedCase[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
  } catch (err) {
    console.error('Impossibile salvare la cronologia (quota localStorage esaurita o accesso negato):', err)
  }
}
