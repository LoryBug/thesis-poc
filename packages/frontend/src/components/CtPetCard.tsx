import { useCaseStore } from '../stores/case.store'
import { calculateCtSigns, evaluatePet, ctPetLevel, CT_MAX } from '@cm-dss/core'
import type { CtFeatures, CtPetLevel } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'

const ctFeatures: { key: keyof CtFeatures; title: string; description: string; points: number }[] = [
  { key: 'irregularMargins', title: 'Margini irregolari', description: 'Profilo non circoscritto o spiculato.', points: 1 },
  { key: 'pericardialEffusion', title: 'Versamento pericardico', description: 'Associato a massa sospetta.', points: 1 },
  { key: 'invasion', title: 'Invasione', description: 'Disruption o estensione in strutture vicine.', points: 1 },
  { key: 'solidNature', title: 'Natura solida', description: 'Densità compatibile con componente solida.', points: 1 },
  { key: 'diameterOver30mm', title: 'Diametro >30mm', description: 'Dimensione elevata, non diagnostica da sola.', points: 1 },
  { key: 'contrastUptake', title: 'Captazione contrasto', description: 'Aumento densità dopo mezzo di contrasto.', points: 1 },
  { key: 'preContrastSuspicious', title: 'Sospetta densità pre-contrasto', description: 'Segnale pre-contrastografico associato a sospetto.', points: 1 },
  { key: 'calcifications', title: 'Calcificazioni', description: 'Segno incluso nello studio TC.', points: 1 },
]

const levelLabel: Record<CtPetLevel, string> = {
  high: 'Alto sospetto',
  gray: 'Zona grigia',
  discordant: 'Discordante',
  low: 'Basso sospetto',
  unavailable: 'Non disponibile',
}

const levelRisk: Record<CtPetLevel, 'high' | 'mid' | 'low' | 'not'> = {
  high: 'high',
  gray: 'mid',
  discordant: 'mid',
  low: 'low',
  unavailable: 'not',
}

export function CtPetCard() {
  const ct = useCaseStore((s) => s.ct)
  const pet = useCaseStore((s) => s.pet)
  const ctpetAvailable = useCaseStore((s) => s.ctpetAvailable)
  const setCtpetAvailable = useCaseStore((s) => s.setCtpetAvailable)
  const setCtFeature = useCaseStore((s) => s.setCtFeature)
  const setPetParam = useCaseStore((s) => s.setPetParam)

  const petDataEntered = ctpetAvailable && (pet.suvMax !== null || pet.mtv !== null || pet.tlg !== null)
  const ctSigns = ctpetAvailable ? calculateCtSigns(ct) : null
  const petPositive = petDataEntered ? evaluatePet(pet) : false
  const level = ctpetAvailable ? ctPetLevel(ctSigns ?? 0, petPositive, petDataEntered) : 'unavailable'

  return (
    <article className="cm-card" data-exam-card="ctpet">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>TC cardiaca e PET/TC</h2>
          <p>Conteggio segni TC: ≤2 basso sospetto, 3-4 zona grigia, ≥5 alto sospetto. PET utile soprattutto nella zona grigia o per staging.</p>
        </div>
        <label className="cm-exam-toggle">
          <input
            type="checkbox"
            checked={ctpetAvailable}
            onChange={(event) => setCtpetAvailable(event.target.checked)}
          />
          TC/PET disponibile
        </label>
      </div>

      {!ctpetAvailable ? (
        <p className="text-sm italic" style={{ color: 'var(--cm-muted)' }}>Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <>
          <div className="cm-feature-grid">
            {ctFeatures.map((feature) => (
              <FeatureTile
                key={feature.key}
                title={feature.title}
                description={feature.description}
                points={feature.points}
                checked={ct[feature.key]}
                onChange={(value) => setCtFeature(feature.key, value)}
              />
            ))}
          </div>

          <div className="cm-pet-grid">
            {([
              { key: 'suvMax' as const, label: 'SUVmax', hint: '≥ 4.9' },
              { key: 'mtv' as const, label: 'MTV (mL)', hint: '≥ 8.2' },
              { key: 'tlg' as const, label: 'TLG', hint: '≥ 29' },
            ]).map(({ key, label, hint }) => (
              <label key={key} className="cm-field">
                {label}
                <input
                  className="cm-input"
                  type="number"
                  step="0.1"
                  min="0"
                  value={pet[key] ?? ''}
                  onChange={(event) => setPetParam(key, event.target.value === '' ? null : Number(event.target.value))}
                  placeholder={hint}
                />
              </label>
            ))}
          </div>

          {Object.values(pet).some((value) => value !== null) && (
            <p className="mt-3 text-xs" style={{ color: 'var(--cm-muted)' }}>
              PET: <strong style={{ color: petPositive ? 'var(--cm-high)' : 'var(--cm-low)' }}>{petPositive ? 'Positiva' : 'Negativa'}</strong>
            </p>
          )}

          <ScoreStrip
            score={ctSigns}
            max={CT_MAX}
            note={`TC signs: ${ctSigns}/8. Parametri PET inseriti: ${petDataEntered ? 'sì' : 'no'}.`}
            badge={levelLabel[level]}
            level={levelRisk[level]}
          />
        </>
      )}
    </article>
  )
}
