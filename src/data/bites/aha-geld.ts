import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, check, coin, cross, crowd, dashes, fig, hatch, hbars, ink, mountain, question, rays, st, text, timeline, vbars, clock, type P } from './draw'
import { axes, ball, box, bullets, dot, drop, flame, carrow, house, pie, plot, rad, sun, waveP } from './kit'

// Wirtschaft & Geld: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Bankgebäude mit Säulen, Grundlinie y */
function bank(g: Element, cx: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  ink(g, [P(-90, -150), P(0, -200), P(90, -150), P(-90, -150)], { w: 3, d, t: 600 })
  ink(g, RR(cx - 90 * s, y - 150 * s, 180 * s, 16 * s, 2), { w: 2.4, d: d + 200, t: 400 })
  for (let k = 0; k < 4; k++) ink(g, RR(cx + (-70 + k * 40) * s, y - 128 * s, 20 * s, 116 * s, 3), { w: 2.2, d: d + 400 + k * 80, t: 300 })
  ink(g, RR(cx - 100 * s, y - 12 * s, 200 * s, 12 * s, 2), { w: 2.6, d: d + 300, t: 400 })
}

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

/** Schaf, Füße auf y */
function sheep(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  for (const k of [-12, 12]) ink(g, L(P(k, -10), P(k, 0)), { w: 2, d: d + 200, t: 100 })
  const body: P[] = []
  for (let i = 0; i <= 10; i++) {
    const a = rad(180 + i * 18)
    const r = 22 + (i % 2) * 4
    body.push(P(Math.cos(a) * r, -16 + Math.sin(a) * r * 0.6))
  }
  body.push(...B(P(22, -16), P(20, -4), P(-20, -4), P(-22, -16)).slice(1))
  blank(g, body)
  ink(g, body, { w: 2.2, d, t: 400 })
  blank(g, E(x + 26 * s, y - 22 * s, 7 * s, 6 * s))
  hatch(g, E(x + 26 * s, y - 22 * s, 7 * s, 6 * s), d + 300, true)
  ink(g, E(x + 26 * s, y - 22 * s, 7 * s, 6 * s), { w: 2, d: d + 200, t: 200 })
}

/** Eisstand mit Schirm, Boden bei y */
function stand(g: Element, x: number, y: number, label: string, d = 0): void {
  ink(g, RR(x - 22, y - 36, 44, 36, 4), { w: 2.4, d, t: 300 })
  ink(g, L([x, y - 36], [x, y - 64]), { w: 2, d: d + 200, t: 150 })
  ink(g, [...B([x - 30, y - 62], [x - 20, y - 80], [x + 20, y - 80], [x + 30, y - 62]), [x - 30, y - 62]], { w: 2.4, d: d + 300, t: 300 })
  text(g, x, y - 12, label, { anchor: 'middle', cls: 's', d: d + 400 })
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

export const AHA_GELD: Bite[] = [
  {
    id: 'giralgeld',
    area: 'WIRT',
    day: 28,
    hook: 'Woher kommt eigentlich das Geld auf deinem Konto?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [img('geldscheine')],
    draw: {
      bankbild(g) {
        bank(g, 180, 400, 1.2)
        coin(g, 60, 150, 26, '€', 900)
      },
      lager(g) {
        bank(g, 120, 600, 0.9)
        stack(g, 270, 600, 8, 700)
        text(g, 180, 380, 'ein Lager voller Münzen?', { anchor: 'middle', cls: 's', d: 1000 })
        question(g, 300, 470, 0.7, 1200)
      },
      kredit(g) {
        ink(g, RR(60, 360, 240, 150, 10), { w: 3, t: 700 })
        ink(g, RR(80, 380, 200, 90, 6), { w: 2, d: 300, t: 500 })
        text(g, 180, 434, '+ 10.000 €', { anchor: 'middle', size: 26, d: 900 })
        ink(g, RR(110, 530, 140, 40, 6), { w: 2.4, d: 500, t: 300 })
        for (let i = 0; i < 6; i++) ink(g, RR(118 + i * 22, 538, 16, 10, 2), { w: 1.4, d: 700 + i * 40, t: 80 })
        text(g, 180, 630, 'Kredit: per Tastendruck aufs Konto', { anchor: 'middle', cls: 's', d: 1200 })
      },
      neu(g) {
        crowd(g, 50, 600, 6, 52, 2.4, 0, 80)
        for (let i = 0; i < 6; i++) check(g, 50 + i * 52, 640, 0.5, 700 + i * 60)
        text(g, 180, 400, 'kein Sparer hat weniger', { anchor: 'middle', cls: 's', d: 1100 })
      },
      anteil(g) {
        pie(g, 180, 460, 110, 0.9)
        text(g, 180, 610, 'Geld auf Konten ≈ 90 %', { anchor: 'middle', d: 1100 })
        text(g, 180, 636, 'Bargeld ≈ 10 %', { anchor: 'middle', cls: 's', d: 1300 })
      },
      tilgung(g) {
        ink(g, RR(60, 380, 240, 120, 10), { w: 3, t: 700 })
        text(g, 180, 450, '− 10.000 €', { anchor: 'middle', size: 26, d: 600 })
        text(g, 180, 580, 'zurückgezahlt: Geld verschwindet', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zentralbanken(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '2014', sub: 'Bank of England', up: true },
          { at: 0.65, label: '2017', sub: 'Bundesbank' },
        ])
      },
      grenzen(g) {
        bullets(g, 50, 380, ['Kredit kann ausfallen', 'Eigenkapital nötig', 'Reserven bei der Zentralbank', 'Leitzins macht Kredit teurer'], { gap: 50, size: 18 })
      },
      leitzins(g) {
        ink(g, E(180, 470, 100), { w: 3, t: 800 })
        for (let k = 0; k <= 8; k++) {
          const a = rad(150 + k * 30)
          ink(g, L([180 + Math.cos(a) * 84, 470 + Math.sin(a) * 84], [180 + Math.cos(a) * 96, 470 + Math.sin(a) * 96]), { w: 2, d: 300 + k * 40, t: 100 })
        }
        const n = st(g, 'm1', '--m1: rotate(70deg); transform-origin: 180px 470px; transition-duration: 1.6s')
        ink(n, L([180, 470], [180 + Math.cos(rad(220)) * 76, 470 + Math.sin(rad(220)) * 76]), { w: 4, d: 700, t: 300 })
        ball(g, 180, 470, 10, { d: 600, fill: 'dicht', t: 200 })
        text(g, 80, 610, 'Zins tief', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 280, 610, 'Zins hoch', { anchor: 'middle', cls: 's', d: 1000 })
      },
      inflation(g) {
        for (let i = 0; i < 5; i++) note(g, 40 + i * 14, 380 + i * 14, 120, i === 4 ? '€' : '', i * 120, 14)
        arrow(g, L([200, 440], [250, 440]), { w: 2.6, d: 900, t: 300, head: 9 })
        text(g, 300, 450, 'Preise ↑', { anchor: 'middle', size: 20, d: 1100 })
      },
      sturm(g) {
        bank(g, 180, 480, 0.8)
        crowd(g, 30, 620, 9, 36, 2.2, 600, 60)
        text(g, 180, 300, 'alle wollen gleichzeitig Bargeld', { anchor: 'middle', cls: 's', d: 1100 })
      },
      sicherung(g) {
        const sh: P[] = [[180, 360], [270, 390], [260, 510], [180, 580], [100, 510], [90, 390], [180, 360]]
        hatch(g, sh, 600)
        ink(g, sh, { w: 3.2, t: 900 })
        text(g, 180, 640, 'bis 100.000 € pro Person und Bank', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gold(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: 'bis 1971', sub: 'Dollar in Gold tauschbar', up: true },
          { at: 0.85, label: 'heute', sub: 'Geld durch Vertrauen', up: true },
        ])
      },
      ende(g) {
        ink(g, RR(110, 470, 140, 50, 8), { w: 3, t: 600 })
        for (let i = 0; i < 5; i++) ink(g, RR(118 + i * 26, 480, 20, 12, 2), { w: 1.6, d: 400 + i * 50, t: 80 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
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
      { t: T('Überweist du Geld zu einer anderen Bank, gleichen die Banken das untereinander mit **Zentralbankgeld** aus.', 64), gfx: { zentralbanken: {} } },
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
    images: [img('sparschwein')],
    draw: {
      stapel(g) {
        stack(g, 80, 400, 3, 0)
        stack(g, 180, 400, 8, 400)
        stack(g, 280, 400, 22, 800)
      },
      start(g) {
        note(g, 90, 400, 180, '100 €', 0, 22)
        text(g, 180, 560, '7 % Zinsen pro Jahr', { anchor: 'middle', size: 20, d: 800 })
      },
      jahr1(g) {
        note(g, 40, 420, 120, '100 €', 0, 16)
        arrow(g, L([170, 450], [200, 450]), { w: 2.4, d: 500, t: 300, head: 9 })
        note(g, 210, 420, 120, '107 €', 700, 16)
        text(g, 180, 580, 'nächstes Jahr: 7 % von 107', { anchor: 'middle', cls: 's', d: 1100 })
      },
      kurve(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Jahre', yl: 'Euro' })
        plot(g, 46, 596, 270, 250, (t) => (Math.pow(1.07, t * 35) - 1) / (Math.pow(1.07, 35) - 1), { d: 400 })
        for (const [yr, v] of [[10, 197], [20, 387], [30, 761], [35, 1068]] as const) {
          const x = 46 + (yr / 35) * 270
          const y = 596 - ((v - 100) / 968) * 250
          dot(g, x, y, 4.5, 1200 + yr * 30)
          text(g, x - 8, y - 10, `${v} €`, { anchor: 'end', cls: 's', d: 1300 + yr * 30 })
        }
      },
      regel(g) {
        hbars(g, [
          { label: '2 % Zins', v: 36, fmt: (v) => `${Math.round(v)} Jahre` },
          { label: '7 % Zins', v: 10, fmt: (v) => `${Math.round(v)} Jahre` },
          { label: '10 % Zins', v: 7, fmt: (v) => `${Math.round(v)} Jahre`, dense: true },
        ], { y: 340, gap: 100 })
        text(g, 30, 640, 'bis zur Verdopplung', { cls: 's', d: 1400 })
      },
      anna(g) {
        timeline(g, 30, 330, 420, [
          { at: 0, label: '25', up: true },
          { at: 0.25, label: '35', up: true },
          { at: 1, label: '65', up: true },
        ], 0, 300)
        hatch(g, RR(30, 440, 71, 18, 4), 900, true)
        ink(g, RR(30, 440, 71, 18, 4), { w: 2, d: 800, t: 300 })
        text(g, 110, 454, 'Anna zahlt ein', { cls: 's', d: 1000 })
        hatch(g, RR(101, 520, 213, 18, 4), 1200)
        ink(g, RR(101, 520, 213, 18, 4), { w: 2, d: 1100, t: 400 })
        text(g, 101, 510, 'Ben zahlt ein', { cls: 's', d: 1300 })
      },
      ergebnis(g) {
        vbars(g, [
          { label: 'Anna (20.000 €)', v: 225, fmt: (v) => `${Math.round(v)}.000 €` },
          { label: 'Ben (60.000 €)', v: 202, fmt: (v) => `${Math.round(v)}.000 €`, dense: true },
        ], { x: 80, base: 600, w: 70, gap: 130, h: 250 })
        text(g, 180, 320, 'Wert mit 65, bei 7 %', { anchor: 'middle', cls: 's', d: 1200 })
      },
      schulden(g) {
        note(g, 90, 400, 180, '− 1.000 €', 0, 20)
        text(g, 180, 560, 'Dispo 12 %: doppelt in ≈ 6 Jahren', { anchor: 'middle', cls: 's', d: 900 })
      },
      kaufkraft(g) {
        note(g, 40, 420, 120, '100 €', 0, 16)
        arrow(g, L([170, 450], [200, 450]), { w: 2.4, d: 500, t: 300, head: 9 })
        note(g, 230, 435, 80, '50 €', 700, 12)
        text(g, 180, 580, '2 % Inflation: Kaufkraft halb in ≈ 36 Jahren', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gebuehr(g) {
        vbars(g, [
          { label: '0,2 % Kosten', v: 100, fmt: () => '' },
          { label: '2 % Kosten', v: 58, fmt: () => 'deutlich weniger', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 240 })
        text(g, 180, 320, 'gleicher Ertrag, nach 30 Jahren', { anchor: 'middle', cls: 's', d: 1200 })
      },
      risiko(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Jahre', yl: 'Wert' })
        ink(g, [[46, 560], [80, 520], [110, 540], [140, 470], [170, 500], [200, 420], [230, 460], [260, 390], [290, 400], [320, 350]], { w: 2.6, d: 400, t: 1200 })
        text(g, 180, 650, 'mehr Rendite heißt mehr Schwankung', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        stack(g, 120, 600, 4)
        stack(g, 240, 600, 14, 400)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Du legst 100 Euro an, zu **7 Prozent** Zinsen im Jahr – und rührst sie nicht an.', 64), gfx: { start: {} } },
      { t: T('Nach einem Jahr hast du 107 Euro. Im nächsten Jahr gibt es Zinsen **auf die 107** – nicht nur auf die 100.', 64), gfx: { jahr1: {} } },
      { t: T('Das sind die **Zinseszinsen**: Zinsen auf Zinsen. Am Anfang kaum spürbar – ein paar Cent mehr.', 64), gfx: { jahr1: {} } },
      { t: T('Nach 10 Jahren hast du knapp **200 Euro**. Das Geld hat sich verdoppelt.', 64), gfx: { kurve: {} } },
      { t: T('Nach 20 Jahren rund **390 Euro**, nach 30 Jahren rund 760 Euro.', 64), gfx: { kurve: {} } },
      { t: T('Nach 35 Jahren über **1.000 Euro**. Aus 100 wurde das Zehnfache – ohne einen Cent dazuzulegen.', 64), gfx: { kurve: {} } },
      { t: T('Eine Faustregel ist die **72er-Regel**: 72 geteilt durch den Zinssatz ergibt die Jahre bis zur Verdopplung.', 64), gfx: { f1: { draw: 'formel', args: [['72', '÷', 'Zinssatz', '≈', 'Jahre bis zur Verdopplung'], 340] } } },
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
    images: [img('simbabwe-schein'), img('inflation-1923')],
    draw: {
      schein(g) {
        note(g, 30, 160, 300, '100 Billionen $', 0, 20)
      },
      presse(g) {
        ink(g, RR(80, 380, 200, 120, 10), { w: 3, t: 700 })
        for (const x of [130, 230]) ball(g, x, 440, 30, { d: 300, w: 2.6 })
        for (let i = 0; i < 4; i++) note(g, 120 + i * 18, 520 + i * 18, 110, i === 3 ? '€' : '', 800 + i * 150, 12)
      },
      waren(g) {
        for (let i = 0; i < 4; i++) ink(g, RR(40 + i * 40, 520, 32, 32, 4), { w: 2.2, d: i * 100, t: 200 })
        text(g, 100, 590, 'gleich viele Waren', { anchor: 'middle', cls: 's', d: 600 })
        for (let i = 0; i < 12; i++) note(g, 220 + (i % 3) * 30, 380 + Math.floor(i / 3) * 40, 60, '', 400 + i * 60, 10)
        text(g, 270, 590, 'viel mehr Geld', { anchor: 'middle', cls: 's', d: 1200 })
      },
      schild(g) {
        ink(g, RR(80, 380, 200, 120, 8), { w: 3, t: 600 })
        text(g, 180, 430, 'Brot', { anchor: 'middle', d: 300 })
        const p1 = st(g, 'h1')
        text(p1, 180, 474, '1 Mio.', { anchor: 'middle', size: 22, d: 500 })
        const p2 = st(g, 'f1', '--dl: 400ms')
        text(p2, 180, 474, '3 Mio.', { anchor: 'middle', size: 22, fade: false })
        clock(g, 180, 590, 40, 90, 180, 700)
      },
      rekord(g) {
        text(g, 180, 450, '79,6 Mrd. %', { anchor: 'middle', size: 44, d: 200 })
        text(g, 180, 500, 'Inflation im Monat, November 2008', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 180, 560, 'Preise verdoppelten sich etwa täglich', { anchor: 'middle', cls: 's', d: 1000 })
      },
      dollar(g) {
        note(g, 40, 380, 130, 'Z$', 0, 16)
        cross(g, 105, 470, 1, 600)
        note(g, 190, 380, 130, 'US$', 400, 16)
        check(g, 255, 470, 1, 900)
        text(g, 180, 580, '2009: eigene Währung aufgegeben', { anchor: 'middle', cls: 's', d: 1100 })
      },
      berlin(g) {
        const loaf: P[] = [...B([80, 520], [80, 430], [280, 430], [280, 520]), [80, 520]]
        hatch(g, loaf, 600)
        ink(g, loaf, { w: 3, t: 700 })
        text(g, 180, 590, 'Berlin, November 1923', { anchor: 'middle', d: 800 })
        text(g, 180, 620, 'ein Brot: über 200 Milliarden Mark', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ezb(g) {
        bank(g, 180, 580, 1)
        text(g, 180, 640, 'Auftrag: stabile Preise', { anchor: 'middle', d: 900 })
      },
      zwei(g) {
        text(g, 180, 470, '≈ 2 %', { anchor: 'middle', size: 70, d: 200 })
        text(g, 180, 520, 'Ziel der EZB pro Jahr', { anchor: 'middle', cls: 's', d: 600 })
      },
      deflation(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Zeit', yl: 'Preise' })
        plot(g, 46, 596, 270, 200, (t) => 0.8 - t * 0.6, { d: 400 })
        fig(g, 250, 590, 2, { d: 900, arms: 'cross' })
        text(g, 180, 650, 'man wartet mit Käufen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      vertrauen(g) {
        note(g, 90, 410, 180, '100 €', 0, 22)
        text(g, 180, 560, 'Papier – wertvoll durch Vertrauen', { anchor: 'middle', cls: 's', d: 900 })
      },
      unabhaengig(g) {
        bank(g, 110, 600, 0.7)
        ink(g, RR(230, 470, 100, 130, 6), { w: 2.8, d: 300, t: 500 })
        text(g, 280, 540, 'Regierung', { anchor: 'middle', cls: 's', d: 600 })
        ink(g, L([190, 440], [190, 600]), { w: 3, d: 900, t: 400 })
        text(g, 180, 650, 'getrennt: unabhängige Notenbank', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        for (let i = 0; i < 4; i++) note(g, 80 + i * 20, 430 + i * 20, 160, i === 3 ? '€' : '', i * 150, 14)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { schein: {} } },
      { t: T('Eine verlockende Idee: Der Staat braucht Geld? Dann **druckt** er eben welches!', 64), gfx: { presse: {} } },
      { t: T('Simbabwe tat genau das. Ab den 2000er-Jahren ließ die Regierung immer mehr Geld drucken, um ihre **Ausgaben** zu bezahlen.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Simbabwe-Dollar bis 100 Billionen' } } },
      { t: T('Die Waren im Land wurden aber nicht mehr – die Wirtschaft schrumpfte sogar. Nur das **Geld** wurde mehr.', 64), gfx: { waren: {} } },
      { t: T('Mehr Geld jagt dieselben Waren. Also steigen die **Preise**.', 64), gfx: { f1: { draw: 'formel', args: [['mehr Geld', '+', 'gleich viele Waren', '→', 'höhere Preise'], 360] } } },
      { t: T('Händler mussten ihre Preisschilder **mehrmals am Tag** ändern. Wer Lohn bekam, rannte sofort einkaufen.', 64), gfx: { schild: { cls: 'a1' } } },
      { t: T('Im November 2008 lag die Inflation bei geschätzt **79,6 Milliarden** Prozent im Monat. Preise verdoppelten sich etwa jeden Tag.', 64), gfx: { rekord: {} } },
      { t: T('Die Notenbank druckte schließlich einen Schein über **100 Billionen** Dollar. Er war bald fast nichts mehr wert.', 64), gfx: { schein: { tf: [1, 0, 260] } } },
      { t: T('Das nennt man **Hyperinflation**: Geld verliert so schnell an Wert, dass es niemand mehr behalten will.', 64), gfx: { rekord: {} } },
      { t: T('Wer Schulden hatte, freute sich: Sie schmolzen **dahin**. Wer gespart hatte, verlor alles.', 64), gfx: { rekord: {} } },
      { t: T('Die Menschen tauschten Waren oder nutzten **US-Dollar**. 2009 gab Simbabwe die eigene Währung auf.', 64), gfx: { dollar: {} } },
      { t: T('Deutschland kennt das: Im November 1923 kostete ein Brot in Berlin über **200 Milliarden** Mark.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Zehn Milliarden Mark, 1923' } } },
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
    images: [img('schafe-weide'), img('ostrom'), img('kabeljau')],
    draw: {
      weide(g) {
        ink(g, B([20, 400], [120, 380], [240, 390], [340, 380]), { w: 3, t: 700 })
        for (const [x, y, d] of [[70, 360, 300], [160, 340, 500], [250, 370, 700], [110, 250, 900], [220, 230, 1100]] as const) sheep(g, x, y, 1.1, d)
      },
      dorf(g) {
        ink(g, B([20, 600], [120, 580], [240, 590], [340, 580]), { w: 3, t: 700 })
        for (let i = 0; i < 4; i++) house(g, 30 + i * 80, 400, 50, i * 150)
        text(g, 180, 640, 'die Weide gehört allen', { anchor: 'middle', cls: 's', d: 900 })
        for (let i = 0; i < 4; i++) sheep(g, 60 + i * 70, 560, 0.9, 900 + i * 100)
      },
      gewinn(g) {
        sheep(g, 90, 500, 1.6)
        text(g, 90, 560, 'Gewinn: ganz meiner', { anchor: 'middle', cls: 's', d: 600 })
        ink(g, B([200, 500], [240, 490], [290, 495], [330, 490]), { w: 2.4, d: 300, t: 500 })
        for (let i = 0; i < 6; i++) ink(g, L([210 + i * 20, 498], [212 + i * 20, 486]), { w: 1.4, d: 700 + i * 50, t: 80 })
        text(g, 265, 560, 'Kosten: auf alle verteilt', { anchor: 'middle', cls: 's', d: 900 })
      },
      mehr(g) {
        ink(g, B([20, 600], [120, 580], [240, 590], [340, 580]), { w: 3, t: 700 })
        for (let i = 0; i < 12; i++) sheep(g, 40 + (i % 6) * 54, 480 + Math.floor(i / 6) * 60, 0.8, i * 120)
      },
      kahl(g) {
        ink(g, B([20, 600], [120, 580], [240, 590], [340, 580]), { w: 3, t: 700 })
        for (let i = 0; i < 4; i++) dashes(g, L([40 + i * 80, 570], [80 + i * 80, 566]), { w: 1.4, d: 500 })
        for (let i = 0; i < 3; i++) sheep(g, 90 + i * 90, 520, 0.9, 700 + i * 100)
        text(g, 180, 400, 'kahl – alle verlieren', { anchor: 'middle', d: 1100 })
      },
      hardin(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1968', sub: 'Garrett Hardin, Science', up: true }])
      },
      meer(g) {
        for (const [y, d] of [[380, 0], [420, 100]] as const) ink(g, waveP(20, 340, y, 6, 60, y / 30), { w: 2.2, d, t: 700 })
        ink(g, [[100, 380], [120, 340], [200, 340], [230, 380]], { w: 2.6, d: 300, t: 400 })
        for (let i = 0; i < 4; i++) dashes(g, L([110 + i * 36, 400], [110 + i * 36, 560]), { w: 1.2, d: 600 })
        const fish = (x: number, y: number, d: number) => ink(g, [...B([x, y], [x + 10, y - 10], [x + 26, y - 10], [x + 34, y]), ...B([x + 34, y], [x + 26, y + 10], [x + 10, y + 10], [x, y]).slice(1), [x - 8, y - 8], [x - 8, y + 8], [x, y]], { w: 1.8, d, t: 200 })
        fish(60, 600, 1000)
        fish(250, 620, 1100)
        text(g, 180, 660, 'Überfischung', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kabeljau(g) {
        axes(g, 40, 600, 330, 330, { xl: 'Jahre', yl: 'Bestand' })
        plot(g, 46, 596, 270, 240, (t) => (t < 0.55 ? 0.9 - t * 0.6 : t < 0.65 ? 0.57 - (t - 0.55) * 5 : 0.07), { d: 400 })
        text(g, 46 + 0.6 * 270, 380, '1992', { anchor: 'middle', d: 1300 })
      },
      ostrom(g) {
        text(g, 180, 430, 'Elinor Ostrom', { anchor: 'middle', size: 30, d: 200 })
        text(g, 180, 470, 'Wirtschafts-Nobelpreis 2009', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 180, 495, 'als erste Frau', { anchor: 'middle', cls: 's', d: 800 })
      },
      alm(g) {
        mountain(g, 30, 330, 560, [180, 360])
        for (let i = 0; i < 3; i++) sheep(g, 110 + i * 60, 600, 0.8, 900 + i * 100)
        ink(g, L([20, 604], [340, 604]), { w: 2.6, d: 300, t: 500 })
        text(g, 180, 650, 'Almen in der Schweiz: seit Jahrhunderten', { anchor: 'middle', cls: 's', d: 1300 })
      },
      regeln(g) {
        bullets(g, 40, 360, ['klare Grenzen', 'gemeinsame Regeln', 'gegenseitige Kontrolle', 'Strafen, die steigen', 'Nutzer reden mit'], { gap: 48, size: 18 })
      },
      werkzeuge(g) {
        bullets(g, 40, 380, ['Fangquoten', 'Emissionshandel', 'Parkgebühren', 'Wasserrechte'], { gap: 50, size: 19 })
      },
      kueche(g) {
        ink(g, RR(60, 460, 240, 30, 4), { w: 3, t: 600 })
        for (let i = 0; i < 5; i++) ink(g, E(100 + i * 40, 440 - (i % 2) * 14, 18, 6), { w: 2, d: 400 + i * 100, t: 200 })
        question(g, 180, 380, 0.8, 1000)
        text(g, 180, 560, 'die WG-Küche', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        for (let i = 0; i < 3; i++) sheep(g, 100 + i * 80, 560, 1.1, i * 200)
        ink(g, L([40, 564], [320, 564]), { w: 2.6, t: 500 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein Dorf hat eine gemeinsame Weide, die **Allmende**. Jede Familie darf ihre Schafe darauf grasen lassen.', 64), gfx: { dorf: {} } },
      { t: T('Jedes zusätzliche Schaf bringt seinem Besitzer den **ganzen Gewinn**: Wolle, Milch, Fleisch.', 64), gfx: { gewinn: {} } },
      { t: T('Die Kosten – weniger Gras für alle – **verteilen sich** auf das ganze Dorf.', 64), gfx: { gewinn: {} } },
      { t: T('Für jeden Einzelnen lohnt es sich also, noch ein Schaf mehr zu halten. Und **noch eins**.', 64), gfx: { mehr: {} } },
      { t: T('Bis die Weide **kahl gefressen** ist. Dann verlieren alle – auch die, die vernünftig waren.', 64), gfx: { kahl: {} } },
      { t: T('Niemand war böse oder dumm. Jeder hat für sich **vernünftig** gehandelt – und gemeinsam ist das Ergebnis schlecht.', 64), gfx: { kahl: {} } },
      { t: T('Das ist die **Tragik der Allmende**. Der Biologe Garrett Hardin machte sie 1968 berühmt.', 64), gfx: { hardin: {} } },
      { t: T('Heute steckt sie überall: in **überfischten** Meeren, verstopften Straßen, in der Atmosphäre als Ablage für CO₂.', 64), gfx: { meer: {} } },
      { t: T('Vor Neufundland brachen 1992 die Kabeljau-Bestände zusammen – nach Jahrzehnten der Überfischung. Sie haben sich bis heute **kaum erholt**.', 64), pics: { p2: { img: 2, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Das Problem: Jeder Fisch, den ein Boot nicht fängt, holt sich ein **anderes** Boot. Verzicht lohnt sich allein nicht.', 64), gfx: { meer: {} } },
      { t: T('Hardin sah zwei Auswege: alles **privatisieren** – oder der Staat regelt es von oben.', 64), gfx: { dorf: {} } },
      { t: T('Die Ökonomin **Elinor Ostrom** fand einen dritten Weg – und bekam dafür 2009 als erste Frau den Wirtschafts-Nobelpreis.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Elinor Ostrom' } } },
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
    images: [img('eisstand')],
    draw: {
      laeden(g) {
        ink(g, L([20, 400], [340, 400]), { w: 3, t: 500 })
        house(g, 100, 398, 70, 200)
        house(g, 190, 398, 70, 400)
        text(g, 135, 436, 'A', { anchor: 'middle', d: 800 })
        text(g, 225, 436, 'B', { anchor: 'middle', d: 900 })
      },
      strand(g) {
        ink(g, waveP(20, 340, 600, 5, 50), { w: 2.2, t: 700 })
        ink(g, L([30, 560], [330, 560]), { w: 3, d: 200, t: 500 })
        for (let i = 0; i < 12; i++) dot(g, 42 + i * 25, 540, 4, 600 + i * 40)
        text(g, 180, 500, '1 Kilometer Strand', { anchor: 'middle', cls: 's', d: 1000 })
      },
      optimal(g) {
        ink(g, L([30, 560], [330, 560]), { w: 3, t: 500 })
        for (let i = 0; i < 12; i++) dot(g, 42 + i * 25, 540, 4, 200 + i * 30)
        stand(g, 105, 520, 'A', 600)
        stand(g, 255, 520, 'B', 700)
        dashes(g, L([180, 470], [180, 600]), { w: 1.4, d: 900 })
        text(g, 180, 640, 'höchstens 250 m Weg', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ruecken(g) {
        ink(g, L([30, 560], [330, 560]), { w: 3, t: 500 })
        for (let i = 0; i < 12; i++) dot(g, 42 + i * 25, 540, 4, 200 + i * 30)
        const a = st(g, 'm1', '--m1: translateX(42px); transition-duration: 1.8s')
        stand(a, 105, 520, 'A', 600)
        const b = st(g, 'm1', '--m1: translateX(-42px); transition-duration: 1.8s; --dl: 400ms')
        stand(b, 255, 520, 'B', 700)
        text(st(g, 'f1', '--dl: 1600ms'), 180, 640, 'bis zu 500 m Weg', { anchor: 'middle', cls: 's', fade: false })
      },
      hotelling(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: '1929', sub: 'Harold Hotelling', up: true }])
      },
      tanke(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        for (let i = 0; i < 3; i++) {
          const x = 50 + i * 100
          ink(g, RR(x, 500, 60, 100, 4), { w: 2.4, d: 200 + i * 200, t: 300 })
          ink(g, RR(x + 10, 516, 40, 24, 3), { w: 1.6, d: 400 + i * 200, t: 200 })
        }
        text(g, 180, 460, 'Tankstellen, Burger, Handyläden', { anchor: 'middle', cls: 's', d: 1000 })
      },
      vergleichen(g) {
        fig(g, 180, 600, 4)
        for (const x of [70, 290]) ink(g, RR(x - 40, 430, 80, 90, 6), { w: 2.4, d: 400, t: 300 })
        for (const [a, b] of [[[160, 480], [116, 476]], [[200, 480], [244, 476]]] as const) arrow(g, L(a as P, b as P), { w: 2, d: 800, t: 200, head: 7 })
        text(g, 180, 650, 'leicht vergleichen, alles an einem Ort', { anchor: 'middle', cls: 's', d: 1000 })
      },
      parteien(g) {
        axes(g, 30, 600, 330, 360)
        plot(g, 36, 596, 288, 200, (t) => Math.exp(-Math.pow((t - 0.5) / 0.18, 2)), { d: 400 })
        text(g, 60, 628, 'links', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 180, 628, 'Mitte', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 300, 628, 'rechts', { anchor: 'middle', cls: 's', d: 1000 })
        ball(g, 160, 360, 10, { d: 1200, fill: 'dicht', t: 200 })
        ball(g, 200, 360, 10, { d: 1300, t: 200 })
      },
      gleich(g) {
        for (let i = 0; i < 3; i++) ink(g, RR(60 + i * 90, 400, 60, 120, 12), { w: 2.6, d: i * 200, t: 400 })
        text(g, 180, 580, 'alle zielen auf die Mitte', { anchor: 'middle', cls: 's', d: 900 })
      },
      luecke(g) {
        ink(g, L([30, 560], [330, 560]), { w: 3, t: 500 })
        stand(g, 147, 520, 'A', 300)
        stand(g, 213, 520, 'B', 400)
        stand(g, 60, 520, 'C', 900)
        text(g, 60, 600, 'besetzt die Lücke', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        ink(g, L([30, 560], [330, 560]), { w: 3, t: 500 })
        stand(g, 147, 520, 'A', 300)
        stand(g, 213, 520, 'B', 400)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
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
    images: [img('containerhafen'), img('ricardo'), img('chirurgen')],
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
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Stell dir eine Chirurgin und ihren Assistenten vor. Sie operiert besser – und tippt ihre Berichte sogar **schneller** als er.', 64), pics: { p2: { img: 2, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Soll sie ihre Berichte also selbst tippen? **Nein**.', 64), gfx: { chirurgin: {} } },
      { t: T('In der Stunde, in der sie tippt, könnte sie operieren. Das ist viel **wertvoller**. Das Tippen kostet sie eigentlich eine Operation.', 64), gfx: { stunde: {} } },
      { t: T('Diese Kosten nennt man **Opportunitätskosten**: das, was du aufgibst, wenn du etwas anderes tust.', 64), gfx: { stunde: {} } },
      { t: T('Der Assistent tippt langsamer – aber er gibt dabei **wenig** auf, er kann ja nicht operieren.', 64), gfx: { verteilung: {} } },
      { t: T('Teilen sie die Arbeit danach auf, was jeden **am wenigsten kostet**, schaffen beide zusammen mehr.', 64), gfx: { verteilung: {} } },
      { t: T('Das ist der **komparative Vorteil**. Der Ökonom David Ricardo beschrieb ihn 1817.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 30, 1.1], cam2: [50, 30, 1.25], cap: 'David Ricardo' } } },
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
    images: [img('dampfmaschine'), img('jevons')],
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
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('England, 1865: Der Ökonom William Stanley Jevons bemerkte etwas Seltsames an der wichtigsten Maschine seiner Zeit.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [45, 35, 1.05], cam2: [45, 35, 1.2], cap: 'William Stanley Jevons' } } },
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
    images: [img('diamant'), img('adam-smith')],
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
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Schon Adam Smith wunderte sich 1776: Wasser ist **unverzichtbar**, aber fast nichts wert. Ein Diamant ist nutzlos – und kostet ein Vermögen.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 30, 1.05], cam2: [50, 30, 1.2], cap: 'Adam Smith' } } },
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
