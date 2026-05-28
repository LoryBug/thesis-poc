import { create } from 'zustand'

export type Page = 'home' | 'new' | 'detail' | 'guide'

interface UiState {
  page: Page
  selectedCaseId: string | null
  navigate: (page: Page, caseId?: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  page: 'home',
  selectedCaseId: null,

  navigate: (page, caseId) => set({ page, selectedCaseId: page === 'detail' ? (caseId ?? null) : null }),
}))
