import type { RiskLevel } from '@cm-dss/core'

type PillLevel = RiskLevel | 'gray' | 'discordant' | 'positive' | 'neutral'

const classByLevel: Record<string, string> = {
  high: 'high',
  positive: 'high',
  mid: 'mid',
  gray: 'mid',
  discordant: 'mid',
  low: 'low',
  not: 'not',
  neutral: '',
}

interface RiskPillProps {
  level?: PillLevel
  children: React.ReactNode
}

export function RiskPill({ level = 'neutral', children }: RiskPillProps) {
  const levelClass = classByLevel[level] ?? ''
  return <span className={`cm-pill${levelClass ? ` ${levelClass}` : ''}`}>{children}</span>
}
