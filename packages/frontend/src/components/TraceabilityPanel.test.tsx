import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TraceabilityPanel } from './TraceabilityPanel'
import type { ClinicalTraceability } from '@cm-dss/core'

const traceability: ClinicalTraceability = {
  title: 'CMR-driven high suspicion',
  summary: 'CMR-driven high suspicion: CMR Mass Score above cutoff.',
  activatedRules: ['CMR Mass Score above cutoff'],
  missingData: ['Echocardiography not entered'],
  recommendations: ['Heart Team discussion.'],
  sources: [{
    id: 'paolisso_2024_cmr_mass_score',
    title: 'CMR Mass Score',
    citation: 'Paolisso et al., CMR Mass Score, 2024.',
    year: 2024,
  }],
  nodes: [
    { id: 'cmr:feature:infiltration', kind: 'feature', label: 'Infiltration (+2)', detail: 'Disruption or extension into adjacent tissues.' },
    { id: 'cmr:score:cmr-mass-score', kind: 'score', label: 'CMR Mass Score 5/8' },
  ],
  edges: [],
}

describe('TraceabilityPanel', () => {
  it('shows activated rules, evidence, missing data and sources', () => {
    render(<TraceabilityPanel traceability={traceability} />)

    expect(screen.getByText('Clinical Traceability')).toBeInTheDocument()
    expect(screen.getByText('CMR Mass Score above cutoff')).toBeInTheDocument()
    expect(screen.getByText(/Infiltration/)).toBeInTheDocument()
    expect(screen.getByText('Echocardiography not entered')).toBeInTheDocument()
    expect(screen.getByText('Paolisso et al., CMR Mass Score, 2024.')).toBeInTheDocument()
  })
})
