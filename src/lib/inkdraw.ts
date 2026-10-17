// Tusche-Zeichnen direkt ins SVG (für die animierten Häppchen in „Entdecken“, lib/scene.ts).
// Gleiche Feder wie lib/ink.ts (fester Federwinkel, Breite je Richtung, Pinsel-Druckwechsel, auslaufende Enden),
// aber gröber abgetastet für große Bühnen (360 × 680) und mit Zeichen-Animation: Jeder Strich wird über eine Maske
// entlang seiner Mittellinie aufgedeckt, als würde er gerade gezogen.

export type P = [number, number]

const NS = 'http://www.w3.org/2000/svg'
const NIB = (35 * Math.PI) / 180
const dist = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1])
const f2 = (v: number) => Math.round(v * 100) / 100
const pt = (q: P) => `${f2(q[0])} ${f2(q[1])}`

/* ---------- Formen als Punktlisten ---------- */

export function L(a: P, b: P, step = 2): P[] {
  const n = Math.max(2, Math.ceil(dist(a, b) / step))
  return Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n])
}

/** Kubische Bézierkurve */
export function B(p0: P, p1: P, p2: P, p3: P): P[] {
  const n = Math.max(8, Math.ceil((dist(p0, p1) + dist(p1, p2) + dist(p2, p3)) / 2))
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]
  })
}

/** Ellipse oder Bogen; Winkel in Grad, 0 = rechts, im Uhrzeigersinn */
export function E(cx: number, cy: number, rx: number, ry = rx, a0 = 0, a1 = 360): P[] {
  const n = Math.max(16, Math.ceil(((Math.abs(a1 - a0) / 360) * 2 * Math.PI * Math.max(rx, ry)) / 2))
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })
}

/** Abgerundetes Rechteck (geschlossen) */
export function RR(x: number, y: number, w: number, h: number, r: number): P[] {
  r = Math.max(0.5, Math.min(r, w / 2, h / 2))
  const p: P[] = []
  const seg = (a: P, b: P) => p.push(...L(a, b, 3).slice(0, -1))
  const cor = (cx: number, cy: number, a0: number) => p.push(...E(cx, cy, r, r, a0, a0 + 90).slice(0, -1))
  seg([x + r, y], [x + w - r, y])
  cor(x + w - r, y + r, 270)
  seg([x + w, y + r], [x + w, y + h - r])
  cor(x + w - r, y + h - r, 0)
  seg([x + w - r, y + h], [x + r, y + h])
  cor(x + r, y + h - r, 90)
  seg([x, y + h - r], [x, y + r])
  cor(x + r, y + r, 180)
  p.push(p[0])
  return p
}

/** Polygonzug durch die Punkte (geschlossen, wenn erster = letzter) */
export function poly(...pts: P[]): P[] {
  const out: P[] = []
  for (let i = 0; i < pts.length - 1; i++) out.push(...L(pts[i], pts[i + 1]).slice(i ? 1 : 0))
  return out
}

/** Punkte verschieben/skalieren */
export function move(pts: P[], dx: number, dy: number, s = 1): P[] {
  return pts.map(([x, y]) => [x * s + dx, y * s + dy])
}

/* ---------- Strich-Umriss ---------- */

export function outline(p: P[], base: number, pr = 0.14, seed = 0): string {
  const n = p.length
  if (n < 2) return ''
  const Ls = [0]
  for (let i = 1; i < n; i++) Ls.push(Ls[i - 1] + dist(p[i - 1], p[i]))
  const total = Ls[n - 1]
  const le: P[] = []
  const ri: P[] = []
  for (let i = 0; i < n; i++) {
    const a = p[Math.max(0, i - 1)]
    const b = p[Math.min(n - 1, i + 1)]
    let tx = b[0] - a[0]
    let ty = b[1] - a[1]
    const tl = Math.hypot(tx, ty) || 1
    tx /= tl
    ty /= tl
    let w = base * (0.62 + 0.55 * Math.abs(Math.sin(Math.atan2(ty, tx) - NIB)))
    w *= 1 + pr * (0.6 * Math.sin(Ls[i] / 19 + seed) + 0.4 * Math.sin(Ls[i] / 53 + seed * 2.3))
    w *= Math.min(1, 0.5 + Math.min(Ls[i], total - Ls[i]) / (base * 3))
    le.push([p[i][0] - (ty * w) / 2, p[i][1] + (tx * w) / 2])
    ri.push([p[i][0] + (ty * w) / 2, p[i][1] - (tx * w) / 2])
  }
  const re = dist(le[n - 1], ri[n - 1]) / 2
  const rs = dist(le[0], ri[0]) / 2
  return `M${le.map(pt).join('L')}A${f2(re)} ${f2(re)} 0 0 0 ${pt(ri[n - 1])}L${ri.reverse().map(pt).join('L')}A${f2(rs)} ${f2(rs)} 0 0 0 ${pt(le[0])}Z`
}

/* ---------- SVG-Bausteine ---------- */

let uid = 0

export function mk<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag)
  for (const k in attrs) e.setAttribute(k, String(attrs[k]))
  if (parent) parent.appendChild(e)
  return e
}

export interface InkOpt {
  /** Strichbreite */
  w?: number
  /** Verzögerung bis zum Zeichnen (ms) */
  d?: number
  /** Zeichendauer (ms); 0 = sofort sichtbar */
  t?: number
  /** Pinsel-Druckwechsel */
  p?: number
  seed?: number
}

/** Tusche-Strich, wird beim Erscheinen gezeichnet */
export function ink(g: Element, pts: P[], o: InkOpt = {}): SVGPathElement {
  const w = o.w ?? 3
  const d = outline(pts, w, o.p ?? 0.14, o.seed ?? uid % 7)
  if (o.t === 0) return mk('path', { d, class: 'k' }, g)
  const id = `ik${++uid}`
  const m = mk('mask', { id, maskUnits: 'userSpaceOnUse', x: -400, y: -400, width: 1200, height: 1600 }, g)
  mk(
    'path',
    {
      d: `M${pts.map(pt).join('L')}`,
      fill: 'none',
      stroke: '#fff',
      'stroke-width': w * 2.6 + 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      pathLength: 1,
      class: 'draw',
      style: `--d:${o.d ?? 0}ms;--t:${o.t ?? 500}ms`,
    },
    m,
  )
  return mk('path', { d, class: 'k', mask: `url(#${id})` }, g)
}

/** Schraffierte Fläche, blendet nach `d` ms ein */
export function hatch(g: Element, pts: P[], d = 0, dense = false): SVGPathElement {
  return mk('path', { d: `M${pts.map(pt).join('L')}Z`, fill: `url(#${dense ? 'sh2' : 'sh'})`, class: 'fade', style: `--d:${d}ms` }, g)
}

/** Weiße Fläche (deckt Dahinterliegendes ab) */
export function blank(g: Element, pts: P[]): SVGPathElement {
  return mk('path', { d: `M${pts.map(pt).join('L')}Z`, fill: '#fff' }, g)
}

/** Gestrichelte Linie aus einzelnen Tusche-Strichen */
export function dashes(g: Element, pts: P[], o: InkOpt & { dash?: number; gap?: number; step?: number } = {}): void {
  const dash = o.dash ?? 9
  const gap = o.gap ?? 7
  let cur: P[] = []
  let pos = 0
  let k = 0
  const flush = () => {
    if (cur.length > 1) ink(g, cur, { ...o, d: (o.d ?? 0) + k++ * (o.step ?? 40), t: o.t ?? 120 })
    cur = []
  }
  pts.forEach((q, i) => {
    if (i) pos += dist(pts[i - 1], q)
    if (pos % (dash + gap) < dash) cur.push(q)
    else flush()
  })
  flush()
}

/** Strich mit Pfeilspitze am Ende */
export function arrow(g: Element, pts: P[], o: InkOpt & { head?: number } = {}): void {
  ink(g, pts, o)
  const tip = pts[pts.length - 1]
  const back = pts[Math.max(0, pts.length - 4)]
  const a = Math.atan2(tip[1] - back[1], tip[0] - back[0])
  const s = o.head ?? 11
  const d = (o.d ?? 0) + (o.t === 0 ? 0 : (o.t ?? 500))
  for (const da of [0.55, -0.55]) ink(g, L([tip[0] - Math.cos(a + da) * s, tip[1] - Math.sin(a + da) * s], tip), { w: o.w, d, t: o.t === 0 ? 0 : 140 })
}

export interface TextOpt {
  d?: number
  anchor?: 'start' | 'middle' | 'end'
  /** Klassen: tx (Standard), s (klein), b (groß), serif */
  cls?: string
  size?: number
  fade?: boolean
}

/** Beschriftung im SVG */
export function text(g: Element, x: number, y: number, s: string, o: TextOpt = {}): SVGTextElement {
  const e = mk('text', { x, y, class: `tx ${o.cls ?? ''}${o.fade === false ? '' : ' fade'}`, 'text-anchor': o.anchor ?? 'start', style: `--d:${o.d ?? 0}ms${o.size ? `;font-size:${o.size}px` : ''}` }, g)
  e.textContent = s
  return e
}

/** Gruppe; `cls` steuert Zustände über CSS, `style` z. B. Animationsverzögerung */
export function group(g: Element, cls = '', style = ''): SVGGElement {
  return mk('g', { class: cls, style }, g)
}

/** Gruppe, die nach `d` ms aufploppt (Ursprung unten Mitte) */
export function pop(g: Element, d = 0, origin = '50% 100%'): SVGGElement {
  return mk('g', { class: 'pop', style: `--d:${d}ms;transform-origin:${origin}` }, g)
}

/** Zahl hochzählen (Text-Element), Format über fmt */
export function countUp(t: SVGTextElement, to: number, d: number, ms = 1200, fmt: (v: number) => string = (v) => String(Math.round(v))): void {
  const t0 = performance.now() + d
  t.textContent = fmt(0)
  const tick = () => {
    if (!t.isConnected && performance.now() > t0 + 200) return
    const k = Math.min(1, Math.max(0, (performance.now() - t0) / ms))
    t.textContent = fmt(to * (1 - Math.pow(1 - k, 3)))
    if (k < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Großer schraffierter Schriftzug, der sich von links aufdeckt */
export function bigText(g: Element, x: number, y: number, s: string, o: { size?: number; d?: number; anchor?: 'start' | 'middle' | 'end'; serif?: boolean } = {}): SVGTextElement {
  const t = mk('text', { x, y, class: `tx bigt${o.serif === false ? '' : ' serif'}`, 'text-anchor': o.anchor ?? 'middle', style: `font-size:${o.size ?? 96}px;--d:${o.d ?? 300}ms` }, g)
  t.textContent = s
  return t
}
