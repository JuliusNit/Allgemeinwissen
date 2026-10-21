import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, brain, bubble, car, check, clock, cross, crowd, dashes, eye, fig, hatch, ink, lie, mk, pop, question, rays, st, star, strike, text, timeline, vbars, type P } from './draw'
import { LAND, axes, ball, box, bullets, coastPts, dot, flow, glide, heart, house, pie, plot, rad, ripple, smooth, spin, sun, waveP, wobble } from './kit'

// Psychologie: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Linie mit Länge für den Asch-Versuch, senkrecht bei x, unten bei y */
function stroke(g: Element, x: number, y: number, h: number, label: string, d = 0): void {
  ink(g, L([x, y], [x, y - h]), { w: 4, d, t: 300 })
  text(g, x, y + 24, label, { anchor: 'middle', d: d + 200 })
}

/** Gorilla von vorn (Mensch im Kostüm), Füße auf y: Scheitelkamm, Brauenwulst, breite Schultern, lange Arme;
 *  beat = Fäuste trommeln auf die Brust */
function gorilla(g: Element, x: number, y: number, s = 1, d = 0, beat = false): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  for (const k of [-1, 1]) {
    const leg: P[] = [P(k * 8, -46), P(k * 30, -44), P(k * 34, -10), P(k * 40, 0), P(k * 12, 0), P(k * 10, -20)]
    blank(g, leg)
    hatch(g, leg, d + 600, true)
    ink(g, leg, { w: 2.4 * Math.min(1.2, s), d: d + 200, t: 400 })
  }
  const body: P[] = smooth([P(-30, -40), P(-50, -90), P(-48, -116), P(-20, -128), P(20, -128), P(48, -116), P(50, -90), P(30, -40), P(-30, -40)], 3)
  blank(g, body)
  hatch(g, body, d + 700, true)
  ink(g, body, { w: 2.8 * Math.min(1.2, s), d, t: 700 })
  const chest: P[] = smooth([P(-24, -110), P(0, -114), P(24, -110), P(20, -80), P(0, -74), P(-20, -80), P(-24, -110)], 3)
  blank(g, chest)
  ink(g, chest, { w: 1.4, d: d + 400, t: 300 })
  for (const k of [-1, 1]) {
    const arm: P[] = beat
      ? [P(k * 46, -118), P(k * 62, -96), P(k * 30, -86), P(k * 14, -96)]
      : [P(k * 46, -118), P(k * 70, -80), P(k * 72, -40), P(k * 64, -8)]
    ink(g, arm, { w: 9 * Math.min(1.2, s), d: d + 500, t: 300 })
    ball(g, arm[3][0], arm[3][1], 8 * s, { d: d + 600, fill: 'dicht', w: 1.6, t: 100 })
  }
  const head: P[] = smooth([P(-20, -130), P(-22, -150), P(-10, -168), P(0, -172), P(10, -168), P(22, -150), P(20, -130), P(-20, -130)], 3)
  blank(g, head)
  hatch(g, head, d + 800, true)
  ink(g, head, { w: 2.6, d: d + 300, t: 400 })
  const face: P[] = smooth([P(-14, -150), P(14, -150), P(14, -136), P(0, -130), P(-14, -136), P(-14, -150)], 3)
  blank(g, face)
  ink(g, face, { w: 1.6, d: d + 600, t: 200 })
  ink(g, B(P(-16, -152), P(-6, -158), P(6, -158), P(16, -152)), { w: 2.6, d: d + 650, t: 150 })
  for (const k of [-1, 1]) {
    dot(g, x + k * 6 * s, y - 148 * s, 1.8 * s, d + 800)
    dot(g, x + k * 3 * s, y - 140 * s, 1.2 * s, d + 850)
  }
}

/** Admiralitätsanker: Ring, Stock (Querbalken), Schaft, Arme mit Flunken; Kreuz unten bei (x, y) */
function anchor(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const w = Math.max(1.2, 4 * s)
  ink(g, E(x, y - 230 * s, 16 * s), { w, d, t: 300 })
  ink(g, L(P(0, -214), P(0, 0)), { w: w * 1.5, d: d + 200, t: 500 })
  ink(g, L(P(-50, -190), P(50, -190)), { w, d: d + 300, t: 200 })
  for (const k of [-1, 1]) ball(g, x + k * 52 * s, y - 190 * s, 5 * s, { d: d + 400, fill: 'dicht', w: 1.2, t: 60 })
  ink(g, B(P(-90, -60), P(-80, 0), P(80, 0), P(90, -60)), { w: w * 1.3, d: d + 500, t: 500 })
  for (const k of [-1, 1]) {
    const fl: P[] = [P(k * 90, -60), P(k * 110, -50), P(k * 96, -84), P(k * 90, -60)]
    blank(g, fl)
    hatch(g, fl, d + 800, true)
    ink(g, fl, { w: w * 0.7, d: d + 700, t: 150 })
  }
  ball(g, x, y, 8 * s, { d: d + 600, fill: 'dicht', w: 1.4, t: 60 })
}

/** Geldbündel: n Scheine leicht versetzt gestapelt, oben links (x, y) */
function bills(g: Element, x: number, y: number, n: number, s = 1, d = 0, dense = false): void {
  for (let k = 0; k < n; k++) {
    const r = RR(x + k * 1.5 * s, y - k * 3 * s, 60 * s, 28 * s, 3)
    blank(g, r)
    if (dense && k === n - 1) hatch(g, r, d + k * 40 + 100)
    ink(g, r, { w: 1.4, d: d + k * 40, t: 80 })
  }
  const top = y - (n - 1) * 3 * s
  ink(g, E(x + (n - 1) * 1.5 * s + 30 * s, top + 14 * s, 8 * s), { w: 1, d: d + n * 40, t: 80 })
}

/** Wertfunktion nach Kahneman & Tversky: flach für Gewinne, steil für Verluste; Ursprung (cx, cy) */
function valueCurve(g: Element, cx: number, cy: number, w: number, h: number, d = 0): void {
  arrow(g, L([cx - w, cy], [cx + w, cy]), { w: 2, d, t: 400, head: 8 })
  arrow(g, L([cx, cy + h], [cx, cy - h]), { w: 2, d, t: 400, head: 8 })
  text(g, cx + w - 4, cy + 24, '+', { anchor: 'middle', size: 20, d: d + 200 })
  text(g, cx - w + 4, cy + 24, '−', { anchor: 'middle', size: 20, d: d + 200 })
  ink(g, Array.from({ length: 41 }, (_, i) => [cx + (i / 40) * w * 0.9, cy - Math.pow(i / 40, 0.6) * h * 0.45] as P), { w: 3, d: d + 400, t: 700 })
  ink(g, Array.from({ length: 41 }, (_, i) => [cx - (i / 40) * w * 0.9, cy + Math.pow(i / 40, 0.6) * h * 0.9] as P), { w: 3, d: d + 900, t: 700 })
}

/** Münzseite: Kopf (Profil) oder Zahl (Ziffer und Eichenzweig) */
function coinSide(g: Element, x: number, y: number, head: boolean, d = 0): void {
  ball(g, x, y, 34, { d, fill: head ? 'hell' : 'leer', w: 2.6, t: 300 })
  ink(g, E(x, y, 27), { w: 1, d: d + 200, t: 300 })
  if (head) ink(g, smooth([[x + 6, y - 20], [x - 8, y - 18], [x - 12, y - 4], [x - 16, y + 2], [x - 10, y + 6], [x - 10, y + 16], [x + 4, y + 20]], 3), { w: 2, d: d + 400, t: 300 })
  else {
    ink(g, [[x - 8, y - 10], [x + 2, y - 18], [x + 2, y + 16]], { w: 2.6, d: d + 400, t: 200 })
    ink(g, B([x - 18, y + 14], [x - 20, y], [x - 16, y - 10], [x - 10, y - 18]), { w: 1, d: d + 500, t: 150 })
  }
}

/** Kapuzineraffe sitzend, Kopf mit Kappe und hellem Gesicht, Schwanz eingerollt; y = Boden */
function capuchin(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = smooth([P(-26, 0), P(-30, -40), P(-20, -76), P(0, -84), P(20, -76), P(30, -40), P(26, 0), P(-26, 0)], 3)
  blank(g, body)
  hatch(g, body, d + 500, true)
  ink(g, body, { w: 2.2, d, t: 500 })
  ink(g, B(P(26, -6), P(60, 0), P(64, -40), P(46, -44)), { w: 2.4, d: d + 300, t: 300 })
  ink(g, E(x + 46 * s, y - 36 * s, 6 * s), { w: 2, d: d + 400, t: 100 })
  const hd: P[] = smooth([P(-20, -96), P(-18, -116), P(0, -124), P(18, -116), P(20, -96), P(0, -82), P(-20, -96)], 3)
  blank(g, hd)
  ink(g, hd, { w: 2.2, d: d + 300, t: 300 })
  hatch(g, smooth([P(-18, -112), P(0, -124), P(18, -112), P(0, -114), P(-18, -112)], 3), d + 600, true)
  for (const k of [-1, 1]) {
    dot(g, x + k * 7 * s, y - 102 * s, 2.2 * s, d + 700)
    ink(g, E(x + k * 24 * s, y - 100 * s, 6 * s, 8 * s), { w: 1.4, d: d + 600, t: 100 })
  }
  ink(g, B(P(-6, -90), P(-2, -86), P(2, -86), P(6, -90)), { w: 1.4, d: d + 800, t: 80 })
  for (const k of [-1, 1]) ink(g, B(P(k * 20, -60), P(k * 34, -44), P(k * 30, -24), P(k * 16, -20)), { w: 2.2, d: d + 500, t: 200 })
}

export const AHA_PSYCHE: Bite[] = [
  {
    id: 'gorilla',
    area: 'PSY',
    day: 63,
    hook: 'Würdest du einen Gorilla übersehen, der direkt vor dir steht?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [],
    draw: {
      bild(g) {
        // Spieler passen sich Bälle zu, mitten zwischen ihnen trommelt der Gorilla
        crowd(g, 24, 400, 3, 32, 2.2, 0, 150)
        crowd(g, 272, 400, 3, 32, 2.2, 300, 150)
        const bt = wobble(g, { dy: -3, ms: 300, d: 1200 })
        gorilla(bt, 180, 410, 1, 900, true)
        for (const [a, b] of [[[60, 300], [290, 310]], [[300, 280], [80, 260]]] as const) {
          const p = B(a as P, [((a as P)[0] + (b as P)[0]) / 2, 200], [((a as P)[0] + (b as P)[0]) / 2, 200], b as P)
          dashes(g, p, { w: 1, d: 600, dash: 4, gap: 4 })
          flow(g, p, { n: 1, ms: 1800, d: 800, r: 5 })
        }
      },
      spiel(g) {
        // zwei Teams: helle Trikots und dunkle, die Bälle fliegen hin und her
        for (let i = 0; i < 6; i++) {
          const x = 50 + i * 52
          fig(g, x, 600, 2.4, { d: i * 120, arms: i % 2 ? 'up' : 'push' })
          const shirt = RR(x - 8, 540, 16, 26, 4)
          blank(g, shirt)
          if (i % 2) hatch(g, shirt, i * 120 + 300, true)
          ink(g, shirt, { w: 1.6, d: i * 120 + 200, t: 100 })
        }
        for (const [a, b, dd] of [[[50, 520], [154, 520], 900], [[102, 510], [258, 500], 1300]] as const) {
          const p = B(a as P, [((a as P)[0] + (b as P)[0]) / 2, 420], [((a as P)[0] + (b as P)[0]) / 2, 420], b as P)
          dashes(g, p, { w: 1, d: dd, dash: 4, gap: 4 })
          flow(g, p, { n: 1, ms: 1600, d: dd + 200, r: 6, kind: dd > 1000 ? 'dot' : 'ring' })
        }
      },
      zaehlen(g) {
        // Blick über die Schulter auf den Bildschirm, darüber eine Strichliste der Pässe
        ink(g, RR(60, 330, 240, 170, 8), { w: 2.8, t: 500 })
        for (let i = 0; i < 6; i++) {
          fig(g, 90 + i * 36, 480, 1.4, { d: 300 + i * 60 })
          if (i % 2) hatch(g, RR(84 + i * 36, 450, 12, 14, 3), 600 + i * 60, true)
        }
        const hd: P[] = smooth([[130, 640], [134, 590], [160, 560], [200, 560], [226, 590], [230, 640]], 3)
        blank(g, [...hd, [130, 640]])
        hatch(g, [...hd, [130, 640]], 900, true)
        ink(g, hd, { w: 2.6, d: 700, t: 400 })
        for (let i = 0; i < 7; i++) {
          const x = 250 + (i % 5) * 9
          if (i === 4) ink(g, L([246, 300], [292, 284]), { w: 2, d: 1200 + i * 200, t: 80 })
          else ink(g, L([x, 278], [x, 304]), { w: 2, d: 1200 + i * 200, t: 80 })
        }
      },
      gorilla(g) {
        const bt = wobble(g, { dy: -3, ms: 300, d: 1200 })
        gorilla(bt, 180, 610, 1.6, 300, true)
        ripple(g, 180, 460, 20, 70, { n: 2, ms: 600, d: 1400, w: 1 })
      },
      haelfte(g) {
        // zehn Zuschauer: fünf haben ihn gesehen, fünf nicht
        for (let i = 0; i < 10; i++) {
          const x = 36 + (i % 5) * 72
          const y = 460 + Math.floor(i / 5) * 140
          fig(g, x, y, 2.4, { d: i * 80 })
          if (i % 2 === 0) check(g, x, y - 100, 0.5, 900 + i * 60)
          else cross(g, x, y - 100, 0.5, 900 + i * 60)
        }
      },
      scheinwerfer(g) {
        // Scheinwerfer beleuchtet den Ball – der Gorilla steht im Dunkeln daneben
        ink(g, RR(30, 310, 50, 60, 10), { w: 2.8, t: 500 })
        ink(g, L([55, 370], [55, 400]), { w: 2.4, d: 200, t: 100 })
        ink(g, L([80, 334], [250, 560]), { w: 1.6, d: 300, t: 500 })
        ink(g, L([80, 350], [160, 600]), { w: 1.6, d: 300, t: 500 })
        ink(g, E(205, 580, 50, 14), { w: 1.4, d: 600, t: 300 })
        ball(g, 200, 560, 12, { d: 800, w: 2, t: 200 })
        rays(g, 200, 560, 18, 28, 8, 1000)
        hatch(g, [[230, 350], [340, 350], [340, 640], [230, 640]], 400, true)
        const gw = st(g, '', 'opacity: 0.5')
        gorilla(gw, 290, 640, 0.9, 700)
      },
      sicher(g) {
        // jemand ist ganz sicher: in der Sprechblase ein durchgestrichener Gorilla
        fig(g, 110, 620, 4.4, { d: 0, arms: 'cross' })
        bubble(g, 160, 330, 170, 130, 'l', 400)
        gorilla(g, 245, 450, 0.5, 700)
        cross(g, 245, 410, 1.1, 1300)
      },
      lunge(g) {
        // CT-Schnitt durch die Brust: Lungenflügel mit Gefäßen, Wirbel, Herz; oben rechts ein winziger Gorilla
        ink(g, E(180, 470, 150, 120), { w: 3, t: 700 })
        hatch(g, E(180, 470, 146, 116), 300, true)
        for (const k of [-1, 1]) {
          const lu: P[] = smooth([[180 + k * 14, 380], [180 + k * 90, 372], [180 + k * 130, 440], [180 + k * 120, 540], [180 + k * 60, 570], [180 + k * 20, 540], [180 + k * 14, 380]], 3)
          blank(g, lu)
          ink(g, lu, { w: 2.2, d: 400, t: 600 })
          let seed = k > 0 ? 3 : 7
          const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
          for (let i = 0; i < 14; i++) dot(g, 180 + k * (40 + rnd() * 70), 400 + rnd() * 140, 1.4 + rnd() * 2, 800 + i * 30)
        }
        ink(g, E(180, 560, 18, 16), { w: 2.4, d: 600, t: 200 })
        blank(g, E(180, 560, 10))
        ink(g, E(150, 480, 30, 40), { w: 2, d: 700, t: 300 })
        gorilla(g, 252, 438, 0.16, 1400)
        const p = pop(g, 2200, '50% 50%')
        ink(p, E(252, 424, 16), { w: 1.6, t: 0 })
      },
      motorrad(g) {
        // Auto biegt ab; der Blick des Fahrers (Kegel) geht an der Motorradfahrerin vorbei
        ink(g, L([20, 560], [340, 560]), { w: 2.6, t: 400 })
        dashes(g, L([20, 600], [340, 600]), { w: 2, d: 100, dash: 14, gap: 10 })
        car(g, 110, 556, 1.8, 200)
        const cone: P[] = [[150, 500], [340, 420], [340, 470], [150, 510]]
        hatch(g, cone, 900)
        dashes(g, L([150, 500], [340, 420]), { w: 1, d: 800, dash: 4, gap: 4 })
        dashes(g, L([150, 510], [340, 470]), { w: 1, d: 800, dash: 4, gap: 4 })
        const m = glide(g, -40, 0, { ms: 3000, d: 1000, loop: true })
        for (const x of [250, 306]) {
          ink(m, E(x, 544, 14), { w: 2.2, d: 600, t: 150 })
          ink(m, E(x, 544, 4), { w: 1, d: 650, t: 60 })
        }
        ink(m, [[250, 544], [270, 520], [296, 520], [306, 544]], { w: 2.2, d: 700, t: 200 })
        ink(m, [[270, 520], [276, 500], [290, 500]], { w: 1.8, d: 750, t: 100 })
        fig(m, 280, 520, 1.2, { d: 800, arms: 'push' })
      },
      tuer(g) {
        // zwei Arbeiter tragen eine Tür zwischen den Gesprächspartnern hindurch (a1)
        fig(g, 70, 600, 3.6)
        fig(g, 290, 600, 3.6, { d: 300 })
        ink(g, RR(250, 460, 40, 30, 2), { w: 1.6, d: 500, t: 150 })
        const door = st(g, 'x1', '--o: 180px 500px')
        ink(door, RR(140, 380, 80, 220, 4), { w: 3, t: 0 })
        hatch(door, RR(140, 380, 80, 220, 4), 0)
        ink(door, RR(150, 390, 60, 90, 2), { w: 1.4, t: 0 })
        ink(door, RR(150, 494, 60, 90, 2), { w: 1.4, t: 0 })
        dot(door, 206, 490, 3, 0)
        for (const x of [130, 230]) {
          const leg = mk('g', {}, door)
          ink(leg, L([x, 600], [x, 640]), { w: 2.4, t: 0 })
        }
      },
      vorhang(g) {
        // Bühne mit Vorhang: alle erwarten den Gorilla – derweil wechselt der Vorhang die Farbe, ein Spieler geht
        ink(g, RR(40, 360, 280, 220, 8), { w: 2.8, t: 600 })
        const back = st(g, '', '')
        hatch(back, RR(44, 364, 272, 212, 6), 1400)
        for (const x of [60, 300]) {
          const cur: P[] = [[x, 362], [x + (x < 180 ? 40 : -40), 362], [x + (x < 180 ? 14 : -14), 470], [x + (x < 180 ? 30 : -30), 578], [x, 578]]
          blank(g, cur)
          hatch(g, cur, 500, true)
          ink(g, cur, { w: 2, d: 400, t: 500 })
        }
        gorilla(g, 180, 572, 0.8, 700)
        const lv = glide(g, 60, 0, { ms: 2000, d: 1600 })
        fig(lv, 250, 576, 2, { d: 900 })
      },
      zauber(g) {
        // Zauberer: die linke Hand lenkt mit großer Geste ab, die rechte lässt die Münze verschwinden
        fig(g, 180, 640, 5, { arms: 'up' })
        ink(g, [[150, 420], [210, 420], [200, 380], [160, 380], [150, 420]], { w: 2.4, d: 400, t: 300 })
        ink(g, L([140, 420], [220, 420]), { w: 3, d: 500, t: 200 })
        hatch(g, [[160, 380], [200, 380], [204, 390], [156, 390]], 600, true)
        rays(g, 110, 460, 14, 26, 8, 800)
        const c = glide(g, 0, 40, { ms: 900, d: 1400, loop: true })
        ink(c, E(250, 560, 7, 3), { w: 1.6, d: 1300, t: 60 })
        eye(g, 60, 340, 0.6, 1000)
        dashes(g, L([76, 346], [108, 446]), { w: 1, d: 1200, dash: 3, gap: 3 })
      },
      schulter(g) {
        // Schulterblick aus dem Auto: der Kopf dreht sich, der Blick erfasst den Radfahrer im toten Winkel
        car(g, 140, 600, 2.6, 0)
        const hd = wobble(g, { deg: 20, ox: 160, oy: 500, ms: 1600, d: 900 })
        ink(hd, E(160, 490, 12), { w: 2.2, d: 500, t: 150 })
        const cone: P[] = [[150, 490], [40, 420], [40, 470]]
        hatch(g, [...cone, cone[0]], 1100)
        dashes(g, L([150, 490], [40, 420]), { w: 1, d: 1000, dash: 4, gap: 4 })
        dashes(g, L([150, 490], [40, 470]), { w: 1, d: 1000, dash: 4, gap: 4 })
        for (const x of [30, 74]) ink(g, E(x, 594, 14), { w: 2, d: 1200, t: 150 })
        ink(g, [[30, 594], [44, 570], [64, 570], [74, 594]], { w: 2, d: 1300, t: 150 })
        fig(g, 54, 570, 1.2, { d: 1400, arms: 'push' })
      },
      ende(g) {
        eye(g, 180, 480, 2.4)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { bild: {} } },
      { t: T('Ein berühmtes Experiment: Du siehst ein Video, in dem zwei Teams sich **Basketbälle** zupassen – eins in Weiß, eins in Schwarz.', 64), gfx: { spiel: {} } },
      { t: T('Deine Aufgabe: Zähle die Pässe des **weißen Teams**. Gar nicht so leicht – die Spieler laufen durcheinander.', 64), gfx: { zaehlen: {} } },
      { t: T('Mitten im Video läuft eine Person im **Gorillakostüm** durchs Bild, bleibt stehen, trommelt sich auf die Brust – und geht.', 64), gfx: { gorilla: {} } },
      { t: T('Rund **die Hälfte** der Zuschauer bemerkt den Gorilla nicht. Neun Sekunden lang, mitten im Bild.', 64), gfx: { haelfte: {} } },
      { t: T('Das ist **Unaufmerksamkeitsblindheit**: Was wir nicht erwarten und nicht beachten, sehen wir oft schlicht nicht.', 64), gfx: { haelfte: {} } },
      { t: T('Daniel Simons und Christopher Chabris veröffentlichten den Versuch 1999. Er wurde eines der **bekanntesten** Experimente der Psychologie.', 64), gfx: { gorilla: {} } },
      { t: T('Dein Gehirn kann nicht alles verarbeiten. Aufmerksamkeit wirkt wie ein **Scheinwerfer**: Was daneben liegt, bleibt dunkel.', 64), gfx: { scheinwerfer: {} } },
      { t: T('Das Unheimliche: Wer den Gorilla verpasst hat, ist sich oft **sicher**, dass da keiner war.', 64), gfx: { sicher: {} } },
      { t: T('Sogar Fachleute: In ein Lungen-CT bauten Forscher einen winzigen Gorilla ein. **83 Prozent** der Radiologen übersahen ihn – obwohl sie Auffälligkeiten suchten.', 64), gfx: { lunge: {} } },
      { t: T('Die Farbe zählt mit: Wer die Pässe von **Weiß** zählte, übersah den dunklen Gorilla öfter als wer Schwarz zählte.', 64), gfx: { gorilla: {} } },
      { t: T('Und je anstrengender die Zählaufgabe, desto **seltener** sahen Teilnehmer den Gorilla.', 64), gfx: { zaehlen: {} } },
      { t: T('Im Verkehr ist das gefährlich: Autofahrer übersehen **Motorräder** oder Radfahrer, mit denen sie nicht rechnen.', 64), gfx: { motorrad: {} } },
      { t: T('Das Handy am Steuer macht es schlimmer: Der Blick ist auf der Straße, die Aufmerksamkeit **woanders**.', 64), gfx: { motorrad: {} } },
      { t: T('Verwandt ist die **Veränderungsblindheit**: In einem Versuch fragte ein Mann nach dem Weg – dann trugen zwei Leute eine Tür zwischen beiden hindurch.', 64), gfx: { tuer: { cls: 'a1' } } },
      { t: T('Hinter der Tür tauschte der Fragende mit einem **anderen Mann**. Rund die Hälfte der Befragten merkte nichts.', 64), gfx: { tuer: {} } },
      { t: T('Wissen schützt nur begrenzt: Wer den Gorilla erwartete, sah ihn zwar – übersah dafür andere **Überraschungen** im selben Video.', 64), gfx: { vorhang: {} } },
      { t: T('Zauberer leben davon: Sie lenken deinen Scheinwerfer – und machen ihren Trick **daneben**.', 64), gfx: { zauber: {} } },
      { t: T('Was hilft? Wo du nichts übersehen darfst, helfen feste **Routinen** – wie der Schulterblick beim Abbiegen.', 64), gfx: { schulter: {} } },
      { t: T('Du siehst, **worauf du achtest** – nicht alles, was da ist.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Etwa die Hälfte übersieht einen Gorilla, wenn sie Pässe zählt (Unaufmerksamkeitsblindheit).', 'Aufmerksamkeit ist ein Scheinwerfer – auch Fachleute übersehen Unerwartetes.', 'Im Verkehr helfen feste Routinen wie der Schulterblick.'],
    sources: ['Simons & Chabris 1999, Perception 28', 'Drew, Võ & Wolfe 2013, Psychological Science 24', 'Simons & Levin 1998, Psychonomic Bulletin & Review 5'],
  },
  {
    id: 'anker',
    area: 'PSY',
    day: 63,
    hook: 'Kann eine zufällige Zahl deine Schätzung verändern?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [],
    draw: {
      anker(g) {
        // Schiffsanker an der Kette auf dem Meeresgrund, Fische ziehen vorbei
        anchor(g, 180, 330, 1, 0)
        for (let k = 0; k < 6; k++) ink(g, E(180, 110 - k * 14, 5, 8), { w: 2, d: 200 + k * 60, t: 100 })
        const floor: P[] = smooth([[20, 400], [120, 390], [240, 398], [340, 388]], 3)
        ink(g, floor, { w: 2.2, d: 300, t: 500 })
        hatch(g, [...floor, [340, 440], [20, 440]], 500, true)
        for (const [x, y, dd] of [[60, 200, 900], [280, 260, 1200]] as const) {
          const f = glide(g, 40, 0, { ms: 5000, d: dd, loop: true })
          ink(f, smooth([[x, y], [x + 14, y - 8], [x + 30, y - 6], [x + 36, y], [x + 30, y + 6], [x + 14, y + 8], [x, y]], 3), { w: 1.6, d: dd, t: 200 })
          ink(f, [[x, y], [x - 10, y - 7], [x - 10, y + 7], [x, y]], { w: 1.4, d: dd + 100, t: 100 })
        }
      },
      rad(g) {
        // Glücksrad auf dem Ständer, Zeiger oben
        const w = spin(g, 180, 460, 6000, 1400)
        ink(w, E(180, 460, 110), { w: 3.2, t: 800 })
        for (let k = 0; k < 10; k++) {
          const a = rad(k * 36 - 90)
          ink(w, L([180, 460], [180 + Math.cos(a) * 110, 460 + Math.sin(a) * 110]), { w: 1.4, d: 300 + k * 50, t: 150 })
          if (k % 2) hatch(w, [[180, 460], ...E(180, 460, 108, 108, k * 36 - 90, k * 36 - 54), [180, 460]], 600 + k * 40)
          text(w, 180 + Math.cos(a + rad(18)) * 86, 465 + Math.sin(a + rad(18)) * 86, String(k * 10), { anchor: 'middle', cls: 's halo', d: 700 + k * 40 })
        }
        ink(g, [[180, 340], [170, 322], [190, 322], [180, 340]], { w: 2.6, d: 1200, t: 200 })
        ball(g, 180, 460, 10, { d: 900, fill: 'dicht', t: 200 })
        ink(g, [[150, 640], [180, 470], [210, 640]], { w: 2.6, d: 200, t: 400 })
        ink(g, L([120, 640], [240, 640]), { w: 2.6, d: 300, t: 300 })
      },
      afrika(g) {
        // Afrika, ringsum 54 Fähnchen für seine Staaten
        const pts = coastPts(LAND.afrika, (lon, lat) => [180 + (lon - 17) * 3.2 * Math.cos(rad(lat * 0.6)), 470 - (lat - 2) * 3.2])
        blank(g, pts)
        hatch(g, pts, 500)
        ink(g, pts, { w: 2.4, t: 900 })
        for (let i = 0; i < 54; i++) {
          const a = rad(-90 + (i * 360) / 54)
          const x = 180 + Math.cos(a) * 160
          const y = 470 + Math.sin(a) * 170
          if (y < 300 || y > 650 || x < 14 || x > 346) continue
          ink(g, L([x, y + 6], [x, y - 8]), { w: 1, d: 900 + i * 15, t: 40 })
          ink(g, RR(x, y - 8, 8, 6, 1), { w: 0.9, d: 950 + i * 15, t: 40 })
        }
        question(g, 300, 600, 0.5, 1800)
      },
      ergebnis(g) {
        // links: Rad zeigte 10 → niedrige Schätzung; rechts: Rad zeigte 65 → hohe Schätzung
        for (const [x, ang, h, d, dense] of [[110, -54, 100, 0, false], [250, 144, 180, 400, true]] as const) {
          ink(g, E(x, 360, 36), { w: 2.2, d, t: 300 })
          for (let k = 0; k < 10; k++) ink(g, L([x, 360], [x + Math.cos(rad(k * 36 - 90)) * 36, 360 + Math.sin(rad(k * 36 - 90)) * 36]), { w: 0.8, d: d + 200, t: 60 })
          ink(g, L([x, 360], [x + Math.cos(rad(ang)) * 30, 360 + Math.sin(rad(ang)) * 30]), { w: 3, d: d + 500, t: 150 })
          const r = RR(x - 35, 620 - h, 70, h, 3)
          hatch(g, r, d + 900, dense)
          ink(g, r, { w: 2.4, d: d + 800, t: 300 })
        }
        ink(g, L([40, 622], [320, 622]), { w: 2.4, d: 200, t: 400 })
      },
      zug(g) {
        // Zahlenstrahl: der Anker liegt links, die Schätzung hängt an einer Kette und kommt nur zögerlich los
        ink(g, L([30, 520], [330, 520]), { w: 2.4, t: 600 })
        for (let k = 0; k <= 10; k++) ink(g, L([30 + k * 30, 512], [30 + k * 30, 528]), { w: 1.6, d: 200 + k * 30, t: 80 })
        anchor(g, 90, 640, 0.35, 500)
        const p = glide(g, 50, 0, { ms: 2400, d: 1200 })
        ball(p, 120, 520, 10, { d: 1000, fill: 'dicht', w: 1.6, t: 100 })
        ink(p, B([120, 530], [110, 560], [100, 570], [90, 556]), { w: 1.6, d: 1100, t: 200 })
        dashes(g, L([270, 500], [270, 540]), { w: 1.4, d: 1300, dash: 3, gap: 3 })
        dot(g, 270, 520, 4, 1400)
      },
      preis(g) {
        // Fernseher mit Preisschild: alter Preis durchgestrichen, neuer groß
        ink(g, RR(40, 340, 200, 130, 6), { w: 2.8, t: 500 })
        ink(g, RR(52, 352, 176, 100, 3), { w: 1.4, d: 200, t: 400 })
        ink(g, [[120, 470], [110, 490], [170, 490], [160, 470]], { w: 2.2, d: 300, t: 200 })
        const tag: P[] = [[180, 500], [300, 500], [330, 540], [300, 580], [180, 580], [180, 500]]
        ink(g, tag, { w: 2.6, d: 600, t: 500 })
        ink(g, E(310, 540, 6), { w: 1.6, d: 800, t: 100 })
        ink(g, L([310, 534], [250, 470]), { w: 1, d: 800, t: 200 })
        for (let k = 0; k < 3; k++) ink(g, E(200 + k * 18, 520, 6, 8), { w: 1.6, d: 900 + k * 60, t: 80 })
        strike(g, [190, 526], [256, 514], 1200)
        for (let k = 0; k < 3; k++) ink(g, E(210 + k * 26, 556, 9, 12), { w: 3, d: 1500 + k * 80, t: 100 })
      },
      gehalt(g) {
        // Verhandlung am Tisch: in der Sprechblase ein Bündel Geldscheine
        fig(g, 90, 600, 3.6)
        fig(g, 270, 600, 3.6, { d: 200 })
        ink(g, RR(130, 520, 100, 20, 4), { w: 2.6, d: 400, t: 300 })
        for (const x of [140, 220]) ink(g, L([x, 540], [x, 600]), { w: 2, d: 450, t: 150 })
        bubble(g, 20, 330, 150, 80, 'l', 700)
        for (let k = 0; k < 3; k++) {
          ink(g, RR(56 + k * 4, 352 + k * 6, 70, 30, 3), { w: 1.6, d: 900 + k * 80, t: 150 })
          ink(g, E(91 + k * 4, 367 + k * 6, 8), { w: 1, d: 1000 + k * 80, t: 60 })
        }
      },
      richter(g) {
        // Richterin mit Hammer am Pult; davor liegen zwei Würfel
        ink(g, RR(80, 520, 200, 120, 4), { w: 2.8, t: 500 })
        for (let k = 0; k < 4; k++) ink(g, L([90 + k * 50, 530], [90 + k * 50, 630]), { w: 0.8, d: 300, t: 200 })
        fig(g, 180, 520, 4, { d: 300, arms: 'up' })
        const hm = wobble(g, { deg: 20, ox: 220, oy: 440, ms: 500, d: 1200 })
        ink(hm, L([220, 440], [250, 410]), { w: 2.6, d: 900, t: 150 })
        ink(hm, RR(240, 396, 26, 14, 3), { w: 2.4, d: 1000, t: 100 })
        for (const [x, n] of [[40, 3], [320, 6]] as const) {
          ink(g, RR(x - 20, 360, 40, 40, 8), { w: 2.4, d: 600, t: 300 })
          const pips: [number, number][] = n === 3 ? [[-10, -10], [0, 0], [10, 10]] : [[-10, -10], [-10, 0], [-10, 10], [10, -10], [10, 0], [10, 10]]
          for (const [dx, dy] of pips) dot(g, x + dx, 380 + dy, 3, 800)
        }
      },
      gandhi(g) {
        // alter Mann mit runder Brille und Stock; daneben eine Messlatte fürs Lebensalter mit hohem Markierungsstrich
        fig(g, 120, 620, 5, { d: 0 })
        for (const k of [-1, 1]) ink(g, E(120 + k * 6, 474, 5), { w: 1.4, d: 500, t: 100 })
        ink(g, L([150, 520], [170, 620]), { w: 2.2, d: 600, t: 200 })
        const robe: P[] = [[96, 520], [144, 520], [150, 600], [90, 600], [96, 520]]
        blank(g, robe)
        ink(g, robe, { w: 1.8, d: 700, t: 300 })
        ink(g, L([260, 640], [260, 320]), { w: 2.4, d: 800, t: 400 })
        for (let k = 0; k <= 15; k++) ink(g, L([260, 640 - k * 20], [k % 5 ? 268 : 276, 640 - k * 20]), { w: 1, d: 900 + k * 20, t: 40 })
        arrow(g, L([310, 340], [282, 340]), { w: 2.4, d: 1400, t: 200, head: 8 })
        dashes(g, L([240, 470], [290, 470]), { w: 1.4, d: 1600, dash: 3, gap: 3 })
      },
      makler(g) {
        // Haus mit Verkaufsschild; Fachleute mit Klemmbrett schauen auf den Preis
        house(g, 40, 600, 150, 0)
        ink(g, L([250, 600], [250, 460]), { w: 2.6, d: 400, t: 300 })
        ink(g, RR(214, 420, 100, 50, 4), { w: 2.6, d: 600, t: 300 })
        for (let k = 0; k < 3; k++) ink(g, E(236 + k * 22, 445, 7, 10), { w: 2, d: 800 + k * 60, t: 80 })
        crowd(g, 220, 640, 3, 34, 1.8, 900, 100)
        ink(g, RR(224, 588, 14, 18, 2), { w: 1.4, d: 1200, t: 100 })
      },
      gruende(g) {
        // das Gehirn sammelt Gründe, die zum Anker passen
        anchor(g, 180, 380, 0.3, 0)
        brain(g, 180, 480, 1, 300)
        for (const [x, y] of [[80, 610], [180, 630], [280, 610]] as const) check(g, x, y, 0.8, 1100)
      },
      gegen(g) {
        // Gegenmittel: bewusst Gründe dagegen suchen
        anchor(g, 180, 380, 0.3, 0)
        strike(g, [150, 320], [210, 380], 500)
        brain(g, 180, 480, 1, 300)
        for (const [x, y] of [[80, 610], [180, 630], [280, 610]] as const) cross(g, x, y, 0.7, 1100)
      },
      ende(g) {
        anchor(g, 180, 560, 0.8, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { anker: {} } },
      { t: T('Ein Versuch der Psychologen Amos Tversky und Daniel Kahneman: Vor den Augen der Teilnehmer wird ein **Glücksrad** gedreht.', 64), gfx: { rad: {} } },
      { t: T('Das Rad ist präpariert: Es bleibt entweder bei **10** oder bei **65** stehen. Alle sehen, dass die Zahl zufällig ist.', 64), gfx: { rad: {} } },
      { t: T('Dann die Frage: Liegt der Anteil afrikanischer Staaten in der UNO über oder unter dieser Zahl? Und **wie hoch** ist er?', 64), gfx: { afrika: {} } },
      { t: T('Wer die 10 gesehen hatte, schätzte im Mittel **25 Prozent**. Wer die 65 gesehen hatte: 45 Prozent.', 64), gfx: { ergebnis: {} } },
      { t: T('Eine offensichtlich **zufällige** Zahl hat die Schätzung um 20 Prozentpunkte verschoben.', 64), gfx: { ergebnis: {} } },
      { t: T('Das ist der **Ankereffekt**: Eine erste Zahl wirkt wie ein Anker, von dem wir uns nur zögerlich wegbewegen.', 64), gfx: { zug: {} } },
      { t: T('Händler nutzen das täglich: Der **durchgestrichene Preis** ist ein Anker. 199 statt 299 wirkt günstig – egal, was das Ding wert ist.', 64), gfx: { preis: {} } },
      { t: T('In Gehaltsverhandlungen setzt oft die **erste genannte Zahl** den Rahmen für alles, was folgt.', 64), gfx: { gehalt: {} } },
      { t: T('Sogar Richter sind beeinflussbar: In Versuchen schlugen erfahrene Juristen nach einem **gewürfelten** Anker höhere Strafen vor.', 64), gfx: { richter: {} } },
      { t: T('Selbst absurde Anker wirken: Die Frage, ob Gandhi älter als **140 Jahre** wurde, hob die Schätzungen seines Sterbealters deutlich an.', 64), gfx: { gandhi: {} } },
      { t: T('Auch Immobilienmakler ließen sich in einem Versuch vom angegebenen **Listenpreis** beeinflussen – und bestritten es hinterher.', 64), gfx: { makler: {} } },
      { t: T('Warum? Das Gehirn prüft den Anker, sucht **Gründe**, warum er passen könnte – und findet welche.', 64), gfx: { gruende: {} } },
      { t: T('Oder es startet beim Anker und passt die Schätzung schrittweise an – und **hört zu früh auf**.', 64), gfx: { zug: {} } },
      { t: T('Erfahrung schützt kaum: Fachleute werden in vielen Studien **fast genauso stark** verankert wie Laien.', 64), gfx: { makler: {} } },
      { t: T('Nicht jeder Versuch hält stand: Dass schon die eigene **Telefonnummer** Gebote verändert, ließ sich später nur schwach wiederholen.', 64), gfx: { rad: {} } },
      { t: T('Was hilft: Vor dem Schätzen bewusst Gründe suchen, warum der Anker **falsch** sein könnte – das Gegenteil bedenken.', 64), gfx: { gegen: {} } },
      { t: T('Und in Verhandlungen selbst zuerst einen gut begründeten Wert nennen. Dann bist **du** der Anker.', 64), gfx: { gehalt: {} } },
      { t: T('Die erste Zahl ist selten neutral – sie **zieht**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Eine zufällige Zahl (10 oder 65) verschob Schätzungen um 20 Prozentpunkte.', 'Erste Zahlen wirken als Anker – auch bei Preisen, Gehältern, Strafmaßen.', 'Gegenmittel: Gründe gegen den Anker suchen oder selbst zuerst begründet ankern.'],
    sources: ['Tversky & Kahneman 1974, Science 185', 'Englich, Mussweiler & Strack 2006, Personality and Social Psychology Bulletin 32', 'Chapman et al. 2023, Journal of Economic Psychology (Replikation)'],
  },
  {
    id: 'verlustangst',
    area: 'PSY',
    day: 63,
    hook: 'Warum tut Verlieren mehr weh, als Gewinnen freut?',
    mood: 'dunkel',
    ambience: 'uhr',
    images: [],
    draw: {
      muenze(g) {
        // Euromünze mit Riffelrand und Sternenkranz, wird hochgeschnippt
        const c = glide(g, 0, -40, { ms: 900, d: 1200, loop: true })
        ball(c, 180, 250, 90, { fill: 'hell', w: 3.2, t: 800 })
        ink(c, E(180, 250, 70), { w: 1.6, d: 400, t: 600 })
        for (let k = 0; k < 60; k++) {
          const a = rad(k * 6)
          ink(c, L([180 + Math.cos(a) * 86, 250 + Math.sin(a) * 86], [180 + Math.cos(a) * 90, 250 + Math.sin(a) * 90]), { w: 0.8, d: 500 + k * 5, t: 30 })
        }
        for (let k = 0; k < 12; k++) star(c, 180 + Math.cos(rad(k * 30)) * 78, 250 + Math.sin(rad(k * 30)) * 78, 4, { d: 700 + k * 30 })
        text(c, 180, 268, '€', { anchor: 'middle', size: 54, cls: 'halo', d: 700 })
        ink(g, smooth([[120, 430], [140, 400], [180, 392], [210, 404], [214, 420], [180, 430], [120, 430]], 3), { w: 2.4, d: 300, t: 300 })
        ink(g, B([206, 404], [214, 390], [224, 384], [230, 388]), { w: 2, d: 400, t: 150 })
      },
      wette(g) {
        // Kopf: ein Bündel kommt dazu (etwas dicker); Zahl: ein Bündel fliegt davon
        coinSide(g, 90, 360, true, 0)
        coinSide(g, 270, 360, false, 300)
        arrow(g, L([90, 400], [90, 460]), { w: 2, d: 600, t: 200, head: 7 })
        arrow(g, L([270, 400], [270, 460]), { w: 2, d: 700, t: 200, head: 7 })
        bills(g, 60, 560, 11, 1, 900)
        const fly = glide(g, 30, -60, { ms: 1600, d: 1600, loop: true })
        bills(fly, 240, 560, 10, 1, 1000, true)
        ink(g, L([20, 600], [340, 600]), { w: 2, d: 200, t: 400 })
      },
      ablehnen(g) {
        // acht Leute: die meisten winken ab; erst bei einem viel dickeren Bündel stimmen sie zu
        crowd(g, 40, 600, 8, 40, 2.4, 0, 100)
        for (let i = 0; i < 8; i++) (i < 6 ? cross : check)(g, 40 + i * 40, 640, 0.5, 900 + i * 80)
        bills(g, 50, 400, 11, 0.9, 1200)
        cross(g, 80, 340, 0.6, 1500)
        bills(g, 220, 420, 20, 0.9, 1400)
        check(g, 250, 330, 0.6, 1900)
      },
      kurve(g) {
        // gleich große Beträge: der Verlust zieht die Kurve doppelt so weit hinunter
        valueCurve(g, 180, 470, 150, 160, 0)
        for (const [x, y, d] of [[260, 470 - Math.pow(80 / 135, 0.6) * 72, 1800], [100, 470 + Math.pow(80 / 135, 0.6) * 144, 2000]] as const) {
          dashes(g, L([x, 470], [x, y]), { w: 1.2, d, dash: 3, gap: 3 })
          dot(g, x, y, 4, d + 200)
        }
      },
      tasse(g) {
        // Becher mit Dampf; die Besitzerin hängt ein hohes Preisschild dran, der Käufer bietet ein niedriges
        ink(g, [[120, 380], [130, 560], [230, 560], [240, 380]], { w: 3.2, t: 700 })
        ink(g, E(180, 380, 60, 10), { w: 2, d: 200, t: 300 })
        ink(g, E(254, 460, 24, 38, -90, 90), { w: 3, d: 400, t: 400 })
        heart(g, 180, 470, 0.6, 600)
        for (let k = 0; k < 3; k++) {
          const w = wobble(g, { dx: 4, ms: 1400 + k * 200, d: 900 })
          ink(w, B([160 + k * 20, 366], [152 + k * 20, 340], [170 + k * 20, 320], [162 + k * 20, 296]), { w: 1.4, d: 800 + k * 100, t: 300 })
        }
        for (const [x, h, d] of [[60, 80, 1000], [300, 40, 1300]] as const) {
          ink(g, L([x, 620], [x, 620 - h]), { w: 1, d, t: 100 })
          const r = RR(x - 14, 620 - h - 30, 28, 30, 3)
          ink(g, r, { w: 2, d: d + 100, t: 150 })
          for (let k = 0; k < Math.round(h / 20); k++) ink(g, E(x, 620 - h - 15 - 0, 6 + k * 2, 4 + k), { w: 1, d: d + 200 + k * 60, t: 60 })
        }
      },
      aktie(g) {
        // fallender Kurs, der Anleger hält die Aktie fest umklammert
        axes(g, 30, 600, 330, 330, { xl: 'Zeit', yl: 'Kurs' })
        ink(g, [[40, 380], [80, 400], [120, 450], [160, 430], [200, 500], [240, 520], [280, 560], [320, 570]], { w: 2.8, d: 400, t: 1200 })
        fig(g, 250, 460, 2.4, { d: 1200, arms: 'cross' })
        ink(g, RR(236, 400, 28, 20, 3), { w: 1.6, d: 1500, t: 100 })
        ink(g, [[240, 414], [248, 406], [254, 412], [260, 404]], { w: 1.2, d: 1600, t: 80 })
      },
      verpassen(g) {
        // Sanduhr läuft ab neben dem Angebot; darunter das Probeabo als Geschenk, das sich später nicht kündigt
        const hg: P[] = [[60, 340], [130, 340], [100, 400], [130, 460], [60, 460], [90, 400], [60, 340]]
        ink(g, hg, { w: 2.4, t: 500 })
        hatch(g, [[64, 344], [126, 344], [112, 370], [78, 370]], 600, true)
        const s = glide(g, 0, 50, { ms: 1000, d: 900, loop: true })
        dot(s, 95, 404, 1.6, 800)
        hatch(g, [[70, 456], [120, 456], [105, 430], [85, 430]], 1200, true)
        ink(g, RR(170, 350, 150, 90, 6), { w: 2.4, d: 300, t: 400 })
        hatch(g, RR(176, 356, 138, 24, 4), 600, true)
        for (let k = 0; k < 3; k++) ink(g, L([184, 396 + k * 12], [270 - k * 20, 396 + k * 12]), { w: 1, d: 700 + k * 60, t: 80 })
        ink(g, RR(110, 520, 140, 90, 4), { w: 2.6, d: 900, t: 400 })
        ink(g, L([180, 520], [180, 610]), { w: 2, d: 1000, t: 150 })
        ink(g, L([110, 560], [250, 560]), { w: 2, d: 1050, t: 150 })
        for (const k of [-1, 1]) ink(g, E(180 + k * 20, 510, 20, 10, k < 0 ? 0 : 180, k < 0 ? 180 : 360), { w: 2, d: 1100, t: 150 })
        ink(g, E(280, 600, 14), { w: 1.6, d: 1300, t: 150 })
        ink(g, L([280, 586], [280, 600]), { w: 1.6, d: 1400, t: 80 })
      },
      golf(g) {
        // Grün mit Loch und Fahne, der Golfer puttet konzentriert, der Ball rollt
        ink(g, B([20, 600], [100, 580], [260, 580], [340, 600]), { w: 3, t: 700 })
        ink(g, E(260, 586, 14, 4), { w: 2.2, d: 300, t: 200 })
        hatch(g, E(260, 587, 10, 2.6), 500, true)
        ink(g, L([260, 586], [260, 470]), { w: 2, d: 500, t: 300 })
        const fl = wobble(g, { deg: 6, ox: 260, oy: 472, ms: 700, d: 900 })
        ink(fl, [[260, 470], [300, 484], [260, 498]], { w: 2, d: 700, t: 200 })
        hatch(fl, [[260, 470], [300, 484], [260, 498]], 800, true)
        fig(g, 100, 580, 3, { d: 400, arms: 'down' })
        ink(g, L([104, 520], [130, 574]), { w: 2, d: 800, t: 150 })
        ink(g, L([126, 574], [138, 574]), { w: 3, d: 850, t: 60 })
        const b = glide(g, 100, 6, { ms: 2200, d: 1200, loop: true })
        ball(b, 150, 574, 5, { d: 1000, w: 1.4, t: 60 })
        dashes(g, B([150, 578], [190, 582], [230, 586], [256, 586]), { w: 1, d: 1300, dash: 3, gap: 4 })
      },
      affen(g) {
        // zwei Kapuzineraffen tauschen Wertmarken gegen Apfelstücke
        capuchin(g, 100, 600, 1, 0)
        capuchin(g, 260, 600, 1, 300)
        for (const [x, y, d] of [[150, 470, 900], [210, 470, 1100]] as const) {
          ink(g, E(x, y, 9), { w: 1.8, d, t: 100 })
          ink(g, E(x, y, 4), { w: 1, d: d + 60, t: 60 })
        }
        const ap: P[] = [...E(180, 410, 16, 16, 200, 520)]
        ink(g, [...ap, [180, 410], ap[0]], { w: 1.8, d: 1300, t: 200 })
        ink(g, L([180, 394], [184, 382]), { w: 1.4, d: 1400, t: 60 })
      },
      bar(g) {
        // Bargeld mit Pfeil nach unten (Rabatt) – Karte mit Pfeil nach oben (Aufschlag): derselbe Betrag
        bills(g, 50, 470, 4, 1.2, 0)
        arrow(g, L([90, 380], [90, 430]), { w: 2.4, d: 600, t: 200, head: 8 })
        check(g, 90, 560, 0.9, 900)
        ink(g, RR(210, 420, 100, 64, 8), { w: 2.6, d: 300, t: 400 })
        hatch(g, RR(210, 434, 100, 12, 0), 500, true)
        ink(g, RR(222, 456, 20, 14, 2), { w: 1.4, d: 600, t: 100 })
        arrow(g, L([260, 410], [260, 360]), { w: 2.4, d: 800, t: 200, head: 8 })
        cross(g, 260, 560, 0.9, 1100)
      },
      vorfahren(g) {
        // Höhle mit Vorräten; ein Wolf schleicht heran – Verlust konnte das Ende bedeuten
        const cave: P[] = smooth([[20, 620], [40, 420], [140, 340], [260, 350], [320, 440], [340, 620]], 3)
        ink(g, cave, { w: 3, t: 800 })
        hatch(g, [...cave, [340, 650], [20, 650]], 300)
        ink(g, B([90, 620], [110, 480], [230, 480], [250, 620]), { w: 2.4, d: 400, t: 500 })
        fig(g, 140, 620, 3.2, { d: 600, arms: 'push' })
        for (let k = 0; k < 3; k++) ink(g, E(200 + k * 14, 610 - k * 10, 12, 6), { w: 1.8, d: 800 + k * 80, t: 150 })
        const wf = glide(g, -30, 0, { ms: 2400, d: 1200, loop: true })
        const w: P[] = smooth([[290, 610], [300, 590], [330, 588], [346, 594], [350, 606], [340, 612], [300, 614], [290, 610]], 3)
        hatch(wf, w, 1200, true)
        ink(wf, w, { w: 1.6, d: 1100, t: 200 })
        ink(wf, [[290, 600], [278, 590], [284, 604]], { w: 1.4, d: 1200, t: 80 })
      },
      neukauf(g) {
        // vor dem Regal: würde ich das heute noch einmal kaufen?
        ink(g, RR(40, 330, 140, 300, 4), { w: 2.4, t: 500 })
        for (let k = 1; k < 4; k++) ink(g, L([40, 330 + k * 75], [180, 330 + k * 75]), { w: 1.8, d: 200 + k * 60, t: 200 })
        for (let k = 0; k < 8; k++) ink(g, RR(52 + (k % 4) * 30, 352 + Math.floor(k / 4) * 75, 22, 50 - (k % 3) * 6, 2), { w: 1.4, d: 500 + k * 40, t: 80 })
        fig(g, 260, 630, 4, { d: 600 })
        question(g, 270, 380, 0.9, 1100)
      },
      ende(g) {
        valueCurve(g, 180, 490, 130, 130, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { muenze: {} } },
      { t: T('Ein Angebot: Eine Münze wird geworfen. Kopf – du gewinnst **110 Euro**. Zahl – du verlierst 100 Euro. Spielst du mit?', 64), gfx: { wette: {} } },
      { t: T('Rein rechnerisch lohnt es sich: Im Schnitt gewinnst du **5 Euro** pro Wurf.', 64), gfx: { f1: { draw: 'formel', args: [['½ × 110 €', '−', '½ × 100 €', '=', '+ 5 €'], 360] } } },
      { t: T('Trotzdem lehnen die meisten ab. Viele würden erst mitspielen, wenn der mögliche Gewinn bei rund **200 Euro** liegt.', 64), gfx: { ablehnen: {} } },
      { t: T('Das ist **Verlustaversion**: Ein Verlust schmerzt etwa doppelt so stark, wie ein gleich großer Gewinn freut.', 64), gfx: { kurve: {} } },
      { t: T('Beschrieben haben das Daniel Kahneman und Amos Tversky 1979 in ihrer **Prospect Theory**. Kahneman bekam dafür später den Wirtschafts-Nobelpreis.', 64), gfx: { kurve: {} } },
      { t: T('Verwandt ist der **Besitztumseffekt**: Was uns gehört, bewerten wir höher.', 64), gfx: { tasse: {} } },
      { t: T('In einem Versuch bekam die Hälfte der Gruppe eine Tasse geschenkt. Verkaufen wollten sie sie im Mittel nur für etwa **das Doppelte** dessen, was andere zu zahlen bereit waren.', 64), gfx: { tasse: {} } },
      { t: T('Darum halten Anleger fallende Aktien oft zu lange: **Verkaufen** würde den Verlust endgültig machen.', 64), gfx: { aktie: {} } },
      { t: T('Werbung nutzt es: „Nicht **verpassen**!“ wirkt stärker als „Jetzt gewinnen“.', 64), gfx: { verpassen: {} } },
      { t: T('Auch Gratis-Probeabos spielen damit: Was du einmal hast, **kündigst** du ungern.', 64), gfx: { verpassen: {} } },
      { t: T('Sogar Golfprofis zeigen es: Sie putten zielsicherer, um einen Schlag **zu viel** zu vermeiden, als um einen Schlag zu gewinnen.', 64), gfx: { golf: {} } },
      { t: T('Auch Kapuzineraffen zeigen es: In Tauschversuchen mit Futter mieden sie Angebote, die sich wie ein **Verlust** anfühlten.', 64), gfx: { affen: {} } },
      { t: T('Eine Erklärung aus der Evolution: Für unsere Vorfahren konnte ein Verlust – Vorräte, Schutz – **tödlich** sein. Ein Gewinn war nur angenehm.', 64), gfx: { vorfahren: {} } },
      { t: T('Händler wissen das: Ein **Rabatt** bei Barzahlung klingt viel besser als ein Aufschlag bei Kartenzahlung – obwohl es dasselbe ist.', 64), gfx: { bar: {} } },
      { t: T('Ein Schulversuch in den USA: Lehrkräfte, die einen Bonus vorab bekamen und **zurückzahlen** mussten, wenn Ziele verfehlt wurden, erzielten bessere Ergebnisse.', 64), gfx: { bar: {} } },
      { t: T('Ein Trick für Entscheidungen: Frag dich, ob du es **neu kaufen** würdest, wenn du es nicht schon hättest.', 64), gfx: { neukauf: {} } },
      { t: T('Und denk in **Summen** statt in Einzelfällen: Viele kleine faire Wetten gleichen Verluste auf lange Sicht aus.', 64), gfx: { kurve: {} } },
      { t: T('Verluste wiegen **doppelt**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Verluste schmerzen etwa doppelt so stark, wie gleich große Gewinne freuen (Prospect Theory).', 'Daraus folgen Besitztumseffekt, zu langes Halten von Verlust-Aktien, Angst vor dem Verpassen.', 'Hilfreich: „Würde ich es neu kaufen?“'],
    sources: ['Kahneman & Tversky 1979, Econometrica 47', 'Kahneman, Knetsch & Thaler 1990, Journal of Political Economy 98', 'Pope & Schweitzer 2011, American Economic Review 101'],
  },
  {
    id: 'placebo',
    area: 'PSY',
    day: 12,
    hook: 'Wirken Zuckerpillen – sogar, wenn du es weißt?',
    mood: 'raetsel',
    ambience: 'herz',
    images: [],
    draw: {
      pille(g) {
        const p = RR(90, 220, 180, 70, 35)
        ink(g, p, { w: 3.2, t: 700 })
        hatch(g, RR(180, 222, 88, 66, 32), 600, true)
        ink(g, L([180, 222], [180, 288]), { w: 2.2, d: 500, t: 200 })
      },
      schein(g) {
        const p = RR(90, 440, 180, 70, 35)
        ink(g, p, { w: 3.2, t: 700 })
        ink(g, L([180, 442], [180, 508]), { w: 2.2, d: 500, t: 200 })
        text(g, 180, 580, 'kein Wirkstoff', { anchor: 'middle', size: 20, d: 900 })
      },
      besser(g) {
        bullets(g, 60, 380, ['Schmerzen', 'Übelkeit', 'Erschöpfung', 'Schlafprobleme'], { gap: 50, size: 19 })
      },
      erwartung(g) {
        brain(g, 180, 440, 1.1)
        arrow(g, L([180, 520], [180, 600]), { w: 2.6, d: 1000, t: 300, head: 9 })
        text(g, 180, 630, 'eigene Botenstoffe', { anchor: 'middle', cls: 's', d: 1200 })
      },
      naloxon(g) {
        box(g, 30, 380, 140, 70, 'Placebo', { size: 18 })
        arrow(g, L([100, 456], [100, 520]), { w: 2.4, d: 400, t: 300, head: 9 })
        box(g, 30, 530, 140, 60, 'Endorphine', { size: 16, d: 600 })
        box(g, 190, 380, 140, 70, ['+ Gegenmittel', 'zu Morphin'], { size: 15, d: 900, fill: true })
        cross(g, 260, 560, 1.2, 1300)
      },
      groesse(g) {
        ink(g, RR(50, 470, 60, 26, 13), { w: 2.4, t: 400 })
        ink(g, RR(150, 450, 100, 46, 23), { w: 2.8, d: 300, t: 500 })
        ink(g, L([270, 420], [330, 520]), { w: 3, d: 600, t: 300 })
        ink(g, RR(260, 400, 30, 60, 4), { w: 2.4, d: 700, t: 300 })
        text(g, 180, 580, 'groß, Spritze, auffällig: oft stärker', { anchor: 'middle', cls: 's', d: 1000 })
      },
      preis(g) {
        for (const [x, n, d] of [[100, '2,50 €', 0], [260, '10 Cent', 400]] as const) {
          ink(g, RR(x - 60, 420, 120, 50, 25), { w: 2.8, d, t: 500 })
          text(g, x, 520, n, { anchor: 'middle', size: 20, d: d + 300 })
        }
        text(g, 180, 600, 'teuer wirkt besser', { anchor: 'middle', cls: 's', d: 1000 })
      },
      offen(g) {
        ink(g, RR(100, 380, 160, 220, 14), { w: 3, t: 700 })
        text(g, 180, 440, 'PLACEBO', { anchor: 'middle', size: 22, d: 500 })
        text(g, 180, 470, 'ohne Wirkstoff', { anchor: 'middle', cls: 's', d: 700 })
        for (let i = 0; i < 4; i++) ink(g, E(140 + i * 27, 540, 10, 6), { w: 2, d: 900 + i * 80, t: 200 })
      },
      studien(g) {
        vbars(g, [
          { label: 'ohne Pille', v: 3, fmt: () => '' },
          { label: 'offenes Placebo', v: 5, fmt: () => 'besser', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        text(g, 180, 330, 'Reizdarm, Rückenschmerz', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ritual(g) {
        ink(g, [[110, 400], [120, 560], [240, 560], [250, 400]], { w: 3, t: 700 })
        ink(g, RR(130, 340, 40, 18, 9), { w: 2.4, d: 500, t: 300 })
        clock(g, 300, 380, 30, 240, 0, 700)
        text(g, 180, 620, 'Ritual: sich um sich kümmern', { anchor: 'middle', cls: 's', d: 1100 })
      },
      scan(g) {
        brain(g, 100, 470, 0.6)
        hatch(g, E(100, 460, 24), 800, true)
        brain(g, 260, 470, 0.6, 300)
        ink(g, E(260, 460, 12), { w: 2, d: 900, t: 200 })
        text(g, 100, 560, 'ohne Placebo', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 260, 560, 'mit Placebo', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 180, 610, 'Schmerzareale weniger aktiv', { anchor: 'middle', cls: 's', d: 1300 })
      },
      knie(g) {
        ink(g, B([100, 340], [120, 400], [150, 440], [170, 470]), { w: 3.2, t: 500 })
        ink(g, B([170, 470], [190, 520], [200, 560], [210, 620]), { w: 3.2, d: 300, t: 500 })
        ink(g, B([150, 330], [168, 390], [196, 430], [216, 470]), { w: 3.2, t: 500 })
        ink(g, B([216, 470], [236, 520], [246, 560], [256, 620]), { w: 3.2, d: 300, t: 500 })
        for (const [x, y] of [[230, 450], [160, 500]] as const) ink(g, L([x - 8, y], [x + 8, y]), { w: 2.2, d: 900, t: 100 })
        text(g, 290, 400, 'Schein-OP', { anchor: 'middle', d: 1100 })
      },
      nocebo(g) {
        const p = RR(90, 440, 180, 70, 35)
        ink(g, p, { w: 3.2, t: 700 })
        text(g, 180, 380, 'Nocebo', { anchor: 'middle', size: 26, d: 500 })
        text(g, 180, 580, 'erwartete Nebenwirkungen kommen eher', { anchor: 'middle', cls: 's', d: 900 })
      },
      grenzen(g) {
        box(g, 30, 380, 140, 90, ['Beschwerden', 'erleben'], { size: 16 })
        check(g, 100, 520, 1, 600)
        box(g, 190, 380, 140, 90, ['Infektion,', 'Tumor'], { size: 16, d: 400, fill: true })
        cross(g, 260, 520, 1, 900)
      },
      doppelblind(g) {
        fig(g, 90, 600, 4)
        fig(g, 270, 600, 4, { d: 200 })
        for (const x of [90, 270]) ink(g, RR(x - 22, 470, 44, 12, 4), { w: 2.4, d: 700, t: 200 })
        text(g, 180, 400, 'weder Patient noch Ärztin wissen es', { anchor: 'middle', cls: 's', d: 1000 })
      },
      verdeckt(g) {
        vbars(g, [
          { label: 'heimlich gegeben', v: 3, fmt: () => '' },
          { label: 'angekündigt', v: 5.5, fmt: () => 'mehr Linderung', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        text(g, 180, 330, 'gleiches Schmerzmittel', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        ink(g, RR(110, 460, 140, 56, 28), { w: 3, t: 600 })
        ink(g, L([180, 462], [180, 514]), { w: 2, d: 400, t: 200 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { pille: {} } },
      { t: T('Ein **Placebo** ist ein Scheinmedikament: eine Tablette ohne Wirkstoff, oft nur aus Zucker oder Stärke.', 64), gfx: { schein: {} } },
      { t: T('Trotzdem fühlen sich viele Menschen damit besser – vor allem bei **Schmerzen**, Übelkeit oder Erschöpfung.', 64), gfx: { besser: {} } },
      { t: T('Der Schlüssel ist **Erwartung**: Das Gehirn rechnet mit Linderung – und verändert, was es selbst ausschüttet und wahrnimmt.', 64), gfx: { erwartung: {} } },
      { t: T('Bei Schmerzen setzt es **Endorphine** frei, körpereigene Schmerzmittel. Ein Gegenmittel zu Morphin kann den Placebo-Effekt sogar abschwächen.', 64), gfx: { naloxon: {} } },
      { t: T('Das Drumherum zählt: Auffällige Pillen, Spritzen und **ausführliche** Gespräche wirken oft stärker als eine kleine Tablette.', 64), gfx: { groesse: {} } },
      { t: T('Auch der **Preis**: In einem Versuch linderte eine angeblich teure Schmerzpille mehr als dieselbe, angeblich billige.', 64), gfx: { preis: {} } },
      { t: T('Am verblüffendsten sind **offene Placebos**: Man sagt den Menschen ehrlich, dass sie Zuckerpillen bekommen.', 64), gfx: { offen: {} } },
      { t: T('In Studien zu Reizdarm oder Rückenschmerzen ging es vielen trotzdem **besser** als ohne Pillen.', 64), gfx: { studien: {} } },
      { t: T('Vermutlich wirkt das **Ritual**: regelmäßig etwas für sich tun, Zuwendung, die Aufmerksamkeit auf Besserung.', 64), gfx: { ritual: {} } },
      { t: T('Das ist keine bloße Einbildung: Hirnscans zeigen, dass Schmerzareale unter Placebo tatsächlich **weniger aktiv** sind.', 64), gfx: { scan: {} } },
      { t: T('Es gibt auch das Gegenteil, den **Nocebo-Effekt**: Wer Nebenwirkungen erwartet, bekommt sie eher – auch von Zuckerpillen.', 64), gfx: { nocebo: {} } },
      { t: T('Sogar **Schein-Operationen** wirken: Bei manchen Knie-Eingriffen schnitten sie in Studien genauso gut ab wie die echte Operation.', 64), gfx: { knie: {} } },
      { t: T('Die Grenzen sind klar: Placebos heilen **keine Infektion** und lassen keinen Tumor schrumpfen. Sie verändern vor allem, wie wir Beschwerden erleben.', 64), gfx: { grenzen: {} } },
      { t: T('Darum testet man Medikamente **doppelblind** gegen Placebo: Weder Patienten noch Ärzte wissen, wer was bekommt.', 64), gfx: { doppelblind: {} } },
      { t: T('Ein Mittel muss besser wirken als das Placebo – sonst ist seine Wirkung **nur Erwartung**.', 64), gfx: { grenzen: {} } },
      { t: T('Und echte Medikamente wirken teils auch über Erwartung: Ein angekündigtes Schmerzmittel lindert **mehr** als dasselbe, heimlich gegeben.', 64), gfx: { verdeckt: {} } },
      { t: T('Erwartung ist ein **echtes Medikament** – mit klaren Grenzen.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Placebos lindern vor allem Beschwerden wie Schmerz und Übelkeit – über Erwartung und körpereigene Botenstoffe.', 'Sogar offene Placebos zeigten in Studien Wirkung; Nocebo ist das Gegenstück.', 'Sie heilen keine Infektion – darum testet man Medikamente doppelblind gegen Placebo.'],
    sources: ['Levine, Gordon & Fields 1978, The Lancet 312', 'Kaptchuk et al. 2010, PLOS ONE 5 (offene Placebos)', 'Bingel et al. 2011, Science Translational Medicine 3'],
  },
  {
    id: 'zuschauer',
    area: 'PSY',
    day: 41,
    hook: 'Warum hilft niemand, wenn alle zusehen?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [],
    draw: {
      menge(g) {
        crowd(g, 40, 300, 9, 35, 1.6, 0, 80)
        lie(g, 120, 400, 2, 'curl', 900)
      },
      zeitung(g) {
        ink(g, RR(60, 340, 240, 280, 6), { w: 3, t: 700 })
        text(g, 180, 380, '38 sahen zu', { anchor: 'middle', size: 24, d: 500 })
        for (let i = 0; i < 6; i++) ink(g, L([80, 420 + i * 28], [280, 420 + i * 28]), { w: 1.4, d: 700 + i * 80, t: 300 })
        text(g, 180, 660, 'New York Times, 1964', { anchor: 'middle', cls: 's', d: 1100 })
      },
      uebertrieben(g) {
        ink(g, RR(60, 340, 240, 280, 6), { w: 3, t: 400 })
        text(g, 180, 380, '38 sahen zu', { anchor: 'middle', size: 24, d: 200 })
        const stamp = RR(150, 480, 140, 50, 8)
        blank(g, stamp)
        hatch(g, stamp, 900)
        ink(g, stamp, { w: 3, d: 700, t: 400 })
        text(g, 220, 512, 'übertrieben', { anchor: 'middle', cls: 'halo', d: 1000 })
      },
      versuch(g) {
        ink(g, RR(40, 380, 120, 150, 10), { w: 2.8, t: 600 })
        fig(g, 100, 500, 2.4, { d: 300 })
        ink(g, RR(200, 380, 120, 150, 10), { w: 2.8, d: 200, t: 600 })
        ink(g, RR(236, 420, 48, 30, 6), { w: 2, d: 500, t: 300 })
        for (let i = 0; i < 3; i++) ink(g, E(260, 470, 12 + i * 10, 12 + i * 10, -40, 40), { w: 1.6, d: 800 + i * 150, t: 200 })
        text(g, 180, 590, 'Notfall über die Gegensprechanlage', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zahlen(g) {
        vbars(g, [
          { label: 'allein', v: 85, fmt: (v) => `${Math.round(v)} %` },
          { label: 'mit 4 anderen', v: 31, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'holten schnell Hilfe', { anchor: 'middle', cls: 's', d: 1200 })
      },
      verteilt(g) {
        crowd(g, 50, 600, 6, 52, 2.6, 0, 100)
        for (let i = 0; i < 6; i++) bubble(g, 30 + i * 52, 430 + (i % 2) * 40, 44, 30, 'l', 600 + i * 100)
        text(g, 180, 380, '„Jemand anderes macht das schon.“', { anchor: 'middle', cls: 'it', d: 1300 })
      },
      ruhig(g) {
        crowd(g, 50, 600, 6, 52, 2.6, 0, 100)
        for (let i = 0; i < 6; i++) ink(g, L([50 + i * 52 - 8, 600 - 27 * 2.6], [50 + i * 52 + 8, 600 - 27 * 2.6]), { w: 1.6, d: 800, t: 100 })
        text(g, 180, 400, 'alle ruhig → kein Notfall?', { anchor: 'middle', cls: 's', d: 1100 })
      },
      blamieren(g) {
        fig(g, 180, 600, 5)
        question(g, 270, 420, 0.8, 600)
        text(g, 180, 650, 'Angst, falschzuliegen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      videos(g) {
        for (let i = 0; i < 10; i++) {
          const x = 46 + (i % 5) * 60
          const y = 380 + Math.floor(i / 5) * 100
          ink(g, RR(x - 22, y - 30, 44, 60, 6), { w: 2, d: i * 80, t: 200 })
          if (i < 9) check(g, x, y, 0.6, 900 + i * 60)
        }
        text(g, 180, 620, 'in 9 von 10 Konflikten griff jemand ein', { anchor: 'middle', cls: 's', d: 1600 })
      },
      chat(g) {
        for (let i = 0; i < 4; i++) bubble(g, i % 2 ? 150 : 40, 340 + i * 70, 170, 46, i % 2 ? 'r' : 'l', i * 200)
        text(g, 125, 372, 'Weiß jemand …?', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 180, 650, 'große Gruppe: seltener eine Antwort', { anchor: 'middle', cls: 's', d: 1100 })
      },
      freunde(g) {
        crowd(g, 60, 600, 4, 50, 2.6, 0, 100)
        lie(g, 240, 580, 1.6, 'curl', 500)
        text(g, 180, 400, 'Freunde, klare Gefahr: mehr Hilfe', { anchor: 'middle', cls: 's', d: 1000 })
      },
      kurs(g) {
        const cr = RR(150, 380, 60, 180, 6)
        hatch(g, cr, 400, true)
        ink(g, cr, { w: 2.8, t: 500 })
        const cr2 = RR(90, 440, 180, 60, 6)
        blank(g, RR(152, 442, 56, 56, 2))
        hatch(g, cr2, 400, true)
        ink(g, [[150, 440], [90, 440], [90, 500], [150, 500]], { w: 2.8, d: 200, t: 300 })
        ink(g, [[210, 440], [270, 440], [270, 500], [210, 500]], { w: 2.8, d: 200, t: 300 })
        text(g, 180, 620, 'Notruf 112 · Erste Hilfe', { anchor: 'middle', d: 900 })
      },
      ansprechen(g) {
        fig(g, 80, 600, 3.6)
        crowd(g, 200, 600, 4, 40, 2.4, 300, 80)
        arrow(g, L([110, 470], [236, 520]), { w: 2.6, d: 900, t: 400, head: 9 })
        bubble(g, 30, 360, 200, 60, 'l', 1100)
        text(g, 130, 396, '„Sie, mit der roten Jacke!“', { anchor: 'middle', cls: 's', d: 1300 })
      },
      anfangen(g) {
        fig(g, 80, 600, 3.6, { arms: 'up' })
        crowd(g, 180, 600, 4, 40, 2.4, 600, 150)
        text(g, 180, 420, 'einer fängt an – andere folgen', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        fig(g, 180, 580, 5, { arms: 'up' })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { menge: {} } },
      { t: T('New York, 1964: Kitty Genovese wird nachts vor ihrem Haus ermordet. Eine Zeitung berichtet: **38 Nachbarn** hätten zugesehen und nichts getan.', 64), gfx: { zeitung: {} } },
      { t: T('Die Geschichte war stark **übertrieben**: Viele hörten nur Geräusche, manche riefen die Polizei. Aber sie stieß wichtige Forschung an.', 64), gfx: { uebertrieben: {} } },
      { t: T('Die Psychologen John Darley und Bibb Latané stellten 1968 einen Notfall nach: Über die Gegensprechanlage bekommt jemand einen **Anfall**.', 64), gfx: { versuch: {} } },
      { t: T('Glaubten die Teilnehmer, sie seien **allein**, holten 85 Prozent schnell Hilfe.', 64), gfx: { zahlen: {} } },
      { t: T('Glaubten sie, **vier andere** hörten mit, waren es nur 31 Prozent.', 64), gfx: { zahlen: {} } },
      { t: T('Das ist der **Zuschauereffekt**: Je mehr Menschen dabei sind, desto seltener hilft der Einzelne.', 64), gfx: { verteilt: {} } },
      { t: T('Ein Grund: Die **Verantwortung verteilt sich**. Jeder denkt, jemand anderes kümmert sich schon.', 64), gfx: { verteilt: {} } },
      { t: T('Ein zweiter: Alle schauen, wie die anderen reagieren. Bleiben alle ruhig, scheint es **kein Notfall** zu sein.', 64), gfx: { ruhig: {} } },
      { t: T('Ein dritter: die Angst, sich zu **blamieren**, falls man die Lage falsch einschätzt.', 64), gfx: { blamieren: {} } },
      { t: T('Aber: Eine Auswertung echter Überwachungsvideos aus drei Ländern fand 2019, dass in **9 von 10** Konflikten jemand eingriff.', 64), gfx: { videos: {} } },
      { t: T('Je mehr Menschen da waren, desto wahrscheinlicher half **überhaupt jemand**. Der Einzelne zögert – die Gruppe nicht.', 64), gfx: { videos: {} } },
      { t: T('Auch online: Je mehr Menschen in einem Chat sind, desto seltener bekommt eine Frage überhaupt eine **Antwort**.', 64), gfx: { chat: {} } },
      { t: T('Der Effekt schrumpft, wenn die Zuschauer sich **kennen** – oder wenn die Lage eindeutig gefährlich ist.', 64), gfx: { freunde: {} } },
      { t: T('Was dir im Notfall hilft: nicht nur „Hilfe!“ rufen, sondern **eine Person direkt ansprechen**.', 64), gfx: { ansprechen: {} } },
      { t: T('„Sie mit der roten Jacke, rufen Sie bitte den Notruf!“ – damit ist die Verantwortung **nicht mehr verteilt**.', 64), gfx: { ansprechen: {} } },
      { t: T('Und wenn du Zeuge bist: Sei die Person, die **anfängt**. Die anderen ziehen oft nach.', 64), gfx: { anfangen: {} } },
      { t: T('Ein Erste-Hilfe-Kurs hilft doppelt: Du weißt, was zu tun ist – und fühlst dich **zuständig**. Im Ernstfall: 112.', 64), gfx: { kurs: {} } },
      { t: T('In der Menge hilft, wer sich **gemeint** fühlt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Allein halfen 85 %, mit vier vermeintlichen Mithörern nur 31 % (Darley & Latané 1968).', 'Ursachen: verteilte Verantwortung, Orientierung an anderen, Angst vor Blamage.', 'Im Notfall eine Person direkt ansprechen; als Zeuge selbst anfangen.'],
    sources: ['Darley & Latané 1968, Journal of Personality and Social Psychology 8', 'Manning, Levine & Collins 2007, American Psychologist 62 (Genovese)', 'Philpot et al. 2020, American Psychologist 75'],
  },
  {
    id: 'asch',
    area: 'PSY',
    day: 41,
    hook: 'Würdest du einer falschen Antwort zustimmen, nur weil alle es tun?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [],
    draw: {
      linien(g) {
        stroke(g, 70, 360, 150, 'X')
        stroke(g, 190, 360, 100, 'A', 300)
        stroke(g, 250, 360, 150, 'B', 500)
        stroke(g, 310, 360, 190, 'C', 700)
      },
      aufgabe(g) {
        stroke(g, 70, 600, 150, 'X')
        stroke(g, 190, 600, 100, 'A', 300)
        stroke(g, 250, 600, 150, 'B', 500)
        stroke(g, 310, 600, 190, 'C', 700)
      },
      allein(g) {
        fig(g, 90, 600, 4)
        text(g, 230, 470, '„B“', { anchor: 'middle', size: 40, d: 500 })
        check(g, 230, 540, 1.2, 900)
        text(g, 180, 650, 'allein: fast immer richtig', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gruppe(g) {
        crowd(g, 30, 600, 7, 40, 2.4, 0, 100)
        fig(g, 310, 600, 2.4, { d: 800 })
        for (let i = 0; i < 7; i++) text(g, 30 + i * 40, 500, 'A', { anchor: 'middle', d: 900 + i * 120 })
        text(g, 310, 500, '?', { anchor: 'middle', size: 20, d: 1900 })
      },
      drittel(g) {
        pie(g, 180, 460, 110, 0.33)
        text(g, 180, 620, 'ein Drittel der Antworten: falsche Mehrheit', { anchor: 'middle', cls: 's', d: 1100 })
      },
      dreiviertel(g) {
        pie(g, 180, 460, 110, 0.75)
        text(g, 180, 620, 'drei Viertel gaben mindestens einmal nach', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zweifel(g) {
        eye(g, 120, 470, 1.4)
        question(g, 260, 500, 1.2, 600)
      },
      verbuendet(g) {
        crowd(g, 30, 600, 6, 40, 2.4, 0, 100)
        fig(g, 270, 600, 2.4, { d: 700 })
        fig(g, 310, 600, 2.4, { d: 800 })
        for (let i = 0; i < 6; i++) text(g, 30 + i * 40, 500, 'A', { anchor: 'middle', d: 900 + i * 80 })
        text(g, 270, 500, 'B', { anchor: 'middle', d: 1500 })
        text(g, 310, 500, 'B', { anchor: 'middle', d: 1700 })
      },
      schreiben(g) {
        ink(g, RR(100, 380, 160, 200, 6), { w: 3, t: 700 })
        for (let i = 0; i < 4; i++) ink(g, L([120, 420 + i * 36], [240, 420 + i * 36]), { w: 1.4, d: 400 + i * 80, t: 300 })
        text(g, 180, 540, 'B', { anchor: 'middle', size: 34, d: 900 })
        text(g, 180, 630, 'geheim: kaum Anpassung', { anchor: 'middle', cls: 's', d: 1100 })
      },
      drei(g) {
        vbars(g, [
          { label: '1 Person', v: 3, fmt: () => 'kaum' },
          { label: '3 Personen', v: 32, fmt: () => 'voll' },
          { label: '15 Personen', v: 31, fmt: () => 'nicht mehr', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'Druck der einstimmigen Gruppe', { anchor: 'middle', cls: 's', d: 1300 })
      },
      likes(g) {
        for (let i = 0; i < 5; i++) {
          heart(g, 60 + i * 60, 470, 0.7, i * 200)
        }
        text(g, 180, 580, 'ein frühes Like zieht weitere nach', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kulturen(g) {
        vbars(g, [
          { label: 'individualistisch', v: 25, fmt: () => 'weniger' },
          { label: 'kollektivistisch', v: 37, fmt: () => 'mehr', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'Anpassung im Schnitt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kinder(g) {
        crowd(g, 40, 600, 3, 40, 2.2, 0, 100)
        fig(g, 260, 600, 1.6, { d: 500 })
        text(g, 180, 440, 'Vierjährige folgen der Mehrheit', { anchor: 'middle', cls: 's', d: 900 })
      },
      gut(g) {
        crowd(g, 60, 600, 6, 48, 2.6, 0, 100)
        text(g, 180, 420, 'Regeln lernen, gemeinsam handeln', { anchor: 'middle', cls: 's', d: 900 })
      },
      ende(g) {
        crowd(g, 50, 600, 5, 50, 2.6, 0, 100)
        fig(g, 310, 600, 2.6, { d: 600, arms: 'up' })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { linien: {} } },
      { t: T('1951 zeigte der Psychologe Solomon Asch Studenten eine Linie – und drei weitere. Welche ist **gleich lang** wie die erste?', 64), gfx: { aufgabe: {} } },
      { t: T('Die Aufgabe ist kinderleicht: Allein lagen fast alle **richtig**.', 64), gfx: { allein: {} } },
      { t: T('Doch im Raum saßen sieben andere – alle heimlich **eingeweiht**. Sie nannten laut, einer nach dem anderen, dieselbe falsche Antwort.', 64), gfx: { gruppe: {} } },
      { t: T('Die echte Versuchsperson kam **als Vorletzte** dran. Was würdest du sagen?', 64), gfx: { gruppe: {} } },
      { t: T('Rund **ein Drittel** der Antworten folgte der offensichtlich falschen Mehrheit.', 64), gfx: { drittel: {} } },
      { t: T('Und drei Viertel der Teilnehmer gaben **mindestens einmal** nach.', 64), gfx: { dreiviertel: {} } },
      { t: T('Manche sagten später, sie hätten an ihren **Augen gezweifelt**. Andere wollten einfach nicht aus der Reihe tanzen.', 64), gfx: { zweifel: {} } },
      { t: T('Das ist **Konformität**: Wir passen uns der Gruppe an – aus Unsicherheit oder um dazuzugehören.', 64), gfx: { gruppe: {} } },
      { t: T('Der Gegenzauber war **ein einziger Verbündeter**: Antwortete nur einer der anderen richtig, sank die Anpassung drastisch.', 64), gfx: { verbuendet: {} } },
      { t: T('Und wer seine Antwort **aufschreiben** durfte, statt sie laut zu sagen, gab viel seltener nach.', 64), gfx: { schreiben: {} } },
      { t: T('Die Gruppengröße zählt: Schon **drei** einstimmige Gegenüber reichten für den vollen Effekt – mehr brachte kaum noch etwas.', 64), gfx: { drei: {} } },
      { t: T('Heute zeigt sich das bei Likes und Bewertungen: In einem Versuch zog ein früh gesetztes **positives** Votum weitere positive nach.', 64), gfx: { likes: {} } },
      { t: T('Der Versuch wurde weltweit wiederholt. In Kulturen, die die **Gemeinschaft** betonen, passten sich Menschen im Schnitt stärker an.', 64), gfx: { kulturen: {} } },
      { t: T('In den USA nahm die Anpassung seit den 1950er-Jahren **ab** – die Zeiten prägen mit.', 64), gfx: { kulturen: {} } },
      { t: T('Schon **Vierjährige** schließen sich in Versuchen einer Mehrheit an – auch wenn sie es eigentlich besser wissen.', 64), gfx: { kinder: {} } },
      { t: T('Konformität ist nicht nur schlecht: Sie hilft, Regeln zu lernen und **gemeinsam** zu handeln.', 64), gfx: { gut: {} } },
      { t: T('Aber wenn du Zweifel hast: Sprich sie aus. Vielleicht bist du der **Verbündete**, auf den andere warten.', 64), gfx: { verbuendet: {} } },
      { t: T('Eine einzige Gegenstimme **befreit** alle.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei einer leichten Aufgabe folgte rund ein Drittel der Antworten einer falschen Mehrheit.', 'Ein einziger Verbündeter oder geheime Antworten senkten die Anpassung stark.', 'Konformität hilft beim Zusammenleben – Widerspruch hilft anderen, ehrlich zu sein.'],
    sources: ['Asch 1951/1956, Psychological Monographs 70', 'Bond & Smith 1996, Psychological Bulletin 119', 'Muchnik, Aral & Taylor 2013, Science 341'],
  },
  {
    id: 'cocktailparty',
    area: 'PSY',
    day: 63,
    hook: 'Wie hörst du in einem lauten Raum deinen Namen heraus?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [],
    draw: {
      party(g) {
        crowd(g, 40, 400, 8, 40, 2.2, 0, 80)
        for (let i = 0; i < 4; i++) bubble(g, 30 + i * 80, 150 + (i % 2) * 60, 60, 36, i % 2 ? 'r' : 'l', 600 + i * 150)
      },
      zuhoeren(g) {
        fig(g, 70, 600, 3.6)
        fig(g, 180, 600, 3.6, { d: 200 })
        for (let i = 0; i < 3; i++) ink(g, E(150, 498, 12 + i * 10, 12 + i * 10, 160, 200), { w: 2, d: 700 + i * 120, t: 200 })
        crowd(g, 250, 600, 3, 30, 1.8, 400, 80)
        for (const [x, y] of [[260, 470], [300, 450], [320, 490]] as const) ink(g, waveP(x - 12, x + 12, y, 3, 8), { w: 1.2, d: 900, t: 200 })
      },
      cherry(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.25, label: '1953', sub: 'Colin Cherry, London', up: true },
          { at: 0.85, label: 'heute', up: true },
        ])
      },
      hinweise(g) {
        bullets(g, 50, 380, ['Richtung der Stimme', 'Tonhöhe und Klang', 'Lippenbewegungen', 'Sinn des Satzes'], { gap: 50, size: 19 })
      },
      ohren(g) {
        ball(g, 180, 460, 70, { w: 3 })
        for (const k of [-1, 1]) ink(g, E(180 + k * 74, 460, 10, 20), { w: 2.6, d: 400, t: 300 })
        arrow(g, L([340, 380], [262, 450]), { w: 2.4, d: 700, t: 400, head: 9 })
        text(g, 180, 600, 'rechts minimal früher', { anchor: 'middle', cls: 's', d: 1000 })
      },
      kopfhoerer(g) {
        ball(g, 180, 460, 60, { w: 3 })
        ink(g, B([110, 450], [110, 360], [250, 360], [250, 450]), { w: 3, d: 300, t: 500 })
        for (const k of [-1, 1]) ink(g, RR(180 + k * 70 - 12, 430, 24, 50, 8), { w: 2.6, d: 500, t: 300 })
        text(g, 60, 560, 'Text 1', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 300, 560, 'Text 2', { anchor: 'middle', cls: 's', d: 900 })
      },
      name(g) {
        ball(g, 180, 460, 60, { w: 3 })
        for (const k of [-1, 1]) ink(g, RR(180 + k * 70 - 12, 430, 24, 50, 8), { w: 2.6, d: 200, t: 300 })
        bubble(g, 220, 330, 120, 50, 'l', 600)
        text(g, 280, 362, '… dein Name …', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 180, 580, 'eigener Name: man horcht auf', { anchor: 'middle', cls: 's', d: 1100 })
      },
      filter(g) {
        ink(g, [[60, 360], [300, 360], [200, 480], [200, 560], [160, 560], [160, 480], [60, 360]], { w: 3, t: 900 })
        for (let i = 0; i < 8; i++) ink(g, waveP(70 + i * 28, 90 + i * 28, 330, 3, 8), { w: 1.4, d: 300 + i * 50, t: 150 })
        text(g, 180, 600, 'nach Bedeutung gefiltert', { anchor: 'middle', cls: 's', d: 1200 })
      },
      alter(g) {
        fig(g, 110, 600, 4)
        ink(g, B([92, 470], [80, 470], [80, 490], [92, 490]), { w: 2, d: 500, t: 200 })
        for (let i = 0; i < 4; i++) bubble(g, 170 + (i % 2) * 80, 360 + Math.floor(i / 2) * 70, 60, 36, 'l', 700 + i * 100)
        text(g, 180, 650, 'mit dem Alter anstrengender', { anchor: 'middle', cls: 's', d: 1200 })
      },
      stimme(g) {
        ink(g, waveP(30, 330, 400, 26, 60), { w: 3, t: 900 })
        ink(g, waveP(30, 330, 520, 10, 34), { w: 1.6, d: 400, t: 900 })
        text(g, 30, 360, 'gesuchte Stimme', { cls: 's', d: 600 })
        text(g, 30, 580, 'die anderen', { cls: 's', d: 800 })
        text(g, 180, 640, 'Hirnaktivität folgt der gesuchten Stimme', { anchor: 'middle', cls: 's', d: 1200 })
      },
      vertraut(g) {
        fig(g, 90, 600, 3.6)
        fig(g, 180, 600, 3.6, { d: 200 })
        heart(g, 135, 420, 0.6, 600)
        text(g, 180, 650, 'vertraute Stimmen hört man leichter heraus', { anchor: 'middle', cls: 's', d: 1000 })
      },
      lippen(g) {
        eye(g, 120, 420, 1)
        eye(g, 240, 420, 1, 200)
        const m: P[] = [...B([120, 540], [150, 510], [210, 510], [240, 540]), ...B([240, 540], [210, 580], [150, 580], [120, 540]).slice(1)]
        ink(g, m, { w: 3, d: 500, t: 600 })
        text(g, 180, 630, 'Hinschauen hilft beim Verstehen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      baby(g) {
        ball(g, 180, 470, 80, { w: 3 })
        for (const x of [150, 210]) dot(g, x, 460, 5, 500)
        ink(g, B([160, 500], [172, 512], [188, 512], [200, 500]), { w: 2.2, d: 600, t: 200 })
        text(g, 180, 600, 'Babys: erkennen ihren Namen früh', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        ball(g, 180, 480, 60, { w: 3 })
        for (const k of [-1, 1]) ink(g, E(180 + k * 64, 480, 9, 18), { w: 2.6, d: 400, t: 300 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { party: {} } },
      { t: T('Auf einer Party reden alle durcheinander. Trotzdem kannst du **einer Person** zuhören und den Rest ausblenden.', 64), gfx: { zuhoeren: {} } },
      { t: T('Das ist der **Cocktailparty-Effekt** – benannt 1953 vom britischen Forscher Colin Cherry.', 64), gfx: { cherry: {} } },
      { t: T('Dein Gehirn nutzt dafür viele **Hinweise** gleichzeitig.', 64), gfx: { hinweise: {} } },
      { t: T('Zwei Ohren helfen: Der Schall erreicht ein Ohr **minimal früher** – Bruchteile einer Millisekunde. Daraus berechnet das Gehirn die Richtung.', 64), gfx: { ohren: {} } },
      { t: T('Cherry spielte Leuten über Kopfhörer zwei Texte gleichzeitig vor, einen pro Ohr. Sie sollten **einen** davon laut nachsprechen.', 64), gfx: { kopfhoerer: {} } },
      { t: T('Vom anderen Ohr bekamen sie fast nichts mit – nicht einmal, wenn dort plötzlich eine **andere Sprache** lief.', 64), gfx: { kopfhoerer: {} } },
      { t: T('Aber: Fiel auf dem ignorierten Ohr der **eigene Name**, horchten viele plötzlich auf.', 64), gfx: { name: {} } },
      { t: T('Das Gehirn hört also im Hintergrund doch zu – und filtert nach **Bedeutung**. Wichtiges darf durch.', 64), gfx: { filter: {} } },
      { t: T('Babys erkennen ihren Namen schon mit wenigen Monaten. Im Stimmengewirr brauchen sie ihn aber **deutlich lauter** als Erwachsene.', 64), gfx: { baby: {} } },
      { t: T('Hirnmessungen zeigen: Die Aktivität im Hörzentrum folgt dem Rhythmus der **Stimme**, der du zuhörst – die anderen werden gedämpft.', 64), gfx: { stimme: {} } },
      { t: T('Vertraute Stimmen, etwa die des Partners, lassen sich **leichter** heraushören. Zwei ähnliche Stimmen verwechselt das Gehirn eher.', 64), gfx: { vertraut: {} } },
      { t: T('Mit dem Alter oder bei Hörverlust wird das Filtern schwerer: Gespräche in vollen Räumen werden **anstrengend**.', 64), gfx: { alter: {} } },
      { t: T('Hörgeräte versuchen, den Effekt nachzubauen – mit Mikrofonen, die vor allem **nach vorn** hören.', 64), gfx: { ohren: {} } },
      { t: T('Computer scheiterten lange daran, Stimmen zu **trennen**. Moderne KI schafft es inzwischen immer besser.', 64), gfx: { hinweise: {} } },
      { t: T('Viele Restaurants sind laut, weil **harte Flächen** den Schall zurückwerfen. Teppiche, Vorhänge und Polster schlucken ihn.', 480), gfx: { party: {} } },
      { t: T('Ein Tipp für laute Räume: **Hinschauen**. Wer die Lippen sieht, versteht messbar mehr.', 64), gfx: { lippen: {} } },
      { t: T('Dein Gehirn ist ein **Filter**, der deinen Namen nie ganz ausblendet.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Das Gehirn trennt Stimmen nach Richtung, Klang, Lippenbewegung und Sinn.', 'Ignorierte Gespräche werden trotzdem grob mitverarbeitet – der eigene Name dringt durch.', 'Hinschauen hilft im Lärm; Alter und Hörverlust erschweren das Filtern.'],
    sources: ['Cherry 1953, Journal of the Acoustical Society of America 25', 'Moray 1959, Quarterly Journal of Experimental Psychology 11', 'Newman 2005, Developmental Psychology 41'],
  },
  {
    id: 'zeit-alter',
    area: 'PSY',
    day: 55,
    hook: 'Warum vergeht die Zeit im Alter immer schneller?',
    mood: 'ruhig',
    ambience: 'uhr',
    images: [],
    draw: {
      uhr(g) {
        clock(g, 180, 250, 120, 300, 60)
      },
      ferien(g) {
        sun(g, 260, 360, 30)
        fig(g, 110, 600, 3, { arms: 'up' })
        for (const [y, d] of [[560, 400], [600, 500]] as const) ink(g, waveP(20, 340, y, 5, 50), { w: 2.2, d, t: 700 })
        text(g, 180, 650, 'damals: eine Ewigkeit', { anchor: 'middle', cls: 's', d: 1100 })
      },
      anteil(g) {
        vbars(g, [
          { label: 'mit 5 Jahren', v: 20, fmt: (v) => `${Math.round(v)} %` },
          { label: 'mit 50 Jahren', v: 2, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'ein Jahr als Anteil des Lebens', { anchor: 'middle', cls: 's', d: 1200 })
      },
      neues(g) {
        bullets(g, 50, 380, ['erster Schultag', 'erstes Mal am Meer', 'erstes Fahrrad', 'erster Schnee'], { gap: 50, size: 19 })
      },
      erinnerung(g) {
        for (let i = 0; i < 14; i++) dot(g, 40 + i * 21, 420 + (i % 3) * 14, 5, i * 60)
        text(g, 180, 380, 'viele Erinnerungen: lang', { anchor: 'middle', cls: 's', d: 300 })
        for (let i = 0; i < 3; i++) dot(g, 120 + i * 60, 560, 5, 1100 + i * 100)
        text(g, 180, 520, 'wenige Erinnerungen: kurz', { anchor: 'middle', cls: 's', d: 1000 })
      },
      routine(g) {
        for (let i = 0; i < 5; i++) {
          const x = 40 + i * 62
          ink(g, RR(x, 420, 50, 80, 6), { w: 2.2, d: i * 150, t: 300 })
          ink(g, L([x + 10, 450], [x + 40, 450]), { w: 1.6, d: i * 150 + 200, t: 100 })
          ink(g, L([x + 10, 470], [x + 40, 470]), { w: 1.6, d: i * 150 + 250, t: 100 })
        }
        text(g, 180, 560, 'gleiche Tage verschmelzen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      urlaub(g) {
        for (const [x0, n, a, b, d] of [[30, 'Urlaub', 'im Moment: schnell', 'im Rückblick: lang', 0], [190, 'Wartezimmer', 'im Moment: zäh', 'im Rückblick: kurz', 600]] as const) {
          ink(g, RR(x0, 380, 140, 160, 12), { w: 2.6, d, t: 500 })
          text(g, x0 + 70, 420, n, { anchor: 'middle', d: d + 200 })
          text(g, x0 + 70, 470, a, { anchor: 'middle', cls: 's', d: d + 300 })
          text(g, x0 + 70, 500, b, { anchor: 'middle', cls: 's', d: d + 400 })
        }
      },
      takt(g) {
        brain(g, 180, 440, 1)
        for (let i = 0; i < 6; i++) ink(g, RR(60 + i * 42, 560, 30, 40, 4), { w: 1.8, d: 900 + i * 80, t: 150 })
        text(g, 180, 640, 'Hypothese: weniger „Bilder“ pro Sekunde', { anchor: 'middle', cls: 's', d: 1400 })
      },
      fall(g) {
        ink(g, L([60, 330], [60, 620]), { w: 2.6, t: 600 })
        ink(g, L([40, 330], [120, 330]), { w: 2.6, d: 200, t: 300 })
        fig(g, 200, 450, 3, { arms: 'up', d: 400 })
        arrow(g, L([260, 380], [260, 520]), { w: 2.6, d: 700, t: 400, head: 9 })
        text(g, 180, 650, 'Schreck: dichtere Erinnerung, nicht schnelleres Sehen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      huegel(g) {
        axes(g, 30, 600, 330, 330, { xl: 'Alter', yl: 'Erinnerungen' })
        plot(g, 36, 596, 280, 220, (t) => 0.2 + 0.7 * Math.exp(-Math.pow((t - 0.3) / 0.12, 2)), { d: 400 })
        text(g, 120, 380, '15 bis 25', { anchor: 'middle', cls: 's', d: 1300 })
      },
      gegen(g) {
        bullets(g, 50, 380, ['neue Orte', 'neue Hobbys', 'neue Menschen', 'anderer Weg zur Arbeit'], { gap: 50, size: 19 })
      },
      tagebuch(g) {
        ink(g, RR(100, 360, 160, 220, 8), { w: 3, t: 700 })
        ink(g, L([120, 360], [120, 580]), { w: 2, d: 300, t: 400 })
        for (let i = 0; i < 6; i++) ink(g, L([136, 400 + i * 28], [240, 400 + i * 28]), { w: 1.4, d: 500 + i * 80, t: 200 })
        text(g, 180, 630, 'mehr Erinnerungen, vollere Monate', { anchor: 'middle', cls: 's', d: 1100 })
      },
      achtsam(g) {
        eye(g, 180, 460, 2.2)
        text(g, 180, 600, 'bewusst wahrnehmen: mehr Details', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        clock(g, 180, 500, 80, 120, 300)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { uhr: {} } },
      { t: T('Als Kind dauerten Sommerferien eine **Ewigkeit**. Heute ist plötzlich schon wieder Dezember.', 64), gfx: { ferien: {} } },
      { t: T('Fast alle Erwachsenen erleben das. Die Forschung hat dafür mehrere **Erklärungen**.', 64), gfx: { uhr: { tf: [0.6, 72, 250] } } },
      { t: T('Erstens: der **Anteil**. Für ein fünfjähriges Kind ist ein Jahr ein Fünftel seines Lebens – für einen Fünfzigjährigen nur ein Fünfzigstel.', 64), gfx: { anteil: {} } },
      { t: T('Zweitens: **Neues**. Kinder erleben ständig etwas zum ersten Mal – und das Gehirn speichert Erstes besonders gut.', 64), gfx: { neues: {} } },
      { t: T('Im Rückblick schätzen wir Zeit nach der **Menge an Erinnerungen**. Viele Erinnerungen – die Zeit wirkt lang.', 64), gfx: { erinnerung: {} } },
      { t: T('Erwachsene leben mehr in **Routine**. Die Tage ähneln sich – und das Gedächtnis fasst sie zu wenigen Erinnerungen zusammen.', 64), gfx: { routine: {} } },
      { t: T('Das erklärt das **Urlaubsparadox**: Eine Woche voller Neuem vergeht im Moment schnell, wirkt im Rückblick aber lang.', 64), gfx: { urlaub: {} } },
      { t: T('Umgekehrt zieht sich ein langweiliger Tag endlos – und schrumpft in der Erinnerung **fast auf nichts**.', 64), gfx: { urlaub: {} } },
      { t: T('In Gefahr scheint die Zeit stillzustehen. Versuche beim freien Fall zeigten aber: Wir sehen nicht schneller – wir erinnern uns **dichter**.', 64), gfx: { fall: {} } },
      { t: T('Die Jahre zwischen 15 und 25 nehmen im Gedächtnis besonders viel Raum ein – Forscher sprechen vom **Erinnerungshügel**.', 64), gfx: { huegel: {} } },
      { t: T('Drittens, eher eine Vermutung: Das Gehirn verarbeitet mit den Jahren womöglich **weniger Eindrücke** pro Sekunde.', 64), gfx: { takt: {} } },
      { t: T('Befragt man Menschen, rasen vor allem die **Jahre**. Wie schnell eine einzelne Stunde vergeht, empfinden Junge und Alte ähnlich.', 64), gfx: { uhr: { tf: [0.6, 72, 250] } } },
      { t: T('Was lässt sich tun? Neues erleben: Neue Orte, neue Hobbys, neue Menschen füllen das **Gedächtnis**.', 64), gfx: { gegen: {} } },
      { t: T('Schon kleine Abweichungen helfen: **ein anderer Weg** zur Arbeit, ein neues Rezept, ein freier Tag ohne Plan.', 64), gfx: { gegen: {} } },
      { t: T('Auch Aufschreiben hilft: Wer **Tagebuch** führt, erinnert sich an mehr – die Monate wirken voller.', 64), gfx: { tagebuch: {} } },
      { t: T('Und bewusstes Wahrnehmen: Wer genau hinschaut, speichert **mehr Details**.', 64), gfx: { achtsam: {} } },
      { t: T('Zeit wird lang durch **Erinnerungen** – nicht durch Stunden.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein Jahr ist für Kinder ein viel größerer Teil des Lebens.', 'Im Rückblick messen wir Zeit an der Zahl der Erinnerungen – Routine verkürzt, Neues verlängert.', 'Neues erleben, Tagebuch, bewusstes Wahrnehmen lassen Zeit voller wirken.'],
    sources: ['Wittmann & Lehnhoff 2005, Psychological Reports 97', 'Friedman & Janssen 2010, Acta Psychologica 134', 'Bejan 2019, European Review 27 (Hypothese)'],
  },
]
