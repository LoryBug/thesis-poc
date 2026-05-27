import { useUiStore } from './stores/ui.store'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { NewCase } from './pages/NewCase'
import { CaseDetail } from './pages/CaseDetail'

function App() {
  const page = useUiStore((s) => s.page)

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {page === 'home' && <Home />}
        {page === 'new' && <NewCase />}
        {page === 'detail' && <CaseDetail />}
      </main>
    </div>
  )
}

export default App
