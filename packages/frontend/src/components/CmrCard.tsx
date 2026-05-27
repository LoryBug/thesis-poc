import { useCaseStore } from '../stores/case.store'
import { calculateCmrScore, CMR_CUTOFF } from '@cm-dss/core'
import type { CmrFeatures } from '@cm-dss/core'

const labels: [keyof CmrFeatures, string][] = [
  ['infiltration', 'Infiltrazione'],
  ['firstPassPerfusion', 'Perfusione first-pass'],
  ['pericardialEffusion', 'Versamento pericardico'],
  ['sessile', 'Sessile (base larga)'],
  ['polylobated', 'Polilobato'],
  ['heterogeneousEnhancement', 'Enhancement eterogeneo'],
]

export function CmrCard() {
  const { cmr, cmrAvailable, setCmrAvailable, setCmrFeature } = useCaseStore()
  const hasFeatures = Object.values(cmr).some(Boolean)
  const score = hasFeatures ? calculateCmrScore(cmr) : null

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-blue-900">Risonanza Magnetica (CMR Mass Score)</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={cmrAvailable}
            onChange={(e) => setCmrAvailable(e.target.checked)}
            className="rounded"
          />
          Disponibile
        </label>
      </div>

      {!cmrAvailable ? (
        <p className="text-gray-400 text-sm italic">Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {labels.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={cmr[key]}
                  onChange={(e) => setCmrFeature(key, e.target.checked)}
                  className="rounded"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">CMR Mass Score:</span>
            <span
              className={`font-bold text-lg ${
                score !== null && score >= CMR_CUTOFF ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {score !== null ? `${score}/8` : '—'}
            </span>
            {score !== null && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  score >= CMR_CUTOFF
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {score >= CMR_CUTOFF ? 'POSITIVO' : 'sotto cutoff'}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
