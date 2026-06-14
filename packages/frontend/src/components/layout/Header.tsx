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
      <div className="cm-header-inner">
        <h1
          className="cm-header-title"
          onClick={() => navigate('home')}
        >
          Cardiac Mass DSS
        </h1>
        <nav className="cm-header-nav">
          {([
            { page: 'home', label: 'Dashboard' },
            { page: 'new', label: 'New Evaluation' },
            { page: 'guide', label: 'Guide' },
          ] as const).map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => navigate(item.page)}
              className="cm-header-btn"
              style={{ background: page === item.page ? 'rgba(255,255,255,0.15)' : 'transparent' }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
