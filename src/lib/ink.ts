// Tusche-Optik: geometrisch exakte Formen, aber mit variabler Strichbreite wie mit einer Feder gezeichnet.
// Jede Linie wird als gefuellte Umrisskontur gerendert; die Breite haengt von der Strichrichtung ab
// (fester Federwinkel) und laeuft an offenen Enden leicht aus. So sehen alle Elemente einheitlich aus.

export type Pt = [number, number]

export interface Stroke {
  pts: Pt[]
  closed?: boolean
  /** Faktor auf die Grundbreite */
  w?: number
  /** Druckwechsel entlang des Strichs wie bei einem Pinsel (0 = gleichmaessig, 0.2 = +-20 %) */
  p?: number
  /** Startwert fuer den Druckverlauf, damit nicht jeder Strich gleich schwankt */
  seed?: number
}

const STEP = 0.45
const NIB = (35 * Math.PI) / 180
const rad = (deg: number) => (deg * Math.PI) / 180

function sample(n: number, f: (t: number) => Pt, closed = false): Pt[] {
  const pts: Pt[] = []
  const last = closed ? n - 1 : n
  for (let i = 0; i <= last; i++) pts.push(f(i / n))
  return pts
}

export function line(a: Pt, b: Pt, w?: number): Stroke {
  const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / STEP))
  return { pts: sample(n, (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]), w }
}

/** Polygonzug als Einzelstriche (runde Enden verdecken die Ecken sauber) */
export function poly(points: Pt[], closed = false, w?: number): Stroke[] {
  const out: Stroke[] = []
  for (let i = 0; i < points.length - 1; i++) out.push(line(points[i], points[i + 1], w))
  if (closed && points.length > 2) out.push(line(points[points.length - 1], points[0], w))
  return out
}

/** Bogen; Winkel in Grad, 0 = rechts, im Uhrzeigersinn (Bildschirmkoordinaten). */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number, w?: number, ry = r, rot = 0): Stroke {
  const len = Math.abs(rad(a1 - a0)) * Math.max(r, ry)
  const n = Math.max(4, Math.ceil(len / STEP))
  const cr = Math.cos(rad(rot))
  const sr = Math.sin(rad(rot))
  return {
    pts: sample(n, (t) => {
      const a = rad(a0 + (a1 - a0) * t)
      const x = Math.cos(a) * r
      const y = Math.sin(a) * ry
      return [cx + x * cr - y * sr, cy + x * sr + y * cr]
    }),
    w,
  }
}

export function circle(cx: number, cy: number, r: number, w?: number): Stroke {
  return ellipse(cx, cy, r, r, 0, w)
}

export function ellipse(cx: number, cy: number, rx: number, ry: number, rot = 0, w?: number): Stroke {
  const n = Math.max(24, Math.ceil((2 * Math.PI * Math.max(rx, ry)) / STEP))
  const cr = Math.cos(rad(rot))
  const sr = Math.sin(rad(rot))
  return {
    pts: sample(
      n,
      (t) => {
        const a = t * 2 * Math.PI
        const x = Math.cos(a) * rx
        const y = Math.sin(a) * ry
        return [cx + x * cr - y * sr, cy + x * sr + y * cr]
      },
      true,
    ),
    closed: true,
    w,
  }
}

export function bez(p0: Pt, p1: Pt, p2: Pt, p3: Pt, w?: number): Stroke {
  const est = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) + Math.hypot(p3[0] - p2[0], p3[1] - p2[1])
  const n = Math.max(6, Math.ceil(est / STEP))
  return {
    pts: sample(n, (t) => {
      const u = 1 - t
      const a = u * u * u
      const b = 3 * u * u * t
      const c = 3 * u * t * t
      const d = t * t * t
      return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]
    }),
    w,
  }
}

/** Beliebige Kurve ueber eine Parameterfunktion */
export function curve(f: (t: number) => Pt, n: number, w?: number): Stroke {
  return { pts: sample(n, f), w }
}

/** Abgerundetes Rechteck als ein geschlossener Strich */
export function roundRect(x: number, y: number, wd: number, ht: number, r: number, w?: number, step = STEP * 2): Stroke {
  r = Math.max(0, Math.min(r, wd / 2, ht / 2))
  const pts: Pt[] = []
  const edge = (a: Pt, b: Pt) => {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let i = 0; i < n; i++) pts.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n])
  }
  const corner = (cx: number, cy: number, a0: number) => {
    const n = Math.max(3, Math.ceil((r * Math.PI) / 2 / STEP))
    for (let i = 0; i < n; i++) {
      const a = rad(a0 + (90 * i) / n)
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
  }
  edge([x + r, y], [x + wd - r, y])
  corner(x + wd - r, y + r, 270)
  edge([x + wd, y + r], [x + wd, y + ht - r])
  corner(x + wd - r, y + ht - r, 0)
  edge([x + wd - r, y + ht], [x + r, y + ht])
  corner(x + r, y + ht - r, 90)
  edge([x, y + ht - r], [x, y + r])
  corner(x + r, y + r, 180)
  return { pts, closed: true, w }
}

/** Strich in Teilstriche zerlegen (gestrichelt); Laengen in px entlang des Strichs */
export function dashes(s: Stroke, dash: number, gap: number): Stroke[] {
  const out: Stroke[] = []
  const pts = s.closed ? [...s.pts, s.pts[0]] : s.pts
  const push = (c: Pt[]) => c.length > 1 && out.push({ pts: c, w: s.w, p: s.p, seed: (s.seed ?? 0) + out.length })
  let cur: Pt[] = []
  let pos = 0
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) pos += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    if (pos % (dash + gap) < dash) cur.push(pts[i])
    else if (cur.length) {
      push(cur)
      cur = []
    }
  }
  push(cur)
  return out
}

/** Pfeilspitze am Ende eines Strichs */
export function arrowHead(s: Stroke, size = 2.6, w?: number): Stroke[] {
  const p = s.pts
  const tip = p[p.length - 1]
  const back = p[Math.max(0, p.length - 4)]
  const a = Math.atan2(tip[1] - back[1], tip[0] - back[0])
  const wing = (da: number): Pt => [tip[0] - Math.cos(a + da) * size, tip[1] - Math.sin(a + da) * size]
  return [line(wing(0.6), tip, w), line(wing(-0.6), tip, w)]
}

const f = (v: number) => (Math.round(v * 100) / 100).toString()

/** Umriss eines Strichs als SVG-Pfad (fill, bei geschlossenen Strichen fill-rule evenodd) */
export function outline(s: Stroke, base: number): string {
  const p = s.pts
  const n = p.length
  if (n < 2) return ''
  const closed = !!s.closed
  const L: number[] = [0]
  for (let i = 1; i < n; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]))
  const total = L[n - 1]
  const pr = s.p ?? 0
  const sd = s.seed ?? 0
  const left: Pt[] = []
  const right: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = closed ? p[(i - 1 + n) % n] : p[Math.max(0, i - 1)]
    const b = closed ? p[(i + 1) % n] : p[Math.min(n - 1, i + 1)]
    let tx = b[0] - a[0]
    let ty = b[1] - a[1]
    const tl = Math.hypot(tx, ty) || 1
    tx /= tl
    ty /= tl
    let w = base * (s.w ?? 1) * (0.62 + 0.55 * Math.abs(Math.sin(Math.atan2(ty, tx) - NIB)))
    if (pr) w *= 1 + pr * (0.6 * Math.sin(L[i] / 19 + sd) + 0.4 * Math.sin(L[i] / 53 + sd * 2.3))
    if (!closed) {
      const e = Math.min(L[i], total - L[i])
      w *= Math.min(1, 0.55 + e / (base * 3))
    }
    const nx = (-ty * w) / 2
    const ny = (tx * w) / 2
    left.push([p[i][0] + nx, p[i][1] + ny])
    right.push([p[i][0] - nx, p[i][1] - ny])
  }
  const pt = (q: Pt) => `${f(q[0])} ${f(q[1])}`
  if (closed) {
    return `M${left.map(pt).join('L')}ZM${right.reverse().map(pt).join('L')}Z`
  }
  const rEnd = Math.hypot(left[n - 1][0] - right[n - 1][0], left[n - 1][1] - right[n - 1][1]) / 2
  const rStart = Math.hypot(left[0][0] - right[0][0], left[0][1] - right[0][1]) / 2
  return (
    `M${left.map(pt).join('L')}` +
    `A${f(rEnd)} ${f(rEnd)} 0 0 0 ${pt(right[n - 1])}` +
    `L${right.reverse().map(pt).join('L')}` +
    `A${f(rStart)} ${f(rStart)} 0 0 0 ${pt(left[0])}Z`
  )
}

export function outlines(strokes: Stroke[], base: number): { d: string; closed: boolean }[] {
  return strokes.map((s) => ({ d: outline(s, base), closed: !!s.closed }))
}

/** Kreissektor als SVG-Pfad (Winkel in Grad, 0 = oben, im Uhrzeigersinn) */
export function sectorPath(cx: number, cy: number, r: number, from: number, to: number): string {
  if (to - from <= 0.01) return ''
  if (to - from >= 359.99) return `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`
  const p = (deg: number): Pt => [cx + Math.sin(rad(deg)) * r, cy - Math.cos(rad(deg)) * r]
  const a = p(from)
  const b = p(to)
  return `M${f(cx)} ${f(cy)}L${f(a[0])} ${f(a[1])}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${f(b[0])} ${f(b[1])}Z`
}
