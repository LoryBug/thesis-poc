import { describe, expect, it } from 'vitest'
import { evaluateConsensus } from '../src/consensus'
import { buildTraceability } from '../src/traceability'
import { calculateCmrScore, calculateCtSigns, calculateDemScore, evaluatePet } from '../src/scores'
import type { ImagingData, PetParameters } from '../src/types'
import { cmrAllAbsent, cmrAllPresent, cmrPartial } from './fixtures/cmr-features'
import { ctPartial } from './fixtures/ct-features'
import { echoAllAbsent, echoPartial } from './fixtures/echo-features'
import {
  imagingDataCtAndPet,
  imagingDataEchoAndCmr,
  imagingDataNoExams,
  imagingDataOnlyCmr,
  imagingDataOnlyCt,
  imagingDataOnlyEcho,
} from './fixtures/imaging-data'

interface GoldenCase {
  id: string
  data: ImagingData
  expected: {
    risk: 'low' | 'mid' | 'high' | 'not'
    title: string
    demScore?: number
    cmrScore?: number
    ctSigns?: number
    petPositive?: boolean
    activatedRules: string[]
    missingData?: string[]
    traceNodeIds?: string[]
  }
}

const unavailableEchoCmrCt: Pick<ImagingData, 'echoAvailable' | 'echo' | 'cmrAvailable' | 'cmr' | 'ctpetAvailable' | 'ct' | 'pet'> = {
  echoAvailable: false,
  echo: null,
  cmrAvailable: false,
  cmr: null,
  ctpetAvailable: false,
  ct: null,
  pet: null,
}

const goldenCases: GoldenCase[] = [
  {
    id: 'GC-00',
    data: imagingDataNoExams(),
    expected: {
      risk: 'not',
      title: 'Decision not evaluated',
      activatedRules: ['Decision not evaluated'],
      missingData: ['Echocardiography not entered', 'CMR not entered', 'Cardiac CT/PET not entered'],
    },
  },
  {
    id: 'GC-01',
    data: imagingDataOnlyEcho(echoAllAbsent()),
    expected: {
      risk: 'low',
      title: 'Low suspicion with available data',
      demScore: 0,
      activatedRules: ['Low suspicion with available data'],
      missingData: ['CMR not entered', 'Cardiac CT/PET not entered'],
      traceNodeIds: ['echo:score:dem', 'echo:cutoff:dem'],
    },
  },
  {
    id: 'GC-02',
    data: imagingDataOnlyEcho(echoPartial(['infiltration', 'polylobated'])),
    expected: {
      risk: 'mid',
      title: 'Significant echocardiographic suspicion',
      demScore: 4,
      activatedRules: ['DEM Score above cutoff', 'Significant echocardiographic suspicion'],
      missingData: ['CMR not entered', 'Cardiac CT/PET not entered'],
      traceNodeIds: ['echo:feature:infiltration', 'echo:feature:polylobated', 'echo:rule:dem-positive'],
    },
  },
  {
    id: 'GC-03',
    data: imagingDataEchoAndCmr(
      echoPartial(['infiltration', 'polylobated', 'pericardialEffusion']),
      cmrAllPresent(),
    ),
    expected: {
      risk: 'high',
      title: 'Concordant high-suspicion echo-CMR',
      demScore: 6,
      cmrScore: 8,
      activatedRules: ['DEM Score above cutoff', 'CMR Mass Score above cutoff', 'Concordant high-suspicion echo-CMR'],
      missingData: ['Cardiac CT/PET not entered'],
      traceNodeIds: ['echo:rule:dem-positive', 'cmr:rule:cmr-positive', 'integrated:rule:concordant-high-suspicion-echo-cmr'],
    },
  },
  {
    id: 'GC-04',
    data: imagingDataOnlyCmr(cmrPartial(['infiltration', 'firstPassPerfusion', 'heterogeneousEnhancement'])),
    expected: {
      risk: 'high',
      title: 'CMR-driven high suspicion',
      cmrScore: 5,
      activatedRules: ['CMR Mass Score above cutoff', 'CMR-driven high suspicion'],
      missingData: ['Echocardiography not entered', 'Cardiac CT/PET not entered'],
      traceNodeIds: ['cmr:feature:infiltration', 'cmr:feature:firstPassPerfusion', 'cmr:rule:cmr-positive'],
    },
  },
  {
    id: 'GC-05',
    data: imagingDataEchoAndCmr(echoPartial(['infiltration', 'polylobated']), cmrAllAbsent()),
    expected: {
      risk: 'mid',
      title: 'Echo-CMR discordance',
      demScore: 4,
      cmrScore: 0,
      activatedRules: ['DEM Score above cutoff', 'Echo-CMR discordance'],
      missingData: ['Cardiac CT/PET not entered'],
      traceNodeIds: ['echo:rule:dem-positive', 'integrated:rule:echo-cmr-discordance'],
    },
  },
  {
    id: 'GC-06',
    data: imagingDataOnlyCt(ctPartial(3)),
    expected: {
      risk: 'mid',
      title: 'Cardiac CT gray zone',
      ctSigns: 3,
      activatedRules: ['Cardiac CT gray zone'],
      missingData: ['Echocardiography not entered', 'CMR not entered', 'PET parameters not entered'],
      traceNodeIds: ['ct-pet:score:ct-signs', 'ct-pet:rule:gray-zone'],
    },
  },
  {
    id: 'GC-07',
    data: imagingDataCtAndPet(ctPartial(3), { suvMax: 6.2, mtv: null, tlg: null }),
    expected: {
      risk: 'high',
      title: 'CT/PET-driven high suspicion',
      ctSigns: 3,
      petPositive: true,
      activatedRules: ['CT/PET high-suspicion profile', 'CT/PET-driven high suspicion'],
      missingData: ['Echocardiography not entered', 'CMR not entered'],
      traceNodeIds: ['ct-pet:pet:suvMax', 'ct-pet:rule:high-suspicion'],
    },
  },
  {
    id: 'GC-08',
    data: imagingDataCtAndPet(ctPartial(1), { suvMax: 7, mtv: null, tlg: null }),
    expected: {
      risk: 'mid',
      title: 'Discordant CT/PET result',
      ctSigns: 1,
      petPositive: true,
      activatedRules: ['CT/PET discordance', 'Discordant CT/PET result'],
      missingData: ['Echocardiography not entered', 'CMR not entered'],
      traceNodeIds: ['ct-pet:pet:suvMax', 'ct-pet:rule:discordant'],
    },
  },
  {
    id: 'GC-09',
    data: {
      ...unavailableEchoCmrCt,
      cmrAvailable: true,
      cmr: cmrAllAbsent(),
      ctpetAvailable: true,
      ct: ctPartial(5),
    },
    expected: {
      risk: 'high',
      title: 'Discordance between advanced modalities',
      cmrScore: 0,
      ctSigns: 5,
      activatedRules: ['CT/PET high-suspicion profile', 'Discordance between advanced modalities'],
      missingData: ['Echocardiography not entered', 'PET parameters not entered'],
      traceNodeIds: ['cmr:score:cmr-mass-score', 'ct-pet:rule:high-suspicion', 'integrated:rule:discordance-between-advanced-modalities'],
    },
  },
]

describe('Synthetic golden cases', () => {
  it.each(goldenCases)('$id matches documented score, consensus and traceability expectations', ({ data, expected }) => {
    const result = evaluateConsensus(data)
    const traceability = buildTraceability(data, result)

    expect(result.risk).toBe(expected.risk)
    expect(result.title).toBe(expected.title)
    expect(traceability.title).toBe(expected.title)

    if (expected.demScore !== undefined) expect(calculateDemScore(data.echo!)).toBe(expected.demScore)
    if (expected.cmrScore !== undefined) expect(calculateCmrScore(data.cmr!)).toBe(expected.cmrScore)
    if (expected.ctSigns !== undefined) expect(calculateCtSigns(data.ct!)).toBe(expected.ctSigns)
    if (expected.petPositive !== undefined) expect(evaluatePet(data.pet as PetParameters)).toBe(expected.petPositive)

    expect(traceability.activatedRules).toEqual(expect.arrayContaining(expected.activatedRules))
    if (expected.missingData) expect(traceability.missingData).toEqual(expect.arrayContaining(expected.missingData))
    if (expected.traceNodeIds) {
      expect(traceability.nodes.map((node) => node.id)).toEqual(expect.arrayContaining(expected.traceNodeIds))
    }
  })
})
