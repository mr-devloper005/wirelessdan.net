'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

/*
  IntersectionObserver-driven fade + slide-up reveal.

  - Hidden state is only applied *after* mount, so JS-off / hydrating visitors
    still see content (progressive enhancement).
  - `index` adds a small stagger via inline transitionDelay, so a grid of
    cards reveals in sequence rather than all at once.
  - Honors prefers-reduced-motion via the CSS in editable-global.css.
*/

type Props = {
  children: ReactNode
  index?: number
  /** ms per index. Total stagger = index * step. */
  step?: number
  /** Extra classes to compose on the wrapper element. */
  className?: string
  /** Render as inline block, e.g. for inline eyebrows. */
  as?: 'div' | 'span' | 'section' | 'article' | 'li'
  /** Once revealed, keep it revealed. */
  once?: boolean
  style?: CSSProperties
}

export function EditableReveal({
  children,
  index = 0,
  step = 60,
  className = '',
  as: Tag = 'div',
  once = true,
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [mounted, once])

  const state = !mounted ? '' : visible ? 'is-visible' : 'is-hidden'
  const delay = Math.max(0, index) * step
  const composedStyle: CSSProperties = {
    ...style,
    animationDelay: state === 'is-visible' ? `${delay}ms` : undefined,
  }

  return (
    <Tag
      ref={ref as never}
      className={`editable-reveal ${state} ${className}`.trim()}
      style={composedStyle}
    >
      {children}
    </Tag>
  )
}
