import { useState, useEffect } from 'react'
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

  useEffect(() => {
    store.reset()
    setResult(null)
  }, [])

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
    <div className="space-y-6 pb-8" style={{ maxWidth: '1320px', margin: '0 auto' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#0f223d' }}>Nuova Valutazione</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-sm font-semibold rounded-xl cursor-pointer"
            style={{ color: '#607089', border: '1px solid rgba(217,226,239,0.9)' }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-3 py-1.5 text-sm font-semibold rounded-xl cursor-pointer"
            style={{ color: '#245b94', border: '1px solid rgba(217,226,239,0.9)' }}
          >
            Indietro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6" style={{ maxWidth: '860px' }}>
        <EchoCard />
        <CmrCard />
        <CtPetCard />
      </div>

      <div className="flex justify-left" style={{ maxWidth: '860px' }}>
        <button
          type="button"
          onClick={handleRun}
          className="px-8 py-3 font-semibold text-white rounded-xl cursor-pointer transition-opacity"
          style={{ background: 'linear-gradient(135deg, #245b94, #173b68)' }}
        >
          Esegui Valutazione
        </button>
      </div>

      {result && (
        <div className="space-y-4" style={{ maxWidth: '860px' }}>
          <ConsensusPanel result={result} />
          <div className="flex justify-left gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 font-semibold text-white rounded-xl cursor-pointer"
              style={{ background: '#16784c' }}
            >
              Salva valutazione
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
