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
          <h1 className="cm-title-xl">Valutazioni salvate</h1>
          <p className="cm-lead">Cronologia locale dei casi valutati con score multimodale e decisione integrata.</p>
        </div>
        <aside className="cm-hero-side">
          <div className="cm-status-panel">
            <div className="cm-status-label">Casi archiviati</div>
            <div className="cm-status-value">{cases.length}</div>
            <div className="cm-status-subtitle">Salvati nel browser corrente.</div>
          </div>
          <button type="button" className="cm-button" onClick={() => navigate('new')}>Nuova Valutazione</button>
        </aside>
      </section>

      <section className="cm-stack">
        <div className="cm-card-header" style={{ marginBottom: 0 }}>
          <div className="cm-card-title">
            <h2>Archivio casi</h2>
            <p>Apri un dettaglio per rivedere consenso, next step e dati imaging originali.</p>
          </div>
          {cases.length > 0 && (
            <button type="button" className="cm-button danger" onClick={clearAll}>Cancella cronologia</button>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="cm-card" style={{ textAlign: 'center', padding: '48px 22px' }}>
            <p className="mb-4" style={{ color: 'var(--cm-muted)' }}>Nessuna valutazione salvata.</p>
            <button type="button" className="cm-button" onClick={() => navigate('new')}>Inizia una nuova valutazione</button>
          </div>
        ) : (
          <div className="cm-stack">
            {cases.map((savedCase) => (
              <article key={savedCase.id} className="cm-card">
                <div className="cm-card-header">
                  <div className="cm-card-title">
                    <h2>{savedCase.metadata?.caseId || 'Valutazione senza ID'}</h2>
                    <p>
                      Valutazione del{' '}
                      {new Date(savedCase.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <RiskPill level={savedCase.result.risk}>{savedCase.result.risk === 'high' ? 'Alta priorità' : savedCase.result.risk === 'mid' ? 'Approfondire' : savedCase.result.risk === 'low' ? 'Basso rischio' : 'POC'}</RiskPill>
                </div>

                <p className="font-bold" style={{ color: 'var(--cm-dark)' }}>{savedCase.result.title}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--cm-muted)' }}>
                  {savedCase.metadata?.clinicalContext || 'Contesto non specificato'} · {savedCase.metadata?.location || 'Localizzazione non specificata'}
                </p>

                <div className="cm-actions">
                  <button type="button" className="cm-button secondary" onClick={() => navigate('detail', savedCase.id)}>Dettaglio</button>
                  <button type="button" className="cm-button danger" onClick={() => removeCase(savedCase.id)}>Elimina</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
