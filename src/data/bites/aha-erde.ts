import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, blank, check, clock, cross, dashes, fig, globe, hatch, hbars, ink, mountain, question, rays, st, star, text, timeline, vbars, type P } from './draw'
import { arcArrow, ball, box, bullets, carrow, cloud, dot, drop, rad, sun, thermo, water, waveP } from './kit'

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

/** Kartennetz: Rahmen, Längengrade gleichmäßig, Breitengrade nach Projektion */
function grid(g: Element, x: number, y: number, w: number, h: number, proj: 'mercator' | 'flaeche', d = 0): (lat: number) => number {
  const merc = (p: number) => Math.log(Math.tan(Math.PI / 4 + rad(p) / 2))
  const yOf = (lat: number) => y + h / 2 - (proj === 'mercator' ? merc(lat) / merc(80) : Math.sin(rad(lat))) * (h / 2)
  ink(g, RR(x, y, w, h, 2), { w: 2.8, d, t: 700 })
  for (let k = 1; k < 8; k++) ink(g, L([x + (w * k) / 8, y + 2], [x + (w * k) / 8, y + h - 2]), { w: 1, d: d + 300 + k * 40, t: 300 })
  for (const lat of [-60, -40, -20, 0, 20, 40, 60]) ink(g, L([x + 2, yOf(lat)], [x + w - 2, yOf(lat)]), { w: lat === 0 ? 1.8 : 1, d: d + 500 + Math.abs(lat) * 5, t: 300 })
  return yOf
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

/** Schiff mit Rumpf auf y */
function ship(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  ink(g, [P(-40, -14), P(40, -14), P(28, 0), P(-28, 0), P(-40, -14)], { w: 2.4, d, t: 400 })
  ink(g, L(P(0, -14), P(0, -60)), { w: 2, d: d + 200, t: 200 })
  ink(g, [P(4, -58), P(30, -22), P(4, -22)], { w: 2, d: d + 300, t: 300 })
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
        const yOf = grid(g, 30, 80, 300, 340, 'mercator')
        blob(g, 150, yOf(72), 46, 30, 1, 900)
        blob(g, 200, yOf(4), 48, 56, 3, 1100)
      },
      netz(g) {
        grid(g, 30, 300, 300, 340, 'mercator')
        text(g, 180, 670, 'Breitengrade rücken zu den Polen auseinander', { anchor: 'middle', cls: 's', d: 1200 })
      },
      mercator(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: '1569', sub: 'Gerhard Mercator', up: true }])
      },
      schiff(g) {
        const yOf = grid(g, 30, 300, 300, 340, 'mercator')
        arrow(g, L([60, yOf(-40)], [300, yOf(40)]), { w: 3, d: 1200, t: 900, head: 12 })
        ship(g, 70, yOf(-40) + 30, 0.7, 900)
      },
      wahr(g) {
        hbars(g, [
          { label: 'Afrika', v: 30.3, fmt: () => '30,3 Mio. km²', dense: true },
          { label: 'Grönland', v: 2.2, fmt: () => '2,2 Mio. km²' },
        ], { x: 110, y: 400, w: 190, h: 40, gap: 80 })
      },
      orange(g) {
        for (let i = 0; i < 6; i++) {
          const x = 50 + i * 52
          const p: P[] = [...B([x, 360], [x - 30, 420], [x - 30, 520], [x, 580]), ...B([x, 580], [x + 30, 520], [x + 30, 420], [x, 360]).slice(1)]
          hatch(g, p, 400 + i * 80)
          ink(g, p, { w: 2.4, d: i * 80, t: 400 })
        }
        text(g, 180, 630, 'flach nur mit Lücken', { anchor: 'middle', cls: 's', d: 1000 })
      },
      gauss(g) {
        globe(g, 90, 470, 60)
        arrow(g, L([170, 470], [210, 470]), { w: 2.6, d: 900, t: 300, head: 10 })
        ink(g, RR(225, 420, 110, 100, 2), { w: 2.8, d: 1100, t: 500 })
        question(g, 280, 470, 0.6, 1500)
        text(g, 180, 600, 'Gauß 1827: ohne Verzerrung unmöglich', { anchor: 'middle', cls: 's', d: 1600 })
      },
      kreise(g) {
        const yOf = grid(g, 30, 300, 300, 340, 'mercator')
        for (const [lat, k] of [[0, 1], [40, 1.31], [60, 2], [-40, 1.31], [-60, 2]] as const) for (const x of [105, 255]) ink(g, E(x, yOf(lat), 9 * k), { w: 2, d: 1200 + Math.abs(lat) * 10, t: 300 })
      },
      russland(g) {
        hbars(g, [
          { label: 'Afrika', v: 30.3, fmt: () => '30,3', dense: true },
          { label: 'Russland', v: 17.1, fmt: () => '17,1' },
          { label: 'Brasilien', v: 8.5, fmt: () => '8,5', dense: true },
          { label: 'Alaska', v: 1.7, fmt: () => '1,7' },
        ], { x: 90, y: 350, w: 220, h: 30, gap: 70 })
        text(g, 180, 650, 'Fläche in Mio. km²', { anchor: 'middle', cls: 's', d: 1400 })
      },
      antarktis(g) {
        grid(g, 30, 300, 300, 340, 'mercator')
        const band: P[] = [[32, 600], [328, 600], [328, 638], [32, 638], [32, 600]]
        hatch(g, band, 1100, true)
        ink(g, L([32, 600], [328, 600]), { w: 2.4, d: 1000, t: 500 })
      },
      peters(g) {
        const yOf = grid(g, 30, 300, 300, 260, 'flaeche')
        blob(g, 150, yOf(72) + 10, 50, 10, 1, 900)
        blob(g, 200, yOf(4), 40, 74, 3, 1100)
        text(g, 180, 600, 'Gall-Peters: Flächen stimmen', { anchor: 'middle', cls: 's', d: 1400 })
        text(g, 180, 624, 'Formen gestaucht', { anchor: 'middle', cls: 's', d: 1500 })
      },
      handy(g) {
        ink(g, RR(120, 330, 120, 230, 18), { w: 3, t: 600 })
        grid(g, 134, 360, 92, 170, 'mercator', 300)
        dot(g, 190, 440, 5, 1300)
        text(g, 180, 610, 'Online-Karten: Mercator', { anchor: 'middle', cls: 's', d: 1400 })
      },
      tripel(g) {
        const o: P[] = E(180, 470, 150, 95)
        ink(g, o, { w: 3, t: 800 })
        ink(g, L([30, 470], [330, 470]), { w: 1.2, d: 400, t: 400 })
        for (const k of [-0.6, -0.3, 0, 0.3, 0.6]) ink(g, E(180, 470, 150 * Math.abs(k) + 0.1, 95, k < 0 ? 90 : -90, k < 0 ? 270 : 90), { w: 1, d: 500, t: 400 })
        blob(g, 140, 400, 18, 12, 1, 1000)
        blob(g, 200, 480, 34, 40, 3, 1100)
        text(g, 180, 610, 'Winkel-Tripel: guter Kompromiss', { anchor: 'middle', cls: 's', d: 1400 })
      },
      ende(g) {
        globe(g, 180, 480, 90)
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
        sun(g, 90, 160, 34)
        moon(g, 270, 160, 30, 600)
        dune(g, 20, 220, 420, 90, 300)
        dune(g, 160, 340, 420, 60, 500)
        ink(g, L([20, 422], [340, 422]), { w: 2.6, d: 200, t: 500 })
      },
      tag(g) {
        sun(g, 260, 380, 36)
        thermo(g, 90, 340, 200, 0.92, 300)
        text(g, 150, 470, 'über 40 °C', { size: 22, d: 800 })
      },
      nacht(g) {
        moon(g, 260, 380, 32)
        for (const [x, y] of [[190, 340], [320, 440], [220, 470]] as const) star(g, x, y, 7, { d: 600 })
        thermo(g, 90, 340, 200, 0.12, 300)
        text(g, 130, 600, 'um 0 °C', { size: 22, d: 800 })
      },
      strahlt(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        for (const x of [70, 180, 290]) arrow(g, Array.from({ length: 51 }, (_, i) => [x + Math.sin(i / 3) * 8, 590 - i * 5] as P), { w: 2.4, d: 400, t: 900, head: 10 })
        text(g, 180, 320, 'Wärme strahlt ins All', { anchor: 'middle', cls: 's', d: 1300 })
      },
      decke(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        dashes(g, L([20, 400], [340, 400]), { w: 2, d: 300 })
        text(g, 180, 380, 'Wasserdampf', { anchor: 'middle', cls: 's', d: 400 })
        for (const x of [60, 160, 260]) {
          arrow(g, L([x, 586], [x, 420]), { w: 2.4, d: 600, t: 500, head: 10 })
          carrow(g, [x + 14, 420], [x + 40, 584], -12, { d: 1100 })
        }
      },
      wasser(g) {
        water(g, 180, 470, 3)
      },
      vergleich(g) {
        hbars(g, [
          { label: 'Wüste', v: 30, fmt: () => 'oft über 25 °C', dense: true },
          { label: 'Regenwald', v: 9, fmt: () => 'unter 10 °C' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'Unterschied Tag – Nacht', { anchor: 'middle', cls: 's', d: 1200 })
      },
      sand(g) {
        vbars(g, [
          { label: 'Wasser', v: 4.2, fmt: () => '4,2', dense: true },
          { label: 'Sand', v: 0.8, fmt: () => '0,8' },
        ], { x: 90, base: 590, w: 70, gap: 110, h: 220 })
        text(g, 180, 640, 'Joule je Gramm und Grad', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kueste(g) {
        for (const [y, d] of [[560, 0], [600, 150]] as const) ink(g, waveP(20, 160, y, 5, 40, y / 20), { w: 2.2, d, t: 600 })
        dune(g, 190, 340, 600, 70, 300)
        ink(g, L([180, 602], [340, 602]), { w: 2.6, d: 200, t: 400 })
        text(g, 90, 650, 'mild', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 265, 650, 'extrem', { anchor: 'middle', cls: 's', d: 1000 })
      },
      antarktis(g) {
        hbars(g, [
          { label: 'Antarktis', v: 14, fmt: () => '14', dense: true },
          { label: 'Sahara', v: 9.2, fmt: () => '9,2' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'Fläche in Mio. km²', { anchor: 'middle', cls: 's', d: 1200 })
      },
      frost(g) {
        for (const [x, y] of [[80, 340], [200, 320], [300, 360]] as const) star(g, x, y, 7, { d: 200 })
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 200, t: 500 })
        ink(g, L([180, 600], [180, 500]), { w: 2.4, d: 400, t: 300 })
        for (const k of [-1, 1]) ink(g, B([180, 540], [180 + k * 20, 520], [180 + k * 36, 520], [180 + k * 44, 500]), { w: 2.2, d: 600, t: 300 })
        for (const [x, y] of [[150, 470], [212, 470], [180, 450]] as const) {
          for (let k = 0; k < 3; k++) ink(g, L([x - 8 * Math.cos(rad(k * 60)), y - 8 * Math.sin(rad(k * 60))], [x + 8 * Math.cos(rad(k * 60)), y + 8 * Math.sin(rad(k * 60))]), { w: 1.6, d: 1000, t: 150 })
        }
        text(g, 180, 650, 'klare Nacht: Bodenfrost', { anchor: 'middle', cls: 's', d: 1200 })
      },
      wolke(g) {
        cloud(g, 180, 380, 1.4)
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 200, t: 500 })
        for (const x of [100, 260]) {
          arrow(g, L([x, 586], [x, 410]), { w: 2.4, d: 600, t: 500, head: 10 })
          carrow(g, [x + 16, 410], [x + 40, 584], -12, { d: 1100 })
        }
        text(g, 180, 650, 'bewölkte Nacht: milder', { anchor: 'middle', cls: 's', d: 1200 })
      },
      mond(g) {
        ball(g, 180, 460, 80, { fill: 'hell' })
        text(g, 180, 590, 'Tag: über 120 °C', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 180, 616, 'Nacht: unter −170 °C', { anchor: 'middle', cls: 's', d: 900 })
      },
      gewand(g) {
        fig(g, 180, 600, 4)
        const robe: P[] = [[160, 520], [200, 520], [216, 600], [144, 600], [160, 520]]
        blank(g, robe)
        hatch(g, robe, 600)
        ink(g, robe, { w: 2.6, d: 400, t: 500 })
        text(g, 180, 650, 'weite Gewänder: Schutz vor Hitze und Kälte', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        moon(g, 180, 460, 50)
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
        for (const [y, d] of [[300, 0], [340, 150], [380, 300]] as const) ink(g, waveP(20, 340, y, 6, 60, y / 30), { w: 2.4, d, t: 800 })
        for (let i = 0; i < 6; i++) ink(g, RR(70 + i * 40, 160 + (i % 2) * 20, 14, 14, 2), { w: 2, d: 600 + i * 80, t: 200 })
      },
      regen(g) {
        cloud(g, 120, 400, 1.2)
        for (let i = 0; i < 5; i++) drop(g, 70 + i * 24, 440 + (i % 2) * 24, 0.5, 600 + i * 80, false)
        mountain(g, 160, 340, 620, [260, 470], 300)
        ink(g, L([20, 620], [340, 620]), { w: 2.6, d: 200, t: 500 })
      },
      saeure(g) {
        box(g, 30, 380, 300, 64, 'Regen + CO₂ → schwache Säure', { size: 17 })
        text(g, 180, 520, 'löst Mineralien aus dem Gestein', { anchor: 'middle', d: 800 })
      },
      fluss(g) {
        mountain(g, 20, 180, 520, [90, 380])
        ink(g, B([186, 516], [220, 560], [260, 556], [330, 610]), { w: 3, d: 600, t: 800 })
        ink(g, B([186, 540], [214, 590], [250, 590], [310, 640]), { w: 3, d: 700, t: 800 })
        for (let i = 0; i < 4; i++) dot(g, 214 + i * 26, 572 + i * 10, 3.5, 1200 + i * 100)
        text(g, 300, 450, 'gelöste Salze', { anchor: 'middle', cls: 's', d: 1400 })
      },
      verdunsten(g) {
        sun(g, 280, 340, 28)
        ink(g, waveP(20, 340, 560, 6, 60), { w: 2.6, t: 700 })
        for (const x of [80, 140, 200]) arrow(g, L([x, 540], [x, 430]), { w: 2.2, d: 600, t: 400, head: 9 })
        text(g, 140, 410, 'Wasser steigt auf', { anchor: 'middle', cls: 's', d: 900 })
        for (let i = 0; i < 8; i++) dot(g, 50 + i * 36, 610, 4, 1000 + i * 60)
        text(g, 180, 650, 'Salz bleibt im Meer', { anchor: 'middle', cls: 's', d: 1300 })
      },
      kreislauf(g) {
        box(g, 30, 340, 130, 60, 'Fluss', { size: 17 })
        box(g, 200, 340, 130, 60, 'Meer', { size: 17, fill: true })
        box(g, 115, 520, 130, 60, 'Wolke', { size: 17, d: 400 })
        carrow(g, [160, 370], [200, 370], 0, { d: 700 })
        carrow(g, [265, 404], [230, 516], -20, { d: 900 })
        carrow(g, [130, 516], [95, 404], -20, { d: 1100 })
        text(g, 300, 470, 'nur Wasser', { anchor: 'middle', cls: 's', d: 1200 })
      },
      gramm(g) {
        text(g, 180, 460, '35 g', { anchor: 'middle', size: 60, d: 200 })
        text(g, 180, 500, 'Salz in jedem Liter Meerwasser', { anchor: 'middle', cls: 's', d: 600 })
      },
      ionen(g) {
        for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
          const na = (i + j) % 2 === 0
          ball(g, 90 + i * 60, 400 + j * 60, na ? 16 : 22, { fill: na ? 'leer' : 'hell', d: (i + j) * 80 })
        }
        text(g, 180, 620, 'Natrium und Chlorid', { anchor: 'middle', cls: 's', d: 1100 })
      },
      vulkan(g) {
        for (const [y, d] of [[340, 0], [370, 100]] as const) ink(g, waveP(20, 340, y, 5, 60, y / 30), { w: 2, d, t: 700 })
        mountain(g, 100, 260, 620, [180, 520], 300, true)
        for (const k of [-1, 0, 1]) ink(g, B([180 + k * 10, 510], [180 + k * 24, 480], [180 + k * 6, 450], [180 + k * 20, 420]), { w: 1.8, d: 900, t: 400 })
        ink(g, L([20, 622], [340, 622]), { w: 2.6, d: 200, t: 500 })
        text(g, 290, 560, 'heiße Quellen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      schicht(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        const s: P[] = [[20, 600], [340, 600], [340, 520], [20, 520], [20, 600]]
        hatch(g, s, 400, true)
        ink(g, L([20, 520], [340, 520]), { w: 2.4, d: 300, t: 500 })
        fig(g, 300, 518, 1.4, { d: 900 })
        text(g, 180, 470, 'über 150 Meter dick', { anchor: 'middle', d: 1000 })
      },
      totes(g) {
        ink(g, waveP(20, 340, 480, 4, 60), { w: 2.4, t: 600 })
        const p = st(g, '', '')
        ink(p, [[120, 476], [140, 470], [220, 470], [240, 476]], { w: 2.4, d: 400, t: 300 })
        ball(p, 110, 460, 12, { d: 500 })
        ink(p, B([226, 470], [236, 456], [246, 450], [256, 440]), { w: 2.2, d: 600, t: 200 })
        text(g, 180, 560, 'Totes Meer: etwa 34 % Salz', { anchor: 'middle', cls: 's', d: 900 })
      },
      ostsee(g) {
        vbars(g, [
          { label: 'Totes Meer', v: 34, fmt: () => '34 %', dense: true },
          { label: 'Ozean', v: 3.5, fmt: () => '3,5 %' },
          { label: 'Ostsee', v: 0.8, fmt: () => '< 1 %' },
        ], { x: 40, base: 600, w: 70, gap: 110, h: 240 })
      },
      gefrieren(g) {
        thermo(g, 90, 360, 200, 0.4)
        text(g, 140, 480, 'gefriert erst bei −1,9 °C', { size: 18, d: 600 })
      },
      ende(g) {
        for (const [y, d] of [[460, 0], [500, 150]] as const) ink(g, waveP(20, 340, y, 6, 60, y / 30), { w: 2.4, d, t: 800 })
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
      { t: T('Wo viel verdunstet und kaum etwas abfließt, wird es extrem: Das **Tote Meer** enthält rund 34 Prozent Salz.', 64), gfx: { ostsee: {} } },
      { t: T('Das Wasser ist so dicht, dass man darin **liegen** kann wie auf einer Luftmatratze.', 64), gfx: { totes: {} } },
      { t: T('Die Ostsee dagegen bekommt viel Flusswasser und verdunstet wenig. Sie ist nur **leicht salzig**.', 64), gfx: { ostsee: {} } },
      { t: T('Salzwasser ist schwerer als Süßwasser. Wo Flüsse ins Meer münden, schiebt sich das Süßwasser oft **obenauf**.', 64), gfx: { ostsee: {} } },
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
        ink(g, waveP(20, 340, 300, 4, 60), { w: 2.4, t: 700 })
        ship(g, 180, 302, 1.2, 300)
      },
      beben(g) {
        ink(g, L([20, 380], [340, 380]), { w: 2.4, t: 500 })
        ink(g, [[20, 600], [180, 600]], { w: 3, d: 300, t: 400 })
        const up = st(g, 'm1', '--m1: translateY(-30px); transition-duration: 1.2s; --dl: 600ms')
        ink(up, [[180, 600], [340, 600]], { w: 3, d: 300, t: 400 })
        hatch(up, [[180, 600], [340, 600], [340, 640], [180, 640], [180, 600]], 500)
        hatch(g, [[20, 600], [180, 600], [180, 640], [20, 640], [20, 600]], 500, true)
        text(g, 180, 670, 'der Meeresboden ruckt', { anchor: 'middle', cls: 's', d: 900 })
      },
      saeule(g) {
        ink(g, B([20, 380], [120, 380], [140, 360], [180, 360]), { w: 2.6, t: 400 })
        ink(g, B([180, 360], [220, 360], [240, 380], [340, 380]), { w: 2.6, d: 300, t: 400 })
        ink(g, L([20, 620], [340, 620]), { w: 3, d: 200, t: 500 })
        for (const y of [420, 480, 540]) arrow(g, L([60, y], [300, y]), { w: 2, d: 600 + (y - 420) * 3, t: 500, head: 9 })
        text(g, 180, 660, 'das ganze Wasser bis zum Boden bewegt sich', { anchor: 'middle', cls: 's', d: 1200 })
      },
      flach(g) {
        ink(g, waveP(20, 340, 450, 6, 320), { w: 2.8, t: 900 })
        dashes(g, L([20, 450], [340, 450]), { w: 1.2, d: 600 })
        text(g, 180, 400, 'oft unter 1 m hoch', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 520, 'über 100 km lang', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tempo(g) {
        text(g, 180, 450, '700 km/h', { anchor: 'middle', size: 52, d: 200 })
        text(g, 180, 495, 'so schnell wie ein Verkehrsflugzeug', { anchor: 'middle', cls: 's', d: 600 })
      },
      formel(g) {
        text(g, 180, 450, 'v = √(g · Tiefe)', { anchor: 'middle', size: 30, d: 200 })
        text(g, 180, 510, 'tiefes Meer: schnell · flaches Meer: langsam', { anchor: 'middle', cls: 's', d: 700 })
      },
      kueste(g) {
        ink(g, [[20, 560], [200, 560], [340, 420]], { w: 3, t: 700 })
        hatch(g, [[200, 560], [340, 420], [340, 640], [200, 640], [200, 560]], 400, true)
        ink(g, L([200, 560], [200, 640]), { w: 1, d: 300, t: 200 })
        const w = st(g, 'm1', '--m1: translateX(30px) scaleY(2.8); transform-origin: 140px 470px; transition-duration: 2s; --dl: 400ms')
        ink(w, [...B([20, 470], [80, 470], [110, 450], [140, 440]), ...B([140, 440], [170, 450], [200, 470], [240, 470]).slice(1)], { w: 2.8, t: 600 })
      },
      stau(g) {
        for (let i = 0; i < 4; i++) {
          const x = 60 + i * 70
          const hgt = 30 + i * 22
          ink(g, B([x - 30, 560], [x - 10, 560], [x, 560 - hgt], [x + 20, 560]), { w: 2.4, d: i * 200, t: 400 })
        }
        ink(g, L([20, 562], [340, 562]), { w: 1.4, d: 100, t: 400 })
        arrow(g, L([60, 620], [300, 620]), { w: 2.4, d: 1000, t: 500, head: 10 })
        text(g, 180, 650, 'vorne bremst es, hinten drückt es nach', { anchor: 'middle', cls: 's', d: 1200 })
      },
      rueckzug(g) {
        ink(g, [[20, 560], [200, 560], [340, 420]], { w: 3, t: 700 })
        const sea = st(g, 'm1', '--m1: translateX(-120px); transition-duration: 2s; --dl: 500ms')
        ink(sea, waveP(40, 230, 540, 4, 40), { w: 2.4, t: 500 })
        for (let i = 0; i < 3; i++) ammoniteFish(g, 125 + i * 25, 552, 1000 + i * 150)
        text(g, 180, 640, 'Achtung: Das Meer weicht zurück', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zahlen(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.25, label: '2004', sub: 'Indischer Ozean', up: true },
          { at: 0.7, label: '2011', sub: 'Japan', big: true },
        ])
      },
      mehrere(g) {
        for (let i = 0; i < 3; i++) ink(g, B([30 + i * 100, 500], [60 + i * 100, 500], [70 + i * 100, 460 - (i === 1 ? 30 : 0)], [100 + i * 100, 500]), { w: 2.6, d: i * 300, t: 500 })
        ink(g, L([20, 502], [340, 502]), { w: 1.4, d: 100, t: 400 })
        text(g, 180, 570, 'mehrere Wellen, im Abstand vieler Minuten', { anchor: 'middle', cls: 's', d: 1000 })
      },
      boje(g) {
        ink(g, waveP(20, 340, 420, 5, 60), { w: 2.4, t: 600 })
        ink(g, RR(160, 380, 40, 40, 6), { w: 2.6, d: 300, t: 400 })
        ink(g, L([180, 380], [180, 340]), { w: 2, d: 500, t: 200 })
        rays(g, 180, 330, 12, 26, 6, 800)
        dashes(g, L([180, 424], [180, 600]), { w: 1.2, d: 600 })
        ink(g, RR(160, 600, 40, 24, 4), { w: 2.4, d: 700, t: 300 })
        text(g, 280, 616, 'Drucksensor', { anchor: 'middle', cls: 's', d: 1000 })
      },
      hoch(g) {
        ink(g, [[20, 620], [200, 620], [280, 460], [340, 460]], { w: 3, t: 700 })
        hatch(g, [[200, 620], [280, 460], [340, 460], [340, 640], [200, 640], [200, 620]], 400)
        fig(g, 312, 458, 1.6, { d: 600, arms: 'up' })
        arrow(g, L([150, 600], [230, 520]), { w: 2.6, d: 900, t: 400, head: 10 })
        text(g, 100, 470, 'sofort nach oben', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        ink(g, waveP(20, 340, 480, 6, 320), { w: 3, t: 900 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { schiff: {} } },
      { t: T('Ein Tsunami entsteht meist durch ein **Seebeben**: Der Meeresboden ruckt plötzlich um einige Meter.', 64), gfx: { beben: { cls: 'a1' } } },
      { t: T('Dabei wird nicht nur die Oberfläche bewegt, sondern das **ganze Wasser** – vom Grund bis oben, kilometerdick.', 64), gfx: { saeule: {} } },
      { t: T('Auf offenem Meer ist die Welle oft **unter einem Meter** hoch – aber über hundert Kilometer lang.', 64), gfx: { flach: {} } },
      { t: T('Ein Schiff hebt sich ganz sanft über Minuten. Die Besatzung **merkt nichts**.', 64), gfx: { schiff: {} } },
      { t: T('Dabei rast die Welle mit rund **700 km/h** durch den Ozean – so schnell wie ein Flugzeug.', 64), gfx: { tempo: {} } },
      { t: T('Ihr Tempo hängt nur von der **Wassertiefe** ab: je tiefer, desto schneller.', 64), gfx: { formel: {} } },
      { t: T('Nähert sie sich der Küste, wird das Wasser flach. Die Front der Welle wird **gebremst**.', 64), gfx: { stau: {} } },
      { t: T('Der hintere Teil ist noch schnell und **holt auf**. Das Wasser staut sich – die Welle wächst in die Höhe.', 64), gfx: { stau: {} } },
      { t: T('Aus einem Meter auf hoher See werden an der Küste **zehn, zwanzig, dreißig** Meter.', 64), gfx: { kueste: { cls: 'a1' } } },
      { t: T('Oft kündigt sich ein Tsunami seltsam an: Das Meer **weicht zurück** und legt den Grund frei.', 64), gfx: { rueckzug: { cls: 'a1' } } },
      { t: T('Das ist das Wellental, das zuerst ankommt. Wer das sieht, muss **sofort** weg – nicht hingehen und staunen.', 64), gfx: { rueckzug: { cls: 'a1' } } },
      { t: T('Ein Tsunami bricht nicht wie eine Surfwelle. Er wirkt eher wie eine **Flut**, die nicht aufhört zu steigen.', 64), gfx: { kueste: { cls: 'a1' } } },
      { t: T('Und selten kommt nur eine Welle. Oft folgen **mehrere** – die erste ist nicht unbedingt die größte.', 64), gfx: { mehrere: {} } },
      { t: T('2004 starben im Indischen Ozean rund **230.000 Menschen**. 2011 traf ein Tsunami Japan mit Wellen von örtlich fast 40 Metern.', 64), gfx: { zahlen: {} } },
      { t: T('Heute messen **Bojen** mit Drucksensoren am Meeresgrund jede verdächtige Welle und lösen Warnungen aus.', 64), gfx: { boje: {} } },
      { t: T('Die wichtigste Regel an der Küste: Bebt die Erde stark oder weicht das Meer zurück – sofort auf **höheres Gelände**.', 64), gfx: { hoch: {} } },
      { t: T('Das Wort kommt aus dem Japanischen: **Tsunami** heißt „Hafenwelle“. Fischer bemerkten draußen nichts – und fanden ihren Hafen zerstört.', 64), gfx: { schiff: {} } },
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
        ink(g, L([20, 300], [340, 300]), { w: 1, t: 400 })
        seismo(g, 20, 340, 300, 110, 200)
      },
      richter(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1935', sub: 'Charles Richter', up: true }])
      },
      zehn(g) {
        const rows: [string, number][] = [['3', 4], ['4', 12], ['5', 40]]
        rows.forEach(([m, a], i) => {
          const y = 380 + i * 90
          text(g, 40, y + 6, m, { size: 24, d: i * 300 })
          seismo(g, 70, 330, y, a, i * 300)
        })
        text(g, 180, 650, 'je Stufe: 10-mal so großer Ausschlag', { anchor: 'middle', cls: 's', d: 1200 })
      },
      energie(g) {
        text(g, 180, 450, '× 32', { anchor: 'middle', size: 64, d: 200 })
        text(g, 180, 500, 'Energie je Stufe', { anchor: 'middle', cls: 's', d: 600 })
      },
      tausend(g) {
        text(g, 180, 400, 'Stärke 6 gegenüber Stärke 3', { anchor: 'middle', cls: 's', d: 100 })
        text(g, 180, 470, '1.000 ×', { anchor: 'middle', size: 40, d: 300 })
        text(g, 180, 496, 'Ausschlag', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 180, 570, '≈ 32.000 ×', { anchor: 'middle', size: 40, d: 900 })
        text(g, 180, 596, 'Energie', { anchor: 'middle', cls: 's', d: 1100 })
      },
      log(g) {
        for (let i = 0; i <= 5; i++) {
          const x = 40 + i * 56
          ink(g, L([x, 500], [x, 520]), { w: 2, d: i * 100, t: 150 })
          text(g, x, 550, String(i + 3), { anchor: 'middle', d: i * 100 })
        }
        ink(g, L([30, 510], [330, 510]), { w: 2.6, t: 500 })
        text(g, 180, 460, 'jeder Schritt: × 10', { anchor: 'middle', d: 800 })
      },
      chile(g) {
        text(g, 180, 450, '9,5', { anchor: 'middle', size: 70, d: 200 })
        text(g, 180, 500, 'Chile 1960 – das stärkste je gemessene Beben', { anchor: 'middle', cls: 's', d: 600 })
      },
      haeufig(g) {
        hbars(g, [
          { label: 'ab 8', v: 1, fmt: () => '≈ 1' },
          { label: 'ab 7', v: 15, fmt: () => '≈ 15' },
          { label: 'ab 6', v: 134, fmt: () => '≈ 130', dense: true },
        ], { x: 90, y: 380, w: 200, h: 34, gap: 64, max: 134 })
        text(g, 180, 600, 'Beben pro Jahr weltweit', { anchor: 'middle', cls: 's', d: 1200 })
      },
      haus(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        ink(g, RR(50, 440, 90, 160, 4), { w: 2.6, d: 200, t: 500 })
        for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) ink(g, RR(62 + j * 40, 456 + i * 46, 24, 26, 2), { w: 1.6, d: 500 + (i + j) * 60, t: 200 })
        check(g, 95, 400, 0.8, 900)
        ink(g, [[220, 600], [220, 500], [250, 470], [280, 520], [320, 500], [320, 600]], { w: 2.6, d: 300, t: 500 })
        cross(g, 270, 420, 0.8, 1000)
        text(g, 95, 640, 'erdbebensicher', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 270, 640, 'einfach gebaut', { anchor: 'middle', cls: 's', d: 1200 })
      },
      haiti(g) {
        hbars(g, [
          { label: 'Haiti 7,0', v: 200, fmt: () => 'über 100.000 Tote', dense: true },
          { label: 'Chile 8,8', v: 6, fmt: () => 'rund 500 Tote' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80, max: 200 })
        text(g, 180, 590, 'beide 2010', { anchor: 'middle', cls: 's', d: 1200 })
      },
      tiefe(g) {
        ink(g, L([20, 360], [340, 360]), { w: 3, t: 500 })
        for (const [x, y, d] of [[110, 430, 300], [250, 600, 600]] as const) {
          star(g, x, y, 10, { d, fill: true })
          for (const r of [24, 44]) ink(g, E(x, y, r, r, 200, 340), { w: 1.6, d: d + 300, t: 300 })
        }
        text(g, 110, 480, 'flach: stärker', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 250, 650, 'tief: schwächer', { anchor: 'middle', cls: 's', d: 1000 })
      },
      skalen(g) {
        bullets(g, 40, 380, ['Lautstärke: Dezibel', 'Säure: pH-Wert', 'Sternhelligkeit'], { gap: 56, size: 19 })
        text(g, 180, 600, 'alles logarithmisch', { anchor: 'middle', d: 1200 })
      },
      ende(g) {
        seismo(g, 20, 340, 480, 100)
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
      { t: T('Von 3 auf 6 sind das 32 mal 32 mal 32 – rund **32.000-mal** so viel Energie.', 64), gfx: { tausend: {} } },
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
        samerika(g, 130, 260, 0.8)
        afrika(g, 230, 260, 0.8, 300)
      },
      nah(g) {
        const a = st(g, 'm1', '--m1: translateX(46px); transition-duration: 2s; --dl: 400ms')
        samerika(a, 134, 470, 0.8)
        const b = st(g, 'm1', '--m1: translateX(-46px); transition-duration: 2s; --dl: 400ms')
        afrika(b, 226, 470, 0.8, 200)
      },
      wegener(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1912', sub: 'Alfred Wegener', up: true }])
      },
      fossil(g) {
        samerika(g, 130, 470, 0.8)
        afrika(g, 230, 470, 0.8, 200)
        for (const [x, y] of [[82, 454], [286, 454]] as const) {
          blank(g, E(x, y, 16))
          ammonite(g, x, y, 14, 900)
        }
        text(g, 180, 650, 'dieselben Fossilien auf beiden Seiten', { anchor: 'middle', cls: 's', d: 1300 })
      },
      spott(g) {
        fig(g, 180, 600, 4)
        question(g, 180, 400, 0.9, 700)
        text(g, 180, 650, 'Welche Kraft schiebt Kontinente?', { anchor: 'middle', cls: 's', d: 1000 })
      },
      gronland(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '1912', sub: 'Idee', up: true },
          { at: 0.45, label: '1930', sub: 'Tod in Grönland' },
          { at: 0.8, label: '1960er', sub: 'Beweis', big: true },
        ])
      },
      ruecken(g) {
        ink(g, L([20, 560], [340, 560]), { w: 1, t: 300 })
        ink(g, [[20, 520], [150, 520], [170, 480], [190, 480], [210, 520], [340, 520]], { w: 2.8, d: 200, t: 700 })
        for (const k of [-1, 1]) arrow(g, L([180 + k * 40, 600], [180 + k * 140, 600]), { w: 2.6, d: 900, t: 500, head: 10 })
        for (let i = 0; i < 6; i++) {
          const dx = 20 + i * 22
          for (const k of [-1, 1]) {
            const x = 180 + k * dx
            if (i % 2 === 0) hatch(g, [[x, 524], [x + k * 18, 524], [x + k * 18, 556], [x, 556], [x, 524]], 1200 + i * 80, true)
          }
        }
        for (const k of [-1, 1]) arcArrow(g, 180 + k * 40, 660, 40, k < 0 ? -30 : 210, k < 0 ? -150 : 330, { d: 1400 })
        text(g, 180, 440, 'neuer Meeresboden', { anchor: 'middle', cls: 's', d: 1000 })
      },
      tempo(g) {
        text(g, 180, 450, '2–5 cm', { anchor: 'middle', size: 54, d: 200 })
        text(g, 180, 495, 'pro Jahr – so schnell wachsen Fingernägel', { anchor: 'middle', cls: 's', d: 600 })
      },
      pangaea(g) {
        blob(g, 180, 470, 120, 100, 2)
        text(g, 180, 620, 'Pangaea: vor rund 300 bis 200 Mio. Jahren', { anchor: 'middle', cls: 's', d: 1000 })
      },
      zerfall(g) {
        blob(g, 100, 450, 60, 70, 2)
        blob(g, 250, 420, 80, 50, 4, 200)
        blob(g, 230, 560, 60, 40, 5, 400)
        text(g, 180, 650, 'ab rund 200 Mio. Jahren: zerbrochen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      zukunft(g) {
        blob(g, 180, 470, 110, 90, 6)
        question(g, 180, 470, 0.7, 900)
        text(g, 180, 620, 'in rund 250 Mio. Jahren', { anchor: 'middle', cls: 's', d: 1000 })
      },
      gps(g) {
        globe(g, 180, 470, 90)
        for (const [x, y] of [[140, 430], [220, 500], [200, 420]] as const) dot(g, x, y, 5, 1200)
        text(g, 180, 620, 'GPS misst die Drift heute direkt', { anchor: 'middle', cls: 's', d: 1400 })
      },
      ende(g) {
        samerika(g, 177, 470, 0.8)
        afrika(g, 183, 470, 0.8, 200)
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
      { t: T('Und in Afrika und Indien fand man Spuren uralter **Gletscher** – in heute tropischen Gegenden.', 64), gfx: { fossil: {} } },
      { t: T('Die meisten Geologen lachten trotzdem. Wegener konnte nicht erklären, **welche Kraft** ganze Kontinente bewegt.', 64), gfx: { spott: {} } },
      { t: T('Er starb 1930 auf einer Expedition in Grönland – ohne dass seine Idee **anerkannt** war.', 64), gfx: { gronland: {} } },
      { t: T('Erst in den 1960er-Jahren kam der Beweis – vom **Meeresboden**.', 64), gfx: { gronland: {} } },
      { t: T('Mitten im Atlantik zieht sich ein Gebirge, der **Mittelatlantische Rücken**. Dort quillt heißes Gestein auf und bildet neuen Meeresboden.', 64), gfx: { ruecken: {} } },
      { t: T('Der Boden wächst nach beiden Seiten und schiebt die Kontinente auseinander. Magnetische Streifen im Gestein zeigen das **wie Jahresringe**.', 64), gfx: { ruecken: {} } },
      { t: T('Aus Wegeners Idee wurde die **Plattentektonik**: Die Erdkruste besteht aus Platten, die auf dem zähen Erdmantel treiben.', 64), gfx: { ruecken: {} } },
      { t: T('Sie bewegen sich etwa **2 bis 5 Zentimeter** im Jahr – ungefähr so schnell, wie deine Fingernägel wachsen.', 64), gfx: { tempo: {} } },
      { t: T('Vor rund 300 Millionen Jahren bildeten fast alle Landmassen einen Superkontinent: **Pangaea**, „ganze Erde“.', 64), gfx: { pangaea: {} } },
      { t: T('Vor etwa 200 Millionen Jahren begann er **auseinanderzubrechen**. Der Atlantik öffnete sich – und wird bis heute breiter.', 64), gfx: { zerfall: {} } },
      { t: T('Heute misst **GPS** die Drift direkt: Europa und Nordamerika entfernen sich jedes Jahr um ein paar Zentimeter.', 64), gfx: { gps: {} } },
      { t: T('In vielleicht 250 Millionen Jahren könnten die Kontinente wieder zu einem **neuen Superkontinent** verschmelzen.', 64), gfx: { zukunft: {} } },
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
        cloud(g, 180, 300, 2)
      },
      wuerfel(g) {
        dashes(g, RR(80, 370, 200, 200, 2), { w: 1.6, d: 600 })
        cloud(g, 180, 520, 2.2)
        text(g, 180, 610, 'etwa 1 km³', { anchor: 'middle', cls: 's', d: 900 })
      },
      gramm(g) {
        ink(g, RR(110, 380, 140, 140, 4), { w: 2.6, t: 500 })
        text(g, 180, 560, '1 m³ Wolke', { anchor: 'middle', cls: 's', d: 400 })
        for (let i = 0; i < 6; i++) dot(g, 130 + (i % 3) * 50, 420 + Math.floor(i / 3) * 50, 3, 600 + i * 80)
        text(g, 180, 600, 'etwa 0,5 g Wasser', { anchor: 'middle', d: 1000 })
      },
      rechnung(g) {
        text(g, 180, 450, '500 Tonnen', { anchor: 'middle', size: 46, d: 200 })
        text(g, 180, 495, 'Wasser in einer kleinen Haufenwolke', { anchor: 'middle', cls: 's', d: 600 })
      },
      elefanten(g) {
        for (let i = 0; i < 10; i++) elephant(g, 50 + (i % 5) * 64, 440 + Math.floor(i / 5) * 90, 0.55, i * 80)
        text(g, 180, 640, 'so schwer wie rund 100 Elefanten', { anchor: 'middle', cls: 's', d: 1000 })
      },
      troepfchen(g) {
        ball(g, 110, 470, 6, { fill: 'dicht' })
        text(g, 110, 510, 'Wolkentröpfchen', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 110, 534, '≈ 0,01 mm', { anchor: 'middle', cls: 's', d: 400 })
        drop(g, 260, 460, 1.5, 500)
        text(g, 260, 534, 'Regentropfen ≈ 2 mm', { anchor: 'middle', cls: 's', d: 800 })
      },
      langsam(g) {
        ball(g, 180, 380, 8, { fill: 'dicht' })
        arrow(g, L([180, 400], [180, 440]), { w: 2, d: 400, t: 600, head: 8 })
        text(g, 180, 480, 'fällt etwa 1 cm pro Sekunde', { anchor: 'middle', cls: 's', d: 700 })
        for (const x of [90, 270]) arrow(g, L([x, 620], [x, 540]), { w: 2.6, d: 900, t: 400, head: 10 })
        text(g, 180, 600, 'Aufwind', { anchor: 'middle', d: 1100 })
      },
      luft(g) {
        hbars(g, [
          { label: 'Luft', v: 1000, fmt: () => '≈ 1 Mio. t', dense: true },
          { label: 'Wasser', v: 0.5, fmt: () => '≈ 500 t' },
        ], { x: 110, y: 400, w: 170, h: 40, gap: 80, max: 1000 })
        text(g, 180, 590, 'in einem Kubikkilometer Wolke', { anchor: 'middle', cls: 's', d: 1200 })
      },
      regen(g) {
        cloud(g, 180, 420, 1.6, 0, true)
        for (let i = 0; i < 6; i++) drop(g, 90 + i * 36, 480 + (i % 2) * 40, 0.6, 600 + i * 80, false)
        text(g, 180, 620, 'eine Million Tröpfchen → ein Tropfen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      gewitter(g) {
        const c: P[] = [...B([60, 580], [40, 520], [80, 480], [110, 470]), ...B([110, 470], [100, 380], [160, 330], [200, 360]).slice(1), ...B([200, 360], [240, 320], [300, 360], [290, 440]).slice(1), ...B([290, 440], [330, 470], [330, 560], [300, 580]).slice(1), [60, 580]]
        blank(g, c)
        hatch(g, c, 600, true)
        ink(g, c, { w: 3, t: 900 })
        text(g, 180, 640, 'Gewitterwolke: Millionen Tonnen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      weiss(g) {
        cloud(g, 110, 480, 1, 0)
        text(g, 110, 520, 'dünn: weiß', { anchor: 'middle', cls: 's', d: 400 })
        cloud(g, 260, 480, 1, 300, true)
        text(g, 260, 520, 'dick: grau', { anchor: 'middle', cls: 's', d: 700 })
      },
      ende(g) {
        cloud(g, 180, 520, 1.8)
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

/** Gemeinsame Küste Südamerika/Afrika (oberer Teil), relativ zur Mitte, von Nord nach Süd */
const COAST: [P, P, P, P][] = [
  [[0, -130], [-50, -100], [-50, -60], [-20, -40]],
  [[-20, -40], [20, -20], [40, 0], [10, 40]],
]

function coast(cx: number, cy: number, k: number, segs: [P, P, P, P][]): P[] {
  const out: P[] = []
  for (const [i, sg] of segs.entries()) {
    const p = sg.map(([a, b]) => [cx + a * k, cy + b * k] as P) as [P, P, P, P]
    out.push(...B(...p).slice(i ? 1 : 0))
  }
  return out
}

/** Südamerika; cx = x der Küste, die zu Afrika passt */
function samerika(g: Element, cx: number, cy: number, k: number, d = 0): void {
  const p = coast(cx, cy, k, [
    ...COAST,
    [[10, 40], [-10, 80], [-20, 110], [-30, 150]],
    [[-30, 150], [-40, 170], [-56, 160], [-66, 110]],
    [[-66, 110], [-100, 30], [-120, -60], [-80, -110]],
    [[-80, -110], [-60, -130], [-30, -136], [0, -130]],
  ])
  blank(g, p)
  hatch(g, p, d + 400)
  ink(g, p, { w: 2.6, d, t: 800 })
}

/** Afrika; cx = x der Küste, die zu Südamerika passt */
function afrika(g: Element, cx: number, cy: number, k: number, d = 0): void {
  const p = coast(cx, cy, k, [
    ...COAST,
    [[10, 40], [20, 90], [30, 140], [44, 160]],
    [[44, 160], [60, 150], [80, 100], [90, 60]],
    [[90, 60], [110, 20], [120, -40], [100, -90]],
    [[100, -90], [80, -140], [30, -150], [0, -130]],
  ])
  blank(g, p)
  hatch(g, p, d + 400, true)
  ink(g, p, { w: 2.6, d, t: 800 })
}

/** Elefant (klein, Füße auf y) */
function elephant(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = [...B(P(-40, -20), P(-40, -70), P(30, -70), P(30, -30)), ...B(P(30, -30), P(44, -40), P(54, -20), P(50, 0)).slice(1), ...L(P(50, 0), P(42, 0)).slice(1), ...B(P(42, 0), P(42, -14), P(36, -18), P(30, -18)).slice(1), ...L(P(30, -18), P(30, 0)).slice(1), ...L(P(30, 0), P(16, 0)).slice(1), ...L(P(16, 0), P(16, -16)).slice(1), ...L(P(16, -16), P(-24, -16)).slice(1), ...L(P(-24, -16), P(-24, 0)).slice(1), ...L(P(-24, 0), P(-38, 0)).slice(1), ...L(P(-38, 0), P(-40, -20)).slice(1)]
  blank(g, body)
  ink(g, body, { w: 2, d, t: 500 })
  ink(g, E(x + 18 * s, y - 50 * s, 10 * s, 14 * s), { w: 1.6, d: d + 300, t: 200 })
}
