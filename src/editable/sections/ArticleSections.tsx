import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40`}>
        <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
          {voice.eyebrow}
        </p>
        <h1 className={`${dc.type.heroTitle} mt-14 max-w-5xl`}>{voice.headline}</h1>
        <p className="mt-10 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>
        <form action={basePath} className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            name="category"
            defaultValue={category || 'all'}
            className="editable-mono min-w-0 flex-1 border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)] outline-none"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <button className="editable-mono rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-3 text-[0.72rem] tracking-[0.16em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]">
            Apply
          </button>
        </form>
      </section>

      <section className={`${dc.shell.section} pb-24`}>
        {posts.length ? (
          <div className="grid gap-0 border-t border-[var(--slot4-page-text)]">
            {posts.map((post, index) => (
              <ArticleListCard
                key={post.id}
                post={post}
                href={postHref('article', post, basePath)}
                index={index + (page - 1) * pagination.limit}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center">
            <h2 className="editable-display text-3xl font-medium tracking-[-0.035em]">No entries found</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
              Try another category or return to all entries.
            </p>
          </div>
        )}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link
              href={pageHref(page - 1)}
              className="editable-mono border border-[var(--editable-border)] px-5 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]"
            >
              Previous
            </Link>
          ) : null}
          <span className="editable-mono bg-[var(--slot4-page-text)] px-5 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-on-accent)]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link
              href={pageHref(page + 1)}
              className="editable-mono border border-[var(--editable-border)] px-5 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]"
            >
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-16 sm:pt-24`}>
        <Link
          href="/article"
          className="editable-mono inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.18em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back to {voice.eyebrow}
        </Link>
        <p className="editable-mono editable-eyebrow-plus mt-14 text-[0.72rem] tracking-[0.22em] text-[var(--slot4-muted-text)]">
          {voice.eyebrow}
        </p>
        <h1 className="editable-display mt-6 max-w-5xl text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
          {post?.title || pagesContent.detailPages.article.fallbackTitle}
        </h1>
      </section>
      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[1.05rem] leading-8 text-[var(--slot4-muted-text)]">
          {post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}
        </p>
        <Link
          href="/contact"
          className="editable-mono mt-10 inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
        >
          Contact <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
