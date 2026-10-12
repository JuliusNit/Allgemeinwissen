import { useState, type KeyboardEvent } from 'react'
import { AREAS, getDay } from '../data/plan'
import { symbolOf } from '../data/symbols'
import { arrowHead, bez, circle, poly, type Pt, type Stroke } from '../lib/ink'
import { pathDays, sessionNo } from '../lib/path'
import { dayState, updateDay, useStore, videosOf } from '../lib/store'
import { CoinButton } from '../components/Coin'
import { Icon, IconGroup } from '../components/Icons'
import { InkPaths } from '../components/Ink'
import { SymbolGroup } from '../components/Symbols'

// Themenkarte vor einer Session (Route #/thema/N): Thema in der Mitte, die Teilthemen als Wirkungsgefuege im Bogen darum
// (links → oben → rechts → unten, Pfeile in der Reihenfolge der Videos), vom letzten Teilthema ein Pfeil zum Muenzknopf,
// der in die Session fuehrt. Teilthema antippen oeffnet sein Video.

const W = 360
const CX = W / 2
const RX = 124
/** Symbolgroesse */
const S = 54
/** Beschriftung: Zeilenhoehe, Schriftgroesse, mittlere Zeichenbreite */
const LH = 15
const FS = 12.5
const CH = 6.9
/** Thema in der Mitte */
const TLH = 22
const TFS = 18
const TCH = 10.2
const BTN_RX = 104
const BTN_RY = 27
const BTN_D = 11

type Box = [number, number, number, number]

interface Line {
  text: string
  fs: number
}

interface Spot {
  x: number
  y: number
  lines: Line[]
  box: Box
  /** Kreis (+ Abspielzeichen), wenn kein Symbol passt */
  ring: Stroke[]
}

/** Umbruch an Leerzeichen, zu lange Woerter auch nach Bindestrichen; hoechstens maxLines Zeilen */
function wrapWords(t: string, max: number, maxLines: number): string[] {
  const pieces = t.split(' ').flatMap((w) => (w.length > max ? w.split(/(?<=-)/) : [w]).map((s, i) => ({ s, glue: i > 0 })))
  const lines: string[] = []
  let cur = ''
  for (const p of pieces) {
    const next = cur ? cur + (p.glue ? '' : ' ') + p.s : p.s
    // kurze Bindewoerter („&“) bleiben an der Zeile davor
    if (cur && next.length > max && !(p.s.length <= 2 && next.length <= max + 2)) {
      lines.push(cur)
      cur = p.s
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines.length > maxLines ? [...lines.slice(0, maxLines - 1), lines[maxLines - 1] + ' …'] : lines
}

/** Zeilen ueber max Zeichen (lange Einzelwoerter) bekommen eine kleinere Schrift, hoechstens bis min */
function fit(lines: string[], max: number, fs: number, min: number): Line[] {
  return lines.map((text) => ({ text, fs: text.length > max ? Math.max(min, (fs * max) / text.length) : fs }))
}

const widthOf = (lines: Line[], ch: number, fs: number) => Math.max(...lines.map((l) => (l.text.length * ch * l.fs) / fs))

const mid = (b: Box): Pt => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]

/** Punkt, an dem die Strecke von `from` (Mitte von b) nach `to` den um m vergroesserten Kasten verlaesst */
function exit(b: Box, from: Pt, to: Pt, m = 8): Pt {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const tx = dx > 0 ? (b[2] + m - from[0]) / dx : dx < 0 ? (b[0] - m - from[0]) / dx : Infinity
  const ty = dy > 0 ? (b[3] + m - from[1]) / dy : dy < 0 ? (b[1] - m - from[1]) / dy : Infinity
  const t = Math.min(tx, ty)
  return [from[0] + dx * t, from[1] + dy * t]
}

/** Leicht nach aussen (weg von c) gebogener Pfeil von a nach b */
function curved(a: Pt, b: Pt, c: Pt): Stroke[] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy)
  let nx = -dy / len
  let ny = dx / len
  if (nx * ((a[0] + b[0]) / 2 - c[0]) + ny * ((a[1] + b[1]) / 2 - c[1]) < 0) {
    nx = -nx
    ny = -ny
  }
  const k = len * 0.2
  const s = bez(a, [a[0] + dx / 3 + nx * k, a[1] + dy / 3 + ny * k], [a[0] + (2 * dx) / 3 + nx * k, a[1] + (2 * dy) / 3 + ny * k], b)
  return [s, ...arrowHead(s, 8)]
}

function layout(subs: string[], title: string, withVideo: boolean[]) {
  const n = subs.length
  const ry = n > 4 ? 172 : 162
  const cy = ry + S / 2 + 16
  const spots: Spot[] = subs.map((s, i) => {
    const a = ((n > 1 ? 180 + (270 * i) / (n - 1) : 90) * Math.PI) / 180
    const y = cy + ry * Math.sin(a)
    // neben dem Thema ist es enger als oben und unten
    const side = Math.abs(Math.sin(a)) < 0.5
    const lines = fit(wrapWords(s.replace(/\s*\(.*?\)/g, ''), side ? 13 : 16, 4), side ? 15 : 19, FS, 9.5)
    const hw = Math.max(S / 2, widthOf(lines, CH, FS) / 2)
    const x = Math.min(W - 3 - hw, Math.max(3 + hw, CX + RX * Math.cos(a)))
    const ring = [circle(x, y, S / 2 - 3)]
    if (withVideo[i]) ring.push(...poly([[x - 5, y - 7.5], [x + 8, y], [x - 5, y + 7.5]], true, 0.85))
    return { x, y, lines, box: [x - hw, y - S / 2, x + hw, y + S / 2 + 8 + lines.length * LH], ring }
  })

  // Thema: so breit, wie die Teilthemen auf seiner Hoehe Platz lassen
  let room = W
  for (const p of spots) {
    if (p.box[3] < cy - 2 * TLH || p.box[1] > cy + 2 * TLH) continue
    room = Math.min(room, 2 * (p.x < CX ? CX - p.box[2] - 10 : p.box[0] - 10 - CX))
  }
  const tmax = Math.max(8, Math.floor(room / TCH))
  const head = fit(wrapWords(title, tmax, 4), tmax, TFS, 12)

  const arrows: Stroke[] = []
  for (let i = 0; i < n - 1; i++) {
    const A = spots[i].box
    const B = spots[i + 1].box
    arrows.push(...curved(exit(A, mid(A), mid(B)), exit(B, mid(B), mid(A)), [CX, cy]))
  }
  // vom letzten Teilthema (unten in der Mitte) hinunter zum Knopf
  const y0 = (spots[n - 1]?.box[3] ?? cy) + 10
  const by = y0 + 56 + BTN_RY
  const y1 = by - BTN_RY - 12
  const down = bez([CX, y0], [CX - 3, y0 + (y1 - y0) * 0.35], [CX + 3, y0 + (y1 - y0) * 0.65], [CX, y1])
  arrows.push(down, ...arrowHead(down, 8))
  return { cy, head, spots, arrows, by, height: by + BTN_RY + BTN_D + 16 }
}

function onKey(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }
}

export function TopicView({ day, go }: { day: number; go: (hash: string) => void }) {
  const d = getDay(day)
  const status = useStore((s) => dayState(s, day).status)
  const watched = useStore((s) => dayState(s, day).watched)
  const videos = useStore((s) => videosOf(s, day))
  const level = useStore((s) => s.level)
  const order = pathDays(level)
  const no = sessionNo(level, day)
  const [pressed, setPressed] = useState(false)
  const ids = d.subtopics.map((_, i) => videos.find((v) => v.id === `${day}-${i}`)?.id)
  const L = layout(d.subtopics, d.title.split(/[:(]/)[0].trim(), ids.map(Boolean))
  const label = status === 'offen' ? 'Session starten' : status === 'laeuft' ? 'Session fortsetzen' : 'Session öffnen'

  function start() {
    updateDay(day, (x) => ({ ...x, status: x.status === 'offen' ? 'laeuft' : x.status, startedAt: x.startedAt ?? new Date().toISOString() }))
  }

  function enter() {
    setPressed(true)
    window.setTimeout(() => {
      start()
      go(`/tag/${day}`)
    }, 150)
  }

  function openVideo(id: string) {
    start()
    go(`/tag/${day}/video/${encodeURIComponent(id)}`)
  }

  return (
    <div className="topic">
      <div className="day-nav">
        <button className="icon-btn" onClick={() => go('/')} aria-label="Zurück zum Lernpfad"><Icon name="BACK" size={26} /></button>
        <span className="muted small">{no ? `Session ${no} von ${order.length}` : 'Grundwissen'} · {AREAS[d.area].name}</span>
      </div>

      <svg className="topic-map" viewBox={`0 0 ${W} ${L.height}`}>
        <text x={CX} y={L.cy - ((L.head.length - 1) * TLH) / 2 + 6} textAnchor="middle" className="t-title">
          {L.head.map((ln, i) => (
            <tspan key={i} x={CX} dy={i ? TLH : 0} fontSize={ln.fs !== TFS ? ln.fs : undefined}>{ln.text}</tspan>
          ))}
        </text>

        <g className="t-arrows">
          <InkPaths strokes={L.arrows} w={2.2} />
        </g>

        {L.spots.map((p, i) => {
          const sym = symbolOf(day, i)
          const id = ids[i]
          const k = S / 26
          return (
            <g
              key={i}
              className={`t-node${id ? ' link' : ''}`}
              style={{ animationDelay: `${i * 90}ms` }}
              role={id ? 'button' : undefined}
              tabIndex={id ? 0 : undefined}
              aria-label={id ? d.subtopics[i] : undefined}
              onClick={id ? () => openVideo(id) : undefined}
              onKeyDown={id ? onKey(() => openVideo(id)) : undefined}
            >
              <rect className="hit" x={p.box[0] - 4} y={p.box[1] - 4} width={p.box[2] - p.box[0] + 8} height={p.box[3] - p.box[1] + 8} rx={10} />
              {sym ? <SymbolGroup name={sym} w={1.4} transform={`translate(${p.x - S / 2 + k} ${p.y - S / 2 + k}) scale(${k})`} /> : <InkPaths strokes={p.ring} w={2.6} />}
              {id && watched?.includes(id) && <IconGroup name="CHECK" w={1.9} transform={`translate(${p.x + S / 2 - 4} ${p.y - S / 2 - 8}) scale(0.62)`} />}
              <text x={p.x} y={p.y + S / 2 + 8 + 11} textAnchor="middle" className="t-label">
                {p.lines.map((ln, j) => (
                  <tspan key={j} x={p.x} dy={j ? LH : 0} fontSize={ln.fs !== FS ? ln.fs : undefined}>{ln.text}</tspan>
                ))}
              </text>
            </g>
          )
        })}

        <g
          className="t-start"
          role="button"
          tabIndex={0}
          aria-label={label}
          transform={`translate(${CX} ${L.by})`}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          onClick={enter}
          onKeyDown={onKey(enter)}
        >
          <ellipse className="hit" rx={BTN_RX + 6} ry={BTN_RY + 8} cy={BTN_D / 2} />
          <CoinButton label={label} rx={BTN_RX} ry={BTN_RY} pressed={pressed} />
        </g>
      </svg>
    </div>
  )
}
