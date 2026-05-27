import type { ConsensusResult } from '@cm-dss/core'

interface Props {
  result: ConsensusResult
}

const riskColors: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  mid: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  not: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
}

export function DecisionCard({ result }: Props) {
  const colors = riskColors[result.risk] ?? riskColors.not

  return (
    <div className={`rounded-lg border-2 p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">
          {result.risk === 'high' ? '🔴' : result.risk === 'mid' ? '🟡' : result.risk === 'low' ? '🟢' : '⚪'}
        </span>
        <h3 className={`font-bold text-lg ${colors.text}`}>{result.title}</h3>
      </div>
      <p className={`text-sm ${colors.text} mb-2`}>{result.subtitle}</p>
    </div>
  )
}
