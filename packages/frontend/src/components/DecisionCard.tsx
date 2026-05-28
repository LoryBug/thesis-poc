import type { ConsensusResult } from '@cm-dss/core'

interface Props {
  result: ConsensusResult
}

const riskStyles: Record<string, React.CSSProperties> = {
  high: {
    background: 'rgba(180,35,24,0.1)',
    borderColor: 'rgba(180,35,24,0.2)',
    color: '#b42318',
  },
  mid: {
    background: 'rgba(183,121,31,0.1)',
    borderColor: 'rgba(183,121,31,0.2)',
    color: '#b7791f',
  },
  low: {
    background: 'rgba(22,120,76,0.1)',
    borderColor: 'rgba(22,120,76,0.2)',
    color: '#16784c',
  },
  not: {
    background: 'rgba(217,226,239,0.3)',
    borderColor: 'rgba(217,226,239,0.9)',
    color: '#607089',
  },
}

export function DecisionCard({ result }: Props) {
  const s = riskStyles[result.risk] ?? riskStyles.not

  return (
    <div
      className="rounded-[18px] p-5 border"
      style={{
        ...s,
        boxShadow: '0 18px 40px rgba(23,59,104,0.12)',
        background: 'rgba(255,255,255,0.88)',
      }}
    >
      <div className="flex items-center gap-3 mb-1">
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
          style={{
            background: s.background,
            color: s.color,
            border: `2px solid ${s.color}`,
          }}
        >
          {result.risk === 'high' ? '!' : result.risk === 'mid' ? '?' : result.risk === 'low' ? '✓' : '–'}
        </span>
        <h3 className="font-bold text-lg tracking-tight" style={{ color: '#172033' }}>{result.title}</h3>
      </div>
      <p className="text-sm ml-11" style={{ color: '#607089' }}>{result.subtitle}</p>
    </div>
  )
}
