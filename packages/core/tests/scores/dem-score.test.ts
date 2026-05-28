import { describe, it, expect } from 'vitest'
import { calculateDemScore, demProbability, DEM_CUTOFF } from '../../src/scores/dem-score'
import { echoAllPresent, echoAllAbsent, echoPartial } from '../fixtures/echo-features'

describe('DEM Score', () => {
  describe('calculateDemScore', () => {
    it('returns 0 when no feature is present', () => {
      expect(calculateDemScore(echoAllAbsent())).toBe(0)
    })

    it('returns 9 when all 6 features are present', () => {
      expect(calculateDemScore(echoAllPresent())).toBe(9)
    })

    it('returns the correct weight for partial features (infiltration + sessile + nonLeftLocation)', () => {
      const features = echoPartial(['infiltration', 'sessile', 'nonLeftLocation'])
      expect(calculateDemScore(features)).toBe(4) // 2 + 1 + 1
    })

    it('returns 2 with infiltration only', () => {
      expect(calculateDemScore(echoPartial(['infiltration']))).toBe(2)
    })

    it('returns 2 with polylobated only', () => {
      expect(calculateDemScore(echoPartial(['polylobated']))).toBe(2)
    })

    it('returns 2 with pericardialEffusion only', () => {
      expect(calculateDemScore(echoPartial(['pericardialEffusion']))).toBe(2)
    })

    it('returns 1 with sessile only', () => {
      expect(calculateDemScore(echoPartial(['sessile']))).toBe(1)
    })

    it('returns 1 with inhomogeneity only', () => {
      expect(calculateDemScore(echoPartial(['inhomogeneity']))).toBe(1)
    })

    it('returns 1 with nonLeftLocation only', () => {
      expect(calculateDemScore(echoPartial(['nonLeftLocation']))).toBe(1)
    })

    it('does not mutate input features (function purity)', () => {
      const features = echoAllPresent()
      const original = { ...features }
      calculateDemScore(features)
      expect(features).toEqual(original)
    })
  })

  describe('demProbability', () => {
    it('returns 0% for score 0', () => {
      expect(demProbability(0)).toBe(0)
    })

    it('returns 2% for score 1', () => {
      expect(demProbability(1)).toBe(2)
    })

    it('returns 29% for score 3', () => {
      expect(demProbability(3)).toBe(29)
    })

    it('returns 65% for score 4', () => {
      expect(demProbability(4)).toBe(65)
    })

    it('returns 100% for score 9', () => {
      expect(demProbability(9)).toBe(100)
    })

    it('clamps negative scores to 0', () => {
      expect(demProbability(-5)).toBe(0)
    })

    it('clamps scores above 9 to 9', () => {
      expect(demProbability(15)).toBe(100)
    })
  })

  describe('DEM_CUTOFF', () => {
    it('operational cutoff is 3', () => {
      expect(DEM_CUTOFF).toBe(3)
    })
  })
})
