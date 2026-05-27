import type { EchoFeatures } from '../types'

const DEM_WEIGHTS: Record<keyof EchoFeatures, number> = {
  infiltration: 2,
  polylobated: 2,
  pericardialEffusion: 2,
  sessile: 1,
  inhomogeneity: 1,
  nonLeftLocation: 1,
}

export const DEM_MAX = 9
export const DEM_CUTOFF = 3

export function calculateDemScore(features: EchoFeatures): number {
  return Object.entries(features).reduce(
    (sum, [key, value]) => sum + (value ? DEM_WEIGHTS[key as keyof EchoFeatures] : 0),
    0,
  )
}

const PROBABILITY_MAP: Record<number, number> = {
  0: 0,
  1: 2,
  2: 8,
  3: 29,
  4: 65,
  5: 89,
  6: 97,
  7: 99,
  8: 100,
  9: 100,
}

export function demProbability(score: number): number {
  const clamped = Math.min(Math.max(score, 0), DEM_MAX)
  return PROBABILITY_MAP[clamped] ?? 0
}
