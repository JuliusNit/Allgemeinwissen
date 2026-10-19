import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, brain, car, check, cross, dashes, fig, hatch, ink, mk, pop, rays, st, strike, text, vbars, type P } from './draw'
import { axes, bact, ball, box, clipBox, dot, drop, eyeFront, flake, flame, flow, glide, halfOnion, head, heart, knife, leaf, mapRegion, mito, mol, onion, plot, rad, rain, ripple, smooth, spin, stars, sunDisk, thermo, travelWave, tree, water, waveP, wobble } from './kit'

// Chemie: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Becherglas mit Ausguss, Skala und gewölbter Oberfläche; Boden bei y, Füllhöhe fill (0…1) */
function beaker(g: Element, x: number, y: number, w: number, h: number, fill = 0.7, d = 0, dense = false): void {
  ink(g, [[x - 6, y - h - 4], [x, y - h], [x, y - 6], ...E(x + 6, y - 6, 6, 6, 180, 90).slice(1), [x + w - 6, y], ...E(x + w - 6, y - 6, 6, 6, 90, 0).slice(1), [x + w, y - h]], { w: 3, d, t: 600 })
  for (let k = 1; k < 5; k++) ink(g, L([x + w - 4, y - (h * k) / 5], [x + w - 14, y - (h * k) / 5]), { w: 1.2, d: d + 300 + k * 40, t: 80 })
  if (fill > 0) {
    const top = y - h * fill
    hatch(g, RR(x + 3, top, w - 6, y - top - 3, 4), d + 400, dense)
    ink(g, B([x + 3, top - 3], [x + 10, top + 1], [x + w - 10, top + 1], [x + w - 3, top - 3]), { w: 1.8, d: d + 300, t: 300 })
  }
}

/** Eiswürfel räumlich (Vorderseite, Oberseite, Kante), mit Glanzstrich */
function cube(g: Element, x: number, y: number, s = 30, d = 0): void {
  const o = s * 0.3
  const top: P[] = [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s, y], [x, y]]
  const side: P[] = [[x + s, y], [x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s], [x + s, y]]
  blank(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s], [x, y + s], [x, y]])
  hatch(g, side, d + 300)
  ink(g, RR(x, y, s, s, 3), { w: 2.4, d, t: 300 })
  ink(g, top, { w: 1.8, d: d + 100, t: 200 })
  ink(g, side, { w: 1.8, d: d + 150, t: 200 })
  ink(g, [[x + 6, y + 8], [x + s * 0.45, y + 8]], { w: 1.4, d: d + 200, t: 100 })
}

/** Kerze mit Flamme, Docht oben bei (x, top): Wachsmulde, Tropfnase, glimmender Docht */
function candle(g: Element, x: number, top: number, d = 0, lit = true): void {
  const body: P[] = [[x - 26, top + 210], [x - 26, top + 14], ...B([x - 26, top + 14], [x - 14, top + 22], [x + 14, top + 22], [x + 26, top + 14]).slice(1), [x + 26, top + 210]]
  blank(g, [...body, [x - 26, top + 210]])
  ink(g, body, { w: 3, d, t: 600 })
  ink(g, E(x, top + 14, 26, 6, 180, 360), { w: 1.6, d: d + 200, t: 300 })
  ink(g, B([x + 26, top + 14], [x + 30, top + 30], [x + 26, top + 50], [x + 30, top + 60]), { w: 2, d: d + 300, t: 300 })
  hatch(g, E(x, top + 16, 18, 4), d + 400, true)
  ink(g, B([x, top + 12], [x, top + 4], [x + 2, top - 2], [x, top - 8]), { w: 2.4, d: d + 300, t: 150 })
  if (lit) {
    const fl = wobble(g, { deg: 3, ox: x, oy: top - 4, ms: 900, d: d + 900 })
    flame(fl, x, top - 4, 0.9, d + 500)
  }
}

/** Seebecken im Querschnitt: Ufer mit Schilf, Erdreich schraffiert, Wasserlinie bei y 400 */
function lakeBed(g: Element, d = 0): void {
  const prof = smooth([[20, 400], [50, 400], [80, 422], [110, 500], [160, 586], [220, 598], [270, 562], [300, 470], [318, 410], [340, 400]], 3)
  hatch(g, [...prof, [340, 650], [20, 650]], d + 400, true)
  ink(g, prof, { w: 3, d, t: 800 })
  ink(g, waveP(56, 314, 400, 2, 24), { w: 1.4, d: d + 300, t: 600 })
  for (const [x, h] of [[30, 46], [38, 58], [46, 40], [326, 50], [334, 38]] as const) {
    const w = wobble(g, { deg: 4, ox: x, oy: 400, ms: 2000 + x * 7, d: d + 900 })
    ink(w, B([x, 400], [x - 2, 400 - h / 2], [x + 3, 400 - h * 0.8], [x + 1, 400 - h]), { w: 1.6, d: d + 500, t: 300 })
    ink(w, E(x + 1, 400 - h + 12, 3, 8), { w: 1.8, d: d + 700, t: 150 })
  }
}

/** Rostiger Nagel waagerecht: Kopf bei x, Spitze rechts (≈ 260·s lang), Rostflecken und raue Kanten */
function rustyNail(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const shank: P[] = [P(6, -10), P(220, -10), P(262, 0), P(220, 10), P(6, 10), P(6, -10)]
  blank(g, shank)
  ink(g, shank, { w: 2.8, d, t: 700 })
  ink(g, L(P(10, -4), P(210, -4)), { w: 0.9, d: d + 300, t: 400 })
  for (let k = 0; k < 4; k++) ink(g, L(P(20 + k * 6, -10), P(16 + k * 6, 10)), { w: 0.9, d: d + 400, t: 60 })
  blank(g, E(x, y, 8 * s, 28 * s))
  ink(g, E(x, y, 8 * s, 28 * s), { w: 2.8, d: d + 200, t: 400 })
  ink(g, E(x + 3 * s, y, 4 * s, 22 * s, -90, 90), { w: 1.2, d: d + 300, t: 200 })
  for (const [a, r, b] of [[60, 12, 2], [110, 18, -2], [170, 10, 3], [208, 8, 0]] as const) {
    const sp: P[] = smooth(Array.from({ length: 9 }, (_, k) => [x + (a + Math.cos(rad(k * 45)) * r * (1 + (k % 3) * 0.25)) * s, y + (b + Math.sin(rad(k * 45)) * 8) * s] as P), 3)
    hatch(g, sp, d + 600 + a, true)
    ink(g, sp, { w: 1, d: d + 500 + a, t: 150 })
  }
  for (const a of [96, 124, 180]) ink(g, [P(a, 10), P(a + 3, 15), P(a + 7, 11)], { w: 1.2, d: d + 700, t: 60 })
  hatch(g, E(x, y + 6 * s, 6 * s, 14 * s), d + 700, true)
}

/** Grenze Eis/Schmelzwasser: unten geordnetes Gitter, darüber ungeordnete Moleküle */
function iceFilm(g: Element, d = 0): void {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) water(g, 40 + c * 47 + (r % 2) * 23, 556 + r * 36, 0.75, (r % 2) * 60, d + (r * 7 + c) * 25)
  for (let k = 0; k < 7; k++) dashes(g, L([40 + k * 47, 556], [63 + k * 47, 592]), { w: 0.9, d: d + 500, dash: 3, gap: 3 })
  hatch(g, [[20, 536], [340, 536], [340, 650], [20, 650]], d + 300)
  ink(g, waveP(20, 340, 534, 3, 50), { w: 2, d: d + 200, t: 600 })
  let seed = 5
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  for (let i = 0; i < 9; i++) {
    const w = wobble(g, { dx: (rnd() - 0.5) * 10, dy: (rnd() - 0.5) * 8, ms: 500 + rnd() * 500, d: d + 800 })
    water(w, 40 + (i % 5) * 68 + rnd() * 20, 440 + Math.floor(i / 5) * 50 + rnd() * 20, 0.75, rnd() * 360, d + 400 + i * 40)
  }
}

/** Schneidebrett im Anschnitt: Oberkante bei y, Holzmaserung */
function board(g: Element, x: number, y: number, w: number, d = 0): void {
  const p = RR(x, y, w, 24, 6)
  blank(g, p)
  ink(g, p, { w: 2.8, d, t: 500 })
  ink(g, L([x + 4, y + 6], [x + w - 4, y + 6]), { w: 1.2, d: d + 200, t: 300 })
  for (let k = 0; k < 4; k++) ink(g, B([x + 20 + k * (w / 4), y + 12], [x + 40 + k * (w / 4), y + 10], [x + 60 + k * (w / 4), y + 16], [x + 80 + k * (w / 4), y + 13]), { w: 0.8, d: d + 300 + k * 50, t: 150 })
}

/** Zwiebelhaut-Zellen (je 104 × 72) an den Ecken oben links, beschnitten auf die Bühne: Wand, Kern,
 *  Vakuole mit Schwefelstoffen (Punkte), Enzym im Zellplasma am Rand (Haken) */
function clipCells(g: Element, cells: [number, number][], d = 0): void {
  const cg = clipBox(g, 20, 300, 320, 340)
  cells.forEach(([x, y], i) => {
    const dd = d + i * 60
    ink(cg, RR(x, y, 104, 72, 6), { w: 2.4, d: dd, t: 300 })
    ink(cg, RR(x + 4, y + 4, 96, 64, 4), { w: 0.9, d: dd + 100, t: 300 })
    const vac: P[] = smooth([[x + 30, y + 14], [x + 70, y + 12], [x + 92, y + 24], [x + 90, y + 52], [x + 60, y + 60], [x + 28, y + 56], [x + 22, y + 34], [x + 30, y + 14]], 3)
    hatch(cg, vac, dd + 300)
    ink(cg, vac, { w: 1.4, d: dd + 200, t: 300 })
    for (let k = 0; k < 4; k++) dot(cg, x + 42 + (k % 2) * 22, y + 28 + Math.floor(k / 2) * 16, 2.6, dd + 400)
    ink(cg, E(x + 14, y + 36, 7, 10), { w: 1.4, d: dd + 250, t: 200 })
    hatch(cg, E(x + 14, y + 36, 7, 10), dd + 350, true)
    for (const [ex, ey] of [[x + 50, y + 8], [x + 96, y + 40], [x + 46, y + 64]] as const) ink(cg, [[ex - 3, ey - 2], [ex, ey + 2], [ex + 3, ey - 2]], { w: 1.4, d: dd + 500, t: 80 })
  })
}

/** Tränenreizstoff (Propanthial-S-oxid): drei Kohlenstoffe, Schwefel, Sauerstoff */
function tearGas(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): [number, number] => [x + a * s, y + b * s]
  mol(g, [[...P(0, 0), 'C'], [...P(26, -16), 'C'], [...P(52, 0), 'C'], [...P(80, -16), 'S', 'dicht'], [...P(106, 0), 'O', 'hell'], [...P(-14, -12), 'H'], [...P(-14, 12), 'H'], [...P(52, 22), 'H']], [[0, 1], [1, 2], [2, 3, true], [3, 4], [0, 5], [0, 6], [2, 7]], s, d)
}

/** Wühlmaus von der Seite, Kopf nach links */
function mouse(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body = [...B(P(-40, 0), P(-30, -24), P(10, -30), P(30, -14)), ...B(P(30, -14), P(40, -4), P(34, 12), P(10, 14)).slice(1), ...B(P(10, 14), P(-20, 16), P(-36, 10), P(-40, 0)).slice(1)]
  blank(g, body)
  hatch(g, body, d + 300)
  ink(g, body, { w: 2.4, d, t: 500 })
  ink(g, E(x - 22 * s, y - 20 * s, 7 * s, 8 * s), { w: 1.8, d: d + 200, t: 200 })
  blank(g, E(x - 30 * s, y - 6 * s, 3 * s))
  dot(g, x - 30 * s, y - 6 * s, 2 * s, d + 300)
  for (const k of [-1, 1]) ink(g, L(P(-40, 0), P(-52, k * 4 - 2)), { w: 0.9, d: d + 400, t: 80 })
  ink(g, B(P(36, 4), P(56, 10), P(64, -4), P(80, 0)), { w: 1.6, d: d + 400, t: 200 })
  for (const a of [-20, 14]) ink(g, L(P(a, 13), P(a - 4, 20)), { w: 1.8, d: d + 300, t: 80 })
}

/** kleines offenes Auge (Lider, Iris, Pupille) */
function eyeMini(g: Element, x: number, y: number, d = 0): void {
  ink(g, B([x - 12, y], [x - 6, y - 8], [x + 6, y - 8], [x + 12, y]), { w: 1.8, d, t: 150 })
  ink(g, B([x - 12, y], [x - 6, y + 6], [x + 6, y + 6], [x + 12, y]), { w: 1.2, d: d + 50, t: 150 })
  ink(g, E(x, y - 1, 5), { w: 1.2, d: d + 100, t: 100 })
  dot(g, x, y - 1, 2.4, d + 150)
}

/** Seifenmolekül: Kopf (Kreis) + Schwanz (Zickzack) ab (x, y) in Richtung deg */
function soap(g: Element, x: number, y: number, deg: number, len = 40, d = 0): void {
  const a = rad(deg)
  const nx = -Math.sin(a)
  const ny = Math.cos(a)
  const pts: P[] = []
  for (let i = 0; i <= 6; i++) {
    const t = 7 + (i / 6) * len
    pts.push([x + Math.cos(a) * t + nx * (i % 2 ? 4 : -4), y + Math.sin(a) * t + ny * (i % 2 ? 4 : -4)])
  }
  ink(g, pts, { w: 1.8, d: d + 100, t: 200 })
  ball(g, x, y, 6, { d, fill: 'dicht', w: 1.6, t: 0 })
}

/** Seifenblase: Haut, Schillerbänder, gespiegeltes Fenster als Glanzlicht */
function bubble3(g: Element, x: number, y: number, r: number, d = 0): void {
  blank(g, E(x, y, r))
  ink(g, E(x, y, r), { w: 2.4, d, t: 600 })
  ink(g, E(x, y, r * 0.9, r * 0.9, 110, 200), { w: 1.2, d: d + 300, t: 300 })
  dashes(g, E(x, y, r * 0.8, r * 0.8, 120, 180), { w: 1, d: d + 400, dash: 3, gap: 3 })
  ink(g, E(x, y, r * 0.88, r * 0.88, 20, 70), { w: 1, d: d + 350, t: 200 })
  const wx = x - r * 0.5
  const wy = y - r * 0.5
  const s = r * 0.22
  ink(g, RR(wx - s, wy - s, s * 2, s * 1.6, s * 0.3), { w: 1.4, d: d + 500, t: 200 })
  ink(g, L([wx, wy - s], [wx, wy + s * 0.6]), { w: 1, d: d + 550, t: 100 })
  ink(g, E(x + r * 0.55, y + r * 0.55, r * 0.06), { w: 1.4, d: d + 600, t: 100 })
}

/** Seifenmolekül groß: Carboxylat-Kopf (C, zwei O, Ladung) links bei (x, y), Kohlenwasserstoffschwanz nach rechts */
function soapBig(g: Element, x: number, y: number, len = 260, d = 0): void {
  const n = 16
  const pts: P[] = []
  for (let i = 0; i <= n; i++) pts.push([x + 24 + (i / n) * len, y + (i % 2 ? -10 : 10)])
  ink(g, [[x, y], ...pts], { w: 2.2, d: d + 300, t: 900 })
  pts.forEach(([px, py], i) => {
    if (i === 0) return
    const s = i % 2 ? -1 : 1
    ink(g, L([px, py], [px - 4, py + s * 14]), { w: 1, d: d + 500 + i * 30, t: 60 })
    ink(g, L([px, py], [px + 4, py + s * 14]), { w: 1, d: d + 500 + i * 30, t: 60 })
  })
  ink(g, L([x - 6, y - 4], [x - 22, y - 30]), { w: 1.8, d: d + 100, t: 100 })
  ink(g, L([x + 2, y - 6], [x - 14, y - 32]), { w: 1.8, d: d + 100, t: 100 })
  ink(g, L([x - 6, y + 6], [x - 22, y + 30]), { w: 1.8, d: d + 100, t: 100 })
  ball(g, x, y, 11, { d, fill: 'leer', w: 2, t: 200 })
  ball(g, x - 22, y - 34, 10, { d: d + 150, fill: 'dicht', w: 2, t: 200 })
  ball(g, x - 22, y + 34, 10, { d: d + 150, fill: 'dicht', w: 2, t: 200 })
}

/** Hand von der Seite, Fingerspitzen oben; dir −1 = linke Hand (Außenkante links), +1 = rechte */
function palm(g: Element, x: number, y: number, dir: number, d = 0): void {
  const P = (a: number, b: number): P => [x + dir * a, y + b]
  const o: P[] = [P(0, 130), P(0, -104), ...B(P(0, -104), P(2, -118), P(-20, -122), P(-26, -106)).slice(1), ...B(P(-26, -106), P(-32, -60), P(-36, -30), P(-36, -14)).slice(1), ...B(P(-36, -14), P(-60, -4), P(-62, 26), P(-40, 40)).slice(1), P(-36, 130)]
  blank(g, o)
  ink(g, o, { w: 2.6, d, t: 600 })
  for (const a of [-8, -16, -24]) ink(g, B(P(a, -100), P(a - 1, -80), P(a - 2, -60), P(a - 3, -40)), { w: 1, d: d + 300, t: 200 })
  ink(g, B(P(-24, -118), P(-26, -112), P(-26, -104), P(-22, -100)), { w: 1.4, d: d + 400, t: 100 })
  ink(g, B(P(-36, -10), P(-44, 4), P(-44, 20), P(-38, 30)), { w: 1.2, d: d + 400, t: 150 })
  ink(g, L(P(-2, 110), P(-34, 112)), { w: 1, d: d + 500, t: 150 })
  hatch(g, [P(-36, 116), P(-36, 130), P(0, 130), P(0, 116)], d + 500)
}

/** Popcorn-Korn im Schnitt: Schale (doppelte Linie), Stärkezellen, Keimling, Spitze unten */
function kernel(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const shape = (k: number): P[] => [...B(P(0, -60 * k), P(52 * k, -58 * k), P(50 * k, 20 * k), P(14 * k, 56 * k)), P(-14 * k, 56 * k), ...B(P(-14 * k, 56 * k), P(-50 * k, 20 * k), P(-52 * k, -58 * k), P(0, -60 * k)).slice(1)]
  const o = shape(1)
  blank(g, o)
  ink(g, o, { w: 3.6 * Math.min(1, s), d, t: 800 })
  ink(g, shape(0.9), { w: 1.2, d: d + 200, t: 800 })
  hatch(g, [...o, ...shape(0.9).reverse()], d + 500, true)
  const cap: P[] = [P(-12, 56), P(12, 56), P(8, 66), P(-8, 66), P(-12, 56)]
  hatch(g, cap, d + 600, true)
  ink(g, cap, { w: 1.6, d: d + 500, t: 150 })
  const germ: P[] = [...B(P(-10, 50), P(-26, 30), P(-20, 6), P(-6, 4)), ...B(P(-6, 4), P(6, 10), P(6, 34), P(-10, 50)).slice(1)]
  hatch(g, germ, d + 700)
  ink(g, germ, { w: 1.4, d: d + 600, t: 200 })
  if (s >= 0.8) for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const x = -30 + c * 18 + (r % 2) * 9
    const y = -40 + r * 16
    if (Math.abs(x) > 36 - r * 2) continue
    ink(g, Array.from({ length: 7 }, (_, k) => P(x + Math.cos(rad(k * 60)) * 7, y + Math.sin(rad(k * 60)) * 6)), { w: 0.8, d: d + 700 + (r * 4 + c) * 20, t: 60 })
  }
}

/** Aufgepopptes Korn: unregelmäßige Lappen mit Falten, unten ein Stück Schale */
function puff(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  let seed = Math.round(cx * 7 + cy * 3)
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  const n = 9
  const rs = Array.from({ length: n }, () => 22 + rnd() * 12)
  const pts: P[] = []
  for (let k = 0; k < n; k++) {
    const a0 = rad(k * (360 / n))
    const a1 = rad((k + 1) * (360 / n))
    const m = (a0 + a1) / 2
    const r0 = rs[k] * s
    const r1 = rs[(k + 1) % n] * s
    const rm = Math.max(r0, r1) * 1.45
    pts.push(...B([cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0], [cx + Math.cos(m - 0.32) * rm, cy + Math.sin(m - 0.32) * rm], [cx + Math.cos(m + 0.32) * rm, cy + Math.sin(m + 0.32) * rm], [cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1]).slice(k ? 1 : 0))
  }
  blank(g, pts)
  ink(g, pts, { w: 2.6, d, t: 700 })
  if (s >= 0.7) for (let k = 0; k < n; k += 2) {
    const a = rad(k * (360 / n) + 6)
    const r = rs[k] * s
    ink(g, B([cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3], [cx + Math.cos(a + 0.3) * r * 0.6, cy + Math.sin(a + 0.3) * r * 0.6], [cx + Math.cos(a - 0.1) * r * 0.8, cy + Math.sin(a - 0.1) * r * 0.8], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]), { w: 1.1, d: d + 400 + k * 40, t: 150 })
  }
  const hull: P[] = [[cx - 10 * s, cy + 26 * s], [cx + 6 * s, cy + 30 * s], [cx + 2 * s, cy + 38 * s], [cx - 12 * s, cy + 34 * s], [cx - 10 * s, cy + 26 * s]]
  blank(g, hull)
  hatch(g, hull, d + 600, true)
  ink(g, hull, { w: 1.4, d: d + 500, t: 150 })
}

export const AHA_CHEMIE: Bite[] = [
  {
    id: 'eis-schwimmt',
    area: 'CHE',
    day: 2,
    hook: 'Warum schwimmt Eis – obwohl fast alles andere im festen Zustand sinkt?',
    mood: 'ruhig',
    ambience: 'wellen',
    images: [],
    draw: {
      glas(g) {
        beaker(g, 100, 420, 160, 300, 0.75)
        const a = wobble(g, { dy: 4, ms: 2600, d: 900 })
        cube(a, 130, 190, 40, 700)
        const b = wobble(g, { dy: -4, ms: 2200, d: 1000 })
        cube(b, 190, 196, 36, 800)
        for (let k = 0; k < 4; k++) flow(g, L([140 + k * 24, 400], [146 + k * 24, 240]), { n: 1, ms: 2600 + k * 300, d: 1200 + k * 200, r: 2, kind: 'ring' })
      },
      wachs(g) {
        beaker(g, 50, 600, 110, 200, 0.75, 0)
        blank(g, RR(70, 560, 40, 36, 4))
        hatch(g, RR(70, 560, 40, 36, 4), 600, true)
        ink(g, RR(70, 560, 40, 36, 4), { w: 2.4, d: 500, t: 300 })
        arrow(g, L([90, 500], [90, 548]), { w: 1.6, d: 900, t: 200, head: 6 })
        beaker(g, 200, 600, 110, 200, 0.75, 300)
        cube(g, 236, 436, 38, 900)
        arrow(g, L([255, 500], [255, 470]), { w: 1.6, d: 1100, t: 200, head: 6 })
        text(g, 105, 640, 'Wachs', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 255, 640, 'Eis', { anchor: 'middle', cls: 's', d: 1100 })
      },
      dichte(g) {
        vbars(g, [
          { label: 'Wasser', v: 1, fmt: (v) => `${v.toFixed(2).replace('.', ',')} kg/l`, dense: true },
          { label: 'Eis', v: 0.92, fmt: (v) => `${v.toFixed(2).replace('.', ',')} kg/l` },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        // Messbecher: gleiche Masse, Eis braucht mehr Platz
        dashes(g, L([60, 350], [330, 350]), { w: 1, d: 1300, dash: 4, gap: 4 })
      },
      molekuel(g) {
        for (const a of [38, 142]) dashes(g, L([180, 440], [180 + Math.cos(rad(a)) * 116, 440 + Math.sin(rad(a)) * 116]), { w: 1, d: 700, dash: 4, gap: 3 })
        water(g, 180, 440, 3.2, 0)
        ink(g, E(180, 440, 106, 106, 38, 142), { w: 2, d: 800, t: 400 })
        text(g, 180, 576, '104,5°', { anchor: 'middle', size: 20, d: 1000 })
        text(g, 180, 447, 'O', { anchor: 'middle', size: 20, cls: 'halo', d: 900 })
        for (const a of [38, 142]) text(g, 180 + Math.cos(rad(a)) * 70, 440 + Math.sin(rad(a)) * 70 + 6, 'H', { anchor: 'middle', size: 16, d: 950 })
      },
      ladung(g) {
        water(g, 180, 440, 3.2, 0)
        // Elektronenwolke zum Sauerstoff hin verschoben
        dashes(g, E(180, 430, 70, 56), { w: 1.2, d: 600, dash: 4, gap: 4 })
        text(g, 180, 350, 'δ−', { anchor: 'middle', size: 24, d: 800 })
        text(g, 80, 560, 'δ+', { anchor: 'middle', size: 22, d: 1000 })
        text(g, 280, 560, 'δ+', { anchor: 'middle', size: 22, d: 1000 })
        for (const a of [38, 142]) {
          const p = L([180 + Math.cos(rad(a)) * 66, 440 + Math.sin(rad(a)) * 66], [180 + Math.cos(rad(a)) * 22, 440 + Math.sin(rad(a)) * 22])
          flow(g, p, { n: 2, ms: 1200, d: 1300, r: 1.6 })
        }
      },
      bruecken(g) {
        const mols: [number, number, number][] = [[90, 400, 0], [230, 380, 60], [150, 540, -40], [290, 530, 20]]
        mols.forEach(([x, y, r], i) => {
          const w = wobble(g, { dx: (i % 2 ? 3 : -3), dy: 2, ms: 700 + i * 90, d: 1200 })
          water(w, x, y, 1.5, r, i * 200)
        })
        for (const [a, b] of [[[118, 420], [196, 392]], [[166, 506], [118, 440]], [[250, 410], [276, 500]], [[198, 548], [258, 540]]] as const) dashes(g, L(a as P, b as P), { w: 1.6, d: 1000, dash: 5, gap: 5 })
      },
      fluessig(g) {
        let seed = 3
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
          const w = wobble(g, { dx: (rnd() - 0.5) * 12, dy: (rnd() - 0.5) * 12, ms: 500 + rnd() * 500, d: 1000 })
          water(w, 50 + c * 64 + rnd() * 10, 360 + r * 64 + rnd() * 10, 1, rnd() * 360, (r * 5 + c) * 40)
        }
      },
      gitter(g) {
        const R = 34
        const hexes: P[] = []
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) hexes.push([60 + c * R * 1.732 + (r % 2) * R * 0.866, 380 + r * R * 1.5])
        const seen = new Set<string>()
        hexes.forEach(([cx, cy], i) => {
          for (let k = 0; k < 6; k++) {
            const a = [cx + Math.cos(rad(k * 60 + 30)) * R, cy + Math.sin(rad(k * 60 + 30)) * R] as P
            const b = [cx + Math.cos(rad(k * 60 + 90)) * R, cy + Math.sin(rad(k * 60 + 90)) * R] as P
            const key = [a, b].map((p) => p.map((v) => Math.round(v)).join(',')).sort().join('|')
            if (seen.has(key)) continue
            seen.add(key)
            dashes(g, L(a, b), { w: 1.4, d: i * 80, dash: 4, gap: 3 })
          }
        })
        hexes.forEach(([cx, cy], i) => {
          for (let k = 0; k < 6; k += 2) water(g, cx + Math.cos(rad(k * 60 + 30)) * R, cy + Math.sin(rad(k * 60 + 30)) * R, 0.55, k * 60, 600 + i * 60)
        })
        const hole = st(g, 'x1', `--o: ${hexes[5][0]}px ${hexes[5][1]}px`)
        ink(hole, E(hexes[5][0], hexes[5][1], 14), { w: 1.6, t: 0 })
        ripple(hole, hexes[5][0], hexes[5][1], 6, 18, { n: 2, ms: 1600, w: 1 })
      },
      eislauf(g) {
        // Schlittschuh auf Eis; im Ausschnitt die dünne, flüssigkeitsähnliche Schicht
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, RR(20, 562, 320, 60, 2), 300)
        ink(g, L([20, 556], [340, 556]), { w: 1.4, d: 700, t: 500 })
        const sk = glide(g, 60, 0, { ms: 3000, d: 900, loop: true })
        const boot: P[] = smooth([[100, 530], [100, 480], [130, 470], [160, 480], [200, 500], [240, 510], [244, 530], [100, 530]], 3)
        blank(sk, boot)
        ink(sk, boot, { w: 2.6, d: 300, t: 500 })
        for (let k = 0; k < 4; k++) ink(sk, L([120 + k * 10, 484 + k * 2], [132 + k * 10, 482 + k * 2]), { w: 1, d: 700, t: 80 })
        ink(sk, L([90, 548], [250, 548]), { w: 3, d: 600, t: 300 })
        ink(sk, B([90, 548], [84, 548], [80, 540], [86, 534]), { w: 2.4, d: 700, t: 100 })
        for (const x of [130, 220]) ink(sk, L([x, 530], [x, 548]), { w: 2.4, d: 700, t: 150 })
        flow(g, L([40, 556], [320, 556]), { n: 4, ms: 3000, d: 1200, r: 1.6 })
      },
      flocke(g) {
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60 - 90)
          ink(g, L([180, 470], [180 + Math.cos(a) * 130, 470 + Math.sin(a) * 130]), { w: 3, d: k * 120, t: 400 })
          for (const t of [0.35, 0.6, 0.82]) {
            const m: P = [180 + Math.cos(a) * 130 * t, 470 + Math.sin(a) * 130 * t]
            for (const s of [-1, 1]) ink(g, L(m, [m[0] + Math.cos(a + s * 0.9) * 32 * (1.2 - t), m[1] + Math.sin(a + s * 0.9) * 32 * (1.2 - t)]), { w: 1.8, d: 700 + k * 80, t: 150 })
          }
        }
        const hx: P[] = Array.from({ length: 7 }, (_, k) => [180 + Math.cos(rad(k * 60 - 90)) * 22, 470 + Math.sin(rad(k * 60 - 90)) * 22])
        hatch(g, hx, 1300, true)
        ink(g, hx, { w: 2, d: 1200, t: 300 })
      },
      see(g) {
        // Querschnitt durch einen See im Winter: Ufer, Schilf, Schichtung bis 4 °C am Grund
        lakeBed(g, 0)
        for (const [y, l, d] of [[432, '0 °C', 700], [492, '2 °C', 850], [556, '4 °C', 1000]] as const) {
          dashes(g, L([110 + (y - 432) * 0.5, y - 14], [290 - (y - 432) * 0.4, y - 14]), { w: 0.9, d, dash: 3, gap: 6 })
          text(g, y > 540 ? 180 : 200, y, l, { anchor: 'middle', cls: 's', d })
        }
        const ice = st(g, 'x1', '--o: 180px 400px')
        hatch(ice, [[44, 392], [316, 392], [306, 406], [56, 406]], 0, true)
        ink(ice, [[44, 392], [316, 392], [306, 406], [56, 406], [44, 392]], { w: 2.4, t: 0 })
        for (const x of [80, 150, 230, 290]) flake(ice, x, 360, 7, 0)
        const fish = st(g, 'x2', '--o: 220px 520px')
        const fw = wobble(fish, { dx: -14, ms: 3200, d: 0 })
        const body: P[] = smooth([[188, 522], [204, 510], [230, 508], [252, 518], [256, 524], [238, 534], [208, 534], [188, 522]], 3)
        blank(fw, body)
        hatch(fw, body, 0)
        ink(fw, body, { w: 2.2, t: 0 })
        ink(fw, [[190, 522], [174, 510], [178, 522], [174, 536], [190, 522]], { w: 2, t: 0 })
        ink(fw, B([222, 512], [226, 504], [236, 504], [240, 512]), { w: 1.6, t: 0 })
        blank(fw, E(246, 518, 3))
        dot(fw, 246, 518, 1.6, 0)
        const plant = st(g, 'x2', '--o: 256px 580px')
        for (const [x, h] of [[248, 34], [256, 44], [264, 30]] as const) {
          const w = wobble(plant, { deg: 6, ox: x, oy: 580, ms: 2400 + x * 10, d: 0 })
          ink(w, B([x, 580], [x - 8, 580 - h / 3], [x + 8, 580 - (2 * h) / 3], [x, 580 - h]), { w: 1.6, t: 0 })
        }
      },
      tiefsee(g) {
        // Gedankenexperiment: sinkendes Eis füllt den See vom Grund her
        lakeBed(g, 0)
        const layers: P[][] = [
          [[150, 588], [250, 588], [230, 598], [172, 598]],
          [[124, 560], [270, 560], [254, 588], [146, 588]],
          [[104, 526], [288, 526], [272, 560], [124, 560]],
        ]
        layers.forEach((p, i) => {
          hatch(g, p, 900 + i * 500, true)
          ink(g, [...p, p[0]], { w: 1.8, d: 800 + i * 500, t: 300 })
        })
        for (let k = 0; k < 4; k++) {
          const c = glide(g, 0, 110, { ms: 1800, d: 400 + k * 400 })
          cube(c, 110 + k * 40, 400, 24, 300 + k * 400)
        }
        ink(g, smooth([[200, 470], [214, 460], [236, 460], [250, 470], [236, 480], [214, 480], [200, 470]], 3), { w: 1.8, d: 1400, t: 300 })
        ink(g, [[200, 470], [188, 462], [188, 478], [200, 470]], { w: 1.6, d: 1500, t: 200 })
        cross(g, 225, 470, 0.5, 2200)
      },
      flasche(g) {
        const b: P[] = [[150, 340], [150, 380], [120, 420], [120, 600], [240, 600], [240, 420], [210, 380], [210, 340]]
        hatch(g, [[124, 440], [236, 440], [236, 596], [124, 596]], 500)
        ink(g, b, { w: 3, t: 800 })
        ink(g, RR(146, 326, 68, 16, 3), { w: 2.2, d: 300, t: 200 })
        ink(g, [[200, 470], [214, 500], [204, 520], [226, 560]], { w: 2.4, d: 1000, t: 300 })
        ink(g, [[150, 450], [140, 490], [156, 520]], { w: 2, d: 1100, t: 300 })
        for (const [a, c] of [[[110, 500], [90, 500]], [[250, 500], [270, 500]]] as const) arrow(g, L(a as P, c as P), { w: 2.2, d: 1200, t: 200, head: 8 })
        thermo(g, 300, 380, 80, 0.1, 600)
      },
      fels(g) {
        const rock: P[] = [[40, 600], [60, 420], [140, 380], [240, 390], [320, 440], [330, 600], [40, 600]]
        hatch(g, rock, 500)
        ink(g, rock, { w: 3, t: 900 })
        const crack: P[] = [[176, 382], [186, 382], [200, 500], [178, 600], [170, 600], [186, 500], [176, 382]]
        blank(g, crack)
        hatch(g, crack, 900, true)
        ink(g, [[180, 384], [194, 500], [174, 600]], { w: 2.2, d: 700, t: 400 })
        for (const [a, c] of [[[176, 470], [140, 470]], [[196, 470], [232, 470]]] as const) arrow(g, L(a as P, c as P), { w: 2.4, d: 1100, t: 200, head: 8 })
        flake(g, 290, 340, 12, 1300)
      },
      eisberg(g) {
        // Eisberg: nur die Spitze ragt aus dem Wasser
        ink(g, waveP(20, 340, 400, 4, 60), { w: 2.4, t: 700 })
        const berg: P[] = [[120, 400], [150, 340], [190, 330], [220, 400], [270, 470], [260, 600], [180, 640], [90, 600], [80, 480], [120, 400]]
        blank(g, berg)
        hatch(g, berg.filter(([, y]) => y >= 400).concat([[120, 400]]), 900)
        ink(g, berg, { w: 3, d: 300, t: 900 })
        ink(g, [[150, 340], [170, 380], [176, 400]], { w: 1.4, d: 800, t: 200 })
        const sh = wobble(g, { dx: 20, ms: 6000, d: 600 })
        ink(sh, RR(280, 380, 40, 14, 4), { w: 1.8, d: 600, t: 200 })
        ink(sh, L([296, 380], [296, 360]), { w: 1.4, d: 700, t: 100 })
        text(g, 300, 330, '1/10', { anchor: 'middle', size: 18, d: 1200 })
        text(g, 310, 560, '9/10', { anchor: 'middle', size: 18, d: 1300 })
      },
      ende(g) {
        beaker(g, 110, 600, 140, 200, 0.75)
        const w = wobble(g, { dy: 4, ms: 2600, d: 900 })
        cube(w, 160, 434, 40, 700)
      },
      stoffe(g) {
        // Ausschnitt aus dem Periodensystem: Hauptgruppen 13–15
        const rows = [['B', 'C', 'N'], ['Al', 'Si', 'P'], ['Ga', 'Ge', 'As'], ['In', 'Sn', 'Sb'], ['Tl', 'Pb', 'Bi']]
        const hit = new Set(['Si', 'Ga', 'Bi', 'Ge'])
        text(g, 105, 300, '13', { anchor: 'middle', cls: 's', d: 200 })
        text(g, 185, 300, '14', { anchor: 'middle', cls: 's', d: 200 })
        text(g, 265, 300, '15', { anchor: 'middle', cls: 's', d: 200 })
        rows.forEach((r, i) => r.forEach((el, j) => {
          const x = 70 + j * 80
          const y = 316 + i * 62
          const box = RR(x, y, 70, 54, 4)
          const d = (i * 3 + j) * 70
          if (hit.has(el)) hatch(g, box, d + 900)
          ink(g, box, { w: hit.has(el) ? 2.8 : 1.4, d, t: 200 })
          text(g, x + 35, y + 36, el, { anchor: 'middle', size: 22, cls: hit.has(el) ? 'halo' : '', d: d + 200 })
        }))
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { glas: {} } },
      { t: T('Die meisten Stoffe ziehen sich beim Erstarren zusammen. Ein Stück festes Wachs **sinkt** in flüssigem Wachs.', 64), gfx: { wachs: {} } },
      { t: T('Bei Wasser ist es umgekehrt: Eis ist rund **neun Prozent** leichter als flüssiges Wasser – darum schwimmt es oben.', 64), gfx: { dichte: {} } },
      { t: T('Der Grund steckt im Molekül: ein Sauerstoff-Atom, zwei Wasserstoff-Atome – nicht in einer Linie, sondern **gewinkelt**.', 64), gfx: { molekuel: {} } },
      { t: T('Der Sauerstoff zieht die Elektronen an sich. Er wird leicht **negativ**, die beiden Wasserstoffe leicht positiv.', 64), gfx: { ladung: {} } },
      { t: T('Darum ziehen sich Wassermoleküle an: Plus zu Minus. Diese lockeren Bindungen heißen **Wasserstoffbrücken**.', 64), gfx: { bruecken: {} } },
      { t: T('Im flüssigen Wasser bilden und lösen sie sich ständig. Die Moleküle **drängeln** sich dicht aneinander.', 64), gfx: { fluessig: {} } },
      { t: T('Beim Gefrieren rastet jedes Molekül in ein festes Gitter ein: **Sechsecke** mit viel freiem Raum in der Mitte.', 64), gfx: { gitter: {} } },
      { t: T('Dieses Gitter braucht **mehr Platz** als die drängelnde Flüssigkeit. Gleiche Masse, mehr Volumen – Eis ist leichter.', 64), gfx: { gitter: { cls: 'a1' } } },
      { t: T('Wasser ist damit eine große Ausnahme. Nur wenige Stoffe dehnen sich beim Erstarren aus – etwa **Silizium**, Gallium und Bismut.', 64), gfx: { stoffe: {} } },
      { t: T('Die Sechsecke siehst du sogar mit bloßem Auge: Jede **Schneeflocke** hat sechs Arme.', 64), gfx: { flocke: {} } },
      { t: T('Am dichtesten ist Wasser übrigens bei **4 Grad**. Darum hat der Grund tiefer Seen im Winter etwa 4 Grad.', 64), gfx: { see: {} } },
      { t: T('Kälteres Wasser bleibt oben und gefriert an der **Oberfläche**. Das Eis isoliert wie ein Deckel.', 64), gfx: { see: { cls: 'a1' } } },
      { t: T('So frieren Seen nicht von unten zu – Fische und Pflanzen **überwintern** im flüssigen Wasser darunter.', 64), gfx: { see: { cls: 'a1 a2' } } },
      { t: T('Würde Eis sinken, könnten sich Gewässer vom Grund her mit Eis füllen. Leben im Wasser hätte es **viel schwerer**.', 64), gfx: { tiefsee: {} } },
      { t: T('Glatt ist Eis übrigens nicht wegen des Drucks der Kufen: Auf seiner Oberfläche liegt immer eine hauchdünne, **flüssigkeitsähnliche** Schicht.', 64), gfx: { eislauf: {} } },
      { t: T('Die Ausdehnung hat Kraft: Gefriert Wasser in einer geschlossenen Flasche, kann es sie **sprengen**.', 64), gfx: { flasche: {} } },
      { t: T('So sprengt Frost auch Felsen und Straßen: Wasser in Ritzen gefriert und dehnt sich aus – so entstehen **Schlaglöcher**.', 64), gfx: { fels: {} } },
      { t: T('Und Eisberge? Weil Eis nur wenig leichter ist als Meerwasser, ragt nur etwa **ein Zehntel** heraus.', 64), gfx: { eisberg: {} } },
      { t: T('Eis schwimmt, weil Wasser beim Gefrieren **Platz** schafft.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Eis ist rund 9 % leichter als flüssiges Wasser.', 'Beim Gefrieren ordnen Wasserstoffbrücken die Moleküle zu luftigen Sechsecken.', 'Darum frieren Seen von oben zu – und Frost sprengt Felsen und Flaschen.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Wasser', 'Chaplin: Water Structure and Science (London South Bank University)', 'USGS Water Science School: Ice, Snow and Glaciers'],
  },
  {
    id: 'zwiebel',
    area: 'CHE',
    day: 2,
    hook: 'Warum weinst du beim Zwiebelschneiden?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [],
    draw: {
      zwiebel(g) {
        board(g, 20, 400, 320, 0)
        onion(g, 120, 290, 1, 200)
        halfOnion(g, 250, 330, 56, 500)
        const k = wobble(g, { dy: -8, deg: -3, ox: 200, oy: 150, ms: 1400, d: 1200 })
        knife(k, 150, 130, 0.9, 900)
        const t = glide(g, 0, 60, { ms: 1800, d: 1600, loop: true })
        drop(t, 320, 200, 0.7, 1500)
      },
      ganz(g) {
        board(g, 20, 610, 320, 0)
        onion(g, 170, 490, 1.25, 300)
        const k = glide(g, -60, 0, { ms: 1600, d: 1300 })
        knife(k, 230, 320, 0.8, 1200)
      },
      zelle(g) {
        // Zwiebelhaut unterm Mikroskop: lang gestreckte Zellen, je eine große Vakuole mit Schwefelstoffen,
        // das Enzym im Zellplasma am Rand
        const cells: [number, number][] = []
        for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) cells.push([24 + c * 108 + (r % 2) * 54 - 54, 330 + r * 76])
        clipCells(g, cells, 0)
        const cut = st(g, 'x1', '--o: 180px 480px')
        ink(cut, [[150, 310], [170, 380], [160, 450], [188, 520], [176, 600], [196, 650]], { w: 4, t: 0 })
        for (const [x, y] of [[170, 400], [176, 470], [184, 560]] as const) flow(cut, L([x - 30, y], [x + 30, y + 6]), { n: 2, ms: 900, d: 200, r: 2.2 })
        ripple(cut, 178, 480, 8, 40, { n: 2, ms: 1400, d: 300, w: 1.2 })
      },
      gas(g) {
        board(g, 20, 630, 320, 0)
        halfOnion(g, 180, 560, 48, 200)
        for (let i = 0; i < 4; i++) {
          const up = glide(g, (i % 2 ? 20 : -20), -170, { ms: 3200, d: 900 + i * 700, loop: true })
          tearGas(up, 70 + i * 60, 500 - (i % 2) * 30, 0.7, 700 + i * 200)
        }
        tearGas(g, 110, 330, 1.1, 400)
      },
      auge(g) {
        eyeFront(g, 180, 430, 1.9, 0)
        for (let i = 0; i < 5; i++) flow(g, B([30 + i * 50, 650], [40 + i * 50, 580], [120 + i * 20, 540], [150 + i * 12, 470]), { n: 2, ms: 2200, d: 900 + i * 200, r: 2.2 })
        for (const [x, dd] of [[140, 1400], [208, 2200]] as const) {
          const t = glide(g, 0, 120, { ms: 1800, d: dd, loop: true })
          drop(t, x, 500, 0.45, dd - 200)
        }
        // Stoppuhr bei 30 Sekunden
        ink(g, E(300, 600, 30), { w: 2.4, d: 600, t: 400 })
        ink(g, RR(294, 560, 12, 8, 2), { w: 2, d: 700, t: 100 })
        hatch(g, [...E(300, 600, 30, 30, -90, 90), [300, 600]], 900)
        ink(g, L([300, 600], [300, 628]), { w: 2.4, d: 900, t: 200 })
        for (let k = 0; k < 12; k++) {
          const a = rad(k * 30)
          ink(g, L([300 + Math.cos(a) * 24, 600 + Math.sin(a) * 24], [300 + Math.cos(a) * 28, 600 + Math.sin(a) * 28]), { w: 1, d: 800 + k * 20, t: 60 })
        }
      },
      reflex(g) {
        // Reflexbogen: Hornhaut meldet über den Nerv ans Gehirn, das die Drüse über dem äußeren Augenwinkel anschaltet
        eyeFront(g, 150, 540, 1.3, 0)
        const gland: P[] = smooth([[196, 470], [220, 456], [252, 462], [268, 478], [256, 494], [228, 494], [204, 488], [196, 470]], 3)
        blank(g, gland)
        hatch(g, gland, 700)
        ink(g, gland, { w: 2.4, d: 500, t: 400 })
        for (const x of [212, 226, 240]) ink(g, L([x, 492], [x - 10, 512]), { w: 1.2, d: 800, t: 150 })
        brain(g, 110, 360, 0.55, 600)
        const inp = B([150, 530], [80, 500], [60, 420], [96, 380])
        dashes(g, inp, { w: 1.6, d: 900, dash: 5, gap: 4 })
        flow(g, inp, { n: 2, ms: 1200, d: 1200, r: 2.2 })
        const out = B([140, 370], [220, 360], [260, 420], [236, 462])
        dashes(g, out, { w: 1.6, d: 1300, dash: 5, gap: 4 })
        flow(g, out, { n: 2, ms: 1200, d: 1700, r: 2.2 })
        const t = glide(g, 0, 70, { ms: 1600, d: 2200, loop: true })
        drop(t, 214, 560, 0.4, 2000)
      },
      nase(g) {
        // Tränenwege: Tränenpünktchen am inneren Augenwinkel → Tränensack → Tränen-Nasen-Gang → Nase
        eyeFront(g, 110, 420, 1.1, 0)
        const nose = [...B([206, 330], [210, 420], [224, 480], [252, 540]), ...B([252, 540], [262, 560], [240, 576], [220, 568]).slice(1)]
        ink(g, nose, { w: 3, d: 300, t: 600 })
        ink(g, B([220, 568], [210, 580], [190, 578], [184, 566]), { w: 2.4, d: 600, t: 200 })
        ink(g, B([184, 566], [180, 556], [190, 548], [204, 552]), { w: 1.8, d: 700, t: 200 })
        const duct = [...B([176, 418], [186, 404], [196, 398], [200, 396]), ...B([200, 396], [204, 440], [206, 500], [200, 556]).slice(1)]
        ink(g, duct, { w: 5, d: 800, t: 500 })
        blank(g, duct)
        ink(g, B([176, 426], [186, 430], [196, 420], [200, 410]), { w: 1.6, d: 900, t: 200 })
        hatch(g, E(200, 400, 7, 14), 1000, true)
        flow(g, duct, { n: 3, ms: 1600, d: 1200, r: 2.4 })
        const t = glide(g, 0, 60, { ms: 1400, d: 2000, loop: true })
        drop(t, 196, 590, 0.4, 1800)
      },
      brille(g) {
        head(g, 180, 440, 1.5, 0, { neck: true })
        // Schwimmbrille: zwei Gläser mit Dichtrand, Steg, Band
        for (const k of [-1, 1]) {
          const gl = RR(180 + k * 42 - 30, 396, 60, 40, 18)
          blank(g, gl)
          ink(g, gl, { w: 3.4, d: 900, t: 400 })
          ink(g, RR(180 + k * 42 - 24, 402, 48, 28, 13), { w: 1.4, d: 1000, t: 300 })
          eyeMini(g, 180 + k * 42, 418, 1100)
          ink(g, B([180 + k * 72, 414], [180 + k * 90, 414], [180 + k * 100, 420], [180 + k * 104, 426]), { w: 3, d: 1100, t: 200 })
        }
        ink(g, B([168, 412], [174, 404], [186, 404], [192, 412]), { w: 2.6, d: 1000, t: 150 })
        for (let i = 0; i < 4; i++) {
          const x = 70 + i * 70
          flow(g, [...L([x, 650], [x + (i < 2 ? 40 : -40), 470]), ...L([x + (i < 2 ? 40 : -40), 470], [x + (i < 2 ? -10 : 10), 540]).slice(1)], { n: 1, ms: 2000, d: 1400 + i * 200, r: 2.4 })
        }
      },
      ruehrung(g) {
        // zwei Tropfen im Ausschnitt: Reiz-Tränen fast nur Wasser und Salz, Gefühls-Tränen mit mehr Eiweißen
        for (const [x, rich] of [[100, false], [260, true]] as const) {
          drop(g, x, 500, 3.2, rich ? 300 : 0, false)
          for (let k = 0; k < 10; k++) {
            const a = rad(k * 37)
            const r = 12 + (k % 4) * 9
            water(g, x + Math.cos(a) * r, 520 + Math.sin(a) * r, 0.22, k * 30, 600 + k * 30)
          }
          for (let k = 0; k < 4; k++) dot(g, x - 24 + k * 16, 560 - (k % 2) * 12, 2.2, 900 + k * 50)
          if (rich) for (let k = 0; k < 5; k++) {
            const px = x - 28 + k * 14
            const py = 470 + (k % 2) * 46
            ink(g, smooth([[px, py], [px + 6, py - 6], [px + 12, py], [px + 6, py + 6], [px + 14, py + 10]], 3), { w: 2, d: 1100 + k * 80, t: 200 })
          }
        }
        halfOnion(g, 100, 330, 26, 1300)
        heart(g, 260, 336, 0.8, 1400)
      },
      tipps(g) {
        // links: scharfe Klinge trennt sauber, rechts: stumpfe quetscht
        for (const [x0, sharp] of [[20, true], [190, false]] as const) {
          for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
            const x = x0 + c * 50
            const y = 460 + r * 54
            const crushed = !sharp && c === 1
            const cut = sharp && c === 1
            const p: P[] = crushed ? [[x + 4, y + 8], [x + 20, y + 2], [x + 30, y + 12], [x + 46, y + 6], [x + 40, y + 46], [x + 20, y + 40], [x + 6, y + 48], [x + 4, y + 8]] : RR(x, y, 48, 52, 8)
            if (crushed) hatch(g, p, 900)
            ink(g, p, { w: 1.6, d: 400 + (r * 3 + c) * 40, t: 200 })
            if (!crushed && !cut) dot(g, x + 34, y + 16, 3, 600 + (r * 3 + c) * 40)
          }
          const tip = sharp ? 6 : 26
          const bl: P[] = [[x0 + 74 - tip / 2 - 14, 330], [x0 + 74 + tip / 2 + 14, 330], [x0 + 74 + tip / 2, 440], [x0 + 74 - tip / 2, 440], [x0 + 74 - tip / 2 - 14, 330]]
          blank(g, bl)
          hatch(g, bl, 300, true)
          ink(g, bl, { w: 2.4, t: 400 })
          if (sharp) ink(g, L([x0 + 74, 440], [x0 + 74, 622]), { w: 2, d: 1000, t: 400 })
          else for (let k = 0; k < 3; k++) {
            const t = glide(g, 0, 40, { ms: 1400, d: 1300 + k * 300, loop: true })
            drop(t, x0 + 54 + k * 20, 600, 0.3, 1200)
          }
          if (sharp) check(g, x0 + 74, 300, 0.7, 1300)
          else cross(g, x0 + 74, 300, 0.7, 1300)
        }
      },
      kalt(g) {
        // Kühlschrank offen: Zwiebel im Fach, Reizstoff steigt kaum
        ink(g, RR(60, 300, 200, 340, 12), { w: 3, t: 700 })
        ink(g, L([60, 420], [260, 420]), { w: 2.2, d: 300, t: 300 })
        for (const y of [500, 570]) ink(g, L([70, y], [250, y]), { w: 1.4, d: 400, t: 300 })
        ink(g, [[260, 310], [330, 330], [330, 630], [260, 640]], { w: 2.6, d: 400, t: 500 })
        for (const y of [380, 460, 540]) ink(g, L([270, y], [322, y + 2]), { w: 1.4, d: 600, t: 200 })
        ink(g, RR(74, 314, 40, 8, 4), { w: 1.6, d: 500, t: 150 })
        for (const [x, y] of [[100, 360], [160, 380], [220, 350]] as const) flake(g, x, y, 9, 700)
        onion(g, 120, 470, 0.32, 800)
        halfOnion(g, 200, 534, 22, 900)
        flow(g, L([200, 520], [196, 460]), { n: 1, ms: 4000, d: 1500, r: 1.8 })
        thermo(g, 298, 440, 70, 0.15, 900)
      },
      abzug(g) {
        // Herd mit Dunstabzug: Reizstoff wird nach oben weggesaugt
        const hood: P[] = [[40, 400], [320, 400], [250, 340], [230, 340], [230, 290], [130, 290], [130, 340], [110, 340], [40, 400]]
        blank(g, hood)
        ink(g, hood, { w: 3, t: 700 })
        for (let k = 0; k < 6; k++) ink(g, L([70 + k * 44, 392], [86 + k * 44, 392]), { w: 1.4, d: 400 + k * 40, t: 100 })
        const fan = spin(g, 180, 366, 1400, 900)
        for (let k = 0; k < 4; k++) ink(fan, B([180, 366], [180 + Math.cos(rad(k * 90)) * 8, 366 + Math.sin(rad(k * 90)) * 8], [180 + Math.cos(rad(k * 90 + 40)) * 14, 366 + Math.sin(rad(k * 90 + 40)) * 14], [180 + Math.cos(rad(k * 90 + 60)) * 18, 366 + Math.sin(rad(k * 90 + 60)) * 18]), { w: 1.8, d: 700, t: 200 })
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 300, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 650], [20, 650]], 500)
        board(g, 80, 590, 200, 400)
        halfOnion(g, 180, 548, 30, 600)
        for (let i = 0; i < 5; i++) {
          const p = B([120 + i * 30, 520], [110 + i * 30, 480], [170 + i * 4, 450], [176 + i * 2, 380])
          flow(g, p, { n: 3, ms: 1800, d: 1000 + i * 150, r: 2 })
        }
      },
      tranenfrei(g) {
        ink(g, L([40, 560], [320, 560]), { w: 2.6, t: 600 })
        for (const [x, y] of [[80, '2002'], [280, '2015']] as const) {
          ink(g, L([x, 550], [x, 570]), { w: 2.4, d: 400, t: 100 })
          text(g, x, 600, y, { anchor: 'middle', size: 18, d: 500 })
        }
        beaker(g, 50, 520, 60, 110, 0.4, 600)
        tearGas(g, 80, 360, 0.7, 900)
        cross(g, 80, 360, 1.2, 1300)
        onion(g, 280, 440, 0.62, 1400)
        drop(g, 336, 340, 0.6, 1800, false)
        strike(g, [320, 320], [352, 368], 2100)
        arrow(g, L([120, 560], [240, 560]), { w: 2.4, d: 1600, t: 400, head: 9 })
      },
      knoblauch(g) {
        // Knolle mit Zehen, eine Zehe aufgeschnitten
        const P = (a: number, b: number): P => [140 + a, 470 + b]
        const bulb = [...B(P(0, -110), P(16, -60), P(100, -40), P(96, 30)), ...B(P(96, 30), P(92, 90), P(40, 104), P(0, 104)).slice(1), ...B(P(0, 104), P(-40, 104), P(-92, 90), P(-96, 30)).slice(1), ...B(P(-96, 30), P(-100, -40), P(-16, -60), P(0, -110)).slice(1)]
        blank(g, bulb)
        ink(g, bulb, { w: 3, t: 800 })
        for (const k of [-0.7, -0.35, 0, 0.35, 0.7]) ink(g, B(P(k * 10, -90), P(k * 120, -40), P(k * 120, 70), P(k * 30, 104)), { w: 1.6, d: 400, t: 500 })
        hatch(g, [...B(P(0, -110), P(16, -60), P(100, -40), P(96, 30)), ...B(P(96, 30), P(92, 90), P(40, 104), P(0, 104)).slice(1), ...B(P(24, 104), P(84, 70), P(84, -40), P(7, -90))], 700)
        for (let k = 0; k < 7; k++) ink(g, B(P((k - 3) * 6, 106), P((k - 3) * 8, 116), P((k - 3) * 6 + 2, 122), P((k - 3) * 10, 130)), { w: 1, d: 900 + k * 30, t: 150 })
        const clove: P[] = [...B([280, 470], [310, 500], [312, 580], [290, 600]), [254, 600], ...B([254, 600], [244, 560], [252, 500], [280, 470]).slice(1)]
        blank(g, clove)
        ink(g, clove, { w: 2.6, d: 900, t: 500 })
        ink(g, L([256, 540], [306, 540]), { w: 2, d: 1100, t: 200 })
        hatch(g, [[256, 542], [306, 542], [302, 596], [258, 596]], 1200, true)
        for (let i = 0; i < 3; i++) {
          const w = wobble(g, { dx: 4, ms: 1200 + i * 200, d: 1300 })
          ink(w, B([266 + i * 14, 460], [258 + i * 14, 440], [276 + i * 14, 420], [268 + i * 14, 396]), { w: 1.6, d: 1300 + i * 100, t: 300 })
        }
      },
      pfanne(g) {
        // Pfanne in Schrägsicht auf der Gasflamme, Zwiebelringe, Dampf
        ink(g, E(170, 520, 130, 40), { w: 3, t: 700 })
        ink(g, B([40, 520], [46, 560], [294, 560], [300, 520]), { w: 3, d: 200, t: 500 })
        ink(g, E(170, 524, 118, 34), { w: 1.4, d: 300, t: 500 })
        const handle: P[] = [[298, 510], [350, 486], [356, 498], [302, 528], [298, 510]]
        hatch(g, handle, 500, true)
        ink(g, handle, { w: 2.4, d: 400, t: 200 })
        for (let i = 0; i < 7; i++) {
          const x = 90 + (i % 4) * 50 + (i > 3 ? 25 : 0)
          const y = 510 + (i > 3 ? 18 : 0)
          ink(g, E(x, y, 18, 6, 180, 520), { w: 2, d: 600 + i * 60, t: 200 })
          ink(g, E(x, y, 12, 4, 180, 520), { w: 1, d: 700 + i * 60, t: 200 })
        }
        hatch(g, E(140, 528, 24, 6), 1000, true)
        for (let k = 0; k < 8; k++) {
          const fl = wobble(g, { deg: 6, ox: 100 + k * 20, oy: 600, ms: 500 + k * 60, d: 900 })
          ink(fl, B([94 + k * 20, 600], [92 + k * 20, 588], [100 + k * 20, 580], [100 + k * 20, 572]), { w: 1.8, d: 800 + k * 40, t: 150 })
          ink(fl, B([106 + k * 20, 600], [108 + k * 20, 588], [100 + k * 20, 580], [100 + k * 20, 572]), { w: 1.8, d: 800 + k * 40, t: 150 })
        }
        ink(g, L([70, 604], [270, 604]), { w: 3, d: 500, t: 300 })
        for (let i = 0; i < 3; i++) {
          const s = wobble(g, { dx: 6, ms: 1400 + i * 300, d: 1200 })
          ink(s, B([110 + i * 60, 480], [100 + i * 60, 440], [124 + i * 60, 420], [112 + i * 60, 370]), { w: 1.6, d: 1200 + i * 150, t: 400 })
        }
      },
      ende(g) {
        halfOnion(g, 150, 460, 70, 0)
        const t = glide(g, 0, 90, { ms: 2000, d: 1200, loop: true })
        drop(t, 270, 400, 1.2, 900)
      },
      wehr(g) {
        // Fraßschutz: Wühlmaus beißt in die Zwiebel im Boden, Reizgas, Maus dreht ab
        ink(g, L([20, 400], [340, 400]), { w: 3, t: 500 })
        hatch(g, [[20, 402], [340, 402], [340, 650], [20, 650]], 200)
        for (const [x, h] of [[170, 100], [182, 120], [194, 90]] as const) {
          const w = wobble(g, { deg: 4, ox: x, oy: 400, ms: 2400 + x * 9, d: 900 })
          ink(w, B([x, 400], [x - 4, 400 - h / 2], [x + 6, 400 - h * 0.8], [x + 2 * (x - 182), 400 - h]), { w: 2.4, d: 600, t: 400 })
        }
        const hole: P[] = smooth([[100, 420], [260, 416], [280, 520], [240, 600], [120, 604], [90, 520], [100, 420]], 3)
        blank(g, hole)
        onion(g, 182, 510, 0.62, 300)
        const m = glide(g, 60, 0, { ms: 900, d: 2600 })
        mouse(m, 262, 566, 1, 900)
        for (let i = 0; i < 5; i++) flow(g, L([234, 540 - i * 6], [272 + i * 6, 500 - i * 14]), { n: 2, ms: 900, d: 1800 + i * 80, r: 2 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { zwiebel: {} } },
      { t: T('Eine ganze Zwiebel riecht kaum. Erst wenn du sie **aufschneidest**, wird sie zur Tränenwaffe.', 64), gfx: { ganz: {} } },
      { t: T('In ihren Zellen lagern **schwefelhaltige** Stoffe – und getrennt davon, in anderen Kammern, ein Enzym.', 64), gfx: { zelle: {} } },
      { t: T('Das Messer zerstört die Zellwände. Enzym und Schwefelstoff **treffen sich** – eine Kettenreaktion beginnt.', 64), gfx: { zelle: { cls: 'a1' } } },
      { t: T('Ein zweites Enzym baut daraus in Sekunden ein flüchtiges Gas, den **Tränenreizstoff** – ein Schwefelmolekül mit kompliziertem Namen.', 64), gfx: { gas: {} } },
      { t: T('Es steigt auf und erreicht deine **Augen**. Nach etwa 30 Sekunden ist die Wirkung am stärksten.', 64), gfx: { auge: {} } },
      { t: T('Auf der feuchten Augenoberfläche reizt es **Schmerzsensoren**. Das Auge wehrt sich und spült mit Tränen.', 64), gfx: { auge: {} } },
      { t: T('Das Weinen ist ein **Reflex**: Nerven im Auge melden den Reiz, das Gehirn schaltet die Tränendrüse oberhalb des Auges an.', 64), gfx: { reflex: {} } },
      { t: T('Abfließen tut die Flüssigkeit über winzige Kanäle **in die Nase** – darum läuft sie beim Weinen mit.', 64), gfx: { nase: {} } },
      { t: T('Wozu das Ganze? Es ist die **Verteidigung** der Zwiebel: Wer hineinbeißt, bekommt eine Ladung Reizstoff ab.', 64), gfx: { wehr: {} } },
      { t: T('Was hilft? Ein **scharfes Messer**: Es schneidet sauber und zerquetscht weniger Zellen.', 64), gfx: { tipps: {} } },
      { t: T('**Kühlen**: Eine Zwiebel aus dem Kühlschrank gibt den Reizstoff langsamer ab.', 64), gfx: { kalt: {} } },
      { t: T('Und unter dem Dunstabzug oder bei offenem Fenster schneiden – dann **zieht** das Gas einfach ab.', 64), gfx: { abzug: {} } },
      { t: T('Am zuverlässigsten hilft eine dicht schließende **Schwimmbrille**: Dann erreicht das Gas das Auge gar nicht erst.', 64), gfx: { brille: {} } },
      { t: T('Japanische Forscher entdeckten das Tränen-Enzym 2002 – und Züchter brachten später eine fast **tränenfreie Zwiebel** auf den Markt.', 64), gfx: { tranenfrei: {} } },
      { t: T('Tränen ist übrigens nicht gleich Tränen: Reiz-Tränen sind **anders zusammengesetzt** als Tränen aus Trauer oder Rührung.', 64), gfx: { ruehrung: {} } },
      { t: T('Knoblauch hat einen ähnlichen Startstoff, aber kein Tränen-Enzym. Bei ihm entsteht **Allicin** – der typische Geruch.', 64), gfx: { knoblauch: {} } },
      { t: T('Beim Braten zerfallen die Schwefelstoffe zu anderen, süßlichen Aromen. Darum wird Zwiebel in der Pfanne **mild und süß**.', 64), gfx: { pfanne: {} } },
      { t: T('Zwiebeltränen sind eine **chemische Waffe** – ausgelöst von deinem Messer.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Beim Schneiden treffen Schwefelstoffe und Enzyme aufeinander, die vorher getrennt lagerten.', 'Ein zweites Enzym bildet ein flüchtiges Gas, das die Augen reizt – Tränen spülen es weg.', 'Scharfes Messer, Kühlen und Abzug verringern die Tränen.'],
    sources: ['Imai et al. 2002, Nature 419 (Tränenfaktor-Synthase)', 'Block 2010: Garlic and Other Alliums', 'Eady et al. 2008, Plant Physiology 147'],
  },
  {
    id: 'flamme',
    area: 'CHE',
    day: 2,
    hook: 'Was ist eine Flamme eigentlich?',
    mood: 'ruhig',
    ambience: 'feuer',
    images: [],
    draw: {
      kerze(g) {
        candle(g, 180, 190, 0)
        ink(g, E(180, 404, 70, 12), { w: 2.6, d: 300, t: 500 })
        ink(g, B([110, 404], [112, 418], [248, 418], [250, 404]), { w: 2.2, d: 400, t: 400 })
        ripple(g, 180, 150, 40, 120, { n: 3, ms: 3000, d: 1200, w: 1 })
      },
      vorgang(g) {
        // Wachsdampf + Sauerstoff → Kohlendioxid + Wasser, dabei Licht und Wärme
        flame(g, 180, 620, 1.9, 0)
        ripple(g, 180, 540, 70, 150, { n: 3, ms: 2600, d: 1000, w: 1 })
        const wax = glide(g, 40, -20, { ms: 2400, d: 1400, loop: true })
        mol(wax, [[40, 600, 'C'], [62, 588, 'C'], [84, 600, 'C'], [106, 588, 'C']], [[0, 1], [1, 2], [2, 3]], 0.8, 600)
        for (const [x, y, dx] of [[30, 470, 50], [320, 500, -50], [310, 600, -40]] as const) {
          const o2 = glide(g, dx, 20, { ms: 2000, d: 1200, loop: true })
          mol(o2, [[x, y, 'O', 'hell'], [x + 20, y, 'O', 'hell']], [[0, 1, true]], 0.8, 700)
        }
        for (const [x, dd] of [[130, 1600], [230, 2000]] as const) {
          const up = glide(g, 0, -60, { ms: 2600, d: dd, loop: true })
          mol(up, [[x - 20, 370, 'O', 'hell'], [x, 370, 'C'], [x + 20, 370, 'O', 'hell']], [[0, 1, true], [1, 2, true]], 0.8, dd - 400)
        }
        const w = glide(g, 0, -60, { ms: 2600, d: 1800, loop: true })
        water(w, 180, 330, 0.7, 0, 1400)
      },
      docht(g) {
        // Nahsicht: Wachssee um den Docht, flüssiges Wachs steigt im Docht hoch; a1: Dampf am Dochtende
        const top = 470
        ink(g, [[60, 650], [60, top], ...B([60, top], [120, top + 30], [240, top + 30], [300, top]).slice(1), [300, 650]], { w: 3, t: 700 })
        const pool: P[] = [...B([110, top + 8], [140, top + 26], [220, top + 26], [250, top + 8]), ...B([250, top + 8], [220, top + 14], [140, top + 14], [110, top + 8]).slice(1)]
        hatch(g, pool, 500, true)
        ink(g, pool, { w: 1.6, d: 400, t: 300 })
        const wick: P[] = [[174, top + 60], [174, top - 10], ...B([174, top - 10], [176, top - 40], [184, top - 54], [192, top - 70]).slice(1), [200, top - 64], ...B([200, top - 64], [190, top - 48], [186, top - 30], [186, top - 10]).slice(1), [186, top + 60]]
        blank(g, wick)
        ink(g, wick, { w: 2.4, d: 300, t: 400 })
        for (let k = 0; k < 6; k++) ink(g, L([174, top + 50 - k * 12], [186, top + 44 - k * 12]), { w: 1, d: 500 + k * 40, t: 80 })
        flow(g, L([180, top + 20], [180, top - 40]), { n: 3, ms: 1500, d: 900, r: 2 })
        for (const k of [-1, 1]) flow(g, B([180 + k * 66, top + 18], [180 + k * 40, top + 22], [180 + k * 14, top + 22], [180 + k * 4, top + 12]), { n: 2, ms: 1500, d: 800, r: 1.8 })
        dashes(g, L([60, top + 30], [300, top + 30]), { w: 0.8, d: 600, dash: 3, gap: 5 })
        const v = st(g, 'x1', '--o: 190px 390px')
        for (const [x, dx] of [[184, -30], [192, 0], [200, 30]] as const) flow(v, B([x, top - 56], [x + dx * 0.3, top - 90], [x + dx * 0.8, top - 120], [x + dx, top - 160]), { n: 3, ms: 1400, d: 0, r: 2, kind: 'ring' })
        ripple(v, 192, top - 66, 6, 30, { n: 2, ms: 1600, w: 1 })
      },
      rauch(g) {
        // ausgeblasene Kerze, weißer Rauchfaden; ein Streichholz entzündet ihn, die Flamme läuft zum Docht
        candle(g, 120, 440, 0, false)
        const smoke: P[] = [[120, 432], ...B([120, 432], [104, 400], [138, 370], [124, 340]).slice(1), ...B([124, 340], [112, 310], [140, 300], [150, 280]).slice(1)]
        const sw = wobble(g, { dx: 4, ms: 1800, d: 600 })
        ink(sw, smoke, { w: 4, d: 300, t: 700 })
        ink(sw, smoke.map(([x, y]): P => [x + 6, y]), { w: 1.2, d: 400, t: 700 })
        const m = glide(g, -60, 10, { ms: 900, d: 1100 })
        const stick: P[] = [[220, 300], [320, 240], [324, 246], [224, 306], [220, 300]]
        blank(m, stick)
        ink(m, stick, { w: 2, d: 800, t: 300 })
        ball(m, 216, 304, 8, { d: 900, fill: 'dicht', w: 1.8, t: 150 })
        flame(m, 210, 296, 0.32, 1000)
        const j = glide(g, -24, 136, { ms: 700, d: 2200 })
        flame(j, 148, 300, 0.24, 2100)
      },
      faraday(g) {
        // Hörsaal der Royal Institution: Vortragender am Tisch mit Kerze, Kinder in gebogenen Bankreihen
        ink(g, RR(40, 300, 280, 140, 6), { w: 1.6, t: 600 })
        for (let k = 0; k < 4; k++) ink(g, L([60 + k * 70, 310], [60 + k * 70, 430]), { w: 0.8, d: 200 + k * 40, t: 200 })
        ink(g, RR(100, 456, 160, 14, 3), { w: 2.6, d: 300, t: 300 })
        for (const x of [110, 250]) ink(g, L([x, 470], [x, 520]), { w: 2.2, d: 400, t: 200 })
        fig(g, 90, 520, 3.6, { d: 500, arms: 'push' })
        ink(g, RR(192, 420, 16, 36, 2), { w: 2, d: 600, t: 200 })
        flame(g, 200, 416, 0.3, 700)
        ink(g, RR(150, 446, 30, 10, 2), { w: 1.6, d: 700, t: 100 })
        beaker(g, 220, 456, 26, 40, 0.5, 800)
        for (let r = 0; r < 3; r++) {
          ink(g, B([20, 560 + r * 38], [120, 548 + r * 38], [240, 548 + r * 38], [340, 560 + r * 38]), { w: 2, d: 900 + r * 100, t: 400 })
          for (let k = 0; k < 7 - r; k++) {
            const x = 50 + k * (260 / (6 - r)) + (r % 2) * 10
            const y = 542 + r * 38
            blank(g, E(x, y, 11, 12))
            hatch(g, E(x, y - 3, 11, 9, 180, 360), 1100 + r * 100, true)
            ink(g, E(x, y, 11, 12), { w: 1.8, d: 1000 + r * 100 + k * 30, t: 150 })
          }
        }
      },
      zonen(g) {
        // Aufbau einer Kerzenflamme; a1 innen, a2 Leuchtzone, a3 Saum, a4 blauer Fuß
        const cx = 180
        const base = 600
        ink(g, [[110, 660], [110, base + 30], ...B([110, base + 30], [150, base + 40], [210, base + 40], [250, base + 30]).slice(1), [250, 660]], { w: 3, t: 500 })
        ink(g, B([cx - 2, base + 30], [cx - 4, base], [cx + 2, base - 30], [cx + 10, base - 50]), { w: 4, d: 300, t: 300 })
        const P = (a: number, b: number): P => [cx + a, base + b]
        const mantle = [...B(P(0, 10), P(-70, 10), P(-62, -120), P(0, -300)), ...B(P(0, -300), P(62, -120), P(70, 10), P(0, 10)).slice(1)]
        const lum = [...B(P(0, 0), P(-56, 0), P(-50, -110), P(0, -270)), ...B(P(0, -270), P(50, -110), P(56, 0), P(0, 0)).slice(1)]
        const inner = [...B(P(0, -10), P(-26, -10), P(-24, -70), P(0, -130)), ...B(P(0, -130), P(24, -70), P(26, -10), P(0, -10)).slice(1)]
        const blue = [...B(P(-56, 0), P(-50, 14), P(50, 14), P(56, 0)), ...B(P(56, 0), P(40, -26), P(-40, -26), P(-56, 0)).slice(1)]
        const fw = wobble(g, { deg: 2, ox: cx, oy: base, ms: 1100, d: 1200 })
        ink(fw, mantle, { w: 1.2, d: 400, t: 800 })
        hatch(fw, [...lum, ...inner.slice().reverse()], 900)
        ink(fw, lum, { w: 3, d: 200, t: 800 })
        blank(fw, inner)
        dashes(fw, inner, { w: 1.4, d: 700, dash: 4, gap: 3 })
        hatch(fw, blue, 1000, true)
        ink(fw, blue, { w: 1.6, d: 900, t: 300 })
        const a = st(g, 'x1', '--o: 180px 530px')
        for (const k of [-1, 1]) {
          arrow(a, L([cx + k * 130, base - 60], [cx + k * 70, base - 66]), { w: 2, t: 0, head: 7 })
          ink(a, L([cx + k * 64, base - 74], [cx + k * 52, base - 58]), { w: 2.4, t: 0 })
        }
        flow(a, L([cx, base - 20], [cx, base - 120]), { n: 3, ms: 1400, r: 2, kind: 'ring' })
        const b = st(g, 'x2', '--o: 180px 450px')
        for (let i = 0; i < 14; i++) {
          const y = base - 150 - (i % 7) * 14
          const x = cx - 24 + ((i * 17) % 48)
          const sp = mk('g', { class: 'blink', style: `--d:${i * 90}ms` }, b)
          dot(sp, x, y, 2.6, 0)
          for (let k = 0; k < 4; k++) ink(sp, L([x + Math.cos(rad(k * 90)) * 4, y + Math.sin(rad(k * 90)) * 4], [x + Math.cos(rad(k * 90)) * 8, y + Math.sin(rad(k * 90)) * 8]), { w: 0.9, t: 0 })
        }
        const c = st(g, 'x3', '--o: 180px 400px')
        ink(c, mantle, { w: 4, t: 0 })
        ripple(c, cx, base - 280, 10, 40, { n: 2, ms: 1600, w: 1.2 })
        const dd = st(g, 'x4', '--o: 180px 590px')
        ink(dd, blue, { w: 3.6, t: 0 })
        ripple(dd, cx, base - 6, 20, 80, { n: 2, ms: 1600, w: 1.2, ry: 0.3 })
      },
      auftrieb(g) {
        candle(g, 180, 470, 0)
        for (const k of [-1, 0, 1]) {
          const p = B([180 + k * 8, 380], [180 + k * 20, 340], [180 + k * 40, 310], [180 + k * 70, 290])
          flow(g, p, { n: 3, ms: 1600, d: 700 + (k + 1) * 150, r: 2.2, kind: 'ring' })
        }
        for (const k of [-1, 1]) {
          const p = B([180 + k * 160, 500], [180 + k * 110, 500], [180 + k * 40, 480], [180 + k * 10, 440])
          dashes(g, p, { w: 1.2, d: 1000, dash: 4, gap: 4 })
          flow(g, p, { n: 3, ms: 1800, d: 1200, r: 1.8 })
        }
      },
      all(g) {
        // Bullauge der Raumstation: Kugelflamme um den Docht, ohne Auftrieb
        ink(g, E(180, 480, 150), { w: 4, t: 900 })
        ink(g, E(180, 480, 134), { w: 1.6, d: 200, t: 900 })
        for (let k = 0; k < 12; k++) {
          const a = rad(k * 30 + 15)
          ball(g, 180 + Math.cos(a) * 142, 480 + Math.sin(a) * 142, 3.4, { d: 300 + k * 40, t: 60, w: 1.2 })
        }
        stars(g, 60, 360, 240, 240, 16, 400, (x, y) => Math.hypot(x - 180, y - 480) < 70 || Math.hypot(x - 180, y - 480) > 120)
        ink(g, E(180, 480, 60), { w: 1.2, d: 700, t: 600 })
        hatch(g, [...E(180, 480, 46), ...E(180, 480, 30).reverse()], 1100, true)
        ink(g, E(180, 480, 46), { w: 2.4, d: 800, t: 600 })
        ink(g, L([180, 480], [180, 610]), { w: 2.6, d: 600, t: 300 })
        dot(g, 180, 480, 4, 900)
        ripple(g, 180, 480, 50, 110, { n: 2, ms: 2400, d: 1300, w: 1 })
      },
      herd(g) {
        // Gasbrenner schräg von oben: Brennerdeckel, Kranz kleiner Flammen, Topfträger, Luftansaugung
        const cx = 180
        const cy = 520
        for (const k of [-1, 1]) for (const y of [0, 1]) ink(g, L([cx + k * 150, cy - 30 + y * 60], [cx + k * 60, cy - 10 + y * 20]), { w: 3, d: 200, t: 300 })
        ink(g, E(cx, cy + 20, 80, 22), { w: 2.6, d: 300, t: 500 })
        ink(g, E(cx, cy, 70, 18), { w: 2.6, d: 400, t: 500 })
        hatch(g, E(cx, cy - 4, 46, 10), 600, true)
        ink(g, E(cx, cy - 4, 46, 10), { w: 2, d: 500, t: 300 })
        for (let k = 0; k < 14; k++) {
          const a = rad(k * (360 / 14))
          const x = cx + Math.cos(a) * 62
          const y = cy + Math.sin(a) * 16
          const fw = wobble(g, { deg: 6, ox: x, oy: y, ms: 500 + k * 30, d: 900 })
          const f: P[] = [...B([x - 5, y], [x - 6, y - 10], [x - 2, y - 18], [x, y - 24]), ...B([x, y - 24], [x + 2, y - 18], [x + 6, y - 10], [x + 5, y]).slice(1)]
          if (k % 2) hatch(fw, f, 900 + k * 40, true)
          ink(fw, f, { w: 1.6, d: 700 + k * 40, t: 150 })
        }
        ink(g, [[cx - 14, cy + 42], [cx - 14, cy + 110], [cx + 14, cy + 110], [cx + 14, cy + 42]], { w: 2.4, d: 500, t: 400 })
        for (const k of [-1, 1]) ink(g, E(cx + k * 14, cy + 84, 3, 8), { w: 1.4, d: 700, t: 100 })
        for (const k of [-1, 1]) flow(g, B([cx + k * 120, cy + 100], [cx + k * 70, cy + 96], [cx + k * 30, cy + 90], [cx + k * 14, cy + 84]), { n: 3, ms: 1600, d: 1200, r: 1.8 })
      },
      watt(g) {
        // fast die ganze Leistung geht als Wärme weg, nur ein haarfeiner Teil als Licht
        candle(g, 100, 420, 0)
        for (let k = 0; k < 3; k++) {
          const w = wobble(g, { dx: 4, ms: 1400 + k * 200, d: 900 })
          ink(w, B([60 + k * 40, 380], [50 + k * 40, 350], [70 + k * 40, 330], [60 + k * 40, 300]), { w: 1.6, d: 800 + k * 100, t: 300 })
        }
        ripple(g, 100, 380, 30, 90, { n: 3, ms: 2400, d: 1000, w: 1 })
        hatch(g, [[270, 490], ...E(270, 490, 70, 70, -88, 270), [270, 490]], 1200)
        ink(g, E(270, 490, 70), { w: 3, d: 900, t: 600 })
        ink(g, L([270, 490], [270, 420]), { w: 2, d: 1300, t: 200 })
        ink(g, L([270, 490], [270 + Math.cos(rad(-88)) * 70, 490 + Math.sin(rad(-88)) * 70]), { w: 2, d: 1300, t: 200 })
        rays(g, 272, 410, 10, 24, 6, 1500)
      },
      farben(g) {
        // Flammenfärbung: Drahtöse mit Salz in drei Flammen, oben Feuerwerk
        const pat = ['dense', 'dots', 'lines'] as const
        ;[['Cu', 70], ['Na', 180], ['Sr', 290]].forEach(([el, x], i) => {
          const cx = x as number
          const fw = wobble(g, { deg: 3, ox: cx, oy: 610, ms: 900 + i * 100, d: 900 })
          const f: P[] = [...B([cx, 610], [cx - 30, 610], [cx - 26, 560], [cx, 470]), ...B([cx, 470], [cx + 26, 560], [cx + 30, 610], [cx, 610]).slice(1)]
          blank(fw, f)
          if (pat[i] === 'dense') hatch(fw, f, 500 + i * 300, true)
          else if (pat[i] === 'dots') for (let k = 0; k < 14; k++) dot(fw, cx - 12 + (k % 4) * 8, 520 + Math.floor(k / 4) * 20, 1.6, 600 + i * 300 + k * 20)
          else for (let k = 0; k < 4; k++) ink(fw, L([cx - 14 + k * 9, 600], [cx - 6 + k * 4, 500]), { w: 1, d: 600 + i * 300, t: 200 })
          ink(fw, f, { w: 2.4, d: 300 + i * 300, t: 400 })
          ink(g, L([cx + 30, 640], [cx + 6, 588]), { w: 1.6, d: 200 + i * 300, t: 200 })
          ink(g, E(cx + 3, 584, 5), { w: 1.6, d: 250 + i * 300, t: 100 })
          text(g, cx, 660, el as string, { anchor: 'middle', size: 18, d: 600 + i * 300 })
        })
        for (let k = 0; k < 16; k++) {
          const a = rad(k * 22.5)
          const p = L([180 + Math.cos(a) * 20, 360 + Math.sin(a) * 20], [180 + Math.cos(a) * 70, 360 + Math.sin(a) * 70])
          ;(k % 2 ? dashes : ink)(g, p, { w: 1.6, d: 1500 + k * 30, t: 200 })
          dot(g, 180 + Math.cos(a) * 78, 360 + Math.sin(a) * 78, 2.4, 1800 + k * 30)
        }
      },
      dreieck(g) {
        // Branddreieck: oben Hitze (Thermometer), links Brennstoff (Holzscheite), rechts Sauerstoff (O₂);
        // a1: je ein Löschweg
        ink(g, [[180, 330], [320, 580], [40, 580], [180, 330]], { w: 3.2, t: 900 })
        flame(g, 180, 540, 0.9, 400)
        for (const [x, y] of [[40, 620], [74, 608]] as const) {
          ink(g, RR(x, y, 64, 18, 8), { w: 2.2, d: 700, t: 300 })
          ink(g, E(x + 60, y + 9, 5, 8), { w: 1.4, d: 800, t: 100 })
          ink(g, E(x + 60, y + 9, 2, 4), { w: 1, d: 850, t: 80 })
        }
        mol(g, [[296, 616, 'O', 'hell'], [324, 616, 'O', 'hell']], [[0, 1, true]], 1, 900)
        thermo(g, 174, 250, 46, 0.85, 1000)
        const x = st(g, 'x1', '--o: 180px 470px')
        const t = glide(x, 0, 20, { ms: 900, d: 0, loop: true })
        drop(t, 230, 290, 0.6, 0)
        hatch(x, RR(268, 560, 80, 40, 4), 0)
        ink(x, RR(268, 560, 80, 40, 4), { w: 2, t: 0 })
        for (const k of [-1, 1]) ink(x, L([56, 584 + k * 6], [96, 568 - k * 10]), { w: 2, t: 0 })
        for (const k of [-1, 1]) ink(x, E(52, 588 + k * 10, 6), { w: 1.6, t: 0 })
      },
      fett(g) {
        // Wasser in brennendes Fett: Feuerball
        ink(g, B([60, 560], [70, 600], [290, 600], [300, 560]), { w: 3, t: 600 })
        ink(g, E(180, 560, 120, 16), { w: 2.4, d: 100, t: 500 })
        hatch(g, E(180, 564, 110, 10), 400, true)
        ink(g, L([300, 566], [348, 548]), { w: 3, d: 200, t: 200 })
        for (let k = 0; k < 5; k++) {
          const fw = wobble(g, { deg: 4, ox: 100 + k * 40, oy: 560, ms: 600 + k * 70, d: 700 })
          flame(fw, 100 + k * 40, 560, 0.5 + (k % 2) * 0.15, 500 + k * 60)
        }
        const cup: P[] = [[40, 330], [90, 300], [110, 336], [62, 368], [40, 330]]
        ink(g, cup, { w: 2.4, d: 800, t: 300 })
        const t = glide(g, 50, 140, { ms: 700, d: 1500 })
        drop(t, 100, 360, 0.5, 1300)
        const boom = pop(g, 2300, '50% 100%')
        const tongues: P[] = []
        for (let k = 0; k <= 10; k++) {
          const x = 70 + k * 22
          const h = 120 + Math.sin(k * 1.7) * 50 + (k > 2 && k < 8 ? 90 : 0)
          tongues.push([x, 548 - (k % 2 ? h * 0.55 : h)])
        }
        const ball0: P[] = smooth([[64, 548], ...tongues, [296, 548], [64, 548]], 4)
        blank(boom, ball0)
        hatch(boom, ball0, 0)
        ink(boom, ball0, { w: 3, t: 0 })
        const core: P[] = smooth([[120, 548], [110, 470], [150, 420], [180, 360], [210, 420], [250, 470], [240, 548], [120, 548]], 3)
        blank(boom, core)
        hatch(boom, core, 0, true)
        ink(boom, core, { w: 2, t: 0 })
        for (let k = 0; k < 6; k++) dot(boom, 90 + k * 40, 380 - (k % 3) * 30, 3, 0)
      },
      ende(g) {
        candle(g, 180, 470, 0)
        ripple(g, 180, 430, 40, 120, { n: 3, ms: 3000, d: 1200, w: 1 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { kerze: {} } },
      { t: T('Eine Flamme ist kein Ding, sondern ein **Vorgang**: Gas, das gerade mit Sauerstoff reagiert – und dabei leuchtet und Wärme abgibt.', 64), gfx: { vorgang: {} } },
      { t: T('Bei einer Kerze brennt nicht das feste Wachs. Die Hitze **schmilzt** es, und der Docht saugt es nach oben.', 64), gfx: { docht: {} } },
      { t: T('Am Docht **verdampft** das flüssige Wachs. Erst dieser Wachsdampf verbrennt.', 64), gfx: { docht: { cls: 'a1' } } },
      { t: T('Probier es: Blas eine Kerze aus und halte ein brennendes Streichholz in den **weißen Rauch**. Die Flamme springt zurück auf den Docht.', 64), gfx: { rauch: {} } },
      { t: T('Der Physiker Michael Faraday hielt 1848 eine berühmte Vortragsreihe für Kinder – über nichts anderes als **eine Kerze**.', 64), gfx: { faraday: {} } },
      { t: T('Eine Flamme hat Zonen. Innen ist sie dunkel – dort gibt es zu **wenig Sauerstoff**, der Dampf kann noch nicht brennen.', 64), gfx: { zonen: { cls: 'a1' } } },
      { t: T('Im hellen gelben Teil glühen winzige **Rußteilchen**, rund 1.000 Grad heiß. Ihr Glühen ist das Licht der Kerze.', 64), gfx: { zonen: { cls: 'a2' } } },
      { t: T('Ganz außen, wo genug Sauerstoff ist, verbrennt alles vollständig. Dort ist die Flamme **am heißesten** – bis rund 1.400 Grad.', 64), gfx: { zonen: { cls: 'a3' } } },
      { t: T('Unten am Docht leuchtet sie **bläulich**: Dort strahlen angeregte Moleküle, nicht glühender Ruß.', 64), gfx: { zonen: { cls: 'a4' } } },
      { t: T('Warum zeigt eine Flamme nach **oben**? Heiße Gase sind leichter als die Umgebung und steigen auf. Frische Luft strömt von unten nach.', 64), gfx: { auftrieb: {} } },
      { t: T('Im All gibt es kein Oben. Dort ist eine Kerzenflamme **kugelrund** und blau – das zeigten Versuche auf der Raumstation.', 64), gfx: { all: {} } },
      { t: T('Eine Gasflamme am Herd ist blau, weil der Brenner schon **vorher** Luft beimischt: Fast alles verbrennt, kaum Ruß entsteht.', 64), gfx: { herd: {} } },
      { t: T('Eine Kerze heizt mit rund **80 Watt** – aber nur ein winziger Bruchteil davon wird zu sichtbarem Licht.', 64), gfx: { watt: {} } },
      { t: T('Kupfer färbt Flammen grün, Natrium gelb, Strontium rot: Jedes Element leuchtet in **eigenen Farben**. So entstehen Feuerwerksfarben.', 64), gfx: { farben: {} } },
      { t: T('Damit Feuer brennt, braucht es drei Dinge: **Brennstoff, Sauerstoff und Hitze**. Fehlt eins, erlischt es.', 64), gfx: { dreieck: {} } },
      { t: T('Darauf beruht jedes Löschen: Wasser nimmt die **Hitze**, eine Löschdecke den Sauerstoff, ein Schnitt im Docht den Brennstoff.', 64), gfx: { dreieck: { cls: 'a1' } } },
      { t: T('Fett aber nie mit Wasser löschen: Das Wasser verdampft schlagartig und schleudert brennendes Fett hoch – eine **Stichflamme**.', 64), gfx: { fett: {} } },
      { t: T('Eine Flamme ist **brennendes Gas** – und ihr Licht glühender Ruß.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Nicht das Wachs brennt, sondern sein Dampf; das gelbe Licht ist glühender Ruß.', 'Auftrieb formt die Flamme – im All wird sie kugelrund.', 'Feuer braucht Brennstoff, Sauerstoff und Hitze; Fettbrände nie mit Wasser löschen.'],
    sources: ['Faraday 1861: The Chemical History of a Candle', 'NASA: Flame Extinguishment Experiment (ISS)', 'Deutscher Feuerwehrverband: Fettbrand'],
  },
  {
    id: 'seife',
    area: 'CHE',
    day: 2,
    hook: 'Wie wäscht Seife Fett weg, wenn Wasser es nicht kann?',
    mood: 'verspielt',
    ambience: 'blasen',
    images: [],
    draw: {
      blasen(g) {
        // Seifenblasen mit Schillerbändern, Glanzlicht; unten der Pustering
        for (const [x, y, r, d] of [[130, 220, 74, 0], [262, 150, 46, 300], [250, 310, 32, 500], [70, 360, 22, 700]] as const) {
          const w = wobble(g, { dx: 4, dy: -8, ms: 2600 + r * 20, d: 1200 })
          bubble3(w, x, y, r, d)
        }
        ink(g, E(300, 400, 26), { w: 3, d: 900, t: 400 })
        ink(g, E(300, 400, 20), { w: 1.2, d: 1000, t: 400 })
        ink(g, L([300, 426], [314, 450]), { w: 3, d: 1100, t: 200 })
      },
      oel(g) {
        beaker(g, 100, 630, 160, 300, 0.85, 0)
        const top = 630 - 300 * 0.85
        const oil: P[] = RR(103, top, 154, 46, 2)
        blank(g, oil)
        hatch(g, oil, 900, true)
        ink(g, B([103, top - 3], [110, top + 1], [250, top + 1], [257, top - 3]), { w: 1.8, d: 800, t: 300 })
        ink(g, B([103, top + 46], [140, top + 42], [220, top + 50], [257, top + 46]), { w: 1.8, d: 900, t: 300 })
        for (let k = 0; k < 6; k++) {
          const up = glide(g, 0, -(120 + k * 20), { ms: 2200 + k * 300, d: 1000 + k * 250, loop: true })
          const x = 120 + ((k * 37) % 120)
          const y = 600 - (k % 3) * 20
          hatch(up, E(x, y, 6 + (k % 3) * 2), 1000 + k * 100, true)
          ink(up, E(x, y, 6 + (k % 3) * 2), { w: 1.4, d: 900 + k * 100, t: 150 })
        }
      },
      polar(g) {
        // Wassermoleküle verhakt über Wasserstoffbrücken, das Fettmolekül bleibt außen vor
        const ws: [number, number, number][] = [[60, 380, 0], [130, 360, 50], [90, 450, -30], [160, 440, 20], [60, 530, 70], [130, 520, -60], [100, 610, 10], [170, 600, 40]]
        ws.forEach(([x, y, r], i) => {
          const w = wobble(g, { dx: 2, dy: 2, ms: 600 + i * 70, d: 900 })
          water(w, x, y, 0.9, r, i * 80)
        })
        for (const [a, b] of [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 7], [6, 7]] as const) dashes(g, L([ws[a][0], ws[a][1]], [ws[b][0], ws[b][1]]), { w: 1, d: 700, dash: 3, gap: 4 })
        const chain: [number, number, string][] = []
        for (let i = 0; i < 7; i++) chain.push([240 + (i % 2) * 22, 330 + i * 46, 'C'])
        const bonds: [number, number][] = chain.slice(1).map((_, i) => [i, i + 1])
        const atoms: [number, number, string][] = [...chain]
        chain.forEach(([x, y], i) => {
          const s = i % 2 ? 1 : -1
          atoms.push([x + s * 30, y - 8, 'H'])
          bonds.push([i, atoms.length - 1])
        })
        const fw = wobble(g, { dx: 6, ms: 2400, d: 1200 })
        mol(fw, atoms, bonds, 0.8, 600)
      },
      molekuel(g) {
        // Seifenmolekül (Natriumstearat): geladener Kopf, langer Kohlenwasserstoffschwanz;
        // x1 die Wasserseite am Kopf, x2 die Fettseite am Schwanz
        soapBig(g, 60, 470, 260, 0)
        const wa = st(g, 'x1', '--o: 60px 470px')
        for (const [x, y, r] of [[40, 380, 30], [26, 560, -60], [104, 400, 120]] as const) water(wa, x, y, 0.8, r, 0)
        const fa = st(g, 'f2', '')
        const blob: P[] = smooth([[120, 420], [220, 400], [330, 420], [340, 500], [240, 540], [130, 520], [120, 420]], 3)
        hatch(fa, blob, 0)
        ink(fa, blob, { w: 1.6, t: 0 })
      },
      fleck(g) {
        // Gewebe im Schnitt: Fäden, darauf der Fettfleck; Seifenschwänze stecken im Fett
        for (let k = 0; k < 9; k++) {
          const x = 30 + k * 38
          ink(g, E(x, 594, 16, 9), { w: 1.8, d: k * 40, t: 200 })
          hatch(g, E(x, 594, 16, 9), 300 + k * 40)
        }
        ink(g, waveP(14, 346, 594, 12, 76), { w: 2.6, d: 400, t: 600 })
        const fat: P[] = [...B([90, 584], [100, 480], [260, 480], [270, 584])]
        blank(g, [...fat, [90, 584]])
        hatch(g, [...fat, [90, 584]], 700, true)
        ink(g, fat, { w: 2.6, d: 500, t: 500 })
        for (let k = 0; k < 9; k++) {
          const a = 200 + k * 17.5
          const w = wobble(g, { dx: Math.cos(rad(a)) * 4, dy: Math.sin(rad(a)) * 4, ms: 900 + k * 60, d: 1500 })
          soap(w, 180 + Math.cos(rad(a)) * 150, 584 + Math.sin(rad(a)) * 150, a + 180, 46, 800 + k * 80)
        }
        for (const [x, y] of [[50, 400], [310, 380], [180, 330]] as const) water(g, x, y, 0.8, x, 1400)
      },
      mizelle(g) {
        const fat = E(180, 470, 46)
        hatch(g, fat, 300, true)
        ink(g, fat, { w: 2, t: 400 })
        for (let k = 0; k < 18; k++) {
          const a = k * 20
          soap(g, 180 + Math.cos(rad(a)) * 100, 470 + Math.sin(rad(a)) * 100, a + 180, 44, 500 + k * 50)
        }
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45 + 22)
          const w = wobble(g, { dx: 3, dy: 3, ms: 700 + k * 90, d: 1400 })
          water(w, 180 + Math.cos(a) * 140, 470 + Math.sin(a) * 140, 0.6, k * 40, 1400 + k * 60)
        }
      },
      weg(g) {
        // Mizellen treiben mit dem Spülwasser davon
        for (const y of [610, 636]) travelWave(g, 20, 340, y, 5, 60, { ms: 1600, d: 300, w: 2 })
        for (let i = 0; i < 3; i++) {
          const m = glide(g, 120, 0, { ms: 3200, d: 900 + i * 300, loop: true })
          const cx = 50 + i * 100
          const cy = 450 + (i % 2) * 70
          hatch(m, E(cx, cy, 16), 200 + i * 200, true)
          ink(m, E(cx, cy, 16), { w: 1.4, d: 200 + i * 200, t: 200 })
          for (let k = 0; k < 10; k++) soap(m, cx + Math.cos(rad(k * 36)) * 38, cy + Math.sin(rad(k * 36)) * 38, k * 36 + 180, 16, i * 200)
        }
        for (let k = 0; k < 4; k++) flow(g, L([20, 360 + k * 60], [340, 370 + k * 60]), { n: 2, ms: 2400, d: 600 + k * 200, r: 1.6, kind: 'dash' })
      },
      virus(g) {
        // Hüllvirus: Lipid-Doppelschicht, Stacheln, Erbgut innen; x1: Seife reißt die Hülle auf
        const cx = 140
        const cy = 470
        for (let k = 0; k < 36; k++) {
          const a = rad(k * 10)
          for (const [r, s] of [[78, 1], [62, -1]] as const) {
            const hx = cx + Math.cos(a) * r
            const hy = cy + Math.sin(a) * r
            dot(g, hx, hy, 2.6, 100 + k * 15)
            ink(g, L([hx, hy], [hx - Math.cos(a) * s * 7, hy - Math.sin(a) * s * 7]), { w: 0.9, d: 150 + k * 15, t: 60 })
          }
        }
        for (let k = 0; k < 12; k++) {
          const a = rad(k * 30 + 8)
          const p0: P = [cx + Math.cos(a) * 80, cy + Math.sin(a) * 80]
          const p1: P = [cx + Math.cos(a) * 100, cy + Math.sin(a) * 100]
          ink(g, L(p0, p1), { w: 2, d: 600 + k * 40, t: 100 })
          ball(g, p1[0], p1[1], 6, { d: 650 + k * 40, fill: 'hell', w: 1.6, t: 100 })
        }
        ink(g, smooth([[110, 450], [130, 430], [160, 450], [150, 480], [120, 490], [140, 510], [170, 500]], 4), { w: 1.8, d: 900, t: 500 })
        for (let k = 0; k < 5; k++) {
          const s = glide(g, -40, 0, { ms: 1200, d: 1200 + k * 150 })
          soap(s, 310, 380 + k * 44, 180, 40, 800 + k * 100)
        }
        const broken = st(g, 'x1', `--o: ${cx}px ${cy}px`)
        blank(broken, [...E(cx, cy, 108, 108, -30, 30), ...E(cx, cy, 54, 54, 30, -30)])
        for (const a of [-30, 30]) ink(broken, L([cx + Math.cos(rad(a)) * 56, cy + Math.sin(rad(a)) * 56], [cx + Math.cos(rad(a)) * 86, cy + Math.sin(rad(a)) * 86]), { w: 2.6, t: 0 })
        for (let k = 0; k < 3; k++) {
          const f = glide(broken, 60, (k - 1) * 40, { ms: 1600, d: 300 })
          hatch(f, E(cx + 96, cy + (k - 1) * 30, 12), 0, true)
          ink(f, E(cx + 96, cy + (k - 1) * 30, 12), { w: 1.4, t: 0 })
        }
      },
      abloesen(g) {
        // Hautoberfläche mit Rillen; Keime werden von Seife umhüllt und fortgespült
        const skin: P[] = smooth([[20, 560], [60, 548], [90, 566], [130, 546], [170, 566], [210, 546], [250, 566], [290, 548], [340, 560]], 4)
        ink(g, skin, { w: 3, t: 700 })
        hatch(g, [...skin, [340, 650], [20, 650]], 300)
        for (let k = 0; k < 6; k++) ink(g, E(50 + k * 52, 610, 14, 8), { w: 1.2, d: 500 + k * 40, t: 150 })
        for (const [x, y, d] of [[90, 520, 600], [190, 500, 750], [270, 520, 900]] as const) {
          const m = glide(g, 50, -110, { ms: 1800, d: d + 1000 })
          bact(m, x - 18, y - 8, 0.7, d, true)
          for (let k = 0; k < 8; k++) soap(m, x + Math.cos(rad(k * 45)) * 34, y + Math.sin(rad(k * 45)) * 30, k * 45 + 180, 12, d + 300)
        }
        for (let k = 0; k < 3; k++) flow(g, L([20, 380 + k * 40], [340, 360 + k * 40]), { n: 2, ms: 2000, d: 800 + k * 200, r: 1.6, kind: 'dash' })
      },
      pfeffer(g) {
        // Teller mit Wasser, Pfeffer verteilt; Fingerspitze mit Spülmittel tupft in die Mitte → Pfeffer flieht
        ink(g, E(180, 500, 150, 56), { w: 3, t: 800 })
        ink(g, E(180, 504, 126, 44), { w: 1.4, d: 200, t: 800 })
        ink(g, B([30, 500], [40, 560], [320, 560], [330, 500]), { w: 2.4, d: 300, t: 600 })
        let seed = 7
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 40; i++) {
          const a = rnd() * Math.PI * 2
          const r = 0.15 + rnd() * 0.75
          const x = 180 + Math.cos(a) * 120 * r
          const y = 504 + Math.sin(a) * 40 * r
          const m = glide(g, Math.cos(a) * 120 * (0.92 - r), Math.sin(a) * 40 * (0.92 - r), { ms: 350, d: 2300 })
          ink(m, L([x - 2, y - 1], [x + 2, y + 1]), { w: 2.6, d: 400 + i * 15, t: 40 })
        }
        const f = glide(g, 0, 60, { ms: 900, d: 1300 })
        const tip: P[] = [...B([164, 330], [160, 400], [168, 434], [180, 436]), ...B([180, 436], [192, 434], [200, 400], [196, 330]).slice(1)]
        blank(f, tip)
        ink(f, tip, { w: 2.6, d: 900, t: 400 })
        ink(f, B([168, 410], [174, 404], [186, 404], [192, 410]), { w: 1.2, d: 1000, t: 150 })
        hatch(f, E(180, 438, 8, 4), 1100, true)
        ripple(g, 180, 504, 10, 120, { n: 2, ms: 1400, d: 2300, w: 1.2, ry: 0.34 })
        const x1 = st(g, 'x1', '--o: 180px 504px')
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45)
          arrow(x1, L([180 + Math.cos(a) * 40, 504 + Math.sin(a) * 14], [180 + Math.cos(a) * 100, 504 + Math.sin(a) * 34]), { w: 1.8, t: 0, head: 6 })
        }
      },
      haende(g) {
        // Stoppuhr: 20 Sekunden sind ein Drittel der Runde
        ink(g, E(180, 490, 120), { w: 3.4, t: 800 })
        ink(g, E(180, 490, 108), { w: 1.4, d: 200, t: 800 })
        ink(g, RR(166, 346, 28, 18, 4), { w: 2.6, d: 300, t: 200 })
        ink(g, L([180, 364], [180, 370]), { w: 3, d: 350, t: 100 })
        for (const a of [-45, 45]) ink(g, L([180 + Math.cos(rad(a - 90)) * 122, 490 + Math.sin(rad(a - 90)) * 122], [180 + Math.cos(rad(a - 90)) * 134, 490 + Math.sin(rad(a - 90)) * 134]), { w: 3, d: 400, t: 100 })
        hatch(g, [[180, 490], ...E(180, 490, 100, 100, -90, 30), [180, 490]], 900)
        for (let k = 0; k < 60; k++) {
          const a = rad(k * 6 - 90)
          const r0 = k % 5 ? 100 : 92
          ink(g, L([180 + Math.cos(a) * r0, 490 + Math.sin(a) * r0], [180 + Math.cos(a) * 106, 490 + Math.sin(a) * 106]), { w: k % 5 ? 0.8 : 1.8, d: 500 + k * 8, t: 50 })
        }
        for (const [k, l] of [[0, '60'], [3, '15'], [6, '30'], [9, '45']] as const) {
          const a = rad(k * 30 - 90)
          text(g, 180 + Math.cos(a) * 76, 490 + Math.sin(a) * 76 + 6, l, { anchor: 'middle', size: 16, cls: 'halo', d: 900 })
        }
        const hand = spin(g, 180, 490, 20000, 1200)
        ink(hand, L([180, 506], [180, 400]), { w: 2.4, d: 1000, t: 200 })
        dot(g, 180, 490, 5, 1100)
      },
      alt(g) {
        // Tontafel mit Keilschrift, daneben ein Kessel mit Fett und Asche über dem Feuer
        const tab: P[] = smooth([[30, 330], [150, 320], [158, 520], [36, 530], [30, 330]], 2)
        blank(g, tab)
        ink(g, tab, { w: 3, t: 600 })
        for (let r = 0; r < 7; r++) {
          ink(g, L([40, 352 + r * 26], [148, 350 + r * 26]), { w: 0.8, d: 300 + r * 60, t: 200 })
          for (let c = 0; c < 5; c++) {
            const x = 46 + c * 20 + ((r * 7 + c * 3) % 5)
            const y = 342 + r * 26
            ink(g, [[x, y], [x + 8, y + 3], [x, y + 6], [x, y]], { w: 1.4, d: 400 + r * 60 + c * 20, t: 60 })
            if ((r + c) % 3 === 0) ink(g, L([x + 8, y + 3], [x + 14, y + 3]), { w: 1, d: 450 + r * 60, t: 40 })
          }
        }
        const pot: P[] = [...B([200, 470], [196, 560], [320, 560], [316, 470])]
        blank(g, [...pot, [200, 470]])
        ink(g, pot, { w: 3, d: 600, t: 500 })
        ink(g, E(258, 470, 60, 12), { w: 2.4, d: 700, t: 400 })
        hatch(g, E(258, 472, 52, 8), 900, true)
        for (const [a, b] of [[[190, 440], [230, 620]], [[326, 440], [286, 620]], [[258, 430], [258, 620]]] as const) ink(g, L(a as P, b as P), { w: 2, d: 300, t: 400 })
        for (let k = 0; k < 4; k++) {
          const fw = wobble(g, { deg: 5, ox: 230 + k * 18, oy: 620, ms: 600 + k * 80, d: 1000 })
          flame(fw, 230 + k * 18, 620, 0.32, 900 + k * 60)
        }
        for (let k = 0; k < 4; k++) {
          const b = glide(g, 0, -20, { ms: 1200, d: 1300 + k * 200, loop: true })
          ink(b, E(230 + k * 18, 464, 4), { w: 1.2, d: 1200, t: 100 })
        }
      },
      blase(g) {
        // Blase; x1 Lupe auf die Haut (Seifenschicht – Wasser – Seifenschicht), x2 dünnste Stelle oben schwarz
        bubble3(g, 150, 490, 120, 0)
        const lens0 = st(g, 'x1', '--o: 280px 360px')
        blank(lens0, E(280, 360, 66))
        ink(lens0, E(280, 360, 66), { w: 2.6, t: 0 })
        ink(lens0, L([234, 406], [196, 444]), { w: 2, t: 0 })
        const c = clipBox(lens0, 214, 294, 132, 132)
        for (let k = 0; k < 6; k++) soap(c, 220 + k * 24, 330, 90, 14, 0)
        for (let k = 0; k < 6; k++) soap(c, 220 + k * 24, 392, 270, 14, 0)
        for (let k = 0; k < 4; k++) water(c, 236 + k * 30, 361, 0.35, k * 40, 0)
        const thin = st(g, 'f2', '')
        hatch(thin, [...E(150, 490, 118, 118, 230, 310), ...E(150, 490, 90, 90, 310, 230)], 0, true)
      },
      farben(g) {
        // Dünne Schicht: ein Strahl wird an Vorder- und Rückseite gespiegelt, die Wellen überlagern sich
        ink(g, L([30, 480], [330, 480]), { w: 2.6, t: 500 })
        ink(g, L([30, 520], [330, 520]), { w: 2.6, t: 500 })
        hatch(g, RR(30, 482, 300, 36, 0), 600)
        const wav = (a: P, b: P, amp: number, n: number): P[] => {
          const dx = b[0] - a[0]
          const dy = b[1] - a[1]
          const len = Math.hypot(dx, dy)
          const out: P[] = []
          for (let i = 0; i <= 80; i++) {
            const t = i / 80
            const o = Math.sin(t * n * Math.PI * 2) * amp
            out.push([a[0] + dx * t - (dy / len) * o, a[1] + dy * t + (dx / len) * o])
          }
          return out
        }
        ink(g, wav([60, 300], [150, 478], 6, 4), { w: 2, d: 700, t: 600 })
        ink(g, wav([152, 478], [240, 300], 6, 4), { w: 2, d: 1100, t: 600 })
        dashes(g, L([150, 480], [172, 518]), { w: 1.4, d: 1200, dash: 3, gap: 3 })
        ink(g, wav([174, 518], [270, 320], 6, 4.4), { w: 2, d: 1400, t: 600 })
        bubble3(g, 300, 600, 36, 1600)
      },
      kalk(g) {
        // Badewanne mit grauem Rand; Lupe: ein Kalkion verklammert zwei Seifenmoleküle
        const tub: P[] = [...B([30, 420], [40, 600], [320, 600], [330, 420])]
        ink(g, tub, { w: 3.4, t: 800 })
        ink(g, L([24, 420], [336, 420]), { w: 3, d: 200, t: 400 })
        for (const x of [70, 290]) ink(g, B([x, 596], [x - 6, 616], [x + 4, 626], [x - 8, 636]), { w: 2.6, d: 600, t: 200 })
        hatch(g, [[36, 480], [324, 480], [322, 490], [38, 490]], 900, true)
        ink(g, waveP(40, 320, 500, 2, 30), { w: 1.4, d: 800, t: 400 })
        blank(g, E(240, 330, 52))
        ink(g, E(240, 330, 52), { w: 2.4, d: 1100, t: 400 })
        ink(g, L([210, 370], [180, 476]), { w: 1.8, d: 1200, t: 200 })
        soap(g, 228, 330, 180, 30, 1300)
        soap(g, 252, 330, 0, 30, 1300)
        ball(g, 240, 330, 9, { d: 1500, w: 1.6, t: 100 })
        text(g, 240, 300, 'Ca', { anchor: 'middle', size: 14, d: 1600 })
      },
      ende(g) {
        soapBig(g, 60, 470, 260, 0)
        for (const [x, y, r] of [[40, 380, 30], [26, 560, -60]] as const) water(g, x, y, 0.8, r, 800)
      },
      reiben(g) {
        // zwei Hände Handfläche an Handfläche, reiben gegeneinander, Schaum dazwischen
        const l = wobble(g, { dy: 14, ms: 700, d: 900 })
        palm(l, 166, 470, -1, 0)
        const r = wobble(g, { dy: -14, ms: 700, d: 900 })
        palm(r, 194, 470, 1, 200)
        for (let k = 0; k < 9; k++) {
          const b = wobble(g, { dx: (k % 2 ? 4 : -4), dy: -6, ms: 900 + k * 80, d: 1100 })
          const x = 170 + ((k * 23) % 40) - 10
          const y = 380 + ((k * 41) % 200)
          ink(b, E(x, y, 4 + (k % 3) * 3), { w: 1.2, d: 1000 + k * 60, t: 150 })
        }
        travelWave(g, 40, 320, 640, 4, 50, { ms: 1400, d: 1200, w: 1.6 })
      },
      verseifung(g) {
        // Fettmolekül (Glycerin-Rückgrat + drei Fettsäuren) + Lauge → Glycerin + drei Seifenmoleküle
        for (let i = 0; i < 3; i++) {
          const y = 330 + i * 40
          ball(g, 40, y, 7, { d: i * 100, fill: 'hell', w: 1.6, t: 100 })
          ink(g, [[47, y], [62, y - 8], [78, y], [94, y - 8], [110, y], [126, y - 8], [142, y]], { w: 1.8, d: 200 + i * 100, t: 300 })
        }
        ink(g, L([40, 337], [40, 403]), { w: 2.4, d: 100, t: 200 })
        mol(g, [[170, 360, 'O', 'hell'], [190, 360, 'H']], [[0, 1]], 0.9, 600)
        text(g, 196, 352, '−', { size: 16, d: 700 })
        text(g, 158, 366, '+', { anchor: 'end', size: 18, d: 650 })
        arrow(g, L([180, 440], [180, 500]), { w: 2.6, d: 900, t: 300, head: 9 })
        for (let i = 0; i < 3; i++) {
          const y = 540 + i * 40
          ball(g, 40, y, 7, { d: 1200 + i * 100, fill: 'hell', w: 1.6, t: 100 })
          ink(g, L([47, y], [62, y]), { w: 1.4, d: 1250, t: 80 })
          text(g, 66, y + 5, 'OH', { size: 13, d: 1300 })
        }
        ink(g, L([40, 547], [40, 613]), { w: 2.4, d: 1200, t: 200 })
        for (let i = 0; i < 3; i++) {
          soap(g, 190, 540 + i * 40, 0, 120, 1400 + i * 120)
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { blasen: {} } },
      { t: T('Wasser und Öl mischen sich nicht. Schüttel sie zusammen – nach kurzer Zeit liegt das Öl wieder **obenauf**.', 64), gfx: { oel: {} } },
      { t: T('Wassermoleküle sind elektrisch ungleich geladen und halten fest zusammen. Fett ist **unpolar** – es wird einfach ausgeschlossen.', 64), gfx: { polar: {} } },
      { t: T('Seife ist ein Vermittler. Ihr Molekül hat einen **wasserliebenden Kopf** …', 64), gfx: { molekuel: { cls: 'a1' } } },
      { t: T('… und einen langen, **fettliebenden Schwanz**.', 64), gfx: { molekuel: { cls: 'a1 a2' } } },
      { t: T('Am Fettfleck bohren sich die Schwänze **ins Fett**. Die Köpfe bleiben draußen im Wasser.', 64), gfx: { fleck: {} } },
      { t: T('Immer mehr Seifenmoleküle umhüllen das Fett, bis es sich als Kügelchen ablöst: eine **Mizelle**.', 64), gfx: { mizelle: {} } },
      { t: T('Außen hat die Mizelle nur Köpfe. Sie ist **wasserfreundlich** – und wird einfach weggespült.', 64), gfx: { weg: {} } },
      { t: T('Dasselbe passiert mit vielen Viren: Sie haben eine **Fetthülle**. Seife reißt sie auf, das Virus zerfällt.', 64), gfx: { virus: { cls: 'a1' } } },
      { t: T('Seife tötet viele Keime gar nicht. Sie **löst sie ab** – und das Wasser spült sie fort.', 64), gfx: { abloesen: {} } },
      { t: T('Darum zählt das **Reiben**: Hände gründlich aneinander, auch zwischen den Fingern und um die Nägel.', 64), gfx: { reiben: {} } },
      { t: T('Darum ist Händewaschen mit Seife so wirksam – wenn du gründlich bist: mindestens **20 Sekunden**.', 64), gfx: { haende: {} } },
      { t: T('Seife ist uralt: Schon in Babylon kochte man vor über **4.000 Jahren** Fett mit Holzasche.', 64), gfx: { alt: {} } },
      { t: T('Die Reaktion heißt **Verseifung**: Eine Lauge spaltet Fett in Seifenmoleküle und Glycerin.', 64), gfx: { verseifung: {} } },
      { t: T('Probier es: Streu Pfeffer auf Wasser und tupf einen Tropfen Spülmittel in die Mitte. Der Pfeffer **flieht** schlagartig zum Rand.', 64), gfx: { pfeffer: {} } },
      { t: T('Das Spülmittel schwächt die **Oberflächenspannung** in der Mitte. Die Wasserhaut am Rand zieht stärker – und reißt den Pfeffer mit.', 64), gfx: { pfeffer: { cls: 'a1' } } },
      { t: T('Seifenblasen funktionieren ähnlich: eine hauchdünne **Wasserschicht** zwischen zwei Lagen Seifenmolekülen.', 64), gfx: { blase: { cls: 'a1' } } },
      { t: T('Die bunten Farben entstehen, weil Licht an Vorder- und Rückseite der Haut **gespiegelt** wird – die beiden Wellen überlagern sich.', 64), gfx: { farben: {} } },
      { t: T('Kurz vor dem Platzen wird die Haut so dünn, dass sie **schwarz** wirkt: nur noch wenige Millionstel Millimeter.', 64), gfx: { blase: { cls: 'a2' } } },
      { t: T('Hartes Wasser bremst Seife: Kalk bildet mit ihr unlösliche **Kalkseife** – den grauen Rand in der Badewanne.', 64), gfx: { kalk: {} } },
      { t: T('Seife ist ein Molekül mit **zwei Gesichtern**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Seifenmoleküle haben einen wasserliebenden Kopf und einen fettliebenden Schwanz.', 'Sie umhüllen Fett zu Mizellen, die das Wasser wegspült.', 'Auch die Fetthülle vieler Viren reißt Seife auf.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Tenside', 'Thordarson 2020: Die Chemie hinter dem Händewaschen (UNSW Sydney)', 'Levey 1954, Isis 45 (Seife in Mesopotamien)'],
  },
  {
    id: 'streusalz',
    area: 'CHE',
    day: 2,
    hook: 'Warum taut Salz Eis – sogar unter null Grad?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [],
    draw: {
      strasse(g) {
        // Straße in Fluchtperspektive, Schneewälle, Laterne, Streuwagen in der Ferne, Salzkörner
        ink(g, [[20, 420], [150, 170], [210, 170], [340, 420]], { w: 3, t: 800 })
        for (const k of [-1, 1]) {
          const bank: P[] = smooth([[180 + k * 160, 420], [180 + k * 150, 380], [180 + k * 100, 290], [180 + k * 40, 180], [180 + k * 30, 170]], 3)
          ink(g, bank, { w: 2, d: 300, t: 600 })
        }
        for (let k = 0; k < 6; k++) {
          const t0 = k / 6
          const t1 = t0 + 0.06
          const y0 = 180 + t0 * t0 * 240
          const y1 = 180 + t1 * t1 * 240
          ink(g, L([180, y0], [180, y1]), { w: 1.4 + t0 * 4, d: 400 + k * 60, t: 100 })
        }
        ink(g, L([300, 420], [290, 220]), { w: 2.6, d: 500, t: 300 })
        ink(g, B([290, 220], [288, 204], [278, 198], [262, 200]), { w: 2.2, d: 700, t: 200 })
        ink(g, [[252, 200], [272, 200], [268, 208], [256, 208], [252, 200]], { w: 1.8, d: 800, t: 150 })
        ripple(g, 262, 214, 6, 30, { n: 2, ms: 2400, d: 1200, w: 0.8, ry: 0.6 })
        car(g, 180, 200, 0.5, 600)
        for (let k = 0; k < 4; k++) flow(g, B([162, 196], [150 - k * 6, 202], [140 - k * 10, 214], [134 - k * 14, 226]), { n: 2, ms: 900, d: 1200 + k * 80, r: 1.2 })
        let seed = 2
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 26; i++) {
          const y = 230 + rnd() * 180
          const half = 30 + ((y - 170) / 250) * 130
          const x = 180 + (rnd() - 0.5) * 2 * half * 0.85
          const z = 2 + ((y - 230) / 180) * 3
          ink(g, RR(x - z, y - z, z * 2, z * 2, 1), { w: 1.2, d: 900 + i * 40, t: 80 })
        }
        for (let i = 0; i < 10; i++) {
          const fl = glide(g, -10, 60, { ms: 3000 + i * 200, d: i * 300, loop: true })
          flake(fl, 30 + i * 32, 90 + (i % 3) * 30, 4 + (i % 2) * 2, 200)
        }
      },
      gleichgewicht(g) {
        // Eisgitter unten, Schmelzwasserfilm darüber; ein Molekül löst sich, eines friert fest
        iceFilm(g, 0)
        const out = glide(g, 10, -70, { ms: 1800, d: 1400, loop: true })
        water(out, 120, 556, 0.8, 0, 1200)
        const inn = glide(g, -6, 74, { ms: 1800, d: 1600, loop: true })
        water(inn, 250, 470, 0.8, 140, 1200)
        thermo(g, 320, 300, 70, 0.5, 600)
      },
      salz(g) {
        // dieselbe Grenze mit gelösten Natrium- und Chlorid-Ionen im Film; x1: das Eis schmilzt zurück
        iceFilm(g, 0)
        for (const [x, y, na] of [[90, 440, true], [190, 424, false], [280, 450, true], [150, 490, false]] as const) {
          const w = wobble(g, { dx: 3, dy: 2, ms: 700 + x, d: 900 })
          ball(w, x, y, na ? 9 : 13, { d: 600, fill: na ? 'dicht' : 'hell', w: 1.8, t: 150 })
          text(w, x, y + 5, na ? '+' : '−', { anchor: 'middle', size: 15, cls: 'halo', d: 700 })
          for (let k = 0; k < 4; k++) water(w, x + Math.cos(rad(k * 90 + 45)) * 22, y + Math.sin(rad(k * 90 + 45)) * 22, 0.4, k * 90 + (na ? 180 : 0), 800 + k * 50)
        }
        const melt = st(g, 'x1', '--o: 180px 540px')
        for (const x of [70, 180, 290]) {
          const up = glide(melt, 0, -60, { ms: 1400, d: x * 3, loop: true })
          water(up, x, 560, 0.7, x, 0)
        }
        hatch(melt, [[20, 522], [340, 522], [340, 540], [20, 540]], 0)
      },
      eiscreme(g) {
        // alte Speiseeismaschine: Holzkübel mit Reifen, Metalldose, Kurbel, dazwischen Eis und Salz
        const tub: P[] = [[60, 380], [80, 620], [280, 620], [300, 380]]
        ink(g, tub, { w: 3, t: 700 })
        for (let k = 1; k < 7; k++) ink(g, L([60 + k * 34.3, 380], [80 + k * 28.6, 620]), { w: 1, d: 300 + k * 40, t: 300 })
        for (const y of [420, 580]) {
          const f = (y - 380) / 240
          ink(g, L([60 + f * 20 - 2, y], [300 - f * 20 + 2, y]), { w: 4, d: 500, t: 300 })
          ink(g, L([60 + f * 20, y + 8], [300 - f * 20, y + 8]), { w: 1, d: 550, t: 300 })
        }
        const can = RR(130, 360, 100, 240, 8)
        blank(g, can)
        hatch(g, RR(134, 430, 92, 166, 6), 900)
        ink(g, can, { w: 2.6, d: 400, t: 600 })
        ink(g, L([180, 360], [180, 320]), { w: 3, d: 700, t: 200 })
        const cr = spin(g, 180, 320, 2400, 1200)
        ink(cr, [[180, 320], [240, 320], [240, 296]], { w: 3, d: 900, t: 300 })
        ball(cr, 240, 290, 7, { d: 1000, fill: 'dicht', w: 1.6, t: 100 })
        for (let i = 0; i < 10; i++) cube(g, i % 2 ? 240 : 86, 400 + Math.floor(i / 2) * 42, 22, 600 + i * 60)
        for (let i = 0; i < 14; i++) ink(g, RR(i % 2 ? 250 : 96, 432 + i * 12, 4, 4, 1), { w: 1, d: 1200 + i * 30, t: 50 })
        for (const [x, y] of [[40, 340], [320, 330], [300, 650]] as const) flake(g, x, y, 9, 1400)
      },
      teilchen(g) {
        // je aufgelöster Einheit: Zucker bleibt ein Molekül, Kochsalz zerfällt in zwei Ionen, Calciumchlorid in drei
        const ring = (x: number, y: number, d: number) => {
          const hx: P[] = Array.from({ length: 7 }, (_, k) => [x + Math.cos(rad(k * 60 + 30)) * 18, y + Math.sin(rad(k * 60 + 30)) * 18])
          ink(g, hx, { w: 2, d, t: 300 })
        }
        ring(70, 400, 0)
        ring(70 + 31, 400 + 18, 100)
        ink(g, L([88, 409], [83, 400]), { w: 1.4, d: 200, t: 80 })
        for (const [x, y, r, l, f] of [[160, 390, 9, 'Na', 'dicht'], [204, 430, 13, 'Cl', 'hell']] as const) {
          ball(g, x, y, r, { d: 500, fill: f, w: 1.8, t: 150 })
          text(g, x, y - r - 6, l, { anchor: 'middle', size: 13, d: 600 })
        }
        for (const [x, y, r, l, f] of [[270, 380, 10, 'Ca', 'dicht'], [300, 430, 13, 'Cl', 'hell'], [250, 444, 13, 'Cl', 'hell']] as const) {
          ball(g, x, y, r, { d: 900, fill: f, w: 1.8, t: 150 })
          text(g, x, y - r - 6, l, { anchor: 'middle', size: 13, d: 1000 })
        }
        for (const [x, n] of [[85, 1], [182, 2], [275, 3]] as const) {
          ink(g, L([x - 40, 490], [x + 40, 490]), { w: 1.4, d: 1100, t: 200 })
          for (let k = 0; k < n; k++) ink(g, RR(x - 20, 630 - k * 44, 40, 40, 4), { w: 2.4, d: 1200 + k * 150, t: 200 })
          for (let k = 0; k < n; k++) hatch(g, RR(x - 20, 630 - k * 44, 40, 40, 4), 1300 + k * 150, n === 3)
        }
        const x1 = st(g, 'x1', '--o: 275px 520px')
        ink(x1, RR(222, 336, 106, 314, 14), { w: 2.4, t: 0 })
      },
      meer(g) {
        // Polarmeer: Pfannkucheneis an der Oberfläche, Thermometer im Wasser
        travelWave(g, 20, 340, 400, 5, 70, { ms: 3000, w: 2.4 })
        for (const [x, w] of [[60, 40], [140, 56], [230, 44], [300, 34]] as const) {
          const b = wobble(g, { dy: 3, ms: 2200 + x * 4, d: 900 })
          const pan: P[] = E(x, 398, w / 2, 7)
          blank(b, pan)
          hatch(b, pan, 600, true)
          ink(b, pan, { w: 2, d: 500, t: 300 })
          ink(b, E(x, 396, w / 2 - 4, 4), { w: 1, d: 700, t: 300 })
        }
        thermo(g, 180, 450, 150, 0.28, 600)
        for (const y of [470, 520, 570]) ink(g, L([196, y], [206, y]), { w: 1.4, d: 900, t: 60 })
        ink(g, L([196, 545], [212, 545]), { w: 2.4, d: 1100, t: 80 })
        for (let k = 0; k < 6; k++) ink(g, waveP(20, 340, 470 + k * 30, 2, 50, k), { w: 0.8, d: 300 + k * 60, t: 600 })
      },
      meereis(g) {
        // Meereis im Schnitt: Solekanäle tropfen nach unten, das Salz sinkt aus dem Eis
        ink(g, waveP(20, 340, 420, 3, 60), { w: 2.4, t: 600 })
        const floe: P[] = [[40, 410], [70, 380], [290, 376], [320, 410], [310, 500], [60, 504], [40, 410]]
        blank(g, floe)
        ink(g, floe, { w: 3, d: 200, t: 700 })
        for (let k = 0; k < 6; k++) {
          const x = 80 + k * 40
          const ch: P[] = smooth([[x, 390], [x + 4, 420], [x - 4, 450], [x + 2, 500]], 3)
          ink(g, ch, { w: 1.4, d: 600 + k * 60, t: 300 })
          for (const y of [410, 440, 470]) hatch(g, E(x + (y % 3), y, 3, 6), 800 + k * 60, true)
          const dr = glide(g, 0, 120, { ms: 2400 + k * 200, d: 1200 + k * 200, loop: true })
          ball(dr, x + 2, 510, 3.6, { d: 1000, fill: 'dicht', w: 1.2, t: 60 })
        }
        for (let k = 0; k < 8; k++) water(g, 50 + k * 40, 600 + (k % 2) * 20, 0.45, k * 45, 1400 + k * 40)
      },
      nachteile(g) {
        // Auto mit Rostflecken, Straßenbaum mit welken Blättern, versalzter Boden
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, [[20, 562], [340, 562], [340, 650], [20, 650]], 300)
        car(g, 130, 560, 2.2, 300)
        for (const [x, y, r] of [[72, 536, 7], [96, 528, 5], [160, 534, 6], [210, 528, 4]] as const) {
          const sp: P[] = smooth(Array.from({ length: 7 }, (_, k) => [x + Math.cos(rad(k * 60)) * r * (1 + (k % 2) * 0.4), y + Math.sin(rad(k * 60)) * r * 0.7] as P), 3)
          hatch(g, sp, 1000, true)
          ink(g, sp, { w: 1.2, d: 1000, t: 150 })
        }
        tree(g, 300, 560, 0.7, 600)
        for (let k = 0; k < 5; k++) {
          const lf = glide(g, -10 - k * 6, 120, { ms: 2600 + k * 300, d: 1400 + k * 400, loop: true })
          leaf(lf, 290 + k * 8, 420 + k * 6, 0.18, 1200)
        }
        for (let i = 0; i < 14; i++) ink(g, RR(30 + i * 22, 590 + (i % 3) * 16, 5, 5, 1), { w: 1.2, d: 1300 + i * 30, t: 50 })
      },
      sole(g) {
        // Streuwagen mit Sprühbalken: feiner Solefilm statt Salzkörnern
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        const cab: P[] = [[250, 596], [250, 470], [300, 470], [330, 520], [334, 596]]
        ink(g, cab, { w: 2.8, d: 200, t: 500 })
        ink(g, [[262, 480], [296, 480], [318, 518], [262, 518], [262, 480]], { w: 1.6, d: 400, t: 300 })
        const tank = RR(60, 450, 180, 120, 50)
        hatch(g, RR(64, 500, 172, 66, 30), 700)
        ink(g, tank, { w: 3, d: 300, t: 600 })
        ink(g, L([60, 576], [334, 576]), { w: 2.6, d: 400, t: 400 })
        for (const x of [100, 200, 300]) {
          blank(g, E(x, 596, 20))
          ink(g, E(x, 596, 20), { w: 2.6, d: 500, t: 300 })
          const wh = spin(g, x, 596, 1200, 900)
          for (let k = 0; k < 3; k++) ink(wh, L([x, 596], [x + Math.cos(rad(k * 120)) * 12, 596 + Math.sin(rad(k * 120)) * 12]), { w: 1.4, d: 700, t: 100 })
        }
        ink(g, L([20, 580], [70, 580]), { w: 2.6, d: 600, t: 200 })
        for (let k = 0; k < 5; k++) {
          const p = L([28 + k * 10, 584], [20 + k * 14, 628])
          flow(g, p, { n: 3, ms: 600, d: 1000 + k * 60, r: 1.2 })
        }
        for (let k = 0; k < 5; k++) ink(g, L([30 + k * 8, 640], [44 + k * 8, 640]), { w: 1.2, d: 1200, t: 100 })
      },
      kuehler(g) {
        // Motorraum: Kühler mit Lamellen, Schläuche, Ausgleichsbehälter; Frost draußen
        ink(g, RR(40, 380, 160, 220, 6), { w: 3, t: 600 })
        for (let k = 0; k < 18; k++) ink(g, L([50 + k * 8.5, 392], [50 + k * 8.5, 588]), { w: 0.9, d: 300 + k * 20, t: 200 })
        for (const y of [390, 590]) ink(g, L([40, y], [200, y]), { w: 2.2, d: 400, t: 200 })
        const hose1 = B([200, 420], [250, 420], [260, 380], [300, 380])
        const hose2 = B([200, 560], [250, 560], [270, 600], [310, 600])
        for (const h of [hose1, hose2]) {
          ink(g, h, { w: 8, d: 600, t: 400 })
          blank(g, h)
          flow(g, h, { n: 2, ms: 1400, d: 1200, r: 2 })
        }
        ink(g, RR(250, 440, 60, 90, 8), { w: 2.4, d: 700, t: 400 })
        hatch(g, RR(254, 480, 52, 46, 6), 900)
        ink(g, RR(266, 428, 28, 12, 3), { w: 2, d: 800, t: 150 })
        thermo(g, 320, 300, 70, 0.08, 900)
        for (const [x, y] of [[70, 330], [150, 310], [230, 340]] as const) flake(g, x, y, 10, 1100)
      },
      nudeln(g) {
        // Topf auf der Herdplatte, Salzstreuer, siedendes Wasser, Thermometer knapp über 100
        ink(g, [[70, 420], [80, 600], [260, 600], [270, 420]], { w: 3, t: 700 })
        ink(g, L([60, 420], [280, 420]), { w: 3, d: 200, t: 400 })
        for (const k of [-1, 1]) ink(g, L([170 + k * 100, 440], [170 + k * 122, 440]), { w: 3.4, d: 300, t: 150 })
        hatch(g, RR(84, 450, 172, 146, 4), 500)
        for (let k = 0; k < 8; k++) {
          const b = glide(g, 0, -60, { ms: 900 + k * 80, d: 800 + k * 120, loop: true })
          ink(b, E(100 + k * 20, 580 - (k % 3) * 20, 4 + (k % 3)), { w: 1.4, d: 700, t: 100 })
        }
        ink(g, RR(60, 604, 220, 14, 4), { w: 2.6, d: 400, t: 300 })
        for (let k = 0; k < 4; k++) ink(g, B([120 + k * 30, 410], [110 + k * 30, 380], [130 + k * 30, 360], [120 + k * 30, 330]), { w: 1.4, d: 1000 + k * 80, t: 300 })
        const shaker = wobble(g, { deg: 10, ox: 300, oy: 340, ms: 500, d: 1200 })
        ink(shaker, RR(282, 300, 36, 56, 8), { w: 2.4, d: 900, t: 300 })
        ink(shaker, RR(286, 288, 28, 14, 4), { w: 2, d: 1000, t: 150 })
        for (let k = 0; k < 3; k++) dot(shaker, 292 + k * 8, 294, 1.4, 1100)
        flow(g, L([292, 290], [240, 410]), { n: 4, ms: 900, d: 1400, r: 1.4 })
      },
      fisch(g) {
        // Antarktischer Eisfisch; in der Lupe hängen Frostschutz-Eiweiße an einem Eiskeim
        const f: P[] = [...B([40, 520], [80, 470], [220, 460], [300, 510]), ...B([300, 510], [230, 560], [90, 566], [40, 520]).slice(1)]
        blank(g, f)
        hatch(g, [...B([60, 534], [120, 556], [220, 552], [290, 516]), [60, 534]], 700)
        ink(g, f, { w: 3, t: 800 })
        ink(g, [[300, 510], [340, 476], [332, 512], [342, 548], [300, 510]], { w: 2.6, d: 300, t: 400 })
        ink(g, B([120, 474], [150, 430], [190, 432], [220, 464]), { w: 2, d: 500, t: 300 })
        ink(g, B([90, 486], [96, 506], [96, 526], [88, 546]), { w: 2, d: 600, t: 200 })
        blank(g, E(64, 508, 7))
        ink(g, E(64, 508, 7), { w: 1.8, d: 700, t: 150 })
        dot(g, 64, 508, 3, 800)
        ink(g, B([40, 520], [50, 526], [60, 528], [70, 526]), { w: 1.6, d: 700, t: 150 })
        for (let k = 0; k < 6; k++) ink(g, B([140 + k * 22, 486], [146 + k * 22, 496], [140 + k * 22, 506], [146 + k * 22, 516]), { w: 0.9, d: 800 + k * 40, t: 100 })
        ink(g, E(240, 360, 56), { w: 2.6, d: 1000, t: 400 })
        ink(g, L([210, 406], [190, 470]), { w: 1.8, d: 1100, t: 200 })
        const hx: P[] = Array.from({ length: 7 }, (_, k) => [240 + Math.cos(rad(k * 60)) * 18, 360 + Math.sin(rad(k * 60)) * 18])
        hatch(g, hx, 1300)
        ink(g, hx, { w: 2, d: 1200, t: 300 })
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60 + 30)
          const px = 240 + Math.cos(a) * 26
          const py = 360 + Math.sin(a) * 26
          ink(g, smooth([[px - Math.sin(a) * 8, py + Math.cos(a) * 8], [px + Math.cos(a) * 8, py + Math.sin(a) * 8], [px + Math.sin(a) * 8, py - Math.cos(a) * 8]], 3), { w: 2.4, d: 1400 + k * 80, t: 150 })
        }
      },
      ende(g) {
        for (let i = 0; i < 5; i++) cube(g, 90 + i * 40, 480 + (i % 2) * 18, 26, i * 100)
        flake(g, 180, 380, 30, 700)
        const t = glide(g, 0, 40, { ms: 1600, d: 1400, loop: true })
        drop(t, 270, 380, 0.5, 1300)
      },
      gefrier(g) {
        // Gefrierpunkt sinkt mit dem Salzgehalt, bis etwa −21 °C bei 23 %
        axes(g, 60, 360, 330, 640, { d: 0 })
        for (const [v, l] of [[0, '0'], [-10, '−10'], [-20, '−20']] as const) {
          const y = 360 + (-v / 22) * 260
          ink(g, L([54, y], [66, y]), { w: 1.6, d: 300, t: 80 })
          text(g, 48, y + 5, l, { anchor: 'end', cls: 's', d: 400 })
        }
        for (const [v, l] of [[10, '10 %'], [20, '20 %']] as const) {
          const x = 60 + (v / 25) * 260
          ink(g, L([x, 354], [x, 366]), { w: 1.6, d: 300, t: 80 })
          text(g, x, 340, l, { anchor: 'middle', cls: 's', d: 400 })
        }
        const pts = plot(g, 60, 360, 240, -1, (t) => (21 * (0.85 * t + 0.15 * t * t) * 260) / 22, { d: 600, t: 1200 })
        const end = pts[pts.length - 1]
        dot(g, end[0], end[1], 5, 1700)
        ripple(g, end[0], end[1], 6, 26, { n: 2, ms: 1600, d: 1900, w: 1 })
        for (let k = 0; k < 4; k++) {
          const x = 120 + k * 50
          for (let j = 0; j < k + 1; j++) ink(g, RR(x - 6 + (j % 2) * 8, 300 - Math.floor(j / 2) * 10, 7, 7, 1), { w: 1.2, d: 800 + k * 120 + j * 40, t: 60 })
        }
      },
      kalt(g) {
        // Schüssel mit Eiswürfeln und Salz: Wärme fließt von außen hinein, das Thermometer fällt
        ink(g, B([40, 470], [50, 620], [270, 620], [280, 470]), { w: 3, t: 700 })
        ink(g, E(160, 470, 120, 20), { w: 2.4, d: 200, t: 500 })
        for (let i = 0; i < 7; i++) cube(g, 70 + (i % 4) * 46 + (i > 3 ? 22 : 0), 460 + (i > 3 ? 30 : 0), 30, 400 + i * 80)
        for (let i = 0; i < 16; i++) ink(g, RR(74 + ((i * 37) % 160), 452 + ((i * 13) % 50), 4, 4, 1), { w: 1, d: 1000 + i * 30, t: 50 })
        for (const [a, b] of [[[0, 560], [44, 560]], [[160, 680], [160, 626]], [[340, 560], [282, 560]]] as const) {
          flow(g, L(a as P, b as P), { n: 2, ms: 1200, d: 1200, r: 2.2 })
          arrow(g, L(a as P, b as P), { w: 1.6, d: 1100, t: 300, head: 7 })
        }
        thermo(g, 230, 330, 140, 0.12, 900)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { strasse: {} } },
      { t: T('Eis ist nie ganz ruhig: An seiner Oberfläche lösen sich ständig Moleküle ins Schmelzwasser – und andere **frieren fest**.', 64), gfx: { gleichgewicht: {} } },
      { t: T('Bei null Grad halten sich beide Vorgänge die **Waage**. Es scheint nichts zu passieren.', 64), gfx: { gleichgewicht: {} } },
      { t: T('Salz löst sich im dünnen Wasserfilm auf dem Eis. Die Salz-Teilchen stehen den Wassermolekülen beim Festfrieren **im Weg**.', 64), gfx: { salz: {} } },
      { t: T('Nun frieren weniger Moleküle fest, als sich lösen – das Eis **schmilzt**, obwohl es unter null Grad ist.', 64), gfx: { salz: { cls: 'a1' } } },
      { t: T('Das heißt **Gefrierpunktserniedrigung**: Salzwasser gefriert erst bei tieferen Temperaturen als reines Wasser.', 64), gfx: { gefrier: {} } },
      { t: T('Mit Kochsalz geht das bis etwa **minus 21 Grad**. Ist es kälter, taut Streusalz nichts mehr.', 64), gfx: { gefrier: {} } },
      { t: T('Das Schmelzen braucht Energie, und die kommt aus der Umgebung. Eine Mischung aus Eis und Salz wird darum **eiskalt**.', 64), gfx: { kalt: {} } },
      { t: T('So machte man früher Speiseeis: Eis mit Salz im äußeren Kübel kühlte die Creme auf **unter minus 10 Grad**.', 64), gfx: { eiscreme: {} } },
      { t: T('Es kommt nicht auf die Sorte an, sondern auf die **Zahl der Teilchen**. Zucker wirkt auch – nur viel schwächer.', 64), gfx: { teilchen: {} } },
      { t: T('Calciumchlorid zerfällt in **drei** Teilchen statt zwei. Es taut noch bei Temperaturen weit unter minus 21 Grad.', 64), gfx: { teilchen: { cls: 'a1' } } },
      { t: T('Derselbe Effekt lässt das Meer erst bei etwa **minus 2 Grad** gefrieren.', 64), gfx: { meer: {} } },
      { t: T('Und gefriert Meerwasser, bleibt das meiste Salz draußen: Junges **Meereis** ist erstaunlich salzarm.', 64), gfx: { meereis: {} } },
      { t: T('Streusalz hat Nachteile: Es lässt Autos **rosten**, schadet Straßenbäumen und versalzt Böden.', 64), gfx: { nachteile: {} } },
      { t: T('Viele Städte setzen darum auf Splitt oder **Sole**: Salzlösung, die vorbeugend in kleiner Menge aufs Pflaster gesprüht wird.', 64), gfx: { sole: {} } },
      { t: T('Frostschutz im Auto nutzt dasselbe Prinzip: Glykol im Kühlwasser senkt den Gefrierpunkt **weit unter minus 30 Grad**.', 64), gfx: { kuehler: {} } },
      { t: T('Und Salz im Nudelwasser? Es hebt den Siedepunkt nur um **Bruchteile eines Grades**. Es dient allein dem Geschmack.', 64), gfx: { nudeln: {} } },
      { t: T('Fische im Polarmeer nutzen einen anderen Trick: **Frostschutz-Eiweiße** im Blut, die winzige Eiskristalle umklammern, bevor sie wachsen.', 64), gfx: { fisch: {} } },
      { t: T('Salz taut Eis, weil es dem Wasser das **Gefrieren** schwer macht.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Gelöste Salz-Teilchen behindern das Festfrieren – Eis schmilzt unter 0 °C.', 'Es zählt die Zahl gelöster Teilchen; Kochsalz wirkt bis etwa −21 °C.', 'Das Schmelzen entzieht Wärme: Eis plus Salz wird eiskalt.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Kolligative Eigenschaften', 'Umweltbundesamt: Streusalz', 'DeVries 1971, Science 172 (Frostschutzproteine)'],
  },
  {
    id: 'popcorn',
    area: 'CHE',
    day: 2,
    hook: 'Warum ploppt Popcorn – und anderer Mais nicht?',
    mood: 'verspielt',
    ambience: 'feuer',
    images: [],
    draw: {
      flocken(g) {
        // gestreifte Kinotüte, Flocken quellen oben heraus, einzelne fliegen
        const bag: P[] = [[100, 230], [260, 230], [240, 440], [120, 440], [100, 230]]
        for (let k = 0; k < 4; k++) {
          const x0 = 100 + k * 40
          const st0: P[] = [[x0, 230], [x0 + 20, 230], [x0 + 20 - (k < 2 ? -5 : 5) * (k + 0.5) * 0.4, 440], [x0 - (k < 2 ? -5 : 5) * (k + 0.5) * 0.4, 440]]
          hatch(g, [...st0, st0[0]], 500 + k * 80, true)
        }
        ink(g, bag, { w: 3, t: 700 })
        ink(g, L([98, 244], [262, 244]), { w: 1.6, d: 300, t: 300 })
        for (const [x, y, s] of [[120, 214, 0.8], [160, 200, 0.9], [205, 206, 0.85], [245, 216, 0.75], [140, 180, 0.7], [190, 172, 0.8], [230, 184, 0.7]] as const) puff(g, x, y, s, 200 + x * 3)
        for (let i = 0; i < 4; i++) {
          const f = glide(g, (i % 2 ? 40 : -40), -60, { ms: 1800 + i * 300, d: 900 + i * 400, loop: true })
          puff(f, 120 + i * 40, 150 - (i % 2) * 20, 0.5, 900 + i * 100)
        }
      },
      maschine(g) {
        // Korn in der heißen Pfanne: Dampf kreist eingeschlossen in der Schale
        kernel(g, 180, 440, 1.9, 0)
        for (let k = 0; k < 3; k++) {
          const a0 = k * 120
          flow(g, E(180, 430, 40, 50, a0, a0 + 300), { n: 2, ms: 1400, d: 900 + k * 150, r: 2, kind: 'ring' })
        }
        ink(g, B([40, 570], [50, 600], [310, 600], [320, 570]), { w: 3, d: 300, t: 500 })
        ink(g, L([320, 576], [350, 566]), { w: 3, d: 400, t: 200 })
        for (let k = 0; k < 6; k++) {
          const fw = wobble(g, { deg: 5, ox: 105 + k * 30, oy: 640, ms: 500 + k * 70, d: 900 })
          flame(fw, 105 + k * 30, 640, 0.3, 700 + k * 50)
        }
      },
      schnitt(g) {
        // Schnitt: Schale, Stärkezellen, eingeschlossene Wassertröpfchen, Keimling
        kernel(g, 180, 470, 2.4, 0)
        for (let i = 0; i < 8; i++) {
          const w = wobble(g, { dx: 2, dy: 2, ms: 600 + i * 70, d: 1000 })
          water(w, 120 + (i % 4) * 40, 400 + Math.floor(i / 4) * 60 + (i % 2) * 14, 0.35, i * 45, 900 + i * 60)
        }
      },
      druck(g) {
        // Dampf drückt von innen gegen die Schale, die sich spannt
        const sw = wobble(g, { deg: 0, dx: 0, dy: -2, ms: 400, d: 1200 })
        kernel(sw, 180, 470, 2.2, 0)
        for (let k = 0; k < 10; k++) {
          const a = rad(k * 36)
          arrow(g, L([180 + Math.cos(a) * 30, 460 + Math.sin(a) * 34], [180 + Math.cos(a) * 92, 460 + Math.sin(a) * 104]), { w: 2, d: 700 + k * 60, t: 200, head: 7 })
        }
        for (let k = 0; k < 6; k++) flow(g, L([180 + Math.cos(rad(k * 60)) * 10, 460 + Math.sin(rad(k * 60)) * 10], [180 + Math.cos(rad(k * 60)) * 80, 460 + Math.sin(rad(k * 60)) * 90]), { n: 2, ms: 500, d: 1000 + k * 60, r: 1.8 })
      },
      zahl180(g) {
        // Thermometer mit Skala und Manometer, dessen Zeiger auf das Neunfache steigt
        ink(g, RR(56, 320, 40, 300, 20), { w: 1.4, t: 500 })
        thermo(g, 76, 330, 240, 0.78, 200)
        for (const [v, l] of [[0, '0'], [100, '100'], [200, '200']] as const) {
          const y = 330 + 8 + (240 - 8) * (1 - v / 230)
          ink(g, L([96, y], [108, y]), { w: 1.6, d: 400, t: 60 })
          text(g, 112, y + 5, l, { cls: 's', d: 500 })
        }
        const cx = 240
        const cy = 470
        ink(g, E(cx, cy, 80), { w: 3.2, d: 600, t: 600 })
        ink(g, E(cx, cy, 70), { w: 1.2, d: 700, t: 600 })
        for (let v = 0; v <= 10; v++) {
          const a = rad(135 + v * 27)
          ink(g, L([cx + Math.cos(a) * 58, cy + Math.sin(a) * 58], [cx + Math.cos(a) * 68, cy + Math.sin(a) * 68]), { w: v % 5 ? 1 : 2, d: 800 + v * 30, t: 50 })
          if (v % 5 === 0) text(g, cx + Math.cos(a) * 44, cy + Math.sin(a) * 44 + 5, String(v), { anchor: 'middle', size: 14, cls: 'halo', d: 900 })
        }
        hatch(g, [[cx, cy], ...E(cx, cy, 68, 68, 135 + 8 * 27, 135 + 10 * 27), [cx, cy]], 1100, true)
        ink(g, RR(cx - 10, cy + 80, 20, 30, 3), { w: 2.2, d: 700, t: 200 })
        const nd = mk('g', {}, g)
        mk('animateTransform', { attributeName: 'transform', type: 'rotate', from: `0 ${cx} ${cy}`, to: `${9 * 27} ${cx} ${cy}`, dur: '2.4s', begin: '1.2s', fill: 'freeze' }, nd)
        ink(nd, [[cx - 4, cy + 4], [cx + Math.cos(rad(135)) * 60, cy + Math.sin(rad(135)) * 60], [cx + 4, cy - 4]], { w: 2.4, d: 1100, t: 150 })
        dot(g, cx, cy, 5, 1200)
      },
      platzen(g) {
        // die Schale reißt auf, die Hälften fliegen weg, der Schaum quillt heraus
        for (const k of [-1, 1]) {
          const h = glide(g, k * 60, -40 + k * 10, { ms: 600, d: 900 })
          const half: P[] = [...B([180, 400], [180 + k * 60, 404], [180 + k * 64, 480], [180 + k * 22, 530])]
          hatch(h, [...half, ...B([180 + k * 18, 520], [180 + k * 54, 476], [180 + k * 50, 410], [180, 410])], 300, true)
          ink(h, half, { w: 3.2, d: 0, t: 300 })
        }
        const foam = pop(g, 1000, '50% 50%')
        puff(foam, 180, 470, 2, 0)
        for (let k = 0; k < 10; k++) {
          const a = rad(k * 36 + 10)
          ink(g, L([180 + Math.cos(a) * 110, 470 + Math.sin(a) * 110], [180 + Math.cos(a) * 140, 470 + Math.sin(a) * 140]), { w: 2, d: 1100 + k * 30, t: 100 })
        }
        ripple(g, 180, 470, 40, 160, { n: 2, ms: 1200, d: 1100, w: 1.2 })
      },
      schaum(g) {
        // Lupe: erstarrter Stärkeschaum aus vielen Blasen; a1: Korn neben Flocke im gleichen Maßstab
        const h1 = st(g, 'h1', '')
        puff(h1, 110, 470, 2.2, 0)
        blank(h1, E(250, 420, 80))
        ink(h1, E(250, 420, 80), { w: 3, d: 400, t: 500 })
        ink(h1, L([190, 474], [140, 500]), { w: 2, d: 500, t: 200 })
        const c = clipBox(h1, 170, 340, 160, 160)
        let seed = 9
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let r = 0; r < 6; r++) for (let k = 0; k < 6; k++) {
          const x = 180 + k * 28 + (r % 2) * 14 + rnd() * 6
          const y = 350 + r * 26 + rnd() * 6
          const rr = 9 + rnd() * 5
          ink(c, Array.from({ length: 7 }, (_, j) => [x + Math.cos(rad(j * 60 + 30)) * rr, y + Math.sin(rad(j * 60 + 30)) * rr * 0.9] as P), { w: 1.4, d: 600 + (r * 6 + k) * 20, t: 80 })
        }
        const x1 = st(g, 'x1', '--o: 180px 500px')
        kernel(x1, 70, 560, 0.4, 0)
        puff(x1, 230, 480, 3, 0)
        ink(x1, L([30, 640], [330, 640]), { w: 1.6, t: 0 })
        for (let k = 0; k <= 10; k++) ink(x1, L([30 + k * 30, 634], [30 + k * 30, 646]), { w: 1.2, t: 0 })
      },
      plopp(g) {
        // Hochgeschwindigkeitskamera filmt: Dampfstrahl aus dem Riss, Schallwellen
        puff(g, 110, 480, 1.6, 0)
        for (let k = 0; k < 4; k++) flow(g, L([150, 470 - k * 6], [230, 440 - k * 18]), { n: 3, ms: 600, d: 600 + k * 80, r: 1.8, kind: 'ring' })
        ripple(g, 170, 460, 20, 140, { n: 3, ms: 1400, d: 900, w: 1.4 })
        const cam: P[] = RR(250, 330, 80, 50, 6)
        blank(g, cam)
        ink(g, cam, { w: 2.6, d: 300, t: 400 })
        ink(g, [[250, 344], [226, 336], [226, 376], [250, 368]], { w: 2.2, d: 400, t: 200 })
        ink(g, E(300, 322, 10, 6), { w: 1.6, d: 500, t: 150 })
        dot(g, 318, 342, 3, 600)
        for (const x of [270, 310]) ink(g, L([x, 380], [x + (x - 290) * 0.6, 430]), { w: 2, d: 600, t: 200 })
      },
      sprung(g) {
        // stroboskopische Bahn: ein Stärke-„Bein“ stößt das Korn vom Pfannenboden ab
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 400 })
        hatch(g, [[20, 602], [340, 602], [340, 620], [20, 620]], 200, true)
        const path: P[] = Array.from({ length: 21 }, (_, i) => [70 + i * 12, 580 - Math.sin((i / 20) * Math.PI) * 230] as P)
        dashes(g, path, { w: 1.2, d: 600, dash: 4, gap: 5 })
        kernel(g, 70, 572, 0.32, 300)
        ink(g, B([66, 590], [60, 594], [54, 598], [50, 600]), { w: 3, d: 500, t: 150 })
        for (const [i, s] of [[5, 0.6], [10, 0.8], [15, 0.85]] as const) {
          const [x, y] = path[i]
          const p = pop(g, 700 + i * 60, '50% 50%')
          puff(p, x, y, s, 0)
        }
        puff(pop(g, 1800, '50% 50%'), 310, 572, 0.85, 0)
      },
      zeit(g) {
        // Filmstreifen: vier Bilder im Abstand von zehn Millisekunden
        ink(g, RR(20, 380, 320, 160, 4), { w: 2.8, t: 600 })
        for (const y of [390, 530]) for (let k = 0; k < 16; k++) ink(g, RR(26 + k * 20, y - 5, 10, 8, 2), { w: 1, d: 300 + k * 20, t: 50 })
        for (let k = 1; k < 4; k++) ink(g, L([20 + k * 80, 400], [20 + k * 80, 520]), { w: 1.6, d: 400, t: 200 })
        kernel(g, 60, 460, 0.55, 600)
        kernel(g, 140, 460, 0.55, 800)
        ink(g, [[140, 430], [146, 444], [138, 456]], { w: 2, d: 1000, t: 100 })
        puff(g, 220, 460, 0.8, 1100)
        puff(g, 300, 460, 1.1, 1300)
        for (const [k, l] of [[0, '0 ms'], [1, '10 ms'], [2, '20 ms'], [3, '30 ms']] as const) text(g, 60 + k * 80, 580, l, { anchor: 'middle', cls: 's', d: 600 + k * 200 })
      },
      zuckermais(g) {
        // links Zuckermais: runzlige, poröse Schale, Dampf entweicht; rechts Popcornmais: glatt, dicht, Druck bleibt
        const wr: P[] = smooth([[100, 400], [140, 410], [150, 470], [130, 530], [100, 544], [70, 530], [50, 470], [60, 410], [100, 400]], 4).map(([x, y], i): P => [x + Math.sin(i * 1.3) * 3, y + Math.cos(i * 1.7) * 3])
        blank(g, wr)
        ink(g, wr, { w: 2.6, t: 600 })
        for (const p of [[[70, 430], [84, 450], [74, 470]], [[120, 440], [110, 470], [126, 500]]] as P[][]) ink(g, p, { w: 1.2, d: 400, t: 200 })
        for (let k = 0; k < 6; k++) {
          const a = rad(-100 + k * 40)
          const p = L([100 + Math.cos(a) * 40, 472 + Math.sin(a) * 56], [100 + Math.cos(a) * 80, 472 + Math.sin(a) * 96])
          flow(g, p, { n: 2, ms: 900, d: 900 + k * 60, r: 1.8, kind: 'ring' })
        }
        kernel(g, 260, 470, 1.1, 400)
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60)
          arrow(g, L([260 + Math.cos(a) * 10, 466 + Math.sin(a) * 12], [260 + Math.cos(a) * 34, 466 + Math.sin(a) * 40]), { w: 1.6, d: 1000 + k * 50, t: 150, head: 5 })
        }
        const x1 = st(g, 'x1', '--o: 260px 470px')
        ink(x1, [...B([260, 400], [320, 404], [318, 490], [276, 538]), [244, 538], ...B([244, 538], [202, 490], [200, 404], [260, 400]).slice(1)], { w: 4.4, t: 0 })
      },
      jungfer(g) {
        // Korn mit Riss: Dampf zischt heraus, das Korn bleibt hart; daneben eine Flocke
        kernel(g, 130, 480, 1.4, 0)
        ink(g, [[160, 408], [152, 430], [168, 448], [158, 468]], { w: 2.4, d: 700, t: 200 })
        for (let k = 0; k < 3; k++) flow(g, B([162, 430 + k * 10], [190, 410 + k * 8], [220, 390], [250, 360 - k * 10]), { n: 2, ms: 900, d: 1000 + k * 100, r: 1.8, kind: 'ring' })
        puff(g, 280, 560, 1, 900)
        ink(g, L([20, 600], [340, 600]), { w: 2.4, d: 200, t: 500 })
      },
      mikro(g) {
        // Mikrowelle: Tür mit Lochgitter, Bedienfeld, Drehteller; die Tüte bläht sich, Wellen erreichen das Wasser im Korn
        ink(g, RR(30, 360, 300, 220, 14), { w: 3, t: 700 })
        ink(g, RR(48, 378, 200, 184, 8), { w: 2.2, d: 200, t: 500 })
        const c = clipBox(g, 52, 382, 192, 176)
        for (let r = 0; r < 18; r++) for (let k = 0; k < 20; k++) if ((r + k) % 2 === 0) dot(c, 56 + k * 10, 386 + r * 10, 0.9, 300 + r * 10)
        ink(g, RR(262, 380, 52, 26, 4), { w: 2, d: 400, t: 200 })
        text(g, 288, 400, '2:30', { anchor: 'middle', size: 14, d: 500 })
        for (let k = 0; k < 2; k++) for (let j = 0; j < 3; j++) ink(g, RR(266 + k * 24, 424 + j * 26, 18, 16, 3), { w: 1.4, d: 500 + (k * 3 + j) * 40, t: 80 })
        ink(g, E(288, 530, 14), { w: 2, d: 600, t: 200 })
        const bag = wobble(g, { dy: -6, ms: 900, d: 1200 })
        const b: P[] = smooth([[90, 520], [100, 470], [150, 456], [200, 470], [210, 520], [150, 530], [90, 520]], 3)
        blank(bag, b)
        ink(bag, b, { w: 2.4, d: 700, t: 400 })
        hatch(bag, [[110, 520], [190, 520], [194, 500], [106, 500]], 900)
        ink(g, E(150, 540, 80, 8), { w: 1.8, d: 600, t: 300 })
        for (let k = 0; k < 3; k++) travelWave(g, 60, 240, 410 + k * 24, 5, 30, { ms: 900, d: 900 + k * 100, w: 1.2 })
      },
      formen(g) {
        // Schmetterling mit Flügeln; Pilz als runde, feste Kugel mit Karamellüberzug
        puff(g, 100, 470, 1.3, 0)
        for (const k of [-1, 1]) {
          const wing: P[] = smooth([[100 + k * 24, 452], [100 + k * 70, 400], [100 + k * 90, 440], [100 + k * 70, 480], [100 + k * 34, 488]], 3)
          ink(g, wing, { w: 2.2, d: 500, t: 300 })
          ink(g, smooth([[100 + k * 34, 460], [100 + k * 60, 430], [100 + k * 72, 450]], 3), { w: 1, d: 700, t: 200 })
        }
        const ball0: P[] = smooth(Array.from({ length: 13 }, (_, k) => [260 + Math.cos(rad(k * 30)) * (44 + (k % 2) * 6), 470 + Math.sin(rad(k * 30)) * (44 + (k % 2) * 6)] as P), 3)
        blank(g, ball0)
        hatch(g, ball0, 900, true)
        ink(g, ball0, { w: 2.8, d: 400, t: 500 })
        for (const x of [240, 262, 284]) {
          const dr = glide(g, 0, 16, { ms: 1600, d: 1300 + x * 2, loop: true })
          drop(dr, x, 528, 0.3, 1100)
        }
      },
      peru(g) {
        // Südamerika, Fundort an der Küste Perus (Paredones / Huaca Prieta), daneben ein uralter kleiner Kolben
        const pr = mapRegion(g, 30, 300, 190, 340, -90, -30, -56, 14, 0)
        const [x, y] = pr(-79.3, -7.9)
        dot(g, x, y, 5, 1200)
        ripple(g, x, y, 6, 30, { n: 2, ms: 1600, d: 1400, w: 1.2 })
        const cob: P[] = smooth([[280, 340], [300, 360], [304, 460], [290, 520], [270, 520], [256, 460], [260, 360], [280, 340]], 3)
        blank(g, cob)
        ink(g, cob, { w: 2.4, d: 1000, t: 500 })
        for (let r = 0; r < 9; r++) for (let k = 0; k < 3; k++) ink(g, E(266 + k * 13 + (r % 2) * 4, 366 + r * 16, 5, 6), { w: 1, d: 1200 + r * 40, t: 60 })
        for (const k of [-1, 1]) ink(g, B([280, 520], [280 + k * 20, 560], [280 + k * 30, 580], [280 + k * 26, 610]), { w: 1.8, d: 1400, t: 200 })
      },
      ende(g) {
        puff(g, 180, 480, 2.2, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { flocken: {} } },
      { t: T('Ein Popcorn-Korn ist eine winzige **Dampfmaschine**.', 64), gfx: { maschine: {} } },
      { t: T('Innen steckt Stärke mit etwa **14 Prozent Wasser**. Außen sitzt eine harte, fast wasserdichte Schale.', 64), gfx: { schnitt: {} } },
      { t: T('Beim Erhitzen wird das Wasser zu **Dampf**. Die Schale hält ihn fest – der Druck im Korn steigt und steigt.', 64), gfx: { druck: {} } },
      { t: T('Bei rund **180 Grad** herrscht innen etwa neunmal so viel Druck wie in der Luft um dich herum.', 64), gfx: { zahl180: {} } },
      { t: T('Dann gibt die Schale nach und **platzt** schlagartig auf.', 64), gfx: { platzen: {} } },
      { t: T('Die heiße Stärke ist weich wie Brei. Der Dampf schäumt sie auf – und an der kühleren Luft **erstarrt** der Schaum sofort.', 64), gfx: { schaum: {} } },
      { t: T('Aus einem kleinen Korn wird so eine Flocke, die bis zu **40-mal** so viel Platz braucht.', 64), gfx: { schaum: { cls: 'a1' } } },
      { t: T('Französische Forscher filmten das 2015 mit Hochgeschwindigkeits-Kameras. Ihr Ergebnis: Das Plopp kommt nicht vom Riss, sondern vom **entweichenden Dampf**.', 64), gfx: { plopp: {} } },
      { t: T('Und das Hüpfen? Ein Stück Stärke drückt wie ein **Bein** gegen den Boden – das Korn katapultiert sich hoch.', 64), gfx: { sprung: {} } },
      { t: T('Das alles dauert nur wenige **Hundertstelsekunden**.', 64), gfx: { zeit: {} } },
      { t: T('Warum ploppt Zuckermais nicht? Seine Schale ist **zu durchlässig**: Der Dampf entweicht, bevor sich Druck aufbaut.', 64), gfx: { zuckermais: {} } },
      { t: T('Popcornmais ist eine eigene Sorte mit besonders **dichter, harter** Schale.', 64), gfx: { zuckermais: { cls: 'a1' } } },
      { t: T('Körner, die übrig bleiben, haben meist einen **Riss** in der Schale – oder sie sind zu trocken.', 64), gfx: { jungfer: {} } },
      { t: T('Ideal sind etwa **13 bis 14 Prozent** Wasser im Korn. Zu feucht, und das Popcorn wird zäh – zu trocken, und es bleibt klein.', 64), gfx: { schnitt: {} } },
      { t: T('Die Mikrowelle passt perfekt dazu: Sie erhitzt **direkt das Wasser** im Inneren der Körner.', 64), gfx: { mikro: {} } },
      { t: T('Es gibt zwei Formen: **Schmetterling** mit zarten Flügeln fürs Kino, **Pilz** als feste Kugel – die übersteht auch Karamell.', 64), gfx: { formen: {} } },
      { t: T('Popcorn ist uralt: In Peru fanden Archäologen gepoppte Maiskörner, die rund **6.000 Jahre** alt sind.', 64), gfx: { peru: {} } },
      { t: T('Und weil das ganze Korn aufpoppt, ist Popcorn ein **Vollkorn**-Snack – solange nicht zu viel Zucker und Fett dazukommen.', 480), gfx: { flocken: {} } },
      { t: T('Popcorn ist eine **Dampfexplosion** in Zeitlupe.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Im Korn wird Wasser zu Dampf; die dichte Schale hält den Druck, bis sie bei ~180 °C platzt.', 'Dampf schäumt die Stärke auf, die sofort erstarrt; das Plopp ist entweichender Dampf.', 'Zuckermais ploppt nicht – seine Schale ist undicht.'],
    sources: ['Virot & Ponomarenko 2015, Journal of the Royal Society Interface 12', 'Hoseney et al. 1983, Journal of Cereal Science 1', 'Grobman et al. 2012, PNAS 109 (Mais in Peru)'],
  },
  {
    id: 'rost',
    area: 'CHE',
    day: 2,
    hook: 'Rost ist ein sehr langsames Feuer.',
    mood: 'dunkel',
    ambience: 'regen',
    images: [],
    draw: {
      nagel(g) {
        // rostiger Nagel auf Holz, Regentropfen darauf, Rostflecken und abplatzende Schuppen
        rain(g, 20, 70, 320, 150, { n: 14, d: 0, ms: 900 })
        ink(g, L([20, 330], [340, 330]), { w: 2.6, d: 200, t: 500 })
        for (let k = 0; k < 4; k++) ink(g, B([30 + k * 80, 342], [60 + k * 80, 338], [80 + k * 80, 346], [100 + k * 80, 342]), { w: 1, d: 400 + k * 60, t: 200 })
        rustyNail(g, 60, 290, 1, 400)
        drop(g, 200, 278, 0.55, 1200, false)
        ink(g, E(194, 270, 3, 5, 200, 300), { w: 1.2, d: 1400, t: 80 })
        for (let k = 0; k < 3; k++) {
          const f = glide(g, 6 - k * 4, 36, { ms: 1400, d: 1600 + k * 400 })
          const fl: P[] = [[150 + k * 40, 300], [158 + k * 40, 298], [156 + k * 40, 305], [150 + k * 40, 300]]
          hatch(f, fl, 1500, true)
          ink(f, fl, { w: 1, d: 1500, t: 60 })
        }
      },
      vergleich(g) {
        // links Lagerfeuer mit Stoppuhr, rechts rostender Eisenträger mit Kalenderblatt
        for (const [a, b] of [[[30, 610], [150, 580]], [[40, 580], [160, 610]]] as const) {
          const log = [...L(a as P, b as P)]
          ink(g, log, { w: 12, d: 0, t: 400 })
          blank(g, log)
          ink(g, E((b as P)[0], (b as P)[1], 5, 7), { w: 1.4, d: 300, t: 100 })
        }
        for (let k = 0; k < 3; k++) {
          const fw = wobble(g, { deg: 5, ox: 70 + k * 30, oy: 592, ms: 600 + k * 90, d: 900 })
          flame(fw, 70 + k * 30, 592, 0.7 + (k === 1 ? 0.3 : 0), 400 + k * 80)
        }
        ink(g, E(90, 380, 28), { w: 2.4, d: 600, t: 400 })
        ink(g, RR(84, 344, 12, 8, 2), { w: 1.8, d: 700, t: 100 })
        const hand = spin(g, 90, 380, 1500, 1200)
        ink(hand, L([90, 380], [90, 358]), { w: 2, d: 900, t: 100 })
        const beam: P[] = [[200, 560], [330, 560], [330, 610], [200, 610], [200, 560]]
        ink(g, beam, { w: 3, d: 300, t: 500 })
        ink(g, L([200, 572], [330, 572]), { w: 1.4, d: 400, t: 300 })
        ink(g, L([200, 598], [330, 598]), { w: 1.4, d: 400, t: 300 })
        for (const [x, r] of [[226, 9], [262, 13], [300, 7], [316, 10]] as const) hatch(g, E(x, 585, r, 6), 900 + x, true)
        ink(g, RR(220, 330, 90, 100, 6), { w: 2.4, d: 600, t: 400 })
        ink(g, L([220, 356], [310, 356]), { w: 1.6, d: 700, t: 200 })
        for (const x of [240, 290]) ink(g, E(x, 330, 5, 10), { w: 1.8, d: 700, t: 100 })
        for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) ink(g, RR(228 + c * 13, 364 + r * 15, 9, 10, 1), { w: 0.8, d: 800 + (r * 6 + c) * 15, t: 40 })
        for (let k = 0; k < 6; k++) {
          const pg = glide(g, 40 + k * 4, -30, { ms: 800, d: 1300 + k * 250 })
          ink(pg, RR(230 + k, 340 + k, 70, 80, 4), { w: 1, d: 1200 + k * 250, t: 100 })
        }
      },
      wueste(g) {
        // Wüste: Dünen, flimmernde Hitze, Kaktus, ein blanker Eisenschlüssel ohne Rost
        sunDisk(g, 270, 350, 34, 0)
        for (let k = 0; k < 3; k++) {
          const w = wobble(g, { dx: 6, ms: 1200 + k * 300, d: 800 })
          ink(w, waveP(40 + k * 30, 200 + k * 30, 420 + k * 22, 3, 30), { w: 1, d: 700 + k * 100, t: 400 })
        }
        ink(g, B([20, 560], [100, 500], [180, 520], [240, 540]), { w: 2.6, d: 200, t: 600 })
        ink(g, B([140, 600], [220, 540], [300, 540], [340, 560]), { w: 2.6, d: 300, t: 600 })
        for (let k = 0; k < 5; k++) ink(g, B([60 + k * 50, 590 + (k % 2) * 10], [80 + k * 50, 586], [100 + k * 50, 594], [120 + k * 50, 590]), { w: 0.9, d: 500 + k * 60, t: 150 })
        const c: P[] = [[60, 560], [60, 440], ...B([60, 440], [60, 426], [76, 426], [76, 440]).slice(1), [76, 560]]
        ink(g, c, { w: 2.6, d: 400, t: 500 })
        ink(g, [[60, 490], [44, 490], [44, 460], ...B([44, 460], [44, 452], [36, 452], [36, 460]).slice(1), [36, 498], [60, 498]], { w: 2.2, d: 600, t: 300 })
        for (let k = 0; k < 6; k++) ink(g, L([68, 440 + k * 20], [68, 452 + k * 20]), { w: 0.9, d: 700, t: 60 })
        ink(g, E(200, 610, 14), { w: 2.4, d: 900, t: 200 })
        ink(g, E(200, 610, 6), { w: 1.4, d: 950, t: 100 })
        ink(g, [[214, 610], [290, 610], [290, 622], [282, 622], [282, 616], [272, 616], [272, 622], [264, 622], [264, 610]], { w: 2.2, d: 1000, t: 300 })
        ink(g, L([222, 606], [286, 606]), { w: 0.9, d: 1100, t: 200 })
      },
      tropfen(g) {
        // Tropfenversuch nach Evans: Eisen gibt in der Mitte Ionen ab; x1: am Rand kommt Sauerstoff hinein
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, RR(20, 562, 320, 80, 2), 300, true)
        const dp: P[] = [...B([50, 560], [70, 440], [290, 440], [310, 560])]
        blank(g, [...dp, [50, 560]])
        ink(g, dp, { w: 2.6, d: 300, t: 600 })
        ink(g, B([90, 470], [110, 454], [140, 448], [160, 448]), { w: 1.2, d: 500, t: 200 })
        for (let k = 0; k < 4; k++) {
          const up = glide(g, (k - 1.5) * 16, -60, { ms: 2000, d: 1000 + k * 300, loop: true })
          ball(up, 160 + k * 14, 550, 6, { d: 900, fill: 'dicht', w: 1.4, t: 60 })
        }
        ripple(g, 180, 560, 10, 50, { n: 2, ms: 1600, d: 1100, w: 1, ry: 0.3 })
        const ox = st(g, 'x1', '--o: 180px 520px')
        for (const [x0, x1] of [[20, 74], [340, 286]] as const) {
          const p = L([x0, 420], [x1, 540])
          mol(ox, [[x0 + (x1 - x0) * 0.3, 450, 'O', 'hell'], [x0 + (x1 - x0) * 0.3 + 18, 450, 'O', 'hell']], [[0, 1, true]], 0.7, 0)
          flow(ox, p, { n: 2, ms: 1400, r: 2.2 })
        }
        for (const x of [80, 280]) ripple(ox, x, 556, 6, 26, { n: 2, ms: 1400, w: 1, ry: 0.4 })
      },
      kreis(g) {
        // derselbe Tropfen: Elektronen laufen im Metall von der Mitte zum Rand, dazwischen wächst ein Rostring
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, RR(20, 562, 320, 80, 2), 300)
        const dp: P[] = [...B([50, 560], [70, 440], [290, 440], [310, 560])]
        ink(g, dp, { w: 2.6, d: 200, t: 600 })
        for (const k of [-1, 1]) {
          const p = B([180 + k * 10, 600], [180 + k * 50, 612], [180 + k * 90, 606], [180 + k * 112, 576])
          dashes(g, p, { w: 1.2, d: 800, dash: 4, gap: 4 })
          flow(g, p, { n: 3, ms: 1200, d: 900, r: 2.2 })
          const ring: P[] = smooth([[180 + k * 70, 560], [180 + k * 76, 540], [180 + k * 96, 536], [180 + k * 104, 560]], 3)
          hatch(g, [...ring, [180 + k * 70, 560]], 1300, true)
          ink(g, ring, { w: 1.6, d: 1200, t: 300 })
        }
        ink(g, E(180, 560, 16, 5), { w: 1.6, d: 700, t: 200 })
      },
      poroes(g) {
        // Schnitt: Eisen unten, darüber rissige Rostschicht; Wasser und Sauerstoff dringen durch Risse ein, Schuppen fallen ab
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, RR(20, 562, 320, 80, 2), 300, true)
        const crust: P[] = smooth([[20, 560], [40, 520], [70, 530], [100, 500], [140, 516], [170, 490], [210, 512], [250, 494], [290, 520], [340, 506]], 3)
        hatch(g, [...crust, [340, 560], [20, 560]], 700)
        ink(g, crust, { w: 2.2, d: 500, t: 600 })
        for (const x of [90, 160, 240, 300]) ink(g, [[x, 500 + (x % 20)], [x + 6, 524], [x - 4, 540], [x + 2, 558]], { w: 2, d: 800, t: 200 })
        for (const x of [90, 240]) flow(g, L([x - 30, 400], [x + 2, 556]), { n: 3, ms: 1400, d: 1100, r: 2 })
        for (const [x, y] of [[60, 420], [200, 400], [300, 430]] as const) water(g, x, y, 0.7, x, 1000)
        for (let k = 0; k < 3; k++) {
          const f = glide(g, 10 + k * 6, 60, { ms: 1600, d: 1600 + k * 400 })
          const fl: P[] = [[120 + k * 70, 500], [146 + k * 70, 494], [150 + k * 70, 504], [124 + k * 70, 510], [120 + k * 70, 500]]
          blank(f, fl)
          hatch(f, fl, 1500, true)
          ink(f, fl, { w: 1.4, d: 1500, t: 100 })
        }
      },
      salz(g) {
        // Winterstraße: Auto wirbelt Salzwasser auf, am Radkasten blüht der Rost
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 640], [20, 640]], 300)
        for (let k = 0; k < 8; k++) ink(g, RR(30 + k * 40, 612, 5, 5, 1), { w: 1, d: 500 + k * 40, t: 50 })
        car(g, 200, 600, 2.6, 200)
        for (const [x, y, r] of [[118, 566, 9], [140, 552, 6], [254, 560, 7], [290, 572, 5]] as const) {
          const sp: P[] = smooth(Array.from({ length: 7 }, (_, k) => [x + Math.cos(rad(k * 60)) * r * (1 + (k % 2) * 0.4), y + Math.sin(rad(k * 60)) * r * 0.7] as P), 3)
          hatch(g, sp, 1200, true)
          ink(g, sp, { w: 1.2, d: 1200, t: 150 })
        }
        for (let k = 0; k < 6; k++) flow(g, B([128, 596], [100 - k * 6, 590 - k * 6], [70 - k * 8, 570 - k * 10], [40 - k * 6, 560 - k * 14]), { n: 2, ms: 700, d: 1000 + k * 60, r: 1.4 })
        for (let k = 0; k < 6; k++) flake(g, 40 + k * 56, 360 + (k % 3) * 30, 6, 600 + k * 80)
      },
      alu(g) {
        // Aluminium im Schnitt: hauchdünne, dichte Oxidhaut; Sauerstoff prallt ab
        hatch(g, RR(40, 480, 280, 140, 6), 300)
        ink(g, RR(40, 480, 280, 140, 6), { w: 3, t: 600 })
        hatch(g, RR(40, 470, 280, 10, 3), 700, true)
        ink(g, RR(40, 470, 280, 10, 3), { w: 1.8, d: 600, t: 400 })
        for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) ink(g, E(60 + c * 30 + (r % 2) * 15, 500 + r * 30, 5), { w: 1, d: 800 + (r * 9 + c) * 15, t: 50 })
        for (const x of [80, 180, 280]) {
          const p: P[] = [...L([x - 40, 330], [x, 464]), ...L([x, 464], [x + 40, 330]).slice(1)]
          dashes(g, p, { w: 1, d: 1000, dash: 3, gap: 4 })
          flow(g, p, { n: 1, ms: 1600, d: 1100 + x, r: 2.2 })
        }
        // Getränkedose als Beispiel
        ink(g, RR(290, 320, 44, 84, 8), { w: 2.2, d: 900, t: 300 })
        ink(g, E(312, 324, 18, 4), { w: 1.4, d: 1000, t: 150 })
      },
      chrom(g) {
        // Edelstahl: unsichtbare Chromoxidhaut; ein Kratzer reißt sie auf, sie wächst von selbst wieder zu
        hatch(g, RR(40, 480, 280, 140, 6), 300)
        ink(g, [[40, 486], [40, 620], [320, 620], [320, 486]], { w: 3, t: 600 })
        ink(g, [[40, 480], [160, 480], [172, 506], [184, 480], [320, 480]], { w: 1.2, d: 600, t: 400 })
        const heal = pop(g, 1800, '50% 100%')
        ink(heal, [[160, 482], [172, 508], [184, 482]], { w: 1.2, t: 0 })
        for (let k = 0; k < 4; k++) dot(heal, 164 + k * 6, 488 + (k % 2) * 8, 1.6, 0)
        for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) {
          const cr = (r * 9 + c) % 5 === 0
          ink(g, E(60 + c * 30 + (r % 2) * 15, 520 + r * 26, cr ? 6 : 4), { w: cr ? 1.6 : 0.9, d: 800 + (r * 9 + c) * 15, t: 50 })
        }
        const n = glide(g, 30, 0, { ms: 500, d: 1200 })
        ink(n, [[100, 420], [150, 470], [160, 478]], { w: 2.4, d: 1000, t: 200 })
        ink(n, [[96, 416], [104, 424]], { w: 4, d: 1000, t: 100 })
        ripple(g, 172, 494, 6, 30, { n: 2, ms: 1400, d: 2000, w: 1 })
      },
      zink(g) {
        // verzinktes Eisen mit Kratzer: Zink gibt Ionen ab, die Elektronen schützen das freiliegende Eisen
        hatch(g, RR(40, 500, 280, 120, 6), 300, true)
        ink(g, RR(40, 500, 280, 120, 6), { w: 3, t: 600 })
        const zn: P[] = [[40, 500], [150, 500], [150, 470], [40, 470], [40, 500]]
        const zn2: P[] = [[210, 500], [320, 500], [320, 470], [210, 470], [210, 500]]
        for (const z of [zn, zn2]) {
          hatch(g, z, 600)
          ink(g, z, { w: 2, d: 500, t: 300 })
        }
        for (const x of [150, 210]) for (let k = 0; k < 2; k++) {
          const up = glide(g, (x - 180) * 0.6, -70, { ms: 1800, d: 1000 + k * 600, loop: true })
          ball(up, x + (x < 180 ? -10 : 10), 466, 5, { d: 900, fill: 'hell', w: 1.2, t: 60 })
        }
        for (const k of [-1, 1]) flow(g, L([180 + k * 100, 486], [180 + k * 14, 506]), { n: 3, ms: 1000, d: 1200, r: 2 })
        ripple(g, 180, 500, 6, 30, { n: 2, ms: 1600, d: 1400, w: 1, ry: 0.4 })
        // verzinkter Eimer mit Zinkblumen
        ink(g, [[230, 330], [240, 420], [320, 420], [330, 330]], { w: 2.4, d: 800, t: 300 })
        ink(g, E(280, 330, 50, 8), { w: 2, d: 900, t: 300 })
        ink(g, B([232, 332], [240, 290], [320, 290], [328, 332]), { w: 1.6, d: 1000, t: 300 })
        for (let k = 0; k < 6; k++) ink(g, [[250 + k * 12, 350 + (k % 3) * 20], [256 + k * 12, 360 + (k % 3) * 20], [246 + k * 12, 366 + (k % 3) * 20]], { w: 0.8, d: 1100 + k * 40, t: 60 })
      },
      waerme(g) {
        // Wärmepad: Vlies-Beutel mit Eisenpulver, Lupe zeigt Körner mit Sauerstoff, Wärme steigt auf
        const pad = RR(60, 440, 170, 180, 18)
        blank(g, pad)
        ink(g, pad, { w: 3, t: 700 })
        dashes(g, RR(70, 450, 150, 160, 12), { w: 1, d: 300, dash: 3, gap: 3 })
        for (let i = 0; i < 40; i++) dot(g, 84 + (i % 8) * 17 + (Math.floor(i / 8) % 2) * 8, 470 + Math.floor(i / 8) * 28, 2.4, 500 + i * 15)
        for (let k = 0; k < 3; k++) {
          const w = wobble(g, { dx: 5, ms: 1200 + k * 200, d: 1200 })
          ink(w, B([100 + k * 45, 430], [90 + k * 45, 400], [110 + k * 45, 380], [100 + k * 45, 340]), { w: 1.8, d: 1100 + k * 100, t: 300 })
        }
        ripple(g, 145, 530, 40, 120, { n: 2, ms: 2400, d: 1400, w: 1 })
        blank(g, E(280, 380, 52))
        ink(g, E(280, 380, 52), { w: 2.4, d: 900, t: 400 })
        ink(g, L([244, 418], [214, 470]), { w: 1.8, d: 1000, t: 200 })
        for (const [x, y] of [[262, 370], [292, 396], [298, 360]] as const) ball(g, x, y, 10, { d: 1100, fill: 'dicht', w: 1.4, t: 100 })
        mol(g, [[260, 340, 'O', 'hell'], [276, 340, 'O', 'hell']], [[0, 1, true]], 0.6, 1300)
        thermo(g, 320, 480, 120, 0.85, 1200)
      },
      koerper(g) {
        // Mensch, in der Lupe ein Mitochondrium; die Energie wird über viele kleine Stufen frei
        fig(g, 80, 640, 7, { d: 0 })
        blank(g, E(250, 380, 80))
        ink(g, E(250, 380, 80), { w: 2.6, d: 400, t: 500 })
        ink(g, L([190, 432], [100, 500]), { w: 1.8, d: 500, t: 200 })
        mito(g, 250, 380, 0.9, 600)
        const steps: P[] = [[180, 470]]
        for (let k = 0; k < 6; k++) steps.push([180 + k * 26, 490 + k * 24], [206 + k * 26, 490 + k * 24])
        ink(g, steps, { w: 2.4, d: 1000, t: 600 })
        for (let k = 0; k < 6; k++) {
          const fw = wobble(g, { deg: 6, ox: 192 + k * 26, oy: 488 + k * 24, ms: 600 + k * 50, d: 1400 })
          flame(fw, 192 + k * 26, 488 + k * 24, 0.16, 1200 + k * 120)
        }
      },
      mars(g) {
        // Mars: Polkappe, Olympus Mons, Valles Marineris, Staubsturm
        blank(g, E(180, 470, 130))
        hatch(g, E(180, 470, 130), 600)
        ink(g, E(180, 470, 130), { w: 3.2, t: 800 })
        const cap: P[] = [...E(180, 470, 130, 130, 240, 300), ...B([245, 357], [210, 380], [150, 380], [115, 357]).slice(1)]
        blank(g, cap)
        ink(g, cap, { w: 1.8, d: 700, t: 400 })
        blank(g, E(110, 440, 26, 20))
        ink(g, E(110, 440, 26, 20), { w: 2, d: 900, t: 300 })
        ink(g, E(110, 440, 8, 6), { w: 1.6, d: 1000, t: 150 })
        const vm: P[] = smooth([[150, 490], [190, 486], [230, 496], [270, 486]], 3)
        ink(g, vm, { w: 3, d: 1100, t: 400 })
        ink(g, vm.map(([x, y]): P => [x, y + 8]), { w: 1.4, d: 1150, t: 400 })
        for (const [x, y, r] of [[230, 560, 12], [150, 560, 8], [260, 430, 7]] as const) {
          blank(g, E(x, y, r))
          ink(g, E(x, y, r), { w: 1.6, d: 1200, t: 150 })
        }
        const st0 = spin(g, 120, 540, 6000, 1400)
        for (let k = 0; k < 3; k++) ink(st0, E(120, 540, 14 + k * 9, 10 + k * 7, k * 60, k * 60 + 220), { w: 1.4, d: 1300, t: 300 })
      },
      statue(g) {
        // Freiheitsstatue: Krone mit sieben Strahlen, erhobene Fackel, Tafel, Faltengewand, Sockel; alles in Patina
        const cx = 170
        ink(g, [[110, 640], [110, 600], [230, 600], [230, 640]], { w: 3, t: 500 })
        ink(g, RR(124, 580, 92, 20, 3), { w: 2.4, d: 100, t: 300 })
        const robe: P[] = [[132, 580], ...B([132, 580], [128, 520], [136, 460], [148, 420]).slice(1), [192, 420], ...B([192, 420], [204, 470], [210, 530], [208, 580]).slice(1), [132, 580]]
        blank(g, robe)
        hatch(g, robe, 800)
        ink(g, robe, { w: 2.8, d: 200, t: 700 })
        for (let k = 0; k < 4; k++) ink(g, B([146 + k * 14, 436], [142 + k * 14, 490], [150 + k * 14, 540], [144 + k * 14, 578]), { w: 1.2, d: 500 + k * 80, t: 300 })
        const tab: P[] = [[132, 470], [118, 440], [130, 420], [146, 450], [132, 470]]
        blank(g, tab)
        ink(g, tab, { w: 2.2, d: 600, t: 200 })
        blank(g, E(cx, 398, 18, 22))
        hatch(g, E(cx, 398, 18, 22), 900)
        ink(g, E(cx, 398, 18, 22), { w: 2.4, d: 400, t: 300 })
        for (let k = 0; k < 7; k++) {
          const a = rad(-160 + k * 23)
          ink(g, [[cx + Math.cos(a) * 20, 386 + Math.sin(a) * 16], [cx + Math.cos(a) * 44, 386 + Math.sin(a) * 38]], { w: 2.4, d: 700 + k * 50, t: 100 })
        }
        const arm: P[] = [[188, 424], [214, 330], [226, 334], [204, 428]]
        blank(g, arm)
        hatch(g, arm, 900)
        ink(g, arm, { w: 2.4, d: 800, t: 300 })
        ink(g, [[210, 330], [206, 310], [234, 310], [230, 330], [210, 330]], { w: 2.2, d: 900, t: 200 })
        const fw = wobble(g, { deg: 5, ox: 220, oy: 308, ms: 700, d: 1200 })
        flame(fw, 220, 308, 0.4, 1000)
      },
      ende(g) {
        flame(g, 110, 560, 1.1, 0)
        text(g, 180, 520, '≈', { anchor: 'middle', size: 30, d: 400 })
        rustyNail(g, 210, 500, 0.5, 500)
      },
      formel(g) {
        // vier Eisenatome + drei Sauerstoffmoleküle + Wasser → wasserhaltiges Eisenoxid
        for (let k = 0; k < 2; k++) mol(g, [[40 + k * 34, 380, 'Fe', 'dicht']], [], 1.1, k * 100)
        text(g, 116, 386, '+', { anchor: 'middle', size: 22, d: 300 })
        mol(g, [[140, 380, 'O', 'hell'], [164, 380, 'O', 'hell']], [[0, 1, true]], 1, 400)
        text(g, 196, 386, '+', { anchor: 'middle', size: 22, d: 500 })
        water(g, 240, 380, 1, 0, 600)
        arrow(g, L([180, 420], [180, 480]), { w: 2.6, d: 900, t: 300, head: 9 })
        const cl: [number, number, string, ('leer' | 'hell' | 'dicht')?][] = [[130, 540, 'Fe', 'dicht'], [190, 520, 'O', 'hell'], [250, 540, 'Fe', 'dicht'], [190, 576, 'O', 'hell'], [100, 590, 'O', 'hell'], [280, 590, 'O', 'hell']]
        const wr = wobble(g, { deg: 2, ox: 190, oy: 560, ms: 2400, d: 1600 })
        mol(wr, cl, [[0, 1], [1, 2], [0, 3], [3, 2], [0, 4], [2, 5]], 1.1, 1100)
        water(wr, 300, 500, 0.8, 30, 1500)
      },
      kosten(g) {
        // rostige Stahlbrücke; daneben die Torte der Weltwirtschaft mit dem kleinen Stück
        ink(g, L([20, 560], [220, 560]), { w: 3, t: 500 })
        ink(g, L([20, 500], [220, 500]), { w: 2.6, d: 100, t: 500 })
        for (let k = 0; k < 5; k++) {
          ink(g, L([20 + k * 40, 560], [40 + k * 40, 500]), { w: 2, d: 200 + k * 60, t: 200 })
          ink(g, L([60 + k * 40, 560], [40 + k * 40, 500]), { w: 2, d: 220 + k * 60, t: 200 })
        }
        for (const [x, y] of [[50, 540], [118, 520], [170, 548], [200, 506]] as const) hatch(g, E(x, y, 9, 5), 900, true)
        ink(g, waveP(20, 220, 610, 4, 40), { w: 1.6, d: 600, t: 500 })
        for (const x of [20, 220]) ink(g, L([x, 500], [x, 620]), { w: 3, d: 300, t: 300 })
        ink(g, E(280, 420, 56), { w: 3, d: 600, t: 600 })
        hatch(g, [[280, 420], ...E(280, 420, 56, 56, -90, -79), [280, 420]], 1300, true)
        ink(g, L([280, 420], [280, 364]), { w: 2, d: 1200, t: 150 })
        ink(g, L([280, 420], [280 + Math.cos(rad(-79)) * 56, 420 + Math.sin(rad(-79)) * 56]), { w: 2, d: 1200, t: 150 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { nagel: {} } },
      { t: T('Feuer und Rost sehen völlig verschieden aus. Chemisch tun sie **dasselbe**: Ein Stoff verbindet sich mit Sauerstoff.', 64), gfx: { vergleich: {} } },
      { t: T('Das heißt **Oxidation**. Beim Feuer geht es rasend schnell, beim Rost dauert es Wochen und Monate.', 64), gfx: { vergleich: {} } },
      { t: T('Eisen braucht dafür aber auch **Wasser**. In trockener Wüstenluft rostet es kaum.', 64), gfx: { wueste: {} } },
      { t: T('Unter einem Wassertropfen gehen Eisen-Teilchen in Lösung. Dabei geben sie **Elektronen** ab.', 64), gfx: { tropfen: {} } },
      { t: T('Am Rand des Tropfens, wo viel Sauerstoff aus der Luft ankommt, werden diese Elektronen **verbraucht**.', 64), gfx: { tropfen: { cls: 'a1' } } },
      { t: T('Die Elektronen fließen dazwischen durch das Metall: ein winziger **Stromkreis**, eine Batterie im Tropfen.', 64), gfx: { kreis: {} } },
      { t: T('Aus Eisen, Sauerstoff und Wasser entsteht der rotbraune **Rost**.', 64), gfx: { formel: {} } },
      { t: T('Rost ist **porös** und blättert ab. Darunter liegt wieder frisches Eisen frei – der Rost frisst sich immer weiter.', 64), gfx: { poroes: {} } },
      { t: T('Salz beschleunigt das: Salzwasser **leitet Strom** viel besser. Darum rosten Autos im Winter und am Meer schneller.', 64), gfx: { salz: {} } },
      { t: T('Aluminium oxidiert sogar viel bereitwilliger als Eisen. Aber seine Oxidschicht ist **dicht** – und schützt das Metall darunter.', 64), gfx: { alu: {} } },
      { t: T('Edelstahl enthält **Chrom**. Es bildet eine hauchdünne, unsichtbare Schutzhaut, die sich bei Kratzern von selbst erneuert.', 64), gfx: { chrom: {} } },
      { t: T('Bei verzinktem Eisen opfert sich das **Zink**: Es oxidiert zuerst – und das Eisen bleibt verschont.', 64), gfx: { zink: {} } },
      { t: T('Rost setzt übrigens Wärme frei, wie ein Feuer – nur so langsam, dass du **nichts spürst**.', 64), gfx: { waerme: {} } },
      { t: T('Wärmepads nutzen genau das: Eisenpulver, Salz und Luft rosten in Minuten – die Packung wird **richtig heiß**.', 64), gfx: { waerme: {} } },
      { t: T('Auch dein Körper „verbrennt“ langsam: Er oxidiert Nährstoffe mit Sauerstoff – **kontrolliert**, in vielen kleinen Schritten.', 64), gfx: { koerper: {} } },
      { t: T('Und die Freiheitsstatue? Sie ist aus **Kupfer**. Ihr Grün ist Patina – Kupfer, das jahrzehntelang mit der Luft reagiert hat.', 64), gfx: { statue: {} } },
      { t: T('Und der Mars? Der Rote Planet ist rot, weil sein Staub voller **Eisenoxid** steckt – Rost im Planetenmaßstab.', 64), gfx: { mars: {} } },
      { t: T('Korrosion ist teuer: Weltweit kostet sie nach Schätzungen rund **drei Prozent** der gesamten Wirtschaftsleistung.', 64), gfx: { kosten: {} } },
      { t: T('Rost ist **Verbrennung** in Zeitlupe.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Rosten ist wie Brennen eine Oxidation – nur viel langsamer und nur mit Wasser.', 'Unter einem Tropfen entsteht ein winziger Stromkreis; Salz beschleunigt ihn.', 'Dichte Oxidschichten (Aluminium, Chrom) schützen; Wärmepads nutzen schnelles Rosten.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Korrosion', 'Evans 1926: Tropfenversuch zur Korrosion', 'National Park Service: Statue of Liberty – Patina'],
  },
  {
    id: 'maillard',
    area: 'CHE',
    day: 2,
    hook: 'Warum schmeckt Gebratenes so viel besser als Gekochtes?',
    mood: 'hell',
    ambience: 'feuer',
    images: [],
    draw: {
      pfanne(g) {
        ink(g, B([40, 300], [60, 380], [300, 380], [320, 300]), { w: 3.2, t: 700 })
        ink(g, L([320, 306], [350, 286]), { w: 3, d: 300, t: 200 })
        const st0: P[] = [...B([100, 330], [110, 296], [240, 290], [260, 330]), ...L([260, 330], [100, 330]).slice(1)]
        hatch(g, st0, 800, true)
        ink(g, st0, { w: 2.6, d: 500, t: 500 })
        for (const x of [130, 180, 230]) ink(g, B([x, 270], [x - 10, 250], [x + 10, 230], [x, 210]), { w: 2, d: 1100, t: 300 })
      },
      beispiele(g) {
        const loaf: P[] = [...B([40, 500], [40, 420], [160, 420], [160, 500]), [40, 500]]
        hatch(g, loaf, 500, true)
        ink(g, loaf, { w: 2.8, t: 600 })
        ink(g, [[200, 430], [210, 520], [270, 520], [280, 430]], { w: 2.8, d: 300, t: 600 })
        ink(g, E(240, 430, 40, 8), { w: 2.2, d: 500, t: 300 })
        hatch(g, E(240, 430, 36, 6), 900, true)
        text(g, 100, 560, 'Brotkruste', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 240, 560, 'Röstkaffee', { anchor: 'middle', cls: 's', d: 900 })
      },
      maillard(g) {
        text(g, 180, 440, 'Louis-Camille Maillard', { anchor: 'middle', size: 20, d: 200 })
        text(g, 180, 480, 'Nancy, 1912', { anchor: 'middle', cls: 's', d: 600 })
      },
      aromen(g) {
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 24; i++) {
          const x = 50 + rnd() * 260
          const y = 360 + rnd() * 220
          ink(g, E(x, y, 5 + rnd() * 6), { w: 1.6, d: 200 + i * 60, t: 150 })
        }
        text(g, 180, 640, 'Hunderte neue Aromastoffe', { anchor: 'middle', d: 1600 })
      },
      grad(g) {
        thermo(g, 90, 330, 240, 0.7)
        dashes(g, L([110, 416], [300, 416]), { w: 1.6, d: 600 })
        text(g, 300, 404, 'ab ≈ 140 °C: Bräunung', { anchor: 'end', cls: 's', d: 800 })
        dashes(g, L([110, 470], [300, 470]), { w: 1.6, d: 900 })
        text(g, 300, 494, '100 °C: Wasser kocht', { anchor: 'end', cls: 's', d: 1100 })
      },
      topf(g) {
        ink(g, [[70, 380], [80, 580], [280, 580], [290, 380]], { w: 3, t: 700 })
        hatch(g, RR(84, 440, 192, 136, 4), 500)
        for (let i = 0; i < 5; i++) ball(g, 110 + i * 36, 500 + (i % 2) * 20, 9, { d: 700 + i * 80, w: 1.6, t: 0 })
        text(g, 180, 640, 'nass: höchstens 100 °C', { anchor: 'middle', cls: 's', d: 1100 })
      },
      kruste(g) {
        ink(g, B([40, 520], [60, 600], [300, 600], [320, 520]), { w: 3.2, t: 700 })
        const st0: P[] = [...B([100, 560], [110, 520], [240, 514], [260, 560]), ...L([260, 560], [100, 560]).slice(1)]
        hatch(g, st0, 800)
        ink(g, st0, { w: 2.6, d: 500, t: 500 })
        hatch(g, RR(104, 554, 152, 8, 3), 1100, true)
        for (const x of [130, 180, 230]) arrow(g, L([x, 500], [x, 440]), { w: 1.8, d: 1000, t: 300, head: 7 })
        text(g, 180, 420, 'Wasser verdunstet → Kruste', { anchor: 'middle', cls: 's', d: 1300 })
      },
      toast(g) {
        ink(g, RR(90, 380, 180, 180, 30), { w: 3, t: 700 })
        hatch(g, RR(90, 380, 180, 180, 30), 600, true)
        blank(g, RR(108, 398, 144, 144, 20))
        ink(g, RR(108, 398, 144, 144, 20), { w: 1.6, d: 500, t: 600 })
        text(g, 180, 476, 'innen < 100 °C', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 180, 610, 'außen braun, innen weich', { anchor: 'middle', cls: 's', d: 1200 })
      },
      poren(g) {
        const st0: P[] = [...B([70, 520], [80, 460], [280, 450], [290, 520]), ...L([290, 520], [70, 520]).slice(1)]
        hatch(g, st0, 500)
        ink(g, st0, { w: 2.8, t: 600 })
        for (const [x, d] of [[110, 800], [180, 900], [250, 1000]] as const) drop(g, x, 570, 0.5, d, false)
        text(g, 180, 400, '„Poren schließen“? Ein Mythos', { anchor: 'middle', cls: 's', d: 1200 })
      },
      knoblauch(g) {
        const c: P[] = [...B([180, 340], [230, 380], [260, 500], [200, 590]), ...B([200, 590], [160, 600], [110, 560], [120, 470]).slice(1), ...B([120, 470], [130, 400], [160, 370], [180, 340]).slice(1)]
        blank(g, c)
        hatch(g, c, 800, true)
        ink(g, c, { w: 3, t: 900 })
        text(g, 180, 640, 'schwarzer Knoblauch: Wochen bei ≈ 60 °C', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tupfen(g) {
        const st0: P[] = [...B([80, 540], [90, 490], [260, 480], [280, 540]), ...L([280, 540], [80, 540]).slice(1)]
        ink(g, st0, { w: 2.8, t: 600 })
        ink(g, RR(110, 420, 140, 50, 10), { w: 2.6, d: 400, t: 400 })
        for (let k = 0; k < 4; k++) ink(g, L([130 + k * 30, 430], [140 + k * 30, 460]), { w: 1.4, d: 700 + k * 60, t: 100 })
        text(g, 180, 600, 'trocken tupfen', { anchor: 'middle', d: 1000 })
      },
      voll(g) {
        ink(g, B([40, 500], [60, 580], [300, 580], [320, 500]), { w: 3.2, t: 700 })
        for (let i = 0; i < 8; i++) ink(g, E(70 + i * 30, 540 - (i % 2) * 10, 16, 10), { w: 2, d: 300 + i * 60, t: 200 })
        for (const x of [100, 160, 220, 280]) ink(g, B([x, 490], [x - 10, 470], [x + 10, 450], [x, 430]), { w: 2, d: 900, t: 300 })
        cross(g, 300, 380, 1, 1200)
        text(g, 160, 640, 'zu voll: es dampft statt brät', { anchor: 'middle', cls: 's', d: 1300 })
      },
      brezel(g) {
        const pts: P[] = [...B([180, 600], [80, 560], [60, 420], [150, 400]), ...B([150, 400], [220, 390], [230, 470], [180, 500]).slice(1), ...B([180, 500], [130, 470], [140, 390], [210, 400]).slice(1), ...B([210, 400], [300, 420], [280, 560], [180, 600]).slice(1)]
        ink(g, pts, { w: 6, t: 1400 })
        text(g, 300, 640, 'Lauge: braun und knusprig', { anchor: 'end', cls: 's', d: 1400 })
      },
      karamell(g) {
        box(g, 30, 370, 140, 90, ['Maillard:', 'Zucker + Eiweiß'], { size: 15 })
        box(g, 190, 370, 140, 90, ['Karamell:', 'nur Zucker'], { size: 15, d: 400, fill: true })
      },
      acrylamid(g) {
        const toast = (x: number, dense: boolean, d: number) => {
          ink(g, RR(x, 400, 110, 120, 20), { w: 2.8, d, t: 500 })
          hatch(g, RR(x + 6, 406, 98, 108, 16), d + 300, dense)
        }
        toast(40, false, 0)
        toast(210, true, 400)
        check(g, 95, 570, 1.2, 900)
        cross(g, 265, 570, 1.2, 1100)
        text(g, 180, 640, 'vergolden statt verkohlen', { anchor: 'middle', d: 1300 })
      },
      gehirn(g) {
        brain(g, 180, 450, 1.1)
        text(g, 180, 620, 'gegart = sicher und energiereich', { anchor: 'middle', cls: 's', d: 1200 })
      },
      roesten(g) {
        ink(g, E(120, 470, 50, 70), { w: 3, t: 700 })
        ink(g, B([120, 404], [104, 440], [136, 500], [120, 536]), { w: 2, d: 500, t: 400 })
        hatch(g, E(120, 470, 46, 66), 800)
        ink(g, [[220, 400], [230, 560], [300, 560], [310, 400]], { w: 2.8, d: 500, t: 600 })
        hatch(g, RR(226, 440, 78, 116, 4), 1100)
        text(g, 120, 600, 'Kakao, Malz, Kaffee', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        thermo(g, 180, 380, 200, 0.7)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { pfanne: {} } },
      { t: T('Brotkruste, Röstkaffee, gebratenes Fleisch: Hinter diesem Duft steckt immer **dieselbe Reaktion**.', 64), gfx: { beispiele: {} } },
      { t: T('Sie heißt **Maillard-Reaktion** – nach dem französischen Chemiker Louis-Camille Maillard, der sie 1912 beschrieb.', 64), gfx: { maillard: {} } },
      { t: T('Dabei reagieren **Zucker** mit Bausteinen von Eiweißen, den Aminosäuren.', 64), gfx: { f1: { draw: 'formel', args: [['Zucker', '+', 'Aminosäuren', '→', 'Bräune', '+', 'Aroma'], 360] } } },
      { t: T('Es entstehen Hunderte neuer Stoffe: **röstige**, nussige, fleischige Aromen – und die braune Farbe.', 64), gfx: { aromen: {} } },
      { t: T('Richtig in Gang kommt die Reaktion aber erst ab etwa **140 Grad**.', 64), gfx: { grad: {} } },
      { t: T('Wasser kocht bei 100 Grad. Solange ein Lebensmittel nass ist, bleibt seine Oberfläche **bei 100 Grad** stecken.', 64), gfx: { grad: {} } },
      { t: T('Darum bräunt Gekochtes **nie**: Im Kochtopf wird es schlicht nicht heiß genug.', 64), gfx: { topf: {} } },
      { t: T('In der Pfanne verdunstet das Wasser an der Oberfläche. Dann steigt die Temperatur weiter – und die **Kruste** entsteht.', 64), gfx: { kruste: {} } },
      { t: T('Darum bräunt Toast außen und bleibt innen weich: Im Inneren steckt noch Wasser – dort bleibt es **unter 100 Grad**.', 64), gfx: { toast: {} } },
      { t: T('Daraus folgt der Küchentrick: Fleisch und Gemüse vor dem Braten **trocken tupfen** – sonst dämpfen sie erst.', 64), gfx: { tupfen: {} } },
      { t: T('Und die Pfanne nicht **überfüllen**: Zu viel Dampf, und alles kocht im eigenen Saft.', 64), gfx: { voll: {} } },
      { t: T('Scharfes Anbraten „schließt“ übrigens **keine Poren**. Der Saft tritt trotzdem aus – das Fleisch schmeckt nur besser.', 64), gfx: { poren: {} } },
      { t: T('Eine basische Lauge beschleunigt die Reaktion stark – darum werden **Laugenbrezeln** so tiefbraun.', 64), gfx: { brezel: {} } },
      { t: T('Bei niedriger Temperatur läuft die Reaktion ganz langsam: **Schwarzer Knoblauch** reift wochenlang bei rund 60 Grad.', 64), gfx: { knoblauch: {} } },
      { t: T('Nicht verwechseln mit **Karamellisierung**: Dabei zerfällt nur Zucker, ganz ohne Eiweiß.', 64), gfx: { karamell: {} } },
      { t: T('Zu dunkel wird es ungesund: Bei sehr starker Bräunung entsteht **Acrylamid**. Die Faustregel lautet: vergolden statt verkohlen.', 64), gfx: { acrylamid: {} } },
      { t: T('Warum lieben wir diese Aromen? Eine Vermutung: Sie zeigen **gegartes**, sicheres und energiereiches Essen an.', 64), gfx: { gehirn: {} } },
      { t: T('Auch Schokolade, Bier und Kaffee verdanken ihr Aroma großteils dem **Rösten** – von Kakaobohnen, Malz und Kaffeebohnen.', 64), gfx: { roesten: {} } },
      { t: T('Geschmack entsteht **ab 140 Grad**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei der Maillard-Reaktion bilden Zucker und Aminosäuren Hunderte Röstaromen.', 'Sie braucht rund 140 °C – nasse Lebensmittel bleiben bei 100 °C, darum bräunt Gekochtes nicht.', 'Trocken tupfen, Pfanne nicht überfüllen; vergolden statt verkohlen (Acrylamid).'],
    sources: ['Maillard 1912, Comptes Rendus de l’Académie des Sciences 154', 'McGee 2004: On Food and Cooking', 'Bundesinstitut für Risikobewertung: Acrylamid in Lebensmitteln'],
  },
]
