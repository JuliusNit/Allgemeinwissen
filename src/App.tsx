import { useEffect, useState } from 'react'
import { AREAS, type AreaId } from './data/plan'
import { dueCards } from './lib/srs'
import { useStore } from './lib/store'
import { Icon, type IconName } from './components/Icons'
import { HatchDefs } from './components/Ink'
import { CommunityView } from './views/CommunityView'
import { DayView } from './views/DayView'
import { HomeView } from './views/HomeView'
import { ProfileView } from './views/ProfileView'
import { ReviewView } from './views/ReviewView'
import { StatsView } from './views/StatsView'

type Tab = 'home' | 'chat' | 'stats' | 'profil'

type Route =
  | { tab: 'home'; day?: number; review?: string }
  | { tab: 'chat'; channel?: string }
  | { tab: 'stats'; area?: AreaId; day?: number }
  | { tab: 'profil' }

function parseHash(): Route {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [a, b, c] = parts
  if (a === 'tag' && b) return { tab: 'home', day: Math.min(90, Math.max(1, Number(b) || 1)) }
  if (a === 'wiederholung' && b) return { tab: 'home', review: b }
  if (a === 'chat') return { tab: 'chat', channel: b }
  if (a === 'statistik') {
    const area = b && b in AREAS ? (b as AreaId) : undefined
    return { tab: 'stats', area, day: area && c ? Number(c) || undefined : undefined }
  }
  if (a === 'profil') return { tab: 'profil' }
  return { tab: 'home' }
}

const NAV: { tab: Tab; label: string; icon: IconName; hash: string }[] = [
  { tab: 'chat', label: 'Austausch', icon: 'CHAT', hash: '/chat' },
  { tab: 'home', label: 'Home', icon: 'HOME', hash: '/' },
  { tab: 'stats', label: 'Statistik', icon: 'STATS', hash: '/statistik' },
  { tab: 'profil', label: 'Profil', icon: 'PROFILE', hash: '/profil' },
]

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash)
  const due = useStore((s) => dueCards(s.cards).length)

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

  return (
    <div className={`app tab-${route.tab}`}>
      <HatchDefs />
      <main>
        {route.tab === 'home' &&
          (route.day ? (
            <DayView key={route.day} day={route.day} openDay={(n) => go(`/tag/${n}`)} back={() => go('/')} />
          ) : route.review ? (
            <ReviewView key={route.review} id={route.review} go={go} />
          ) : (
            <HomeView go={go} />
          ))}
        {route.tab === 'chat' && <CommunityView channel={route.channel} go={go} />}
        {route.tab === 'stats' && <StatsView area={route.area} day={route.day} go={go} />}
        {route.tab === 'profil' && <ProfileView />}
      </main>
      <nav className="bottom">
        {/* linker Platz bleibt vorerst frei */}
        <div className="nav-slot empty" aria-hidden />
        {NAV.map((n) => {
          const active = route.tab === n.tab
          return (
            <button key={n.tab} className={`nav-slot ${active ? 'active' : ''}`} onClick={() => go(n.hash)} aria-label={n.label} aria-current={active ? 'page' : undefined}>
              <Icon name={n.icon} size={n.tab === 'home' ? 34 : 30} hatched={active} w={1.7} />
              {n.tab === 'home' && due > 0 && <span className="nav-badge">{due}</span>}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
