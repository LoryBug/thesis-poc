import type { ConsensusResult } from '@cm-dss/core'
import { RiskPill } from './ui/RiskPill'

interface Props {
  result: ConsensusResult
}

const badgeByRisk: Record<ConsensusResult['risk'], string> = {
  high: 'Alta priorità',
  mid: 'Approfondire',
  low: 'Basso rischio',
  not: 'POC',
}

export function ConsensusPanel({ result }: Props) {
  const evidence = result.evidence.length > 0
    ? result.evidence
    : ['Nessuna evidenza generata.']

  return (
    <article className={`cm-card cm-decision ${result.risk === 'not' ? '' : result.risk}`}>
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2 className="cm-decision-title">{result.title}</h2>
          <p>{result.subtitle}</p>
        </div>
        <RiskPill level={result.risk}>{badgeByRisk[result.risk]}</RiskPill>
      </div>

      <p className="mt-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Spiegazione</p>
      <p className="cm-decision-text">{result.explanation}</p>

      <div className="cm-consensus-box" aria-label="Consenso multimodale">
        {([
          ['Eco', result.modalities.echo],
          ['CMR', result.modalities.cmr],
          ['TC/PET', result.modalities.ctPet],
          ['Integrato', result.integrated],
        ] as const).map(([label, modality]) => (
          <div key={label} className="cm-consensus-row">
            <span>{label}</span>
            <div>
              <strong>{modality.status}</strong>
              <small>{modality.note}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="cm-next-step">
        <strong>Prossimo passo</strong>
        <p>{result.nextStep}</p>
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--cm-muted)' }}>Evidenze</p>
      <ul className="cm-evidence-list">
        {evidence.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  )
}
