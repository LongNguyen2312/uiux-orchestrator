import { useState } from 'react'
import { Card } from '../components/Card'

const faqs = [
  { q: 'How is usage billed?', a: 'Usage is billed monthly per 1,000 API calls. You can set a spend cap in Settings → Billing.' },
  { q: 'Can I change plans later?', a: 'Yes. Upgrades apply immediately and are prorated; downgrades apply at the end of the billing period.' },
  { q: 'Where is my data stored?', a: 'In the EU (Frankfurt) by default. Enterprise plans can choose a US region.' },
]

export default function Help() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Help</h1>
      <Card title="Frequently asked questions">
        <ul className="divide-y divide-line">
          {faqs.map((f, i) => (
            <li key={f.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-3 text-left text-sm font-medium"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <span aria-hidden>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className="pb-3 text-sm text-ink-muted">{f.a}</p>}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
