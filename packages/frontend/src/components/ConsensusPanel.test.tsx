import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConsensusPanel } from './ConsensusPanel'
import type { ConsensusResult } from '@cm-dss/core'

const mockResult: ConsensusResult = {
  risk: 'high',
  title: 'Alto sospetto',
  subtitle: 'DEM e CMR sopra cutoff',
  explanation: 'Spiegazione clinica della decisione.',
  nextStep: 'Discussione in Heart Team.',
  evidence: [
    'DEM Score >= 3 (punteggio: 6/9).',
    'CMR Mass Score >= 5 (punteggio: 6/8).',
  ],
  modalities: {
    echo: { status: 'DEM positivo (6/9)', note: 'Primo livello positivo.' },
    cmr: { status: 'CMR Mass Score positivo (6/8)', note: 'Esame dominante positivo.' },
    ctPet: { status: 'Non disponibile', note: 'Percorso alternativo.' },
  },
  integrated: { status: 'Concordanza eco-CMR', note: 'Alto sospetto.' },
}

describe('ConsensusPanel', () => {
  it('mostra il titolo dalla decision card', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('Alto sospetto')).toBeInTheDocument()
  })

  it('mostra spiegazione', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('Spiegazione clinica della decisione.')).toBeInTheDocument()
  })

  it('mostra prossimo passo', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('Discussione in Heart Team.')).toBeInTheDocument()
  })

  it('mostra evidenze', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('DEM Score >= 3 (punteggio: 6/9).')).toBeInTheDocument()
    expect(screen.getByText('CMR Mass Score >= 5 (punteggio: 6/8).')).toBeInTheDocument()
  })

  it('mostra stato delle modalità', () => {
    render(<ConsensusPanel result={mockResult} />)
    expect(screen.getByText('DEM positivo (6/9)')).toBeInTheDocument()
    expect(screen.getByText('CMR Mass Score positivo (6/8)')).toBeInTheDocument()
  })

  it('mostra messaggio quando nessuna evidenza', () => {
    const noEvidence = { ...mockResult, evidence: [] }
    render(<ConsensusPanel result={noEvidence} />)
    expect(screen.getByText('Nessuna evidenza generata.')).toBeInTheDocument()
  })
})
