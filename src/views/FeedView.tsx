import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode, type WheelEvent as RWheelEvent } from 'react'
import { biteDur, imgUrl, loadBites, type Bite, type Mood } from '../data/feed'
import { AREAS } from '../data/plan'
import { canOpen, isPremium, markOpened, mergeVisit, pickNext, toggleSaved, type Visit } from '../lib/feed'
import { useAuth } from '../lib/cloud'
import { haptic } from '../lib/native'
import { sessionNo } from '../lib/path'
import { duck, setSound, sfx, startBite, stopAll } from '../lib/sound'
import { getState, setState, useStore } from '../lib/store'
import { Icon } from '../components/Icons'
import { Frame, InkPaths } from '../components/Ink'
import { bez, line } from '../lib/ink'
import { ScenePlayer } from '../lib/scene'

// Entdecken: Wissenshäppchen wie kurze Videos. Hoch/runter wischen = nächstes/voriges Häppchen,
// links/rechts wischen oder an den Rändern tippen = vor/zurück innerhalb, Mitte tippen oder Finger halten = Pause. Die Szenen spielt lib/scene.ts ab,
// danach kommt die Zusammenfassung mit Merken / Session / Quellen.

const PAYWALL = '__premium'

export default function FeedView({ bite, go }: { bite?: string; go: (hash: string) => void }) {
  const [bites, setBites] = useState<Bite[] | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState<'up' | 'down'>('up')
  const sound = useStore((s) => s.feedSound ?? true)
  const auth = useAuth()
  const premium = isPremium(auth.role)

  useEffect(() => {
    void loadBites().then(setBites)
    return () => stopAll()
  }, [])

  useEffect(() => setSound(sound), [sound])

  // erstes Häppchen: aus dem Link (Gemerkt) oder vom Algorithmus
  useEffect(() => {
    if (!bites || queue.length) return
    const first = (bite && bites.find((b) => b.id === bite)) || pickNext(getState(), bites, [])
    if (first) setQueue([canOpen(getState(), first.id, premium) ? first.id : PAYWALL])
  }, [bites, bite, queue.length, premium])

  const byId = useMemo(() => new Map((bites ?? []).map((b) => [b.id, b])), [bites])
  const cur = queue[idx]

  const next = useCallback(() => {
    if (!bites || cur === PAYWALL) return
    setDir('up')
    sfx.swipe()
    if (idx < queue.length - 1) {
      setIdx(idx + 1)
      return
    }
    const shown = queue.filter((q) => q !== PAYWALL)
    const n = pickNext(getState(), bites, shown)
    if (!n) return
    setQueue([...queue, canOpen(getState(), n.id, premium) ? n.id : PAYWALL])
    setIdx(idx + 1)
  }, [bites, cur, idx, queue, premium])

  const prev = useCallback(() => {
    if (idx === 0) return
    setDir('down')
    sfx.swipe()
    setIdx(idx - 1)
  }, [idx])

  // Vorschau: Bild des wahrscheinlich nächsten Häppchens vorladen
  useEffect(() => {
    if (!bites || !cur || cur === PAYWALL) return
    const t = setTimeout(() => {
      const n = idx < queue.length - 1 ? byId.get(queue[idx + 1]) : pickNext(getState(), bites, queue.filter((q) => q !== PAYWALL))
      if (n) n.images.forEach((im) => (new Image().src = imgUrl(im.file)))
    }, 1500)
    return () => clearTimeout(t)
  }, [bites, byId, cur, idx, queue])

  const b = cur && cur !== PAYWALL ? byId.get(cur) : undefined

  return (
    <div className="feed">
      <button className="feed-sound" onClick={() => setState((s) => ({ ...s, feedSound: !sound }))} aria-label={sound ? 'Ton aus' : 'Ton an'} aria-pressed={sound}>
        <Icon name={sound ? 'SOUND' : 'MUTE'} size={26} />
      </button>
      {!bites ? null : cur === PAYWALL ? (
        <Paywall key={`p${idx}`} prev={prev} />
      ) : b ? (
        <BitePlayer key={`${b.id}-${idx}`} bite={b} dir={dir} next={next} prev={prev} go={go} />
      ) : queue.length ? null : (
        <div className="feed-empty">
          <Frame className="card empty">
            <p>Alles gesehen.</p>
          </Frame>
        </div>
      )}
    </div>
  )
}

function Paywall({ prev }: { prev: () => void }) {
  const ref = useSwipe({ up: () => {}, down: prev, left: () => {}, right: () => {}, tap: () => {} })
  return (
    <div className="bite feed-in-up" {...ref}>
      <div className="paywall">
        <Frame className="card">
          <Icon name="CRYSTAL" size={40} />
          <h2>Premium</h2>
          <p className="small">Heute 3 von 3 Häppchen.</p>
          <button className="btn primary wide" disabled>
            Premium – bald verfügbar
          </button>
        </Frame>
      </div>
    </div>
  )
}

interface SwipeHandlers {
  up: () => void
  down: () => void
  left: () => void
  right: () => void
  tap: (x: number, w: number) => void
  hold?: (on: boolean) => void
}

/** Wischen, Tippen, Halten auf einer Fläche */
function useSwipe(h: SwipeHandlers) {
  const st = useRef<{ x: number; y: number; t: number; held: boolean; timer?: number } | null>(null)
  const hr = useRef(h)
  hr.current = h
  return {
    onPointerDown(e: RPointerEvent<HTMLDivElement>) {
      if ((e.target as HTMLElement).closest('button,a')) return
      const s = { x: e.clientX, y: e.clientY, t: Date.now(), held: false, timer: 0 }
      s.timer = window.setTimeout(() => {
        s.held = true
        hr.current.hold?.(true)
      }, 320)
      st.current = s
    },
    onPointerMove(e: RPointerEvent<HTMLDivElement>) {
      const s = st.current
      if (s && !s.held && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 12) clearTimeout(s.timer)
    },
    onPointerUp(e: RPointerEvent<HTMLDivElement>) {
      const s = st.current
      st.current = null
      if (!s) return
      clearTimeout(s.timer)
      if (s.held) {
        hr.current.hold?.(false)
        return
      }
      const dx = e.clientX - s.x
      const dy = e.clientY - s.y
      if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) (dy < 0 ? hr.current.up : hr.current.down)()
      else if (Math.abs(dx) > 40) (dx < 0 ? hr.current.left : hr.current.right)()
      else {
        const r = e.currentTarget.getBoundingClientRect()
        hr.current.tap(e.clientX - r.left, r.width)
      }
    },
    onPointerCancel() {
      const s = st.current
      st.current = null
      if (s) {
        clearTimeout(s.timer)
        if (s.held) hr.current.hold?.(false)
      }
    },
  }
}

function BitePlayer({ bite: b, dir, next, prev, go }: { bite: Bite; dir: 'up' | 'down'; next: () => void; prev: () => void; go: (hash: string) => void }) {
  const N = b.scenes.length // Schritt N = Zusammenfassung
  const [step, setStep] = useState(0)
  const [t, setT] = useState(0)
  const [hold, setHold] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const saved = useStore((s) => s.feed.saved.includes(b.id))
  const level = useStore((s) => s.level)
  const focus = useStore((s) => s.focus)
  const ctx = { level, focus }
  const [stopped, setStopped] = useState(false)
  const [dur, setDur] = useState(Infinity)
  const paused = hold || hidden || stopped
  const visit = useRef<Visit>({ ms: 0, dur: biteDur(b), frac: 0, done: false, back: 0, holds: 0, link: 0 })
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<ScenePlayer | null>(null)

  // Start: Musik + Begrüßung, als geöffnet zählen; beim Verlassen Verhalten speichern
  useEffect(() => {
    setState((s) => markOpened(s, b.id))
    startBite(b.mood, b.ambience)
    sfx.intro(b.mood)
    const v = visit.current
    let saved = false
    const save = () => {
      if (saved || v.ms <= 300) return
      saved = true
      setState((s) => mergeVisit(s, b.id, v))
    }
    // App geschlossen oder neu geladen: Besuch trotzdem zählen
    window.addEventListener('pagehide', save)
    return () => {
      window.removeEventListener('pagehide', save)
      save()
    }
  }, [b])

  // Bühne
  useEffect(() => {
    const p = new ScenePlayer(host.current!, b, { words: () => sfx.pluck(b.mood), key: () => sfx.stroke() })
    player.current = p
    setDur(p.show(0))
    return () => {
      p.destroy()
      player.current = null
    }
  }, [b])

  useEffect(() => {
    const on = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  useEffect(() => {
    duck(paused)
    player.current?.pause(paused)
  }, [paused])

  // Uhr: Fortschritt in der Szene, Sehzeit
  useEffect(() => {
    if (paused) return
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const d = Math.min(100, now - last)
      last = now
      visit.current.ms += d
      setT((x) => x + d)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  const goStep = useCallback(
    (n: number) => {
      if (n < 0 || n > N || n === step) return
      const forward = n > step
      if (!forward) visit.current.back++
      setStep(n)
      setT(0)
      setStopped(false)
      setDur(player.current?.show(n) ?? Infinity)
      if (n === N) sfx.outro(b.mood)
      else sfx.whoosh(forward)
    },
    [N, b, step],
  )

  // automatisch weiter
  useEffect(() => {
    if (t >= dur) goStep(step + 1)
  }, [t, dur, step, goStep])

  // Fortschritt merken
  useEffect(() => {
    const v = visit.current
    v.frac = Math.max(v.frac, Math.min(1, (step + (Number.isFinite(dur) ? Math.min(1, t / dur) : 0)) / N))
    if (step === N) v.done = true
  }, [step, t, dur, N])

  // Tastatur (Desktop)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goStep(step + 1)
      else if (e.key === 'ArrowLeft') goStep(step - 1)
      else if (e.key === 'ArrowDown') next()
      else if (e.key === 'ArrowUp') prev()
      else if (e.key === ' ') {
        e.preventDefault()
        setStopped((h) => !h)
      } else return
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [goStep, next, prev, step])

  // Mausrad (Desktop): ein Häppchen pro Bewegung
  const wheelAt = useRef(0)
  const onWheel = (e: RWheelEvent) => {
    if (Math.abs(e.deltaY) < 30 || Date.now() - wheelAt.current < 800) return
    wheelAt.current = Date.now()
    if (e.deltaY > 0) next()
    else prev()
  }

  const swipe = useSwipe({
    up: next,
    down: prev,
    left: () => goStep(step + 1),
    right: () => goStep(step - 1),
    // Ränder: vor/zurück, Mitte: Pause an/aus
    tap: (x, w) => {
      if (x < w * 0.25) goStep(step - 1)
      else if (x > w * 0.75) goStep(step + 1)
      else
        setStopped((on) => {
          if (!on) visit.current.holds++
          return !on
        })
    },
    hold: (on) => {
      setHold(on)
      if (on) visit.current.holds++
    },
  })

  const day = b.day
  const no = day ? sessionNo(ctx, day) : undefined

  return (
    <div className={`bite feed-in-${dir}${paused ? ' paused' : ''}`} {...swipe} onWheel={onWheel}>
      <div className="bite-stage" ref={host} />
      {stopped && (
        <div className="bite-pause" aria-label="Pause">
          <svg viewBox="0 0 24 24" aria-hidden>
            <InkPaths strokes={PAUSE} w={2.6} />
          </svg>
        </div>
      )}
      <div className="bite-area">
        <Icon name={b.area} size={20} />
        <span>{AREAS[b.area].name}</span>
      </div>
      {step === N && (
        <div className="bite-sum">
          <h2>Kurz gesagt</h2>
          <ul>
            {b.summary.map((x, i) => (
              <li key={i} style={{ animationDelay: `${300 + i * 380}ms` }}>
                <Words text={x} delay={300 + i * 380} step={0} />
              </li>
            ))}
          </ul>
          <div className="row bite-actions">
            <button
              className="btn"
              onClick={() => {
                setState((x) => toggleSaved(x, b.id))
                if (!saved) {
                  sfx.save()
                  haptic('leicht')
                }
              }}
              aria-pressed={saved}
            >
              <Icon name="BOOKMARK" size={18} hatched={saved} /> {saved ? 'Gemerkt' : 'Merken'}
            </button>
            {day && (
              <button
                className="btn"
                onClick={() => {
                  visit.current.link++
                  go(`/thema/${day}`)
                }}
              >
                {no ? `Session ${no}` : 'Zur Session'}
              </button>
            )}
          </div>
          <p className="bite-credits small muted">{b.sources.join(' · ')}</p>
          <div className="bite-next" aria-hidden>
            <Chevron />
          </div>
        </div>
      )}
    </div>
  )
}

/** Text Wort für Wort; **fett** wird nach dem Erscheinen mit Tusche unterstrichen */
function Words({ text, delay, step, sound }: { text: string; delay: number; step: number; sound?: Mood }) {
  const parts = useMemo(() => {
    const out: { w: string; bold: boolean }[] = []
    text.split(/(\*\*[^*]+\*\*)/).forEach((seg) => {
      const bold = seg.startsWith('**') && seg.endsWith('**')
      const clean = bold ? seg.slice(2, -2) : seg
      clean.split(/(\s+)/).forEach((w) => w && out.push({ w, bold }))
    })
    return out
  }, [text])

  // Ton: gezupft beim Erscheinen, Federstrich bei Schlüsselwörtern
  useEffect(() => {
    if (!sound) return
    const timers = [window.setTimeout(() => sfx.pluck(sound), delay)]
    let i = 0
    let n = 0
    let inBold = false
    for (const p of parts) {
      if (!/\s/.test(p.w)) i++
      if (p.bold && !inBold && n < 3) {
        timers.push(window.setTimeout(() => sfx.stroke(), delay + i * step + 420))
        n++
      }
      inBold = p.bold
    }
    return () => timers.forEach(clearTimeout)
  }, [parts, delay, step, sound])

  let i = 0
  const nodes: ReactNode[] = []
  let k = 0
  while (k < parts.length) {
    const p = parts[k]
    if (p.bold) {
      const group: string[] = []
      const start = i
      while (k < parts.length && parts[k].bold) {
        group.push(parts[k].w)
        if (!/\s/.test(parts[k].w)) i++
        k++
      }
      nodes.push(
        <span key={`b${k}`} className="w key" style={{ animationDelay: `${delay + start * step}ms` }}>
          {group.join('')}
          <Underline delay={delay + i * step + 300} />
        </span>,
      )
      continue
    }
    if (/\s/.test(p.w)) nodes.push(p.w)
    else {
      nodes.push(
        <span key={k} className="w" style={{ animationDelay: `${delay + i * step}ms` }}>
          {p.w}
        </span>,
      )
      i++
    }
    k++
  }
  return <>{nodes}</>
}

const PAUSE = [line([8.5, 5], [8.5, 19]), line([15.5, 5], [15.5, 19])]

const UNDERLINE = [bez([1, 5.4], [30, 2.6], [64, 6.4], [99, 3.4], 1.25)]

function Underline({ delay }: { delay: number }) {
  return (
    <svg className="key-line" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden style={{ animationDelay: `${delay}ms` }}>
      <InkPaths strokes={UNDERLINE} w={2.4} />
    </svg>
  )
}

const CHEVRON = [bez([4, 15], [8, 11], [12, 7.5], [12, 7.5]), bez([12, 7.5], [12, 7.5], [16, 11], [20, 15])]

function Chevron() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
      <InkPaths strokes={CHEVRON} w={1.8} />
    </svg>
  )
}
