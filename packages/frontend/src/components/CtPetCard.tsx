import { useCaseStore } from '../stores/case.store'
import { calculateCtSigns, evaluatePet, ctPetLevel, CT_MAX } from '@cm-dss/core'
import type { CtFeatures } from '@cm-dss/core'

const ctLabels: [keyof CtFeatures, string][] = [
  ['irregularMargins', 'Margini irregolari'],
  ['pericardialEffusion', 'Versamento pericardico'],
  ['invasion', 'Invasione'],
  ['solidNature', 'Natura solida'],
  ['diameterOver30mm', 'Diametro >30mm'],
  ['contrastUptake', 'Captazione contrasto'],
  ['preContrastSuspicious', 'Sospetta densità pre-contrasto'],
  ['calcifications', 'Calcificazioni'],
]

const levelColors: Record<string, React.CSSProperties> = {
  high: { background: 'rgba(180,35,24,0.1)', color: '#b42318', borderColor: 'rgba(180,35,24,0.2)' },
  gray: { background: 'rgba(183,121,31,0.1)', color: '#b7791f', borderColor: 'rgba(183,121,31,0.2)' },
  discordant: { background: 'rgba(183,121,31,0.1)', color: '#b7791f', borderColor: 'rgba(183,121,31,0.2)' },
  low: { background: 'rgba(22,120,76,0.1)', color: '#16784c', borderColor: 'rgba(22,120,76,0.2)' },
  unavailable: { background: 'rgba(217,226,239,0.3)', color: '#607089', borderColor: 'rgba(217,226,239,0.9)' },
}

const levelLabel: Record<string, string> = {
  high: 'Alto sospetto',
  gray: 'Zona grigia',
  discordant: 'Discordante',
  low: 'Basso sospetto',
  unavailable: 'Non disponibile',
}

export function CtPetCard() {
  const ct = useCaseStore((s) => s.ct)
  const pet = useCaseStore((s) => s.pet)
  const ctpetAvailable = useCaseStore((s) => s.ctpetAvailable)
  const setCtpetAvailable = useCaseStore((s) => s.setCtpetAvailable)
  const setCtFeature = useCaseStore((s) => s.setCtFeature)
  const setPetParam = useCaseStore((s) => s.setPetParam)

  const petDataEntered = ctpetAvailable && (pet.suvMax !== null || pet.mtv !== null || pet.tlg !== null)
  const ctSigns = ctpetAvailable ? calculateCtSigns(ct) : 0
  const petPositive = petDataEntered ? evaluatePet(pet) : false
  const level = ctpetAvailable ? ctPetLevel(ctSigns, petPositive, petDataEntered) : 'unavailable'

  return (
    <div className="rounded-[18px] border" style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}>
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-lg font-bold tracking-tight" style={{ color: '#173b68' }}>TC / PET-TC</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: '#607089' }}>
          <input
            type="checkbox"
            checked={ctpetAvailable}
            onChange={(e) => setCtpetAvailable(e.target.checked)}
            className="rounded"
          />
          Disponibile
        </label>
      </div>

      {!ctpetAvailable ? (
        <p className="text-sm italic p-5" style={{ color: '#607089' }}>Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#607089' }}>Segni TC</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ctLabels.map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: '#172033' }}>
                  <input
                    type="checkbox"
                    checked={ct[key]}
                    onChange={(e) => setCtFeature(key, e.target.checked)}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: '#607089' }}>
              Segni TC:{' '}
              <span className="font-bold" style={{ color: '#172033' }}>
                {ctSigns}/{CT_MAX}
              </span>
            </p>
          </div>

          <div className="border-t pt-3" style={{ borderColor: 'rgba(217,226,239,0.9)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#607089' }}>Parametri PET</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { key: 'suvMax' as const, label: 'SUVmax', hint: '≥ 4.9' },
                { key: 'mtv' as const, label: 'MTV (mL)', hint: '≥ 8.2' },
                { key: 'tlg' as const, label: 'TLG', hint: '≥ 29' },
              ]).map(({ key, label, hint }) => (
                <label key={key} className="flex flex-col gap-0.5 text-sm">
                  <span className="text-xs font-medium" style={{ color: '#607089' }}>{label}</span>
                  <input
                    type="number"
                    step="0.1"
                    value={pet[key] ?? ''}
                    onChange={(e) => setPetParam(key, e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition-shadow focus:ring-2"
                    style={{ borderColor: 'rgba(217,226,239,0.9)', background: '#f8fafc' }}
                    placeholder={hint}
                  />
                </label>
              ))}
            </div>
            {Object.values(pet).some((v) => v !== null) && (
              <p className="text-xs mt-2" style={{ color: '#607089' }}>
                PET:{' '}
                <span
                  className="font-bold"
                  style={{ color: petPositive ? '#b42318' : '#16784c' }}
                >
                  {petPositive ? 'Positiva' : 'Negativa'}
                </span>
              </p>
            )}
          </div>

          <div className="border-t pt-2" style={{ borderColor: 'rgba(217,226,239,0.9)' }}>
            <p className="text-xs" style={{ color: '#607089' }}>
              Classificazione TC/PET:{' '}
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={levelColors[level] ?? levelColors.unavailable}
              >
                {levelLabel[level] ?? 'Non disponibile'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
