import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, bolt, bulb, check, clock, cross, dashes, eye, fig, group, hatch, hbars, ink, letter, mk, mountain, pop, question, rays, st, text, timeline, type P } from './draw'
import { arcArrow, ball, box, bullets, carrow, clipBox, dot, drop, earth, flow, geo, glide, mapRegion, ripple, sea, smooth, spin, sun, thermo, water, waveP, wobble } from './kit'

// Technik: Alltagsgeräte und wie sie wirklich funktionieren, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Smartphone, oben links (x, y): Rahmen, Glas, Kamera-Insel, Tasten an der Seite, optional App-Raster */
function phone(g: Element, x: number, y: number, w: number, h: number, d = 0, apps = false): void {
  blank(g, RR(x, y, w, h, w * 0.14))
  ink(g, RR(x, y, w, h, w * 0.14), { w: 3, d, t: 700 })
  ink(g, RR(x + 6, y + 6, w - 12, h - 12, w * 0.11), { w: 1.2, d: d + 200, t: 600 })
  ink(g, RR(x + w * 0.36, y + 12, w * 0.28, 9, 4.5), { w: 1.6, d: d + 300, t: 200 })
  mk('circle', { cx: x + w * 0.58, cy: y + 16.5, r: 2.2, class: 'k fade', style: `--d:${d + 400}ms` }, g)
  for (const [yy, hh] of [[0.2, 0.08], [0.32, 0.12]] as const) ink(g, L([x + w + 2, y + h * yy], [x + w + 2, y + h * (yy + hh)]), { w: 2.6, d: d + 400, t: 150 })
  ink(g, L([x - 2, y + h * 0.24], [x - 2, y + h * 0.3]), { w: 2.6, d: d + 400, t: 150 })
  if (apps) {
    const s = (w - 40) / 4
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 4; c++) ink(g, RR(x + 20 + c * s + s * 0.15, y + 40 + r * s * 1.15, s * 0.7, s * 0.7, s * 0.18), { w: 1.3, d: d + 500 + (r * 4 + c) * 25, t: 120 })
    ink(g, RR(x + w * 0.35, y + h - 18, w * 0.3, 4, 2), { w: 1.2, d: d + 900, t: 150 })
  }
}

/** Zeigefinger von unten, Spitze bei (x, y): Nagel, Gelenkfalten */
function finger(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const p: P[] = [P(-17, 140), ...B(P(-17, 140), P(-17, 60), P(-16, 20), P(-14, 10)).slice(1), ...B(P(-14, 10), P(-10, -4), P(10, -4), P(14, 10)).slice(1), ...B(P(14, 10), P(16, 20), P(17, 60), P(17, 140)).slice(1)]
  blank(g, p)
  ink(g, p, { w: 2.6, d, t: 600 })
  const nail: P[] = [...B(P(-9, 22), P(-9, 4), P(9, 4), P(9, 22)), P(-9, 22)]
  ink(g, nail, { w: 1.4, d: d + 400, t: 200 })
  for (const yy of [48, 54, 92, 98]) ink(g, B(P(-10, yy), P(-4, yy + 2), P(4, yy + 2), P(10, yy)), { w: 1, d: d + 500, t: 150 })
}

/** Gitter aus Zeilen und Spalten (leitende Bahnen) */
function wires(g: Element, x: number, y: number, w: number, h: number, n: number, d = 0): void {
  for (let i = 1; i < n; i++) ink(g, L([x + (w * i) / n, y + 4], [x + (w * i) / n, y + h - 4]), { w: 1.2, d: d + i * 40, t: 300 })
  for (let i = 1; i < n; i++) dashes(g, L([x + 4, y + (h * i) / n], [x + w - 4, y + (h * i) / n]), { w: 1.2, d: d + 200 + i * 40 })
}

/** Farbe als Muster (schwarz-weiß lesbar): Gelb = Punkte, Rot = Schrägschraffur, Blau = waagerechte Linien */
type Paint = 'gelb' | 'rot' | 'blau'
function paint(g: Element, x: number, y: number, w: number, h: number, colors: Paint[], d = 0): void {
  const c = clipBox(g, x, y, w, h)
  if (colors.includes('rot')) hatch(c, RR(x, y, w, h, 0), d)
  if (colors.includes('blau')) for (let yy = y + 4; yy < y + h; yy += 7) ink(c, L([x, yy], [x + w, yy]), { w: 1, d: d + (yy - y) * 4, t: 80 })
  if (colors.includes('gelb')) for (let yy = y + 5; yy < y + h; yy += 8) for (let xx = x + 4 + ((yy - y) % 16 ? 4 : 0); xx < x + w; xx += 8) mk('circle', { cx: xx, cy: yy, r: 1.3, class: 'k fade', style: `--d:${d + 100}ms` }, c)
}

/** Farbtopf mit Farbe(n), Boden bei y; label optional */
function pot(g: Element, cx: number, y: number, colors: Paint[], d = 0, label = ''): void {
  const p: P[] = [[cx - 30, y - 56], [cx - 26, y], [cx + 26, y], [cx + 30, y - 56]]
  blank(g, [...p, [cx - 30, y - 56]])
  paint(g, cx - 28, y - 42, 56, 42, colors, d + 300)
  blank(g, [[cx - 40, y - 60], [cx - 28, y - 42], [cx - 26, y + 4], [cx - 40, y + 4]])
  blank(g, [[cx + 40, y - 60], [cx + 28, y - 42], [cx + 26, y + 4], [cx + 40, y + 4]])
  ink(g, p, { w: 2.6, d, t: 400 })
  ink(g, E(cx, y - 56, 30, 7), { w: 2.2, d: d + 200, t: 300 })
  ink(g, E(cx, y - 42, 28, 5, 0, 180), { w: 1.2, d: d + 300, t: 200 })
  ink(g, B([cx - 30, y - 56], [cx - 20, y - 84], [cx + 20, y - 84], [cx + 30, y - 56]), { w: 1.6, d: d + 350, t: 300 })
  if (label) text(g, cx, y + 24, label, { anchor: 'middle', cls: 's', d: d + 400 })
}

/** Legende der Farbmuster */
function legend(g: Element, x: number, y: number, colors: Paint[], d = 0): void {
  const names: Record<Paint, string> = { gelb: 'Gelb', rot: 'Rot', blau: 'Blau' }
  colors.forEach((c, i) => {
    const xx = x + i * 92
    paint(g, xx, y - 14, 24, 18, [c], d + i * 100)
    ink(g, RR(xx, y - 14, 24, 18, 3), { w: 1.4, d: d + i * 100, t: 200 })
    text(g, xx + 30, y, names[c], { cls: 's', d: d + 100 + i * 100 })
  })
}

/** Rechte Hand von hinten (Handrücken), Handfläche oben links bei (x, y), 120 × 70; up[i] = Finger gestreckt (Daumen zuerst) */
function hand(g: Element, x: number, y: number, up: boolean[], d = 0, labels: string[] = []): void {
  // Handrücken mit Handgelenk
  const palm: P[] = [...B([x + 4, y + 4], [x + 2, y + 40], [x + 10, y + 70], [x + 26, y + 92]), [x + 26, y + 124], [x + 100, y + 124], [x + 100, y + 92], ...B([x + 100, y + 92], [x + 116, y + 72], [x + 122, y + 40], [x + 118, y + 4]).slice(1), [x + 4, y + 4]]
  blank(g, palm)
  ink(g, palm.slice(0, -1), { w: 2.6, d, t: 600 })
  for (const k of [0, 1]) ink(g, B([x + 30, y + 104 + k * 8], [x + 50, y + 108 + k * 8], [x + 76, y + 108 + k * 8], [x + 96, y + 104 + k * 8]), { w: 0.9, d: d + 500, t: 200 })
  for (let i = 1; i < 5; i++) ink(g, B([x + 16 + (i - 1) * 29, y + 10], [x + 18 + (i - 1) * 29, y + 30], [x + 30 + (i - 1) * 14, y + 56], [x + 44 + (i - 1) * 9, y + 80]), { w: 0.8, d: d + 600, t: 200 })
  up.forEach((u, i) => {
    const dd = d + 100 + i * 80
    if (i === 0) {
      // Daumen: schräg nach links außen
      const th = group(g, '', `transform: rotate(${u ? -28 : -8}deg); transform-origin: ${x + 6}px ${y + 50}px`)
      const p = RR(x - 20, y + (u ? -4 : 22), 26, u ? 60 : 34, 12)
      blank(th, p)
      if (u) hatch(th, p, dd + 200)
      ink(th, p, { w: 2.4, d: dd, t: 300 })
      if (u) ink(th, B([x - 13, y + 2], [x - 13, y - 6], [x - 1, y - 6], [x - 1, y + 2]), { w: 1.2, d: dd + 300, t: 150 })
    } else {
      const fx = x + 4 + (i - 1) * 29
      const len = (u ? [0, 72, 80, 74, 58] : [0, 18, 18, 18, 16])[i]
      const p = RR(fx, y - len, 24, len + 8, 11)
      blank(g, p)
      if (u) hatch(g, p, dd + 200)
      ink(g, p, { w: 2.4, d: dd, t: 300 })
      if (u) {
        ink(g, B([fx + 5, y - len + 16], [fx + 5, y - len + 5], [fx + 19, y - len + 5], [fx + 19, y - len + 16]), { w: 1.2, d: dd + 300, t: 150 })
        for (const k of [0.38, 0.68]) ink(g, B([fx + 5, y - len * (1 - k)], [fx + 9, y - len * (1 - k) + 2], [fx + 15, y - len * (1 - k) + 2], [fx + 19, y - len * (1 - k)]), { w: 0.9, d: dd + 350, t: 100 })
      } else ink(g, B([fx + 3, y - 6], [fx + 8, y - 14], [fx + 16, y - 14], [fx + 21, y - 6]), { w: 1, d: dd + 300, t: 100 })
    }
    if (labels[i]) text(g, i === 0 ? x - 14 : x + 16 + (i - 1) * 29, i === 0 ? y + 82 : y + 146, labels[i], { anchor: 'middle', cls: 's', d: d + 500 + i * 80 })
  })
}

/** Bits unter den Fingern der Hand bei x = 130 (Daumen zuerst); b in Schreibweise (höchster Wert links) */
function bits(g: Element, b: number[], d = 0): void {
  const xs = [116, 146, 175, 204, 233]
  xs.forEach((x, i) => {
    const v = b[b.length - 1 - i]
    ink(g, RR(x - 11, 628, 22, 26, 4), { w: 1.6, d: d + i * 80, t: 150 })
    if (v) hatch(g, RR(x - 11, 628, 22, 26, 4), d + 200 + i * 80)
    text(g, x, 647, String(v), { anchor: 'middle', size: 16, cls: v ? 'halo' : '', d: d + 100 + i * 80 })
  })
}

/** Kreis-Neuron */
function neuron(g: Element, x: number, y: number, d = 0, fill = false): void {
  ball(g, x, y, 12, { d, fill: fill ? 'dicht' : 'leer', t: 200 })
}

/** Lichtleiter (zwei parallele Bahnen) mit Zickzack-Strahl */
function fiber(g: Element, x0: number, x1: number, y: number, h: number, d = 0, bounces = 6): void {
  ink(g, L([x0, y - h / 2], [x1, y - h / 2]), { w: 2.6, d, t: 600 })
  ink(g, L([x0, y + h / 2], [x1, y + h / 2]), { w: 2.6, d, t: 600 })
  const pts: P[] = []
  for (let i = 0; i <= bounces; i++) pts.push([x0 + ((x1 - x0) * i) / bounces, i % 2 ? y + h / 2 - 3 : y - h / 2 + 3])
  arrow(g, pts, { w: 2.2, d: d + 500, t: 1200, head: 9 })
}

/** Kühlschrank-Umriss, oben links */
function fridge(g: Element, x: number, y: number, w: number, h: number, d = 0): void {
  ink(g, RR(x, y, w, h, 10), { w: 3, d, t: 700 })
  ink(g, L([x + 4, y + h * 0.35], [x + w - 4, y + h * 0.35]), { w: 2, d: d + 300, t: 300 })
  for (const yy of [y + h * 0.1, y + h * 0.45]) ink(g, L([x + w - 16, yy], [x + w - 16, yy + 30]), { w: 2.6, d: d + 400, t: 200 })
}

export const AHA_TECHNIK: Bite[] = [
  {
    id: 'touchscreen',
    area: 'TECH',
    day: 62,
    hook: 'Woher weiß dein Handy, wo dein Finger ist?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [],
    draw: {
      handy(g) {
        phone(g, 100, 80, 160, 320, 0, true)
        ripple(g, 186, 228, 6, 30, { n: 2, ms: 1400, d: 1300, w: 1.4 })
        finger(g, 186, 232, 1, 600)
      },
      gitter(g) {
        // Schichten auseinandergezogen: Deckglas, Sensorgitter (Zeilen und Spalten), darunter die Pixel
        const layer = (y: number): P[] => [[60, y], [260, y], [310, y + 60], [110, y + 60], [60, y]]
        const sk = (p: P, y: number): P => [60 + p[0] * 200 + p[1] * 50, y + p[1] * 60]
        const pix = layer(540)
        blank(g, pix)
        ink(g, pix, { w: 2.2, t: 500 })
        for (let r = 0; r < 6; r++) for (let c = 0; c < 16; c++) {
          const a = sk([c / 16 + 0.01, r / 6 + 0.02], 540)
          ink(g, [a, [a[0] + 9, a[1]], [a[0] + 12, a[1] + 7], [a[0] + 3, a[1] + 7], a], { w: 0.6, d: 300 + r * 40, t: 60 })
        }
        const sen = layer(440)
        blank(g, sen)
        ink(g, sen, { w: 2.2, d: 400, t: 500 })
        for (let i = 1; i < 8; i++) ink(g, L(sk([i / 8, 0.04], 440), sk([i / 8, 0.96], 440)), { w: 1.2, d: 600 + i * 40, t: 200 })
        for (let i = 1; i < 5; i++) dashes(g, L(sk([0.02, i / 5], 440), sk([0.98, i / 5], 440)), { w: 1.2, d: 800 + i * 40, dash: 5, gap: 4 })
        for (let i = 1; i < 8; i++) for (let k = 1; k < 5; k++) {
          const q = sk([i / 8, k / 5], 440)
          dot(g, q[0], q[1], 1.6, 1000 + (i + k) * 20)
        }
        const gl = layer(340)
        blank(g, gl)
        hatch(g, gl, 900)
        ink(g, gl, { w: 2.6, d: 700, t: 500 })
        for (const [x, y0, y1] of [[60, 340, 440], [260, 340, 440], [310, 400, 500], [60, 440, 540], [310, 500, 600]] as const) dashes(g, L([x, y0], [x, y1]), { w: 0.9, d: 1100, dash: 3, gap: 5 })
        text(g, 316, 386, 'Glas', { cls: 's', d: 1200 })
        text(g, 316, 486, 'Sensor', { cls: 's', d: 1300 })
        text(g, 316, 586, 'Pixel', { cls: 's', d: 1400 })
      },
      feld(g) {
        // Schnitt: unter dem Glas zwei Elektroden; ihr Streufeld wölbt sich über die Oberfläche
        const glass = RR(30, 520, 300, 30, 3)
        blank(g, glass)
        hatch(g, glass, 400)
        ink(g, glass, { w: 2.4, t: 500 })
        for (const x of [100, 260]) {
          hatch(g, RR(x - 30, 552, 60, 12, 3), 500, true)
          ink(g, RR(x - 30, 552, 60, 12, 3), { w: 2.2, d: 200, t: 300 })
        }
        text(g, 100, 590, '+', { anchor: 'middle', size: 20, d: 700 })
        text(g, 260, 590, '−', { anchor: 'middle', size: 20, d: 700 })
        for (const [r, dd] of [[40, 600], [70, 750], [100, 900]] as const) {
          const p = E(180, 556, r + 40, r * 1.1, 180, 360)
          ink(g, p, { w: 1.4, d: dd, t: 500 })
          flow(g, p, { n: 2, ms: 1600, d: dd + 500, r: 1.8 })
        }
      },
      beruehren(g) {
        const glass = RR(30, 520, 300, 30, 3)
        blank(g, glass)
        hatch(g, glass, 400)
        ink(g, glass, { w: 2.4, t: 500 })
        for (const x of [100, 260]) {
          hatch(g, RR(x - 30, 552, 60, 12, 3), 500, true)
          ink(g, RR(x - 30, 552, 60, 12, 3), { w: 2.2, d: 200, t: 300 })
        }
        finger(g, 180, 382, 0.9, 500)
        // Feldlinien biegen sich zum Finger, Ladung fließt ab
        for (const k of [-1, 1]) {
          const p = B([180 + k * 80, 552], [180 + k * 80, 470], [180 + k * 40, 420], [180 + k * 14, 400])
          ink(g, p, { w: 1.4, d: 900, t: 500 })
          flow(g, p, { n: 3, ms: 1200, d: 1300, r: 2 })
        }
        ink(g, E(180, 556, 120, 60, 180, 360), { w: 1, d: 1000, t: 500 })
      },
      punkt(g) {
        phone(g, 90, 300, 180, 340)
        wires(g, 104, 330, 152, 290, 7, 200)
        // Messwerte je Kreuzung: je näher an der Fingerkuppe, desto stärker die Änderung
        for (let i = 1; i < 7; i++) for (let k = 1; k < 7; k++) {
          const x = 104 + (152 * i) / 7
          const y = 330 + (290 * k) / 7
          const dd = Math.hypot(x - 191, y - 454)
          if (dd < 70) {
            const r = Math.max(2, 9 - dd / 9)
            if (dd < 40) hatch(g, E(x, y, r), 700, true)
            ink(g, E(x, y, r), { w: 1.2, d: 600 + dd * 4, t: 150 })
          }
        }
        ink(g, L([170, 454], [212, 454]), { w: 1.6, d: 1300, t: 200 })
        ink(g, L([191, 433], [191, 475]), { w: 1.6, d: 1300, t: 200 })
        ink(g, E(191, 454, 13), { w: 2, d: 1400, t: 300 })
      },
      tempo(g) {
        // ein Messdurchgang nach dem anderen: Zeile für Zeile, immer wieder
        phone(g, 90, 300, 180, 340)
        wires(g, 104, 330, 152, 290, 7, 200)
        const sc = glide(g, 0, 290, { ms: 900, d: 900, loop: true })
        hatch(sc, RR(104, 326, 152, 10, 3), 900, true)
        clock(g, 310, 360, 22, 0, 0, 600)
        const h = spin(g, 310, 360, 1000, 900)
        ink(h, L([310, 360], [310, 344]), { w: 1.8, d: 900, t: 100 })
      },
      multi(g) {
        // zwei Finger spreizen sich: das Bild darunter wird größer
        phone(g, 90, 300, 180, 340)
        const pic = mk('g', {}, g)
        mk('animateTransform', { attributeName: 'transform', type: 'scale', values: '0.8;1.15;0.8', dur: '3s', begin: '1s', repeatCount: 'indefinite' }, pic)
        const wr = mk('g', { transform: 'translate(180 470)' }, g)
        wr.appendChild(pic)
        mountain(pic, -60, 60, 40, [0, -40], 300, false)
        mountain(pic, 10, 80, 40, [44, -10], 400, true)
        sun(pic, -40, -50, 10, 500, 8)
        for (const [x, y, dx, dy] of [[150, 420, -1, -1], [230, 520, 1, 1]] as const) {
          const f = wobble(g, { dx: dx * 14, dy: dy * 14, ms: 3000, d: 1000 })
          ink(f, E(x, y, 20), { w: 2, d: 600, t: 300 })
          dot(f, x, y, 4, 900)
        }
      },
      handschuh(g) {
        // Strickhandschuh: Maschenreihen, dicker Bund – die Wolle isoliert
        const p: P[] = smooth([[110, 650], [102, 560], [96, 470], [104, 400], [130, 392], [138, 440], [146, 360], [170, 356], [176, 430], [186, 350], [210, 352], [212, 432], [224, 370], [248, 376], [244, 470], [262, 430], [282, 446], [256, 560], [250, 650]], 4)
        blank(g, p)
        hatch(g, p, 400)
        ink(g, p, { w: 3, t: 800 })
        for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) {
          const x = 120 + c * 22 + (r % 2) * 8
          const y = 470 + r * 18
          if (x > 240) continue
          ink(g, [[x - 5, y - 4], [x, y + 3], [x + 5, y - 4]], { w: 1, d: 700 + (r * 6 + c) * 10, t: 60 })
        }
        hatch(g, RR(104, 610, 148, 40, 6), 900, true)
        ink(g, RR(104, 610, 148, 40, 6), { w: 2.2, d: 800, t: 300 })
        cross(g, 300, 330, 0.9, 1200)
      },
      wurst(g) {
        // Wurst mit abgebundenen Enden auf dem Display – die Berührung zählt
        phone(g, 100, 300, 160, 330)
        const w = [...B([70, 470], [70, 430], [290, 410], [300, 450]), ...B([300, 450], [306, 490], [90, 510], [70, 470]).slice(1)]
        blank(g, w)
        hatch(g, w, 600)
        ink(g, w, { w: 3, d: 300, t: 700 })
        for (const [x, y] of [[66, 470], [304, 450]] as const) ink(g, E(x, y, 5, 8), { w: 1.8, d: 800, t: 200 })
        for (let k = 0; k < 6; k++) ink(g, E(110 + k * 30, 462 - k * 3, 4, 2), { w: 0.9, d: 900 + k * 40, t: 80 })
        ripple(g, 180, 480, 6, 30, { n: 2, ms: 1400, d: 1100, w: 1.4 })
        check(g, 300, 360, 0.8, 1300)
      },
      resistiv(g) {
        // zwei leitende Folien mit Abstandshaltern; der Druck biegt die obere durch, bis sie die untere berührt
        ink(g, L([40, 520], [320, 520]), { w: 2.6, t: 500 })
        hatch(g, RR(40, 522, 280, 16, 2), 400, true)
        for (let k = 0; k < 8; k++) if (k !== 4 && k !== 3) ball(g, 60 + k * 34, 512, 4, { d: 500 + k * 40, t: 0, fill: 'dicht', w: 1 })
        ink(g, B([40, 500], [140, 500], [170, 518], [180, 518]), { w: 2.6, d: 300, t: 400 })
        ink(g, B([180, 518], [190, 518], [220, 500], [320, 500]), { w: 2.6, d: 400, t: 400 })
        const pen: P[] = [[172, 380], [188, 380], [188, 470], [180, 494], [172, 470], [172, 380]]
        blank(g, pen)
        ink(g, pen, { w: 2.2, d: 600, t: 400 })
        hatch(g, [[172, 380], [188, 380], [188, 400], [172, 400]], 900, true)
        arrow(g, L([210, 400], [210, 470]), { w: 2.2, d: 900, t: 300, head: 8 })
        text(g, 220, 430, 'Druck', { cls: 's', d: 1100 })
        ripple(g, 180, 519, 4, 24, { n: 2, ms: 1200, d: 1300, w: 1, ry: 0.4 })
      },
      geschichte(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: '1965', sub: 'E. A. Johnson', up: true },
          { at: 0.8, label: '2007', sub: 'Multitouch für alle', big: true },
        ])
        // Radarschirm der Flugsicherung und das erste Multitouch-Handy
        ink(g, E(78, 580, 34), { w: 2.4, d: 1200, t: 400 })
        ink(g, E(78, 580, 20), { w: 1, d: 1300, t: 300 })
        const sw = spin(g, 78, 580, 3000, 1500)
        ink(sw, L([78, 580], [78, 548]), { w: 1.6, d: 1500, t: 100 })
        dot(g, 90, 566, 2.4, 1600)
        dot(g, 64, 594, 2.4, 1700)
        phone(g, 236, 540, 52, 96, 1600, false)
      },
      wasser(g) {
        phone(g, 90, 300, 180, 340, 0, true)
        for (const [x, y, r] of [[150, 400, 14], [210, 470, 18], [160, 540, 11], [230, 380, 8]] as const) {
          const dp: P[] = E(x, y, r, r * 0.75)
          blank(g, dp)
          ink(g, dp, { w: 2, d: 600, t: 200 })
          ink(g, E(x - r * 0.3, y - r * 0.25, r * 0.25, r * 0.15, 180, 330), { w: 1, d: 800, t: 100 })
          const f = mk('g', { class: 'blink', style: `--d:${1000 + x * 2}ms` }, g)
          cross(f, x + r + 10, y - r, 0.35, 1000)
        }
      },
      ende(g) {
        phone(g, 120, 360, 120, 240, 0, true)
        ripple(g, 180, 480, 6, 30, { n: 2, ms: 1400, d: 900, w: 1.4 })
        dot(g, 180, 480, 5, 700)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { handy: {} } },
      { t: T('Die meisten Handys haben einen **kapazitiven** Touchscreen. Dein Finger drückt dabei gar nichts – er stört ein elektrisches Feld.', 64), gfx: { feld: {} } },
      { t: T('Unter dem Glas liegt ein feines Gitter aus **durchsichtigen** Leiterbahnen – meist aus Indiumzinnoxid.', 64), gfx: { gitter: {} } },
      { t: T('Die Bahnen laufen in **Zeilen und Spalten**. An jeder Kreuzung entsteht ein winziger Kondensator, der etwas Ladung speichert.', 64), gfx: { gitter: {} } },
      { t: T('Dein Körper leitet Strom – er besteht ja großteils aus **salzigem Wasser**.', 64), gfx: { beruehren: {} } },
      { t: T('Kommt dein Finger nah, zieht er an den Kreuzungen darunter ein wenig Ladung ab. Das Feld dort **verändert sich**.', 64), gfx: { beruehren: {} } },
      { t: T('Jede Kreuzung ist also ein winziger **Sensor**. Ein Handydisplay hat Hunderte davon.', 64), gfx: { gitter: {} } },
      { t: T('Ein Chip misst ständig alle Kreuzungen – oft **120-mal** pro Sekunde oder schneller.', 64), gfx: { tempo: {} } },
      { t: T('Er sieht dann, wo sich etwas verändert hat, und berechnet daraus die **Mitte** deiner Fingerkuppe.', 64), gfx: { punkt: {} } },
      { t: T('Weil jede Kreuzung einzeln gemessen wird, erkennt das Display **mehrere Finger** zugleich – und daraus Gesten wie Zoomen.', 64), gfx: { multi: {} } },
      { t: T('Das Display selbst – die Pixel – ist eine eigene Schicht darunter. Der Touchsensor ist eine **durchsichtige Folie** obendrauf.', 64), gfx: { gitter: {} } },
      { t: T('Darum klappt es mit dicken **Wollhandschuhen** nicht: Wolle isoliert, es fließt keine Ladung ab.', 64), gfx: { handschuh: {} } },
      { t: T('Spezielle Handschuhe haben leitende Fäden in den Fingerspitzen – und auch eine **Wurst** funktioniert, sie ist salzig und feucht.', 64), gfx: { wurst: {} } },
      { t: T('Ein Eingabestift funktioniert nur, wenn seine Spitze **leitet** oder selbst ein Signal sendet.', 64), gfx: { punkt: {} } },
      { t: T('Wassertropfen verwirren das Display: Wasser leitet auch. Darum spielt der Bildschirm unter der Dusche **verrückt**.', 64), gfx: { wasser: {} } },
      { t: T('Ältere Geräte nutzten **resistive** Touchscreens: Zwei Folien berühren sich, wo man drückt. Dafür reichte auch ein Fingernagel.', 64), gfx: { resistiv: {} } },
      { t: T('Moderne Displays erkennen sogar, ob ein Finger nur **schwebt** – das Feld reicht ein paar Millimeter über das Glas.', 64), gfx: { feld: {} } },
      { t: T('Die Idee ist älter als gedacht: Der Brite Eric Arthur Johnson beschrieb 1965 einen kapazitiven Touchscreen – für die **Flugsicherung**.', 64), gfx: { geschichte: {} } },
      { t: T('Für alle kam Multitouch erst **2007** mit dem ersten iPhone.', 64), gfx: { geschichte: {} } },
      { t: T('Jedes Wischen ist also eine winzige Messung: Tausende Kreuzungen spüren deine **Ladung**.', 64), gfx: { gitter: {} } },
      { t: T('Dein Finger ist **Teil des Stromkreises**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Kapazitive Touchscreens haben ein Gitter aus durchsichtigen Leiterbahnen unter dem Glas.', 'Ein leitender Finger zieht an den Kreuzungen Ladung ab; ein Chip misst das vielfach pro Sekunde.', 'Isolierende Handschuhe funktionieren nicht, leitende Gegenstände schon.'],
    sources: ['Walker 2014: Fundamentals of Touch Technologies (SID)', 'Johnson 1965, Electronics Letters 1', 'Barrett & Omote 2010, Information Display 26'],
  },
  {
    id: 'pakete',
    area: 'TECH',
    day: 70,
    hook: 'Wie findet ein Foto seinen Weg durchs Internet?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [],
    draw: {
      netz(g) {
        // Erde mit Knoten in großen Städten; Datenpakete laufen über die Verbindungen
        earth(g, 180, 270, 130, 0, { lon: -20, lat: 35 })
        const pr = geo(180, 270, 130, -20, 35)
        const city = (lon: number, lat: number) => pr(lon, lat).p
        const n = [city(8.7, 50.1), city(-74, 40.7), city(-0.1, 51.5), city(-46.6, -23.5), city(28, -26), city(-122, 37.8)]
        const links: [number, number][] = [[0, 1], [2, 1], [0, 2], [1, 3], [0, 4], [1, 5], [3, 4]]
        links.forEach(([a, b], i) => {
          const m: P = [(n[a][0] + n[b][0]) / 2, (n[a][1] + n[b][1]) / 2 - 40]
          const p = B(n[a], m, m, n[b])
          ink(g, p, { w: 1.4, d: 800 + i * 80, t: 500 })
          flow(g, i % 2 ? p.slice().reverse() : p, { n: 2, ms: 1800 + i * 200, d: 1400, r: 2.6, kind: 'dash' })
        })
        n.forEach(([x, y], i) => ball(g, x, y, 5, { d: 700 + i * 60, fill: 'dicht', t: 0, w: 1.4 }))
      },
      zerlegen(g) {
        // ein Foto (Berg und Sonne) – zerschnitten in Kacheln, die auseinanderfliegen
        const photo = (gr: Element, x: number, y: number, d: number) => {
          mountain(gr, x + 6, x + 100, y + 104, [x + 46, y + 40], d, false)
          mountain(gr, x + 50, x + 114, y + 104, [x + 84, y + 62], d + 100, true)
          sun(gr, x + 86, y + 26, 9, d + 200, 8)
        }
        ink(g, RR(30, 380, 120, 120, 4), { w: 2.8, t: 500 })
        photo(clipBox(g, 30, 380, 120, 120), 30, 380, 200)
        arrow(g, L([160, 440], [196, 440]), { w: 2.4, d: 700, t: 300, head: 9 })
        for (let i = 0; i < 9; i++) {
          const cx = i % 3
          const cy = Math.floor(i / 3)
          const fly = glide(g, (cx - 1) * 10, (cy - 1) * 10, { ms: 1200, d: 1200 + i * 60 })
          const inner = clipBox(fly, 216 + cx * 40, 380 + cy * 40, 40, 40)
          photo(inner, 216, 380, 900)
          ink(fly, RR(216 + cx * 40, 380 + cy * 40, 40, 40, 3), { w: 1.8, d: 900 + i * 70, t: 200 })
        }
      },
      paket(g) {
        // das Paket als Umschlag: Absender, Empfänger, laufende Nummer – und ein Bildschnipsel im Fenster
        const env = RR(40, 360, 280, 190, 8)
        blank(g, env)
        ink(g, env, { w: 2.8, t: 600 })
        ink(g, [[42, 362], [180, 450], [318, 362]], { w: 1.4, d: 300, t: 400 })
        ink(g, RR(262, 374, 44, 50, 3), { w: 1.8, d: 400, t: 300 })
        hatch(g, RR(268, 380, 32, 38, 2), 600)
        text(g, 56, 490, 'von: 84.12.…', { size: 15, d: 400 })
        text(g, 56, 514, 'an: 142.250.…', { size: 15, d: 500 })
        text(g, 56, 538, 'Nr. 731 von 2.000', { size: 15, d: 600 })
        const win = RR(214, 474, 92, 60, 4)
        blank(g, win)
        ink(g, win, { w: 1.8, d: 700, t: 300 })
        mountain(g, 218, 302, 532, [258, 490], 900, true)
      },
      wege(g) {
        const n: P[] = [[40, 480], [130, 360], [130, 600], [230, 360], [230, 600], [320, 480]]
        const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 4], [1, 4], [3, 5], [4, 5]]
        for (const [a, b] of edges) ink(g, L(n[a], n[b]), { w: 2, d: 200, t: 400 })
        n.slice(1, 5).forEach(([x, y], i) => {
          blank(g, RR(x - 18, y - 10, 36, 20, 4))
          ink(g, RR(x - 18, y - 10, 36, 20, 4), { w: 2, d: 400 + i * 60, t: 300 })
          for (const k of [-8, 0, 8]) mk('circle', { cx: x + k, cy: y + 4, r: 1.6, class: 'k blink', style: `--d:${600 + i * 100 + k * 20}ms` }, g)
        })
        // links: Handy, rechts: Server
        ink(g, RR(28, 456, 24, 44, 5), { w: 2, d: 300, t: 300 })
        ink(g, RR(306, 450, 30, 60, 3), { w: 2, d: 300, t: 300 })
        for (const k of [0, 1, 2]) ink(g, L([310, 462 + k * 16], [332, 462 + k * 16]), { w: 1, d: 500, t: 100 })
        cross(g, 180, 600, 0.6, 900)
        const paths: P[][] = [[n[0], n[1], n[3], n[5]], [n[0], n[1], n[4], n[5]], [n[0], n[2], n[4], n[5]]]
        paths.forEach((p, i) => flow(g, p, { n: 2, ms: 2600 + i * 300, d: 1100 + i * 300, r: 3, kind: 'dash' }))
      },
      router(g) {
        // WLAN-Router: Antennen, Lämpchen; Pakete kommen an und werden je nach Ziel weitergeschickt
        const box0 = RR(130, 450, 100, 40, 8)
        blank(g, box0)
        ink(g, box0, { w: 2.6, t: 500 })
        for (const x of [146, 214]) ink(g, L([x, 450], [x + (x < 180 ? -10 : 10), 400]), { w: 2.4, d: 300, t: 300 })
        for (let k = 0; k < 4; k++) mk('circle', { cx: 160 + k * 14, cy: 470, r: 2.2, class: 'k blink', style: `--d:${400 + k * 150}ms` }, g)
        for (const [x, y] of [[40, 360], [320, 380], [310, 600], [50, 600]] as const) {
          const p = L([180 + (x - 180) * 0.2, 470 + (y - 470) * 0.2], [x, y])
          ink(g, p, { w: 1.8, d: 300, t: 300 })
          ball(g, x, y, 10, { d: 500, fill: 'hell', t: 200 })
        }
        flow(g, L([50, 600], [160, 490]), { n: 3, ms: 1500, d: 900, r: 3, kind: 'dash' })
        flow(g, L([200, 450], [320, 380]), { n: 3, ms: 1500, d: 1600, r: 3, kind: 'dash' })
        // Wegweiser: Ziel 142… → rechts oben
        ink(g, L([180, 400], [180, 340]), { w: 2, d: 900, t: 200 })
        const sign: P[] = [[180, 326], [236, 326], [248, 336], [236, 346], [180, 346], [180, 326]]
        blank(g, sign)
        ink(g, sign, { w: 1.8, d: 1000, t: 300 })
        text(g, 186, 341, '142…', { cls: 's', d: 1100 })
      },
      zusammen(g) {
        for (let i = 0; i < 9; i++) {
          const missing = i === 5
          const x = 90 + (i % 3) * 64
          const y = 380 + Math.floor(i / 3) * 64
          if (missing) dashes(g, RR(x, y, 56, 56, 4), { w: 1.6, d: 400 })
          else {
            const t = group(g)
            ink(t, RR(x, y, 56, 56, 4), { w: 2.4, d: i * 80, t: 200 })
            text(t, x + 28, y + 35, String(i + 1), { anchor: 'middle', size: 18, d: i * 80 + 100 })
          }
        }
        text(g, 246, 486, '6?', { anchor: 'middle', size: 20, d: 900 })
        const back = B([270, 470], [310, 470], [330, 420], [330, 330])
        arrow(g, back, { w: 2, d: 1200, t: 500, head: 8 })
        flow(g, back, { n: 2, ms: 1200, d: 1700, r: 2.6, kind: 'dash' })
      },
      postkarten(g) {
        // ein Buch, seine Seiten fliegen als nummerierte Postkarten davon
        const book: P[] = [[40, 560], [130, 540], [130, 640], [40, 660], [40, 560]]
        blank(g, book)
        hatch(g, book, 400, true)
        ink(g, book, { w: 2.6, t: 500 })
        for (let i = 0; i < 4; i++) {
          const f = glide(g, 30 + i * 46, -110 - i * 30 + (i % 2) * 20, { ms: 1400, d: 600 + i * 300 })
          const card = RR(90, 540, 60, 40, 3)
          blank(f, card)
          ink(f, card, { w: 2, d: 500 + i * 300, t: 200 })
          for (const y of [552, 560, 568]) ink(f, L([96, y], [126, y]), { w: 0.8, d: 700 + i * 300, t: 100 })
          ink(f, RR(132, 546, 12, 14, 1), { w: 1, d: 700 + i * 300, t: 100 })
          text(f, 120, 576, String(i + 1), { anchor: 'middle', cls: 's', d: 800 + i * 300 })
        }
      },
      arpanet(g) {
        timeline(g, 30, 330, 360, [{ at: 0.35, label: '1969', sub: 'ARPANET', up: true }])
        // die ersten vier Knoten im Westen der USA
        const pr = mapRegion(g, 30, 420, 300, 210, -125, -105, 30, 44, 300)
        const nodes: [number, number, string][] = [[-118.4, 34.1, 'UCLA'], [-122.2, 37.4, 'SRI'], [-119.8, 34.4, 'UCSB'], [-111.9, 40.8, 'Utah']]
        const pts = nodes.map(([lo, la]) => pr(lo, la))
        for (const [a, b] of [[0, 1], [0, 2], [1, 2], [1, 3]] as const) {
          ink(g, L(pts[a], pts[b]), { w: 2, d: 1200, t: 400 })
          flow(g, L(pts[a], pts[b]), { n: 1, ms: 1400, d: 1800, r: 2.4, kind: 'dash' })
        }
        nodes.forEach(([, , n], i) => {
          ball(g, pts[i][0], pts[i][1], 6, { d: 1000 + i * 100, fill: 'dicht', t: 0, w: 1.4 })
          const [dx, dy, an] = ([[12, 16, 'start'], [-10, -8, 'end'], [-10, -10, 'end'], [10, -8, 'start']] as const)[i]
          text(g, pts[i][0] + dx, pts[i][1] + dy, n, { cls: 's halo', anchor: an, d: 1100 + i * 100 })
        })
      },
      lo(g) {
        // Fernschreiber-Terminal: „LO“, dann Absturz
        const scr = RR(60, 360, 240, 170, 14)
        blank(g, scr)
        ink(g, scr, { w: 3, t: 600 })
        ink(g, RR(80, 380, 200, 120, 8), { w: 1.6, d: 300, t: 500 })
        text(g, 100, 440, 'LO', { size: 44, d: 700, cls: 'serif' })
        const cur = mk('g', { class: 'blink', style: '--d:900ms' }, g)
        hatch(cur, RR(172, 412, 16, 30, 1), 900, true)
        ink(g, RR(40, 530, 280, 60, 8), { w: 2.6, d: 400, t: 500 })
        for (let r = 0; r < 2; r++) for (let c = 0; c < 10; c++) ink(g, RR(54 + c * 26, 542 + r * 22, 20, 16, 3), { w: 1, d: 600 + (r * 10 + c) * 15, t: 80 })
        bolt(g, [[290, 330], [272, 352], [288, 356], [268, 382]], 1600, 3)
        rays(g, 300, 330, 10, 22, 7, 1700)
      },
      kabel(g) {
        // Meer im Schnitt: Schiff, Wasser, Fische, Kabel am Grund; daneben der Querschnitt des Kabels
        const ship: P[] = [[60, 330], [140, 330], [130, 346], [70, 346], [60, 330]]
        blank(g, ship)
        hatch(g, ship, 400, true)
        ink(g, ship, { w: 2.2, t: 400 })
        ink(g, RR(84, 314, 30, 16, 2), { w: 1.8, d: 200, t: 200 })
        sea(g, 20, 340, 344, 300, 2)
        const bed: P[] = smooth([[20, 600], [100, 590], [200, 606], [340, 594]])
        ink(g, bed, { w: 2.6, d: 400, t: 700 })
        hatch(g, [[20, 600], ...bed, [340, 640], [20, 640]], 900)
        ink(g, B([20, 596], [120, 586], [240, 602], [340, 590]), { w: 4, d: 600, t: 900 })
        flow(g, B([20, 596], [120, 586], [240, 602], [340, 590]), { n: 4, ms: 1600, d: 1500, r: 2.2 })
        for (const [x, y] of [[90, 420], [250, 480]] as const) {
          const f = wobble(g, { dx: -10, ms: 3000, d: 900 })
          ink(f, [...B([x, y], [x + 8, y - 7], [x + 20, y - 6], [x + 26, y]), ...B([x + 26, y], [x + 20, y + 6], [x + 8, y + 7], [x, y]).slice(1)], { w: 1.6, d: 800, t: 300 })
          ink(f, [[x, y], [x - 8, y - 6], [x - 8, y + 6], [x, y]], { w: 1.4, d: 900, t: 200 })
        }
        // Querschnitt: Schutzhülle, Stahldrähte, Kupfer, Glasfasern
        blank(g, E(270, 400, 44))
        ink(g, E(270, 400, 44), { w: 2.6, d: 1100, t: 400 })
        for (let k = 0; k < 14; k++) ink(g, E(270 + Math.cos(k * 0.449) * 34, 400 + Math.sin(k * 0.449) * 34, 4.5), { w: 1, d: 1300 + k * 20, t: 80 })
        hatch(g, [...E(270, 400, 26), ...E(270, 400, 14, 14, 360, 0)], 1500, true)
        for (const [dx, dy] of [[-5, -4], [5, -4], [0, 5]] as const) dot(g, 270 + dx, 400 + dy, 2.2, 1600)
        dashes(g, L([240, 432], [210, 588]), { w: 1, d: 1400, dash: 3, gap: 4 })
      },
      anteil(g) {
        hbars(g, [
          { label: 'Seekabel', v: 99, fmt: () => 'über 95 %', dense: true },
          { label: 'Satellit', v: 2, fmt: () => 'kleiner Rest' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'Daten zwischen Kontinenten', { anchor: 'middle', cls: 's', d: 1200 })
      },
      dns(g) {
        // Handy fragt das „Telefonbuch“ nach der Nummer zum Namen
        phone(g, 40, 360, 70, 130)
        text(g, 75, 430, 'wiki…', { anchor: 'middle', cls: 's', d: 500 })
        const bk: P[] = [[220, 360], [320, 370], [320, 490], [220, 480], [220, 360]]
        blank(g, bk)
        hatch(g, [[220, 360], [236, 362], [236, 482], [220, 480]], 600, true)
        ink(g, bk, { w: 2.6, d: 300, t: 500 })
        for (let k = 0; k < 6; k++) ink(g, L([246, 386 + k * 14], [306, 388 + k * 14]), { w: 0.9, d: 600 + k * 50, t: 100 })
        const ask = B([116, 390], [150, 360], [190, 360], [214, 380])
        arrow(g, ask, { w: 2, d: 900, t: 400, head: 8 })
        flow(g, ask, { n: 1, ms: 1400, d: 1300, r: 2.6, kind: 'dash' })
        const ans = B([214, 470], [190, 500], [150, 500], [116, 470])
        arrow(g, ans, { w: 2, d: 1400, t: 400, head: 8 })
        text(g, 165, 530, '185.15.…', { anchor: 'middle', size: 16, d: 1600 })
        box(g, 30, 560, 140, 50, 'wikipedia.org', { size: 14, d: 1800 })
        arrow(g, L([176, 585], [196, 585]), { w: 2.2, d: 2000, t: 200, head: 8 })
        box(g, 202, 560, 130, 50, '185.15.…', { size: 14, fill: true, d: 2100 })
      },
      ende(g) {
        for (let i = 0; i < 9; i++) {
          const cx = i % 3
          const cy = Math.floor(i / 3)
          const f = glide(g, -(cx - 1) * 30, -(cy - 1) * 30, { ms: 1200, d: 300 + i * 80 })
          ink(f, RR(120 + cx * 40 + (cx - 1) * 30, 400 + cy * 40 + (cy - 1) * 30, 40, 40, 3), { w: 2, d: i * 80, t: 200 })
        }
        mountain(g, 126, 236, 516, [180, 446], 1500, true)
        sun(g, 220, 420, 8, 1600, 8)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { netz: {} } },
      { t: T('Du schickst ein Foto ab. Es reist aber nicht am Stück, sondern wird in **Tausende** kleine Pakete zerlegt.', 64), gfx: { zerlegen: {} } },
      { t: T('Jedes Paket ist meist nur rund **1.500 Bytes** groß – ein winziger Schnipsel des Bildes.', 64), gfx: { zerlegen: {} } },
      { t: T('Auf jedem steht wie auf einem Briefumschlag: **Absender**, Empfänger – als IP-Adresse – und eine laufende Nummer.', 64), gfx: { paket: {} } },
      { t: T('Dann geht es von **Router** zu Router. Jeder Router schaut nur auf die Zieladresse und schickt das Paket ein Stück weiter.', 64), gfx: { router: {} } },
      { t: T('Kein Router kennt den ganzen Weg. Jeder weiß nur, welcher Nachbar **näher am Ziel** ist.', 64), gfx: { router: {} } },
      { t: T('Ist eine Leitung verstopft, nimmt das nächste Paket einfach **einen anderen Weg**. Pakete desselben Fotos reisen oft getrennt.', 64), gfx: { wege: {} } },
      { t: T('Am Ziel setzt dein Gerät die Pakete nach ihren Nummern **wieder zusammen** – auch wenn sie durcheinander ankommen.', 64), gfx: { zusammen: {} } },
      { t: T('Fehlt eines, wird es einfach **neu angefordert**. Dafür sorgt das Protokoll TCP.', 64), gfx: { zusammen: {} } },
      { t: T('Stell dir vor, du verschickst ein Buch als **Postkarten**: jede Seite einzeln, nummeriert – der Empfänger sortiert.', 64), gfx: { postkarten: {} } },
      { t: T('Die Idee stammt aus den 1960ern. Ein Netz ohne Zentrale sollte **weiterlaufen**, auch wenn Teile ausfallen.', 64), gfx: { wege: {} } },
      { t: T('1969 verband das **ARPANET** die ersten Rechner an US-Universitäten.', 64), gfx: { arpanet: {} } },
      { t: T('Die allererste Nachricht sollte „LOGIN“ lauten. Nach **zwei Buchstaben** stürzte der Rechner ab – so lautete sie „LO“.', 64), gfx: { lo: {} } },
      { t: T('Und wie findet dein Handy die Adresse? Namen wie wikipedia.org übersetzt das **DNS** in Zahlen – wie ein Telefonbuch.', 64), gfx: { dns: {} } },
      { t: T('Ein einzelnes Video besteht so aus **Millionen** Paketen – jede Sekunde kommen Tausende bei dir an.', 64), gfx: { zerlegen: {} } },
      { t: T('Zwischen den Kontinenten reisen die Pakete fast nie per Satellit, sondern durch **Seekabel** am Meeresgrund.', 64), gfx: { kabel: {} } },
      { t: T('Über 95 Prozent des interkontinentalen Datenverkehrs laufen durch solche Kabel – als **Lichtpulse** in Glasfasern.', 64), gfx: { anteil: {} } },
      { t: T('Ein Paket von Frankfurt nach New York und zurück braucht dabei weniger als **eine Zehntelsekunde**.', 64), gfx: { kabel: {} } },
      { t: T('Dein Foto reist in **Einzelteilen** – und kommt doch ganz an.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Daten werden in kleine nummerierte Pakete mit Absender- und Zieladresse zerlegt.', 'Router leiten jedes Paket einzeln weiter; Wege können sich unterscheiden, TCP setzt zusammen und fordert Fehlendes nach.', 'Interkontinental laufen über 95 % der Daten durch Seekabel.'],
    sources: ['Kurose & Ross: Computer Networking – A Top-Down Approach', 'Kleinrock 2010, IEEE Communications Magazine (ARPANET, „LO“)', 'TeleGeography: Submarine Cable FAQ'],
  },
  {
    id: 'farben-schluessel',
    area: 'TECH',
    day: 70,
    hook: 'Wie vereinbaren zwei Fremde ein Geheimnis, wenn alle mithören?',
    mood: 'raetsel',
    ambience: 'nacht',
    images: [],
    draw: {
      lauscher(g) {
        // Anna und Ben an ihren Laptops, dazwischen die Leitung – und jemand zapft sie an
        const laptop = (x: number, y: number, d: number, flip = false) => {
          const sc: P[] = flip ? [[x, y], [x - 4, y - 40], [x - 56, y - 40], [x - 52, y]] : [[x, y], [x + 4, y - 40], [x + 56, y - 40], [x + 52, y]]
          blank(g, [...sc, sc[0]])
          ink(g, [...sc, sc[0]], { w: 2.2, d, t: 300 })
          ink(g, L([x - (flip ? 62 : -2), y], [x + (flip ? 2 : 62), y]), { w: 2.6, d: d + 200, t: 200 })
        }
        fig(g, 50, 420, 2.6)
        laptop(70, 404, 200)
        fig(g, 310, 420, 2.6, { d: 200 })
        laptop(290, 404, 300, true)
        const wire = L([130, 404], [230, 404])
        ink(g, wire, { w: 2, d: 600, t: 400 })
        flow(g, wire, { n: 2, ms: 1400, d: 1100, r: 3, kind: 'dash' })
        ink(g, L([180, 404], [180, 300]), { w: 1.4, d: 900, t: 300 })
        fig(g, 180, 296, 2.2, { d: 400 })
        ink(g, E(180, 232, 14, 14, 180, 360), { w: 2.4, d: 800, t: 300 })
        for (const s of [-1, 1]) ink(g, RR(180 + s * 14 - 4, 228, 8, 12, 3), { w: 2, d: 900, t: 200 })
        question(g, 90, 160, 0.6, 1200)
        question(g, 270, 160, 0.6, 1300)
      },
      problem(g) {
        fig(g, 60, 600, 3.2)
        fig(g, 300, 600, 3.2, { d: 200 })
        const wire = L([100, 540], [260, 540])
        ink(g, wire, { w: 2.4, d: 400, t: 500 })
        const env = mk('g', { opacity: 0 }, g)
        letter(env, -16, -10, 32, 0)
        mk('set', { attributeName: 'opacity', to: 1, begin: '1s', fill: 'freeze' }, env)
        mk('animateMotion', { path: 'M100 540L260 540', dur: '2.6s', begin: '1s', repeatCount: 'indefinite' }, env)
        // das Auge des Lauschers über der Leitung
        eye(g, 180, 420, 0.8, 900)
        dashes(g, L([180, 446], [180, 520]), { w: 1.2, d: 1100, dash: 4, gap: 4 })
        text(g, 60, 640, 'Anna', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 300, 640, 'Ben', { anchor: 'middle', cls: 's', d: 900 })
      },
      gelb(g) {
        pot(g, 180, 560, ['gelb'])
        fig(g, 70, 600, 2.6, { d: 300, arms: 'push' })
        fig(group(g, '', 'transform: scale(-1, 1); transform-origin: 290px 600px'), 290, 600, 2.6, { d: 400, arms: 'push' })
        legend(g, 100, 640, ['gelb'], 800)
      },
      geheim(g) {
        pot(g, 90, 560, ['rot'], 0)
        pot(g, 270, 560, ['blau'], 300)
        legend(g, 90, 640, ['rot', 'blau'], 900)
        eye(g, 180, 380, 0.5, 700)
        cross(g, 180, 380, 0.9, 1000)
      },
      mischen(g) {
        // jeder kippt seine geheime Farbe ins Gelb
        pot(g, 90, 600, ['gelb', 'rot'], 600)
        pot(g, 270, 600, ['gelb', 'blau'], 900)
        for (const [x, d] of [[90, 0], [270, 300]] as const) {
          const cup = group(g, '', `transform: rotate(${x < 180 ? 40 : -40}deg); transform-origin: ${x}px 440px`)
          const c: P[] = [[x - 16, 420], [x - 14, 456], [x + 14, 456], [x + 16, 420]]
          blank(cup, [...c, c[0]])
          paint(cup, x - 14, 432, 28, 22, [x < 180 ? 'rot' : 'blau'], d + 200)
          ink(cup, c, { w: 2.2, d, t: 300 })
          flow(g, L([x + (x < 180 ? 18 : -18), 446], [x, 520]), { n: 3, ms: 700, d: d + 600, r: 2.6 })
        }
      },
      tausch(g) {
        // die Mischungen wechseln offen die Seiten – das Auge sieht beide
        const a = glide(g, 220, 0, { ms: 1800, d: 900 })
        pot(a, 70, 600, ['gelb', 'rot'], 0)
        const b = glide(g, -220, 0, { ms: 1800, d: 900 })
        pot(b, 290, 600, ['gelb', 'blau'], 200)
        carrow(g, [110, 500], [250, 500], 40, { d: 600 })
        carrow(g, [250, 470], [110, 470], 40, { d: 900 })
        eye(g, 180, 380, 0.7, 400)
      },
      gleich(g) {
        pot(g, 90, 560, ['gelb', 'blau', 'rot'], 0)
        pot(g, 270, 560, ['gelb', 'rot', 'blau'], 300)
        text(g, 180, 540, '=', { anchor: 'middle', size: 40, d: 900 })
        legend(g, 40, 640, ['gelb', 'rot', 'blau'], 1100)
      },
      entmischen(g) {
        // Mischen geht in einem Schritt – zurück führt kein Weg
        pot(g, 70, 520, ['gelb'], 0)
        pot(g, 70, 640, ['rot'], 100)
        pot(g, 270, 580, ['gelb', 'rot'], 400)
        arrow(g, B([110, 500], [170, 500], [200, 540], [230, 560]), { w: 2.4, d: 700, t: 400, head: 9 })
        arrow(g, B([110, 620], [170, 620], [200, 600], [230, 590]), { w: 2.4, d: 800, t: 400, head: 9 })
        check(g, 170, 470, 0.7, 1100)
        dashes(g, B([270, 480], [260, 420], [160, 400], [100, 440]), { w: 1.6, d: 1300, dash: 6, gap: 6 })
        cross(g, 190, 404, 0.8, 1600)
      },
      zahlen(g) {
        // Uhr mit 17 Stellen: die Potenzen von 3 springen scheinbar wild im Kreis
        const cx = 180
        const cy = 470
        ink(g, E(cx, cy, 110), { w: 2.6, t: 700 })
        const at = (k: number): P => [cx + Math.cos(rad(-90 + (k * 360) / 17)) * 110, cy + Math.sin(rad(-90 + (k * 360) / 17)) * 110]
        for (let k = 0; k < 17; k++) {
          const p = at(k)
          dot(g, p[0], p[1], 2.4, 300 + k * 30)
          text(g, cx + Math.cos(rad(-90 + (k * 360) / 17)) * 128, cy + Math.sin(rad(-90 + (k * 360) / 17)) * 128 + 4, String(k), { anchor: 'middle', cls: 's', d: 300 + k * 30, size: 11 })
        }
        let v = 1
        const seq: P[] = []
        for (let k = 1; k <= 7; k++) {
          v = (v * 3) % 17
          seq.push(at(v))
        }
        for (let k = 0; k < seq.length - 1; k++) arrow(g, L(seq[k], seq[k + 1]), { w: 1.4, d: 1000 + k * 300, t: 250, head: 6 })
        ball(g, seq[6][0], seq[6][1], 7, { d: 3000, fill: 'dicht', t: 0, w: 1.4 })
        text(g, cx, 640, '3⁷ ≡ 11 (mod 17)', { anchor: 'middle', size: 22, cls: 'serif', d: 3200 })
      },
      diffie(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1976', sub: 'Stanford', up: true }])
        fig(g, 120, 600, 2.4, { d: 900 })
        fig(g, 170, 600, 2.4, { d: 1000 })
        ink(g, RR(210, 540, 90, 60, 4), { w: 2, d: 1200, t: 300 })
        for (const y of [556, 568, 580]) ink(g, L([218, y], [290, y]), { w: 0.9, d: 1300, t: 100 })
      },
      schloss(g) {
        // Browserfenster mit Adresszeile und Schloss
        const win = RR(30, 380, 300, 230, 10)
        blank(g, win)
        ink(g, win, { w: 3, t: 600 })
        ink(g, L([30, 410], [330, 410]), { w: 2, d: 200, t: 400 })
        for (const x of [46, 60, 74]) ink(g, E(x, 395, 4), { w: 1.4, d: 300, t: 100 })
        ink(g, RR(92, 386, 220, 18, 9), { w: 1.6, d: 400, t: 300 })
        ink(g, RR(100, 393, 9, 7, 1), { w: 1.4, d: 600, t: 100 })
        ink(g, E(104.5, 393, 3, 3, 180, 360), { w: 1.2, d: 600, t: 100 })
        text(g, 116, 400, 'https://', { size: 12, d: 700 })
        const lock = (x: number, y: number, s: number, d: number) => {
          ink(g, RR(x - 40 * s, y, 80 * s, 64 * s, 8), { w: 3, d, t: 600 })
          ink(g, [...L([x - 24 * s, y], [x - 24 * s, y - 24 * s]), ...B([x - 24 * s, y - 24 * s], [x - 24 * s, y - 56 * s], [x + 24 * s, y - 56 * s], [x + 24 * s, y - 24 * s]).slice(1), ...L([x + 24 * s, y - 24 * s], [x + 24 * s, y]).slice(1)], { w: 3, d: d + 300, t: 600 })
          ink(g, E(x, y + 26 * s, 7 * s), { w: 2.4, d: d + 700, t: 200 })
          ink(g, L([x, y + 33 * s], [x, y + 48 * s]), { w: 2.4, d: d + 800, t: 200 })
        }
        lock(180, 500, 1, 900)
      },
      gchq(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.25, label: '1970–74', sub: 'geheim in Großbritannien', up: true },
          { at: 0.6, label: '1976', sub: 'öffentlich', big: true },
          { at: 0.85, label: '1997', sub: 'enthüllt' },
        ])
        // Aktenmappe „Geheim“
        const f: P[] = [[60, 560], [150, 560], [150, 630], [60, 630], [60, 560]]
        blank(g, f)
        hatch(g, f, 1500)
        ink(g, f, { w: 2.2, d: 1300, t: 300 })
        ink(g, RR(74, 584, 62, 20, 2), { w: 1.6, d: 1600, t: 200 })
        cross(g, 105, 594, 0.5, 1800)
      },
      quanten(g) {
        // Quantencomputer („Kronleuchter“ aus Kühlstufen) und ein neues, stärkeres Schloss
        for (let k = 0; k < 4; k++) {
          const w = 140 - k * 24
          const y = 360 + k * 56
          ink(g, RR(120 - w / 2, y, w, 10, 3), { w: 2.2, d: 200 + k * 200, t: 300 })
          for (let j = 0; j < 5; j++) {
            const x = 120 - w / 2 + 10 + (j * (w - 20)) / 4
            ink(g, smooth([[x, y + 10], [x + 4, y + 30], [x - 4, y + 46], [120 + (x - 120) * 0.8, y + 56]], 3), { w: 1, d: 400 + k * 200 + j * 30, t: 200 })
          }
        }
        ink(g, RR(108, 584, 24, 30, 4), { w: 2.2, d: 1100, t: 300 })
        arrow(g, L([170, 500], [210, 500]), { w: 2.2, d: 1300, t: 300, head: 8 })
        const sh: P[] = [[270, 430], [320, 446], [314, 540], [270, 580], [226, 540], [220, 446], [270, 430]]
        blank(g, sh)
        hatch(g, sh, 1600)
        ink(g, sh, { w: 2.6, d: 1400, t: 500 })
        ink(g, RR(254, 500, 32, 26, 3), { w: 2.2, d: 1700, t: 300 })
        ink(g, B([258, 500], [258, 480], [282, 480], [282, 500]), { w: 2.2, d: 1800, t: 200 })
      },
      ende(g) {
        pot(g, 120, 560, ['gelb', 'rot', 'blau'], 0)
        pot(g, 240, 560, ['gelb', 'blau', 'rot'], 200)
        text(g, 180, 540, '=', { anchor: 'middle', size: 34, d: 700 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { lauscher: {} } },
      { t: T('Anna und Ben wollen sich geheim schreiben. Aber jede Nachricht im Internet kann **mitgelesen** werden.', 64), gfx: { problem: {} } },
      { t: T('Sie bräuchten einen gemeinsamen geheimen **Schlüssel**. Doch wie vereinbart man ihn, wenn jemand jedes Wort mithört?', 64), gfx: { problem: {} } },
      { t: T('Ein berühmter Trick, erklärt mit **Farben**: Zuerst einigen sich beide offen auf eine Grundfarbe – sagen wir Gelb.', 64), gfx: { gelb: {} } },
      { t: T('Dann wählt jeder heimlich eine **eigene Farbe**, die er niemandem verrät. Anna nimmt Rot, Ben Blau.', 64), gfx: { geheim: {} } },
      { t: T('Beide mischen ihre geheime Farbe ins **Gelb**.', 64), gfx: { mischen: {} } },
      { t: T('Diese Mischungen **tauschen** sie ganz offen aus. Der Lauscher sieht beide Töpfe.', 64), gfx: { tausch: {} } },
      { t: T('Jetzt gibt Anna ihr geheimes Rot in Bens Mischung. Ben gibt sein geheimes Blau in Annas Mischung.', 64), gfx: { gleich: {} } },
      { t: T('Beide haben nun **dieselbe Farbe**: Gelb, Rot und Blau. Die Reihenfolge beim Mischen spielt keine Rolle.', 64), gfx: { gleich: {} } },
      { t: T('Und der Lauscher? Er kennt Gelb und die beiden Mischungen. Aber Farben lassen sich nicht **entmischen**.', 64), gfx: { entmischen: {} } },
      { t: T('Er kommt nicht an Rot oder Blau – und damit **nie** an die gemeinsame Farbe.', 64), gfx: { entmischen: {} } },
      { t: T('Das Geniale: Das Geheimnis selbst wird **nie verschickt**. Es entsteht auf beiden Seiten gleichzeitig.', 64), gfx: { gleich: {} } },
      { t: T('In echt sind die Farben **riesige Zahlen**. Mischen heißt hier: potenzieren und den Rest beim Teilen nehmen.', 64), gfx: { zahlen: {} } },
      { t: T('Das geht vorwärts in Sekundenbruchteilen. Rückwärts bräuchten selbst Supercomputer bei großen Zahlen **Jahrtausende**.', 64), gfx: { zahlen: {} } },
      { t: T('Veröffentlicht haben das Whitfield Diffie und Martin Hellman 1976 – eine **Revolution** der Verschlüsselung.', 64), gfx: { diffie: {} } },
      { t: T('Kurios: Britische Geheimdienstler hatten ähnliche Ideen schon Jahre vorher – aber sie mussten **schweigen**. Erst 1997 wurde es bekannt.', 64), gfx: { gchq: {} } },
      { t: T('Heute steckt eine Weiterentwicklung im **Schloss-Symbol** deines Browsers. Jeder Besuch einer sicheren Seite beginnt mit so einem Tausch.', 64), gfx: { schloss: {} } },
      { t: T('Ein Haken bleibt: Woher weiß Anna, dass sie wirklich mit Ben redet? Dafür braucht es zusätzlich **Zertifikate** – digitale Ausweise.', 64), gfx: { problem: {} } },
      { t: T('Quantencomputer könnten manche dieser Verfahren knacken. Darum gibt es seit 2024 **neue Standards**, die auch ihnen standhalten sollen.', 64), gfx: { quanten: {} } },
      { t: T('Ein Geheimnis – **gemeinsam gemischt**, nie verschickt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Diffie-Hellman (1976): Zwei Parteien erzeugen über eine abhörbare Leitung einen gemeinsamen geheimen Schlüssel.', 'Analogie Farben: Mischen ist leicht, Entmischen fast unmöglich; mathematisch: Potenzen mit Rest (diskreter Logarithmus).', 'Steckt in HTTPS; wegen Quantencomputern gibt es seit 2024 neue Standards.'],
    sources: ['Diffie & Hellman 1976, IEEE Transactions on Information Theory 22', 'Singh 1999: Geheime Botschaften', 'NIST 2024: FIPS 203 (Post-Quanten-Kryptografie)'],
  },
  {
    id: 'finger-binaer',
    area: 'TECH',
    day: 62,
    hook: 'Bis wie viel kannst du mit zehn Fingern zählen?',
    mood: 'verspielt',
    ambience: 'uhr',
    images: [],
    draw: {
      haende(g) {
        hand(g, 50, 300, [true, true, true, true, true])
        hand(g, 220, 300, [true, true, true, true, true], 300)
      },
      zehn(g) {
        // so zählt man meistens: ein Finger nach dem anderen, 1 bis 10
        hand(g, 50, 440, [true, true, true, true, true])
        hand(g, 220, 440, [true, true, true, true, true], 200)
        const tips: P[] = [[24, 412], [66, 352], [95, 344], [124, 350], [153, 366], [194, 412], [236, 352], [265, 344], [294, 350], [323, 366]]
        tips.forEach(([x, y], i) => {
          const p = pop(g, 700 + i * 160, '50% 50%')
          ink(p, E(x, y - 20, 11), { w: 1.6, t: 0 })
          text(p, x, y - 15, String(i + 1), { anchor: 'middle', cls: 's', fade: false })
        })
      },
      wert(g) {
        hand(g, 130, 470, [true, true, true, true, true], 0, ['1', '2', '4', '8', '16'])
      },
      drei(g) {
        hand(g, 130, 470, [true, true, false, false, false], 0, ['1', '2', '4', '8', '16'])
        bits(g, [0, 0, 0, 1, 1], 900)
      },
      fuenf(g) {
        hand(g, 130, 470, [true, false, true, false, false], 0, ['1', '2', '4', '8', '16'])
        bits(g, [0, 0, 1, 0, 1], 900)
      },
      einunddreissig(g) {
        hand(g, 130, 470, [true, true, true, true, true], 0, ['1', '2', '4', '8', '16'])
        bits(g, [1, 1, 1, 1, 1], 900)
      },
      tausend(g) {
        hand(g, 50, 400, [true, true, true, true, true], 0, ['1', '2', '4', '8', '16'])
        hand(g, 220, 400, [true, true, true, true, true], 300, ['32', '64', '128', '256', '512'])
        for (let i = 0; i < 10; i++) {
          const x = 36 + i * 30
          ink(g, RR(x - 12, 600, 24, 30, 4), { w: 1.8, d: 1200 + i * 60, t: 150 })
          text(g, x, 622, '1', { anchor: 'middle', size: 17, d: 1300 + i * 60 })
        }
      },
      verdoppeln(g) {
        const vals = ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512']
        vals.forEach((v, i) => {
          const x = 36 + (i % 5) * 72
          const y = 380 + Math.floor(i / 5) * 140
          const s = 30 + i * 3
          box(g, x - s / 2, y + 30 - s / 2, s, s, v, { size: 15, d: i * 120, fill: false })
          if (i % 5 < 4) {
            arrow(g, B([x + s / 2 + 2, y + 10], [x + 26, y - 6], [x + 46, y - 6], [x + 72 - (s + 3) / 2 - 2, y + 10]), { w: 1.4, d: i * 120 + 200, t: 200, head: 6 })
            text(g, x + 36, y - 10, '×2', { anchor: 'middle', cls: 's', d: i * 120 + 300, size: 11 })
          }
        })
        arrow(g, B([324, 430], [350, 470], [20, 470], [36, 500]), { w: 1.4, d: 700, t: 400, head: 6 })
      },
      binaer(g) {
        // drei Lampen als Ziffern: an – aus – an, darunter ihre Werte
        ;[[90, true, '4'], [180, false, '2'], [270, true, '1']].forEach(([x, on, v], i) => {
          const cx = x as number
          bulb(g, cx, 470, 1, i * 200)
          if (on) {
            hatch(g, E(cx, 456, 22, 24), i * 200 + 600, false)
            rays(g, cx, 456, 40, 54, 10, i * 200 + 700)
          }
          text(g, cx, 380, on ? '1' : '0', { anchor: 'middle', size: 40, cls: 'serif', d: i * 200 + 400 })
          text(g, cx, 560, v as string, { anchor: 'middle', size: 18, d: i * 200 + 800 })
          ink(g, RR(cx - 20, 540, 40, 30, 6), { w: 1.6, d: i * 200 + 800, t: 200 })
        })
      },
      leibniz(g) {
        timeline(g, 30, 330, 400, [{ at: 0.3, label: '1703', sub: 'Paris, Akademie', up: true }])
        // Blatt mit der Tabelle aus Leibniz' Aufsatz: 0, 1, 10, 11, 100 …
        const sheet: P[] = [[90, 450], [270, 440], [276, 650], [96, 660], [90, 450]]
        blank(g, sheet)
        ink(g, sheet, { w: 2.4, d: 600, t: 500 })
        ;['0', '1', '10', '11', '100', '101', '110', '111'].forEach((b, i) => {
          text(g, 190, 476 + i * 22, b, { anchor: 'end', cls: 'serif', size: 17, d: 900 + i * 120 })
          text(g, 230, 476 + i * 22, String(i), { anchor: 'end', cls: 'it', size: 16, d: 950 + i * 120 })
        })
        ink(g, L([204, 460], [204, 640]), { w: 1, d: 900, t: 400 })
      },
      schalter(g) {
        for (const [x, on] of [[100, true], [260, false]] as const) {
          ink(g, RR(x - 40, 440, 80, 140, 12), { w: 2.8, t: 500, d: x === 100 ? 0 : 200 })
          const k: P[] = on ? RR(x - 24, 456, 48, 54, 8) : RR(x - 24, 510, 48, 54, 8)
          hatch(g, k, 500, true)
          ink(g, k, { w: 2.4, d: 400, t: 300 })
          text(g, x, 620, on ? '1 = an' : '0 = aus', { anchor: 'middle', cls: 's', d: 700 })
          bulb(g, x, 360, 0.8, 600)
          ink(g, B([x, 400], [x + 20, 420], [x - 20, 420], [x, 440]), { w: 1.2, d: 600, t: 300 })
          if (on) {
            hatch(g, E(x, 348, 18, 20), 900)
            rays(g, x, 348, 34, 46, 10, 900)
          }
        }
      },
      chip(g) {
        // Chip mit Beinchen, die Lupe zeigt das Raster winziger Transistoren, die an- und ausgehen
        ink(g, RR(50, 400, 140, 140, 8), { w: 3, t: 600 })
        ink(g, RR(70, 420, 100, 100, 4), { w: 1.4, d: 300, t: 400 })
        for (let i = 0; i < 6; i++) for (const side of [0, 1, 2, 3]) {
          const t = 412 + i * 22
          const [a, b] = side === 0 ? [[50, t], [32, t]] : side === 1 ? [[190, t], [208, t]] : side === 2 ? [[t - 350 + 50, 400], [t - 350 + 50, 382]] : [[t - 350 + 50, 540], [t - 350 + 50, 558]]
          ink(g, L(a as P, b as P), { w: 1.8, d: 400 + i * 40, t: 80 })
        }
        ink(g, L([150, 460], [218, 420]), { w: 1.2, d: 800, t: 200 })
        blank(g, E(270, 420, 74))
        for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
          const x = 232 + c * 12
          const y = 384 + r * 12
          if (Math.hypot(x - 270, y - 420) > 64) continue
          const cell = mk('g', { class: (r * 7 + c) % 3 ? 'blink' : '', style: `--d:${900 + ((r * 13 + c * 7) % 11) * 90}ms` }, g)
          hatch(cell, RR(x - 4, y - 4, 8, 8, 1), 900, true)
          ink(cell, RR(x - 4, y - 4, 8, 8, 1), { w: 0.8, d: 900, t: 50 })
        }
        ink(g, E(270, 420, 74), { w: 3, d: 800, t: 400 })
        ink(g, L([322, 472], [346, 500]), { w: 6, d: 1000, t: 200 })
      },
      byte(g) {
        // acht Schalter = ein Byte; dieses Muster steht für den Buchstaben A
        const bitsA = [0, 1, 0, 0, 0, 0, 0, 1]
        bitsA.forEach((b, i) => {
          const x = 40 + i * 36
          ink(g, RR(x - 14, 400, 28, 60, 6), { w: 2, d: i * 80, t: 200 })
          const k = b ? RR(x - 9, 406, 18, 22, 4) : RR(x - 9, 432, 18, 22, 4)
          hatch(g, k, 300 + i * 80, true)
          ink(g, k, { w: 1.6, d: 200 + i * 80, t: 150 })
          text(g, x, 486, String(b), { anchor: 'middle', size: 18, d: 400 + i * 80 })
        })
        arrow(g, L([180, 506], [180, 546]), { w: 2.4, d: 1200, t: 300, head: 9 })
        text(g, 180, 630, 'A', { anchor: 'middle', size: 80, cls: 'serif', d: 1400 })
      },
      kilo(g) {
        // 2¹⁰: ein Raster aus 32 × 32 Feldern – genau 1.024 Stück
        for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) {
          const x = 84 + c * 6
          const y = 380 + r * 6
          mk('rect', { x, y, width: 4.4, height: 4.4, class: 'k fade', style: `--d:${200 + (r * 32 + c) * 1.2}ms` }, g)
        }
        ink(g, RR(80, 376, 196, 196, 3), { w: 2.4, d: 100, t: 500 })
        text(g, 180, 620, '2¹⁰', { anchor: 'middle', size: 30, cls: 'serif', d: 1600 })
      },
      ende(g) {
        hand(g, 50, 460, [true, false, true, true, false])
        hand(g, 220, 460, [false, true, false, true, true], 300)
      },
      pixel(g) {
        // ein Bildpunkt aus drei Leuchtstreifen, jeder mit 8 Bit Helligkeit
        ink(g, RR(60, 380, 150, 190, 8), { w: 2.8, t: 600 })
        ;[['R', 0.9], ['G', 0.5], ['B', 0.2]].forEach(([l, v], i) => {
          const x = 72 + i * 46
          const h = 150 * (v as number)
          ink(g, RR(x, 396, 34, 150, 5), { w: 1.8, d: 300 + i * 100, t: 300 })
          hatch(g, RR(x, 396 + 150 - h, 34, h, 5), 700 + i * 100, i === 0)
          text(g, x + 17, 590, l as string, { anchor: 'middle', size: 18, d: 800 + i * 100 })
        })
        const b = [1, 1, 1, 0, 0, 1, 1, 0]
        b.forEach((v, k) => {
          const y = 392 + k * 22
          ink(g, RR(250, y, 30, 18, 3), { w: 1.4, d: 1000 + k * 60, t: 100 })
          text(g, 265, y + 14, String(v), { anchor: 'middle', size: 14, d: 1100 + k * 60 })
        })
        ink(g, B([210, 420], [226, 420], [234, 410], [246, 402]), { w: 1.2, d: 1000, t: 200 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { haende: {} } },
      { t: T('Die meisten sagen: bis **zehn**. Ein Finger, eine Zahl.', 64), gfx: { zehn: {} } },
      { t: T('Dabei verschwendest du viel: Ein Finger kann nicht nur mitzählen – er kann **oben oder unten** sein. Und das ist eine Information.', 64), gfx: { haende: { tf: [1, 0, 240] } } },
      { t: T('Gib jedem Finger einen **Wert**: Daumen 1, Zeigefinger 2, Mittelfinger 4, Ringfinger 8, kleiner Finger 16.', 64), gfx: { wert: {} } },
      { t: T('Jetzt zählst du, indem du die Werte der **gestreckten** Finger addierst. Daumen und Zeigefinger: 1 plus 2, also 3.', 64), gfx: { drei: {} } },
      { t: T('Daumen und Mittelfinger: 1 plus 4, also **5**.', 64), gfx: { fuenf: {} } },
      { t: T('Mit allen fünf Fingern oben: 1 + 2 + 4 + 8 + 16 = **31**. Eine Hand reicht schon für 32 Zahlen, die Null eingerechnet.', 64), gfx: { einunddreissig: {} } },
      { t: T('Mit der zweiten Hand geht es weiter: 32, 64, 128, 256, 512. Jeder Finger ist **doppelt** so viel wert wie der vorige.', 64), gfx: { verdoppeln: {} } },
      { t: T('Alle zehn Finger oben ergeben **1.023**. Mit null Fingern dazu sind das 1.024 verschiedene Zahlen.', 64), gfx: { tausend: {} } },
      { t: T('Das ist das **Binärsystem**: Es kennt nur zwei Ziffern, 0 und 1 – Finger unten, Finger oben.', 64), gfx: { binaer: {} } },
      { t: T('Geschrieben sieht das so aus: 101 heißt einmal 4, keinmal 2, einmal 1 – also **fünf**.', 64), gfx: { binaer: {} } },
      { t: T('Der Philosoph Gottfried Wilhelm **Leibniz** beschrieb das Zweiersystem 1703 – lange vor jedem Computer.', 64), gfx: { leibniz: {} } },
      { t: T('Computer rechnen genau so. Ihre Finger sind winzige Schalter, **Transistoren**: Strom an ist 1, Strom aus ist 0.', 64), gfx: { schalter: {} } },
      { t: T('Ein moderner Handychip enthält **Milliarden** davon. Jeder kippt viele Millionen Mal pro Sekunde.', 64), gfx: { chip: {} } },
      { t: T('Eine Ziffer heißt **Bit**. Acht Bits ergeben ein Byte – genug für 256 Möglichkeiten, etwa einen Buchstaben.', 64), gfx: { byte: {} } },
      { t: T('Auch Farben sind Bits: Jedes Pixel deines Bildschirms speichert Rot, Grün und Blau mit je **8 Bit** – zusammen über 16 Millionen Farben.', 64), gfx: { pixel: {} } },
      { t: T('Weil 2 hoch 10 genau 1.024 ist, galt ein „Kilobyte“ lange als 1.024 Bytes. Heute heißt das korrekt **Kibibyte**.', 64), gfx: { kilo: {} } },
      { t: T('Jedes zusätzliche Bit **verdoppelt** den Zahlenraum. Elf Finger, und du könntest bis 2.047 zählen.', 64), gfx: { verdoppeln: {} } },
      { t: T('Zehn Finger, **1.024 Zahlen**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Jeder Finger als Bit (oben/unten) mit doppeltem Wert: 1, 2, 4, … 512.', 'So zählt man mit zehn Fingern bis 1.023 – das Binärsystem (Leibniz 1703).', 'Computer nutzen Transistoren als Schalter: 8 Bit = 1 Byte = 256 Möglichkeiten.'],
    sources: ['Leibniz 1703: Explication de l’arithmétique binaire', 'Petzold 2000: Code – The Hidden Language of Computer Hardware and Software', 'IEC 80000-13 (Binärpräfixe)'],
  },
  {
    id: 'ki-lernt',
    area: 'TECH',
    day: 70,
    hook: 'Wie lernt eine KI, eine Katze zu erkennen?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [],
    draw: {
      katze(g) {
        cat(g, 180, 300, 1.4)
        question(g, 280, 150, 0.6, 900)
      },
      regeln(g) {
        bullets(g, 40, 380, ['spitze Ohren?', 'Schnurrhaare?', 'Fell?', 'aber: Katze von hinten?'], { gap: 50, size: 19 })
        cross(g, 300, 540, 0.7, 1500)
      },
      beispiele(g) {
        for (let i = 0; i < 6; i++) {
          const x = 70 + (i % 3) * 110
          const y = 400 + Math.floor(i / 3) * 120
          ink(g, RR(x - 44, y - 44, 88, 88, 6), { w: 2.2, d: i * 100, t: 300 })
          if (i % 2 === 0) cat(g, x, y + 30, 0.4, 300 + i * 100)
          else text(g, x, y + 6, 'keine', { anchor: 'middle', cls: 's', d: 300 + i * 100 })
        }
        text(g, 180, 650, 'Millionen beschriftete Bilder', { anchor: 'middle', cls: 's', d: 1200 })
      },
      netz(g) {
        net(g, 0)
      },
      gewichte(g) {
        net(g, 0)
        text(g, 180, 650, 'jede Verbindung: ein Gewicht', { anchor: 'middle', cls: 's', d: 1400 })
      },
      raten(g) {
        net(g, 0)
        text(g, 180, 650, 'Antwort: „Hund“ – falsch', { anchor: 'middle', cls: 's', d: 1300 })
      },
      fehler(g) {
        box(g, 40, 380, 120, 70, ['Antwort:', 'Hund'], { size: 16 })
        box(g, 200, 380, 120, 70, ['richtig:', 'Katze'], { size: 16, fill: true, d: 300 })
        arrow(g, L([180, 470], [180, 520]), { w: 2.4, d: 700, t: 300, head: 9 })
        box(g, 40, 530, 280, 70, ['alle Gewichte', 'ein Stückchen anpassen'], { size: 15, d: 900 })
      },
      tal(g) {
        ink(g, B([30, 380], [120, 640], [240, 640], [330, 380]), { w: 3, t: 800 })
        for (let i = 0; i < 5; i++) {
          const t = 0.08 + i * 0.1
          const x = 30 + 300 * (3 * t * (1 - t) * (1 - t) * 0.3 + 3 * t * t * (1 - t) * 0.7 + t * t * t)
          const y = 380 * Math.pow(1 - t, 3) + 3 * t * Math.pow(1 - t, 2) * 640 + 3 * t * t * (1 - t) * 640 + Math.pow(t, 3) * 380
          ball(g, x, y - 14, 10, { d: 600 + i * 300, fill: i === 4 ? 'dicht' : 'leer', t: 200 })
        }
        text(g, 180, 670, 'Schritt für Schritt bergab zum kleinsten Fehler', { anchor: 'middle', cls: 's', d: 2200 })
      },
      schichten(g) {
        box(g, 20, 420, 96, 70, 'Kanten', { size: 16 })
        box(g, 132, 420, 96, 70, 'Formen', { size: 16, d: 300 })
        box(g, 244, 420, 96, 70, ['Ohren,', 'Augen'], { size: 15, d: 600, fill: true })
        arrow(g, L([118, 455], [130, 455]), { w: 2, d: 500, t: 150, head: 6 })
        arrow(g, L([230, 455], [242, 455]), { w: 2, d: 800, t: 150, head: 6 })
        text(g, 180, 560, 'das Netz findet die Merkmale selbst', { anchor: 'middle', cls: 's', d: 1100 })
      },
      jahr(g) {
        timeline(g, 30, 330, 470, [{ at: 0.6, label: '2012', sub: 'Durchbruch beim Bilder-Erkennen', up: true }])
      },
      husky(g) {
        ink(g, RR(60, 380, 240, 200, 6), { w: 2.6, t: 500 })
        for (let i = 0; i < 9; i++) {
          const x = 80 + (i % 5) * 50
          const y = 400 + Math.floor(i / 5) * 30
          for (let k = 0; k < 3; k++) ink(g, L([x - 6 * Math.cos(rad(k * 60)), y - 6 * Math.sin(rad(k * 60))], [x + 6 * Math.cos(rad(k * 60)), y + 6 * Math.sin(rad(k * 60))]), { w: 1.4, d: 300 + i * 50, t: 100 })
        }
        ink(g, B([60, 540], [140, 520], [220, 530], [300, 520]), { w: 2, d: 600, t: 400 })
        text(g, 180, 620, '„Wolf“ – wegen des Schnees', { anchor: 'middle', cls: 's', d: 1100 })
      },
      woerter(g) {
        box(g, 30, 420, 300, 60, 'Der Himmel ist …', { size: 18 })
        text(g, 180, 540, 'blau: 62 % · grau: 21 % · klar: 9 %', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 180, 600, 'Sprachmodelle raten das nächste Wort', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        net(g, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { katze: {} } },
      { t: T('Man könnte Regeln programmieren: spitze Ohren, Schnurrhaare, Fell. Aber was ist mit einer Katze **von hinten**? Im Dunkeln? Halb verdeckt?', 64), gfx: { regeln: {} } },
      { t: T('Die Regeln werden endlos. Moderne KI geht darum anders vor: Sie lernt **aus Beispielen**.', 64), gfx: { beispiele: {} } },
      { t: T('Man zeigt ihr Millionen Bilder, jedes **beschriftet**: Katze oder keine Katze.', 64), gfx: { beispiele: {} } },
      { t: T('Im Inneren steckt ein **neuronales Netz**: Schichten aus einfachen Rechenknoten, lose dem Gehirn nachempfunden.', 64), gfx: { netz: {} } },
      { t: T('Die Knoten sind verbunden, und jede Verbindung hat ein **Gewicht** – eine Zahl, wie stark sie zählt.', 64), gfx: { gewichte: {} } },
      { t: T('Am Anfang sind alle Gewichte **zufällig**. Das Netz rät also blind – und liegt meist falsch.', 64), gfx: { raten: {} } },
      { t: T('Jetzt kommt der Trick: Man misst, wie **falsch** die Antwort war.', 64), gfx: { fehler: {} } },
      { t: T('Dann rechnet man zurück, welche Gewichte wie viel Schuld haben – und dreht jedes **ein Stückchen** in die bessere Richtung.', 64), gfx: { fehler: {} } },
      { t: T('Stell dir vor, du gehst im Nebel einen Hang hinab: Du spürst nur, wo es abwärts geht – und machst **kleine Schritte**.', 64), gfx: { tal: {} } },
      { t: T('Das wiederholt sich **Millionen Mal**. Langsam werden die Antworten besser.', 64), gfx: { tal: {} } },
      { t: T('Erstaunlich: Niemand sagt dem Netz, worauf es achten soll. Frühe Schichten lernen von selbst **Kanten**, spätere Formen, dann Ohren und Augen.', 64), gfx: { schichten: {} } },
      { t: T('2012 schlug ein solches Netz alle anderen Verfahren beim Erkennen von Bildern **deutlich** – der Startschuss des heutigen KI-Booms.', 64), gfx: { jahr: {} } },
      { t: T('Aber Vorsicht: Eine KI lernt, was im Bild steckt – nicht unbedingt, was **gemeint** ist.', 64), gfx: { husky: {} } },
      { t: T('In einem Versuch erkannte ein Netz Wölfe – in Wahrheit erkannte es **Schnee**. Wölfe waren auf den Lernbildern meist im Schnee.', 64), gfx: { husky: {} } },
      { t: T('Darum braucht gute KI nicht nur viele Daten, sondern **vielfältige** – sonst lernt sie Zufälle mit.', 64), gfx: { beispiele: {} } },
      { t: T('Sprachmodelle wie Chatbots lernen genauso – nur mit Text. Ihre Aufgabe: das **nächste Wort** vorhersagen.', 64), gfx: { woerter: {} } },
      { t: T('Aus Milliarden solcher kleinen Vorhersagen entsteht etwas, das wie Verstehen wirkt. Wie weit es **wirklich** versteht, ist umstritten.', 64), gfx: { woerter: {} } },
      { t: T('Nicht Regeln, sondern **Millionen Korrekturen**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Neuronale Netze lernen aus beschrifteten Beispielen statt aus festen Regeln.', 'Fehler messen, Gewichte in kleinen Schritten anpassen (Gradientenabstieg) – millionenfach wiederholt.', 'Netze finden Merkmale selbst, lernen aber auch Abkürzungen (Wolf = Schnee).'],
    sources: ['Krizhevsky, Sutskever & Hinton 2012, NeurIPS (ImageNet)', 'Ribeiro, Singh & Guestrin 2016, KDD („Why Should I Trust You?“)', 'LeCun, Bengio & Hinton 2015, Nature 521'],
  },
  {
    id: 'glasfaser',
    area: 'TECH',
    day: 70,
    hook: 'Wie kann Licht um die Kurve laufen?',
    mood: 'kosmisch',
    ambience: 'wellen',
    images: [],
    draw: {
      kurve(g) {
        const outer = B([30, 160], [200, 160], [300, 200], [320, 400])
        const inner = B([30, 210], [170, 210], [260, 240], [270, 400])
        ink(g, outer, { w: 2.8, t: 700 })
        ink(g, inner, { w: 2.8, d: 200, t: 700 })
        const at = (t: number, k: number): P => {
          const a = outer[Math.round(t * (outer.length - 1))]
          const b = inner[Math.round(t * (inner.length - 1))]
          return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
        }
        const ray: P[] = [at(0, 0.5)]
        for (let i = 1; i < 8; i++) ray.push(at(i / 8, i % 2 ? 0.1 : 0.9))
        ray.push(at(1, 0.5))
        arrow(g, ray, { w: 2.2, d: 800, t: 1200, head: 9 })
      },
      gerade(g) {
        rays(g, 70, 470, 18, 34, 10)
        ball(g, 70, 470, 12, { fill: 'dicht', d: 200 })
        arrow(g, L([100, 470], [320, 470]), { w: 2.6, d: 500, t: 600, head: 10 })
        text(g, 200, 520, 'Licht läuft geradeaus', { anchor: 'middle', cls: 's', d: 900 })
      },
      flach(g) {
        ink(g, L([20, 520], [340, 520]), { w: 2.6, t: 500 })
        text(g, 320, 500, 'Glas', { anchor: 'end', cls: 's', d: 300 })
        text(g, 320, 554, 'Luft', { anchor: 'end', cls: 's', d: 300 })
        arrow(g, [[40, 400], [160, 516], [280, 400]], { w: 2.4, d: 600, t: 900, head: 9 })
        text(g, 160, 590, 'flacher Winkel: alles wird gespiegelt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      steil(g) {
        ink(g, L([20, 520], [340, 520]), { w: 2.6, t: 500 })
        arrow(g, [[130, 380], [160, 516], [176, 620]], { w: 2.4, d: 500, t: 700, head: 9 })
        text(g, 260, 600, 'steil: tritt aus', { anchor: 'middle', cls: 's', d: 900 })
      },
      faser(g) {
        fiber(g, 20, 340, 480, 70)
        text(g, 180, 560, 'Licht prallt hin und her', { anchor: 'middle', cls: 's', d: 1500 })
      },
      haar(g) {
        ball(g, 120, 470, 60, { fill: 'hell' })
        ball(g, 120, 470, 8, { fill: 'dicht', d: 400 })
        text(g, 120, 570, 'Faser: 0,125 mm', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 120, 594, 'Kern: 0,009 mm', { anchor: 'middle', cls: 's', d: 800 })
        ink(g, E(270, 470, 40), { w: 2.4, d: 900, t: 400 })
        text(g, 270, 570, 'Haar: 0,07 mm', { anchor: 'middle', cls: 's', d: 1100 })
      },
      colladon(g) {
        ink(g, RR(40, 360, 110, 160, 6), { w: 2.8, t: 600 })
        const jet = B([150, 470], [220, 470], [280, 520], [300, 640])
        ink(g, jet, { w: 2.6, d: 400, t: 700 })
        ink(g, B([150, 490], [210, 490], [262, 530], [278, 640]), { w: 2.6, d: 400, t: 700 })
        rays(g, 289, 668, 8, 18, 6, 1200)
        text(g, 95, 560, '1842: Licht im Wasserstrahl', { anchor: 'middle', cls: 's', d: 900 })
      },
      daempfung(g) {
        hbars(g, [
          { label: 'Fensterglas', v: 1, fmt: () => 'wenige Meter' },
          { label: 'Glasfaser', v: 100, fmt: () => 'rund 100 km', dense: true },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'bis nur noch ein Hundertstel Licht übrig ist', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kao(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.3, label: '1966', sub: 'Charles Kao: reines Glas', up: true },
          { at: 0.85, label: '2009', sub: 'Nobelpreis', big: true },
        ])
      },
      pulse(g) {
        fiber(g, 20, 340, 420, 50, 0, 8)
        const bits = [1, 0, 1, 1, 0, 1, 0, 0, 1]
        bits.forEach((b, i) => text(g, 40 + i * 35, 520, String(b), { anchor: 'middle', size: 22, d: 900 + i * 80 }))
        text(g, 180, 580, 'Licht an = 1, Licht aus = 0', { anchor: 'middle', cls: 's', d: 1700 })
      },
      farben(g) {
        for (let i = 0; i < 4; i++) {
          const y = 400 + i * 50
          ink(g, waveP(40, 320, y, 8, 30 + i * 12), { w: 2, d: i * 200, t: 700 })
        }
        text(g, 180, 640, 'viele Farben in einer Faser', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        fiber(g, 20, 340, 480, 60)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { kurve: {} } },
      { t: T('Licht läuft **geradeaus**. Und doch rasen Lichtsignale durch Kabel, die sich unter Städten und Ozeanen winden.', 64), gfx: { gerade: {} } },
      { t: T('Das Geheimnis heißt **Totalreflexion**.', 64), gfx: { flach: {} } },
      { t: T('Trifft Licht im Glas **steil** auf die Grenze zur Luft, tritt es größtenteils aus.', 64), gfx: { steil: {} } },
      { t: T('Trifft es aber sehr **flach** auf, kommt nichts mehr heraus. Das Licht wird vollständig zurückgespiegelt – wie von einem perfekten Spiegel.', 64), gfx: { flach: {} } },
      { t: T('Eine Glasfaser nutzt genau das: Das Licht prallt im Kern immer wieder flach von der Wand ab und **bleibt gefangen**.', 64), gfx: { faser: {} } },
      { t: T('Biegt sich die Faser sanft, folgt ihr das Licht – es läuft **um die Kurve**.', 64), gfx: { kurve: { tf: [1, 0, 220] } } },
      { t: T('Der Kern ist oft nur 9 Tausendstel Millimeter dick, die ganze Faser **dünner** als ein dickes Haar.', 64), gfx: { haar: {} } },
      { t: T('Entdeckt wurde der Effekt schon 1842: Daniel Colladon leitete Licht durch einen **Wasserstrahl** – der Strahl leuchtete im Bogen.', 64), gfx: { colladon: {} } },
      { t: T('Für lange Strecken musste das Glas aber unglaublich **rein** werden. Normales Fensterglas schluckt Licht nach wenigen Metern.', 64), gfx: { daempfung: {} } },
      { t: T('Charles Kao zeigte 1966, dass es an Verunreinigungen liegt. Dafür bekam er 2009 den **Nobelpreis**.', 64), gfx: { kao: {} } },
      { t: T('Heute ist Glasfaser so klar, dass Licht viele Dutzend Kilometer weit kommt, bevor es **verstärkt** werden muss.', 64), gfx: { daempfung: {} } },
      { t: T('Die Daten reisen als **Lichtpulse**: an heißt 1, aus heißt 0 – Milliarden Mal pro Sekunde.', 64), gfx: { pulse: {} } },
      { t: T('Und es geht noch mehr: Viele **Farben** laufen gleichzeitig durch eine Faser, jede mit eigenen Daten.', 64), gfx: { farben: {} } },
      { t: T('So schafft eine einzige Faser **Billionen** Bits pro Sekunde. Seekabel bündeln Dutzende solcher Fasern.', 64), gfx: { farben: {} } },
      { t: T('Auch Ärzte nutzen das Prinzip: Im **Endoskop** leiten Glasfasern Licht in den Körper und Bilder heraus.', 64), gfx: { faser: {} } },
      { t: T('Und ein geschliffener Diamant funkelt so stark, weil Totalreflexion das Licht in ihm **hin und her** wirft.', 64), gfx: { flach: {} } },
      { t: T('Licht, **gefangen** im Glas.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Totalreflexion: Trifft Licht flach auf die Grenze zu einem dünneren Medium, wird es vollständig gespiegelt.', 'In Glasfasern bleibt Licht so gefangen und folgt Biegungen; Kao (Nobelpreis 2009) machte reines Glas möglich.', 'Daten reisen als Lichtpulse, viele Farben gleichzeitig – Billionen Bits pro Sekunde.'],
    sources: ['Hecht 2004: City of Light – The Story of Fiber Optics', 'Nobelpreis Physik 2009: Charles K. Kao (nobelprize.org)', 'Colladon 1842, Comptes Rendus 15'],
  },
  {
    id: 'mikrowelle',
    area: 'TECH',
    day: 37,
    hook: 'Warum wird das Essen in der Mikrowelle heiß, der Teller aber kaum?',
    mood: 'verspielt',
    ambience: 'blasen',
    images: [],
    draw: {
      geraet(g) {
        ink(g, RR(40, 120, 280, 200, 12), { w: 3, t: 700 })
        ink(g, RR(60, 140, 180, 160, 6), { w: 2.4, d: 300, t: 500 })
        for (let i = 0; i < 3; i++) ball(g, 280, 170 + i * 40, 9, { d: 500 + i * 100, t: 200 })
        ink(g, E(150, 280, 70, 12), { w: 2.2, d: 700, t: 300 })
      },
      welle(g) {
        ink(g, waveP(30, 330, 470, 40, 120), { w: 3, t: 900 })
        text(g, 180, 560, '2,45 Milliarden Schwingungen pro Sekunde', { anchor: 'middle', cls: 's', d: 900 })
      },
      molekuel(g) {
        water(g, 180, 470, 2.6)
        text(g, 180, 400, '−', { anchor: 'middle', size: 28, d: 600 })
        text(g, 180, 580, '+', { anchor: 'middle', size: 28, d: 700 })
        text(g, 180, 640, 'Wasser: ein winziger Magnet für Elektrizität', { anchor: 'middle', cls: 's', d: 1000 })
      },
      drehen(g) {
        for (let i = 0; i < 3; i++) {
          const x = 80 + i * 100
          const m = st(g, 'm1', `--m1: rotate(${i % 2 ? -150 : 150}deg); transform-origin: ${x}px 480px; transition-duration: 0.6s; --dl: ${300 + i * 100}ms`)
          water(m, x, 480, 1.4)
          arcArrow(g, x, 480, 40, 210, 330, { d: 900 })
        }
        text(g, 180, 600, 'hin und her – Reibung macht Wärme', { anchor: 'middle', cls: 's', d: 1100 })
      },
      teller(g) {
        ink(g, E(180, 540, 130, 22), { w: 2.8, t: 600 })
        const food: P[] = [...B([110, 534], [110, 470], [250, 470], [250, 534]), [110, 534]]
        blank(g, food)
        hatch(g, food, 400, true)
        ink(g, food, { w: 2.6, d: 300, t: 500 })
        text(g, 180, 430, 'viel Wasser: heiß', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 180, 600, 'Teller: kaum Wasser', { anchor: 'middle', cls: 's', d: 1000 })
      },
      tiefe(g) {
        ink(g, RR(60, 400, 240, 180, 10), { w: 2.8, t: 600 })
        const outer: P[] = [[64, 404], [296, 404], [296, 576], [64, 576], [64, 404]]
        hatch(g, outer, 400, true)
        blank(g, RR(100, 440, 160, 100, 6))
        ink(g, RR(100, 440, 160, 100, 6), { w: 1.8, d: 600, t: 300 })
        text(g, 180, 496, 'innen: Wärmeleitung', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 620, 'Mikrowellen dringen nur wenige Zentimeter ein', { anchor: 'middle', cls: 's', d: 1100 })
      },
      stehend(g) {
        ink(g, waveP(30, 330, 470, 50, 240), { w: 2.6, t: 800 })
        ink(g, waveP(30, 330, 470, -50, 240), { w: 1.6, d: 300, t: 800 })
        for (const x of [90, 210, 330]) dot(g, x - 0.1, 470, 5, 1000)
        text(g, 180, 580, 'manche Stellen heiß, andere kalt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      schoko(g) {
        ink(g, RR(40, 440, 280, 60, 6), { w: 2.8, t: 600 })
        for (const x of [90, 210]) {
          blank(g, E(x, 470, 20, 16))
          hatch(g, E(x, 470, 20, 16), 700, true)
          ink(g, E(x, 470, 20, 16), { w: 2, d: 600, t: 300 })
        }
        ink(g, L([90, 530], [210, 530]), { w: 1.8, d: 900, t: 300 })
        for (const x of [90, 210]) ink(g, L([x, 522], [x, 538]), { w: 1.8, d: 900, t: 100 })
        text(g, 150, 560, 'etwa 6 cm', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 180, 620, '6 cm × 2 × 2,45 Mrd. ≈ Lichtgeschwindigkeit', { anchor: 'middle', cls: 's', d: 1300 })
      },
      spencer(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1945', sub: 'Percy Spencer', up: true }])
      },
      riegel(g) {
        ink(g, RR(110, 440, 140, 50, 8), { w: 2.8, t: 500 })
        for (let i = 1; i < 4; i++) ink(g, L([110 + i * 35, 444], [110 + i * 35, 486]), { w: 1.6, d: 300, t: 200 })
        for (const x of [150, 210]) drop(g, x, 520, 0.6, 700)
        text(g, 180, 600, 'geschmolzen in der Hosentasche', { anchor: 'middle', cls: 's', d: 1000 })
      },
      tuer(g) {
        ink(g, RR(80, 380, 200, 200, 8), { w: 3, t: 600 })
        for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) dot(g, 105 + i * 30, 405 + j * 30, 3, 400 + (i + j) * 30)
        text(g, 180, 630, 'Löcher kleiner als die Welle (12 cm)', { anchor: 'middle', cls: 's', d: 1200 })
      },
      gabel(g) {
        ink(g, L([120, 560], [220, 440]), { w: 3, t: 500 })
        for (const k of [0, 1, 2]) ink(g, L([220 + k * 6, 440 - k * 6], [244 + k * 6, 412 - k * 6]), { w: 2.4, d: 300, t: 200 })
        bolt(g, [[260, 380], [280, 400], [270, 404], [294, 430]], 700, 3)
        text(g, 180, 620, 'Spitzen und Kanten: Funken', { anchor: 'middle', cls: 's', d: 1000 })
      },
      eis(g) {
        for (let i = 0; i < 6; i++) {
          const x = 90 + (i % 3) * 90
          const y = 440 + Math.floor(i / 3) * 90
          ink(g, RR(x - 26, y - 26, 52, 52, 4), { w: 2.2, d: i * 100, t: 300 })
          water(g, x, y, 0.7, 30 * i, 300 + i * 100)
        }
        text(g, 180, 640, 'im Eis festgehalten: drehen kaum', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        water(g, 180, 470, 2)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { geraet: {} } },
      { t: T('Eine Mikrowelle schickt unsichtbare Funkwellen ins Garraum – **Mikrowellen**, verwandt mit Licht und WLAN.', 64), gfx: { welle: {} } },
      { t: T('Ihr elektrisches Feld schwingt rund **2,45 Milliarden** Mal pro Sekunde hin und her.', 64), gfx: { welle: {} } },
      { t: T('Wassermoleküle sind auf einer Seite leicht negativ, auf der anderen leicht positiv. Sie verhalten sich wie **winzige Kompassnadeln**.', 64), gfx: { molekuel: {} } },
      { t: T('Das schwingende Feld zerrt an ihnen. Die Moleküle **drehen** sich ständig mit und stoßen dabei an ihre Nachbarn.', 64), gfx: { drehen: { cls: 'a1' } } },
      { t: T('Dieses Gerangel ist **Wärme**. Das Essen erhitzt sich, weil sein Wasser in Bewegung gerät.', 64), gfx: { drehen: { cls: 'a1' } } },
      { t: T('Ein Keramikteller enthält **kaum Wasser**. Die Wellen gehen fast einfach durch ihn hindurch.', 64), gfx: { teller: {} } },
      { t: T('Warm wird er meist erst durch das **heiße Essen**, das auf ihm liegt.', 64), gfx: { teller: {} } },
      { t: T('Ein Mythos: Die Mikrowelle kocht nicht **von innen nach außen**. Die Wellen dringen nur wenige Zentimeter ein, den Rest erledigt Wärmeleitung.', 64), gfx: { tiefe: {} } },
      { t: T('Im Garraum überlagern sich die Wellen. Es entstehen **heiße und kalte** Stellen – darum der Drehteller.', 64), gfx: { stehend: {} } },
      { t: T('Ein Küchenexperiment: Ohne Drehteller schmilzt Schokolade an Stellen etwa **6 Zentimeter** auseinander – eine halbe Wellenlänge.', 64), gfx: { schoko: {} } },
      { t: T('Rechnet man das zurück, kommt man ungefähr auf die **Lichtgeschwindigkeit**.', 64), gfx: { schoko: {} } },
      { t: T('Darum stellt man Essen am besten an den **Rand** des Drehtellers und deckt es ab: So verteilt sich die Hitze besser.', 64), gfx: { teller: {} } },
      { t: T('Erfunden wurde das Gerät aus Zufall: 1945 arbeitete Percy Spencer an Radargeräten – und ein **Schokoriegel** in seiner Tasche schmolz.', 64), gfx: { riegel: {} } },
      { t: T('Die ersten Geräte hießen „Radarange“, waren fast **zwei Meter** hoch und wogen über 300 Kilo.', 64), gfx: { spencer: {} } },
      { t: T('Das Gitter in der Tür hält die Wellen drinnen: Seine Löcher sind viel kleiner als die **12 Zentimeter** lange Welle.', 64), gfx: { tuer: {} } },
      { t: T('Metall mit Spitzen, etwa eine **Gabel**, sammelt die Ladung an den Kanten – dort springen Funken.', 64), gfx: { gabel: {} } },
      { t: T('Und Eis taut so schlecht, weil gefrorene Wassermoleküle im Kristall **festsitzen** und sich kaum drehen können.', 64), gfx: { eis: {} } },
      { t: T('Darum heizt die Auftaustufe mit **Pausen**: Die Wärme verteilt sich, ehe die schon flüssigen Stellen kochen.', 64), gfx: { eis: {} } },
      { t: T('Die Mikrowelle **schüttelt Wasser**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Mikrowellen (2,45 GHz) lassen Wassermoleküle als Dipole hin- und herdrehen – Reibung wird zu Wärme.', 'Teller ohne Wasser bleiben kühl; Wellen dringen nur wenige cm ein, stehende Wellen erzeugen heiße/kalte Stellen.', 'Erfunden 1945 (Spencer); Türgitter hält die 12-cm-Wellen drin; Eis taut schlecht.'],
    sources: ['Vollmer 2004, Physics Education 39 (Physik der Mikrowelle)', 'Bundesamt für Strahlenschutz: Mikrowellengeräte', 'Smithsonian: Percy Spencer and the microwave oven'],
  },
  {
    id: 'kuehlschrank',
    area: 'TECH',
    day: 27,
    hook: 'Wie macht ein Kühlschrank Kälte?',
    mood: 'ruhig',
    ambience: 'atem',
    images: [],
    draw: {
      fridge(g) {
        fridge(g, 120, 80, 120, 340)
      },
      pumpe(g) {
        fridge(g, 120, 340, 120, 300)
        carrow(g, [150, 560], [300, 540], -30, { d: 800 })
        text(g, 300, 510, 'Wärme raus', { anchor: 'middle', cls: 's', d: 1000 })
      },
      hinten(g) {
        ink(g, RR(110, 340, 140, 300, 8), { w: 3, t: 600 })
        const p: P[] = [[140, 370]]
        for (let i = 0; i < 7; i++) {
          const y = 370 + i * 36
          const [a, b] = i % 2 === 0 ? [220, 236] : [140, 124]
          p.push([a, y])
          if (i < 6) p.push(...B([a, y], [b, y], [b, y + 36], [a, y + 36]).slice(1))
        }
        ink(g, p, { w: 2.2, d: 300, t: 1200 })
        rays(g, 280, 420, 10, 22, 6, 1300)
        text(g, 180, 670, 'die Rückseite ist warm', { anchor: 'middle', cls: 's', d: 1400 })
      },
      schweiss(g) {
        fig(g, 180, 620, 4.4)
        for (const [x, y] of [[150, 470], [212, 470]] as const) drop(g, x, y, 0.5, 600, false)
        for (const x of [140, 220]) ink(g, B([x, 440], [x - 6, 420], [x + 6, 400], [x, 380]), { w: 1.6, d: 1000, t: 300 })
        text(g, 180, 670, 'Verdunsten kühlt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kreis(g) {
        box(g, 20, 330, 140, 64, ['verdampft', 'innen: kalt'], { size: 15 })
        box(g, 200, 330, 140, 64, ['Kompressor', 'drückt zusammen'], { size: 15, d: 300 })
        box(g, 200, 560, 140, 64, ['hinten: warm', 'wird flüssig'], { size: 15, fill: true, d: 600 })
        box(g, 20, 560, 140, 64, ['Ventil', 'Druck sinkt'], { size: 15, d: 900 })
        carrow(g, [164, 362], [196, 362], 0, { d: 1100, head: 8 })
        carrow(g, [270, 400], [270, 554], 0, { d: 1300, head: 8 })
        carrow(g, [196, 592], [164, 592], 0, { d: 1500, head: 8 })
        carrow(g, [90, 554], [90, 400], 0, { d: 1700, head: 8 })
      },
      verdampfer(g) {
        box(g, 110, 330, 140, 64, ['verdampft', 'innen: kalt'], { size: 15 })
        for (let i = 0; i < 3; i++) carrow(g, [120 + i * 60, 540], [140 + i * 40, 402], 10, { d: 700 + i * 100, head: 8 })
        text(g, 180, 580, 'nimmt Wärme aus dem Essen auf', { anchor: 'middle', cls: 's', d: 1100 })
      },
      kompressor(g) {
        ink(g, RR(110, 400, 140, 140, 12), { w: 3, t: 600 })
        for (let i = 0; i < 8; i++) dot(g, 130 + (i % 4) * 34, 480 + Math.floor(i / 4) * 36, 4, 300 + i * 40)
        const piston = st(g, 'm1', '--m1: translateY(40px); transition-duration: 1s; --dl: 800ms')
        ink(piston, L([116, 404], [244, 404]), { w: 3, t: 300 })
        text(g, 180, 600, 'zusammengedrückt: heiß', { anchor: 'middle', cls: 's', d: 1000 })
      },
      pumpeLuft(g) {
        ink(g, RR(150, 400, 60, 180, 6), { w: 2.8, t: 500 })
        ink(g, L([180, 400], [180, 340]), { w: 2.4, d: 200, t: 200 })
        ink(g, L([150, 340], [210, 340]), { w: 2.8, d: 300, t: 200 })
        ink(g, B([210, 560], [260, 560], [270, 600], [300, 600]), { w: 2.4, d: 500, t: 300 })
        for (const x of [236, 256]) ink(g, B([x, 540], [x - 8, 510], [x + 8, 480], [x, 450]), { w: 1.8, d: 900, t: 400 })
        text(g, 180, 640, 'Luftpumpe: wird warm', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tuer(g) {
        fridge(g, 120, 360, 120, 260)
        ink(g, [[240, 362], [310, 330], [310, 590], [240, 618]], { w: 2.6, d: 400, t: 500 })
        text(g, 180, 660, 'Küche wird insgesamt wärmer', { anchor: 'middle', cls: 's', d: 1100 })
      },
      linde(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: '1876', sub: 'Carl von Linde', up: true }])
      },
      eis(g) {
        for (let i = 0; i < 4; i++) ink(g, RR(60 + i * 64, 440 + (i % 2) * 20, 52, 52, 4), { w: 2.4, d: i * 150, t: 300 })
        text(g, 180, 580, 'früher: Eisblöcke aus Seen', { anchor: 'middle', cls: 's', d: 900 })
      },
      gase(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '1930er', sub: 'FCKW', up: true },
          { at: 0.55, label: '1987', sub: 'Montreal: Verbot', big: true },
          { at: 0.85, label: 'heute', sub: 'Isobutan' },
        ])
      },
      waermepumpe(g) {
        house(g, 200, 600, 120)
        ink(g, RR(50, 520, 90, 80, 6), { w: 2.6, d: 300, t: 400 })
        ink(g, E(95, 560, 24), { w: 2, d: 500, t: 300 })
        carrow(g, [144, 560], [194, 560], -16, { d: 900 })
        thermo(g, 40, 360, 120, 0.2, 600)
        text(g, 180, 650, 'holt Wärme aus kalter Luft', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        fridge(g, 120, 400, 120, 220)
        carrow(g, [244, 510], [320, 480], -20, { d: 800 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { fridge: {} } },
      { t: T('Die überraschende Antwort: **gar nicht**. Ein Kühlschrank erzeugt keine Kälte.', 64), gfx: { fridge: { tf: [1, 0, 260] } } },
      { t: T('Kälte ist nur fehlende Wärme. Der Kühlschrank **pumpt Wärme** aus seinem Inneren hinaus – in deine Küche.', 64), gfx: { pumpe: {} } },
      { t: T('Fass mal an die **Rückseite**: Das Gitter dort ist warm. Da kommt die Wärme aus dem Inneren heraus.', 64), gfx: { hinten: {} } },
      { t: T('Das Prinzip kennst du vom **Schwitzen**: Wenn Schweiß verdunstet, nimmt er Wärme von deiner Haut mit.', 64), gfx: { schweiss: {} } },
      { t: T('Im Kühlschrank kreist ein **Kältemittel**, das schon bei sehr niedrigen Temperaturen verdampft.', 64), gfx: { kreis: {} } },
      { t: T('Innen, in Rohren hinter der Wand, **verdampft** es – und entzieht dabei dem Innenraum Wärme.', 64), gfx: { verdampfer: {} } },
      { t: T('Der **Kompressor** – das Brummen, das du hörst – drückt das Gas zusammen. Dabei wird es heiß.', 64), gfx: { kompressor: { cls: 'a1' } } },
      { t: T('Kennst du von der Fahrradpumpe: Beim Pumpen wird sie **warm**, weil die Luft zusammengedrückt wird.', 64), gfx: { pumpeLuft: {} } },
      { t: T('Das heiße Gas strömt durch das Gitter auf der Rückseite, gibt seine Wärme an die Küche ab und wird wieder **flüssig**.', 64), gfx: { kreis: {} } },
      { t: T('Durch ein enges **Ventil** sinkt der Druck. Das Mittel kühlt stark ab – und der Kreislauf beginnt von vorn.', 64), gfx: { kreis: {} } },
      { t: T('Darum kühlt eine offene Kühlschranktür die Küche **nicht**: Die Wärme kommt hinten wieder heraus – plus die Wärme des Motors.', 64), gfx: { tuer: {} } },
      { t: T('Im Gefrierfach läuft derselbe Kreislauf, nur **kälter**: Dort verdampft das Mittel bei rund minus 25 Grad.', 64), gfx: { kreis: {} } },
      { t: T('Vor der Erfindung lagerte man Lebensmittel mit **Eisblöcken**, im Winter aus Seen gesägt.', 64), gfx: { eis: {} } },
      { t: T('Ab 1876 baute **Carl von Linde** brauchbare Kältemaschinen – zuerst für Brauereien.', 64), gfx: { linde: {} } },
      { t: T('Lange nutzte man **FCKW** als Kältemittel. Sie zerstörten die Ozonschicht und wurden ab 1987 weltweit verboten.', 64), gfx: { gase: {} } },
      { t: T('Eine **Wärmepumpe** ist ein umgedrehter Kühlschrank: Sie holt Wärme aus der kalten Außenluft und pumpt sie ins Haus.', 64), gfx: { waermepumpe: {} } },
      { t: T('Auch Klimaanlagen arbeiten so – sie **schieben** Wärme nur in die andere Richtung.', 64), gfx: { pumpe: {} } },
      { t: T('Ein Kühlschrank ist eine **Wärmepumpe**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein Kühlschrank erzeugt keine Kälte, er pumpt Wärme nach außen.', 'Kreislauf: Kältemittel verdampft innen (nimmt Wärme auf), Kompressor verdichtet, hinten gibt es Wärme ab, Ventil senkt den Druck.', 'Wärmepumpen und Klimaanlagen nutzen dasselbe Prinzip; FCKW wurden 1987 verboten.'],
    sources: ['Cengel & Boles: Thermodynamics – An Engineering Approach (Kältekreislauf)', 'Deutsches Museum: Carl von Linde', 'UNEP: Montreal Protocol'],
  },
]

/** Katze sitzend, Pfoten auf y */
function cat(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = [...B(P(-40, 0), P(-50, -60), P(-30, -110), P(-20, -120)), ...L(P(-20, -120), P(-26, -150)).slice(1), ...L(P(-26, -150), P(-6, -132)).slice(1), ...L(P(-6, -132), P(10, -132)).slice(1), ...L(P(10, -132), P(26, -150)).slice(1), ...L(P(26, -150), P(22, -120)).slice(1), ...B(P(22, -120), P(34, -110), P(50, -60), P(40, 0)).slice(1), P(-40, 0)]
  blank(g, body)
  ink(g, body, { w: 2.6, d, t: 800 })
  for (const k of [-1, 1]) dot(g, x + k * 10 * s, y - 110 * s, 3 * s, d + 600)
  ink(g, B(P(40, -6), P(80, -10), P(80, -60), P(66, -70)), { w: 2.4, d: d + 700, t: 400 })
}

/** Netz aus drei Schichten: Bild → versteckt → Katze/keine */
function net(g: Element, d = 0): void {
  const layers: P[][] = [
    [[60, 380], [60, 450], [60, 520], [60, 590]],
    [[180, 410], [180, 485], [180, 560]],
    [[300, 440], [300, 530]],
  ]
  for (let l = 0; l < 2; l++) for (const a of layers[l]) for (const b of layers[l + 1]) ink(g, L([a[0] + 12, a[1]], [b[0] - 12, b[1]]), { w: 1.2, d: d + 300 + l * 300, t: 400 })
  layers.forEach((ls, l) => ls.forEach(([x, y], i) => neuron(g, x, y, d + l * 300 + i * 60, l === 2 && i === 0)))
  text(g, 300, 410, 'Katze', { anchor: 'middle', cls: 's', d: d + 1000 })
  text(g, 300, 570, 'keine', { anchor: 'middle', cls: 's', d: d + 1100 })
}

const rad = (a: number) => (a * Math.PI) / 180

/** Kleines Haus (Grundlinie y) */
function house(g: Element, x: number, y: number, w: number, d = 0): void {
  ink(g, [[x, y], [x, y - w * 0.7], [x + w / 2, y - w * 1.1], [x + w, y - w * 0.7], [x + w, y]], { w: 2.6, d, t: 600 })
  ink(g, RR(x + w * 0.4, y - w * 0.4, w * 0.2, w * 0.4, 2), { w: 2, d: d + 300, t: 200 })
}
