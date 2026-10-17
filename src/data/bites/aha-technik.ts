import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, bolt, check, cross, dashes, fig, hatch, hbars, ink, letter, question, rays, st, text, timeline, type P } from './draw'
import { arcArrow, ball, box, bullets, carrow, dot, drop, thermo, water, waveP } from './kit'

// Technik: Alltagsgeräte und wie sie wirklich funktionieren, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Smartphone, oben links (x, y) */
function phone(g: Element, x: number, y: number, w: number, h: number, d = 0): void {
  blank(g, RR(x, y, w, h, w * 0.14))
  ink(g, RR(x, y, w, h, w * 0.14), { w: 3, d, t: 700 })
  ink(g, RR(x + w * 0.38, y + 8, w * 0.24, 6, 3), { w: 1.6, d: d + 300, t: 200 })
}

/** Zeigefinger von unten, Spitze bei (x, y) */
function finger(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const p: P[] = [P(-16, 130), ...B(P(-16, 130), P(-16, 60), P(-16, 20), P(-14, 10)).slice(1), ...B(P(-14, 10), P(-10, -4), P(10, -4), P(14, 10)).slice(1), ...B(P(14, 10), P(16, 20), P(16, 60), P(16, 130)).slice(1)]
  blank(g, p)
  ink(g, p, { w: 2.6, d, t: 600 })
  ink(g, B(P(-8, 14), P(-6, 4), P(6, 4), P(8, 14)), { w: 1.4, d: d + 400, t: 200 })
}

/** Gitter aus Zeilen und Spalten (leitende Bahnen) */
function wires(g: Element, x: number, y: number, w: number, h: number, n: number, d = 0): void {
  for (let i = 1; i < n; i++) ink(g, L([x + (w * i) / n, y + 4], [x + (w * i) / n, y + h - 4]), { w: 1.2, d: d + i * 40, t: 300 })
  for (let i = 1; i < n; i++) dashes(g, L([x + 4, y + (h * i) / n], [x + w - 4, y + (h * i) / n]), { w: 1.2, d: d + 200 + i * 40 })
}

/** Netz-Knoten (Router) */
function node(g: Element, x: number, y: number, d = 0, label = ''): void {
  ball(g, x, y, 14, { d, fill: 'hell', t: 300 })
  if (label) text(g, x, y + 34, label, { anchor: 'middle', cls: 's', d: d + 200 })
}

/** Farbtopf mit Beschriftung, Boden bei y */
function pot(g: Element, cx: number, y: number, label: string, d = 0, dense = false): void {
  const p: P[] = [[cx - 30, y - 56], [cx - 26, y], [cx + 26, y], [cx + 30, y - 56]]
  blank(g, [...p, [cx - 30, y - 56]])
  hatch(g, [[cx - 28, y - 40], [cx - 26, y], [cx + 26, y], [cx + 28, y - 40], [cx - 28, y - 40]], d + 300, dense)
  ink(g, p, { w: 2.6, d, t: 400 })
  ink(g, E(cx, y - 56, 30, 7), { w: 2.2, d: d + 200, t: 300 })
  text(g, cx, y + 24, label, { anchor: 'middle', cls: 's', d: d + 400 })
}

/** Hand mit fünf Fingern; up[i] = Finger gestreckt (Daumen zuerst) */
function hand(g: Element, x: number, y: number, up: boolean[], d = 0, labels: string[] = []): void {
  ink(g, RR(x, y, 120, 70, 18), { w: 2.6, d, t: 500 })
  up.forEach((u, i) => {
    const fx = i === 0 ? x - 30 : x + 4 + (i - 1) * 29
    const fy = i === 0 ? y + 10 : y
    const h = u ? (i === 0 ? 50 : 70) : 18
    const p = i === 0 ? RR(fx, fy, 26, 40, 12) : RR(fx, fy - h, 24, h + 6, 11)
    blank(g, p)
    if (u) hatch(g, p, d + 300 + i * 80)
    ink(g, p, { w: 2.4, d: d + 100 + i * 80, t: 300 })
    if (labels[i]) text(g, i === 0 ? fx + 13 : fx + 12, i === 0 ? fy + 64 : y + 96, labels[i], { anchor: 'middle', cls: 's', d: d + 500 + i * 80 })
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
        phone(g, 110, 80, 140, 280)
        finger(g, 210, 230, 1, 600)
      },
      gitter(g) {
        phone(g, 90, 300, 180, 340)
        wires(g, 104, 330, 152, 290, 7, 400)
        text(g, 180, 670, 'unsichtbare Bahnen im Glas', { anchor: 'middle', cls: 's', d: 1000 })
      },
      feld(g) {
        ink(g, L([30, 560], [330, 560]), { w: 2.6, t: 500 })
        for (const x of [100, 260]) ink(g, RR(x - 30, 560, 60, 12, 3), { w: 2.2, d: 200, t: 300 })
        for (const r of [40, 80]) ink(g, E(180, 566, r + 40, r * 0.8, 180, 360), { w: 1.4, d: 600 + r * 5, t: 500 })
        text(g, 180, 620, 'schwaches elektrisches Feld', { anchor: 'middle', cls: 's', d: 1000 })
      },
      beruehren(g) {
        ink(g, L([30, 560], [330, 560]), { w: 2.6, t: 500 })
        for (const x of [100, 260]) ink(g, RR(x - 30, 560, 60, 12, 3), { w: 2.2, d: 200, t: 300 })
        finger(g, 180, 430, 1, 500)
        for (const k of [-1, 1]) carrow(g, [180 + k * 70, 552], [180 + k * 24, 470], k * -16, { d: 1000, head: 8 })
        text(g, 180, 620, 'der Finger zieht Ladung ab', { anchor: 'middle', cls: 's', d: 1200 })
      },
      punkt(g) {
        phone(g, 90, 300, 180, 340)
        wires(g, 104, 330, 152, 290, 7, 200)
        for (const r of [10, 22, 34]) ink(g, E(191, 454, r), { w: 1.8, d: 800 + r * 10, t: 300 })
        dot(g, 191, 454, 5, 1300)
      },
      tempo(g) {
        text(g, 180, 450, '120-mal', { anchor: 'middle', size: 52, d: 200 })
        text(g, 180, 495, 'pro Sekunde und öfter wird das Gitter abgefragt', { anchor: 'middle', cls: 's', d: 600 })
      },
      multi(g) {
        phone(g, 90, 300, 180, 340)
        for (const [x, y] of [[150, 420], [230, 520]] as const) {
          ink(g, E(x, y, 22), { w: 2, d: 600, t: 300 })
          dot(g, x, y, 5, 900)
        }
        carrow(g, [130, 400], [110, 370], 0, { d: 1100, head: 8 })
        carrow(g, [250, 540], [262, 580], 0, { d: 1100, head: 8 })
      },
      handschuh(g) {
        const p: P[] = [...B([100, 640], [90, 560], [90, 480], [110, 440]), ...B([110, 440], [140, 400], [220, 400], [250, 440]).slice(1), ...B([250, 440], [270, 480], [270, 560], [260, 640]).slice(1)]
        blank(g, p)
        hatch(g, p, 400, true)
        ink(g, p, { w: 3, t: 700 })
        cross(g, 180, 360, 0.8, 900)
        text(g, 180, 670, 'Wolle isoliert', { anchor: 'middle', cls: 's', d: 1100 })
      },
      wurst(g) {
        ink(g, [...B([90, 470], [90, 430], [270, 430], [270, 470]), ...B([270, 470], [270, 510], [90, 510], [90, 470]).slice(1)], { w: 3, t: 700 })
        check(g, 180, 400, 0.8, 800)
        text(g, 180, 570, 'leitet – funktioniert', { anchor: 'middle', cls: 's', d: 1000 })
      },
      resistiv(g) {
        ink(g, L([40, 470], [320, 470]), { w: 2.6, t: 500 })
        ink(g, B([40, 520], [140, 520], [170, 474], [180, 474]), { w: 2.6, d: 300, t: 400 })
        ink(g, B([180, 474], [190, 474], [220, 520], [320, 520]), { w: 2.6, d: 400, t: 400 })
        arrow(g, L([180, 390], [180, 452]), { w: 2.6, d: 700, t: 300, head: 10 })
        text(g, 180, 380, 'Druck', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 580, 'früher: zwei Folien berühren sich', { anchor: 'middle', cls: 's', d: 1100 })
      },
      geschichte(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: '1965', sub: 'E. A. Johnson', up: true },
          { at: 0.8, label: '2007', sub: 'Multitouch für alle', big: true },
        ])
      },
      wasser(g) {
        phone(g, 90, 300, 180, 340)
        for (const [x, y] of [[150, 400], [210, 470], [160, 540]] as const) {
          blank(g, E(x, y, 14, 10))
          ink(g, E(x, y, 14, 10), { w: 2, d: 600, t: 200 })
        }
        question(g, 300, 400, 0.6, 1000)
      },
      ende(g) {
        phone(g, 120, 380, 120, 240)
        dot(g, 180, 500, 6, 700)
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
        const n: P[] = [[50, 260], [130, 140], [180, 300], [250, 180], [310, 300]]
        for (const [a, b] of [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4]] as const) ink(g, L(n[a], n[b]), { w: 2, d: 200, t: 400 })
        n.forEach(([x, y], i) => node(g, x, y, 500 + i * 80))
      },
      zerlegen(g) {
        ink(g, RR(40, 380, 120, 120, 6), { w: 2.8, t: 500 })
        ink(g, [[60, 480], [90, 430], [110, 460], [125, 440], [145, 480]], { w: 2, d: 300, t: 400 })
        arrow(g, L([172, 440], [206, 440]), { w: 2.4, d: 700, t: 300, head: 9 })
        for (let i = 0; i < 9; i++) ink(g, RR(220 + (i % 3) * 38, 384 + Math.floor(i / 3) * 38, 30, 30, 4), { w: 2, d: 900 + i * 70, t: 200 })
        text(g, 180, 580, 'Tausende kleine Pakete', { anchor: 'middle', cls: 's', d: 1400 })
      },
      paket(g) {
        box(g, 60, 380, 240, 150, '', { size: 14 })
        text(g, 80, 414, 'von: 84.12.…', { size: 16, d: 400 })
        text(g, 80, 444, 'an: 142.250.…', { size: 16, d: 500 })
        text(g, 80, 474, 'Nr. 731 von 2.000', { size: 16, d: 600 })
        dashes(g, L([76, 490], [284, 490]), { w: 1.2, d: 700 })
        text(g, 80, 516, 'ein Stück Foto', { cls: 's', d: 800 })
      },
      wege(g) {
        const n: P[] = [[40, 480], [130, 360], [130, 600], [230, 360], [230, 600], [320, 480]]
        for (const [a, b] of [[0, 1], [0, 2], [1, 3], [2, 4], [1, 4], [3, 5], [4, 5]] as const) ink(g, L(n[a], n[b]), { w: 2, d: 200, t: 400 })
        n.forEach(([x, y], i) => node(g, x, y, 400 + i * 60))
        for (const [x, y, d] of [[85, 420, 900], [180, 600, 1000], [180, 480, 1100]] as const) {
          blank(g, RR(x - 10, y - 10, 20, 20, 3))
          hatch(g, RR(x - 10, y - 10, 20, 20, 3), d + 100, true)
          ink(g, RR(x - 10, y - 10, 20, 20, 3), { w: 2, d, t: 200 })
        }
        text(g, 40, 440, 'du', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 320, 440, 'Ziel', { anchor: 'middle', cls: 's', d: 300 })
      },
      router(g) {
        node(g, 180, 470, 0, 'Router')
        for (const [x, y] of [[60, 380], [300, 380], [300, 560]] as const) {
          ink(g, L([180 + (x - 180) * 0.15, 470 + (y - 470) * 0.15], [x, y]), { w: 2, d: 300, t: 300 })
          node(g, x, y, 500)
        }
        arrow(g, L([80, 560], [160, 490]), { w: 2.6, d: 900, t: 300, head: 9 })
        question(g, 180, 380, 0.5, 1100)
      },
      zusammen(g) {
        for (let i = 0; i < 9; i++) {
          const missing = i === 5
          const x = 90 + (i % 3) * 64
          const y = 380 + Math.floor(i / 3) * 64
          if (missing) dashes(g, RR(x, y, 56, 56, 4), { w: 1.6, d: 400 })
          else ink(g, RR(x, y, 56, 56, 4), { w: 2.4, d: i * 80, t: 200 })
        }
        text(g, 282, 452, 'Nr. 6 fehlt!', { cls: 's', d: 900 })
        text(g, 180, 620, 'wird neu angefordert', { anchor: 'middle', cls: 's', d: 1200 })
      },
      postkarten(g) {
        for (let i = 0; i < 4; i++) letter(g, 50 + i * 66, 440 + (i % 2) * 30, 56, i * 150)
        text(g, 180, 580, 'ein Buch als Postkarten verschicken', { anchor: 'middle', cls: 's', d: 900 })
      },
      arpanet(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: '1969', sub: 'ARPANET', up: true }])
      },
      lo(g) {
        text(g, 180, 460, 'LO', { anchor: 'middle', size: 80, d: 200 })
        text(g, 180, 510, 'die erste Nachricht – dann stürzte der Rechner ab', { anchor: 'middle', cls: 's', d: 700 })
      },
      kabel(g) {
        for (const [y, d] of [[340, 0], [370, 150]] as const) ink(g, waveP(20, 340, y, 5, 60, y / 30), { w: 2, d, t: 700 })
        ink(g, B([20, 600], [120, 560], [240, 640], [340, 600]), { w: 4, d: 400, t: 900 })
        text(g, 180, 660, 'Seekabel am Meeresgrund', { anchor: 'middle', cls: 's', d: 1000 })
      },
      anteil(g) {
        hbars(g, [
          { label: 'Seekabel', v: 99, fmt: () => 'über 95 %', dense: true },
          { label: 'Satellit', v: 2, fmt: () => 'kleiner Rest' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'Daten zwischen Kontinenten', { anchor: 'middle', cls: 's', d: 1200 })
      },
      dns(g) {
        box(g, 30, 400, 140, 70, 'wikipedia.org', { size: 15 })
        arrow(g, L([176, 435], [196, 435]), { w: 2.4, d: 500, t: 200, head: 8 })
        box(g, 202, 400, 130, 70, '185.15.…', { size: 15, fill: true, d: 600 })
        text(g, 180, 540, 'DNS: das Telefonbuch des Netzes', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        for (let i = 0; i < 6; i++) ink(g, RR(70 + i * 38, 470, 30, 30, 4), { w: 2.2, d: i * 100, t: 200 })
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
        fig(g, 70, 380, 3.4)
        fig(g, 290, 380, 3.4, { d: 200 })
        fig(g, 180, 230, 2.6, { d: 400 })
        dashes(g, L([110, 330], [250, 330]), { w: 1.8, d: 600 })
        question(g, 180, 120, 0.6, 900)
      },
      problem(g) {
        fig(g, 70, 560, 3.4)
        fig(g, 290, 560, 3.4, { d: 200 })
        ink(g, L([110, 510], [250, 510]), { w: 2.4, d: 400, t: 500 })
        text(g, 180, 420, 'jede Nachricht kann mitgelesen werden', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 70, 610, 'Anna', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 290, 610, 'Ben', { anchor: 'middle', cls: 's', d: 900 })
      },
      gelb(g) {
        pot(g, 180, 560, 'Gelb – für alle sichtbar')
      },
      geheim(g) {
        pot(g, 90, 560, 'Anna: geheim Rot', 0, true)
        pot(g, 270, 560, 'Ben: geheim Blau', 300)
      },
      mischen(g) {
        pot(g, 90, 560, 'Gelb + Rot', 0, true)
        pot(g, 270, 560, 'Gelb + Blau', 300)
      },
      tausch(g) {
        pot(g, 70, 600, 'Gelb + Rot', 0, true)
        pot(g, 290, 600, 'Gelb + Blau', 200)
        carrow(g, [110, 520], [250, 520], 40, { d: 600 })
        carrow(g, [250, 470], [110, 470], 40, { d: 900 })
        text(g, 180, 390, 'öffentlich getauscht', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gleich(g) {
        pot(g, 90, 560, 'Gelb + Blau + Rot', 0, true)
        pot(g, 270, 560, 'Gelb + Rot + Blau', 300, true)
        text(g, 180, 540, '=', { anchor: 'middle', size: 40, d: 900 })
      },
      entmischen(g) {
        pot(g, 120, 560, 'Gelb + Rot', 0, true)
        arrow(g, L([170, 520], [220, 520]), { w: 2.4, d: 500, t: 300, head: 9 })
        question(g, 270, 510, 0.7, 800)
        text(g, 180, 640, 'Mischen: leicht · Entmischen: fast unmöglich', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zahlen(g) {
        text(g, 180, 430, '3 hoch 7', { anchor: 'middle', size: 30, d: 200 })
        text(g, 180, 470, 'Rest beim Teilen durch 17', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 180, 540, 'vorwärts: Sekunden', { anchor: 'middle', d: 900 })
        text(g, 180, 576, 'rückwärts: Jahrtausende', { anchor: 'middle', d: 1100 })
      },
      diffie(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1976', sub: 'Diffie & Hellman', up: true }])
      },
      schloss(g) {
        ink(g, RR(110, 470, 140, 110, 12), { w: 3, t: 600 })
        ink(g, [...L([140, 470], [140, 420]), ...B([140, 420], [140, 370], [220, 370], [220, 420]).slice(1), ...L([220, 420], [220, 470]).slice(1)], { w: 3, d: 300, t: 600 })
        ink(g, E(180, 515, 10), { w: 2.4, d: 700, t: 200 })
        ink(g, L([180, 525], [180, 550]), { w: 2.4, d: 800, t: 200 })
        text(g, 180, 630, 'https://', { anchor: 'middle', size: 22, d: 1000 })
      },
      gchq(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.25, label: '1970–74', sub: 'geheim in Großbritannien', up: true },
          { at: 0.6, label: '1976', sub: 'öffentlich', big: true },
          { at: 0.85, label: '1997', sub: 'enthüllt' },
        ])
      },
      quanten(g) {
        box(g, 40, 400, 280, 80, ['Quantencomputer', 'könnten das knacken'], { size: 17 })
        arrow(g, L([180, 490], [180, 530]), { w: 2.4, d: 600, t: 300, head: 9 })
        box(g, 40, 540, 280, 70, 'neue Verfahren seit 2024', { size: 17, fill: true, d: 800 })
      },
      ende(g) {
        pot(g, 120, 560, '', 0, true)
        pot(g, 240, 560, '', 200, true)
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
        hand(g, 50, 330, [true, true, true, true, true])
        hand(g, 220, 330, [true, true, true, true, true], 300)
      },
      zehn(g) {
        text(g, 180, 460, '10?', { anchor: 'middle', size: 80, d: 200 })
      },
      wert(g) {
        hand(g, 130, 520, [true, true, true, true, true], 0, ['1', '2', '4', '8', '16'])
        text(g, 180, 380, 'jeder Finger hat einen Wert', { anchor: 'middle', cls: 's', d: 1000 })
      },
      drei(g) {
        hand(g, 130, 520, [true, true, false, false, false], 0, ['1', '2', '4', '8', '16'])
        text(g, 180, 380, '1 + 2 = 3', { anchor: 'middle', size: 26, d: 1000 })
      },
      fuenf(g) {
        hand(g, 130, 520, [true, false, true, false, false], 0, ['1', '2', '4', '8', '16'])
        text(g, 180, 380, '1 + 4 = 5', { anchor: 'middle', size: 26, d: 1000 })
      },
      einunddreissig(g) {
        hand(g, 130, 520, [true, true, true, true, true], 0, ['1', '2', '4', '8', '16'])
        text(g, 180, 380, '1 + 2 + 4 + 8 + 16 = 31', { anchor: 'middle', size: 24, d: 1000 })
      },
      tausend(g) {
        text(g, 180, 450, '1.023', { anchor: 'middle', size: 70, d: 200 })
        text(g, 180, 500, 'mit zehn Fingern', { anchor: 'middle', cls: 's', d: 600 })
      },
      verdoppeln(g) {
        const vals = ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512']
        vals.forEach((v, i) => {
          const x = 36 + (i % 5) * 72
          const y = 400 + Math.floor(i / 5) * 110
          box(g, x - 28, y, 56, 56, v, { size: 17, d: i * 100 })
        })
        text(g, 180, 660, 'jeder Finger doppelt so viel wie der vorige', { anchor: 'middle', cls: 's', d: 1200 })
      },
      binaer(g) {
        text(g, 180, 450, '1 0 1', { anchor: 'middle', size: 60, d: 200 })
        text(g, 180, 500, '= 4 + 0 + 1 = 5', { anchor: 'middle', size: 22, d: 700 })
      },
      leibniz(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: '1703', sub: 'Gottfried Wilhelm Leibniz', up: true }])
      },
      schalter(g) {
        for (const [x, on] of [[110, true], [250, false]] as const) {
          ink(g, RR(x - 40, 420, 80, 140, 12), { w: 2.8, t: 500, d: x === 110 ? 0 : 200 })
          const k: P[] = on ? RR(x - 24, 436, 48, 54, 8) : RR(x - 24, 490, 48, 54, 8)
          hatch(g, k, 500, true)
          ink(g, k, { w: 2.4, d: 400, t: 300 })
          text(g, x, 600, on ? '1 = an' : '0 = aus', { anchor: 'middle', cls: 's', d: 700 })
        }
      },
      chip(g) {
        ink(g, RR(110, 400, 140, 140, 8), { w: 3, t: 600 })
        for (let i = 0; i < 5; i++) for (const side of [-1, 1]) {
          const y = 420 + i * 24
          ink(g, L([side < 0 ? 110 : 250, y], [side < 0 ? 86 : 274, y]), { w: 2, d: 400 + i * 60, t: 100 })
        }
        text(g, 180, 600, 'Milliarden Schalter im Handy', { anchor: 'middle', cls: 's', d: 1000 })
      },
      byte(g) {
        text(g, 180, 440, '8 Bit = 1 Byte', { anchor: 'middle', size: 30, d: 200 })
        text(g, 180, 490, '256 Möglichkeiten', { anchor: 'middle', d: 700 })
        text(g, 180, 520, 'zum Beispiel ein Buchstabe', { anchor: 'middle', cls: 's', d: 900 })
      },
      kilo(g) {
        text(g, 180, 450, '2¹⁰ = 1.024', { anchor: 'middle', size: 40, d: 200 })
        text(g, 180, 500, 'darum: 1 Kibibyte = 1.024 Byte', { anchor: 'middle', cls: 's', d: 700 })
      },
      ende(g) {
        hand(g, 50, 500, [true, false, true, true, false])
        hand(g, 220, 500, [false, true, false, true, true], 300)
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
      { t: T('Auch Farben sind Bits: Jedes Pixel deines Bildschirms speichert Rot, Grün und Blau mit je **8 Bit** – zusammen über 16 Millionen Farben.', 64), gfx: { byte: {} } },
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
