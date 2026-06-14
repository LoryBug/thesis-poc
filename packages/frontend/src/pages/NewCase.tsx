import { useEffect, useMemo } from 'react'
import {
  calculateCmrScore,
  calculateCtSigns,
  calculateDemScore,
  buildTraceability,
  evaluateConsensus,
  evaluatePet,
} from '@cm-dss/core'
import type { ImagingData } from '@cm-dss/core'
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
import { EvaluationToolsCard } from '../components/EvaluationToolsCard'

export function NewCase() {
  // Granular selectors — NewCase only rerenders when these specific fields change
  const echoAvailable = useCaseStore((s) => s.echoAvailable)
  const cmrAvailable = useCaseStore((s) => s.cmrAvailable)
  const ctpetAvailable = useCaseStore((s) => s.ctpetAvailable)
  const echo = useCaseStore((s) => s.echo)
  const cmr = useCaseStore((s) => s.cmr)
  const ct = useCaseStore((s) => s.ct)
  const pet = useCaseStore((s) => s.pet)
  const storeMetadata = useCaseStore((s) => s.metadata)
  const reset = useCaseStore((s) => s.reset)
  const addCase = useHistoryStore((s) => s.addCase)
  const navigate = useUiStore((s) => s.navigate)

  useEffect(() => { reset() }, [])

  // Memoized derived values — only recomputed when their inputs change
  const imagingData = useMemo((): ImagingData => ({
    echoAvailable,
    echo: echoAvailable ? echo : null,
    cmrAvailable,
    cmr: cmrAvailable ? cmr : null,
    ctpetAvailable,
    ct: ctpetAvailable ? ct : null,
    pet: ctpetAvailable ? pet : null,
  }), [echoAvailable, cmrAvailable, ctpetAvailable, echo, cmr, ct, pet])

  const result = useMemo(() => evaluateConsensus(imagingData), [imagingData])

  const hasAnyExam = echoAvailable || cmrAvailable || ctpetAvailable
  const demScore = useMemo(() => echoAvailable ? calculateDemScore(echo) : null, [echoAvailable, echo])
  const cmrScore = useMemo(() => cmrAvailable ? calculateCmrScore(cmr) : null, [cmrAvailable, cmr])
  const ctScore = useMemo(() => ctpetAvailable ? calculateCtSigns(ct) : null, [ctpetAvailable, ct])
  const petDataEntered = ctpetAvailable && Object.values(pet).some((v) => v !== null)
  const petPositive = useMemo(() => petDataEntered ? evaluatePet(pet) : null, [petDataEntered, pet])

  const traceability = useMemo(() => buildTraceability(imagingData, result), [imagingData, result])
  const report = useMemo(
    () => buildClinicalReport({ metadata: storeMetadata, result, demScore, cmrScore, ctScore, petPositive, traceability }),
    [storeMetadata, result, demScore, cmrScore, ctScore, petPositive, traceability],
  )

  function handleSave() {
    if (!hasAnyExam) return
    addCase({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      metadata: storeMetadata,
      imagingData,
      result,
    })
    navigate('home')
  }

  return (
    <div className="cm-page">
      <CaseHero result={result} demScore={demScore} cmrScore={cmrScore} ctScore={ctScore} />

      <section className="cm-layout">
        <div className="cm-stack">
          <EvaluationToolsCard />
          <div className="cm-workflow-ribbon" aria-label="Evaluation workflow">
            <span><b>1</b> Case metadata</span>
            <span><b>2</b> Imaging findings</span>
            <span><b>3</b> Review output</span>
          </div>
          <CaseMetadataCard />
          <EchoCard />
          <CmrCard />
          <CtPetCard />
          <TraceabilityPanel
            traceability={traceability}
            collapsible
            defaultOpen={false}
            title="Why this output?"
            subtitle="Clinical Traceability: feature -> score -> cutoff -> rule -> recommendation."
          />
        </div>

        <aside className="cm-sidebar">
          <ConsensusPanel result={result} />

          <article className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title">
                <h2>Archive Evaluation</h2>
                <p>The assessment updates in real time. Save only when you want to archive the case.</p>
              </div>
            </div>
            <div className="cm-actions">
              <button type="button" className="cm-button" onClick={handleSave} disabled={!hasAnyExam}>Save evaluation</button>
              <button type="button" className="cm-button secondary" onClick={() => navigate('home')}>Dashboard</button>
            </div>
          </article>

          <ReportCard report={report} caseId={storeMetadata.caseId} onReset={reset} />

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
