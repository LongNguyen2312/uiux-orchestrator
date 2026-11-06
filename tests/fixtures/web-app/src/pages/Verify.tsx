import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

export default function Verify() {
  const [code, setCode] = useState('')
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <Card description="We sent a 6-digit code to jordan@acme.example.">
        <input
          aria-label="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-10 w-full rounded-lg border border-line bg-surface px-3"
        />
        <Button className="mt-4 w-full" disabled={code.length !== 6}>Verify</Button>
      </Card>
    </div>
  )
}
