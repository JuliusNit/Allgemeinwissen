import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, bolt, check, clock, cross, dashes, fig, globe, hatch, hbars, ink, mk, mountain, pop, question, rays, st, star, text, timeline, type P } from './draw'
import { LAND, arcArrow, ball, bird, bullets, carrow, clipBox, cloud, coastPts, dot, drop, earth, flake, flame, flow, geo, glide, house, jet, mapRegion, mol, moonFace, rad, rain, ripple, rotPole, smooth, spin, stars, sunDisk, thermo, travelWave, tree, water, waveP, wobble, worldMap } from './kit'

// Erde & Wetter: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Unregelmäßige Fläche (Land), geschlossen; seed ändert die Zacken */
function blob(g: Element, cx: number, cy: number, rx: number, ry: number, seed: number, d = 0, fill = true): P[] {
  const pts: P[] = []
  for (let i = 0; i <= 60; i++) {
    const a = (i / 60) * Math.PI * 2
    const r = 1 + 0.1 * Math.sin(a * 3 + seed) + 0.06 * Math.sin(a * 5 + seed * 2)
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r])
  }
  blank(g, pts)
  if (fill) hatch(g, pts, d + 400)
  ink(g, pts, { w: 2.4, d, t: 700 })
  return pts
}

/** Düne als Bogen von x0 bis x1, Grundlinie y */
function dune(g: Element, x0: number, x1: number, y: number, hgt: number, d = 0): void {
  ink(g, B([x0, y], [x0 + (x1 - x0) * 0.3, y - hgt], [x0 + (x1 - x0) * 0.6, y - hgt], [x1, y]), { w: 2.8, d, t: 600 })
}

/** Mondsichel: äußerer Kreis ohne den Teil im versetzten Kreis */
function moon(g: Element, cx: number, cy: number, r: number, d = 0): void {
  const dx = r * 0.5
  const dy = -r * 0.3
  const r2 = r * 0.85
  const dd = Math.hypot(dx, dy)
  const a = (r * r - r2 * r2 + dd * dd) / (2 * dd)
  const h = Math.sqrt(r * r - a * a)
  const m: P = [(dx * a) / dd, (dy * a) / dd]
  const p1: P = [m[0] - (h * dy) / dd, m[1] + (h * dx) / dd]
  const p2: P = [m[0] + (h * dy) / dd, m[1] - (h * dx) / dd]
  const psi = Math.atan2(dy, dx)
  const norm = (t: number) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  const t1 = norm(Math.atan2(p1[1], p1[0]) - psi)
  const t2 = norm(Math.atan2(p2[1], p2[0]) - psi)
  const [ta, tb] = t1 < t2 ? [t1, t2] : [t2, t1]
  const pts: P[] = []
  for (let i = 0; i <= 40; i++) {
    const t = psi + ta + ((tb - ta) * i) / 40
    pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r])
  }
  const end: P = [pts[40][0] - cx, pts[40][1] - cy]
  const start: P = [pts[0][0] - cx, pts[0][1] - cy]
  const sgn = (t: number) => ((t + 3 * Math.PI) % (2 * Math.PI)) - Math.PI
  const ue = sgn(Math.atan2(end[1] - dy, end[0] - dx) - psi - Math.PI)
  const us = sgn(Math.atan2(start[1] - dy, start[0] - dx) - psi - Math.PI)
  for (let i = 1; i <= 30; i++) {
    const u = psi + Math.PI + ue + ((us - ue) * i) / 30
    pts.push([cx + dx + Math.cos(u) * r2, cy + dy + Math.sin(u) * r2])
  }
  blank(g, pts)
  hatch(g, pts, d + 300)
  ink(g, pts, { w: 2.6, d, t: 600 })
}

/** Fossil: Ammonit (Spirale) */
function ammonite(g: Element, cx: number, cy: number, r: number, d = 0): void {
  const p: P[] = []
  for (let i = 0; i <= 140; i++) {
    const a = (i / 140) * Math.PI * 5
    const rr = r * Math.exp(-0.16 * (Math.PI * 5 - a))
    p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  ink(g, p, { w: 2.4, d, t: 900 })
  ink(g, E(cx, cy, r * 1.08), { w: 2.8, d: d + 300, t: 600 })
}

/** Seismogramm: Zitterlinie, Ausschlag amp */
function seismo(g: Element, x0: number, x1: number, y: number, amp: number, d = 0): void {
  const pts: P[] = []
  for (let x = x0; x <= x1; x += 3) {
    const t = (x - x0) / (x1 - x0)
    const env = t < 0.3 ? 0.08 : Math.exp(-Math.pow((t - 0.45) / 0.15, 2))
    pts.push([x, y + Math.sin(x * 0.9) * amp * Math.max(env, 0.06)])
  }
  ink(g, pts, { w: 1.8, d, t: 900 })
}

let goreN = 0

/** Galeone von der Seite: Rumpf mit Heckkastell, drei Masten mit geblähten Segeln, Wellen; Wasserlinie bei y */
function galleon(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const hull: P[] = [P(-60, -30), P(-50, -30), P(-46, -20), P(44, -20), P(62, -34), ...B(P(62, -34), P(54, -10), P(40, 0), P(30, 0)).slice(1), P(-40, 0), ...B(P(-40, 0), P(-54, -6), P(-60, -18), P(-60, -30)).slice(1)]
  blank(g, hull)
  hatch(g, hull, d + 500)
  ink(g, hull, { w: 2.4 * Math.max(0.6, s), d, t: 500 })
  ink(g, L(P(-46, -12), P(46, -12)), { w: 1, d: d + 200, t: 300 })
  for (const [mx, h] of [[-30, 70], [4, 90], [34, 64]] as const) {
    ink(g, L(P(mx, -20), P(mx, -20 - h)), { w: 1.8 * Math.max(0.6, s), d: d + 300, t: 200 })
    for (const [t0, t1] of [[0.15, 0.5], [0.55, 0.85]] as const) {
      const sail: P[] = [P(mx - 16, -20 - h * t1), P(mx + 16, -20 - h * t1), ...B(P(mx + 16, -20 - h * t1), P(mx + 22, -20 - h * (t0 + t1) / 2), P(mx + 20, -20 - h * t0), P(mx + 16, -20 - h * t0)).slice(1), P(mx - 16, -20 - h * t0), ...B(P(mx - 16, -20 - h * t0), P(mx - 12, -20 - h * (t0 + t1) / 2), P(mx - 14, -20 - h * t1), P(mx - 16, -20 - h * t1)).slice(1)]
      blank(g, sail)
      ink(g, sail, { w: 1.4 * Math.max(0.6, s), d: d + 400, t: 300 })
    }
  }
  ink(g, [P(4, -110), P(18, -106), P(4, -102)], { w: 1.2, d: d + 600, t: 100 })
  ink(g, L(P(62, -34), P(84, -50)), { w: 1.4, d: d + 500, t: 100 })
  ink(g, waveP(x - 80 * s, x + 90 * s, y + 2, 2 * s, 18 * s), { w: 1.4, d: d + 300, t: 400 })
}

/** Teil einer Landmasse (Kasten in Länge/Breite) dicht schraffieren, auf schon gezeichneter Karte */
function regionHatch(g: Element, pr: (lon: number, lat: number) => P, li: number, lon0: number, lon1: number, lat0: number, lat1: number, d = 0): void {
  const id = `rh${++goreN}`
  const cp = mk('clipPath', { id }, g)
  const box: P[] = [...Array.from({ length: 21 }, (_, k) => pr(lon0 + ((lon1 - lon0) * k) / 20, lat1)), ...Array.from({ length: 21 }, (_, k) => pr(lon1 - ((lon1 - lon0) * k) / 20, lat0))]
  mk('path', { d: `M${box.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z` }, cp)
  const c = mk('g', { 'clip-path': `url(#${id})` }, g)
  const pts = coastPts(li, pr)
  hatch(c, pts, d, true)
  ink(c, pts, { w: 2.4, d, t: 400, p: 0.3 })
}

/** Dromedar von der Seite, Kopf nach rechts; y = Boden, Höhe ≈ 110·s */
function camel(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = smooth([P(-46, -64), P(-40, -84), P(-14, -110), P(10, -96), P(30, -80), P(44, -82), P(54, -104), P(64, -112), P(76, -108), P(80, -102), P(66, -98), P(60, -78), P(46, -58), P(20, -52), P(-30, -50), P(-46, -64)], 3)
  blank(g, body)
  hatch(g, body, d + 600)
  ink(g, body, { w: 2.4, d, t: 700 })
  for (const [a, k] of [[-36, -1], [-24, 1], [26, -1], [38, 1]] as const) ink(g, [P(a, -52), P(a + k * 3, -26), P(a, -24), P(a + k * 2, 0), P(a + 6, 0)], { w: 2.2, d: d + 300, t: 300 })
  ink(g, B(P(-46, -64), P(-56, -60), P(-58, -46), P(-54, -36)), { w: 1.6, d: d + 400, t: 150 })
  dot(g, x + 70 * s, y - 106 * s, 1.6 * s, d + 600)
  ink(g, B(P(64, -112), P(62, -118), P(66, -120), P(68, -114)), { w: 1.4, d: d + 500, t: 80 })
}

/** Säulenkaktus mit Armen und Rippen; y = Boden */
function cactus(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  ink(g, [P(-8, 0), P(-8, -110), ...B(P(-8, -110), P(-8, -124), P(8, -124), P(8, -110)).slice(1), P(8, 0)], { w: 2.4, d, t: 500 })
  ink(g, [P(-8, -50), P(-26, -50), ...B(P(-26, -50), P(-30, -50), P(-32, -56), P(-32, -60)).slice(1), P(-32, -84), ...B(P(-32, -84), P(-32, -92), P(-22, -92), P(-22, -84)).slice(1), P(-22, -62), P(-8, -62)], { w: 2, d: d + 300, t: 300 })
  ink(g, [P(8, -70), P(24, -70), P(24, -96), ...B(P(24, -96), P(24, -104), P(34, -104), P(34, -96)).slice(1), P(34, -66), ...B(P(34, -66), P(34, -60), P(30, -58), P(26, -58)).slice(1), P(8, -58)], { w: 2, d: d + 400, t: 300 })
  for (const a of [-3, 3]) ink(g, L(P(a, -116), P(a, -4)), { w: 0.8, d: d + 500, t: 200 })
}

/** Infrarot-Wellenpfeil von a nach b */
function irArrow(g: Element, a: P, b: P, d = 0, w = 2): void {
  const n = 50
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const l = Math.hypot(dx, dy)
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const o = Math.sin(t * l / 6) * 5 * Math.min(1, (1 - t) * 6)
    return [a[0] + dx * t - (dy / l) * o, a[1] + dy * t + (dx / l) * o] as P
  })
  arrow(g, pts, { w, d, t: 700, head: 9 })
}

/** Salzkristall: Würfel räumlich mit Treppenkante */
function crystal(g: Element, x: number, y: number, s = 20, d = 0): void {
  const o = s * 0.35
  const front = RR(x, y, s, s, 2)
  const top: P[] = [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s, y], [x, y]]
  const side: P[] = [[x + s, y], [x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s], [x + s, y]]
  blank(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s], [x, y + s], [x, y]])
  hatch(g, side, d + 200)
  ink(g, front, { w: 2, d, t: 200 })
  ink(g, top, { w: 1.4, d: d + 80, t: 150 })
  ink(g, side, { w: 1.4, d: d + 120, t: 150 })
  ink(g, [[x + s * 0.3, y + s * 0.3], [x + s * 0.7, y + s * 0.3], [x + s * 0.7, y + s * 0.7]], { w: 0.9, d: d + 200, t: 80 })
}

/** Ion als Kugel mit Ladungszeichen; na = kleines Natrium (+), sonst großes Chlorid (−) */
function ion(g: Element, x: number, y: number, na: boolean, s = 1, d = 0): void {
  ball(g, x, y, (na ? 8 : 12) * s, { d, fill: na ? 'dicht' : 'hell', w: 1.6, t: 100 })
  if (s >= 0.8) text(g, x, y + 5 * s, na ? '+' : '−', { anchor: 'middle', size: 14 * s, cls: 'halo', d: d + 100 })
}

/** Frachter von der Seite, Bug rechts: Rumpf, Container, Brückenhaus mit Fenstern, Schornstein; Wasserlinie bei y */
function freighter(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const hull: P[] = [P(-90, -26), P(80, -26), ...B(P(80, -26), P(96, -26), P(100, -14), P(90, 0)).slice(1), P(-84, 0), P(-90, -26)]
  blank(g, hull)
  hatch(g, [P(-88, -10), P(94, -10), P(90, 0), P(-84, 0)], d + 500, true)
  ink(g, hull, { w: 2.4 * Math.min(1.2, s), d, t: 500 })
  ink(g, L(P(-88, -10), P(94, -10)), { w: 1, d: d + 200, t: 300 })
  for (let c = 0; c < 6; c++) for (let r = 0; r < 2; r++) {
    const cb: P[] = RR(x + (-40 + c * 18) * s, y + (-44 - r * 14) * s, 16 * s, 12 * s, 1)
    if ((c + r) % 3 === 0) hatch(g, cb, d + 600 + c * 40)
    ink(g, cb, { w: 1, d: d + 300 + (c * 2 + r) * 30, t: 80 })
  }
  ink(g, RR(x - 82 * s, y - 64 * s, 30 * s, 38 * s, 2), { w: 1.8, d: d + 200, t: 300 })
  for (let k = 0; k < 3; k++) ink(g, RR(x + (-78 + k * 9) * s, y - 58 * s, 6 * s, 5 * s, 1), { w: 0.8, d: d + 400, t: 50 })
  ink(g, RR(x - 74 * s, y - 80 * s, 12 * s, 16 * s, 2), { w: 1.6, d: d + 300, t: 200 })
  hatch(g, RR(x - 74 * s, y - 80 * s, 12 * s, 5 * s, 1), d + 500, true)
}

/** Meeresboden-Profil von der Tiefsee (links) zur Küste (rechts) mit Erdreich */
function shelf(g: Element, d = 0): P[] {
  const bed = smooth([[20, 630], [140, 628], [210, 610], [260, 570], [300, 520], [340, 480]], 3)
  ink(g, bed, { w: 2.6, d, t: 700 })
  hatch(g, [...bed, [340, 650], [20, 650]], d + 300, true)
  return bed
}

/** Landmasse in flacher Karte um (cx, cy) zeichnen; rot = Euler-Drehung [Pol-Länge, Pol-Breite, Winkel] */
function land(g: Element, li: number, cx: number, cy: number, k: number, d = 0, o: { rot?: [number, number, number]; dense?: boolean; lon0?: number; lat0?: number } = {}): P[] {
  const lon0 = o.lon0 ?? 0
  const lat0 = o.lat0 ?? 0
  const pts = coastPts(li, (lon, lat) => {
    const [a, b] = o.rot ? rotPole(lon, lat, ...o.rot) : [lon, lat]
    return [cx + (a - lon0) * k * Math.cos(rad(lat0)), cy - (b - lat0) * k]
  }, 1)
  blank(g, pts)
  hatch(g, pts, d + 400, o.dense)
  ink(g, pts, { w: 2.2, d, t: 800, p: 0.3 })
  return pts
}

const SA_FIT: [number, number, number] = [-30.6, 44, 57]
const NA_FIT: [number, number, number] = [-18, 66, 72]
const AN_FIT: [number, number, number] = [90, 0, -25]
const AU_FIT: [number, number, number] = [60, -80, 40]

/** Afrikanischer Elefant von der Seite, Kopf rechts: Rücken, Ohr, Rüssel, Stoßzahn, vier Beine, Schwanz; y = Boden, Höhe ≈ 70·s */
function elephant(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = smooth([P(-40, -30), P(-36, -58), P(-10, -70), P(24, -66), P(40, -60), P(52, -64), P(62, -56), P(64, -40), P(62, -24), P(60, -8), P(66, 0), P(58, -2), P(54, -20), P(48, -30), P(42, -24), P(40, 0), P(30, 0), P(30, -20), P(-10, -20), P(-12, 0), P(-22, 0), P(-26, -22), P(-34, 0), P(-42, 0), P(-40, -30)], 2)
  blank(g, body)
  hatch(g, body, d + 500)
  ink(g, body, { w: 2 * Math.min(1.2, Math.max(0.6, s)), d, t: 600 })
  const ear: P[] = smooth([P(38, -58), P(30, -56), P(26, -40), P(32, -26), P(42, -30), P(44, -46), P(38, -58)], 3)
  blank(g, ear)
  ink(g, ear, { w: 1.4 * Math.max(0.6, s), d: d + 300, t: 300 })
  ink(g, B(P(54, -36), P(58, -34), P(66, -34), P(70, -40)), { w: 1.6 * Math.max(0.6, s), d: d + 400, t: 150 })
  dot(g, x + 52 * s, y - 50 * s, 1.4 * Math.max(0.6, s), d + 450)
  ink(g, B(P(-40, -50), P(-46, -44), P(-46, -34), P(-44, -26)), { w: 1.2, d: d + 400, t: 100 })
}

/** Tankwagen von der Seite, Front rechts; y = Boden */
function tanker(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  ink(g, RR(x - 40 * s, y - 30 * s, 62 * s, 22 * s, 10 * s), { w: 1.8, d, t: 300 })
  ink(g, [P(24, -8), P(24, -30), P(36, -30), P(42, -18), P(42, -8), P(-42, -8)], { w: 1.8, d: d + 100, t: 300 })
  for (const a of [-28, 8, 32]) {
    blank(g, E(x + a * s, y - 6 * s, 5 * s))
    ink(g, E(x + a * s, y - 6 * s, 5 * s), { w: 1.6, d: d + 200, t: 100 })
  }
}

export const AHA_ERDE: Bite[] = [
  {
    id: 'mercator',
    area: 'GEO',
    day: 9,
    hook: 'Ist Grönland wirklich so groß wie Afrika?',
    mood: 'raetsel',
    ambience: 'wind',
    images: [],
    draw: {
      karte(g) {
        worldMap(g, 20, 120, 320, 250, 'mercator', 0, { hi: [LAND.afrika, LAND.groenland] })
      },
      netz(g) {
        // nur das Netz: Abstände der Breitengrade wachsen nach außen
        const x = 30
        const y = 300
        const w = 250
        const h = 340
        const yOf = (lat: number) => y + h / 2 - (Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2)) / Math.log(Math.tan(Math.PI / 4 + rad(80) / 2))) * (h / 2)
        ink(g, RR(x, y, w, h, 2), { w: 2.6, t: 700 })
        for (let k = 1; k < 8; k++) ink(g, L([x + (w * k) / 8, y + 2], [x + (w * k) / 8, y + h - 2]), { w: 1, d: 300 + k * 40, t: 300 })
        const lats = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75]
        lats.forEach((lat, i) => ink(g, L([x + 2, yOf(lat)], [x + w - 2, yOf(lat)]), { w: lat === 0 ? 1.8 : 1, d: 500 + i * 60, t: 300 }))
        for (let i = 5; i < lats.length - 1; i++) {
          const y0 = yOf(lats[i])
          const y1 = yOf(lats[i + 1])
          arrow(g, L([x + w + 20, y0 - 3], [x + w + 20, y1 + 3]), { w: 1.4, d: 1200 + i * 120, t: 150, head: 5 })
          arrow(g, L([x + w + 20, y1 + 3], [x + w + 20, y0 - 3]), { w: 1.4, d: 1200 + i * 120, t: 150, head: 5 })
          ink(g, L([x + w + 10, y1], [x + w + 30, y1]), { w: 1, d: 1200 + i * 120, t: 60 })
        }
      },
      mercator(g) {
        // Seekarte im Stil des 16. Jahrhunderts: Windrose mit 16 Kurslinien, Küste, Segelschiff
        ink(g, RR(24, 310, 312, 330, 4), { w: 3, t: 700 })
        ink(g, RR(32, 318, 296, 314, 2), { w: 1.2, d: 200, t: 700 })
        const cx = 180
        const cy = 470
        const cg = clipBox(g, 32, 318, 296, 314)
        for (let k = 0; k < 16; k++) {
          const a = rad(k * 22.5)
          ink(cg, L([cx, cy], [cx + Math.cos(a) * 220, cy + Math.sin(a) * 220]), { w: k % 4 ? 0.7 : 1.2, d: 400 + k * 30, t: 300 })
        }
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45 - 90)
          const r = k % 2 ? 26 : 50
          const tip: P = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
          const l: P = [cx + Math.cos(a - rad(90)) * 8, cy + Math.sin(a - rad(90)) * 8]
          const rr: P = [cx + Math.cos(a + rad(90)) * 8, cy + Math.sin(a + rad(90)) * 8]
          blank(g, [l, tip, rr, [cx, cy], l])
          hatch(g, [[cx, cy], tip, rr, [cx, cy]], 900 + k * 40, true)
          ink(g, [l, tip, rr, [cx, cy], l], { w: 1.6, d: 800 + k * 40, t: 150 })
        }
        ink(g, E(cx, cy, 14), { w: 1.6, d: 1100, t: 150 })
        ink(g, smooth([[32, 340], [70, 360], [80, 400], [60, 440], [70, 480], [40, 520], [32, 560]], 3), { w: 2.4, d: 600, t: 600 })
        const sh = wobble(g, { dy: 3, deg: 2, ox: 270, oy: 590, ms: 1800, d: 1200 })
        galleon(sh, 270, 590, 0.9, 1000)
      },
      schiff(g) {
        // Mercator-Karte: gerade Linie = fester Kompasskurs von Lissabon in die Karibik, Schiff fährt sie ab
        const pr = worldMap(g, 20, 330, 320, 250, 'mercator', 0, { hi: [] })
        const a = pr(-9, 38.7)
        const b = pr(-66, 18)
        arrow(g, L(a, b), { w: 3, d: 1000, t: 900, head: 12 })
        const sh = mk('g', {}, g)
        mk('animateTransform', { attributeName: 'transform', type: 'translate', from: '0 0', to: `${b[0] - a[0]} ${b[1] - a[1]}`, dur: '4s', begin: '1.8s', repeatCount: 'indefinite' }, sh)
        galleon(sh, a[0], a[1] - 2, 0.35, 1400)
        const rose = pr(-30, 60)
        for (let k = 0; k < 8; k++) ink(g, L(rose, [rose[0] + Math.cos(rad(k * 45)) * 16, rose[1] + Math.sin(rad(k * 45)) * 16]), { w: k % 2 ? 0.8 : 1.6, d: 1200, t: 80 })
        ink(g, E(rose[0], rose[1], 8), { w: 1.2, d: 1250, t: 100 })
        ink(g, E(a[0], a[1], 14, 14, 180, 180 + Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 180), { w: 1.6, d: 2000, t: 300 })
      },
      wahr(g) {
        // flächentreu: Afrika, darüber Grönland in wahrer Größe hineingeschoben
        const k = 3.8
        const af = coastPts(LAND.afrika, (lon, lat) => [180 + (lon - 17) * Math.cos(rad(lat)) * k, 470 - lat * k])
        blank(g, af)
        hatch(g, af, 500, true)
        ink(g, af, { w: 2.4, t: 900 })
        const m = mk('g', {}, g)
        mk('animateTransform', { attributeName: 'transform', type: 'translate', from: '-90 -170', to: '0 0', dur: '1.6s', begin: '1.2s', fill: 'freeze', calcMode: 'spline', keySplines: '.3 0 .3 1', keyTimes: '0;1' }, m)
        const gr = coastPts(LAND.groenland, (lon, lat) => [190 + (lon + 42) * Math.cos(rad(lat)) * k, 430 - (lat - 72) * k])
        blank(m, gr)
        ink(m, gr, { w: 2.6, d: 1000, t: 600 })
        ripple(g, 190, 430, 10, 50, { n: 2, ms: 1600, d: 3000, w: 1 })
      },
      orange(g) {
        // Globus-Segmente: sechs Streifen, je 60° breit, wie eine abgezogene Orangenschale
        const k = 2.2
        for (let i = 0; i < 6; i++) {
          const c = -150 + i * 60
          const gx = 30 + i * 50 + 25
          const pr = (lon: number, lat: number): P => [gx + (lon - c) * Math.cos(rad(lat)) * k * 0.38, 470 - lat * k * 0.95]
          const gore: P[] = [...Array.from({ length: 37 }, (_, j) => pr(c + 30, -90 + j * 5)), ...Array.from({ length: 37 }, (_, j) => pr(c - 30, 90 - j * 5))]
          const id = `gore${++goreN}`
          const cp = mk('clipPath', { id }, g)
          mk('path', { d: `M${gore.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z` }, cp)
          const cg = mk('g', { 'clip-path': `url(#${id})` }, g)
          ;[LAND.afrika, LAND.eurasien, LAND.nordamerika, LAND.groenland, LAND.suedamerika, LAND.australien, LAND.antarktis].forEach((li, j) => {
            const pts = coastPts(li, (lon, lat) => {
              let l = lon
              while (l - c > 180) l -= 360
              while (l - c < -180) l += 360
              return pr(l, lat)
            })
            hatch(cg, pts, 600 + i * 80 + j * 20)
            ink(cg, pts, { w: 1, d: 400 + i * 80, t: 500, p: 0.3 })
          })
          ink(g, [...gore, gore[0]], { w: 2.2, d: i * 80, t: 500 })
        }
      },
      gauss(g) {
        // Kugel → flach: es geht nur mit Rissen oder Dehnung
        earth(g, 90, 470, 62, 0, { lon: 0, lat: 20, grid: true })
        arrow(g, L([168, 470], [204, 470]), { w: 2.6, d: 900, t: 300, head: 10 })
        const sheet: P[] = [[220, 400], [336, 404], [332, 540], [224, 536], [220, 400]]
        blank(g, sheet)
        ink(g, sheet, { w: 2.6, d: 1100, t: 500 })
        ink(g, [[278, 402], [270, 430], [284, 452], [272, 470]], { w: 2.2, d: 1500, t: 200 })
        ink(g, [[334, 470], [310, 476], [318, 492], [300, 500]], { w: 2.2, d: 1600, t: 200 })
        for (let k = 0; k < 3; k++) ink(g, waveP(232, 320, 500 + k * 10, 2, 16, k), { w: 0.9, d: 1700 + k * 80, t: 300 })
        question(g, 280, 600, 0.6, 1900)
      },
      kreise(g) {
        // gleich große Kreise auf der Kugel, auf der Karte zu den Polen hin immer größer
        const pr = worldMap(g, 20, 340, 320, 250, 'mercator', 0, { grid: true })
        for (const lat of [-60, -30, 0, 30, 60]) for (const lon of [-120, -40, 40, 120]) {
          const [cx, cy] = pr(lon, lat)
          const r = 7 / Math.cos(rad(lat))
          blank(g, E(cx, cy, r))
          hatch(g, E(cx, cy, r), 1300 + Math.abs(lat) * 12, true)
          ink(g, E(cx, cy, r), { w: 1.6, d: 1200 + Math.abs(lat) * 12, t: 200 })
        }
      },
      russland(g) {
        // flächentreue Karte: Afrika, Sibirien, Brasilien, Alaska jeweils dicht schraffiert
        const pr = worldMap(g, 20, 380, 320, 204, 'peters', 0, { hi: [LAND.afrika] })
        regionHatch(g, pr, LAND.eurasien, 30, 180, 48, 80, 1200)
        regionHatch(g, pr, LAND.suedamerika, -70, -34, -33, 5, 1500)
        regionHatch(g, pr, LAND.nordamerika, -170, -141, 54, 72, 1800)
      },
      antarktis(g) {
        worldMap(g, 20, 340, 320, 250, 'mercator', 0, { hi: [LAND.antarktis, LAND.suedamerika] })
      },
      peters(g) {
        worldMap(g, 20, 380, 320, 204, 'peters', 0, { hi: [LAND.afrika, LAND.groenland] })
      },
      handy(g) {
        // Smartphone mit Kartenausschnitt: rechtwinklige Straßenecken, Standortnadel, Zoom
        ink(g, RR(110, 310, 140, 290, 22), { w: 3, t: 600 })
        ink(g, RR(160, 320, 40, 8, 4), { w: 1.6, d: 200, t: 150 })
        const c = clipBox(g, 120, 334, 120, 250)
        for (let k = 0; k < 5; k++) {
          ink(c, L([120, 360 + k * 50], [240, 352 + k * 50]), { w: k === 2 ? 6 : 3, d: 300 + k * 60, t: 300 })
          ink(c, L([140 + k * 30, 334], [150 + k * 30, 584]), { w: k === 1 ? 5 : 2.4, d: 400 + k * 60, t: 300 })
        }
        for (let k = 0; k < 6; k++) hatch(c, RR(148 + (k % 3) * 30, 366 + Math.floor(k / 3) * 100, 18, 30, 2), 800 + k * 40)
        const pin: P[] = [...B([180, 470], [168, 450], [166, 430], [180, 424]), ...B([180, 424], [194, 430], [192, 450], [180, 470]).slice(1)]
        const pp = pop(g, 1300, '50% 100%')
        blank(pp, pin)
        hatch(pp, pin, 0, true)
        ink(pp, pin, { w: 2, t: 0 })
        blank(pp, E(180, 438, 5))
        ripple(g, 180, 470, 6, 26, { n: 2, ms: 1600, d: 1500, w: 1, ry: 0.4 })
        ink(g, E(180, 584, 10), { w: 1.6, d: 500, t: 150 })
        for (const [dx, s] of [[-1, '+'], [1, '−']] as const) {
          ink(g, E(290 + dx * 0, 400 + dx * 26, 12), { w: 1.8, d: 900, t: 150 })
          text(g, 290, 406 + dx * 26, s, { anchor: 'middle', size: 18, d: 1000 })
        }
      },
      tripel(g) {
        worldMap(g, 20, 380, 320, 196, 'tripel', 0, {})
      },
      ende(g) {
        // Tischglobus: Kugel, Meridianring, Achse, Fuß
        earth(g, 180, 450, 100, 0, { lon: 10, lat: 25, grid: true })
        ink(g, E(180, 450, 112, 112, -150, 120), { w: 3, d: 700, t: 600 })
        ink(g, L([180 + Math.cos(rad(-112)) * 116, 450 + Math.sin(rad(-112)) * 116], [180 + Math.cos(rad(-112)) * 104, 450 + Math.sin(rad(-112)) * 104]), { w: 3, d: 900, t: 100 })
        ink(g, L([180, 562], [180, 600]), { w: 3.4, d: 900, t: 200 })
        ink(g, E(180, 612, 60, 12), { w: 2.8, d: 1000, t: 400 })
        ink(g, B([120, 612], [122, 626], [238, 626], [240, 612]), { w: 2.4, d: 1100, t: 300 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { karte: {} } },
      { t: T('Auf vielen Weltkarten wirkt Grönland fast so groß wie **Afrika**. In Wahrheit ist Afrika etwa vierzehnmal größer.', 64), gfx: { wahr: {} } },
      { t: T('Schuld ist die Karte selbst: die **Mercator-Projektion**, gezeichnet 1569 vom Kartografen Gerhard Mercator.', 64), gfx: { mercator: {} } },
      { t: T('Das Problem dahinter: Die Erde ist eine Kugel. Eine Kugeloberfläche lässt sich **nicht verzerrungsfrei** flach ausbreiten.', 64), gfx: { gauss: {} } },
      { t: T('Probier es mit einer Orangenschale: Flach bekommst du sie nur, wenn sie **reißt** oder du sie dehnst.', 64), gfx: { orange: {} } },
      { t: T('Carl Friedrich Gauß bewies 1827 mathematisch: Jede flache Karte der Erde muss **etwas verzerren** – Flächen, Winkel oder Abstände.', 64), gfx: { gauss: {} } },
      { t: T('Mercator wählte bewusst: Seine Karte bewahrt **Winkel**. Eine gerade Linie bedeutet einen festen Kompasskurs.', 64), gfx: { schiff: {} } },
      { t: T('Für Seefahrer war das genial. Man zieht eine Linie zum Ziel, liest den Winkel ab – und **hält den Kurs**.', 64), gfx: { schiff: {} } },
      { t: T('Der Preis dafür: Zu den Polen hin werden die Breitengrade immer weiter **auseinandergezogen**.', 64), gfx: { netz: {} } },
      { t: T('Bei 80 Grad Breite wird schon fast **sechsfach** gedehnt. Die Pole selbst passen gar nicht mehr auf die Karte – sie lägen unendlich weit weg.', 64), gfx: { kreise: {} } },
      { t: T('Ein Kreis, der am Äquator klein ist, wird bei 60 Grad Breite **doppelt so breit** gezeichnet – und hat die vierfache Fläche.', 64), gfx: { kreise: {} } },
      { t: T('Darum wirken Länder weit im Norden riesig: Grönland, Kanada, **Russland**.', 64), gfx: { karte: { tf: [0.9, 18, 200] } } },
      { t: T('Russland ist tatsächlich groß – aber Afrika ist fast **doppelt so groß**. Brasilien ist fünfmal größer als Alaska.', 64), gfx: { russland: {} } },
      { t: T('Ganz unten wird die Antarktis zum endlosen Band – obwohl sie kleiner ist als **Südamerika**.', 64), gfx: { antarktis: {} } },
      { t: T('Die Gall-Peters-Karte zeigt Flächen dagegen **richtig**. Dafür sehen die Länder seltsam langgezogen aus.', 64), gfx: { peters: {} } },
      { t: T('Als sie 1973 vorgestellt wurde, war das auch **politisch** gemeint: Afrika und Südamerika sollten in voller Größe erscheinen.', 64), gfx: { peters: {} } },
      { t: T('Online-Karten nutzen bis heute eine Mercator-Variante: Beim Hineinzoomen bleiben Straßenecken so **rechtwinklig**.', 64), gfx: { handy: {} } },
      { t: T('Für Weltkarten setzen viele Atlanten heute auf Kompromisse wie die **Winkel-Tripel**-Projektion: alles etwas verzerrt, nichts extrem.', 64), gfx: { tripel: {} } },
      { t: T('Es gibt also keine perfekte Karte – nur Karten für **verschiedene Zwecke**.', 64), gfx: { tripel: {} } },
      { t: T('Die ehrlichste Weltkarte ist und bleibt ein **Globus**.', 64), gfx: { ende: {} } },
      { t: T('Jede flache Karte **lügt** ein bisschen.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Eine Kugel lässt sich nicht verzerrungsfrei flach abbilden (Gauß 1827).', 'Mercator (1569) bewahrt Winkel für die Navigation, bläht aber polnahe Flächen auf.', 'Afrika ist rund 14-mal so groß wie Grönland; flächentreue Karten verzerren dafür Formen.'],
    sources: ['Snyder 1993: Flattening the Earth', 'USGS: Map Projections – A Working Manual', 'CIA World Factbook (Flächen)'],
  },
  {
    id: 'wueste-kalt',
    area: 'GEO',
    day: 71,
    hook: 'Warum wird es in der Wüste nachts eiskalt?',
    mood: 'kosmisch',
    ambience: 'wind',
    images: [],
    draw: {
      wueste(g) {
        // Dünen unter Sonne und Mond, Karawane, Windrippel
        sunDisk(g, 80, 150, 30, 0)
        moon(g, 280, 140, 26, 500)
        stars(g, 200, 90, 150, 120, 10, 700, (x, y) => Math.hypot(x - 280, y - 140) < 40)
        dune(g, 20, 230, 420, 110, 300)
        dune(g, 150, 340, 420, 70, 500)
        ink(g, L([20, 422], [340, 422]), { w: 2.6, d: 200, t: 500 })
        hatch(g, [...B([20, 420], [83, 310], [146, 310], [230, 420])], 900)
        for (let k = 0; k < 5; k++) ink(g, B([60 + k * 30, 400 - k * 4], [70 + k * 30, 396 - k * 4], [80 + k * 30, 402 - k * 4], [90 + k * 30, 398 - k * 4]), { w: 0.9, d: 1000 + k * 60, t: 150 })
        for (const [x, s] of [[200, 0.6], [262, 0.52], [314, 0.46]] as const) {
          const w = glide(g, 20, 0, { ms: 6000, d: 1200, loop: true })
          camel(w, x, 410, s, 900)
        }
      },
      tag(g) {
        // Mittagshitze: Sonne, flimmernde Luft, Thermometer mit Skala weit oben
        sunDisk(g, 250, 360, 40, 0)
        for (let k = 0; k < 4; k++) {
          const w = wobble(g, { dx: 6, ms: 1100 + k * 200, d: 900 })
          ink(w, waveP(160, 330, 470 + k * 24, 3, 30, k), { w: 1, d: 800 + k * 80, t: 400 })
        }
        dune(g, 140, 340, 600, 60, 300)
        cactus(g, 290, 600, 0.6, 500)
        ink(g, L([20, 602], [340, 602]), { w: 2.6, d: 200, t: 500 })
        thermo(g, 80, 330, 220, 0.9, 300)
        const yv = (v: number) => 330 + 8 + (220 - 8) * (1 - (v + 10) / 55)
        for (const v of [0, 20, 40]) {
          ink(g, L([92, yv(v)], [104, yv(v)]), { w: 1.6, d: 500, t: 60 })
          text(g, 108, yv(v) + 5, String(v), { cls: 's', d: 600 })
        }
      },
      nacht(g) {
        // Nacht in der Wüste: Mond, Sterne, Zelt, Thermometer bei null
        moon(g, 260, 360, 32, 0)
        stars(g, 150, 300, 200, 160, 18, 400, (x, y) => Math.hypot(x - 260, y - 360) < 46)
        dune(g, 140, 340, 600, 60, 300)
        ink(g, L([20, 602], [340, 602]), { w: 2.6, d: 200, t: 500 })
        const tent: P[] = [[170, 600], [220, 520], [290, 600], [170, 600]]
        blank(g, tent)
        hatch(g, tent, 900)
        ink(g, tent, { w: 2.4, d: 700, t: 400 })
        ink(g, [[212, 600], [220, 548], [232, 600]], { w: 1.6, d: 900, t: 200 })
        thermo(g, 80, 330, 220, 0.2, 300)
        const yv = (v: number) => 330 + 8 + (220 - 8) * (1 - (v + 10) / 55)
        for (const v of [0, 20, 40]) {
          ink(g, L([92, yv(v)], [104, yv(v)]), { w: 1.6, d: 500, t: 60 })
          text(g, 108, yv(v) + 5, String(v), { cls: 's', d: 600 })
        }
      },
      strahlt(g) {
        // klare Nacht: der Sand strahlt Wärme ab, sie entweicht ungehindert zu den Sternen
        stars(g, 20, 300, 320, 120, 22, 0)
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 200, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 650], [20, 650]], 400)
        for (let k = 0; k < 8; k++) dot(g, 30 + k * 40, 620 + (k % 2) * 14, 1.6, 600)
        for (const x of [60, 150, 240, 320]) irArrow(g, [x, 590], [x + 10, 330], 400 + x * 2)
        for (const x of [100, 200, 290]) {
          const f = glide(g, 0, -260, { ms: 2400, d: 1400 + x * 3, loop: true })
          ink(f, waveP(x - 8, x + 8, 590, 3, 6), { w: 1.6, d: 1300, t: 100 })
        }
      },
      decke(g) {
        // feuchte Luft: eine Schicht Wasserdampf schluckt die Strahlung und schickt einen Teil zurück
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 650], [20, 650]], 300)
        for (let i = 0; i < 12; i++) {
          const w = wobble(g, { dx: 4, dy: 3, ms: 700 + i * 60, d: 900 })
          water(w, 34 + i * 27, 400 + (i % 3) * 20, 0.5, i * 40, 200 + i * 40)
        }
        for (const x of [60, 160, 260]) {
          irArrow(g, [x, 590], [x + 10, 440], 600)
          irArrow(g, [x + 30, 440], [x + 40, 590], 1300)
        }
        stars(g, 20, 300, 320, 60, 10, 0)
      },
      wasser(g) {
        // Lupe auf trockene Luft: Stickstoff- und Sauerstoffmoleküle, nur ein einziges Wassermolekül
        ink(g, E(180, 460, 140), { w: 3, t: 700 })
        let seed = 4
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 16; i++) {
          const a = rnd() * Math.PI * 2
          const r = 20 + rnd() * 100
          const x = 180 + Math.cos(a) * r
          const y = 460 + Math.sin(a) * r
          if (Math.hypot(x - 230, y - 420) < 40) continue
          const w = wobble(g, { dx: (rnd() - 0.5) * 16, dy: (rnd() - 0.5) * 16, ms: 600 + rnd() * 600, d: 900 })
          const o = rnd() * Math.PI
          const fill = i % 4 === 0 ? 'hell' : 'leer'
          ball(w, x - Math.cos(o) * 7, y - Math.sin(o) * 7, 8, { d: 300 + i * 40, fill, w: 1.6, t: 100 })
          ball(w, x + Math.cos(o) * 7, y + Math.sin(o) * 7, 8, { d: 300 + i * 40, fill, w: 1.6, t: 100 })
        }
        const ww = wobble(g, { dx: 6, dy: -6, ms: 900, d: 1200 })
        water(ww, 230, 420, 1.2, 20, 1000)
        ripple(g, 230, 420, 20, 50, { n: 2, ms: 1600, d: 1400, w: 1 })
      },
      vergleich(g) {
        // links Wüste, rechts Regenwald; die Klammer zeigt den Unterschied zwischen Tag und Nacht
        ink(g, L([20, 620], [340, 620]), { w: 2.6, t: 500 })
        dune(g, 20, 170, 620, 50, 200)
        cactus(g, 110, 620, 0.5, 300)
        for (const [x, s] of [[230, 0.55], [280, 0.7], [320, 0.5]] as const) tree(g, x, 620, s, 300)
        for (let k = 0; k < 3; k++) cloud(g, 230 + k * 40, 380 + (k % 2) * 16, 0.4, 600 + k * 100, k === 1)
        for (const [x, top, bot, d] of [[60, 330, 560, 900], [200, 430, 500, 1200]] as const) {
          arrow(g, L([x, (top + bot) / 2], [x, top]), { w: 2.4, d, t: 300, head: 8 })
          arrow(g, L([x, (top + bot) / 2], [x, bot]), { w: 2.4, d, t: 300, head: 8 })
          for (const y of [top, bot]) ink(g, L([x - 10, y], [x + 10, y]), { w: 2, d: d + 200, t: 80 })
        }
        sunDisk(g, 130, 340, 16, 400)
        moon(g, 130, 540, 12, 500)
      },
      sand(g) {
        // gleiche Flamme unter Wasser und Sand: der Sand wird viel schneller heiß
        for (const [x, dense, lvl] of [[40, false, 0.35], [200, true, 0.85]] as const) {
          ink(g, [[x, 420], [x + 6, 560], [x + 114, 560], [x + 120, 420]], { w: 2.8, d: 200, t: 500 })
          const fill: P[] = [[x + 4, 470], [x + 116, 470], [x + 112, 556], [x + 8, 556]]
          if (dense) for (let k = 0; k < 40; k++) dot(g, x + 14 + (k % 10) * 10 + (Math.floor(k / 10) % 2) * 5, 480 + Math.floor(k / 10) * 20, 2, 500 + k * 15)
          else {
            hatch(g, fill, 500)
            ink(g, waveP(x + 6, x + 114, 470, 2, 20), { w: 1.4, d: 400, t: 300 })
          }
          ink(g, L([x + 30, 560], [x + 30, 620]), { w: 2, d: 300, t: 200 })
          ink(g, L([x + 90, 560], [x + 90, 620]), { w: 2, d: 300, t: 200 })
          const fw = wobble(g, { deg: 4, ox: x + 60, oy: 616, ms: 600, d: 900 })
          flame(fw, x + 60, 616, 0.4, 600)
          thermo(g, x + 60, 320, 120, lvl, 900)
        }
      },
      kueste(g) {
        // links Meer, rechts Wüstenküste: das Wasser puffert, Thermometer schwanken unterschiedlich stark
        for (const y of [560, 584, 608]) travelWave(g, 20, 170, y, 4, 40, { ms: 2400, d: 200, w: 1.8 })
        ink(g, L([170, 620], [340, 620]), { w: 2.6, d: 200, t: 400 })
        dune(g, 180, 340, 620, 60, 300)
        ink(g, B([160, 620], [168, 600], [176, 580], [190, 570]), { w: 2, d: 300, t: 200 })
        for (const [x, lo, hi] of [[90, 0.45, 0.55], [270, 0.15, 0.9]] as const) {
          thermo(g, x, 330, 140, (lo + hi) / 2, 600)
          const yv = (v: number) => 330 + 8 + 132 * (1 - v)
          arrow(g, L([x + 26, yv((lo + hi) / 2)], [x + 26, yv(hi) - 4]), { w: 1.8, d: 1100, t: 200, head: 6 })
          arrow(g, L([x + 26, yv((lo + hi) / 2)], [x + 26, yv(lo) + 4]), { w: 1.8, d: 1100, t: 200, head: 6 })
        }
      },
      antarktis(g) {
        // flächentreue Weltkarte: Antarktis und Sahara dicht schraffiert
        const pr = worldMap(g, 20, 380, 320, 204, 'peters', 0, { hi: [LAND.antarktis] })
        regionHatch(g, pr, LAND.afrika, -17, 34, 15, 34, 1300)
      },
      frost(g) {
        // sternklare Frühlingsnacht: Jungpflanze im Beet, Eiskristalle an den Blättern
        stars(g, 20, 300, 320, 120, 20, 0)
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 200, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 650], [20, 650]], 400, true)
        for (const x of [90, 180, 270]) {
          ink(g, L([x, 600], [x, 520]), { w: 2.2, d: 400, t: 300 })
          for (const k of [-1, 1]) {
            const lf: P[] = smooth([[x, 550 - (k + 1) * 8], [x + k * 18, 530 - (k + 1) * 8], [x + k * 38, 536 - (k + 1) * 8], [x + k * 22, 552 - (k + 1) * 8], [x, 550 - (k + 1) * 8]], 3)
            blank(g, lf)
            ink(g, lf, { w: 1.8, d: 600, t: 300 })
            for (let j = 0; j < 3; j++) flake(g, x + k * (10 + j * 9), 538 - (k + 1) * 8 + (j % 2) * 4, 3, 1300 + j * 100)
          }
        }
        for (const x of [130, 230]) irArrow(g, [x, 590], [x + 10, 430], 800)
      },
      wolke(g) {
        // bewölkte Nacht: die Wolkendecke wirft die Wärmestrahlung zurück
        cloud(g, 110, 380, 1.1, 0, true)
        cloud(g, 260, 370, 1.2, 200, true)
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 200, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 650], [20, 650]], 400)
        for (const x of [80, 200, 300]) {
          irArrow(g, [x, 590], [x + 6, 420], 600)
          irArrow(g, [x + 20, 420], [x + 26, 590], 1300)
        }
      },
      mond(g) {
        // Mond ohne Luft: Tagseite in der Sonne, Nachtseite dunkel
        sunDisk(g, 40, 350, 24, 0)
        moonFace(g, 200, 480, 110, 300)
        hatch(g, [...E(200, 480, 110, 110, -90, 90), ...E(200, 480, 40, 110, 90, -90)], 1000, true)
        ink(g, E(200, 480, 40, 110, -90, 90), { w: 1.4, d: 900, t: 500 })
      },
      gewand(g) {
        // Tuareg in weitem Gewand mit Turban neben dem Dromedar
        ink(g, L([20, 620], [340, 620]), { w: 2.6, t: 500 })
        camel(g, 250, 620, 1, 200)
        const robe: P[] = smooth([[96, 380], [130, 372], [146, 420], [158, 520], [168, 618], [56, 618], [70, 520], [82, 420], [96, 380]], 3)
        blank(g, robe)
        hatch(g, robe, 800)
        ink(g, robe, { w: 2.6, d: 400, t: 600 })
        for (let k = 0; k < 3; k++) ink(g, B([92 + k * 16, 420], [88 + k * 16, 500], [96 + k * 16, 560], [90 + k * 16, 616]), { w: 1.1, d: 700 + k * 80, t: 300 })
        const headP: P[] = smooth([[96, 380], [92, 350], [100, 326], [126, 324], [134, 350], [130, 372], [96, 380]], 3)
        blank(g, headP)
        hatch(g, headP, 900, true)
        ink(g, headP, { w: 2.4, d: 600, t: 300 })
        blank(g, RR(102, 344, 26, 8, 3))
        ink(g, RR(102, 344, 26, 8, 3), { w: 1.2, d: 900, t: 100 })
        for (const x of [110, 120]) dot(g, x, 348, 1.6, 1000)
        const w = wobble(g, { deg: 4, ox: 130, oy: 380, ms: 1600, d: 1200 })
        ink(w, B([132, 360], [150, 370], [160, 400], [156, 430]), { w: 1.8, d: 1100, t: 200 })
      },
      ende(g) {
        moon(g, 180, 420, 50, 0)
        stars(g, 30, 310, 300, 160, 16, 300, (x, y) => Math.hypot(x - 180, y - 420) < 70)
        dune(g, 20, 220, 620, 70, 500)
        dune(g, 160, 340, 620, 50, 700)
        ink(g, L([20, 622], [340, 622]), { w: 2.6, d: 400, t: 500 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { wueste: {} } },
      { t: T('In der Sahara klettert das Thermometer tagsüber oft auf **über 40 Grad**.', 64), gfx: { tag: {} } },
      { t: T('Nachts kann es dort bis **nahe null Grad** abkühlen. Wer in der Wüste zeltet, braucht einen warmen Schlafsack.', 64), gfx: { nacht: {} } },
      { t: T('Der Grund ist unsichtbar: Es fehlt **Wasserdampf** in der Luft.', 64), gfx: { wasser: {} } },
      { t: T('Jeder warme Boden strahlt Wärme ab – als unsichtbares **Infrarotlicht**. Nachts kommt von der Sonne nichts mehr nach.', 64), gfx: { strahlt: {} } },
      { t: T('In trockener Luft entweicht diese Strahlung fast ungehindert **ins Weltall**. Der Boden kühlt schnell aus.', 64), gfx: { strahlt: {} } },
      { t: T('Feuchte Luft wirkt dagegen wie eine **Decke**: Wasserdampf schluckt die Wärmestrahlung und schickt einen Teil zurück zum Boden.', 64), gfx: { decke: {} } },
      { t: T('Wasserdampf ist sogar das **wichtigste Treibhausgas** der Erde – noch vor CO₂.', 64), gfx: { decke: {} } },
      { t: T('Am Tag hilft die trockene Luft der Sonne: Ohne Wolken und Dunst trifft ihr Licht **fast ungebremst** auf den Boden.', 64), gfx: { tag: {} } },
      { t: T('Darum schwankt die Temperatur im feuchten Regenwald zwischen Tag und Nacht **viel weniger** als in der Wüste.', 64), gfx: { vergleich: {} } },
      { t: T('Dazu kommt der Sand: Er speichert Wärme **schlecht**. Wasser speichert pro Gramm etwa fünfmal so viel.', 64), gfx: { sand: {} } },
      { t: T('Sand heizt sich darum tagsüber schnell auf – und gibt die Wärme nachts **genauso schnell** wieder ab.', 64), gfx: { sand: {} } },
      { t: T('An Küsten ist es deshalb milder: Das Meer puffert wie ein riesiger **Wärmespeicher**.', 64), gfx: { kueste: {} } },
      { t: T('Klare Nächte bringen auch bei uns Kälte: Unter wolkenlosem Himmel bildet sich im Frühjahr **Bodenfrost**.', 64), gfx: { frost: {} } },
      { t: T('Darum warnen Wetterdienste nach klaren Frühlingstagen vor Nachtfrost – auch wenn es mittags **warm** war.', 64), gfx: { frost: {} } },
      { t: T('Ziehen nachts **Wolken** auf, bleibt es spürbar wärmer – sie halten die Wärme fest.', 64), gfx: { wolke: {} } },
      { t: T('Übrigens: Wüste heißt nicht Hitze, sondern **kaum Niederschlag**. Die größte Wüste der Erde ist die Antarktis.', 64), gfx: { antarktis: {} } },
      { t: T('Ganz ohne Luft wird es extrem: Auf dem Mond schwankt die Temperatur zwischen über 120 und **unter −170** Grad.', 64), gfx: { mond: {} } },
      { t: T('Die Wüstenbewohner wissen das seit jeher: Weite, dichte **Gewänder** schützen tagsüber vor Hitze und nachts vor Kälte.', 64), gfx: { gewand: {} } },
      { t: T('Ohne Wasserdampf fehlt die **Decke**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Nachts strahlt der Boden Wärme als Infrarot ab; trockene Luft lässt sie ins All entweichen.', 'Wasserdampf und Wolken halten Wärme zurück – feuchte Gegenden kühlen nachts weniger ab.', 'Sand speichert Wärme schlecht; Wüste bedeutet wenig Niederschlag, nicht Hitze.'],
    sources: ['Deutscher Wetterdienst: Wetterlexikon (Ausstrahlung)', 'NASA Earth Observatory: Climate and Earth’s Energy Budget', 'Williams et al. 2012, Lunar Diviner (Mondtemperaturen)'],
  },
  {
    id: 'meer-salzig',
    area: 'GEO',
    day: 29,
    hook: 'Warum ist das Meer salzig – aber Flüsse nicht?',
    mood: 'ruhig',
    ambience: 'wellen',
    images: [],
    draw: {
      meer(g) {
        // Felsen in der Brandung, darauf ausgeblühte Salzkristalle; Möwen
        for (const [y, d] of [[330, 0], [366, 150], [402, 300]] as const) travelWave(g, 20, 340, y, 5, 60, { ms: 2600 + y, d, w: 2.2 })
        const rock: P[] = smooth([[150, 400], [160, 300], [200, 270], [250, 290], [270, 400]], 3)
        blank(g, [...rock, [150, 400]])
        hatch(g, [...rock.slice(2), [230, 400]], 600)
        ink(g, rock, { w: 3, d: 200, t: 600 })
        for (const [x, y, s, d] of [[176, 276, 22, 900], [204, 256, 28, 1000], [234, 274, 18, 1100], [196, 236, 14, 1300]] as const) crystal(g, x, y, s, d)
        for (const [x, y] of [[70, 150], [110, 120], [300, 170]] as const) {
          const b = glide(g, 30, -10, { ms: 4000, d: 600, loop: true })
          bird(b, x, y, 0.6, 500)
        }
      },
      regen(g) {
        // Regen über dem Gebirge; die Tropfen nehmen Kohlendioxid aus der Luft auf
        cloud(g, 130, 360, 1.3, 0, true)
        rain(g, 60, 390, 150, 180, { n: 12, d: 600, ms: 900 })
        mountain(g, 120, 340, 620, [250, 450], 300)
        mountain(g, 20, 180, 620, [90, 520], 400)
        ink(g, L([20, 620], [340, 620]), { w: 2.6, d: 200, t: 500 })
        for (const [x, y] of [[230, 400], [290, 380], [260, 330]] as const) {
          const w = wobble(g, { dx: -6, dy: 4, ms: 1400 + x, d: 1000 })
          mol(w, [[x - 16, y, 'O', 'hell'], [x, y, 'C'], [x + 16, y, 'O', 'hell']], [[0, 1, true], [1, 2, true]], 0.7, 900)
        }
      },
      saeure(g) {
        // Tropfen auf Gestein: die schwache Säure löst Ionen aus den Mineralkörnern
        const rock: P[] = smooth([[20, 560], [80, 548], [140, 556], [220, 544], [280, 552], [340, 546]], 3)
        ink(g, rock, { w: 3, t: 600 })
        hatch(g, [...rock, [340, 650], [20, 650]], 300)
        for (let k = 0; k < 9; k++) {
          const x = 36 + k * 36
          const p: P[] = Array.from({ length: 7 }, (_, j) => [x + Math.cos(rad(j * 60 + k * 13)) * 14, 590 + (k % 2) * 22 + Math.sin(rad(j * 60 + k * 13)) * 10] as P)
          blank(g, p)
          ink(g, p, { w: 1.4, d: 400 + k * 40, t: 150 })
        }
        const dp: P[] = B([90, 548], [110, 420], [250, 420], [270, 548])
        blank(g, [...dp, [90, 548]])
        ink(g, dp, { w: 2.4, d: 600, t: 500 })
        ink(g, B([120, 470], [140, 448], [170, 440], [190, 440]), { w: 1.2, d: 800, t: 200 })
        for (let k = 0; k < 5; k++) {
          const up = glide(g, (k - 2) * 14, -70, { ms: 2200, d: 1200 + k * 300, loop: true })
          ion(up, 140 + k * 20, 540, k % 2 === 0, 0.7, 1100)
        }
        for (const [x, y] of [[150, 500], [210, 490]] as const) {
          ball(g, x, y, 5, { d: 1000, fill: 'leer', w: 1.2, t: 60 })
        }
      },
      fluss(g) {
        // Gebirge → Fluss mäandert zur Küste, gelöste Ionen treiben mit
        mountain(g, 20, 200, 470, [100, 320], 0)
        mountain(g, 120, 260, 470, [200, 360], 200)
        ink(g, L([20, 472], [340, 472]), { w: 1.6, d: 200, t: 400 })
        const riv = smooth([[110, 470], [140, 510], [90, 550], [160, 590], [250, 580], [300, 620], [340, 640]], 4)
        ink(g, riv, { w: 3, d: 600, t: 900 })
        ink(g, riv.map(([x, y]): P => [x + 10, y + 6]), { w: 3, d: 700, t: 900 })
        flow(g, riv.map(([x, y]): P => [x + 5, y + 3]), { n: 6, ms: 4000, d: 1400, r: 2.4 })
        for (const x of [70, 240, 300]) tree(g, x, 520 + (x % 3) * 10, 0.3, 900)
      },
      verdunsten(g) {
        // Sonne heizt das Meer: Wassermoleküle steigen auf, die Ionen bleiben im Wasser
        sunDisk(g, 270, 340, 32, 0)
        travelWave(g, 20, 340, 520, 5, 60, { ms: 2600, d: 200, w: 2.4 })
        hatch(g, [[20, 526], [340, 526], [340, 650], [20, 650]], 500)
        for (let k = 0; k < 4; k++) {
          const up = glide(g, 10, -150, { ms: 2600, d: 800 + k * 500, loop: true })
          water(up, 60 + k * 50, 500, 0.6, k * 40, 700)
        }
        for (let k = 0; k < 8; k++) {
          const w = wobble(g, { dx: 4, dy: 3, ms: 700 + k * 80, d: 900 })
          ion(w, 40 + k * 40, 570 + (k % 2) * 30, k % 2 === 0, 0.9, 900 + k * 60)
        }
      },
      kreislauf(g) {
        // Kreislauf in der Landschaft: Meer → Dampf → Wolke → Regen → Fluss → Meer; nur das Salz bleibt im Meer
        travelWave(g, 200, 340, 600, 4, 40, { ms: 2400, w: 2.2 })
        hatch(g, [[200, 606], [340, 606], [340, 650], [200, 650]], 300, true)
        mountain(g, 20, 200, 610, [90, 450], 200)
        ink(g, L([20, 612], [200, 612]), { w: 2, d: 200, t: 300 })
        cloud(g, 120, 330, 1, 600)
        rain(g, 70, 360, 100, 80, { n: 8, d: 800, ms: 900 })
        for (const x of [240, 280, 320]) {
          const p = B([x, 590], [x - 10, 520], [x - 60, 420], [x - 120, 350])
          dashes(g, p, { w: 1.2, d: 900, dash: 4, gap: 4 })
          flow(g, p, { n: 2, ms: 2400, d: 1000 + x, r: 2, kind: 'ring' })
        }
        const riv = smooth([[130, 560], [160, 590], [200, 600]], 3)
        ink(g, riv, { w: 2.6, d: 1000, t: 400 })
        flow(g, riv, { n: 3, ms: 1400, d: 1200, r: 2 })
        for (let k = 0; k < 5; k++) dot(g, 220 + k * 24, 626 + (k % 2) * 10, 2.6, 1400 + k * 60)
      },
      gramm(g) {
        // ein Liter Meerwasser in der Flasche, daneben das Salz daraus auf der Küchenwaage
        const bottle: P[] = [[60, 620], [60, 420], ...B([60, 420], [60, 390], [84, 380], [84, 350]).slice(1), [84, 320], [116, 320], [116, 350], ...B([116, 350], [116, 380], [140, 390], [140, 420]).slice(1), [140, 620], [60, 620]]
        ink(g, bottle, { w: 2.8, t: 800 })
        hatch(g, RR(64, 440, 72, 176, 4), 600)
        ink(g, waveP(64, 136, 440, 2, 20), { w: 1.4, d: 500, t: 300 })
        ink(g, RR(80, 306, 40, 16, 3), { w: 2.2, d: 400, t: 200 })
        ink(g, RR(190, 580, 140, 40, 8), { w: 2.8, d: 600, t: 400 })
        ink(g, RR(214, 592, 50, 18, 3), { w: 1.6, d: 800, t: 200 })
        ink(g, E(260, 576, 64, 8), { w: 2.2, d: 700, t: 300 })
        const pile: P[] = smooth([[210, 572], [236, 540], [260, 526], [286, 540], [310, 572]], 3)
        blank(g, [...pile, [210, 572]])
        ink(g, pile, { w: 2.2, d: 1000, t: 400 })
        for (let k = 0; k < 18; k++) ink(g, RR(222 + (k % 6) * 13, 560 - Math.floor(k / 6) * 10, 4, 4, 1), { w: 1, d: 1100 + k * 30, t: 50 })
        arrow(g, B([150, 460], [180, 440], [210, 460], [240, 510]), { w: 2, d: 1300, t: 400, head: 8 })
      },
      ionen(g) {
        // Kochsalzgitter: Natrium klein, Chlorid groß, abwechselnd; vorne löst sich ein Ion
        for (let z = 2; z >= 0; z--) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          const x = 80 + i * 44 + z * 22
          const y = 380 + j * 44 - z * 22
          const na = (i + j + z) % 2 === 0
          ball(g, x, y, na ? 10 : 16, { d: 300 + (z * 16 + i * 4 + j) * 25, fill: na ? 'dicht' : 'hell', w: 1.6, t: 100 })
        }
        const free = glide(g, 60, 90, { ms: 1600, d: 1800 })
        ion(free, 212, 512, false, 1, 1600)
        for (let k = 0; k < 4; k++) water(free, 212 + Math.cos(rad(k * 90 + 45)) * 30, 512 + Math.sin(rad(k * 90 + 45)) * 30, 0.5, k * 90 + 180, 1900)
      },
      vulkan(g) {
        // Schwarzer Raucher am Meeresgrund: Schlot, dunkle Wolke, Röhrenwürmer
        ink(g, waveP(20, 340, 320, 4, 60), { w: 2, t: 600 })
        const floor: P[] = smooth([[20, 620], [100, 610], [180, 616], [260, 606], [340, 614]], 3)
        ink(g, floor, { w: 2.6, d: 200, t: 500 })
        hatch(g, [...floor, [340, 650], [20, 650]], 400, true)
        const ch: P[] = smooth([[150, 616], [158, 560], [164, 500], [172, 460], [188, 460], [194, 510], [204, 560], [214, 614]], 3)
        blank(g, ch)
        hatch(g, ch, 700)
        ink(g, ch, { w: 2.8, d: 400, t: 600 })
        for (let k = 0; k < 4; k++) {
          const pl = wobble(g, { dx: 6 + k * 3, dy: -4, ms: 1600 + k * 300, d: 1000 })
          const r = 18 + k * 10
          const cy = 440 - k * 34
          const puff: P[] = smooth(Array.from({ length: 9 }, (_, j) => [180 + k * 8 + Math.cos(rad(j * 45)) * r * (1 + (j % 2) * 0.2), cy + Math.sin(rad(j * 45)) * r * 0.7] as P), 3)
          blank(pl, puff)
          hatch(pl, puff, 900 + k * 200, true)
          ink(pl, puff, { w: 1.6, d: 800 + k * 200, t: 300 })
        }
        for (const x of [100, 120, 240, 262]) {
          const w = wobble(g, { deg: 6, ox: x, oy: 612, ms: 1800 + x * 4, d: 1200 })
          ink(w, B([x, 612], [x - 4, 590], [x + 4, 570], [x, 556]), { w: 2, d: 900, t: 200 })
          hatch(w, E(x, 552, 4, 7), 1100, true)
        }
      },
      schicht(g) {
        // Landschaft im Schnitt, bedeckt von einer über 150 m dicken Salzschicht; nur ein Hochhaus ragt heraus
        const land: P[] = smooth([[20, 620], [80, 600], [140, 612], [220, 590], [340, 604]], 3)
        ink(g, land, { w: 2.6, t: 500 })
        hatch(g, [...land, [340, 650], [20, 650]], 300, true)
        for (const x of [60, 160]) tree(g, x, 606, 0.4, 400)
        house(g, 250, 596, 34, 500)
        ink(g, RR(110, 380, 46, 222, 2), { w: 2.6, d: 600, t: 500 })
        for (let r = 0; r < 12; r++) for (let c = 0; c < 3; c++) ink(g, RR(116 + c * 14, 390 + r * 18, 8, 10, 1), { w: 0.8, d: 800 + r * 30, t: 40 })
        const lay = pop(g, 1600, '50% 100%')
        const top: P[] = [[20, 440], [340, 440], [340, 620], [20, 620], [20, 440]]
        hatch(lay, top, 0)
        ink(lay, L([20, 440], [340, 440]), { w: 2.6, t: 0 })
        for (let k = 0; k < 10; k++) ink(lay, RR(30 + k * 32, 452 + (k % 3) * 40, 6, 6, 1), { w: 1, t: 0 })
        fig(g, 300, 440, 1.2, { d: 2000 })
      },
      totes(g) {
        // Totes Meer: jemand liegt auf dem Wasser und liest, am Ufer Salzkrusten
        travelWave(g, 20, 340, 500, 3, 60, { ms: 3000, w: 2.2 })
        hatch(g, [[20, 506], [340, 506], [340, 650], [20, 650]], 400, true)
        const p = wobble(g, { dy: 3, ms: 2400, d: 800 })
        const body: P[] = smooth([[90, 494], [120, 484], [200, 482], [250, 486], [270, 496], [90, 500], [90, 494]], 3)
        blank(p, body)
        ink(p, body, { w: 2.4, d: 400, t: 400 })
        ball(p, 80, 482, 13, { d: 500, w: 2.2, t: 200 })
        ink(p, [[108, 484], [132, 452], [150, 446]], { w: 2.4, d: 600, t: 200 })
        const paper: P[] = [[140, 430], [180, 420], [184, 450], [146, 460], [140, 430]]
        blank(p, paper)
        ink(p, paper, { w: 1.8, d: 700, t: 200 })
        for (let k = 0; k < 3; k++) ink(p, L([148, 436 + k * 6], [176, 428 + k * 6]), { w: 0.8, d: 800, t: 60 })
        ink(p, [[250, 488], [276, 470], [290, 474]], { w: 2.2, d: 700, t: 200 })
        for (const [x, y, s] of [[290, 380, 16], [312, 372, 12], [40, 390, 14]] as const) crystal(g, x, y, s, 900)
        ink(g, L([20, 404], [340, 404]), { w: 1.6, d: 300, t: 400 })
      },
      gefrieren(g) {
        // Süßwasser friert bei 0 °C, Meerwasser erst knapp zwei Grad tiefer
        for (const [x, lvl, salty] of [[90, 0.5, false], [250, 0.42, true]] as const) {
          thermo(g, x, 330, 160, lvl, 0)
          const y0 = 330 + 8 + 152 * (1 - 0.5)
          ink(g, L([x + 12, y0], [x + 30, y0]), { w: 1.8, d: 400, t: 80 })
          text(g, x + 34, y0 + 5, '0', { cls: 's', d: 500 })
          const bowl: P[] = [[x - 50, 540], [x - 44, 610], [x + 44, 610], [x + 50, 540]]
          ink(g, bowl, { w: 2.6, d: 300, t: 400 })
          hatch(g, [[x - 46, 560], [x + 46, 560], [x + 42, 606], [x - 42, 606]], 600)
          if (salty) for (let k = 0; k < 8; k++) dot(g, x - 34 + k * 10, 580 + (k % 2) * 12, 2, 800 + k * 40)
          for (let k = 0; k < 3; k++) flake(g, x - 30 + k * 30, 548, 6, 900 + k * 80)
        }
      },
      ende(g) {
        for (const [y, d] of [[470, 0], [506, 150]] as const) travelWave(g, 20, 340, y, 5, 60, { ms: 2600 + y, d, w: 2.2 })
        for (const [x, y, s, d] of [[150, 420, 26, 600], [184, 404, 32, 700], [220, 424, 22, 800]] as const) crystal(g, x, y, s, d)
      },
      gefaesse(g) {
        // drei Wasserproben mit sehr unterschiedlich vielen gelösten Ionen
        for (const [x, n] of [[30, 3], [140, 12], [250, 60]] as const) {
          ink(g, [[x, 420], [x + 6, 600], [x + 74, 600], [x + 80, 420]], { w: 2.6, d: x * 2, t: 400 })
          ink(g, waveP(x + 4, x + 76, 450, 2, 16), { w: 1.2, d: x * 2 + 200, t: 300 })
          let seed = x
          const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
          for (let k = 0; k < n; k++) dot(g, x + 12 + rnd() * 56, 462 + rnd() * 130, n > 30 ? 2.4 : 3, 600 + k * 15)
          if (n > 30) for (let k = 0; k < 3; k++) {
            const c = glide(g, 0, 10, { ms: 3000, d: 2000 + k * 300 })
            ink(c, RR(x + 16 + k * 18, 584, 8, 8, 1), { w: 1.4, d: 1800, t: 80 })
          }
        }
      },
      muendung(g) {
        // Flussmündung im Schnitt: leichtes Süßwasser schiebt sich über den schweren Salzkeil
        ink(g, smooth([[20, 640], [120, 620], [220, 580], [340, 520]], 3), { w: 2.6, t: 600 })
        ink(g, L([20, 420], [340, 420]), { w: 2.2, d: 200, t: 500 })
        hatch(g, [[100, 626], [340, 466], [340, 650], [20, 650], [20, 640]], 600, true)
        ink(g, B([100, 626], [180, 560], [260, 500], [340, 466]), { w: 2.2, d: 700, t: 600 })
        for (let k = 0; k < 3; k++) flow(g, L([20, 440 + k * 28], [340, 440 + k * 22]), { n: 3, ms: 2600, d: 900 + k * 200, r: 2 })
        for (let k = 0; k < 2; k++) flow(g, L([340, 560 + k * 30], [200, 600 + k * 20]), { n: 2, ms: 3600, d: 1100 + k * 200, r: 2, kind: 'ring' })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { meer: {} } },
      { t: T('Die Antwort beginnt mit **Regen**. Regenwasser nimmt aus der Luft etwas Kohlendioxid auf.', 64), gfx: { regen: {} } },
      { t: T('Dadurch wird es ganz **leicht sauer** – und löst winzige Mengen Mineralien aus Felsen und Böden.', 64), gfx: { saeure: {} } },
      { t: T('Flüsse tragen diese gelösten Salze ins Meer. Auch Flusswasser enthält also Salz – nur **so wenig**, dass man es nicht schmeckt.', 64), gfx: { fluss: {} } },
      { t: T('Im Meer passiert dann das Entscheidende: Die Sonne lässt Wasser **verdunsten**.', 64), gfx: { verdunsten: {} } },
      { t: T('Aber nur das Wasser steigt auf. Das Salz **bleibt zurück**.', 64), gfx: { verdunsten: {} } },
      { t: T('Aus dem Dampf werden Wolken, Regen, Flüsse – und die bringen **neues Salz** mit. Über Jahrmillionen hat es sich angesammelt.', 64), gfx: { kreislauf: {} } },
      { t: T('Ein Fluss ist also nicht salzlos, sondern ständig **auf der Durchreise**. Das Meer ist die Endstation.', 64), gfx: { kreislauf: {} } },
      { t: T('Seen ohne Abfluss werden aus demselben Grund salzig – etwa der **Große Salzsee** in den USA.', 64), gfx: { verdunsten: {} } },
      { t: T('Auch **heiße Quellen** am Meeresboden geben Mineralien ins Wasser ab.', 64), gfx: { vulkan: {} } },
      { t: T('Heute enthält jeder Liter Meerwasser im Schnitt rund **35 Gramm** Salz – etwa 3,5 Prozent.', 64), gfx: { gramm: {} } },
      { t: T('Meist ist es dasselbe wie im Salzstreuer: **Natrium und Chlorid**.', 64), gfx: { ionen: {} } },
      { t: T('Holte man alles Meersalz heraus und verteilte es über das Land, läge dort eine Schicht von über **150 Metern**.', 64), gfx: { schicht: {} } },
      { t: T('Wird das Meer immer salziger? Kaum – Salz lagert sich auch am Meeresboden ab. Der Salzgehalt ist seit langem **recht stabil**.', 64), gfx: { gramm: {} } },
      { t: T('Wo viel verdunstet und kaum etwas abfließt, wird es extrem: Das **Tote Meer** enthält rund 34 Prozent Salz.', 64), gfx: { gefaesse: {} } },
      { t: T('Das Wasser ist so dicht, dass man darin **liegen** kann wie auf einer Luftmatratze.', 64), gfx: { totes: {} } },
      { t: T('Die Ostsee dagegen bekommt viel Flusswasser und verdunstet wenig. Sie ist nur **leicht salzig**.', 64), gfx: { gefaesse: {} } },
      { t: T('Salzwasser ist schwerer als Süßwasser. Wo Flüsse ins Meer münden, schiebt sich das Süßwasser oft **obenauf**.', 64), gfx: { muendung: {} } },
      { t: T('Und Salz verändert das Wasser: Meerwasser gefriert erst bei etwa **−1,9 Grad**.', 64), gfx: { gefrieren: {} } },
      { t: T('Das Meer ist die **Endstation** des Salzes.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Leicht saurer Regen löst Mineralien aus Gestein; Flüsse tragen sie ins Meer.', 'Beim Verdunsten bleibt das Salz zurück – über Jahrmillionen hat es sich angesammelt.', 'Ozean ~3,5 % Salz, Totes Meer ~34 %, Ostsee unter 1 %.'],
    sources: ['NOAA Ocean Service: Why is the ocean salty?', 'USGS: Why is the ocean salty?', 'Leibniz-Institut für Ostseeforschung Warnemünde'],
  },
  {
    id: 'tsunami',
    area: 'GEO',
    day: 29,
    hook: 'Warum bemerkt ein Schiff auf offenem Meer einen Tsunami kaum?',
    mood: 'dunkel',
    ambience: 'wellen',
    images: [],
    draw: {
      schiff(g) {
        // offenes Meer: lange, flache Tsunami-Dünung unter kurzem Wellengekräusel, der Frachter hebt sich kaum
        const swell = wobble(g, { dy: -8, ms: 6000, d: 600 })
        travelWave(swell, 20, 340, 320, 4, 40, { ms: 1400, w: 2.2 })
        ink(swell, waveP(20, 340, 340, 2, 30, 1), { w: 1, d: 300, t: 600 })
        freighter(swell, 180, 318, 1.1, 300)
        for (const [x, y] of [[60, 140], [300, 120]] as const) bird(g, x, y, 0.6, 900)
        cloud(g, 260, 180, 0.7, 500)
      },
      beben(g) {
        // Subduktionszone: die ozeanische Platte taucht ab, die verhakte Kante schnellt hoch (a1)
        travelWave(g, 20, 340, 360, 2, 50, { ms: 3000, w: 2 })
        const left: P[] = [[20, 560], [200, 560], [300, 640], [20, 640]]
        hatch(g, left, 400)
        ink(g, [[20, 560], [200, 560], [300, 640]], { w: 3, d: 200, t: 600 })
        for (let k = 0; k < 3; k++) arrow(g, L([60 + k * 40, 600], [100 + k * 40, 600]), { w: 1.6, d: 900 + k * 80, t: 200, head: 6 })
        const up = st(g, 'm1', '--m1: translateY(-26px); transition-duration: 0.5s; --dl: 600ms')
        const cont: P[] = [[200, 556], [340, 520], [340, 650], [300, 650], [204, 560]]
        hatch(up, cont, 500, true)
        ink(up, [[200, 556], [340, 520]], { w: 3, d: 300, t: 400 })
        const bump = st(g, 'x1', '--o: 260px 360px')
        ink(bump, B([170, 360], [220, 360], [240, 330], [270, 330]), { w: 2.6, t: 0 })
        ink(bump, B([270, 330], [300, 330], [320, 360], [340, 360]), { w: 2.6, t: 0 })
        ripple(bump, 210, 560, 10, 80, { n: 3, ms: 1200, w: 1.2, ry: 0.5 })
      },
      saeule(g) {
        // die ganze Wassersäule bewegt sich: an jeder Tiefe gleich lange Pfeile, Wasserteilchen auf flachen Ellipsen
        ink(g, B([20, 360], [120, 360], [140, 340], [180, 340]), { w: 2.6, t: 400 })
        ink(g, B([180, 340], [220, 340], [240, 360], [340, 360]), { w: 2.6, d: 300, t: 400 })
        ink(g, L([20, 620], [340, 620]), { w: 3, d: 200, t: 500 })
        hatch(g, [[20, 622], [340, 622], [340, 650], [20, 650]], 300, true)
        for (const y of [410, 480, 550]) {
          arrow(g, L([80, y], [280, y]), { w: 2, d: 600 + (y - 410) * 3, t: 500, head: 9 })
          for (const x of [60, 300]) {
            ink(g, E(x, y, 14, 4), { w: 1, d: 900, t: 300 })
            const p = mk('g', {}, g)
            mk('animateTransform', { attributeName: 'transform', type: 'rotate', from: `0 ${x} ${y}`, to: `360 ${x} ${y}`, dur: '3s', begin: '1s', repeatCount: 'indefinite' }, p)
            dot(p, x + 14, y, 2.6, 1000)
          }
        }
      },
      flach(g) {
        // Maßstab: Höhe winzig, Länge riesig; das Schiff zum Vergleich
        ink(g, waveP(20, 340, 460, 4, 320), { w: 2.8, t: 900 })
        dashes(g, L([20, 460], [340, 460]), { w: 1.2, d: 600, dash: 4, gap: 4 })
        freighter(g, 100, 458, 0.3, 800)
        for (const [a, b] of [[[100, 520], [260, 520]], [[260, 520], [100, 520]]] as const) arrow(g, L(a as P, b as P), { w: 1.6, d: 1100, t: 300, head: 7 })
        for (const x of [100, 260]) ink(g, L([x, 510], [x, 530]), { w: 1.4, d: 1100, t: 80 })
        for (const [a, b] of [[[340, 470], [340, 450]], [[340, 450], [340, 470]]] as const) arrow(g, L(a as P, b as P), { w: 1.4, d: 1300, t: 150, head: 5 })
      },
      tempo(g) {
        // Verkehrsflugzeug fliegt genau über der Wellenfront mit – beide gleich schnell
        const m = glide(g, 140, 0, { ms: 3000, d: 900, loop: true })
        jet(m, 80, 360, 0.5, 300)
        ink(m, B([20, 520], [60, 520], [80, 500], [110, 500]), { w: 2.6, d: 400, t: 400 })
        ink(m, B([110, 500], [140, 500], [160, 520], [200, 520]), { w: 2.6, d: 500, t: 400 })
        dashes(m, L([110, 390], [110, 494]), { w: 1, d: 700, dash: 3, gap: 4 })
        ink(g, L([20, 522], [340, 522]), { w: 1.2, d: 200, t: 400 })
        hatch(g, [[20, 524], [340, 524], [340, 650], [20, 650]], 400)
      },
      formel(g) {
        // Tiefsee links, flache Küste rechts: die Wellenkämme liegen dort weit, hier dicht beieinander
        shelf(g, 0)
        ink(g, L([20, 380], [340, 380]), { w: 1.4, d: 300, t: 500 })
        for (const [x, w] of [[40, 70], [130, 60], [210, 34], [262, 22], [300, 16]] as const) {
          ink(g, B([x, 380], [x + w * 0.3, 380], [x + w * 0.4, 380], [x + w * 0.5, 372]), { w: 2.4, d: 500 + x * 3, t: 200 })
          ink(g, B([x + w * 0.5, 372], [x + w * 0.6, 372], [x + w * 0.7, 380], [x + w, 380]), { w: 2.4, d: 550 + x * 3, t: 200 })
        }
        for (const [x, l] of [[60, 70], [210, 34], [290, 16]] as const) arrow(g, L([x, 420], [x + l, 420]), { w: 2, d: 1200 + x * 2, t: 300, head: 7 })
      },
      kueste(g) {
        // Küstenort mit Häusern und Palmen; die Wasserwand wächst heran (a1)
        ink(g, [[20, 600], [200, 600], [340, 520]], { w: 3, t: 700 })
        hatch(g, [[200, 600], [340, 520], [340, 650], [200, 650]], 400, true)
        for (const [x, y] of [[250, 570], [300, 542]] as const) house(g, x, y, 30, 500)
        for (const x of [225, 330]) {
          const p = wobble(g, { deg: 4, ox: x, oy: 590 - (x - 200) * 0.57, ms: 1800, d: 900 })
          const by = 590 - (x - 200) * 0.57
          ink(p, B([x, by], [x - 2, by - 30], [x + 4, by - 50], [x + 2, by - 70]), { w: 2.2, d: 600, t: 200 })
          for (let k = 0; k < 5; k++) ink(p, B([x + 2, by - 70], [x + 2 + Math.cos(rad(-160 + k * 35)) * 14, by - 76 + Math.sin(rad(-160 + k * 35)) * 10], [x + 2 + Math.cos(rad(-160 + k * 35)) * 22, by - 70 + Math.sin(rad(-160 + k * 35)) * 8], [x + 2 + Math.cos(rad(-160 + k * 35)) * 26, by - 60 + Math.sin(rad(-160 + k * 35)) * 6]), { w: 1.6, d: 700 + k * 40, t: 150 })
        }
        const w = st(g, 'm1', '--m1: translateX(40px) scaleY(3.4); transform-origin: 120px 600px; transition-duration: 2.4s; --dl: 400ms')
        const wall: P[] = [[20, 600], ...B([20, 580], [80, 580], [120, 560], [150, 550]), ...B([150, 550], [170, 556], [190, 580], [200, 600]).slice(1), [20, 600]]
        blank(w, wall)
        hatch(w, wall, 300)
        ink(w, wall.slice(1, -1), { w: 2.8, t: 600 })
        for (let k = 0; k < 4; k++) dot(w, 120 + k * 12, 552 + (k % 2) * 4, 2, 600)
      },
      stau(g) {
        // Auflaufen: über dem ansteigenden Grund werden die Wellen kürzer und höher
        shelf(g, 0)
        ink(g, L([20, 440], [340, 440]), { w: 1, d: 200, t: 400 })
        for (let i = 0; i < 4; i++) {
          const x = 50 + i * 70
          const hgt = 14 + i * 26
          const w = 60 - i * 10
          ink(g, B([x - w / 2, 440], [x - w / 6, 440], [x - w / 10, 440 - hgt], [x + w / 6, 440 - hgt]), { w: 2.6, d: 400 + i * 200, t: 300 })
          ink(g, B([x + w / 6, 440 - hgt], [x + w / 3, 440 - hgt], [x + w / 2, 440], [x + w / 2 + 10, 440]), { w: 2.6, d: 500 + i * 200, t: 300 })
          arrow(g, L([x - 20, 470], [x - 20 + (60 - i * 12), 470]), { w: 1.8, d: 1100 + i * 100, t: 200, head: 6 })
        }
      },
      rueckzug(g) {
        // das Meer weicht zurück (a1), der Grund liegt frei: Boote liegen schief, Fische zappeln
        ink(g, [[20, 600], [220, 580], [340, 520]], { w: 3, t: 700 })
        hatch(g, [[220, 580], [340, 520], [340, 650], [220, 650]], 400, true)
        for (let k = 0; k < 8; k++) dot(g, 80 + k * 18, 590 + (k % 2) * 6, 1.6, 500)
        const sea = st(g, 'm1', '--m1: translateX(-130px); transition-duration: 2.4s; --dl: 500ms')
        travelWave(sea, 20, 240, 560, 4, 40, { ms: 2000, w: 2.4 })
        hatch(sea, [[20, 566], [240, 566], [222, 582], [20, 602]], 300)
        const boat: P[] = [[150, 586], [196, 574], [190, 590], [158, 598], [150, 586]]
        blank(g, boat)
        ink(g, boat, { w: 2.2, d: 800, t: 300 })
        ink(g, L([172, 580], [166, 540]), { w: 1.6, d: 900, t: 150 })
        for (let i = 0; i < 3; i++) {
          const f = wobble(g, { deg: 20, ox: 110 + i * 22, oy: 594, ms: 300 + i * 50, d: 1400 })
          ammoniteFish(f, 110 + i * 22, 594, 1200 + i * 150)
        }
        fig(g, 270, 548, 1.6, { d: 1500, arms: 'up' })
      },
      mehrere(g) {
        // Wellenzug an der Küste mit Uhren: Abstand viele Minuten, die zweite ist die höchste
        ink(g, L([20, 560], [340, 560]), { w: 1.4, d: 100, t: 400 })
        for (let i = 0; i < 3; i++) {
          const x = 40 + i * 110
          const h = i === 1 ? 70 : 40
          ink(g, B([x, 560], [x + 20, 560], [x + 30, 560 - h], [x + 50, 560 - h]), { w: 2.6, d: i * 300, t: 400 })
          ink(g, B([x + 50, 560 - h], [x + 66, 560 - h], [x + 76, 560], [x + 96, 560]), { w: 2.6, d: 150 + i * 300, t: 400 })
          hatch(g, [[x, 560], ...B([x, 560], [x + 30, 560 - h], [x + 66, 560 - h], [x + 96, 560])], 300 + i * 300)
        }
        for (const x of [133, 243]) {
          ink(g, E(x, 620, 16), { w: 2, d: 1000, t: 200 })
          ink(g, [[x, 608], [x, 620], [x + 8, 624]], { w: 1.6, d: 1100, t: 100 })
        }
      },
      boje(g) {
        // Frühwarnung: Drucksensor am Grund → Schallsignal zur Boje → Satellit
        travelWave(g, 20, 340, 420, 4, 60, { ms: 2400, w: 2.4 })
        const by = wobble(g, { dy: 4, deg: 4, ox: 180, oy: 420, ms: 1800, d: 600 })
        ink(by, [[156, 420], [164, 396], [196, 396], [204, 420], [156, 420]], { w: 2.6, d: 300, t: 300 })
        hatch(by, [[158, 416], [202, 416], [200, 424], [160, 424]], 500, true)
        ink(by, L([180, 396], [180, 350]), { w: 2, d: 400, t: 200 })
        ink(by, [[170, 380], [190, 370]], { w: 3, d: 500, t: 100 })
        dashes(g, L([180, 430], [180, 610]), { w: 1, d: 600, dash: 3, gap: 5 })
        ink(g, L([20, 630], [340, 630]), { w: 2.6, d: 200, t: 400 })
        hatch(g, [[20, 632], [340, 632], [340, 650], [20, 650]], 300, true)
        ink(g, RR(156, 604, 48, 24, 6), { w: 2.4, d: 700, t: 300 })
        ink(g, E(180, 604, 10, 6, 180, 360), { w: 1.6, d: 800, t: 150 })
        for (let k = 0; k < 3; k++) {
          const up = glide(g, 0, -150, { ms: 1800, d: 1200 + k * 600, loop: true })
          ink(up, E(180, 590, 12, 4, 180, 360), { w: 1.2, d: 1100, t: 80 })
        }
        const sat = RR(268, 300, 24, 18, 3)
        ink(g, sat, { w: 2, d: 900, t: 200 })
        for (const k of [-1, 1]) {
          ink(g, RR(280 + k * 30 - 12, 302, 24, 14, 1), { w: 1.4, d: 1000, t: 150 })
          hatch(g, RR(280 + k * 30 - 12, 302, 24, 14, 1), 1100, true)
        }
        flow(g, L([184, 350], [276, 320]), { n: 2, ms: 1200, d: 1500, r: 2 })
      },
      hoch(g) {
        // Menschen laufen den Hang hinauf in Sicherheit, hinten die heranrollende Flut
        ink(g, [[20, 620], [160, 620], [260, 470], [340, 460]], { w: 3, t: 700 })
        hatch(g, [[160, 620], [260, 470], [340, 460], [340, 650], [160, 650]], 400)
        for (const [x, y, d] of [[200, 560, 600], [230, 514, 800], [300, 458, 1000]] as const) {
          const r = glide(g, 20, -26, { ms: 1400, d: d + 400, loop: true })
          fig(r, x, y, 1.5, { d, arms: 'push' })
        }
        const fl = wobble(g, { dx: 10, ms: 2400, d: 1200 })
        ink(fl, B([20, 590], [60, 586], [100, 580], [140, 592]), { w: 2.6, d: 1100, t: 400 })
        hatch(fl, [[20, 592], [140, 594], [150, 620], [20, 620]], 1300)
        ink(g, RR(296, 380, 40, 40, 4), { w: 2, d: 1300, t: 200 })
        arrow(g, B([306, 412], [312, 400], [318, 396], [328, 388]), { w: 2, d: 1400, t: 200, head: 6 })
        ink(g, L([316, 420], [316, 460]), { w: 1.8, d: 1300, t: 100 })
      },
      ende(g) {
        ink(g, waveP(20, 160, 480, 3, 80), { w: 2.4, t: 600 })
        const wall: P[] = [[160, 600], ...B([160, 480], [220, 470], [260, 380], [320, 360]), [340, 380], [340, 600], [160, 600]]
        hatch(g, wall, 800)
        ink(g, wall.slice(1, -2), { w: 3, d: 400, t: 700 })
        ink(g, L([20, 602], [340, 602]), { w: 2.4, d: 200, t: 400 })
      },
      karte(g) {
        // Indischer Ozean und Japan: Epizentren 2004 (vor Sumatra) und 2011 (vor Tōhoku) mit Wellenringen
        const pr = mapRegion(g, 20, 320, 320, 300, 70, 160, -15, 50, 0)
        for (const [lon, lat, d] of [[95.9, 3.3, 900], [142.4, 38.3, 1500]] as const) {
          const [x, y] = pr(lon, lat)
          dot(g, x, y, 5, d)
          ripple(g, x, y, 8, 60, { n: 3, ms: 2000, d: d + 200, w: 1.2 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { schiff: {} } },
      { t: T('Ein Tsunami entsteht meist durch ein **Seebeben**: Der Meeresboden ruckt plötzlich um einige Meter.', 64), gfx: { beben: { cls: 'a1' } } },
      { t: T('Dabei wird nicht nur die Oberfläche bewegt, sondern das **ganze Wasser** – vom Grund bis oben, kilometerdick.', 64), gfx: { saeule: {} } },
      { t: T('Auf offenem Meer ist die Welle oft **unter einem Meter** hoch – aber über hundert Kilometer lang.', 64), gfx: { flach: {} } },
      { t: T('Ein Schiff hebt sich ganz sanft über Minuten. Die Besatzung **merkt nichts**.', 64), gfx: { schiff: { tf: [1, 0, 270] } } },
      { t: T('Dabei rast die Welle mit rund **700 km/h** durch den Ozean – so schnell wie ein Flugzeug.', 64), gfx: { tempo: {} } },
      { t: T('Ihr Tempo hängt nur von der **Wassertiefe** ab: je tiefer, desto schneller.', 64), gfx: { formel: {} } },
      { t: T('Nähert sie sich der Küste, wird das Wasser flach. Die Front der Welle wird **gebremst**.', 64), gfx: { stau: {} } },
      { t: T('Der hintere Teil ist noch schnell und **holt auf**. Das Wasser staut sich – die Welle wächst in die Höhe.', 64), gfx: { stau: {} } },
      { t: T('Aus einem Meter auf hoher See werden an der Küste **zehn, zwanzig, dreißig** Meter.', 64), gfx: { kueste: { cls: 'a1' } } },
      { t: T('Oft kündigt sich ein Tsunami seltsam an: Das Meer **weicht zurück** und legt den Grund frei.', 64), gfx: { rueckzug: { cls: 'a1' } } },
      { t: T('Das ist das Wellental, das zuerst ankommt. Wer das sieht, muss **sofort** weg – nicht hingehen und staunen.', 64), gfx: { rueckzug: { cls: 'a1' } } },
      { t: T('Ein Tsunami bricht nicht wie eine Surfwelle. Er wirkt eher wie eine **Flut**, die nicht aufhört zu steigen.', 64), gfx: { kueste: { cls: 'a1' } } },
      { t: T('Und selten kommt nur eine Welle. Oft folgen **mehrere** – die erste ist nicht unbedingt die größte.', 64), gfx: { mehrere: {} } },
      { t: T('2004 starben im Indischen Ozean rund **230.000 Menschen**. 2011 traf ein Tsunami Japan mit Wellen von örtlich fast 40 Metern.', 64), gfx: { karte: {} } },
      { t: T('Heute messen **Bojen** mit Drucksensoren am Meeresgrund jede verdächtige Welle und lösen Warnungen aus.', 64), gfx: { boje: {} } },
      { t: T('Die wichtigste Regel an der Küste: Bebt die Erde stark oder weicht das Meer zurück – sofort auf **höheres Gelände**.', 64), gfx: { hoch: {} } },
      { t: T('Das Wort kommt aus dem Japanischen: **Tsunami** heißt „Hafenwelle“. Fischer bemerkten draußen nichts – und fanden ihren Hafen zerstört.', 64), gfx: { schiff: { tf: [1, 0, 270] } } },
      { t: T('Flach im Ozean, **riesig** an der Küste.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Seebeben bewegen die ganze Wassersäule: auf hoher See flach (< 1 m), aber extrem lang und ~700 km/h schnell.', 'Im flachen Wasser wird die Front gebremst, das Wasser staut sich zu hohen Wellen.', 'Warnzeichen: starkes Beben oder zurückweichendes Meer – sofort auf höheres Gelände.'],
    sources: ['NOAA: Tsunami – The Great Waves', 'UNESCO IOC: Tsunami Glossary', 'GFZ Potsdam: Tsunami-Frühwarnsystem'],
  },
  {
    id: 'richterskala',
    area: 'GEO',
    day: 29,
    hook: 'Ist ein Beben der Stärke 6 doppelt so stark wie eines der Stärke 3?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [],
    draw: {
      seismo(g) {
        // Trommel-Seismograf: Sockel, rotierende Papiertrommel, Schreibarm mit Masse
        ink(g, RR(30, 380, 300, 30, 4), { w: 3, t: 500 })
        ink(g, RR(40, 410, 280, 14, 3), { w: 2, d: 100, t: 400 })
        for (const x of [70, 290]) ink(g, L([x, 380], [x, 300]), { w: 2.6, d: 200, t: 300 })
        const drum: P[] = RR(70, 240, 220, 90, 40)
        blank(g, drum)
        ink(g, drum, { w: 2.8, d: 300, t: 600 })
        for (const x of [70, 290]) ink(g, E(x, 285, 10, 45), { w: 1.6, d: 400, t: 300 })
        const c = clipBox(g, 80, 244, 200, 82)
        const tr = mk('g', {}, c)
        mk('animateTransform', { attributeName: 'transform', type: 'translate', from: '0 0', to: '-200 0', dur: '6s', begin: '0.8s', repeatCount: 'indefinite' }, tr)
        for (const y of [262, 286, 310]) seismo(tr, 80, 480, y, y === 286 ? 26 : 4, 600)
        ink(g, [[330, 380], [330, 180], [250, 180]], { w: 2.6, d: 500, t: 400 })
        const arm = wobble(g, { dy: 6, ms: 200, d: 1200 })
        ink(arm, [[250, 180], [250, 220], [180, 280]], { w: 2, d: 700, t: 300 })
        ball(arm, 250, 220, 14, { d: 800, fill: 'dicht', w: 2, t: 200 })
        ink(arm, L([180, 280], [178, 290]), { w: 2.6, d: 900, t: 80 })
      },
      richter(g) {
        // Torsionsseismometer: Masse an einem Faden, Spiegel lenkt Lichtstrahl auf die Fotopapiertrommel
        ink(g, RR(40, 340, 150, 260, 6), { w: 3, t: 600 })
        ink(g, L([115, 350], [115, 470]), { w: 1, d: 300, t: 300 })
        const m = wobble(g, { deg: 6, ox: 115, oy: 350, ms: 700, d: 1000 })
        ink(m, RR(100, 470, 30, 60, 3), { w: 2.2, d: 500, t: 200 })
        hatch(m, RR(100, 470, 30, 60, 3), 600, true)
        ink(m, L([108, 490], [122, 500]), { w: 2.4, d: 700, t: 80 })
        ink(g, L([20, 600], [340, 600]), { w: 2.6, d: 200, t: 500 })
        ink(g, RR(250, 440, 70, 120, 30), { w: 2.6, d: 400, t: 400 })
        const sp = spin(g, 285, 500, 4000, 900)
        for (let k = 0; k < 4; k++) ink(sp, L([285, 500], [285 + Math.cos(rad(k * 90)) * 22, 500 + Math.sin(rad(k * 90)) * 22]), { w: 1, d: 800, t: 80 })
        const beam = wobble(g, { deg: 4, ox: 122, oy: 496, ms: 700, d: 1000 })
        dashes(beam, L([122, 496], [250, 500]), { w: 1.6, d: 900, dash: 6, gap: 4 })
        ink(g, RR(150, 380, 24, 30, 3), { w: 1.8, d: 600, t: 200 })
        rays(g, 162, 395, 16, 26, 6, 800)
      },
      zehn(g) {
        // drei Seismogramme im gleichen Maßstab: jede Stufe zehnmal so weit
        for (const [i, l, a] of [[0, '3', 1.4], [1, '4', 14], [2, '5', 140]] as const) {
          const y = i < 2 ? 360 + i * 70 : 560
          const hh = i < 2 ? 30 : 90
          text(g, 34, y + 6, l, { anchor: 'middle', size: 22, d: i * 300 })
          ink(g, RR(52, y - hh, 286, hh * 2, 4), { w: 1, d: i * 300, t: 300 })
          const c = clipBox(g, 54, y - hh + 2, 282, hh * 2 - 4)
          seismo(c, 58, 334, y, a, 300 + i * 300)
        }
      },
      energie(g) {
        // ein Energiewürfel → nächste Stufe: 32 gleiche Würfel
        const cube3 = (x: number, y: number, s: number, d: number) => {
          const o = s * 0.4
          blank(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s], [x, y + s]])
          hatch(g, [[x + s, y], [x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s]], d + 100)
          ink(g, RR(x, y, s, s, 1), { w: 1.6, d, t: 100 })
          ink(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s, y]], { w: 1.2, d, t: 100 })
          ink(g, [[x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s]], { w: 1.2, d, t: 100 })
        }
        cube3(50, 470, 26, 0)
        arrow(g, L([100, 480], [150, 480]), { w: 2.4, d: 400, t: 300, head: 9 })
        for (let z = 1; z >= 0; z--) for (let r = 3; r >= 0; r--) for (let c = 0; c < 4; c++) cube3(170 + c * 26 + z * 10, 420 + r * 26 - z * 10, 26, 600 + (z * 16 + r * 4 + c) * 40)
      },
      tausend(g) {
        // zwei Ausschläge im gleichen Maßstab: Stärke 3 kaum sichtbar, Stärke 6 sprengt das Papier; x1: Energiewürfel
        const h1 = st(g, 'h1', '')
        for (const [y, l, a] of [[380, '3', 0.6], [520, '6', 600]] as const) {
          ink(h1, RR(50, y - 50, 290, 100, 4), { w: 1.6, d: y - 380, t: 400 })
          text(h1, 34, y + 6, l, { anchor: 'middle', size: 22, d: y - 380 })
          const c = clipBox(h1, 52, y - 48, 286, 96)
          seismo(c, 56, 336, y, a, 300 + (y - 380) * 2)
        }
        const x1 = st(g, 'x1', '--o: 260px 600px')
        blank(x1, RR(30, 330, 300, 320, 6))
        ink(x1, RR(30, 330, 300, 320, 6), { w: 1.6, t: 0 })
        ink(x1, RR(60, 600, 3, 3, 0), { w: 1.6, t: 0 })
        const s = 150
        const o = 40
        const fx = 140
        const fy = 470
        blank(x1, [[fx, fy], [fx + o, fy - o], [fx + s + o, fy - o], [fx + s + o, fy + s - o], [fx + s, fy + s], [fx, fy + s]])
        hatch(x1, [[fx + s, fy], [fx + s + o, fy - o], [fx + s + o, fy + s - o], [fx + s, fy + s]], 0)
        ink(x1, RR(fx, fy, s, s, 2), { w: 2.6, t: 0 })
        ink(x1, [[fx, fy], [fx + o, fy - o], [fx + s + o, fy - o], [fx + s, fy]], { w: 1.8, t: 0 })
        ink(x1, [[fx + s + o, fy - o], [fx + s + o, fy + s - o], [fx + s, fy + s]], { w: 1.8, t: 0 })
      },
      log(g) {
        // Skala von 3 bis 8: jeder Bogen ein Schritt; darüber Stapel, die je Schritt zehnmal so groß werden würden
        ink(g, L([30, 560], [330, 560]), { w: 2.6, t: 500 })
        for (let i = 0; i <= 5; i++) {
          const x = 40 + i * 56
          ink(g, L([x, 550], [x, 570]), { w: 2, d: i * 100, t: 150 })
          text(g, x, 600, String(i + 3), { anchor: 'middle', d: i * 100 })
          if (i < 5) carrow(g, [x + 4, 540], [x + 52, 540], -16, { d: 700 + i * 120 })
        }
        for (let i = 0; i < 3; i++) {
          const x = 40 + i * 56
          const n = Math.pow(10, i)
          const cols = Math.min(n, 10)
          for (let k = 0; k < n; k++) {
            const cx = x - 20 + (k % cols) * 4.4
            const cy = 470 - Math.floor(k / cols) * 4.4
            ink(g, RR(cx, cy, 3, 3, 0), { w: 1, d: 1000 + i * 300 + k * 4, t: 20 })
          }
        }
        for (const x of [208, 264, 320]) {
          ink(g, L([x, 476], [x, 330]), { w: 1.6, d: 1800, t: 300 })
          arrow(g, L([x, 360], [x, 320]), { w: 1.6, d: 2000, t: 150, head: 6 })
        }
      },
      chile(g) {
        // Pazifik von oben: Epizentrum vor Chile 1960, die Tsunami-Wellenfronten laufen bis Japan
        earth(g, 180, 470, 160, 0, { lon: -140, lat: -5, grid: true })
        const pr = geo(180, 470, 160, -140, -5)
        const ep = pr(-73.4, -38.2)
        const jp = pr(141, 38)
        if (ep.front) {
          dot(g, ep.p[0], ep.p[1], 6, 900)
          for (let k = 1; k <= 5; k++) dashes(g, E(ep.p[0], ep.p[1], k * 40, k * 34, 150, 250), { w: 1.4, d: 1000 + k * 250, dash: 5, gap: 4 })
        }
        if (jp.front) ripple(g, jp.p[0], jp.p[1], 6, 24, { n: 2, ms: 1600, d: 2400, w: 1.2 })
      },
      haeufig(g) {
        // Weltkarte: unzählige kleine Beben an den Plattengrenzen, nur ein großer Kreis
        const pr = worldMap(g, 20, 380, 320, 160, 'equi', 0, { grid: false })
        const ring: [number, number][] = [[-75, -40], [-72, -30], [-71, -20], [-77, -8], [-80, 0], [-85, 10], [-95, 15], [-105, 20], [-118, 33], [-124, 40], [-130, 50], [-150, 58], [-170, 52], [175, 52], [160, 55], [150, 46], [143, 40], [140, 35], [130, 31], [125, 24], [122, 15], [126, 7], [120, 0], [110, -8], [100, -4], [95, 3], [125, -8], [140, -5], [150, -6], [165, -15], [178, -20], [-175, -20], [-178, -30], [176, -40], [30, 38], [45, 35], [60, 30], [70, 36], [85, 30], [95, 28], [12, 42], [22, 38]]
        ring.forEach(([lon, lat], i) => {
          for (let k = 0; k < 3; k++) dot(g, pr(lon + k * 1.5, lat + (k - 1) * 1.5)[0], pr(lon + k * 1.5, lat + (k - 1) * 1.5)[1], 1.4, 600 + i * 30 + k * 10)
        })
        const [bx, by] = pr(142, 38)
        ink(g, E(bx, by, 12), { w: 2.4, d: 2000, t: 200 })
        ripple(g, bx, by, 12, 40, { n: 2, ms: 1800, d: 2200, w: 1.2 })
      },
      haus(g) {
        // links: erdbebensicher (Stahlkreuze, Gummilager) – schwankt und steht; rechts: einfaches Mauerwerk eingestürzt
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        hatch(g, [[20, 602], [340, 602], [340, 640], [20, 640]], 300, true)
        for (const x of [60, 110]) {
          ink(g, RR(x, 584, 30, 14, 5), { w: 2, d: 300, t: 150 })
          for (let k = 0; k < 3; k++) ink(g, L([x + 4, 588 + k * 4], [x + 26, 588 + k * 4]), { w: 0.8, d: 400, t: 60 })
        }
        const b = wobble(g, { deg: 2, ox: 100, oy: 584, ms: 900, d: 1000 })
        ink(b, RR(50, 350, 100, 234, 3), { w: 2.8, d: 300, t: 600 })
        for (let i = 0; i < 6; i++) {
          const y = 350 + i * 39
          ink(b, L([50, y], [150, y]), { w: 1.4, d: 500 + i * 40, t: 150 })
          ink(b, L([50, y], [100, y + 39]), { w: 1, d: 600 + i * 40, t: 100 })
          ink(b, L([150, y], [100, y + 39]), { w: 1, d: 600 + i * 40, t: 100 })
          for (const x of [58, 126]) ink(b, RR(x, y + 10, 16, 18, 1), { w: 0.9, d: 700 + i * 40, t: 50 })
        }
        const rub: P[] = [[200, 600], [210, 560], [236, 540], [250, 520], [270, 530], [290, 510], [310, 550], [330, 560], [336, 600]]
        hatch(g, [...rub, [200, 600]], 900, true)
        ink(g, rub, { w: 2.4, d: 700, t: 500 })
        for (const [x, y, r] of [[226, 560, 20], [262, 548, -14], [300, 560, 30]] as const) ink(g, [[x - 14, y + Math.sin(rad(r)) * 10], [x + 14, y - Math.sin(rad(r)) * 10]], { w: 3, d: 1100, t: 100 })
        ink(g, [[220, 600], [220, 470], [244, 470]], { w: 2.4, d: 600, t: 300 })
        ink(g, [[244, 470], [252, 500], [246, 520]], { w: 1.8, d: 900, t: 150 })
        for (let k = 0; k < 4; k++) {
          const s = glide(g, -6 + k * 4, 30, { ms: 900, d: 1500 + k * 200, loop: true })
          dot(s, 250 + k * 20, 500, 2, 1400)
        }
      },
      haiti(g) {
        // gleiche Zeit, zwei Orte: links schwächerer Ausschlag, aber eingestürzte Häuser; rechts stärker, die Häuser stehen
        for (const [x, a, broken] of [[20, 20, true], [190, 60, false]] as const) {
          ink(g, RR(x, 330, 150, 120, 4), { w: 1.4, t: 300 })
          const c = clipBox(g, x + 2, 332, 146, 116)
          seismo(c, x + 6, x + 146, 390, a, 300)
          ink(g, L([x, 600], [x + 150, 600]), { w: 2.6, d: 600, t: 300 })
          if (broken) {
            const rub: P[] = [[x + 10, 600], [x + 30, 570], [x + 60, 560], [x + 80, 540], [x + 110, 566], [x + 140, 600]]
            hatch(g, [...rub, [x + 10, 600]], 1200, true)
            ink(g, rub, { w: 2.2, d: 1000, t: 400 })
            cross(g, x + 75, 500, 0.6, 1600)
          } else {
            for (let k = 0; k < 3; k++) {
              ink(g, RR(x + 14 + k * 44, 600 - 60 - k * 20, 34, 60 + k * 20, 2), { w: 2.2, d: 1000 + k * 100, t: 300 })
              for (let j = 0; j < 3 + k; j++) ink(g, L([x + 18 + k * 44, 600 - 50 - k * 20 + j * 16], [x + 44 + k * 44, 600 - 50 - k * 20 + j * 16]), { w: 0.9, d: 1200 + k * 100, t: 60 })
            }
            check(g, x + 75, 490, 0.6, 1600)
          }
        }
      },
      tiefe(g) {
        // Schnitt: Stadt an der Oberfläche; flacher Herd direkt darunter – starke Wellen; tiefer Herd unter dem Meer – schwache
        ink(g, L([20, 380], [200, 380]), { w: 3, t: 500 })
        travelWave(g, 200, 340, 384, 2, 30, { ms: 2400, w: 1.8 })
        for (let k = 0; k < 4; k++) ink(g, RR(40 + k * 34, 380 - 30 - (k % 2) * 24, 26, 30 + (k % 2) * 24, 2), { w: 2, d: 300 + k * 60, t: 200 })
        hatch(g, [[20, 386], [340, 386], [340, 650], [20, 650]], 300)
        for (const [x, y, n, d] of [[110, 440, 4, 600], [270, 610, 2, 900]] as const) {
          blank(g, E(x, y, 14))
          star(g, x, y, 10, { d, fill: true })
          for (let k = 1; k <= n; k++) {
            ink(g, E(x, y, 14 + k * 18, 14 + k * 18, 200, 340), { w: n > 2 ? 2.6 - k * 0.3 : 1.2, d: d + 200 + k * 150, t: 200 })
          }
        }
        const sh = wobble(g, { dx: 4, ms: 160, d: 1400 })
        ink(sh, L([36, 376], [184, 376]), { w: 1, d: 1300, t: 100 })
      },
      skalen(g) {
        // Lautsprecher mit Schallwellen, Teststreifen im Becherglas, Sterne verschiedener Helligkeit
        ink(g, [[40, 380], [60, 380], [84, 356], [84, 444], [60, 420], [40, 420], [40, 380]], { w: 2.4, t: 400 })
        for (let k = 1; k <= 3; k++) ink(g, E(84, 400, k * 20, k * 20, -45, 45), { w: 2 - k * 0.3, d: 300 + k * 150, t: 200 })
        ink(g, [[160, 360], [166, 450], [214, 450], [220, 360]], { w: 2.4, d: 500, t: 300 })
        hatch(g, [[163, 400], [217, 400], [214, 446], [166, 446]], 700)
        ink(g, RR(184, 330, 12, 100, 2), { w: 1.8, d: 800, t: 200 })
        hatch(g, RR(184, 400, 12, 30, 2), 1000, true)
        for (const [x, y, r] of [[270, 360, 12], [310, 390, 8], [280, 420, 5], [320, 440, 3]] as const) star(g, x, y, r, { d: 900 + r * 40, fill: r > 6 })
        ink(g, L([40, 540], [320, 540]), { w: 2.2, d: 1200, t: 500 })
        for (let i = 0; i < 6; i++) {
          ink(g, L([50 + i * 52, 530], [50 + i * 52, 550]), { w: 1.8, d: 1300 + i * 60, t: 80 })
          if (i < 5) carrow(g, [54 + i * 52, 524], [98 + i * 52, 524], -12, { d: 1500 + i * 100 })
        }
      },
      ende(g) {
        ink(g, L([20, 480], [340, 480]), { w: 1, t: 400 })
        seismo(g, 20, 340, 480, 100, 200)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { seismo: {} } },
      { t: T('Die Antwort überrascht: Ein Beben der Stärke 6 ist nicht doppelt so stark – sondern **tausendfach** in der Auslenkung.', 64), gfx: { tausend: {} } },
      { t: T('Der Seismologe Charles Richter entwickelte 1935 in Kalifornien eine Skala, um Beben **vergleichbar** zu machen.', 64), gfx: { richter: {} } },
      { t: T('Er maß den Ausschlag der Nadel am Seismografen. Die Werte reichten von winzig bis **riesig**.', 64), gfx: { seismo: { tf: [1, 0, 180] } } },
      { t: T('Damit die Zahlen handlich bleiben, wählte er eine **logarithmische** Skala: Jede Stufe bedeutet zehnmal so viel Ausschlag.', 64), gfx: { log: {} } },
      { t: T('Stärke 4 schwingt also zehnmal so weit wie 3. Stärke 5 schon **hundertmal** so weit.', 64), gfx: { zehn: {} } },
      { t: T('Noch gewaltiger ist die **Energie**: Jede Stufe setzt etwa 32-mal so viel frei.', 64), gfx: { energie: {} } },
      { t: T('Von 3 auf 6 sind das 32 mal 32 mal 32 – rund **32.000-mal** so viel Energie.', 64), gfx: { tausend: { cls: 'a1' } } },
      { t: T('Heute nutzen Fachleute meist die **Momenten-Magnitude**. Sie misst, wie groß die gerissene Fläche ist und wie weit sie sich verschoben hat.', 64), gfx: { log: {} } },
      { t: T('Die Zahlen sind ähnlich – aber sie funktioniert auch bei **riesigen** Beben, bei denen Richters Skala nicht mehr weiter steigt.', 64), gfx: { log: {} } },
      { t: T('Das stärkste je gemessene Beben: **9,5** in Chile 1960. Es löste einen Tsunami bis nach Japan aus.', 64), gfx: { chile: {} } },
      { t: T('Kleine Beben gibt es ständig – **tausende** jeden Tag, die meisten spürt niemand. Stärke 8 und mehr kommt etwa einmal im Jahr vor.', 64), gfx: { haeufig: {} } },
      { t: T('Wie schlimm ein Beben ist, sagt die Magnitude aber nur **zum Teil**.', 64), gfx: { haus: {} } },
      { t: T('Entscheidend sind auch Tiefe, Boden und **Bauweise**. Ein flaches Beben unter einer Stadt richtet mehr an als ein tiefes unter dem Meer.', 64), gfx: { tiefe: {} } },
      { t: T('2010 traf ein Beben der Stärke 7,0 **Haiti** – über 100.000 Menschen starben. Im selben Jahr traf ein viel stärkeres Beben Chile – mit rund 500 Toten.', 64), gfx: { haiti: {} } },
      { t: T('Der Unterschied: Chile hat strenge **Bauvorschriften**. Nicht das Beben tötet, sondern einstürzende Häuser.', 64), gfx: { haus: {} } },
      { t: T('Logarithmische Skalen begegnen dir öfter: bei **Dezibel**, beim pH-Wert, bei der Helligkeit von Sternen.', 64), gfx: { skalen: {} } },
      { t: T('Plus eins heißt **mal zehn**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Erdbebenstärken sind logarithmisch: +1 = 10-facher Ausschlag, ~32-fache Energie.', 'Stärke 6 vs. 3: 1.000-fache Auslenkung, ~32.000-fache Energie; Rekord 9,5 (Chile 1960).', 'Schäden hängen stark von Tiefe, Untergrund und Bauweise ab (Haiti vs. Chile 2010).'],
    sources: ['USGS: Earthquake Magnitude, Energy Release, and Shaking Intensity', 'Hanks & Kanamori 1979, Journal of Geophysical Research 84', 'USGS: Earthquake Facts & Statistics'],
  },
  {
    id: 'pangaea',
    area: 'GEO',
    day: 29,
    hook: 'Warum passen Südamerika und Afrika zusammen wie Puzzleteile?',
    mood: 'episch',
    ambience: 'wellen',
    images: [],
    draw: {
      puzzle(g) {
        // echte Küstenlinien: Südamerika und Afrika, dazwischen der Atlantik
        land(g, LAND.suedamerika, 180, 260, 2.4, 0, { lon0: -15, lat0: -10 })
        land(g, LAND.afrika, 180, 260, 2.4, 300, { lon0: -15, lat0: -10 })
        for (let k = 0; k < 4; k++) ink(g, waveP(120 + k * 6, 160 + k * 6, 200 + k * 50, 2, 14, k), { w: 1, d: 900 + k * 80, t: 200 })
      },
      nah(g) {
        // Südamerika gleitet über die Kugel an Afrika heran und schließt den Atlantik (a1)
        land(g, LAND.afrika, 180, 470, 2.4, 0, { lon0: -15, lat0: -10 })
        const a = st(g, 'h1', '')
        land(a, LAND.suedamerika, 180, 470, 2.4, 200, { lon0: -15, lat0: -10 })
        const b = st(g, 'f1', '')
        land(b, LAND.suedamerika, 180, 470, 2.4, 0, { lon0: -15, lat0: -10, rot: SA_FIT, dense: true })
        const x2 = st(g, 'x2', '--o: 160px 500px')
        for (let k = 0; k < 4; k++) ink(x2, L([120 + k * 14, 470 + k * 16], [200 + k * 14, 476 + k * 16]), { w: 2.4, t: 0 })
      },
      wegener(g) {
        // Weltkarte auf Papier, Kontinente ausgeschnitten, Schere – die Idee, sie zusammenzuschieben
        ink(g, RR(30, 340, 300, 230, 4), { w: 2.4, t: 600 })
        for (let k = 1; k < 4; k++) ink(g, L([30, 340 + k * 57], [330, 340 + k * 57]), { w: 0.6, d: 200, t: 300 })
        const sa = land(g, LAND.suedamerika, 140, 450, 1.7, 400, { lon0: -15, lat0: -10 })
        dashes(g, sa, { w: 1, d: 900, dash: 4, gap: 3 })
        const m = glide(g, 30, -6, { ms: 1600, d: 1600 })
        land(m, LAND.afrika, 160, 450, 1.7, 600, { lon0: -15, lat0: -10 })
        const sc = wobble(g, { deg: 8, ox: 280, oy: 600, ms: 600, d: 1200 })
        for (const k of [-1, 1]) {
          ink(sc, L([280, 600], [230, 600 + k * 14]), { w: 2.2, d: 1000, t: 200 })
          ink(sc, E(296, 600 + k * 12, 10, 7), { w: 2, d: 1100, t: 150 })
        }
        dot(sc, 280, 600, 2.4, 1200)
      },
      fossil(g) {
        // zusammengeschoben: der Lebensraum des Mesosaurus zieht sich über beide Kontinente; x1 Gletscherspuren
        land(g, LAND.afrika, 160, 470, 2.4, 0, { lon0: -15, lat0: -10 })
        land(g, LAND.suedamerika, 160, 470, 2.4, 200, { lon0: -15, lat0: -10, rot: SA_FIT })
        const band: P[] = smooth([[110, 560], [150, 540], [190, 548], [230, 560], [220, 590], [180, 586], [130, 592], [110, 560]], 3)
        hatch(g, band, 1000, true)
        ink(g, band, { w: 1.6, d: 900, t: 300 })
        const mz = mk('g', { transform: 'translate(-166 -40)' }, glide(g, 0, -6, { ms: 1200, d: 1400, loop: true }))
        const body: P[] = smooth([[220, 380], [250, 372], [290, 376], [320, 386], [290, 392], [250, 392], [220, 380]], 3)
        blank(mz, body)
        ink(mz, body, { w: 2, d: 1300, t: 300 })
        ink(mz, B([220, 380], [204, 378], [190, 380], [178, 384]), { w: 1.6, d: 1400, t: 150 })
        ink(mz, B([320, 386], [334, 392], [344, 400], [350, 404]), { w: 1.4, d: 1400, t: 150 })
        for (const x of [240, 290]) ink(mz, [[x, 392], [x - 4, 404], [x + 2, 406]], { w: 1.4, d: 1500, t: 100 })
        for (let k = 0; k < 6; k++) ink(mz, L([184 + k * 2.5, 382], [184 + k * 2.5, 386]), { w: 0.8, d: 1600, t: 40 })
        const x1 = st(g, 'x1', '--o: 160px 600px')
        for (const [a, b] of [[[120, 620], [150, 580]], [[170, 620], [180, 578]], [[220, 620], [200, 584]]] as const) arrow(x1, L(a as P, b as P), { w: 2, t: 0, head: 6 })
        flake(x1, 300, 600, 12, 0)
      },
      spott(g) {
        // Vortrag vor skeptischen Fachleuten: Karte an der Tafel, verschränkte Arme
        ink(g, RR(30, 330, 170, 120, 4), { w: 2.4, t: 500 })
        land(g, LAND.afrika, 130, 400, 1, 300, { lon0: -15, lat0: -10 })
        land(g, LAND.suedamerika, 130, 400, 1, 400, { lon0: -15, lat0: -10, rot: SA_FIT })
        fig(g, 230, 600, 4, { d: 600, arms: 'push' })
        for (const [x, d] of [[90, 900], [150, 1000], [300, 1100]] as const) fig(g, x, 640, 2.6, { d, arms: 'cross' })
        question(g, 300, 440, 0.6, 1500)
      },
      gronland(g) {
        // Grönländisches Inlandeis im Sturm: Zelt, Schlitten, Schneetreiben
        ink(g, smooth([[20, 560], [100, 520], [200, 500], [340, 470]], 3), { w: 2.6, t: 700 })
        const tent: P[] = [[120, 516], [160, 456], [210, 506], [120, 516]]
        blank(g, tent)
        hatch(g, tent, 700)
        ink(g, tent, { w: 2.4, d: 400, t: 400 })
        ink(g, [[230, 500], [300, 486], [304, 476], [234, 490], [230, 500]], { w: 2, d: 600, t: 300 })
        for (const x of [244, 286]) ink(g, L([x, 494], [x + 2, 504]), { w: 1.6, d: 700, t: 80 })
        ink(g, B([300, 486], [312, 484], [316, 476], [312, 470]), { w: 1.8, d: 700, t: 100 })
        for (let i = 0; i < 18; i++) {
          const fl = glide(g, -80, 40, { ms: 1400 + (i % 5) * 200, d: (i * 130) % 1200, loop: true })
          flake(fl, 60 + ((i * 47) % 300), 330 + ((i * 29) % 160), 4 + (i % 3), 0)
        }
      },
      ruecken(g) {
        // Mittelozeanischer Rücken im Schnitt: Magma steigt auf, symmetrische Magnetstreifen, Platten driften auseinander
        travelWave(g, 20, 340, 380, 2, 50, { ms: 3000, w: 1.6 })
        const top: P[] = [[20, 520], [150, 512], [170, 480], [190, 480], [210, 512], [340, 520]]
        ink(g, top, { w: 2.8, d: 200, t: 700 })
        for (let i = 0; i < 7; i++) {
          const dx = 10 + i * 22
          for (const k of [-1, 1]) {
            const x = 180 + k * dx
            const p: P[] = [[x, 516 - (i === 0 ? 20 : 0)], [x + k * 22, 516], [x + k * 22, 556], [x, 556], [x, 516 - (i === 0 ? 20 : 0)]]
            if (i % 2 === 0) hatch(g, p, 900 + i * 100, true)
            ink(g, L([x + k * 22, 516], [x + k * 22, 556]), { w: 0.9, d: 900 + i * 100, t: 100 })
          }
        }
        ink(g, L([20, 556], [340, 556]), { w: 2, d: 300, t: 500 })
        flow(g, L([180, 640], [180, 484]), { n: 4, ms: 1600, d: 900, r: 2.6 })
        for (const k of [-1, 1]) {
          arrow(g, L([180 + k * 40, 600], [180 + k * 140, 600]), { w: 2.6, d: 1200, t: 500, head: 10 })
          arcArrow(g, 180 + k * 80, 630, 50, k < 0 ? -10 : 190, k < 0 ? -170 : 350, { d: 1400 })
        }
      },
      tempo(g) {
        // Fingerkuppe mit Nagel am Lineal: der Nagel wächst ein Stück – so weit wandert eine Platte im Jahr
        ink(g, RR(40, 560, 280, 40, 3), { w: 2.4, t: 500 })
        for (let k = 0; k <= 56; k++) ink(g, L([50 + k * 4.8, 560], [50 + k * 4.8, k % 10 ? 568 : 576]), { w: k % 10 ? 0.8 : 1.4, d: 300 + k * 10, t: 30 })
        for (const [k, l] of [[0, '0'], [10, '1'], [20, '2'], [30, '3'], [40, '4'], [50, '5']] as const) text(g, 50 + k * 4.8, 592, l, { anchor: 'middle', size: 12, d: 600 })
        const finger: P[] = smooth([[20, 470], [140, 466], [186, 476], [196, 500], [186, 524], [140, 532], [20, 530]], 3)
        blank(g, finger)
        ink(g, finger, { w: 2.6, d: 400, t: 600 })
        for (let k = 0; k < 3; k++) ink(g, B([60 + k * 20, 480], [64 + k * 20, 496], [60 + k * 20, 510], [64 + k * 20, 522]), { w: 0.9, d: 700, t: 150 })
        const nail = glide(g, 24, 0, { ms: 3000, d: 1200 })
        const n: P[] = smooth([[130, 474], [180, 474], [194, 488], [194, 512], [180, 524], [130, 524]], 3)
        blank(nail, [...n, [130, 474]])
        hatch(nail, [[184, 476], [194, 488], [194, 512], [184, 522]], 1000)
        ink(nail, n, { w: 1.8, d: 900, t: 400 })
        ink(nail, B([182, 476], [190, 488], [190, 512], [182, 522]), { w: 1.2, d: 1000, t: 200 })
        dashes(g, L([194, 460], [194, 556]), { w: 1, d: 1300, dash: 3, gap: 3 })
        dashes(g, L([218, 460], [218, 556]), { w: 1, d: 4200, dash: 3, gap: 3 })
      },
      pangaea(g) {
        // Superkontinent um 200 Mio. Jahre (vereinfacht): Kontinente mit Euler-Drehungen an Afrika gelegt;
        // a1: sie driften auseinander; a2: wieder zusammen, Fragezeichen für den künftigen Superkontinent
        const c = clipBox(g, 10, 300, 340, 360)
        const at = { lon0: 10, lat0: 0 }
        const part = (cls: string, m: string) => st(c, cls, `--m1: ${m}; transition-duration: 3s`)
        land(c, LAND.afrika, 180, 470, 1.25, 0, at)
        land(c, LAND.eurasien, 180, 470, 1.25, 200, at)
        land(part('m1', 'translate(-46px, 26px) rotate(8deg)'), LAND.suedamerika, 180, 470, 1.25, 300, { ...at, rot: SA_FIT })
        const na = part('m1', 'translate(-60px, -14px) rotate(-6deg)')
        land(na, LAND.nordamerika, 180, 470, 1.25, 400, { ...at, rot: NA_FIT })
        land(na, LAND.groenland, 180, 470, 1.25, 500, { ...at, rot: NA_FIT })
        land(part('m1', 'translate(10px, 40px)'), LAND.antarktis, 180, 470, 1.25, 600, { ...at, rot: AN_FIT })
        land(part('m1', 'translate(50px, 30px) rotate(20deg)'), LAND.australien, 180, 470, 1.25, 700, { ...at, rot: AU_FIT })
        const q = st(g, 'x2', '--o: 290px 360px')
        question(q, 300, 380, 0.7, 0)
      },
      gps(g) {
        // GPS-Satellit über der Erde, Messstationen in Nordamerika und Europa entfernen sich
        earth(g, 180, 500, 120, 0, { lon: -40, lat: 35, grid: true })
        const pr = geo(180, 500, 120, -40, 35)
        const na = pr(-75, 40).p
        const eu = pr(5, 50).p
        for (const [p, k] of [[na, -1], [eu, 1]] as const) {
          dot(g, p[0], p[1], 5, 900)
          arrow(g, L(p, [p[0] + k * 34, p[1] + 4]), { w: 2.2, d: 1200, t: 300, head: 7 })
        }
        const sat = wobble(g, { dx: 20, ms: 4000, d: 600 })
        ink(sat, RR(170, 320, 20, 16, 3), { w: 2, d: 600, t: 200 })
        for (const k of [-1, 1]) {
          ink(sat, RR(180 + k * 26 - 10, 322, 20, 12, 1), { w: 1.4, d: 700, t: 150 })
          hatch(sat, RR(180 + k * 26 - 10, 322, 20, 12, 1), 800, true)
        }
        for (const p of [na, eu]) dashes(g, L([180, 340], p), { w: 1, d: 1000, dash: 4, gap: 4 })
      },
      ende(g) {
        land(g, LAND.afrika, 180, 470, 2.4, 0, { lon0: -15, lat0: -10 })
        land(g, LAND.suedamerika, 180, 470, 2.4, 200, { lon0: -15, lat0: -10, rot: SA_FIT })
      },
      sonar(g) {
        // Forschungsschiff der 1960er: Echolot-Impulse, Magnetometer im Schlepp, darunter der Rücken
        travelWave(g, 20, 340, 380, 3, 50, { ms: 2600, w: 2.2 })
        freighter(g, 120, 378, 0.6, 200)
        dashes(g, B([180, 380], [240, 390], [280, 396], [320, 394]), { w: 1, d: 600, dash: 3, gap: 3 })
        ink(g, RR(316, 388, 16, 10, 4), { w: 1.6, d: 700, t: 100 })
        const bed: P[] = smooth([[20, 620], [100, 610], [150, 580], [180, 550], [210, 580], [260, 610], [340, 620]], 3)
        ink(g, bed, { w: 2.6, d: 400, t: 600 })
        hatch(g, [...bed, [340, 650], [20, 650]], 600, true)
        for (let k = 0; k < 3; k++) {
          const p = glide(g, 0, 160, { ms: 1600, d: 900 + k * 500, loop: true })
          ink(p, E(120, 392, 20, 6, 0, 180), { w: 1.2, d: 800, t: 80 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { puzzle: {} } },
      { t: T('Schon auf frühen Weltkarten fiel auf: Die Ostküste Südamerikas und die Westküste Afrikas passen fast **genau ineinander**.', 64), gfx: { nah: {} } },
      { t: T('Schiebt man sie zusammen, schließt sich der Atlantik – als hätte jemand einen Kontinent **zerrissen**.', 64), gfx: { nah: { cls: 'a1' } } },
      { t: T('1912 zog der deutsche Forscher **Alfred Wegener** einen kühnen Schluss: Die Kontinente wandern.', 64), gfx: { wegener: {} } },
      { t: T('Er sammelte Belege: Auf beiden Seiten des Atlantiks finden sich **dieselben Fossilien** – etwa ein kleines Süßwasser-Reptil, der Mesosaurus.', 64), gfx: { fossil: {} } },
      { t: T('Das Tier konnte unmöglich über einen Ozean schwimmen. Also lagen die Länder einst **direkt nebeneinander**.', 64), gfx: { fossil: {} } },
      { t: T('Auch Gesteinsschichten und Gebirge setzen sich auf der anderen Seite **nahtlos fort**.', 64), gfx: { nah: { cls: 'a1' } } },
      { t: T('Und in Afrika und Indien fand man Spuren uralter **Gletscher** – in heute tropischen Gegenden.', 64), gfx: { fossil: { cls: 'a1' } } },
      { t: T('Die meisten Geologen lachten trotzdem. Wegener konnte nicht erklären, **welche Kraft** ganze Kontinente bewegt.', 64), gfx: { spott: {} } },
      { t: T('Er starb 1930 auf einer Expedition in Grönland – ohne dass seine Idee **anerkannt** war.', 64), gfx: { gronland: {} } },
      { t: T('Erst in den 1960er-Jahren kam der Beweis – vom **Meeresboden**.', 64), gfx: { sonar: {} } },
      { t: T('Mitten im Atlantik zieht sich ein Gebirge, der **Mittelatlantische Rücken**. Dort quillt heißes Gestein auf und bildet neuen Meeresboden.', 64), gfx: { ruecken: {} } },
      { t: T('Der Boden wächst nach beiden Seiten und schiebt die Kontinente auseinander. Magnetische Streifen im Gestein zeigen das **wie Jahresringe**.', 64), gfx: { ruecken: {} } },
      { t: T('Aus Wegeners Idee wurde die **Plattentektonik**: Die Erdkruste besteht aus Platten, die auf dem zähen Erdmantel treiben.', 64), gfx: { ruecken: {} } },
      { t: T('Sie bewegen sich etwa **2 bis 5 Zentimeter** im Jahr – ungefähr so schnell, wie deine Fingernägel wachsen.', 64), gfx: { tempo: {} } },
      { t: T('Vor rund 300 Millionen Jahren bildeten fast alle Landmassen einen Superkontinent: **Pangaea**, „ganze Erde“.', 64), gfx: { pangaea: {} } },
      { t: T('Vor etwa 200 Millionen Jahren begann er **auseinanderzubrechen**. Der Atlantik öffnete sich – und wird bis heute breiter.', 64), gfx: { pangaea: { cls: 'a1' } } },
      { t: T('Heute misst **GPS** die Drift direkt: Europa und Nordamerika entfernen sich jedes Jahr um ein paar Zentimeter.', 64), gfx: { gps: {} } },
      { t: T('In vielleicht 250 Millionen Jahren könnten die Kontinente wieder zu einem **neuen Superkontinent** verschmelzen.', 64), gfx: { pangaea: { cls: 'a2' } } },
      { t: T('Die Kontinente **wandern** – immer noch.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Wegener (1912): Passende Küsten, gleiche Fossilien und Gesteine zeigen wandernde Kontinente.', 'Belegt in den 1960ern durch Meeresboden-Spreizung am Mittelatlantischen Rücken → Plattentektonik.', 'Platten bewegen sich 2–5 cm/Jahr; Pangaea zerbrach ab ~200 Mio. Jahren.'],
    sources: ['Wegener 1915: Die Entstehung der Kontinente und Ozeane', 'USGS: This Dynamic Earth – The Story of Plate Tectonics', 'Vine & Matthews 1963, Nature 199'],
  },
  {
    id: 'wolke-gewicht',
    area: 'GEO',
    day: 71,
    hook: 'Wie schwer ist eine Wolke?',
    mood: 'verspielt',
    ambience: 'wind',
    images: [],
    draw: {
      wolke(g) {
        // große Haufenwolke über der Landschaft, Haus und Bäume zum Größenvergleich
        sunDisk(g, 300, 110, 22, 0)
        const w = glide(g, 20, 0, { ms: 8000, d: 600, loop: true })
        cloud(w, 170, 300, 2, 200)
        ink(g, smooth([[20, 420], [90, 410], [180, 418], [260, 406], [340, 414]], 3), { w: 2.4, d: 300, t: 600 })
        house(g, 230, 410, 22, 700)
        for (const x of [80, 110, 300]) tree(g, x, 414, 0.3, 800)
      },
      wuerfel(g) {
        // die Wolke in einem gedachten Würfel von einem Kilometer Kantenlänge; Häuser darunter
        const [x, y, s, o] = [70, 380, 200, 50]
        dashes(g, RR(x, y, s, s, 0), { w: 1.4, d: 600, dash: 6, gap: 5 })
        dashes(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s, y]], { w: 1.4, d: 700, dash: 6, gap: 5 })
        dashes(g, [[x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s]], { w: 1.4, d: 800, dash: 6, gap: 5 })
        cloud(g, 190, 540, 1.8, 200)
        ink(g, L([20, 600], [340, 600]), { w: 2.2, d: 300, t: 400 })
        for (let k = 0; k < 5; k++) house(g, 80 + k * 44, 600, 14, 900 + k * 60)
        for (const [a, b] of [[[x, y + s + 20], [x + s, y + s + 20]], [[x + s, y + s + 20], [x, y + s + 20]]] as const) arrow(g, L(a as P, b as P), { w: 1.6, d: 1300, t: 300, head: 7 })
      },
      gramm(g) {
        // ein Kubikmeter Wolkenluft (Drahtwürfel) mit ein paar Tröpfchen – zusammen nur ein Teelöffel-Rest Wasser
        const [x, y, s, o] = [50, 420, 150, 40]
        ink(g, RR(x, y, s, s, 2), { w: 2.4, t: 500 })
        ink(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s, y]], { w: 2, d: 200, t: 400 })
        ink(g, [[x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s]], { w: 2, d: 300, t: 400 })
        for (let i = 0; i < 12; i++) {
          const w = wobble(g, { dx: 3, dy: 3, ms: 700 + i * 50, d: 900 })
          dot(w, x + 20 + ((i * 37) % 120), y + 20 + ((i * 53) % 120), 1.8, 500 + i * 40)
        }
        const sp: P[] = smooth([[260, 560], [280, 548], [310, 550], [320, 562], [306, 574], [276, 574], [260, 560]], 3)
        blank(g, sp)
        ink(g, sp, { w: 2.2, d: 900, t: 300 })
        ink(g, L([262, 562], [212, 600]), { w: 2.6, d: 1000, t: 200 })
        hatch(g, E(290, 562, 10, 4), 1300, true)
        arrow(g, B([210, 470], [240, 480], [260, 510], [276, 540]), { w: 1.8, d: 1200, t: 300, head: 7 })
      },
      rechnung(g) {
        // Würfel aus 1000 × 1000 × 1000 Teilwürfeln; das Wasser darin füllt rund zwanzig Tankwagen
        const [x, y, s, o, n] = [40, 380, 150, 50, 10]
        ink(g, RR(x, y, s, s, 2), { w: 2.4, t: 500 })
        ink(g, [[x, y], [x + o, y - o], [x + s + o, y - o], [x + s, y]], { w: 2, d: 100, t: 400 })
        ink(g, [[x + s + o, y - o], [x + s + o, y + s - o], [x + s, y + s]], { w: 2, d: 150, t: 400 })
        for (let k = 1; k < n; k++) {
          ink(g, L([x + (s * k) / n, y], [x + (s * k) / n, y + s]), { w: 0.6, d: 300 + k * 20, t: 150 })
          ink(g, L([x, y + (s * k) / n], [x + s, y + (s * k) / n]), { w: 0.6, d: 300 + k * 20, t: 150 })
          ink(g, L([x + (s * k) / n, y], [x + (s * k) / n + o, y - o]), { w: 0.6, d: 500 + k * 20, t: 100 })
          ink(g, L([x + s, y + (s * k) / n], [x + s + o, y + (s * k) / n - o]), { w: 0.6, d: 500 + k * 20, t: 100 })
        }
        for (let i = 0; i < 20; i++) tanker(g, 40 + (i % 5) * 64, 590 + Math.floor(i / 5) * 18 - 10, 0.55, 1000 + i * 60)
      },
      elefanten(g) {
        // Elefantenherde unter der Wolke – gleich schwer wie das Wasser darin
        cloud(g, 180, 400, 1.7, 0)
        dashes(g, L([180, 410], [180, 470]), { w: 1, d: 600, dash: 3, gap: 4 })
        ink(g, L([20, 640], [340, 640]), { w: 2.2, d: 300, t: 400 })
        for (let i = 0; i < 18; i++) {
          const row = Math.floor(i / 6)
          elephant(g, 50 + (i % 6) * 52 + row * 12, 540 + row * 48, 0.55, 600 + i * 60)
        }
      },
      troepfchen(g) {
        // Lupe in die Wolke: winzige Tröpfchen; daneben ein Regentropfen im gleichen Maßstab
        cloud(g, 110, 400, 0.9, 0)
        blank(g, E(110, 520, 70))
        ink(g, E(110, 520, 70), { w: 2.6, d: 300, t: 400 })
        ink(g, L([110, 400], [110, 450]), { w: 1.6, d: 400, t: 150 })
        let seed = 6
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 40; i++) {
          const a = rnd() * Math.PI * 2
          const r = rnd() * 60
          const w = wobble(g, { dx: 3, dy: 3, ms: 600 + rnd() * 600, d: 900 })
          dot(w, 110 + Math.cos(a) * r, 520 + Math.sin(a) * r, 1.6, 500 + i * 15)
        }
        drop(g, 270, 500, 2.6, 800)
        ink(g, L([210, 620], [330, 620]), { w: 1.4, d: 1200, t: 300 })
        for (const x of [230, 310]) ink(g, L([x, 612], [x, 628]), { w: 1.4, d: 1300, t: 80 })
      },
      langsam(g) {
        // Tröpfchen schwebt: Schwerkraft gegen Luftwiderstand; darunter warme Luft, die aufsteigt
        ball(g, 180, 380, 10, { fill: 'dicht', w: 2 })
        arrow(g, L([180, 394], [180, 440]), { w: 2.4, d: 400, t: 300, head: 8 })
        arrow(g, L([180, 366], [180, 320]), { w: 2.4, d: 600, t: 300, head: 8 })
        const f = glide(g, 0, 20, { ms: 4000, d: 900, loop: true })
        dot(f, 180, 380, 1, 0)
        ink(g, smooth([[20, 640], [100, 630], [200, 636], [340, 628]], 3), { w: 2.4, d: 300, t: 500 })
        sunDisk(g, 310, 330, 20, 500)
        for (const x of [70, 290]) {
          const p: P[] = Array.from({ length: 30 }, (_, i) => [x + Math.sin(i / 3) * 14, 630 - i * 6] as P)
          dashes(g, p, { w: 1, d: 700, dash: 3, gap: 4 })
          flow(g, p, { n: 3, ms: 2200, d: 900, r: 2, kind: 'ring' })
        }
      },
      luft(g) {
        // Balkenwaage: die Luft der Wolke wiegt viel mehr als ihr Wasser
        ink(g, L([180, 620], [180, 430]), { w: 3, t: 400 })
        ink(g, [[140, 620], [220, 620]], { w: 3, t: 300 })
        const tilt = -14
        const L0: P = [180 - Math.cos(rad(tilt)) * 120, 430 - Math.sin(rad(tilt)) * 120]
        const R0: P = [180 + Math.cos(rad(tilt)) * 120, 430 + Math.sin(rad(tilt)) * 120]
        ink(g, L(L0, R0), { w: 3, d: 300, t: 400 })
        dot(g, 180, 430, 5, 400)
        for (const [p, big] of [[L0, true], [R0, false]] as const) {
          ink(g, [[p[0] - 30, p[1] + 70], p, [p[0] + 30, p[1] + 70]], { w: 1.4, d: 500, t: 300 })
          ink(g, B([p[0] - 40, p[1] + 70], [p[0] - 30, p[1] + 84], [p[0] + 30, p[1] + 84], [p[0] + 40, p[1] + 70]), { w: 2.4, d: 600, t: 300 })
          if (big) {
            const blk: P[] = RR(p[0] - 36, p[1] - 10, 72, 78, 4)
            hatch(g, blk, 900)
            ink(g, blk, { w: 2, d: 800, t: 300 })
            for (let k = 0; k < 8; k++) ink(g, E(p[0] - 22 + (k % 4) * 14, p[1] + 10 + Math.floor(k / 4) * 30, 4, 3), { w: 1, d: 1000 + k * 30, t: 60 })
          } else drop(g, p[0], p[1] + 56, 0.4, 900)
        }
      },
      regen(g) {
        // Tröpfchen stoßen zusammen und wachsen zu einem Tropfen, der fällt
        cloud(g, 180, 420, 1.8, 0, true)
        for (let i = 0; i < 6; i++) {
          const m = glide(g, (2.5 - i) * 10, 10, { ms: 1400, d: 900 + i * 100 })
          dot(m, 150 + i * 12, 440, 2, 800)
        }
        const big = glide(g, 0, 180, { ms: 1400, d: 2400, loop: true })
        drop(big, 180, 470, 0.6, 2200)
        rain(g, 90, 460, 180, 160, { n: 10, d: 1400, ms: 800 })
        ink(g, L([20, 640], [340, 640]), { w: 2.2, d: 300, t: 400 })
      },
      gewitter(g) {
        // Gewitterturm mit Amboss bis an die Tropopause, Blitz, Regenschauer; Flugzeug zum Größenvergleich
        const c: P[] = smooth([[60, 590], [70, 540], [100, 520], [110, 460], [130, 410], [140, 360], [100, 340], [60, 330], [90, 318], [180, 312], [300, 316], [340, 330], [280, 340], [220, 360], [230, 420], [250, 470], [280, 510], [300, 560], [300, 590]], 3)
        blank(g, [...c, [60, 590]])
        hatch(g, [...c, [60, 590]], 600)
        hatch(g, [[70, 590], [300, 590], [280, 520], [100, 520]], 800, true)
        ink(g, c, { w: 3, t: 900 })
        ink(g, L([60, 590], [300, 590]), { w: 2.4, d: 300, t: 400 })
        for (let k = 0; k < 4; k++) ink(g, E(150 + k * 20, 470 - k * 30, 22, 14, 200, 330), { w: 1.1, d: 600 + k * 60, t: 200 })
        bolt(g, [[200, 594], [184, 620], [200, 624], [180, 656]], 1400, 3)
        rain(g, 90, 596, 90, 56, { n: 8, d: 1000, ms: 600 })
        jet(g, 300, 470, 0.18, 1200)
      },
      weiss(g) {
        // links dünne Wolke: das Sonnenlicht geht hindurch; rechts dicke Wolke: kaum Licht kommt unten an
        sunDisk(g, 180, 330, 22, 0)
        for (const [x, dense, n] of [[90, false, 6], [270, true, 1]] as const) {
          cloud(g, x, 470, dense ? 1.1 : 0.9, 300, dense)
          if (dense) hatch(g, RR(x - 70, 470, 140, 20, 6), 700, true)
          for (let k = 0; k < n; k++) {
            const xx = x - 40 + k * 16 + (n === 1 ? 40 : 0)
            arrow(g, L([xx, 490], [xx - 4, 600]), { w: 1.6, d: 900 + k * 60, t: 300, head: 6 })
          }
          for (let k = 0; k < 3; k++) ink(g, L([180 + (x - 180) * 0.2 + k * 6, 352], [x - 20 + k * 20, 410]), { w: 1, d: 500, t: 200 })
        }
        ink(g, L([20, 620], [340, 620]), { w: 2.2, d: 400, t: 400 })
        fig(g, 90, 620, 1.6, { d: 800 })
        fig(g, 270, 620, 1.6, { d: 900 })
      },
      ende(g) {
        const w = glide(g, 20, 0, { ms: 8000, d: 600, loop: true })
        cloud(w, 180, 520, 1.8, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { wolke: {} } },
      { t: T('Wolken sehen aus wie Watte. Dabei bestehen sie aus Milliarden winziger **Wassertröpfchen** – oder Eiskristallen.', 64), gfx: { troepfchen: {} } },
      { t: T('Nehmen wir eine kleine **Schönwetterwolke**, etwa einen Kilometer breit, hoch und tief.', 64), gfx: { wuerfel: {} } },
      { t: T('In jedem Kubikmeter davon schweben etwa **ein halbes Gramm** Wasser. Klingt nach wenig.', 64), gfx: { gramm: {} } },
      { t: T('Aber ein Kubikkilometer hat eine Milliarde Kubikmeter. Macht zusammen rund **500 Tonnen** Wasser.', 64), gfx: { rechnung: {} } },
      { t: T('Das ist so schwer wie etwa **hundert Elefanten** – die da über deinem Kopf schweben.', 64), gfx: { elefanten: {} } },
      { t: T('Warum fällt das nicht herunter? Weil die Tröpfchen **winzig** sind: etwa ein Hundertstel Millimeter.', 64), gfx: { troepfchen: {} } },
      { t: T('So kleine Tropfen bremst der **Luftwiderstand** fast völlig. Sie sinken nur rund einen Zentimeter pro Sekunde.', 64), gfx: { langsam: {} } },
      { t: T('Schon leichter **Aufwind** reicht, um sie oben zu halten. Wolken entstehen ja gerade dort, wo warme Luft aufsteigt.', 64), gfx: { langsam: {} } },
      { t: T('Und noch ein Trick: Die Luft in der Wolke wiegt viel mehr als das Wasser – rund **eine Million Tonnen**.', 64), gfx: { luft: {} } },
      { t: T('Die Wolke ist also kein schwerer Klotz in leichter Luft. Sie ist **Luft mit etwas Wasser** – und schwebt in Luft.', 64), gfx: { luft: {} } },
      { t: T('Feuchte, warme Luft ist sogar etwas **leichter** als trockene, kalte. Darum steigt sie auf.', 64), gfx: { langsam: {} } },
      { t: T('Regen beginnt, wenn Tröpfchen **zusammenwachsen**. Rund eine Million Wolkentröpfchen ergeben einen einzigen Regentropfen.', 64), gfx: { regen: {} } },
      { t: T('Der ist dann zu schwer für den Aufwind und fällt mit **mehreren Metern** pro Sekunde.', 64), gfx: { troepfchen: {} } },
      { t: T('Eine große Gewitterwolke türmt sich über zehn Kilometer hoch und trägt Wasser von **Millionen Tonnen**.', 64), gfx: { gewitter: {} } },
      { t: T('Darum sieht sie auch so dunkel aus: Dicke Wolken lassen wenig Licht durch. Dünne Wolken streuen alle Farben – und wirken **weiß**.', 64), gfx: { weiss: {} } },
      { t: T('Und wohin geht all das Wasser? Die Atmosphäre hält zu jeder Zeit rund **13.000 Kubikkilometer** – und tauscht sie etwa alle neun Tage aus.', 64), gfx: { regen: {} } },
      { t: T('Jedes Mal, wenn du eine Wolke siehst, schwebt dort also das Gewicht einer **Elefantenherde**.', 64), gfx: { elefanten: {} } },
      { t: T('Schwer – aber **fein verteilt**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Eine kleine Haufenwolke (~1 km³) enthält bei ~0,5 g/m³ rund 500 t Wasser.', 'Die Tröpfchen sind so winzig (~0,01 mm), dass sie kaum sinken; Aufwind hält sie oben.', 'Erst wenn Tröpfchen zu Regentropfen zusammenwachsen, fallen sie.'],
    sources: ['USGS Water Science School: How much does a cloud weigh?', 'Wallace & Hobbs 2006: Atmospheric Science', 'Deutscher Wetterdienst: Wetterlexikon (Wolken)'],
  },
  {
    id: 'badewanne-coriolis',
    area: 'GEO',
    day: 71,
    hook: 'Dreht sich der Abfluss auf der Südhalbkugel andersherum?',
    mood: 'raetsel',
    ambience: 'blasen',
    images: [],
    draw: {
      wanne(g) {
        ink(g, [...B([40, 200], [40, 380], [320, 380], [320, 200])], { w: 3, t: 700 })
        ink(g, waveP(46, 314, 240, 3, 50), { w: 2, d: 300, t: 500 })
        arcArrow(g, 180, 296, 22, 0, 300, { d: 700 })
      },
      erde(g) {
        globe(g, 180, 470, 110)
        arcArrow(g, 180, 350, 60, 200, 340, { d: 1100 })
      },
      karussell(g) {
        ink(g, E(180, 480, 120, 40), { w: 3, t: 700 })
        arcArrow(g, 180, 480, 140, 20, 160, { d: 400 })
        ball(g, 120, 470, 8, { fill: 'dicht', d: 600 })
        ink(g, B([128, 470], [170, 466], [210, 476], [250, 500]), { w: 2.2, d: 900, t: 600 })
        text(g, 180, 656, 'der Ball scheint abzubiegen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ablenkung(g) {
        ink(g, E(180, 470, 110), { w: 3, t: 800 })
        dashes(g, L([72, 470], [288, 470]), { w: 1.4, d: 400 })
        for (const [y, k] of [[410, 1], [530, -1]] as const) carrow(g, [130, y], [230, y], 20 * k, { d: 900 })
        text(g, 180, 330, 'Norden: nach rechts', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 180, 620, 'Süden: nach links', { anchor: 'middle', cls: 's', d: 1200 })
      },
      hurrikan(g) {
        for (const [cx, dir] of [[100, -1], [260, 1]] as const) {
          const p: P[] = []
          for (let i = 0; i <= 80; i++) {
            const a = (i / 80) * Math.PI * 4
            const r = 8 + a * 4.5
            p.push([cx + Math.cos(a * dir) * r, 470 + Math.sin(a * dir) * r])
          }
          ink(g, p, { w: 2.2, t: 900, d: cx === 100 ? 0 : 400 })
        }
        text(g, 100, 580, 'Norden', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 260, 580, 'Süden', { anchor: 'middle', cls: 's', d: 1100 })
      },
      winzig(g) {
        hbars(g, [
          { label: 'Hurrikan', v: 100, fmt: () => 'Hunderte km', dense: true },
          { label: 'Badewanne', v: 1, fmt: () => 'ein halber Meter' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'Coriolis wirkt erst auf große Strecken', { anchor: 'middle', cls: 's', d: 1200 })
      },
      stoerung(g) {
        bullets(g, 40, 380, ['Form des Beckens', 'Restströmung beim Einfüllen', 'Lage des Abflusses', 'Temperaturunterschiede'], { gap: 50, size: 18 })
      },
      shapiro(g) {
        timeline(g, 30, 330, 470, [{ at: 0.45, label: '1962', sub: 'Ascher Shapiro, MIT', up: true }])
      },
      becken(g) {
        ink(g, E(180, 470, 110, 110), { w: 3, t: 800 })
        clock(g, 180, 470, 50, 0, 0, 400)
        text(g, 180, 620, '24 Stunden ruhen lassen', { anchor: 'middle', cls: 's', d: 900 })
      },
      trick(g) {
        fig(g, 90, 600, 3.6)
        ink(g, RR(160, 480, 140, 60, 6), { w: 2.6, d: 300, t: 400 })
        arcArrow(g, 230, 510, 20, 0, 300, { d: 700 })
        text(g, 230, 580, 'am Äquator', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 640, 'der Trick: vorher umrühren', { anchor: 'middle', cls: 's', d: 1100 })
      },
      aequator(g) {
        ink(g, E(180, 470, 100), { w: 3, t: 800 })
        ink(g, L([82, 470], [278, 470]), { w: 2.2, d: 600, t: 400 })
        text(g, 180, 610, 'am Äquator: keine Ablenkung', { anchor: 'middle', cls: 's', d: 1000 })
      },
      pendel(g) {
        ink(g, L([180, 300], [180, 542]), { w: 2, t: 600 })
        ball(g, 180, 560, 18, { fill: 'dicht', d: 400 })
        ink(g, E(180, 620, 110, 26), { w: 2, d: 600, t: 700 })
        for (let i = 0; i < 5; i++) {
          const a = rad(-40 + i * 20)
          ink(g, L([180 - Math.cos(a) * 90, 620 - Math.sin(a) * 18], [180 + Math.cos(a) * 90, 620 + Math.sin(a) * 18]), { w: 1, d: 1000 + i * 150, t: 200 })
        }
        text(g, 180, 670, 'Foucault 1851, Paris', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        arcArrow(g, 140, 480, 40, 0, 300)
        arcArrow(g, 230, 480, 40, 300, 0, { d: 300 })
        question(g, 185, 380, 0.6, 700)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { wanne: {} } },
      { t: T('Es ist ein beliebter Partyfakt: Im Norden dreht sich der Wasserstrudel **in die eine Richtung**, im Süden in die andere.', 64), gfx: { wanne: { tf: [1, 0, 220] } } },
      { t: T('Dahinter steckt etwas Echtes: die **Corioliskraft**. Sie entsteht, weil sich die Erde dreht.', 64), gfx: { erde: {} } },
      { t: T('Stell dir ein Karussell vor: Wirfst du einen Ball geradeaus, scheint er für dich **abzubiegen** – weil du dich unter ihm wegdrehst.', 64), gfx: { karussell: {} } },
      { t: T('Auf der Erde werden Bewegungen so abgelenkt: auf der Nordhalbkugel **nach rechts**, auf der Südhalbkugel nach links.', 64), gfx: { ablenkung: {} } },
      { t: T('Bei Wirbelstürmen sieht man das deutlich: Hurrikane drehen im Norden **gegen den Uhrzeiger**, im Süden mit ihm.', 64), gfx: { hurrikan: {} } },
      { t: T('Aber die Corioliskraft ist **sehr schwach**. Sie zeigt sich erst über Hunderte Kilometer und viele Stunden.', 64), gfx: { winzig: {} } },
      { t: T('In einer Badewanne ist sie **millionenfach** schwächer als alles andere, was das Wasser bewegt.', 64), gfx: { winzig: {} } },
      { t: T('Entscheidend sind die **Form** des Beckens, die Lage des Abflusses und Strömungen, die vom Einfüllen übrig sind.', 64), gfx: { stoerung: {} } },
      { t: T('Darum dreht sich dein Abfluss mal so, mal so – **egal**, wo du wohnst.', 64), gfx: { wanne: {} } },
      { t: T('Kann man den Effekt überhaupt messen? Der Ingenieur Ascher Shapiro versuchte es 1962 am **MIT**.', 64), gfx: { shapiro: {} } },
      { t: T('Er füllte ein großes, rundes, völlig symmetrisches Becken und ließ das Wasser **24 Stunden** lang ruhen.', 64), gfx: { becken: {} } },
      { t: T('Erst dann zog er den Stöpsel – und das Wasser drehte sich langsam **gegen den Uhrzeiger**, wie für Boston erwartet.', 64), gfx: { becken: {} } },
      { t: T('So aufwendig muss man es machen. In Kenia oder Ecuador zeigen Straßenkünstler trotzdem Touristen den „Beweis“ **am Äquator**.', 64), gfx: { trick: {} } },
      { t: T('Ihr Trick: Sie gießen das Wasser **mit leichtem Schwung** ein. Ein paar Schritte weiter dreht es sich dann andersherum.', 64), gfx: { trick: {} } },
      { t: T('Dabei ist die waagrechte Ablenkung **am Äquator** selbst null. Darum entstehen direkt dort auch keine Wirbelstürme.', 64), gfx: { aequator: {} } },
      { t: T('Auch weite **Meeresströmungen** und Passatwinde verdanken ihre Richtung zum Teil der Corioliskraft.', 64), gfx: { ablenkung: {} } },
      { t: T('Sichtbar wird die Erddrehung im **Foucault-Pendel**: Seine Schwingebene dreht sich im Lauf des Tages langsam weiter.', 64), gfx: { pendel: {} } },
      { t: T('Echt bei Stürmen, **Mythos** in der Wanne.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die Corioliskraft lenkt Bewegungen auf der Nordhalbkugel nach rechts, im Süden nach links ab.', 'Sie prägt Wirbelstürme, ist in der Badewanne aber millionenfach schwächer als Beckenform und Restströmungen.', 'Nur unter Laborbedingungen (Shapiro 1962) zeigt sie sich im Abfluss; Äquator-Shows sind Tricks.'],
    sources: ['Shapiro 1962, Nature 196', 'NOAA SciJinks: What is the Coriolis effect?', 'Fraser 2007: Bad Coriolis (Universität Wollongong)'],
  },
  {
    id: 'himalaya-meer',
    area: 'GEO',
    day: 29,
    hook: 'Warum liegen auf dem Mount Everest Muscheln aus dem Meer?',
    mood: 'episch',
    ambience: 'wind',
    images: [],
    draw: {
      gipfel(g) {
        mountain(g, 30, 330, 420, [180, 110])
        ink(g, L([20, 422], [340, 422]), { w: 2.6, d: 200, t: 500 })
        blank(g, E(180, 170, 22))
        ammonite(g, 180, 170, 20, 1000)
      },
      kalk(g) {
        for (let i = 0; i < 5; i++) ink(g, L([40, 380 + i * 40], [320, 380 + i * 40 + (i % 2) * 6]), { w: 2.2, d: i * 120, t: 400 })
        for (const [x, y] of [[100, 400], [220, 442], [160, 484], [270, 520]] as const) {
          blank(g, E(x, y, 14))
          ammonite(g, x, y, 12, 800)
        }
        text(g, 180, 620, 'Kalkstein aus Meerestieren', { anchor: 'middle', cls: 's', d: 1200 })
      },
      alter(g) {
        text(g, 180, 450, '450 Mio.', { anchor: 'middle', size: 52, d: 200 })
        text(g, 180, 495, 'Jahre alt: Gestein am Gipfel', { anchor: 'middle', cls: 's', d: 600 })
      },
      tiere(g) {
        ammonite(g, 100, 470, 40)
        ink(g, [...B([210, 420], [260, 400], [300, 440], [290, 500]), ...B([290, 500], [270, 540], [220, 540], [210, 500]).slice(1), [210, 420]], { w: 2.6, d: 400, t: 700 })
        for (let i = 0; i < 4; i++) ink(g, L([216 + i * 6, 430 + i * 22], [288 - i * 4, 440 + i * 22]), { w: 1.4, d: 900 + i * 80, t: 200 })
        text(g, 180, 600, 'Seelilien, Trilobiten, Muscheln', { anchor: 'middle', cls: 's', d: 1100 })
      },
      indien(g) {
        const a = st(g, 'm1', '--m1: translateY(-80px); transition-duration: 2.2s; --dl: 500ms')
        blob(a, 180, 590, 50, 40, 7)
        text(a, 180, 650, 'Indien', { anchor: 'middle', cls: 's', d: 300 })
        ink(g, B([30, 400], [120, 380], [240, 380], [330, 400]), { w: 3, d: 200, t: 600 })
        text(g, 180, 360, 'Asien', { anchor: 'middle', cls: 's', d: 400 })
      },
      tethys(g) {
        ink(g, L([20, 380], [340, 380]), { w: 2.8, t: 500 })
        text(g, 180, 360, 'Asien', { anchor: 'middle', cls: 's', d: 300 })
        for (const y of [440, 480]) ink(g, waveP(40, 320, y, 5, 50, y / 20), { w: 2, d: 400, t: 600 })
        text(g, 180, 530, 'Tethys-Meer', { anchor: 'middle', d: 800 })
        ink(g, L([20, 600], [340, 600]), { w: 2.8, d: 200, t: 500 })
        text(g, 180, 630, 'Indien', { anchor: 'middle', cls: 's', d: 400 })
        arrow(g, L([80, 650], [80, 610]), { w: 2.2, d: 1000, t: 300, head: 8 })
      },
      falten(g) {
        ink(g, L([20, 620], [340, 620]), { w: 2.4, t: 500 })
        for (let i = 0; i < 4; i++) {
          const y = 600 - i * 26
          ink(g, waveP(60, 300, y, 14, 120), { w: 2.2, d: 200 + i * 150, t: 600 })
        }
        arrow(g, L([20, 540], [52, 540]), { w: 2.6, d: 900, t: 300, head: 10 })
        arrow(g, L([340, 540], [308, 540]), { w: 2.6, d: 900, t: 300, head: 10 })
        text(g, 180, 440, 'gefaltet und hochgedrückt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      tischtuch(g) {
        ink(g, L([20, 600], [340, 600]), { w: 2.4, t: 500 })
        ink(g, [[30, 598], [120, 598], ...B([120, 598], [150, 520], [180, 520], [200, 598]).slice(1), ...B([200, 598], [220, 560], [240, 560], [260, 598]).slice(1), [330, 598]], { w: 2.6, d: 300, t: 700 })
        arrow(g, L([340, 560], [290, 560]), { w: 2.4, d: 900, t: 300, head: 10 })
        text(g, 180, 470, 'wie ein Tischtuch, das man zusammenschiebt', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zeit(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: '450 Mio.', sub: 'Meeresboden', up: true },
          { at: 0.7, label: '50 Mio.', sub: 'Zusammenstoß', big: true },
          { at: 0.95, label: 'heute' },
        ])
      },
      waechst(g) {
        text(g, 180, 450, '8.849 m', { anchor: 'middle', size: 52, d: 200 })
        text(g, 180, 495, 'und er wächst noch: wenige Millimeter im Jahr', { anchor: 'middle', cls: 's', d: 600 })
      },
      beben(g) {
        mountain(g, 60, 300, 560, [180, 380])
        ink(g, L([20, 562], [340, 562]), { w: 2.6, d: 200, t: 500 })
        seismo(g, 30, 330, 620, 30, 800)
        text(g, 180, 670, 'Nepal 2015: Stärke 7,8', { anchor: 'middle', cls: 's', d: 1100 })
      },
      alpen(g) {
        mountain(g, 20, 190, 580, [105, 400])
        mountain(g, 190, 340, 580, [265, 430], 300, true)
        ink(g, L([20, 582], [340, 582]), { w: 2.6, d: 200, t: 500 })
        text(g, 180, 630, 'Alpen: Afrika drückt gegen Europa', { anchor: 'middle', cls: 's', d: 1100 })
      },
      leonardo(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: 'um 1500', sub: 'Leonardo da Vinci', up: true }])
      },
      ende(g) {
        mountain(g, 60, 300, 600, [180, 360])
        blank(g, E(180, 410, 18))
        ammonite(g, 180, 410, 16, 800)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { gipfel: {} } },
      { t: T('Der Gipfel des Mount Everest besteht aus **Kalkstein** – entstanden aus Schalen und Skeletten von Meerestieren.', 64), gfx: { kalk: {} } },
      { t: T('Dieses Gestein ist rund **450 Millionen** Jahre alt. Damals lag es am Grund eines warmen Meeres.', 64), gfx: { alter: {} } },
      { t: T('Bergsteiger finden dort oben Reste von **Seelilien**, Trilobiten und anderen Meerestieren.', 64), gfx: { tiere: {} } },
      { t: T('Wie kommt ein Meeresboden auf fast **neun Kilometer** Höhe?', 64), gfx: { gipfel: { tf: [1, 0, 200] } } },
      { t: T('Die Antwort heißt **Indien**. Es war einst eine Insel weit im Süden und driftete nach Norden.', 64), gfx: { indien: { cls: 'a1' } } },
      { t: T('Zwischen Indien und Asien lag ein Ozean, die **Tethys**. Auf seinem Grund sammelte sich Kalk.', 64), gfx: { tethys: {} } },
      { t: T('Indien raste geradezu: teils **15 Zentimeter** im Jahr – für eine Erdplatte rekordverdächtig.', 64), gfx: { tethys: {} } },
      { t: T('Vor rund **50 Millionen** Jahren prallte es auf Asien. Das Meer dazwischen verschwand.', 64), gfx: { zeit: {} } },
      { t: T('Der Meeresboden wurde zusammengeschoben, **gefaltet** und übereinandergestapelt – immer höher.', 64), gfx: { falten: {} } },
      { t: T('Stell dir ein **Tischtuch** vor, das du über den Tisch schiebst: Es wirft Falten nach oben.', 64), gfx: { tischtuch: {} } },
      { t: T('So entstand der **Himalaya**. Und Indien drückt bis heute weiter, ein paar Zentimeter pro Jahr.', 64), gfx: { falten: {} } },
      { t: T('Der Everest misst nach der Messung von 2020 **8.849 Meter** – und hebt sich noch um wenige Millimeter im Jahr.', 64), gfx: { waechst: {} } },
      { t: T('Gleichzeitig tragen Wind, Eis und Wasser ihn ab. Gebirge sind ein Wettlauf zwischen **Heben und Abtragen**.', 64), gfx: { waechst: {} } },
      { t: T('Weil Indien unter Asien taucht, ist die Erdkruste unter Tibet doppelt so dick wie üblich – rund **70 Kilometer**.', 64), gfx: { falten: {} } },
      { t: T('Die Spannung entlädt sich in **Erdbeben** – etwa 2015 in Nepal mit fast 9.000 Toten.', 64), gfx: { beben: {} } },
      { t: T('Auch die **Alpen** sind so entstanden: Afrika schiebt sich gegen Europa. Die Zugspitze besteht aus einem uralten Riff.', 64), gfx: { alpen: {} } },
      { t: T('Selbst in Deutschland findest du oft **Ammoniten** im Gestein – zum Beispiel auf der Schwäbischen Alb, einst ein Meeresboden.', 64), gfx: { kalk: {} } },
      { t: T('Schon **Leonardo da Vinci** wunderte sich über Muscheln in den Bergen Italiens – und vermutete richtig, dass dort einst Meer war.', 64), gfx: { leonardo: {} } },
      { t: T('Die Berge von heute sind die **Meeresböden** von gestern.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Der Everest-Gipfel ist ~450 Mio. Jahre alter Meeres-Kalkstein mit Fossilien.', 'Indien driftete nach Norden und stieß vor ~50 Mio. Jahren auf Asien; der Boden der Tethys wurde gefaltet und gehoben.', 'Der Himalaya wächst noch (Everest 8.849 m); Erdbeben sind die Folge – ähnlich entstanden die Alpen.'],
    sources: ['Searle 2013: Colliding Continents', 'USGS: The Himalayas – Two continents collide', 'Nepal/China 2020: Neuvermessung des Mount Everest'],
  },
]

/** Kleine Fische auf dem trockenen Grund (Tsunami-Rückzug) */
function ammoniteFish(g: Element, x: number, y: number, d: number): void {
  ink(g, [...B([x, y], [x + 6, y - 6], [x + 16, y - 6], [x + 20, y]), ...B([x + 20, y], [x + 16, y + 6], [x + 6, y + 6], [x, y]).slice(1), [x - 6, y - 5], [x - 6, y + 5], [x, y]], { w: 1.6, d, t: 200 })
}

