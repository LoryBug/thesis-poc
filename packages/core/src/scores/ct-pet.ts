import type { CtFeatures, PetParameters } from '../types'

export const CT_MAX = 8
export const SUV_CUTOFF = 4.9
export const MTV_CUTOFF = 8.2
export const TLG_CUTOFF = 29

export function calculateCtSigns(features: CtFeatures): number {
  return Object.values(features).filter(Boolean).length
}

export function evaluatePet(params: PetParameters): boolean {
  const { suvMax, mtv, tlg } = params
  if (suvMax !== null && suvMax >= SUV_CUTOFF) return true
  if (mtv !== null && mtv >= MTV_CUTOFF) return true
  if (tlg !== null && tlg >= TLG_CUTOFF) return true
  return false
}

export type CtPetLevel = 'high' | 'gray' | 'low' | 'discordant' | 'unavailable'

export function ctPetLevel(
  ctSigns: number,
  petPositive: boolean,
  petAvailable: boolean,
): CtPetLevel {
  if (ctSigns >= 5) return 'high'
  if (ctSigns >= 3 && ctSigns <= 4) {
    if (!petAvailable) return 'unavailable'
    return petPositive ? 'high' : 'gray'
  }
  if (ctSigns <= 2) {
    if (!petAvailable || !petPositive) return 'low'
    return 'discordant'
  }
  return 'low'
}
