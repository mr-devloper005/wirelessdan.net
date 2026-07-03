import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/*
  Fleet-flavored post cards. Signatures preserved for downstream consumers.

  Visual language:
  - Flat surfaces, hairline bottom border (no drop shadow).
  - Image on top with the aspect ratio Fleet uses (16:9 hero, 4:3 editorial).
  - Mono uppercase kicker with plus-glyph, big Space Grotesk display title.
  - Subdued hover: image scales gently, headline underline offset shifts.
*/

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content =
    post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content =
    post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content =
    post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured dispatch',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  return (
    <Link
      href={href}
      className={`group relative block min-w-0 overflow-hidden ${pal.darkBg} ${pal.darkText}`}
    >
      <div className="relative min-h-[520px] p-8 lg:min-h-[640px] lg:p-12">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.05)_0%,rgba(4,4,4,0.85)_75%)]" />
        <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-between lg:min-h-[600px]">
          <span className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-white/80">
            {label}
          </span>
          <div>
            <h3 className="editable-display max-w-3xl text-4xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-[4.5rem]">
              {post.title}
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              {getEditableExcerpt(post, 190)}
            </p>
            <span className="editable-mono mt-10 inline-flex w-fit items-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-500 group-hover:bg-white group-hover:text-[var(--slot4-dark-bg)]">
              Open story <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-0.5`}
    >
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <span className="editable-mono absolute left-4 top-4 rounded-[3px] bg-[var(--slot4-page-text)] px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-[var(--slot4-on-accent)]">
          {String(index + 1).padStart(2, '0')} /
        </span>
      </div>
      <div className="p-6">
        <p className="editable-mono editable-eyebrow-plus text-[0.68rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
          {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-3 line-clamp-3 text-[1.35rem] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[0.9rem] leading-6 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 120)}
        </p>
        <span className="editable-mono mt-6 inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.18em] text-[var(--slot4-page-text)]">
          Read <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 grid-cols-[auto_1fr] gap-5 border-b border-[var(--editable-border)] py-6 transition duration-500 hover:bg-[var(--slot4-surface-bg)]"
    >
      <span className="editable-mono w-14 shrink-0 text-[0.75rem] tracking-[0.18em] text-[var(--slot4-muted-text)]">
        {String(index + 1).padStart(2, '0')} /
      </span>
      <div className="min-w-0">
        <p className="editable-mono text-[0.68rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
          {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-2 line-clamp-2 text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-[var(--slot4-page-text)] transition group-hover:opacity-70">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.92rem] leading-6 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 130)}
        </p>
      </div>
    </Link>
  )
}

export function ArticleListCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 gap-8 border-b border-[var(--editable-border)] py-10 transition duration-500 sm:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-[5/4]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0">
        <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-[var(--slot4-page-text)] sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-5 line-clamp-3 text-[1rem] leading-7 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 210)}
        </p>
        <span className="editable-mono mt-6 inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]">
          Open dispatch <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
