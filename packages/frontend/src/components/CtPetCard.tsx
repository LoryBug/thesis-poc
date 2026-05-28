import { useCaseStore } from '../stores/case.store'
import { calculateCtSigns, evaluatePet, ctPetLevel, CT_MAX } from '@cm-dss/core'
import type { CtFeatures, CtPetLevel } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'

const ctFeatures: { key: keyof CtFeatures; title: string; description: string; points: number }[] = [
  { key: 'irregularMargins', title: 'Irregular margins', description: 'Non-circumscribed or spiculated profile.', points: 1 },
  { key: 'pericardialEffusion', title: 'Pericardial effusion', description: 'Associated with a suspicious mass.', points: 1 },
  { key: 'invasion', title: 'Invasion', description: 'Disruption or extension into adjacent structures.', points: 1 },
  { key: 'solidNature', title: 'Solid nature', description: 'Density compatible with a solid component.', points: 1 },
  { key: 'diameterOver30mm', title: 'Diameter >30 mm', description: 'Large size, not diagnostic on its own.', points: 1 },
  { key: 'contrastUptake', title: 'Contrast uptake', description: 'Density increase after contrast medium.', points: 1 },
  { key: 'preContrastSuspicious', title: 'Pre-contrast suspicious density', description: 'Pre-contrast density associated with suspicion.', points: 1 },
  { key: 'calcifications', title: 'Calcifications', description: 'Sign included in the cardiac CT study.', points: 1 },
]

const levelLabel: Record<CtPetLevel, string> = {
  high: 'High suspicion',
  gray: 'Gray zone',
  discordant: 'Discordant',
  low: 'Low suspicion',
  unavailable: 'Unavailable',
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
          <h2>Cardiac CT and 18F-FDG PET/CT</h2>
          <p>CT sign count: &lt;=2 low suspicion, 3-4 gray zone, &gt;=5 high suspicion. PET is especially useful in the gray zone or for staging.</p>
        </div>
        <label className="cm-exam-toggle">
          <input
            type="checkbox"
            checked={ctpetAvailable}
            onChange={(event) => setCtpetAvailable(event.target.checked)}
          />
          CT/PET available
        </label>
      </div>

      {!ctpetAvailable ? (
        <p className="text-sm italic" style={{ color: 'var(--cm-muted)' }}>Select availability to enter data.</p>
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
              { key: 'suvMax' as const, label: 'SUVmax', hint: '>= 4.9' },
              { key: 'mtv' as const, label: 'MTV (mL)', hint: '>= 8.2' },
              { key: 'tlg' as const, label: 'TLG', hint: '>= 29' },
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
              PET: <strong style={{ color: petPositive ? 'var(--cm-high)' : 'var(--cm-low)' }}>{petPositive ? 'Positive' : 'Negative'}</strong>
            </p>
          )}

          <ScoreStrip
            score={ctSigns}
            max={CT_MAX}
            note={`CT signs: ${ctSigns}/8. PET parameters entered: ${petDataEntered ? 'yes' : 'no'}.`}
            badge={levelLabel[level]}
            level={levelRisk[level]}
          />
        </>
      )}
    </article>
  )
}
