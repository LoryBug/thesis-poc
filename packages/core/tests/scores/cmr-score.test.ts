import { describe, it, expect } from 'vitest'
import { calculateCmrScore, CMR_MAX, CMR_CUTOFF } from '../../src/scores/cmr-score'
import { cmrAllPresent, cmrAllAbsent, cmrPartial } from '../fixtures/cmr-features'

describe('CMR Mass Score', () => {
  describe('calculateCmrScore', () => {
    it('restituisce 0 quando nessuna feature e presente', () => {
      expect(calculateCmrScore(cmrAllAbsent())).toBe(0)
    })

    it('restituisce 8 quando tutte le 6 feature sono presenti', () => {
      expect(calculateCmrScore(cmrAllPresent())).toBe(8)
    })

    it('restituisce il peso corretto per feature parziali (infiltration + firstPassPerfusion)', () => {
      const features = cmrPartial(['infiltration', 'firstPassPerfusion'])
      expect(calculateCmrScore(features)).toBe(4) // 2 + 2
    })

    it('restituisce 2 con solo infiltration', () => {
      expect(calculateCmrScore(cmrPartial(['infiltration']))).toBe(2)
    })

    it('restituisce 2 con solo firstPassPerfusion', () => {
      expect(calculateCmrScore(cmrPartial(['firstPassPerfusion']))).toBe(2)
    })

    it('restituisce 1 con solo pericardialEffusion', () => {
      expect(calculateCmrScore(cmrPartial(['pericardialEffusion']))).toBe(1)
    })

    it('restituisce 1 con solo sessile', () => {
      expect(calculateCmrScore(cmrPartial(['sessile']))).toBe(1)
    })

    it('restituisce 1 con solo polylobated', () => {
      expect(calculateCmrScore(cmrPartial(['polylobated']))).toBe(1)
    })

    it('restituisce 1 con solo heterogeneousEnhancement', () => {
      expect(calculateCmrScore(cmrPartial(['heterogeneousEnhancement']))).toBe(1)
    })

    it('non modifica le feature in input (purezza funzione)', () => {
      const features = cmrAllPresent()
      const original = { ...features }
      calculateCmrScore(features)
      expect(features).toEqual(original)
    })
  })

  describe('CMR_CUTOFF', () => {
    it('il cutoff operativo e 5', () => {
      expect(CMR_CUTOFF).toBe(5)
    })
  })

  describe('CMR_MAX', () => {
    it('il valore massimo e 8', () => {
      expect(CMR_MAX).toBe(8)
    })
  })
})
