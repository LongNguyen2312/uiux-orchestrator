import type { ReactNode } from 'react'

export function Card({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
      {title && <h2 className="text-base font-semibold">{title}</h2>}
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      <div className={title || description ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}
