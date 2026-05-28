import { useEffect } from 'react'
import {
  calculateCmrScore,
  calculateCtSigns,
  calculateDemScore,
  evaluateConsensus,
  evaluatePet,
} from '@cm-dss/core'
import { buildClinicalReport } from '../lib/report'
import { useCaseStore } from '../stores/case.store'
import { useHistoryStore } from '../stores/history.store'
import { useUiStore } from '../stores/ui.store'
import { EchoCard } from '../components/EchoCard'
import { CmrCard } from '../components/CmrCard'
import { CtPetCard } from '../components/CtPetCard'
import { ConsensusPanel } from '../components/ConsensusPanel'
import { CaseHero } from '../components/CaseHero'
import { CaseMetadataCard } from '../components/CaseMetadataCard'
import { ReportCard } from '../components/ReportCard'

export function NewCase() {
  const store = useCaseStore()
  const addCase = useHistoryStore((s) => s.addCase)
  const navigate = useUiStore((s) => s.navigate)

  useEffect(() => {
    store.reset()
  }, [])

  const imagingData = store.toImagingData()
  const result = evaluateConsensus(imagingData)
  const hasAnyExam = store.echoAvailable || store.cmrAvailable || store.ctpetAvailable
  const demScore = store.echoAvailable ? calculateDemScore(store.echo) : null
  const cmrScore = store.cmrAvailable ? calculateCmrScore(store.cmr) : null
  const ctScore = store.ctpetAvailable ? calculateCtSigns(store.ct) : null
  const petDataEntered = store.ctpetAvailable && Object.values(store.pet).some((value) => value !== null)
  const petPositive = petDataEntered ? evaluatePet(store.pet) : null
  const metadata = store.toCaseMetadata()
  const report = buildClinicalReport({ metadata, result, demScore, cmrScore, ctScore, petPositive })

  function handleSave() {
    if (!hasAnyExam) return
    addCase({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      metadata,
      imagingData,
      result,
    })
    navigate('home')
  }

  function handleReset() {
    store.reset()
  }

  return (
    <div className="cm-page">
      <CaseHero result={result} demScore={demScore} cmrScore={cmrScore} ctScore={ctScore} />

      <section className="cm-layout">
        <div className="cm-stack">
          <CaseMetadataCard />
          <EchoCard />
          <CmrCard />
          <CtPetCard />
        </div>

        <aside className="cm-sidebar">
          <ConsensusPanel result={result} />

          <article className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title">
                <h2>Azioni</h2>
                <p>La valutazione è aggiornata in tempo reale. Salva solo quando vuoi archiviare il caso.</p>
              </div>
            </div>
            <div className="cm-actions">
              <button type="button" className="cm-button" onClick={handleSave} disabled={!hasAnyExam}>Salva valutazione</button>
              <button type="button" className="cm-button secondary" onClick={() => navigate('home')}>Dashboard</button>
            </div>
          </article>

          <ReportCard report={report} onReset={handleReset} />

          <article className="cm-card cm-disclaimer">
            <strong>Nota POC</strong><br />
            Questo prototipo è solo dimostrativo e non sostituisce giudizio clinico, referto specialistico, Heart Team o linee guida. Le soglie sono derivate dagli articoli forniti.
          </article>
        </aside>
      </section>

      <p className="cm-footer-note">Prototype React/TypeScript - Masse cardiache, score diagnostici e supporto decisionale.</p>
    </div>
  )
}
