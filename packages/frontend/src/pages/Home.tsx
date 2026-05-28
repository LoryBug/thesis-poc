import { useUiStore } from '../stores/ui.store'
import { useHistoryStore } from '../stores/history.store'

const riskColors: Record<string, { bg: string; text: string }> = {
  high: { bg: 'rgba(180,35,24,0.08)', text: '#b42318' },
  mid: { bg: 'rgba(183,121,31,0.08)', text: '#b7791f' },
  low: { bg: 'rgba(22,120,76,0.08)', text: '#16784c' },
  not: { bg: 'rgba(217,226,239,0.3)', text: '#607089' },
}

export function Home() {
  const navigate = useUiStore((s) => s.navigate)
  const cases = useHistoryStore((s) => s.cases)
  const removeCase = useHistoryStore((s) => s.removeCase)
  const clearAll = useHistoryStore((s) => s.clearAll)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#0f223d' }}>Dashboard</h2>
        <div className="flex gap-2">
          {cases.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-1.5 text-sm font-semibold rounded-xl cursor-pointer transition-opacity"
              style={{ color: '#607089', border: '1px solid rgba(217,226,239,0.9)' }}
            >
              Cancella cronologia
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('new')}
            className="px-4 py-1.5 text-sm font-semibold text-white rounded-xl cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #245b94, #173b68)' }}
          >
            Nuova Valutazione
          </button>
        </div>
      </div>

      {cases.length === 0 ? (
        <div
          className="text-center py-12 rounded-[18px] border"
          style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}
        >
          <p className="mb-4" style={{ color: '#607089' }}>Nessuna valutazione salvata.</p>
          <button
            type="button"
            onClick={() => navigate('new')}
            className="px-6 py-2 font-semibold text-white rounded-xl cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #245b94, #173b68)' }}
          >
            Inizia una nuova valutazione
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => {
            const rc = riskColors[c.result.risk] ?? riskColors.not
            return (
              <div
                key={c.id}
                className="rounded-[18px] p-4 border flex items-center justify-between"
                style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}
              >
                <div>
                  <p className="font-medium text-sm" style={{ color: '#172033' }}>
                    Valutazione del{' '}
                    {new Date(c.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs font-bold mt-1" style={{ color: rc.text }}>{c.result.title}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('detail', c.id)}
                    className="px-3 py-1 text-sm font-semibold rounded-xl cursor-pointer"
                    style={{ color: '#245b94', border: '1px solid rgba(217,226,239,0.9)' }}
                  >
                    Dettaglio
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCase(c.id)}
                    className="px-3 py-1 text-sm font-semibold rounded-xl cursor-pointer"
                    style={{ color: '#b42318', border: '1px solid rgba(217,226,239,0.9)' }}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
