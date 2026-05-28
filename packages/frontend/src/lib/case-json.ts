import type { ClinicalTraceability, ConsensusResult, ImagingData } from '@cm-dss/core'
import type { CaseMetadata } from './storage'
import { isCaseMetadata, isConsensusResult, isImagingData, isRecord, isSavedCase } from './storage'

const CASE_JSON_SCHEMA = 'cm-dss-case-export'
const CASE_JSON_VERSION = 1

export interface CaseJsonData {
  metadata?: CaseMetadata
  imagingData: ImagingData
  result?: ConsensusResult
  traceability?: ClinicalTraceability
}

export interface CaseJsonExport {
  schema: typeof CASE_JSON_SCHEMA
  version: typeof CASE_JSON_VERSION
  exportedAt: string
  case: CaseJsonData
}

export type CaseJsonImportResult =
  | { ok: true; data: CaseJsonData }
  | { ok: false; error: string }

export function createCaseJsonExport(data: CaseJsonData, exportedAt = new Date().toISOString()): CaseJsonExport {
  return {
    schema: CASE_JSON_SCHEMA,
    version: CASE_JSON_VERSION,
    exportedAt,
    case: data,
  }
}

export function serializeCaseJsonExport(data: CaseJsonData): string {
  return JSON.stringify(createCaseJsonExport(data), null, 2)
}

export function parseCaseJsonImport(raw: string): CaseJsonImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'Invalid JSON file.' }
  }

  const source = extractCaseSource(parsed)
  if (source.ok === false) return { ok: false, error: source.error }

  if (!isImagingData(source.value.imagingData)) {
    return { ok: false, error: 'JSON does not contain valid imagingData.' }
  }
  const imagingData = source.value.imagingData

  let metadata: CaseMetadata | undefined
  if (source.value.metadata !== undefined) {
    if (!isCaseMetadata(source.value.metadata)) return { ok: false, error: 'JSON contains invalid case metadata.' }
    metadata = source.value.metadata
  }

  let result: ConsensusResult | undefined
  if (source.value.result !== undefined) {
    if (!isConsensusResult(source.value.result)) return { ok: false, error: 'JSON contains an invalid consensus result.' }
    result = source.value.result
  }

  return {
    ok: true,
    data: {
      metadata,
      imagingData,
      result,
    },
  }
}

export function caseJsonFilename(metadata?: CaseMetadata) {
  const seed = metadata?.caseId || metadata?.note || 'cardiac-mass-case'
  const safeSeed = seed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cardiac-mass-case'
  return `${safeSeed}.cm-dss.json`
}

function extractCaseSource(parsed: unknown): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  if (isRecord(parsed) && parsed.schema === CASE_JSON_SCHEMA && parsed.version === CASE_JSON_VERSION) {
    if (!isRecord(parsed.case)) return { ok: false, error: 'Case export envelope does not contain a valid case object.' }
    return { ok: true, value: parsed.case }
  }

  if (isSavedCase(parsed)) {
    return { ok: true, value: parsed as unknown as Record<string, unknown> }
  }

  if (isRecord(parsed) && 'imagingData' in parsed) {
    return { ok: true, value: parsed }
  }

  return { ok: false, error: 'Unsupported case JSON format.' }
}
