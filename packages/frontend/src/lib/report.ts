import { demProbability } from '@cm-dss/core'
import type { ConsensusResult } from '@cm-dss/core'
import type { CaseMetadata } from './storage'

const fallbackMetadata: CaseMetadata = {
  caseId: '',
  clinicalContext: 'Suspected cardiac mass',
  location: 'Unspecified',
  note: '',
}

export interface ClinicalReportInput {
  metadata?: CaseMetadata
  result: ConsensusResult
  demScore: number | null
  cmrScore: number | null
  ctScore: number | null
  petPositive: boolean | null
}

export function buildClinicalReport({
  metadata = fallbackMetadata,
  result,
  demScore,
  cmrScore,
  ctScore,
  petPositive,
}: ClinicalReportInput) {
  return [
    'CARDIAC MASS DECISION SUPPORT - POC',
    '',
    `Case: ${metadata.caseId.trim() || 'not specified'}`,
    `Clinical context: ${metadata.clinicalContext}`,
    `Predominant location: ${metadata.location}`,
    `Note: ${metadata.note.trim() || '-'}`,
    '',
    'SCORES AND FEATURES',
    demScore !== null
      ? `Echocardiography / DEM Score: ${demScore}/9; estimated DEM probability of malignancy ${demProbability(demScore)}%.`
      : 'Echocardiography / DEM Score: not available.',
    cmrScore !== null
      ? `CMR Mass Score: ${cmrScore}/8.`
      : 'CMR Mass Score: not available.',
    ctScore !== null
      ? `CT/PET: CT signs ${ctScore}/8; PET ${petPositive === null ? 'not entered' : petPositive ? 'positive' : 'negative'}.`
      : 'CT/PET: not available.',
    '',
    'MULTIMODALITY CONSENSUS',
    `Echo: ${result.modalities.echo.status}. ${result.modalities.echo.note}`,
    `CMR: ${result.modalities.cmr.status}. ${result.modalities.cmr.note}`,
    `CT/PET: ${result.modalities.ctPet.status}. ${result.modalities.ctPet.note}`,
    `Integrated: ${result.integrated.status}. ${result.integrated.note}`,
    '',
    'INTERPRETATION',
    `${result.title}. ${result.explanation}`,
    '',
    'EVIDENCE',
    ...(result.evidence.length ? result.evidence : ['No red flag selected or no advanced imaging available.']).map((item) => `- ${item}`),
    '',
    'SUGGESTED NEXT STEP',
    result.nextStep,
    '',
    'Note: demonstration prototype. It does not replace clinical judgment, specialist reporting, Heart Team discussion, or guidelines.',
  ].join('\n')
}
