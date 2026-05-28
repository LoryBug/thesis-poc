export type TraceNodeKind = 'feature' | 'score' | 'cutoff' | 'rule' | 'source' | 'recommendation' | 'missing-data' | 'finding'

export type TraceEdgeRelation = 'supports' | 'triggers' | 'derived-from' | 'requires' | 'cites' | 'recommends' | 'limits'

export interface TraceSource {
  id: string
  title: string
  citation: string
  year: number
}

export interface TraceNode {
  id: string
  kind: TraceNodeKind
  label: string
  detail?: string
  modality?: 'echo' | 'cmr' | 'ct-pet' | 'integrated'
  sourceId?: string
}

export interface TraceEdge {
  from: string
  to: string
  relation: TraceEdgeRelation
}

export interface ClinicalTraceability {
  title: string
  summary: string
  nodes: TraceNode[]
  edges: TraceEdge[]
  sources: TraceSource[]
  activatedRules: string[]
  missingData: string[]
  recommendations: string[]
}
