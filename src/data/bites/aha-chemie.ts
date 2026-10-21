import type { Bite } from '../feed'
import { img } from './img'
import { B, E, HOOK, L, RR, T, arrow, blank, brain, check, clock, cross, dashes, eye, fig, group, hatch, ink, st, text, timeline, vbars, type P } from './draw'
import { arcArrow, ball, box, dot, drop, flame, rad, sun, thermo, water, waveP } from './kit'

// Chemie: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Becherglas, Boden bei y, Füllhöhe fill (0…1) */
function beaker(g: Element, x: number, y: number, w: number, h: number, fill = 0.7, d = 0, dense = false): void {
  ink(g, [[x, y - h], [x, y], [x + w, y], [x + w, y - h]], { w: 3, d, t: 600 })
  if (fill > 0) {
    const top = y - h * fill
    hatch(g, RR(x + 3, top, w - 6, y - top - 3, 2), d + 400, dense)
    ink(g, L([x + 3, top], [x + w - 3, top]), { w: 1.8, d: d + 300, t: 300 })
  }
}

/** Eiswürfel (Quader-Andeutung) */
function cube(g: Element, x: number, y: number, s = 30, d = 0): void {
  blank(g, RR(x, y, s, s, 4))
  ink(g, RR(x, y, s, s, 4), { w: 2.4, d, t: 300 })
  ink(g, [[x + 6, y + 8], [x + s * 0.45, y + 8]], { w: 1.6, d: d + 200, t: 100 })
}

/** Kerze mit Flamme, Docht oben bei (x, top) */
function candle(g: Element, x: number, top: number, d = 0, lit = true): void {
  ink(g, RR(x - 26, top + 10, 52, 200, 6), { w: 3, d, t: 600 })
  ink(g, L([x, top + 10], [x, top - 6]), { w: 2.4, d: d + 300, t: 150 })
  if (lit) flame(g, x, top - 4, 0.9, d + 500)
}

/** Seifenmolekül: Kopf (Kreis) + Schwanz (Zickzack) ab (x, y) in Richtung deg */
function soap(g: Element, x: number, y: number, deg: number, len = 40, d = 0): void {
  const a = rad(deg)
  const nx = -Math.sin(a)
  const ny = Math.cos(a)
  const pts: P[] = []
  for (let i = 0; i <= 6; i++) {
    const t = 7 + (i / 6) * len
    pts.push([x + Math.cos(a) * t + nx * (i % 2 ? 4 : -4), y + Math.sin(a) * t + ny * (i % 2 ? 4 : -4)])
  }
  ink(g, pts, { w: 1.8, d: d + 100, t: 200 })
  ball(g, x, y, 6, { d, fill: 'dicht', w: 1.6, t: 0 })
}

/** Popcorn-Korn im Schnitt */
function kernel(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const o = [...B([cx, cy - 60 * s], [cx + 50 * s, cy - 50 * s], [cx + 50 * s, cy + 40 * s], [cx, cy + 60 * s]), ...B([cx, cy + 60 * s], [cx - 50 * s, cy + 40 * s], [cx - 50 * s, cy - 50 * s], [cx, cy - 60 * s]).slice(1)]
  blank(g, o)
  ink(g, o, { w: 4, d, t: 800 })
  const i = [...B([cx, cy - 46 * s], [cx + 36 * s, cy - 38 * s], [cx + 36 * s, cy + 30 * s], [cx, cy + 44 * s]), ...B([cx, cy + 44 * s], [cx - 36 * s, cy + 30 * s], [cx - 36 * s, cy - 38 * s], [cx, cy - 46 * s]).slice(1)]
  hatch(g, i, d + 600)
}

/** Popcorn-Flocke (Wolkenblume) */
function puff(g: Element, cx: number, cy: number, s = 1, d = 0): void {
  const pts: P[] = []
  for (let k = 0; k < 7; k++) {
    const a0 = rad(k * (360 / 7))
    const a1 = rad((k + 1) * (360 / 7))
    const r = 24 * s
    const m = (a0 + a1) / 2
    pts.push(...B([cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(m - 0.3) * r * 1.6, cy + Math.sin(m - 0.3) * r * 1.6], [cx + Math.cos(m + 0.3) * r * 1.6, cy + Math.sin(m + 0.3) * r * 1.6], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r]).slice(k ? 1 : 0))
  }
  blank(g, pts)
  ink(g, pts, { w: 2.6, d, t: 700 })
}

export const AHA_CHEMIE: Bite[] = [
  {
    id: 'eis-schwimmt',
    area: 'CHE',
    day: 2,
    hook: 'Warum schwimmt Eis – obwohl fast alles andere im festen Zustand sinkt?',
    mood: 'ruhig',
    ambience: 'wellen',
    images: [img('schneeflocke'), img('eisberg')],
    draw: {
      glas(g) {
        beaker(g, 100, 420, 160, 300, 0.75)
        cube(g, 130, 190, 40, 700)
        cube(g, 190, 196, 36, 800)
      },
      wachs(g) {
        beaker(g, 50, 600, 110, 200, 0.75, 0)
        blank(g, RR(70, 560, 40, 36, 4))
        hatch(g, RR(70, 560, 40, 36, 4), 600, true)
        ink(g, RR(70, 560, 40, 36, 4), { w: 2.4, d: 500, t: 300 })
        text(g, 105, 640, 'Wachs: sinkt', { anchor: 'middle', cls: 's', d: 800 })
        beaker(g, 200, 600, 110, 200, 0.75, 300)
        cube(g, 236, 436, 38, 900)
        text(g, 255, 640, 'Eis: schwimmt', { anchor: 'middle', cls: 's', d: 1100 })
      },
      dichte(g) {
        vbars(g, [
          { label: 'Wasser', v: 1, fmt: (v) => `${v.toFixed(2).replace('.', ',')} kg/l`, dense: true },
          { label: 'Eis', v: 0.92, fmt: (v) => `${v.toFixed(2).replace('.', ',')} kg/l` },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 250 })
      },
      molekuel(g) {
        water(g, 180, 440, 3.2, 0)
        ink(g, E(180, 440, 40, 40, 38, 142), { w: 2, d: 800, t: 400 })
        text(g, 180, 570, '104,5°', { anchor: 'middle', size: 20, d: 1000 })
        text(g, 180, 380, 'O', { anchor: 'middle', size: 20, cls: 'halo', d: 900 })
      },
      ladung(g) {
        water(g, 180, 440, 3.2, 0)
        text(g, 180, 330, 'leicht negativ (−)', { anchor: 'middle', d: 800 })
        text(g, 80, 560, '+', { anchor: 'middle', size: 26, d: 1000 })
        text(g, 280, 560, '+', { anchor: 'middle', size: 26, d: 1000 })
        text(g, 180, 620, 'Wasserstoff: leicht positiv', { anchor: 'middle', cls: 's', d: 1200 })
      },
      bruecken(g) {
        const mols: [number, number, number][] = [[90, 400, 0], [230, 380, 60], [150, 540, -40], [290, 530, 20]]
        mols.forEach(([x, y, r], i) => water(g, x, y, 1.5, r, i * 200))
        for (const [a, b] of [[[118, 420], [196, 392]], [[166, 506], [118, 440]], [[250, 410], [276, 500]], [[198, 548], [258, 540]]] as const) dashes(g, L(a as P, b as P), { w: 1.6, d: 1000, dash: 5, gap: 5 })
        text(g, 180, 630, 'Wasserstoffbrücken', { anchor: 'middle', d: 1400 })
      },
      fluessig(g) {
        let seed = 3
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) water(g, 50 + c * 64 + rnd() * 10, 360 + r * 64 + rnd() * 10, 1, rnd() * 360, (r * 5 + c) * 40)
        text(g, 180, 640, 'flüssig: dicht gedrängt', { anchor: 'middle', cls: 's', d: 1100 })
      },
      gitter(g) {
        const R = 34
        const hexes: P[] = []
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) hexes.push([60 + c * R * 1.732 + (r % 2) * R * 0.866, 380 + r * R * 1.5])
        const seen = new Set<string>()
        hexes.forEach(([cx, cy], i) => {
          for (let k = 0; k < 6; k++) {
            const a = [cx + Math.cos(rad(k * 60 + 30)) * R, cy + Math.sin(rad(k * 60 + 30)) * R] as P
            const b = [cx + Math.cos(rad(k * 60 + 90)) * R, cy + Math.sin(rad(k * 60 + 90)) * R] as P
            const key = [a, b].map((p) => p.map((v) => Math.round(v)).join(',')).sort().join('|')
            if (seen.has(key)) continue
            seen.add(key)
            ink(g, L(a, b), { w: 2.2, d: i * 80, t: 150 })
          }
        })
        hexes.forEach(([cx, cy], i) => {
          for (let k = 0; k < 6; k += 2) dot(g, cx + Math.cos(rad(k * 60 + 30)) * R, cy + Math.sin(rad(k * 60 + 30)) * R, 4, 600 + i * 60)
        })
        const hole = st(g, 'x1', `--o: ${hexes[5][0]}px ${hexes[5][1]}px`)
        text(hole, hexes[5][0], hexes[5][1] + 5, 'Platz', { anchor: 'middle', cls: 's', fade: false })
        text(g, 180, 640, 'Eis: Sechsecke', { anchor: 'middle', cls: 's', d: 1200 })
      },
      eislauf(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, RR(20, 562, 320, 60, 2), 300)
        ink(g, L([20, 556], [340, 556]), { w: 1.4, d: 700, t: 500 })
        ink(g, RR(110, 490, 120, 40, 14), { w: 2.8, d: 300, t: 500 })
        ink(g, L([100, 548], [250, 548]), { w: 3, d: 600, t: 300 })
        for (const x of [130, 220]) ink(g, L([x, 530], [x, 548]), { w: 2.4, d: 700, t: 150 })
        text(g, 180, 650, 'dünne, flüssigkeitsähnliche Schicht', { anchor: 'middle', cls: 's halo', d: 1100 })
      },
      flocke(g) {
        for (let k = 0; k < 6; k++) {
          const a = rad(k * 60 - 90)
          ink(g, L([180, 470], [180 + Math.cos(a) * 130, 470 + Math.sin(a) * 130]), { w: 3, d: k * 120, t: 400 })
          for (const t of [0.45, 0.75]) {
            const m: P = [180 + Math.cos(a) * 130 * t, 470 + Math.sin(a) * 130 * t]
            for (const s of [-1, 1]) ink(g, L(m, [m[0] + Math.cos(a + s * 0.9) * 30 * (1.2 - t), m[1] + Math.sin(a + s * 0.9) * 30 * (1.2 - t)]), { w: 2, d: 700 + k * 80, t: 150 })
          }
        }
      },
      see(g) {
        const lake: P[] = [...B([30, 400], [60, 600], [300, 600], [330, 400])]
        ink(g, lake, { w: 3, t: 800 })
        ink(g, L([30, 400], [330, 400]), { w: 2, d: 300, t: 400 })
        text(g, 180, 430, '0 °C', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 180, 500, '2 °C', { anchor: 'middle', cls: 's', d: 850 })
        text(g, 180, 570, '4 °C', { anchor: 'middle', d: 1000 })
        const ice = st(g, 'x1', '--o: 180px 400px')
        hatch(ice, RR(30, 386, 300, 14, 3), 0, true)
        ink(ice, RR(30, 386, 300, 14, 3), { w: 2.4, t: 0 })
        const fish = st(g, 'x2', '--o: 220px 560px')
        ink(fish, [...B([250, 560], [264, 546], [290, 546], [300, 560]), ...B([300, 560], [290, 574], [264, 574], [250, 560]).slice(1)], { w: 2.2, t: 0 })
        ink(fish, [[250, 560], [238, 550], [238, 570], [250, 560]], { w: 2, t: 0 })
      },
      tiefsee(g) {
        ink(g, B([30, 400], [60, 600], [300, 600], [330, 400]), { w: 3, t: 800 })
        hatch(g, [...B([30, 400], [60, 600], [300, 600], [330, 400])], 500, true)
        text(g, 180, 380, 'von unten zugefroren?', { anchor: 'middle', d: 900 })
        cross(g, 300, 330, 1, 1200)
      },
      flasche(g) {
        const b: P[] = [[150, 340], [150, 380], [120, 420], [120, 600], [240, 600], [240, 420], [210, 380], [210, 340]]
        hatch(g, [[124, 440], [236, 440], [236, 596], [124, 596]], 500)
        ink(g, b, { w: 3, t: 800 })
        ink(g, [[200, 470], [214, 500], [204, 520], [226, 560]], { w: 2.4, d: 1000, t: 300 })
        for (const [a, c] of [[[110, 500], [90, 500]], [[250, 500], [270, 500]]] as const) arrow(g, L(a as P, c as P), { w: 2.2, d: 1200, t: 200, head: 8 })
      },
      fels(g) {
        const rock: P[] = [[40, 600], [60, 420], [140, 380], [240, 390], [320, 440], [330, 600], [40, 600]]
        hatch(g, rock, 500)
        ink(g, rock, { w: 3, t: 900 })
        blank(g, [[176, 382], [186, 382], [200, 500], [178, 600], [170, 600], [186, 500], [176, 382]])
        ink(g, [[180, 384], [194, 500], [174, 600]], { w: 2.2, d: 700, t: 400 })
        for (const [a, c] of [[[176, 470], [140, 470]], [[196, 470], [232, 470]]] as const) arrow(g, L(a as P, c as P), { w: 2.4, d: 1100, t: 200, head: 8 })
        text(g, 180, 640, 'Frostsprengung', { anchor: 'middle', d: 1300 })
      },
      eisberg(g) {
        ink(g, waveP(20, 340, 400, 4, 60), { w: 2.4, t: 700 })
        const berg: P[] = [[120, 400], [150, 340], [190, 330], [220, 400], [270, 470], [260, 600], [180, 640], [90, 600], [80, 480], [120, 400]]
        blank(g, berg)
        hatch(g, berg.filter(([, y]) => y >= 400).concat([[120, 400]]), 900)
        ink(g, berg, { w: 3, d: 300, t: 900 })
        text(g, 300, 360, 'ein Zehntel', { anchor: 'middle', cls: 's', d: 1200 })
        text(g, 310, 560, 'neun Zehntel', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        beaker(g, 110, 600, 140, 200, 0.75)
        cube(g, 160, 434, 40, 700)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { glas: {} } },
      { t: T('Die meisten Stoffe ziehen sich beim Erstarren zusammen. Ein Stück festes Wachs **sinkt** in flüssigem Wachs.', 64), gfx: { wachs: {} } },
      { t: T('Bei Wasser ist es umgekehrt: Eis ist rund **neun Prozent** leichter als flüssiges Wasser – darum schwimmt es oben.', 64), gfx: { dichte: {} } },
      { t: T('Der Grund steckt im Molekül: ein Sauerstoff-Atom, zwei Wasserstoff-Atome – nicht in einer Linie, sondern **gewinkelt**.', 64), gfx: { molekuel: {} } },
      { t: T('Der Sauerstoff zieht die Elektronen an sich. Er wird leicht **negativ**, die beiden Wasserstoffe leicht positiv.', 64), gfx: { ladung: {} } },
      { t: T('Darum ziehen sich Wassermoleküle an: Plus zu Minus. Diese lockeren Bindungen heißen **Wasserstoffbrücken**.', 64), gfx: { bruecken: {} } },
      { t: T('Im flüssigen Wasser bilden und lösen sie sich ständig. Die Moleküle **drängeln** sich dicht aneinander.', 64), gfx: { fluessig: {} } },
      { t: T('Beim Gefrieren rastet jedes Molekül in ein festes Gitter ein: **Sechsecke** mit viel freiem Raum in der Mitte.', 64), gfx: { gitter: {} } },
      { t: T('Dieses Gitter braucht **mehr Platz** als die drängelnde Flüssigkeit. Gleiche Masse, mehr Volumen – Eis ist leichter.', 64), gfx: { gitter: { cls: 'a1' } } },
      { t: T('Wasser ist damit eine große Ausnahme. Nur wenige Stoffe dehnen sich beim Erstarren aus – etwa **Silizium**, Gallium und Bismut.', 64), gfx: { p1: { draw: 'punkte', args: [['Wasser', 'Silizium', 'Gallium', 'Bismut'], 330] } } },
      { t: T('Die Sechsecke siehst du sogar mit bloßem Auge: Jede **Schneeflocke** hat sechs Arme.', 64), pics: { p0: { img: 0, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Am dichtesten ist Wasser übrigens bei **4 Grad**. Darum hat der Grund tiefer Seen im Winter etwa 4 Grad.', 64), gfx: { see: {} } },
      { t: T('Kälteres Wasser bleibt oben und gefriert an der **Oberfläche**. Das Eis isoliert wie ein Deckel.', 64), gfx: { see: { cls: 'a1' } } },
      { t: T('So frieren Seen nicht von unten zu – Fische und Pflanzen **überwintern** im flüssigen Wasser darunter.', 64), gfx: { see: { cls: 'a1 a2' } } },
      { t: T('Würde Eis sinken, könnten sich Gewässer vom Grund her mit Eis füllen. Leben im Wasser hätte es **viel schwerer**.', 64), gfx: { tiefsee: {} } },
      { t: T('Glatt ist Eis übrigens nicht wegen des Drucks der Kufen: Auf seiner Oberfläche liegt immer eine hauchdünne, **flüssigkeitsähnliche** Schicht.', 64), gfx: { eislauf: {} } },
      { t: T('Die Ausdehnung hat Kraft: Gefriert Wasser in einer geschlossenen Flasche, kann es sie **sprengen**.', 64), gfx: { flasche: {} } },
      { t: T('So sprengt Frost auch Felsen und Straßen: Wasser in Ritzen gefriert und dehnt sich aus – so entstehen **Schlaglöcher**.', 64), gfx: { fels: {} } },
      { t: T('Und Eisberge? Weil Eis nur wenig leichter ist als Meerwasser, ragt nur etwa **ein Zehntel** heraus.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Eis schwimmt, weil Wasser beim Gefrieren **Platz** schafft.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Eis ist rund 9 % leichter als flüssiges Wasser.', 'Beim Gefrieren ordnen Wasserstoffbrücken die Moleküle zu luftigen Sechsecken.', 'Darum frieren Seen von oben zu – und Frost sprengt Felsen und Flaschen.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Wasser', 'Chaplin: Water Structure and Science (London South Bank University)', 'USGS Water Science School: Ice, Snow and Glaciers'],
  },
  {
    id: 'zwiebel',
    area: 'CHE',
    day: 2,
    hook: 'Warum weinst du beim Zwiebelschneiden?',
    mood: 'verspielt',
    ambience: 'stadt',
    images: [img('zwiebel')],
    draw: {
      zwiebel(g) {
        const o: P[] = [...B([180, 100], [200, 160], [300, 200], [280, 300]), ...B([280, 300], [260, 380], [100, 380], [80, 300]).slice(1), ...B([80, 300], [60, 200], [160, 160], [180, 100]).slice(1)]
        blank(g, o)
        ink(g, o, { w: 3.2, t: 900 })
        for (const k of [0.7, 0.4]) ink(g, B([180, 100 + (1 - k) * 60], [180 + 60 * k, 180], [180 + 80 * k, 300], [180, 370 - (1 - k) * 20]), { w: 1.8, d: 500, t: 500 })
        drop(g, 300, 120, 0.8, 1100)
      },
      ganz(g) {
        const o: P[] = [...B([180, 330], [200, 380], [290, 410], [270, 500]), ...B([270, 500], [250, 580], [110, 580], [90, 500]).slice(1), ...B([90, 500], [70, 410], [160, 380], [180, 330]).slice(1)]
        ink(g, o, { w: 3, t: 800 })
        const knife = st(g, 'x1', '--o: 260px 420px')
        ink(knife, RR(220, 380, 120, 20, 6), { w: 2.6, t: 0 })
        ink(knife, [[220, 400], [180, 470], [210, 400]], { w: 2.6, t: 0 })
        text(g, 180, 630, 'ganz: riecht kaum', { anchor: 'middle', cls: 's', d: 900 })
      },
      zelle(g) {
        ink(g, RR(60, 360, 240, 200, 20), { w: 3, t: 700 })
        ink(g, E(130, 460, 40), { w: 2.4, d: 400, t: 500 })
        for (const [x, y] of [[120, 450], [140, 470], [125, 476]] as const) dot(g, x, y, 4, 800)
        text(g, 130, 530, 'Schwefelstoff', { anchor: 'middle', cls: 's', d: 900 })
        for (const [x, y] of [[230, 420], [250, 470], [220, 500]] as const) ink(g, [[x - 8, y], [x, y - 10], [x + 8, y]], { w: 2, d: 1000, t: 150 })
        text(g, 240, 540, 'Enzym', { anchor: 'middle', cls: 's', d: 1100 })
        const cut = st(g, 'x1', '--o: 180px 460px')
        ink(cut, L([180, 340], [180, 580]), { w: 4.4, t: 0 })
      },
      gas(g) {
        for (let i = 0; i < 9; i++) {
          const x = 70 + (i % 5) * 52
          const y = 420 + Math.floor(i / 5) * 80
          const p = group(g, 'float', `--d:${i * 150}ms`)
          ball(p, x, y, 8, { d: i * 120, fill: 'dicht', t: 0, w: 1.6 })
          ball(p, x + 12, y - 8, 5, { d: i * 120, t: 0, w: 1.4 })
        }
        for (const x of [90, 180, 270]) arrow(g, L([x, 600], [x, 520]), { w: 2, d: 900, t: 300, head: 8 })
        text(g, 180, 640, 'flüchtiger Reizstoff steigt auf', { anchor: 'middle', cls: 's', d: 1200 })
      },
      auge(g) {
        eye(g, 180, 430, 2)
        for (const [x, y, d] of [[150, 520, 800], [200, 540, 1000]] as const) drop(g, x, y, 0.6, d, false)
        for (let i = 0; i < 4; i++) ball(g, 60 + i * 20, 360 - i * 10, 5, { d: 300 + i * 100, fill: 'dicht', t: 0, w: 1.4 })
        text(g, 180, 620, 'nach etwa 30 Sekunden', { anchor: 'middle', cls: 's', d: 1200 })
      },
      reflex(g) {
        eye(g, 200, 500, 1.8)
        const gland = E(270, 420, 30, 18)
        hatch(g, gland, 700)
        ink(g, gland, { w: 2.4, d: 500, t: 400 })
        text(g, 290, 384, 'Tränendrüse', { anchor: 'middle', cls: 's', d: 900 })
        ink(g, B([150, 500], [100, 470], [80, 400], [120, 350]), { w: 2, d: 800, t: 500 })
        brain(g, 150, 320, 0.4, 900)
      },
      nase(g) {
        eye(g, 130, 440, 1.6)
        ink(g, B([96, 452], [90, 490], [120, 520], [180, 540]), { w: 2, d: 600, t: 500 })
        ink(g, [[200, 380], [250, 560], [200, 580]], { w: 3, d: 300, t: 600 })
        text(g, 180, 630, 'Tränen fließen in die Nase', { anchor: 'middle', cls: 's', d: 1100 })
      },
      brille(g) {
        for (const x of [120, 240]) {
          ink(g, RR(x - 50, 430, 100, 70, 26), { w: 3, t: 600 })
          eye(g, x, 466, 0.7, 400)
        }
        ink(g, B([170, 450], [176, 440], [184, 440], [190, 450]), { w: 2.6, d: 300, t: 200 })
        text(g, 180, 580, 'Schwimmbrille: Gas kommt nicht ans Auge', { anchor: 'middle', cls: 's', d: 1000 })
      },
      ruehrung(g) {
        drop(g, 110, 470, 1.6)
        drop(g, 250, 470, 1.6, 300, false)
        text(g, 110, 560, 'Reiz-Tränen', { anchor: 'middle', cls: 's', d: 700 })
        text(g, 250, 560, 'Gefühls-Tränen', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 610, 'andere Zusammensetzung', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tipps(g) {
        ink(g, RR(40, 440, 220, 26, 8), { w: 2.8, t: 500 })
        ink(g, [[40, 466], [30, 470], [260, 470]], { w: 2, d: 300, t: 300 })
        ink(g, RR(260, 444, 70, 18, 8), { w: 2.6, d: 400, t: 300 })
        text(g, 150, 520, 'scharfes Messer: weniger zerdrückte Zellen', { anchor: 'middle', cls: 's', d: 800 })
      },
      kalt(g) {
        thermo(g, 120, 340, 220, 0.2)
        text(g, 220, 470, 'kalt: verdampft langsamer', { anchor: 'middle', cls: 's', d: 900 })
      },
      abzug(g) {
        ink(g, [[60, 340], [300, 340], [260, 400], [100, 400], [60, 340]], { w: 3, t: 700 })
        for (const x of [120, 180, 240]) arrow(g, L([x, 560], [x, 420]), { w: 2, d: 700, t: 400, head: 8 })
        ink(g, RR(80, 580, 200, 20, 6), { w: 2.6, d: 300, t: 400 })
        text(g, 180, 640, 'Dunstabzug oder Durchzug', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tranenfrei(g) {
        text(g, 180, 430, '2015', { anchor: 'middle', size: 40, d: 200 })
        text(g, 180, 480, 'Japan: Zwiebel ohne Tränen-Enzym', { anchor: 'middle', d: 600 })
        check(g, 180, 560, 1.4, 1000)
      },
      knoblauch(g) {
        const c: P[] = [...B([180, 340], [230, 380], [260, 500], [200, 590]), ...B([200, 590], [160, 600], [110, 560], [120, 470]).slice(1), ...B([120, 470], [130, 400], [160, 370], [180, 340]).slice(1)]
        blank(g, c)
        ink(g, c, { w: 3, t: 900 })
        ink(g, B([180, 360], [200, 420], [200, 520], [180, 590]), { w: 1.6, d: 600, t: 500 })
        text(g, 270, 640, 'Allicin', { anchor: 'middle', d: 1100 })
      },
      pfanne(g) {
        ink(g, B([40, 500], [60, 560], [300, 560], [320, 500]), { w: 3, t: 700 })
        ink(g, L([320, 506], [350, 490]), { w: 3, d: 300, t: 200 })
        for (let i = 0; i < 6; i++) ink(g, E(90 + i * 36, 530, 14, 6), { w: 2, d: 600 + i * 80, t: 200 })
        for (const x of [120, 180, 240]) ink(g, B([x, 490], [x - 10, 470], [x + 10, 450], [x, 430]), { w: 1.8, d: 1100, t: 300 })
        text(g, 180, 620, 'gebraten: mild und süß', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        drop(g, 180, 480, 2)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Eine ganze Zwiebel riecht kaum. Erst wenn du sie **aufschneidest**, wird sie zur Tränenwaffe.', 64), gfx: { ganz: {} } },
      { t: T('In ihren Zellen lagern **schwefelhaltige** Stoffe – und getrennt davon, in anderen Kammern, ein Enzym.', 64), gfx: { zelle: {} } },
      { t: T('Das Messer zerstört die Zellwände. Enzym und Schwefelstoff **treffen sich** – eine Kettenreaktion beginnt.', 64), gfx: { zelle: { cls: 'a1' } } },
      { t: T('Ein zweites Enzym baut daraus in Sekunden ein flüchtiges Gas, den **Tränenreizstoff** – ein Schwefelmolekül mit kompliziertem Namen.', 64), gfx: { gas: {} } },
      { t: T('Es steigt auf und erreicht deine **Augen**. Nach etwa 30 Sekunden ist die Wirkung am stärksten.', 64), gfx: { auge: {} } },
      { t: T('Auf der feuchten Augenoberfläche reizt es **Schmerzsensoren**. Das Auge wehrt sich und spült mit Tränen.', 64), gfx: { auge: {} } },
      { t: T('Das Weinen ist ein **Reflex**: Nerven im Auge melden den Reiz, das Gehirn schaltet die Tränendrüse oberhalb des Auges an.', 64), gfx: { reflex: {} } },
      { t: T('Abfließen tut die Flüssigkeit über winzige Kanäle **in die Nase** – darum läuft sie beim Weinen mit.', 64), gfx: { nase: {} } },
      { t: T('Wozu das Ganze? Es ist die **Verteidigung** der Zwiebel: Wer hineinbeißt, bekommt eine Ladung Reizstoff ab.', 64), gfx: { p1: { draw: 'punkte', args: [['Zelle verletzt', 'Enzyme werden aktiv', 'Reizgas entsteht', 'Fraßfeind lässt ab'], 330] } } },
      { t: T('Was hilft? Ein **scharfes Messer**: Es schneidet sauber und zerquetscht weniger Zellen.', 64), gfx: { tipps: {} } },
      { t: T('**Kühlen**: Eine Zwiebel aus dem Kühlschrank gibt den Reizstoff langsamer ab.', 64), gfx: { kalt: {} } },
      { t: T('Und unter dem Dunstabzug oder bei offenem Fenster schneiden – dann **zieht** das Gas einfach ab.', 64), gfx: { abzug: {} } },
      { t: T('Am zuverlässigsten hilft eine dicht schließende **Schwimmbrille**: Dann erreicht das Gas das Auge gar nicht erst.', 64), gfx: { brille: {} } },
      { t: T('Japanische Forscher entdeckten das Tränen-Enzym 2002 – und Züchter brachten später eine fast **tränenfreie Zwiebel** auf den Markt.', 64), gfx: { tranenfrei: {} } },
      { t: T('Tränen ist übrigens nicht gleich Tränen: Reiz-Tränen sind **anders zusammengesetzt** als Tränen aus Trauer oder Rührung.', 64), gfx: { ruehrung: {} } },
      { t: T('Knoblauch hat einen ähnlichen Startstoff, aber kein Tränen-Enzym. Bei ihm entsteht **Allicin** – der typische Geruch.', 64), gfx: { knoblauch: {} } },
      { t: T('Beim Braten zerfallen die Schwefelstoffe zu anderen, süßlichen Aromen. Darum wird Zwiebel in der Pfanne **mild und süß**.', 64), gfx: { pfanne: {} } },
      { t: T('Zwiebeltränen sind eine **chemische Waffe** – ausgelöst von deinem Messer.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Beim Schneiden treffen Schwefelstoffe und Enzyme aufeinander, die vorher getrennt lagerten.', 'Ein zweites Enzym bildet ein flüchtiges Gas, das die Augen reizt – Tränen spülen es weg.', 'Scharfes Messer, Kühlen und Abzug verringern die Tränen.'],
    sources: ['Imai et al. 2002, Nature 419 (Tränenfaktor-Synthase)', 'Block 2010: Garlic and Other Alliums', 'Eady et al. 2008, Plant Physiology 147'],
  },
  {
    id: 'flamme',
    area: 'CHE',
    day: 2,
    hook: 'Was ist eine Flamme eigentlich?',
    mood: 'ruhig',
    ambience: 'feuer',
    images: [img('kerze'), img('faraday')],
    draw: {
      kerze(g) {
        candle(g, 180, 200, 0)
      },
      vorgang(g) {
        flame(g, 180, 600, 2.4)
        text(g, 300, 380, 'Gas + Sauerstoff', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 300, 400, '→ Licht, Wärme', { anchor: 'middle', cls: 's', d: 1200 })
      },
      docht(g) {
        candle(g, 180, 400, 0, false)
        hatch(g, E(180, 418, 22, 6), 600, true)
        for (const [a, b] of [[[150, 470], [172, 420]], [[210, 470], [188, 420]]] as const) arrow(g, L(a as P, b as P), { w: 2, d: 700, t: 300, head: 8 })
        text(g, 280, 470, 'Wachs schmilzt', { anchor: 'middle', cls: 's', d: 900 })
        const v = st(g, 'x1', '--o: 180px 380px')
        for (const x of [170, 180, 190]) ink(v, B([x, 384], [x - 6, 370], [x + 6, 356], [x, 340]), { w: 1.6, t: 0 })
        text(v, 280, 360, 'Wachs verdampft', { anchor: 'middle', cls: 's', fade: false })
      },
      rauch(g) {
        candle(g, 120, 420, 0, false)
        for (let i = 0; i < 4; i++) ink(g, B([120, 404 - i * 30], [110, 390 - i * 30], [130, 380 - i * 30], [120, 374 - i * 30]), { w: 1.8, d: 300 + i * 150, t: 200 })
        ink(g, L([200, 330], [300, 250]), { w: 3, d: 800, t: 300 })
        flame(g, 196, 336, 0.35, 1100)
        arrow(g, L([170, 330], [134, 390]), { w: 2, d: 1400, t: 300, head: 8 })
        text(g, 340, 380, 'Flamme springt zurück', { anchor: 'end', cls: 's', d: 1500 })
      },
      faraday(g) {
        candle(g, 120, 420, 0)
        text(g, 250, 450, 'Michael Faraday', { anchor: 'middle', d: 700 })
        text(g, 250, 476, '1848: sechs Vorträge', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 250, 498, 'über eine Kerze', { anchor: 'middle', cls: 's', d: 1000 })
      },
      zonen(g) {
        flame(g, 180, 620, 2.6)
        text(g, 290, 660, 'innen: wenig Sauerstoff', { anchor: 'middle', cls: 's', d: 900 })
        arrow(g, L([270, 644], [200, 560]), { w: 1.8, d: 1000, t: 200, head: 7 })
      },
      gelb(g) {
        flame(g, 180, 620, 2.6)
        for (let i = 0; i < 12; i++) dot(g, 150 + (i % 4) * 20, 430 + Math.floor(i / 4) * 30, 2.4, 800 + i * 50)
        text(g, 300, 380, 'glühender Ruß', { anchor: 'middle', cls: 's', d: 1200 })
        text(g, 300, 400, '≈ 1.000 °C', { anchor: 'middle', cls: 's', d: 1300 })
      },
      aussen(g) {
        flame(g, 180, 620, 2.6)
        ink(g, [...B([180, 640], [60, 640], [70, 480], [180, 350]), ...B([180, 350], [290, 480], [300, 640], [180, 640]).slice(1)], { w: 1.4, d: 800, t: 900 })
        text(g, 300, 360, 'außen bis 1.400 °C', { anchor: 'middle', cls: 's', d: 1300 })
      },
      blau(g) {
        flame(g, 180, 620, 2.6)
        hatch(g, E(180, 612, 40, 10), 900, true)
        text(g, 300, 640, 'unten: bläulich', { anchor: 'middle', cls: 's', d: 1100 })
      },
      auftrieb(g) {
        flame(g, 180, 600, 1.6)
        for (const x of [120, 180, 240]) arrow(g, L([x, 420], [x, 340]), { w: 2.2, d: 700, t: 300, head: 8 })
        arrow(g, B([60, 620], [80, 600], [110, 600], [140, 590]), { w: 2, d: 1000, t: 300, head: 8 })
        arrow(g, B([300, 620], [280, 600], [250, 600], [220, 590]), { w: 2, d: 1000, t: 300, head: 8 })
        text(g, 180, 650, 'frische Luft von unten', { anchor: 'middle', cls: 's', d: 1200 })
      },
      all(g) {
        ball(g, 180, 470, 80, { fill: 'leer', w: 2.6 })
        ball(g, 180, 470, 50, { d: 300, fill: 'hell', w: 2 })
        ink(g, L([180, 470], [180, 560]), { w: 2.2, d: 500, t: 200 })
        text(g, 180, 600, 'auf der ISS: kugelrund und blau', { anchor: 'middle', cls: 's', d: 900 })
      },
      herd(g) {
        ink(g, RR(80, 560, 200, 30, 6), { w: 3, t: 500 })
        for (let i = 0; i < 6; i++) {
          const x = 100 + i * 32
          ink(g, [...B([x - 10, 556], [x - 12, 520], [x, 500], [x, 490]), ...B([x, 490], [x, 500], [x + 12, 520], [x + 10, 556]).slice(1)], { w: 2, d: 300 + i * 80, t: 300 })
        }
        arrow(g, L([30, 640], [90, 600]), { w: 2, d: 900, t: 300, head: 8 })
        text(g, 20, 660, 'Luft vorgemischt', { cls: 's', d: 1000 })
      },
      watt(g) {
        candle(g, 90, 430, 0)
        text(g, 240, 470, '≈ 80 W', { anchor: 'middle', size: 40, d: 700 })
        text(g, 240, 510, 'Wärme', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 240, 560, 'Licht: ein winziger Teil', { anchor: 'middle', cls: 's', d: 1200 })
      },
      farben(g) {
        ;[['Kupfer', 'grün'], ['Natrium', 'gelb'], ['Strontium', 'rot']].forEach(([el, c], i) => {
          const x = 70 + i * 110
          flame(g, x, 560, 0.9, i * 300)
          text(g, x, 600, el, { anchor: 'middle', d: 300 + i * 300 })
          text(g, x, 622, c, { anchor: 'middle', cls: 's', d: 400 + i * 300 })
        })
      },
      dreieck(g) {
        ink(g, [[180, 330], [320, 580], [40, 580], [180, 330]], { w: 3.2, t: 900 })
        text(g, 180, 316, 'Hitze', { anchor: 'middle', d: 600 })
        text(g, 30, 610, 'Brennstoff', { d: 800 })
        text(g, 330, 610, 'Sauerstoff', { anchor: 'end', d: 1000 })
        flame(g, 180, 540, 0.8, 1200)
      },
      fett(g) {
        ink(g, B([60, 560], [80, 600], [280, 600], [300, 560]), { w: 3, t: 600 })
        ink(g, L([300, 566], [340, 550]), { w: 3, d: 200, t: 200 })
        flame(g, 180, 560, 1.6, 500)
        drop(g, 100, 360, 0.8, 900, false)
        cross(g, 100, 430, 1, 1200)
        text(g, 180, 640, 'Fettbrand nie mit Wasser löschen', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        candle(g, 180, 470, 0)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Eine Flamme ist kein Ding, sondern ein **Vorgang**: Gas, das gerade mit Sauerstoff reagiert – und dabei leuchtet und Wärme abgibt.', 64), gfx: { vorgang: {} } },
      { t: T('Bei einer Kerze brennt nicht das feste Wachs. Die Hitze **schmilzt** es, und der Docht saugt es nach oben.', 64), gfx: { docht: {} } },
      { t: T('Am Docht **verdampft** das flüssige Wachs. Erst dieser Wachsdampf verbrennt.', 64), gfx: { docht: { cls: 'a1' } } },
      { t: T('Probier es: Blas eine Kerze aus und halte ein brennendes Streichholz in den **weißen Rauch**. Die Flamme springt zurück auf den Docht.', 64), gfx: { rauch: {} } },
      { t: T('Der Physiker Michael Faraday hielt 1848 eine berühmte Vortragsreihe für Kinder – über nichts anderes als **eine Kerze**.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 350, enter: 'blot', cam: [50, 30, 1.05], cam2: [50, 30, 1.2], cap: 'Michael Faraday' } } },
      { t: T('Eine Flamme hat Zonen. Innen ist sie dunkel – dort gibt es zu **wenig Sauerstoff**, der Dampf kann noch nicht brennen.', 64), gfx: { zonen: {} } },
      { t: T('Im hellen gelben Teil glühen winzige **Rußteilchen**, rund 1.000 Grad heiß. Ihr Glühen ist das Licht der Kerze.', 64), gfx: { gelb: {} } },
      { t: T('Ganz außen, wo genug Sauerstoff ist, verbrennt alles vollständig. Dort ist die Flamme **am heißesten** – bis rund 1.400 Grad.', 64), gfx: { aussen: {} } },
      { t: T('Unten am Docht leuchtet sie **bläulich**: Dort strahlen angeregte Moleküle, nicht glühender Ruß.', 64), gfx: { blau: {} } },
      { t: T('Warum zeigt eine Flamme nach **oben**? Heiße Gase sind leichter als die Umgebung und steigen auf. Frische Luft strömt von unten nach.', 64), gfx: { auftrieb: {} } },
      { t: T('Im All gibt es kein Oben. Dort ist eine Kerzenflamme **kugelrund** und blau – das zeigten Versuche auf der Raumstation.', 64), gfx: { all: {} } },
      { t: T('Eine Gasflamme am Herd ist blau, weil der Brenner schon **vorher** Luft beimischt: Fast alles verbrennt, kaum Ruß entsteht.', 64), gfx: { herd: {} } },
      { t: T('Eine Kerze heizt mit rund **80 Watt** – aber nur ein winziger Bruchteil davon wird zu sichtbarem Licht.', 64), gfx: { watt: {} } },
      { t: T('Kupfer färbt Flammen grün, Natrium gelb, Strontium rot: Jedes Element leuchtet in **eigenen Farben**. So entstehen Feuerwerksfarben.', 64), gfx: { farben: {} } },
      { t: T('Damit Feuer brennt, braucht es drei Dinge: **Brennstoff, Sauerstoff und Hitze**. Fehlt eins, erlischt es.', 64), gfx: { dreieck: {} } },
      { t: T('Darauf beruht jedes Löschen: Wasser nimmt die **Hitze**, eine Löschdecke den Sauerstoff, ein Schnitt im Docht den Brennstoff.', 64), gfx: { dreieck: {} } },
      { t: T('Fett aber nie mit Wasser löschen: Das Wasser verdampft schlagartig und schleudert brennendes Fett hoch – eine **Stichflamme**.', 64), gfx: { fett: {} } },
      { t: T('Eine Flamme ist **brennendes Gas** – und ihr Licht glühender Ruß.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Nicht das Wachs brennt, sondern sein Dampf; das gelbe Licht ist glühender Ruß.', 'Auftrieb formt die Flamme – im All wird sie kugelrund.', 'Feuer braucht Brennstoff, Sauerstoff und Hitze; Fettbrände nie mit Wasser löschen.'],
    sources: ['Faraday 1861: The Chemical History of a Candle', 'NASA: Flame Extinguishment Experiment (ISS)', 'Deutscher Feuerwehrverband: Fettbrand'],
  },
  {
    id: 'seife',
    area: 'CHE',
    day: 2,
    hook: 'Wie wäscht Seife Fett weg, wenn Wasser es nicht kann?',
    mood: 'verspielt',
    ambience: 'blasen',
    images: [img('seifenblasen')],
    draw: {
      blasen(g) {
        for (const [x, y, r, d] of [[120, 220, 70, 0], [250, 160, 46, 300], [240, 300, 30, 500], [70, 340, 22, 700]] as const) {
          ink(g, E(x, y, r), { w: 2.6, d, t: 600 })
          ink(g, E(x - r * 0.35, y - r * 0.35, r * 0.25, r * 0.25, 190, 260), { w: 2, d: d + 400, t: 200 })
        }
      },
      oel(g) {
        beaker(g, 110, 620, 140, 280, 0.8)
        blank(g, RR(113, 396, 134, 46, 2))
        hatch(g, RR(113, 396, 134, 46, 2), 900, true)
        ink(g, L([113, 442], [247, 442]), { w: 1.8, d: 800, t: 300 })
        text(g, 280, 420, 'Öl', { d: 1000 })
        text(g, 280, 540, 'Wasser', { d: 1100 })
      },
      polar(g) {
        water(g, 80, 450, 1.6, 0)
        water(g, 150, 420, 1.6, 40, 200)
        water(g, 120, 520, 1.6, -30, 400)
        const fat: P[] = []
        for (let i = 0; i <= 8; i++) fat.push([220 + i * 13, 470 + (i % 2 ? -8 : 8)])
        ink(g, fat, { w: 2.6, d: 700, t: 500 })
        text(g, 110, 600, 'Wasser hält zusammen', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 270, 600, 'Fett: unpolar', { anchor: 'middle', cls: 's', d: 1100 })
      },
      molekuel(g) {
        soap(g, 80, 470, 0, 200, 0)
        text(g, 80, 440, 'Kopf', { anchor: 'middle', cls: 's', d: 400 })
        text(g, 80, 520, 'liebt Wasser', { anchor: 'middle', cls: 's', d: 500 })
        const t = st(g, 'f1')
        text(t, 210, 440, 'Schwanz', { anchor: 'middle', cls: 's', fade: false })
        text(t, 210, 520, 'liebt Fett', { anchor: 'middle', cls: 's', fade: false })
      },
      fleck(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 400 })
        const fat = [...E(180, 560, 80, 50, 180, 360)]
        hatch(g, fat, 600, true)
        ink(g, fat, { w: 2.6, d: 300, t: 500 })
        for (let k = 0; k < 7; k++) {
          const a = 190 + k * 26
          soap(g, 180 + Math.cos(rad(a)) * 130, 560 + Math.sin(rad(a)) * 90, a + 180, 40, 800 + k * 100)
        }
      },
      mizelle(g) {
        const fat = E(180, 470, 46)
        hatch(g, fat, 300, true)
        ink(g, fat, { w: 2, t: 400 })
        for (let k = 0; k < 14; k++) {
          const a = k * (360 / 14)
          soap(g, 180 + Math.cos(rad(a)) * 104, 470 + Math.sin(rad(a)) * 104, a + 180, 46, 500 + k * 60)
        }
        text(g, 180, 640, 'Mizelle', { anchor: 'middle', d: 1500 })
      },
      weg(g) {
        for (let i = 0; i < 3; i++) {
          const cx = 80 + i * 100
          const cy = 460 + (i % 2) * 40
          hatch(g, E(cx, cy, 18), 200 + i * 200, true)
          for (let k = 0; k < 8; k++) {
            const a = k * 45
            soap(g, cx + Math.cos(rad(a)) * 40, cy + Math.sin(rad(a)) * 40, a + 180, 16, i * 200)
          }
        }
        for (const y of [580, 610]) ink(g, waveP(20, 340, y, 5, 60), { w: 2, d: 900, t: 700 })
      },
      virus(g) {
        ink(g, E(120, 470, 60), { w: 2.6, t: 600 })
        ink(g, E(120, 470, 52), { w: 1.6, d: 200, t: 600 })
        hatch(g, E(120, 470, 30), 500)
        for (let k = 0; k < 4; k++) soap(g, 230, 400 + k * 40, 180, 40, 800 + k * 100)
        const broken = st(g, 'x1', '--o: 120px 470px')
        ink(broken, E(120, 470, 76, 76, 200, 250), { w: 2.4, t: 0 })
        ink(broken, E(120, 470, 76, 76, 290, 340), { w: 2.4, t: 0 })
        text(g, 120, 580, 'Fetthülle', { anchor: 'middle', cls: 's', d: 900 })
      },
      abloesen(g) {
        ink(g, B([30, 520], [120, 500], [240, 500], [330, 520]), { w: 3, t: 700 })
        for (const [x, y, d] of [[100, 470, 600], [170, 430, 750], [250, 460, 900]] as const) {
          ink(g, RR(x - 16, y - 7, 32, 14, 7), { w: 2, d, t: 200 })
          arrow(g, L([x, y + 14], [x + 30, y + 60]), { w: 1.8, d: d + 200, t: 200, head: 7 })
        }
        for (const y of [580, 610]) ink(g, waveP(20, 340, y, 5, 60), { w: 2, d: 1100, t: 700 })
        text(g, 180, 380, 'abgelöst und weggespült', { anchor: 'middle', cls: 's', d: 1300 })
      },
      pfeffer(g) {
        ink(g, E(180, 470, 140, 50), { w: 3, t: 800 })
        let seed = 7
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 26; i++) {
          const a = rnd() * Math.PI * 2
          const r = 0.82 + rnd() * 0.12
          dot(g, 180 + Math.cos(a) * 140 * r, 470 + Math.sin(a) * 50 * r, 2.6, 900 + i * 30)
        }
        drop(g, 180, 380, 0.7, 500)
        arrow(g, L([180, 404], [180, 450]), { w: 2, d: 700, t: 200, head: 7 })
        text(g, 180, 580, 'Pfeffer flieht zum Rand', { anchor: 'middle', cls: 's', d: 1500 })
      },
      haende(g) {
        clock(g, 180, 470, 90, 0, 120)
        text(g, 180, 620, 'mindestens 20 Sekunden', { anchor: 'middle', d: 1100 })
      },
      alt(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.08, label: 'vor 4.000 J.', sub: 'Babylon', up: true },
          { at: 0.9, label: 'heute', up: true },
        ])
        flame(g, 90, 600, 0.6, 1100)
        ink(g, B([50, 600], [60, 640], [120, 640], [130, 600]), { w: 2.6, d: 1000, t: 400 })
      },
      blase(g) {
        ink(g, E(180, 470, 130), { w: 2.4, t: 800 })
        ink(g, E(180, 470, 118), { w: 2.4, d: 200, t: 800 })
        hatch(g, [...E(180, 470, 128), ...E(180, 470, 120, 120, 360, 0)], 600)
        const lens0 = st(g, 'x1', '--o: 290px 380px')
        blank(lens0, E(300, 360, 46))
        ink(lens0, E(300, 360, 46), { w: 2.2, t: 0 })
        for (let k = 0; k < 3; k++) soap(lens0, 270 + k * 30, 340, 90, 14, 0)
        for (let k = 0; k < 3; k++) soap(lens0, 270 + k * 30, 382, 270, 14, 0)
      },
      farben(g) {
        ink(g, L([60, 440], [300, 440]), { w: 2.6, t: 500 })
        ink(g, L([60, 470], [300, 470]), { w: 2.6, t: 500 })
        arrow(g, L([100, 330], [140, 436]), { w: 2.2, d: 600, t: 300, head: 8 })
        arrow(g, L([142, 436], [180, 330]), { w: 2.2, d: 900, t: 300, head: 8 })
        arrow(g, L([156, 472], [196, 330]), { w: 2.2, d: 1100, t: 300, head: 8 })
        text(g, 180, 540, 'zwei Spiegelungen überlagern sich', { anchor: 'middle', cls: 's', d: 1300 })
      },
      kalk(g) {
        ink(g, B([30, 380], [60, 600], [300, 600], [330, 380]), { w: 3, t: 800 })
        hatch(g, RR(46, 470, 268, 12, 4), 800, true)
        text(g, 180, 520, 'Kalkseife: grauer Rand', { anchor: 'middle', cls: 's', d: 1100 })
      },
      ende(g) {
        soap(g, 120, 480, 0, 120, 0)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Wasser und Öl mischen sich nicht. Schüttel sie zusammen – nach kurzer Zeit liegt das Öl wieder **obenauf**.', 64), gfx: { oel: {} } },
      { t: T('Wassermoleküle sind elektrisch ungleich geladen und halten fest zusammen. Fett ist **unpolar** – es wird einfach ausgeschlossen.', 64), gfx: { polar: {} } },
      { t: T('Seife ist ein Vermittler. Ihr Molekül hat einen **wasserliebenden Kopf** …', 64), gfx: { molekuel: {} } },
      { t: T('… und einen langen, **fettliebenden Schwanz**.', 64), gfx: { molekuel: { cls: 'a1' } } },
      { t: T('Am Fettfleck bohren sich die Schwänze **ins Fett**. Die Köpfe bleiben draußen im Wasser.', 64), gfx: { fleck: {} } },
      { t: T('Immer mehr Seifenmoleküle umhüllen das Fett, bis es sich als Kügelchen ablöst: eine **Mizelle**.', 64), gfx: { mizelle: {} } },
      { t: T('Außen hat die Mizelle nur Köpfe. Sie ist **wasserfreundlich** – und wird einfach weggespült.', 64), gfx: { weg: {} } },
      { t: T('Dasselbe passiert mit vielen Viren: Sie haben eine **Fetthülle**. Seife reißt sie auf, das Virus zerfällt.', 64), gfx: { virus: { cls: 'a1' } } },
      { t: T('Seife tötet viele Keime gar nicht. Sie **löst sie ab** – und das Wasser spült sie fort.', 64), gfx: { abloesen: {} } },
      { t: T('Darum zählt das **Reiben**: Hände gründlich aneinander, auch zwischen den Fingern und um die Nägel.', 64), gfx: { abloesen: {} } },
      { t: T('Darum ist Händewaschen mit Seife so wirksam – wenn du gründlich bist: mindestens **20 Sekunden**.', 64), gfx: { haende: {} } },
      { t: T('Seife ist uralt: Schon in Babylon kochte man vor über **4.000 Jahren** Fett mit Holzasche.', 64), gfx: { alt: {} } },
      { t: T('Die Reaktion heißt **Verseifung**: Eine Lauge spaltet Fett in Seifenmoleküle und Glycerin.', 64), gfx: { f1: { draw: 'formel', args: [['Fett', '+', 'Lauge', '→', 'Seife', '+', 'Glycerin'], 360] } } },
      { t: T('Probier es: Streu Pfeffer auf Wasser und tupf einen Tropfen Spülmittel in die Mitte. Der Pfeffer **flieht** schlagartig zum Rand.', 64), gfx: { pfeffer: {} } },
      { t: T('Das Spülmittel schwächt die **Oberflächenspannung** in der Mitte. Die Wasserhaut am Rand zieht stärker – und reißt den Pfeffer mit.', 64), gfx: { pfeffer: {} } },
      { t: T('Seifenblasen funktionieren ähnlich: eine hauchdünne **Wasserschicht** zwischen zwei Lagen Seifenmolekülen.', 64), gfx: { blase: { cls: 'a1' } } },
      { t: T('Die bunten Farben entstehen, weil Licht an Vorder- und Rückseite der Haut **gespiegelt** wird – die beiden Wellen überlagern sich.', 64), gfx: { farben: {} } },
      { t: T('Kurz vor dem Platzen wird die Haut so dünn, dass sie **schwarz** wirkt: nur noch wenige Millionstel Millimeter.', 64), gfx: { blase: { cls: 'a1' } } },
      { t: T('Hartes Wasser bremst Seife: Kalk bildet mit ihr unlösliche **Kalkseife** – den grauen Rand in der Badewanne.', 64), gfx: { kalk: {} } },
      { t: T('Seife ist ein Molekül mit **zwei Gesichtern**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Seifenmoleküle haben einen wasserliebenden Kopf und einen fettliebenden Schwanz.', 'Sie umhüllen Fett zu Mizellen, die das Wasser wegspült.', 'Auch die Fetthülle vieler Viren reißt Seife auf.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Tenside', 'Thordarson 2020: Die Chemie hinter dem Händewaschen (UNSW Sydney)', 'Levey 1954, Isis 45 (Seife in Mesopotamien)'],
  },
  {
    id: 'streusalz',
    area: 'CHE',
    day: 2,
    hook: 'Warum taut Salz Eis – sogar unter null Grad?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [img('streusalz'), img('meereis')],
    draw: {
      strasse(g) {
        ink(g, [[20, 400], [130, 160], [230, 160], [340, 400]], { w: 3, t: 800 })
        dashes(g, L([180, 180], [180, 390]), { w: 2.4, d: 400, dash: 16, gap: 14 })
        let seed = 2
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 22; i++) {
          const y = 190 + rnd() * 200
          const half = 50 + ((y - 160) / 240) * 110
          const x = 180 + (rnd() - 0.5) * 2 * half * 0.9
          ink(g, RR(x - 3, y - 3, 6, 6, 1), { w: 1.4, d: 800 + i * 40, t: 80 })
        }
      },
      gleichgewicht(g) {
        ink(g, L([20, 520], [340, 520]), { w: 2, t: 400 })
        for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) water(g, 50 + c * 52, 560 + r * 44, 0.9, 0, (r * 6 + c) * 30)
        for (let c = 0; c < 5; c++) water(g, 70 + c * 60, 470 + (c % 2) * 14, 0.9, c * 70, 400 + c * 60)
        arrow(g, L([120, 500], [120, 540]), { w: 2, d: 900, t: 200, head: 7 })
        arrow(g, L([240, 540], [240, 500]), { w: 2, d: 900, t: 200, head: 7 })
        text(g, 30, 420, 'Schmelzwasser', { cls: 's', d: 700 })
        text(g, 30, 660, 'Eis', { cls: 's', d: 700 })
      },
      salz(g) {
        ink(g, L([20, 520], [340, 520]), { w: 2, t: 400 })
        for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) water(g, 50 + c * 52, 560 + r * 44, 0.9, 0, 0)
        for (let c = 0; c < 5; c++) water(g, 70 + c * 60, 470 + (c % 2) * 14, 0.9, c * 70, 0)
        for (const [x, y] of [[100, 440], [190, 430], [280, 450], [150, 490]] as const) {
          ball(g, x, y, 9, { d: 600, fill: 'dicht', w: 1.6, t: 0 })
        }
        const melt = st(g, 'x1', '--o: 240px 520px')
        arrow(melt, L([240, 546], [240, 500]), { w: 3, t: 0, head: 9 })
        text(melt, 250, 410, 'schmilzt', { cls: 's', fade: false })
      },
      grad(g) {
        thermo(g, 120, 330, 260, 0.15)
        text(g, 150, 560, '−21 °C', { size: 26, d: 800 })
        text(g, 150, 590, 'Grenze für Kochsalz', { cls: 's', d: 1000 })
      },
      eiscreme(g) {
        ink(g, [[80, 360], [90, 600], [270, 600], [280, 360]], { w: 3, t: 700 })
        ink(g, RR(130, 380, 100, 200, 10), { w: 2.6, d: 300, t: 600 })
        hatch(g, RR(134, 440, 92, 136, 8), 800)
        for (let i = 0; i < 10; i++) cube(g, 94 + (i % 2) * 150 + (i % 2 ? 0 : 0), 380 + Math.floor(i / 2) * 42, 24, 600 + i * 60)
        text(g, 180, 640, 'Eis + Salz: unter −10 °C', { anchor: 'middle', cls: 's', d: 1300 })
      },
      teilchen(g) {
        vbars(g, [
          { label: 'Zucker', v: 1, fmt: () => '1 Teilchen' },
          { label: 'Kochsalz', v: 2, fmt: () => '2 Teilchen' },
          { label: 'Calciumchlorid', v: 3, fmt: () => '3 Teilchen', dense: true },
        ], { x: 40, base: 590, w: 70, gap: 110, h: 220 })
        text(g, 180, 320, 'pro aufgelöster Einheit', { anchor: 'middle', cls: 's', d: 1400 })
      },
      meer(g) {
        ink(g, waveP(20, 340, 420, 6, 60), { w: 2.6, t: 700 })
        thermo(g, 180, 460, 140, 0.3, 300)
        text(g, 210, 560, '≈ −2 °C', { size: 24, d: 900 })
      },
      meereis(g) {
        ink(g, waveP(20, 340, 460, 4, 60), { w: 2.4, t: 700 })
        const ice: P[] = [[80, 460], [100, 420], [260, 420], [280, 460], [260, 490], [100, 490], [80, 460]]
        blank(g, ice)
        ink(g, ice, { w: 2.8, d: 300, t: 600 })
        for (const [x, y] of [[90, 540], [140, 560], [200, 530], [260, 560]] as const) ball(g, x, y, 6, { d: 900, fill: 'dicht', w: 1.4, t: 0 })
        text(g, 180, 400, 'Meereis: fast süß', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 180, 620, 'Salz bleibt im Wasser', { anchor: 'middle', cls: 's', d: 1200 })
      },
      nachteile(g) {
        const car: P[] = [[60, 520], [60, 490], [100, 486], [130, 450], [220, 450], [250, 486], [300, 490], [300, 520], [60, 520]]
        ink(g, car, { w: 2.8, t: 700 })
        for (const x of [110, 250]) ball(g, x, 524, 18, { d: 400, t: 300 })
        for (let i = 0; i < 8; i++) dot(g, 70 + i * 28, 506, 3, 900 + i * 60)
        text(g, 180, 600, 'Rost, kranke Bäume, salzige Böden', { anchor: 'middle', cls: 's', d: 1200 })
      },
      sole(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 400 })
        ink(g, RR(100, 420, 160, 80, 10), { w: 2.8, d: 200, t: 500 })
        for (let i = 0; i < 6; i++) ink(g, L([110 + i * 28, 504], [104 + i * 28, 550]), { w: 1.8, d: 700 + i * 60, t: 150 })
        text(g, 180, 620, 'Sole: vorbeugend gesprüht', { anchor: 'middle', cls: 's', d: 1100 })
      },
      kuehler(g) {
        const car: P[] = [[40, 540], [40, 500], [90, 494], [130, 450], [230, 450], [270, 494], [320, 500], [320, 540], [40, 540]]
        ink(g, car, { w: 2.8, t: 700 })
        for (const x of [100, 260]) ball(g, x, 544, 20, { d: 400, t: 300 })
        thermo(g, 300, 300, 120, 0.1, 700)
        text(g, 180, 620, 'Frostschutz im Kühlwasser', { anchor: 'middle', cls: 's', d: 1000 })
      },
      nudeln(g) {
        ink(g, [[80, 400], [90, 580], [270, 580], [280, 400]], { w: 3, t: 700 })
        hatch(g, RR(94, 440, 172, 136, 4), 500)
        for (const x of [130, 180, 230]) ink(g, B([x, 390], [x - 10, 370], [x + 10, 350], [x, 330]), { w: 2, d: 900, t: 300 })
        text(g, 180, 630, 'Siedepunkt: nur ein Hauch höher', { anchor: 'middle', cls: 's', d: 1100 })
      },
      fisch(g) {
        const f: P[] = [...B([60, 470], [100, 410], [240, 410], [290, 470]), ...B([290, 470], [240, 530], [100, 530], [60, 470]).slice(1)]
        blank(g, f)
        ink(g, f, { w: 3, t: 800 })
        ink(g, [[60, 470], [24, 440], [24, 500], [60, 470]], { w: 2.6, d: 400, t: 300 })
        dot(g, 250, 460, 4, 700)
        for (const [x, y] of [[140, 470], [190, 460]] as const) {
          ink(g, E(x, y, 12), { w: 1.8, d: 900, t: 200 })
          ink(g, E(x, y, 20, 20, 200, 340), { w: 1.6, d: 1100, t: 200 })
        }
        text(g, 180, 600, 'Frostschutz-Eiweiße umklammern Eiskeime', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        for (let i = 0; i < 5; i++) ink(g, RR(110 + i * 30, 470 + (i % 2) * 12, 14, 14, 2), { w: 2, d: i * 100, t: 150 })
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Eis ist nie ganz ruhig: An seiner Oberfläche lösen sich ständig Moleküle ins Schmelzwasser – und andere **frieren fest**.', 64), gfx: { gleichgewicht: {} } },
      { t: T('Bei null Grad halten sich beide Vorgänge die **Waage**. Es scheint nichts zu passieren.', 64), gfx: { gleichgewicht: {} } },
      { t: T('Salz löst sich im dünnen Wasserfilm auf dem Eis. Die Salz-Teilchen stehen den Wassermolekülen beim Festfrieren **im Weg**.', 64), gfx: { salz: {} } },
      { t: T('Nun frieren weniger Moleküle fest, als sich lösen – das Eis **schmilzt**, obwohl es unter null Grad ist.', 64), gfx: { salz: { cls: 'a1' } } },
      { t: T('Das heißt **Gefrierpunktserniedrigung**: Salzwasser gefriert erst bei tieferen Temperaturen als reines Wasser.', 64), gfx: { f1: { draw: 'formel', args: [['mehr gelöste Teilchen', '→', 'tieferer Gefrierpunkt'], 360] } } },
      { t: T('Mit Kochsalz geht das bis etwa **minus 21 Grad**. Ist es kälter, taut Streusalz nichts mehr.', 64), gfx: { grad: {} } },
      { t: T('Das Schmelzen braucht Energie, und die kommt aus der Umgebung. Eine Mischung aus Eis und Salz wird darum **eiskalt**.', 64), gfx: { grad: {} } },
      { t: T('So machte man früher Speiseeis: Eis mit Salz im äußeren Kübel kühlte die Creme auf **unter minus 10 Grad**.', 64), gfx: { eiscreme: {} } },
      { t: T('Es kommt nicht auf die Sorte an, sondern auf die **Zahl der Teilchen**. Zucker wirkt auch – nur viel schwächer.', 64), gfx: { teilchen: {} } },
      { t: T('Calciumchlorid zerfällt in **drei** Teilchen statt zwei. Es taut noch bei Temperaturen weit unter minus 21 Grad.', 64), gfx: { teilchen: {} } },
      { t: T('Derselbe Effekt lässt das Meer erst bei etwa **minus 2 Grad** gefrieren.', 64), gfx: { meer: {} } },
      { t: T('Und gefriert Meerwasser, bleibt das meiste Salz draußen: Junges **Meereis** ist erstaunlich salzarm.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Streusalz hat Nachteile: Es lässt Autos **rosten**, schadet Straßenbäumen und versalzt Böden.', 64), gfx: { nachteile: {} } },
      { t: T('Viele Städte setzen darum auf Splitt oder **Sole**: Salzlösung, die vorbeugend in kleiner Menge aufs Pflaster gesprüht wird.', 64), gfx: { sole: {} } },
      { t: T('Frostschutz im Auto nutzt dasselbe Prinzip: Glykol im Kühlwasser senkt den Gefrierpunkt **weit unter minus 30 Grad**.', 64), gfx: { kuehler: {} } },
      { t: T('Und Salz im Nudelwasser? Es hebt den Siedepunkt nur um **Bruchteile eines Grades**. Es dient allein dem Geschmack.', 64), gfx: { nudeln: {} } },
      { t: T('Fische im Polarmeer nutzen einen anderen Trick: **Frostschutz-Eiweiße** im Blut, die winzige Eiskristalle umklammern, bevor sie wachsen.', 64), gfx: { fisch: {} } },
      { t: T('Salz taut Eis, weil es dem Wasser das **Gefrieren** schwer macht.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Gelöste Salz-Teilchen behindern das Festfrieren – Eis schmilzt unter 0 °C.', 'Es zählt die Zahl gelöster Teilchen; Kochsalz wirkt bis etwa −21 °C.', 'Das Schmelzen entzieht Wärme: Eis plus Salz wird eiskalt.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Kolligative Eigenschaften', 'Umweltbundesamt: Streusalz', 'DeVries 1971, Science 172 (Frostschutzproteine)'],
  },
  {
    id: 'popcorn',
    area: 'CHE',
    day: 2,
    hook: 'Warum ploppt Popcorn – und anderer Mais nicht?',
    mood: 'verspielt',
    ambience: 'feuer',
    images: [img('popcorn')],
    draw: {
      flocken(g) {
        ;[[110, 160, 1.2], [220, 130, 1], [270, 250, 0.9], [150, 290, 1.1], [60, 260, 0.8]].forEach(([x, y, s], i) => puff(g, x, y, s, i * 200))
      },
      maschine(g) {
        kernel(g, 180, 470, 1.6)
        flame(g, 180, 660, 0.6, 900)
        text(g, 300, 380, 'Dampfmaschine', { anchor: 'middle', cls: 's', d: 1100 })
      },
      schnitt(g) {
        kernel(g, 160, 470, 1.8)
        for (let i = 0; i < 6; i++) drop(g, 130 + (i % 3) * 30, 440 + Math.floor(i / 3) * 50, 0.3, 900 + i * 80, false)
        text(g, 290, 400, 'harte Schale', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 290, 540, 'Stärke + 14 % Wasser', { anchor: 'middle', cls: 's', d: 1300 })
      },
      druck(g) {
        kernel(g, 180, 470, 1.8)
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45)
          arrow(g, L([180 + Math.cos(a) * 20, 470 + Math.sin(a) * 20], [180 + Math.cos(a) * 52, 470 + Math.sin(a) * 52]), { w: 2, d: 700 + k * 60, t: 200, head: 7 })
        }
        text(g, 180, 620, 'Dampfdruck steigt', { anchor: 'middle', cls: 's', d: 1300 })
      },
      zahl180(g) {
        thermo(g, 90, 330, 240, 0.75)
        text(g, 140, 470, '≈ 180 °C', { size: 26, d: 700 })
        text(g, 140, 510, 'innen etwa 9-facher Luftdruck', { cls: 's', d: 1000 })
      },
      platzen(g) {
        const half = (k: number, d: number) => ink(g, B([180, 410 + k * 50], [180 + k * 60, 420], [180 + k * 70, 500], [180 + k * 20, 530]), { w: 3.4, d, t: 300 })
        half(-1, 0)
        half(1, 0)
        puff(g, 180, 460, 1.6, 500)
        for (let k = 0; k < 8; k++) {
          const a = rad(k * 45 + 20)
          ink(g, L([180 + Math.cos(a) * 80, 460 + Math.sin(a) * 80], [180 + Math.cos(a) * 100, 460 + Math.sin(a) * 100]), { w: 2, d: 900 + k * 40, t: 100 })
        }
      },
      schaum(g) {
        kernel(g, 80, 470, 0.5)
        arrow(g, L([120, 470], [170, 470]), { w: 2.6, d: 500, t: 300, head: 9 })
        puff(g, 260, 470, 2.6, 700)
        text(g, 180, 620, 'bis zu 40-mal so groß', { anchor: 'middle', d: 1300 })
      },
      plopp(g) {
        puff(g, 120, 480, 1.6)
        for (let i = 0; i < 3; i++) ink(g, E(220, 440, 30 + i * 22, 30 + i * 22, -50, 50), { w: 2, d: 700 + i * 200, t: 200 })
        text(g, 270, 560, 'Plopp = Dampf entweicht', { anchor: 'middle', cls: 's', d: 1300 })
      },
      sprung(g) {
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 400 })
        puff(g, 180, 430, 1.2, 300)
        ink(g, L([170, 470], [160, 596]), { w: 3, d: 700, t: 200 })
        arrow(g, L([240, 470], [240, 380]), { w: 2.4, d: 1000, t: 300, head: 9 })
        text(g, 100, 560, 'Stärke-„Bein“', { anchor: 'middle', cls: 's', d: 900 })
      },
      zeit(g) {
        text(g, 180, 460, '≈ 0,03 s', { anchor: 'middle', size: 50, d: 200 })
        text(g, 180, 510, 'vom Riss zum Popcorn', { anchor: 'middle', cls: 's', d: 700 })
      },
      zuckermais(g) {
        kernel(g, 100, 470, 1)
        for (let k = 0; k < 5; k++) {
          const a = rad(-60 + k * 30)
          arrow(g, L([100 + Math.cos(a) * 66, 470 + Math.sin(a) * 66], [100 + Math.cos(a) * 90, 470 + Math.sin(a) * 90]), { w: 1.8, d: 700 + k * 80, t: 150, head: 6 })
        }
        text(g, 100, 580, 'Zuckermais: undicht', { anchor: 'middle', cls: 's', d: 1100 })
        kernel(g, 270, 470, 1, 400)
        text(g, 270, 580, 'Popcornmais: dicht', { anchor: 'middle', cls: 's', d: 1200 })
      },
      jungfer(g) {
        kernel(g, 180, 470, 1.4)
        ink(g, [[208, 410], [196, 440], [214, 460]], { w: 2, d: 900, t: 200 })
        text(g, 180, 600, 'Riss oder zu trocken: bleibt hart', { anchor: 'middle', cls: 's', d: 1100 })
      },
      mikro(g) {
        ink(g, RR(50, 380, 260, 180, 14), { w: 3, t: 700 })
        ink(g, RR(70, 400, 170, 140, 8), { w: 2.2, d: 300, t: 600 })
        for (let i = 0; i < 3; i++) ink(g, E(286, 420 + i * 40, 8), { w: 2, d: 500 + i * 100, t: 200 })
        puff(g, 150, 470, 1, 900)
        text(g, 180, 620, 'heizt direkt das Wasser im Korn', { anchor: 'middle', cls: 's', d: 1200 })
      },
      formen(g) {
        puff(g, 100, 470, 1.4)
        for (const k of [-1, 1]) ink(g, B([100 + k * 30, 450], [100 + k * 70, 420], [100 + k * 80, 480], [100 + k * 40, 490]), { w: 2.4, d: 600, t: 300 })
        ball(g, 260, 470, 40, { d: 400, w: 2.8 })
        text(g, 100, 580, 'Schmetterling', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 260, 580, 'Pilz', { anchor: 'middle', cls: 's', d: 1000 })
      },
      peru(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.08, label: 'vor 6.000 J.', sub: 'Peru', up: true },
          { at: 0.9, label: 'heute', up: true },
        ])
        puff(g, 70, 570, 0.8, 1200)
        puff(g, 290, 570, 0.8, 1400)
      },
      ende(g) {
        puff(g, 180, 480, 2)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Ein Popcorn-Korn ist eine winzige **Dampfmaschine**.', 64), gfx: { maschine: {} } },
      { t: T('Innen steckt Stärke mit etwa **14 Prozent Wasser**. Außen sitzt eine harte, fast wasserdichte Schale.', 64), gfx: { schnitt: {} } },
      { t: T('Beim Erhitzen wird das Wasser zu **Dampf**. Die Schale hält ihn fest – der Druck im Korn steigt und steigt.', 64), gfx: { druck: {} } },
      { t: T('Bei rund **180 Grad** herrscht innen etwa neunmal so viel Druck wie in der Luft um dich herum.', 64), gfx: { zahl180: {} } },
      { t: T('Dann gibt die Schale nach und **platzt** schlagartig auf.', 64), gfx: { platzen: {} } },
      { t: T('Die heiße Stärke ist weich wie Brei. Der Dampf schäumt sie auf – und an der kühleren Luft **erstarrt** der Schaum sofort.', 64), gfx: { schaum: {} } },
      { t: T('Aus einem kleinen Korn wird so eine Flocke, die bis zu **40-mal** so viel Platz braucht.', 64), gfx: { schaum: {} } },
      { t: T('Französische Forscher filmten das 2015 mit Hochgeschwindigkeits-Kameras. Ihr Ergebnis: Das Plopp kommt nicht vom Riss, sondern vom **entweichenden Dampf**.', 64), gfx: { plopp: {} } },
      { t: T('Und das Hüpfen? Ein Stück Stärke drückt wie ein **Bein** gegen den Boden – das Korn katapultiert sich hoch.', 64), gfx: { sprung: {} } },
      { t: T('Das alles dauert nur wenige **Hundertstelsekunden**.', 64), gfx: { zeit: {} } },
      { t: T('Warum ploppt Zuckermais nicht? Seine Schale ist **zu durchlässig**: Der Dampf entweicht, bevor sich Druck aufbaut.', 64), gfx: { zuckermais: {} } },
      { t: T('Popcornmais ist eine eigene Sorte mit besonders **dichter, harter** Schale.', 64), gfx: { zuckermais: {} } },
      { t: T('Körner, die übrig bleiben, haben meist einen **Riss** in der Schale – oder sie sind zu trocken.', 64), gfx: { jungfer: {} } },
      { t: T('Ideal sind etwa **13 bis 14 Prozent** Wasser im Korn. Zu feucht, und das Popcorn wird zäh – zu trocken, und es bleibt klein.', 64), gfx: { schnitt: {} } },
      { t: T('Die Mikrowelle passt perfekt dazu: Sie erhitzt **direkt das Wasser** im Inneren der Körner.', 64), gfx: { mikro: {} } },
      { t: T('Es gibt zwei Formen: **Schmetterling** mit zarten Flügeln fürs Kino, **Pilz** als feste Kugel – die übersteht auch Karamell.', 64), gfx: { formen: {} } },
      { t: T('Popcorn ist uralt: In Peru fanden Archäologen gepoppte Maiskörner, die rund **6.000 Jahre** alt sind.', 64), gfx: { peru: {} } },
      { t: T('Und weil das ganze Korn aufpoppt, ist Popcorn ein **Vollkorn**-Snack – solange nicht zu viel Zucker und Fett dazukommen.', 480), gfx: { flocken: {} } },
      { t: T('Popcorn ist eine **Dampfexplosion** in Zeitlupe.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Im Korn wird Wasser zu Dampf; die dichte Schale hält den Druck, bis sie bei ~180 °C platzt.', 'Dampf schäumt die Stärke auf, die sofort erstarrt; das Plopp ist entweichender Dampf.', 'Zuckermais ploppt nicht – seine Schale ist undicht.'],
    sources: ['Virot & Ponomarenko 2015, Journal of the Royal Society Interface 12', 'Hoseney et al. 1983, Journal of Cereal Science 1', 'Grobman et al. 2012, PNAS 109 (Mais in Peru)'],
  },
  {
    id: 'rost',
    area: 'CHE',
    day: 2,
    hook: 'Rost ist ein sehr langsames Feuer.',
    mood: 'dunkel',
    ambience: 'regen',
    images: [img('rost'), img('freiheitsstatue')],
    draw: {
      nagel(g) {
        ink(g, [[60, 240], [260, 240], [300, 252], [260, 264], [60, 264]], { w: 3, t: 800 })
        ink(g, RR(40, 220, 20, 64, 4), { w: 3, d: 300, t: 400 })
        for (const [x, r] of [[120, 10], [190, 14], [240, 8]] as const) hatch(g, E(x, 252, r, 8), 900, true)
      },
      vergleich(g) {
        flame(g, 90, 560, 1.4)
        text(g, 90, 600, 'Feuer: Sekunden', { anchor: 'middle', cls: 's', d: 700 })
        ink(g, RR(210, 470, 100, 26, 6), { w: 2.6, d: 400, t: 400 })
        hatch(g, E(240, 483, 14, 8), 900, true)
        hatch(g, E(280, 483, 10, 6), 1000, true)
        text(g, 260, 600, 'Rost: Wochen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      wueste(g) {
        sun(g, 260, 360, 30)
        ink(g, B([20, 600], [100, 560], [200, 590], [340, 560]), { w: 3, t: 700 })
        ink(g, RR(80, 540, 120, 20, 5), { w: 2.6, d: 600, t: 400 })
        text(g, 180, 640, 'trocken: kaum Rost', { anchor: 'middle', cls: 's', d: 1000 })
      },
      tropfen(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        hatch(g, RR(20, 562, 320, 80, 2), 300, true)
        const dp: P[] = [...B([60, 560], [80, 470], [280, 470], [300, 560])]
        ink(g, dp, { w: 2.6, d: 300, t: 600 })
        for (const x of [160, 180, 200]) arrow(g, L([x, 556], [x, 520]), { w: 2, d: 900, t: 200, head: 7 })
        text(g, 180, 454, 'Eisen geht in Lösung', { anchor: 'middle', cls: 's', d: 1000 })
        const ox = st(g, 'x1', '--o: 90px 520px')
        arrow(ox, L([40, 440], [76, 520]), { w: 2, t: 0, head: 7 })
        arrow(ox, L([320, 440], [284, 520]), { w: 2, t: 0, head: 7 })
        text(ox, 180, 410, 'Sauerstoff am Rand', { anchor: 'middle', cls: 's', fade: false })
      },
      kreis(g) {
        ink(g, L([20, 560], [340, 560]), { w: 3, t: 500 })
        ink(g, B([60, 560], [80, 470], [280, 470], [300, 560]), { w: 2.6, d: 200, t: 600 })
        arrow(g, B([180, 600], [130, 610], [100, 600], [80, 580]), { w: 2.4, d: 800, t: 500, head: 9 })
        arrow(g, B([180, 600], [230, 610], [260, 600], [280, 580]), { w: 2.4, d: 800, t: 500, head: 9 })
        text(g, 180, 640, 'Elektronen fließen im Metall', { anchor: 'middle', cls: 's', d: 1200 })
      },
      poroes(g) {
        ink(g, L([20, 520], [340, 520]), { w: 3, t: 500 })
        for (let i = 0; i < 7; i++) {
          const x = 40 + i * 44
          const fl: P[] = [[x, 516], [x + 6, 494 - (i % 3) * 6], [x + 30, 490 - (i % 2) * 8], [x + 36, 516]]
          hatch(g, fl, 600 + i * 80, true)
          ink(g, fl, { w: 1.8, d: 400 + i * 80, t: 200 })
        }
        for (const [x, y] of [[90, 450], [200, 430], [280, 460]] as const) arrow(g, L([x, y - 40], [x, y]), { w: 2, d: 1200, t: 200, head: 7 })
        text(g, 180, 380, 'Wasser und Luft dringen weiter vor', { anchor: 'middle', cls: 's', d: 1300 })
      },
      salz(g) {
        drop(g, 110, 460, 1.8)
        for (const [x, y] of [[100, 470], [124, 480], [112, 456]] as const) ball(g, x, y, 4, { d: 800, fill: 'dicht', w: 1.2, t: 0 })
        const car: P[] = [[180, 520], [180, 494], [214, 490], [236, 460], [300, 460], [322, 490], [340, 494], [340, 520], [180, 520]]
        ink(g, car, { w: 2.6, d: 600, t: 600 })
        hatch(g, E(230, 512, 18, 6), 1300, true)
        text(g, 180, 600, 'Salz: leitet besser, rostet schneller', { anchor: 'middle', cls: 's', d: 1400 })
      },
      alu(g) {
        ink(g, RR(60, 460, 240, 60, 8), { w: 3, t: 600 })
        hatch(g, RR(60, 446, 240, 12, 4), 700, true)
        ink(g, RR(60, 446, 240, 12, 4), { w: 1.8, d: 600, t: 400 })
        text(g, 180, 430, 'dichte Oxidschicht', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 560, 'Aluminium', { anchor: 'middle', d: 1000 })
      },
      chrom(g) {
        ink(g, RR(60, 460, 240, 60, 8), { w: 3, t: 600 })
        ink(g, RR(60, 452, 240, 6, 3), { w: 1.4, d: 600, t: 400 })
        text(g, 180, 430, 'unsichtbare Chromoxid-Haut', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 560, 'Edelstahl', { anchor: 'middle', d: 1000 })
        arcArrow(g, 300, 380, 24, 0, 300, { d: 1200, t: 400 })
        text(g, 300, 330, 'heilt selbst', { anchor: 'middle', cls: 's', d: 1400 })
      },
      zink(g) {
        ink(g, RR(60, 470, 240, 60, 8), { w: 3, t: 600 })
        hatch(g, RR(60, 450, 240, 20, 4), 600)
        ink(g, RR(60, 450, 240, 20, 4), { w: 2, d: 500, t: 400 })
        text(g, 180, 430, 'Zink opfert sich zuerst', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 180, 570, 'Eisen bleibt geschützt', { anchor: 'middle', cls: 's', d: 1100 })
      },
      waerme(g) {
        ink(g, RR(110, 380, 140, 200, 20), { w: 3, t: 700 })
        for (let i = 0; i < 20; i++) dot(g, 130 + (i % 5) * 25, 410 + Math.floor(i / 5) * 40, 3, 500 + i * 30)
        for (const x of [140, 180, 220]) ink(g, B([x, 370], [x - 8, 350], [x + 8, 330], [x, 310]), { w: 2, d: 1300, t: 300 })
        text(g, 180, 620, 'Eisenpulver + Salz + Luft', { anchor: 'middle', cls: 's', d: 1400 })
      },
      koerper(g) {
        fig(g, 110, 620, 5)
        flame(g, 260, 560, 0.8, 600)
        text(g, 260, 600, 'kontrolliert, in Schritten', { anchor: 'middle', cls: 's', d: 1000 })
      },
      mars(g) {
        ball(g, 180, 460, 110, { fill: 'hell', w: 3.2 })
        for (const [x, y, r] of [[140, 420, 18], [220, 500, 24], [200, 400, 10]] as const) ink(g, E(x, y, r), { w: 1.8, d: 800, t: 300 })
        text(g, 180, 630, 'Mars: Staub mit Eisenoxid', { anchor: 'middle', cls: 's', d: 1100 })
      },
      statue(g) {
        ink(g, RR(150, 420, 60, 200, 10), { w: 3, t: 700 })
        ball(g, 180, 390, 26, { d: 300, fill: 'hell', w: 2.6 })
        for (let k = 0; k < 5; k++) {
          const a = rad(-150 + k * 30)
          ink(g, L([180 + Math.cos(a) * 28, 390 + Math.sin(a) * 28], [180 + Math.cos(a) * 46, 390 + Math.sin(a) * 46]), { w: 2.4, d: 600 + k * 80, t: 150 })
        }
        ink(g, L([210, 440], [260, 330]), { w: 3, d: 700, t: 300 })
        flame(g, 262, 332, 0.4, 1000)
        hatch(g, RR(152, 422, 56, 196, 8), 1100)
        text(g, 180, 650, 'Kupfer + Luft → grüne Patina', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        flame(g, 120, 560, 1)
        text(g, 180, 520, '≈', { anchor: 'middle', size: 30, d: 400 })
        ink(g, RR(220, 500, 90, 24, 6), { w: 2.6, d: 500, t: 400 })
        hatch(g, E(250, 512, 14, 8), 900, true)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Feuer und Rost sehen völlig verschieden aus. Chemisch tun sie **dasselbe**: Ein Stoff verbindet sich mit Sauerstoff.', 64), gfx: { vergleich: {} } },
      { t: T('Das heißt **Oxidation**. Beim Feuer geht es rasend schnell, beim Rost dauert es Wochen und Monate.', 64), gfx: { vergleich: {} } },
      { t: T('Eisen braucht dafür aber auch **Wasser**. In trockener Wüstenluft rostet es kaum.', 64), gfx: { wueste: {} } },
      { t: T('Unter einem Wassertropfen gehen Eisen-Teilchen in Lösung. Dabei geben sie **Elektronen** ab.', 64), gfx: { tropfen: {} } },
      { t: T('Am Rand des Tropfens, wo viel Sauerstoff aus der Luft ankommt, werden diese Elektronen **verbraucht**.', 64), gfx: { tropfen: { cls: 'a1' } } },
      { t: T('Die Elektronen fließen dazwischen durch das Metall: ein winziger **Stromkreis**, eine Batterie im Tropfen.', 64), gfx: { kreis: {} } },
      { t: T('Aus Eisen, Sauerstoff und Wasser entsteht der rotbraune **Rost**.', 64), gfx: { f1: { draw: 'formel', args: [['Eisen', '+', 'Sauerstoff', '+', 'Wasser', '→', 'Rost'], 360] } } },
      { t: T('Rost ist **porös** und blättert ab. Darunter liegt wieder frisches Eisen frei – der Rost frisst sich immer weiter.', 64), gfx: { poroes: {} } },
      { t: T('Salz beschleunigt das: Salzwasser **leitet Strom** viel besser. Darum rosten Autos im Winter und am Meer schneller.', 64), gfx: { salz: {} } },
      { t: T('Aluminium oxidiert sogar viel bereitwilliger als Eisen. Aber seine Oxidschicht ist **dicht** – und schützt das Metall darunter.', 64), gfx: { alu: {} } },
      { t: T('Edelstahl enthält **Chrom**. Es bildet eine hauchdünne, unsichtbare Schutzhaut, die sich bei Kratzern von selbst erneuert.', 64), gfx: { chrom: {} } },
      { t: T('Bei verzinktem Eisen opfert sich das **Zink**: Es oxidiert zuerst – und das Eisen bleibt verschont.', 64), gfx: { zink: {} } },
      { t: T('Rost setzt übrigens Wärme frei, wie ein Feuer – nur so langsam, dass du **nichts spürst**.', 64), gfx: { waerme: {} } },
      { t: T('Wärmepads nutzen genau das: Eisenpulver, Salz und Luft rosten in Minuten – die Packung wird **richtig heiß**.', 64), gfx: { waerme: {} } },
      { t: T('Auch dein Körper „verbrennt“ langsam: Er oxidiert Nährstoffe mit Sauerstoff – **kontrolliert**, in vielen kleinen Schritten.', 64), gfx: { koerper: {} } },
      { t: T('Und die Freiheitsstatue? Sie ist aus **Kupfer**. Ihr Grün ist Patina – Kupfer, das jahrzehntelang mit der Luft reagiert hat.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Und der Mars? Der Rote Planet ist rot, weil sein Staub voller **Eisenoxid** steckt – Rost im Planetenmaßstab.', 64), gfx: { mars: {} } },
      { t: T('Korrosion ist teuer: Weltweit kostet sie nach Schätzungen rund **drei Prozent** der gesamten Wirtschaftsleistung.', 64), gfx: { z1: { draw: 'zahl', args: ['3 %', 'der Wirtschaftsleistung weltweit', 440] } } },
      { t: T('Rost ist **Verbrennung** in Zeitlupe.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Rosten ist wie Brennen eine Oxidation – nur viel langsamer und nur mit Wasser.', 'Unter einem Tropfen entsteht ein winziger Stromkreis; Salz beschleunigt ihn.', 'Dichte Oxidschichten (Aluminium, Chrom) schützen; Wärmepads nutzen schnelles Rosten.'],
    sources: ['Atkins & de Paula: Physical Chemistry, Kap. Korrosion', 'Evans 1926: Tropfenversuch zur Korrosion', 'National Park Service: Statue of Liberty – Patina'],
  },
  {
    id: 'maillard',
    area: 'CHE',
    day: 2,
    hook: 'Warum schmeckt Gebratenes so viel besser als Gekochtes?',
    mood: 'hell',
    ambience: 'feuer',
    images: [img('steak'), img('brezel')],
    draw: {
      pfanne(g) {
        ink(g, B([40, 300], [60, 380], [300, 380], [320, 300]), { w: 3.2, t: 700 })
        ink(g, L([320, 306], [350, 286]), { w: 3, d: 300, t: 200 })
        const st0: P[] = [...B([100, 330], [110, 296], [240, 290], [260, 330]), ...L([260, 330], [100, 330]).slice(1)]
        hatch(g, st0, 800, true)
        ink(g, st0, { w: 2.6, d: 500, t: 500 })
        for (const x of [130, 180, 230]) ink(g, B([x, 270], [x - 10, 250], [x + 10, 230], [x, 210]), { w: 2, d: 1100, t: 300 })
      },
      beispiele(g) {
        const loaf: P[] = [...B([40, 500], [40, 420], [160, 420], [160, 500]), [40, 500]]
        hatch(g, loaf, 500, true)
        ink(g, loaf, { w: 2.8, t: 600 })
        ink(g, [[200, 430], [210, 520], [270, 520], [280, 430]], { w: 2.8, d: 300, t: 600 })
        ink(g, E(240, 430, 40, 8), { w: 2.2, d: 500, t: 300 })
        hatch(g, E(240, 430, 36, 6), 900, true)
        text(g, 100, 560, 'Brotkruste', { anchor: 'middle', cls: 's', d: 800 })
        text(g, 240, 560, 'Röstkaffee', { anchor: 'middle', cls: 's', d: 900 })
      },
      maillard(g) {
        text(g, 180, 440, 'Louis-Camille Maillard', { anchor: 'middle', size: 20, d: 200 })
        text(g, 180, 480, 'Nancy, 1912', { anchor: 'middle', cls: 's', d: 600 })
      },
      aromen(g) {
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 24; i++) {
          const x = 50 + rnd() * 260
          const y = 360 + rnd() * 220
          ink(g, E(x, y, 5 + rnd() * 6), { w: 1.6, d: 200 + i * 60, t: 150 })
        }
        text(g, 180, 640, 'Hunderte neue Aromastoffe', { anchor: 'middle', d: 1600 })
      },
      grad(g) {
        thermo(g, 90, 330, 240, 0.7)
        dashes(g, L([110, 416], [300, 416]), { w: 1.6, d: 600 })
        text(g, 300, 404, 'ab ≈ 140 °C: Bräunung', { anchor: 'end', cls: 's', d: 800 })
        dashes(g, L([110, 470], [300, 470]), { w: 1.6, d: 900 })
        text(g, 300, 494, '100 °C: Wasser kocht', { anchor: 'end', cls: 's', d: 1100 })
      },
      topf(g) {
        ink(g, [[70, 380], [80, 580], [280, 580], [290, 380]], { w: 3, t: 700 })
        hatch(g, RR(84, 440, 192, 136, 4), 500)
        for (let i = 0; i < 5; i++) ball(g, 110 + i * 36, 500 + (i % 2) * 20, 9, { d: 700 + i * 80, w: 1.6, t: 0 })
        text(g, 180, 640, 'nass: höchstens 100 °C', { anchor: 'middle', cls: 's', d: 1100 })
      },
      kruste(g) {
        ink(g, B([40, 520], [60, 600], [300, 600], [320, 520]), { w: 3.2, t: 700 })
        const st0: P[] = [...B([100, 560], [110, 520], [240, 514], [260, 560]), ...L([260, 560], [100, 560]).slice(1)]
        hatch(g, st0, 800)
        ink(g, st0, { w: 2.6, d: 500, t: 500 })
        hatch(g, RR(104, 554, 152, 8, 3), 1100, true)
        for (const x of [130, 180, 230]) arrow(g, L([x, 500], [x, 440]), { w: 1.8, d: 1000, t: 300, head: 7 })
        text(g, 180, 420, 'Wasser verdunstet → Kruste', { anchor: 'middle', cls: 's', d: 1300 })
      },
      toast(g) {
        ink(g, RR(90, 380, 180, 180, 30), { w: 3, t: 700 })
        hatch(g, RR(90, 380, 180, 180, 30), 600, true)
        blank(g, RR(108, 398, 144, 144, 20))
        ink(g, RR(108, 398, 144, 144, 20), { w: 1.6, d: 500, t: 600 })
        text(g, 180, 476, 'innen < 100 °C', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 180, 610, 'außen braun, innen weich', { anchor: 'middle', cls: 's', d: 1200 })
      },
      poren(g) {
        const st0: P[] = [...B([70, 520], [80, 460], [280, 450], [290, 520]), ...L([290, 520], [70, 520]).slice(1)]
        hatch(g, st0, 500)
        ink(g, st0, { w: 2.8, t: 600 })
        for (const [x, d] of [[110, 800], [180, 900], [250, 1000]] as const) drop(g, x, 570, 0.5, d, false)
        text(g, 180, 400, '„Poren schließen“? Ein Mythos', { anchor: 'middle', cls: 's', d: 1200 })
      },
      knoblauch(g) {
        const c: P[] = [...B([180, 340], [230, 380], [260, 500], [200, 590]), ...B([200, 590], [160, 600], [110, 560], [120, 470]).slice(1), ...B([120, 470], [130, 400], [160, 370], [180, 340]).slice(1)]
        blank(g, c)
        hatch(g, c, 800, true)
        ink(g, c, { w: 3, t: 900 })
        text(g, 180, 640, 'schwarzer Knoblauch: Wochen bei ≈ 60 °C', { anchor: 'middle', cls: 's', d: 1100 })
      },
      tupfen(g) {
        const st0: P[] = [...B([80, 540], [90, 490], [260, 480], [280, 540]), ...L([280, 540], [80, 540]).slice(1)]
        ink(g, st0, { w: 2.8, t: 600 })
        ink(g, RR(110, 420, 140, 50, 10), { w: 2.6, d: 400, t: 400 })
        for (let k = 0; k < 4; k++) ink(g, L([130 + k * 30, 430], [140 + k * 30, 460]), { w: 1.4, d: 700 + k * 60, t: 100 })
        text(g, 180, 600, 'trocken tupfen', { anchor: 'middle', d: 1000 })
      },
      voll(g) {
        ink(g, B([40, 500], [60, 580], [300, 580], [320, 500]), { w: 3.2, t: 700 })
        for (let i = 0; i < 8; i++) ink(g, E(70 + i * 30, 540 - (i % 2) * 10, 16, 10), { w: 2, d: 300 + i * 60, t: 200 })
        for (const x of [100, 160, 220, 280]) ink(g, B([x, 490], [x - 10, 470], [x + 10, 450], [x, 430]), { w: 2, d: 900, t: 300 })
        cross(g, 300, 380, 1, 1200)
        text(g, 160, 640, 'zu voll: es dampft statt brät', { anchor: 'middle', cls: 's', d: 1300 })
      },
      brezel(g) {
        const pts: P[] = [...B([180, 600], [80, 560], [60, 420], [150, 400]), ...B([150, 400], [220, 390], [230, 470], [180, 500]).slice(1), ...B([180, 500], [130, 470], [140, 390], [210, 400]).slice(1), ...B([210, 400], [300, 420], [280, 560], [180, 600]).slice(1)]
        ink(g, pts, { w: 6, t: 1400 })
        text(g, 300, 640, 'Lauge: braun und knusprig', { anchor: 'end', cls: 's', d: 1400 })
      },
      karamell(g) {
        box(g, 30, 370, 140, 90, ['Maillard:', 'Zucker + Eiweiß'], { size: 15 })
        box(g, 190, 370, 140, 90, ['Karamell:', 'nur Zucker'], { size: 15, d: 400, fill: true })
      },
      acrylamid(g) {
        const toast = (x: number, dense: boolean, d: number) => {
          ink(g, RR(x, 400, 110, 120, 20), { w: 2.8, d, t: 500 })
          hatch(g, RR(x + 6, 406, 98, 108, 16), d + 300, dense)
        }
        toast(40, false, 0)
        toast(210, true, 400)
        check(g, 95, 570, 1.2, 900)
        cross(g, 265, 570, 1.2, 1100)
        text(g, 180, 640, 'vergolden statt verkohlen', { anchor: 'middle', d: 1300 })
      },
      gehirn(g) {
        brain(g, 180, 450, 1.1)
        text(g, 180, 620, 'gegart = sicher und energiereich', { anchor: 'middle', cls: 's', d: 1200 })
      },
      roesten(g) {
        ink(g, E(120, 470, 50, 70), { w: 3, t: 700 })
        ink(g, B([120, 404], [104, 440], [136, 500], [120, 536]), { w: 2, d: 500, t: 400 })
        hatch(g, E(120, 470, 46, 66), 800)
        ink(g, [[220, 400], [230, 560], [300, 560], [310, 400]], { w: 2.8, d: 500, t: 600 })
        hatch(g, RR(226, 440, 78, 116, 4), 1100)
        text(g, 120, 600, 'Kakao, Malz, Kaffee', { anchor: 'middle', cls: 's', d: 1300 })
      },
      ende(g) {
        thermo(g, 180, 380, 200, 0.7)
      },
    },
    scenes: [
      { t: HOOK(476), pics: { p0: { img: 0, x: 16, y: 56, w: 328, h: 400, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Brotkruste, Röstkaffee, gebratenes Fleisch: Hinter diesem Duft steckt immer **dieselbe Reaktion**.', 64), gfx: { beispiele: {} } },
      { t: T('Sie heißt **Maillard-Reaktion** – nach dem französischen Chemiker Louis-Camille Maillard, der sie 1912 beschrieb.', 64), gfx: { maillard: {} } },
      { t: T('Dabei reagieren **Zucker** mit Bausteinen von Eiweißen, den Aminosäuren.', 64), gfx: { f1: { draw: 'formel', args: [['Zucker', '+', 'Aminosäuren', '→', 'Bräune', '+', 'Aroma'], 360] } } },
      { t: T('Es entstehen Hunderte neuer Stoffe: **röstige**, nussige, fleischige Aromen – und die braune Farbe.', 64), gfx: { aromen: {} } },
      { t: T('Richtig in Gang kommt die Reaktion aber erst ab etwa **140 Grad**.', 64), gfx: { grad: {} } },
      { t: T('Wasser kocht bei 100 Grad. Solange ein Lebensmittel nass ist, bleibt seine Oberfläche **bei 100 Grad** stecken.', 64), gfx: { grad: {} } },
      { t: T('Darum bräunt Gekochtes **nie**: Im Kochtopf wird es schlicht nicht heiß genug.', 64), gfx: { topf: {} } },
      { t: T('In der Pfanne verdunstet das Wasser an der Oberfläche. Dann steigt die Temperatur weiter – und die **Kruste** entsteht.', 64), gfx: { kruste: {} } },
      { t: T('Darum bräunt Toast außen und bleibt innen weich: Im Inneren steckt noch Wasser – dort bleibt es **unter 100 Grad**.', 64), gfx: { toast: {} } },
      { t: T('Daraus folgt der Küchentrick: Fleisch und Gemüse vor dem Braten **trocken tupfen** – sonst dämpfen sie erst.', 64), gfx: { tupfen: {} } },
      { t: T('Und die Pfanne nicht **überfüllen**: Zu viel Dampf, und alles kocht im eigenen Saft.', 64), gfx: { voll: {} } },
      { t: T('Scharfes Anbraten „schließt“ übrigens **keine Poren**. Der Saft tritt trotzdem aus – das Fleisch schmeckt nur besser.', 64), gfx: { poren: {} } },
      { t: T('Eine basische Lauge beschleunigt die Reaktion stark – darum werden **Laugenbrezeln** so tiefbraun.', 64), pics: { p1: { img: 1, x: 16, y: 268, w: 328, h: 380, enter: 'blot', cam: [50, 45, 1.05], cam2: [50, 45, 1.2] } } },
      { t: T('Bei niedriger Temperatur läuft die Reaktion ganz langsam: **Schwarzer Knoblauch** reift wochenlang bei rund 60 Grad.', 64), gfx: { knoblauch: {} } },
      { t: T('Nicht verwechseln mit **Karamellisierung**: Dabei zerfällt nur Zucker, ganz ohne Eiweiß.', 64), gfx: { karamell: {} } },
      { t: T('Zu dunkel wird es ungesund: Bei sehr starker Bräunung entsteht **Acrylamid**. Die Faustregel lautet: vergolden statt verkohlen.', 64), gfx: { acrylamid: {} } },
      { t: T('Warum lieben wir diese Aromen? Eine Vermutung: Sie zeigen **gegartes**, sicheres und energiereiches Essen an.', 64), gfx: { gehirn: {} } },
      { t: T('Auch Schokolade, Bier und Kaffee verdanken ihr Aroma großteils dem **Rösten** – von Kakaobohnen, Malz und Kaffeebohnen.', 64), gfx: { roesten: {} } },
      { t: T('Geschmack entsteht **ab 140 Grad**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Bei der Maillard-Reaktion bilden Zucker und Aminosäuren Hunderte Röstaromen.', 'Sie braucht rund 140 °C – nasse Lebensmittel bleiben bei 100 °C, darum bräunt Gekochtes nicht.', 'Trocken tupfen, Pfanne nicht überfüllen; vergolden statt verkohlen (Acrylamid).'],
    sources: ['Maillard 1912, Comptes Rendus de l’Académie des Sciences 154', 'McGee 2004: On Food and Cooking', 'Bundesinstitut für Risikobewertung: Acrylamid in Lebensmitteln'],
  },
]
