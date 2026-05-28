import type { ClinicalTraceability, TraceNode } from '@cm-dss/core'

interface TraceabilityPanelProps {
  traceability: ClinicalTraceability
}

const evidenceKinds = new Set<TraceNode['kind']>(['feature', 'score', 'cutoff', 'finding'])

export function TraceabilityPanel({ traceability }: TraceabilityPanelProps) {
  const evidenceNodes = traceability.nodes.filter((node) => evidenceKinds.has(node.kind))

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Clinical Traceability</h2>
          <p>Evidence chain linking observed findings, scores, cutoffs, rules, sources, and recommendations.</p>
        </div>
      </div>

      <p className="cm-decision-text">{traceability.summary}</p>

      <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Activated rules</p>
      <ul className="cm-evidence-list">
        {traceability.activatedRules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>

      <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Evidence chain</p>
      <ul className="cm-evidence-list">
        {evidenceNodes.map((node) => (
          <li key={node.id}>
            <strong>{node.label}</strong>{node.detail ? ` - ${node.detail}` : ''}
          </li>
        ))}
      </ul>

      {traceability.missingData.length > 0 && (
        <>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Missing data</p>
          <ul className="cm-evidence-list">
            {traceability.missingData.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </>
      )}

      <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Sources</p>
      <ul className="cm-evidence-list">
        {traceability.sources.map((source) => <li key={source.id}>{source.citation}</li>)}
      </ul>
    </article>
  )
}
