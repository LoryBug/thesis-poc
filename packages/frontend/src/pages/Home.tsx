import { useUiStore } from '../stores/ui.store'
import { useHistoryStore } from '../stores/history.store'
import { RiskPill } from '../components/ui/RiskPill'

export function Home() {
  const navigate = useUiStore((s) => s.navigate)
  const cases = useHistoryStore((s) => s.cases)
  const removeCase = useHistoryStore((s) => s.removeCase)
  const clearAll = useHistoryStore((s) => s.clearAll)

  return (
    <div className="cm-page">
      <section className="cm-hero">
        <div className="cm-hero-main">
          <div className="cm-eyebrow">Dashboard</div>
          <h1 className="cm-title-xl">Saved evaluations</h1>
          <p className="cm-lead">Local history of cases assessed with multimodality scores and integrated decision support.</p>
        </div>
        <aside className="cm-hero-side">
          <div className="cm-status-panel">
            <div className="cm-status-label">Archived cases</div>
            <div className="cm-status-value">{cases.length}</div>
            <div className="cm-status-subtitle">Saved in this browser.</div>
          </div>
          <button type="button" className="cm-button" onClick={() => navigate('new')}>New Evaluation</button>
        </aside>
      </section>

      <section className="cm-stack">
        <div className="cm-card-header" style={{ marginBottom: 0 }}>
          <div className="cm-card-title">
            <h2>Case archive</h2>
            <p>Open case details to review consensus, next step, and original imaging data.</p>
          </div>
          {cases.length > 0 && (
            <button type="button" className="cm-button danger" onClick={clearAll}>Clear history</button>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="cm-card" style={{ textAlign: 'center', padding: '48px 22px' }}>
            <p className="mb-4" style={{ color: 'var(--cm-muted)' }}>No saved evaluations.</p>
            <button type="button" className="cm-button" onClick={() => navigate('new')}>Start a new evaluation</button>
          </div>
        ) : (
          <div className="cm-stack">
            {cases.map((savedCase) => (
              <article key={savedCase.id} className="cm-card">
                <div className="cm-card-header">
                  <div className="cm-card-title">
                    <h2>{savedCase.metadata?.caseId || 'Evaluation without ID'}</h2>
                    <p>
                      Evaluation on{' '}
                      {new Date(savedCase.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <RiskPill level={savedCase.result.risk}>{savedCase.result.risk === 'high' ? 'High priority' : savedCase.result.risk === 'mid' ? 'Needs review' : savedCase.result.risk === 'low' ? 'Low risk' : 'POC'}</RiskPill>
                </div>

                <p className="font-bold" style={{ color: 'var(--cm-dark)' }}>{savedCase.result.title}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--cm-muted)' }}>
                  {savedCase.metadata?.clinicalContext || 'Context not specified'} · {savedCase.metadata?.location || 'Location not specified'}
                </p>

                <div className="cm-actions">
                  <button type="button" className="cm-button secondary" onClick={() => navigate('detail', savedCase.id)}>Details</button>
                  <button type="button" className="cm-button danger" onClick={() => removeCase(savedCase.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
