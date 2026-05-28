import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DecisionCard } from './DecisionCard'
import type { ConsensusResult } from '@cm-dss/core'

function makeResult(risk: ConsensusResult['risk']): ConsensusResult {
  return {
    risk,
    title: `Rischio ${risk}`,
    subtitle: `Sottotitolo per ${risk}`,
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
  it('mostra titolo e sottotitolo per rischio alto', () => {
    render(<DecisionCard result={makeResult('high')} />)
    expect(screen.getByText('Rischio high')).toBeInTheDocument()
    expect(screen.getByText('Sottotitolo per high')).toBeInTheDocument()
  })

  it('mostra titolo e sottotitolo per rischio medio', () => {
    render(<DecisionCard result={makeResult('mid')} />)
    expect(screen.getByText('Rischio mid')).toBeInTheDocument()
  })

  it('mostra titolo e sottotitolo per rischio basso', () => {
    render(<DecisionCard result={makeResult('low')} />)
    expect(screen.getByText('Rischio low')).toBeInTheDocument()
  })

  it('mostra titolo per rischio non valutato', () => {
    render(<DecisionCard result={makeResult('not')} />)
    expect(screen.getByText('Rischio not')).toBeInTheDocument()
  })
})
