import type { ImagingData } from '@cm-dss/core'
import type { ConsensusResult } from '@cm-dss/core'

export interface SavedCase {
  id: string
  date: string
  imagingData: ImagingData
  result: ConsensusResult
}

const STORAGE_KEY = 'cm-dss-history'

export function loadCases(): SavedCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedCase[]) : []
  } catch {
    return []
  }
}

export function saveCases(cases: SavedCase[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
  } catch {
    // silently fail
  }
}
