import type { ConsensusResult } from '@cm-dss/core'

interface CaseHeroProps {
  result: ConsensusResult
  demScore: number | null
  cmrScore: number | null
  ctScore: number | null
}

export function CaseHero({ result, demScore, cmrScore, ctScore }: CaseHeroProps) {
  return (
    <section className="cm-hero">
      <div className="cm-hero-main">
        <div className="cm-eyebrow">Proof of concept</div>
        <h1 className="cm-title-xl">Cardiac Mass Decision Support</h1>
        <p className="cm-lead">
          Prototype for applying diagnostic scores to cardiac masses, explaining clinical suspicion, and proposing the next imaging step.
        </p>
      </div>

      <aside className="cm-hero-side">
        <div className="cm-status-panel">
          <div className="cm-status-label">Integrated output</div>
          <div className="cm-status-value">{result.risk === 'not' ? 'Not evaluated' : result.title}</div>
          <div className="cm-status-subtitle">{result.subtitle}</div>
        </div>
        <div className="cm-mini-grid">
          <div className="cm-mini-stat"><strong>{demScore === null ? '-' : `${demScore}/9`}</strong><span>DEM</span></div>
          <div className="cm-mini-stat"><strong>{cmrScore === null ? '-' : `${cmrScore}/8`}</strong><span>CMR</span></div>
          <div className="cm-mini-stat"><strong>{ctScore === null ? '-' : `${ctScore}/8`}</strong><span>CT signs</span></div>
        </div>
      </aside>
    </section>
  )
}
