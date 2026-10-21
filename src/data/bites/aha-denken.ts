import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, bolt, brain, bubble, car, check, cross, crowd, dashes, fig, group, hatch, ink, letter, mk, mountain, pop, question, rays, st, strike, text, vbars, type P } from './draw'
import { axes, bact, ball, carrow, clipBox, cloud, dot, dplot, drop, earth, flame, flow, glide, head, house, jet, lens, moonFace, plot, rad, ripple, smooth, spin, stars, sunDisk, virus, wobble } from './kit'

// Denkwerkzeuge & Statistik: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Roulette-Rad */
function wheel(g: Element, cx: number, cy: number, r: number, d = 0): void {
  ink(g, E(cx, cy, r), { w: 3.2, d, t: 900 })
  ink(g, E(cx, cy, r * 0.72), { w: 2, d: d + 300, t: 700 })
  for (let k = 0; k < 18; k++) {
    const a0 = rad(k * 20)
    const a1 = rad(k * 20 + 20)
    if (k % 2) hatch(g, [[cx + Math.cos(a0) * r * 0.72, cy + Math.sin(a0) * r * 0.72], [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r], [cx + Math.cos(a1) * r * 0.72, cy + Math.sin(a1) * r * 0.72]], d + 600, true)
    ink(g, L([cx + Math.cos(a0) * r * 0.72, cy + Math.sin(a0) * r * 0.72], [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r]), { w: 1.2, d: d + 500, t: 100 })
  }
  ball(g, cx, cy, r * 0.18, { d: d + 700, fill: 'dicht', t: 200 })
}

/** Gitter aus Punkten (Häufigkeitsbild), markiert: Indizes → dicht */
function dotgrid(g: Element, x0: number, y0: number, cols: number, rows: number, gap: number, r: number, d = 0): SVGCircleElement[] {
  const out: SVGCircleElement[] = []
  for (let i = 0; i < cols * rows; i++) {
    const c = mk('circle', { cx: x0 + (i % cols) * gap, cy: y0 + Math.floor(i / cols) * gap, r, class: 'k fade', style: `--d:${d + Math.floor(i / cols) * 40}ms` }, g)
    c.style.opacity = '0.35'
    out.push(c)
  }
  return out
}

/** Geburtstagstorte mit Kerzen (Flammen flackern), Mitte unten (x, y) */
function cake(g: Element, x: number, y: number, s = 1, d = 0, n = 3): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  ink(g, E(x, y, 60 * s, 10 * s), { w: 2.2, d, t: 400 })
  for (const [w, h, y0] of [[50, 30, -6], [34, 24, -36]] as const) {
    const t: P[] = [P(-w, y0), P(-w, y0 - h), ...E(x, y + (y0 - h) * s, w * s, 6 * s, 180, 360).slice(1), P(w, y0)]
    blank(g, [...t, ...E(x, y + y0 * s, w * s, 6 * s, 0, 180)])
    ink(g, t, { w: 2.4, d: d + 100, t: 400 })
    ink(g, E(x, y + y0 * s, w * s, 6 * s, 0, 180), { w: 1.6, d: d + 150, t: 300 })
    for (let k = 0; k < 6; k++) ink(g, B(P(-w + k * (w / 3), y0 - h + 2), P(-w + k * (w / 3) + 4, y0 - h + 10), P(-w + k * (w / 3) + 10, y0 - h + 10), P(-w + k * (w / 3) + 14, y0 - h + 2)), { w: 1, d: d + 300 + k * 30, t: 80 })
  }
  for (let k = 0; k < n; k++) {
    const cx = x + (-16 + (32 / Math.max(1, n - 1)) * k) * s
    ink(g, RR(cx - 3 * s, y - 80 * s, 6 * s, 20 * s, 1), { w: 1.4, d: d + 500, t: 100 })
    const fw = wobble(g, { deg: 6, ox: cx, oy: y - 82 * s, ms: 500 + k * 70, d: d + 900 })
    flame(fw, cx, y - 82 * s, 0.13 * s, d + 700)
  }
}

/** Kreis aus n Köpfen; alle Verbindungen (Paare) als feine Linien, Person 0 hervorgehoben */
function pairCircle(g: Element, cx: number, cy: number, r: number, n: number, d = 0, o: { mine?: boolean; all?: boolean; dAll?: number } = {}): P[] {
  const pts: P[] = Array.from({ length: n }, (_, i) => [cx + Math.cos(rad(-90 + (i * 360) / n)) * r, cy + Math.sin(rad(-90 + (i * 360) / n)) * r])
  if (o.all !== false) {
    // alle Paare als ein einziger Zug (Euler-Kreis, bei ungerader Anzahl vorhanden): leicht für das Gerät
    const left = new Set<string>()
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) left.add(i + ',' + j)
    const key = (a: number, b: number) => (a < b ? a + ',' + b : b + ',' + a)
    const stack = [0]
    const tour: number[] = []
    while (stack.length) {
      const v = stack[stack.length - 1]
      let next = -1
      for (let u = 0; u < n; u++) if (u !== v && left.has(key(v, u))) { next = u; break }
      if (next < 0) tour.push(stack.pop() as number)
      else { left.delete(key(v, next)); stack.push(next) }
    }
    const path: P[] = []
    tour.forEach((v, i) => path.push(...(i ? L(pts[tour[i - 1]], pts[v], 60).slice(1) : [pts[v]])))
    ink(g, path, { w: 0.6, d: o.dAll ?? d + 600, t: Math.min(3000, tour.length * 14), p: 0.2 })
  }
  if (o.mine) for (let j = 1; j < n; j++) ink(g, L(pts[0], pts[j], 6), { w: 1.8, d: d + 300 + j * 30, t: 100 })
  pts.forEach(([x, y], i) => ball(g, x, y, n > 16 ? 6 : 9, { d: d + i * 20, fill: i === 0 && o.mine ? 'dicht' : 'leer', w: 1.6, t: 80 }))
  return pts
}

/** Trikot mit Nummernfeld */
function shirt(g: Element, x: number, y: number, s = 1, d = 0, dense = false): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const o: P[] = [P(-8, -14), P(-16, -10), P(-20, -2), P(-14, 2), P(-12, -2), P(-12, 16), P(12, 16), P(12, -2), P(14, 2), P(20, -2), P(16, -10), P(8, -14), ...B(P(8, -14), P(4, -8), P(-4, -8), P(-8, -14)).slice(1)]
  blank(g, o)
  if (dense) hatch(g, o, d + 200, true)
  ink(g, o, { w: 1.6, d, t: 200 })
}

/** Raster aus n Tagesfeldern, 25 je Zeile (12 × 18 px), als Gitterlinien */
function dayGrid(g: Element, n: number, d = 0): void {
  const rows = Math.ceil(n / 25)
  for (let r = 0; r <= rows; r++) {
    const w = r === rows ? (n % 25 || 25) : r === rows - 1 && n % 25 ? 25 : 25
    ink(g, L([30, 330 + r * 18], [30 + (r === rows ? (n % 25 || 25) : w) * 12, 330 + r * 18], 60), { w: 0.8, d: d + r * 40, t: 150 })
  }
  for (let k = 0; k <= 25; k++) {
    const full = k <= (n % 25 || 25) ? rows : rows - 1
    ink(g, L([30 + k * 12, 330], [30 + k * 12, 330 + full * 18], 60), { w: 0.8, d: d + 200 + k * 20, t: 150 })
  }
}

/** Schnelltest-Kassette: Probenmulde, Ablesefenster mit Kontroll- und Testlinie; pos = Testlinie sichtbar */
function cassette(g: Element, x: number, y: number, s = 1, d = 0, pos = true): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body = RR(x - 90 * s, y - 32 * s, 180 * s, 64 * s, 18 * s)
  blank(g, body)
  ink(g, body, { w: 2.8 * Math.min(1, s), d, t: 600 })
  ink(g, RR(x - 84 * s, y - 26 * s, 168 * s, 52 * s, 14 * s), { w: 1, d: d + 200, t: 500 })
  ink(g, E(x - 56 * s, y, 13 * s), { w: 2, d: d + 300, t: 200 })
  ink(g, E(x - 56 * s, y, 7 * s), { w: 1.2, d: d + 350, t: 150 })
  const win = RR(x - 10 * s, y - 14 * s, 76 * s, 28 * s, 5 * s)
  ink(g, win, { w: 2, d: d + 400, t: 300 })
  hatch(g, RR(x - 8 * s, y - 12 * s, 72 * s, 24 * s, 4 * s), d + 500)
  for (const [a, on] of [[20, true], [42, pos]] as const) if (on) ink(g, L(P(a, -12), P(a, 12)), { w: 4 * s, d: d + 900 + a * 10, t: 200 })
  if (s >= 1) text(g, x + 20 * s, y - 20 * s, 'C', { anchor: 'middle', size: 11 * s, d: d + 600 })
  if (s >= 1) text(g, x + 42 * s, y - 20 * s, 'T', { anchor: 'middle', size: 11 * s, d: d + 600 })
}

/** 10 × 10 Punkte, die ersten k (Index-Reihenfolge nach seed) markiert */
function hundred(g: Element, x: number, y: number, k: number, d = 0, ring = false): void {
  for (let i = 0; i < 100; i++) {
    const cx = x + (i % 10) * 12
    const cy = y + Math.floor(i / 10) * 12
    if (i < k) {
      if (ring) ink(g, E(cx, cy, 4.6), { w: 1.4, d: d + 600 + i * 8, t: 60 })
      else dot(g, cx, cy, 4, d + 600 + i * 8)
    } else dot(g, cx, cy, 1.8, d + i * 4)
  }
}

/** Viermotoriger Bomber von oben, Nase oben, Mitte (cx, cy): Rumpf mit Glaskanzel, Flügel mit Motoren und Propellern, Leitwerk */
function bomber(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const wing: P[] = [P(-150, 4), P(-140, -6), P(-16, -26), P(16, -26), P(140, -6), P(150, 4), P(146, 14), P(16, 12), P(-16, 12), P(-146, 14), P(-150, 4)]
  blank(g, wing)
  hatch(g, [P(-146, 8), P(-16, 4), P(16, 4), P(146, 8), P(146, 14), P(16, 12), P(-16, 12), P(-146, 14)], d + 600)
  ink(g, wing, { w: 2.6 * Math.min(1.2, s), d, t: 800 })
  const tail: P[] = [P(-56, 122), P(-12, 106), P(12, 106), P(56, 122), P(54, 134), P(-54, 134), P(-56, 122)]
  blank(g, tail)
  ink(g, tail, { w: 2.2, d: d + 300, t: 400 })
  const body: P[] = smooth([P(0, -112), P(14, -96), P(16, -40), P(14, 80), P(6, 140), P(0, 146), P(-6, 140), P(-14, 80), P(-16, -40), P(-14, -96), P(0, -112)], 3)
  blank(g, body)
  ink(g, body, { w: 2.8 * Math.min(1.2, s), d: d + 100, t: 700 })
  ink(g, E(cx, cy - 98 * s, 9 * s, 12 * s), { w: 1.4, d: d + 300, t: 150 })
  for (let k = 0; k < 3; k++) ink(g, L(P(-8 + k * 8, -108), P(-8 + k * 8, -88)), { w: 0.8, d: d + 350, t: 60 })
  ink(g, E(cx, cy - 64 * s, 8 * s, 6 * s), { w: 1.4, d: d + 400, t: 100 })
  ink(g, E(cx, cy + 30 * s, 7 * s), { w: 1.4, d: d + 400, t: 100 })
  for (const x of [-100, -55, 55, 100]) {
    const nac = RR(cx + x * s - 8 * s, cy - 40 * s, 16 * s, 40 * s, 6 * s)
    blank(g, nac)
    hatch(g, nac, d + 700, true)
    ink(g, nac, { w: 2, d: d + 600, t: 200 })
    const pr = spin(g, cx + x * s, cy - 42 * s, 300, d + 1000)
    ink(pr, L([cx + x * s - 18 * s, cy - 42 * s], [cx + x * s + 18 * s, cy - 42 * s]), { w: 2, d: d + 800, t: 100 })
  }
}

/** Notenzeichen (Achtelnote), opacity für verblasste */
function note(g: Element, x: number, y: number, s = 1, d = 0): void {
  ink(g, E(x, y, 9 * s, 7 * s), { w: 2.2, d, t: 200 })
  hatch(g, E(x, y, 9 * s, 7 * s), d + 200, true)
  ink(g, L([x + 8 * s, y - 2 * s], [x + 8 * s, y - 44 * s]), { w: 2, d: d + 200, t: 150 })
  ink(g, B([x + 8 * s, y - 44 * s], [x + 18 * s, y - 36 * s], [x + 22 * s, y - 30 * s], [x + 16 * s, y - 20 * s]), { w: 1.8, d: d + 300, t: 150 })
}

/** Reiskorn: schmales Oval, gedreht */
function grain(g: Element, x: number, y: number, s = 1, rot = 0, d = 0): void {
  const pts: P[] = Array.from({ length: 17 }, (_, k) => {
    const a = rad(k * 22.5)
    const px = Math.cos(a) * 5 * s
    const py = Math.sin(a) * 2.4 * s
    return [x + px * Math.cos(rad(rot)) - py * Math.sin(rad(rot)), y + px * Math.sin(rad(rot)) + py * Math.cos(rad(rot))] as P
  })
  blank(g, pts)
  ink(g, pts, { w: 1.1 * Math.max(0.7, s * 0.6), d, t: 60 })
}

/** Reishaufen als Kegel mit Körnern auf der Oberfläche; Basis (x, y), Breite w */
function ricePile(g: Element, x: number, y: number, w: number, h: number, d = 0): void {
  const p: P[] = [[x - w / 2, y], ...B([x - w / 2, y], [x - w * 0.3, y - h * 0.6], [x - w * 0.12, y - h], [x, y - h]).slice(1), ...B([x, y - h], [x + w * 0.12, y - h], [x + w * 0.3, y - h * 0.6], [x + w / 2, y]).slice(1)]
  blank(g, [...p, [x - w / 2, y]])
  hatch(g, [...p.slice(p.length / 2), [x, y]], d + 400)
  ink(g, p, { w: 2.2, d, t: 400 })
  let seed = Math.round(x + y)
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  const n = Math.min(40, Math.round(w / 4))
  for (let k = 0; k < n; k++) {
    const t = rnd()
    const yy = y - h * (1 - Math.sqrt(rnd())) * 0.9
    const half = (w / 2) * (1 - (y - yy) / h)
    grain(g, x + (t - 0.5) * 2 * half * 0.85, yy, Math.max(0.6, w / 160), rnd() * 180, d + 300 + k * 15)
  }
}

/** König: Krone, Bart, Gewand mit Hermelinkragen, Zepter */
function king(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const robe: P[] = [P(-40, 0), P(-30, -80), P(-16, -96), P(16, -96), P(30, -80), P(40, 0), P(-40, 0)]
  blank(g, robe)
  hatch(g, robe, d + 500, true)
  ink(g, robe, { w: 2.4, d, t: 500 })
  const col: P[] = [P(-22, -96), P(22, -96), P(18, -84), P(-18, -84), P(-22, -96)]
  blank(g, col)
  ink(g, col, { w: 1.8, d: d + 200, t: 200 })
  for (let k = 0; k < 4; k++) dot(g, x + (-12 + k * 8) * s, y - 90 * s, 1.4 * s, d + 300)
  ink(g, E(x, y - 112 * s, 14 * s, 16 * s), { w: 2.2, d: d + 300, t: 300 })
  ink(g, B(P(-12, -106), P(-10, -88), P(10, -88), P(12, -106)), { w: 1.8, d: d + 400, t: 200 })
  hatch(g, [...B(P(-12, -106), P(-10, -88), P(10, -88), P(12, -106))], d + 500, true)
  const crown: P[] = [P(-14, -124), P(-16, -142), P(-8, -132), P(0, -146), P(8, -132), P(16, -142), P(14, -124), P(-14, -124)]
  blank(g, crown)
  hatch(g, crown, d + 600)
  ink(g, crown, { w: 2, d: d + 500, t: 200 })
  ink(g, L(P(34, -40), P(46, -130)), { w: 2.4, d: d + 600, t: 200 })
  ball(g, x + 46 * s, y - 134 * s, 6 * s, { d: d + 700, fill: 'dicht', w: 1.4, t: 100 })
}

/** Münze mit Rand: Kopf (Profil, hell schraffiert) oder Zahl (Ziffer) */
function coinKZ(g: Element, x: number, y: number, k: boolean, d = 0, r = 12): void {
  ball(g, x, y, r, { d, fill: k ? 'hell' : 'leer', w: 1.8, t: 0 })
  ink(g, E(x, y, r * 0.78), { w: 0.8, d: d + 100, t: 60 })
  if (k) ink(g, B([x + r * 0.1, y - r * 0.5], [x - r * 0.4, y - r * 0.4], [x - r * 0.3, y + r * 0.3], [x + r * 0.2, y + r * 0.5]), { w: 1.2, d: d + 150, t: 60 })
  else ink(g, [[x - r * 0.2, y - r * 0.3], [x + r * 0.05, y - r * 0.5], [x + r * 0.05, y + r * 0.5]], { w: 1.2, d: d + 150, t: 60 })
}

export const AHA_DENKEN: Bite[] = [
  {
    id: 'geburtstag',
    area: 'DENK',
    day: 25,
    hook: 'Wie viele Leute braucht es, damit zwei am selben Tag Geburtstag haben?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [],
    draw: {
      party(g) {
        // Geburtstagsfeier: Wimpelkette, Luftballons, Torte, Gäste
        ink(g, B([20, 90], [120, 130], [240, 130], [340, 90]), { w: 1.4, t: 600 })
        for (let k = 0; k < 9; k++) {
          const t = (k + 0.5) / 9
          const x = 20 + t * 320
          const y = 90 + Math.sin(t * Math.PI) * 30
          const fl: P[] = [[x - 9, y], [x + 9, y], [x, y + 18], [x - 9, y]]
          if (k % 2) hatch(g, fl, 400 + k * 40, true)
          ink(g, fl, { w: 1.4, d: 300 + k * 40, t: 100 })
        }
        for (const [x, y, dd] of [[50, 170, 500], [300, 160, 700], [80, 200, 900]] as const) {
          const w = wobble(g, { dx: 4, dy: -4, ms: 2400 + x * 5, d: 1000 })
          const bl: P[] = smooth([[x, y + 30], [x - 18, y + 4], [x - 16, y - 22], [x, y - 28], [x + 16, y - 22], [x + 18, y + 4], [x, y + 30]], 3)
          blank(w, bl)
          if (x > 200) hatch(w, bl, dd + 200, true)
          ink(w, bl, { w: 2, d: dd, t: 300 })
          ink(w, B([x, y + 30], [x - 6, y + 60], [x + 6, y + 80], [x, y + 110]), { w: 1, d: dd + 200, t: 200 })
        }
        ink(g, RR(110, 330, 140, 12, 3), { w: 2.4, d: 300, t: 300 })
        for (const x of [120, 240]) ink(g, L([x, 342], [x, 420]), { w: 2, d: 400, t: 200 })
        cake(g, 180, 326, 1, 600, 5)
        crowd(g, 30, 420, 3, 34, 1.7, 900, 100)
        crowd(g, 262, 420, 3, 34, 1.7, 1100, 100)
      },
      kalender(g) {
        // Jahreskalender: zwölf Monatsblätter, zwei Tage sind markiert
        for (let m = 0; m < 12; m++) {
          const x = 30 + (m % 4) * 78
          const y = 330 + Math.floor(m / 4) * 100
          ink(g, RR(x, y, 70, 88, 4), { w: 1.8, d: m * 60, t: 200 })
          hatch(g, RR(x, y, 70, 14, 4), 300 + m * 60, true)
          for (let dd = 0; dd < 30; dd++) ink(g, RR(x + 4 + (dd % 7) * 9.2, y + 20 + Math.floor(dd / 7) * 13, 7, 9, 1), { w: 0.6, d: 600 + m * 40, t: 30 })
        }
        for (const [x, y] of [[30 + 78 + 4 + 3 * 9.2, 430 + 20 + 2 * 13], [30 + 3 * 78 + 4 + 3 * 9.2, 530 + 20 + 2 * 13]] as const) {
          const p = pop(g, 1600, '50% 50%')
          ink(p, E(x + 3.5, y + 4.5, 10), { w: 2.2, t: 0 })
        }
        carrow(g, [150, 486], [262, 586], -30, { d: 1900 })
      },
      kurve(g) {
        // Wahrscheinlichkeit eines gemeinsamen Geburtstags je Gruppengröße
        axes(g, 50, 600, 330, 320, {})
        const f = (n: number) => {
          let p = 1
          for (let i = 0; i < n; i++) p *= (365 - i) / 365
          return 1 - p
        }
        for (const [v, l] of [[0, '0'], [0.5, '50'], [1, '100']] as const) {
          const y = 596 - v * 250
          ink(g, L([44, y], [56, y]), { w: 1.4, d: 300, t: 60 })
          text(g, 40, y + 5, l, { anchor: 'end', cls: 's', d: 400 })
        }
        for (const n of [0, 20, 40, 60, 80]) {
          const x = 56 + (n / 80) * 260
          ink(g, L([x, 594], [x, 606]), { w: 1.4, d: 300, t: 60 })
          text(g, x, 626, String(n), { anchor: 'middle', cls: 's', d: 400 })
        }
        plot(g, 56, 596, 260, 250, (t) => f(Math.round(t * 80)), { d: 600 })
        const x23 = 56 + (23 / 80) * 260
        dashes(g, L([x23, 596], [x23, 596 - 0.507 * 250]), { w: 1.4, d: 1700 })
        dashes(g, L([56, 596 - 0.507 * 250], [x23, 596 - 0.507 * 250]), { w: 1.4, d: 1800 })
        dot(g, x23, 596 - 0.507 * 250, 5, 1900)
        ripple(g, x23, 596 - 0.507 * 250, 6, 26, { n: 2, ms: 1600, d: 2000, w: 1 })
      },
      du(g) {
        // 23 Köpfe im Kreis: fett die 22 Paare mit dir, fein alle übrigen
        pairCircle(g, 180, 480, 140, 23, 0, { mine: true, dAll: 1400 })
      },
      paare(g) {
        // jedes Kästchen ein Paar: Dreieck aus 253 Feldern (Gitterlinien als Treppe)
        const x0 = 40
        const y0 = 342
        const c = 12.5
        for (let r = 0; r <= 22; r++) ink(g, L([x0, y0 + r * c], [x0 + Math.max(r, 1) * c - (r === 0 ? c : 0), y0 + r * c], 40), { w: 0.9, d: r * 60, t: 120 })
        for (let k = 0; k <= 22; k++) ink(g, L([x0 + k * c, y0 + Math.max(k, 1) * c - (k === 0 ? c : 0)], [x0 + k * c, y0 + 22 * c], 40), { w: 0.9, d: 200 + k * 60, t: 120 })
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let k = 0; k < 24; k++) {
          const r = 1 + Math.floor(rnd() * 21)
          const cc = Math.floor(rnd() * r)
          hatch(g, RR(x0 + cc * c + 1, y0 + r * c + 1, c - 2, c - 2, 1), 1600 + k * 40, true)
        }
      },
      zahl253(g) {
        // eine große Menge: nur einer darin hat deinen Tag
        fig(g, 40, 640, 2.4, { d: 0 })
        let seed = 3
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 253; i++) {
          const x = 90 + (i % 23) * 11 + rnd() * 3
          const y = 340 + Math.floor(i / 23) * 26 + rnd() * 4
          dot(g, x, y, 2.6, 200 + i * 5)
        }
        const t = [90 + 17 * 11, 340 + 9 * 26] as P
        ball(g, t[0], t[1], 5, { d: 1800, fill: 'dicht', w: 1.4, t: 60 })
        ripple(g, t[0], t[1], 6, 26, { n: 2, ms: 1600, d: 2000, w: 1 })
        carrow(g, [60, 570], [t[0] - 10, t[1] + 6], -30, { d: 2100 })
      },
      feld(g) {
        // Fußballfeld von oben: Mittelkreis, Strafräume, Tore; 22 Spieler + Schiedsrichter, zwei markiert
        ink(g, RR(30, 340, 300, 300, 4), { w: 3, t: 800 })
        ink(g, L([30, 490], [330, 490]), { w: 2, d: 300, t: 400 })
        ink(g, E(180, 490, 40), { w: 2, d: 400, t: 400 })
        dot(g, 180, 490, 2.4, 500)
        for (const [y, s] of [[340, 1], [640, -1]] as const) {
          ink(g, [[100, y], [100, y + s * 50], [260, y + s * 50], [260, y]], { w: 1.8, d: 500, t: 300 })
          ink(g, [[140, y], [140, y + s * 18], [220, y + s * 18], [220, y]], { w: 1.4, d: 600, t: 200 })
          ink(g, E(180, y + s * 50, 22, 22, s > 0 ? 0 : 180, s > 0 ? 180 : 360), { w: 1.4, d: 700, t: 200 })
          ink(g, RR(160, y - (s > 0 ? 8 : 0), 40, 8, 1), { w: 2, d: 600, t: 100 })
        }
        const pts: P[] = [[180, 360], [90, 410], [150, 410], [210, 410], [270, 410], [70, 460], [130, 460], [230, 460], [290, 460], [150, 520], [210, 520], [180, 620], [90, 570], [150, 570], [210, 570], [270, 570], [70, 530], [290, 530], [110, 520], [250, 520], [180, 470], [200, 430], [120, 480]]
        pts.forEach(([x, y], i) => {
          const w = wobble(g, { dx: (i % 3 - 1) * 6, dy: (i % 2 ? 4 : -4), ms: 1600 + i * 70, d: 1200 })
          ball(w, x, y, i === 22 ? 5 : 6, { d: 800 + i * 40, fill: i === 22 ? 'leer' : i < 11 ? 'dicht' : 'hell', w: 1.4, t: 60 })
        })
        for (const i of [6, 14]) {
          const p = pop(g, 2000, '50% 50%')
          ink(p, E(pts[i][0], pts[i][1], 13), { w: 2.2, t: 0 })
        }
      },
      wm(g) {
        // 32 Trikots, 16 davon mit Geburtstagspaar dunkel
        for (let i = 0; i < 32; i++) {
          const x = 48 + (i % 8) * 38
          const y = 380 + Math.floor(i / 8) * 60
          shirt(g, x, y, 1.1, i * 40, [1, 2, 4, 7, 8, 11, 13, 14, 17, 19, 22, 23, 26, 28, 29, 31].includes(i))
        }
      },
      wachstum(g) {
        // doppelt so viele Menschen – rund viermal so viele Paare
        pairCircle(g, 70, 470, 46, 5, 0, { dAll: 300 })
        pairCircle(g, 180, 470, 52, 11, 400, { dAll: 700 })
        pairCircle(g, 296, 470, 56, 21, 800, { dAll: 1100 })
      },
      pruefsumme(g) {
        // zwei verschiedene Dateien ergeben denselben kurzen Fingerabdruck
        for (const [x, d] of [[60, 0], [220, 300]] as const) {
          const doc: P[] = [[x, 340], [x + 60, 340], [x + 80, 360], [x + 80, 440], [x, 440], [x, 340]]
          blank(g, doc)
          ink(g, doc, { w: 2.2, d, t: 300 })
          ink(g, [[x + 60, 340], [x + 60, 360], [x + 80, 360]], { w: 1.4, d: d + 200, t: 100 })
          for (let k = 0; k < 5; k++) ink(g, L([x + 10, 372 + k * 13], [x + 10 + ((k * 23 + x) % 50) + 10, 372 + k * 13]), { w: 1, d: d + 300 + k * 40, t: 80 })
        }
        arrow(g, L([100, 450], [160, 520]), { w: 2, d: 800, t: 300, head: 8 })
        arrow(g, L([260, 450], [200, 520]), { w: 2, d: 900, t: 300, head: 8 })
        ink(g, RR(90, 530, 180, 60, 6), { w: 2.4, d: 1100, t: 300 })
        const bars = [3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2]
        let x = 102
        bars.forEach((w, k) => {
          if (k % 2 === 0) hatch(g, RR(x, 540, w * 3, 40, 0), 1300 + k * 30, true)
          x += w * 3 + 2
        })
        ripple(g, 180, 560, 20, 100, { n: 2, ms: 1600, d: 1800, w: 1, ry: 0.4 })
      },
      sicher(g) {
        // alle 366 Felder belegt – die nächste Person findet keinen freien Tag mehr
        dayGrid(g, 366, 0)
        for (let r = 0; r < 15; r++) hatch(g, RR(30, 330 + r * 18, r === 14 ? 16 * 12 : 300, 18, 0), 300 + r * 80, true)
        fig(g, 300, 640, 2.2, { d: 1600, arms: 'up' })
        question(g, 262, 610, 0.5, 1900)
      },
      ende(g) {
        cake(g, 180, 470, 1.2, 0, 5)
        crowd(g, 50, 600, 7, 42, 1.8, 600, 100)
      },
      gruppe(g) {
        // 23 Menschen in drei Reihen, zwei tragen eine Torte über dem Kopf – sie haben am selben Tag Geburtstag
        for (let r = 0; r < 3; r++) for (let k = 0; k < (r === 2 ? 7 : 8); k++) {
          const x = 44 + k * 40 + (r % 2) * 18
          const y = 460 + r * 70
          fig(g, x, y, 1.9, { d: 200 + (r * 8 + k) * 40 })
        }
        const a: P = [44 + 2 * 40, 380]
        const b: P = [44 + 6 * 40 + 18, 450]
        for (const [x, y] of [a, b]) cake(g, x, y, 0.32, 1500, 1)
        carrow(g, [a[0] + 20, a[1] - 30], [b[0] - 20, b[1] - 34], -30, { d: 1900 })
      },
      netz(g) {
        // jede Verbindung ein Paar – alle 253 werden nacheinander gezogen
        pairCircle(g, 180, 480, 140, 23, 0, { dAll: 400 })
      },
      belegt(g) {
        // 365 Tage als Felder: jede neue Person braucht ein noch freies Feld
        dayGrid(g, 365, 0)
        let seed = 11
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        const used = new Set<number>()
        for (let k = 0; k < 22; k++) {
          let i = Math.floor(rnd() * 365)
          while (used.has(i)) i = (i + 1) % 365
          used.add(i)
          hatch(g, RR(31 + (i % 25) * 12, 331 + Math.floor(i / 25) * 18, 10, 16, 1), 800 + k * 90, true)
        }
      },
      torte(g) {
        // gut die Hälfte: Kreis zu 51 % schraffiert
        ink(g, E(180, 470, 120), { w: 3, t: 700 })
        hatch(g, [[180, 470], ...E(180, 470, 118, 118, -90, -90 + 0.51 * 360), [180, 470]], 800, true)
        hatch(g, [[180, 470], ...E(180, 470, 118, 118, -90 + 0.51 * 360, 270), [180, 470]], 1000)
        ink(g, L([180, 470], [180, 350]), { w: 2.2, d: 600, t: 150 })
        ink(g, L([180, 470], [180 + Math.cos(rad(-90 + 0.51 * 360)) * 120, 470 + Math.sin(rad(-90 + 0.51 * 360)) * 120]), { w: 2.2, d: 700, t: 150 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { party: {} } },
      { t: T('Schätz mal: Wie viele Menschen müssen in einem Raum sein, damit es **wahrscheinlich** ist, dass zwei am selben Tag Geburtstag haben?', 64), gfx: { kalender: {} } },
      { t: T('Viele tippen auf 180 – die Hälfte von 365. Die richtige Antwort ist erstaunlich klein: **23**.', 64), gfx: { gruppe: {} } },
      { t: T('Bei 23 Leuten liegt die Chance schon bei gut **50 Prozent**. Bei 70 Leuten sind es 99,9 Prozent.', 64), gfx: { kurve: {} } },
      { t: T('Warum so wenige? Weil es nicht um **deinen** Geburtstag geht, sondern um irgendein beliebiges Paar im Raum.', 64), gfx: { du: {} } },
      { t: T('Bei 23 Leuten gibt es nämlich **253 Paare** – und jedes Paar ist eine eigene Chance auf einen Treffer.', 64), gfx: { netz: {} } },
      { t: T('Jedes Kästchen hier steht für ein Paar. Das sind **viel mehr** Gelegenheiten, als das Bauchgefühl erwartet.', 64), gfx: { paare: {} } },
      { t: T('Am leichtesten rechnet man **rückwärts**: Wie wahrscheinlich ist es, dass alle verschiedene Geburtstage haben?', 64), gfx: { kalender: {} } },
      { t: T('Die zweite Person braucht einen anderen Tag als die erste: 364 von 365. Die dritte: **363 von 365**. Und so weiter.', 64), gfx: { belegt: {} } },
      { t: T('Multipliziert für 23 Personen ergibt das knapp **49 Prozent**. Zu 51 Prozent teilen also mindestens zwei einen Tag.', 64), gfx: { torte: {} } },
      { t: T('Willst du dagegen jemanden mit **deinem** Geburtstag treffen, brauchst du für 50 Prozent rund 253 Leute.', 64), gfx: { zahl253: {} } },
      { t: T('Im Fußball stehen genau 23 Menschen auf dem Platz: 22 Spieler plus Schiedsrichter. In etwa **jedem zweiten** Spiel teilen zwei einen Geburtstag.', 64), gfx: { feld: {} } },
      { t: T('Bei der WM 2014 hatte jedes Team 23 Spieler. Tatsächlich gab es in **16 von 32** Mannschaften ein Geburtstagspaar.', 64), gfx: { wm: {} } },
      { t: T('Die Zahl der Paare wächst ungefähr mit dem **Quadrat** der Personen. Genau das unterschätzt unser Gefühl.', 64), gfx: { wachstum: {} } },
      { t: T('Auch in der Computersicherheit zählt das: Kurze Prüfsummen liefern viel früher **Doppelte** als gedacht – man spricht vom Geburtstagsangriff.', 64), gfx: { pruefsumme: {} } },
      { t: T('Darum wirken auch Alltagszufälle so unglaublich: Es gibt **unzählige Gelegenheiten** für irgendeinen Zufall.', 64), gfx: { du: {} } },
      { t: T('Und ab 367 Personen ist es **sicher**: Es gibt nur 366 mögliche Geburtstage – einer muss doppelt sein.', 64), gfx: { sicher: {} } },
      { t: T('23 Leute reichen – weil **jeder mit jedem** zählt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Schon bei 23 Personen haben mit über 50 % zwei denselben Geburtstag.', 'Grund: 23 Personen bilden 253 Paare – jedes ist eine Chance.', 'Für jemanden mit deinem Geburtstag bräuchte es dagegen rund 253 Leute.'],
    sources: ['Feller 1968: An Introduction to Probability Theory, Bd. 1', 'BBC News 2014: World Cup birthday paradox', 'Mises 1939: Über Aufteilungs- und Besetzungswahrscheinlichkeiten'],
  },
  {
    id: 'test-positiv',
    area: 'DENK',
    day: 54,
    hook: 'Ein Test ist zu 99 Prozent genau – und du bist trotzdem wahrscheinlich gesund?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [],
    draw: {
      test(g) {
        // Schnelltest: Tropfen fällt in die Mulde, die Flüssigkeit läuft, Kontroll- und Testlinie erscheinen
        cassette(g, 180, 330, 1.4, 0, true)
        const pip: P[] = [[96, 150], [104, 150], [104, 230], [100, 250], [96, 230], [96, 150]]
        ink(g, pip, { w: 2, d: 300, t: 300 })
        ink(g, E(100, 140, 10, 14), { w: 2.2, d: 400, t: 200 })
        hatch(g, E(100, 140, 9, 12), 500, true)
        const dr = glide(g, 0, 50, { ms: 700, d: 900 })
        drop(dr, 101, 258, 0.3, 800)
        flow(g, L([102, 330], [254, 330]), { n: 4, ms: 1600, d: 1300, r: 1.6 })
      },
      menge(g) {
        // 1000 Menschen als Punkte; x1 der eine Kranke, x2 rund zehn Fehlalarme
        dotgrid(g, 30, 340, 40, 25, 7.7, 2.2)
        const sick = st(g, 'x1', '--o: 184px 425px')
        ball(sick, 184, 425, 6, { fill: 'dicht', t: 0, w: 1.6 })
        ripple(sick, 184, 425, 6, 24, { n: 2, ms: 1600, w: 1 })
        const fa = st(g, 'x2', '--o: 180px 420px')
        ;[[61, 371], [130, 348], [253, 394], [299, 456], [92, 463], [200, 494], [315, 348], [146, 509], [38, 417], [269, 517]].forEach(([x, y]) => ink(fa, E(x, y, 6), { w: 1.8, t: 0 }))
      },
      genau(g) {
        // links 100 Kranke: 99 erkannt; rechts 100 Gesunde: 1 Fehlalarm
        hundred(g, 36, 380, 99, 0)
        hundred(g, 206, 380, 1, 400, true)
        fig(g, 90, 360, 1.4, { d: 200 })
        fig(g, 260, 360, 1.4, { d: 500 })
        cassette(g, 90, 540 + 60, 0.6, 1600, true)
        cassette(g, 260, 540 + 60, 0.6, 1800, true)
      },
      gefuehl(g) {
        // jemand hält den positiven Test und grübelt
        head(g, 180, 420, 1.1, 0, { neck: true })
        cassette(g, 180, 600, 0.9, 600, true)
        for (const k of [-1, 1]) ink(g, B([180 + k * 110, 560], [180 + k * 100, 580], [180 + k * 86, 596], [180 + k * 80, 600]), { w: 2.6, d: 800, t: 200 })
        bubble(g, 260, 300, 80, 60, 'l', 900)
        question(g, 300, 336, 0.6, 1200)
      },
      ergebnis(g) {
        // elf positiv Getestete: einer ist krank, zehn sind gesund
        for (let i = 0; i < 11; i++) {
          const x = 30 + i * 30
          fig(g, x, 600, 2, { d: i * 80 })
          if (i === 5) hatch(g, RR(x - 6, 560, 12, 18, 3), 900, true)
          ink(g, RR(x - 10, 440, 20, 30, 3), { w: 1.4, d: 600 + i * 60, t: 100 })
          ink(g, L([x - 3, 446], [x - 3, 464]), { w: 2, d: 900 + i * 60, t: 60 })
          ink(g, L([x + 4, 446], [x + 4, 464]), { w: 2, d: 1000 + i * 60, t: 60 })
        }
        const p = pop(g, 1600, '50% 50%')
        ink(p, E(180, 560, 18, 52), { w: 2.2, t: 0 })
      },
      haeufiger(g) {
        // jede zehnte Person krank: 40 dunkle Punkte unter 400, nur 4 Fehlalarme dazwischen
        for (let i = 0; i < 400; i++) dot(g, 36 + (i % 20) * 15.4, 340 + Math.floor(i / 20) * 15, i % 10 === 3 ? 4.6 : 2.2, Math.floor(i / 20) * 40 + (i % 10 === 3 ? 800 : 0))
        const fa = pop(g, 2000, '50% 50%')
        ;[[2, 1], [15, 6], [8, 12], [17, 17]].forEach(([c, r]) => ink(fa, E(36 + c * 15.4, 340 + r * 15, 6.5), { w: 1.6, t: 0 }))
      },
      bayes(g) {
        // Bayes' Gedankenexperiment: Kugeln rollen auf einen Tisch, aus ihrer Lage schließt man auf die erste
        ink(g, RR(40, 380, 280, 180, 6), { w: 3, t: 700 })
        ink(g, RR(52, 392, 256, 156, 4), { w: 1.2, d: 200, t: 600 })
        dashes(g, L([170, 392], [170, 548]), { w: 1.4, d: 800, dash: 5, gap: 4 })
        ball(g, 170, 470, 9, { d: 900, fill: 'dicht', w: 1.6, t: 100 })
        for (const [x, y, dd] of [[90, 420, 1200], [130, 510, 1400], [230, 430, 1600], [280, 520, 1800], [110, 460, 2000]] as const) {
          const b = glide(g, 0, -30, { ms: 600, d: dd })
          ball(b, x, y + 30, 6, { d: dd - 100, w: 1.4, t: 60 })
        }
        const pg: P[] = [[60, 590], [300, 586], [304, 650], [64, 652], [60, 590]]
        blank(g, pg)
        ink(g, pg, { w: 1.8, d: 600, t: 300 })
        for (let k = 0; k < 3; k++) ink(g, Array.from({ length: 26 }, (_, i) => [74 + i * 8.6, 604 + k * 14 + Math.sin(i * 1.3 + k) * 1.6] as P), { w: 0.8, d: 800 + k * 100, t: 200 })
        const q = wobble(g, { deg: 4, ox: 300, oy: 610, ms: 900, d: 1000 })
        ink(q, L([300, 610], [340, 520]), { w: 1.6, d: 900, t: 200 })
        ink(q, smooth([[340, 520], [330, 548], [316, 580], [304, 606]], 3), { w: 1.2, d: 1000, t: 200 })
      },
      aerzte(g) {
        // acht Ärztinnen und Ärzte mit einem Blatt voller Prozentangaben – die meisten liegen daneben
        ink(g, RR(110, 330, 140, 90, 4), { w: 2, t: 400 })
        for (let k = 0; k < 4; k++) text(g, 140 + (k % 2) * 70, 366 + Math.floor(k / 2) * 34, '%', { anchor: 'middle', size: 22, d: 300 + k * 100 })
        crowd(g, 40, 560, 8, 40, 2.2, 0, 100)
        for (let i = 0; i < 8; i++) {
          if (i < 2) check(g, 40 + i * 40, 610, 0.6, 1000 + i * 80)
          else cross(g, 40 + i * 40, 610, 0.6, 1000 + i * 80)
        }
      },
      haeufig(g) {
        // dieselben mit einem Blatt voller Punkte („1 von 1.000“) – die meisten treffen
        ink(g, RR(110, 330, 140, 90, 4), { w: 2, t: 400 })
        for (let i = 0; i < 60; i++) dot(g, 122 + (i % 12) * 10, 346 + Math.floor(i / 12) * 12, i === 27 ? 3.4 : 1.6, 300 + i * 6)
        crowd(g, 40, 560, 8, 40, 2.2, 0, 100)
        for (let i = 0; i < 8; i++) {
          if (i < 6) check(g, 40 + i * 40, 610, 0.6, 1000 + i * 80)
          else cross(g, 40 + i * 40, 610, 0.6, 1000 + i * 80)
        }
      },
      zweiter(g) {
        // zwei Tests nacheinander, daneben ein Balken, der in zwei Stufen steigt
        cassette(g, 120, 380, 0.8, 0, true)
        cassette(g, 120, 520, 0.8, 1200, true)
        ink(g, RR(270, 330, 40, 290, 6), { w: 2.4, d: 300, t: 500 })
        for (const [frac, dd] of [[0.02, 400], [0.12, 900], [0.9, 2000]] as const) {
          const gr = group(g, 'grow-y', `--d:${dd}ms`)
          hatch(gr, RR(274, 616 - 282 * frac, 32, 282 * frac, 3), dd, true)
        }
        arrow(g, L([210, 380], [262, 560]), { w: 1.6, d: 900, t: 300, head: 7 })
        arrow(g, L([210, 520], [262, 380]), { w: 1.6, d: 2000, t: 300, head: 7 })
      },
      selten(g) {
        // Kamera mit Gesichtserkennung über einer Menge, ein Brief mit Spam-Fähnchen, ein Alarmlicht
        ink(g, RR(30, 340, 80, 50, 6), { w: 2.4, t: 400 })
        ink(g, E(70, 365, 16), { w: 2, d: 200, t: 200 })
        ink(g, E(70, 365, 7), { w: 1.4, d: 300, t: 100 })
        crowd(g, 140, 400, 6, 32, 1.5, 400, 60)
        for (const [x, dd] of [[172, 900], [268, 1000]] as const) dashes(g, RR(x - 10, 342, 20, 24, 2), { w: 1.4, d: dd, dash: 3, gap: 2 })
        letter(g, 60, 500, 100, 800)
        const fl = wobble(g, { deg: 8, ox: 170, oy: 540, ms: 600, d: 1200 })
        ink(fl, L([170, 560], [170, 500]), { w: 2, d: 1100, t: 150 })
        ink(fl, [[170, 500], [200, 510], [170, 520]], { w: 1.8, d: 1200, t: 150 })
        hatch(fl, [[170, 500], [200, 510], [170, 520]], 1300, true)
        ink(g, [[250, 600], [250, 540], ...B([250, 540], [250, 500], [310, 500], [310, 540]).slice(1), [310, 600], [250, 600]], { w: 2.4, d: 1000, t: 400 })
        ink(g, RR(240, 600, 80, 14, 3), { w: 2.2, d: 1100, t: 200 })
        rays(g, 280, 520, 44, 60, 8, 1400)
      },
      ende(g) {
        cassette(g, 180, 470, 1.4, 0, true)
      },
      anteil(g) {
        // einer von elf: ein schmales Stück
        ink(g, E(180, 470, 120), { w: 3, t: 700 })
        for (let k = 0; k < 11; k++) {
          const a = rad(-90 + k * (360 / 11))
          ink(g, L([180, 470], [180 + Math.cos(a) * 120, 470 + Math.sin(a) * 120]), { w: 1, d: 300 + k * 50, t: 100 })
        }
        hatch(g, [[180, 470], ...E(180, 470, 118, 118, -90, -90 + 360 / 11), [180, 470]], 1000, true)
      },
      fragen(g) {
        // drei Fragen als Bilder: wie häufig (Punktefeld), wie oft Fehlalarm (Glocke), wie viele echt (Sieb)
        for (let i = 0; i < 49; i++) dot(g, 40 + (i % 7) * 12, 360 + Math.floor(i / 7) * 12, i === 24 ? 3.6 : 1.6, i * 10)
        const bell = wobble(g, { deg: 10, ox: 180, oy: 350, ms: 300, d: 1000 })
        ink(bell, [[152, 430], ...B([152, 430], [156, 380], [204, 380], [208, 430]).slice(1), [152, 430]], { w: 2.4, d: 600, t: 400 })
        ink(bell, L([140, 432], [220, 432]), { w: 2.2, d: 700, t: 200 })
        dot(bell, 180, 440, 5, 800)
        ink(g, L([180, 380], [180, 360]), { w: 1.8, d: 600, t: 100 })
        ink(g, [[250, 360], [330, 360], [300, 420], [280, 420], [250, 360]], { w: 2.4, d: 900, t: 400 })
        for (let k = 0; k < 6; k++) dot(g, 262 + k * 11, 350, 2.6, 1100 + k * 40)
        const f = glide(g, 0, 70, { ms: 1200, d: 1600, loop: true })
        dot(f, 290, 430, 3.4, 1500)
        for (const x of [90, 180, 290]) ink(g, L([x, 470], [x, 520]), { w: 1, d: 1200, t: 100 })
        for (let k = 0; k < 3; k++) {
          const x = 90 + k * 100
          ink(g, E(x, 560, 26), { w: 2.2, d: 1400 + k * 200, t: 200 })
          text(g, x, 568, String(k + 1), { anchor: 'middle', size: 20, d: 1500 + k * 200 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { test: {} } },
      { t: T('Stell dir eine seltene Krankheit vor: Nur **eine von 1.000** Personen hat sie.', 64), gfx: { menge: {} } },
      { t: T('Ein Test erkennt sie in 99 Prozent der Fälle – und schlägt bei Gesunden nur in **1 Prozent** der Fälle falsch Alarm.', 64), gfx: { genau: {} } },
      { t: T('Dein Test ist positiv. Wie wahrscheinlich bist du krank? Die meisten sagen: **99 Prozent**.', 64), gfx: { gefuehl: {} } },
      { t: T('Rechnen wir mit 1.000 Menschen. Einer ist krank – und der Test findet ihn **fast sicher**.', 64), gfx: { menge: { cls: 'a1' } } },
      { t: T('Von den 999 Gesunden schlägt der Test bei 1 Prozent falsch an. Das sind rund **10 Menschen**.', 64), gfx: { menge: { cls: 'a1 a2' } } },
      { t: T('Positiv getestet sind also etwa **11 Menschen** – aber nur einer davon ist wirklich krank.', 64), gfx: { ergebnis: {} } },
      { t: T('Deine Chance, krank zu sein, liegt damit bei rund **1 zu 11** – etwa 9 Prozent.', 64), gfx: { anteil: {} } },
      { t: T('Der Grund: Die Krankheit ist so selten, dass die Fehlalarme die echten Fälle **zahlenmäßig erdrücken**.', 64), gfx: { ergebnis: {} } },
      { t: T('Das nennt man die **Basisrate**: Wie häufig etwas überhaupt ist, bestimmt mit, was ein Testergebnis bedeutet.', 64), gfx: { menge: { cls: 'a1 a2' } } },
      { t: T('Umgekehrt gilt: Bei einer **häufigen** Krankheit – sagen wir jede zehnte Person – ist ein positiver Test sehr verlässlich.', 64), gfx: { haeufiger: {} } },
      { t: T('Die Rechnung geht auf den Pfarrer Thomas Bayes zurück und heißt heute **Satz von Bayes**.', 64), gfx: { bayes: {} } },
      { t: T('Sogar Ärztinnen und Ärzte verschätzen sich hier oft. In Studien lagen viele **weit daneben**, wenn man ihnen Prozentwerte gab.', 64), gfx: { aerzte: {} } },
      { t: T('Mit **natürlichen Häufigkeiten** – „1 von 1.000“, „10 von 999“ – fanden die meisten die richtige Antwort.', 64), gfx: { haeufig: {} } },
      { t: T('Darum testet man nach einem positiven Ergebnis **ein zweites Mal**. Die neue Ausgangslage sind jetzt 9 Prozent, nicht 0,1.', 64), gfx: { zweiter: {} } },
      { t: T('Ist auch der zweite, unabhängige Test positiv, steigt die Wahrscheinlichkeit auf rund **90 Prozent**.', 64), gfx: { zweiter: {} } },
      { t: T('Dasselbe gilt für Gesichtserkennung oder Spamfilter: Bei **seltenen** Ereignissen sind viele Alarme falsch.', 64), gfx: { selten: {} } },
      { t: T('Drei Fragen helfen bei jedem Test: Wie **häufig** ist es? Wie oft schlägt er falsch an? Wie viele Positive sind echt?', 64), gfx: { fragen: {} } },
      { t: T('Ein Test ist nur so gut wie die **Basisrate**, auf die er trifft.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei einer Krankheit 1 : 1.000 und 1 % Fehlalarmen sind ~10 von 11 Positiven gesund.', 'Die Basisrate entscheidet, was ein Testergebnis bedeutet (Satz von Bayes).', 'Natürliche Häufigkeiten statt Prozente machen die Rechnung leicht.'],
    sources: ['Gigerenzer & Hoffrage 1995, Psychological Review 102', 'Gigerenzer 2002: Das Einmaleins der Skepsis', 'Bayes 1763, Philosophical Transactions 53'],
  },
  {
    id: 'ueberlebende',
    area: 'DENK',
    day: 54,
    hook: 'Wo panzert man ein Flugzeug: dort, wo die Einschusslöcher sind?',
    mood: 'dunkel',
    ambience: 'wind',
    images: [],
    draw: {
      flieger(g) {
        // durchlöcherter Bomber auf dem Heimflug zwischen Wolken und Flakwölkchen
        cloud(g, 60, 120, 0.6, 0)
        cloud(g, 310, 380, 0.6, 200)
        const pl = wobble(g, { dy: 4, deg: 1, ox: 180, oy: 240, ms: 2600, d: 1200 })
        bomber(pl, 180, 240, 1, 300)
        for (const [x, y] of [[-110, 6], [-70, 2], [90, 4], [130, 8], [0, 40], [-4, 90], [6, -60], [30, 120], [-36, 122]] as const) dot(pl, 180 + x, 240 + y, 3.2, 1200 + x * 2)
        for (const [x, y, dd] of [[60, 340, 1400], [300, 120, 1700], [280, 300, 2000]] as const) {
          const p = pop(g, dd, '50% 50%')
          const pf: P[] = smooth(Array.from({ length: 9 }, (_, k) => [x + Math.cos(rad(k * 45)) * (14 + (k % 2) * 5), y + Math.sin(rad(k * 45)) * (12 + (k % 2) * 4)] as P), 3)
          hatch(p, pf, 0, true)
          ink(p, pf, { w: 1.6, t: 0 })
        }
      },
      loecher(g) {
        bomber(g, 180, 470, 1)
        for (const [x, y] of [[-130, 6], [-110, 8], [-80, 2], [-30, -6], [40, -4], [80, 6], [120, 4], [140, 8], [0, 60], [-4, 100], [6, 80], [2, 30], [-30, 124], [30, 126]] as const) dot(g, 180 + x, 470 + y, 3.5, 900 + (x + 150) * 4)
        const arm = st(g, 'f1')
        hatch(arm, [[30, 470], [166, 446], [166, 480], [30, 486]], 0, true)
        hatch(arm, [[330, 470], [194, 446], [194, 480], [330, 486]], 0, true)
        const real = st(g, 'f2')
        for (const x of [-100, -55, 55, 100]) hatch(real, RR(180 + x - 8, 436, 16, 30, 6), 0, true)
        hatch(real, RR(166, 360, 28, 50, 12), 0, true)
      },
      wald(g) {
        // Schreibtisch mit Lampe: Skizze eines Bombers mit Trefferpunkten, Formeln, Bleistift
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        for (const x of [40, 320]) ink(g, L([x, 600], [x, 650]), { w: 2.6, d: 200, t: 200 })
        const pg: P[] = [[60, 470], [230, 462], [236, 594], [64, 598], [60, 470]]
        blank(g, pg)
        ink(g, pg, { w: 2, d: 300, t: 400 })
        bomber(g, 120, 530, 0.3, 500)
        for (const [x, y] of [[100, 530], [140, 532], [118, 556], [122, 500]] as const) dot(g, x, y, 1.6, 1100)
        for (let k = 0; k < 4; k++) ink(g, Array.from({ length: 10 }, (_, i) => [170 + i * 5.6, 490 + k * 22 + Math.sin(i * 1.7 + k) * 2] as P), { w: 0.9, d: 1200 + k * 100, t: 150 })
        ink(g, [[260, 600], [260, 420], [300, 380]], { w: 2.4, d: 600, t: 400 })
        ink(g, [[280, 360], [330, 380], [312, 410], [280, 360]], { w: 2.2, d: 800, t: 200 })
        hatch(g, [[280, 360], [330, 380], [312, 410], [280, 360]], 900, true)
        for (let k = 0; k < 3; k++) ink(g, L([306 + k * 6, 404], [250 + k * 20, 470]), { w: 0.8, d: 1100, t: 200 })
        ink(g, L([200, 600], [244, 560]), { w: 3, d: 1400, t: 150 })
        question(g, 110, 400, 0.6, 1700)
      },
      fehlt(g) {
        // Treffer im Motor: das Flugzeug zieht eine Rauchfahne und stürzt ab – es kommt nie zurück
        const m = glide(g, 60, 150, { ms: 4000, d: 1000 })
        const r = mk('g', { transform: 'rotate(30 180 420)' }, m)
        bomber(r, 180, 420, 0.6, 0)
        for (let k = 0; k < 5; k++) {
          const w = wobble(g, { dx: 4, dy: -3, ms: 900 + k * 120, d: 1200 })
          const x = 120 - k * 20
          const y = 380 - k * 22
          const pf: P[] = smooth(Array.from({ length: 9 }, (_, j) => [x + Math.cos(rad(j * 45)) * (10 + k * 3), y + Math.sin(rad(j * 45)) * (8 + k * 2)] as P), 3)
          hatch(w, pf, 900 + k * 120, k < 2)
          ink(w, pf, { w: 1.4, d: 800 + k * 120, t: 150 })
        }
        flame(g, 140, 400, 0.4, 700)
        ink(g, L([20, 640], [340, 640]), { w: 2.2, d: 200, t: 400 })
      },
      filter(g) {
        // Trichter als Filter: viele Flugzeuge starten, nur wenige kommen unten heraus
        ink(g, [[50, 360], [310, 360], [200, 480], [200, 560], [160, 560], [160, 480], [50, 360]], { w: 3, t: 900 })
        for (let i = 0; i < 10; i++) {
          const f = glide(g, (180 - (60 + i * 24)) * 0.5, 80, { ms: 2200, d: 400 + i * 150, loop: true })
          bomber(f, 60 + i * 24, 320, 0.08, 200 + i * 50)
        }
        for (const [x, y] of [[90, 400], [270, 400], [130, 440], [230, 440], [180, 420]] as const) cross(g, x, y, 0.4, 1400 + x * 2)
        for (let k = 0; k < 2; k++) {
          const f = glide(g, 0, 50, { ms: 2200, d: 1600 + k * 800, loop: true })
          bomber(f, 180, 580, 0.08, 1500)
        }
      },
      haeuser(g) {
        // zwei alte Häuser stehen noch; dazwischen die gestrichelten Umrisse abgerissener, davor Schutt
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        house(g, 30, 598, 80, 200)
        house(g, 250, 598, 80, 400)
        for (const x of [120, 186]) dashes(g, [[x, 598], [x, 530], [x + 30, 506], [x + 58, 530], [x + 58, 598]], { w: 1.4, d: 800, dash: 5, gap: 4 })
        const rub: P[] = [[124, 598], [140, 584], [160, 590], [184, 578], [210, 588], [236, 598]]
        hatch(g, [...rub, [124, 598]], 1300, true)
        ink(g, rub, { w: 1.8, d: 1200, t: 300 })
        for (const x of [60, 290]) for (let k = 0; k < 3; k++) ink(g, L([x - 14 + k * 14, 598 - 56], [x - 14 + k * 14, 598 - 50]), { w: 1, d: 900, t: 50 })
      },
      erfolg(g) {
        // einer steht auf einem Stapel Geld; hinter ihm verblassen die vielen, die es genauso versucht haben
        for (let i = 0; i < 18; i++) {
          const f = st(g, '', 'opacity: 0.3')
          fig(f, 160 + (i % 6) * 32, 520 + Math.floor(i / 6) * 50, 1.2, { d: 700 + i * 40 })
        }
        for (let k = 0; k < 5; k++) {
          ink(g, RR(30, 600 - k * 14, 90, 12, 2), { w: 1.8, d: 200 + k * 60, t: 150 })
          ink(g, E(75, 606 - k * 14, 4), { w: 1, d: 300 + k * 60, t: 60 })
        }
        fig(g, 75, 530, 3, { d: 600, arms: 'up' })
        rays(g, 75, 420, 16, 34, 8, 1200)
      },
      fonds(g) {
        // viele Fondsverläufe: die schlechten brechen ab (gestrichelt, Kreuz), nur die überlebenden laufen weiter
        axes(g, 40, 620, 330, 330, {})
        let seed = 9
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let k = 0; k < 9; k++) {
          const dead = k % 3 !== 0
          const end = dead ? 0.3 + rnd() * 0.4 : 1
          const pts: P[] = []
          let y = 520 + (rnd() - 0.5) * 30
          for (let i = 0; i <= 40 * end; i++) {
            y += (rnd() - (dead ? 0.42 : 0.62)) * 10
            pts.push([46 + i * 7, Math.max(340, Math.min(610, y))])
          }
          if (dead) {
            dashes(g, pts, { w: 1, d: 300 + k * 120, dash: 3, gap: 3 })
            const last = pts[pts.length - 1]
            cross(g, last[0], last[1], 0.25, 1200 + k * 100)
          } else ink(g, pts, { w: 2.4, d: 300 + k * 120, t: 800 })
        }
      },
      katze(g) {
        // Hochhaus, eine Katze fällt mit gespreizten Beinen; daneben die Tierklinik
        ink(g, RR(230, 300, 90, 330, 4), { w: 2.6, t: 700 })
        for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) ink(g, RR(244 + c * 36, 318 + r * 50, 24, 30, 3), { w: 1.6, d: 300 + (r * 2 + c) * 40, t: 150 })
        const cf = glide(g, -10, 120, { ms: 2000, d: 900, loop: true })
        const body: P[] = smooth([[170, 370], [190, 362], [214, 366], [220, 374], [200, 382], [176, 380], [170, 370]], 3)
        blank(cf, body)
        hatch(cf, body, 800)
        ink(cf, body, { w: 2, d: 700, t: 200 })
        ink(cf, E(222, 368, 7), { w: 1.8, d: 800, t: 100 })
        for (const [a, b] of [[[176, 378], [164, 392]], [[186, 380], [184, 396]], [[204, 380], [210, 396]], [[214, 376], [228, 388]], [[170, 370], [150, 356]]] as const) ink(cf, L(a as P, b as P), { w: 1.6, d: 900, t: 80 })
        ink(g, L([20, 630], [340, 630]), { w: 2.4, d: 200, t: 400 })
        const vet: P[] = [[30, 630], [30, 560], [80, 530], [130, 560], [130, 630]]
        ink(g, vet, { w: 2.4, d: 500, t: 400 })
        for (const [a, b] of [[[74, 572], [86, 572]], [[80, 566], [80, 578]]] as const) ink(g, L(a as P, b as P), { w: 3, d: 900, t: 80 })
        ink(g, RR(62, 594, 36, 36, 2), { w: 1.8, d: 800, t: 150 })
      },
      musik(g) {
        // Grammofon spielt die bekannten Hits, daneben verblassen die vielen vergessenen Lieder
        ink(g, RR(30, 540, 120, 40, 4), { w: 2.6, t: 400 })
        ink(g, E(90, 538, 50, 8), { w: 2, d: 200, t: 300 })
        const rec = spin(g, 90, 536, 2000, 600)
        ink(rec, E(90, 536, 40, 6, 0, 300), { w: 1, d: 500, t: 200 })
        ink(g, [[140, 536], [140, 470], [120, 440]], { w: 2.2, d: 400, t: 300 })
        ink(g, [...B([120, 440], [100, 410], [80, 350], [40, 330]), ...B([40, 330], [100, 330], [150, 360], [130, 440]).slice(1)], { w: 2.6, d: 500, t: 400 })
        for (const [x, y, dd] of [[70, 300, 900], [120, 280, 1100]] as const) {
          const n = glide(g, 20, -30, { ms: 2400, d: dd, loop: true })
          note(n, x, y, 1, dd - 100)
        }
        for (let i = 0; i < 9; i++) {
          const f = st(g, '', 'opacity: 0.28')
          note(f, 210 + (i % 3) * 44, 400 + Math.floor(i / 3) * 80, 0.8, 600 + i * 80)
        }
      },
      studien(g) {
        // oben im Regal die veröffentlichten, auffälligen Studien; unten die Schublade mit den vielen ohne Effekt
        ink(g, L([40, 440], [320, 440]), { w: 2.6, t: 400 })
        for (let i = 0; i < 3; i++) {
          ink(g, RR(70 + i * 80, 340, 56, 96, 3), { w: 2.4, d: 200 + i * 100, t: 300 })
          hatch(g, RR(74 + i * 80, 344, 48, 22, 2), 600 + i * 100, true)
          plot(g, 76 + i * 80, 420, 44, 40, (t) => t * t, { d: 800 + i * 100, t: 300, w: 1.6 })
        }
        ink(g, RR(40, 480, 280, 150, 6), { w: 2.8, d: 400, t: 500 })
        const dr = glide(g, 0, 20, { ms: 900, d: 1000 })
        ink(dr, RR(54, 500, 252, 120, 4), { w: 2.2, d: 600, t: 400 })
        ink(dr, RR(150, 520, 60, 10, 4), { w: 2, d: 700, t: 150 })
        for (let k = 0; k < 14; k++) ink(dr, L([66 + k * 17, 540], [66 + k * 17, 610]), { w: 1.2, d: 900 + k * 30, t: 80 })
      },
      startups(g) {
        // einer im Rampenlicht mit Mikrofonen; neun gescheiterte im Dunkeln
        for (let i = 0; i < 9; i++) {
          const f = st(g, '', 'opacity: 0.3')
          fig(f, 150 + (i % 5) * 38, 600 - Math.floor(i / 5) * 10, 1.8, { d: i * 60 })
        }
        const beam: P[] = [[60, 300], [90, 300], [130, 600], [20, 600]]
        hatch(g, beam, 400)
        ink(g, L([60, 300], [20, 600]), { w: 1, d: 300, t: 300 })
        ink(g, L([90, 300], [130, 600]), { w: 1, d: 300, t: 300 })
        fig(g, 75, 600, 2.4, { d: 600, arms: 'up' })
        for (const [x, a] of [[110, -30], [130, -50]] as const) {
          ink(g, L([x, 540], [x + Math.cos(rad(a + 180)) * 30, 540 + Math.sin(rad(a + 180)) * 30]), { w: 1.6, d: 900, t: 150 })
          ink(g, E(x - Math.cos(rad(a)) * 32, 540 - Math.sin(rad(a)) * 32, 4, 6), { w: 1.6, d: 1000, t: 100 })
        }
      },
      frage(g) {
        // Lupe über einer leeren, gestrichelten Fläche: das, was fehlt
        for (let i = 0; i < 12; i++) if (![5, 6, 9].includes(i)) bomber(g, 60 + (i % 4) * 80, 360 + Math.floor(i / 4) * 90, 0.12, i * 60)
        for (const i of [5, 6, 9]) dashes(g, E(60 + (i % 4) * 80, 360 + Math.floor(i / 4) * 90, 22), { w: 1.4, d: 900, dash: 4, gap: 4 })
        lens(g, 180, 450, 60, 1200)
      },
      ende(g) {
        bomber(g, 180, 500, 0.9, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { flieger: {} } },
      { t: T('Im Zweiten Weltkrieg untersuchten US-Fachleute Bomber, die von Einsätzen **zurückkamen**. Viele waren von Kugeln durchlöchert.', 64), gfx: { loecher: {} } },
      { t: T('Die Löcher häuften sich an **Flügeln und Rumpf**. Wenige Treffer gab es an den Motoren und am Cockpit.', 64), gfx: { loecher: {} } },
      { t: T('Die naheliegende Idee: Dort, wo die meisten Löcher sind, braucht es **mehr Panzerung**.', 64), gfx: { loecher: { cls: 'a1' } } },
      { t: T('Der Statistiker **Abraham Wald** widersprach. Er schaute auf das, was in den Daten fehlte.', 64), gfx: { wald: {} } },
      { t: T('Bomber, die an den Motoren getroffen wurden, **kamen gar nicht zurück**. Man bekam sie nie zu sehen.', 64), gfx: { fehlt: {} } },
      { t: T('Die Löcher zeigen also, wo ein Flugzeug Treffer **aushält**. Panzern muss man die Stellen ohne Löcher.', 64), gfx: { loecher: { cls: 'a2' } } },
      { t: T('Das heißt **Überlebensbias**: Wir sehen nur, was einen Filter überstanden hat – und ziehen daraus falsche Schlüsse.', 64), gfx: { filter: {} } },
      { t: T('Wald brauchte dafür keine neuen Daten – nur einen **anderen Blick** auf dieselben Löcher.', 64), gfx: { loecher: { cls: 'a2' } } },
      { t: T('„Früher wurde **solider gebaut**.“ Wir sehen nur die alten Häuser, die noch stehen. Die schlechten wurden längst abgerissen.', 64), gfx: { haeuser: {} } },
      { t: T('„Früher war die **Musik besser**.“ Wir erinnern uns an die Hits – die vielen vergessenen Lieder hört heute niemand mehr.', 64), gfx: { musik: {} } },
      { t: T('„Er hat das Studium abgebrochen und wurde **Milliardär**.“ Die vielen Abbrecher ohne Erfolg schreiben keine Bücher.', 64), gfx: { erfolg: {} } },
      { t: T('Ratgeber befragen Erfolgreiche nach ihren Gewohnheiten – aber nicht die Gescheiterten mit **denselben** Gewohnheiten.', 64), gfx: { erfolg: {} } },
      { t: T('Bei Geldanlagen zeigen Statistiken oft nur Fonds, die es **noch gibt**. Die schlechten wurden still geschlossen.', 64), gfx: { fonds: {} } },
      { t: T('Auch Forschung hat diesen Filter: Studien mit **spektakulären** Ergebnissen werden eher veröffentlicht als solche ohne Effekt.', 64), gfx: { studien: {} } },
      { t: T('Erfolgreiche Start-ups kommen in die Nachrichten. Die vielen **gescheiterten** daneben sieht kaum jemand.', 64), gfx: { startups: {} } },
      { t: T('Katzen überleben Stürze aus großer Höhe erstaunlich oft, hieß es nach einer Studie. Doch tote Katzen kommen seltener **in die Tierklinik**.', 64), gfx: { katze: {} } },
      { t: T('Die Frage, die hilft: **Was sehe ich nicht?** Wer ist unterwegs aus den Daten herausgefallen?', 64), gfx: { frage: {} } },
      { t: T('Achte auf die Flugzeuge, die **nicht zurückkamen**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Zurückgekehrte Bomber zeigten, wo Treffer verkraftbar sind – nicht, wo man panzern muss.', 'Überlebensbias: Wir sehen nur, was einen Filter überstanden hat.', 'Hilfreiche Frage: Was fehlt in den Daten?'],
    sources: ['Wald 1943: A Method of Estimating Plane Vulnerability (SRG, Columbia)', 'Mangel & Samaniego 1984, Journal of the American Statistical Association 79', 'Whitney & Mehlhaff 1987, JAVMA 191 (Sturz-Katzen)'],
  },
  {
    id: 'mittelwert',
    area: 'DENK',
    day: 54,
    hook: 'Warum wird es nach einem Rekord meistens wieder schlechter?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [],
    draw: {
      spitze(g) {
        // Leistungskurve mit Rekordspitze (Pokal) – danach geht es zurück Richtung Durchschnitt
        axes(g, 30, 420, 330, 100)
        dashes(g, L([40, 320], [320, 320]), { w: 1.2, d: 300, dash: 5, gap: 4 })
        const pts: P[] = [[40, 330], [70, 310], [100, 336], [130, 300], [160, 324], [190, 160], [220, 300], [250, 330], [280, 316], [320, 326]]
        ink(g, pts, { w: 3, d: 500, t: 1400 })
        pts.forEach(([x, y], i) => dot(g, x, y, i === 5 ? 6 : 3, 500 + i * 140))
        const cup: P[] = [[176, 112], [204, 112], ...B([204, 112], [204, 132], [196, 140], [190, 142]).slice(1), [190, 148], [198, 154], [182, 154], [190, 148], [190, 142], ...B([190, 142], [184, 140], [176, 132], [176, 112]).slice(1)]
        ink(g, cup, { w: 2, d: 1400, t: 300 })
        for (const k of [-1, 1]) ink(g, B([190 + k * 14, 116], [190 + k * 24, 116], [190 + k * 24, 130], [190 + k * 12, 132]), { w: 1.4, d: 1500, t: 150 })
        rays(g, 190, 130, 28, 40, 8, 1600)
        arrow(g, B([200, 172], [214, 220], [222, 260], [222, 290]), { w: 2, d: 1800, t: 300, head: 7 })
      },
      lob(g) {
        // Fluglehrer lobt nach der Traumlandung (Daumen hoch), die nächste Landung ist holpriger
        ink(g, L([20, 600], [340, 600]), { w: 2.6, t: 400 })
        dashes(g, L([40, 612], [320, 612]), { w: 2, d: 200, dash: 14, gap: 10 })
        fig(g, 70, 598, 3, { d: 300 })
        fig(g, 140, 598, 2.6, { d: 400 })
        bubble(g, 20, 350, 110, 70, 'l', 600)
        ink(g, [[60, 396], [60, 380], [66, 366], [72, 370], [70, 380], [86, 380], [88, 396], [60, 396]], { w: 2, d: 900, t: 300 })
        ink(g, B([190, 420], [240, 470], [260, 520], [270, 560]), { w: 1.4, d: 1100, t: 400 })
        ink(g, [[270, 560], [280, 590], [290, 572], [300, 598], [310, 586], [330, 598]], { w: 2.2, d: 1400, t: 400 })
        jet(g, 190, 410, 0.22, 1000)
      },
      tadel(g) {
        // nach der missglückten Landung schimpft der Lehrer (Zackenblase), die nächste Landung ist glatter
        ink(g, L([20, 600], [340, 600]), { w: 2.6, t: 400 })
        dashes(g, L([40, 612], [320, 612]), { w: 2, d: 200, dash: 14, gap: 10 })
        fig(g, 70, 598, 3, { d: 300, arms: 'up' })
        fig(g, 140, 598, 2.6, { d: 400 })
        const zb: P[] = Array.from({ length: 25 }, (_, k) => {
          const a = rad(k * 15)
          const r = k % 2 ? 46 : 58
          return [76 + Math.cos(a) * r, 390 + Math.sin(a) * r * 0.6] as P
        })
        ink(g, zb, { w: 2.2, d: 600, t: 400 })
        bolt(g, [[70, 370], [60, 392], [76, 392], [64, 414]], 900, 2.4)
        ink(g, B([190, 420], [250, 470], [290, 540], [330, 596]), { w: 2, d: 1100, t: 500 })
        jet(g, 190, 410, 0.22, 1000)
        check(g, 300, 520, 0.6, 1600)
      },
      streuung(g) {
        // Versuche schwanken um den Durchschnitt: ein Glückstreffer (Sonne) und ein Pechtag (Gewitterwolke)
        axes(g, 30, 620, 330, 320, {})
        dashes(g, L([40, 470], [320, 470]), { w: 1.4, d: 400 })
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        const ys: number[] = []
        for (let i = 0; i < 18; i++) ys.push(470 + (rnd() - 0.5) * 120)
        ys[6] = 350
        ys[7] = 470 - (rnd() - 0.5) * 30
        ys[12] = 590
        ys[13] = 476
        ys.forEach((y, i) => dot(g, 50 + i * 15.5, y, i === 6 || i === 12 ? 6 : 3.5, 600 + i * 60))
        sunDisk(g, 143, 344, 10, 1700)
        cloud(g, 236, 600, 0.3, 1800, true)
        carrow(g, [148, 356], [158, 460], -20, { d: 2000 })
        carrow(g, [242, 578], [256, 482], 20, { d: 2200 })
      },
      cover(g) {
        // Titelblatt mit Sportler, danach knickt die Saisonkurve ein
        ink(g, RR(40, 330, 150, 210, 6), { w: 3, t: 700 })
        hatch(g, RR(46, 336, 138, 24, 3), 300, true)
        fig(g, 115, 510, 4.2, { d: 400, arms: 'up' })
        for (let k = 0; k < 8; k++) ink(g, L([150 + k * 4, 508], [150 + k * 4, 530]), { w: k % 3 ? 1 : 2, d: 900 + k * 20, t: 50 })
        for (let k = 0; k < 2; k++) ink(g, L([54, 380 + k * 12], [100, 380 + k * 12]), { w: 2, d: 800 + k * 60, t: 100 })
        axes(g, 210, 600, 340, 380, {})
        ink(g, [[216, 420], [240, 430], [264, 470], [290, 500], [320, 510]], { w: 2.6, d: 1100, t: 600 })
        dot(g, 216, 420, 5, 1100)
      },
      arzt(g) {
        // Beschwerden schwanken; zum Arzt geht man am Gipfel – danach sinken sie ohnehin
        axes(g, 30, 600, 330, 320, { xl: 'Zeit', yl: 'Beschwerden' })
        plot(g, 36, 596, 280, 240, (t) => 0.4 + 0.5 * Math.exp(-Math.pow((t - 0.3) / 0.12, 2)) + 0.05 * Math.sin(t * 30), { d: 400 })
        const x = 36 + 0.3 * 280
        const y = 596 - 0.93 * 240
        ink(g, RR(x - 12, y - 40, 24, 24, 3), { w: 2, d: 1300, t: 150 })
        for (const [a, b] of [[[x - 7, y - 28], [x + 7, y - 28]], [[x, y - 35], [x, y - 21]]] as const) ink(g, L(a as P, b as P), { w: 3, d: 1400, t: 80 })
        dot(g, x, y, 5, 1300)
      },
      kontrolle(g) {
        // zwei Gruppen: mit Mittel und mit Scheinmittel – beiden geht es besser, nur die Differenz zählt
        for (const [x, real] of [[90, true], [250, false]] as const) {
          crowd(g, x - 50, 600, 4, 32, 1.6, real ? 0 : 300, 80)
          ink(g, RR(x - 14, 400, 28, 40, 6), { w: 2, d: 500, t: 200 })
          ink(g, RR(x - 16, 392, 32, 10, 3), { w: 1.8, d: 600, t: 100 })
          if (real) hatch(g, RR(x - 12, 412, 24, 26, 4), 700, true)
          arrow(g, L([x + 50, 560], [x + 50, real ? 470 : 500]), { w: 2.4, d: 900, t: 300, head: 8 })
        }
        dashes(g, L([150, 470], [300, 470]), { w: 1, d: 1300, dash: 4, gap: 3 })
        arrow(g, L([316, 500], [316, 474]), { w: 1.6, d: 1500, t: 150, head: 5 })
        arrow(g, L([316, 474], [316, 500]), { w: 1.6, d: 1500, t: 150, head: 5 })
      },
      trainer(g) {
        axes(g, 30, 600, 330, 330, { xl: 'Spiele', yl: 'Punkte' })
        const pts: P[] = [[40, 450], [80, 500], [120, 540], [160, 560], [200, 480], [240, 460], [280, 470], [320, 455]]
        ink(g, pts, { w: 2.8, d: 400, t: 1200 })
        dashes(g, L([180, 590], [180, 360]), { w: 1.4, d: 1400 })
        fig(g, 196, 410, 1.4, { d: 1500, arms: 'push' })
        ink(g, B([186, 366], [190, 360], [202, 360], [206, 366]), { w: 2, d: 1600, t: 100 })
      },
      galton(g) {
        // Messlatte: sehr große Eltern, ihr Kind ist etwas kleiner – näher am Durchschnitt (gestrichelt)
        ink(g, L([30, 300], [30, 600]), { w: 2.4, t: 400 })
        for (let k = 0; k <= 15; k++) ink(g, L([30, 600 - k * 20], [k % 5 ? 38 : 46, 600 - k * 20]), { w: 1, d: 200 + k * 20, t: 40 })
        dashes(g, L([30, 600 - 32 * 5.5], [340, 600 - 32 * 5.5]), { w: 1.2, d: 600, dash: 5, gap: 4 })
        fig(g, 90, 600, 5.6, { d: 300 })
        fig(g, 160, 600, 5.3, { d: 500 })
        fig(g, 270, 600, 5, { d: 1000 })
        arrow(g, L([196, 500], [236, 500]), { w: 2.4, d: 800, t: 300, head: 9 })
        ink(g, L([20, 600], [340, 600]), { w: 2.6, d: 100, t: 400 })
      },
      noten(g) {
        // drei Arbeiten derselben Schülerin nacheinander: Ausreißer nach oben, dann wieder Mittelfeld
        for (const [x, n, d] of [[60, '1', 0], [170, '3', 400], [280, '2', 800]] as const) {
          const pg: P[] = [[x - 40, 380], [x + 36, 376], [x + 40, 520], [x - 36, 524], [x - 40, 380]]
          blank(g, pg)
          ink(g, pg, { w: 2.2, d, t: 400 })
          for (let k = 0; k < 6; k++) ink(g, L([x - 30, 396 + k * 12], [x + 24 - (k % 3) * 8, 394 + k * 12]), { w: 0.8, d: d + 200 + k * 40, t: 100 })
          ink(g, E(x + 10, 490, 18), { w: 2, d: d + 500, t: 200 })
          text(g, x + 10, 498, n, { anchor: 'middle', size: 22, d: d + 600 })
        }
        ink(g, [[60, 580], [170, 620], [280, 600]], { w: 2.2, d: 1300, t: 500 })
        for (const [x, y] of [[60, 580], [170, 620], [280, 600]] as const) dot(g, x, y, 4, 1400)
        dashes(g, L([30, 600], [330, 600]), { w: 1, d: 1200, dash: 4, gap: 4 })
      },
      blitzer(g) {
        // Blitzersäule am Straßenrand, Auto fährt vorbei, Blitz; daneben fallende Unfallzahlen
        ink(g, L([20, 600], [340, 600]), { w: 2.6, t: 400 })
        dashes(g, L([20, 630], [340, 630]), { w: 2, d: 200, dash: 16, gap: 10 })
        ink(g, RR(56, 380, 40, 150, 6), { w: 2.8, d: 300, t: 400 })
        ink(g, L([76, 530], [76, 600]), { w: 3, d: 400, t: 200 })
        ink(g, E(76, 410, 12), { w: 2.2, d: 500, t: 200 })
        ink(g, E(76, 410, 5), { w: 1.4, d: 550, t: 100 })
        ink(g, RR(64, 440, 24, 14, 2), { w: 1.6, d: 600, t: 100 })
        const fl = pop(g, 1800, '50% 50%')
        for (let k = 0; k < 8; k++) ink(fl, L([76 + Math.cos(rad(k * 45)) * 18, 410 + Math.sin(rad(k * 45)) * 18], [76 + Math.cos(rad(k * 45)) * 30, 410 + Math.sin(rad(k * 45)) * 30]), { w: 1.6, t: 0 })
        const c = glide(g, -200, 0, { ms: 2400, d: 900, loop: true })
        car(c, 330, 620, 1.2, 600)
        axes(g, 180, 540, 340, 370, {})
        ink(g, [[186, 400], [220, 410], [250, 470], [280, 480], [320, 490]], { w: 2.2, d: 1200, t: 500 })
        dot(g, 186, 400, 4, 1200)
      },
      ende(g) {
        dashes(g, L([40, 500], [320, 500]), { w: 1.6 })
        for (let i = 0; i < 12; i++) dot(g, 50 + i * 24, 500 + Math.sin(i * 2.1) * 20, 3, 200 + i * 40)
        arrow(g, L([100, 380], [100, 490]), { w: 2.6, d: 900, t: 400, head: 9 })
        dot(g, 100, 370, 6, 800)
        arrow(g, L([260, 620], [260, 510]), { w: 2.6, d: 1100, t: 400, head: 9 })
        dot(g, 260, 630, 6, 1000)
      },
      anteile(g) {
        // jede Leistung = festes Können (dunkler Sockel) + schwankender Zufall (hell schraffiert, mal plus, mal minus)
        ink(g, L([30, 600], [330, 600]), { w: 2.6, t: 400 })
        dashes(g, L([30, 480], [330, 480]), { w: 1.2, d: 300, dash: 5, gap: 4 })
        const luck = [30, -20, 50, -40, 10, 70, -60, 20, -10, 40]
        luck.forEach((l, i) => {
          const x = 40 + i * 29
          hatch(g, RR(x, 480, 20, 120, 2), 400 + i * 80, true)
          ink(g, RR(x, 480, 20, 120, 2), { w: 1.6, d: 300 + i * 80, t: 150 })
          const top = 480 - l
          const r: P[] = [[x, 480], [x + 20, 480], [x + 20, top], [x, top], [x, 480]]
          if (l > 0) hatch(g, r, 900 + i * 80)
          ink(g, r, { w: 1.4, d: 800 + i * 80, t: 150 })
        })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { spitze: {} } },
      { t: T('Ein Fluglehrer erzählte: Wer nach einer **tollen Landung** gelobt wird, landet danach meist schlechter.', 64), gfx: { lob: {} } },
      { t: T('Und wer nach einer **miesen Landung** angeschrien wird, landet danach meist besser. Schimpfen wirkt also, Lob schadet?', 64), gfx: { tadel: {} } },
      { t: T('Der Psychologe Daniel Kahneman erkannte: weder noch. Das ist die **Regression zur Mitte**.', 480), gfx: { spitze: {} } },
      { t: T('Jede Leistung besteht aus Können **plus Zufall** – an manchen Tagen läuft es, an anderen nicht.', 64), gfx: { anteile: {} } },
      { t: T('Eine herausragende Landung hatte meist besonders viel **Glück**. Beim nächsten Mal ist das Glück durchschnittlich – das Ergebnis fällt zurück.', 64), gfx: { streuung: {} } },
      { t: T('Bei einer miserablen Landung war meist **Pech** dabei. Danach geht es fast von allein wieder nach oben.', 64), gfx: { streuung: {} } },
      { t: T('Lob und Tadel haben damit **wenig zu tun**. Die Ergebnisse wandern einfach zurück Richtung Durchschnitt.', 64), gfx: { ende: {} } },
      { t: T('Im Sport heißt das „Titelseiten-Fluch“: Wer aufs Cover kommt, hatte meist eine Rekordsaison – und spielt danach **schwächer**.', 64), gfx: { cover: {} } },
      { t: T('Auch Schulnoten: Wer in einer Arbeit überraschend gut war, schreibt die nächste oft schlechter – **ohne nachzulassen**.', 64), gfx: { noten: {} } },
      { t: T('In der Medizin: Man geht zum Arzt, wenn es **am schlimmsten** ist. Danach wird es oft von selbst besser – egal, was man nimmt.', 64), gfx: { arzt: {} } },
      { t: T('Beim Arzt: Ein zufällig **hoher Blutdruck** ist beim zweiten Messen oft niedriger. Darum misst man mehrmals.', 64), gfx: { streuung: {} } },
      { t: T('Darum braucht jede Studie eine **Kontrollgruppe**: Auch ihr geht es oft besser – nur der Unterschied zeigt die Wirkung.', 64), gfx: { kontrolle: {} } },
      { t: T('Blitzer werden oft dort aufgestellt, wo es gerade besonders viele Unfälle gab. Danach sinken die Zahlen – zum Teil **von allein**.', 64), gfx: { blitzer: {} } },
      { t: T('Ein Trainerwechsel nach einer Pechsträhne wirkt oft – auch, weil es danach **ohnehin** besser geworden wäre.', 64), gfx: { trainer: {} } },
      { t: T('Entdeckt hat das Francis Galton um 1886: Sehr große Eltern haben im Schnitt **etwas kleinere** Kinder, sehr kleine Eltern etwas größere.', 64), gfx: { galton: {} } },
      { t: T('Alle werden trotzdem nicht gleich: Neue Ausreißer entstehen ständig – nur sind es **andere** Menschen.', 64), gfx: { streuung: {} } },
      { t: T('Merkregel: Nach einem extremen Ergebnis ist das nächste wahrscheinlich **weniger extrem**.', 64), gfx: { ende: {} } },
      { t: T('Extreme kehren zur Mitte zurück – **ganz ohne Grund**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Jedes Ergebnis ist Können plus Zufall; Extreme hatten meist besonders viel Glück oder Pech.', 'Darum folgt auf Extremes meist etwas Normaleres – Regression zur Mitte.', 'Ohne Kontrollgruppe hält man das leicht für die Wirkung von Lob, Tadel oder Medizin.'],
    sources: ['Kahneman 2011: Schnelles Denken, langsames Denken, Kap. 17', 'Galton 1886, Journal of the Anthropological Institute 15', 'Barnett, van der Pols & Dobson 2005, International Journal of Epidemiology 34'],
  },
  {
    id: 'schachbrett',
    area: 'DENK',
    day: 78,
    hook: 'Wie viel Reis liegt auf dem letzten Feld eines Schachbretts?',
    mood: 'episch',
    ambience: 'uhr',
    images: [],
    draw: {
      brett(g) {
        // Schachbrett in Schrägsicht, darauf wachsende Reishäufchen; König und Bauer als Figuren
        const pr = (c: number, r: number): P => {
          const t = r / 8
          const w = 200 + t * 120
          return [180 - w / 2 + (c / 8) * w, 140 + t * 220]
        }
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) hatch(g, [pr(c, r), pr(c + 1, r), pr(c + 1, r + 1), pr(c, r + 1)], 300 + (r * 8 + c) * 8, true)
        ink(g, [pr(0, 0), pr(8, 0), pr(8, 8), pr(0, 8), pr(0, 0)], { w: 3, t: 800 })
        ink(g, [pr(0, 8), [pr(0, 8)[0], pr(0, 8)[1] + 14], [pr(8, 8)[0], pr(8, 8)[1] + 14], pr(8, 8)], { w: 2.4, d: 300, t: 400 })
        for (let k = 0; k < 6; k++) {
          const [a, b] = [pr(k + 0.5, 7.5), pr(k + 0.6, 7.5)]
          const n = Math.pow(2, k)
          if (n < 8) for (let i = 0; i < n; i++) grain(g, a[0] - 6 + (i % 3) * 6, b[1] - 2 + Math.floor(i / 3) * 4, 0.8, i * 40, 1000 + k * 200 + i * 40)
          else ricePile(g, a[0], b[1] + 6, 10 + k * 6, 6 + k * 4, 1000 + k * 200)
        }
        const pc = (x: number, y: number, h: number, d: number) => {
          ink(g, E(x, y, 14, 4), { w: 2, d, t: 150 })
          ink(g, [[x - 12, y], [x - 6, y - h * 0.6], [x - 4, y - h * 0.8], [x + 4, y - h * 0.8], [x + 6, y - h * 0.6], [x + 12, y]], { w: 2, d: d + 100, t: 200 })
          ball(g, x, y - h * 0.9, 7, { d: d + 200, w: 1.6, t: 100 })
        }
        pc(130, 220, 40, 1400)
        pc(250, 200, 34, 1500)
        ink(g, L([130, 166], [130, 180]), { w: 2, d: 1600, t: 60 })
        ink(g, L([124, 172], [136, 172]), { w: 2, d: 1600, t: 60 })
      },
      koenig(g) {
        // der König auf dem Thron, vor ihm der Erfinder mit dem Brett; Sprechblase mit einer Schale Reis
        ink(g, RR(30, 380, 120, 220, 10), { w: 2.4, t: 500 })
        hatch(g, RR(36, 386, 108, 30, 6), 300, true)
        king(g, 90, 600, 1.4, 300)
        fig(g, 250, 600, 3.6, { d: 600, arms: 'push' })
        ink(g, [[180, 540], [220, 520], [244, 548], [204, 568], [180, 540]], { w: 2, d: 900, t: 200 })
        hatch(g, [[190, 540], [212, 530], [226, 546], [204, 556]], 1000, true)
        bubble(g, 220, 340, 120, 70, 'r', 1100)
        ink(g, B([250, 380], [254, 396], [306, 396], [310, 380]), { w: 2, d: 1300, t: 200 })
        ink(g, L([248, 380], [312, 380]), { w: 1.6, d: 1300, t: 150 })
        ricePile(g, 280, 380, 50, 14, 1400)
      },
      reihe(g) {
        // vier Felder mit 1, 2, 4, 8 Körnern
        for (let k = 0; k < 4; k++) {
          const x = 30 + k * 78
          if (k % 2) hatch(g, RR(x, 420, 70, 70, 2), 200 + k * 300)
          ink(g, RR(x, 420, 70, 70, 2), { w: 2.6, d: k * 300, t: 400 })
          const n = Math.pow(2, k)
          for (let i = 0; i < n; i++) {
            const gx = x + 18 + (i % 3) * 17
            const gy = 438 + Math.floor(i / 3) * 16
            blank(g, E(gx, gy, 9, 6))
            grain(g, gx, gy, 1.4, i * 37, k * 300 + 300 + i * 60)
          }
        }
        for (let k = 0; k < 3; k++) carrow(g, [70 + k * 78, 410], [104 + k * 78, 410], -20, { d: 600 + k * 300 })
      },
      verlauf(g) {
        // eine Handvoll – ein Sack – Lastwagen – ein Berg, höher als jedes Gebirge
        const hand: P[] = smooth([[30, 600], [36, 580], [70, 574], [96, 584], [100, 600], [30, 600]], 3)
        ink(g, hand, { w: 2.2, t: 400 })
        ricePile(g, 64, 584, 40, 12, 300)
        const sack: P[] = smooth([[110, 600], [114, 560], [124, 548], [118, 536], [140, 534], [134, 548], [150, 560], [154, 600], [110, 600]], 3)
        blank(g, sack)
        ink(g, sack, { w: 2.2, d: 500, t: 400 })
        for (let k = 0; k < 2; k++) {
          ink(g, [[170 + k * 4, 600 - k * 28], [170 + k * 4, 576 - k * 28], [226 + k * 4, 576 - k * 28], [226 + k * 4, 600 - k * 28]], { w: 1.8, d: 800 + k * 100, t: 200 })
        }
        car(g, 200, 616, 0.9, 900)
        mountain(g, 240, 350, 600, [296, 320], 1100)
        ricePile(g, 296, 600, 110, 40, 1500)
        fig(g, 330, 600, 0.6, { d: 1600 })
        ink(g, L([20, 602], [340, 602]), { w: 2, d: 100, t: 400 })
      },
      chips(g) {
        // vier Chipgenerationen: gleiche Fläche, immer feinere Strukturen
        for (let k = 0; k < 4; k++) {
          const x = 30 + k * 80
          ink(g, RR(x, 440, 66, 66, 4), { w: 2.4, d: k * 300, t: 300 })
          for (let j = 0; j < 5; j++) for (const s of [-1, 1]) ink(g, L([x + 8 + j * 12.5, s < 0 ? 440 : 506], [x + 8 + j * 12.5, s < 0 ? 430 : 516]), { w: 1.2, d: k * 300 + 100, t: 40 })
          const n = 2 + k * 2
          for (let i = 1; i < n; i++) {
            ink(g, L([x + 6, 446 + (i * 54) / n], [x + 60, 446 + (i * 54) / n]), { w: 0.7, d: k * 300 + 200 + i * 20, t: 60 })
            ink(g, L([x + 6 + (i * 54) / n, 446], [x + 6 + (i * 54) / n, 500]), { w: 0.7, d: k * 300 + 200 + i * 20, t: 60 })
          }
        }
        arrow(g, L([40, 560], [320, 560]), { w: 2.2, d: 1400, t: 400, head: 9 })
      },
      linear(g) {
        // links linear: immer gleich viel dazu (+1); rechts exponentiell: immer verdoppelt (×2)
        for (const [x0, n, f, d] of [[30, '+1', (t: number) => t, 0], [195, '×2', (t: number) => (Math.pow(2, t * 8) - 1) / 255, 700]] as const) {
          axes(g, x0, 600, x0 + 140, 360, { d })
          plot(g, x0 + 4, 596, 126, 220, f, { d: d + 300 })
          ink(g, E(x0 + 70, 636, 18), { w: 1.8, d: d + 300, t: 150 })
          text(g, x0 + 70, 642, n, { anchor: 'middle', size: 16, d: d + 400 })
        }
      },
      seerose(g) {
        // Teich mit Seerosenblättern: links halb bedeckt, rechts ganz
        for (const [cx, full] of [[100, false], [262, true]] as const) {
          ink(g, E(cx, 480, 78, 120), { w: 2.8, d: full ? 400 : 0, t: 700 })
          const n = full ? 24 : 12
          for (let i = 0; i < n; i++) {
            const col = i % 4
            const row = Math.floor(i / 4)
            const x = cx - 46 + col * 30 + (row % 2) * 12
            const y = 380 + row * 34 + (full ? 0 : 102)
            if (Math.hypot((x - cx) / 74, (y - 480) / 114) > 0.92) continue
            const lp: P[] = [...E(x, y, 14, 9, 20, 340), [x, y]]
            blank(g, lp)
            ink(g, lp, { w: 1.4, d: (full ? 900 : 500) + i * 50, t: 100 })
          }
        }
      },
      ende(g) {
        ink(g, RR(110, 420, 140, 140, 4), { w: 3, t: 700 })
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2) hatch(g, RR(110 + c * 35, 420 + r * 35, 35, 35, 0), 300, true)
        ricePile(g, 232, 560, 90, 70, 900)
      },
      kilo(g) {
        // Feld 16: ein Kilo Reis auf der Küchenwaage
        ink(g, RR(90, 560, 180, 50, 8), { w: 2.8, t: 400 })
        ink(g, RR(150, 574, 60, 22, 3), { w: 1.8, d: 200, t: 200 })
        ink(g, E(180, 552, 80, 10), { w: 2.2, d: 300, t: 300 })
        ricePile(g, 180, 548, 140, 90, 500)
        dashes(g, L([30, 456], [330, 456]), { w: 1, d: 1200, dash: 4, gap: 4 })
      },
      tonnen(g) {
        // Feld 32: zwei Kipplaster voll Reis
        for (const [x, d] of [[90, 0], [250, 400]] as const) {
          ink(g, [[x - 70, 560], [x + 30, 560], [x + 30, 500], [x - 70, 500], [x - 70, 560]], { w: 2.4, d, t: 400 })
          ricePile(g, x - 20, 500, 100, 40, d + 400)
          ink(g, [[x + 34, 560], [x + 34, 512], [x + 56, 512], [x + 68, 532], [x + 68, 560]], { w: 2.4, d: d + 200, t: 300 })
          ink(g, L([x + 40, 520], [x + 56, 520]), { w: 1.2, d: d + 300, t: 100 })
          for (const a of [-50, 0, 50]) {
            blank(g, E(x + a, 566, 10))
            ink(g, E(x + a, 566, 10), { w: 2, d: d + 400, t: 150 })
          }
        }
        ink(g, L([20, 576], [340, 576]), { w: 2.2, d: 100, t: 400 })
      },
      berg(g) {
        // Feld 64: ein Reisberg, gegen den der höchste Berg klein ist
        ricePile(g, 200, 640, 300, 300, 0)
        mountain(g, 20, 120, 640, [70, 590], 600, true)
        ink(g, L([20, 642], [340, 642]), { w: 2.4, d: 100, t: 400 })
        cloud(g, 90, 420, 0.5, 900)
      },
      doppel(g) {
        // Säulen je Feld: jede doppelt so hoch wie die vorige – nach wenigen Feldern sprengen sie den Rahmen
        ink(g, RR(30, 330, 300, 280, 4), { w: 2, t: 500 })
        const c = clipBox(g, 32, 332, 296, 276)
        for (let k = 0; k < 12; k++) {
          const h = Math.pow(2, k) * 0.5
          const x = 40 + k * 24
          hatch(c, RR(x, 608 - h, 18, h, 1), 300 + k * 150, k > 8)
          ink(c, RR(x, 608 - h, 18, h, 1), { w: 1.6, d: 200 + k * 150, t: 200 })
        }
        arrow(g, L([310, 400], [310, 320]), { w: 2.4, d: 2200, t: 200, head: 8 })
      },
      beispiele(g) {
        // Zinseszins, Epidemie, Rechenleistung, Bakterien – als Bilder
        for (let k = 0; k < 4; k++) for (let j = 0; j <= k; j++) {
          ink(g, E(60, 420 - j * 8 - k * 0, 22, 6), { w: 1.6, d: k * 200 + j * 60, t: 100 })
        }
        for (let j = 0; j < 7; j++) ink(g, E(60, 440 - j * 9, 22, 6), { w: 1.4, d: 300 + j * 80, t: 100 })
        virus(g, 270, 410, 30, 500)
        for (let k = 0; k < 6; k++) virus(g, 230 + (k % 3) * 40, 470 + Math.floor(k / 3) * 30, 8, 900 + k * 80)
        ink(g, RR(30, 540, 70, 70, 6), { w: 2.4, d: 700, t: 300 })
        for (let k = 0; k < 6; k++) for (const s of [-1, 1]) ink(g, L([40 + k * 10, s < 0 ? 540 : 610], [40 + k * 10, s < 0 ? 530 : 620]), { w: 1.4, d: 900 + k * 30, t: 60 })
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ink(g, RR(42 + c * 12, 552 + r * 12, 8, 8, 1), { w: 0.8, d: 1000 + (r * 4 + c) * 20, t: 40 })
        for (let k = 0; k < 4; k++) bact(g, 200 + (k % 2) * 60, 540 + Math.floor(k / 2) * 40, 0.6, 1100 + k * 150)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { brett: {} } },
      { t: T('Eine alte Legende aus Indien: Der Erfinder des Schachspiels darf sich vom König eine **Belohnung** wünschen.', 64), gfx: { koenig: {} } },
      { t: T('Er bittet um Reis: ein Korn auf das erste Feld, zwei auf das zweite, vier auf das dritte – **immer doppelt** so viel wie davor.', 64), gfx: { reihe: {} } },
      { t: T('Der König wundert sich über die **bescheidene** Bitte. Ein paar Säcke Reis, mehr nicht.', 64), gfx: { koenig: {} } },
      { t: T('Nach der ersten Reihe liegen auf Feld 8 gerade **128 Körner**. Kaum eine Handvoll.', 64), gfx: { verlauf: {} } },
      { t: T('Auf Feld 16 sind es 32.768 Körner – knapp **ein Kilo** Reis.', 64), gfx: { kilo: {} } },
      { t: T('Auf Feld 32, in der Mitte des Bretts: über **zwei Milliarden** Körner – rund 50 Tonnen.', 64), gfx: { tonnen: {} } },
      { t: T('Auf Feld 64 schließlich: über **neun Trillionen** Körner – eine Zahl mit 19 Stellen.', 64), gfx: { berg: {} } },
      { t: T('Auf Feld n liegen 2 hoch n minus eins Körner. Alle Felder zusammen: **2 hoch 64**, minus eins.', 64), gfx: { doppel: {} } },
      { t: T('Zusammen wäre das fast **tausendmal** so viel Reis, wie die ganze Welt heute in einem Jahr erntet.', 64), gfx: { verlauf: {} } },
      { t: T('Das ist **exponentielles Wachstum**: Es kommt nicht jedes Mal gleich viel dazu, sondern alles wird vervielfacht.', 64), gfx: { linear: {} } },
      { t: T('Unser Gefühl denkt **linear**: Es schätzt, als käme immer ungefähr gleich viel hinzu.', 64), gfx: { linear: {} } },
      { t: T('Darum unterschätzen wir Zinseszins, Epidemien oder Computerleistung: Alles verdoppelt sich in **festen Abständen**.', 64), gfx: { beispiele: {} } },
      { t: T('Ein reales Beispiel: Die Zahl der Transistoren auf Computerchips hat sich jahrzehntelang etwa **alle zwei Jahre** verdoppelt.', 64), gfx: { chips: {} } },
      { t: T('Faustregel: Wächst etwas um **7 Prozent** pro Jahr, verdoppelt es sich in etwa zehn Jahren.', 64), gfx: { f1: { draw: 'formel', args: [['70', '÷', 'Wachstum in %', '≈', 'Jahre bis zur Verdopplung'], 340] } } },
      { t: T('Ein Rätsel: Seerosen verdoppeln sich jeden Tag. Nach 30 Tagen ist der Teich voll. Wann war er **halb voll**? Am Tag 29.', 64), gfx: { seerose: {} } },
      { t: T('Das Tückische: Lange sieht man fast nichts – und dann geht alles **sehr schnell**.', 64), gfx: { linear: {} } },
      { t: T('In der Natur endet solches Wachstum immer: Nahrung, Platz oder Rohstoffe **gehen aus**.', 64), gfx: { seerose: {} } },
      { t: T('Verdoppeln wirkt harmlos – bis zum **letzten Feld**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein Korn, das sich 63-mal verdoppelt, wird zu über 9 Trillionen Körnern.', 'Exponentielles Wachstum vervielfacht in festen Abständen – unser Gefühl rechnet linear.', 'Faustregel: 70 ÷ Wachstumsrate in % ≈ Jahre bis zur Verdopplung.'],
    sources: ['Ibn Khallikan, 13. Jh. (Weizenkorn-Legende)', 'Bartlett 1978, The Physics Teacher (Exponential Growth)', 'FAO: Weltreisproduktion'],
  },
  {
    id: 'papier-falten',
    area: 'DENK',
    day: 78,
    hook: 'Wie oft müsstest du ein Blatt Papier falten, um bis zum Mond zu kommen?',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [],
    draw: {
      blatt(g) {
        // ein Blatt wird gefaltet (die rechte Hälfte klappt um), darüber der Mond
        stars(g, 20, 70, 320, 150, 18, 0, (x, y) => Math.hypot(x - 280, y - 130) < 50)
        moonFace(g, 280, 130, 36, 200)
        const left: P[] = [[60, 330], [150, 310], [190, 370], [100, 392], [60, 330]]
        blank(g, left)
        ink(g, left, { w: 3, d: 300, t: 600 })
        for (let k = 0; k < 4; k++) ink(g, L([76 + k * 6, 340 + k * 10], [150 + k * 6, 324 + k * 10]), { w: 0.6, d: 600 + k * 50, t: 150 })
        // umgeklappte Hälfte liegt auf der linken, gestrichelt die alte Lage, Pfeil fürs Falten
        dashes(g, [[150, 310], [240, 290], [280, 350], [190, 370]], { w: 1.4, d: 600, dash: 5, gap: 4 })
        const flap: P[] = [[150, 310], [70, 300], [100, 350], [190, 370], [150, 310]]
        blank(g, flap)
        hatch(g, flap, 1200)
        ink(g, flap, { w: 2.6, d: 1000, t: 400 })
        carrow(g, [250, 300], [110, 290], -60, { d: 900 })
        ink(g, L([150, 310], [190, 370]), { w: 1.6, d: 900, t: 300 })
      },
      dicke(g) {
        // Lupe auf die Blattkante neben einem Lineal mit Millimeterstrichen: das Blatt ist ein Zehntel davon
        ink(g, [[30, 470], [250, 440], [330, 460], [110, 490], [30, 470]], { w: 2.4, t: 600 })
        ink(g, E(260, 520, 70), { w: 2.8, d: 400, t: 400 })
        ink(g, L([210, 470], [180, 440]), { w: 2, d: 500, t: 150 })
        const c = clipBox(g, 192, 452, 136, 136)
        ink(c, RR(180, 540, 160, 30, 2), { w: 2, d: 600, t: 300 })
        for (let k = 0; k < 4; k++) ink(c, L([200 + k * 40, 540], [200 + k * 40, k % 2 ? 556 : 564]), { w: 1.6, d: 700 + k * 60, t: 80 })
        hatch(c, RR(180, 518, 160, 4, 0), 900, true)
        ink(c, L([180, 518], [340, 518]), { w: 1.2, d: 900, t: 200 })
        ink(c, L([180, 522], [340, 522]), { w: 1.2, d: 900, t: 200 })
        for (let k = 0; k < 6; k++) ink(c, B([190 + k * 24, 519], [196 + k * 24, 521], [202 + k * 24, 518], [208 + k * 24, 520]), { w: 0.5, d: 1000, t: 60 })
      },
      stapel(g) {
        // jede Faltung verdoppelt die Lagen: 1, 2, 4, 8, 16
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 400 })
        for (let k = 0; k < 5; k++) {
          const x = 30 + k * 66
          const n = Math.pow(2, k)
          const h = 4 * n
          ink(g, RR(x, 616 - h, 50 - k * 4, h, 2), { w: 2.2, d: k * 300, t: 300 })
          for (let i = 1; i < n; i++) ink(g, L([x + 2, 616 - i * 4], [x + 48 - k * 4, 616 - i * 4]), { w: 0.5, d: k * 300 + 200, t: 60 })
          if (k < 4) carrow(g, [x + 30, 600 - h - 10], [x + 70, 600 - 2 * h - 10], -20, { d: 300 + k * 300 })
        }
      },
      mond(g) {
        // Erde und Mond mit dem Papierstapel als dünnem Strich dazwischen
        earth(g, 60, 480, 34, 0, { lon: 20, lat: 10 })
        moonFace(g, 314, 480, 12, 300)
        stars(g, 20, 320, 320, 300, 20, 200, (x, y) => Math.hypot(x - 60, y - 480) < 44 || Math.hypot(x - 314, y - 480) < 20)
        const st0 = mk('g', {}, mk('g', { transform: 'translate(94 0)' }, g))
        mk('animateTransform', { attributeName: 'transform', type: 'scale', from: '0.01 1', to: '1 1', dur: '3s', begin: '0.8s', fill: 'freeze', additive: 'sum' }, st0)
        const inner = mk('g', { transform: 'translate(-94 0)' }, st0)
        ink(inner, RR(94, 477, 206, 6, 1), { w: 1.4, d: 600, t: 400 })
        hatch(inner, RR(94, 477, 206, 6, 1), 900, true)
      },
      sonne(g) {
        // bis zur Sonne: die Erde winzig, der Stapel ein langer Strich
        sunDisk(g, 290, 470, 50, 0)
        earth(g, 50, 470, 12, 200)
        ink(g, RR(64, 468, 172, 4, 1), { w: 1.2, d: 800, t: 900 })
        stars(g, 20, 340, 320, 260, 18, 300, (x, y) => Math.hypot(x - 290, y - 470) < 80)
      },
      universum(g) {
        // das beobachtbare Universum: Galaxienhaufen und Filamente, quer durch die Säule
        ink(g, E(180, 470, 150), { w: 3, t: 900 })
        let seed = 13
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 40; i++) {
          const a = rnd() * Math.PI * 2
          const r = Math.sqrt(rnd()) * 140
          dot(g, 180 + Math.cos(a) * r, 470 + Math.sin(a) * r, 1 + rnd() * 2, 300 + i * 20)
        }
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60 + 10)
          ink(g, smooth([[180, 470], [180 + Math.cos(a) * 60, 470 + Math.sin(a + 0.4) * 60], [180 + Math.cos(a) * 140, 470 + Math.sin(a) * 140]], 3), { w: 0.8, d: 600 + k * 80, t: 300 })
        }
        for (const [x, y] of [[120, 410], [250, 530]] as const) {
          const sp = spin(g, x, y, 8000, 1000)
          for (const k of [0, 180]) ink(sp, Array.from({ length: 20 }, (_, i) => [x + Math.cos(rad(k + i * 18)) * (2 + i * 0.7), y + Math.sin(rad(k + i * 18)) * (2 + i * 0.7) * 0.6] as P), { w: 1, d: 900, t: 200 })
        }
        ink(g, RR(176, 300, 8, 340, 1), { w: 1.6, d: 1200, t: 600 })
      },
      sieben(g) {
        // sieben Faltungen hintereinander: das Päckchen wird kleiner und dicker
        for (let k = 0; k < 7; k++) {
          const w = 260 / Math.pow(1.45, k)
          const h = 6 * Math.pow(1.5, k)
          const y = 600 - k * 34 - h
          ink(g, RR(180 - w / 2, y, w, h, 3), { w: 2, d: k * 200, t: 300 })
          for (let i = 1; i < Math.min(16, Math.pow(2, k)); i++) ink(g, L([180 - w / 2 + 2, y + (h * i) / Math.min(16, Math.pow(2, k))], [180 + w / 2 - 2, y + (h * i) / Math.min(16, Math.pow(2, k))]), { w: 0.4, d: k * 200 + 100, t: 40 })
          ink(g, E(180 + w / 2, y + h / 2, 3, h / 2, -90, 90), { w: 1.2, d: k * 200 + 150, t: 60 })
        }
      },
      gallivan(g) {
        // ein über einen Kilometer langer Papierstreifen in einer langen Halle; am Ende das Faltpaket mit Bögen
        ink(g, [[20, 340], [340, 380]], { w: 1.4, t: 500 })
        ink(g, [[20, 620], [340, 600]], { w: 2.4, d: 100, t: 500 })
        for (let k = 0; k < 6; k++) ink(g, L([40 + k * 52, 342 + k * 6], [40 + k * 52, 618 - k * 2.4]), { w: 0.8, d: 200 + k * 40, t: 200 })
        const strip: P[] = Array.from({ length: 40 }, (_, i) => [20 + i * 6.4, 580 - Math.sin(i * 0.5) * 3] as P)
        ink(g, strip, { w: 2, d: 400, t: 800 })
        ink(g, strip.map(([x, y]): P => [x, y + 8]), { w: 2, d: 500, t: 800 })
        for (let k = 0; k < 6; k++) {
          const r = 6 + k * 5
          ink(g, E(270, 560, r, r, -90, 90), { w: 1.4, d: 1200 + k * 80, t: 150 })
          ink(g, L([270 - 10, 560 - r], [270, 560 - r]), { w: 1.4, d: 1200 + k * 80, t: 60 })
          ink(g, L([270 - 10, 560 + r], [270, 560 + r]), { w: 1.4, d: 1200 + k * 80, t: 60 })
        }
        fig(g, 300, 612, 2.4, { d: 800, arms: 'push' })
      },
      ende(g) {
        moonFace(g, 180, 430, 50, 0)
        ink(g, [[110, 600], [250, 590], [270, 620], [130, 630], [110, 600]], { w: 2.6, d: 500, t: 600 })
        ink(g, RR(176, 486, 6, 104, 1), { w: 1.4, d: 900, t: 500 })
      },
      buch(g) {
        // nach zehn Faltungen: so dick wie ein dickes Buch
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 400 })
        ink(g, RR(70, 520, 90, 98, 3), { w: 2.4, d: 200, t: 400 })
        for (let i = 1; i < 24; i++) ink(g, L([72, 618 - i * 4], [158, 618 - i * 4]), { w: 0.5, d: 400 + i * 20, t: 60 })
        const book: P[] = [[200, 618], [200, 522], [300, 518], [300, 614], [200, 618]]
        ink(g, book, { w: 2.6, d: 600, t: 400 })
        hatch(g, [[200, 522], [214, 518], [214, 614], [200, 618]], 900, true)
        for (let k = 0; k < 8; k++) ink(g, L([218, 528 + k * 11], [296, 526 + k * 11]), { w: 0.6, d: 1000 + k * 30, t: 80 })
        dashes(g, L([60, 520], [310, 516]), { w: 1, d: 1300, dash: 4, gap: 4 })
      },
      turm(g) {
        // nach zwanzig Faltungen: höher als ein Kirchturm
        ink(g, L([20, 640], [340, 640]), { w: 3, t: 400 })
        ink(g, RR(80, 320, 16, 320, 2), { w: 2.2, d: 200, t: 600 })
        hatch(g, RR(80, 320, 16, 320, 2), 600)
        const ch: P[] = [[160, 640], [160, 470], [200, 470], [200, 420], [214, 360], [228, 420], [228, 470], [300, 470], [300, 640]]
        ink(g, ch, { w: 2.6, d: 400, t: 700 })
        ink(g, [[200, 470], [270, 420], [300, 470]], { w: 2.4, d: 600, t: 300 })
        ink(g, E(214, 450, 8), { w: 1.6, d: 900, t: 150 })
        ink(g, L([214, 360], [214, 340]), { w: 1.6, d: 1000, t: 100 })
        ink(g, L([208, 346], [220, 346]), { w: 1.6, d: 1000, t: 100 })
        for (const x of [190, 250, 280]) ink(g, [[x - 6, 600], [x - 6, 570], [x, 562], [x + 6, 570], [x + 6, 600]], { w: 1.4, d: 1100, t: 150 })
        fig(g, 130, 640, 1.2, { d: 1200 })
      },
      all(g) {
        // nach dreißig Faltungen: die Säule ragt durch die Lufthülle bis ins All
        ink(g, L([20, 640], [340, 640]), { w: 3, t: 400 })
        for (const [y, w] of [[560, 1.4], [460, 1], [380, 0.7]] as const) dashes(g, L([20, y], [340, y]), { w, d: 300, dash: 6, gap: 6 })
        stars(g, 20, 300, 320, 70, 14, 400)
        ink(g, RR(150, 300, 10, 340, 1), { w: 2, d: 300, t: 600 })
        hatch(g, RR(150, 300, 10, 340, 1), 800)
        cloud(g, 70, 610, 0.5, 600)
        jet(g, 250, 580, 0.18, 800)
        const iss = wobble(g, { dx: 20, ms: 6000, d: 1000 })
        ink(iss, RR(240, 330, 30, 10, 2), { w: 1.6, d: 900, t: 150 })
        for (const k of [-1, 1]) {
          ink(iss, RR(255 + k * 28 - 10, 320, 20, 30, 1), { w: 1.2, d: 1000, t: 150 })
          hatch(iss, RR(255 + k * 28 - 10, 320, 20, 30, 1), 1100, true)
        }
      },
      everest(g) {
        // nach 27 Faltungen: höher als der Mount Everest
        ink(g, L([20, 640], [340, 640]), { w: 3, t: 400 })
        mountain(g, 120, 340, 640, [240, 400], 200)
        ink(g, RR(70, 360, 12, 280, 1), { w: 2, d: 300, t: 600 })
        hatch(g, RR(70, 360, 12, 280, 1), 800)
        dashes(g, L([82, 400], [240, 400]), { w: 1, d: 1200, dash: 4, gap: 4 })
        cloud(g, 300, 470, 0.4, 900)
      },
      lagen(g) {
        // Stapel im Schnitt mit sehr vielen Lagen; die Lupe zeigt, wie dicht sie liegen
        ink(g, RR(60, 440, 120, 160, 3), { w: 2.6, t: 500 })
        for (let i = 1; i < 40; i++) ink(g, L([62, 440 + i * 4], [178, 440 + i * 4], 60), { w: 0.4, d: 300 + i * 10, t: 40 })
        blank(g, E(260, 470, 64))
        ink(g, E(260, 470, 64), { w: 2.6, d: 800, t: 300 })
        ink(g, L([180, 500], [204, 494]), { w: 2, d: 900, t: 150 })
        for (let i = 0; i < 12; i++) ink(g, B([206, 420 + i * 9], [240, 418 + i * 9], [280, 422 + i * 9], [316, 420 + i * 9]), { w: 1.4, d: 1000 + i * 40, t: 100 })
      },
      kette(g) {
        // Kettenbrief, Schneeballsystem, Ausbruch – jeder gibt an mehrere weiter
        letter(g, 160, 330, 40, 0)
        for (let k = 0; k < 3; k++) {
          const x = 80 + k * 80
          ink(g, L([180, 360], [x + 20, 410]), { w: 1.2, d: 300, t: 150 })
          letter(g, x, 410, 30, 400 + k * 80)
          for (let j = 0; j < 3; j++) {
            const xx = x - 24 + j * 28
            ink(g, L([x + 15, 432], [xx + 10, 470]), { w: 0.9, d: 700 + k * 80, t: 100 })
            letter(g, xx, 470, 20, 900 + k * 80 + j * 40)
          }
        }
        for (let r = 0; r < 4; r++) for (let k = 0; k <= r; k++) fig(g, 180 - r * 22 + k * 44, 560 + r * 28, 0.9, { d: 1400 + (r * 4 + k) * 40 })
        dashes(g, [[90, 640], [180, 520], [270, 640]], { w: 1, d: 1500, dash: 4, gap: 4 })
      },
      zehn(g) {
        // jede Runde zehnfach: aus einem Brief werden zehn, hundert, tausend …
        for (let r = 0; r < 4; r++) {
          const n = Math.pow(10, r)
          const y = 350 + r * 70
          if (n <= 100) for (let k = 0; k < Math.min(n, 100); k++) dot(g, 180 - Math.min(n, 25) * 6 + (k % 25) * 12 + 6, y + Math.floor(k / 25) * 8, n > 10 ? 2 : 4, r * 400 + k * 6)
          else {
            hatch(g, RR(30, y - 6, 300, 40, 2), r * 400, true)
            ink(g, RR(30, y - 6, 300, 40, 2), { w: 1.6, d: r * 400, t: 200 })
          }
        }
        earth(g, 180, 620, 30, 1600)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { blatt: {} } },
      { t: T('Ein normales Blatt Papier ist etwa **0,1 Millimeter** dick.', 64), gfx: { dicke: {} } },
      { t: T('Einmal falten: doppelt so dick. Zweimal: vierfach. Jede Faltung **verdoppelt** die Dicke.', 64), gfx: { stapel: {} } },
      { t: T('Nach 10 Faltungen: gut 10 Zentimeter – so dick wie ein **dickes Buch**.', 64), gfx: { buch: {} } },
      { t: T('Nach 20 Faltungen: über **100 Meter** – höher als die meisten Kirchtürme.', 64), gfx: { turm: {} } },
      { t: T('Nach 30 Faltungen: über 100 Kilometer. Der Stapel ragt **bis ins All**.', 64), gfx: { all: {} } },
      { t: T('Nach 27 Faltungen: über 13 Kilometer – höher als der **Mount Everest**.', 64), gfx: { everest: {} } },
      { t: T('Der Mond ist rund 384.000 Kilometer entfernt. Wie viele Faltungen brauchst du? Nur **42**.', 64), gfx: { mond: {} } },
      { t: T('Mit 51 Faltungen reichte der Stapel **bis zur Sonne** – 150 Millionen Kilometer.', 64), gfx: { sonne: {} } },
      { t: T('Und nach 103 Faltungen wäre er dicker als das ganze **beobachtbare Universum**.', 64), gfx: { universum: {} } },
      { t: T('Schon zehn Faltungen ergeben **1.024 Lagen** Papier übereinander.', 64), gfx: { lagen: {} } },
      { t: T('Das liegt an der Verdopplung: Jede einzelne Faltung legt **so viel drauf**, wie schon da ist.', 64), gfx: { f1: { draw: 'formel', args: [['0,1 mm', '×', '2 hoch 42', '≈', '440.000 km'], 360] } } },
      { t: T('In Wirklichkeit schafft das niemand: Schon nach etwa **sieben** Faltungen ist ein normales Blatt so dick wie breit.', 64), gfx: { sieben: {} } },
      { t: T('Jede Faltung halbiert außerdem die **Länge**. Das Blatt wird immer kürzer und dicker – bis es sich nicht mehr biegen lässt.', 64), gfx: { sieben: {} } },
      { t: T('Die Schülerin Britney Gallivan schaffte 2002 **zwölf** Faltungen – mit einem über einen Kilometer langen Papierstreifen.', 64), gfx: { gallivan: {} } },
      { t: T('Sie berechnete dazu eine Formel: Die nötige Papierlänge **explodiert** mit jeder weiteren Faltung.', 64), gfx: { gallivan: {} } },
      { t: T('Und jeder Knick schluckt Papier: Die äußeren Lagen müssen um die inneren herum – darum braucht man einen **riesig langen** Streifen.', 64), gfx: { gallivan: {} } },
      { t: T('Das Gedankenexperiment zeigt, warum **Verdopplungen** unsere Vorstellung sprengen.', 64), gfx: { stapel: {} } },
      { t: T('Dasselbe Muster steckt in Kettenbriefen, Schneeballsystemen und Virusausbrüchen: Der Anfang wirkt **harmlos**.', 64), gfx: { kette: {} } },
      { t: T('Ein Kettenbrief an jeweils zehn Leute erreicht nach zehn Runden **zehn Milliarden** – mehr Menschen, als es gibt.', 64), gfx: { zehn: {} } },
      { t: T('Mit **42** Faltungen bis zum Mond – auf dem Papier.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Jede Faltung verdoppelt die Dicke: 0,1 mm × 2⁴² ≈ 440.000 km – weiter als bis zum Mond.', 'Praktisch scheitert man nach etwa 7 Faltungen; der Rekord mit sehr langem Papier liegt bei 12–13.', 'Verdopplungen sprengen unser Vorstellungsvermögen.'],
    sources: ['Gallivan 2002: How to Fold Paper in Half Twelve Times', 'NASA: Moon Fact Sheet (Entfernung 384.400 km)', 'Bartlett 1978, The Physics Teacher (Exponential Growth)'],
  },
  {
    id: 'gefangenendilemma',
    area: 'DENK',
    day: 78,
    hook: 'Warum handeln zwei vernünftige Menschen zusammen unvernünftig?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [],
    draw: {
      zellen(g) {
        // zwei Zellen mit Gittern und Backsteinwand, dazwischen Verhörtisch mit Lampe
        for (const x of [30, 230]) {
          ink(g, RR(x, 150, 100, 200, 4), { w: 3, t: 700 })
          for (let r = 0; r < 10; r++) for (let c = 0; c < 4; c++) ink(g, L([x + 4 + c * 24 + (r % 2) * 12, 156 + r * 20], [x + 18 + c * 24 + (r % 2) * 12, 156 + r * 20]), { w: 0.6, d: 200 + r * 20, t: 40 })
          fig(g, x + 50, 340, 2.4, { d: 600 })
          for (let k = 1; k < 5; k++) ink(g, L([x + k * 20, 152], [x + k * 20, 348]), { w: 2.4, d: 900 + k * 60, t: 300 })
          ink(g, L([x, 250], [x + 100, 250]), { w: 2, d: 1100, t: 200 })
        }
        ink(g, RR(150, 300, 60, 10, 2), { w: 2, d: 800, t: 200 })
        for (const x of [156, 204]) ink(g, L([x, 310], [x, 350]), { w: 1.8, d: 850, t: 100 })
        ink(g, [[180, 120], [180, 220], [166, 238], [194, 238], [180, 220]], { w: 1.8, d: 900, t: 300 })
        for (let k = 0; k < 3; k++) ink(g, L([170 + k * 10, 242], [160 + k * 20, 296]), { w: 0.8, d: 1100, t: 200 })
        ink(g, L([20, 352], [340, 352]), { w: 2.6, d: 100, t: 500 })
      },
      matrix(g) {
        // Auszahlungstafel ohne Worte: Spalten = B schweigt (Mund zu) / gesteht (Sprechblase), Zeilen = A ebenso;
        // je Feld Striche für die Haftjahre von A (links) und B (rechts); x2 die Kronzeugen-Felder, x1 beide gestehen
        const silent = (x: number, y: number, d: number) => {
          ink(g, E(x, y, 14), { w: 2, d, t: 150 })
          ink(g, L([x - 6, y + 5], [x + 6, y + 5]), { w: 2, d: d + 100, t: 60 })
          for (const k of [-1, 1]) dot(g, x + k * 5, y - 3, 1.6, d + 100)
        }
        const talk = (x: number, y: number, d: number) => {
          ink(g, E(x, y, 14), { w: 2, d, t: 150 })
          ink(g, E(x, y + 6, 5, 4), { w: 1.6, d: d + 100, t: 60 })
          for (const k of [-1, 1]) dot(g, x + k * 5, y - 3, 1.6, d + 100)
          ink(g, RR(x + 16, y - 26, 26, 16, 6), { w: 1.4, d: d + 200, t: 100 })
        }
        silent(150, 320, 200)
        talk(272, 320, 300)
        silent(52, 400, 400)
        talk(40, 510, 500)
        text(g, 52, 432, 'A', { anchor: 'middle', size: 14, d: 400 })
        text(g, 40, 542, 'A', { anchor: 'middle', size: 14, d: 500 })
        text(g, 150, 296, 'B', { anchor: 'middle', size: 14, d: 200 })
        text(g, 272, 296, 'B', { anchor: 'middle', size: 14, d: 300 })
        const tally = (gr: Element, x: number, y: number, n: number, d: number) => {
          if (n === 0) {
            ink(gr, E(x + 12, y, 12, 9), { w: 1.6, d, t: 150 })
            return
          }
          for (let i = 0; i < Math.min(n, 10); i++) {
            const grp = Math.floor(i / 5)
            const j = i % 5
            if (j < 4) ink(gr, L([x + j * 6, y - 12 + grp * 30], [x + j * 6, y + 12 + grp * 30]), { w: 1.8, d: d + i * 30, t: 50 })
            else ink(gr, L([x - 3, y + 10 + grp * 30], [x + 22, y - 10 + grp * 30]), { w: 1.8, d: d + i * 30, t: 50 })
          }
        }
        const cell = (x: number, y: number, a: number, b: number, cls: string, d: number) => {
          const gr = cls ? st(g, cls) : g
          ink(gr, RR(x, y, 120, 100, 10), { w: 2.6, d, t: 400 })
          ink(gr, L([x + 60, y + 8], [x + 60, y + 92]), { w: 0.8, d: d + 100, t: 200 })
          tally(gr, x + 14, y + 36, a, d + 300)
          tally(gr, x + 74, y + 36, b, d + 400)
        }
        cell(90, 345, 1, 1, '', 600)
        cell(222, 345, 10, 0, 'x2', 0)
        cell(90, 455, 0, 10, 'x2', 0)
        cell(222, 455, 5, 5, 'x1', 0)
      },
      beide(g) {
        // beide sitzen je fünf Striche ab – gestrichelt daneben das eine Jahr, das sie hätten haben können
        for (const [x, d] of [[90, 0], [270, 200]] as const) {
          ink(g, RR(x - 60, 380, 120, 220, 4), { w: 2.6, d, t: 500 })
          for (let k = 1; k < 5; k++) ink(g, L([x - 60 + k * 24, 382], [x - 60 + k * 24, 598]), { w: 2, d: d + 600 + k * 50, t: 200 })
          fig(g, x, 600, 3, { d: d + 300 })
          for (let i = 0; i < 4; i++) ink(g, L([x - 40 + i * 8, 610], [x - 40 + i * 8, 640]), { w: 2, d: d + 1000 + i * 60, t: 60 })
          ink(g, L([x - 44, 636], [x - 4, 614]), { w: 2, d: d + 1300, t: 60 })
          dashes(g, L([x + 30, 610], [x + 30, 640]), { w: 1.6, d: d + 1500, dash: 3, gap: 3 })
        }
      },
      axelrod(g) {
        // Turnier der Programme: Bildschirme, Ergebnisbalken
        for (let i = 0; i < 6; i++) {
          const x = 40 + (i % 3) * 100
          const y = 340 + Math.floor(i / 3) * 100
          ink(g, RR(x, y, 80, 60, 8), { w: 2.4, d: i * 150, t: 300 })
          ink(g, RR(x + 8, y + 8, 64, 40, 4), { w: 1.4, d: i * 150 + 200, t: 200 })
          for (let k = 0; k < 3; k++) ink(g, L([x + 14, y + 18 + k * 9], [x + 30 + ((i * 7 + k * 13) % 30), y + 18 + k * 9]), { w: 1, d: i * 150 + 300 + k * 40, t: 60 })
          ink(g, [[x + 30, y + 60], [x + 26, y + 72], [x + 54, y + 72], [x + 50, y + 60]], { w: 1.6, d: i * 150 + 250, t: 100 })
        }
        ink(g, L([40, 640], [320, 640]), { w: 2, d: 900, t: 300 })
        for (let i = 0; i < 6; i++) {
          const h = [40, 26, 32, 18, 36, 22][i]
          const r = RR(50 + i * 46, 640 - h, 30, h, 2)
          hatch(g, r, 1100 + i * 80, i === 0)
          ink(g, r, { w: 1.6, d: 1000 + i * 80, t: 100 })
        }
      },
      titfortat(g) {
        // oben der Gegner, unten „Wie du mir“: hell = kooperieren, dunkel = verraten; Pfeile zeigen das Nachmachen
        const seqA = ['K', 'K', 'V', 'K', 'K', 'K']
        const seqB = ['K', 'K', 'K', 'V', 'K', 'K']
        for (const [y, sneaky] of [[416, true], [516, false]] as const) {
          ink(g, E(40, y, 16), { w: 2, d: 100, t: 150 })
          for (const k of [-1, 1]) dot(g, 40 + k * 5, y - 3, 1.6, 200)
          ink(g, sneaky ? B([32, y + 7], [36, y + 4], [44, y + 10], [48, y + 6]) : B([32, y + 5], [36, y + 10], [44, y + 10], [48, y + 5]), { w: 1.6, d: 200, t: 80 })
        }
        seqA.forEach((m, i) => ball(g, 90 + i * 44, 416, 15, { d: 300 + i * 300, fill: m === 'V' ? 'dicht' : 'hell', t: 200 }))
        seqB.forEach((m, i) => ball(g, 90 + i * 44, 516, 15, { d: 450 + i * 300, fill: m === 'V' ? 'dicht' : 'hell', t: 200 }))
        for (let i = 0; i < 5; i++) arrow(g, L([96 + i * 44, 432], [128 + i * 44, 500]), { w: 1.2, d: 600 + i * 300, t: 150, head: 5 })
      },
      fledermaus(g) {
        // Höhlendecke: zwei Vampirfledermäuse hängen kopfüber; eine gibt der anderen von ihrem Blut ab
        ink(g, smooth([[20, 360], [90, 340], [180, 356], [270, 336], [340, 352]], 3), { w: 2.6, t: 600 })
        hatch(g, [...smooth([[20, 360], [90, 340], [180, 356], [270, 336], [340, 352]], 3), [340, 300], [20, 300]], 300, true)
        const bat = (cx: number, top: number, d: number) => {
          ink(g, L([cx - 4, top], [cx - 4, top + 10]), { w: 1.6, d, t: 60 })
          ink(g, L([cx + 4, top], [cx + 4, top + 10]), { w: 1.6, d, t: 60 })
          const body: P[] = smooth([[cx, top + 10], [cx + 16, top + 30], [cx + 14, top + 80], [cx, top + 100], [cx - 14, top + 80], [cx - 16, top + 30], [cx, top + 10]], 3)
          blank(g, body)
          hatch(g, body, d + 300, true)
          ink(g, body, { w: 2, d: d + 100, t: 300 })
          for (const k of [-1, 1]) {
            const w: P[] = [[cx + k * 14, top + 24], [cx + k * 40, top + 30], [cx + k * 44, top + 60], [cx + k * 34, top + 54], [cx + k * 30, top + 76], [cx + k * 20, top + 66], [cx + k * 14, top + 84]]
            ink(g, w, { w: 1.8, d: d + 200, t: 300 })
            ink(g, [[cx + k * 6, top + 104], [cx + k * 10, top + 116], [cx + k * 2, top + 108]], { w: 1.6, d: d + 300, t: 60 })
          }
          dot(g, cx - 5, top + 96, 1.4, d + 400)
          dot(g, cx + 5, top + 96, 1.4, d + 400)
        }
        bat(110, 352, 300)
        bat(250, 348, 600)
        const dr = glide(g, 110, 0, { ms: 1800, d: 1500, loop: true })
        drop(dr, 128, 470, 0.3, 1400)
        carrow(g, [130, 500], [230, 500], -30, { d: 1300 })
        carrow(g, [230, 540], [130, 540], -30, { d: 1700 })
      },
      ende(g) {
        // zwei reichen sich die Hände
        fig(g, 140, 600, 3.6, { arms: 'push' })
        fig(g, 220, 600, 3.6, { d: 200, arms: 'push' })
        ink(g, E(180, 520, 10, 7), { w: 2, d: 800, t: 150 })
      },
      beispiele(g) {
        // Wettrüsten (zwei Raketen), Preiskampf (Preisschilder), Klima (Schornsteine), Doping (Spritze)
        for (const x of [60, 130]) {
          const r: P[] = [[x, 420], [x - 8, 400], [x - 8, 340], [x, 324], [x + 8, 340], [x + 8, 400], [x, 420]]
          ink(g, r, { w: 2, d: 100, t: 300 })
          ink(g, [[x - 8, 400], [x - 16, 420], [x - 8, 410]], { w: 1.6, d: 300, t: 100 })
          ink(g, [[x + 8, 400], [x + 16, 420], [x + 8, 410]], { w: 1.6, d: 300, t: 100 })
        }
        for (const [x, y, d] of [[220, 340, 400], [270, 380, 500]] as const) {
          const tag: P[] = [[x, y], [x + 50, y], [x + 64, y + 14], [x + 50, y + 28], [x, y + 28], [x, y]]
          ink(g, tag, { w: 2, d, t: 200 })
          ink(g, E(x + 52, y + 14, 3), { w: 1.2, d: d + 100, t: 60 })
          arrow(g, L([x + 20, y + 4], [x + 20, y + 24]), { w: 1.6, d: d + 200, t: 100, head: 5 })
        }
        ink(g, L([30, 600], [170, 600]), { w: 2.2, d: 600, t: 300 })
        for (const x of [60, 110]) {
          ink(g, [[x - 10, 600], [x - 8, 520], [x + 8, 520], [x + 10, 600]], { w: 2, d: 700, t: 300 })
          for (let k = 0; k < 3; k++) {
            const w = wobble(g, { dx: 6, dy: -4, ms: 1600 + k * 200, d: 1000 })
            cloud(w, x + k * 14, 500 - k * 24, 0.2 + k * 0.05, 900 + k * 100, true)
          }
        }
        const sy: P[] = [[210, 560], [300, 540], [304, 556], [214, 576], [210, 560]]
        ink(g, sy, { w: 2.2, d: 1000, t: 300 })
        hatch(g, [[230, 556], [280, 545], [282, 553], [232, 564]], 1200, true)
        ink(g, L([300, 548], [330, 542]), { w: 1.6, d: 1100, t: 100 })
        ink(g, L([210, 568], [196, 572]), { w: 2.6, d: 1100, t: 100 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { zellen: {} } },
      { t: T('Zwei Komplizen werden verhaftet und **getrennt** verhört. Jeder kann schweigen oder gestehen – ohne zu wissen, was der andere tut.', 64), gfx: { matrix: {} } },
      { t: T('Schweigen beide, gibt es für jeden nur **ein Jahr**: Die Beweise reichen nicht für mehr.', 64), gfx: { matrix: {} } },
      { t: T('Gesteht nur einer, kommt er als Kronzeuge **frei** – und der andere bekommt zehn Jahre.', 64), gfx: { matrix: { cls: 'a2' } } },
      { t: T('Gestehen beide, bekommen beide **fünf Jahre**.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Was soll A tun? Schweigt B, ist Gestehen besser: frei statt ein Jahr. Gesteht B, auch: fünf statt **zehn Jahre**.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Egal, was B tut – für A **lohnt sich Gestehen**. B denkt genauso.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Also gestehen beide und sitzen fünf Jahre. Hätten sie geschwiegen, wären es **nur eins** gewesen.', 64), gfx: { beide: {} } },
      { t: T('Das ist das **Gefangenendilemma**: Was für jeden Einzelnen klug ist, ist für beide zusammen schlecht.', 64), gfx: { beide: {} } },
      { t: T('Es steckt überall, wo Misstrauen teuer ist: im Wettrüsten, in Preiskämpfen, beim **Klimaschutz**, beim Doping.', 64), gfx: { beispiele: {} } },
      { t: T('Was hilft? **Wiederholung**. Wer sich öfter begegnet, kann Vertrauen aufbauen – und Verrat beim nächsten Mal bestrafen.', 64), gfx: { titfortat: {} } },
      { t: T('Im Kalten Krieg dachten Strategen genau so: Abrüsten wäre für beide gut – aber wer **zuerst** abrüstet, riskiert alles.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Der Politologe Robert Axelrod ließ 1980 Computerprogramme gegeneinander antreten – Runde um Runde **Gefangenendilemma**.', 64), gfx: { axelrod: {} } },
      { t: T('Es gewann die einfachste Strategie: **Wie du mir, so ich dir**.', 64), gfx: { titfortat: {} } },
      { t: T('Sie beginnt freundlich, macht dann einfach den letzten Zug des Gegners nach – und **verzeiht** sofort, wenn er wieder kooperiert.', 64), gfx: { titfortat: {} } },
      { t: T('Die Natur kennt das auch: Vampirfledermäuse teilen Blut bevorzugt mit Artgenossen, die **ihnen früher** geholfen haben.', 64), gfx: { fledermaus: {} } },
      { t: T('Und im Kleinen: Bei Gruppenarbeiten lohnt sich Faulenzen für jeden Einzelnen – bis **alle** faulenzen.', 64), gfx: { beide: {} } },
      { t: T('Auch Verträge, Kontrollen und ein guter Ruf lösen das Dilemma: Sie ändern, **was sich lohnt**.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Erdacht haben das Spiel Merrill Flood und Melvin Dresher 1950. Albert Tucker erfand die **Geschichte** mit den Gefangenen dazu.', 480), gfx: { zellen: {} } },
      { t: T('Kooperation braucht **Vertrauen** – und ein Wiedersehen.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Für jeden Einzelnen lohnt sich Gestehen – zusammen stehen beide schlechter da.', 'Bei wiederholten Begegnungen gewinnt Kooperation: „Wie du mir, so ich dir“.', 'Verträge, Kontrollen und Ruf ändern, was sich lohnt.'],
    sources: ['Axelrod 1984: The Evolution of Cooperation', 'Poundstone 1992: Prisoner’s Dilemma', 'Flood 1952: Some Experimental Games (RAND)'],
  },
  {
    id: 'benford',
    area: 'DENK',
    day: 25,
    hook: 'Warum beginnen so viele Zahlen mit einer 1?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [],
    draw: {
      einsen(g) {
        // Zahlen aus dem Alltag: Preisschild, Hausnummer, Ortsschild, Kurstafel – auffällig oft vorne eine 1
        const tag: P[] = [[30, 130], [110, 130], [128, 150], [110, 170], [30, 170], [30, 130]]
        ink(g, tag, { w: 2.2, t: 300 })
        ink(g, E(114, 150, 3), { w: 1.2, d: 200, t: 60 })
        text(g, 70, 158, '1,49', { anchor: 'middle', size: 20, d: 300 })
        ink(g, RR(210, 110, 70, 50, 6), { w: 2.4, d: 300, t: 300 })
        text(g, 245, 145, '17', { anchor: 'middle', size: 26, d: 500 })
        ink(g, RR(40, 220, 130, 60, 4), { w: 2.4, d: 600, t: 300 })
        ink(g, RR(46, 226, 118, 48, 3), { w: 1, d: 700, t: 300 })
        text(g, 105, 260, '12 km', { anchor: 'middle', size: 22, d: 800 })
        ink(g, RR(200, 210, 130, 110, 4), { w: 2.4, d: 800, t: 300 })
        for (const [y, l] of [[240, '184,2'], [270, '1.037'], [300, '96,5']] as const) text(g, 312, y, l, { anchor: 'end', size: 16, d: 1000 + y })
        for (const [y, up] of [[234, true], [264, true], [294, false]] as const) ink(g, up ? [[214, y + 2], [220, y - 6], [226, y + 2]] : [[214, y - 6], [220, y + 2], [226, y - 6]], { w: 1.6, d: 1000 + y, t: 60 })
        text(g, 80, 400, '1.904', { anchor: 'middle', size: 30, d: 1300 })
        text(g, 250, 390, '3', { anchor: 'middle', size: 34, d: 1400 })
      },
      listen(g) {
        // Skyline (Einwohner), Flussschleife (Länge), Kassenzettel (Beträge), Kurskurve (Börse)
        for (let k = 0; k < 6; k++) ink(g, RR(30 + k * 20, 440 - ((k * 37) % 60) - 30, 16, ((k * 37) % 60) + 30, 1), { w: 1.6, d: k * 60, t: 150 })
        ink(g, L([24, 440], [156, 440]), { w: 1.8, d: 400, t: 200 })
        ink(g, smooth([[200, 340], [260, 360], [220, 400], [300, 420], [250, 440], [330, 460]], 4), { w: 3, d: 500, t: 600 })
        const rc: P[] = [[50, 500], [140, 500], [140, 620], [130, 628], [120, 620], [110, 628], [100, 620], [90, 628], [80, 620], [70, 628], [60, 620], [50, 628], [50, 500]]
        ink(g, rc, { w: 2, d: 800, t: 400 })
        for (let k = 0; k < 5; k++) ink(g, L([60, 516 + k * 18], [100 + ((k * 13) % 30), 516 + k * 18]), { w: 1, d: 1000 + k * 60, t: 80 })
        axes(g, 200, 620, 330, 500, { d: 1000 })
        ink(g, [[206, 600], [226, 590], [240, 596], [262, 570], [280, 576], [300, 540], [320, 548]], { w: 2.2, d: 1200, t: 400 })
      },
      gleich(g) {
        vbars(g, Array.from({ length: 9 }, (_, i) => ({ label: String(i + 1), v: 11.1, fmt: () => '' })), { x: 30, base: 600, w: 26, gap: 35, h: 230, max: 32 })
        question(g, 180, 380, 0.6, 1400)
      },
      echt(g) {
        const v = [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6]
        vbars(g, v.map((x, i) => ({ label: String(i + 1), v: x, fmt: () => '', dense: i === 0 })), { x: 30, base: 600, w: 26, gap: 35, h: 230, max: 32 })
        dplot(g, 43, 600, 280, 230 * (30.1 / 32), (t) => Math.log10(1 + 1 / (1 + t * 8)) / Math.log10(2), 1200)
      },
      tafeln(g) {
        // aufgeschlagene Logarithmentafel: vordere Seiten abgegriffen und verschmutzt, hintere sauber
        const book: P[] = [[40, 600], [40, 400], [180, 380], [320, 400], [320, 600], [180, 580], [40, 600]]
        ink(g, book, { w: 2.8, t: 700 })
        ink(g, L([180, 380], [180, 580]), { w: 2, d: 300, t: 300 })
        for (let k = 0; k < 9; k++) {
          ink(g, L([54, 420 + k * 18], [166, 404 + k * 18]), { w: 0.6, d: 400 + k * 30, t: 80 })
          ink(g, L([194, 404 + k * 18], [306, 420 + k * 18]), { w: 0.6, d: 400 + k * 30, t: 80 })
        }
        for (const [x, y, r] of [[80, 440, 18], [130, 500, 14], [70, 540, 12], [150, 430, 10]] as const) {
          const sm: P[] = smooth(Array.from({ length: 9 }, (_, k) => [x + Math.cos(rad(k * 45)) * r * (1 + (k % 2) * 0.3), y + Math.sin(rad(k * 45)) * r * 0.7] as P), 3)
          hatch(g, sm, 900 + x)
        }
        for (let k = 0; k < 4; k++) ink(g, B([40 - k * 3, 600 + k * 4], [100, 590 + k * 4], [150, 584 + k * 3], [180, 582 + k * 3]), { w: 1, d: 700 + k * 60, t: 200 })
        hatch(g, E(70, 468, 14, 20), 1300, true)
      },
      stadt(g) {
        // eine wachsende Stadt: die lange Zeit mit 1 vorne ist markiert, die 8 und 9 vorne vergehen schnell
        axes(g, 40, 600, 330, 320, { xl: 'Zeit', yl: 'Einwohner' })
        plot(g, 46, 596, 270, 240, (t) => (Math.pow(10, t) - 1) / 9, { d: 400 })
        const xAt = (v: number) => 46 + 270 * Math.log10(1 + 9 * v)
        hatch(g, RR(46, 596 - 0, xAt(1 / 9) - 46, 10, 1), 1200, true)
        hatch(g, RR(xAt(7 / 9), 596, xAt(8 / 9) - xAt(7 / 9), 10, 1), 1400)
        for (const v of [1 / 9, 7 / 9, 8 / 9]) dashes(g, L([xAt(v), 596], [xAt(v), 596 - v * 240]), { w: 1, d: 1300, dash: 3, gap: 3 })
      },
      log(g) {
        ink(g, L([30, 470], [330, 470]), { w: 2.6, t: 600 })
        for (let k = 1; k <= 10; k++) {
          const x = 30 + Math.log10(k) * 300
          ink(g, L([x, 456], [x, 484]), { w: 2, d: 200 + k * 60, t: 100 })
          if (k < 10) text(g, x + (30 + Math.log10(k + 1) * 300 - x) / 2, 450, String(k), { anchor: 'middle', d: 400 + k * 60 })
        }
        hatch(g, RR(30, 486, 90.3, 20, 2), 1100, true)
        hatch(g, RR(30 + Math.log10(9) * 300, 486, 300 - Math.log10(9) * 300, 20, 2), 1300)
      },
      strasse(g) {
        // Straße mit 19 Hausnummern
        ink(g, L([20, 620], [340, 620]), { w: 2.6, t: 500 })
        for (let i = 0; i < 19; i++) {
          const row = Math.floor(i / 10)
          const x = 26 + (i % 10) * 32
          const y = 450 + row * 110
          ink(g, [[x, y + 50], [x, y + 10], [x + 14, y], [x + 28, y + 10], [x + 28, y + 50]], { w: 1.6, d: i * 50, t: 150 })
          ink(g, RR(x + 9, y + 30, 10, 20, 1), { w: 1, d: i * 50 + 60, t: 60 })
          const one = String(i + 1).startsWith('1')
          if (one) hatch(g, RR(x + 4, y + 12, 20, 14, 2), 900 + i * 50, true)
          text(g, x + 14, y + 24, String(i + 1), { anchor: 'middle', size: 11, cls: one ? 'halo' : 's', d: i * 50 + 100 })
        }
      },
      steuer(g) {
        // Steuerbeleg mit Zahlenspalte; Lupe zeigt: erfundene Anfangsziffern verteilt wie gleich hohe Balken
        ink(g, RR(40, 340, 200, 280, 4), { w: 2.4, t: 500 })
        for (let i = 0; i < 11; i++) {
          ink(g, L([54, 362 + i * 22], [150, 362 + i * 22]), { w: 0.8, d: 200 + i * 40, t: 100 })
          ink(g, L([170, 362 + i * 22], [226, 362 + i * 22]), { w: 1.8, d: 300 + i * 40, t: 100 })
        }
        blank(g, E(260, 470, 70))
        ink(g, E(260, 470, 70), { w: 2.8, d: 800, t: 400 })
        ink(g, L([310, 520], [340, 560]), { w: 4, d: 900, t: 150 })
        for (let k = 0; k < 9; k++) {
          const h = 36 + ((k * 7) % 3) * 3
          ink(g, RR(222 + k * 9, 500 - h, 6, h, 1), { w: 1, d: 1000 + k * 40, t: 60 })
        }
        dplot(g, 225, 500, 72, 70, (t) => Math.log10(1 + 1 / (1 + t * 8)) / Math.log10(2), 1500, 1.4)
      },
      ende(g) {
        text(g, 180, 540, '1', { anchor: 'middle', size: 140, d: 200 })
        rays(g, 180, 490, 70, 96, 12, 700)
      },
      wachstum2(g) {
        // von 1 auf 2 ist ein langer Weg, von 8 auf 9 ein kurzer
        ink(g, L([30, 470], [330, 470]), { w: 2.6, t: 600 })
        for (let k = 1; k <= 10; k++) {
          const x = 30 + Math.log10(k) * 300
          ink(g, L([x, 456], [x, 484]), { w: 2, d: 200 + k * 60, t: 100 })
          text(g, x, 510, String(k), { anchor: 'middle', d: 300 + k * 60 })
        }
        carrow(g, [30, 450], [120, 450], -40, { d: 1000 })
        carrow(g, [301, 450], [316, 450], -14, { d: 1400 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { einsen: {} } },
      { t: T('Nimm irgendeine Liste echter Zahlen: Einwohner von Städten, Längen von Flüssen, Rechnungsbeträge, Börsenkurse.', 64), gfx: { listen: {} } },
      { t: T('Wie oft beginnen sie mit 1, 2, 3 … bis 9? Man würde denken: jede Ziffer **gleich oft** – also je rund 11 Prozent.', 64), gfx: { gleich: {} } },
      { t: T('Tatsächlich beginnen rund **30 Prozent** mit einer 1 – und nur knapp 5 Prozent mit einer 9.', 64), gfx: { echt: {} } },
      { t: T('Das ist das **Benfordsche Gesetz**. Zuerst bemerkt hat es der Astronom Simon Newcomb 1881 – an Büchern voller Logarithmentafeln.', 64), gfx: { tafeln: {} } },
      { t: T('Die vorderen Seiten, für Zahlen mit 1 am Anfang, waren **viel abgegriffener** als die hinteren.', 64), gfx: { tafeln: {} } },
      { t: T('Warum? Denk an etwas, das **wächst** – etwa eine Stadt mit 100.000 Einwohnern.', 64), gfx: { stadt: {} } },
      { t: T('Um auf 200.000 zu kommen, muss sie sich **verdoppeln**. So lange steht vorne eine 1.', 64), gfx: { stadt: {} } },
      { t: T('Von 800.000 auf 900.000 braucht es dagegen nur gut **12 Prozent** Wachstum. Die 8 vorne hält nur kurz.', 64), gfx: { wachstum2: {} } },
      { t: T('Auf einer **logarithmischen** Skala, die Verdopplungen gleich lang zeigt, nimmt die 1 den größten Abschnitt ein.', 64), gfx: { log: {} } },
      { t: T('Genauer: Der Anteil der Ziffer d ist der Logarithmus von **1 plus 1 durch d**. Für die 1 ergibt das rund 30 Prozent.', 64), gfx: { f2: { draw: 'formel', args: [['Anteil der 1', '=', 'log₁₀(2)', '≈', '30 %'], 360] } } },
      { t: T('Ein Alltagsbeispiel: In einer Straße mit 19 Häusern beginnen die Nummern 1 und 10 bis 19 mit einer 1 – **elf von neunzehn**.', 64), gfx: { strasse: {} } },
      { t: T('Es klappt nur bei Zahlen, die über **viele Größenordnungen** streuen – nicht bei Körpergrößen oder Schulnoten.', 64), gfx: { echt: {} } },
      { t: T('Und es gilt in jeder Einheit: Ob Euro oder Dollar, Meter oder Fuß – die Verteilung **bleibt gleich**.', 64), gfx: { echt: {} } },
      { t: T('Der Physiker Frank Benford prüfte 1938 über **20.000 Zahlen** aus 20 Quellen – von Flusslängen bis zu Baseball-Statistiken.', 64), gfx: { echt: {} } },
      { t: T('Auch für die zweite Ziffer gibt es eine Regel – sie ist aber **viel schwächer**: Die 0 kommt dort nur etwas häufiger vor.', 64), gfx: { gleich: {} } },
      { t: T('Steuerfahnder nutzen das: Wer Zahlen **erfindet**, verteilt die Anfangsziffern meist viel zu gleichmäßig.', 64), gfx: { steuer: {} } },
      { t: T('Eine auffällige Abweichung ist ein **Hinweis** – kein Beweis – auf geschönte Bilanzen oder gefälschte Daten.', 64), gfx: { steuer: {} } },
      { t: T('Die 1 gewinnt, weil Wachstum **bei ihr** am längsten verweilt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['In vielen echten Datensätzen beginnen ~30 % der Zahlen mit 1, nur ~5 % mit 9 (Benford).', 'Grund: Wachstum braucht von 1 zu 2 eine Verdopplung, von 8 zu 9 nur 12 %.', 'Steuerfahnder nutzen Abweichungen als Hinweis auf erfundene Zahlen.'],
    sources: ['Newcomb 1881, American Journal of Mathematics 4', 'Benford 1938, Proceedings of the American Philosophical Society 78', 'Nigrini 2012: Benford’s Law (Forensic Accounting)'],
  },
  {
    id: 'spielerfehlschluss',
    area: 'DENK',
    day: 25,
    hook: 'Im Casino kam 26-mal hintereinander Schwarz. Was kommt jetzt?',
    mood: 'dunkel',
    ambience: 'uhr',
    images: [],
    draw: {
      rad(g) {
        // Roulettekessel mit Kugel, die im Kreis läuft
        wheel(g, 180, 260, 130)
        ink(g, E(180, 260, 150), { w: 2, d: 300, t: 700 })
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45 + 22)
          ink(g, L([180 + Math.cos(a) * 132, 260 + Math.sin(a) * 132], [180 + Math.cos(a) * 148, 260 + Math.sin(a) * 148]), { w: 1.4, d: 800 + k * 40, t: 60 })
        }
        const b = spin(g, 180, 260, -1400, 1200)
        ball(b, 180, 260 - 112, 6, { d: 1100, w: 1.6, t: 60 })
        for (let k = 0; k < 4; k++) ink(g, L([180 + Math.cos(rad(k * 90)) * 10, 260 + Math.sin(rad(k * 90)) * 10], [180 + Math.cos(rad(k * 90)) * 30, 260 + Math.sin(rad(k * 90)) * 30]), { w: 2.4, d: 900, t: 100 })
      },
      serie(g) {
        // Anzeigetafel am Tisch: die letzten Ergebnisse – alle schwarz
        ink(g, RR(110, 320, 140, 320, 6), { w: 2.8, t: 500 })
        ink(g, L([180, 640], [180, 660]), { w: 3, d: 200, t: 100 })
        for (let i = 0; i < 13; i++) {
          for (const k of [0, 1]) {
            const n = i * 2 + k
            if (n >= 26) continue
            ball(g, 150 + k * 60, 344 + i * 22, 9, { d: n * 80, fill: 'dicht', t: 0, w: 1.4 })
          }
        }
      },
      gedaechtnis(g) {
        // Kessel, Kugel – und daneben ein durchgestrichenes Gedächtnis
        wheel(g, 140, 480, 100)
        const b = spin(g, 140, 480, -1600, 600)
        ball(b, 140, 480 - 86, 5, { d: 500, w: 1.4, t: 60 })
        brain(g, 290, 400, 0.4, 800)
        strike(g, [250, 370], [330, 430], 1300)
      },
      folgen(g) {
        // oben ausgedacht (Bleistift): wechselt dauernd; unten echt geworfen (Hand mit Münze): lange Serien
        ink(g, [[30, 380], [60, 410], [64, 406], [34, 376], [30, 380]], { w: 1.8, t: 200 })
        ink(g, [[60, 410], [66, 416], [64, 406]], { w: 1.4, d: 100, t: 80 })
        'KZKZZKZKKZKZ'.split('').forEach((c, i) => coinKZ(g, 90 + i * 22, 400, c === 'K', 200 + i * 60, 9))
        ink(g, smooth([[30, 540], [44, 520], [60, 526], [64, 540], [50, 552], [30, 540]], 3), { w: 1.8, d: 800, t: 200 })
        const fc = glide(g, 0, -20, { ms: 600, d: 1000, loop: true })
        ink(fc, E(54, 510, 6, 2), { w: 1.4, d: 900, t: 60 })
        'KKKKZZKZZZZZ'.split('').forEach((c, i) => coinKZ(g, 90 + i * 22, 540, c === 'K', 1100 + i * 60, 9))
        for (const [a, b] of [[0, 3], [7, 11]] as const) ink(g, RR(90 + a * 22 - 13, 526, (b - a) * 22 + 26, 28, 12), { w: 1.4, d: 1900, t: 200 })
      },
      lauf(g) {
        for (let i = 0; i < 40; i++) {
          const run = i >= 14 && i < 20
          coinKZ(g, 30 + (i % 10) * 33, 380 + Math.floor(i / 10) * 50, run || i % 3 === 0, i * 40, 11)
        }
        ink(g, RR(30 + 4 * 33 - 16, 430 - 16, 6 * 33, 32, 14), { w: 2, d: 1800, t: 400 })
      },
      korb(g) {
        // Wurf auf den Korb: Brett, Ring mit Netz, Flugbahn
        ink(g, RR(250, 330, 80, 60, 3), { w: 2.4, t: 400 })
        ink(g, RR(276, 350, 28, 20, 2), { w: 1.4, d: 200, t: 150 })
        ink(g, L([330, 360], [340, 360]), { w: 2.4, d: 200, t: 100 })
        ink(g, E(260, 396, 24, 6), { w: 2.4, d: 300, t: 200 })
        for (let k = 0; k < 5; k++) ink(g, L([240 + k * 10, 400], [246 + k * 7, 434]), { w: 0.8, d: 400 + k * 40, t: 80 })
        ink(g, L([246, 434], [274, 434]), { w: 0.8, d: 600, t: 80 })
        fig(g, 90, 630, 4, { arms: 'up', d: 400 })
        dashes(g, B([110, 480], [150, 340], [220, 330], [252, 390]), { w: 1.2, d: 900, dash: 4, gap: 4 })
        const bl = glide(g, 140, -80, { ms: 1400, d: 1200, loop: true })
        ball(bl, 112, 470, 12, { d: 1000, w: 2, t: 100 })
        ink(bl, L([100, 470], [124, 470]), { w: 1, d: 1100, t: 60 })
        for (const k of [0, 1, 2]) check(g, 60 + k * 40, 360, 0.4, 1600 + k * 150)
      },
      null0(g) {
        // Kessel mit hervorgehobenem Null-Fach; der Croupier zieht die Jetons zur Bank
        wheel(g, 150, 470, 100)
        const a0 = rad(-90)
        const a1 = rad(-70)
        const pocket: P[] = [[150 + Math.cos(a0) * 72, 470 + Math.sin(a0) * 72], [150 + Math.cos(a0) * 100, 470 + Math.sin(a0) * 100], [150 + Math.cos(a1) * 100, 470 + Math.sin(a1) * 100], [150 + Math.cos(a1) * 72, 470 + Math.sin(a1) * 72]]
        blank(g, pocket)
        ink(g, [...pocket, pocket[0]], { w: 2.4, d: 900, t: 200 })
        ripple(g, (pocket[0][0] + pocket[2][0]) / 2, (pocket[0][1] + pocket[2][1]) / 2, 6, 30, { n: 2, ms: 1600, d: 1100, w: 1 })
        const ch = glide(g, 60, 0, { ms: 1400, d: 1300, loop: true })
        for (let k = 0; k < 4; k++) {
          ink(ch, E(270, 600 - k * 8, 20, 6), { w: 1.6, d: 1200, t: 100 })
          ink(ch, L([250, 600 - k * 8], [250, 606 - k * 8]), { w: 1.2, d: 1200, t: 40 })
          ink(ch, L([290, 600 - k * 8], [290, 606 - k * 8]), { w: 1.2, d: 1200, t: 40 })
        }
      },
      gross(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Würfe', yl: 'Anteil Kopf' })
        dashes(g, L([46, 460], [320, 460]), { w: 1.2, d: 300 })
        plot(g, 46, 600, 270, 280, (t) => 0.5 + 0.35 * Math.exp(-t * 6) * Math.cos(t * 30), { d: 600 })
      },
      lotto(g) {
        // Lostrommel mit Kugeln, daneben die Zahlen der letzten Woche – sie haben dieselbe Chance
        ink(g, E(110, 460, 80), { w: 2.8, t: 600 })
        const dr = spin(g, 110, 460, 3000, 800)
        for (let k = 0; k < 14; k++) ball(dr, 110 + Math.cos(rad(k * 50)) * (30 + (k % 3) * 14), 460 + Math.sin(rad(k * 50)) * (30 + (k % 3) * 14), 9, { d: 600 + k * 40, w: 1.4, t: 60 })
        ink(g, [[110, 540], [90, 600], [130, 600], [110, 540]], { w: 2.4, d: 300, t: 300 })
        for (let i = 0; i < 6; i++) {
          ball(g, 230 + (i % 2) * 52, 380 + Math.floor(i / 2) * 60, 20, { d: 1000 + i * 150, w: 2.4, t: 200 })
          text(g, 230 + (i % 2) * 52, 387 + Math.floor(i / 2) * 60, String([3, 11, 17, 24, 38, 42][i]), { anchor: 'middle', cls: 's', d: i * 150 + 1100 })
        }
      },
      ende(g) {
        wheel(g, 180, 490, 90)
        const b = spin(g, 180, 490, -1600, 500)
        ball(b, 180, 490 - 78, 5, { d: 400, w: 1.4, t: 60 })
      },
      selten(g) {
        // ein einziger markierter Punkt unter sehr vielen – und der nächste Wurf ist trotzdem wieder fast halb-halb
        dotgrid(g, 30, 330, 40, 26, 7.7, 1.8)
        ball(g, 184, 425, 6, { d: 1500, fill: 'dicht', w: 1.6, t: 60 })
        ripple(g, 184, 425, 6, 30, { n: 2, ms: 1600, d: 1700, w: 1 })
        for (const k of [0, 1]) {
          ink(g, E(150 + k * 60, 560 + 60, 18), { w: 2, d: 1800 + k * 100, t: 150 })
          if (k) hatch(g, E(210, 620, 16), 1900, true)
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { rad: {} } },
      { t: T('Monte Carlo, 18. August 1913: Am Roulettetisch fällt die Kugel immer wieder auf **Schwarz**.', 64), gfx: { serie: {} } },
      { t: T('Nach 15-mal Schwarz setzen die Spieler immer mehr auf **Rot**. Jetzt muss es doch endlich kommen!', 64), gfx: { serie: {} } },
      { t: T('Es kam Schwarz. Wieder und wieder – insgesamt **26-mal** in Folge. Die Spieler verloren Millionen Francs.', 64), gfx: { serie: {} } },
      { t: T('Ihr Denkfehler heißt **Spielerfehlschluss**: der Glaube, Zufall gleiche sich auf kurze Sicht aus.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Die Kugel hat **kein Gedächtnis**. Jeder Wurf ist neu – die Chance auf Schwarz bleibt bei knapp 50 Prozent.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Eine Serie von 26 gleichen Farben ist extrem selten: etwa **1 zu 68 Millionen**. Der 27. Wurf ist trotzdem wieder fast fifty-fifty.', 64), gfx: { selten: {} } },
      { t: T('Unser Gehirn erwartet, dass Zufall **abwechslungsreich** aussieht. Ausgedachte Folgen wechseln darum viel zu oft.', 64), gfx: { folgen: {} } },
      { t: T('Echte Zufallsfolgen haben lange Serien: Bei 100 Münzwürfen kommt fast immer eine Serie von **mindestens fünf** gleichen vor.', 64), gfx: { lauf: {} } },
      { t: T('Lehrer können so oft erkennen, ob Schüler ihre Münzwürfe **wirklich geworfen** oder erfunden haben.', 64), gfx: { folgen: {} } },
      { t: T('Lottospieler meiden oft Zahlen, die **letzte Woche** kamen. Dabei haben sie genau dieselbe Chance wie alle anderen.', 64), gfx: { lotto: {} } },
      { t: T('Kahneman und Tversky nannten das das „**Gesetz der kleinen Zahlen**“: Wir erwarten von wenigen Würfen, was erst viele leisten.', 64), gfx: { folgen: {} } },
      { t: T('Das Gegenstück ist die „**heiße Hand**“: Wer dreimal getroffen hat, trifft bestimmt wieder.', 64), gfx: { korb: {} } },
      { t: T('Lange galt sie als reine Illusion. Neuere Auswertungen finden im Basketball aber einen **kleinen echten** Effekt.', 64), gfx: { korb: {} } },
      { t: T('Der Unterschied: Ein Mensch kann **in Form** sein. Eine Roulettekugel nicht.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Das Gesetz der großen Zahlen gilt nur **auf lange Sicht**: Über Tausende Würfe nähert sich der Anteil 50 Prozent – lange Serien bleiben trotzdem möglich.', 64), gfx: { gross: {} } },
      { t: T('Und das Casino gewinnt sowieso: Die grüne **Null** sichert ihm bei jedem einzelnen Spiel 2,7 Prozent Vorteil.', 64), gfx: { null0: {} } },
      { t: T('Zufall hat **kein Gedächtnis**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['1913 kam in Monte Carlo 26-mal Schwarz – die Spieler setzten Millionen auf Rot.', 'Jeder Wurf ist unabhängig; Zufall gleicht sich nicht kurzfristig aus.', 'Echte Zufallsfolgen haben längere Serien, als wir erwarten.'],
    sources: ['Huff 1959: How to Take a Chance (Monte Carlo 1913)', 'Tversky & Kahneman 1971, Psychological Bulletin 76', 'Miller & Sanjurjo 2018, Econometrica 86 (heiße Hand)'],
  },
]
