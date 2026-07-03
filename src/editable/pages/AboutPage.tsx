import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  const c = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8 lg:pt-40 lg:pb-32">
          <EditableReveal className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
            {c.badge}
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
          <div className="grid gap-14 border-t border-[var(--slot4-page-text)] pt-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                Field statement
              </p>
              <div className="mt-8 space-y-6 text-[1.05rem] leading-[1.85] text-[var(--slot4-page-text)]">
                {c.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="editable-mono mt-14 text-[0.7rem] tracking-[0.22em] text-[var(--slot4-muted-text)]">
                Filed under {SITE_CONFIG.name} desk operations.
              </p>
            </div>
            <aside className="grid gap-0">
              {c.values.map((value, i) => (
                <EditableReveal key={value.title} index={i} className="border-b border-[var(--slot4-page-text)] py-8">
                  <p className="editable-mono text-[0.68rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
                    {String(i + 1).padStart(2, '0')} /
                  </p>
                  <h2 className="editable-display mt-4 text-2xl font-medium tracking-[-0.03em]">{value.title}</h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                </EditableReveal>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
