import { describe, it, expect } from 'vitest'
import { calculateCmrScore, CMR_MAX, CMR_CUTOFF } from '../../src/scores/cmr-score'
import { cmrAllPresent, cmrAllAbsent, cmrPartial } from '../fixtures/cmr-features'

describe('CMR Mass Score', () => {
  describe('calculateCmrScore', () => {
    it('returns 0 when no feature is present', () => {
      expect(calculateCmrScore(cmrAllAbsent())).toBe(0)
    })

    it('returns 8 when all 6 features are present', () => {
      expect(calculateCmrScore(cmrAllPresent())).toBe(8)
    })

    it('returns the correct weight for partial features (infiltration + firstPassPerfusion)', () => {
      const features = cmrPartial(['infiltration', 'firstPassPerfusion'])
      expect(calculateCmrScore(features)).toBe(4) // 2 + 2
    })

    it('returns 2 with infiltration only', () => {
      expect(calculateCmrScore(cmrPartial(['infiltration']))).toBe(2)
    })

    it('returns 2 with firstPassPerfusion only', () => {
      expect(calculateCmrScore(cmrPartial(['firstPassPerfusion']))).toBe(2)
    })

    it('returns 1 with pericardialEffusion only', () => {
      expect(calculateCmrScore(cmrPartial(['pericardialEffusion']))).toBe(1)
    })

    it('returns 1 with sessile only', () => {
      expect(calculateCmrScore(cmrPartial(['sessile']))).toBe(1)
    })

    it('returns 1 with polylobated only', () => {
      expect(calculateCmrScore(cmrPartial(['polylobated']))).toBe(1)
    })

    it('returns 1 with heterogeneousEnhancement only', () => {
      expect(calculateCmrScore(cmrPartial(['heterogeneousEnhancement']))).toBe(1)
    })

    it('does not mutate input features (function purity)', () => {
      const features = cmrAllPresent()
      const original = { ...features }
      calculateCmrScore(features)
      expect(features).toEqual(original)
    })
  })

  describe('CMR_CUTOFF', () => {
    it('operational cutoff is 5', () => {
      expect(CMR_CUTOFF).toBe(5)
    })
  })

  describe('CMR_MAX', () => {
    it('maximum value is 8', () => {
      expect(CMR_MAX).toBe(8)
    })
  })
})
