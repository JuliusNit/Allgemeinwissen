import type { Bite } from '../feed'
import { img } from './img'
import {
  B, E, HOOK, L, RR, T, arrow, balance, bigText, blank, bolt, brain, bubble, bulb, clock, cross, dashes, eye, fig, globe, group, hatch, hbars, ink, mk, mountain, pop, question, rays, st, star, strike, text, timeline, vbars, type P,
} from './draw'
import { recap } from './common'

// Naturwissenschaft & Technik: Leben & Körper, Physik, Chemie, Nervensystem, Erde, Technik

const tsd = (v: number) => Math.round(v).toLocaleString('de-DE')
const dez = (v: number) => v.toFixed(1).replace('.', ',')
const pct = (v: number) => `${Math.round(v)} %`

/** Endlos wiederholte Bewegung (Web Animations) */
function loop(el: Element, frames: Keyframe[], ms: number, delay = 0, easing = 'linear'): void {
  el.animate(frames, { duration: ms, delay, iterations: Infinity, easing })
}

/** Giraffe von der Seite, Füße auf y, Blick nach rechts; Hals lang oder kurz */
function giraffe(g: Element, x: number, y: number, s = 1, neck = 1, d = 0): void {
  const P = (a: number, b: number): P => [x + a * s, y + b * s]
  const io = (dd: number, w = 2.6) => ({ w: w * Math.min(1.2, Math.max(0.7, s)), d: d + dd, t: 300 })
  const body: P[] = [
    ...B(P(-30, -60), P(-10, -74), P(14, -84), P(32, -82)),
    ...B(P(32, -82), P(38, -72), P(36, -62), P(30, -58)).slice(1),
    ...B(P(30, -58), P(10, -54), P(-14, -52), P(-30, -54)).slice(1),
    ...B(P(-30, -54), P(-34, -56), P(-34, -58), P(-30, -60)).slice(1),
  ]
  blank(g, body)
  ink(g, body, io(0))
  for (const [k, top] of [[-24, -54], [-16, -54], [20, -58], [28, -58]] as const) ink(g, L(P(k, top), P(k + (k > 0 ? 2 : -2), 0)), io(150, 2.2))
  for (const [a, b, r] of [[-14, -64, 5], [2, -70, 6], [18, -70, 5], [-2, -60, 4]] as const) hatch(g, E(x + a * s, y + b * s, r * s), d + 500, true)
  const nx = 26 + 30 * neck
  const ny = -84 - 90 * neck
  ink(g, L(P(22, -80), P(nx - 4, ny + 4)), io(250))
  ink(g, L(P(34, -74), P(nx + 6, ny + 10)), io(250))
  for (let k = 1; k < 4; k++) hatch(g, E(x + (28 + (nx - 26) * (k / 4)) * s, y + (-78 + (ny + 84) * (k / 4)) * s, 3.5 * s), d + 600, true)
  const head: P[] = [P(nx - 6, ny - 4), P(nx + 18, ny + 6), P(nx + 16, ny + 12), P(nx - 2, ny + 10), P(nx - 6, ny - 4)]
  ink(g, head, io(450))
  ink(g, L(P(nx, ny - 4), P(nx - 2, ny - 14)), io(500, 2))
  ink(g, L(P(nx + 5, ny - 2), P(nx + 5, ny - 12)), io(500, 2))
  ink(g, L(P(-30, -58), P(-38, -34)), io(500, 2))
}

/** Vulkan mit Krater */
function volcano(g: Element, x0: number, x1: number, base: number, top: number, d = 0): void {
  const cx = (x0 + x1) / 2
  const shape: P[] = [[x0, base], [cx - 30, top], [cx - 12, top + 8], [cx + 12, top + 8], [cx + 30, top], [x1, base]]
  hatch(g, shape, d + 500)
  ink(g, shape, { w: 3.2, d, t: 900 })
}

/** Ausbruchswolke über (cx, y) */
function plume(g: Element, cx: number, y: number, d = 0): void {
  const c: P[] = [...B([cx - 20, y], [cx - 60, y - 20], [cx - 70, y - 80], [cx - 30, y - 90]), ...B([cx - 30, y - 90], [cx - 20, y - 130], [cx + 40, y - 130], [cx + 40, y - 90]).slice(1), ...B([cx + 40, y - 90], [cx + 80, y - 80], [cx + 60, y - 20], [cx + 20, y]).slice(1)]
  hatch(g, c, d + 400, true)
  ink(g, c, { w: 2.8, d, t: 800 })
}

/** Haus (Würfel mit Dach), Grundlinie y */
function hut(g: Element, x: number, y: number, w = 40, d = 0): void {
  ink(g, RR(x, y - w * 0.8, w, w * 0.8, 2), { w: 2.4, d, t: 400 })
  ink(g, [[x - 4, y - w * 0.8], [x + w / 2, y - w * 1.25], [x + w + 4, y - w * 0.8]], { w: 2.6, d: d + 200, t: 300 })
}

/** Atomkern als Kugelhaufen */
function nucleus(g: Element, cx: number, cy: number, n: number, r: number, d = 0): void {
  let seed = n
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2
    const rr = Math.sqrt(rnd()) * r
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    const p = pop(g, d + i * 12, '50% 50%')
    blank(p, E(x, y, 7))
    if (i % 2) hatch(p, E(x, y, 7), 0, true)
    ink(p, E(x, y, 7), { w: 1.6, t: 0 })
  }
}

/** Satellit (Körper mit Solarflügeln) */
function satellite(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  ink(g, RR(cx - 12 * s, cy - 10 * s, 24 * s, 20 * s, 3), { w: 2.4, d, t: 300 })
  for (const k of [-1, 1]) {
    const p = RR(cx + k * 16 * s + (k < 0 ? -36 * s : 0), cy - 8 * s, 36 * s, 16 * s, 2)
    hatch(g, p, d + 300, true)
    ink(g, p, { w: 2, d: d + 150, t: 300 })
  }
}

/** Spinne */
function spider(g: Element, cx: number, cy: number, s = 1): void {
  hatch(g, E(cx, cy, 10 * s, 8 * s), 0, true)
  ink(g, E(cx, cy, 10 * s, 8 * s), { w: 2.2, t: 0 })
  ink(g, E(cx + 12 * s, cy, 5 * s), { w: 2, t: 0 })
  for (const k of [-1, 1]) for (let j = 0; j < 4; j++) ink(g, [[cx + (j - 1.5) * 5 * s, cy + k * 6 * s], [cx + (j - 1.5) * 9 * s, cy + k * 14 * s], [cx + (j - 1.5) * 12 * s, cy + k * 20 * s]], { w: 1.6, t: 0 })
}

export const NATUR: Bite[] = [
  {
    id: 'bakterien',
    area: 'BIO',
    day: 53,
    hook: 'Bist du mehr Bakterie als Mensch?',
    mood: 'raetsel',
    ambience: 'blasen',
    images: [img('e-coli')],
    draw: {
      zehn(g) {
        ink(g, E(90, 400, 64), { w: 3.2, t: 700 })
        hatch(g, E(90, 400, 22), 600, true)
        ink(g, E(90, 400, 22), { w: 2.4, d: 300, t: 400 })
        text(g, 90, 500, '1 Körperzelle', { anchor: 'middle', d: 600 })
        for (let i = 0; i < 10; i++) {
          const x = 200 + (i % 3) * 46
          const y = 300 + Math.floor(i / 3) * 52
          const p = pop(g, 800 + i * 120, '50% 50%')
          ink(p, RR(x, y, 34, 16, 8), { w: 2.4, t: 0 })
          ink(p, B([x + 34, y + 8], [x + 42, y + 2], [x + 46, y + 14], [x + 52, y + 8]), { w: 1.4, t: 0 })
        }
        text(g, 254, 520, '10 Bakterien?', { anchor: 'middle', d: 2100 })
      },
      kopie(g) {
        for (let k = 0; k < 4; k++) {
          const x = 30 + k * 78
          const y = 330 + (k % 2) * 30
          ink(g, RR(x, y, 60, 80, 4), { w: 2.6, d: k * 450, t: 400 })
          text(g, x + 30, y + 46, '10 : 1', { anchor: 'middle', d: k * 450 + 200, size: 15 })
          if (k) arrow(g, L([x - 16, y + 20], [x - 4, y + 20]), { w: 2, d: k * 450 - 150, t: 150, head: 7 })
        }
        text(g, 60, 450, '1972', { anchor: 'middle', d: 200, size: 18 })
      },
      zellen(g) {
        vbars(g, [
          { label: 'Bakterien', v: 38, fmt: (v) => `${Math.round(v)} Bio.` },
          { label: 'eigene Zellen', v: 30, fmt: (v) => `${Math.round(v)} Bio.`, dense: true },
        ], { x: 80, base: 580, w: 80, gap: 120, h: 300 })
      },
      blut(g) {
        const cx = 180
        const cy = 400
        const r = 120
        const a1 = -90 + 360 * 0.84
        const sector: P[] = [[cx, cy], ...E(cx, cy, r, r, -90, a1), [cx, cy]]
        hatch(g, sector, 800)
        ink(g, E(cx, cy, r), { w: 3.2, t: 800 })
        ink(g, L([cx, cy], [cx, cy - r]), { w: 2.6, d: 600, t: 200 })
        ink(g, L([cx, cy], [cx + Math.cos((a1 * Math.PI) / 180) * r, cy + Math.sin((a1 * Math.PI) / 180) * r]), { w: 2.6, d: 700, t: 200 })
        text(g, cx - 10, cy + 10, '84 %', { anchor: 'middle', size: 32, d: 1000, cls: 'halo' })
        text(g, cx, cy + r + 40, 'rote Blutkörperchen', { anchor: 'middle', d: 1200 })
        for (const [x, y] of [[50, 250], [300, 560], [310, 250]] as const) {
          ink(g, E(x, y, 22, 14), { w: 2.4, d: 1300, t: 300 })
          ink(g, E(x, y, 10, 5), { w: 1.6, d: 1500, t: 200 })
        }
      },
      waage(g) {
        balance(g, 0, 0, 0, 8)
        text(g, 80, 410, 'Bakterien', { anchor: 'middle', d: 1100 })
        text(g, 280, 410, 'Mensch', { anchor: 'middle', d: 1200 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { e: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [40, 45, 1.05], cam2: [40, 45, 1.3] } } },
      { t: T('Bakterien sind winzig: etwa **zwei Tausendstel** Millimeter lang. Auf einen Millimeter passen rund 500 hintereinander.', 64), gfx: { zahl: { args: ['0,002 mm', 'lang ist ein typisches Bakterium', 420] } } },
      { t: T('Fast alle leben in deinem **Darm** – vor allem im Dickdarm.', 64), gfx: { punkte: { args: [['Dickdarm: fast alle', 'Haut', 'Mund und Rachen'], 330] } } },
      { t: T('Jahrzehntelang hieß es: Auf jede Körperzelle kommen **zehn Bakterien**.', 64), gfx: { zehn: {} } },
      { t: T('Die Zahl stammt aus einer groben **Schätzung** von 1972 – und wurde danach immer weiter abgeschrieben.', 64), gfx: { kopie: {} } },
      { t: T('Luckey rechnete grob mit einem Kilogramm Darminhalt:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['100 Milliarden pro Gramm', '×', '1.000 Gramm', '=', '100 Billionen Bakterien'], 320] } } },
      { t: T('Dagegen setzte er etwa **10 Billionen** Körperzellen – daraus wurde 10 zu 1.', 64), gfx: { f3: { draw: 'formel', args: [['100 Billionen', '÷', '10 Billionen', '=', '10 : 1'], 330] } } },
      { t: T('2016 rechneten Ron Sender, Shai Fuchs und Ron Milo neu: rund **38 Billionen** Bakterien gegen 30 Billionen eigene Zellen.', 64), gfx: { zellen: {} } },
      { t: T('Neu gemessen: Der Dickdarm enthält nicht ein Kilogramm, sondern nur rund **0,4 Liter** Inhalt.', 64), gfx: { f2: { draw: 'formel', args: [['0,4 Liter Darminhalt', '×', 'rund 90 Milliarden pro Gramm', '≈', '38 Billionen'], 320] } } },
      { t: T('Und die eigenen Zellen zählten sie Gewebe für Gewebe: rund **30 Billionen**.', 64), gfx: { zellen: {} } },
      { t: T('Die meisten deiner Zellen sind übrigens **rote Blutkörperchen**.', 64), gfx: { blut: {} } },
      { t: T('Nach Masse sind die roten Blutkörperchen aber nur ein kleiner Teil – sie sind winzig.', 64), gfx: { blut: {} } },
      { t: T('Und alle Bakterien zusammen wiegen nur etwa **0,2 Kilogramm**.', 64), gfx: { z2: { draw: 'zahl', args: ['0,2 kg', 'wiegen alle deine Bakterien', 420] } } },
      { t: T('Und das Verhältnis schwankt: Nach jedem Toilettengang verschiebt es sich Richtung **Mensch**.', 64), gfx: { waage: { cls: 'a1' } } },
      { t: T('Ohne Bakterien ginge es trotzdem schlecht – sie arbeiten für dich:', 64, { kind: 'big' }), gfx: { p2: { draw: 'punkte', args: [['Ballaststoffe zerlegen', 'Vitamin K herstellen', 'Krankheitserreger verdrängen'], 320] } } },
      { t: T('Unterm Strich also ungefähr **eins zu eins**:', 64, { kind: 'big' }), gfx: { f4: { draw: 'formel', args: [['38 Billionen Bakterien', '÷', '30 Billionen Zellen', '≈', '1,3 : 1'], 320] } } },
      { t: T('Jeder Mensch trägt eine eigene Mischung aus Hunderten Arten – fast wie ein **Fingerabdruck**.', 64), gfx: { zehn: {} } },
      { t: T('Sie beginnt bei der **Geburt**: Babys bekommen die ersten Bakterien von der Mutter.', 64), gfx: { z4: { draw: 'zahl', args: ['Tag 1', 'erste Bakterien bei der Geburt', 420] } } },
      { t: T('Ihr Lieblingsfutter sind **Ballaststoffe**: Gemüse, Vollkorn, Hülsenfrüchte.', 64), gfx: { p3: { draw: 'punkte', args: [['Gemüse', 'Vollkorn', 'Hülsenfrüchte'], 330] } } },
      recap(
        [{ gfx: 'zehn' }, { gfx: 'kopie' }, { gfx: 'zellen' }, { gfx: 'blut' }],
        ['angeblich 10 : 1', 'eine Schätzung von 1972', 'neu: 38 zu 30 Billionen', '84 % rote Blutkörperchen'],
      ),
    ],
    summary: ['„Zehnmal mehr Bakterien“ stammt aus einer Schätzung von 1972.', 'Neu gerechnet: etwa 38 zu 30 Billionen.', '84 Prozent deiner Zellen sind rote Blutkörperchen.'],
    sources: ['Sender, Fuchs & Milo 2016, PLOS Biology', 'Luckey 1972, Am J Clin Nutr'],
  },
  {
    id: 'giraffenhals',
    area: 'BIO',
    day: 10,
    hook: 'Wurde der Giraffenhals lang, weil sie sich streckten?',
    mood: 'hell',
    ambience: 'wind',
    images: [img('giraffen-necking'), img('lamarck'), img('darwin')],
    draw: {
      strecken(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        ink(g, L([300, 600], [300, 300]), { w: 4, d: 200, t: 500 })
        for (const [x, y] of [[270, 300], [320, 290], [290, 260], [250, 330]] as const) {
          const leaf = E(x, y, 22, 12)
          hatch(g, leaf, 600, true)
          ink(g, leaf, { w: 2.2, d: 500, t: 300 })
        }
        giraffe(st(g, 'h1', '--dl:500ms'), 150, 600, 1.6, 0.4, 700)
        giraffe(st(g, 'f1', '--dl:500ms'), 150, 600, 1.6, 1, 0)
        const kid = st(g, 'x2', '--dl:300ms')
        giraffe(kid, 60, 600, 0.8, 1, 0)
        arrow(st(g, 'f1', '--dl:900ms'), B([170, 340], [200, 300], [230, 290], [250, 300]), { w: 2, t: 0, head: 8 })
      },
      herde(g) {
        ink(g, L([10, 600], [350, 600]), { w: 3, t: 500 })
        const necks = [0.3, 0.9, 0.5, 1.1, 0.4]
        necks.forEach((n, i) => {
          const gr = st(g, n < 0.6 ? 'h1' : '', '--dl:200ms')
          giraffe(gr, 40 + i * 68, 600, 1, n, i * 200)
        })
        const kids = st(g, 'x1', '--dl:900ms')
        giraffe(kids, 120, 600, 0.55, 1, 0)
        giraffe(kids, 260, 600, 0.55, 1.1, 0)
        const dry = st(g, 'f1', '--dl:200ms')
        text(dry, 180, 250, 'Dürre', { anchor: 'middle', size: 22, fade: false })
        ink(dry, E(300, 250, 26), { w: 2.6, t: 0 })
      },
      wirbel(g) {
        for (let k = 0; k < 7; k++) {
          ink(g, RR(70, 220 + k * 50, 50, 42, 8), { w: 2.6, d: k * 120, t: 300 })
          hatch(g, RR(70, 220 + k * 50, 50, 42, 8), k * 120 + 200, true)
        }
        text(g, 95, 600, 'Giraffe', { anchor: 'middle', d: 800 })
        for (let k = 0; k < 7; k++) ink(g, RR(250, 440 + k * 18, 40, 14, 4), { w: 2.2, d: 900 + k * 100, t: 200 })
        text(g, 270, 600, 'Mensch', { anchor: 'middle', d: 1600 })
        bigText(g, 180, 400, '7', { size: 120, d: 1700 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [40, 35, 1.05], cam2: [40, 35, 1.25] } } },
      { t: T('Giraffen sind die **höchsten** Tiere der Welt: Bullen werden über fünf Meter hoch.', 64), gfx: { zahl: { args: ['5,5 m', 'kann ein Giraffenbulle hoch sein', 420] } } },
      { t: T('Ihr Herz muss Blut zwei Meter hoch zum Kopf pumpen – der Blutdruck ist etwa **doppelt** so hoch wie bei uns.', 64), gfx: { z1: { draw: 'zahl', args: ['2 ×', 'so hoher Blutdruck wie beim Menschen', 420] } } },
      {
        t: { text: 'So erklärte es Jean-Baptiste **Lamarck** um 1809: Giraffen recken sich nach Blättern …', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { l: { img: 1, x: 20, y: 64, w: 96, h: 120, r: 'oval', enter: 'fade', cam: [50, 30, 1.4] } },
        gfx: { strecken: { cls: 'a1', tf: [0.8, 36, 130] } },
      },
      {
        t: { text: '… der Hals wird länger – und das **Erworbene** erben die Jungen.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { l: { img: 1, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [50, 30, 1.4] } },
        gfx: { strecken: { cls: 'a1 a2', tf: [0.8, 36, 130] } },
      },
      { t: T('Klingt logisch – wurde aber nie bestätigt. Wer Muskeln trainiert, **vererbt** sie nicht.', 64), gfx: { f1: { draw: 'formel', args: [['trainierte Muskeln', '→', 'Kinder', '=', 'keine stärkeren Muskeln'], 320] } } },
      { t: T('Vererbt werden **Gene** in Ei- und Samenzellen – und die ändern sich durch Strecken nicht.', 64), gfx: { strecken: { cls: 'a1 a2', tf: [0.8, 36, 130] } } },
      {
        t: { text: '**Darwin** sah es anders: Unter vielen Giraffen haben manche zufällig etwas längere Hälse.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { d: { img: 2, x: 20, y: 64, w: 96, h: 120, r: 'oval', enter: 'fade', cam: [50, 30, 1.4] } },
        gfx: { herde: { tf: [0.85, 27, 90] } },
      },
      {
        t: { text: 'In Dürren kommen sie besser an Futter und bekommen mehr Junge: **Selektion**.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { d: { img: 2, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [50, 30, 1.4] } },
        gfx: { herde: { cls: 'a1', tf: [0.85, 27, 90] } },
      },
      { t: T('Darwin veröffentlichte seine Theorie **1859** in „Über die Entstehung der Arten“.', 64), gfx: { z2: { draw: 'zahl', args: ['1859', '„Über die Entstehung der Arten“', 420] } } },
      { t: T('Seine Theorie in einer Zeile:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Unterschiede', '+', 'Vererbung', '+', 'Auslese', '=', 'Evolution'], 320] } } },
      { t: T('Einen Haken hat die Futter-Erklärung: Giraffen fressen oft auf **Schulterhöhe** – nicht ganz oben.', 64), gfx: { strecken: { cls: 'a1', tf: [0.8, 36, 130] } } },
      {
        t: T('Dazu kommt das **Necking**: Giraffenbullen kämpfen mit ihren Hälsen, längere gewinnen öfter.', 470),
        pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [35, 30, 1.4], cam2: [40, 30, 1.55] } },
      },
      { t: T('Die Bullen schwingen ihre Hälse wie **Keulen**. Längere, schwerere Hälse treffen härter.', 470), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [40, 35, 1.6] } } },
      { t: T('Wahrscheinlich wirkte **beides** zusammen: Futter und Kämpfe.', 64, { kind: 'big' }), gfx: { herde: { cls: 'a1', tf: [0.85, 27, 90] } } },
      { t: T('Trotz zwei Metern Hals haben Giraffen nur **sieben Halswirbel** – genau wie du.', 64), gfx: { wirbel: {} } },
      { t: T('Jeder ihrer Halswirbel ist bis zu **25 Zentimeter** lang.', 64), gfx: { f3: { draw: 'formel', args: [['7 Wirbel', '×', 'bis 25 cm', '≈', 'fast 2 m Hals'], 330] } } },
      { t: T('Ihre Zunge ist bis zu **50 Zentimeter** lang – damit pflücken sie Blätter zwischen Dornen.', 64), gfx: { z3: { draw: 'zahl', args: ['50 cm', 'lange Zunge', 420] } } },
      { t: T('Erbgutanalysen von 2016 zeigen: Es gibt nicht eine, sondern **vier** Giraffenarten.', 64), gfx: { herde: {} } },
      { t: T('Ihr nächster Verwandter ist das **Okapi** – mit kurzem Hals.', 64), gfx: { strecken: { tf: [0.8, 36, 130] } } },
      recap(
        [{ gfx: 'strecken', cls: 'a1 a2' }, { gfx: 'herde', cls: 'a1' }, { pic: 0, id: 'n', cam: [35, 30, 1.3] }, { gfx: 'wirbel' }],
        ['Lamarck: Strecken – widerlegt', 'Darwin: Selektion', 'Kämpfe mit dem Hals', 'nur 7 Halswirbel'],
      ),
    ],
    summary: ['Lamarck: Strecken wird vererbt – widerlegt.', 'Darwin: zufällige Unterschiede + Selektion.', 'Giraffen haben nur sieben Halswirbel.'],
    sources: ['Simmons & Scheepers 1996, American Naturalist', 'Darwin 1872, On the Origin of Species, 6. Aufl.'],
  },
  {
    id: 'zehn-prozent',
    area: 'BIO',
    day: 86,
    hook: 'Nutzt du nur zehn Prozent deines Gehirns?',
    mood: 'kosmisch',
    images: [img('mrt-gehirn')],
    draw: {
      zehn(g) {
        brain(g, 180, 400, 1.2)
        const lock = st(g, 'f1', '--dl:400ms')
        blank(lock, RR(150, 380, 60, 46, 8))
        ink(lock, RR(150, 380, 60, 46, 8), { w: 3, t: 0 })
        ink(lock, B([162, 380], [162, 346], [198, 346], [198, 380]), { w: 3, t: 0 })
        text(lock, 180, 408, '90 %', { anchor: 'middle', fade: false, size: 15 })
        question(st(g, 'x2', '--o:50% 50%;--dl:200ms'), 300, 260, 1.4)
      },
      aktiv(g) {
        brain(g, 180, 400, 1.2)
        const spots: [number, number][] = [[110, 340], [170, 300], [240, 320], [270, 390], [210, 420], [130, 430], [190, 370]]
        spots.forEach(([x, y], i) => {
          const p = group(g)
          blank(p, E(x, y, 20))
          hatch(p, E(x, y, 20), 0, true)
          ink(p, E(x, y, 20), { w: 2, t: 0 })
          p.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.4 }, { opacity: 0, offset: 0.55 }, { opacity: 0 }], { duration: 3500, delay: 600 + i * 480, iterations: Infinity })
        })
      },
      kosten(g) {
        hbars(g, [
          { label: 'Anteil am Körpergewicht', v: 2, fmt: (v) => `${Math.round(v)} %` },
          { label: 'Anteil am Energieverbrauch', v: 20, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { y: 320, gap: 130, max: 25 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.25] } } },
      { t: T('Dein Gehirn hat rund **86 Milliarden** Nervenzellen – verbunden über etwa 100 Billionen Kontaktstellen.', 64), gfx: { zahl: { args: ['86 Mrd.', 'Nervenzellen', 420] } } },
      { t: T('Filme wie „Lucy“ leben von der Idee: Wer die restlichen 90 Prozent **freischaltet**, bekommt Superkräfte.', 64), gfx: { zehn: { cls: 'a1' } } },
      { t: T('Eine wissenschaftliche Quelle für die Zahl gibt es **nicht**.', 64), gfx: { zehn: { cls: 'a1 a2' } } },
      { t: T('Woher die Zahl kommt? Oft wird der Psychologe **William James** genannt: Um 1900 schrieb er, wir nutzten nur einen Teil unserer Möglichkeiten.', 64), gfx: { zehn: { cls: 'a1 a2' } } },
      { t: T('Eine Zahl nannte er nie. Die „10 Prozent“ standen später im Vorwort eines **Ratgebers** von 1936.', 64), gfx: { z1: { draw: 'zahl', args: ['1936', 'Ratgeber-Vorwort mit „10 Prozent“', 420] } } },
      { t: T('Hirnscans zeigen: Über den Tag sind praktisch **alle Bereiche** aktiv – nur nicht alle gleichzeitig.', 64), gfx: { aktiv: {} } },
      { t: T('Selbst im **Schlaf** ist es aktiv: Es sortiert Erinnerungen und steuert Atmung, Herzschlag und Temperatur.', 64), gfx: { p2: { draw: 'punkte', args: [['Erinnerungen sortieren', 'Atmung und Herzschlag', 'Körpertemperatur'], 320] } } },
      { t: T('Jede Aufgabe nutzt **Netzwerke** über viele Bereiche hinweg:', 64, { kind: 'big' }), gfx: { p3: { draw: 'punkte', args: [['Sehen: hinten im Kopf', 'Sprache: meist links', 'Bewegung: oben in der Mitte'], 320] } } },
      {
        t: T('Schon kleine Schäden – etwa nach einem Schlaganfall – haben spürbare **Folgen**.', 476),
        pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [55, 45, 1.5], cam2: [55, 45, 1.7] } },
      },
      { t: T('Gäbe es 90 Prozent ungenutzte Fläche, müssten Schäden dort **folgenlos** bleiben. Das ist praktisch nie so.', 64), gfx: { aktiv: {} } },
      { t: T('Und das Gehirn ist teuer. Ein nutzloses Organ dieser Größe hätte die Evolution nicht **durchgehen** lassen.', 64), gfx: { kosten: {} } },
      { t: T('Dein Gehirn läuft mit etwa **20 Watt** – so viel wie eine schwache Glühbirne.', 64), gfx: { z2: { draw: 'zahl', args: ['20 W', 'Leistung deines Gehirns', 420] } } },
      { t: T('Pro Gramm ist es damit ein echter **Vielfraß**:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['20 % Energie', '÷', '2 % Gewicht', '=', '10-mal so hungrig wie der Rest'], 320] } } },
      { t: T('Was nicht gebraucht wird, baut das Gehirn eher **ab**. Was du übst, wird stärker vernetzt.', 64), gfx: { f3: { draw: 'formel', args: [['üben', '→', 'stärkere Verbindungen'], 330] } } },
      { t: T('Hirnscans messen den **Blutfluss**: Wo Nervenzellen arbeiten, strömt mehr sauerstoffreiches Blut hin.', 64), gfx: { f4: { draw: 'formel', args: [['Nervenzellen arbeiten', '→', 'mehr Sauerstoff', '→', 'Signal im Scanner'], 320] } } },
      { t: T('Und Gehirnjogging-Apps? Sie trainieren meist nur das **Spiel** selbst – kaum den Alltag.', 64), gfx: { aktiv: {} } },
      { t: T('Was dem Gehirn nachweislich guttut:', 64, { kind: 'big' }), gfx: { p4: { draw: 'punkte', args: [['Bewegung', 'Schlaf', 'Neues lernen', 'Kontakt mit anderen'], 300] } } },
      recap(
        [{ gfx: 'zehn', cls: 'a1 a2' }, { gfx: 'aktiv' }, { gfx: 'kosten' }, { pic: 0, id: 'm' }],
        ['10 %: ohne Quelle', 'alle Bereiche arbeiten', '2 % Gewicht, 20 % Energie', 'jeder Schaden zeigt Folgen'],
      ),
    ],
    summary: ['Die 10-Prozent-Zahl hat keine wissenschaftliche Quelle.', 'Im Tagesverlauf sind fast alle Areale aktiv.', '2 % Körpergewicht, 20 % der Energie.'],
    sources: ['Beyerstein 1999, in: Mind Myths (Wiley)', 'Raichle & Gusnard 2002, PNAS'],
  },
  {
    id: 'spinat',
    area: 'BIO',
    day: 65,
    hook: 'Macht Spinat wirklich stark?',
    mood: 'verspielt',
    images: [img('spinat')],
    draw: {
      dose(g) {
        ink(g, RR(70, 330, 110, 170, 10), { w: 3.2, t: 700 })
        ink(g, E(125, 330, 55, 12), { w: 2.8, d: 300, t: 400 })
        hatch(g, RR(70, 380, 110, 70, 4), 600, true)
        text(g, 125, 422, 'SPINAT', { anchor: 'middle', size: 18, d: 700, cls: 'halo' })
        const arm = group(g)
        ink(arm, B([214, 500], [250, 506], [290, 506], [318, 490]), { w: 3.4, d: 800, t: 400 })
        ink(arm, L([318, 490], [326, 404]), { w: 3.4, d: 1100, t: 300 })
        ink(arm, L([296, 466], [300, 406]), { w: 3.2, d: 1100, t: 300 })
        const bi = B([214, 464], [236, 412], [282, 412], [296, 466])
        hatch(arm, [...bi, [214, 500]], 1500, true)
        ink(arm, bi, { w: 3.4, d: 1300, t: 400 })
        ink(arm, E(313, 390, 18, 16), { w: 3, d: 1400, t: 300 })
        arm.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], { duration: 700, delay: 1800, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        arm.style.transformOrigin = '214px 480px'
      },
      komma(g) {
        text(st(g, 'h1', '--dl:900ms'), 180, 420, '3,5 mg', { anchor: 'middle', size: 64, d: 200 })
        text(st(g, 'f1', '--dl:1100ms'), 180, 420, '35 mg', { anchor: 'middle', size: 64, fade: false })
        arrow(st(g, 'f1', '--dl:700ms'), B([150, 470], [160, 500], [190, 500], [200, 470]), { w: 2.6, t: 0, head: 8 })
        strike(st(g, 'f2', '--dl:300ms'), [80, 410], [290, 390])
      },
      eisen(g) {
        hbars(g, [
          { label: 'Kürbiskerne', v: 8.8, fmt: (v) => `${dez(v)} mg` },
          { label: 'Linsen, getrocknet', v: 6.5, fmt: (v) => `${dez(v)} mg` },
          { label: 'Spinat, roh', v: 2.7, fmt: (v) => `${dez(v)} mg`, dense: true },
        ], { y: 280, gap: 105, max: 10 })
        text(g, 30, 240, 'Eisen pro 100 Gramm', { cls: 's', d: 100 })
      },
      oxal(g) {
        for (let i = 0; i < 6; i++) {
          const x = 70 + (i % 3) * 70
          const y = 300 + Math.floor(i / 3) * 80
          ink(g, E(x, y, 22), { w: 2.6, d: i * 120, t: 300 })
          text(g, x, y + 6, 'Fe', { anchor: 'middle', size: 15, d: i * 120 + 200 })
          if (i % 2 === 0) {
            const c = st(g, 'x1', `--o:50% 50%;--dl:${300 + i * 100}ms`)
            ink(c, E(x, y, 30), { w: 1.6, t: 0 })
            ink(c, L([x - 30, y], [x + 30, y]), { w: 1.6, t: 0 })
          }
        }
        text(st(g, 'f1', '--dl:900ms'), 140, 460, 'gebunden', { anchor: 'middle', fade: false, cls: 's' })
        const pap: P[] = [...B([280, 340], [320, 340], [330, 420], [300, 460]), ...B([300, 460], [280, 480], [250, 440], [260, 380]).slice(1), ...B([260, 380], [262, 350], [270, 340], [280, 340]).slice(1)]
        hatch(g, pap, 1500, true)
        ink(g, pap, { w: 3, d: 1200, t: 500 })
        ink(g, B([282, 340], [282, 320], [292, 312], [300, 306]), { w: 3, d: 1600, t: 200 })
        text(g, 290, 520, 'Vitamin C', { anchor: 'middle', d: 1700 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [40, 40, 1.05], cam2: [40, 40, 1.3] } } },
      { t: T('Popeye erschien **1929** im Comic – den Spinat bekam er Anfang der 1930er.', 64), gfx: { zahl: { args: ['1929', 'erster Auftritt von Popeye', 420] } } },
      { t: T('Spinatbauern im texanischen **Crystal City** stellten ihm sogar ein Denkmal auf.', 64), gfx: { dose: { tf: [0.8, 36, 60] } } },
      { t: T('Popeye isst Spinat und wird zum **Kraftprotz** – und zwar wegen des Eisens, so die Legende.', 64), gfx: { dose: {} } },
      { t: T('Ein Forscher habe ein **Komma** falsch gesetzt – und Spinat hatte plötzlich zehnmal so viel Eisen.', 64), gfx: { komma: { cls: 'a1' } } },
      { t: T('Die Pointe: Auch die Komma-Geschichte ist ein **Mythos**. Der Kriminologe Mike Sutton fand dafür keinen Beleg.', 64), gfx: { komma: { cls: 'a1 a2' } } },
      { t: T('Erzählt wird: Ein Chemiker habe um 1870 ein **Komma** verrutscht – 35 statt 3,5 Milligramm.', 64), gfx: { komma: { cls: 'a1' } } },
      { t: T('Tatsächlich maß man früher oft **getrockneten** Spinat – der hat pro Gramm etwa zehnmal mehr Eisen. Kein Kommafehler.', 64), gfx: { f1: { draw: 'formel', args: [['frischer Spinat: 90 % Wasser', '→', 'getrocknet: zehnmal mehr Eisen pro Gramm'], 320] } } },
      { t: T('Spinat hat rund **3 mg** Eisen pro 100 Gramm: ordentlich, aber kein Rekord.', 64), gfx: { eisen: {} } },
      { t: T('Der Körper braucht pro Tag etwa **11 bis 16 Milligramm** Eisen. Nur aus Spinat hieße das:', 64), gfx: { f2: { draw: 'formel', args: [['14 mg', '÷', '2,7 mg pro 100 g', '≈', 'über ein halbes Kilo Spinat'], 320] } } },
      { t: T('Dazu kommt: Eisen aus Fleisch nimmt der Körper deutlich **besser** auf als aus Pflanzen.', 64), gfx: { vergleich: { args: [['Fleisch', 'gut aufnehmbar', 'Häm-Eisen'], ['Pflanzen', 'schlechter aufnehmbar', 'Vitamin C hilft'], 290] } } },
      { t: T('Praktisch heißt das: Vitamin C **dazu** – Paprika oder ein Glas Orangensaft. Tee und Kaffee erst später: Ihre Gerbstoffe bremsen die Aufnahme.', 64), gfx: { p5: { draw: 'punkte', args: [['Paprika oder Orangensaft dazu', 'Tee und Kaffee erst später', 'Hülsenfrüchte, Vollkorn, Kürbiskerne'], 300] } } },
      { t: T('**Oxalsäure** im Spinat bindet einen Teil davon. Vitamin C – etwa aus Paprika – hilft dem Körper.', 64), gfx: { oxal: { cls: 'a1' } } },
      { t: T('Oxalsäure steckt auch in Rhabarber und Mangold – in großen Mengen fördert sie **Nierensteine**.', 64), gfx: { oxal: { cls: 'a1' } } },
      { t: T('Und Popeye aß Spinat im Comic von 1932 wegen **Vitamin A** – nicht wegen Eisen.', 64), gfx: { dose: { tf: [0.9, 18, 40] } } },
      { t: T('Vitamin A steckt im Spinat als **Beta-Carotin** – daraus macht der Körper Vitamin A für Augen und Haut.', 64), gfx: { p4: { draw: 'punkte', args: [['Beta-Carotin', 'Vitamin K', 'Folsäure', 'Magnesium'], 300] } } },
      { t: T('Und Aufwärmen? Für Erwachsene ist einmal **aufwärmen** kein Problem, wenn er schnell abgekühlt wurde.', 64), gfx: { dose: { tf: [0.8, 36, 60] } } },
      { t: T('Eisenmangel ist weltweit der häufigste **Nährstoffmangel** – er macht müde und blass.', 64), gfx: { eisen: {} } },
      { t: T('Die Komma-Geschichte selbst verbreitete sich ab **1981** – ausgerechnet als Mahnung zu sorgfältigem Prüfen.', 64), gfx: { komma: { cls: 'a1 a2' } } },
      recap(
        [{ gfx: 'dose' }, { gfx: 'komma', cls: 'a1 a2' }, { gfx: 'eisen' }, { gfx: 'oxal', cls: 'a1' }],
        ['Popeye-Mythos', 'Komma-Legende: erfunden', '2,7 mg Eisen pro 100 g', 'Oxalsäure bremst'],
      ),
    ],
    summary: ['Spinat: rund 3 mg Eisen pro 100 g.', 'Oxalsäure bremst die Aufnahme, Vitamin C hilft.', 'Die Komma-Legende ist selbst ein Mythos.'],
    sources: ['Sutton 2010, Internet Journal of Criminology', 'USDA FoodData Central: Spinach, raw'],
  },
  {
    id: 'newton-apfel',
    area: 'PHY',
    day: 19,
    hook: 'Fiel Newton wirklich ein Apfel auf den Kopf?',
    mood: 'hell',
    images: [img('newton-kneller'), img('newton-baum')],
    draw: {
      kanone(g) {
        hatch(g, E(180, 520, 120), 600)
        ink(g, E(180, 520, 120), { w: 3.2, t: 800 })
        mountain(g, 160, 200, 404, [180, 360], 300, true)
        ink(g, B([186, 362], [210, 360], [230, 380], [240, 410]), { w: 2.6, d: 1000, t: 400 })
        ink(g, B([186, 362], [260, 360], [300, 420], [300, 480]), { w: 2.6, d: 1400, t: 500 })
        dashes(g, E(180, 520, 170), { w: 2.2, d: 1900 })
        text(g, 180, 300, 'schnell genug: Umlaufbahn', { anchor: 'middle', d: 2400 })
      },
      erzaehlen(g) {
        fig(pop(g, 0), 110, 560, 3.2)
        fig(pop(g, 300), 250, 560, 3.2)
        ink(g, L([30, 562], [330, 562]), { w: 3, d: 100, t: 500 })
        bubble(g, 40, 260, 150, 110, 'l', 700)
        const apple: P[] = [...B([115, 300], [80, 290], [80, 350], [115, 350]), ...B([115, 350], [150, 350], [150, 290], [115, 300]).slice(1)]
        hatch(g, apple, 1200, true)
        ink(g, apple, { w: 2.6, d: 1000, t: 400 })
        ink(g, L([115, 300], [120, 286]), { w: 2.4, d: 1300, t: 150 })
        text(g, 110, 600, 'Newton', { anchor: 'middle', d: 600 })
        text(g, 250, 600, 'Stukeley', { anchor: 'middle', d: 800 })
      },
      fall(g) {
        const a = group(g)
        const apple: P[] = [...B([180, 120], [160, 115], [160, 150], [180, 150]), ...B([180, 150], [200, 150], [200, 115], [180, 120]).slice(1)]
        blank(a, apple)
        hatch(a, apple, 0, true)
        ink(a, apple, { w: 2.4, t: 0 })
        loop(a, [{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: 0.1 }, { transform: 'translateY(240px)', opacity: 1, offset: 0.8 }, { transform: 'translateY(240px)', opacity: 0 }], 2200, 300, 'ease-in')
      },
      sitzen(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        ink(g, L([90, 600], [96, 330]), { w: 6, d: 200, t: 500 })
        const crown = [...B([96, 340], [20, 340], [10, 240], [80, 220]), ...B([80, 220], [120, 160], [220, 180], [230, 250]).slice(1), ...B([230, 250], [270, 300], [200, 350], [96, 340]).slice(1)]
        hatch(g, crown, 700)
        ink(g, crown, { w: 3, d: 300, t: 900 })
        const p = pop(g, 900)
        fig(p, 200, 598, 2.4)
        const a = group(g)
        const apple: P[] = [...B([236, 330], [222, 326], [222, 352], [236, 352]), ...B([236, 352], [250, 352], [250, 326], [236, 330]).slice(1)]
        blank(a, apple)
        hatch(a, apple, 0, true)
        ink(a, apple, { w: 2.4, t: 0 })
        a.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(0)', offset: 0.3 }, { transform: 'translateY(246px)' }], { duration: 1600, delay: 1000, fill: 'both', easing: 'ease-in' })
        cross(st(g, 'x1', '--o:50% 50%;--dl:2600ms'), 200, 470, 1.4)
        text(st(g, 'f1', '--dl:2600ms'), 200, 640, 'nicht auf den Kopf', { anchor: 'middle', fade: false })
      },
      mond(g) {
        hatch(g, E(80, 600, 150), 600)
        ink(g, E(80, 600, 150), { w: 3.4, t: 900 })
        dashes(g, E(80, 600, 290, 290, -90, 10), { w: 1.8, d: 600 })
        const moon = pop(g, 900, '50% 50%')
        ink(moon, E(320, 420, 24), { w: 3, t: 0 })
        hatch(moon, E(320, 420, 24), 0, true)
        arrow(g, L([304, 434], [250, 480]), { w: 2.6, d: 1400, t: 300 })
        const apple = pop(g, 1100, '50% 50%')
        ink(apple, E(120, 400, 10), { w: 2.4, t: 0 })
        arrow(g, L([118, 414], [112, 438]), { w: 2.6, d: 1600, t: 200, head: 8 })
        text(g, 320, 380, 'Mond', { anchor: 'middle', d: 1000 })
        text(g, 150, 396, 'Apfel', { d: 1200 })
        text(g, 80, 640, 'Erde', { anchor: 'middle', d: 800, cls: 'halo' })
      },
      gesetz(g) {
        for (const [y, gap, len, d] of [[300, 80, 60, 0], [480, 160, 15, 1000]] as const) {
          const x0 = 180 - gap / 2
          const x1 = 180 + gap / 2
          for (const x of [x0, x1]) {
            hatch(g, E(x, y, 26), d + 300, true)
            ink(g, E(x, y, 26), { w: 3, d, t: 400 })
          }
          arrow(g, L([x0 - 28, y], [x0 - 28 - len, y]), { w: 3, d: d + 500, t: 200, head: 9 })
          arrow(g, L([x1 + 28, y], [x1 + 28 + len, y]), { w: 3, d: d + 500, t: 200, head: 9 })
          text(g, 180, y + 60, d ? 'doppelter Abstand: ¼ Kraft' : 'Abstand', { anchor: 'middle', d: d + 600 })
        }
      },
    },
    scenes: [
      { t: HOOK(470), pics: { n: { img: 0, x: 16, y: 56, w: 328, h: 374, enter: 'blot', cam: [50, 30, 1.1], cam2: [50, 28, 1.25], cap: 'Godfrey Kneller, Isaac Newton, 1689' } } },
      { t: T('Isaac Newton, 1643 bis 1727: Physiker, Mathematiker, Astronom – einer der **einflussreichsten** Forscher überhaupt.', 64), gfx: { zahl: { args: ['1643', 'geboren in Woolsthorpe', 420] } } },
      { t: T('1665 schloss die **Pest** die Universität Cambridge. Newton ging nach Hause – in seine produktivste Zeit.', 470), pics: { b: { img: 1, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [50, 45, 1.05] } } },
      {
        t: { text: 'Die Geschichte ist fast wahr: Newton erzählte sie im Alter selbst seinem Freund **Stukeley**.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { n: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [50, 26, 1.8] } },
        gfx: { erzaehlen: {} },
      },
      { t: T('Stukeley schrieb: Nach dem Essen saßen sie im Garten unter **Apfelbäumen**, und Newton erzählte, wie ihm die Idee kam.', 64), gfx: { erzaehlen: {} } },
      {
        t: T('Um 1666 sah er im Garten von Woolsthorpe einen Apfel **fallen**.', 486),
        pics: { b: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 40, 1.2] } },
        gfx: { fall: { tf: [1, 0, 80] } },
      },
      { t: T('Auf den **Kopf** fiel er aber nicht – das ist eine spätere Ausschmückung.', 64), gfx: { sitzen: { cls: 'a1' } } },
      { t: T('Newton fragte sich: Warum fällt der Apfel senkrecht? Und reicht dieselbe Kraft bis zum **Mond**?', 64), gfx: { mond: {} } },
      { t: T('Der Mond fällt auch – nur fliegt er gleichzeitig so schnell **seitwärts**, dass er die Erde immer verfehlt.', 64), gfx: { kanone: {} } },
      { t: T('Der Mond ist rund 60 Erdradien entfernt. Die Kraft dort ist also **3.600-mal** schwächer:', 64), gfx: { f1: { draw: 'formel', args: [['60', '×', '60', '=', '3.600'], 330, '60-mal weiter weg'] } } },
      { t: T('Daraus wurde das **Gravitationsgesetz**: Jede Masse zieht jede andere an – schwächer mit dem Quadrat der Entfernung.', 64), gfx: { gesetz: {} } },
      { t: T('In Worten:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Anziehung', '=', 'Konstante', '×', 'Masse 1 × Masse 2', '÷', 'Abstand × Abstand'], 300] } } },
      { t: T('Veröffentlicht hat er das **1687** in den „Principia“ – einem der wichtigsten Bücher der Wissenschaft.', 64), gfx: { z2: { draw: 'zahl', args: ['1687', '„Principia“', 420] } } },
      { t: T('Dasselbe Gesetz erklärt noch viel mehr:', 64, { kind: 'big' }), gfx: { punkte: { args: [['Ebbe und Flut', 'Bahnen der Planeten', 'Wiederkehr von Kometen'], 320] } } },
      {
        t: T('Der Apfelbaum steht übrigens noch heute in **Woolsthorpe Manor**.', 486),
        pics: { b: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.15] } },
      },
      { t: T('Ableger des Baums wachsen heute an **Universitäten** weltweit.', 470), pics: { b: { img: 1, x: 16, y: 56, w: 328, h: 390, cam: [50, 40, 1.3] } } },
      recap(
        [{ pic: 0, id: 'n', cam: [50, 26, 1.4] }, { gfx: 'sitzen', cls: 'a1' }, { gfx: 'mond' }, { gfx: 'gesetz' }],
        ['Newton erzählte es selbst', 'nicht auf den Kopf', 'Apfel und Mond: dieselbe Kraft', 'Gravitationsgesetz'],
      ),
    ],
    summary: ['Newton erzählte die Apfel-Geschichte selbst.', 'Vom Kopf ist bei ihm keine Rede.', 'Gleiche Kraft für Apfel und Mond: Gravitation.'],
    sources: ['Stukeley 1752, Memoirs of Sir Isaac Newton’s Life (Royal Society)', 'Newton 1687, Principia'],
  },
  {
    id: 'blitz',
    area: 'PHY',
    day: 37,
    hook: 'Schlägt der Blitz nie zweimal ein?',
    mood: 'episch',
    ambience: 'regen',
    images: [img('blitz-eiffelturm')],
    draw: {
      wolke(g) {
        const c: P[] = [...B([60, 330], [20, 330], [20, 270], [70, 260]), ...B([70, 260], [80, 200], [180, 190], [190, 240]).slice(1), ...B([190, 240], [220, 200], [320, 220], [300, 280]).slice(1), ...B([300, 280], [340, 290], [330, 340], [290, 340]).slice(1), [60, 330]]
        hatch(g, c, 600)
        ink(g, c, { w: 3, t: 800 })
        for (const [x, y] of [[110, 240], [170, 225], [240, 240]] as const) text(g, x, y + 6, '+', { anchor: 'middle', size: 26, d: 1000 })
        for (const [x, y] of [[90, 316], [170, 322], [260, 316]] as const) text(g, x, y + 6, '−', { anchor: 'middle', size: 26, d: 1300 })
        bolt(g, [[170, 340], [210, 420], [180, 430], [220, 540]], 1800, 4.6)
        ink(g, L([20, 560], [340, 560]), { w: 3, d: 200, t: 500 })
      },
      hochhaus(g) {
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 400 })
        const tower: P[] = [[110, 620], [110, 470], [130, 470], [130, 420], [150, 420], [150, 370], [170, 370], [176, 330], [184, 330], [190, 370], [210, 370], [210, 420], [230, 420], [230, 470], [250, 470], [250, 620]]
        hatch(g, tower, 700)
        ink(g, tower, { w: 3, d: 100, t: 900 })
        ink(g, L([180, 330], [180, 280]), { w: 3, d: 800, t: 200 })
        const b = group(g)
        bolt(b, [[120, 180], [170, 230], [150, 240], [182, 280]], 0, 4.4)
        loop(b, [{ opacity: 0 }, { opacity: 1, offset: 0.04 }, { opacity: 0.2, offset: 0.08 }, { opacity: 1, offset: 0.12 }, { opacity: 0, offset: 0.2 }, { opacity: 0 }], 1300, 900)
        const t = text(g, 300, 400, '', { anchor: 'middle', size: 34, d: 900 })
        let n = 0
        const iv = window.setInterval(() => {
          if (!t.isConnected) return window.clearInterval(iv)
          n = Math.min(25, n + 1)
          t.textContent = String(n)
        }, 160)
        text(g, 300, 430, 'pro Jahr', { anchor: 'middle', cls: 's', d: 900 })
      },
      spitze(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 400 })
        const p = group(g)
        ink(p, L([90, 600], [92, 520]), { w: 4, d: 200, t: 300 })
        ink(p, E(92, 500, 34, 30), { w: 2.8, d: 300, t: 500 })
        hatch(p, E(92, 500, 34, 30), 600, true)
        const tower: P[] = [[220, 600], [250, 330], [270, 330], [300, 600]]
        ink(g, tower, { w: 3, d: 400, t: 700 })
        for (let k = 0; k < 6; k++) ink(g, L([226 + k * 2, 560 - k * 40], [294 - k * 2, 560 - k * 40]), { w: 1.6, d: 700 + k * 80, t: 150 })
        ink(g, L([260, 330], [260, 280]), { w: 3, d: 1000, t: 200 })
        bolt(g, [[200, 180], [235, 222], [215, 230], [260, 280]], 1300, 4.4)
      },
      ableiter(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 400 })
        ink(g, RR(110, 440, 140, 160, 3), { w: 3, d: 100, t: 600 })
        ink(g, [[100, 440], [180, 360], [260, 440]], { w: 3, d: 400, t: 500 })
        hatch(g, [[104, 440], [180, 364], [256, 440]], 700, true)
        ink(g, L([180, 362], [180, 290]), { w: 3, d: 800, t: 300 })
        dashes(g, [...L([182, 300], [272, 380]), ...L([272, 380], [272, 600]).slice(1), ...L([272, 600], [272, 640]).slice(1)], { w: 2.2, d: 900, dash: 8, gap: 4 })
        bolt(g, [[130, 190], [165, 232], [150, 242], [180, 290]], 1600, 4.4)
        arrow(g, L([300, 560], [300, 640]), { w: 2.6, d: 2000, t: 300 })
        text(g, 310, 540, 'Erde', { anchor: 'middle', d: 2100, cls: 's' })
      },
      hitze(g) {
        hbars(g, [
          { label: 'Blitz', v: 30000, fmt: (v) => `${tsd(Math.round(v / 100) * 100)} °C`, dense: true },
          { label: 'Sonnenoberfläche', v: 5500, fmt: (v) => `${tsd(Math.round(v / 100) * 100)} °C` },
        ], { y: 300, gap: 120 })
      },
      donner(g) {
        bolt(g, [[60, 230], [100, 300], [80, 310], [110, 380]], 0, 4.4)
        fig(pop(g, 300), 290, 560, 3)
        for (let k = 0; k < 3; k++) {
          const w = group(g)
          ink(w, E(110, 380, 60 + k * 50, 60 + k * 50, -30, 60), { w: 2.2, t: 0 })
          loop(w, [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0 }], 1800, 600 + k * 300)
        }
        text(g, 180, 640, '6 Sekunden ÷ 3 = 2 km', { anchor: 'middle', size: 22, d: 1400 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 30, 1.1], cam2: [50, 25, 1.3], cap: 'Eiffelturm, 1902' } } },
      { t: T('Das Sprichwort ist gründlich falsch: Das **Empire State Building** wird im Schnitt 20- bis 25-mal pro Jahr getroffen.', 64), gfx: { hochhaus: {} } },
      { t: T('Blitze nehmen den Weg des geringsten Widerstands – oft über **hohe, spitze** Punkte.', 64), gfx: { spitze: {} } },
      { t: T('Wie entsteht ein Blitz? In Gewitterwolken stoßen Eiskristalle und Graupel zusammen – oben sammelt sich **Plus**, unten Minus.', 64), gfx: { wolke: {} } },
      { t: T('Wird die Spannung zu groß, entlädt sie sich in Sekundenbruchteilen.', 64), gfx: { z2: { draw: 'zahl', args: ['100 Mio. V', 'Spannung eines Blitzes', 420] } } },
      { t: T('Was einmal getroffen wurde, steht ja noch dort. Dafür gibt es **Blitzableiter**, erfunden von Benjamin Franklin um 1750.', 64), gfx: { ableiter: {} } },
      { t: T('Ein Blitzableiter zieht Blitze nicht an. Er leitet sie nur **gefahrlos** in die Erde, statt durchs Haus.', 64), gfx: { ableiter: {} } },
      { t: T('Ein Blitz ist bis zu **30.000 Grad** heiß – fünfmal heißer als die Sonnenoberfläche.', 64), gfx: { hitze: {} } },
      { t: T('Donner ist die explodierende Luft. Sekunden bis zum Donner geteilt durch **drei**: Entfernung in Kilometern.', 64), gfx: { donner: {} } },
      { t: T('Warum hilft das Zählen? Licht ist so schnell, dass du den Blitz praktisch im **selben Moment** siehst.', 64), gfx: { f6: { draw: 'formel', args: [['Licht', '≈', '300.000 km pro Sekunde'], 330, 'praktisch sofort da'] } } },
      { t: T('Schall ist fast eine Million Mal **langsamer**: rund 343 Meter pro Sekunde.', 64), gfx: { f7: { draw: 'formel', args: [['Schall', '≈', '343 m pro Sekunde'], 330, 'braucht Zeit'] } } },
      { t: T('In drei Sekunden schafft der Schall also gut **einen Kilometer**:', 64), gfx: { f8: { draw: 'formel', args: [['3 Sekunden', '×', '343 m', '≈', '1.030 m', '≈', '1 km'], 320] } } },
      { t: T('Daraus folgt die Regel:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Entfernung in km', '≈', 'Sekunden bis zum Donner', '÷', '3'], 320] } } },
      { t: T('Ein Beispiel: Du siehst den Blitz und zählst „einundzwanzig, zweiundzwanzig …“ – bis zum Donner sind es **12 Sekunden**.', 64), gfx: { f9: { draw: 'formel', args: [['12 Sekunden', '÷', '3', '=', '4 km entfernt'], 330] } } },
      { t: T('Zähl bei jedem Blitz neu. Wird die Zahl **kleiner**, kommt das Gewitter auf dich zu:', 64), gfx: { n1: { draw: 'formel', args: [['15 s', '→', '5 km'], 260] }, n2: { draw: 'formel', args: [['9 s', '→', '3 km'], 370] }, n3: { draw: 'formel', args: [['4 s', '→', 'gut 1 km'], 480] } } },
      { t: T('Unter 10 Sekunden – näher als drei Kilometer – wird es **gefährlich**: ab ins Haus oder Auto.', 64), gfx: { z3: { draw: 'zahl', args: ['< 10 s', 'dann schnell rein', 420] } } },
      { t: T('Und erst eine halbe Stunde nach dem letzten Donner wieder raus – auch ein **abziehendes** Gewitter trifft noch.', 64), gfx: { f10: { draw: 'formel', args: [['letzter Donner', '+', '30 Minuten', '=', 'wieder raus'], 330] } } },
      { t: T('Im Auto bist du sicher: Die Metallhülle leitet den Strom außen herum – ein **Faradayscher Käfig**.', 64), gfx: { p2: { draw: 'punkte', args: [['Auto oder Haus: sicher', 'kein einzelner Baum', 'im Freien: Hocke, Füße zusammen'], 320] } } },
      recap(
        [{ gfx: 'hochhaus' }, { gfx: 'wolke' }, { gfx: 'ableiter' }, { gfx: 'donner' }],
        ['Empire State: 20–25 pro Jahr', 'Plus oben, Minus unten', 'Blitzableiter', 'Sekunden ÷ 3 = km'],
      ),
    ],
    summary: ['Empire State Building: rund 20–25 Treffer pro Jahr.', 'Hohe, spitze Punkte werden bevorzugt getroffen.', 'Sekunden bis zum Donner ÷ 3 = Kilometer.'],
    sources: ['NOAA National Weather Service: Lightning Myths', 'NOAA: How Hot Is Lightning?'],
  },
  {
    id: 'tote-sterne',
    area: 'PHY',
    day: 84,
    hook: 'Siehst du nachts Sterne, die längst tot sind?',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [img('orion')],
    draw: {
      licht(g) {
        star(g, 60, 400, 30, { fill: true })
        eye(g, 300, 400, 0.8, 300)
        for (let k = 0; k < 4; k++) {
          const p = group(g)
          mk('circle', { cx: 100, cy: 400, r: 4, class: 'k' }, p)
          loop(p, [{ transform: 'translateX(0)', opacity: 0 }, { opacity: 1, offset: 0.1 }, { transform: 'translateX(150px)', opacity: 1, offset: 0.9 }, { transform: 'translateX(160px)', opacity: 0 }], 2400, k * 600)
        }
        const dead = st(g, 'f1', '--dl:800ms')
        cross(dead, 60, 400, 2)
        text(dead, 60, 470, 'erloschen?', { anchor: 'middle', fade: false })
      },
      galaxie(g) {
        for (let k = 0; k < 2; k++) {
          const pts: P[] = []
          for (let i = 0; i <= 80; i++) {
            const t = i / 80
            const a = k * Math.PI + t * Math.PI * 2.4
            const r = 10 + t * 130
            pts.push([180 + Math.cos(a) * r, 400 + Math.sin(a) * r * 0.55])
          }
          ink(g, pts, { w: 3, d: k * 300, t: 1400 })
        }
        hatch(g, E(180, 400, 30, 18), 600, true)
        const spin = group(g)
        spin.style.transformOrigin = '180px 400px'
        text(g, 180, 560, 'Licht: Millionen Jahre alt', { anchor: 'middle', d: 1400 })
      },
      zeit(g) {
        text(g, 30, 290, 'Weg des Lichts: meist unter 1.000 Jahre', { d: 100 })
        ink(g, RR(30, 304, 300, 40, 8), { w: 2, d: 100, t: 400 }).style.opacity = '0.35'
        const b1 = st(g, 'grow-x', '--d:400ms')
        hatch(b1, RR(30, 304, 8, 40, 3), 400, true)
        ink(b1, RR(30, 304, 8, 40, 3), { w: 2.6, t: 0 })
        const two = st(g, 'f1', '--dl:200ms')
        text(two, 30, 420, 'Leben eines Sterns: Millionen bis', { fade: false })
        text(two, 30, 442, 'Milliarden Jahre', { fade: false })
        const b2 = st(two, 'm1', '--m1: scaleX(1); transform-origin: 30px 470px')
        hatch(b2, RR(30, 456, 300, 40, 8), 0)
        ink(b2, RR(30, 456, 300, 40, 8), { w: 2.8, t: 0 })
        text(st(g, 'f2', '--dl:300ms'), 30, 560, 'schon tot? sehr unwahrscheinlich', { fade: false, size: 17 })
      },
      supernova(g) {
        const core = pop(g, 200, '50% 50%')
        hatch(core, E(180, 400, 40), 0, true)
        ink(core, E(180, 400, 40), { w: 3, t: 0 })
        rays(g, 180, 400, 56, 140, 16, 600)
        for (let k = 0; k < 8; k++) star(g, 180 + Math.cos(k) * 150, 400 + Math.sin(k * 1.7) * 160, 8, { d: 1200 + k * 80 })
        text(g, 180, 620, 'in den nächsten 100.000 Jahren', { anchor: 'middle', d: 1500 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { o: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [45, 45, 1.25] } } },
      { t: T('Licht ist schnell – rund **300.000 Kilometer** pro Sekunde. Aber das Weltall ist riesig.', 64), gfx: { z1: { draw: 'zahl', args: ['300.000', 'Kilometer pro Sekunde', 420] } } },
      { t: T('Deshalb messen Astronomen Entfernungen in **Lichtjahren**:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['1 Lichtjahr', '=', 'Strecke, die Licht in einem Jahr schafft', '≈', '9,5 Billionen km'], 320] } } },
      { t: T('Klingt poetisch: Das Licht ist so lange unterwegs, dass der Stern inzwischen **erloschen** sein könnte.', 64), gfx: { licht: { cls: 'a1' } } },
      { t: T('Schon die **Sonne** siehst du so, wie sie vor gut acht Minuten war.', 64), gfx: { z2: { draw: 'zahl', args: ['8 min', 'braucht Sonnenlicht bis zu uns', 420] } } },
      { t: T('Bei fernen **Galaxien** stimmt das Prinzip.', 64), gfx: { galaxie: {} } },
      { t: T('Die **Andromeda**-Galaxie siehst du bei dunklem Himmel mit bloßem Auge. Ihr Licht ist 2,5 Millionen Jahre alt.', 64), gfx: { galaxie: {} } },
      { t: T('Aber die Sterne, die du mit bloßem Auge siehst, sind fast alle **in der Nähe**.', 64), gfx: { zeit: {} } },
      { t: T('Und Sterne leben Millionen bis Milliarden Jahre. Die Chance, dass einer schon tot ist, ist **winzig**.', 64), gfx: { zeit: { cls: 'a1 a2' } } },
      { t: T('Ohne Fernglas siehst du nur einige **Tausend** Sterne – fast alle aus unserer Nachbarschaft in der Milchstraße.', 64), gfx: { zahl: { args: ['≈ 5.000', 'Sterne mit bloßem Auge', 420] } } },
      { t: T('Grob gerechnet:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['1.000 Jahre Lichtweg', '÷', '1 Milliarde Jahre Sternenleben', '=', '1 zu 1 Million'], 320] } } },
      { t: T('Sonnenähnliche Sterne leben rund **10 Milliarden** Jahre – unsere Sonne hat knapp die Hälfte hinter sich.', 64), gfx: { zeit: { cls: 'a1 a2' } } },
      {
        t: T('Heißester Kandidat ist **Beteigeuze**, die rote Schulter des Orion – rund 550 Lichtjahre entfernt.', 476),
        pics: { o: { img: 0, x: 16, y: 56, w: 328, h: 400, cam: [40, 25, 1.6], cam2: [40, 25, 1.9] } },
      },
      { t: T('Beteigeuze ist ein **Roter Überriese**: An Stelle der Sonne würde er die Bahnen von Erde und Mars verschlucken.', 450), pics: { o: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [40, 25, 1.9] } } },
      { t: T('2019 wurde er plötzlich deutlich **dunkler**. Die Ursache: eine Staubwolke, die er selbst ausgestoßen hatte.', 64), gfx: { licht: {} } },
      { t: T('Sie wird als **Supernova** explodieren – vermutlich aber nicht so bald.', 64), gfx: { supernova: {} } },
      { t: T('Wenn er explodiert, leuchtet er wochenlang etwa so hell wie der **Halbmond** – sogar am Tag sichtbar.', 64), gfx: { supernova: {} } },
      { t: T('Gefährlich ist das für uns nicht – dafür ist er zu **weit** weg.', 64), gfx: { z3: { draw: 'zahl', args: ['550', 'Lichtjahre Sicherheitsabstand', 420] } } },
      { t: T('Und vielleicht ist es **schon passiert** – das Licht wäre noch unterwegs:', 64), gfx: { f3: { draw: 'formel', args: [['550 Lichtjahre', '=', '550 Jahre Verspätung'], 330] } } },
      recap(
        [{ gfx: 'licht', cls: 'a1' }, { gfx: 'zeit', cls: 'a1 a2' }, { pic: 0, id: 'o', cam: [40, 25, 1.5] }, { gfx: 'supernova' }],
        ['Licht braucht Zeit', 'Weg kurz, Sternenleben lang', 'Beteigeuze: 550 Lichtjahre', 'Supernova – irgendwann'],
      ),
    ],
    summary: ['Sichtbare Sterne sind meist nur hunderte bis tausende Lichtjahre entfernt.', 'Sterne leben Millionen bis Milliarden Jahre.', 'Beteigeuze explodiert irgendwann – wohl nicht bald.'],
    sources: ['ESA: Hipparcos-Katalog', 'Joyce et al. 2020, Astrophysical Journal'],
  },
  {
    id: 'gps-einstein',
    area: 'PHY',
    day: 49,
    hook: 'Ohne Einstein würde dich dein Handy in die Irre führen.',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [img('gps-satellit'), img('einstein')],
    draw: {
      bahn(g) {
        globe(g, 180, 430, 110, 0, 0)
        dashes(g, E(180, 430, 170), { w: 1.6, d: 600, dash: 6, gap: 8 })
        for (let k = 0; k < 3; k++) {
          const o = group(g)
          o.style.transformOrigin = '180px 430px'
          satellite(o, 180, 260, 0.8, 800)
          o.animate([{ transform: `rotate(${k * 120}deg)` }, { transform: `rotate(${k * 120 + 360}deg)` }], { duration: 16000, iterations: Infinity })
        }
      },
      signal(g) {
        const phone = pop(g, 0)
        ink(phone, RR(160, 520, 40, 70, 8), { w: 3, t: 0 })
        ink(phone, L([172, 580], [188, 580]), { w: 2, t: 0 })
        for (const [x, y, d] of [[60, 300, 300], [180, 270, 500], [300, 310, 700]] as const) {
          satellite(g, x, y, 1, d)
          dashes(g, L([x, y + 14], [180, 516]), { w: 1.8, d: d + 400 })
          clock(g, x + 40, y - 30, 16, 0, 0, d + 200)
        }
        text(st(g, 'f1', '--dl:300ms'), 180, 640, '1 Milliardstel Sekunde ≈ 30 cm', { anchor: 'middle', fade: false, size: 18 })
      },
      uhren(g) {
        const c1 = clock(g, 90, 360, 60, 0, 0, 0)
        const c2 = clock(g, 270, 360, 60, 0, 0, 300)
        c1.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 6000, iterations: Infinity })
        const sat = c2.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 6000, iterations: Infinity })
        text(g, 90, 456, 'Erde', { anchor: 'middle', d: 400 })
        text(g, 270, 456, 'Satellit', { anchor: 'middle', d: 600 })
        const a = st(g, 'f1', '--dl:200ms')
        text(a, 270, 500, '− 7 µs (Tempo)', { anchor: 'middle', fade: false })
        const b = st(g, 'f2', '--dl:200ms')
        text(b, 270, 530, '+ 45 µs (Schwerkraft)', { anchor: 'middle', fade: false })
        text(b, 270, 576, '= + 38 µs pro Tag', { anchor: 'middle', fade: false, size: 20 })
        sat.playbackRate = 1.15
      },
      drift(g) {
        const road: P[] = [...B([40, 600], [120, 500], [80, 400], [200, 330]), ...B([200, 330], [300, 270], [260, 200], [320, 160]).slice(1)]
        ink(g, road, { w: 2.6, t: 900 })
        const pin = st(g, 'm1', '--m1: translate(110px, -90px); --dl: 800ms; transition-duration: 2.4s')
        blank(pin, E(120, 470, 14))
        ink(pin, [...B([120, 500], [100, 470], [100, 450], [120, 450]), ...B([120, 450], [140, 450], [140, 470], [120, 500]).slice(1)], { w: 3, d: 300, t: 400 })
        mk('circle', { cx: 120, cy: 462, r: 4, class: 'k' }, pin)
        text(g, 180, 640, '38 µs × Lichtgeschwindigkeit ≈ 11 km', { anchor: 'middle', d: 1000, size: 17 })
      },
    },
    scenes: [
      { t: HOOK(66), gfx: { bahn: {} } },
      { t: T('Rund **30** GPS-Satelliten umkreisen die Erde in etwa 20.200 Kilometern Höhe.', 64), gfx: { zahl: { args: ['20.200 km', 'Flughöhe der GPS-Satelliten', 420] } } },
      { t: T('GPS gehört dem US-Militär. Europa hat ein eigenes System: **Galileo**.', 64), gfx: { punkte: { args: [['GPS: USA', 'Galileo: Europa', 'GLONASS: Russland', 'BeiDou: China'], 300] } } },
      { t: T('GPS-Satelliten tragen **Atomuhren**. Dein Handy misst, wie lange ihre Signale brauchen, und berechnet daraus deinen Ort.', 64), gfx: { signal: {} } },
      { t: T('Dafür muss die Zeit auf **Milliardstel** Sekunden stimmen.', 64), gfx: { signal: { cls: 'a1' } } },
      { t: T('Dein Handy braucht mindestens **vier** Satelliten: drei für den Ort, einen für die Uhrzeit.', 64), gfx: { signal: { cls: 'a1' } } },
      { t: T('Die Grundrechnung:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Entfernung', '=', 'Lichtgeschwindigkeit', '×', 'Laufzeit des Signals'], 320] } } },
      { t: T('Darum zählt jede Milliardstel Sekunde:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['1 Milliardstel Sekunde', '×', 'Lichtgeschwindigkeit', '≈', '30 cm'], 320] } } },
      {
        t: { text: 'Doch die Uhren dort oben gehen anders: wegen ihres Tempos **langsamer** …', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { e: { img: 1, x: 20, y: 64, w: 96, h: 120, r: 'oval', enter: 'fade', cam: [55, 25, 1.6] } },
        gfx: { uhren: { cls: 'a1' } },
      },
      {
        t: { text: '… wegen der schwächeren Schwerkraft **schneller**. Das sind beide Relativitätstheorien.', x: 130, y: 70, w: 212, kind: 'mid' },
        pics: { e: { img: 1, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [55, 25, 1.6] } },
        gfx: { uhren: { cls: 'a1 a2' } },
      },
      { t: T('Spezielle Relativitätstheorie, Einstein 1905: Wer sich schnell bewegt, für den vergeht die Zeit **langsamer**.', 64), gfx: { f3: { draw: 'formel', args: [['14.000 km/h Bahngeschwindigkeit', '→', '7 Mikrosekunden pro Tag langsamer'], 320] } } },
      { t: T('Allgemeine Relativitätstheorie, 1915: Wo die Schwerkraft schwächer ist, vergeht die Zeit **schneller**.', 64), gfx: { f4: { draw: 'formel', args: [['20.200 km über der Erde', '→', '45 Mikrosekunden pro Tag schneller'], 320] } } },
      { t: T('Zusammen:', 64, { kind: 'big' }), gfx: { f5: { draw: 'formel', args: [['+ 45', '−', '7', '=', '+ 38 Mikrosekunden pro Tag'], 330] } } },
      { t: T('Klingt nach nichts – aber ohne Korrektur würde dein Standort jeden Tag um über **11 Kilometer** abdriften.', 64), gfx: { drift: { cls: 'a1' } } },
      { t: T('Nachgerechnet:', 64, { kind: 'big' }), gfx: { f6: { draw: 'formel', args: [['38 Mikrosekunden', '×', '300.000 km pro Sekunde', '≈', '11,4 km'], 320] } } },
      { t: T('Deshalb werden die Uhren schon vor dem Start leicht verstellt: Sie ticken absichtlich etwas **langsamer**.', 64), gfx: { uhren: { cls: 'a1 a2' } } },
      {
        t: T('Relativität ist **Alltagstechnik**.', 486, { kind: 'big' }),
        pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [55, 40, 1.05], cam2: [55, 40, 1.25] } },
      },
      recap(
        [{ gfx: 'bahn' }, { gfx: 'signal' }, { gfx: 'uhren', cls: 'a1 a2' }, { gfx: 'drift', cls: 'a1' }],
        ['rund 30 Satelliten', 'Laufzeit = Entfernung', '− 7 + 45 = + 38 µs', 'ohne Korrektur: 11 km pro Tag'],
      ),
    ],
    summary: ['GPS braucht Uhren, die auf Milliardstel genau gehen.', 'Netto gehen die Satellitenuhren 38 µs pro Tag vor.', 'Ohne Korrektur: Kilometer Fehler pro Tag.'],
    sources: ['Ashby 2003, Living Reviews in Relativity'],
  },
  {
    id: 'gold-machen',
    area: 'CHE',
    day: 58,
    hook: 'Kann man aus Blei Gold machen?',
    mood: 'raetsel',
    ambience: 'feuer',
    images: [img('goldbarren'), img('wright-alchemist')],
    draw: {
      kerne(g) {
        nucleus(g, 100, 380, 60, 46, 0)
        nucleus(g, 260, 380, 62, 48, 400)
        const t1 = text(g, 100, 480, '', { anchor: 'middle', size: 28, d: 600 })
        const t2 = text(g, 260, 480, '', { anchor: 'middle', size: 28, d: 900 })
        for (const [t, v, d] of [[t1, 79, 600], [t2, 82, 900]] as const) {
          const t0 = performance.now() + d
          const tick = () => {
            const k = Math.min(1, Math.max(0, (performance.now() - t0) / 1200))
            t.textContent = String(Math.round(v * k))
            if (k < 1 && t.isConnected) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
        text(g, 100, 512, 'Gold', { anchor: 'middle', d: 700 })
        text(g, 260, 512, 'Blei', { anchor: 'middle', d: 1000 })
        text(g, 180, 270, 'Protonen im Kern', { anchor: 'middle', cls: 's', d: 300 })
      },
      atom(g) {
        nucleus(g, 180, 400, 30, 30, 0)
        for (let k = 0; k < 3; k++) {
          const r = 70 + k * 32
          ink(g, E(180, 400, r), { w: 1.6, d: 300 + k * 200, t: 700 })
          const o = group(g)
          mk('circle', { cx: 180 + r, cy: 400, r: 7, class: 'k' }, o)
          o.style.transformOrigin = '180px 400px'
          o.style.transformBox = 'view-box'
          o.animate([{ transform: `rotate(${k * 120}deg)` }, { transform: `rotate(${k * 120 + 360}deg)` }], { duration: 2600 + k * 900, iterations: Infinity })
        }
        const lock = pop(g, 1200, '50% 50%')
        blank(lock, RR(160, 470, 40, 30, 6))
        ink(lock, RR(160, 470, 40, 30, 6), { w: 2.6, t: 0 })
        ink(lock, B([168, 470], [168, 450], [192, 450], [192, 470]), { w: 2.6, t: 0 })
        text(g, 180, 600, 'Chemie: nur die Elektronen', { anchor: 'middle', d: 1400 })
      },
      ring(g) {
        ink(g, E(180, 400, 130), { w: 3.2, t: 900 })
        ink(g, E(180, 400, 110), { w: 2, d: 200, t: 900 })
        const p = group(g)
        mk('circle', { cx: 300, cy: 400, r: 7, class: 'k' }, p)
        p.style.transformOrigin = '180px 400px'
        p.style.transformBox = 'view-box'
        p.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 1400, iterations: Infinity })
        text(g, 180, 408, 'Bismut → Gold', { anchor: 'middle', d: 900, size: 18 })
        text(g, 180, 580, '1980', { anchor: 'middle', size: 26, d: 1200 })
      },
      knall(g) {
        for (const [s, d] of [[-1, 0], [1, 0]] as const) {
          const n = group(g)
          nucleus(n, 180 + s * 120, 400, 30, 26, d)
          n.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-s * 100}px)` }], { duration: 900, delay: 600, fill: 'forwards', easing: 'ease-in' })
        }
        const burst = pop(g, 1500, '50% 50%')
        rays(burst, 180, 400, 30, 110, 14, 0)
        text(g, 180, 560, 'Blei + Blei am CERN, 2025', { anchor: 'middle', d: 1700 })
        text(g, 180, 600, 'Gold: winzige Spuren', { anchor: 'middle', d: 2000, cls: 's' })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { g: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [45, 45, 1.05], cam2: [45, 45, 1.3] } } },
      { t: T('Gold ist begehrt: Es rostet nicht, glänzt und ist selten. Alles je geförderte Gold passt in einen **Würfel**:', 64), gfx: { f0: { draw: 'formel', args: [['rund 212.000 Tonnen', '÷', '19,3 Tonnen pro Kubikmeter', '≈', 'Würfel mit 22 m Kante'], 320] } } },
      {
        t: T('Jahrhundertelang suchten **Alchemisten** danach.', 486),
        pics: { a: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.0], cam2: [50, 50, 1.1], cap: 'Joseph Wright of Derby, Der Alchemist, 1771' } },
      },
      {
        t: T('1669 kochte Hennig Brand in Hamburg Urin ein. Gold fand er nicht – aber einen Stoff, der im Dunkeln **leuchtete**: Phosphor.', 450),
        pics: { a: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 52, 2.2], cam2: [50, 52, 2.5] } },
      },
      { t: T('Alchemisten glaubten, alles bestehe aus denselben **Grundstoffen** – man müsse sie nur richtig mischen.', 64), gfx: { punkte: { args: [['Erde', 'Wasser', 'Luft', 'Feuer'], 300] } } },
      { t: T('Sogar Isaac **Newton** experimentierte jahrzehntelang mit Alchemie.', 450), pics: { a: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 50, 1.2] } } },
      { t: T('Chemisch geht es nicht: Ein Element wird durch die Zahl der **Protonen** im Kern bestimmt.', 64), gfx: { kerne: {} } },
      { t: T('Das Periodensystem ordnet die Elemente nach Protonenzahl – **118** sind heute bekannt.', 64), gfx: { zahl: { args: ['118', 'bekannte Elemente', 420] } } },
      { t: T('Für Gold aus Blei müsste man also:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Blei: 82 Protonen', '−', '3 Protonen', '=', 'Gold: 79'], 320] } } },
      { t: T('Chemische Reaktionen verschieben nur **Elektronen** – den Kern rühren sie nicht an.', 64), gfx: { atom: {} } },
      { t: T('Chemische Reaktionen tauschen nur Elektronen der **äußeren Hülle** aus. Den Kern zu ändern braucht millionenfach mehr Energie.', 64), gfx: { atom: {} } },
      { t: T('**Kernphysik** schafft es: 1980 wandelten Forscher um Glenn Seaborg Bismut in winzige Mengen Gold um.', 64), gfx: { ring: {} } },
      { t: T('2025 meldete das CERN Gold aus Blei-Kollisionen. Kosten: weit mehr, als das Gold **wert** ist.', 64), gfx: { knall: {} } },
      { t: T('Am CERN entstanden zwischen 2015 und 2018 rund **86 Milliarden** Goldkerne:', 64), gfx: { f2: { draw: 'formel', args: [['86 Milliarden Goldkerne', '≈', '29 Billionstel Gramm'], 330] } } },
      { t: T('Und sie existierten nur **Sekundenbruchteile**, bevor sie zerfielen oder auf Bauteile prallten.', 64), gfx: { knall: {} } },
      { t: T('Natürliches Gold stammt übrigens aus dem **All**: vor allem aus verschmelzenden Neutronensternen.', 64), gfx: { z3: { draw: 'zahl', args: ['Sternenstaub', 'Herkunft allen Goldes', 420] } } },
      { t: T('Gold ist extrem **dehnbar**: Aus einem Gramm lässt sich ein Draht von über zwei Kilometern ziehen.', 64), gfx: { z5: { draw: 'zahl', args: ['2 km', 'Draht aus einem Gramm Gold', 420] } } },
      { t: T('Ganz nutzlos war die Alchemie nicht:', 64, { kind: 'big' }), gfx: { f5: { draw: 'formel', args: [['Alchemie', '→', 'Laborwissen', '→', 'Chemie'], 330] } } },
      { t: T('Und Brands Phosphor? Er wurde später ein Grundstoff für **Streichhölzer**.', 450), pics: { a: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 52, 1.8] } } },
      recap(
        [{ gfx: 'kerne' }, { gfx: 'atom' }, { gfx: 'knall' }, { pic: 1, id: 'a', cam: [50, 52, 1.6] }],
        ['Gold 79, Blei 82 Protonen', 'Chemie: nur Elektronen', 'Kernphysik: winzige Mengen', 'Alchemie brachte Phosphor'],
      ),
    ],
    summary: ['Element = Zahl der Protonen: Gold 79, Blei 82.', 'Chemie ändert den Kern nicht, Kernphysik schon.', 'Die Alchemie brachte nebenbei den Phosphor.'],
    sources: ['Aleklett et al. 1981, Physical Review C', 'ALICE Collaboration 2025, Physical Review C'],
  },
  {
    id: 'kitzeln',
    area: 'NERV',
    day: 4,
    hook: 'Warum kannst du dich nicht selbst kitzeln?',
    mood: 'verspielt',
    images: [img('lachendes-kind')],
    draw: {
      fuss(g) {
        const foot: P[] = [...B([100, 300], [80, 400], [90, 520], [150, 560]), ...B([150, 560], [210, 590], [280, 580], [290, 540]).slice(1), ...B([290, 540], [300, 500], [240, 490], [180, 470]).slice(1), ...B([180, 470], [150, 450], [150, 380], [160, 300]).slice(1)]
        ink(g, foot, { w: 3.2, t: 900 })
        for (let k = 0; k < 5; k++) ink(g, E(292 - k * 2, 520 + k * 14 - 30, 8, 7), { w: 2, d: 700 + k * 80, t: 200 })
        const fe = st(g, 'sway', '--d:1000ms; transform-box: view-box; transform-origin: 120px 600px')
        const feather: P[] = [...B([120, 600], [160, 560], [220, 540], [260, 560]), ...B([260, 560], [220, 580], [170, 600], [120, 600]).slice(1)]
        hatch(fe, feather, 1000, true)
        ink(fe, feather, { w: 2.4, d: 800, t: 500 })
        text(g, 60, 280, '…nichts', { size: 20, d: 1500 })
      },
      kleinhirn(g) {
        brain(g, 170, 380, 1.1)
        const kh = pop(g, 1200, '50% 50%')
        const c = E(250, 470, 48, 30)
        blank(kh, c)
        hatch(kh, c, 0, true)
        ink(kh, c, { w: 3, t: 0 })
        for (let k = 0; k < 3; k++) ink(kh, B([214, 460 + k * 8], [240, 452 + k * 8], [260, 468 + k * 8], [288, 460 + k * 8]), { w: 1.4, t: 0 })
        arrow(g, B([310, 600], [300, 560], [290, 530], [280, 506]), { w: 2.4, d: 1500, t: 300 })
        text(g, 310, 624, 'Kleinhirn', { anchor: 'middle', d: 1600 })
      },
      wellen(g) {
        const wave = (y: number, amp: number, d: number) => ink(g, Array.from({ length: 120 }, (_, i) => [40 + i * 2.4, y + Math.sin(i / 5) * amp * Math.exp(-((i - 60) ** 2) / 900)] as P), { w: 2.8, d, t: 900 })
        text(g, 40, 270, 'eigene Berührung', { d: 100 })
        wave(330, 10, 300)
        text(g, 40, 450, 'jemand anderes', { d: 900 })
        wave(530, 60, 1100)
      },
      spinne(g) {
        const arm: P[] = [...L([20, 380], [340, 350]), ...L([340, 350], [340, 440]).slice(1), ...L([340, 440], [20, 470]).slice(1)]
        ink(g, arm, { w: 3, t: 800 })
        const sp = group(g)
        spider(sp, 100, 410, 1.4)
        sp.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(150px)' }], { duration: 3000, delay: 800, fill: 'both', easing: 'ease-in-out' })
        text(g, 180, 560, 'Achtung!', { anchor: 'middle', size: 26, d: 1500 })
      },
      roboter(g) {
        ink(g, RR(30, 520, 90, 50, 8), { w: 3, t: 500 })
        ink(g, L([75, 520], [75, 470]), { w: 4, d: 300, t: 300 })
        ink(g, E(75, 462, 10), { w: 3, d: 500, t: 200 })
        fig(pop(g, 200), 60, 620, 1.4)
        dashes(g, B([120, 545], [180, 540], [200, 480], [220, 440]), { w: 2, d: 700 })
        ink(g, L([200, 600], [240, 420]), { w: 4, d: 900, t: 300 })
        ink(g, L([240, 420], [300, 360]), { w: 4, d: 1100, t: 300 })
        ink(g, RR(180, 590, 60, 30, 6), { w: 3, d: 800, t: 300 })
        const fe = st(g, 'sway', '--d:1500ms; transform-box: view-box; transform-origin: 300px 360px')
        ink(fe, B([300, 360], [320, 330], [330, 300], [326, 280]), { w: 2.4, d: 1300, t: 300 })
        const cl = st(g, 'f1', '--dl:300ms')
        clock(cl, 290, 520, 30, 0, 72, 0)
        text(cl, 290, 576, 'Verzögerung', { anchor: 'middle', fade: false, cls: 's' })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { k: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 35, 1.25] } } },
      { t: T('Es gibt zwei Arten von Kitzeln:', 64, { kind: 'big' }), gfx: { vergleich: { args: [['leicht', 'Krabbeln', 'juckt', 'auch selbst auslösbar'], ['kräftig', 'Drücken, Kneten', 'bringt zum Lachen', 'nur durch andere'], 290] } } },
      { t: T('Probier’s: Fußsohle, Seite, Achsel – bei dir selbst passiert fast **nichts**.', 64), gfx: { fuss: {} } },
      { t: T('Der Grund sitzt im **Kleinhirn**: Es sagt die Folgen deiner eigenen Bewegungen voraus.', 64), gfx: { kleinhirn: {} } },
      { t: T('Das Gehirn schickt eine **Kopie** jedes Bewegungsbefehls an die Vorhersage:', 64), gfx: { f1: { draw: 'formel', args: [['Bewegungsbefehl', '→', 'Kopie', '→', 'Vorhersage'], 330] } } },
      { t: T('Was du spürst, ist dann ungefähr:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Gefühl', '=', 'Signal', '−', 'Vorhersage'], 330] } } },
      { t: T('Diese Vorhersage dämpft das Signal. So merkst du sofort, wenn dich **jemand anders** anfasst.', 64), gfx: { wellen: {} } },
      { t: T('Derselbe Trick dämpft deine **Stimme** im eigenen Kopf – und lässt die Welt nicht wackeln, wenn du die Augen bewegst.', 64), gfx: { wellen: {} } },
      { t: T('Überlebenswichtig – etwa bei einer **Spinne** auf dem Arm.', 64), gfx: { spinne: {} } },
      { t: T('Sarah-Jayne Blakemore ließ Leute sich über einen **Roboter** selbst kitzeln.', 64), gfx: { roboter: {} } },
      { t: T('Getestet wurden Verzögerungen von **0,1 bis 0,3 Sekunden** – je länger, desto kitzliger.', 64), gfx: { roboter: { cls: 'a1' } } },
      { t: T('Mit kleiner **Verzögerung** kitzelte es wieder mehr – das Gehirn konnte es nicht mehr vorhersagen.', 64), gfx: { roboter: { cls: 'a1' } } },
      { t: T('Bei manchen Menschen mit **Schizophrenie** funktioniert die Vorhersage schwächer – sie können sich teils selbst kitzeln.', 64), gfx: { kleinhirn: {} } },
      { t: T('Warum lachen wir? Vermutlich ein **Spiel**-Signal: Sogar Ratten geben beim Kitzeln Laute im Ultraschall von sich.', 64), gfx: { z3: { draw: 'zahl', args: ['50 kHz', 'Ratten-„Lachen“ im Ultraschall', 420] } } },
      { t: T('Am empfindlichsten sind Stellen mit dünner Haut und vielen **Nerven**:', 64, { kind: 'big' }), gfx: { p2: { draw: 'punkte', args: [['Fußsohlen', 'Achseln', 'Rippen', 'Hals'], 300] } } },
      { t: T('Schon Aristoteles fragte: Warum kann man sich nicht **selbst** kitzeln?', 64), gfx: { fuss: {} } },
      { t: T('Babys lachen beim Kitzeln meist erst ab etwa **vier Monaten**.', 64), gfx: { z4: { draw: 'zahl', args: ['4 Monate', 'ab dann lachen Babys beim Kitzeln', 420] } } },
      { t: T('Auch Menschenaffen sind kitzlig: Schimpansen und Gorillas „**lachen**“ dabei mit keuchenden Lauten.', 64), gfx: { wellen: {} } },
      { t: T('Kitzeln in einer Zeile:', 64, { kind: 'big' }), gfx: { f3: { draw: 'formel', args: [['Berührung', '+', 'Überraschung', '=', 'Kitzeln'], 330] } } },
      recap(
        [{ gfx: 'fuss' }, { gfx: 'kleinhirn' }, { gfx: 'wellen' }, { gfx: 'roboter', cls: 'a1' }],
        ['bei dir selbst: fast nichts', 'Kleinhirn sagt voraus', 'Vorhergesagtes wird gedämpft', 'mit Verzögerung kitzelt es'],
      ),
    ],
    summary: ['Das Kleinhirn sagt eigene Berührungen voraus.', 'Vorhergesagtes wird gedämpft, Fremdes nicht.', 'Mit Verzögerung kitzelt es wieder.'],
    sources: ['Blakemore, Wolpert & Frith 1998, Nature Neuroscience', 'Blakemore, Frith & Wolpert 1999, J Cogn Neurosci'],
  },
  {
    id: 'everest',
    area: 'GEO',
    day: 9,
    hook: 'Ist der Mount Everest der höchste Berg?',
    mood: 'episch',
    ambience: 'wind',
    images: [img('everest')],
    draw: {
      berge(g) {
        mountain(g, 20, 170, 440, [95, 230], 0)
        text(g, 95, 216, 'Everest', { anchor: 'middle', d: 600 })
        text(g, 95, 470, '8.849 m', { anchor: 'middle', d: 800, size: 18 })
        ink(g, L([0, 440], [360, 440]), { w: 2.6, d: 200, t: 600 })
        text(g, 352, 432, 'Meer', { anchor: 'end', cls: 's', d: 400 })
        mountain(g, 200, 340, 440, [270, 340], 400, true)
        text(g, 270, 326, 'Mauna Kea', { anchor: 'middle', d: 900 })
        const under = st(g, 'f1', '--dl:300ms')
        hatch(under, [[0, 444], [360, 444], [360, 680], [0, 680]], 0)
        blank(under, [[170, 444], [370, 444], [370, 676], [130, 676]])
        hatch(under, [[170, 444], [370, 444], [370, 676], [130, 676]], 0, true)
        ink(under, [[130, 676], [170, 444]], { w: 3, t: 0 })
        ink(under, [[370, 444], [372, 676]], { w: 3, t: 0 })
        text(under, 270, 560, 'über 10.000 m', { anchor: 'middle', fade: false, size: 20, cls: 'halo' })
      },
      erde(g) {
        hatch(g, E(180, 420, 160, 140), 600)
        ink(g, E(180, 420, 160, 140), { w: 3.4, t: 900 })
        ink(g, L([10, 420], [350, 420]), { w: 1.6, d: 400, t: 600 })
        text(g, 20, 412, 'Äquator', { cls: 's', d: 600 })
        mk('circle', { cx: 180, cy: 420, r: 5, class: 'k fade', style: '--d:700ms' }, g)
        const ev: P = [180 + Math.cos(-1.1) * 160, 420 + Math.sin(-1.1) * 140]
        ink(g, L([180, 420], [340, 420]), { w: 3, d: 1000, t: 400 })
        ink(g, L([180, 420], ev), { w: 3, d: 1200, t: 400 })
        mountain(g, 330, 356, 420, [346, 396], 1300, true)
        text(g, 300, 380, 'Chimborazo', { anchor: 'middle', d: 1400 })
        text(g, ev[0] + 10, ev[1] - 20, 'Everest', { anchor: 'middle', d: 1500 })
        text(st(g, 'f1', '--dl:300ms'), 260, 456, '+ 2 km weiter draußen', { anchor: 'middle', fade: false, size: 16, cls: 'halo' })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { e: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 35, 1.05], cam2: [50, 30, 1.3] } } },
      { t: T('Er liegt im **Himalaya**, auf der Grenze zwischen Nepal und China. Einheimische nennen ihn Chomolungma oder Sagarmatha.', 64), gfx: { punkte: { args: [['Chomolungma (Tibetisch)', 'Sagarmatha (Nepali)', 'Mount Everest (Englisch)'], 320] } } },
      { t: T('Den englischen Namen bekam er 1865 – nach **George Everest**, einem britischen Landvermesser.', 64), gfx: { zahl: { args: ['1865', 'Benennung nach George Everest', 420] } } },
      { t: T('Über dem **Meeresspiegel**: ja, mit 8.849 Metern. Aber es kommt darauf an, wie man misst.', 64), gfx: { berge: {} } },
      { t: T('2020 einigten sich Nepal und China auf eine gemeinsame Messung: **8.848,86** Meter.', 64), gfx: { z2: { draw: 'zahl', args: ['8.848,86', 'Meter, Messung 2020', 420] } } },
      { t: T('Und er wächst noch: Indien schiebt sich unter Asien, der Himalaya hebt sich um einige **Millimeter** pro Jahr.', 64), gfx: { berge: {} } },
      { t: T('Erstmals oben standen **1953** Edmund Hillary und Tenzing Norgay.', 450), pics: { e: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 25, 1.6] } } },
      { t: T('Vom **Fuß bis zur Spitze** gewinnt der Mauna Kea auf Hawaii – nur gut 4.200 Meter davon ragen aus dem Wasser.', 64), gfx: { berge: { cls: 'a1' } } },
      { t: T('Der Mauna Kea ist ein **Vulkan**. Sein Fuß liegt rund 6.000 Meter tief am Meeresboden:', 64), gfx: { f2: { draw: 'formel', args: [['4.207 m über dem Meer', '+', 'rund 6.000 m darunter', '≈', '10.200 m'], 320] } } },
      { t: T('Und am weitesten vom **Erdmittelpunkt** entfernt ist der Chimborazo in Ecuador.', 64), gfx: { erde: {} } },
      { t: T('Die Erde ist keine perfekte Kugel: Durch die Drehung ist sie am Äquator **dicker**.', 64), gfx: { f3: { draw: 'formel', args: [['6.378 km zum Äquator', '−', '6.357 km zu den Polen', '=', '21 km'], 320] } } },
      { t: T('Der Chimborazo liegt fast auf dem **Äquator**, der Everest weit nördlich davon.', 64), gfx: { erde: {} } },
      { t: T('Die Erde ist am Äquator **dicker**. Deshalb liegt sein Gipfel gut zwei Kilometer weiter draußen.', 64), gfx: { erde: { cls: 'a1' } } },
      { t: T('Gipfel Chimborazo: **6.384 Kilometer** vom Erdmittelpunkt. Everest: gut 6.382.', 64), gfx: { z4: { draw: 'zahl', args: ['6.384 km', 'Chimborazo bis zum Erdmittelpunkt', 420] } } },
      { t: T('Und am tiefsten? Der **Marianengraben**: fast 11 Kilometer unter dem Meer – tiefer als der Everest hoch ist.', 64), gfx: { z5: { draw: 'zahl', args: ['10.935 m', 'Tiefe des Marianengrabens', 420] } } },
      { t: T('Oben ist die Luft dünn: Nur etwa ein **Drittel** des Sauerstoffs auf Meereshöhe.', 64), gfx: { z6: { draw: 'zahl', args: ['⅓', 'des Sauerstoffs auf dem Gipfel', 420] } } },
      { t: T('Der Gipfel war einst **Meeresboden**: Im Gestein oben stecken versteinerte Meerestiere.', 450), pics: { e: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 30, 2.0] } } },
      recap(
        [{ gfx: 'berge', cls: 'a1' }, { gfx: 'erde', cls: 'a1' }, { pic: 0, id: 'e' }, { gfx: 'f2', draw: 'formel', args: [['4.207 m', '+', '≈ 6.000 m', '≈', '10.200 m'], 330] }],
        ['über dem Meer: Everest', 'vom Mittelpunkt: Chimborazo', '8.849 m', 'vom Fuß an: Mauna Kea'],
      ),
    ],
    summary: ['Höchster über dem Meer: Everest, 8.849 m.', 'Größter vom Fuß an: Mauna Kea, über 10.000 m.', 'Am weitesten draußen: Chimborazo.'],
    sources: ['National Geographic 2020: Neuvermessung des Everest', 'USGS: Mauna Kea'],
  },
  {
    id: 'mauer-all',
    area: 'GEO',
    day: 73,
    hook: 'Sieht man die Chinesische Mauer aus dem All?',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [img('chinesische-mauer'), img('erde-nachts')],
    draw: {
      orbit(g) {
        const arc = E(180, 1000, 560, 560, 235, 305)
        hatch(g, [...arc, [520, 680], [-160, 680]], 500)
        ink(g, arc, { w: 3, t: 800 })
        satellite(g, 180, 260, 1.4, 500)
        eye(g, 180, 330, 0.5, 900)
        dashes(g, L([180, 350], [180, 430]), { w: 1.8, d: 1200 })
        text(g, 220, 400, '≈ 400 km', { d: 1300 })
      },
      zeit(g) {
        timeline(g, 40, 330, 420, [
          { at: 0.05, label: '1930er', sub: 'Behauptung', up: true },
          { at: 0.42, label: '1961', sub: 'erster Mensch im All' },
          { at: 0.9, label: '2003', sub: 'Yang Liwei', up: true, big: true },
        ])
      },
      breite(g) {
        ink(g, L([30, 420], [330, 420]), { w: 1.2, d: 200, t: 900 })
        text(g, 180, 400, 'Mauer: 5–8 m breit', { anchor: 'middle', d: 600 })
        text(g, 180, 470, 'aus 400 km Höhe: wie ein Haar', { anchor: 'middle', d: 1000 })
        text(g, 180, 494, 'aus knapp 5 Metern Entfernung', { anchor: 'middle', d: 1100 })
      },
      zitat(g) {
        bubble(g, 40, 260, 280, 120, 'l', 0)
        text(g, 180, 316, 'Ich habe sie', { anchor: 'middle', size: 24, d: 400, cls: 'it' })
        text(g, 180, 350, 'nicht gesehen.', { anchor: 'middle', size: 24, d: 600, cls: 'it' })
        const h = pop(g, 300)
        ink(h, E(80, 470, 44), { w: 3, t: 0 })
        hatch(h, E(80, 470, 30, 22), 0, true)
        ink(h, RR(40, 512, 80, 70, 14), { w: 3, t: 0 })
      },
      mond(g) {
        hatch(g, E(110, 440, 70), 400, true)
        ink(g, E(110, 440, 70), { w: 3, t: 700 })
        ink(g, E(290, 300, 26), { w: 2.6, d: 500, t: 400 })
        for (const [x, y] of [[282, 292], [296, 306]] as const) ink(g, E(x, y, 5), { w: 1.6, d: 800, t: 150 })
        dashes(g, L([268, 314], [160, 400]), { w: 1.8, d: 900 })
        text(g, 110, 550, 'Erde', { anchor: 'middle', d: 600 })
        text(g, 290, 350, 'Mond', { anchor: 'middle', d: 700 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [60, 45, 1.05], cam2: [60, 45, 1.3] } } },
      { t: T('Die Mauer ist kein einzelnes Bauwerk, sondern viele Mauern aus über **2.000 Jahren**.', 64), gfx: { zahl: { args: ['2.000', 'Jahre Bauzeit, mit Unterbrechungen', 420] } } },
      { t: T('Zusammen über **21.000 Kilometer** – das ergab eine chinesische Vermessung 2012. Der bekannteste Teil stammt aus der Ming-Zeit.', 64), gfx: { z1: { draw: 'zahl', args: ['21.196 km', 'Gesamtlänge laut Vermessung 2012', 420] } } },
      { t: T('Ein Klassiker im Quiz: das einzige Bauwerk, das man aus dem **Weltall** sieht.', 64), gfx: { orbit: {} } },
      { t: T('Die Raumstation **ISS** fliegt in rund 400 Kilometern Höhe – etwa so weit wie von Hamburg nach Frankfurt.', 64), gfx: { orbit: {} } },
      { t: T('Die Behauptung ist älter als die Raumfahrt – sie taucht schon in den **1930ern** auf.', 64), gfx: { zeit: {} } },
      {
        t: T('Das Problem ist nicht die Länge, sondern die **Breite**: meist nur 5 bis 8 Meter, in ähnlicher Farbe wie die Landschaft.', 64),
        pics: { m: { img: 0, x: 16, y: 230, w: 328, h: 160, cam: [60, 45, 1.5] } },
        gfx: { breite: { tf: [1, 0, 120] } },
      },
      { t: T('Zum Vergleich:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['6 m aus 400 km', '≈', 'ein Haar aus knapp 5 m'], 330] } } },
      { t: T('Sichtbar macht vor allem **Kontrast**: Straßen und Flughäfen sind oft heller als ihre Umgebung.', 64), gfx: { breite: { tf: [1, 0, 60] } } },
      { t: T('Chinas erster Raumfahrer **Yang Liwei** sagte 2003:', 64), gfx: { zitat: {} } },
      { t: T('Einige Astronauten erwischten die Mauer bei perfektem Licht mit **Kamera** und Zoom – mit bloßem Auge kaum.', 64), gfx: { orbit: {} } },
      {
        t: T('Aus der Umlaufbahn sieht man eher **Städte bei Nacht** – hier Chicago von der ISS aus.', 476),
        pics: { n: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.25] } },
      },
      { t: T('Gut zu sehen sind auch die **Gewächshäuser** bei Almería in Spanien: über 300 Quadratkilometer weiße Dächer.', 64), gfx: { z3: { draw: 'zahl', args: ['300 km²', 'Gewächshäuser bei Almería', 420] } } },
      { t: T('Vom Mond aus erkennt man gar kein Bauwerk – nur Kontinente und **Wolken**.', 64), gfx: { mond: {} } },
      { t: T('Der Mond ist im Schnitt **384.000 Kilometer** entfernt:', 64), gfx: { f2: { draw: 'formel', args: [['384.000 km', '÷', '400 km', '≈', '960-mal so weit wie die ISS'], 320] } } },
      { t: T('Gebaut wurde aus Stampflehm, Stein und Ziegeln – als Mörtel diente teils **Klebreis**.', 64), gfx: { p2: { draw: 'punkte', args: [['Stampflehm', 'Stein und Ziegel', 'Mörtel mit Klebreis'], 320] } } },
      { t: T('Rund ein **Drittel** der Ming-Mauer ist heute verschwunden – abgetragen oder verwittert.', 450), pics: { m: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [60, 45, 1.4] } } },
      recap(
        [{ gfx: 'orbit' }, { gfx: 'breite' }, { pic: 1, id: 'n' }, { gfx: 'mond' }],
        ['ISS: 400 km hoch', 'zu schmal: 5–8 m', 'sichtbar: Städte bei Nacht', 'vom Mond: kein Bauwerk'],
      ),
    ],
    summary: ['Die Mauer ist zu schmal, nicht zu kurz.', 'Yang Liwei 2003: nicht gesehen.', 'Vom Mond aus: kein einziges Bauwerk.'],
    sources: ['NASA Earth Observatory: Great Wall from Space', 'Xinhua 2003: Yang Liwei'],
  },
  {
    id: 'pompeji',
    area: 'GEO',
    day: 29,
    hook: 'Erstickten die Menschen in Pompeji unter Asche?',
    mood: 'dunkel',
    ambience: 'feuer',
    images: [img('bryullov-pompeji'), img('pompeji-vesuv')],
    draw: {
      bims(g) {
        volcano(g, 10, 230, 600, 300, 0)
        plume(g, 120, 290, 600)
        for (let k = 0; k < 4; k++) hut(g, 240 + k * 30, 600, 24, 300 + k * 100)
        ink(g, L([10, 600], [350, 600]), { w: 3, t: 500 })
        for (let k = 0; k < 10; k++) {
          const s = group(g)
          mk('circle', { cx: 150 + ((k * 37) % 200), cy: 200, r: 3, class: 'k' }, s)
          loop(s, [{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: 0.1 }, { transform: 'translateY(390px)', opacity: 1 }], 1800, 800 + k * 170, 'ease-in')
        }
      },
      strom(g) {
        volcano(g, 10, 230, 600, 300, 0)
        for (let k = 0; k < 4; k++) hut(g, 240 + k * 30, 600, 24, 0)
        ink(g, L([10, 600], [350, 600]), { w: 3, t: 400 })
        const flow = st(g, 'm1', '--m1: translate(190px, 250px); --dl: 400ms; transition-duration: 2.4s')
        const c: P[] = [...B([100, 300], [60, 300], [50, 340], [80, 360]), ...B([80, 360], [70, 400], [130, 420], [160, 380]).slice(1), ...B([160, 380], [190, 360], [180, 300], [140, 300]).slice(1), [100, 300]]
        hatch(flow, c, 200, true)
        ink(flow, c, { w: 3, d: 100, t: 600 })
      },
      tempo(g) {
        hbars(g, [
          { label: 'Glutwolke', v: 100, fmt: (v) => `über ${Math.round(v)} km/h`, dense: true },
          { label: 'Pferd im Galopp', v: 60, fmt: (v) => `${Math.round(v)} km/h` },
        ], { y: 320, gap: 120, max: 120 })
      },
      abguss(g) {
        hatch(g, RR(30, 320, 300, 220, 10), 200)
        ink(g, RR(30, 320, 300, 220, 10), { w: 3, t: 700 })
        const body: P[] = [...B([80, 470], [100, 430], [160, 420], [200, 440]), ...B([200, 440], [250, 430], [290, 450], [280, 480]).slice(1), ...B([280, 480], [200, 500], [120, 500], [80, 470]).slice(1)]
        blank(g, body)
        ink(g, body, { w: 2.6, d: 600, t: 600 })
        const fill = st(g, 'f1', '--dl:500ms')
        hatch(fill, body, 0, true)
        text(g, 180, 300, 'Hohlraum in der Asche', { anchor: 'middle', d: 800 })
        text(st(g, 'f1', '--dl:900ms'), 180, 580, 'mit Gips gefüllt', { anchor: 'middle', fade: false })
      },
      dna(g) {
        for (const s of [0, Math.PI]) ink(g, Array.from({ length: 100 }, (_, i) => [180 + Math.sin(i / 8 + s) * 60, 240 + i * 3.6] as P), { w: 3, d: s ? 300 : 0, t: 1200 })
        for (let i = 4; i < 100; i += 8) {
          const a = Math.sin(i / 8) * 60
          ink(g, L([180 + a, 240 + i * 3.6], [180 - a, 240 + i * 3.6]), { w: 1.8, d: 600 + i * 10, t: 150 })
        }
      },
    },
    scenes: [
      { t: HOOK(456), pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 360, enter: 'blot', cam: [50, 50, 1.05], cam2: [45, 45, 1.25], cap: 'Karl Brjullow, Der letzte Tag von Pompeji, 1833' } } },
      {
        t: T('79 n. Chr. brach der **Vesuv** aus.', 486, { kind: 'big' }),
        pics: { v: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [60, 40, 1.05], cam2: [70, 30, 1.4] } },
      },
      { t: T('Pompeji war eine römische Stadt mit etwa **11.000** Einwohnern – mit Läden, Bädern und Theatern.', 64), gfx: { zahl: { args: ['11.000', 'Einwohner', 420] } } },
      { t: T('Das genaue Datum ist umstritten: Eine Inschrift, entdeckt 2018, deutet auf **Oktober** statt August.', 64), gfx: { z1: { draw: 'zahl', args: ['Oktober?', '79 n. Chr.', 420] } } },
      { t: T('Stundenlang regneten **Bimssteine** auf Pompeji, Dächer stürzten ein. Viele Bewohner flohen in dieser Zeit.', 64), gfx: { bims: {} } },
      { t: T('Die Aschewolke stieg rund 30 Kilometer hoch. Sein Neffe Plinius der Jüngere verglich sie mit einer **Pinie**.', 64), gfx: { z2: { draw: 'zahl', args: ['30 km', 'hohe Aschewolke', 420] } } },
      { t: T('Die meisten Zurückgebliebenen starben am nächsten Morgen – durch **pyroklastische Ströme**.', 64), gfx: { strom: { cls: 'a1' } } },
      { t: T('Plinius der Ältere fuhr mit Schiffen los, um Menschen zu **retten** – und starb am Strand.', 64), gfx: { strom: { cls: 'a1' } } },
      { t: T('Lawinen aus glühendem Gas und Asche, mehrere hundert Grad heiß – **schneller** als jedes Pferd.', 64), gfx: { tempo: {} } },
      { t: T('Temperaturen von 250 bis über **500 Grad**: Der Tod kam in Sekunden.', 64), gfx: { z3: { draw: 'zahl', args: ['500 °C', 'in den Glutwolken', 420] } } },
      { t: T('Im Nachbarort Herculaneum fand man Hunderte Skelette in **Bootshäusern** am Strand – Menschen, die auf Rettung warteten.', 64), gfx: { strom: { cls: 'a1' } } },
      { t: T('Die berühmten **Gipsabgüsse** entstehen seit 1863: Man füllt die Hohlräume, die die Körper in der Asche hinterließen.', 64), gfx: { abguss: { cls: 'a1' } } },
      { t: T('Erfunden hat die Methode der Archäologe Giuseppe **Fiorelli**. Heute gibt es über 100 solcher Abgüsse.', 64), gfx: { abguss: { cls: 'a1' } } },
      { t: T('DNA-Analysen 2024 zeigten: Manche Geschichten zu den Figuren stimmen **nicht**.', 64), gfx: { dna: {} } },
      { t: T('Etwa ein Erwachsener mit Kind, lange als Mutter gedeutet: Die DNA zeigte einen **Mann**, nicht mit dem Kind verwandt.', 64), gfx: { dna: {} } },
      { t: T('Pompeji ist heute **UNESCO-Welterbe** und eine der meistbesuchten Stätten Italiens.', 470), pics: { v: { img: 1, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [50, 50, 1.05] } } },
      { t: T('Unter der Asche blieb die Stadt fast **1.700 Jahre** verborgen – ausgegraben wird seit 1748.', 64), gfx: { z5: { draw: 'zahl', args: ['1748', 'Beginn der Ausgrabungen', 420] } } },
      { t: T('Man fand Brote im Ofen, **Graffiti** an Wänden, Wahlwerbung – ein Schnappschuss des römischen Alltags.', 64), gfx: { p2: { draw: 'punkte', args: [['Brote im Ofen', 'Graffiti und Wahlwerbung', 'Wandmalereien'], 320] } } },
      { t: T('Der Ablauf in Kürze:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Bimsregen', '→', 'Dächer brechen', '→', 'Glutwolke', '→', 'Tod in Sekunden'], 320] } } },
      { t: T('Der Vesuv ist bis heute **aktiv** – zuletzt brach er 1944 aus. Über eine halbe Million Menschen leben in seiner Gefahrenzone.', 64), gfx: { bims: {} } },
      recap(
        [{ pic: 0, id: 'b', cam: [50, 50, 1.1] }, { gfx: 'bims' }, { gfx: 'strom', cls: 'a1' }, { gfx: 'abguss', cls: 'a1' }],
        ['79 n. Chr.: Vesuv', 'erst Bimsregen', 'dann Glutwolken', 'Gipsabgüsse seit 1863'],
      ),
    ],
    summary: ['Erst Bimsregen, dann tödliche Glutwolken.', 'Mehrere hundert Grad, schneller als ein Pferd.', 'Gipsabgüsse seit 1863, DNA-Analysen 2024.'],
    sources: ['Pilli et al. 2024, Current Biology', 'Parco Archeologico di Pompei'],
  },
  {
    id: 'kleine-eiszeit',
    area: 'GEO',
    day: 71,
    hook: 'Warum gibt es so viele alte Bilder von zugefrorenen Flüssen?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [img('bruegel-jaeger'), img('hondius-themse')],
    draw: {
      gletscher(g) {
        mountain(g, 20, 340, 600, [180, 260], 0)
        const tongue = st(g, 'm1', '--m1: translateY(-110px); --dl: 600ms; transition-duration: 2.6s')
        const ice: P[] = [[150, 330], [210, 330], [230, 600], [130, 600], [150, 330]]
        blank(tongue, ice)
        ink(tongue, ice, { w: 2.6, d: 400, t: 600 })
        for (let k = 0; k < 4; k++) ink(tongue, L([150 + k * 20, 400 + k * 30], [175 + k * 20, 420 + k * 30]), { w: 1.6, d: 800, t: 200 })
        text(g, 180, 640, 'Gletscher: Höchststand um 1850, seitdem Rückzug', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zeit(g) {
        const at = (y: number) => (y - 1000) / 1030
        timeline(g, 30, 330, 420, [
          { at: at(1300), label: '1300', up: true },
          { at: at(1850), label: '1850', up: true },
          { at: at(2025), label: 'heute' },
        ])
        hatch(g, RR(30 + 284 * at(1300), 410, 284 * (at(1850) - at(1300)), 20, 8), 1200, true)
        text(g, 30 + 284 * ((at(1300) + at(1850)) / 2), 470, 'Kleine Eiszeit', { anchor: 'middle', d: 1500, size: 18 })
      },
      ursachen(g) {
        volcano(g, 20, 190, 560, 420, 0)
        plume(g, 105, 410, 500)
        ink(g, E(270, 330, 34), { w: 3, d: 600, t: 500 })
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2
          ink(g, L([270 + Math.cos(a) * 44, 330 + Math.sin(a) * 44], [270 + Math.cos(a) * 54, 330 + Math.sin(a) * 54]), { w: 1.6, d: 900 + k * 60, t: 100 })
        }
        text(g, 105, 600, 'Vulkane', { anchor: 'middle', d: 800 })
        text(g, 270, 420, 'schwächere Sonne', { anchor: 'middle', d: 1100 })
      },
      kurve(g) {
        ink(g, L([30, 600], [330, 600]), { w: 3, t: 500 })
        ink(g, L([30, 600], [30, 240]), { w: 3, t: 500 })
        dashes(g, L([30, 460], [330, 460]), { w: 1.4, d: 300 })
        const x = (y: number) => 30 + ((y - 1000) / 1030) * 300
        const pts: P[] = [[x(1000), 456], [x(1250), 462], [x(1450), 478], [x(1650), 490], [x(1800), 484], [x(1900), 470], [x(1960), 456]]
        const path: P[] = []
        for (let i = 0; i < pts.length - 1; i++) path.push(...L(pts[i], pts[i + 1]).slice(i ? 1 : 0))
        ink(g, path, { w: 3.4, d: 600, t: 1400 })
        const up = st(g, 'f1', '--dl:200ms')
        ink(up, B([x(1960), 456], [x(1990), 448], [x(2010), 410], [x(2025), 372]), { w: 4, t: 0 })
        text(up, x(2025) - 4, 360, '+1,3 °C', { anchor: 'end', fade: false, size: 18 })
        text(g, x(1550), 516, '≈ −0,5 °C', { anchor: 'middle', d: 1800 })
        text(g, 34, 626, '1000', { cls: 's', d: 300 })
        text(g, 330, 626, 'heute', { cls: 's', anchor: 'end', d: 300 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 260, enter: 'blot', cam: [50, 50, 1.0], cam2: [55, 55, 1.15], cap: 'Pieter Bruegel d. Ä., Die Jäger im Schnee, 1565' } } },
      { t: T('Zwischen etwa 1300 und 1850 lag Europa in der **Kleinen Eiszeit**.', 64), gfx: { zeit: {} } },
      { t: T('Keine Eiszeit mit Mammuts – sondern einige Jahrhunderte, die etwas **kühler** waren.', 64), gfx: { zeit: {} } },
      {
        t: T('Die Winter waren oft deutlich härter – Kanäle und Flüsse froren regelmäßig zu, voller **Schlittschuhläufer**.', 450),
        pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [72, 72, 2.0], cam2: [76, 70, 2.3] } },
      },
      {
        t: T('In London fror die Themse immer wieder zu – auf dem Eis fanden **Frostjahrmärkte** statt.', 380),
        pics: { h: { img: 1, x: 16, y: 56, w: 328, h: 270, enter: 'blot', cam: [50, 60, 1.05], cam2: [40, 65, 1.4], cap: 'Abraham Hondius, Die zugefrorene Themse, 1677' } },
      },
      { t: T('Der Frost brachte auch Not: **Missernten**, Hunger, steigende Brotpreise.', 64), gfx: { p2: { draw: 'punkte', args: [['Missernten', 'Hunger', 'steigende Brotpreise'], 330] } } },
      { t: T('1816 hieß das „**Jahr ohne Sommer**“ – nach dem Ausbruch des Tambora in Indonesien 1815.', 64), gfx: { z2: { draw: 'zahl', args: ['1816', 'Jahr ohne Sommer', 420] } } },
      { t: T('Als Ursachen gelten vor allem **Vulkanausbrüche** und Phasen schwächerer Sonne.', 64), gfx: { ursachen: {} } },
      { t: T('Vulkanasche und Schwefel in der Luft schirmen **Sonnenlicht** ab – oft mehrere Jahre lang.', 64), gfx: { ursachen: {} } },
      { t: T('Dazu das **Maunder-Minimum**: Zwischen etwa 1645 und 1715 zeigte die Sonne kaum Flecken.', 64), gfx: { z3: { draw: 'zahl', args: ['1645–1715', 'Maunder-Minimum', 420] } } },
      { t: T('Wichtig für heute: Sie war **regional** verschieden und weltweit nur etwa ein halbes Grad kühler.', 64), gfx: { kurve: {} } },
      { t: T('Die heutige Erwärmung ist größer, schneller und **überall** gleichzeitig.', 64), gfx: { kurve: { cls: 'a1' } } },
      { t: T('Die alten Gemälde sind auch **Klima-Quellen** – ebenso wie Baumringe, Eisbohrkerne und Ernte-Tagebücher.', 64), gfx: { punkte: { args: [['Gemälde', 'Baumringe', 'Eisbohrkerne', 'Chroniken und Ernte-Tagebücher'], 300] } } },
      { t: T('Die kälteste Phase lag nicht überall gleichzeitig – mal im 15., mal im **17. Jahrhundert**, je nach Region.', 64), gfx: { zeit: {} } },
      { t: T('Die Alpengletscher wuchsen weit ins Tal. Um 1850 erreichten sie ihren Höchststand – seitdem **schmelzen** sie.', 64), gfx: { gletscher: { cls: 'a1' } } },
      { t: T('Sogar die Ostsee fror zu: 1658 marschierte ein schwedisches Heer über das **Eis** nach Dänemark.', 64), gfx: { z4: { draw: 'zahl', args: ['1658', 'Heer marschiert übers Eis', 420] } } },
      { t: T('Der letzte Frostjahrmarkt auf der Themse fand **1814** statt.', 450), pics: { h: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 60, 1.6] } } },
      { t: T('Danach wurde die alte London Bridge abgerissen – der Fluss floss **schneller** und fror kaum noch zu.', 64), gfx: { z5: { draw: 'zahl', args: ['1831', 'alte London Bridge abgerissen', 420] } } },
      { t: T('Zum Vergleich mit heute:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Kleine Eiszeit: rund −0,5 °C'], 300] }, f3: { draw: 'formel', args: [['seit 1850: rund +1,3 °C'], 420] } } },
      recap(
        [{ gfx: 'zeit' }, { pic: 0, id: 'b', cam: [72, 72, 1.6] }, { gfx: 'ursachen' }, { gfx: 'kurve', cls: 'a1' }],
        ['etwa 1300–1850', 'Schlittschuhe auf Grachten', 'Vulkane, schwache Sonne', 'heute: global, schneller'],
      ),
    ],
    summary: ['Kleine Eiszeit: etwa 1300–1850.', 'Frostjahrmärkte auf der Themse.', 'Heutige Erwärmung: global und schneller.'],
    sources: ['PAGES 2k Consortium 2019, Nature'],
  },
  {
    id: 'erster-bug',
    area: 'TECH',
    day: 62,
    hook: 'War der erste Computer-Bug eine echte Motte?',
    mood: 'verspielt',
    ambience: 'nacht',
    images: [img('logbuch-bug'), img('grace-hopper')],
    draw: {
      relais(g) {
        ink(g, RR(40, 260, 280, 300, 14), { w: 3, t: 700 })
        ink(g, RR(80, 420, 60, 100, 6), { w: 2.8, d: 300, t: 400 })
        for (let k = 0; k < 6; k++) ink(g, L([80, 430 + k * 15], [140, 436 + k * 15]), { w: 1.6, d: 500 + k * 60, t: 120 })
        ink(g, L([110, 420], [110, 360]), { w: 3, d: 700, t: 200 })
        const arm = st(g, 'sway', '--d:1600ms; transform-box: view-box; transform-origin: 110px 360px')
        ink(arm, L([110, 360], [260, 340]), { w: 3.4, d: 900, t: 300 })
        ink(g, RR(250, 360, 30, 12, 3), { w: 2.6, d: 1000, t: 200 })
        const moth = pop(g, 1500, '50% 50%')
        for (const s of [-1, 1]) {
          const w: P[] = [[262, 350], [262 + s * 26, 330], [262 + s * 22, 360], [262, 356]]
          hatch(moth, w, 0, true)
          ink(moth, w, { w: 2, t: 0 })
        }
        ink(moth, L([262, 340], [262, 362]), { w: 3, t: 0 })
        text(g, 180, 600, 'Relais', { anchor: 'middle', d: 600 })
      },
      wort(g) {
        bigText(g, 180, 430, 'Bug', { size: 120, d: 200 })
        const b = group(g)
        hatch(b, E(270, 300, 14, 20), 900, true)
        ink(b, E(270, 300, 14, 20), { w: 2.4, d: 800, t: 300 })
        ink(b, E(270, 274, 8), { w: 2.2, d: 900, t: 200 })
        for (const s of [-1, 1]) for (let k = 0; k < 3; k++) ink(b, L([270 + s * 12, 290 + k * 10], [270 + s * 26, 284 + k * 12]), { w: 1.6, d: 1000, t: 100 })
        b.animate([{ transform: 'translate(0, 0)' }, { transform: 'translate(-30px, 20px)' }, { transform: 'translate(10px, 40px)' }], { duration: 2400, delay: 1200, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        text(g, 180, 520, 'Englisch: Käfer, Ungeziefer', { anchor: 'middle', d: 1200 })
      },
      museum(g) {
        ink(g, [[30, 330], [180, 250], [330, 330], [30, 330]], { w: 3, t: 600 })
        hatch(g, [[40, 326], [180, 256], [320, 326]], 600, true)
        for (let k = 0; k < 6; k++) {
          ink(g, L([60 + k * 48, 340], [60 + k * 48, 520]), { w: 3.4, d: 300 + k * 100, t: 300 })
          ink(g, L([50 + k * 48, 340], [70 + k * 48, 340]), { w: 2.6, d: 300 + k * 100, t: 100 })
        }
        ink(g, RR(20, 520, 320, 20, 3), { w: 3, d: 900, t: 400 })
        ink(g, L([10, 560], [350, 560]), { w: 3, d: 1000, t: 400 })
        text(g, 180, 610, 'Washington', { anchor: 'middle', d: 1200 })
      },
      zeit(g) {
        timeline(g, 30, 330, 420, [
          { at: 0.1, label: '1878', sub: 'Edison: „Bugs“', up: true },
          { at: 0.85, label: '1947', sub: 'die Motte', up: true, big: true },
        ], 0, 700)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { l: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 55, 1.4], cam2: [50, 55, 1.6] } } },
      { t: T('9. September 1947, Harvard: Im Rechner **Mark II** klemmt ein Relais.', 64), gfx: { relais: {} } },
      { t: T('Der Mark II war ein **elektromechanischer** Rechner: Tausende Relais klackten, er füllte einen ganzen Raum.', 64), gfx: { relais: {} } },
      {
        t: T('Die Techniker finden eine Motte, kleben sie ins Logbuch und schreiben: _„First actual case of bug being found.“_', 430),
        pics: { l: { img: 0, x: 16, y: 56, w: 328, h: 350, cam: [50, 55, 2.0], cam2: [50, 55, 2.3] } },
      },
      {
        t: T('Die Pointe steckt im Wort „actual“: **Bug** für einen technischen Fehler gab es längst.', 64),
        gfx: { wort: {} },
      },
      { t: T('„Bug“ heißt auf Englisch Käfer oder Wanze. **Ingenieure** nannten Fehler schon im 19. Jahrhundert so.', 64), gfx: { wort: {} } },
      { t: T('Thomas Edison schrieb schon **1878** von „Bugs“ in seinen Erfindungen. Die Motte war ein Witz unter Eingeweihten.', 64), gfx: { zeit: {} } },
      {
        t: T('Berühmt machte die Geschichte die Informatikerin **Grace Hopper**, die im Team arbeitete.', 476),
        pics: { h: { img: 1, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [55, 30, 1.1], cam2: [55, 25, 1.3] } },
      },
      { t: T('Hopper entwickelte später einen der ersten **Compiler** – ein Programm, das Programme übersetzt.', 64), gfx: { f1: { draw: 'formel', args: [['Programm in Worten', '→', 'Compiler', '→', 'Maschinensprache'], 320] } } },
      { t: T('Sie prägte die Sprache **COBOL** mit – damit laufen bis heute viele Banksysteme.', 64), gfx: { zahl: { args: ['1959', 'COBOL', 420] } } },
      {
        t: T('Das Logbuch mit der Motte liegt heute im **Smithsonian**-Museum in Washington.', 64),
        gfx: { museum: {} },
      },
      { t: T('Heute heißt Fehlersuche „**Debugging**“ – wörtlich: entwanzen.', 64), gfx: { wort: {} } },
      { t: T('Der Eintrag nennt sogar die Uhrzeit: **15:45 Uhr**, Relais Nummer 70 im Feld F.', 64), gfx: { z3: { draw: 'zahl', args: ['15:45', 'Relais Nr. 70, Feld F', 420] } } },
      { t: T('Jedes Relais ist ein kleiner **Schalter**, den ein Elektromagnet umlegt:', 64), gfx: { f2: { draw: 'formel', args: [['Strom an', '→', 'Magnet zieht', '→', 'Schalter zu'], 330] } } },
      { t: T('Berühmte Bugs gibt es bis heute: 1996 explodierte die Rakete **Ariane 5** schon 37 Sekunden nach dem Start.', 64), gfx: { z4: { draw: 'zahl', args: ['37 s', 'nach dem Start: Ariane 5 zerstört, 1996', 420] } } },
      { t: T('Die Ursache: Eine Zahl war zu groß für ihren **Speicherplatz** – die Steuerung bekam Unsinn.', 64), gfx: { f3: { draw: 'formel', args: [['zu große Zahl', '→', 'zu kleiner Speicher', '→', 'Unsinn'], 330] } } },
      { t: T('Oder das **Jahr-2000-Problem**: Viele Programme speicherten Jahre zweistellig – aus 2000 drohte 1900 zu werden.', 64), gfx: { f4: { draw: 'formel', args: [['„00“', '→', '1900 statt 2000'], 330] } } },
      { t: T('Weltweit wurden Milliarden ausgegeben, um es vorher zu beheben – darum blieb das **Chaos** aus.', 64), gfx: { relais: { tf: [0.8, 36, 80] } } },
      { t: T('Grace Hopper erklärte gern, wie kurz eine **Nanosekunde** ist – mit einem Stück Draht:', 64), gfx: { f5: { draw: 'formel', args: [['Licht in 1 Nanosekunde', '≈', '30 cm Draht'], 330] } } },
      recap(
        [{ gfx: 'relais' }, { pic: 0, id: 'l', cam: [50, 55, 1.6] }, { gfx: 'zeit' }, { pic: 1, id: 'h', cam: [55, 28, 1.3] }],
        ['1947: Motte im Relais', 'Logbuch-Eintrag', '„Bug“ schon 1878', 'Grace Hopper'],
      ),
    ],
    summary: ['1947: Motte im Harvard Mark II.', '„Bug“ nutzte schon Edison 1878.', 'Grace Hopper machte die Geschichte berühmt.'],
    sources: ['Smithsonian National Museum of American History: Log Book With Computer Bug'],
  },
  {
    id: 'gutenberg',
    area: 'TECH',
    day: 45,
    hook: 'Hat Gutenberg den Buchdruck erfunden?',
    mood: 'ruhig',
    ambience: 'uhr',
    images: [img('gutenberg-bibel')],
    draw: {
      schreiben(g) {
        ink(g, RR(70, 260, 220, 300, 8), { w: 3, t: 700 })
        for (let k = 0; k < 9; k++) ink(g, B([96, 300 + k * 26], [150, 296 + k * 26], [200, 304 + k * 26], [k === 8 ? 180 : 262, 300 + k * 26]), { w: 1.8, d: 600 + k * 400, t: 380 })
        const q = st(g, 'float')
        const feather: P[] = [...B([320, 210], [340, 250], [300, 300], [262, 330]), ...B([262, 330], [272, 280], [290, 240], [320, 210]).slice(1)]
        hatch(q, feather, 800, true)
        ink(q, feather, { w: 2.4, d: 400, t: 500 })
        text(g, 180, 600, 'eine Bibel: Monate', { anchor: 'middle', d: 1200 })
      },
      zeit(g) {
        const at = (y: number) => (y - 1000) / 500
        timeline(g, 30, 330, 440, [
          { at: at(1040), label: '1040', sub: 'China: Ton', up: true },
          { at: at(1377), label: '1377', sub: 'Korea: Metall' },
          { at: at(1450), label: '1450', sub: 'Mainz', up: true, big: true },
        ], 0, 600)
      },
      lettern(g) {
        for (let i = 0; i < 6; i++) {
          const x = 50 + (i % 3) * 94
          const y = 280 + Math.floor(i / 3) * 120
          const p = pop(g, i * 150, '50% 50%')
          blank(p, RR(x, y, 74, 74, 6))
          hatch(p, RR(x, y, 74, 74, 6), 0)
          ink(p, RR(x, y, 74, 74, 6), { w: 2.8, t: 0 })
          blank(p, RR(x + 16, y + 16, 42, 42, 4))
          ink(p, L([x + 22, y + 26], [x + 52, y + 26]), { w: 2.6, t: 0 })
          ink(p, L([x + 37, y + 20], [x + 37, y + 54]), { w: 2.6, t: 0 })
          ink(p, L([x + 24, y + 48], [x + 50, y + 40 + (i % 2) * 10]), { w: 2.4, t: 0 })
        }
      },
      presse(g) {
        ink(g, L([80, 600], [80, 250]), { w: 4, t: 500 })
        ink(g, L([280, 600], [280, 250]), { w: 4, t: 500 })
        ink(g, RR(70, 240, 220, 30, 4), { w: 3, d: 300, t: 400 })
        hatch(g, RR(70, 240, 220, 30, 4), 600, true)
        const screw = group(g)
        for (let k = 0; k < 6; k++) ink(screw, L([168, 280 + k * 14], [192, 288 + k * 14]), { w: 2.4, d: 500, t: 100 })
        const plate = group(g)
        ink(plate, RR(110, 380, 140, 30, 4), { w: 3, d: 700, t: 400 })
        ink(plate, L([180, 270], [180, 380]), { w: 3, d: 600, t: 300 })
        plate.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(60px)', offset: 0.5 }, { transform: 'translateY(0)' }], { duration: 2400, delay: 1200, iterations: Infinity, easing: 'ease-in-out' })
        ink(g, RR(100, 470, 160, 20, 3), { w: 3, d: 900, t: 400 })
        const labs: [number, number, string][] = [[20, 330, 'Gießinstrument'], [300, 330, 'Legierung'], [20, 540, 'Ölfarbe'], [300, 540, 'Presse']]
        labs.forEach(([x, y, l], i) => text(g, x === 20 ? 30 : 330, y, l, { anchor: x === 20 ? 'start' : 'end', d: 1400 + i * 300, cls: 's' }))
      },
      buecher(g) {
        for (let k = 0; k < 8; k++) {
          const p = pop(g, k * 160, '50% 100%')
          const y = 600 - k * 32
          blank(p, RR(100 + (k % 2) * 10, y - 28, 160, 28, 4))
          ink(p, RR(100 + (k % 2) * 10, y - 28, 160, 28, 4), { w: 2.6, t: 0 })
          hatch(p, RR(100 + (k % 2) * 10, y - 28, 24, 28, 4), 0, true)
        }
      },
    },
    scenes: [
      { t: HOOK(476), pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [40, 45, 1.05], cam2: [40, 45, 1.3] } } },
      { t: T('Johannes Gutenberg, um 1400 in **Mainz** geboren – gelernter Metallhandwerker und Unternehmer.', 470), pics: { b: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [40, 45, 1.3] } } },
      { t: T('Vor Gutenberg wurden Bücher in Europa meist **von Hand** abgeschrieben.', 64), gfx: { schreiben: {} } },
      { t: T('Für eine Bibel brauchte ein Schreiber oft **ein bis drei Jahre**.', 64), gfx: { schreiben: {} } },
      { t: T('Gedruckt wurde aber schon früher – nur **woanders**.', 64), gfx: { zeit: {} } },
      { t: T('In China erfand **Bi Sheng** um 1040 bewegliche Lettern aus Ton.', 64), gfx: { lettern: {} } },
      { t: T('Chinesisch hat Tausende Schriftzeichen – bewegliche Lettern lohnten sich dort weniger als bei rund **26 Buchstaben**.', 64), gfx: { vergleich: { args: [['Chinesisch', 'Tausende Zeichen'], ['Latein', 'rund 26 Buchstaben'], 290] } } },
      { t: T('In Korea druckte man 1377 das Buch „**Jikji**“ mit Lettern aus Metall – rund 80 Jahre vor Gutenberg.', 64), gfx: { zeit: { tf: [1, 0, 40] } } },
      { t: T('Gutenbergs Leistung um 1450 in Mainz war das **System**:', 64, { kind: 'big' }), gfx: { presse: {} } },
      { t: T('Das **Gießinstrument**: Flüssiges Metall in eine Form – blitzschnell entstehen identische Buchstaben.', 64), gfx: { presse: {} } },
      { t: T('Die Legierung aus **Blei, Zinn und Antimon** schmolz leicht und wurde trotzdem hart.', 64), gfx: { p2: { draw: 'punkte', args: [['Blei', 'Zinn', 'Antimon'], 330] } } },
      { t: T('Die Presse selbst kam von der **Weinpresse**.', 64), gfx: { presse: {} } },
      { t: T('Damit wurde Drucken **schnell** und billig.', 64, { kind: 'big' }), gfx: { buecher: {} } },
      { t: T('Um 1455 erschien die **Gutenberg-Bibel**: rund 180 Exemplare – 49 sind heute erhalten.', 64), gfx: { zahl: { args: ['49', 'erhaltene Gutenberg-Bibeln', 420] } } },
      { t: T('Um 1500 druckten schon über **200** Orte in Europa – Millionen Bücher.', 64), gfx: { buecher: {} } },
      { t: T('Die Folgen waren riesig:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Buchdruck', '→', 'billige Bücher', '→', 'Reformation, Wissenschaft, Zeitungen'], 320] } } },
      recap(
        [{ gfx: 'schreiben' }, { gfx: 'zeit' }, { gfx: 'lettern' }, { gfx: 'presse' }],
        ['vorher: von Hand', 'China, Korea, Mainz', 'bewegliche Lettern', 'das System: Guss, Farbe, Presse'],
      ),
    ],
    summary: ['China um 1040: Lettern aus Ton.', 'Korea 1377: Metall-Lettern (Jikji).', 'Gutenberg um 1450: Gießverfahren, Farbe, Presse.'],
    sources: ['UNESCO Memory of the World: Jikji', 'Gutenberg-Museum Mainz'],
  },
  {
    id: 'gluehbirne',
    area: 'TECH',
    day: 45,
    hook: 'Hat Edison die Glühbirne erfunden?',
    mood: 'hell',
    images: [img('gluehfaden'), img('swan'), img('edison')],
    draw: {
      birne(g) {
        bulb(g, 180, 420, 2.2, 0)
        const glow = st(g, 'f1', '--dl:300ms')
        rays(glow, 180, 360, 120, 160, 12, 0)
      },
      kerze(g) {
        ink(g, RR(150, 420, 60, 160, 6), { w: 3, t: 600 })
        ink(g, L([180, 420], [180, 400]), { w: 2.4, d: 400, t: 150 })
        const fl = st(g, 'sway', '--d:600ms; transform-box: view-box; transform-origin: 180px 400px')
        const f: P[] = [...B([180, 400], [160, 380], [170, 340], [180, 320]), ...B([180, 320], [190, 340], [200, 380], [180, 400]).slice(1)]
        hatch(fl, f, 700, true)
        ink(fl, f, { w: 2.6, d: 500, t: 400 })
      },
      zeit(g) {
        timeline(g, 30, 330, 420, [
          { at: 0.1, label: '1840er', sub: 'erste Versuche', up: true },
          { at: 0.85, label: '1879', sub: 'Swan & Edison', up: true, big: true },
        ], 0, 700)
      },
      firma(g) {
        bigText(g, 180, 560, 'Ediswan', { size: 64, d: 900 })
      },
      netz(g) {
        ink(g, RR(20, 420, 90, 140, 4), { w: 3, t: 600 })
        hatch(g, RR(20, 420, 90, 140, 4), 400)
        ink(g, RR(40, 360, 20, 60, 2), { w: 2.6, d: 300, t: 300 })
        for (let k = 0; k < 2; k++) {
          const s = group(g)
          ink(s, B([50, 350], [40, 330], [60, 320], [50, 300]), { w: 2, d: 600, t: 300 })
          loop(s, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-30px)', opacity: 0 }], 2000, k * 1000)
        }
        text(g, 65, 600, 'Kraftwerk', { anchor: 'middle', d: 600 })
        for (let k = 0; k < 3; k++) {
          const x = 160 + k * 66
          ink(g, RR(x, 480, 50, 80, 3), { w: 2.6, d: 800 + k * 200, t: 400 })
          ink(g, [[x - 4, 480], [x + 25, 450], [x + 54, 480]], { w: 2.6, d: 900 + k * 200, t: 300 })
          bulb(pop(g, 1400 + k * 200, '50% 50%'), x + 25, 510, 0.3)
        }
        dashes(g, [...L([110, 440], [190, 440]), ...L([190, 440], [320, 440]).slice(1)], { w: 2, d: 1000 })
        text(g, 245, 600, 'Leitungen, Zähler', { anchor: 'middle', d: 1600 })
      },
    },
    scenes: [
      { t: HOOK(70), gfx: { birne: { cls: 'a1' } } },
      { t: T('Das Prinzip ist einfach:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Strom', '→', 'heißer, dünner Draht', '→', 'Licht'], 320] } } },
      { t: T('Das Problem: An der Luft **verbrennt** der Draht sofort. Man braucht einen Glaskolben ohne Sauerstoff.', 64), gfx: { birne: {} } },
      { t: T('Bis ins 19. Jahrhundert war Licht **Feuer**: Kerzen, Öllampen, später Gas.', 64), gfx: { kerze: {} } },
      { t: T('Glühende Drähte unter Glas probierten Erfinder schon **Jahrzehnte** vor Edison aus.', 64), gfx: { zeit: {} } },
      { t: T('Schon 1802 brachte Humphry Davy einen Draht zum Glühen. 1840 baute Warren de la Rue eine Lampe mit **Platin** – viel zu teuer.', 64), gfx: { zeit: {} } },
      {
        t: T('In England stellte **Joseph Swan** 1879 eine funktionierende Glühlampe vor – ungefähr gleichzeitig mit Edison.', 330),
        pics: { s: { img: 1, x: 40, y: 64, w: 120, h: 150, r: 'oval', enter: 'blot', cam: [50, 35, 1.6], cap: 'Joseph Swan' }, e: { img: 2, x: 200, y: 64, w: 120, h: 150, r: 'oval', enter: 'blot', cam: [65, 25, 2.2], cap: 'Thomas Edison' } },
      },
      {
        t: T('Die beiden stritten vor Gericht – und gründeten dann eine **gemeinsame Firma**.', 330),
        pics: { s: { img: 1, x: 80, y: 64, w: 120, h: 150, r: 'oval', cam: [50, 35, 1.6] }, e: { img: 2, x: 160, y: 64, w: 120, h: 150, r: 'oval', cam: [65, 25, 2.2] } },
        gfx: { firma: {} },
      },
      { t: T('Edison testete Tausende Materialien. Ein Faden aus verkohltem **Bambus** hielt schließlich über 1.200 Stunden.', 64), gfx: { z2: { draw: 'zahl', args: ['1.200 h', 'hielt Edisons Bambusfaden', 420] } } },
      { t: T('Edisons Vorsprung: ein Glühfaden, der **lange** hielt – und das ganze System dahinter.', 64), gfx: { netz: {} } },
      { t: T('Später setzte sich **Wolfram** als Glühfaden durch – ab etwa 1904.', 64), gfx: { birne: { cls: 'a1', tf: [0.8, 36, 80] } } },
      { t: T('Glühlampen verschwenden viel Strom:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['100 % Strom', '→', '5 % Licht', '+', '95 % Wärme'], 320] } } },
      { t: T('Darum wurden sie in der EU ab 2009 schrittweise **verboten**. LEDs brauchen für dasselbe Licht rund 80 bis 90 Prozent weniger.', 64), gfx: { z3: { draw: 'zahl', args: ['− 85 %', 'Strom mit LED', 420] } } },
      { t: T('An einer einzigen Lampe gerechnet: Eine 60-Watt-Glühbirne ist etwa so hell wie eine **8-Watt-LED**.', 64), gfx: { f3: { draw: 'formel', args: [['60 W Glühbirne', '≈', '8 W LED'], 330, 'gleich hell'] } } },
      { t: T('Brennt sie drei Stunden am Tag, spart die LED in einem Jahr:', 64), gfx: { f4: { draw: 'formel', args: [['52 Watt weniger', '×', '3 Stunden', '×', '365 Tage', '≈', '57 kWh'], 320] } } },
      { t: T('Bei rund 35 Cent je Kilowattstunde sind das etwa **20 Euro** im Jahr – für eine einzige Lampe.', 64), gfx: { f5: { draw: 'formel', args: [['57 kWh', '×', '0,35 €', '≈', '20 € pro Jahr'], 330] } } },
      {
        t: T('1882 ging in New York sein erstes **Kraftwerk** ans Netz.', 486),
        pics: { f: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.3] } },
      },
      { t: T('Edisons Kraftwerk in der Pearl Street versorgte anfangs **85 Kunden** mit rund 400 Lampen.', 64), gfx: { z4: { draw: 'zahl', args: ['85', 'Kunden am ersten Tag, 1882', 420] } } },
      { t: T('Edison setzte auf **Gleichstrom**, Tesla und Westinghouse auf Wechselstrom. Den „Stromkrieg“ gewann der Wechselstrom.', 64), gfx: { vergleich: { args: [['Gleichstrom', 'Edison', 'nur kurze Wege'], ['Wechselstrom', 'Tesla, Westinghouse', 'leicht umzuspannen, weite Wege'], 290] } } },
      recap(
        [{ gfx: 'birne', cls: 'a1' }, { gfx: 'zeit' }, { gfx: 'firma' }, { gfx: 'netz' }],
        ['heißer Draht im Vakuum', 'Versuche lange vor 1879', 'Swan + Edison = Ediswan', 'Edisons Stromnetz 1882'],
      ),
    ],
    summary: ['Glühlampen-Versuche lange vor Edison.', 'Joseph Swan war fast gleichzeitig.', 'Edisons Stärke: haltbarer Faden + Stromnetz (1882).'],
    sources: ['Science Museum London: Joseph Swan', 'Smithsonian: Edison’s Pearl Street Station'],
  },
  {
    id: 'turing-test',
    area: 'TECH',
    day: 70,
    hook: 'Kann eine KI dich täuschen?',
    mood: 'kosmisch',
    images: [img('turing-statue')],
    draw: {
      zimmer(g) {
        ink(g, RR(90, 280, 180, 220, 6), { w: 3.2, t: 700 })
        fig(pop(g, 400), 180, 480, 2.4)
        ink(g, RR(196, 400, 44, 30, 3), { w: 2.4, d: 700, t: 300 })
        hatch(g, RR(196, 400, 44, 30, 3), 900, true)
        arrow(g, L([20, 360], [86, 360]), { w: 2.6, d: 1100, t: 300 })
        arrow(g, L([274, 440], [340, 440]), { w: 2.6, d: 1500, t: 300 })
        text(g, 50, 340, '字', { anchor: 'middle', size: 26, d: 1100 })
        text(g, 310, 420, '字', { anchor: 'middle', size: 26, d: 1500 })
        text(g, 180, 560, 'Regeln befolgen ≠ verstehen', { anchor: 'middle', d: 1800 })
      },
      modelle(g) {
        vbars(g, [
          { label: 'KI mit Rolle', v: 73, fmt: pct, dense: true },
          { label: 'KI ohne Rolle', v: 36, fmt: pct },
          { label: 'ELIZA, 1966', v: 23, fmt: pct },
        ], { x: 40, base: 580, w: 76, gap: 104, h: 300, max: 100 })
        text(g, 40, 250, 'für den Menschen gehalten', { cls: 's', d: 200 })
      },
      aufbau(g) {
        fig(pop(g, 0), 180, 620, 3)
        text(g, 180, 650, 'du', { anchor: 'middle', d: 300 })
        for (const [x, lab, d] of [[30, 'A', 300], [210, 'B', 600]] as const) {
          ink(g, RR(x, 240, 120, 150, 12), { w: 3, d, t: 600 })
          hatch(g, RR(x, 240, 120, 150, 12), d + 400)
          text(g, x + 60, 330, lab, { anchor: 'middle', size: 40, d: d + 300, cls: 'halo' })
          question(g, x + 60, 220, 0.6, d + 500)
        }
        dashes(g, L([150, 520], [100, 400]), { w: 1.8, d: 900 })
        dashes(g, L([210, 520], [260, 400]), { w: 1.8, d: 1000 })
      },
      chat(g) {
        const rows: [number, 'l' | 'r', number][] = [[230, 'r', 170], [310, 'l', 200], [390, 'r', 140], [470, 'l', 220], [550, 'r', 160]]
        rows.forEach(([y, side, w], i) => {
          const x = side === 'l' ? 30 : 330 - w
          bubble(g, x, y, w, 52, side, 300 + i * 500)
          for (let k = 0; k < 2; k++) ink(g, L([x + 16, y + 18 + k * 16], [x + w - 20 - k * 30, y + 18 + k * 16]), { w: 1.8, d: 500 + i * 500, t: 200 })
        })
      },
      ergebnis(g) {
        hbars(g, [
          { label: 'KI für den Menschen gehalten', v: 73, fmt: (v) => `${Math.round(v)} %`, dense: true },
          { label: 'echter Mensch erkannt', v: 27, fmt: (v) => `${Math.round(v)} %` },
        ], { y: 300, gap: 120, max: 100 })
      },
      denken(g) {
        brain(g, 180, 400, 1.1)
        question(g, 300, 250, 1.4, 1000)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { t: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 30, 1.05], cam2: [50, 30, 1.25] } } },
      { t: T('Alan Turing, 1912 bis 1954: Mathematiker und **Vordenker** des Computers.', 470), pics: { t: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [50, 30, 1.3] } } },
      { t: T('Im Zweiten Weltkrieg half er in Bletchley Park, die deutsche **Enigma**-Verschlüsselung zu knacken.', 64), gfx: { zahl: { args: ['Enigma', 'geknackt in Bletchley Park', 420] } } },
      { t: T('1936 beschrieb er eine gedachte Rechenmaschine – die **Turingmaschine**, das Grundmodell jedes Computers.', 64), gfx: { z2: { draw: 'zahl', args: ['1936', 'Turingmaschine', 420] } } },
      { t: T('1950 schlug Alan Turing einen Test vor: Ein Mensch chattet mit zwei Unbekannten – einem Menschen und einer Maschine.', 64), gfx: { aufbau: {} } },
      { t: T('Kann er sie nicht unterscheiden, hat die Maschine bestanden. Turing nannte es das **Imitationsspiel**.', 64), gfx: { chat: {} } },
      { t: T('Turing sagte voraus: Um das Jahr 2000 würde eine Maschine nach fünf Minuten in **30 Prozent** der Fälle für einen Menschen gehalten.', 64), gfx: { z3: { draw: 'zahl', args: ['30 %', 'Turings Prognose für das Jahr 2000', 420] } } },
      { t: T('2025 testeten Forscher der Uni San Diego Sprachmodelle genau so. Ein Modell mit passender Rolle wirkte **menschlicher** als die Menschen.', 64), gfx: { ergebnis: {} } },
      { t: T('Die Testpersonen chatteten fünf Minuten **gleichzeitig** mit einem Menschen und einer KI – dann mussten sie wählen.', 64), gfx: { chat: {} } },
      { t: T('Ohne Rollenanweisung schnitt dasselbe Modell deutlich schlechter ab. Und das Programm **ELIZA** von 1966 täuschte kaum jemanden.', 64), gfx: { modelle: {} } },
      { t: T('Heißt das, die Maschine **denkt**? Der Test misst, ob etwas menschlich wirkt – nicht, ob es versteht.', 64), gfx: { denken: {} } },
      { t: T('Der Philosoph John Searle hielt 1980 dagegen: das „**Chinesische Zimmer**“. Regeln befolgen heißt nicht verstehen.', 64), gfx: { zimmer: {} } },
      { t: T('Seit 2021 ist Turing auf der britischen **50-Pfund-Note**. 2013 wurde er offiziell rehabilitiert – verurteilt war er 1952 wegen Homosexualität.', 64), gfx: { z4: { draw: 'zahl', args: ['50 £', 'Turing auf der Banknote, seit 2021', 420] } } },
      { t: T('Ursprünglich beschrieb Turing ein Spiel mit **Mann und Frau**: Wer ist wer? Dann ersetzte er einen durch eine Maschine.', 64), gfx: { aufbau: {} } },
      { t: T('Seine Idee: Statt „Können Maschinen **denken**?“ lieber fragen: „Können sie dieses Spiel gewinnen?“', 64), gfx: { denken: {} } },
      { t: T('Kritik: Der Test belohnt **Täuschung** – wer menschlich wirken will, muss sogar Tippfehler nachahmen.', 64), gfx: { f3: { draw: 'formel', args: [['menschlich wirken', '≠', 'denken'], 330] } } },
      { t: T('Heute wird KI vielfältig geprüft: Mathe-Aufgaben, **Programmieren**, Fachprüfungen.', 64), gfx: { punkte: { args: [['Mathematik', 'Programmieren', 'Fachprüfungen', 'Alltagsaufgaben'], 300] } } },
      recap(
        [{ gfx: 'aufbau' }, { gfx: 'chat' }, { gfx: 'modelle' }, { gfx: 'zimmer' }],
        ['Imitationsspiel 1950', 'fünf Minuten Chat', '2025: 73 % für Mensch gehalten', 'wirken ≠ verstehen'],
      ),
    ],
    summary: ['Turing 1950: das Imitationsspiel.', '2025: KI in 73 % der Fälle für Mensch gehalten.', 'Menschlich wirken ist nicht dasselbe wie verstehen.'],
    sources: ['Turing 1950, Mind', 'Jones & Bergen 2025, „Large Language Models Pass the Turing Test“'],
  },
]
