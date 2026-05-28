import { useCaseStore } from '../stores/case.store'
import { calculateDemScore, demProbability, DEM_CUTOFF, DEM_MAX } from '@cm-dss/core'
import type { EchoFeatures } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'

const features: { key: keyof EchoFeatures; title: string; description: string; points: number }[] = [
  { key: 'infiltration', title: 'Infiltrazione', description: 'Estensione in miocardio/pericardio o tessuti vicini.', points: 2 },
  { key: 'polylobated', title: 'Polilobato', description: 'Due o più lobi, morfologia complessa.', points: 2 },
  { key: 'pericardialEffusion', title: 'Versamento pericardico', description: 'Moderato/severo o clinicamente significativo.', points: 2 },
  { key: 'sessile', title: 'Sessile (base larga)', description: 'Base larga, assenza di peduncolo evidente.', points: 1 },
  { key: 'inhomogeneity', title: 'Inomogeneità', description: 'Ecogenicità eterogenea rispetto al miocardio.', points: 1 },
  { key: 'nonLeftLocation', title: 'Localizzazione non a sinistra', description: 'Cuore destro, pericardio o grossi vasi.', points: 1 },
]

export function EchoCard() {
  const echo = useCaseStore((s) => s.echo)
  const echoAvailable = useCaseStore((s) => s.echoAvailable)
  const setEchoAvailable = useCaseStore((s) => s.setEchoAvailable)
  const setEchoFeature = useCaseStore((s) => s.setEchoFeature)

  const score = echoAvailable ? calculateDemScore(echo) : null
  const prob = score !== null ? demProbability(score) : null
  const positive = score !== null && score >= DEM_CUTOFF

  return (
    <article className="cm-card" data-exam-card="echo">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Ecocardiografia - DEM Score</h2>
          <p>Score ecocardiografico pesato per sospetto di malignità. Cutoff operativo: DEM ≥ 3.</p>
        </div>
        <label className="cm-exam-toggle">
          <input
            type="checkbox"
            checked={echoAvailable}
            onChange={(event) => setEchoAvailable(event.target.checked)}
          />
          Eco disponibile
        </label>
      </div>

      {!echoAvailable ? (
        <p className="text-sm italic" style={{ color: 'var(--cm-muted)' }}>Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <>
          <div className="cm-feature-grid">
            {features.map((feature) => (
              <FeatureTile
                key={feature.key}
                title={feature.title}
                description={feature.description}
                points={feature.points}
                checked={echo[feature.key]}
                onChange={(value) => setEchoFeature(feature.key, value)}
              />
            ))}
          </div>

          <ScoreStrip
            score={score}
            max={DEM_MAX}
            note={`Probabilità stimata: ${prob}% (DEM). ${positive ? 'Sopra cutoff.' : 'Sotto cutoff.'}`}
            badge={positive ? 'POSITIVO' : 'sotto cutoff'}
            level={positive ? 'high' : 'low'}
          />
        </>
      )}
    </article>
  )
}
