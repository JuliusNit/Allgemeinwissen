import { memo, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { outline, type Pt, type Stroke } from '../lib/ink'
import { cloud } from '../lib/cloud'
import { IconGroup, type IconName } from '../components/Icons'

// Einfuehrung beim ersten Start als kurze Tusche-Animationen, danach Konto anlegen.
// Jede Folie hat eine eigene Uhr (ms seit Beginn) und berechnet jedes Bild daraus. Mit „Weiter“ spielen vor Folie 2
// und 3 Uebergaenge aus dem Endbild der vorigen Folie (Kristall zerspringt zum Ring, Kurven werden zur Blitz-Kontur);
// zurueck oder ueber die Punkte startet die Folie direkt. Buehne 340 × 430, Texte als HTML darueber (Lage in %).

const W = 340
const H = 430

// ---------- Zeit ----------

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
/** 0..1 zwischen start und start + dur */
const prog = (t: number, start: number, dur: number) => clamp((t - start) / dur)
const easeOut = (x: number) => 1 - (1 - x) ** 3
const easeIn = (x: number) => x * x
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
/** Aufploppen mit Ueberschwingen */
const pop = (x: number) => (x <= 0 ? 0 : 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2)

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Millisekunden seit dem Einblenden der Folie; bei reduzierter Bewegung sofort das Endbild */
function useClock(): number {
  const [t, setT] = useState(REDUCED ? 1e6 : 0)
  useEffect(() => {
    if (REDUCED) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      setT(Math.max(0, now - t0))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return t
}

// ---------- Geometrie (Striche fuer lib/ink, Punktabstand D) ----------

const D = 1.6
const rad = (d: number) => (d * Math.PI) / 180
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1])
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]]
const dif = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]]
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k]
const mix = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]
const dir = (deg: number): Pt => [Math.cos(rad(deg)), Math.sin(rad(deg))]
const cross = (a: Pt, b: Pt) => a[0] * b[1] - a[1] * b[0]
const scaled = (p: Pt[], k: number) => p.map((q) => mul(q, k))

function dense(p: Pt[], closed = false): Pt[] {
  const src = closed ? [...p, p[0]] : p
  const out: Pt[] = []
  for (let i = 0; i < src.length - 1; i++) {
    const n = Math.max(1, Math.ceil(dist(src[i], src[i + 1]) / D))
    for (let k = 0; k < n; k++) out.push(mix(src[i], src[i + 1], k / n))
  }
  if (!closed) out.push(src[src.length - 1])
  return out
}
const seg = (a: Pt, b: Pt, w?: number): Stroke => ({ pts: dense([a, b]), w })
/** Polygonzug als Einzelstriche (runde Enden decken die Ecken) */
function edges(p: Pt[], closed = true, w?: number): Stroke[] {
  const out: Stroke[] = []
  for (let i = 0; i < p.length - (closed ? 0 : 1); i++) out.push(seg(p[i], p[(i + 1) % p.length], w))
  return out
}
function fn(f: (t: number) => Pt, n: number, w?: number): Stroke {
  return { pts: Array.from({ length: n + 1 }, (_, i) => f(i / n)), w }
}
/** Ellipsenbogen; Winkel in Grad, 0 = rechts, 90 = unten */
function arcS(c: Pt, rx: number, ry: number, a0: number, a1: number, w?: number): Stroke {
  const n = Math.max(6, Math.ceil((Math.abs(rad(a1 - a0)) * Math.max(rx, ry)) / D))
  return fn((t) => {
    const a = rad(lerp(a0, a1, t))
    return [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry]
  }, n, w)
}
function ringS(c: Pt, rx: number, ry = rx, w?: number): Stroke {
  const s = arcS(c, rx, ry, 0, 360, w)
  s.pts.pop()
  return { ...s, closed: true }
}
function bezS(p0: Pt, p1: Pt, p2: Pt, p3: Pt, w?: number): Stroke {
  const n = Math.max(6, Math.ceil((dist(p0, p1) + dist(p1, p2) + dist(p2, p3)) / D))
  return fn((t) => {
    const u = 1 - t
    const a = u * u * u
    const b = 3 * u * u * t
    const c = 3 * u * t * t
    const d = t * t * t
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]
  }, n, w)
}
/** Geschlossene Flaeche als SVG-Pfad */
const pd = (p: Pt[]) => `M${p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z`

function plen(p: Pt[]) {
  let L = 0
  for (let i = 1; i < p.length; i++) L += dist(p[i - 1], p[i])
  return L
}
const strokePts = (s: Stroke) => (s.closed ? [...s.pts, s.pts[0]] : s.pts)

/** Die ersten k (0..1) mehrerer Striche, nacheinander gezeichnet */
function reveal(strokes: Stroke[], k: number): Stroke[] {
  if (k >= 1) return strokes
  if (k <= 0) return []
  const lens = strokes.map((s) => plen(strokePts(s)))
  let goal = lens.reduce((a, b) => a + b, 0) * k
  const out: Stroke[] = []
  for (let i = 0; i < strokes.length && goal > 0; i++) {
    if (goal >= lens[i]) {
      out.push(strokes[i])
      goal -= lens[i]
      continue
    }
    const p = strokePts(strokes[i])
    const q: Pt[] = [p[0]]
    for (let j = 1; j < p.length; j++) {
      const d = dist(p[j - 1], p[j])
      if (goal <= d) {
        q.push(mix(p[j - 1], p[j], goal / d))
        break
      }
      goal -= d
      q.push(p[j])
    }
    out.push({ ...strokes[i], pts: q, closed: false })
    goal = 0
  }
  return out
}

/** Polylinie mit Bogenlaenge – fuer Kurven, die sich zeichnen oder wie Schlangen weiterbewegen */
interface Track {
  pts: Pt[]
  L: number[]
  len: number
}
function track(pts: Pt[]): Track {
  const L = [0]
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + dist(pts[i - 1], pts[i]))
  return { pts, L, len: L[L.length - 1] }
}
function pointAt(tr: Track, s: number): Pt {
  s = clamp(s, 0, tr.len)
  let lo = 0
  let hi = tr.L.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (tr.L[m] <= s) lo = m
    else hi = m
  }
  const d = tr.L[hi] - tr.L[lo]
  return mix(tr.pts[lo], tr.pts[hi], d ? (s - tr.L[lo]) / d : 0)
}
/** Stueck zwischen Bogenlaenge a und b */
function part(tr: Track, a: number, b: number): Pt[] {
  a = clamp(a, 0, tr.len)
  b = clamp(b, 0, tr.len)
  if (b - a < 0.5) return []
  const out: Pt[] = [pointAt(tr, a)]
  for (let i = 0; i < tr.pts.length; i++) if (tr.L[i] > a && tr.L[i] < b) out.push(tr.pts[i])
  out.push(pointAt(tr, b))
  return out
}
/** Gestrichelt; phase verschiebt das Muster (wandert mit, wenn sich die Kurve bewegt) */
function dashed(tr: Track, a: number, b: number, dash: number, gap: number, phase: number): Stroke[] {
  const per = dash + gap
  const out: Stroke[] = []
  for (let x = a - ((((a - phase) % per) + per) % per); x < b; x += per) {
    const p = part(tr, Math.max(a, x), Math.min(b, x + dash))
    if (p.length > 1) out.push({ pts: p })
  }
  return out
}

// ---------- Zeichnen ----------

const Ink = memo(function Ink({ s, w = 2.4 }: { s: Stroke[]; w?: number }) {
  return (
    <g className="ink">
      {s.map((x, i) => (x.pts.length > 1 ? <path key={i} d={outline(x, w)} fillRule={x.closed ? 'evenodd' : 'nonzero'} /> : null))}
    </g>
  )
})

/** Text ueber der Buehne; x = Mitte (bzw. linke Kante bei left), y = Oberkante (bzw. Mitte bei mid), alles in Buehnen-Einheiten */
function Txt({ x, y, w, o = 1, dx = 0, dy = 0, left, mid, className, children }: { x: number; y: number; w: number; o?: number; dx?: number; dy?: number; left?: boolean; mid?: boolean; className?: string; children: ReactNode }) {
  if (o <= 0) return null
  const style: CSSProperties = {
    left: `${((left ? x : x - w / 2) / W) * 100}%`,
    top: `${(y / H) * 100}%`,
    width: `${(w / W) * 100}%`,
    opacity: o,
    transform: `translate(${dx}px, ${dy}px)${mid ? ' translateY(-50%)' : ''}`,
    textAlign: left ? 'left' : 'center',
  }
  return <div className={`onb-txt ${className ?? ''}`} style={style}>{children}</div>
}

function Head({ text, o, logo }: { text: string; o: number; logo?: ReactNode }) {
  return (
    <div className="onb-head">
      <h1 style={{ opacity: o, transform: `translateY(${((1 - o) * 8).toFixed(1)}px)` }}>{text}</h1>
      {logo}
    </div>
  )
}

function Stage({ label, svg, children }: { label?: string; svg: ReactNode; children?: ReactNode }) {
  return (
    <div className="onb-stage" role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>{svg}</svg>
      {children}
    </div>
  )
}

/** Bewertung „trainierbar“ als Tusche-Punkte, die nacheinander aufploppen (t = ms seit Start) */
function Dots({ n, t }: { n: number; t: number }) {
  return (
    <span className="onb-rate">
      trainierbar
      <svg viewBox="0 0 84 16" role="img" aria-label={`${n} von 5`}>
        {Array.from({ length: 5 }, (_, i) => {
          const k = i < n ? pop(prog(t, i * 120, 220)) : 0
          return (
            <g key={i} transform={`translate(${8 + i * 17} 8)`}>
              {k > 0 && <circle r={5.6 * k} className="solid" />}
              <Ink s={[ringS([0, 0], 5.6)]} w={1.7} />
            </g>
          )
        })}
      </svg>
    </span>
  )
}

// ---------- Blitz und Kristall ----------

const BOLT: Pt[] = ([[14, 2.4], [5, 13.6], [11.4, 13.6], [9.8, 21.6], [19, 10], [12.6, 10]] as Pt[]).map(([x, y]) => [x - 12, y - 12])
const CRYSTAL: Pt[] = ([[12, 2.4], [18, 7.6], [17, 17.4], [12, 21.6], [7, 17.4], [6, 7.6]] as Pt[]).map(([x, y]) => [x - 12, y - 12])

/** Schraffur-Abstand fuer Formen, deren Groesse in die Punkte eingerechnet ist: waechst mit, damit die Schraffur an der
 *  Form haftet (bei Bewegung ueber Gruppen-Transformationen haftet das globale Muster ohnehin) */
const hatchGap = (s: number) => Math.max(0.8, (3.2 * s) / 5)

function BoltArt({ x, y, s, o = 1 }: { x: number; y: number; s: number; o?: number }) {
  if (s <= 0.02 || o <= 0) return null
  const p = scaled(BOLT, s)
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <LocalHatch pts={p} c={[0, 0]} u={[1, 0]} gap={hatchGap(s)} />
      <Ink s={edges(p)} w={2.6} />
    </g>
  )
}

function crystalStrokes(s: number): Stroke[] {
  const p = scaled(CRYSTAL, s)
  const m: Pt = [0, -1.6 * s]
  return [...edges(p), seg(p[5], m), seg(m, p[1]), seg(m, [0, 9.6 * s], 0.9), seg(p[0], m, 0.7)]
}

function CrystalArt({ x, y, s, o = 1, w = 2.6, gap }: { x: number; y: number; s: number; o?: number; w?: number; gap?: number }) {
  if (s <= 0.02 || o <= 0) return null
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <LocalHatch pts={scaled(CRYSTAL, s)} c={[0, 0]} u={[1, 0]} gap={gap ?? hatchGap(s)} />
      <Ink s={crystalStrokes(s)} w={w} />
    </g>
  )
}

// Risse vom Punkt C aus; die Scherben sind genau die Flaechen zwischen zwei Rissen
const SH_C: Pt = [0.4, 0.6]
const SH_A = [-104, -52, -8, 38, 84, 128, 172, 218]
const SH_J = [0.8, -0.6, -0.9, 0.5, 0.7, -0.8, 0.6, -0.5, 0.9, -0.7, 0.5, -0.6, 0.8, -0.9, 0.6, 0.7]
const SHARDS = (() => {
  const angOf = (p: Pt) => (Math.atan2(p[1] - SH_C[1], p[0] - SH_C[0]) * 180) / Math.PI
  const cracks = SH_A.map((a, i) => {
    const d = dir(a)
    const n: Pt = [-d[1], d[0]]
    let hit: Pt = SH_C
    for (let k = 0; k < CRYSTAL.length; k++) {
      const p = CRYSTAL[k]
      const e = dif(CRYSTAL[(k + 1) % CRYSTAL.length], p)
      const den = cross(d, e)
      if (Math.abs(den) < 1e-9) continue
      const v = dif(p, SH_C)
      const t = cross(v, e) / den
      const u = cross(v, d) / den
      if (t > 0 && u >= 0 && u <= 1) hit = add(SH_C, mul(d, t))
    }
    const r = dist(SH_C, hit)
    return [SH_C, add(add(SH_C, mul(d, r * 0.34)), mul(n, SH_J[2 * i] * 0.7)), add(add(SH_C, mul(d, r * 0.68)), mul(n, SH_J[2 * i + 1] * 0.7)), hit] as Pt[]
  })
  const pieces = SH_A.map((a, i) => {
    let b = SH_A[(i + 1) % SH_A.length]
    if (b <= a) b += 360
    const verts = CRYSTAL.map((v) => {
      let g = angOf(v)
      while (g <= a) g += 360
      return { v, g }
    })
      .filter((x) => x.g < b)
      .sort((x, y) => x.g - y.g)
      .map((x) => x.v)
    const poly = [...cracks[i], ...verts, ...cracks[(i + 1) % cracks.length].slice(1).reverse()]
    const c = mul(poly.reduce<Pt>((s, q) => add(s, q), [0, 0]), 1 / poly.length)
    return { poly: poly.map((q) => dif(q, c)), c, ang: (a + b) / 2, rot: (i % 2 ? 1 : -1) * (50 + i * 14) }
  })
  return { cracks, pieces }
})()

// ---------- Folie 1: Zwei Arten, klug zu sein ----------

const COL_L = 88
const COL_R = 252
/** Vergleich unter beiden Spalten: Haken fuer kristallin, Kreuz fuer fluide */
const ROWS: { x: number; y: number; good: boolean; text: string }[] = [
  { x: COL_L, y: 280, good: false, text: 'sinkt ab Mitte 20' },
  { x: COL_L, y: 312, good: false, text: 'kaum trainierbar' },
  { x: COL_R, y: 280, good: true, text: 'wächst lebenslang' },
  { x: COL_R, y: 312, good: true, text: 'gut trainierbar' },
]
const ROW_T = [3500, 3650, 3950, 4100]

/** Beschriftung beider Intelligenzen; m = 0 Blitz allein in der Mitte, 1 = zwei Spalten; rows = Sichtbarkeit je Vergleichszeile */
function PairText({ m, fl, flTxt, cr, crTxt, rows }: { m: number; fl: number; flTxt: number; cr: number; crTxt: number; rows: number[] }) {
  const x = lerp(170, COL_L, m)
  return (
    <>
      <Txt x={x} y={lerp(190, 170, m)} w={160} o={fl} dy={(1 - fl) * 6}><b className="l">Fluide Intelligenz</b></Txt>
      <Txt x={x} y={lerp(216, 216, m)} w={160} o={flTxt} dy={(1 - flTxt) * 6}>schnell umdenken – ohne Vorwissen</Txt>
      <Txt x={COL_R} y={170} w={160} o={cr} dy={(1 - cr) * 6}><b className="l">Kristalline Intelligenz</b></Txt>
      <Txt x={COL_R} y={216} w={160} o={crTxt} dy={(1 - crTxt) * 6}>Wissen, das du verstanden hast</Txt>
      {ROWS.map((r, i) => (
        <Txt key={i} x={r.x - 56} y={r.y} w={136} left mid o={rows[i]} dx={(1 - rows[i]) * 6} className={`cmp ${r.good ? 'good' : ''}`}>{r.text}</Txt>
      ))}
    </>
  )
}

const CHECK: Stroke[] = edges([[-6, 0], [-1.8, 4.4], [6.5, -5.5]], false)
const CROSS: Stroke[] = [seg([-4.6, -4.6], [4.6, 4.6]), seg([4.6, -4.6], [-4.6, 4.6])]

function RowMarks({ rows }: { rows: number[] }) {
  return (
    <>
      {ROWS.map((r, i) => (rows[i] > 0 ? (
        <g key={i} transform={`translate(${r.x - 68} ${r.y})`}>
          <Ink s={reveal(r.good ? CHECK : CROSS, easeOut(rows[i]))} w={r.good ? 2.8 : 2.2} />
        </g>
      ) : null))}
    </>
  )
}

function TwoKinds() {
  const t = useClock()
  const m = easeInOut(prog(t, 2300, 650))
  const pb = pop(prog(t, 250, 450))
  const pc = pop(prog(t, 2650, 450))
  const rows = ROW_T.map((s) => prog(t, s, 300))
  return (
    <>
      <Head text="Zwei Arten, klug zu sein" o={prog(t, 0, 300)} />
      <Stage
        svg={
          <>
            <BoltArt x={lerp(170, COL_L, m)} y={lerp(126, 122, m)} s={lerp(5, 2.8, m) * pb} o={1 - 0.4 * prog(t, 3500, 400)} />
            <CrystalArt x={COL_R} y={112} s={(4.6 + 0.5 * easeOut(prog(t, 3950, 400))) * pc} />
            <RowMarks rows={rows} />
          </>
        }
      >
        <PairText m={m} fl={prog(t, 600, 300)} flTxt={prog(t, 850, 300)} cr={prog(t, 2950, 300)} crTxt={prog(t, 3100, 300)} rows={rows} />
      </Stage>
    </>
  )
}

// ---------- Folie 2: Verlauf ueber das Lebensalter ----------

const X0 = 40
const Y0 = 330
const XE = 328
const YT = 76
const xa = (age: number) => X0 + ((age - 15) / 70) * (318 - X0)
const ya = (v: number) => Y0 - v * 236
const fluidV = (a: number) => (a < 25 ? 0.62 + 0.26 * ((a - 15) / 10) : 0.88 - 0.5 * Math.pow((a - 25) / 55, 1.25))
const crystV = (a: number) => 0.2 + 0.68 * (1 - Math.exp(-(a - 15) / 17)) - (a > 68 ? 0.004 * (a - 68) : 0)
const AGE = (t: number) => 15 + t * 67

// Laeufer auf Folie 3: Mitte, Neigung und Groesse; seine Blitz-Kontur ist das Ziel der Kurven beim Uebergang
const RUN: Pt = [170, 156]
const RUN_BODY = scaled(BOLT, 5).map(([x, y]): Pt => {
  const c = Math.cos(rad(10))
  const s = Math.sin(rad(10))
  return [RUN[0] + 1.3 * (x * c - y * s), RUN[1] - 3 + 1.3 * (x * s + y * c)]
})
const unit = (p: Pt) => mul(p, 1 / (Math.hypot(p[0], p[1]) || 1))

/** Kurve, dann ein Bogen rechts aus dem Bild und zurueck, dann eine Haelfte der Blitz-Kontur (Schlangen-Uebergang) */
function toBolt(base: Pt[], half: Pt[], reach: number): Pt[] {
  const e = base[base.length - 1]
  const tan = unit(dif(e, base[base.length - 4]))
  const into = unit(dif(half[1], half[0]))
  const conn = bezS(e, add(e, mul(tan, reach)), add(half[0], mul(into, -reach)), half[0]).pts
  return [...base, ...conn.slice(1), ...dense(half).slice(1)]
}
const FLUID_BASE = Array.from({ length: 111 }, (_, i): Pt => [xa(AGE(i / 110)), ya(fluidV(AGE(i / 110)))])
const CRYST_BASE = Array.from({ length: 111 }, (_, i): Pt => [xa(AGE(i / 110)), ya(crystV(AGE(i / 110)))])
const CR_HALF = [RUN_BODY[0], RUN_BODY[1], RUN_BODY[2], RUN_BODY[3]]
const FL_HALF = [RUN_BODY[3], RUN_BODY[4], RUN_BODY[5], RUN_BODY[0]]
const FL = track(toBolt(FLUID_BASE, FL_HALF, 190))
const CR = track(toBolt(CRYST_BASE, CR_HALF, 190))
const FL_LEN = plen(FLUID_BASE)
const CR_LEN = plen(CRYST_BASE)
const FL_HALF_LEN = plen(FL_HALF)
const CR_HALF_LEN = plen(CR_HALF)
const AREA = pd([[X0, Y0], ...CRYST_BASE, [CRYST_BASE[CRYST_BASE.length - 1][0], Y0]])
const Y_AXIS = seg([X0, Y0], [X0, YT])
const X_AXIS = seg([X0, Y0], [XE, Y0])
const ARROWS = [...edges([[X0 - 5, YT + 9], [X0, YT], [X0 + 5, YT + 9]], false), ...edges([[XE - 9, Y0 - 5], [XE, Y0], [XE - 9, Y0 + 5]], false)]
const TICKS = [20, 40, 60, 80].map((a) => seg([xa(a), Y0], [xa(a), Y0 + 6], 0.8))

function ChartArt({ axes, deco, fl, cr, areaX, areaO, lf, lc, gap = 5, wf = 2.4, wc = 3.2 }: { axes: number; deco: number; fl: [number, number]; cr: [number, number]; areaX: number; areaO: number; lf: number; lc: number; gap?: number; wf?: number; wc?: number }) {
  return (
    <>
      {areaX > X0 && areaO > 0 && (
        <>
          <clipPath id="onb-area">
            <rect x={X0} y={0} width={areaX - X0} height={H} />
          </clipPath>
          <path d={AREA} className="hatch" opacity={0.55 * areaO} clipPath="url(#onb-area)" />
        </>
      )}
      <Ink s={[...reveal([Y_AXIS], axes), ...reveal([X_AXIS], axes)]} w={1.9} />
      {deco > 0 && (
        <g opacity={deco}>
          <Ink s={[...ARROWS, ...TICKS]} w={1.9} />
          {[20, 40, 60, 80].map((a) => (
            <text key={a} x={xa(a)} y={Y0 + 21} textAnchor="middle" className="onb-ct">{a}</text>
          ))}
          <text x={XE} y={Y0 - 10} textAnchor="end" className="onb-ct">Alter</text>
          <text x={X0 + 9} y={YT + 8} className="onb-ct">Leistung</text>
        </g>
      )}
      <Ink s={gap > 0.3 ? dashed(FL, fl[0], fl[1], 7, gap, fl[0]) : [{ pts: part(FL, fl[0], fl[1]) }]} w={wf} />
      <Ink s={[{ pts: part(CR, cr[0], cr[1]) }]} w={wc} />
      {lc > 0 && <text x={xa(70)} y={ya(crystV(70)) - 12 + (1 - lc) * 6} opacity={lc} textAnchor="middle" className="onb-cl">kristallin</text>}
      {lf > 0 && <text x={xa(64)} y={ya(fluidV(64)) + 26 + (1 - lf) * 6} opacity={lf} textAnchor="middle" className="onb-cl">fluide</text>}
    </>
  )
}

/** Uebergang von Folie 1: Text weg, Kristall waechst, reisst, zerspringt zum Ring, Scherben sammeln sich im Ursprung */
const SHATTER = 2700
function Shatter({ t }: { t: number }) {
  const g = easeInOut(prog(t, 150, 600))
  if (t < 1500) {
    const s = lerp(5.1, 13, g)
    const shake = 2.6 * prog(t, 800, 700)
    const cx = lerp(COL_R, 170, g) + Math.sin(t * 0.09) * shake
    const cy = lerp(112, 200, g) + Math.cos(t * 0.113) * shake
    const cracks = SHARDS.cracks.flatMap((c, i) => reveal([{ pts: dense(scaled(c, s)) }], easeOut(prog(t, 800 + i * 60, 420))))
    return (
      <>
        <BoltArt x={COL_L} y={122} s={2.8 * (1 - easeIn(prog(t, 0, 250)))} o={0.6} />
        <g transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
          <LocalHatch pts={scaled(CRYSTAL, s)} c={[0, 0]} u={[1, 0]} gap={hatchGap(s)} />
          <Ink s={crystalStrokes(s)} w={2.6} />
          <Ink s={cracks} w={2} />
        </g>
      </>
    )
  }
  const f = easeOut(prog(t, 1500, 450))
  const spin = 70 * easeInOut(prog(t, 1500, 1200))
  const conv = easeIn(prog(t, 2200, 480))
  const flash = prog(t, 1500, 260)
  return (
    <>
      {flash < 1 && (
        <g opacity={1 - flash}>
          <Ink s={Array.from({ length: 10 }, (_, i) => seg(add([170, 200], mul(dir(i * 36 + 10), 30 + 70 * flash)), add([170, 200], mul(dir(i * 36 + 10), 44 + 100 * flash)), 0.8))} w={2} />
        </g>
      )}
      {SHARDS.pieces.map((p, i) => {
        const start = add([170, 200], mul(p.c, 13))
        const ring = add([170, 200], mul(dir(p.ang + spin), 122))
        const pos = mix(mix(start, ring, f), [X0, Y0], conv)
        const sc = lerp(lerp(13, 5.8, f), 0.4, conv)
        const pts = scaled(p.poly, sc)
        return (
          <g key={i} transform={`translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)}) rotate(${(p.rot * f + 200 * conv).toFixed(1)})`} opacity={1 - prog(t, 2600, 100)}>
            <LocalHatch pts={pts} c={mul(p.c, -sc)} u={[1, 0]} gap={hatchGap(sc)} />
            <Ink s={edges(pts)} w={2.2} />
          </g>
        )
      })}
    </>
  )
}

function Ages({ via }: { via: boolean }) {
  const t = useClock()
  const c = t - (via ? SHATTER : 0)
  const k = (start: number, dur: number) => prog(c, start, dur)
  const fk = easeInOut(k(600, 550))
  const ck = easeInOut(k(1200, 650))
  const out = prog(t, 0, 250)
  return (
    <>
      {c < 0 ? <Head text="Zwei Arten, klug zu sein" o={1 - out} /> : <Head text="Mit den Jahren" o={k(0, 300)} />}
      <Stage
        label="Fluide Intelligenz ist mit Mitte zwanzig am stärksten und lässt dann nach, kristalline wächst bis ins hohe Alter"
        svg={
          c < 0 ? (
            <Shatter t={t} />
          ) : (
            <ChartArt
              axes={easeOut(k(0, 450))}
              deco={k(420, 250)}
              fl={[0, fk * FL_LEN]}
              cr={[0, ck * CR_LEN]}
              areaX={ck > 0 ? pointAt(CR, ck * CR_LEN)[0] : 0}
              areaO={1}
              lf={k(1100, 300)}
              lc={k(1800, 300)}
            />
          )
        }
      >
        {c < 0 && t < 300 && <PairText m={1} fl={1 - out} flTxt={1 - out} cr={1 - out} crTxt={1 - out} rows={ROWS.map(() => 1 - out)} />}
        {c >= 0 && <Txt x={170} y={384} w={300} o={k(1900, 400)} className="note">Schematisch, nach Salthouse (2009) und Hartshorne &amp; Germine (2015)</Txt>}
      </Stage>
    </>
  )
}

// ---------- Folie 3: Was sich trainieren laesst ----------

const DROP: Stroke[] = [bezS([0, -4.2], [1.6, -1.6], [2.6, 0], [2.6, 1.2], 0.55), arcS([0, 1.2], 2.6, 2.6, 0, 180, 0.55), bezS([-2.6, 1.2], [-2.6, 0], [-1.6, -1.6], [0, -4.2], 0.55)]

/** Ausgepowerter Blitz mit Stirnband, laeuft auf der Stelle. Ursprung = Koerpermitte; edge = gezeichneter Anteil der
 *  Kontur, detail = Sichtbarkeit von Gesicht, Stirnband, Armen und Beinen, t = Laufzeit (0 = Stand) */
function Runner({ x, y, t, edge = 1, detail = 1 }: { x: number; y: number; t: number; edge?: number; detail?: number }) {
  const p = (t / 560) * 2 * Math.PI
  const bob = -3 * Math.abs(Math.cos(p))
  const body = scaled(BOLT, 5)
  const leg = (ph: number): Stroke[] => {
    const A = 30 * Math.sin(ph)
    const K = 20 + 45 * Math.max(0, Math.sin(ph + 1.2))
    const hip: Pt = [-11, 44]
    const knee = add(hip, mul([Math.sin(rad(A)), Math.cos(rad(A))], 15))
    const sh = A - K
    const ankle = add(knee, mul([Math.sin(rad(sh)), Math.cos(rad(sh))], 15))
    const foot = add(ankle, mul([Math.cos(rad(sh)), -Math.sin(rad(sh))], 6))
    return edges([hip, knee, ankle, foot], false)
  }
  const arm = (s: Pt, ph: number): Stroke[] => {
    const B = 40 * Math.sin(ph)
    const elbow = add(s, mul([Math.sin(rad(B)), Math.cos(rad(B))], 12))
    const hand = add(elbow, mul([Math.sin(rad(B + 85)), Math.cos(rad(B + 85))], 10))
    return [...edges([s, elbow, hand], false), ringS(hand, 2.2)]
  }
  const tail = (j: number) => fn((s) => [-19 - 17 * s, -14.5 + (j ? 3.5 : -2) * s + 3 * Math.sin(6 * s - p * 2 + j * 1.7) * s], 16, 0.8)
  const eye = (c: Pt): Stroke[] => [seg([c[0] - 4, c[1]], [c[0] + 4, c[1] + 0.8], 0.9), arcS(c, 4, 3.2, 10, 170, 0.8), arcS([c[0], c[1] + 5.4], 3, 1.2, 25, 155, 0.5)]
  const drops = [0, 1, 2].map((i) => {
    const l = ((t / 900 + i / 3) % 1 + 1) % 1
    const pos: Pt = [-6 - 30 * l - i * 4, -18 - 34 * l + 70 * l * l]
    return { pos, o: t > 0 ? 1 - l : 0 }
  })
  return (
    <g transform={`translate(${x.toFixed(1)} ${(y + bob).toFixed(1)}) rotate(10) scale(1.3)`}>
      {detail > 0 && (
        <g opacity={detail}>
          <Ink s={[...arm([-17, -1], p), ...leg(p + Math.PI)]} w={2.2} />
          <clipPath id="onb-bolt">
            <path d={pd(body)} />
          </clipPath>
          <path d={pd(body)} className="paper" />
          <path d={pd(body)} className="hatch" opacity={0.28} />
          <g clipPath="url(#onb-bolt)">
            <rect x={-40} y={-18} width={80} height={7} className="hatch" />
            <Ink s={[seg([-40, -18], [40, -18], 0.8), seg([-40, -11], [40, -11], 0.8)]} w={2} />
          </g>
        </g>
      )}
      <Ink s={reveal(edges(body), edge)} w={2.6} />
      {detail > 0 && (
        <g opacity={detail}>
          <ellipse cx={-19} cy={-14.5} rx={3} ry={3.6} className="paper" />
          <Ink s={[ringS([-19, -14.5], 3, 3.6, 0.8), tail(0), tail(1)]} w={2} />
          <Ink s={[...eye([-13, -3]), ...eye([6, -4])]} w={2} />
          <circle cx={-13} cy={-1.2} r={1.4} className="solid" />
          <circle cx={6} cy={-2.2} r={1.4} className="solid" />
          <ellipse cx={1.5} cy={5.2} rx={3.6} ry={3} className="solid" />
          <path d="M-0.4 6.2L-0.4 10.4A2 2 0 0 0 3.6 10.4L3.6 6.2Z" className="paper" />
          <Ink s={[...edges([[-0.4, 6.4], [-0.4, 10.4]], false, 0.6), arcS([1.6, 10.4], 2, 2, 0, 180, 0.6), seg([3.6, 10.4], [3.6, 6.4], 0.6)]} w={2} />
          <Ink s={[...leg(p), ...arm([17, -2], p + Math.PI)]} w={2.2} />
          {drops.map((d, i) => (d.o > 0 ? (
            <g key={i} transform={`translate(${d.pos[0].toFixed(1)} ${d.pos[1].toFixed(1)})`} opacity={d.o}>
              <path d="M0 -4.2C1.6 -1.6 2.6 0 2.6 1.2A2.6 2.6 0 0 1 -2.6 1.2C-2.6 0 -1.6 -1.6 0 -4.2Z" className="paper" />
              <Ink s={DROP} w={2} />
            </g>
          ) : null))}
        </g>
      )}
    </g>
  )
}

const bump = (s: number, c: number, w: number) => Math.exp(-(((s - c) / w) ** 2))

/** Glied mit Muskelprofil als geschlossener Umriss: top/bot = Abstand der Kontur zur Achse (s = 0 Ansatz … 1 Ende),
 *  side waehlt, auf welcher Seite „top“ liegt; Enden rund (Ansatz nur mit startCap) */
function muscle(a: Pt, b: Pt, top: (s: number) => number, bot: (s: number) => number, side: 1 | -1, startCap = false): { d: string; s: Stroke } {
  const L = dist(a, b)
  const u: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: Pt = side > 0 ? [u[1], -u[0]] : [-u[1], u[0]]
  const T: Pt[] = []
  const B: Pt[] = []
  for (let i = 0; i <= 24; i++) {
    const s = i / 24
    const c = add(a, mul(u, L * s))
    T.push(add(c, mul(n, top(s))))
    B.push(add(c, mul(n, -bot(s))))
  }
  const cap = (at: Pt, rt: number, rb: number, dirU: Pt, from: Pt): Pt[] => {
    const r = (rt + rb) / 2
    const mid = add(at, mul(n, (rt - rb) / 2))
    const out: Pt[] = []
    for (let i = 1; i < 12; i++) {
      const f = (i / 12) * Math.PI
      out.push(add(mid, add(mul(from, r * Math.cos(f)), mul(dirU, r * Math.sin(f)))))
    }
    return out
  }
  const end = cap(b, top(1), bot(1), u, n)
  const start = startCap ? cap(a, top(0), bot(0), mul(u, -1), mul(n, -1)) : []
  const line = [...T, ...end, ...B.reverse(), ...start]
  return { d: pd(line), s: { pts: dense(line), closed: startCap } }
}

/** Abgerundetes Rechteck, gedreht: Mitte c, Laengsrichtung u */
function orect(c: Pt, u: Pt, len: number, wid: number, r: number): Pt[] {
  const v: Pt = [-u[1], u[0]]
  const pts: Pt[] = []
  const corners: [number, number, number][] = [[1, 1, 0], [-1, 1, 90], [-1, -1, 180], [1, -1, 270]]
  for (const [sx, sy, a0] of corners) {
    for (let k = 0; k <= 4; k++) {
      const a = rad(a0 + k * 22.5)
      const lx = sx * (len / 2 - r) + r * Math.cos(a)
      const ly = sy * (wid / 2 - r) + r * Math.sin(a)
      pts.push(add(c, add(mul(u, lx), mul(v, ly))))
    }
  }
  return pts
}

/** Schraffur, die an einer bewegten Form haftet (das globale Muster liegt fest im Bild und wuerde durchrutschen):
 *  Linien unter 45° zur Richtung u, verankert an c, auf das Polygon zugeschnitten */
function LocalHatch({ pts, c, u, gap = 3.2, o = 1 }: { pts: Pt[]; c: Pt; u: Pt; gap?: number; o?: number }) {
  const id = 'lh' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const R = Math.max(...pts.map((p) => dist(p, c))) + gap
  const a = Math.atan2(u[1], u[0]) - Math.PI / 4
  const along: Pt = [Math.cos(a), Math.sin(a)]
  const across: Pt = [-along[1], along[0]]
  let d = ''
  for (let k = -Math.ceil(R / gap); k <= Math.ceil(R / gap); k++) {
    const m = add(c, mul(across, k * gap))
    const p = add(m, mul(along, -R))
    const q = add(m, mul(along, R))
    d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`
  }
  return (
    <>
      <clipPath id={id}>
        <path d={pd(pts)} />
      </clipPath>
      <path d={d} className="hatch-line" clipPath={`url(#${id})`} opacity={o} />
    </>
  )
}

function Part({ d, s, hatch, w = 2.2 }: { d: string; s: Stroke[]; hatch?: number; w?: number }) {
  return (
    <>
      <path d={d} className="paper" />
      {hatch ? <path d={d} className="hatch" opacity={hatch} /> : null}
      <Ink s={s} w={w} />
    </>
  )
}

const DB_TILT = 35

/** Muskel-Kristall mit Hantel; curl 0 = Arm gestreckt, 1 = gebeugt. Ursprung = Koerpermitte, Fuesse bei y = 66 */
function Muki({ curl }: { curl: number }) {
  const body = scaled(CRYSTAL, 5)
  const M: Pt = [0, -8]
  // rechter Arm: Hantel-Curl. Oberarm haengt seitlich am Koerper, der Ellbogen bewegt sich nur zwischen fast gestreckt
  // (Unterarm in Verlaengerung des Oberarms, 57°) und voll gebeugt (gut 135° Beugung) – nie ueberstreckt
  const Sr: Pt = [26, -14]
  const Er: Pt = [43, 14]
  const th = lerp(57, -80, curl)
  const uf = dir(th)
  const Wr = add(Er, mul(uf, 23))
  const Hr = add(Wr, mul(uf, 4.5))
  const v: Pt = [-uf[1], uf[0]]
  const upperR = muscle(Sr, Er, (s) => 6.5 + 2 * bump(s, 0.1, 0.13) + (2.5 + 6 * curl) * bump(s, 0.55, 0.2) - s, (s) => 6 + 1.5 * bump(s, 0.35, 0.22) - 1.2 * s, 1)
  const foreR = muscle(Er, Wr, (s) => 5.6 + 1.6 * bump(s, 0.25, 0.22) - 1.8 * s, (s) => 5 + 0.6 * bump(s, 0.2, 0.2) - 1.4 * s, 1, true)
  // Hantel-Achse zeigt schraeg zum Betrachter (DB_TILT aus der Bildebene): die Scheiben sind Zylinder auf der Stange,
  // man sieht ihre Vorderseite als Ellipse; das nahe Ende (+v) ist etwas groesser und liegt vor der Faust
  const vp = mul(v, Math.cos(rad(DB_TILT)))
  const squeeze = Math.sin(rad(DB_TILT))
  const disc = (d: number, r: number, thick: number, hub: boolean) => {
    const k = 1 + d * 0.007
    const c = add(Hr, mul(vp, d))
    const ell = (cc: Pt, a0: number, a1: number): Pt[] =>
      Array.from({ length: 19 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / 18
        return add(cc, add(mul(uf, Math.cos(a) * r * k), mul(v, Math.sin(a) * r * k * squeeze)))
      })
    const back = add(c, mul(vp, -thick / 2))
    const front = add(c, mul(vp, thick / 2))
    const hull = [...ell(back, Math.PI, 2 * Math.PI), ...ell(front, 0, Math.PI)]
    const face = ell(front, 0, 2 * Math.PI).slice(0, -1)
    return { hull, face, front, hub }
  }
  const discs = [disc(-22.5, 4.5, 3, false), disc(-18, 10.5, 5, false), disc(-12, 14, 7, false), disc(12, 14, 7, false), disc(18, 10.5, 5, false), disc(22.5, 4.5, 3, true)]
  const discArt = (x: ReturnType<typeof disc>, i: number) => (
    <g key={i}>
      <path d={pd(x.hull)} className="paper" />
      <LocalHatch pts={x.hull} c={x.front} u={uf} />
      <Ink s={edges(x.hull)} w={1.9} />
      <path d={pd(x.face)} className="paper" />
      <LocalHatch pts={x.face} c={x.front} u={uf} o={0.4} />
      <Ink s={edges(x.face)} w={1.7} />
      {x.hub && <Ink s={[ringS(x.front, 1.8)]} w={1.6} />}
    </g>
  )
  const fistR = orect(Hr, uf, 12, 13, 4.2)
  // linker Arm: Hand an der Huefte
  const Sl: Pt = [-26, -16]
  const El: Pt = [-50, 6]
  const Wl: Pt = [-29, 19]
  const ul = unit(dif(Wl, El))
  const upperL = muscle(Sl, El, (s) => 6.5 + 2 * bump(s, 0.1, 0.13) + 3.5 * bump(s, 0.55, 0.2) - s, (s) => 6 + 1.5 * bump(s, 0.35, 0.22) - 1.2 * s, -1)
  const foreL = muscle(El, Wl, (s) => 5.6 + 1.6 * bump(s, 0.25, 0.22) - 1.8 * s, (s) => 5 + 0.6 * bump(s, 0.2, 0.2) - 1.4 * s, 1, true)
  const fistL = orect(add(Wl, mul(ul, 3)), ul, 11, 12, 4)
  const legs = [-1, 1].map((sg) => muscle([sg * 8, 34], [sg * 12, 57], () => 5, () => 4.6, sg > 0 ? 1 : -1))
  const feet: Pt[] = [[-16, 62], [16, 62]]
  // Kristall-Flaechen mit Licht von links oben
  const faces: { p: Pt[]; h: number }[] = [
    { p: [body[0], body[5], M], h: 0.3 },
    { p: [body[0], body[1], M], h: 0.7 },
    { p: [body[5], M, body[3], body[4]], h: 0.16 },
    { p: [body[1], body[2], body[3], M], h: 0.5 },
  ]
  const eye = (x: number, y: number): Pt[] => [[x - 5.5, y - 1], [x + 5.5, y - 1.5], ...arcS([x, y - 1.2], 5.5, 4.4, 0, 180).pts.slice(1)]
  const eyes = [eye(-11, 5), eye(11, 4.5)]
  return (
    <>
      {feet.map((c, i) => <ellipse key={i} cx={c[0]} cy={c[1]} rx={8} ry={4} className="paper" />)}
      <Ink s={feet.map((c) => ringS(c, 8, 4))} w={2.2} />
      {legs.map((l, i) => <Part key={i} d={l.d} s={[l.s]} />)}
      <Part d={upperL.d} s={[upperL.s]} />
      <Part d={foreL.d} s={[foreL.s]} />
      <Part d={upperR.d} s={[upperR.s]} />
      <path d={pd(body)} className="paper" />
      {faces.map((f, i) => <path key={i} d={pd(f.p)} className="hatch" opacity={f.h} />)}
      <Ink s={[...edges(body), seg(body[5], M, 0.9), seg(M, body[1], 0.9), seg(body[0], M, 0.7), seg(M, body[3], 0.7)]} w={2.6} />
      {/* Unterarm und Hantel vor dem Koerper: beim Curl liegt die Hantel vorn */}
      {discs.slice(0, 3).map(discArt)}
      <Ink s={[seg(add(Hr, mul(vp, -8.5)), add(Hr, mul(vp, 10)), 1.5)]} w={2.2} />
      <Part d={foreR.d} s={[foreR.s]} />
      <Part d={pd(fistR)} s={[...edges(fistR), ...[-3.6, 0, 3.6].map((o) => seg(add(Hr, add(mul(uf, 6), mul(v, o))), add(Hr, add(mul(uf, 2), mul(v, o))), 0.5)), seg(add(Hr, add(mul(uf, -3), mul(v, 6.5))), add(Hr, add(mul(uf, 2.5), mul(v, 3))), 0.6)]} w={2} />
      {discs.slice(3).map((x, i) => discArt(x, i + 3))}
      <Part d={pd(fistL)} s={[...edges(fistL), ...[-3.2, 0, 3.2].map((o) => seg(add(Wl, add(mul(ul, 8.5), mul([-ul[1], ul[0]], o))), add(Wl, add(mul(ul, 5), mul([-ul[1], ul[0]], o))), 0.5))]} w={2} />
      {eyes.map((e, i) => <Part key={i} d={pd(e)} s={edges(e)} w={1.8} />)}
      <circle cx={-10} cy={6.6} r={2.2} className="solid" />
      <circle cx={12} cy={6.1} r={2.2} className="solid" />
      <Ink
        s={[
          seg([-18, -4], [-5, -0.8], 1.5),
          arcS([11.5, -1], 7, 3.4, 200, 340, 1.4),
          bezS([-8, 16], [-2, 19.5], [5, 19], [10, 12.5], 1.4),
          seg([10.6, 11.2], [12.4, 14.6], 0.7),
        ]}
        w={2}
      />
    </>
  )
}

const TRAIN_IN = 1800
const FLUID_OFF = 2900
const MUKI_IN = 3250

function Trainable({ via }: { via: boolean }) {
  const t = useClock()
  const c = t - (via ? TRAIN_IN : 0)
  const edge = via ? 1 : easeInOut(prog(c, 0, 500))
  const detail = via ? prog(c, 0, 250) : prog(c, 450, 250)
  const runT = Math.max(0, c - (via ? 200 : 650))
  const runX = RUN[0] + 330 * easeIn(prog(c, FLUID_OFF, 450))
  const flO = prog(c, 400, 300) * (1 - prog(c, FLUID_OFF - 50, 250))
  const drop = easeIn(prog(c, MUKI_IN, 380))
  const squash = 0.14 * Math.sin(Math.PI * prog(c, MUKI_IN + 380, 240))
  const curl = c > MUKI_IN + 650 ? 0.5 - 0.5 * Math.cos(((c - MUKI_IN - 650) / 1100) * 2 * Math.PI) : 0
  const crO = prog(c, MUKI_IN + 450, 300)
  const spark = (c / 1400) % 1
  // Uebergang: Kurven gleiten ueber den Bildrand und legen sich als Kontur um den Blitz
  const e = easeInOut(prog(t, 100, TRAIN_IN - 150))
  const join = prog(t, TRAIN_IN - 500, 420)
  return (
    <>
      {c < 0 ? <Head text="Mit den Jahren" o={1 - prog(t, 0, 250)} /> : <Head text="Was sich trainieren lässt" o={prog(c, 0, 300)} />}
      <Stage
        svg={
          c < 0 ? (
            <ChartArt
              axes={1 - easeIn(prog(t, 0, 380))}
              deco={1 - prog(t, 0, 200)}
              fl={[lerp(0, FL.len - FL_HALF_LEN, e), lerp(FL_LEN, FL.len, e)]}
              cr={[lerp(0, CR.len - CR_HALF_LEN, e), lerp(CR_LEN, CR.len, e)]}
              areaX={XE}
              areaO={1 - prog(t, 0, 250)}
              lf={1 - prog(t, 0, 200)}
              lc={1 - prog(t, 0, 200)}
              gap={5 * (1 - join)}
              wf={lerp(2.4, 3.4, join)}
              wc={lerp(3.2, 3.4, join)}
            />
          ) : (
            <>
              {c < FLUID_OFF + 500 && (
                <>
                  <g opacity={detail * (1 - prog(c, FLUID_OFF + 100, 300))}>
                    <Ink s={[seg([50, 250], [290, 250], 0.9)]} w={2} />
                    <Ink
                      s={[0, 1, 2, 3].map((j) => {
                        const x = 270 - ((runT * 0.22 + j * 55) % 210)
                        return seg([x, 257], [x + 14, 257], 0.6)
                      })}
                      w={2}
                    />
                  </g>
                  <Runner x={runX} y={RUN[1]} t={runT} edge={edge} detail={detail} />
                </>
              )}
              {c >= MUKI_IN && (
                <>
                  <g opacity={drop}>
                    <Ink s={[seg([50, 250], [300, 250], 0.9)]} w={2} />
                  </g>
                  <g transform={`translate(170 ${lerp(-180, 164, drop).toFixed(1)}) translate(0 86) scale(${(1.3 * (1 + squash * 0.6)).toFixed(3)} ${(1.3 * (1 - squash)).toFixed(3)}) translate(0 -66)`}>
                    <Muki curl={curl} />
                  </g>
                  {drop >= 1 && spark < 0.35 && (
                    <g transform={`translate(214 94) scale(${Math.sin((spark / 0.35) * Math.PI).toFixed(3)})`}>
                      <Ink s={[seg([-7, 0], [7, 0], 0.7), seg([0, -7], [0, 7], 0.7)]} w={2} />
                    </g>
                  )}
                </>
              )}
            </>
          )
        }
      >
        {c >= 0 && (
          <>
            <Txt x={170} y={274} w={300} o={flO} dy={(1 - prog(c, 400, 300)) * 6}>
              <b className="l">Fluide Intelligenz</b>
              <Dots n={1} t={c - 700} />
              Gehirnjogging trainiert fast nur sich selbst.
            </Txt>
            <Txt x={170} y={274} w={300} o={crO} dy={(1 - crO) * 6}>
              <b className="l">Kristalline Intelligenz</b>
              <Dots n={5} t={c - MUKI_IN - 700} />
              Wächst mit jedem Thema, das du verstehst.
            </Txt>
          </>
        )}
      </Stage>
    </>
  )
}

// ---------- Folie 4: Saeule ----------

const PX = 92
const R = 38
const RY = 7

/** Eine Schicht eines Bausteins: erst Flaechen, dann Striche – jede Schicht deckt die vorige ab */
interface Art {
  fills: { d: string; hatch?: number }[]
  strokes: Stroke[]
}

/** Quaderplatte von vorn, leicht von oben gesehen; y = Oberkante der Vorderseite */
function slab(hw: number, y: number, h: number, depth = 10, inset = 8): Art {
  const top: Pt[] = [[PX - hw, y], [PX + hw, y], [PX + hw - inset, y - depth], [PX - hw + inset, y - depth]]
  const front: Pt[] = [[PX - hw, y], [PX + hw, y], [PX + hw, y + h], [PX - hw, y + h]]
  return {
    fills: [{ d: pd(top) }, { d: pd(front) }, { d: pd([[PX - hw, y + h - 3], [PX + hw, y + h - 3], [PX + hw, y + h], [PX - hw, y + h]]), hatch: 0.6 }],
    strokes: [...edges(front), ...edges([top[0], top[3], top[2], top[1]], false)],
  }
}

/** Saeulentrommel; y = Mitte der oberen Ellipse */
function drum(y: number, h: number): Art {
  const body: Pt[] = [...arcS([PX, y], R, RY, 180, 360).pts, ...arcS([PX, y + h], R, RY, 0, 180).pts]
  const shade: Pt[] = [...arcS([PX, y], R, RY, 52, 0).pts, ...arcS([PX, y + h], R, RY, 0, 52).pts]
  const flutes = [-62, -38, -14, 10, 34, 58].map((a) => {
    const x = PX + R * Math.sin(rad(a))
    const yo = RY * Math.cos(rad(a))
    return seg([x, y + yo + 3], [x, y + h + yo - 2], 0.5)
  })
  return {
    fills: [{ d: pd(body) }, { d: pd(shade), hatch: 0.55 }],
    strokes: [ringS([PX, y], R, RY), seg([PX - R, y], [PX - R, y + h]), seg([PX + R, y], [PX + R, y + h]), arcS([PX, y + h], R, RY, 0, 180), ...flutes],
  }
}

/** Wulst am Saeulenfuss; y = Mitte der oberen Ellipse */
function torus(y: number, r: number, h: number): Art {
  const ry = RY * (r / R)
  const left = arcS([PX - r, y + h / 2], h * 0.45, h / 2, 90, 270)
  const right = arcS([PX + r, y + h / 2], h * 0.45, h / 2, -90, 90)
  const body: Pt[] = [...arcS([PX, y], r, ry, 180, 360).pts, ...right.pts, ...arcS([PX, y + h], r, ry, 0, 180).pts, ...left.pts]
  return {
    fills: [{ d: pd(body) }, { d: pd(body), hatch: 0.3 }],
    strokes: [ringS([PX, y], r, ry), left, right, arcS([PX, y + h], r, ry, 0, 180)],
  }
}

/** Kapitell: Echinus (ausladend) + Abakus-Platte; y = Unterkante (Mitte der unteren Ellipse) */
function capital(y: number): Art[] {
  const r1 = 50
  const ry1 = RY * (r1 / R)
  const yt = y - 14
  const l = bezS([PX - R, y], [PX - R - 2, y - 8], [PX - r1 + 6, yt], [PX - r1, yt])
  const r = bezS([PX + R, y], [PX + R + 2, y - 8], [PX + r1 - 6, yt], [PX + r1, yt])
  const body: Pt[] = [...arcS([PX, yt], r1, ry1, 180, 360).pts, ...[...r.pts].reverse(), ...arcS([PX, y], R, RY, 0, 180).pts, ...l.pts]
  return [{ fills: [{ d: pd(body) }, { d: pd(body), hatch: 0.3 }], strokes: [l, r, arcS([PX, y], R, RY, 0, 180)] }, slab(58, yt - 7, 11, 9, 7)]
}

// Bausteine von unten nach oben: Grundlagen-Sockel, drei Trommeln, Kapitell
const PIECES: { art: Art[]; bottom: number; mid: number; tilt: number }[] = [
  { art: [slab(66, 386, 18), torus(369, 46, 12)], bottom: 404, mid: 396, tilt: -6 },
  { art: [drum(311, 58)], bottom: 376, mid: 336, tilt: 7 },
  { art: [drum(253, 58)], bottom: 318, mid: 277, tilt: -8 },
  { art: [drum(195, 58)], bottom: 260, mid: 220, tilt: 6 },
  { art: capital(195), bottom: 198, mid: 176, tilt: -7 },
]
// Jeder Baustein faellt frueher und schneller als der vorige: Wer schon etwas weiss, kann Neues schneller anknuepfen
const FALL = [200, 900, 1400, 1760, 2020]
const FALL_DUR = [420, 350, 290, 240, 200]
const STEPS: ReactNode[] = [
  <><b>Gerüst bauen</b>Zeitstrahl, Weltkarte, Größenordnungen</>,
  <><b>Anknüpfen</b>Neues hängt sich an Bekanntes</>,
  <><b>Verknüpfen</b>Fächer greifen ineinander</>,
  <><b>Abrufen</b>hält fest, was schon steht</>,
]
const PILLAR_END = FALL[4] + FALL_DUR[4]
const STEP_X = 178

const PieceArt = memo(function PieceArt({ art }: { art: Art[] }) {
  return (
    <>
      {art.map((a, k) => (
        <g key={k}>
          {a.fills.map((f, i) => <path key={i} d={f.d} className={f.hatch ? 'hatch' : 'paper'} opacity={f.hatch} />)}
          <Ink s={a.strokes} w={2.2} />
        </g>
      ))}
    </>
  )
})

function Pillar() {
  const t = useClock()
  return (
    <>
      <Head text="So trainierst du sie" o={prog(t, 0, 300)} />
      <Stage
        label="Eine Säule wird Stück für Stück gebaut: Sockel, Trommeln, Kapitell"
        svg={PIECES.map((p, i) => {
          const f = prog(t, FALL[i], FALL_DUR[i])
          if (f <= 0) return null
          const land = FALL[i] + FALL_DUR[i]
          const b = prog(t, land, 180)
          const dy = -(p.bottom + 30) * (1 - f * f) - 5 * Math.sin(Math.PI * b) * (1 - b)
          const dust = prog(t, land, 320)
          const half = i === 0 ? 66 : i === 4 ? 58 : R
          const leader = easeOut(prog(t, land + 40, 220))
          const x1 = PX + half + (i === 0 ? 4 : 6)
          return (
            <g key={i}>
              <g transform={`translate(0 ${dy.toFixed(1)}) rotate(${(p.tilt * (1 - f)).toFixed(2)} ${PX} ${p.mid})`}>
                <PieceArt art={p.art} />
              </g>
              {dust > 0 && dust < 1 && (
                <g opacity={1 - dust}>
                  <Ink
                    s={[-1, 1].flatMap((sgn) => [0, 1].map((j) => {
                      const x = PX + sgn * (half + 4 + 16 * dust)
                      const y = p.bottom - 2 - j * 6 - 5 * dust
                      return seg([x, y], [x + sgn * 7, y - 2 - j * 2], 0.6)
                    }))}
                    w={2}
                  />
                </g>
              )}
              {i < STEPS.length && leader > 0 && <Ink s={reveal([seg([x1, p.mid], [STEP_X - 6, p.mid], 0.6)], leader)} w={2} />}
            </g>
          )
        })}
      >
        {STEPS.map((s, i) => {
          const o = prog(t, FALL[i] + FALL_DUR[i] + 20, 220)
          return (
            <Txt key={i} x={STEP_X} y={PIECES[i].mid} w={156} left mid o={o} dx={(1 - o) * 8} className="step">{s}</Txt>
          )
        })}
        <Txt x={STEP_X} y={150} w={156} left mid o={prog(t, PILLAR_END + 250, 300)} dy={(1 - prog(t, PILLAR_END + 250, 300)) * 6} className="lead">
          Jeder Baustein macht den nächsten leichter.
        </Txt>
      </Stage>
    </>
  )
}

// ---------- Folie 5: So funktioniert die App (Kreislauf) ----------

const LOOP_C: Pt = [170, 205]
const LOOP_RX = 104
const LOOP_RY = 122
const NODE_R = 55
const loopAt = (deg: number): Pt => [LOOP_C[0] + Math.cos(rad(deg)) * LOOP_RX, LOOP_C[1] + Math.sin(rad(deg)) * LOOP_RY]
const PLAY: Stroke[] = [ringS([12, 12], 9.4), ...edges([[9.6, 7.6], [16.8, 12], [9.6, 16.4]])]
const NODES: { a: number; icon: IconName | 'PLAY'; text: ReactNode }[] = [
  { a: -90, icon: 'PLAY', text: <><b>Anschauen</b>kurze Videos</> },
  { a: 0, icon: 'CHAT', text: <><b>Verstehen</b>KI fragt nach</> },
  { a: 90, icon: 'REVIEW', text: <><b>Wiederholen</b>in Abständen</> },
  { a: 180, icon: 'STATS', text: <><b>Auswerten</b>was sitzt?</> },
]
/** Pfeile auf der Kreisbahn von Knoten zu Knoten, mit Abstand zu den Kreisen */
const LOOP_ARROWS: Stroke[][] = NODES.map((n) => {
  const free = (from: number, step: number) => {
    let a = from
    const c = loopAt(from)
    while (dist(loopAt(a), c) < NODE_R + 7) a += step
    return a
  }
  const a0 = free(n.a, 1)
  const a1 = free(n.a + 90, -1)
  const arc = arcS(LOOP_C, LOOP_RX, LOOP_RY, a0, a1, 1)
  const p = arc.pts
  const tip = p[p.length - 1]
  const back = unit(dif(tip, p[p.length - 4]))
  const wing = (s: number): Pt => add(tip, add(mul(back, -8), mul([-back[1] * s, back[0] * s], 5.5)))
  return [arc, seg(wing(1), tip), seg(wing(-1), tip)]
})
const NODE_T = (i: number) => 350 + i * 600

function HowItWorks() {
  const t = useClock()
  const lp = pop(prog(t, 150, 450))
  const logo = (
    <svg viewBox="-24 -24 48 48" aria-hidden style={{ transform: `scale(${lp.toFixed(3)}) translateY(${(Math.sin(t / 650) * 1.5).toFixed(2)}px)` }}>
      <CrystalArt x={0} y={0} s={1.75} w={1.9} gap={2.6} />
    </svg>
  )
  return (
    <>
      <Head text="So funktioniert die App" o={prog(t, 0, 300)} logo={logo} />
      <Stage
        label="Kreislauf: Anschauen, Verstehen, Wiederholen, Auswerten – und wieder von vorn"
        svg={
          <>
            {NODES.map((_, i) => {
              const k = easeOut(prog(t, NODE_T(i) + 300, 320))
              return k > 0 ? <Ink key={`a${i}`} s={k >= 1 ? LOOP_ARROWS[i] : reveal([LOOP_ARROWS[i][0]], k)} w={2.2} /> : null
            })}
            {NODES.map((n, i) => {
              const c = loopAt(n.a)
              const k = pop(prog(t, NODE_T(i), 380))
              const o = prog(t, NODE_T(i) + 150, 250)
              if (k <= 0) return null
              return (
                <g key={i}>
                  <g transform={`translate(${c[0].toFixed(1)} ${c[1].toFixed(1)}) scale(${k.toFixed(3)})`}>
                    <circle r={NODE_R} className="paper" />
                    <Ink s={[ringS([0, 0], NODE_R)]} w={2.4} />
                  </g>
                  {o > 0 && (
                    <g opacity={o} transform={`translate(${(c[0] - 13.8).toFixed(1)} ${(c[1] - 42).toFixed(1)}) scale(1.15)`}>
                      {n.icon === 'PLAY' ? <Ink s={PLAY} w={1.55} /> : <IconGroup name={n.icon} />}
                    </g>
                  )}
                </g>
              )
            })}
          </>
        }
      >
        {NODES.map((n, i) => {
          const c = loopAt(n.a)
          const o = prog(t, NODE_T(i) + 150, 250)
          return <Txt key={i} x={c[0]} y={c[1] - 8} w={100} o={o} dy={(1 - o) * 5} className="circle">{n.text}</Txt>
        })}
      </Stage>
    </>
  )
}

// ---------- Folie 6: Aufruf ----------

const START_C: Pt = [170, 170]
/** Strahlen um den Kristall und funkelnde Sterne drumherum */
const START_RAYS: Stroke[] = Array.from({ length: 12 }, (_, i) => {
  const a = i * 30 + 15
  return seg(add(START_C, mul(dir(a), 96)), add(START_C, mul(dir(a), i % 2 ? 106 : 114)), 0.8)
})
const START_STARS: { c: Pt; r: number; d: number }[] = [
  { c: [58, 92], r: 7, d: 0 },
  { c: [288, 120], r: 6, d: 500 },
  { c: [76, 246], r: 5, d: 900 },
  { c: [270, 238], r: 7, d: 1300 },
]

function Start() {
  const t = useClock()
  const p = pop(prog(t, 200, 550))
  const breathe = t > 750 ? 1 + 0.035 * Math.sin((t - 750) / 650) : 1
  const rays = easeOut(prog(t, 650, 450))
  return (
    <>
      <Head text="Jetzt bist du dran" o={prog(t, 0, 300)} />
      <Stage
        svg={
          <>
            {rays > 0 && <Ink s={START_RAYS.flatMap((r) => reveal([r], rays))} w={2} />}
            {START_STARS.map((s, i) => {
              const k = t < 900 + s.d ? 0 : Math.max(0, Math.sin(((t - 900 - s.d) / 1700) * 2 * Math.PI))
              return k > 0 ? (
                <g key={i} transform={`translate(${s.c[0]} ${s.c[1]}) scale(${k.toFixed(3)})`}>
                  <Ink s={[seg([-s.r, 0], [s.r, 0], 0.7), seg([0, -s.r], [0, s.r], 0.7)]} w={2} />
                </g>
              ) : null
            })}
            <CrystalArt x={START_C[0]} y={START_C[1]} s={7 * p * breathe} w={3} />
          </>
        }
      >
        <Txt x={170} y={300} w={310} o={prog(t, 900, 350)} dy={(1 - prog(t, 900, 350)) * 8} className="cta">
          <b>Erweitere auch du jetzt dein Wissen.</b>
          Geschichte, Physik, Kunst, Wirtschaft – Thema für Thema, und es bleibt.
        </Txt>
      </Stage>
    </>
  )
}

// ---------- Ablauf ----------

const SLIDES: ((p: { via: boolean }) => ReactNode)[] = [TwoKinds, Ages, Trainable, Pillar, HowItWorks, Start]

export function Intro({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) {
  const [v, setV] = useState({ i: 0, via: false, n: 0 })
  const touch = useRef<number | null>(null)
  const last = v.i === SLIDES.length - 1
  const go = (i: number, via = false) => setV((o) => (i < 0 || i >= SLIDES.length ? o : { i, via, n: o.n + 1 }))
  const next = () => go(v.i + 1, true)
  const prev = () => go(v.i - 1)

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setV((o) => (o.i < SLIDES.length - 1 ? { i: o.i + 1, via: true, n: o.n + 1 } : o))
      if (e.key === 'ArrowLeft') setV((o) => (o.i > 0 ? { i: o.i - 1, via: false, n: o.n + 1 } : o))
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  const Slide = SLIDES[v.i]
  return (
    <div
      className="onb onb-slides onb-intro"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) {
          if (dx < 0) next()
          else prev()
        }
      }}
    >
      <div className="onb-top">
        <span className="muted small">{v.i + 1} / {SLIDES.length}</span>
        {!last && <button className="btn ghost small" onClick={() => go(SLIDES.length - 1)}>Überspringen</button>}
      </div>
      <Slide key={v.n} via={v.via} />
      <div className="onb-dots" role="tablist" aria-label="Folien">
        {SLIDES.map((_, k) => (
          <button key={k} className={k === v.i ? 'on' : ''} onClick={() => go(k)} aria-label={`Folie ${k + 1}`} aria-selected={k === v.i} role="tab" />
        ))}
      </div>
      {last ? (
        <div className="onb-actions">
          <button className="btn primary wide" onClick={onRegister}>{cloud ? 'Konto anlegen' : 'Loslegen'}</button>
          {cloud && <button className="btn ghost" onClick={onLogin}>Ich habe schon ein Konto</button>}
        </div>
      ) : (
        <div className="onb-actions row">
          <button className="btn" disabled={v.i === 0} onClick={prev}>Zurück</button>
          <button className="btn primary right" onClick={next}>Weiter</button>
        </div>
      )}
    </div>
  )
}
