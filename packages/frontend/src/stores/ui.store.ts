import { create } from 'zustand'

export type Page = 'home' | 'new' | 'detail' | 'guide'

interface UiState {
  page: Page
  selectedCaseId: string | null
  navigate: (page: Page, caseId?: string) => void
  syncFromHistory: () => void
}

export const useUiStore = create<UiState>((set) => ({
  page: 'home',
  selectedCaseId: null,

  navigate: (page, caseId) => {
    const state = { page, caseId: caseId ?? null }
    window.history.pushState(state, '')
    set({ page, selectedCaseId: page === 'detail' ? (caseId ?? null) : null })
  },

  syncFromHistory: () => {
    const state = window.history.state as { page?: Page; caseId?: string | null } | null
    if (state?.page) {
      set({ page: state.page, selectedCaseId: state.caseId ?? null })
    } else {
      set({ page: 'home', selectedCaseId: null })
    }
  },
}))
