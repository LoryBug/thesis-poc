import { describe, expect, it } from 'vitest'
import { evaluateConsensus } from '@cm-dss/core'
import { syntheticCases } from './synthetic-cases'

const expectedDecisions: Record<string, { risk: string; title: string }> = {
  'GC-00': { risk: 'not', title: 'Decision not evaluated' },
  'GC-01': { risk: 'low', title: 'Low suspicion with available data' },
  'GC-02': { risk: 'mid', title: 'Significant echocardiographic suspicion' },
  'GC-03': { risk: 'high', title: 'Concordant high-suspicion echo-CMR' },
  'GC-04': { risk: 'high', title: 'CMR-driven high suspicion' },
  'GC-05': { risk: 'mid', title: 'Echo-CMR discordance' },
  'GC-06': { risk: 'mid', title: 'Cardiac CT gray zone' },
  'GC-07': { risk: 'high', title: 'CT/PET-driven high suspicion' },
  'GC-08': { risk: 'mid', title: 'Discordant CT/PET result' },
  'GC-09': { risk: 'high', title: 'Discordance between advanced modalities' },
}

describe('syntheticCases', () => {
  it('contains the documented GC-00 to GC-09 cases', () => {
    expect(syntheticCases.map((item) => item.id)).toEqual([
      'GC-00',
      'GC-01',
      'GC-02',
      'GC-03',
      'GC-04',
      'GC-05',
      'GC-06',
      'GC-07',
      'GC-08',
      'GC-09',
    ])
  })

  it.each(syntheticCases)('$id evaluates to the documented decision', (sample) => {
    const result = evaluateConsensus(sample.imagingData)

    expect(result.risk).toBe(expectedDecisions[sample.id]?.risk)
    expect(result.title).toBe(expectedDecisions[sample.id]?.title)
    expect(sample.metadata.caseId).toBe(sample.id)
  })
})
