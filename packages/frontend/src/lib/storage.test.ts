import { beforeEach, describe, expect, it } from 'vitest'
import { loadCases, saveCases } from './storage'
import type { SavedCase } from './storage'

const storageKey = 'cm-dss-history@1'

function makeSavedCase(overrides?: Partial<SavedCase>): SavedCase {
  return {
    id: 'case-1',
    date: '2026-05-28T00:00:00.000Z',
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
      risk: 'not',
      title: 'Decision not evaluated',
      subtitle: 'No examination available.',
      explanation: 'Enter at least one examination to obtain an assessment.',
      nextStep: 'Complete clinical/imaging input.',
      evidence: [],
      modalities: {
        echo: { status: 'Unavailable', note: 'First-line imaging not entered.' },
        cmr: { status: 'Unavailable', note: 'Most comprehensive non-invasive examination after echocardiography.' },
        ctPet: { status: 'Unavailable', note: 'Alternative or complementary pathway.' },
      },
      integrated: { status: 'Awaiting input', note: '' },
    },
    ...overrides,
  }
}

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads saved cases written by saveCases', () => {
    saveCases([makeSavedCase()])

    expect(loadCases()).toHaveLength(1)
    expect(loadCases()[0]?.id).toBe('case-1')
  })

  it('filters malformed persisted cases and repairs storage', () => {
    localStorage.setItem(storageKey, JSON.stringify([
      makeSavedCase({ id: 'valid' }),
      { id: 'bad-imaging', date: '2026-05-28T00:00:00.000Z', imagingData: null, result: makeSavedCase().result },
      { id: 'bad-result', date: '2026-05-28T00:00:00.000Z', imagingData: makeSavedCase().imagingData, result: null },
    ]))

    const cases = loadCases()

    expect(cases.map((item) => item.id)).toEqual(['valid'])
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toHaveLength(1)
  })
})
