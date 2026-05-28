import type { CmrFeatures, CtFeatures, EchoFeatures, ImagingData, PetParameters } from '@cm-dss/core'
import type { CaseMetadata } from './storage'

export interface SyntheticCase {
  id: string
  title: string
  description: string
  metadata: CaseMetadata
  imagingData: ImagingData
}

const echoKeys: (keyof EchoFeatures)[] = [
  'infiltration',
  'polylobated',
  'pericardialEffusion',
  'sessile',
  'inhomogeneity',
  'nonLeftLocation',
]

const cmrKeys: (keyof CmrFeatures)[] = [
  'infiltration',
  'firstPassPerfusion',
  'pericardialEffusion',
  'sessile',
  'polylobated',
  'heterogeneousEnhancement',
]

const ctKeys: (keyof CtFeatures)[] = [
  'irregularMargins',
  'pericardialEffusion',
  'invasion',
  'solidNature',
  'diameterOver30mm',
  'contrastUptake',
  'preContrastSuspicious',
  'calcifications',
]

function booleanRecord<T extends string>(keys: readonly T[], enabled: readonly T[]) {
  return Object.fromEntries(keys.map((key) => [key, enabled.includes(key)])) as Record<T, boolean>
}

function echo(features: (keyof EchoFeatures)[] = []): EchoFeatures {
  return booleanRecord(echoKeys, features)
}

function cmr(features: (keyof CmrFeatures)[] = []): CmrFeatures {
  return booleanRecord(cmrKeys, features)
}

function ct(count: number): CtFeatures {
  return booleanRecord(ctKeys, ctKeys.slice(0, count))
}

function metadata(id: string, title: string, location = 'Unspecified'): CaseMetadata {
  return {
    caseId: id,
    clinicalContext: 'Suspected cardiac mass',
    location,
    note: title,
  }
}

function noExams(): ImagingData {
  return {
    echoAvailable: false,
    echo: null,
    cmrAvailable: false,
    cmr: null,
    ctpetAvailable: false,
    ct: null,
    pet: null,
  }
}

function onlyEcho(features: (keyof EchoFeatures)[]): ImagingData {
  return { ...noExams(), echoAvailable: true, echo: echo(features) }
}

function echoAndCmr(echoFeatures: (keyof EchoFeatures)[], cmrFeatures: (keyof CmrFeatures)[]): ImagingData {
  return { ...noExams(), echoAvailable: true, echo: echo(echoFeatures), cmrAvailable: true, cmr: cmr(cmrFeatures) }
}

function onlyCmr(features: (keyof CmrFeatures)[]): ImagingData {
  return { ...noExams(), cmrAvailable: true, cmr: cmr(features) }
}

function onlyCt(count: number, pet: PetParameters | null = null): ImagingData {
  return { ...noExams(), ctpetAvailable: true, ct: ct(count), pet }
}

function cmrAndCt(cmrFeatures: (keyof CmrFeatures)[], ctCount: number): ImagingData {
  return { ...noExams(), cmrAvailable: true, cmr: cmr(cmrFeatures), ctpetAvailable: true, ct: ct(ctCount), pet: null }
}

export const syntheticCases: SyntheticCase[] = [
  {
    id: 'GC-00',
    title: 'No examination available',
    description: 'Empty-state case for safe handling of absent imaging data.',
    metadata: metadata('GC-00', 'No examination available'),
    imagingData: noExams(),
  },
  {
    id: 'GC-01',
    title: 'Echocardiography low suspicion',
    description: 'Echo available with all DEM features absent.',
    metadata: metadata('GC-01', 'Echocardiography low suspicion'),
    imagingData: onlyEcho([]),
  },
  {
    id: 'GC-02',
    title: 'Echo-positive only',
    description: 'DEM positive with CMR and CT/PET unavailable.',
    metadata: metadata('GC-02', 'Echo-positive only'),
    imagingData: onlyEcho(['infiltration', 'polylobated']),
  },
  {
    id: 'GC-03',
    title: 'Concordant high-suspicion echo-CMR',
    description: 'DEM and CMR Mass Score are both above cutoff.',
    metadata: metadata('GC-03', 'Concordant high-suspicion echo-CMR'),
    imagingData: echoAndCmr(['infiltration', 'polylobated', 'pericardialEffusion'], [...cmrKeys]),
  },
  {
    id: 'GC-04',
    title: 'CMR-driven high suspicion',
    description: 'CMR reaches cutoff with echo unavailable.',
    metadata: metadata('GC-04', 'CMR-driven high suspicion'),
    imagingData: onlyCmr(['infiltration', 'firstPassPerfusion', 'heterogeneousEnhancement']),
  },
  {
    id: 'GC-05',
    title: 'Echo-CMR discordance',
    description: 'DEM positive but CMR Mass Score below cutoff.',
    metadata: metadata('GC-05', 'Echo-CMR discordance'),
    imagingData: echoAndCmr(['infiltration', 'polylobated'], []),
  },
  {
    id: 'GC-06',
    title: 'CT gray zone without PET',
    description: 'Cardiac CT has 3 signs and PET parameters are unavailable.',
    metadata: metadata('GC-06', 'CT gray zone without PET'),
    imagingData: onlyCt(3),
  },
  {
    id: 'GC-07',
    title: 'CT gray zone with positive PET',
    description: 'Cardiac CT has 3 signs and SUVmax is above cutoff.',
    metadata: metadata('GC-07', 'CT gray zone with positive PET'),
    imagingData: onlyCt(3, { suvMax: 6.2, mtv: null, tlg: null }),
  },
  {
    id: 'GC-08',
    title: 'CT/PET discordance',
    description: 'PET positive with only one CT sign.',
    metadata: metadata('GC-08', 'CT/PET discordance'),
    imagingData: onlyCt(1, { suvMax: 7, mtv: null, tlg: null }),
  },
  {
    id: 'GC-09',
    title: 'CMR negative but CT/PET high suspicion',
    description: 'CMR below cutoff but cardiac CT reaches high-suspicion threshold.',
    metadata: metadata('GC-09', 'CMR negative but CT/PET high suspicion'),
    imagingData: cmrAndCt([], 5),
  },
]
