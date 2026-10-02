import { useEffect, useState } from 'react'
import { BLOCKS, DAYS } from './data/plan'
import { dueCards } from './lib/srs'
import { currentDay, dayState, useStore } from './lib/store'
import { DayView } from './views/DayView'
import { MapView } from './views/MapView'
import { PlanView } from './views/PlanView'
import { ReviewView } from './views/ReviewView'
import { SettingsView } from './views/SettingsView'

type View = 'heute' | 'plan' | 'karte' | 'wiederholen' | 'einstellungen'

interface Route {
  view: View
  day?: number
}

function parseHash(): Route {
  const h = location.hash.replace(/^#\/?/, '')
  const m = /^tag\/(\d+)$/.exec(h)
  if (m) return { view: 'heute', day: Math.min(90, Math.max(1, Number(m[1]))) }
  if (['plan', 'karte', 'wiederholen', 'einstellungen'].includes(h)) return { view: h as View }
  return { view: 'heute' }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash)
  const s = useStore((x) => x)
  const cur = currentDay(s)
  const due = dueCards(s.cards).length

  useEffect(() => {
    const on = () => {
      setRoute(parseHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = (hash: string) => {
    location.hash = hash
  }
  const openDay = (n: number) => go(`/tag/${n}`)
  const shownDay = route.day ?? cur

  const nav: { id: View; label: string; icon: string; hash: string; badge?: number }[] = [
    { id: 'heute', label: 'Heute', icon: '◉', hash: '/' },
    { id: 'plan', label: 'Plan', icon: '☰', hash: '/plan' },
    { id: 'karte', label: 'Landkarte', icon: '◈', hash: '/karte' },
    { id: 'wiederholen', label: 'Wiederholen', icon: '↻', hash: '/wiederholen', badge: due },
    { id: 'einstellungen', label: 'Einstellungen', icon: '⚙', hash: '/einstellungen' },
  ]

  return (
    <div className="app">
      <header className="top">
        <button className="brand" onClick={() => go('/')}>Allgemeinwissen</button>
        <Progress />
      </header>
      <main>
        {route.view === 'heute' && (
          <>
            {route.day && route.day !== cur && (
              <button className="btn ghost small back" onClick={() => go('/')}>← zur aktuellen Session (Tag {cur})</button>
            )}
            <DayView key={shownDay} day={shownDay} openDay={openDay} />
          </>
        )}
        {route.view === 'plan' && <PlanView openDay={openDay} />}
        {route.view === 'karte' && <MapView openDay={openDay} />}
        {route.view === 'wiederholen' && <ReviewView openDay={openDay} />}
        {route.view === 'einstellungen' && <SettingsView />}
      </main>
      <nav className="bottom">
        {nav.map((n) => (
          <button key={n.id} className={route.view === n.id ? 'active' : ''} onClick={() => go(n.hash)}>
            <span className="nav-icon">{n.icon}{!!n.badge && <span className="nav-badge">{n.badge}</span>}</span>
            <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function Progress() {
  const s = useStore((x) => x)
  const done = (d: number) => dayState(s, d).status === 'fertig'
  const p1 = DAYS.filter((d) => d.phase === 1).map((d) => (done(d.day) ? '☑' : '☐')).join('')
  const blocks = BLOCKS.slice(1).map((b) => {
    const all = DAYS.filter((d) => d.block === b.id)
    return all.every((d) => done(d.day)) ? '☑' : all.some((d) => done(d.day)) ? '◐' : '☐'
  })
  const total = DAYS.filter((d) => done(d.day)).length
  return (
    <div className="progress-top" title="Phase 1 · Blöcke 1–7">
      <span>P1 {p1}</span>
      <span>B {blocks.join('')}</span>
      <span className="muted">{total}/90</span>
    </div>
  )
}
