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
  const cmr = useCaseStore((s) => s.cmr)
  const cmrAvailable = useCaseStore((s) => s.cmrAvailable)
  const setCmrAvailable = useCaseStore((s) => s.setCmrAvailable)
  const setCmrFeature = useCaseStore((s) => s.setCmrFeature)

  const hasFeatures = Object.values(cmr).some(Boolean)
  const score = hasFeatures ? calculateCmrScore(cmr) : null

  return (
    <div className="rounded-[18px] border" style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}>
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-lg font-bold tracking-tight" style={{ color: '#173b68' }}>Risonanza Magnetica (CMR Mass Score)</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: '#607089' }}>
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
        <p className="text-sm italic p-5" style={{ color: '#607089' }}>Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {labels.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: '#172033' }}>
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

          <div className="flex items-center gap-3 text-sm pt-2 border-t" style={{ borderColor: 'rgba(217,226,239,0.9)' }}>
            <span className="font-semibold" style={{ color: '#607089' }}>CMR Mass Score:</span>
            <span
              className="font-bold text-lg"
              style={{ color: score !== null && score >= CMR_CUTOFF ? '#b42318' : '#16784c' }}
            >
              {score !== null ? `${score}/8` : '—'}
            </span>
            {score !== null && (
              <span
                className="px-2.5 py-0.5 rounded text-xs font-bold"
                style={{
                  background: score >= CMR_CUTOFF ? 'rgba(180,35,24,0.12)' : 'rgba(22,120,76,0.12)',
                  color: score >= CMR_CUTOFF ? '#b42318' : '#16784c',
                }}
              >
                {score >= CMR_CUTOFF ? 'POSITIVO' : 'sotto cutoff'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
