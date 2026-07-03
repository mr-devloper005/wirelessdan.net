import type { CSSProperties } from 'react'

/*
  Fleet-flavored design contract.

  All tokens flow from CSS variables set here. Downstream components consume
  them via `dc.*` / `pal.*` — nothing in JSX should hardcode Fleet's palette
  or fonts directly.
*/

export const editableRootStyle = {
  // Fleet palette — monochrome + one yellow accent (#fedb5b).
  '--slot4-page-bg': '#f2f2f2',
  '--slot4-page-text': '#040404',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#7a7a7a',
  '--slot4-soft-muted-text': '#9e9e9e',
  '--slot4-accent': '#040404',
  '--slot4-accent-fill': '#040404',
  '--slot4-accent-soft': '#ececec',
  '--slot4-on-accent': '#ffffff',
  '--slot4-highlight': '#fedb5b',
  '--slot4-highlight-soft': '#fff4c9',
  '--slot4-on-highlight': '#040404',
  '--slot4-dark-bg': '#0b0b0c',
  '--slot4-dark-text': '#f5f5f5',
  '--slot4-media-bg': '#ececec',
  '--slot4-cream': '#f7f7f5',
  '--slot4-warm': '#ffffff',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#ececec',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f2f2f2',
  '--editable-page-text': '#040404',
  '--editable-container': '1500px',
  '--editable-border': '#e0e0e0',
  '--editable-nav-bg': '#f2f2f2',
  '--editable-nav-text': '#040404',
  '--editable-nav-active': '#040404',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#040404',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0b0b0c',
  '--editable-footer-text': '#f5f5f5',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-page-text)]',
  accentBg: 'bg-[var(--slot4-highlight)]',
  accentSoftBg: 'bg-[var(--slot4-highlight-soft)]',
  accentSoftText: 'text-[var(--slot4-highlight)]',
  onAccentText: 'text-[var(--slot4-on-highlight)]',
  highlightBg: 'bg-[var(--slot4-highlight)]',
  onHighlight: 'text-[var(--slot4-on-highlight)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_28px_60px_rgba(4,4,4,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(4,4,4,0.05),rgba(4,4,4,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-24 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[300px] shrink-0 snap-start sm:w-[340px]',
  },
  type: {
    eyebrow:
      "editable-mono editable-eyebrow-plus text-[0.72rem] font-medium tracking-[0.22em] text-[var(--slot4-page-text)]",
    heroTitle:
      'editable-display text-[2.75rem] font-medium leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[7.5rem]',
    sectionTitle:
      'editable-display text-4xl font-medium leading-[1.0] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]',
    body: 'text-[1rem] leading-[1.65] sm:text-[1.05rem]',
    emphasis: 'editable-display text-2xl leading-tight tracking-[-0.03em] sm:text-3xl',
  },
  surface: {
    card:
      "relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]",
    soft: `border border-[var(--editable-border)] ${editablePalette.panelBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    // Fleet buttons: soft-corner rectangle (~4px), heavier padding, mono-y label.
    primary:
      "inline-flex items-center justify-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-on-accent)] transition duration-300 hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)] active:scale-[0.98]",
    secondary:
      "inline-flex items-center justify-center gap-2 rounded-[4px] border border-[var(--slot4-page-text)] bg-transparent px-6 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)] active:scale-[0.98]",
    accent:
      "inline-flex items-center justify-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)] active:scale-[0.98]",
    ghost:
      "inline-flex items-center justify-center gap-1.5 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-page-text)] transition duration-300 hover:opacity-70",
  },
  badge: {
    pill: 'inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] editable-mono',
    accentPill: 'inline-flex items-center gap-1 rounded-full bg-[var(--slot4-highlight)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-on-highlight)] editable-mono',
  },
  media: {
    frame: `relative overflow-hidden ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg} rounded-none`,
    ratio: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-0.5',
    fade: 'transition duration-500 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide, structured grids with generous section rhythm — Fleet is deliberate, not dense.',
  'Yellow accent (#fedb5b) is reserved for the primary CTA and small highlights — never decorative.',
  'Section eyebrows use the mono face with a leading plus glyph (`editable-eyebrow-plus`).',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
