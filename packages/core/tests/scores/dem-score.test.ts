import { describe, it, expect } from 'vitest'
import { calculateDemScore, demProbability, DEM_CUTOFF } from '../../src/scores/dem-score'
import { echoAllPresent, echoAllAbsent, echoPartial } from '../fixtures/echo-features'

describe('DEM Score', () => {
  describe('calculateDemScore', () => {
    it('restituisce 0 quando nessuna feature e presente', () => {
      expect(calculateDemScore(echoAllAbsent())).toBe(0)
    })

    it('restituisce 9 quando tutte le 6 feature sono presenti', () => {
      expect(calculateDemScore(echoAllPresent())).toBe(9)
    })

    it('restituisce il peso corretto per feature parziali (infiltration + sessile + nonLeftLocation)', () => {
      const features = echoPartial(['infiltration', 'sessile', 'nonLeftLocation'])
      expect(calculateDemScore(features)).toBe(4) // 2 + 1 + 1
    })

    it('restituisce 2 con solo infiltration', () => {
      expect(calculateDemScore(echoPartial(['infiltration']))).toBe(2)
    })

    it('restituisce 2 con solo polylobated', () => {
      expect(calculateDemScore(echoPartial(['polylobated']))).toBe(2)
    })

    it('restituisce 2 con solo pericardialEffusion', () => {
      expect(calculateDemScore(echoPartial(['pericardialEffusion']))).toBe(2)
    })

    it('restituisce 1 con solo sessile', () => {
      expect(calculateDemScore(echoPartial(['sessile']))).toBe(1)
    })

    it('restituisce 1 con solo inhomogeneity', () => {
      expect(calculateDemScore(echoPartial(['inhomogeneity']))).toBe(1)
    })

    it('restituisce 1 con solo nonLeftLocation', () => {
      expect(calculateDemScore(echoPartial(['nonLeftLocation']))).toBe(1)
    })

    it('non modifica le feature in input (purezza funzione)', () => {
      const features = echoAllPresent()
      const original = { ...features }
      calculateDemScore(features)
      expect(features).toEqual(original)
    })
  })

  describe('demProbability', () => {
    it('restituisce 0% per score 0', () => {
      expect(demProbability(0)).toBe(0)
    })

    it('restituisce 2% per score 1', () => {
      expect(demProbability(1)).toBe(2)
    })

    it('restituisce 29% per score 3', () => {
      expect(demProbability(3)).toBe(29)
    })

    it('restituisce 65% per score 4', () => {
      expect(demProbability(4)).toBe(65)
    })

    it('restituisce 100% per score 9', () => {
      expect(demProbability(9)).toBe(100)
    })

    it('restringe score negativi a 0', () => {
      expect(demProbability(-5)).toBe(0)
    })

    it('restringe score oltre 9 a 9', () => {
      expect(demProbability(15)).toBe(100)
    })
  })

  describe('DEM_CUTOFF', () => {
    it('il cutoff operativo e 3', () => {
      expect(DEM_CUTOFF).toBe(3)
    })
  })
})
