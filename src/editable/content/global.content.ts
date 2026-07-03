import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Global copy — kept intentionally short and industrial to match the Fleet
  reference. Navbar has NO task-page links; task discovery lives in the footer.
  Labels used in the footer discovery column come from taskThemes.
*/
export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A working index of directory places and reference documents',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Directory + reference index',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'A working index for the field.',
    description:
      'A no-frills index of verified places and reference-grade documents — organized so you can find what you need and get on with it.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listing' },
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Built for the field.',
  },
  commonLabels: {
    readMore: 'Open',
    viewAll: 'View all',
    explore: 'Browse',
    latest: 'Just added',
    related: 'Related entries',
    published: 'Filed',
  },
} as const
