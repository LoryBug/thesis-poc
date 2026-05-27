import { create } from 'zustand'
import type { SavedCase } from '../lib/storage'
import { loadCases, saveCases } from '../lib/storage'

interface HistoryState {
  cases: SavedCase[]
  addCase: (c: SavedCase) => void
  removeCase: (id: string) => void
  clearAll: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  cases: loadCases(),

  addCase: (c) => {
    const updated = [c, ...get().cases]
    set({ cases: updated })
    saveCases(updated)
  },

  removeCase: (id) => {
    const updated = get().cases.filter((c) => c.id !== id)
    set({ cases: updated })
    saveCases(updated)
  },

  clearAll: () => {
    set({ cases: [] })
    saveCases([])
  },
}))
