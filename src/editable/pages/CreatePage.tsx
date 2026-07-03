'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-[0.95rem] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:bg-[var(--slot4-highlight-soft)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? getTaskTheme(activeTask.key).kicker : 'Entry'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    const c = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)]">
          <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-[var(--editable-container)] items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-32">
            <EditableReveal className="flex h-full min-h-72 items-center justify-center bg-[var(--slot4-dark-bg)] text-[var(--slot4-highlight)]">
              <Lock className="h-16 w-16" />
            </EditableReveal>
            <EditableReveal index={1}>
              <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                {c.badge}
              </p>
              <h1 className="editable-display mt-10 max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                {c.title}
              </h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{c.description}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
                >
                  Sign in <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="editable-mono inline-flex items-center gap-2 rounded-[4px] border border-[var(--slot4-page-text)] px-6 py-3.5 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)]"
                >
                  Get started
                </Link>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20 lg:px-8 lg:pt-40">
          <p className="editable-mono editable-eyebrow-plus text-[0.72rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
            {hero.badge}
          </p>
          <h1 className="editable-display mt-14 max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">{hero.description}</p>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
          <div className="grid gap-12 border-t border-[var(--slot4-page-text)] pt-12 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="editable-mono editable-eyebrow-plus text-[0.7rem] tracking-[0.22em] text-[var(--slot4-page-text)]">
                Choose the collection
              </p>
              <div className="mt-8 grid gap-0">
                {enabledTasks.map((item, i) => {
                  const active = item.key === task
                  const label = getTaskTheme(item.key).kicker
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`group border-b border-[var(--slot4-page-text)] py-6 text-left transition ${
                        active ? 'bg-[var(--slot4-highlight)] px-6 text-[var(--slot4-on-highlight)]' : 'px-0 hover:px-4'
                      }`}
                    >
                      <p className="editable-mono text-[0.66rem] tracking-[0.2em] opacity-70">
                        {String(i + 1).padStart(2, '0')} /
                      </p>
                      <p className="editable-display mt-3 text-2xl font-medium tracking-[-0.03em]">{label}</p>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form
              onSubmit={submit}
              className="border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] p-6 sm:p-10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="editable-mono text-[0.7rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">
                  Filing to · {activeLabel}
                </p>
                <span className="editable-mono rounded-[3px] border border-[var(--slot4-page-text)] px-3 py-1 text-[0.66rem] tracking-[0.18em] text-[var(--slot4-page-text)]">
                  {session.name}
                </span>
              </div>
              <h2 className="editable-display mt-6 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                {pagesContent.create.formTitle}
              </h2>

              <div className="mt-8 grid gap-4">
                <input
                  className={fieldClass}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Entry title"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className={fieldClass}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Category"
                  />
                  <input
                    className={fieldClass}
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="Website or source URL"
                  />
                </div>
                <input
                  className={fieldClass}
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="Featured image URL"
                />
                <textarea
                  className={`${fieldClass} min-h-24`}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Short summary"
                  required
                />
                <textarea
                  className={`${fieldClass} min-h-48`}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Details, notes, or the reference description"
                  required
                />
              </div>

              {created ? (
                <div className="editable-mono mt-6 flex items-start gap-3 border border-[var(--slot4-page-text)] bg-[var(--slot4-highlight-soft)] px-4 py-3 text-[0.72rem] tracking-[0.16em] text-[var(--slot4-page-text)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{pagesContent.create.successTitle} · {created.title}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="editable-mono mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-4 text-[0.78rem] tracking-[0.18em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)]"
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
