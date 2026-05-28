import { useMemo } from 'react'
import { calculateCmrScore, calculateCtSigns, calculateDemScore, evaluatePet } from '@cm-dss/core'
import { useHistoryStore } from '../stores/history.store'
import { useUiStore } from '../stores/ui.store'
import { buildClinicalReport } from '../lib/report'
import { ConsensusPanel } from '../components/ConsensusPanel'
import { ReportCard } from '../components/ReportCard'

export function CaseDetail() {
  const caseId = useUiStore((s) => s.selectedCaseId)
  const navigate = useUiStore((s) => s.navigate)
  const cases = useHistoryStore((s) => s.cases)

  const savedCase = useMemo(
    () => cases.find((c) => c.id === caseId),
    [caseId, cases],
  )

  if (!savedCase) {
    return (
      <div className="cm-page">
        <div className="cm-card" style={{ textAlign: 'center', padding: '48px 22px' }}>
          <p style={{ color: 'var(--cm-muted)' }}>Caso non trovato.</p>
          <button type="button" className="cm-button mt-4" onClick={() => navigate('home')}>Torna alla Dashboard</button>
        </div>
      </div>
    )
  }

  const data = savedCase.imagingData
  const demScore = data.echoAvailable && data.echo ? calculateDemScore(data.echo) : null
  const cmrScore = data.cmrAvailable && data.cmr ? calculateCmrScore(data.cmr) : null
  const ctScore = data.ctpetAvailable && data.ct ? calculateCtSigns(data.ct) : null
  const petDataEntered = data.ctpetAvailable && data.pet && Object.values(data.pet).some((value) => value !== null)
  const petPositive = petDataEntered && data.pet ? evaluatePet(data.pet) : null
  const report = buildClinicalReport({
    metadata: savedCase.metadata,
    result: savedCase.result,
    demScore,
    cmrScore,
    ctScore,
    petPositive,
  })

  return (
    <div className="cm-page">
      <section className="cm-hero">
        <div className="cm-hero-main">
          <div className="cm-eyebrow">Dettaglio caso</div>
          <h1 className="cm-title-xl">Dettaglio Valutazione</h1>
          <p className="cm-lead">
            {new Date(savedCase.date).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <aside className="cm-hero-side">
          <div className="cm-status-panel">
            <div className="cm-status-label">Output integrato</div>
            <div className="cm-status-value">{savedCase.result.title}</div>
            <div className="cm-status-subtitle">{savedCase.result.subtitle}</div>
          </div>
          <button type="button" className="cm-button secondary" onClick={() => navigate('home')}>Indietro</button>
        </aside>
      </section>

      <section className="cm-layout">
        <div className="cm-stack">
          <article className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title">
                <h2>{savedCase.metadata?.caseId || 'Caso senza ID'}</h2>
                <p>{savedCase.metadata?.clinicalContext || 'Contesto non specificato'} · {savedCase.metadata?.location || 'Localizzazione non specificata'}</p>
              </div>
            </div>
            {savedCase.metadata?.note && <p style={{ color: 'var(--cm-muted)' }}>{savedCase.metadata.note}</p>}
          </article>

          <ConsensusPanel result={savedCase.result} />

          <details className="cm-card">
            <summary className="font-bold cursor-pointer" style={{ color: 'var(--cm-primary)' }}>Dati imaging originali</summary>
            <pre className="mt-3 overflow-auto rounded-xl p-4 text-xs" style={{ maxHeight: 260, background: '#fbfdff', color: 'var(--cm-muted)' }}>
              {JSON.stringify(savedCase.imagingData, null, 2)}
            </pre>
          </details>
        </div>

        <aside className="cm-sidebar">
          <ReportCard report={report} />
        </aside>
      </section>
    </div>
  )
}
