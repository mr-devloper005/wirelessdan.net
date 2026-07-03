import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Fleet-flavored task surfaces.

  Every task shares one cohesive visual language: soft off-white bg, coal ink,
  hairline lines, one saturated yellow accent, sharp corners. Per-task voice is
  carried by the kicker/note copy only.

  Tokens are delivered via CSS variables (`--tk-*`), consumed by archive +
  detail templates. Fonts and radii come from the shared display/body/mono
  faces set in editable-global.css.
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const FLEET_DISPLAY = "'Space Grotesk', 'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const FLEET_BODY = "'Geist', 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared Fleet palette — every task inherits this; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: FLEET_DISPLAY,
  fontBody: FLEET_BODY,
  bg: '#f2f2f2',
  surface: '#ffffff',
  raised: '#ececec',
  text: '#040404',
  muted: '#7a7a7a',
  line: '#e0e0e0',
  accent: '#fedb5b',
  accentSoft: '#fff4c9',
  onAccent: '#040404',
  glow: 'rgba(254,219,91,0.22)',
  radius: '0.25rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

/*
  Display labels (visible to users) — renamed per Fleet redesign:
  - listing → "Local Directory"
  - pdf     → "Reference Library"
  The underlying task keys stay `listing` and `pdf` (route paths unchanged).
*/
export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field Notes',
    note: 'Long-form essays, dispatches and long reads worth your time.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Verified places, operators and services — organized for real-world use.',
  },
  classified: {
    ...base,
    kicker: 'Notice Board',
    note: 'Fast-moving offers, gear and time-sensitive posts.',
  },
  image: {
    ...base,
    kicker: 'Field Gallery',
    note: 'A visual archive of standout photography and image-led stories.',
  },
  sbm: {
    ...base,
    kicker: 'Saved Signals',
    note: 'Curated tools, links and references worth keeping close.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Downloadable guides, reports and research from the field.',
  },
  profile: {
    ...base,
    kicker: 'People',
    note: 'The operators, brands and voices behind the platform.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.text,
    '--slot4-accent-fill': t.text,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
