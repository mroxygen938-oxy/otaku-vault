export const LISTS = [
  {
    id: 'watching',
    name: 'Watching',
    tag: 'Currently watching',
    subtitle: 'Series you\'re actively following right now.',
    icon: 'play',
  },
  {
    id: 'completed',
    name: 'Completed',
    tag: 'Finished',
    subtitle: 'Every anime you\'ve wrapped up from start to finish.',
    icon: 'check',
  },
  {
    id: 'onHold',
    name: 'On Hold',
    tag: 'Paused',
    subtitle: 'Shelved for later — not forgotten, just parked.',
    icon: 'pause',
  },
  {
    id: 'planToWatch',
    name: 'Plan to Watch',
    tag: 'Up next',
    subtitle: 'Your future watch-list queue.',
    icon: 'bookmark',
  },
  {
    id: 'dropped',
    name: 'Dropped',
    tag: 'Dropped',
    subtitle: 'Didn\'t click? No shame — filed here.',
    icon: 'x',
  },
]

export const LIST_IDS = LISTS.map((l) => l.id)

export const listById = (id) => LISTS.find((l) => l.id === id)
