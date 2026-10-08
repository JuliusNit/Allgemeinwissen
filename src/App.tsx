import { useEffect, useState } from 'react'
import { AREAS, type AreaId } from './data/plan'
import { dueCards } from './lib/srs'
import { cloud, useAuth } from './lib/cloud'
import { useStore } from './lib/store'
import { Icon, type IconName } from './components/Icons'
import { HatchDefs } from './components/Ink'
import { CommunityView } from './views/CommunityView'
import { DayView } from './views/DayView'
import { ExamView } from './views/ExamView'
import { HomeView } from './views/HomeView'
import { Onboarding } from './views/Onboarding'
import { ProfileView } from './views/ProfileView'
import { ReviewView } from './views/ReviewView'
import { BasisView } from './views/BasisView'
import { StatsView } from './views/StatsView'

type Tab = 'exam' | 'home' | 'chat' | 'stats' | 'profil'

type Route =
  | { tab: 'home'; day?: number; review?: string; vday?: number; video?: string; at?: number }
  | { tab: 'chat'; channel?: string }
  | { tab: 'stats'; area?: AreaId; day?: number }
  | { tab: 'profil' }
  | { tab: 'exam'; day?: number }

function parseHash(): Route {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [a, b, c, d, e, f] = parts
  if (a === 'tag' && b) {
    const day = Math.min(90, Math.max(1, Number(b) || 1))
    if (c === 'video' && d) return { tab: 'home', day, video: decodeURIComponent(d), at: e ? Number(e) || 0 : undefined }
    return { tab: 'home', day }
  }
  if (a === 'wiederholung' && b) {
    if (c === 'video' && d && e) return { tab: 'home', review: b, vday: Math.min(90, Math.max(1, Number(d) || 1)), video: decodeURIComponent(e), at: f ? Number(f) || 0 : undefined }
    return { tab: 'home', review: b }
  }
  if (a === 'chat') return { tab: 'chat', channel: b }
  if (a === 'statistik') {
    const area = b && b in AREAS ? (b as AreaId) : undefined
    return { tab: 'stats', area, day: area && c ? Number(c) || undefined : undefined }
  }
  if (a === 'profil') return { tab: 'profil' }
  if (a === 'pruefung') return { tab: 'exam', day: b ? Math.min(90, Math.max(1, Number(b) || 1)) : undefined }
  return { tab: 'home' }
}

const NAV: { tab: Tab; label: string; icon: IconName; hash: string }[] = [
  { tab: 'exam', label: 'Prüfung', icon: 'EXAM', hash: '/pruefung' },
  { tab: 'chat', label: 'Austausch', icon: 'CHAT', hash: '/chat' },
  { tab: 'home', label: 'Home', icon: 'HOME', hash: '/' },
  { tab: 'stats', label: 'Statistik', icon: 'STATS', hash: '/statistik' },
  { tab: 'profil', label: 'Profil', icon: 'PROFILE', hash: '/profil' },
]

/** Video aus der Session heraus geoeffnet → Schliessen = Zurueck im Verlauf */
let videoFromSession = false

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash)
  const due = useStore((s) => dueCards(s.cards).length)
  const hasLevel = useStore((s) => !!s.level)
  const auth = useAuth()

  useEffect(() => {
    // Video-Ansicht liegt ueber der Session: beim Oeffnen/Schliessen Scrollposition behalten
    const base = (h: string) => h.replace(/\/video\/.*$/, '')
    let last = location.hash
    const on = () => {
      setRoute(parseHash())
      if (base(location.hash) !== base(last)) window.scrollTo(0, 0)
      last = location.hash
      if (!location.hash.includes('/video/')) videoFromSession = false
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = (hash: string) => {
    location.hash = hash
  }

  // Erst Einfuehrung + Konto (mit Server) bzw. Wissensstand (ohne Server)
  if (!auth.ready) return <div className="app"><HatchDefs /></div>
  if ((cloud && (!auth.user || auth.recovery)) || !hasLevel) {
    return (
      <div className="app onboarding">
        <HatchDefs />
        <Onboarding />
      </div>
    )
  }

  return (
    <div className={`app tab-${route.tab}`}>
      <HatchDefs />
      <main>
        {route.tab === 'home' &&
          (route.day ? (
            <DayView
              key={route.day}
              day={route.day}
              video={route.video}
              at={route.at}
              openDay={(n) => go(`/tag/${n}`)}
              openStation={(id) => go(`/wiederholung/${id}`)}
              openVideo={(id, t) => {
                const hash = `#/tag/${route.day}/video/${encodeURIComponent(id)}${t !== undefined ? `/${Math.floor(t)}` : ''}`
                // Video zu Video ersetzt den Verlaufseintrag, damit "Zurueck" direkt zur Session fuehrt
                if (route.video) location.replace(hash)
                else {
                  videoFromSession = true
                  location.hash = hash
                }
              }}
              closeVideo={() => {
                if (videoFromSession) history.back()
                else go(`/tag/${route.day}`)
                videoFromSession = false
              }}
              back={() => go('/')}
            />
          ) : route.review ? (
            route.review.startsWith('g-') ? (
              <BasisView
                key={route.review}
                id={route.review}
                go={go}
                vday={route.vday}
                video={route.video}
                at={route.at}
                openVideo={(day, id, t) => {
                  const hash = `#/wiederholung/${route.review}/video/${day}/${encodeURIComponent(id)}${t !== undefined ? `/${Math.floor(t)}` : ''}`
                  if (route.video) location.replace(hash)
                  else {
                    videoFromSession = true
                    location.hash = hash
                  }
                }}
                closeVideo={() => {
                  if (videoFromSession) history.back()
                  else go(`/wiederholung/${route.review}`)
                  videoFromSession = false
                }}
              />
            ) : (
              <ReviewView key={route.review} id={route.review} go={go} />
            )
          ) : (
            <HomeView go={go} />
          ))}
        {route.tab === 'chat' && <CommunityView channel={route.channel} go={go} />}
        {route.tab === 'stats' && <StatsView area={route.area} day={route.day} go={go} />}
        {route.tab === 'profil' && <ProfileView />}
        {route.tab === 'exam' && <ExamView day={route.day} go={go} />}
      </main>
      <nav className="bottom">
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
