import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'
import { formatRichHtml } from '@/components/shared/rich-content'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((item) => typeof item === 'string') as string | undefined)
    : ''
  return (
    media ||
    compactRaw(content.featuredImage) ||
    compactRaw(content.image) ||
    compactRaw(content.thumbnail) ||
    images ||
    ''
  )
}
const summaryOf = (post: SitePost) =>
  post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const displayLabel = task ? getTaskTheme(task).kicker : 'Entry'

  return (
    <Link
      href={href}
      className="group grid gap-6 border-b border-[var(--editable-border)] py-8 transition duration-500 hover:bg-[var(--slot4-surface-bg)] sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="editable-display flex h-full items-center justify-center text-4xl font-medium tracking-[-0.04em] text-[var(--slot4-muted-text)]">
            {displayLabel[0]}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="editable-mono editable-eyebrow-plus text-[0.68rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
          {displayLabel}
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-3xl">
          {post.title}
        </h2>
        {summary ? <div className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]" dangerouslySetInnerHTML={{ __html: formatRichHtml(summary) }} /> : null}
      </div>
      <ArrowUpRight className="hidden self-start text-[var(--slot4-page-text)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts =
    feed?.posts?.length
      ? feed.posts
      : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const c = pagesContent.search

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8 lg:pt-40 lg:pb-28">
          <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
            {c.hero.badge}
          </p>
          <h1 className="editable-display mt-14 max-w-5xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[6rem]">
            {c.hero.title}
          </h1>
          <p className="mt-10 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">{c.hero.description}</p>

          <form action="/search" className="mt-14 border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] p-3 sm:p-4">
            <input type="hidden" name="master" value="1" />
            <label className="flex items-center gap-3 border-b border-[var(--editable-border)] px-3 py-3 sm:px-4">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-page-text)]" />
              <input
                name="q"
                defaultValue={query}
                placeholder={c.hero.placeholder}
                className="editable-display min-w-0 flex-1 bg-transparent py-2 text-2xl font-medium tracking-[-0.02em] outline-none placeholder:text-[var(--slot4-muted-text)]"
              />
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="flex items-center gap-2 border border-[var(--editable-border)] px-4 py-3">
                <Filter className="h-4 w-4 text-[var(--slot4-page-text)]" />
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Category"
                  className="editable-mono min-w-0 flex-1 bg-transparent text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <select
                name="task"
                defaultValue={task}
                className="editable-mono border border-[var(--editable-border)] px-4 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)] outline-none"
              >
                <option value="">All collections</option>
                {enabledTasks.map((item) => (
                  <option key={item.key} value={item.key}>
                    {getTaskTheme(item.key).kicker}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="editable-mono rounded-none bg-[var(--slot4-page-text)] px-8 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
              >
                Search
              </button>
            </div>
          </form>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--slot4-page-text)] pt-10">
            <div>
              <p className="editable-mono text-[0.7rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
                {results.length} results
              </p>
              <h2 className="editable-display mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                {query ? `Results for “${query}”` : c.resultsTitle}
              </h2>
            </div>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-0">
              {results.map((post) => (
                <SearchResultCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-12 border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-8 py-20 text-center">
              <p className="editable-display text-3xl font-medium tracking-[-0.03em]">Nothing matched.</p>
              <p className="editable-mono mt-4 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-muted-text)]">
                Try a different keyword, collection, or category.
              </p>
            </div>
          )}

          {/* Ads: search footer */}
          <div className="mt-16 border-y border-[var(--editable-border)] py-10">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
