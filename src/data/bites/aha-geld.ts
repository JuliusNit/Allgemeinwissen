import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, bubble, check, clock, coin, cross, crowd, dashes, eye, fig, group, hatch, ink, mk, mountain, pop, question, rays, st, star, strike, text, timeline, vbars, type P } from './draw'
import { axes, ball, box, carrow, cloud, dot, drop, flame, flow, glide, heart, house, pie, plot, rad, ripple, smooth, spin, sun, sunDisk, travelWave, tree, wobble } from './kit'

// Wirtschaft & Geld: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Geldschein mit Zahl */
function note(g: Element, x: number, y: number, w: number, label: string, d = 0, size = 18): void {
  const h = w * 0.5
  blank(g, RR(x, y, w, h, 6))
  ink(g, RR(x, y, w, h, 6), { w: 2.6, d, t: 500 })
  ink(g, E(x + w * 0.22, y + h / 2, h * 0.28), { w: 1.8, d: d + 300, t: 300 })
  text(g, x + w * 0.62, y + h / 2 + size * 0.36, label, { anchor: 'middle', size, d: d + 400 })
}

/** Münzstapel, Boden bei y, n Münzen */
function stack(g: Element, cx: number, y: number, n: number, d = 0, w = 50): void {
  for (let i = 0; i < n; i++) {
    const yy = y - i * 10
    blank(g, E(cx, yy - 5, w / 2, 8))
    ink(g, E(cx, yy - 5, w / 2, 8, 0, 180), { w: 2, d: d + i * 40, t: 100 })
    ink(g, L([cx - w / 2, yy - 5], [cx - w / 2, yy - 13]), { w: 2, d: d + i * 40, t: 50 })
    ink(g, L([cx + w / 2, yy - 5], [cx + w / 2, yy - 13]), { w: 2, d: d + i * 40, t: 50 })
  }
  ink(g, E(cx, y - n * 10 - 3, w / 2, 8), { w: 2, d: d + n * 40, t: 200 })
}

/** Diamant */
function diamond(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const o: P[] = [P(-50, -20), P(-30, -44), P(30, -44), P(50, -20), P(0, 50), P(-50, -20)]
  blank(g, o)
  ink(g, o, { w: 3, d, t: 700 })
  ink(g, [P(-50, -20), P(50, -20)], { w: 1.8, d: d + 400, t: 200 })
  ink(g, [P(-30, -44), P(-14, -20), P(0, 50)], { w: 1.4, d: d + 500, t: 200 })
  ink(g, [P(30, -44), P(14, -20), P(0, 50)], { w: 1.4, d: d + 500, t: 200 })
  hatch(g, [P(-14, -20), P(14, -20), P(0, 50)], d + 700)
}

/** Land als Kreis mit Namen */
function earthMini(g: Element, cx: number, cy: number, label: string, d = 0): void {
  ink(g, E(cx, cy, 40), { w: 2.8, d, t: 500 })
  hatch(g, E(cx - 6, cy + 4, 18, 22), d + 300)
  text(g, cx, cy + 64, label, { anchor: 'middle', cls: 's', d: d + 400 })
}

/** Glühbirne / LED, Mitte des Glases */
function bulb(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  ink(g, [...B(P(-12, 26), P(-30, 6), P(-30, -30), P(0, -30)), ...B(P(0, -30), P(30, -30), P(30, 6), P(12, 26)).slice(1)], { w: 2.6, d, t: 500 })
  for (let k = 0; k < 3; k++) ink(g, L(P(-12, 30 + k * 7), P(12, 30 + k * 7)), { w: 2, d: d + 400 + k * 80, t: 100 })
}

/** Bankgebäude im klassischen Stil: Giebel mit Relief, kannelierte Säulen, Treppe, Tür; Grundlinie y */
function bank(g: Element, cx: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  const ped: P[] = [P(-96, -150), P(0, -200), P(96, -150), P(-96, -150)]
  blank(g, ped)
  ink(g, ped, { w: 3 * Math.min(1.2, s), d, t: 600 })
  ink(g, [P(-70, -156), P(0, -190), P(70, -156), P(-70, -156)], { w: 1, d: d + 200, t: 400 })
  ink(g, E(cx, y - 168 * s, 10 * s, 7 * s), { w: 1.2, d: d + 300, t: 150 })
  ink(g, RR(cx - 96 * s, y - 150 * s, 192 * s, 18 * s, 2), { w: 2.4, d: d + 200, t: 400 })
  for (let k = 0; k < 6; k++) ink(g, L(P(-90 + k * 36, -138), P(-82 + k * 36, -138)), { w: 1, d: d + 300, t: 40 })
  for (let k = 0; k < 4; k++) {
    const x = -70 + k * 40
    ink(g, RR(cx + (x - 2) * s, y - 132 * s, 24 * s, 8 * s, 1), { w: 1.4, d: d + 350 + k * 60, t: 80 })
    ink(g, RR(cx + x * s, y - 124 * s, 20 * s, 104 * s, 2), { w: 2.2, d: d + 400 + k * 80, t: 300 })
    for (let j = 1; j < 3; j++) ink(g, L(P(x + j * 6.6, -122), P(x + j * 6.6, -22)), { w: 0.6, d: d + 600 + k * 80, t: 150 })
  }
  ink(g, RR(cx - 12 * s, y - 70 * s, 24 * s, 50 * s, 2), { w: 1.8, d: d + 700, t: 200 })
  hatch(g, RR(cx - 12 * s, y - 70 * s, 24 * s, 50 * s, 2), d + 800, true)
  for (let k = 0; k < 3; k++) ink(g, RR(cx - (100 + k * 6) * s, y - (20 - k * 7) * s, (200 + k * 12) * s, 7 * s, 1), { w: 1.8, d: d + 300 + k * 60, t: 200 })
}

/** Sparschwein von der Seite, Füße auf y */
function piggy(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = smooth([P(-40, -30), P(-30, -56), P(10, -62), P(36, -50), P(48, -36), P(44, -18), P(20, -8), P(-24, -8), P(-42, -18), P(-40, -30)], 3)
  blank(g, body)
  hatch(g, body, d + 400)
  ink(g, body, { w: 2.4 * Math.max(0.6, s), d, t: 400 })
  ink(g, RR(x + 44 * s, y - 38 * s, 10 * s, 16 * s, 4 * s), { w: 1.6, d: d + 200, t: 100 })
  ink(g, [P(14, -60), P(20, -74), P(26, -58)], { w: 1.6, d: d + 250, t: 100 })
  ink(g, L(P(-10, -60), P(6, -60)), { w: 2.4, d: d + 300, t: 60 })
  for (const a of [-26, -8, 12, 28]) ink(g, L(P(a, -10), P(a, 0)), { w: 2 * Math.max(0.6, s), d: d + 300, t: 60 })
  dot(g, x + 30 * s, y - 44 * s, 1.6 * s, d + 400)
  ink(g, B(P(-40, -30), P(-50, -34), P(-54, -24), P(-46, -24)), { w: 1.2, d: d + 400, t: 80 })
}

/** Schaf von der Seite, Kopf rechts: Wollkörper aus Locken, dunkler Kopf mit Ohr, vier Beine; Füße auf y */
function sheep(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  for (const k of [-14, -6, 8, 16]) ink(g, L(P(k, -12), P(k + (k % 2 ? 1 : -1), 0)), { w: 2 * Math.max(0.7, s), d: d + 200, t: 100 })
  const body: P[] = []
  for (let i = 0; i <= 16; i++) {
    const a = rad(i * 22.5)
    const r = 1 + (i % 2) * 0.12
    body.push(P(Math.cos(a) * 24 * r, -20 + Math.sin(a) * 12 * r))
  }
  blank(g, body)
  ink(g, body, { w: 2 * Math.max(0.7, s), d, t: 400 })
  if (s >= 0.8) for (let k = 0; k < 5; k++) ink(g, E(x + (-14 + k * 7) * s, y - (20 + (k % 2) * 4) * s, 3 * s, 2.5 * s, 200, 470), { w: 0.8, d: d + 300 + k * 40, t: 60 })
  const hd: P[] = smooth([P(20, -26), P(30, -32), P(40, -26), P(40, -18), P(30, -16), P(22, -20), P(20, -26)], 3)
  blank(g, hd)
  hatch(g, hd, d + 400, true)
  ink(g, hd, { w: 1.8 * Math.max(0.7, s), d: d + 300, t: 200 })
  ink(g, E(x + 24 * s, y - 30 * s, 5 * s, 2.4 * s), { w: 1.2, d: d + 400, t: 80 })
}

/** Grasbüschel */
function tuft(g: Element, x: number, y: number, s = 1, d = 0): void {
  for (const a of [-30, -10, 10, 30]) ink(g, B([x, y], [x + a * 0.1 * s, y - 6 * s], [x + a * 0.3 * s, y - 12 * s], [x + a * 0.4 * s, y - 14 * s]), { w: 1.2, d, t: 80 })
}

/** Fischkutter von der Seite, Bug rechts, mit Ausleger und Netz; Wasserlinie y */
function trawler(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const hull: P[] = [P(-50, -16), P(46, -16), P(56, -26), P(44, 0), P(-40, 0), P(-50, -16)]
  blank(g, hull)
  hatch(g, [P(-46, -6), P(50, -6), P(44, 0), P(-40, 0)], d + 300, true)
  ink(g, hull, { w: 2.2, d, t: 300 })
  ink(g, RR(x - 30 * s, y - 36 * s, 26 * s, 20 * s, 2), { w: 1.8, d: d + 200, t: 200 })
  ink(g, L(P(10, -16), P(10, -60)), { w: 1.8, d: d + 300, t: 150 })
  ink(g, L(P(10, -58), P(-44, -20)), { w: 1, d: d + 400, t: 150 })
  ink(g, L(P(-44, -20), P(-60, 30)), { w: 1, d: d + 500, t: 200 })
}

/** kleiner Fisch, Kopf rechts */
function ammFish(g: Element, x: number, y: number, d = 0): void {
  ink(g, [...B([x, y], [x + 6, y - 6], [x + 16, y - 6], [x + 20, y]), ...B([x + 20, y], [x + 16, y + 6], [x + 6, y + 6], [x, y]).slice(1), [x - 6, y - 5], [x - 6, y + 5], [x, y]], { w: 1.6, d, t: 200 })
  dot(g, x + 15, y - 1, 1.2, d + 100)
}

/** Eiswagen: Kasten auf Rädern, Sonnenschirm, Eistüte als Schild, Buchstabe; Boden bei y */
function stand(g: Element, x: number, y: number, label: string, d = 0): void {
  ink(g, RR(x - 24, y - 40, 48, 32, 4), { w: 2.4, d, t: 300 })
  for (const k of [-14, 14]) ink(g, E(x + k, y - 4, 5), { w: 1.6, d: d + 100, t: 80 })
  ink(g, L([x, y - 40], [x, y - 70]), { w: 1.8, d: d + 200, t: 150 })
  const um: P[] = [...B([x - 32, y - 66], [x - 22, y - 86], [x + 22, y - 86], [x + 32, y - 66]), [x - 32, y - 66]]
  blank(g, um)
  ink(g, um, { w: 2.2, d: d + 300, t: 300 })
  for (let k = 0; k < 4; k++) if (k % 2) hatch(g, [[x - 32 + k * 16, y - 66], [x - 16 + k * 16, y - 66], [x, y - 84]], d + 400)
  ink(g, [[x + 30, y - 40], [x + 36, y - 24], [x + 42, y - 40]], { w: 1.4, d: d + 400, t: 100 })
  ink(g, E(x + 36, y - 44, 6, 5), { w: 1.4, d: d + 450, t: 100 })
  text(g, x, y - 18, label, { anchor: 'middle', cls: 's', d: d + 400 })
}

/** Strand mit Meer im Hintergrund und gleichmäßig verteilten Badegästen (Handtücher) */
function beach(g: Element, y: number, d = 0, n = 12): void {
  travelWave(g, 20, 340, y + 50, 4, 50, { ms: 2600, d, w: 2 })
  ink(g, L([30, y + 20], [330, y + 20]), { w: 3, d: d + 200, t: 500 })
  for (let i = 0; i < n; i++) {
    const x = 42 + i * (276 / (n - 1))
    ink(g, RR(x - 8, y - 4, 16, 8, 2), { w: 1.2, d: d + 400 + i * 40, t: 60 })
    dot(g, x + 4, y, 2.6, d + 500 + i * 40)
  }
}

export const AHA_GELD: Bite[] = [
  {
    id: 'giralgeld',
    area: 'WIRT',
    day: 28,
    hook: 'Woher kommt eigentlich das Geld auf deinem Konto?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [],
    draw: {
      bankbild(g) {
        bank(g, 180, 400, 1.2)
        const c = glide(g, 0, 140, { ms: 1600, d: 1200, loop: true })
        coin(c, 300, 120, 22, '€', 900)
      },
      lager(g) {
        // Tresorraum: runde Tresortür mit Riegeln, dahinter Münzstapel – stimmt das Bild?
        ink(g, E(120, 480, 100), { w: 3.4, t: 700 })
        ink(g, E(120, 480, 84), { w: 1.6, d: 200, t: 600 })
        const wh = spin(g, 120, 480, 6000, 900)
        for (let k = 0; k < 6; k++) ink(wh, L([120, 480], [120 + Math.cos(rad(k * 60)) * 40, 480 + Math.sin(rad(k * 60)) * 40]), { w: 2.6, d: 500, t: 150 })
        ink(g, E(120, 480, 14), { w: 2.4, d: 600, t: 150 })
        for (let k = 0; k < 8; k++) ball(g, 120 + Math.cos(rad(k * 45)) * 92, 480 + Math.sin(rad(k * 45)) * 92, 4, { d: 700 + k * 40, fill: 'dicht', w: 1, t: 40 })
        stack(g, 250, 620, 8, 900)
        stack(g, 310, 620, 5, 1100, 40)
        question(g, 280, 400, 0.7, 1500)
      },
      kredit(g) {
        // Tastendruck am Bankrechner: der Kontostand-Balken wächst aus dem Nichts
        ink(g, RR(60, 330, 240, 170, 10), { w: 3, t: 700 })
        ink(g, RR(76, 346, 208, 120, 6), { w: 1.6, d: 300, t: 500 })
        ink(g, L([100, 446], [260, 446]), { w: 1.4, d: 500, t: 300 })
        const gr = group(g, 'grow-y', '--d:1400ms')
        hatch(gr, RR(150, 370, 60, 76, 3), 1400, true)
        ink(gr, RR(150, 370, 60, 76, 3), { w: 2, d: 1400, t: 0 })
        ink(g, RR(90, 530, 180, 60, 6), { w: 2.4, d: 500, t: 300 })
        for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) ink(g, RR(98 + i * 21, 538 + r * 17, 16, 12, 2), { w: 1, d: 700 + (r * 8 + i) * 15, t: 50 })
        const k = pop(g, 1200, '50% 50%')
        hatch(k, RR(224, 572, 37, 12, 2), 0, true)
        ripple(g, 242, 578, 6, 30, { n: 2, ms: 1200, d: 1300, w: 1, ry: 0.5 })
      },
      neu(g) {
        // die Sparerinnen und Sparer behalten alles: jedes Sparschwein ist noch voll
        crowd(g, 50, 600, 6, 52, 2.4, 0, 80)
        for (let i = 0; i < 6; i++) {
          const x = 50 + i * 52
          piggy(g, x, 640, 0.45, 600 + i * 80)
          check(g, x, 420, 0.4, 1200 + i * 60)
        }
      },
      anteil(g) {
        // großer Teil: Geld auf Konten (Karte), kleiner Teil: Bargeld (Schein, Münze)
        pie(g, 180, 460, 110, 0.9)
        ink(g, RR(240, 590, 70, 44, 6), { w: 2.2, d: 1200, t: 200 })
        hatch(g, RR(240, 600, 70, 8, 0), 1300, true)
        ink(g, RR(250, 616, 14, 10, 2), { w: 1, d: 1300, t: 60 })
        ink(g, RR(40, 300, 70, 36, 3), { w: 2, d: 1400, t: 200 })
        coin(g, 130, 320, 14, '€', 1500)
        ink(g, L([110, 340], [160, 360]), { w: 1, d: 1500, t: 100 })
      },
      tilgung(g) {
        // Kredit zurückgezahlt: der Balken schrumpft, ein Radiergummi löscht ihn
        ink(g, RR(60, 330, 240, 170, 10), { w: 3, t: 700 })
        ink(g, L([100, 446], [260, 446]), { w: 1.4, d: 300, t: 300 })
        const gr = group(g, 'shrink-y', '--d:1400ms')
        hatch(gr, RR(150, 370, 60, 76, 3), 400, true)
        ink(gr, RR(150, 370, 60, 76, 3), { w: 2, d: 400, t: 200 })
        const er = glide(g, -60, 0, { ms: 1400, d: 1200 })
        ink(er, [[220, 560], [290, 540], [300, 570], [230, 590], [220, 560]], { w: 2.2, d: 900, t: 200 })
        hatch(er, [[220, 560], [250, 552], [260, 582], [230, 590]], 1000, true)
        for (let k = 0; k < 5; k++) dot(g, 140 + k * 16, 610 + (k % 2) * 6, 1.6, 2000 + k * 40)
      },
      zentralbanken(g) {
        // zwei Notenbank-Gebäude: klassizistische Fassade (London) und Hochhausblock (Frankfurt), dazu Berichte
        bank(g, 100, 560, 0.7, 0)
        ink(g, RR(210, 380, 120, 180, 2), { w: 2.8, d: 400, t: 600 })
        for (let r = 0; r < 8; r++) ink(g, L([216, 396 + r * 20], [324, 396 + r * 20]), { w: 0.9, d: 600 + r * 40, t: 150 })
        for (let c = 0; c < 6; c++) ink(g, L([226 + c * 18, 384], [226 + c * 18, 556]), { w: 0.6, d: 800 + c * 30, t: 150 })
        ink(g, L([20, 562], [340, 562]), { w: 2.4, d: 200, t: 400 })
        for (const [x, d] of [[70, 1200], [250, 1400]] as const) {
          ink(g, [[x, 600], [x + 50, 596], [x + 52, 640], [x + 2, 644], [x, 600]], { w: 1.8, d, t: 200 })
          for (let k = 0; k < 3; k++) ink(g, L([x + 8, 610 + k * 9], [x + 42, 608 + k * 9]), { w: 0.8, d: d + 100, t: 60 })
        }
      },
      grenzen(g) {
        // Kredit kann ausfallen (gerissene Kette), Eigenkapital (Tresor mit Stapel), Vorschriften (Paragraf), Reserven
        for (const [x, y, broken] of [[60, 380, false], [90, 380, true], [120, 380, false]] as const) {
          ink(g, E(x, y, 14, 9), { w: 2.4, d: x * 3, t: 150 })
          if (broken) ink(g, L([x + 10, y - 10], [x + 18, y + 10]), { w: 3, d: 800, t: 80 })
        }
        cross(g, 90, 430, 0.6, 1000)
        ink(g, RR(210, 340, 100, 100, 6), { w: 2.6, d: 400, t: 400 })
        ink(g, E(260, 390, 20), { w: 2, d: 600, t: 200 })
        stack(g, 260, 410, 3, 800, 30)
        text(g, 90, 580, '§', { anchor: 'middle', size: 70, d: 900 })
        bank(g, 260, 620, 0.5, 1100)
      },
      leitzins(g) {
        // Drehregler der Zentralbank: von tief (−) nach hoch (+)
        ink(g, E(180, 470, 100), { w: 3, t: 800 })
        for (let k = 0; k <= 8; k++) {
          const a = rad(150 + k * 30)
          ink(g, L([180 + Math.cos(a) * 84, 470 + Math.sin(a) * 84], [180 + Math.cos(a) * 96, 470 + Math.sin(a) * 96]), { w: 2, d: 300 + k * 40, t: 100 })
        }
        const n = st(g, 'm1', '--m1: rotate(70deg); transform-origin: 180px 470px; transition-duration: 1.6s')
        ink(n, L([180, 470], [180 + Math.cos(rad(220)) * 76, 470 + Math.sin(rad(220)) * 76]), { w: 4, d: 700, t: 300 })
        ball(g, 180, 470, 10, { d: 600, fill: 'dicht', t: 200 })
        text(g, 80, 610, '−', { anchor: 'middle', size: 30, d: 900 })
        text(g, 280, 610, '+', { anchor: 'middle', size: 30, d: 1000 })
        bank(g, 180, 680, 0.3, 1100)
      },
      inflation(g) {
        // der Geldberg wächst schneller als der Warenkorb – das Preisschild klettert
        for (let i = 0; i < 6; i++) note(g, 40 + i * 10, 520 - i * 20, 110, '', 200 + i * 150, 14)
        ink(g, [[210, 520], [220, 580], [300, 580], [310, 520], [210, 520]], { w: 2.4, d: 600, t: 300 })
        for (const x of [230, 300]) ink(g, E(x, 596, 8), { w: 1.8, d: 700, t: 100 })
        ink(g, L([310, 520], [326, 500]), { w: 2.2, d: 700, t: 100 })
        for (let k = 0; k < 3; k++) ink(g, E(236 + k * 24, 508, 12, 10), { w: 1.6, d: 900 + k * 80, t: 100 })
        const t = glide(g, 0, -80, { ms: 2400, d: 1300, loop: true })
        ink(t, [[250, 450], [300, 450], [314, 466], [300, 482], [250, 482], [250, 450]], { w: 2, d: 1200, t: 150 })
        arrow(t, L([276, 478], [276, 456]), { w: 1.6, d: 1300, t: 100, head: 5 })
      },
      sturm(g) {
        // eine lange Schlange drängt zur verschlossenen Bank
        bank(g, 180, 480, 0.8)
        ink(g, RR(160, 420, 40, 60, 2), { w: 2.6, d: 600, t: 200 })
        ink(g, L([160, 450], [200, 450]), { w: 3, d: 700, t: 100 })
        for (let i = 0; i < 9; i++) {
          const f = wobble(g, { dx: 3, ms: 400 + i * 40, d: 1000 })
          fig(f, 30 + i * 36, 620, 2.2, { d: 600 + i * 60, arms: i % 3 === 0 ? 'up' : 'push' })
        }
      },
      sicherung(g) {
        // Schutzschild mit Schloss über einem Münzstapel
        const sh: P[] = [[180, 340], [270, 370], [260, 500], [180, 570], [100, 500], [90, 370], [180, 340]]
        hatch(g, sh, 600)
        ink(g, sh, { w: 3.2, t: 900 })
        ink(g, RR(156, 440, 48, 40, 4), { w: 2.6, d: 900, t: 200 })
        ink(g, B([164, 440], [164, 410], [196, 410], [196, 440]), { w: 2.4, d: 1000, t: 200 })
        stack(g, 180, 640, 4, 1100, 60)
      },
      gold(g) {
        // Goldbarren durchgestrichen – heute zählt der Handschlag, das Vertrauen
        for (let r = 0; r < 3; r++) for (let k = 0; k < 3 - r; k++) {
          const x = 40 + k * 50 + r * 25
          const y = 480 - r * 26
          ink(g, [[x, y], [x + 8, y - 22], [x + 42, y - 22], [x + 50, y], [x, y]], { w: 2, d: (r * 3 + k) * 80, t: 150 })
          hatch(g, [[x, y], [x + 8, y - 22], [x + 42, y - 22], [x + 50, y]], 300 + (r * 3 + k) * 80)
        }
        strike(g, [30, 400], [200, 490], 900)
        for (const k of [-1, 1]) ink(g, smooth([[260 + k * 70, 600], [260 + k * 40, 590], [260 + k * 14, 580], [260, 576]], 3), { w: 6, d: 1200, t: 300 })
        ink(g, E(260, 576, 16, 10), { w: 2.2, d: 1500, t: 150 })
        heart(g, 260, 520, 0.4, 1700)
      },
      ende(g) {
        ink(g, RR(90, 470, 180, 60, 6), { w: 3, t: 600 })
        for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) ink(g, RR(98 + i * 21, 478 + r * 17, 16, 12, 2), { w: 1, d: 300 + (r * 8 + i) * 15, t: 50 })
        ripple(g, 242, 512, 6, 30, { n: 2, ms: 1200, d: 900, w: 1, ry: 0.5 })
      },
      ausgleich(g) {
        // Überweisung zwischen zwei Banken: ausgeglichen wird mit Geld der Zentralbank (Mitte)
        bank(g, 70, 620, 0.45, 0)
        bank(g, 290, 620, 0.45, 200)
        bank(g, 180, 470, 0.55, 400)
        for (const [a, b, d] of [[[100, 540], [150, 440], 900], [[210, 440], [260, 540], 1300]] as const) {
          carrow(g, a as P, b as P, -20, { d })
          flow(g, B(a as P, [((a as P)[0] + (b as P)[0]) / 2, Math.min((a as P)[1], (b as P)[1]) - 20], [((a as P)[0] + (b as P)[0]) / 2, Math.min((a as P)[1], (b as P)[1]) - 20], b as P), { n: 2, ms: 1600, d: d + 300, r: 3 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { bankbild: {} } },
      { t: T('Viele denken: Eine Bank verleiht das Geld, das andere bei ihr **eingezahlt** haben – wie ein Lager voller Münzen.', 64), gfx: { lager: {} } },
      { t: T('So funktioniert es nicht. Der größte Teil des Geldes entsteht, wenn Banken **Kredite vergeben**.', 64), gfx: { lager: {} } },
      { t: T('Du leihst dir 10.000 Euro für ein Auto. Die Bank schreibt dir die Summe einfach auf dein Konto – **per Tastendruck**.', 64), gfx: { kredit: {} } },
      { t: T('Kein Sparer hat dafür weniger auf dem Konto. Das Geld ist **neu entstanden**.', 64), gfx: { neu: {} } },
      { t: T('Dieses Geld auf Konten heißt **Buchgeld** oder Giralgeld. Es macht den weitaus größten Teil der Geldmenge aus.', 64), gfx: { anteil: {} } },
      { t: T('Münzen und Scheine – das **Bargeld** – sind nur ein kleiner Teil. Es kommt von der Zentralbank.', 64), gfx: { anteil: {} } },
      { t: T('Zahlst du den Kredit zurück, **verschwindet** das Geld wieder. Kredite schaffen Geld, Tilgung löscht es.', 64), gfx: { tilgung: {} } },
      { t: T('Die Bank of England erklärte das 2014 ausdrücklich – und die **Bundesbank** bestätigte es 2017 in ihrem Monatsbericht.', 64), gfx: { zentralbanken: {} } },
      { t: T('Warum vergibt eine Bank dann nicht unbegrenzt Kredite? Weil sie **haftet**: Fällt ein Kredit aus, verliert sie Geld.', 64), gfx: { grenzen: {} } },
      { t: T('Außerdem braucht sie **Eigenkapital** und Reserven bei der Zentralbank – das schreiben Gesetze vor.', 64), gfx: { grenzen: {} } },
      { t: T('Und die Zentralbank steuert über den **Leitzins**, wie teuer Kredite sind: Hohe Zinsen bremsen die Geldschöpfung, niedrige beschleunigen sie.', 64), gfx: { leitzins: { cls: 'a1' } } },
      { t: T('Wächst die Geldmenge schneller als die Menge an Waren, kann das zu **Inflation** führen.', 64), gfx: { inflation: {} } },
      { t: T('Überweist du Geld zu einer anderen Bank, gleichen die Banken das untereinander mit **Zentralbankgeld** aus.', 64), gfx: { ausgleich: {} } },
      { t: T('Darum ist Vertrauen alles: Wollen plötzlich alle ihr Geld bar abheben, hat keine Bank genug – ein **Bankensturm**.', 64), gfx: { sturm: {} } },
      { t: T('Deshalb gibt es die **Einlagensicherung**: In der EU sind bis 100.000 Euro pro Person und Bank geschützt.', 64), gfx: { sicherung: {} } },
      { t: T('Früher war Geld an Gold gebunden. Seit 1971 ist auch der Dollar nicht mehr in Gold tauschbar – heutiges Geld beruht auf **Vertrauen**.', 64), gfx: { gold: {} } },
      { t: T('Geld entsteht durch **Kredit** – mit einem Tastendruck.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Banken verleihen nicht nur Erspartes: Ein Kredit schafft neues Buchgeld auf dem Konto.', 'Tilgung löscht dieses Geld wieder; Bargeld ist nur ein kleiner Teil der Geldmenge.', 'Grenzen setzen Haftung, Eigenkapital, Reserven und der Leitzins.'],
    sources: ['McLeay, Radia & Thomas 2014, Bank of England Quarterly Bulletin Q1', 'Deutsche Bundesbank 2017: Monatsbericht April (Geldschöpfung)', 'Richtlinie 2014/49/EU (Einlagensicherung)'],
  },
  {
    id: 'zinseszins',
    area: 'WIRT',
    day: 80,
    hook: 'Wie werden aus 100 Euro über 1.000 – ohne dass du etwas tust?',
    mood: 'hell',
    ambience: 'uhr',
    images: [],
    draw: {
      stapel(g) {
        // drei Münzstapel, aus jedem wächst ein Bäumchen – je älter, desto größer
        stack(g, 80, 400, 3, 0)
        stack(g, 180, 400, 8, 400)
        stack(g, 280, 400, 22, 800)
        for (const [x, top, s, d] of [[80, 366, 0.12, 1200], [180, 316, 0.2, 1400], [280, 176, 0.32, 1600]] as const) tree(g, x, top, s, d)
        ink(g, L([20, 402], [340, 402]), { w: 2, d: 200, t: 400 })
      },
      start(g) {
        // ein Schein, daneben ein Prozent-Plättchen, das jedes Jahr etwas dazulegt
        note(g, 70, 400, 170, '€', 0, 30)
        ball(g, 290, 440, 30, { d: 600, fill: 'hell', w: 2.4, t: 300 })
        text(g, 290, 452, '%', { anchor: 'middle', size: 30, cls: 'halo', d: 800 })
        carrow(g, [270, 470], [220, 500], 20, { d: 1000 })
        const c = glide(g, 0, 40, { ms: 1200, d: 1300, loop: true })
        coin(c, 250, 520, 10, '', 1200)
      },
      jahr1(g) {
        // jedes Jahr kommt eine Scheibe dazu – und jede neue ist ein bisschen dicker als die vorige
        ink(g, L([30, 600], [330, 600]), { w: 2.4, t: 400 })
        let h = 100
        for (let k = 0; k < 6; k++) {
          const x = 40 + k * 50
          const add = h * 0.07 * 4
          ink(g, RR(x, 600 - h, 36, h, 2), { w: 1.8, d: k * 200, t: 200 })
          hatch(g, RR(x, 600 - h, 36, h - (k ? add / 1.07 : 0), 2), k * 200 + 100)
          if (k) {
            hatch(g, RR(x, 600 - h, 36, add, 1), k * 200 + 200, true)
            ink(g, RR(x, 600 - h, 36, add, 1), { w: 1.2, d: k * 200 + 200, t: 80 })
          }
          h *= 1.07 * 1.12
        }
      },
      kurve(g) {
        // 100 € bei 7 %: alle zehn Jahre eine Verdopplung
        axes(g, 40, 600, 330, 320, { yl: 'Euro' })
        const f = (t: number) => (Math.pow(1.07, t * 35) - 1) / (Math.pow(1.07, 35) - 1)
        plot(g, 46, 596, 270, 250, f, { d: 400 })
        for (const yr of [10, 20, 30, 35]) {
          const x = 46 + (yr / 35) * 270
          const y = 596 - f(yr / 35) * 250
          dashes(g, L([x, 596], [x, y]), { w: 1, d: 1200 + yr * 30, dash: 3, gap: 3 })
          dot(g, x, y, 4.5, 1300 + yr * 30)
          text(g, x, 620, String(yr), { anchor: 'middle', cls: 's', d: 1300 + yr * 30 })
        }
        for (const [a, b] of [[10, 20], [20, 30]] as const) carrow(g, [46 + (a / 35) * 270, 596 - f(a / 35) * 250 - 12], [46 + (b / 35) * 270 - 6, 596 - f(b / 35) * 250 - 12], -20, { d: 1800 + a * 20 })
      },
      regel(g) {
        // drei Zinssätze: auf der Zeitleiste markiert, wann sich das Geld jeweils verdoppelt
        for (const [i, step, n] of [[0, 36, 1], [1, 10, 3], [2, 7, 5]] as const) {
          const y = 380 + i * 100
          for (let k = 0; k < n; k++) coin(g, 30 + k * 10, y, 8, '', i * 300 + k * 60)
          ink(g, L([90, y], [330, y]), { w: 2, d: 200 + i * 300, t: 400 })
          for (let t = step; t <= 36; t += step) {
            const x = 90 + (t / 36) * 240
            ink(g, L([x, y - 10], [x, y + 10]), { w: 2.4, d: 600 + i * 300 + t * 20, t: 60 })
            ball(g, x, y - 20, 4 + t / 6, { d: 700 + i * 300 + t * 20, fill: 'hell', w: 1.2, t: 60 })
          }
        }
      },
      anna(g) {
        // Zeitachse vom Alter 25 bis 65: oben die frühe Sparerin (nur zehn Jahre), unten der späte Sparer (dreißig Jahre)
        ink(g, L([60, 600], [330, 600]), { w: 2.4, t: 400 })
        for (const [age, l] of [[25, '25'], [35, '35'], [65, '65']] as const) {
          const x = 60 + ((age - 25) / 40) * 270
          ink(g, L([x, 592], [x, 608]), { w: 2, d: 300, t: 60 })
          text(g, x, 630, l, { anchor: 'middle', cls: 's', d: 400 })
        }
        fig(g, 34, 460, 1.8, { d: 500 })
        ink(g, B([26, 400], [30, 392], [40, 392], [44, 404]), { w: 3, d: 600, t: 100 })
        fig(g, 34, 560, 1.8, { d: 700 })
        for (const [y, a, b, d] of [[440, 25, 35, 900], [540, 35, 65, 1200]] as const) {
          const x0 = 60 + ((a - 25) / 40) * 270
          const x1 = 60 + ((b - 25) / 40) * 270
          hatch(g, RR(x0, y, x1 - x0, 18, 3), d + 100, true)
          ink(g, RR(x0, y, x1 - x0, 18, 3), { w: 2, d, t: 300 })
          for (let k = 0; k < (b - a) / 5; k++) coin(g, x0 + 10 + k * ((x1 - x0) / ((b - a) / 5)), y - 14, 6, '', d + 200 + k * 60)
        }
      },
      ergebnis(g) {
        // Endwerte mit 65: eingezahlter Anteil dunkel, Zinseszins hell – die Frühe liegt vorn
        for (const [x, total, paid, d] of [[110, 225, 20, 0], [250, 202, 60, 400]] as const) {
          const H = 250 / 225
          const r = RR(x - 35, 600 - total * H, 70, total * H, 3)
          hatch(g, r, d + 300)
          ink(g, r, { w: 2.4, d, t: 400 })
          hatch(g, RR(x - 35, 600 - paid * H, 70, paid * H, 2), d + 600, true)
          fig(g, x, 650, 1.4, { d: d + 200 })
        }
        ink(g, B([102, 608], [104, 600], [116, 600], [118, 608]), { w: 3, d: 900, t: 100 })
        ink(g, L([40, 602], [320, 602]), { w: 2.4, d: 200, t: 400 })
      },
      schulden(g) {
        // Dispo-Schuld als Kugel am Bein: Jahr für Jahr größer
        fig(g, 70, 620, 3.4, { d: 0 })
        for (const [x, r, d] of [[150, 14, 400], [210, 20, 700], [290, 30, 1000]] as const) {
          ink(g, L([70, 616], [x - r, 640 - r]), { w: 1.2, d, t: 200 })
          ball(g, x, 640 - r, r, { d: d + 100, fill: 'dicht', w: 2, t: 200 })
        }
        ink(g, L([20, 642], [340, 642]), { w: 2, d: 200, t: 400 })
      },
      kaufkraft(g) {
        // derselbe Schein: heute ein voller Einkaufskorb, Jahrzehnte später nur noch ein halber
        for (const [x, full, d] of [[90, true, 0], [270, false, 600]] as const) {
          note(g, x - 50, 360, 100, '€', d, 22)
          ink(g, [[x - 50, 520], [x - 40, 600], [x + 40, 600], [x + 50, 520], [x - 50, 520]], { w: 2.4, d: d + 300, t: 300 })
          ink(g, B([x - 40, 520], [x - 30, 470], [x + 30, 470], [x + 40, 520]), { w: 2, d: d + 400, t: 200 })
          const n = full ? 6 : 3
          for (let k = 0; k < n; k++) ink(g, E(x - 30 + (k % 3) * 30, 508 - Math.floor(k / 3) * 18, 12, 9), { w: 1.6, d: d + 500 + k * 60, t: 80 })
        }
        arrow(g, L([160, 560], [200, 560]), { w: 2.4, d: 900, t: 300, head: 9 })
      },
      gebuehr(g) {
        // zwei Wachstumskurven; aus der unteren tropfen jedes Jahr Gebühren ab
        axes(g, 40, 600, 330, 320, {})
        plot(g, 46, 596, 270, 250, (t) => (Math.pow(1.06, t * 30) - 1) / (Math.pow(1.06, 30) - 1), { d: 400 })
        plot(g, 46, 596, 270, 250, (t) => (Math.pow(1.04, t * 30) - 1) / (Math.pow(1.06, 30) - 1), { d: 800, w: 2 })
        for (let k = 0; k < 4; k++) {
          const t = 0.4 + k * 0.18
          const x = 46 + t * 270
          const y = 596 - ((Math.pow(1.04, t * 30) - 1) / (Math.pow(1.06, 30) - 1)) * 250
          const dr = glide(g, 0, 30, { ms: 1200, d: 1400 + k * 200, loop: true })
          drop(dr, x, y + 14, 0.25, 1300)
        }
      },
      risiko(g) {
        // Kurs mit Zacken gegenüber der ruhigen Linie: höhere Rendite, mehr Schwankung
        axes(g, 40, 600, 330, 330, { xl: 'Jahre', yl: 'Wert' })
        dashes(g, L([46, 560], [320, 420]), { w: 1.4, d: 300, dash: 5, gap: 4 })
        ink(g, [[46, 560], [80, 520], [110, 540], [140, 470], [170, 500], [200, 420], [230, 460], [260, 390], [290, 400], [320, 350]], { w: 2.6, d: 600, t: 1200 })
        const w = wobble(g, { dy: 8, ms: 600, d: 1600 })
        dot(w, 320, 350, 5, 1600)
      },
      ende(g) {
        stack(g, 120, 600, 4)
        stack(g, 240, 600, 14, 400)
        tree(g, 240, 456, 0.24, 1200)
      },
      regel72(g) {
        // 72 Münzen, aufgeteilt in Häufchen zu je 7: rund zehn Häufchen
        for (let i = 0; i < 72; i++) {
          const grp = Math.floor(i / 7)
          const j = i % 7
          const x = 40 + (grp % 5) * 62 + (j % 4) * 11
          const y = 400 + Math.floor(grp / 5) * 110 + Math.floor(j / 4) * 12
          ink(g, E(x, y, 5, 3), { w: 1.2, d: grp * 120 + j * 20, t: 40 })
        }
        for (let grp = 0; grp < 11; grp++) {
          const x = 30 + (grp % 5) * 62
          const y = 386 + Math.floor(grp / 5) * 110
          dashes(g, RR(x, y, 52, 34, 6), { w: 1, d: 1500 + grp * 60, dash: 3, gap: 3 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { stapel: {} } },
      { t: T('Du legst 100 Euro an, zu **7 Prozent** Zinsen im Jahr – und rührst sie nicht an.', 64), gfx: { start: {} } },
      { t: T('Nach einem Jahr hast du 107 Euro. Im nächsten Jahr gibt es Zinsen **auf die 107** – nicht nur auf die 100.', 64), gfx: { jahr1: {} } },
      { t: T('Das sind die **Zinseszinsen**: Zinsen auf Zinsen. Am Anfang kaum spürbar – ein paar Cent mehr.', 64), gfx: { jahr1: {} } },
      { t: T('Nach 10 Jahren hast du knapp **200 Euro**. Das Geld hat sich verdoppelt.', 64), gfx: { kurve: {} } },
      { t: T('Nach 20 Jahren rund **390 Euro**, nach 30 Jahren rund 760 Euro.', 64), gfx: { kurve: {} } },
      { t: T('Nach 35 Jahren über **1.000 Euro**. Aus 100 wurde das Zehnfache – ohne einen Cent dazuzulegen.', 64), gfx: { kurve: {} } },
      { t: T('Eine Faustregel ist die **72er-Regel**: 72 geteilt durch den Zinssatz ergibt die Jahre bis zur Verdopplung.', 64), gfx: { regel72: {} } },
      { t: T('Bei 7 Prozent sind das rund 10 Jahre, bei 2 Prozent **36 Jahre**, bei 10 Prozent nur 7.', 64), gfx: { regel: {} } },
      { t: T('Darum zählt vor allem die **Zeit**: Wer früh anfängt, hat mehr Verdopplungen vor sich.', 64), gfx: { kurve: {} } },
      { t: T('Ein Rechenbeispiel: Anna legt von 25 bis 35 jedes Jahr 2.000 Euro an – dann nie wieder. Ben fängt erst mit 35 an und zahlt **30 Jahre** lang ein.', 64), gfx: { anna: {} } },
      { t: T('Bei 7 Prozent hat Anna mit 65 trotzdem **mehr** – obwohl sie nur ein Drittel so viel eingezahlt hat.', 64), gfx: { ergebnis: {} } },
      { t: T('Zinseszins wirkt aber auch **gegen dich**: Bei Schulden wächst der Betrag genauso. Ein Dispo mit 12 Prozent verdoppelt eine Schuld in rund 6 Jahren.', 64), gfx: { schulden: {} } },
      { t: T('Auch **Inflation** wirkt wie Zinseszins: Bei 2 Prozent Teuerung halbiert sich die Kaufkraft in etwa 36 Jahren.', 64), gfx: { kaufkraft: {} } },
      { t: T('Und **Kosten** fressen sich ebenfalls hinein: Ein Fonds mit 2 Prozent Gebühren im Jahr kostet über Jahrzehnte einen großen Teil des Ertrags.', 64), gfx: { gebuehr: {} } },
      { t: T('Wichtig: 7 Prozent garantiert niemand. Höhere Erträge bedeuten meist **mehr Schwankung** und Risiko.', 64), gfx: { risiko: {} } },
      { t: T('Einstein soll den Zinseszins das „achte Weltwunder“ genannt haben. Belegt ist das **nicht** – der Gedanke stimmt trotzdem.', 64), gfx: { stapel: { tf: [0.8, 36, 260] } } },
      { t: T('Zinseszins belohnt vor allem eins: **früh anfangen**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Zinseszins: Zinsen werden mitverzinst – das Wachstum beschleunigt sich.', '72 ÷ Zinssatz ≈ Jahre bis zur Verdopplung; Zeit ist der wichtigste Hebel.', 'Derselbe Effekt wirkt bei Schulden, Inflation und Gebühren gegen dich.'],
    sources: ['Deutsche Bundesbank: Geld und Geldpolitik (Schülerbuch)', 'Verbraucherzentrale: Zinseszins und Sparpläne', 'Quote Investigator 2011: Einstein und das „achte Weltwunder“'],
  },
  {
    id: 'simbabwe',
    area: 'WIRT',
    day: 28,
    hook: 'Warum druckt ein Staat nicht einfach mehr Geld?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [],
    draw: {
      schein(g) {
        // simbabwischer Riesenschein: lange Ziffernreihe, Balancierfelsen als Motiv, Wasserzeichen
        blank(g, RR(20, 150, 320, 160, 8))
        ink(g, RR(20, 150, 320, 160, 8), { w: 2.8, t: 600 })
        ink(g, RR(30, 160, 300, 140, 4), { w: 1, d: 200, t: 500 })
        text(g, 180, 200, '100 000 000 000 000', { anchor: 'middle', size: 18, d: 600 })
        for (const [x, y, rx, ry] of [[80, 270, 26, 16], [84, 244, 18, 12], [78, 226, 12, 8]] as const) {
          blank(g, E(x, y, rx, ry))
          hatch(g, E(x, y, rx, ry), 900)
          ink(g, E(x, y, rx, ry), { w: 1.6, d: 800, t: 200 })
        }
        ink(g, E(270, 254, 28, 34), { w: 1, d: 1000, t: 300 })
        for (let k = 0; k < 4; k++) ink(g, L([140, 236 + k * 12], [230, 236 + k * 12]), { w: 0.7, d: 1100 + k * 50, t: 100 })
      },
      presse(g) {
        // Druckmaschine: Walzen drehen sich, Scheine kommen heraus und häufen sich
        ink(g, RR(60, 360, 220, 150, 10), { w: 3, t: 700 })
        for (const x of [120, 220]) {
          ink(g, E(x, 430, 34), { w: 2.6, d: 300, t: 400 })
          const r = spin(g, x, 430, 1200, 900)
          for (let k = 0; k < 6; k++) ink(r, L([x + Math.cos(rad(k * 60)) * 10, 430 + Math.sin(rad(k * 60)) * 10], [x + Math.cos(rad(k * 60)) * 28, 430 + Math.sin(rad(k * 60)) * 28]), { w: 1.2, d: 600, t: 80 })
        }
        ink(g, L([60, 470], [20, 470]), { w: 2, d: 400, t: 150 })
        for (let i = 0; i < 4; i++) {
          const out = glide(g, 40, 80, { ms: 1400, d: 1000 + i * 400, loop: true })
          note(out, 270, 470, 60, '', 900 + i * 400, 10)
        }
        for (let i = 0; i < 5; i++) note(g, 220 + i * 6, 600 - i * 8, 80, '', 1200 + i * 100, 10)
      },
      waren(g) {
        // links ein Regal mit gleich wenigen Waren, rechts ein wachsender Geldberg
        ink(g, RR(30, 380, 130, 220, 4), { w: 2.4, t: 500 })
        for (let k = 1; k < 3; k++) ink(g, L([30, 380 + k * 73], [160, 380 + k * 73]), { w: 1.8, d: 200, t: 200 })
        for (let k = 0; k < 4; k++) ink(g, RR(42 + (k % 2) * 56, 400 + Math.floor(k / 2) * 73 + 10, 40, 40, 4), { w: 1.8, d: 400 + k * 80, t: 100 })
        for (let i = 0; i < 14; i++) {
          const p = pop(g, 600 + i * 120, '50% 100%')
          note(p, 190 + (i % 3) * 36, 580 - Math.floor(i / 3) * 34, 70, '', 0, 10)
        }
        ink(g, L([20, 620], [340, 620]), { w: 2, d: 200, t: 400 })
      },
      schild(g) {
        ink(g, RR(80, 380, 200, 120, 8), { w: 3, t: 600 })
        const loaf: P[] = [...B([110, 440], [110, 410], [170, 410], [170, 440]), [110, 440]]
        hatch(g, loaf, 400)
        ink(g, loaf, { w: 2, d: 300, t: 300 })
        const p1 = st(g, 'h1')
        text(p1, 230, 446, '1 Mio.', { anchor: 'middle', size: 22, d: 500 })
        const p2 = st(g, 'f1', '--dl: 400ms')
        text(p2, 230, 446, '3 Mio.', { anchor: 'middle', size: 22, fade: false })
        for (let k = 0; k < 3; k++) ink(g, L([96, 470 + k * 8], [264, 470 + k * 8]), { w: 0.6, d: 600, t: 100 })
        clock(g, 180, 590, 40, 90, 180, 700)
        const hd = spin(g, 180, 590, 2000, 1200)
        ink(hd, L([180, 590], [180, 560]), { w: 2, d: 1100, t: 100 })
      },
      rekord(g) {
        // Schubkarre voller Scheine für ein einziges Brot
        const wb: P[] = [[60, 560], [80, 600], [230, 600], [260, 560], [60, 560]]
        ink(g, wb, { w: 2.8, t: 500 })
        ink(g, E(150, 620, 18), { w: 2.4, d: 300, t: 200 })
        ink(g, L([230, 590], [300, 560]), { w: 2.6, d: 400, t: 200 })
        ink(g, L([90, 600], [80, 640]), { w: 2.2, d: 400, t: 100 })
        for (let i = 0; i < 16; i++) note(g, 70 + (i % 4) * 40, 540 - Math.floor(i / 4) * 26 + (i % 2) * 4, 56, '', 600 + i * 80, 10)
        const loaf: P[] = [...B([270, 420], [270, 390], [330, 390], [330, 420]), [270, 420]]
        hatch(g, loaf, 1600)
        ink(g, loaf, { w: 2.2, d: 1500, t: 200 })
        carrow(g, [240, 460], [270, 430], -20, { d: 1800 })
      },
      dollar(g) {
        note(g, 40, 380, 130, 'Z$', 0, 16)
        cross(g, 105, 470, 1, 600)
        note(g, 190, 380, 130, 'US$', 400, 16)
        check(g, 255, 470, 1, 900)
        for (let i = 0; i < 3; i++) {
          const f = glide(g, 0, 60, { ms: 1600, d: 1100 + i * 300, loop: true })
          note(f, 50 + i * 30, 520, 50, '', 1000 + i * 300, 8)
        }
      },
      berlin(g) {
        // 1923: ein Korb voller Geldbündel für ein einziges Brot, Kinder spielen mit Scheinstapeln
        fig(g, 90, 620, 4, { d: 0, arms: 'push' })
        ink(g, [[120, 540], [130, 600], [220, 600], [230, 540], [120, 540]], { w: 2.6, d: 300, t: 400 })
        for (let i = 0; i < 9; i++) ink(g, RR(128 + (i % 3) * 32, 520 - Math.floor(i / 3) * 14, 30, 16, 2), { w: 1.4, d: 500 + i * 60, t: 80 })
        const loaf: P[] = [...B([250, 440], [250, 410], [320, 410], [320, 440]), [250, 440]]
        hatch(g, loaf, 1300)
        ink(g, loaf, { w: 2.2, d: 1200, t: 200 })
        for (let k = 0; k < 4; k++) ink(g, RR(250 + (k % 2) * 36, 620 - Math.floor(k / 2) * 18, 32, 16, 2), { w: 1.4, d: 1400 + k * 80, t: 80 })
        fig(g, 300, 640, 1.6, { d: 1600, arms: 'up' })
      },
      ezb(g) {
        // EZB-Turm in Frankfurt (zwei gegeneinander gedrehte Scheiben), davor das Euro-Zeichen
        ink(g, [[140, 640], [150, 320], [190, 312], [186, 640]], { w: 2.8, t: 700 })
        ink(g, [[186, 640], [196, 330], [236, 340], [230, 640]], { w: 2.8, d: 200, t: 700 })
        for (let k = 0; k < 14; k++) ink(g, L([150, 340 + k * 21], [186, 338 + k * 21]), { w: 0.6, d: 600 + k * 30, t: 80 })
        hatch(g, [[186, 640], [196, 330], [236, 340], [230, 640]], 900)
        text(g, 290, 600, '€', { anchor: 'middle', size: 70, d: 1200 })
        for (let k = 0; k < 12; k++) star(g, 290 + Math.cos(rad(k * 30)) * 44, 576 + Math.sin(rad(k * 30)) * 44, 4, { d: 1300 + k * 40 })
        ink(g, L([20, 640], [340, 640]), { w: 2.4, d: 300, t: 400 })
      },
      zwei(g) {
        // Zielscheibe: der Pfeil trifft knapp neben der Null – ein kleiner, stetiger Anstieg
        for (let k = 4; k >= 1; k--) {
          ink(g, E(180, 470, k * 34), { w: 2.2, d: (4 - k) * 150, t: 300 })
          if (k === 2) hatch(g, [...E(180, 470, 68), ...E(180, 470, 34).reverse()], 800)
        }
        const a = glide(g, 120, -60, { ms: 900, d: 1200 })
        ink(a, L([80, 580], [130, 548]), { w: 2.6, d: 1100, t: 150 })
        ink(a, [[74, 572], [80, 580], [72, 586]], { w: 2, d: 1100, t: 80 })
      },
      deflation(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Zeit', yl: 'Preise' })
        plot(g, 46, 596, 270, 200, (t) => 0.8 - t * 0.6, { d: 400 })
        fig(g, 250, 590, 2, { d: 900, arms: 'cross' })
        clock(g, 300, 400, 22, 90, 0, 1100)
        ink(g, RR(150, 640, 60, 20, 4), { w: 1.6, d: 1200, t: 150 })
        strike(g, [146, 636], [214, 664], 1400)
      },
      vertrauen(g) {
        // ein Schein und ein Handschlag: wertvoll, weil alle ihn annehmen
        note(g, 90, 360, 180, '€', 0, 30)
        for (const k of [-1, 1]) ink(g, smooth([[180 + k * 120, 580], [180 + k * 70, 570], [180 + k * 20, 556], [180, 552]], 3), { w: 7, d: 700, t: 300 })
        ink(g, E(180, 552, 22, 14), { w: 2.4, d: 1000, t: 150 })
        heart(g, 180, 620, 0.4, 1300)
      },
      unabhaengig(g) {
        // Notenbank und Regierungsgebäude mit Kuppel und Fahne – getrennt durch eine Mauer
        bank(g, 100, 600, 0.6)
        ink(g, RR(230, 480, 100, 120, 4), { w: 2.8, d: 300, t: 500 })
        ink(g, E(280, 480, 30, 30, 180, 360), { w: 2.4, d: 500, t: 300 })
        ink(g, L([280, 450], [280, 410]), { w: 1.8, d: 600, t: 150 })
        const fl = wobble(g, { deg: 6, ox: 280, oy: 412, ms: 700, d: 900 })
        ink(fl, [[280, 410], [306, 418], [280, 426]], { w: 1.8, d: 700, t: 150 })
        for (let k = 0; k < 4; k++) ink(g, RR(240 + k * 22, 510, 14, 30, 2), { w: 1.2, d: 700 + k * 40, t: 80 })
        for (let r = 0; r < 8; r++) ink(g, RR(184, 600 - (r + 1) * 22, 14 + (r % 2) * 4, 20, 1), { w: 1.4, d: 1000 + r * 60, t: 60 })
        ink(g, L([20, 602], [340, 602]), { w: 2.4, d: 200, t: 400 })
      },
      ende(g) {
        for (let i = 0; i < 4; i++) note(g, 80 + i * 20, 430 + i * 20, 160, i === 3 ? '€' : '', i * 150, 14)
      },
      preise(g) {
        // Wippe: der Geldberg wird schwerer, die Waren bleiben gleich – das Preisschild steigt
        ink(g, [[160, 620], [180, 580], [200, 620], [160, 620]], { w: 2.4, t: 300 })
        const wp = mk('g', { transform: 'rotate(8 180 580)' }, g)
        ink(wp, L([40, 580], [320, 580]), { w: 3, d: 200, t: 400 })
        for (let i = 0; i < 6; i++) note(wp, 230 + (i % 2) * 34, 556 - Math.floor(i / 2) * 22, 60, '', 400 + i * 100, 10)
        for (let k = 0; k < 2; k++) ink(wp, RR(60 + k * 46, 536, 40, 40, 4), { w: 1.8, d: 500, t: 100 })
        const t = glide(g, 0, -90, { ms: 2600, d: 1200, loop: true })
        ink(t, [[90, 460], [150, 460], [166, 478], [150, 496], [90, 496], [90, 460]], { w: 2, d: 1100, t: 150 })
        arrow(t, L([120, 490], [120, 466]), { w: 1.8, d: 1200, t: 100, head: 6 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { schein: {} } },
      { t: T('Eine verlockende Idee: Der Staat braucht Geld? Dann **druckt** er eben welches!', 64), gfx: { presse: {} } },
      { t: T('Simbabwe tat genau das. Ab den 2000er-Jahren ließ die Regierung immer mehr Geld drucken, um ihre **Ausgaben** zu bezahlen.', 64), gfx: { presse: {} } },
      { t: T('Die Waren im Land wurden aber nicht mehr – die Wirtschaft schrumpfte sogar. Nur das **Geld** wurde mehr.', 64), gfx: { waren: {} } },
      { t: T('Mehr Geld jagt dieselben Waren. Also steigen die **Preise**.', 64), gfx: { preise: {} } },
      { t: T('Händler mussten ihre Preisschilder **mehrmals am Tag** ändern. Wer Lohn bekam, rannte sofort einkaufen.', 64), gfx: { schild: { cls: 'a1' } } },
      { t: T('Im November 2008 lag die Inflation bei geschätzt **79,6 Milliarden** Prozent im Monat. Preise verdoppelten sich etwa jeden Tag.', 64), gfx: { rekord: {} } },
      { t: T('Die Notenbank druckte schließlich einen Schein über **100 Billionen** Dollar. Er war bald fast nichts mehr wert.', 64), gfx: { schein: { tf: [1, 0, 260] } } },
      { t: T('Das nennt man **Hyperinflation**: Geld verliert so schnell an Wert, dass es niemand mehr behalten will.', 64), gfx: { rekord: {} } },
      { t: T('Wer Schulden hatte, freute sich: Sie schmolzen **dahin**. Wer gespart hatte, verlor alles.', 64), gfx: { rekord: {} } },
      { t: T('Die Menschen tauschten Waren oder nutzten **US-Dollar**. 2009 gab Simbabwe die eigene Währung auf.', 64), gfx: { dollar: {} } },
      { t: T('Deutschland kennt das: Im November 1923 kostete ein Brot in Berlin über **200 Milliarden** Mark.', 64), gfx: { berlin: {} } },
      { t: T('Ersparnisse wurden wertlos. Diese Erfahrung prägte das Land – und den Auftrag der Bundesbank, später der **EZB**: stabile Preise.', 64), gfx: { ezb: {} } },
      { t: T('Ein bisschen Inflation gilt trotzdem als gesund: Die EZB strebt rund **2 Prozent** im Jahr an – als Puffer.', 64), gfx: { zwei: {} } },
      { t: T('Denn auch sinkende Preise, **Deflation**, sind gefährlich: Menschen warten mit Käufen, Firmen investieren weniger, die Wirtschaft stockt.', 64), gfx: { deflation: {} } },
      { t: T('Geld ist im Kern **Vertrauen**: Ein Schein ist Papier – wertvoll nur, weil alle glauben, dass man morgen noch etwas dafür bekommt.', 64), gfx: { vertrauen: {} } },
      { t: T('Darum sind Zentralbanken heute meist **unabhängig**: Regierungen sollen sich nicht einfach selbst Geld drucken können.', 64), gfx: { unabhaengig: {} } },
      { t: T('Mehr Geld ohne mehr Waren bringt nur eins: **höhere Preise**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Mehr Geld bei gleich vielen Waren treibt die Preise – im Extrem bis zur Hyperinflation.', 'Simbabwe 2008: ~79,6 Mrd. % pro Monat; Deutschland 1923: Brot für über 200 Mrd. Mark.', 'Unabhängige Zentralbanken zielen auf rund 2 % Inflation.'],
    sources: ['Hanke & Kwok 2009, Cato Journal 29 (Simbabwe)', 'Deutsches Historisches Museum: Inflation 1923', 'EZB: Strategie der Geldpolitik 2021'],
  },
  {
    id: 'allmende',
    area: 'WIRT',
    day: 42,
    hook: 'Warum werden gemeinsame Wiesen kahl gefressen?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [],
    draw: {
      weide(g) {
        // Gemeindeweide mit Zaun, Baum und grasenden Schafen
        ink(g, B([20, 400], [120, 380], [240, 390], [340, 380]), { w: 3, t: 700 })
        for (let k = 0; k < 8; k++) {
          ink(g, L([24 + k * 44, 400 - (k % 3) * 4], [24 + k * 44, 360 - (k % 3) * 4]), { w: 2, d: 300 + k * 40, t: 100 })
        }
        ink(g, B([24, 372], [120, 364], [240, 370], [332, 360]), { w: 1.4, d: 600, t: 400 })
        tree(g, 300, 384, 0.5, 400)
        for (let k = 0; k < 12; k++) tuft(g, 30 + k * 27, 392 - (k % 3) * 4, 1, 700 + k * 30)
        for (const [x, y, d] of [[70, 340, 900], [160, 330, 1100], [250, 350, 1300], [110, 250, 1500], [220, 240, 1700]] as const) {
          const w = wobble(g, { dx: 3, ms: 2400 + x * 5, d: 1800 })
          sheep(w, x, y, 1.1, d)
        }
      },
      dorf(g) {
        // vier Höfe rund um die gemeinsame Weide in der Mitte
        for (let i = 0; i < 4; i++) house(g, 30 + i * 80, 400, 50, i * 150)
        ink(g, E(180, 540, 150, 60), { w: 2.4, d: 600, t: 700 })
        for (let k = 0; k < 14; k++) tuft(g, 50 + (k % 7) * 40, 520 + Math.floor(k / 7) * 34, 1, 800 + k * 30)
        for (let i = 0; i < 4; i++) {
          sheep(g, 70 + i * 70, 560 - (i % 2) * 24, 0.8, 1100 + i * 100)
          dashes(g, L([55 + i * 80, 410], [70 + i * 70, 520]), { w: 1, d: 1300 + i * 80, dash: 3, gap: 4 })
        }
      },
      gewinn(g) {
        // ein Schaf mehr: Wolle und Milch für den Besitzer – das Gras teilen sich alle
        sheep(g, 90, 500, 1.6)
        ink(g, smooth([[40, 560], [60, 540], [90, 546], [110, 534], [130, 560]], 3), { w: 2, d: 400, t: 200 })
        coin(g, 140, 420, 16, '€', 700)
        carrow(g, [110, 450], [130, 430], -20, { d: 900 })
        ink(g, B([200, 560], [240, 550], [290, 555], [330, 550]), { w: 2.4, d: 300, t: 500 })
        for (let i = 0; i < 6; i++) {
          const t = mk('g', { class: 'h1' }, g)
          tuft(t, 210 + i * 22, 556, 1.2, 700 + i * 50)
        }
        for (let i = 0; i < 4; i++) sheep(g, 214 + i * 34, 520, 0.5, 1000 + i * 100)
      },
      mehr(g) {
        // immer mehr Schafe, immer weniger Gras
        ink(g, B([20, 600], [120, 580], [240, 590], [340, 580]), { w: 3, t: 700 })
        for (let k = 0; k < 4; k++) tuft(g, 60 + k * 80, 594, 1, 500)
        for (let i = 0; i < 12; i++) {
          const p = pop(g, 600 + i * 180, '50% 100%')
          sheep(p, 40 + (i % 6) * 54, 480 + Math.floor(i / 6) * 60, 0.8, 0)
        }
      },
      kahl(g) {
        // kahle, rissige Erde, magere Schafe stehen herum
        ink(g, B([20, 600], [120, 580], [240, 590], [340, 580]), { w: 3, t: 700 })
        hatch(g, [...B([20, 600], [120, 580], [240, 590], [340, 580]), [340, 640], [20, 640]], 300)
        for (let k = 0; k < 6; k++) ink(g, [[40 + k * 50, 600], [50 + k * 50, 612], [44 + k * 50, 624], [56 + k * 50, 636]], { w: 1.2, d: 500 + k * 60, t: 100 })
        for (let i = 0; i < 3; i++) sheep(g, 90 + i * 90, 570, 0.9, 700 + i * 100)
        for (let k = 0; k < 3; k++) {
          const w = wobble(g, { dx: 10, dy: -4, ms: 2400 + k * 300, d: 1200 })
          cloud(w, 80 + k * 100, 420 + (k % 2) * 30, 0.3, 1100 + k * 100, true)
        }
      },
      hardin(g) {
        // Schreibtisch mit Lampe: ein Aufsatz, darauf die Skizze einer Weide mit Schafen
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        for (const x of [40, 320]) ink(g, L([x, 600], [x, 650]), { w: 2.6, d: 200, t: 200 })
        const pg: P[] = [[60, 450], [240, 440], [246, 590], [66, 596], [60, 450]]
        blank(g, pg)
        ink(g, pg, { w: 2, d: 300, t: 400 })
        for (let k = 0; k < 3; k++) ink(g, L([76, 466 + k * 14], [226, 460 + k * 14]), { w: 0.8, d: 500 + k * 60, t: 100 })
        ink(g, E(156, 550, 70, 24), { w: 1.4, d: 800, t: 300 })
        for (let i = 0; i < 4; i++) sheep(g, 110 + i * 30, 560, 0.4, 1000 + i * 100)
        ink(g, [[270, 600], [270, 430], [310, 390]], { w: 2.4, d: 600, t: 400 })
        ink(g, [[290, 370], [340, 390], [322, 420], [290, 370]], { w: 2.2, d: 800, t: 200 })
        hatch(g, [[290, 370], [340, 390], [322, 420]], 900, true)
      },
      meer(g) {
        // Kutter schleppen dichte Netze durch ein immer leereres Meer
        for (const [y, d] of [[380, 0], [420, 100]] as const) travelWave(g, 20, 340, y, 5, 60, { ms: 2600 + y, d, w: 2 })
        trawler(g, 120, 382, 1.2, 300)
        trawler(g, 290, 380, 0.8, 500)
        const net: P[] = [[48, 418], [20, 520], [60, 600], [110, 560], [48, 418]]
        ink(g, net, { w: 1.4, d: 800, t: 300 })
        for (let k = 0; k < 6; k++) ink(g, L([30 + k * 12, 460 + k * 10], [80 + k * 4, 440 + k * 22]), { w: 0.6, d: 900, t: 100 })
        for (let k = 0; k < 6; k++) ammFish(g, 40 + (k % 3) * 20, 520 + Math.floor(k / 3) * 30, 1000 + k * 60)
        for (const [x, y, dd] of [[220, 560, 1200], [290, 610, 1400]] as const) {
          const f = glide(g, -40, 0, { ms: 3000, d: dd, loop: true })
          ammFish(f, x, y, dd)
        }
      },
      kabeljau(g) {
        // Kabeljaubestand vor Neufundland: Absturz und keine Erholung
        axes(g, 40, 600, 330, 330, { xl: 'Jahre', yl: 'Bestand' })
        plot(g, 46, 596, 270, 240, (t) => (t < 0.55 ? 0.9 - t * 0.6 : t < 0.65 ? 0.57 - (t - 0.55) * 5 : 0.07), { d: 400 })
        dashes(g, L([46 + 0.6 * 270, 596], [46 + 0.6 * 270, 370]), { w: 1, d: 1300, dash: 3, gap: 3 })
        const cod: P[] = smooth([[230, 380], [250, 364], [290, 362], [314, 374], [300, 388], [254, 392], [230, 380]], 3)
        blank(g, cod)
        ink(g, cod, { w: 2, d: 1500, t: 300 })
        ink(g, [[230, 380], [216, 368], [218, 392], [230, 380]], { w: 1.6, d: 1600, t: 100 })
        dot(g, 304, 372, 1.6, 1700)
        ink(g, B([300, 386], [304, 396], [302, 400], [298, 404]), { w: 1, d: 1700, t: 60 })
      },
      ostrom(g) {
        // Medaille mit Lorbeer; eine Forscherin mit Notizbuch zwischen Dorfleuten am runden Tisch
        ball(g, 180, 380, 50, { fill: 'hell', w: 3, t: 500 })
        ink(g, E(180, 380, 40), { w: 1.2, d: 300, t: 400 })
        for (const k of [-1, 1]) for (let j = 0; j < 5; j++) {
          const a = rad(90 + k * (40 + j * 22))
          ink(g, E(180 + Math.cos(a) * 30, 380 + Math.sin(a) * 30, 3, 6), { w: 1, d: 500 + j * 40, t: 60 })
        }
        ink(g, smooth([[172, 362], [186, 360], [192, 372], [188, 392], [176, 396]], 3), { w: 1.6, d: 700, t: 200 })
        ink(g, E(180, 600, 100, 22), { w: 2.4, d: 800, t: 400 })
        crowd(g, 80, 590, 6, 40, 1.8, 1000, 80)
        ink(g, RR(196, 540, 16, 20, 2), { w: 1.4, d: 1400, t: 100 })
      },
      alm(g) {
        // Schweizer Alm: Berge, Hütte, Kühe mit Glocken
        mountain(g, 30, 330, 560, [180, 360])
        mountain(g, 200, 340, 560, [290, 420], 300)
        ink(g, L([20, 604], [340, 604]), { w: 2.6, d: 300, t: 500 })
        house(g, 40, 600, 60, 600)
        for (const [x, d] of [[170, 900], [250, 1100]] as const) {
          const body: P[] = smooth([[x - 30, 580], [x - 26, 556], [x + 20, 554], [x + 26, 566], [x + 22, 584], [x - 30, 584], [x - 30, 580]], 3)
          blank(g, body)
          ink(g, body, { w: 2, d, t: 300 })
          for (const k of [-24, -14, 10, 20]) ink(g, L([x + k, 584], [x + k, 600]), { w: 1.8, d: d + 100, t: 60 })
          ink(g, E(x + 34, 566, 10, 8), { w: 1.8, d: d + 200, t: 100 })
          hatch(g, E(x - 6, 568, 10, 8), d + 300, true)
          const bl = wobble(g, { deg: 12, ox: x + 34, oy: 576, ms: 600, d: d + 500 })
          ink(bl, [[x + 30, 576], [x + 28, 588], [x + 40, 588], [x + 38, 576]], { w: 1.4, d: d + 400, t: 80 })
        }
      },
      regeln(g) {
        // klare Grenzen (Zaun), eigene Regeln (Buch), Kontrolle (Augen), steigende Strafen (Münzen), Mitreden (Sprechblasen)
        for (let k = 0; k < 4; k++) ink(g, L([40 + k * 18, 400], [40 + k * 18, 360]), { w: 2, t: 100 })
        ink(g, L([34, 372], [100, 372]), { w: 1.4, d: 200, t: 100 })
        ink(g, [[150, 360], [190, 352], [230, 360], [230, 410], [190, 402], [150, 410], [150, 360]], { w: 2.2, d: 300, t: 300 })
        ink(g, L([190, 352], [190, 402]), { w: 1.4, d: 400, t: 100 })
        eye(g, 290, 380, 0.4, 500)
        for (let k = 0; k < 3; k++) stack(g, 70 + k * 46, 560, 1 + k * 2, 800 + k * 150, 28)
        arrow(g, L([60, 590], [180, 590]), { w: 1.6, d: 1300, t: 200, head: 6 })
        for (const [x, y, side] of [[220, 500, 'l'], [270, 540, 'r']] as const) bubble(g, x, y, 60, 36, side, 1200)
        crowd(g, 220, 640, 3, 30, 1.6, 1400, 80)
      },
      werkzeuge(g) {
        // Fangquote (Netz mit Plakette), Emissionshandel (Schornstein mit Zertifikat), Parkuhr, Wasserzähler
        ink(g, [[40, 360], [120, 360], [100, 430], [60, 430], [40, 360]], { w: 1.8, t: 300 })
        for (let k = 0; k < 4; k++) ink(g, L([46 + k * 18, 364], [62 + k * 10, 428]), { w: 0.6, d: 200, t: 100 })
        ink(g, RR(110, 400, 26, 16, 3), { w: 1.6, d: 400, t: 100 })
        ink(g, [[200, 430], [200, 380], [230, 380], [230, 350], [250, 350], [250, 430]], { w: 2, d: 500, t: 300 })
        const w = wobble(g, { dx: 8, dy: -4, ms: 2000, d: 900 })
        cloud(w, 270, 330, 0.3, 700, true)
        ink(g, [[290, 400], [330, 400], [330, 440], [290, 440], [290, 400]], { w: 1.6, d: 800, t: 150 })
        for (let k = 0; k < 2; k++) ink(g, L([296, 412 + k * 10], [324, 412 + k * 10]), { w: 0.8, d: 900, t: 60 })
        ink(g, L([90, 640], [90, 540]), { w: 2.4, d: 1000, t: 200 })
        ink(g, RR(70, 500, 40, 50, 10), { w: 2.2, d: 1100, t: 200 })
        ink(g, E(90, 522, 10), { w: 1.4, d: 1200, t: 100 })
        ink(g, [[220, 560], [260, 560], [260, 580], [300, 580]], { w: 3, d: 1100, t: 200 })
        ink(g, E(240, 540, 18), { w: 2, d: 1200, t: 150 })
        const hd = spin(g, 240, 540, 3000, 1400)
        ink(hd, L([240, 540], [240, 526]), { w: 1.4, d: 1300, t: 60 })
        const dr = glide(g, 0, 40, { ms: 900, d: 1400, loop: true })
        drop(dr, 300, 594, 0.25, 1300)
      },
      kueche(g) {
        // WG-Spüle: der Stapel schmutziges Geschirr wächst
        ink(g, RR(40, 480, 280, 30, 4), { w: 3, t: 600 })
        ink(g, [[120, 480], [130, 540], [230, 540], [240, 480]], { w: 2.4, d: 200, t: 300 })
        ink(g, [[300, 480], [300, 430], [270, 430], [270, 444]], { w: 2.4, d: 300, t: 200 })
        for (let i = 0; i < 6; i++) {
          const p = pop(g, 400 + i * 200, '50% 100%')
          ink(p, E(180 + (i % 2) * 6, 470 - i * 10, 46 - i * 3, 7), { w: 2, t: 0 })
          if (i % 2) ink(p, [[150 + i * 4, 466 - i * 10], [160 + i * 4, 456 - i * 10]], { w: 1, t: 0 })
        }
        crowd(g, 50, 640, 4, 30, 1.6, 900, 80)
        question(g, 270, 380, 0.7, 1600)
      },
      ende(g) {
        for (let i = 0; i < 3; i++) sheep(g, 100 + i * 80, 560, 1.1, i * 200)
        ink(g, L([40, 564], [320, 564]), { w: 2.6, t: 500 })
        for (let k = 0; k < 8; k++) tuft(g, 50 + k * 36, 562, 1, 600 + k * 40)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { weide: {} } },
      { t: T('Ein Dorf hat eine gemeinsame Weide, die **Allmende**. Jede Familie darf ihre Schafe darauf grasen lassen.', 64), gfx: { dorf: {} } },
      { t: T('Jedes zusätzliche Schaf bringt seinem Besitzer den **ganzen Gewinn**: Wolle, Milch, Fleisch.', 64), gfx: { gewinn: {} } },
      { t: T('Die Kosten – weniger Gras für alle – **verteilen sich** auf das ganze Dorf.', 64), gfx: { gewinn: {} } },
      { t: T('Für jeden Einzelnen lohnt es sich also, noch ein Schaf mehr zu halten. Und **noch eins**.', 64), gfx: { mehr: {} } },
      { t: T('Bis die Weide **kahl gefressen** ist. Dann verlieren alle – auch die, die vernünftig waren.', 64), gfx: { kahl: {} } },
      { t: T('Niemand war böse oder dumm. Jeder hat für sich **vernünftig** gehandelt – und gemeinsam ist das Ergebnis schlecht.', 64), gfx: { kahl: {} } },
      { t: T('Das ist die **Tragik der Allmende**. Der Biologe Garrett Hardin machte sie 1968 berühmt.', 64), gfx: { hardin: {} } },
      { t: T('Heute steckt sie überall: in **überfischten** Meeren, verstopften Straßen, in der Atmosphäre als Ablage für CO₂.', 64), gfx: { meer: {} } },
      { t: T('Vor Neufundland brachen 1992 die Kabeljau-Bestände zusammen – nach Jahrzehnten der Überfischung. Sie haben sich bis heute **kaum erholt**.', 64), gfx: { kabeljau: {} } },
      { t: T('Das Problem: Jeder Fisch, den ein Boot nicht fängt, holt sich ein **anderes** Boot. Verzicht lohnt sich allein nicht.', 64), gfx: { meer: {} } },
      { t: T('Hardin sah zwei Auswege: alles **privatisieren** – oder der Staat regelt es von oben.', 64), gfx: { dorf: {} } },
      { t: T('Die Ökonomin **Elinor Ostrom** fand einen dritten Weg – und bekam dafür 2009 als erste Frau den Wirtschafts-Nobelpreis.', 64), gfx: { ostrom: {} } },
      { t: T('Sie untersuchte Almen in der Schweiz, Bewässerung in Nepal, Fischgründe in der Türkei: Viele Gemeinschaften verwalten Gemeingüter **seit Jahrhunderten** erfolgreich.', 64), gfx: { alm: {} } },
      { t: T('Ihr Rezept: klare Grenzen, eigene Regeln, gegenseitige Kontrolle – und **Strafen**, die bei Wiederholung steigen.', 64), gfx: { regeln: {} } },
      { t: T('Entscheidend ist, dass die Nutzer **miteinander reden** und die Regeln selbst mitbestimmen.', 64), gfx: { regeln: {} } },
      { t: T('Am schwersten wird es, wenn Gemeinschaften **riesig** sind – wie die ganze Menschheit beim Klima. Dann fehlen Vertrauen und Kontrolle.', 64), gfx: { werkzeuge: {} } },
      { t: T('Fangquoten, Emissionshandel, Parkgebühren: alles Versuche, Gemeingüter mit **Regeln** zu schützen.', 64), gfx: { werkzeuge: {} } },
      { t: T('Und im Kleinen kennt es jede WG: Wer spült das Geschirr, das **allen** gehört?', 64), gfx: { kueche: {} } },
      { t: T('Was allen gehört, braucht **gemeinsame Regeln**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei Gemeingütern trägt jeder den vollen Gewinn, aber nur einen Teil der Kosten – Übernutzung droht.', 'Beispiele: Überfischung, Verkehr, CO₂ in der Atmosphäre.', 'Elinor Ostrom zeigte: Gemeinschaften können Gemeingüter mit eigenen Regeln dauerhaft schützen.'],
    sources: ['Hardin 1968, Science 162', 'Ostrom 1990: Governing the Commons', 'Myers, Hutchings & Barrowman 1997, Ecological Applications 7 (Kabeljau)'],
  },
  {
    id: 'eisverkaeufer',
    area: 'WIRT',
    day: 11,
    hook: 'Warum stehen konkurrierende Läden oft direkt nebeneinander?',
    mood: 'hell',
    ambience: 'wellen',
    images: [],
    draw: {
      laeden(g) {
        // zwei konkurrierende Läden Wand an Wand, mit Markisen und Schildern; Passanten
        ink(g, L([20, 400], [340, 400]), { w: 3, t: 500 })
        for (const [x, l, d] of [[60, 'A', 200], [180, 'B', 400]] as const) {
          ink(g, RR(x, 240, 120, 160, 2), { w: 2.6, d, t: 500 })
          ink(g, RR(x + 10, 250, 100, 26, 3), { w: 1.8, d: d + 200, t: 200 })
          text(g, x + 60, 270, l, { anchor: 'middle', size: 18, d: d + 300 })
          const aw: P[] = [[x, 290], [x + 120, 290], [x + 130, 316], [x - 10, 316], [x, 290]]
          ink(g, aw, { w: 2, d: d + 300, t: 200 })
          for (let k = 0; k < 7; k++) if (k % 2) hatch(g, [[x + k * 17, 290], [x + (k + 1) * 17, 290], [x + (k + 1) * 18.6 - 10, 316], [x + k * 18.6 - 10, 316]], d + 400)
          ink(g, RR(x + 14, 330, 40, 70, 2), { w: 1.8, d: d + 400, t: 200 })
          ink(g, RR(x + 66, 330, 44, 40, 2), { w: 1.6, d: d + 450, t: 200 })
        }
        crowd(g, 30, 400, 2, 20, 1.2, 800, 100)
        crowd(g, 310, 400, 2, 20, 1.2, 900, 100)
      },
      strand(g) {
        beach(g, 540, 0)
        sunDisk(g, 300, 360, 22, 600)
        ink(g, L([30, 620], [330, 620]), { w: 1.4, d: 1000, t: 300 })
        for (const x of [30, 330]) ink(g, L([x, 612], [x, 628]), { w: 1.6, d: 1100, t: 60 })
      },
      optimal(g) {
        // Stände bei einem und drei Vierteln: jeder bedient seine Hälfte, kurze Wege
        beach(g, 540, 0)
        stand(g, 105, 520, 'A', 600)
        stand(g, 255, 520, 'B', 700)
        dashes(g, L([180, 470], [180, 600]), { w: 1.4, d: 900 })
        for (const [a, b] of [[[34, 600], [100, 600]], [[176, 600], [110, 600]], [[184, 600], [250, 600]], [[326, 600], [260, 600]]] as const) arrow(g, L(a as P, b as P), { w: 1.4, d: 1100, t: 200, head: 5 })
      },
      ruecken(g) {
        beach(g, 540, 0)
        const a = st(g, 'm1', '--m1: translateX(42px); transition-duration: 1.8s')
        stand(a, 105, 520, 'A', 600)
        const b = st(g, 'm1', '--m1: translateX(-42px); transition-duration: 1.8s; --dl: 400ms')
        stand(b, 255, 520, 'B', 700)
        const f = st(g, 'f1', '--dl: 1600ms')
        arrow(f, L([34, 610], [170, 610]), { w: 2.2, t: 0, head: 8 })
        arrow(f, L([326, 610], [190, 610]), { w: 2.2, t: 0, head: 8 })
      },
      hotelling(g) {
        // Hotellings Modell auf Papier: eine Linie, zwei Punkte, Pfeile zur Mitte
        const pg: P[] = [[40, 360], [320, 350], [326, 600], [46, 610], [40, 360]]
        blank(g, pg)
        ink(g, pg, { w: 2.4, t: 500 })
        ink(g, L([70, 480], [296, 474]), { w: 2.6, d: 300, t: 400 })
        for (const [x, d] of [[126, 500], [240, 600]] as const) ball(g, x, 478, 8, { d, fill: 'dicht', w: 1.6, t: 100 })
        carrow(g, [126, 460], [174, 456], -20, { d: 900 })
        carrow(g, [240, 456], [192, 456], 20, { d: 1000 })
        dashes(g, L([183, 420], [183, 530]), { w: 1, d: 1200, dash: 3, gap: 3 })
        for (let k = 0; k < 3; k++) ink(g, L([80, 550 + k * 14], [280 - k * 40, 548 + k * 14]), { w: 0.8, d: 1300 + k * 60, t: 100 })
      },
      tanke(g) {
        // drei Tankstellen nebeneinander an derselben Straße: Dach, Zapfsäulen, Preistafel
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        dashes(g, L([20, 630], [340, 630]), { w: 2, d: 100, dash: 14, gap: 10 })
        for (let i = 0; i < 3; i++) {
          const x = 30 + i * 105
          ink(g, RR(x, 470, 90, 14, 2), { w: 2.4, d: 200 + i * 200, t: 300 })
          for (const k of [8, 78]) ink(g, L([x + k, 484], [x + k, 600]), { w: 2, d: 300 + i * 200, t: 200 })
          for (const k of [26, 54]) {
            ink(g, RR(x + k - 7, 560, 14, 40, 2), { w: 1.8, d: 500 + i * 200, t: 150 })
            ink(g, RR(x + k - 4, 566, 8, 8, 1), { w: 1, d: 600 + i * 200, t: 60 })
          }
          ink(g, L([x + 45, 470], [x + 45, 420]), { w: 1.8, d: 600 + i * 200, t: 150 })
          ink(g, RR(x + 30, 396, 30, 26, 2), { w: 1.8, d: 700 + i * 200, t: 150 })
          for (let k = 0; k < 2; k++) ink(g, L([x + 34, 404 + k * 8], [x + 56, 404 + k * 8]), { w: 0.8, d: 800 + i * 200, t: 60 })
        }
      },
      vergleichen(g) {
        // Kundin zwischen zwei Schaufenstern, schaut nach links und rechts
        fig(g, 180, 620, 4)
        for (const x of [60, 300]) {
          ink(g, RR(x - 50, 400, 100, 120, 4), { w: 2.4, d: 400, t: 300 })
          for (let k = 0; k < 3; k++) ink(g, RR(x - 40 + k * 28, 470, 22, 40, 3), { w: 1.4, d: 600 + k * 60, t: 100 })
        }
        for (const [a, b] of [[[160, 480], [116, 476]], [[200, 480], [244, 476]]] as const) arrow(g, L(a as P, b as P), { w: 2, d: 800, t: 200, head: 7 })
        ink(g, L([20, 622], [340, 622]), { w: 2, d: 200, t: 400 })
      },
      parteien(g) {
        // Wählerverteilung von links bis rechts; beide großen Parteien drängen zur Mitte, kleine stehen am Rand
        axes(g, 30, 600, 330, 360)
        plot(g, 36, 596, 288, 200, (t) => Math.exp(-Math.pow((t - 0.5) / 0.18, 2)), { d: 400 })
        hatch(g, [[36, 596], ...Array.from({ length: 41 }, (_, i) => [36 + (i / 40) * 288, 596 - 200 * Math.exp(-Math.pow((i / 40 - 0.5) / 0.18, 2))] as P), [324, 596]], 900)
        ball(g, 160, 360, 10, { d: 1200, fill: 'dicht', t: 200 })
        ball(g, 200, 360, 10, { d: 1300, t: 200 })
        for (const x of [60, 300]) ball(g, x, 560, 6, { d: 1500, fill: 'hell', w: 1.4, t: 100 })
        arrow(g, L([100, 360], [146, 360]), { w: 1.6, d: 1400, t: 150, head: 6 })
        arrow(g, L([260, 360], [214, 360]), { w: 1.6, d: 1400, t: 150, head: 6 })
      },
      gleich(g) {
        // drei Smartphones, fast nicht zu unterscheiden
        for (let i = 0; i < 3; i++) {
          const x = 50 + i * 95
          ink(g, RR(x, 380, 70, 140, 12), { w: 2.6, d: i * 200, t: 400 })
          ink(g, RR(x + 6, 396, 58, 108, 4), { w: 1.2, d: i * 200 + 200, t: 300 })
          ink(g, RR(x + 26, 386, 18, 4, 2), { w: 1, d: i * 200 + 300, t: 60 })
          for (let k = 0; k < 6; k++) ink(g, RR(x + 12 + (k % 3) * 16, 410 + Math.floor(k / 3) * 18, 10, 10, 2), { w: 0.8, d: i * 200 + 400 + k * 20, t: 40 })
        }
        for (let i = 0; i < 2; i++) text(g, 132 + i * 95, 460, '=', { anchor: 'middle', size: 22, d: 1200 + i * 100 })
      },
      luecke(g) {
        beach(g, 540, 0)
        stand(g, 147, 520, 'A', 300)
        stand(g, 213, 520, 'B', 400)
        const c = glide(g, -40, 0, { ms: 1400, d: 900 })
        stand(c, 100, 520, 'C', 900)
        ripple(g, 60, 560, 8, 40, { n: 2, ms: 1600, d: 1500, w: 1, ry: 0.4 })
      },
      ende(g) {
        beach(g, 540, 0)
        stand(g, 160, 520, 'A', 300)
        stand(g, 210, 520, 'B', 400)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { laeden: {} } },
      { t: T('Ein Gedankenspiel: ein Strand, genau ein Kilometer lang. Die Badegäste liegen **gleichmäßig** verteilt.', 64), gfx: { strand: {} } },
      { t: T('Zwei Eisverkäufer verkaufen dasselbe Eis zum selben Preis. Jeder Gast geht zum **nächstgelegenen** Stand.', 64), gfx: { optimal: {} } },
      { t: T('Am besten für die Gäste: Die Stände stehen bei einem und bei drei Vierteln. Niemand läuft mehr als **250 Meter**.', 64), gfx: { optimal: {} } },
      { t: T('Doch Verkäufer A denkt: Rücke ich ein Stück **zur Mitte**, gewinne ich Kunden von B – und verliere keine.', 64), gfx: { ruecken: {} } },
      { t: T('B denkt genauso. Beide rücken immer weiter – bis sie **Rücken an Rücken** in der Mitte stehen.', 64), gfx: { ruecken: { cls: 'a1' } } },
      { t: T('Jeder hat wieder die Hälfte der Kunden. Aber die Gäste am Rand laufen jetzt bis zu **500 Meter** – für niemanden besser.', 64), gfx: { ruecken: { cls: 'a1' } } },
      { t: T('Kein Verkäufer will zurück: Wer einen Schritt nach außen geht, **verliert** sofort Kunden an den anderen.', 64), gfx: { ruecken: { cls: 'a1' } } },
      { t: T('Das ist **Hotellings Gesetz**, benannt nach dem Ökonomen Harold Hotelling.', 64), gfx: { hotelling: {} } },
      { t: T('Ökonomen nennen so einen Zustand ein **Gleichgewicht**: Keiner kann sich allein verbessern – auch wenn es allen zusammen besser ginge.', 64), gfx: { ruecken: { cls: 'a1' } } },
      { t: T('Darum findest du Tankstellen, Burgerläden und Handyshops so oft **in Gruppen** – oft direkt gegenüber.', 64), gfx: { tanke: {} } },
      { t: T('In vielen Städten gibt es darum ganze Straßen voller **Möbelhäuser** oder Autohändler – Konkurrenz wohnt Tür an Tür.', 64), gfx: { tanke: {} } },
      { t: T('Für Kunden hat das auch Vorteile: Vergleichen ist leicht, und man findet alles an **einem Ort**.', 64), gfx: { vergleichen: {} } },
      { t: T('Das Prinzip gilt sogar für **Parteien**: Wer eine Wahl zwischen zwei Lagern gewinnen will, rückt zur Mitte, wo die meisten Wähler sind.', 64), gfx: { parteien: {} } },
      { t: T('Darum klingen die Programme großer Parteien oft **ähnlich** – und kleine Parteien besetzen die Ränder.', 64), gfx: { parteien: {} } },
      { t: T('Der Politologe Anthony Downs übertrug die Idee 1957 auf Wahlen – als **Medianwähler-Theorem**.', 64), gfx: { parteien: {} } },
      { t: T('Auch Produkte gleichen sich: Viele Smartphones, Autos und Popsongs zielen auf denselben **Massengeschmack**.', 64), gfx: { gleich: {} } },
      { t: T('Der Effekt schwächt sich ab, wenn Anbieter auch über den **Preis** konkurrieren – Abstand schützt dann vor Preiskämpfen.', 64), gfx: { optimal: {} } },
      { t: T('Und mit mehr als zwei Anbietern lohnt es sich, eine **Lücke** am Rand zu besetzen.', 64), gfx: { luecke: {} } },
      { t: T('Konkurrenz zieht sich an – **zur Mitte**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Zwei Anbieter mit gleichem Preis rücken Schritt für Schritt zur Mitte (Hotelling).', 'Für die Kunden ist das oft schlechter als verteilte Standorte.', 'Dasselbe Muster zeigt sich bei Läden, Produkten und Parteiprogrammen.'],
    sources: ['Hotelling 1929, Economic Journal 39', 'Downs 1957: An Economic Theory of Democracy', 'd’Aspremont, Gabszewicz & Thisse 1979, Econometrica 47'],
  },
  {
    id: 'komparativer-vorteil',
    area: 'WIRT',
    day: 67,
    hook: 'Lohnt sich Handel sogar, wenn einer alles besser kann?',
    mood: 'hell',
    ambience: 'wellen',
    images: [],
    draw: {
      tausch(g) {
        fig(g, 70, 400, 3.4)
        fig(g, 290, 400, 3.4, { d: 200 })
        ink(g, RR(130, 230, 40, 40, 4), { w: 2.6, d: 500, t: 300 })
        ink(g, E(210, 250, 20), { w: 2.6, d: 600, t: 300 })
        carrow(g, [150, 290], [210, 290], 30, { d: 900 })
        carrow(g, [210, 210], [150, 210], 30, { d: 1100 })
      },
      chirurgin(g) {
        fig(g, 90, 600, 4)
        fig(g, 270, 600, 3.4, { d: 200 })
        text(g, 90, 640, 'Chirurgin', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 270, 640, 'Assistent', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 90, 420, 'operiert besser', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 90, 440, 'tippt schneller', { anchor: 'middle', cls: 's', d: 900 })
      },
      stunde(g) {
        clock(g, 180, 430, 60, 0, 0)
        box(g, 30, 530, 130, 60, 'Bericht tippen', { size: 15, d: 500 })
        text(g, 180, 566, 'oder', { anchor: 'middle', cls: 's', d: 700 })
        box(g, 200, 530, 130, 60, 'operieren', { size: 15, fill: true, d: 800 })
      },
      verteilung(g) {
        box(g, 30, 380, 140, 90, ['Chirurgin:', 'operiert'], { size: 16, fill: true })
        box(g, 190, 380, 140, 90, ['Assistent:', 'tippt'], { size: 16, d: 300 })
        text(g, 180, 540, 'zusammen schaffen beide mehr', { anchor: 'middle', d: 900 })
      },
      ricardo(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: '1817', sub: 'David Ricardo', up: true }])
      },
      tabelle(g) {
        const cell = (x: number, y: number, t: string, d: number, fill = false) => box(g, x, y, 100, 56, t, { size: 15, d, fill })
        text(g, 155, 330, 'Tuch', { anchor: 'middle', cls: 's', d: 100 })
        text(g, 265, 330, 'Wein', { anchor: 'middle', cls: 's', d: 200 })
        text(g, 52, 384, 'England', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 52, 454, 'Portugal', { anchor: 'middle', cls: 's', d: 400 })
        cell(105, 350, '100 h', 500, true)
        cell(215, 350, '120 h', 600)
        cell(105, 420, '90 h', 700)
        cell(215, 420, '80 h', 800, true)
        text(g, 180, 540, 'Arbeitsstunden pro Einheit', { anchor: 'middle', cls: 's', d: 1000 })
      },
      handel(g) {
        earthMini(g, 90, 470, 'England')
        earthMini(g, 270, 470, 'Portugal')
        carrow(g, [130, 430], [230, 430], 30, { d: 800 })
        carrow(g, [230, 510], [130, 510], 30, { d: 1000 })
        text(g, 180, 396, 'Tuch', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 556, 'Wein', { anchor: 'middle', cls: 's', d: 1100 })
      },
      verlierer(g) {
        ink(g, [[60, 560], [60, 420], [80, 420], [80, 480], [120, 450], [120, 480], [160, 450], [160, 480], [200, 450], [200, 560], [60, 560]], { w: 2.8, t: 700 })
        for (const x of [100, 140, 180]) ink(g, RR(x - 10, 510, 20, 24, 3), { w: 1.8, d: 500, t: 200 })
        fig(g, 270, 560, 2.6, { d: 700, arms: 'cross' })
        text(g, 180, 620, 'manche Branchen schrumpfen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      zitat(g) {
        text(g, 180, 440, '„wahr und nicht trivial“', { anchor: 'middle', cls: 'it', size: 24, d: 200 })
        text(g, 180, 490, 'Paul Samuelson', { anchor: 'middle', cls: 's', d: 700 })
      },
      wg(g) {
        house(g, 120, 600, 120, 0)
        text(g, 180, 380, 'jeder macht, was ihn am wenigsten kostet', { anchor: 'middle', cls: 's', d: 800 })
      },
      ende(g) {
        fig(g, 110, 600, 3.4)
        fig(g, 250, 600, 3.4, { d: 200 })
        carrow(g, [140, 500], [220, 500], 26, { d: 600 })
        carrow(g, [220, 450], [140, 450], 26, { d: 800 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { tausch: {} } },
      { t: T('Stell dir eine Chirurgin und ihren Assistenten vor. Sie operiert besser – und tippt ihre Berichte sogar **schneller** als er.', 64), gfx: { chirurgin: {} } },
      { t: T('Soll sie ihre Berichte also selbst tippen? **Nein**.', 64), gfx: { chirurgin: {} } },
      { t: T('In der Stunde, in der sie tippt, könnte sie operieren. Das ist viel **wertvoller**. Das Tippen kostet sie eigentlich eine Operation.', 64), gfx: { stunde: {} } },
      { t: T('Diese Kosten nennt man **Opportunitätskosten**: das, was du aufgibst, wenn du etwas anderes tust.', 64), gfx: { stunde: {} } },
      { t: T('Der Assistent tippt langsamer – aber er gibt dabei **wenig** auf, er kann ja nicht operieren.', 64), gfx: { verteilung: {} } },
      { t: T('Teilen sie die Arbeit danach auf, was jeden **am wenigsten kostet**, schaffen beide zusammen mehr.', 64), gfx: { verteilung: {} } },
      { t: T('Das ist der **komparative Vorteil**. Der Ökonom David Ricardo beschrieb ihn 1817.', 64), gfx: { ricardo: {} } },
      { t: T('Sein Beispiel: England und Portugal, Tuch und Wein. Portugal konnte **beides** mit weniger Arbeit herstellen.', 64), gfx: { tabelle: {} } },
      { t: T('Trotzdem lohnte sich Handel: Portugal macht Wein, England Tuch – und beide tauschen. So gibt es **mehr von beidem**.', 64), gfx: { handel: {} } },
      { t: T('Entscheidend ist nicht, wer etwas am besten kann, sondern wer dabei **am wenigsten aufgibt**.', 64), gfx: { tabelle: {} } },
      { t: T('Darum handeln Länder auch mit Partnern, die in fast allem effizienter sind – und **profitieren** trotzdem.', 64), gfx: { handel: {} } },
      { t: T('Wichtig: Komparative Vorteile sind nicht für immer. Länder **lernen** – Südkorea machte einst Perücken, heute Chips und Schiffe.', 64), gfx: { tabelle: {} } },
      { t: T('Der Haken: Es gibt Gewinner und Verlierer **innerhalb** eines Landes. Wer in einer schrumpfenden Branche arbeitet, kann seinen Job verlieren.', 64), gfx: { verlierer: {} } },
      { t: T('Viele Ökonomen fordern darum, einen Teil der Handelsgewinne für **Weiterbildung** und soziale Absicherung zu nutzen.', 64), gfx: { verlierer: {} } },
      { t: T('Auch Firmen nutzen das Prinzip: Ein Land baut Chips, ein anderes montiert, ein drittes entwirft – jeder dort, wo er **am wenigsten aufgibt**.', 64), gfx: { handel: {} } },
      { t: T('Im Alltag gilt es auch: In einer WG übernimmt nicht die Beste alles – sondern jeder das, was ihn **am wenigsten kostet**.', 64), gfx: { wg: {} } },
      { t: T('Der Ökonom Paul Samuelson nannte den komparativen Vorteil eine der wenigen Ideen seines Fachs, die **wahr und nicht trivial** sind.', 64), gfx: { zitat: {} } },
      { t: T('Handel lohnt sich, weil jeder **etwas am günstigsten** kann.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Es zählt, wer beim Herstellen am wenigsten anderes aufgibt (Opportunitätskosten).', 'Darum lohnt Handel sogar mit einem Partner, der alles besser kann (Ricardo 1817).', 'Gesamtgewinn ja – aber innerhalb eines Landes gibt es auch Verlierer.'],
    sources: ['Ricardo 1817: On the Principles of Political Economy and Taxation, Kap. 7', 'Samuelson 1969 (zitiert in Krugman & Obstfeld: Internationale Wirtschaft)', 'Autor, Dorn & Hanson 2013, American Economic Review 103'],
  },
  {
    id: 'jevons',
    area: 'WIRT',
    day: 42,
    hook: 'Kann Sparsamkeit den Verbrauch steigern?',
    mood: 'raetsel',
    ambience: 'feuer',
    images: [],
    draw: {
      dampf(g) {
        ink(g, RR(80, 260, 160, 100, 10), { w: 3, t: 700 })
        ink(g, RR(240, 280, 50, 60, 4), { w: 2.6, d: 300, t: 400 })
        ink(g, RR(110, 200, 30, 60, 3), { w: 2.6, d: 400, t: 300 })
        for (const x of [116, 130]) ink(g, B([x, 196], [x - 8, 180], [x + 8, 160], [x, 140]), { w: 2, d: 900, t: 300 })
        for (const x of [120, 200]) ball(g, x, 386, 22, { d: 600, t: 300 })
        flame(g, 160, 350, 0.4, 1000)
      },
      jevons(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1865', sub: '„The Coal Question“', up: true }])
      },
      sparsam(g) {
        vbars(g, [
          { label: 'alte Maschine', v: 4, fmt: () => 'viel Kohle' },
          { label: 'Watts Maschine', v: 1.3, fmt: () => 'viel weniger', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
      },
      verbrauch(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Jahre', yl: 'Kohle in England' })
        plot(g, 46, 596, 270, 240, (t) => Math.pow(t, 1.6), { d: 400 })
        text(g, 230, 560, 'stieg trotzdem', { anchor: 'middle', cls: 's', d: 1400 })
      },
      fabriken(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        for (let i = 0; i < 4; i++) {
          const x = 30 + i * 80
          ink(g, [[x, 600], [x, 460], [x + 12, 460], [x + 12, 512], [x + 24, 500], [x + 24, 520], [x + 42, 500], [x + 42, 520], [x + 60, 500], [x + 60, 600]], { w: 2.4, d: 200 + i * 200, t: 400 })
          ink(g, B([x + 6, 452], [x - 2, 440], [x + 14, 428], [x + 6, 414]), { w: 1.8, d: 600 + i * 200, t: 300 })
        }
        text(g, 180, 385, 'billige Dampfkraft: überall', { anchor: 'middle', cls: 's', d: 1200 })
      },
      led(g) {
        bulb(g, 90, 470, 1.2)
        text(g, 90, 560, 'sparsam', { anchor: 'middle', cls: 's', d: 700 })
        house(g, 200, 600, 110, 400)
        for (const [x, y] of [[214, 520], [286, 520], [250, 470]] as const) rays(g, x, y, 6, 14, 8, 1000)
        text(g, 255, 640, 'mehr beleuchtet', { anchor: 'middle', cls: 's', d: 1200 })
      },
      auto(g) {
        const car = (x: number, s: number, d: number) => {
          const P = (a: number, b: number): P => [x + a * s, 560 + b * s]
          ink(g, [P(-40, -8), P(-40, -24), P(-20, -26), P(-10, -42), P(18, -42), P(30, -26), P(42, -24), P(42, -8), P(-40, -8)], { w: 2.4, d, t: 500 })
          for (const k of [-22, 24]) ball(g, x + k * s, 556, 7 * s, { d: d + 200, t: 200, w: 2 })
        }
        car(90, 1, 0)
        arrow(g, L([150, 530], [190, 530]), { w: 2.4, d: 500, t: 300, head: 9 })
        car(260, 1.6, 700)
        text(g, 180, 620, 'sparsamer – aber größer und mehr gefahren', { anchor: 'middle', cls: 's', d: 1100 })
      },
      computer(g) {
        ink(g, RR(80, 380, 200, 130, 10), { w: 3, t: 600 })
        ink(g, RR(96, 396, 168, 98, 6), { w: 2, d: 300, t: 500 })
        ink(g, L([150, 510], [130, 560]), { w: 2.6, d: 400, t: 200 })
        ink(g, L([210, 510], [230, 560]), { w: 2.6, d: 400, t: 200 })
        for (let i = 0; i < 5; i++) ink(g, L([110, 410 + i * 16], [110 + 40 + i * 24, 410 + i * 16]), { w: 1.4, d: 700 + i * 80, t: 200 })
        text(g, 180, 610, 'schnellere Chips, schwerere Software', { anchor: 'middle', cls: 's', d: 1100 })
      },
      anteil(g) {
        vbars(g, [
          { label: 'gespart', v: 100, fmt: () => '100' },
          { label: 'durch Mehrnutzung weg', v: 30, fmt: () => 'oft ein Teil', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 120, h: 240 })
      },
      preis(g) {
        box(g, 40, 380, 280, 80, 'Effizienz + CO₂-Preis', { size: 20, fill: true })
        text(g, 180, 540, 'Sparsamkeit plus Grenzen', { anchor: 'middle', d: 800 })
      },
      pendeln(g) {
        house(g, 40, 600, 60, 0)
        ink(g, RR(260, 500, 70, 100, 4), { w: 2.6, d: 200, t: 400 })
        ink(g, L([110, 600], [250, 600]), { w: 2.4, d: 400, t: 600 })
        clock(g, 180, 440, 40, 0, 0, 700)
        text(g, 180, 520, '≈ 1 Stunde', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 650, 'schneller unterwegs → weiter weg wohnen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        flame(g, 180, 600, 1.4)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { dampf: {} } },
      { t: T('England, 1865: Der Ökonom William Stanley Jevons bemerkte etwas Seltsames an der wichtigsten Maschine seiner Zeit.', 64), gfx: { jevons: {} } },
      { t: T('Dampfmaschinen wurden immer **sparsamer**. James Watts Bauart brauchte viel weniger Kohle als ältere Modelle.', 64), gfx: { sparsam: {} } },
      { t: T('Man hätte erwartet, dass Englands Kohleverbrauch **sinkt**. Doch er stieg – und zwar stark.', 64), gfx: { verbrauch: {} } },
      { t: T('Der Grund: Weil Dampfkraft billiger wurde, lohnte sie sich plötzlich für **viel mehr** Fabriken, Bergwerke und Eisenbahnen.', 64), gfx: { fabriken: {} } },
      { t: T('Das ist das **Jevons-Paradoxon**: Mehr Effizienz kann den Gesamtverbrauch sogar erhöhen.', 64), gfx: { verbrauch: {} } },
      { t: T('Heute spricht man meist vom **Rebound-Effekt**: Ein Teil der Einsparung wird durch Mehrnutzung wieder aufgezehrt.', 64), gfx: { anteil: {} } },
      { t: T('LED-Lampen brauchen viel weniger Strom. Also wird mehr beleuchtet: Fassaden, Gärten, **Werbetafeln**.', 64), gfx: { led: {} } },
      { t: T('Sparsamere Motoren? Man fährt **mehr** – und kauft größere Autos.', 64), gfx: { auto: {} } },
      { t: T('Schnellere Computer? Die Software wird **aufwendiger** und frisst die Leistung wieder.', 64), gfx: { computer: {} } },
      { t: T('Selbst Licht wurde so billiger: Eine Stunde Lampenlicht kostet heute nur einen winzigen Bruchteil von 1800 – und wir nutzen **zigtausendmal** mehr davon.', 64), gfx: { led: {} } },
      { t: T('Meist verpufft nicht die ganze Einsparung, sondern **ein Teil** – je nach Bereich wenig oder viel.', 64), gfx: { anteil: {} } },
      { t: T('Effizienz bleibt trotzdem gut: Sie macht Dinge **billiger** und Menschen wohlhabender.', 64), gfx: { sparsam: {} } },
      { t: T('Beim Heizen ist der Effekt dagegen oft **klein**: Nach der Dämmung heizen Menschen nur etwas wärmer als vorher.', 64), gfx: { anteil: {} } },
      { t: T('Wer den Verbrauch wirklich senken will, braucht darum oft zusätzlich **Preise oder Grenzen** – etwa einen CO₂-Preis.', 64), gfx: { preis: {} } },
      { t: T('Jevons fürchtete übrigens, England gehe bald die **Kohle** aus. Stattdessen kamen Öl und Gas – und der Verbrauch stieg weiter.', 64), gfx: { dampf: { tf: [1, 0, 220] } } },
      { t: T('Auch Zeit kennt den Effekt: Schnellere Verkehrsmittel sparen kaum Pendelzeit – Menschen **wohnen einfach weiter weg**.', 64), gfx: { pendeln: {} } },
      { t: T('Über Jahrhunderte pendeln Menschen erstaunlich konstant rund **eine Stunde** am Tag – zu Fuß wie mit der Bahn.', 64), gfx: { pendeln: {} } },
      { t: T('Sparsamkeit macht etwas billiger – und das Billige wird **mehr genutzt**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Effizientere Dampfmaschinen ließen Englands Kohleverbrauch steigen (Jevons 1865).', 'Rebound-Effekt: Ersparnis wird teils durch Mehrnutzung aufgezehrt – bei LED, Autos, Computern.', 'Um den Verbrauch zu senken, braucht Effizienz oft Preise oder Grenzen dazu.'],
    sources: ['Jevons 1865: The Coal Question', 'Sorrell 2009, Energy Policy 37 (Rebound)', 'Marchetti 1994, Technological Forecasting and Social Change 47'],
  },
  {
    id: 'diamant-wasser',
    area: 'WIRT',
    day: 11,
    hook: 'Warum ist Wasser billig und ein Diamant teuer – obwohl Wasser lebenswichtig ist?',
    mood: 'raetsel',
    ambience: 'wellen',
    images: [],
    draw: {
      beide(g) {
        diamond(g, 250, 230, 1.4)
        drop(g, 100, 230, 2.2, 500)
      },
      smith(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: '1776', sub: 'Adam Smith', up: true }])
      },
      liter(g) {
        vbars(g, [
          { label: '1. Liter', v: 100, fmt: () => 'Leben' },
          { label: '10. Liter', v: 40, fmt: () => 'Durst' },
          { label: '100. Liter', v: 4, fmt: () => 'Bad', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'Nutzen des nächsten Liters', { anchor: 'middle', cls: 's', d: 1300 })
      },
      reichlich(g) {
        for (let i = 0; i < 9; i++) drop(g, 50 + (i % 5) * 64, 420 + Math.floor(i / 5) * 90, 0.9, i * 80, false)
        text(g, 180, 640, 'reichlich da: der nächste Liter ist billig', { anchor: 'middle', cls: 's', d: 1000 })
      },
      knapp(g) {
        diamond(g, 180, 470, 1.4)
        text(g, 180, 600, 'knapp: jeder einzelne zählt', { anchor: 'middle', cls: 's', d: 900 })
      },
      wueste(g) {
        sun(g, 280, 350, 30)
        ink(g, B([20, 600], [100, 560], [200, 590], [340, 560]), { w: 3, t: 700 })
        fig(g, 110, 580, 2.6, { d: 400 })
        drop(g, 200, 480, 1, 900)
        text(g, 180, 650, 'in der Wüste: Wasser vor Diamant', { anchor: 'middle', cls: 's', d: 1200 })
      },
      drei(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: 'Jevons', up: true },
          { at: 0.45, label: '1871', sub: 'Menger', big: true },
          { at: 0.8, label: 'Walras', up: true },
        ])
      },
      pizza(g) {
        for (let i = 0; i < 6; i++) {
          const a0 = i * 60
          const p: P[] = [[180, 470], ...E(180, 470, 100, 100, a0 + 2, a0 + 58), [180, 470]]
          if (i < 5) hatch(g, p, 400 + i * 80)
          ink(g, p, { w: 2.2, d: i * 80, t: 300 })
        }
        text(g, 180, 620, 'das erste Stück: großartig – das sechste: na ja', { anchor: 'middle', cls: 's', d: 1000 })
      },
      rabatt(g) {
        for (let i = 0; i < 4; i++) ink(g, RR(50 + i * 70, 420, 50, 70, 6), { w: 2.4, d: i * 150, t: 300 })
        text(g, 180, 560, 'Mengenrabatt', { anchor: 'middle', size: 20, d: 900 })
      },
      debeers(g) {
        diamond(g, 120, 470, 1)
        ink(g, RR(210, 400, 100, 130, 8), { w: 2.8, d: 300, t: 500 })
        text(g, 260, 470, 'Lager', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 180, 600, 'Angebot künstlich knapp gehalten', { anchor: 'middle', cls: 's', d: 1000 })
      },
      werbung(g) {
        ink(g, E(180, 480, 60), { w: 3.6, t: 700 })
        diamond(g, 180, 400, 0.5, 600)
        text(g, 180, 600, '1947: „A Diamond Is Forever“', { anchor: 'middle', cls: 'it', size: 18, d: 1000 })
      },
      labor(g) {
        diamond(g, 100, 470, 0.9)
        text(g, 180, 476, '=', { anchor: 'middle', size: 30, d: 500 })
        diamond(g, 260, 470, 0.9, 600)
        text(g, 100, 570, 'Mine', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 260, 570, 'Labor: viel billiger', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        drop(g, 120, 490, 1.6)
        diamond(g, 250, 490, 0.9, 400)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { beide: {} } },
      { t: T('Schon Adam Smith wunderte sich 1776: Wasser ist **unverzichtbar**, aber fast nichts wert. Ein Diamant ist nutzlos – und kostet ein Vermögen.', 64), gfx: { smith: {} } },
      { t: T('Die Lösung kam erst rund hundert Jahre später – mit dem **Grenznutzen**.', 64), gfx: { liter: {} } },
      { t: T('Entscheidend ist nicht der Nutzen von Wasser **überhaupt**, sondern der Nutzen des **nächsten** Liters.', 64), gfx: { liter: {} } },
      { t: T('Der erste Liter rettet dein Leben. Der zehnte löscht Durst. Der hundertste füllt die **Badewanne**.', 64), gfx: { liter: {} } },
      { t: T('Weil Wasser meist reichlich da ist, ist der nächste Liter **wenig wert** – und so ist sein Preis niedrig.', 64), gfx: { reichlich: {} } },
      { t: T('Diamanten sind dagegen **knapp**. Schon ein einziger ist etwas Besonderes – sein Grenznutzen ist hoch.', 64), gfx: { knapp: {} } },
      { t: T('Preise spiegeln also **Knappheit**, nicht Wichtigkeit.', 64), gfx: { f1: { draw: 'formel', args: [['Preis', '≈', 'Nutzen der nächsten Einheit'], 360] } } },
      { t: T('Und das hängt von der Lage ab: Allein in der Wüste gäbst du jeden Diamanten für **einen Liter** Wasser.', 64), gfx: { wueste: {} } },
      { t: T('Die Idee kam 1871 fast gleichzeitig von drei Ökonomen: William Stanley Jevons, Carl Menger und Léon Walras – die **Grenznutzen-Revolution**.', 64), gfx: { drei: {} } },
      { t: T('Sie erklärt viel Alltag: Das erste Stück Pizza schmeckt herrlich, das sechste **kaum noch**.', 64), gfx: { pizza: {} } },
      { t: T('Darum gibt es **Mengenrabatte**: Die zehnte Packung ist dir weniger wert als die erste – also muss sie billiger sein.', 64), gfx: { rabatt: {} } },
      { t: T('Auch Löhne folgen der Knappheit: Pflegekräfte sind unverzichtbar, aber viele können den Job lernen. **Seltenes** Können wird oft besser bezahlt.', 64), gfx: { knapp: {} } },
      { t: T('Bei Diamanten kommt Kunst dazu: Jahrzehntelang hielt ein einziger Konzern, **De Beers**, das Angebot knapp und den Preis hoch.', 64), gfx: { debeers: {} } },
      { t: T('Ein Werbespruch von 1947 – „Ein Diamant ist unvergänglich“ – machte ihn zum **Pflicht-Verlobungsring**.', 64), gfx: { werbung: {} } },
      { t: T('Heute gibt es Diamanten aus dem Labor: chemisch identisch – und **viel billiger**. Ihre Preise fallen stark.', 64), gfx: { labor: {} } },
      { t: T('Nüchtern betrachtet: Ein Diamant ist **Kohlenstoff** – wie Graphit in deinem Bleistift, nur anders angeordnet.', 64), gfx: { labor: {} } },
      { t: T('Knappheit ist nicht für immer: Wo Wasser knapp wird, steigt auch sein Preis – in Dürren teils **drastisch**.', 64), gfx: { wueste: {} } },
      { t: T('Der Preis misst den **nächsten** Liter, nicht alle.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Preise richten sich nach dem Nutzen der nächsten Einheit (Grenznutzen), nicht nach der Wichtigkeit.', 'Wasser ist meist reichlich – der nächste Liter ist billig; Diamanten sind knapp.', 'Diamantpreise wurden zusätzlich künstlich hochgehalten; Labordiamanten senken sie.'],
    sources: ['Smith 1776: Wealth of Nations, Buch I, Kap. 4', 'Menger 1871: Grundsätze der Volkswirtschaftslehre', 'Epstein 1982, The Atlantic (Diamanten und De Beers)'],
  },
]
