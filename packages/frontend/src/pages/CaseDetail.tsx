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
        <p className="text-gray-500">Caso non trovato.</p>
        <button
          type="button"
          onClick={() => navigate('home')}
          className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Torna alla Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Dettaglio Valutazione</h2>
        <button
          type="button"
          onClick={() => navigate('home')}
          className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 cursor-pointer"
        >
          Indietro
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {new Date(savedCase.date).toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <ConsensusPanel result={savedCase.result} />

      <details className="bg-gray-50 rounded-lg p-4 border">
        <summary className="font-medium text-sm text-gray-700 cursor-pointer">
          Dati imaging originali
        </summary>
        <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-64">
          {JSON.stringify(savedCase.imagingData, null, 2)}
        </pre>
      </details>
    </div>
  )
}
