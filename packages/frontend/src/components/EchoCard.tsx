import { useCaseStore } from '../stores/case.store'
import { calculateDemScore, demProbability, DEM_CUTOFF } from '@cm-dss/core'
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
  const echo = useCaseStore((s) => s.echo)
  const echoAvailable = useCaseStore((s) => s.echoAvailable)
  const setEchoAvailable = useCaseStore((s) => s.setEchoAvailable)
  const setEchoFeature = useCaseStore((s) => s.setEchoFeature)

  const hasFeatures = Object.values(echo).some(Boolean)
  const score = hasFeatures ? calculateDemScore(echo) : null
  const prob = score !== null ? demProbability(score) : null

  return (
    <div className="rounded-[18px] border" style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}>
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-lg font-bold tracking-tight" style={{ color: '#173b68' }}>Ecocardiografia (DEM Score)</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: '#607089' }}>
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
        <p className="text-sm italic p-5" style={{ color: '#607089' }}>Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {labels.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: '#172033' }}>
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

          <div className="flex items-center gap-3 text-sm pt-2 border-t" style={{ borderColor: 'rgba(217,226,239,0.9)' }}>
            <span className="font-semibold" style={{ color: '#607089' }}>DEM Score:</span>
            <span
              className="font-bold text-lg"
              style={{ color: score !== null && score >= DEM_CUTOFF ? '#b42318' : '#16784c' }}
            >
              {score !== null ? `${score}/9` : '—'}
            </span>
            {score !== null && (
              <span
                className="px-2.5 py-0.5 rounded text-xs font-bold"
                style={{
                  background: score >= DEM_CUTOFF ? 'rgba(180,35,24,0.12)' : 'rgba(22,120,76,0.12)',
                  color: score >= DEM_CUTOFF ? '#b42318' : '#16784c',
                }}
              >
                {score >= DEM_CUTOFF ? 'POSITIVO' : 'sotto cutoff'}
              </span>
            )}
          </div>

          {prob !== null && (
            <p className="text-xs" style={{ color: '#607089' }}>
              Probabilità stimata: <span className="font-semibold">{prob}%</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
