import type { CtFeatures } from '../../src/types'

export function ctAllAbsent(): CtFeatures {
  return {
    irregularMargins: false,
    pericardialEffusion: false,
    invasion: false,
    solidNature: false,
    diameterOver30mm: false,
    contrastUptake: false,
    preContrastSuspicious: false,
    calcifications: false,
  }
}

export function ctAllPresent(): CtFeatures {
  return {
    irregularMargins: true,
    pericardialEffusion: true,
    invasion: true,
    solidNature: true,
    diameterOver30mm: true,
    contrastUptake: true,
    preContrastSuspicious: true,
    calcifications: true,
  }
}

export function ctPartial(count: number): CtFeatures {
  const keys = Object.keys(ctAllPresent()) as (keyof CtFeatures)[]
  const base = ctAllAbsent()
  for (let i = 0; i < Math.min(count, keys.length); i++) {
    base[keys[i]] = true
  }
  return base
}
