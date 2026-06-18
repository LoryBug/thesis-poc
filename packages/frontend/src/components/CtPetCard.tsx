import { useEffect, useState } from 'react'
import { useCaseStore } from '../stores/case.store'
import { calculateCtSigns, evaluatePet, ctPetLevel, CT_MAX } from '@cm-dss/core'
import type { CtFeatures, CtPetLevel, PetParameters } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'
import { Abbr } from './ui/Abbr'

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

interface PetFieldDef {
  key: keyof PetParameters
  label: React.ReactNode
  hint: string
  warningThreshold: number
  warningLabel: string
}

const petFields: PetFieldDef[] = [
  { key: 'suvMax', label: <Abbr term="SUVmax" definition="Maximum Standardized Uptake Value: peak FDG uptake normalized to body weight. Cutoff >= 4.9" />, hint: '>= 4.9',  warningThreshold: 30,  warningLabel: 'Valore insolitamente alto per SUVmax in masse cardiache' },
  { key: 'mtv',    label: <Abbr term="MTV"    definition="Metabolic Tumor Volume (mL): volume of tissue with SUV above threshold. Cutoff >= 8.2" />,    hint: '>= 8.2',  warningThreshold: 200, warningLabel: 'MTV insolitamente alto per masse cardiache' },
  { key: 'tlg',    label: <Abbr term="TLG"    definition="Total Lesion Glycolysis: MTV × mean SUV, reflects total metabolic activity. Cutoff >= 29" />,    hint: '>= 29',   warningThreshold: 1000, warningLabel: 'TLG insolitamente alto per masse cardiache' },
]

function petToRaw(pet: PetParameters) {
  return {
    suvMax: pet.suvMax !== null ? String(pet.suvMax) : '',
    mtv: pet.mtv !== null ? String(pet.mtv) : '',
    tlg: pet.tlg !== null ? String(pet.tlg) : '',
  }
}

function parsePetValue(raw: string): number | null {
  if (raw === '') return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

export function CtPetCard() {
  const ct = useCaseStore((s) => s.ct)
  const pet = useCaseStore((s) => s.pet)
  const ctpetAvailable = useCaseStore((s) => s.ctpetAvailable)
  const setCtpetAvailable = useCaseStore((s) => s.setCtpetAvailable)
  const setCtFeature = useCaseStore((s) => s.setCtFeature)
  const setPetParam = useCaseStore((s) => s.setPetParam)

  // Local raw input state: updates immediately on keystroke
  const [rawInputs, setRawInputs] = useState(() => petToRaw(pet))

  // Sync rawInputs from store when store changes externally (loadFrom)
  useEffect(() => {
    setRawInputs(petToRaw(pet))
  }, [pet])

  // Debounced store sync (150ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      for (const key of ['suvMax', 'mtv', 'tlg'] as const) {
        const parsed = parsePetValue(rawInputs[key])
        if (parsed !== pet[key]) {
          setPetParam(key, parsed)
        }
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [rawInputs]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePetInput(key: keyof PetParameters, raw: string) {
    setRawInputs((prev) => ({ ...prev, [key]: raw }))
  }

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
            {petFields.map(({ key, label, hint, warningThreshold, warningLabel }) => {
              const value = pet[key]
              const showWarning = value !== null && value > warningThreshold
              return (
                <label key={key} className="cm-field">
                  {label}
                  <input
                    className={showWarning ? 'cm-input cm-input--warning' : 'cm-input'}
                    type="number"
                    step="0.1"
                    min="0"
                    value={rawInputs[key]}
                    onChange={(event) => handlePetInput(key, event.target.value)}
                    placeholder={hint}
                  />
                  {showWarning && (
                    <span className="cm-field-warning">{warningLabel}</span>
                  )}
                </label>
              )
            })}
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
