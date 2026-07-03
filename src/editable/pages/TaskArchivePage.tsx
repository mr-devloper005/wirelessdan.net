import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronDown,
  Download,
  Globe,
  MapPin,
  Phone,
  Search,
  UserRound,
  Building2,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(
    post.summary ||
      asText(getContent(post).description) ||
      asText(getContent(post).excerpt) ||
      asText(getContent(post).body),
  )
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-0',
  listing: 'grid gap-0 lg:grid-cols-2',
  classified: 'grid gap-0 sm:grid-cols-2',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-0 md:grid-cols-2',
  pdf: 'grid gap-10 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const displayLabel = theme.kicker
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        <header className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8 lg:pt-40 lg:pb-32">
            <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--tk-text)]">
              {theme.kicker}
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-16 max-w-5xl text-4xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[6.5rem]">
                {voice?.headline || `Browse ${displayLabel}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2} className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
              <p className="max-w-2xl text-[1.05rem] leading-8 text-[var(--tk-muted)]">
                {voice?.description || theme.note}
              </p>
              {voice?.chips?.length ? (
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {voice.chips.map((chip) => (
                    <span
                      key={chip}
                      className="editable-mono inline-flex items-center rounded-[3px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1.5 text-[0.68rem] tracking-[0.16em] text-[var(--tk-muted)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </EditableReveal>

            <div className="mt-16 flex flex-col gap-6 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="editable-mono text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                <span className="text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-2">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="editable-mono h-11 appearance-none rounded-[3px] border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-10 text-[0.72rem] tracking-[0.18em] text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="editable-mono inline-flex h-11 items-center rounded-[3px] bg-[var(--tk-text)] px-5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]">
                  Apply
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Ads: task-specific per-collection placement */}
        {task === 'pdf' ? (
          <div className="border-b border-[var(--tk-line)]">
            <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8">
              <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
            </div>
          </div>
        ) : null}

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={Math.min(index, 8)}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
              <Search className="mx-auto h-6 w-6 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-3xl font-medium tracking-[-0.03em]">
                Nothing filed here yet
              </h2>
              <p className="editable-mono mt-3 text-[0.72rem] tracking-[0.18em] text-[var(--tk-muted)]">
                Try another category, or check back after the next update.
              </p>
            </div>
          )}

          {/* Listing archive in-feed ad */}
          {task === 'listing' && posts.length ? (
            <div className="my-16 border-y border-[var(--tk-line)] py-10">
              <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
            </div>
          ) : null}

          {posts.length ? (
            <nav className="mt-24 flex items-center justify-center gap-3">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="editable-mono rounded-[3px] border border-[var(--tk-line)] px-5 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-on-accent)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="editable-mono rounded-[3px] bg-[var(--tk-surface)] px-5 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="editable-mono rounded-[3px] border border-[var(--tk-line)] px-5 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-on-accent)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({
  post,
  task,
  basePath,
  index,
}: {
  post: SitePost
  task: TaskKey
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} index={index} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

/* Article — full-bleed list row */
function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Field Notes')
  return (
    <Link
      href={href}
      className="group grid grid-cols-1 gap-8 border-b border-[var(--tk-line)] py-14 transition duration-500 sm:grid-cols-[minmax(0,280px)_minmax(0,1fr)_auto] sm:items-start"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0">
        <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.2em] text-[var(--tk-muted)]">
          {String(index + 1).padStart(2, '0')} · {category}
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-[var(--tk-text)] sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-5 line-clamp-3 text-[1rem] leading-7 text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
      </div>
      <ArrowUpRight className="hidden h-6 w-6 self-start text-[var(--tk-text)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
    </Link>
  )
}

/* Local Directory — precise record row */
function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Local Directory')
  return (
    <Link
      href={href}
      className="group grid grid-cols-[104px_1fr_auto] items-center gap-6 border-b border-[var(--tk-line)] py-7 pr-2 transition duration-500 hover:bg-[var(--tk-surface)] sm:pr-6"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[3px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? (
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="h-8 w-8 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="editable-mono editable-eyebrow-plus text-[0.66rem] tracking-[0.2em] text-[var(--tk-muted)]">
          {String(index + 1).padStart(2, '0')} · {category}
        </p>
        <h2 className="editable-display mt-2 truncate text-2xl font-medium tracking-[-0.03em] text-[var(--tk-text)]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-1 text-[0.95rem] leading-6 text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.72rem] text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
      </div>
      <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-[var(--tk-text)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
    </Link>
  )
}

/* Classified */
function ClassifiedArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link
      href={href}
      className="group grid grid-rows-[auto_1fr_auto] border-b border-[var(--tk-line)] p-8 transition duration-500 hover:bg-[var(--tk-surface)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-4xl font-medium tracking-[-0.035em] text-[var(--tk-text)]">
          {price || 'Open offer'}
        </span>
        {condition ? (
          <span className="editable-mono rounded-[3px] bg-[var(--tk-accent)] px-2.5 py-1 text-[0.62rem] tracking-[0.18em] text-[var(--tk-on-accent)]">
            {condition}
          </span>
        ) : null}
      </div>
      <h2 className="editable-display mt-6 text-xl font-medium leading-snug tracking-[-0.02em] text-[var(--tk-text)]">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 text-[0.95rem] leading-6 text-[var(--tk-muted)]">
        {getSummary(post)}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[0.7rem] text-[var(--tk-muted)]">
        <span className="editable-mono tracking-[0.18em]">
          {String(index + 1).padStart(2, '0')} · {location || 'Details inside'}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-text)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

/* Image */
function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link
      href={href}
      className="group mb-6 block break-inside-avoid overflow-hidden bg-[var(--tk-raised)]"
    >
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.85))] opacity-90 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-display line-clamp-2 text-xl font-medium leading-snug tracking-[-0.02em] text-white">
            {post.title}
          </h2>
          <span className="editable-mono mt-2 inline-flex items-center gap-1.5 text-[0.66rem] tracking-[0.18em] text-white/70">
            View <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* Bookmark (Saved Signals) */
function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link
      href={href}
      className="group flex items-start gap-5 border-b border-[var(--tk-line)] p-8 transition duration-500 hover:bg-[var(--tk-surface)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] bg-[var(--tk-raised)] text-[var(--tk-text)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-mono editable-eyebrow-plus text-[0.66rem] tracking-[0.2em] text-[var(--tk-muted)]">
          Saved · {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="editable-display mt-2 text-xl font-medium leading-snug tracking-[-0.02em] text-[var(--tk-text)]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? (
          <p className="editable-mono mt-3 truncate text-[0.68rem] tracking-[0.16em] text-[var(--tk-text)]">
            {cleanDomain(website)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

/* Reference Library — document card */
function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[4px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="editable-display flex h-16 w-14 items-center justify-center rounded-[3px] bg-[var(--tk-text)] text-[1.4rem] font-medium text-[var(--tk-on-accent)]">
          Aa
        </div>
        <span className="editable-mono rounded-[3px] border border-[var(--tk-line)] px-2.5 py-1 text-[0.62rem] tracking-[0.18em] text-[var(--tk-muted)]">
          {category}
        </span>
      </div>
      <p className="editable-mono editable-eyebrow-plus mt-8 text-[0.66rem] tracking-[0.2em] text-[var(--tk-muted)]">
        Reference · {String(index + 1).padStart(2, '0')}
      </p>
      <h2 className="editable-display mt-3 line-clamp-3 text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-[var(--tk-text)]">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[0.95rem] leading-6 text-[var(--tk-muted)]">
        {getSummary(post)}
      </p>
      <span className="editable-mono mt-8 inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-text)]">
        Open reference <Download className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

/* Profile */
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link
      href={href}
      className="group flex flex-col items-center border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center transition duration-500 hover:-translate-y-1"
    >
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />
        )}
      </div>
      <h2 className="editable-display mt-6 text-xl font-medium tracking-[-0.02em] text-[var(--tk-text)]">
        {post.title}
      </h2>
      {role ? (
        <p className="editable-mono mt-2 text-[0.66rem] tracking-[0.2em] text-[var(--tk-muted)]">
          {role}
        </p>
      ) : null}
      <p className="mt-4 line-clamp-2 text-[0.95rem] leading-6 text-[var(--tk-muted)]">
        {getSummary(post)}
      </p>
    </Link>
  )
}
