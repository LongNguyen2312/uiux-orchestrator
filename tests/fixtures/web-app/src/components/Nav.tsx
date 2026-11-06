const items = [
  ['/dashboard', 'Dashboard'],
  ['/settings', 'Settings'],
  ['/pricing', 'Pricing'],
  ['/help', 'Help'],
  ['/verify', 'Verify'],
] as const

export function Nav({ current }: { current: string }) {
  return (
    <header className="border-b border-line bg-surface">
      <nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3" aria-label="Main">
        <span className="mr-4 font-semibold">Acme</span>
        {items.map(([href, label]) => (
          <a
            key={href}
            href={`#${href}`}
            aria-current={current === href ? 'page' : undefined}
            className={`rounded-md px-3 py-2 text-sm ${current === href ? 'bg-bg font-medium text-ink' : 'text-ink-muted hover:text-ink'}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
