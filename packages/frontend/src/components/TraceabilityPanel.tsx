import { useState } from 'react'
import type { ClinicalTraceability, TraceNode } from '@cm-dss/core'

interface TraceabilityPanelProps {
  traceability: ClinicalTraceability
  collapsible?: boolean
  defaultOpen?: boolean
  title?: string
  subtitle?: string
}

const evidenceKinds = new Set<TraceNode['kind']>(['feature', 'score', 'cutoff', 'finding'])
const modalityOrder = ['echo', 'cmr', 'ct-pet', 'integrated', 'unspecified'] as const
const modalityLabels: Record<(typeof modalityOrder)[number], string> = {
  echo: 'Echocardiography',
  cmr: 'Cardiac magnetic resonance',
  'ct-pet': 'Cardiac CT / PET',
  integrated: 'Integrated reasoning',
  unspecified: 'Other evidence',
}

export function TraceabilityPanel({
  traceability,
  collapsible = false,
  defaultOpen = true,
  title = 'Clinical Traceability',
  subtitle = 'Evidence chain linking observed findings, scores, cutoffs, rules, sources, and recommendations.',
}: TraceabilityPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const evidenceNodes = traceability.nodes.filter((node) => evidenceKinds.has(node.kind))
  const evidenceByModality = evidenceNodes.reduce<Partial<Record<(typeof modalityOrder)[number], TraceNode[]>>>(
    (groups, node) => {
      const modality = node.modality ?? 'unspecified'
      groups[modality] = [...(groups[modality] ?? []), node]
      return groups
    },
    {},
  )

  const content = (
    <>
      <p className="cm-decision-text">{traceability.summary}</p>

      <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Activated rules</p>
      <ul className="cm-evidence-list">
        {traceability.activatedRules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>

      <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Evidence by modality</p>
      <div className="cm-traceability-groups">
        {modalityOrder.map((modality) => {
          const nodes = evidenceByModality[modality] ?? []
          if (nodes.length === 0) return null
          return (
            <section key={modality} className="cm-traceability-group">
              <h3>{modalityLabels[modality]}</h3>
              <ul className="cm-evidence-list">
                {nodes.map((node) => (
                  <li key={node.id}>
                    <strong>{node.label}</strong>{node.detail ? ` - ${node.detail}` : ''}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

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
    </>
  )

  if (collapsible) {
    return (
      <details className="cm-card cm-traceability-details" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
        <summary>
          <div className="cm-card-title">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <span className="cm-traceability-toggle">{isOpen ? 'Hide trace' : 'Show trace'}</span>
        </summary>
        {content}
      </details>
    )
  }

  return (
    <article className="cm-card cm-traceability-panel">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {content}
    </article>
  )
}
