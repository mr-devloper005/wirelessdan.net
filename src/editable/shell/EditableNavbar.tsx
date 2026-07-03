'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, LogIn, UserPlus, LogOut, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Fleet-flavored top bar.

  Rules:
  - NO redirects to any task archive page (no "Local Directory" / "Reference
    Library" links in the header — those live in the footer discovery column).
  - Left: brand wordmark.
  - Center: About + Contact only (plus any other non-task static page).
  - Right: search icon → /search, then auth actions.
  - Mobile menu mirrors the same links, no task labels.
*/

const staticLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <header
      className={`sticky top-0 z-50 border-b transition duration-500 ${
        scrolled
          ? 'border-[var(--editable-border)] bg-[var(--slot4-page-bg)]/95 backdrop-blur-md'
          : 'border-transparent bg-[var(--slot4-page-bg)]'
      }`}
    >
      <nav className="mx-auto grid min-h-[74px] w-full max-w-[var(--editable-container)] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label={SITE_CONFIG.name}
          className="group inline-flex items-center gap-2.5 justify-self-start"
        >
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
          <span className="editable-display text-[2.05rem] font-semibold uppercase tracking-[0.02em] leading-none text-[var(--slot4-page-text)]">
            {SITE_CONFIG.name}
          </span>
          <span className="editable-mono translate-y-[-0.3em] text-[2.55rem] tracking-[0.2em] text-[var(--slot4-page-text)]">
            ®
          </span>
        </Link>

        {/* Center static links */}
        <ul className="hidden items-center gap-8 justify-self-center md:flex">
          {staticLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`editable-mono relative text-[1rem] font-medium tracking-[0.2em] transition ${
                  isActive(item.href)
                    ? 'text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-[var(--slot4-page-text)]" />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="editable-mono hidden items-center gap-1.5 rounded-[4px] bg-[var(--slot4-page-text)] px-4 py-2 text-[1rem] font-medium tracking-[0.18em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)] sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="editable-mono hidden items-center gap-1.5 rounded-[4px] px-3 py-2 text-[0.7rem] font-medium tracking-[0.18em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="editable-mono hidden items-center gap-1.5 rounded-[4px] border border-transparent px-3 py-2 text-[0.7rem] font-medium tracking-[0.18em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="editable-mono hidden items-center gap-1.5 rounded-[4px] bg-[var(--slot4-page-text)] px-4 py-2 text-[0.7rem] font-medium tracking-[0.18em] text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-highlight)] hover:text-[var(--slot4-on-highlight)] sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-on-accent)] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-6 md:hidden">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-1">
            {[{ label: 'Home', href: '/' }, ...staticLinks, { label: 'Search', href: '/search' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`editable-mono border-b border-[var(--editable-border)] py-4 text-[0.72rem] tracking-[0.2em] ${
                  isActive(item.href)
                    ? 'text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-wrap gap-2">
              {session ? (
                <>
                  <Link
                    href="/create"
                    onClick={() => setOpen(false)}
                    className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--slot4-page-text)] px-4 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-on-accent)]"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Submit
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setOpen(false) }}
                    className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--editable-border)] px-4 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--slot4-page-text)] px-4 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-page-text)]"
                  >
                    <LogIn className="h-3.5 w-3.5" /> Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="editable-mono inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--slot4-page-text)] px-4 py-2.5 text-[0.72rem] tracking-[0.18em] text-[var(--slot4-on-accent)]"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Get started
                  </Link>
                </>
              )}
            </div>
            <p className="editable-mono mt-6 text-[0.6rem] tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </p>
          </div>
        </div>
      ) : null}
    </header>
  )
}
