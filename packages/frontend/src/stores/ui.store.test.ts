import { describe, it, expect } from 'vitest'
import { useUiStore } from './ui.store'

describe('ui.store', () => {
  it('inizia su pagina home', () => {
    expect(useUiStore.getState().page).toBe('home')
  })

  it('selectedCaseId inizia null', () => {
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigate cambia pagina', () => {
    useUiStore.getState().navigate('new')
    expect(useUiStore.getState().page).toBe('new')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigate con caseId a detail imposta selectedCaseId', () => {
    useUiStore.getState().navigate('detail', 'abc-123')
    expect(useUiStore.getState().page).toBe('detail')
    expect(useUiStore.getState().selectedCaseId).toBe('abc-123')
  })

  it('navigate a nuova pagina resetta selectedCaseId', () => {
    useUiStore.getState().navigate('detail', 'abc-123')
    useUiStore.getState().navigate('home')
    expect(useUiStore.getState().page).toBe('home')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigate a detail senza caseId lascia selectedCaseId a null', () => {
    useUiStore.getState().navigate('detail')
    expect(useUiStore.getState().page).toBe('detail')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })
})
