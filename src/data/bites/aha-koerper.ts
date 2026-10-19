import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, brain, bubble, check, clock, cross, crowd, dashes, fig, group, hatch, hbars, ink, letter, lie, mk, question, rays, st, text, timeline, vbars, type P } from './draw'
import { arcArrow, axes, ball, bird, box, carrow, cloud, dot, drop, earth, eyeFront, flake, flame, flow, glide, ground, heart, lens, mapRegion, pie, plot, rad, ripple, smooth, spin, sun, thermo, tree, waveP, wobble } from './kit'

// Leben & Körper: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Blatt mit Mittelrippe und Seitenadern, Stiel unten links, Spitze nach rechts oben */
function leaf(g: Element, cx: number, cy: number, s = 1, d = 0): P[] {
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
function mito(g: Element, cx: number, cy: number, s = 1, d = 0): void {
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
function bact(g: Element, x: number, y: number, s = 1, d = 0, fill = false): void {
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
function virus(g: Element, cx: number, cy: number, r: number, d = 0): void {
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
function antibody(g: Element, x: number, y: number, s = 1, deg = 0, d = 0): void {
  const r = ([a, b]: P): P => [x + a * s * Math.cos(rad(deg)) - b * s * Math.sin(rad(deg)), y + a * s * Math.sin(rad(deg)) + b * s * Math.cos(rad(deg))]
  for (const k of [-1, 1]) {
    ink(g, [r([k * 2.2, 0]), r([k * 2.2, -18])], { w: 2, d, t: 200 })
    ink(g, [r([k * 2.2, -18]), r([k * 12, -30])], { w: 2.2, d: d + 150, t: 200 })
    ink(g, [r([k * 7, -16]), r([k * 17, -26])], { w: 1.6, d: d + 250, t: 200 })
  }
  ink(g, [r([-2.2, -12]), r([2.2, -12])], { w: 1, d: d + 300, t: 60 })
}

/** DNA als Doppelhelix (waagerecht): zwei Stränge umeinander, dazwischen die Basenpaare */
function ladder(g: Element, x0: number, x1: number, y: number, h = 30, d = 0, t = 800): void {
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
function cell(g: Element, cx: number, cy: number, rx: number, ry: number, d = 0, nucleus = true): void {
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

/** Hautquerschnitt: Oberfläche (mit Beule, wenn up), Haarbalg, Haar, Haaraufrichter-Muskel; Haar tritt bei (x, y) aus */
function skin(g: Element, x: number, y: number, up: boolean, d = 0, s = 1): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const surf: P[] = up ? [...L(P(-140, 0), P(10, 0)), ...B(P(10, 0), P(16, -20), P(40, -20), P(46, 0)).slice(1), ...L(P(46, 0), P(140, 0)).slice(1)] : L(P(-140, 0), P(140, 0))
  ink(g, surf, { w: 3, d, t: 600 })
  ink(g, L(P(-7, 2), P(10, 98)), { w: 2.2, d: d + 300, t: 400 })
  ink(g, L(P(7, 2), P(26, 98)), { w: 2.2, d: d + 300, t: 400 })
  ball(g, x + 18 * s, y + 110 * s, 12 * s, { d: d + 600, fill: 'dicht', w: 2, t: 300 })
  ink(g, up ? L(P(14, 98), P(0, -110)) : [...L(P(14, 98), P(0, 0)), ...B(P(0, 0), P(-4, -14), P(-40, -36), P(-110, -40)).slice(1)], { w: 2.4, d: d + 700, t: 600 })
  const m: [P, P] = up ? [P(22, 70), P(52, 26)] : [P(24, 76), P(70, 22)]
  const mid: P = [(m[0][0] + m[1][0]) / 2, (m[0][1] + m[1][1]) / 2]
  const nx = (m[1][1] - m[0][1]) * (up ? 0.22 : 0.12)
  const ny = -(m[1][0] - m[0][0]) * (up ? 0.22 : 0.12)
  const spindle: P[] = [...B(m[0], [mid[0] + nx, mid[1] + ny], [mid[0] + nx, mid[1] + ny], m[1]), ...B(m[1], [mid[0] - nx, mid[1] - ny], [mid[0] - nx, mid[1] - ny], m[0]).slice(1)]
  hatch(g, spindle, d + 1000, true)
  ink(g, spindle, { w: 1.8, d: d + 900, t: 300 })
}

/** Aufgewickelter Faden: Spirale nach innen (kreuzt sich nicht) */
function coil(g: Element, cx: number, cy: number, r: number, d = 0): void {
  const pts: P[] = []
  for (let a = 0; a < Math.PI * 2 * 7; a += 0.12) {
    const rr = r * (1 - a / (Math.PI * 2 * 7.4))
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.85])
  }
  ink(g, pts, { w: 1.4, d, t: 1600 })
}

/** Leiterstück zwischen zwei Punkten (schräg) */
function lad(g: Element, a: P, b: P, h = 26, d = 0): void {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / len
  const uy = (b[1] - a[1]) / len
  const nx = -uy * (h / 2)
  const ny = ux * (h / 2)
  ink(g, L([a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny]), { w: 2.4, d, t: 600 })
  ink(g, L([a[0] - nx, a[1] - ny], [b[0] - nx, b[1] - ny]), { w: 2.4, d, t: 600 })
  for (let t = 10; t < len - 4; t += 14) {
    const x = a[0] + ux * t
    const y = a[1] + uy * t
    ink(g, L([x + nx * 0.8, y + ny * 0.8], [x - nx * 0.8, y - ny * 0.8]), { w: 1.4, d: d + (t / len) * 600, t: 80 })
  }
}


/** Kleiner Drehregler */
function regler0(g: Element, cx: number, cy: number, d = 0): void {
  ink(g, E(cx, cy, 30), { w: 2.6, d, t: 500 })
  ink(g, L([cx, cy], [cx + 18, cy - 16]), { w: 3, d: d + 400, t: 200 })
  dot(g, cx, cy, 4, d + 400)
}

export const AHA_KOERPER: Bite[] = [
  {
    id: 'baum-aus-luft',
    area: 'BIO',
    day: 33,
    hook: 'Woraus besteht eigentlich ein Baum?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [],
    draw: {
      baum(g) {
        sun(g, 300, 110, 20, 0, 10)
        ground(g, 20, 340, 440, 0)
        tree(g, 170, 440, 1.9, 200)
        bird(g, 60, 120, 0.8, 1200)
        for (let i = 0; i < 3; i++) {
          const f = glide(g, -60 - i * 20, 140, { ms: 5000 + i * 800, d: 1500 + i * 700, loop: true })
          ink(f, E(250 + i * 30, 230 + i * 20, 5, 2.6), { w: 1.4, d: 1500, t: 100 })
        }
      },
      gewicht(g) {
        ground(g, 20, 340, 620, 0)
        tree(g, 110, 620, 1.6, 200)
        // Gewicht mit Henkel und Fragezeichen
        const kb: P[] = [...B([220, 620], [200, 560], [220, 500], [270, 500]), ...B([270, 500], [320, 500], [340, 560], [320, 620]).slice(1), [220, 620]]
        blank(g, kb)
        hatch(g, kb, 900, true)
        ink(g, kb, { w: 2.8, d: 700, t: 500 })
        ink(g, B([236, 506], [236, 450], [304, 450], [304, 506]), { w: 4, d: 900, t: 300 })
        text(g, 270, 584, '? t', { anchor: 'middle', size: 34, cls: 'halo', d: 1200 })
      },
      boden(g) {
        // Boden im Schnitt: Schichten, Steine, verzweigte Wurzeln – kommt die Masse von dort?
        ground(g, 20, 340, 480, 0)
        hatch(g, RR(20, 482, 320, 170, 4), 300)
        for (const [x, y, r] of [[60, 600, 10], [280, 560, 14], [210, 630, 8], [110, 540, 7]] as const) {
          blank(g, E(x, y, r, r * 0.7))
          ink(g, E(x, y, r, r * 0.7), { w: 1.6, d: 500, t: 200 })
        }
        tree(g, 180, 480, 1.2, 200)
        const root = (a: P, b: P, c: P, dd: number) => ink(g, B(a, [(a[0] + b[0]) / 2, a[1] + 20], b, c), { w: 2, d: dd, t: 300 })
        root([176, 484], [140, 540], [100, 580], 700)
        root([184, 484], [230, 540], [260, 600], 750)
        root([180, 486], [176, 560], [190, 620], 800)
        root([150, 530], [126, 520], [80, 520], 900)
        root([220, 530], [250, 520], [300, 512], 950)
        for (const x of [100, 260]) {
          const p = L([x, 620], [x + (180 - x) * 0.4, 520])
          arrow(g, p, { w: 2, d: 1000, t: 400, head: 8 })
          flow(g, p, { n: 2, ms: 1200, d: 1400, r: 2.2 })
        }
        question(g, 300, 380, 0.8, 1300)
      },
      topf(g) {
        // van Helmonts Versuch: Topf mit Erde, Weidenzweig – nach fünf Jahren ein Baum
        const pot: P[] = [[100, 520], [260, 520], [240, 640], [120, 640], [100, 520]]
        blank(g, pot)
        ink(g, pot, { w: 3, t: 600 })
        ink(g, L([94, 520], [266, 520]), { w: 3.4, d: 200, t: 300 })
        hatch(g, [[106, 540], [254, 540], [244, 600], [116, 600]], 400)
        const small = st(g, 'h1')
        ink(small, L([180, 540], [180, 470]), { w: 2.4, d: 600, t: 300 })
        ink(small, B([180, 490], [200, 470], [214, 470], [222, 476]), { w: 2, d: 800, t: 300 })
        ink(small, B([180, 480], [160, 462], [148, 462], [140, 468]), { w: 2, d: 900, t: 300 })
        const big = st(g, 'x1', '--o: 180px 540px')
        tree(big, 180, 540, 1.3, 0)
        text(g, 30, 470, 'Erde: 90,7 kg', { cls: 's', d: 1000 })
        text(st(g, 'f1', '--dl:500ms'), 340, 330, 'Weide: 2,3 → 76,7 kg', { anchor: 'end', cls: 's', fade: false })
        text(st(g, 'f2'), 30, 496, '− 57 g', { size: 18, fade: false })
      },
      wasser(g) {
        // nur gegossen: Gießkanne über dem Topf
        const pot: P[] = [[150, 560], [290, 560], [272, 650], [168, 650], [150, 560]]
        blank(g, pot)
        ink(g, pot, { w: 2.8, t: 500 })
        hatch(g, [[156, 576], [284, 576], [276, 620], [164, 620]], 300)
        tree(g, 220, 576, 0.7, 300)
        const can: P[] = [[40, 380], [110, 380], [104, 440], [46, 440], [40, 380]]
        blank(g, can)
        ink(g, can, { w: 2.6, d: 400, t: 400 })
        ink(g, L([110, 400], [160, 370]), { w: 2.4, d: 600, t: 200 })
        ink(g, E(162, 368, 6, 4), { w: 1.8, d: 700, t: 100 })
        ink(g, B([44, 386], [20, 380], [20, 420], [44, 424]), { w: 2, d: 600, t: 200 })
        for (let i = 0; i < 4; i++) flow(g, B([164, 370], [176, 380], [184, 420 + i * 6], [190 + i * 6, 500]), { n: 2, ms: 900, d: 900 + i * 100, r: 1.8, kind: 'dash' })
        question(g, 310, 420, 0.8, 1300)
      },
      kohlenstoff(g) {
        // Holzscheibe mit Jahresringen – zur Hälfte Kohlenstoff
        blank(g, E(150, 470, 110, 96))
        for (let k = 1; k < 9; k++) ink(g, E(150 + k * 1.5, 470, 110 - k * 12, 96 - k * 10.5, k * 20, k * 20 + 340), { w: k === 1 ? 2.8 : 1, d: k * 80, t: 300 })
        ink(g, L([150, 470], [254, 440]), { w: 1.2, d: 800, t: 200 })
        ink(g, E(150, 470, 110, 96), { w: 3, t: 700 })
        pie(g, 300, 600, 34, 0.5, 1000)
        text(g, 300, 556, 'C', { anchor: 'middle', size: 18, d: 1600 })
      },
      blatt(g) {
        leaf(g, 170, 540, 1.3)
        // Spaltöffnung in der Lupe: zwei Schließzellen, dazwischen strömt CO₂ hinein
        blank(g, E(280, 420, 60))
        for (const k of [-1, 1]) {
          const gc: P[] = [...B([280, 384], [280 + k * 34, 392], [280 + k * 34, 448], [280, 456]), ...B([280, 456], [280 + k * 12, 440], [280 + k * 12, 400], [280, 384]).slice(1)]
          hatch(g, gc, 1000, true)
          ink(g, gc, { w: 2, d: 800, t: 400 })
        }
        ink(g, E(280, 420, 60), { w: 2.8, d: 700, t: 500 })
        ink(g, L([236, 462], [198, 512]), { w: 1.4, d: 900, t: 200 })
        ;[[40, 330], [110, 310], [170, 336]].forEach(([x, y], i) => {
          const m = glide(g, 280 - x - 6, 420 - y, { ms: 3200, d: 1300 + i * 600, loop: true })
          ball(m, x - 9, y, 5.5, { d: 1100 + i * 200, w: 1.4, t: 0 })
          ball(m, x + 9, y, 5.5, { d: 1100 + i * 200, w: 1.4, t: 0 })
          ball(m, x, y, 7, { d: 1150 + i * 200, fill: 'dicht', w: 1.6, t: 0 })
        })
        text(g, 40, 300, 'CO₂', { d: 1400 })
      },
      formel(g) {
        // Chloroplast: CO₂ und H₂O hinein, mit Licht entsteht Zucker, O₂ geht hinaus
        const cp = E(180, 490, 90, 54)
        blank(g, cp)
        ink(g, cp, { w: 3, t: 700 })
        ink(g, E(180, 490, 82, 46), { w: 1.2, d: 200, t: 600 })
        for (const [x, y] of [[130, 476], [170, 504], [210, 474], [244, 500]] as const)
          for (let k = 0; k < 4; k++) {
            hatch(g, RR(x - 12, y - 10 + k * 6, 24, 5, 2.5), 600, true)
            ink(g, RR(x - 12, y - 10 + k * 6, 24, 5, 2.5), { w: 0.9, d: 500 + k * 40, t: 100 })
          }
        sun(g, 300, 340, 16, 300, 10)
        for (const y of [370, 390]) flow(g, L([286, y], [236, 436]), { n: 2, ms: 900, d: 800, r: 1.8, kind: 'dash' })
        const inA = L([40, 380], [104, 444])
        arrow(g, inA, { w: 2, d: 900, t: 300, head: 8 })
        text(g, 40, 370, 'CO₂', { d: 900 })
        const inB = L([40, 610], [104, 534])
        arrow(g, inB, { w: 2, d: 1000, t: 300, head: 8 })
        text(g, 40, 634, 'H₂O', { d: 1000 })
        arrow(g, L([256, 534], [316, 610]), { w: 2, d: 1300, t: 300, head: 8 })
        text(g, 290, 640, 'Zucker', { anchor: 'middle', d: 1400 })
        arrow(g, L([180, 436], [180, 380]), { w: 2, d: 1400, t: 300, head: 8 })
        text(g, 160, 372, 'O₂', { anchor: 'end', d: 1500 })
        flow(g, inA, { n: 2, ms: 1200, d: 1300, r: 2 })
      },
      bilanz(g) {
        // ein Holzscheit – und fast doppelt so viel CO₂, das der Baum dafür aus der Luft geholt hat
        const log: P[] = [[40, 470], [150, 470], [150, 520], [40, 520], [40, 470]]
        blank(g, log)
        hatch(g, log, 400)
        ink(g, log, { w: 2.6, t: 500 })
        ink(g, E(150, 495, 10, 25), { w: 2.2, d: 300, t: 300 })
        for (let k = 1; k < 4; k++) ink(g, E(150, 495, 10 - k * 2.5, 25 - k * 6), { w: 0.9, d: 500, t: 200 })
        arrow(g, L([240, 495], [168, 495]), { w: 3, d: 700, t: 400, head: 10 })
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 9; i++) {
          const x = 262 + rnd() * 70
          const y = 410 + rnd() * 170
          ball(g, x - 7, y, 4.5, { d: 900 + i * 60, w: 1.2, t: 0 })
          ball(g, x + 7, y, 4.5, { d: 900 + i * 60, w: 1.2, t: 0 })
          ball(g, x, y, 6, { d: 950 + i * 60, fill: 'dicht', w: 1.4, t: 0 })
        }
        text(g, 95, 556, '1 kg', { anchor: 'middle', size: 18, d: 1500 })
        text(g, 296, 616, '1,8 kg', { anchor: 'middle', size: 18, d: 1600 })
      },
      verdunsten(g) {
        sun(g, 318, 300, 14, 0, 10)
        ground(g, 20, 340, 620, 0)
        tree(g, 170, 620, 1.5, 200)
        flow(g, L([170, 620], [170, 470]), { n: 4, ms: 1600, d: 1000, r: 2.2 })
        for (const [x, y, d] of [[80, 330, 900], [170, 300, 1000], [260, 330, 1100]] as const) {
          drop(g, x, y, 0.5, d, false)
          flow(g, L([x, y - 16], [x + 6, y - 70]), { n: 2, ms: 1800, d: d + 400, r: 1.6, kind: 'ring' })
        }
      },
      zellulose(g) {
        // Zellulose: Zuckerringe, über Sauerstoffbrücken zur langen Kette verbunden; viele Ketten bilden eine Faser
        for (let i = 0; i < 5; i++) {
          const cx = 50 + i * 65
          const cy = 420 + (i % 2 ? 14 : -14)
          const hx: P[] = Array.from({ length: 7 }, (_, k) => [cx + Math.cos(rad(k * 60 + 30)) * 24, cy + Math.sin(rad(k * 60 + 30)) * 24])
          hatch(g, hx, 400 + i * 150)
          ink(g, hx, { w: 2.6, d: i * 150, t: 400 })
          text(g, cx + 12, cy - 6, 'O', { cls: 's halo', d: 300 + i * 150, size: 10 })
          if (i < 4) {
            ink(g, L([cx + 21, cy + (i % 2 ? -12 : 12) * 0.5], [cx + 44, cy + (i % 2 ? -8 : 8)]), { w: 2, d: 300 + i * 150, t: 150 })
            dot(g, cx + 33, cy + (i % 2 ? -10 : 10) * 0.5, 2.4, 400 + i * 150)
          }
        }
        for (let k = 0; k < 6; k++) ink(g, smooth([[30, 540 + k * 14], [120, 534 + k * 14], [240, 546 + k * 14], [330, 538 + k * 14]]), { w: 1.4, d: 1100 + k * 80, t: 500 })
        ink(g, L([180, 450], [180, 530]), { w: 1, d: 1000, t: 200 })
      },
      sauerstoff(g) {
        leaf(g, 170, 540, 1.3)
        ;[[90, 340], [200, 330], [300, 370]].forEach(([x, y], i) => {
          const m = glide(g, 0, -60, { ms: 2600, d: 1300 + i * 400, loop: true })
          ball(m, x - 8, y + 60, 8, { d: 1000 + i * 200, w: 1.8, t: 0 })
          ball(m, x + 8, y + 60, 8, { d: 1000 + i * 200, w: 1.8, t: 0 })
        })
        for (const [a, b] of [[[120, 470], [96, 392]], [[200, 460], [200, 386]], [[250, 490], [290, 422]]] as const) arrow(g, L(a as P, b as P), { w: 2, d: 900, t: 400, head: 8 })
      },
      anteile(g) {
        hbars(g, [
          { label: 'Kohlenstoff, Sauerstoff', v: 93, fmt: (v) => `${Math.round(v)} %` },
          { label: 'H', v: 6, fmt: (v) => `${Math.round(v)} %` },
          { label: 'Kalium, Calcium, Magnesium …', v: 1, fmt: () => '≈ 1 %', dense: true },
        ], { y: 340, gap: 100, max: 100 })
        cloud(g, 300, 650, 0.35, 1400)
        drop(g, 230, 630, 0.5, 1500)
        hatch(g, RR(130, 630, 50, 20, 4), 1600, true)
        ink(g, RR(130, 630, 50, 20, 4), { w: 1.6, d: 1600, t: 200 })
      },
      feuer(g) {
        // Lagerfeuer: Holz verbrennt, CO₂ steigt auf, zurück bleibt Asche
        for (const [a, b] of [[[80, 610], [210, 580]], [[90, 580], [220, 612]]] as [P, P][]) {
          const lg: P[] = [[a[0], a[1] - 9], [b[0], b[1] - 9], [b[0], b[1] + 9], [a[0], a[1] + 9], [a[0], a[1] - 9]]
          blank(g, lg)
          hatch(g, lg, 300)
          ink(g, lg, { w: 2.2, t: 400 })
        }
        flame(g, 150, 590, 1.2, 300)
        for (const x of [110, 150, 190]) flow(g, L([x, 470], [x + 14, 320]), { n: 3, ms: 2000, d: 900 + x, r: 2.4, kind: 'ring' })
        const ash: P[] = [...B([250, 622], [266, 590], [300, 590], [316, 622])]
        hatch(g, [...ash, [250, 622]], 1500, true)
        ink(g, ash, { w: 2.4, d: 1300, t: 400 })
        ink(g, L([30, 624], [340, 624]), { w: 2.6, d: 1200, t: 300 })
      },
      luftbaum(g) {
        ground(g, 20, 340, 620, 0)
        tree(g, 180, 620, 1.7, 200)
        for (const [a, b] of [[[30, 330], [86, 380]], [[330, 330], [274, 380]], [[40, 460], [82, 450]], [[320, 460], [278, 450]]] as const) {
          arrow(g, L(a as P, b as P), { w: 2.2, d: 1200, t: 400, head: 9 })
          flow(g, L(a as P, b as P), { n: 2, ms: 1400, d: 1600, r: 2.2 })
        }
      },
      wald(g) {
        ground(g, 20, 340, 620, 0)
        ;[[60, 0.7], [140, 0.9], [230, 0.8], [310, 0.65]].forEach(([x, s], i) => tree(g, x, 620, s, 200 + i * 200))
        hatch(g, RR(20, 622, 320, 30, 3), 1200, true)
        for (let i = 0; i < 6; i++) dot(g, 40 + i * 52, 638, 2.4, 1400 + i * 50)
      },
      kette(g) {
        // Luft → Blatt → Apfel → du
        ball(g, 40, 466, 6, { w: 1.4, t: 0 })
        ball(g, 54, 466, 6, { w: 1.4, t: 0 })
        ball(g, 47, 466, 8, { fill: 'dicht', w: 1.6, t: 0 })
        arrow(g, L([66, 464], [96, 464]), { w: 2.4, d: 300, t: 300, head: 9 })
        leaf(g, 150, 470, 0.45, 400)
        arrow(g, L([196, 464], [220, 464]), { w: 2.4, d: 800, t: 300, head: 9 })
        ball(g, 246, 470, 18, { d: 900, fill: 'hell', w: 2.2 })
        ink(g, L([246, 452], [250, 440]), { w: 1.8, d: 1000, t: 100 })
        arrow(g, L([268, 464], [290, 464]), { w: 2.4, d: 1100, t: 300, head: 9 })
        fig(g, 318, 510, 2, { d: 1200 })
      },
      ende(g) {
        ground(g, 30, 330, 620, 0)
        tree(g, 180, 620, 1.4, 0)
        for (const [a, b] of [[[30, 400], [80, 440]], [[330, 400], [280, 440]]] as const) flow(g, L(a as P, b as P), { n: 3, ms: 1400, d: 800, r: 2.2 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { baum: {} } },
      { t: T('Ein großer Baum kann **viele Tonnen** wiegen. Doch woher kommt all diese Masse eigentlich?', 64), gfx: { gewicht: {} } },
      { t: T('Die naheliegende Antwort: aus dem **Boden**. Die Wurzeln saugen die Erde gewissermaßen in den Stamm.', 64), gfx: { boden: {} } },
      { t: T('Das prüfte der Arzt Jan Baptist van Helmont um 1640. Er pflanzte einen Weidenzweig in einen Topf mit gut **90 Kilo** Erde.', 64), gfx: { topf: {} } },
      { t: T('Fünf Jahre lang gab er nur Wasser dazu. Aus dem Zweig wurde eine Weide von über **76 Kilo**.', 64), gfx: { topf: { cls: 'a1' } } },
      { t: T('Und die Erde im Topf? Sie war nur um **57 Gramm** leichter geworden.', 64), gfx: { topf: { cls: 'a1 a2' } } },
      { t: T('Van Helmont schloss: Der Baum besteht aus **Wasser**. Halb richtig – das Wichtigste übersah er.', 64), gfx: { wasser: {} } },
      { t: T('Trockenes Holz besteht etwa zur Hälfte aus **Kohlenstoff**. Und den holt sich der Baum aus der Luft.', 64), gfx: { kohlenstoff: {} } },
      { t: T('Durch winzige Poren in den Blättern nimmt er **Kohlendioxid** auf – ein Gas, das nur 0,04 Prozent der Luft ausmacht.', 64), gfx: { blatt: {} } },
      { t: T('Mit der Energie des Sonnenlichts baut er aus CO₂ und Wasser **Zucker**. Das ist die Fotosynthese.', 64), gfx: { formel: {} } },
      { t: T('Für jedes Kilogramm trockenes Holz holt ein Baum rund **1,8 Kilogramm** CO₂ aus der Luft. Den Sauerstoff daraus gibt er großteils wieder ab.', 64), gfx: { bilanz: {} } },
      { t: T('Aus Zucker baut er **Zellulose** und Holz. Ketten aus Tausenden Zuckerbausteinen – fest genug für einen Stamm.', 64), gfx: { zellulose: {} } },
      { t: T('Den Sauerstoff, den wir atmen, gibt der Baum dabei als **Abfall** ab.', 64), gfx: { sauerstoff: {} } },
      { t: T('Rechnet man nach, stammt fast die ganze Trockenmasse aus der Luft. Aus dem Boden kommen nur Wasser und **Mineralien**.', 64), gfx: { anteile: {} } },
      { t: T('Das Wasser aus dem Boden geht übrigens größtenteils wieder hinaus: Eine große Buche verdunstet an heißen Tagen **hunderte Liter**.', 64), gfx: { verdunsten: {} } },
      { t: T('Verbrennt das Holz, wird der Kohlenstoff wieder zu CO₂ und geht **zurück in die Luft**. Übrig bleibt die Asche: die Mineralien aus dem Boden.', 64), gfx: { feuer: {} } },
      { t: T('Ein Baum ist also im Grunde **verfestigte Luft** – zusammengebaut mit Sonnenlicht.', 64), gfx: { luftbaum: {} } },
      { t: T('Darum sind Wälder riesige **Kohlenstoffspeicher** – solange das Holz nicht verrottet oder verbrennt.', 64), gfx: { wald: {} } },
      { t: T('Auch du bestehst zu knapp einem Fünftel aus Kohlenstoff. Den hat vorher eine **Pflanze** aus der Luft geholt.', 64), gfx: { kette: {} } },
      { t: T('Ein Baum wächst **aus der Luft** – nicht aus dem Boden.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Van Helmonts Weide wurde 74 kg schwerer, die Erde im Topf nur 57 g leichter.', 'Fast die ganze Trockenmasse eines Baums stammt aus dem CO₂ der Luft (Fotosynthese).', 'Aus dem Boden kommen nur Wasser und ein bis zwei Prozent Mineralien – die Asche.'],
    sources: ['van Helmont 1648: Ortus medicinae (Weidenversuch)', 'Lamlom & Savidge 2003, Biomass and Bioenergy 25', 'Campbell Biology, Kap. Fotosynthese'],
  },
  {
    id: 'gaensehaut',
    area: 'BIO',
    day: 86,
    hook: 'Warum bekommst du Gänsehaut?',
    mood: 'raetsel',
    ambience: 'wind',
    images: [],
    draw: {
      haut(g) {
        // Hautoberfläche von der Seite: die Härchen richten sich auf, daneben wölbt sich je eine Beule
        let x = 30
        const surf: P[] = [[20, 330]]
        for (let i = 0; i < 6; i++) {
          surf.push(...B([x, 330], [x + 8, 310], [x + 30, 310], [x + 38, 330]).slice(1), ...L([x + 38, 330], [x + 52, 330]).slice(1))
          const h = mk('g', {}, g)
          mk('animateTransform', { attributeName: 'transform', type: 'rotate', from: `-62 ${x + 26} 318`, to: `0 ${x + 26} 318`, dur: '1.2s', begin: `${0.9 + i * 0.15}s`, fill: 'freeze', calcMode: 'spline', keySplines: '.3 0 .2 1', keyTimes: '0;1' }, h)
          ink(h, B([x + 26, 318], [x + 27, 290], [x + 30, 260], [x + 32, 230]), { w: 1.8, d: 600 + i * 100, t: 300 })
          x += 52
        }
        ink(g, surf, { w: 3, t: 900 })
        hatch(g, [...surf, [340, 330], [340, 420], [20, 420]], 600)
        for (let i = 0; i < 6; i++) ink(g, L([56 + i * 52, 330], [64 + i * 52, 400]), { w: 1.2, d: 900 + i * 60, t: 200 })
      },
      quer(g) {
        // Schnitt durch die Haut: Oberhaut, Lederhaut, Fettgewebe; Haarbalg mit Muskel
        for (let i = 0; i < 6; i++) ball(g, 40 + i * 56, 610, 18, { d: 300 + i * 50, w: 1.2, t: 0 })
        ink(g, smooth([[20, 590], [120, 584], [240, 592], [340, 586]]), { w: 1.4, d: 200, t: 600 })
        ink(g, smooth([[20, 440], [120, 436], [240, 442], [340, 438]]), { w: 1, d: 200, t: 600 })
        const flat = st(g, 'h1')
        skin(flat, 160, 420, false, 0, 1.3)
        const up = st(g, 'f1')
        skin(up, 160, 420, true, 0, 1.3)
        dashes(g, L([300, 620], [236, 500]), { w: 1, d: 1300, dash: 3, gap: 4 })
        ink(g, E(232, 494, 22, 30, -40, 320), { w: 1.4, d: 1400, t: 300 })
      },
      nerv(g) {
        // Kopf im Profil, Rückenmark nach unten, entlang der Wirbelsäule der Grenzstrang, von dort Fasern zur Haut
        brain(g, 110, 380, 0.7)
        ink(g, B([150, 430], [160, 470], [164, 540], [166, 640]), { w: 3, d: 700, t: 600 })
        for (let k = 0; k < 6; k++) {
          const y = 470 + k * 28
          dot(g, 190, y, 4, 1000 + k * 60)
          ink(g, L([168, y - 2], [186, y]), { w: 1, d: 1000 + k * 60, t: 100 })
        }
        const skinL = L([300, 380], [300, 640])
        ink(g, skinL, { w: 2.6, d: 500, t: 500 })
        for (const y of [490, 560]) {
          const p = B([194, y], [230, y - 10], [260, y + 10], [296, y])
          ink(g, p, { w: 1.6, d: 1300, t: 400 })
          flow(g, p, { n: 2, ms: 900, d: 1700, r: 2 })
        }
        for (const y of [420, 470, 520, 570, 620]) ink(g, L([302, y], [326, y - 18]), { w: 1.2, d: 1600, t: 150 })
      },
      reflexbogen(g) {
        // Kälte an der Haut → Signal ins Rückenmark (Schnitt mit der Schmetterlingsform der grauen Substanz) → zurück zum Haarmuskel
        ink(g, L([20, 610], [180, 610]), { w: 3, t: 400 })
        for (let i = 0; i < 6; i++) ink(g, L([30 + i * 26, 608], [32 + i * 26, 590]), { w: 1.2, d: 300 + i * 40, t: 100 })
        flake(g, 60, 420, 22, 300)
        for (const y of [470, 510]) flow(g, L([60, 450], [70, 580]), { n: 2, ms: 1200, d: 700 + y, r: 1.8, kind: 'dash' })
        blank(g, E(270, 480, 60, 50))
        ink(g, E(270, 480, 60, 50), { w: 2.8, d: 200, t: 600 })
        const bf: P[] = smooth([[270, 450], [246, 438], [236, 460], [250, 480], [234, 506], [250, 516], [270, 500], [290, 516], [306, 506], [290, 480], [304, 460], [294, 438], [270, 450]], 4)
        hatch(g, bf, 700, true)
        ink(g, bf, { w: 1.6, d: 500, t: 500 })
        const inP = B([90, 600], [140, 520], [200, 450], [244, 444])
        arrow(g, inP, { w: 2, d: 900, t: 600, head: 8 })
        flow(g, inP, { n: 2, ms: 1200, d: 1500, r: 2.2 })
        const outP = B([252, 512], [210, 540], [170, 570], [150, 604])
        arrow(g, outP, { w: 2, d: 1500, t: 500, head: 8 })
        flow(g, outP, { n: 2, ms: 1200, d: 2000, r: 2.2 })
      },
      fell(g) {
        // links: Fell liegt an, Kälte zieht durch – rechts: aufgestellt, eine ruhende Luftschicht dämmt
        for (const [x0, upright, d] of [[30, false, 0], [200, true, 500]] as const) {
          ink(g, L([x0, 520], [x0 + 130, 520]), { w: 3, d, t: 400 })
          hatch(g, RR(x0, 522, 130, 40, 2), d + 300, true)
          for (let i = 0; i < 9; i++) {
            if (upright) ink(g, L([x0 + 6 + i * 14, 518], [x0 + 10 + i * 14, 440]), { w: 1.6, d: d + 300 + i * 40, t: 150 })
            else ink(g, B([x0 + 6 + i * 14, 518], [x0 + 14 + i * 14, 508], [x0 + 26 + i * 14, 504], [x0 + 32 + i * 14, 502]), { w: 1.6, d: d + 300 + i * 40, t: 150 })
          }
          if (upright) hatch(g, RR(x0 + 4, 444, 122, 72, 4), d + 900)
          for (const y of [380, 410]) {
            const p = upright ? L([x0 + 10, y], [x0 + 120, y]) : B([x0 + 10, y], [x0 + 60, y + 40], [x0 + 90, y + 100], [x0 + 100, 500])
            arrow(g, p, { w: 1.4, d: d + 1000, t: 400, head: 6 })
            flow(g, p, { n: 2, ms: 1400, d: d + 1400, r: 1.8, kind: 'dash' })
          }
        }
        thermo(g, 100, 580, 50, 0.2, 1600)
        thermo(g, 270, 580, 50, 0.7, 1700)
      },
      igel(g) {
        // Igel: Stacheln richten sich auf, Schnauze, Auge, Beinchen
        const body = E(180, 520, 110, 64, 180, 360)
        for (let k = 0; k <= 16; k++) {
          const a = rad(190 + k * 10)
          const s = mk('g', {}, g)
          mk('animateTransform', { attributeName: 'transform', type: 'rotate', from: `-30 ${180 + Math.cos(a) * 110} ${520 + Math.sin(a) * 64}`, to: `0 ${180 + Math.cos(a) * 110} ${520 + Math.sin(a) * 64}`, dur: '0.8s', begin: `${1 + k * 0.04}s`, fill: 'freeze' }, s)
          ink(s, L([180 + Math.cos(a) * 108, 520 + Math.sin(a) * 63], [180 + Math.cos(a) * 152, 520 + Math.sin(a) * 98]), { w: 2, d: 600 + k * 40, t: 150 })
        }
        blank(g, [...body, [70, 520]])
        hatch(g, [...body, [70, 520]], 500)
        ink(g, body, { w: 3, t: 700 })
        const face: P[] = smooth([[262, 474], [300, 490], [324, 512], [312, 520], [270, 520]], 4)
        blank(g, face)
        ink(g, face, { w: 2.4, d: 400, t: 400 })
        dot(g, 324, 512, 4, 800)
        dot(g, 294, 494, 2.6, 900)
        for (const x of [110, 150, 220, 250]) ink(g, L([x, 520], [x - 2, 536]), { w: 2.4, d: 700, t: 100 })
        ground(g, 40, 330, 536, 300)
      },
      katze(g) {
        // links entspannt, rechts mit gesträubtem Fell und Buckel – wirkt größer
        ground(g, 20, 340, 606, 0)
        const calm: P[] = smooth([[30, 600], [36, 560], [70, 548], [120, 552], [140, 574], [144, 600]], 4)
        blank(g, calm)
        hatch(g, calm, 500)
        ink(g, calm, { w: 2.6, t: 600 })
        ink(g, E(146, 548, 18, 16), { w: 2.4, d: 300, t: 400 })
        for (const k of [-1, 1]) ink(g, [[146 + k * 12, 538], [146 + k * 14, 520], [146 + k * 4, 532]], { w: 2, d: 500, t: 200 })
        ink(g, B([30, 590], [10, 580], [14, 550], [24, 540]), { w: 2.4, d: 600, t: 300 })
        const arch: P[] = smooth([[196, 604], [200, 520], [240, 470], [290, 480], [318, 530], [322, 604]], 4)
        for (let k = 0; k < 22; k++) {
          const q = arch[Math.round((k / 21) * (arch.length - 1))]
          ink(g, L(q, [q[0] + (q[0] - 260) * 0.12, q[1] - 14]), { w: 1.4, d: 900 + k * 25, t: 80 })
        }
        blank(g, [...arch, [196, 604]])
        hatch(g, [...arch, [196, 604]], 1100, true)
        ink(g, arch, { w: 2.6, d: 700, t: 700 })
        ink(g, E(326, 520, 18, 16), { w: 2.4, d: 900, t: 300 })
        for (const k of [-1, 1]) ink(g, [[326 + k * 12, 510], [326 + k * 18, 494], [326 + k * 4, 504]], { w: 2, d: 1000, t: 200 })
        ink(g, B([200, 520], [176, 480], [184, 440], [196, 420]), { w: 3, d: 1100, t: 300 })
        for (let k = 0; k < 6; k++) ink(g, L([186 + (k % 2) * 6, 430 + k * 14], [174 + (k % 2) * 6, 426 + k * 14]), { w: 1.2, d: 1200, t: 80 })
      },
      erbe(g) {
        // Vorfahr mit dichtem Fell – heute nur noch feine Härchen
        const ape: P[] = smooth([[60, 620], [56, 520], [70, 460], [100, 440], [130, 460], [140, 520], [136, 620]], 4)
        blank(g, ape)
        hatch(g, ape, 400, true)
        ink(g, ape, { w: 2.6, t: 700 })
        ink(g, E(100, 420, 26, 24), { w: 2.6, d: 300, t: 400 })
        hatch(g, E(100, 420, 26, 24), 600, true)
        blank(g, E(106, 424, 14, 12))
        ink(g, E(106, 424, 14, 12), { w: 1.6, d: 600, t: 200 })
        for (let k = 0; k < 14; k++) ink(g, L([60 + (k % 2) * 76, 470 + k * 10], [52 + (k % 2) * 92, 466 + k * 10]), { w: 1, d: 800, t: 60 })
        arrow(g, L([160, 520], [200, 520]), { w: 2.2, d: 900, t: 300, head: 8 })
        fig(g, 270, 620, 5, { d: 1000 })
        for (let i = 0; i < 5; i++) ink(g, L([292 + i * 4, 540], [294 + i * 4, 532]), { w: 1, d: 1400 + i * 60, t: 80 })
      },
      angst(g) {
        const ghost: P[] = [...B([100, 600], [90, 460], [110, 380], [160, 380]), ...B([160, 380], [210, 380], [230, 460], [220, 600]).slice(1), [200, 580], [180, 600], [160, 580], [140, 600], [120, 580], [100, 600]]
        const gw = wobble(g, { dy: -8, ms: 2200, d: 800 })
        blank(gw, ghost)
        ink(gw, ghost, { w: 3, t: 900 })
        dot(gw, 140, 450, 6, 700)
        dot(gw, 180, 450, 6, 750)
        ink(gw, E(160, 500, 12, 18), { w: 2.4, d: 800, t: 300 })
        fig(g, 290, 620, 2.4, { d: 1000, arms: 'up' })
        for (let k = 0; k < 6; k++) ink(g, L([276 + k * 6, 538], [274 + k * 6, 524]), { w: 1, d: 1300 + k * 50, t: 80 })
        text(g, 300, 480, '!', { anchor: 'middle', size: 40, d: 1300 })
      },
      musik(g) {
        // Person mit Kopfhörer, Noten fliegen heran, ein Schauer läuft den Rücken hinab
        fig(g, 220, 640, 5.4, { d: 0 })
        ink(g, E(220, 486, 26, 26, 180, 360), { w: 3, d: 500, t: 300 })
        for (const s of [-1, 1]) {
          blank(g, RR(220 + s * 24 - 6, 482, 12, 20, 4))
          ink(g, RR(220 + s * 24 - 6, 482, 12, 20, 4), { w: 2.4, d: 600, t: 200 })
        }
        for (const [x, y, d] of [[40, 400, 0], [90, 360, 300], [60, 470, 600]] as const) {
          const n = glide(g, 120, 60, { ms: 3000, d: 900 + d, loop: true })
          ink(n, E(x, y + 30, 9, 7), { w: 2.2, d, t: 300 })
          hatch(n, E(x, y + 30, 9, 7), d + 200, true)
          ink(n, L([x + 8, y + 28], [x + 8, y - 12]), { w: 2, d: d + 200, t: 200 })
          ink(n, B([x + 8, y - 12], [x + 20, y - 6], [x + 22, y + 2], [x + 18, y + 10]), { w: 1.8, d: d + 300, t: 200 })
        }
        flow(g, L([246, 530], [252, 620]), { n: 3, ms: 1200, d: 1400, r: 2, kind: 'dash' })
        flow(g, L([194, 530], [188, 620]), { n: 3, ms: 1200, d: 1500, r: 2, kind: 'dash' })
      },
      dopamin(g) {
        // Belohnungssystem: vom Mittelhirn ziehen Dopamin-Bahnen zum Nucleus accumbens
        brain(g, 180, 460, 1.1)
        const p = B([200, 520], [190, 500], [160, 480], [140, 470])
        ink(g, p, { w: 2, d: 1100, t: 400 })
        flow(g, p, { n: 4, ms: 1200, d: 1400, r: 2.6 })
        ball(g, 136, 468, 14, { d: 1300, fill: 'dicht', t: 300 })
        ball(g, 204, 524, 8, { d: 1200, fill: 'hell', t: 300 })
        ripple(g, 136, 468, 16, 40, { n: 2, ms: 1600, d: 1700, w: 1.2 })
      },
      verliebt(g) {
        // dieselbe Region reagiert auf Essen, auf Liebe – und auf Musik
        brain(g, 180, 470, 1.0)
        ball(g, 150, 476, 13, { d: 900, fill: 'dicht', t: 300 })
        heart(g, 300, 340, 0.6, 900)
        ink(g, L([40, 330], [40, 380]), { w: 2.2, d: 1000, t: 200 })
        for (const k of [-6, 0, 6]) ink(g, L([40 + k, 330], [40 + k, 346]), { w: 1.6, d: 1100, t: 100 })
        ink(g, B([70, 330], [80, 336], [80, 360], [70, 380]), { w: 2.2, d: 1100, t: 200 })
        for (const [a, b] of [[[60, 390], [138, 460]], [[290, 370], [164, 466]]] as [P, P][]) {
          arrow(g, L(a, b), { w: 1.6, d: 1300, t: 400, head: 7 })
          flow(g, L(a, b), { n: 2, ms: 1300, d: 1700, r: 2 })
        }
      },
      welle(g) {
        // Unterarm: die Härchen stellen sich nacheinander auf, wie eine Welle
        const arm: P[] = [...B([20, 420], [120, 400], [240, 400], [340, 390]), ...L([340, 390], [340, 520]).slice(1), ...B([340, 520], [240, 530], [120, 530], [20, 540]).slice(1)]
        ink(g, arm, { w: 3, t: 800 })
        ink(g, B([60, 470], [120, 466], [200, 470], [300, 460]), { w: 0.9, d: 400, t: 600 })
        for (let i = 0; i < 18; i++) {
          const x = 40 + (i % 9) * 34
          const y = 440 + Math.floor(i / 9) * 50 + (i % 2) * 10
          const k = Math.floor((i % 9) / 3) + 1
          const grp = st(g, `x${k}`, `--o: ${x}px ${y}px; --dl: ${(i % 3) * 120}ms`)
          ink(grp, E(x, y, 5, 4, 180, 360), { w: 1.6, t: 0 })
          ink(grp, L([x, y - 4], [x + 2, y - 16]), { w: 1, t: 0 })
        }
        flow(g, L([40, 380], [320, 370]), { n: 2, ms: 1600, d: 1200, r: 2.4, kind: 'dash' })
      },
      ueberraschung(g) {
        // Lautstärke einer Musik: ruhig, dann ein unerwarteter Einsatz – genau dort der Schauer
        axes(g, 30, 620, 330, 340, { d: 0 })
        ink(g, [...waveP(30, 200, 500, 14, 60), ...L([200, 500], [214, 380]).slice(1), ...L([214, 380], [228, 600]).slice(1), ...L([228, 600], [240, 500]).slice(1), ...waveP(240, 330, 500, 14, 60).slice(1)], { w: 2.6, t: 1400 })
        for (let k = 0; k < 5; k++) ink(g, L([200 + k * 8, 360], [204 + k * 8, 344]), { w: 1.2, d: 1500 + k * 60, t: 80 })
        ripple(g, 214, 380, 6, 30, { n: 2, ms: 1400, d: 1600, w: 1.2 })
      },
      huron(g) {
        // erst Schreck, dann Entwarnung: zwei Gesichter, dazwischen die Spannungskurve
        const face = (cx: number, scared: boolean, d: number) => {
          ink(g, E(cx, 420, 46), { w: 2.8, d, t: 500 })
          for (const k of [-1, 1]) {
            if (scared) ink(g, E(cx + k * 16, 408, 7, 9), { w: 2, d: d + 300, t: 200 })
            else ink(g, E(cx + k * 16, 410, 7, 4, 180, 360), { w: 2, d: d + 300, t: 200 })
            ink(g, L([cx + k * 10, scared ? 390 : 396], [cx + k * 24, scared ? 384 : 396]), { w: 1.8, d: d + 350, t: 100 })
          }
          if (scared) ink(g, E(cx, 444, 10, 12), { w: 2.2, d: d + 400, t: 200 })
          else ink(g, B([cx - 16, 438], [cx - 6, 450], [cx + 6, 450], [cx + 16, 438]), { w: 2.2, d: d + 400, t: 200 })
        }
        face(90, true, 0)
        face(270, false, 900)
        arrow(g, L([142, 420], [218, 420]), { w: 2.4, d: 600, t: 300, head: 9 })
        axes(g, 40, 640, 330, 510, { d: 1200 })
        ink(g, smooth([[40, 630], [100, 620], [150, 540], [190, 530], [230, 610], [320, 626]]), { w: 2.6, d: 1500, t: 900 })
        for (let k = 0; k < 4; k++) ink(g, L([226 + k * 8, 590], [230 + k * 8, 576]), { w: 1.2, d: 2200 + k * 60, t: 80 })
      },
      willen(g) {
        // auf Kommando: die Härchen stellen sich auf, ohne Kälte, ohne Musik
        fig(g, 180, 620, 4.6)
        for (let k = 0; k < 8; k++) {
          const p = mk('g', { class: 'blink', style: `--d:${900 + k * 120}ms` }, g)
          ink(p, L([150 + k * 8, 540], [148 + k * 8, 526]), { w: 1.2, d: 900, t: 80 })
        }
        rays(g, 180, 360, 30, 50, 10, 800)
      },
      stammzellen(g) {
        // Haarbalg mit Muskel; dort, wo der Muskel ansetzt, sitzen die Stammzellen – daneben eine Maus
        skin(g, 160, 400, true, 0, 1.3)
        for (const [x, y] of [[196, 480], [204, 496], [190, 494]] as const) ball(g, x, y, 5, { d: 1400, w: 1.6, t: 0, fill: 'dicht' })
        ripple(g, 198, 488, 8, 26, { n: 2, ms: 1600, d: 1700, w: 1 })
        const mouse: P[] = smooth([[250, 640], [254, 616], [280, 604], [310, 610], [326, 628], [320, 640]], 4)
        blank(g, mouse)
        hatch(g, mouse, 1300)
        ink(g, mouse, { w: 2, d: 1200, t: 400 })
        ink(g, E(318, 612, 6, 6), { w: 1.6, d: 1300, t: 200 })
        dot(g, 330, 628, 2, 1400)
        ink(g, B([250, 636], [230, 640], [222, 626], [212, 632]), { w: 1.4, d: 1400, t: 200 })
      },
      gans(g) {
        const body: P[] = [...B([80, 560], [80, 500], [160, 480], [220, 500]), ...B([220, 500], [240, 440], [250, 380], [270, 370]).slice(1), ...B([270, 370], [290, 364], [300, 380], [316, 384]).slice(1), ...B([316, 384], [296, 392], [278, 400], [266, 440]).slice(1), ...B([266, 440], [260, 500], [280, 570], [200, 580]).slice(1), ...B([200, 580], [140, 586], [90, 580], [80, 560]).slice(1)]
        blank(g, body)
        ink(g, body, { w: 3, t: 1200 })
        for (let i = 0; i < 14; i++) dot(g, 110 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 12, 520 + Math.floor(i / 5) * 18, 2.6, 1200 + i * 40)
        dot(g, 284, 378, 3, 1000)
        for (const x of [120, 170]) ink(g, L([x, 584], [x - 6, 620]), { w: 2.4, d: 900, t: 200 })
        for (let i = 0; i < 3; i++) {
          const f = glide(g, -20 + i * 10, 140, { ms: 3000 + i * 400, d: 1000 + i * 500, loop: true })
          ink(f, B([60 + i * 90, 330], [70 + i * 90, 320], [90 + i * 90, 322], [96 + i * 90, 334]), { w: 1.6, d: 1000, t: 200 })
          ink(f, L([60 + i * 90, 330], [96 + i * 90, 334]), { w: 1, d: 1100, t: 100 })
        }
      },
      ende(g) {
        skin(g, 170, 460, true, 0, 1)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { haut: {} } },
      { t: T('Kalt, gruselig, ergreifend – Gänsehaut. Winzige Muskeln an deinen Haarwurzeln ziehen sich zusammen und **richten die Haare auf**.', 64), gfx: { quer: {} } },
      { t: T('Jedes Härchen hat so einen Muskel: den **Haaraufrichter**. Zieht er, wölbt sich die Haut neben dem Haar zu einer Beule.', 64), gfx: { quer: { cls: 'a1' } } },
      { t: T('Gesteuert wird das vom **Sympathikus** – dem Teil des Nervensystems, der dich auf Kampf oder Flucht vorbereitet.', 64), gfx: { nerv: {} } },
      { t: T('Der Weg läuft nicht über dein Bewusstsein: Kälterezeptoren melden an Rückenmark und Hirnstamm, die schicken **sofort** den Befehl zurück.', 64), gfx: { reflexbogen: {} } },
      { t: T('Bei unseren dicht behaarten Vorfahren hatte das Sinn: Aufgestelltes Fell hält eine **Luftschicht** fest, die wärmt.', 64), gfx: { fell: {} } },
      { t: T('Und es macht **größer**: Eine Katze mit gesträubtem Fell wirkt bedrohlicher.', 64), gfx: { katze: {} } },
      { t: T('Igel und Stachelschweine nutzen denselben Muskeltrick: Sie **stellen ihre Stacheln** auf.', 64), gfx: { igel: {} } },
      { t: T('Wir haben das dichte Fell verloren, der Reflex ist geblieben – heute ein **Überbleibsel** ohne viel Nutzen.', 64), gfx: { erbe: {} } },
      { t: T('Darum bekommst du Gänsehaut auch bei **Angst**: Das alte Kampf-oder-Flucht-Programm springt an.', 64), gfx: { angst: {} } },
      { t: T('Am rätselhaftesten ist Gänsehaut bei **Musik**. Viele Menschen kennen diesen Schauer, der den Rücken hinunterläuft.', 64), gfx: { musik: {} } },
      { t: T('Messungen zeigen: In solchen Momenten schüttet das Belohnungssystem **Dopamin** aus – wie bei gutem Essen.', 64), gfx: { dopamin: {} } },
      { t: T('Hirnscans zeigen: Solche Musikmomente aktivieren dieselben Regionen wie **Essen oder Verliebtsein**.', 64), gfx: { verliebt: {} } },
      { t: T('Besonders oft kommt der Schauer bei **Überraschungen**: ein plötzlicher Einsatz, eine unerwartete Harmonie, eine Stimme, die bricht.', 64), gfx: { ueberraschung: {} } },
      { t: T('Oft läuft die Gänsehaut dabei wie eine **Welle** über die Haut: von den Armen in den Nacken und den Rücken hinunter.', 64), gfx: { welle: { cls: 'a1 a2 a3' } } },
      { t: T('Eine Erklärung: Das Gehirn meldet kurz „Gefahr!“ – und merkt dann, alles ist gut. **Schreck plus Entwarnung** fühlt sich großartig an.', 64), gfx: { huron: {} } },
      { t: T('Manche Menschen können Gänsehaut sogar **willentlich** auslösen. Eine Studie untersuchte 2018 genau solche Personen.', 64), gfx: { willen: {} } },
      { t: T('Und die Muskeln haben noch einen Job: Bei Mäusen halten sie die **Stammzellen** der Haarwurzel aktiv – Kälte lässt so mehr Haar wachsen.', 64), gfx: { stammzellen: {} } },
      { t: T('Der Name kommt übrigens von **gerupften Gänsen**: Wo die Federn saßen, bleiben genau solche Pünktchen.', 64), gfx: { gans: {} } },
      { t: T('Gänsehaut ist ein **Fell-Reflex** – ohne Fell.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Winzige Haaraufrichter-Muskeln, gesteuert vom Sympathikus, stellen die Haare auf.', 'Bei Fell-Tieren wärmt das und macht größer – bei uns ist es ein Überbleibsel.', 'Gänsehaut bei Musik hängt mit Dopamin und überraschenden Momenten zusammen.'],
    sources: ['Salimpoor et al. 2011, Nature Neuroscience 14', 'Shwartz et al. 2020, Cell 182 (Haarfollikel-Stammzellen)', 'Heathers et al. 2018, PeerJ (willentliche Gänsehaut)'],
  },
  {
    id: 'schluckauf',
    area: 'BIO',
    day: 39,
    hook: 'Warum hast du Schluckauf – und wozu soll das gut sein?',
    mood: 'verspielt',
    ambience: 'atem',
    images: [],
    draw: {
      hicks(g) {
        // Person hält sich die Brust, Sprechblase zuckt im Takt
        fig(g, 90, 440, 3.4, { d: 0, arms: 'cross' })
        const b = wobble(g, { dy: -6, ms: 900, d: 900 })
        bubble(b, 140, 150, 190, 90, 'l', 200)
        text(b, 235, 208, 'Hicks!', { anchor: 'middle', size: 38, d: 600 })
        for (const k of [0, 1, 2]) ink(g, E(90, 360, 30 + k * 10, 20 + k * 6, 200, 340), { w: 1.2, d: 1000 + k * 120, t: 200 })
      },
      zwerchfell(g) {
        // Brustkorb von vorn: Rippen, Lungenflügel, darunter die Kuppel des Zwerchfells – sie zuckt nach unten
        const torso: P[] = [...B([110, 300], [80, 380], [80, 540], [110, 620]), ...L([110, 620], [250, 620]).slice(1), ...B([250, 620], [280, 540], [280, 380], [250, 300]).slice(1)]
        ink(g, torso, { w: 3, t: 900 })
        ink(g, L([180, 310], [180, 470]), { w: 3, d: 200, t: 400 })
        for (let k = 0; k < 6; k++) for (const s of [-1, 1]) ink(g, B([180, 330 + k * 26], [180 + s * 50, 320 + k * 26], [180 + s * 86, 340 + k * 28], [180 + s * 90, 366 + k * 28]), { w: 1, d: 300 + k * 60, t: 200 })
        for (const k of [-1, 1]) {
          const lung: P[] = [...B([180 + k * 12, 340], [180 + k * 60, 330], [180 + k * 72, 420], [180 + k * 66, 486]), ...B([180 + k * 66, 486], [180 + k * 40, 476], [180 + k * 14, 480], [180 + k * 12, 470]).slice(1), [180 + k * 12, 340]]
          blank(g, lung)
          hatch(g, lung, 700)
          ink(g, lung, { w: 2.4, d: 400, t: 600 })
        }
        const up = st(g, 'h1')
        ink(up, B([96, 520], [130, 470], [230, 470], [264, 520]), { w: 3.6, d: 900, t: 600 })
        const down = st(g, 'f1')
        ink(down, B([96, 540], [130, 520], [230, 520], [264, 540]), { w: 3.6, t: 0 })
        arrow(down, L([180, 470], [180, 508]), { w: 2.4, t: 0, head: 9 })
        flow(down, L([180, 250], [180, 330]), { n: 3, ms: 700, r: 2.4, kind: 'dash' })
      },
      stimmritze(g) {
        // Kehlkopf von oben: zwei Stimmlippen als V; sie klappen zusammen
        const ring = E(180, 460, 110, 130)
        ink(g, ring, { w: 3, t: 700 })
        hatch(g, [...ring, ...E(180, 460, 92, 112, 360, 0)], 500)
        const l = st(g, 'm1', '--m1: rotate(9deg); transform-origin: 180px 360px; transition-duration: .25s')
        const lf: P[] = [[180, 360], [120, 560], [140, 566], [178, 380]]
        blank(l, lf)
        ink(l, [...lf, lf[0]], { w: 2.6, d: 400, t: 400 })
        const r = st(g, 'm1', '--m1: rotate(-9deg); transform-origin: 180px 360px; transition-duration: .25s')
        const rf: P[] = [[180, 360], [240, 560], [220, 566], [182, 380]]
        blank(r, rf)
        ink(r, [...rf, rf[0]], { w: 2.6, d: 400, t: 400 })
        for (const s of [-1, 1]) ink(g, E(180 + s * 40, 586, 16, 10), { w: 1.8, d: 600, t: 200 })
        flow(st(g, 'h1'), L([180, 600], [180, 400]), { n: 3, ms: 700, d: 800, r: 2.4, kind: 'dash' })
        text(st(g, 'f1', '--dl:400ms'), 300, 640, '35 ms', { anchor: 'middle', size: 18, fade: false })
      },
      takt(g) {
        // Uhr, um die die Hickser im Kreis aufblitzen
        clock(g, 180, 470, 100, 0, 0)
        const h = spin(g, 180, 470, 6000, 800)
        ink(h, L([180, 470], [180, 390]), { w: 2, d: 800, t: 100 })
        for (let k = 0; k < 12; k++) {
          const a = rad(-90 + k * 30)
          const p = mk('g', { class: 'blink', style: `--d:${800 + k * 500}ms` }, g)
          dot(p, 180 + Math.cos(a) * 124, 470 + Math.sin(a) * 124, 5, 800 + k * 150)
        }
      },
      reize(g) {
        // Hirnstamm, Zwerchfellnerv hinunter zum Zwerchfell; Auslöser drumherum: Sprudel, Teller, Glas, Herzklopfen
        brain(g, 100, 360, 0.6)
        ink(g, B([110, 400], [120, 480], [150, 560], [220, 610]), { w: 2.2, d: 1000, t: 600 })
        flow(g, B([110, 400], [120, 480], [150, 560], [220, 610]), { n: 3, ms: 1400, d: 1600, r: 2 })
        ink(g, B([170, 610], [200, 590], [280, 590], [330, 610]), { w: 3, d: 1200, t: 400 })
        // Sprudelflasche
        ink(g, RR(214, 330, 30, 70, 8), { w: 2, d: 300, t: 300 })
        for (let i = 0; i < 4; i++) flow(g, L([222 + i * 5, 396], [224 + i * 5, 340]), { n: 1, ms: 1200, d: 700 + i * 200, r: 1.6, kind: 'ring' })
        // Teller mit Gabel
        ink(g, E(290, 380, 34, 10), { w: 2, d: 500, t: 300 })
        ink(g, L([326, 390], [340, 330]), { w: 1.8, d: 600, t: 200 })
        // Glas
        ink(g, [[230, 460], [236, 510], [254, 510], [260, 460]], { w: 2, d: 700, t: 300 })
        hatch(g, [[232, 478], [236, 508], [254, 508], [258, 478]], 900)
        heart(g, 300, 490, 0.4, 900)
      },
      vorfahren(g) {
        // Fisch → Amphibie → Mensch
        const fish: P[] = [...B([30, 470], [50, 440], [100, 440], [120, 470]), ...B([120, 470], [100, 500], [50, 500], [30, 470]).slice(1)]
        blank(g, fish)
        hatch(g, fish, 500)
        ink(g, fish, { w: 2.6, t: 600 })
        ink(g, [[30, 470], [14, 454], [14, 486], [30, 470]], { w: 2.4, d: 300, t: 300 })
        dot(g, 104, 464, 2.4, 600)
        for (let k = 0; k < 3; k++) ink(g, B([84 - k * 6, 456], [80 - k * 6, 464], [80 - k * 6, 476], [84 - k * 6, 484]), { w: 1, d: 700, t: 100 })
        arrow(g, L([130, 470], [158, 470]), { w: 2.2, d: 600, t: 300, head: 8 })
        const frog: P[] = smooth([[168, 490], [176, 460], [208, 450], [236, 466], [240, 490]], 4)
        blank(g, frog)
        hatch(g, frog, 1000)
        ink(g, frog, { w: 2.4, d: 800, t: 500 })
        ink(g, E(222, 452, 6), { w: 1.6, d: 1000, t: 200 })
        dot(g, 222, 452, 2, 1100)
        ink(g, [[176, 488], [164, 500], [180, 500]], { w: 1.6, d: 1100, t: 200 })
        arrow(g, L([248, 470], [276, 470]), { w: 2.2, d: 1200, t: 300, head: 8 })
        fig(g, 314, 510, 1.8, { d: 1400 })
      },
      kaulquappe(g) {
        const body: P[] = [...B([110, 460], [110, 400], [200, 400], [210, 460]), ...B([210, 460], [200, 520], [110, 520], [110, 460]).slice(1)]
        blank(g, body)
        hatch(g, body, 600)
        ink(g, body, { w: 3, t: 700 })
        const tail = wobble(g, { deg: 10, ox: 110, oy: 460, ms: 700, d: 900 })
        ink(tail, B([110, 460], [80, 430], [50, 500], [20, 450]), { w: 2.6, d: 400, t: 600 })
        dot(g, 180, 446, 4, 800)
        for (let k = 0; k < 3; k++) ink(g, B([150 + k * 9, 486], [146 + k * 9, 494], [148 + k * 9, 504], [154 + k * 9, 510]), { w: 1.6, d: 900 + k * 80, t: 100 })
        flow(g, B([140, 430], [146, 470], [160, 500], [176, 540]), { n: 3, ms: 1100, d: 1300, r: 1.8, kind: 'dash' })
        blank(g, E(160, 452, 22, 14))
        ink(g, E(160, 452, 22, 14), { w: 1.4, d: 1000, t: 300 })
        text(g, 158, 570, 'Kiemen', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 280, 420, 'Lunge', { anchor: 'middle', cls: 's', d: 1200 })
        arrow(g, L([254, 428], [184, 448]), { w: 1.6, d: 1300, t: 300, head: 7 })
        ink(g, L([158, 556], [158, 516]), { w: 1, d: 1100, t: 200 })
      },
      muster(g) {
        // beide Abläufe als Zeitleiste: kurzes Einatmen, dann schließt die Stimmritze
        for (const [y, label, d] of [[420, 'Kaulquappe', 0], [560, 'Mensch', 600]] as const) {
          text(g, 30, y - 46, label, { cls: 's', d })
          axes(g, 30, y + 20, 330, y - 30, { d })
          ink(g, [[30, y + 16], [70, y + 16], [90, y - 20], [130, y - 20], [134, y + 16], [330, y + 16]], { w: 2.4, d: d + 200, t: 600 })
          hatch(g, RR(70, y - 20, 60, 36, 3), d + 500)
          ink(g, L([134, y - 30], [134, y + 24]), { w: 1.6, d: d + 500, t: 200 })
          for (const k of [-1, 1]) ink(g, L([150, y - 6 + k * 6], [164, y - 6]), { w: 2, d: d + 700, t: 100 })
        }
      },
      baby(g) {
        // Ungeborenes in der Fruchtblase, Zwerchfell zuckt
        ink(g, E(180, 470, 130, 150), { w: 3, t: 900 })
        ink(g, E(180, 470, 120, 140), { w: 1, d: 200, t: 900 })
        const b = wobble(g, { dy: -4, ms: 800, d: 1400 })
        ink(b, E(206, 404, 36, 32), { w: 2.8, d: 500, t: 500 })
        ink(b, B([186, 432], [120, 470], [130, 560], [200, 560]), { w: 2.8, d: 800, t: 600 })
        ink(b, B([200, 560], [240, 560], [252, 520], [224, 500]), { w: 2.6, d: 1200, t: 400 })
        ink(b, B([196, 450], [216, 470], [230, 470], [236, 460]), { w: 2, d: 1300, t: 200 })
        ink(b, E(222, 400, 4, 2, 0, 180), { w: 1.4, d: 1400, t: 100 })
        ink(g, B([150, 560], [130, 600], [120, 616], [124, 640]), { w: 2, d: 1300, t: 300 })
      },
      flasche(g) {
        ink(g, RR(70, 380, 60, 160, 14), { w: 3, t: 600 })
        ink(g, [[84, 380], [90, 350], [110, 350], [116, 380]], { w: 2.6, d: 300, t: 300 })
        ink(g, B([92, 350], [94, 332], [106, 332], [108, 350]), { w: 2.2, d: 400, t: 200 })
        hatch(g, RR(74, 440, 52, 96, 10), 600)
        for (let k = 0; k < 4; k++) ink(g, L([70, 420 + k * 30], [80, 420 + k * 30]), { w: 1, d: 700, t: 80 })
        const st2: P[] = [...B([220, 420], [280, 400], [320, 470], [290, 540]), ...B([290, 540], [260, 590], [210, 560], [220, 420]).slice(1)]
        ink(g, st2, { w: 3, d: 500, t: 700 })
        ink(g, B([226, 420], [222, 390], [230, 360], [236, 330]), { w: 2.4, d: 600, t: 300 })
        hatch(g, [...B([214, 520], [240, 540], [280, 530], [296, 510]), [290, 540], [260, 580], [214, 560]], 900)
        ball(g, 266, 462, 14, { d: 1000, w: 2 })
        flow(g, B([266, 448], [250, 420], [236, 380], [236, 320]), { n: 2, ms: 1400, d: 1300, r: 4, kind: 'ring' })
      },
      tiere(g) {
        const dog: P[] = [...B([60, 520], [70, 470], [180, 470], [230, 480]), [250, 440], [290, 440], [300, 470], [270, 480], ...B([270, 480], [260, 520], [200, 530], [60, 520]).slice(1)]
        blank(g, dog)
        hatch(g, dog, 700)
        ink(g, dog, { w: 2.8, t: 900 })
        ink(g, [[256, 444], [262, 424], [272, 442]], { w: 2.2, d: 700, t: 200 })
        for (const x of [80, 110, 200, 230]) ink(g, L([x, 524], [x, 590]), { w: 2.6, d: 600, t: 200 })
        const tl = wobble(g, { deg: 20, ox: 60, oy: 500, ms: 600, d: 1000 })
        ink(tl, B([60, 500], [40, 480], [36, 460], [44, 440]), { w: 2.4, d: 800, t: 200 })
        dot(g, 278, 452, 3, 1000)
        ground(g, 30, 330, 592, 400)
        const b = wobble(g, { dy: -5, ms: 900, d: 1300 })
        bubble(b, 230, 340, 100, 50, 'l', 1100)
        text(b, 280, 372, 'hicks', { anchor: 'middle', d: 1300 })
      },
      raetsel(g) {
        question(g, 110, 460, 1.6)
        question(g, 250, 500, 1.1, 400)
        lens(g, 200, 380, 30, 800)
      },
      mittel(g) {
        // Hausmittel als kleine Bilder: Luft anhalten, Tüte, Wasser kopfüber trinken, Erschrecken
        const cell = (x: number, y: number, d: number) => ink(g, RR(x, y, 140, 120, 8), { w: 2, d, t: 300 })
        cell(30, 330, 0)
        fig(g, 100, 440, 2.4, { d: 200 })
        ink(g, E(100, 368, 14, 12), { w: 1.6, d: 400, t: 200 })
        cell(190, 330, 200)
        fig(g, 240, 440, 2.4, { d: 400 })
        ink(g, [[256, 360], [300, 340], [304, 400], [256, 384]], { w: 2, d: 600, t: 300 })
        cell(30, 470, 400)
        ink(g, [[70, 500], [76, 560], [100, 560], [106, 500]], { w: 2, d: 600, t: 300 })
        hatch(g, [[72, 520], [76, 558], [100, 558], [104, 520]], 800)
        ink(g, L([120, 510], [150, 560]), { w: 1.6, d: 700, t: 200 })
        cell(190, 470, 600)
        fig(g, 230, 580, 2.4, { d: 800, arms: 'up' })
        text(g, 290, 520, '!', { size: 34, d: 1000 })
      },
      rekord(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '1922', sub: 'Beginn', up: true },
          { at: 0.9, label: '1990', sub: 'Ende', up: true },
        ])
        for (let i = 0; i < 7; i++) {
          const x = 50 + i * 40
          fig(g, x, 610, 0.8 + i * 0.12, { d: 900 + i * 100 })
        }
      },
      zahl(g) {
        // Strichliste wächst und wächst
        for (let r = 0; r < 6; r++)
          for (let c = 0; c < 7; c++) {
            const x = 40 + c * 42
            const y = 350 + r * 50
            for (let k = 0; k < 4; k++) ink(g, L([x + k * 6, y], [x + k * 6, y + 30]), { w: 1.4, d: (r * 7 + c) * 40 + k * 8, t: 40 })
            ink(g, L([x - 4, y + 24], [x + 22, y + 6]), { w: 1.6, d: (r * 7 + c) * 40 + 40, t: 40 })
          }
      },
      arzt(g) {
        // Arztpraxis: Kreuz, Stethoskop
        hatch(g, RR(150, 340, 60, 160, 6), 400, true)
        ink(g, RR(150, 340, 60, 160, 6), { w: 3, t: 500 })
        hatch(g, RR(100, 390, 160, 60, 6), 400, true)
        blank(g, RR(152, 392, 56, 56, 2))
        hatch(g, RR(152, 392, 56, 56, 2), 400, true)
        ink(g, [[150, 390], [100, 390], [100, 450], [150, 450]], { w: 3, d: 200, t: 400 })
        ink(g, [[210, 390], [260, 390], [260, 450], [210, 450]], { w: 3, d: 200, t: 400 })
        ink(g, B([110, 540], [110, 600], [170, 620], [190, 580]), { w: 2.6, d: 700, t: 500 })
        ink(g, B([250, 540], [250, 600], [190, 620], [190, 580]), { w: 2.6, d: 700, t: 500 })
        ink(g, B([190, 620], [190, 650], [240, 660], [270, 640]), { w: 2.4, d: 1000, t: 300 })
        ball(g, 276, 636, 12, { d: 1200, fill: 'hell', t: 200 })
        for (let k = 0; k < 2; k++) {
          ink(g, RR(36 + k * 14, 540 + k * 10, 50, 56, 4), { w: 2, d: 1300 + k * 100, t: 200 })
          cross(g, 61 + k * 14, 574 + k * 10, 0.5, 1500 + k * 150)
        }
      },
      ende(g) {
        const b = wobble(g, { dy: -6, ms: 900, d: 600 })
        bubble(b, 90, 420, 180, 90, 'l')
        text(b, 180, 478, 'Hicks', { anchor: 'middle', size: 32, d: 400 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { hicks: {} } },
      { t: T('Schluckauf beginnt im **Zwerchfell**, dem großen, gewölbten Atemmuskel unter deiner Lunge.', 64), gfx: { zwerchfell: {} } },
      { t: T('Plötzlich zuckt es, ohne dass du es willst – und du **saugst ruckartig Luft** ein.', 64), gfx: { zwerchfell: { cls: 'a1' } } },
      { t: T('Nur etwa 35 Millisekunden später **klappt die Stimmritze zu**. Die Luft prallt dagegen: „Hicks!“', 64), gfx: { stimmritze: { cls: 'a1' } } },
      { t: T('Ein Anfall bringt meist **4 bis 60** Hickser pro Minute und ist nach ein paar Minuten vorbei.', 64), gfx: { takt: {} } },
      { t: T('Den Reflex steuert ein Nervenschaltkreis im **Hirnstamm**. Anstoßen können ihn ganz verschiedene Reize.', 64), gfx: { reize: {} } },
      { t: T('Wozu soll das gut sein? Eine Idee: Schluckauf ist ein **Erbe** aus der Zeit, als unsere Vorfahren im Wasser lebten.', 64), gfx: { vorfahren: {} } },
      { t: T('Kaulquappen atmen mit **Lunge und Kiemen**. Pumpen sie Wasser über die Kiemen, schließen sie die Stimmritze – damit nichts in die Lunge läuft.', 64), gfx: { kaulquappe: {} } },
      { t: T('Dieses Muster – einatmen, Stimmritze zu – gleicht dem Schluckauf **verblüffend**.', 64), gfx: { muster: {} } },
      { t: T('Eine zweite Idee: Babys hicksen schon im Mutterleib, und zwar oft. Vielleicht **trainiert** der Reflex die Atemmuskeln.', 64), gfx: { baby: {} } },
      { t: T('Eine dritte: Er hilft Säuglingen, beim Trinken geschluckte **Luft aus dem Magen** zu befördern.', 64), gfx: { flasche: {} } },
      { t: T('Auch Hunde, Katzen und Pferde bekommen Schluckauf – er ist ein **Säugetier-Reflex**.', 64), gfx: { tiere: {} } },
      { t: T('Bewiesen ist keine dieser Ideen. Schluckauf ist bis heute ein **kleines Rätsel** der Medizin.', 64), gfx: { raetsel: {} } },
      { t: T('Die meisten Hausmittel setzen auf dasselbe: **CO₂ im Blut** erhöhen oder den Nerv reizen, der den Reflex leitet.', 64), gfx: { mittel: {} } },
      { t: T('Den Rekord hält der US-Amerikaner Charles Osborne: Er hatte **68 Jahre lang** Schluckauf, von 1922 bis 1990.', 64), gfx: { rekord: {} } },
      { t: T('In dieser Zeit hat er schätzungsweise **430 Millionen** Mal gehickst.', 64), gfx: { zahl: {} } },
      { t: T('Hält Schluckauf länger als zwei Tage an, sollte ein Arzt nachsehen. Dahinter können **andere Erkrankungen** stecken.', 64), gfx: { arzt: {} } },
      { t: T('Schluckauf ist wohl ein **Reflex von früher**, den wir nie losgeworden sind.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Das Zwerchfell zuckt, man atmet ruckartig ein, nach ~35 ms schließt die Stimmritze: „Hicks“.', 'Eine Hypothese: ein Erbe der Kiemenatmung von Kaulquappen.', 'Hält Schluckauf über zwei Tage an, sollte ein Arzt nachsehen.'],
    sources: ['Straus et al. 2003, BioEssays 25 (Kaulquappen-Hypothese)', 'Kahrilas & Shi 1997, Gut 41', 'Howes 2012, Medical Hypotheses 79 (Luft aus dem Magen)'],
  },
  {
    id: 'fieber',
    area: 'BIO',
    day: 53,
    hook: 'Warum macht dein Körper Fieber – mit Absicht?',
    mood: 'raetsel',
    ambience: 'herz',
    images: [],
    draw: {
      thermo(g) {
        // Fieberthermometer mit Skala, daneben die Person im Bett
        thermo(g, 70, 100, 280, 0.82)
        for (let k = 0; k <= 6; k++) {
          const y = 108 + (k / 6) * 272
          ink(g, L([82, y], [92, y]), { w: 1.2, d: 600 + k * 50, t: 80 })
          if (k % 2 === 0) text(g, 98, y + 4, `${42 - k}`, { cls: 's', d: 700 + k * 50, size: 11 })
        }
        ink(g, RR(150, 360, 190, 30, 8), { w: 2.6, d: 300, t: 500 })
        lie(g, 180, 350, 2.2, 'back', 500)
        hatch(g, RR(200, 340, 130, 22, 6), 900)
        ink(g, RR(200, 340, 130, 22, 6), { w: 1.8, d: 800, t: 300 })
        for (const x of [154, 336]) ink(g, L([x, 390], [x, 420]), { w: 2.4, d: 400, t: 100 })
        for (const k of [0, 1]) {
          const s = wobble(g, { dy: -6, ms: 1600, d: 1000 + k * 400 })
          ink(s, B([176 + k * 14, 320], [170 + k * 14, 306], [182 + k * 14, 294], [176 + k * 14, 280]), { w: 1.2, d: 1100, t: 200 })
        }
      },
      regler(g) {
        // Thermostat im Kopf: Zeiger springt von 37 auf 39
        ink(g, E(180, 470, 110), { w: 3.2, t: 800 })
        ink(g, E(180, 470, 100), { w: 1, d: 200, t: 800 })
        for (let k = 0; k <= 10; k++) {
          const a = rad(150 + k * 24)
          ink(g, L([180 + Math.cos(a) * 86, 470 + Math.sin(a) * 86], [180 + Math.cos(a) * 98, 470 + Math.sin(a) * 98]), { w: k % 5 ? 1.4 : 2.4, d: 300 + k * 40, t: 100 })
        }
        hatch(g, [[180, 470], ...E(180, 470, 98, 98, 270, 318), [180, 470]], 1500)
        const n = st(g, 'm1', '--m1: rotate(48deg); transform-origin: 180px 470px; transition-duration: 1.6s')
        ink(n, L([180, 470], [180 + Math.cos(rad(222)) * 80, 470 + Math.sin(rad(222)) * 80]), { w: 4, d: 800, t: 300 })
        ball(g, 180, 470, 12, { d: 700, fill: 'dicht', t: 300 })
        text(g, 80, 620, '37 °C', { anchor: 'middle', d: 1000 })
        text(g, 280, 620, '39 °C', { anchor: 'middle', d: 1100 })
      },
      tagesgang(g) {
        axes(g, 40, 600, 330, 340, { yl: 'Temperatur' })
        plot(g, 46, 520, 270, 100, (t) => 0.5 + 0.45 * Math.sin((t - 0.35) * Math.PI * 2), { d: 500 })
        sun(g, 250, 620, 8, 900, 8)
        const m: P[] = [...E(110, 620, 9, 9, 60, 300), ...E(116, 620, 7, 7, 290, 70)]
        ink(g, m, { w: 1.8, d: 900, t: 200 })
        for (let k = 0; k < 5; k++) ink(g, L([46 + k * 67.5, 600], [46 + k * 67.5, 606]), { w: 1.2, d: 600, t: 60 })
      },
      wunderlich(g) {
        timeline(g, 30, 330, 440, [
          { at: 0.1, label: '1868', sub: '37,0 °C', up: true },
          { at: 0.85, label: 'heute', sub: '36,6 °C', up: true },
        ])
        // altes Glasthermometer, unter die Achsel geklemmt
        fig(g, 110, 640, 3.4, { d: 1200, arms: 'cross' })
        ink(g, L([90, 580], [40, 560]), { w: 3, d: 1500, t: 300 })
        ball(g, 40, 560, 5, { d: 1600, fill: 'dicht', t: 0 })
        thermo(g, 260, 510, 110, 0.6, 1700)
      },
      signal(g) {
        // Erreger im Gewebe → Immunzelle schüttet Botenstoffe aus → mit dem Blut zum Hypothalamus
        brain(g, 220, 380, 0.8)
        ball(g, 230, 420, 12, { d: 1100, fill: 'dicht', t: 300 })
        ripple(g, 230, 420, 14, 34, { n: 2, ms: 1600, d: 1600, w: 1.2 })
        text(g, 300, 470, 'Hypothalamus', { anchor: 'end', cls: 's', d: 1300 })
        virus(g, 60, 590, 14, 300)
        ball(g, 110, 600, 18, { d: 500, fill: 'hell', t: 300 })
        ball(g, 106, 596, 6, { d: 700, fill: 'dicht', t: 0 })
        const p = B([128, 590], [160, 560], [190, 520], [222, 438])
        ink(g, p, { w: 1.6, d: 800, t: 500 })
        flow(g, p, { n: 4, ms: 1400, d: 1300, r: 2.4 })
      },
      frieren(g) {
        thermo(g, 70, 330, 220, 0.85)
        text(g, 70, 610, 'Soll', { anchor: 'middle', cls: 's', d: 600 })
        thermo(g, 160, 330, 220, 0.55, 300)
        text(g, 160, 610, 'Ist', { anchor: 'middle', cls: 's', d: 900 })
        const sh = wobble(g, { dx: 2, ms: 120, d: 1000 })
        fig(sh, 280, 590, 2.6, { d: 600, arms: 'cross' })
        ink(sh, RR(250, 470, 60, 60, 10), { w: 1.6, d: 800, t: 300 })
        for (const [x, y] of [[236, 470], [324, 470], [236, 520], [324, 520]] as const) ink(g, [[x - 6, y], [x - 2, y - 6], [x + 2, y + 6], [x + 6, y]], { w: 1.8, d: 1200, t: 200 })
      },
      zittern(g) {
        // Muskeln zittern (Wärme), die Hautgefäße verengen sich – Hände werden kalt
        const sh = wobble(g, { dx: 2.4, ms: 110, d: 900 })
        fig(sh, 140, 640, 6, { d: 0, arms: 'down' })
        for (const [x, y] of [[60, 420], [220, 420], [60, 520], [220, 520]] as const) ink(g, [[x - 8, y], [x - 3, y - 8], [x + 3, y + 8], [x + 8, y]], { w: 2, d: 800, t: 200 })
        // Lupe: Blutgefäß in der Haut, eng gestellt
        blank(g, E(290, 420, 48))
        ink(g, E(290, 420, 48), { w: 2.6, d: 1000, t: 400 })
        for (const s of [-1, 1]) ink(g, B([250, 420 + s * 16], [276, 420 + s * 4], [304, 420 + s * 4], [330, 420 + s * 16]), { w: 2, d: 1200, t: 300 })
        flow(g, L([256, 420], [324, 420]), { n: 2, ms: 1800, d: 1500, r: 1.6 })
        flake(g, 290, 500, 10, 1400)
      },
      erreger(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Temperatur', yl: 'Vermehrung' })
        plot(g, 50, 590, 270, 240, (t) => (t < 0.45 ? 0.9 : 0.9 - Math.pow((t - 0.45) / 0.55, 1.4) * 0.75), { d: 500 })
        text(g, 118, 600 + 24, '37', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 240, 600 + 24, '40', { anchor: 'middle', cls: 's', d: 900 })
        for (const [x, y, n] of [[110, 400, 6], [260, 520, 2]] as const) for (let k = 0; k < n; k++) bact(g, x + (k % 3) * 26, y + Math.floor(k / 3) * 22, 0.45, 1300 + k * 60)
      },
      immun(g) {
        // Fresszelle streckt Ausläufer aus und wandert zum Erreger
        const m = glide(g, 60, 0, { ms: 2600, d: 900 })
        const cellP: P[] = smooth([[90, 470], [100, 430], [140, 420], [178, 440], [196, 470], [176, 510], [130, 516], [96, 500], [90, 470]], 5)
        blank(m, cellP)
        hatch(m, cellP, 400)
        ink(m, cellP, { w: 3, t: 700 })
        ball(m, 130, 466, 14, { d: 300, fill: 'dicht', t: 300 })
        ink(m, B([196, 470], [214, 466], [226, 458], [236, 462]), { w: 2.4, d: 700, t: 300 })
        for (const [y, d] of [[440, 700], [470, 800], [500, 900]] as const) ink(m, L([30, y], [70, y]), { w: 1.6, d, t: 200 })
        virus(g, 320, 470, 12, 1200)
        ink(g, L([20, 560], [340, 560]), { w: 1.6, d: 400, t: 500 })
        ink(g, L([20, 380], [340, 380]), { w: 1.6, d: 400, t: 500 })
      },
      echse(g) {
        const body: P[] = [...B([40, 560], [80, 530], [200, 530], [250, 546]), ...B([250, 546], [280, 540], [300, 546], [310, 556]).slice(1), ...B([310, 556], [290, 570], [240, 568], [220, 566]).slice(1), ...B([220, 566], [160, 580], [80, 576], [40, 560]).slice(1)]
        blank(g, body)
        hatch(g, body, 700)
        ink(g, body, { w: 2.8, t: 900 })
        for (let k = 0; k < 8; k++) ink(g, E(90 + k * 18, 548, 4, 2.4), { w: 0.8, d: 1000 + k * 30, t: 80 })
        dot(g, 288, 548, 2.4, 1000)
        for (const x of [110, 200]) {
          ink(g, L([x, 574], [x - 10, 600]), { w: 2.2, d: 600, t: 200 })
          ink(g, L([x + 12, 574], [x + 22, 600]), { w: 2.2, d: 600, t: 200 })
        }
        const rock: P[] = [[20, 600], [40, 590], [320, 588], [340, 600]]
        ink(g, rock, { w: 3, d: 300, t: 500 })
        hatch(g, [...rock, [340, 640], [20, 640]], 700, true)
        sun(g, 270, 380, 30, 600)
        for (const x of [180, 220, 260]) flow(g, L([x + 30, 420], [x, 520]), { n: 2, ms: 1200, d: 1100, r: 1.8, kind: 'dash' })
      },
      ueberleben(g) {
        vbars(g, [
          { label: 'warm', v: 3, fmt: () => 'meist überlebt' },
          { label: 'kühl', v: 1, fmt: () => 'meist gestorben', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        sun(g, 125, 300, 12, 1200, 8)
        flake(g, 235, 300, 12, 1300)
      },
      puls(g) {
        heart(g, 180, 430, 2.2)
        ink(g, [...L([30, 580], [120, 580]), ...L([120, 580], [140, 540]).slice(1), ...L([140, 540], [160, 620]).slice(1), ...L([160, 620], [176, 580]).slice(1), ...L([176, 580], [240, 580]).slice(1), ...L([240, 580], [256, 548]).slice(1), ...L([256, 548], [272, 612]).slice(1), ...L([272, 612], [284, 580]).slice(1), ...L([284, 580], [330, 580]).slice(1)], { w: 2.6, d: 700, t: 900 })
        flow(g, [[30, 580], [120, 580], [140, 540], [160, 620], [176, 580], [240, 580], [256, 548], [272, 612], [284, 580], [330, 580]], { n: 1, ms: 1600, d: 1600, r: 3 })
      },
      hitzschlag(g) {
        // links: Thermostat hochgedreht, Körper heizt bewusst – rechts: in praller Sonne, Kühlung versagt
        regler0(g, 90, 420, 200)
        fig(g, 90, 600, 3, { d: 400, arms: 'cross' })
        ink(g, L([180, 340], [180, 640]), { w: 1, d: 300, t: 400 })
        sun(g, 290, 380, 26, 500)
        fig(g, 270, 620, 3, { d: 700 })
        for (const [x, y] of [[240, 520], [300, 520]] as const) drop(g, x, y, 0.4, 1100, false)
        cross(g, 316, 470, 0.6, 1400)
      },
      energie(g) {
        flame(g, 180, 560, 1.6)
        for (let k = 0; k < 3; k++) {
          const f = wobble(g, { dy: -6, ms: 900 + k * 200, d: 900 })
          ink(f, B([150 + k * 30, 450], [144 + k * 30, 430], [156 + k * 30, 410], [150 + k * 30, 390]), { w: 1.4, d: 1000, t: 200 })
        }
      },
      schlapp(g) {
        ink(g, RR(40, 500, 280, 40, 10), { w: 3, t: 600 })
        lie(g, 80, 484, 2.6, 'back', 400)
        hatch(g, RR(130, 470, 180, 28, 8), 900)
        ink(g, RR(130, 470, 180, 28, 8), { w: 2, d: 800, t: 300 })
        ink(g, L([50, 540], [50, 580]), { w: 2.6, d: 300, t: 200 })
        ink(g, L([310, 540], [310, 580]), { w: 2.6, d: 300, t: 200 })
        for (const [x, y] of [[100, 420], [120, 400], [144, 380]] as const) text(g, x, y, 'z', { size: 16 + (x - 100) / 4, d: 1200 + (x - 100) * 10 })
        ink(g, RR(250, 380, 60, 50, 6), { w: 1.6, d: 1300, t: 300 })
        thermo(g, 280, 384, 34, 0.8, 1400)
      },
      schwitzen(g) {
        fig(g, 180, 620, 6)
        for (const [x, y] of [[110, 420], [250, 420], [96, 520], [264, 520]] as const) {
          drop(g, x, y, 0.6, 700, false)
          flow(g, L([x, y + 14], [x, y + 60]), { n: 1, ms: 1200, d: 1200 + x, r: 1.6 })
        }
        regler0(g, 300, 360, 900)
      },
      arzt(g) {
        // Warnzeichen als kleine Bilder: Säugling, Thermometer hoch, Kalender, Atemnot
        const box0 = (x: number, y: number, d: number) => ink(g, RR(x, y, 140, 120, 8), { w: 2, d, t: 300 })
        box0(30, 330, 0)
        ink(g, E(100, 400, 30, 22), { w: 2.2, d: 200, t: 300 })
        ink(g, E(78, 384, 14), { w: 2, d: 300, t: 200 })
        box0(190, 330, 200)
        thermo(g, 260, 340, 70, 0.95, 400)
        box0(30, 470, 400)
        for (let k = 0; k < 3; k++) {
          ink(g, RR(50 + k * 20, 490 + k * 10, 50, 56, 4), { w: 1.8, d: 600 + k * 100, t: 200 })
        }
        box0(190, 470, 600)
        brain(g, 260, 540, 0.35, 800)
        question(g, 300, 520, 0.4, 1000)
      },
      grenze(g) {
        thermo(g, 120, 320, 260, 0.95)
        dashes(g, L([150, 340], [300, 340]), { w: 1.8, d: 600 })
        text(g, 160, 330, 'ab ≈ 41 °C', { d: 900 })
        // Eiweißkette, die sich entfaltet
        ink(g, smooth([[180, 470], [210, 440], [250, 470], [220, 500], [260, 520], [300, 490]], 6), { w: 2.4, d: 1100, t: 600 })
        arrow(g, L([240, 540], [240, 570]), { w: 1.6, d: 1500, t: 200, head: 6 })
        ink(g, waveP(180, 320, 600, 6, 20), { w: 2.4, d: 1600, t: 600 })
      },
      ende(g) {
        thermo(g, 140, 380, 200, 0.7)
        virus(g, 250, 460, 16, 600)
        cross(g, 250, 460, 1.2, 1200)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { thermo: {} } },
      { t: T('Fieber ist keine Panne. Dein Gehirn stellt den **Thermostat** absichtlich höher.', 64), gfx: { regler: {} } },
      { t: T('Der Sollwert springt dann zum Beispiel von 37 auf 39 Grad. Die Temperatur wird **nicht überhitzt**, sondern neu geregelt.', 64), gfx: { regler: { cls: 'a1' } } },
      { t: T('Ganz fest ist der Sollwert ohnehin nicht: Deine Temperatur schwankt im Tagesverlauf um bis zu **ein Grad** – morgens tief, abends höher.', 64), gfx: { tagesgang: {} } },
      { t: T('Und die berühmten 37 Grad? Sie stammen von Carl Wunderlich aus dem Jahr 1868. Neuere Messungen ergeben eher **36,6 Grad**.', 64), gfx: { wunderlich: {} } },
      { t: T('Auslöser sind Immunzellen, die Erreger entdecken. Ihre Botenstoffe erreichen den **Hypothalamus** – die Temperaturzentrale im Gehirn.', 64), gfx: { signal: {} } },
      { t: T('Jetzt fühlen sich 37 Grad **zu kalt** an. Darum frierst du am Anfang, obwohl du schon warm bist.', 64), gfx: { frieren: {} } },
      { t: T('Du zitterst – Muskelarbeit erzeugt **Wärme**. Die Hautgefäße ziehen sich zusammen, Hände und Füße werden kalt.', 64), gfx: { zittern: {} } },
      { t: T('Warum der Aufwand? Viele Erreger vermehren sich bei höherer Temperatur **schlechter**.', 64), gfx: { erreger: {} } },
      { t: T('Gleichzeitig arbeiten viele **Abwehrzellen** schneller: Sie wandern zügiger dorthin, wo die Infektion sitzt.', 64), gfx: { immun: {} } },
      { t: T('Das ist uralt. Sogar **Eidechsen** „machen Fieber“: Bei einer Infektion legen sie sich länger in die Sonne.', 64), gfx: { echse: {} } },
      { t: T('In einem Versuch von 1975 überlebten infizierte Wüstenleguane, die sich aufwärmen konnten, **deutlich häufiger**.', 64), gfx: { ueberleben: {} } },
      { t: T('Mit dem Fieber steigt auch der **Puls**: um etwa zehn Schläge pro Minute je Grad.', 64), gfx: { puls: {} } },
      { t: T('Fieber kostet aber viel Energie: Pro Grad steigt der Grundumsatz um etwa **10 bis 13 Prozent**.', 64), gfx: { energie: {} } },
      { t: T('Darum bist du so **schlapp**: Der Körper spart Kraft für die Abwehr.', 64), gfx: { schlapp: {} } },
      { t: T('Ist die Infektion im Griff, stellt das Gehirn zurück. Jetzt ist dir **zu warm** – du schwitzt die Wärme ab.', 64), gfx: { schwitzen: {} } },
      { t: T('Fieber ist nicht dasselbe wie **Überhitzung**: Beim Hitzschlag will der Körper kühlen, schafft es aber nicht.', 64), gfx: { hitzschlag: {} } },
      { t: T('Gefährlich wird Fieber meist erst ab etwa **41 Grad**: Dann geraten Eiweiße im Körper an ihre Grenzen.', 64), gfx: { grenze: {} } },
      { t: T('Fiebersenker lindern trotzdem oft sinnvoll Beschwerden. In manchen Fällen gehört Fieber **zum Arzt**.', 64), gfx: { arzt: {} } },
      { t: T('Fieber ist eine **Waffe** deines Immunsystems – kein Defekt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei Fieber stellt der Hypothalamus den Sollwert höher – darum friert man anfangs.', 'Viele Erreger vermehren sich in der Wärme schlechter, Abwehrzellen arbeiten schneller.', 'Fieber kostet pro Grad rund 10–13 % mehr Energie.'],
    sources: ['Evans, Repasky & Fisher 2015, Nature Reviews Immunology 15', 'Kluger, Ringler & Anver 1975, Science 188', 'Dinarello 2004, Journal of Endotoxin Research'],
  },
  {
    id: 'venen-blau',
    area: 'BIO',
    day: 39,
    hook: 'Ist das Blut in deinen Adern blau?',
    mood: 'raetsel',
    ambience: 'herz',
    images: [],
    draw: {
      arm(g) {
        // Unterarm mit Handgelenk und Hand; Venen verzweigen sich unter der Haut, das Blut fließt Richtung Herz
        const arm: P[] = [...B([20, 180], [120, 164], [220, 160], [280, 166]), ...B([280, 166], [310, 150], [340, 156], [350, 180]), ...L([350, 180], [350, 280]).slice(1), ...B([350, 280], [330, 300], [300, 300], [280, 290]).slice(1), ...B([280, 290], [220, 300], [120, 316], [20, 336]).slice(1)]
        blank(g, arm)
        ink(g, arm, { w: 3, t: 900 })
        for (const y of [196, 214, 232]) ink(g, L([292, y], [296, y + 6]), { w: 1, d: 500, t: 100 })
        const veins: P[][] = [
          smooth([[290, 210], [220, 214], [150, 200], [20, 210]]),
          smooth([[290, 252], [230, 250], [160, 264], [20, 290]]),
          smooth([[160, 200], [150, 230], [150, 250], [160, 264]]),
          smooth([[230, 214], [240, 232], [234, 248], [230, 250]]),
        ]
        veins.forEach((v, i) => {
          ink(g, v, { w: i < 2 ? 2.4 : 1.6, d: 600 + i * 200, t: 800 })
          if (i < 2) flow(g, v, { n: 3, ms: 3000, d: 1400 + i * 200, r: 1.8 })
        })
      },
      tropfen(g) {
        // zwei Blutproben: hellrot (Sauerstoff gebunden), dunkelrot (abgegeben)
        for (const [x, dense, d] of [[110, false, 0], [250, true, 300]] as const) {
          ink(g, RR(x - 24, 360, 48, 200, 22), { w: 2.8, d, t: 600 })
          ink(g, RR(x - 30, 344, 60, 24, 6), { w: 2.4, d: d + 200, t: 300 })
          hatch(g, RR(x - 20, 420, 40, 136, 18), d + 600, dense)
          ink(g, L([x - 20, 420], [x + 20, 420]), { w: 1.4, d: d + 500, t: 200 })
        }
        for (let i = 0; i < 4; i++) {
          const x = 70 + (i % 2) * 80
          const y = 600 + Math.floor(i / 2) * 26
          ball(g, x - 6, y, 5, { d: 900 + i * 80, w: 1.4, t: 0 })
          ball(g, x + 6, y, 5, { d: 900 + i * 80, w: 1.4, t: 0 })
        }
        text(g, 250, 620, '–', { anchor: 'middle', size: 30, d: 1200 })
      },
      haemo(g) {
        // Hämoglobin: vier gefaltete Ketten, jede mit einer Häm-Scheibe und Eisen; Sauerstoff dockt an
        const blobs: [number, number, number][] = [[140, 420, 1], [220, 420, 2], [140, 500, 3], [220, 500, 4]]
        blobs.forEach(([x, y, s], i) => {
          const b: P[] = smooth(Array.from({ length: 10 }, (_, k) => {
            const a = (k / 10) * Math.PI * 2
            const r = 40 * (1 + 0.1 * Math.sin(a * 3 + s))
            return [x + Math.cos(a) * r, y + Math.sin(a) * r] as P
          }).concat([[x + 40 * (1 + 0.1 * Math.sin(s)), y]]), 5)
          blank(g, b)
          hatch(g, b, 400 + i * 100, i % 2 === 1)
          ink(g, b, { w: 2.4, d: i * 100, t: 500 })
          ink(g, smooth([[x - 26, y - 10], [x - 10, y - 26], [x + 16, y - 14], [x + 4, y + 10], [x + 24, y + 22]], 5), { w: 1, d: 600 + i * 100, t: 300 })
          blank(g, E(x, y, 13))
          ink(g, E(x, y, 13), { w: 2, d: 600, t: 300 })
          text(g, x, y + 5, 'Fe', { anchor: 'middle', cls: 's', d: 800 })
        })
        for (const [x, y, dx, dy] of [[60, 360, 70, 50], [300, 360, -70, 50], [60, 580, 70, -70], [300, 580, -70, -70]] as const) {
          const m = glide(g, dx, dy, { ms: 1800, d: 1200 })
          ball(m, x - 6, y, 5, { d: 1100, w: 1.4, t: 0 })
          ball(m, x + 6, y, 5, { d: 1100, w: 1.4, t: 0 })
        }
      },
      menge(g) {
        // fünf Ein-Liter-Flaschen
        for (let i = 0; i < 5; i++) {
          const x = 44 + i * 68
          const b: P[] = [[x - 10, 420], [x - 10, 446], [x - 26, 470], [x - 26, 620], [x + 26, 620], [x + 26, 470], [x + 10, 446], [x + 10, 420]]
          ink(g, b, { w: 2.4, d: i * 200, t: 500 })
          ink(g, RR(x - 12, 410, 24, 12, 3), { w: 1.8, d: i * 200 + 300, t: 150 })
          const lv = group(g, 'grow-y', `--d:${i * 200 + 400}ms`)
          hatch(lv, [[x - 23, 490], [x + 23, 490], [x + 23, 617], [x - 23, 617]], i * 200 + 400, true)
          ink(g, L([x - 23, 490], [x + 23, 490]), { w: 1.2, d: i * 200 + 500, t: 150 })
        }
      },
      zahlrot(g) {
        // rotes Blutkörperchen: Scheibe mit Delle, aufgeschnitten – innen dicht an dicht Farbstoff-Moleküle
        ink(g, E(180, 440, 120, 60), { w: 3, t: 700 })
        ink(g, E(180, 440, 54, 24), { w: 2, d: 400, t: 500 })
        hatch(g, [...E(180, 440, 116, 56), ...E(180, 440, 58, 28, 360, 0)], 800)
        ink(g, smooth([[60, 580], [70, 556], [120, 548], [180, 566], [240, 548], [290, 556], [300, 580], [290, 604], [240, 612], [180, 594], [120, 612], [70, 604], [60, 580]], 4), { w: 2.6, d: 900, t: 600 })
        let seed = 7
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 40; i++) {
          const x = 80 + rnd() * 200
          const y = 566 + rnd() * 30 + (Math.abs(x - 180) < 30 ? 10 : 0)
          dot(g, x, y, 1.8, 1200 + i * 20)
        }
        ink(g, L([180, 500], [180, 546]), { w: 1, d: 1000, t: 200 })
      },
      lippen(g) {
        const top: P[] = [...B([60, 470], [110, 420], [150, 430], [180, 446]), ...B([180, 446], [210, 430], [250, 420], [300, 470]).slice(1)]
        const bot: P[] = B([60, 470], [120, 540], [240, 540], [300, 470])
        hatch(g, [...top, ...bot.slice().reverse()], 600, true)
        ink(g, top, { w: 3, t: 600 })
        ink(g, bot, { w: 3, d: 200, t: 600 })
        ink(g, B([70, 470], [130, 480], [230, 480], [290, 470]), { w: 1.6, d: 400, t: 400 })
        for (let k = 0; k < 6; k++) ink(g, L([100 + k * 30, 500], [102 + k * 30, 520]), { w: 0.8, d: 700, t: 100 })
        flake(g, 300, 340, 22, 700)
        flake(g, 60, 360, 14, 800)
        flow(g, smooth([[40, 580], [120, 572], [240, 588], [320, 578]]), { n: 3, ms: 5000, d: 1000, r: 2 })
        ink(g, smooth([[40, 580], [120, 572], [240, 588], [320, 578]]), { w: 1.4, d: 900, t: 500 })
      },
      fleck(g) {
        // ein Fleck im Lauf der Tage: dunkel, dann grünlich, dann gelb (immer heller schraffiert)
        ;[['Tag 1', 'dicht'], ['Tag 5', 'hell'], ['Tag 9', 'leer']].forEach(([n, f], i) => {
          const x = 70 + i * 110
          const b: P[] = smooth(Array.from({ length: 9 }, (_, k) => {
            const a = (k / 9) * Math.PI * 2
            const r = 1 + 0.15 * Math.sin(a * 2 + i)
            return [x + Math.cos(a) * 40 * r, 460 + Math.sin(a) * 32 * r] as P
          }).concat([[x + 40 * (1 + 0.15 * Math.sin(i)), 460]]), 5)
          blank(g, b)
          if (f !== 'leer') hatch(g, b, 300 + i * 400, f === 'dicht')
          else for (let k = 0; k < 10; k++) dot(g, x - 24 + (k % 5) * 12, 450 + Math.floor(k / 5) * 18, 1.4, 900 + i * 400)
          ink(g, b, { w: 2.4, d: i * 400, t: 400 })
          text(g, x, 530, n, { anchor: 'middle', cls: 's', d: 200 + i * 400 })
          if (i < 2) arrow(g, L([x + 46, 460], [x + 64, 460]), { w: 2, d: 300 + i * 400, t: 200, head: 7 })
        })
        ink(g, smooth([[20, 600], [120, 596], [240, 604], [340, 598]]), { w: 2.4, d: 300, t: 600 })
      },
      schichten(g) {
        ink(g, L([20, 360], [340, 360]), { w: 3, t: 500 })
        hatch(g, RR(20, 362, 320, 280, 2), 300)
        ink(g, smooth([[20, 400], [120, 396], [240, 404], [340, 398]]), { w: 1, d: 300, t: 500 })
        blank(g, E(250, 520, 34, 26))
        hatch(g, E(250, 520, 30, 22), 700, true)
        ink(g, E(250, 520, 34, 26), { w: 2.6, d: 500, t: 500 })
        sun(g, 60, 290, 16, 200, 8)
        const blue = st(g, 'x1', '--o: 120px 380px')
        arrow(blue, L([100, 320], [110, 384]), { w: 2.4, t: 0, head: 9 })
        arrow(blue, L([120, 384], [134, 330]), { w: 2.4, t: 0, head: 9 })
        text(blue, 120, 316, 'Blau', { anchor: 'middle', cls: 's halo', fade: false })
        const red = st(g, 'x2', '--o: 250px 470px')
        arrow(red, L([220, 320], [242, 486]), { w: 2.4, t: 0, head: 9 })
        text(red, 214, 312, 'Rot', { anchor: 'middle', cls: 's halo', fade: false })
        const red2 = st(g, 'x3', '--o: 300px 500px')
        arrow(red2, L([300, 320], [310, 470]), { w: 2.4, t: 0, head: 9 })
        arrow(red2, L([318, 470], [330, 330]), { w: 2.4, t: 0, head: 9 })
        text(red2, 316, 312, 'Rot', { anchor: 'middle', cls: 's halo', fade: false })
      },
      vergleich(g) {
        // das Auge vergleicht: Haut daneben (warm) – Stelle über der Vene (weniger Rot)
        hatch(g, RR(40, 400, 120, 140, 10), 300)
        ink(g, RR(40, 400, 120, 140, 10), { w: 2.6, t: 500 })
        hatch(g, RR(200, 400, 120, 140, 10), 500, true)
        ink(g, RR(200, 400, 120, 140, 10), { w: 2.6, d: 200, t: 500 })
        eyeFront(g, 180, 600, 0.55, 800)
        for (const x of [100, 260]) dashes(g, L([180, 580], [x, 544]), { w: 1, d: 1000, dash: 4, gap: 4 })
        question(g, 180, 350, 0.6, 1200)
      },
      gefaesse(g) {
        // Schnitt durchs Gewebe: Vene dicht unter der Haut (dünne Wand, Klappe), Arterie tief (dicke Muskelwand)
        ink(g, L([20, 340], [340, 340]), { w: 3, t: 400 })
        hatch(g, RR(20, 342, 320, 300, 2), 300)
        blank(g, E(90, 400, 46, 30))
        ink(g, E(90, 400, 46, 30), { w: 1.6, d: 500, t: 400 })
        hatch(g, E(90, 400, 42, 26), 700, true)
        ink(g, [[60, 388], [90, 404], [120, 388]], { w: 1.4, d: 900, t: 200 })
        blank(g, E(250, 560, 56))
        ink(g, E(250, 560, 56), { w: 2.6, d: 600, t: 500 })
        for (let k = 0; k < 4; k++) ink(g, E(250, 560, 50 - k * 4, 50 - k * 4, k * 30, k * 30 + 300), { w: 0.9, d: 800 + k * 60, t: 200 })
        blank(g, E(250, 560, 32))
        hatch(g, E(250, 560, 30), 900, true)
        ink(g, E(250, 560, 32), { w: 2.2, d: 700, t: 400 })
        arrow(g, L([316, 344], [316, 500]), { w: 1.4, d: 1100, t: 300, head: 6 })
      },
      lehrbuch(g) {
        // aufgeschlagenes Lehrbuch: Herz mit Gefäßen, Venen hell, Arterien dunkel gemalt
        const l: P[] = [[180, 330], [40, 316], [40, 630], [180, 644], [180, 330]]
        const r: P[] = [[180, 330], [320, 316], [320, 630], [180, 644], [180, 330]]
        blank(g, l)
        blank(g, r)
        ink(g, l, { w: 2.6, t: 600 })
        ink(g, r, { w: 2.6, d: 200, t: 600 })
        for (let k = 0; k < 8; k++) ink(g, L([200, 360 + k * 16], [300, 356 + k * 16]), { w: 0.9, d: 600 + k * 40, t: 100 })
        heart(g, 110, 500, 1.2, 400, false)
        const vein = RR(70, 360, 14, 100, 7)
        const art = RR(136, 360, 14, 100, 7)
        hatch(g, art, 900, true)
        ink(g, art, { w: 2.2, d: 700, t: 400 })
        hatch(g, vein, 900)
        ink(g, vein, { w: 2.2, d: 600, t: 400 })
        for (let k = 0; k < 6; k++) ink(g, L([200, 520 + k * 16], [300, 516 + k * 16]), { w: 0.9, d: 900 + k * 40, t: 100 })
      },
      roehrchen(g) {
        // Blutentnahme-Röhrchen mit Etikett, gefüllt mit dunkelrotem Venenblut; daneben die Kanüle
        ink(g, RR(150, 320, 60, 260, 26), { w: 3, t: 700 })
        hatch(g, RR(156, 420, 48, 154, 22), 600, true)
        ink(g, RR(144, 300, 72, 30, 6), { w: 2.6, d: 300, t: 300 })
        hatch(g, RR(144, 300, 72, 30, 6), 500)
        blank(g, RR(160, 470, 40, 60, 2))
        ink(g, RR(160, 470, 40, 60, 2), { w: 1.4, d: 800, t: 200 })
        for (const y of [484, 496, 508]) ink(g, L([166, y], [194, y]), { w: 0.8, d: 900, t: 100 })
        ink(g, L([250, 420], [300, 360]), { w: 1.6, d: 900, t: 200 })
        ink(g, RR(290, 330, 24, 40, 4), { w: 2, d: 1000, t: 200 })
        flow(g, L([248, 424], [214, 470]), { n: 2, ms: 1400, d: 1300, r: 2 })
      },
      krake(g) {
        // Krake mit Saugnäpfen; ihr Blutfarbstoff enthält Kupfer
        ball(g, 180, 400, 70, { fill: 'hell', w: 3 })
        for (let k = 0; k < 6; k++) {
          const x = 120 + k * 24
          const a = wobble(g, { deg: 6, ox: x, oy: 462, ms: 1800 + k * 200, d: 900 })
          const arm = B([x, 462], [x - 16, 520], [x + 16, 560], [x + (k - 2.5) * 12, 620])
          ink(a, arm, { w: 2.6, d: 500 + k * 100, t: 400 })
          for (let j = 2; j < arm.length - 2; j += 8) ink(a, E(arm[j][0] + 4, arm[j][1], 2.6), { w: 0.8, d: 900 + k * 100, t: 80 })
        }
        ink(g, E(156, 394, 9, 7), { w: 1.6, d: 800, t: 200 })
        ink(g, E(204, 394, 9, 7), { w: 1.6, d: 850, t: 200 })
        dot(g, 156, 394, 3, 900)
        dot(g, 204, 394, 3, 950)
        blank(g, E(296, 340, 26))
        ink(g, E(296, 340, 26), { w: 2.2, d: 1100, t: 300 })
        text(g, 296, 347, 'Cu', { anchor: 'middle', size: 20, d: 1200 })
      },
      adel(g) {
        // spanischer Adliger mit Halskrause, blasses Handgelenk mit durchscheinenden Adern
        fig(g, 100, 640, 5, { d: 0 })
        for (let k = 0; k < 10; k++) ink(g, E(100 + Math.cos(k * 0.63) * 18, 518 + Math.sin(k * 0.63) * 5, 6, 4), { w: 1, d: 600 + k * 30, t: 80 })
        const wrist: P[] = [[190, 520], [330, 500], [334, 560], [196, 580]]
        blank(g, [...wrist, wrist[0]])
        ink(g, [...wrist, wrist[0]], { w: 2.4, d: 700, t: 400 })
        for (let i = 0; i < 3; i++) ink(g, B([200, 536 + i * 12], [240, 528 + i * 14], [280, 540 + i * 10], [328, 520 + i * 12]), { w: 1.6, d: 1000 + i * 150, t: 400 })
        text(g, 260, 630, '„sangre azul“', { anchor: 'middle', cls: 'it', d: 1300, size: 20 })
      },
      ende(g) {
        drop(g, 180, 470, 2.6)
        heart(g, 280, 380, 0.6, 600)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { arm: {} } },
      { t: T('Unter der Haut schimmern deine Venen bläulich. Viele glauben deshalb: Blut ohne Sauerstoff ist **blau**.', 480), gfx: { arm: {} } },
      { t: T('Doch Blut ist immer **rot**: hellrot mit viel Sauerstoff, dunkelrot mit wenig.', 64), gfx: { tropfen: {} } },
      { t: T('Die Farbe kommt vom **Hämoglobin**, dem roten Blutfarbstoff. Sein Eisen bindet Sauerstoff – und verändert dabei den Rotton.', 64), gfx: { haemo: {} } },
      { t: T('Ein Erwachsener hat rund **fünf Liter** Blut – etwa sieben Prozent seines Körpergewichts.', 64), gfx: { menge: {} } },
      { t: T('Jedes rote Blutkörperchen steckt voller Farbstoff: rund **270 Millionen** Hämoglobin-Moleküle.', 64), gfx: { zahlrot: {} } },
      { t: T('Beim Blutabnehmen siehst du es selbst: Venenblut im Röhrchen ist **dunkelrot**, nicht blau.', 64), gfx: { roehrchen: {} } },
      { t: T('Warum also blau? Das liegt am **Licht** – und daran, wie es durch deine Haut wandert.', 64), gfx: { schichten: {} } },
      { t: T('Blaues Licht dringt kaum ein. Es wird schon in den **oberen Schichten** zurückgeworfen – über der Vene genauso wie daneben.', 64), gfx: { schichten: { cls: 'a1' } } },
      { t: T('Rotes Licht dringt **tiefer** ein. Trifft es auf eine Vene, schluckt das Blut einen Teil davon.', 64), gfx: { schichten: { cls: 'a1 a2' } } },
      { t: T('Neben der Vene dagegen kommt viel Rot zurück. Über der Vene fehlt also **vor allem Rot**.', 64), gfx: { schichten: { cls: 'a1 a2 a3' } } },
      { t: T('Dein Gehirn vergleicht mit der warm getönten Haut drumherum – und deutet die Stelle als **bläulich**.', 64), gfx: { vergleich: {} } },
      { t: T('Arterien siehst du kaum: Sie liegen **tiefer** und haben dicke, muskulöse Wände.', 64), gfx: { gefaesse: {} } },
      { t: T('Und in Schulbüchern? Dort sind Venen **blau** gemalt und Arterien rot – eine Farbregel für Zeichnungen, keine Fotografie.', 64), gfx: { lehrbuch: {} } },
      { t: T('Blaue Lippen bei Kälte? Dort fließt das Blut langsamer und gibt **mehr Sauerstoff** ab – es wird dunkler und schimmert bläulich.', 64), gfx: { lippen: {} } },
      { t: T('Und blaue Flecken? Dort ist Blut ins Gewebe gesickert. Beim Abbau wird sein Farbstoff erst **grün, dann gelb**.', 64), gfx: { fleck: {} } },
      { t: T('Wirklich blaues Blut gibt es trotzdem: **Kraken** und Hummer nutzen Hämocyanin – mit Kupfer statt Eisen.', 64), gfx: { krake: {} } },
      { t: T('„Blaublütig“ für Adlige kommt aus Spanien: Bei heller Haut, die nie auf dem Feld in der Sonne war, schimmerten die **Venen** deutlich durch.', 64), gfx: { adel: {} } },
      { t: T('Dein Blut ist **immer rot** – das Blau ist ein Trick des Lichts.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Blut ist immer rot – hellrot mit, dunkelrot mit wenig Sauerstoff.', 'Rotes Licht dringt tiefer ein und wird über Venen geschluckt; blaues kommt überall gleich zurück.', 'Im Vergleich zur Haut daneben wirken Venen deshalb bläulich.'],
    sources: ['Kienle et al. 1996, Applied Optics 35 (Why do veins appear blue?)', 'Campbell Biology: Hämoglobin', 'Coates 2014: Hämocyanin bei Weichtieren'],
  },
  {
    id: 'dna-zwei-meter',
    area: 'BIO',
    day: 23,
    hook: 'In jeder deiner Zellen stecken zwei Meter Faden. Wie passt das hinein?',
    mood: 'raetsel',
    ambience: 'blasen',
    images: [],
    draw: {
      zelle(g) {
        cell(g, 180, 250, 150, 120, 0, false)
        for (const [a, b] of [[0.5, -0.4], [0.55, 0.4], [-0.6, 0.45]] as const) mito(g, 180 + a * 150, 250 + b * 120, 0.5, 700)
        ink(g, E(170, 250, 70, 60), { w: 2.6, d: 600, t: 600 })
        for (let k = 0; k < 10; k++) {
          const a = rad(k * 36)
          ink(g, E(170 + Math.cos(a) * 70, 250 + Math.sin(a) * 60, 2.4), { w: 0.8, d: 900 + k * 30, t: 60 })
        }
        coil(g, 170, 250, 58, 900)
      },
      leiter(g) {
        // Doppelhelix mit Zucker-Phosphat-Rückgrat und Basenpaaren, sie dreht sich langsam
        ladder(g, 30, 330, 470, 54)
        flow(g, L([30, 470], [330, 470]), { n: 3, ms: 3000, d: 1200, r: 2.2, kind: 'ring' })
      },
      buchstaben(g) {
        ladder(g, 30, 330, 470, 64)
        ;[['A', 'T'], ['G', 'C'], ['T', 'A'], ['C', 'G'], ['A', 'T']].forEach(([a, b], i) => {
          const x = 66 + i * 56
          blank(g, RR(x - 14, 440, 28, 60, 6))
          ink(g, RR(x - 14, 440, 28, 60, 6), { w: 1.2, d: 800 + i * 120, t: 200 })
          ink(g, L([x - 10, 470], [x + 10, 470]), { w: 0.8, d: 850 + i * 120, t: 100 })
          text(g, x, 462, a, { anchor: 'middle', size: 16, d: 900 + i * 120 })
          text(g, x, 492, b, { anchor: 'middle', size: 16, d: 950 + i * 120 })
        })
        for (const [l, x] of [['A', 60], ['T', 120], ['G', 220], ['C', 280]] as const) {
          const shape: P[] = l === 'A' || l === 'G' ? [[x - 12, 590], [x + 12, 590], [x + 12, 610], [x + 4, 620], [x - 4, 620], [x - 12, 610], [x - 12, 590]] : [[x - 12, 590], [x + 12, 590], [x + 12, 606], [x - 12, 606], [x - 12, 590]]
          ink(g, shape, { w: 1.6, d: 1500, t: 200 })
          text(g, x, 646, l, { anchor: 'middle', cls: 's', d: 1600 })
        }
        ink(g, L([80, 600], [100, 600]), { w: 1, d: 1700, t: 100 })
        ink(g, L([240, 600], [260, 600]), { w: 1, d: 1700, t: 100 })
      },
      buecher(g) {
        // Bücherregal: tausend dicke Bände, hier ein kleiner Ausschnitt
        for (let r = 0; r < 3; r++) {
          ink(g, L([30, 430 + r * 90], [330, 430 + r * 90]), { w: 2.6, d: r * 200, t: 400 })
          for (let i = 0; i < 12; i++) {
            const x = 36 + i * 24
            const h = 70 + ((i * 7 + r * 3) % 4) * 4
            const b = RR(x, 430 + r * 90 - h, 20, h, 2)
            if ((i + r) % 3 === 0) hatch(g, b, 300 + (r * 12 + i) * 30, true)
            ink(g, b, { w: 1.6, d: (r * 12 + i) * 30, t: 150 })
            ink(g, L([x + 4, 430 + r * 90 - h + 12], [x + 16, 430 + r * 90 - h + 12]), { w: 0.8, d: 400 + (r * 12 + i) * 30, t: 60 })
          }
        }
      },
      gene(g) {
        // ein Strang, auf dem nur kleine Stücke (Gene) Baupläne sind
        ink(g, L([20, 470], [340, 470]), { w: 3, t: 800 })
        for (const [x, w] of [[60, 8], [170, 6], [290, 7]] as const) {
          hatch(g, RR(x, 460, w, 20, 2), 900, true)
          ink(g, RR(x, 460, w, 20, 2), { w: 1.6, d: 900, t: 200 })
        }
        pie(g, 180, 590, 40, 0.02, 1100)
        for (let k = 0; k < 8; k++) ink(g, L([30 + k * 40, 462], [36 + k * 40, 450]), { w: 0.8, d: 600, t: 80 })
      },
      laenge(g) {
        fig(g, 110, 620, 7)
        ink(g, L([250, 620], [250, 320]), { w: 3, d: 500, t: 800 })
        for (const y of [320, 620]) ink(g, L([238, y], [262, y]), { w: 2.4, d: 600, t: 200 })
        for (let k = 1; k < 10; k++) ink(g, L([244, 320 + k * 30], [256, 320 + k * 30]), { w: 1, d: 700 + k * 30, t: 60 })
        ink(g, waveP(320, 620, 290, 6, 30).map(([x, y]) => [y, x] as P), { w: 1.6, d: 900, t: 900 })
      },
      kern(g) {
        // Stecknadelkopf zum Vergleich: der Zellkern ist darauf nicht einmal als Punkt zu sehen
        ink(g, L([40, 470], [180, 470]), { w: 3, t: 400 })
        ball(g, 190, 470, 16, { d: 200, fill: 'hell', w: 2.4 })
        dot(g, 196, 466, 0.8, 700)
        lens(g, 270, 420, 50, 600)
        blank(g, E(270, 420, 46))
        cell(g, 270, 420, 36, 30, 900, true)
        dashes(g, L([206, 464], [228, 440]), { w: 1, d: 800, dash: 3, gap: 3 })
      },
      tennis(g) {
        ball(g, 180, 470, 110, { fill: 'hell', w: 3.2, t: 800 })
        ink(g, B([90, 400], [150, 440], [150, 500], [90, 540]), { w: 2.4, d: 600, t: 500 })
        ink(g, B([270, 400], [210, 440], [210, 500], [270, 540]), { w: 2.4, d: 700, t: 500 })
        coil(g, 180, 470, 80, 900)
        ink(g, B([280, 470], [310, 470], [320, 520], [340, 560]), { w: 1.4, d: 1200, t: 300 })
      },
      perlen(g) {
        // Histon-Spulen: DNA windet sich knapp zweimal um jede
        const xs = [60, 120, 180, 240, 300]
        xs.forEach((x, i) => {
          const y = 470 + (i % 2 ? 20 : -20)
          ball(g, x, y, 18, { d: i * 200, fill: 'dicht', w: 2, t: 300 })
          ink(g, E(x, y, 25, 22, -60, 300), { w: 1.8, d: 300 + i * 200, t: 400 })
          ink(g, E(x, y, 22, 25, 120, 480), { w: 1.4, d: 400 + i * 200, t: 400 })
          if (i < 4) {
            const y2 = 470 + (i % 2 ? -20 : 20)
            const dx = 60
            const dy = y2 - y
            const k = Math.hypot(dx, dy)
            ink(g, L([x + (dx / k) * 25, y + (dy / k) * 25], [x + dx - (dx / k) * 25, y2 - (dy / k) * 25]), { w: 1.8, d: 500 + i * 200, t: 200 })
          }
        })
        ink(g, L([20, 450], [35, 450]), { w: 1.8, d: 200, t: 100 })
        ink(g, L([325, 490], [340, 490]), { w: 1.8, d: 1100, t: 100 })
      },
      schleifen(g) {
        const pts: P[] = []
        for (let r = 0; r < 7; r++) {
          const y = 330 + r * 40
          const a: P = r % 2 ? [320, y] : [40, y]
          const b: P = r % 2 ? [40, y] : [320, y]
          pts.push(...L(a, b).slice(pts.length ? 1 : 0))
          if (r < 6) pts.push(...E(b[0], y + 20, 20, 20, r % 2 ? 270 : -90, r % 2 ? 90 : 90).slice(1))
        }
        ink(g, pts, { w: 2.2, t: 2400 })
        for (let k = 0; k < 40; k++) {
          const q = pts[Math.round((k / 40) * (pts.length - 1))]
          ball(g, q[0], q[1], 3.6, { d: k * 60, fill: 'dicht', w: 1, t: 0 })
        }
      },
      chromosom(g) {
        // X-förmige Chromosomen: zwei Schwesterchromatiden mit Einschnürung und Querbanden
        for (const [x, h, d] of [[90, 160, 0], [180, 130, 300], [270, 100, 600]] as const) {
          for (const k of [-1, 1]) {
            const pts: P[] = [[x + k * 4, 470], ...B([x + k * 4, 470], [x + k * 22, 470 - h * 0.1], [x + k * 22, 470 - h / 2], [x + k * 12, 470 - h / 2]).slice(1), ...B([x + k * 12, 470 - h / 2], [x + k * 2, 470 - h / 2], [x + k * 2, 470 - h * 0.1], [x + k * 4, 470]).slice(1)]
            const ptsB: P[] = pts.map(([px, py]) => [px, 940 - py] as P)
            for (const p of [pts, ptsB]) {
              blank(g, p)
              hatch(g, p, d + 300)
              ink(g, p, { w: 2.2, d, t: 400 })
            }
            for (let b = 1; b < 4; b++) {
              for (const sy of [-1, 1]) ink(g, L([x + k * 4, 470 + sy * b * h * 0.12], [x + k * 18, 470 + sy * b * h * 0.12]), { w: 1.4, d: d + 600, t: 80 })
            }
          }
        }
      },
      karyogramm(g) {
        for (let i = 0; i < 23; i++) {
          const x = 46 + (i % 6) * 54
          const y = 380 + Math.floor(i / 6) * 70
          const h = 50 - i * 1.3
          for (const k of [0, 1]) {
            const r = RR(x + k * 11, y - h / 2, 9, h, 4.5)
            hatch(g, r, 300 + i * 40, true)
            ink(g, r, { w: 1.6, d: i * 40, t: 200 })
            for (let b = 1; b < 3; b++) ink(g, L([x + k * 11, y - h / 2 + b * h / 3], [x + k * 11 + 9, y - h / 2 + b * h / 3]), { w: 0.8, d: 400 + i * 40, t: 60 })
          }
        }
        text(g, 180, 330, '23 Paare', { anchor: 'middle', d: 1200 })
      },
      locker(g) {
        // links aufgelockert, die Ablese-Maschine fährt den Strang entlang – rechts dicht gepackt
        ink(g, waveP(30, 160, 470, 30, 70), { w: 2.4, t: 800 })
        const reader = mk('g', { opacity: 0 }, g)
        blank(reader, E(0, 0, 16, 12))
        hatch(reader, E(0, 0, 16, 12), 0, true)
        ink(reader, E(0, 0, 16, 12), { w: 1.8, t: 0 })
        const wpath = waveP(30, 160, 470, 30, 70)
        mk('set', { attributeName: 'opacity', to: 1, begin: '1s', fill: 'freeze' }, reader)
        mk('animateMotion', { path: `M${wpath.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '4s', begin: '1s', repeatCount: 'indefinite' }, reader)
        const pts: P[] = []
        for (let i = 0; i <= 26; i++) pts.push([210 + i * 4.6, 470 + (i % 2 ? -26 : 26)])
        ink(g, pts, { w: 2, d: 500, t: 800 })
        for (let i = 0; i < 12; i++) ball(g, 214 + i * 10, 470 + (i % 2 ? -14 : 14), 4, { d: 900 + i * 40, fill: 'dicht', w: 1, t: 0 })
        ink(g, RR(200, 430, 140, 80, 10), { w: 2.4, d: 300, t: 500 })
      },
      epi(g) {
        // Markierungen (kleine Fähnchen) auf der DNA bestimmen, welche Abschnitte gelesen werden
        ladder(g, 30, 330, 500, 40)
        for (const [x, d] of [[90, 900], [180, 1100], [270, 1300]] as const) {
          ink(g, L([x, 480], [x, 420]), { w: 2, d, t: 200 })
          const f: P[] = [[x, 420], [x + 26, 428], [x, 436]]
          hatch(g, f, d + 200, true)
          ink(g, [...f, f[0]], { w: 1.6, d: d + 100, t: 200 })
        }
        clock(g, 300, 600, 24, 0, 0, 1500)
        sun(g, 60, 600, 12, 1600, 8)
      },
      sonne(g) {
        earth(g, 50, 470, 26, 0, { lon: 10, lat: 20, w: 0.8 })
        sun(g, 300, 470, 22, 300, 10)
        for (let k = 0; k < 4; k++) {
          const y = 440 + k * 20
          const p = L(k % 2 ? [250, y] : [86, y], k % 2 ? [86, y] : [250, y])
          ink(g, p, { w: 1.2, d: 700 + k * 200, t: 500 })
          flow(g, p, { n: 2, ms: 1800, d: 1200 + k * 200, r: 1.8, kind: 'dash' })
        }
      },
      kopie(g) {
        // Replikation: die Doppelhelix öffnet sich wie ein Reißverschluss, an beiden Hälften entsteht ein neuer Strang
        ladder(g, 20, 160, 470, 30)
        lad(g, [160, 455], [320, 360], 26, 600)
        lad(g, [160, 485], [320, 580], 26, 800)
        const zip = mk('g', {}, g)
        blank(zip, E(160, 470, 14, 22))
        hatch(zip, E(160, 470, 14, 22), 500, true)
        ink(zip, E(160, 470, 14, 22), { w: 2, d: 400, t: 200 })
        for (const [a, b] of [[[320, 360], [210, 425]], [[320, 580], [210, 515]]] as [P, P][]) flow(g, L(a, b), { n: 3, ms: 1400, d: 1500, r: 2 })
      },
      trisomie(g) {
        for (const [x, n] of [[90, 2], [250, 3]] as const) {
          for (let k = 0; k < n; k++) {
            const r = RR(x - (n * 14) / 2 + k * 14, 400, 10, 110, 5)
            hatch(g, r, 300, true)
            ink(g, r, { w: 2, d: k * 100, t: 300 })
            for (let b = 1; b < 4; b++) ink(g, L([x - (n * 14) / 2 + k * 14, 400 + b * 27], [x - (n * 14) / 2 + k * 14 + 10, 400 + b * 27]), { w: 0.8, d: 400 + k * 100, t: 60 })
          }
        }
        text(g, 90, 560, '2', { anchor: 'middle', size: 22, d: 700 })
        text(g, 250, 560, '3', { anchor: 'middle', size: 22, d: 800 })
      },
      ende(g) {
        ink(g, E(180, 520, 90), { w: 3, t: 800 })
        coil(g, 180, 520, 76, 500)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { zelle: {} } },
      { t: T('Deine Erbinformation steckt in der **DNA** – einem langen, extrem dünnen Molekül aus zwei Strängen.', 64), gfx: { leiter: {} } },
      { t: T('Die Information steckt in nur vier Buchstaben: **A, T, G und C**. Sie paaren sich immer gleich – A mit T, G mit C.', 64), gfx: { buchstaben: {} } },
      { t: T('Würdest du die DNA aus einer einzigen Zelle ausrollen, wäre sie rund **zwei Meter** lang.', 64), gfx: { laenge: {} } },
      { t: T('Der Zellkern, in dem sie steckt, misst aber nur etwa **sechs Mikrometer** – sechs Tausendstel Millimeter.', 64), gfx: { kern: {} } },
      { t: T('Das ist, als würdest du **40 Kilometer** Faden in einen Tennisball stopfen. Ohne Knoten!', 64), gfx: { tennis: {} } },
      { t: T('Dein Erbgut hat rund **3 Milliarden** Buchstaben. Ausgedruckt füllte es etwa tausend dicke Bücher.', 64), gfx: { buecher: {} } },
      { t: T('Der Trick heißt **Aufwickeln**: Die DNA windet sich um winzige Eiweiß-Spulen, die Histone.', 64), gfx: { perlen: {} } },
      { t: T('Das sieht aus wie eine Perlenkette. Jede Spule trägt knapp **zwei Windungen** DNA.', 64), gfx: { perlen: {} } },
      { t: T('Die Perlenkette faltet sich weiter zu Schleifen – **Schleife auf Schleife**, immer dichter.', 64), gfx: { schleifen: {} } },
      { t: T('Vor einer Zellteilung wird sie maximal verdichtet. Dann entstehen die **Chromosomen**, die man im Mikroskop sieht.', 64), gfx: { chromosom: {} } },
      { t: T('Der Mensch hat **46** davon: 23 von der Mutter, 23 vom Vater.', 64), gfx: { karyogramm: {} } },
      { t: T('Ist eins zu viel – wie bei der **Trisomie 21** –, verändert das die ganze Entwicklung.', 64), gfx: { trisomie: {} } },
      { t: T('Nur rund **zwei Prozent** davon sind Baupläne für Eiweiße. Der Rest regelt, schaltet – oder ist noch ein Rätsel.', 64), gfx: { gene: {} } },
      { t: T('Das Packen ist kein Chaos: Gene, die gebraucht werden, liegen **locker**, damit die Zelle sie lesen kann. Der Rest wird eng weggepackt.', 64), gfx: { locker: {} } },
      { t: T('Wie eng ein Gen gepackt ist, steuern chemische Markierungen. Sie können sich mit Umwelt und Alter ändern – das erforscht die **Epigenetik**.', 64), gfx: { epi: {} } },
      { t: T('Bei jeder Zellteilung kopiert die Zelle alle zwei Meter – in wenigen Stunden und mit **kaum einem Fehler**.', 64), gfx: { kopie: {} } },
      { t: T('Alle DNA deines Körpers aneinandergelegt würde **dutzende Male** von der Erde zur Sonne und zurück reichen.', 64), gfx: { sonne: {} } },
      { t: T('Zwei Meter Faden – **genial aufgewickelt**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die DNA einer Zelle ist ausgerollt rund zwei Meter lang, der Zellkern nur ~6 µm groß.', 'Sie wickelt sich um Histone, faltet sich zu Schleifen und bei der Teilung zu Chromosomen.', 'Locker gepackte Gene werden gelesen, eng gepackte ruhen (Epigenetik).'],
    sources: ['Alberts et al.: Molecular Biology of the Cell, Kap. 4', 'Annunziato 2008, Nature Education 1(1)', 'Piovesan et al. 2019, BMC Research Notes (Genomlänge)'],
  },
  {
    id: 'blaue-augen',
    area: 'BIO',
    day: 23,
    hook: 'Blaue Augen haben gar kein blaues Pigment. Wie geht das?',
    mood: 'hell',
    ambience: 'blasen',
    images: [],
    draw: {
      auge(g) {
        eyeFront(g, 180, 260, 2.6)
        ink(g, B([30, 150], [100, 110], [260, 110], [330, 150]), { w: 2.4, d: 600, t: 500 })
        for (let k = 0; k < 9; k++) ink(g, L([60 + k * 30, 140 - Math.sin((k / 8) * Math.PI) * 22], [66 + k * 30, 124 - Math.sin((k / 8) * Math.PI) * 22]), { w: 1.4, d: 800 + k * 40, t: 80 })
      },
      iris(g) {
        // Iris im Querschnitt neben dem Auge: vordere Schicht, Bindegewebe, hintere Pigmentschicht
        eyeFront(g, 180, 400, 2.2)
        ink(g, RR(40, 520, 280, 110, 8), { w: 2, d: 800, t: 400 })
        ink(g, L([40, 550], [320, 550]), { w: 1.2, d: 900, t: 300 })
        hatch(g, RR(42, 604, 276, 24, 4), 1100, true)
        ink(g, L([40, 604], [320, 604]), { w: 1.2, d: 1000, t: 300 })
        for (let k = 0; k < 12; k++) ink(g, B([50 + k * 23, 556], [56 + k * 23, 570], [48 + k * 23, 586], [56 + k * 23, 600]), { w: 0.8, d: 1100 + k * 30, t: 100 })
        dashes(g, L([226, 430], [300, 520]), { w: 1, d: 800, dash: 3, gap: 4 })
      },
      braun(g) {
        hatch(g, RR(40, 450, 280, 40, 6), 300, true)
        ink(g, RR(40, 450, 280, 40, 6), { w: 2.4, t: 500 })
        ink(g, RR(40, 380, 280, 60, 6), { w: 2.4, d: 100, t: 500 })
        let seed = 3
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 70; i++) dot(g, 50 + rnd() * 260, 388 + rnd() * 44, 3, 500 + i * 15)
        for (const x of [150, 180, 210]) {
          const p = L([x, 300], [x + 4, 384])
          arrow(g, p, { w: 2, d: 900, t: 400, head: 8 })
          flow(g, p, { n: 2, ms: 1000, d: 1300, r: 2 })
        }
        sun(g, 70, 320, 14, 700, 8)
      },
      blau(g) {
        hatch(g, RR(40, 450, 280, 40, 6), 300, true)
        ink(g, RR(40, 450, 280, 40, 6), { w: 2.4, t: 500 })
        ink(g, RR(40, 380, 280, 60, 6), { w: 2.4, d: 100, t: 500 })
        for (let k = 0; k < 12; k++) ink(g, B([50 + k * 23, 384], [58 + k * 23, 400], [46 + k * 23, 418], [54 + k * 23, 436]), { w: 0.9, d: 400 + k * 30, t: 100 })
        for (const [x, y] of [[80, 400], [250, 420], [300, 396]] as const) dot(g, x, y, 3, 500)
        sun(g, 70, 320, 14, 600, 8)
        const p = L([150, 300], [160, 404])
        arrow(g, p, { w: 2.4, d: 700, t: 400, head: 9 })
        flow(g, p, { n: 2, ms: 1000, d: 1100, r: 2.2 })
        const sc = st(g, 'x1', '--o: 170px 410px')
        arrow(sc, L([170, 404], [214, 320]), { w: 2.2, t: 0, head: 8 })
        arrow(sc, L([170, 404], [116, 330]), { w: 2.2, t: 0, head: 8 })
        flow(sc, L([170, 404], [214, 320]), { n: 2, ms: 1000, r: 2 })
        text(sc, 240, 320, 'Blau', { cls: 's', fade: false })
      },
      feder(g) {
        // Eisvogel-Feder: Kiel mit Ästen; zerrieben bleibt graues Pulver
        ink(g, B([90, 620], [140, 520], [200, 420], [270, 320]), { w: 3, t: 700 })
        for (let i = 1; i < 14; i++) {
          const t = i / 14
          const x = 90 + (270 - 90) * t
          const y = 620 - 300 * t
          ink(g, B([x, y], [x - 14, y - 4], [x - 28 + t * 10, y - 14], [x - 40 + t * 10, y - 22]), { w: 1.4, d: 500 + i * 60, t: 150 })
          ink(g, B([x, y], [x + 12, y + 2], [x + 22 - t * 6, y + 8], [x + 32 - t * 10, y + 14]), { w: 1.4, d: 550 + i * 60, t: 150 })
        }
        hatch(g, [[150, 540], [170, 470], [230, 400], [250, 420], [200, 500], [170, 560]], 1200)
        arrow(g, L([270, 520], [300, 560]), { w: 2, d: 1400, t: 300, head: 8 })
        ink(g, B([280, 600], [296, 588], [320, 588], [334, 600]), { w: 2, d: 1600, t: 300 })
        for (let k = 0; k < 10; k++) dot(g, 288 + (k % 5) * 9, 596 - Math.floor(k / 5) * 5, 1.6, 1700 + k * 30)
      },
      licht(g) {
        sun(g, 70, 360, 22)
        cloud(g, 120, 420, 0.5, 300, true)
        eyeFront(g, 230, 500, 1.2, 400)
        for (const y of [380, 410]) flow(g, L([100, y], [200, 480]), { n: 2, ms: 1200, d: 900, r: 1.8, kind: 'dash' })
      },
      grau(g) {
        hatch(g, RR(40, 450, 280, 40, 6), 300, true)
        ink(g, RR(40, 450, 280, 40, 6), { w: 2.4, t: 500 })
        ink(g, RR(40, 380, 280, 60, 6), { w: 2.4, d: 100, t: 500 })
        for (let k = 0; k < 24; k++) ink(g, B([46 + k * 11.5, 384], [52 + k * 11.5, 400], [42 + k * 11.5, 418], [50 + k * 11.5, 436]), { w: 0.9, d: 400 + k * 20, t: 100 })
        arrow(g, L([150, 300], [160, 376]), { w: 2.6, d: 700, t: 400, head: 9 })
        for (const [a, b] of [[[170, 376], [206, 310]], [[166, 376], [124, 314]], [[176, 374], [180, 300]]] as const) {
          arrow(g, L(a as P, b as P), { w: 2, d: 1100, t: 300, head: 8 })
          flow(g, L(a as P, b as P), { n: 1, ms: 1000, d: 1500, r: 1.8 })
        }
      },
      gruen(g) {
        // grüne Iris: gelbbraune Pigment-Tupfen in der vorderen Schicht + blaues Streulicht
        eyeFront(g, 180, 420, 1.6)
        ink(g, RR(40, 520, 280, 80, 8), { w: 2.2, d: 600, t: 400 })
        let seed = 9
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 26; i++) {
          const x = 50 + rnd() * 260
          const y = 530 + rnd() * 26
          ink(g, E(x, y, 3), { w: 0.9, d: 800 + i * 20, t: 60 })
        }
        for (let k = 0; k < 12; k++) ink(g, B([50 + k * 23, 560], [56 + k * 23, 574], [48 + k * 23, 586], [54 + k * 23, 598]), { w: 0.8, d: 1000 + k * 30, t: 100 })
        arrow(g, L([150, 600], [130, 640]), { w: 1.6, d: 1300, t: 200, head: 6 })
      },
      baby(g) {
        // Babygesicht mit Mützchen
        ball(g, 180, 480, 110, { w: 3.2 })
        ink(g, B([70, 470], [80, 360], [280, 360], [290, 470]), { w: 3, d: 300, t: 600 })
        hatch(g, [...B([70, 470], [80, 360], [280, 360], [290, 470]), ...B([290, 470], [220, 430], [140, 430], [70, 470]).slice(1)], 700)
        for (const x of [140, 220]) {
          ink(g, E(x, 490, 18, 12), { w: 2.4, d: 600, t: 300 })
          ink(g, E(x, 490, 8), { w: 1.4, d: 800, t: 200 })
          dot(g, x, 490, 3.4, 900)
        }
        ink(g, B([150, 540], [170, 556], [190, 556], [210, 540]), { w: 2.4, d: 1000, t: 300 })
        ink(g, E(180, 516, 5, 3), { w: 1.4, d: 1000, t: 100 })
      },
      braunfrueher(g) {
        crowd(g, 50, 600, 8, 37, 2, 0, 120)
        for (let i = 0; i < 8; i++) dot(g, 50 + i * 37, 543, 1.6, 1100 + i * 60)
        ground(g, 20, 340, 602, 200)
      },
      mutation(g) {
        // Erbgut-Schalter: ein Abschnitt vor dem Gen OCA2 ist verändert und drosselt es
        ladder(g, 30, 330, 470, 44)
        hatch(g, RR(126, 446, 28, 48, 4), 1000, true)
        ink(g, RR(126, 446, 28, 48, 4), { w: 2.6, d: 900, t: 300 })
        ink(g, RR(200, 440, 110, 60, 6), { w: 2, d: 1100, t: 300 })
        text(g, 140, 420, 'HERC2', { anchor: 'middle', cls: 's', d: 1200 })
        text(g, 255, 530, 'OCA2', { anchor: 'middle', cls: 's', d: 1300 })
        arrow(g, B([154, 440], [170, 400], [220, 400], [240, 438]), { w: 1.6, d: 1400, t: 300, head: 7 })
        cross(g, 200, 394, 0.4, 1700)
      },
      stammbaum(g) {
        const lv: P[][] = [[[180, 330]], [[110, 430], [250, 430]], [[60, 540], [140, 540], [220, 540], [300, 540]]]
        lv.forEach((row, i) => row.forEach(([x, y], j) => {
          eyeFront(g, x, y, 0.16, i * 500 + j * 80)
          if (i) {
            const [px, py] = lv[i - 1][Math.floor(j / 2)]
            ink(g, L([px, py + 12], [x, y - 12]), { w: 2, d: i * 500 - 200, t: 300 })
          }
        }))
        for (let k = 0; k < 8; k++) {
          const x = 40 + k * 40
          eyeFront(g, x, 620, 0.12, 1500 + k * 60)
          ink(g, L([lv[2][Math.floor(k / 2)][0], 552], [x, 610]), { w: 1.4, d: 1300, t: 300 })
        }
      },
      anteil(g) {
        // Europa-Karte: rund um die Ostsee sind helle Augen am häufigsten
        const pr = mapRegion(g, 30, 340, 300, 230, -10, 40, 40, 70, 0)
        const c = pr(20, 58)
        for (const r of [30, 54, 80]) dashes(g, E(c[0], c[1], r, r * 0.7), { w: 1.4, d: 900 + r * 5, dash: 5, gap: 5 })
        pie(g, 70, 620, 26, 0.09, 1300)
      },
      hetero(g) {
        // zwei verschiedene Augen
        eyeFront(g, 100, 470, 0.9)
        hatch(g, [...E(100, 470, 20), ...E(100, 470, 9, 9, 360, 0)], 900, true)
        eyeFront(g, 260, 470, 0.9, 300)
        ink(g, B([50, 420], [80, 404], [120, 404], [150, 420]), { w: 2.2, d: 600, t: 300 })
        ink(g, B([210, 420], [240, 404], [280, 404], [310, 420]), { w: 2.2, d: 700, t: 300 })
        ink(g, B([170, 480], [176, 520], [184, 520], [190, 500]), { w: 2, d: 900, t: 300 })
      },
      albino(g) {
        eyeFront(g, 180, 460, 2.2)
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45 + 20)
          ink(g, B([180 + Math.cos(a) * 46, 460 + Math.sin(a) * 46], [180 + Math.cos(a) * 40, 460 + Math.sin(a) * 40], [180 + Math.cos(a + 0.2) * 32, 460 + Math.sin(a + 0.2) * 32], [180 + Math.cos(a + 0.3) * 36, 460 + Math.sin(a + 0.3) * 36]), { w: 1.2, d: 900 + k * 80, t: 200 })
        }
      },
      blendung(g) {
        sun(g, 80, 360, 26)
        eyeFront(g, 230, 500, 1.1, 400)
        for (const [a, b] of [[[120, 390], [180, 450]], [[110, 410], [170, 480]]] as const) {
          arrow(g, L(a as P, b as P), { w: 2, d: 800, t: 300, head: 8 })
          flow(g, L(a as P, b as P), { n: 2, ms: 900, d: 1200, r: 2 })
        }
        ink(g, B([164, 460], [200, 420], [262, 420], [296, 460]), { w: 3, d: 1300, t: 300 })
      },
      ende(g) {
        eyeFront(g, 180, 480, 2)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { auge: {} } },
      { t: T('Die Augenfarbe sitzt in der **Iris**, dem farbigen Ring um die Pupille.', 64), gfx: { iris: {} } },
      { t: T('Ihr einziges Farbpigment ist **Melanin** – braun bis schwarz, dasselbe wie in Haut und Haaren. Ein blaues Pigment gibt es dort nicht.', 64), gfx: { iris: {} } },
      { t: T('Braune Augen haben viel Melanin in der vorderen Schicht der Iris. Es **schluckt** den größten Teil des Lichts.', 64), gfx: { braun: {} } },
      { t: T('Blaue Augen haben dort **kaum Melanin**. Das Licht dringt in das trübe Gewebe ein.', 64), gfx: { blau: {} } },
      { t: T('Winzige Fasern darin werfen kurzwelliges **blaues Licht** stärker zurück – derselbe Effekt wie beim blauen Himmel.', 64), gfx: { blau: { cls: 'a1' } } },
      { t: T('Das Blau ist also eine **Strukturfarbe**, wie bei Eisvogel-Federn. Zerreibt man so eine Feder, verschwindet das Blau.', 64), gfx: { feder: {} } },
      { t: T('Darum wirken manche Augen je nach **Licht** mal blau, mal grau: Was zurückkommt, hängt davon ab, was hineinfällt.', 64), gfx: { licht: {} } },
      { t: T('Graue Augen haben vermutlich noch mehr Fasern in der Iris. Die streuen **alle Farben** ähnlich stark – das Ergebnis wirkt grau.', 64), gfx: { grau: {} } },
      { t: T('Grüne Augen sind eine Mischung: etwas gelbbraunes Pigment plus **blaue Streuung**.', 64), gfx: { gruen: {} } },
      { t: T('Viele hellhäutige Babys kommen mit **blaugrauen** Augen zur Welt. Das Melanin bildet sich erst in den ersten Lebensjahren.', 64), gfx: { baby: {} } },
      { t: T('Ursprünglich hatten wohl alle Menschen **braune** Augen.', 64), gfx: { braunfrueher: {} } },
      { t: T('Vor etwa 6.000 bis 10.000 Jahren entstand eine kleine Änderung im Erbgut – ein **Schalter**, der das Gen OCA2 in der Iris drosselt.', 64), gfx: { mutation: {} } },
      { t: T('Fast alle Blauäugigen tragen **dieselbe** Variante. Sie stammen wohl von einem gemeinsamen Vorfahren ab.', 64), gfx: { stammbaum: {} } },
      { t: T('Weltweit haben heute schätzungsweise **8 bis 10 Prozent** der Menschen blaue Augen – am häufigsten rund um die Ostsee.', 64), gfx: { anteil: {} } },
      { t: T('Selten hat ein Mensch **zwei verschiedene** Augenfarben – meist, weil eine Iris weniger Melanin bekommen hat.', 64), gfx: { hetero: {} } },
      { t: T('Menschen mit Albinismus fehlt Melanin fast ganz. Ihre Iris wirkt hellblau – oder sogar **rötlich**, weil die Blutgefäße durchscheinen.', 64), gfx: { albino: {} } },
      { t: T('Weil schützendes Pigment fehlt, sind helle Augen oft **blendempfindlicher**.', 64), gfx: { blendung: {} } },
      { t: T('Blaue Augen sind **gestreutes Licht** – kein Farbstoff.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die Iris enthält nur braunes Melanin – blaues Pigment gibt es nicht.', 'Bei wenig Melanin streuen Fasern in der Iris blaues Licht zurück: eine Strukturfarbe.', 'Fast alle Blauäugigen teilen eine Variante, die vor 6.000–10.000 Jahren entstand.'],
    sources: ['Sturm & Larsson 2009, Pigment Cell & Melanoma Research 22', 'Eiberg et al. 2008, Human Genetics 123', 'American Academy of Ophthalmology: Eye color'],
  },
  {
    id: 'mitochondrien',
    area: 'BIO',
    day: 1,
    hook: 'In jeder deiner Zellen wohnen ehemalige Bakterien.',
    mood: 'raetsel',
    ambience: 'blasen',
    images: [],
    draw: {
      zelle(g) {
        cell(g, 180, 250, 150, 120)
        mito(g, 90, 200, 0.8, 900)
        mito(g, 262, 310, 0.8, 1000)
        mito(g, 250, 170, 0.7, 1100)
        mito(g, 110, 320, 0.6, 1200)
      },
      kraftwerk(g) {
        // Mitochondrium im Schnitt: Zucker und Sauerstoff hinein, ATP hinaus
        mito(g, 180, 470, 2.8)
        ink(g, L([60, 380], [110, 430]), { w: 1.6, d: 900, t: 300 })
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60 + 30)
          ink(g, L([40 + Math.cos(a) * 10, 366 + Math.sin(a) * 10], [40 + Math.cos(a + rad(60)) * 10, 366 + Math.sin(a + rad(60)) * 10]), { w: 1.8, d: 800, t: 80 })
        }
        flow(g, L([56, 380], [110, 432]), { n: 2, ms: 1200, d: 1300, r: 2.2 })
        ball(g, 34, 580, 6, { d: 900, w: 1.4, t: 0 })
        ball(g, 46, 580, 6, { d: 900, w: 1.4, t: 0 })
        flow(g, L([56, 572], [110, 520]), { n: 2, ms: 1200, d: 1400, r: 2.2 })
        const out = L([270, 470], [306, 470])
        arrow(g, out, { w: 2.4, d: 1200, t: 300, head: 9 })
        flow(g, out, { n: 3, ms: 900, d: 1600, r: 2.4 })
        text(g, 316, 476, 'ATP', { d: 1300 })
      },
      atp(g) {
        vbars(g, [
          { label: 'du', v: 70, fmt: (v) => `${Math.round(v)} kg` },
          { label: 'ATP', v: 70, fmt: (v) => `≈ ${Math.round(v)} kg`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        arcArrow(g, 235, 300, 26, 200, 520, { d: 1500, t: 500, w: 1.6, head: 6 })
      },
      herz(g) {
        heart(g, 100, 470, 1.8, 0, false)
        // Herzmuskelzelle in der Lupe: Faserbündel, dazwischen Reihen von Mitochondrien
        ink(g, L([150, 450], [196, 430]), { w: 1, d: 600, t: 200 })
        blank(g, E(260, 460, 74))
        for (let r = 0; r < 4; r++) {
          const y = 410 + r * 32
          hatch(g, RR(196, y, 128, 12, 6), 900 + r * 100, true)
          ink(g, RR(196, y, 128, 12, 6), { w: 1.2, d: 800 + r * 100, t: 200 })
          if (r < 3) for (let k = 0; k < 4; k++) {
            const x = 210 + k * 30
            ink(g, RR(x, y + 16, 22, 10, 5), { w: 1.2, d: 1100 + k * 40, t: 100 })
          }
        }
        ink(g, E(260, 460, 74), { w: 2.8, d: 700, t: 400 })
      },
      gift(g) {
        mito(g, 180, 470, 2.6)
        // Atmungskette in der inneren Membran: ein Glied ist blockiert
        for (let k = 0; k < 4; k++) {
          const x = 120 + k * 40
          ball(g, x, 420, 9, { d: 700 + k * 100, fill: k === 3 ? 'dicht' : 'hell', w: 1.6 })
          if (k < 3) arrow(g, L([x + 10, 420], [x + 30, 420]), { w: 1.4, d: 800 + k * 100, t: 150, head: 5 })
        }
        cross(g, 240, 420, 0.7, 1300)
        ink(g, [[290, 330], [310, 330], [314, 370], [286, 370], [290, 330]], { w: 2, d: 900, t: 300 })
        ink(g, L([292, 340], [308, 340]), { w: 1, d: 1000, t: 100 })
        flow(g, L([300, 372], [250, 414]), { n: 2, ms: 1200, d: 1400, r: 2 })
      },
      gehirn(g) {
        brain(g, 180, 450, 1.1)
        pie(g, 290, 600, 30, 0.2, 1100)
        for (let k = 0; k < 8; k++) {
          const p = mk('g', { class: 'blink', style: `--d:${900 + k * 150}ms` }, g)
          dot(p, 120 + (k % 4) * 40, 410 + Math.floor(k / 4) * 50, 3, 900)
        }
      },
      ring(g) {
        mito(g, 110, 470, 2)
        blank(g, E(110, 470, 26))
        ink(g, E(110, 470, 22), { w: 2.4, d: 800, t: 400 })
        for (let k = 0; k < 8; k++) ink(g, L([110 + Math.cos(k * 0.785) * 18, 470 + Math.sin(k * 0.785) * 18], [110 + Math.cos(k * 0.785) * 26, 470 + Math.sin(k * 0.785) * 26]), { w: 0.9, d: 1000, t: 60 })
        text(g, 110, 560, 'Ring-DNA', { anchor: 'middle', cls: 's', d: 1000 })
        for (const [x, h] of [[240, 90], [270, 70], [300, 110]] as const) {
          hatch(g, RR(x - 6, 470 - h / 2, 12, h, 6), 900, true)
          ink(g, RR(x - 6, 470 - h / 2, 12, h, 6), { w: 2, d: 700, t: 300 })
        }
        ink(g, E(270, 470, 60, 76), { w: 2, d: 600, t: 400 })
      },
      bakterium(g) {
        bact(g, 170, 470, 4)
        blank(g, E(150, 470, 22))
        ink(g, E(150, 470, 18), { w: 2.2, d: 600, t: 300 })
        for (let k = 0; k < 8; k++) ink(g, L([150 + Math.cos(k * 0.785) * 14, 470 + Math.sin(k * 0.785) * 14], [150 + Math.cos(k * 0.785) * 22, 470 + Math.sin(k * 0.785) * 22]), { w: 0.9, d: 800, t: 60 })
      },
      merkmale(g) {
        // zwei Hüllen im Ausschnitt – und eine Teilung in der Mitte
        mito(g, 180, 380, 1.8)
        ink(g, RR(118, 352, 124, 56, 28), { w: 1.2, d: 600, t: 400 })
        const a = glide(g, -40, 0, { ms: 2400, d: 1000, loop: true })
        mito(a, 140, 540, 0.9, 900)
        const b = glide(g, 40, 0, { ms: 2400, d: 1000, loop: true })
        mito(b, 220, 540, 0.9, 900)
        ink(g, L([180, 510], [180, 570]), { w: 1, d: 1000, t: 200 })
      },
      schlucken(g) {
        const host: P[] = [...B([60, 470], [60, 340], [230, 330], [260, 400]), ...B([260, 400], [240, 430], [240, 510], [260, 540]).slice(1), ...B([260, 540], [230, 610], [60, 600], [60, 470]).slice(1)]
        blank(g, host)
        ink(g, host, { w: 3, t: 900 })
        hatch(g, E(130, 470, 34, 30), 700, true)
        ink(g, E(130, 470, 34, 30), { w: 2.2, d: 500, t: 400 })
        ink(g, B([250, 410], [290, 390], [320, 430], [300, 470]), { w: 2, d: 800, t: 300 })
        ink(g, B([250, 530], [290, 550], [320, 510], [300, 470]), { w: 2, d: 800, t: 300 })
        const b = st(g, 'm1', '--m1: translateX(-90px); transition-duration: 2s')
        bact(b, 310, 470, 1.4, 800, true)
      },
      partner(g) {
        cell(g, 180, 470, 150, 120)
        mito(g, 250, 470, 1.1, 600)
        const e = B([236, 448], [222, 436], [210, 428], [200, 424])
        arrow(g, e, { w: 2.2, d: 1000, t: 300, head: 8 })
        flow(g, e, { n: 2, ms: 1000, d: 1400, r: 2 })
        const n = B([180, 516], [200, 510], [220, 500], [236, 494])
        arrow(g, n, { w: 2.2, d: 1300, t: 300, head: 8 })
        flow(g, n, { n: 2, ms: 1000, d: 1700, r: 2 })
        text(g, 196, 404, 'Energie', { anchor: 'middle', cls: 's', d: 1200 })
      },
      komplex(g) {
        ball(g, 50, 470, 18, { fill: 'hell' })
        arrow(g, L([76, 470], [110, 470]), { w: 2.2, d: 400, t: 300, head: 8 })
        cell(g, 170, 470, 50, 44, 600)
        mito(g, 160, 450, 0.3, 1200)
        arrow(g, L([226, 470], [250, 470]), { w: 2.2, d: 900, t: 300, head: 8 })
        tree(g, 290, 440, 0.3, 1200)
        fig(g, 300, 560, 1.4, { d: 1400 })
        const shroom: P[] = [...B([250, 560], [250, 530], [290, 530], [290, 560])]
        ink(g, [...shroom, [250, 560]], { w: 1.8, d: 1500, t: 200 })
        ink(g, L([270, 560], [270, 580]), { w: 1.8, d: 1600, t: 100 })
      },
      margulis(g) {
        for (let i = 0; i < 15; i++) {
          const x = 50 + (i % 5) * 60
          const y = 360 + Math.floor(i / 5) * 80
          letter(g, x - 4, y, 46, i * 80)
          cross(g, x + 34, y + 36, 0.5, 300 + i * 80)
        }
        check(g, 180, 620, 1.2, 1700)
      },
      verwandt(g) {
        ink(g, L([180, 600], [180, 520]), { w: 2.6, t: 400 })
        ink(g, L([180, 520], [100, 420]), { w: 2.6, d: 400, t: 400 })
        ink(g, L([180, 520], [260, 420]), { w: 2.6, d: 400, t: 400 })
        mito(g, 100, 390, 1, 800)
        bact(g, 260, 390, 1.4, 900)
        text(g, 260, 350, 'Alphaproteobakterien', { anchor: 'middle', cls: 's', d: 1100 })
        ladder(g, 60, 300, 640, 20, 1200, 600)
      },
      chloro(g) {
        leaf(g, 140, 500, 1.1)
        ink(g, L([170, 470], [220, 430]), { w: 1, d: 900, t: 200 })
        blank(g, E(270, 400, 70, 40))
        ink(g, E(270, 400, 70, 40), { w: 2.6, d: 900, t: 400 })
        for (const x of [230, 260, 290, 314]) for (let k = 0; k < 4; k++) {
          hatch(g, RR(x - 10, 382 + k * 9, 20, 6, 3), 1200, true)
          ink(g, RR(x - 10, 382 + k * 9, 20, 6, 3), { w: 0.8, d: 1100 + k * 40, t: 80 })
        }
      },
      mutter(g) {
        // Eizelle voller Mitochondrien, Spermium bringt kaum welche mit
        ink(g, E(110, 470, 80), { w: 3, t: 700 })
        ink(g, E(110, 470, 72), { w: 1, d: 200, t: 700 })
        for (let k = 0; k < 10; k++) mito(g, 110 + Math.cos(k * 0.63) * 46, 470 + Math.sin(k * 0.63) * 46, 0.28, 600 + k * 50)
        hatch(g, E(110, 470, 22), 900, true)
        const sp = glide(g, -70, 0, { ms: 2600, d: 1000 })
        ink(sp, E(270, 470, 12, 8), { w: 2, d: 800, t: 300 })
        ink(sp, waveP(282, 340, 470, 4, 16), { w: 1.6, d: 900, t: 300 })
        cross(g, 300, 430, 0.5, 1800)
        fig(g, 110, 650, 1.6, { d: 1200 })
      },
      eva(g) {
        timeline(g, 30, 330, 420, [
          { at: 0.2, label: 'vor ≈ 150.000 J.', up: true },
          { at: 0.92, label: 'heute', up: true },
        ])
        const pr = mapRegion(g, 40, 470, 140, 170, -20, 55, -36, 38, 600)
        const c = pr(36, 5)
        dot(g, c[0], c[1], 4, 1400)
        ripple(g, c[0], c[1], 6, 30, { n: 2, ms: 2000, d: 1600, w: 1.2 })
        crowd(g, 220, 600, 6, 20, 1.2, 800, 80)
      },
      linie(g) {
        ball(g, 180, 330, 10, { fill: 'dicht', t: 200 })
        const rows: P[][] = [[[100, 420], [260, 420]], [[60, 520], [140, 520], [220, 520], [300, 520]]]
        rows.forEach((row, i) => row.forEach(([x, y], j) => {
          const keep = i === 0 ? j === 0 : j === 1
          ball(g, x, y, 10, { d: 400 + i * 400 + j * 80, fill: keep ? 'dicht' : 'leer', t: 200 })
          const [px, py] = i === 0 ? [180, 330] : rows[0][Math.floor(j / 2)]
          ink(g, L([px, py + 12], [x, y - 12]), { w: keep ? 3 : 1.4, d: 200 + i * 400, t: 300 })
        }))
        ball(g, 140, 620, 10, { d: 1300, fill: 'dicht', t: 200 })
        ink(g, L([140, 532], [140, 608]), { w: 3, d: 1100, t: 300 })
        flow(g, [[180, 340], [100, 410], [140, 510], [140, 610]], { n: 2, ms: 2000, d: 1600, r: 2.4 })
      },
      ende(g) {
        mito(g, 180, 480, 2.2)
        flow(g, L([250, 480], [330, 480]), { n: 3, ms: 900, d: 900, r: 2.2 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { zelle: {} } },
      { t: T('In fast jeder Zelle stecken Hunderte **Mitochondrien**: winzige Kraftwerke, die aus Zucker und Sauerstoff Energie gewinnen.', 64), gfx: { kraftwerk: {} } },
      { t: T('Sie liefern den Energieträger ATP. Pro Tag setzt du davon ungefähr dein **eigenes Körpergewicht** um – immer wieder recycelt.', 64), gfx: { atp: {} } },
      { t: T('Besonders viele hat dein Herz: In einer Herzmuskelzelle machen sie rund **ein Drittel** des Volumens aus.', 64), gfx: { herz: {} } },
      { t: T('Dein Gehirn verbraucht in Ruhe rund **20 Prozent** deiner Energie – fast alles aus Mitochondrien.', 64), gfx: { gehirn: {} } },
      { t: T('Darum ist **Blausäure** so gefährlich: Sie blockiert ein Enzym in den Mitochondrien – die Zellen können keinen Sauerstoff mehr nutzen.', 64), gfx: { gift: {} } },
      { t: T('Seltsam an ihnen: Mitochondrien haben **eigene DNA** – einen kleinen Ring, ganz anders als die Chromosomen im Zellkern.', 64), gfx: { ring: {} } },
      { t: T('Ringförmige DNA ist typisch für **Bakterien**.', 64), gfx: { bakterium: {} } },
      { t: T('Mitochondrien haben außerdem zwei Hüllen und vermehren sich durch **Teilung**, ganz wie Bakterien.', 64), gfx: { merkmale: {} } },
      { t: T('Die Erklärung: Vor rund zwei Milliarden Jahren **schluckte** eine Zelle ein Bakterium – und verdaute es nicht.', 64), gfx: { schlucken: { cls: 'a1' } } },
      { t: T('Das Bakterium lebte weiter und lieferte **Energie**. Die Zelle bot Schutz und Nahrung. Eine Partnerschaft für immer.', 64), gfx: { partner: {} } },
      { t: T('Mit der zusätzlichen Energie konnten Zellen **größer und komplexer** werden – der Weg zu Pflanzen, Pilzen und Tieren.', 64), gfx: { komplex: {} } },
      { t: T('Diese **Endosymbiontentheorie** vertrat Lynn Margulis 1967. Ihr Artikel wurde vorher rund fünfzehnmal abgelehnt.', 64), gfx: { margulis: {} } },
      { t: T('Heute gilt sie als gut belegt: Das Erbgut der Mitochondrien ähnelt dem bestimmter **Bakterien**.', 64), gfx: { verwandt: {} } },
      { t: T('Pflanzen haben es sogar zweimal getan: Ihre **Chloroplasten**, die Fotosynthese betreiben, waren einst Cyanobakterien.', 64), gfx: { chloro: {} } },
      { t: T('Deine Mitochondrien erbst du fast nur von deiner **Mutter**. Die des Spermiums werden nach der Befruchtung abgebaut.', 64), gfx: { mutter: {} } },
      { t: T('So lässt sich die mütterliche Linie zurückverfolgen – bis zur „**mitochondrialen Eva**“, die vor rund 150.000 Jahren in Afrika lebte.', 64), gfx: { eva: {} } },
      { t: T('Sie war nicht die einzige Frau ihrer Zeit – nur die, deren Mutterlinie **ununterbrochen** bis heute reicht.', 64), gfx: { linie: {} } },
      { t: T('Du bist eine **Wohngemeinschaft** – seit zwei Milliarden Jahren.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Mitochondrien haben eigene ringförmige DNA und teilen sich wie Bakterien.', 'Sie stammen von Bakterien ab, die vor ~2 Mrd. Jahren in einer Zelle überlebten (Endosymbiose).', 'Man erbt sie fast nur von der Mutter – Grundlage der „mitochondrialen Eva“.'],
    sources: ['Sagan (Margulis) 1967, Journal of Theoretical Biology 14', 'Gray 2012, Cold Spring Harbor Perspectives in Biology', 'Cann, Stoneking & Wilson 1987, Nature 325'],
  },
  {
    id: 'resistenz',
    area: 'BIO',
    day: 10,
    hook: 'Wie Bakterien in elf Tagen gegen Antibiotika gewinnen',
    mood: 'dunkel',
    ambience: 'blasen',
    images: [],
    draw: {
      schale(g) {
        ink(g, E(180, 250, 150, 120), { w: 3.2, t: 800 })
        ink(g, E(180, 250, 140, 110), { w: 1.6, d: 300, t: 800 })
        let seed = 4
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 30; i++) {
          const a = rnd() * Math.PI * 2
          const r = Math.sqrt(rnd()) * 0.85
          dot(g, 180 + Math.cos(a) * 130 * r, 250 + Math.sin(a) * 100 * r, 3 + rnd() * 4, 700 + i * 40)
        }
      },
      fleming(g) {
        ink(g, E(180, 470, 130, 100), { w: 3, t: 800 })
        const mold: P[] = [...B([80, 440], [90, 400], [140, 400], [150, 440]), ...B([150, 440], [160, 480], [100, 500], [80, 440]).slice(1)]
        hatch(g, mold, 700, true)
        ink(g, mold, { w: 2.2, d: 500, t: 400 })
        dashes(g, E(115, 445, 64, 58), { w: 1.4, d: 900 })
        for (const [x, y] of [[220, 420], [250, 470], [210, 510], [270, 520], [240, 400]] as const) dot(g, x, y, 5, 1100)
        text(g, 180, 620, 'Schimmelpilz: 1928', { anchor: 'middle', d: 1300 })
      },
      platte(g) {
        const conc = ['0', '1', '10', '100', '1000', '100', '10', '1', '0']
        ink(g, RR(30, 360, 300, 230, 12), { w: 3, t: 800 })
        for (let b = 1; b < 9; b++) ink(g, L([30 + b * 33.3, 362], [30 + b * 33.3, 588]), { w: 1.4, d: 300 + b * 60, t: 300 })
        conc.forEach((c, b) => text(g, 30 + (b + 0.5) * 33.3, 346, c, { anchor: 'middle', cls: 's', d: 600 + b * 60 }))
        text(g, 180, 620, 'Antibiotikum: × 10 je Streifen', { anchor: 'middle', cls: 's', d: 1100 })
        let seed = 8
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        const cls = ['x1', 'x3', 'x4', 'x4', 'x5']
        for (let b = 0; b < 9; b++) {
          const e = Math.min(b, 8 - b)
          const grp = st(g, cls[e], `--o: ${30 + (b + 0.5) * 33.3}px 475px; --dl: ${e * 250}ms`)
          for (let i = 0; i < 9; i++) dot(grp, 36 + b * 33.3 + rnd() * 21 + 3, 372 + rnd() * 206, 2.6, 0)
        }
        const mut = st(g, 'x2', '--o: 62px 470px')
        ball(mut, 60, 470, 7, { fill: 'dicht', t: 0 })
        ink(mut, E(60, 470, 14), { w: 2, t: 0 })
      },
      zufall(g) {
        box(g, 30, 360, 140, 70, ['Mutation', '(Zufall)'], { size: 16 })
        box(g, 190, 360, 140, 70, ['Auslese', '(Antibiotikum)'], { size: 16, d: 400 })
        carrow(g, [170, 380], [190, 380], -30, { d: 800 })
        carrow(g, [190, 420], [170, 420], -30, { d: 1000 })
        text(g, 180, 520, 'Evolution im Zeitraffer', { anchor: 'middle', size: 20, d: 1300 })
      },
      sieb(g) {
        const top: P[] = [[60, 420], [300, 420]]
        dashes(g, L(top[0], top[1]), { w: 3, dash: 20, gap: 14 })
        let seed = 2
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 18; i++) ball(g, 70 + rnd() * 220, 330 + rnd() * 70, 6, { d: 300 + i * 30, fill: i === 7 ? 'dicht' : 'leer', w: 1.6, t: 0 })
        ball(g, 180, 520, 8, { d: 1200, fill: 'dicht', t: 0 })
        arrow(g, L([180, 450], [180, 500]), { w: 2.2, d: 1100, t: 300, head: 8 })
        text(g, 180, 600, 'nur wer zufällig widersteht', { anchor: 'middle', cls: 's', d: 1400 })
      },
      plasmid(g) {
        bact(g, 100, 470, 3)
        bact(g, 260, 470, 3, 300)
        ink(g, E(86, 470, 12), { w: 2, d: 700, t: 300 })
        arrow(g, B([150, 420], [170, 390], [200, 390], [220, 420]), { w: 2.4, d: 1000, t: 400, head: 9 })
        ink(g, E(246, 470, 12), { w: 2, d: 1400, t: 300 })
        text(g, 180, 380, 'Plasmid', { anchor: 'middle', cls: 's', d: 1200 })
      },
      tierhaltung(g) {
        pie(g, 180, 460, 110, 0.7)
        text(g, 180, 620, 'weltweit der größere Teil: Tierhaltung', { anchor: 'middle', cls: 's', d: 1100 })
      },
      klinik(g) {
        ink(g, RR(80, 380, 200, 220, 6), { w: 3, t: 800 })
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) ink(g, RR(98 + c * 46, 400 + r * 56, 26, 30, 3), { w: 1.8, d: 400 + (r * 4 + c) * 50, t: 200 })
        hatch(g, RR(166, 300, 28, 72, 3), 900, true)
        hatch(g, RR(144, 322, 72, 28, 3), 900, true)
        bact(g, 300, 640, 1, 1100, true)
        bact(g, 50, 640, 1, 1200, true)
      },
      tote(g) {
        text(g, 180, 470, '1,27 Mio.', { anchor: 'middle', size: 52, d: 200 })
        text(g, 180, 520, 'Todesfälle 2019, direkt durch resistente Keime', { anchor: 'middle', cls: 's', d: 700 })
      },
      viren(g) {
        virus(g, 110, 470, 40)
        cross(g, 110, 470, 3.6, 900)
        const pill = RR(210, 450, 100, 40, 20)
        hatch(g, RR(260, 450, 50, 40, 20), 700, true)
        ink(g, pill, { w: 2.6, d: 500, t: 500 })
        ink(g, L([260, 452], [260, 488]), { w: 2, d: 700, t: 200 })
        text(g, 180, 600, 'gegen Viren wirkungslos', { anchor: 'middle', d: 1200 })
      },
      packung(g) {
        ink(g, RR(70, 380, 220, 160, 10), { w: 3, t: 600 })
        for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
          const x = 110 + c * 46
          const y = 430 + r * 60
          ink(g, E(x, y, 16), { w: 2, d: 400 + (r * 4 + c) * 80, t: 200 })
          if (r * 4 + c < 5) hatch(g, E(x, y, 12), 700 + (r * 4 + c) * 80, true)
        }
        text(g, 180, 600, 'wie verordnet', { anchor: 'middle', d: 1300 })
      },
      neu(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: '1928', sub: 'Penicillin', up: true },
          { at: 0.4, label: '1940–1960', sub: 'Goldenes Zeitalter' },
          { at: 0.8, label: 'seit 1987', sub: 'kaum neue Klassen', up: true },
        ])
      },
      ende(g) {
        ink(g, E(180, 480, 120, 90), { w: 3, t: 800 })
        bact(g, 160, 470, 1.6, 500, true)
        bact(g, 220, 500, 1.2, 700, true)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { schale: {} } },
      { t: T('Das erste Antibiotikum fand Alexander Fleming 1928 durch Zufall: Ein **Schimmelpilz** auf seiner Bakterienschale hielt die Bakterien fern.', 64), gfx: { fleming: {} } },
      { t: T('Schon 1945 warnte er in seiner Nobelpreisrede: Wer zu wenig nimmt, **züchtet** widerstandsfähige Keime. Wie das abläuft, zeigt ein Experiment.', 64), gfx: { fleming: {} } },
      { t: T('Forscher der Harvard Medical School bauten 2016 eine riesige Schale: 60 mal 120 Zentimeter Nährboden.', 64), gfx: { platte: {} } },
      { t: T('Außen kein Antibiotikum, nach innen immer mehr – jeder Streifen **zehnmal stärker** als der vorige. In der Mitte tausendmal mehr, als die Bakterien vertragen.', 64), gfx: { platte: {} } },
      { t: T('An die Ränder setzten sie **E.-coli-Bakterien**. Die breiteten sich aus – bis zur ersten Antibiotika-Grenze.', 64), gfx: { platte: { cls: 'a1' } } },
      { t: T('Dort stoppten sie. Doch unter Milliarden Bakterien trug eines zufällig eine **Mutation**, die es etwas unempfindlicher machte.', 64), gfx: { platte: { cls: 'a1 a2' } } },
      { t: T('Dieses eine wuchs über die Grenze. Seine Nachkommen eroberten den **nächsten Streifen**.', 64), gfx: { platte: { cls: 'a1 a2 a3' } } },
      { t: T('Dort wiederholte sich das Spiel: neue Mutation, neue Grenze überwunden. **Schritt für Schritt**.', 64), gfx: { platte: { cls: 'a1 a2 a3 a4' } } },
      { t: T('Nach rund **elf Tagen** hatten Bakterien die Mitte erreicht – und überlebten die tausendfache Dosis.', 64), gfx: { platte: { cls: 'a1 a2 a3 a4 a5' } } },
      { t: T('Das ist **Evolution** zum Zuschauen: Variation durch Mutation, Auslese durch das Antibiotikum.', 64), gfx: { zufall: {} } },
      { t: T('Wichtig: Das Antibiotikum erzeugt die Mutation nicht. Es **siebt nur aus** – wer zufällig widersteht, bleibt übrig.', 64), gfx: { sieb: {} } },
      { t: T('Bakterien können Resistenzen sogar **weitergeben** – auch an andere Arten. Sie tauschen kleine DNA-Ringe aus, die Plasmide.', 64), gfx: { plasmid: {} } },
      { t: T('Genau so entstehen resistente Keime in Kliniken und Ställen. Je mehr Antibiotika im Einsatz, desto stärker die **Auslese**.', 64), gfx: { klinik: {} } },
      { t: T('Weltweit landet ein großer Teil aller Antibiotika nicht beim Menschen, sondern in der **Tierhaltung**.', 64), gfx: { tierhaltung: {} } },
      { t: T('Weltweit starben 2019 schätzungsweise **1,27 Millionen** Menschen direkt an Infektionen mit resistenten Bakterien.', 64), gfx: { tote: {} } },
      { t: T('Darum: Antibiotika nur, wenn sie nötig sind. Gegen **Viren** – etwa bei Erkältung oder Grippe – helfen sie ohnehin nicht.', 64), gfx: { viren: {} } },
      { t: T('Und die Tabletten **wie verordnet** nehmen. Wie lange eine Therapie dauern muss, entscheidet der Arzt je nach Infektion.', 64), gfx: { packung: {} } },
      { t: T('Neue Antibiotika sind selten: Seit Ende der 1980er wurde kaum eine **neue Wirkstoffklasse** für die Praxis entdeckt.', 64), gfx: { neu: {} } },
      { t: T('Resistenz ist **Evolution**, die wir jeden Tag beschleunigen.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Auf einer 60 × 120 cm großen Schale überwanden E.-coli-Bakterien in ~11 Tagen die tausendfache Antibiotika-Dosis.', 'Mutationen entstehen zufällig; das Antibiotikum siebt die Widerstandsfähigen aus.', 'Antibiotika nur bei Bedarf und wie verordnet – gegen Viren helfen sie nicht.'],
    sources: ['Baym et al. 2016, Science 353 (MEGA-Plate)', 'Antimicrobial Resistance Collaborators 2022, The Lancet 399', 'WHO 2023: Antibacterial agents in development'],
  },
  {
    id: 'impfung',
    area: 'BIO',
    day: 53,
    hook: 'Wie trainiert eine Impfung dein Immunsystem?',
    mood: 'hell',
    ambience: 'herz',
    images: [],
    draw: {
      spritze(g) {
        ink(g, RR(60, 220, 200, 50, 8), { w: 3.2, t: 700 })
        hatch(g, RR(64, 224, 120, 42, 6), 600)
        ink(g, L([260, 245], [330, 245]), { w: 2.4, d: 500, t: 300 })
        ink(g, L([20, 245], [60, 245]), { w: 4, d: 400, t: 300 })
        ink(g, L([20, 220], [20, 270]), { w: 4, d: 500, t: 200 })
        for (let k = 1; k < 5; k++) ink(g, L([60 + k * 40, 220], [60 + k * 40, 234]), { w: 1.6, d: 600 + k * 60, t: 100 })
      },
      erstkontakt(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Tage', yl: 'Erreger' })
        plot(g, 50, 596, 270, 240, (t) => Math.sin(Math.min(1, t * 1.1) * Math.PI) * (t < 0.55 ? 1 : 1), { d: 400 })
        dashes(g, L([210, 600], [210, 340]), { w: 1.4, d: 1300 })
        text(g, 216, 330, 'Abwehr bereit', { cls: 's', d: 1500 })
        const k = st(g, 'f1')
        text(k, 300, 400, 'krank', { anchor: 'middle', fade: false })
      },
      antigen(g) {
        virus(g, 180, 470, 70)
        text(g, 290, 360, 'Antigene', { anchor: 'middle', cls: 's', d: 900 })
        arrow(g, L([270, 372], [240, 404]), { w: 2, d: 1000, t: 300, head: 8 })
      },
      schloss(g) {
        const shapes = ['dreieck', 'eckig', 'rund']
        shapes.forEach((s, i) => {
          const x = 70 + i * 110
          ball(g, x, 520, 34, { d: i * 200, fill: 'hell' })
          const top = 520 - 34
          if (s === 'dreieck') ink(g, [[x - 10, top - 2], [x, top - 16], [x + 10, top - 2]], { w: 2.4, d: 400 + i * 200, t: 200 })
          if (s === 'eckig') ink(g, [[x - 10, top - 2], [x - 10, top - 16], [x + 10, top - 16], [x + 10, top - 2]], { w: 2.4, d: 400 + i * 200, t: 200 })
          if (s === 'rund') ink(g, E(x, top - 2, 10, 12, 180, 360), { w: 2.4, d: 400 + i * 200, t: 200 })
        })
        const key: P[] = [[170, 440], [190, 440], [190, 460], [170, 460], [170, 440]]
        hatch(g, RR(166, 380, 28, 40, 4), 1000, true)
        ink(g, RR(166, 380, 28, 40, 4), { w: 2, d: 900, t: 300 })
        ink(g, L([180, 420], [180, 440]), { w: 2, d: 1000, t: 200 })
        void key
        check(g, 180, 610, 1, 1400)
        text(g, 180, 350, 'Antigen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ypsilon(g) {
        antibody(g, 180, 600, 6)
        virus(g, 108, 360, 16, 900)
        virus(g, 252, 360, 16, 1000)
        text(g, 180, 646, 'Antikörper', { anchor: 'middle', d: 1200 })
      },
      vermehrung(g) {
        ball(g, 60, 470, 24, { fill: 'dicht' })
        arrow(g, L([92, 470], [130, 470]), { w: 2.4, d: 300, t: 300, head: 9 })
        for (let i = 0; i < 6; i++) ball(g, 160 + (i % 3) * 40, 440 + Math.floor(i / 3) * 60, 16, { d: 500 + i * 100, fill: 'dicht', t: 200 })
        for (let i = 0; i < 5; i++) antibody(g, 300 + (i % 2) * 24, 380 + i * 46, 0.9, 20 * (i % 2 ? 1 : -1), 1200 + i * 100)
        text(g, 180, 600, 'Antikörper', { anchor: 'middle', d: 1600 })
      },
      gedaechtnis(g) {
        for (let i = 0; i < 4; i++) {
          const x = 70 + i * 74
          ball(g, x, 470, 26, { d: i * 200, fill: 'hell' })
          text(g, x, 476, 'G', { anchor: 'middle', cls: 'halo', d: i * 200 + 200 })
        }
        text(g, 180, 560, 'Gedächtniszellen bleiben', { anchor: 'middle', d: 1100 })
      },
      zweimal(g) {
        for (const [x0, k, n, d] of [[30, 0.45, 'erstes Mal', 0], [195, 1, 'zweites Mal', 600]] as const) {
          axes(g, x0, 600, x0 + 140, 360, { d })
          plot(g, x0 + 4, 596, 126, 220, (t) => (t < 0.5 * (1 - k + 0.4) ? 0 : Math.min(1, ((t - 0.5 * (1 - k + 0.4)) / 0.3) * k)), { d: d + 300 })
          text(g, x0 + 70, 630, n, { anchor: 'middle', cls: 's', d: d + 400 })
        }
        text(g, 30, 344, 'Abwehr', { cls: 's', d: 900 })
      },
      impf(g) {
        ink(g, RR(60, 440, 160, 40, 8), { w: 3, t: 600 })
        ink(g, L([220, 460], [280, 460]), { w: 2.4, d: 400, t: 300 })
        ink(g, L([30, 460], [60, 460]), { w: 4, d: 300, t: 300 })
        for (const [x, y] of [[100, 390], [160, 380], [300, 400]] as const) {
          ink(g, E(x, y, 10), { w: 2, d: 800, t: 200 })
          ink(g, [[x - 6, y - 10], [x, y - 20], [x + 6, y - 10]], { w: 2, d: 900, t: 150 })
        }
        text(g, 180, 560, 'nur die Merkmale, ohne Krankheit', { anchor: 'middle', cls: 's', d: 1100 })
      },
      arten(g) {
        box(g, 40, 330, 280, 60, ['abgetöteter oder', 'abgeschwächter Erreger'], { size: 15 })
        box(g, 40, 420, 280, 60, 'nur ein Eiweiß-Teilstück', { size: 15, d: 400 })
        box(g, 40, 510, 280, 60, 'Bauplan dafür (mRNA)', { size: 15, d: 800, fill: true })
      },
      kuh(g) {
        const body = RR(70, 420, 180, 100, 30)
        blank(g, body)
        ink(g, body, { w: 3, t: 700 })
        for (const x of [90, 130, 200, 230]) ink(g, L([x, 518], [x, 590]), { w: 3, d: 400, t: 200 })
        ink(g, RR(240, 380, 70, 60, 20), { w: 3, d: 500, t: 500 })
        ink(g, L([250, 384], [240, 360]), { w: 2.4, d: 800, t: 150 })
        ink(g, L([300, 384], [310, 360]), { w: 2.4, d: 800, t: 150 })
        for (const [x, y, r] of [[120, 450, 14], [180, 480, 18], [220, 446, 10]] as const) hatch(g, E(x, y, r), 900, true)
        text(g, 180, 640, 'lateinisch vacca: Kuh', { anchor: 'middle', d: 1100 })
      },
      variolation(g) {
        ink(g, B([30, 520], [120, 480], [240, 480], [330, 500]), { w: 3, t: 700 })
        ink(g, B([30, 600], [120, 580], [240, 580], [330, 590]), { w: 3, t: 700 })
        for (let k = 0; k < 3; k++) ink(g, L([150 + k * 16, 504], [160 + k * 16, 524]), { w: 2, d: 800 + k * 100, t: 150 })
        ink(g, L([210, 380], [180, 476]), { w: 2.6, d: 1000, t: 300 })
        text(g, 180, 360, 'Variolation: riskant', { anchor: 'middle', cls: 's', d: 1300 })
      },
      pocken(g) {
        text(g, 180, 460, '300 Mio.', { anchor: 'middle', size: 54, d: 200 })
        text(g, 180, 504, 'Pocken-Tote im 20. Jahrhundert', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 180, 580, '1980: ausgerottet', { anchor: 'middle', size: 22, d: 1100 })
      },
      herde(g) {
        for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
          const x = 50 + c * 44
          const y = 350 + r * 50
          const open = (r === 2 && c === 3) || (r === 4 && c === 1) || (r === 1 && c === 5)
          ball(g, x, y, 12, { d: (r * 7 + c) * 20, fill: open ? 'leer' : 'hell', w: 1.8, t: 0 })
        }
        virus(g, 182, 450, 8, 1200)
        text(g, 180, 660, 'Herdenschutz', { anchor: 'middle', d: 1400 })
      },
      masern(g) {
        pie(g, 180, 460, 110, 0.95)
        text(g, 180, 620, 'Masern: rund 95 % Geimpfte nötig', { anchor: 'middle', cls: 's', d: 1100 })
      },
      auffrischen(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: 'Impfung', up: true },
          { at: 0.5, label: '+ 10 Jahre', sub: 'Auffrischung', up: true, big: true },
          { at: 0.95, label: '+ 20', up: true },
        ])
        text(g, 180, 580, 'Tetanus: alle zehn Jahre', { anchor: 'middle', d: 1400 })
      },
      armreaktion(g) {
        fig(g, 140, 620, 6)
        ink(g, E(222, 494, 14), { w: 2, d: 800, t: 300 })
        text(g, 270, 470, 'Training läuft', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        const sh: P[] = [[180, 370], [270, 400], [260, 520], [180, 590], [100, 520], [90, 400], [180, 370]]
        hatch(g, sh, 600)
        ink(g, sh, { w: 3.2, t: 900 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { spritze: {} } },
      { t: T('Dringt ein neuer Erreger ein, braucht dein Immunsystem beim ersten Mal **mehrere Tage**, um die passende Abwehr aufzubauen.', 64), gfx: { erstkontakt: {} } },
      { t: T('In dieser Zeit vermehrt sich der Erreger ungestört – und du wirst **krank**.', 64), gfx: { erstkontakt: { cls: 'a1' } } },
      { t: T('Erkannt wird er an seinen Oberflächen-Merkmalen, den **Antigenen** – fast wie an einem Gesicht.', 64), gfx: { antigen: {} } },
      { t: T('Unter Milliarden B-Zellen gibt es zufällig einige, deren Rezeptor genau **passt** – wie ein Schlüssel ins Schloss.', 64), gfx: { schloss: {} } },
      { t: T('Antikörper sind Y-förmige Eiweiße. Ihre beiden Arme packen **genau das Antigen**, zu dem sie passen.', 64), gfx: { ypsilon: {} } },
      { t: T('Diese Zellen vermehren sich stark und bilden **Antikörper**, die den Erreger markieren und blockieren.', 64), gfx: { vermehrung: {} } },
      { t: T('Nach der Infektion bleiben **Gedächtniszellen** zurück – oft jahrelang.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Beim nächsten Kontakt starten sie die Abwehr **viel schneller** und stärker. Oft merkst du gar nichts.', 64), gfx: { zweimal: {} } },
      { t: T('Eine Impfung macht den ersten Durchgang **ohne die Krankheit**: Sie zeigt dem Körper nur die Merkmale des Erregers.', 64), gfx: { impf: {} } },
      { t: T('Mal mit abgetöteten oder abgeschwächten Erregern, mal nur mit einem Teilstück – oder mit dem **Bauplan** dafür, wie bei mRNA-Impfstoffen.', 64), gfx: { arten: {} } },
      { t: T('Das Wort kommt von der **Kuh**: Edward Jenner schützte 1796 einen Jungen mit harmlosen Kuhpocken vor den echten Pocken.', 64), gfx: { kuh: {} } },
      { t: T('Schon vorher gab es die **Variolation**: Man ritzte Material aus Pockenbläschen in die Haut – riskant, aber oft schützend.', 64), gfx: { variolation: {} } },
      { t: T('Die Pocken töteten allein im 20. Jahrhundert rund **300 Millionen** Menschen. 1980 erklärte die WHO sie für ausgerottet – durch Impfung.', 64), gfx: { pocken: {} } },
      { t: T('Impfungen schützen auch andere: Sind genug Menschen immun, findet ein Erreger **kaum noch Wirte**. Das heißt Herdenschutz.', 64), gfx: { herde: {} } },
      { t: T('Bei Masern braucht es dafür rund **95 Prozent** Geimpfte, weil das Virus extrem ansteckend ist.', 64), gfx: { masern: {} } },
      { t: T('Manches Immungedächtnis lässt mit den Jahren nach. Dann hilft eine **Auffrischung** – bei Tetanus etwa alle zehn Jahre.', 64), gfx: { auffrischen: {} } },
      { t: T('Leichte Reaktionen wie ein schwerer Arm oder etwas Fieber zeigen meist nur: Das **Training läuft**.', 64), gfx: { armreaktion: {} } },
      { t: T('Eine Impfung ist eine **Generalprobe** für dein Immunsystem.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Beim ersten Kontakt braucht das Immunsystem Tage; Gedächtniszellen machen den zweiten schnell.', 'Eine Impfung zeigt nur die Merkmale (Antigene) – ohne die Krankheit.', 'Genug Geimpfte schützen auch andere (Herdenschutz, bei Masern ~95 %).'],
    sources: ['Murphy & Weaver: Janeway’s Immunobiology, 9. Aufl.', 'WHO 1980: Erklärung zur Ausrottung der Pocken', 'Robert Koch-Institut: Masern – RKI-Ratgeber'],
  },
]
