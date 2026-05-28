import { describe, it, expect } from 'vitest'
import { useUiStore } from './ui.store'

describe('ui.store', () => {
  it('starts on the home page', () => {
    expect(useUiStore.getState().page).toBe('home')
  })

  it('selectedCaseId starts null', () => {
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigate changes page', () => {
    useUiStore.getState().navigate('new')
    expect(useUiStore.getState().page).toBe('new')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigates to the explainability guide', () => {
    useUiStore.getState().navigate('guide')
    expect(useUiStore.getState().page).toBe('guide')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigate with caseId to detail sets selectedCaseId', () => {
    useUiStore.getState().navigate('detail', 'abc-123')
    expect(useUiStore.getState().page).toBe('detail')
    expect(useUiStore.getState().selectedCaseId).toBe('abc-123')
  })

  it('navigate to a new page resets selectedCaseId', () => {
    useUiStore.getState().navigate('detail', 'abc-123')
    useUiStore.getState().navigate('home')
    expect(useUiStore.getState().page).toBe('home')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })

  it('navigate to detail without caseId leaves selectedCaseId null', () => {
    useUiStore.getState().navigate('detail')
    expect(useUiStore.getState().page).toBe('detail')
    expect(useUiStore.getState().selectedCaseId).toBeNull()
  })
})
