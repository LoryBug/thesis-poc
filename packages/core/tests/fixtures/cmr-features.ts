import type { CmrFeatures } from '../../src/types'

export function cmrAllAbsent(): CmrFeatures {
  return {
    infiltration: false,
    firstPassPerfusion: false,
    pericardialEffusion: false,
    sessile: false,
    polylobated: false,
    heterogeneousEnhancement: false,
  }
}

export function cmrAllPresent(): CmrFeatures {
  return {
    infiltration: true,
    firstPassPerfusion: true,
    pericardialEffusion: true,
    sessile: true,
    polylobated: true,
    heterogeneousEnhancement: true,
  }
}

export function cmrPartial(keys: (keyof CmrFeatures)[]): CmrFeatures {
  const base = cmrAllAbsent()
  for (const key of keys) {
    base[key] = true
  }
  return base
}
