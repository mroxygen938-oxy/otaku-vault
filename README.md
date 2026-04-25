# Otaku Vault

A glassmorphic anime list manager built with React + Vite. Track every anime you're watching, completed, on hold, plan to watch, or dropped — all stored locally in your browser.

**Live demo:** https://dist-iaqwegyw.devinapps.com

## Features

- **5 lists** — Watching, Completed, On Hold, Plan to Watch, Dropped, plus an "All Anime" view.
- **Photo uploads** — drop in a cover image; auto-downscaled to keep `localStorage` lean.
- **Episode tracker** — `+` / `−` buttons with a live progress bar on every card.
- **Smart auto-moves** — finishing the last episode auto-moves an anime to *Completed*; starting a *Plan to Watch* anime auto-moves it to *Watching*.
- **Quick move popover** — shuffle any anime between lists in one click.
- **Edit & remove** any anime, with confirmation toasts.
- **Search** across title, studio, and notes.
- **Light & dark themes** with an animated toggle.
- **Glass UI** — frosted panels, ambient aurora background, noise texture, hover lift, rise-in animations.
- **Fully responsive** — sidebar collapses on mobile.
- **Zero backend** — everything persists in `localStorage`.

## Tech stack

- React 19 + Vite 8
- Plain CSS (CSS variables for theming, `backdrop-filter` for the glass)
- No external UI libraries

## Run locally

```bash
npm install
npm run dev
```

Build a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── App.jsx                  # main app shell, state, persistence
├── main.jsx                 # React entry
├── components/
│   ├── Sidebar.jsx          # left nav with list counts + theme toggle
│   ├── AnimeCard.jsx        # cover art, episode tracker, quick actions
│   ├── AnimeModal.jsx       # add / edit form with image upload
│   ├── MovePopover.jsx      # "move to list" floating menu
│   └── ThemeToggle.jsx      # animated light/dark switch
├── lib/
│   ├── lists.js             # list definitions
│   ├── icons.jsx            # inline SVG icon components
│   ├── iconMap.js           # list-id → icon mapping
│   └── storage.js           # useLocalStorage hook + uid()
└── styles/
    └── index.css            # the entire glass UI system
```

## Storage

Three `localStorage` keys are used:

- `otaku-vault/animes/v1` — array of anime entries
- `otaku-vault/theme` — `"dark"` or `"light"`
- `otaku-vault/active-list` — last-selected list

Clear them in DevTools to reset the app.
