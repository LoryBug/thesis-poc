import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CtPetCard } from './CtPetCard'
import { useCaseStore } from '../stores/case.store'

describe('CtPetCard', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('shows message when unavailable', () => {
    render(<CtPetCard />)
    expect(screen.getByText(/Select availability/)).toBeInTheDocument()
  })

  it('shows CT checkboxes when available', () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    expect(screen.getByText('Irregular margins')).toBeInTheDocument()
    expect(screen.getByText('Calcifications')).toBeInTheDocument()
  })

  it('shows CT signs 0/8 initially', () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    expect(screen.getByText('0/8')).toBeInTheDocument()
  })

  it('counts selected CT signs', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Irregular margins'))
    await userEvent.click(screen.getByText('Invasion'))
    await userEvent.click(screen.getByText('Solid nature'))
    expect(screen.getByText('3/8')).toBeInTheDocument()
  })

  it('shows unavailable classification for CT 3 signs and absent PET', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Irregular margins'))
    await userEvent.click(screen.getByText('Pericardial effusion'))
    await userEvent.click(screen.getByText('Invasion'))
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
  })

  it('shows negative PET when SUVmax is below cutoff', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    const suvInput = screen.getByPlaceholderText('>= 4.9')
    await userEvent.type(suvInput, '3.2')
    expect(screen.getByText('Negative')).toBeInTheDocument()
  })

  it('shows positive PET when SUVmax is above cutoff', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    const suvInput = screen.getByPlaceholderText('>= 4.9')
    await userEvent.type(suvInput, '7.5')
    expect(screen.getByText('Positive')).toBeInTheDocument()
  })

  it('does not show PET status until a parameter is entered', () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    expect(screen.queryByText(/^PET:/)).not.toBeInTheDocument()
  })

  it('shows PET status when only MTV is entered', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    const mtvInput = screen.getByPlaceholderText('>= 8.2')
    await userEvent.type(mtvInput, '10.0')
    expect(screen.getByText('Positive')).toBeInTheDocument()
  })

  it('classification changes from unavailable to low suspicion with CT 1 and negative PET', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Irregular margins'))
    const suvInput = screen.getByPlaceholderText('>= 4.9')
    await userEvent.type(suvInput, '2.0')
    expect(screen.getByText('Low suspicion')).toBeInTheDocument()
  })

  it('classifies high suspicion with CT >=5 and negative PET', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Irregular margins'))
    await userEvent.click(screen.getByText('Invasion'))
    await userEvent.click(screen.getByText('Solid nature'))
    await userEvent.click(screen.getByText('Diameter >30 mm'))
    await userEvent.click(screen.getByText('Contrast uptake'))
    const suvInput = screen.getByPlaceholderText('>= 4.9')
    await userEvent.type(suvInput, '2.0')
    expect(screen.getByText('High suspicion')).toBeInTheDocument()
  })
})
