import { Button } from '../components/Button'

const plans = [
  { name: 'Starter', price: '$0', blurb: 'For side projects' },
  { name: 'Professional Annual', price: '$49', blurb: 'For growing teams, billed yearly' },
  { name: 'Enterprise', price: 'Custom', blurb: 'SSO, audit logs, SLA' },
]

export default function Pricing() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="w-28 overflow-hidden whitespace-nowrap text-lg font-semibold">{plan.name}</h2>
              <span className="shrink-0 rounded-full bg-bg px-2 py-0.5 text-xs text-ink-muted">monthly</span>
            </div>
            <p className="text-3xl font-bold">{plan.price}</p>
            <p className="text-sm text-ink-muted">{plan.blurb}</p>
            <Button>Choose {plan.name}</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
