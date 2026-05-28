import { useMemo } from 'react'
import { useHistoryStore } from '../stores/history.store'
import { useUiStore } from '../stores/ui.store'
import { ConsensusPanel } from '../components/ConsensusPanel'

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
      <div className="text-center py-12">
        <p style={{ color: '#607089' }}>Caso non trovato.</p>
        <button
          type="button"
          onClick={() => navigate('home')}
          className="mt-4 px-4 py-2 text-sm font-semibold text-white rounded-xl cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #245b94, #173b68)' }}
        >
          Torna alla Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#0f223d' }}>Dettaglio Valutazione</h2>
        <button
          type="button"
          onClick={() => navigate('home')}
          className="px-3 py-1.5 text-sm font-semibold rounded-xl cursor-pointer"
          style={{ color: '#245b94', border: '1px solid rgba(217,226,239,0.9)' }}
        >
          Indietro
        </button>
      </div>

      <p className="text-sm" style={{ color: '#607089' }}>
        {new Date(savedCase.date).toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <div style={{ maxWidth: '860px' }}>
        <ConsensusPanel result={savedCase.result} />
      </div>

      <details
        className="rounded-[18px] p-4 border"
        style={{ maxWidth: '860px', background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}
      >
        <summary className="font-medium text-sm cursor-pointer" style={{ color: '#607089' }}>
          Dati imaging originali
        </summary>
        <pre className="mt-2 text-xs overflow-auto max-h-64" style={{ color: '#607089' }}>
          {JSON.stringify(savedCase.imagingData, null, 2)}
        </pre>
      </details>
    </div>
  )
}
