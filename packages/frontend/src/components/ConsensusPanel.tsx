import type { ConsensusResult } from '@cm-dss/core'
import { DecisionCard } from './DecisionCard'

interface Props {
  result: ConsensusResult
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] p-5 border" style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)', boxShadow: '0 18px 40px rgba(23,59,104,0.12)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#607089' }}>{title}</p>
      {typeof children === 'string' ? (
        <p className="text-sm leading-relaxed" style={{ color: '#172033' }}>{children}</p>
      ) : (
        children
      )}
    </div>
  )
}

export function ConsensusPanel({ result }: Props) {
  return (
    <div className="space-y-4">
      <DecisionCard result={result} />

      <Section title="Spiegazione">
        {result.explanation}
      </Section>

      <Section title="Prossimo passo">
        {result.nextStep}
      </Section>

      <Section title="Evidenze">
        {result.evidence.length > 0 ? (
          <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#172033' }}>
            {result.evidence.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        ) : (
          <p className="text-sm italic" style={{ color: '#607089' }}>Nessuna evidenza generata.</p>
        )}
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([
          ['Ecocardiografia', result.modalities.echo],
          ['CMR', result.modalities.cmr],
          ['TC/PET', result.modalities.ctPet],
        ] as const).map(([label, mod]) => (
          <div key={label} className="rounded-[14px] p-4 border" style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'rgba(217,226,239,0.9)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#607089' }}>{label}</p>
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#173b68' }}>{mod.status}</p>
            <p className="text-xs" style={{ color: '#607089' }}>{mod.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
