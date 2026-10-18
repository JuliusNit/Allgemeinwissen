import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, bubble, check, cross, crowd, dashes, fig, hatch, ink, mk, question, st, text, timeline, vbars, type P } from './draw'
import { axes, ball, box, bullets, carrow, dot, earth, house, lens, plot, rad, sun } from './kit'

// Denkwerkzeuge & Statistik: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Bomber von oben, Nase nach oben, Mitte (cx, cy) */
function bomber(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [cx + a * s, cy + b * s]
  const wing: P[] = [P(-150, 0), P(-14, -24), P(14, -24), P(150, 0), P(150, 16), P(14, 10), P(-14, 10), P(-150, 16), P(-150, 0)]
  blank(g, wing)
  ink(g, wing, { w: 2.6, d, t: 800 })
  const tail: P[] = [P(-50, 120), P(-10, 110), P(10, 110), P(50, 120), P(50, 132), P(-50, 132), P(-50, 120)]
  blank(g, tail)
  ink(g, tail, { w: 2.4, d: d + 300, t: 400 })
  const body = RR(cx - 16 * s, cy - 110 * s, 32 * s, 250 * s, 16 * s)
  blank(g, body)
  ink(g, body, { w: 2.8, d: d + 100, t: 700 })
  for (const x of [-100, -55, 55, 100]) ink(g, RR(cx + x * s - 8 * s, cy - 34 * s, 16 * s, 30 * s, 6 * s), { w: 2, d: d + 600, t: 200 })
}

/** Münze mit K oder Z */
function coinKZ(g: Element, x: number, y: number, k: boolean, d = 0, r = 12): void {
  ball(g, x, y, r, { d, fill: k ? 'hell' : 'leer', w: 1.8, t: 0 })
}

/** Roulette-Rad */
function wheel(g: Element, cx: number, cy: number, r: number, d = 0): void {
  ink(g, E(cx, cy, r), { w: 3.2, d, t: 900 })
  ink(g, E(cx, cy, r * 0.72), { w: 2, d: d + 300, t: 700 })
  for (let k = 0; k < 18; k++) {
    const a0 = rad(k * 20)
    const a1 = rad(k * 20 + 20)
    if (k % 2) hatch(g, [[cx + Math.cos(a0) * r * 0.72, cy + Math.sin(a0) * r * 0.72], [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r], [cx + Math.cos(a1) * r * 0.72, cy + Math.sin(a1) * r * 0.72]], d + 600, true)
    ink(g, L([cx + Math.cos(a0) * r * 0.72, cy + Math.sin(a0) * r * 0.72], [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r]), { w: 1.2, d: d + 500, t: 100 })
  }
  ball(g, cx, cy, r * 0.18, { d: d + 700, fill: 'dicht', t: 200 })
}

/** Gitter aus Punkten (Häufigkeitsbild), markiert: Indizes → dicht */
function dotgrid(g: Element, x0: number, y0: number, cols: number, rows: number, gap: number, r: number, d = 0): SVGCircleElement[] {
  const out: SVGCircleElement[] = []
  for (let i = 0; i < cols * rows; i++) {
    const c = mk('circle', { cx: x0 + (i % cols) * gap, cy: y0 + Math.floor(i / cols) * gap, r, class: 'k fade', style: `--d:${d + Math.floor(i / cols) * 40}ms` }, g)
    c.style.opacity = '0.35'
    out.push(c)
  }
  return out
}

export const AHA_DENKEN: Bite[] = [
  {
    id: 'geburtstag',
    area: 'DENK',
    day: 25,
    hook: 'Wie viele Leute braucht es, damit zwei am selben Tag Geburtstag haben?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [img('geburtstagstorte')],
    draw: {
      party(g) {
        crowd(g, 40, 400, 9, 35, 1.6, 0, 100)
        ink(g, RR(130, 230, 100, 50, 8), { w: 2.8, d: 900, t: 500 })
        ink(g, RR(144, 200, 72, 30, 6), { w: 2.6, d: 1100, t: 400 })
        for (const x of [160, 180, 200]) ink(g, L([x, 196], [x, 176]), { w: 2, d: 1300, t: 150 })
      },
      kalender(g) {
        for (let i = 0; i < 35; i++) ink(g, RR(40 + (i % 7) * 42, 340 + Math.floor(i / 7) * 42, 34, 34, 4), { w: 1.6, d: i * 25, t: 150 })
        question(g, 180, 600, 1, 1000)
      },
      kurve(g) {
        axes(g, 40, 600, 330, 320, { yl: 'Chance' })
        const f = (n: number) => {
          let p = 1
          for (let i = 0; i < n; i++) p *= (365 - i) / 365
          return 1 - p
        }
        plot(g, 46, 596, 270, 250, (t) => f(Math.round(t * 80)), { d: 400 })
        const x23 = 46 + (23 / 80) * 270
        dashes(g, L([x23, 596], [x23, 596 - 0.507 * 250]), { w: 1.4, d: 1500 })
        text(g, x23, 626, '23', { anchor: 'middle', cls: 's', d: 1600 })
        text(g, x23 - 6, 580, '50 %', { anchor: 'end', cls: 's', d: 1700 })
        const x70 = 46 + (70 / 80) * 270
        text(g, x70, 626, '70', { anchor: 'middle', cls: 's', d: 1800 })
        text(g, x70, 330, '99,9 %', { anchor: 'middle', cls: 's', d: 1900 })
      },
      du(g) {
        fig(g, 70, 600, 2.4)
        text(g, 70, 630, 'du', { anchor: 'middle', cls: 's', d: 300 })
        crowd(g, 150, 600, 6, 30, 1.6, 400, 80)
        text(g, 225, 400, 'irgendein Paar zählt', { anchor: 'middle', d: 1100 })
      },
      paare(g) {
        for (let r = 1; r < 23; r++) for (let c = 0; c < r; c++) {
          const x = 40 + c * 12.5
          const y = 330 + r * 12.5
          mk('rect', { x, y, width: 10, height: 10, class: 'k fade', style: `--d:${r * 50}ms` }, g).style.opacity = '0.75'
        }
        text(g, 260, 380, '253', { anchor: 'middle', size: 40, d: 1300 })
        text(g, 260, 410, 'Paare', { anchor: 'middle', d: 1400 })
      },
      zahl253(g) {
        fig(g, 60, 560, 2.4)
        text(g, 220, 470, '253 Leute', { anchor: 'middle', size: 34, d: 400 })
        text(g, 220, 510, 'für jemanden mit deinem Tag', { anchor: 'middle', cls: 's', d: 800 })
      },
      feld(g) {
        ink(g, RR(30, 340, 300, 300, 10), { w: 3, t: 800 })
        ink(g, L([30, 490], [330, 490]), { w: 2, d: 300, t: 500 })
        ink(g, E(180, 490, 40), { w: 2, d: 400, t: 500 })
        const pts: P[] = [[70, 380], [120, 400], [70, 450], [130, 450], [90, 520], [140, 540], [70, 600], [180, 400], [180, 590], [230, 380], [290, 400], [230, 450], [290, 450], [270, 520], [220, 540], [290, 600], [110, 610], [250, 610], [150, 370], [210, 620], [60, 560], [300, 560], [180, 450]]
        pts.forEach(([x, y], i) => dot(g, x, y, i === 3 || i === 13 ? 7 : 4.5, 800 + i * 50))
        text(g, 180, 666, '22 Spieler + Schiedsrichter', { anchor: 'middle', cls: 's', d: 2000 })
      },
      wm(g) {
        for (let i = 0; i < 32; i++) {
          const x = 46 + (i % 8) * 38
          const y = 360 + Math.floor(i / 8) * 50
          ball(g, x, y, 13, { d: i * 40, fill: i % 2 ? 'leer' : 'dicht', w: 1.8, t: 0 })
        }
        text(g, 180, 600, 'WM 2014: 16 von 32 Teams', { anchor: 'middle', d: 1500 })
      },
      wachstum(g) {
        vbars(g, [
          { label: '10 Leute', v: 45, fmt: (v) => `${Math.round(v)}` },
          { label: '23 Leute', v: 253, fmt: (v) => `${Math.round(v)}` },
          { label: '50 Leute', v: 1225, fmt: (v) => `${Math.round(v).toLocaleString('de-DE')}`, dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'Zahl der Paare', { anchor: 'middle', cls: 's', d: 1300 })
      },
      pruefsumme(g) {
        box(g, 40, 360, 120, 60, 'Datei A', { size: 16 })
        box(g, 200, 360, 120, 60, 'Datei B', { size: 16, d: 300 })
        arrow(g, L([100, 424], [160, 494]), { w: 2.2, d: 700, t: 300, head: 8 })
        arrow(g, L([260, 424], [200, 494]), { w: 2.2, d: 800, t: 300, head: 8 })
        box(g, 80, 500, 200, 60, 'gleiche Prüfsumme', { size: 15, fill: true, d: 1100 })
      },
      sicher(g) {
        text(g, 180, 470, '367', { anchor: 'middle', size: 80, d: 200 })
        text(g, 180, 520, 'Personen: garantiert ein Paar', { anchor: 'middle', d: 700 })
      },
      ende(g) {
        crowd(g, 60, 560, 7, 40, 2, 0, 100)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Schätz mal: Wie viele Menschen müssen in einem Raum sein, damit es **wahrscheinlich** ist, dass zwei am selben Tag Geburtstag haben?', 64), gfx: { kalender: {} } },
      { t: T('Viele tippen auf 180 – die Hälfte von 365. Die richtige Antwort ist erstaunlich klein: **23**.', 64), gfx: { z1: { draw: 'zahl', args: ['23', 'Menschen reichen für über 50 %', 430] } } },
      { t: T('Bei 23 Leuten liegt die Chance schon bei gut **50 Prozent**. Bei 70 Leuten sind es 99,9 Prozent.', 64), gfx: { kurve: {} } },
      { t: T('Warum so wenige? Weil es nicht um **deinen** Geburtstag geht, sondern um irgendein beliebiges Paar im Raum.', 64), gfx: { du: {} } },
      { t: T('Bei 23 Leuten gibt es nämlich **253 Paare** – und jedes Paar ist eine eigene Chance auf einen Treffer.', 64), gfx: { f1: { draw: 'formel', args: [['23 × 22', '÷', '2', '=', '253 Paare'], 360] } } },
      { t: T('Jedes Kästchen hier steht für ein Paar. Das sind **viel mehr** Gelegenheiten, als das Bauchgefühl erwartet.', 64), gfx: { paare: {} } },
      { t: T('Am leichtesten rechnet man **rückwärts**: Wie wahrscheinlich ist es, dass alle verschiedene Geburtstage haben?', 64), gfx: { kalender: {} } },
      { t: T('Die zweite Person braucht einen anderen Tag als die erste: 364 von 365. Die dritte: **363 von 365**. Und so weiter.', 64), gfx: { f2: { draw: 'formel', args: [['364/365', '×', '363/365', '×', '362/365', '× …'], 360] } } },
      { t: T('Multipliziert für 23 Personen ergibt das knapp **49 Prozent**. Zu 51 Prozent teilen also mindestens zwei einen Tag.', 64), gfx: { f3: { draw: 'formel', args: [['100 %', '−', '49 %', '≈', '51 %'], 380] } } },
      { t: T('Willst du dagegen jemanden mit **deinem** Geburtstag treffen, brauchst du für 50 Prozent rund 253 Leute.', 64), gfx: { zahl253: {} } },
      { t: T('Im Fußball stehen genau 23 Menschen auf dem Platz: 22 Spieler plus Schiedsrichter. In etwa **jedem zweiten** Spiel teilen zwei einen Geburtstag.', 64), gfx: { feld: {} } },
      { t: T('Bei der WM 2014 hatte jedes Team 23 Spieler. Tatsächlich gab es in **16 von 32** Mannschaften ein Geburtstagspaar.', 64), gfx: { wm: {} } },
      { t: T('Die Zahl der Paare wächst ungefähr mit dem **Quadrat** der Personen. Genau das unterschätzt unser Gefühl.', 64), gfx: { wachstum: {} } },
      { t: T('Auch in der Computersicherheit zählt das: Kurze Prüfsummen liefern viel früher **Doppelte** als gedacht – man spricht vom Geburtstagsangriff.', 64), gfx: { pruefsumme: {} } },
      { t: T('Darum wirken auch Alltagszufälle so unglaublich: Es gibt **unzählige Gelegenheiten** für irgendeinen Zufall.', 64), gfx: { du: {} } },
      { t: T('Und ab 367 Personen ist es **sicher**: Es gibt nur 366 mögliche Geburtstage – einer muss doppelt sein.', 64), gfx: { sicher: {} } },
      { t: T('23 Leute reichen – weil **jeder mit jedem** zählt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Schon bei 23 Personen haben mit über 50 % zwei denselben Geburtstag.', 'Grund: 23 Personen bilden 253 Paare – jedes ist eine Chance.', 'Für jemanden mit deinem Geburtstag bräuchte es dagegen rund 253 Leute.'],
    sources: ['Feller 1968: An Introduction to Probability Theory, Bd. 1', 'BBC News 2014: World Cup birthday paradox', 'Mises 1939: Über Aufteilungs- und Besetzungswahrscheinlichkeiten'],
  },
  {
    id: 'test-positiv',
    area: 'DENK',
    day: 54,
    hook: 'Ein Test ist zu 99 Prozent genau – und du bist trotzdem wahrscheinlich gesund?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [img('teststreifen')],
    draw: {
      test(g) {
        ink(g, RR(90, 200, 180, 70, 16), { w: 3, t: 700 })
        ink(g, RR(150, 216, 70, 38, 6), { w: 2.2, d: 300, t: 400 })
        for (const x of [172, 196]) ink(g, L([x, 222], [x, 248]), { w: 3, d: 800, t: 200 })
        ink(g, E(120, 235, 10), { w: 2, d: 500, t: 200 })
      },
      menge(g) {
        dotgrid(g, 30, 340, 40, 25, 7.7, 2.2)
        text(g, 180, 560, '1.000 Menschen', { anchor: 'middle', d: 1300 })
        const sick = st(g, 'x1', '--o: 180px 420px')
        ball(sick, 184, 425, 6, { fill: 'dicht', t: 0, w: 1.6 })
        text(sick, 180, 600, '1 krank', { anchor: 'middle', fade: false })
        const fa = st(g, 'x2', '--o: 180px 420px')
        ;[[61, 371], [130, 348], [253, 394], [299, 456], [92, 463], [200, 494], [315, 348], [146, 509], [38, 417], [269, 517]].forEach(([x, y]) => ink(fa, E(x, y, 6), { w: 1.8, t: 0 }))
        text(fa, 180, 630, 'rund 10 Fehlalarme', { anchor: 'middle', fade: false })
      },
      genau(g) {
        box(g, 30, 360, 140, 90, ['erkennt Kranke', '99 %'], { size: 16 })
        box(g, 190, 360, 140, 90, ['Fehlalarm', 'bei 1 %'], { size: 16, d: 400 })
      },
      gefuehl(g) {
        text(g, 180, 470, '99 %?', { anchor: 'middle', size: 70, d: 200 })
        question(g, 300, 400, 0.7, 700)
      },
      ergebnis(g) {
        vbars(g, [
          { label: 'echt krank', v: 1, fmt: () => '1' },
          { label: 'Fehlalarm', v: 10, fmt: () => '≈ 10', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'positiv getestet: ≈ 11', { anchor: 'middle', d: 1300 })
      },
      haeufiger(g) {
        vbars(g, [
          { label: 'echt krank', v: 100, fmt: () => '100' },
          { label: 'Fehlalarm', v: 9, fmt: () => '≈ 9', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'Krankheit bei 1 von 10', { anchor: 'middle', d: 1300 })
      },
      bayes(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: '1763', sub: 'Thomas Bayes', up: true },
          { at: 0.85, label: 'heute', sub: 'Medizin, KI, Spamfilter', up: true },
        ])
      },
      aerzte(g) {
        crowd(g, 40, 560, 8, 40, 2.2, 0, 100)
        for (let i = 0; i < 8; i++) {
          if (i < 2) check(g, 40 + i * 40, 600, 0.6, 1000 + i * 80)
          else cross(g, 40 + i * 40, 600, 0.6, 1000 + i * 80)
        }
        text(g, 180, 400, 'mit Prozenten: viele falsch', { anchor: 'middle', cls: 's', d: 900 })
      },
      haeufig(g) {
        crowd(g, 40, 560, 8, 40, 2.2, 0, 100)
        for (let i = 0; i < 8; i++) {
          if (i < 6) check(g, 40 + i * 40, 600, 0.6, 1000 + i * 80)
          else cross(g, 40 + i * 40, 600, 0.6, 1000 + i * 80)
        }
        text(g, 180, 400, 'mit Häufigkeiten: meist richtig', { anchor: 'middle', cls: 's', d: 900 })
      },
      zweiter(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: 'vorher', sub: '0,1 %', up: true },
          { at: 0.45, label: '1. Test +', sub: '≈ 9 %', up: true },
          { at: 0.9, label: '2. Test +', sub: '≈ 90 %', up: true, big: true },
        ])
      },
      selten(g) {
        for (const [x, n, d] of [[70, 'Screening', 0], [180, 'Gesichter', 300], [290, 'Spam', 600]] as const) {
          ball(g, x, 470, 40, { d, w: 2.6 })
          text(g, x, 540, n, { anchor: 'middle', cls: 's', d: d + 200 })
        }
        text(g, 180, 610, 'seltenes Ereignis → viele Fehlalarme', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        ink(g, RR(110, 440, 140, 60, 14), { w: 3, t: 700 })
        for (const x of [170, 190]) ink(g, L([x, 456], [x, 484]), { w: 3, d: 600, t: 200 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Stell dir eine seltene Krankheit vor: Nur **eine von 1.000** Personen hat sie.', 64), gfx: { menge: {} } },
      { t: T('Ein Test erkennt sie in 99 Prozent der Fälle – und schlägt bei Gesunden nur in **1 Prozent** der Fälle falsch Alarm.', 64), gfx: { genau: {} } },
      { t: T('Dein Test ist positiv. Wie wahrscheinlich bist du krank? Die meisten sagen: **99 Prozent**.', 64), gfx: { gefuehl: {} } },
      { t: T('Rechnen wir mit 1.000 Menschen. Einer ist krank – und der Test findet ihn **fast sicher**.', 64), gfx: { menge: { cls: 'a1' } } },
      { t: T('Von den 999 Gesunden schlägt der Test bei 1 Prozent falsch an. Das sind rund **10 Menschen**.', 64), gfx: { menge: { cls: 'a1 a2' } } },
      { t: T('Positiv getestet sind also etwa **11 Menschen** – aber nur einer davon ist wirklich krank.', 64), gfx: { ergebnis: {} } },
      { t: T('Deine Chance, krank zu sein, liegt damit bei rund **1 zu 11** – etwa 9 Prozent.', 64), gfx: { f1: { draw: 'formel', args: [['1 Kranker', '÷', '11 Positive', '≈', '9 %'], 360] } } },
      { t: T('Der Grund: Die Krankheit ist so selten, dass die Fehlalarme die echten Fälle **zahlenmäßig erdrücken**.', 64), gfx: { ergebnis: {} } },
      { t: T('Das nennt man die **Basisrate**: Wie häufig etwas überhaupt ist, bestimmt mit, was ein Testergebnis bedeutet.', 64), gfx: { menge: { cls: 'a1 a2' } } },
      { t: T('Umgekehrt gilt: Bei einer **häufigen** Krankheit – sagen wir jede zehnte Person – ist ein positiver Test sehr verlässlich.', 64), gfx: { haeufiger: {} } },
      { t: T('Die Rechnung geht auf den Pfarrer Thomas Bayes zurück und heißt heute **Satz von Bayes**.', 64), gfx: { bayes: {} } },
      { t: T('Sogar Ärztinnen und Ärzte verschätzen sich hier oft. In Studien lagen viele **weit daneben**, wenn man ihnen Prozentwerte gab.', 64), gfx: { aerzte: {} } },
      { t: T('Mit **natürlichen Häufigkeiten** – „1 von 1.000“, „10 von 999“ – fanden die meisten die richtige Antwort.', 64), gfx: { haeufig: {} } },
      { t: T('Darum testet man nach einem positiven Ergebnis **ein zweites Mal**. Die neue Ausgangslage sind jetzt 9 Prozent, nicht 0,1.', 64), gfx: { zweiter: {} } },
      { t: T('Ist auch der zweite, unabhängige Test positiv, steigt die Wahrscheinlichkeit auf rund **90 Prozent**.', 64), gfx: { zweiter: {} } },
      { t: T('Dasselbe gilt für Gesichtserkennung oder Spamfilter: Bei **seltenen** Ereignissen sind viele Alarme falsch.', 64), gfx: { selten: {} } },
      { t: T('Drei Fragen helfen bei jedem Test: Wie **häufig** ist es? Wie oft schlägt er falsch an? Wie viele Positive sind echt?', 64), gfx: { p1: { draw: 'punkte', args: [['Wie häufig ist es?', 'Wie oft Fehlalarm?', 'Wie viele Positive sind echt?'], 330] } } },
      { t: T('Ein Test ist nur so gut wie die **Basisrate**, auf die er trifft.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei einer Krankheit 1 : 1.000 und 1 % Fehlalarmen sind ~10 von 11 Positiven gesund.', 'Die Basisrate entscheidet, was ein Testergebnis bedeutet (Satz von Bayes).', 'Natürliche Häufigkeiten statt Prozente machen die Rechnung leicht.'],
    sources: ['Gigerenzer & Hoffrage 1995, Psychological Review 102', 'Gigerenzer 2002: Das Einmaleins der Skepsis', 'Bayes 1763, Philosophical Transactions 53'],
  },
  {
    id: 'ueberlebende',
    area: 'DENK',
    day: 54,
    hook: 'Wo panzert man ein Flugzeug: dort, wo die Einschusslöcher sind?',
    mood: 'dunkel',
    ambience: 'wind',
    images: [img('b24')],
    draw: {
      flieger(g) {
        bomber(g, 180, 230, 1)
        for (const [x, y] of [[-110, 6], [-70, 2], [90, 4], [130, 8], [0, 40], [-4, 90], [6, -60], [30, 120]] as const) dot(g, 180 + x, 230 + y, 3.5, 1000 + x * 2)
      },
      loecher(g) {
        bomber(g, 180, 470, 1)
        for (const [x, y] of [[-130, 6], [-110, 8], [-80, 2], [-30, -6], [40, -4], [80, 6], [120, 4], [140, 8], [0, 60], [-4, 100], [6, 80], [2, 30], [-30, 124], [30, 126]] as const) dot(g, 180 + x, 470 + y, 3.5, 900 + (x + 150) * 4)
        const arm = st(g, 'f1')
        hatch(arm, [[30, 470], [166, 446], [166, 480], [30, 486]], 0, true)
        hatch(arm, [[330, 470], [194, 446], [194, 480], [330, 486]], 0, true)
        const real = st(g, 'f2')
        for (const x of [-100, -55, 55, 100]) hatch(real, RR(180 + x - 8, 436, 16, 30, 6), 0, true)
        hatch(real, RR(166, 360, 28, 50, 12), 0, true)
      },
      wald(g) {
        text(g, 180, 430, 'Abraham Wald', { anchor: 'middle', size: 30, d: 200 })
        text(g, 180, 470, 'Statistiker, New York, 1943', { anchor: 'middle', cls: 's', d: 600 })
        question(g, 180, 560, 0.8, 1000)
      },
      fehlt(g) {
        bomber(g, 180, 430, 0.8)
        for (const x of [-80, 80]) ball(g, 180 + x, 404, 8, { d: 1000, fill: 'dicht', t: 0 })
        arrow(g, B([180, 560], [200, 590], [230, 610], [280, 640]), { w: 2.4, d: 1300, t: 500, head: 9 })
        text(g, 100, 610, 'kam nie zurück', { anchor: 'middle', d: 1500 })
      },
      filter(g) {
        ink(g, [[60, 360], [300, 360], [200, 480], [200, 560], [160, 560], [160, 480], [60, 360]], { w: 3, t: 900 })
        for (let i = 0; i < 9; i++) dot(g, 80 + i * 25, 330, 5, 300 + i * 50)
        dot(g, 180, 600, 5, 1200)
        dot(g, 180, 630, 5, 1350)
        text(g, 290, 600, 'nur sie siehst du', { anchor: 'middle', cls: 's', d: 1500 })
      },
      haeuser(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        house(g, 40, 598, 70, 200)
        house(g, 240, 598, 70, 400)
        for (const x of [130, 175]) dashes(g, [[x, 598], [x, 550], [x + 30, 530], [x + 60, 550], [x + 60, 598]], { w: 1.4, d: 800 })
        text(g, 180, 650, 'die schlechten sind abgerissen', { anchor: 'middle', cls: 's', d: 1300 })
      },
      erfolg(g) {
        fig(g, 70, 600, 4)
        ink(g, RR(40, 420, 60, 20, 4), { w: 2.4, d: 400, t: 300 })
        for (let i = 0; i < 18; i++) {
          const f = st(g, '', `opacity: 0.35`)
          fig(f, 150 + (i % 6) * 32, 520 + Math.floor(i / 6) * 50, 1.2, { d: 700 + i * 40 })
        }
        text(g, 230, 400, 'die vielen anderen', { anchor: 'middle', cls: 's', d: 1400 })
      },
      fonds(g) {
        vbars(g, [
          { label: 'noch da', v: 5, fmt: () => 'gut' },
          { label: 'geschlossen', v: 1.5, fmt: () => 'unsichtbar', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
      },
      katze(g) {
        ink(g, RR(230, 300, 90, 330, 4), { w: 2.6, t: 700 })
        for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) ink(g, RR(244 + c * 36, 318 + r * 50, 24, 30, 3), { w: 1.6, d: 300 + (r * 2 + c) * 40, t: 150 })
        const c = E(100, 460, 34, 22)
        hatch(g, c, 900)
        ink(g, c, { w: 2.6, d: 600, t: 400 })
        ink(g, E(130, 440, 14), { w: 2.4, d: 800, t: 300 })
        text(g, 110, 560, 'Tierklinik sieht', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 110, 580, 'nur die Überlebenden', { anchor: 'middle', cls: 's', d: 1200 })
      },
      musik(g) {
        for (const [x, y, d] of [[60, 420, 0], [130, 400, 200]] as const) {
          ink(g, E(x, y + 40, 12, 9), { w: 2.6, d, t: 300 })
          hatch(g, E(x, y + 40, 12, 9), d + 200, true)
          ink(g, L([x + 11, y + 38], [x + 11, y - 20]), { w: 2.4, d: d + 200, t: 200 })
        }
        for (let i = 0; i < 6; i++) {
          const f = st(g, '', 'opacity: 0.3')
          ink(f, E(200 + (i % 3) * 40, 470 + Math.floor(i / 3) * 60, 10, 7), { w: 2, d: 600 + i * 80, t: 200 })
        }
        text(g, 180, 620, 'die vergessenen Lieder', { anchor: 'middle', cls: 's', d: 1300 })
      },
      studien(g) {
        for (let i = 0; i < 10; i++) {
          const x = 40 + (i % 5) * 60
          const y = 360 + Math.floor(i / 5) * 90
          const pub = i % 4 === 0
          ink(g, RR(x, y, 44, 60, 4), { w: pub ? 2.6 : 1.4, d: i * 60, t: 200 })
          if (pub) hatch(g, RR(x + 4, y + 4, 36, 52, 2), 600 + i * 60, true)
        }
        text(g, 180, 600, 'spektakulär → veröffentlicht', { anchor: 'middle', cls: 's', d: 1200 })
      },
      startups(g) {
        for (let i = 0; i < 10; i++) {
          const f = st(g, '', i === 0 ? '' : 'opacity: 0.3')
          fig(f, 40 + i * 31, 600, 1.8, { d: i * 60 })
        }
        text(g, 40, 520, 'in den Nachrichten', { cls: 's', d: 800 })
        text(g, 220, 520, 'die anderen neun', { anchor: 'middle', cls: 's', d: 1000 })
      },
      frage(g) {
        question(g, 180, 470, 2)
        text(g, 180, 600, 'Was sehe ich nicht?', { anchor: 'middle', size: 22, d: 900 })
      },
      ende(g) {
        bomber(g, 180, 500, 0.8)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Im Zweiten Weltkrieg untersuchten US-Fachleute Bomber, die von Einsätzen **zurückkamen**. Viele waren von Kugeln durchlöchert.', 64), gfx: { loecher: {} } },
      { t: T('Die Löcher häuften sich an **Flügeln und Rumpf**. Wenige Treffer gab es an den Motoren und am Cockpit.', 64), gfx: { loecher: {} } },
      { t: T('Die naheliegende Idee: Dort, wo die meisten Löcher sind, braucht es **mehr Panzerung**.', 64), gfx: { loecher: { cls: 'a1' } } },
      { t: T('Der Statistiker **Abraham Wald** widersprach. Er schaute auf das, was in den Daten fehlte.', 64), gfx: { wald: {} } },
      { t: T('Bomber, die an den Motoren getroffen wurden, **kamen gar nicht zurück**. Man bekam sie nie zu sehen.', 64), gfx: { fehlt: {} } },
      { t: T('Die Löcher zeigen also, wo ein Flugzeug Treffer **aushält**. Panzern muss man die Stellen ohne Löcher.', 64), gfx: { loecher: { cls: 'a2' } } },
      { t: T('Das heißt **Überlebensbias**: Wir sehen nur, was einen Filter überstanden hat – und ziehen daraus falsche Schlüsse.', 64), gfx: { filter: {} } },
      { t: T('Wald brauchte dafür keine neuen Daten – nur einen **anderen Blick** auf dieselben Löcher.', 64), gfx: { loecher: { cls: 'a2' } } },
      { t: T('„Früher wurde **solider gebaut**.“ Wir sehen nur die alten Häuser, die noch stehen. Die schlechten wurden längst abgerissen.', 64), gfx: { haeuser: {} } },
      { t: T('„Früher war die **Musik besser**.“ Wir erinnern uns an die Hits – die vielen vergessenen Lieder hört heute niemand mehr.', 64), gfx: { musik: {} } },
      { t: T('„Er hat das Studium abgebrochen und wurde **Milliardär**.“ Die vielen Abbrecher ohne Erfolg schreiben keine Bücher.', 64), gfx: { erfolg: {} } },
      { t: T('Ratgeber befragen Erfolgreiche nach ihren Gewohnheiten – aber nicht die Gescheiterten mit **denselben** Gewohnheiten.', 64), gfx: { erfolg: {} } },
      { t: T('Bei Geldanlagen zeigen Statistiken oft nur Fonds, die es **noch gibt**. Die schlechten wurden still geschlossen.', 64), gfx: { fonds: {} } },
      { t: T('Auch Forschung hat diesen Filter: Studien mit **spektakulären** Ergebnissen werden eher veröffentlicht als solche ohne Effekt.', 64), gfx: { studien: {} } },
      { t: T('Erfolgreiche Start-ups kommen in die Nachrichten. Die vielen **gescheiterten** daneben sieht kaum jemand.', 64), gfx: { startups: {} } },
      { t: T('Katzen überleben Stürze aus großer Höhe erstaunlich oft, hieß es nach einer Studie. Doch tote Katzen kommen seltener **in die Tierklinik**.', 64), gfx: { katze: {} } },
      { t: T('Die Frage, die hilft: **Was sehe ich nicht?** Wer ist unterwegs aus den Daten herausgefallen?', 64), gfx: { frage: {} } },
      { t: T('Achte auf die Flugzeuge, die **nicht zurückkamen**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Zurückgekehrte Bomber zeigten, wo Treffer verkraftbar sind – nicht, wo man panzern muss.', 'Überlebensbias: Wir sehen nur, was einen Filter überstanden hat.', 'Hilfreiche Frage: Was fehlt in den Daten?'],
    sources: ['Wald 1943: A Method of Estimating Plane Vulnerability (SRG, Columbia)', 'Mangel & Samaniego 1984, Journal of the American Statistical Association 79', 'Whitney & Mehlhaff 1987, JAVMA 191 (Sturz-Katzen)'],
  },
  {
    id: 'mittelwert',
    area: 'DENK',
    day: 54,
    hook: 'Warum wird es nach einem Rekord meistens wieder schlechter?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [img('hochsprung'), img('galton')],
    draw: {
      spitze(g) {
        axes(g, 30, 420, 330, 100)
        const pts: P[] = [[40, 330], [80, 300], [120, 320], [160, 290], [200, 150], [240, 300], [280, 320], [320, 310]]
        ink(g, pts, { w: 3, d: 500, t: 1200 })
        dot(g, 200, 150, 6, 1300)
        dashes(g, L([40, 310], [320, 310]), { w: 1.2, d: 1500 })
      },
      lob(g) {
        fig(g, 90, 600, 3)
        bubble(g, 30, 360, 130, 60, 'l', 400)
        text(g, 95, 398, 'Super!', { anchor: 'middle', d: 600 })
        arrow(g, L([200, 420], [290, 520]), { w: 3, d: 900, t: 400, head: 10 })
        text(g, 270, 420, 'danach schlechter', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tadel(g) {
        fig(g, 90, 600, 3)
        bubble(g, 30, 360, 130, 60, 'l', 400)
        text(g, 95, 398, 'Mies!', { anchor: 'middle', d: 600 })
        arrow(g, L([200, 520], [290, 420]), { w: 3, d: 900, t: 400, head: 10 })
        text(g, 270, 560, 'danach besser', { anchor: 'middle', cls: 's', d: 1100 })
      },
      streuung(g) {
        axes(g, 30, 620, 330, 320, { xl: 'Versuche', yl: 'Leistung' })
        dashes(g, L([40, 470], [320, 470]), { w: 1.4, d: 400 })
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        const ys: number[] = []
        for (let i = 0; i < 18; i++) ys.push(470 + (rnd() - 0.5) * 120)
        ys[6] = 350
        ys[12] = 590
        ys.forEach((y, i) => dot(g, 50 + i * 15.5, y, i === 6 || i === 12 ? 6 : 3.5, 600 + i * 60))
        text(g, 133, 340, 'Glück', { anchor: 'middle', cls: 's', d: 1700 })
        text(g, 236, 612, 'Pech', { anchor: 'middle', cls: 's', d: 1800 })
      },
      cover(g) {
        ink(g, RR(110, 330, 140, 190, 6), { w: 3, t: 700 })
        fig(g, 180, 500, 3.6, { d: 400, arms: 'up' })
        text(g, 180, 356, 'TITEL', { anchor: 'middle', d: 800 })
        arrow(g, L([260, 540], [310, 610]), { w: 2.6, d: 1100, t: 400, head: 9 })
        text(g, 180, 640, 'nächste Saison schwächer', { anchor: 'middle', cls: 's', d: 1300 })
      },
      arzt(g) {
        axes(g, 30, 600, 330, 320, { xl: 'Zeit', yl: 'Beschwerden' })
        plot(g, 36, 596, 280, 240, (t) => 0.4 + 0.5 * Math.exp(-Math.pow((t - 0.3) / 0.12, 2)), { d: 400 })
        dot(g, 36 + 0.3 * 280, 596 - 0.9 * 240, 6, 1300)
        text(g, 36 + 0.3 * 280 + 12, 596 - 0.9 * 240 - 8, 'Arztbesuch', { cls: 's', d: 1400 })
      },
      kontrolle(g) {
        vbars(g, [
          { label: 'Mittel', v: 6, fmt: () => 'besser' },
          { label: 'Kontrolle', v: 4.5, fmt: () => 'auch besser', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'nur der Unterschied zählt', { anchor: 'middle', cls: 's', d: 1300 })
      },
      trainer(g) {
        axes(g, 30, 600, 330, 330, { xl: 'Spiele', yl: 'Punkte' })
        const pts: P[] = [[40, 450], [80, 500], [120, 540], [160, 560], [200, 480], [240, 460], [280, 470], [320, 455]]
        ink(g, pts, { w: 2.8, d: 400, t: 1200 })
        dashes(g, L([180, 590], [180, 360]), { w: 1.4, d: 1400 })
        text(g, 186, 372, 'neuer Trainer', { cls: 's', d: 1500 })
      },
      galton(g) {
        fig(g, 70, 600, 5)
        fig(g, 140, 600, 4.6, { d: 200 })
        arrow(g, L([170, 540], [220, 540]), { w: 2.4, d: 600, t: 300, head: 9 })
        fig(g, 270, 600, 4, { d: 800 })
        text(g, 180, 650, 'sehr große Eltern → etwas kleinere Kinder', { anchor: 'middle', cls: 's', d: 1100 })
      },
      noten(g) {
        for (const [x, n, d] of [[60, '1', 0], [160, '3', 400], [260, '2', 800]] as const) {
          ink(g, RR(x - 30, 400, 60, 80, 6), { w: 2.6, d, t: 400 })
          text(g, x, 452, n, { anchor: 'middle', size: 32, d: d + 200 })
        }
        text(g, 180, 560, 'Ausreißer, dann Mitte', { anchor: 'middle', cls: 's', d: 1300 })
      },
      blitzer(g) {
        ink(g, RR(150, 380, 60, 90, 10), { w: 3, t: 600 })
        ink(g, E(180, 410, 16), { w: 2.4, d: 300, t: 300 })
        ink(g, L([180, 470], [180, 600]), { w: 3, d: 400, t: 300 })
        text(g, 180, 640, 'aufgestellt nach einem Unfall-Hoch', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        dashes(g, L([40, 500], [320, 500]), { w: 1.6 })
        arrow(g, L([100, 380], [100, 490]), { w: 2.6, d: 500, t: 400, head: 9 })
        arrow(g, L([260, 620], [260, 510]), { w: 2.6, d: 700, t: 400, head: 9 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein Fluglehrer erzählte: Wer nach einer **tollen Landung** gelobt wird, landet danach meist schlechter.', 64), gfx: { lob: {} } },
      { t: T('Und wer nach einer **miesen Landung** angeschrien wird, landet danach meist besser. Schimpfen wirkt also, Lob schadet?', 64), gfx: { tadel: {} } },
      { t: T('Der Psychologe Daniel Kahneman erkannte: weder noch. Das ist die **Regression zur Mitte**.', 480), gfx: { spitze: {} } },
      { t: T('Jede Leistung besteht aus Können **plus Zufall** – an manchen Tagen läuft es, an anderen nicht.', 64), gfx: { f1: { draw: 'formel', args: [['Ergebnis', '=', 'Können', '+', 'Zufall'], 360] } } },
      { t: T('Eine herausragende Landung hatte meist besonders viel **Glück**. Beim nächsten Mal ist das Glück durchschnittlich – das Ergebnis fällt zurück.', 64), gfx: { streuung: {} } },
      { t: T('Bei einer miserablen Landung war meist **Pech** dabei. Danach geht es fast von allein wieder nach oben.', 64), gfx: { streuung: {} } },
      { t: T('Lob und Tadel haben damit **wenig zu tun**. Die Ergebnisse wandern einfach zurück Richtung Durchschnitt.', 64), gfx: { ende: {} } },
      { t: T('Im Sport heißt das „Titelseiten-Fluch“: Wer aufs Cover kommt, hatte meist eine Rekordsaison – und spielt danach **schwächer**.', 64), gfx: { cover: {} } },
      { t: T('Auch Schulnoten: Wer in einer Arbeit überraschend gut war, schreibt die nächste oft schlechter – **ohne nachzulassen**.', 64), gfx: { noten: {} } },
      { t: T('In der Medizin: Man geht zum Arzt, wenn es **am schlimmsten** ist. Danach wird es oft von selbst besser – egal, was man nimmt.', 64), gfx: { arzt: {} } },
      { t: T('Beim Arzt: Ein zufällig **hoher Blutdruck** ist beim zweiten Messen oft niedriger. Darum misst man mehrmals.', 64), gfx: { streuung: {} } },
      { t: T('Darum braucht jede Studie eine **Kontrollgruppe**: Auch ihr geht es oft besser – nur der Unterschied zeigt die Wirkung.', 64), gfx: { kontrolle: {} } },
      { t: T('Blitzer werden oft dort aufgestellt, wo es gerade besonders viele Unfälle gab. Danach sinken die Zahlen – zum Teil **von allein**.', 64), gfx: { blitzer: {} } },
      { t: T('Ein Trainerwechsel nach einer Pechsträhne wirkt oft – auch, weil es danach **ohnehin** besser geworden wäre.', 64), gfx: { trainer: {} } },
      { t: T('Entdeckt hat das Francis Galton um 1886: Sehr große Eltern haben im Schnitt **etwas kleinere** Kinder, sehr kleine Eltern etwas größere.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.2], cap: 'Francis Galton' } } },
      { t: T('Alle werden trotzdem nicht gleich: Neue Ausreißer entstehen ständig – nur sind es **andere** Menschen.', 64), gfx: { streuung: {} } },
      { t: T('Merkregel: Nach einem extremen Ergebnis ist das nächste wahrscheinlich **weniger extrem**.', 64), gfx: { ende: {} } },
      { t: T('Extreme kehren zur Mitte zurück – **ganz ohne Grund**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Jedes Ergebnis ist Können plus Zufall; Extreme hatten meist besonders viel Glück oder Pech.', 'Darum folgt auf Extremes meist etwas Normaleres – Regression zur Mitte.', 'Ohne Kontrollgruppe hält man das leicht für die Wirkung von Lob, Tadel oder Medizin.'],
    sources: ['Kahneman 2011: Schnelles Denken, langsames Denken, Kap. 17', 'Galton 1886, Journal of the Anthropological Institute 15', 'Barnett, van der Pols & Dobson 2005, International Journal of Epidemiology 34'],
  },
  {
    id: 'schachbrett',
    area: 'DENK',
    day: 78,
    hook: 'Wie viel Reis liegt auf dem letzten Feld eines Schachbretts?',
    mood: 'episch',
    ambience: 'uhr',
    images: [],
    draw: {
      brett(g) {
        ink(g, RR(60, 120, 240, 240, 4), { w: 3, t: 800 })
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) hatch(g, RR(60 + c * 30, 120 + r * 30, 30, 30, 0), 300 + (r * 8 + c) * 10, true)
      },
      koenig(g) {
        fig(g, 110, 600, 5)
        ink(g, [[86, 430], [92, 410], [102, 424], [110, 404], [118, 424], [128, 410], [134, 430]], { w: 2.6, d: 600, t: 300 })
        fig(g, 260, 600, 3.6, { d: 300 })
        bubble(g, 200, 380, 130, 50, 'r', 900)
        text(g, 265, 412, 'nur etwas Reis', { anchor: 'middle', cls: 's', d: 1100 })
      },
      reihe(g) {
        for (let k = 0; k < 4; k++) {
          const x = 30 + k * 78
          ink(g, RR(x, 420, 70, 70, 4), { w: 2.6, d: k * 300, t: 400 })
          const n = Math.pow(2, k)
          for (let i = 0; i < n; i++) dot(g, x + 14 + (i % 4) * 14, 440 + Math.floor(i / 4) * 16, 4, k * 300 + 300 + i * 50)
          text(g, x + 35, 520, String(n), { anchor: 'middle', d: k * 300 + 200 })
        }
        text(g, 180, 580, 'jedes Feld doppelt so viel', { anchor: 'middle', cls: 's', d: 1500 })
      },
      verlauf(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: 'Feld 8', sub: '128 Körner', up: true },
          { at: 0.35, label: 'Feld 16', sub: '≈ 1 kg' },
          { at: 0.6, label: 'Feld 32', sub: '≈ 50 t', up: true },
          { at: 0.9, label: 'Feld 64', sub: '9 Trillionen', big: true },
        ], 0, 600)
      },
      chips(g) {
        for (let k = 0; k < 5; k++) {
          const s = 24 * Math.pow(1.4, k)
          ink(g, RR(40 + k * 62, 560 - s, s * 0.8, s, 4), { w: 2.2, d: k * 250, t: 300 })
        }
        text(g, 180, 620, 'Transistoren: Verdopplung alle ≈ 2 Jahre', { anchor: 'middle', cls: 's', d: 1400 })
      },
      linear(g) {
        for (const [x0, n, f, d] of [[30, 'linear', (t: number) => t, 0], [195, 'exponentiell', (t: number) => (Math.pow(2, t * 8) - 1) / 255, 700]] as const) {
          axes(g, x0, 600, x0 + 140, 360, { d })
          plot(g, x0 + 4, 596, 126, 220, f, { d: d + 300 })
          text(g, x0 + 70, 630, n, { anchor: 'middle', cls: 's', d: d + 400 })
        }
      },
      seerose(g) {
        ink(g, E(180, 470, 140, 80), { w: 3, t: 800 })
        hatch(g, [...E(180, 470, 136, 76, 90, 270), [180, 394]], 700)
        ink(g, L([180, 392], [180, 548]), { w: 1.6, d: 700, t: 300 })
        text(g, 110, 600, 'Tag 29: halb', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 260, 600, 'Tag 30: voll', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        ink(g, RR(110, 400, 140, 140, 4), { w: 3, t: 700 })
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2) hatch(g, RR(110 + c * 35, 400 + r * 35, 35, 35, 0), 300, true)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { brett: {} } },
      { t: T('Eine alte Legende aus Indien: Der Erfinder des Schachspiels darf sich vom König eine **Belohnung** wünschen.', 64), gfx: { koenig: {} } },
      { t: T('Er bittet um Reis: ein Korn auf das erste Feld, zwei auf das zweite, vier auf das dritte – **immer doppelt** so viel wie davor.', 64), gfx: { reihe: {} } },
      { t: T('Der König wundert sich über die **bescheidene** Bitte. Ein paar Säcke Reis, mehr nicht.', 64), gfx: { koenig: {} } },
      { t: T('Nach der ersten Reihe liegen auf Feld 8 gerade **128 Körner**. Kaum eine Handvoll.', 64), gfx: { verlauf: {} } },
      { t: T('Auf Feld 16 sind es 32.768 Körner – knapp **ein Kilo** Reis.', 64), gfx: { z1: { draw: 'zahl', args: ['32.768', 'Körner auf Feld 16', 420] } } },
      { t: T('Auf Feld 32, in der Mitte des Bretts: über **zwei Milliarden** Körner – rund 50 Tonnen.', 64), gfx: { z2: { draw: 'zahl', args: ['50 t', 'auf Feld 32', 430] } } },
      { t: T('Auf Feld 64 schließlich: über **neun Trillionen** Körner – eine Zahl mit 19 Stellen.', 64), gfx: { z3: { draw: 'zahl', args: ['9 · 10¹⁸', 'Körner auf dem letzten Feld', 430] } } },
      { t: T('Auf Feld n liegen 2 hoch n minus eins Körner. Alle Felder zusammen: **2 hoch 64**, minus eins.', 64), gfx: { f9: { draw: 'formel', args: [['Feld n', '→', '2 hoch (n − 1)', 'Körner'], 360] } } },
      { t: T('Zusammen wäre das fast **tausendmal** so viel Reis, wie die ganze Welt heute in einem Jahr erntet.', 64), gfx: { verlauf: {} } },
      { t: T('Das ist **exponentielles Wachstum**: Es kommt nicht jedes Mal gleich viel dazu, sondern alles wird vervielfacht.', 64), gfx: { linear: {} } },
      { t: T('Unser Gefühl denkt **linear**: Es schätzt, als käme immer ungefähr gleich viel hinzu.', 64), gfx: { linear: {} } },
      { t: T('Darum unterschätzen wir Zinseszins, Epidemien oder Computerleistung: Alles verdoppelt sich in **festen Abständen**.', 64), gfx: { p1: { draw: 'punkte', args: [['Zinseszins', 'Epidemien', 'Rechenleistung', 'Bakterien'], 330] } } },
      { t: T('Ein reales Beispiel: Die Zahl der Transistoren auf Computerchips hat sich jahrzehntelang etwa **alle zwei Jahre** verdoppelt.', 64), gfx: { chips: {} } },
      { t: T('Faustregel: Wächst etwas um **7 Prozent** pro Jahr, verdoppelt es sich in etwa zehn Jahren.', 64), gfx: { f1: { draw: 'formel', args: [['70', '÷', 'Wachstum in %', '≈', 'Jahre bis zur Verdopplung'], 340] } } },
      { t: T('Ein Rätsel: Seerosen verdoppeln sich jeden Tag. Nach 30 Tagen ist der Teich voll. Wann war er **halb voll**? Am Tag 29.', 64), gfx: { seerose: {} } },
      { t: T('Das Tückische: Lange sieht man fast nichts – und dann geht alles **sehr schnell**.', 64), gfx: { linear: {} } },
      { t: T('In der Natur endet solches Wachstum immer: Nahrung, Platz oder Rohstoffe **gehen aus**.', 64), gfx: { seerose: {} } },
      { t: T('Verdoppeln wirkt harmlos – bis zum **letzten Feld**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein Korn, das sich 63-mal verdoppelt, wird zu über 9 Trillionen Körnern.', 'Exponentielles Wachstum vervielfacht in festen Abständen – unser Gefühl rechnet linear.', 'Faustregel: 70 ÷ Wachstumsrate in % ≈ Jahre bis zur Verdopplung.'],
    sources: ['Ibn Khallikan, 13. Jh. (Weizenkorn-Legende)', 'Bartlett 1978, The Physics Teacher (Exponential Growth)', 'FAO: Weltreisproduktion'],
  },
  {
    id: 'papier-falten',
    area: 'DENK',
    day: 78,
    hook: 'Wie oft müsstest du ein Blatt Papier falten, um bis zum Mond zu kommen?',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [],
    draw: {
      blatt(g) {
        ink(g, [[60, 300], [240, 260], [300, 340], [120, 380], [60, 300]], { w: 3, t: 800 })
        ink(g, L([150, 280], [210, 360]), { w: 1.6, d: 600, t: 300 })
        ball(g, 290, 120, 30, { d: 900, fill: 'hell', w: 2.6 })
      },
      dicke(g) {
        ink(g, L([40, 470], [320, 470]), { w: 1.4, t: 600 })
        text(g, 180, 450, '0,1 mm', { anchor: 'middle', size: 22, d: 500 })
      },
      stapel(g) {
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 400 })
        for (let k = 0; k < 5; k++) {
          const x = 30 + k * 66
          const h = 4 * Math.pow(2, k)
          ink(g, RR(x, 616 - h, 50, h, 2), { w: 2.2, d: k * 300, t: 300 })
          text(g, x + 25, 600 - h, `×${Math.pow(2, k)}`, { anchor: 'middle', cls: 's', d: k * 300 + 200 })
        }
      },
      leiter(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.05, label: '10×', sub: 'Buch', up: true },
          { at: 0.3, label: '20×', sub: 'Kirchturm' },
          { at: 0.55, label: '30×', sub: 'Weltraum', up: true },
          { at: 0.8, label: '42×', sub: 'Mond', big: true },
        ], 0, 500)
      },
      mond(g) {
        earth(g, 60, 480, 30)
        ball(g, 310, 480, 12, { d: 300, fill: 'hell', w: 2 })
        ink(g, L([92, 480], [296, 480]), { w: 3, d: 600, t: 900 })
        text(g, 190, 460, '384.000 km', { anchor: 'middle', d: 1200 })
        text(g, 190, 540, '42 Faltungen', { anchor: 'middle', size: 24, d: 1500 })
      },
      sonne(g) {
        sun(g, 280, 470, 40)
        earth(g, 60, 470, 20, 200)
        dashes(g, L([86, 470], [226, 470]), { w: 1.6, d: 600 })
        text(g, 150, 540, '51 Faltungen: bis zur Sonne', { anchor: 'middle', cls: 's', d: 1000 })
      },
      universum(g) {
        ink(g, E(180, 470, 150), { w: 3, t: 900 })
        dot(g, 180, 470, 4, 600)
        text(g, 180, 650, '103 Faltungen', { anchor: 'middle', size: 22, d: 1100 })
      },
      sieben(g) {
        for (let k = 0; k < 7; k++) {
          const w = 260 / Math.pow(1.45, k)
          const h = 6 * Math.pow(1.5, k)
          ink(g, RR(180 - w / 2, 600 - k * 30 - h, w, h, 3), { w: 2, d: k * 200, t: 300 })
        }
        text(g, 180, 640, 'nach 7 Faltungen: so dick wie breit', { anchor: 'middle', cls: 's', d: 1600 })
      },
      gallivan(g) {
        fig(g, 60, 600, 3)
        ink(g, L([90, 560], [330, 560]), { w: 2, d: 400, t: 900 })
        ink(g, L([90, 570], [330, 570]), { w: 2, d: 500, t: 900 })
        text(g, 210, 540, '1,2 km Papier', { anchor: 'middle', d: 1100 })
        text(g, 180, 400, 'Britney Gallivan, 2002', { anchor: 'middle', size: 20, d: 1300 })
        text(g, 180, 430, '12 Faltungen', { anchor: 'middle', d: 1500 })
      },
      ende(g) {
        ball(g, 180, 480, 40, { fill: 'hell', w: 3 })
        ink(g, [[110, 600], [250, 590], [270, 620], [130, 630], [110, 600]], { w: 2.6, d: 500, t: 600 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { blatt: {} } },
      { t: T('Ein normales Blatt Papier ist etwa **0,1 Millimeter** dick.', 64), gfx: { dicke: {} } },
      { t: T('Einmal falten: doppelt so dick. Zweimal: vierfach. Jede Faltung **verdoppelt** die Dicke.', 64), gfx: { stapel: {} } },
      { t: T('Nach 10 Faltungen: gut 10 Zentimeter – so dick wie ein **dickes Buch**.', 64), gfx: { leiter: {} } },
      { t: T('Nach 20 Faltungen: über **100 Meter** – höher als die meisten Kirchtürme.', 64), gfx: { leiter: {} } },
      { t: T('Nach 30 Faltungen: über 100 Kilometer. Der Stapel ragt **bis ins All**.', 64), gfx: { leiter: {} } },
      { t: T('Nach 27 Faltungen: über 13 Kilometer – höher als der **Mount Everest**.', 64), gfx: { leiter: {} } },
      { t: T('Der Mond ist rund 384.000 Kilometer entfernt. Wie viele Faltungen brauchst du? Nur **42**.', 64), gfx: { mond: {} } },
      { t: T('Mit 51 Faltungen reichte der Stapel **bis zur Sonne** – 150 Millionen Kilometer.', 64), gfx: { sonne: {} } },
      { t: T('Und nach 103 Faltungen wäre er dicker als das ganze **beobachtbare Universum**.', 64), gfx: { universum: {} } },
      { t: T('Schon zehn Faltungen ergeben **1.024 Lagen** Papier übereinander.', 64), gfx: { z9: { draw: 'zahl', args: ['1.024', 'Lagen nach zehn Faltungen', 430] } } },
      { t: T('Das liegt an der Verdopplung: Jede einzelne Faltung legt **so viel drauf**, wie schon da ist.', 64), gfx: { f1: { draw: 'formel', args: [['0,1 mm', '×', '2 hoch 42', '≈', '440.000 km'], 360] } } },
      { t: T('In Wirklichkeit schafft das niemand: Schon nach etwa **sieben** Faltungen ist ein normales Blatt so dick wie breit.', 64), gfx: { sieben: {} } },
      { t: T('Jede Faltung halbiert außerdem die **Länge**. Das Blatt wird immer kürzer und dicker – bis es sich nicht mehr biegen lässt.', 64), gfx: { sieben: {} } },
      { t: T('Die Schülerin Britney Gallivan schaffte 2002 **zwölf** Faltungen – mit einem über einen Kilometer langen Papierstreifen.', 64), gfx: { gallivan: {} } },
      { t: T('Sie berechnete dazu eine Formel: Die nötige Papierlänge **explodiert** mit jeder weiteren Faltung.', 64), gfx: { gallivan: {} } },
      { t: T('Und jeder Knick schluckt Papier: Die äußeren Lagen müssen um die inneren herum – darum braucht man einen **riesig langen** Streifen.', 64), gfx: { gallivan: {} } },
      { t: T('Das Gedankenexperiment zeigt, warum **Verdopplungen** unsere Vorstellung sprengen.', 64), gfx: { stapel: {} } },
      { t: T('Dasselbe Muster steckt in Kettenbriefen, Schneeballsystemen und Virusausbrüchen: Der Anfang wirkt **harmlos**.', 64), gfx: { p1: { draw: 'punkte', args: [['Kettenbriefe', 'Schneeballsysteme', 'Virusausbrüche'], 340] } } },
      { t: T('Ein Kettenbrief an jeweils zehn Leute erreicht nach zehn Runden **zehn Milliarden** – mehr Menschen, als es gibt.', 64), gfx: { z1: { draw: 'zahl', args: ['10¹⁰', 'Menschen nach zehn Runden', 430] } } },
      { t: T('Mit **42** Faltungen bis zum Mond – auf dem Papier.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Jede Faltung verdoppelt die Dicke: 0,1 mm × 2⁴² ≈ 440.000 km – weiter als bis zum Mond.', 'Praktisch scheitert man nach etwa 7 Faltungen; der Rekord mit sehr langem Papier liegt bei 12–13.', 'Verdopplungen sprengen unser Vorstellungsvermögen.'],
    sources: ['Gallivan 2002: How to Fold Paper in Half Twelve Times', 'NASA: Moon Fact Sheet (Entfernung 384.400 km)', 'Bartlett 1978, The Physics Teacher (Exponential Growth)'],
  },
  {
    id: 'gefangenendilemma',
    area: 'DENK',
    day: 78,
    hook: 'Warum handeln zwei vernünftige Menschen zusammen unvernünftig?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [img('gefaengnis'), img('vampirfledermaus')],
    draw: {
      zellen(g) {
        for (const x of [40, 200]) {
          ink(g, RR(x, 140, 120, 200, 6), { w: 3, t: 700 })
          for (let k = 1; k < 4; k++) ink(g, L([x + k * 30, 142], [x + k * 30, 338]), { w: 2, d: 400 + k * 80, t: 300 })
        }
        fig(g, 70, 320, 2.4, { d: 900 })
        fig(g, 290, 320, 2.4, { d: 1000 })
      },
      matrix(g) {
        const cell = (x: number, y: number, a: string, b: string, cls: string, d: number) => {
          const gr = st(g, cls)
          ink(gr, RR(x, y, 120, 100, 10), { w: 2.6, d, t: 400 })
          text(gr, x + 60, y + 42, a, { anchor: 'middle', d: d + 200 })
          text(gr, x + 60, y + 70, b, { anchor: 'middle', cls: 's', d: d + 300 })
        }
        text(g, 150, 330, 'B schweigt', { anchor: 'middle', cls: 's', d: 200 })
        text(g, 280, 330, 'B gesteht', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 44, 400, 'A schweigt', { anchor: 'middle', cls: 's', d: 400 })
        text(g, 44, 510, 'A gesteht', { anchor: 'middle', cls: 's', d: 500 })
        cell(90, 345, 'je 1 Jahr', '', '', 600)
        cell(222, 345, 'A: 10 J.', 'B: frei', 'x2', 0)
        cell(90, 455, 'A: frei', 'B: 10 J.', 'x2', 0)
        cell(222, 455, 'je 5 Jahre', '', 'x1', 0)
      },
      beide(g) {
        fig(g, 110, 600, 3.4)
        fig(g, 250, 600, 3.4, { d: 200 })
        text(g, 180, 400, '5 + 5 statt 1 + 1', { anchor: 'middle', size: 24, d: 700 })
      },
      axelrod(g) {
        for (let i = 0; i < 6; i++) {
          const x = 50 + (i % 3) * 110
          const y = 380 + Math.floor(i / 3) * 110
          ink(g, RR(x, y, 70, 60, 8), { w: 2.4, d: i * 150, t: 300 })
          ink(g, RR(x + 10, y + 10, 50, 30, 4), { w: 1.6, d: i * 150 + 200, t: 200 })
        }
        text(g, 180, 620, 'Turnier der Programme, 1980', { anchor: 'middle', cls: 's', d: 1200 })
      },
      titfortat(g) {
        const seqA = ['K', 'K', 'V', 'K', 'K']
        const seqB = ['K', 'K', 'K', 'V', 'K']
        text(g, 30, 420, 'Gegner', { cls: 's', d: 100 })
        text(g, 30, 520, 'Wie du mir', { cls: 's', d: 200 })
        seqA.forEach((m, i) => {
          ball(g, 130 + i * 44, 416, 16, { d: 300 + i * 200, fill: m === 'V' ? 'dicht' : 'leer', t: 200 })
        })
        seqB.forEach((m, i) => {
          ball(g, 130 + i * 44, 516, 16, { d: 400 + i * 200, fill: m === 'V' ? 'dicht' : 'leer', t: 200 })
        })
        text(g, 180, 600, 'leer = kooperieren, voll = verraten', { anchor: 'middle', cls: 's', d: 1500 })
      },
      fledermaus(g) {
        const bat = (cx: number, d: number) => {
          const w: P[] = [[cx, 470], [cx - 50, 440], [cx - 70, 470], [cx - 50, 466], [cx - 36, 480], [cx - 20, 470], [cx, 490], [cx + 20, 470], [cx + 36, 480], [cx + 50, 466], [cx + 70, 470], [cx + 50, 440], [cx, 470]]
          hatch(g, w, d + 500, true)
          ink(g, w, { w: 2.4, d, t: 600 })
        }
        bat(90, 0)
        bat(270, 300)
        carrow(g, [130, 520], [230, 520], -30, { d: 900 })
        carrow(g, [230, 420], [130, 420], -30, { d: 1300 })
        text(g, 180, 600, 'teilen mit denen, die geteilt haben', { anchor: 'middle', cls: 's', d: 1500 })
      },
      ende(g) {
        fig(g, 130, 600, 3.4, { arms: 'push' })
        fig(g, 230, 600, 3.4, { d: 200 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Zwei Komplizen werden verhaftet und **getrennt** verhört. Jeder kann schweigen oder gestehen – ohne zu wissen, was der andere tut.', 64), gfx: { matrix: {} } },
      { t: T('Schweigen beide, gibt es für jeden nur **ein Jahr**: Die Beweise reichen nicht für mehr.', 64), gfx: { matrix: {} } },
      { t: T('Gesteht nur einer, kommt er als Kronzeuge **frei** – und der andere bekommt zehn Jahre.', 64), gfx: { matrix: { cls: 'a2' } } },
      { t: T('Gestehen beide, bekommen beide **fünf Jahre**.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Was soll A tun? Schweigt B, ist Gestehen besser: frei statt ein Jahr. Gesteht B, auch: fünf statt **zehn Jahre**.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Egal, was B tut – für A **lohnt sich Gestehen**. B denkt genauso.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Also gestehen beide und sitzen fünf Jahre. Hätten sie geschwiegen, wären es **nur eins** gewesen.', 64), gfx: { beide: {} } },
      { t: T('Das ist das **Gefangenendilemma**: Was für jeden Einzelnen klug ist, ist für beide zusammen schlecht.', 64), gfx: { beide: {} } },
      { t: T('Es steckt überall, wo Misstrauen teuer ist: im Wettrüsten, in Preiskämpfen, beim **Klimaschutz**, beim Doping.', 64), gfx: { p1: { draw: 'punkte', args: [['Wettrüsten', 'Preiskampf', 'Klimaschutz', 'Doping'], 330] } } },
      { t: T('Was hilft? **Wiederholung**. Wer sich öfter begegnet, kann Vertrauen aufbauen – und Verrat beim nächsten Mal bestrafen.', 64), gfx: { titfortat: {} } },
      { t: T('Im Kalten Krieg dachten Strategen genau so: Abrüsten wäre für beide gut – aber wer **zuerst** abrüstet, riskiert alles.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Der Politologe Robert Axelrod ließ 1980 Computerprogramme gegeneinander antreten – Runde um Runde **Gefangenendilemma**.', 64), gfx: { axelrod: {} } },
      { t: T('Es gewann die einfachste Strategie: **Wie du mir, so ich dir**.', 64), gfx: { titfortat: {} } },
      { t: T('Sie beginnt freundlich, macht dann einfach den letzten Zug des Gegners nach – und **verzeiht** sofort, wenn er wieder kooperiert.', 64), gfx: { titfortat: {} } },
      { t: T('Die Natur kennt das auch: Vampirfledermäuse teilen Blut bevorzugt mit Artgenossen, die **ihnen früher** geholfen haben.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Und im Kleinen: Bei Gruppenarbeiten lohnt sich Faulenzen für jeden Einzelnen – bis **alle** faulenzen.', 64), gfx: { beide: {} } },
      { t: T('Auch Verträge, Kontrollen und ein guter Ruf lösen das Dilemma: Sie ändern, **was sich lohnt**.', 64), gfx: { matrix: { cls: 'a1 a2' } } },
      { t: T('Erdacht haben das Spiel Merrill Flood und Melvin Dresher 1950. Albert Tucker erfand die **Geschichte** mit den Gefangenen dazu.', 480), gfx: { zellen: {} } },
      { t: T('Kooperation braucht **Vertrauen** – und ein Wiedersehen.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Für jeden Einzelnen lohnt sich Gestehen – zusammen stehen beide schlechter da.', 'Bei wiederholten Begegnungen gewinnt Kooperation: „Wie du mir, so ich dir“.', 'Verträge, Kontrollen und Ruf ändern, was sich lohnt.'],
    sources: ['Axelrod 1984: The Evolution of Cooperation', 'Poundstone 1992: Prisoner’s Dilemma', 'Flood 1952: Some Experimental Games (RAND)'],
  },
  {
    id: 'benford',
    area: 'DENK',
    day: 25,
    hook: 'Warum beginnen so viele Zahlen mit einer 1?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [],
    draw: {
      einsen(g) {
        let seed = 4
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 16; i++) text(g, 40 + (i % 4) * 80 + rnd() * 20, 120 + Math.floor(i / 4) * 80 + rnd() * 16, i % 3 ? '1' : String(2 + Math.floor(rnd() * 8)), { size: 22 + rnd() * 20, d: i * 80 })
      },
      listen(g) {
        bullets(g, 50, 380, ['Einwohnerzahlen', 'Flusslängen', 'Rechnungsbeträge', 'Börsenkurse'], { gap: 54, size: 19 })
      },
      gleich(g) {
        vbars(g, Array.from({ length: 9 }, (_, i) => ({ label: String(i + 1), v: 11.1, fmt: () => '' })), { x: 30, base: 600, w: 26, gap: 35, h: 230, max: 32 })
        text(g, 180, 330, 'erwartet: je ≈ 11 %', { anchor: 'middle', cls: 's', d: 1500 })
      },
      echt(g) {
        const v = [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6]
        vbars(g, v.map((x, i) => ({ label: String(i + 1), v: x, fmt: (y: number) => (i === 0 || i === 8 ? `${Math.round(y)} %` : ''), dense: i === 0 })), { x: 30, base: 600, w: 26, gap: 35, h: 230, max: 32 })
      },
      tafeln(g) {
        for (let k = 0; k < 4; k++) {
          const x = 60 + k * 64
          ink(g, RR(x, 380, 54, 180, 4), { w: 2.4, d: k * 150, t: 400 })
          if (k === 0) hatch(g, RR(x + 4, 384, 46, 172, 2), 700, true)
          if (k === 1) hatch(g, RR(x + 4, 384, 46, 172, 2), 800)
        }
        text(g, 180, 610, 'vorne abgegriffen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      stadt(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Zeit', yl: 'Einwohner' })
        plot(g, 46, 596, 270, 240, (t) => (Math.pow(10, t) - 1) / 9, { d: 400 })
        const y2 = 596 - ((2 - 1) / 9) * 240
        dashes(g, L([46, y2], [316, y2]), { w: 1.2, d: 1200 })
        text(g, 320, y2 - 6, '200.000', { anchor: 'end', cls: 's', d: 1300 })
        text(g, 46, 622, '100.000', { cls: 's', d: 1300 })
        text(g, 140, 470, 'lange eine 1 vorne', { anchor: 'middle', cls: 's', d: 1500 })
      },
      log(g) {
        ink(g, L([30, 470], [330, 470]), { w: 2.6, t: 600 })
        for (let k = 1; k <= 10; k++) {
          const x = 30 + Math.log10(k) * 300
          ink(g, L([x, 456], [x, 484]), { w: 2, d: 200 + k * 60, t: 100 })
          if (k < 10) text(g, x + (30 + Math.log10(k + 1) * 300 - x) / 2, 450, String(k), { anchor: 'middle', d: 400 + k * 60 })
        }
        hatch(g, RR(30, 486, 90.3, 20, 2), 1100, true)
        text(g, 75, 530, '30 %', { anchor: 'middle', d: 1200 })
      },
      strasse(g) {
        for (let i = 0; i < 19; i++) {
          const x = 30 + (i % 10) * 32
          const y = 400 + Math.floor(i / 10) * 70
          const one = String(i + 1).startsWith('1')
          ink(g, RR(x, y, 26, 40, 3), { w: 1.8, d: i * 50, t: 150 })
          text(g, x + 13, y + 26, String(i + 1), { anchor: 'middle', cls: one ? '' : 's', d: i * 50 + 100 })
        }
        text(g, 180, 600, '11 von 19 beginnen mit 1', { anchor: 'middle', d: 1300 })
      },
      steuer(g) {
        for (let i = 0; i < 6; i++) ink(g, L([60, 360 + i * 30], [300, 360 + i * 30]), { w: 1.4, d: i * 80, t: 300 })
        lens(g, 210, 450, 50, 700)
        text(g, 180, 600, 'erfundene Zahlen: zu gleichmäßig', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        text(g, 180, 520, '1', { anchor: 'middle', size: 140, d: 200 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { einsen: {} } },
      { t: T('Nimm irgendeine Liste echter Zahlen: Einwohner von Städten, Längen von Flüssen, Rechnungsbeträge, Börsenkurse.', 64), gfx: { listen: {} } },
      { t: T('Wie oft beginnen sie mit 1, 2, 3 … bis 9? Man würde denken: jede Ziffer **gleich oft** – also je rund 11 Prozent.', 64), gfx: { gleich: {} } },
      { t: T('Tatsächlich beginnen rund **30 Prozent** mit einer 1 – und nur knapp 5 Prozent mit einer 9.', 64), gfx: { echt: {} } },
      { t: T('Das ist das **Benfordsche Gesetz**. Zuerst bemerkt hat es der Astronom Simon Newcomb 1881 – an Büchern voller Logarithmentafeln.', 64), gfx: { tafeln: {} } },
      { t: T('Die vorderen Seiten, für Zahlen mit 1 am Anfang, waren **viel abgegriffener** als die hinteren.', 64), gfx: { tafeln: {} } },
      { t: T('Warum? Denk an etwas, das **wächst** – etwa eine Stadt mit 100.000 Einwohnern.', 64), gfx: { stadt: {} } },
      { t: T('Um auf 200.000 zu kommen, muss sie sich **verdoppeln**. So lange steht vorne eine 1.', 64), gfx: { stadt: {} } },
      { t: T('Von 800.000 auf 900.000 braucht es dagegen nur gut **12 Prozent** Wachstum. Die 8 vorne hält nur kurz.', 64), gfx: { f1: { draw: 'formel', args: [['100.000 → 200.000', '=', '+ 100 %'], 330] } } },
      { t: T('Auf einer **logarithmischen** Skala, die Verdopplungen gleich lang zeigt, nimmt die 1 den größten Abschnitt ein.', 64), gfx: { log: {} } },
      { t: T('Genauer: Der Anteil der Ziffer d ist der Logarithmus von **1 plus 1 durch d**. Für die 1 ergibt das rund 30 Prozent.', 64), gfx: { f2: { draw: 'formel', args: [['Anteil der 1', '=', 'log₁₀(2)', '≈', '30 %'], 360] } } },
      { t: T('Ein Alltagsbeispiel: In einer Straße mit 19 Häusern beginnen die Nummern 1 und 10 bis 19 mit einer 1 – **elf von neunzehn**.', 64), gfx: { strasse: {} } },
      { t: T('Es klappt nur bei Zahlen, die über **viele Größenordnungen** streuen – nicht bei Körpergrößen oder Schulnoten.', 64), gfx: { echt: {} } },
      { t: T('Und es gilt in jeder Einheit: Ob Euro oder Dollar, Meter oder Fuß – die Verteilung **bleibt gleich**.', 64), gfx: { echt: {} } },
      { t: T('Der Physiker Frank Benford prüfte 1938 über **20.000 Zahlen** aus 20 Quellen – von Flusslängen bis zu Baseball-Statistiken.', 64), gfx: { echt: {} } },
      { t: T('Auch für die zweite Ziffer gibt es eine Regel – sie ist aber **viel schwächer**: Die 0 kommt dort nur etwas häufiger vor.', 64), gfx: { gleich: {} } },
      { t: T('Steuerfahnder nutzen das: Wer Zahlen **erfindet**, verteilt die Anfangsziffern meist viel zu gleichmäßig.', 64), gfx: { steuer: {} } },
      { t: T('Eine auffällige Abweichung ist ein **Hinweis** – kein Beweis – auf geschönte Bilanzen oder gefälschte Daten.', 64), gfx: { steuer: {} } },
      { t: T('Die 1 gewinnt, weil Wachstum **bei ihr** am längsten verweilt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['In vielen echten Datensätzen beginnen ~30 % der Zahlen mit 1, nur ~5 % mit 9 (Benford).', 'Grund: Wachstum braucht von 1 zu 2 eine Verdopplung, von 8 zu 9 nur 12 %.', 'Steuerfahnder nutzen Abweichungen als Hinweis auf erfundene Zahlen.'],
    sources: ['Newcomb 1881, American Journal of Mathematics 4', 'Benford 1938, Proceedings of the American Philosophical Society 78', 'Nigrini 2012: Benford’s Law (Forensic Accounting)'],
  },
  {
    id: 'spielerfehlschluss',
    area: 'DENK',
    day: 25,
    hook: 'Im Casino kam 26-mal hintereinander Schwarz. Was kommt jetzt?',
    mood: 'dunkel',
    ambience: 'uhr',
    images: [img('roulette'), img('monte-carlo')],
    draw: {
      rad(g) {
        wheel(g, 180, 260, 130)
      },
      serie(g) {
        for (let i = 0; i < 26; i++) ball(g, 36 + (i % 9) * 36, 380 + Math.floor(i / 9) * 50, 13, { d: i * 80, fill: 'dicht', t: 0, w: 1.6 })
        text(g, 180, 560, '26-mal Schwarz', { anchor: 'middle', size: 24, d: 2200 })
      },
      gedaechtnis(g) {
        wheel(g, 180, 470, 100)
        text(g, 180, 620, 'Schwarz: 18 von 37 Feldern', { anchor: 'middle', cls: 's', d: 1000 })
      },
      folgen(g) {
        text(g, 30, 400, 'ausgedacht', { cls: 's' })
        'KZKZZKZKKZKZ'.split('').forEach((c, i) => coinKZ(g, 40 + i * 25, 430, c === 'K', 200 + i * 60, 10))
        text(g, 30, 520, 'echter Zufall', { cls: 's', d: 900 })
        'KKKKZZKZZZZZ'.split('').forEach((c, i) => coinKZ(g, 40 + i * 25, 550, c === 'K', 1100 + i * 60, 10))
      },
      lauf(g) {
        for (let i = 0; i < 40; i++) {
          const run = i >= 14 && i < 20
          coinKZ(g, 30 + (i % 10) * 33, 380 + Math.floor(i / 10) * 50, run || i % 3 === 0, i * 40, 11)
        }
        ink(g, RR(30 + 4 * 33 - 16, 430 - 16, 6 * 33, 32, 14), { w: 2, d: 1800, t: 400 })
        text(g, 180, 600, 'Serien gehören zum Zufall', { anchor: 'middle', cls: 's', d: 2000 })
      },
      korb(g) {
        ink(g, E(240, 380, 40, 10), { w: 2.6, t: 500 })
        ink(g, [[200, 380], [214, 440], [266, 440], [280, 380]], { w: 1.8, d: 300, t: 400 })
        fig(g, 90, 620, 4, { arms: 'up', d: 400 })
        ball(g, 170, 340, 14, { d: 800, t: 300 })
        text(g, 180, 660, '„heiße Hand“: kleiner echter Effekt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      null0(g) {
        wheel(g, 180, 460, 100)
        text(g, 180, 620, 'die grüne Null: 2,7 % Vorteil fürs Casino', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gross(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Würfe', yl: 'Anteil Kopf' })
        dashes(g, L([46, 460], [320, 460]), { w: 1.2, d: 300 })
        plot(g, 46, 600, 270, 280, (t) => 0.5 + 0.35 * Math.exp(-t * 6) * Math.cos(t * 30), { d: 600 })
        text(g, 320, 450, '50 %', { anchor: 'end', cls: 's', d: 1500 })
      },
      lotto(g) {
        for (let i = 0; i < 6; i++) {
          ball(g, 50 + i * 52, 470, 20, { d: i * 150, w: 2.4, t: 200 })
          text(g, 50 + i * 52, 477, String([3, 11, 17, 24, 38, 42][i]), { anchor: 'middle', cls: 's', d: i * 150 + 100 })
        }
        text(g, 180, 560, 'letzte Woche gezogen – gleiche Chance', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        wheel(g, 180, 490, 90)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Monte Carlo, 18. August 1913: Am Roulettetisch fällt die Kugel immer wieder auf **Schwarz**.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Casino von Monte Carlo' } } },
      { t: T('Nach 15-mal Schwarz setzen die Spieler immer mehr auf **Rot**. Jetzt muss es doch endlich kommen!', 64), gfx: { serie: {} } },
      { t: T('Es kam Schwarz. Wieder und wieder – insgesamt **26-mal** in Folge. Die Spieler verloren Millionen Francs.', 64), gfx: { serie: {} } },
      { t: T('Ihr Denkfehler heißt **Spielerfehlschluss**: der Glaube, Zufall gleiche sich auf kurze Sicht aus.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Die Kugel hat **kein Gedächtnis**. Jeder Wurf ist neu – die Chance auf Schwarz bleibt bei knapp 50 Prozent.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Eine Serie von 26 gleichen Farben ist extrem selten: etwa **1 zu 68 Millionen**. Der 27. Wurf ist trotzdem wieder fast fifty-fifty.', 64), gfx: { z1: { draw: 'zahl', args: ['1 : 68 Mio.', 'für 26-mal dieselbe Farbe', 430] } } },
      { t: T('Unser Gehirn erwartet, dass Zufall **abwechslungsreich** aussieht. Ausgedachte Folgen wechseln darum viel zu oft.', 64), gfx: { folgen: {} } },
      { t: T('Echte Zufallsfolgen haben lange Serien: Bei 100 Münzwürfen kommt fast immer eine Serie von **mindestens fünf** gleichen vor.', 64), gfx: { lauf: {} } },
      { t: T('Lehrer können so oft erkennen, ob Schüler ihre Münzwürfe **wirklich geworfen** oder erfunden haben.', 64), gfx: { folgen: {} } },
      { t: T('Lottospieler meiden oft Zahlen, die **letzte Woche** kamen. Dabei haben sie genau dieselbe Chance wie alle anderen.', 64), gfx: { lotto: {} } },
      { t: T('Kahneman und Tversky nannten das das „**Gesetz der kleinen Zahlen**“: Wir erwarten von wenigen Würfen, was erst viele leisten.', 64), gfx: { folgen: {} } },
      { t: T('Das Gegenstück ist die „**heiße Hand**“: Wer dreimal getroffen hat, trifft bestimmt wieder.', 64), gfx: { korb: {} } },
      { t: T('Lange galt sie als reine Illusion. Neuere Auswertungen finden im Basketball aber einen **kleinen echten** Effekt.', 64), gfx: { korb: {} } },
      { t: T('Der Unterschied: Ein Mensch kann **in Form** sein. Eine Roulettekugel nicht.', 64), gfx: { gedaechtnis: {} } },
      { t: T('Das Gesetz der großen Zahlen gilt nur **auf lange Sicht**: Über Tausende Würfe nähert sich der Anteil 50 Prozent – lange Serien bleiben trotzdem möglich.', 64), gfx: { gross: {} } },
      { t: T('Und das Casino gewinnt sowieso: Die grüne **Null** sichert ihm bei jedem einzelnen Spiel 2,7 Prozent Vorteil.', 64), gfx: { null0: {} } },
      { t: T('Zufall hat **kein Gedächtnis**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['1913 kam in Monte Carlo 26-mal Schwarz – die Spieler setzten Millionen auf Rot.', 'Jeder Wurf ist unabhängig; Zufall gleicht sich nicht kurzfristig aus.', 'Echte Zufallsfolgen haben längere Serien, als wir erwarten.'],
    sources: ['Huff 1959: How to Take a Chance (Monte Carlo 1913)', 'Tversky & Kahneman 1971, Psychological Bulletin 76', 'Miller & Sanjurjo 2018, Econometrica 86 (heiße Hand)'],
  },
]
