import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EchoCard } from './EchoCard'
import { useCaseStore } from '../stores/case.store'

describe('EchoCard', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('mostra messaggio quando non disponibile', () => {
    render(<EchoCard />)
    expect(screen.getByText(/Seleziona la disponibilità/)).toBeInTheDocument()
  })

  it('mostra i checkbox delle feature quando disponibile', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    expect(screen.getByText('Infiltrazione')).toBeInTheDocument()
    expect(screen.getByText('Polilobato')).toBeInTheDocument()
    expect(screen.getByText('Versamento pericardico')).toBeInTheDocument()
    expect(screen.getByText('Sessile (base larga)')).toBeInTheDocument()
    expect(screen.getByText('Inomogeneità')).toBeInTheDocument()
    expect(screen.getByText('Localizzazione non a sinistra')).toBeInTheDocument()
  })

  it('mostra score 0 quando nessuna feature selezionata', () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    expect(screen.getByText('0/9')).toBeInTheDocument()
  })

  it('mostra DEM Score calcolato quando si seleziona una feature', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    await userEvent.click(screen.getByText('Infiltrazione'))
    expect(screen.getByText('2/9')).toBeInTheDocument()
    expect(screen.getByText('sotto cutoff')).toBeInTheDocument()
  })

  it('mostra POSITIVO quando DEM >= cutoff', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    await userEvent.click(screen.getByText('Infiltrazione'))
    await userEvent.click(screen.getByText('Polilobato'))
    await userEvent.click(screen.getByText('Versamento pericardico'))
    expect(screen.getByText('POSITIVO')).toBeInTheDocument()
    expect(screen.getByText('6/9')).toBeInTheDocument()
  })

  it('mostra probabilita DEM quando score calcolato', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    await userEvent.click(screen.getByText('Infiltrazione'))
    expect(screen.getByText(/Probabilità stimata:/)).toBeInTheDocument()
  })

  it('mostra probabilita 0 quando nessuna feature selezionata', () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    expect(screen.getByText(/Probabilità stimata: 0%/)).toBeInTheDocument()
  })
})
