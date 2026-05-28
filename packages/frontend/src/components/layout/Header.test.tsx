import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'
import { useUiStore } from '../../stores/ui.store'

describe('Header', () => {
  beforeEach(() => {
    useUiStore.getState().navigate('home')
  })

  it('mostra il titolo dell\'app', () => {
    render(<Header />)
    expect(screen.getByText('Cardiac Mass DSS')).toBeInTheDocument()
  })

  it('mostra i pulsanti di navigazione', () => {
    render(<Header />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Nuova Valutazione')).toBeInTheDocument()
  })

  it('cliccando Dashboard si va a home', async () => {
    useUiStore.getState().navigate('new')
    render(<Header />)
    await userEvent.click(screen.getByText('Dashboard'))
    expect(useUiStore.getState().page).toBe('home')
  })

  it('cliccando Nuova Valutazione si va a new', async () => {
    render(<Header />)
    await userEvent.click(screen.getByText('Nuova Valutazione'))
    expect(useUiStore.getState().page).toBe('new')
  })

  it('evidenzia il pulsante attivo', () => {
    useUiStore.getState().navigate('home')
    render(<Header />)
    const dashBtn = screen.getByText('Dashboard')
    expect(dashBtn.style.background).toBe('rgba(255, 255, 255, 0.15)')
  })
})
