import { describe, it, expect, beforeEach } from 'vitest'
import { useCaseStore } from './case.store'

describe('case.store', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('starts with echo unavailable', () => {
    const s = useCaseStore.getState()
    expect(s.echoAvailable).toBe(false)
  })

  it('starts with CMR unavailable', () => {
    const s = useCaseStore.getState()
    expect(s.cmrAvailable).toBe(false)
  })

  it('starts with CT/PET unavailable', () => {
    const s = useCaseStore.getState()
    expect(s.ctpetAvailable).toBe(false)
  })

  it('starts with default clinical metadata', () => {
    const s = useCaseStore.getState()
    expect(s.metadata.caseId).toBe('')
    expect(s.metadata.clinicalContext).toBe('Suspected cardiac mass')
    expect(s.metadata.location).toBe('Unspecified')
  })

  it('toImagingData returns echo null when echo is unavailable', () => {
    useCaseStore.getState().setEchoAvailable(false)
    const data = useCaseStore.getState().toImagingData()
    expect(data.echoAvailable).toBe(false)
    expect(data.echo).toBeNull()
  })

  it('toImagingData returns echo features when echo is available', () => {
    const store = useCaseStore.getState()
    store.setEchoAvailable(true)
    store.setEchoFeature('infiltration', true)
    store.setEchoFeature('polylobated', true)
    const data = useCaseStore.getState().toImagingData()
    expect(data.echoAvailable).toBe(true)
    expect(data.echo).not.toBeNull()
    expect(data.echo!.infiltration).toBe(true)
    expect(data.echo!.polylobated).toBe(true)
    expect(data.echo!.sessile).toBe(false)
  })

  it('toImagingData always returns PET as an object when CT/PET is available', () => {
    const store = useCaseStore.getState()
    store.setCtpetAvailable(true)
    const data = useCaseStore.getState().toImagingData()
    expect(data.pet).not.toBeNull()
    expect(data.pet!.suvMax).toBeNull()
    expect(data.pet!.mtv).toBeNull()
    expect(data.pet!.tlg).toBeNull()
  })

  it('setEchoFeature updates only the specified feature', () => {
    useCaseStore.getState().setEchoAvailable(true)
    useCaseStore.getState().setEchoFeature('infiltration', true)
    const echo = useCaseStore.getState().echo
    expect(echo.infiltration).toBe(true)
    expect(echo.polylobated).toBe(false)
    expect(echo.sessile).toBe(false)
  })

  it('reset restores initial state', () => {
    const store = useCaseStore.getState()
    store.setMetadataField('caseId', 'CM-001')
    store.setEchoAvailable(true)
    store.setEchoFeature('infiltration', true)
    store.setCmrAvailable(true)
    store.setCtpetAvailable(true)
    store.setPetParam('suvMax', 5.0)
    store.reset()

    const s = useCaseStore.getState()
    expect(s.echoAvailable).toBe(false)
    expect(s.cmrAvailable).toBe(false)
    expect(s.ctpetAvailable).toBe(false)
    expect(s.metadata.caseId).toBe('')
    expect(s.echo.infiltration).toBe(false)
    expect(s.pet.suvMax).toBeNull()
  })

  it('toCaseMetadata returns a metadata copy', () => {
    const store = useCaseStore.getState()
    store.setMetadataField('caseId', 'CM-001')
    store.setMetadataField('note', 'right atrial mass')
    const metadata = store.toCaseMetadata()

    expect(metadata.caseId).toBe('CM-001')
    expect(metadata.note).toBe('right atrial mass')
    expect(metadata).not.toBe(useCaseStore.getState().metadata)
  })

  it('setPetParam updates the correct parameter', () => {
    useCaseStore.getState().setPetParam('suvMax', 7.2)
    expect(useCaseStore.getState().pet.suvMax).toBe(7.2)
    expect(useCaseStore.getState().pet.mtv).toBeNull()
  })

  it('setPetParam accepts 0 as a valid value', () => {
    useCaseStore.getState().setPetParam('suvMax', 0)
    expect(useCaseStore.getState().pet.suvMax).toBe(0)
  })

  it('loadFrom loads existing imaging data', () => {
    const data = {
      echoAvailable: true,
      echo: { infiltration: true, polylobated: false, pericardialEffusion: true, sessile: false, inhomogeneity: false, nonLeftLocation: false },
      cmrAvailable: false,
      cmr: null,
      ctpetAvailable: true,
      ct: { irregularMargins: true, pericardialEffusion: false, invasion: false, solidNature: true, diameterOver30mm: false, contrastUptake: false, preContrastSuspicious: false, calcifications: false },
      pet: { suvMax: 6.1, mtv: null, tlg: null },
    }

    useCaseStore.getState().loadFrom(data)

    const s = useCaseStore.getState()
    expect(s.echoAvailable).toBe(true)
    expect(s.echo.infiltration).toBe(true)
    expect(s.cmrAvailable).toBe(false)
    expect(s.ctpetAvailable).toBe(true)
    expect(s.ct.irregularMargins).toBe(true)
    expect(s.ct.solidNature).toBe(true)
    expect(s.pet.suvMax).toBe(6.1)
  })

  it('loadFrom can load case metadata with imaging data', () => {
    useCaseStore.getState().loadFrom({
      echoAvailable: true,
      echo: { infiltration: true, polylobated: false, pericardialEffusion: false, sessile: false, inhomogeneity: false, nonLeftLocation: false },
      cmrAvailable: false,
      cmr: null,
      ctpetAvailable: false,
      ct: null,
      pet: null,
    }, {
      caseId: 'GC-02',
      clinicalContext: 'Suspected cardiac mass',
      location: 'Unspecified',
      note: 'Echo-positive only',
    })

    const s = useCaseStore.getState()
    expect(s.metadata.caseId).toBe('GC-02')
    expect(s.metadata.note).toBe('Echo-positive only')
    expect(s.echoAvailable).toBe(true)
    expect(s.echo.infiltration).toBe(true)
  })
})
