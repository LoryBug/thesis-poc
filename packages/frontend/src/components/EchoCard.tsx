import { useCaseStore } from '../stores/case.store'
import { calculateDemScore, DEM_CUTOFF } from '@cm-dss/core'
import type { EchoFeatures } from '@cm-dss/core'

const labels: [keyof EchoFeatures, string][] = [
  ['infiltration', 'Infiltrazione'],
  ['polylobated', 'Polilobato'],
  ['pericardialEffusion', 'Versamento pericardico'],
  ['sessile', 'Sessile (base larga)'],
  ['inhomogeneity', 'Inomogeneità'],
  ['nonLeftLocation', 'Localizzazione non a sinistra'],
]

export function EchoCard() {
  const { echo, echoAvailable, setEchoAvailable, setEchoFeature } = useCaseStore()
  const hasFeatures = Object.values(echo).some(Boolean)
  const score = hasFeatures ? calculateDemScore(echo) : null

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-blue-900">Ecocardiografia (DEM Score)</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={echoAvailable}
            onChange={(e) => setEchoAvailable(e.target.checked)}
            className="rounded"
          />
          Disponibile
        </label>
      </div>

      {!echoAvailable ? (
        <p className="text-gray-400 text-sm italic">Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {labels.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={echo[key]}
                  onChange={(e) => setEchoFeature(key, e.target.checked)}
                  className="rounded"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">DEM Score:</span>
            <span
              className={`font-bold text-lg ${
                score !== null && score >= DEM_CUTOFF ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {score !== null ? `${score}/9` : '—'}
            </span>
            {score !== null && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  score >= DEM_CUTOFF
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {score >= DEM_CUTOFF ? 'POSITIVO' : 'sotto cutoff'}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
