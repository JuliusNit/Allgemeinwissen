import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, bolt, brain, bulb, check, clock, cross, dashes, eye, fig, group, hatch, hbars, ink, lie, mk, pop, question, rays, st, text, timeline, vbars, type P } from './draw'
import { arcArrow, axes, ball, dot, drop, eyeFront, flame, flow, glide, ground, heart, house, leaf, moonFace, plot, rad, smooth, spin, stars, sun, thermo, tree, waveP, wobble } from './kit'

// Nervensystem & Sinne: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Augapfel im Schnitt (Licht von links): Hornhaut, Iris, Linse, Netzhaut mit Sehgrube, Sehnerv nach rechts unten */
function eyeball(g: Element, cx: number, cy: number, r: number, d = 0): void {
  blank(g, E(cx, cy, r))
  ink(g, E(cx, cy, r, r, 20, 330), { w: 3, d, t: 900 })
  // Hornhaut als Wölbung vorn
  ink(g, E(cx - r + 4, cy, 18, r * 0.42, 100, 260), { w: 2.2, d: d + 300, t: 300 })
  // Iris oben und unten, dazwischen die Pupille
  for (const s of [-1, 1]) ink(g, L([cx - r + 14, cy + s * r * 0.42], [cx - r + 14, cy + s * r * 0.16]), { w: 3, d: d + 400, t: 200 })
  const lensP = E(cx - r + 30, cy, 12, r * 0.36)
  blank(g, lensP)
  hatch(g, lensP, d + 700)
  ink(g, lensP, { w: 2.2, d: d + 500, t: 400 })
  // Netzhaut innen, Aderhaut dazwischen
  ink(g, E(cx, cy, r - 8, r - 8, 40, 320), { w: 1.4, d: d + 600, t: 700 })
  hatch(g, [...E(cx, cy, r, r, 40, 320), ...E(cx, cy, r - 8, r - 8, 320, 40)], d + 900, true)
  // Sehgrube gegenüber der Linse (kleine Delle)
  ink(g, E(cx + r - 8, cy, 5, 6, 90, 270), { w: 1.2, d: d + 900, t: 150 })
  const a = rad(20)
  const p0: P = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  ink(g, L(p0, [cx + r + 60, cy + Math.sin(a) * r + 16]), { w: 3, d: d + 800, t: 300 })
  ink(g, L([p0[0] - 4, p0[1] + 12], [cx + r + 56, cy + Math.sin(a) * r + 30]), { w: 3, d: d + 800, t: 300 })
}

/** Rezeptor-Mulde (U-Form) mit Öffnung nach oben */
function slot(g: Element, x: number, y: number, d = 0): void {
  ink(g, [[x - 18, y - 22], [x - 18, y], [x + 18, y], [x + 18, y - 22]], { w: 2.4, d, t: 300 })
}

/** Chilischote */
function chili(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const o = [...B(P(-80, -10), P(-40, -40), P(40, -30), P(90, 30)), ...B(P(90, 30), P(40, 0), P(-30, 10), P(-80, 6)).slice(1), ...B(P(-80, 6), P(-90, 4), P(-90, -8), P(-80, -10)).slice(1)]
  blank(g, o)
  hatch(g, o, d + 600, true)
  ink(g, o, { w: 2.8, d, t: 800 })
  ink(g, B(P(-84, -2), P(-100, -6), P(-104, -20), P(-96, -34)), { w: 2.6, d: d + 500, t: 300 })
}

/** Spektrum-Band (x0…x1 bei y), Beschriftung der Enden */
function spectrum(g: Element, x0: number, x1: number, y: number, d = 0): void {
  const h = 40
  ink(g, RR(x0, y, x1 - x0, h, 6), { w: 2.6, d, t: 600 })
  const n = 6
  for (let i = 1; i < n; i++) ink(g, L([x0 + ((x1 - x0) * i) / n, y + 2], [x0 + ((x1 - x0) * i) / n, y + h - 2]), { w: 1.2, d: d + 300 + i * 50, t: 150 })
  ;['Violett', 'Blau', 'Grün', 'Gelb', 'Orange', 'Rot'].forEach((c, i) => text(g, x0 + ((x1 - x0) * (i + 0.5)) / n, y + h + 18, c, { anchor: 'middle', cls: 's', d: d + 500 + i * 60 }))
}

/** Bogengang im Schnitt: Ring mit Flüssigkeit und Klappe (Cupula) oben */
function canal(g: Element, cx: number, cy: number, d = 0): void {
  hatch(g, [...E(cx, cy, 110), ...E(cx, cy, 80, 80, 360, 0)], d + 600)
  ink(g, E(cx, cy, 110), { w: 3, d, t: 900 })
  ink(g, E(cx, cy, 80), { w: 3, d: d + 200, t: 900 })
}

/** Schneeflocke: sechs Speichen vom Mittelpunkt */
function snowflake(g: Element, cx: number, cy: number, r: number, d = 0): void {
  for (let k = 0; k < 6; k++) {
    const a = rad(k * 60 - 90)
    ink(g, L([cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]), { w: 2.2, d: d + k * 60, t: 150 })
    const m: P = [cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6]
    for (const s of [-1, 1]) ink(g, L(m, [m[0] + Math.cos(a + s * 0.8) * r * 0.3, m[1] + Math.sin(a + s * 0.8) * r * 0.3]), { w: 1.6, d: d + 300 + k * 60, t: 100 })
  }
}

export const AHA_NERVEN: Bite[] = [
  {
    id: 'blinder-fleck',
    area: 'NERV',
    day: 4,
    hook: 'Du hast ein Loch im Blickfeld – und merkst es nicht.',
    mood: 'raetsel',
    ambience: 'atem',
    images: [],
    draw: {
      test(g) {
        ink(g, L([60, 250], [100, 250]), { w: 4, t: 200 })
        ink(g, L([80, 230], [80, 270]), { w: 4, d: 150, t: 200 })
        const p = st(g, 'h1', '--dl: 1200ms')
        ball(p, 280, 250, 16, { fill: 'dicht', t: 300, d: 400 })
      },
      test2(g) {
        // Testkarte: Kreuz links, Punkt rechts; ein Auge ist zugehalten
        ink(g, RR(30, 400, 300, 90, 8), { w: 1.6, t: 500 })
        ink(g, L([50, 445], [90, 445]), { w: 4, d: 200, t: 200 })
        ink(g, L([70, 425], [70, 465]), { w: 4, d: 350, t: 200 })
        const p = st(g, 'h1', '--dl: 1500ms')
        ball(p, 290, 445, 16, { fill: 'dicht', t: 300, d: 400 })
        const f = st(g, 'f1', '--dl: 1800ms')
        dashes(f, E(290, 445, 18), { w: 1.4, t: 0, dash: 4, gap: 4 })
        // Gesicht von oben mit Hand vor dem linken Auge, Blickrichtung zum Kreuz
        ink(g, E(120, 600, 30, 34), { w: 2.4, d: 600, t: 400 })
        hatch(g, RR(84, 566, 30, 18, 8), 900, true)
        ink(g, RR(84, 566, 30, 18, 8), { w: 1.8, d: 800, t: 200 })
        dashes(g, L([132, 570], [74, 470]), { w: 1.2, d: 1000, dash: 4, gap: 4 })
        const mv = wobble(g, { dy: -20, ms: 3000, d: 1200 })
        arrow(mv, L([200, 600], [200, 560]), { w: 1.6, t: 200, d: 1200, head: 6 })
        arrow(mv, L([200, 560], [200, 600]), { w: 1.6, t: 200, d: 1200, head: 6 })
      },
      auge(g) {
        eyeball(g, 160, 470, 110)
        for (const dy of [-14, 0, 14]) {
          const p = L([16, 470 + dy], [200, 470 - dy * 0.3 + 30])
          ink(g, p, { w: 1.2, d: 300, t: 400 })
          flow(g, p, { n: 1, ms: 1200, d: 800, r: 2 })
        }
        text(g, 300, 610, 'Sehnerv', { anchor: 'middle', cls: 's', d: 1100 })
        const spot = st(g, 'x1', '--o: 262px 508px')
        ball(spot, 262, 508, 10, { fill: 'dicht', t: 0 })
        text(spot, 180, 640, 'blinder Fleck', { anchor: 'middle', cls: 's', fade: false })
      },
      zellen(g) {
        // Stäbchen (lange Stäbe mit gestapelten Scheibchen) und Zapfen (kegelförmig)
        for (let i = 0; i < 9; i++) {
          const x = 44 + i * 34
          if (i % 3 === 1) {
            const c: P[] = [[x - 11, 560], [x - 4, 470], [x + 4, 470], [x + 11, 560], [x - 11, 560]]
            blank(g, c)
            hatch(g, c, 600 + i * 80, true)
            ink(g, c, { w: 2.2, d: i * 80, t: 300 })
          } else {
            ink(g, RR(x - 6, 430, 12, 130, 6), { w: 2.2, d: i * 80, t: 300 })
            for (let k = 0; k < 8; k++) ink(g, L([x - 4, 440 + k * 8], [x + 4, 440 + k * 8]), { w: 0.8, d: 400 + i * 80, t: 60 })
          }
          ink(g, L([x, 560], [x, 590]), { w: 1.2, d: 600 + i * 60, t: 100 })
          dot(g, x, 594, 3, 700 + i * 60)
        }
        text(g, 100, 630, 'Stäbchen', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 270, 630, 'Zapfen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      verkabelt(g) {
        sun(g, 50, 320, 12, 0, 8)
        for (const x of [130, 180, 230]) {
          const p = L([x, 300], [x, 480])
          arrow(g, p, { w: 1.8, d: 200, t: 400, head: 7 })
          flow(g, p, { n: 2, ms: 1000, d: 700, r: 2 })
        }
        for (let k = 0; k < 4; k++) ink(g, B([30, 390 + k * 14], [120, 384 + k * 14], [240, 396 + k * 14], [330, 390 + k * 14]), { w: 1.6, d: 400 + k * 100, t: 600 })
        for (let i = 0; i < 6; i++) ball(g, 50 + i * 52, 452, 6, { d: 700 + i * 60, fill: 'hell', w: 1.4, t: 0 })
        for (let i = 0; i < 9; i++) {
          ink(g, RR(34 + i * 34, 490, 12, 80, 6), { w: 2.2, d: 1000 + i * 60, t: 200 })
          ink(g, L([40 + i * 34, 488], [40 + i * 34, 460]), { w: 0.8, d: 1100 + i * 60, t: 100 })
        }
        hatch(g, RR(30, 576, 300, 24, 4), 1500, true)
        ink(g, RR(30, 576, 300, 24, 4), { w: 1.6, d: 1400, t: 300 })
      },
      monde(g) {
        // Nachthimmel: zehn Vollmonde nebeneinander füllen genau die Breite des blinden Flecks
        stars(g, 20, 340, 320, 260, 26, 0, (_x, y) => Math.abs(y - 470) < 30)
        for (let i = 0; i < 10; i++) {
          const x = 36 + i * 32
          moonFace(g, x, 470, 14, i * 100)
        }
        dashes(g, RR(18, 446, 324, 48, 22), { w: 1.4, d: 1300, dash: 6, gap: 5 })
      },
      zwei(g) {
        const field = (cx: number, hole: number | null, d: number) => {
          ink(g, E(cx, 470, 46, 40), { w: 2.4, d, t: 500 })
          for (let k = 0; k < 4; k++) ink(g, L([cx - 40, 452 + k * 12], [cx + 40, 452 + k * 12]), { w: 0.8, d: d + 200, t: 200 })
          if (hole != null) {
            blank(g, E(cx + hole, 470, 9))
            hatch(g, E(cx + hole, 470, 8), d + 400, true)
          }
        }
        field(60, 22, 0)
        eyeFront(g, 60, 380, 0.3, 200)
        field(170, -22, 400)
        eyeFront(g, 170, 380, 0.3, 500)
        text(g, 228, 476, '=', { anchor: 'middle', size: 24, d: 900 })
        field(290, null, 1000)
      },
      fuellen(g) {
        for (let k = 0; k < 6; k++) {
          const y = 400 + k * 26
          const gap = Math.abs(y - 465) < 30
          if (gap) {
            ink(g, L([30, y], [70, y]), { w: 2, d: k * 80, t: 200 })
            ink(g, L([120, y], [150, y]), { w: 2, d: k * 80, t: 200 })
          } else ink(g, L([30, y], [150, y]), { w: 2, d: k * 80, t: 300 })
          ink(g, L([210, y], [330, y]), { w: 2, d: 800 + k * 80, t: 300 })
        }
        dashes(g, E(95, 465, 26, 30), { w: 1.2, d: 600, dash: 4, gap: 4 })
        arrow(g, L([164, 466], [196, 466]), { w: 2.4, d: 1000, t: 300, head: 9 })
        brain(g, 180, 600, 0.35, 1100)
      },
      linie(g) {
        ink(g, L([50, 440], [90, 440]), { w: 4, t: 200 })
        ink(g, L([70, 420], [70, 460]), { w: 4, d: 150, t: 200 })
        ink(g, L([200, 440], [340, 440]), { w: 3, d: 400, t: 600 })
        dashes(g, E(270, 440, 22, 26), { w: 1.2, d: 900, dash: 4, gap: 4 })
        const m = mk('g', { class: 'blink', style: '--d:1200ms' }, g)
        ink(m, L([252, 440], [288, 440]), { w: 3, t: 0 })
      },
      rekon(g) {
        eyeFront(g, 70, 470, 0.7)
        const p = L([116, 470], [180, 470])
        arrow(g, p, { w: 2.2, d: 400, t: 300, head: 9 })
        flow(g, p, { n: 3, ms: 900, d: 800, r: 2 })
        brain(g, 260, 470, 0.7, 500)
        // das Bild im Kopf: Haus mit Baum, aus Stücken zusammengesetzt
        for (let k = 0; k < 4; k++) dashes(g, RR(200 + (k % 2) * 50, 560 + Math.floor(k / 2) * 40, 48, 38, 3), { w: 1, d: 1300 + k * 100, dash: 3, gap: 3 })
        house(g, 214, 630, 34, 1700)
        tree(g, 278, 636, 0.25, 1800)
      },
      krake(g) {
        for (const [x0, n, front, d] of [[30, 'Mensch', true, 0], [200, 'Krake', false, 700]] as const) {
          const fy = front ? 400 : 540
          const cy = front ? 440 : 400
          for (let k = 0; k < 3; k++) ink(g, L([x0, fy + k * 10], [x0 + 130, fy + k * 10]), { w: 1.4, d: d + k * 80, t: 300 })
          for (let i = 0; i < 5; i++) ink(g, RR(x0 + 6 + i * 26, cy, 12, 80, 6), { w: 2, d: d + 300 + i * 60, t: 200 })
          if (front) {
            ink(g, B([x0 + 60, 420], [x0 + 64, 470], [x0 + 70, 520], [x0 + 74, 580]), { w: 2.6, d: d + 500, t: 300 })
            dot(g, x0 + 66, 500, 5, d + 700)
          }
          text(g, x0 + 65, 620, n, { anchor: 'middle', d: d + 600 })
        }
        for (const x of [100, 270]) {
          const p = L([x, 320], [x, 380])
          arrow(g, p, { w: 2, d: 1300, t: 300, head: 8 })
          flow(g, p, { n: 2, ms: 900, d: 1600, r: 1.8 })
        }
      },
      versorgung(g) {
        for (let i = 0; i < 9; i++) ink(g, RR(34 + i * 34, 400, 12, 100, 6), { w: 2.2, d: i * 60, t: 200 })
        hatch(g, RR(30, 506, 300, 40, 6), 700, true)
        ink(g, RR(30, 506, 300, 40, 6), { w: 2.4, d: 500, t: 400 })
        ink(g, smooth([[30, 570], [120, 564], [240, 576], [330, 568]]), { w: 2.4, d: 700, t: 600 })
        ink(g, smooth([[30, 590], [120, 584], [240, 596], [330, 588]]), { w: 2.4, d: 700, t: 600 })
        flow(g, smooth([[30, 580], [120, 574], [240, 586], [330, 578]]), { n: 4, ms: 2400, d: 1200, r: 2.2 })
        for (let i = 0; i < 9; i++) flow(g, L([40 + i * 34, 506], [40 + i * 34, 496]), { n: 1, ms: 900, d: 1400 + i * 60, r: 1.6 })
      },
      grube(g) {
        // Sehgrube im Schnitt: die Nervenschichten weichen zur Seite, die Zapfen stehen ganz dicht
        ink(g, B([30, 420], [120, 420], [150, 470], [180, 470]), { w: 3, t: 600 })
        ink(g, B([180, 470], [210, 470], [240, 420], [330, 420]), { w: 3, d: 300, t: 600 })
        hatch(g, [[30, 420], ...B([30, 420], [120, 420], [150, 470], [180, 470]), ...B([180, 470], [210, 470], [240, 420], [330, 420]).slice(1), [330, 460], [30, 460]], 800)
        for (let i = 0; i < 13; i++) {
          const x = 120 + i * 10
          const c: P[] = [[x - 3, 520], [x, 478], [x + 3, 520]]
          ink(g, c, { w: 1.4, d: 900 + i * 40, t: 150 })
        }
        for (const x of [40, 70, 270, 300]) ink(g, RR(x - 4, 476, 8, 44, 4), { w: 1.4, d: 1100, t: 150 })
        arrow(g, L([180, 330], [180, 456]), { w: 2, d: 1300, t: 300, head: 8 })
        flow(g, L([180, 330], [180, 456]), { n: 2, ms: 900, d: 1600, r: 2 })
      },
      daumen(g) {
        // Blick über den ausgestreckten Arm: der Daumennagel deckt den scharfen Bereich ab
        eyeFront(g, 50, 470, 0.4)
        dashes(g, L([76, 462], [300, 444]), { w: 1.4, d: 300 })
        dashes(g, L([76, 478], [300, 496]), { w: 1.4, d: 300 })
        ink(g, B([90, 500], [160, 500], [250, 500], [296, 510]), { w: 2.4, d: 500, t: 500 })
        ink(g, B([90, 530], [160, 530], [250, 530], [300, 520]), { w: 2.4, d: 500, t: 500 })
        ink(g, RR(296, 430, 26, 90, 12), { w: 2.8, d: 700, t: 400 })
        ink(g, RR(300, 434, 18, 20, 6), { w: 1.8, d: 1000, t: 200 })
        hatch(g, RR(300, 434, 18, 20, 6), 1100, true)
      },
      sakkaden(g) {
        // Blickpfad über ein Bild: kurze Fixationen, dazwischen Sprünge
        house(g, 60, 600, 90, 0)
        tree(g, 255, 600, 0.6, 200)
        ground(g, 20, 340, 600, 300, { grass: false })
        const pts: P[] = [[105, 500], [105, 450], [240, 470], [270, 410], [250, 560], [80, 570]]
        ink(g, pts, { w: 1, d: 700, t: 1500 })
        pts.forEach(([x, y], i) => {
          dot(g, x, y, 5, 800 + i * 300)
          text(g, x + 9, y - 7, String(i + 1), { cls: 's halo', d: 800 + i * 300 })
        })
        flow(g, pts, { n: 1, ms: 3000, d: 2600, r: 4, kind: 'ring' })
      },
      ende(g) {
        eyeFront(g, 180, 480, 2)
        blank(g, E(214, 470, 10))
        dashes(g, E(214, 470, 10), { w: 1.2, d: 900, dash: 3, gap: 3 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { test: { cls: 'a1' } } },
      { t: T('Probier es aus: Halte dir das linke Auge zu und schau mit dem rechten nur auf das **Kreuz** links.', 64), gfx: { test2: {} } },
      { t: T('Geh jetzt langsam näher an den Bildschirm heran oder weiter weg. In einem bestimmten Abstand **verschwindet** der Punkt.', 64), gfx: { test2: { cls: 'a1' } } },
      { t: T('Der Punkt ist nicht weg. Sein Bild fällt nur auf eine Stelle deiner Netzhaut, die **nichts sehen** kann.', 64), gfx: { auge: { cls: 'a1' } } },
      { t: T('Die Netzhaut ist mit Millionen Lichtsinneszellen ausgekleidet: **Stäbchen** für Hell und Dunkel, Zapfen für Farben.', 64), gfx: { zellen: {} } },
      { t: T('Ihre Nervenfasern laufen aber **vor** den Sinneszellen entlang – auf der Seite, von der das Licht kommt.', 64), gfx: { verkabelt: {} } },
      { t: T('An einer Stelle müssen alle Fasern gebündelt nach hinten aus dem Auge: der **Sehnerv**. Dort ist kein Platz für Sinneszellen.', 64), gfx: { auge: { cls: 'a1' } } },
      { t: T('Dieser Fleck ist nur 1,5 Millimeter groß. Im Blickfeld ist er aber so breit wie rund **zehn Vollmonde** nebeneinander.', 64), gfx: { monde: {} } },
      { t: T('Warum merkst du nichts? Erstens deckt das **andere Auge** die Lücke ab: Die blinden Flecken liegen an verschiedenen Stellen.', 64), gfx: { zwei: {} } },
      { t: T('Zweitens **füllt dein Gehirn** die Lücke einfach auf – mit dem Muster, das drumherum liegt.', 64), gfx: { fuellen: {} } },
      { t: T('Liegt der blinde Fleck auf einer Linie, siehst du sie **durchgehend**. Das fehlende Stück ergänzt dein Gehirn.', 64), gfx: { linie: {} } },
      { t: T('Du siehst also nicht, was auf deiner Netzhaut ankommt, sondern eine **Rekonstruktion** deines Gehirns.', 64), gfx: { rekon: {} } },
      { t: T('Kraken haben **keinen** blinden Fleck: Ihre Nervenfasern liegen hinter den Sinneszellen. Die Evolution hat das Auge zweimal erfunden.', 64), gfx: { krake: {} } },
      { t: T('Unsere „verkehrt“ verdrahtete Netzhaut hat aber einen Vorteil: Die Sinneszellen liegen direkt an einer Schicht, die sie **versorgt**.', 64), gfx: { versorgung: {} } },
      { t: T('Mitten im Blick liegt die **Sehgrube**: Dort sind die Fasern beiseitegeschoben und die Zapfen dicht gepackt – hier siehst du am schärfsten.', 64), gfx: { grube: {} } },
      { t: T('Wie klein dieser scharfe Bereich ist? Etwa so groß wie dein **Daumennagel** bei ausgestrecktem Arm.', 64), gfx: { daumen: {} } },
      { t: T('Den Rest siehst du erstaunlich unscharf. Dein Blick springt mehrmals pro Sekunde umher – das Gehirn **setzt das Bild zusammen**.', 64), gfx: { sakkaden: {} } },
      { t: T('Dein Blickfeld hat ein **Loch** – dein Gehirn malt es zu.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Wo der Sehnerv das Auge verlässt, gibt es keine Sinneszellen: der blinde Fleck.', 'Das andere Auge und das Gehirn füllen die Lücke – du merkst nichts.', 'Scharf siehst du nur in der kleinen Sehgrube; den Rest setzt das Gehirn zusammen.'],
    sources: ['Ramachandran 1992, Scientific American 266 (Filling in)', 'Kandel et al.: Principles of Neural Science, Kap. Netzhaut', 'Lamb 2011, Scientific American 305 (Evolution des Auges)'],
  },
  {
    id: 'koffein',
    area: 'NERV',
    day: 4,
    hook: 'Kaffee macht wach – ohne dir Energie zu geben. Wie geht das?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [],
    draw: {
      tasse(g) {
        // Kaffeetasse auf Untertasse, Crema-Wirbel, aufsteigender Dampf
        ink(g, E(180, 392, 130, 18), { w: 2.6, d: 600, t: 400 })
        ink(g, E(180, 388, 70, 8), { w: 1.2, d: 700, t: 300 })
        const cup: P[] = [...B([100, 200], [104, 300], [120, 370], [150, 380]), ...L([150, 380], [210, 380]).slice(1), ...B([210, 380], [240, 370], [256, 300], [260, 200])]
        blank(g, [...cup, [100, 200]])
        ink(g, cup, { w: 3.2, t: 700 })
        ink(g, E(180, 200, 80, 14), { w: 2.6, d: 300, t: 500 })
        hatch(g, E(180, 202, 72, 10), 700, true)
        blank(g, E(184, 202, 30, 5))
        ink(g, B([160, 202], [176, 196], [200, 206], [210, 200]), { w: 1.2, d: 900, t: 200 })
        ink(g, B([258, 236], [300, 230], [300, 320], [248, 316]), { w: 3, d: 500, t: 400 })
        ink(g, B([256, 252], [284, 250], [284, 304], [252, 300]), { w: 1.6, d: 600, t: 300 })
        for (const x of [150, 180, 210]) {
          const s = wobble(g, { dx: 4, dy: -8, ms: 2000 + x * 4, d: 900 })
          ink(s, B([x, 170], [x - 12, 150], [x + 12, 130], [x, 110]), { w: 1.8, d: 900, t: 400 })
        }
      },
      adenosin(g) {
        brain(g, 180, 450, 1.1)
        let seed = 6
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 18; i++) dot(g, 90 + rnd() * 180, 390 + rnd() * 110, 4, 1000 + i * 120)
        // Sanduhr: der Tag vergeht
        ink(g, [[280, 580], [320, 580], [300, 610], [320, 640], [280, 640], [300, 610], [280, 580]], { w: 2, d: 800, t: 400 })
        hatch(g, [[288, 640], [312, 640], [300, 622]], 1300, true)
        flow(g, L([300, 600], [300, 630]), { n: 2, ms: 600, d: 1200, r: 1.4 })
      },
      rezeptor(g) {
        // Membran einer Nervenzelle mit Rezeptoren; Adenosin besetzt sie – oder Koffein verstopft sie
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        ink(g, L([20, 572], [340, 572]), { w: 1.4, d: 200, t: 500 })
        for (let x = 30; x < 340; x += 14) dot(g, x, 566, 2, 300 + x)
        for (let i = 0; i < 4; i++) slot(g, 60 + i * 80, 556, 300 + i * 100)
        const a = st(g, 'h1')
        for (let i = 0; i < 4; i++) ball(a, 60 + i * 80, 540, 12, { d: 900 + i * 150, fill: 'hell', t: 200 })
        const c = st(g, 'x1', '--o: 180px 540px')
        for (let i = 0; i < 4; i++) {
          ball(c, 60 + i * 80, 540, 12, { fill: 'dicht', t: 0 })
          for (const [dx, dy] of [[-12, -10], [12, -10]] as const) ink(c, L([60 + i * 80 + dx * 0.7, 540 + dy * 0.7], [60 + i * 80 + dx, 540 + dy]), { w: 1.6, t: 0 })
        }
        const out = st(g, 'x2', '--o: 180px 400px')
        for (let i = 0; i < 4; i++) {
          const w = wobble(out, { dx: 6, dy: -4, ms: 1600 + i * 300, d: 0 })
          ball(w, 70 + i * 74, 380 + (i % 2) * 40, 12, { fill: 'hell', t: 0 })
        }
        text(g, 60, 610, 'Rezeptoren', { cls: 's', d: 700 })
        text(st(g, 'h1'), 300, 610, 'Adenosin', { anchor: 'end', cls: 's', fade: false })
        text(st(g, 'f1'), 300, 610, 'Koffein', { anchor: 'end', cls: 's', fade: false })
      },
      druck(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Tage', yl: 'Schlafdruck' })
        const pts: P[] = []
        for (let k = 0; k < 3; k++) {
          const x0 = 46 + k * 90
          pts.push(...L([x0, 590], [x0 + 64, 410]).slice(k ? 1 : 0), ...L([x0 + 64, 410], [x0 + 90, 590]).slice(1))
          sun(g, x0 + 32, 380, 6, 1500 + k * 200, 8)
          const m: P[] = [...E(x0 + 78, 380, 6, 6, 60, 300), ...E(x0 + 81, 380, 5, 5, 290, 70)]
          ink(g, m, { w: 1.4, d: 1600 + k * 200, t: 150 })
        }
        ink(g, pts, { w: 3, d: 500, t: 1600 })
        flow(g, pts, { n: 1, ms: 4000, d: 2200, r: 3.4 })
      },
      aehnlich(g) {
        // Strukturformeln: Adenin-Teil des Adenosins und Koffein – fast dieselbe Doppelring-Form
        const mol = (x: number, d: number, extra: boolean) => {
          const hx = (cx: number, cy: number): P[] => Array.from({ length: 7 }, (_, k) => [cx + Math.cos(rad(k * 60 + 30)) * 26, cy + Math.sin(rad(k * 60 + 30)) * 26])
          ink(g, hx(x, 460), { w: 2.6, d, t: 500 })
          const pent: P[] = Array.from({ length: 6 }, (_, k) => [x + 42 + Math.cos(rad(k * 72 + 180)) * 22, 460 + Math.sin(rad(k * 72 + 180)) * 22])
          ink(g, pent, { w: 2.6, d: d + 300, t: 400 })
          if (extra) for (const [a, b] of [[[x - 22, 448], [x - 46, 436]], [[x, 486], [x, 512]], [[x + 56, 478], [x + 70, 500]]] as const) {
            ink(g, L(a as P, b as P), { w: 2.2, d: d + 700, t: 200 })
            text(g, (b as P)[0], (b as P)[1] + 12, 'CH₃', { anchor: 'middle', cls: 's', d: d + 800, size: 10 })
          }
          else ink(g, L([x + 44, 482], [x + 44, 520]), { w: 2.2, d: d + 700, t: 200 })
        }
        mol(70, 0, false)
        mol(230, 600, true)
        text(g, 90, 580, 'Adenin', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 250, 600, 'Koffein', { anchor: 'middle', cls: 's', d: 1400 })
      },
      maske(g) {
        // Warnlampe „müde“ leuchtet, aber ein Stück Klebeband deckt sie ab
        ink(g, RR(60, 360, 240, 150, 12), { w: 2.8, t: 600 })
        bulb(g, 180, 430, 0.9, 300)
        hatch(g, E(180, 418, 22, 26), 800)
        rays(g, 180, 418, 34, 46, 10, 900)
        const tape: P[] = [[130, 400], [240, 380], [246, 420], [136, 440], [130, 400]]
        blank(g, tape)
        hatch(g, tape, 1400, true)
        ink(g, tape, { w: 2, d: 1200, t: 300 })
        ink(g, L([60, 560], [300, 560]), { w: 2, d: 700, t: 300 })
      },
      kurve(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Stunden', yl: 'Koffein im Blut' })
        plot(g, 46, 596, 280, 230, (t) => (t < 0.12 ? t / 0.12 : Math.pow(0.5, (t - 0.12) / 0.25)), { d: 500 })
        for (let k = 1; k < 7; k++) ink(g, L([46 + k * 46, 600], [46 + k * 46, 606]), { w: 1.2, d: 400, t: 60 })
        hatch(g, RR(54, 360, 28, 236, 2), 1300)
      },
      halbwert(g) {
        hbars(g, [
          { label: '16 Uhr', v: 100, fmt: (v) => `${Math.round(v)} %` },
          { label: '21 Uhr', v: 50, fmt: (v) => `${Math.round(v)} %` },
          { label: '2 Uhr nachts', v: 25, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { y: 340, gap: 100 })
        const m: P[] = [...E(300, 600, 14, 14, 60, 300), ...E(306, 600, 11, 11, 290, 70)]
        ink(g, m, { w: 2, d: 1600, t: 300 })
      },
      schlaf(g) {
        ink(g, RR(40, 520, 280, 40, 10), { w: 3, t: 600 })
        lie(g, 80, 504, 2.6, 'back', 300)
        hatch(g, RR(130, 492, 180, 28, 8), 700)
        ink(g, RR(130, 492, 180, 28, 8), { w: 2, d: 600, t: 300 })
        for (const x of [50, 310]) ink(g, L([x, 560], [x, 600]), { w: 2.6, d: 300, t: 200 })
        // Schlafkurve: Tiefschlafphasen (tief) werden flacher
        ink(g, [[40, 360], [80, 360], [100, 440], [140, 440], [160, 380], [200, 380], [220, 420], [250, 420], [270, 370], [330, 370]], { w: 2.2, d: 800, t: 900 })
        dashes(g, [[100, 450], [100, 470], [140, 470], [140, 450]], { w: 1.2, d: 1500, dash: 3, gap: 3 })
      },
      crash(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        ink(g, L([20, 572], [340, 572]), { w: 1.4, d: 200, t: 500 })
        for (let i = 0; i < 4; i++) slot(g, 60 + i * 80, 556, 200)
        for (let i = 0; i < 4; i++) {
          const dr = glide(g, 0, 140, { ms: 600, d: 600 + i * 120 })
          ball(dr, 60 + i * 80, 400, 12, { d: 600 + i * 60, fill: 'hell', t: 200 })
        }
        for (let i = 0; i < 6; i++) ball(g, 50 + i * 52, 430 + (i % 2) * 30, 12, { d: 800 + i * 60, fill: 'hell', t: 200 })
        lie(g, 120, 650, 1.6, 'back', 1400)
      },
      gewohnt(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        ink(g, L([20, 572], [340, 572]), { w: 1.4, d: 200, t: 500 })
        for (let i = 0; i < 7; i++) {
          const p = pop(g, 300 + i * 150, '50% 100%')
          slot(p, 40 + i * 47, 556, 0)
        }
        for (const [x, d] of [[60, 1300], [140, 1400]] as const) ink(g, [[x, 420], [x + 4, 480], [x + 36, 480], [x + 40, 420]], { w: 2.2, d, t: 300 })
        for (let k = 0; k < 3; k++) ink(g, [[230 + k * 30, 420], [234 + k * 30, 480], [256 + k * 30, 480], [260 + k * 30, 420]], { w: 2, d: 1500 + k * 100, t: 300 })
      },
      pause(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: 'Tag 1', sub: 'Kopfschmerz', up: true },
          { at: 0.45, label: 'Tag 3' },
          { at: 0.9, label: 'Tag 7', up: true, big: true },
        ])
        const head = E(80, 590, 26, 30)
        ink(g, head, { w: 2.2, d: 1300, t: 300 })
        bolt(g, [[96, 560], [104, 574], [98, 576], [108, 592]], 1500, 2)
        ink(g, E(290, 590, 26, 30), { w: 2.2, d: 1500, t: 300 })
        ink(g, B([280, 604], [286, 610], [294, 610], [300, 604]), { w: 1.6, d: 1700, t: 200 })
      },
      pflanze(g) {
        // Kaffeezweig mit Kirschen; ein Käfer frisst – und fällt um
        ink(g, B([20, 380], [100, 400], [200, 420], [340, 400]), { w: 3, t: 600 })
        leaf(g, 110, 470, 0.5, 300)
        leaf(g, 240, 340, 0.45, 400)
        for (const [x, y] of [[170, 440], [184, 446], [176, 456]] as const) ball(g, x, y, 8, { d: 700, fill: 'dicht', w: 1.6, t: 0 })
        const bug: P[] = E(290, 470, 22, 14)
        const b = group(g, 'm1', '--m1: rotate(180deg); transform-origin: 290px 470px; --dl: 1200ms')
        blank(b, bug)
        hatch(b, bug, 800, true)
        ink(b, bug, { w: 2.4, d: 600, t: 300 })
        for (const k of [-1, 0, 1]) ink(b, L([280 + k * 10, 482], [276 + k * 12, 500]), { w: 1.6, d: 800, t: 100 })
        ink(b, B([310, 464], [320, 452], [326, 452], [330, 460]), { w: 1.2, d: 900, t: 100 })
        cross(g, 290, 540, 0.8, 1000)
      },
      biene(g) {
        // Blüte mit Nektar, Biene im Anflug
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60)
          const p = E(110 + Math.cos(a) * 30, 470 + Math.sin(a) * 30, 18)
          blank(g, p)
          ink(g, p, { w: 2.2, d: k * 100, t: 300 })
        }
        ball(g, 110, 470, 14, { d: 700, fill: 'dicht', t: 200 })
        ink(g, L([110, 520], [110, 640]), { w: 2.6, d: 300, t: 400 })
        leaf(g, 140, 600, 0.25, 500)
        const fl = mk('g', {}, g)
        const path = smooth([[330, 380], [280, 340], [220, 420], [170, 440]])
        mk('animateMotion', { path: `M${path.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '3s', begin: '1s', fill: 'freeze' }, fl)
        const bee = E(0, 0, 20, 12)
        blank(fl, bee)
        hatch(fl, bee, 1100, true)
        ink(fl, bee, { w: 2.2, d: 900, t: 300 })
        for (const x of [-6, 2, 10]) ink(fl, L([x, -11], [x, 11]), { w: 1.6, d: 1000, t: 100 })
        const wg = wobble(fl, { deg: 25, ox: 0, oy: -10, ms: 150, d: 900 })
        ink(wg, E(-2, -18, 10, 7), { w: 1.4, d: 1100, t: 200 })
        dashes(g, path, { w: 1, d: 1000, dash: 3, gap: 5 })
      },
      tassen(g) {
        for (let i = 0; i < 4; i++) {
          const x = 50 + i * 76
          ink(g, [[x, 420], [x + 6, 520], [x + 54, 520], [x + 60, 420]], { w: 2.6, d: i * 200, t: 400 })
          hatch(g, [[x + 3, 440], [x + 7, 516], [x + 53, 516], [x + 57, 440]], i * 200 + 400, true)
          ink(g, E(x + 68, 460, 12, 20, -90, 90), { w: 2.4, d: i * 200 + 200, t: 200 })
          ink(g, E(x + 30, 524, 40, 6), { w: 1.6, d: i * 200 + 300, t: 200 })
        }
        text(g, 180, 600, '≈ 400 mg', { anchor: 'middle', size: 22, d: 1000 })
      },
      ende(g) {
        ink(g, [[110, 420], [118, 560], [242, 560], [250, 420]], { w: 3, t: 700 })
        ink(g, E(180, 420, 70, 12), { w: 2.4, d: 300, t: 400 })
        hatch(g, E(180, 422, 64, 8), 600, true)
        ink(g, E(266, 490, 22, 34, -90, 90), { w: 3, d: 500, t: 400 })
        for (const x of [160, 200]) {
          const s = wobble(g, { dx: 4, dy: -6, ms: 2000 + x * 4, d: 900 })
          ink(s, B([x, 400], [x - 10, 380], [x + 10, 360], [x, 340]), { w: 1.6, d: 900, t: 300 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { tasse: {} } },
      { t: T('Während du wach bist, sammelt sich in deinem Gehirn ein Stoff namens **Adenosin** an – ein Nebenprodukt des Energieverbrauchs.', 64), gfx: { adenosin: {} } },
      { t: T('Adenosin dockt an spezielle **Rezeptoren** der Nervenzellen an. Je mehr besetzt sind, desto stärker werden sie gebremst – du wirst müde.', 64), gfx: { rezeptor: {} } },
      { t: T('Das ist dein **Schlafdruck**: Er steigt den ganzen Tag. Im Schlaf wird das Adenosin abgebaut – morgens bist du wieder frisch.', 64), gfx: { druck: {} } },
      { t: T('Koffein sieht einem Teil des Adenosins **zum Verwechseln ähnlich**.', 64), gfx: { aehnlich: {} } },
      { t: T('Es setzt sich in dieselben Rezeptoren – aktiviert sie aber **nicht**. Es blockiert sie nur, wie ein falscher Schlüssel im Schloss.', 64), gfx: { rezeptor: { cls: 'a1 a2' } } },
      { t: T('Das Adenosin ist noch da – es kommt nur **nicht mehr an**. Die Müdigkeits-Bremse ist gelöst.', 64), gfx: { rezeptor: { cls: 'a1 a2' } } },
      { t: T('Kaffee liefert also keine Energie. Er **versteckt** nur die Meldung, dass du müde bist.', 64), gfx: { maske: {} } },
      { t: T('Am stärksten wirkt Koffein etwa **30 bis 60 Minuten** nach dem Trinken.', 64), gfx: { kurve: {} } },
      { t: T('Seine **Halbwertszeit** liegt bei rund fünf Stunden: Von einem Kaffee um 16 Uhr ist um 21 Uhr noch die Hälfte im Blut.', 64), gfx: { halbwert: {} } },
      { t: T('Darum kann Kaffee am Nachmittag den **Tiefschlaf** stören – selbst wenn du gut einschläfst.', 64), gfx: { schlaf: {} } },
      { t: T('Und wenn das Koffein nachlässt? Dann trifft dich das angestaute Adenosin **auf einmal**: der Koffein-Absturz.', 64), gfx: { crash: {} } },
      { t: T('Wer täglich Kaffee trinkt, bildet **mehr Rezeptoren**. Dann braucht es mehr Koffein für dieselbe Wirkung – und ohne kommen Kopfschmerzen.', 64), gfx: { gewohnt: {} } },
      { t: T('Nach einer Pause von etwa **einer Woche** hat sich das Gehirn meist wieder umgestellt.', 64), gfx: { pause: {} } },
      { t: T('Koffein steckt auch in Tee, Cola und Schokolade. Pflanzen bilden es als **Insektengift** gegen Fraßfeinde.', 64), gfx: { pflanze: {} } },
      { t: T('Bienen mögen es in kleinen Mengen: Koffein im Nektar hilft ihnen, sich Blüten **besser zu merken** – sie kommen wieder.', 64), gfx: { biene: {} } },
      { t: T('Für gesunde Erwachsene gelten bis etwa **400 Milligramm** pro Tag als unbedenklich – rund vier Tassen Filterkaffee.', 64), gfx: { tassen: {} } },
      { t: T('Kaffee schaltet Müdigkeit nicht ab – er **blockiert ihre Botschaft**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Im Wachsein sammelt sich Adenosin an und bremst die Nervenzellen – Schlafdruck.', 'Koffein besetzt die Adenosin-Rezeptoren, ohne sie zu aktivieren: Die Müdigkeit wird verdeckt.', 'Halbwertszeit rund 5 Stunden – Nachmittagskaffee wirkt bis in die Nacht.'],
    sources: ['Fredholm et al. 1999, Pharmacological Reviews 51', 'Wright et al. 2013, Science 339 (Bienen)', 'EFSA 2015: Scientific Opinion on the safety of caffeine'],
  },
  {
    id: 'reiben-schmerz',
    area: 'NERV',
    day: 4,
    hook: 'Warum hilft Reiben, wenn du dich gestoßen hast?',
    mood: 'verspielt',
    ambience: 'herz',
    images: [],
    draw: {
      knie(g) {
        // Bein seitlich, angewinkelt; eine Hand reibt über das Knie
        ink(g, B([40, 140], [90, 200], [130, 260], [150, 300]), { w: 3.2, t: 600 })
        ink(g, B([150, 300], [170, 340], [190, 380], [210, 440]), { w: 3.2, d: 300, t: 600 })
        ink(g, B([96, 120], [140, 190], [180, 250], [196, 290]), { w: 3.2, t: 600 })
        ink(g, B([196, 290], [210, 330], [236, 380], [254, 440]), { w: 3.2, d: 300, t: 600 })
        ink(g, [[210, 440], [200, 452], [270, 452], [254, 440]], { w: 2.8, d: 500, t: 300 })
        for (const [x, y] of [[230, 250], [250, 290], [220, 210]] as const) ink(g, L([x, y], [x + 20, y - 8]), { w: 2.2, d: 900, t: 150 })
        const h = wobble(g, { dx: 10, dy: 14, ms: 500, d: 1200 })
        const hand: P[] = smooth([[150, 250], [176, 240], [210, 250], [226, 262], [214, 280], [180, 282], [150, 272], [150, 250]], 4)
        blank(h, hand)
        ink(h, hand, { w: 2.4, d: 1000, t: 400 })
        for (const y of [254, 264, 274]) ink(h, L([200, y], [224, y + 2]), { w: 1, d: 1300, t: 100 })
        ink(h, B([150, 260], [120, 250], [90, 230], [60, 216]), { w: 2.4, d: 1100, t: 300 })
      },
      fasern(g) {
        // dünne Faser ohne Hülle (langsam) – dicke Faser mit Myelin-Perlen (schnell)
        ink(g, L([30, 420], [330, 420]), { w: 1.2, d: 200, t: 600 })
        flow(g, L([30, 420], [330, 420]), { n: 2, ms: 6000, d: 800, r: 2.2 })
        text(g, 30, 400, 'Schmerz', { d: 300 })
        const thick = st(g, 'x1', '--o: 30px 520px')
        ink(thick, L([30, 520], [330, 520]), { w: 2.4, t: 0 })
        for (let k = 0; k < 9; k++) {
          blank(thick, RR(36 + k * 33, 510, 26, 20, 10))
          hatch(thick, RR(36 + k * 33, 510, 26, 20, 10), 0)
          ink(thick, RR(36 + k * 33, 510, 26, 20, 10), { w: 1.4, t: 0 })
        }
        flow(thick, L([30, 520], [330, 520]), { n: 3, ms: 1200, r: 2.8 })
        text(thick, 30, 496, 'Berührung', { fade: false })
      },
      tor(g) {
        // Rückenmark im Schnitt (Schmetterling), darin eine Schaltzelle als Tor
        const cord = E(240, 470, 90, 120)
        blank(g, cord)
        ink(g, cord, { w: 3, t: 800 })
        const bf: P[] = smooth([[240, 420], [212, 380], [196, 420], [214, 460], [196, 520], [214, 560], [240, 520], [266, 560], [284, 520], [266, 460], [284, 420], [268, 380], [240, 420]], 4)
        hatch(g, bf, 600)
        ink(g, bf, { w: 1.6, d: 400, t: 600 })
        ink(g, L([170, 470], [250, 470]), { w: 2.4, d: 600, t: 300 })
        ball(g, 210, 470, 6, { d: 700, fill: 'dicht', t: 0 })
        const gate = st(g, 'm1', '--m1: rotate(-80deg); transform-origin: 250px 470px; transition-duration: 1.2s')
        ink(gate, L([250, 470], [250, 420]), { w: 5, d: 700, t: 300 })
        const up = L([250, 410], [250, 300])
        arrow(g, up, { w: 2.6, d: 1000, t: 400, head: 9 })
        flow(st(g, 'h1'), up, { n: 3, ms: 900, d: 1400, r: 2.4 })
        brain(g, 290, 290, 0.25, 1100)
        dashes(g, L([20, 470], [166, 470]), { w: 1.6, d: 400, dash: 6, gap: 6 })
        flow(g, L([20, 470], [166, 470]), { n: 2, ms: 2400, d: 800, r: 2 })
        text(g, 20, 456, 'Schmerz', { cls: 's', d: 500 })
        const touch = st(g, 'x1', '--o: 20px 600px')
        ink(touch, L([20, 600], [204, 600]), { w: 5, t: 0 })
        ink(touch, L([204, 600], [212, 480]), { w: 2.4, t: 0 })
        flow(touch, [[20, 600], [204, 600], [212, 480]], { n: 3, ms: 900, r: 2.6 })
        text(touch, 20, 586, 'Reiben', { cls: 's', fade: false })
      },
      melzack(g) {
        // Torbild: Schranke, die sich halb schließt
        ink(g, L([60, 600], [300, 600]), { w: 2.6, t: 500 })
        ink(g, RR(70, 420, 20, 180, 4), { w: 2.4, d: 300, t: 400 })
        ink(g, RR(270, 420, 20, 180, 4), { w: 2.4, d: 300, t: 400 })
        const bar = wobble(g, { deg: 20, ox: 90, oy: 470, ms: 3000, d: 900 })
        hatch(bar, RR(90, 462, 170, 16, 4), 800, true)
        ink(bar, RR(90, 462, 170, 16, 4), { w: 2.2, d: 600, t: 400 })
        for (let i = 0; i < 4; i++) flow(g, L([20, 520 + i * 16], [340, 520 + i * 16]), { n: 1, ms: 1600 + i * 300, d: 1200 + i * 200, r: 2.4 })
        text(g, 180, 380, 'Melzack & Wall, 1965', { anchor: 'middle', cls: 's', d: 700 })
      },
      filter(g) {
        ink(g, [[60, 360], [300, 360], [200, 480], [200, 560], [160, 560], [160, 480], [60, 360]], { w: 3, t: 900 })
        hatch(g, [[64, 362], [296, 362], [250, 418], [110, 418]], 900)
        for (let i = 0; i < 8; i++) {
          const f = glide(g, (180 - (90 + i * 26)) * 0.9, 120, { ms: 1600, d: 600 + i * 100 })
          dot(f, 90 + i * 26, 330, 5, 600 + i * 60)
        }
        for (let k = 0; k < 2; k++) flow(g, L([180, 560], [180, 650]), { n: 1, ms: 1200, d: 1800 + k * 600, r: 4 })
      },
      ablenkung(g) {
        brain(g, 180, 380, 0.8)
        const p = L([180, 450], [180, 540])
        arrow(g, p, { w: 2.6, d: 900, t: 400, head: 9 })
        flow(g, p, { n: 3, ms: 900, d: 1300, r: 2.4 })
        ink(g, L([140, 580], [220, 580]), { w: 5, d: 1200, t: 300 })
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60)
          dot(g, 180 + Math.cos(a) * 30, 560 + Math.sin(a) * 12, 2.4, 1400 + k * 60)
        }
      },
      sport(g) {
        // Fußballspieler im Lauf, Ball, Rasen
        ground(g, 20, 340, 620, 0)
        fig(g, 140, 618, 4, { d: 0, arms: 'push' })
        const b = glide(g, 60, -40, { ms: 1400, d: 900 })
        ball(b, 220, 600, 18, { d: 500, w: 2.4 })
        for (const a of [0, 72, 144, 216, 288]) {
          const q: P = [220 + Math.cos(rad(a)) * 9, 600 + Math.sin(rad(a)) * 9]
          ink(b, E(q[0], q[1], 4), { w: 1, d: 700, t: 80 })
        }
        ink(g, RR(290, 420, 50, 200, 2), { w: 2, d: 400, t: 400 })
        for (let k = 0; k < 6; k++) ink(g, L([292, 440 + k * 30], [338, 440 + k * 30]), { w: 0.8, d: 600, t: 100 })
      },
      tens(g) {
        ink(g, RR(110, 360, 140, 90, 12), { w: 3, t: 600 })
        ink(g, RR(130, 376, 100, 34, 6), { w: 2, d: 300, t: 300 })
        for (const k of [0, 1, 2]) ink(g, E(150 + k * 30, 430, 8), { w: 1.4, d: 500, t: 150 })
        ink(g, waveP(136, 224, 393, 8, 22), { w: 1.4, d: 600, t: 300 })
        for (const x of [90, 270]) {
          const c = B([x < 180 ? 120 : 240, 450], [x, 480], [x, 520], [x, 560])
          ink(g, c, { w: 2, d: 600, t: 400 })
          flow(g, c, { n: 2, ms: 600, d: 1200, r: 1.8 })
          hatch(g, RR(x - 26, 560, 52, 36, 6), 1000, true)
          ink(g, RR(x - 26, 560, 52, 36, 6), { w: 2.4, d: 900, t: 300 })
        }
        ink(g, smooth([[30, 600], [120, 592], [240, 604], [330, 596]]), { w: 2.2, d: 800, t: 500 })
      },
      tempo(g) {
        hbars(g, [
          { label: 'Berührung', v: 70, fmt: (v) => `${Math.round(v)} m/s` },
          { label: 'dumpfer Schmerz', v: 1, fmt: () => '≈ 1 m/s', dense: true },
        ], { y: 380, gap: 130 })
        flow(g, L([30, 600], [330, 600]), { n: 2, ms: 600, d: 1200, r: 3 })
        flow(g, L([30, 630], [330, 630]), { n: 1, ms: 9000, d: 1200, r: 3 })
      },
      zeh(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: '0 s', up: true },
          { at: 0.2, label: 'stechend' },
          { at: 0.85, label: '≈ 1 s', up: true, big: true },
        ])
        // Fuß stößt gegen Tischbein
        const foot: P[] = smooth([[40, 620], [44, 590], [80, 586], [120, 596], [128, 612], [120, 622], [40, 622]], 4)
        blank(g, foot)
        ink(g, foot, { w: 2.2, d: 900, t: 400 })
        ink(g, RR(130, 560, 16, 70, 2), { w: 2.4, d: 1000, t: 300 })
        rays(g, 124, 600, 10, 20, 6, 1300)
      },
      pusten(g) {
        // Mutter pustet auf das Knie eines Kindes
        fig(g, 110, 620, 4)
        fig(g, 260, 620, 2.6, { d: 300 })
        for (const [y, d] of [[470, 700], [490, 800], [510, 900]] as const) flow(g, L([150, y], [226, y + 40]), { n: 2, ms: 900, d, r: 1.8, kind: 'dash' })
        heart(g, 190, 380, 0.4, 1100)
      },
      kratzen(g) {
        ink(g, B([30, 470], [120, 440], [240, 440], [330, 470]), { w: 3, t: 700 })
        ink(g, B([30, 520], [120, 500], [240, 500], [330, 520]), { w: 3, d: 200, t: 700 })
        const f = wobble(g, { dx: 20, ms: 300, d: 900 })
        for (let k = 0; k < 4; k++) ink(f, L([140 + k * 18, 430], [150 + k * 18, 380]), { w: 3, d: 700 + k * 100, t: 150 })
        for (let k = 0; k < 6; k++) ball(g, 120 + k * 24, 472 + (k % 2) * 8, 4, { d: 500, fill: 'hell', w: 1.2, t: 0 })
        for (let k = 0; k < 3; k++) ink(g, B([110 + k * 40, 486], [120 + k * 40, 490], [130 + k * 40, 486], [140 + k * 40, 490]), { w: 1, d: 1300, t: 100 })
      },
      chronisch(g) {
        const cord = E(240, 470, 90, 120)
        ink(g, cord, { w: 3, t: 800 })
        ink(g, L([170, 470], [250, 470]), { w: 2.4, d: 300, t: 300 })
        ink(g, L([250, 470], [290, 440]), { w: 5, d: 500, t: 300 })
        const up = L([250, 456], [250, 300])
        arrow(g, up, { w: 4, d: 800, t: 400, head: 11 })
        flow(g, up, { n: 4, ms: 700, d: 1200, r: 2.8 })
        dashes(g, L([20, 470], [166, 470]), { w: 1.6, d: 300, dash: 6, gap: 6 })
        flow(g, L([20, 470], [166, 470]), { n: 3, ms: 1200, d: 900, r: 2 })
        clock(g, 70, 600, 30, 0, 0, 1000)
      },
      erwartung(g) {
        brain(g, 180, 450, 1.1)
        // drei Regler oben: Erwartung, Stimmung, Aufmerksamkeit
        for (let k = 0; k < 3; k++) {
          const x = 80 + k * 100
          ink(g, L([x, 600], [x, 650]), { w: 2, d: 900 + k * 100, t: 200 })
          const knob = wobble(g, { dy: -14 + k * 8, ms: 2400 + k * 500, d: 1200 })
          ink(knob, RR(x - 12, 620, 24, 10, 3), { w: 2, d: 1000 + k * 100, t: 200 })
        }
      },
      ende(g) {
        arcArrow(g, 180, 480, 60, -60, 260, { t: 900, w: 3 })
        const s = spin(g, 180, 480, 2000, 900)
        dot(s, 180, 420, 4, 900)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { knie: {} } },
      { t: T('Du stößt dir das Knie und reibst sofort darüber – ganz instinktiv. Erstaunlich: Es **hilft** tatsächlich.', 480), gfx: { knie: {} } },
      { t: T('In deiner Haut stecken verschiedene Nervenfasern. Dünne, langsame melden **Schmerz**.', 64), gfx: { fasern: {} } },
      { t: T('Dicke, schnelle Fasern melden **Berührung** und Druck.', 64), gfx: { fasern: { cls: 'a1' } } },
      { t: T('Beide laufen ins **Rückenmark**. Dort sitzt eine Art Tor, das entscheidet, was ans Gehirn weitergeht.', 64), gfx: { tor: {} } },
      { t: T('Kommen nur Schmerzsignale an, steht das Tor **offen**: Das Gehirn bekommt die volle Meldung.', 64), gfx: { tor: {} } },
      { t: T('Reibst du, feuern die Berührungsfasern. Über kleine Schaltzellen im Rückenmark **schließen sie das Tor** ein Stück weit.', 64), gfx: { tor: { cls: 'a1' } } },
      { t: T('Es kommt weniger Schmerz oben an. Das ist die **Gate-Control-Theorie**.', 64), gfx: { melzack: {} } },
      { t: T('Sie veränderte die Schmerzforschung: Schmerz ist kein einfaches Kabel ins Gehirn, sondern wird **unterwegs gefiltert**.', 64), gfx: { filter: {} } },
      { t: T('Auch das Gehirn kann das Tor von oben schließen. Bei Angst, Aufregung oder **Ablenkung** spürst du Verletzungen oft kaum.', 64), gfx: { ablenkung: {} } },
      { t: T('Sportler merken manchmal erst nach dem Spiel, dass sie verletzt sind. Stresshormone und **körpereigene Schmerzmittel** wirken.', 64), gfx: { sport: {} } },
      { t: T('Diese **Endorphine** docken an dieselben Rezeptoren wie Morphin – dein Körper hat seine eigene Apotheke.', 64), gfx: { ablenkung: {} } },
      { t: T('Auch Wärme, Kälte und Vibration nutzen den Tor-Effekt. Darauf beruht die **TENS-Therapie**: leichte Stromimpulse über die Haut.', 64), gfx: { tens: {} } },
      { t: T('Und warum tut ein gestoßener Zeh erst einen Moment **später** richtig weh? Weil manche Schmerzfasern so langsam sind.', 64), gfx: { tempo: {} } },
      { t: T('Erst spürst du den Stoß und einen stechenden Schmerz – dann, nach einem Moment, kommt der **zweite Schmerz**: dumpf und anhaltend.', 64), gfx: { zeh: {} } },
      { t: T('Kinder kennen den Trick instinktiv: Pusten und Streicheln sind ein **Berührungsreiz** – und Zuwendung lenkt zusätzlich ab.', 64), gfx: { pusten: {} } },
      { t: T('Ähnlich beim Jucken: **Kratzen** lindert kurz, weil ein leichter Schmerz das Juckreiz-Signal im Rückenmark übertönt.', 64), gfx: { kratzen: {} } },
      { t: T('Bei **chronischen Schmerzen** ist das System oft überempfindlich geworden: Das Tor steht gewissermaßen dauerhaft offen.', 64), gfx: { chronisch: {} } },
      { t: T('Wie sehr etwas wehtut, hängt also nicht nur von der Verletzung ab, sondern auch von **Erwartung**, Stimmung und Aufmerksamkeit.', 64), gfx: { erwartung: {} } },
      { t: T('Reiben ist also keine Einbildung, sondern ein **Trick im Rückenmark**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Schmerz und Berührung laufen über verschiedene Nervenfasern ins Rückenmark.', 'Berührungssignale schließen dort ein „Tor“ und dämpfen den Schmerz (Gate-Control-Theorie).', 'Auch das Gehirn kann Schmerz von oben dämpfen – bei Ablenkung, Stress, über Endorphine.'],
    sources: ['Melzack & Wall 1965, Science 150', 'Mendell 2014, Pain 155 (50 Jahre Gate-Control)', 'Kandel et al.: Principles of Neural Science, Kap. Schmerz'],
  },
  {
    id: 'magenta',
    area: 'NERV',
    day: 49,
    hook: 'Magenta gibt es im Regenbogen nicht. Wie kannst du es dann sehen?',
    mood: 'raetsel',
    ambience: 'atem',
    images: [],
    draw: {
      bogen(g) {
        hatch(g, [...E(180, 420, 150, 150, 180, 360), ...E(180, 420, 110, 110, 360, 180)], 900)
        ;[150, 130, 110].forEach((r, k) => ink(g, E(180, 420, r, r, 180, 360), { w: 2.6, d: k * 200, t: 800 }))
        ink(g, L([20, 420], [340, 420]), { w: 3, d: 300, t: 500 })
        text(g, 180, 400, '?', { anchor: 'middle', size: 50, d: 1200 })
      },
      band(g) {
        spectrum(g, 30, 330, 420)
        text(g, 30, 400, '400 nm', { cls: 's', d: 900 })
        text(g, 330, 400, '700 nm', { anchor: 'end', cls: 's', d: 1000 })
      },
      fehlt(g) {
        spectrum(g, 30, 330, 420)
        question(g, 180, 560, 0.9, 900)
        text(g, 250, 586, 'Magenta?', { d: 1100 })
      },
      zapfen(g) {
        ;[['kurz', 0.15], ['mittel', 0.5], ['lang', 0.65]].forEach(([n, c], i) => {
          const x0 = 30 + i * 105
          ink(g, L([x0, 560], [x0 + 90, 560]), { w: 2, d: i * 300, t: 300 })
          plot(g, x0, 558, 90, 140, (t) => Math.exp(-Math.pow((t - Number(c)) / 0.2, 2)), { d: 200 + i * 300, t: 600 })
          text(g, x0 + 45, 590, `${n}`, { anchor: 'middle', cls: 's', d: 400 + i * 300 })
        })
        text(g, 180, 380, 'drei Zapfensorten', { anchor: 'middle', d: 1200 })
        text(g, 180, 630, '≈ Blau · Grün · Rot', { anchor: 'middle', cls: 's', d: 1400 })
      },
      mischung(g) {
        vbars(g, [
          { label: 'Blau-Zapfen', v: 1, fmt: () => 'wenig' },
          { label: 'Grün-Zapfen', v: 5, fmt: () => 'viel' },
          { label: 'Rot-Zapfen', v: 6, fmt: () => 'viel', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 220 })
        text(g, 180, 320, 'Gelb = diese Mischung', { anchor: 'middle', d: 1500 })
      },
      pixel(g) {
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 3; k++) {
          const x = 40 + c * 72 + k * 22
          const y = 360 + r * 64
          const p = RR(x, y, 18, 52, 4)
          if (k === 1) hatch(g, p, 200 + (r * 4 + c) * 30)
          if (k === 2) hatch(g, p, 200 + (r * 4 + c) * 30, true)
          ink(g, p, { w: 1.6, d: (r * 4 + c) * 30, t: 150 })
        }
        text(g, 180, 640, 'Rot · Grün · Blau', { anchor: 'middle', cls: 's', d: 1000 })
      },
      magenta(g) {
        vbars(g, [
          { label: 'Blau-Zapfen', v: 6, fmt: () => 'viel', dense: true },
          { label: 'Grün-Zapfen', v: 0.3, fmt: () => 'kaum' },
          { label: 'Rot-Zapfen', v: 6, fmt: () => 'viel', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 220 })
        text(g, 180, 320, 'Magenta = diese Mischung', { anchor: 'middle', d: 1500 })
      },
      gruen(g) {
        spectrum(g, 30, 330, 420)
        hatch(g, RR(132, 422, 48, 36, 2), 700, true)
        arrow(g, L([60, 560], [146, 500]), { w: 2, d: 900, t: 300, head: 8 })
        arrow(g, L([300, 560], [166, 500]), { w: 2, d: 1000, t: 300, head: 8 })
        text(g, 180, 610, 'dazwischen liegt immer Grün', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kreis(g) {
        ink(g, E(180, 470, 110), { w: 3, t: 900 })
        const names = ['Rot', 'Orange', 'Gelb', 'Grün', 'Blau', 'Violett', 'Magenta']
        names.forEach((n, i) => {
          const a = rad(-90 + (i * 360) / names.length)
          dot(g, 180 + Math.cos(a) * 110, 470 + Math.sin(a) * 110, 4, 400 + i * 120)
          text(g, 180 + Math.cos(a) * 140, 470 + Math.sin(a) * 140 + 5, n, { anchor: 'middle', cls: n === 'Magenta' ? '' : 's', d: 500 + i * 120 })
        })
      },
      linie(g) {
        ink(g, L([40, 380], [320, 380]), { w: 3, t: 600 })
        text(g, 40, 360, 'Licht: eine Linie', { cls: 's', d: 300 })
        arrow(g, L([180, 400], [180, 450]), { w: 2.4, d: 700, t: 300, head: 9 })
        ink(g, E(180, 560, 90), { w: 3, d: 900, t: 900 })
        text(g, 180, 566, 'Farben: ein Kreis', { anchor: 'middle', cls: 's', d: 1400 })
      },
      kopf(g) {
        brain(g, 180, 460, 1.2)
        text(g, 180, 620, 'Magenta entsteht hier', { anchor: 'middle', d: 1200 })
      },
      braun(g) {
        hatch(g, RR(40, 400, 120, 120, 6), 300)
        ink(g, RR(40, 400, 120, 120, 6), { w: 2.4, t: 400 })
        hatch(g, RR(200, 400, 120, 120, 6), 300, true)
        ink(g, RR(200, 400, 120, 120, 6), { w: 2.4, t: 400 })
        blank(g, RR(240, 440, 40, 40, 4))
        hatch(g, RR(240, 440, 40, 40, 4), 600)
        blank(g, RR(80, 440, 40, 40, 4))
        hatch(g, RR(80, 440, 40, 40, 4), 600)
        ink(g, RR(80, 440, 40, 40, 4), { w: 2, d: 500, t: 200 })
        ink(g, RR(240, 440, 40, 40, 4), { w: 2, d: 500, t: 200 })
        text(g, 100, 560, 'hell umgeben', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 260, 560, 'dunkel umgeben', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 610, 'gleiches Orange, anderer Eindruck', { anchor: 'middle', cls: 's', d: 1100 })
      },
      weiss(g) {
        for (let i = 0; i < 6; i++) ink(g, L([30, 380 + i * 30], [200, 470]), { w: 2, d: i * 100, t: 400 })
        arrow(g, L([200, 470], [320, 470]), { w: 4, d: 800, t: 400, head: 11 })
        text(g, 260, 450, 'Weiß', { anchor: 'middle', d: 1100 })
      },
      tiere(g) {
        vbars(g, [
          { label: 'Mensch', v: 3, fmt: () => '3' },
          { label: 'Vogel', v: 4, fmt: () => '4' },
          { label: 'Fangschreckenkrebs', v: 12, fmt: () => '12', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 220 })
        text(g, 180, 320, 'Sorten von Farbrezeptoren', { anchor: 'middle', cls: 's', d: 1400 })
      },
      ende(g) {
        ink(g, E(180, 500, 80), { w: 3, t: 800 })
        dot(g, 180, 580, 6, 800)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { bogen: {} } },
      { t: T('Licht ist eine Welle. Jede Farbe im Regenbogen hat **eine Wellenlänge** – von Violett bei etwa 400 bis Rot bei 700 Nanometern.', 64), gfx: { band: {} } },
      { t: T('Magenta – dieses leuchtende Pink-Lila – kommt in diesem Band **nirgends** vor. Es gibt keine Magenta-Wellenlänge.', 64), gfx: { fehlt: {} } },
      { t: T('Dein Auge misst Farbe mit drei Sorten **Zapfen**: für kurze, mittlere und lange Wellen – grob Blau, Grün und Rot.', 64), gfx: { zapfen: {} } },
      { t: T('Jede Farbe ist für dein Gehirn ein **Mischverhältnis** dieser drei Signale. Gelb heißt zum Beispiel: Rot und Grün stark, Blau schwach.', 64), gfx: { mischung: {} } },
      { t: T('Dieselbe Mischung entsteht auch aus rotem plus grünem Licht – dein Auge sieht **genauso Gelb**.', 64), gfx: { f1: { draw: 'formel', args: [['rotes Licht', '+', 'grünes Licht', '→', 'Gelb'], 380] } } },
      { t: T('Bildschirme nutzen das: Sie haben nur **rote, grüne und blaue** Pünktchen – und zeigen damit fast alle Farben.', 64), gfx: { pixel: {} } },
      { t: T('Und Magenta? Es entsteht, wenn Rot- und Blau-Zapfen stark feuern, die **Grün-Zapfen aber nicht**.', 64), gfx: { magenta: {} } },
      { t: T('Mit einer einzigen Wellenlänge geht das nicht: Alles zwischen Rot und Blau ist Grün – und würde die Grün-Zapfen **reizen**.', 64), gfx: { gruen: {} } },
      { t: T('Das Gehirn macht daraus eine **eigene Farbe**: Es biegt das Band zu einem Kreis und schließt die Lücke zwischen Rot und Violett mit Magenta.', 64), gfx: { kreis: {} } },
      { t: T('Darum ordnen wir Farben als **Kreis** an, obwohl das Licht nur eine Linie von kurz bis lang ist.', 64), gfx: { linie: {} } },
      { t: T('Magenta ist also echt – aber nicht in der Physik, sondern in deinem **Kopf**.', 64), gfx: { kopf: {} } },
      { t: T('Auch **Braun** fehlt im Regenbogen: Es ist dunkles Orange. Erst eine hellere Umgebung lässt es braun wirken.', 64), gfx: { braun: {} } },
      { t: T('Und Weiß ist ebenfalls keine Wellenlänge, sondern **alle Farben zusammen**.', 64), gfx: { weiss: {} } },
      { t: T('Viele Vögel haben vier Zapfensorten und sehen Ultraviolett. Fangschreckenkrebse haben sogar **zwölf** Farbrezeptoren – und unterscheiden Farben trotzdem schlechter als wir.', 64), gfx: { tiere: {} } },
      { t: T('Magenta ist eine Farbe, die **nur dein Gehirn** erfindet.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Magenta hat keine eigene Wellenlänge – es fehlt im Regenbogen.', 'Es entsteht, wenn Rot- und Blau-Zapfen feuern, die Grün-Zapfen aber nicht.', 'Das Gehirn schließt so das Spektrum zum Farbkreis.'],
    sources: ['Gegenfurtner & Kiper 2003, Annual Review of Neuroscience 26', 'Livingstone 2002: Vision and Art', 'Thoen et al. 2014, Science 343 (Fangschreckenkrebse)'],
  },
  {
    id: 'karussell',
    area: 'NERV',
    day: 86,
    hook: 'Warum dreht sich alles, wenn du vom Karussell steigst?',
    mood: 'verspielt',
    ambience: 'wind',
    images: [],
    draw: {
      karussell(g) {
        ink(g, [[60, 160], [180, 90], [300, 160], [60, 160]], { w: 3, t: 700 })
        hatch(g, [[60, 160], [180, 90], [300, 160]], 600)
        ink(g, L([180, 160], [180, 400]), { w: 3.6, d: 300, t: 500 })
        ink(g, E(180, 410, 130, 18), { w: 2.8, d: 400, t: 600 })
        for (const x of [90, 270]) {
          ink(g, L([x, 162], [x, 330]), { w: 2, d: 600, t: 300 })
          ball(g, x, 350, 18, { d: 800, fill: 'hell', t: 300 })
        }
        arcArrow(g, 180, 410, 150, 200, 250, { d: 1100, t: 500 })
      },
      ohr(g) {
        const spiral: P[] = []
        for (let a = 0; a < Math.PI * 5; a += 0.1) spiral.push([110 + Math.cos(a) * (40 - a * 2.4), 520 + Math.sin(a) * (40 - a * 2.4)])
        ink(g, spiral, { w: 2.6, t: 1200 })
        ink(g, E(200, 400, 40, 46, 120, 420), { w: 3, d: 600, t: 600 })
        ink(g, E(270, 470, 44, 34, 210, 510), { w: 3, d: 800, t: 600 })
        ink(g, E(220, 540, 34, 40, -30, 270), { w: 3, d: 1000, t: 600 })
        blank(g, E(200, 470, 26))
        ink(g, E(200, 470, 26), { w: 2.6, d: 300, t: 500 })
        text(g, 110, 600, 'Hörschnecke', { anchor: 'middle', cls: 's', d: 1300 })
        text(g, 270, 360, 'Bogengänge', { anchor: 'middle', cls: 's', d: 1400 })
      },
      drei(g) {
        ;[['nicken', 70], ['schütteln', 180], ['kippen', 290]].forEach(([n, x], i) => {
          const cx = Number(x)
          ink(g, E(cx, 470, 40, i === 1 ? 14 : 40), { w: 3, d: i * 300, t: 600 })
          text(g, cx, 560, String(n), { anchor: 'middle', cls: 's', d: 300 + i * 300 })
        })
      },
      ring(g) {
        canal(g, 180, 480)
        const flap = st(g, 'm1', '--m1: rotate(28deg); transform-origin: 180px 400px')
        const flap2 = st(flap, 'm3', '--m3: rotate(-28deg); transform-origin: 180px 400px')
        const f2 = st(flap2, 'm2', '--m2: rotate(-28deg); transform-origin: 180px 400px')
        blank(f2, RR(174, 370, 12, 32, 5))
        ink(f2, RR(174, 370, 12, 32, 5), { w: 2.4, d: 900, t: 300 })
        text(g, 180, 330, 'Klappe (Cupula)', { anchor: 'middle', cls: 's', d: 1100 })
        const turn = st(g, 'f1')
        arcArrow(turn, 180, 480, 136, 200, 300, { t: 0 })
        text(turn, 40, 640, 'Kopf dreht sich', { cls: 's', fade: false })
        const lag = st(g, 'f1')
        arcArrow(lag, 180, 480, 95, 330, 250, { t: 0, w: 1.8, head: 7 })
      },
      gehirn(g) {
        brain(g, 180, 450, 1.1)
        text(g, 180, 620, 'Drehung!', { anchor: 'middle', size: 24, d: 1200 })
      },
      stehen(g) {
        fig(g, 180, 600, 5)
        arcArrow(g, 180, 470, 120, 200, 330, { d: 600, t: 500 })
        arcArrow(g, 180, 470, 120, 20, 150, { d: 900, t: 500 })
      },
      augen(g) {
        eye(g, 100, 470, 1.2)
        eye(g, 260, 470, 1.2, 200)
        for (const x of [100, 260]) {
          arrow(g, L([x - 30, 540], [x + 30, 540]), { w: 2.2, d: 800, t: 300, head: 8 })
          arrow(g, L([x + 30, 570], [x - 10, 570]), { w: 2.2, d: 1100, t: 200, head: 8 })
        }
        text(g, 180, 630, 'langsam hin, schnell zurück', { anchor: 'middle', cls: 's', d: 1300 })
      },
      rennen(g) {
        fig(g, 110, 620, 4, { arms: 'push' })
        eye(g, 270, 420, 1.1, 500)
        dashes(g, L([126, 520], [236, 432]), { w: 1.4, d: 800 })
        text(g, 270, 500, 'Blick bleibt ruhig', { anchor: 'middle', cls: 's', d: 1200 })
      },
      tanz(g) {
        fig(g, 140, 620, 5, { arms: 'up' })
        dot(g, 310, 420, 7, 600)
        dashes(g, L([150, 470], [300, 422]), { w: 1.4, d: 800 })
        arcArrow(g, 140, 530, 60, 200, 340, { d: 1000, t: 400 })
        text(g, 310, 400, 'Punkt', { anchor: 'middle', cls: 's', d: 900 })
      },
      gedaempft(g) {
        brain(g, 100, 470, 0.6)
        brain(g, 260, 470, 0.6, 300)
        hatch(g, E(100, 470, 30), 900, true)
        ink(g, E(260, 470, 14), { w: 2, d: 900, t: 200 })
        text(g, 100, 560, 'untrainiert', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 260, 560, 'Tänzer', { anchor: 'middle', cls: 's', d: 1100 })
      },
      kristalle(g) {
        ink(g, RR(70, 400, 220, 140, 30), { w: 3, t: 700 })
        for (let k = 0; k < 9; k++) ink(g, L([96 + k * 22, 540], [100 + k * 22, 500]), { w: 1.6, d: 400 + k * 50, t: 150 })
        hatch(g, RR(86, 470, 188, 30, 8), 900)
        ink(g, RR(86, 470, 188, 30, 8), { w: 2, d: 800, t: 300 })
        for (let k = 0; k < 7; k++) ink(g, RR(96 + k * 26, 452, 14, 12, 2), { w: 1.6, d: 1100 + k * 60, t: 100 })
        text(g, 180, 600, 'Kalkkristalle: Schwerkraft, Beschleunigung', { anchor: 'middle', cls: 's', d: 1400 })
      },
      lose(g) {
        canal(g, 180, 480)
        for (const [x, y] of [[90, 560], [104, 574], [80, 548]] as const) ink(g, RR(x - 6, y - 5, 12, 10, 2), { w: 1.8, d: 900, t: 150 })
        text(g, 180, 640, 'Kristalle im Bogengang', { anchor: 'middle', cls: 's', d: 1100 })
      },
      epley(g) {
        ;[0, 1, 2, 3].forEach((k) => {
          const x = 60 + k * 80
          ball(g, x, 470, 22, { d: k * 300, t: 300 })
          const a = rad(-90 + k * 70)
          ink(g, L([x, 470], [x + Math.cos(a) * 20, 470 + Math.sin(a) * 20]), { w: 2.6, d: 200 + k * 300, t: 150 })
          if (k < 3) arrow(g, L([x + 28, 470], [x + 52, 470]), { w: 2, d: 300 + k * 300, t: 150, head: 7 })
        })
        text(g, 180, 560, 'Kopf nacheinander drehen', { anchor: 'middle', cls: 's', d: 1300 })
      },
      alkohol(g) {
        canal(g, 180, 480)
        blank(g, RR(174, 370, 12, 32, 5))
        hatch(g, RR(174, 370, 12, 32, 5), 900)
        ink(g, RR(174, 370, 12, 32, 5), { w: 2.4, d: 900, t: 300 })
        text(g, 180, 340, 'Klappe leichter durch Alkohol', { anchor: 'middle', cls: 's', d: 1200 })
      },
      see(g) {
        ink(g, RR(60, 360, 240, 180, 12), { w: 3, t: 700 })
        ink(g, RR(200, 390, 70, 50, 20), { w: 2.4, d: 300, t: 400 })
        fig(g, 120, 520, 2.4, { d: 500 })
        for (const [y, d] of [[580, 800], [620, 900]] as const) ink(g, waveP(20, 340, y, 8, 60, y / 30), { w: 2.2, d, t: 800 })
        text(g, 235, 470, 'Auge: Ruhe', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 180, 330, 'Ohr: Schaukeln', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        canal(g, 180, 520)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { karussell: {} } },
      { t: T('Dein Gleichgewichtsorgan sitzt im **Innenohr**, gleich neben der Hörschnecke.', 64), gfx: { ohr: {} } },
      { t: T('Es besteht unter anderem aus drei **Bogengängen**: ringförmigen Röhren, die in drei Richtungen stehen – wie die Ecke eines Würfels.', 64), gfx: { drei: {} } },
      { t: T('Jeder Ring ist mit Flüssigkeit gefüllt. Und in jedem steht eine kleine, gallertartige **Klappe** mit Sinneshärchen.', 64), gfx: { ring: {} } },
      { t: T('Drehst du den Kopf, dreht sich der Ring mit. Die Flüssigkeit ist aber träge und **bleibt zurück** – sie biegt die Klappe.', 64), gfx: { ring: { cls: 'a1' } } },
      { t: T('Dein Gehirn liest aus der gebogenen Klappe: **Drehung!** – und in welche Richtung.', 64), gfx: { gehirn: {} } },
      { t: T('Drehst du dich lange gleichmäßig, wird die Flüssigkeit mitgerissen und dreht **mit**. Die Klappe richtet sich auf – du spürst die Drehung kaum noch.', 64), gfx: { ring: { cls: 'a1 a2' } } },
      { t: T('Jetzt hältst du an. Der Ring stoppt – aber die Flüssigkeit **strömt weiter** und biegt die Klappe in die Gegenrichtung.', 64), gfx: { ring: { cls: 'a1 a2 a3' } } },
      { t: T('Dein Gehirn meldet: Drehung **in die andere Richtung** – obwohl du stillstehst. Alles dreht sich.', 64), gfx: { stehen: {} } },
      { t: T('Auch deine Augen machen mit: Sie wandern langsam zur Seite und springen zurück, immer wieder. Das heißt **Nystagmus**.', 64), gfx: { augen: {} } },
      { t: T('Eigentlich ist diese Kopplung genial: Darum bleibt dein Blick **ruhig**, auch wenn du rennst und dein Kopf wackelt.', 64), gfx: { rennen: {} } },
      { t: T('Tänzer drehen sich trotzdem dutzendfach. Ihr Trick: Sie fixieren einen Punkt und reißen den Kopf **ruckartig** herum.', 64), gfx: { tanz: {} } },
      { t: T('Training hilft zusätzlich: Bei Tänzern reagiert das Gehirn auf Drehreize **gedämpfter** – das zeigen Hirnscans.', 64), gfx: { gedaempft: {} } },
      { t: T('Für Schwerkraft und Geradeaus-Beschleunigung hat das Innenohr zwei weitere Säckchen – mit winzigen **Kalkkristallen** auf den Sinneshärchen.', 64), gfx: { kristalle: {} } },
      { t: T('Lösen sich solche Kristalle und rutschen in einen Bogengang, entsteht **Lagerungsschwindel**: heftiger Drehschwindel beim Umdrehen im Bett.', 64), gfx: { lose: {} } },
      { t: T('Ärzte beheben das oft mit einer Folge von **Kopfbewegungen**: Die Kristalle rollen dabei aus dem Bogengang zurück.', 64), gfx: { epley: {} } },
      { t: T('Alkohol bringt die Welt ebenfalls ins Drehen: Er macht die Klappen **leichter** als die Flüssigkeit drumherum. Im Liegen kippen sie – das Bett dreht sich.', 64), gfx: { alkohol: {} } },
      { t: T('Und Seekrankheit? Sie entsteht, wenn Ohr und Augen **Verschiedenes melden**: Das Ohr spürt Schaukeln, das Auge sieht eine ruhige Kabine.', 64), gfx: { see: {} } },
      { t: T('Schwindel ist Flüssigkeit, die **nicht rechtzeitig bremst**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Drei flüssigkeitsgefüllte Bogengänge im Innenohr messen Drehungen.', 'Nach langem Drehen strömt die Flüssigkeit beim Anhalten weiter – das Gehirn meldet eine Gegendrehung.', 'Augen, Ohr und Gehirn arbeiten zusammen; widersprechen sie sich, wird dir schwindelig oder übel.'],
    sources: ['Kandel et al.: Principles of Neural Science, Kap. Vestibuläres System', 'Nigmatullina et al. 2015, Cerebral Cortex 25 (Tänzer)', 'Money & Myles 1974, Nature 247 (Alkohol und Cupula)'],
  },
  {
    id: 'scharf',
    area: 'NERV',
    day: 4,
    hook: 'Warum brennt Chili im Mund, obwohl gar nichts heiß ist?',
    mood: 'verspielt',
    ambience: 'feuer',
    images: [],
    draw: {
      schote(g) {
        chili(g, 170, 260, 1.5)
        flame(g, 300, 200, 0.6, 900)
      },
      schwitzen(g) {
        fig(g, 180, 620, 6)
        for (const [x, y] of [[110, 420], [250, 420], [96, 500], [264, 500]] as const) drop(g, x, y, 0.6, 700, false)
        text(g, 180, 350, 'rot, verschwitzt, Mund brennt', { anchor: 'middle', cls: 's', d: 1000 })
      },
      schnitt(g) {
        ink(g, E(180, 470, 120, 80), { w: 3, t: 800 })
        for (const a of [0, 120, 240]) ink(g, L([180, 470], [180 + Math.cos(rad(a)) * 116, 470 + Math.sin(rad(a)) * 76]), { w: 3.2, d: 500, t: 400 })
        hatch(g, E(180, 470, 24), 900, true)
        for (const [x, y] of [[130, 440], [230, 440], [180, 520]] as const) ball(g, x, y, 7, { d: 1000, t: 0, w: 1.6 })
        text(g, 180, 600, 'Capsaicin vor allem in den Scheidewänden', { anchor: 'middle', cls: 's', d: 1200 })
      },
      sensor(g) {
        ink(g, L([20, 480], [130, 480]), { w: 3, t: 400 })
        ink(g, L([230, 480], [340, 480]), { w: 3, t: 400 })
        const l = st(g, 'm1', '--m1: translateX(-14px)')
        ink(l, RR(134, 440, 30, 80, 10), { w: 2.8, d: 300, t: 400 })
        const r = st(g, 'm1', '--m1: translateX(14px)')
        ink(r, RR(196, 440, 30, 80, 10), { w: 2.8, d: 300, t: 400 })
        thermo(g, 60, 320, 120, 0.7, 600)
        text(g, 80, 360, 'ab ≈ 43 °C', { cls: 's', d: 900 })
        text(g, 180, 560, 'TRPV1', { anchor: 'middle', d: 800 })
        const key = st(g, 'x1', '--o: 180px 400px')
        hatch(key, RR(170, 380, 20, 40, 4), 0, true)
        ink(key, RR(170, 380, 20, 40, 4), { w: 2, t: 0 })
        text(key, 270, 400, 'Capsaicin', { anchor: 'middle', cls: 's', fade: false })
        const ion = st(g, 'f1', '--dl: 600ms')
        arrow(ion, L([180, 430], [180, 540]), { w: 2.4, t: 0, head: 9 })
      },
      alarm(g) {
        ink(g, B([40, 600], [120, 560], [180, 520], [210, 470]), { w: 2.4, t: 700 })
        brain(g, 250, 400, 0.6, 400)
        flame(g, 80, 520, 0.5, 900)
        text(g, 180, 640, 'Meldung: Verbrennung!', { anchor: 'middle', cls: 's', d: 1200 })
      },
      wasser(g) {
        ink(g, [[100, 380], [110, 560], [190, 560], [200, 380]], { w: 3, t: 600 })
        hatch(g, [[106, 420], [194, 420], [190, 556], [110, 556]], 500)
        cross(g, 280, 470, 1.4, 900)
        text(g, 150, 620, 'Wasser verteilt es nur', { anchor: 'middle', cls: 's', d: 1100 })
      },
      milch(g) {
        ink(g, [[100, 380], [110, 560], [190, 560], [200, 380]], { w: 3, t: 600 })
        ink(g, L([106, 420], [194, 420]), { w: 2, d: 400, t: 300 })
        check(g, 280, 470, 1.4, 900)
        text(g, 150, 620, 'Kasein und Fett binden es', { anchor: 'middle', cls: 's', d: 1100 })
      },
      scoville(g) {
        for (let i = 0; i < 5; i++) {
          const x = 40 + i * 64
          ink(g, [[x, 420], [x + 4, 520], [x + 40, 520], [x + 44, 420]], { w: 2.4, d: i * 200, t: 300 })
          if (i < 4) hatch(g, [[x + 3, 470 + i * 10], [x + 41, 470 + i * 10], [x + 40, 518], [x + 4, 518]], 300 + i * 200, i < 2)
          if (i < 4) arrow(g, L([x + 46, 440], [x + 62, 440]), { w: 1.6, d: 200 + i * 200, t: 150, head: 6 })
        }
        text(g, 180, 600, 'verdünnen, bis niemand mehr etwas merkt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      sorten(g) {
        hbars(g, [
          { label: 'Jalapeño', v: 5000, fmt: (v) => `${Math.round(v).toLocaleString('de-DE')}` },
          { label: 'Habanero', v: 300000, fmt: (v) => `${Math.round(v).toLocaleString('de-DE')}` },
          { label: 'Carolina Reaper', v: 1600000, fmt: (v) => `${(v / 1e6).toFixed(1).replace('.', ',')} Mio.`, dense: true },
        ], { y: 340, gap: 100 })
        text(g, 30, 640, 'Scoville-Einheiten', { cls: 's', d: 1400 })
      },
      maus(g) {
        const m = E(140, 520, 60, 34)
        hatch(g, m, 600)
        ink(g, m, { w: 2.8, t: 600 })
        ink(g, E(196, 498, 20, 16), { w: 2.6, d: 300, t: 300 })
        ink(g, B([80, 530], [50, 560], [40, 520], [20, 540]), { w: 2, d: 500, t: 300 })
        cross(g, 280, 450, 1.2, 900)
        text(g, 180, 620, 'Säugetiere zerkauen die Samen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      vogel(g) {
        const b: P[] = [...B([60, 520], [80, 450], [180, 440], [220, 470]), [260, 452], [240, 480], ...B([240, 480], [220, 540], [120, 560], [60, 520]).slice(1)]
        blank(g, b)
        hatch(g, b, 700)
        ink(g, b, { w: 2.8, t: 800 })
        dot(g, 226, 466, 3, 900)
        ink(g, B([100, 500], [130, 480], [160, 480], [180, 500]), { w: 2, d: 600, t: 300 })
        check(g, 290, 400, 1.2, 1000)
        text(g, 180, 620, 'Vögel spüren nichts – und verbreiten die Samen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      achterbahn(g) {
        ink(g, B([20, 600], [80, 300], [140, 300], [180, 560]), { w: 3, t: 800 })
        ink(g, B([180, 560], [220, 640], [280, 420], [340, 440]), { w: 3, d: 600, t: 800 })
        ball(g, 120, 340, 12, { d: 1200, fill: 'dicht', t: 200 })
        text(g, 250, 360, 'sicherer Schreck', { anchor: 'middle', cls: 's', d: 1300 })
      },
      weniger(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        for (let i = 0; i < 6; i++) {
          const x = 50 + i * 52
          const p = st(g, i % 2 ? 'h1' : '', '--dl:300ms')
          ink(p, RR(x - 10, 500, 20, 56, 6), { w: 2.4, d: 300 + i * 80, t: 200 })
        }
        text(g, 180, 620, 'weniger empfindlich', { anchor: 'middle', cls: 's', d: 1100 })
      },
      pflaster(g) {
        ink(g, RR(70, 410, 220, 110, 20), { w: 3, t: 700 })
        hatch(g, RR(130, 430, 100, 70, 10), 600)
        ink(g, RR(130, 430, 100, 70, 10), { w: 2.2, d: 400, t: 400 })
        text(g, 180, 580, 'Capsaicin-Pflaster', { anchor: 'middle', cls: 's', d: 1000 })
      },
      minze(g) {
        const lf: P[] = [...B([180, 600], [100, 540], [100, 420], [180, 360]), ...B([180, 360], [260, 420], [260, 540], [180, 600]).slice(1)]
        hatch(g, lf, 600)
        ink(g, lf, { w: 3, t: 800 })
        ink(g, L([180, 600], [180, 380]), { w: 2, d: 500, t: 400 })
        snowflake(g, 290, 360, 24, 900)
        text(g, 180, 640, 'Menthol: Kälte-Sensor TRPM8', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        chili(g, 180, 480, 1.3)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { schote: {} } },
      { t: T('Chili ist nicht heiß. Trotzdem schwitzt du, dein Gesicht wird rot und der Mund **brennt**.', 64), gfx: { schwitzen: {} } },
      { t: T('Schuld ist **Capsaicin**. Die Pflanze bildet es vor allem in den hellen Scheidewänden der Schote – nicht in den Kernen.', 64), gfx: { schnitt: {} } },
      { t: T('In deinem Mund sitzen Sensoren für Hitze. Sie heißen **TRPV1** und schlagen ab etwa 43 Grad Alarm.', 64), gfx: { sensor: {} } },
      { t: T('Capsaicin passt genau in diesen Sensor – und **öffnet** ihn, ganz ohne Wärme. Geladene Teilchen strömen in die Nervenzelle.', 64), gfx: { sensor: { cls: 'a1' } } },
      { t: T('Dein Nerv meldet also: **Verbrennung!** Und der Körper reagiert wie auf echte Hitze – mit Schweiß und roter Haut.', 64), gfx: { alarm: {} } },
      { t: T('Scharf ist darum **kein Geschmack** wie süß oder salzig, sondern ein Hitze- und Schmerzsignal.', 64), gfx: { v1: { draw: 'vergleich', args: [['Geschmack', 'süß', 'salzig', 'sauer', 'bitter', 'umami'], ['Schmerz', 'scharf', 'brennend'], 330] } } },
      { t: T('Wasser hilft kaum: Capsaicin ist **fettlöslich**. Wasser spült es nicht weg, sondern verteilt es nur weiter.', 64), gfx: { wasser: {} } },
      { t: T('Besser sind **Milch** oder Joghurt: Das Eiweiß Kasein und das Milchfett lösen das Capsaicin von den Sensoren.', 64), gfx: { milch: {} } },
      { t: T('Gemessen wird Schärfe in **Scoville**: Wie oft muss man den Extrakt mit Zuckerwasser verdünnen, bis niemand mehr etwas spürt?', 64), gfx: { scoville: {} } },
      { t: T('Paprika liegt bei null, eine Jalapeño bei einigen Tausend – die Züchtung Carolina Reaper bei weit über **einer Million**.', 64), gfx: { sorten: {} } },
      { t: T('Warum macht die Pflanze das? Gegen **Säugetiere**: Ihre Zähne zermahlen die Samen.', 64), gfx: { maus: {} } },
      { t: T('Vögel spüren Capsaicin **gar nicht** – ihr Sensor ist anders gebaut. Sie fressen die Früchte und tragen die Samen unversehrt weit fort.', 64), gfx: { vogel: {} } },
      { t: T('Und warum mögen Menschen den Schmerz? Eine Erklärung: **gutartiger Masochismus** – ein Schreck, der sicher ist, wie in der Achterbahn.', 64), gfx: { achterbahn: {} } },
      { t: T('Wer oft scharf isst, wird unempfindlicher: Die Sensoren werden **heruntergeregelt**.', 64), gfx: { weniger: {} } },
      { t: T('Derselbe Effekt hilft in Schmerzpflastern: Hoch dosiertes Capsaicin **erschöpft** die Schmerzfasern – danach melden sie weniger.', 64), gfx: { pflaster: {} } },
      { t: T('Und Minze? Menthol öffnet den **Kälte-Sensor** TRPM8. Darum fühlt sie sich kühl an, ohne kalt zu sein.', 64), gfx: { minze: {} } },
      { t: T('Chili brennt nicht – es **täuscht** deinen Hitzesensor.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Capsaicin öffnet den Hitzesensor TRPV1 – ohne jede Wärme.', 'Scharf ist darum ein Schmerz- und Hitzesignal, kein Geschmack; Milch hilft besser als Wasser.', 'Vögel spüren Capsaicin nicht – sie verbreiten die Samen.'],
    sources: ['Caterina et al. 1997, Nature 389 (TRPV1)', 'Tewksbury & Nabhan 2001, Nature 412', 'McKemy, Neuhausser & Julius 2002, Nature 416 (TRPM8)'],
  },
]
