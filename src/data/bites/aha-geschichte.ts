import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, clock, cross, crowd, dashes, fig, hatch, hbars, ink, question, rays, st, star, text, timeline, type P } from './draw'
import { ball, box, bullets, sun, waveP } from './kit'

// Geschichte: überraschende Zusammenhänge, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Pyramide, Grundlinie y */
function pyramid(g: Element, cx: number, y: number, s = 1, d = 0): void {
  const p: P[] = [[cx - 80 * s, y], [cx, y - 90 * s], [cx + 80 * s, y]]
  hatch(g, [[cx, y - 90 * s], [cx + 80 * s, y], [cx + 10 * s, y], [cx, y - 90 * s]], d + 500)
  ink(g, p, { w: 3, d, t: 700 })
  ink(g, L([cx, y - 90 * s], [cx + 10 * s, y]), { w: 1.8, d: d + 300, t: 400 })
}

/** Rakete, Spitze oben bei (cx, y) */
function rocket(g: Element, cx: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  const body: P[] = [...B(P(0, 0), P(14, 14), P(16, 40), P(16, 90)), P(-16, 90), ...B(P(-16, 90), P(-16, 40), P(-14, 14), P(0, 0)).slice(1)]
  blank(g, body)
  ink(g, body, { w: 2.6, d, t: 600 })
  for (const k of [-1, 1]) ink(g, [P(16 * k, 64), P(28 * k, 96), P(16 * k, 90)], { w: 2.4, d: d + 300, t: 300 })
  ink(g, E(cx, y + 40 * s, 6 * s), { w: 2, d: d + 400, t: 200 })
}

/** Tontafel mit Keilzeichen */
function tablet(g: Element, x: number, y: number, w: number, h: number, d = 0, rows = 4): void {
  const p = RR(x, y, w, h, 16)
  blank(g, p)
  hatch(g, p, d + 300)
  ink(g, p, { w: 3, d, t: 700 })
  for (let r = 0; r < rows; r++) {
    const yy = y + 24 + r * ((h - 40) / Math.max(1, rows - 1))
    const cols = Math.min(4, Math.max(2, Math.floor((w - 20) / 26)))
    for (let c = 0; c < cols; c++) wedge(g, x + 22 + c * ((w - 44) / (cols - 1)), yy, 1, d + 600 + (r * 4 + c) * 50)
  }
}

/** Keil: kleines Dreieck mit Strich */
function wedge(g: Element, x: number, y: number, s = 1, d = 0): void {
  blank(g, [[x - 7 * s, y - 6 * s], [x + 7 * s, y - 6 * s], [x, y + 2 * s], [x - 7 * s, y - 6 * s]])
  ink(g, [[x - 7 * s, y - 6 * s], [x + 7 * s, y - 6 * s], [x, y + 2 * s], [x - 7 * s, y - 6 * s]], { w: 1.8, d, t: 150 })
  ink(g, L([x, y + 2 * s], [x, y + 12 * s]), { w: 1.6, d: d + 100, t: 100 })
}

/** Kalenderblatt mit Kopf und großer Zahl */
function calPage(g: Element, x: number, y: number, w: number, head: string, num: string, d = 0, dense = false): void {
  const h = w * 1.1
  blank(g, RR(x, y, w, h, 8))
  ink(g, RR(x, y, w, h, 8), { w: 2.6, d, t: 500 })
  hatch(g, RR(x, y, w, h * 0.28, 8), d + 200, dense)
  ink(g, L([x + 2, y + h * 0.28], [x + w - 2, y + h * 0.28]), { w: 2, d: d + 200, t: 300 })
  text(g, x + w / 2, y + h * 0.2, head, { anchor: 'middle', size: Math.min(15, (w * 1.6) / Math.max(1, head.length)), d: d + 300, cls: 'halo' })
  text(g, x + w / 2, y + h * 0.75, num, { anchor: 'middle', size: Math.min(w * 0.34, (w * 1.4) / num.length), d: d + 400 })
}

/** Mauerstück aus Platten, Unterkante y */
function wall(g: Element, x0: number, x1: number, y: number, h: number, d = 0): void {
  const n = Math.round((x1 - x0) / 40)
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / n
    const w = (x1 - x0) / n
    hatch(g, [[x + 2, y], [x + 2, y - h], [x + w - 2, y - h], [x + w - 2, y], [x + 2, y]], d + 300 + i * 40)
    ink(g, RR(x + 2, y - h, w - 4, h, 3), { w: 2.2, d: d + i * 60, t: 200 })
  }
  ink(g, B([x0, y - h - 6], [x0 + 10, y - h - 14], [x1 - 10, y - h - 14], [x1, y - h - 6]), { w: 2.8, d: d + 600, t: 500 })
}

export const AHA_GESCHICHTE: Bite[] = [
  {
    id: 'kleopatra',
    area: 'GESCH',
    day: 18,
    hook: 'Lebte Kleopatra näher an den Pyramiden oder an der Mondlandung?',
    mood: 'episch',
    ambience: 'wind',
    images: [img('mondlandung'), img('kleopatra-bueste')],
    draw: {
      beide(g) {
        pyramid(g, 100, 380, 1)
        ink(g, L([10, 382], [190, 382]), { w: 2.4, d: 200, t: 400 })
        rocket(g, 270, 240, 1.2, 500)
      },
      gefuehl(g) {
        pyramid(g, 90, 600, 0.9)
        ink(g, L([10, 602], [250, 602]), { w: 2.4, d: 200, t: 400 })
        fig(g, 220, 600, 2.2, { d: 500 })
        text(g, 120, 650, 'gefühlt: dieselbe Zeit', { anchor: 'middle', cls: 's', d: 900 })
      },
      pyr(g) {
        timeline(g, 30, 330, 470, [{ at: 0.1, label: 'um 2560 v. Chr.', sub: 'Cheops-Pyramide', up: true }])
      },
      kleo(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '2560 v. Chr.', sub: 'Pyramide', up: true },
          { at: 0.85, label: '30 v. Chr.', sub: 'Kleopatra stirbt', big: true },
        ])
      },
      strahl(g) {
        const x0 = 30
        const w = 284
        const at = (yr: number) => x0 + ((yr + 2600) / 4600) * w
        arrow(g, L([x0, 480], [x0 + w + 16, 480]), { w: 3, t: 700, head: 12 })
        for (const [yr, lab, up, d] of [[-2560, 'Pyramide', true, 400], [-30, 'Kleopatra', false, 900], [1969, 'Mond', true, 1400]] as const) {
          ball(g, at(yr), 480, 7, { fill: 'dicht', d, t: 200 })
          text(g, at(yr), up ? 452 : 516, lab, { anchor: 'middle', cls: 's', d: d + 100 })
        }
        dashes(g, L([at(-2560), 560], [at(-30), 560]), { w: 1.6, d: 1700 })
        text(g, (at(-2560) + at(-30)) / 2, 590, '≈ 2.500 Jahre', { anchor: 'middle', cls: 's', d: 1900 })
        dashes(g, L([at(-30), 620], [at(1969), 620]), { w: 1.6, d: 2100 })
        text(g, (at(-30) + at(1969)) / 2, 650, '≈ 2.000 Jahre', { anchor: 'middle', cls: 's', d: 2300 })
      },
      antike(g) {
        fig(g, 90, 600, 4)
        pyramid(g, 250, 600, 1, 300)
        ink(g, L([170, 602], [340, 602]), { w: 2.4, d: 300, t: 400 })
        text(g, 180, 650, 'auch für Römer schon uralt', { anchor: 'middle', cls: 's', d: 1000 })
      },
      herodot(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: 'um 450 v. Chr.', sub: 'Herodot als Tourist', up: true }])
      },
      griechin(g) {
        box(g, 30, 400, 300, 70, 'Ptolemäer: Familie aus Makedonien', { size: 16 })
        text(g, 180, 540, 'erste der Familie, die Ägyptisch sprach', { anchor: 'middle', d: 800 })
      },
      mammut(g) {
        mammoth(g, 180, 600, 1.4)
        text(g, 180, 650, 'Wrangel-Insel: bis etwa 2000 v. Chr.', { anchor: 'middle', cls: 's', d: 1000 })
      },
      oxford(g) {
        hbars(g, [
          { label: 'Universität Oxford', v: 1096, fmt: () => 'Lehre ab 1096' },
          { label: 'Tenochtitlan (Azteken)', v: 1325, fmt: () => 'gegründet 1325', dense: true },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80, max: 1400 })
      },
      dinos(g) {
        hbars(g, [
          { label: 'Stegosaurus → T. rex', v: 83, fmt: () => '≈ 83 Mio. Jahre', dense: true },
          { label: 'T. rex → du', v: 66, fmt: () => '≈ 66 Mio. Jahre' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
      },
      ende(g) {
        pyramid(g, 100, 560, 0.8)
        ink(g, L([20, 562], [180, 562]), { w: 2.4, d: 200, t: 400 })
        rocket(g, 270, 430, 1, 400)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { beide: {} } },
      { t: T('Für viele liegen Kleopatra und die Pyramiden im selben Topf: **altes Ägypten**, irgendwann ganz früh.', 64), gfx: { gefuehl: {} } },
      { t: T('Die Cheops-Pyramide entstand um **2560 vor Christus**.', 64), gfx: { pyr: {} } },
      { t: T('Kleopatra starb im Jahr **30 vor Christus** – fast zweieinhalb Jahrtausende später.', 64), gfx: { kleo: {} } },
      { t: T('Und die Mondlandung? 1969. Von Kleopatra aus gerechnet rund **2.000 Jahre**.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Buzz Aldrin auf dem Mond, 1969' } } },
      { t: T('Kleopatra lebte also **näher an der Mondlandung** als am Bau der Großen Pyramide.', 64), gfx: { strahl: {} } },
      { t: T('Für sie waren die Pyramiden schon **uralte Ruinen** – älter, als das Römische Reich für uns heute ist.', 64), gfx: { antike: {} } },
      { t: T('Schon um 450 vor Christus besuchte der Grieche Herodot die Pyramiden wie ein **Tourist** – und schrieb Legenden darüber auf.', 64), gfx: { herodot: {} } },
      { t: T('Noch eine Überraschung: Kleopatra war keine ägyptische Prinzessin im engeren Sinn. Ihre Familie, die **Ptolemäer**, stammte aus Makedonien.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 40, 1.05], cam2: [50, 40, 1.2], cap: 'Kleopatra VII., Altes Museum Berlin' } } },
      { t: T('Sie soll die erste ihrer Familie gewesen sein, die überhaupt **Ägyptisch** sprach – nach fast 300 Jahren Herrschaft.', 64), gfx: { griechin: {} } },
      { t: T('Als die Pyramiden gebaut wurden, lebten auf einer Insel im Nordpolarmeer übrigens noch **Mammuts**.', 64), gfx: { mammut: {} } },
      { t: T('Die Universität **Oxford** unterrichtete schon, bevor die Azteken ihre Hauptstadt Tenochtitlan gründeten.', 64), gfx: { oxford: {} } },
      { t: T('Und der Tyrannosaurus lebte uns zeitlich **näher** als dem Stegosaurus.', 64), gfx: { dinos: {} } },
      { t: T('Und als Kolumbus 1492 Amerika erreichte, war die Cheops-Pyramide schon über **4.000 Jahre** alt.', 64), gfx: { pyr: {} } },
      { t: T('Warum täuschen wir uns so? Unser Kopf presst ferne Zeit zusammen. Alles vor langer Zeit wird zu **einem Klumpen** „früher“.', 64), gfx: { gefuehl: {} } },
      { t: T('Je weiter weg, desto **gedrängter** wirkt alles – wie Berge am Horizont, die scheinbar dicht beieinanderstehen.', 64), gfx: { strahl: {} } },
      { t: T('Ein Zeitstrahl im richtigen **Maßstab** hilft: Er zeigt, wie riesig die Abstände wirklich sind.', 64), gfx: { strahl: {} } },
      { t: T('Das alte Ägypten dauerte allein rund **3.000 Jahre** – länger als die Zeit von Kleopatra bis heute.', 64), gfx: { kleo: {} } },
      { t: T('Ferne Zeit ist **größer**, als sie sich anfühlt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Cheops-Pyramide ~2560 v. Chr., Kleopatra † 30 v. Chr., Mondlandung 1969: Kleopatra lebte näher an der Mondlandung.', 'Kleopatra stammte aus der makedonischen Ptolemäer-Familie.', 'Unser Gefühl presst ferne Zeiträume zusammen – maßstäbliche Zeitstrahlen helfen.'],
    sources: ['Lehner 1997: The Complete Pyramids', 'Plutarch: Antonius 27 (Kleopatras Sprachen)', 'Vartanyan et al. 1993, Nature 362 (Mammuts der Wrangel-Insel)'],
  },
  {
    id: 'keilschrift',
    area: 'GESCH',
    day: 18,
    hook: 'Wofür wurde die Schrift erfunden – für Gedichte?',
    mood: 'raetsel',
    ambience: 'wind',
    images: [img('keilschrift'), img('ea-nasir')],
    draw: {
      tafel(g) {
        tablet(g, 90, 130, 180, 230)
      },
      uruk(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: 'um 3300 v. Chr.', sub: 'Uruk, Mesopotamien', up: true }])
      },
      gueter(g) {
        for (let i = 0; i < 3; i++) ink(g, [...B([50 + i * 50, 600], [40 + i * 50, 560], [44 + i * 50, 520], [60 + i * 50, 510]), ...B([60 + i * 50, 510], [76 + i * 50, 520], [80 + i * 50, 560], [70 + i * 50, 600]).slice(1), [50 + i * 50, 600]], { w: 2.4, d: i * 150, t: 400 })
        text(g, 110, 640, 'Getreide, Bier', { anchor: 'middle', cls: 's', d: 600 })
        sheep(g, 250, 600, 1.2, 500)
        text(g, 250, 640, 'Schafe', { anchor: 'middle', cls: 's', d: 900 })
      },
      marken(g) {
        ball(g, 180, 480, 70, { fill: 'hell' })
        for (const [x, y] of [[160, 460], [200, 470], [175, 505]] as const) {
          blank(g, E(x, y, 12))
          ink(g, E(x, y, 12), { w: 2, d: 600, t: 200 })
        }
        text(g, 180, 600, 'Zählsteine in einer Tonkugel', { anchor: 'middle', cls: 's', d: 900 })
      },
      druck(g) {
        ink(g, RR(60, 520, 240, 90, 12), { w: 2.8, t: 500 })
        ink(g, L([210, 360], [170, 500]), { w: 4, d: 300, t: 400 })
        wedge(g, 166, 540, 1.4, 900)
        text(g, 180, 660, 'Schilfrohr in feuchten Ton', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zeichen(g) {
        for (let i = 0; i < 3; i++) {
          const x = 70 + i * 110
          box(g, x - 46, 400, 92, 92, '', { d: i * 200 })
          for (let k = 0; k <= i; k++) wedge(g, x - 10 * i + k * 20, 446, 1.2, 400 + i * 200 + k * 80)
          text(g, x, 530, ['1', '2', '3'][i], { anchor: 'middle', d: 600 + i * 200 })
        }
        text(g, 180, 600, 'Zahlen + Zeichen für Dinge', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kushim(g) {
        tablet(g, 60, 380, 120, 160, 0, 3)
        text(g, 260, 440, 'Kuschim', { anchor: 'middle', size: 26, d: 800 })
        text(g, 260, 470, 'ein Buchhalter', { anchor: 'middle', cls: 's', d: 1000 })
      },
      bier(g) {
        for (let i = 0; i < 4; i++) {
          const x = 70 + i * 74
          ink(g, [[x - 20, 440], [x - 14, 560], [x + 14, 560], [x + 20, 440]], { w: 2.4, d: i * 150, t: 300 })
          ink(g, E(x, 440, 20, 6), { w: 2, d: i * 150 + 200, t: 200 })
        }
        text(g, 180, 620, 'Lohn in Bier und Brot', { anchor: 'middle', cls: 's', d: 900 })
      },
      beschwerde(g) {
        tablet(g, 90, 380, 180, 200, 0, 5)
        text(g, 180, 640, 'um 1750 v. Chr.: „schlechtes Kupfer!“', { anchor: 'middle', cls: 's', d: 1200 })
      },
      gilgamesch(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '3300', sub: 'Listen', up: true },
          { at: 0.6, label: 'um 2100', sub: 'Gilgamesch', big: true },
          { at: 0.9, label: 'v. Chr.' },
        ])
      },
      feuer(g) {
        tablet(g, 110, 380, 140, 160)
        for (const x of [130, 180, 230]) ink(g, B([x, 600], [x - 14, 580], [x + 10, 570], [x, 550]), { w: 2.2, d: 900, t: 300 })
        text(g, 180, 650, 'Brände machten die Tafeln hart', { anchor: 'middle', cls: 's', d: 1100 })
      },
      viele(g) {
        for (let i = 0; i < 6; i++) tablet(g, 30 + (i % 3) * 104, 380 + Math.floor(i / 3) * 130, 90, 110, i * 150, 3)
      },
      welt(g) {
        bullets(g, 40, 380, ['Mesopotamien', 'Ägypten', 'China', 'Mittelamerika'], { gap: 52, size: 19 })
        text(g, 180, 620, 'unabhängig voneinander erfunden', { anchor: 'middle', cls: 's', d: 1600 })
      },
      ende(g) {
        tablet(g, 110, 380, 140, 180)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { tafel: {} } },
      { t: T('Die älteste bekannte Schrift entstand vor über 5.000 Jahren in **Mesopotamien** – im heutigen Irak, in Städten wie Uruk.', 64), gfx: { uruk: {} } },
      { t: T('Und die ersten Texte sind keine Gedichte, keine Gebete, keine Geschichten. Sie sind **Buchhaltung**.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Frühe Verwaltungstafel aus Uruk' } } },
      { t: T('Listen über Getreide, Bier, Schafe, **Arbeitsstunden**: Wer hat was geliefert, wer schuldet wem?', 64), gfx: { gueter: {} } },
      { t: T('In wachsenden Städten verwalteten Tempel riesige Vorräte. Kein Gedächtnis kann sich das alles **merken**.', 64), gfx: { gueter: {} } },
      { t: T('Vorher nutzte man kleine **Zählsteine** aus Ton – je Schaf ein Stein, verschlossen in einer Tonkugel.', 64), gfx: { marken: {} } },
      { t: T('Irgendwann drückte man die Zeichen einfach außen in den Ton. Und bald brauchte man die Steine gar nicht mehr: Die **Zeichen** genügten.', 64), gfx: { marken: {} } },
      { t: T('Geschrieben wurde mit einem angespitzten **Schilfrohr** in feuchten Ton. Jeder Eindruck sah aus wie ein Keil.', 64), gfx: { druck: {} } },
      { t: T('Daher der Name: **Keilschrift**. Aus Zahlen und Bildzeichen für Dinge wurde nach und nach eine Schrift für ganze Sätze.', 64), gfx: { zeichen: {} } },
      { t: T('Einer der ersten Menschen, dessen Namen wir kennen, war vermutlich ein **Buchhalter**: Auf vielen Tafeln steht „Kuschim“.', 64), gfx: { kushim: {} } },
      { t: T('Viele Tafeln verzeichnen **Rationen**: Arbeiter bekamen ihren Lohn in Brot und Bier.', 64), gfx: { bier: {} } },
      { t: T('Erhalten ist sogar eine der ältesten **Beschwerden**: Ein Kunde namens Nanni schimpft um 1750 vor Christus über minderwertiges Kupfer.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Beschwerde an Ea-nasir, British Museum' } } },
      { t: T('Gelernt wurde in Schreiberschulen – jahrelang, mit **Hunderten** von Zeichen. Lesen und Schreiben blieb Sache weniger Fachleute.', 64), gfx: { zeichen: {} } },
      { t: T('Literatur kam erst viel später. Das **Gilgamesch-Epos**, eines der ältesten Werke, wurde rund tausend Jahre danach aufgeschrieben.', 64), gfx: { gilgamesch: {} } },
      { t: T('Ton ist erstaunlich haltbar. Brannten Städte ab, wurden die Tafeln **hart gebrannt** – und blieben Jahrtausende erhalten.', 64), gfx: { feuer: {} } },
      { t: T('Heute kennen wir **Hunderttausende** Keilschrifttafeln. Viele sind noch nicht einmal übersetzt.', 64), gfx: { viele: {} } },
      { t: T('Entziffert wurde die Schrift im 19. Jahrhundert – unter anderem mit Hilfe einer riesigen **Felsinschrift** in drei Sprachen im heutigen Iran.', 64), gfx: { zeichen: {} } },
      { t: T('Schrift wurde mehrmals **unabhängig** erfunden: auch in Ägypten, China und Mittelamerika.', 64), gfx: { welt: {} } },
      { t: T('Am Anfang der Schrift steht **eine Liste**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die Keilschrift entstand um 3300 v. Chr. in Mesopotamien – zuerst für Buchhaltung (Getreide, Bier, Schafe).', 'Vorläufer waren Zählsteine; geschrieben wurde mit Schilfrohr in Ton.', 'Literatur wie das Gilgamesch-Epos kam erst viel später; Schrift wurde mehrfach unabhängig erfunden.'],
    sources: ['Schmandt-Besserat 1996: How Writing Came About', 'Nissen, Damerow & Englund 1993: Archaic Bookkeeping', 'British Museum: Beschwerdetafel an Ea-nasir (BM 131236)'],
  },
  {
    id: 'woche-sieben',
    area: 'GESCH',
    day: 18,
    hook: 'Warum hat die Woche sieben Tage?',
    mood: 'kosmisch',
    ambience: 'nacht',
    images: [img('astro-tafel'), img('revolutionskalender')],
    draw: {
      sieben(g) {
        for (let i = 0; i < 7; i++) calPage(g, 26 + (i % 4) * 80, 100 + Math.floor(i / 4) * 130, 68, ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i], String(i + 1), i * 100, i > 4)
      },
      natur(g) {
        sun(g, 90, 440, 30)
        text(g, 90, 520, 'Tag', { anchor: 'middle', cls: 's', d: 500 })
        moonFull(g, 270, 440, 30, 300)
        text(g, 270, 520, 'Monat', { anchor: 'middle', cls: 's', d: 700 })
        question(g, 180, 600, 0.6, 1000)
        text(g, 180, 650, 'Woche: kein Vorbild am Himmel?', { anchor: 'middle', cls: 's', d: 1200 })
      },
      phasen(g) {
        for (let i = 0; i < 4; i++) {
          const x = 60 + i * 80
          ink(g, E(x, 470, 26), { w: 2.4, d: i * 200, t: 400 })
          if (i === 0) hatch(g, E(x, 470, 26), 400, true)
          if (i === 1) hatch(g, [...E(x, 470, 26, 26, 90, 270), [x, 444]], 600, true)
          if (i === 3) hatch(g, [...E(x, 470, 26, 26, -90, 90), [x, 496]], 900, true)
        }
        text(g, 180, 560, 'je etwa 7,4 Tage', { anchor: 'middle', d: 1100 })
      },
      planeten(g) {
        bullets(g, 40, 350, ['Sonne', 'Mond', 'Mars', 'Merkur', 'Jupiter', 'Venus', 'Saturn'], { gap: 42, size: 18, step: 200 })
        text(g, 300, 480, '7', { anchor: 'middle', size: 70, d: 1600 })
      },
      babylon(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: 'Babylon', sub: 'Sieben als heilige Zahl', up: true },
          { at: 0.55, label: 'Sabbat', sub: 'jüdische Woche', big: true },
          { at: 0.88, label: 'Rom', sub: 'Planetenwoche', up: true },
        ])
      },
      namen(g) {
        const rows: [string, string][] = [['Sonntag', 'Sonne'], ['Montag', 'Mond'], ['mardi', 'Mars'], ['mercredi', 'Merkur'], ['Donnerstag', 'Donar = Jupiter'], ['Freitag', 'Frigg = Venus'], ['Saturday', 'Saturn']]
        rows.forEach(([a, b], i) => {
          text(g, 150, 340 + i * 44, a, { anchor: 'end', size: 18, d: i * 200 })
          text(g, 170, 340 + i * 44, b, { cls: 's', d: i * 200 + 100 })
        })
      },
      konstantin(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '321 n. Chr.', sub: 'Kaiser Konstantin: Sonntag frei', up: true }])
      },
      revolution(g) {
        for (let i = 0; i < 10; i++) calPage(g, 30 + (i % 5) * 62, 380 + Math.floor(i / 5) * 76, 52, '', String(i + 1), i * 60, i === 9)
        text(g, 180, 560, '1793: Woche mit zehn Tagen', { anchor: 'middle', cls: 's', d: 900 })
        cross(g, 180, 620, 0.7, 1300)
      },
      sowjet(g) {
        for (let i = 0; i < 5; i++) calPage(g, 30 + i * 62, 420, 52, '', String(i + 1), i * 80)
        text(g, 180, 540, '1929: Fünf-Tage-Woche ohne gemeinsamen Ruhetag', { anchor: 'middle', cls: 's', d: 700 })
        cross(g, 180, 600, 0.7, 1200)
      },
      familie(g) {
        crowd(g, 80, 600, 5, 50, 2.6)
        cross(g, 180, 440, 0.7, 900)
        text(g, 180, 650, 'Familien hatten nie zusammen frei', { anchor: 'middle', cls: 's', d: 1100 })
      },
      welt(g) {
        ball(g, 180, 470, 80, { fill: 'hell' })
        text(g, 180, 486, '7', { anchor: 'middle', size: 48, d: 600, cls: 'halo' })
        text(g, 180, 610, 'heute fast überall auf der Welt', { anchor: 'middle', cls: 's', d: 900 })
      },
      ende(g) {
        for (let i = 0; i < 7; i++) calPage(g, 20 + i * 47, 470, 40, '', String(i + 1), i * 100, i > 4)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { sieben: {} } },
      { t: T('Tag, Monat und Jahr haben ein **Vorbild am Himmel**: Erddrehung, Mondumlauf, Sonnenlauf. Die Woche nicht.', 64), gfx: { natur: {} } },
      { t: T('Ein möglicher Ursprung: Der Mond wechselt seine Gestalt in vier Schritten – jeder dauert etwa **sieben Tage**.', 64), gfx: { phasen: {} } },
      { t: T('Ganz glatt geht das nicht auf: Ein Mondmonat hat 29,5 Tage. Viermal sieben ergibt nur **28**.', 64), gfx: { phasen: {} } },
      { t: T('Wichtiger war wohl der Himmel bei Nacht. Mit bloßem Auge sah man **sieben** Himmelskörper, die vor den Sternen wandern.', 64), gfx: { planeten: {} } },
      { t: T('Sonne, Mond, Mars, Merkur, Jupiter, Venus und Saturn. Für die Babylonier war die Sieben darum eine **heilige Zahl**.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Babylonische Sternenliste MUL.APIN' } } },
      { t: T('Das Judentum prägte die Woche mit dem **Sabbat**: sechs Tage Arbeit, am siebten Ruhe – wie in der Schöpfungsgeschichte.', 64), gfx: { babylon: {} } },
      { t: T('Die Römer verbanden beides: Jeder Wochentag bekam einen **Planeten** als Schutzherrn.', 64), gfx: { babylon: {} } },
      { t: T('Das steckt bis heute in den Namen: **Sonntag** und Montag nach Sonne und Mond. Im Französischen heißt Dienstag mardi – nach Mars.', 64), gfx: { namen: {} } },
      { t: T('Die Germanen setzten eigene Götter ein: **Donar** für Jupiter im Donnerstag, Frigg für Venus im Freitag.', 64), gfx: { namen: {} } },
      { t: T('Und im Englischen steckt im Saturday noch der **Saturn**.', 64), gfx: { namen: {} } },
      { t: T('In vielen Sprachen heißt der Samstag noch nach dem **Sabbat**: sábado, sabato, Samstag.', 64), gfx: { namen: {} } },
      { t: T('321 erklärte Kaiser Konstantin den Sonntag im Römischen Reich zum **Ruhetag**.', 64), gfx: { konstantin: {} } },
      { t: T('Seitdem versuchten Revolutionäre, die Woche abzuschaffen. Das revolutionäre Frankreich führte 1793 eine Woche mit **zehn Tagen** ein.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Republikanischer Kalender, Frankreich' } } },
      { t: T('Nur jeder zehnte Tag war frei. Die Leute murrten – Napoleon schaffte den Kalender **wieder ab**.', 64), gfx: { revolution: {} } },
      { t: T('Die Sowjetunion probierte ab 1929 eine **Fünf-Tage-Woche**, in der jeder an einem anderen Tag frei hatte.', 64), gfx: { sowjet: {} } },
      { t: T('Die Maschinen liefen ohne Pause – aber Familien und Freunde hatten **nie gemeinsam** frei. 1940 kehrte man zur Sieben-Tage-Woche zurück.', 64), gfx: { familie: {} } },
      { t: T('Heute zählt fast die ganze Welt in Wochen zu **sieben Tagen** – ein Erbe von Sternguckern, Priestern und Kaisern.', 64), gfx: { welt: {} } },
      { t: T('Die Woche ist ein **Erbe des Himmels**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die Woche hat kein exaktes Himmelsvorbild; Mondviertel (~7,4 Tage) und sieben sichtbare Wandelgestirne gaben die Zahl.', 'Jüdischer Sabbat und römische Planetenwoche prägten sie; Wochentagsnamen erinnern an Planeten und Götter.', 'Versuche mit 10-Tage- (Frankreich 1793) und 5-Tage-Wochen (UdSSR 1929) scheiterten.'],
    sources: ['Zerubavel 1985: The Seven Day Circle', 'Richards 1998: Mapping Time – The Calendar and Its History', 'Duden: Herkunftswörterbuch (Wochentage)'],
  },
  {
    id: 'oktoberrevolution',
    area: 'GESCH',
    day: 50,
    hook: 'Warum fand die Oktoberrevolution im November statt?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [img('winterpalast'), img('gregor')],
    draw: {
      blaetter(g) {
        calPage(g, 40, 120, 120, 'Oktober', '25')
        calPage(g, 200, 120, 120, 'November', '7', 400, true)
      },
      zwei(g) {
        calPage(g, 40, 380, 120, 'Russland', '25. Okt.', 0)
        calPage(g, 200, 380, 120, 'Westen', '7. Nov.', 300, true)
        text(g, 180, 640, 'derselbe Tag: 1917', { anchor: 'middle', cls: 's', d: 900 })
      },
      caesar(g) {
        timeline(g, 30, 330, 470, [{ at: 0.2, label: '45 v. Chr.', sub: 'Julius Caesar', up: true }])
      },
      jahr(g) {
        text(g, 180, 430, '365,25 Tage', { anchor: 'middle', size: 34, d: 200 })
        text(g, 180, 470, 'julianisches Jahr', { anchor: 'middle', cls: 's', d: 400 })
        text(g, 180, 540, '365,2422 Tage', { anchor: 'middle', size: 34, d: 800 })
        text(g, 180, 580, 'Sonnenjahr', { anchor: 'middle', cls: 's', d: 1000 })
      },
      drift(g) {
        hbars(g, [
          { label: 'pro Jahr', v: 11, fmt: () => '11 Minuten' },
          { label: 'bis 1582', v: 240, fmt: () => '10 Tage', dense: true },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
        text(g, 180, 590, 'Ostern rutschte durchs Jahr', { anchor: 'middle', cls: 's', d: 1200 })
      },
      gregor(g) {
        calPage(g, 40, 400, 120, 'Oktober 1582', '4', 0)
        arrow(g, L([170, 470], [190, 470]), { w: 2.4, d: 500, t: 200, head: 8 })
        calPage(g, 200, 400, 120, 'am nächsten Tag', '15', 600, true)
        text(g, 180, 600, 'Papst Gregor XIII. streicht 10 Tage', { anchor: 'middle', cls: 's', d: 1000 })
      },
      regel(g) {
        bullets(g, 40, 380, ['alle 4 Jahre: Schaltjahr', 'volle 100: keins (1900)', 'volle 400: doch (2000)'], { gap: 56, size: 19 })
      },
      laender(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: '1582', sub: 'katholisch', up: true },
          { at: 0.35, label: '1700', sub: 'evangel. Deutschland' },
          { at: 0.5, label: '1752', sub: 'England', up: true },
          { at: 0.93, label: '1918', sub: 'Russland', big: true },
        ])
      },
      england(g) {
        calPage(g, 40, 400, 120, 'September 1752', '2', 0)
        arrow(g, L([170, 470], [190, 470]), { w: 2.4, d: 500, t: 200, head: 8 })
        calPage(g, 200, 400, 120, 'am nächsten Tag', '14', 600, true)
      },
      weihnacht(g) {
        star(g, 180, 400, 30, { fill: true })
        calPage(g, 120, 470, 120, 'orthodox', '7. Jan.', 400)
        text(g, 180, 660, 'Weihnachten nach altem Kalender', { anchor: 'middle', cls: 's', d: 900 })
      },
      shakespeare(g) {
        fig(g, 90, 560, 3.6)
        fig(g, 270, 560, 3.6, { d: 200 })
        text(g, 90, 600, 'Shakespeare', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 270, 600, 'Cervantes', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 180, 430, 'beide † „23. April 1616“', { anchor: 'middle', d: 900 })
        text(g, 180, 650, 'aber 10 Tage auseinander', { anchor: 'middle', cls: 's', d: 1200 })
      },
      rest(g) {
        text(g, 180, 450, '1 Tag', { anchor: 'middle', size: 50, d: 200 })
        text(g, 180, 495, 'Fehler in rund 3.200 Jahren', { anchor: 'middle', cls: 's', d: 600 })
      },
      ende(g) {
        calPage(g, 40, 400, 120, 'Oktober', '25', 0)
        text(g, 180, 476, '=', { anchor: 'middle', size: 36, d: 400 })
        calPage(g, 200, 400, 120, 'November', '7', 500, true)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { blaetter: {} } },
      { t: T('Die Bolschewiki stürmten den Winterpalast in Petrograd am **25. Oktober 1917**. Daher der Name.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Winterpalast, Sankt Petersburg' } } },
      { t: T('In Berlin, Paris oder London war an diesem Tag aber schon der **7. November**.', 64), gfx: { zwei: {} } },
      { t: T('Russland rechnete noch mit einem älteren Kalender – dem **julianischen**, eingeführt von Julius Caesar.', 64), gfx: { caesar: {} } },
      { t: T('Caesars Jahr dauert genau 365 Tage und 6 Stunden. Das echte Sonnenjahr ist etwa **11 Minuten** kürzer.', 64), gfx: { jahr: {} } },
      { t: T('11 Minuten klingen nach nichts. Doch über Jahrhunderte summierten sie sich: Bis 1582 war der Kalender **zehn Tage** voraus.', 64), gfx: { drift: {} } },
      { t: T('Das störte vor allem die Kirche: Der **Ostertermin** hängt am Frühlingsbeginn – und der verschob sich im Kalender.', 64), gfx: { drift: {} } },
      { t: T('Papst Gregor XIII. griff 1582 durch: Auf Donnerstag, den 4. Oktober, folgte direkt **Freitag, der 15. Oktober**.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.2] } } },
      { t: T('Und eine neue Schaltjahr-Regel: Volle Jahrhunderte sind **keine** Schaltjahre – außer sie sind durch 400 teilbar. Darum war 2000 eins.', 64), gfx: { regel: {} } },
      { t: T('Katholische Länder machten sofort mit. Viele protestantische Länder wollten keinen Kalender **vom Papst**.', 64), gfx: { laender: {} } },
      { t: T('Die evangelischen Gebiete Deutschlands wechselten erst 1700, Großbritannien 1752. Dort folgte auf den 2. September der **14.**', 64), gfx: { england: {} } },
      { t: T('Russland blieb beim alten Kalender – bis zur Revolution. Erst 1918 sprangen die Bolschewiki selbst **13 Tage** nach vorn.', 64), gfx: { laender: {} } },
      { t: T('Darum wurde der Jahrestag der Oktoberrevolution in der Sowjetunion stets im **November** gefeiert.', 64), gfx: { zwei: {} } },
      { t: T('Viele orthodoxe Kirchen rechnen bis heute julianisch. Sie feiern Weihnachten darum am **7. Januar**.', 64), gfx: { weihnacht: {} } },
      { t: T('Ein schöner Zufall: Shakespeare und Cervantes starben beide am „23. April 1616“ – aber nach verschiedenen Kalendern, also **zehn Tage** auseinander.', 64), gfx: { shakespeare: {} } },
      { t: T('Perfekt ist auch Gregors Kalender nicht. Sein Jahr ist ein paar Sekunden zu lang – macht etwa **einen Tag** in 3.200 Jahren.', 64), gfx: { rest: {} } },
      { t: T('Ein Problem für unsere Ur-Ur-Urenkel. Bis dahin dürfte der Kalender **reichen**.', 64), gfx: { rest: {} } },
      { t: T('Zwei Kalender – **ein Tag**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Russland nutzte 1917 noch den julianischen Kalender: 25. Oktober = 7. November (gregorianisch).', 'Das julianische Jahr ist ~11 Minuten zu lang; Gregor XIII. strich 1582 zehn Tage und änderte die Schaltregel.', 'Protestantische Länder folgten später (England 1752), Russland erst 1918; orthodoxe Kirchen feiern Weihnachten am 7. Januar.'],
    sources: ['Richards 1998: Mapping Time', 'Physikalisch-Technische Bundesanstalt: Der Gregorianische Kalender', 'Figes 1996: A People’s Tragedy'],
  },
  {
    id: 'sarajevo',
    area: 'GESCH',
    day: 50,
    hook: 'Wie konnte eine falsche Abzweigung einen Weltkrieg auslösen?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [img('franz-ferdinand'), img('princip')],
    draw: {
      karte(g) {
        ink(g, waveP(20, 340, 310, 4, 60), { w: 2.2, t: 700 })
        ink(g, L([20, 280], [340, 280]), { w: 3, d: 200, t: 600 })
        ink(g, L([200, 278], [200, 110]), { w: 3, d: 400, t: 400 })
        arrow(g, [[40, 266], [190, 266], [190, 200]], { w: 2.6, d: 800, t: 900, head: 10 })
        cross(g, 214, 190, 0.5, 1500)
      },
      sarajevo(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '28. Juni 1914', sub: 'Sarajevo', up: true }])
      },
      auto(g) {
        oldCar(g, 180, 560, 1.6)
        fig(g, 160, 506, 1.4, { d: 600 })
        fig(g, 186, 506, 1.4, { d: 700 })
        text(g, 180, 620, 'Franz Ferdinand und Sophie', { anchor: 'middle', cls: 's', d: 1000 })
      },
      bombe(g) {
        oldCar(g, 100, 560, 1.1)
        oldCar(g, 260, 560, 1.1, 300)
        ball(g, 260, 470, 12, { fill: 'dicht', d: 700 })
        rays(g, 260, 470, 18, 30, 8, 900)
        ink(g, L([20, 562], [340, 562]), { w: 2, d: 100, t: 500 })
        text(g, 180, 620, 'die Bombe trifft das Auto dahinter', { anchor: 'middle', cls: 's', d: 1100 })
      },
      route(g) {
        ink(g, waveP(20, 340, 600, 4, 60), { w: 2.2, t: 700 })
        text(g, 300, 640, 'Fluss', { anchor: 'middle', cls: 's', d: 300 })
        ink(g, L([20, 560], [340, 560]), { w: 3, d: 200, t: 600 })
        text(g, 290, 548, 'Uferstraße', { anchor: 'middle', cls: 's', d: 400 })
        ink(g, L([200, 558], [200, 380]), { w: 3, d: 400, t: 400 })
        text(g, 216, 400, 'Seitenstraße', { cls: 's', d: 500 })
        arrow(g, [[40, 546], [186, 546], [186, 460]], { w: 2.6, d: 900, t: 900, head: 10 })
        fig(g, 140, 500, 1.4, { d: 1500 })
      },
      princip(g) {
        fig(g, 180, 600, 4.6)
        text(g, 180, 650, 'Gavrilo Princip, 19 Jahre', { anchor: 'middle', cls: 's', d: 700 })
      },
      kette(g) {
        const rows = ['Österreich-Ungarn', 'Serbien', 'Russland', 'Deutschland', 'Frankreich', 'Großbritannien']
        rows.forEach((r, i) => {
          const y = 330 + i * 56
          box(g, 70, y, 220, 40, r, { size: 15, d: i * 250, fill: i % 2 === 0 })
          if (i < rows.length - 1) arrow(g, L([180, y + 42], [180, y + 54]), { w: 2, d: i * 250 + 200, t: 100, head: 6 })
        })
      },
      woche(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '28. Juli', sub: 'Krieg gegen Serbien', up: true },
          { at: 0.55, label: '1.–3. Aug.', sub: 'Deutschland erklärt' },
          { at: 0.9, label: '4. Aug.', sub: 'Großbritannien', up: true },
        ])
      },
      ursachen(g) {
        bullets(g, 40, 380, ['Bündnisse', 'Wettrüsten', 'Nationalismus', 'starre Kriegspläne'], { gap: 52, size: 19 })
        text(g, 180, 620, 'das Pulverfass war schon da', { anchor: 'middle', cls: 's', d: 1600 })
      },
      funke(g) {
        ink(g, RR(110, 440, 140, 140, 12), { w: 3, t: 600 })
        hatch(g, RR(110, 440, 140, 140, 12), 400, true)
        ink(g, B([250, 460], [290, 440], [300, 400], [320, 380]), { w: 2, d: 700, t: 400 })
        rays(g, 320, 370, 6, 16, 8, 1100)
        text(g, 180, 630, 'Zufall als Funke', { anchor: 'middle', cls: 's', d: 1300 })
      },
      tote(g) {
        text(g, 180, 450, '≈ 17 Mio.', { anchor: 'middle', size: 50, d: 200 })
        text(g, 180, 495, 'Tote im Ersten Weltkrieg', { anchor: 'middle', cls: 's', d: 600 })
      },
      schlafwandler(g) {
        crowd(g, 70, 600, 5, 56, 2.8)
        text(g, 180, 650, '„Die Schlafwandler“ (Christopher Clark)', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 600 })
        ink(g, L([200, 558], [200, 380]), { w: 3, d: 300, t: 400 })
        arrow(g, [[40, 546], [186, 546], [186, 460]], { w: 2.6, d: 600, t: 900, head: 10 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { karte: {} } },
      { t: T('Sarajevo, 28. Juni 1914. Der österreichische Thronfolger **Franz Ferdinand** besucht mit seiner Frau Sophie die Stadt.', 64), gfx: { sarajevo: {} } },
      { t: T('Sie fahren im **offenen Wagen** durch die Straßen. Entlang der Route warten mehrere junge Verschwörer.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Franz Ferdinand und Sophie, 28. Juni 1914' } } },
      { t: T('Einer wirft eine **Bombe**. Sie prallt ab und explodiert unter dem folgenden Wagen. Das Paar bleibt unverletzt.', 64), gfx: { bombe: {} } },
      { t: T('Nach einem Empfang im Rathaus will Franz Ferdinand die **Verletzten** im Krankenhaus besuchen.', 64), gfx: { auto: {} } },
      { t: T('Doch niemand sagt dem Fahrer, dass sich die Route geändert hat. An einer Kreuzung biegt er **falsch** ab.', 64), gfx: { route: {} } },
      { t: T('Jemand ruft. Der Fahrer **bremst** und will zurücksetzen. Der Wagen steht still.', 64), gfx: { route: {} } },
      { t: T('Genau dort steht einer der Verschwörer: der 19-jährige **Gavrilo Princip**. Er hatte den Plan eigentlich schon aufgegeben.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.2] } } },
      { t: T('Er schießt zweimal. Franz Ferdinand und Sophie **sterben** wenige Minuten später.', 64), gfx: { princip: {} } },
      { t: T('Was folgt, ist eine **Kettenreaktion**: Österreich-Ungarn stellt Serbien ein Ultimatum, das kaum zu erfüllen ist.', 64), gfx: { kette: {} } },
      { t: T('Russland steht zu Serbien, Deutschland zu Österreich-Ungarn, Frankreich zu Russland. Bündnis zieht **Bündnis** nach sich.', 64), gfx: { kette: {} } },
      { t: T('Als deutsche Truppen durch das neutrale Belgien marschieren, tritt auch **Großbritannien** in den Krieg ein.', 64), gfx: { kette: {} } },
      { t: T('Zwischen der ersten Kriegserklärung und der britischen vergeht nur **eine Woche**.', 64), gfx: { woche: {} } },
      { t: T('Hat also ein Fahrfehler den Weltkrieg verursacht? **Nein**, sagen Historiker. Er war der Funke – nicht das Pulverfass.', 64), gfx: { funke: {} } },
      { t: T('Bündnisse, Wettrüsten, Nationalismus und starre **Kriegspläne** hatten Europa längst gefährlich aufgeladen.', 64), gfx: { ursachen: {} } },
      { t: T('Der Historiker Christopher Clark nennt die Politiker von 1914 **Schlafwandler**: Keiner wollte den großen Krieg so recht – aber alle liefen hinein.', 64), gfx: { schlafwandler: {} } },
      { t: T('Viele zogen im August 1914 begeistert los. Sie glaubten, zu **Weihnachten** wieder zu Hause zu sein. Der Krieg dauerte über vier Jahre.', 64), gfx: { woche: {} } },
      { t: T('Am Ende sterben rund **17 Millionen** Menschen.', 64), gfx: { tote: {} } },
      { t: T('Princip war zu jung für die Todesstrafe. Er starb 1918 in Haft – noch **vor Kriegsende**.', 64), gfx: { princip: {} } },
      { t: T('Ein Zufall **zündet** – aber das Pulver lag schon bereit.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['28. Juni 1914: Nach einem gescheiterten Bombenanschlag bog der Wagen falsch ab und hielt genau vor Gavrilo Princip.', 'Das Attentat löste über Ultimatum und Bündnisse binnen einer Woche einen europäischen Krieg aus.', 'Ursachen waren Bündnisse, Wettrüsten, Nationalismus und Kriegspläne – der Zufall war nur der Funke.'],
    sources: ['Clark 2012: Die Schlafwandler', 'Dedijer 1966: The Road to Sarajevo', 'Deutsches Historisches Museum: Das Attentat von Sarajevo'],
  },
  {
    id: 'mauerfall',
    area: 'GESCH',
    day: 66,
    hook: 'Fiel die Berliner Mauer wegen eines Versprechers?',
    mood: 'episch',
    ambience: 'stadt',
    images: [img('berliner-mauer'), img('schabowski'), img('mauerfall')],
    draw: {
      mauer(g) {
        wall(g, 30, 330, 380, 120)
        crowd(g, 60, 220, 6, 48, 2)
      },
      bau(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '1961', sub: 'Mauerbau', up: true },
          { at: 0.85, label: '1989', sub: 'Mauerfall', big: true },
        ])
      },
      ungarn(g) {
        ink(g, L([60, 600], [300, 600]), { w: 2.4, t: 500 })
        for (let i = 0; i < 6; i++) ink(g, L([80 + i * 40, 600], [80 + i * 40, 480]), { w: 2, d: 200 + i * 60, t: 200 })
        dashes(g, L([60, 520], [300, 520]), { w: 1.6, d: 600 })
        crowd(g, 120, 440, 4, 36, 1.6, 900)
        text(g, 180, 650, 'Sommer 1989: Flucht über Ungarn', { anchor: 'middle', cls: 's', d: 1200 })
      },
      leipzig(g) {
        crowd(g, 40, 600, 8, 40, 2.4)
        text(g, 180, 650, 'Leipzig, 9. Oktober: rund 70.000', { anchor: 'middle', cls: 's', d: 1000 })
      },
      presse(g) {
        fig(g, 180, 560, 3, { d: 300 })
        blank(g, RR(60, 520, 240, 40, 4))
        ink(g, RR(60, 520, 240, 40, 4), { w: 2.8, t: 500 })
        ink(g, L([226, 518], [218, 486]), { w: 2.2, d: 700, t: 200 })
        ink(g, E(217, 480, 6), { w: 2, d: 800, t: 200 })
        text(g, 180, 600, '9. November 1989, kurz vor 19 Uhr', { anchor: 'middle', cls: 's', d: 900 })
      },
      zettel(g) {
        ink(g, RR(90, 380, 180, 220, 4), { w: 2.8, t: 500 })
        for (let i = 0; i < 7; i++) ink(g, L([110, 420 + i * 24], [250 - (i % 3) * 30, 420 + i * 24]), { w: 1.4, d: 300 + i * 80, t: 200 })
        question(g, 300, 420, 0.6, 1100)
      },
      sofort(g) {
        text(g, 180, 430, '„Das tritt nach meiner', { anchor: 'middle', cls: 'it', size: 22, d: 200 })
        text(g, 180, 464, 'Kenntnis … ist das sofort,', { anchor: 'middle', cls: 'it', size: 22, d: 400 })
        text(g, 180, 498, 'unverzüglich.“', { anchor: 'middle', cls: 'it', size: 22, d: 600 })
        text(g, 180, 560, 'Günter Schabowski', { anchor: 'middle', cls: 's', d: 1000 })
      },
      tv(g) {
        ink(g, RR(80, 400, 200, 150, 14), { w: 3, t: 600 })
        ink(g, RR(96, 416, 168, 118, 8), { w: 2, d: 300, t: 400 })
        text(g, 180, 482, 'Tor offen', { anchor: 'middle', size: 22, d: 700 })
        ink(g, L([140, 552], [120, 590]), { w: 2.4, d: 500, t: 200 })
        ink(g, L([220, 552], [240, 590]), { w: 2.4, d: 500, t: 200 })
      },
      menge(g) {
        wall(g, 230, 340, 600, 120)
        crowd(g, 30, 600, 6, 32, 2.2)
        text(g, 180, 650, 'Bornholmer Straße, abends', { anchor: 'middle', cls: 's', d: 1000 })
      },
      jaeger(g) {
        fig(g, 120, 600, 4)
        ink(g, L([220, 600], [220, 470]), { w: 2.8, d: 400, t: 400 })
        const bar = st(g, 'm1', '--m1: rotate(-70deg); transform-origin: 220px 470px; transition-duration: 1.4s; --dl: 800ms')
        ink(bar, L([220, 470], [330, 470]), { w: 3, t: 300 })
        text(g, 120, 650, 'Harald Jäger', { anchor: 'middle', cls: 's', d: 900 })
      },
      offen(g) {
        wall(g, 30, 140, 600, 120)
        wall(g, 220, 330, 600, 120, 200)
        crowd(g, 160, 600, 3, 22, 1.8, 800)
        text(g, 180, 650, 'kein einziger Schuss', { anchor: 'middle', cls: 's', d: 1200 })
      },
      einheit(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.15, label: '9. Nov. 1989', sub: 'Mauerfall', up: true },
          { at: 0.8, label: '3. Okt. 1990', sub: 'Einheit', big: true },
        ])
      },
      ende(g) {
        wall(g, 30, 140, 600, 100)
        wall(g, 220, 330, 600, 100, 200)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { mauer: {} } },
      { t: T('Seit 1961 teilte die Mauer Berlin. Mindestens **140 Menschen** starben bei Fluchtversuchen an ihr.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Im Sommer 1989 bröckelte die DDR: Ungarn öffnete seine Grenze, Zehntausende flohen über Ungarn und Österreich **in den Westen**.', 64), gfx: { ungarn: {} } },
      { t: T('Gleichzeitig demonstrierten jeden Montag mehr Menschen. Am 9. Oktober zogen in Leipzig rund **70.000** friedlich durch die Stadt.', 64), gfx: { leipzig: {} } },
      { t: T('Die Führung der DDR wollte Druck ablassen und plante eine **neue Reiseregelung**. Sie sollte am nächsten Morgen gelten – mit Antrag.', 64), gfx: { zettel: {} } },
      { t: T('Am 9. November gab Politbüro-Mitglied **Günter Schabowski** eine live übertragene Pressekonferenz.', 64), gfx: { presse: {} } },
      { t: T('Kurz vorher hatte er einen **Zettel** mit der Regelung bekommen – ohne Erklärung, ohne Sperrfrist.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Schabowskis Notizzettel, Haus der Geschichte' } } },
      { t: T('Er las ihn stockend vor. Ein Journalist fragte: **Ab wann** gilt das?', 64), gfx: { presse: {} } },
      { t: T('Schabowski blätterte, zögerte – und sagte: „Das tritt nach meiner Kenntnis … ist das **sofort, unverzüglich**.“', 64), gfx: { sofort: {} } },
      { t: T('Westdeutsche Nachrichten meldeten am Abend: Die DDR öffnet ihre Grenzen. Viele DDR-Bürger sahen **Westfernsehen**.', 64), gfx: { tv: {} } },
      { t: T('Tausende strömten zu den Grenzübergängen. An der **Bornholmer Straße** wurde die Menge immer größer.', 64), gfx: { menge: {} } },
      { t: T('Die Grenzer hatten keine Befehle. Gegen 23:30 Uhr ließ Oberstleutnant **Harald Jäger** den Schlagbaum öffnen – auf eigene Verantwortung.', 64), gfx: { jaeger: { cls: 'a1' } } },
      { t: T('Jäger sagte später, er habe verhindern wollen, dass in der Menge **Menschen sterben**. Er handelte gegen seine Befehle.', 64), gfx: { jaeger: { cls: 'a1' } } },
      { t: T('Andere Übergänge folgten. In der Nacht feierten Menschen aus Ost und West auf der Mauer. Es fiel **kein Schuss**.', 64), pics: { p2: { img: 2, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'An der Mauer, Dezember 1989' } } },
      { t: T('War es also ein Versprecher? Der Zettel war der **Auslöser**. Aber die Mauer war längst morsch.', 64), gfx: { offen: {} } },
      { t: T('Ohne Massenflucht, ohne mutige Demonstranten – und ohne Michail Gorbatschow, der keine **Panzer** schickte – wäre es anders gekommen.', 64), gfx: { leipzig: {} } },
      { t: T('Schabowski sagte später, er habe die Tragweite in dem Moment **nicht begriffen**. Der Zettel ist heute im Museum.', 64), gfx: { zettel: {} } },
      { t: T('Nicht einmal ein Jahr später, am **3. Oktober 1990**, war Deutschland wiedervereinigt.', 64), gfx: { einheit: {} } },
      { t: T('Ein Satz öffnete das Tor – **Menschen** gingen hindurch.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die neue Reiseregelung sollte erst am 10. November gelten; Schabowski verkündete am 9. November „sofort, unverzüglich“.', 'Medienberichte trieben Tausende an die Übergänge; an der Bornholmer Straße öffnete Harald Jäger ohne Befehl.', 'Hintergrund: Massenflucht über Ungarn, Montagsdemonstrationen, Gorbatschows Verzicht auf Gewalt.'],
    sources: ['Sarotte 2014: The Collapse – The Accidental Opening of the Berlin Wall', 'Bundeszentrale für politische Bildung: Der Mauerfall', 'Stiftung Berliner Mauer: Todesopfer an der Berliner Mauer'],
  },
  {
    id: 'kalender-dezember',
    area: 'GESCH',
    day: 24,
    hook: 'Warum ist der Dezember der zwölfte Monat – obwohl „decem“ zehn heißt?',
    mood: 'raetsel',
    ambience: 'glocke',
    images: [img('caesar')],
    draw: {
      blatt(g) {
        calPage(g, 110, 110, 140, 'December', '10?')
      },
      zahlen(g) {
        const rows: [string, string][] = [['September', 'septem = 7'], ['Oktober', 'octo = 8'], ['November', 'novem = 9'], ['Dezember', 'decem = 10']]
        rows.forEach(([a, b], i) => {
          text(g, 160, 390 + i * 56, a, { anchor: 'end', size: 20, d: i * 250 })
          text(g, 180, 390 + i * 56, b, { cls: 's', d: i * 250 + 100 })
        })
      },
      maerz(g) {
        const m = ['März', 'April', 'Mai', 'Juni', 'Quintilis', 'Sextilis', 'Sept.', 'Okt.', 'Nov.', 'Dez.']
        m.forEach((n, i) => {
          const x = 40 + (i % 5) * 70
          const y = 400 + Math.floor(i / 5) * 110
          box(g, x - 32, y, 64, 56, String(i + 1), { size: 18, d: i * 100, fill: i === 0 })
          text(g, x, y + 80, n, { anchor: 'middle', cls: 's', d: i * 100 + 100 })
        })
      },
      winter(g) {
        dashes(g, RR(60, 420, 240, 120, 10), { w: 1.8 })
        question(g, 180, 480, 0.8, 600)
        text(g, 180, 600, 'Winter: ohne Monatsnamen', { anchor: 'middle', cls: 's', d: 900 })
      },
      numa(g) {
        box(g, 40, 420, 120, 70, 'Ianuarius', { size: 16 })
        box(g, 200, 420, 120, 70, 'Februarius', { size: 16, fill: true, d: 300 })
        text(g, 180, 560, 'zwei neue Monate am Ende', { anchor: 'middle', cls: 's', d: 800 })
      },
      konsuln(g) {
        timeline(g, 30, 330, 470, [{ at: 0.45, label: '153 v. Chr.', sub: 'Jahresbeginn: 1. Januar', up: true }])
      },
      julius(g) {
        box(g, 40, 400, 120, 64, 'Quintilis', { size: 16 })
        arrow(g, L([170, 432], [190, 432]), { w: 2.4, d: 400, t: 200, head: 8 })
        box(g, 200, 400, 120, 64, 'Iulius', { size: 16, fill: true, d: 500 })
        box(g, 40, 520, 120, 64, 'Sextilis', { size: 16, d: 800 })
        arrow(g, L([170, 552], [190, 552]), { w: 2.4, d: 1100, t: 200, head: 8 })
        box(g, 200, 520, 120, 64, 'Augustus', { size: 16, fill: true, d: 1200 })
      },
      februar(g) {
        calPage(g, 110, 400, 140, 'Februar', '29', 0, true)
        text(g, 180, 620, 'der Schalttag bleibt am alten Jahresende', { anchor: 'middle', cls: 's', d: 800 })
      },
      mythos(g) {
        box(g, 40, 400, 280, 90, ['Augustus stahl dem Februar', 'einen Tag?'], { size: 17 })
        cross(g, 180, 560, 0.8, 900)
        text(g, 180, 630, 'eine Legende aus dem Mittelalter', { anchor: 'middle', cls: 's', d: 1100 })
      },
      verwirrung(g) {
        text(g, 180, 450, '445 Tage', { anchor: 'middle', size: 50, d: 200 })
        text(g, 180, 495, '46 v. Chr.: das „Jahr der Verwirrung“', { anchor: 'middle', cls: 's', d: 600 })
      },
      ende(g) {
        calPage(g, 110, 400, 140, 'Dezember', '12', 0, true)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { blatt: {} } },
      { t: T('September, Oktober, November, Dezember: Drin stecken die lateinischen Zahlen **sieben, acht, neun, zehn**.', 64), gfx: { zahlen: {} } },
      { t: T('Trotzdem sind sie bei uns der neunte bis zwölfte Monat. Alles **um zwei verrutscht**.', 64), gfx: { zahlen: {} } },
      { t: T('Der Grund: Das Jahr der frühen Römer begann **im März** – mit dem Frühling und dem Beginn der Feldzüge.', 64), gfx: { maerz: {} } },
      { t: T('Zählt man ab März, passt alles: Der September ist der **siebte** Monat, der Dezember der zehnte.', 64), gfx: { maerz: {} } },
      { t: T('Ganz früh hatte der römische Kalender der Überlieferung nach nur **zehn Monate**. Die Wintertage danach wurden einfach nicht gezählt.', 64), gfx: { winter: {} } },
      { t: T('Später kamen zwei Monate dazu: **Januar und Februar** – angehängt ans Ende des Jahres, nach dem Dezember.', 64), gfx: { numa: {} } },
      { t: T('Ab 153 vor Christus traten die höchsten Beamten, die Konsuln, ihr Amt am **1. Januar** an. So rückte der Jahresbeginn nach vorn.', 64), gfx: { konsuln: {} } },
      { t: T('Die alten Monatsnamen blieben – und stimmen seitdem **nicht mehr**.', 64), gfx: { zahlen: {} } },
      { t: T('Der fünfte und sechste Monat hießen ursprünglich Quintilis und Sextilis. Sie wurden umbenannt: in **Juli** für Julius Caesar und August für Kaiser Augustus.', 64), gfx: { julius: {} } },
      { t: T('Caesar reformierte 46 vor Christus auch den ganzen Kalender. Um alles geradezurücken, dauerte jenes Jahr **445 Tage**.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 30, 1.05], cam2: [50, 30, 1.2], cap: 'Gaius Julius Caesar' } } },
      { t: T('Und warum ist der Februar so kurz – und bekommt den **Schalttag**?', 64), gfx: { februar: {} } },
      { t: T('Er war lange der **letzte** Monat des Jahres. Was am Ende übrig blieb, ging an ihn – auch der zusätzliche Tag.', 64), gfx: { februar: {} } },
      { t: T('Oft hört man, Augustus habe dem Februar einen Tag **gestohlen**, damit sein August so lang ist wie Caesars Juli.', 64), gfx: { mythos: {} } },
      { t: T('Das ist eine **Legende**, wohl aus dem Mittelalter. Der August hatte schon vorher 31 Tage.', 64), gfx: { mythos: {} } },
      { t: T('Ein Echo bis heute: In England begann das Jahr bis 1752 am 25. März. Das britische Steuerjahr startet darum noch immer am **6. April**.', 64), gfx: { konsuln: {} } },
      { t: T('Jedes Mal, wenn du ins Jahr startest, stehst du also eigentlich mitten im alten römischen **Winter**.', 64), gfx: { winter: {} } },
      { t: T('Der Dezember zählt noch **wie die alten Römer**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Das frühe römische Jahr begann im März – darum ist der September (septem = 7) heute der neunte Monat.', 'Januar und Februar kamen später ans Jahresende; ab 153 v. Chr. begann das Amtsjahr am 1. Januar.', 'Juli und August wurden nach Caesar und Augustus umbenannt; der Schalttag blieb im einst letzten Monat Februar.'],
    sources: ['Rüpke 2011: The Roman Calendar from Numa to Constantine', 'Richards 1998: Mapping Time', 'Censorinus: De die natali 20'],
  },
  {
    id: 'zeitzonen',
    area: 'GESCH',
    day: 44,
    hook: 'Warum haben wir Zeitzonen – und was hat die Eisenbahn damit zu tun?',
    mood: 'verspielt',
    ambience: 'uhr',
    images: [img('bahnhofsuhr'), img('greenwich')],
    draw: {
      uhren(g) {
        clock(g, 80, 260, 50, 330, 0)
        clock(g, 280, 260, 50, 335, 48, 300)
        train(g, 180, 400, 500)
      },
      mittag(g) {
        sun(g, 180, 380, 30)
        ink(g, L([20, 620], [340, 620]), { w: 2.6, d: 200, t: 500 })
        ink(g, L([180, 620], [180, 540]), { w: 2.6, d: 400, t: 300 })
        ink(g, L([180, 620], [184, 624]), { w: 1, d: 500, t: 100 })
        text(g, 180, 660, 'Mittag: Sonne am höchsten', { anchor: 'middle', cls: 's', d: 900 })
      },
      vier(g) {
        text(g, 180, 450, '4 Minuten', { anchor: 'middle', size: 50, d: 200 })
        text(g, 180, 495, 'Unterschied pro Längengrad', { anchor: 'middle', cls: 's', d: 600 })
      },
      staedte(g) {
        clock(g, 90, 470, 56, 0, 0)
        clock(g, 270, 470, 56, 3, 36, 300)
        text(g, 90, 560, 'Berlin 12:00', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 270, 560, 'Köln 11:35', { anchor: 'middle', cls: 's', d: 900 })
      },
      bahnhof(g) {
        for (let i = 0; i < 3; i++) clock(g, 70 + i * 110, 450, 40, 330 + i * 4, i * 48, i * 200)
        train(g, 180, 620, 600)
        text(g, 180, 530, 'mehrere Uhren am Bahnhof', { anchor: 'middle', cls: 's', d: 1000 })
      },
      usa(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '18. Nov. 1883', sub: 'USA: der Tag mit zwei Mittagen', up: true }])
      },
      greenwich(g) {
        timeline(g, 30, 330, 470, [{ at: 0.45, label: '1884', sub: 'Nullmeridian: Greenwich', up: true }])
      },
      zonen(g) {
        ink(g, E(180, 470, 120), { w: 3, t: 700 })
        for (let i = 1; i < 6; i++) {
          const x = 60 + i * 40
          const h = Math.sqrt(120 * 120 - Math.pow(x - 180, 2))
          ink(g, L([x, 470 - h + 2], [x, 470 + h - 2]), { w: 1.4, d: 400 + i * 80, t: 300 })
        }
        text(g, 180, 630, '24 Zonen zu je 15 Grad', { anchor: 'middle', cls: 's', d: 1000 })
      },
      mez(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '1. April 1893', sub: 'Deutschland: Mitteleuropäische Zeit', up: true }])
      },
      china(g) {
        ink(g, [[40, 470], [80, 410], [160, 380], [260, 400], [320, 450], [300, 530], [200, 560], [100, 540], [40, 470]], { w: 2.8, t: 800 })
        clock(g, 180, 470, 34, 0, 0, 600)
        text(g, 180, 620, 'China: eine Zeit für alle', { anchor: 'middle', cls: 's', d: 1000 })
      },
      krumm(g) {
        bullets(g, 40, 380, ['Indien: + 5:30', 'Nepal: + 5:45', 'Spanien: wie Berlin'], { gap: 56, size: 19 })
      },
      sommer(g) {
        timeline(g, 30, 330, 470, [{ at: 0.45, label: '1916', sub: 'erste Sommerzeit: Deutsches Reich', up: true }])
      },
      ende(g) {
        clock(g, 180, 470, 70, 0, 0)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { uhren: {} } },
      { t: T('Früher bestimmte jede Stadt ihre Zeit selbst: **Mittag** war, wenn die Sonne am höchsten stand.', 64), gfx: { mittag: {} } },
      { t: T('Weil sich die Erde dreht, kommt Mittag weiter im Westen später – etwa **vier Minuten** pro Längengrad.', 64), gfx: { vier: {} } },
      { t: T('Wenn es in Berlin zwölf schlug, war es in Köln erst etwa **11:35 Uhr**.', 64), gfx: { staedte: {} } },
      { t: T('Solange man mit der Kutsche reiste, störte das niemanden. Dann kam die **Eisenbahn**.', 64), gfx: { uhren: { tf: [1, 0, 200] } } },
      { t: T('Fahrpläne wurden zum Chaos: Welche Zeit gilt bei Abfahrt, welche bei Ankunft? Manche Bahnhöfe hatten **mehrere Uhren**.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Die Bahngesellschaften griffen zur Selbsthilfe. Britische Bahnen fuhren ab 1847 einheitlich nach der Zeit von **Greenwich**.', 64), gfx: { bahnhof: {} } },
      { t: T('In den USA gab es Dutzende Ortszeiten. Am 18. November 1883 stellten die Bahnen auf **vier Zonen** um.', 64), gfx: { usa: {} } },
      { t: T('Viele Orte erlebten an diesem Tag **zwei Mittage**: Die Uhren wurden zurückgedreht, und es schlug noch einmal zwölf.', 64), gfx: { usa: {} } },
      { t: T('1884 einigten sich Staaten auf einen Nullmeridian: die Sternwarte in **Greenwich** bei London.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Die Idee: 24 Zonen, je 15 Längengrade breit – also je **eine Stunde**.', 64), gfx: { zonen: {} } },
      { t: T('Das Deutsche Reich führte am 1. April 1893 die **Mitteleuropäische Zeit** ein. Vorher hatte etwa Baden eigene Zeit.', 64), gfx: { mez: {} } },
      { t: T('Zeitzonen folgen heute aber oft der **Politik**, nicht der Sonne.', 64), gfx: { zonen: {} } },
      { t: T('China ist fast so breit wie fünf Zonen – und hat trotzdem nur **eine Zeit**. Im Westen geht die Sonne dort mittags erst richtig auf.', 64), gfx: { china: {} } },
      { t: T('Indien liegt eine halbe Stunde zwischen den Zonen, Nepal sogar eine **Viertelstunde**. Spanien nutzt die Zeit von Berlin, obwohl es westlich von London liegt.', 64), gfx: { krumm: {} } },
      { t: T('Auch die **Sommerzeit** kam im Krieg: 1916 führte das Deutsche Reich sie als erstes Land ein, um Kohle zu sparen.', 64), gfx: { sommer: {} } },
      { t: T('Erst die Bahn machte genaue Zeit für alle wichtig – heute stellen Funkuhren und Handys sich **von selbst**.', 64), gfx: { bahnhof: {} } },
      { t: T('Die Zeit ist **eine Abmachung**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Früher galt Ortszeit nach der Sonne: pro Längengrad 4 Minuten Unterschied.', 'Eisenbahn-Fahrpläne erzwangen Einheitszeit: Großbritannien 1847, USA 1883, Nullmeridian Greenwich 1884, MEZ in Deutschland 1893.', 'Zonen folgen heute oft der Politik (China, Indien, Spanien).'],
    sources: ['Bartky 2007: One Time Fits All', 'Physikalisch-Technische Bundesanstalt: Zeitzonen und gesetzliche Zeit', 'Howse 1980: Greenwich Time and the Discovery of the Longitude'],
  },
  {
    id: 'marathon',
    area: 'GESCH',
    day: 21,
    hook: 'Warum ist ein Marathon genau 42,195 Kilometer lang?',
    mood: 'episch',
    ambience: 'atem',
    images: [img('marathon'), img('pietri'), img('windsor')],
    draw: {
      laeufer(g) {
        runner(g, 180, 380, 3)
        text(g, 180, 150, '42,195', { anchor: 'middle', size: 50, d: 600 })
      },
      legende(g) {
        timeline(g, 30, 330, 470, [{ at: 0.3, label: '490 v. Chr.', sub: 'Schlacht bei Marathon', up: true }])
      },
      bote(g) {
        runner(g, 120, 600, 3.2)
        text(g, 250, 470, '„Wir haben', { anchor: 'middle', cls: 'it', size: 20, d: 600 })
        text(g, 250, 500, 'gesiegt!“', { anchor: 'middle', cls: 'it', size: 20, d: 700 })
      },
      herodot(g) {
        hbars(g, [
          { label: 'Legende: nach Athen', v: 40, fmt: () => '≈ 40 km' },
          { label: 'Herodot: nach Sparta', v: 240, fmt: () => '≈ 240 km', dense: true },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80 })
      },
      athen(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1896', sub: 'erste moderne Olympische Spiele', up: true }])
      },
      louis(g) {
        runner(g, 180, 600, 4)
        text(g, 180, 650, 'Spyridon Louis gewinnt', { anchor: 'middle', cls: 's', d: 800 })
      },
      strecken(g) {
        hbars(g, [
          { label: '1896 Athen', v: 40, fmt: () => '≈ 40 km' },
          { label: '1900 Paris', v: 40.26, fmt: () => '40,26 km' },
          { label: '1908 London', v: 42.195, fmt: () => '42,195 km', dense: true },
        ], { x: 30, y: 370, w: 300, h: 36, gap: 76, max: 44 })
      },
      windsor(g) {
        castle(g, 70, 440, 0)
        ink(g, B([110, 440], [180, 400], [220, 520], [280, 500]), { w: 2.4, d: 600, t: 900 })
        ink(g, E(300, 500, 26, 16), { w: 2.6, d: 1200, t: 400 })
        text(g, 70, 480, 'Windsor', { anchor: 'middle', cls: 's', d: 400 })
        text(g, 300, 540, 'Stadion', { anchor: 'middle', cls: 's', d: 1400 })
      },
      loge(g) {
        ink(g, E(180, 480, 140, 70), { w: 3, t: 800 })
        ink(g, E(180, 480, 100, 40), { w: 2, d: 300, t: 700 })
        box(g, 140, 380, 80, 36, 'Loge', { size: 14, fill: true, d: 800 })
        text(g, 180, 600, '26 Meilen + 385 Yards', { anchor: 'middle', d: 1100 })
      },
      pietri(g) {
        fig(g, 140, 600, 3.6, { arms: 'up' })
        fig(g, 90, 600, 3.6, { d: 300 })
        fig(g, 190, 600, 3.6, { d: 300 })
        text(g, 140, 650, 'Dorando Pietri, 1908', { anchor: 'middle', cls: 's', d: 800 })
        cross(g, 290, 470, 0.8, 1100)
      },
      norm(g) {
        timeline(g, 30, 330, 470, [{ at: 0.6, label: '1921', sub: 'Strecke wird Pflicht', up: true }])
      },
      zwei(g) {
        text(g, 180, 450, '≈ 2 Stunden', { anchor: 'middle', size: 44, d: 200 })
        text(g, 180, 495, 'Spitzenläufer heute', { anchor: 'middle', cls: 's', d: 600 })
      },
      ende(g) {
        runner(g, 180, 600, 3.4)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Die Legende kennt fast jeder: 490 vor Christus besiegten die Athener die Perser bei **Marathon**.', 64), gfx: { legende: {} } },
      { t: T('Ein Bote lief rund 40 Kilometer nach Athen, rief „Wir haben gesiegt!“ – und brach **tot** zusammen.', 64), gfx: { bote: {} } },
      { t: T('Nur: Der Geschichtsschreiber Herodot, der knapp 50 Jahre später schrieb, erzählt etwas **anderes**.', 64), gfx: { herodot: {} } },
      { t: T('Bei ihm läuft der Bote Pheidippides **vor der Schlacht** nach Sparta, um Hilfe zu holen – rund 240 Kilometer in zwei Tagen.', 64), gfx: { herodot: {} } },
      { t: T('Die Geschichte vom Lauf nach Athen taucht erst **Jahrhunderte später** auf. Vermutlich ist sie erfunden.', 64), gfx: { bote: {} } },
      { t: T('Berühmt wurde sie 1896: Für die ersten modernen **Olympischen Spiele** in Athen schlug ein Franzose einen Lauf von Marathon ins Stadion vor.', 64), gfx: { athen: {} } },
      { t: T('Es gewann ein Grieche – der Wasserträger **Spyridon Louis**. Das Land jubelte.', 64), gfx: { louis: {} } },
      { t: T('Die Strecke war damals rund **40 Kilometer** lang – und bei jeden Spielen ein wenig anders.', 64), gfx: { strecken: {} } },
      { t: T('Dann kam **London 1908**. Der Start wurde an Schloss Windsor gelegt, damit die königliche Familie zusehen konnte.', 64), pics: { p2: { img: 2, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Das Ziel lag im Stadion – genau vor der **königlichen Loge**.', 64), gfx: { loge: {} } },
      { t: T('Heraus kamen 26 Meilen und 385 Yards: **42,195 Kilometer**.', 64), gfx: { loge: {} } },
      { t: T('Das Rennen selbst wurde legendär: Der Italiener **Dorando Pietri** kam als Erster ins Stadion – völlig erschöpft.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Er brach mehrmals zusammen, Helfer stützten ihn über die Ziellinie. Er wurde **disqualifiziert** – und von der Königin mit einem Pokal geehrt.', 64), gfx: { pietri: {} } },
      { t: T('Die Londoner Länge setzte sich durch. 1921 legte der Leichtathletik-Verband sie **verbindlich** fest.', 64), gfx: { norm: {} } },
      { t: T('Die besten Läufer schaffen sie heute in gut **zwei Stunden** – fast 21 km/h, über die ganze Strecke.', 64), gfx: { zwei: {} } },
      { t: T('Seit 1984 laufen auch Frauen den olympischen Marathon. Vorher hielt man die Strecke für Frauen **zu gefährlich** – ein Irrtum.', 64), gfx: { zwei: {} } },
      { t: T('Die letzten 195 Meter verdanken Marathonläufer also einer **Königsfamilie**.', 64), gfx: { loge: {} } },
      { t: T('Ein Lauf aus einer Legende – **verlängert** für eine Loge.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Der tödliche Botenlauf nach Athen ist eine späte Legende; Herodot nennt einen Lauf nach Sparta.', 'Der olympische Marathon von 1896 war ~40 km lang, die Strecke schwankte.', 'London 1908: Start in Windsor, Ziel vor der Königsloge → 42,195 km, seit 1921 verbindlich.'],
    sources: ['Herodot: Historien VI, 105–106', 'Martin & Gynn 2000: The Olympic Marathon', 'World Athletics: Geschichte des Marathons'],
  },
]

/** Schaf (klein), Füße auf y */
function sheep(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  for (const k of [-12, 12]) ink(g, L(P(k, -10), P(k, 0)), { w: 2, d: d + 200, t: 100 })
  const body: P[] = [...B(P(-22, -16), P(-26, -40), P(22, -40), P(22, -16)), ...B(P(22, -16), P(20, -4), P(-20, -4), P(-22, -16)).slice(1)]
  blank(g, body)
  ink(g, body, { w: 2.2, d, t: 400 })
  blank(g, E(x + 26 * s, y - 26 * s, 7 * s, 6 * s))
  hatch(g, E(x + 26 * s, y - 26 * s, 7 * s, 6 * s), d + 300, true)
  ink(g, E(x + 26 * s, y - 26 * s, 7 * s, 6 * s), { w: 2, d: d + 200, t: 200 })
}

/** Vollmond */
function moonFull(g: Element, cx: number, cy: number, r: number, d = 0): void {
  ink(g, E(cx, cy, r), { w: 2.6, d, t: 600 })
  for (const [a, b, rr] of [[-0.3, -0.2, 0.2], [0.25, 0.1, 0.15], [-0.1, 0.35, 0.12]] as const) ink(g, E(cx + a * r, cy + b * r, rr * r), { w: 1.6, d: d + 400, t: 200 })
}

/** Dampflok, Mitte unten bei (cx, y) */
function train(g: Element, cx: number, y: number, d = 0): void {
  ink(g, RR(cx - 90, y - 50, 110, 40, 6), { w: 2.6, d, t: 500 })
  ink(g, RR(cx + 20, y - 80, 60, 70, 6), { w: 2.6, d: d + 200, t: 400 })
  ink(g, RR(cx - 70, y - 80, 20, 30, 3), { w: 2.2, d: d + 300, t: 200 })
  for (const x of [cx - 60, cx - 20, cx + 40]) ball(g, x, y, 12, { d: d + 400, t: 200 })
  ink(g, L([cx - 120, y + 14], [cx + 120, y + 14]), { w: 2.2, d: d + 100, t: 400 })
}

/** Oldtimer (offen), Räder auf y */
function oldCar(g: Element, cx: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  ink(g, [P(-50, -14), P(-50, -32), P(54, -28), P(54, -14), P(-50, -14)], { w: 2.4, d, t: 500 })
  ink(g, L(P(24, -30), P(30, -46)), { w: 2, d: d + 300, t: 200 })
  for (const k of [-30, 34]) ball(g, cx + k * s, y - 4 * s, 11 * s, { d: d + 200, t: 200, w: 2 })
}

/** Läufer im Schritt, Füße auf y */
function runner(g: Element, x: number, y: number, s = 1, d = 0): void {
  const io = { w: 2.6, d, t: 500 }
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  ink(g, E(x + 3 * s, y - 31 * s, 5 * s), io)
  ink(g, L(P(1, -25), P(-2, -11)), io)
  ink(g, [P(-2, -11), P(6, -5), P(4, 0)], io)
  ink(g, [P(-2, -11), P(-8, -5), P(-14, -6)], io)
  ink(g, [P(0, -21), P(7, -16), P(11, -20)], io)
  ink(g, [P(0, -21), P(-6, -17), P(-9, -12)], io)
}

/** Burg mit Zinnen, Unterkante y */
function castle(g: Element, x: number, y: number, d = 0): void {
  ink(g, [[x - 36, y], [x - 36, y - 60], [x - 24, y - 60], [x - 24, y - 50], [x - 12, y - 50], [x - 12, y - 60], [x, y - 60], [x, y - 50], [x + 12, y - 50], [x + 12, y - 60], [x + 24, y - 60], [x + 24, y - 50], [x + 36, y - 50], [x + 36, y]], { w: 2.6, d, t: 600 })
  ink(g, [[x - 8, y], [x - 8, y - 20], ...B([x - 8, y - 20], [x - 8, y - 30], [x + 8, y - 30], [x + 8, y - 20]).slice(1), [x + 8, y]], { w: 2, d: d + 300, t: 300 })
}

/** Mammut (Seitenansicht), Füße auf y */
function mammoth(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = [...B(P(-50, -20), P(-60, -70), P(-20, -90), P(10, -86)), ...B(P(10, -86), P(40, -96), P(56, -70), P(52, -44)).slice(1), ...B(P(52, -44), P(60, -20), P(66, -6), P(58, 0)).slice(1), ...L(P(58, 0), P(46, -24)).slice(1), ...L(P(46, -24), P(36, -24)).slice(1), ...L(P(36, -24), P(36, 0)).slice(1), ...L(P(36, 0), P(22, 0)).slice(1), ...L(P(22, 0), P(22, -22)).slice(1), ...L(P(22, -22), P(-24, -22)).slice(1), ...L(P(-24, -22), P(-24, 0)).slice(1), ...L(P(-24, 0), P(-38, 0)).slice(1), ...L(P(-38, 0), P(-50, -20)).slice(1)]
  blank(g, body)
  hatch(g, body, d + 500)
  ink(g, body, { w: 2.6, d, t: 800 })
  ink(g, B(P(46, -40), P(60, -36), P(74, -50), P(70, -66)), { w: 2.4, d: d + 600, t: 300 })
}
