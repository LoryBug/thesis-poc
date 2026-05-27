import { useState } from 'react'
import { evaluateConsensus } from '@cm-dss/core'
import type { ImagingData, ConsensusResult } from '@cm-dss/core'
import { useCaseStore } from '../stores/case.store'
import { useHistoryStore } from '../stores/history.store'
import { useUiStore } from '../stores/ui.store'
import { EchoCard } from '../components/EchoCard'
import { CmrCard } from '../components/CmrCard'
import { CtPetCard } from '../components/CtPetCard'
import { ConsensusPanel } from '../components/ConsensusPanel'

export function NewCase() {
  const [result, setResult] = useState<ConsensusResult | null>(null)
  const store = useCaseStore()
  const addCase = useHistoryStore((s) => s.addCase)
  const navigate = useUiStore((s) => s.navigate)

  function handleRun() {
    const data: ImagingData = store.toImagingData()
    const res = evaluateConsensus(data)
    setResult(res)
  }

  function handleSave() {
    if (!result) return
    const data = store.toImagingData()
    addCase({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      imagingData: data,
      result,
    })
    navigate('home')
  }

  function handleReset() {
    store.reset()
    setResult(null)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Nuova Valutazione</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 cursor-pointer"
          >
            Indietro
          </button>
        </div>
      </div>

      <EchoCard />
      <CmrCard />
      <CtPetCard />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleRun}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg cursor-pointer"
        >
          Esegui Valutazione
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <ConsensusPanel result={result} />
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            >
              Salva valutazione
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
