import { useEffect, useState } from 'react'
import { useUiStore } from './stores/ui.store'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { NewCase } from './pages/NewCase'
import { CaseDetail } from './pages/CaseDetail'
import { ExplainabilityGuide } from './pages/ExplainabilityGuide'
import { DisclaimerModal } from './components/DisclaimerModal'

function App() {
  const page = useUiStore((s) => s.page)
  const syncFromHistory = useUiStore((s) => s.syncFromHistory)
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: 'home', caseId: null }, '')
    }
    const handlePopstate = () => syncFromHistory()
    window.addEventListener('popstate', handlePopstate)
    return () => window.removeEventListener('popstate', handlePopstate)
  }, [syncFromHistory])

  useEffect(() => {
    const handleStorageError = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setStorageError(detail)
      setTimeout(() => setStorageError(null), 8000)
    }
    window.addEventListener('cm:storage-error', handleStorageError)
    return () => window.removeEventListener('cm:storage-error', handleStorageError)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top left, rgba(15,139,141,0.12), transparent 32rem), linear-gradient(180deg, #eef4fb 0%, #f3f6fb 42%, #edf2f7 100%)' }}>
      {storageError && (
        <div className="cm-storage-error-banner">{storageError}</div>
      )}
      <DisclaimerModal />
      <Header />
      <main>
        {page === 'home' && <Home />}
        {page === 'new' && <NewCase />}
        {page === 'detail' && <CaseDetail />}
        {page === 'guide' && <ExplainabilityGuide />}
      </main>
    </div>
  )
}

export default App
