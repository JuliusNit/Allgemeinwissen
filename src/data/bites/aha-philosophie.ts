import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, brain, check, cross, dashes, eye, fig, hatch, hbars, ink, question, text, timeline, type P } from './draw'
import { ball, box, bullets, carrow, dot, plot, waveP } from './kit'

// Philosophie, Denken & Politik: Gedankenexperimente und Spielregeln, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Segelschiff aus Planken, Wasserlinie y; marked = Indizes ersetzter Planken */
function plankShip(g: Element, cx: number, y: number, s = 1, d = 0, marked: number[] = []): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  const hull: P[] = [P(-110, -50), P(110, -50), P(80, 0), P(-80, 0), P(-110, -50)]
  blank(g, hull)
  for (const i of marked) {
    const top0 = -110 + i * 44
    const top1 = top0 + 44
    hatch(g, [P(top0, -50), P(top1, -50), P(top1 * (80 / 110), 0), P(top0 * (80 / 110), 0), P(top0, -50)], d + 400 + i * 100, true)
  }
  ink(g, hull, { w: 2.8, d, t: 700 })
  for (let i = 1; i < 5; i++) {
    const top = -110 + i * 44
    ink(g, L(P(top, -48), P(top * (80 / 110), -2)), { w: 1.4, d: d + 300 + i * 60, t: 200 })
  }
  ink(g, L(P(0, -50), P(0, -170)), { w: 2.6, d: d + 500, t: 300 })
  ink(g, [P(6, -166), P(70, -66), P(6, -66)], { w: 2.4, d: d + 700, t: 400 })
}

/** Schildkröte, Füße auf y */
function turtle(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const shell: P[] = [...B(P(-24, -6), P(-22, -30), P(22, -30), P(24, -6)), P(-24, -6)]
  blank(g, shell)
  hatch(g, shell, d + 300)
  ink(g, shell, { w: 2.2, d, t: 400 })
  ball(g, x + 30 * s, y - 12 * s, 6 * s, { d: d + 200, t: 200, w: 1.8 })
  for (const k of [-14, 12]) ink(g, L(P(k, -6), P(k, 0)), { w: 1.8, d: d + 300, t: 100 })
}

/** Läufer (schematisch), Füße auf y */
function runner(g: Element, x: number, y: number, s = 1, d = 0): void {
  const io = { w: 2.4, d, t: 400 }
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  ink(g, E(x + 3 * s, y - 31 * s, 5 * s), io)
  ink(g, L(P(1, -25), P(-2, -11)), io)
  ink(g, [P(-2, -11), P(6, -5), P(4, 0)], io)
  ink(g, [P(-2, -11), P(-8, -5), P(-14, -6)], io)
  ink(g, [P(0, -21), P(7, -16), P(11, -20)], io)
  ink(g, [P(0, -21), P(-6, -17), P(-9, -12)], io)
}

/** Glasbehälter mit Gehirn */
function vat(g: Element, cx: number, y: number, s = 1, d = 0, cables = true): void {
  const P = (a: number, b: number): P => [cx + a * s, y + b * s]
  ink(g, [P(-60, -160), P(-60, 0), P(60, 0), P(60, -160)], { w: 2.8, d, t: 700 })
  brain(g, cx, y - 75 * s, 0.4 * s, d + 500)
  if (cables) for (const k of [-12, 0, 12]) ink(g, B(P(k, -114), P(k, -180), P(60, -190 + k * 0.6), P(96, -190 + k * 0.6)), { w: 1.6, d: d + 900, t: 400 })
}

/** Raster aus Feldern (Wähler), Muster: 1 = schraffiert */
function voters(g: Element, x: number, y: number, cols: number, cell: number, pat: number[], d = 0): void {
  pat.forEach((v, i) => {
    const cx = x + (i % cols) * cell + cell / 2
    const cy = y + Math.floor(i / cols) * cell + cell / 2
    ball(g, cx, cy, cell * 0.3, { fill: v ? 'dicht' : 'leer', d: d + i * 25, t: 150, w: 1.8 })
  })
}

/** Bezirksgrenzen als Rechtecke um Feldgruppen */
function district(g: Element, pts: P[], d = 0): void {
  ink(g, pts, { w: 3, d, t: 700 })
}

/** Stimmzettel mit zwei Spalten */
function ballot(g: Element, x: number, y: number, w: number, h: number, d = 0, mark: 0 | 1 | 2 | 3 = 0): void {
  blank(g, RR(x, y, w, h, 6))
  ink(g, RR(x, y, w, h, 6), { w: 2.8, d, t: 600 })
  ink(g, L([x + w / 2, y + 8], [x + w / 2, y + h - 8]), { w: 1.6, d: d + 300, t: 300 })
  text(g, x + w / 4, y + 30, 'Erststimme', { anchor: 'middle', size: 14, d: d + 400 })
  text(g, x + (3 * w) / 4, y + 30, 'Zweitstimme', { anchor: 'middle', size: 14, d: d + 400 })
  for (let i = 0; i < 4; i++) {
    for (const k of [0, 1]) {
      const cx = x + w / 4 + (k * w) / 2
      const cy = y + 64 + i * 34
      ink(g, E(cx + 40, cy, 9), { w: 1.6, d: d + 500 + i * 60, t: 150 })
      ink(g, L([cx - 50, cy], [cx + 20, cy]), { w: 1, d: d + 500 + i * 60, t: 150 })
      if (((mark === 1 || mark === 3) && k === 0 && i === 1) || ((mark === 2 || mark === 3) && k === 1 && i === 2)) {
        ink(g, L([cx + 33, cy - 7], [cx + 47, cy + 7]), { w: 2.6, d: d + 900, t: 150 })
        ink(g, L([cx + 47, cy - 7], [cx + 33, cy + 7]), { w: 2.6, d: d + 1000, t: 150 })
      }
    }
  }
}

/** Halbkreis-Parlament mit n Sitzen; dense = Anteil schraffiert */
function parliament(g: Element, cx: number, cy: number, r: number, n: number, dense: number, d = 0): void {
  let k = 0
  for (let row = 0; row < 4; row++) {
    const rr = r * (0.55 + row * 0.15)
    const m = Math.round(n * (0.16 + row * 0.07))
    for (let i = 0; i < m; i++) {
      const a = Math.PI - (i / (m - 1)) * Math.PI
      const x = cx + Math.cos(a) * rr
      const y = cy - Math.sin(a) * rr
      if (i / (m - 1) < dense) dot(g, x, y, 5, d + k * 12)
      else ink(g, E(x, y, 4.5), { w: 1.6, d: d + k * 12, t: 60 })
      k++
    }
  }
}

export const AHA_PHILOSOPHIE: Bite[] = [
  {
    id: 'theseus',
    area: 'PHIL',
    day: 14,
    hook: 'Ist ein Schiff noch dasselbe, wenn man jede Planke austauscht?',
    mood: 'raetsel',
    ambience: 'wellen',
    images: [img('trireme'), img('plutarch')],
    draw: {
      schiff(g) {
        ink(g, waveP(20, 340, 382, 4, 60), { w: 2.2, t: 700 })
        plankShip(g, 180, 380, 1, 200)
      },
      plutarch(g) {
        timeline(g, 30, 330, 470, [{ at: 0.6, label: 'um 100 n. Chr.', sub: 'Plutarch erzählt', up: true }])
      },
      eine(g) {
        ink(g, waveP(20, 340, 602, 4, 60), { w: 2.2, t: 700 })
        plankShip(g, 180, 600, 1, 0, [2])
        text(g, 180, 650, 'eine neue Planke', { anchor: 'middle', cls: 's', d: 1000 })
      },
      halb(g) {
        ink(g, waveP(20, 340, 602, 4, 60), { w: 2.2, t: 700 })
        plankShip(g, 180, 600, 1, 0, [0, 2, 4])
        text(g, 180, 650, 'die Hälfte neu', { anchor: 'middle', cls: 's', d: 1000 })
      },
      alle(g) {
        ink(g, waveP(20, 340, 602, 4, 60), { w: 2.2, t: 700 })
        plankShip(g, 180, 600, 1, 0, [0, 1, 2, 3, 4])
        question(g, 300, 380, 0.6, 1200)
        text(g, 180, 650, 'keine Planke mehr vom Original', { anchor: 'middle', cls: 's', d: 1000 })
      },
      hobbes(g) {
        ink(g, waveP(20, 340, 602, 4, 60), { w: 2.2, t: 700 })
        plankShip(g, 95, 600, 0.6, 0, [0, 1, 2, 3, 4])
        plankShip(g, 265, 600, 0.6, 300)
        text(g, 95, 650, 'neue Planken', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 265, 650, 'alte Planken', { anchor: 'middle', cls: 's', d: 1000 })
        question(g, 180, 400, 0.6, 1300)
      },
      positionen(g) {
        box(g, 20, 380, 100, 90, ['Form &', 'Geschichte'], { size: 14 })
        box(g, 130, 380, 100, 90, ['Material'], { size: 14, d: 300 })
        box(g, 240, 380, 100, 90, ['Zweck'], { size: 14, d: 600, fill: true })
        text(g, 180, 540, 'Was macht es zu „demselben“?', { anchor: 'middle', d: 1000 })
      },
      zellen(g) {
        hbars(g, [
          { label: 'Hautzellen', v: 4, fmt: () => 'Wochen' },
          { label: 'rote Blutkörperchen', v: 17, fmt: () => '≈ 4 Monate' },
          { label: 'Nervenzellen im Großhirn', v: 100, fmt: () => 'ein Leben lang', dense: true },
        ], { x: 30, y: 370, w: 300, h: 36, gap: 76 })
        text(g, 180, 620, 'wie lange Zellen leben', { anchor: 'middle', cls: 's', d: 1500 })
      },
      band(g) {
        for (let i = 0; i < 4; i++) fig(g, 70 + i * 74, 600, 3.6, { d: i * 150, arms: i === 1 ? 'up' : 'down' })
        text(g, 180, 650, 'eine Band ohne Gründungsmitglieder', { anchor: 'middle', cls: 's', d: 900 })
      },
      axt(g) {
        ink(g, L([120, 620], [220, 420]), { w: 4, t: 500 })
        const head: P[] = [[200, 440], [250, 420], [262, 470], [214, 470], [200, 440]]
        blank(g, head)
        hatch(g, head, 600, true)
        ink(g, head, { w: 2.8, d: 400, t: 400 })
        text(g, 180, 670, 'Großvaters Axt: neuer Stiel, neue Klinge', { anchor: 'middle', cls: 's', d: 900 })
      },
      ende(g) {
        ink(g, waveP(20, 340, 602, 4, 60), { w: 2.2, t: 700 })
        plankShip(g, 180, 600, 1, 0, [1, 3])
      },
    },
    scenes: [
      { t: HOOK(456), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 370, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Nachbau einer griechischen Triere' } } },
      { t: T('Der griechische Schriftsteller **Plutarch** erzählt: Die Athener bewahrten das Schiff ihres Helden Theseus jahrhundertelang auf.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.2], cap: 'Plutarch, Delphi' } } },
      { t: T('Wurde eine Planke morsch, ersetzten sie sie durch eine **neue**. Das Schiff blieb im Hafen, sorgfältig gepflegt.', 64), gfx: { eine: {} } },
      { t: T('Nach einer Weile war die **Hälfte** der Planken ausgetauscht. Ist es noch das Schiff des Theseus?', 64), gfx: { halb: {} } },
      { t: T('Irgendwann stammte **keine einzige** Planke mehr vom Original. Und doch zeigten die Athener stolz: das Schiff des Theseus.', 64), gfx: { alle: {} } },
      { t: T('Schon in der Antike stritten Philosophen darüber. Ab **welcher Planke** wäre es ein anderes Schiff geworden?', 64), gfx: { alle: {} } },
      { t: T('Der Engländer **Thomas Hobbes** machte es noch kniffliger: Jemand sammelt alle alten Planken und baut sie wieder zusammen.', 64), gfx: { hobbes: {} } },
      { t: T('Jetzt gibt es **zwei Schiffe**. Welches ist das echte Schiff des Theseus?', 64), gfx: { hobbes: {} } },
      { t: T('Die eine Antwort: das mit der **ununterbrochenen Geschichte**, das im Hafen lag und gepflegt wurde.', 64), gfx: { positionen: {} } },
      { t: T('Die andere: das aus dem **Originalmaterial**. Eine dritte sagt: Die Frage hat keine wahre Antwort – „dasselbe“ ist nur ein Wort, das wir festlegen.', 64), gfx: { positionen: {} } },
      { t: T('Klingt nach Spielerei? Dann schau auf **dich selbst**. Dein Körper tauscht ständig Zellen und Atome aus.', 64), gfx: { zellen: {} } },
      { t: T('Hautzellen leben nur **wenige Wochen**, rote Blutkörperchen etwa vier Monate.', 64), gfx: { zellen: {} } },
      { t: T('Der Mythos, man sei alle **sieben Jahre** komplett neu, stimmt aber nicht: Viele Nervenzellen im Großhirn bleiben ein Leben lang.', 64), gfx: { zellen: {} } },
      { t: T('Bist du derselbe Mensch wie mit fünf Jahren? Viele Philosophen sagen: Was zählt, ist die **Kontinuität** von Erinnerungen und Persönlichkeit.', 64), gfx: { positionen: {} } },
      { t: T('Dieselbe Frage stellt sich bei **Bands**, deren Gründer alle gegangen sind, oder bei Fußballvereinen mit ganz neuem Kader.', 64), gfx: { band: {} } },
      { t: T('Ein Witz bringt es auf den Punkt: „Das ist Großvaters **Axt**. Der Vater hat den Stiel ersetzt, ich die Klinge.“', 64), gfx: { axt: {} } },
      { t: T('Der Philosoph Heraklit meinte schon früher: Man kann nicht **zweimal** in denselben Fluss steigen – das Wasser ist immer neues.', 64), gfx: { schiff: { tf: [1, 0, 220] } } },
      { t: T('Das Rätsel ist rund zweitausend Jahre alt – und **ungelöst**.', 64), gfx: { alle: {} } },
      { t: T('Alles fließt – und bleibt doch **dasselbe**?', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Plutarch: Das Schiff des Theseus wurde Planke um Planke ersetzt – ist es noch dasselbe?', 'Hobbes: Baut man die alten Planken wieder zusammen, gibt es zwei Kandidaten.', 'Dieselbe Frage gilt für Körper (Zellerneuerung), Personen, Bands und Vereine.'],
    sources: ['Plutarch: Theseus 23', 'Hobbes 1655: De corpore II, 11', 'Spalding et al. 2005, Cell 122 (Alter von Zellen)'],
  },
  {
    id: 'zenon',
    area: 'PHIL',
    day: 22,
    hook: 'Kann Achilles eine Schildkröte jemals einholen?',
    mood: 'raetsel',
    ambience: 'atem',
    images: [img('schildkroete')],
    draw: {
      rennen(g) {
        ink(g, L([20, 380], [340, 380]), { w: 2.4, t: 500 })
        runner(g, 60, 378, 2.6, 300)
        turtle(g, 250, 378, 1.4, 500)
      },
      zenon(g) {
        timeline(g, 30, 330, 470, [{ at: 0.35, label: 'um 450 v. Chr.', sub: 'Zenon von Elea', up: true }])
      },
      vorsprung(g) {
        ink(g, L([20, 600], [340, 600]), { w: 2.4, t: 500 })
        runner(g, 40, 598, 2.2, 200)
        turtle(g, 200, 598, 1.2, 400)
        dashes(g, L([40, 640], [200, 640]), { w: 1.4, d: 700 })
        text(g, 120, 670, '100 m Vorsprung', { anchor: 'middle', cls: 's', d: 900 })
      },
      schritte(g) {
        ink(g, L([20, 560], [340, 560]), { w: 2.4, t: 500 })
        const marks = [40, 200, 280, 320, 340]
        marks.forEach((x, i) => {
          ink(g, L([x, 548], [x, 572]), { w: 2, d: 300 + i * 300, t: 150 })
          if (i < marks.length - 1) carrow(g, [x + 2, 530], [marks[i + 1] - 2, 530], 12 * (1 - i * 0.2), { d: 400 + i * 300, head: 7, w: 2 })
        })
        text(g, 180, 620, 'immer wieder ein neuer, kleinerer Rest', { anchor: 'middle', cls: 's', d: 1700 })
      },
      unendlich(g) {
        text(g, 180, 450, '∞', { anchor: 'middle', size: 80, d: 200 })
        text(g, 180, 500, 'unendlich viele Etappen', { anchor: 'middle', cls: 's', d: 600 })
      },
      halbe(g) {
        const x0 = 40
        const w = 280
        ink(g, RR(x0, 440, w, 50, 4), { w: 2.6, t: 500 })
        let x = x0
        let part = w / 2
        for (let i = 0; i < 6; i++) {
          const p: P[] = [[x, 444], [x + part, 444], [x + part, 486], [x, 486], [x, 444]]
          if (i % 2 === 0) hatch(g, p, 500 + i * 200, true)
          ink(g, L([x + part, 442], [x + part, 488]), { w: 1.8, d: 400 + i * 200, t: 150 })
          x += part
          part /= 2
        }
        text(g, 180, 560, '½ + ¼ + ⅛ + … = 1', { anchor: 'middle', size: 24, d: 1600 })
      },
      zeit(g) {
        hbars(g, [
          { label: 'Etappe 1', v: 10, fmt: () => '10 s' },
          { label: 'Etappe 2', v: 1, fmt: () => '1 s' },
          { label: 'Etappe 3', v: 0.1, fmt: () => '0,1 s' },
        ], { x: 30, y: 380, w: 300, h: 34, gap: 72 })
        text(g, 180, 620, 'zusammen: gut 11 Sekunden', { anchor: 'middle', d: 1500 })
      },
      grenzwert(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: 'Zenon', sub: '450 v. Chr.', up: true },
          { at: 0.85, label: '19. Jh.', sub: 'Grenzwert (Cauchy)', big: true },
        ])
      },
      pfeil(g) {
        arrow(g, L([60, 470], [300, 470]), { w: 3, t: 500, head: 14 })
        for (const x of [100, 160, 220]) dashes(g, L([x, 440], [x, 500]), { w: 1.2, d: 600 })
        text(g, 180, 560, 'in jedem Augenblick: in Ruhe?', { anchor: 'middle', cls: 's', d: 900 })
      },
      diogenes(g) {
        fig(g, 180, 600, 4.4)
        arrow(g, L([210, 560], [300, 560]), { w: 2.4, d: 600, t: 400, head: 9 })
        text(g, 180, 650, 'Antwort durch Gehen', { anchor: 'middle', cls: 's', d: 900 })
      },
      ende(g) {
        ink(g, L([20, 560], [340, 560]), { w: 2.4, t: 500 })
        runner(g, 200, 558, 2.4)
        turtle(g, 150, 558, 1.2, 300)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein Rätsel des Philosophen **Zenon von Elea**, rund 2.500 Jahre alt.', 64), gfx: { zenon: {} } },
      { t: T('Der schnelle Held Achilles läuft mit einer Schildkröte um die Wette. Sie bekommt **100 Meter Vorsprung**.', 64), gfx: { vorsprung: {} } },
      { t: T('Achilles rennt los. Bis er die 100 Meter geschafft hat, ist die Schildkröte ein Stück weiter – sagen wir **10 Meter**.', 64), gfx: { schritte: {} } },
      { t: T('Er läuft die 10 Meter. Sie ist wieder ein Stückchen weiter. Er läuft auch das – sie ist **wieder** weiter.', 64), gfx: { schritte: {} } },
      { t: T('Jedes Mal, wenn er ihren letzten Platz erreicht, hat sie einen neuen. Es gibt **unendlich viele** solcher Etappen.', 64), gfx: { unendlich: {} } },
      { t: T('Also, folgert Zenon, kann Achilles sie **nie einholen**. Und doch wissen wir: Natürlich überholt er sie.', 64), gfx: { unendlich: {} } },
      { t: T('Zenon wollte damit zeigen, dass Bewegung ein **Widerspruch** ist – wie sein Lehrer Parmenides glaubte.', 64), gfx: { zenon: {} } },
      { t: T('Wo steckt der Fehler? Die Etappen werden **immer kürzer** – und damit auch die Zeit, die sie brauchen.', 64), gfx: { zeit: {} } },
      { t: T('Unendlich viele Teile können **zusammen endlich** sein. Ein halber Kuchen plus ein Viertel plus ein Achtel … ergibt nie mehr als einen Kuchen.', 64), gfx: { halbe: {} } },
      { t: T('Genauso addieren sich Achilles’ Etappen zu einer **festen Zeit**. Danach ist er vorbei.', 64), gfx: { zeit: {} } },
      { t: T('Sauber begründen konnte man das erst im 19. Jahrhundert, mit dem Begriff des **Grenzwerts**.', 64), gfx: { grenzwert: {} } },
      { t: T('Zenon hatte noch mehr Rätsel. Ein fliegender **Pfeil** ist in jedem einzelnen Augenblick an genau einem Ort – also ruht er. Wann bewegt er sich?', 64), gfx: { pfeil: {} } },
      { t: T('Der Legende nach stand der Philosoph **Diogenes** einfach auf und ging herum – als Widerlegung.', 64), gfx: { diogenes: {} } },
      { t: T('Aber manche Philosophen finden: Die Mathematik rechnet richtig, erklärt aber nicht ganz, wie man **unendlich viele** Schritte tatsächlich vollendet.', 64), gfx: { unendlich: {} } },
      { t: T('Ganz ähnlich: Um durch einen Raum zu gehen, musst du erst die Hälfte schaffen, davor ein Viertel, davor ein Achtel … Wie **fängst** du überhaupt an?', 64), gfx: { halbe: {} } },
      { t: T('Zenons Rätsel haben das Denken über **Unendlichkeit**, Raum und Zeit über zwei Jahrtausende angetrieben.', 64), gfx: { grenzwert: {} } },
      { t: T('Unendlich viele Schritte – und trotzdem **ein Ziel**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Zenon: Achilles muss unendlich viele Etappen laufen, um die Schildkröte einzuholen – also nie?', 'Auflösung: Unendlich viele immer kürzere Etappen ergeben eine endliche Summe (½ + ¼ + … = 1).', 'Exakt begründet erst mit dem Grenzwert im 19. Jh.; philosophisch wird weiter diskutiert.'],
    sources: ['Aristoteles: Physik VI, 9', 'Salmon (Hg.) 2001: Zeno’s Paradoxes', 'Stanford Encyclopedia of Philosophy: Zeno’s Paradoxes'],
  },
  {
    id: 'ockham',
    area: 'DENK',
    day: 36,
    hook: 'Warum ist die einfachste Erklärung meist die beste?',
    mood: 'raetsel',
    ambience: 'nacht',
    images: [img('ockham')],
    draw: {
      messer(g) {
        ink(g, [[60, 300], [260, 230], [300, 240], [80, 310], [60, 300]], { w: 2.8, t: 600 })
        ink(g, RR(20, 296, 50, 22, 6), { w: 2.6, d: 300, t: 300 })
        hatch(g, RR(20, 296, 50, 22, 6), 500, true)
      },
      wilhelm(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: 'um 1320', sub: 'Wilhelm von Ockham', up: true }])
      },
      dachboden(g) {
        ink(g, [[40, 620], [40, 500], [180, 380], [320, 500], [320, 620], [40, 620]], { w: 2.8, t: 700 })
        for (const x of [130, 220]) ink(g, B([x, 470], [x + 10, 456], [x + 20, 470], [x + 30, 456]), { w: 1.8, d: 700, t: 200 })
        question(g, 180, 560, 0.6, 1000)
        text(g, 180, 660, 'nachts: Kratzen und Poltern', { anchor: 'middle', cls: 's', d: 1100 })
      },
      erklaerungen(g) {
        box(g, 20, 390, 150, 100, ['Marder'], { size: 18 })
        box(g, 190, 390, 150, 100, ['Geist'], { size: 18, d: 300, fill: true })
        text(g, 95, 540, 'bekannt, häufig', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 265, 540, 'braucht viele neue', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 265, 564, 'Annahmen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      annahmen(g) {
        const rows = ['Geister existieren', 'sie können Dinge bewegen', 'sie mögen Dachböden', 'sie verstecken sich vor Kameras']
        rows.forEach((r, i) => {
          dot(g, 44, 380 + i * 50 - 5, 4, i * 300)
          text(g, 58, 380 + i * 50, r, { size: 17, d: i * 300 })
        })
        text(g, 180, 620, 'jede Annahme kann falsch sein', { anchor: 'middle', cls: 's', d: 1400 })
      },
      zebras(g) {
        horseShape(g, 110, 560, 1)
        horseShape(g, 260, 560, 1, 400, true)
        text(g, 110, 600, 'Pferd', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 260, 600, 'Zebra', { anchor: 'middle', cls: 's', d: 900 })
      },
      planeten(g) {
        ball(g, 180, 480, 14, { fill: 'dicht' })
        ink(g, E(180, 480, 120, 70), { w: 2, d: 300, t: 900 })
        for (const a of [0, 120, 240]) {
          const x = 180 + Math.cos((a * Math.PI) / 180) * 120
          const y = 480 + Math.sin((a * Math.PI) / 180) * 70
          ink(g, E(x, y, 22), { w: 1.6, d: 700 + a * 2, t: 300 })
        }
        text(g, 180, 620, 'Kreise auf Kreisen: Epizyklen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kopernikus(g) {
        ball(g, 180, 480, 18, { fill: 'dicht' })
        for (const r of [50, 80, 115]) ink(g, E(180, 480, r, r * 0.6), { w: 1.8, d: r * 5, t: 600 })
        text(g, 180, 620, 'Sonne in der Mitte: einfacher', { anchor: 'middle', cls: 's', d: 1000 })
      },
      overfit(g) {
        const pts: P[] = [[60, 560], [100, 520], [140, 540], [180, 480], [220, 500], [260, 440], [300, 450]]
        pts.forEach(([x, y], i) => dot(g, x, y, 5, i * 80))
        plot(g, 50, 580, 260, 160, (t) => 0.1 + t * 0.75, { d: 700, w: 2.4 })
        text(g, 180, 640, 'eine einfache Linie sagt Neues besser vorher', { anchor: 'middle', cls: 's', d: 1200 })
      },
      einstein(g) {
        text(g, 180, 440, '„So einfach wie möglich –', { anchor: 'middle', cls: 'it', size: 21, d: 200 })
        text(g, 180, 474, 'aber nicht einfacher.“', { anchor: 'middle', cls: 'it', size: 21, d: 400 })
        text(g, 180, 530, 'Einstein zugeschrieben', { anchor: 'middle', cls: 's', d: 800 })
      },
      verschwoerung(g) {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2
          box(g, 180 + Math.cos(a) * 110 - 30, 480 + Math.sin(a) * 110 - 16, 60, 32, '?', { size: 15, d: i * 150 })
        }
        text(g, 180, 488, 'Plan', { anchor: 'middle', size: 18, d: 1000 })
        text(g, 180, 650, 'jede Lücke braucht eine neue Annahme', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        ink(g, [[60, 520], [260, 450], [300, 460], [80, 530], [60, 520]], { w: 2.8, t: 600 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { messer: {} } },
      { t: T('Die Idee trägt den Namen eines Mönchs: **Wilhelm von Ockham**, ein englischer Franziskaner des 14. Jahrhunderts.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: '„Frater Occham“, Handschrift 1341' } } },
      { t: T('Sie heißt **Ockhams Rasiermesser**: Schneide alles weg, was du für eine Erklärung nicht brauchst.', 64), gfx: { messer: { tf: [1, 0, 220] } } },
      { t: T('Ein Beispiel: Nachts **poltert** es auf dem Dachboden.', 64), gfx: { dachboden: {} } },
      { t: T('Erklärung A: ein **Marder**. Erklärung B: ein Geist.', 64), gfx: { erklaerungen: {} } },
      { t: T('Beide erklären das Geräusch. Aber für den Geist brauchst du **viele neue Annahmen**: dass es Geister gibt, dass sie poltern können, und so weiter.', 64), gfx: { annahmen: {} } },
      { t: T('Jede Annahme kann falsch sein. Je mehr eine Erklärung braucht, desto **unwahrscheinlicher** wird sie insgesamt.', 64), gfx: { annahmen: {} } },
      { t: T('Ärzte lernen dazu einen Spruch: Hörst du **Hufgetrappel**, denk an Pferde – nicht an Zebras.', 64), gfx: { zebras: {} } },
      { t: T('Häufige Ursachen sind eben häufig. Seltene Krankheiten gibt es – aber man prüft sie **erst danach**.', 64), gfx: { zebras: {} } },
      { t: T('Auch die Wissenschaft lebt davon. Das alte Weltbild brauchte für die Planetenbahnen immer neue **Kreise auf Kreisen**.', 64), gfx: { planeten: {} } },
      { t: T('Mit der Sonne in der Mitte, später mit Ellipsen, wurde alles **viel einfacher** – und genauer.', 64), gfx: { kopernikus: {} } },
      { t: T('In der Statistik gilt dasselbe: Eine zu verschlungene Kurve passt perfekt auf alte Daten – und sagt neue **schlecht** vorher.', 64), gfx: { overfit: {} } },
      { t: T('Verschwörungstheorien verletzen die Regel oft: Jede Lücke stopfen sie mit einer **neuen Annahme** – noch mehr Mitwisser, noch mehr Vertuschung.', 64), gfx: { verschwoerung: {} } },
      { t: T('Aber Vorsicht: Das Rasiermesser ist eine **Faustregel**, kein Beweis. Manchmal ist die Welt eben doch kompliziert.', 64), gfx: { einstein: {} } },
      { t: T('Einstein wird der Satz zugeschrieben: „So einfach wie möglich – aber **nicht einfacher**.“', 64), gfx: { einstein: {} } },
      { t: T('Ein guter Test im Alltag: Welche Erklärung bräuchte die **wenigsten Zufälle**, Geheimnisse und Ausnahmen?', 64), gfx: { erklaerungen: {} } },
      { t: T('Ockham selbst schrieb die berühmte Formulierung übrigens **nie** so auf. Sie wurde ihm erst später in den Mund gelegt.', 64), gfx: { wilhelm: {} } },
      { t: T('Und er lebte gefährlich: Er stritt mit dem Papst, floh 1328 aus Avignon und wurde **exkommuniziert**.', 64), gfx: { wilhelm: {} } },
      { t: T('Weniger Annahmen – **weniger Irrtümer**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ockhams Rasiermesser: Keine Annahmen mehr als nötig; bei gleicher Erklärungskraft die sparsamere Erklärung vorziehen.', 'Jede Zusatzannahme kann falsch sein – viele machen eine Erklärung unwahrscheinlich (Marder vs. Geist, Pferde vs. Zebras).', 'Faustregel, kein Beweis: „So einfach wie möglich, aber nicht einfacher.“'],
    sources: ['Stanford Encyclopedia of Philosophy: William of Ockham', 'Sober 2015: Ockham’s Razors', 'Spade (Hg.) 1999: The Cambridge Companion to Ockham'],
  },
  {
    id: 'gehirn-tank',
    area: 'PHIL',
    day: 38,
    hook: 'Woher weißt du, dass du gerade nicht träumst?',
    mood: 'kosmisch',
    ambience: 'nacht',
    images: [img('gehirn'), img('schmetterling')],
    draw: {
      tank(g) {
        vat(g, 180, 420, 1.3)
      },
      traum(g) {
        fig(g, 120, 600, 4)
        for (const [x, y, r] of [[200, 520, 8], [230, 480, 12], [270, 420, 40]] as const) ink(g, E(x, y, r), { w: 2, d: 400 + r * 10, t: 300 })
        question(g, 270, 420, 0.5, 1100)
      },
      descartes(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '1641', sub: 'René Descartes: Meditationen', up: true }])
      },
      daemon(g) {
        fig(g, 110, 600, 4)
        eye(g, 270, 420, 1.2, 400)
        for (const x of [130, 160]) dashes(g, L([250, 440], [x, 500]), { w: 1.2, d: 800 })
        text(g, 180, 650, 'ein Dämon, der dich täuscht', { anchor: 'middle', cls: 's', d: 1000 })
      },
      cogito(g) {
        text(g, 180, 440, '„Ich denke,', { anchor: 'middle', cls: 'it', size: 30, d: 200 })
        text(g, 180, 484, 'also bin ich.“', { anchor: 'middle', cls: 'it', size: 30, d: 500 })
        text(g, 180, 540, 'cogito, ergo sum', { anchor: 'middle', cls: 's', d: 900 })
      },
      putnam(g) {
        vat(g, 140, 620, 1, 0, false)
        ink(g, RR(250, 380, 80, 60, 6), { w: 2.6, d: 600, t: 400 })
        for (const k of [-12, 0, 12]) ink(g, B([140 + k, 506], [140 + k, 420], [200, 410 + k * 0.5], [250, 410 + k * 0.5]), { w: 1.6, d: 900, t: 400 })
        text(g, 290, 470, 'Computer', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 180, 660, 'Hilary Putnam 1981', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zhuangzi(g) {
        butterfly(g, 180, 470, 1.4)
        text(g, 180, 600, 'Zhuangzi, China, um 300 v. Chr.', { anchor: 'middle', cls: 's', d: 900 })
      },
      klar(g) {
        bullets(g, 40, 380, ['Uhr zweimal ansehen', 'Text lesen, wegschauen, nochmal', 'Lichtschalter drücken'], { gap: 56, size: 18 })
        text(g, 180, 600, 'im Traum ändern sie sich oft', { anchor: 'middle', cls: 's', d: 1300 })
      },
      moore(g) {
        hand(g, 180, 560, 1.4)
        text(g, 180, 380, '„Hier ist eine Hand.“', { anchor: 'middle', cls: 'it', size: 24, d: 600 })
        text(g, 180, 650, 'G. E. Moore 1939', { anchor: 'middle', cls: 's', d: 900 })
      },
      matrix(g) {
        for (let c = 0; c < 8; c++) for (let r = 0; r < 6; r++) if ((c * 7 + r * 3) % 4 !== 0) text(g, 40 + c * 40, 380 + r * 44, (c + r) % 2 ? '1' : '0', { anchor: 'middle', size: 18, d: (c + r) * 60 })
      },
      ende(g) {
        vat(g, 180, 620, 1.1)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Im Traum wirkt alles **echt**. Erst beim Aufwachen merkst du, dass es keiner war.', 64), gfx: { traum: {} } },
      { t: T('Woher weißt du also, dass du **jetzt** wach bist? Vielleicht wachst du gleich auf.', 64), gfx: { traum: {} } },
      { t: T('Der französische Philosoph **René Descartes** stellte diese Frage 1641 – und ging noch weiter.', 64), gfx: { descartes: {} } },
      { t: T('Was, wenn ein mächtiger **Dämon** dir eine ganze Welt vorgaukelt – Farben, Klänge, deinen eigenen Körper?', 64), gfx: { daemon: {} } },
      { t: T('Descartes wollte nur glauben, was **absolut sicher** ist. Fast alles fiel durch: Sinne können täuschen, Träume auch.', 64), gfx: { daemon: {} } },
      { t: T('Eines blieb übrig: Selbst wenn ich getäuscht werde – dann **denke** ich. Und wer denkt, existiert.', 64), gfx: { cogito: {} } },
      { t: T('„**Ich denke, also bin ich.**“ Das war für ihn das Fundament, auf dem alles Wissen stehen sollte.', 64), gfx: { cogito: {} } },
      { t: T('1981 machte der Philosoph **Hilary Putnam** daraus eine moderne Version: ein Gehirn in einem Tank.', 64), gfx: { putnam: {} } },
      { t: T('Ein Computer füttert seine Nerven mit **perfekten Signalen**. Das Gehirn erlebt ein ganz normales Leben – und merkt nichts.', 64), gfx: { putnam: {} } },
      { t: T('Könntest du von innen herausfinden, ob du so ein Gehirn bist? Die unbequeme Antwort: **wohl kaum**.', 64), gfx: { tank: { tf: [1, 0, 220] } } },
      { t: T('Der Philosoph Nick Bostrom fragte 2003 sogar: Wenn künftige Zivilisationen viele Welten **simulieren**, leben wir dann wahrscheinlich in einer?', 64), gfx: { matrix: {} } },
      { t: T('Der Film **Matrix** von 1999 machte genau diese Idee berühmt.', 64), gfx: { matrix: {} } },
      { t: T('Die Frage ist uralt. Der chinesische Denker **Zhuangzi** träumte, ein Schmetterling zu sein. Beim Aufwachen fragte er sich: Bin ich ein Mensch, der träumte – oder ein Schmetterling, der jetzt träumt?', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Der Brite G. E. Moore antwortete 1939 trotzig: „Hier ist eine **Hand**.“ Das sei sicherer als jedes Argument dagegen.', 64), gfx: { moore: {} } },
      { t: T('Putnam selbst meinte übrigens, der Satz „Ich bin ein Gehirn im Tank“ könne gar nicht **wahr** sein – weil die Wörter eines Tankgehirns sich nicht auf echte Tanks bezögen.', 64), gfx: { ende: {} } },
      { t: T('Andere sagen: Selbst wenn alles simuliert wäre, wären deine Freunde, Gefühle und Erfahrungen **echt für dich**.', 64), gfx: { ende: {} } },
      { t: T('Praktisch helfen **Realitätschecks**: Im Traum ändert sich Text beim zweiten Lesen oft, Uhren zeigen Unsinn, Lichtschalter versagen.', 64), gfx: { klar: {} } },
      { t: T('Wer so etwas übt, erkennt manchmal im Traum, dass er träumt – ein **Klartraum**.', 64), gfx: { klar: {} } },
      { t: T('Ganz sicher ist **nur**, dass du denkst.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Descartes (1641): Träume und ein täuschender Dämon machen fast alles zweifelhaft – nur „Ich denke, also bin ich“ bleibt.', 'Putnam (1981): Gehirn im Tank – von innen kaum zu widerlegen; ähnlich Zhuangzis Schmetterlingstraum, „Matrix“.', 'Antworten: Moores „Hier ist eine Hand“, Pragmatismus; Realitätschecks helfen gegen Träume.'],
    sources: ['Descartes 1641: Meditationen über die erste Philosophie', 'Putnam 1981: Reason, Truth and History, Kap. 1', 'Moore 1939: Proof of an External World'],
  },
  {
    id: 'zweitstimme',
    area: 'POL',
    day: 15,
    hook: 'Warum ist bei der Bundestagswahl die Zweitstimme wichtiger?',
    mood: 'hell',
    ambience: 'stadt',
    images: [img('bundestag'), img('stimmzettel')],
    draw: {
      zettel(g) {
        ballot(g, 40, 110, 280, 200)
      },
      erst(g) {
        ballot(g, 40, 360, 280, 200, 0, 1)
        text(g, 110, 610, 'Person im Wahlkreis', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zweit(g) {
        ballot(g, 40, 360, 280, 200, 0, 2)
        text(g, 250, 610, 'Partei', { anchor: 'middle', cls: 's', d: 1200 })
      },
      sitze(g) {
        parliament(g, 180, 600, 160, 56, 0.4)
        text(g, 180, 650, 'Zweitstimmen bestimmen die Sitze', { anchor: 'middle', cls: 's', d: 1400 })
      },
      wahlkreise(g) {
        text(g, 180, 450, '299', { anchor: 'middle', size: 70, d: 200 })
        text(g, 180, 495, 'Wahlkreise', { anchor: 'middle', cls: 's', d: 600 })
      },
      prozent(g) {
        hbars(g, [
          { label: 'Partei A', v: 30, fmt: () => '30 %', dense: true },
          { label: 'Partei B', v: 20, fmt: () => '20 %' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80, max: 50 })
        text(g, 180, 590, '30 % der Stimmen → etwa 30 % der Sitze', { anchor: 'middle', cls: 's', d: 1200 })
      },
      aufblaehen(g) {
        hbars(g, [
          { label: '2017', v: 709, fmt: () => '709 Sitze' },
          { label: '2021', v: 736, fmt: () => '736 Sitze', dense: true },
          { label: 'seit 2025', v: 630, fmt: () => '630 Sitze' },
        ], { x: 30, y: 380, w: 300, h: 36, gap: 76, max: 760 })
      },
      deckung(g) {
        box(g, 30, 380, 140, 90, ['Wahlkreis', 'gewonnen'], { size: 16 })
        text(g, 180, 432, '+', { anchor: 'middle', size: 30, d: 400 })
        box(g, 190, 380, 140, 90, ['genug', 'Zweitstimmen?'], { size: 16, fill: true, d: 500 })
        check(g, 110, 560, 0.7, 900)
        text(g, 110, 620, 'Sitz', { anchor: 'middle', cls: 's', d: 1000 })
        cross(g, 250, 560, 0.7, 1100)
        text(g, 250, 620, 'kein Sitz', { anchor: 'middle', cls: 's', d: 1200 })
      },
      dreiundzwanzig(g) {
        text(g, 180, 450, '23', { anchor: 'middle', size: 70, d: 200 })
        text(g, 180, 495, 'Wahlkreissieger 2025 ohne Mandat', { anchor: 'middle', cls: 's', d: 600 })
      },
      huerde(g) {
        hbars(g, [
          { label: 'Partei C', v: 6, fmt: () => '6 %', dense: true },
          { label: 'Partei D', v: 4.5, fmt: () => '4,5 %' },
        ], { x: 30, y: 400, w: 300, h: 40, gap: 80, max: 10 })
        ink(g, L([180, 364], [180, 394]), { w: 2.4, d: 900, t: 200 })
        text(g, 180, 354, '5 %', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 180, 590, 'C ist drin, D draußen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      grundmandat(g) {
        for (let i = 0; i < 3; i++) box(g, 40 + i * 100, 420, 80, 80, `${i + 1}`, { size: 24, d: i * 200, fill: true })
        text(g, 180, 570, 'drei Wahlkreise gewonnen: Partei zieht ein', { anchor: 'middle', cls: 's', d: 900 })
      },
      splitting(g) {
        ballot(g, 40, 360, 280, 200, 0, 3)
        text(g, 180, 610, 'Stimmensplitting: verschiedene Parteien', { anchor: 'middle', cls: 's', d: 1400 })
      },
      ende(g) {
        ballot(g, 40, 400, 280, 200, 0, 2)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Auf dem Stimmzettel für den Bundestag hast du **zwei Kreuze**. Links die Erststimme, rechts die Zweitstimme.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Stimmzettel 1949 – damals nur eine Stimme' } } },
      { t: T('Mit der **Erststimme** wählst du eine Person: wer deinen Wahlkreis im Bundestag vertreten soll.', 64), gfx: { erst: {} } },
      { t: T('Deutschland ist in **299 Wahlkreise** eingeteilt. In jedem gewinnt, wer die meisten Erststimmen hat.', 64), gfx: { wahlkreise: {} } },
      { t: T('Mit der **Zweitstimme** wählst du eine Partei – genauer: ihre Landesliste.', 64), gfx: { zweit: {} } },
      { t: T('Und die Zweitstimme entscheidet, wie viele Sitze jede Partei **insgesamt** bekommt.', 64), gfx: { sitze: {} } },
      { t: T('Holt eine Partei 30 Prozent der Zweitstimmen, bekommt sie ungefähr **30 Prozent** der Sitze. So ist das Parlament ein Spiegel der Wählerschaft.', 64), gfx: { prozent: {} } },
      { t: T('Der Name „Zweit“stimme ist also irreführend. Für die Machtverteilung ist sie die **wichtigere**.', 64), gfx: { sitze: {} } },
      { t: T('Früher gab es ein Problem: Gewann eine Partei mehr Wahlkreise, als ihr nach Zweitstimmen zustanden, behielt sie diese **Überhangmandate**.', 64), gfx: { aufblaehen: {} } },
      { t: T('Die anderen Parteien bekamen dafür **Ausgleichsmandate**. Der Bundestag wuchs – 2021 auf 736 Abgeordnete.', 64), gfx: { aufblaehen: {} } },
      { t: T('Das Parlament wurde damit zu einem der **größten** der Welt – teurer und schwerfälliger.', 64), gfx: { aufblaehen: {} } },
      { t: T('Seit der Wahlrechtsreform hat der Bundestag fest **630 Sitze**. Erstmals galt das bei der Wahl 2025.', 64), gfx: { aufblaehen: {} } },
      { t: T('Dafür gilt jetzt: Ein Wahlkreissieger zieht nur ein, wenn seine Partei genug **Zweitstimmen** für diesen Sitz hat.', 64), gfx: { deckung: {} } },
      { t: T('2025 gewannen so **23 Kandidierende** ihren Wahlkreis – und bekamen trotzdem keinen Sitz.', 64), gfx: { dreiundzwanzig: {} } },
      { t: T('Außerdem gilt die **Fünf-Prozent-Hürde**: Parteien mit weniger Zweitstimmen bekommen keine Sitze.', 64), gfx: { huerde: {} } },
      { t: T('Ausnahme: Gewinnt eine Partei mindestens **drei Wahlkreise**, zieht sie trotzdem nach ihrem Zweitstimmenanteil ein.', 64), gfx: { grundmandat: {} } },
      { t: T('Die Sitze innerhalb einer Partei verteilen sich dann auf die **Bundesländer**, je nach deren Zweitstimmen.', 64), gfx: { sitze: {} } },
      { t: T('Du kannst übrigens **splitten**: Erststimme für die Person, die du magst, Zweitstimme für eine andere Partei.', 64), gfx: { splitting: {} } },
      { t: T('Wer die Machtverhältnisse im Bundestag beeinflussen will, sollte also vor allem bei der **Zweitstimme** genau überlegen.', 64), gfx: { zweit: {} } },
      { t: T('Die Zweitstimme ist **die erste**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Erststimme: Person im Wahlkreis (299); Zweitstimme: Partei – sie bestimmt die Sitzverteilung.', 'Seit der Reform (erstmals 2025) fest 630 Sitze; Wahlkreissieger brauchen Zweitstimmendeckung – 2025 blieben 23 ohne Mandat.', '5-%-Hürde mit Grundmandatsklausel (3 Wahlkreise); Stimmensplitting ist möglich.'],
    sources: ['Bundeswahlgesetz (Fassung 2023)', 'Die Bundeswahlleiterin: Bundestagswahl 2025 – Ergebnisse', 'Bundesverfassungsgericht, Urteil vom 30. Juli 2024 (2 BvF 1/23)'],
  },
  {
    id: 'gerrymandering',
    area: 'POL',
    day: 15,
    hook: 'Kann man eine Wahl gewinnen, indem man Grenzen verschiebt?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [img('gerry-mander')],
    draw: {
      karte(g) {
        voters(g, 80, 110, 5, 40, [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0])
        district(g, RR(80, 110, 200, 200, 4), 600)
      },
      grund(g) {
        voters(g, 80, 380, 5, 40, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        text(g, 180, 630, '15 schraffiert, 10 leer: 60 zu 40', { anchor: 'middle', cls: 's', d: 900 })
      },
      fair(g) {
        voters(g, 80, 380, 5, 40, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        for (let i = 0; i < 5; i++) district(g, RR(80 + i * 40 + 2, 382, 36, 196, 4), 600 + i * 150)
        text(g, 180, 630, 'Spalten: 5 zu 0 für Schraffiert', { anchor: 'middle', cls: 's', d: 1500 })
      },
      trick(g) {
        voters(g, 80, 380, 5, 40, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        for (let i = 0; i < 3; i++) district(g, RR(80 + 2, 382 + i * 40, 196, 36, 4), 600 + i * 150)
        district(g, RR(82, 502, 196, 36, 4), 1050)
        district(g, RR(82, 542, 196, 36, 4), 1200)
        text(g, 180, 630, 'Zeilen: 3 zu 2', { anchor: 'middle', cls: 's', d: 1500 })
      },
      umgekehrt(g) {
        voters(g, 80, 380, 5, 40, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        district(g, [[82, 382], [278, 382], [278, 418], [82, 418], [82, 382]], 500)
        district(g, [[82, 422], [278, 422], [278, 458], [82, 458], [82, 422]], 650)
        district(g, [[82, 462], [158, 462], [158, 538], [118, 538], [118, 578], [82, 578], [82, 462]], 800)
        district(g, [[162, 462], [198, 462], [198, 542], [238, 542], [238, 578], [122, 578], [122, 542], [162, 542], [162, 462]], 950)
        district(g, [[202, 462], [278, 462], [278, 578], [242, 578], [242, 538], [202, 538], [202, 462]], 1100)
        text(g, 180, 630, 'gleiche Wähler – andere Mehrheit', { anchor: 'middle', cls: 's', d: 1400 })
      },
      gerry(g) {
        timeline(g, 30, 330, 470, [{ at: 0.4, label: '1812', sub: 'Elbridge Gerry, Massachusetts', up: true }])
      },
      salamander(g) {
        const p: P[] = [...B([60, 520], [80, 440], [140, 470], [160, 420]), ...B([160, 420], [190, 380], [240, 420], [260, 460]).slice(1), ...B([260, 460], [300, 500], [300, 560], [250, 560]).slice(1), ...B([250, 560], [200, 560], [180, 520], [140, 560]).slice(1), ...B([140, 560], [100, 600], [60, 580], [60, 520]).slice(1)]
        blank(g, p)
        hatch(g, p, 600)
        ink(g, p, { w: 3, t: 900 })
        text(g, 180, 640, 'Gerry + Salamander', { anchor: 'middle', cls: 's', d: 1000 })
      },
      packen(g) {
        box(g, 20, 400, 150, 100, ['packing:', 'Gegner bündeln'], { size: 15, fill: true })
        box(g, 190, 400, 150, 100, ['cracking:', 'Gegner zerteilen'], { size: 15, d: 400 })
      },
      usa(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: 'alle 10 Jahre', sub: 'USA: Grenzen nach der Volkszählung neu', up: true }])
      },
      computer(g) {
        ink(g, RR(80, 400, 200, 130, 10), { w: 3, t: 600 })
        for (let i = 0; i < 6; i++) ink(g, L([100, 420 + i * 16], [100 + 40 + ((i * 37) % 120), 420 + i * 16]), { w: 1.4, d: 300 + i * 80, t: 200 })
        ink(g, L([150, 530], [130, 570]), { w: 2.6, d: 400, t: 200 })
        ink(g, L([210, 530], [230, 570]), { w: 2.6, d: 400, t: 200 })
        text(g, 180, 620, 'Software zieht heute die Linien', { anchor: 'middle', cls: 's', d: 1000 })
      },
      deutschland(g) {
        box(g, 30, 400, 300, 70, 'unabhängige Wahlkreiskommission', { size: 16 })
        text(g, 180, 540, 'und die Zweitstimme gleicht aus', { anchor: 'middle', d: 800 })
      },
      ende(g) {
        voters(g, 80, 400, 5, 40, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        for (let i = 0; i < 5; i++) district(g, RR(80 + i * 40 + 2, 402, 36, 196, 4), 600 + i * 150)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { karte: {} } },
      { t: T('Stell dir eine kleine Stadt mit **25 Wählern** vor. 15 wählen Schraffiert, 10 wählen Leer – also 60 zu 40.', 64), gfx: { grund: {} } },
      { t: T('Die Stadt wird in **fünf Wahlkreise** geteilt. Jeder Kreis schickt eine Person ins Parlament.', 64), gfx: { grund: {} } },
      { t: T('Zieht man die Grenzen als **senkrechte Spalten**, gewinnt Schraffiert jeden Kreis: 5 zu 0.', 64), gfx: { fair: {} } },
      { t: T('Zieht man sie als **Zeilen**, gewinnt Schraffiert nur drei Kreise, Leer zwei.', 64), gfx: { trick: {} } },
      { t: T('Und mit geschickt geformten Kreisen kann sogar die **Minderheit** gewinnen: Leer holt drei von fünf.', 64), gfx: { umgekehrt: {} } },
      { t: T('Dieselben Wähler, dieselben Stimmen – und doch ein **völlig anderes** Parlament.', 64), gfx: { umgekehrt: {} } },
      { t: T('Wer die Grenzen zieht, kann also das Ergebnis **vorher festlegen** – ohne eine einzige Stimme zu fälschen.', 64), gfx: { umgekehrt: {} } },
      { t: T('Das heißt **Gerrymandering**. Der Name geht auf Elbridge Gerry zurück, Gouverneur von Massachusetts.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: '„The Gerry-Mander“, 1812' } } },
      { t: T('1812 unterschrieb er neue Wahlkreise. Einer davon war so verschlungen, dass Zeitungen ihn als **Salamander** zeichneten: Gerry-mander.', 64), gfx: { salamander: {} } },
      { t: T('Die zwei Grundtricks: **Packing** – man presst die Gegner in wenige Kreise, die sie haushoch gewinnen.', 64), gfx: { packen: {} } },
      { t: T('Und **Cracking** – man verteilt sie so auf viele Kreise, dass sie überall knapp verlieren.', 64), gfx: { packen: {} } },
      { t: T('In den USA werden die Grenzen für das Repräsentantenhaus alle **zehn Jahre** nach der Volkszählung neu gezogen – oft von der Partei, die gerade regiert.', 64), gfx: { usa: {} } },
      { t: T('In manchen Wahlkreisen entstanden so Formen wie Ohrenwärmer oder **Hummer** – mit schmalen Fluren, die Stadtviertel verbinden.', 64), gfx: { salamander: {} } },
      { t: T('Heute berechnet **Software** Tausende Varianten, um das Maximum herauszuholen.', 64), gfx: { computer: {} } },
      { t: T('Manche Bundesstaaten haben darum **unabhängige Kommissionen** eingeführt, die die Linien ziehen.', 64), gfx: { deutschland: {} } },
      { t: T('Mathematiker vergleichen heute die echten Grenzen mit Millionen **zufällig erzeugten** Karten – so lässt sich Schummelei vor Gericht belegen.', 64), gfx: { computer: {} } },
      { t: T('In Deutschland legt eine unabhängige **Wahlkreiskommission** die Grenzen fest. Die Kreise sollen ungefähr gleich viele Einwohner haben.', 64), gfx: { deutschland: {} } },
      { t: T('Und weil die **Zweitstimme** über die Sitzverteilung entscheidet, bringt Grenzschieberei hier kaum etwas.', 64), gfx: { deutschland: {} } },
      { t: T('Systeme mit nur einem Sieger pro Wahlkreis sind besonders **anfällig** – etwa in den USA oder Großbritannien.', 64), gfx: { trick: {} } },
      { t: T('Wer die Grenzen zieht, **wählt mit**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei Mehrheitswahl in Wahlkreisen kann der Grenzverlauf das Ergebnis drehen – bis zum Sieg der Minderheit.', 'Name nach Elbridge Gerry (1812, „Salamander“-Wahlkreis); Tricks: packing und cracking.', 'Verhältniswahl (Zweitstimme) und unabhängige Kommissionen begrenzen den Effekt.'],
    sources: ['Griffith 1907: The Rise and Development of the Gerrymander', 'Stephanopoulos & McGhee 2015, University of Chicago Law Review 82', 'Die Bundeswahlleiterin: Wahlkreiskommission'],
  },
  {
    id: 'bundespraesident',
    area: 'POL',
    day: 15,
    hook: 'Warum wählen wir den Bundespräsidenten nicht direkt?',
    mood: 'ruhig',
    ambience: 'glocke',
    images: [img('bellevue'), img('hindenburg')],
    draw: {
      schloss(g) {
        ink(g, L([20, 400], [340, 400]), { w: 2.6, t: 500 })
        ink(g, RR(60, 260, 240, 140, 4), { w: 3, d: 200, t: 700 })
        for (let i = 0; i < 6; i++) ink(g, RR(78 + i * 36, 290, 20, 40, 3), { w: 1.8, d: 500 + i * 60, t: 200 })
        ink(g, [[60, 260], [180, 200], [300, 260]], { w: 2.8, d: 400, t: 500 })
        ink(g, L([180, 200], [180, 150]), { w: 2, d: 800, t: 200 })
        ink(g, [[180, 152], [214, 162], [180, 172]], { w: 2, d: 900, t: 200 })
      },
      weimar(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '1919', sub: 'Weimarer Verfassung', up: true },
          { at: 0.75, label: '1933', sub: 'Hindenburg ernennt Hitler', big: true },
        ])
      },
      macht(g) {
        bullets(g, 40, 380, ['direkt vom Volk gewählt', 'Notverordnungen (Art. 48)', 'Kanzler ernennen und entlassen', 'Reichstag auflösen'], { gap: 52, size: 18 })
        text(g, 180, 620, 'der Reichspräsident: ein „Ersatzkaiser“', { anchor: 'middle', cls: 's', d: 1600 })
      },
      gg(g) {
        timeline(g, 30, 330, 470, [{ at: 0.5, label: '1949', sub: 'Grundgesetz: bewusst schwaches Amt', up: true }])
      },
      versammlung(g) {
        parliament(g, 180, 600, 160, 60, 0.5)
        text(g, 100, 640, 'Bundestag', { anchor: 'middle', cls: 's', d: 1400 })
        text(g, 260, 640, 'Länder-Delegierte', { anchor: 'middle', cls: 's', d: 1500 })
      },
      amtszeit(g) {
        text(g, 180, 450, '5 Jahre', { anchor: 'middle', size: 54, d: 200 })
        text(g, 180, 495, 'einmal wiederwählbar', { anchor: 'middle', cls: 's', d: 600 })
      },
      aufgaben(g) {
        bullets(g, 40, 370, ['Gesetze unterschreiben', 'Kanzler vorschlagen', 'Staatsbesuche, Reden', 'Begnadigungen'], { gap: 52, size: 18 })
      },
      pruefen(g) {
        ink(g, RR(110, 390, 140, 180, 4), { w: 2.8, t: 500 })
        for (let i = 0; i < 6; i++) ink(g, L([130, 420 + i * 20], [230 - (i % 2) * 30, 420 + i * 20]), { w: 1.4, d: 300 + i * 60, t: 150 })
        ink(g, B([140, 548], [160, 530], [180, 560], [220, 540]), { w: 2.4, d: 900, t: 400 })
        text(g, 180, 630, 'erst die Unterschrift macht das Gesetz gültig', { anchor: 'middle', cls: 's', d: 1100 })
      },
      stopp(g) {
        text(g, 180, 450, 'selten', { anchor: 'middle', size: 54, d: 200 })
        text(g, 180, 495, 'z. B. Horst Köhler 2006 – gleich zweimal', { anchor: 'middle', cls: 's', d: 600 })
      },
      aufloesen(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '1972', up: true },
          { at: 0.35, label: '1982' },
          { at: 0.6, label: '2005', up: true },
          { at: 0.88, label: '2024', sub: 'Neuwahl 2025', big: true },
        ])
      },
      konflikt(g) {
        fig(g, 90, 600, 4.4)
        fig(g, 270, 600, 4.4, { d: 200 })
        text(g, 90, 650, 'Präsident', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 270, 650, 'Kanzlerin/Kanzler', { anchor: 'middle', cls: 's', d: 600 })
        bolt2(g, 180, 470, 800)
      },
      oesterreich(g) {
        box(g, 20, 400, 150, 90, ['Österreich:', 'direkt gewählt'], { size: 14 })
        box(g, 190, 400, 150, 90, ['Deutschland:', 'Bundes-', 'versammlung'], { size: 14, fill: true, d: 400 })
      },
      ende(g) {
        ink(g, L([20, 600], [340, 600]), { w: 2.6, t: 500 })
        ink(g, RR(80, 480, 200, 120, 4), { w: 3, d: 200, t: 700 })
        ink(g, [[80, 480], [180, 430], [280, 480]], { w: 2.8, d: 400, t: 500 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Die Antwort liegt in der Geschichte – in der **Weimarer Republik**, Deutschlands erster Demokratie.', 64), gfx: { weimar: {} } },
      { t: T('Ihr Reichspräsident wurde **direkt vom Volk** gewählt – und hatte enorme Macht.', 64), gfx: { macht: {} } },
      { t: T('Er konnte mit **Notverordnungen** am Parlament vorbei regieren, Kanzler ernennen und entlassen, den Reichstag auflösen.', 64), gfx: { macht: {} } },
      { t: T('In der Krise ab 1930 regierten Kanzler fast nur noch mit seinen Verordnungen. Das Parlament war **ausgeschaltet**.', 64), gfx: { macht: {} } },
      { t: T('Im Januar 1933 ernannte Reichspräsident **Hindenburg** Adolf Hitler zum Reichskanzler.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.2], cap: 'Paul von Hindenburg, 1933' } } },
      { t: T('Die Väter und Mütter des Grundgesetzes zogen 1949 die Lehre: Das Staatsoberhaupt soll **wenig politische Macht** haben.', 64), gfx: { gg: {} } },
      { t: T('Darum wählt den Bundespräsidenten die **Bundesversammlung**: alle Bundestagsabgeordneten und ebenso viele Delegierte der Landesparlamente.', 64), gfx: { versammlung: {} } },
      { t: T('Unter den Delegierten sind oft auch **Prominente** – Sportlerinnen, Schauspieler, Ärztinnen.', 64), gfx: { versammlung: {} } },
      { t: T('Die Amtszeit dauert **fünf Jahre**. Danach ist eine Wiederwahl einmal möglich.', 64), gfx: { amtszeit: {} } },
      { t: T('Was macht der Bundespräsident? Er **unterschreibt** Gesetze, schlägt den Kanzler vor, ernennt Minister, hält Reden, empfängt Staatsgäste.', 64), gfx: { aufgaben: {} } },
      { t: T('Ohne seine Unterschrift tritt kein Gesetz in Kraft. Er prüft, ob es **verfassungsgemäß** zustande kam.', 64), gfx: { pruefen: {} } },
      { t: T('Das ist selten, kommt aber vor: Seit 1949 haben Bundespräsidenten nur eine Handvoll Male die Unterschrift **verweigert**.', 64), gfx: { stopp: {} } },
      { t: T('Den Bundestag auflösen darf er nur in Ausnahmefällen – etwa nach einer verlorenen **Vertrauensfrage**, wie zuletzt Ende 2024.', 64), gfx: { aufloesen: {} } },
      { t: T('Seine stärkste Waffe ist das **Wort**: Reden wie Richard von Weizsäckers Rede zum 8. Mai 1985 prägten das Land.', 64), gfx: { aufgaben: {} } },
      { t: T('Kritiker fordern trotzdem eine **Direktwahl**: Sie gäbe dem Amt mehr Rückhalt im Volk.', 64), gfx: { oesterreich: {} } },
      { t: T('Die Gegenseite warnt: Ein direkt gewählter Präsident könnte mehr Macht beanspruchen und mit der Regierung **in Konflikt** geraten.', 64), gfx: { konflikt: {} } },
      { t: T('In Österreich wird der Präsident direkt gewählt – hat aber ebenfalls wenig **Tagespolitik** in der Hand.', 64), gfx: { oesterreich: {} } },
      { t: T('Das Amt ist bewusst **schwach** – aus Erfahrung.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Der direkt gewählte Reichspräsident der Weimarer Republik hatte große Macht (Notverordnungen) und ernannte 1933 Hitler.', 'Daher ist der Bundespräsident bewusst schwach und wird von der Bundesversammlung gewählt (5 Jahre, einmal wiederwählbar).', 'Er unterschreibt und prüft Gesetze, ernennt die Regierung und kann den Bundestag nur in Ausnahmefällen auflösen.'],
    sources: ['Grundgesetz Art. 54–61, 63, 68, 82', 'Bundeszentrale für politische Bildung: Der Bundespräsident', 'Bundespräsidialamt: Ausfertigung von Gesetzen'],
  },
]

/** Pferd, schematisch, Füße auf y (zebra = Streifen) */
function horseShape(g: Element, x: number, y: number, s = 1, d = 0, zebra = false): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = RR(x - 40 * s, y - 70 * s, 80 * s, 34 * s, 14 * s)
  blank(g, body)
  if (zebra) for (let i = 0; i < 5; i++) ink(g, L(P(-28 + i * 14, -68), P(-32 + i * 14, -38)), { w: 2, d: d + 500 + i * 60, t: 100 })
  ink(g, body, { w: 2.6, d, t: 500 })
  for (const k of [-30, -16, 16, 30]) ink(g, L(P(k, -36), P(k, 0)), { w: 2.4, d: d + 200, t: 200 })
  ink(g, [P(30, -66), P(46, -100), P(64, -96), P(56, -84), P(44, -62)], { w: 2.6, d: d + 300, t: 300 })
}

/** Schmetterling */
function butterfly(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  for (const k of [-1, 1]) {
    const up: P[] = [...B([cx, cy], [cx + k * 20 * s, cy - 70 * s], [cx + k * 80 * s, cy - 60 * s], [cx + k * 60 * s, cy - 10 * s]), [cx, cy]]
    const lo: P[] = [...B([cx, cy], [cx + k * 50 * s, cy + 10 * s], [cx + k * 50 * s, cy + 50 * s], [cx + k * 16 * s, cy + 40 * s]), [cx, cy]]
    hatch(g, up, d + 400)
    ink(g, up, { w: 2.4, d, t: 500 })
    ink(g, lo, { w: 2.4, d: d + 200, t: 400 })
  }
  ink(g, L([cx, cy - 20 * s], [cx, cy + 40 * s]), { w: 3, d: d + 300, t: 300 })
}

/** Hand (offen), Handballen bei (cx, y) */
function hand(g: Element, cx: number, y: number, s = 1, d = 0): void {
  ink(g, RR(cx - 30 * s, y - 50 * s, 60 * s, 50 * s, 14 * s), { w: 2.6, d, t: 400 })
  for (let i = 0; i < 4; i++) {
    const p = RR(cx + (-28 + i * 15) * s, y - (100 - Math.abs(i - 1.5) * 8) * s, 12 * s, (54 - Math.abs(i - 1.5) * 8) * s, 6 * s)
    blank(g, p)
    ink(g, p, { w: 2.2, d: d + 200 + i * 80, t: 200 })
  }
  const th = RR(cx + 30 * s, y - 52 * s, 30 * s, 12 * s, 6 * s)
  blank(g, th)
  ink(g, th, { w: 2.2, d: d + 600, t: 200 })
}

/** Blitz zwischen zwei Personen */
function bolt2(g: Element, cx: number, cy: number, d = 0): void {
  const p: P[] = [[cx - 10, cy - 40], [cx + 8, cy - 6], [cx - 6, cy - 2], [cx + 10, cy + 40]]
  ink(g, p, { w: 3, d, t: 400 })
}
