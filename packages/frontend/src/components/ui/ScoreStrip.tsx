import { RiskPill } from './RiskPill'

interface ScoreStripProps {
  score: number | null
  max: number
  note: string
  badge: string
  level?: 'low' | 'mid' | 'high' | 'not' | 'neutral'
}

export function ScoreStrip({ score, max, note, badge, level = 'neutral' }: ScoreStripProps) {
  const progress = score === null ? 0 : Math.min(100, (score / max) * 100)

  return (
    <div className="cm-score-strip">
      <div className="cm-score-number">
        {score ?? '—'}/{max}
      </div>
      <div>
        <div className="cm-score-bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="cm-score-note">{note}</div>
      </div>
      <RiskPill level={level}>{badge}</RiskPill>
    </div>
  )
}
