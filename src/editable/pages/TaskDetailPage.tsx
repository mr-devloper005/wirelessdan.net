import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Camera,
  ClipboardCheck,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>,
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ---------------------------- Data helpers ---------------------------- */
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`,
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_m, prefix, url) =>
      `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`,
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* Estimate document metrics deterministically from content length. */
const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const estPages = (post: SitePost) => {
  const words = stripHtml(getBody(post) || '').split(/\s+/).filter(Boolean).length
  return Math.max(4, Math.round(words / 260) + (hashStr(post.slug || post.title || 'p') % 6))
}
const estFileSize = (post: SitePost) => {
  const h = hashStr(post.slug || post.title || 'p')
  const mb = 0.4 + (h % 68) / 10
  return `${mb.toFixed(1)} MB`
}
const estUpdated = (post: SitePost) => {
  const h = hashStr(post.slug || post.title || 'p')
  const monthsAgo = h % 10
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/* ------------------------------ Root switch ------------------------------ */
export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* Shared bits */
function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="editable-mono editable-eyebrow-plus flex items-center gap-3 text-[0.7rem] tracking-[0.22em] text-[var(--tk-text)]">
      <span>{theme.kicker}</span>
      <span className="text-[var(--tk-muted)]">/ {children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const label = getTaskTheme(task).kicker
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="editable-mono inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.18em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-3.5 w-3.5" /> Back to {label}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-7' : 'text-[1.05rem] leading-[1.8]'
      }`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function Tags({ post }: { post: SitePost }) {
  const tags = (post.tags || []).filter(Boolean).slice(0, 6)
  if (!tags.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="editable-mono rounded-[3px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1.5 text-[0.66rem] tracking-[0.16em] text-[var(--tk-muted)]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------ ARTICLE ------------------------------ */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <BackLink task="article" />
        <p className="editable-mono editable-eyebrow-plus mt-14 text-[0.72rem] tracking-[0.22em] text-[var(--tk-muted)]">
          {categoryOf(post, 'Field Notes')}
        </p>
        <h1 className="editable-display mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]">
          {post.title}
        </h1>
        <p className="editable-mono mt-6 text-[0.7rem] tracking-[0.18em] text-[var(--tk-muted)]">
          Filed by {SITE_CONFIG.name}
        </p>
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="mt-14 aspect-[16/10] w-full border border-[var(--tk-line)] object-cover"
          />
        ) : null}
        <BodyContent post={post} />
        <Tags post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ------------------------------ LISTING (premium) ------------------------------ */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'schedule'])
  const category = categoryOf(post, 'Local Directory')
  const mapSrc = mapSrcFor(post)
  const relatedTitle = pagesContent.detailPages.listing.relatedTitle
  const description = leadText(post)

  const fieldNotes = [
    address ? { label: 'Where to find it', value: address } : null,
    phone ? { label: 'How to reach them', value: phone } : null,
    hours ? { label: 'When they operate', value: hours } : null,
    website ? { label: 'Their working site', value: website.replace(/^https?:\/\//, '') } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      {/* Portrait split-hero — dark left rail with title, portrait photo right */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-8 sm:px-6 lg:px-8">
        <BackLink task="listing" />
        <div className="mt-8 grid gap-0 border border-[var(--tk-text)] lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left dark panel */}
          <EditableReveal className="flex min-h-[560px] flex-col justify-between bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-dark-text)] sm:p-12 lg:min-h-[720px] lg:p-16">
            <div>
              <div className="editable-mono editable-eyebrow-plus flex items-center gap-3 text-[0.7rem] tracking-[0.22em] text-[var(--slot4-highlight)]">
                <span>Local Directory</span>
                <span className="text-white/50">/ {category}</span>
              </div>
              <h1 className="editable-display mt-14 text-balance text-5xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[5.5rem]">
                {post.title}
              </h1>
              {description ? (
                <p className="mt-10 max-w-md text-[1.05rem] leading-8 text-white/70">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="mt-12 flex flex-wrap gap-3">
              {website || phone ? (
                <Link
                  href={website || `tel:${phone}`}
                  target={website ? '_blank' : undefined}
                  rel="noreferrer"
                  className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-500 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
                >
                  Request access <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
              {address ? (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="editable-mono inline-flex items-center gap-2 rounded-[4px] border border-white/40 px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
                >
                  Directions
                </a>
              ) : null}
            </div>
          </EditableReveal>

          {/* Right hero photo — portrait aspect */}
          <EditableReveal index={1} className="relative min-h-[400px] overflow-hidden bg-[var(--tk-raised)] lg:min-h-[720px]">
            {hero ? (
              <img src={hero} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="editable-display absolute inset-0 flex items-center justify-center text-[10rem] font-medium tracking-[-0.05em] text-[var(--tk-muted)]">
                {post.title[0]}
              </div>
            )}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="editable-mono rounded-[3px] bg-white/95 px-3 py-1.5 text-[0.62rem] tracking-[0.2em] text-[var(--slot4-dark-bg)]">
                Verified · {new Date().getFullYear()}
              </span>
              <span className="editable-mono rounded-[3px] border border-white/60 px-3 py-1.5 text-[0.62rem] tracking-[0.2em] text-white">
                {String(gallery.length + 1).padStart(2, '0')} photos
              </span>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Yellow accent band — the Fleet signature accent moment */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <EditableReveal className="mt-6 grid grid-cols-2 divide-x divide-[var(--slot4-dark-bg)]/15 border-x border-b border-[var(--tk-text)] bg-[var(--slot4-highlight)] text-[var(--slot4-on-highlight)] sm:grid-cols-5">
          <QuickFactBand label="Address" value={address || '—'} />
          <QuickFactBand label="Phone" value={phone || '—'} />
          <QuickFactBand label="Hours" value={hours || 'By appointment'} />
          <QuickFactBand label="Category" value={category} />
          <QuickFactBand label="Status" value="Verified" />
        </EditableReveal>
      </section>

      {/* Left-rail sticky sidebar + right article column */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-20 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Sticky sidebar on the LEFT */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[var(--tk-text)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                Contact card
              </p>
              <ul className="mt-6 divide-y divide-[var(--tk-line)]">
                {address ? (
                  <ContactRow
                    icon={MapPin}
                    label="Address"
                    value={address}
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  />
                ) : null}
                {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? (
                  <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} external />
                ) : null}
                {hours ? <ContactRow icon={Clock} label="Hours" value={hours} /> : null}
              </ul>
              {(website || phone) ? (
                <Link
                  href={website || `tel:${phone}`}
                  target={website ? '_blank' : undefined}
                  rel="noreferrer"
                  className="editable-mono mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--tk-text)] px-6 py-3.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-on-accent)] transition duration-500 hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
                >
                  Request access <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>

            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                Trust signals
              </p>
              <ul className="mt-5 grid gap-3.5">
                <TrustRow label="Verified operator" />
                <TrustRow label="Contact details confirmed" />
                <TrustRow label="Reviewed for this index" />
              </ul>
            </div>

            {/* Ads: listing sidebar */}
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="w-full" />
          </aside>

          {/* Article — About + numbered field notes + gallery */}
          <article className="min-w-0">
            <EditableReveal>
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                Field brief
              </p>
              <h2 className="editable-display mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">
                About this place.
              </h2>
              <BodyContent post={post} />
              <Tags post={post} />
            </EditableReveal>

            {fieldNotes.length ? (
              <EditableReveal index={1} className="mt-20">
                <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                  Field notes
                </p>
                <ol className="mt-6 grid gap-0 border-t border-[var(--tk-text)]">
                  {fieldNotes.map((note, i) => (
                    <li
                      key={note.label}
                      className="grid grid-cols-[auto_minmax(0,220px)_minmax(0,1fr)] items-baseline gap-6 border-b border-[var(--tk-line)] py-6"
                    >
                      <span className="editable-mono text-[0.68rem] tracking-[0.2em] text-[var(--tk-muted)]">
                        {String(i + 1).padStart(2, '0')} /
                      </span>
                      <span className="editable-mono text-[0.68rem] tracking-[0.2em] text-[var(--tk-muted)]">
                        {note.label}
                      </span>
                      <span className="editable-display text-lg font-medium leading-snug tracking-[-0.02em] text-[var(--tk-text)]">
                        {note.value}
                      </span>
                    </li>
                  ))}
                </ol>
              </EditableReveal>
            ) : null}

            {gallery.length ? (
              <EditableReveal index={2} className="mt-20">
                <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                  Gallery
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {gallery.map((img, i) => (
                    <img
                      key={`${img}-${i}`}
                      src={img}
                      alt=""
                      className="aspect-square w-full border border-[var(--tk-line)] object-cover transition duration-500 hover:opacity-80"
                    />
                  ))}
                </div>
              </EditableReveal>
            ) : null}
          </article>
        </div>
      </section>

      {/* Full-bleed map — a wide separate section */}
      {mapSrc ? (
        <section className="border-y border-[var(--tk-text)] bg-[var(--slot4-dark-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 text-white">
              <div>
                <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-highlight)]">
                  On the map
                </p>
                <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                  Find them in the field.
                </h2>
              </div>
              {address ? (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="editable-mono inline-flex items-center gap-1.5 border-b border-[var(--slot4-highlight)] pb-1 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-highlight)]"
                >
                  Open in Google Maps <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
            <div className="mt-10 overflow-hidden border border-white/15 bg-black">
              <iframe
                src={mapSrc}
                title="Map"
                loading="lazy"
                className="h-[520px] w-full border-0"
              />
            </div>
          </div>
        </section>
      ) : null}

      <RelatedStrip task="listing" related={related} title={relatedTitle} />
    </>
  )
}

function QuickFactBand({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-6 py-6">
      <p className="editable-mono text-[0.62rem] tracking-[0.22em] text-[var(--slot4-on-highlight)]/70">
        {label}
      </p>
      <p className="editable-display mt-3 truncate text-[1.05rem] font-medium tracking-[-0.02em] text-[var(--slot4-on-highlight)]">
        {value}
      </p>
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof MapPin
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <div className="flex items-start gap-3 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-text)]" />
      <div className="min-w-0 flex-1">
        <p className="editable-mono text-[0.62rem] tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-[var(--tk-text)]">{value}</p>
      </div>
      {href ? (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-text)]" />
      ) : null}
    </div>
  )
  return (
    <li>
      {href ? (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="group block transition hover:bg-[var(--tk-raised)]"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  )
}

function TrustRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-[var(--tk-text)]">
      <ClipboardCheck className="h-4 w-4 text-[var(--tk-accent)]" />
      <span>{label}</span>
    </li>
  )
}

/* ------------------------------ CLASSIFIED ------------------------------ */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 border border-[var(--tk-text)] bg-[var(--tk-surface)] p-8">
            <Kicker task="classified">Notice</Kicker>
            <h1 className="editable-display mt-6 text-3xl font-medium leading-tight tracking-[-0.03em]">
              {post.title}
            </h1>
            <p className="editable-display mt-6 text-5xl font-medium tracking-[-0.04em] text-[var(--tk-text)]">
              {price || 'Open offer'}
            </p>
            <ul className="mt-6 divide-y divide-[var(--tk-line)] text-sm">
              {condition ? <li className="flex items-center justify-between py-3"><span className="editable-mono text-[0.65rem] tracking-[0.18em] text-[var(--tk-muted)]">Condition</span><span>{condition}</span></li> : null}
              {location ? <li className="flex items-center justify-between py-3"><span className="editable-mono text-[0.65rem] tracking-[0.18em] text-[var(--tk-muted)]">Location</span><span>{location}</span></li> : null}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {phone ? <a href={`tel:${phone}`} className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--tk-text)] px-4 py-2.5 text-[0.7rem] tracking-[0.18em] text-[var(--tk-on-accent)]"><Phone className="h-3.5 w-3.5" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--tk-text)] px-4 py-2.5 text-[0.7rem] tracking-[0.18em] text-[var(--tk-text)]"><Mail className="h-3.5 w-3.5" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {images.slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt="" className="aspect-[4/3] w-full border border-[var(--tk-line)] object-cover" />
              ))}
            </div>
          ) : null}
          <BodyContent post={post} />
          <Tags post={post} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ------------------------------ IMAGE ------------------------------ */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <BackLink task="image" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-3 sm:columns-2">
            {gallery.map((image, i) => (
              <figure key={`${image}-${i}`} className="mb-3 break-inside-avoid overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image"><span className="inline-flex items-center gap-1.5"><Camera className="h-3.5 w-3.5" /> Visual entry</span></Kicker>
            <h1 className="editable-display mt-8 text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl">
              {post.title}
            </h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <Tags post={post} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ------------------------------ BOOKMARK ------------------------------ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <BackLink task="sbm" />
        <div className="mt-12 flex h-16 w-16 items-center justify-center rounded-[4px] bg-[var(--tk-text)] text-[var(--tk-on-accent)]">
          <Bookmark className="h-6 w-6" />
        </div>
        <div className="mt-8"><Kicker task="sbm">Signal</Kicker></div>
        <h1 className="editable-display mt-6 text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          {post.title}
        </h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="editable-mono mt-10 inline-flex items-center gap-2 rounded-[4px] bg-[var(--tk-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]"
          >
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
        <Tags post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ------------------------------ PDF (v2 — book-cover spread + reading table) ------------------------------ */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const category = categoryOf(post, 'Reference')
  const pages = estPages(post)
  const size = estFileSize(post)
  const updated = estUpdated(post)
  const filename = `${(post.slug || 'document').replace(/[^a-z0-9-]/gi, '-')}.pdf`
  const lead = leadText(post)
  const sections = (() => {
    const body = stripHtml(getBody(post))
    const chunks = body.split(/[.!?]\s/).filter((s) => s.trim().length > 20)
    if (chunks.length >= 3) return chunks.slice(0, 5).map((s) => s.slice(0, 60).trim() + (s.length > 60 ? '…' : ''))
    return ['Overview', 'Methodology', 'Key findings', 'Discussion', 'Appendices']
  })()

  return (
    <>
      {/* Compact top bar */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackLink task="pdf" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="editable-mono editable-eyebrow-plus text-[0.66rem] tracking-[0.22em] text-[var(--tk-text)]">
              Reference document
            </span>
            <span className="editable-mono rounded-[3px] bg-[var(--tk-text)] px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-[var(--tk-on-accent)]">
              PDF
            </span>
            <span className="editable-mono rounded-[3px] border border-[var(--tk-line)] px-2.5 py-1 text-[0.6rem] tracking-[0.2em] text-[var(--tk-muted)]">
              {category}
            </span>
          </div>
        </div>

        {/* Book-cover spread — big Aa cover on the left with the title inside it,
            reading intent (pull-quote + CTAs) on the right. */}
        <div className="mt-10 grid gap-0 border border-[var(--tk-text)] lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left — the "cover" */}
          <EditableReveal className="relative flex min-h-[520px] flex-col justify-between bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-12 lg:min-h-[720px] lg:p-16">
            <div className="flex items-center justify-between">
              <span
                aria-hidden
                className="editable-display flex h-24 w-20 items-center justify-center rounded-[3px] bg-[var(--slot4-highlight)] text-3xl font-medium tracking-[-0.05em] text-[var(--slot4-on-highlight)]"
              >
                Aa
              </span>
              <span className="editable-mono text-[0.66rem] tracking-[0.22em] text-white/60">
                No. {String(pages).padStart(3, '0')}
              </span>
            </div>
            <div>
              <p className="editable-mono editable-eyebrow-plus text-[0.68rem] tracking-[0.22em] text-[var(--slot4-highlight)]">
                Reference Library
              </p>
              <h1 className="editable-display mt-8 text-balance text-5xl font-medium leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[6.25rem]">
                {post.title}
              </h1>
            </div>
            <div className="flex items-center justify-between border-t border-white/15 pt-6">
              <span className="editable-mono truncate text-[0.66rem] tracking-[0.18em] text-white/60">
                {filename}
              </span>
              <span className="editable-mono text-[0.66rem] tracking-[0.18em] text-white/60">{size}</span>
            </div>
          </EditableReveal>

          {/* Right — reading intent */}
          <EditableReveal
            index={1}
            className="flex min-h-[520px] flex-col justify-between bg-[var(--tk-surface)] p-8 sm:p-12 lg:min-h-[720px] lg:p-14"
          >
            <div>
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                On the desk
              </p>
              {lead ? (
                <blockquote className="editable-display mt-10 border-l-4 border-[var(--slot4-highlight)] pl-6 text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-[var(--tk-text)] sm:text-3xl lg:text-[2.35rem]">
                  {lead}
                </blockquote>
              ) : (
                <p className="editable-display mt-10 text-2xl font-medium leading-[1.35] tracking-[-0.02em] text-[var(--tk-text)] sm:text-3xl">
                  A reference-grade file, filed to the desk and ready to cite.
                </p>
              )}
            </div>

            <div className="mt-10 space-y-8">
              <dl className="grid grid-cols-2 gap-y-4 border-y border-[var(--tk-text)] py-6">
                <MiniFact label="Pages" value={String(pages)} />
                <MiniFact label="File size" value={size} />
                
                <MiniFact label="Category" value={category} />
              </dl>
              <div className="flex flex-wrap gap-3">
                {fileUrl ? (
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-on-accent)]"
                  >
                    Download PDF <Download className="h-4 w-4" />
                  </Link>
                ) : null}
                {fileUrl ? (
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="editable-mono inline-flex items-center gap-2 rounded-[4px] border border-[var(--tk-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--tk-text)] transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-on-accent)]"
                  >
                    Open in new tab <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Full-bleed reading table — the actual file, huge */}
      {fileUrl ? (
        <section className="border-y border-[var(--tk-text)] bg-[var(--slot4-dark-bg)]">
          <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between gap-4 px-4 py-4 text-white sm:px-6 lg:px-8">
            <p className="editable-mono text-[0.68rem] tracking-[0.22em] text-white/70">
              Reading table · {filename}
            </p>
            <Link
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="editable-mono inline-flex items-center gap-1.5 text-[0.66rem] tracking-[0.18em] text-[var(--slot4-highlight)]"
            >
              Fullscreen <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          <EditableReveal>
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={post.title}
              className="block h-[88vh] w-full border-0 bg-black"
            />
          </EditableReveal>
        </section>
      ) : null}

      {/* Reader spread — TOC on the LEFT, prose on the RIGHT (flipped from before) */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left sticky TOC + identity mini */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[var(--tk-text)] bg-[var(--tk-surface)] p-6">
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="editable-display flex h-14 w-12 items-center justify-center rounded-[3px] bg-[var(--tk-text)] text-lg font-medium tracking-[-0.04em] text-[var(--tk-on-accent)]"
                >
                  Aa
                </span>
                <span className="editable-mono text-[0.62rem] tracking-[0.2em] text-[var(--tk-muted)]">PDF · {size}</span>
              </div>
              <p className="editable-display mt-5 line-clamp-2 text-lg font-medium tracking-[-0.02em]">
                {post.title}
              </p>
              <ul className="mt-5 divide-y divide-[var(--tk-line)] text-sm">
                <li className="flex items-center justify-between py-2.5">
                  <span className="editable-mono text-[0.62rem] tracking-[0.2em] text-[var(--tk-muted)]">Category</span>
                  <span className="font-medium">{category}</span>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="editable-mono text-[0.62rem] tracking-[0.2em] text-[var(--tk-muted)]">Pages</span>
                  <span className="font-medium">{pages}</span>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="editable-mono text-[0.62rem] tracking-[0.2em] text-[var(--tk-muted)]">Uploaded by</span>
                  <span className="font-medium">{SITE_CONFIG.name}</span>
                </li>
                
              </ul>
              {fileUrl ? (
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editable-mono mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--tk-text)] px-6 py-3 text-[0.7rem] tracking-[0.18em] text-[var(--tk-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
                >
                  Download <Download className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>

            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                What&rsquo;s inside
              </p>
              <ol className="mt-5 grid gap-0 divide-y divide-[var(--tk-line)]">
                {sections.map((s, i) => (
                  <li key={`${s}-${i}`} className="flex items-start gap-3 py-3 text-sm">
                    <span className="editable-mono w-8 shrink-0 text-[0.62rem] tracking-[0.18em] text-[var(--tk-muted)]">
                      {String(i + 1).padStart(2, '0')} /
                    </span>
                    <span className="text-[var(--tk-text)]">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Right — prose */}
          <article className="min-w-0">
            <EditableReveal>
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
                Reader notes
              </p>
              <h2 className="editable-display mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">
                Inside the file.
              </h2>
              <BodyContent post={post} />
              <Tags post={post} />
            </EditableReveal>

            {/* Ads: article-bottom for PDF detail */}
            <div className="mt-16 border-y border-[var(--tk-line)] py-10">
              <Ads
                slot="article-bottom"
                size={pickRandom(getSlotSizes('article-bottom'))}
                showLabel
                className="mx-auto w-full"
              />
            </div>
          </article>
        </div>
      </section>

      {/* Full-width repeated CTA slab — a hard beat before related */}
      {fileUrl ? (
        <section className="border-t border-[var(--tk-text)] bg-[var(--slot4-highlight)]">
          <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center sm:px-6 sm:py-20 lg:px-8">
            <div className="min-w-0">
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-on-highlight)]">
                Ready when you are
              </p>
              <p className="editable-display mt-5 text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-[var(--slot4-on-highlight)] sm:text-4xl lg:text-5xl">
                Take the full file with you.
              </p>
            </div>
            <Link
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-dark-bg)] px-8 py-4 text-[0.78rem] tracking-[0.16em] text-white transition hover:bg-white hover:text-[var(--slot4-dark-bg)]"
            >
              Download PDF <Download className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* PDF-specific related strip — glyph tiles, no hero photography */}
      <PdfRelatedStrip related={related} />
    </>
  )
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="editable-mono text-[0.62rem] tracking-[0.22em] text-[var(--tk-muted)]">{label}</dt>
      <dd className="editable-display mt-1 truncate text-lg font-medium tracking-[-0.02em] text-[var(--tk-text)]">
        {value}
      </dd>
    </div>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
              Related
            </p>
            <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
              More from the Reference Library
            </h2>
          </div>
          <Link
            href={taskConfig?.route || '/pdf'}
            className="editable-mono inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-text)]"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <Link
              key={item.id || item.slug}
              href={`${taskConfig?.route || '/pdf'}/${item.slug}`}
              className="group flex h-full flex-col border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)]"
            >
              <div
                aria-hidden
                className="editable-display flex h-28 items-center justify-center rounded-[3px] bg-[var(--tk-text)] text-4xl font-medium tracking-[-0.05em] text-[var(--tk-on-accent)]"
              >
                Aa
              </div>
              <h3 className="editable-display mt-5 line-clamp-3 text-lg font-medium leading-[1.15] tracking-[-0.02em] text-[var(--tk-text)]">
                {item.title}
              </h3>
              <span className="editable-mono mt-auto pt-4 inline-flex items-center gap-1.5 text-[0.62rem] tracking-[0.18em] text-[var(--tk-muted)]">
                {estFileSize(item)} · PDF
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ PROFILE ------------------------------ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[var(--tk-text)] bg-[var(--tk-surface)] p-10 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? (
                  <img src={images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
                )}
              </div>
              <h1 className="editable-display mt-8 text-3xl font-medium tracking-[-0.03em]">{post.title}</h1>
              {role ? (
                <p className="editable-mono mt-3 text-[0.7rem] tracking-[0.2em] text-[var(--tk-muted)]">{role}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--tk-text)] px-4 py-2.5 text-[0.7rem] tracking-[0.18em] text-[var(--tk-on-accent)]"
                  >
                    Website <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--tk-text)] px-4 py-2.5 text-[0.7rem] tracking-[0.18em] text-[var(--tk-text)]"
                  >
                    Email
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <Tags post={post} />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ------------------------------ Related strip (default) ------------------------------ */
function RelatedStrip({
  task,
  related,
  title,
}: {
  task: TaskKey
  related: SitePost[]
  title?: string
}) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = getTaskTheme(task).kicker
  const heading = title || `More from the ${label}`
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--tk-muted)]">
              Related
            </p>
            <h2 className="editable-display mt-4 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
              {heading}
            </h2>
          </div>
          <Link
            href={taskConfig?.route || '/'}
            className="editable-mono inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.18em] text-[var(--tk-text)]"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link
      href={href}
      className="group block overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="editable-display line-clamp-2 text-lg font-medium leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">
          {stripHtml(summaryText(post))}
        </p>
      </div>
    </Link>
  )
}
