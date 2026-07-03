import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/login',
    title: 'Sign in',
    description: pagesContent.auth.login.metadataDescription,
  })
}

export default function LoginPage() {
  const c = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-32">
          <EditableReveal>
            <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
              {c.badge}
            </p>
            <h1 className="editable-display mt-10 max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[5rem]">
              {c.title}
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{c.description}</p>
          </EditableReveal>
          <EditableReveal index={1} className="border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
              {c.formTitle}
            </p>
            <EditableLocalLoginForm />
            <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="editable-mono border-b border-[var(--slot4-page-text)] pb-0.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]">
                {c.createCta}
              </Link>
            </p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
