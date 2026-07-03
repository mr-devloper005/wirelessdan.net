import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  getEditablePostImage,
  getEditableCategory,
  getEditableExcerpt,
  postHref,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme } from '@/editable/theme/task-themes'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'
const displayLabel = (task: TaskKey) => getTaskTheme(task).kicker

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestPostImages(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/* --------------------------------- Hero --------------------------------- */
export function EditableHomeHero({
  primaryTask,
  primaryRoute,
  posts,
  timeSections,
}: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const heroImages = latestPostImages(pool)
  const titleParts = pagesContent.home.hero.title || [
    `A working index for`,
    `everything worth keeping.`,
  ]
  const kicker = pagesContent.home.hero.badge || 'Home'
  const description = pagesContent.home.hero.description

  return (
    <section className="relative isolate overflow-hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className="absolute inset-0">
        <EditableHeroCollage images={heroImages} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.55)_0%,rgba(4,4,4,0.35)_45%,rgba(4,4,4,0.9)_100%)]" />
      </div>

      <div className={`relative ${container} pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-52 lg:pb-40`}>
        <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-white/85">
          {kicker}
        </EditableReveal>

        <div className="mt-16 grid gap-10 lg:mt-28 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <EditableReveal index={1}>
            <h1 className="editable-display max-w-4xl text-[3rem] font-medium leading-[0.92] tracking-[-0.045em] text-white sm:text-[5rem] lg:text-[7.5rem]">
              {titleParts[0]}
              {titleParts[1] ? (
                <>
                  <br />
                  <span className="text-white/85">{titleParts[1]}</span>
                </>
              ) : null}
            </h1>
          </EditableReveal>

          <EditableReveal index={2} className="max-w-md justify-self-start lg:justify-self-end">
            <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-white/80">
              We keep the good stuff findable.
            </p>
            <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryRoute}
                className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-500 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
              >
                Open {displayLabel(primaryTask).toLowerCase()} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="editable-mono inline-flex items-center gap-2 rounded-[4px] border border-white/40 px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
              >
                Start searching
              </Link>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* --------------- Editorial rail — the intro / what-we-do band ------------ */
export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const rail = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 3)
  const intro = pagesContent.home.intro
  if (!rail.length) return null

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
          {intro.badge || 'What we do'}
        </EditableReveal>

        <EditableReveal index={1}>
          <h2 className="editable-display mt-10 max-w-5xl text-4xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-[4.75rem]">
            {intro.title}
          </h2>
        </EditableReveal>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {rail.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i} as="article">
              <Link
                href={postHref(primaryTask, post, primaryRoute)}
                className="group block h-full border-t border-[var(--slot4-page-text)] pt-6 transition duration-500 hover:pt-4"
              >
                <span className="editable-mono flex items-center justify-between text-[0.7rem] tracking-[0.22em] text-[var(--slot4-muted-text)]">
                  <span>{String(i + 1).padStart(2, '0')} /</span>
                  <Plus className="h-4 w-4 text-[var(--slot4-page-text)]" />
                </span>
                <h3 className="editable-display mt-8 line-clamp-3 text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-[var(--slot4-page-text)] transition group-hover:opacity-80 sm:text-4xl">
                  {post.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
                  {getEditableExcerpt(post, 200)}
                </p>
                <span className="editable-mono mt-8 inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.18em] text-[var(--slot4-page-text)]">
                  Open <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </EditableReveal>
          ))}
        </div>

        <EditableReveal index={4} className="mt-14 flex flex-wrap items-center gap-4">
          <Link
            href={primaryRoute}
            className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
          >
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="editable-mono inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)] hover:opacity-70"
          >
            About the platform <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ---------------- Stats / KPI band — one yellow highlight ---------------- */
function EditableStatsBand({ posts, timeSections }: { posts: SitePost[]; timeSections: HomeTimeSection[] }) {
  const total = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).length
  const enabledTasks = SITE_CONFIG.tasks.filter((t) => t.enabled).length
  const categories = new Set(
    dedupePosts(posts).map((p) => (getEditableCategory(p) || '').toLowerCase()).filter(Boolean),
  ).size

  const stats = [
    { value: total > 999 ? `${(total / 1000).toFixed(1)}K+` : String(Math.max(total, 12)), label: 'Records indexed', highlight: false },
    { value: String(Math.max(enabledTasks, 2)), label: 'Live collections', highlight: true },
    { value: String(Math.max(categories, 8)), label: 'Distinct categories', highlight: false },
    { value: '24/7', label: 'Always browsable', highlight: false },
  ]

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-20 sm:py-24`}>
        <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
          By the numbers
        </EditableReveal>
        <div className="mt-10 grid gap-6 border-t border-[var(--slot4-page-text)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <EditableReveal
              key={stat.label}
              index={i}
              className={`relative flex flex-col justify-between rounded-[4px] p-8 min-h-[220px] ${
                stat.highlight
                  ? 'bg-[var(--slot4-highlight)] text-[var(--slot4-on-highlight)]'
                  : 'bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)]'
              }`}
            >
              <span
                className={`editable-mono text-[0.68rem] tracking-[0.22em] ${
                  stat.highlight ? 'text-[var(--slot4-on-highlight)]/70' : 'text-[var(--slot4-muted-text)]'
                }`}
              >
                {String(i + 1).padStart(2, '0')} /
              </span>
              <div>
                <p className="editable-display text-6xl font-medium leading-none tracking-[-0.05em] sm:text-7xl">
                  {stat.value}
                </p>
                <p
                  className={`editable-mono mt-4 text-[0.72rem] tracking-[0.2em] ${
                    stat.highlight ? 'text-[var(--slot4-on-highlight)]/80' : 'text-[var(--slot4-muted-text)]'
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------- Magazine split — big editorial feature + secondary rail --------- */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (!feed.length) return null
  const feature = feed[0]
  const runners = feed.slice(1, 4)

  return (
    <>
      <EditableStatsBand posts={posts} timeSections={timeSections} />

      <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
        <div className={`${container} py-24 sm:py-32`}>
          <EditableReveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                Front page
              </p>
              <h2 className="editable-display mt-6 text-4xl font-medium leading-[1.0] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
                Just added to the index.
              </h2>
            </div>
            <Link
              href={primaryRoute}
              className="editable-mono inline-flex items-center gap-1.5 border-b border-[var(--slot4-page-text)] pb-1 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)] transition hover:opacity-70"
            >
              View all {displayLabel(primaryTask).toLowerCase()} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </EditableReveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <EditableReveal>
              <Link
                href={postHref(primaryTask, feature, primaryRoute)}
                className="group block overflow-hidden bg-[var(--slot4-dark-bg)]"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={getEditablePostImage(feature)}
                    alt={feature.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-dark-text)] sm:p-10">
                  <span className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-white/75">
                    {getEditableCategory(feature)}
                  </span>
                  <h3 className="editable-display mt-6 line-clamp-3 text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl">
                    {feature.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                    {getEditableExcerpt(feature, 210)}
                  </p>
                  <span className="editable-mono mt-8 inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-highlight)]">
                    Open cover <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </EditableReveal>

            <div className="grid gap-0">
              {runners.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i + 1}>
                  <Link
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group grid grid-cols-[auto_1fr] gap-6 border-b border-[var(--editable-border)] py-6 transition hover:bg-white"
                  >
                    <span className="editable-mono w-14 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-muted-text)]">
                      {String(i + 2).padStart(2, '0')} /
                    </span>
                    <div className="min-w-0">
                      <p className="editable-mono text-[0.66rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
                        {getEditableCategory(post)}
                      </p>
                      <h3 className="editable-display mt-2 line-clamp-2 text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-[var(--slot4-page-text)] group-hover:opacity-70 sm:text-[1.6rem]">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </EditableReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ---------------------- Process steps + newsroom grid ---------------------- */
const processSteps = [
  {
    title: 'Discover',
    body: 'Search, filter, and browse verified records across every collection on the platform.',
  },
  {
    title: 'Reference',
    body: 'Save documents, cite guides, and pull structured metadata into your own workflow.',
  },
  {
    title: 'Contribute',
    body: 'Submit new places or reference files and help sharpen the index for the next visitor.',
  },
]

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 4), href: primaryRoute },
          { key: 'browse', posts: posts.slice(4, 8), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  const newsroom = dedupePosts(visible.flatMap((s) => s.posts)).slice(0, 8)

  return (
    <>
      {/* Process steps */}
      <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
        <div className={`${container} py-24 sm:py-32`}>
          <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-white/80">
            How it works
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className="editable-display mt-10 max-w-4xl text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-[4.25rem]">
              A predictable rhythm for finding what you need.
            </h2>
          </EditableReveal>

          <div className="mt-20 grid gap-0 md:grid-cols-3">
            {processSteps.map((step, i) => (
              <EditableReveal
                key={step.title}
                index={i}
                className="border-t border-white/15 py-10 md:border-r md:pr-10 md:pl-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="editable-mono text-[0.72rem] tracking-[0.22em] text-[var(--slot4-highlight)]">
                  Step {String(i + 1).padStart(2, '0')} /
                </p>
                <h3 className="editable-display mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">{step.body}</p>
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsroom-style tiled grid */}
      {newsroom.length ? (
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
          <div className={`${container} py-24 sm:py-32`}>
            <EditableReveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                  Recent articles
                </p>
                <h2 className="editable-display mt-6 text-4xl font-medium leading-[1.0] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
                  Newsroom
                </h2>
              </div>
              <Link
                href={primaryRoute}
                className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
              >
                View all
              </Link>
            </EditableReveal>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {newsroom.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i} as="article">
                  <Link
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group block overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--slot4-media-bg)]">
                      <img
                        src={getEditablePostImage(post)}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="pt-6">
                      <p className="editable-mono editable-eyebrow-plus text-[0.68rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
                        {getEditableCategory(post)}
                      </p>
                      <h3 className="editable-display mt-4 line-clamp-3 text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-[var(--slot4-page-text)]">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* ------------------------------- CTA slab ------------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className="relative bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-24 sm:py-32`}>
        <div className="relative overflow-hidden bg-[var(--slot4-dark-bg)] px-8 py-20 text-[var(--slot4-dark-text)] sm:px-14 sm:py-28">
          <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-white/70">
            {cta.badge || "Let's get started"}
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className="editable-display mt-10 max-w-4xl text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-[6rem]">
              {cta.title}
            </h2>
          </EditableReveal>
          <EditableReveal index={2} className="mt-10 flex flex-wrap gap-3">
            <Link
              href={cta.primaryCta.href}
              className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-500 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
            >
              {cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={cta.secondaryCta.href}
              className="editable-mono inline-flex items-center gap-2 rounded-[4px] border border-white/40 px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
            >
              {cta.secondaryCta.label}
            </Link>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}
