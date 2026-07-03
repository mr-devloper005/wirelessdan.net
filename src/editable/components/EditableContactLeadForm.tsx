'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/*
  Fleet-flavored contact form. Sharp corners, hairline borders, mono labels,
  primary CTA follows dc.button.primary shape (rectangle, mono uppercase).
*/
export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="phone" label="Phone" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="What is this about?" />
      </div>
      <label className="grid gap-2">
        <span className="editable-mono text-[0.66rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need."
          className="w-full border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-[0.95rem] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)] focus:bg-[var(--slot4-highlight-soft)]"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div
          className={`editable-mono flex items-start gap-2 border px-4 py-3 text-[0.72rem] tracking-[0.16em] ${
            status === 'success'
              ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-highlight-soft)] text-[var(--slot4-page-text)]'
              : 'border-red-400/50 bg-red-50 text-red-700'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="editable-mono mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--slot4-page-text)] px-6 py-4 text-[0.78rem] tracking-[0.16em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-2">
      <span className="editable-mono text-[0.66rem] tracking-[0.2em] text-[var(--slot4-muted-text)]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 border border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] px-4 text-[0.95rem] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)] focus:bg-[var(--slot4-highlight-soft)]"
      />
    </label>
  )
}
