import type { ConsensusResult } from '@cm-dss/core'
import { DecisionCard } from './DecisionCard'

interface Props {
  result: ConsensusResult
}

export function ConsensusPanel({ result }: Props) {
  return (
    <div className="space-y-4">
      <DecisionCard result={result} />

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Spiegazione</h4>
        <p className="text-sm text-gray-600">{result.explanation}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Prossimo passo</h4>
        <p className="text-sm text-gray-600">{result.nextStep}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Evidenze</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {result.evidence.length > 0 ? (
            result.evidence.map((e, i) => <li key={i}>{e}</li>)
          ) : (
            <li className="italic text-gray-400">Nessuna evidenza generata.</li>
          )}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-50 rounded p-3 border">
          <h5 className="font-medium text-gray-700 mb-1">Ecocardiografia</h5>
          <p className="text-xs text-gray-500">{result.modalities.echo.status}</p>
          <p className="text-xs text-gray-400 mt-1">{result.modalities.echo.note}</p>
        </div>
        <div className="bg-gray-50 rounded p-3 border">
          <h5 className="font-medium text-gray-700 mb-1">CMR</h5>
          <p className="text-xs text-gray-500">{result.modalities.cmr.status}</p>
          <p className="text-xs text-gray-400 mt-1">{result.modalities.cmr.note}</p>
        </div>
        <div className="bg-gray-50 rounded p-3 border">
          <h5 className="font-medium text-gray-700 mb-1">TC/PET</h5>
          <p className="text-xs text-gray-500">{result.modalities.ctPet.status}</p>
          <p className="text-xs text-gray-400 mt-1">{result.modalities.ctPet.note}</p>
        </div>
      </div>
    </div>
  )
}
