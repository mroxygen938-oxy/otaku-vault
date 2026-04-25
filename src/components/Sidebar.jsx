import { LISTS } from '../lib/lists.js'
import { ICON_MAP } from '../lib/iconMap.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function Sidebar({ activeList, onSelect, counts, theme, onTheme, totalCount }) {
  return (
    <aside className="sidebar glass">
      <div className="brand">
        <div className="brand-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 18L12 4l7 14H5z"
              fill="white"
              stroke="white"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="15" r="1.8" fill="#0b0b14" />
          </svg>
        </div>
        <div>
          <div className="brand-title">Otaku Vault</div>
          <div className="brand-subtitle">Your anime library</div>
        </div>
      </div>

      <nav className="nav" aria-label="Lists">
        <div className="nav-section">Library</div>
        <button
          type="button"
          className={`nav-item ${activeList === 'all' ? 'active' : ''}`}
          onClick={() => onSelect('all')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span>All Anime</span>
          <span className="nav-count">{totalCount}</span>
        </button>

        <div className="nav-section">Lists</div>
        {LISTS.map((list) => {
          const Icon = ICON_MAP[list.icon]
          return (
            <button
              key={list.id}
              type="button"
              className={`nav-item ${activeList === list.id ? 'active' : ''}`}
              onClick={() => onSelect(list.id)}
            >
              <span className="nav-icon">
                <Icon />
              </span>
              <span>{list.name}</span>
              <span className="nav-count">{counts[list.id] ?? 0}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle theme={theme} onChange={onTheme} />
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-3)' }}>
          v1.0
        </div>
      </div>
    </aside>
  )
}
