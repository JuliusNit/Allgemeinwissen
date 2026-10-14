import { memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { outline, type Pt, type Stroke } from '../lib/ink'
import { cloud } from '../lib/cloud'
import { IconGroup, type IconName } from '../components/Icons'

// Einfuehrung beim ersten Start als kurze Tusche-Animationen, danach Konto anlegen.
// Jede Folie hat eine eigene Uhr (ms seit Beginn) und berechnet jedes Bild daraus. Mit „Weiter“ spielen vor Folie 2
// und 3 Uebergaenge aus dem Endbild der vorigen Folie (Kristall zerspringt zum Ring, Kurven schlaengeln davon);
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

function BoltArt({ x, y, s, o = 1 }: { x: number; y: number; s: number; o?: number }) {
  if (s <= 0.02 || o <= 0) return null
  const p = scaled(BOLT, s)
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={pd(p)} className="hatch" />
      <Ink s={edges(p)} w={2.6} />
    </g>
  )
}

function crystalStrokes(s: number): Stroke[] {
  const p = scaled(CRYSTAL, s)
  const m: Pt = [0, -1.6 * s]
  return [...edges(p), seg(p[5], m), seg(m, p[1]), seg(m, [0, 9.6 * s], 0.9), seg(p[0], m, 0.7)]
}

function CrystalArt({ x, y, s, o = 1, w = 2.6 }: { x: number; y: number; s: number; o?: number; w?: number }) {
  if (s <= 0.02 || o <= 0) return null
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={pd(scaled(CRYSTAL, s))} className="hatch" />
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
const FLUID_TXT = 'Neue Probleme lösen, Muster erkennen, schnell umdenken – ohne Vorwissen.'
const CRYST_TXT = 'Alles, was du weißt und verstanden hast: Wissen, Begriffe, Zusammenhänge.'

/** Beschriftung beider Intelligenzen; m = 0 Blitz allein in der Mitte, 1 = zwei Spalten */
function PairText({ m, fl, flTxt, cr, crTxt, src }: { m: number; fl: number; flTxt: number; cr: number; crTxt: number; src: number }) {
  const x = lerp(170, COL_L, m)
  return (
    <>
      <Txt x={x} y={lerp(190, 170, m)} w={150} o={fl} dy={(1 - fl) * 6}><b className="l">Fluide Intelligenz</b></Txt>
      <Txt x={x} y={lerp(216, 218, m)} w={150} o={flTxt} dy={(1 - flTxt) * 6}>{FLUID_TXT}</Txt>
      <Txt x={COL_R} y={170} w={150} o={cr} dy={(1 - cr) * 6}><b className="l">Kristalline Intelligenz</b></Txt>
      <Txt x={COL_R} y={218} w={150} o={crTxt} dy={(1 - crTxt) * 6}>{CRYST_TXT}</Txt>
      <Txt x={170} y={380} w={300} o={src} className="note">nach Raymond Cattell (1963)</Txt>
    </>
  )
}

function TwoKinds() {
  const t = useClock()
  const m = easeInOut(prog(t, 2300, 650))
  const pb = pop(prog(t, 250, 450))
  const pc = pop(prog(t, 2650, 450))
  return (
    <>
      <Head text="Zwei Arten, klug zu sein" o={prog(t, 0, 300)} />
      <Stage
        svg={
          <>
            <BoltArt x={lerp(170, COL_L, m)} y={lerp(126, 122, m)} s={lerp(5, 2.8, m) * pb} />
            <CrystalArt x={COL_R} y={112} s={4.6 * pc} />
          </>
        }
      >
        <PairText m={m} fl={prog(t, 600, 300)} flTxt={prog(t, 850, 300)} cr={prog(t, 2950, 300)} crTxt={prog(t, 3100, 300)} src={prog(t, 3500, 400)} />
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

/** Kurve plus Verlaengerung nach rechts aus dem Bild (fuer den Schlangen-Abgang), tangential angesetzt */
function extend(base: Pt[], amp: number, wave: number, drift: number): Pt[] {
  const e = base[base.length - 1]
  const q = base[base.length - 4]
  const m = (e[1] - q[1]) / (e[0] - q[0])
  const out = [...base]
  for (let s = 3; s <= 1400; s += 3) out.push([e[0] + s, e[1] + m * s + amp * Math.sin(s / wave) * (1 - Math.exp(-s / 40)) + drift * s * s])
  return out
}
const FLUID_BASE = Array.from({ length: 111 }, (_, i): Pt => [xa(AGE(i / 110)), ya(fluidV(AGE(i / 110)))])
const CRYST_BASE = Array.from({ length: 111 }, (_, i): Pt => [xa(AGE(i / 110)), ya(crystV(AGE(i / 110)))])
const FL = track(extend(FLUID_BASE, 30, 42, 0.00025))
const CR = track(extend(CRYST_BASE, 24, 34, -0.0005))
const FL_LEN = plen(FLUID_BASE)
const CR_LEN = plen(CRYST_BASE)
const AREA = pd([[X0, Y0], ...CRYST_BASE, [CRYST_BASE[CRYST_BASE.length - 1][0], Y0]])
const Y_AXIS = seg([X0, Y0], [X0, YT])
const X_AXIS = seg([X0, Y0], [XE, Y0])
const ARROWS = [...edges([[X0 - 5, YT + 9], [X0, YT], [X0 + 5, YT + 9]], false), ...edges([[XE - 9, Y0 - 5], [XE, Y0], [XE - 9, Y0 + 5]], false)]
const TICKS = [20, 40, 60, 80].map((a) => seg([xa(a), Y0], [xa(a), Y0 + 6], 0.8))

function ChartArt({ axes, deco, fl, cr, areaX, areaO, lf, lc }: { axes: number; deco: number; fl: [number, number]; cr: [number, number]; areaX: number; areaO: number; lf: number; lc: number }) {
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
      <Ink s={dashed(FL, fl[0], fl[1], 7, 5, fl[0])} w={2.4} />
      <Ink s={[{ pts: part(CR, cr[0], cr[1]) }]} w={3.2} />
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
    const s = lerp(4.6, 13, g)
    const shake = 2.6 * prog(t, 800, 700)
    const cx = lerp(COL_R, 170, g) + Math.sin(t * 0.09) * shake
    const cy = lerp(112, 200, g) + Math.cos(t * 0.113) * shake
    const cracks = SHARDS.cracks.flatMap((c, i) => reveal([{ pts: dense(scaled(c, s)) }], easeOut(prog(t, 800 + i * 60, 420))))
    return (
      <>
        <BoltArt x={COL_L} y={122} s={2.8 * (1 - easeIn(prog(t, 0, 250)))} />
        <g transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
          <path d={pd(scaled(CRYSTAL, s))} className="hatch" />
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
        const pts = scaled(p.poly, lerp(lerp(13, 5.8, f), 0.4, conv))
        return (
          <g key={i} transform={`translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)}) rotate(${(p.rot * f + 200 * conv).toFixed(1)})`} opacity={1 - prog(t, 2600, 100)}>
            <path d={pd(pts)} className="hatch" />
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
        {c < 0 && t < 300 && <PairText m={1} fl={1 - out} flTxt={1 - out} cr={1 - out} crTxt={1 - out} src={1 - out} />}
        {c >= 0 && <Txt x={170} y={384} w={300} o={k(1900, 400)} className="note">Schematisch, nach Salthouse (2009) und Hartshorne &amp; Germine (2015)</Txt>}
      </Stage>
    </>
  )
}

// ---------- Folie 3: Was sich trainieren laesst ----------

const DROP: Stroke[] = [bezS([0, -4.2], [1.6, -1.6], [2.6, 0], [2.6, 1.2], 0.55), arcS([0, 1.2], 2.6, 2.6, 0, 180, 0.55), bezS([-2.6, 1.2], [-2.6, 0], [-1.6, -1.6], [0, -4.2], 0.55)]

/** Ausgepowerter Blitz mit Stirnband, laeuft auf der Stelle; Ursprung = Koerpermitte, Boden bei y = 80 */
function Runner({ x, y, t }: { x: number; y: number; t: number }) {
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
    return { pos, o: 1 - l }
  })
  return (
    <g transform={`translate(${x.toFixed(1)} ${(y + bob).toFixed(1)}) rotate(10) scale(1.3)`}>
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
      <Ink s={edges(body)} w={2.6} />
      <ellipse cx={-19} cy={-14.5} rx={3} ry={3.6} className="paper" />
      <Ink s={[ringS([-19, -14.5], 3, 3.6, 0.8), tail(0), tail(1)]} w={2} />
      <Ink s={[...eye([-13, -3]), ...eye([6, -4])]} w={2} />
      <circle cx={-13} cy={-1.2} r={1.4} className="solid" />
      <circle cx={6} cy={-2.2} r={1.4} className="solid" />
      <ellipse cx={1.5} cy={5.2} rx={3.6} ry={3} className="solid" />
      <path d="M-0.4 6.2L-0.4 10.4A2 2 0 0 0 3.6 10.4L3.6 6.2Z" className="paper" />
      <Ink s={[...edges([[-0.4, 6.4], [-0.4, 10.4]], false, 0.6), arcS([1.6, 10.4], 2, 2, 0, 180, 0.6), seg([3.6, 10.4], [3.6, 6.4], 0.6)]} w={2} />
      <Ink s={[...leg(p), ...arm([17, -2], p + Math.PI)]} w={2.2} />
      {drops.map((d, i) => (
        <g key={i} transform={`translate(${d.pos[0].toFixed(1)} ${d.pos[1].toFixed(1)})`} opacity={d.o}>
          <path d="M0 -4.2C1.6 -1.6 2.6 0 2.6 1.2A2.6 2.6 0 0 1 -2.6 1.2C-2.6 0 -1.6 -1.6 0 -4.2Z" className="paper" />
          <Ink s={DROP} w={2} />
        </g>
      ))}
    </g>
  )
}

/** Kraeftiges Glied als Umriss (Papier gefuellt), optional mit Muskel auf der Oberseite; Anfang liegt unter dem Koerper */
function limb(a: Pt, b: Pt, ra: number, rb: number, bulge = 0): { d: string; s: Stroke } {
  const L = dist(a, b)
  const u: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  let n: Pt = [-u[1], u[0]]
  if (n[1] > 0) n = [-n[0], -n[1]]
  const top: Pt[] = []
  const bot: Pt[] = []
  for (let i = 0; i <= 14; i++) {
    const s = i / 14
    const r = lerp(ra, rb, s)
    const c = add(a, mul(u, L * s))
    top.push(add(c, mul(n, r + bulge * Math.sin(Math.PI * s) ** 1.4)))
    bot.push(add(c, mul(n, -r)))
  }
  const cap: Pt[] = []
  for (let i = 1; i < 10; i++) {
    const f = (i / 10) * Math.PI
    cap.push(add(b, add(mul(n, rb * Math.cos(f)), mul(u, rb * Math.sin(f)))))
  }
  const line = [...top, ...cap, ...bot.reverse()]
  return { d: pd(line), s: { pts: dense(line) } }
}

/** Muskel-Kristall mit Hantel; curl 0 = Arm unten, 1 = gebeugt. Ursprung = Koerpermitte, Fuesse bei y = 66 */
function Muki({ curl }: { curl: number }) {
  const body = scaled(CRYSTAL, 5)
  const Sr: Pt = [24, -12]
  const Er: Pt = [62, 6]
  const th = lerp(70, -92, curl)
  const Hr = add(Er, mul(dir(th), 24))
  const bar = dir(th + 90)
  const plate = (at: number, len: number, wd: number): Pt[] => {
    const c = add(Hr, mul(bar, at))
    const f = dir(th)
    return [add(c, add(mul(f, len / 2), mul(bar, -wd / 2))), add(c, add(mul(f, len / 2), mul(bar, wd / 2))), add(c, add(mul(f, -len / 2), mul(bar, wd / 2))), add(c, add(mul(f, -len / 2), mul(bar, -wd / 2)))]
  }
  const plates = [plate(-19, 24, 6), plate(-12.5, 32, 7), plate(12.5, 32, 7), plate(19, 24, 6)]
  const parts = [
    limb([-7, 36], [-12, 58], 5, 4.6),
    limb([7, 36], [12, 58], 5, 4.6),
    limb([-24, -12], [-52, 6], 7, 6, 5),
    limb([-52, 6], [-26, 22], 5.5, 4.6),
    limb(Er, Hr, 5.5, 4.6),
    limb(Sr, Er, 7.5, 6, 4 + 7 * curl),
  ]
  const feet: Pt[] = [[-16, 62], [16, 62]]
  const facet: Pt[] = [body[0], body[1], [0, -8], body[5]]
  return (
    <>
      {feet.map((c, i) => <ellipse key={i} cx={c[0]} cy={c[1]} rx={8} ry={4} className="paper" />)}
      <Ink s={feet.map((c) => ringS(c, 8, 4))} w={2.2} />
      <Ink s={[seg(add(Hr, mul(bar, -23)), add(Hr, mul(bar, 23)), 1.3)]} w={2.2} />
      {plates.map((p, i) => (
        <g key={i}>
          <path d={pd(p)} className="paper" />
          <path d={pd(p)} className="hatch" />
        </g>
      ))}
      <Ink s={plates.flatMap((p) => edges(p))} w={2} />
      {parts.map((l, i) => (
        <g key={i}>
          <path d={l.d} className="paper" />
          <Ink s={[l.s]} w={2.2} />
        </g>
      ))}
      <circle cx={Hr[0]} cy={Hr[1]} r={6} className="paper" />
      <Ink s={[ringS(Hr, 6)]} w={2.2} />
      <path d={pd(body)} className="paper" />
      <path d={pd(facet)} className="hatch" />
      <Ink s={[...edges(body), ...edges([body[5], [0, -8], body[1]], false), seg(body[0], [0, -8], 0.7)]} w={2.6} />
      <circle cx={-25} cy={21} r={5.5} className="paper" />
      <Ink s={[ringS([-25, 21], 5.5)]} w={2.2} />
      <Ink
        s={[
          seg([-18, -2], [-6, 1.2], 1.2),
          arcS([11, 1.5], 7, 3.2, 200, 340, 1.1),
          seg([-15, 6.4], [-7, 6.8], 0.9),
          seg([6, 6], [14, 5.6], 0.9),
          bezS([-8, 17], [-2, 20.5], [5, 20], [10, 13.5], 1.1),
          seg([10.5, 12.4], [12.2, 15.6], 0.6),
        ]}
        w={2}
      />
      <circle cx={-10.6} cy={8.8} r={2.1} className="solid" />
      <circle cx={10.2} cy={8.3} r={2.1} className="solid" />
    </>
  )
}

const TRAIN_IN = 1450
const FLUID_OFF = 2900
const MUKI_IN = 3250

function Trainable({ via }: { via: boolean }) {
  const t = useClock()
  const c = t - (via ? TRAIN_IN : 0)
  const runX = lerp(-90, 170, easeOut(prog(c, 0, 550))) + 330 * easeIn(prog(c, FLUID_OFF, 450))
  const flO = prog(c, 450, 300) * (1 - prog(c, FLUID_OFF - 50, 250))
  const drop = easeIn(prog(c, MUKI_IN, 380))
  const squash = 0.14 * Math.sin(Math.PI * prog(c, MUKI_IN + 380, 240))
  const curl = c > MUKI_IN + 650 ? 0.5 - 0.5 * Math.cos(((c - MUKI_IN - 650) / 1100) * 2 * Math.PI) : 0
  const crO = prog(c, MUKI_IN + 450, 300)
  const snake = easeIn(prog(t, 120, 1300)) * 1250
  const spark = (c / 1400) % 1
  return (
    <>
      {c < 0 ? <Head text="Mit den Jahren" o={1 - prog(t, 0, 250)} /> : <Head text="Was sich trainieren lässt" o={prog(c, 0, 300)} />}
      <Stage
        svg={
          c < 0 ? (
            <ChartArt
              axes={1 - easeIn(prog(t, 0, 380))}
              deco={1 - prog(t, 0, 200)}
              fl={[snake, snake + FL_LEN]}
              cr={[snake, snake + CR_LEN]}
              areaX={XE}
              areaO={1 - prog(t, 0, 250)}
              lf={1 - prog(t, 0, 200)}
              lc={1 - prog(t, 0, 200)}
            />
          ) : (
            <>
              {c < FLUID_OFF + 500 && (
                <>
                  <g opacity={1 - prog(c, FLUID_OFF + 100, 300)}>
                    <Ink s={[seg([50, 250], [290, 250], 0.9)]} w={2} />
                    <Ink
                      s={[0, 1, 2, 3].map((j) => {
                        const x = 270 - ((c * 0.22 + j * 55) % 210)
                        return seg([x, 257], [x + 14, 257], 0.6)
                      })}
                      w={2}
                    />
                  </g>
                  <Runner x={runX} y={156} t={c} />
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
                    <g transform={`translate(218 96) scale(${Math.sin((spark / 0.35) * Math.PI).toFixed(3)})`}>
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
            <Txt x={170} y={274} w={300} o={flO} dy={(1 - prog(c, 450, 300)) * 6}>
              <b className="l">Fluide Intelligenz</b>
              <Dots n={1} t={c - 750} />
              <span className="small">Gehirnjogging verbessert vor allem die geübte Aufgabe – kaum das Denken allgemein (Simons et al. 2016).</span>
            </Txt>
            <Txt x={170} y={274} w={300} o={crO} dy={(1 - crO) * 6}>
              <b className="l">Kristalline Intelligenz</b>
              <Dots n={5} t={c - MUKI_IN - 700} />
              <span className="small">Wächst mit jedem Thema, das du wirklich verstehst – ein Leben lang.</span>
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

interface Art {
  fills: { d: string; hatch?: number }[]
  strokes: Stroke[]
}
const join = (...a: Art[]): Art => ({ fills: a.flatMap((x) => x.fills), strokes: a.flatMap((x) => x.strokes) })

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
function capital(y: number): Art {
  const r1 = 50
  const ry1 = RY * (r1 / R)
  const yt = y - 14
  const l = bezS([PX - R, y], [PX - R - 2, y - 8], [PX - r1 + 6, yt], [PX - r1, yt])
  const r = bezS([PX + R, y], [PX + R + 2, y - 8], [PX + r1 - 6, yt], [PX + r1, yt])
  const body: Pt[] = [...arcS([PX, yt], r1, ry1, 180, 360).pts, ...[...r.pts].reverse(), ...arcS([PX, y], R, RY, 0, 180).pts, ...l.pts]
  const ech: Art = { fills: [{ d: pd(body) }, { d: pd(body), hatch: 0.3 }], strokes: [l, r, arcS([PX, y], R, RY, 0, 180)] }
  return join(ech, slab(58, yt - 7, 11, 9, 7))
}

// Bausteine von unten nach oben: Grundlagen-Sockel, drei Trommeln, Kapitell
const PIECES: { art: Art; bottom: number; mid: number; tilt: number }[] = [
  { art: join(slab(66, 386, 18), torus(369, 46, 12)), bottom: 404, mid: 396, tilt: -6 },
  { art: drum(311, 58), bottom: 376, mid: 336, tilt: 7 },
  { art: drum(253, 58), bottom: 318, mid: 277, tilt: -8 },
  { art: drum(195, 58), bottom: 260, mid: 220, tilt: 6 },
  { art: capital(195), bottom: 198, mid: 176, tilt: -7 },
]
const FALL = [200, 850, 1450, 2050, 2600]
const STEPS: ReactNode[] = [
  <><b>Gerüste</b>Zeitstrahl, Weltkarte, Größenordnungen</>,
  <><b>Verknüpfen</b>Epoche ↔ Kunststil ↔ Philosoph</>,
  <><b>Abrufen</b>statt Wiederlesen, in wachsenden Abständen</>,
  <><b>Jedes Thema</b>ein Stück mehr</>,
]
const STEP_X = 178

const PieceArt = memo(function PieceArt({ art }: { art: Art }) {
  return (
    <>
      {art.fills.map((f, i) => <path key={i} d={f.d} className={f.hatch ? 'hatch' : 'paper'} opacity={f.hatch} />)}
      <Ink s={art.strokes} w={2.2} />
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
          const f = prog(t, FALL[i], 360)
          if (f <= 0) return null
          const land = FALL[i] + 360
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
          const o = prog(t, FALL[i] + 380, 250)
          return (
            <Txt key={i} x={STEP_X} y={PIECES[i].mid} w={156} left mid o={o} dx={(1 - o) * 8} className="step">{s}</Txt>
          )
        })}
      </Stage>
    </>
  )
}

// ---------- Folie 5: Genau dafuer ist diese App ----------

const CIRCLES: { c: Pt; r: number; icon: IconName; text: ReactNode }[] = [
  { c: [90, 100], r: 70, icon: 'HOME', text: <><b>90 Tage</b>Lernpfad mit kurzen Videos</> },
  { c: [250, 138], r: 70, icon: 'CHECK', text: <><b>Verständnischeck</b>mit KI</> },
  { c: [92, 262], r: 70, icon: 'REVIEW', text: <><b>Wiederholen</b>im richtigen Abstand</> },
  { c: [250, 302], r: 70, icon: 'STATS', text: <><b>Statistik</b>Was liegt dir?</> },
]

function ForYou() {
  const t = useClock()
  const lp = pop(prog(t, 150, 450))
  const logo = (
    <svg viewBox="-24 -24 48 48" aria-hidden style={{ transform: `scale(${lp.toFixed(3)}) translateY(${(Math.sin(t / 650) * 1.5).toFixed(2)}px)` }}>
      <CrystalArt x={0} y={0} s={1.75} w={1.9} />
    </svg>
  )
  return (
    <>
      <Head text="Genau dafür ist diese App" o={prog(t, 0, 300)} logo={logo} />
      <Stage
        svg={CIRCLES.map((k, i) => {
          const start = 450 + i * 280
          const d = easeOut(prog(t, start, 380))
          const o = prog(t, start + 260, 250)
          return (
            <g key={i}>
              {d > 0 && <circle cx={k.c[0]} cy={k.c[1]} r={k.r} className="paper" opacity={d} />}
              <Ink s={d >= 1 ? [ringS(k.c, k.r)] : reveal([arcS(k.c, k.r, k.r, -90 + i * 40, 270 + i * 40)], d)} w={2.4} />
              {o > 0 && (
                <g opacity={o}>
                  <IconGroup name={k.icon} transform={`translate(${k.c[0] - 15} ${k.c[1] - 50}) scale(1.25)`} />
                </g>
              )}
            </g>
          )
        })}
      >
        {CIRCLES.map((k, i) => {
          const o = prog(t, 450 + i * 280 + 260, 250)
          return <Txt key={i} x={k.c[0]} y={k.c[1] - 12} w={112} o={o} dy={(1 - o) * 5} className="circle">{k.text}</Txt>
        })}
      </Stage>
    </>
  )
}

// ---------- Ablauf ----------

const SLIDES: ((p: { via: boolean }) => ReactNode)[] = [TwoKinds, Ages, Trainable, Pillar, ForYou]

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
