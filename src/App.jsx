import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import AnimeCard from './components/AnimeCard.jsx'
import AnimeModal from './components/AnimeModal.jsx'
import MovePopover from './components/MovePopover.jsx'
import { LIST_IDS, LISTS, listById } from './lib/lists.js'
import { uid, useLocalStorage } from './lib/storage.js'
import { IconMenu, IconPlus, IconSearch, IconSparkle, IconX } from './lib/icons.jsx'

const STORAGE_KEY_ANIME = 'otaku-vault/animes/v1'
const STORAGE_KEY_THEME = 'otaku-vault/theme'
const STORAGE_KEY_LIST = 'otaku-vault/active-list'

const SAMPLE_ANIME = () => [
  {
    id: uid(),
    title: "Frieren: Beyond Journey's End",
    image: '',
    list: 'watching',
    totalEpisodes: 28,
    watchedEpisodes: 18,
    year: '2023',
    studio: 'Madhouse',
    rating: 5,
    notes: 'Slow, melancholic, gorgeous.',
    createdAt: Date.now() - 4000,
  },
  {
    id: uid(),
    title: 'Vinland Saga',
    image: '',
    list: 'completed',
    totalEpisodes: 48,
    watchedEpisodes: 48,
    year: '2019',
    studio: 'Wit / MAPPA',
    rating: 5,
    notes: '',
    createdAt: Date.now() - 3000,
  },
  {
    id: uid(),
    title: 'Mushoku Tensei',
    image: '',
    list: 'onHold',
    totalEpisodes: 23,
    watchedEpisodes: 11,
    year: '2021',
    studio: 'Bind',
    rating: 4,
    notes: '',
    createdAt: Date.now() - 2000,
  },
  {
    id: uid(),
    title: 'Dandadan',
    image: '',
    list: 'planToWatch',
    totalEpisodes: 12,
    watchedEpisodes: 0,
    year: '2024',
    studio: 'Science SARU',
    rating: 0,
    notes: '',
    createdAt: Date.now() - 1000,
  },
]

export default function App() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEY_THEME, 'dark')
  const [animes, setAnimes] = useLocalStorage(STORAGE_KEY_ANIME, SAMPLE_ANIME)
  const [activeList, setActiveList] = useLocalStorage(STORAGE_KEY_LIST, 'watching')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [movePopover, setMovePopover] = useState(null)
  const [toasts, setToasts] = useState([])
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const counts = useMemo(() => {
    const c = Object.fromEntries(LIST_IDS.map((id) => [id, 0]))
    for (const a of animes) c[a.list] = (c[a.list] ?? 0) + 1
    return c
  }, [animes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return animes
      .filter((a) => (activeList === 'all' ? true : a.list === activeList))
      .filter((a) => {
        if (!q) return true
        return (
          a.title.toLowerCase().includes(q) ||
          (a.studio || '').toLowerCase().includes(q) ||
          (a.notes || '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [animes, activeList, query])

  const listInfo = activeList === 'all'
    ? {
        id: 'all',
        name: 'All Anime',
        tag: 'Library',
        subtitle: 'Every series across every list in one glass shelf.',
      }
    : listById(activeList) || LISTS[0]

  const headerStats = useMemo(() => {
    const list = activeList === 'all' ? animes : animes.filter((a) => a.list === activeList)
    const totalEpisodes = list.reduce((sum, a) => sum + (Number(a.totalEpisodes) || 0), 0)
    const watchedEpisodes = list.reduce((sum, a) => sum + (Number(a.watchedEpisodes) || 0), 0)
    const avgRating = (() => {
      const rated = list.filter((a) => a.rating > 0)
      if (!rated.length) return 0
      return rated.reduce((s, a) => s + a.rating, 0) / rated.length
    })()
    return {
      titles: list.length,
      episodesWatched: watchedEpisodes,
      totalEpisodes,
      avgRating,
    }
  }, [animes, activeList])

  const toast = (msg) => {
    const id = uid()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400)
  }

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (anime) => {
    setEditing(anime)
    setModalOpen(true)
  }

  const saveAnime = (data) => {
    if (editing?.id) {
      setAnimes((a) => a.map((x) => (x.id === editing.id ? { ...x, ...data, id: editing.id } : x)))
      toast('Updated')
    } else {
      const entry = { ...data, id: uid(), createdAt: Date.now() }
      setAnimes((a) => [entry, ...a])
      setActiveList(entry.list)
      toast('Added to your library')
    }
    setModalOpen(false)
    setEditing(null)
  }

  const deleteAnime = (anime) => {
    setAnimes((a) => a.filter((x) => x.id !== anime.id))
    toast('Removed')
  }

  const moveAnime = (anime, listId) => {
    setAnimes((a) =>
      a.map((x) => {
        if (x.id !== anime.id) return x
        const patch = { list: listId }
        if (listId === 'completed' && x.totalEpisodes > 0) {
          patch.watchedEpisodes = x.totalEpisodes
        }
        return { ...x, ...patch }
      })
    )
    const list = listById(listId)
    toast(`Moved to ${list?.name}`)
    setMovePopover(null)
  }

  const increment = (anime) => {
    setAnimes((a) =>
      a.map((x) => {
        if (x.id !== anime.id) return x
        const total = Number(x.totalEpisodes) || 0
        const next = Number(x.watchedEpisodes || 0) + 1
        const clamped = total > 0 ? Math.min(next, total) : next
        const patch = { watchedEpisodes: clamped }
        if (total > 0 && clamped >= total && x.list !== 'completed') {
          patch.list = 'completed'
        } else if (clamped > 0 && x.list === 'planToWatch') {
          patch.list = 'watching'
        }
        return { ...x, ...patch }
      })
    )
  }

  const decrement = (anime) => {
    setAnimes((a) =>
      a.map((x) => {
        if (x.id !== anime.id) return x
        const next = Math.max(0, Number(x.watchedEpisodes || 0) - 1)
        return { ...x, watchedEpisodes: next }
      })
    )
  }

  const openQuickMove = (anime, anchorEl) => {
    const rect = anchorEl.getBoundingClientRect()
    setMovePopover({ anime, rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right } })
  }

  return (
    <div className="app">
      <div className="ambient" aria-hidden="true" />

      <div className={`sidebar-mobile-wrap ${mobileNavOpen ? 'open' : ''}`}>
        <Sidebar
          activeList={activeList}
          onSelect={(id) => {
            setActiveList(id)
            setMobileNavOpen(false)
          }}
          counts={counts}
          theme={theme}
          onTheme={setTheme}
          totalCount={animes.length}
        />
      </div>

      <main className="main">
        <div className="topbar glass">
          <button
            type="button"
            className="btn btn-icon btn-ghost mobile-sidebar-toggle"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <IconX /> : <IconMenu />}
          </button>
          <div className="search">
            <IconSearch />
            <input
              type="search"
              placeholder="Search your library…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search library"
            />
            {query && (
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                style={{ width: 24, height: 24 }}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <IconX />
              </button>
            )}
          </div>
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            <IconPlus />
            <span>Add anime</span>
          </button>
        </div>

        <section className="list-header glass">
          <div className="list-header-text">
            <span className="list-tag">{listInfo.tag}</span>
            <h1 className="list-title">{listInfo.name}</h1>
            <p className="list-subtitle">{listInfo.subtitle || 'Your curated anime shelf.'}</p>
          </div>
          <div className="list-stats">
            <div className="stat">
              <div className="stat-label">Titles</div>
              <div className="stat-value">{headerStats.titles}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Episodes</div>
              <div className="stat-value">
                {headerStats.episodesWatched}
                {headerStats.totalEpisodes > 0 ? (
                  <span style={{ color: 'var(--fg-3)', fontSize: 14, fontWeight: 500 }}>
                    {' / '}
                    {headerStats.totalEpisodes}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Avg Rating</div>
              <div className="stat-value">
                {headerStats.avgRating > 0 ? headerStats.avgRating.toFixed(1) : '—'}
              </div>
            </div>
          </div>
        </section>

        {filtered.length === 0 ? (
          <section className="empty glass">
            <div className="empty-icon">
              <IconSparkle />
            </div>
            <h2 className="empty-title">
              {query ? 'Nothing matches that search' : 'This shelf is empty'}
            </h2>
            <p className="empty-text">
              {query
                ? 'Try a different title, studio, or clear the search.'
                : 'Add your first anime to start building this list.'}
            </p>
            {!query && (
              <button type="button" className="btn btn-primary" onClick={openAdd}>
                <IconPlus />
                <span>Add your first anime</span>
              </button>
            )}
          </section>
        ) : (
          <section className="grid">
            {filtered.map((a) => (
              <AnimeCard
                key={a.id}
                anime={a}
                onIncrement={increment}
                onDecrement={decrement}
                onEdit={openEdit}
                onDelete={deleteAnime}
                onQuickMove={openQuickMove}
              />
            ))}
          </section>
        )}
      </main>

      <AnimeModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={saveAnime}
      />

      {movePopover && (
        <MovePopover
          anchorRect={movePopover.rect}
          currentList={movePopover.anime.list}
          onSelect={(listId) => moveAnime(movePopover.anime, listId)}
          onClose={() => setMovePopover(null)}
        />
      )}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="toast-dot" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
