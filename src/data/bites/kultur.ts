import type { Bite } from '../feed'
import { img } from './img'
import {
  B, E, HOOK, L, RR, T, arrow, bigText, blank, clock, crowd, dashes, eye, fig, group, hatch, ink, mk, pop, rays, st, text, timeline, vbars, type P,
} from './draw'
import { recap } from './common'

// Kultur, Kunst & Sprache: Literatur & Mythen, Kunst & Musik

const none = () => ''

/** Ohr (rechts von der Mitte gesehen); Läppchen bzw. ganzes Ohr als Fläche */
function ear(g: Element, cx: number, cy: number, s = 1, d = 0): P[] {
  const o: P[] = [
    ...B([cx - 30 * s, cy - 60 * s], [cx + 10 * s, cy - 110 * s], [cx + 70 * s, cy - 70 * s], [cx + 50 * s, cy - 10 * s]),
    ...B([cx + 50 * s, cy - 10 * s], [cx + 40 * s, cy + 20 * s], [cx + 20 * s, cy + 30 * s], [cx + 20 * s, cy + 60 * s]).slice(1),
    ...B([cx + 20 * s, cy + 60 * s], [cx + 20 * s, cy + 90 * s], [cx - 20 * s, cy + 90 * s], [cx - 24 * s, cy + 60 * s]).slice(1),
  ]
  ink(g, o, { w: 3.2, d, t: 900 })
  ink(g, B([cx - 4 * s, cy - 40 * s], [cx + 20 * s, cy - 70 * s], [cx + 46 * s, cy - 40 * s], [cx + 20 * s, cy]), { w: 2.2, d: d + 600, t: 500 })
  return o
}

/** Taube */
function dove(g: Element, x: number, y: number, s = 1, d = 0): void {
  const body: P[] = [...B([x - 30 * s, y], [x - 10 * s, y - 20 * s], [x + 20 * s, y - 18 * s], [x + 32 * s, y - 6 * s]), ...B([x + 32 * s, y - 6 * s], [x + 20 * s, y + 10 * s], [x - 10 * s, y + 12 * s], [x - 30 * s, y]).slice(1)]
  blank(g, body)
  ink(g, body, { w: 2.6, d, t: 500 })
  ink(g, E(x + 30 * s, y - 12 * s, 9 * s), { w: 2.4, d: d + 200, t: 300 })
  ink(g, [[x + 38 * s, y - 14 * s], [x + 48 * s, y - 10 * s], [x + 38 * s, y - 8 * s]], { w: 2, d: d + 300, t: 150 })
  const wing: P[] = [[x - 6 * s, y - 10 * s], [x + 4 * s, y - 50 * s], [x + 16 * s, y - 14 * s]]
  hatch(g, wing, d + 400, true)
  ink(g, wing, { w: 2.2, d: d + 300, t: 300 })
  ink(g, [[x - 30 * s, y], [x - 50 * s, y - 8 * s], [x - 46 * s, y + 6 * s], [x - 30 * s, y]], { w: 2.2, d: d + 300, t: 300 })
}

/** Musiknote */
function note(g: Element, x: number, y: number, s = 1, d = 0): void {
  hatch(g, E(x, y, 9 * s, 7 * s), d + 200, true)
  ink(g, E(x, y, 9 * s, 7 * s), { w: 2.4, d, t: 200 })
  ink(g, L([x + 9 * s, y], [x + 9 * s, y - 40 * s]), { w: 2.6, d: d + 150, t: 200 })
  ink(g, B([x + 9 * s, y - 40 * s], [x + 20 * s, y - 34 * s], [x + 22 * s, y - 26 * s], [x + 18 * s, y - 18 * s]), { w: 2.4, d: d + 300, t: 200 })
}

export const KULTUR: Bite[] = [
  {
    id: 'achillesferse',
    area: 'LIT',
    day: 20,
    hook: 'Steht die Achillesferse bei Homer?',
    mood: 'episch',
    images: [img('rubens-thetis'), img('laeufer')],
    draw: {
      duell(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        fig(pop(g, 200), 110, 598, 3.4, { arms: 'push' })
        fig(pop(g, 400), 250, 598, 3.4, { arms: 'push' })
        ink(g, L([60, 470], [200, 520]), { w: 3, d: 800, t: 300 })
        ink(g, L([300, 470], [170, 520]), { w: 3, d: 900, t: 300 })
        for (const [x, d] of [[80, 1000], [280, 1100]] as const) {
          hatch(g, E(x, 520, 26, 34), d + 300, true)
          ink(g, E(x, 520, 26, 34), { w: 2.8, d, t: 400 })
        }
        text(g, 110, 640, 'Achilles', { anchor: 'middle', d: 1200 })
        text(g, 250, 640, 'Hektor', { anchor: 'middle', d: 1300 })
      },
      rolle(g) {
        ink(g, RR(70, 260, 220, 260, 10), { w: 3, t: 700 })
        for (const y of [260, 520]) for (const x of [70, 290]) ink(g, E(x, y, 12, 14), { w: 2.6, d: 200, t: 300 })
        text(g, 180, 300, 'ILIAS', { anchor: 'middle', size: 24, cls: 'serif', d: 400 })
        for (let k = 0; k < 7; k++) ink(g, L([100, 330 + k * 24], [k === 6 ? 200 : 260, 330 + k * 24]), { w: 1.6, d: 500 + k * 100, t: 200 })
        const lupe = st(g, 'float')
        ink(lupe, E(250, 430, 46), { w: 3.4, d: 1000, t: 500 })
        ink(lupe, L([284, 462], [322, 500]), { w: 6, d: 1400, t: 300 })
        const no = st(g, 'f1', '--dl:300ms')
        text(no, 180, 580, 'keine Ferse, kein Tod', { anchor: 'middle', fade: false, size: 19 })
      },
      zeit(g) {
        timeline(g, 30, 330, 430, [
          { at: 0.08, label: 'um 700 v. Chr.', sub: 'Homer', up: true },
          { at: 0.92, label: 'um 90 n. Chr.', sub: 'Statius', up: true, big: true },
        ], 0, 900)
        bigText(g, 180, 560, '800 Jahre', { size: 54, d: 1600 })
      },
      kette(g) {
        for (let k = 0; k < 6; k++) {
          const x = 30 + k * 52
          const weak = k === 3
          const gr = st(g, weak ? '' : k > 3 ? 'm1' : '', k > 3 ? '--m1: translate(24px, 30px) rotate(8deg); --dl: 900ms' : '')
          if (weak) {
            hatch(gr, E(x + 26, 400, 30, 18), 600, true)
            ink(gr, E(x + 26, 400, 30, 18, 20, 160), { w: 3, d: k * 120, t: 300 })
            ink(gr, E(x + 26, 400, 30, 18, 200, 340), { w: 3, d: k * 120, t: 300 })
          } else ink(gr, E(x + 26, 400, 30, 18), { w: 3, d: k * 120, t: 400 })
        }
        text(g, 180, 500, 'die Schwachstelle', { anchor: 'middle', d: 1200 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 380, enter: 'blot', cam: [50, 55, 1.05], cam2: [50, 55, 1.2], cap: 'Rubens, Thetis taucht Achilles in den Styx' } } },
      { t: T('Achilles ist der größte Held der **Ilias**: Vor Troja tötet er Hektor.', 64), gfx: { duell: {} } },
      { t: T('Die Ilias erzählt nur rund **50 Tage** aus dem zehnjährigen Trojanischen Krieg.', 64), gfx: { zahl: { args: ['50', 'Tage aus zehn Jahren Krieg', 420] } } },
      { t: T('Sie entstand wohl im 8. oder 7. Jahrhundert v. Chr. – mit über **15.000** Versen.', 64), gfx: { z1: { draw: 'zahl', args: ['15.693', 'Verse der Ilias', 420] } } },
      { t: T('Doch Homer erwähnt nirgends eine verwundbare Ferse – und Achilles’ **Tod** kommt in der Ilias gar nicht vor.', 64), gfx: { rolle: { cls: 'a1' } } },
      { t: T('Sein Tod durch einen Pfeil des Paris wird erst anderswo erzählt. In der Ilias **kündigt** ihn der sterbende Hektor nur an.', 64), gfx: { rolle: { cls: 'a1' } } },
      { t: T('Worum es in der Ilias wirklich geht:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Ilias', '=', 'Zorn des Achilles', '+', 'Tod Hektors'], 330] } } },
      {
        t: T('Das **Bad im Styx**: Seine Mutter Thetis taucht das Baby in den Unterweltfluss – nur die Ferse, an der sie es hält, bleibt trocken.', 430),
        pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 360, cam: [48, 62, 1.8], cam2: [48, 64, 2.1] } },
      },
      { t: T('Ältere Fassungen erzählen es anders: Thetis hielt ihn ins **Feuer**, um ihn unsterblich zu machen.', 430), pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 350, cam: [48, 62, 1.8] } } },
      { t: T('Diese Geschichte steht erst beim römischen Dichter **Statius**.', 64), gfx: { zeit: {} } },
      { t: T('Statius schrieb um 95 n. Chr. die „**Achilleis**“ – unvollendet, er starb vorher.', 64), gfx: { z2: { draw: 'zahl', args: ['95 n. Chr.', 'Statius, Achilleis', 420] } } },
      { t: T('Die Ferse ist also eine **spätere** Zutat:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Homer: keine Ferse', '+', '800 Jahre', '→', 'Statius: Bad im Styx'], 320] } } },
      { t: T('Heute heißt jede **Schwachstelle** Achillesferse.', 64), gfx: { kette: { cls: 'a1' } } },
      { t: T('Heute sagt man etwa: „Die **Finanzierung** ist die Achillesferse des Plans.“', 64, { kind: 'mid' }), gfx: { kette: { cls: 'a1' } } },
      {
        t: T('Und die Sehne über deiner Ferse heißt Achillessehne – die **kräftigste** Sehne im ganzen Körper.', 486),
        pics: { l: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [45, 70, 1.4], cam2: [45, 72, 1.7] } },
      },
      { t: T('Die Sehne verbindet Wadenmuskel und Ferse:', 64, { kind: 'big' }), gfx: { f3: { draw: 'formel', args: [['Wadenmuskel', '→', 'Achillessehne', '→', 'Fersenbein'], 330] } } },
      { t: T('Beim Laufen hält sie ein **Vielfaches** des Körpergewichts aus. Reißt sie, kann man kaum noch auf Zehenspitzen stehen.', 64), gfx: { z3: { draw: 'zahl', args: ['10 ×', 'Körpergewicht trägt sie beim Laufen', 420] } } },
      { t: T('Achilles war Sohn der Meeresgöttin **Thetis** und des Königs Peleus – halb göttlich, halb sterblich.', 450), pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [55, 30, 1.6] } } },
      { t: T('Den Namen „Achillessehne“ gab ihr erst **1693** der flämische Anatom Philip Verheyen.', 64), gfx: { z4: { draw: 'zahl', args: ['1693', 'Name „Achillessehne“', 420] } } },
      recap(
        [{ pic: 0, id: 'r', cam: [48, 62, 1.4] }, { gfx: 'rolle', cls: 'a1' }, { gfx: 'zeit' }, { gfx: 'kette', cls: 'a1' }],
        ['Styx-Bad: späte Sage', 'Ilias: keine Ferse', '800 Jahre später', 'heute: jede Schwachstelle'],
      ),
    ],
    summary: ['Ilias: keine Ferse, kein Tod des Achilles.', 'Das Styx-Bad erst bei Statius (1. Jh. n. Chr.).', 'Achillessehne: kräftigste Sehne des Körpers.'],
    sources: ['Statius, Achilleis I', 'Homer, Ilias'],
  },
  {
    id: 'shakespeare-woerter',
    area: 'LIT',
    day: 59,
    hook: 'Hat Shakespeare 1.700 Wörter erfunden?',
    mood: 'verspielt',
    images: [img('shakespeare'), img('globe-theatre')],
    draw: {
      woerter(g) {
        const ws: [number, number, string][] = [[90, 300, 'lonely'], [250, 280, 'swagger'], [130, 400, 'eyeball'], [260, 420, 'bedroom'], [100, 520, 'gossip'], [240, 540, 'fashionable']]
        ws.forEach(([x, y, w], i) => {
          const p = pop(g, 200 + i * 250, '50% 50%')
          text(p, x, y, w, { anchor: 'middle', size: 24, cls: 'it', fade: false })
        })
        text(g, 180, 630, 'angeblich 1.700 neue Wörter', { anchor: 'middle', d: 1800 })
      },
      eintrag(g) {
        ink(g, RR(40, 240, 280, 340, 12), { w: 3, t: 700 })
        ink(g, L([180, 240], [180, 580]), { w: 2, d: 300, t: 400 })
        text(g, 60, 290, 'lonely', { size: 24, cls: 'it', d: 600 })
        text(g, 60, 330, 'erster Beleg:', { cls: 's', d: 800 })
        text(st(g, 'h1', '--dl:300ms'), 60, 360, '1607', { size: 22, d: 900 })
        text(g, 60, 386, 'Shakespeare', { cls: 's', d: 1000 })
        for (let k = 0; k < 6; k++) ink(g, L([200, 290 + k * 30], [300, 290 + k * 30]), { w: 1.4, d: 700 + k * 80, t: 200 })
        const old = st(g, 'f1', '--dl:300ms')
        text(old, 60, 440, 'älter!', { size: 22, fade: false })
        text(old, 60, 466, 'andere Autoren', { cls: 's', fade: false })
      },
      monster(g) {
        const body: P[] = [...B([90, 560], [60, 400], [120, 280], [180, 280]), ...B([180, 280], [240, 280], [300, 400], [270, 560]).slice(1), [90, 560]]
        hatch(g, body, 700)
        ink(g, body, { w: 3.4, t: 900 })
        for (const x of [140, 220]) {
          blank(g, E(x, 370, 28, 22))
          eye(g, x, 370, 0.6, 700, 6)
        }
        ink(g, B([130, 460], [160, 490], [200, 490], [230, 460]), { w: 3, d: 1100, t: 300 })
        text(g, 180, 620, '„green-eyed monster“', { anchor: 'middle', size: 22, cls: 'it', d: 1300 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 384, enter: 'blot', cam: [50, 35, 1.1], cam2: [50, 32, 1.25], cap: 'Chandos-Porträt, um 1610' } } },
      { t: T('William Shakespeare, 1564 bis 1616, aus Stratford-upon-Avon: rund **37 Stücke** und 154 Sonette.', 64), gfx: { zahl: { args: ['154', 'Sonette', 420] } } },
      {
        t: { text: 'Die Zahl kursiert überall: Shakespeare habe das Englische um rund **1.700 Wörter** bereichert.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { s: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [50, 30, 1.6] } },
        gfx: { woerter: {} },
      },
      { t: T('Insgesamt benutzte er rund **20.000** verschiedene Wörter – sehr viel für seine Zeit.', 64), gfx: { z2: { draw: 'zahl', args: ['20.000', 'verschiedene Wörter in seinem Werk', 420] } } },
      { t: T('Das Problem: Das große Oxford-Wörterbuch nannte lange einfach die **früheste gedruckte** Stelle, die man kannte.', 64), gfx: { eintrag: {} } },
      { t: T('Und Shakespeare wurde besonders gründlich gelesen. Digitale Archive finden viele seiner „Erfindungen“ bei **älteren** Autoren.', 64), gfx: { eintrag: { cls: 'a1' } } },
      { t: T('Das Wörterbuch entstand ab 1857 mit Freiwilligen, die Bücher nach Belegen durchsuchten. Shakespeare lasen sie besonders **gründlich**.', 64), gfx: { eintrag: { cls: 'a1' } } },
      { t: T('Daraus folgt:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['erster Beleg im Wörterbuch', '≠', 'erfunden'], 330] } } },
      { t: T('Was bleibt, ist beeindruckend genug: Das Bild vom **„green-eyed monster“** für Eifersucht stammt von ihm.', 64), gfx: { monster: {} } },
      { t: T('Ähnlich früh belegt sind bei ihm „**wild-goose chase**“ – eine sinnlose Jagd – und „the world’s mine oyster“.', 64), gfx: { woerter: {} } },
      {
        t: T('Und „Sein oder Nichtsein“ zitiert auch im Deutschen jeder – aus **Hamlet**.', 486),
        pics: { g: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2], cap: 'Globe Theatre, London (Nachbau)' } },
      },
      { t: T('Das Globe Theatre öffnete 1599 – und brannte 1613 ab: Bei einer Aufführung traf ein **Kanonenschuss** das Strohdach.', 64), gfx: { z3: { draw: 'zahl', args: ['1613', 'Globe brennt ab', 420] } } },
      { t: T('Der Nachbau von 1997 steht nur wenige Hundert Meter vom **Original** entfernt.', 470), pics: { g: { img: 1, x: 16, y: 56, w: 328, h: 390, cam: [50, 40, 1.4] } } },
      { t: T('Ins Deutsche übertrugen ihn vor allem August Wilhelm **Schlegel** und Ludwig Tieck – von ihnen stammt „Sein oder Nichtsein“.', 64), gfx: { p2: { draw: 'punkte', args: [['August Wilhelm Schlegel', 'Ludwig Tieck', 'Dorothea Tieck', 'Wolf Graf Baudissin'], 300] } } },
      { t: T('Seine Stücke: Komödien, Tragödien, **Königsdramen**.', 64), gfx: { p3: { draw: 'punkte', args: [['Romeo und Julia', 'Hamlet', 'Macbeth', 'Ein Sommernachtstraum'], 300] } } },
      { t: T('Von ihm selbst sind nur **sechs Unterschriften** erhalten – kein Manuskript eines Stücks ist sicher von seiner Hand.', 64), gfx: { z4: { draw: 'zahl', args: ['6', 'Unterschriften erhalten', 420] } } },
      { t: T('Sein Werk überlebte, weil Freunde es 1623 sammelten: das „**First Folio**“.', 64), gfx: { z5: { draw: 'zahl', args: ['1623', 'First Folio', 420] } } },
      recap(
        [{ gfx: 'woerter' }, { gfx: 'eintrag', cls: 'a1' }, { gfx: 'monster' }, { pic: 1, id: 'g' }],
        ['angeblich 1.700 neue Wörter', 'erster Beleg ≠ erfunden', '„green-eyed monster“', 'Globe Theatre'],
      ),
    ],
    summary: ['Die 1.700-Wörter-Zahl beruht auf Erstbelegen.', 'Digitale Archive finden ältere Belege.', '„Green-eyed monster“ geht auf ihn zurück.'],
    sources: ['Oxford English Dictionary', 'Folger Shakespeare Library'],
  },
  {
    id: 'sisyphos',
    area: 'LIT',
    day: 20,
    hook: 'Macht sinnlose Arbeit unglücklich?',
    mood: 'dunkel',
    images: [img('tizian-sisyphos'), img('lego')],
    draw: {
      berg(g) {
        const hill: P[] = [[0, 620], [300, 300], [360, 300], [360, 620]]
        hatch(g, hill, 500)
        ink(g, L([0, 620], [300, 300]), { w: 3.4, t: 800 })
        ink(g, L([300, 300], [360, 300]), { w: 3.4, d: 700, t: 200 })
        const roll = group(g)
        hatch(roll, E(80, 518, 32), 600, true)
        ink(roll, E(80, 518, 32), { w: 3, d: 400, t: 500 })
        fig(roll, 30, 584, 2, { arms: 'push' })
        roll.animate(
          [
            { transform: 'translate(0, 0)' },
            { transform: 'translate(170px, -182px)', offset: 0.75 },
            { transform: 'translate(0, 0)' },
          ],
          { duration: 5200, delay: 900, iterations: Infinity, easing: 'ease-in-out' },
        )
      },
      turm(g) {
        ink(g, L([30, 600], [330, 600]), { w: 3, t: 500 })
        for (let k = 0; k < 6; k++) {
          const b = group(g)
          blank(b, RR(140, 600 - (k + 1) * 34, 80, 32, 4))
          hatch(b, RR(140, 600 - (k + 1) * 34, 80, 32, 4), 0, k % 2 === 1)
          ink(b, RR(140, 600 - (k + 1) * 34, 80, 32, 4), { w: 2.6, t: 0 })
          for (const x of [156, 196]) ink(b, RR(x, 600 - (k + 1) * 34 - 8, 16, 8, 2), { w: 2, t: 0 })
          b.animate(
            [
              { transform: 'translate(0, -40px)', opacity: 0 },
              { transform: 'translate(0, 0)', opacity: 1, offset: 0.08 + k * 0.06 },
              { transform: 'translate(0, 0)', opacity: 1, offset: 0.7 },
              { transform: `translate(${(k % 2 ? 1 : -1) * (40 + k * 20)}px, ${k * 34}px) rotate(${(k % 2 ? 1 : -1) * 30}deg)`, opacity: 1, offset: 0.85 },
              { transform: `translate(${(k % 2 ? 1 : -1) * (40 + k * 20)}px, ${k * 34}px) rotate(${(k % 2 ? 1 : -1) * 30}deg)`, opacity: 0 },
            ],
            { duration: 5000, delay: 300, iterations: Infinity },
          )
        }
      },
      ergebnis(g) {
        vbars(g, [
          { label: 'Figuren bleiben', v: 10.6, fmt: (v) => v.toFixed(1).replace('.', ',') },
          { label: 'werden zerlegt', v: 7.2, fmt: (v) => v.toFixed(1).replace('.', ','), dense: true },
        ], { x: 70, base: 580, w: 90, gap: 130, h: 300, max: 12 })
        text(g, 40, 240, 'gebaute Figuren im Schnitt', { cls: 's', d: 200 })
      },
      gipfel(g) {
        const hill: P[] = [[0, 620], [300, 300], [360, 300], [360, 620]]
        hatch(g, hill, 400)
        ink(g, L([0, 620], [300, 300]), { w: 3.4, t: 700 })
        ink(g, L([300, 300], [360, 300]), { w: 3.4, d: 600, t: 200 })
        hatch(g, E(280, 280, 22), 800, true)
        ink(g, E(280, 280, 22), { w: 3, d: 600, t: 400 })
        fig(pop(g, 900), 320, 298, 2, { arms: 'up' })
        rays(g, 320, 210, 30, 54, 10, 1300)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { t: { img: 0, x: 16, y: 56, w: 328, h: 384, enter: 'blot', cam: [50, 40, 1.05], cam2: [50, 40, 1.2], cap: 'Tizian, Sisyphos, 1549' } } },
      { t: T('In der Sage war Sisyphos König von **Korinth** – und ein Meister der List.', 450), pics: { t: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 30, 1.5] } } },
      { t: T('Er überlistete sogar den **Tod**: Er legte ihn in Ketten – niemand starb mehr. Dafür kam die Strafe mit dem Felsen.', 64), gfx: { berg: {} } },
      { t: T('Zur Strafe muss **Sisyphos** einen Felsen bergauf rollen – kurz vor dem Gipfel rollt er wieder hinab. Für immer.', 64), gfx: { berg: {} } },
      {
        t: T('Der Verhaltensökonom Dan Ariely testete das 2008: Studierende bauten **Lego-Figuren** gegen Geld.', 486),
        pics: { l: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [45, 50, 1.05], cam2: [45, 50, 1.25] } },
      },
      { t: T('Bei einer Gruppe wurden die fertigen Figuren vor ihren Augen wieder **zerlegt**.', 64), gfx: { turm: {} } },
      { t: T('Diese Gruppe hörte viel **früher** auf – bei gleichem Lohn.', 64), gfx: { ergebnis: {} } },
      { t: T('Bezahlt wurde pro Figur – mit jeder weiteren **weniger**:', 64), gfx: { f1: { draw: 'formel', args: [['1. Figur: 2,00 $', '→', '2. Figur: 1,89 $', '→', '3. Figur: 1,78 $'], 320] } } },
      { t: T('Selbst wer Lego liebte, gab in der Zerlege-Gruppe früh auf. Die **Freude** am Bauen half nur, wenn die Figuren blieben.', 64), gfx: { ergebnis: {} } },
      { t: T('Albert Camus deutete Sisyphos 1942 anders: Wer die Sinnlosigkeit erkennt und trotzdem weitermacht, ist **frei**.', 64, { kind: 'mid', w: 250 }), gfx: { gipfel: {} } },
      { t: T('Albert Camus, 1913 bis 1960, bekam **1957** den Literaturnobelpreis.', 64), gfx: { z2: { draw: 'zahl', args: ['1957', 'Literaturnobelpreis für Camus', 420] } } },
      { t: T('Sein Begriff ist das **Absurde**:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Mensch sucht Sinn', '+', 'Welt schweigt', '=', 'das Absurde'], 330] } } },
      { t: T('Seine Antwort: nicht aufgeben. _„Der Kampf gegen Gipfel vermag ein Menschenherz auszufüllen.“_', 64, { kind: 'mid', w: 250 }), gfx: { gipfel: {} } },
      {
        t: { text: '_„Wir müssen uns Sisyphos als einen glücklichen Menschen vorstellen.“_', x: 30, y: 420, w: 300, kind: 'big', center: true },
        pics: { t: { img: 0, x: 90, y: 70, w: 180, h: 300, cam: [50, 35, 1.2] } },
      },
      { t: T('Was hilft bei Arbeit, die sinnlos wirkt?', 64, { kind: 'big' }), gfx: { punkte: { args: [['das Ergebnis sehen', 'wissen, wofür', 'Anerkennung bekommen'], 320] } } },
      { t: T('Schon in Homers **Odyssee** sieht Odysseus ihn in der Unterwelt den Felsen rollen.', 64), gfx: { berg: {} } },
      { t: T('Daher das Wort:', 64, { kind: 'big' }), gfx: { f3: { draw: 'formel', args: [['Mühe', '+', 'kein Ende', '+', 'kein Sinn', '=', 'Sisyphusarbeit'], 330] } } },
      { t: T('Andere Studien zeigen: Wer **weiß, wem** seine Arbeit hilft, arbeitet ausdauernder – etwa Spendensammler nach einem Treffen mit Stipendiaten.', 64), gfx: { ergebnis: {} } },
      recap(
        [{ gfx: 'berg' }, { gfx: 'turm' }, { gfx: 'ergebnis' }, { pic: 0, id: 't', cam: [50, 35, 1.2] }],
        ['ewige, sinnlose Mühe', 'Figuren zerlegt', '10,6 zu 7,2 Figuren', 'Camus: glücklich trotzdem'],
      ),
    ],
    summary: ['Sisyphos: ewige, sinnlose Mühe.', 'Lego-Experiment: Sinn hält länger bei der Arbeit.', 'Camus: Sisyphos als glücklicher Mensch.'],
    sources: ['Ariely, Kamenica & Prelec 2008, J Econ Behav Organ', 'Camus 1942, Der Mythos des Sisyphos'],
  },
  {
    id: 'grimm',
    area: 'LIT',
    day: 48,
    hook: 'Waren Grimms Märchen früher grausamer?',
    mood: 'raetsel',
    ambience: 'nacht',
    images: [img('maerchenwald'), img('grimm-brueder')],
    draw: {
      buch(g) {
        ink(g, RR(90, 260, 180, 250, 8), { w: 3.2, t: 700 })
        hatch(g, RR(90, 260, 24, 250, 8), 500, true)
        text(g, 192, 330, 'Kinder- und', { anchor: 'middle', cls: 'serif', size: 18, d: 600 })
        text(g, 192, 356, 'Hausmärchen', { anchor: 'middle', cls: 'serif', size: 18, d: 700 })
        text(g, 192, 440, '1812', { anchor: 'middle', size: 30, d: 900 })
        const lupe = st(g, 'x1', '--o:50% 50%;--dl:300ms')
        ink(lupe, E(280, 520, 34), { w: 3, t: 0 })
        ink(lupe, L([304, 544], [334, 574]), { w: 5, t: 0 })
        text(lupe, 180, 610, 'eher für Gelehrte', { anchor: 'middle', fade: false, size: 19 })
      },
      turm(g) {
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 500 })
        ink(g, RR(150, 260, 70, 360, 4), { w: 3.2, d: 200, t: 800 })
        hatch(g, RR(150, 260, 70, 360, 4), 700)
        ink(g, [[140, 260], [185, 190], [230, 260], [140, 260]], { w: 3, d: 600, t: 400 })
        blank(g, RR(168, 280, 34, 40, 14))
        ink(g, RR(168, 280, 34, 40, 14), { w: 2.6, d: 900, t: 300 })
        const hair = group(g)
        ink(hair, B([200, 316], [240, 400], [210, 500], [250, 610]), { w: 4, d: 1100, t: 900 })
        ink(hair, B([196, 316], [232, 400], [202, 500], [242, 610]), { w: 2, d: 1150, t: 900 })
        const labs = st(g, 'f1', '--dl:200ms')
        text(labs, 290, 360, '1812:', { anchor: 'middle', fade: false, size: 18 })
        text(labs, 290, 386, 'schwanger', { anchor: 'middle', fade: false, cls: 's' })
        text(labs, 290, 470, 'später:', { anchor: 'middle', fade: false, size: 18 })
        text(labs, 290, 496, '„schwerer', { anchor: 'middle', fade: false, cls: 's' })
        text(labs, 290, 514, 'heraufzuziehen“', { anchor: 'middle', fade: false, cls: 's' })
      },
      schuh(g) {
        const shoe: P[] = [
          [90, 440],
          [150, 440],
          ...B([150, 440], [200, 450], [270, 470], [310, 500]),
          ...B([310, 500], [260, 512], [180, 500], [140, 470]).slice(1),
          ...B([140, 470], [124, 470], [112, 474], [106, 480]).slice(1),
          [104, 540],
          [92, 540],
          [90, 440],
        ]
        hatch(g, shoe, 600)
        ink(g, shoe, { w: 3.2, t: 900 })
        for (let k = 0; k < 4; k++) {
          const dr = group(g)
          ink(dr, B([120 + k * 40, 510], [114 + k * 40, 524], [126 + k * 40, 524], [120 + k * 40, 510]), { w: 2.4, t: 0 })
          dr.animate([{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: 'translateY(70px)', opacity: 0 }], { duration: 1800, delay: 800 + k * 400, iterations: Infinity })
        }
        text(g, 180, 380, 'Zeh und Ferse ab', { anchor: 'middle', size: 20, d: 1000 })
      },
      tauben(g) {
        dove(g, 110, 380, 1.4, 0)
        dove(g, 250, 460, 1.4, 500)
        text(g, 180, 600, 'ab 1819', { anchor: 'middle', size: 24, d: 1200 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { w: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.25] } } },
      {
        t: T('1812 erschien die erste Ausgabe der **Kinder- und Hausmärchen**.', 476),
        pics: { g: { img: 1, x: 16, y: 56, w: 328, h: 384, enter: 'blot', cam: [50, 45, 1.1], cam2: [50, 45, 1.3], cap: 'Jacob und Wilhelm Grimm, gemalt 1855' } },
      },
      { t: T('Jacob und Wilhelm Grimm, geboren 1785 und 1786 in **Hanau** – Sprachforscher und Bibliothekare.', 450), pics: { g: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 40, 1.4] } } },
      { t: T('Sie sammelten vor allem bei **gebildeten** Bekannten in Kassel – nicht bei alten Bäuerinnen am Spinnrad.', 64), gfx: { buch: {} } },
      { t: T('Eine wichtige Erzählerin war **Dorothea Viehmann**, Tochter eines Gastwirts aus einer Hugenottenfamilie.', 64), gfx: { zahl: { args: ['40+', 'Märchen von Dorothea Viehmann', 420] } } },
      { t: T('Die Brüder Grimm wollten Volkspoesie bewahren – das Buch richtete sich eher an **Gelehrte** als an Kinder.', 64), gfx: { buch: { cls: 'a1' } } },
      { t: T('Bis 1857 erschienen sieben große Ausgaben – die Sammlung **wuchs** stark:', 64), gfx: { f1: { draw: 'formel', args: [['1812: 86 Märchen', '→', '1857: über 200'], 330] } } },
      { t: T('Spätere Ausgaben wurden kindgerechter, vor allem beim Thema **Sexualität**: Rapunzel verrät sich 1812, weil sie schwanger ist.', 64), gfx: { turm: { cls: 'a1', tf: [1, 0, 50] } } },
      { t: T('Wilhelm Grimm bearbeitete die Texte stark: mehr wörtliche Rede, mehr **Moral**, christlichere Töne.', 64), gfx: { p2: { draw: 'punkte', args: [['mehr wörtliche Rede', 'mehr Moral', 'christlichere Töne'], 320] } } },
      { t: T('Bei der **Gewalt** war es umgekehrt: In Aschenputtel hacken sich die Stiefschwestern schon 1812 Zeh und Ferse ab.', 64), gfx: { schuh: {} } },
      { t: T('Ab 1819 picken ihnen zusätzlich **Tauben** die Augen aus. Wilhelm Grimm fügte Strafen eher hinzu.', 64), gfx: { tauben: {} } },
      { t: T('Manches flog ganz raus – etwa „Wie Kinder Schlachtens miteinander gespielt haben“: zu **grausam**.', 64), gfx: { buch: {} } },
      { t: T('Die Kinder- und Hausmärchen gehören seit 2005 zum **Weltdokumentenerbe** der UNESCO.', 64), gfx: { z3: { draw: 'zahl', args: ['2005', 'UNESCO-Weltdokumentenerbe', 420] } } },
      { t: T('Nebenbei begannen die Brüder das **Deutsche Wörterbuch** – vollendet erst 1961.', 64), gfx: { z4: { draw: 'zahl', args: ['1961', 'Deutsches Wörterbuch vollendet', 420] } } },
      { t: T('Aschenputtel gibt es weltweit in Hunderten Fassungen – die älteste bekannte stammt aus **China**, um 850.', 64), gfx: { z5: { draw: 'zahl', args: ['um 850', 'älteste Aschenputtel-Fassung, China', 420] } } },
      { t: T('Disney machte daraus 1950 einen Zeichentrickfilm – ganz ohne abgehackte **Zehen**.', 64), gfx: { schuh: {} } },
      { t: T('Grimms Märchen gibt es in über **160 Sprachen** – eines der meistübersetzten deutschen Bücher.', 64), gfx: { z6: { draw: 'zahl', args: ['160+', 'Sprachen', 420] } } },
      { t: T('Was am Ende entstand:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Volksmärchen', '+', 'Wilhelms Bearbeitung', '=', 'Grimms Märchen'], 330] } } },
      recap(
        [{ gfx: 'buch', cls: 'a1' }, { gfx: 'turm', cls: 'a1' }, { gfx: 'schuh' }, { gfx: 'tauben' }],
        ['1812: eher für Erwachsene', 'Sex entschärft', 'Gewalt blieb', 'Strafen kamen dazu'],
      ),
    ],
    summary: ['Erste Ausgabe 1812, eher für Erwachsene.', 'Entschärft: Rapunzels Schwangerschaft.', 'Verschärft: Tauben picken ab 1819 Augen aus.'],
    sources: ['Grimm, Kinder- und Hausmärchen, Ausgaben 1812 und 1819', 'Tatar 2003, The Hard Facts of the Grimms’ Fairy Tales'],
  },
  {
    id: 'mona-lisa',
    area: 'KUL',
    day: 13,
    hook: 'Folgen dir Mona Lisas Augen durch den Raum?',
    mood: 'raetsel',
    ambience: 'stadt',
    images: [img('mona-lisa'), img('mona-lisa-louvre')],
    draw: {
      raum(g) {
        ink(g, L([40, 250], [320, 250]), { w: 4, t: 500 })
        hatch(g, RR(140, 236, 80, 14, 3), 400, true)
        ink(g, RR(140, 236, 80, 14, 3), { w: 2.6, d: 300, t: 300 })
        const v = group(g)
        fig(v, 80, 560, 1.6)
        v.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(200px)' }], { duration: 3000, delay: 800, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        const line = group(g)
        dashes(line, L([180, 256], [80, 520]), { w: 2, t: 0 })
        line.style.transformOrigin = '180px 256px'
        line.style.transformBox = 'view-box'
        line.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-48deg)' }], { duration: 3000, delay: 800, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        text(g, 180, 620, 'Draufsicht', { anchor: 'middle', cls: 's', d: 600 })
      },
      winkel(g) {
        ink(g, L([40, 250], [320, 250]), { w: 4, t: 500 })
        hatch(g, RR(140, 236, 80, 14, 3), 400, true)
        fig(pop(g, 400), 180, 560, 1.6)
        dashes(g, L([180, 256], [180, 520]), { w: 1.6, d: 600 })
        const a = (75 * Math.PI) / 180
        arrow(g, L([180, 256], [180 + Math.cos(a) * 300, 256 + Math.sin(a) * 300]), { w: 3, d: 1000, t: 500 })
        ink(g, E(180, 256, 90, 90, 75, 90), { w: 2.4, d: 1600, t: 300 })
        text(g, 236, 372, '15°', { size: 26, d: 1800 })
      },
      flach(g) {
        ink(g, RR(120, 230, 120, 150, 6), { w: 3.2, t: 600 })
        ink(g, E(180, 300, 34, 42), { w: 2.8, d: 300, t: 500 })
        for (const x of [166, 194]) mk('circle', { cx: x, cy: 292, r: 4, class: 'k fade', style: '--d:700ms' }, g)
        ink(g, L([170, 324], [190, 324]), { w: 2.4, d: 800, t: 150 })
        for (const [x, d] of [[70, 900], [290, 1100]] as const) {
          fig(pop(g, d), x, 600, 1.6)
          dashes(g, L([180, 300], [x, 520]), { w: 1.6, d: d + 200 })
        }
        text(g, 180, 420, 'frontaler Blick', { anchor: 'middle', d: 600 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 30, 1.2], cam2: [50, 28, 1.4] } } },
      { t: T('Leonardo da Vinci malte sie ab etwa **1503** – und arbeitete jahrelang weiter daran.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 45, 1.0] } } },
      { t: T('Dargestellt ist wohl **Lisa Gherardini**, die Frau eines Florentiner Seidenhändlers.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 30, 1.6] } } },
      { t: T('Reiseführer behaupten seit Generationen: Ihr Blick **folgt** dir. Der Effekt heißt sogar Mona-Lisa-Effekt.', 64), gfx: { raum: {} } },
      {
        t: T('2019 prüften Forscher der Uni Bielefeld das bei der **Mona Lisa** selbst.', 486),
        pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 400, cam: [50, 28, 2.6], cam2: [50, 28, 3] } },
      },
      { t: T('24 Testpersonen sahen das Bild auf einem Bildschirm und zeigten mit einem **Lineal**, wohin der Blick geht.', 64), gfx: { raum: {} } },
      { t: T('Das Ergebnis:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Blick der Mona Lisa', '≈', '15,4 Grad nach rechts'], 330] } } },
      { t: T('Ergebnis: Sie schaut gar nicht dich an, sondern etwa **15 Grad** rechts an dir vorbei.', 64), gfx: { winkel: {} } },
      { t: T('Den Effekt gibt es trotzdem – bei Porträts, die **frontal** aus dem Bild blicken: Ein Bild ist flach, der Blick wandert nicht mit.', 64), gfx: { flach: {} } },
      { t: T('Bei echten Gesichtern merkt man sofort, wenn jemand **vorbeischaut** – das Gehirn liest Blicke extrem fein.', 64), gfx: { flach: {} } },
      {
        t: T('Und die Mona Lisa ist nur **77 × 53** Zentimeter groß.', 486, { kind: 'big' }),
        pics: { l: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } },
      },
      { t: T('1911 wurde sie **gestohlen** – von einem Glaser, der im Louvre gearbeitet hatte. Erst 1913 tauchte sie wieder auf.', 64), gfx: { z3: { draw: 'zahl', args: ['1911', 'gestohlen – 1913 zurück', 420] } } },
      { t: T('Erst der Diebstahl machte sie **weltberühmt**. Heute hängt sie hinter Panzerglas, Zehntausende sehen sie täglich.', 470), pics: { l: { img: 1, x: 16, y: 56, w: 328, h: 390, cam: [50, 45, 1.3] } } },
      { t: T('Zur Größe:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['77 cm', '×', '53 cm', '≈', 'zwischen DIN A2 und A1'], 330] } } },
      { t: T('Leonardo nahm das Bild mit nach **Frankreich** – so kam es in die Sammlung des Königs und später in den Louvre.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 45, 1.1] } } },
      { t: T('Er malte mit „**Sfumato**“: hauchdünne Farbschichten, keine harten Linien.', 64), gfx: { f3: { draw: 'formel', args: [['viele dünne Schichten', '→', 'weiche Übergänge', '=', 'Sfumato'], 330] } } },
      { t: T('Darum wirkt das **Lächeln** stärker, wenn du ihr in die Augen schaust – am Mund selbst scheint es zu verschwinden.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 34, 3.0] } } },
      { t: T('Und Augenbrauen hat sie **keine** – vielleicht verblasst, vielleicht nie gemalt.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 24, 3.4] } } },
      { t: T('Den Effekt mit den Augen kennt auch die Technik: Er tritt bei **Fotos** und Bildschirmen genauso auf.', 64), gfx: { flach: {} } },
      recap(
        [{ gfx: 'raum' }, { gfx: 'winkel' }, { gfx: 'flach' }, { pic: 0, id: 'm', cam: [50, 30, 1.3] }],
        ['angeblich folgt ihr Blick', 'tatsächlich 15° vorbei', 'Effekt bei Frontalblick', 'nur 77 × 53 cm'],
      ),
    ],
    summary: ['Frontal blickende Porträts „folgen“ dir.', 'Die Mona Lisa schaut 15° an dir vorbei.', '77 × 53 cm – kleiner als gedacht.'],
    sources: ['Horstmann & Loth 2019, i-Perception', 'Musée du Louvre'],
  },
  {
    id: 'van-gogh-ohr',
    area: 'KUL',
    day: 60,
    hook: 'Schnitt sich Van Gogh nur ein Ohrläppchen ab?',
    mood: 'dunkel',
    images: [img('van-gogh-verband'), img('van-gogh-sonnenblumen')],
    draw: {
      datum(g) {
        ink(g, RR(110, 250, 140, 160, 10), { w: 3, t: 600 })
        hatch(g, RR(110, 250, 140, 36, 10), 400, true)
        text(g, 180, 276, 'Dezember', { anchor: 'middle', size: 16, d: 500, cls: 'halo' })
        text(g, 180, 370, '23', { anchor: 'middle', size: 64, d: 700 })
        text(g, 180, 450, '1888, Arles', { anchor: 'middle', d: 900 })
        const r: P[] = [[120, 540], [250, 520], [256, 532], [126, 552], [120, 540]]
        ink(g, r, { w: 2.6, d: 1100, t: 400 })
        ink(g, RR(250, 512, 60, 14, 6), { w: 2.6, d: 1300, t: 300 })
        hatch(g, RR(250, 512, 60, 14, 6), 1500, true)
      },
      ohr(g) {
        const o = ear(g, 160, 400, 1.8, 0)
        const lobe = st(g, 'h2', '--dl:200ms')
        hatch(lobe, E(160, 528, 34, 28), 900, true)
        const whole = st(g, 'f2', '--dl:400ms')
        hatch(whole, o, 0, true)
        dashes(whole, L([80, 300], [130, 560]), { w: 2.6, t: 0 })
        const sk = st(g, 'f1', '--dl:200ms')
        text(sk, 300, 300, 'Félix Rey,', { anchor: 'middle', fade: false, cls: 's' })
        text(sk, 300, 318, 'Skizze 1889', { anchor: 'middle', fade: false, cls: 's' })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { v: { img: 0, x: 16, y: 56, w: 328, h: 384, enter: 'blot', cam: [50, 40, 1.05], cam2: [45, 40, 1.2], cap: 'Selbstbildnis mit verbundenem Ohr, 1889' } } },
      { t: T('Vincent van Gogh, 1853 bis 1890: Er malte in nur **zehn Jahren** über 2.000 Werke.', 64), gfx: { zahl: { args: ['2.000+', 'Werke in zehn Jahren', 420] } } },
      { t: T('Nach einem Streit mit Paul **Gauguin** verletzt sich Van Gogh mit einem Rasiermesser am linken Ohr.', 64), gfx: { datum: {} } },
      { t: T('Gauguin war nach Arles gekommen, um ein „**Atelier des Südens**“ zu gründen. Nach neun Wochen eskalierte der Streit.', 64), gfx: { f1: { draw: 'formel', args: [['9 Wochen', '+', 'zwei Dickköpfe', '=', 'Eskalation'], 330] } } },
      { t: T('Van Gogh brachte das Ohr in ein Haus in der Stadt und übergab es einer jungen Frau. Murphy fand heraus: Sie war dort **Magd**.', 64), gfx: { datum: {} } },
      { t: T('Lange hieß es: nur ein Stück vom **Ohrläppchen**.', 64), gfx: { ohr: {} } },
      { t: T('2016 fand die Forscherin Bernadette Murphy eine **Skizze** des behandelnden Arztes Félix Rey.', 64), gfx: { ohr: { cls: 'a1' } } },
      { t: T('Sie zeigt: Van Gogh schnitt fast das **ganze Ohr** ab.', 64, { kind: 'big' }), gfx: { ohr: { cls: 'a1 a2' } } },
      { t: T('Die Skizze steckte in einem **Brief** des Arztes an einen Schriftsteller, 1930 – Murphy fand sie in einem Archiv in Kalifornien.', 64), gfx: { ohr: { cls: 'a1 a2' } } },
      {
        t: T('Wochen später malte er sich mit Verband – **im Spiegel**, deshalb sitzt er auf dem Bild rechts.', 450),
        pics: { v: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [30, 45, 1.8], cam2: [30, 45, 2.1] } },
      },
      {
        t: T('Zu Lebzeiten verkaufte er kaum Bilder. Heute zählen seine **Sonnenblumen** zu den teuersten Gemälden der Welt.', 470),
        pics: { s: { img: 1, x: 16, y: 56, w: 328, h: 384, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 40, 1.2], cap: 'Vincent van Gogh, Sonnenblumen, 1888' } },
      },
      { t: T('Zu Lebzeiten verkaufte er nur **sehr wenige** Bilder. Sein Bruder Theo unterstützte ihn mit Geld.', 64), gfx: { zahl: { args: ['650+', 'Briefe an seinen Bruder Theo', 420] } } },
      { t: T('1987 wurde eine Fassung der Sonnenblumen für rund **40 Millionen Dollar** versteigert – damals Weltrekord.', 64), gfx: { z2: { draw: 'zahl', args: ['40 Mio. $', 'Auktion 1987', 420] } } },
      { t: T('Van Gogh starb 1890, mit nur **37 Jahren**, an einer Schussverletzung.', 450), pics: { v: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [55, 40, 1.4] } } },
      { t: T('Er war erst Kunsthändler und Prediger – mit dem Malen begann er erst mit **27 Jahren**.', 64), gfx: { z5: { draw: 'zahl', args: ['27', 'Jahre alt beim Start als Maler', 420] } } },
      { t: T('Seine Bilder leuchten durch dicken **Farbauftrag** – man nennt das Impasto.', 450), pics: { s: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 45, 2.2] } } },
      { t: T('1889 ging er in eine Nervenheilanstalt in Saint-Rémy – und malte dort die „**Sternennacht**“.', 64), gfx: { z6: { draw: 'zahl', args: ['1889', 'Sternennacht', 420] } } },
      { t: T('Woran er litt, ist unklar: Diskutiert werden **Epilepsie**, bipolare Störung, Alkohol.', 64), gfx: { p2: { draw: 'punkte', args: [['Epilepsie?', 'bipolare Störung?', 'Alkohol?'], 330] } } },
      recap(
        [{ gfx: 'datum' }, { gfx: 'ohr', cls: 'a1 a2' }, { pic: 0, id: 'v', cam: [30, 45, 1.4] }, { pic: 1, id: 's' }],
        ['Arles, 23.12.1888', 'fast das ganze Ohr', 'im Spiegel gemalt', 'heute Millionen wert'],
      ),
    ],
    summary: ['23. Dezember 1888, Arles, nach Streit mit Gauguin.', 'Die Arztskizze belegt: fast das ganze Ohr.', 'Im Spiegel gemalt – deshalb Verband rechts.'],
    sources: ['Murphy 2016, Van Gogh’s Ear', 'Van Gogh Museum Amsterdam'],
  },
  {
    id: 'mozart-effekt',
    area: 'KUL',
    day: 51,
    hook: 'Macht Mozart hören klüger?',
    mood: 'hell',
    images: [img('mozart'), img('geige')],
    draw: {
      noten(g) {
        for (let k = 0; k < 5; k++) {
          const n = group(g)
          note(n, 50 + k * 34, 300 + (k % 2) * 30, 1.1, k * 200)
          n.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }], { duration: 900 + k * 100, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        }
        arrow(g, L([220, 300], [260, 300]), { w: 2.6, d: 1000, t: 200 })
        const c: P[] = [[260, 330], [300, 310], [340, 330], [340, 380], [300, 400], [260, 380], [260, 330]]
        ink(g, c, { w: 2.8, d: 1200, t: 500 })
        ink(g, [[260, 330], [300, 350], [340, 330]], { w: 2.4, d: 1500, t: 300 })
        ink(g, L([300, 350], [300, 400]), { w: 2.4, d: 1600, t: 200 })
        hatch(g, [[300, 350], [340, 330], [340, 380], [300, 400]], 1700, true)
        text(g, 300, 440, 'räumliche Aufgabe', { anchor: 'middle', cls: 's', d: 1700 })
      },
      cd(g) {
        const d = group(g)
        ink(d, E(180, 420, 110), { w: 3.2, t: 700 })
        ink(d, E(180, 420, 26), { w: 2.6, d: 300, t: 300 })
        hatch(d, [...E(180, 420, 100, 100, -40, 40), [180, 420]], 600, true)
        d.style.transformOrigin = '180px 420px'
        d.style.transformBox = 'view-box'
        d.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 2400, delay: 800, iterations: Infinity })
        text(g, 180, 580, 'für jedes Neugeborene', { anchor: 'middle', d: 900 })
      },
      uhr(g) {
        hatch(g, [[180, 400], ...E(180, 400, 110, 110, -90, 0), [180, 400]], 900, true)
        clock(g, 180, 400, 120, 0, 90, 0)
        text(g, 180, 570, 'nur etwa 15 Minuten', { anchor: 'middle', d: 1000, size: 20 })
      },
      gleich(g) {
        vbars(g, [
          { label: 'Mozart', v: 70, fmt: none },
          { label: 'andere Musik', v: 68, fmt: none },
          { label: 'Hörgeschichte', v: 69, fmt: none, dense: true },
        ], { x: 40, base: 580, w: 70, gap: 105, h: 280, max: 100 })
        text(g, 40, 260, 'Wirkung bei munterer Stimmung', { cls: 's', d: 200 })
      },
      meta(g) {
        for (let r = 0; r < 4; r++) crowd(g, 26 + (r % 2) * 8, 320 + r * 70, 18, 17, 0.7, r * 220, 25)
        text(g, 180, 640, 'rund 3.000 Teilnehmende', { anchor: 'middle', size: 20, d: 1400 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 384, enter: 'blot', cam: [50, 35, 1.1], cam2: [50, 32, 1.3], cap: 'Barbara Krafft, Wolfgang Amadeus Mozart, 1819' } } },
      { t: T('Wolfgang Amadeus Mozart, 1756 bis 1791: **Wunderkind**, über 600 Werke.', 64), gfx: { zahl: { args: ['626', 'Werke im Köchelverzeichnis', 420] } } },
      { t: T('1993 berichtete die Zeitschrift Nature: Nach zehn Minuten **Mozart-Sonate** lösten Studierende räumliche Aufgaben besser.', 64), gfx: { noten: {} } },
      { t: T('Gespielt wurde die **Sonate für zwei Klaviere** in D-Dur, KV 448.', 64), gfx: { noten: {} } },
      { t: T('Die Aufgabe: Papier wird gefaltet und eingeschnitten – wie sieht es **aufgefaltet** aus?', 64), gfx: { f1: { draw: 'formel', args: [['10 Minuten Mozart', '→', 'rund 8 bis 9 Punkte mehr im Test', '→', 'für 15 Minuten'], 320] } } },
      { t: T('Daraus wurde der „Mozart-Effekt“. Der US-Bundesstaat Georgia verschenkte sogar **Klassik-CDs** an Neugeborene.', 64), gfx: { cd: {} } },
      { t: T('Georgias Gouverneur Zell Miller plante dafür 1998 über **100.000 Dollar** ein.', 64), gfx: { cd: {} } },
      { t: T('Der Effekt hielt nur etwa **15 Minuten** – und betraf nur räumliches Vorstellen.', 64), gfx: { uhr: {} } },
      { t: T('Spätere Versuche zeigten: Jede Musik, die munter macht, wirkt ähnlich – sogar eine spannende **Geschichte**.', 64), gfx: { gleich: {} } },
      { t: T('Ein großer Versuch mit rund **8.000 Kindern**: Popmusik der Band Blur wirkte sogar besser als Mozart.', 64), gfx: { z2: { draw: 'zahl', args: ['8.000', 'Kinder im großen Test', 420] } } },
      { t: T('Entscheidend ist die **Stimmung**:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Musik, die gefällt', '→', 'wacher, besser gelaunt', '→', 'kurz besser im Test'], 320] } } },
      { t: T('Eine große Auswertung der Uni Wien 2010 fand **keinen** besonderen Mozart-Effekt.', 64), gfx: { meta: {} } },
      {
        t: T('Wer selbst ein **Instrument** lernt, schneidet in manchen Tests besser ab – ob das die Ursache ist, ist strittig.', 470),
        pics: { g: { img: 1, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } },
      },
      { t: T('Musizieren trainiert trotzdem einiges:', 64, { kind: 'big' }), gfx: { punkte: { args: [['genaues Hören', 'Feinmotorik', 'Ausdauer', 'Zusammenspiel'], 300] } } },
      { t: T('Ob es **schlauer** macht, ist strittig: Kinder mit Instrument kommen oft aus Familien mit mehr Bildung und Geld.', 64), gfx: { z3: { draw: 'zahl', args: ['?', 'Ursache oder Herkunft?', 420] } } },
      { t: T('Getestet wurden damals nur **36 Studierende**:', 64), gfx: { f3: { draw: 'formel', args: [['36 Studierende', '→', 'weltweite Schlagzeilen'], 330] } } },
      { t: T('Es folgten „Mozart für Babys“-CDs – ein **Millionengeschäft**.', 64), gfx: { cd: {} } },
      { t: T('Mozart selbst komponierte schon mit **fünf Jahren** kleine Stücke.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 30, 1.5] } } },
      recap(
        [{ gfx: 'noten' }, { gfx: 'uhr' }, { gfx: 'gleich' }, { pic: 0, id: 'm', cam: [50, 30, 1.4] }],
        ['1993: kurzer Effekt', 'nur 15 Minuten', 'jede muntere Musik', 'Genie, kein Medikament'],
      ),
    ],
    summary: ['1993: kurzer Effekt auf räumliches Denken.', 'Muntermachende Musik wirkt ähnlich.', 'Meta-Analyse 2010: kein Mozart-Effekt.'],
    sources: ['Rauscher, Shaw & Ky 1993, Nature', 'Pietschnig, Voracek & Formann 2010, Intelligence'],
  },
  {
    id: 'nachtwache',
    area: 'KUL',
    day: 13,
    hook: 'Spielt die Nachtwache bei Nacht?',
    mood: 'episch',
    ambience: 'stadt',
    images: [img('nachtwache')],
    draw: {
      zeit(g) {
        timeline(g, 30, 330, 430, [
          { at: 0.05, label: '1642', sub: 'gemalt', up: true },
          { at: 0.85, label: 'um 1800', sub: '„Nachtwache“', up: true, big: true },
        ], 0, 900)
      },
      firnis(g) {
        const layers: [string, number][] = [['Leinwand', 0], ['Farbe', 1], ['Firnis', 2]]
        layers.forEach(([lab, k]) => {
          const y = 520 - k * 56
          const p = pop(g, k * 400, '50% 100%')
          blank(p, RR(60, y, 240, 48, 6))
          if (k >= 1) hatch(p, RR(60, y, 240, 48, 6), 0, k >= 2)
          ink(p, RR(60, y, 240, 48, 6), { w: 2.6, t: 0 })
          text(p, 180, y + 30, lab, { anchor: 'middle', fade: false, size: 16, cls: 'halo' })
        })
        const clean = pop(st(g, 'h1', '--dl: 400ms'), 1200, '50% 100%')
        blank(clean, RR(60, 352, 240, 48, 6))
        hatch(clean, RR(60, 352, 240, 48, 6), 0, true)
        ink(clean, RR(60, 352, 240, 48, 6), { w: 2.6, t: 0 })
        text(clean, 180, 382, 'Firnis + Schmutz', { anchor: 'middle', fade: false, size: 16, cls: 'halo' })
      },
      schnitt(g) {
        ink(g, RR(40, 300, 280, 190, 4), { w: 3, t: 700 })
        const strip = st(g, 'm1', '--m1: translate(-40px, 120px) rotate(-14deg); --dl: 1200ms; transition-duration: 1.2s')
        hatch(strip, RR(40, 300, 46, 190, 2), 500)
        ink(strip, RR(40, 300, 46, 190, 2), { w: 2.6, d: 600, t: 400 })
        dashes(g, L([86, 290], [86, 500]), { w: 2.2, d: 800 })
        text(g, 180, 652, '1715: links am meisten', { anchor: 'middle', d: 1000 })
      },
      ergaenzt(g) {
        dashes(g, RR(16, 120, 72, 200, 4), { w: 2.4, d: 300 })
        text(g, 52, 230, 'KI', { anchor: 'middle', size: 26, d: 1200 })
      },
    },
    scenes: [
      { t: HOOK(400), pics: { n: { img: 0, x: 16, y: 120, w: 328, h: 240, enter: 'blot', cam: [50, 50, 1.0], cam2: [50, 50, 1.1], cap: 'Rembrandt, Die Nachtwache, 1642' } } },
      { t: T('Gemalt 1642 für die Schützengilde Amsterdams – fast **4 mal 4,5 Meter** groß.', 64), gfx: { zahl: { args: ['3,8 × 4,5 m', 'Größe des Bildes', 420] } } },
      {
        t: T('Rembrandts berühmtestes Bild heißt **Nachtwache** – dabei zeigt es eine Bürgerwehr bei Tag.', 470),
        pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [45, 50, 2.2], cam2: [50, 48, 2.5] } },
      },
      { t: T('Der eigentliche Titel: Die Kompanie von Hauptmann **Frans Banninck Cocq** und Leutnant Willem van Ruytenburch.', 450), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [44, 55, 2.4] } } },
      { t: T('Ungewöhnlich: Die Männer posieren nicht in einer Reihe – sie sind mitten in **Bewegung**, als zögen sie gerade los.', 450), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [55, 50, 1.6] } } },
      { t: T('Das Mädchen im Licht trägt ein **Huhn** am Gürtel – die Krallen waren das Zeichen der Schützen.', 450), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [36, 58, 3.0] } } },
      { t: T('Der Name kam erst Ende des **18. Jahrhunderts** auf.', 64), gfx: { zeit: {} } },
      { t: T('Schichten aus **Firnis** und Schmutz dunkelten das Bild über Jahrhunderte nach.', 64), gfx: { firnis: {} } },
      { t: T('Erst Reinigungen zeigten, wie viel **Licht** Rembrandt eigentlich gemalt hatte.', 64), gfx: { firnis: { cls: 'a1' } } },
      { t: T('Seit 2019 läuft die „**Operation Nachtwache**“ – erforscht vor Publikum, hinter einer Glaswand im Museum.', 64), gfx: { firnis: { cls: 'a1' } } },
      { t: T('Ein Foto mit **717 Gigapixeln** zeigt jedes Detail – bis zu einzelnen Farbkörnchen.', 64), gfx: { z3: { draw: 'zahl', args: ['717', 'Gigapixel', 420] } } },
      { t: T('1715 zog das Bild ins Amsterdamer Rathaus und passte nicht an die Wand – also schnitt man **Streifen** ab.', 64), gfx: { schnitt: { cls: 'a1' } } },
      {
        t: T('2021 ergänzte das Rijksmuseum die fehlenden Teile mithilfe von **KI**.', 400),
        pics: { n: { img: 0, x: 92, y: 120, w: 252, h: 200, cam: [50, 50, 1.0] } },
        gfx: { ergaenzt: {} },
      },
      { t: T('Die KI lernte Rembrandts Stil an einer **Kopie** von Gerrit Lundens – gemalt, bevor beschnitten wurde.', 400), pics: { n: { img: 0, x: 92, y: 120, w: 252, h: 200, cam: [50, 50, 1.0] } }, gfx: { ergaenzt: {} } },
      { t: T('Das Bild wurde mehrfach **angegriffen** – mit Messer und Säure – und jedes Mal restauriert.', 64), gfx: { z4: { draw: 'zahl', args: ['3', 'Angriffe: 1911, 1975, 1990', 420] } } },
      { t: T('Warum der Name trog:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Firnis', '+', 'Schmutz', '+', 'Beschnitt', '=', 'falscher Eindruck'], 330] } } },
      { t: T('Rembrandt van Rijn, 1606 bis 1669, arbeitete mit starkem **Hell-Dunkel**: Licht fällt auf wenige Figuren, der Rest bleibt im Schatten.', 450), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [48, 50, 1.3] } } },
      { t: T('Über **30** Menschen sind zu sehen – und ein Hund. Rembrandt selbst lugt vielleicht zwischen den Köpfen hervor.', 450), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [60, 30, 2.4] } } },
      recap(
        [{ pic: 0, id: 'n', cam: [50, 50, 1.0] }, { gfx: 'zeit' }, { gfx: 'firnis', cls: 'a1' }, { gfx: 'schnitt', cls: 'a1' }],
        ['eine Szene bei Tag', 'Name erst um 1800', 'Firnis dunkelte nach', '1715 beschnitten'],
      ),
    ],
    summary: ['Eigentlich eine Szene bei Tageslicht.', 'Alter Firnis dunkelte das Bild nach.', '1715 beschnitten, 2021 per KI ergänzt.'],
    sources: ['Rijksmuseum Amsterdam: Operation Night Watch'],
  },
]
