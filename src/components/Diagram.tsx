import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { arc, arrowHead, circle, dashes, line, poly, roundRect, type Pt, type Stroke } from '../lib/ink'
import { InkCanvas, InkPaths } from './Ink'
import { inline, plain } from './inline'

// Tusche-Diagramme fuer Lernzettel, im Markdown als Codeblock mit Sprache:
//   ```kette       Schritte, je Zeile ein Kasten; „→ Text“ beschriftet den Pfeil davor; erste Zeile „!senkrecht“ erzwingt Spalte
//   ```kreis       Kreislauf, je Zeile eine Station; „Mitte: Text“ in die Mitte
//   ```zeitstrahl  „Zeit | Ereignis“
//   ```baum        Hierarchie, Einrueckung mit 2 Leerzeichen
//   ```gruppen     Kaesten: Zeile ohne Einrueckung = Titel, eingerueckte Zeilen = Inhalt
//   ```pyramide    Stufen von oben nach unten; „Pfeil: Text“ zeichnet einen Pfeil nach oben daneben
//   ```schichten   Querschnitt, Baender von oben nach unten; „~“ davor = schraffiert
//   ```kurve       „x: Achse“, „y: Achse“, Reihen „Name: x y, x y …“ (Name mit „-“ davor = gestrichelt),
//                  „punkt: x y | Text“, „linie: y=5 | Text“ / „linie: x=2 | Text“, „xmarken: 0, 1=Tag 1“, „ymarken: …“, „glatt: nein“,
//                  „beschriftung: spitze“ (Namen ueber dem hoechsten Punkt statt am Ende); Name „_“ = ohne Beschriftung
//   ```balken      „Name: Wert | Anzeige“
// Ueberall gilt „Titel | Zusatz“: zweiter Teil kleiner darunter.
// Gezeichnete Diagramme (kreis, kurve) werden fuer die verfuegbare Breite gesetzt, damit die Schrift nicht mitschrumpft.

const KINDS = ['kette', 'kreis', 'zeitstrahl', 'baum', 'gruppen', 'pyramide', 'schichten', 'kurve', 'balken'] as const
type Kind = (typeof KINDS)[number]

export function isDiagram(lang: string): lang is Kind {
  return (KINDS as readonly string[]).includes(lang)
}

function rows(src: string): string[] {
  return src.replace(/\r/g, '').split('\n').filter((l) => l.trim())
}

function split(t: string): [string, string] {
  const i = t.indexOf(' | ')
  return i < 0 ? [t.trim(), ''] : [t.slice(0, i).trim(), t.slice(i + 3).trim()]
}

function Label({ text }: { text: string }) {
  const [a, b] = split(text)
  return (
    <>
      <span className="dg-t">{inline(a)}</span>
      {b && <span className="dg-s">{inline(b)}</span>}
    </>
  )
}

/** Zeilenumbruch nach Zeichenzahl (SVG-Text kann nicht selbst umbrechen) */
function wrap(text: string, max: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const w of text.split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur)
      cur = w
    } else cur = cur ? cur + ' ' + w : w
  }
  if (cur) out.push(cur)
  return out
}

/** ungefaehre Textbreite in px (system-ui) */
const tw = (s: string, size: number, bold = false) => s.length * size * (bold ? 0.58 : 0.54)

/** verfuegbare Breite des Diagramms */
function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

const ARROW_H = line([2, 10], [32, 10])
const ARROW_V = line([10, 2], [10, 24])

/** Pfeil in beiden Richtungen; CSS zeigt den passenden (waagerecht oder als Spalte) */
function Arrow({ label }: { label?: string }) {
  return (
    <span className="dg-arrow">
      <svg className="h" width={34} height={20} aria-hidden>
        <InkPaths strokes={[ARROW_H, ...arrowHead(ARROW_H, 6)]} w={2} />
      </svg>
      <svg className="v" width={20} height={26} aria-hidden>
        <InkPaths strokes={[ARROW_V, ...arrowHead(ARROW_V, 6)]} w={2} />
      </svg>
      {label && <span className="dg-s">{inline(label)}</span>}
    </span>
  )
}

function Kette({ src }: { src: string }) {
  const r = rows(src)
  const forced = r[0]?.trim() === '!senkrecht'
  const items: { text: string; arrow?: string }[] = []
  let pending: string | undefined
  for (const l of forced ? r.slice(1) : r) {
    const t = l.trim()
    if (t.startsWith('→') || t.startsWith('->')) pending = t.replace(/^(→|->)\s*/, '')
    else {
      items.push({ text: t, arrow: pending })
      pending = undefined
    }
  }
  const down = forced || items.length > 5 || items.some((it) => plain(split(it.text)[0]).length > 26 || it.arrow)
  return (
    <div className="dg">
      <div className={`dg-kette ${down ? 'down' : ''}`}>
        {items.map((it, i) => (
          <Fragment key={i}>
            {i > 0 && <Arrow label={it.arrow} />}
            <div className="dg-box">
              <Label text={it.text} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

/** Kreislauf so setzen, dass er in die Breite passt: erst Text enger umbrechen, dann kleiner zeichnen */
function kreisLayout(items: [string, string][], mid: string[], cw: number) {
  const n = items.length
  let best = null as null | { boxes: { la: string[]; lb: string[]; w: number; h: number }[]; R: number; W: number; H: number; ml: string[] }
  for (const [ca, cb] of [[16, 20], [13, 17], [11, 14], [9, 12]]) {
    const boxes = items.map(([a, b]) => {
      const la = wrap(a, ca).slice(0, 3)
      const lb = b ? wrap(b, cb).slice(0, 3) : []
      const w = Math.max(...la.map((s) => tw(s, 13, true)), ...lb.map((s) => tw(s, 11))) + 18
      const h = la.length * 16 + lb.length * 13 + 12
      return { la, lb, w, h }
    })
    const mw = Math.max(...boxes.map((b) => b.w)) / 2
    const mh = Math.max(...boxes.map((b) => b.h)) / 2
    const ml = mid.length ? wrap(mid.join(' '), ca + 2) : []
    const midW = Math.max(0, ...ml.map((s) => tw(s, 13, true))) / 2
    const base = (n <= 4 ? 92 : n <= 6 ? 108 : 122) * (cw < 420 ? 0.85 : 1)
    const R = Math.max(base, ml.length ? mw + midW + 12 : 0, ml.length ? mh + ml.length * 8 + 12 : 0, n > 4 ? (mw + 6) / Math.sin(Math.PI / n) / 1.6 : 0)
    const W = Math.max(2 * (R + mw) + 12, 260)
    const H = 2 * (R + mh) + 12
    best = { boxes, R, W, H, ml }
    if (W <= cw) break
  }
  return best!
}

function Kreis({ src }: { src: string }) {
  const [ref, cw] = useWidth()
  const r = rows(src).map((l) => l.trim())
  const mid = r.find((l) => /^Mitte:/i.test(l))?.replace(/^Mitte:\s*/i, '')
  const items = r.filter((l) => !/^Mitte:/i.test(l)).map((l) => split(plain(l)))
  const n = items.length
  const { boxes, R, W, H, ml } = kreisLayout(items, mid ? [plain(mid)] : [], cw || 600)
  const cx = W / 2
  const cy = H / 2
  const pos = (deg: number): Pt => [cx + Math.sin((deg * Math.PI) / 180) * R, cy - Math.cos((deg * Math.PI) / 180) * R]
  const ang = (i: number) => (360 * i) / n
  const inside = (p: Pt, i: number, m: number) => {
    const c = pos(ang(i))
    return Math.abs(p[0] - c[0]) < boxes[i].w / 2 + m && Math.abs(p[1] - c[1]) < boxes[i].h / 2 + m
  }
  const strokes: Stroke[] = []
  boxes.forEach((b, i) => {
    const [x, y] = pos(ang(i))
    const s = roundRect(x - b.w / 2, y - b.h / 2, b.w, b.h, 9, 0.8)
    s.p = 0.16
    s.seed = i * 3
    strokes.push(s)
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    let a0 = ang(i)
    let a1 = ang(i) + 360 / n
    while (a0 < a1 && inside(pos(a0), i, 5)) a0 += 0.5
    while (a1 > a0 && inside(pos(a1), j, 8)) a1 -= 0.5
    if (a1 - a0 < 4) continue
    const s = arc(cx, cy, R, a0 - 90, a1 - 90, 0.9)
    strokes.push(s, ...arrowHead(s, 7, 0.9))
  }
  return (
    <div className="dg dg-svg" ref={ref}>
      {cw > 0 && (
        <svg width={Math.round(W)} height={Math.round(H)} viewBox={`0 0 ${W.toFixed(1)} ${H.toFixed(1)}`} role="img" aria-label={items.map((x) => x[0]).join(' → ')}>
          {boxes.map((b, i) => {
            const [x, y] = pos(ang(i))
            return <rect key={i} x={x - b.w / 2} y={y - b.h / 2} width={b.w} height={b.h} rx={9} className="dg-paper" />
          })}
          <InkPaths strokes={strokes} w={2.2} />
          {boxes.map((b, i) => {
            const [x, y] = pos(ang(i))
            const top = y - b.h / 2 + 6
            return (
              <text key={i} x={x} textAnchor="middle">
                {b.la.map((s, k) => (
                  <tspan key={k} x={x} y={top + 12 + k * 16} className="dg-tb">{s}</tspan>
                ))}
                {b.lb.map((s, k) => (
                  <tspan key={`s${k}`} x={x} y={top + 12 + b.la.length * 16 + k * 13 - 2} className="dg-ts">{s}</tspan>
                ))}
              </text>
            )
          })}
          {ml.length > 0 && (
            <text x={cx} textAnchor="middle">
              {ml.map((s, k) => (
                <tspan key={k} x={cx} y={cy - ((ml.length - 1) * 16) / 2 + 5 + k * 16} className="dg-tb">{s}</tspan>
              ))}
            </text>
          )}
        </svg>
      )}
    </div>
  )
}

function Zeitstrahl({ src }: { src: string }) {
  const items = rows(src).map((l) => split(l.trim()))
  const draw = (_w: number, _h: number, el: HTMLElement): Stroke[] => {
    const rs = [...el.querySelectorAll<HTMLElement>('.dg-zeit-row')]
    const x = parseFloat(getComputedStyle(el).getPropertyValue('--zx')) || 0
    const ys = rs.map((r) => r.offsetTop + 13)
    const out: Stroke[] = []
    ys.forEach((y, i) => {
      out.push(circle(x, y, 5, 0.75))
      if (i < ys.length - 1) out.push(line([x, y + 7], [x, ys[i + 1] - 7]))
    })
    if (ys.length) {
      const end = line([x, ys[ys.length - 1] + 7], [x, ys[ys.length - 1] + 26])
      out.push(end, ...arrowHead(end, 6))
    }
    return out
  }
  return (
    <div className="dg dg-zeit">
      <InkCanvas draw={draw} w={2} />
      {items.map(([a, b], i) => (
        <div key={i} className="dg-zeit-row">
          <b className="dg-when">{inline(a)}</b>
          <span className="dg-what">{b ? <Label text={b} /> : null}</span>
        </div>
      ))}
    </div>
  )
}

interface Node {
  text: string
  depth: number
  parent: number
}

function parseTree(src: string): Node[] {
  const out: Node[] = []
  const stack: number[] = []
  for (const l of rows(src)) {
    const depth = Math.floor((l.length - l.trimStart().length) / 2)
    while (stack.length > depth) stack.pop()
    out.push({ text: l.trim().replace(/^[-*•]\s+/, ''), depth: stack.length, parent: stack.length ? stack[stack.length - 1] : -1 })
    stack.push(out.length - 1)
  }
  return out
}

const IND = 24

function Baum({ src }: { src: string }) {
  const nodes = parseTree(src)
  const draw = (_w: number, _h: number, el: HTMLElement): Stroke[] => {
    const rs = [...el.querySelectorAll<HTMLElement>('.dg-node')]
    const out: Stroke[] = []
    const mid = (r: HTMLElement) => r.offsetTop + 12
    nodes.forEach((nd, i) => {
      if (nd.parent < 0 || !rs[i]) return
      const p = rs[nd.parent]
      const x = nodes[nd.parent].depth * IND + 7
      out.push(line([x, mid(rs[i])], [nd.depth * IND - 6, mid(rs[i])]))
      const last = nodes.map((m, k) => (m.parent === nd.parent ? k : -1)).filter((k) => k >= 0).pop()
      if (last === i) out.push(line([x, p.offsetTop + p.offsetHeight - 2], [x, mid(rs[i])]))
    })
    return out
  }
  return (
    <div className="dg dg-baum">
      <InkCanvas draw={draw} w={1.8} />
      {nodes.map((nd, i) => (
        <div key={i} className={`dg-node d${Math.min(nd.depth, 4)}`} style={{ paddingLeft: nd.depth * IND }}>
          <Label text={nd.text} />
        </div>
      ))}
    </div>
  )
}

function Gruppen({ src }: { src: string }) {
  const nodes = parseTree(src)
  const groups = nodes.map((n, i) => ({ n, i })).filter((x) => x.n.depth === 0)
  return (
    <div className="dg dg-gruppen">
      {groups.map(({ n, i }) => {
        const kids = nodes.filter((m) => m.parent === i)
        return (
          <div key={i} className="dg-group">
            <div className="dg-gt"><Label text={n.text} /></div>
            {kids.length > 0 && (
              <ul>
                {kids.map((m, k) => {
                  const [a, b] = split(m.text)
                  return <li key={k}>{inline(a)}{b && <span className="dg-s"> – {inline(b)}</span>}</li>
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Anteil der Breite an der Spitze der Pyramide */
const PYR_TOP = 0.36

function Pyramide({ src }: { src: string }) {
  const r = rows(src).map((l) => l.trim())
  const arrowText = r.find((l) => /^Pfeil:/i.test(l))?.replace(/^Pfeil:\s*/i, '')
  const items = r.filter((l) => !/^Pfeil:/i.test(l))
  const n = items.length
  const draw = (w: number, _h: number, el: HTMLElement): Stroke[] => {
    const rs = [...el.querySelectorAll<HTMLElement>('.dg-lvl')]
    if (!rs.length) return []
    const off = rs[0].offsetLeft
    const pw = rs[0].offsetWidth
    const y0 = rs[0].offsetTop
    const yb = rs[rs.length - 1].offsetTop + rs[rs.length - 1].offsetHeight
    const half = (y: number) => (pw * (PYR_TOP + ((1 - PYR_TOP) * (y - y0)) / (yb - y0 || 1))) / 2
    const cx = off + pw / 2
    const out: Stroke[] = poly([[cx - half(y0), y0], [cx + half(y0), y0], [cx + half(yb), yb], [cx - half(yb), yb]], true, 1)
    rs.slice(1).forEach((r) => out.push(line([cx - half(r.offsetTop), r.offsetTop], [cx + half(r.offsetTop), r.offsetTop], 0.7)))
    out.forEach((s, i) => ((s.p = 0.16), (s.seed = i)))
    if (arrowText) {
      const s = line([12, yb], [12, y0 + 2], 0.9)
      out.push(s, ...arrowHead(s, 7, 0.9))
    }
    return out.filter(() => w > 0)
  }
  return (
    <div className={`dg dg-pyr ${arrowText ? 'arrow' : ''}`}>
      <InkCanvas draw={draw} w={2.2} />
      {arrowText && <span className="dg-pyr-label">{inline(arrowText)}</span>}
      {items.map((t, i) => {
        const f = PYR_TOP + ((1 - PYR_TOP) * (i + 0.5)) / n
        return (
          <div key={i} className="dg-lvl" style={{ '--inset': `${((1 - f) / 2) * 100}%` } as CSSProperties}>
            <Label text={t} />
          </div>
        )
      })}
    </div>
  )
}

function Schichten({ src }: { src: string }) {
  const items = rows(src).map((l) => {
    const t = l.trim()
    return { text: t.replace(/^~\s*/, ''), hatch: t.startsWith('~') }
  })
  return (
    <div className="dg">
      <div className="dg-layers">
        {items.map((x, i) => (
          <div key={i} className={`dg-layer ${x.hatch ? 'hatch' : ''}`}>
            <span className="dg-lab">
              <Label text={x.text} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Zahl oder „Wert=Beschriftung“ */
function marks(v: string): { v: number; label: string }[] {
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [a, b] = s.split('=')
      return { v: parseFloat(a), label: (b ?? a).trim() }
    })
    .filter((m) => !isNaN(m.v))
}

/** monotone kubische Interpolation (Fritsch–Carlson): glatt, ohne Ueberschwingen */
function smooth(p: Pt[], steps = 14): Pt[] {
  const n = p.length
  if (n < 3) return p
  const dx = p.slice(1).map((q, i) => q[0] - p[i][0])
  const m = p.slice(1).map((q, i) => (q[1] - p[i][1]) / (dx[i] || 1))
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]))
  t.push(m[n - 2])
  const out: Pt[] = []
  for (let i = 0; i < n - 1; i++) {
    for (let k = 0; k < steps; k++) {
      const s = k / steps
      const h = dx[i]
      const h00 = 2 * s ** 3 - 3 * s ** 2 + 1
      const h10 = s ** 3 - 2 * s ** 2 + s
      const h01 = -2 * s ** 3 + 3 * s ** 2
      const h11 = s ** 3 - s ** 2
      out.push([p[i][0] + s * h, h00 * p[i][1] + h10 * h * t[i] + h01 * p[i + 1][1] + h11 * h * t[i + 1]])
    }
  }
  out.push(p[n - 1])
  return out
}

/** Punkte enger setzen, damit die Federbreite gleichmaessig wechselt */
function densify(p: Pt[]): Pt[] {
  const out: Pt[] = [p[0]]
  for (let i = 1; i < p.length; i++) {
    const n = Math.max(1, Math.ceil(Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) / 1.2))
    for (let k = 1; k <= n; k++) out.push([p[i - 1][0] + ((p[i][0] - p[i - 1][0]) * k) / n, p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * k) / n])
  }
  return out
}

function Kurve({ src }: { src: string }) {
  const [ref, cw] = useWidth()
  let xl = ''
  let yl = ''
  let xm: { v: number; label: string }[] = []
  let ym: { v: number; label: string }[] = []
  let glatt = true
  let peak = false
  const series: { name: string; dashed: boolean; pts: Pt[] }[] = []
  const points: { p: Pt; label: string }[] = []
  const lines: { axis: 'x' | 'y'; v: number; label: string }[] = []
  for (const raw of rows(src)) {
    const l = raw.trim()
    const c = l.indexOf(':')
    if (c < 0) continue
    const key = l.slice(0, c).trim()
    const val = l.slice(c + 1).trim()
    const k = key.toLowerCase()
    if (k === 'x') xl = val
    else if (k === 'y') yl = val
    else if (k === 'xmarken') xm = marks(val)
    else if (k === 'ymarken') ym = marks(val)
    else if (k === 'glatt') glatt = !/^nein/i.test(val)
    else if (k === 'beschriftung') peak = /^spitze/i.test(val)
    else if (k === 'punkt') {
      const [a, b] = split(val)
      const [x, y] = a.split(/\s+/).map(parseFloat)
      if (!isNaN(x) && !isNaN(y)) points.push({ p: [x, y], label: b })
    } else if (k === 'linie') {
      const [a, b] = split(val)
      const m = /^([xy])\s*=\s*(-?[\d.]+)/.exec(a)
      if (m) lines.push({ axis: m[1] as 'x' | 'y', v: parseFloat(m[2]), label: b })
    } else {
      const pts = val
        .split(',')
        .map((s) => s.trim().split(/\s+/).map(parseFloat))
        .filter((q) => q.length === 2 && !isNaN(q[0]) && !isNaN(q[1])) as Pt[]
      if (pts.length > 1) series.push({ name: key.replace(/^-\s*/, ''), dashed: key.startsWith('-'), pts })
    }
  }
  const xs = [...series.flatMap((s) => s.pts.map((p) => p[0])), ...xm.map((m) => m.v), ...points.map((p) => p.p[0]), ...lines.filter((l) => l.axis === 'x').map((l) => l.v)]
  const ys = [...series.flatMap((s) => s.pts.map((p) => p[1])), ...ym.map((m) => m.v), ...points.map((p) => p.p[1]), ...lines.filter((l) => l.axis === 'y').map((l) => l.v)]
  if (!xs.length || !ys.length) return null
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  let y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  if (y0 > 0 && y0 < 0.5 * y1) y0 = 0
  const ry = (y1 - y0 || 1) * 1.1
  const W = Math.max(280, Math.min(cw || 420, 540))
  const H = Math.round(Math.max(190, Math.min(W * 0.55, 260)))
  const L = Math.max(30, ...ym.map((m) => tw(m.label, 11) + 12))
  const R = Math.min(W * 0.3, Math.max(16, ...series.filter(() => !peak).map((s) => (s.name === '_' ? 0 : tw(s.name, 12) + 10)), ...lines.filter((l) => l.axis === 'y').map((l) => tw(l.label, 11) + 8)))
  const T = 22
  const B = xm.length ? 38 : 24
  const px = (x: number) => L + ((x - x0) / (x1 - x0 || 1)) * (W - L - R)
  const py = (y: number) => H - B - ((y - y0) / ry) * (H - T - B)
  const strokes: Stroke[] = []
  const thin: Stroke[] = []
  const ax = line([L, H - B], [W - R + 12, H - B])
  const ay = line([L, H - B], [L, T - 8])
  strokes.push(ax, ...arrowHead(ax, 6), ay, ...arrowHead(ay, 6))
  xm.forEach((m) => thin.push(line([px(m.v), H - B - 3], [px(m.v), H - B + 4])))
  ym.forEach((m) => thin.push(line([L - 4, py(m.v)], [L + 3, py(m.v)])))
  lines.forEach((l) => {
    const s = l.axis === 'y' ? line([L, py(l.v)], [W - R, py(l.v)], 0.55) : line([px(l.v), H - B], [px(l.v), T], 0.55)
    thin.push(...dashes(s, 5, 4))
  })
  const ends: { x: number; y: number; name: string; anchor: 'start' | 'middle' | 'end' }[] = []
  series.forEach((s, i) => {
    const sc = s.pts.map((p) => [px(p[0]), py(p[1])] as Pt)
    const pts = glatt ? smooth(sc) : sc
    const st: Stroke = { pts: densify(pts), w: 1.15, p: 0.12, seed: i * 5 }
    if (s.dashed) strokes.push(...dashes(st, 8, 5))
    else strokes.push(st)
    if (s.name === '_') return
    const top = sc.reduce((a, b) => (b[1] < a[1] ? b : a))
    const end = sc[sc.length - 1]
    // passt der Name nicht rechts neben das Ende, steht er darueber
    const fits = W - end[0] - 6 >= tw(s.name, 12)
    ends.push(
      peak
        ? { x: top[0], y: top[1] - 10, name: s.name, anchor: 'middle' }
        : fits
          ? { x: end[0] + 6, y: end[1] + 4, name: s.name, anchor: 'start' }
          : { x: end[0], y: end[1] - 9, name: s.name, anchor: 'end' },
    )
  })
  if (!peak) {
    ends.sort((a, b) => a.y - b.y)
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14
  }
  return (
    <div className="dg dg-svg" ref={ref}>
      {cw > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={[yl, xl, ...series.map((s) => s.name)].filter(Boolean).join(', ')}>
          <InkPaths strokes={thin} w={1.5} />
          <InkPaths strokes={strokes} w={2.2} />
          {points.map((q, i) => (
            <g key={i}>
              <circle cx={px(q.p[0])} cy={py(q.p[1])} r={3.6} className="dg-dot" />
              {q.label && <text x={px(q.p[0]) + 6} y={py(q.p[1]) - 7} className="dg-ts">{plain(q.label)}</text>}
            </g>
          ))}
          {ends.map((e, i) => (
            <text key={i} x={e.x} y={e.y} textAnchor={e.anchor} className="dg-tl">{plain(e.name)}</text>
          ))}
          {lines.map((l, i) =>
            l.label ? (
              l.axis === 'y' ? (
                <text key={i} x={W - R + 4} y={py(l.v) + 4} className="dg-ts">{plain(l.label)}</text>
              ) : (
                <text key={i} x={px(l.v) + 4} y={T + 4} className="dg-ts">{plain(l.label)}</text>
              )
            ) : null,
          )}
          {xm.map((m, i) => (
            <text key={i} x={px(m.v)} y={H - B + 16} textAnchor="middle" className="dg-ts">{m.label}</text>
          ))}
          {ym.map((m, i) => (
            <text key={i} x={L - 7} y={py(m.v) + 4} textAnchor="end" className="dg-ts">{m.label}</text>
          ))}
          {yl && <text x={L + 8} y={T - 6} className="dg-tl">{plain(yl)}</text>}
          {xl && <text x={W - R + 12} y={H - 6} textAnchor="end" className="dg-tl">{plain(xl)}</text>}
        </svg>
      )}
    </div>
  )
}

function Balken({ src }: { src: string }) {
  const items = rows(src)
    .map((l) => {
      const t = l.trim()
      const bar = t.indexOf(' | ')
      const c = t.lastIndexOf(':', bar < 0 ? undefined : bar)
      const [val, shown] = split(t.slice(c + 1))
      return { name: t.slice(0, c).trim(), v: parseFloat(val), shown: shown || val.trim() }
    })
    .filter((x) => x.name && !isNaN(x.v))
  const max = Math.max(...items.map((x) => x.v), 0) || 1
  return (
    <div className="dg dg-balken">
      {items.map((x, i) => (
        <Fragment key={i}>
          <span className="dg-bn">{inline(x.name)}</span>
          <span className="dg-bt">
            <span className="dg-bar" style={{ width: `${Math.max(1.5, (x.v / max) * 100) * 0.8}%` }} />
            <span className="dg-bv">{inline(x.shown)}</span>
          </span>
        </Fragment>
      ))}
    </div>
  )
}

const MAP: Record<Kind, (p: { src: string }) => ReactNode> = {
  kette: Kette,
  kreis: Kreis,
  zeitstrahl: Zeitstrahl,
  baum: Baum,
  gruppen: Gruppen,
  pyramide: Pyramide,
  schichten: Schichten,
  kurve: Kurve,
  balken: Balken,
}

export function Diagram({ kind, src }: { kind: Kind; src: string }) {
  const C = MAP[kind]
  return <C src={src} />
}
