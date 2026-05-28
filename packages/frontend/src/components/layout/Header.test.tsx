import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'
import { useUiStore } from '../../stores/ui.store'

describe('Header', () => {
  beforeEach(() => {
    useUiStore.getState().navigate('home')
  })

  it('shows the app title', () => {
    render(<Header />)
    expect(screen.getByText('Cardiac Mass DSS')).toBeInTheDocument()
  })

  it('shows navigation buttons', () => {
    render(<Header />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('New Evaluation')).toBeInTheDocument()
    expect(screen.getByText('Explainability Guide')).toBeInTheDocument()
  })

  it('clicking Dashboard navigates home', async () => {
    useUiStore.getState().navigate('new')
    render(<Header />)
    await userEvent.click(screen.getByText('Dashboard'))
    expect(useUiStore.getState().page).toBe('home')
  })

  it('clicking New Evaluation navigates to new', async () => {
    render(<Header />)
    await userEvent.click(screen.getByText('New Evaluation'))
    expect(useUiStore.getState().page).toBe('new')
  })

  it('clicking Explainability Guide navigates to guide', async () => {
    render(<Header />)
    await userEvent.click(screen.getByText('Explainability Guide'))
    expect(useUiStore.getState().page).toBe('guide')
  })

  it('highlights the active button', () => {
    useUiStore.getState().navigate('home')
    render(<Header />)
    const dashBtn = screen.getByText('Dashboard')
    expect(dashBtn.style.background).toBe('rgba(255, 255, 255, 0.15)')
  })
})
