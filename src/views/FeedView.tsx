import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode, type WheelEvent as RWheelEvent } from 'react'
import { imgUrl, loadBites, VERDICT_LABEL, type Bite, type Mood } from '../data/feed'
import { AREAS } from '../data/plan'
import { canOpen, isPremium, markOpened, mergeVisit, pickNext, toggleSaved, type Visit } from '../lib/feed'
import { useAuth } from '../lib/cloud'
import { haptic } from '../lib/native'
import { sessionNo } from '../lib/path'
import { duck, setSound, sfx, startBite, stopAll } from '../lib/sound'
import { getState, setState, useStore } from '../lib/store'
import { Icon } from '../components/Icons'
import { Frame, InkBorder, InkPaths } from '../components/Ink'
import { bez } from '../lib/ink'

// Entdecken: Wissenshäppchen wie kurze Videos. Hoch/runter wischen = nächstes/voriges Häppchen,
// links/rechts (oder tippen) = vor/zurück innerhalb, Finger halten = Pause.

const PAYWALL = '__premium'
const STEPS = 6 // Aufhänger, 3 Absätze, Stempel, Zusammenfassung
const SUMMARY = STEPS - 1

const words = (t: string) => t.split(/\s+/).filter(Boolean).length

/** Anzeigedauer je Schritt (ms): Begrüßung + Lesezeit (~180 Wörter/min), Zusammenfassung bleibt stehen */
function stepDur(b: Bite, step: number): number {
  if (step === 0) return 2600 + words(b.hook) * 260
  if (step <= 3) return 2400 + words(b.slides[step - 1].text) * 330
  if (step === 4) return 2600 + words(b.why) * 300
  return Infinity
}

function expectedDur(b: Bite): number {
  let d = 0
  for (let i = 0; i < SUMMARY; i++) d += stepDur(b, i)
  return d + 3000 + b.summary.reduce((a, x) => a + words(x) * 300, 0)
}

const DEFAULT_CAMS: [number, number, number][] = [
  [50, 40, 1.08],
  [32, 36, 1.4],
  [68, 56, 1.35],
  [50, 46, 1.15],
  [50, 50, 1.02],
  [50, 50, 1],
]

function camOf(b: Bite, step: number): { img: number; cam: [number, number, number] } {
  if (step === 0) return { img: 0, cam: b.cam ?? DEFAULT_CAMS[0] }
  if (step <= 3) {
    let img = 0
    for (let i = 0; i < step; i++) if (b.slides[i].img != null) img = b.slides[i].img!
    return { img, cam: b.slides[step - 1].cam ?? DEFAULT_CAMS[step] }
  }
  return { img: b.images.length > 1 ? b.images.length - 1 : 0, cam: DEFAULT_CAMS[step] }
}

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
  const [step, setStep] = useState(0)
  const [t, setT] = useState(0)
  const [hold, setHold] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [fwd, setFwd] = useState(true)
  const [prevStep, setPrevStep] = useState<number | null>(null)
  const saved = useStore((s) => s.feed.saved.includes(b.id))
  const level = useStore((s) => s.level)
  const paused = hold || hidden
  const visit = useRef<Visit>({ ms: 0, dur: expectedDur(b), frac: 0, done: false, back: 0, holds: 0, link: 0 })
  const dur = stepDur(b, step)

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

  useEffect(() => {
    const on = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  useEffect(() => duck(paused), [paused])

  // Uhr: Fortschritt im Schritt, Sehzeit
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
      if (n < 0 || n >= STEPS) return
      const forward = n > step
      if (!forward) visit.current.back++
      setFwd(forward)
      setPrevStep(step)
      setStep(n)
      setT(0)
      if (n === 4) setTimeout(() => sfx.stamp(), 420)
      else if (n === SUMMARY) sfx.outro(b.mood)
      else sfx.whoosh(forward)
    },
    [b.mood, step],
  )

  // automatisch weiter
  useEffect(() => {
    if (t >= dur) goStep(step + 1)
  }, [t, dur, step, goStep])

  // Fortschritt merken
  useEffect(() => {
    const v = visit.current
    v.frac = Math.max(v.frac, Math.min(1, (step + Math.min(1, t / dur)) / SUMMARY))
    if (step === SUMMARY) v.done = true
  }, [step, t, dur])

  // Tastatur (Desktop)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goStep(step + 1)
      else if (e.key === 'ArrowLeft') goStep(step - 1)
      else if (e.key === 'ArrowDown') next()
      else if (e.key === 'ArrowUp') prev()
      else if (e.key === ' ') {
        e.preventDefault()
        setHold((h) => !h)
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
    tap: (x, w) => goStep(x < w * 0.3 ? step - 1 : step + 1),
    hold: (on) => {
      setHold(on)
      if (on) visit.current.holds++
    },
  })

  const day = b.day
  const no = day ? sessionNo(level, day) : undefined

  // Bild je Schritt; der vorige bleibt darunter liegen, bis der neue eingeblendet ist
  const painting = (s: number) => {
    const { img, cam } = camOf(b, s)
    const d = stepDur(b, s)
    return <Painting key={`L${s}`} file={b.images[img].file} cam={cam} dur={Number.isFinite(d) ? d : 14000} intro={s === 0} paused={paused} />
  }

  const textOf = (s: number): ReactNode => {
    if (s === 0)
      return (
        <h1 className="bite-hook">
          <Words text={b.hook} delay={650} step={90} />
        </h1>
      )
    if (s <= 3)
      return (
        <p className="bite-para">
          <Words text={b.slides[s - 1].text} delay={250} step={40} sound={b.mood} />
        </p>
      )
    if (s === 4)
      return (
        <div className="bite-verdict">
          <div className={`stamp-big ${b.verdict}`}>{VERDICT_LABEL[b.verdict]}</div>
          <p className="bite-why">
            <Words text={b.why} delay={900} step={40} />
          </p>
        </div>
      )
    return (
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
        <p className="bite-credits small muted">
          Fotos: {b.images.map((im) => `${im.author} (${im.license})`).join(' · ')}, Wikimedia Commons
          <br />
          {b.sources.join(' · ')}
        </p>
        <div className="bite-next" aria-hidden>
          <Chevron />
        </div>
      </div>
    )
  }

  const back = fwd ? '' : ' back'
  return (
    <div className={`bite feed-in-${dir}${step >= 4 ? ' late' : ''}${paused ? ' paused' : ''}`} {...swipe} onWheel={onWheel}>
      <div className="bite-bars">
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className="bite-bar">
            <i style={{ width: `${i < step ? 100 : i > step ? 0 : step === SUMMARY ? 100 : Math.min(100, (t / dur) * 100)}%` }} />
          </span>
        ))}
      </div>
      <div className="bite-area">
        <Icon name={b.area} size={20} />
        <span>{AREAS[b.area].name}</span>
      </div>

      <div className="bite-pic">
        {prevStep != null && prevStep !== step && painting(prevStep)}
        {painting(step)}
        <InkBorder r={16} w={3.2} />
      </div>

      <div className="bite-text">
        {prevStep != null && prevStep !== step && (
          <div key={`T${prevStep}`} className={`tlayer leave${back}`} aria-hidden>
            {textOf(prevStep)}
          </div>
        )}
        <div key={`T${step}`} className={`tlayer enter${back}`}>
          {textOf(step)}
        </div>
      </div>
    </div>
  )
}

/** Gemälde mit Kamerafahrt; beim Aufhänger mit Tusche-Klecks aufgedeckt */
function Painting({ file, cam, dur, intro, paused }: { file: string; cam: [number, number, number]; dur: number; intro: boolean; paused: boolean }) {
  const [x, y, z] = cam
  return (
    <div className={`painting${intro ? ' intro' : ''}`}>
      <img
        src={imgUrl(file)}
        alt=""
        draggable={false}
        style={{
          transformOrigin: `${x}% ${y}%`,
          ['--z0' as string]: String(z),
          ['--z1' as string]: String(z * 1.09),
          animationDuration: `${dur + 1200}ms`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      />
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
