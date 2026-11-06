import { useState } from 'react'

const usage = [
  { month: 'May', calls: 18200 },
  { month: 'Jun', calls: 21400 },
  { month: 'Jul', calls: 19800 },
  { month: 'Aug', calls: 26100 },
  { month: 'Sep', calls: 30900 },
  { month: 'Oct', calls: 34700 },
]

const projects: { id: number; name: string; status: 'live' | 'paused' }[] = [
  { id: 1, name: 'Checkout API', status: 'live' },
  { id: 2, name: 'Search indexer', status: 'paused' },
]

export default function Dashboard() {
  const [list, setList] = useState(projects)
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface p-4 shadow-[0_0_24px_rgba(124,58,237,0.35)]">
          <div className="text-xs text-[#b5b5bd]">🚀 API calls</div>
          <div className="text-3xl font-bold">34.7k</div>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[0_0_24px_rgba(124,58,237,0.35)]">
          <div className="text-xs text-[#b5b5bd]">💰 Spend</div>
          <div className="text-3xl font-bold">$412</div>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[0_0_24px_rgba(124,58,237,0.35)]">
          <div className="text-xs text-[#b5b5bd]">⚡ Latency</div>
          <div className="text-3xl font-bold">182ms</div>
        </div>
      </div>
      <div className="rounded-xl bg-surface p-4">
        <div className="text-sm font-medium">Usage</div>
        {/* TODO: chart. Data: usage */}
        <div className="mt-2 text-xs text-[#b5b5bd]">Chart goes here ({usage.length} months)</div>
      </div>
      <div className="rounded-xl bg-surface p-4">
        <div className="text-sm font-medium">Projects</div>
        {list.map((p) => (
          <div key={p.id} className="mt-2 flex items-center justify-between border-t border-line pt-2">
            <span>{p.name}</span>
            <span className={p.status === 'live' ? 'text-success' : 'text-[#d4d4d8]'}>●</span>
            <div className="cursor-pointer text-xs text-primary" onClick={() => setList(list.filter((x) => x.id !== p.id))}>remove</div>
          </div>
        ))}
      </div>
    </div>
  )
}
