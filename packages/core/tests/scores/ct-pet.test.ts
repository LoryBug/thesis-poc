import { describe, it, expect } from 'vitest'
import {
  calculateCtSigns,
  evaluatePet,
  ctPetLevel,
  CT_MAX,
} from '../../src/scores/ct-pet'
import { ctAllAbsent, ctAllPresent, ctPartial } from '../fixtures/ct-features'

describe('CT/PET scoring', () => {
  describe('calculateCtSigns', () => {
    it('restituisce 0 quando nessun segno TC e presente', () => {
      expect(calculateCtSigns(ctAllAbsent())).toBe(0)
    })

    it('restituisce 8 quando tutti i segni TC sono presenti', () => {
      expect(calculateCtSigns(ctAllPresent())).toBe(8)
    })

    it('restituisce il numero corretto per segni parziali', () => {
      expect(calculateCtSigns(ctPartial(3))).toBe(3)
    })

    it('restituisce 5 per 5 segni TC', () => {
      expect(calculateCtSigns(ctPartial(5))).toBe(5)
    })
  })

  describe('evaluatePet', () => {
    it('restituisce false se tutti i parametri sono null', () => {
      expect(evaluatePet({ suvMax: null, mtv: null, tlg: null })).toBe(false)
    })

    it('restituisce true se suvMax >= 4.9', () => {
      expect(evaluatePet({ suvMax: 5.1, mtv: null, tlg: null })).toBe(true)
    })

    it('restituisce false se suvMax < 4.9', () => {
      expect(evaluatePet({ suvMax: 3.2, mtv: null, tlg: null })).toBe(false)
    })

    it('restituisce true se mtv >= 8.2', () => {
      expect(evaluatePet({ suvMax: null, mtv: 9.0, tlg: null })).toBe(true)
    })

    it('restituisce true se tlg >= 29', () => {
      expect(evaluatePet({ suvMax: null, mtv: null, tlg: 30 })).toBe(true)
    })

    it('restituisce false se tutti i parametri sono sotto soglia', () => {
      expect(evaluatePet({ suvMax: 2.1, mtv: 1.0, tlg: 5 })).toBe(false)
    })
  })

  describe('ctPetLevel', () => {
    it('restituisce alto se CT >= 5 (PET assente)', () => {
      const result = ctPetLevel(6, false, false)
      expect(result).toBe('high')
    })

    it('restituisce alto se CT = 5 (PET assente)', () => {
      const result = ctPetLevel(5, false, false)
      expect(result).toBe('high')
    })

    it('restituisce zona grigia se CT = 3 e PET negativa', () => {
      const result = ctPetLevel(3, false, true)
      expect(result).toBe('gray')
    })

    it('restituisce zona grigia se CT = 4 e PET negativa', () => {
      const result = ctPetLevel(4, false, true)
      expect(result).toBe('gray')
    })

    it('restituisce alto se CT = 3-4 e PET positiva', () => {
      const result = ctPetLevel(3, true, true)
      expect(result).toBe('high')
    })

    it('restituisce alto se CT = 4 e PET positiva', () => {
      const result = ctPetLevel(4, true, true)
      expect(result).toBe('high')
    })

    it('restituisce basso se CT <= 2 e PET negativa', () => {
      const result = ctPetLevel(1, false, false)
      expect(result).toBe('low')
    })

    it('restituisce basso se CT = 2 e PET negativa', () => {
      const result = ctPetLevel(2, false, false)
      expect(result).toBe('low')
    })

    it('restituisce discordante se CT <= 2 ma PET positiva', () => {
      const result = ctPetLevel(2, true, true)
      expect(result).toBe('discordant')
    })

    it('restituisce non valutabile se CT = 3-4 e PET non disponibile', () => {
      const result = ctPetLevel(3, false, false)
      expect(result).toBe('unavailable')
    })
  })
})
