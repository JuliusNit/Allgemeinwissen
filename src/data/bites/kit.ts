// Weitere Tusche-Motive für die 2-Minuten-Häppchen (aha-*.ts): Himmel, Wasser, Moleküle, Diagramme, Kästen.
// Wie draw.ts: zeichnet in eine SVG-Gruppe, Verzögerung `d` in ms ab dem Erscheinen der Grafik.
// Layout-Regel der aha-Häppchen: Text oben (y 64, bis ~260) → Grafik zwischen 290 und 650; Text unten (y ≥ 470) →
// Grafik zwischen 70 und 450. Beschriftungen nie auf Strichen, Linien kreuzen sich nur, wo es gemeint ist
// (scripts/bites-check.mjs prüft das).
import { B, E, L, RR, arrow, blank, dashes, group, hatch, ink, mk, pop, text, type P } from './draw'

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
  // Haufenwolke: blumenkohlartige Quellungen oben, flache Basis, Schattenband unten, innere Wölbungen
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  const bumps: [number, number, number][] = [[-56, -12, 16], [-40, -30, 18], [-16, -44, 22], [12, -50, 20], [36, -36, 18], [56, -16, 16]]
  const c: P[] = [P(-66, 0)]
  bumps.forEach(([bx, by, r], i) => {
    const a0 = i === 0 ? 180 : 200
    const a1 = i === bumps.length - 1 ? 360 : 340
    c.push(...E(cx + bx * s, y + by * s, r * s, r * s * 0.9, a0, a1))
  })
  c.push(P(70, 0), P(-66, 0))
  blank(g, c)
  if (dense) hatch(g, c, d + 400, true)
  else hatch(g, [P(-64, -2), P(68, -2), P(60, -10), ...E(cx, y - 10 * s, 60 * s, 4 * s, 0, 180).slice(1), P(-64, -2)], d + 500)
  ink(g, c, { w: 2.6, d, t: 700 })
  if (s >= 0.6) for (const [bx, by, r] of [[-30, -16, 12], [4, -26, 14], [34, -14, 11]] as const) ink(g, E(cx + bx * s, y + by * s, r * s, r * s * 0.8, 200, 320), { w: 1.1, d: d + 400, t: 300 })
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

// Binnenmeere, die über das Land gezeichnet werden (Ostsee, Schwarzes Meer, Kaspisches Meer)
const SEAS: [number, number][][] = [
  [[10, 54], [14, 54], [20, 54.5], [21, 57], [24, 57], [22, 59], [28, 60], [23, 60], [21, 61], [21, 63], [25, 65], [22, 65.8], [17, 62.5], [18, 60], [16, 57], [13, 55.5], [10, 54]],
  [[28, 41], [32, 41.2], [37, 41], [41, 41.5], [41.5, 42.5], [37, 44.5], [39, 47], [35, 46], [33, 44.5], [30, 46], [28, 44], [28, 41]],
  [[47, 45], [53, 46], [54, 42], [53, 37], [50, 37], [49, 40], [47, 43], [47, 45]],
]

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
  for (const sea of SEAS) {
    const pts = sea.map(([lo, la]) => pr(lo, la))
    if (!pts.every((q) => q.front)) continue
    blank(g, pts.map((q) => q.p))
    ink(g, pts.map((q) => q.p), { w: (o.w ?? 1.3) * 0.8, d: d + 900, t: 400, p: 0.3 })
  }
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

/** Kartenausschnitt (Länge lon0…lon1, Breite lat0…lat1) im Rechteck: Land schraffiert, Küsten als Tusche, Meer weiß */
export function mapRegion(g: Element, x: number, y: number, w: number, h: number, lon0: number, lon1: number, lat0: number, lat1: number, d = 0): (lon: number, lat: number) => P {
  const pr = (lon: number, lat: number): P => [x + ((lon - lon0) / (lon1 - lon0)) * w, y + ((lat1 - lat) / (lat1 - lat0)) * h]
  const id = `mr${++clipN}`
  const cp = mk('clipPath', { id }, g)
  mk('rect', { x, y, width: w, height: h }, cp)
  const c = mk('g', { 'clip-path': `url(#${id})` }, g)
  COASTS.forEach((poly, i) => {
    if (!poly.some(([lo, la]) => lo > lon0 - 30 && lo < lon1 + 30 && la > lat0 - 30 && la < lat1 + 30)) return
    const pts: P[] = []
    for (let k = 0; k < poly.length - 1; k++) {
      const [a0, b0] = poly[k]
      const [a1, b1] = poly[k + 1]
      const n = Math.max(1, Math.ceil(Math.max(Math.abs(a1 - a0), Math.abs(b1 - b0)) / 0.5))
      for (let j = k ? 1 : 0; j <= n; j++) pts.push(pr(a0 + ((a1 - a0) * j) / n, b0 + ((b1 - b0) * j) / n))
    }
    hatch(c, pts, d + 500 + i * 40)
    ink(c, pts, { w: 1.8, d: d + 200, t: 900, p: 0.3 })
  })
  for (const sea of SEAS) {
    const pts: P[] = []
    for (let k = 0; k < sea.length - 1; k++) for (let j = k ? 1 : 0; j <= 4; j++) pts.push(pr(sea[k][0] + ((sea[k + 1][0] - sea[k][0]) * j) / 4, sea[k][1] + ((sea[k + 1][1] - sea[k][1]) * j) / 4))
    blank(c, pts)
    ink(c, pts, { w: 1.6, d: d + 700, t: 600, p: 0.3 })
  }
  ink(g, RR(x, y, w, h, 6), { w: 2.6, d, t: 700 })
  return pr
}

/** Gestrichelte Kurve im Rechteck (wie plot) */
export function dplot(g: Element, x0: number, y0: number, w: number, h: number, f: (t: number) => number, d = 0, wd = 1.8): P[] {
  const pts = Array.from({ length: 81 }, (_, i) => [x0 + (w * i) / 80, y0 - h * f(i / 80)] as P)
  dashes(g, pts, { w: wd, d, dash: 7, gap: 5, step: 25 })
  return pts
}

/** Schneeflocke mit sechs Armen und Seitenästen */
export function flake(g: Element, cx: number, cy: number, r: number, d = 0): void {
  for (let k = 0; k < 6; k++) {
    const a = rad(k * 60 - 90)
    const tip: P = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
    ink(g, L([cx, cy], tip), { w: Math.max(1, r / 6), d: d + k * 40, t: 150 })
    const m: P = [cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6]
    for (const s of [-1, 1]) ink(g, L(m, [m[0] + Math.cos(a + s * 0.8) * r * 0.32, m[1] + Math.sin(a + s * 0.8) * r * 0.32]), { w: Math.max(0.8, r / 9), d: d + 300 + k * 40, t: 100 })
  }
}

/** Mond-Vorderseite: Meere (Procellarum, Imbrium, Serenitatis, Tranquillitatis, Crisium, Fecunditatis, Nubium, Frigoris), Tycho mit Strahlen, Copernicus. libr = Schwanken in px (Libration) */
export function moonFace(g: Element, cx: number, cy: number, r: number, d = 0, o: { libr?: number; rot?: number } = {}): void {
  const id = `mf${++clipN}`
  const cp = mk('clipPath', { id }, g)
  mk('circle', { cx, cy, r }, cp)
  blank(g, E(cx, cy, r))
  const c = mk('g', { 'clip-path': `url(#${id})` }, g)
  const rot = mk('g', o.rot ? { transform: `rotate(${o.rot} ${cx} ${cy})` } : {}, c)
  const f = o.libr ? wobble(rot, { dx: o.libr, dy: o.libr * 0.3, ms: 5000, d: d + 800 }) : rot
  const P = (x: number, y: number): P => [cx + x * r, cy + y * r]
  const blobAt = (x: number, y: number, rx: number, ry: number, seed: number): P[] => {
    const pts: P[] = []
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2
      const k = 1 + 0.18 * Math.sin(a * 3 + seed) + 0.1 * Math.cos(a * 5 + seed * 2)
      pts.push(P(x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k))
    }
    return smooth([...pts, pts[0], pts[1]], 5).slice(0, -5)
  }
  const maria: [number, number, number, number, number][] = [
    [-0.62, 0.02, 0.24, 0.42, 1], [-0.3, -0.45, 0.25, 0.22, 2], [0.15, -0.42, 0.16, 0.15, 3], [0.3, -0.1, 0.2, 0.17, 4],
    [0.66, -0.3, 0.12, 0.1, 5], [0.55, 0.15, 0.12, 0.18, 6], [-0.2, 0.33, 0.18, 0.13, 7], [0, -0.72, 0.4, 0.07, 8], [-0.05, 0.08, 0.12, 0.1, 9],
  ]
  maria.forEach(([x, y, rx, ry, s], i) => {
    const b = blobAt(x, y, rx, ry, s)
    hatch(f, b, d + 600 + i * 60, i === 1 || i === 3)
    ink(f, [...b, b[0]], { w: Math.max(0.8, r / 90), d: d + 300 + i * 50, t: 400, p: 0.3 })
  })
  for (const [x, y, k] of [[-0.15, 0.72, 0.05], [-0.33, -0.12, 0.045], [-0.6, 0.55, 0.035], [0.4, 0.55, 0.04], [0.55, -0.6, 0.03]] as const) {
    ink(f, E(cx + x * r, cy + y * r, k * r), { w: Math.max(0.8, r / 100), d: d + 900, t: 200 })
  }
  if (r > 60) for (let k = 0; k < 10; k++) {
    const a = rad(k * 36 + 10)
    const t: P = P(-0.15, 0.72)
    ink(f, L([t[0] + Math.cos(a) * r * 0.07, t[1] + Math.sin(a) * r * 0.07], [t[0] + Math.cos(a) * r * (0.25 + (k % 3) * 0.1), t[1] + Math.sin(a) * r * (0.25 + (k % 3) * 0.1)]), { w: 0.7, d: d + 1100 + k * 30, t: 150 })
  }
  ink(g, E(cx, cy, r), { w: Math.max(1.6, Math.min(3, r / 30)), d, t: 700 })
}

/** Sonnenscheibe: Granulation, Randverdunklung, Sonnenflecken (Kern + Hof), Protuberanzen am Rand */
export function sunDisk(g: Element, cx: number, cy: number, r: number, d = 0): void {
  blank(g, E(cx, cy, r))
  const rnd = rng(41)
  const n = Math.round((r * r) / 90)
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2
    const rr = Math.sqrt(rnd()) * r * 0.92
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    const s = 2 + rnd() * 2.6
    ink(g, E(x, y, s, s * 0.8, rnd() * 360, rnd() * 360 + 200), { w: 0.7, d: d + 400 + i * 4, t: 80 })
  }
  hatch(g, [...E(cx, cy, r), ...E(cx, cy, r * 0.86, r * 0.86, 360, 0)], d + 700)
  for (const [x, y, k] of [[-0.3, -0.2, 0.09], [-0.18, -0.26, 0.05], [0.35, 0.25, 0.07]] as const) {
    const px = cx + x * r
    const py = cy + y * r
    hatch(g, E(px, py, k * r * 1.8, k * r * 1.5), d + 900)
    ink(g, E(px, py, k * r * 1.8, k * r * 1.5), { w: 1, d: d + 800, t: 200 })
    mk('ellipse', { cx: px, cy: py, rx: k * r * 0.8, ry: k * r * 0.7, class: 'k fade', style: `--d:${d + 1000}ms` }, g)
  }
  ink(g, E(cx, cy, r), { w: 3, d, t: 800 })
  for (const a0 of [-40, 150]) {
    const a = rad(a0)
    const base: P = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
    const out: P = [cx + Math.cos(a) * r * 1.22, cy + Math.sin(a) * r * 1.22]
    const b2: P = [cx + Math.cos(a + 0.22) * r, cy + Math.sin(a + 0.22) * r]
    ink(g, B(base, [out[0] - Math.sin(a) * r * 0.1, out[1] + Math.cos(a) * r * 0.1], [out[0] + Math.sin(a) * r * 0.2, out[1] - Math.cos(a) * r * 0.05], b2), { w: 1.8, d: d + 1100, t: 500 })
  }
  for (let k = 0; k < 16; k++) {
    const a = rad(k * 22.5 + 8)
    const l = r * (0.18 + (k % 3) * 0.1)
    ink(g, L([cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8)], [cx + Math.cos(a) * (r + 8 + l), cy + Math.sin(a) * (r + 8 + l)]), { w: 1.4, d: d + 1200 + k * 30, t: 150 })
  }
}

/** Mammut mit Fell, Stoßzähnen und eingerolltem Rüssel, Füße auf y, Blick nach rechts */
export function mammoth(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = [...B(P(-52, -22), P(-62, -70), P(-20, -92), P(10, -88)), ...B(P(10, -88), P(30, -104), P(56, -86), P(54, -58)).slice(1), ...B(P(54, -58), P(58, -40), P(54, -30), P(48, -24)).slice(1), P(46, 0), P(32, 0), P(32, -24), P(-20, -24), P(-20, 0), P(-34, 0), P(-36, -20), P(-52, -22)]
  blank(g, body)
  hatch(g, body, d + 500)
  ink(g, body, { w: 2.4 * Math.min(1.3, s), d, t: 800 })
  for (let k = 0; k < 9; k++) {
    const px = -44 + k * 10
    ink(g, L(P(px, -26), P(px - 2, -18)), { w: 1, d: d + 600, t: 80 })
  }
  ink(g, B(P(52, -50), P(66, -40), P(66, -16), P(58, -10)), { w: 2.4, d: d + 600, t: 300 })
  ink(g, B(P(58, -10), P(52, -6), P(50, -14), P(56, -16)), { w: 2, d: d + 800, t: 200 })
  ink(g, B(P(46, -44), P(70, -44), P(82, -60), P(78, -76)), { w: 2.6, d: d + 700, t: 300 })
  dot(g, x + 40 * s, y - 68 * s, 1.8 * s, d + 900)
  ink(g, B(P(24, -78), P(18, -66), P(22, -56), P(30, -60)), { w: 1.6, d: d + 800, t: 200 })
}

/** Überschall-Kampfjet von der Seite, Mitte (x, y), Nase rechts (Länge ≈ 170 × s): spitze Nase, Kanzel, Deltaflügel, Seitenleitwerk, Düse */
export function fighter(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const w = Math.min(1.3, Math.max(0.6, s))
  const body: P[] = [...B(P(-80, -6), P(-20, -9), P(40, -9), P(86, 0)), ...B(P(86, 0), P(40, 6), P(-20, 8), P(-80, 7)).slice(1), P(-80, -6)]
  blank(g, body)
  ink(g, body, { w: 2.4 * w, d, t: 700 })
  const canopy: P[] = [...B(P(22, -8), P(30, -17), P(50, -16), P(58, -5))]
  blank(g, [...canopy, canopy[0]])
  ink(g, canopy, { w: 1.8 * w, d: d + 300, t: 300 })
  ink(g, L(P(38, -15), P(40, -7)), { w: 1 * w, d: d + 500, t: 100 })
  const wing: P[] = [P(30, 4), P(-50, 16), P(-66, 16), P(-58, 4), P(30, 4)]
  blank(g, wing)
  hatch(g, wing, d + 600, true)
  ink(g, wing, { w: 1.8 * w, d: d + 400, t: 300 })
  const fin: P[] = [P(-46, -8), P(-70, -38), P(-80, -38), P(-78, -6)]
  blank(g, fin)
  hatch(g, fin, d + 600, true)
  ink(g, fin, { w: 1.8 * w, d: d + 400, t: 300 })
  ink(g, [P(-80, -6), P(-88, -4), P(-88, 5), P(-80, 7)], { w: 1.8 * w, d: d + 500, t: 200 })
  ink(g, [P(0, 2), P(14, 2), P(14, 8)], { w: 1.2 * w, d: d + 600, t: 150 })
}

/** Gruppe, deren Inhalt auf ein Rechteck (oder mit r auf einen Kreis um x, y) zugeschnitten ist */
export function clipBox(g: Element, x: number, y: number, w: number, h: number): SVGGElement {
  const id = `cb${++clipN}`
  const cp = mk('clipPath', { id }, g)
  mk('rect', { x, y, width: w, height: h }, cp)
  return mk('g', { 'clip-path': `url(#${id})` }, g)
}

/** Blatt mit Mittelrippe und Seitenadern, Stiel unten links, Spitze nach rechts oben */
export function leaf(g: Element, cx: number, cy: number, s = 1, d = 0): P[] {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const o = [...B(P(-80, 40), P(-60, -30), P(20, -60), P(80, -40)), ...B(P(80, -40), P(60, 30), P(-20, 60), P(-80, 40)).slice(1)]
  blank(g, o)
  hatch(g, o, d + 600)
  ink(g, o, { w: 3, d, t: 800 })
  const mid = B(P(-80, 40), P(-30, 10), P(30, -20), P(76, -38))
  ink(g, mid, { w: 2, d: d + 500, t: 600 })
  for (let i = 1; i < 6; i++) {
    const q = mid[Math.round((i / 6) * (mid.length - 1))]
    for (const k of [-1, 1]) ink(g, B(q, [q[0] + 8 * s, q[1] + k * 8 * s], [q[0] + 14 * s, q[1] + k * 16 * s], [q[0] + 16 * s, q[1] + k * 24 * s]), { w: 1, d: d + 700 + i * 60, t: 150 })
  }
  ink(g, L(P(-80, 40), P(-100, 56)), { w: 2.4, d: d + 300, t: 200 })
  return o
}

/** Mitochondrium: doppelte Hülle, innere Haut zu Falten (Cristae) gelegt */
export function mito(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const w = 64 * s
  const h = 32 * s
  blank(g, RR(cx - w / 2, cy - h / 2, w, h, h / 2))
  hatch(g, RR(cx - w / 2 + 3 * s, cy - h / 2 + 3 * s, w - 6 * s, h - 6 * s, h / 2 - 3 * s), d + 500)
  ink(g, RR(cx - w / 2, cy - h / 2, w, h, h / 2), { w: 2.4, d, t: 400 })
  for (let i = 0; i < 6; i++) {
    const x = cx - w / 2 + 10 * s + i * ((w - 20 * s) / 5)
    const up = i % 2 === 0
    const y0 = up ? cy - h / 2 + 3 * s : cy + h / 2 - 3 * s
    const y1 = up ? cy + h * 0.18 : cy - h * 0.18
    blank(g, RR(x - 2.4 * s, Math.min(y0, y1), 4.8 * s, Math.abs(y1 - y0), 2.4 * s))
    ink(g, [[x - 2.4 * s, y0], [x - 2.4 * s, y1], [x + 2.4 * s, y1], [x + 2.4 * s, y0]], { w: 1.2, d: d + 300 + i * 40, t: 150 })
  }
}

/** Bakterium (Stäbchen) mit Erbgut-Knäuel, feinen Härchen und Geißel */
export function bact(g: Element, x: number, y: number, s = 1, d = 0, fill = false): void {
  for (let k = 0; k < 8; k++) {
    const a = rad(k * 45 + 20)
    ink(g, L([x + Math.cos(a) * 20 * s, y + Math.sin(a) * 8 * s], [x + Math.cos(a) * 26 * s, y + Math.sin(a) * 13 * s]), { w: 0.8, d: d + 200, t: 60 })
  }
  blank(g, RR(x - 20 * s, y - 8 * s, 40 * s, 16 * s, 8 * s))
  if (fill) hatch(g, RR(x - 20 * s, y - 8 * s, 40 * s, 16 * s, 8 * s), d + 200, true)
  ink(g, RR(x - 20 * s, y - 8 * s, 40 * s, 16 * s, 8 * s), { w: 2.2, d, t: 300 })
  if (s >= 0.8 && !fill) ink(g, Array.from({ length: 24 }, (_, i) => [x - 10 * s + i * 0.9 * s, y + Math.sin(i * 1.3) * 3.5 * s] as P), { w: 0.9, d: d + 300, t: 200 })
  ink(g, B([x + 20 * s, y], [x + 28 * s, y - 6 * s], [x + 32 * s, y + 6 * s], [x + 40 * s, y]), { w: 1.4, d: d + 200, t: 200 })
  ink(g, B([x + 40 * s, y], [x + 46 * s, y - 5 * s], [x + 50 * s, y + 5 * s], [x + 56 * s, y]), { w: 1.2, d: d + 300, t: 200 })
}

/** Virus: Hülle mit keulenförmigen Stacheln, innen das Erbgut */
export function virus(g: Element, cx: number, cy: number, r: number, d = 0): void {
  for (let k = 0; k < 12; k++) {
    const a = rad(k * 30)
    ink(g, L([cx + Math.cos(a) * r, cy + Math.sin(a) * r], [cx + Math.cos(a) * (r + 9), cy + Math.sin(a) * (r + 9)]), { w: 1.8, d: d + 300, t: 100 })
    const c: P = [cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12)]
    blank(g, E(c[0], c[1], 4))
    ink(g, E(c[0], c[1], 4), { w: 1.4, d: d + 400, t: 100 })
  }
  ball(g, cx, cy, r, { d, fill: 'hell', w: 2.4 })
  if (r > 14) ink(g, Array.from({ length: 40 }, (_, i) => [cx + Math.cos(i * 0.5) * r * 0.5 * (1 - i / 60), cy + Math.sin(i * 0.5) * r * 0.5 * (1 - i / 60)] as P), { w: 1, d: d + 500, t: 300 })
}

/** Antikörper (Y aus vier Ketten), Fuß bei (x, y), Drehung in Grad */
export function antibody(g: Element, x: number, y: number, s = 1, deg = 0, d = 0): void {
  const r = ([a, b]: P): P => [x + a * s * Math.cos(rad(deg)) - b * s * Math.sin(rad(deg)), y + a * s * Math.sin(rad(deg)) + b * s * Math.cos(rad(deg))]
  for (const k of [-1, 1]) {
    ink(g, [r([k * 2.2, 0]), r([k * 2.2, -18])], { w: 2, d, t: 200 })
    ink(g, [r([k * 2.2, -18]), r([k * 12, -30])], { w: 2.2, d: d + 150, t: 200 })
    ink(g, [r([k * 7, -16]), r([k * 17, -26])], { w: 1.6, d: d + 250, t: 200 })
  }
  ink(g, [r([-2.2, -12]), r([2.2, -12])], { w: 1, d: d + 300, t: 60 })
}

/** DNA als Doppelhelix (waagerecht): zwei Stränge umeinander, dazwischen die Basenpaare */
export function ladder(g: Element, x0: number, x1: number, y: number, h = 30, d = 0, t = 800): void {
  const turn = 62
  const s1: P[] = []
  const s2: P[] = []
  for (let x = x0; x <= x1; x += 2) {
    s1.push([x, y + Math.sin(((x - x0) / turn) * Math.PI * 2) * h / 2])
    s2.push([x, y - Math.sin(((x - x0) / turn) * Math.PI * 2) * h / 2])
  }
  for (let x = x0 + 5; x < x1 - 2; x += 8) {
    const a = Math.sin(((x - x0) / turn) * Math.PI * 2) * h / 2
    if (Math.abs(a) > 3) ink(g, L([x, y + a * 0.86], [x, y - a * 0.86]), { w: 1.2, d: d + ((x - x0) / (x1 - x0)) * t, t: 80 })
  }
  ink(g, s1, { w: 2.6, d, t })
  ink(g, s2, { w: 2.2, d, t })
}

/** Zelle mit Kern, Kernkörperchen, Mitochondrien und Membranfalten */
export function cell(g: Element, cx: number, cy: number, rx: number, ry: number, d = 0, nucleus = true): void {
  const o = [...B([cx - rx, cy], [cx - rx, cy - ry * 1.2], [cx + rx * 0.4, cy - ry * 1.1], [cx + rx, cy - ry * 0.3]), ...B([cx + rx, cy - ry * 0.3], [cx + rx * 1.1, cy + ry * 0.8], [cx - rx * 0.3, cy + ry * 1.2], [cx - rx, cy]).slice(1)]
  blank(g, o)
  ink(g, o, { w: 3, d, t: 900 })
  if (nucleus) {
    hatch(g, E(cx - rx * 0.1, cy, rx * 0.26, ry * 0.3), d + 700, true)
    ink(g, E(cx - rx * 0.1, cy, rx * 0.26, ry * 0.3), { w: 2.4, d: d + 500, t: 500 })
    blank(g, E(cx - rx * 0.06, cy - ry * 0.04, rx * 0.07, ry * 0.08))
    ink(g, E(cx - rx * 0.06, cy - ry * 0.04, rx * 0.07, ry * 0.08), { w: 1.2, d: d + 800, t: 200 })
    if (rx > 60) {
      for (const [a, b, k] of [[0.45, -0.35, 1], [0.5, 0.35, -1], [-0.55, 0.4, 1]] as const) {
        const mx = cx + a * rx
        const my = cy + b * ry
        ink(g, RR(mx - rx * 0.12, my - ry * 0.06, rx * 0.24, ry * 0.12, ry * 0.06), { w: 1.4, d: d + 900, t: 200 })
        ink(g, Array.from({ length: 9 }, (_, i) => [mx - rx * 0.09 + i * rx * 0.0225, my + (i % 2 ? -1 : 1) * ry * 0.03 * k] as P), { w: 0.8, d: d + 1000, t: 150 })
      }
      for (let i = 0; i < 3; i++) ink(g, E(cx - rx * 0.1, cy, rx * (0.36 + i * 0.06), ry * (0.42 + i * 0.07), 200 + i * 10, 300 - i * 10), { w: 0.9, d: d + 1100 + i * 60, t: 200 })
    }
  }
}

/** Kopf von vorn: Haar, Ohren, Brauen, Augen mit Iris, Nase, Lippen, Hals; Höhe ≈ 190·s. squint = zusammengekniffene Augen */
export function head(g: Element, cx: number, cy: number, s = 1, d = 0, o: { squint?: boolean; neck?: boolean } = {}): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  if (o.neck !== false) {
    ink(g, B(P(-26, 70), P(-26, 90), P(-28, 104), P(-34, 116)), { w: 2.4, d, t: 300 })
    ink(g, B(P(26, 70), P(26, 90), P(28, 104), P(34, 116)), { w: 2.4, d, t: 300 })
    ink(g, B(P(-34, 116), P(-70, 124), P(-90, 132), P(-100, 150)), { w: 2.4, d: d + 100, t: 300 })
    ink(g, B(P(34, 116), P(70, 124), P(90, 132), P(100, 150)), { w: 2.4, d: d + 100, t: 300 })
  }
  for (const k of [-1, 1]) {
    const ear = B(P(k * 60, -10), P(k * 76, -22), P(k * 80, 14), P(k * 58, 26))
    ink(g, ear, { w: 2.2, d: d + 200, t: 300 })
    ink(g, B(P(k * 62, -4), P(k * 70, -8), P(k * 72, 10), P(k * 62, 16)), { w: 1.2, d: d + 300, t: 200 })
  }
  const face = [...B(P(0, -96), P(-64, -96), P(-66, -10), P(-60, 20)), ...B(P(-60, 20), P(-54, 64), P(-24, 84), P(0, 86)).slice(1), ...B(P(0, 86), P(24, 84), P(54, 64), P(60, 20)).slice(1), ...B(P(60, 20), P(66, -10), P(64, -96), P(0, -96)).slice(1)]
  blank(g, face)
  ink(g, face, { w: 2.8, d, t: 700 })
  const hair = [...B(P(-64, -20), P(-74, -90), P(-30, -124), P(10, -118)), ...B(P(10, -118), P(60, -112), P(76, -70), P(64, -20)).slice(1), ...B(P(64, -20), P(56, -56), P(30, -70), P(-6, -66)).slice(1), ...B(P(-6, -66), P(-36, -64), P(-56, -50), P(-64, -20)).slice(1)]
  blank(g, hair)
  hatch(g, hair, d + 600, true)
  ink(g, hair, { w: 2.4, d: d + 300, t: 600 })
  for (const k of [-1, 1]) {
    ink(g, B(P(k * 12, -34), P(k * 22, -42), P(k * 38, -42), P(k * 46, -34)), { w: 3, d: d + 500, t: 200 })
    const ex = k * 28
    if (o.squint) {
      ink(g, B(P(ex - 14, -14), P(ex - 6, -20), P(ex + 6, -20), P(ex + 14, -14)), { w: 2.6, d: d + 600, t: 200 })
      ink(g, B(P(ex - 12, -12), P(ex - 4, -8), P(ex + 4, -8), P(ex + 12, -12)), { w: 1.6, d: d + 650, t: 200 })
    } else {
      const up = B(P(ex - 16, -14), P(ex - 8, -24), P(ex + 8, -24), P(ex + 16, -14))
      const lo = B(P(ex - 16, -14), P(ex - 8, -6), P(ex + 8, -6), P(ex + 16, -14))
      blank(g, [...up, ...lo.slice().reverse()])
      ink(g, up, { w: 2.4, d: d + 600, t: 200 })
      ink(g, lo, { w: 1.4, d: d + 650, t: 200 })
      ink(g, E(cx + ex * s, cy - 15 * s, 6 * s), { w: 1.6, d: d + 700, t: 150 })
      mk('circle', { cx: cx + ex * s, cy: cy - 15 * s, r: 3 * s, class: 'k fade', style: `--d:${d + 750}ms` }, g)
    }
  }
  ink(g, B(P(-4, -14), P(-6, 6), P(-14, 18), P(-10, 26)), { w: 2, d: d + 800, t: 300 })
  ink(g, B(P(-10, 26), P(-4, 30), P(4, 30), P(10, 26)), { w: 2, d: d + 850, t: 200 })
  ink(g, B(P(-24, 50), P(-10, 44), P(10, 44), P(24, 50)), { w: 2.2, d: d + 900, t: 300 })
  ink(g, B(P(-16, 54), P(-6, 60), P(6, 60), P(16, 54)), { w: 1.4, d: d + 950, t: 200 })
}

/** Kochmesser waagerecht, Griff links bei x, Klingenrücken bei y; Klinge nach rechts, Schneide unten */
export function knife(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const grip = [...B(P(0, 4), P(-4, 10), P(-4, 22), P(2, 26)), P(56, 24), P(56, 6), P(0, 4)]
  blank(g, grip)
  hatch(g, grip, d + 300, true)
  ink(g, grip, { w: 2.4, d, t: 300 })
  for (const a of [14, 32, 48]) {
    blank(g, E(x + a * s, y + 15 * s, 2.6 * s))
    ink(g, E(x + a * s, y + 15 * s, 2.6 * s), { w: 1.2, d: d + 300, t: 100 })
  }
  ink(g, RR(x + 56 * s, y + 2 * s, 8 * s, 26 * s, 2), { w: 2.2, d: d + 200, t: 200 })
  const blade = [P(64, 0), ...B(P(64, 0), P(120, -2), P(170, 0), P(200, 18)), ...B(P(200, 18), P(160, 30), P(110, 34), P(64, 32)).slice(1), P(64, 0)]
  blank(g, blade)
  ink(g, blade, { w: 2.6, d: d + 300, t: 500 })
  ink(g, B(P(70, 26), P(110, 28), P(160, 26), P(194, 18)), { w: 0.9, d: d + 600, t: 300 })
}

/** Ganze Zwiebel: Hals mit trockenen Spitzen, papierne Längsadern, Wurzelscheibe; Mitte (cx, cy), Höhe ≈ 190·s */
export function onion(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const right = [...B(P(6, -80), P(20, -40), P(82, -30), P(80, 18)), ...B(P(80, 18), P(78, 60), P(30, 74), P(8, 74)).slice(1)]
  const left = right.map(([px, py]): P => [2 * cx - px, py])
  const body = [...right, ...left.slice().reverse()]
  blank(g, body)
  const meri = (k: number) => B(P(k * 6, -80), P(k * 86, -30), P(k * 84, 52), P(k * 8, 74))
  hatch(g, [...right, ...meri(0.5).reverse()], d + 600)
  ink(g, body, { w: 3, d, t: 800 })
  for (const [i, k] of [-0.62, -0.25, 0.15, 0.5].entries()) ink(g, meri(k), { w: 1.1, d: d + 400 + i * 80, t: 500 })
  ink(g, B(P(-6, -80), P(-8, -96), P(-4, -106), P(-10, -122)), { w: 2.2, d: d + 300, t: 300 })
  ink(g, B(P(6, -80), P(6, -96), P(2, -108), P(8, -124)), { w: 2.2, d: d + 300, t: 300 })
  ink(g, B(P(0, -104), P(4, -114), P(14, -120), P(20, -132)), { w: 1.4, d: d + 500, t: 200 })
  ink(g, E(cx, cy + 74 * s, 14 * s, 4 * s), { w: 1.8, d: d + 500, t: 200 })
  for (let k = 0; k < 7; k++) {
    const x0 = (k - 3) * 4
    ink(g, B(P(x0, 77), P(x0 + (k - 3) * 3, 86), P(x0 - 4 + k, 92), P(x0 + (k - 3) * 5, 100)), { w: 1, d: d + 700 + k * 40, t: 150 })
  }
}

/** Halbierte Zwiebel, Schnittfläche von vorn: verschachtelte Schalen, Herz, Wurzelboden; Mitte (cx, cy), Radius r */
export function halfOnion(g: Element, cx: number, cy: number, r: number, d = 0): void {
  const shell = (k: number) => {
    const f = k / 6
    const P = (a: number, b: number): P => [cx + a * r * f, cy + r * 0.62 + (b - 0.62) * r * f]
    return [...B(P(0, -1.05), P(0.55, -0.7), P(0.98, -0.3), P(0.95, 0.2)), ...B(P(0.95, 0.2), P(0.9, 0.62), P(0.4, 0.66), P(0, 0.66)).slice(1), ...B(P(0, 0.66), P(-0.4, 0.66), P(-0.9, 0.62), P(-0.95, 0.2)).slice(1), ...B(P(-0.95, 0.2), P(-0.98, -0.3), P(-0.55, -0.7), P(0, -1.05)).slice(1)]
  }
  blank(g, shell(6))
  hatch(g, [...shell(6), ...shell(5.6).reverse()], d + 500, true)
  for (let k = 6; k >= 1; k--) ink(g, shell(k), { w: k === 6 ? 3 : 1.3, d: d + (6 - k) * 90, t: 400 })
  ink(g, B([cx, cy + r * 0.62], [cx - 3, cy + r * 0.3], [cx + 3, cy], [cx, cy - r * 0.2]), { w: 1.4, d: d + 700, t: 200 })
  ink(g, B([cx - r * 0.3, cy + r * 1.28], [cx - r * 0.1, cy + r * 1.22], [cx + r * 0.1, cy + r * 1.22], [cx + r * 0.3, cy + r * 1.28]), { w: 2, d: d + 600, t: 200 })
}

/** Kugel-Stab-Modell: Atome [x, y, Zeichen, Füllung], Bindungen [i, j, doppelt] */
export function mol(g: Element, atoms: [number, number, string, ('leer' | 'hell' | 'dicht')?][], bonds: [number, number, boolean?][], s = 1, d = 0): void {
  bonds.forEach(([i, j, two], k) => {
    const [a, b] = [atoms[i], atoms[j]]
    const n = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const [ox, oy] = [(-(b[1] - a[1]) / n) * 3 * s, ((b[0] - a[0]) / n) * 3 * s]
    for (const f of two ? [-1, 1] : [0]) ink(g, L([a[0] + ox * f, a[1] + oy * f], [b[0] + ox * f, b[1] + oy * f]), { w: 1.8 * s, d: d + k * 60, t: 150 })
  })
  atoms.forEach(([x, y, l, fill], k) => {
    const r = (l === 'H' ? 7 : l === 'S' ? 13 : 11) * s
    ball(g, x, y, r, { d: d + 200 + k * 50, fill, w: 1.8 * s, t: 150 })
    if (l !== 'H' && s >= 0.9) text(g, x, y + 5 * s, l, { anchor: 'middle', size: 13 * s, cls: fill && fill !== 'leer' ? 'halo' : '', d: d + 300 + k * 50 })
  })
}

/** Indizes der Landmassen in COASTS */
export const LAND = { afrika: 0, eurasien: 1, nordamerika: 2, groenland: 3, suedamerika: 4, australien: 5, antarktis: 13 } as const

export type Proj = 'mercator' | 'peters' | 'equi' | 'tripel'

/** normierte Kartenkoordinaten: x ∈ [−1, 1], y ∈ [−1, 1] (oben = Norden) */
export function project(proj: Proj, lon: number, lat: number): [number, number] {
  const la = rad(Math.max(-89.5, Math.min(89.5, lat)))
  const lo = rad(lon)
  if (proj === 'mercator') {
    const m = (p: number) => Math.log(Math.tan(Math.PI / 4 + p / 2))
    return [lon / 180, m(la) / m(rad(80))]
  }
  if (proj === 'peters') return [lon / 180, Math.sin(la)]
  if (proj === 'equi') return [lon / 180, lat / 90]
  const a = Math.acos(Math.cos(la) * Math.cos(lo / 2))
  const sinc = a === 0 ? 1 : Math.sin(a) / a
  const x = 0.5 * (lo * (2 / Math.PI) + (2 * Math.cos(la) * Math.sin(lo / 2)) / sinc)
  const y = 0.5 * (la + Math.sin(la) / sinc)
  return [x / 2.5708, y / 1.5708]
}

/** Weltkarte in (x, y, w, h): Netz alle 30°, Küsten schraffiert; hi = Landmassen dicht schraffiert.
 *  Gibt den Projektor (Länge, Breite) → Bühne zurück. */
export function worldMap(g: Element, x: number, y: number, w: number, h: number, proj: Proj, d = 0, o: { hi?: number[]; grid?: boolean; frame?: boolean } = {}): (lon: number, lat: number) => P {
  const pr = (lon: number, lat: number): P => {
    const [nx, ny] = project(proj, lon, lat)
    return [x + w / 2 + (nx * w) / 2, y + h / 2 - (ny * h) / 2]
  }
  const id = `wm${++clipN}`
  const cp = mk('clipPath', { id }, g)
  if (proj === 'tripel') {
    const rim: P[] = [...Array.from({ length: 37 }, (_, k) => pr(180, 90 - k * 5)), ...Array.from({ length: 37 }, (_, k) => pr(-180, -90 + k * 5))]
    mk('path', { d: `M${rim.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z` }, cp)
  } else mk('rect', { x, y, width: w, height: h }, cp)
  const c = mk('g', { 'clip-path': `url(#${id})` }, g)
  if (o.grid !== false) {
    for (let lon = -150; lon <= 150; lon += 30) ink(c, Array.from({ length: 37 }, (_, k) => pr(lon, -90 + k * 5)), { w: lon === 0 ? 1.2 : 0.8, d: d + 200, t: 400 })
    for (let lat = -60; lat <= 60; lat += 30) ink(c, Array.from({ length: 73 }, (_, k) => pr(-180 + k * 5, lat)), { w: lat === 0 ? 1.4 : 0.8, d: d + 300, t: 400 })
  }
  COASTS.forEach((poly, i) => {
    const pts: P[] = []
    for (let k = 0; k < poly.length - 1; k++) {
      const [a0, b0] = poly[k]
      const [a1, b1] = poly[k + 1]
      const n = Math.max(1, Math.ceil(Math.max(Math.abs(a1 - a0), Math.abs(b1 - b0)) / 1.5))
      for (let j = k ? 1 : 0; j <= n; j++) pts.push(pr(a0 + ((a1 - a0) * j) / n, b0 + ((b1 - b0) * j) / n))
    }
    if (i === LAND.antarktis) pts.push(pr(180, -90), pr(-180, -90))
    blank(c, pts)
    hatch(c, pts, d + 500 + i * 30, o.hi?.includes(i))
    ink(c, pts, { w: o.hi?.includes(i) ? 2 : 1.4, d: d + 300 + i * 40, t: 700, p: 0.3 })
  })
  for (const sea of SEAS) {
    const pts: P[] = []
    for (let k = 0; k < sea.length - 1; k++) for (let j = k ? 1 : 0; j <= 4; j++) pts.push(pr(sea[k][0] + ((sea[k + 1][0] - sea[k][0]) * j) / 4, sea[k][1] + ((sea[k + 1][1] - sea[k][1]) * j) / 4))
    blank(c, pts)
    ink(c, pts, { w: 1.2, d: d + 800, t: 400, p: 0.3 })
  }
  if (o.frame !== false) {
    if (proj === 'tripel') ink(g, [...Array.from({ length: 37 }, (_, k) => pr(180, 90 - k * 5)), ...Array.from({ length: 37 }, (_, k) => pr(-180, -90 + k * 5)), pr(180, 90)], { w: 2.6, d, t: 800 })
    else ink(g, RR(x, y, w, h, 2), { w: 2.6, d, t: 800 })
  }
  return pr
}

/** Küstenlinie einer Landmasse als Punkte, beliebig projiziert */
export function coastPts(i: number, pr: (lon: number, lat: number) => P, step = 1.5): P[] {
  const poly = COASTS[i]
  const pts: P[] = []
  for (let k = 0; k < poly.length - 1; k++) {
    const [a0, b0] = poly[k]
    const [a1, b1] = poly[k + 1]
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(a1 - a0), Math.abs(b1 - b0)) / step))
    for (let j = k ? 1 : 0; j <= n; j++) pts.push(pr(a0 + ((a1 - a0) * j) / n, b0 + ((b1 - b0) * j) / n))
  }
  return pts
}

/** Drehung eines Punkts (Länge, Breite) auf der Kugel um einen Euler-Pol (plon, plat) um ang Grad */
export function rotPole(lon: number, lat: number, plon: number, plat: number, ang: number): [number, number] {
  const v = [Math.cos(rad(lat)) * Math.cos(rad(lon)), Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat))]
  const k = [Math.cos(rad(plat)) * Math.cos(rad(plon)), Math.cos(rad(plat)) * Math.sin(rad(plon)), Math.sin(rad(plat))]
  const c = Math.cos(rad(ang))
  const s = Math.sin(rad(ang))
  const kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2]
  const cr = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]]
  const r = v.map((x, i) => x * c + cr[i] * s + k[i] * kv * (1 - c))
  return [(Math.atan2(r[1], r[0]) * 180) / Math.PI, (Math.asin(Math.max(-1, Math.min(1, r[2]))) * 180) / Math.PI]
}
