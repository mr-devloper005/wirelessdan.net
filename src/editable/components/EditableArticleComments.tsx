'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable — keep the in-memory list */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-16 border-t border-[var(--tk-line)] pt-12">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[var(--tk-text)]" />
        <p className="editable-mono text-[0.7rem] tracking-[0.22em] text-[var(--tk-text)]">
          Comments · {all.length}
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 border border-[var(--tk-text)] bg-[var(--tk-surface)] p-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-11 w-full border border-[var(--tk-line)] bg-[var(--tk-bg)] px-4 text-sm text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          maxLength={1500}
          className="mt-3 w-full resize-y border border-[var(--tk-line)] bg-[var(--tk-bg)] px-4 py-3 text-sm leading-6 text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--tk-text)] px-6 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" /> Post comment
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-0">
        {all.map((comment) => (
          <div key={comment.id} className="border-b border-[var(--tk-line)] py-6">
            <div className="flex items-center gap-3">
              <span className="editable-display flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] bg-[var(--tk-text)] text-sm font-medium text-[var(--tk-on-accent)]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--tk-text)]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? (
                  <p className="editable-mono text-[0.62rem] tracking-[0.18em] text-[var(--tk-muted)]">
                    {timeAgo(comment.createdAt)}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--tk-text)]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? (
          <p className="editable-mono py-6 text-[0.72rem] tracking-[0.18em] text-[var(--tk-muted)]">
            Be the first to comment.
          </p>
        ) : null}
      </div>
    </section>
  )
}
