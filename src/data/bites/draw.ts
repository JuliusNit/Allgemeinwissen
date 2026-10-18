// Gemeinsame Tusche-Zeichnungen für die Häppchen (Bühne 360 × 680). Jede Funktion zeichnet in eine SVG-Gruppe;
// Verzögerungen `d` in ms ab dem Erscheinen der Grafik.
//
// Zustände ohne eigenes CSS (index.css, „Häppchen-Zustände“): Die Szene setzt Klassen a1 … a6 auf die Grafik.
//   x1 … x6  erscheint (ploppt auf), sobald a1 … a6 gesetzt ist     f1 … f6  blendet dann ein
//   h1 … h6  blendet dann aus                                       m1 … m4  bewegt sich dann nach --m1 … --m4
// Verzögerung je Element über style "--dl: 300ms", Ursprung von m über transform-origin (Bühnen-Pixel).
import type { TextState } from '../feed'
import { B, E, L, RR, arrow, blank, countUp, group, hatch, ink, mk, pop, text, type P } from '../../lib/inkdraw'

export { B, E, L, RR, arrow, bigText, blank, countUp, dashes, group, hatch, ink, mk, move, poly, pop, text } from '../../lib/inkdraw'
export type { P } from '../../lib/inkdraw'

/** Erzähltext, Standard: volle Breite */
export const T = (text: string, y: number, o: Partial<TextState> = {}): TextState => ({ text, x: 20, y, w: 320, ...o })

/** Aufhänger (Text = hook des Häppchens) */
export const HOOK = (y: number, o: Partial<TextState> = {}): TextState => ({ kind: 'hook', x: 20, y, w: 320, ...o })

/** Gruppe mit Zustandsklasse und Stil, z. B. st(g, 'x1', '--dl:200ms') */
export const st = (g: Element, cls: string, style = '') => group(g, cls, style)

/** Mensch mit Körper (Kopf, Haar, Rumpf, Gliedmaßen mit Knie/Ellbogen, Schuhe), Füße bei (x, y), Höhe ≈ 32 × s */
export function fig(g: Element, x: number, y: number, s = 1, o: { d?: number; w?: number; t?: number; arms?: 'down' | 'up' | 'push' | 'cross' } = {}): SVGGElement {
  const f = group(g)
  const w = (o.w ?? 2.4) * Math.min(1.4, Math.max(0.75, s)) * 0.8
  const io = { w, d: o.d ?? 0, t: o.t ?? 0 }
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  // Beine mit Knie, Schuhe nach vorn
  ink(f, [P(-1.8, -13), P(-2.6, -6.5), P(-3, -0.6), P(-0.6, -0.4)], { ...io, w: w * 1.35 })
  ink(f, [P(1.8, -13), P(2.4, -6.5), P(2.8, -0.6), P(5, -0.4)], { ...io, w: w * 1.35 })
  // Rumpf: Schultern rund, zur Hüfte schmaler
  const torso: P[] = [...B(P(-4.6, -12.6), P(-5.4, -18), P(-6.4, -22.6), P(-3.2, -23.4)), ...L(P(-3.2, -23.4), P(3.2, -23.4)).slice(1), ...B(P(3.2, -23.4), P(6.4, -22.6), P(5.4, -18), P(4.6, -12.6)).slice(1), P(-4.6, -12.6)]
  blank(f, torso)
  hatch(f, torso, io.d + (io.t ? 300 : 0), true)
  ink(f, torso, io)
  // Arme mit Ellbogen
  const arms = o.arms ?? 'down'
  const pose: [P, P][] =
    arms === 'up'
      ? [[P(-7.4, -27), P(-8.6, -32)], [P(7.4, -27), P(8.6, -32)]]
      : arms === 'push'
        ? [[P(1, -16.5), P(9.6, -19)], [P(3.4, -18), P(10.6, -16.6)]]
        : arms === 'cross'
          ? [[P(-4.2, -16), P(4, -18)], [P(4.2, -16), P(-4, -18)]]
          : [[P(-6.6, -16.8), P(-6.4, -10.6)], [P(6.6, -16.8), P(6.4, -10.6)]]
  pose.forEach(([el, hand], k) => {
    const sh = P(k ? 4.4 : -4.4, -22)
    ink(f, [sh, el, hand], io)
    mk('circle', { cx: hand[0], cy: hand[1], r: 1.15 * s, class: 'k fade', style: `--d:${io.d}ms` }, f)
  })
  // Hals, Kopf, Haar
  ink(f, L(P(0, -23.4), P(0, -25)), io)
  blank(f, E(x, y - 28.6 * s, 3.9 * s, 4.3 * s))
  ink(f, E(x, y - 28.6 * s, 3.9 * s, 4.3 * s), io)
  const hair: P[] = [...E(x, y - 28.6 * s, 3.9 * s, 4.3 * s, 180, 360), ...B(P(3.9, -28.6), P(2, -29.8), P(-1.4, -29.4), P(-3.9, -28.6)).slice(1)]
  mk('path', { d: `M${hair.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z`, class: 'k fade', style: `--d:${io.d}ms` }, f)
  return f
}

/** Reihe von Figuren, die nacheinander aufploppen */
export function crowd(g: Element, x: number, y: number, n: number, gap = 18, s = 1, d = 0, step = 90): SVGGElement {
  const c = group(g)
  for (let i = 0; i < n; i++) fig(pop(c, d + i * step), x + i * gap, y, s)
  return c
}

/** Gleis entlang einer Mittellinie (Schwellen + zwei Schienen) */
export function track(g: Element, center: P[], o: { d?: number; t?: number } = {}): void {
  const d0 = o.d ?? 0
  const t = o.t ?? 900
  const n = center.length
  const ang = (i: number) => {
    const a = center[Math.max(0, i - 1)]
    const b = center[Math.min(n - 1, i + 1)]
    return Math.atan2(b[1] - a[1], b[0] - a[0])
  }
  for (let i = 4; i < n - 2; i += 8) {
    const a = ang(i)
    const c = center[i]
    const nx = -Math.sin(a)
    const ny = Math.cos(a)
    ink(g, L([c[0] + nx * 7, c[1] + ny * 7 - 1], [c[0] - nx * 7, c[1] - ny * 7 + 1]), { w: 2.2, d: d0 + (i / n) * t, t: 90 })
  }
  for (const off of [-4.5, 4.5])
    ink(
      g,
      center.map((c, i) => [c[0] - Math.sin(ang(i)) * off, c[1] + Math.cos(ang(i)) * off] as P),
      { w: 2.2, d: d0, t },
    )
}

/** Kleine Lok, Ursprung unten links, fährt nach rechts */
export function train(g: Element, d = 0): void {
  hatch(g, RR(32, -40, 58, 28, 10), d + 500)
  ink(g, RR(0, -60, 34, 50, 4), { w: 2.8, d, t: 500 })
  ink(g, RR(7, -53, 20, 14, 3), { w: 2, d: d + 200, t: 300 })
  ink(g, RR(32, -40, 58, 28, 10), { w: 2.8, d: d + 150, t: 500 })
  ink(g, RR(68, -56, 10, 16, 2), { w: 2.4, d: d + 300, t: 300 })
  ink(g, L([-4, -62], [38, -62]), { w: 3, d: d + 100, t: 300 })
  ink(g, L([-2, -10], [92, -10]), { w: 2.6, d: d + 200, t: 400 })
  ink(g, L([90, -14], [102, -4]), { w: 2.6, d: d + 400, t: 200 })
  for (const [x, r] of [[14, 7], [46, 8], [72, 8]]) {
    ink(g, E(x, -6, r), { w: 2.4, d: d + 300, t: 400 })
    mk('circle', { cx: x, cy: -6, r: 2, class: 'k fade', style: `--d:${d + 600}ms` }, g)
  }
}

/** Balkenwaage um (180, 250); Balken in Gruppe .m1 (kippt mit --m1) */
export function balance(g: Element, left: number, right: number, d = 0, tilt = -11): void {
  ink(g, L([180, 262], [180, 520]), { w: 3.4, d, t: 400 })
  ink(g, B([128, 522], [150, 506], [210, 506], [232, 522]), { w: 3, d: d + 200, t: 300 })
  ink(g, L([120, 524], [240, 524]), { w: 3, d: d + 250, t: 300 })
  const beam = group(g, 'm1', `--m1: rotate(${tilt}deg); transform-origin: 180px 250px; --dl: 900ms`)
  ink(beam, L([50, 250], [310, 250]), { w: 3.6, d: d + 350, t: 500 })
  ink(beam, E(180, 250, 7), { w: 2.6, d: d + 300, t: 300 })
  for (const [cx, n] of [[80, left], [280, right]]) {
    ink(beam, L([cx, 252], [cx - 44, 352]), { w: 2, d: d + 700, t: 300 })
    ink(beam, L([cx, 252], [cx + 44, 352]), { w: 2, d: d + 700, t: 300 })
    ink(beam, B([cx - 50, 352], [cx - 30, 374], [cx + 30, 374], [cx + 50, 352]), { w: 3, d: d + 900, t: 300 })
    ink(beam, L([cx - 50, 352], [cx + 50, 352]), { w: 2.4, d: d + 900, t: 300 })
    for (let i = 0; i < n; i++) fig(pop(beam, d + 1100 + i * 90), n === 1 ? cx : cx - 32 + i * 16, 349, 0.62, { w: 2.6 })
  }
}

/** Globus mit Längen- und Breitengraden */
export function globe(g: Element, cx: number, cy: number, r: number, d = 0, dots = 0): void {
  ink(g, E(cx, cy, r), { w: 3.4, d, t: 900 })
  for (const [k, dd] of [[0.4, 500], [0.78, 650]]) ink(g, E(cx, cy, r * k, r, -90, 270), { w: 1.8, d: d + dd, t: 700 })
  for (const [k, dd] of [[-0.5, 800], [0, 900], [0.5, 1000]]) {
    const dy = r * k
    ink(g, E(cx, cy + dy, Math.sqrt(r * r - dy * dy), r * 0.11, 0, 180), { w: 1.6, d: d + dd, t: 500 })
  }
  let seed = 7
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  for (let i = 0; i < dots; i++) {
    let x = 0
    let y = 0
    do {
      x = cx - r + rnd() * 2 * r
      y = cy - r + rnd() * 2 * r
    } while (Math.hypot(x - cx, y - cy) > r * 0.87)
    mk('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: Math.max(2.5, r * 0.035), class: 'k pop', style: `--d:${d + 1100 + i * 35}ms; transform-origin: 50% 50%` }, g)
  }
}

export interface Bar {
  label: string
  v: number
  /** Anzeige des Werts */
  fmt?: (v: number) => string
  dense?: boolean
}

/** Waagerechte Balken mit Beschriftung darüber und hochzählendem Wert */
export function hbars(g: Element, rows: Bar[], o: { x?: number; y?: number; w?: number; h?: number; gap?: number; max?: number; d?: number } = {}): void {
  const x = o.x ?? 30
  const W = o.w ?? 300
  const h = o.h ?? 44
  const gap = o.gap ?? 110
  const max = o.max ?? Math.max(...rows.map((r) => r.v))
  rows.forEach((r, i) => {
    const y = (o.y ?? 300) + i * gap
    const d = (o.d ?? 0) + i * 450
    const bw = Math.max(6, (W * r.v) / max)
    text(g, x, y - 12, r.label, { d })
    const back = ink(g, RR(x, y, W, h, 8), { w: 2, d, t: 500 })
    back.style.opacity = '0.35'
    const bar = group(g, 'grow-x', `--d:${d + 300}ms`)
    hatch(bar, RR(x, y, bw, h, 8), d + 300, r.dense)
    ink(bar, RR(x, y, bw, h, 8), { w: 2.8, t: 0 })
    const inside = bw > W - 80
    const t = text(g, inside ? x + bw - 10 : x + bw + 10, y + h / 2 + 7, '', { d: d + 300, anchor: inside ? 'end' : 'start', size: 20 })
    if (inside) t.classList.add('halo')
    countUp(t, r.v, d + 300, 1200, r.fmt)
  })
}

/** Senkrechte Säulen auf einer Grundlinie */
export function vbars(g: Element, cols: Bar[], o: { x?: number; base?: number; w?: number; gap?: number; h?: number; max?: number; d?: number } = {}): void {
  const x0 = o.x ?? 60
  const base = o.base ?? 560
  const w = o.w ?? 70
  const gap = o.gap ?? 100
  const H = o.h ?? 300
  const max = o.max ?? Math.max(...cols.map((c) => c.v))
  ink(g, L([x0 - 24, base + 2], [x0 + (cols.length - 1) * gap + w + 24, base + 2]), { w: 3, d: o.d ?? 0, t: 500 })
  cols.forEach((c, i) => {
    const x = x0 + i * gap
    const d = (o.d ?? 0) + 200 + i * 400
    const h = Math.max(4, (H * c.v) / max)
    const bar = group(g, 'grow-y', `--d:${d}ms`)
    hatch(bar, RR(x, base - h, w, h, 6), d, c.dense)
    ink(bar, RR(x, base - h, w, h, 6), { w: 2.8, t: 0 })
    text(g, x + w / 2, base + 24, c.label, { anchor: 'middle', cls: 's', d })
    const t = text(g, x + w / 2, base - h - 12, '', { anchor: 'middle', d: d + 300, size: 18 })
    countUp(t, c.v, d + 200, 1100, c.fmt)
  })
}

export interface Mark {
  /** 0 … 1 entlang der Linie */
  at: number
  label: string
  sub?: string
  up?: boolean
  big?: boolean
}

/** Zeitstrahl mit Marken, die nacheinander aufploppen */
export function timeline(g: Element, x0: number, x1: number, y: number, marks: Mark[], d = 0, step = 450): void {
  arrow(g, L([x0, y], [x1, y]), { w: 3, d, t: 700, head: 12 })
  marks.forEach((m, i) => {
    const x = x0 + (x1 - x0 - 16) * m.at
    const dd = d + 500 + i * step
    const p = pop(g, dd, '50% 50%')
    ink(p, E(x, y, m.big ? 8 : 6), { w: 2.6, t: 0 })
    hatch(p, E(x, y, m.big ? 8 : 6), dd, true)
    const ty = m.up ? y - 22 : y + 30
    text(g, x, ty, m.label, { anchor: 'middle', d: dd + 100, size: m.big ? 18 : 15 })
    if (m.sub) text(g, x, m.up ? ty - 18 : ty + 18, m.sub, { anchor: 'middle', cls: 's', d: dd + 200 })
  })
}

/** Uhr mit Zeigern (Stunde, Minute als Winkel in Grad) */
export function clock(g: Element, cx: number, cy: number, r: number, h = 300, m = 0, d = 0): SVGGElement {
  ink(g, E(cx, cy, r), { w: 3.2, d, t: 700 })
  for (let k = 0; k < 12; k++) {
    const a = (k * 30 * Math.PI) / 180
    ink(g, L([cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92]), { w: 2, d: d + 300 + k * 30, t: 80 })
  }
  const hand = (deg: number, len: number, w: number, cls: string) => {
    const hg = group(g, cls, `transform-origin: ${cx}px ${cy}px`)
    const a = ((deg - 90) * Math.PI) / 180
    ink(hg, L([cx, cy], [cx + Math.cos(a) * len, cy + Math.sin(a) * len]), { w, d: d + 700, t: 300 })
    return hg
  }
  hand(h, r * 0.5, 3.4, 'hh')
  return hand(m, r * 0.75, 2.6, 'mh')
}

/** Sprechblase (Chat), Spitze links oder rechts */
export function bubble(g: Element, x: number, y: number, w: number, h: number, side: 'l' | 'r', d = 0): void {
  const p = pop(g, d, side === 'l' ? '0% 100%' : '100% 100%')
  const tail: P[] = side === 'l' ? [[x + 14, y + h - 2], [x - 6, y + h + 10], [x + 26, y + h - 2]] : [[x + w - 14, y + h - 2], [x + w + 6, y + h + 10], [x + w - 26, y + h - 2]]
  ink(p, RR(x, y, w, h, 14), { w: 2.6, t: 0 })
  ink(p, tail, { w: 2.4, t: 0 })
}

/** Glühbirne */
export function bulb(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const p = [...B([cx - 14 * s, cy + 22 * s], [cx - 40 * s, cy - 4 * s], [cx - 30 * s, cy - 46 * s], [cx, cy - 46 * s]), ...B([cx, cy - 46 * s], [cx + 30 * s, cy - 46 * s], [cx + 40 * s, cy - 4 * s], [cx + 14 * s, cy + 22 * s]).slice(1)]
  ink(g, p, { w: 3, d, t: 700 })
  for (let k = 0; k < 3; k++) ink(g, L([cx - 15 * s, cy + (27 + k * 7) * s], [cx + 15 * s, cy + (27 + k * 7) * s]), { w: 2.6, d: d + 500 + k * 100, t: 150 })
  ink(g, B([cx - 9 * s, cy + 18 * s], [cx - 9 * s, cy - 6 * s], [cx - 2 * s, cy - 12 * s], [cx, cy - 2 * s]), { w: 1.8, d: d + 700, t: 300 })
  ink(g, B([cx, cy - 2 * s], [cx + 2 * s, cy - 12 * s], [cx + 9 * s, cy - 6 * s], [cx + 9 * s, cy + 18 * s]), { w: 1.8, d: d + 900, t: 300 })
}

/** Strahlen um einen Punkt (Leuchten) */
export function rays(g: Element, cx: number, cy: number, r0: number, r1: number, n = 10, d = 0): void {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2
    ink(g, L([cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]), { w: 2.4, d: d + k * 40, t: 150 })
  }
}

/** Fünfzackiger Stern */
export function star(g: Element, cx: number, cy: number, r: number, o: { d?: number; t?: number; fill?: boolean; w?: number } = {}): void {
  const pts: P[] = []
  for (let k = 0; k <= 10; k++) {
    const a = (k * 36 - 90) * (Math.PI / 180)
    const rr = k % 2 ? r * 0.45 : r
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  if (o.fill) hatch(g, pts, (o.d ?? 0) + 200, true)
  ink(g, pts, { w: o.w ?? 2.4, d: o.d, t: o.t ?? 400 })
}

/** Blitz-Zickzack von oben nach unten */
export function bolt(g: Element, pts: P[], d = 0, w = 4): void {
  ink(g, pts, { w, d, t: 250 })
}

/** Berg (Dreieck mit Schneekappe) */
export function mountain(g: Element, x0: number, x1: number, base: number, peak: P, d = 0, dense = false): void {
  const outline: P[] = [[x0, base], peak, [x1, base]]
  hatch(g, outline, d + 500, dense)
  ink(g, [...L([x0, base], peak), ...L(peak, [x1, base]).slice(1)], { w: 3, d, t: 700 })
}

/** Gedankenblitz-Fragezeichen als Tusche */
export function question(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  ink(g, B([cx - 14 * s, cy - 18 * s], [cx - 14 * s, cy - 40 * s], [cx + 16 * s, cy - 40 * s], [cx + 16 * s, cy - 20 * s]), { w: 4, d, t: 300 })
  ink(g, B([cx + 16 * s, cy - 20 * s], [cx + 16 * s, cy - 6 * s], [cx, cy - 6 * s], [cx, cy + 8 * s]), { w: 4, d: d + 300, t: 250 })
  mk('circle', { cx, cy: cy + 22 * s, r: 3.5 * s, class: 'k pop', style: `--d:${d + 550}ms;transform-origin:50% 50%` }, g)
}

/** Haken (✓) und Kreuz (✗) */
export function check(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  ink(g, [...L([cx - 12 * s, cy], [cx - 3 * s, cy + 10 * s]), ...L([cx - 3 * s, cy + 10 * s], [cx + 14 * s, cy - 12 * s]).slice(1)], { w: 4, d, t: 300 })
}
export function cross(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  ink(g, L([cx - 12 * s, cy - 12 * s], [cx + 12 * s, cy + 12 * s]), { w: 4, d, t: 200 })
  ink(g, L([cx + 12 * s, cy - 12 * s], [cx - 12 * s, cy + 12 * s]), { w: 4, d: d + 200, t: 200 })
}

/** Durchstreichen (Linie über etwas, z. B. Mythos) */
export function strike(g: Element, a: P, b: P, d = 0): void {
  ink(g, B(a, [a[0] + (b[0] - a[0]) * 0.3, a[1] + (b[1] - a[1]) * 0.3 - 6], [a[0] + (b[0] - a[0]) * 0.7, a[1] + (b[1] - a[1]) * 0.7 + 6], b), { w: 4.4, d, t: 350 })
}

/** Kreis um etwas (Hervorhebung) */
export function ring(g: Element, cx: number, cy: number, rx: number, ry = rx, d = 0): void {
  ink(g, E(cx, cy, rx, ry, -100, 250), { w: 3, d, t: 600 })
}

/** Münze */
export function coin(g: Element, cx: number, cy: number, r: number, label = '€', d = 0): void {
  ink(g, E(cx, cy, r), { w: 3, d, t: 500 })
  ink(g, E(cx, cy, r * 0.78), { w: 1.6, d: d + 200, t: 400 })
  text(g, cx, cy + r * 0.32, label, { anchor: 'middle', d: d + 300, size: r * 0.9 })
}

/** Gehirn von der Seite (Mitte cx, cy, Breite ~ 220 × s) */
export function brain(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (x: number, y: number): P => [cx + x * s, cy + y * s]
  const out = [
    ...B(P(-100, 30), P(-130, -20), P(-90, -90), P(-30, -86)),
    ...B(P(-30, -86), P(10, -110), P(80, -100), P(100, -50)).slice(1),
    ...B(P(100, -50), P(130, -20), P(120, 40), P(80, 50)).slice(1),
    ...B(P(80, 50), P(60, 80), P(10, 70), P(-10, 56)).slice(1),
    ...B(P(-10, 56), P(-50, 70), P(-90, 60), P(-100, 30)).slice(1),
  ]
  hatch(g, out, d + 900)
  ink(g, out, { w: 3.2, d, t: 900 })
  ink(g, B(P(-60, -60), P(-30, -40), P(-40, 0), P(-10, 10)), { w: 2.2, d: d + 500, t: 400 })
  ink(g, B(P(10, -80), P(0, -50), P(30, -30), P(20, 0)), { w: 2.2, d: d + 600, t: 400 })
  ink(g, B(P(50, -70), P(70, -40), P(50, -10), P(80, 10)), { w: 2.2, d: d + 700, t: 400 })
  ink(g, B(P(-80, 20), P(-40, 30), P(0, 20), P(40, 36)), { w: 2.2, d: d + 800, t: 400 })
  ink(g, B(P(-90, -30), P(-70, -10), P(-90, 10), P(-60, 20)), { w: 2, d: d + 850, t: 300 })
  ink(g, B(P(-20, -60), P(-10, -30), P(-30, -20), P(-20, 30)), { w: 2, d: d + 900, t: 300 })
  ink(g, B(P(40, -90), P(30, -60), P(60, -50), P(40, -20)), { w: 2, d: d + 950, t: 300 })
  ink(g, B(P(90, -30), P(70, -10), P(100, 10), P(60, 30)), { w: 2, d: d + 1000, t: 300 })
  ink(g, B(P(-60, 50), P(-40, 40), P(-30, 60), P(-20, 50)), { w: 2, d: d + 1050, t: 300 })
  ink(g, B(P(60, 50), P(70, 70), P(90, 76), P(100, 96)), { w: 3, d: d + 900, t: 300 })
}

/** Liegende Figur, Kopf bei (x, y), Körper nach rechts */
export function lie(g: Element, x: number, y: number, s = 1, pose: 'back' | 'curl' | 'free' = 'back', d = 0): SVGGElement {
  const f = group(g)
  const io = { w: 2.4 * Math.max(0.8, Math.min(1.4, s)), d, t: 0 }
  ink(f, E(x, y, 6 * s), io)
  if (pose === 'curl') {
    ink(f, B([x + 6 * s, y + 2 * s], [x + 26 * s, y + 6 * s], [x + 34 * s, y + 16 * s], [x + 30 * s, y + 26 * s]), io)
    ink(f, B([x + 30 * s, y + 26 * s], [x + 22 * s, y + 18 * s], [x + 14 * s, y + 18 * s], [x + 10 * s, y + 28 * s]), io)
    ink(f, B([x + 14 * s, y + 6 * s], [x + 10 * s, y + 12 * s], [x + 6 * s, y + 14 * s], [x + 2 * s, y + 12 * s]), io)
  } else {
    ink(f, L([x + 6 * s, y], [x + 40 * s, y]), io)
    ink(f, L([x + 40 * s, y], [x + 62 * s, y - 3 * s]), io)
    ink(f, L([x + 40 * s, y], [x + 62 * s, y + 3 * s]), io)
    if (pose === 'free') {
      ink(f, L([x + 12 * s, y], [x - 16 * s, y - 6 * s]), io)
      ink(f, L([x + 12 * s, y], [x - 16 * s, y + 6 * s]), io)
    } else {
      ink(f, L([x + 12 * s, y - 2 * s], [x + 30 * s, y - 4 * s]), io)
      ink(f, L([x + 12 * s, y + 2 * s], [x + 30 * s, y + 4 * s]), io)
    }
  }
  return f
}

/** Tür mit Nummer; Türblatt in Gruppe (Klasse cls, z. B. 'm3' zum Öffnen um die Angel links) */
export function door(g: Element, x: number, y: number, w: number, h: number, n: string, d = 0, cls = '', dl = 0): SVGGElement {
  ink(g, RR(x - 4, y - 4, w + 8, h + 4, 6), { w: 3, d, t: 600 })
  text(g, x + w / 2, y - 14, n, { anchor: 'middle', size: 22, d: d + 300 })
  const leaf = group(g, cls, `--${cls}: scaleX(0.14); transform-origin: ${x}px ${y}px; --dl: ${dl}ms`)
  blank(leaf, RR(x, y, w, h, 3))
  hatch(leaf, RR(x, y, w, h, 3), d + 400)
  ink(leaf, RR(x, y, w, h, 3), { w: 2.6, d: d + 200, t: 500 })
  mk('circle', { cx: x + w - 12, cy: y + h / 2, r: 4, class: 'k fade', style: `--d:${d + 600}ms` }, leaf)
  return leaf
}

/** Ziege, Füße auf y, Blick nach rechts */
export function goat(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const io = (dd: number, w = 2.6) => ({ w: w * Math.min(1.2, s), d: d + dd, t: 300 })
  const body = E(x, y - 30 * s, 26 * s, 13 * s)
  hatch(g, body, d + 400, true)
  ink(g, body, io(0))
  for (const k of [-16, -8, 12, 20]) ink(g, L(P(k, -20), P(k, 0)), io(200, 2.2))
  ink(g, B(P(22, -38), P(28, -50), P(32, -56), P(34, -58)), io(300))
  ink(g, E(x + 40 * s, y - 56 * s, 9 * s, 6 * s), io(400))
  ink(g, B(P(34, -62), P(30, -74), P(22, -76), P(18, -72)), io(500, 2.2))
  ink(g, L(P(44, -51), P(44, -42)), io(550, 2))
  ink(g, L(P(-26, -34), P(-34, -42)), io(550, 2))
}

/** Auto von der Seite, Räder auf y */
export function car(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = [P(-40, -8), P(-40, -24), P(-20, -26), P(-10, -42), P(18, -42), P(30, -26), P(42, -24), P(42, -8), P(-40, -8)]
  hatch(g, body, d + 400, true)
  ink(g, body, { w: 2.6 * Math.min(1.2, s), d, t: 600 })
  for (const k of [-22, 24]) {
    blank(g, E(x + k * s, y - 6 * s, 8 * s))
    ink(g, E(x + k * s, y - 6 * s, 8 * s), { w: 2.4, d: d + 300, t: 300 })
  }
}

/** Briefumschlag */
export function letter(g: Element, x: number, y: number, w = 70, d = 0): void {
  const h = w * 0.64
  blank(g, RR(x, y, w, h, 3))
  ink(g, RR(x, y, w, h, 3), { w: 2.4, d, t: 400 })
  ink(g, [[x + 2, y + 2], [x + w / 2, y + h * 0.55], [x + w - 2, y + 2]], { w: 2.2, d: d + 200, t: 300 })
}

/** Auge */
export function eye(g: Element, cx: number, cy: number, s = 1, d = 0, look = 0): void {
  ink(g, B([cx - 40 * s, cy], [cx - 20 * s, cy - 26 * s], [cx + 20 * s, cy - 26 * s], [cx + 40 * s, cy]), { w: 3, d, t: 400 })
  ink(g, B([cx - 40 * s, cy], [cx - 20 * s, cy + 26 * s], [cx + 20 * s, cy + 26 * s], [cx + 40 * s, cy]), { w: 3, d: d + 150, t: 400 })
  const iris = group(g, 'm1', `--m1: translateX(${look * s}px)`)
  ink(iris, E(cx, cy, 12 * s), { w: 2.6, d: d + 300, t: 300 })
  mk('circle', { cx, cy, r: 6 * s, class: 'k fade', style: `--d:${d + 500}ms` }, iris)
}
