import type { ImagingData } from '@cm-dss/core'
import type { ConsensusResult } from '@cm-dss/core'

export interface CaseMetadata {
  caseId: string
  clinicalContext: string
  location: string
  note: string
}

export interface SavedCase {
  id: string
  date: string
  metadata?: CaseMetadata
  imagingData: ImagingData
  result: ConsensusResult
}

const STORAGE_VERSION = 1
const STORAGE_KEY = `cm-dss-history@${STORAGE_VERSION}`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isImagingData(value: unknown): value is ImagingData {
  if (!isRecord(value)) return false
  return typeof value.echoAvailable === 'boolean'
    && typeof value.cmrAvailable === 'boolean'
    && typeof value.ctpetAvailable === 'boolean'
    && (value.echo === null || isRecord(value.echo))
    && (value.cmr === null || isRecord(value.cmr))
    && (value.ct === null || isRecord(value.ct))
    && (value.pet === null || isRecord(value.pet))
}

function isConsensusResult(value: unknown): value is ConsensusResult {
  if (!isRecord(value)) return false
  return ['low', 'mid', 'high', 'not'].includes(String(value.risk))
    && typeof value.title === 'string'
    && typeof value.subtitle === 'string'
    && typeof value.explanation === 'string'
    && typeof value.nextStep === 'string'
    && isStringArray(value.evidence)
    && isRecord(value.modalities)
    && isRecord(value.integrated)
}

function isCaseMetadata(value: unknown): value is CaseMetadata {
  if (!isRecord(value)) return false
  return typeof value.caseId === 'string'
    && typeof value.clinicalContext === 'string'
    && typeof value.location === 'string'
    && typeof value.note === 'string'
}

function isSavedCase(value: unknown): value is SavedCase {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.date === 'string'
    && (value.metadata === undefined || isCaseMetadata(value.metadata))
    && isImagingData(value.imagingData)
    && isConsensusResult(value.result)
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
    console.error('Unable to save history (localStorage quota exhausted or access denied):', err)
  }
}
