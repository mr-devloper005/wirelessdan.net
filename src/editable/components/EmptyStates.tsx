import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing filed here yet',
  description = 'New entries will appear here as they are indexed.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center',
        className,
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[3px] bg-[var(--slot4-page-text)] text-[var(--slot4-on-accent)]">
        <SearchX className="h-5 w-5" />
      </div>
      <h2 className="editable-display mt-8 text-3xl font-medium tracking-[-0.035em] text-[var(--slot4-page-text)]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">{description}</p>
      <Link
        href={actionHref}
        className="editable-mono mt-8 inline-flex items-center gap-2 rounded-[4px] border border-[var(--slot4-page-text)] px-5 py-3 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)]"
      >
        {actionLabel} <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`${taskLabel.charAt(0).toUpperCase() + taskLabel.slice(1)} will appear here automatically as they are indexed.`}
      actionLabel="Return to the index"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your note is on the desk."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
