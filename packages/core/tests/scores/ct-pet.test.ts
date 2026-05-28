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
    it('returns 0 when no CT sign is present', () => {
      expect(calculateCtSigns(ctAllAbsent())).toBe(0)
    })

    it('returns 8 when all CT signs are present', () => {
      expect(calculateCtSigns(ctAllPresent())).toBe(8)
    })

    it('returns the correct number for partial signs', () => {
      expect(calculateCtSigns(ctPartial(3))).toBe(3)
    })

    it('returns 5 for 5 CT signs', () => {
      expect(calculateCtSigns(ctPartial(5))).toBe(5)
    })
  })

  describe('evaluatePet', () => {
    it('returns false if all parameters are null', () => {
      expect(evaluatePet({ suvMax: null, mtv: null, tlg: null })).toBe(false)
    })

    it('returns true if suvMax >= 4.9', () => {
      expect(evaluatePet({ suvMax: 5.1, mtv: null, tlg: null })).toBe(true)
    })

    it('returns false if suvMax < 4.9', () => {
      expect(evaluatePet({ suvMax: 3.2, mtv: null, tlg: null })).toBe(false)
    })

    it('returns true if mtv >= 8.2', () => {
      expect(evaluatePet({ suvMax: null, mtv: 9.0, tlg: null })).toBe(true)
    })

    it('returns true if tlg >= 29', () => {
      expect(evaluatePet({ suvMax: null, mtv: null, tlg: 30 })).toBe(true)
    })

    it('returns false if all parameters are below threshold', () => {
      expect(evaluatePet({ suvMax: 2.1, mtv: 1.0, tlg: 5 })).toBe(false)
    })
  })

  describe('ctPetLevel', () => {
    it('returns high if CT >= 5 (PET absent)', () => {
      const result = ctPetLevel(6, false, false)
      expect(result).toBe('high')
    })

    it('returns high if CT = 5 (PET absent)', () => {
      const result = ctPetLevel(5, false, false)
      expect(result).toBe('high')
    })

    it('returns gray zone if CT = 3 and PET negative', () => {
      const result = ctPetLevel(3, false, true)
      expect(result).toBe('gray')
    })

    it('returns gray zone if CT = 4 and PET negative', () => {
      const result = ctPetLevel(4, false, true)
      expect(result).toBe('gray')
    })

    it('returns high if CT = 3-4 and PET positive', () => {
      const result = ctPetLevel(3, true, true)
      expect(result).toBe('high')
    })

    it('returns high if CT = 4 and PET positive', () => {
      const result = ctPetLevel(4, true, true)
      expect(result).toBe('high')
    })

    it('returns low if CT <= 2 and PET negative', () => {
      const result = ctPetLevel(1, false, false)
      expect(result).toBe('low')
    })

    it('returns low if CT = 2 and PET negative', () => {
      const result = ctPetLevel(2, false, false)
      expect(result).toBe('low')
    })

    it('returns discordant if CT <= 2 but PET positive', () => {
      const result = ctPetLevel(2, true, true)
      expect(result).toBe('discordant')
    })

    it('returns unavailable if CT = 3-4 and PET unavailable', () => {
      const result = ctPetLevel(3, false, false)
      expect(result).toBe('unavailable')
    })
  })
})
