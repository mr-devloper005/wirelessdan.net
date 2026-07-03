import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

/*
  Fleet-flavored brand config.
  Monochrome + a single saturated yellow accent (`#fedb5b`).
  Everything else in the visual system derives from --fl-* tokens set in
  design-contract.ts, so downstream cards/pages never hardcode these values.
*/
export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#040404',
    surface: '#f2f2f2',
    highlight: '#fedb5b',
  },
} as const
