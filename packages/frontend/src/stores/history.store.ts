import { create } from 'zustand'
import type { SavedCase } from '../lib/storage'
import { loadCases, saveCases } from '../lib/storage'

interface HistoryState {
  cases: SavedCase[]
  addCase: (c: SavedCase) => void
  removeCase: (id: string) => void
  clearAll: () => void
}

export const useHistoryStore = create<HistoryState>((set) => ({
  cases: loadCases(),

  addCase: (c) =>
    set((s) => {
      const updated = [c, ...s.cases]
      saveCases(updated)
      return { cases: updated }
    }),

  removeCase: (id) =>
    set((s) => {
      const updated = s.cases.filter((c) => c.id !== id)
      saveCases(updated)
      return { cases: updated }
    }),

  clearAll: () => {
    set({ cases: [] })
    saveCases([])
  },
}))
