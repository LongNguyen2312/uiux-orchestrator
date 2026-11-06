import { useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Help from './pages/Help'
import Verify from './pages/Verify'

const routes: Record<string, () => React.JSX.Element> = {
  '/dashboard': Dashboard,
  '/settings': Settings,
  '/pricing': Pricing,
  '/help': Help,
  '/verify': Verify,
}

function useHashRoute() {
  const read = () => window.location.hash.replace(/^#/, '') || '/dashboard'
  const [path, setPath] = useState(read)
  useEffect(() => {
    const onChange = () => setPath(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export default function App() {
  const path = useHashRoute()
  const Page = routes[path] ?? Dashboard
  return (
    <div className="min-h-screen">
      <Nav current={path} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Page />
      </main>
    </div>
  )
}
