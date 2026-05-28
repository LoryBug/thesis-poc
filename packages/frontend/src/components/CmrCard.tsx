import { useCaseStore } from '../stores/case.store'
import { calculateCmrScore, CMR_CUTOFF, CMR_MAX } from '@cm-dss/core'
import type { CmrFeatures } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'

const features: { key: keyof CmrFeatures; title: string; description: string; points: number }[] = [
  { key: 'infiltration', title: 'Infiltration', description: 'Disruption or extension into adjacent tissues.', points: 2 },
  { key: 'firstPassPerfusion', title: 'First-pass contrast perfusion', description: 'Mass perfusion after gadolinium administration.', points: 2 },
  { key: 'pericardialEffusion', title: 'Pericardial effusion', description: 'More than mild, or mild after pericardiocentesis.', points: 1 },
  { key: 'sessile', title: 'Sessile appearance', description: 'Direct wall attachment or broad base.', points: 1 },
  { key: 'polylobated', title: 'Polylobate shape', description: 'Two or more lobes on multiplanar assessment.', points: 1 },
  { key: 'heterogeneousEnhancement', title: 'Heterogeneity enhancement', description: 'Heterogeneous post-contrast enhancement pattern.', points: 1 },
]

export function CmrCard() {
  const cmr = useCaseStore((s) => s.cmr)
  const cmrAvailable = useCaseStore((s) => s.cmrAvailable)
  const setCmrAvailable = useCaseStore((s) => s.setCmrAvailable)
  const setCmrFeature = useCaseStore((s) => s.setCmrFeature)

  const score = cmrAvailable ? calculateCmrScore(cmr) : null
  const positive = score !== null && score >= CMR_CUTOFF

  return (
    <article className="cm-card" data-exam-card="cmr">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Cardiac magnetic resonance - CMR Mass Score</h2>
          <p>Integrates morphology and tissue characterization. Operational cutoff: CMR Mass Score &gt;= 5.</p>
        </div>
        <label className="cm-exam-toggle">
          <input
            type="checkbox"
            checked={cmrAvailable}
            onChange={(event) => setCmrAvailable(event.target.checked)}
          />
          CMR available
        </label>
      </div>

      {!cmrAvailable ? (
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
                checked={cmr[feature.key]}
                onChange={(value) => setCmrFeature(feature.key, value)}
              />
            ))}
          </div>

          <ScoreStrip
            score={score}
            max={CMR_MAX}
            note={`CMR Mass Score cutoff >= ${CMR_CUTOFF}. Current score: ${score}/8.`}
            badge={positive ? 'Positive' : 'Below cutoff'}
            level={positive ? 'high' : 'low'}
          />
        </>
      )}
    </article>
  )
}
