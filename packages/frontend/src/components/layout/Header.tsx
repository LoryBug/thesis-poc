import { useUiStore } from '../../stores/ui.store'

export function Header() {
  const page = useUiStore((s) => s.page)
  const navigate = useUiStore((s) => s.navigate)

  return (
    <header
      className="text-white"
      style={{
        background: 'linear-gradient(135deg, #10233e, #173b68)',
        borderRadius: '0 0 18px 18px',
        boxShadow: '0 18px 40px rgba(23, 59, 104, 0.12)',
      }}
    >
      <div className="flex items-center justify-between" style={{ maxWidth: '1320px', margin: '0 auto', padding: '16px 16px' }}>
        <h1
          className="text-xl font-bold cursor-pointer select-none tracking-tight"
          onClick={() => navigate('home')}
        >
          Cardiac Mass DSS
        </h1>
        <nav className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-3 py-1.5 rounded text-sm font-semibold cursor-pointer transition-opacity"
            style={{
              background: page === 'home' ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.03em',
            }}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('new')}
            className="px-3 py-1.5 rounded text-sm font-semibold cursor-pointer transition-opacity"
            style={{
              background: page === 'new' ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.03em',
            }}
          >
            New Evaluation
          </button>
          <button
            type="button"
            onClick={() => navigate('guide')}
            className="px-3 py-1.5 rounded text-sm font-semibold cursor-pointer transition-opacity"
            style={{
              background: page === 'guide' ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.03em',
            }}
          >
            Explainability Guide
          </button>
        </nav>
      </div>
    </header>
  )
}
