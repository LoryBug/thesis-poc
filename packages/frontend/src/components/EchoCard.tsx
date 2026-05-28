import { useCaseStore } from '../stores/case.store'
import { calculateDemScore, demProbability, DEM_CUTOFF, DEM_MAX } from '@cm-dss/core'
import type { EchoFeatures } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'

const features: { key: keyof EchoFeatures; title: string; description: string; points: number }[] = [
  { key: 'infiltration', title: 'Infiltration', description: 'Extension into myocardium, pericardium, or neighboring tissues.', points: 2 },
  { key: 'polylobated', title: 'Polylobate mass', description: 'Two or more lobes with complex morphology.', points: 2 },
  { key: 'pericardialEffusion', title: 'Pericardial effusion', description: 'Moderate-severe or clinically significant.', points: 2 },
  { key: 'sessile', title: 'Sessile appearance', description: 'Broad base without a clear peduncle.', points: 1 },
  { key: 'inhomogeneity', title: 'Inhomogeneity', description: 'Heterogeneous echogenicity compared with myocardium.', points: 1 },
  { key: 'nonLeftLocation', title: 'Non-left localization', description: 'Right heart, pericardium, or great vessels.', points: 1 },
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
          <h2>Echocardiography - DEM Score</h2>
          <p>Weighted echocardiographic score for predicted malignancy in cardiac masses. Operational cutoff: DEM &gt;= 3.</p>
        </div>
        <label className="cm-exam-toggle">
          <input
            type="checkbox"
            checked={echoAvailable}
            onChange={(event) => setEchoAvailable(event.target.checked)}
          />
          Echocardiography available
        </label>
      </div>

      {!echoAvailable ? (
        <p className="text-sm italic" style={{ color: 'var(--cm-muted)' }}>Select availability to enter data.</p>
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
            note={`Estimated probability of malignancy: ${prob}% (DEM). ${positive ? 'Above cutoff.' : 'Below cutoff.'}`}
            badge={positive ? 'Positive' : 'Below cutoff'}
            level={positive ? 'high' : 'low'}
          />
        </>
      )}
    </article>
  )
}
