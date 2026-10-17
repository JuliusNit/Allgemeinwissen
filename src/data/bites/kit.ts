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
  ink(g, L([x - 6 * s, base], [x - 5 * s, base - 60 * s]), { w: 2.8, d, t: 400 })
  ink(g, L([x + 6 * s, base], [x + 5 * s, base - 60 * s]), { w: 2.8, d, t: 400 })
  const c: P[] = [...B([x - 5 * s, base - 60 * s], [x - 70 * s, base - 50 * s], [x - 60 * s, base - 150 * s], [x, base - 140 * s]), ...B([x, base - 140 * s], [x + 60 * s, base - 150 * s], [x + 70 * s, base - 50 * s], [x + 5 * s, base - 60 * s]).slice(1)]
  hatch(g, c, d + 700)
  ink(g, c, { w: 3, d: d + 300, t: 800 })
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

/** Erdkugel als Kreis mit schraffierten Landmassen */
export function earth(g: Element, cx: number, cy: number, r: number, d = 0): void {
  blank(g, E(cx, cy, r))
  const land: P[][] = [
    [[-0.55, -0.55], [-0.15, -0.7], [-0.1, -0.35], [-0.35, -0.1], [-0.3, 0.3], [-0.55, 0.1], [-0.7, -0.25]],
    [[0.15, -0.45], [0.55, -0.55], [0.75, -0.2], [0.5, 0.05], [0.4, 0.45], [0.2, 0.2], [0.05, -0.1]],
  ]
  for (const l of land) {
    const pts = [...l, l[0]].map(([a, b]) => [cx + a * r, cy + b * r] as P)
    const sm: P[] = []
    for (let i = 0; i < pts.length - 1; i++) sm.push(...L(pts[i], pts[i + 1]).slice(i ? 1 : 0))
    hatch(g, sm, d + 500)
    ink(g, sm, { w: 1.8, d: d + 300, t: 600 })
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
