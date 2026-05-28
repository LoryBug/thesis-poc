import { describe, expect, it } from 'vitest'
import { buildTraceability } from '../../src/traceability'
import { evaluateConsensus } from '../../src/consensus'
import { cmrAllAbsent, cmrPartial } from '../fixtures/cmr-features'
import { ctPartial } from '../fixtures/ct-features'
import { echoPartial } from '../fixtures/echo-features'
import { imagingDataCtAndPet, imagingDataEchoAndCmr, imagingDataNoExams, imagingDataOnlyCmr, imagingDataOnlyEcho } from '../fixtures/imaging-data'

describe('buildTraceability', () => {
  it('traces a CMR-driven high suspicion decision to CMR features, cutoff and source', () => {
    const data = imagingDataOnlyCmr(cmrPartial(['infiltration', 'firstPassPerfusion', 'heterogeneousEnhancement']))
    const trace = buildTraceability(data, evaluateConsensus(data))

    expect(trace.title).toBe('CMR-driven high suspicion')
    expect(trace.activatedRules).toContain('CMR Mass Score above cutoff')
    expect(trace.sources.map((source) => source.id)).toContain('paolisso_2024_cmr_mass_score')
    expect(trace.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'cmr:feature:infiltration', kind: 'feature' }),
      expect.objectContaining({ id: 'cmr:feature:firstPassPerfusion', kind: 'feature' }),
      expect.objectContaining({ id: 'cmr:score:cmr-mass-score', label: 'CMR Mass Score 5/8' }),
      expect.objectContaining({ id: 'cmr:cutoff:cmr-mass-score' }),
    ]))
    expect(trace.edges).toContainEqual({ from: 'cmr:cutoff:cmr-mass-score', to: 'cmr:rule:cmr-positive', relation: 'triggers' })
  })

  it('traces echo-only suspicion and records missing CMR and CT/PET data', () => {
    const data = imagingDataOnlyEcho(echoPartial(['infiltration', 'polylobated']))
    const trace = buildTraceability(data, evaluateConsensus(data))

    expect(trace.title).toBe('Significant echocardiographic suspicion')
    expect(trace.activatedRules).toContain('DEM Score above cutoff')
    expect(trace.missingData).toEqual(expect.arrayContaining(['CMR not entered', 'Cardiac CT/PET not entered']))
    expect(trace.sources.map((source) => source.id)).toContain('paolisso_2022_dem_score')
    expect(trace.nodes).toContainEqual(expect.objectContaining({ id: 'echo:score:dem', label: 'DEM Score 4/9' }))
  })

  it('traces echo-CMR discordance as an integrated rule', () => {
    const data = imagingDataEchoAndCmr(
      echoPartial(['infiltration', 'polylobated']),
      cmrAllAbsent(),
    )
    const trace = buildTraceability(data, evaluateConsensus(data))

    expect(trace.title).toBe('Echo-CMR discordance')
    expect(trace.activatedRules).toContain('Echo-CMR discordance')
    expect(trace.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'echo:rule:dem-positive' }),
      expect.objectContaining({ id: 'integrated:rule:echo-cmr-discordance' }),
    ]))
    expect(trace.nodes.some((node) => node.label.includes('DEM positive but CMR Mass Score below cutoff'))).toBe(true)
  })

  it('traces CT/PET high suspicion through CT signs and PET parameters', () => {
    const data = imagingDataCtAndPet(ctPartial(3), { suvMax: 7.5, mtv: null, tlg: null })
    const trace = buildTraceability(data, evaluateConsensus(data))

    expect(trace.title).toBe('CT/PET-driven high suspicion')
    expect(trace.activatedRules).toContain('CT/PET high-suspicion profile')
    expect(trace.sources.map((source) => source.id)).toContain('dangelo_2020_ct_pet')
    expect(trace.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'ct-pet:score:ct-signs', label: 'Cardiac CT signs 3/8' }),
      expect.objectContaining({ id: 'ct-pet:pet:suvMax', label: 'SUVmax 7.5' }),
      expect.objectContaining({ id: 'ct-pet:rule:high-suspicion' }),
    ]))
  })

  it('records absence of all modalities when no examination is available', () => {
    const data = imagingDataNoExams()
    const trace = buildTraceability(data, evaluateConsensus(data))

    expect(trace.title).toBe('Decision not evaluated')
    expect(trace.missingData).toEqual(expect.arrayContaining(['Echocardiography not entered', 'CMR not entered', 'Cardiac CT/PET not entered']))
  })
})
