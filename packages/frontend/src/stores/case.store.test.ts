import { describe, it, expect, beforeEach } from 'vitest'
import { useCaseStore } from './case.store'

describe('case.store', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('inizia con echo non disponibile', () => {
    const s = useCaseStore.getState()
    expect(s.echoAvailable).toBe(false)
  })

  it('inizia con cmr non disponibile', () => {
    const s = useCaseStore.getState()
    expect(s.cmrAvailable).toBe(false)
  })

  it('inizia con ctpet non disponibile', () => {
    const s = useCaseStore.getState()
    expect(s.ctpetAvailable).toBe(false)
  })

  it('toImagingData restituisce echo null quando echo non disponibile', () => {
    useCaseStore.getState().setEchoAvailable(false)
    const data = useCaseStore.getState().toImagingData()
    expect(data.echoAvailable).toBe(false)
    expect(data.echo).toBeNull()
  })

  it('toImagingData restituisce echo con features quando echo disponibile', () => {
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

  it('toImagingData restituisce pet sempre come oggetto (mai null) quando ctpet disponibile', () => {
    const store = useCaseStore.getState()
    store.setCtpetAvailable(true)
    const data = useCaseStore.getState().toImagingData()
    expect(data.pet).not.toBeNull()
    expect(data.pet!.suvMax).toBeNull()
    expect(data.pet!.mtv).toBeNull()
    expect(data.pet!.tlg).toBeNull()
  })

  it('setEchoFeature aggiorna solo la feature specificata', () => {
    useCaseStore.getState().setEchoAvailable(true)
    useCaseStore.getState().setEchoFeature('infiltration', true)
    const echo = useCaseStore.getState().echo
    expect(echo.infiltration).toBe(true)
    expect(echo.polylobated).toBe(false)
    expect(echo.sessile).toBe(false)
  })

  it('reset riporta allo stato iniziale', () => {
    const store = useCaseStore.getState()
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
    expect(s.echo.infiltration).toBe(false)
    expect(s.pet.suvMax).toBeNull()
  })

  it('setPetParam aggiorna il parametro corretto', () => {
    useCaseStore.getState().setPetParam('suvMax', 7.2)
    expect(useCaseStore.getState().pet.suvMax).toBe(7.2)
    expect(useCaseStore.getState().pet.mtv).toBeNull()
  })

  it('setPetParam accetta 0 come valore valido', () => {
    useCaseStore.getState().setPetParam('suvMax', 0)
    expect(useCaseStore.getState().pet.suvMax).toBe(0)
  })

  it('loadFrom carica dati imaging esistenti', () => {
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
})
