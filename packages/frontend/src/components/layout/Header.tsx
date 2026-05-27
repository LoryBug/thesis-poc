import { useUiStore } from '../../stores/ui.store'

export function Header() {
  const { page, navigate } = useUiStore()

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1
          className="text-xl font-bold cursor-pointer select-none"
          onClick={() => navigate('home')}
        >
          Cardiac Mass DSS
        </h1>
        <nav className="flex gap-4">
          <button
            type="button"
            className={`px-3 py-1 rounded cursor-pointer ${page === 'home' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
            onClick={() => navigate('home')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded cursor-pointer ${page === 'new' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
            onClick={() => navigate('new')}
          >
            Nuova Valutazione
          </button>
        </nav>
      </div>
    </header>
  )
}
