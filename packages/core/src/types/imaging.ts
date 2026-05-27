export interface EchoFeatures {
  infiltration: boolean
  polylobated: boolean
  pericardialEffusion: boolean
  sessile: boolean
  inhomogeneity: boolean
  nonLeftLocation: boolean
}

export interface CmrFeatures {
  infiltration: boolean
  firstPassPerfusion: boolean
  pericardialEffusion: boolean
  sessile: boolean
  polylobated: boolean
  heterogeneousEnhancement: boolean
}

export interface CtFeatures {
  irregularMargins: boolean
  pericardialEffusion: boolean
  invasion: boolean
  solidNature: boolean
  diameterOver30mm: boolean
  contrastUptake: boolean
  preContrastSuspicious: boolean
  calcifications: boolean
}

export interface PetParameters {
  suvMax: number | null
  mtv: number | null
  tlg: number | null
}

export interface ImagingData {
  echoAvailable: boolean
  echo: EchoFeatures | null
  cmrAvailable: boolean
  cmr: CmrFeatures | null
  ctpetAvailable: boolean
  ct: CtFeatures | null
  pet: PetParameters | null
}

export type RiskLevel = 'low' | 'mid' | 'high' | 'not'
