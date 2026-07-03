import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Task-page voices. Renamed pair:
    listing → "Local Directory"
    pdf     → "Reference Library"
  Underlying task keys unchanged; route paths unchanged.
*/
export const taskPageVoices = {
  article: {
    eyebrow: 'Field Notes',
    headline: 'Long-form dispatches and long-read essays from the desk.',
    description:
      'Long-form entries that sit between the directory and the reference library — context, background, and interpretation.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Long reads earn hierarchy and space, not marketing decoration.',
    chips: ['Editorial pace', 'Deep reads', 'Categorized'],
  },
  classified: {
    eyebrow: 'Notice Board',
    headline: 'Time-sensitive offers, fixtures and gear that move fast.',
    description:
      'The notice board is the fastest-moving collection. Every entry is action-oriented and short-lived by design.',
    filterLabel: 'Filter notice',
    secondaryNote: 'Urgency over prose. Short summaries, direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action-ready'],
  },
  sbm: {
    eyebrow: 'Saved Signals',
    headline: 'Curated links and tools worth keeping within reach.',
    description:
      'Signals are the third-party references we keep bookmarked — tools, primary sources, single-page utilities.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources; grouped by purpose, not by feed.',
    chips: ['Collections', 'Tools', 'References'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'The operators and voices behind the index.',
    description:
      'Profiles collect the people, teams and brands who contribute to the directory or write for the desk.',
    filterLabel: 'Filter people',
    secondaryNote: 'Identity and credibility surface before the grid.',
    chips: ['Contributors', 'Operators', 'Voices'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Reference documents, guides and reports for the field.',
    description:
      'The Reference Library is the citable half of the platform — briefings, guides and research files, each with a preview and a download.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Structured metadata, previewable files, quick download.',
    chips: ['Reference-grade', 'Guides', 'Reports'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Verified places, operators and services — indexed for real use.',
    description:
      'The Local Directory is the working half of the platform — real addresses, hours, and contact details, kept honest by regular review.',
    filterLabel: 'Filter category',
    secondaryNote: 'Real details over marketing copy. Address, phone, hours.',
    chips: ['Directory', 'Verified', 'Location-first'],
  },
  image: {
    eyebrow: 'Field Gallery',
    headline: 'Image-led entries with a gallery-first rhythm.',
    description:
      'Visual entries let the imagery do the talking — portfolio pieces, field photography and long-form visual reports.',
    filterLabel: 'Filter gallery',
    secondaryNote: 'Images lead; text follows.',
    chips: ['Gallery', 'Visual-first', 'Portfolio'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
