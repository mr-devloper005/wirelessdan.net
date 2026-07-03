import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Page copy tailored for a Local Directory + Reference Library platform.
  Tone follows the Fleet reference: industrial, plainspoken, confident, no
  saccharine SaaS filler and no fabricated testimonials.
*/
export const pagesContent = {
  home: {
    metadata: {
      title: 'A working index for the field',
      description:
        'Verified places and reference-grade documents, organized so you can find what you need and get on with it.',
      openGraphTitle: 'A working index for the field',
      openGraphDescription:
        'A Local Directory of verified places and a Reference Library of documents worth keeping close.',
      keywords: ['local directory', 'reference library', 'documents', 'verified places', 'field guide'],
    },
    hero: {
      badge: 'Home',
      title: ['A working index', 'for the field.'],
      description:
        'Two collections, one index. Browse the Local Directory for verified places, or the Reference Library for documents worth keeping close.',
      primaryCta: { label: 'Open Local Directory', href: '/listing' },
      secondaryCta: { label: 'Browse Reference Library', href: '/pdf' },
      searchPlaceholder: 'Search places, documents, categories',
      focusLabel: 'On the desk',
      featureCardBadge: 'Just added',
      featureCardTitle: 'The newest entry keeps the front page honest.',
      featureCardDescription:
        'The most recent addition to the index takes the top spot until something better lands.',
    },
    intro: {
      badge: 'What we do',
      title:
        'We keep two collections in shape — a Local Directory of verified places and a Reference Library of documents worth citing.',
      paragraphs: [
        'This is not a discovery feed. It is an index — organized around the work of finding a real place or a real document without having to sort through noise.',
        'Every entry earns its place through structured metadata, category, and (where relevant) location or file details, so the collection stays useful as it grows.',
        'Whether you land on a directory record or a reference file, everything else on the platform is one step away.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A directory with the operator details you actually need — address, phone, hours, links.',
        'A reference library with document previews, filesize, and download-ready files.',
        'Category filters and a keyword search across both collections.',
        'A predictable rhythm — no autoplay, no dark patterns, no infinite scroll.',
      ],
      primaryLink: { label: 'Open Local Directory', href: '/listing' },
      secondaryLink: { label: 'Browse Reference Library', href: '/pdf' },
    },
    cta: {
      badge: "Let's get started",
      title: 'Delivering excellence, one entry at a time.',
      description:
        'Open a collection, or send us the entry we should add next. We treat every submission as a working record, not a lead.',
      primaryCta: { label: 'Open Local Directory', href: '/listing' },
      secondaryCta: { label: 'Contact the desk', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'The most recent entries filed to this collection.',
    },
  },
  about: {
    badge: 'About',
    title: `${slot4BrandConfig.siteName} is a working index — not a discovery feed.`,
    description: `${slot4BrandConfig.siteName} maintains two collections: a Local Directory of verified places and a Reference Library of documents worth keeping close. Both are organized for real-world use.`,
    paragraphs: [
      'The site is built around the assumption that visitors already know what kind of thing they are looking for — a place, or a reference. Everything else is subordinated to that.',
      'We prefer clean metadata over glossy marketing copy. Every entry earns its place through structured details, and every category is chosen to make the collection more findable, not more populated.',
    ],
    values: [
      {
        title: 'Structured over decorative',
        description:
          'Every entry lists the details that matter — address and phone for a place, filesize and pages for a document. Fluff is trimmed.',
      },
      {
        title: 'Two collections, one index',
        description:
          'The Local Directory and Reference Library sit side by side under the same search and category system so you rarely need to switch modes.',
      },
      {
        title: 'Kept honest by use',
        description:
          'Records are refreshed as they are read, downloaded and cited. Anything that stops earning its place gets archived.',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact desk',
    title: 'Send us a place, a document, or a correction.',
    description:
      'The contact desk is the same channel we use for directory submissions, reference-library additions, and factual corrections. Tell us which you have.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search across the Local Directory and Reference Library.',
    },
    hero: {
      badge: 'Search',
      title: 'Find a place or a document, fast.',
      description:
        'One field, two collections. Search by category, keyword, or title across everything currently filed.',
      placeholder: 'Search places, documents, categories, tags',
    },
    resultsTitle: 'Latest across the index',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a new entry to the index.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit a new entry.',
      description:
        'Use your account to open the submission workspace and add a place to the Local Directory or a document to the Reference Library.',
    },
    hero: {
      badge: 'Submission desk',
      title: 'Add a new entry to the index.',
      description:
        'Pick the collection, fill in the structured details, and file the record. New submissions land in review before they are indexed.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Entry filed. Thanks for the submission.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the index.',
      badge: 'Contributor access',
      title: 'Sign in to keep filing.',
      description:
        'Sign in to submit new entries, track your contributions, and pick up where you left off.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Get started first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Get started',
    },
    signup: {
      metadataDescription: 'Get started on the index.',
      badge: 'Get started',
      title: 'Open a contributor account.',
      description:
        'Contributor accounts unlock the submission workspace so you can add new places or reference documents.',
      formTitle: 'Get started',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account opened. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related dispatches',
      fallbackTitle: 'Entry details',
    },
    listing: {
      relatedTitle: 'More from the Local Directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Visual entry',
    },
    profile: {
      relatedTitle: 'Related profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
