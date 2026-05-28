import { useCaseStore } from '../stores/case.store'
import { calculateCmrMassScore, cmrScoreClass, CMR_MASS_CUTOFF } from '@cm-dss/core'

const fields: [string, keyof import('@cm-dss/core').CmrFindings][] = [
  ['Diametro longitudinale (mm)', 'longitudinalDiameter'],
  ['Diametro trasversale (mm)', 'transverseDiameter'],
  ['Diametro AP (mm)', 'apDiameter'],
  ['T1 nativo (ms)', 'nativeT1'],
  ['T2 (ms)', 't2'],
  ['Enhancement (%)', 'enhancement'],
]

const classStyle: Record<string, React.CSSProperties> = {
  bassa: {
    background: 'rgba(22,120,76,0.1)',
    color: '#16784c',
    borderColor: 'rgba(22,120,76,0.2)',
    fontWeight: 700,
  },
  intermedia: {
    background: 'rgba(183,121,31,0.1)',
    color: '#b7791f',
    borderColor: 'rgba(183,121,31,0.2)',
    fontWeight: 700,
  },
  alta: {
    background: 'rgba(180,35,24,0.1)',
    color: '#b42318',
    borderColor: 'rgba(180,35,24,0.2)',
    fontWeight: 700,
  },
}

export function CmrCard() {
  const cmr = useCaseStore((s) => s.cmr)
  const cmrAvailable = useCaseStore((s) => s.cmrAvailable)
  const setCmrAvailable = useCaseStore((s) => s.setCmrAvailable)
  const setCmrFinding = useCaseStore((s) => s.setCmrFinding)

  const hasAny = Object.values(cmr).some((v) => v !== null && v !== undefined)
  const score = hasAny ? calculateCmrMassScore(cmr) : null
  const cls = score !== null ? cmrScoreClass(score) : null

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {fields.map(([label, key]) => (
              <label key={key} className="flex flex-col gap-0.5 text-sm" style={{ color: '#172033' }}>
                <span className="font-medium text-xs" style={{ color: '#607089' }}>{label}</span>
                <input
                  type="number"
                  value={cmr[key] ?? ''}
                  onChange={(e) => setCmrFinding(key, e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: 'rgba(217,226,239,0.9)', background: '#f8fafc' }}
                />
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm pt-2 border-t" style={{ borderColor: 'rgba(217,226,239,0.9)' }}>
            <span className="font-semibold" style={{ color: '#607089' }}>CMR Mass Score:</span>
            <span
              className="font-bold text-lg"
              style={{ color: score !== null && score >= CMR_MASS_CUTOFF ? '#b42318' : '#16784c' }}
            >
              {score !== null ? score : '—'}
            </span>
            {score !== null && (
              <span
                className="px-2.5 py-0.5 rounded text-xs"
                style={{
                  background: score >= CMR_MASS_CUTOFF ? 'rgba(180,35,24,0.12)' : 'rgba(22,120,76,0.12)',
                  color: score >= CMR_MASS_CUTOFF ? '#b42318' : '#16784c',
                }}
              >
                {score >= CMR_MASS_CUTOFF ? 'POSITIVO' : 'sotto cutoff'}
              </span>
            )}
          </div>

          {cls && (
            <p className="text-xs" style={{ color: '#607089' }}>
              Classe di rischio:{' '}
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={classStyle[cls] ?? {}}
              >
                {cls.toUpperCase()}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
