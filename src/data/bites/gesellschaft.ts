import type { Bite } from '../feed'
import { img } from './img'
import {
  B, E, HOOK, L, RR, T, arrow, balance, bigText, blank, check, coin, cross, dashes, fig, group, hatch, hbars, ink, mk, pop, question, ring, st, text, timeline, vbars, type P,
} from './draw'

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
      {
        t: T('Der einzige fast vollständige Wikingerhelm – der Gjermundbu-Helm aus Norwegen – ist schlicht **rund**.', 60),
        pics: { g: { img: 0, x: 40, y: 220, w: 280, h: 300, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 45, 1.2], cap: 'Gjermundbu-Helm, um 970' } },
        gfx: { helm: { cls: 'a1 a2', tf: [0.42, 196, 380], o: 0 } },
      },
      { t: T('Die Hörner kamen erst im **19. Jahrhundert** dazu – mit Malern der Romantik.', 64), gfx: { zeit: {} } },
      {
        t: T('Vor allem die Kostüme zu Wagners Oper „**Ring des Nibelungen**“ 1876 setzten den Wikingern Hörner auf.', 486),
        gfx: { zeit: { tf: [0.6, 72, -168] }, oper: { tf: [0.75, 45, 38] } },
      },
      {
        t: { text: 'Hörnerhelme gab es – aber viel früher: die **Veksø-Helme** aus der Bronzezeit.', x: 184, y: 64, w: 160, kind: 'mid' },
        pics: { v: { img: 1, x: 20, y: 60, w: 152, h: 230, enter: 'blot', cam: [50, 50, 1.1], cap: 'Veksø-Helm, Dänemark' } },
        gfx: { zeit: { cls: 'a1', tf: [1, 0, 40] } },
      },
      {
        t: T('Rund **2.900 Jahre** alt – fast 2.000 Jahre vor den Wikingern. Im Kampf wären Hörner nur hinderlich.', 64),
        pics: { v: { img: 1, x: 70, y: 220, w: 220, h: 260, cam: [50, 45, 1.25] } },
        gfx: { zeit: { cls: 'a1', tf: [0.9, 18, 196] } },
      },
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
      heights(g) {
        ink(g, L([40, 652], [40, 282]), { w: 2.6, t: 500 })
        for (let k = 0; k <= 18; k++) ink(g, L([40, 650 - k * 20], [k % 5 ? 47 : 54, 650 - k * 20]), { w: 1.8, d: 200 + k * 25, t: 80 })
        for (const [k, l] of [[5, '0,5'], [10, '1,0'], [15, '1,5']] as const) text(g, 60, 650 - k * 20 + 5, l, { cls: 's', d: 600 })
        ink(g, L([30, 652], [340, 652]), { w: 3, d: 100, t: 500 })
        const nb = st(g, 'm2', '--m2: scaleY(0.929); transform-origin: 155px 650px; --dl: 1800ms')
        const bar = st(nb, 'grow-y', '--d:500ms')
        hatch(bar, RR(120, 312, 70, 338, 6), 500)
        ink(bar, RR(120, 312, 70, 338, 6), { w: 2.8, t: 0 })
        const top = st(g, 'm2', '--m2: translateY(24px); --dl: 1800ms')
        const hp = pop(top, 1300)
        const hat: P[] = [
          ...B([119, 304], [133, 296], [141, 278], [155, 278]),
          ...B([155, 278], [169, 278], [177, 296], [191, 304]).slice(1),
          ...B([191, 304], [169, 294], [141, 294], [119, 304]).slice(1),
        ]
        hatch(hp, hat, 1500, true)
        ink(hp, hat, { w: 2.6, t: 0 })
        text(st(top, 'h2', '--dl:1800ms'), 155, 262, '1,69 m', { anchor: 'middle', d: 1500 })
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
      { t: { text: 'Napoleon maß bei seinem Tod rund **1,69 Meter**.', x: 130, y: 80, w: 212 }, pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } }, gfx: { heights: {} } },
      { t: { text: 'Für einen Franzosen um 1800 war das **Durchschnitt**.', x: 130, y: 80, w: 212 }, pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } }, gfx: { heights: { cls: 'a1' } } },
      {
        t: T('Gemessen wurde aber in **französischen Zoll** – und die waren länger als englische.', 548),
        pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } },
        gfx: { rulers: { from: { tf: [1, 60, 0], o: 0 } } },
      },
      {
        t: { text: 'Englisch gelesen wurden aus „5 pieds 2 pouces“ nur **1,57 Meter**.', x: 130, y: 70, w: 212 },
        pics: { p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', cam: [48, 14, 1.5] } },
        gfx: { heights: { cls: 'a1 a2' } },
      },
      {
        t: { text: 'Den Rest erledigte **Propaganda**: Der Brite James Gillray zeichnete ihn als winzigen „Little Boney“.', x: 18, y: 500, w: 324, card: true },
        pics: {
          p: { img: 0, x: 20, y: 64, w: 96, h: 120, r: 'oval', o: 0 },
          g: { img: 1, x: 0, y: 0, w: 360, h: 680, r: 0, enter: 'blot', cam: [50, 50, 1.02], cam2: [24, 44, 1.5] },
        },
      },
      {
        t: { text: 'Seine Soldaten nannten ihn liebevoll _le petit caporal_ – den kleinen Korporal.', x: 20, y: 496, w: 236 },
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
        t: T('In Wirklichkeit kam er auf einem **Maultier** über den Pass – geführt von einem Bergbauern.', 560),
        pics: {
          a: { img: 2, x: 16, y: 56, w: 328, h: 470, cam: [48, 30, 1.18] },
          d: { img: 3, x: 16, y: 56, w: 328, h: 470, enter: 'wipe', z: 2, cam: [45, 40, 1.05], cam2: [42, 28, 1.25], cap: 'Paul Delaroche, 1850' },
        },
      },
    ],
    summary: ['Rund 1,69 m: Durchschnitt für seine Zeit.', 'Französische Zoll waren länger als englische.', 'Karikaturen machten ihn klein, Gemälde groß.'],
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
        gfx: { schiff: { cls: 'a1' } },
      },
      { t: T('Eratosthenes berechnete um 240 v. Chr. sogar ihren **Umfang** – aus Schatten und einem Winkel.', 160), gfx: { erato: {} } },
      { t: T('Könige hielten im Mittelalter den **Reichsapfel**: eine Kugel als Zeichen der Welt.', 520), gfx: { apfel: {} } },
      {
        t: T('Der Mythos entstand erst im **19. Jahrhundert**. Auch dieser „mittelalterliche“ Holzstich stammt von 1888.', 480),
        pics: { f: { img: 1, x: 16, y: 56, w: 328, h: 396, enter: 'blot', cam: [50, 50, 1.0], cam2: [34, 40, 1.35], cap: 'Holzstich aus Flammarion, 1888' } },
      },
      {
        t: T('Washington Irving schmückte 1828 die **Kolumbus**-Geschichte aus – als hätte er gegen Flacherde-Gläubige gekämpft.', 330),
        pics: { f: { img: 1, x: 90, y: 60, w: 180, h: 220, cam: [34, 40, 1.35] } },
      },
      { t: T('Gestritten wurde 1492 über die **Größe** der Erde – und da lag Kolumbus falsch.', 64), gfx: { route: {} } },
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
      { t: T('Bei Gizeh fand man die **Arbeiterstadt**: Bäckereien, Brauereien, Unterkünfte.', 64), gfx: { pyramide: { tf: [0.5, 170, 170] }, stadt: { tf: [1, 0, -20] } } },
      { t: T('Und Gräber der Arbeiter direkt neben den Pyramiden. Sklaven hätte man nie so **ehrenvoll** bestattet.', 64), gfx: { pyramide: { tf: [0.5, 170, 170] }, stadt: { cls: 'a1', tf: [1, 0, -20] } } },
      { t: T('Die Knochen zeigen schwere Arbeit – aber auch **Medizin**: verheilte Brüche, sogar Amputationen.', 64), gfx: { knochen: {} } },
      { t: T('Es gab Brot, Bier und Fleisch. Viele waren **Bauern**, die abwechselnd Dienst taten.', 64), gfx: { wechsel: {} } },
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
      { t: T('Du darfst alles tun, was **nicht verboten** ist.', 64), gfx: { du: { cls: 'a1' } } },
      {
        t: T('Für den **Staat** gilt das Gegenteil: Eingreifen darf er nur, wenn ein Gesetz es erlaubt.', 64),
        gfx: { du: { cls: 'a1', tf: [0.62, -17, 132] }, staat: { tf: [0.62, 153, 132], from: { tf: [0.62, 233, 132], o: 0 } } },
      },
      { t: T('Juristen nennen das den _Vorbehalt des Gesetzes_.', 64), gfx: { du: { cls: 'a1', tf: [0.62, -17, 132] }, staat: { cls: 'a1', tf: [0.62, 153, 132] } } },
      {
        t: T('Wie weit deine Freiheit reicht, zeigt ein Urteil: Sogar **Reiten im Wald** gehört dazu.', 486),
        pics: { r: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 50, 1.05], cam2: [50, 45, 1.2] } },
      },
      {
        t: T('Ein Landesgesetz darf es einschränken. Das Urteil von 1989 heißt seitdem _„Reiten im Walde“_.', 72),
        pics: { r: { img: 0, x: 16, y: 210, w: 160, h: 200, cam: [50, 45, 1.2] } },
        gfx: { hammer: { tf: [0.7, 140, 60] } },
      },
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
      { t: T('Das Sprichwort sagt: nein. Im deutschen Strafrecht ist es **feiner**.', 64), gfx: { waage: { cls: 'a1', tf: [0.8, 36, 60] } } },
      { t: T('Wer nicht weiß, dass etwas verboten ist, irrt sich über das Verbot.', 64), gfx: { baum: {} } },
      { t: T('Straffrei bleibt nur, wer den Irrtum **nicht vermeiden** konnte.', 64), gfx: { baum: { cls: 'a1' } } },
      { t: T('Wer sich hätte erkundigen können – bei einer Anwältin oder Behörde –, wird bestraft. Höchstens **milder**.', 64), gfx: { baum: { cls: 'a1 a2', tf: [1, 0, 50] } } },
      { t: T('Anders beim **Irrtum über Tatsachen**: Wer einen fremden Schirm für seinen hält, stiehlt nicht.', 64), gfx: { schirm: { cls: 'a1' } } },
      { t: T('Ihm fehlt der **Vorsatz**: Er kennt nicht das Gesetz nicht, sondern die Lage.', 64), gfx: { schirm: { cls: 'a1 a2' } } },
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
      { t: T('Artikel 5 des NATO-Vertrags: Ein bewaffneter Angriff auf ein Mitglied gilt als **Angriff auf alle**.', 64), gfx: { bund: { cls: 'a1' } } },
      { t: T('Im Text steht aber: Jedes Land hilft mit den Maßnahmen, **die es für erforderlich hält**.', 64), gfx: { mittel: {} } },
      { t: T('Auch **Waffengewalt** ist möglich. Wie geholfen wird, entscheidet jedes Land selbst.', 64), gfx: { mittel: { cls: 'a1' } } },
      { t: T('Ausgerufen wurde der Bündnisfall bisher nur **einmal**: nach den Anschlägen vom 11. September 2001.', 64), gfx: { zeit: {} } },
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
      { t: T('Die Beteiligung liegt seitdem meist um **90 Prozent**.', 64), gfx: { s1: { draw: 'saeulen', args: [1] } } },
      { t: T('In Deutschland waren es bei der Bundestagswahl 2025 rund **82 Prozent** – so viel wie seit Jahrzehnten nicht.', 64), gfx: { s2: { draw: 'saeulen', args: [2] } } },
      { t: T('Bei Landtags- und Europawahlen ist sie oft viel **niedriger**.', 64), gfx: { s3: { draw: 'saeulen', args: [3] } } },
      { t: T('Studien zeigen: Wahlpflicht erhöht die Beteiligung und gleicht sie zwischen **Arm und Reich** an.', 64), gfx: { armreich: {} } },
      { t: T('Ob die Leute dadurch **informierter** wählen, ist offen.', 64), gfx: { frage: {} } },
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
      { t: T('1637 erreichten **Tulpenzwiebeln** absurde Preise. Eine einzige soll so viel gekostet haben wie ein Haus.', 64), gfx: { tausch: { tf: [0.9, 18, 120] } } },
      { t: T('Dann brach der Markt in wenigen Tagen **ein**.', 64), gfx: { kurs: {} } },
      { t: T('Lange galt das als erste **Spekulationsblase** – mit ruinierten Existenzen.', 64), gfx: { kurs: { cls: 'a1' } } },
      { t: T('Die Historikerin Anne Goldgar fand in den Archiven aber **kaum Pleiten**.', 64), gfx: { archiv: {} } },
      { t: T('Gehandelt hatte eine kleine Schicht reicher Kaufleute – viele Verträge wurden **nie erfüllt**.', 64), gfx: { vertrag: { cls: 'a1' } } },
      {
        t: T('Die Horror-Geschichten stammen aus **moralischen Flugschriften** – und aus einem Bestseller von Charles Mackay, 1841.', 420),
        pics: { s: { img: 0, x: 16, y: 56, w: 328, h: 330, cam: [62, 45, 1.6] } },
      },
      {
        t: T('Heute sind die Niederlande der größte **Tulpenexporteur** der Welt.', 504),
        pics: { f: { img: 1, x: 16, y: 56, w: 328, h: 420, enter: 'blot', cam: [50, 60, 1.05], cam2: [50, 60, 1.2] } },
      },
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
      { t: T('Für Delhi gibt es dafür aber **keinen Beleg** aus der Zeit.', 64), gfx: { kurve: { cls: 'a1' } } },
      { t: T('Gut dokumentiert ist **Hanoi 1902**: Die Kolonialverwaltung zahlte für jeden Rattenschwanz.', 64), gfx: { ratte: { cls: 'a1' } } },
      { t: T('Bald liefen Ratten **ohne Schwanz** herum – man ließ sie leben, damit sie sich vermehren.', 64), gfx: { ratte: { cls: 'a1 a2' } } },
      { t: T('Ökonomen nennen das **Fehlanreiz**: Wird ein Maß zum Ziel, taugt es nicht mehr als Maß.', 64), gfx: { ziel: { tf: [1, 0, 40] } } },
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
      { t: T('2010 meldeten Daniel Kahneman und Angus Deaton: Ab etwa **75.000 Dollar** im Jahr steigt die Tagesstimmung nicht mehr.', 64), gfx: { chart: {} } },
      { t: T('2021 befragte Matthew Killingsworth über 30.000 Menschen per Handy: Das Wohlbefinden steigt **weiter**.', 64), gfx: { chart: { cls: 'a1' } } },
      { t: T('2023 werteten beide Seiten **gemeinsam** neu aus: Für die meisten steigt es weiter – nur bei den Unglücklichsten flacht es ab.', 64), gfx: { chart: { cls: 'a1 a2', tf: [1, 0, 30] } } },
      { t: T('Und jeder zusätzliche Euro zählt umso **weniger**, je mehr man schon hat.', 64), gfx: { muenzen: {} } },
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
      { t: T('9,99 € fühlt sich nach „neun-irgendwas“ an – obwohl es praktisch **zehn Euro** sind.', 64), gfx: { etikett: { cls: 'a1 a2' } } },
      { t: T('Studien bestätigen den **Linke-Ziffer-Effekt**: 2,99 wirkt deutlich günstiger als 3,00.', 64), gfx: { paare: {} } },
      { t: T('Luxusmarken meiden die 9 oft **bewusst**: Runde Preise wirken hochwertiger.', 64), gfx: { luxus: { cls: 'a1' } } },
      {
        t: T('Und die Erklärung, krumme Preise sollten **Diebstahl** an der Kasse verhindern, ist kaum belegt.', 470),
        pics: { p: { img: 0, x: 16, y: 56, w: 328, h: 390, enter: 'blot', cam: [72, 55, 1.0], cam2: [72, 55, 1.15] } },
      },
    ],
    summary: ['Die erste Ziffer prägt das Preisgefühl.', '2,99 wirkt viel billiger als 3,00.', 'Luxusmarken bevorzugen runde Preise.'],
    sources: ['Thomas & Morwitz 2005, Journal of Consumer Research', 'Anderson & Simester 2003, Quantitative Marketing and Economics'],
  },
]
