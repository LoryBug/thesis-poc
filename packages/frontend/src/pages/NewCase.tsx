import { useEffect } from 'react'
import {
  calculateCmrScore,
  calculateCtSigns,
  calculateDemScore,
  buildTraceability,
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
import { TraceabilityPanel } from '../components/TraceabilityPanel'
import { SyntheticCaseLoader } from '../components/SyntheticCaseLoader'

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
  const traceability = buildTraceability(imagingData, result)
  const report = buildClinicalReport({ metadata, result, demScore, cmrScore, ctScore, petPositive, traceability })

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
          <TraceabilityPanel traceability={traceability} />
          <SyntheticCaseLoader />

          <article className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title">
                <h2>Actions</h2>
                <p>The assessment updates in real time. Save only when you want to archive the case.</p>
              </div>
            </div>
            <div className="cm-actions">
              <button type="button" className="cm-button" onClick={handleSave} disabled={!hasAnyExam}>Save evaluation</button>
              <button type="button" className="cm-button secondary" onClick={() => navigate('home')}>Dashboard</button>
            </div>
          </article>

          <ReportCard report={report} onReset={handleReset} />

          <article className="cm-card cm-disclaimer">
            <strong>POC note</strong><br />
            This prototype is demonstrative only and does not replace clinical judgment, specialist reporting, Heart Team discussion, or guidelines. Thresholds are derived from the supplied papers.
          </article>
        </aside>
      </section>

      <p className="cm-footer-note">React/TypeScript prototype - cardiac masses, diagnostic scores, and decision support.</p>
    </div>
  )
}
