import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, brain, bubble, check, clock, cross, crowd, eye, fig, globe, hatch, ink, lie, question, st, text, timeline, vbars, type P } from './draw'
import { axes, ball, box, bullets, dot, heart, house, pie, plot, rad, sun, waveP } from './kit'

// Psychologie: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Gorilla von vorn, Füße auf y */
function gorilla(g: Element, x: number, y: number, s = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const body: P[] = [...B(P(-40, -20), P(-50, -90), P(-30, -120), P(0, -122)), ...B(P(0, -122), P(30, -120), P(50, -90), P(40, -20)).slice(1), ...B(P(40, -20), P(30, 0), P(-30, 0), P(-40, -20)).slice(1)]
  blank(g, body)
  hatch(g, body, d + 700, true)
  ink(g, body, { w: 3, d, t: 900 })
  const head = E(x, y - 140 * s, 24 * s, 22 * s)
  blank(g, head)
  hatch(g, head, d + 800, true)
  ink(g, head, { w: 2.8, d: d + 300, t: 500 })
  blank(g, E(x, y - 132 * s, 14 * s, 9 * s))
  ink(g, E(x, y - 132 * s, 14 * s, 9 * s), { w: 2, d: d + 600, t: 300 })
  for (const k of [-1, 1]) {
    ink(g, B(P(k * 44, -100), P(k * 70, -80), P(k * 74, -40), P(k * 66, -4)), { w: 3.4, d: d + 500, t: 400 })
    dot(g, x - 7 * s * k, y - 146 * s, 2.6 * s, d + 900)
  }
}

/** Linie mit Länge für den Asch-Versuch, senkrecht bei x, unten bei y */
function stroke(g: Element, x: number, y: number, h: number, label: string, d = 0): void {
  ink(g, L([x, y], [x, y - h]), { w: 4, d, t: 300 })
  text(g, x, y + 24, label, { anchor: 'middle', d: d + 200 })
}

export const AHA_PSYCHE: Bite[] = [
  {
    id: 'gorilla',
    area: 'PSY',
    day: 63,
    hook: 'Würdest du einen Gorilla übersehen, der direkt vor dir steht?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [img('gorilla')],
    draw: {
      bild(g) {
        crowd(g, 24, 380, 3, 32, 2.2, 0, 150)
        crowd(g, 272, 380, 3, 32, 2.2, 300, 150)
        gorilla(g, 180, 400, 1, 900)
      },
      spiel(g) {
        for (let i = 0; i < 6; i++) {
          const x = 50 + i * 52
          fig(g, x, 600, 2.4, { d: i * 120, arms: i % 2 ? 'up' : 'down' })
          if (i % 2) ink(g, RR(x - 10, 520, 20, 6, 3), { w: 1.6, d: i * 120 + 200, t: 100 })
        }
        ball(g, 130, 470, 12, { d: 900, t: 200 })
        ball(g, 250, 450, 12, { d: 1000, fill: 'dicht', t: 200 })
        text(g, 180, 640, 'Weiß und Schwarz passen sich Bälle zu', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zaehlen(g) {
        for (let i = 0; i < 6; i++) fig(g, 50 + i * 52, 600, 2.4, { d: i * 80 })
        text(g, 180, 430, 'Pässe von Weiß: 1, 2, 3 …', { anchor: 'middle', size: 20, d: 700 })
      },
      gorilla(g) {
        for (const x of [30, 70, 290, 330]) fig(g, x, 600, 2.4)
        gorilla(g, 180, 610, 1.15, 300)
      },
      haelfte(g) {
        pie(g, 180, 460, 110, 0.5)
        text(g, 180, 620, 'etwa die Hälfte sieht ihn nicht', { anchor: 'middle', cls: 's', d: 1100 })
      },
      scheinwerfer(g) {
        const cone: P[] = [[60, 330], [300, 520], [300, 640], [60, 360]]
        hatch(g, [[300, 520], [300, 640], [200, 560]], 600)
        ink(g, RR(30, 310, 50, 60, 10), { w: 2.8, t: 500 })
        ink(g, L([80, 340], [300, 520]), { w: 1.6, d: 300, t: 500 })
        ink(g, L([80, 350], [300, 640]), { w: 1.6, d: 300, t: 500 })
        void cone
        text(g, 180, 330, 'Aufmerksamkeit', { anchor: 'middle', cls: 's', d: 900 })
      },
      sicher(g) {
        fig(g, 110, 600, 4)
        bubble(g, 160, 380, 170, 60, 'l', 400)
        text(g, 245, 416, 'Da war kein Gorilla!', { anchor: 'middle', cls: 's', d: 700 })
      },
      lunge(g) {
        ink(g, RR(60, 320, 240, 280, 16), { w: 3, t: 700 })
        for (const k of [-1, 1]) {
          const lu: P[] = [...B([180 + k * 12, 360], [180 + k * 90, 350], [180 + k * 100, 500], [180 + k * 80, 560]), ...B([180 + k * 80, 560], [180 + k * 40, 570], [180 + k * 16, 560], [180 + k * 12, 360]).slice(1)]
          hatch(g, lu, 600)
          ink(g, lu, { w: 2.2, d: 300, t: 600 })
        }
        gorilla(g, 230, 470, 0.22, 1000)
        text(g, 180, 640, '83 % der Radiologen übersahen ihn', { anchor: 'middle', cls: 's', d: 1300 })
      },
      motorrad(g) {
        ink(g, RR(40, 420, 140, 70, 14), { w: 2.8, t: 600 })
        for (const x of [70, 150]) ball(g, x, 494, 16, { d: 300, t: 300 })
        ink(g, L([30, 520], [330, 520]), { w: 2.6, d: 200, t: 500 })
        ball(g, 250, 500, 12, { d: 600, t: 200 })
        ball(g, 310, 500, 12, { d: 600, t: 200 })
        ink(g, [[250, 500], [280, 470], [310, 500]], { w: 2.2, d: 800, t: 300 })
        text(g, 180, 600, '„Sorry, hab dich nicht gesehen.“', { anchor: 'middle', cls: 'it', d: 1100 })
      },
      tuer(g) {
        fig(g, 70, 600, 3.6)
        fig(g, 290, 600, 3.6, { d: 300 })
        const door = st(g, 'x1', '--o: 180px 500px')
        ink(door, RR(150, 380, 60, 220, 4), { w: 3, t: 0 })
        hatch(door, RR(150, 380, 60, 220, 4), 0)
        text(g, 180, 650, 'Gesprächspartner heimlich getauscht', { anchor: 'middle', cls: 's', d: 900 })
      },
      vorhang(g) {
        ink(g, RR(40, 360, 280, 200, 8), { w: 2.8, t: 600 })
        for (const x of [60, 300]) ink(g, B([x, 362], [x + (x < 180 ? 20 : -20), 440], [x, 500], [x + (x < 180 ? 16 : -16), 558]), { w: 2, d: 400, t: 500 })
        gorilla(g, 180, 540, 0.8, 700)
        text(g, 180, 620, 'Wer den Gorilla erwartet, übersieht anderes', { anchor: 'middle', cls: 's', d: 1300 })
      },
      zauber(g) {
        fig(g, 110, 620, 4, { arms: 'up' })
        ink(g, RR(200, 380, 60, 70, 8), { w: 2.6, d: 400, t: 400 })
        ink(g, L([190, 384], [270, 384]), { w: 3, d: 500, t: 300 })
        ball(g, 230, 560, 10, { d: 900, fill: 'dicht', t: 200 })
        text(g, 230, 600, 'der Trick passiert daneben', { anchor: 'middle', cls: 's', d: 1100 })
      },
      schulter(g) {
        fig(g, 180, 600, 5)
        arrow(g, B([160, 420], [120, 400], [90, 420], [80, 460]), { w: 2.6, d: 600, t: 400, head: 9 })
        text(g, 180, 650, 'feste Routinen: Schulterblick', { anchor: 'middle', cls: 's', d: 900 })
      },
      ende(g) {
        eye(g, 180, 480, 2.4)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein berühmtes Experiment: Du siehst ein Video, in dem zwei Teams sich **Basketbälle** zupassen – eins in Weiß, eins in Schwarz.', 64), gfx: { spiel: {} } },
      { t: T('Deine Aufgabe: Zähle die Pässe des **weißen Teams**. Gar nicht so leicht – die Spieler laufen durcheinander.', 64), gfx: { zaehlen: {} } },
      { t: T('Mitten im Video läuft eine Person im **Gorillakostüm** durchs Bild, bleibt stehen, trommelt sich auf die Brust – und geht.', 64), gfx: { gorilla: {} } },
      { t: T('Rund **die Hälfte** der Zuschauer bemerkt den Gorilla nicht. Neun Sekunden lang, mitten im Bild.', 64), gfx: { haelfte: {} } },
      { t: T('Das ist **Unaufmerksamkeitsblindheit**: Was wir nicht erwarten und nicht beachten, sehen wir oft schlicht nicht.', 64), gfx: { haelfte: {} } },
      { t: T('Daniel Simons und Christopher Chabris veröffentlichten den Versuch 1999. Er wurde eines der **bekanntesten** Experimente der Psychologie.', 64), gfx: { gorilla: {} } },
      { t: T('Dein Gehirn kann nicht alles verarbeiten. Aufmerksamkeit wirkt wie ein **Scheinwerfer**: Was daneben liegt, bleibt dunkel.', 64), gfx: { scheinwerfer: {} } },
      { t: T('Das Unheimliche: Wer den Gorilla verpasst hat, ist sich oft **sicher**, dass da keiner war.', 64), gfx: { sicher: {} } },
      { t: T('Sogar Fachleute: In ein Lungen-CT bauten Forscher einen winzigen Gorilla ein. **83 Prozent** der Radiologen übersahen ihn – obwohl sie Auffälligkeiten suchten.', 64), gfx: { lunge: {} } },
      { t: T('Die Farbe zählt mit: Wer die Pässe von **Weiß** zählte, übersah den dunklen Gorilla öfter als wer Schwarz zählte.', 64), gfx: { gorilla: {} } },
      { t: T('Und je anstrengender die Zählaufgabe, desto **seltener** sahen Teilnehmer den Gorilla.', 64), gfx: { zaehlen: {} } },
      { t: T('Im Verkehr ist das gefährlich: Autofahrer übersehen **Motorräder** oder Radfahrer, mit denen sie nicht rechnen.', 64), gfx: { motorrad: {} } },
      { t: T('Das Handy am Steuer macht es schlimmer: Der Blick ist auf der Straße, die Aufmerksamkeit **woanders**.', 64), gfx: { motorrad: {} } },
      { t: T('Verwandt ist die **Veränderungsblindheit**: In einem Versuch fragte ein Mann nach dem Weg – dann trugen zwei Leute eine Tür zwischen beiden hindurch.', 64), gfx: { tuer: { cls: 'a1' } } },
      { t: T('Hinter der Tür tauschte der Fragende mit einem **anderen Mann**. Rund die Hälfte der Befragten merkte nichts.', 64), gfx: { tuer: {} } },
      { t: T('Wissen schützt nur begrenzt: Wer den Gorilla erwartete, sah ihn zwar – übersah dafür andere **Überraschungen** im selben Video.', 64), gfx: { vorhang: {} } },
      { t: T('Zauberer leben davon: Sie lenken deinen Scheinwerfer – und machen ihren Trick **daneben**.', 64), gfx: { zauber: {} } },
      { t: T('Was hilft? Wo du nichts übersehen darfst, helfen feste **Routinen** – wie der Schulterblick beim Abbiegen.', 64), gfx: { schulter: {} } },
      { t: T('Du siehst, **worauf du achtest** – nicht alles, was da ist.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Etwa die Hälfte übersieht einen Gorilla, wenn sie Pässe zählt (Unaufmerksamkeitsblindheit).', 'Aufmerksamkeit ist ein Scheinwerfer – auch Fachleute übersehen Unerwartetes.', 'Im Verkehr helfen feste Routinen wie der Schulterblick.'],
    sources: ['Simons & Chabris 1999, Perception 28', 'Drew, Võ & Wolfe 2013, Psychological Science 24', 'Simons & Levin 1998, Psychonomic Bulletin & Review 5'],
  },
  {
    id: 'anker',
    area: 'PSY',
    day: 63,
    hook: 'Kann eine zufällige Zahl deine Schätzung verändern?',
    mood: 'raetsel',
    ambience: 'uhr',
    images: [img('anker'), img('gandhi')],
    draw: {
      anker(g) {
        ink(g, L([180, 120], [180, 340]), { w: 4, t: 600 })
        ink(g, E(180, 106, 16), { w: 3, d: 200, t: 400 })
        ink(g, L([140, 170], [176, 170]), { w: 3.6, d: 400, t: 300 })
        ink(g, L([184, 170], [220, 170]), { w: 3.6, d: 400, t: 300 })
        ink(g, B([90, 290], [110, 350], [250, 350], [270, 290]), { w: 4, d: 600, t: 600 })
        for (const k of [-1, 1]) ink(g, [[180 + k * 90, 290], [180 + k * 104, 300], [180 + k * 84, 308]], { w: 3, d: 1100, t: 200 })
      },
      rad(g) {
        ink(g, E(180, 460, 110), { w: 3.2, t: 800 })
        for (let k = 0; k < 10; k++) {
          const a = rad(k * 36 - 90)
          ink(g, L([180, 460], [180 + Math.cos(a) * 110, 460 + Math.sin(a) * 110]), { w: 1.4, d: 300 + k * 50, t: 150 })
          text(g, 180 + Math.cos(a + rad(18)) * 86, 465 + Math.sin(a + rad(18)) * 86, String(k * 10), { anchor: 'middle', cls: 's halo', d: 700 + k * 40 })
        }
        ink(g, [[180, 330], [170, 314], [190, 314], [180, 330]], { w: 2.6, d: 1200, t: 200 })
        ball(g, 180, 460, 10, { d: 900, fill: 'dicht', t: 200 })
      },
      afrika(g) {
        globe(g, 180, 470, 110)
        text(g, 180, 630, 'Anteil afrikanischer Staaten in der UNO?', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ergebnis(g) {
        vbars(g, [
          { label: 'nach der 10', v: 25, fmt: (v) => `${Math.round(v)} %` },
          { label: 'nach der 65', v: 45, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'mittlere Schätzung', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zug(g) {
        ink(g, L([30, 470], [330, 470]), { w: 2.4, t: 600 })
        for (let k = 0; k <= 10; k++) ink(g, L([30 + k * 30, 462], [30 + k * 30, 478]), { w: 1.6, d: 200 + k * 30, t: 80 })
        ball(g, 90, 470, 12, { d: 600, fill: 'dicht', t: 200 })
        text(g, 90, 440, 'Anker', { anchor: 'middle', cls: 's', d: 700 })
        arrow(g, L([106, 500], [160, 500]), { w: 2.4, d: 900, t: 300, head: 9 })
        text(g, 240, 530, 'zögerlich weg vom Anker', { anchor: 'middle', cls: 's', d: 1100 })
      },
      preis(g) {
        ink(g, [[60, 400], [250, 400], [300, 460], [250, 520], [60, 520], [60, 400]], { w: 3, t: 800 })
        ink(g, E(270, 460, 8), { w: 2, d: 400, t: 200 })
        text(g, 150, 444, 'statt 299 €', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 150, 494, '199 €', { anchor: 'middle', size: 30, d: 1100 })
        text(g, 180, 590, 'der alte Preis ist der Anker', { anchor: 'middle', cls: 's', d: 1300 })
      },
      gehalt(g) {
        fig(g, 90, 600, 3.6)
        fig(g, 270, 600, 3.6, { d: 200 })
        ink(g, RR(130, 520, 100, 20, 4), { w: 2.6, d: 400, t: 300 })
        bubble(g, 20, 360, 150, 60, 'l', 700)
        text(g, 95, 398, '65.000 €?', { anchor: 'middle', d: 900 })
      },
      richter(g) {
        fig(g, 180, 600, 4.6)
        ink(g, RR(110, 600, 140, 30, 4), { w: 2.8, d: 300, t: 400 })
        for (const [x, n] of [[60, '3'], [300, '9']] as const) {
          ink(g, RR(x - 22, 380, 44, 44, 8), { w: 2.6, d: 600, t: 300 })
          text(g, x, 410, n, { anchor: 'middle', size: 22, d: 800 })
        }
        text(g, 180, 670, 'gewürfelte Zahl → höhere Strafe', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gandhi(g) {
        for (const [x, n, d] of [[90, '9 Jahre?', 0], [270, '140 Jahre?', 400]] as const) {
          ink(g, RR(x - 70, 400, 140, 70, 10), { w: 2.6, d, t: 400 })
          text(g, x, 444, n, { anchor: 'middle', size: 20, d: d + 200 })
        }
        text(g, 180, 560, 'absurde Anker wirken trotzdem', { anchor: 'middle', cls: 's', d: 1000 })
      },
      makler(g) {
        house(g, 110, 600, 140, 0)
        ink(g, RR(230, 420, 100, 50, 6), { w: 2.6, d: 600, t: 400 })
        text(g, 280, 452, 'Listenpreis', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 180, 650, 'auch Profis lassen sich verankern', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gruende(g) {
        brain(g, 180, 440, 1)
        for (const [x, y] of [[80, 590], [180, 610], [280, 590]] as const) check(g, x, y, 0.8, 1100)
        text(g, 180, 330, 'sucht Gründe für den Anker', { anchor: 'middle', cls: 's', d: 1200 })
      },
      gegen(g) {
        brain(g, 180, 440, 1)
        for (const [x, y] of [[80, 590], [180, 610], [280, 590]] as const) cross(g, x, y, 0.7, 1100)
        text(g, 180, 330, 'Gründe dagegen suchen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        ink(g, L([180, 420], [180, 580]), { w: 4, t: 500 })
        ink(g, E(180, 406, 14), { w: 3, d: 200, t: 400 })
        ink(g, B([110, 540], [124, 590], [236, 590], [250, 540]), { w: 4, d: 500, t: 500 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein Versuch der Psychologen Amos Tversky und Daniel Kahneman: Vor den Augen der Teilnehmer wird ein **Glücksrad** gedreht.', 64), gfx: { rad: {} } },
      { t: T('Das Rad ist präpariert: Es bleibt entweder bei **10** oder bei **65** stehen. Alle sehen, dass die Zahl zufällig ist.', 64), gfx: { rad: {} } },
      { t: T('Dann die Frage: Liegt der Anteil afrikanischer Staaten in der UNO über oder unter dieser Zahl? Und **wie hoch** ist er?', 64), gfx: { afrika: {} } },
      { t: T('Wer die 10 gesehen hatte, schätzte im Mittel **25 Prozent**. Wer die 65 gesehen hatte: 45 Prozent.', 64), gfx: { ergebnis: {} } },
      { t: T('Eine offensichtlich **zufällige** Zahl hat die Schätzung um 20 Prozentpunkte verschoben.', 64), gfx: { ergebnis: {} } },
      { t: T('Das ist der **Ankereffekt**: Eine erste Zahl wirkt wie ein Anker, von dem wir uns nur zögerlich wegbewegen.', 64), gfx: { zug: {} } },
      { t: T('Händler nutzen das täglich: Der **durchgestrichene Preis** ist ein Anker. 199 statt 299 wirkt günstig – egal, was das Ding wert ist.', 64), gfx: { preis: {} } },
      { t: T('In Gehaltsverhandlungen setzt oft die **erste genannte Zahl** den Rahmen für alles, was folgt.', 64), gfx: { gehalt: {} } },
      { t: T('Sogar Richter sind beeinflussbar: In Versuchen schlugen erfahrene Juristen nach einem **gewürfelten** Anker höhere Strafen vor.', 64), gfx: { richter: {} } },
      { t: T('Selbst absurde Anker wirken: Die Frage, ob Gandhi älter als **140 Jahre** wurde, hob die Schätzungen seines Sterbealters deutlich an.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Mahatma Gandhi' } } },
      { t: T('Auch Immobilienmakler ließen sich in einem Versuch vom angegebenen **Listenpreis** beeinflussen – und bestritten es hinterher.', 64), gfx: { makler: {} } },
      { t: T('Warum? Das Gehirn prüft den Anker, sucht **Gründe**, warum er passen könnte – und findet welche.', 64), gfx: { gruende: {} } },
      { t: T('Oder es startet beim Anker und passt die Schätzung schrittweise an – und **hört zu früh auf**.', 64), gfx: { zug: {} } },
      { t: T('Erfahrung schützt kaum: Fachleute werden in vielen Studien **fast genauso stark** verankert wie Laien.', 64), gfx: { makler: {} } },
      { t: T('Nicht jeder Versuch hält stand: Dass schon die eigene **Telefonnummer** Gebote verändert, ließ sich später nur schwach wiederholen.', 64), gfx: { rad: {} } },
      { t: T('Was hilft: Vor dem Schätzen bewusst Gründe suchen, warum der Anker **falsch** sein könnte – das Gegenteil bedenken.', 64), gfx: { gegen: {} } },
      { t: T('Und in Verhandlungen selbst zuerst einen gut begründeten Wert nennen. Dann bist **du** der Anker.', 64), gfx: { gehalt: {} } },
      { t: T('Die erste Zahl ist selten neutral – sie **zieht**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Eine zufällige Zahl (10 oder 65) verschob Schätzungen um 20 Prozentpunkte.', 'Erste Zahlen wirken als Anker – auch bei Preisen, Gehältern, Strafmaßen.', 'Gegenmittel: Gründe gegen den Anker suchen oder selbst zuerst begründet ankern.'],
    sources: ['Tversky & Kahneman 1974, Science 185', 'Englich, Mussweiler & Strack 2006, Personality and Social Psychology Bulletin 32', 'Chapman et al. 2023, Journal of Economic Psychology (Replikation)'],
  },
  {
    id: 'verlustangst',
    area: 'PSY',
    day: 63,
    hook: 'Warum tut Verlieren mehr weh, als Gewinnen freut?',
    mood: 'dunkel',
    ambience: 'uhr',
    images: [img('muenzwurf'), img('golf'), img('kapuziner')],
    draw: {
      muenze(g) {
        ball(g, 180, 250, 90, { fill: 'hell', w: 3.2, t: 800 })
        ink(g, E(180, 250, 70), { w: 1.6, d: 400, t: 600 })
        text(g, 180, 268, '€', { anchor: 'middle', size: 54, cls: 'halo', d: 700 })
      },
      wette(g) {
        box(g, 30, 370, 140, 90, ['Kopf:', '+ 110 €'], { size: 18 })
        box(g, 190, 370, 140, 90, ['Zahl:', '− 100 €'], { size: 18, d: 300, fill: true })
        ball(g, 180, 560, 34, { d: 700, w: 2.8 })
        question(g, 180, 572, 0.6, 1000)
      },
      ablehnen(g) {
        crowd(g, 40, 600, 8, 40, 2.4, 0, 100)
        for (let i = 0; i < 8; i++) (i < 6 ? cross : check)(g, 40 + i * 40, 640, 0.5, 900 + i * 80)
        text(g, 180, 420, 'erst ab ≈ 200 € Gewinn', { anchor: 'middle', d: 1500 })
      },
      kurve(g) {
        for (const [x0, n, up, d] of [[30, 'Gewinn', true, 0], [195, 'Verlust', false, 700]] as const) {
          ink(g, L([x0, 470], [x0 + 140, 470]), { w: 2.2, d, t: 300 })
          plot(g, x0 + 4, 470, 130, up ? 90 : -180, (t) => Math.pow(t, 0.6), { d: d + 300 })
          text(g, x0 + 70, up ? 500 : 340, n, { anchor: 'middle', cls: 's', d: d + 500 })
        }
        text(g, 180, 330, 'gleiche Summe, doppeltes Gefühl', { anchor: 'middle', cls: 's', d: 1500 })
      },
      tasse(g) {
        ink(g, [[110, 380], [120, 560], [240, 560], [250, 380]], { w: 3.2, t: 700 })
        ink(g, E(266, 460, 26, 40, -90, 90), { w: 3, d: 400, t: 400 })
        text(g, 180, 620, 'geschenkt bekommen: plötzlich mehr wert', { anchor: 'middle', cls: 's', d: 900 })
      },
      aktie(g) {
        axes(g, 30, 600, 330, 330, { xl: 'Zeit', yl: 'Kurs' })
        ink(g, [[40, 380], [80, 400], [120, 450], [160, 430], [200, 500], [240, 520], [280, 560], [320, 570]], { w: 2.8, d: 400, t: 1200 })
        text(g, 230, 400, '„Ich warte noch …“', { anchor: 'middle', cls: 'it', d: 1500 })
      },
      verpassen(g) {
        box(g, 40, 380, 280, 70, '„Jetzt nicht verpassen!“', { size: 18, fill: true })
        box(g, 40, 490, 280, 70, '„Jetzt gewinnen“', { size: 18, d: 500 })
        text(g, 180, 610, 'drohender Verlust zieht stärker', { anchor: 'middle', cls: 's', d: 1000 })
      },
      golf(g) {
        ink(g, B([20, 600], [100, 580], [260, 580], [340, 600]), { w: 3, t: 700 })
        ink(g, E(260, 586, 14, 4), { w: 2.2, d: 300, t: 200 })
        ink(g, L([260, 586], [260, 470]), { w: 2, d: 500, t: 300 })
        ink(g, [[260, 470], [300, 484], [260, 498]], { w: 2, d: 700, t: 200 })
        fig(g, 100, 580, 3, { d: 400 })
        ball(g, 150, 576, 5, { d: 900, t: 0 })
        text(g, 180, 420, 'konzentrierter, um zu verhindern', { anchor: 'middle', cls: 's', d: 1100 })
      },
      affen(g) {
        const monkey = (x: number, d: number) => {
          ball(g, x, 470, 40, { d, w: 2.8 })
          for (const k of [-1, 1]) ink(g, E(x + k * 42, 456, 12), { w: 2.4, d: d + 200, t: 300 })
          for (const k of [-1, 1]) dot(g, x + k * 14, 462, 4, d + 400)
          ink(g, B([x - 14, 490], [x - 6, 498], [x + 6, 498], [x + 14, 490]), { w: 2, d: d + 500, t: 200 })
        }
        monkey(110, 0)
        monkey(250, 300)
        text(g, 180, 600, 'Kapuzineraffen: dieselbe Verlustscheu', { anchor: 'middle', cls: 's', d: 1000 })
      },
      bar(g) {
        box(g, 30, 380, 140, 90, ['Rabatt bei', 'Barzahlung'], { size: 16 })
        check(g, 100, 520, 1, 600)
        box(g, 190, 380, 140, 90, ['Aufschlag bei', 'Kartenzahlung'], { size: 16, d: 400, fill: true })
        cross(g, 260, 520, 1, 900)
        text(g, 180, 610, 'dieselbe Rechnung, anderes Gefühl', { anchor: 'middle', cls: 's', d: 1200 })
      },
      vorfahren(g) {
        fig(g, 120, 600, 4)
        ink(g, E(260, 560, 40, 20), { w: 2.6, d: 400, t: 400 })
        hatch(g, E(260, 560, 36, 16), 800)
        text(g, 180, 400, 'Verlust konnte tödlich sein', { anchor: 'middle', cls: 's', d: 1000 })
      },
      neukauf(g) {
        question(g, 180, 460, 1.6)
        text(g, 180, 600, 'Würde ich es neu kaufen?', { anchor: 'middle', size: 20, d: 900 })
      },
      ende(g) {
        for (const [x0, up, d] of [[60, true, 0], [200, false, 400]] as const) {
          ink(g, L([x0, 500], [x0 + 100, 500]), { w: 2.4, d, t: 300 })
          plot(g, x0, 500, 96, up ? 50 : -100, (t) => Math.pow(t, 0.6), { d: d + 200 })
        }
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein Angebot: Eine Münze wird geworfen. Kopf – du gewinnst **110 Euro**. Zahl – du verlierst 100 Euro. Spielst du mit?', 64), gfx: { wette: {} } },
      { t: T('Rein rechnerisch lohnt es sich: Im Schnitt gewinnst du **5 Euro** pro Wurf.', 64), gfx: { f1: { draw: 'formel', args: [['½ × 110 €', '−', '½ × 100 €', '=', '+ 5 €'], 360] } } },
      { t: T('Trotzdem lehnen die meisten ab. Viele würden erst mitspielen, wenn der mögliche Gewinn bei rund **200 Euro** liegt.', 64), gfx: { ablehnen: {} } },
      { t: T('Das ist **Verlustaversion**: Ein Verlust schmerzt etwa doppelt so stark, wie ein gleich großer Gewinn freut.', 64), gfx: { kurve: {} } },
      { t: T('Beschrieben haben das Daniel Kahneman und Amos Tversky 1979 in ihrer **Prospect Theory**. Kahneman bekam dafür später den Wirtschafts-Nobelpreis.', 64), gfx: { kurve: {} } },
      { t: T('Verwandt ist der **Besitztumseffekt**: Was uns gehört, bewerten wir höher.', 64), gfx: { tasse: {} } },
      { t: T('In einem Versuch bekam die Hälfte der Gruppe eine Tasse geschenkt. Verkaufen wollten sie sie im Mittel nur für etwa **das Doppelte** dessen, was andere zu zahlen bereit waren.', 64), gfx: { tasse: {} } },
      { t: T('Darum halten Anleger fallende Aktien oft zu lange: **Verkaufen** würde den Verlust endgültig machen.', 64), gfx: { aktie: {} } },
      { t: T('Werbung nutzt es: „Nicht **verpassen**!“ wirkt stärker als „Jetzt gewinnen“.', 64), gfx: { verpassen: {} } },
      { t: T('Auch Gratis-Probeabos spielen damit: Was du einmal hast, **kündigst** du ungern.', 64), gfx: { verpassen: {} } },
      { t: T('Sogar Golfprofis zeigen es: Sie putten zielsicherer, um einen Schlag **zu viel** zu vermeiden, als um einen Schlag zu gewinnen.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Auch Kapuzineraffen zeigen es: In Tauschversuchen mit Futter mieden sie Angebote, die sich wie ein **Verlust** anfühlten.', 64), pics: { p2: { img: 2, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Eine Erklärung aus der Evolution: Für unsere Vorfahren konnte ein Verlust – Vorräte, Schutz – **tödlich** sein. Ein Gewinn war nur angenehm.', 64), gfx: { vorfahren: {} } },
      { t: T('Händler wissen das: Ein **Rabatt** bei Barzahlung klingt viel besser als ein Aufschlag bei Kartenzahlung – obwohl es dasselbe ist.', 64), gfx: { bar: {} } },
      { t: T('Ein Schulversuch in den USA: Lehrkräfte, die einen Bonus vorab bekamen und **zurückzahlen** mussten, wenn Ziele verfehlt wurden, erzielten bessere Ergebnisse.', 64), gfx: { bar: {} } },
      { t: T('Ein Trick für Entscheidungen: Frag dich, ob du es **neu kaufen** würdest, wenn du es nicht schon hättest.', 64), gfx: { neukauf: {} } },
      { t: T('Und denk in **Summen** statt in Einzelfällen: Viele kleine faire Wetten gleichen Verluste auf lange Sicht aus.', 64), gfx: { kurve: {} } },
      { t: T('Verluste wiegen **doppelt**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Verluste schmerzen etwa doppelt so stark, wie gleich große Gewinne freuen (Prospect Theory).', 'Daraus folgen Besitztumseffekt, zu langes Halten von Verlust-Aktien, Angst vor dem Verpassen.', 'Hilfreich: „Würde ich es neu kaufen?“'],
    sources: ['Kahneman & Tversky 1979, Econometrica 47', 'Kahneman, Knetsch & Thaler 1990, Journal of Political Economy 98', 'Pope & Schweitzer 2011, American Economic Review 101'],
  },
  {
    id: 'placebo',
    area: 'PSY',
    day: 12,
    hook: 'Wirken Zuckerpillen – sogar, wenn du es weißt?',
    mood: 'raetsel',
    ambience: 'herz',
    images: [img('tabletten')],
    draw: {
      pille(g) {
        const p = RR(90, 220, 180, 70, 35)
        ink(g, p, { w: 3.2, t: 700 })
        hatch(g, RR(180, 222, 88, 66, 32), 600, true)
        ink(g, L([180, 222], [180, 288]), { w: 2.2, d: 500, t: 200 })
      },
      schein(g) {
        const p = RR(90, 440, 180, 70, 35)
        ink(g, p, { w: 3.2, t: 700 })
        ink(g, L([180, 442], [180, 508]), { w: 2.2, d: 500, t: 200 })
        text(g, 180, 580, 'kein Wirkstoff', { anchor: 'middle', size: 20, d: 900 })
      },
      besser(g) {
        bullets(g, 60, 380, ['Schmerzen', 'Übelkeit', 'Erschöpfung', 'Schlafprobleme'], { gap: 50, size: 19 })
      },
      erwartung(g) {
        brain(g, 180, 440, 1.1)
        arrow(g, L([180, 520], [180, 600]), { w: 2.6, d: 1000, t: 300, head: 9 })
        text(g, 180, 630, 'eigene Botenstoffe', { anchor: 'middle', cls: 's', d: 1200 })
      },
      naloxon(g) {
        box(g, 30, 380, 140, 70, 'Placebo', { size: 18 })
        arrow(g, L([100, 456], [100, 520]), { w: 2.4, d: 400, t: 300, head: 9 })
        box(g, 30, 530, 140, 60, 'Endorphine', { size: 16, d: 600 })
        box(g, 190, 380, 140, 70, ['+ Gegenmittel', 'zu Morphin'], { size: 15, d: 900, fill: true })
        cross(g, 260, 560, 1.2, 1300)
      },
      groesse(g) {
        ink(g, RR(50, 470, 60, 26, 13), { w: 2.4, t: 400 })
        ink(g, RR(150, 450, 100, 46, 23), { w: 2.8, d: 300, t: 500 })
        ink(g, L([270, 420], [330, 520]), { w: 3, d: 600, t: 300 })
        ink(g, RR(260, 400, 30, 60, 4), { w: 2.4, d: 700, t: 300 })
        text(g, 180, 580, 'groß, Spritze, auffällig: oft stärker', { anchor: 'middle', cls: 's', d: 1000 })
      },
      preis(g) {
        for (const [x, n, d] of [[100, '2,50 €', 0], [260, '10 Cent', 400]] as const) {
          ink(g, RR(x - 60, 420, 120, 50, 25), { w: 2.8, d, t: 500 })
          text(g, x, 520, n, { anchor: 'middle', size: 20, d: d + 300 })
        }
        text(g, 180, 600, 'teuer wirkt besser', { anchor: 'middle', cls: 's', d: 1000 })
      },
      offen(g) {
        ink(g, RR(100, 380, 160, 220, 14), { w: 3, t: 700 })
        text(g, 180, 440, 'PLACEBO', { anchor: 'middle', size: 22, d: 500 })
        text(g, 180, 470, 'ohne Wirkstoff', { anchor: 'middle', cls: 's', d: 700 })
        for (let i = 0; i < 4; i++) ink(g, E(140 + i * 27, 540, 10, 6), { w: 2, d: 900 + i * 80, t: 200 })
      },
      studien(g) {
        vbars(g, [
          { label: 'ohne Pille', v: 3, fmt: () => '' },
          { label: 'offenes Placebo', v: 5, fmt: () => 'besser', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        text(g, 180, 330, 'Reizdarm, Rückenschmerz', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ritual(g) {
        ink(g, [[110, 400], [120, 560], [240, 560], [250, 400]], { w: 3, t: 700 })
        ink(g, RR(130, 340, 40, 18, 9), { w: 2.4, d: 500, t: 300 })
        clock(g, 300, 380, 30, 240, 0, 700)
        text(g, 180, 620, 'Ritual: sich um sich kümmern', { anchor: 'middle', cls: 's', d: 1100 })
      },
      scan(g) {
        brain(g, 100, 470, 0.6)
        hatch(g, E(100, 460, 24), 800, true)
        brain(g, 260, 470, 0.6, 300)
        ink(g, E(260, 460, 12), { w: 2, d: 900, t: 200 })
        text(g, 100, 560, 'ohne Placebo', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 260, 560, 'mit Placebo', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 180, 610, 'Schmerzareale weniger aktiv', { anchor: 'middle', cls: 's', d: 1300 })
      },
      knie(g) {
        ink(g, B([100, 340], [120, 400], [150, 440], [170, 470]), { w: 3.2, t: 500 })
        ink(g, B([170, 470], [190, 520], [200, 560], [210, 620]), { w: 3.2, d: 300, t: 500 })
        ink(g, B([150, 330], [168, 390], [196, 430], [216, 470]), { w: 3.2, t: 500 })
        ink(g, B([216, 470], [236, 520], [246, 560], [256, 620]), { w: 3.2, d: 300, t: 500 })
        for (const [x, y] of [[230, 450], [160, 500]] as const) ink(g, L([x - 8, y], [x + 8, y]), { w: 2.2, d: 900, t: 100 })
        text(g, 290, 400, 'Schein-OP', { anchor: 'middle', d: 1100 })
      },
      nocebo(g) {
        const p = RR(90, 440, 180, 70, 35)
        ink(g, p, { w: 3.2, t: 700 })
        text(g, 180, 380, 'Nocebo', { anchor: 'middle', size: 26, d: 500 })
        text(g, 180, 580, 'erwartete Nebenwirkungen kommen eher', { anchor: 'middle', cls: 's', d: 900 })
      },
      grenzen(g) {
        box(g, 30, 380, 140, 90, ['Beschwerden', 'erleben'], { size: 16 })
        check(g, 100, 520, 1, 600)
        box(g, 190, 380, 140, 90, ['Infektion,', 'Tumor'], { size: 16, d: 400, fill: true })
        cross(g, 260, 520, 1, 900)
      },
      doppelblind(g) {
        fig(g, 90, 600, 4)
        fig(g, 270, 600, 4, { d: 200 })
        for (const x of [90, 270]) ink(g, RR(x - 22, 470, 44, 12, 4), { w: 2.4, d: 700, t: 200 })
        text(g, 180, 400, 'weder Patient noch Ärztin wissen es', { anchor: 'middle', cls: 's', d: 1000 })
      },
      verdeckt(g) {
        vbars(g, [
          { label: 'heimlich gegeben', v: 3, fmt: () => '' },
          { label: 'angekündigt', v: 5.5, fmt: () => 'mehr Linderung', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        text(g, 180, 330, 'gleiches Schmerzmittel', { anchor: 'middle', cls: 's', d: 1200 })
      },
      ende(g) {
        ink(g, RR(110, 460, 140, 56, 28), { w: 3, t: 600 })
        ink(g, L([180, 462], [180, 514]), { w: 2, d: 400, t: 200 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein **Placebo** ist ein Scheinmedikament: eine Tablette ohne Wirkstoff, oft nur aus Zucker oder Stärke.', 64), gfx: { schein: {} } },
      { t: T('Trotzdem fühlen sich viele Menschen damit besser – vor allem bei **Schmerzen**, Übelkeit oder Erschöpfung.', 64), gfx: { besser: {} } },
      { t: T('Der Schlüssel ist **Erwartung**: Das Gehirn rechnet mit Linderung – und verändert, was es selbst ausschüttet und wahrnimmt.', 64), gfx: { erwartung: {} } },
      { t: T('Bei Schmerzen setzt es **Endorphine** frei, körpereigene Schmerzmittel. Ein Gegenmittel zu Morphin kann den Placebo-Effekt sogar abschwächen.', 64), gfx: { naloxon: {} } },
      { t: T('Das Drumherum zählt: Auffällige Pillen, Spritzen und **ausführliche** Gespräche wirken oft stärker als eine kleine Tablette.', 64), gfx: { groesse: {} } },
      { t: T('Auch der **Preis**: In einem Versuch linderte eine angeblich teure Schmerzpille mehr als dieselbe, angeblich billige.', 64), gfx: { preis: {} } },
      { t: T('Am verblüffendsten sind **offene Placebos**: Man sagt den Menschen ehrlich, dass sie Zuckerpillen bekommen.', 64), gfx: { offen: {} } },
      { t: T('In Studien zu Reizdarm oder Rückenschmerzen ging es vielen trotzdem **besser** als ohne Pillen.', 64), gfx: { studien: {} } },
      { t: T('Vermutlich wirkt das **Ritual**: regelmäßig etwas für sich tun, Zuwendung, die Aufmerksamkeit auf Besserung.', 64), gfx: { ritual: {} } },
      { t: T('Das ist keine bloße Einbildung: Hirnscans zeigen, dass Schmerzareale unter Placebo tatsächlich **weniger aktiv** sind.', 64), gfx: { scan: {} } },
      { t: T('Es gibt auch das Gegenteil, den **Nocebo-Effekt**: Wer Nebenwirkungen erwartet, bekommt sie eher – auch von Zuckerpillen.', 64), gfx: { nocebo: {} } },
      { t: T('Sogar **Schein-Operationen** wirken: Bei manchen Knie-Eingriffen schnitten sie in Studien genauso gut ab wie die echte Operation.', 64), gfx: { knie: {} } },
      { t: T('Die Grenzen sind klar: Placebos heilen **keine Infektion** und lassen keinen Tumor schrumpfen. Sie verändern vor allem, wie wir Beschwerden erleben.', 64), gfx: { grenzen: {} } },
      { t: T('Darum testet man Medikamente **doppelblind** gegen Placebo: Weder Patienten noch Ärzte wissen, wer was bekommt.', 64), gfx: { doppelblind: {} } },
      { t: T('Ein Mittel muss besser wirken als das Placebo – sonst ist seine Wirkung **nur Erwartung**.', 64), gfx: { grenzen: {} } },
      { t: T('Und echte Medikamente wirken teils auch über Erwartung: Ein angekündigtes Schmerzmittel lindert **mehr** als dasselbe, heimlich gegeben.', 64), gfx: { verdeckt: {} } },
      { t: T('Erwartung ist ein **echtes Medikament** – mit klaren Grenzen.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Placebos lindern vor allem Beschwerden wie Schmerz und Übelkeit – über Erwartung und körpereigene Botenstoffe.', 'Sogar offene Placebos zeigten in Studien Wirkung; Nocebo ist das Gegenstück.', 'Sie heilen keine Infektion – darum testet man Medikamente doppelblind gegen Placebo.'],
    sources: ['Levine, Gordon & Fields 1978, The Lancet 312', 'Kaptchuk et al. 2010, PLOS ONE 5 (offene Placebos)', 'Bingel et al. 2011, Science Translational Medicine 3'],
  },
  {
    id: 'zuschauer',
    area: 'PSY',
    day: 41,
    hook: 'Warum hilft niemand, wenn alle zusehen?',
    mood: 'dunkel',
    ambience: 'stadt',
    images: [img('menschenmenge')],
    draw: {
      menge(g) {
        crowd(g, 40, 300, 9, 35, 1.6, 0, 80)
        lie(g, 120, 400, 2, 'curl', 900)
      },
      zeitung(g) {
        ink(g, RR(60, 340, 240, 280, 6), { w: 3, t: 700 })
        text(g, 180, 380, '38 sahen zu', { anchor: 'middle', size: 24, d: 500 })
        for (let i = 0; i < 6; i++) ink(g, L([80, 420 + i * 28], [280, 420 + i * 28]), { w: 1.4, d: 700 + i * 80, t: 300 })
        text(g, 180, 660, 'New York Times, 1964', { anchor: 'middle', cls: 's', d: 1100 })
      },
      uebertrieben(g) {
        ink(g, RR(60, 340, 240, 280, 6), { w: 3, t: 400 })
        text(g, 180, 380, '38 sahen zu', { anchor: 'middle', size: 24, d: 200 })
        const stamp = RR(150, 480, 140, 50, 8)
        blank(g, stamp)
        hatch(g, stamp, 900)
        ink(g, stamp, { w: 3, d: 700, t: 400 })
        text(g, 220, 512, 'übertrieben', { anchor: 'middle', cls: 'halo', d: 1000 })
      },
      versuch(g) {
        ink(g, RR(40, 380, 120, 150, 10), { w: 2.8, t: 600 })
        fig(g, 100, 500, 2.4, { d: 300 })
        ink(g, RR(200, 380, 120, 150, 10), { w: 2.8, d: 200, t: 600 })
        ink(g, RR(236, 420, 48, 30, 6), { w: 2, d: 500, t: 300 })
        for (let i = 0; i < 3; i++) ink(g, E(260, 470, 12 + i * 10, 12 + i * 10, -40, 40), { w: 1.6, d: 800 + i * 150, t: 200 })
        text(g, 180, 590, 'Notfall über die Gegensprechanlage', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zahlen(g) {
        vbars(g, [
          { label: 'allein', v: 85, fmt: (v) => `${Math.round(v)} %` },
          { label: 'mit 4 anderen', v: 31, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'holten schnell Hilfe', { anchor: 'middle', cls: 's', d: 1200 })
      },
      verteilt(g) {
        crowd(g, 50, 600, 6, 52, 2.6, 0, 100)
        for (let i = 0; i < 6; i++) bubble(g, 30 + i * 52, 430 + (i % 2) * 40, 44, 30, 'l', 600 + i * 100)
        text(g, 180, 380, '„Jemand anderes macht das schon.“', { anchor: 'middle', cls: 'it', d: 1300 })
      },
      ruhig(g) {
        crowd(g, 50, 600, 6, 52, 2.6, 0, 100)
        for (let i = 0; i < 6; i++) ink(g, L([50 + i * 52 - 8, 600 - 27 * 2.6], [50 + i * 52 + 8, 600 - 27 * 2.6]), { w: 1.6, d: 800, t: 100 })
        text(g, 180, 400, 'alle ruhig → kein Notfall?', { anchor: 'middle', cls: 's', d: 1100 })
      },
      blamieren(g) {
        fig(g, 180, 600, 5)
        question(g, 270, 420, 0.8, 600)
        text(g, 180, 650, 'Angst, falschzuliegen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      videos(g) {
        for (let i = 0; i < 10; i++) {
          const x = 46 + (i % 5) * 60
          const y = 380 + Math.floor(i / 5) * 100
          ink(g, RR(x - 22, y - 30, 44, 60, 6), { w: 2, d: i * 80, t: 200 })
          if (i < 9) check(g, x, y, 0.6, 900 + i * 60)
        }
        text(g, 180, 620, 'in 9 von 10 Konflikten griff jemand ein', { anchor: 'middle', cls: 's', d: 1600 })
      },
      chat(g) {
        for (let i = 0; i < 4; i++) bubble(g, i % 2 ? 150 : 40, 340 + i * 70, 170, 46, i % 2 ? 'r' : 'l', i * 200)
        text(g, 125, 372, 'Weiß jemand …?', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 180, 650, 'große Gruppe: seltener eine Antwort', { anchor: 'middle', cls: 's', d: 1100 })
      },
      freunde(g) {
        crowd(g, 60, 600, 4, 50, 2.6, 0, 100)
        lie(g, 240, 580, 1.6, 'curl', 500)
        text(g, 180, 400, 'Freunde, klare Gefahr: mehr Hilfe', { anchor: 'middle', cls: 's', d: 1000 })
      },
      kurs(g) {
        const cr = RR(150, 380, 60, 180, 6)
        hatch(g, cr, 400, true)
        ink(g, cr, { w: 2.8, t: 500 })
        const cr2 = RR(90, 440, 180, 60, 6)
        blank(g, RR(152, 442, 56, 56, 2))
        hatch(g, cr2, 400, true)
        ink(g, [[150, 440], [90, 440], [90, 500], [150, 500]], { w: 2.8, d: 200, t: 300 })
        ink(g, [[210, 440], [270, 440], [270, 500], [210, 500]], { w: 2.8, d: 200, t: 300 })
        text(g, 180, 620, 'Notruf 112 · Erste Hilfe', { anchor: 'middle', d: 900 })
      },
      ansprechen(g) {
        fig(g, 80, 600, 3.6)
        crowd(g, 200, 600, 4, 40, 2.4, 300, 80)
        arrow(g, L([110, 470], [236, 520]), { w: 2.6, d: 900, t: 400, head: 9 })
        bubble(g, 30, 360, 200, 60, 'l', 1100)
        text(g, 130, 396, '„Sie, mit der roten Jacke!“', { anchor: 'middle', cls: 's', d: 1300 })
      },
      anfangen(g) {
        fig(g, 80, 600, 3.6, { arms: 'up' })
        crowd(g, 180, 600, 4, 40, 2.4, 600, 150)
        text(g, 180, 420, 'einer fängt an – andere folgen', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        fig(g, 180, 580, 5, { arms: 'up' })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('New York, 1964: Kitty Genovese wird nachts vor ihrem Haus ermordet. Eine Zeitung berichtet: **38 Nachbarn** hätten zugesehen und nichts getan.', 64), gfx: { zeitung: {} } },
      { t: T('Die Geschichte war stark **übertrieben**: Viele hörten nur Geräusche, manche riefen die Polizei. Aber sie stieß wichtige Forschung an.', 64), gfx: { uebertrieben: {} } },
      { t: T('Die Psychologen John Darley und Bibb Latané stellten 1968 einen Notfall nach: Über die Gegensprechanlage bekommt jemand einen **Anfall**.', 64), gfx: { versuch: {} } },
      { t: T('Glaubten die Teilnehmer, sie seien **allein**, holten 85 Prozent schnell Hilfe.', 64), gfx: { zahlen: {} } },
      { t: T('Glaubten sie, **vier andere** hörten mit, waren es nur 31 Prozent.', 64), gfx: { zahlen: {} } },
      { t: T('Das ist der **Zuschauereffekt**: Je mehr Menschen dabei sind, desto seltener hilft der Einzelne.', 64), gfx: { verteilt: {} } },
      { t: T('Ein Grund: Die **Verantwortung verteilt sich**. Jeder denkt, jemand anderes kümmert sich schon.', 64), gfx: { verteilt: {} } },
      { t: T('Ein zweiter: Alle schauen, wie die anderen reagieren. Bleiben alle ruhig, scheint es **kein Notfall** zu sein.', 64), gfx: { ruhig: {} } },
      { t: T('Ein dritter: die Angst, sich zu **blamieren**, falls man die Lage falsch einschätzt.', 64), gfx: { blamieren: {} } },
      { t: T('Aber: Eine Auswertung echter Überwachungsvideos aus drei Ländern fand 2019, dass in **9 von 10** Konflikten jemand eingriff.', 64), gfx: { videos: {} } },
      { t: T('Je mehr Menschen da waren, desto wahrscheinlicher half **überhaupt jemand**. Der Einzelne zögert – die Gruppe nicht.', 64), gfx: { videos: {} } },
      { t: T('Auch online: Je mehr Menschen in einem Chat sind, desto seltener bekommt eine Frage überhaupt eine **Antwort**.', 64), gfx: { chat: {} } },
      { t: T('Der Effekt schrumpft, wenn die Zuschauer sich **kennen** – oder wenn die Lage eindeutig gefährlich ist.', 64), gfx: { freunde: {} } },
      { t: T('Was dir im Notfall hilft: nicht nur „Hilfe!“ rufen, sondern **eine Person direkt ansprechen**.', 64), gfx: { ansprechen: {} } },
      { t: T('„Sie mit der roten Jacke, rufen Sie bitte den Notruf!“ – damit ist die Verantwortung **nicht mehr verteilt**.', 64), gfx: { ansprechen: {} } },
      { t: T('Und wenn du Zeuge bist: Sei die Person, die **anfängt**. Die anderen ziehen oft nach.', 64), gfx: { anfangen: {} } },
      { t: T('Ein Erste-Hilfe-Kurs hilft doppelt: Du weißt, was zu tun ist – und fühlst dich **zuständig**. Im Ernstfall: 112.', 64), gfx: { kurs: {} } },
      { t: T('In der Menge hilft, wer sich **gemeint** fühlt.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Allein halfen 85 %, mit vier vermeintlichen Mithörern nur 31 % (Darley & Latané 1968).', 'Ursachen: verteilte Verantwortung, Orientierung an anderen, Angst vor Blamage.', 'Im Notfall eine Person direkt ansprechen; als Zeuge selbst anfangen.'],
    sources: ['Darley & Latané 1968, Journal of Personality and Social Psychology 8', 'Manning, Levine & Collins 2007, American Psychologist 62 (Genovese)', 'Philpot et al. 2020, American Psychologist 75'],
  },
  {
    id: 'asch',
    area: 'PSY',
    day: 41,
    hook: 'Würdest du einer falschen Antwort zustimmen, nur weil alle es tun?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [],
    draw: {
      linien(g) {
        stroke(g, 70, 360, 150, 'X')
        stroke(g, 190, 360, 100, 'A', 300)
        stroke(g, 250, 360, 150, 'B', 500)
        stroke(g, 310, 360, 190, 'C', 700)
      },
      aufgabe(g) {
        stroke(g, 70, 600, 150, 'X')
        stroke(g, 190, 600, 100, 'A', 300)
        stroke(g, 250, 600, 150, 'B', 500)
        stroke(g, 310, 600, 190, 'C', 700)
      },
      allein(g) {
        fig(g, 90, 600, 4)
        text(g, 230, 470, '„B“', { anchor: 'middle', size: 40, d: 500 })
        check(g, 230, 540, 1.2, 900)
        text(g, 180, 650, 'allein: fast immer richtig', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gruppe(g) {
        crowd(g, 30, 600, 7, 40, 2.4, 0, 100)
        fig(g, 310, 600, 2.4, { d: 800 })
        for (let i = 0; i < 7; i++) text(g, 30 + i * 40, 500, 'A', { anchor: 'middle', d: 900 + i * 120 })
        text(g, 310, 500, '?', { anchor: 'middle', size: 20, d: 1900 })
      },
      drittel(g) {
        pie(g, 180, 460, 110, 0.33)
        text(g, 180, 620, 'ein Drittel der Antworten: falsche Mehrheit', { anchor: 'middle', cls: 's', d: 1100 })
      },
      dreiviertel(g) {
        pie(g, 180, 460, 110, 0.75)
        text(g, 180, 620, 'drei Viertel gaben mindestens einmal nach', { anchor: 'middle', cls: 's', d: 1100 })
      },
      zweifel(g) {
        eye(g, 120, 470, 1.4)
        question(g, 260, 500, 1.2, 600)
      },
      verbuendet(g) {
        crowd(g, 30, 600, 6, 40, 2.4, 0, 100)
        fig(g, 270, 600, 2.4, { d: 700 })
        fig(g, 310, 600, 2.4, { d: 800 })
        for (let i = 0; i < 6; i++) text(g, 30 + i * 40, 500, 'A', { anchor: 'middle', d: 900 + i * 80 })
        text(g, 270, 500, 'B', { anchor: 'middle', d: 1500 })
        text(g, 310, 500, 'B', { anchor: 'middle', d: 1700 })
      },
      schreiben(g) {
        ink(g, RR(100, 380, 160, 200, 6), { w: 3, t: 700 })
        for (let i = 0; i < 4; i++) ink(g, L([120, 420 + i * 36], [240, 420 + i * 36]), { w: 1.4, d: 400 + i * 80, t: 300 })
        text(g, 180, 540, 'B', { anchor: 'middle', size: 34, d: 900 })
        text(g, 180, 630, 'geheim: kaum Anpassung', { anchor: 'middle', cls: 's', d: 1100 })
      },
      drei(g) {
        vbars(g, [
          { label: '1 Person', v: 3, fmt: () => 'kaum' },
          { label: '3 Personen', v: 32, fmt: () => 'voll' },
          { label: '15 Personen', v: 31, fmt: () => 'nicht mehr', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'Druck der einstimmigen Gruppe', { anchor: 'middle', cls: 's', d: 1300 })
      },
      likes(g) {
        for (let i = 0; i < 5; i++) {
          heart(g, 60 + i * 60, 470, 0.7, i * 200)
        }
        text(g, 180, 580, 'ein frühes Like zieht weitere nach', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kulturen(g) {
        vbars(g, [
          { label: 'individualistisch', v: 25, fmt: () => 'weniger' },
          { label: 'kollektivistisch', v: 37, fmt: () => 'mehr', dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 230 })
        text(g, 180, 320, 'Anpassung im Schnitt', { anchor: 'middle', cls: 's', d: 1200 })
      },
      kinder(g) {
        crowd(g, 40, 600, 3, 40, 2.2, 0, 100)
        fig(g, 260, 600, 1.6, { d: 500 })
        text(g, 180, 440, 'Vierjährige folgen der Mehrheit', { anchor: 'middle', cls: 's', d: 900 })
      },
      gut(g) {
        crowd(g, 60, 600, 6, 48, 2.6, 0, 100)
        text(g, 180, 420, 'Regeln lernen, gemeinsam handeln', { anchor: 'middle', cls: 's', d: 900 })
      },
      ende(g) {
        crowd(g, 50, 600, 5, 50, 2.6, 0, 100)
        fig(g, 310, 600, 2.6, { d: 600, arms: 'up' })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { linien: {} } },
      { t: T('1951 zeigte der Psychologe Solomon Asch Studenten eine Linie – und drei weitere. Welche ist **gleich lang** wie die erste?', 64), gfx: { aufgabe: {} } },
      { t: T('Die Aufgabe ist kinderleicht: Allein lagen fast alle **richtig**.', 64), gfx: { allein: {} } },
      { t: T('Doch im Raum saßen sieben andere – alle heimlich **eingeweiht**. Sie nannten laut, einer nach dem anderen, dieselbe falsche Antwort.', 64), gfx: { gruppe: {} } },
      { t: T('Die echte Versuchsperson kam **als Vorletzte** dran. Was würdest du sagen?', 64), gfx: { gruppe: {} } },
      { t: T('Rund **ein Drittel** der Antworten folgte der offensichtlich falschen Mehrheit.', 64), gfx: { drittel: {} } },
      { t: T('Und drei Viertel der Teilnehmer gaben **mindestens einmal** nach.', 64), gfx: { dreiviertel: {} } },
      { t: T('Manche sagten später, sie hätten an ihren **Augen gezweifelt**. Andere wollten einfach nicht aus der Reihe tanzen.', 64), gfx: { zweifel: {} } },
      { t: T('Das ist **Konformität**: Wir passen uns der Gruppe an – aus Unsicherheit oder um dazuzugehören.', 64), gfx: { gruppe: {} } },
      { t: T('Der Gegenzauber war **ein einziger Verbündeter**: Antwortete nur einer der anderen richtig, sank die Anpassung drastisch.', 64), gfx: { verbuendet: {} } },
      { t: T('Und wer seine Antwort **aufschreiben** durfte, statt sie laut zu sagen, gab viel seltener nach.', 64), gfx: { schreiben: {} } },
      { t: T('Die Gruppengröße zählt: Schon **drei** einstimmige Gegenüber reichten für den vollen Effekt – mehr brachte kaum noch etwas.', 64), gfx: { drei: {} } },
      { t: T('Heute zeigt sich das bei Likes und Bewertungen: In einem Versuch zog ein früh gesetztes **positives** Votum weitere positive nach.', 64), gfx: { likes: {} } },
      { t: T('Der Versuch wurde weltweit wiederholt. In Kulturen, die die **Gemeinschaft** betonen, passten sich Menschen im Schnitt stärker an.', 64), gfx: { kulturen: {} } },
      { t: T('In den USA nahm die Anpassung seit den 1950er-Jahren **ab** – die Zeiten prägen mit.', 64), gfx: { kulturen: {} } },
      { t: T('Schon **Vierjährige** schließen sich in Versuchen einer Mehrheit an – auch wenn sie es eigentlich besser wissen.', 64), gfx: { kinder: {} } },
      { t: T('Konformität ist nicht nur schlecht: Sie hilft, Regeln zu lernen und **gemeinsam** zu handeln.', 64), gfx: { gut: {} } },
      { t: T('Aber wenn du Zweifel hast: Sprich sie aus. Vielleicht bist du der **Verbündete**, auf den andere warten.', 64), gfx: { verbuendet: {} } },
      { t: T('Eine einzige Gegenstimme **befreit** alle.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei einer leichten Aufgabe folgte rund ein Drittel der Antworten einer falschen Mehrheit.', 'Ein einziger Verbündeter oder geheime Antworten senkten die Anpassung stark.', 'Konformität hilft beim Zusammenleben – Widerspruch hilft anderen, ehrlich zu sein.'],
    sources: ['Asch 1951/1956, Psychological Monographs 70', 'Bond & Smith 1996, Psychological Bulletin 119', 'Muchnik, Aral & Taylor 2013, Science 341'],
  },
  {
    id: 'cocktailparty',
    area: 'PSY',
    day: 63,
    hook: 'Wie hörst du in einem lauten Raum deinen Namen heraus?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [img('menschen-abend')],
    draw: {
      party(g) {
        crowd(g, 40, 400, 8, 40, 2.2, 0, 80)
        for (let i = 0; i < 4; i++) bubble(g, 30 + i * 80, 150 + (i % 2) * 60, 60, 36, i % 2 ? 'r' : 'l', 600 + i * 150)
      },
      zuhoeren(g) {
        fig(g, 70, 600, 3.6)
        fig(g, 180, 600, 3.6, { d: 200 })
        for (let i = 0; i < 3; i++) ink(g, E(150, 498, 12 + i * 10, 12 + i * 10, 160, 200), { w: 2, d: 700 + i * 120, t: 200 })
        crowd(g, 250, 600, 3, 30, 1.8, 400, 80)
        for (const [x, y] of [[260, 470], [300, 450], [320, 490]] as const) ink(g, waveP(x - 12, x + 12, y, 3, 8), { w: 1.2, d: 900, t: 200 })
      },
      cherry(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.25, label: '1953', sub: 'Colin Cherry, London', up: true },
          { at: 0.85, label: 'heute', up: true },
        ])
      },
      hinweise(g) {
        bullets(g, 50, 380, ['Richtung der Stimme', 'Tonhöhe und Klang', 'Lippenbewegungen', 'Sinn des Satzes'], { gap: 50, size: 19 })
      },
      ohren(g) {
        ball(g, 180, 460, 70, { w: 3 })
        for (const k of [-1, 1]) ink(g, E(180 + k * 74, 460, 10, 20), { w: 2.6, d: 400, t: 300 })
        arrow(g, L([340, 380], [262, 450]), { w: 2.4, d: 700, t: 400, head: 9 })
        text(g, 180, 600, 'rechts minimal früher', { anchor: 'middle', cls: 's', d: 1000 })
      },
      kopfhoerer(g) {
        ball(g, 180, 460, 60, { w: 3 })
        ink(g, B([110, 450], [110, 360], [250, 360], [250, 450]), { w: 3, d: 300, t: 500 })
        for (const k of [-1, 1]) ink(g, RR(180 + k * 70 - 12, 430, 24, 50, 8), { w: 2.6, d: 500, t: 300 })
        text(g, 60, 560, 'Text 1', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 300, 560, 'Text 2', { anchor: 'middle', cls: 's', d: 900 })
      },
      name(g) {
        ball(g, 180, 460, 60, { w: 3 })
        for (const k of [-1, 1]) ink(g, RR(180 + k * 70 - 12, 430, 24, 50, 8), { w: 2.6, d: 200, t: 300 })
        bubble(g, 220, 330, 120, 50, 'l', 600)
        text(g, 280, 362, '… dein Name …', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 180, 580, 'eigener Name: man horcht auf', { anchor: 'middle', cls: 's', d: 1100 })
      },
      filter(g) {
        ink(g, [[60, 360], [300, 360], [200, 480], [200, 560], [160, 560], [160, 480], [60, 360]], { w: 3, t: 900 })
        for (let i = 0; i < 8; i++) ink(g, waveP(70 + i * 28, 90 + i * 28, 330, 3, 8), { w: 1.4, d: 300 + i * 50, t: 150 })
        text(g, 180, 600, 'nach Bedeutung gefiltert', { anchor: 'middle', cls: 's', d: 1200 })
      },
      alter(g) {
        fig(g, 110, 600, 4)
        ink(g, B([92, 470], [80, 470], [80, 490], [92, 490]), { w: 2, d: 500, t: 200 })
        for (let i = 0; i < 4; i++) bubble(g, 170 + (i % 2) * 80, 360 + Math.floor(i / 2) * 70, 60, 36, 'l', 700 + i * 100)
        text(g, 180, 650, 'mit dem Alter anstrengender', { anchor: 'middle', cls: 's', d: 1200 })
      },
      stimme(g) {
        ink(g, waveP(30, 330, 400, 26, 60), { w: 3, t: 900 })
        ink(g, waveP(30, 330, 520, 10, 34), { w: 1.6, d: 400, t: 900 })
        text(g, 30, 360, 'gesuchte Stimme', { cls: 's', d: 600 })
        text(g, 30, 580, 'die anderen', { cls: 's', d: 800 })
        text(g, 180, 640, 'Hirnaktivität folgt der gesuchten Stimme', { anchor: 'middle', cls: 's', d: 1200 })
      },
      vertraut(g) {
        fig(g, 90, 600, 3.6)
        fig(g, 180, 600, 3.6, { d: 200 })
        heart(g, 135, 420, 0.6, 600)
        text(g, 180, 650, 'vertraute Stimmen hört man leichter heraus', { anchor: 'middle', cls: 's', d: 1000 })
      },
      lippen(g) {
        eye(g, 120, 420, 1)
        eye(g, 240, 420, 1, 200)
        const m: P[] = [...B([120, 540], [150, 510], [210, 510], [240, 540]), ...B([240, 540], [210, 580], [150, 580], [120, 540]).slice(1)]
        ink(g, m, { w: 3, d: 500, t: 600 })
        text(g, 180, 630, 'Hinschauen hilft beim Verstehen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      baby(g) {
        ball(g, 180, 470, 80, { w: 3 })
        for (const x of [150, 210]) dot(g, x, 460, 5, 500)
        ink(g, B([160, 500], [172, 512], [188, 512], [200, 500]), { w: 2.2, d: 600, t: 200 })
        text(g, 180, 600, 'Babys: erkennen ihren Namen früh', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        ball(g, 180, 480, 60, { w: 3 })
        for (const k of [-1, 1]) ink(g, E(180 + k * 64, 480, 9, 18), { w: 2.6, d: 400, t: 300 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Auf einer Party reden alle durcheinander. Trotzdem kannst du **einer Person** zuhören und den Rest ausblenden.', 64), gfx: { zuhoeren: {} } },
      { t: T('Das ist der **Cocktailparty-Effekt** – benannt 1953 vom britischen Forscher Colin Cherry.', 64), gfx: { cherry: {} } },
      { t: T('Dein Gehirn nutzt dafür viele **Hinweise** gleichzeitig.', 64), gfx: { hinweise: {} } },
      { t: T('Zwei Ohren helfen: Der Schall erreicht ein Ohr **minimal früher** – Bruchteile einer Millisekunde. Daraus berechnet das Gehirn die Richtung.', 64), gfx: { ohren: {} } },
      { t: T('Cherry spielte Leuten über Kopfhörer zwei Texte gleichzeitig vor, einen pro Ohr. Sie sollten **einen** davon laut nachsprechen.', 64), gfx: { kopfhoerer: {} } },
      { t: T('Vom anderen Ohr bekamen sie fast nichts mit – nicht einmal, wenn dort plötzlich eine **andere Sprache** lief.', 64), gfx: { kopfhoerer: {} } },
      { t: T('Aber: Fiel auf dem ignorierten Ohr der **eigene Name**, horchten viele plötzlich auf.', 64), gfx: { name: {} } },
      { t: T('Das Gehirn hört also im Hintergrund doch zu – und filtert nach **Bedeutung**. Wichtiges darf durch.', 64), gfx: { filter: {} } },
      { t: T('Babys erkennen ihren Namen schon mit wenigen Monaten. Im Stimmengewirr brauchen sie ihn aber **deutlich lauter** als Erwachsene.', 64), gfx: { baby: {} } },
      { t: T('Hirnmessungen zeigen: Die Aktivität im Hörzentrum folgt dem Rhythmus der **Stimme**, der du zuhörst – die anderen werden gedämpft.', 64), gfx: { stimme: {} } },
      { t: T('Vertraute Stimmen, etwa die des Partners, lassen sich **leichter** heraushören. Zwei ähnliche Stimmen verwechselt das Gehirn eher.', 64), gfx: { vertraut: {} } },
      { t: T('Mit dem Alter oder bei Hörverlust wird das Filtern schwerer: Gespräche in vollen Räumen werden **anstrengend**.', 64), gfx: { alter: {} } },
      { t: T('Hörgeräte versuchen, den Effekt nachzubauen – mit Mikrofonen, die vor allem **nach vorn** hören.', 64), gfx: { ohren: {} } },
      { t: T('Computer scheiterten lange daran, Stimmen zu **trennen**. Moderne KI schafft es inzwischen immer besser.', 64), gfx: { hinweise: {} } },
      { t: T('Viele Restaurants sind laut, weil **harte Flächen** den Schall zurückwerfen. Teppiche, Vorhänge und Polster schlucken ihn.', 480), gfx: { party: {} } },
      { t: T('Ein Tipp für laute Räume: **Hinschauen**. Wer die Lippen sieht, versteht messbar mehr.', 64), gfx: { lippen: {} } },
      { t: T('Dein Gehirn ist ein **Filter**, der deinen Namen nie ganz ausblendet.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Das Gehirn trennt Stimmen nach Richtung, Klang, Lippenbewegung und Sinn.', 'Ignorierte Gespräche werden trotzdem grob mitverarbeitet – der eigene Name dringt durch.', 'Hinschauen hilft im Lärm; Alter und Hörverlust erschweren das Filtern.'],
    sources: ['Cherry 1953, Journal of the Acoustical Society of America 25', 'Moray 1959, Quarterly Journal of Experimental Psychology 11', 'Newman 2005, Developmental Psychology 41'],
  },
  {
    id: 'zeit-alter',
    area: 'PSY',
    day: 55,
    hook: 'Warum vergeht die Zeit im Alter immer schneller?',
    mood: 'ruhig',
    ambience: 'uhr',
    images: [img('taschenuhr'), img('strand')],
    draw: {
      uhr(g) {
        clock(g, 180, 250, 120, 300, 60)
      },
      ferien(g) {
        sun(g, 260, 360, 30)
        fig(g, 110, 600, 3, { arms: 'up' })
        for (const [y, d] of [[560, 400], [600, 500]] as const) ink(g, waveP(20, 340, y, 5, 50), { w: 2.2, d, t: 700 })
        text(g, 180, 650, 'damals: eine Ewigkeit', { anchor: 'middle', cls: 's', d: 1100 })
      },
      anteil(g) {
        vbars(g, [
          { label: 'mit 5 Jahren', v: 20, fmt: (v) => `${Math.round(v)} %` },
          { label: 'mit 50 Jahren', v: 2, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
        text(g, 180, 320, 'ein Jahr als Anteil des Lebens', { anchor: 'middle', cls: 's', d: 1200 })
      },
      neues(g) {
        bullets(g, 50, 380, ['erster Schultag', 'erstes Mal am Meer', 'erstes Fahrrad', 'erster Schnee'], { gap: 50, size: 19 })
      },
      erinnerung(g) {
        for (let i = 0; i < 14; i++) dot(g, 40 + i * 21, 420 + (i % 3) * 14, 5, i * 60)
        text(g, 180, 380, 'viele Erinnerungen: lang', { anchor: 'middle', cls: 's', d: 300 })
        for (let i = 0; i < 3; i++) dot(g, 120 + i * 60, 560, 5, 1100 + i * 100)
        text(g, 180, 520, 'wenige Erinnerungen: kurz', { anchor: 'middle', cls: 's', d: 1000 })
      },
      routine(g) {
        for (let i = 0; i < 5; i++) {
          const x = 40 + i * 62
          ink(g, RR(x, 420, 50, 80, 6), { w: 2.2, d: i * 150, t: 300 })
          ink(g, L([x + 10, 450], [x + 40, 450]), { w: 1.6, d: i * 150 + 200, t: 100 })
          ink(g, L([x + 10, 470], [x + 40, 470]), { w: 1.6, d: i * 150 + 250, t: 100 })
        }
        text(g, 180, 560, 'gleiche Tage verschmelzen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      urlaub(g) {
        for (const [x0, n, a, b, d] of [[30, 'Urlaub', 'im Moment: schnell', 'im Rückblick: lang', 0], [190, 'Wartezimmer', 'im Moment: zäh', 'im Rückblick: kurz', 600]] as const) {
          ink(g, RR(x0, 380, 140, 160, 12), { w: 2.6, d, t: 500 })
          text(g, x0 + 70, 420, n, { anchor: 'middle', d: d + 200 })
          text(g, x0 + 70, 470, a, { anchor: 'middle', cls: 's', d: d + 300 })
          text(g, x0 + 70, 500, b, { anchor: 'middle', cls: 's', d: d + 400 })
        }
      },
      takt(g) {
        brain(g, 180, 440, 1)
        for (let i = 0; i < 6; i++) ink(g, RR(60 + i * 42, 560, 30, 40, 4), { w: 1.8, d: 900 + i * 80, t: 150 })
        text(g, 180, 640, 'Hypothese: weniger „Bilder“ pro Sekunde', { anchor: 'middle', cls: 's', d: 1400 })
      },
      fall(g) {
        ink(g, L([60, 330], [60, 620]), { w: 2.6, t: 600 })
        ink(g, L([40, 330], [120, 330]), { w: 2.6, d: 200, t: 300 })
        fig(g, 200, 450, 3, { arms: 'up', d: 400 })
        arrow(g, L([260, 380], [260, 520]), { w: 2.6, d: 700, t: 400, head: 9 })
        text(g, 180, 650, 'Schreck: dichtere Erinnerung, nicht schnelleres Sehen', { anchor: 'middle', cls: 's', d: 1100 })
      },
      huegel(g) {
        axes(g, 30, 600, 330, 330, { xl: 'Alter', yl: 'Erinnerungen' })
        plot(g, 36, 596, 280, 220, (t) => 0.2 + 0.7 * Math.exp(-Math.pow((t - 0.3) / 0.12, 2)), { d: 400 })
        text(g, 120, 380, '15 bis 25', { anchor: 'middle', cls: 's', d: 1300 })
      },
      gegen(g) {
        bullets(g, 50, 380, ['neue Orte', 'neue Hobbys', 'neue Menschen', 'anderer Weg zur Arbeit'], { gap: 50, size: 19 })
      },
      tagebuch(g) {
        ink(g, RR(100, 360, 160, 220, 8), { w: 3, t: 700 })
        ink(g, L([120, 360], [120, 580]), { w: 2, d: 300, t: 400 })
        for (let i = 0; i < 6; i++) ink(g, L([136, 400 + i * 28], [240, 400 + i * 28]), { w: 1.4, d: 500 + i * 80, t: 200 })
        text(g, 180, 630, 'mehr Erinnerungen, vollere Monate', { anchor: 'middle', cls: 's', d: 1100 })
      },
      achtsam(g) {
        eye(g, 180, 460, 2.2)
        text(g, 180, 600, 'bewusst wahrnehmen: mehr Details', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ende(g) {
        clock(g, 180, 500, 80, 120, 300)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Als Kind dauerten Sommerferien eine **Ewigkeit**. Heute ist plötzlich schon wieder Dezember.', 64), gfx: { ferien: {} } },
      { t: T('Fast alle Erwachsenen erleben das. Die Forschung hat dafür mehrere **Erklärungen**.', 64), gfx: { uhr: { tf: [0.6, 72, 250] } } },
      { t: T('Erstens: der **Anteil**. Für ein fünfjähriges Kind ist ein Jahr ein Fünftel seines Lebens – für einen Fünfzigjährigen nur ein Fünfzigstel.', 64), gfx: { anteil: {} } },
      { t: T('Zweitens: **Neues**. Kinder erleben ständig etwas zum ersten Mal – und das Gehirn speichert Erstes besonders gut.', 64), gfx: { neues: {} } },
      { t: T('Im Rückblick schätzen wir Zeit nach der **Menge an Erinnerungen**. Viele Erinnerungen – die Zeit wirkt lang.', 64), gfx: { erinnerung: {} } },
      { t: T('Erwachsene leben mehr in **Routine**. Die Tage ähneln sich – und das Gedächtnis fasst sie zu wenigen Erinnerungen zusammen.', 64), gfx: { routine: {} } },
      { t: T('Das erklärt das **Urlaubsparadox**: Eine Woche voller Neuem vergeht im Moment schnell, wirkt im Rückblick aber lang.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Umgekehrt zieht sich ein langweiliger Tag endlos – und schrumpft in der Erinnerung **fast auf nichts**.', 64), gfx: { urlaub: {} } },
      { t: T('In Gefahr scheint die Zeit stillzustehen. Versuche beim freien Fall zeigten aber: Wir sehen nicht schneller – wir erinnern uns **dichter**.', 64), gfx: { fall: {} } },
      { t: T('Die Jahre zwischen 15 und 25 nehmen im Gedächtnis besonders viel Raum ein – Forscher sprechen vom **Erinnerungshügel**.', 64), gfx: { huegel: {} } },
      { t: T('Drittens, eher eine Vermutung: Das Gehirn verarbeitet mit den Jahren womöglich **weniger Eindrücke** pro Sekunde.', 64), gfx: { takt: {} } },
      { t: T('Befragt man Menschen, rasen vor allem die **Jahre**. Wie schnell eine einzelne Stunde vergeht, empfinden Junge und Alte ähnlich.', 64), gfx: { uhr: { tf: [0.6, 72, 250] } } },
      { t: T('Was lässt sich tun? Neues erleben: Neue Orte, neue Hobbys, neue Menschen füllen das **Gedächtnis**.', 64), gfx: { gegen: {} } },
      { t: T('Schon kleine Abweichungen helfen: **ein anderer Weg** zur Arbeit, ein neues Rezept, ein freier Tag ohne Plan.', 64), gfx: { gegen: {} } },
      { t: T('Auch Aufschreiben hilft: Wer **Tagebuch** führt, erinnert sich an mehr – die Monate wirken voller.', 64), gfx: { tagebuch: {} } },
      { t: T('Und bewusstes Wahrnehmen: Wer genau hinschaut, speichert **mehr Details**.', 64), gfx: { achtsam: {} } },
      { t: T('Zeit wird lang durch **Erinnerungen** – nicht durch Stunden.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein Jahr ist für Kinder ein viel größerer Teil des Lebens.', 'Im Rückblick messen wir Zeit an der Zahl der Erinnerungen – Routine verkürzt, Neues verlängert.', 'Neues erleben, Tagebuch, bewusstes Wahrnehmen lassen Zeit voller wirken.'],
    sources: ['Wittmann & Lehnhoff 2005, Psychological Reports 97', 'Friedman & Janssen 2010, Acta Psychologica 134', 'Bejan 2019, European Review 27 (Hypothese)'],
  },
]
