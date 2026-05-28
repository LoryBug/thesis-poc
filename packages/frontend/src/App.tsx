import { useUiStore } from './stores/ui.store'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { NewCase } from './pages/NewCase'
import { CaseDetail } from './pages/CaseDetail'
import { ExplainabilityGuide } from './pages/ExplainabilityGuide'

function App() {
  const page = useUiStore((s) => s.page)

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top left, rgba(15,139,141,0.12), transparent 32rem), linear-gradient(180deg, #eef4fb 0%, #f3f6fb 42%, #edf2f7 100%)' }}>
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
