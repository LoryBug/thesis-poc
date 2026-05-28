import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EchoCard } from './EchoCard'
import { useCaseStore } from '../stores/case.store'

describe('EchoCard', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('shows message when unavailable', () => {
    render(<EchoCard />)
    expect(screen.getByText(/Select availability/)).toBeInTheDocument()
  })

  it('shows feature checkboxes when available', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    expect(screen.getByText('Infiltration')).toBeInTheDocument()
    expect(screen.getByText('Polylobate mass')).toBeInTheDocument()
    expect(screen.getByText('Pericardial effusion')).toBeInTheDocument()
    expect(screen.getByText('Sessile appearance')).toBeInTheDocument()
    expect(screen.getByText('Inhomogeneity')).toBeInTheDocument()
    expect(screen.getByText('Non-left localization')).toBeInTheDocument()
  })

  it('shows score 0 when no feature is selected', () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    expect(screen.getByText('0/9')).toBeInTheDocument()
  })

  it('shows calculated DEM Score when a feature is selected', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    await userEvent.click(screen.getByText('Infiltration'))
    expect(screen.getByText('2/9')).toBeInTheDocument()
    expect(screen.getByText('Below cutoff')).toBeInTheDocument()
  })

  it('shows positive when DEM >= cutoff', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    await userEvent.click(screen.getByText('Infiltration'))
    await userEvent.click(screen.getByText('Polylobate mass'))
    await userEvent.click(screen.getByText('Pericardial effusion'))
    expect(screen.getByText('Positive')).toBeInTheDocument()
    expect(screen.getByText('6/9')).toBeInTheDocument()
  })

  it('shows DEM probability when score is calculated', async () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    await userEvent.click(screen.getByText('Infiltration'))
    expect(screen.getByText(/Estimated probability of malignancy:/)).toBeInTheDocument()
  })

  it('shows probability 0 when no feature is selected', () => {
    useCaseStore.getState().setEchoAvailable(true)
    render(<EchoCard />)
    expect(screen.getByText(/Estimated probability of malignancy: 0%/)).toBeInTheDocument()
  })
})
