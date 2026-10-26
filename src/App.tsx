import { lazy, Suspense, useEffect, useState } from 'react'
import { AREAS, MAX_DAY, type AreaId } from './data/plan'
import { dueCards } from './lib/srs'
import { cloud, useAuth } from './lib/cloud'
import { useStore } from './lib/store'
import { Icon, type IconName } from './components/Icons'
import { HatchDefs } from './components/Ink'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DayView } from './views/DayView'
import { ExamView } from './views/ExamView'
import { HomeView } from './views/HomeView'
import { Onboarding } from './views/Onboarding'
import { parseSection, ProfileView, type ProfileSection } from './views/ProfileView'
import { unlockAudio } from './lib/sound'
import { ReviewView } from './views/ReviewView'
import { BasisView } from './views/BasisView'
import { StatsView } from './views/StatsView'
import { TopicView } from './views/TopicView'
import { LegalView, type LegalPage } from './views/LegalView'

// Austausch (views/CommunityView.tsx) ist vorerst ausgeblendet; an seiner Stelle steht „Entdecken“
const FeedView = lazy(() => import('./views/FeedView'))

type Tab = 'exam' | 'home' | 'feed' | 'stats' | 'profil'

type Route =
  | { tab: 'home'; day?: number; topic?: number; review?: string; vday?: number; video?: string; at?: number }
  | { tab: 'feed'; bite?: string }
  | { tab: 'stats'; area?: AreaId; day?: number }
  | { tab: 'profil'; legal?: LegalPage; section?: ProfileSection }
  | { tab: 'exam'; day?: number }

function parseHash(): Route {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [a, b, c, d, e, f] = parts
  if (a === 'tag' && b) {
    const day = Math.min(MAX_DAY, Math.max(1, Number(b) || 1))
    if (c === 'video' && d) return { tab: 'home', day, video: decodeURIComponent(d), at: e ? Number(e) || 0 : undefined }
    return { tab: 'home', day }
  }
  if (a === 'thema' && b) return { tab: 'home', topic: Math.min(MAX_DAY, Math.max(1, Number(b) || 1)) }
  if (a === 'wiederholung' && b) {
    if (c === 'video' && d && e) return { tab: 'home', review: b, vday: Math.min(MAX_DAY, Math.max(1, Number(d) || 1)), video: decodeURIComponent(e), at: f ? Number(f) || 0 : undefined }
    return { tab: 'home', review: b }
  }
  if (a === 'entdecken') return { tab: 'feed', bite: b ? decodeURIComponent(b) : undefined }
  if (a === 'statistik') {
    const area = b && b in AREAS ? (b as AreaId) : undefined
    return { tab: 'stats', area, day: area && c ? Number(c) || undefined : undefined }
  }
  if (a === 'profil') return { tab: 'profil', section: parseSection(b) }
  if (a === 'datenschutz' || a === 'impressum' || a === 'bildnachweis') return { tab: 'profil', legal: a }
  if (a === 'pruefung') return { tab: 'exam', day: b ? Math.min(MAX_DAY, Math.max(1, Number(b) || 1)) : undefined }
  return { tab: 'home' }
}

const NAV: { tab: Tab; label: string; icon: IconName; hash: string }[] = [
  { tab: 'exam', label: 'Prüfung', icon: 'EXAM', hash: '/pruefung' },
  { tab: 'feed', label: 'Entdecken', icon: 'FEED', hash: '/entdecken' },
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
  const guest = useStore((s) => !!s.guest)
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
    // Ton (Entdecken) erst nach einer Berührung erlaubt
    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    return () => {
      window.removeEventListener('hashchange', on)
      window.removeEventListener('pointerdown', unlockAudio)
    }
  }, [])

  const go = (hash: string) => {
    location.hash = hash
  }

  // Erst Einfuehrung + Konto (mit Server, ausser "Ohne Konto starten") bzw. Wissensstand
  if (!auth.ready) return <div className="app"><HatchDefs /></div>
  const legal = route.tab === 'profil' ? route.legal : undefined
  if ((cloud && (auth.recovery || (!auth.user && !guest) || (auth.user && auth.birthYear === null))) || !hasLevel) {
    // Rechtstexte ueber dem Formular; das Onboarding bleibt darunter offen, damit Eingaben erhalten bleiben
    return (
      <div className="app onboarding">
        <HatchDefs />
        <ErrorBoundary>
          {legal && <LegalView page={legal} />}
          <div hidden={!!legal}>
            <Onboarding />
          </div>
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <div className={`app tab-${route.tab}`}>
      <HatchDefs />
      <main>
        <ErrorBoundary resetKey={location.hash}>
        {route.tab === 'home' &&
          (route.topic ? (
            <TopicView key={route.topic} day={route.topic} go={go} />
          ) : route.day ? (
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
        {route.tab === 'feed' && (
          <Suspense fallback={null}>
            <FeedView bite={route.bite} go={go} />
          </Suspense>
        )}
        {route.tab === 'stats' && <StatsView area={route.area} day={route.day} go={go} />}
        {route.tab === 'profil' && (route.legal ? <LegalView page={route.legal} /> : <ProfileView section={route.section ?? 'ich'} go={go} />)}
        {route.tab === 'exam' && <ExamView day={route.day} go={go} />}
        </ErrorBoundary>
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
