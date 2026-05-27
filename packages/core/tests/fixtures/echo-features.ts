import type { EchoFeatures } from '../../src/types'

export function echoAllAbsent(): EchoFeatures {
  return {
    infiltration: false,
    polylobated: false,
    pericardialEffusion: false,
    sessile: false,
    inhomogeneity: false,
    nonLeftLocation: false,
  }
}

export function echoAllPresent(): EchoFeatures {
  return {
    infiltration: true,
    polylobated: true,
    pericardialEffusion: true,
    sessile: true,
    inhomogeneity: true,
    nonLeftLocation: true,
  }
}

export function echoPartial(keys: (keyof EchoFeatures)[]): EchoFeatures {
  const base = echoAllAbsent()
  for (const key of keys) {
    base[key] = true
  }
  return base
}
