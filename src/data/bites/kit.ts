// Weitere Tusche-Motive für die 2-Minuten-Häppchen (aha-*.ts): Himmel, Wasser, Moleküle, Diagramme, Kästen.
// Wie draw.ts: zeichnet in eine SVG-Gruppe, Verzögerung `d` in ms ab dem Erscheinen der Grafik.
// Layout-Regel der aha-Häppchen: Text oben (y 64, bis ~260) → Grafik zwischen 290 und 650; Text unten (y ≥ 470) →
// Grafik zwischen 70 und 450. Beschriftungen nie auf Strichen, Linien kreuzen sich nur, wo es gemeint ist
// (scripts/bites-check.mjs prüft das).
import { B, E, L, RR, arrow, blank, group, hatch, ink, mk, pop, text, type P } from './draw'

const rad = (a: number) => (a * Math.PI) / 180

/** Gefüllter Punkt */
export function dot(g: Element, x: number, y: number, r = 4, d = 0): SVGCircleElement {
  return mk('circle', { cx: x, cy: y, r, class: 'k pop', style: `--d:${d}ms;transform-origin:50% 50%;transform-box:fill-box` }, g)
}

/** Kugel: Kreis, schraffiert oder weiß */
export function ball(g: Element, x: number, y: number, r: number, o: { d?: number; fill?: 'leer' | 'hell' | 'dicht'; w?: number; t?: number } = {}): void {
  blank(g, E(x, y, r))
  if (o.fill && o.fill !== 'leer') hatch(g, E(x, y, r), (o.d ?? 0) + 200, o.fill === 'dicht')
  ink(g, E(x, y, r), { w: o.w ?? 2.4, d: o.d, t: o.t ?? 400 })
}

/** Sonne mit Strahlen */
export function sun(g: Element, cx: number, cy: number, r: number, d = 0, n = 12): void {
  ink(g, E(cx, cy, r), { w: 3, d, t: 600 })
  for (let k = 0; k < n; k++) {
    const a = rad((k / n) * 360 - 90)
    ink(g, L([cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8)], [cx + Math.cos(a) * (r + 20), cy + Math.sin(a) * (r + 20)]), { w: 2.4, d: d + 400 + k * 40, t: 140 })
  }
}

/** Wolke (geschlossen, weiß gefüllt), Mitte cx, Unterkante y */
export function cloud(g: Element, cx: number, y: number, s = 1, d = 0, dense = false): P[] {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  const c: P[] = [
    ...B(P(-50, 0), P(-70, 0), P(-70, -26), P(-46, -28)),
    ...B(P(-46, -28), P(-44, -54), P(-10, -60), P(0, -40)).slice(1),
    ...B(P(0, -40), P(10, -64), P(50, -60), P(46, -30)).slice(1),
    ...B(P(46, -30), P(70, -30), P(72, 0), P(50, 0)).slice(1),
    ...L(P(50, 0), P(-50, 0)).slice(1),
  ]
  blank(g, c)
  if (dense) hatch(g, c, d + 400, true)
  ink(g, c, { w: 2.6, d, t: 700 })
  return c
}

/** Sinuswelle als Punktliste */
export function waveP(x0: number, x1: number, y: number, amp: number, len: number, phase = 0): P[] {
  const n = Math.max(12, Math.ceil(Math.abs(x1 - x0) / 2))
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n
    return [x, y + Math.sin(((x - x0) / len) * Math.PI * 2 + phase) * amp] as P
  })
}

/** Wassertropfen, Spitze oben */
export function drop(g: Element, cx: number, cy: number, s = 1, d = 0, fill = true): void {
  const p = [...B([cx, cy - 22 * s], [cx + 6 * s, cy - 10 * s], [cx + 14 * s, cy - 2 * s], [cx + 14 * s, cy + 8 * s]), ...B([cx + 14 * s, cy + 8 * s], [cx + 14 * s, cy + 24 * s], [cx - 14 * s, cy + 24 * s], [cx - 14 * s, cy + 8 * s]).slice(1), ...B([cx - 14 * s, cy + 8 * s], [cx - 14 * s, cy - 2 * s], [cx - 6 * s, cy - 10 * s], [cx, cy - 22 * s]).slice(1)]
  blank(g, p)
  if (fill) hatch(g, p, d + 300)
  ink(g, p, { w: 2.4, d, t: 400 })
}

/** Flamme auf der Grundlinie */
export function flame(g: Element, cx: number, base: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, base + b * s]
  const o = [...B(P(0, 0), P(-34, 0), P(-30, -50), P(0, -96)), ...B(P(0, -96), P(30, -50), P(34, 0), P(0, 0)).slice(1)]
  const i = [...B(P(0, -6), P(-14, -6), P(-14, -30), P(0, -52)), ...B(P(0, -52), P(14, -30), P(14, -6), P(0, -6)).slice(1)]
  ink(g, o, { w: 3, d, t: 700 })
  hatch(g, i, d + 600, true)
  ink(g, i, { w: 2, d: d + 300, t: 500 })
}

/** Baum: Stamm + Krone */
export function tree(g: Element, x: number, base: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, base + b * s]
  const w = Math.min(1.3, Math.max(0.6, s * 1.2))
  // Stamm, unten breiter mit Wurzelansatz, oben in Äste geteilt
  ink(g, [...B(P(-14, 0), P(-7, -4), P(-6, -20), P(-5, -56))], { w: 2.6 * w, d, t: 400 })
  ink(g, [...B(P(14, 0), P(7, -4), P(6, -20), P(5, -56))], { w: 2.6 * w, d, t: 400 })
  // Krone aus Wölkchen-Bögen
  const c: P[] = []
  for (let i = 0; i <= 160; i++) {
    const t = (i / 160) * Math.PI * 2
    const r = 1 + 0.07 * Math.cos(t * 9) + 0.03 * Math.sin(t * 4)
    c.push(P(Math.cos(t) * 62 * r, -104 + Math.sin(t) * 50 * r))
  }
  blank(g, c)
  hatch(g, c, d + 700)
  ink(g, c, { w: 2.8 * w, d: d + 300, t: 800 })
  // Äste in die Krone
  ink(g, B(P(-3, -56), P(-8, -70), P(-22, -80), P(-30, -92)), { w: 2 * w, d: d + 500, t: 300 })
  ink(g, B(P(3, -56), P(8, -72), P(20, -84), P(26, -100)), { w: 2 * w, d: d + 550, t: 300 })
  ink(g, B(P(0, -60), P(0, -78), P(-2, -96), P(2, -116)), { w: 1.8 * w, d: d + 600, t: 300 })
}

/** Kasten mit zentrierter Beschriftung (eine oder mehrere Zeilen) */
export function box(g: Element, x: number, y: number, w: number, h: number, label: string | string[], o: { d?: number; size?: number; fill?: boolean; r?: number; w?: number; cls?: string } = {}): void {
  const d = o.d ?? 0
  const pts = RR(x, y, w, h, o.r ?? 10)
  blank(g, pts)
  if (o.fill) hatch(g, pts, d + 300)
  ink(g, pts, { w: o.w ?? 2.6, d, t: 500 })
  const lines = Array.isArray(label) ? label : [label]
  const size = o.size ?? 15
  const lh = size * 1.2
  lines.forEach((s, i) => text(g, x + w / 2, y + h / 2 + size * 0.36 + (i - (lines.length - 1) / 2) * lh, s, { anchor: 'middle', size, d: d + 250, cls: `${o.fill ? 'halo ' : ''}${o.cls ?? ''}` }))
}

/** Gebogener Pfeil von a nach b; bend = seitliche Auslenkung (px, + = links der Richtung) */
export function carrow(g: Element, a: P, b: P, bend = 0, o: { d?: number; t?: number; w?: number; head?: number } = {}): void {
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const nx = (b[1] - a[1]) / len
  const ny = -(b[0] - a[0]) / len
  const c: P = [mx + nx * bend, my + ny * bend]
  const p1: P = [a[0] + (c[0] - a[0]) * 0.66, a[1] + (c[1] - a[1]) * 0.66]
  const p2: P = [b[0] + (c[0] - b[0]) * 0.66, b[1] + (c[1] - b[1]) * 0.66]
  arrow(g, B(a, p1, p2, b), { w: o.w ?? 2.4, d: o.d, t: o.t ?? 500, head: o.head ?? 10 })
}

/** Kreisbogen-Pfeil um (cx, cy), Winkel in Grad (0 = rechts, im Uhrzeigersinn) */
export function arcArrow(g: Element, cx: number, cy: number, r: number, a0: number, a1: number, o: { d?: number; t?: number; w?: number; head?: number } = {}): void {
  arrow(g, E(cx, cy, r, r, a0, a1), { w: o.w ?? 2.4, d: o.d, t: o.t ?? 600, head: o.head ?? 10 })
}

/** Achsenkreuz mit Pfeilen; Beschriftung an den Enden (x rechts unter der Achse, y oben neben der Achse) */
export function axes(g: Element, x0: number, y0: number, x1: number, y1: number, o: { xl?: string; yl?: string; d?: number } = {}): void {
  const d = o.d ?? 0
  arrow(g, L([x0, y0], [x1, y0]), { w: 2.6, d, t: 500, head: 9 })
  arrow(g, L([x0, y0], [x0, y1]), { w: 2.6, d, t: 500, head: 9 })
  if (o.xl) text(g, x1, y0 + 24, o.xl, { anchor: 'end', cls: 's', d: d + 300 })
  if (o.yl) text(g, x0 + 12, y1 + 6, o.yl, { cls: 's', d: d + 300 })
}

/** Kurve im Rechteck (x0, y0 unten links, Breite w, Höhe h); f: 0…1 → 0…1 */
export function plot(g: Element, x0: number, y0: number, w: number, h: number, f: (t: number) => number, o: { d?: number; t?: number; w?: number; n?: number } = {}): P[] {
  const n = o.n ?? 80
  const pts = Array.from({ length: n + 1 }, (_, i) => [x0 + (w * i) / n, y0 - h * f(i / n)] as P)
  ink(g, pts, { w: o.w ?? 3, d: o.d, t: o.t ?? 1200 })
  return pts
}

/** Wassermolekül: O mit zwei H (104,5°), Drehung rot in Grad */
export function water(g: Element, cx: number, cy: number, s = 1, rot = 0, d = 0): void {
  for (const k of [-1, 1]) {
    const a = rad(90 + rot + k * 52)
    const hx = cx + Math.cos(a) * 22 * s
    const hy = cy + Math.sin(a) * 22 * s
    ball(g, hx, hy, 7 * s, { d: d + 150, w: 1.8, t: 0 })
  }
  ball(g, cx, cy, 13 * s, { d, fill: 'hell', w: 2.2, t: 0 })
}

// Küstenlinien (Länge, Breite in Grad), grob vereinfacht – reicht für Kugeln bis ~250 px
const COASTS: [number, number][][] = [
  // Afrika
  [[-17, 21], [-16, 12], [-12, 7], [-8, 4.5], [-2, 5], [5, 6], [9, 4], [10, -2], [13, -12], [12, -18], [15, -27], [18, -34], [20, -35], [26, -34], [33, -28], [35, -24], [40, -15], [40, -10], [39, -5], [42, 0], [48, 5], [51, 11], [43, 12], [38, 18], [33, 28], [32, 31], [25, 32], [20, 31], [11, 33], [10, 37], [0, 36], [-6, 36], [-10, 30], [-17, 21]],
  // Eurasien
  [[-9, 37], [-9, 43], [-2, 43.5], [-4.5, 48], [2, 51], [8, 54], [9, 57], [5, 58.5], [5, 62], [14, 67], [20, 70], [28, 71], [40, 67], [44, 68], [60, 69], [70, 73], [80, 73], [100, 77], [113, 73], [130, 71], [140, 72], [160, 70], [180, 68], [180, 65], [170, 60], [163, 58], [160, 53], [155, 59], [143, 59], [135, 54], [141, 48], [133, 43], [129, 41], [126, 38], [127, 35], [121, 31], [122, 25], [110, 21], [108, 16], [109, 12], [105, 9], [100, 13], [99, 8], [103, 1], [98, 8], [98, 16], [92, 22], [87, 21], [80, 15], [77, 8], [73, 17], [70, 21], [66, 25], [57, 26], [56, 24], [59, 22], [52, 17], [45, 13], [43, 15], [35, 28], [34, 31], [36, 36], [30, 36], [26, 40], [23, 37], [20, 40], [19, 42], [13, 45.5], [12, 44], [16, 41], [18, 40], [16, 38], [12, 38], [10, 44], [3, 43], [0, 39], [-2, 37], [-5, 36], [-9, 37]],
  // Nordamerika
  [[-168, 66], [-162, 70], [-156, 71], [-140, 70], [-128, 70], [-115, 68], [-95, 72], [-82, 73], [-80, 68], [-94, 60], [-92, 57], [-82, 55], [-79, 52], [-78, 58], [-77, 62], [-68, 59], [-64, 60], [-56, 52], [-60, 47], [-66, 44], [-70, 42], [-74, 40], [-76, 36], [-81, 31], [-80, 26], [-81, 25], [-83, 29], [-89, 30], [-97, 28], [-97, 22], [-94, 18], [-90, 21], [-87, 21], [-88, 16], [-83, 15], [-83, 10], [-79, 9], [-78, 7.5], [-81, 7], [-85, 10], [-87, 13], [-92, 15], [-96, 16], [-105, 20], [-110, 24], [-112, 29], [-115, 31], [-114, 28], [-110, 23], [-112, 25], [-117, 32], [-120, 34], [-124, 40], [-124, 46], [-123, 49], [-130, 54], [-135, 58], [-140, 60], [-148, 61], [-152, 59], [-158, 57], [-163, 55], [-158, 59], [-162, 60], [-165, 62], [-168, 66]],
  // Grönland
  [[-73, 78], [-60, 82], [-30, 83], [-20, 80], [-18, 75], [-22, 70], [-32, 68], [-42, 60], [-48, 61], [-52, 65], [-55, 70], [-60, 76], [-73, 78]],
  // Südamerika
  [[-80, 9], [-77, 8], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-44, -2], [-35, -5], [-35, -9], [-39, -14], [-41, -22], [-48, -26], [-53, -34], [-58, -38], [-62, -40], [-65, -45], [-68, -50], [-69, -55], [-74, -52], [-73, -42], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -2], [-77, 4], [-80, 9]],
  // Australien
  [[114, -22], [114, -34], [118, -35], [124, -33], [132, -31], [138, -35], [140, -38], [147, -39], [150, -37], [153, -28], [153, -25], [146, -19], [142, -11], [141, -17], [136, -12], [130, -12], [126, -14], [122, -18], [114, -22]],
  // Großbritannien, Japan, Madagaskar, Borneo, Sumatra, Neuguinea, Neuseeland
  [[-5, 50], [1, 51], [0, 53], [-2, 56], [-3, 58.5], [-6, 58], [-5, 55], [-3, 54], [-5, 52], [-5, 50]],
  [[130, 31], [135, 34], [140, 36], [142, 40], [140, 42], [141, 45], [144, 43], [141, 41], [140, 35], [130, 31]],
  [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17], [44, -25]],
  [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3], [109, 1]],
  [[95, 5], [106, -6], [102, -4], [95, 5]],
  [[131, -1], [141, -3], [150, -10], [141, -9], [131, -1]],
  [[172, -34], [178, -38], [174, -42], [167, -46], [172, -34]],
  // Antarktis
  [[-180, -70], [-120, -73], [-60, -64], [-40, -78], [0, -70], [60, -67], [120, -66], [180, -70], [180, -90], [-180, -90], [-180, -70]],
]

/** Orthografische Projektion (Länge, Breite) → Bühne; Punkte auf der Rückseite werden an den Rand gelegt */
export function geo(cx: number, cy: number, r: number, lon0: number, lat0: number) {
  const p0 = rad(lat0)
  return (lon: number, lat: number): { p: P; front: boolean } => {
    const l = rad(lon - lon0)
    const f = rad(lat)
    let x = Math.cos(f) * Math.sin(l)
    let y = Math.cos(p0) * Math.sin(f) - Math.sin(p0) * Math.cos(f) * Math.cos(l)
    const z = Math.sin(p0) * Math.sin(f) + Math.cos(p0) * Math.cos(f) * Math.cos(l)
    if (z < 0) {
      const k = Math.hypot(x, y) || 1
      x /= k
      y /= k
    }
    return { p: [cx + x * r, cy - y * r], front: z >= 0 }
  }
}

/** Erdkugel mit Kontinenten (orthografisch, Blick auf lon/lat), optional Gradnetz */
export function earth(g: Element, cx: number, cy: number, r: number, d = 0, o: { lon?: number; lat?: number; grid?: boolean; w?: number } = {}): void {
  const pr = geo(cx, cy, r, o.lon ?? 15, o.lat ?? 22)
  blank(g, E(cx, cy, r))
  const step = r > 120 ? 1.5 : 3
  COASTS.forEach((c, ci) => {
    const pts: P[] = []
    let any = false
    for (let i = 0; i < c.length - 1; i++) {
      const [a0, b0] = c[i]
      const [a1, b1] = c[i + 1]
      const n = Math.max(1, Math.ceil(Math.max(Math.abs(a1 - a0), Math.abs(b1 - b0)) / step))
      for (let k = i ? 1 : 0; k <= n; k++) {
        const q = pr(a0 + ((a1 - a0) * k) / n, b0 + ((b1 - b0) * k) / n)
        any ||= q.front
        pts.push(q.p)
      }
    }
    if (!any) return
    hatch(g, pts, d + 500 + ci * 30)
    ink(g, pts, { w: o.w ?? (r > 90 ? 1.7 : 1.3), d: d + 250 + ci * 60, t: 600, p: 0.3 })
  })
  if (o.grid) {
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: P[] = []
      for (let lon = -180; lon <= 180; lon += 4) {
        const q = pr(lon, lat)
        if (q.front) pts.push(q.p)
        else if (pts.length > 1) break
      }
      if (pts.length > 1) ink(g, pts, { w: 0.9, d: d + 700, t: 600 })
    }
  }
  ink(g, E(cx, cy, r), { w: 3, d, t: 700 })
}

/** Mehrzeilige Beschriftung im SVG (Zeilenabstand lh) */
export function lines(g: Element, x: number, y: number, rows: string[], o: { d?: number; anchor?: 'start' | 'middle' | 'end'; size?: number; cls?: string; lh?: number; fade?: boolean } = {}): void {
  const lh = o.lh ?? (o.size ?? 15) * 1.3
  rows.forEach((s, i) => text(g, x, y + i * lh, s, { ...o, d: (o.d ?? 0) + i * 120 }))
}

/** Thermometer, Füllstand 0…1 */
export function thermo(g: Element, x: number, y: number, h: number, level: number, d = 0): void {
  ink(g, [...L([x - 8, y + h], [x - 8, y + 8]), ...E(x, y + 8, 8, 8, 180, 360).slice(1), ...L([x + 8, y + 8], [x + 8, y + h]).slice(1)], { w: 2.6, d, t: 500 })
  ink(g, E(x, y + h + 12, 14, 14, -60, 240), { w: 2.6, d: d + 300, t: 400 })
  const lvl = group(g, 'grow-y', `--d:${d + 500}ms`)
  hatch(lvl, RR(x - 4, y + 8 + (h - 8) * (1 - level), 8, (h - 8) * level + 12, 3), d + 500, true)
  hatch(g, E(x, y + h + 12, 9), d + 400, true)
}

/** Tortendiagramm: Anteil frac schraffiert, Start oben */
export function pie(g: Element, cx: number, cy: number, r: number, frac: number, d = 0): void {
  const a1 = -90 + 360 * frac
  hatch(g, [[cx, cy], ...E(cx, cy, r, r, -90, a1), [cx, cy]], d + 700)
  ink(g, E(cx, cy, r), { w: 3, d, t: 700 })
  ink(g, L([cx, cy - r], [cx, cy]), { w: 2.4, d: d + 600, t: 200 })
  ink(g, L([cx, cy], [cx + Math.cos(rad(a1)) * r, cy + Math.sin(rad(a1)) * r]), { w: 2.4, d: d + 700, t: 200 })
}

/** Lupe */
export function lens(g: Element, cx: number, cy: number, r: number, d = 0): void {
  ink(g, E(cx, cy, r), { w: 3.2, d, t: 600 })
  ink(g, L([cx + r * 0.72, cy + r * 0.72], [cx + r * 1.4, cy + r * 1.4]), { w: 5, d: d + 500, t: 300 })
}

/** Herz */
export function heart(g: Element, cx: number, cy: number, s = 1, d = 0, fill = true): void {
  const p = [...B([cx, cy + 26 * s], [cx - 40 * s, cy - 4 * s], [cx - 22 * s, cy - 34 * s], [cx, cy - 16 * s]), ...B([cx, cy - 16 * s], [cx + 22 * s, cy - 34 * s], [cx + 40 * s, cy - 4 * s], [cx, cy + 26 * s]).slice(1)]
  blank(g, p)
  if (fill) hatch(g, p, d + 400, true)
  ink(g, p, { w: 2.8, d, t: 600 })
}

/** Haken-Liste: Zeilen nacheinander mit Punkt davor */
export function bullets(g: Element, x: number, y: number, rows: string[], o: { d?: number; gap?: number; size?: number; step?: number } = {}): void {
  rows.forEach((s, i) => {
    const yy = y + i * (o.gap ?? 34)
    const dd = (o.d ?? 0) + i * (o.step ?? 350)
    dot(g, x + 4, yy - 5, 4, dd)
    text(g, x + 18, yy, s, { d: dd, size: o.size ?? 16 })
  })
}

/** Aufploppende Gruppe an Stelle (x, y) mit Ursprung Mitte */
export const popAt = (g: Element, d: number) => pop(g, d, '50% 50%')

/** Pfeil (gerade) mit Spitze, Kurzform */
export const arr = (g: Element, a: P, b: P, d = 0, w = 2.4) => arrow(g, L(a, b), { w, d, t: 400, head: 10 })

export { rad }

/** Haus mit Satteldach, Grundlinie y, Breite w */
export function house(g: Element, x: number, y: number, w = 40, d = 0): void {
  ink(g, RR(x, y - w * 0.8, w, w * 0.8, 2), { w: 2.6, d, t: 400 })
  ink(g, [[x - 4, y - w * 0.8], [x + w / 2, y - w * 1.25], [x + w + 4, y - w * 0.8]], { w: 2.8, d: d + 200, t: 300 })
  ink(g, RR(x + w * 0.4, y - w * 0.36, w * 0.2, w * 0.36, 1), { w: 2, d: d + 300, t: 200 })
}

/* ---------- Bewegung: Teilchen, die einer Linie folgen (SMIL, läuft endlos, pausiert mit der Bühne) ---------- */

const svgPath = (pts: P[]) => `M${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`

/**
 * n Teilchen wandern endlos entlang pts (eine Runde in ms), erscheinen ab d nacheinander.
 * kind: 'dot' (Punkt), 'dash' (kurzer Strich in Bewegungsrichtung), 'ring' (kleiner Kreis)
 */
export function flow(g: Element, pts: P[], o: { n?: number; ms?: number; d?: number; r?: number; kind?: 'dot' | 'dash' | 'ring'; fade?: boolean } = {}): void {
  const n = o.n ?? 4
  const ms = o.ms ?? 2400
  const r = o.r ?? 2.6
  const path = svgPath(pts)
  for (let i = 0; i < n; i++) {
    const begin = `${((o.d ?? 0) + (i * ms) / n) / 1000}s`
    const el =
      o.kind === 'dash'
        ? mk('path', { d: `M${-r * 2.4} ${-r * 0.55}L${r * 2.4} ${-r * 0.55}A${r * 0.55} ${r * 0.55} 0 0 1 ${r * 2.4} ${r * 0.55}L${-r * 2.4} ${r * 0.55}Z`, class: 'k', opacity: 0 }, g)
        : o.kind === 'ring'
          ? mk('circle', { r, class: 'ring', opacity: 0 }, g)
          : mk('circle', { r, class: 'k', opacity: 0 }, g)
    mk('animateMotion', { path, dur: `${ms / 1000}s`, begin, repeatCount: 'indefinite', rotate: 'auto' }, el)
    if (o.fade === false) mk('set', { attributeName: 'opacity', to: 1, begin, fill: 'freeze' }, el)
    else mk('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;0.12;0.85;1', dur: `${ms / 1000}s`, begin, repeatCount: 'indefinite' }, el)
  }
}

const EASE = { calcMode: 'spline', keySplines: '.45 0 .55 1;.45 0 .55 1', keyTimes: '0;.5;1' }

/** Gruppe, die endlos hin und her schwingt (SMIL): Verschiebung dx/dy oder Drehung deg um (ox, oy) */
export function wobble(g: Element, o: { dx?: number; dy?: number; deg?: number; ox?: number; oy?: number; ms?: number; d?: number } = {}): SVGGElement {
  const w = mk('g', {}, g)
  const dur = `${(o.ms ?? 2400) / 1000}s`
  const begin = `${(o.d ?? 0) / 1000}s`
  const ox = o.ox ?? 0
  const oy = o.oy ?? 0
  if (o.deg) mk('animateTransform', { attributeName: 'transform', type: 'rotate', values: `${-o.deg} ${ox} ${oy};${o.deg} ${ox} ${oy};${-o.deg} ${ox} ${oy}`, dur, begin, repeatCount: 'indefinite', ...EASE }, w)
  else mk('animateTransform', { attributeName: 'transform', type: 'translate', values: `0 0;${o.dx ?? 0} ${o.dy ?? 0};0 0`, dur, begin, repeatCount: 'indefinite', ...EASE }, w)
  return w
}

/** Gruppe, die sich endlos um (ox, oy) dreht (SMIL); ms = eine Umdrehung, negativ = gegen den Uhrzeigersinn */
export function spin(g: Element, ox: number, oy: number, ms = 4000, d = 0): SVGGElement {
  const w = mk('g', {}, g)
  const to = ms < 0 ? -360 : 360
  mk('animateTransform', { attributeName: 'transform', type: 'rotate', from: `0 ${ox} ${oy}`, to: `${to} ${ox} ${oy}`, dur: `${Math.abs(ms) / 1000}s`, begin: `${d / 1000}s`, repeatCount: 'indefinite' }, w)
  return w
}

/** Gruppe, die einmal um (dx, dy) gleitet und dort bleibt – oder mit loop endlos von vorn (SMIL) */
export function glide(g: Element, dx: number, dy: number, o: { ms?: number; d?: number; loop?: boolean } = {}): SVGGElement {
  const w = mk('g', {}, g)
  const a: Record<string, string | number> = { attributeName: 'transform', type: 'translate', from: '0 0', to: `${dx} ${dy}`, dur: `${(o.ms ?? 2000) / 1000}s`, begin: `${(o.d ?? 0) / 1000}s`, fill: 'freeze' }
  if (o.loop) a.repeatCount = 'indefinite'
  else Object.assign(a, { calcMode: 'spline', keySplines: '.3 0 .2 1', keyTimes: '0;1' })
  mk('animateTransform', a, w)
  return w
}

/* ---------- Motive ---------- */

/** Flügelprofil (NACA-ähnlich, gewölbt); Sehne c, Mitte cx/cy, Anstellwinkel deg (Nase links, + = Nase hoch) */
export function foil(cx: number, cy: number, c: number, deg = 0): P[] {
  const n = 40
  const up: P[] = []
  const lo: P[] = []
  for (let i = 0; i <= n; i++) {
    const x = (1 - Math.cos((i / n) * Math.PI)) / 2
    const yt = 0.6 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4)
    up.push([x, camber(x) + yt])
    lo.push([x, camber(x) - yt])
  }
  return [...up.map(foilAt(cx, cy, c, deg)), ...lo.reverse().map(foilAt(cx, cy, c, deg))]
}

const camber = (x: number) => (x < 0.4 ? (0.05 / 0.16) * (0.8 * x - x * x) : (0.05 / 0.36) * (0.2 + 0.8 * x - x * x))

/** Profil-Koordinaten (x 0…1 entlang der Sehne, y nach oben in Sehnenlängen) → Bühne */
export function foilAt(cx: number, cy: number, c: number, deg = 0) {
  const a = rad(deg)
  return ([x, y]: P): P => {
    const px = (x - 0.5) * c
    const py = -y * c
    return [cx + px * Math.cos(a) - py * Math.sin(a), cy + px * Math.sin(a) + py * Math.cos(a)]
  }
}

/** Flügelprofil gezeichnet: Umriss, Schraffur, zwei Holme innen */
export function wing(g: Element, cx: number, cy: number, c: number, deg = 0, d = 0): void {
  const p = foil(cx, cy, c, deg)
  const at = foilAt(cx, cy, c, deg)
  blank(g, p)
  hatch(g, p, d + 400)
  if (c > 90)
    for (const [x, h] of [[0.22, 0.062], [0.58, 0.05]] as const) {
      const y = camber(x)
      blank(g, [at([x - 0.014, y - h]), at([x + 0.014, y - h]), at([x + 0.014, y + h]), at([x - 0.014, y + h])])
      ink(g, L(at([x, y - h * 0.9]), at([x, y + h * 0.9])), { w: 1.5, d: d + 500, t: 200 })
    }
  ink(g, [...p, p[0]], { w: 3, d, t: 700 })
}

/** Verkehrsflugzeug von der Seite, Mitte (x, y), Nase rechts (Breite ≈ 195 × s); deck 2 = doppelstöckig (A380) */
export function jet(g: Element, x: number, y: number, s = 1, d = 0, deck: 1 | 2 = 1): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const top = deck === 2 ? -21 : -11
  const w = Math.min(1.3, Math.max(0.7, s))
  // Höhenleitwerk (hinter dem Rumpf)
  const stab: P[] = [P(-74, 2), P(-96, -4), P(-101, -2), P(-92, 4), P(-62, 6), P(-74, 2)]
  blank(g, stab)
  hatch(g, stab, d + 500, true)
  ink(g, stab, { w: 2 * w, d: d + 450, t: 300 })
  // Rumpf: Nase rund, Heck läuft hoch zum Konus
  const body: P[] = [
    ...B(P(-70, top), P(-20, top - 1), P(40, top - 1), P(deck === 2 ? 58 : 66, top)),
    ...B(P(deck === 2 ? 58 : 66, top), P(82, top + 1), P(92, -4), P(94, 1)).slice(1),
    ...B(P(94, 1), P(94, 7), P(84, 11), P(66, 11)).slice(1),
    ...L(P(66, 11), P(-52, 11)).slice(1),
    ...B(P(-52, 11), P(-70, 10), P(-86, 2), P(-100, -6)).slice(1),
    ...B(P(-100, -6), P(-101, -8), P(-99, -10), P(-96, -10)).slice(1),
    ...L(P(-96, -10), P(-70, top)).slice(1),
  ]
  blank(g, body)
  ink(g, body, { w: 2.6 * w, d, t: 800 })
  // Seitenleitwerk, gepfeilt
  const fin: P[] = [P(-66, top), P(-90, top - 35), P(-100, top - 35), P(-98, -10)]
  blank(g, fin)
  hatch(g, fin, d + 500, true)
  ink(g, fin, { w: 2.4 * w, d: d + 400, t: 400 })
  // Cockpitfenster, Fensterreihe, Türen
  ink(g, [P(74, -7.5), P(82, -7.5), P(86.5, -3.4), P(76, -3.4), P(74, -7.5)], { w: 1.5 * w, d: d + 700, t: 200 })
  if (s >= 0.7)
    for (let k = 0; k < 15; k++) {
      const wx = -56 + k * 8 + (k > 7 ? 4 : 0)
      ink(g, RR(x + wx * s, y - 5.5 * s, 3 * s, 4 * s, 1.4 * s), { w: 0.9 * w, d: d + 750 + k * 25, t: 80 })
      if (deck === 2 && k > 0 && k < 13) ink(g, RR(x + wx * s, y - 15.5 * s, 3 * s, 4 * s, 1.4 * s), { w: 0.9 * w, d: d + 800 + k * 25, t: 80 })
    }
  else for (let k = 0; k < 8; k++) dot(g, x + (-50 + k * 14) * s, y - 3.5 * s, 1.3 * s, d + 750 + k * 25)
  for (const dx of [62, 7, -62]) ink(g, RR(x + dx * s, y - 7.5 * s, 5 * s, 15 * s, 1.5 * s), { w: 1.1 * w, d: d + 900, t: 200 })
  // Tragfläche (nach hinten gepfeilt) mit Triebwerk darunter
  const wg: P[] = [P(20, 9), P(-26, 24), P(-40, 25), P(-10, 9), P(20, 9)]
  blank(g, wg)
  hatch(g, wg, d + 650, true)
  ink(g, wg, { w: 2.2 * w, d: d + 550, t: 300 })
  const eng: P[] = [...B(P(4, 13), P(-2, 13), P(-12, 15), P(-14, 19)), ...B(P(-14, 19), P(-12, 23), P(-2, 25), P(4, 25)).slice(1), ...L(P(4, 25), P(26, 24)).slice(1), ...B(P(26, 24), P(30, 23), P(30, 14), P(26, 13)).slice(1), ...L(P(26, 13), P(4, 13)).slice(1)]
  blank(g, eng)
  ink(g, eng, { w: 2.2 * w, d: d + 650, t: 400 })
  ink(g, E(x + 27 * s, y + 18.5 * s, 2.2 * s, 5 * s), { w: 1.4 * w, d: d + 900, t: 200 })
  ink(g, L(P(6, 16.5), P(22, 16.5)), { w: 1 * w, d: d + 950, t: 150 })
}

/** Vogel im Flug (Tusche-„M“), Mitte (x, y) */
export function bird(g: Element, x: number, y: number, s = 1, d = 0): void {
  ink(g, [...B([x - 14 * s, y - 2 * s], [x - 10 * s, y - 8 * s], [x - 4 * s, y - 7 * s], [x, y]), ...B([x, y], [x + 4 * s, y - 7 * s], [x + 10 * s, y - 8 * s], [x + 14 * s, y - 2 * s]).slice(1)], { w: 2 * Math.min(1.3, s), d, t: 300 })
}

const rng = (seed: number) => () => (seed = (seed * 9301 + 49297) % 233280) / 233280

/** Boden: Linie mit Gras-Büscheln (grass) oder Steinchen darunter */
export function ground(g: Element, x0: number, x1: number, y: number, d = 0, o: { grass?: boolean; seed?: number } = {}): void {
  ink(g, L([x0, y], [x1, y]), { w: 2.6, d, t: 600 })
  const rnd = rng(o.seed ?? 5)
  for (let x = x0 + 8; x < x1 - 6; x += 9 + rnd() * 16) {
    if (o.grass !== false && rnd() < 0.6) {
      const h = 3 + rnd() * 6
      ink(g, L([x, y], [x - 1.5 + rnd() * 3, y - h]), { w: 1.3, d: d + 300 + (x - x0), t: 80 })
      ink(g, L([x + 2.5, y], [x + 4 + rnd() * 2, y - h * 0.7]), { w: 1.2, d: d + 320 + (x - x0), t: 80 })
    } else {
      const yy = y + 5 + rnd() * 5
      ink(g, L([x, yy], [x + 4 + rnd() * 6, yy]), { w: 1.2, d: d + 300 + (x - x0), t: 80 })
    }
  }
}

/** Wasseroberfläche mit kleinen Wellen darunter */
export function sea(g: Element, x0: number, x1: number, y: number, d = 0, rows = 3): void {
  ink(g, waveP(x0, x1, y, 3, 34), { w: 2.4, d, t: 800 })
  const rnd = rng(11)
  for (let r = 1; r <= rows; r++)
    for (let x = x0 + rnd() * 30; x < x1 - 20; x += 40 + rnd() * 40) ink(g, B([x, y + r * 14], [x + 4, y + r * 14 - 3], [x + 10, y + r * 14 - 3], [x + 14, y + r * 14]), { w: 1.3, d: d + 400 + r * 100, t: 120 })
}

/** Sternfeld in einem Rechteck: Punkte und einige Funkel-Kreuze, ohne Ausschlussbereich ex */
export function stars(g: Element, x: number, y: number, w: number, h: number, n = 30, d = 0, ex?: (px: number, py: number) => boolean): void {
  const rnd = rng(17)
  for (let i = 0; i < n; i++) {
    const px = x + rnd() * w
    const py = y + rnd() * h
    const big = rnd() < 0.15
    const rr = 0.9 + rnd() * 1.1
    if (ex?.(px, py)) continue
    if (big) {
      const p = pop(g, d + i * 30, '50% 50%')
      ink(p, L([px - 4, py], [px + 4, py]), { w: 1.4, t: 0 })
      ink(p, L([px, py - 4], [px, py + 4]), { w: 1.4, t: 0 })
    } else dot(g, px, py, rr, d + i * 30)
  }
}

/** Glatte Kurve durch alle Punkte (Catmull-Rom) */
export function smooth(pts: P[], k = 10): P[] {
  const out: P[] = [pts[0]]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let j = 1; j <= k; j++) {
      const t = j / k
      const t2 = t * t
      const t3 = t2 * t
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)) as P)
    }
  }
  return out
}

let clipN = 0

/** Laufende Welle zwischen x0 und x1 (Wellenlänge len, Amplitude amp), läuft endlos nach rechts (ms je Wellenlänge) */
export function travelWave(g: Element, x0: number, x1: number, y: number, amp: number, len: number, o: { ms?: number; d?: number; w?: number; t?: number } = {}): void {
  const id = `tw${++clipN}`
  const cp = mk('clipPath', { id }, g)
  mk('rect', { x: x0, y: y - amp - 10, width: x1 - x0, height: amp * 2 + 20 }, cp)
  const c = mk('g', { 'clip-path': `url(#${id})` }, g)
  const mv = mk('g', {}, c)
  ink(mv, waveP(x0 - len, x1, y, amp, len), { w: o.w ?? 3, d: o.d, t: o.t ?? 900 })
  mk('animateTransform', { attributeName: 'transform', type: 'translate', from: '0 0', to: `${len} 0`, dur: `${(o.ms ?? 1200) / 1000}s`, begin: `${((o.d ?? 0) + (o.t ?? 900)) / 1000}s`, repeatCount: 'indefinite' }, mv)
}

/** Kreiswellen, die sich endlos von (cx, cy) ausbreiten und verblassen */
export function ripple(g: Element, cx: number, cy: number, r0: number, r1: number, o: { n?: number; ms?: number; d?: number; w?: number; ry?: number } = {}): void {
  const n = o.n ?? 3
  const ms = o.ms ?? 2400
  for (let i = 0; i < n; i++) {
    const begin = `${((o.d ?? 0) + (i * ms) / n) / 1000}s`
    const k = (o.ry ?? 1)
    const c = mk('ellipse', { cx, cy, rx: r0, ry: r0 * k, class: 'ring', opacity: 0, style: `stroke-width:${o.w ?? 2}px` }, g)
    mk('animate', { attributeName: 'rx', from: r0, to: r1, dur: `${ms / 1000}s`, begin, repeatCount: 'indefinite' }, c)
    mk('animate', { attributeName: 'ry', from: r0 * k, to: r1 * k, dur: `${ms / 1000}s`, begin, repeatCount: 'indefinite' }, c)
    mk('animate', { attributeName: 'opacity', values: '0;1;0', keyTimes: '0;0.15;1', dur: `${ms / 1000}s`, begin, repeatCount: 'indefinite' }, c)
  }
}

/** Auge von vorn: Lider mit Wimpern, Iris mit Strahlen, Pupille, Lichtpunkt */
export function eyeFront(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const up = B(P(-60, 0), P(-30, -36), P(30, -36), P(60, 0))
  const lo = B(P(-60, 0), P(-30, 30), P(30, 30), P(60, 0))
  blank(g, [...up, ...lo.slice().reverse()])
  ink(g, up, { w: 3.2 * s, d, t: 500 })
  ink(g, lo, { w: 2.4 * s, d: d + 150, t: 500 })
  for (let k = 0; k < 7; k++) {
    const p = up[Math.round(((k + 1) / 8) * (up.length - 1))]
    ink(g, L(p, [p[0] + (k - 3) * 2.6 * s, p[1] - 9 * s]), { w: 1.6 * s, d: d + 500 + k * 40, t: 100 })
  }
  ink(g, E(cx, cy, 22 * s), { w: 2.4 * s, d: d + 300, t: 400 })
  for (let k = 0; k < 18; k++) {
    const a = rad(k * 20)
    ink(g, L([cx + Math.cos(a) * 11 * s, cy + Math.sin(a) * 11 * s], [cx + Math.cos(a) * 20 * s, cy + Math.sin(a) * 20 * s]), { w: 0.9 * s, d: d + 600 + k * 15, t: 80 })
  }
  mk('circle', { cx, cy, r: 9.5 * s, class: 'k fade', style: `--d:${d + 500}ms` }, g)
  mk('circle', { cx: cx + 4 * s, cy: cy - 4 * s, r: 2.6 * s, fill: '#fff', class: 'fade', style: `--d:${d + 700}ms` }, g)
}

/** Regenbogen: sechs Farbstreifen (außen Rot … innen Violett) als Bogen um (cx, cy), Außenradius r, Breite bw; rev = Farben umgekehrt */
export function bow(g: Element, cx: number, cy: number, r: number, bw: number, o: { d?: number; a0?: number; a1?: number; rev?: boolean; t?: number; w?: number } = {}): void {
  const a0 = o.a0 ?? 180
  const a1 = o.a1 ?? 360
  const d = o.d ?? 0
  for (let k = 0; k < 6; k++) {
    const ro = r - (bw * k) / 6
    const ri = r - (bw * (k + 1)) / 6
    const band = (o.rev ? 5 - k : k) % 2 === 0
    if (band) hatch(g, [...E(cx, cy, ro, ro, a0, a1), ...E(cx, cy, ri, ri, a1, a0)], d + 600 + k * 120, k === (o.rev ? 5 : 0))
  }
  ink(g, E(cx, cy, r, r, a0, a1), { w: o.w ?? 2.6, d, t: o.t ?? 900 })
  ink(g, E(cx, cy, r - bw, r - bw, a0, a1), { w: (o.w ?? 2.6) * 0.8, d: d + 200, t: o.t ?? 900 })
}

/** Regen: schräge Striche fallen endlos im Rechteck (x, y, w, h) */
export function rain(g: Element, x: number, y: number, w: number, h: number, o: { n?: number; d?: number; ms?: number; slant?: number } = {}): void {
  const n = o.n ?? 12
  const sl = o.slant ?? 0.25
  const rnd = rng(31)
  for (let i = 0; i < n; i++) {
    const px = x + rnd() * w
    const py = y + rnd() * h * 0.3
    flow(g, L([px, py], [px - h * sl, py + h * 0.7]), { n: 1, ms: (o.ms ?? 900) * (0.8 + rnd() * 0.4), d: (o.d ?? 0) + rnd() * 600, r: 2.2, kind: 'dash' })
  }
}
