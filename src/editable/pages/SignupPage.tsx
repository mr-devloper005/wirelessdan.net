import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Get started',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  const c = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.9fr_1fr] lg:px-8 lg:py-32">
          <EditableReveal className="border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
              {c.formTitle}
            </p>
            <EditableLocalSignupForm />
            <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="editable-mono border-b border-[var(--slot4-page-text)] pb-0.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]">
                {c.loginCta}
              </Link>
            </p>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
              {c.badge}
            </p>
            <h1 className="editable-display mt-10 max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[5rem]">
              {c.title}
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{c.description}</p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
