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
  describe('nessun esame disponibile', () => {
    const result = evaluateConsensus(imagingDataNoExams())

    it('restituisce rischio not', () => {
      expect(result.risk).toBe('not')
    })

    it('contiene un next step che richiede input', () => {
      expect(result.nextStep).toContain('Completare')
    })
  })

  describe('sola eco positiva sopra cutoff', () => {
    const result = evaluateConsensus(imagingDataOnlyEcho(echoPartial(['infiltration', 'sessile', 'polylobated']))) // DEM = 5

    it('restituisce rischio mid', () => {
      expect(result.risk).toBe('mid')
    })

    it('next step suggerisce CMR', () => {
      expect(result.nextStep.toLowerCase()).toContain('cmr')
    })

    it('menziona DEM Score nelle evidenze', () => {
      expect(result.evidence.length).toBeGreaterThanOrEqual(1)
    })

    it('eco status indica positivo', () => {
      expect(result.modalities.echo.status).toContain('positivo')
    })

    it('CMR status indica non disponibile', () => {
      expect(result.modalities.cmr.status).toContain('Non disponibile')
    })
  })

  describe('sola eco negativa', () => {
    const result = evaluateConsensus(imagingDataOnlyEcho(echoAllAbsent()))

    it('restituisce rischio low', () => {
      expect(result.risk).toBe('low')
    })
  })

  describe('concordanza eco-CMR positiva', () => {
    const result = evaluateConsensus(imagingDataEchoAndCmr(
      echoPartial(['infiltration', 'polylobated', 'pericardialEffusion']), // DEM = 6
      cmrAllPresent(), // CMR = 8
    ))

    it('restituisce rischio high', () => {
      expect(result.risk).toBe('high')
    })

    it('next step menziona Heart Team', () => {
      expect(result.nextStep.toLowerCase()).toContain('heart')
    })

    it('CMR status indica positivo', () => {
      expect(result.modalities.cmr.status).toContain('positivo')
    })

    it('eco status indica positivo', () => {
      expect(result.modalities.echo.status).toContain('positivo')
    })

    it('testo della decisione menziona concordanza', () => {
      expect(result.title.toLowerCase()).toContain('concordanza')
    })
  })

  describe('sola CMR positiva (eco non disponibile)', () => {
    const result = evaluateConsensus(imagingDataOnlyCmr(cmrPartial(['infiltration', 'firstPassPerfusion', 'heterogeneousEnhancement']))) // CMR = 5

    it('restituisce rischio high', () => {
      expect(result.risk).toBe('high')
    })

    it('testo menziona CMR come esame dominante', () => {
      expect(result.title.toLowerCase()).toContain('guidato da cmr')
    })
  })

  describe('discordanza eco-CMR (eco positiva, CMR negativa)', () => {
    const result = evaluateConsensus(imagingDataEchoAndCmr(
      echoPartial(['infiltration', 'polylobated']), // DEM = 4
      cmrAllAbsent(), // CMR = 0
    ))

    it('restituisce rischio mid', () => {
      expect(result.risk).toBe('mid')
    })

    it('testo menziona discordanza eco-CMR', () => {
      expect(result.title.toLowerCase()).toContain('discordanza eco')
    })
  })

  describe('TC ad alto sospetto (>=5 segni)', () => {
    const result = evaluateConsensus(imagingDataOnlyCt(ctPartial(5)))

    it('restituisce rischio high', () => {
      expect(result.risk).toBe('high')
    })

    it('testo menziona TC come via diagnostica', () => {
      expect(result.title.toLowerCase()).toContain('tc/pet')
    })
  })

  describe('TC in zona grigia (3-4) con PET positiva', () => {
    const result = evaluateConsensus(imagingDataCtAndPet(
      ctPartial(3),
      { suvMax: 6.2, mtv: null, tlg: null },
    ))

    it('restituisce rischio high', () => {
      expect(result.risk).toBe('high')
    })

    it('TC/PET status indica zona grigia + PET positiva', () => {
      expect(result.modalities.ctPet.status).toContain('PET positiva')
    })
  })

  describe('TC in zona grigia (3-4) con PET negativa', () => {
    const result = evaluateConsensus(imagingDataCtAndPet(
      ctPartial(3),
      { suvMax: 2.1, mtv: 3.0, tlg: 10 },
    ))

    it('restituisce rischio low', () => {
      expect(result.risk).toBe('low')
    })

    it('TC/PET status indica PET negativa', () => {
      expect(result.modalities.ctPet.status).toContain('PET negativa')
    })
  })

  describe('TC in zona grigia senza PET disponibile', () => {
    const result = evaluateConsensus(imagingDataOnlyCt(ctPartial(3)))

    it('restituisce rischio mid', () => {
      expect(result.risk).toBe('mid')
    })

    it('next step suggerisce PET', () => {
      expect(result.nextStep.toLowerCase()).toContain('pet')
    })
  })

  describe('TC discordante (<=2 segni ma PET positiva)', () => {
    const result = evaluateConsensus(imagingDataCtAndPet(
      ctPartial(1),
      { suvMax: 7.0, mtv: null, tlg: null },
    ))

    it('restituisce rischio mid', () => {
      expect(result.risk).toBe('mid')
    })

    it('testo menziona discordanza', () => {
      expect(result.title.toLowerCase()).toContain('discordante')
    })
  })

  describe('tutti gli esami negativi', () => {
    const result = evaluateConsensus(imagingDataEchoAndCmr(echoAllAbsent(), cmrAllAbsent()))

    it('restituisce rischio low', () => {
      expect(result.risk).toBe('low')
    })
  })

  describe('esito integrato nel report', () => {
    const result = evaluateConsensus(imagingDataOnlyEcho(echoAllPresent()))

    it('contiene una descrizione testuale integrata', () => {
      expect(result.integrated).toBeDefined()
      expect(result.integrated.status.length).toBeGreaterThan(0)
    })
  })
})
