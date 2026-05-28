import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DecisionCard } from './DecisionCard'
import type { ConsensusResult } from '@cm-dss/core'

function makeResult(risk: ConsensusResult['risk']): ConsensusResult {
  return {
    risk,
    title: `Risk ${risk}`,
    subtitle: `Subtitle for ${risk}`,
    explanation: '',
    nextStep: '',
    evidence: [],
    modalities: {
      echo: { status: '', note: '' },
      cmr: { status: '', note: '' },
      ctPet: { status: '', note: '' },
    },
    integrated: { status: '', note: '' },
  }
}

describe('DecisionCard', () => {
  it('shows title and subtitle for high risk', () => {
    render(<DecisionCard result={makeResult('high')} />)
    expect(screen.getByText('Risk high')).toBeInTheDocument()
    expect(screen.getByText('Subtitle for high')).toBeInTheDocument()
  })

  it('shows title and subtitle for medium risk', () => {
    render(<DecisionCard result={makeResult('mid')} />)
    expect(screen.getByText('Risk mid')).toBeInTheDocument()
  })

  it('shows title and subtitle for low risk', () => {
    render(<DecisionCard result={makeResult('low')} />)
    expect(screen.getByText('Risk low')).toBeInTheDocument()
  })

  it('shows title for not-evaluated risk', () => {
    render(<DecisionCard result={makeResult('not')} />)
    expect(screen.getByText('Risk not')).toBeInTheDocument()
  })
})
