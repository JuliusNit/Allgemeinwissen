import type { Bite } from '../feed'
import { img } from './img'
import {
  B, E, HOOK, L, RR, T, arrow, balance, bigText, blank, car, check, coin, cross, dashes, fig, group, hatch, hbars, ink, mk, pop, question, ring, st, text, timeline, vbars, type P,
} from './draw'
import { recap } from './common'

// Gesellschaft, Politik & Wirtschaft: Geschichte, Staat & Recht, Wirtschaft

const pct = (v: number) => `${Math.round(v)} %`
const tsd = (v: number) => Math.round(v).toLocaleString('de-DE')

/** Tulpe mit Stiel, Fuß bei (x, y) */
function tulip(g: Element, x: number, y: number, s = 1, d = 0): void {
  ink(g, B([x, y], [x + 2 * s, y - 30 * s], [x - 2 * s, y - 50 * s], [x, y - 70 * s]), { w: 2.6, d, t: 400 })
  ink(g, B([x, y - 12 * s], [x - 26 * s, y - 24 * s], [x - 30 * s, y - 44 * s], [x - 22 * s, y - 56 * s]), { w: 2.2, d: d + 200, t: 300 })
  const cup: P[] = [
    ...B([x - 20 * s, y - 98 * s], [x - 24 * s, y - 76 * s], [x - 12 * s, y - 66 * s], [x, y - 66 * s]),
    ...B([x, y - 66 * s], [x + 12 * s, y - 66 * s], [x + 24 * s, y - 76 * s], [x + 20 * s, y - 98 * s]).slice(1),
    [x + 10 * s, y - 86 * s],
    [x, y - 102 * s],
    [x - 10 * s, y - 86 * s],
    [x - 20 * s, y - 98 * s],
  ]
  hatch(g, cup, d + 500, true)
  ink(g, cup, { w: 2.6, d: d + 300, t: 500 })
}

/** Haus mit Giebel, Grundlinie y */
function house(g: Element, x: number, y: number, w: number, h: number, d = 0): void {
  ink(g, RR(x, y - h, w, h, 3), { w: 2.6, d, t: 500 })
  ink(g, [[x - 6, y - h + 2], [x + w / 2, y - h - w * 0.5], [x + w + 6, y - h + 2]], { w: 2.8, d: d + 300, t: 400 })
  hatch(g, [[x - 4, y - h], [x + w / 2, y - h - w * 0.48], [x + w + 4, y - h]], d + 600, true)
  ink(g, RR(x + w * 0.38, y - h * 0.5, w * 0.24, h * 0.5, 2), { w: 2, d: d + 500, t: 300 })
}

export const GESELLSCHAFT: Bite[] = [
  {
    id: 'hoernerhelm',
    area: 'GESCH',
    day: 31,
    hook: 'Trugen Wikinger Helme mit Hörnern?',
    mood: 'episch',
    ambience: 'wellen',
    images: [img('gjermundbu-helm'), img('veksoe-helm')],
    draw: {
      ausruestung(g) {
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 500 })
        fig(pop(g, 200), 150, 618, 4, { arms: 'push', w: 2.6 })
        const cap = B([128, 512], [126, 482], [174, 482], [172, 512])
        hatch(g, [...cap], 900, true)
        ink(g, cap, { w: 3, d: 700, t: 400 })
        ink(g, L([96, 640], [132, 330]), { w: 3.4, d: 900, t: 500 })
        ink(g, [[124, 336], [134, 300], [142, 338], [124, 336]], { w: 2.6, d: 1300, t: 300 })
        hatch(g, E(236, 500, 56), 1500)
        ink(g, E(236, 500, 56), { w: 3.4, d: 1200, t: 600 })
        ink(g, E(236, 500, 14), { w: 3, d: 1600, t: 300 })
        text(g, 236, 590, 'Holzschild', { anchor: 'middle', d: 1700, cls: 's' })
        text(g, 150, 470, 'Lederkappe?', { anchor: 'middle', d: 1900, cls: 's' })
      },
      hieb(g) {
        const dome = (x: number, y: number, d: number) => {
          const p = B([x - 46, y], [x - 48, y - 70], [x + 48, y - 70], [x + 46, y])
          hatch(g, [...p], d + 400)
          ink(g, p, { w: 3, d, t: 500 })
          ink(g, L([x - 50, y], [x + 50, y]), { w: 3.4, d: d + 200, t: 300 })
        }
        dome(95, 470, 0)
        dome(265, 470, 300)
        for (const s of [-1, 1]) ink(g, B([265 + s * 40, 440], [265 + s * 76, 430], [265 + s * 80, 390], [265 + s * 64, 350]), { w: 3.6, d: 600, t: 400 })
        arrow(g, B([20, 300], [70, 330], [100, 390], [160, 380]), { w: 3, d: 1200, t: 500 })
        check(g, 95, 560, 1.3, 1800)
        arrow(g, L([300, 280], [322, 352]), { w: 3, d: 1600, t: 300 })
        cross(g, 265, 560, 1.3, 2100)
        text(g, 95, 610, 'gleitet ab', { anchor: 'middle', d: 1900 })
        text(g, 265, 610, 'bleibt hängen', { anchor: 'middle', d: 2200 })
      },
      fluegel(g) {
        const dome = B([120, 470], [116, 370], [244, 370], [240, 470])
        hatch(g, [...dome], 600)
        ink(g, dome, { w: 3.4, t: 700 })
        ink(g, L([110, 470], [250, 470]), { w: 3.6, d: 400, t: 300 })
        for (const s of [-1, 1]) {
          const x = (v: number) => 180 + s * v
          const wing: P[] = [[x(62), 430], [x(150), 330], [x(130), 380], [x(160), 370], [x(126), 420], [x(150), 420], [x(70), 452], [x(62), 430]]
          hatch(g, wing, 1000, true)
          ink(g, wing, { w: 2.6, d: 700, t: 600 })
        }
        text(g, 180, 540, 'Flügelhelm, Bühne 1876', { anchor: 'middle', d: 1300 })
      },
      fans(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        for (let k = 0; k < 5; k++) {
          const x = 52 + k * 64
          const p = pop(g, 200 + k * 160)
          fig(p, x, 598, 2.6, { arms: k % 2 ? 'up' : 'down' })
          for (const s of [-1, 1]) ink(p, B([x + s * 12, 524], [x + s * 22, 520], [x + s * 24, 506], [x + s * 18, 496]), { w: 2.6, t: 0 })
        }
        text(g, 180, 640, 'Comics, Filme, Fußballstadien', { anchor: 'middle', d: 1200 })
      },
      kelten(g) {
        const dome = B([120, 470], [116, 380], [244, 380], [240, 470])
        hatch(g, [...dome], 600, true)
        ink(g, dome, { w: 3.4, t: 700 })
        ink(g, L([110, 470], [250, 470]), { w: 3.4, d: 400, t: 300 })
        for (const s of [-1, 1]) {
          const cone: P[] = [[180 + s * 30, 396], [180 + s * 76, 300], [180 + s * 50, 406], [180 + s * 30, 396]]
          hatch(g, cone, 900, true)
          ink(g, cone, { w: 2.8, d: 700, t: 400 })
        }
        text(g, 180, 540, 'Waterloo-Helm, um 100 v. Chr.', { anchor: 'middle', d: 1200 })
        text(g, 180, 566, 'British Museum', { anchor: 'middle', d: 1300, cls: 's' })
      },
      helm(g) {
        const dome = B([112, 404], [108, 296], [252, 296], [248, 404])
        hatch(g, [...dome], 700)
        ink(g, dome, { w: 3.4, t: 700 })
        ink(g, RR(102, 392, 156, 28, 8), { w: 3, d: 400, t: 600 })
        hatch(g, RR(102, 392, 156, 28, 8), 800, true)
        ink(g, L([180, 420], [180, 470]), { w: 6, d: 700, t: 300 })
        const horns = st(g, 'h2', '--dl:200ms')
        for (const s of [-1, 1]) {
          const x = (v: number) => 180 + s * v
          const horn: P[] = [...B([x(64), 372], [x(116), 362], [x(126), 296], [x(98), 244]), ...B([x(98), 244], [x(100), 290], [x(88), 330], [x(58), 346]).slice(1)]
          hatch(horns, horn, 900 + (s + 1) * 100, true)
          ink(horns, horn, { w: 3, d: 500 + (s + 1) * 150, t: 600 })
        }
        const x = st(g, 'x1', '--o:50% 50%;--dl:300ms')
        cross(x, 90, 300, 1.8)
        cross(x, 270, 300, 1.8)
      },
      zeit(g) {
        const at = (y: number) => (y + 1000) / 2900
        timeline(g, 24, 336, 400, [
          { at: at(900), label: '800–1050', sub: 'Wikinger', up: true },
          { at: at(1876), label: '1876', sub: 'Wagner', big: true },
        ])
        hatch(g, RR(24 + 296 * at(800) - 2, 392, 296 * (at(1050) - at(800)) + 4, 16, 6), 900, true)
        const br = st(g, 'x1', '--o:50% 50%;--dl:400ms')
        ink(br, E(24 + 296 * at(-900), 400, 7), { w: 2.6, t: 0 })
        hatch(br, E(24 + 296 * at(-900), 400, 7), 0, true)
        text(br, 34, 432, 'um 900 v. Chr.', { fade: false })
        text(br, 34, 450, 'Veksø-Helme', { cls: 's', fade: false })
      },
      oper(g) {
        ink(g, L([30, 560], [330, 560]), { w: 3, t: 500 })
        for (const s of [-1, 1]) {
          const x = (v: number) => 180 + s * v
          const drape: P[] = [
            [x(150), 110],
            [x(28), 110],
            ...B([x(28), 110], [x(56), 220], [x(100), 300], [x(112), 330]),
            ...B([x(112), 330], [x(104), 420], [x(116), 500], [x(108), 560]).slice(1),
            [x(150), 560],
            [x(150), 110],
          ]
          hatch(g, drape, 400)
          ink(g, drape, { w: 2.8, d: 100, t: 700 })
          for (const k of [0.3, 0.6]) ink(g, B([x(150 - 90 * k), 120], [x(150 - 70 * k), 220], [x(126 - 8 * k), 300], [x(124), 330]), { w: 1.6, d: 500, t: 400 })
          ink(g, E(x(116), 334, 9, 6), { w: 2.4, d: 700, t: 200 })
        }
        ink(g, RR(30, 96, 300, 28, 6), { w: 3, d: 200, t: 500 })
        hatch(g, RR(30, 96, 300, 28, 6), 600, true)
        dashes(g, L([180, 130], [120, 548]), { w: 1.8, d: 700 })
        dashes(g, L([180, 130], [240, 548]), { w: 1.8, d: 700 })
        const singer = pop(g, 900)
        fig(singer, 180, 556, 3, { arms: 'up', w: 2.6 })
        const hy = 556 - 81
        ink(singer, B([164, hy - 10], [164, hy - 30], [196, hy - 30], [196, hy - 10]), { w: 2.6, t: 0 })
        for (const s of [-1, 1]) ink(singer, B([180 + s * 15, hy - 16], [180 + s * 30, hy - 20], [180 + s * 34, hy - 36], [180 + s * 26, hy - 50]), { w: 3.4, t: 0 })
      },
    },
    scenes: [
      { t: HOOK(66), gfx: { helm: {} } },
      { t: T('Kein einziger **Hörnerhelm** aus der Wikingerzeit wurde je gefunden.', 500), gfx: { helm: { cls: 'a1' } } },
      { t: T('Dabei kennen Archäologen aus der Wikingerzeit Tausende Gräber, Waffen und Schmuckstücke.', 64), gfx: { zahl: { args: ['250', 'Jahre Wikingerzeit, etwa 800 bis 1050', 420] } } },
      { t: T('Helme sind darunter extrem **selten**: Eisen war teuer. Viele Krieger kämpften wohl mit Lederkappe – oder ganz ohne.', 64), gfx: { ausruestung: {} } },
      {
        t: T('Der einzige fast vollständige Wikingerhelm – der Gjermundbu-Helm aus Norwegen – ist schlicht **rund**.', 60),
        pics: { g: { img: 0, x: 40, y: 220, w: 280, h: 300, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 45, 1.2], cap: 'Gjermundbu-Helm, um 970' } },
        gfx: { helm: { cls: 'a1 a2', tf: [0.42, 196, 380], o: 0 } },
      },
      {
        t: T('Gefunden 1943 in einem Grab aus dem 10. Jahrhundert: eine Eisenkappe mit Augenschutz wie eine **Brille**.', 450),
        pics: { g: { img: 0, x: 16, y: 56, w: 328, h: 370, cam: [50, 42, 1.6], cam2: [50, 40, 1.8] } },
      },
      { t: T('Hörner wären im Kampf sogar gefährlich: Ein Schwerthieb gleitet von einer glatten Kappe ab – an einem Horn **bleibt er hängen**.', 64), gfx: { hieb: {} } },
      { t: T('Die Hörner kamen erst im **19. Jahrhundert** dazu – mit Malern der Romantik.', 64), gfx: { zeit: {} } },
      { t: T('Damals entdeckte Nordeuropa seine Vergangenheit neu. Wikinger wurden zu wilden, edlen **Helden** stilisiert.', 64), gfx: { punkte: { args: [['Sagen und Heldenlieder', 'Stolz auf die eigene Nation', 'Wikinger als wilde, edle Krieger'], 300] } } },
      {
        t: T('Vor allem die Kostüme zu Wagners Oper „**Ring des Nibelungen**“ 1876 setzten den Wikingern Hörner auf.', 486),
        gfx: { zeit: { tf: [0.6, 72, -168] }, oper: { tf: [0.75, 45, 38] } },
      },
      { t: T('Der Kostümbildner Carl Emil Doepler gab den Figuren Hörner- und **Flügelhelme**. Die Oper wurde ein Erfolg – das Bild blieb hängen.', 64), gfx: { fluegel: {} } },
      { t: T('Später machten Comics, Filme und Fußballfans den Hörnerhelm zum **Markenzeichen** – bis heute.', 64), gfx: { fans: {} } },
      {
        t: { text: 'Hörnerhelme gab es – aber viel früher: die **Veksø-Helme** aus der Bronzezeit.', x: 184, y: 64, w: 160, kind: 'mid' },
        pics: { v: { img: 1, x: 20, y: 60, w: 152, h: 230, enter: 'blot', cam: [50, 50, 1.1], cap: 'Veksø-Helm, Dänemark' } },
        gfx: { zeit: { cls: 'a1', tf: [1, 0, 40] } },
      },
      {
        t: T('Rund **2.900 Jahre** alt – fast 2.000 Jahre vor den Wikingern.', 64),
        pics: { v: { img: 1, x: 70, y: 200, w: 220, h: 260, cam: [50, 45, 1.25] } },
        gfx: { zeit: { cls: 'a1', tf: [0.9, 18, 196] } },
      },
      {
        t: T('Die beiden Helme lagen in einem Moor – vermutlich eine **Opfergabe**. Getragen wurden sie wohl bei Zeremonien, nicht im Kampf.', 450),
        pics: { v: { img: 1, x: 16, y: 56, w: 328, h: 370, cam: [50, 40, 1.5], cam2: [50, 38, 1.7] } },
      },
      { t: T('Auch Kelten kannten Hörnerhelme – etwa den Helm, der in London in der Themse gefunden wurde. Auch er war **Prunk**.', 64), gfx: { kelten: {} } },
      { t: T('Woher das Bild also kommt:', 64, { kind: 'big' }), gfx: { f: { draw: 'formel', args: [['Hörnerhelm', '=', 'Ritual der Bronzezeit', '+', 'Oper 1876'], 300] } } },
      { t: T('Wagners Ring spielt in einer germanischen **Sagenwelt** – historische Genauigkeit war nie das Ziel.', 64), gfx: { oper: { tf: [0.8, 36, 80] } } },
      recap(
        [{ gfx: 'helm', cls: 'a1' }, { pic: 0, id: 'g' }, { gfx: 'oper' }, { pic: 1, id: 'v' }],
        ['Wikinger: keine Hörner gefunden', 'echter Helm: rund', 'Hörner aus der Oper 1876', 'Hörnerhelme: Bronzezeit'],
      ),
    ],
    summary: ['Kein Wikingerhelm mit Hörnern gefunden.', 'Wagner-Kostüme 1876 prägten das Bild.', 'Hörnerhelme gab es in der Bronzezeit.'],
    sources: ['Nationalmuseet Kopenhagen: Veksø-Helme', 'Kulturhistorisk museum Oslo: Gjermundbu-Helm'],
  },
  {
    id: 'napoleon',
    area: 'GESCH',
    day: 40,
    hook: 'War Napoleon wirklich so klein?',
    mood: 'episch',
    images: [img('napoleon-tuileries'), img('gillray-gulliver'), img('napoleon-alpen'), img('napoleon-maultier')],
    draw: {
      leben(g) {
        const at = (y: number) => (y - 1769) / (1821 - 1769)
        timeline(g, 30, 330, 430, [
          { at: at(1769), label: '1769', sub: 'Korsika', up: true },
          { at: at(1804), label: '1804', sub: 'Kaiser', big: true },
          { at: at(1815), label: '1815', sub: 'Waterloo', up: true },
          { at: at(1821), label: '1821', sub: 'St. Helena' },
        ], 0, 500)
      },
      garde(g) {
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 500 })
        for (const [i, x] of [[0, 50], [1, 112], [2, 248], [3, 310]] as const) {
          const p = pop(g, 200 + i * 150)
          fig(p, x, 618, 3.6)
          const hy = 618 - 27 * 3.6
          hatch(p, RR(x - 16, hy - 52, 32, 40, 10), 0, true)
          ink(p, RR(x - 16, hy - 52, 32, 40, 10), { w: 2.6, t: 0 })
        }
        const n = pop(g, 900)
        fig(n, 180, 618, 3.1)
        const hy = 618 - 27 * 3.1
        const hat: P[] = [...B([150, hy - 12], [162, hy - 22], [170, hy - 36], [180, hy - 36]), ...B([180, hy - 36], [190, hy - 36], [198, hy - 22], [210, hy - 12]).slice(1), ...B([210, hy - 12], [194, hy - 20], [166, hy - 20], [150, hy - 12]).slice(1)]
        hatch(n, hat, 0, true)
        ink(n, hat, { w: 2.6, t: 0 })
        text(g, 180, 650, 'Napoleon und Grenadiere der Garde', { anchor: 'middle', d: 1400, cls: 's' })
      },
      heights(g) {
        ink(g, L([40, 652], [40, 282]), { w: 2.6, t: 500 })
        for (let k = 0; k <= 18; k++) ink(g, L([40, 650 - k * 20], [k % 5 ? 47 : 54, 650 - k * 20]), { w: 1.8, d: 200 + k * 25, t: 80 })
        for (const [k, l] of [[5, '0,5'], [10, '1,0'], [15, '1,5']] as const) text(g, 60, 650 - k * 20 + 5, l, { cls: 's', d: 600 })
        ink(g, L([30, 652], [340, 652]), { w: 3, d: 100, t: 500 })
        const nb = st(g, 'm2', '--m2: scaleY(0.9375); transform-origin: 155px 650px; --dl: 1800ms')
        const bar = st(nb, 'grow-y', '--d:500ms')
        hatch(bar, RR(120, 314, 70, 336, 6), 500)
        ink(bar, RR(120, 314, 70, 336, 6), { w: 2.8, t: 0 })
        const top = st(g, 'm2', '--m2: translateY(21px); --dl: 1800ms')
        const hp = pop(top, 1300)
        const hat: P[] = [
          ...B([119, 304], [133, 296], [141, 278], [155, 278]),
          ...B([155, 278], [169, 278], [177, 296], [191, 304]).slice(1),
          ...B([191, 304], [169, 294], [141, 294], [119, 304]).slice(1),
        ]
        hatch(hp, hat, 1500, true)
        ink(hp, hat, { w: 2.6, t: 0 })
        text(st(top, 'h2', '--dl:1800ms'), 155, 262, '1,68 m', { anchor: 'middle', d: 1500 })
        text(st(top, 'f2', '--dl:2300ms'), 155, 262, '1,57 m', { anchor: 'middle', fade: false })
        text(g, 155, 675, 'Napoleon', { cls: 's', anchor: 'middle', d: 900 })
        const avg = st(g, 'x1', '--dl:200ms')
        hatch(avg, RR(222, 320, 70, 330, 6), 0, true)
        ink(avg, RR(222, 320, 70, 330, 6), { w: 2.8, t: 0 })
        text(avg, 257, 308, '1,65 m', { anchor: 'middle', fade: false })
        text(avg, 257, 675, 'Ø Franzose', { cls: 's', anchor: 'middle', fade: false })
      },
      rulers(g) {
        const u1 = 54.2
        const u2 = 50.8
        const x0 = 30
        for (const [y, u, lab, d] of [[330, u1, '1 pouce (französischer Zoll) = 2,71 cm', 0], [440, u2, '1 inch (englischer Zoll) = 2,54 cm', 700]] as const) {
          text(g, x0, y - 36, lab, { cls: 's', d })
          ink(g, L([x0, y], [x0 + 5 * u, y]), { w: 3, d: d + 100, t: 600 })
          for (let k = 0; k <= 10; k++) ink(g, L([x0 + (k * u) / 2, y], [x0 + (k * u) / 2, y - (k % 2 ? 9 : 18)]), { w: 2, d: d + 200 + k * 50, t: 90 })
          for (let k = 1; k <= 4; k++) text(g, x0 + k * u, y + 20, String(k), { cls: 's', anchor: 'middle', d: d + 300 + k * 60 })
        }
        const xa = x0 + 5 * u2
        const xb = x0 + 5 * u1
        hatch(g, [[xa, 300], [xb, 300], [xb, 446], [xa, 446]], 1700, true)
        dashes(g, L([xb, 296], [xb, 452]), { w: 2, d: 1500 })
        dashes(g, L([xa, 296], [xa, 452]), { w: 2, d: 1500 })
        arrow(g, B([250, 520], [262, 500], [282, 486], [292, 466]), { w: 2.4, d: 2000, t: 400, head: 9 })
        text(g, 120, 540, 'nach 5 Zoll: fast 1 cm', { cls: 's', d: 2100 })
      },
      galons(g) {
        for (const [i, d] of [[0, 400], [1, 650]]) {
          const y = 586 + i * 26
          const p: P[] = [[262, y + 30], [322, y - 10], [334, y + 4], [274, y + 44], [262, y + 30]]
          hatch(g, p, d + 250, true)
          ink(g, p, { w: 2.6, d, t: 400 })
        }
      },
    },
    scenes: [
      { t: HOOK(508), pics: { p: { img: 0, x: 16, y: 56, w: 328, h: 430, enter: 'blot', cam: [50, 22, 1.2], cam2: [50, 20, 1.3] } } },
      { t: T('Napoleon Bonaparte: 1769 auf Korsika geboren, 1804 Kaiser der Franzosen, 1821 in der Verbannung gestorben.', 64), gfx: { leben: {} } },
      {
        t: T('In Erinnerung blieb der kleine Mann mit dem großen Ego. Es gibt sogar einen Begriff dafür: den **Napoleon-Komplex**.', 64),
        pics: { p: { img: 0, x: 100, y: 250, w: 160, h: 200, r: 'oval', enter: 'fade', cam: [48, 14, 1.5] } },
      },
      { t: { text: 'Napoleon maß bei seinem Tod rund **1,68 Meter**.', x: 130, y: 80, w: 212 }, pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } }, gfx: { heights: {} } },
      {
        t: { text: 'Sein Arzt notierte 1821 auf St. Helena: _5 pieds 2 pouces_.', x: 130, y: 80, w: 212 },
        pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } },
        gfx: { f0: { draw: 'formel', args: [['5 Fuß', '+', '2 Zoll'], 360, 'fünf Fuß, zwei Zoll'] } },
      },
      { t: { text: 'Für einen Franzosen um 1800 war das **Durchschnitt**.', x: 130, y: 80, w: 212 }, pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } }, gfx: { heights: { cls: 'a1' } } },
      { t: { text: 'Rekruten jener Zeit waren im Schnitt etwa **1,65 Meter** groß – er sogar etwas mehr.', x: 130, y: 70, w: 212, kind: 'mid' }, pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } }, gfx: { heights: { cls: 'a1' } } },
      {
        t: T('Gemessen wurde aber in **französischen Zoll** – und die waren länger als englische.', 548),
        pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } },
        gfx: { rulers: { from: { tf: [1, 60, 0], o: 0 } } },
      },
      { t: T('Französisch gerechnet ergibt das rund **1,68 Meter**:', 64), gfx: { f1: { draw: 'formel', args: [['5 Fuß', '×', '32,5 cm', '+', '2 Zoll', '×', '2,7 cm', '≈', '1,68 m'], 300, 'französische Maße'] } } },
      { t: T('Liest man dieselben Zahlen in englischen Maßen, schrumpft er auf **1,57 Meter**:', 64), gfx: { f2: { draw: 'formel', args: [['5 Fuß', '×', '30,5 cm', '+', '2 Zoll', '×', '2,5 cm', '≈', '1,57 m'], 300, 'englische Maße'] } } },
      {
        t: { text: 'So wurde aus dem Durchschnittsmann ein **Zwerg** – zumindest auf dem Papier.', x: 130, y: 70, w: 212 },
        pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } },
        gfx: { heights: { cls: 'a1 a2' } },
      },
      { t: T('Dazu kam seine Garde: Die Grenadiere wurden nach **Körpergröße** ausgewählt – mit hohen Bärenfellmützen. Daneben wirkte er klein.', 64), gfx: { garde: {} } },
      {
        t: { text: 'Den Rest erledigte **Propaganda**: Der Brite James Gillray zeichnete ihn als winzigen „Little Boney“.', x: 18, y: 500, w: 324, card: true },
        pics: {
          p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', o: 0 },
          g: { img: 1, x: 0, y: 0, w: 360, h: 680, r: 0, enter: 'blot', cam: [50, 50, 1.02], cam2: [24, 44, 1.5] },
        },
      },
      {
        t: { text: 'Hier, 1803, hält der englische König Georg III. den Mini-Napoleon auf der Hand – und mustert ihn durchs **Fernglas**.', x: 18, y: 496, w: 324, card: true },
        pics: { g: { img: 1, x: 0, y: 0, w: 360, h: 680, r: 0, cam: [58, 40, 1.6], cam2: [55, 40, 1.8] } },
      },
      {
        t: { text: 'Seine Soldaten nannten ihn liebevoll _le petit caporal_ – den kleinen Korporal. Nach einer Schlacht 1796, so heißt es.', x: 20, y: 496, w: 236, kind: 'mid' },
        pics: { g: { img: 1, x: 16, y: 56, w: 328, h: 420, cam: [23, 44, 2.6], cam2: [23, 44, 2.9] } },
        gfx: { galons: {} },
      },
      {
        t: T('Sich selbst ließ er ganz anders malen: auf einem **steigenden Hengst** über die Alpen.', 560),
        pics: {
          g: { img: 1, x: -360, y: 56, w: 328, h: 420, o: 0 },
          a: { img: 2, x: 16, y: 56, w: 328, h: 470, from: { x: 380 }, cam: [50, 40, 1.03], cam2: [48, 30, 1.18], cap: 'Jacques-Louis David, 1801' },
        },
      },
      {
        t: T('Modell gesessen hat er dafür nicht. Ähnlichkeit sei egal, soll er gesagt haben – es zähle die **Ausstrahlung**.', 500),
        pics: { a: { img: 2, x: 16, y: 56, w: 328, h: 420, cam: [56, 20, 2.4], cam2: [56, 20, 2.7] } },
      },
      {
        t: T('Unten in den Fels ließ David drei Namen meißeln: Bonaparte, Hannibal, **Karl der Große**.', 500),
        pics: { a: { img: 2, x: 16, y: 56, w: 328, h: 420, cam: [20, 92, 2.6], cam2: [18, 92, 2.9] } },
      },
      {
        t: T('In Wirklichkeit kam er auf einem **Maultier** über den Pass – geführt von einem Bergbauern.', 560),
        pics: {
          a: { img: 2, x: 16, y: 56, w: 328, h: 470, cam: [48, 30, 1.18] },
          d: { img: 3, x: 16, y: 56, w: 328, h: 470, enter: 'wipe', z: 2, cam: [45, 40, 1.05], cam2: [42, 28, 1.25], cap: 'Paul Delaroche, 1850' },
        },
      },
      {
        t: T('Paul Delaroche malte ihn fast 50 Jahre später so: erschöpft, im grauen Mantel, ganz ohne **Heldenpose**.', 500),
        pics: { d: { img: 3, x: 16, y: 56, w: 328, h: 420, cam: [40, 18, 2.2], cam2: [40, 18, 2.5] } },
      },
      recap(
        [{ gfx: 'heights', cls: 'a1' }, { gfx: 'rulers' }, { pic: 1, id: 'g', cam: [24, 44, 1.5] }, { pic: 3, id: 'd', cam: [42, 30, 1.2] }],
        ['1,68 m: Durchschnitt', 'französische Zoll', 'Karikatur: klein', 'Wirklichkeit: Maultier'],
      ),
    ],
    summary: ['Rund 1,68 m: Durchschnitt für seine Zeit.', 'Französische Zoll waren länger als englische.', 'Karikaturen machten ihn klein, Gemälde groß.'],
    sources: ['Encyclopaedia Britannica: Napoleon I', 'British Museum: Gillray, The Plumb-pudding in danger (1805)'],
  },
  {
    id: 'flache-erde',
    area: 'GESCH',
    day: 31,
    hook: 'Hielt man im Mittelalter die Erde für eine Scheibe?',
    mood: 'raetsel',
    ambience: 'weltraum',
    images: [img('blaue-murmel'), img('flammarion')],
    draw: {
      schatten(g) {
        ink(g, E(50, 400, 34), { w: 3, t: 500 })
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2
          ink(g, L([50 + Math.cos(a) * 42, 400 + Math.sin(a) * 42], [50 + Math.cos(a) * 54, 400 + Math.sin(a) * 54]), { w: 2, d: 300 + k * 40, t: 100 })
        }
        text(g, 50, 480, 'Sonne', { anchor: 'middle', cls: 's', d: 400 })
        hatch(g, E(170, 400, 40), 800, true)
        ink(g, E(170, 400, 40), { w: 3, d: 500, t: 500 })
        text(g, 170, 480, 'Erde', { anchor: 'middle', cls: 's', d: 700 })
        hatch(g, [[170, 360], [300, 370], [300, 430], [170, 440]], 1000)
        ink(g, E(300, 400, 34), { w: 3, d: 900, t: 500 })
        const sh = group(g)
        hatch(sh, [...E(300, 400, 33, 33, 100, 260), ...E(330, 400, 40, 40, 235, 125).slice(1)], 1500, true)
        ink(sh, E(330, 400, 40, 40, 225, 135), { w: 2.2, d: 1500, t: 400 })
        text(g, 300, 480, 'Mond', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 240, 330, 'runder Schatten', { anchor: 'middle', d: 1900 })
      },
      gelehrte(g) {
        const at = (y: number) => (y + 300) / 1800
        timeline(g, 30, 330, 430, [
          { at: at(-240), label: '240 v. Chr.', sub: 'Eratosthenes', up: true },
          { at: at(725), label: '725', sub: 'Beda' },
          { at: at(1260), label: '1260', sub: 'Thomas v. Aquin', up: true },
          { at: at(1492), label: '1492', sub: 'Kolumbus', big: true },
        ], 0, 400)
      },
      buch(g) {
        ink(g, RR(80, 250, 200, 280, 8), { w: 3.2, t: 700 })
        hatch(g, RR(80, 250, 22, 280, 8), 500, true)
        text(g, 190, 300, 'De sphaera', { anchor: 'middle', size: 24, cls: 'it', d: 600 })
        ink(g, E(190, 410, 70), { w: 3, d: 800, t: 700 })
        ink(g, E(190, 410, 70, 16, 0, 180), { w: 2, d: 1200, t: 400 })
        ink(g, E(190, 410, 28, 70, -90, 270), { w: 2, d: 1300, t: 500 })
        text(g, 180, 580, '„Über die Kugel“, um 1230', { anchor: 'middle', d: 1500 })
      },
      kontinente(g) {
        const am: P[] = [...B([40, 260], [100, 250], [110, 340], [90, 400]), ...B([90, 400], [120, 460], [100, 560], [70, 600]), ...B([70, 600], [40, 520], [30, 400], [40, 260])]
        hatch(g, am, 600)
        ink(g, am, { w: 3, t: 800 })
        const eu: P[] = [...B([300, 250], [340, 270], [340, 360], [320, 400]), ...B([320, 400], [350, 460], [330, 560], [300, 600]), ...B([300, 600], [280, 500], [270, 400], [300, 250])]
        hatch(g, eu, 800)
        ink(g, eu, { w: 3, d: 300, t: 800 })
        arrow(g, B([290, 420], [230, 380], [170, 400], [118, 420]), { w: 3, d: 1200, t: 900 })
        text(g, 70, 640, 'Amerika', { anchor: 'middle', d: 1000 })
        text(g, 310, 640, 'Europa', { anchor: 'middle', d: 1000 })
        text(g, 200, 350, '1492', { anchor: 'middle', d: 1800, size: 20 })
      },
      schiff(g) {
        const sea = E(180, 1100, 700, 700, 235, 305)
        hatch(g, [...sea, [520, 700], [-160, 700]], 500)
        ink(g, sea, { w: 3, t: 800 })
        const id = `sea${Math.random().toString(36).slice(2, 8)}`
        const m = mk('mask', { id, maskUnits: 'userSpaceOnUse', x: -100, y: 0, width: 560, height: 700 }, g)
        mk('rect', { x: -100, y: 0, width: 560, height: 700, fill: '#fff' }, m)
        mk('circle', { cx: 180, cy: 1100, r: 702, fill: '#000' }, m)
        const clip = mk('g', { mask: `url(#${id})` }, g)
        const ship = st(clip, 'm1', '--m1: translate(150px, 34px) rotate(10deg); transform-origin: 110px 400px; --dl: 500ms; transition-duration: 3.2s')
        ink(ship, B([80, 398], [88, 414], [132, 414], [140, 398]), { w: 3, d: 300, t: 400 })
        ink(ship, L([76, 398], [144, 398]), { w: 2.6, d: 300, t: 300 })
        ink(ship, L([110, 398], [110, 326]), { w: 3, d: 500, t: 300 })
        const sail: P[] = [[113, 332], [142, 366], [113, 382], [113, 332]]
        hatch(ship, sail, 800, true)
        ink(ship, sail, { w: 2.4, d: 600, t: 300 })
        text(g, 180, 470, 'Rumpf zuerst hinter dem Horizont', { anchor: 'middle', cls: 's', d: 2600 })
      },
      erato(g) {
        const cx = 180
        const cy = 560
        const r = 190
        ink(g, E(cx, cy, r, r, 190, 350), { w: 3.4, t: 900 })
        hatch(g, [...E(cx, cy, r, r, 190, 350), [cx + r, 680], [cx - r, 680]], 600)
        const a = (-110 * Math.PI) / 180
        const s1: P = [cx, cy - r]
        const s2: P = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
        ink(g, L(s1, [cx, cy - r - 34]), { w: 4, d: 500, t: 300 })
        ink(g, L(s2, [s2[0] + Math.cos(a) * 34, s2[1] + Math.sin(a) * 34]), { w: 4, d: 600, t: 300 })
        const tip: P = [s2[0] + Math.cos(a) * 34, s2[1] + Math.sin(a) * 34]
        arrow(g, L([cx, 250], [cx, cy - r - 38]), { w: 1.8, d: 900, t: 400, head: 8 })
        arrow(g, L([tip[0], 250], [tip[0], tip[1] - 2]), { w: 1.8, d: 1000, t: 400, head: 8 })
        arrow(g, L([250, 250], [250, 330]), { w: 1.8, d: 1100, t: 400, head: 8 })
        text(g, 300, 262, 'Sonne', { cls: 's', d: 900 })
        dashes(g, L([cx, cy], s1), { w: 2, d: 1500 })
        dashes(g, L([cx, cy], s2), { w: 2, d: 1500 })
        ink(g, E(cx, cy, 60, 60, -110, -90), { w: 2.6, d: 2000, t: 300 })
        text(g, cx - 22, cy - 72, '7,2°', { anchor: 'end', d: 2200, size: 18 })
        text(g, cx + 8, cy - r - 44, 'Syene', { cls: 's', d: 700 })
        text(g, s2[0] - 16, s2[1] - 44, 'Alexandria', { cls: 's', anchor: 'end', d: 800 })
        text(g, cx, 668, 'Umfang ≈ 40.000 km', { anchor: 'middle', d: 2600, size: 20, cls: 'halo' })
      },
      apfel(g) {
        hatch(g, E(180, 380, 86), 500)
        ink(g, E(180, 380, 86), { w: 3.6, t: 800 })
        ink(g, E(180, 380, 86, 18, 0, 180), { w: 3, d: 500, t: 400 })
        ink(g, B([180, 294], [196, 340], [196, 420], [180, 466]), { w: 3, d: 600, t: 400 })
        ink(g, L([180, 294], [180, 236]), { w: 5, d: 900, t: 300 })
        ink(g, L([156, 258], [204, 258]), { w: 5, d: 1100, t: 300 })
      },
      route(g) {
        hbars(g, [
          { label: 'Kanaren → Japan, laut Kolumbus', v: 4400, fmt: (v) => `${tsd(Math.round(v / 100) * 100)} km` },
          { label: 'Kanaren → Japan, tatsächlich', v: 19600, fmt: (v) => `${tsd(Math.round(v / 100) * 100)} km`, dense: true },
        ], { y: 290, gap: 120 })
      },
    },
    scenes: [
      { t: HOOK(66), pics: { e: { img: 0, x: 50, y: 230, w: 260, h: 260, r: 'oval', enter: 'blot', cam: [50, 50, 1.02], cam2: [50, 50, 1.08] } } },
      {
        t: { text: 'Nein – Gebildete wussten seit der Antike: Die Erde ist eine **Kugel**.', x: 20, y: 64, w: 214 },
        pics: { e: { img: 0, x: 248, y: 64, w: 96, h: 96, r: 'oval', cam: [50, 50, 1.02] } },
        gfx: { schiff: {} },
      },
      {
        t: { text: 'Ein Beleg: Schiffe verschwinden am Horizont zuerst mit dem **Rumpf** – zuletzt mit der Mastspitze.', x: 20, y: 64, w: 214 },
        pics: { e: { img: 0, x: 248, y: 64, w: 96, h: 96, r: 'oval', cam: [50, 50, 1.02] } },
        gfx: { schiff: { cls: 'a1' } },
      },
      { t: T('Aristoteles nannte um 350 v. Chr. einen zweiten: Bei einer Mondfinsternis wirft die Erde einen **runden Schatten** auf den Mond.', 64), gfx: { schatten: {} } },
      { t: T('Dazu ein dritter: Wer nach Süden reist, sieht **neue Sterne** auftauchen. Auch das geht nur auf einer Kugel.', 64), gfx: { punkte: { args: [['Schiffe sinken hinter den Horizont', 'runder Erdschatten auf dem Mond', 'neue Sterne im Süden'], 320] } } },
      { t: T('Eratosthenes berechnete um 240 v. Chr. sogar ihren **Umfang** – aus Schatten und einem Winkel.', 64), gfx: { erato: {} } },
      { t: T('Mittags fiel in Syene kein Schatten. In Alexandria warf ein Stab zur selben Zeit einen: Winkel **7,2 Grad**.', 64), gfx: { erato: {} } },
      { t: T('Warum verrät der Schatten den Winkel? Die Sonne ist so weit weg, dass ihre Strahlen **parallel** ankommen – in Syene wie in Alexandria.', 64), gfx: { erato: {} } },
      { t: T('Eine Linie, die zwei Parallelen kreuzt, bildet an beiden **denselben Winkel**. So taucht der Schattenwinkel genau im Erdmittelpunkt wieder auf.', 64), gfx: { erato: {} } },
      { t: T('7,2 Grad sind ein Fünfzigstel des Kreises. Die Erde ist also fünfzigmal so groß wie der Abstand der Städte:', 64), gfx: { f1: { draw: 'formel', args: [['Umfang', '=', '360 Grad ÷ 7,2 Grad', '×', 'Abstand der Städte'], 320] } } },
      { t: T('Mit rund 800 Kilometern Abstand ergibt das etwa **40.000 Kilometer** – fast genau der heutige Wert.', 64), gfx: { f2: { draw: 'formel', args: [['50', '×', 'rund 800 km', '≈', '40.000 km'], 330] } } },
      { t: T('Könige hielten im Mittelalter den **Reichsapfel**: eine Kugel als Zeichen der Welt.', 520), gfx: { apfel: {} } },
      { t: T('Gelehrte wie Beda oder Thomas von Aquin schrieben ganz selbstverständlich von der **Kugel**.', 64), gfx: { gelehrte: {} } },
      {
        t: T('Der Mythos entstand erst im **19. Jahrhundert**. Auch dieser „mittelalterliche“ Holzstich stammt von 1888.', 480),
        pics: { f: { img: 1, x: 16, y: 56, w: 328, h: 396, enter: 'blot', cam: [50, 50, 1.0], cam2: [34, 40, 1.35], cap: 'Holzstich aus Flammarion, 1888' } },
      },
      {
        t: T('Washington Irving schmückte 1828 die **Kolumbus**-Geschichte aus – als hätte er gegen Flacherde-Gläubige gekämpft.', 330),
        pics: { f: { img: 1, x: 90, y: 60, w: 180, h: 220, cam: [34, 40, 1.35] } },
      },
      { t: T('Streitschriften jener Zeit malten das Mittelalter als **finster** und wissenschaftsfeindlich. Die Quellen zeigen etwas anderes.', 64), gfx: { vergleich: { args: [['Mythos', 'finsteres Mittelalter', 'Erde als Scheibe'], ['Quellen', 'Gelehrte an Universitäten', 'Erde als Kugel'], 290] } } },
      { t: T('Gestritten wurde 1492 über die **Größe** der Erde – und da lag Kolumbus falsch.', 64), gfx: { route: {} } },
      { t: T('Er hätte verhungern müssen. Ihn rettete ein Kontinent, mit dem niemand gerechnet hatte: **Amerika**.', 64), gfx: { kontinente: {} } },
      recap(
        [{ gfx: 'schiff', cls: 'a1' }, { gfx: 'erato' }, { gfx: 'apfel' }, { pic: 1, id: 'f', cam: [34, 40, 1.3] }],
        ['Schiffe hinter dem Horizont', 'Eratosthenes: 40.000 km', 'Reichsapfel = Kugel', 'Mythos aus dem 19. Jh.'],
      ),
    ],
    summary: ['Kugelgestalt seit der Antike bekannt.', 'Reichsapfel = Welt als Kugel.', 'Kolumbus irrte bei der Größe, nicht bei der Form.'],
    sources: ['Russell 1991, Inventing the Flat Earth', 'Morison 1942, Admiral of the Ocean Sea'],
  },
  {
    id: 'pyramiden',
    area: 'GESCH',
    day: 18,
    hook: 'Bauten Sklaven die Pyramiden?',
    mood: 'raetsel',
    ambience: 'wind',
    images: [img('gizeh')],
    draw: {
      boot(g) {
        for (let k = 0; k < 3; k++) ink(g, B([10, 520 + k * 22], [100, 506 + k * 22], [220, 534 + k * 22], [350, 518 + k * 22]), { w: 2, d: k * 150, t: 700 })
        const b = group(g)
        const hull: P[] = [[60, 470], [300, 470], [270, 510], [90, 510], [60, 470]]
        hatch(b, hull, 700)
        ink(b, hull, { w: 3, d: 400, t: 600 })
        for (let k = 0; k < 4; k++) {
          ink(b, RR(100 + k * 42, 430, 36, 38, 3), { w: 2.4, d: 800 + k * 150, t: 300 })
          hatch(b, RR(100 + k * 42, 430, 36, 38, 3), 1000 + k * 150, true)
        }
        ink(b, L([280, 470], [280, 330]), { w: 3, d: 900, t: 300 })
        const sail: P[] = [[284, 340], [330, 420], [284, 430], [284, 340]]
        hatch(b, sail, 1300, true)
        ink(b, sail, { w: 2.4, d: 1100, t: 300 })
        b.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(6px)' }], { duration: 1800, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        text(g, 180, 620, 'Kalkstein für die Verkleidung', { anchor: 'middle', d: 1600 })
      },
      pyramide(g) {
        const rows = 8
        for (let i = 0; i < rows; i++) {
          const y0 = 560 - i * 32
          const y1 = y0 - 32
          const half0 = 116 - i * 14.5
          const half1 = 116 - (i + 1) * 14.5
          const d = 200 + i * 160
          ink(g, L([180 - half1, y1], [180 + half1, y1]), { w: 2.2, d, t: 300 })
          ink(g, L([180 - half0, y0], [180 - half1, y1]), { w: 2.8, d, t: 200 })
          ink(g, L([180 + half0, y0], [180 + half1, y1]), { w: 2.8, d, t: 200 })
          for (let x = 180 - half0 + 20 + (i % 2) * 14; x < 180 + half0 - 14; x += 28) ink(g, L([x, y0], [x, y1 + 2]), { w: 1.4, d: d + 150, t: 80 })
        }
        ink(g, L([10, 562], [350, 562]), { w: 3, t: 600 })
        for (const [x0, d0] of [[14, 1700], [294, 2100]] as const) {
          ink(g, RR(x0, 524, 34, 28, 3), { w: 2.6, d: d0, t: 300 })
          hatch(g, RR(x0, 524, 34, 28, 3), d0 + 200, true)
        }
        for (let k = 0; k < 2; k++) fig(pop(g, 1900 + k * 120), 54 + k * 12, 560, 0.75, { arms: 'push' })
        for (let k = 0; k < 2; k++) fig(pop(g, 2300 + k * 120), 334 + k * 12, 560, 0.75, { arms: 'cross' })
      },
      stadt(g) {
        ink(g, L([10, 562], [350, 562]), { w: 3, t: 500 })
        for (let i = 0; i < 3; i++) {
          const x = 24 + i * 58
          ink(g, RR(x, 492, 48, 70, 3), { w: 2.6, d: 200 + i * 150, t: 400 })
          ink(g, L([x - 4, 492], [x + 52, 492]), { w: 3, d: 300 + i * 150, t: 200 })
          ink(g, RR(x + 17, 532, 14, 30, 2), { w: 2, d: 500 + i * 150, t: 200 })
        }
        text(g, 96, 594, 'Unterkünfte', { anchor: 'middle', cls: 's', d: 700 })
        const oven = B([210, 562], [210, 486], [280, 486], [280, 562])
        hatch(g, [...oven], 900, true)
        ink(g, oven, { w: 3, d: 700, t: 500 })
        blank(g, RR(232, 536, 26, 26, 8))
        ink(g, RR(232, 536, 26, 26, 8), { w: 2.2, d: 900, t: 300 })
        for (let k = 0; k < 2; k++) ink(st(g, 'float', `--d:${k * 500}ms`), B([238 + k * 14, 486], [228 + k * 14, 466], [252 + k * 14, 452], [242 + k * 14, 430]), { w: 2, d: 1100 + k * 200, t: 400 })
        text(g, 245, 594, 'Bäckerei', { anchor: 'middle', cls: 's', d: 1000 })
        for (let k = 0; k < 2; k++) {
          const x = 304 + k * 24
          const jug = [...B([x - 8, 520], [x - 18, 540], [x - 10, 562], [x, 562]), ...B([x, 562], [x + 10, 562], [x + 18, 540], [x + 8, 520]).slice(1)]
          ink(g, jug, { w: 2.4, d: 1200 + k * 150, t: 400 })
        }
        text(g, 316, 594, 'Bier', { anchor: 'middle', cls: 's', d: 1300 })
        const gr = st(g, 'x1', '--dl:200ms')
        for (let k = 0; k < 4; k++) {
          const x = 30 + k * 80
          const m: P[] = [[x, 662], [x + 8, 630], [x + 52, 630], [x + 60, 662], [x, 662]]
          hatch(gr, m, 0, true)
          ink(gr, m, { w: 2.4, t: 0 })
        }
        text(gr, 180, 620, 'Gräber der Arbeiter', { anchor: 'middle', fade: false })
      },
      knochen(g) {
        const bone = group(g, '', 'transform: rotate(-24deg); transform-origin: 180px 380px')
        const end = (x: number, s: number) => {
          ink(bone, E(x, 362, 22), { w: 3, t: 400 })
          ink(bone, E(x, 398, 22), { w: 3, d: 100, t: 400 })
          blank(bone, RR(x - s * 4 - (s > 0 ? 18 : 0), 366, 22, 28, 2))
        }
        ink(bone, L([100, 368], [260, 368]), { w: 3, d: 300, t: 500 })
        ink(bone, L([100, 392], [260, 392]), { w: 3, d: 300, t: 500 })
        end(84, 1)
        end(276, -1)
        hatch(bone, E(186, 380, 16, 22), 900, true)
        ink(bone, E(186, 380, 16, 22), { w: 2.6, d: 800, t: 400 })
        arrow(g, B([250, 520], [230, 500], [205, 470], [194, 420]), { w: 2.6, d: 1200, t: 400 })
        text(g, 252, 546, 'verheilter Bruch', { anchor: 'middle', d: 1400 })
      },
      wechsel(g) {
        ink(g, L([10, 520], [350, 520]), { w: 3, t: 500 })
        const pyr: P[] = [[30, 520], [95, 420], [160, 520]]
        hatch(g, pyr, 400)
        ink(g, pyr, { w: 3, d: 100, t: 600 })
        for (let k = 0; k < 6; k++) {
          const x = 220 + k * 20
          ink(g, L([x, 520], [x + 2, 470]), { w: 2, d: 300 + k * 60, t: 200 })
          for (let j = 0; j < 3; j++) ink(g, E(x + 2 + (j % 2 ? 4 : -4), 474 + j * 8, 3, 6), { w: 1.6, d: 500 + k * 60, t: 150 })
        }
        text(g, 95, 556, 'Bau', { anchor: 'middle', d: 700 })
        text(g, 270, 556, 'Feld', { anchor: 'middle', d: 700 })
        arrow(g, B([110, 400], [150, 330], [220, 330], [262, 430]), { w: 2.8, d: 1000, t: 600 })
        arrow(g, B([262, 600], [220, 650], [140, 650], [100, 580]), { w: 2.8, d: 1400, t: 600 })
        for (let k = 0; k < 3; k++) fig(pop(g, 1600 + k * 100), 170 + k * 14, 380, 0.7)
        for (let k = 0; k < 3; k++) fig(pop(g, 1900 + k * 100), 160 + k * 14, 660, 0.7)
      },
    },
    scenes: [
      { t: HOOK(484), pics: { p: { img: 0, x: 16, y: 56, w: 328, h: 410, enter: 'blot', cam: [50, 55, 1.1], cam2: [45, 50, 1.25] } } },
      { t: T('So zeigen es Filme: Peitschen, Ketten, Tausende **Sklaven**. Die Archäologie erzählt etwas anderes.', 64), gfx: { pyramide: {} } },
      { t: T('Die Cheops-Pyramide entstand um 2560 v. Chr. – fast 4.000 Jahre lang war sie das **höchste Bauwerk** der Welt.', 64), gfx: { zahl: { args: ['146 m', 'ursprüngliche Höhe', 420] } } },
      { t: T('Verbaut wurden rund **2,3 Millionen** Steinblöcke, im Schnitt etwa zweieinhalb Tonnen schwer.', 64), gfx: { z2: { draw: 'zahl', args: ['2,3 Mio.', 'Steinblöcke', 420] } } },
      { t: T('Bei rund 20 Jahren Bauzeit heißt das:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['2,3 Millionen Blöcke', '÷', '20 Jahre', '÷', '365 Tage', '≈', '315 Blöcke pro Tag'], 300] } } },
      { t: T('Bei zehn Stunden Arbeit am Tag: etwa **alle zwei Minuten** ein Block – geschnitten, gezogen, gesetzt.', 64), gfx: { f2: { draw: 'formel', args: [['10 Stunden', '÷', '315 Blöcke', '≈', '2 Minuten pro Block'], 330] } } },
      { t: T('Die Sklaven-Idee ist alt: Herodot schrieb um 450 v. Chr. von 100.000 schuftenden Männern – **2.000 Jahre** nach dem Bau.', 64), gfx: { pyramide: { tf: [0.7, 54, 140] } } },
      { t: T('Bei Gizeh fand man die **Arbeiterstadt**: Bäckereien, Brauereien, Unterkünfte.', 64), gfx: { pyramide: { tf: [0.5, 170, 170] }, stadt: { tf: [1, 0, -20] } } },
      { t: T('Und Gräber der Arbeiter direkt neben den Pyramiden. Sklaven hätte man nie so **ehrenvoll** bestattet.', 64), gfx: { pyramide: { tf: [0.5, 170, 170] }, stadt: { cls: 'a1', tf: [1, 0, -20] } } },
      { t: T('Arbeitstrupps gaben sich stolze Namen – zu lesen als Inschriften in den Steinen:', 64), gfx: { punkte: { args: [['„Freunde des Cheops“', '„Trunkenbolde des Mykerinos“'], 340] } } },
      { t: T('Die Knochen zeigen schwere Arbeit – aber auch **Medizin**: verheilte Brüche, sogar Amputationen.', 64), gfx: { knochen: {} } },
      { t: T('Verpflegt wurde gut: Tierknochen zeigen, dass jeden Tag Rinder, Schafe und Ziegen **geschlachtet** wurden.', 64), gfx: { p2: { draw: 'punkte', args: [['Brot aus eigenen Bäckereien', 'Bier als Grundnahrung', 'Fleisch von Rind, Schaf, Ziege'], 320] } } },
      { t: T('Viele waren **Bauern**, die abwechselnd Dienst taten – oft dann, wenn der Nil die Felder überflutete.', 64), gfx: { wechsel: {} } },
      { t: T('Gleichzeitig arbeiteten wohl rund **20.000** Menschen: ein fester Kern von Fachleuten und wechselnde Helfer.', 64), gfx: { z3: { draw: 'zahl', args: ['20.000', 'Arbeiter gleichzeitig', 420] } } },
      { t: T('2013 fand man das Tagebuch des Beamten Merer: Er brachte Kalkstein mit Booten über den **Nil** nach Gizeh.', 64), gfx: { boot: {} } },
      { t: T('Harte Arbeit war es trotzdem – aber organisiert vom Staat, mit **Lohn** in Brot und Bier.', 64), gfx: { vergleich: { args: [['Filmbild', 'Sklaven', 'Peitschen', 'Ketten'], ['Funde', 'Arbeitertrupps', 'Ärzte', 'Brot und Bier'], 290] } } },
      { t: T('Heute ist sie nur noch rund 139 Meter hoch – die glatte Verkleidung wurde im Mittelalter als **Baumaterial** abgetragen.', 64), gfx: { pyramide: { tf: [0.8, 36, 100] } } },
      recap(
        [{ gfx: 'pyramide' }, { gfx: 'stadt', cls: 'a1' }, { gfx: 'knochen' }, { gfx: 'wechsel' }],
        ['2,3 Mio. Blöcke', 'Arbeiterstadt + Gräber', 'medizinisch versorgt', 'Bauern im Wechsel'],
      ),
    ],
    summary: ['Arbeiterstadt und Gräber neben den Pyramiden.', 'Brot, Bier, Fleisch und medizinische Versorgung.', 'Viele Bauern arbeiteten im Wechsel.'],
    sources: ['Lehner & Hawass 2017, Giza and the Pyramids', 'AERA: Lost City of the Pyramid Builders'],
  },
  {
    id: 'erlaubt',
    area: 'POL',
    day: 15,
    hook: 'Ist in Deutschland alles verboten, was nicht erlaubt ist?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [img('reiten-wald')],
    draw: {
      para(g) {
        bigText(g, 180, 560, '§', { size: 320, d: 200 })
      },
      du(g) {
        ink(g, E(180, 400, 140), { w: 3.6, t: 900 })
        text(g, 180, 240, 'Du', { anchor: 'middle', cls: 'b', d: 400 })
        text(g, 180, 410, 'erlaubt', { anchor: 'middle', size: 30, d: 700 })
        const isl: [number, number, number][] = [[112, 330, 20], [246, 466, 24], [130, 480, 16]]
        isl.forEach(([x, y, r], i) => {
          const p = st(g, 'x1', `--o:50% 50%;--dl:${200 + i * 250}ms`)
          hatch(p, E(x, y, r), 0, true)
          ink(p, E(x, y, r), { w: 2.6, t: 0 })
        })
        const lab = st(g, 'f1', '--dl:1000ms')
        arrow(lab, B([300, 560], [290, 530], [272, 506], [262, 490]), { w: 2.4, t: 0 })
        text(lab, 300, 584, 'verboten', { anchor: 'middle', fade: false })
      },
      staat(g) {
        hatch(g, RR(60, 260, 240, 280, 18), 500, true)
        ink(g, RR(60, 260, 240, 280, 18), { w: 3.6, t: 800 })
        text(g, 180, 240, 'Staat', { anchor: 'middle', cls: 'b', d: 400 })
        const win: [number, number][] = [[100, 300], [200, 380], [110, 450]]
        win.forEach(([x, y], i) => {
          const p = st(g, 'x1', `--o:50% 50%;--dl:${200 + i * 250}ms`)
          blank(p, RR(x, y, 64, 44, 8))
          ink(p, RR(x, y, 64, 44, 8), { w: 2.6, t: 0 })
          text(p, x + 32, y + 28, 'Gesetz', { anchor: 'middle', cls: 's', fade: false })
        })
      },
      hammer(g) {
        ink(g, RR(110, 470, 140, 26, 8), { w: 3, t: 500 })
        hatch(g, RR(110, 470, 140, 26, 8), 400, true)
        const h = group(g, '', 'transform-origin: 300px 420px')
        ink(h, L([300, 420], [200, 390]), { w: 5, d: 200, t: 400 })
        const head: P[] = [[176, 352], [222, 366], [206, 422], [160, 408], [176, 352]]
        hatch(h, head, 600, true)
        ink(h, head, { w: 3, d: 300, t: 400 })
        h.animate([{ transform: 'rotate(-28deg)' }, { transform: 'rotate(-28deg)', offset: 0.5 }, { transform: 'rotate(4deg)', offset: 0.8 }, { transform: 'rotate(0deg)' }], { duration: 1500, delay: 300, fill: 'backwards', easing: 'ease-in' })
        text(g, 180, 560, '1989', { anchor: 'middle', size: 34, d: 1300 })
      },
    },
    scenes: [
      { t: HOOK(66), gfx: { para: {} } },
      { t: T('Es ist umgekehrt. Artikel 2 des Grundgesetzes schützt die **allgemeine Handlungsfreiheit**.', 64), gfx: { du: {} } },
      { t: T('_„Jeder hat das Recht auf die freie Entfaltung seiner Persönlichkeit, soweit er nicht die Rechte anderer verletzt …“_', 200, { kind: 'mid' }), gfx: { para: { tf: [0.4, 108, 290] } } },
      { t: T('Du darfst alles tun, was **nicht verboten** ist.', 64), gfx: { du: { cls: 'a1' } } },
      { t: T('Für dich gilt also:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['erlaubt', '=', 'alles', '−', 'was ein Gesetz verbietet'], 320, 'für Bürgerinnen und Bürger'] } } },
      {
        t: T('Für den **Staat** gilt das Gegenteil: Eingreifen darf er nur, wenn ein Gesetz es erlaubt.', 64),
        gfx: { du: { cls: 'a1', tf: [0.62, -17, 132] }, staat: { tf: [0.62, 153, 132], from: { tf: [0.62, 233, 132], o: 0 } } },
      },
      { t: T('Juristen nennen das den _Vorbehalt des Gesetzes_.', 64), gfx: { du: { cls: 'a1', tf: [0.62, -17, 132] }, staat: { cls: 'a1', tf: [0.62, 153, 132] } } },
      { t: T('Ob Bußgeld, Hausdurchsuchung oder Steuer: Für jeden Eingriff braucht der Staat eine **Grundlage** in einem Gesetz.', 64), gfx: { punkte: { args: [['Bußgeld', 'Hausdurchsuchung', 'Steuer'], 320] } } },
      { t: T('Und das Gesetz muss selbst zur Verfassung passen – sonst kann es das **Bundesverfassungsgericht** kippen.', 64), gfx: { f2: { draw: 'formel', args: [['Eingriff', '→', 'Gesetz', '→', 'Grundgesetz'], 340, 'jede Stufe muss passen'] } } },
      {
        t: T('Wie weit deine Freiheit reicht, zeigt ein Urteil: Sogar **Reiten im Wald** gehört dazu.', 486),
        pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 45, 1.2] } },
      },
      {
        t: T('Ein Reiter aus Nordrhein-Westfalen hatte geklagt: Das Landesgesetz erlaubte Reiten im Wald nur auf **ausgewiesenen Wegen**.', 470),
        pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 390, cam: [50, 60, 1.4], cam2: [50, 60, 1.6] } },
      },
      {
        t: T('Das Gericht entschied 1989: Reiten ist geschützte Freiheit – die Einschränkung war aber erlaubt, zum Schutz von Wald und **Wanderern**.', 72),
        pics: { r: { img: 0, x: 16, y: 250, w: 160, h: 200, cam: [50, 45, 1.2] } },
        gfx: { hammer: { tf: [0.7, 140, 120] } },
      },
      { t: T('Seitdem heißt die Entscheidung _„Reiten im Walde“_. Auch das Füttern von **Tauben** prüfte das Gericht schon an Artikel 2.', 64), gfx: { zahl: { args: ['1989', 'Urteil „Reiten im Walde“', 420] } } },
      { t: T('Artikel 2 ist ein **Auffang-Grundrecht**: Es greift immer, wenn kein spezielleres passt.', 64), gfx: { vergleich: { args: [['speziell', 'Meinung: Artikel 5', 'Beruf: Artikel 12'], ['Auffang', 'alles andere: Artikel 2'], 290] } } },
      { t: T('Seine Grenze: die Rechte anderer. Deine Freiheit endet, wo die eines anderen **beginnt**.', 64), gfx: { du: { cls: 'a1' } } },
      { t: T('Und selbst mit Gesetz darf der Staat nur so weit eingreifen, wie nötig – **Verhältnismäßigkeit**:', 64), gfx: { f3: { draw: 'formel', args: [['geeignet', '+', 'erforderlich', '+', 'angemessen'], 330, 'jeder Eingriff muss sein'] } } },
      { t: T('Angewandt auf den Wald – Schritt eins: **Geeignet**? Schützen Reitwege Spaziergänger und Waldboden? Ja.', 64), gfx: { v1: { draw: 'formel', args: [['geeignet?', '→', 'schützt es Wanderer und Boden?', '→', 'ja'], 320] } } },
      { t: T('Schritt zwei: **Erforderlich**? Gibt es etwas Milderes, das genauso wirkt? Ein totales Reitverbot wäre zu viel – Wege reichen.', 64), gfx: { v2: { draw: 'formel', args: [['erforderlich?', '→', 'gibt es etwas Milderes?', '→', 'Wege statt Verbot'], 320] } } },
      { t: T('Schritt drei: **Angemessen**? Reiter verlieren etwas Freiheit, Wanderer gewinnen Sicherheit. Das Gericht wog ab: in Ordnung.', 64), gfx: { v3: { draw: 'formel', args: [['angemessen?', '→', 'Nutzen gegen Nachteil', '→', 'ausgewogen'], 320] } } },
      { t: T('Wer sich vom Staat in seinen Grundrechten verletzt fühlt, kann am Ende **Verfassungsbeschwerde** in Karlsruhe erheben – in der Regel kostenlos.', 64), gfx: { z3: { draw: 'zahl', args: ['0 €', 'Gebühr für eine Verfassungsbeschwerde (in der Regel)', 420] } } },
      recap(
        [{ gfx: 'para' }, { gfx: 'du', cls: 'a1' }, { gfx: 'staat', cls: 'a1' }, { pic: 0, id: 'r' }],
        ['Artikel 2 GG', 'Du: alles, was nicht verboten ist', 'Staat: nur mit Gesetz', '„Reiten im Walde“'],
      ),
    ],
    summary: ['Art. 2 GG: allgemeine Handlungsfreiheit.', 'Behörden brauchen eine gesetzliche Grundlage.', 'Urteil „Reiten im Walde“, 1989.'],
    sources: ['Grundgesetz Art. 2 Abs. 1, Art. 20 Abs. 3', 'BVerfGE 80, 137'],
  },
  {
    id: 'unwissenheit',
    area: 'POL',
    day: 75,
    hook: 'Schützt Unwissenheit vor Strafe?',
    mood: 'raetsel',
    images: [img('gerichtssaal')],
    draw: {
      waage(g) {
        balance(g, 0, 0, 0, 7)
      },
      baum(g) {
        ink(g, RR(70, 190, 220, 74, 14), { w: 3, t: 600 })
        text(g, 180, 222, 'Verbotsirrtum', { anchor: 'middle', cls: 'b', d: 300 })
        text(g, 180, 248, '§ 17 StGB', { anchor: 'middle', cls: 's', d: 400 })
        const br = st(g, 'f1', '--dl:200ms')
        for (const [s, lab, res] of [[-1, 'vermeidbar', 'Strafe, evtl. milder'], [1, 'unvermeidbar', 'straffrei']] as const) {
          const x = 180 + s * 88
          arrow(br, L([180 + s * 30, 266], [x, 352]), { w: 2.8, t: 0 })
          ink(br, RR(x - 78, 356, 156, 60, 12), { w: 2.8, t: 0 })
          text(br, x, 392, lab, { anchor: 'middle', fade: false, size: 17 })
          arrow(br, L([x, 420], [x, 476]), { w: 2.4, t: 0 })
          text(br, x, 506, res, { anchor: 'middle', fade: false, size: 16 })
        }
        const c = st(g, 'x2', '--o:50% 50%;--dl:300ms')
        check(c, 268, 548, 1.4)
        const k = st(g, 'x2', '--o:50% 50%;--dl:600ms')
        ring(k, 92, 498, 92, 26)
      },
      schirm(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        // Schirm: Griff oben bei (x + 3, base - 74), Spitze unten bei (x, base)
        const um = (gr: Element, x: number, base: number, d: number, dense = false) => {
          ink(gr, L([x, base], [x + 3, base - 74]), { w: 3, d, t: 300 })
          const canopy: P[] = [[x, base - 10], [x - 9, base - 48], [x + 2, base - 66], [x + 13, base - 48], [x + 6, base - 10], [x, base - 10]]
          hatch(gr, canopy, d + 300, dense)
          ink(gr, canopy, { w: 2.4, d: d + 100, t: 400 })
          ink(gr, B([x + 3, base - 74], [x + 3, base - 86], [x + 15, base - 86], [x + 15, base - 76]), { w: 3, d: d + 400, t: 200 })
        }
        um(g, 74, 586, 400, true)
        um(st(g, 'm1', '--m1: translate(204px, 22px); --dl: 600ms'), 98, 586, 600, true)
        ink(g, RR(56, 548, 64, 52, 6), { w: 3, d: 200, t: 500 })
        hatch(g, RR(56, 548, 64, 52, 6), 500)
        fig(pop(g, 900), 272, 598, 3.6, { arms: 'push' })
        text(g, 88, 630, 'Ständer', { anchor: 'middle', cls: 's', d: 800 })
        const lab = st(g, 'x2', '--o:50% 50%;--dl:200ms')
        text(lab, 180, 400, '§ 16: kein Vorsatz', { anchor: 'middle', fade: false, size: 20 })
        check(lab, 180, 432, 1.1)
      },
    },
    scenes: [
      { t: HOOK(456), pics: { p: { img: 0, x: 16, y: 56, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Das alte Sprichwort sagt nein. Auf Latein: _Ignorantia legis non excusat_ – Unkenntnis des Gesetzes entschuldigt nicht.', 64), gfx: { waage: { cls: 'a1', tf: [0.8, 36, 80] } } },
      { t: T('Die Idee: Sonst könnte sich jeder herausreden. Recht soll für **alle** gelten – ob sie es kennen oder nicht.', 64), gfx: { waage: { cls: 'a1', tf: [0.8, 36, 80] } } },
      { t: T('Im deutschen Strafrecht ist es aber **feiner**. Wer nicht weiß, dass etwas verboten ist, irrt sich über das Verbot.', 64), gfx: { baum: {} } },
      { t: T('§ 17 Strafgesetzbuch: Fehlt die Einsicht, Unrecht zu tun, handelt man **ohne Schuld** – wenn man den Irrtum nicht vermeiden konnte.', 64), gfx: { baum: { cls: 'a1' } } },
      { t: T('Wer sich hätte erkundigen können – bei einer Anwältin oder Behörde –, wird bestraft. Höchstens **milder**.', 64), gfx: { baum: { cls: 'a1 a2', tf: [1, 0, 50] } } },
      { t: T('Die Gerichte prüfen streng:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['vermeidbar', '=', 'du hättest es herausfinden können'], 330] } } },
      { t: T('Wer ein Geschäft betreibt, muss die Regeln seiner Branche kennen. Wer unsicher ist, muss **nachfragen**.', 64), gfx: { punkte: { args: [['Regeln der eigenen Branche kennen', 'bei Zweifeln nachfragen', 'Gewissen anstrengen'], 320] } } },
      { t: T('Wer sich auf eine **falsche Auskunft** von Anwältin oder Behörde verlässt, irrt dagegen meist unvermeidbar.', 64), gfx: { baum: { cls: 'a1', tf: [1, 0, 50] } } },
      { t: T('Anders beim **Irrtum über Tatsachen**: Wer einen fremden Schirm für seinen hält, stiehlt nicht.', 64), gfx: { schirm: { cls: 'a1' } } },
      { t: T('Ihm fehlt der **Vorsatz**: Er kennt nicht das Gesetz nicht, sondern die Lage.', 64), gfx: { schirm: { cls: 'a1 a2' } } },
      { t: T('Juristen trennen die beiden Irrtümer so:', 64, { kind: 'big' }), gfx: { vergleich: { args: [['§ 17 Verbotsirrtum', 'kennt das Verbot nicht', 'meist strafbar'], ['§ 16 Tatumstand', 'kennt die Lage nicht', 'kein Vorsatz'], 290] } } },
      { t: T('Aber: War er **fahrlässig**, kann es trotzdem strafbar sein – wenn das Gesetz auch Fahrlässigkeit bestraft. Beim Diebstahl ist das nicht so.', 64), gfx: { schirm: { cls: 'a1 a2', tf: [0.8, 36, 120] } } },
      { t: T('Dasselbe gilt für Bußgelder: Auch das Gesetz über **Ordnungswidrigkeiten** kennt den Verbotsirrtum.', 64), gfx: { p2: { draw: 'punkte', args: [['Strafrecht: § 17 StGB', 'Bußgelder: § 11 OWiG'], 340] } } },
      { t: T('Ein Beispiel: Wer im Urlaub eine **Drohne** fliegen lässt, muss sich vorher über die Regeln dort informieren.', 64), gfx: { baum: { cls: 'a1 a2', tf: [1, 0, 50] } } },
      { t: T('Wie oft klappt die Ausrede? **Selten**. Gerichte erkennen einen unvermeidbaren Verbotsirrtum nur in Ausnahmefällen an.', 64), gfx: { z1: { draw: 'zahl', args: ['selten', 'unvermeidbar', 420] } } },
      recap(
        [{ gfx: 'waage', cls: 'a1' }, { gfx: 'baum', cls: 'a1 a2' }, { gfx: 'schirm', cls: 'a1 a2' }, { pic: 0, id: 'p' }],
        ['Recht gilt für alle', '§ 17: nur unvermeidbar straffrei', '§ 16: Irrtum über die Lage', 'streng geprüft'],
      ),
    ],
    summary: ['§ 17 StGB: Verbotsirrtum.', 'Straffrei nur, wenn unvermeidbar.', 'Irrtum über Tatsachen (§ 16) lässt den Vorsatz entfallen.'],
    sources: ['Strafgesetzbuch §§ 16, 17'],
  },
  {
    id: 'nato-artikel-5',
    area: 'POL',
    day: 64,
    hook: 'Muss die NATO bei einem Angriff automatisch in den Krieg?',
    mood: 'episch',
    ambience: 'wind',
    images: [img('nato-flaggen')],
    draw: {
      wachstum(g) {
        const at = (y: number) => (y - 1949) / (2025 - 1949)
        timeline(g, 30, 330, 430, [
          { at: at(1949), label: '1949', sub: '12 Staaten', up: true },
          { at: at(1955), label: '1955', sub: 'Bundesrepublik' },
          { at: at(1999), label: '1999', sub: 'Polen u. a.', up: true },
          { at: at(2004), label: '2004', sub: '7 Staaten' },
          { at: at(2024), label: '2024', sub: '32 Staaten', up: true, big: true },
        ], 0, 450)
      },
      bund(g) {
        const n = 32
        const cx = 180
        const cy = 420
        const r = 132
        const pos = (i: number): P => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r]
        for (let i = 0; i < n; i++) {
          const [x, y] = pos(i)
          const p = pop(g, 100 + i * 35, '50% 50%')
          ink(p, E(x, y, 8), { w: 2.4, t: 0 })
          hatch(p, E(x, y, 8), 0, i === 0)
        }
        arrow(g, L([352, 330], [322, 408]), { w: 3.6, d: 1500, t: 300 })
        const lines = st(g, 'f1', '--dl:600ms')
        for (let i = 1; i < n; i++) ink(lines, L(pos(i), [pos(0)[0] - 10, pos(0)[1]]), { w: 1.2, t: 0 })
        text(g, cx, cy + r + 50, '32 Staaten', { anchor: 'middle', d: 1200, size: 20 })
      },
      mittel(g) {
        const boxes: [number, number, string][] = [[40, 200, 'Soldaten'], [190, 200, 'Geld'], [40, 380, 'Material'], [190, 380, 'Sanitäter']]
        boxes.forEach(([x, y, lab], i) => {
          const d = i * 200
          ink(g, RR(x, y, 130, 130, 16), { w: 3, d, t: 500 })
          text(g, x + 65, y + 156, lab, { anchor: 'middle', d: d + 300 })
          const cx = x + 65
          const cy = y + 65
          if (i === 0) {
            const helm = B([cx - 36, cy + 14], [cx - 36, cy - 40], [cx + 36, cy - 40], [cx + 36, cy + 14])
            hatch(g, [...helm], d + 500, true)
            ink(g, helm, { w: 3, d: d + 200, t: 400 })
            ink(g, L([cx - 44, cy + 14], [cx + 44, cy + 14]), { w: 3.4, d: d + 400, t: 200 })
          } else if (i === 1) coin(g, cx, cy, 36, '€', d + 200)
          else if (i === 2) {
            ink(g, RR(cx - 36, cy - 30, 72, 60, 4), { w: 3, d: d + 200, t: 400 })
            ink(g, L([cx - 36, cy - 30], [cx + 36, cy + 30]), { w: 2, d: d + 400, t: 200 })
            ink(g, L([cx + 36, cy - 30], [cx - 36, cy + 30]), { w: 2, d: d + 450, t: 200 })
          } else {
            const plus: P[] = [[cx - 10, cy - 34], [cx + 10, cy - 34], [cx + 10, cy - 10], [cx + 34, cy - 10], [cx + 34, cy + 10], [cx + 10, cy + 10], [cx + 10, cy + 34], [cx - 10, cy + 34], [cx - 10, cy + 10], [cx - 34, cy + 10], [cx - 34, cy - 10], [cx - 10, cy - 10], [cx - 10, cy - 34]]
            hatch(g, plus, d + 500, true)
            ink(g, plus, { w: 2.6, d: d + 200, t: 500 })
          }
        })
        for (const [i, x, y] of [[0, 150, 220], [1, 300, 220], [2, 150, 400]] as const) check(st(g, 'x1', `--o:50% 50%;--dl:${200 + i * 300}ms`), x, y, 1.3)
      },
      zeit(g) {
        timeline(g, 50, 330, 430, [
          { at: 0, label: '1949', sub: 'Gründung', up: true },
          { at: (2001 - 1949) / (2026 - 1949), label: '2001', sub: 'Bündnisfall', big: true },
          { at: 1, label: 'heute', up: true },
        ], 0, 600)
        bigText(g, 180, 330, '1×', { size: 110, d: 1600 })
      },
    },
    scenes: [
      { t: HOOK(456), pics: { p: { img: 0, x: 16, y: 56, w: 328, h: 380, enter: 'blot', cam: [50, 40, 1.05], cam2: [55, 40, 1.2] } } },
      { t: T('Die NATO wurde 1949 gegründet: zwölf Staaten, als Schutzbündnis gegen die **Sowjetunion**.', 64), gfx: { zahl: { args: ['12', 'Gründungsstaaten 1949', 420] } } },
      { t: T('Heute sind es **32** – zuletzt kamen Finnland 2023 und Schweden 2024 dazu.', 64), gfx: { bund: {} } },
      { t: T('Ihr Kern ist Artikel 5: Ein bewaffneter Angriff auf ein Mitglied gilt als **Angriff auf alle**.', 64), gfx: { bund: { cls: 'a1' } } },
      { t: T('Das klingt nach Automatik:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['Angriff auf ein Mitglied', '=', 'Angriff auf alle'], 320] } } },
      { t: T('Im Text steht aber: Jedes Land hilft mit den Maßnahmen, **die es für erforderlich hält**.', 64), gfx: { mittel: {} } },
      { t: T('Auch **Waffengewalt** ist möglich. Wie geholfen wird, entscheidet jedes Land selbst.', 64), gfx: { mittel: { cls: 'a1' } } },
      { t: T('Diese Formulierung wollten vor allem die **USA**: Über Krieg sollte ihr eigenes Parlament entscheiden.', 64), gfx: { f2: { draw: 'formel', args: [['Beistand', '=', 'Pflicht'], 300, 'genauer:'] }, f3: { draw: 'formel', args: [['Art des Beistands', '=', 'Entscheidung jedes Landes'], 440] } } },
      { t: T('Ausgerufen wurde der Bündnisfall bisher nur **einmal**: nach den Anschlägen vom 11. September 2001.', 64), gfx: { zeit: {} } },
      { t: T('Am 12. September erklärte die NATO den Bündnisfall. Es folgten etwa **Aufklärungsflüge** über den USA.', 64), gfx: { zeit: { tf: [1, 0, -60] }, zahl: { args: ['1×', 'Bündnisfall, 2001', 560] } } },
      { t: T('Daneben gibt es **Artikel 4**: Beratungen, wenn sich ein Mitglied bedroht fühlt – etwa 2022 nach Russlands Angriff auf die Ukraine.', 64), gfx: { vergleich: { args: [['Artikel 4', 'Beratung', 'mehrfach genutzt'], ['Artikel 5', 'Beistand', 'einmal, 2001'], 290] } } },
      { t: T('Gegründet von den USA, Kanada und zehn europäischen Ländern. Die Bundesrepublik trat 1955 bei, nach 1990 viele Staaten Osteuropas.', 64), gfx: { wachstum: {} } },
      { t: T('Entscheidungen fallen **einstimmig**: Jedes der 32 Mitglieder hat praktisch ein Vetorecht.', 64), gfx: { bund: { cls: 'a1' } } },
      { t: T('Artikel 5 gilt nur für Angriffe in **Europa und Nordamerika** – so legt es Artikel 6 fest.', 64), gfx: { v2: { draw: 'vergleich', args: [['gilt', 'Europa', 'Nordamerika', 'Atlantik nördlich des Wendekreises'], ['gilt nicht', 'zum Beispiel Kolonien im Süden', 'Einsätze weltweit'], 290] } } },
      { t: T('Viel diskutiert ist Geld. Lange galt: Jedes Land soll **2 Prozent** seiner Wirtschaftsleistung für Verteidigung ausgeben.', 64), gfx: { f4: { draw: 'formel', args: [['Verteidigungsausgaben', '÷', 'Wirtschaftsleistung', '≥', '2 %'], 320, 'Zwei-Prozent-Ziel'] } } },
      { t: T('2025 einigten sich die Mitglieder auf mehr: **5 Prozent** bis 2035 – davon 3,5 Prozent für das Militär selbst.', 64), gfx: { z5: { draw: 'zahl', args: ['5 %', 'Ziel bis 2035', 420] } } },
      recap(
        [{ gfx: 'bund', cls: 'a1' }, { gfx: 'mittel', cls: 'a1' }, { gfx: 'zeit' }, { pic: 0, id: 'p' }],
        ['Angriff auf einen = auf alle', 'Mittel wählt jedes Land', 'Bündnisfall nur 2001', '32 Staaten'],
      ),
    ],
    summary: ['Angriff auf einen = Angriff auf alle.', 'Jedes Land wählt die Mittel selbst.', 'Bündnisfall bisher nur 2001.'],
    sources: ['Nordatlantikvertrag 1949, Art. 5', 'NATO: Collective defence and Article 5'],
  },
  {
    id: 'wahlpflicht',
    area: 'POL',
    day: 15,
    hook: 'Würden mehr Leute wählen, wenn sie müssten?',
    mood: 'verspielt',
    images: [img('wahlurne')],
    draw: {
      urne(g) {
        ink(g, RR(100, 400, 160, 150, 12), { w: 3.4, t: 700 })
        hatch(g, RR(100, 400, 160, 150, 12), 600)
        blank(g, RR(130, 392, 100, 16, 6))
        ink(g, RR(130, 392, 100, 16, 6), { w: 2.6, d: 400, t: 300 })
        for (let k = 0; k < 3; k++) {
          const p = group(g)
          ink(p, RR(158, 250, 44, 58, 4), { w: 2.4, t: 0 })
          ink(p, L([168, 266], [180, 280]), { w: 2.4, t: 0 })
          ink(p, L([180, 266], [168, 280]), { w: 2.4, t: 0 })
          p.animate([{ transform: 'translateY(-40px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: 0.25 }, { transform: 'translateY(130px)', opacity: 1, offset: 0.85 }, { transform: 'translateY(150px)', opacity: 0 }], {
            duration: 2400,
            delay: 600 + k * 800,
            iterations: Infinity,
            fill: 'backwards',
            easing: 'ease-in',
          })
        }
      },
      jahr(g) {
        bigText(g, 180, 400, '1924', { size: 120, d: 200 })
        coin(g, 180, 500, 40, '$', 900)
        text(g, 180, 576, 'Bußgeld', { anchor: 'middle', d: 1200 })
      },
      saeulen(g, n: number) {
        const cols = [
          { label: 'Australien', v: 90, fmt: pct },
          { label: 'Bundestag 2025', v: 82, fmt: pct, dense: true },
          { label: 'Europawahl 2024', v: 65, fmt: pct },
        ].slice(0, n)
        const gap = 108
        vbars(g, cols, { x: 180 - ((n - 1) * gap + 72) / 2, base: 600, w: 72, gap, h: 360, max: 100 })
      },
      armreich(g) {
        const none = () => ''
        vbars(g, [{ label: 'arm', v: 52, fmt: none }, { label: 'reich', v: 82, fmt: none, dense: true }], { x: 46, base: 580, w: 48, gap: 60, h: 280, max: 100 })
        vbars(g, [{ label: 'arm', v: 88, fmt: none }, { label: 'reich', v: 92, fmt: none, dense: true }], { x: 214, base: 580, w: 48, gap: 60, h: 280, max: 100, d: 900 })
        text(g, 100, 250, 'ohne Pflicht', { anchor: 'middle', d: 200 })
        text(g, 268, 250, 'mit Pflicht', { anchor: 'middle', d: 1000 })
      },
      frage(g) {
        question(g, 180, 400, 3.2)
      },
    },
    scenes: [
      { t: HOOK(70), gfx: { urne: {} } },
      { t: T('In **Australien** gilt seit 1924 Wahlpflicht. Wer ohne Grund fehlt, zahlt ein kleines Bußgeld.', 64), gfx: { jahr: {} } },
      { t: T('Wer nicht gewählt hat, bekommt einen Brief: einen Grund nennen – oder **20 Dollar** zahlen.', 64), gfx: { f1: { draw: 'formel', args: [['nicht gewählt', '→', 'Grund nennen', 'oder', '20 Dollar'], 330] } } },
      { t: T('Gewählt wird an einem **Samstag** – mit Würstchen vom Grill vor dem Wahllokal, der „Democracy Sausage“.', 64), gfx: { urne: { tf: [0.8, 36, 60] } } },
      { t: T('Gemessen wird die Wahlbeteiligung so:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['Wahlbeteiligung', '=', 'abgegebene Stimmen', '÷', 'Wahlberechtigte'], 320] } } },
      { t: T('In Australien liegt sie seitdem meist um **90 Prozent**.', 64), gfx: { s1: { draw: 'saeulen', args: [1] } } },
      { t: T('In Deutschland waren es bei der Bundestagswahl 2025 rund **82 Prozent** – so viel wie seit 1987 nicht.', 64), gfx: { s2: { draw: 'saeulen', args: [2] } } },
      { t: T('Bei Landtags- und Europawahlen ist sie oft viel **niedriger**.', 64), gfx: { s3: { draw: 'saeulen', args: [3] } } },
      { t: T('Australien ist nicht allein: Rund 20 Länder kennen eine Wahlpflicht – **durchgesetzt** wird sie aber nur in wenigen, etwa in Belgien oder Uruguay.', 64), gfx: { zahl: { args: ['≈ 20', 'Länder mit Wahlpflicht', 420] } } },
      { t: T('Ohne Pflicht wählen Ärmere seltener als Reiche. Studien zeigen: Die Pflicht gleicht das an – **alle** Stimmen zählen mit.', 64), gfx: { armreich: {} } },
      { t: T('Es gibt auch Gegenargumente:', 64, { kind: 'big' }), gfx: { vergleich: { args: [['dafür', 'hohe Beteiligung', 'alle Schichten vertreten'], ['dagegen', 'Zwang statt Freiheit', 'Kreuz aufs Geratewohl'], 290] } } },
      { t: T('Ob die Leute durch die Pflicht **informierter** wählen, ist offen.', 64), gfx: { frage: {} } },
      { t: T('Belgien hat die älteste noch geltende Wahlpflicht: seit **1893**.', 64), gfx: { z2: { draw: 'zahl', args: ['1893', 'Wahlpflicht in Belgien', 420] } } },
      { t: T('Pflicht heißt dort meist nur: hingehen und den Zettel abgeben. **Ungültig** wählen darf man trotzdem.', 64), gfx: { urne: { tf: [0.8, 36, 60] } } },
      { t: T('Studien schätzen: Eine durchgesetzte Wahlpflicht hebt die Beteiligung um rund **zehn Prozentpunkte** oder mehr.', 64), gfx: { s2b: { draw: 'saeulen', args: [2] } } },
      { t: T('Zum Vergleich: Bei rund 59 Millionen Wahlberechtigten in Deutschland heißt jeder Prozentpunkt:', 64), gfx: { f3: { draw: 'formel', args: [['1 % von 59 Millionen', '≈', '590.000 Menschen'], 330] } } },
      { t: T('In Deutschland gilt dagegen Artikel 38: Wahlen sind allgemein, unmittelbar, **frei**, gleich und geheim.', 64), gfx: { p2: { draw: 'punkte', args: [['allgemein', 'unmittelbar', 'frei', 'gleich', 'geheim'], 280] } } },
      recap(
        [{ gfx: 'urne' }, { gfx: 'jahr' }, { gfx: 's3', draw: 'saeulen', args: [3] }, { gfx: 'armreich' }],
        ['Wahlpflicht Australien', 'seit 1924, 20 Dollar Bußgeld', '90 % zu 82 %', 'gleicht Arm und Reich an'],
      ),
    ],
    summary: ['Australien: Wahlpflicht seit 1924, rund 90 % Beteiligung.', 'Bundestagswahl 2025: rund 82 %.', 'Pflicht gleicht Unterschiede zwischen Arm und Reich an.'],
    sources: ['Australian Electoral Commission', 'Die Bundeswahlleiterin 2024, 2025', 'Lijphart 1997, American Political Science Review'],
  },
  {
    id: 'tulpenmanie',
    area: 'WIRT',
    day: 28,
    hook: 'Ruinierte die Tulpenmanie ganz Holland?',
    mood: 'verspielt',
    images: [img('tulpen-satire'), img('tulpenfeld')],
    draw: {
      blasen(g) {
        const at = (y: number) => (y - 1600) / 425
        timeline(g, 30, 330, 430, [
          { at: at(1637), label: '1637', sub: 'Tulpen', up: true },
          { at: at(1720), label: '1720', sub: 'Südsee' },
          { at: at(2000), label: '2000', sub: 'Dotcom', up: true },
          { at: at(2008), label: '2008', sub: 'Immobilien', big: true },
        ], 0, 500)
      },
      herkunft(g) {
        timeline(g, 30, 330, 430, [
          { at: 0.05, label: 'um 1550', sub: 'Osmanisches Reich', up: true },
          { at: 0.45, label: '1593', sub: 'Leiden' },
          { at: 0.92, label: '1637', sub: 'Absturz', up: true, big: true },
        ], 0, 600)
      },
      geflammt(g) {
        tulip(g, 180, 620, 3, 0)
        for (let k = 0; k < 5; k++) ink(g, B([150 + k * 14, 360], [146 + k * 14, 400], [158 + k * 14, 430], [152 + k * 14, 450]), { w: 2.6, d: 1200 + k * 150, t: 300 })
        text(g, 180, 300, 'geflammt', { anchor: 'middle', size: 22, cls: 'it', d: 1500 })
      },
      tausch(g) {
        balance(g, 0, 0, 0, 0)
        tulip(pop(g, 1200), 80, 350, 0.8, 1200)
        house(pop(g, 1500), 252, 350, 56, 50, 1500)
        text(g, 80, 420, '1 Zwiebel', { anchor: 'middle', d: 1600 })
        text(g, 280, 420, '1 Haus', { anchor: 'middle', d: 1800 })
      },
      kurs(g) {
        ink(g, L([40, 560], [330, 560]), { w: 3, t: 500 })
        ink(g, L([40, 560], [40, 230]), { w: 3, t: 500 })
        text(g, 50, 240, 'Preis', { cls: 's', d: 300 })
        const up = B([46, 540], [150, 536], [210, 480], [250, 270])
        ink(g, up, { w: 3.6, d: 600, t: 1400 })
        ink(g, B([250, 270], [258, 330], [266, 470], [290, 548]), { w: 3.6, d: 2000, t: 400 })
        text(g, 60, 586, 'Nov. 1636', { cls: 's', d: 700 })
        text(g, 300, 586, 'Feb. 1637', { cls: 's', anchor: 'middle', d: 2100 })
        const bl = st(g, 'x1', '--o:50% 50%;--dl:200ms')
        ink(bl, E(250, 262, 38), { w: 2.6, t: 0 })
        ink(bl, B([232, 248], [236, 238], [244, 234], [252, 234]), { w: 2, t: 0 })
        text(bl, 250, 212, 'Blase', { anchor: 'middle', fade: false, size: 18 })
      },
      archiv(g) {
        for (let k = 0; k < 4; k++) {
          ink(g, RR(80 + k * 6, 470 - k * 44, 170, 40, 6), { w: 2.8, d: k * 200, t: 400 })
          hatch(g, RR(80 + k * 6, 470 - k * 44, 26, 40, 6), k * 200 + 300, true)
        }
        const lupe = st(g, 'float')
        ink(lupe, E(268, 330, 42), { w: 3.4, d: 900, t: 500 })
        ink(lupe, L([298, 360], [336, 400]), { w: 6, d: 1300, t: 300 })
        text(g, 180, 576, 'kaum Pleiten', { anchor: 'middle', d: 1500, size: 20 })
      },
      vertrag(g) {
        ink(g, RR(110, 220, 140, 200, 6), { w: 3, t: 600 })
        for (let k = 0; k < 6; k++) ink(g, L([128, 256 + k * 20], [k === 5 ? 190 : 232, 256 + k * 20]), { w: 1.6, d: 300 + k * 80, t: 200 })
        ink(g, B([150, 400], [160, 380], [180, 410], [214, 388]), { w: 2.4, d: 900, t: 400 })
        cross(st(g, 'x1', '--o:50% 50%;--dl:400ms'), 180, 320, 3.6)
      },
      tulpe(g) {
        tulip(g, 180, 600, 2.6, 0)
      },
    },
    scenes: [
      { t: HOOK(470), pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 380, enter: 'blot', cam: [50, 50, 1.05], cam2: [40, 55, 1.3], cap: 'Brueghel d. J., Satire auf die Tulpenmanie' } } },
      { t: T('Tulpen kamen im 16. Jahrhundert aus dem **Osmanischen Reich** nach Europa – exotisch, selten, teuer.', 64), gfx: { herkunft: {} } },
      { t: T('Besonders begehrt waren **geflammte** Blüten. Den Grund kannte niemand: ein Virus, das die Farbe streifig macht.', 64), gfx: { geflammt: {} } },
      { t: T('1637 erreichten **Tulpenzwiebeln** absurde Preise. Eine einzige soll so viel gekostet haben wie ein Haus.', 64), gfx: { tausch: { tf: [0.9, 18, 120] } } },
      { t: T('Für einzelne Zwiebeln zahlte man über 5.000 Gulden. Ein Handwerker verdiente im **Jahr** etwa 300.', 64), gfx: { f1: { draw: 'formel', args: [['5.000 Gulden', '÷', '300 Gulden Jahreslohn', '≈', '16 Jahre Arbeit'], 320] } } },
      { t: T('Gehandelt wurde im Winter, wenn die Zwiebeln in der Erde lagen – auf **Papier**, in Wirtshäusern.', 64), gfx: { vertrag: {} } },
      { t: T('Dann, Anfang Februar 1637 in Haarlem, fanden sich plötzlich **keine Käufer** mehr. Der Markt brach in wenigen Tagen ein.', 64), gfx: { kurs: {} } },
      { t: T('Lange galt das als erste **Spekulationsblase** – mit ruinierten Existenzen.', 64), gfx: { kurs: { cls: 'a1' } } },
      { t: T('Die Historikerin Anne Goldgar fand in den Archiven aber **kaum Pleiten**.', 64), gfx: { archiv: {} } },
      { t: T('Gehandelt hatte eine kleine Schicht reicher Kaufleute – viele Verträge wurden **nie erfüllt**.', 64), gfx: { vertrag: { cls: 'a1' } } },
      { t: T('Oft einigte man sich auf einen kleinen Teil des Preises. Behörden empfahlen 1638 rund **3,5 Prozent**.', 64), gfx: { zahl: { args: ['3,5 %', 'des vereinbarten Preises', 420] } } },
      {
        t: T('Maler machten sich lustig: Bei Jan Brueghel dem Jüngeren handeln **Affen** mit Tulpen – die Spekulanten als Narren.', 430),
        pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 350, cam: [35, 60, 1.8], cam2: [38, 62, 2.1] } },
      },
      {
        t: T('Die Horror-Geschichten stammen aus **moralischen Flugschriften** – und aus einem Bestseller von Charles Mackay, 1841.', 420),
        pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 330, cam: [62, 45, 1.6] } },
      },
      {
        t: T('Heute sind die Niederlande der größte **Tulpenexporteur** der Welt.', 504),
        pics: { f: { img: 1, x: 16, y: 56, w: 328, h: 420, enter: 'blot', cam: [50, 60, 1.05], cam2: [50, 60, 1.2] } },
      },
      { t: T('Die Niederlande waren um 1630 das reichste Land Europas: Handel, Schiffe – und seit 1602 eine **Börse** in Amsterdam.', 64), gfx: { p2: { draw: 'punkte', args: [['Welthandel mit Schiffen', 'erste Aktiengesellschaft 1602', 'viel Geld, das Anlage suchte'], 320] } } },
      { t: T('Gehandelt wurde oft nicht die Zwiebel selbst, sondern das Recht, sie später zu kaufen – ein frühes **Termingeschäft**.', 64), gfx: { f2: { draw: 'formel', args: [['Vertrag im Winter', '→', 'Zwiebel im Sommer'], 330, 'Termingeschäft'] } } },
      { t: T('Die Preise stiegen, weil man Verträge mit Gewinn **weiterverkaufen** konnte – solange neue Käufer kamen.', 64), gfx: { f3: { draw: 'formel', args: [['Preis steigt', '→', 'neue Käufer', '→', 'Preis steigt'], 330, 'Spirale'] } } },
      { t: T('Das ist der Kern jeder Blase: Man kauft nicht wegen des Werts, sondern weil man auf einen **höheren Preis** hofft.', 64), gfx: { kurs: { cls: 'a1' } } },
      { t: T('Spätere Blasen waren viel größer – mit echten Pleiten:', 64, { kind: 'big' }), gfx: { blasen: {} } },
      recap(
        [{ gfx: 'tausch' }, { gfx: 'kurs', cls: 'a1' }, { gfx: 'vertrag', cls: 'a1' }, { pic: 0, id: 's', cam: [40, 55, 1.2] }],
        ['1 Zwiebel = 1 Haus?', 'Absturz Februar 1637', 'Verträge nie erfüllt', 'Spott statt Ruin'],
      ),
    ],
    summary: ['1637: Preissturz in wenigen Tagen.', 'Archive zeigen kaum Pleiten.', 'Die Legende stammt aus Flugschriften und Mackay (1841).'],
    sources: ['Goldgar 2007, Tulipmania'],
  },
  {
    id: 'kobra-effekt',
    area: 'WIRT',
    day: 42,
    hook: 'Kann eine Belohnung alles schlimmer machen?',
    mood: 'raetsel',
    images: [img('kobra')],
    draw: {
      autos(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        car(g, 110, 556, 2, 200)
        const two = pop(g, 1200)
        car(two, 260, 556, 2, 0)
        text(g, 110, 600, 'Kennzeichen …3', { anchor: 'middle', cls: 's', d: 700 })
        text(two, 260, 600, 'Zweitwagen …8', { anchor: 'middle', cls: 's', fade: false })
        cross(g, 110, 470, 1.4, 900)
      },
      kanal(g) {
        ink(g, L([20, 300], [340, 300]), { w: 3, t: 500 })
        hatch(g, [[20, 300], [340, 300], [340, 620], [20, 620]], 400)
        blank(g, RR(30, 420, 300, 60, 30))
        ink(g, RR(30, 420, 300, 60, 30), { w: 3, d: 300, t: 700 })
        for (let k = 0; k < 4; k++) {
          const r = group(g)
          ink(r, E(80 + k * 60, 458, 14, 8), { w: 2.2, t: 0 })
          ink(r, B([66 + k * 60, 460], [58 + k * 60, 466], [52 + k * 60, 454], [44 + k * 60, 458]), { w: 1.6, t: 0 })
          r.animate([{ transform: 'translateX(-40px)' }, { transform: 'translateX(60px)' }], { duration: 2600 + k * 300, delay: k * 200, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
        }
        text(g, 180, 280, 'neue Kanalisation, um 1900', { anchor: 'middle', d: 600 })
      },
      kurve(g) {
        ink(g, L([40, 580], [330, 580]), { w: 3, t: 500 })
        ink(g, L([40, 580], [40, 250]), { w: 3, t: 500 })
        text(g, 50, 262, 'Kobras', { cls: 's', d: 300 })
        dashes(g, L([40, 400], [330, 400]), { w: 1.6, d: 400 })
        text(g, 326, 390, 'vorher', { cls: 's', anchor: 'end', d: 500 })
        ink(g, [...L([44, 400], [90, 400]), ...B([90, 400], [120, 400], [140, 500], [190, 500]).slice(1), ...L([190, 500], [214, 500]).slice(1)], { w: 3.6, d: 700, t: 1100 })
        ink(g, B([214, 500], [236, 470], [260, 300], [320, 280]), { w: 3.6, d: 2400, t: 700 })
        for (const [x, lab, d] of [[90, 'Prämie', 600], [214, 'Prämie weg', 2200]] as const) {
          dashes(g, L([x, 590], [x, 300]), { w: 1.6, d })
          text(g, x, 612, lab, { cls: 's', anchor: 'middle', d })
        }
        question(st(g, 'x1', '--o:50% 50%;--dl:300ms'), 280, 200, 1.6)
      },
      ratte(g) {
        ink(g, L([20, 520], [340, 520]), { w: 3, t: 500 })
        const babies = st(g, 'x2', '--dl:1200ms;--o:50% 100%')
        for (let k = 0; k < 3; k++) {
          const bx = 40 + k * 52
          hatch(babies, E(bx, 506, 18, 10), 0)
          ink(babies, E(bx, 506, 18, 10), { w: 2.2, t: 0 })
          ink(babies, [[bx + 16, 500], [bx + 28, 508], [bx + 16, 514]], { w: 2.2, t: 0 })
          ink(babies, B([bx - 18, 508], [bx - 30, 512], [bx - 30, 496], [bx - 42, 498]), { w: 1.8, t: 0 })
        }
        const rat = st(g, 'm2', '--m2: translateX(64px); --dl: 300ms; transition-duration: 1.4s')
        const body = E(200, 470, 70, 36)
        hatch(rat, body, 400)
        ink(rat, body, { w: 3, d: 100, t: 600 })
        ink(rat, [[262, 450], [300, 478], [262, 494]], { w: 3, d: 400, t: 300 })
        ink(rat, E(248, 446, 10), { w: 2.4, d: 500, t: 200 })
        mk('circle', { cx: 284, cy: 474, r: 3, class: 'k fade', style: '--d:600ms' }, rat)
        for (const x of [170, 220]) ink(rat, L([x, 500], [x - 4, 520]), { w: 2.6, d: 600, t: 150 })
        const tail = st(g, 'm1', '--m1: translate(-20px, 100px) rotate(-14deg); transform-origin: 130px 470px; --dl: 400ms')
        ink(tail, B([132, 472], [90, 480], [80, 430], [30, 440]), { w: 2.6, d: 700, t: 400 })
        coin(st(g, 'x1', '--o:50% 50%;--dl:1300ms'), 160, 600, 24, '¢', 0)
      },
      geld(g) {
        for (let k = 0; k < 6; k++) {
          const p = pop(g, 600 + k * 180, '50% 50%')
          blank(p, E(284, 452 - k * 13, 40, 12))
          ink(p, E(284, 452 - k * 13, 40, 12), { w: 2.6, t: 0 })
          if (k === 5) text(p, 284, 452 - k * 13 + 6, '₹', { anchor: 'middle', fade: false, size: 16 })
        }
        text(g, 284, 500, 'Kopfgeld', { anchor: 'middle', d: 1600 })
      },
      ziel(g) {
        arrow(g, L([20, 300], [214, 392]), { w: 3.4, t: 300, head: 14 })
        for (let k = 0; k < 4; k++) ink(g, E(212, 392, 22 + k * 30), { w: 2.8, d: 900 + k * 250, t: 500 })
        hatch(g, E(212, 392, 22), 1900, true)
      },
    },
    scenes: [
      { t: HOOK(456), pics: { k: { img: 0, x: 16, y: 56, w: 328, h: 380, enter: 'blot', cam: [45, 30, 1.2], cam2: [45, 30, 1.35] } } },
      {
        t: T('Der **Kobra-Effekt**: Im britisch regierten Delhi soll es Kopfgeld für tote Kobras gegeben haben.', 64),
        pics: { k: { img: 0, x: 24, y: 220, w: 190, h: 250, cam: [45, 30, 1.35] } },
        gfx: { geld: {} },
      },
      { t: T('Die Leute **züchteten** Kobras. Als die Prämie wegfiel, ließen sie sie frei – mehr Schlangen als vorher.', 64), gfx: { kurve: {} } },
      { t: T('Den Namen prägte der Ökonom Horst Siebert 2001. Für Delhi gibt es aber **keinen Beleg** aus der Zeit.', 64), gfx: { kurve: { cls: 'a1' } } },
      { t: T('Gut dokumentiert ist dagegen **Hanoi**: Die französische Kolonialverwaltung baute um 1900 eine moderne Kanalisation – ein Paradies für Ratten.', 64), gfx: { kanal: {} } },
      { t: T('1902 bezahlte sie Rattenfänger. Bald wurden an einem einzigen Tag über 20.000 Ratten getötet – und es wurden **nicht weniger**.', 64), gfx: { zahl: { args: ['20.000', 'getötete Ratten an einem Tag, 1902', 420] } } },
      { t: T('Dann durften alle mitmachen. Als Beweis genügte der **Schwanz**:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['1 Rattenschwanz', '=', '1 Cent'], 330] } } },
      { t: T('Die Leute fingen Ratten, schnitten den Schwanz ab – und ließen sie **laufen**.', 64), gfx: { ratte: { cls: 'a1' } } },
      { t: T('Bald liefen Ratten **ohne Schwanz** herum. Die durften sich vermehren – für neue Schwänze. Kontrolleure fanden sogar Rattenzuchten.', 64), gfx: { ratte: { cls: 'a1 a2' } } },
      { t: T('Ökonomen nennen das **Fehlanreiz**: Man belohnt eine Messgröße – und die Leute optimieren die Messgröße statt des Ziels.', 64), gfx: { f2: { draw: 'formel', args: [['Messgröße', '→', 'Ziel', '→', 'Messgröße taugt nichts mehr'], 320, 'Goodhart’sches Gesetz'] } } },
      { t: T('Wird ein Maß zum Ziel, taugt es nicht mehr als Maß. So formulierte es der Ökonom Charles **Goodhart** 1975.', 64), gfx: { ziel: { tf: [1, 0, 40] } } },
      { t: T('Beispiele gibt es bis heute:', 64, { kind: 'big' }), gfx: { punkte: { args: [['Schulen, die nur nach Tests bewertet werden, üben nur noch für den Test', 'Klickzahlen belohnen reißerische Überschriften'], 300] } } },
      { t: T('Die Lösung: mehrere Messgrößen kombinieren – und genau hinschauen, was eine Belohnung **wirklich** belohnt.', 64), gfx: { ziel: { tf: [0.6, 72, 200] } } },
      { t: T('Drei Fragen, bevor man etwas belohnt:', 64, { kind: 'big' }), gfx: { p4: { draw: 'punkte', args: [['Was genau wird gezählt?', 'Kann man die Zahl erhöhen, ohne das Ziel zu erreichen?', 'Was passiert, wenn die Belohnung endet?'], 280] } } },
      { t: T('Für Hanoi hieße das: nicht Schwänze zählen, sondern prüfen, ob es **weniger Ratten** gibt – und Brutstätten beseitigen.', 64), gfx: { g1: { draw: 'formel', args: [['belohnt', '→', 'Schwänze'], 300] }, g2: { draw: 'formel', args: [['gemeint', '→', 'weniger Ratten'], 430] } } },
      { t: T('Ein neueres Beispiel: Mexiko-Stadt verbot 1989 Autos je nach Kennzeichen an einem Tag pro Woche – gegen den **Smog**.', 64), gfx: { autos: {} } },
      { t: T('Viele kauften daraufhin ein **zweites Auto** – oft ein altes mit schlechten Abgaswerten. Die Luft wurde nicht besser.', 64), gfx: { f3: { draw: 'formel', args: [['Fahrverbot an einem Tag', '→', 'Zweitauto', '→', 'mehr alte Autos'], 320] } } },
      recap(
        [{ gfx: 'kurve', cls: 'a1' }, { gfx: 'kanal' }, { gfx: 'ratte', cls: 'a1 a2' }, { gfx: 'ziel' }],
        ['Kobras: ohne Beleg', 'Hanoi 1902: Ratten', 'Schwanz ab, Ratte frei', 'Maß als Ziel verliert Wert'],
      ),
    ],
    summary: ['Kobras in Delhi: Anekdote ohne Beleg.', 'Rattenschwänze in Hanoi 1902: dokumentiert.', 'Goodhart: Ein Maß als Ziel verliert seinen Wert.'],
    sources: ['Vann 2003, French Colonial History', 'Goodhart 1975'],
  },
  {
    id: 'geld-glueck',
    area: 'WIRT',
    day: 80,
    hook: 'Macht Geld glücklich?',
    mood: 'hell',
    images: [img('euro')],
    draw: {
      chart(g) {
        const f = (x: number) => 560 - (250 * Math.log(1 + (x - 50) / 26)) / Math.log(1 + 280 / 26)
        ink(g, L([40, 580], [334, 580]), { w: 3, t: 500 })
        ink(g, L([40, 580], [40, 240]), { w: 3, t: 500 })
        text(g, 50, 250, 'Glück', { cls: 's', d: 300 })
        text(g, 330, 604, 'Einkommen', { cls: 's', anchor: 'end', d: 300 })
        const curve = (x0: number, x1: number, fn = f): P[] => Array.from({ length: 40 }, (_, i) => [x0 + ((x1 - x0) * i) / 39, fn(x0 + ((x1 - x0) * i) / 39)] as P)
        ink(g, curve(50, 200), { w: 3.6, d: 600, t: 900 })
        ink(st(g, 'h1'), L([200, f(200)], [320, f(200)]), { w: 3.6, d: 1500, t: 600 })
        dashes(g, L([200, 590], [200, f(200) - 20]), { w: 1.6, d: 1400 })
        text(g, 200, 612, '75.000 $', { anchor: 'middle', d: 1500 })
        ink(st(g, 'f1', '--dl:300ms'), curve(200, 320), { w: 3.6, t: 0 })
        const low = (x: number) => 580 - (580 - f(x)) * 0.55
        const lo = st(g, 'f2', '--dl:300ms')
        ink(lo, curve(50, 200, low), { w: 2.6, t: 0 })
        ink(lo, L([200, low(200)], [320, low(200) + 2]), { w: 2.6, t: 0 })
        text(lo, 320, low(200) + 22, 'die Unglücklichsten', { cls: 's', anchor: 'end', fade: false })
        text(st(g, 'f2', '--dl:600ms'), 320, f(320) - 14, 'die meisten', { cls: 's', anchor: 'end', fade: false })
      },
      muenzen(g) {
        const stack = (x: number, n: number, d: number) => {
          for (let k = 0; k < n; k++) {
            const y = 540 - k * 11
            blank(g, E(x, y, 34, 10))
            ink(g, E(x, y, 34, 10), { w: 2.4, d: d + k * 60, t: 200 })
          }
          const top = 540 - n * 11
          const p = pop(g, d + n * 60 + 600, '50% 50%')
          blank(p, E(x, top - 20, 34, 10))
          hatch(p, E(x, top - 20, 34, 10), 0, true)
          ink(p, E(x, top - 20, 34, 10), { w: 2.6, t: 0 })
        }
        stack(100, 2, 0)
        stack(260, 12, 300)
        text(g, 100, 466, '+ 50 %', { anchor: 'middle', size: 24, d: 1400 })
        text(g, 260, 336, '+ 8 %', { anchor: 'middle', size: 24, d: 1800 })
        text(g, 100, 590, 'wenig Geld', { anchor: 'middle', d: 500 })
        text(g, 260, 590, 'viel Geld', { anchor: 'middle', d: 700 })
      },
    },
    scenes: [
      { t: HOOK(470), pics: { e: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 50, 1.2] } } },
      { t: T('Glück lässt sich auf zwei Arten messen – und das macht hier den Unterschied:', 64), gfx: { vergleich: { args: [['Zufriedenheit', 'Wie läuft mein Leben?', 'Leiter von 0 bis 10'], ['Stimmung', 'Wie fühle ich mich gerade?', 'Freude, Stress, Ärger'], 290] } } },
      { t: T('2010 werteten Daniel Kahneman und Angus Deaton eine riesige Umfrage aus den USA aus.', 64), gfx: { zahl: { args: ['450.000', 'Antworten aus den USA', 420] } } },
      { t: T('Ergebnis: Ab etwa **75.000 Dollar** im Jahr steigt die Tagesstimmung nicht mehr. Die Zahl wurde weltberühmt.', 64), gfx: { chart: {} } },
      { t: T('Die Zufriedenheit mit dem Leben stieg dabei **weiter** – nur die Stimmung schien abzuflachen.', 64), gfx: { chart: {} } },
      { t: T('2021 fragte Matthew Killingsworth per Handy-App mehrmals täglich: Wie fühlst du dich gerade? **1,7 Millionen** Antworten.', 64), gfx: { z2: { draw: 'zahl', args: ['1,7 Mio.', 'Momentaufnahmen von 33.000 Menschen', 420] } } },
      { t: T('Sein Ergebnis: Das Wohlbefinden steigt mit dem Einkommen **weiter** – keine Grenze bei 75.000.', 64), gfx: { chart: { cls: 'a1' } } },
      { t: T('2023 werteten beide Seiten **gemeinsam** neu aus: Für die meisten steigt das Glück weiter.', 64), gfx: { chart: { cls: 'a1 a2', tf: [1, 0, 30] } } },
      { t: T('Nur bei den unglücklichsten rund 20 Prozent flacht es ab etwa 100.000 Dollar ab. Geld hilft gegen manches Leid, **nicht gegen alles**.', 64), gfx: { chart: { cls: 'a1 a2', tf: [1, 0, 30] } } },
      { t: T('Und jeder zusätzliche Euro zählt umso **weniger**, je mehr man schon hat.', 64), gfx: { muenzen: {} } },
      { t: T('Es zählt also der **Prozentsatz**, nicht der Betrag:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['von 20.000 auf 40.000 €', '≈', 'von 100.000 auf 200.000 €'], 320, 'etwa gleich viel Glückszuwachs'] } } },
      { t: T('Ein Beispiel: 3.000 Euro mehr im Jahr.', 64, { kind: 'big' }), gfx: { q1: { draw: 'formel', args: [['3.000 € mehr bei 30.000 €', '=', '+ 10 %'], 300] }, q2: { draw: 'formel', args: [['3.000 € mehr bei 300.000 €', '=', '+ 1 %'], 430] } } },
      { t: T('Dasselbe Geld – aber fürs Glück zählt es im ersten Fall etwa **zehnmal** so viel.', 64), gfx: { muenzen: {} } },
      { t: T('Auch das Wofür zählt: Studien finden, dass Ausgaben für **Erlebnisse**, Zeit und andere Menschen oft glücklicher machen als Dinge.', 64), gfx: { punkte: { args: [['Erlebnisse statt Dinge', 'Zeit kaufen: Arbeit abgeben', 'Geld für andere ausgeben'], 320] } } },
      { t: T('Woher kam die Grenze? 2010 wurde die Stimmung grob erfragt: Hattest du **gestern** viel Freude – ja oder nein?', 64), gfx: { v2: { draw: 'vergleich', args: [['2010', 'Ja-Nein-Fragen', 'über gestern'], ['2021', 'feine Skala', 'jetzt, per App'], 290] } } },
      { t: T('Wer schon oft Ja sagt, kann kaum noch mehr Ja sagen – die Messung stieß an eine **Decke**. Ein Teil der Grenze war ein Messproblem.', 64), gfx: { chart: {} } },
      { t: T('Und Lottogewinner? Schwedische Daten zeigen: Jahre später sind sie im Schnitt **zufriedener** als vorher – kein Lotto-Fluch.', 64), gfx: { z3: { draw: 'zahl', args: ['+', 'Lebenszufriedenheit nach großem Lottogewinn', 420] } } },
      { t: T('Umgekehrt trifft Geldmangel hart: **Schulden** und Armut gehören zu den stärksten Quellen von Stress.', 64), gfx: { p2: { draw: 'punkte', args: [['Schulden', 'unsichere Miete', 'keine Reserve für Notfälle'], 320] } } },
      { t: T('Geld wirkt also vor allem über Sicherheit und Freiheit:', 64, { kind: 'big' }), gfx: { f2: { draw: 'formel', args: [['mehr Geld', '→', 'mehr Sicherheit und Freiheit', '→', 'mehr Wohlbefinden'], 320] } } },
      recap(
        [{ gfx: 'chart', cls: 'a1 a2' }, { gfx: 'muenzen' }, { gfx: 'f1', draw: 'formel', args: [['von 20.000 auf 40.000 €', '≈', 'von 100.000 auf 200.000 €'], 320] }, { pic: 0, id: 'e' }],
        ['Glück steigt meist weiter', 'jeder Euro zählt weniger', 'Prozent zählt', 'Wofür zählt mit'],
      ),
    ],
    summary: ['2010: Grenze bei 75.000 $ – inzwischen überholt.', '2023 gemeinsame Studie: meist kein Plateau.', 'Jeder weitere Euro bringt weniger.'],
    sources: ['Kahneman & Deaton 2010, PNAS', 'Killingsworth 2021, PNAS', 'Killingsworth, Kahneman & Mellers 2023, PNAS'],
  },
  {
    id: 'neun-neunzig',
    area: 'WIRT',
    day: 11,
    hook: 'Warum kostet alles 9,99?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [img('preisschilder')],
    draw: {
      tacho(g) {
        for (const [y, km, d] of [[300, '79.900', 0], [460, '80.000', 900]] as const) {
          ink(g, RR(60, y, 240, 70, 10), { w: 3, d, t: 500 })
          text(g, 180, y + 48, `${km} Meilen`, { anchor: 'middle', size: 30, d: d + 300 })
        }
        arrow(g, L([330, 340], [330, 500]), { w: 3, d: 1600, t: 400 })
        text(g, 180, 600, 'deutlich billiger verkauft', { anchor: 'middle', d: 1900 })
      },
      kleid(g) {
        const none = () => ''
        vbars(g, [{ label: '34 Dollar', v: 55, fmt: none }, { label: '39 Dollar', v: 82, fmt: none, dense: true }, { label: '44 Dollar', v: 50, fmt: none }], { x: 50, base: 580, w: 70, gap: 100, h: 300, max: 100 })
        text(g, 40, 250, 'verkaufte Kleider', { cls: 's', d: 200 })
      },
      tanken(g) {
        ink(g, L([180, 620], [180, 450]), { w: 5, t: 400 })
        ink(g, RR(70, 230, 220, 220, 14), { w: 3.2, d: 200, t: 700 })
        hatch(g, RR(70, 230, 220, 40, 14), 700, true)
        text(g, 180, 258, 'Super', { anchor: 'middle', size: 20, d: 800, cls: 'halo' })
        text(g, 170, 360, '1,79', { anchor: 'middle', size: 64, d: 1000 })
        text(g, 252, 324, '9', { anchor: 'middle', size: 30, d: 1300 })
        text(g, 180, 420, 'Euro je Liter', { anchor: 'middle', cls: 's', d: 1400 })
      },
      etikett(g) {
        const sw = group(g, 'sway', 'transform-box: view-box; transform-origin: 70px 250px; --d: 1200ms')
        ink(sw, B([70, 250], [40, 290], [90, 330], [66, 396]), { w: 2, t: 500 })
        const tag: P[] = [[84, 330], [300, 330], [300, 470], [84, 470], [40, 400], [84, 330]]
        blank(sw, tag)
        ink(sw, tag, { w: 3.4, d: 300, t: 800 })
        ink(sw, E(66, 400, 8), { w: 2.4, d: 600, t: 200 })
        text(sw, 196, 424, '9,99 €', { anchor: 'middle', size: 62, d: 900 })
        const sc = st(sw, 'f1', '--dl:300ms')
        arrow(sc, L([104, 452], [290, 452]), { w: 2.6, t: 0, head: 9 })
        const r = st(sw, 'x1', '--o:50% 50%;--dl:900ms')
        ink(r, E(122, 402, 26, 36, -100, 250), { w: 3, t: 0 })
        const zehn = st(g, 'f2', '--dl:300ms')
        text(zehn, 196, 560, '≈ 10 €', { anchor: 'middle', size: 44, fade: false })
      },
      paare(g) {
        const row = (y: number, a: string, b: string, gap: number, lab: string, d: number) => {
          text(g, 180 - gap / 2 - 10, y, a, { anchor: 'end', size: 40, d })
          text(g, 180 + gap / 2 + 10, y, b, { anchor: 'start', size: 40, d: d + 200 })
          arrow(g, L([180 - gap / 2, y - 14], [180 + gap / 2, y - 14]), { w: 2.6, d: d + 500, t: 300, head: 8 })
          text(g, 180, y + 34, lab, { anchor: 'middle', cls: 's', d: d + 700 })
        }
        row(330, '2,99', '3,00', 90, 'fühlt sich weit an', 0)
        row(500, '2,00', '2,01', 12, 'kaum ein Unterschied', 1200)
      },
      luxus(g) {
        const tag = (x: number, s: string, serif: boolean, d: number) => {
          const p: P[] = [[x + 20, 300], [x + 140, 300], [x + 140, 400], [x + 20, 400], [x - 6, 350], [x + 20, 300]]
          ink(g, p, { w: 3, d, t: 600 })
          text(g, x + 76, 362, s, { anchor: 'middle', size: serif ? 34 : 28, d: d + 400, cls: serif ? 'it' : '' })
        }
        tag(20, '99,99 €', false, 0)
        tag(196, '100 €', true, 600)
        check(st(g, 'x1', '--o:50% 50%;--dl:600ms'), 272, 452, 1.4)
      },
    },
    scenes: [
      { t: HOOK(70), gfx: { etikett: {} } },
      { t: T('Wir lesen Preise von **links nach rechts** – und die erste Ziffer bleibt hängen.', 64), gfx: { etikett: { cls: 'a1' } } },
      { t: T('Das Gehirn schätzt eine Zahl, **bevor** es sie ganz gelesen hat. Die erste Ziffer wiegt am schwersten.', 64), gfx: { etikett: { cls: 'a1' } } },
      { t: T('9,99 € fühlt sich nach „neun-irgendwas“ an – obwohl es praktisch **zehn Euro** sind.', 64), gfx: { etikett: { cls: 'a1 a2' } } },
      { t: T('Im Kopf läuft ungefähr diese Rechnung:', 64, { kind: 'big' }), gfx: { f1: { draw: 'formel', args: [['9,99 €', '≈', '9 € und ein bisschen'], 320, 'gefühlt'] }, f2: { draw: 'formel', args: [['9,99 €', '≈', '10 €'], 460, 'tatsächlich'] } } },
      { t: T('Studien bestätigen den **Linke-Ziffer-Effekt**: 2,99 wirkt deutlich günstiger als 3,00.', 64), gfx: { paare: {} } },
      { t: T('Ein Versuch mit Versandkatalogen: Dasselbe Kleid verkaufte sich für **39 Dollar** besser als für 34 oder 44.', 64), gfx: { kleid: {} } },
      { t: T('Sogar bei Gebrauchtwagen: Knapp unter einer runden Kilometer- bzw. Meilenzahl bringt ein Auto spürbar **mehr Geld**.', 64), gfx: { tacho: {} } },
      { t: T('Tankstellen treiben es auf die Spitze: Fast jeder Spritpreis endet auf eine **kleine 9**.', 64), gfx: { tanken: {} } },
      { t: T('Luxusmarken meiden die 9 oft **bewusst**: Runde Preise wirken hochwertiger.', 64), gfx: { luxus: { cls: 'a1' } } },
      {
        t: T('Und die Erklärung, krumme Preise sollten **Diebstahl** an der Kasse verhindern, ist kaum belegt.', 470),
        pics: { p: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [72, 55, 1.0], cam2: [72, 55, 1.15] } },
      },
      { t: T('Händler nennen das **Schwellenpreis**: knapp unter einer runden Marke – 9,99 statt 10, 199 statt 200.', 64), gfx: { z1: { draw: 'zahl', args: ['9,99', 'Schwellenpreis', 420] } } },
      { t: T('Am stärksten wirkt es, wenn die **erste Ziffer** wechselt:', 64, { kind: 'big' }), gfx: { f3: { draw: 'formel', args: [['3,00 → 2,99', '=', 'gefühlt großer Sprung'], 300] }, f4: { draw: 'formel', args: [['3,60 → 3,59', '=', 'kaum ein Unterschied'], 440] } } },
      { t: T('Wer schnell entscheidet, fällt eher darauf herein – an der **Kasse** oder im Online-Shop.', 64), gfx: { etikett: { cls: 'a1', tf: [0.8, 36, 100] } } },
      { t: T('Gegenmittel: Preise im Kopf **aufrunden**.', 64, { kind: 'big' }), gfx: { f5: { draw: 'formel', args: [['9,99', '→', '10'], 320, 'aufrunden'] }, f6: { draw: 'formel', args: [['199', '→', '200'], 440] } } },
      recap(
        [{ gfx: 'etikett', cls: 'a1 a2' }, { gfx: 'paare' }, { gfx: 'tanken' }, { gfx: 'luxus', cls: 'a1' }],
        ['erste Ziffer zählt', '2,99 wirkt billiger als 3,00', 'Sprit endet auf 9', 'Luxus: runde Preise'],
      ),
    ],
    summary: ['Die erste Ziffer prägt das Preisgefühl.', '2,99 wirkt viel billiger als 3,00.', 'Luxusmarken bevorzugen runde Preise.'],
    sources: ['Thomas & Morwitz 2005, Journal of Consumer Research', 'Anderson & Simester 2003, Quantitative Marketing and Economics'],
  },
]
