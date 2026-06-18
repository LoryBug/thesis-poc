import { demProbability } from '@cm-dss/core'

export function printReport(report: string, caseId?: string) {
  const win = window.open('', '_blank', 'width=820,height=700')
  if (!win) return
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const escaped = esc(report)
  const safeId = esc(caseId || 'Report')
  win.document.write(`<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"/>
    <title>Cardiac Mass DSS — ${safeId}</title>
    <style>
      body{font-family:Georgia,serif;max-width:680px;margin:40px auto;padding:0 24px;color:#1a202c;line-height:1.65;font-size:14px}
      h1{font-size:17px;color:#173b68;border-bottom:2px solid #173b68;padding-bottom:8px;margin-bottom:20px}
      pre{white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:13px;margin:0}
      .footer{margin-top:36px;padding-top:10px;border-top:1px solid #ccc;font-size:11px;color:#777;font-style:italic}
      @media print{body{margin:0}button{display:none}}
    </style>
  </head><body>
    <h1>Cardiac Mass DSS — Clinical Report</h1>
    <pre>${escaped}</pre>
    <div class="footer">Research prototype — University of Bologna. Not for clinical use without specialist validation.</div>
  </body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 400)
}
import type { ClinicalTraceability, ConsensusResult, TraceNode } from '@cm-dss/core'
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
  traceability?: ClinicalTraceability
}

const reportEvidenceKinds = new Set<TraceNode['kind']>(['feature', 'score', 'cutoff', 'finding'])

export function buildClinicalReport({
  metadata = fallbackMetadata,
  result,
  demScore,
  cmrScore,
  ctScore,
  petPositive,
  traceability,
}: ClinicalReportInput) {
  const traceEvidence = traceability?.nodes.filter((node) => reportEvidenceKinds.has(node.kind)) ?? []

  return [
    'Cardiac Mass DSS — Clinical Report',
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
    `Path: ${result.decisionPath}. ${result.title}. ${result.explanation}`,
    '',
    'EVIDENCE',
    ...(result.evidence.length ? result.evidence : ['No red flag selected or no advanced imaging available.']).map((item) => `- ${item}`),
    '',
    'CLINICAL TRACEABILITY',
    traceability ? `Summary: ${traceability.summary}` : 'Traceability: not available.',
    ...(traceability ? [
      'Activated rules:',
      ...traceability.activatedRules.map((rule) => `- ${rule}`),
      'Evidence chain:',
      ...traceEvidence.map((node) => `- ${node.label}${node.detail ? `: ${node.detail}` : ''}`),
      'Missing data:',
      ...(traceability.missingData.length ? traceability.missingData.map((item) => `- ${item}`) : ['- None']),
      'Sources:',
      ...traceability.sources.map((source) => `- ${source.citation}`),
    ] : []),
    '',
    'SUGGESTED NEXT STEP',
    result.nextStep,
    '',
    'Note: demonstration prototype. It does not replace clinical judgment, specialist reporting, Heart Team discussion, or guidelines.',
  ].join('\n')
}
