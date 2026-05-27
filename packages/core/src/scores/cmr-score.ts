import type { CmrFeatures } from '../types'

const CMR_WEIGHTS: Record<keyof CmrFeatures, number> = {
  infiltration: 2,
  firstPassPerfusion: 2,
  pericardialEffusion: 1,
  sessile: 1,
  polylobated: 1,
  heterogeneousEnhancement: 1,
}

export const CMR_MAX = 8
export const CMR_CUTOFF = 5

export function calculateCmrScore(features: CmrFeatures): number {
  return Object.entries(features).reduce(
    (sum, [key, value]) => sum + (value ? CMR_WEIGHTS[key as keyof CmrFeatures] : 0),
    0,
  )
}
