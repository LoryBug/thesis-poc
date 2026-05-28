import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConsensusPanel } from './ConsensusPanel'
import type { ConsensusResult } from '@cm-dss/core'

const mockResult: ConsensusResult = {
  risk: 'high',
  title: 'High suspicion',
  subtitle: 'DEM and CMR above cutoff',
  explanation: 'Clinical explanation of the decision.',
  nextStep: 'Heart Team discussion.',
  evidence: [
    'DEM Score >= 3 (score: 6/9).',
    'CMR Mass Score >= 5 (score: 6/8).',
  ],
  modalities: {
    echo: { status: 'DEM positive (6/9)', note: 'Positive first-line imaging.' },
    cmr: { status: 'CMR Mass Score positive (6/8)', note: 'Dominant examination positive.' },
    ctPet: { status: 'Unavailable', note: 'Alternative pathway.' },
  },
  integrated: { status: 'Echo-CMR concordance', note: 'High suspicion.' },
}

describe('ConsensusPanel', () => {
  it('shows the decision title', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('High suspicion')).toBeInTheDocument()
  })

  it('shows explanation', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('Clinical explanation of the decision.')).toBeInTheDocument()
  })

  it('shows next step', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('Heart Team discussion.')).toBeInTheDocument()
  })

  it('shows evidence', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('DEM Score >= 3 (score: 6/9).')).toBeInTheDocument()
    expect(screen.getByText('CMR Mass Score >= 5 (score: 6/8).')).toBeInTheDocument()
  })

  it('shows modality status', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('DEM positive (6/9)')).toBeInTheDocument()
    expect(screen.getByText('CMR Mass Score positive (6/8)')).toBeInTheDocument()
  })

  it('shows message when there is no evidence', () => {
    const noEvidence = { ...mockResult, evidence: [] }
    render(<ConsensusPanel result={noEvidence} />)
    expect(screen.getByText('No evidence generated.')).toBeInTheDocument()
  })
})
