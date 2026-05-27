import { useUiStore } from '../stores/ui.store'
import { useHistoryStore } from '../stores/history.store'

export function Home() {
  const navigate = useUiStore((s) => s.navigate)
  const cases = useHistoryStore((s) => s.cases)
  const removeCase = useHistoryStore((s) => s.removeCase)
  const clearAll = useHistoryStore((s) => s.clearAll)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Dashboard</h2>
        <div className="flex gap-2">
          {cases.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 cursor-pointer"
            >
              Cancella cronologia
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('new')}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Nuova Valutazione
          </button>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-400 mb-4">Nessuna valutazione salvata.</p>
          <button
            type="button"
            onClick={() => navigate('new')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Inizia una nuova valutazione
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm text-gray-800">
                  Valutazione del{' '}
                  {new Date(c.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    c.result.risk === 'high'
                      ? 'text-red-600'
                      : c.result.risk === 'mid'
                        ? 'text-amber-600'
                        : 'text-green-600'
                  }`}
                >
                  {c.result.title}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('detail', c.id)}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 cursor-pointer"
                >
                  Dettaglio
                </button>
                <button
                  type="button"
                  onClick={() => removeCase(c.id)}
                  className="px-3 py-1 text-sm text-red-500 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
