import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, cross, crowd, dashes, eye, fig, hatch, hbars, ink, mountain, question, rays, st, text, timeline, type P } from './draw'
import { ball, box, bullets, carrow, dot, waveP } from './kit'

// Sprache, Mythen, Kunst & Musik: Überraschendes hinter Bekanntem, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Ochsenkopf / A: Spitze unten (Ochse) – als Gruppe drehbar */
function oxA(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  ink(g, [P(-40, -50), P(0, 50), P(40, -50)], { w: 3.4, d, t: 600 })
  ink(g, L(P(-22, -5), P(22, -5)), { w: 3, d: d + 400, t: 300 })
  for (const k of [-1, 1]) ink(g, B(P(40 * k, -50), P(52 * k, -62), P(58 * k, -78), P(50 * k, -92)), { w: 2.6, d: d + 600, t: 300 })
}

/** Münze mit Schrift */
function bigCoin(g: Element, cx: number, cy: number, r: number, label: string, d = 0, dense = false): void {
  blank(g, E(cx, cy, r))
  hatch(g, E(cx, cy, r * 0.82), d + 400, dense)
  ink(g, E(cx, cy, r), { w: 3, d, t: 700 })
  ink(g, E(cx, cy, r * 0.82), { w: 1.6, d: d + 300, t: 600 })
  blank(g, RR(cx - r * 0.7, cy - 14, r * 1.4, 26, 6))
  text(g, cx, cy + 6, label, { anchor: 'middle', size: Math.min(18, (r * 2.2) / label.length), d: d + 500 })
}

/** Krug (Pithos), Boden bei y */
function jar(g: Element, cx: number, y: number, s = 1, d = 0, open = false): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  const p: P[] = [...B(P(-20, 0), P(-60, -40), P(-60, -110), P(-26, -130)), P(-26, -142), P(26, -142), P(26, -130), ...B(P(26, -130), P(60, -110), P(60, -40), P(20, 0)), P(-20, 0)]
  blank(g, p)
  ink(g, p, { w: 2.8, d, t: 800 })
  for (const yy of [-70, -90]) ink(g, B(P(-56, yy), P(-20, yy + 8), P(20, yy + 8), P(56, yy)), { w: 1.4, d: d + 400, t: 400 })
  if (!open) ink(g, RR(cx - 32 * s, y - 154 * s, 64 * s, 12 * s, 4), { w: 2.4, d: d + 500, t: 300 })
}

/** Holzpferd auf Rädern, Räder auf y */
function horse(g: Element, cx: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  ink(g, RR(cx - 80 * s, y - 24 * s, 160 * s, 10 * s, 3), { w: 2.4, d, t: 400 })
  for (const k of [-60, -20, 20, 60]) ball(g, cx + k * s, y - 6 * s, 9 * s, { d: d + 200, t: 200, w: 2 })
  for (const k of [-50, -26, 26, 50]) ink(g, L(P(k, -24), P(k, -70)), { w: 2.6, d: d + 300, t: 200 })
  const body: P[] = RR(cx - 60 * s, y - 120 * s, 120 * s, 50 * s, 18 * s)
  blank(g, body)
  hatch(g, body, d + 700)
  ink(g, body, { w: 2.8, d: d + 400, t: 500 })
  const neck: P[] = [P(36, -116), P(56, -170), P(90, -176), P(96, -156), P(70, -150), P(58, -112)]
  blank(g, [...neck, P(36, -116)])
  ink(g, neck, { w: 2.8, d: d + 600, t: 400 })
  ink(g, B(P(-60, -100), P(-80, -96), P(-86, -80), P(-80, -66)), { w: 2.2, d: d + 800, t: 300 })
  dot(g, cx + 80 * s, y - 164 * s, 2.5 * s, d + 900)
}

/** Saite zwischen zwei Stegen, schwingend (Amplitude amp, Bäuche n) */
function string(g: Element, x0: number, x1: number, y: number, n: number, amp: number, d = 0): void {
  for (const x of [x0, x1]) ink(g, [[x - 8, y + 12], [x, y], [x + 8, y + 12]], { w: 2.4, d, t: 200 })
  for (const sgn of [1, -1]) {
    const pts: P[] = []
    for (let i = 0; i <= 60; i++) {
      const t = i / 60
      pts.push([x0 + (x1 - x0) * t, y + sgn * amp * Math.sin(Math.PI * n * t)])
    }
    ink(g, pts, { w: sgn > 0 ? 2.4 : 1.2, d: d + 300, t: 700 })
  }
}

/** Spitzbogen-Fenster, Unterkante y */
function lancet(g: Element, cx: number, y: number, w: number, h: number, d = 0, fill = false): void {
  const p: P[] = [[cx - w / 2, y], [cx - w / 2, y - h + w * 0.8], ...B([cx - w / 2, y - h + w * 0.8], [cx - w / 2, y - h + w * 0.2], [cx - w * 0.1, y - h + 4], [cx, y - h]).slice(1), ...B([cx, y - h], [cx + w * 0.1, y - h + 4], [cx + w / 2, y - h + w * 0.2], [cx + w / 2, y - h + w * 0.8]).slice(1), [cx + w / 2, y], [cx - w / 2, y]]
  if (fill) hatch(g, p, d + 300)
  ink(g, p, { w: 2.4, d, t: 600 })
}

/** Rundbogen-Fenster, Unterkante y */
function roundWin(g: Element, cx: number, y: number, w: number, h: number, d = 0): void {
  const p: P[] = [[cx - w / 2, y], [cx - w / 2, y - h + w / 2], ...E(cx, y - h + w / 2, w / 2, w / 2, 180, 360).slice(1), [cx + w / 2, y], [cx - w / 2, y]]
  ink(g, p, { w: 2.4, d, t: 500 })
}

/** Filmstreifen mit n Bildern */
function filmstrip(g: Element, x: number, y: number, n: number, w: number, d = 0, draw?: (i: number, cx: number, cy: number) => void): void {
  const h = w * 0.8
  ink(g, RR(x, y, n * w + 8, h + 30, 4), { w: 2.6, d, t: 600 })
  for (let i = 0; i < n; i++) {
    ink(g, RR(x + 4 + i * w + 3, y + 15, w - 6, h, 3), { w: 1.8, d: d + 200 + i * 80, t: 200 })
    for (const yy of [y + 6, y + h + 22]) dot(g, x + 4 + i * w + w / 2, yy, 2.5, d + 300 + i * 80)
    draw?.(i, x + 4 + i * w + w / 2, y + 15 + h / 2)
  }
}

/** Pferd im Galopp, schematisch (Phase 0…3) */
function gallop(g: Element, cx: number, cy: number, s: number, phase: number, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  ink(g, [...B(P(-14, 0), P(-14, -8), P(12, -8), P(14, 0)), P(-14, 0)], { w: 1.6, d, t: 200 })
  ink(g, [P(12, -6), P(20, -14), P(24, -12)], { w: 1.6, d, t: 150 })
  const legs: [number, number][][] = [
    [[-20, 10], [-8, 12], [8, 12], [20, 10]],
    [[-16, 12], [-12, 12], [10, 12], [14, 12]],
    [[-6, 10], [-2, 10], [2, 10], [6, 10]],
    [[-22, 8], [-4, 12], [4, 12], [22, 8]],
  ]
  const bases = [-12, -8, 8, 12]
  legs[phase].forEach(([a, b], i) => ink(g, L(P(bases[i], 0), P(a, b)), { w: 1.4, d, t: 100 }))
}

export const AHA_KULTUR: Bite[] = [
  {
    id: 'alphabet-ochse',
    area: 'LIT',
    day: 88,
    hook: 'Warum ist das A eigentlich ein Ochse?',
    mood: 'raetsel',
    ambience: 'wind',
    images: [img('phoenizisch')],
    draw: {
      ochse(g) {
        oxA(g, 180, 260, 1.4)
      },
      dreh(g) {
        const r = st(g, 'm1', '--m1: rotate(180deg); transform-origin: 180px 480px; transition-duration: 1.6s; --dl: 600ms')
        oxA(r, 180, 480, 1.3)
      },
      aegypten(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: 'Hieroglyphen', sub: 'Ägypten', up: true },
          { at: 0.45, label: 'um 1850 v. Chr.', sub: 'Sinai' },
          { at: 0.85, label: 'Phönizier', sub: 'um 1050 v. Chr.', up: true },
        ])
      },
      bergleute(g) {
        mountain(g, 20, 200, 600, [110, 420])
        crowd3(g, 230, 600, 1000)
        text(g, 180, 650, 'Arbeiter in Bergwerken am Sinai', { anchor: 'middle', cls: 's', d: 1200 })
      },
      prinzip(g) {
        oxA(g, 90, 480, 0.7)
        text(g, 90, 580, 'ʾalep = Ochse', { anchor: 'middle', cls: 's', d: 700 })
        arrow(g, L([150, 480], [200, 480]), { w: 2.4, d: 900, t: 300, head: 9 })
        text(g, 260, 492, 'A', { anchor: 'middle', size: 44, d: 1100 })
        text(g, 260, 580, 'nur der erste Laut', { anchor: 'middle', cls: 's', d: 1300 })
      },
      woerter(g) {
        const rows: [string, string, string][] = [['ʾalep', 'Ochse', 'A'], ['bēt', 'Haus', 'B'], ['dalet', 'Tür', 'D'], ['mēm', 'Wasser', 'M'], ['ʿayin', 'Auge', 'O']]
        rows.forEach(([a, b, c], i) => {
          const y = 360 + i * 56
          text(g, 40, y, a, { size: 18, d: i * 250 })
          text(g, 150, y, b, { cls: 's', d: i * 250 + 100 })
          text(g, 300, y, c, { anchor: 'middle', size: 26, d: i * 250 + 200 })
        })
      },
      haus(g) {
        ink(g, [[100, 560], [100, 460], [180, 400], [260, 460], [260, 560]], { w: 3, t: 600 })
        text(g, 180, 620, 'bēt: Haus → B', { anchor: 'middle', d: 800 })
      },
      wasser(g) {
        ink(g, waveP(60, 300, 480, 18, 60), { w: 3, t: 800 })
        text(g, 180, 560, 'mēm: Wasser → M', { anchor: 'middle', d: 800 })
      },
      auge(g) {
        eye(g, 180, 470, 1.4)
        text(g, 180, 560, 'ʿayin: Auge → O', { anchor: 'middle', d: 800 })
      },
      vokale(g) {
        box(g, 30, 400, 130, 70, ['Phönizier:', 'nur Konsonanten'], { size: 15 })
        arrow(g, L([168, 435], [192, 435]), { w: 2.4, d: 500, t: 200, head: 8 })
        box(g, 200, 400, 130, 70, ['Griechen:', '+ Vokale'], { size: 15, fill: true, d: 600 })
        text(g, 180, 540, 'alpha, beta → Alphabet', { anchor: 'middle', d: 1000 })
      },
      stammbaum(g) {
        box(g, 110, 330, 140, 46, 'Phönizisch', { size: 16, fill: true })
        const kids: [number, number, string][] = [[70, 450, 'Griechisch'], [180, 450, 'Aramäisch'], [290, 450, 'Hebräisch']]
        kids.forEach(([x, y, l], i) => {
          carrow(g, [180 + (x - 180) * 0.3, 378], [x, y - 2], 0, { d: 400 + i * 150, head: 7 })
          box(g, x - 52, y, 104, 40, l, { size: 14, d: 500 + i * 150 })
        })
        for (const [x, l] of [[50, 'Latein'], [140, 'Kyrillisch']] as const) {
          carrow(g, [70, 492], [x, 558], 0, { d: 1100, head: 7 })
          box(g, x - 40, 560, 80, 40, l, { size: 13, d: 1200 })
        }
        carrow(g, [190, 492], [270, 558], 0, { d: 1300, head: 7 })
        box(g, 230, 560, 80, 40, 'Arabisch', { size: 13, d: 1400 })
      },
      ende(g) {
        oxA(g, 120, 480, 0.8)
        text(g, 240, 512, 'A', { anchor: 'middle', size: 80, d: 600 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { ochse: {} } },
      { t: T('Dreh ein großes A auf den Kopf: zwei Hörner, ein spitzes Maul. Genau so fing es an – als **Ochsenkopf**.', 64), gfx: { dreh: { cls: 'a1' } } },
      { t: T('Die Geschichte beginnt bei den ägyptischen **Hieroglyphen**: Hunderte Bildzeichen, die nur Fachleute beherrschten.', 64), gfx: { aegypten: {} } },
      { t: T('Um 1850 vor Christus hatten Arbeiter in Bergwerken auf dem Sinai eine geniale Idee – vermutlich **Menschen aus Kanaan**.', 64), gfx: { bergleute: {} } },
      { t: T('Sie nahmen ein Bild und nutzten nur den **ersten Laut** seines Namens. Das Bild eines Ochsen, ʾalep, stand für den Anfangslaut.', 64), gfx: { prinzip: {} } },
      { t: T('So brauchte man nicht mehr Hunderte Zeichen, sondern nur noch **zwei Dutzend**. Jeder konnte schreiben lernen.', 64), gfx: { prinzip: {} } },
      { t: T('Die **Phönizier**, Händler am Mittelmeer, machten daraus ein Alphabet mit 22 Zeichen und trugen es übers Meer.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Phönizische Schrift, Idalion (Zypern)' } } },
      { t: T('Viele Namen verraten noch das Bild: **bēt** hieß Haus. Daraus wurde das B.', 64), gfx: { haus: {} } },
      { t: T('**Mēm** hieß Wasser – die Wellen siehst du bis heute im M.', 64), gfx: { wasser: {} } },
      { t: T('Und **ʿayin** hieß Auge. Daraus wurde das O.', 64), gfx: { auge: {} } },
      { t: T('Die Phönizier schrieben nur **Konsonanten**. Die Vokale musste man sich dazudenken.', 64), gfx: { woerter: {} } },
      { t: T('Die Griechen übernahmen die Zeichen und machten einige zu **Vokalen**. Aus dem Ochsenlaut ʾalep wurde das A.', 64), gfx: { vokale: {} } },
      { t: T('Aus alpha und beta entstand das Wort **Alphabet**. Für die Griechen hatten die Namen keine Bedeutung mehr.', 64), gfx: { vokale: {} } },
      { t: T('Die Etrusker gaben es an die Römer weiter – daraus wurde das **lateinische** Alphabet, mit dem du gerade liest.', 64), gfx: { stammbaum: {} } },
      { t: T('Erstaunlich: Fast alle Alphabete der Welt stammen von den Phöniziern ab – auch **Kyrillisch**, Hebräisch und Arabisch.', 64), gfx: { stammbaum: {} } },
      { t: T('Das A drehte sich dabei mehrmals: Bei den Phöniziern lag es auf der Seite, die Griechen stellten es schließlich auf die **Spitze** – oder besser: auf die Hörner.', 64), gfx: { dreh: { cls: 'a1' } } },
      { t: T('Selbst unsere Reihenfolge A, B, C, D ist uralt: Schon Schüler vor über 3.000 Jahren lernten die Zeichen in **fast derselben** Folge.', 64), gfx: { woerter: {} } },
      { t: T('Jedes Mal, wenn du ein A schreibst, zeichnest du also einen **umgedrehten Ochsen**.', 64), gfx: { ende: {} } },
      { t: T('Das A ist ein Ochse – **auf dem Kopf**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Um 1850 v. Chr. entstand am Sinai eine Schrift, die nur den Anfangslaut von Bildzeichen nutzte.', 'Phönizisch ʾalep (Ochse) → griechisch alpha → A; bēt (Haus) → B, mēm (Wasser) → M, ʿayin (Auge) → O.', 'Die Griechen fügten Vokale hinzu; fast alle Alphabete der Welt stammen vom Phönizischen ab.'],
    sources: ['Haarmann 2002: Geschichte der Schrift', 'Goldwasser 2010, Biblical Archaeology Review 36 (Sinai-Schrift)', 'Duden: Herkunftswörterbuch („Alphabet“)'],
  },
  {
    id: 'taler-dollar',
    area: 'LIT',
    day: 88,
    hook: 'Was hat der Dollar mit einem Tal in Böhmen zu tun?',
    mood: 'hell',
    ambience: 'glocke',
    images: [img('joachimsthaler'), img('jachymov')],
    draw: {
      muenze(g) {
        bigCoin(g, 180, 250, 100, '$')
      },
      tal(g) {
        mountain(g, 20, 200, 600, [100, 400])
        mountain(g, 200, 340, 600, [280, 430], 200)
        ink(g, L([20, 602], [340, 602]), { w: 2.6, d: 100, t: 500 })
        text(g, 200, 650, 'Joachimsthal, Böhmen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      silber(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '1516', sub: 'Silberfund', up: true },
          { at: 0.55, label: '1520', sub: 'erste Münzen', big: true },
        ])
      },
      name(g) {
        box(g, 20, 380, 320, 60, 'Joachimsthaler', { size: 22 })
        arrow(g, L([180, 448], [180, 480]), { w: 2.4, d: 500, t: 200, head: 8 })
        box(g, 100, 490, 160, 60, 'Taler', { size: 24, fill: true, d: 700 })
      },
      sprachen(g) {
        const rows: [string, string][] = [['Deutsch', 'Taler'], ['Niederländisch', 'daalder'], ['Englisch', 'dollar'], ['Slowenisch', 'tolar'], ['Samoanisch', 'tālā']]
        rows.forEach(([a, b], i) => {
          text(g, 160, 360 + i * 56, a, { anchor: 'end', cls: 's', d: i * 250 })
          text(g, 180, 360 + i * 56, b, { size: 22, d: i * 250 + 100 })
        })
      },
      peso(g) {
        bigCoin(g, 180, 470, 90, '8 Reales', 0, true)
        text(g, 180, 610, 'spanisch – auf Englisch „Spanish dollar“', { anchor: 'middle', cls: 's', d: 900 })
      },
      usa(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '1792', sub: 'USA: der Dollar wird Währung', up: true }])
      },
      zeichen(g) {
        text(g, 90, 500, 'Ps', { anchor: 'middle', size: 50, d: 200 })
        arrow(g, L([140, 485], [200, 485]), { w: 2.4, d: 600, t: 300, head: 9 })
        text(g, 260, 505, '$', { anchor: 'middle', size: 64, d: 900 })
        text(g, 180, 600, 'vermutlich: Abkürzung für Pesos', { anchor: 'middle', cls: 's', d: 1200 })
      },
      saeulen(g) {
        for (const x of [110, 250]) {
          ink(g, RR(x - 16, 400, 32, 200, 4), { w: 2.6, d: x === 110 ? 0 : 200, t: 500 })
          ink(g, RR(x - 24, 384, 48, 16, 3), { w: 2.2, d: 400, t: 200 })
        }
        ink(g, B([60, 470], [140, 440], [220, 530], [300, 490]), { w: 2.4, d: 800, t: 600 })
        text(g, 180, 650, 'oder: Säulen mit Band auf spanischen Münzen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      uran(g) {
        mountain(g, 60, 300, 600, [180, 420])
        ink(g, L([20, 602], [340, 602]), { w: 2.6, d: 100, t: 500 })
        rays(g, 180, 540, 20, 34, 8, 900)
        text(g, 180, 650, 'später: Uran für Marie Curie', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        bigCoin(g, 96, 480, 60, 'Taler')
        text(g, 180, 492, '=', { anchor: 'middle', size: 32, d: 400 })
        bigCoin(g, 264, 480, 60, '$', 500, true)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Im Erzgebirge, im heutigen Tschechien, liegt ein Tal: **Joachimsthal**, heute Jáchymov.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Jáchymov (Joachimsthal), Museum' } } },
      { t: T('1516 fand man dort riesige **Silbervorkommen**. Eine Bergbaustadt wuchs in kurzer Zeit auf Tausende Einwohner.', 64), gfx: { silber: {} } },
      { t: T('Ab 1520 prägte man aus dem Silber große Münzen: die **Joachimsthaler** Guldengroschen.', 64), gfx: { name: {} } },
      { t: T('Das war ein Zungenbrecher. Bald sagte man nur noch: **Taler**.', 64), gfx: { name: {} } },
      { t: T('Die Münzen waren beliebt und wurden überall nachgeahmt. Der Name **Taler** wanderte mit.', 64), gfx: { sprachen: {} } },
      { t: T('Ein Taler war so wertvoll, dass ein Handwerker dafür **mehrere Tage** arbeiten musste.', 64), gfx: { muenze: { tf: [1, 0, 220] } } },
      { t: T('In den Niederlanden wurde daraus der **daalder**, im Englischen der dollar.', 64), gfx: { sprachen: {} } },
      { t: T('In Nordamerika kursierte vor allem eine spanische Silbermünze: das Achtrealstück. Englischsprachige Siedler nannten sie **Spanish dollar**.', 64), gfx: { peso: {} } },
      { t: T('Als die USA 1792 eine eigene Währung schufen, nahmen sie den vertrauten Namen: **Dollar**.', 64), gfx: { usa: {} } },
      { t: T('So steckt in der wichtigsten Währung der Welt bis heute ein **böhmisches Tal**.', 64), gfx: { tal: {} } },
      { t: T('Der Maria-Theresien-Taler von 1780 wurde so beliebt, dass man ihn in Äthiopien noch im **20. Jahrhundert** als Geld benutzte.', 64), gfx: { name: {} } },
      { t: T('Auch der slowenische **Tolar** und das samoanische Tālā gehen auf den Taler zurück.', 64), gfx: { sprachen: {} } },
      { t: T('Erst seit 1900 war der Dollar fest an Gold gebunden – bis 1971. Seitdem ist er, wie der Euro, **reines Vertrauensgeld**.', 64), gfx: { usa: {} } },
      { t: T('Und das Dollarzeichen? Ganz sicher ist es nicht. Am wahrscheinlichsten ist eine Abkürzung für **Pesos**: P und s, übereinandergeschrieben.', 64), gfx: { zeichen: {} } },
      { t: T('Eine andere Erklärung: Auf spanischen Münzen waren zwei **Säulen** mit einem geschwungenen Band zu sehen.', 64), gfx: { saeulen: {} } },
      { t: T('In Deutschland galt der Taler noch bis ins 19. Jahrhundert. 1873 löste ihn die **Mark** ab.', 64), gfx: { name: {} } },
      { t: T('Joachimsthal wurde später noch einmal berühmt: Aus seinem **Pechblende**-Erz gewann Marie Curie Polonium und Radium.', 64), gfx: { uran: {} } },
      { t: T('Ein Tal, das zuerst das Geld der Welt prägte – und dann die **Physik**.', 64), gfx: { uran: {} } },
      { t: T('Dollar heißt **Taler** – aus dem Tal.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Aus dem Silber von Joachimsthal (Böhmen) wurden ab 1520 „Joachimsthaler“ geprägt – kurz Taler.', 'Taler → daalder → dollar; die USA übernahmen 1792 den Namen, auch für die spanischen Silbermünzen.', 'Das $-Zeichen stammt wohl von „Ps“ (Pesos); Joachimsthal lieferte später Uran-Erz für Marie Curie.'],
    sources: ['Kluge: Etymologisches Wörterbuch der deutschen Sprache („Taler“)', 'Federal Reserve Bank: The History of the Dollar Sign', 'Cajori 1929: A History of Mathematical Notations, Bd. 2'],
  },
  {
    id: 'pandora',
    area: 'LIT',
    day: 20,
    hook: 'Was war wirklich in der Büchse der Pandora?',
    mood: 'dunkel',
    ambience: 'wind',
    images: [img('pandora')],
    draw: {
      krug(g) {
        jar(g, 180, 400, 1.6)
      },
      prometheus(g) {
        fig(g, 120, 600, 4.2)
        const f: P[] = [...B([200, 520], [188, 500], [196, 480], [204, 466]), ...B([204, 466], [214, 486], [222, 502], [210, 520]), [200, 520]]
        hatch(g, f, 600, true)
        ink(g, f, { w: 2.4, d: 400, t: 400 })
        ink(g, L([150, 540], [204, 524]), { w: 2.4, d: 300, t: 300 })
        text(g, 180, 650, 'Prometheus stiehlt das Feuer', { anchor: 'middle', cls: 's', d: 800 })
      },
      hesiod(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: 'um 700 v. Chr.', sub: 'Hesiod: Werke und Tage', up: true }])
      },
      pandora(g) {
        fig(g, 180, 600, 4.6)
        for (const [x, y] of [[110, 430], [250, 430], [130, 520], [230, 520]] as const) ink(g, E(x, y, 6), { w: 1.8, d: 600, t: 200 })
        text(g, 180, 650, 'Pandora: „die Allbeschenkte“', { anchor: 'middle', cls: 's', d: 900 })
      },
      warnung(g) {
        fig(g, 90, 600, 4)
        fig(g, 270, 600, 4, { d: 200 })
        text(g, 90, 650, 'Prometheus', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 270, 650, 'Epimetheus', { anchor: 'middle', cls: 's', d: 600 })
        cross(g, 180, 470, 0.7, 900)
        text(g, 180, 410, '„Nimm kein Geschenk von Zeus!“', { anchor: 'middle', cls: 'it', size: 18, d: 700 })
      },
      offen(g) {
        jar(g, 180, 620, 1.2, 0, true)
        for (let i = 0; i < 5; i++) {
          const x = 120 + i * 30
          ink(g, B([x + 40 - i * 10, 440], [x - 10, 410], [x + 20, 380], [x, 340]), { w: 2, d: 600 + i * 120, t: 400 })
        }
        text(g, 180, 320, 'Krankheit, Mühe, Leid', { anchor: 'middle', cls: 's', d: 1300 })
      },
      hoffnung(g) {
        jar(g, 180, 620, 1.2)
        ball(g, 180, 520, 12, { fill: 'dicht', d: 800 })
        text(g, 180, 380, 'die Hoffnung (Elpis) bleibt drin', { anchor: 'middle', cls: 's', d: 1000 })
      },
      pithos(g) {
        jar(g, 110, 600, 1)
        text(g, 110, 640, 'pithos: Vorratskrug', { anchor: 'middle', cls: 's', d: 500 })
        ink(g, RR(230, 520, 70, 80, 6), { w: 2.6, d: 600, t: 400 })
        ink(g, RR(226, 508, 78, 14, 4), { w: 2.2, d: 800, t: 200 })
        text(g, 265, 640, 'pyxis: Büchse', { anchor: 'middle', cls: 's', d: 900 })
      },
      erasmus(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: 'Hesiod', sub: 'Krug', up: true },
          { at: 0.85, label: '1508', sub: 'Erasmus: „Büchse“', big: true },
        ])
      },
      deutung(g) {
        box(g, 30, 400, 140, 80, ['Hoffnung', 'als Trost'], { size: 16 })
        box(g, 190, 400, 140, 80, ['Hoffnung', 'als Übel'], { size: 16, fill: true, d: 400 })
        question(g, 180, 560, 0.6, 900)
      },
      nietzsche(g) {
        text(g, 180, 440, '„das übelste der Übel“', { anchor: 'middle', cls: 'it', size: 22, d: 200 })
        text(g, 180, 480, 'Friedrich Nietzsche', { anchor: 'middle', cls: 's', d: 700 })
      },
      redewendung(g) {
        box(g, 30, 420, 300, 70, '„die Büchse der Pandora öffnen“', { size: 17 })
        text(g, 180, 560, 'etwas Unheilvolles in Gang setzen', { anchor: 'middle', cls: 's', d: 800 })
      },
      ende(g) {
        jar(g, 180, 600, 1.2)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { krug: {} } },
      { t: T('Erste Überraschung: Es war gar **keine Büchse**. Doch dazu später.', 64), gfx: { krug: { tf: [1, 0, 260] } } },
      { t: T('Die Geschichte erzählt der griechische Dichter **Hesiod** um 700 vor Christus.', 64), gfx: { hesiod: {} } },
      { t: T('Der Titan Prometheus hatte den Göttern das **Feuer** gestohlen und den Menschen gebracht. Göttervater Zeus sann auf Rache.', 64), gfx: { prometheus: {} } },
      { t: T('Er ließ die erste Frau erschaffen: **Pandora**, „die Allbeschenkte“. Jeder Gott gab ihr eine Gabe – Schönheit, Anmut, aber auch List.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 40, 1.05], cam2: [50, 40, 1.2], cap: 'Waterhouse 1896 – mit Kiste statt Krug' } } },
      { t: T('Zeus schickte sie zu Epimetheus, dem Bruder des Prometheus. Der hatte ihn gewarnt: **Nimm kein Geschenk** von Zeus!', 64), gfx: { warnung: {} } },
      { t: T('Epimetheus – sein Name heißt „der hinterher Denkende“ – nahm sie **trotzdem** auf.', 64), gfx: { warnung: {} } },
      { t: T('Pandora hob den Deckel von einem großen Krug. Heraus flogen alle Übel: **Krankheit**, Mühsal, Leid – bis dahin unbekannt.', 64), gfx: { offen: {} } },
      { t: T('Erschrocken schloss sie den Deckel. Nur eines blieb im Krug zurück: die **Hoffnung**.', 64), gfx: { hoffnung: {} } },
      { t: T('Und die Büchse? Bei Hesiod steht **pithos** – ein mannshoher Vorratskrug für Wein oder Getreide.', 64), gfx: { pithos: {} } },
      { t: T('Erst der Gelehrte **Erasmus von Rotterdam** schrieb um 1508 „pyxis“ – Büchse. Wohl eine Verwechslung, die sich durchsetzte.', 64), gfx: { erasmus: {} } },
      { t: T('Hesiod war kein Freund der Frauen: Pandora ist bei ihm die Strafe der Götter. Spätere Dichter sahen sie **milder**.', 64), gfx: { pandora: {} } },
      { t: T('Bis heute streiten Gelehrte, was die Hoffnung im Krug **bedeutet**.', 64), gfx: { deutung: {} } },
      { t: T('Ist sie ein **Trost**, der den Menschen bleibt, weil sie im Krug sicher verwahrt ist?', 64), gfx: { deutung: {} } },
      { t: T('Oder ist sie selbst ein Übel? Der Philosoph Friedrich Nietzsche nannte sie „das **übelste der Übel**“, weil sie die Qual verlängert.', 64), gfx: { nietzsche: {} } },
      { t: T('Die Geschichte erinnert an **Eva** in der Bibel: eine Frau, eine Neugier, und das Übel kommt in die Welt.', 64), gfx: { pandora: {} } },
      { t: T('Und Prometheus? Zeus ließ ihn an einen Felsen schmieden. Ein Adler fraß jeden Tag **seine Leber**, die nachts nachwuchs.', 64), gfx: { prometheus: {} } },
      { t: T('Heute sagen wir „die **Büchse der Pandora** öffnen“, wenn jemand etwas in Gang setzt, das sich nicht mehr aufhalten lässt.', 64), gfx: { redewendung: {} } },
      { t: T('Richtig hieße es: der **Krug** der Pandora.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei Hesiod (~700 v. Chr.) schickt Zeus Pandora als Strafe für Prometheus’ Feuerdiebstahl; aus dem Krug kommen alle Übel.', 'Nur die Hoffnung bleibt im Krug – als Trost oder (Nietzsche) als „übelstes der Übel“ gedeutet.', 'Aus dem Krug (pithos) wurde durch Erasmus um 1508 die „Büchse“ (pyxis).'],
    sources: ['Hesiod: Werke und Tage 42–105', 'Panofsky & Panofsky 1956: Pandora’s Box', 'Nietzsche 1878: Menschliches, Allzumenschliches I, 71'],
  },
  {
    id: 'trojanisches-pferd',
    area: 'LIT',
    day: 59,
    hook: 'Gab es das Trojanische Pferd wirklich?',
    mood: 'episch',
    ambience: 'wind',
    images: [img('trojanisches-pferd'), img('schliemann')],
    draw: {
      pferd(g) {
        horse(g, 170, 420, 1.2)
      },
      ilias(g) {
        box(g, 30, 400, 140, 90, ['Ilias:', 'endet vorher'], { size: 16 })
        box(g, 190, 400, 140, 90, ['Odyssee:', 'kurz erwähnt'], { size: 16, fill: true, d: 400 })
        text(g, 180, 560, 'beide Homer zugeschrieben', { anchor: 'middle', cls: 's', d: 900 })
      },
      vergil(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: 'um 700 v. Chr.', sub: 'Homer', up: true },
          { at: 0.8, label: 'um 20 v. Chr.', sub: 'Vergil: Aeneis', big: true },
        ])
      },
      list(g) {
        horse(g, 180, 620, 1)
        for (let i = 0; i < 3; i++) fig(g, 150 + i * 24, 548, 0.8, { d: 900 + i * 150 })
        text(g, 180, 380, 'Krieger im Bauch', { anchor: 'middle', cls: 's', d: 1300 })
      },
      laokoon(g) {
        text(g, 180, 430, '„Ich fürchte die Griechen,', { anchor: 'middle', cls: 'it', size: 20, d: 200 })
        text(g, 180, 464, 'auch wenn sie Geschenke bringen.“', { anchor: 'middle', cls: 'it', size: 20, d: 400 })
        text(g, 180, 520, 'Laokoon bei Vergil', { anchor: 'middle', cls: 's', d: 800 })
      },
      schliemann(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '1870er', sub: 'Heinrich Schliemann gräbt', up: true }])
      },
      schichten(g) {
        const labels = ['Troja IX (römisch)', 'Troja VII', 'Troja VI', 'Troja II', 'Troja I']
        labels.forEach((l, i) => {
          const y = 340 + i * 60
          const p: P[] = [[40, y], [320, y], [320, y + 56], [40, y + 56], [40, y]]
          if (i === 3) hatch(g, p, 400 + i * 150)
          ink(g, L([40, y + 56], [320, y + 56]), { w: 2, d: i * 150, t: 400 })
          text(g, 180, y + 34, l, { anchor: 'middle', size: 16, d: i * 150 + 100, cls: i === 3 ? 'halo' : '' })
        })
      },
      schatz(g) {
        for (let i = 0; i < 5; i++) ball(g, 90 + i * 45, 520, 16, { fill: i % 2 ? 'hell' : 'dicht', d: i * 120 })
        ink(g, B([70, 470], [140, 440], [220, 440], [290, 470]), { w: 2.4, d: 700, t: 500 })
        text(g, 180, 600, '„Schatz des Priamos“ – 1.000 Jahre zu alt', { anchor: 'middle', cls: 's', d: 1000 })
      },
      theorien(g) {
        bullets(g, 40, 380, ['Belagerungsmaschine?', 'Schiff?', 'Erdbeben?'], { gap: 56, size: 18 })
      },
      computer(g) {
        ink(g, RR(80, 400, 200, 130, 10), { w: 3, t: 600 })
        horse(g, 180, 510, 0.45, 500)
        ink(g, L([150, 530], [130, 570]), { w: 2.4, d: 300, t: 200 })
        ink(g, L([210, 530], [230, 570]), { w: 2.4, d: 300, t: 200 })
        text(g, 180, 620, 'Trojaner: getarnte Schadsoftware', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        horse(g, 170, 600, 1)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Die Geschichte kennt jeder: Zehn Jahre belagern die Griechen **Troja**. Dann bauen sie ein riesiges Holzpferd – und tun so, als zögen sie ab.', 64), gfx: { list: {} } },
      { t: T('Die Trojaner ziehen das Geschenk in ihre Stadt. Nachts klettern Krieger aus dem Bauch und **öffnen die Tore**.', 64), gfx: { list: {} } },
      { t: T('Erste Überraschung: In Homers **Ilias** kommt das Pferd gar nicht vor. Das Epos endet vor dem Fall Trojas.', 64), gfx: { ilias: {} } },
      { t: T('In der **Odyssee** wird es nur kurz erwähnt.', 64), gfx: { ilias: {} } },
      { t: T('Die berühmte Fassung schrieb erst der Römer **Vergil**, rund 700 Jahre später, in seiner Aeneis.', 64), gfx: { vergil: {} } },
      { t: T('Dort warnt der Priester Laokoon: „Ich fürchte die Griechen, auch wenn sie **Geschenke** bringen.“ Niemand hört auf ihn.', 64), gfx: { laokoon: {} } },
      { t: T('Aber gab es Troja überhaupt? Lange hielt man es für **erfunden**.', 64), gfx: { pferd: { tf: [1, 0, 220] } } },
      { t: T('In den 1870ern grub der Kaufmann **Heinrich Schliemann** am Hügel Hisarlık in der heutigen Türkei – und fand eine Stadt.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.2], cap: 'Heinrich Schliemann' } } },
      { t: T('Genauer: **neun Städte** übereinander. Jede war auf den Trümmern der vorigen gebaut.', 64), gfx: { schichten: {} } },
      { t: T('Schliemann grub hastig in die Tiefe – und **zerstörte** dabei gerade die Schichten, die zur Zeit eines Trojanischen Krieges passen könnten.', 64), gfx: { schichten: {} } },
      { t: T('Sein berühmter **„Schatz des Priamos“** war über tausend Jahre älter als jeder König Priamos.', 64), gfx: { schatz: {} } },
      { t: T('Heute halten viele Forscher **Troja VI oder VIIa** um 1200 vor Christus für die Stadt der Sage. Sie wurde tatsächlich zerstört.', 64), gfx: { schichten: {} } },
      { t: T('Für ein Holzpferd gibt es aber **keinen Beleg**. Vielleicht ist es ein Bild für etwas anderes.', 64), gfx: { theorien: {} } },
      { t: T('Eine Belagerungsmaschine mit Tierhäuten? Ein Schiff? Oder ein **Erdbeben** – der Erderschütterer Poseidon war auch der Gott der Pferde?', 64), gfx: { theorien: {} } },
      { t: T('Vielleicht erinnert die Sage auch an echte Kriege um die reiche Stadt an der **Meerenge** der Dardanellen, dem Tor zum Schwarzen Meer.', 64), gfx: { schichten: {} } },
      { t: T('Weiter lebt das Pferd heute im Computer: Ein **Trojaner** ist Schadsoftware, die sich als nützliches Programm tarnt.', 64), gfx: { computer: {} } },
      { t: T('Troja gab es – das Pferd vielleicht **nur im Lied**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Das Holzpferd fehlt in der Ilias, wird in der Odyssee kurz erwähnt und erst bei Vergil (Aeneis) ausgemalt.', 'Troja existierte: Schliemann grub ab 1870 in Hisarlık neun Siedlungsschichten aus – und zerstörte dabei viel.', 'Für das Pferd selbst gibt es keinen Beleg; Deutungen reichen von Belagerungsgerät bis Erdbeben.'],
    sources: ['Homer: Odyssee VIII, 492–520', 'Vergil: Aeneis II, 13–249', 'Korfmann (Hg.) 2006: Troia – Archäologie eines Siedlungshügels'],
  },
  {
    id: 'oktave',
    area: 'KUL',
    day: 51,
    hook: 'Warum klingen manche Töne zusammen schön?',
    mood: 'hell',
    ambience: 'glocke',
    images: [],
    draw: {
      noten(g) {
        for (let i = 0; i < 5; i++) ink(g, L([30, 180 + i * 18], [330, 180 + i * 18]), { w: 1.4, d: i * 80, t: 500 })
        for (const [x, y] of [[110, 252], [170, 225], [230, 198]] as const) {
          blank(g, E(x, y, 11, 8))
          hatch(g, E(x, y, 11, 8), 700, true)
          ink(g, E(x, y, 11, 8), { w: 2.2, d: 600, t: 200 })
          ink(g, L([x + 10, y], [x + 10, y - 56]), { w: 2, d: 800, t: 200 })
        }
      },
      saite(g) {
        string(g, 40, 320, 480, 1, 40)
        text(g, 180, 580, 'eine Saite schwingt', { anchor: 'middle', cls: 's', d: 1000 })
      },
      haelfte(g) {
        string(g, 40, 320, 420, 1, 26)
        text(g, 180, 470, 'ganze Saite: Grundton', { anchor: 'middle', cls: 's', d: 700 })
        string(g, 40, 180, 560, 1, 22, 600)
        text(g, 110, 610, 'halbe Länge: Oktave', { anchor: 'middle', cls: 's', d: 1300 })
      },
      verhaeltnisse(g) {
        const rows: [string, string][] = [['Oktave', '2 : 1'], ['Quinte', '3 : 2'], ['Quarte', '4 : 3']]
        rows.forEach(([a, b], i) => {
          text(g, 160, 410 + i * 70, a, { anchor: 'end', size: 22, d: i * 300 })
          text(g, 190, 410 + i * 70, b, { size: 26, d: i * 300 + 150 })
        })
        text(g, 180, 640, 'einfache Zahlenverhältnisse', { anchor: 'middle', cls: 's', d: 1200 })
      },
      wellen(g) {
        ink(g, waveP(30, 330, 420, 24, 150), { w: 2.4, t: 900 })
        ink(g, waveP(30, 330, 520, 24, 75), { w: 2.4, d: 300, t: 900 })
        for (const x of [30, 180, 330]) dashes(g, L([x, 380], [x, 560]), { w: 1.2, d: 1200 })
        text(g, 180, 620, 'die Muster treffen sich immer wieder', { anchor: 'middle', cls: 's', d: 1400 })
      },
      schief(g) {
        ink(g, waveP(30, 330, 420, 24, 150), { w: 2.4, t: 900 })
        ink(g, waveP(30, 330, 520, 24, 141), { w: 2.4, d: 300, t: 900 })
        text(g, 180, 620, 'krummes Verhältnis: es reibt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      pythagoras(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: 'um 530 v. Chr.', sub: 'Pythagoras & das Monochord', up: true }])
      },
      hammer(g) {
        for (let i = 0; i < 3; i++) {
          const x = 80 + i * 100
          ink(g, L([x, 600], [x, 480]), { w: 2.6, d: i * 200, t: 300 })
          ink(g, RR(x - 24 + i * 2, 450 - i * 4, 48 - i * 4, 30 + i * 4, 4), { w: 2.6, d: i * 200 + 200, t: 300 })
        }
        cross(g, 300, 380, 0.7, 1000)
        text(g, 180, 650, 'die Schmiede-Legende stimmt physikalisch nicht', { anchor: 'middle', cls: 's', d: 1200 })
      },
      obertoene(g) {
        hbars(g, [
          { label: 'Grundton', v: 100, fmt: () => '100 Hz', dense: true },
          { label: '1. Oberton', v: 200, fmt: () => '200 Hz' },
          { label: '2. Oberton', v: 300, fmt: () => '300 Hz' },
        ], { x: 30, y: 380, w: 300, h: 36, gap: 76 })
        text(g, 180, 620, 'jeder Ton enthält seine Vielfachen', { anchor: 'middle', cls: 's', d: 1500 })
      },
      zwoelf(g) {
        for (let i = 0; i < 13; i++) {
          const x = 30 + i * 25
          ink(g, L([x, 560], [x, 560 - 20 - i * 8]), { w: 2.4, d: i * 80, t: 200 })
        }
        ink(g, L([20, 562], [340, 562]), { w: 2, t: 400 })
        text(g, 180, 610, '12 gleiche Schritte pro Oktave', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kammerton(g) {
        text(g, 180, 450, '440 Hz', { anchor: 'middle', size: 54, d: 200 })
        text(g, 180, 495, 'Kammerton a’', { anchor: 'middle', cls: 's', d: 600 })
      },
      tsimane(g) {
        crowd(g, 70, 600, 5, 54, 2.6)
        question(g, 180, 420, 0.7, 900)
        text(g, 180, 650, 'Tsimane, Bolivien: kein Vorzug für Konsonanz', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        string(g, 40, 320, 470, 2, 30)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { noten: {} } },
      { t: T('Ein Ton ist eine **Schwingung**. Eine Gitarrensaite schwingt zum Beispiel hundertmal pro Sekunde hin und her.', 64), gfx: { saite: {} } },
      { t: T('Greifst du die Saite in der Mitte, schwingt nur die halbe Länge – **doppelt so schnell**.', 64), gfx: { haelfte: {} } },
      { t: T('Der neue Ton klingt höher und doch **gleich**, nur heller. Das ist die Oktave: Verhältnis 2 zu 1.', 64), gfx: { haelfte: {} } },
      { t: T('Zwei Drittel der Saite ergeben die **Quinte**, drei Viertel die Quarte. Die schönsten Zusammenklänge haben einfache Verhältnisse.', 64), gfx: { verhaeltnisse: {} } },
      { t: T('Warum? Die Schwingungen passen zusammen. Bei 2 zu 1 treffen sich die Wellen bei **jeder zweiten** Schwingung wieder.', 64), gfx: { wellen: {} } },
      { t: T('Das Ohr hört ein ruhiges, **wiederkehrendes** Muster.', 64), gfx: { wellen: {} } },
      { t: T('Bei krummen Verhältnissen geraten die Wellen aus dem Takt. Es entsteht ein Flattern, eine **Reibung** – wir nennen das dissonant.', 64), gfx: { schief: {} } },
      { t: T('Schon **Pythagoras** soll das um 530 vor Christus mit einer gespannten Saite, dem Monochord, entdeckt haben.', 64), gfx: { pythagoras: {} } },
      { t: T('Die Legende, er habe es an klingenden **Schmiedehämmern** gehört, stimmt dagegen nicht: Hämmer klingen so nicht.', 64), gfx: { hammer: {} } },
      { t: T('Noch tiefer liegt ein Geheimnis: Jeder natürliche Ton enthält **Obertöne** – das Doppelte, Dreifache, Vierfache seiner Frequenz.', 64), gfx: { obertoene: {} } },
      { t: T('Die Oktave und die Quinte stecken also schon **in jedem Ton**. Darum verschmelzen sie so gut.', 64), gfx: { obertoene: {} } },
      { t: T('Unser Klavier teilt die Oktave in **zwölf** gleiche Halbtonschritte. Dadurch kann man in jeder Tonart spielen.', 64), gfx: { zwoelf: {} } },
      { t: T('Der Preis: Die Quinte ist dabei **minimal verstimmt** – so wenig, dass kaum jemand es hört.', 64), gfx: { zwoelf: {} } },
      { t: T('Damit Orchester zusammenpassen, stimmen sie auf einen gemeinsamen Ton: den Kammerton a’, meist **440 Hertz**.', 64), gfx: { kammerton: {} } },
      { t: T('Aber ist schön angeboren? Forscher spielten Menschen des Tsimane-Volks in Bolivien Akkorde vor. Sie fanden dissonante **genauso angenehm**.', 64), gfx: { tsimane: {} } },
      { t: T('Und in anderen Musikkulturen, etwa in Indien oder Arabien, gibt es Tonschritte **kleiner** als unsere Halbtöne.', 64), gfx: { zwoelf: {} } },
      { t: T('Die Physik liefert die einfachen Verhältnisse. Was wir als schön empfinden, ist aber auch **gelernt**.', 64), gfx: { verhaeltnisse: {} } },
      { t: T('Harmonie ist **Mathematik** – und Gewohnheit.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Konsonante Intervalle haben einfache Frequenzverhältnisse: Oktave 2:1, Quinte 3:2, Quarte 4:3.', 'Ihre Schwingungen bilden wiederkehrende Muster; Obertöne enthalten Oktave und Quinte schon.', 'Gleichstufige Stimmung teilt die Oktave in 12 Halbtöne; die Vorliebe für Konsonanz ist teils kulturell (Tsimane-Studie).'],
    sources: ['Helmholtz 1863: Die Lehre von den Tonempfindungen', 'McDermott et al. 2016, Nature 535 (Tsimane)', 'Roederer 2008: The Physics and Psychophysics of Music'],
  },
  {
    id: 'perspektive',
    area: 'KUL',
    day: 13,
    hook: 'Warum sehen Bilder seit der Renaissance so echt aus?',
    mood: 'ruhig',
    ambience: 'glocke',
    images: [],
    draw: {
      raum(g) {
        const v: P = [180, 220]
        for (const [x, y] of [[20, 420], [340, 420], [20, 100], [340, 100]] as const) ink(g, L([x, y], [v[0] + (x - v[0]) * 0.3, v[1] + (y - v[1]) * 0.3]), { w: 2.2, t: 600 })
        ink(g, RR(v[0] - 48, v[1] - 36, 96, 72, 2), { w: 2.4, d: 400, t: 400 })
        dot(g, v[0], v[1], 3, 900)
      },
      mittelalter(g) {
        fig(g, 180, 620, 7)
        fig(g, 70, 620, 3.2, { d: 300 })
        fig(g, 290, 620, 3.2, { d: 300 })
        text(g, 180, 380, 'wichtig = groß', { anchor: 'middle', cls: 's', d: 900 })
      },
      gleise(g) {
        const v: P = [180, 380]
        ink(g, L([60, 640], v), { w: 2.6, t: 600 })
        ink(g, L([300, 640], v), { w: 2.6, t: 600 })
        for (let i = 0; i < 6; i++) {
          const t = 1 - Math.pow(0.72, i + 1)
          const y = 640 + (v[1] - 640) * t
          const hw = 120 * (1 - t)
          ink(g, L([180 - hw - 10 * (1 - t), y], [180 + hw + 10 * (1 - t), y]), { w: 2, d: 600 + i * 100, t: 200 })
        }
        dot(g, v[0], v[1], 4, 1300)
        text(g, 250, 380, 'Fluchtpunkt', { cls: 's', d: 1400 })
      },
      brunelleschi(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: 'um 1415', sub: 'Filippo Brunelleschi, Florenz', up: true }])
      },
      spiegel(g) {
        ink(g, RR(30, 400, 100, 140, 4), { w: 2.6, t: 500 })
        dot(g, 80, 470, 4, 400)
        eye(g, 40, 470, 0.5, 300)
        ink(g, RR(230, 400, 100, 140, 4), { w: 2.6, d: 400, t: 500 })
        hatch(g, RR(230, 400, 100, 140, 4), 700)
        dashes(g, L([90, 470], [226, 470]), { w: 1.4, d: 900 })
        text(g, 80, 580, 'Bild mit Loch', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 280, 580, 'Spiegel', { anchor: 'middle', cls: 's', d: 1100 })
      },
      fenster(g) {
        ink(g, RR(90, 380, 180, 200, 4), { w: 3, t: 600 })
        ink(g, L([180, 384], [180, 576]), { w: 1.6, d: 300, t: 300 })
        ink(g, L([94, 480], [266, 480]), { w: 1.6, d: 300, t: 300 })
        text(g, 180, 630, 'Alberti 1435: das Bild als Fenster', { anchor: 'middle', cls: 's', d: 900 })
      },
      fliesen(g) {
        const v: P = [180, 380]
        const y0 = 640
        for (let i = -4; i <= 4; i++) ink(g, L([180 + i * 40, y0], [v[0] + i * 40 * 0.25, v[1] + (y0 - v[1]) * 0.75]), { w: 1.6, d: 300 + Math.abs(i) * 60, t: 400 })
        for (let k = 0; k < 5; k++) {
          const t = 1 - Math.pow(0.7, k)
          const y = y0 + (v[1] + (y0 - v[1]) * 0.75 - y0) * t
          const hw = 160 * (1 - t * 0.75)
          ink(g, L([180 - hw, y], [180 + hw, y]), { w: 1.6, d: 800 + k * 100, t: 300 })
        }
      },
      masaccio(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: 'um 1427', sub: 'Masaccio: Dreifaltigkeit', up: true }])
      },
      duerer(g) {
        ink(g, RR(150, 400, 100, 140, 2), { w: 2.6, t: 500 })
        for (let i = 1; i < 4; i++) {
          ink(g, L([150 + i * 25, 402], [150 + i * 25, 538]), { w: 1, d: 300 + i * 50, t: 200 })
          ink(g, L([152, 400 + i * 35], [248, 400 + i * 35]), { w: 1, d: 400 + i * 50, t: 200 })
        }
        fig(g, 70, 600, 3.6, { d: 600 })
        text(g, 180, 640, 'Dürers Zeichengitter', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        const v: P = [180, 460]
        for (const x of [40, 320]) ink(g, L([x, 620], v), { w: 2.6, t: 600 })
        dot(g, v[0], v[1], 5, 700)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { raum: {} } },
      { t: T('Im Mittelalter malte man nicht, was das Auge sieht, sondern was **wichtig** ist. Heilige wurden größer gemalt als einfache Menschen.', 64), gfx: { mittelalter: {} } },
      { t: T('Räume wirkten flach, Tische kippten nach vorn. Niemand kannte eine Regel für **Tiefe**.', 64), gfx: { mittelalter: {} } },
      { t: T('Dann bemerkte man etwas Einfaches: **Parallele Linien**, die von uns weglaufen, scheinen sich in einem Punkt zu treffen.', 64), gfx: { gleise: {} } },
      { t: T('Dieser Punkt heißt **Fluchtpunkt**. Schau auf lange Bahngleise – sie laufen am Horizont zusammen.', 64), gfx: { gleise: {} } },
      { t: T('Um 1415 bewies der Architekt **Filippo Brunelleschi** in Florenz, dass man das exakt berechnen kann.', 64), gfx: { brunelleschi: {} } },
      { t: T('Er malte die Taufkirche von Florenz, bohrte ein Loch ins Bild und ließ Betrachter von hinten hindurchschauen – auf einen **Spiegel**.', 64), gfx: { spiegel: {} } },
      { t: T('Hob man den Spiegel weg, sah man das echte Gebäude – und es passte **genau** zum gemalten.', 64), gfx: { spiegel: {} } },
      { t: T('Das Wort kommt vom Lateinischen perspicere: **hindurchsehen**.', 64), gfx: { fenster: {} } },
      { t: T('Leon Battista **Alberti** schrieb 1435 die Regeln auf: Ein Bild ist wie ein offenes Fenster, durch das man in die Welt blickt.', 64), gfx: { fenster: {} } },
      { t: T('Der Trick: Alle Linien in die Tiefe zielen auf den Fluchtpunkt. Bodenfliesen werden nach hinten **immer schmaler**.', 64), gfx: { fliesen: {} } },
      { t: T('Eines der ersten Gemälde mit richtiger Zentralperspektive malte **Masaccio** um 1427: eine Kapelle, die in die Kirchenwand hineinzureichen scheint.', 64), gfx: { masaccio: {} } },
      { t: T('Die Betrachter waren verblüfft. Plötzlich wirkten Wände wie **Durchgänge**.', 64), gfx: { fliesen: {} } },
      { t: T('Dazu kam die **Luftperspektive**: Ferne Berge malte man blasser und bläulicher – wie man sie in der Natur sieht.', 64), gfx: { gleise: {} } },
      { t: T('Später zeichnete Albrecht **Dürer** mit Gitter und Peilstab – ein frühes Hilfsmittel, fast wie eine Kamera.', 64), gfx: { duerer: {} } },
      { t: T('Perspektive war auch ein neues **Weltbild**: Der Mensch und sein Blick rücken in den Mittelpunkt.', 64), gfx: { raum: { tf: [1, 0, 240] } } },
      { t: T('Eine **Kamera** folgt derselben Geometrie ganz von selbst: Alles Licht fällt durch einen Punkt, die Linse.', 64), gfx: { spiegel: {} } },
      { t: T('Heute rechnen Computerspiele dieselbe Geometrie – nur **60-mal pro Sekunde**.', 64), gfx: { fliesen: {} } },
      { t: T('Pflastermaler nutzen den Trick heute für 3D-Bilder auf der Straße: Nur von **einem Punkt** aus gesehen springt das Bild aus dem Boden.', 64), gfx: { gleise: {} } },
      { t: T('Und manche Künstler brechen bewusst mit ihr, etwa die **Kubisten**, die einen Gegenstand von mehreren Seiten zugleich zeigen.', 64), gfx: { mittelalter: {} } },
      { t: T('Alle Linien laufen auf **einen Punkt** zu.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Mittelalterliche Bilder nutzten Bedeutungsgröße statt räumlicher Tiefe.', 'Brunelleschi (um 1415) zeigte mit Spiegelexperiment die Zentralperspektive; Alberti (1435) schrieb die Regeln auf.', 'Parallele Linien laufen auf einen Fluchtpunkt zu; Masaccio, Dürer – bis zu heutigen 3D-Spielen.'],
    sources: ['Alberti 1435: De pictura', 'Edgerton 2009: The Mirror, the Window, and the Telescope', 'Kemp 1990: The Science of Art'],
  },
  {
    id: 'strebebogen',
    area: 'KUL',
    day: 34,
    hook: 'Wie bekamen gotische Kathedralen so riesige Fenster?',
    mood: 'episch',
    ambience: 'glocke',
    images: [],
    draw: {
      kathedrale(g) {
        ink(g, L([20, 420], [340, 420]), { w: 2.6, t: 500 })
        for (const x of [100, 260]) {
          ink(g, [[x - 30, 420], [x - 30, 160], [x, 100], [x + 30, 160], [x + 30, 420]], { w: 2.8, d: 200, t: 700 })
          lancet(g, x, 300, 24, 90, 700)
        }
        lancet(g, 180, 420, 80, 220, 400, true)
      },
      romanik(g) {
        ink(g, RR(60, 380, 240, 220, 4), { w: 3.6, t: 600 })
        hatch(g, RR(60, 380, 240, 220, 4), 400)
        for (const x of [120, 180, 240]) {
          blank(g, RR(x - 12, 430, 24, 60, 12))
          roundWin(g, x, 490, 24, 60, 600)
        }
        text(g, 180, 640, 'Romanik: dicke Mauern, kleine Fenster', { anchor: 'middle', cls: 's', d: 1000 })
      },
      schub(g) {
        ink(g, [[80, 620], [80, 460], ...E(180, 460, 100, 100, 180, 360).slice(1), [280, 620]], { w: 3, t: 800 })
        for (const k of [-1, 1]) arrow(g, L([180 + k * 80, 470], [180 + k * 140, 470]), { w: 2.6, d: 900, t: 300, head: 10 })
        arrow(g, L([180, 300], [180, 350]), { w: 2.6, d: 600, t: 300, head: 10 })
        text(g, 180, 660, 'das Gewölbe drückt die Wände auseinander', { anchor: 'middle', cls: 's', d: 1200 })
      },
      spitz(g) {
        roundWin(g, 100, 620, 120, 200)
        lancet(g, 260, 620, 120, 240, 400)
        text(g, 100, 650, 'rund', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 260, 650, 'spitz: drückt steiler nach unten', { anchor: 'middle', cls: 's', d: 900 })
      },
      strebe(g) {
        ink(g, L([20, 640], [340, 640]), { w: 2.6, t: 500 })
        ink(g, [[140, 640], [140, 380]], { w: 3, d: 200, t: 400 })
        ink(g, [[220, 640], [220, 380]], { w: 3, d: 200, t: 400 })
        ink(g, B([140, 380], [140, 330], [220, 330], [220, 380]), { w: 3, d: 400, t: 400 })
        for (const k of [-1, 1]) {
          const px = 180 + k * 140
          ink(g, RR(px - 14, 420, 28, 220, 3), { w: 2.8, d: 600, t: 500 })
          ink(g, B([180 + k * 40, 400], [180 + k * 80, 380], [180 + k * 110, 400], [px - 14 * k, 440]), { w: 2.6, d: 900, t: 500 })
        }
        text(g, 180, 300, 'Strebebogen + Strebepfeiler', { anchor: 'middle', cls: 's', d: 1300 })
      },
      fenster(g) {
        for (let i = 0; i < 3; i++) lancet(g, 80 + i * 100, 620, 70, 240, i * 200, i === 1)
        text(g, 180, 660, 'Wände werden zu Glas', { anchor: 'middle', cls: 's', d: 900 })
      },
      suger(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: 'um 1140', sub: 'Saint-Denis bei Paris', up: true }])
      },
      licht(g) {
        lancet(g, 180, 600, 100, 240, 0, true)
        rays(g, 180, 480, 132, 150, 12, 700)
        text(g, 180, 650, 'Licht als Bild für Gott', { anchor: 'middle', cls: 's', d: 1000 })
      },
      koeln(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '1248', sub: 'Baubeginn', up: true },
          { at: 0.9, label: '1880', sub: 'fertig', big: true },
        ])
      },
      beauvais(g) {
        hbars(g, [
          { label: 'Beauvais (Chor)', v: 48, fmt: () => '48 m', dense: true },
          { label: 'Köln (Mittelschiff)', v: 43, fmt: () => '43 m' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80, max: 50 })
        text(g, 180, 590, 'Gewölbehöhe – Beauvais stürzte 1284 ein', { anchor: 'middle', cls: 's', d: 1200 })
      },
      bibel(g) {
        lancet(g, 180, 620, 120, 260, 0)
        for (let i = 0; i < 3; i++) ink(g, RR(140, 420 + i * 60, 80, 48, 4), { w: 1.8, d: 400 + i * 150, t: 200 })
        text(g, 180, 660, 'Bilder für Menschen, die nicht lesen konnten', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        lancet(g, 180, 620, 120, 260, 0, true)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { kathedrale: {} } },
      { t: T('Ältere Kirchen der **Romanik** hatten dicke Mauern und kleine, runde Fenster. Innen war es oft dämmrig.', 64), gfx: { romanik: {} } },
      { t: T('Das Problem: Ein steinernes Gewölbe ist schwer. Es drückt nicht nur nach unten, sondern auch **zur Seite**.', 64), gfx: { schub: {} } },
      { t: T('Diesen Seitendruck nennen Baumeister **Schub**. Er will die Wände auseinanderdrücken.', 64), gfx: { schub: {} } },
      { t: T('Romanische Wände hielten dagegen, weil sie so **dick** waren. Große Löcher für Fenster hätten sie geschwächt.', 64), gfx: { romanik: {} } },
      { t: T('Die Gotik löste das mit zwei Tricks. Erstens: der **Spitzbogen**. Er leitet die Last steiler nach unten.', 64), gfx: { spitz: {} } },
      { t: T('Zweitens: Man fängt den Schub **außen** ab – mit Strebebögen, die zu dicken Strebepfeilern hinüberreichen.', 64), gfx: { strebe: {} } },
      { t: T('Das Gebäude trägt sich wie ein **Skelett**. Die Wände dazwischen tragen kaum noch etwas.', 64), gfx: { strebe: {} } },
      { t: T('Und was nicht tragen muss, kann **Glas** sein. Aus Mauern wurden Fensterwände.', 64), gfx: { fenster: {} } },
      { t: T('Den Anfang machte um 1140 Abt Suger in **Saint-Denis** bei Paris. Er wollte eine Kirche voller Licht.', 64), gfx: { suger: {} } },
      { t: T('Licht galt als Bild für **Gott**. Farbiges Glas tauchte den Raum in leuchtende Farben.', 64), gfx: { licht: {} } },
      { t: T('Die Steinmetze arbeiteten ohne Statik-Berechnung – mit **Erfahrung**, Faustregeln und Modellen. Manches stürzte ein, das meiste steht bis heute.', 64), gfx: { strebe: {} } },
      { t: T('Die Fenster erzählten Geschichten aus der Bibel – für viele, die nicht lesen konnten, eine **Bibel aus Licht**.', 64), gfx: { bibel: {} } },
      { t: T('Die Baupläne waren oft **geheim**: Bauhütten gaben ihr Wissen nur an ihre Mitglieder weiter.', 64), gfx: { kathedrale: { tf: [1, 0, 220] } } },
      { t: T('Die Baumeister trieben es immer höher. In **Beauvais** wölbten sie einen Chor 48 Meter hoch.', 64), gfx: { beauvais: {} } },
      { t: T('1284 stürzte er teilweise **ein**. Man baute ihn wieder auf – mit zusätzlichen Pfeilern.', 64), gfx: { beauvais: {} } },
      { t: T('Solche Bauten dauerten oft **Generationen**. Der Kölner Dom wurde 1248 begonnen – und erst 1880 vollendet.', 64), gfx: { koeln: {} } },
      { t: T('Viele Kathedralen blieben unvollendet: In Köln stand jahrhundertelang ein **Baukran** auf dem Südturm.', 64), gfx: { koeln: {} } },
      { t: T('Wer vor einer gotischen Kathedrale steht, sieht die Kräfte: Die Strebebögen außen sind das **Geheimnis** des Lichts innen.', 64), gfx: { strebe: {} } },
      { t: T('Die Kraft geht **nach außen** – das Licht kommt herein.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Gewölbe erzeugen seitlichen Schub; romanische Kirchen brauchten dafür dicke Mauern mit kleinen Fenstern.', 'Gotik: Spitzbogen leiten Last steiler ab, Strebebögen und -pfeiler fangen den Schub außen ab.', 'So wurden Wände zu Fenstern (Saint-Denis um 1140); Beauvais’ 48-m-Chor stürzte 1284 teilweise ein.'],
    sources: ['Binding 2000: Was ist Gotik?', 'Heyman 1995: The Stone Skeleton', 'Toman (Hg.) 1998: Die Kunst der Gotik'],
  },
  {
    id: 'kino-24',
    area: 'KUL',
    day: 76,
    hook: 'Warum ruckelt ein Film nicht, obwohl er nur aus Standbildern besteht?',
    mood: 'verspielt',
    ambience: 'uhr',
    images: [],
    draw: {
      streifen(g) {
        filmstrip(g, 20, 200, 4, 80, 0, (i, cx, cy) => ball(g, cx - 20 + i * 12, cy, 10, { fill: 'dicht', d: 500 + i * 100, t: 200 }))
      },
      vierundzwanzig(g) {
        text(g, 180, 450, '24', { anchor: 'middle', size: 80, d: 200 })
        text(g, 180, 495, 'Bilder pro Sekunde', { anchor: 'middle', cls: 's', d: 600 })
      },
      daumenkino(g) {
        for (let i = 0; i < 4; i++) ink(g, RR(110 + i * 10, 420 - i * 10, 140, 100, 4), { w: 2.2, d: i * 150, t: 300 })
        blank(g, RR(140, 390, 140, 100, 4))
        ink(g, RR(140, 390, 140, 100, 4), { w: 2.4, d: 600, t: 300 })
        fig(g, 210, 480, 2, { d: 800, arms: 'up' })
        text(g, 180, 600, 'Daumenkino', { anchor: 'middle', cls: 's', d: 1000 })
      },
      phi(g) {
        ball(g, 110, 470, 14, { fill: 'dicht' })
        ball(g, 250, 470, 14, { fill: 'dicht', d: 400 })
        dashes(g, L([130, 470], [230, 470]), { w: 1.6, d: 800 })
        arrow(g, B([130, 440], [160, 420], [200, 420], [230, 440]), { w: 2.2, d: 1000, t: 400, head: 8 })
        text(g, 180, 560, 'das Gehirn ergänzt die Bewegung', { anchor: 'middle', cls: 's', d: 1200 })
      },
      wertheimer(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '1912', sub: 'Max Wertheimer: Phi-Phänomen', up: true }])
      },
      mythos(g) {
        eye(g, 180, 460, 1.4)
        cross(g, 180, 560, 0.7, 700)
        text(g, 180, 630, 'nicht: „Nachbilder auf der Netzhaut“', { anchor: 'middle', cls: 's', d: 900 })
      },
      blende(g) {
        ball(g, 180, 470, 80)
        for (let k = 0; k < 3; k++) {
          const a0 = k * 120
          const p: P[] = [[180, 470], ...E(180, 470, 78, 78, a0, a0 + 60), [180, 470]]
          hatch(g, p, 400 + k * 100, true)
          ink(g, p, { w: 2, d: 300 + k * 100, t: 300 })
        }
        text(g, 180, 600, 'Flügelblende: jedes Bild 2- bis 3-mal', { anchor: 'middle', cls: 's', d: 900 })
      },
      stumm(g) {
        hbars(g, [
          { label: 'Stummfilm', v: 18, fmt: () => '16–20' },
          { label: 'Tonfilm', v: 24, fmt: () => '24', dense: true },
          { label: 'Videospiel', v: 60, fmt: () => '60 und mehr' },
        ], { x: 30, y: 380, w: 300, h: 36, gap: 76 })
        text(g, 180, 620, 'Bilder pro Sekunde', { anchor: 'middle', cls: 's', d: 1500 })
      },
      ton(g) {
        filmstrip(g, 60, 400, 3, 70, 0)
        ink(g, waveP(66, 280, 540, 6, 20), { w: 1.8, d: 600, t: 600 })
        text(g, 180, 600, 'Tonspur: braucht gleichmäßiges Tempo', { anchor: 'middle', cls: 's', d: 1000 })
      },
      muybridge(g) {
        filmstrip(g, 20, 420, 4, 80, 0, (i, cx, cy) => gallop(g, cx, cy, 1.2, i, 400 + i * 150))
        text(g, 180, 560, 'Muybridge 1878: alle Hufe in der Luft', { anchor: 'middle', cls: 's', d: 1200 })
      },
      hobbit(g) {
        text(g, 180, 450, '48', { anchor: 'middle', size: 70, d: 200 })
        text(g, 180, 495, '„Der Hobbit“ 2012 – vielen zu glatt', { anchor: 'middle', cls: 's', d: 600 })
      },
      ende(g) {
        filmstrip(g, 20, 420, 4, 80, 0, (i, cx, cy) => ball(g, cx - 20 + i * 12, cy, 10, { fill: 'dicht', d: 300 + i * 100, t: 200 }))
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { streifen: {} } },
      { t: T('Ein Kinofilm zeigt **24 Einzelbilder** pro Sekunde. Jedes ist ein Foto, das stillsteht.', 64), gfx: { vierundzwanzig: {} } },
      { t: T('Trotzdem siehst du flüssige Bewegung. Das Prinzip kennst du vom **Daumenkino**.', 64), gfx: { daumenkino: {} } },
      { t: T('Lange hieß es, das Auge halte jedes Bild als **Nachbild** fest, bis das nächste kommt. Das gilt heute als Mythos.', 64), gfx: { mythos: {} } },
      { t: T('Die Bewegung entsteht **im Gehirn**. Es sieht zwei Bilder kurz nacheinander – und ergänzt die Bewegung dazwischen.', 64), gfx: { phi: {} } },
      { t: T('Leuchten zwei Lampen kurz hintereinander auf, scheint ein Licht von einer zur anderen zu **springen**.', 64), gfx: { phi: {} } },
      { t: T('Der Psychologe Max Wertheimer untersuchte das 1912 – das **Phi-Phänomen**. Daraus entstand die Gestaltpsychologie.', 64), gfx: { wertheimer: {} } },
      { t: T('Warum gerade 24? Stummfilme liefen mit **16 bis 20** Bildern, oft von Hand gekurbelt – mal schneller, mal langsamer.', 64), gfx: { stumm: {} } },
      { t: T('Mit dem Tonfilm Ende der 1920er brauchte man ein **festes Tempo**, sonst klingen Stimmen zu hoch oder zu tief.', 64), gfx: { ton: {} } },
      { t: T('24 war ein Kompromiss: flüssig genug – und so **sparsam** mit dem teuren Filmmaterial wie möglich.', 64), gfx: { vierundzwanzig: {} } },
      { t: T('Aber 24 Bilder würden sichtbar **flackern**. Darum zeigt ein Projektor jedes Bild zwei- oder dreimal, unterbrochen von einer Blende.', 64), gfx: { blende: {} } },
      { t: T('So blitzt das Licht 48- oder 72-mal pro Sekunde – zu schnell, um **Flackern** zu sehen.', 64), gfx: { blende: {} } },
      { t: T('Die Vorgeschichte: 1878 fotografierte Eadweard **Muybridge** ein galoppierendes Pferd mit einer Reihe von Kameras.', 64), gfx: { muybridge: {} } },
      { t: T('Seine Bilder bewiesen, dass beim Galopp kurz **alle vier Hufe** in der Luft sind – und wurden eines der ersten Bewegtbilder.', 64), gfx: { muybridge: {} } },
      { t: T('Fernsehen in Europa lief mit **25 Bildern**, passend zum Stromnetz mit 50 Hertz. Kinofilme im Fernsehen liefen darum etwa 4 Prozent schneller.', 64), gfx: { stumm: {} } },
      { t: T('Mehr Bilder wirken nicht automatisch besser: „Der Hobbit“ lief 2012 mit **48 Bildern** – vielen sah das zu sehr nach Fernsehen aus.', 64), gfx: { hobbit: {} } },
      { t: T('Videospiele dagegen laufen gern mit **60 Bildern** und mehr, weil schnelle Reaktionen zählen.', 64), gfx: { stumm: {} } },
      { t: T('Auch Zeichentrick nutzt das: Oft wird nur jedes zweite Bild neu gezeichnet – „**auf Zweien**“, also 12 Zeichnungen pro Sekunde.', 64), gfx: { daumenkino: {} } },
      { t: T('Kino ist eine **Illusion**, die dein Gehirn selbst erzeugt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Filme zeigen 24 Standbilder pro Sekunde; die Bewegung ergänzt das Gehirn (Phi-Phänomen, Wertheimer 1912).', 'Der Tonfilm brauchte festes Tempo – 24 Bilder als Kompromiss; Blenden zeigen jedes Bild 2–3-mal gegen Flackern.', 'Muybridge (1878) zerlegte Bewegung in Bilder; höhere Bildraten wirken nicht immer „filmischer“.'],
    sources: ['Anderson & Anderson 1993, Journal of Film and Video 45 (Mythos Nachbild)', 'Wertheimer 1912, Zeitschrift für Psychologie 61', 'Salt 2009: Film Style and Technology'],
  },
]

/** Drei kleine Arbeiter */
function crowd3(g: Element, x: number, y: number, d = 0): void {
  for (let i = 0; i < 3; i++) fig(g, x + i * 40, y, 2, { d: d + i * 120 })
}
