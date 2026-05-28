import { describe, it, expect, beforeEach } from 'vitest'
import { useHistoryStore } from './history.store'
import type { SavedCase } from '../lib/storage'

function makeCase(overrides?: Partial<SavedCase>): SavedCase {
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    date: overrides?.date ?? new Date().toISOString(),
    imagingData: {
      echoAvailable: false,
      echo: null,
      cmrAvailable: false,
      cmr: null,
      ctpetAvailable: false,
      ct: null,
      pet: null,
    },
    result: {
      risk: 'low',
      title: 'Test',
      subtitle: '',
      explanation: '',
      nextStep: '',
      evidence: [],
      modalities: {
        echo: { status: '', note: '' },
        cmr: { status: '', note: '' },
        ctPet: { status: '', note: '' },
      },
      integrated: { status: '', note: '' },
    },
    ...overrides,
  }
}

describe('history.store', () => {
  beforeEach(() => {
    useHistoryStore.getState().clearAll()
  })

  it('inizia vuoto', () => {
    expect(useHistoryStore.getState().cases).toHaveLength(0)
  })

  it('addCase aggiunge all\'inizio', () => {
    const store = useHistoryStore.getState()
    store.addCase(makeCase({ id: '1' }))
    store.addCase(makeCase({ id: '2' }))
    expect(useHistoryStore.getState().cases).toHaveLength(2)
    expect(useHistoryStore.getState().cases[0]?.id).toBe('2')
    expect(useHistoryStore.getState().cases[1]?.id).toBe('1')
  })

  it('removeCase rimuove per id', () => {
    const store = useHistoryStore.getState()
    store.addCase(makeCase({ id: 'a' }))
    store.addCase(makeCase({ id: 'b' }))
    store.addCase(makeCase({ id: 'c' }))
    store.removeCase('b')
    const ids = useHistoryStore.getState().cases.map((c) => c.id)
    expect(ids).toEqual(['c', 'a'])
  })

  it('removeCase non fallisce con id inesistente', () => {
    const store = useHistoryStore.getState()
    store.addCase(makeCase({ id: 'x' }))
    store.removeCase('nonexistent')
    expect(useHistoryStore.getState().cases).toHaveLength(1)
  })

  it('clearAll svuota la lista', () => {
    const store = useHistoryStore.getState()
    store.addCase(makeCase())
    store.addCase(makeCase())
    store.clearAll()
    expect(useHistoryStore.getState().cases).toHaveLength(0)
  })
})
