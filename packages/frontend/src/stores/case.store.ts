import { create } from 'zustand'
import type { EchoFeatures, CmrFeatures, CtFeatures, PetParameters, ImagingData } from '@cm-dss/core'
import type { CaseMetadata } from '../lib/storage'

const defaultEcho: EchoFeatures = {
  infiltration: false,
  polylobated: false,
  pericardialEffusion: false,
  sessile: false,
  inhomogeneity: false,
  nonLeftLocation: false,
}

const defaultCmr: CmrFeatures = {
  infiltration: false,
  firstPassPerfusion: false,
  pericardialEffusion: false,
  sessile: false,
  polylobated: false,
  heterogeneousEnhancement: false,
}

const defaultCt: CtFeatures = {
  irregularMargins: false,
  pericardialEffusion: false,
  invasion: false,
  solidNature: false,
  diameterOver30mm: false,
  contrastUptake: false,
  preContrastSuspicious: false,
  calcifications: false,
}

const defaultPet: PetParameters = { suvMax: null, mtv: null, tlg: null }

const defaultMetadata: CaseMetadata = {
  caseId: '',
  clinicalContext: 'Sospetta massa cardiaca',
  location: 'Non specificata',
  note: '',
}

interface CaseState {
  metadata: CaseMetadata
  echoAvailable: boolean
  cmrAvailable: boolean
  ctpetAvailable: boolean
  echo: EchoFeatures
  cmr: CmrFeatures
  ct: CtFeatures
  pet: PetParameters

  setEchoAvailable: (v: boolean) => void
  setCmrAvailable: (v: boolean) => void
  setCtpetAvailable: (v: boolean) => void
  setEchoFeature: (key: keyof EchoFeatures, value: boolean) => void
  setCmrFeature: (key: keyof CmrFeatures, value: boolean) => void
  setCtFeature: (key: keyof CtFeatures, value: boolean) => void
  setPetParam: (key: keyof PetParameters, value: number | null) => void
  setMetadataField: <K extends keyof CaseMetadata>(key: K, value: CaseMetadata[K]) => void
  loadFrom: (data: ImagingData) => void
  toImagingData: () => ImagingData
  toCaseMetadata: () => CaseMetadata
  reset: () => void
}

export const useCaseStore = create<CaseState>((set, get) => ({
  metadata: { ...defaultMetadata },
  echoAvailable: false,
  cmrAvailable: false,
  ctpetAvailable: false,
  echo: { ...defaultEcho },
  cmr: { ...defaultCmr },
  ct: { ...defaultCt },
  pet: { ...defaultPet },

  setEchoAvailable: (v) => set({ echoAvailable: v }),
  setCmrAvailable: (v) => set({ cmrAvailable: v }),
  setCtpetAvailable: (v) => set({ ctpetAvailable: v }),

  setEchoFeature: (key, value) =>
    set((s) => ({ echo: { ...s.echo, [key]: value } })),
  setCmrFeature: (key, value) =>
    set((s) => ({ cmr: { ...s.cmr, [key]: value } })),
  setCtFeature: (key, value) =>
    set((s) => ({ ct: { ...s.ct, [key]: value } })),
  setPetParam: (key, value) =>
    set((s) => ({ pet: { ...s.pet, [key]: value } })),
  setMetadataField: (key, value) =>
    set((s) => ({ metadata: { ...s.metadata, [key]: value } })),

  loadFrom: (data) =>
    set({
      echoAvailable: data.echoAvailable,
      cmrAvailable: data.cmrAvailable,
      ctpetAvailable: data.ctpetAvailable,
      echo: data.echo ?? { ...defaultEcho },
      cmr: data.cmr ?? { ...defaultCmr },
      ct: data.ct ?? { ...defaultCt },
      pet: data.pet ?? { ...defaultPet },
    }),

  toImagingData: () => {
    const s = get()
    return {
      echoAvailable: s.echoAvailable,
      echo: s.echoAvailable ? { ...s.echo } : null,
      cmrAvailable: s.cmrAvailable,
      cmr: s.cmrAvailable ? { ...s.cmr } : null,
      ctpetAvailable: s.ctpetAvailable,
      ct: s.ctpetAvailable ? { ...s.ct } : null,
      pet: s.ctpetAvailable ? { ...s.pet } : null,
    }
  },

  toCaseMetadata: () => ({ ...get().metadata }),

  reset: () =>
    set({
      metadata: { ...defaultMetadata },
      echoAvailable: false,
      cmrAvailable: false,
      ctpetAvailable: false,
      echo: { ...defaultEcho },
      cmr: { ...defaultCmr },
      ct: { ...defaultCt },
      pet: { ...defaultPet },
    }),
}))
