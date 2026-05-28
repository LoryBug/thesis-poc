import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CtPetCard } from './CtPetCard'
import { useCaseStore } from '../stores/case.store'

describe('CtPetCard', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('mostra messaggio quando non disponibile', () => {
    render(<CtPetCard />)
    expect(screen.getByText(/Seleziona la disponibilità/)).toBeInTheDocument()
  })

  it('mostra checkbox TC quando disponibile', () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    expect(screen.getByText('Margini irregolari')).toBeInTheDocument()
    expect(screen.getByText('Calcificazioni')).toBeInTheDocument()
  })

  it('mostra segni TC 0/8 inizialmente', () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    expect(screen.getByText('0/8')).toBeInTheDocument()
  })

  it('conta segni TC selezionati', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Margini irregolari'))
    await userEvent.click(screen.getByText('Invasione'))
    await userEvent.click(screen.getByText('Natura solida'))
    expect(screen.getByText('3/8')).toBeInTheDocument()
  })

  it('mostra classificazione zona grigia per TC 3 segni e PET assente', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Margini irregolari'))
    await userEvent.click(screen.getByText('Versamento pericardico'))
    await userEvent.click(screen.getByText('Invasione'))
    expect(screen.getByText('Non disponibile')).toBeInTheDocument()
  })

  it('mostra PET negativa quando SUVmax sotto cutoff', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    const suvInput = screen.getByPlaceholderText('≥ 4.9')
    await userEvent.type(suvInput, '3.2')
    expect(screen.getByText('Negativa')).toBeInTheDocument()
  })

  it('mostra PET positiva quando SUVmax sopra cutoff', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    const suvInput = screen.getByPlaceholderText('≥ 4.9')
    await userEvent.type(suvInput, '7.5')
    expect(screen.getByText('Positiva')).toBeInTheDocument()
  })

  it('non mostra stato PET finche nessun parametro inserito', () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    expect(screen.queryByText(/^PET:/)).not.toBeInTheDocument()
  })

  it('mostra stato PET quando solo MTV inserito', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    const mtvInput = screen.getByPlaceholderText('≥ 8.2')
    await userEvent.type(mtvInput, '10.0')
    expect(screen.getByText('Positiva')).toBeInTheDocument()
  })

  it('classificazione cambia da "Non disponibile" a "Basso sospetto" con TC 1 e PET negativa', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Margini irregolari'))
    const suvInput = screen.getByPlaceholderText('≥ 4.9')
    await userEvent.type(suvInput, '2.0')
    expect(screen.getByText('Basso sospetto')).toBeInTheDocument()
  })

  it('classificazione "Alto sospetto" con TC >=5 e PET negativa', async () => {
    useCaseStore.getState().setCtpetAvailable(true)
    render(<CtPetCard />)
    await userEvent.click(screen.getByText('Margini irregolari'))
    await userEvent.click(screen.getByText('Invasione'))
    await userEvent.click(screen.getByText('Natura solida'))
    await userEvent.click(screen.getByText('Diametro >30mm'))
    await userEvent.click(screen.getByText('Captazione contrasto'))
    const suvInput = screen.getByPlaceholderText('≥ 4.9')
    await userEvent.type(suvInput, '2.0')
    expect(screen.getByText('Alto sospetto')).toBeInTheDocument()
  })
})
