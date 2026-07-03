'use client'

import { Building2, FileText, Mail } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

/*
  Fleet-flavored contact page. Three "lanes" tailored to the Directory +
  Reference Library platform, no productKind branching — every site here is
  the same product.
*/
const lanes = [
  {
    icon: Building2,
    title: 'Directory submissions',
    body: 'Add a place to the Local Directory or send us a correction on an existing entry.',
  },
  {
    icon: FileText,
    title: 'Reference contributions',
    body: 'Send a document that should live in the Reference Library — briefings, guides, research.',
  },
  {
    icon: Mail,
    title: 'Everything else',
    body: 'Partnerships, coverage requests, or anything that does not fit a submission form.',
  },
]

export default function ContactPage() {
  const c = pagesContent.contact
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8 lg:pt-40 lg:pb-24">
          <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
            {c.eyebrow}
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-14 max-w-5xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[6rem]">
              {c.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-10 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">{c.description}</p>
          </EditableReveal>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
          <div className="grid gap-14 border-t border-[var(--slot4-page-text)] pt-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                Choose a lane
              </p>
              <div className="mt-8 grid gap-0">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i} className="border-b border-[var(--slot4-page-text)] py-8">
                    <div className="flex items-start gap-5">
                      <lane.icon className="mt-1 h-5 w-5 text-[var(--slot4-page-text)]" />
                      <div>
                        <h2 className="editable-display text-2xl font-medium tracking-[-0.03em]">{lane.title}</h2>
                        <p className="mt-3 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal className="border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                {c.formTitle}
              </p>
              <h2 className="editable-display mt-6 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                Send us a message.
              </h2>
              <EditableContactLeadForm />
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
