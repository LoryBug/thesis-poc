import type { CmrFeatures, CtFeatures, EchoFeatures, ImagingData } from '../types'
import { calculateCmrScore, CMR_CUTOFF } from '../scores/cmr-score'
import { calculateCtSigns, ctPetLevel, evaluatePet } from '../scores/ct-pet'
import { calculateDemScore, DEM_CUTOFF, demProbability } from '../scores/dem-score'
import type { ConsensusResult } from '../consensus/types'
import { evaluateConsensus } from '../consensus/engine'
import { TRACE_SOURCES } from './sources'
import type { ClinicalTraceability, TraceEdge, TraceNode, TraceSource } from './types'

type FeatureDefinition<T extends string> = {
  key: T
  label: string
  points: number
  detail: string
}

const echoFeatures: FeatureDefinition<keyof EchoFeatures>[] = [
  { key: 'infiltration', label: 'Infiltration', points: 2, detail: 'Extension into myocardium, pericardium, or neighboring tissues.' },
  { key: 'polylobated', label: 'Polylobate mass', points: 2, detail: 'Two or more lobes with complex morphology.' },
  { key: 'pericardialEffusion', label: 'Moderate-severe pericardial effusion', points: 2, detail: 'Moderate-severe or clinically significant pericardial effusion.' },
  { key: 'sessile', label: 'Sessile appearance', points: 1, detail: 'Broad base without a clear peduncle.' },
  { key: 'inhomogeneity', label: 'Inhomogeneity', points: 1, detail: 'Heterogeneous echogenicity compared with myocardium.' },
  { key: 'nonLeftLocation', label: 'Non-left localization', points: 1, detail: 'Right heart, pericardium, or great vessels.' },
]

const cmrFeatures: FeatureDefinition<keyof CmrFeatures>[] = [
  { key: 'infiltration', label: 'Infiltration', points: 2, detail: 'Disruption or extension into adjacent tissues.' },
  { key: 'firstPassPerfusion', label: 'First-pass contrast perfusion', points: 2, detail: 'Mass perfusion after gadolinium administration.' },
  { key: 'pericardialEffusion', label: 'Pericardial effusion', points: 1, detail: 'More than mild, or mild after pericardiocentesis.' },
  { key: 'sessile', label: 'Sessile appearance', points: 1, detail: 'Direct wall attachment or broad base.' },
  { key: 'polylobated', label: 'Polylobate shape', points: 1, detail: 'Two or more lobes on multiplanar assessment.' },
  { key: 'heterogeneousEnhancement', label: 'Heterogeneity enhancement', points: 1, detail: 'Heterogeneous post-contrast enhancement pattern.' },
]

const ctFeatures: FeatureDefinition<keyof CtFeatures>[] = [
  { key: 'irregularMargins', label: 'Irregular margins', points: 1, detail: 'Non-circumscribed or spiculated profile.' },
  { key: 'pericardialEffusion', label: 'Pericardial effusion', points: 1, detail: 'Associated with a suspicious mass.' },
  { key: 'invasion', label: 'Invasion', points: 1, detail: 'Disruption or extension into adjacent structures.' },
  { key: 'solidNature', label: 'Solid nature', points: 1, detail: 'Density compatible with a solid component.' },
  { key: 'diameterOver30mm', label: 'Diameter >30 mm', points: 1, detail: 'Large size, not diagnostic on its own.' },
  { key: 'contrastUptake', label: 'Contrast uptake', points: 1, detail: 'Density increase after contrast medium.' },
  { key: 'preContrastSuspicious', label: 'Pre-contrast suspicious density', points: 1, detail: 'Pre-contrast density associated with suspicion.' },
  { key: 'calcifications', label: 'Calcifications', points: 1, detail: 'Sign included in the cardiac CT study.' },
]

export function buildTraceability(data: ImagingData, result: ConsensusResult = evaluateConsensus(data)): ClinicalTraceability {
  const nodes: TraceNode[] = []
  const edges: TraceEdge[] = []
  const sourceIds = new Set<string>()
  const activatedRules: string[] = []
  const missingData: string[] = []
  const recommendations: string[] = []

  function addNode(node: TraceNode) {
    if (!nodes.some((existing) => existing.id === node.id)) nodes.push(node)
    if (node.sourceId) sourceIds.add(node.sourceId)
  }

  function addEdge(edge: TraceEdge) {
    if (!edges.some((existing) => existing.from === edge.from && existing.to === edge.to && existing.relation === edge.relation)) {
      edges.push(edge)
    }
  }

  function addSourceNode(source: TraceSource) {
    sourceIds.add(source.id)
    addNode({ id: `source:${source.id}`, kind: 'source', label: source.title, detail: source.citation, sourceId: source.id })
  }

  function addFeatureNodes<T extends string>(params: {
    modality: 'echo' | 'cmr' | 'ct-pet'
    scoreNodeId: string
    source: TraceSource
    definitions: FeatureDefinition<T>[]
    values: Record<T, boolean>
  }) {
    for (const feature of params.definitions) {
      if (!params.values[feature.key]) continue
      const featureNodeId = `${params.modality}:feature:${feature.key}`
      addNode({
        id: featureNodeId,
        kind: 'feature',
        label: `${feature.label} (+${feature.points})`,
        detail: feature.detail,
        modality: params.modality,
        sourceId: params.source.id,
      })
      addEdge({ from: featureNodeId, to: params.scoreNodeId, relation: 'supports' })
    }
  }

  if (data.echoAvailable && data.echo !== null) {
    const demScore = calculateDemScore(data.echo)
    const scoreNodeId = 'echo:score:dem'
    const cutoffNodeId = 'echo:cutoff:dem'
    addSourceNode(TRACE_SOURCES.demScore)
    addNode({ id: scoreNodeId, kind: 'score', label: `DEM Score ${demScore}/9`, detail: `Estimated probability of malignancy ${demProbability(demScore)}%.`, modality: 'echo', sourceId: TRACE_SOURCES.demScore.id })
    addNode({ id: cutoffNodeId, kind: 'cutoff', label: `DEM cutoff >= ${DEM_CUTOFF}`, detail: 'Operational malignancy cutoff for the DEM Score.', modality: 'echo', sourceId: TRACE_SOURCES.demScore.id })
    addFeatureNodes({ modality: 'echo', scoreNodeId, source: TRACE_SOURCES.demScore, definitions: echoFeatures, values: data.echo })
    addEdge({ from: scoreNodeId, to: cutoffNodeId, relation: 'triggers' })
    addEdge({ from: cutoffNodeId, to: `source:${TRACE_SOURCES.demScore.id}`, relation: 'cites' })
    if (demScore >= DEM_CUTOFF) addRule('echo:rule:dem-positive', 'DEM Score above cutoff', 'Echocardiography is positive and second-level imaging is indicated.', 'echo', cutoffNodeId)
  } else {
    addMissing('echo:missing', 'Echocardiography not entered', 'DEM Score cannot be evaluated without echocardiographic features.')
  }

  if (data.cmrAvailable && data.cmr !== null) {
    const cmrScore = calculateCmrScore(data.cmr)
    const scoreNodeId = 'cmr:score:cmr-mass-score'
    const cutoffNodeId = 'cmr:cutoff:cmr-mass-score'
    addSourceNode(TRACE_SOURCES.cmrMassScore)
    addNode({ id: scoreNodeId, kind: 'score', label: `CMR Mass Score ${cmrScore}/8`, detail: 'Score integrating mass morphology and tissue characterization.', modality: 'cmr', sourceId: TRACE_SOURCES.cmrMassScore.id })
    addNode({ id: cutoffNodeId, kind: 'cutoff', label: `CMR Mass Score cutoff >= ${CMR_CUTOFF}`, detail: 'Operational malignancy cutoff for the CMR Mass Score.', modality: 'cmr', sourceId: TRACE_SOURCES.cmrMassScore.id })
    addFeatureNodes({ modality: 'cmr', scoreNodeId, source: TRACE_SOURCES.cmrMassScore, definitions: cmrFeatures, values: data.cmr })
    addEdge({ from: scoreNodeId, to: cutoffNodeId, relation: 'triggers' })
    addEdge({ from: cutoffNodeId, to: `source:${TRACE_SOURCES.cmrMassScore.id}`, relation: 'cites' })
    if (cmrScore >= CMR_CUTOFF) addRule('cmr:rule:cmr-positive', 'CMR Mass Score above cutoff', 'CMR is positive and carries dominant non-invasive diagnostic weight.', 'cmr', cutoffNodeId)
  } else {
    addMissing('cmr:missing', 'CMR not entered', 'CMR Mass Score cannot be evaluated without CMR features.')
  }

  if (data.ctpetAvailable && data.ct !== null) {
    const ctSigns = calculateCtSigns(data.ct)
    const petDataEntered = data.pet !== null && (data.pet.suvMax !== null || data.pet.mtv !== null || data.pet.tlg !== null)
    const petPositive = petDataEntered && data.pet !== null ? evaluatePet(data.pet) : false
    const ctLevel = ctPetLevel(ctSigns, petPositive, petDataEntered)
    const scoreNodeId = 'ct-pet:score:ct-signs'
    const cutoffNodeId = 'ct-pet:cutoff:ct-signs'
    addSourceNode(TRACE_SOURCES.ctPet)
    addNode({ id: scoreNodeId, kind: 'score', label: `Cardiac CT signs ${ctSigns}/8`, detail: 'Count of cardiac CT features associated with suspicion.', modality: 'ct-pet', sourceId: TRACE_SOURCES.ctPet.id })
    addNode({ id: cutoffNodeId, kind: 'cutoff', label: 'CT cutoffs: <=2 low, 3-4 gray zone, >=5 high', detail: 'PET/CT is especially useful in the CT gray zone or for staging.', modality: 'ct-pet', sourceId: TRACE_SOURCES.ctPet.id })
    addFeatureNodes({ modality: 'ct-pet', scoreNodeId, source: TRACE_SOURCES.ctPet, definitions: ctFeatures, values: data.ct })
    addEdge({ from: scoreNodeId, to: cutoffNodeId, relation: 'triggers' })
    addEdge({ from: cutoffNodeId, to: `source:${TRACE_SOURCES.ctPet.id}`, relation: 'cites' })
    addPetNodes(data, cutoffNodeId)
    if (ctLevel === 'high') addRule('ct-pet:rule:high-suspicion', 'CT/PET high-suspicion profile', 'Cardiac CT and PET/CT criteria support high suspicion.', 'ct-pet', cutoffNodeId)
    if (ctLevel === 'gray' || (ctSigns >= 3 && ctSigns <= 4 && !petDataEntered)) {
      addRule('ct-pet:rule:gray-zone', 'Cardiac CT gray zone', 'CT 3-4 signs requires PET/CT or CMR clarification.', 'ct-pet', cutoffNodeId)
    }
    if (ctLevel === 'discordant') addRule('ct-pet:rule:discordant', 'CT/PET discordance', 'PET positive with <=2 CT signs requires contextual review.', 'ct-pet', cutoffNodeId)
  } else {
    addMissing('ct-pet:missing', 'Cardiac CT/PET not entered', 'CT/PET pathway cannot be evaluated without cardiac CT features.')
  }

  const decisionRuleId = `integrated:rule:${result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'not-evaluated'}`
  addRule(decisionRuleId, result.title, result.explanation, 'integrated')
  addNode({ id: 'integrated:recommendation', kind: 'recommendation', label: result.nextStep, detail: result.subtitle, modality: 'integrated', sourceId: TRACE_SOURCES.multimodality.id })
  addSourceNode(TRACE_SOURCES.multimodality)
  addEdge({ from: decisionRuleId, to: 'integrated:recommendation', relation: 'recommends' })
  addEdge({ from: 'integrated:recommendation', to: `source:${TRACE_SOURCES.multimodality.id}`, relation: 'cites' })
  recommendations.push(result.nextStep)

  if (result.evidence.length > 0) {
    for (const item of result.evidence) {
      const evidenceNodeId = `integrated:finding:${slugify(item)}`
      addNode({ id: evidenceNodeId, kind: 'finding', label: item, modality: 'integrated' })
      addEdge({ from: evidenceNodeId, to: decisionRuleId, relation: 'supports' })
    }
  }

  return {
    title: result.title,
    summary: `${result.title}: ${result.subtitle}`,
    nodes,
    edges,
    sources: Object.values(TRACE_SOURCES).filter((source) => sourceIds.has(source.id)),
    activatedRules,
    missingData,
    recommendations,
  }

  function addRule(id: string, label: string, detail: string, modality: TraceNode['modality'], supportedBy?: string) {
    addNode({ id, kind: 'rule', label, detail, modality })
    if (!activatedRules.includes(label)) activatedRules.push(label)
    if (supportedBy) addEdge({ from: supportedBy, to: id, relation: 'triggers' })
  }

  function addMissing(id: string, label: string, detail: string) {
    addNode({ id, kind: 'missing-data', label, detail })
    missingData.push(label)
  }

  function addPetNodes(input: ImagingData, targetNodeId: string) {
    if (input.pet === null) {
      addMissing('ct-pet:missing:pet', 'PET parameters not entered', 'SUVmax, MTV and TLG are not available.')
      return
    }
    const params = [
      ['suvMax', 'SUVmax', 4.9, input.pet.suvMax],
      ['mtv', 'MTV', 8.2, input.pet.mtv],
      ['tlg', 'TLG', 29, input.pet.tlg],
    ] as const
    let anyPetValue = false
    for (const [key, label, cutoff, value] of params) {
      if (value === null) continue
      anyPetValue = true
      const nodeId = `ct-pet:pet:${key}`
      addNode({
        id: nodeId,
        kind: 'finding',
        label: `${label} ${value}`,
        detail: `${label} cutoff >= ${cutoff}; this value is ${value >= cutoff ? 'above' : 'below'} cutoff.`,
        modality: 'ct-pet',
        sourceId: TRACE_SOURCES.ctPet.id,
      })
      addEdge({ from: nodeId, to: targetNodeId, relation: value >= cutoff ? 'supports' : 'limits' })
    }
    if (!anyPetValue) addMissing('ct-pet:missing:pet', 'PET parameters not entered', 'SUVmax, MTV and TLG are not available.')
  }
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}
