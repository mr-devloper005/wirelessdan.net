'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, Linkedin, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Fleet-flavored dark footer.

  - CTA slab at the top ("Let's Get Started" + accent button).
  - 3 columns: Main, Discover (renamed task labels), Account.
  - Quick contact / socials strip.
  - Huge cropped brand wordmark at the bottom (Fleet's signature move).
  - Discovery column IS allowed to list the renamed task categories — that's
    the discovery surface. The navbar stays task-link-free.
*/


export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks
    .filter((task) => task.enabled)
    .map((task) => ({
      href: task.route,
      label: getTaskTheme(task.key).kicker,
    }))
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="relative overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6 sm:py-16 lg:px-8">
          <div className="min-w-0">
            <p className="editable-mono text-[0.7rem] tracking-[0.24em] text-white/60">Contact</p>
            <h2 className="editable-display mt-3 text-4xl font-medium leading-none tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">
              Let&rsquo;s get started.
            </h2>
          </div>
          <Link
            href="/contact"
            className="editable-mono inline-flex items-center gap-2 rounded-[4px] bg-[var(--slot4-highlight)] px-6 py-3.5 text-[0.78rem] font-medium tracking-[0.16em] text-[var(--slot4-on-highlight)] transition duration-300 hover:bg-white hover:text-[var(--slot4-dark-bg)]"
          >
            Request access <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <p className="editable-mono text-[0.7rem] tracking-[0.24em] text-white/50">Main</p>
          <Link href="/" className="editable-display mt-4 inline-block text-3xl font-medium tracking-[-0.03em]">
            {SITE_CONFIG.name}
            <span className="editable-mono ml-1 align-super text-[0.55rem] tracking-[0.2em]">®</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
          
        </div>

        <div>
          <p className="editable-mono text-[0.7rem] tracking-[0.24em] text-white/50">Discover</p>
          <ul className="mt-4 grid gap-3">
            {taskLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="editable-display group inline-flex items-center gap-2 text-2xl font-medium tracking-[-0.02em] text-white/85 transition hover:text-[var(--slot4-highlight)]"
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="editable-mono text-[0.7rem] tracking-[0.24em] text-white/50">Company</p>
          <ul className="mt-4 grid gap-3">
            <li>
              <Link href="/about" className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 hover:text-[var(--slot4-highlight)]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 hover:text-[var(--slot4-highlight)]">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/search" className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 hover:text-[var(--slot4-highlight)]">
                Search
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="editable-mono text-[0.7rem] tracking-[0.24em] text-white/50">Account</p>
          <ul className="mt-4 grid gap-3">
            {session ? (
              <>
                <li>
                  <Link href="/create" className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 hover:text-[var(--slot4-highlight)]">
                    Submit
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 transition hover:text-[var(--slot4-highlight)]"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 hover:text-[var(--slot4-highlight)]">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="editable-display text-2xl font-medium tracking-[-0.02em] text-white/85 hover:text-[var(--slot4-highlight)]">
                    Get started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Meta row */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="editable-mono tracking-[0.2em]">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="editable-mono tracking-[0.2em]">
            {globalContent.footer?.bottomNote || 'Built for discovery + reference.'}
          </p>
        </div>
      </div>

      {/* Huge cropped wordmark — Fleet's signature bottom-of-page move. */}
      <div className="pointer-events-none relative select-none">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-end justify-center px-4 sm:px-6 lg:px-8">
          <p
            aria-hidden
            className="editable-display translate-y-[15%] whitespace-nowrap text-center text-[15vw] font-semibold uppercase leading-none tracking-[-0.06em] text-/[0.045]"
          >
            {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
