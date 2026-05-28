import { demProbability } from '@cm-dss/core'
import type { ConsensusResult } from '@cm-dss/core'
import type { CaseMetadata } from './storage'

const fallbackMetadata: CaseMetadata = {
  caseId: '',
  clinicalContext: 'Sospetta massa cardiaca',
  location: 'Non specificata',
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
    `Caso: ${metadata.caseId.trim() || 'non specificato'}`,
    `Contesto: ${metadata.clinicalContext}`,
    `Localizzazione prevalente: ${metadata.location}`,
    `Nota: ${metadata.note.trim() || '-'}`,
    '',
    'SCORE E FEATURE',
    demScore !== null
      ? `Ecocardiografia / DEM Score: ${demScore}/9; probabilità DEM stimata ${demProbability(demScore)}%.`
      : 'Ecocardiografia / DEM Score: non disponibile.',
    cmrScore !== null
      ? `CMR Mass Score: ${cmrScore}/8.`
      : 'CMR Mass Score: non disponibile.',
    ctScore !== null
      ? `TC/PET: CT signs ${ctScore}/8; PET ${petPositive === null ? 'non inserita' : petPositive ? 'positiva' : 'negativa'}.`
      : 'TC/PET: non disponibile.',
    '',
    'CONSENSO MULTIMODALE',
    `Eco: ${result.modalities.echo.status}. ${result.modalities.echo.note}`,
    `CMR: ${result.modalities.cmr.status}. ${result.modalities.cmr.note}`,
    `TC/PET: ${result.modalities.ctPet.status}. ${result.modalities.ctPet.note}`,
    `Integrato: ${result.integrated.status}. ${result.integrated.note}`,
    '',
    'INTERPRETAZIONE',
    `${result.title}. ${result.explanation}`,
    '',
    'EVIDENZE',
    ...(result.evidence.length ? result.evidence : ['Nessuna red flag selezionata o nessun esame avanzato disponibile.']).map((item) => `- ${item}`),
    '',
    'NEXT STEP SUGGERITO',
    result.nextStep,
    '',
    'Nota: prototipo dimostrativo. Non sostituisce giudizio clinico, referto specialistico, Heart Team o linee guida.',
  ].join('\n')
}
