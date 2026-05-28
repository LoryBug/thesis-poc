import { describe, it, expect } from 'vitest'
import { evaluateConsensus } from '../../src/consensus/engine'
import { echoAllAbsent, echoAllPresent, echoPartial } from '../fixtures/echo-features'
import { cmrAllAbsent, cmrAllPresent, cmrPartial } from '../fixtures/cmr-features'
import { ctAllAbsent, ctAllPresent, ctPartial } from '../fixtures/ct-features'
import {
  imagingDataNoExams,
  imagingDataOnlyEcho,
  imagingDataEchoAndCmr,
  imagingDataOnlyCmr,
  imagingDataCtAndPet,
  imagingDataOnlyCt,
} from '../fixtures/imaging-data'

describe('Consensus Engine', () => {
  describe('no examination available', () => {
    const result = evaluateConsensus(imagingDataNoExams())

    it('returns not risk', () => {
      expect(result.risk).toBe('not')
    })

    it('contains a next step that requests input', () => {
      expect(result.nextStep).toContain('Complete')
    })
  })

  describe('echo only positive above cutoff', () => {
    const result = evaluateConsensus(imagingDataOnlyEcho(echoPartial(['infiltration', 'sessile', 'polylobated']))) // DEM = 5

    it('returns mid risk', () => {
      expect(result.risk).toBe('mid')
    })

    it('next step suggests CMR', () => {
      expect(result.nextStep.toLowerCase()).toContain('cmr')
    })

    it('mentions DEM Score in evidence', () => {
      expect(result.evidence.length).toBeGreaterThanOrEqual(1)
    })

    it('echo status indicates positive', () => {
      expect(result.modalities.echo.status).toContain('positive')
    })

    it('CMR status indicates unavailable', () => {
      expect(result.modalities.cmr.status).toContain('Unavailable')
    })
  })

  describe('echo only negative', () => {
    const result = evaluateConsensus(imagingDataOnlyEcho(echoAllAbsent()))

    it('returns low risk', () => {
      expect(result.risk).toBe('low')
    })
  })

  describe('positive echo-CMR concordance', () => {
    const result = evaluateConsensus(imagingDataEchoAndCmr(
      echoPartial(['infiltration', 'polylobated', 'pericardialEffusion']), // DEM = 6
      cmrAllPresent(), // CMR = 8
    ))

    it('returns high risk', () => {
      expect(result.risk).toBe('high')
    })

    it('next step mentions Heart Team', () => {
      expect(result.nextStep.toLowerCase()).toContain('heart')
    })

    it('CMR status indicates positive', () => {
      expect(result.modalities.cmr.status).toContain('positive')
    })

    it('echo status indicates positive', () => {
      expect(result.modalities.echo.status).toContain('positive')
    })

    it('decision text mentions concordance', () => {
      expect(result.title.toLowerCase()).toContain('concordant')
    })
  })

  describe('CMR only positive (echo unavailable)', () => {
    const result = evaluateConsensus(imagingDataOnlyCmr(cmrPartial(['infiltration', 'firstPassPerfusion', 'heterogeneousEnhancement']))) // CMR = 5

    it('returns high risk', () => {
      expect(result.risk).toBe('high')
    })

    it('text mentions CMR-driven result', () => {
      expect(result.title.toLowerCase()).toContain('cmr-driven')
    })
  })

  describe('echo-CMR discordance (echo positive, CMR negative)', () => {
    const result = evaluateConsensus(imagingDataEchoAndCmr(
      echoPartial(['infiltration', 'polylobated']), // DEM = 4
      cmrAllAbsent(), // CMR = 0
    ))

    it('returns mid risk', () => {
      expect(result.risk).toBe('mid')
    })

    it('text mentions echo-CMR discordance', () => {
      expect(result.title.toLowerCase()).toContain('echo-cmr discordance')
    })
  })

  describe('high-suspicion CT (>=5 signs)', () => {
    const result = evaluateConsensus(imagingDataOnlyCt(ctPartial(5)))

    it('returns high risk', () => {
      expect(result.risk).toBe('high')
    })

    it('text mentions CT/PET as diagnostic pathway', () => {
      expect(result.title.toLowerCase()).toContain('ct/pet')
    })
  })

  describe('CT gray zone (3-4) with positive PET', () => {
    const result = evaluateConsensus(imagingDataCtAndPet(
      ctPartial(3),
      { suvMax: 6.2, mtv: null, tlg: null },
    ))

    it('returns high risk', () => {
      expect(result.risk).toBe('high')
    })

    it('CT/PET status indicates gray zone + positive PET', () => {
      expect(result.modalities.ctPet.status).toContain('PET positive')
    })
  })

  describe('CT gray zone (3-4) with negative PET', () => {
    const result = evaluateConsensus(imagingDataCtAndPet(
      ctPartial(3),
      { suvMax: 2.1, mtv: 3.0, tlg: 10 },
    ))

    it('returns low risk', () => {
      expect(result.risk).toBe('low')
    })

    it('CT/PET status indicates negative PET', () => {
      expect(result.modalities.ctPet.status).toContain('PET negative')
    })
  })

  describe('CT gray zone without PET available', () => {
    const result = evaluateConsensus(imagingDataOnlyCt(ctPartial(3)))

    it('returns mid risk', () => {
      expect(result.risk).toBe('mid')
    })

    it('next step suggests PET', () => {
      expect(result.nextStep.toLowerCase()).toContain('pet')
    })
  })

  describe('discordant CT (<=2 signs but positive PET)', () => {
    const result = evaluateConsensus(imagingDataCtAndPet(
      ctPartial(1),
      { suvMax: 7.0, mtv: null, tlg: null },
    ))

    it('returns mid risk', () => {
      expect(result.risk).toBe('mid')
    })

    it('text mentions discordance', () => {
      expect(result.title.toLowerCase()).toContain('discordant')
    })
  })

  describe('all examinations negative', () => {
    const result = evaluateConsensus(imagingDataEchoAndCmr(echoAllAbsent(), cmrAllAbsent()))

    it('returns low risk', () => {
      expect(result.risk).toBe('low')
    })
  })

  describe('integrated result in report', () => {
    const result = evaluateConsensus(imagingDataOnlyEcho(echoAllPresent()))

    it('contains an integrated text description', () => {
      expect(result.integrated).toBeDefined()
      expect(result.integrated.status.length).toBeGreaterThan(0)
    })
  })
})
