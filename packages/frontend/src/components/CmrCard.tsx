import { useCaseStore } from '../stores/case.store'
import { calculateCmrScore, CMR_CUTOFF, CMR_MAX } from '@cm-dss/core'
import type { CmrFeatures } from '@cm-dss/core'
import { FeatureTile } from './ui/FeatureTile'
import { ScoreStrip } from './ui/ScoreStrip'

const features: { key: keyof CmrFeatures; title: string; description: string; points: number }[] = [
  { key: 'infiltration', title: 'Infiltrazione', description: 'Disruption o estensione nei tessuti adiacenti.', points: 2 },
  { key: 'firstPassPerfusion', title: 'Perfusione first-pass', description: 'Perfusione della massa dopo gadolinio.', points: 2 },
  { key: 'pericardialEffusion', title: 'Versamento pericardico', description: 'Più che lieve o post-pericardiocentesi.', points: 1 },
  { key: 'sessile', title: 'Sessile (base larga)', description: 'Impianto diretto su parete o base larga.', points: 1 },
  { key: 'polylobated', title: 'Polilobato', description: 'Due o più lobi alla valutazione multiplanare.', points: 1 },
  { key: 'heterogeneousEnhancement', title: 'Enhancement eterogeneo', description: 'Pattern disomogeneo post-contrasto.', points: 1 },
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
          <h2>Risonanza magnetica - CMR Mass Score</h2>
          <p>Integra morfologia e caratterizzazione tissutale. Cutoff operativo: CMR Mass Score ≥ 5.</p>
        </div>
        <label className="cm-exam-toggle">
          <input
            type="checkbox"
            checked={cmrAvailable}
            onChange={(event) => setCmrAvailable(event.target.checked)}
          />
          CMR disponibile
        </label>
      </div>

      {!cmrAvailable ? (
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
                checked={cmr[feature.key]}
                onChange={(value) => setCmrFeature(feature.key, value)}
              />
            ))}
          </div>

          <ScoreStrip
            score={score}
            max={CMR_MAX}
            note={`Cutoff CMR Mass Score ≥ ${CMR_CUTOFF}. Score corrente: ${score}/8.`}
            badge={positive ? 'POSITIVO' : 'sotto cutoff'}
            level={positive ? 'high' : 'low'}
          />
        </>
      )}
    </article>
  )
}
