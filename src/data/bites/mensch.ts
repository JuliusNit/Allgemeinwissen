import type { Bite } from '../feed'
import { img } from './img'
import {
  B, E, HOOK, L, RR, T, arrow, balance, bigText, blank, brain, car, check, clock, cross, crowd, dashes, door, eye, fig, globe, goat, group, hatch, hbars, ink, letter, lie, mk, pop, question, ring, st, star, strike, text, timeline, track, train, vbars, type P,
} from './draw'
import { recap } from './common'

// Mensch & Denken: Psychologie, Philosophie, Denkwerkzeuge

const pct = (v: number) => `${Math.round(v)} %`
const none = () => ''

/** Gesicht von vorn; Mund als Gruppe (gähnt über Klasse) */
function face(g: Element, cx: number, cy: number, r: number, d = 0, yawn = ''): void {
  ink(g, E(cx, cy, r), { w: 2.8, d, t: 500 })
  for (const s of [-1, 1]) ink(g, L([cx + s * r * 0.42, cy - r * 0.2], [cx + s * r * 0.2, cy - r * 0.2]), { w: 2.4, d: d + 300, t: 150 })
  ink(g, L([cx - r * 0.2, cy + r * 0.42], [cx + r * 0.2, cy + r * 0.42]), { w: 2.4, d: d + 400, t: 150 })
  if (yawn) {
    const m = st(g, yawn, `--o: 50% 50%; --dl: ${d}ms`)
    blank(m, E(cx, cy + r * 0.42, r * 0.26, r * 0.32))
    hatch(m, E(cx, cy + r * 0.42, r * 0.26, r * 0.32), 0, true)
    ink(m, E(cx, cy + r * 0.42, r * 0.26, r * 0.32), { w: 2.4, t: 0 })
  }
}

/** Fisch nach rechts schwimmend */
function fish(g: Element, x: number, y: number, s = 1, d = 0): void {
  const body = [...B([x - 30 * s, y], [x - 10 * s, y - 22 * s], [x + 20 * s, y - 16 * s], [x + 32 * s, y]), ...B([x + 32 * s, y], [x + 20 * s, y + 16 * s], [x - 10 * s, y + 22 * s], [x - 30 * s, y]).slice(1)]
  hatch(g, body, d + 300, true)
  ink(g, body, { w: 2.6, d, t: 500 })
  ink(g, [[x - 28 * s, y], [x - 46 * s, y - 14 * s], [x - 42 * s, y], [x - 46 * s, y + 14 * s], [x - 28 * s, y]], { w: 2.4, d: d + 300, t: 300 })
  blank(g, E(x + 20 * s, y - 4 * s, 4 * s))
  mk('circle', { cx: x + 20 * s, cy: y - 4 * s, r: 2.2 * s, class: 'k' }, g)
}

/** Marshmallow (Zylinder) */
function mallow(g: Element, x: number, y: number, s = 1, d = 0): void {
  blank(g, RR(x - 16 * s, y - 34 * s, 32 * s, 34 * s, 8 * s))
  ink(g, RR(x - 16 * s, y - 34 * s, 32 * s, 34 * s, 8 * s), { w: 2.6, d, t: 400 })
  ink(g, E(x, y - 34 * s, 15 * s, 5 * s), { w: 2, d: d + 200, t: 300 })
}

/** Bett mit Kissen, Liegefläche y */
function bed(g: Element, x: number, y: number, w: number, d = 0): void {
  ink(g, L([x, y - 40], [x, y + 40]), { w: 3.4, d, t: 300 })
  ink(g, L([x + w, y], [x + w, y + 40]), { w: 3.4, d: d + 100, t: 300 })
  ink(g, RR(x, y + 4, w, 20, 6), { w: 3, d: d + 200, t: 500 })
  hatch(g, RR(x, y + 4, w, 20, 6), d + 500, true)
  ink(g, RR(x + 8, y - 14, 44, 16, 8), { w: 2.4, d: d + 300, t: 300 })
}

/** Kasten mit Beschriftung */
function box(g: Element, x: number, y: number, w: number, h: number, label: string, d = 0, size = 17): void {
  blank(g, RR(x, y, w, h, 12))
  ink(g, RR(x, y, w, h, 12), { w: 2.8, d, t: 500 })
  text(g, x + w / 2, y + h / 2 + size * 0.35, label, { anchor: 'middle', size, d: d + 250 })
}

export const MENSCH: Bite[] = [
  {
    id: 'schlafposition',
    area: 'PSY',
    day: 16,
    hook: 'Verrät deine Schlafposition, wer du bist?',
    mood: 'ruhig',
    ambience: 'atem',
    images: [img('hund-schlaf')],
    draw: {
      lagen(g) {
        vbars(g, [
          { label: 'Seite', v: 54, fmt: pct, dense: true },
          { label: 'Rücken', v: 38, fmt: pct },
          { label: 'Bauch', v: 7, fmt: pct },
        ], { x: 50, base: 580, w: 70, gap: 100, h: 300, max: 60 })
        text(g, 40, 250, 'Anteil der Nacht, gemessen', { cls: 's', d: 200 })
      },
      typen(g) {
        const rows: [number, 'curl' | 'back' | 'free', string, string][] = [[230, 'curl', 'Embryo', '„harte Schale, weicher Kern“'], [370, 'back', 'Soldat', '„still, zurückhaltend“'], [510, 'free', 'Freifaller', '„gesellig, forsch“']]
        rows.forEach(([y, pose, lab, sub], i) => {
          const d = i * 450
          const gr = st(g, i ? 'h1' : '', '--dl:100ms')
          bed(gr, 30, y, 150, d)
          lie(pop(gr, d + 500, '50% 50%'), pose === 'free' ? 70 : 52, y - 6, 1.4, pose)
          text(gr, 200, y - 4, lab, { size: 20, d: d + 400 })
          text(st(gr, 'f1', '--dl:300ms'), 200, y + 20, sub, { cls: 's', fade: false })
        })
        const r = st(g, 'x1', '--o:50% 50%;--dl:200ms')
        ring(r, 106, 230, 92, 52)
      },
      umfrage(g) {
        ink(g, RR(90, 200, 180, 250, 10), { w: 3, t: 600 })
        ink(g, RR(150, 188, 60, 22, 6), { w: 3, d: 300, t: 300 })
        hatch(g, RR(150, 188, 60, 22, 6), 500, true)
        for (let k = 0; k < 5; k++) {
          const y = 244 + k * 40
          ink(g, RR(110, y - 12, 18, 18, 3), { w: 2, d: 400 + k * 150, t: 200 })
          ink(g, L([140, y - 3], [250, y - 3]), { w: 1.6, d: 450 + k * 150, t: 200 })
          if (k % 2 === 0) ink(g, [...L([112, y - 4], [118, y + 3]), ...L([118, y + 3], [130, y - 14]).slice(1)], { w: 2.6, d: 900 + k * 150, t: 200 })
        }
        text(g, 180, 500, 'rund 1.000 Befragte', { anchor: 'middle', d: 1400, size: 19 })
        const x = st(g, 'x1', '--o:50% 50%;--dl:300ms')
        cross(x, 180, 330, 4)
        text(x, 180, 560, 'nie begutachtet', { anchor: 'middle', fade: false, size: 20 })
      },
      nacht(g) {
        bed(g, 50, 470, 260, 0)
        const poses: ['back' | 'curl' | 'free', number][] = [['back', 110], ['curl', 120], ['free', 130]]
        poses.forEach(([p, x], i) => {
          const f = lie(g, x, 462, 1.6, p, 0)
          f.animate([{ opacity: i === 0 ? 1 : 0 }, { opacity: 1, offset: 0.05 }, { opacity: 1, offset: 0.3 }, { opacity: 0, offset: 0.35 }, { opacity: 0 }], { duration: 3600, delay: i * 1200 - 3600, iterations: Infinity })
        })
        const moon = [...E(280, 170, 40, 40, 70, 290), ...E(304, 170, 39, 39, 255, 105).slice(1)]
        hatch(g, moon, 900, true)
        ink(g, moon, { w: 2.8, d: 300, t: 700 })
        for (const [x, y, r] of [[80, 160, 9], [150, 230, 6], [210, 130, 7]] as const) star(g, x, y, r, { d: 600 })
      },
      ruecken(g) {
        bed(g, 50, 470, 260, 0)
        lie(g, 110, 462, 1.6, 'back', 300)
        for (const [i, x, y, s] of [[0, 150, 400, 20], [1, 190, 340, 28], [2, 240, 270, 38]] as const) text(st(g, 'float', `--d:${i * 300}ms`), x, y, 'Z', { size: s, d: 800 + i * 300 })
      },
    },
    scenes: [
      { t: HOOK(470), pics: { h: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [45, 40, 1.05], cam2: [45, 40, 1.2] } } },
      { t: T('Seit 2003 geistert eine Liste durchs Netz: Jede **Schlafposition** passe zu einem Charakter.', 64), gfx: { typen: {} } },
      { t: T('Zusammengerollt heißt angeblich: _harte Schale, weicher Kern_.', 64), gfx: { typen: { cls: 'a1' } } },
      { t: T('Soldat – Rücken, Arme am Körper: angeblich still. Freifaller – Bauch, Arme hoch: angeblich **gesellig**, aber empfindlich.', 64), gfx: { typen: {} } },
      { t: T('Die häufigste Antwort in der Umfrage: die **Embryo**-Haltung.', 64), gfx: { z1: { draw: 'zahl', args: ['41 %', 'gaben die Embryo-Haltung an', 420] } } },
      { t: T('Die Quelle: eine **Umfrage** unter Briten. Sie schätzten Haltung und Charakter selbst ein.', 64), gfx: { umfrage: {} } },
      { t: T('Kein Persönlichkeitstest – und **nie** wissenschaftlich veröffentlicht.', 64), gfx: { umfrage: { cls: 'a1' } } },
      { t: T('Das Problem: Wie wir wirklich schlafen, wissen wir kaum – wir **schlafen** ja dabei.', 64), gfx: { nacht: { tf: [0.8, 36, 60] } } },
      { t: T('Zwei Selbsteinschätzungen ergeben noch keinen Beleg:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['eigene Haltung geschätzt', '+', 'eigener Charakter geschätzt', '≠', 'Beleg'], 320] } } },
      { t: T('Echte Persönlichkeitstests wie die „**Big Five**“ messen mit vielen geprüften Fragen – und vergleichen mit Tausenden.', 64), gfx: { punkte: { args: [['Offenheit', 'Gewissenhaftigkeit', 'Extraversion', 'Verträglichkeit', 'Neurotizismus'], 270] } } },
      { t: T('Belegt ist anderes: Man wechselt die Haltung nachts **viele Male**.', 64), gfx: { nacht: {} } },
      { t: T('Schlafforscher filmen und messen: Erwachsene wechseln oft mehr als **zehnmal** pro Nacht die Haltung.', 64), gfx: { zahl: { args: ['> 10', 'Haltungswechsel pro Nacht', 420] } } },
      { t: T('Gemessen liegt man die meiste Zeit auf der **Seite** – mit dem Alter sogar noch mehr.', 64), gfx: { lagen: {} } },
      { t: T('In Rückenlage schnarcht man mehr – und **Schlafparalyse** tritt dort am häufigsten auf.', 64), gfx: { ruecken: {} } },
      { t: T('In Rückenlage rutscht die Zunge leichter nach hinten – die Atemwege werden **enger**.', 64), gfx: { ruecken: {} } },
      { t: T('Schlafparalyse: Man wacht auf, kann sich aber Sekunden bis Minuten **nicht bewegen**. Der Körper ist noch im Traumschlaf.', 64), gfx: { f2: { draw: 'formel', args: [['Traumschlaf', '=', 'Gehirn hellwach', '+', 'Muskeln gelähmt'], 320] } } },
      { t: T('Das kennen gar nicht so wenige: Rund **8 Prozent** erleben es mindestens einmal im Leben.', 64), gfx: { z2: { draw: 'zahl', args: ['8 %', 'erleben einmal eine Schlafparalyse', 420] } } },
      { t: T('Wer schnarcht, kann es mit der **Seitenlage** versuchen – das hilft vielen.', 64), gfx: { lagen: {} } },
      { t: T('Auch Hunde rollen sich gern zusammen – das hält **warm** und schützt den Bauch.', 470), pics: { h: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [45, 40, 1.2] } } },
      { t: T('Wichtiger als die Haltung ist die **Dauer**: Erwachsene brauchen meist sieben bis neun Stunden.', 64), gfx: { z3: { draw: 'zahl', args: ['7–9 h', 'Schlaf für Erwachsene', 420] } } },
      recap(
        [{ gfx: 'typen', cls: 'a1' }, { gfx: 'umfrage', cls: 'a1' }, { gfx: 'nacht' }, { gfx: 'ruecken' }],
        ['Typen aus einer Umfrage', 'nie begutachtet', 'viele Wechsel pro Nacht', 'Rückenlage: Schnarchen'],
      ),
    ],
    summary: ['Die Schlafpositions-Typen stammen aus einer Umfrage von 2003.', 'Nachts wechselt man die Haltung viele Male.', 'Rückenlage: mehr Schnarchen, häufiger Schlafparalyse.'],
    sources: ['BBC News 2003: „Sleep position gives personality clue“', 'Cheyne 2002, Journal of Sleep Research'],
  },
  {
    id: 'gaehnen',
    area: 'PSY',
    day: 41,
    hook: 'Warum steckt Gähnen an – sogar beim Lesen?',
    mood: 'verspielt',
    images: [img('baby-gaehnt')],
    draw: {
      provine(g) {
        vbars(g, [{ label: 'gähnende Gesichter', v: 55, fmt: pct, dense: true }, { label: 'lächelnde Gesichter', v: 21, fmt: pct }], { x: 70, base: 580, w: 80, gap: 140, h: 300, max: 60 })
        text(g, 40, 250, 'haben mitgegähnt', { cls: 's', d: 200 })
      },
      naehe(g) {
        vbars(g, [{ label: 'Familie', v: 80, fmt: none, dense: true }, { label: 'Freunde', v: 60, fmt: none }, { label: 'Bekannte', v: 40, fmt: none }, { label: 'Fremde', v: 25, fmt: none }], { x: 30, base: 580, w: 60, gap: 80, h: 300, max: 100 })
        text(g, 30, 250, 'Ansteckung', { cls: 's', d: 200 })
      },
      wort(g) {
        bigText(g, 180, 400, 'Gääähn', { size: 84, d: 200 })
        face(g, 180, 540, 50, 900, 'x1')
      },
      kette(g) {
        for (let i = 0; i < 6; i++) {
          const x = 70 + (i % 3) * 110
          const y = 300 + Math.floor(i / 3) * 170
          face(g, x, y, 42, i * 120, i === 0 || i % 2 === 1 ? 'x1' : '')
        }
        arrow(g, B([110, 250], [150, 220], [200, 220], [240, 250]), { w: 2, d: 900, t: 400 })
      },
      herz(g) {
        const h: P[] = [...B([180, 470], [80, 400], [90, 290], [180, 330]), ...B([180, 330], [270, 290], [280, 400], [180, 470]).slice(1)]
        hatch(g, h, 500)
        ink(g, h, { w: 3.4, t: 800 })
        question(st(g, 'x1', '--o:50% 50%;--dl:200ms'), 290, 300, 1.4)
      },
      alter(g) {
        vbars(g, [{ label: 'jung', v: 80, fmt: none }, { label: 'mittel', v: 55, fmt: none }, { label: 'älter', v: 30, fmt: none }], { x: 60, base: 580, w: 64, gap: 90, h: 300, max: 100 })
        text(g, 40, 250, 'steckt sich an', { cls: 's', d: 300 })
      },
      vogel(g) {
        const bird = (x: number, y: number, open: boolean, d: number) => {
          const body = E(x, y, 34, 24)
          hatch(g, body, d + 400)
          ink(g, body, { w: 2.8, d, t: 500 })
          ink(g, E(x + 30, y - 26, 16), { w: 2.8, d: d + 200, t: 400 })
          blank(g, E(x + 34, y - 30, 3))
          mk('circle', { cx: x + 34, cy: y - 30, r: 2.4, class: 'k' }, g)
          if (open) {
            ink(g, [[x + 44, y - 26], [x + 60, y - 32], [x + 46, y - 22]], { w: 2.4, d: d + 400, t: 200 })
            ink(g, [[x + 44, y - 20], [x + 58, y - 10], [x + 44, y - 16]], { w: 2.4, d: d + 450, t: 200 })
          } else ink(g, [[x + 44, y - 26], [x + 56, y - 22], [x + 44, y - 18]], { w: 2.4, d: d + 400, t: 200 })
          ink(g, L([x - 30, y + 6], [x - 70, y + 30]), { w: 2.4, d: d + 300, t: 300 })
          ink(g, L([x - 28, y + 12], [x - 64, y + 40]), { w: 2.4, d: d + 350, t: 300 })
          ink(g, L([x, y + 22], [x - 4, y + 44]), { w: 2.2, d: d + 400, t: 150 })
        }
        ink(g, L([30, 470], [330, 470]), { w: 3.4, t: 600 })
        bird(110, 424, true, 200)
        bird(250, 424, false, 700)
        const o = st(g, 'x1', '--dl:500ms')
        ink(o, [[294, 398], [310, 392], [296, 404]], { w: 2.4, t: 0 })
        ink(o, [[294, 404], [308, 414], [294, 408]], { w: 2.4, t: 0 })
      },
      kuehl(g) {
        brain(g, 150, 400, 0.95)
        const th = st(g, 'float', 'transform: translateX(10px)')
        ink(th, RR(296, 230, 22, 120, 11), { w: 2.6, d: 900, t: 400 })
        ink(th, E(307, 360, 18), { w: 2.6, d: 1000, t: 300 })
        hatch(th, E(307, 360, 18), 1200, true)
        arrow(th, L([270, 250], [270, 320]), { w: 2.6, d: 1300, t: 300 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [55, 50, 1.05], cam2: [55, 50, 1.25] } } },
      { t: T('Ein Gähnen dauert im Schnitt etwa **sechs Sekunden**: Mund weit auf, tiefer Atemzug, gestreckte Muskeln.', 64), gfx: { zahl: { args: ['6 s', 'dauert ein Gähnen im Schnitt', 420] } } },
      { t: T('Wir gähnen schon vor der Geburt – im **Mutterleib**, etwa ab der elften Woche.', 64), gfx: { wort: { tf: [0.8, 36, 60] } } },
      { t: T('Oft reicht schon das Wort.', 64), gfx: { wort: { cls: 'a1' } } },
      { t: T('Rund die **Hälfte** der Erwachsenen gähnt mit, wenn sie andere gähnen sieht.', 64), gfx: { kette: { cls: 'a1' } } },
      { t: T('Der Psychologe Robert Provine zeigte Leuten Videos: Gähnende Gesichter steckten über die Hälfte an – lächelnde kaum.', 64), gfx: { provine: {} } },
      { t: T('Es reicht sogar, über Gähnen zu **lesen** oder nachzudenken. Vielleicht gähnst du gerade.', 64), gfx: { kette: { cls: 'a1', tf: [0.8, 36, 80] } } },
      { t: T('Lange galt das als Zeichen von **Mitgefühl**: Wer sich einfühlt, gähnt mit.', 64), gfx: { herz: {} } },
      { t: T('Große Studien finden das kaum. Mehr erklärt das **Alter**: Je älter, desto seltener steckt Gähnen an.', 64), gfx: { alter: {} } },
      { t: T('In dieser Studie der Duke University sahen 328 Menschen ein Gähn-Video. Mit dem **Alter** sank die Ansteckung deutlich.', 64), gfx: { z2: { draw: 'zahl', args: ['328', 'Teilnehmende, Duke University 2014', 420] } } },
      { t: T('Und Nähe zählt: Bei **Familie** und Freunden stecken wir uns leichter an als bei Fremden.', 64), gfx: { naehe: {} } },
      { t: T('Auch Schimpansen und sogar **Wellensittiche** lassen sich anstecken.', 64), gfx: { vogel: { cls: 'a1' } } },
      { t: T('Einige Studien finden das sogar bei **Hunden**: Sie gähnen mit, wenn ihre Menschen gähnen.', 64), gfx: { vogel: { cls: 'a1' } } },
      { t: T('Kleinkinder erst ab etwa **vier Jahren**. Warum wir gähnen, ist offen – eine Idee: Es kühlt das Gehirn.', 64), gfx: { kuehl: {} } },
      { t: T('Die Idee dahinter:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['tiefer Atemzug', '+', 'Kiefer dehnen', '→', 'kühleres Gehirn'], 320] } } },
      { t: T('Passend dazu: Bei Kälte draußen steckt Gähnen seltener an als bei milden Temperaturen.', 64), gfx: { kuehl: {} } },
      { t: T('Gähnen ist wohl kein reines Müdigkeitszeichen – eher ein Signal für **Übergänge**:', 64), gfx: { punkte: { args: [['Aufwachen', 'Einschlafen', 'Langeweile', 'vor Anspannung, etwa vor Wettkämpfen'], 290] } } },
      { t: T('Fast alle Wirbeltiere gähnen – Fische, Vögel, Säugetiere. **Ansteckend** ist es aber nur bei wenigen sozialen Arten.', 64), gfx: { vogel: { tf: [0.8, 36, 80] } } },
      { t: T('Unterdrücken klappt kaum: Wer es versucht, gähnt oft trotzdem – nur mit **geschlossenem** Mund.', 64), gfx: { wort: { cls: 'a1', tf: [0.8, 36, 60] } } },
      recap(
        [{ gfx: 'wort', cls: 'a1' }, { gfx: 'kette', cls: 'a1' }, { gfx: 'alter' }, { gfx: 'vogel', cls: 'a1' }],
        ['schon das Wort steckt an', 'rund die Hälfte gähnt mit', 'Alter zählt mehr als Mitgefühl', 'auch Tiere'],
      ),
    ],
    summary: ['Rund die Hälfte der Erwachsenen gähnt mit.', 'Mitgefühl als Grund: umstritten, das Alter zählt mehr.', 'Auch Tiere stecken sich an, Kinder erst ab etwa vier.'],
    sources: ['Provine 2005, American Scientist', 'Bartholomew & Cirulli 2014, PLOS ONE', 'Gallup et al. 2015, Animal Cognition'],
  },
  {
    id: 'dunning-kruger',
    area: 'PSY',
    day: 63,
    hook: 'Wer wenig weiß, hält sich für ein Genie?',
    mood: 'raetsel',
    images: [img('schach')],
    draw: {
      echt(g) {
        ink(g, L([50, 580], [330, 580]), { w: 3, t: 500 })
        ink(g, L([50, 580], [50, 250]), { w: 3, t: 500 })
        for (let k = 0; k < 4; k++) text(g, 90 + k * 75, 604, `${k + 1}. Viertel`, { anchor: 'middle', cls: 's', d: 300 })
        ink(g, [...L([90, 550], [165, 470]).slice(0), ...L([165, 470], [240, 390]).slice(1), ...L([240, 390], [315, 300]).slice(1)], { w: 3.4, d: 600, t: 900 })
        ink(g, [...L([90, 400], [165, 385]), ...L([165, 385], [240, 370]).slice(1), ...L([240, 370], [315, 350]).slice(1)], { w: 3, d: 1500, t: 900 })
        text(g, 320, 290, 'tatsächlich', { anchor: 'end', d: 1400 })
        text(g, 90, 390, 'geschätzt', { d: 2300 })
      },
      test(g) {
        for (const [x, lab, d] of [[40, 'Logik', 0], [190, 'Grammatik', 500]] as const) {
          ink(g, RR(x, 240, 130, 180, 8), { w: 3, d, t: 600 })
          text(g, x + 65, 274, lab, { anchor: 'middle', d: d + 300 })
          for (let k = 0; k < 4; k++) {
            ink(g, RR(x + 14, 300 + k * 28, 14, 14, 3), { w: 2, d: d + 400 + k * 120, t: 150 })
            ink(g, L([x + 38, 308 + k * 28], [x + 114, 308 + k * 28]), { w: 1.6, d: d + 450 + k * 120, t: 200 })
          }
        }
        crowd(g, 70, 540, 12, 20, 0.9, 1200, 60)
      },
      plaetze(g) {
        hbars(g, [
          { label: 'tatsächlich', v: 12, fmt: (v) => `Platz ${Math.round(v)}` },
          { label: 'selbst geschätzt', v: 62, fmt: (v) => `Platz ${Math.round(v)}`, dense: true },
        ], { y: 300, gap: 130, max: 100 })
        text(g, 30, 560, 'von 100', { cls: 's', d: 1500 })
      },
      meme(g) {
        ink(g, L([40, 580], [330, 580]), { w: 3, t: 500 })
        ink(g, L([40, 580], [40, 240]), { w: 3, t: 500 })
        text(g, 50, 252, 'Selbstvertrauen', { cls: 's', d: 300 })
        text(g, 330, 604, 'Wissen', { cls: 's', anchor: 'end', d: 300 })
        ink(g, [...B([44, 570], [70, 300], [90, 280], [110, 330]), ...B([110, 330], [140, 500], [170, 520], [200, 470]).slice(1), ...B([200, 470], [240, 400], [280, 360], [320, 330]).slice(1)], { w: 3.6, d: 600, t: 1600 })
        text(g, 100, 280, 'Gipfel des Unwissens', { anchor: 'start', d: 1400, size: 15 })
        const x = st(g, 'f1', '--dl:200ms')
        strike(x, [50, 520], [320, 300])
        text(x, 180, 640, 'nicht aus der Studie', { anchor: 'middle', fade: false, size: 20 })
      },
      leiter(g) {
        ink(g, L([120, 600], [120, 220]), { w: 3.4, t: 600 })
        for (let k = 0; k <= 10; k++) ink(g, L([120, 600 - k * 38], [k % 5 ? 130 : 140, 600 - k * 38]), { w: 2, d: 200 + k * 40, t: 100 })
        text(g, 148, 606, '0', { cls: 's', d: 400 })
        text(g, 148, 226, '100', { cls: 's', d: 600 })
        fig(pop(g, 700), 100, 560, 1.4)
        arrow(g, L([200, 556], [200, 260]), { w: 3, d: 1100, t: 700 })
        arrow(g, L([240, 556], [240, 596]), { w: 3, d: 1600, t: 200, head: 8 })
        text(g, 196, 250, 'viel Platz nach oben', { cls: 's', anchor: 'start', d: 1500 })
        text(g, 236, 630, 'kaum nach unten', { cls: 's', anchor: 'middle', d: 1900 })
      },
      treppe(g) {
        for (let k = 0; k < 5; k++) {
          const p: P[] = [[40 + k * 56, 600 - k * 50], [96 + k * 56, 600 - k * 50], [96 + k * 56, 600], [40 + k * 56, 600], [40 + k * 56, 600 - k * 50]]
          if (k) hatch(g, p, 300 + k * 150)
          ink(g, L([40 + k * 56, 600 - k * 50], [96 + k * 56, 600 - k * 50]), { w: 3, d: 200 + k * 150, t: 200 })
          ink(g, L([96 + k * 56, 600 - k * 50], [96 + k * 56, 600 - (k + 1) * 50]), { w: 3, d: 300 + k * 150, t: 150 })
        }
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 400 })
        const climb = st(g, 'm1', '--m1: translate(224px, -200px); --dl: 400ms; transition-duration: 2.4s')
        fig(climb, 68, 598, 1.4, { arms: 'up' })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [40, 50, 1.05], cam2: [40, 50, 1.25] } } },
      { t: T('Der Name ist längst ein Schlagwort: Wer Unsinn redet, „hat **Dunning-Kruger**“. Was steckt wirklich dahinter?', 64), gfx: { question: { draw: 'punkte', args: [['Selbstüberschätzung?', 'Dummheit?', 'Statistik?'], 340] } } },
      {
        t: T('1999 testeten David Dunning und Justin Kruger Studierende in Logik und Grammatik.', 64),
        gfx: { test: {} },
      },
      { t: T('Die Schwächsten landeten im Schnitt auf Platz 12 von 100 – und schätzten sich auf **Platz 62**.', 64), gfx: { plaetze: {} } },
      { t: T('Die Besten unterschätzten sich dagegen leicht: Was ihnen leichtfiel, hielten sie auch für andere für **leicht**.', 64), gfx: { f1: { draw: 'formel', args: [['leicht für mich', '→', 'leicht für alle'], 330, 'Fehlschluss der Besten'] } } },
      { t: T('Die Erklärung der Forscher: Um Fehler zu erkennen, braucht man genau das **Wissen**, das einem fehlt.', 64), gfx: { f2: { draw: 'formel', args: [['fehlendes Wissen', '→', 'Fehler', '+', 'Fehler nicht erkennen'], 330, 'doppelter Fluch'] } } },
      { t: T('Daraus wurde ein Meme: eine Kurve mit dem „Gipfel des Unwissens“.', 64), gfx: { meme: {} } },
      { t: T('Die Kurve stammt aber **nicht** aus der Studie.', 64), gfx: { meme: { cls: 'a1' } } },
      { t: T('Die echte Grafik der Studie ist unspektakulär: Fast alle schätzen sich leicht **über dem Durchschnitt** ein.', 64), gfx: { echt: {} } },
      { t: T('Und ein Teil ist **Statistik**: Wer ganz unten liegt, kann sich fast nur überschätzen.', 64), gfx: { leiter: {} } },
      { t: T('Ein Gedankenexperiment: Alle schätzen sich einfach auf **Platz 50** – egal, wie gut sie wirklich sind.', 64), gfx: { r1: { draw: 'formel', args: [['jede Schätzung', '=', 'Platz 50'], 330] } } },
      { t: T('Dann „überschätzen“ sich die Schwächsten automatisch – und die Besten „unterschätzen“ sich. Ganz **ohne** Selbstüberschätzung.', 64), gfx: { v9: { draw: 'vergleich', args: [['Schwächste', 'tatsächlich: Platz 12', 'geschätzt: 50', 'wirkt überschätzt'], ['Beste', 'tatsächlich: Platz 88', 'geschätzt: 50', 'wirkt unterschätzt'], 290] } } },
      { t: T('Ein Teil des berühmten Effekts entsteht genau so. Statistiker nennen es **Regression zur Mitte**:', 64), gfx: { r2: { draw: 'formel', args: [['ungenaue Schätzung', '→', 'Werte rutschen zur Mitte'], 330] } } },
      { t: T('Der Psychologe Gilles Gignac zeigte 2020: Rechnet man sauber, bleibt vom Effekt nur ein **kleiner** Teil.', 64), gfx: { leiter: { tf: [0.8, 36, 80] } } },
      { t: T('Dazu kommt ein anderer Effekt: Fast alle halten sich für **überdurchschnittlich** – etwa beim Autofahren.', 64), gfx: { z2: { draw: 'zahl', args: ['93 %', 'befragter US-Studierender hielten sich für bessere Fahrer als der Durchschnitt', 400] } } },
      { t: T('Gute Nachricht aus derselben Studie: Schon kurzes **Üben** verbesserte Können und Selbsteinschätzung.', 64), gfx: { treppe: { cls: 'a1' } } },
      { t: T('Die eigene Einschätzung lässt sich **trainieren**:', 64, { kind: 'big' }), gfx: { punkte: { args: [['vorher schätzen, nachher prüfen', 'Feedback einholen', 'Fehler sammeln und ansehen'], 320] } } },
      { t: T('Der Anstoß: 1995 rieb sich in Pittsburgh ein Bankräuber das Gesicht mit **Zitronensaft** ein – er hielt sich so für unsichtbar für Kameras.', 64), gfx: { z3: { draw: 'zahl', args: ['1995', 'Bankraub mit Zitronensaft', 420] } } },
      { t: T('Die Studie hieß spöttisch „**Unskilled and Unaware of It**“ – unfähig und ahnungslos.', 64), gfx: { plaetze: { tf: [0.8, 36, 80] } } },
      recap(
        [{ gfx: 'plaetze' }, { gfx: 'meme', cls: 'a1' }, { gfx: 'leiter' }, { gfx: 'treppe', cls: 'a1' }],
        ['Platz 12, geschätzt 62', 'Meme-Kurve: erfunden', 'zum Teil Statistik', 'Üben hilft'],
      ),
    ],
    summary: ['Die Schwächsten schätzten sich auf Platz 62 statt 12.', 'Die berühmte Kurve stammt nicht aus der Studie.', 'Üben verbessert Können und Selbsteinschätzung.'],
    sources: ['Kruger & Dunning 1999, J Pers Soc Psychol', 'Gignac & Zajenkowski 2020, Intelligence'],
  },
  {
    id: 'marshmallow',
    area: 'PSY',
    day: 55,
    hook: 'Sagt ein Marshmallow deine Zukunft voraus?',
    mood: 'verspielt',
    images: [img('marshmallows')],
    draw: {
      vertrauen(g) {
        vbars(g, [{ label: 'Versprechen gebrochen', v: 3, fmt: (v) => `${Math.round(v)} min` }, { label: 'Versprechen gehalten', v: 12, fmt: (v) => `${Math.round(v)} min`, dense: true }], { x: 70, base: 580, w: 80, gap: 140, h: 300, max: 15 })
        text(g, 40, 250, 'durchschnittliche Wartezeit', { cls: 's', d: 200 })
      },
      teller(g) {
        ink(g, L([30, 520], [330, 520]), { w: 3.4, t: 600 })
        ink(g, E(150, 506, 70, 12), { w: 2.8, d: 300, t: 500 })
        mallow(g, 132, 506, 1.3, 600)
        mallow(st(g, 'x1', '--dl:200ms'), 172, 506, 1.3, 0)
        fig(pop(g, 500), 290, 600, 2.6)
        const c = st(g, 'f1', '--dl:400ms')
        clock(c, 270, 300, 50, 0, 0, 0)
        const mh = c.querySelector('.mh') as SVGGElement | null
        mh?.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(90deg)' }], { duration: 4000, delay: 1200, fill: 'both', easing: 'linear' })
        text(c, 270, 380, '15 Minuten', { anchor: 'middle', fade: false })
      },
      erfolg(g) {
        vbars(g, [{ label: 'sofort gegessen', v: 50, fmt: none }, { label: 'gewartet', v: 75, fmt: none, dense: true }], { x: 80, base: 560, w: 80, gap: 120, h: 300, max: 100 })
        text(g, 40, 236, 'Noten, Testwerte', { cls: 's', d: 300 })
      },
      kinder(g) {
        for (let r = 0; r < 4; r++) crowd(g, 26 + (r % 2) * 8, 300 + r * 80, 18, 17, 0.75, r * 250, 30)
        text(g, 180, 640, 'über 900 Kinder', { anchor: 'middle', size: 22, d: 1600 })
      },
      effekt(g) {
        hbars(g, [
          { label: 'Original, wenige Kinder', v: 100, fmt: none },
          { label: '2018, über 900 Kinder', v: 45, fmt: none, dense: true },
          { label: '… mit Familie und Umfeld', v: 15, fmt: none },
        ], { y: 280, gap: 110, max: 100, d: 0 })
        text(g, 30, 230, 'Zusammenhang Warten – späterer Erfolg', { cls: 's', d: 100 })
      },
      versprechen(g) {
        const b: P[] = [...RR(110, 200, 200, 120, 18)]
        ink(g, b, { w: 3, t: 600 })
        ink(g, [[150, 318], [130, 360], [180, 320]], { w: 2.8, d: 400, t: 300 })
        mallow(g, 180, 290, 1.2, 600)
        mallow(g, 236, 290, 1.2, 800)
        fig(pop(g, 300), 110, 560, 3)
        question(g, 200, 470, 1.2, 1300)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.25] } } },
      { t: T('In den 1960ern ließ Walter Mischel Kinder wählen: **ein** Marshmallow sofort …', 64), gfx: { teller: {} } },
      { t: T('… oder **zwei**, wenn sie rund 15 Minuten allein warten.', 64), gfx: { teller: { cls: 'a1' } } },
      { t: T('Die Kinder waren drei bis fünf Jahre alt und besuchten den Kindergarten der **Stanford**-Universität.', 64), gfx: { teller: { cls: 'a1', tf: [0.8, 36, 60] } } },
      { t: T('Manche hielten sich die Augen zu, sangen oder drehten sich weg: **Ablenkung** half beim Warten.', 64), gfx: { punkte: { args: [['Augen zuhalten', 'singen', 'wegdrehen', 'an etwas anderes denken'], 300] } } },
      { t: T('Die Wahl als Rechnung:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['1 sofort', 'oder', '15 Minuten warten', '→', '2'], 330] } } },
      { t: T('Jahre später schienen die Warter erfolgreicher. Die Folgerung: **Selbstkontrolle** entscheidet über das Leben.', 64), gfx: { erfolg: {} } },
      { t: T('Die Daten stammten aber nur von einer kleinen Gruppe – vor allem Kinder von **Uni-Angestellten**.', 64), gfx: { erfolg: { tf: [0.8, 36, 80] } } },
      { t: T('2018 wiederholten Forscher den Test – mit Kindern aus **allen Schichten**.', 64), gfx: { kinder: {} } },
      { t: T('Sie nutzten eine große US-Langzeitstudie: Kinder aus vielen Familien, mit unterschiedlichem **Einkommen** und Bildung.', 64), gfx: { kinder: {} } },
      { t: T('Der Effekt schrumpfte stark – und fast ganz, sobald man **Familie und Umfeld** einrechnete.', 64), gfx: { effekt: { cls: 'a1' } } },
      { t: T('Eine Studie aus Rochester 2013: Kinder, denen vorher ein Versprechen **gebrochen** wurde, warteten nur etwa 3 Minuten – die anderen rund 12.', 64), gfx: { vertrauen: {} } },
      { t: T('Warten ist also auch eine vernünftige Rechnung: Wer erlebt, dass Versprechen nicht gelten, nimmt besser das **sichere** Marshmallow.', 64), gfx: { f2: { draw: 'formel', args: [['Versprechen unsicher', '→', 'lieber sofort zugreifen'], 330] } } },
      { t: T('Warten heißt auch: Ich **vertraue** darauf, dass das Versprechen gilt.', 64), gfx: { versprechen: {} } },
      { t: T('Selbstkontrolle bleibt wichtig – aber ein einzelner Test mit vier Jahren sagt wenig über ein ganzes **Leben**.', 64), gfx: { teller: { cls: 'a1', tf: [0.8, 36, 60] } } },
      recap(
        [{ gfx: 'teller', cls: 'a1' }, { gfx: 'kinder' }, { gfx: 'effekt' }, { gfx: 'vertrauen' }],
        ['1 jetzt oder 2 später', '2018: über 900 Kinder', 'Effekt viel kleiner', 'Vertrauen zählt'],
      ),
    ],
    summary: ['Original: wenige Kinder einer Uni-Kita.', '2018 mit über 900 Kindern: Effekt viel kleiner.', 'Warten hängt auch von Vertrauen und Umfeld ab.'],
    sources: ['Mischel, Shoda & Rodriguez 1989, Science', 'Watts, Duncan & Quan 2018, Psychological Science', 'Kidd, Palmeri & Aslin 2013, Cognition'],
  },
  {
    id: 'sokrates',
    area: 'PHIL',
    day: 22,
    hook: '„Ich weiß, dass ich nichts weiß“ – hat Sokrates das gesagt?',
    mood: 'ruhig',
    images: [img('sokrates-buste'), img('sokrates-tod')],
    draw: {
      abstimmung(g) {
        vbars(g, [{ label: 'schuldig', v: 280, fmt: (v) => String(Math.round(v)), dense: true }, { label: 'nicht schuldig', v: 220, fmt: (v) => String(Math.round(v)) }], { x: 70, base: 580, w: 80, gap: 140, h: 300, max: 300 })
        text(g, 40, 250, 'Stimmen der Geschworenen', { cls: 's', d: 200 })
      },
      blatt(g) {
        ink(g, RR(110, 250, 140, 190, 6), { w: 3, t: 600 })
        const q = st(g, 'float')
        ink(q, B([280, 220], [250, 280], [220, 360], [200, 420]), { w: 2.6, d: 500, t: 500 })
        const feather: P[] = [...B([280, 220], [300, 260], [270, 330], [228, 380]), ...B([228, 380], [240, 320], [250, 260], [280, 220]).slice(1)]
        hatch(q, feather, 900, true)
        ink(q, feather, { w: 2.4, d: 600, t: 500 })
        cross(st(g, 'x1', '--o:50% 50%;--dl:300ms'), 180, 345, 2.4)
      },
      rolle(g) {
        ink(g, RR(60, 230, 240, 260, 10), { w: 3, t: 700 })
        for (const y of [230, 490]) {
          ink(g, E(60, y, 12, 14), { w: 2.6, d: 200, t: 300 })
          ink(g, E(300, y, 12, 14), { w: 2.6, d: 200, t: 300 })
        }
        for (let k = 0; k < 8; k++) ink(g, B([90, 270 + k * 26], [140, 266 + k * 26], [200, 274 + k * 26], [k === 7 ? 200 : 268, 270 + k * 26]), { w: 1.8, d: 500 + k * 220, t: 250 })
        text(g, 180, 530, 'Platon', { anchor: 'middle', size: 24, cls: 'serif', d: 600 })
      },
      zitat(g) {
        bigText(g, 56, 286, '„', { size: 140, d: 100 })
        bigText(g, 310, 590, '“', { size: 140, d: 900 })
      },
      wissen(g) {
        hatch(g, E(180, 400, 110), 600)
        ink(g, E(180, 400, 110), { w: 4, t: 900 })
        text(g, 180, 408, 'gewusst', { anchor: 'middle', size: 22, d: 700, cls: 'halo' })
        for (const [x, y, d] of [[50, 250, 900], [310, 270, 1000], [40, 520, 1100], [320, 560, 1200], [180, 620, 1300]] as const) question(g, x, y, 0.7, d)
        const r = st(g, 'x1', '--o:50% 50%;--dl:400ms')
        ink(r, E(180, 400, 122), { w: 2, t: 0 })
        text(r, 180, 262, 'die Grenze kennen', { anchor: 'middle', fade: false, size: 17 })
      },
    },
    scenes: [
      { t: HOOK(470), pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [50, 35, 1.1], cam2: [50, 35, 1.25] } } },
      { t: T('Sokrates lebte etwa 469 bis 399 v. Chr. in Athen – ein Steinmetzsohn, der auf dem Marktplatz Leute in **Gespräche** verwickelte.', 64), gfx: { zahl: { args: ['70', 'Jahre lebte Sokrates in Athen', 420] } } },
      {
        t: { text: 'Sokrates schrieb selbst **nichts**.', x: 130, y: 90, w: 210 },
        pics: { s: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [50, 30, 1.4] } },
        gfx: { blatt: { cls: 'a1' } },
      },
      {
        t: { text: 'Was wir über ihn wissen, stammt vor allem von seinem Schüler **Platon**.', x: 130, y: 70, w: 210 },
        pics: { s: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [50, 30, 1.4] } },
        gfx: { rolle: {} },
      },
      { t: T('Auch Xenophon und der Komödiendichter Aristophanes schrieben über ihn – jeder zeichnet ein **anderes** Bild.', 64), gfx: { p3: { draw: 'punkte', args: [['Platon: der Philosoph', 'Xenophon: der Ratgeber', 'Aristophanes: der Spinner'], 320] } } },
      { t: T('Seine Methode: Fragen stellen, bis der andere merkt, wo sein Wissen Lücken hat.', 64), gfx: { f1: { draw: 'formel', args: [['Frage', '→', 'Antwort', '→', 'neue Frage', '→', 'Einsicht'], 320, 'sokratisches Gespräch'] } } },
      { t: { text: 'In Platons „Apologie“ sagt er sinngemäß: Ich bin weiser als andere, weil ich nicht **glaube**, etwas zu wissen, was ich nicht weiß.', x: 40, y: 306, w: 280, kind: 'mid' }, gfx: { zitat: {} } },
      { t: T('Anlass war ein Orakel: Delphi soll verkündet haben, niemand sei weiser als Sokrates. Er wollte das **widerlegen**.', 64), gfx: { zitat: {} } },
      { t: T('Er befragte Politiker, Dichter und Handwerker. Sie alle glaubten mehr zu wissen, als sie wussten – er kannte wenigstens seine **Grenzen**.', 64), gfx: { punkte: { args: [['Politiker', 'Dichter', 'Handwerker'], 340] } } },
      { t: T('Das ist feiner als der berühmte Satz: **Ehrlichkeit** über die Grenzen des eigenen Wissens.', 64), gfx: { wissen: { cls: 'a1' } } },
      { t: T('Die knappe Formel „Ich weiß, dass ich nichts weiß“ steht so erst in späteren Zusammenfassungen, etwa bei **Cicero**.', 64), gfx: { wissen: { cls: 'a1', tf: [0.8, 36, 100] } } },
      { t: T('Seine Ankläger warfen ihm vor, die **Jugend** zu verderben und nicht die Götter der Stadt zu ehren.', 64), gfx: { p2: { draw: 'punkte', args: [['verdirbt die Jugend', 'ehrt nicht die Götter der Stadt', 'führt neue Gottheiten ein'], 320] } } },
      { t: T('Über 500 Geschworene stimmten ab. Eine **knappe** Mehrheit sprach ihn schuldig.', 64), gfx: { abstimmung: {} } },
      {
        t: T('399 v. Chr. wurde er wegen „Verderbens der Jugend“ zum Tod verurteilt.', 340),
        pics: { t: { img: 1, x: 16, y: 56, w: 328, h: 240, enter: 'blot', cam: [50, 50, 1.0], cam2: [40, 50, 1.2], cap: 'Jacques-Louis David, Der Tod des Sokrates, 1787' } },
      },
      {
        t: T('Er trank den **Schierlingsbecher**. Fliehen wollte er nicht – er hielt sich an die Gesetze seiner Stadt.', 450),
        pics: { t: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [44, 50, 2.2], cam2: [42, 55, 2.6] } },
      },
      { t: T('Er hätte **fliehen** können – Freunde hatten alles vorbereitet. In Platons „Kriton“ begründet er, warum er bleibt.', 450), pics: { t: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [44, 50, 1.6] } } },
      { t: T('Er kämpfte auch als **Soldat** im Krieg gegen Sparta – und soll dabei einem Freund das Leben gerettet haben.', 64), gfx: { zahl: { args: ['3', 'Feldzüge als Soldat', 420] } } },
      { t: T('Geld nahm er für seine Gespräche nicht – anders als die **Sophisten**, die Redekunst gegen Bezahlung lehrten.', 64), gfx: { vergleich: { args: [['Sophisten', 'lehren gegen Geld', 'überzeugen'], ['Sokrates', 'fragt umsonst', 'prüfen'], 290] } } },
      { t: T('Seine Wirkung reicht weit:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Sokrates', '→', 'Platon', '→', 'Aristoteles', '→', 'Alexander der Große'], 320, 'Lehrer und Schüler'] } } },
      recap(
        [{ gfx: 'blatt', cls: 'a1' }, { gfx: 'wissen', cls: 'a1' }, { gfx: 'abstimmung' }, { pic: 1, id: 't', cam: [44, 50, 1.6] }],
        ['schrieb selbst nichts', 'die Grenze des Wissens kennen', '280 zu 220: schuldig', 'Schierlingsbecher 399 v. Chr.'],
      ),
    ],
    summary: ['Sokrates schrieb nichts, Platon überliefert ihn.', 'Original: Ich glaube nicht zu wissen, was ich nicht weiß.', '399 v. Chr. zum Tod verurteilt.'],
    sources: ['Platon, Apologie 21d', 'Platon, Kriton'],
  },
  {
    id: 'diogenes',
    area: 'PHIL',
    day: 22,
    hook: 'Lebte Diogenes wirklich in einer Tonne?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [img('diogenes-gerome'), img('pithoi-knossos')],
    draw: {
      huhn(g) {
        const body = E(180, 430, 70, 50)
        blank(g, body)
        ink(g, body, { w: 3, t: 700 })
        ink(g, B([240, 410], [270, 380], [270, 340], [262, 320]), { w: 3, d: 400, t: 300 })
        ink(g, E(262, 310, 16), { w: 3, d: 600, t: 300 })
        ink(g, [[276, 308], [292, 314], [276, 318]], { w: 2.4, d: 800, t: 200 })
        for (const x of [160, 200]) ink(g, L([x, 476], [x - 4, 540]), { w: 3, d: 900, t: 200 })
        for (let k = 0; k < 10; k++) mk('circle', { cx: 130 + (k * 37) % 100, cy: 405 + (k * 23) % 50, r: 2.4, class: 'k fade', style: `--d:${1100 + k * 60}ms` }, g)
        text(g, 180, 600, '„Hier ist Platons Mensch!“', { anchor: 'middle', size: 20, cls: 'it', d: 1600 })
      },
      gefaesse(g) {
        // Holzfass
        const fass: P[] = [...B([40, 300], [30, 380], [30, 420], [40, 500]), [160, 500], ...B([160, 500], [170, 420], [170, 380], [160, 300]).slice(1), [40, 300]]
        ink(g, fass, { w: 3, t: 700 })
        for (const x of [70, 100, 130]) ink(g, B([x, 300], [x - 4, 380], [x - 4, 420], [x, 500]), { w: 1.8, d: 400, t: 400 })
        for (const y of [330, 470]) ink(g, L([36, y], [164, y]), { w: 3.4, d: 600, t: 300 })
        text(g, 100, 540, 'Holzfass', { anchor: 'middle', d: 700 })
        cross(g, 100, 400, 2.6, 1200)
        // Pithos
        const pit: P[] = [[240, 270], [300, 270], ...B([300, 270], [350, 320], [345, 440], [292, 500]).slice(1), [248, 500], ...B([248, 500], [195, 440], [190, 320], [240, 270]).slice(1)]
        hatch(g, pit, 1300)
        ink(g, pit, { w: 3, d: 800, t: 800 })
        ink(g, RR(234, 258, 72, 14, 5), { w: 2.6, d: 1100, t: 300 })
        text(g, 270, 540, 'Pithos (Ton)', { anchor: 'middle', d: 1300 })
        check(g, 270, 580, 1.3, 1700)
      },
      sonne(g) {
        ink(g, E(300, 140, 34), { w: 3, t: 600 })
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2
          ink(g, L([300 + Math.cos(a) * 44, 140 + Math.sin(a) * 44], [300 + Math.cos(a) * 60, 140 + Math.sin(a) * 60]), { w: 2.2, d: 400 + k * 40, t: 120 })
        }
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        const pit: P[] = [[70, 470], [130, 470], ...B([130, 470], [160, 500], [150, 540], [128, 560]).slice(1), [72, 560], ...B([72, 560], [50, 540], [40, 500], [70, 470]).slice(1)]
        hatch(g, pit, 700)
        ink(g, pit, { w: 2.8, d: 300, t: 500 })
        fig(pop(g, 700), 100, 488, 1.3, { arms: 'up' })
        const sh = st(g, 'h1', '--dl:800ms')
        hatch(sh, [[186, 446], [214, 446], [214, 558], [36, 560], [186, 446]], 900, true)
        const al = st(g, 'm1', '--m1: translateX(110px); --dl: 300ms; transition-duration: 1.4s')
        fig(pop(al, 500), 200, 556, 3.6)
        const crown: P[] = [[186, 424], [190, 408], [196, 418], [200, 404], [204, 418], [210, 408], [214, 424], [186, 424]]
        hatch(al, crown, 900, true)
        ink(al, crown, { w: 2.2, d: 800, t: 300 })
        text(al, 200, 600, 'Alexander', { anchor: 'middle', d: 900 })
        text(g, 100, 600, 'Diogenes', { anchor: 'middle', d: 900 })
        const rays = st(g, 'f1', '--dl:1200ms')
        for (const dx of [-14, 0, 14]) dashes(rays, L([270, 180], [110 + dx, 440]), { w: 1.6, t: 0 })
      },
      wort(g) {
        const words: [number, string][] = [[60, 'kyon'], [180, 'Kyniker'], [300, 'zynisch']]
        words.forEach(([x, w], i) => {
          text(g, x, 520, w, { anchor: 'middle', size: 22, d: 300 + i * 600, cls: i === 0 ? 'it' : '' })
          if (i) arrow(g, L([x - 120 + 44, 512], [x - 50, 512]), { w: 2.4, d: i * 600, t: 300, head: 8 })
        })
        text(g, 60, 550, '„Hund“', { anchor: 'middle', cls: 's', d: 500 })
      },
    },
    scenes: [
      { t: HOOK(450), pics: { d: { img: 0, x: 16, y: 56, w: 328, h: 370, enter: 'blot', cam: [30, 55, 1.1], cam2: [28, 55, 1.3], cap: 'Jean-Léon Gérôme, Diogenes, 1860' } } },
      {
        t: T('Diogenes von Sinope wollte im 4. Jahrhundert v. Chr. zeigen: Man braucht fast **nichts** zum Glück.', 450),
        pics: { d: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [26, 50, 2.0], cam2: [26, 48, 2.3] } },
      },
      { t: T('Er lebte etwa 400 bis 323 v. Chr. – geboren in **Sinope** am Schwarzen Meer, von dort verbannt.', 450), pics: { d: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [26, 50, 2.0] } } },
      { t: T('Sein ganzer Besitz: Mantel, Stock, Beutel – und ein **Becher**. Den warf er weg, als er ein Kind aus der Hand trinken sah.', 64), gfx: { punkte: { args: [['Mantel', 'Stock', 'Beutel', 'Becher – bis er ihn wegwarf'], 300] } } },
      { t: T('Er schlief in Athen in einem **Pithos** – einem großen Vorratsgefäß aus Ton, keinem Holzfass.', 64), gfx: { gefaesse: {} } },
      {
        t: T('Solche Krüge standen etwa im Palast von Knossos – fast mannshoch.', 476),
        pics: { p: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.2] } },
      },
      { t: T('Holzfässer kannten die Griechen damals kaum – sie kamen erst später, von den **Kelten**.', 64), gfx: { gefaesse: { tf: [0.9, 18, 40] } } },
      { t: T('Berühmte Anekdote: Alexander der Große besucht ihn und bietet ihm einen Wunsch an.', 64), gfx: { sonne: {} } },
      { t: T('Diogenes: _„Geh mir aus der Sonne.“_', 64, { kind: 'big', w: 220 }), gfx: { sonne: { cls: 'a1' } } },
      { t: T('Alexander soll gesagt haben: _Wäre ich nicht Alexander, wollte ich Diogenes sein._', 64, { kind: 'mid', w: 230 }), gfx: { sonne: { cls: 'a1' } } },
      {
        t: T('Am hellen Tag lief er mit einer **Laterne** durch Athen: „Ich suche einen Menschen.“ Gérôme malt ihn genau dabei.', 450),
        pics: { d: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [30, 42, 2.2], cam2: [30, 40, 2.5] } },
      },
      { t: T('Als Platon den Menschen „federloses Zweibein“ nannte, rupfte Diogenes ein **Huhn** und brachte es in die Akademie.', 64), gfx: { huhn: {} } },
      {
        t: T('Seine Schule hieß **Kyniker** – sie lebten so bedürfnislos wie Straßenhunde. Daraus wurde „zynisch“.', 64),
        pics: { d: { img: 0, x: 16, y: 210, w: 328, h: 250, cam: [80, 72, 2.0] } },
        gfx: { wort: { tf: [1, 0, 30] } },
      },
      { t: T('Die Kyniker wollten frei sein von Besitz, Ruhm und Regeln – und lebten **bewusst** provokant.', 64), gfx: { f1: { draw: 'formel', args: [['Glück', '=', 'wenig brauchen'], 330] } } },
      { t: T('Vieles kennen wir von Diogenes Laertios – geschrieben rund **500 Jahre** später. Ob jede Anekdote stimmt, weiß niemand.', 64), gfx: { zahl: { args: ['500', 'Jahre zwischen Diogenes und seinem Biografen', 420] } } },
      { t: T('In Athen lebte er auf dem **Marktplatz**: Er aß, schlief und stritt dort – vor aller Augen.', 64), gfx: { sonne: { tf: [0.8, 36, 80] } } },
      { t: T('Er nannte sich selbst „**Weltbürger**“ – das Wort Kosmopolit geht auf ihn zurück.', 64), gfx: { f3: { draw: 'formel', args: [['kosmos: Welt', '+', 'polites: Bürger', '=', 'Kosmopolit'], 320] } } },
      { t: T('Im Alter sollen ihn **Piraten** gefangen und als Sklave verkauft haben – nach Korinth. Dort starb er um 323 v. Chr.', 64), gfx: { z3: { draw: 'zahl', args: ['323 v. Chr.', 'Tod in Korinth', 420] } } },
      { t: T('Auf seinem Grab stand angeblich ein **Hund** aus Marmor – das Tier, nach dem seine Schule hieß.', 450), pics: { d: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [80, 72, 2.0] } } },
      recap(
        [{ gfx: 'gefaesse' }, { gfx: 'sonne', cls: 'a1' }, { pic: 0, id: 'd', cam: [28, 45, 1.4] }, { gfx: 'wort' }],
        ['Tonkrug, kein Fass', '„Geh mir aus der Sonne“', 'Laterne: „Ich suche einen Menschen“', 'kyon → zynisch'],
      ),
    ],
    summary: ['Pithos = Tonkrug, kein Holzfass.', '„Geh mir aus der Sonne“ – zu Alexander.', 'Kyniker → zynisch, von griechisch „Hund“.'],
    sources: ['Diogenes Laertios, Leben und Meinungen berühmter Philosophen, Buch VI'],
  },
  {
    id: 'weiche',
    area: 'PHIL',
    day: 46,
    hook: 'Würdest du die Weiche umstellen?',
    mood: 'dunkel',
    images: [],
    draw: {
      hirn(g) {
        brain(g, 180, 400, 1.1)
        const h = pop(g, 1300, '50% 50%')
        blank(h, E(150, 430, 30, 22))
        hatch(h, E(150, 430, 30, 22), 0, true)
        ink(h, E(150, 430, 30, 22), { w: 2.6, t: 0 })
        text(g, 180, 580, 'Gefühls-Areale aktiver', { anchor: 'middle', d: 1500 })
      },
      autonom(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        car(g, 90, 556, 1.8, 200)
        crowd(g, 220, 556, 3, 22, 1.4, 700)
        fig(pop(g, 900), 300, 470, 1.4)
        question(g, 180, 400, 1.6, 1300)
      },
      rails(g) {
        track(g, L([-20, 440], [380, 440]), { t: 700 })
        track(g, [...B([128, 440], [190, 440], [210, 540], [280, 540]), ...L([280, 540], [380, 540]).slice(1)], { d: 300, t: 700 })
        ink(g, RR(150, 394, 30, 12, 3), { w: 2.6, d: 600, t: 300 })
        hatch(g, RR(150, 394, 30, 12, 3), 800, true)
        const lb = mk('g', { transform: 'rotate(-30 165 398)' }, g)
        const lev = st(lb, 'm3', '--m3: rotate(60deg); transform-origin: 165px 398px; --dl: 500ms; transition-duration: .6s')
        ink(lev, L([165, 398], [165, 360]), { w: 3.2, d: 800, t: 300 })
        ink(lev, E(165, 356, 5), { w: 2.6, d: 1000, t: 200 })
        const rm = st(st(g, 'h3'), 'f2', '--dl:900ms')
        const rmb = st(rm, 'blink', '--d:900ms')
        ink(rmb, L([150, 424], [236, 424]), { w: 3.2, t: 0 })
        arrow(rmb, L([226, 424], [250, 424]), { w: 3.2, t: 0, head: 11 })
        const rb = st(st(g, 'f3', '--dl:900ms'), 'blink', '--d:900ms')
        const bp = B([146, 424], [196, 424], [212, 516], [268, 522])
        dashes(rb, bp.slice(0, -4), { w: 3.2, t: 0, dash: 10, gap: 8 })
        arrow(rb, bp.slice(-6), { w: 3.2, t: 0, head: 11 })
        const t0 = mk('g', { transform: 'translate(-150 436)' }, g)
        const t1 = st(t0, 'm1', '--m1: translateX(110px); transition-duration: 2.6s')
        const t2 = st(t1, 'm2', '--m2: translateX(40px); transition-duration: 2.6s')
        const t3 = st(t2, 'm3', '--m3: translateX(18px); transition-duration: 2.6s')
        train(t3, 100)
        for (let i = 0; i < 5; i++) fig(st(g, 'x2', `--dl:${150 + i * 110}ms`), 268 + i * 19, 444, 1)
        fig(st(g, 'x3', '--dl:600ms'), 330, 544, 1)
      },
      jahr(g) {
        bigText(g, 180, 470, '1967', { size: 112 })
      },
      waage(g) {
        balance(g, 5, 1)
      },
      bruecke(g) {
        track(g, L([-20, 560], [380, 560]), { t: 600 })
        for (const x of [140, 312]) {
          ink(g, L([x, 424], [x, 548]), { w: 3.4, d: 300, t: 400 })
          ink(g, L([x + 10, 424], [x + 10, 548]), { w: 2.2, d: 350, t: 400 })
        }
        hatch(g, RR(118, 412, 222, 13, 3), 700)
        ink(g, RR(118, 412, 222, 13, 3), { w: 2.8, d: 400, t: 600 })
        ink(g, L([118, 382], [340, 382]), { w: 2.4, d: 600, t: 500 })
        for (let x = 128; x <= 334; x += 20) ink(g, L([x, 382], [x, 412]), { w: 1.8, d: 700 + (x - 128) * 2, t: 100 })
        fig(pop(g, 1000), 236, 410, 1.6, { w: 3.2 })
        hatch(pop(g, 1100, '50% 50%'), E(240, 384, 9, 11), 1100, true)
        const t0 = mk('g', { transform: 'translate(-130 556)' }, g)
        train(st(t0, 'm1', '--m1: translateX(124px); --dl: 600ms; transition-duration: 3s'), 300)
        crowd(g, 258, 564, 5, 19, 1, 1300)
        arrow(g, L([176, 360], [212, 368]), { w: 3, d: 1800, t: 300 })
      },
      erde(g) {
        globe(g, 180, 300, 110, 0, 42)
      },
      balken(g) {
        hbars(g, [
          { label: 'Weiche umstellen', v: 81, fmt: pct },
          { label: 'Mann von der Brücke stoßen', v: 51, fmt: pct, dense: true },
        ], { y: 300, gap: 120, max: 100 })
      },
    },
    scenes: [
      { t: HOOK(74), dur: 2600, gfx: { rails: { cls: 'a1' } } },
      { t: T('Ein Zug rast auf **fünf Menschen** zu.', 96), gfx: { rails: { cls: 'a1 a2' } } },
      { t: T('Stellst du die **Weiche** um, stirbt stattdessen einer auf dem Nebengleis.', 588), gfx: { rails: { cls: 'a1 a2 a3' } } },
      { t: T('Ausgedacht hat sich das die Philosophin **Philippa Foot**.', 516), gfx: { rails: { cls: 'a1 a2 a3', tf: [0.62, 68, -60] }, jahr: {} } },
      { t: T('Foot ging es eigentlich um eine Frage aus der Abtreibungsdebatte: Ist **Töten** schlimmer als Sterbenlassen?', 64), gfx: { jahr: {} } },
      { t: T('Den Namen „**Trolley-Problem**“ und die Variante mit der Brücke brachte die Philosophin Judith Jarvis Thomson ein.', 64), gfx: { rails: { cls: 'a1 a2 a3', tf: [0.8, 36, 60] } } },
      { t: T('Die meisten sagen: umstellen. Fünf retten ist besser als einen – so rechnet der **Utilitarismus**.', 70), gfx: { waage: { cls: 'a1' } } },
      { t: T('Der Utilitarismus fragt nur nach den **Folgen**:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['richtig', '=', 'was das meiste Wohl für alle bringt'], 330] } } },
      { t: T('In Zahlen:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['5 gerettet', '−', '1 geopfert', '=', '4 Leben mehr'], 330] } } },
      { t: T('Aber würdest du einen Mann von einer **Brücke** stoßen, um den Zug zu stoppen?', 74), gfx: { bruecke: { cls: 'a1' } } },
      {
        t: T('Hier zögern viel mehr – obwohl die **Rechnung** gleich ist: einer statt fünf.', 140),
        gfx: { bruecke: { cls: 'a1', tf: [0.5, 100, -158] }, waage: { cls: 'a1', tf: [0.62, 68, 190] } },
      },
      { t: T('Die **Pflichtethik** – etwa nach Immanuel Kant – sagt: Einen Menschen nur als Mittel zu benutzen, ist falsch.', 64), gfx: { f3: { draw: 'formel', args: [['Mensch', '≠', 'Mittel zum Zweck'], 330, 'Kant'] } } },
      { t: T('Bei der Weiche ist der Tod des einen eine **Nebenfolge**. Beim Stoßen ist er das Mittel.', 64), gfx: { vergleich: { args: [['Weiche', 'Zug wird umgelenkt', 'Tod als Nebenfolge'], ['Brücke', 'Mensch wird zum Bremsklotz', 'Tod als Mittel'], 290] } } },
      { t: T('Hirnscans zeigen: Beim Stoß-Szenario sind **Gefühls**-Areale stärker aktiv – wir zögern aus dem Bauch heraus.', 64), gfx: { hirn: {} } },
      { t: T('Eine Studie mit **70.000** Menschen aus 42 Ländern hat genau das gefragt.', 474), gfx: { erde: {} } },
      { t: T('Weiche: rund **80 %** ja. Stoßen: nur etwa die **Hälfte** – in allen Ländern dieselbe Reihenfolge.', 500), gfx: { erde: { tf: [0.34, 10, 6], o: 0.9 }, balken: {} } },
      { t: T('Die Daten stammen von der Website „**Moral Machine**“ des MIT – gebaut, um Entscheidungen selbstfahrender Autos zu erforschen.', 64), gfx: { balken: { tf: [0.8, 36, 60] } } },
      { t: T('Denn genau diese Frage wird praktisch: Wie soll ein **autonomes Auto** entscheiden, wenn ein Unfall unvermeidbar ist?', 64), gfx: { autonom: {} } },
      { t: T('Ganz real wurde die Frage 2006: Darf ein entführtes **Passagierflugzeug** abgeschossen werden, um mehr Menschen zu retten?', 64), gfx: { z4: { draw: 'zahl', args: ['2006', 'Urteil zum Luftsicherheitsgesetz', 420] } } },
      { t: T('Das Bundesverfassungsgericht sagte **nein**: Die Menschenwürde verbietet, Leben gegen Leben aufzurechnen.', 64), gfx: { f4: { draw: 'formel', args: [['Leben', '≠', 'Rechengröße'], 330] } } },
      recap(
        [{ gfx: 'rails', cls: 'a1 a2 a3' }, { gfx: 'waage', cls: 'a1' }, { gfx: 'bruecke', cls: 'a1' }, { gfx: 'balken' }],
        ['Weiche: einer statt fünf', 'Utilitarismus: Folgen zählen', 'Brücke: Mensch als Mittel', '81 % zu 51 %'],
      ),
    ],
    summary: ['Philippa Foot, 1967.', 'Weiche: rund 80 % ja, Brücke: rund die Hälfte.', 'Handeln oder geschehen lassen – Kern der Ethikdebatte.'],
    sources: ['Foot 1967, Oxford Review', 'Awad et al. 2020, PNAS'],
  },
  {
    id: 'stoiker',
    area: 'PHIL',
    day: 85,
    hook: 'Sind Stoiker Menschen ohne Gefühle?',
    mood: 'ruhig',
    ambience: 'uhr',
    images: [img('marc-aurel'), img('sanduhr')],
    draw: {
      halle(g) {
        ink(g, [[30, 300], [180, 220], [330, 300], [30, 300]], { w: 3.2, t: 700 })
        hatch(g, [[40, 296], [180, 226], [320, 296]], 600, true)
        for (let k = 0; k < 6; k++) {
          ink(g, L([60 + k * 48, 310], [60 + k * 48, 520]), { w: 3.6, d: 300 + k * 100, t: 300 })
          ink(g, L([48 + k * 48, 310], [72 + k * 48, 310]), { w: 2.6, d: 300 + k * 100, t: 100 })
        }
        ink(g, RR(20, 520, 320, 22, 3), { w: 3, d: 900, t: 400 })
        text(g, 180, 590, 'Stoa poikile – die bunte Säulenhalle', { anchor: 'middle', d: 1200 })
      },
      zeit(g) {
        const at = (y: number) => (y + 320) / 520
        timeline(g, 30, 330, 430, [
          { at: at(-300), label: 'um 300 v. Chr.', sub: 'Zenon', up: true },
          { at: at(50), label: 'um 50', sub: 'Seneca' },
          { at: at(100), label: 'um 100', sub: 'Epiktet', up: true },
          { at: at(170), label: 'um 170', sub: 'Marc Aurel', big: true },
        ], 0, 500)
      },
      gesichter(g) {
        hatch(g, E(100, 400, 62), 500, true)
        face(g, 100, 400, 62, 0)
        text(g, 100, 500, 'ungerührt', { anchor: 'middle', d: 600 })
        cross(g, 100, 400, 2.8, 1200)
        face(g, 260, 400, 62, 400)
        blank(g, RR(236, 420, 48, 10, 2))
        ink(g, B([236, 422], [248, 438], [272, 438], [284, 422]), { w: 2.6, d: 900, t: 300 })
        text(g, 260, 500, 'gelassen', { anchor: 'middle', d: 1000 })
        check(g, 260, 540, 1.2, 1500)
      },
      sturm(g) {
        const cloud: P[] = [...B([90, 330], [60, 330], [60, 280], [100, 280]), ...B([100, 280], [100, 230], [170, 220], [180, 260]).slice(1), ...B([180, 260], [200, 230], [270, 240], [260, 290]).slice(1), ...B([260, 290], [300, 290], [300, 330], [270, 330]).slice(1), [90, 330]]
        const c = st(g, 'm1', '--m1: translate(-260px, -40px); --dl: 300ms; transition-duration: 1.6s')
        hatch(c, cloud, 500, true)
        ink(c, cloud, { w: 3, t: 700 })
        ink(c, [[170, 340], [150, 390], [178, 390], [156, 450]], { w: 4, d: 700, t: 300 })
        text(c, 180, 490, 'Wut, Panik', { anchor: 'middle', d: 900 })
        const sun = st(g, 'f1', '--dl:1200ms')
        ink(sun, E(200, 380, 44), { w: 3, t: 0 })
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2
          ink(sun, L([200 + Math.cos(a) * 56, 380 + Math.sin(a) * 56], [200 + Math.cos(a) * 76, 380 + Math.sin(a) * 76]), { w: 2.4, t: 0 })
        }
        text(sun, 200, 500, 'Gelassenheit', { anchor: 'middle', fade: false })
      },
      kreise(g) {
        ink(g, E(180, 400, 150), { w: 3, t: 900 })
        hatch(g, E(180, 400, 72), 800, true)
        blank(g, E(180, 400, 70))
        ink(g, E(180, 400, 72), { w: 3.4, d: 400, t: 700 })
        text(g, 180, 392, 'Urteil', { anchor: 'middle', size: 19, d: 900 })
        text(g, 180, 420, 'Handeln', { anchor: 'middle', size: 19, d: 1000 })
        for (const [x, y, s, d] of [[180, 296, 'Wetter', 1300], [76, 450, 'andere', 1450], [284, 450, 'Vergangenes', 1600]] as const) text(g, x, y, s, { anchor: 'middle', d, cls: 's' })
        text(g, 180, 600, 'in deiner Macht: innen', { anchor: 'middle', d: 1800 })
      },
      kette(g) {
        const labels = ['Ding', 'Meinung', 'Gefühl']
        labels.forEach((l, i) => {
          box(g, 20 + i * 116, 360, 96, 56, l, i * 400, 16)
          if (i) arrow(g, L([20 + i * 116 - 18, 388], [20 + i * 116 - 4, 388]), { w: 2.4, d: i * 400 - 100, t: 150, head: 7 })
        })
        ring(g, 184, 388, 64, 44, 1400)
        const th = st(g, 'f1', '--dl:300ms')
        arrow(th, B([184, 540], [184, 500], [184, 470], [184, 440]), { w: 2.6, t: 0 })
        text(th, 184, 570, 'hier setzt die Therapie an', { anchor: 'middle', fade: false })
      },
    },
    scenes: [
      { t: HOOK(470), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [45, 30, 1.2], cam2: [45, 30, 1.35] } } },
      { t: T('Die Stoa entstand um 300 v. Chr. in Athen. Ihr Name kommt von einer **Säulenhalle**, in der Zenon lehrte.', 64), gfx: { halle: {} } },
      { t: T('Ihre bekanntesten Köpfe lebten Jahrhunderte später – im **Römischen Reich**.', 64), gfx: { zeit: {} } },
      {
        t: { text: '„Stoisch“ heißt heute: ungerührt. Die antiken **Stoiker** – Seneca, Epiktet, Marc Aurel – meinten das nicht.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { m: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [45, 25, 2] } },
        gfx: { gesichter: { tf: [1, 0, 40] } },
      },
      { t: T('Sie wollten Freiheit von zerstörerischen Leidenschaften wie **Wut** und **Panik** – nicht von Gefühlen.', 64), gfx: { sturm: { cls: 'a1' } } },
      { t: T('Leidenschaften wie Wut galten als **Fehlurteile**. Gute Gefühle wollten sie dagegen pflegen.', 64), gfx: { vergleich: { args: [['meiden', 'Wut', 'Angst', 'Gier'], ['pflegen', 'Freude', 'Fürsorge', 'Vorsicht'], 290] } } },
      { t: T('Ihr Kern: Unterscheide, was in deiner **Macht** liegt – und was nicht.', 64), gfx: { kreise: {} } },
      { t: T('Epiktet war selbst als **Sklave** geboren. Über seine Lage hatte er keine Macht – über seine Haltung schon.', 64), gfx: { kreise: {} } },
      { t: T('Stoisch gerechnet:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Ärger', '=', 'Ereignis', '+', 'meine Bewertung'], 330] } } },
      { t: T('Epiktet: _Nicht die Dinge beunruhigen uns, sondern unsere Meinungen über die Dinge._', 64), gfx: { kette: {} } },
      { t: T('Das inspirierte die **kognitive Verhaltenstherapie**: Albert Ellis und Aaron Beck beriefen sich auf die Stoa.', 64), gfx: { kette: { cls: 'a1' } } },
      { t: T('Ellis entwickelte daraus das **ABC-Modell**:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['A: Auslöser', '→', 'B: Bewertung', '→', 'C: Folge'], 330] } } },
      { t: T('Ein Beispiel: Jemand drängelt sich in der Schlange vor dich – das ist **A**, der Auslöser.', 64), gfx: { e1: { draw: 'formel', args: [['A: jemand drängelt sich vor'], 330] } } },
      { t: T('Jetzt entscheidet **B**, die Bewertung, über das Gefühl:', 64), gfx: { e2: { draw: 'formel', args: [['„Der will mich ärgern“', '→', 'Wut'], 290] }, e3: { draw: 'formel', args: [['„Der hat es wohl eilig“', '→', 'Gelassenheit'], 420] } } },
      { t: T('Das Ereignis ist dasselbe – nur die **Bewertung** ändert das Gefühl. Genau dort setzen Stoa und Therapie an.', 64), gfx: { kette: { cls: 'a1' } } },
      {
        t: T('Marc Aurel schrieb seine „**Selbstbetrachtungen**“ als Tagebuch, oft im Feldlager – gedacht nur für sich selbst.', 470),
        pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [45, 25, 1.8], cam2: [45, 25, 2.0] } },
      },
      {
        t: T('Und _Memento mori_ hieß für sie: Nutze die Zeit.', 486, { kind: 'big' }),
        pics: { s: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.2] } },
      },
      { t: T('Seneca: Nicht weil wir wenig Zeit haben, ist das Leben kurz – sondern weil wir viel davon **vergeuden**.', 64), gfx: { zahl: { args: ['carpe diem', 'nutze den Tag', 420] } } },
      { t: T('Stoische Übungen, die bis heute empfohlen werden:', 64, { kind: 'big' }), gfx: { punkte: { args: [['abends den Tag durchgehen', 'Schlimmes vorab durchdenken', 'fragen: Was liegt bei mir?'], 320] } } },
      { t: T('Zenon kam als Kaufmann nach Athen – nach einem **Schiffbruch**, so die Legende. In einem Buchladen fand er zur Philosophie.', 64), gfx: { halle: {} } },
      { t: T('Seneca war Berater von Kaiser **Nero** – und wurde von ihm 65 n. Chr. in den Tod gezwungen.', 64), gfx: { zeit: {} } },
      recap(
        [{ gfx: 'sturm', cls: 'a1' }, { gfx: 'kreise' }, { gfx: 'kette', cls: 'a1' }, { pic: 0, id: 'm', cam: [45, 30, 1.2] }],
        ['frei von Wut und Panik', 'was liegt in meiner Macht?', 'Vorbild der Verhaltenstherapie', 'Marc Aurel'],
      ),
    ],
    summary: ['Ziel: Freiheit von Wut und Panik, nicht von Gefühlen.', 'Trenne, was du ändern kannst, von dem, was nicht.', 'Vorbild der kognitiven Verhaltenstherapie.'],
    sources: ['Epiktet, Handbüchlein der Moral 5', 'Robertson 2019, The Philosophy of Cognitive-Behavioural Therapy'],
  },
  {
    id: 'goldfisch',
    area: 'DENK',
    day: 6,
    hook: 'Haben Goldfische ein Drei-Sekunden-Gedächtnis?',
    mood: 'verspielt',
    ambience: 'blasen',
    images: [img('goldfisch')],
    draw: {
      glas(g) {
        const bowl: P[] = [...B([120, 240], [20, 300], [40, 560], [180, 560]), ...B([180, 560], [320, 560], [340, 300], [240, 240]).slice(1)]
        ink(g, bowl, { w: 3.4, t: 900 })
        ink(g, L([110, 240], [250, 240]), { w: 3, d: 500, t: 300 })
        hatch(g, [...B([64, 320], [40, 420], [80, 556], [180, 556]), ...B([180, 556], [280, 556], [320, 420], [296, 320]).slice(1)], 700)
        const sw = group(g)
        fish(sw, 180, 430, 1.3, 800)
        sw.animate([{ transform: 'translateX(-70px)' }, { transform: 'translateX(70px)' }], { duration: 3400, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' })
        for (const [x, d] of [[150, 0], [210, 700], [180, 1400]] as const) {
          const b = group(g)
          ink(b, E(x, 380, 6), { w: 2, d: 1000, t: 200 })
          b.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-60px)', opacity: 0 }], { duration: 2200, delay: d, iterations: Infinity })
        }
        const q = st(g, 'x1', '--o:50% 50%;--dl:500ms')
        text(q, 180, 210, '3 Sekunden?', { anchor: 'middle', size: 26, fade: false })
      },
      hebel(g) {
        const water: P[] = [[30, 260], [330, 260], [330, 580], [30, 580], [30, 260]]
        ink(g, water, { w: 3, t: 800 })
        fish(g, 140, 470, 1.4, 400)
        ink(g, RR(250, 520, 40, 16, 4), { w: 2.6, d: 600, t: 300 })
        ink(g, L([270, 520], [240, 440]), { w: 3.4, d: 800, t: 300 })
        ink(g, E(238, 434, 7), { w: 2.6, d: 1000, t: 200 })
        for (let k = 0; k < 4; k++) {
          const p = group(g)
          mk('circle', { cx: 140 + k * 14, cy: 290, r: 4, class: 'k' }, p)
          p.animate([{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: 0.1 }, { transform: 'translateY(140px)', opacity: 1 }], { duration: 2000, delay: 1200 + k * 250, iterations: Infinity })
        }
        clock(g, 290, 340, 34, 240, 0, 1200)
      },
      labyrinth(g) {
        const walls: P[][] = [
          [[40, 260], [320, 260], [320, 580], [40, 580], [40, 330]],
          [[110, 260], [110, 470]],
          [[110, 470], [200, 470]],
          [[180, 330], [180, 400], [250, 400]],
          [[250, 330], [250, 520]],
          [[40, 520], [180, 520], [180, 580]],
        ]
        walls.forEach((w, i) => ink(g, w.length > 2 ? w.flatMap((p, k) => (k ? L(w[k - 1], p).slice(1) : [p])) : L(w[0], w[1]), { w: 3.4, d: i * 150, t: 400 }))
        dashes(g, [...L([60, 300], [76, 300]), ...L([76, 300], [76, 500]).slice(1), ...L([76, 500], [150, 500]).slice(1), ...L([150, 500], [150, 300]).slice(1), ...L([150, 300], [215, 300]).slice(1), ...L([215, 300], [215, 365]).slice(1), ...L([215, 365], [290, 365]).slice(1), ...L([290, 365], [290, 550]).slice(1)], { w: 2.4, d: 1200, step: 60 })
        fish(pop(g, 2800, '50% 50%'), 290, 548, 0.6)
      },
      slots(g) {
        for (let k = 0; k < 4; k++) ink(g, RR(28 + k * 80, 330, 64, 64, 10), { w: 3, d: k * 150, t: 400 })
        const items = [
          (p: Element) => ink(p, E(60, 362, 18), { w: 3, t: 0 }),
          (p: Element) => star(p, 140, 362, 20, { t: 0, w: 3 }),
          (p: Element) => ink(p, [[220, 344], [238, 378], [202, 378], [220, 344]], { w: 3, t: 0 }),
          (p: Element) => ink(p, RR(282, 346, 32, 32, 3), { w: 3, t: 0 }),
        ]
        items.forEach((f, i) => f(pop(g, 700 + i * 300, '50% 50%')))
        const fifth = st(g, 'm1', '--m1: translate(40px, 160px) rotate(40deg); --dl: 2400ms; transform-origin: 180px 250px')
        ink(pop(fifth, 2000, '50% 50%'), [[164, 236], [196, 236], [180, 264], [164, 236]], { w: 3, t: 0 })
        text(g, 180, 460, '≈ 4 Dinge gleichzeitig', { anchor: 'middle', size: 20, d: 1800 })
      },
      karten(g) {
        for (let k = 0; k < 3; k++) {
          blank(g, RR(90 + k * 10, 300 - k * 10, 180, 120, 12))
          ink(g, RR(90 + k * 10, 300 - k * 10, 180, 120, 12), { w: 2.8, d: k * 200, t: 500 })
        }
        const card = group(g)
        blank(card, RR(110, 280, 180, 120, 12))
        ink(card, RR(110, 280, 180, 120, 12), { w: 3, d: 600, t: 500 })
        question(card, 200, 350, 1, 900)
        card.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)', offset: 0.5 }, { transform: 'scaleX(1)' }], { duration: 900, delay: 1800, iterations: Infinity, iterationStart: 0, direction: 'normal', easing: 'ease-in-out', composite: 'replace' })
        card.style.transformOrigin = '200px 340px'
      },
    },
    scenes: [
      { t: HOOK(70), gfx: { glas: {} } },
      { t: T('Der Mythos ist praktisch: Der Fisch dreht seine Runde – und alles ist wieder **neu**.', 64), gfx: { glas: { cls: 'a1', tf: [0.8, 36, 110] } } },
      {
        t: T('Nur stimmt er nicht: Goldfische können sich Dinge **monatelang** merken.', 486),
        pics: { f: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [40, 45, 1.05], cam2: [40, 45, 1.25] } },
      },
      { t: T('Goldfische stammen von einer wilden **Karausche** aus China ab – gezüchtet seit über 1.000 Jahren.', 64), gfx: { zahl: { args: ['1.000', 'Jahre Zucht in China', 420] } } },
      { t: T('In der Natur müssen Fische sich viel **merken** – ein kurzes Gedächtnis wäre tödlich.', 64), gfx: { punkte: { args: [['Futterplätze', 'Verstecke', 'Feinde'], 330] } } },
      { t: T('Im Versuch lernten sie, für Futter einen **Hebel** zu drücken – sogar nur zu einer bestimmten Tageszeit.', 64), gfx: { hebel: {} } },
      { t: T('Der Versuch stammt aus **Plymouth**: Die Fische drückten den Hebel bald fast nur noch in ihrer Futterstunde.', 64), gfx: { hebel: {} } },
      { t: T('Andere unterschieden Farben und Töne oder fanden den Weg durch kleine **Labyrinthe**.', 64), gfx: { labyrinth: {} } },
      { t: T('Und du? Dein Arbeitsgedächtnis hält nur rund **vier** Dinge gleichzeitig.', 64), gfx: { slots: { cls: 'a1' } } },
      { t: T('Der Psychologe George Miller sprach 1956 noch von sieben, plus minus zwei. Heute geht man eher von **etwa vier** aus.', 64), gfx: { f1: { draw: 'formel', args: [['Arbeitsgedächtnis', '≈', '4 Einheiten'], 330] } } },
      { t: T('Ein Trick: **Bündeln**. 0 1 7 6 4 5 9 2 sind acht Ziffern – 0176 4592 nur zwei Blöcke.', 64), gfx: { f2: { draw: 'formel', args: [['8 Ziffern', '→', '2 Blöcke'], 330] } } },
      { t: T('Was bleiben soll, musst du **abrufen** und wiederholen – genau dafür gibt es die Karteikarten in dieser App.', 64), gfx: { karten: {} } },
      { t: T('Das Langzeitgedächtnis dagegen hat praktisch **keine Grenze** – entscheidend ist, wie gut man es wieder abruft.', 64), gfx: { zahl: { args: ['∞', 'Platz im Langzeitgedächtnis', 420] } } },
      { t: T('Am besten mit wachsenden Pausen:', 64, { kind: 'big' }), gfx: { f3: { draw: 'formel', args: [['lernen', '→', 'kurze Pause', '→', 'abrufen', '→', 'längere Pause', '→', 'abrufen'], 300, 'verteiltes Wiederholen'] } } },
      { t: T('Ein Plan, der gut funktioniert:', 64, { kind: 'big' }), gfx: { w1: { draw: 'formel', args: [['heute', '→', 'morgen', '→', 'in 3 Tagen', '→', 'in 1 Woche', '→', 'in 1 Monat'], 300] } } },
      { t: T('Jedes Mal ist das Erinnern ein bisschen **schwerer** – und genau diese Mühe festigt. Die Karteikarten in dieser App planen die Abstände automatisch.', 64), gfx: { karten: {} } },
      { t: T('Kleine runde Gläser sind für sie schlecht: zu wenig Sauerstoff, kein Platz. **Rom** hat sie 2005 sogar verboten.', 64), gfx: { glas: { tf: [0.8, 36, 100] } } },
      { t: T('Und Fische können noch mehr: **Schützenfische** lernten im Versuch, menschliche Gesichter auseinanderzuhalten.', 450), pics: { f: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [40, 45, 1.3] } } },
      recap(
        [{ gfx: 'glas', cls: 'a1' }, { gfx: 'hebel' }, { gfx: 'slots', cls: 'a1' }, { gfx: 'karten' }],
        ['3 Sekunden? Mythos', 'Hebel zur richtigen Zeit', 'Arbeitsgedächtnis: etwa 4', 'Abrufen und wiederholen'],
      ),
    ],
    summary: ['Goldfische erinnern sich monatelang.', 'Sie lernen sogar Fütterungszeiten.', 'Menschliches Arbeitsgedächtnis: etwa vier Einheiten.'],
    sources: ['Gee, Stephenson & Wright 1994, J Exp Anal Behav', 'Cowan 2001, Behavioral and Brain Sciences'],
  },
  {
    id: 'lerntypen',
    area: 'DENK',
    day: 6,
    hook: 'Bist du ein visueller Lerntyp?',
    mood: 'ruhig',
    images: [img('bibliothek')],
    draw: {
      typen(g) {
        eye(pop(g, 0, '50% 50%'), 70, 420, 0.9, 0)
        // Ohr
        const ear = pop(g, 400, '50% 50%')
        ink(ear, [...B([170, 450], [150, 440], [150, 380], [180, 376]), ...B([180, 376], [210, 372], [214, 410], [196, 424]).slice(1), ...B([196, 424], [186, 432], [190, 446], [178, 452]).slice(1)], { w: 3, t: 0 })
        ink(ear, B([172, 412], [168, 396], [186, 390], [192, 402]), { w: 2.2, t: 0 })
        // Hand
        const hand = pop(g, 800, '50% 50%')
        ink(hand, RR(266, 400, 46, 54, 14), { w: 3, t: 0 })
        for (let k = 0; k < 4; k++) ink(hand, L([272 + k * 11, 404], [272 + k * 11, 370 - (k === 0 || k === 3 ? 0 : 8)]), { w: 3, t: 0 })
        ink(hand, L([266, 426], [250, 406]), { w: 3, t: 0 })
        text(g, 70, 500, 'visuell', { anchor: 'middle', d: 300 })
        text(g, 180, 500, 'auditiv', { anchor: 'middle', d: 700 })
        text(g, 290, 500, 'haptisch', { anchor: 'middle', d: 1100 })
      },
      gleich(g) {
        vbars(g, [{ label: 'passend', v: 70, fmt: none }, { label: 'unpassend', v: 70, fmt: none, dense: true }], { x: 70, base: 560, w: 80, gap: 140, h: 280, max: 100 })
        bigText(g, 180, 430, '=', { size: 80, d: 1400, serif: false })
        text(g, 40, 250, 'Lernerfolg', { cls: 's', d: 300 })
      },
      tipps(g) {
        const rows: [number, string][] = [[260, 'Abrufen'], [380, 'in Abständen'], [500, 'Bild + Wort']]
        rows.forEach(([y, l], i) => {
          const d = i * 500
          text(g, 140, y + 8, l, { size: 22, d: d + 200 })
          const ic = pop(g, d, '50% 50%')
          if (i === 0) {
            ink(ic, RR(40, y - 26, 70, 50, 8), { w: 2.8, t: 0 })
            question(ic, 75, y + 4, 0.55)
          } else if (i === 1) {
            ink(ic, L([36, y], [116, y]), { w: 2.8, t: 0 })
            for (const x of [40, 56, 84, 112]) mk('circle', { cx: x, cy: y, r: 5, class: 'k' }, ic)
          } else {
            ink(ic, RR(40, y - 26, 34, 50, 4), { w: 2.6, t: 0 })
            ink(ic, [[44, y + 18], [56, y], [70, y + 18]], { w: 2, t: 0 })
            for (let k = 0; k < 3; k++) ink(ic, L([82, y - 14 + k * 12], [112, y - 14 + k * 12]), { w: 2, t: 0 })
          }
        })
      },
      karte(g) {
        const land: P[] = [...B([110, 260], [160, 230], [250, 250], [270, 300]), ...B([270, 300], [300, 360], [260, 420], [280, 480]).slice(1), ...B([280, 480], [250, 560], [150, 560], [120, 500]).slice(1), ...B([120, 500], [60, 440], [90, 340], [110, 260]).slice(1)]
        hatch(g, land, 700)
        ink(g, land, { w: 3.2, t: 900 })
        const pin = pop(g, 1200)
        blank(pin, E(200, 380, 14))
        ink(pin, [...B([200, 410], [180, 380], [180, 360], [200, 360]), ...B([200, 360], [220, 360], [220, 380], [200, 410]).slice(1)], { w: 3, t: 0 })
        mk('circle', { cx: 200, cy: 372, r: 4, class: 'k' }, pin)
      },
    },
    scenes: [
      { t: HOOK(70), gfx: { typen: {} } },
      { t: T('Viele haben in der Schule einen **Lerntyp-Test** gemacht. Die Idee: Im passenden Stil lernt man besser.', 64), gfx: { typen: { tf: [0.9, 18, 40] } } },
      { t: T('In einer Umfrage von 2012 hielten **93 Prozent** der befragten Lehrkräfte das Konzept für richtig.', 64), gfx: { zahl: { args: ['93 %', 'der befragten Lehrkräfte glaubten daran', 420] } } },
      { t: T('Dabei gibt es über **70** verschiedene Lerntyp-Modelle – je nach Test bist du etwas anderes.', 64), gfx: { z2: { draw: 'zahl', args: ['71', 'Lerntyp-Modelle in einer Übersicht von 2004', 420] } } },
      {
        t: T('2008 prüften Harold Pashler und Kollegen die Forschung dazu.', 486),
        pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 55, 1.05], cam2: [50, 55, 1.2] } },
      },
      { t: T('Für einen echten Nachweis bräuchte es diesen **Versuchsaufbau**:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Lerntyp bestimmen', '→', 'zufällig passend oder unpassend unterrichten', '→', 'gleicher Test'], 300] } } },
      { t: T('Kaum eine Studie testete es sauber – und die guten fanden **keinen Vorteil**. Vorlieben gibt es, einen Lerneffekt nicht.', 64), gfx: { gleich: {} } },
      { t: T('Dass sich Lernen im Lieblingsstil gut **anfühlt**, ist kein Beweis: Gefühlt leichtes Lernen bleibt oft schlechter hängen.', 64), gfx: { gleich: {} } },
      { t: T('Was wirklich hilft, gilt für fast alle:', 64, { kind: 'big' }), gfx: { tipps: {} } },
      { t: T('**Abrufen**: Teste dich selbst, statt nur durchzulesen – das Erinnern selbst festigt das Wissen.', 64), gfx: { f2: { draw: 'formel', args: [['selbst abfragen', '>', 'nochmal lesen'], 330] } } },
      { t: T('**Abstände**: Dreimal 20 Minuten an verschiedenen Tagen bringen mehr als eine Stunde am Stück.', 64), gfx: { f3: { draw: 'formel', args: [['3 × 20 Minuten verteilt', '>', '60 Minuten am Stück'], 330] } } },
      { t: T('**Bild + Wort**: Beides zusammen gibt dem Gedächtnis zwei Wege zum selben Wissen.', 64), gfx: { tipps: {} } },
      { t: T('Das Thema bestimmt die Form: Geografie lernt jeder besser mit **Karte**.', 64), gfx: { karte: {} } },
      { t: T('Nicht der Lerntyp, sondern der **Stoff** entscheidet: Musik lernt man übers Hören, Chemie mit Formeln und Modellen.', 64), gfx: { karte: { tf: [0.8, 36, 80] } } },
      { t: T('Lerntyp-Tests messen **Vorlieben** – nicht, wie gut jemand auf welchem Weg tatsächlich lernt.', 64), gfx: { typen: { tf: [0.9, 18, 40] } } },
      { t: T('Eine Studie 2018: Studierende kannten ihren Lerntyp, lernten aber kaum danach – und wer es tat, schnitt **nicht besser** ab.', 64), gfx: { gleich: {} } },
      { t: T('Beliebt ist oft nicht wirksam:', 64, { kind: 'big' }), gfx: { vergleich: { args: [['beliebt', 'Markieren', 'nochmal lesen', 'Zusammenfassung abschreiben'], ['wirksam', 'sich selbst testen', 'verteilt lernen', 'erklären, warum'], 290] } } },
      { t: T('Und **Schlaf** gehört dazu: Nachts festigt das Gehirn, was tagsüber gelernt wurde.', 64), gfx: { z3: { draw: 'zahl', args: ['8 h', 'Schlaf: Festigen des Gelernten', 420] } } },
      { t: T('Gute Nachricht: Was wirklich hilft, kostet **nichts** – nur etwas Überwindung.', 64), gfx: { tipps: {} } },
      recap(
        [{ gfx: 'typen' }, { gfx: 'gleich' }, { gfx: 'tipps' }, { gfx: 'karte' }],
        ['visuell, auditiv, haptisch', 'passend = unpassend', 'Abrufen, Abstände, Bild + Wort', 'Stoff bestimmt die Form'],
      ),
    ],
    summary: ['Lernvorlieben gibt es, Lerntyp-Effekte nicht.', 'Pashler et al. 2008: kein Beleg.', 'Für alle wirksam: Abrufen, Abstände, Bild + Wort.'],
    sources: ['Pashler et al. 2008, Psychological Science in the Public Interest', 'Dunlosky et al. 2013, PSPI'],
  },
  {
    id: 'stoerche',
    area: 'DENK',
    day: 54,
    hook: 'Bringt der Storch die Babys?',
    mood: 'hell',
    ambience: 'wind',
    images: [img('storch')],
    draw: {
      skala(g) {
        ink(g, L([40, 420], [320, 420]), { w: 3, t: 600 })
        for (const [v, l] of [[-1, '−1'], [0, '0'], [1, '+1']] as const) {
          ink(g, L([180 + v * 140, 410], [180 + v * 140, 430]), { w: 2.6, d: 400, t: 100 })
          text(g, 180 + v * 140, 456, l, { anchor: 'middle', d: 500 })
        }
        text(g, 40, 500, 'gegenläufig', { cls: 's', d: 700 })
        text(g, 180, 500, 'kein Zusammenhang', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 320, 500, 'gleichläufig', { anchor: 'end', cls: 's', d: 900 })
        const m = pop(g, 1200, '50% 100%')
        ink(m, [[180 + 0.62 * 140, 410], [180 + 0.62 * 140 - 10, 386], [180 + 0.62 * 140 + 10, 386], [180 + 0.62 * 140, 410]], { w: 2.6, t: 0 })
        text(m, 180 + 0.62 * 140, 376, '0,62', { anchor: 'middle', size: 20, fade: false })
      },
      streu(g) {
        ink(g, L([50, 580], [330, 580]), { w: 3, t: 500 })
        ink(g, L([50, 580], [50, 250]), { w: 3, t: 500 })
        text(g, 60, 262, 'Geburten', { cls: 's', d: 300 })
        text(g, 326, 604, 'Storchenpaare', { cls: 's', anchor: 'end', d: 300 })
        let seed = 3
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 17; i++) {
          const t = Math.pow(rnd(), 1.6)
          const x = 70 + t * 240
          const y = 560 - t * 260 + (rnd() - 0.5) * 60
          mk('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 5, class: 'k pop', style: `--d:${500 + i * 70}ms; transform-origin: 50% 50%` }, g)
        }
        ink(g, L([60, 572], [320, 300]), { w: 2.6, d: 1900, t: 600 })
        text(g, 300, 290, '17 Länder', { anchor: 'end', d: 2200 })
      },
      drei(g) {
        box(g, 100, 220, 160, 56, 'Landesgröße', 0, 18)
        box(g, 20, 470, 130, 56, 'Störche', 500, 18)
        box(g, 210, 470, 130, 56, 'Geburten', 700, 18)
        arrow(g, L([150, 280], [92, 464]), { w: 2.8, d: 900, t: 400 })
        arrow(g, L([210, 280], [268, 464]), { w: 2.8, d: 1100, t: 400 })
        dashes(g, L([154, 498], [206, 498]), { w: 2.4, d: 1500 })
        const x = st(g, 'x1', '--o:50% 50%;--dl:300ms')
        cross(x, 180, 498, 1.4)
        text(x, 180, 580, 'keine Ursache', { anchor: 'middle', fade: false, size: 18 })
      },
      eis(g) {
        const cone: P[] = [[60, 420], [110, 420], [85, 520], [60, 420]]
        hatch(g, cone, 400, true)
        ink(g, cone, { w: 2.8, t: 500 })
        ink(g, E(85, 404, 26, 22, 160, 380), { w: 2.8, d: 300, t: 500 })
        text(g, 85, 560, 'Eisverkauf', { anchor: 'middle', d: 500 })
        face(g, 275, 450, 44, 400)
        for (const s of [-1, 1]) hatch(g, E(275 + s * 24, 462, 9, 6), 900, true)
        text(g, 275, 560, 'Sonnenbrand', { anchor: 'middle', d: 700 })
        const sun = st(g, 'f1', '--dl:200ms')
        ink(sun, E(180, 270, 30), { w: 3, t: 0 })
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2
          ink(sun, L([180 + Math.cos(a) * 40, 270 + Math.sin(a) * 40], [180 + Math.cos(a) * 54, 270 + Math.sin(a) * 54]), { w: 2.2, t: 0 })
        }
        text(sun, 180, 222, 'Sommer', { anchor: 'middle', fade: false })
        arrow(sun, B([150, 296], [120, 330], [100, 350], [92, 376]), { w: 2.4, t: 0 })
        arrow(sun, B([210, 296], [240, 330], [260, 360], [268, 396]), { w: 2.4, t: 0 })
      },
      lupe(g) {
        question(g, 160, 420, 2.6)
        const l = st(g, 'float')
        ink(l, E(240, 360, 50), { w: 3.4, d: 600, t: 600 })
        ink(l, L([276, 396], [320, 440]), { w: 7, d: 1000, t: 300 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [45, 45, 1.05], cam2: [45, 45, 1.25] } } },
      { t: T('Der Statistiker Robert Matthews zeigte 2000 augenzwinkernd: Storchenpaare und **Geburten** hängen in Europa zusammen.', 64), gfx: { streu: {} } },
      { t: T('Er nahm Daten aus 17 Ländern: Storchenpaare und Geburten pro Jahr. Der Zusammenhang war **stark**.', 64), gfx: { zahl: { args: ['0,62', 'Korrelation Störche – Geburten', 420] } } },
      { t: T('Eine Korrelation misst, ob zwei Größen gemeinsam steigen und fallen – von **minus eins** bis plus eins.', 64), gfx: { skala: {} } },
      { t: T('Zufall war kaum die Erklärung: Die Wahrscheinlichkeit dafür lag unter **1 Prozent**.', 64), gfx: { f1: { draw: 'formel', args: [['Chance auf reinen Zufall', '≈', '0,8 %'], 330] } } },
      { t: T('Der Trick: Große Länder haben mehr Fläche – also mehr Störche **und** mehr Menschen.', 64), gfx: { drei: {} } },
      { t: T('Eine **dritte Größe** steckt hinter beidem. Korrelation heißt nicht Kausalität.', 64), gfx: { drei: { cls: 'a1' } } },
      { t: T('Solche **Scheinkorrelationen** sind überall: Eisverkauf und Sonnenbrand steigen gemeinsam …', 64), gfx: { eis: {} } },
      { t: T('… wegen des **Sommers**.', 64, { kind: 'big' }), gfx: { eis: { cls: 'a1' } } },
      { t: T('Manche Zusammenhänge sind reiner **Zufall**: Jahre mit mehr Nicolas-Cage-Filmen hatten auch mehr Ertrunkene in Pools.', 64), gfx: { z3: { draw: 'zahl', args: ['Zufall', 'Cage-Filme und Pool-Unfälle', 420] } } },
      { t: T('Für jede Korrelation gibt es mehrere mögliche **Erklärungen**:', 64, { kind: 'big' }), gfx: { punkte: { args: [['A verursacht B', 'B verursacht A', 'C verursacht beides', 'reiner Zufall'], 300] } } },
      { t: T('Ursachen beweisen erst **Experimente**:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['zufällig aufteilen', '→', 'nur eins ändern', '→', 'vergleichen'], 330] } } },
      { t: T('Bei Ländern kann man die Größe auch **herausrechnen**: Raten statt Gesamtzahlen vergleichen.', 64), gfx: { s1: { draw: 'formel', args: [['Geburten', '÷', 'Einwohner', '=', 'Geburtenrate'], 300] }, s2: { draw: 'formel', args: [['Storchenpaare', '÷', 'Fläche', '=', 'Storchendichte'], 430] } } },
      { t: T('Wer immer fragt _„Was könnte beides verursachen?“_, fällt seltener herein.', 64), gfx: { lupe: {} } },
      { t: T('Achte darauf, wenn Medien melden: „X hängt mit Y zusammen“. Frag dann: Was könnte **beides** verursachen?', 64), gfx: { lupe: {} } },
      { t: T('Sein Artikel hieß „Storks Deliver Babies (p = 0,008)“ – ein beliebtes **Lehrbeispiel** in Statistik-Kursen.', 64), gfx: { streu: { tf: [0.8, 36, 100] } } },
      { t: T('Das gleiche Muster bei Bränden: Wo mehr Feuerwehrleute im Einsatz sind, entsteht mehr **Schaden**.', 64), gfx: { f4: { draw: 'formel', args: [['großer Brand', '→', 'viele Feuerwehrleute', '+', 'großer Schaden'], 320] } } },
      { t: T('Manchmal ist die Richtung verkehrt: In Krankenhäusern sind viele Kranke – aber Krankenhäuser **machen** nicht krank.', 64), gfx: { f5: { draw: 'formel', args: [['krank', '→', 'Krankenhaus'], 300, 'richtig herum'] }, f6: { draw: 'formel', args: [['Krankenhaus', '→', 'krank'], 440, 'falsch herum'] } } },
      { t: T('Nutzlos sind Korrelationen trotzdem nicht: Sie zeigen, wo man **genauer** hinschauen sollte.', 64), gfx: { skala: {} } },
      recap(
        [{ gfx: 'streu' }, { gfx: 'drei', cls: 'a1' }, { gfx: 'eis', cls: 'a1' }, { gfx: 'lupe' }],
        ['Störche und Geburten: 0,62', 'dritte Größe: Landesgröße', 'Sommer hinter Eis und Sonnenbrand', 'Was verursacht beides?'],
      ),
    ],
    summary: ['Störche und Geburten korrelieren in Europa.', 'Dahinter steckt eine dritte Größe: die Landesgröße.', 'Immer fragen: Was verursacht beides?'],
    sources: ['Matthews 2000, Teaching Statistics'],
  },
  {
    id: 'ziegenproblem',
    area: 'DENK',
    day: 25,
    hook: 'Drei Türen, ein Auto: Solltest du wechseln?',
    mood: 'raetsel',
    images: [img('ziege')],
    draw: {
      hundert(g) {
        for (let i = 0; i < 100; i++) {
          const x = 40 + (i % 10) * 29
          const y = 250 + Math.floor(i / 10) * 34
          const open = i !== 0 && i !== 57
          const p = pop(g, i * 12, '50% 50%')
          if (open) ink(p, RR(x, y, 20, 26, 2), { w: 1.4, t: 0 })
          else {
            hatch(p, RR(x, y, 20, 26, 2), 0, true)
            ink(p, RR(x, y, 20, 26, 2), { w: 2.4, t: 0 })
          }
        }
        ring(g, 50, 263, 18, 20, 1500)
        text(g, 180, 620, '98 Ziegentüren offen', { anchor: 'middle', d: 1600 })
      },
      tueren(g) {
        ink(g, L([10, 560], [350, 560]), { w: 3, t: 500 })
        goat(st(g, 'x3', '--dl:700ms'), 284, 552, 0.9)
        door(g, 20, 330, 90, 230, '1', 0)
        door(g, 135, 330, 90, 230, '2', 200)
        door(g, 250, 330, 90, 230, '3', 400, 'm3', 300)
        const leg = st(g, 'f1', '--dl:300ms')
        car(leg, 80, 260, 0.9)
        text(leg, 120, 254, '× 1', { fade: false })
        goat(leg, 220, 262, 0.7)
        text(leg, 260, 254, '× 2', { fade: false })
        const pick = st(g, 'x2', '--o:50% 50%;--dl:200ms')
        ring(pick, 65, 445, 62, 132)
        const q = st(g, 'x4', '--o:50% 50%;--dl:300ms')
        question(q, 180, 450, 1.6)
      },
      drittel(g) {
        const rows = [0, 1, 2]
        rows.forEach((carAt, r) => {
          const y = 250 + r * 120
          const d = r * 400
          for (let k = 0; k < 3; k++) {
            ink(g, RR(30 + k * 52, y, 40, 70, 4), { w: 2.2, d: d + k * 80, t: 300 })
            if (k === carAt) car(g, 50 + k * 52, y + 52, 0.42, d + 200)
            else goat(g, 46 + k * 52, y + 58, 0.38, d + 200)
          }
          ring(g, 50, y + 35, 26, 42, d + 300)
          const stay = carAt === 0
          ;(stay ? check : cross)(g, 230, y + 36, 0.9, d + 500)
          ;(stay ? cross : check)(g, 300, y + 36, 0.9, d + 600)
        })
        text(g, 230, 230, 'bleiben', { anchor: 'middle', cls: 's', d: 100 })
        text(g, 300, 230, 'wechseln', { anchor: 'middle', cls: 's', d: 100 })
        text(g, 230, 630, '1 von 3', { anchor: 'middle', size: 18, d: 1600 })
        text(g, 300, 630, '2 von 3', { anchor: 'middle', size: 18, d: 1700 })
      },
      briefe(g) {
        for (let k = 0; k < 14; k++) {
          const x = 40 + ((k * 73) % 230)
          const y = 300 + ((k * 47) % 220)
          const p = pop(g, 200 + k * 120, '50% 50%')
          const r = mk('g', { transform: `rotate(${((k * 37) % 40) - 20} ${x + 35} ${y + 22})` }, p)
          letter(r, x, y, 70, 0)
        }
      },
      sim(g) {
        hbars(g, [
          { label: 'wechseln', v: 66.7, fmt: (v) => `${v.toFixed(1).replace('.', ',')} %` },
          { label: 'bleiben', v: 33.3, fmt: (v) => `${v.toFixed(1).replace('.', ',')} %`, dense: true },
        ], { y: 320, gap: 120, max: 100 })
        text(g, 30, 270, '10.000 simulierte Spiele', { cls: 's', d: 200 })
      },
    },
    scenes: [
      { t: HOOK(70), gfx: { tueren: {} } },
      { t: T('Benannt ist das Rätsel nach Monty Hall, Moderator der US-Show „Let’s Make a **Deal**“.', 64), gfx: { tueren: { tf: [0.8, 36, 80] } } },
      { t: T('Hinter einer Tür steht ein **Auto**, hinter den anderen beiden Ziegen.', 64), gfx: { tueren: { cls: 'a1' } } },
      { t: T('Du wählst Tür 1. Der Moderator, der alles weiß, öffnet Tür 3: eine Ziege.', 64), gfx: { tueren: { cls: 'a1 a2 a3' } } },
      { t: T('Wechselst du zu Tür 2?', 64, { kind: 'big' }), gfx: { tueren: { cls: 'a1 a2 a3 a4' } } },
      { t: T('Wichtig sind die **Regeln**: Der Moderator weiß, wo das Auto steht, und öffnet immer eine Ziegentür.', 64), gfx: { punkte: { args: [['er kennt das Auto', 'er öffnet nie deine Tür', 'er öffnet immer eine Ziege'], 320] } } },
      { t: T('Die Rechnung:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['deine erste Wahl', '=', '1/3'], 300] }, f2: { draw: 'formel', args: [['die beiden anderen zusammen', '=', '2/3'], 430] } } },
      { t: T('Fast alle sagen: egal, 50 zu 50. Falsch – **Wechseln** gewinnt in zwei von drei Fällen.', 64), gfx: { drittel: {} } },
      { t: T('Noch klarer mit **100 Türen**: Du wählst eine, der Moderator öffnet 98 Ziegentüren. Bleibst du wirklich bei deiner?', 64), gfx: { hundert: {} } },
      { t: T('1990 erklärte Marilyn vos Savant das in einer Zeitschrift – und bekam Tausende **Protestbriefe**.', 64), gfx: { briefe: {} } },
      { t: T('Rund 10.000 Briefe kamen an – fast **1.000** davon von Leuten mit Doktortitel.', 64), gfx: { zahl: { args: ['10.000', 'Briefe, fast 1.000 von Doktoren', 420] } } },
      { t: T('Sogar der berühmte Mathematiker Paul Erdős glaubte es erst nach einer **Computersimulation**.', 64), gfx: { sim: {} } },
      { t: T('Warum irren wir? Zwei Türen übrig fühlen sich nach 50 zu 50 an. Doch der Moderator hat **Information** hinzugefügt: Er öffnet nie das Auto.', 64), gfx: { tueren: { cls: 'a1 a2 a3', tf: [0.8, 36, 80] } } },
      { t: T('Probier’s selbst: drei Spielkarten, ein Ass als Auto, eine zweite Person als **Moderator**. Nach 30 Runden siehst du es.', 64), gfx: { punkte: { args: [['3 Karten, 1 Ass', 'Partner kennt das Ass', 'immer wechseln, Treffer zählen'], 320] } } },
      { t: T('Paul Erdős war einer der produktivsten Mathematiker überhaupt – mit rund **1.500** Veröffentlichungen.', 64), gfx: { z4: { draw: 'zahl', args: ['1.500', 'Veröffentlichungen von Paul Erdős', 420] } } },
      { t: T('Entscheidend ist das **Wissen** des Moderators. Würde er zufällig öffnen und träfe eine Ziege, stünde es wirklich 50 zu 50.', 64), gfx: { vergleich: { args: [['Moderator weiß Bescheid', 'Wechseln: 2 von 3'], ['Moderator rät', 'Wechseln: 1 von 2'], 290] } } },
      { t: T('Tauben lernen das übrigens schneller als Menschen: Sie probieren aus – und **wechseln** bald immer.', 64), gfx: { sim: { tf: [0.8, 36, 80] } } },
      recap(
        [{ gfx: 'tueren', cls: 'a1 a2 a3' }, { gfx: 'drittel' }, { gfx: 'hundert' }, { gfx: 'sim' }],
        ['Moderator öffnet eine Ziege', 'Wechseln: 2 von 3', 'mit 100 Türen klarer', 'Simulation bestätigt'],
      ),
    ],
    summary: ['Erste Wahl: 1/3 Chance.', 'Wechseln: 2/3 Chance.', 'Selbst Paul Erdős zweifelte.'],
    sources: ['vos Savant 1990, Parade Magazine', 'Vazsonyi 1999, Decision Line'],
  },
]
