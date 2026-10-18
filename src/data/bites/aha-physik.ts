import type { Bite } from '../feed'
import { B, E, HOOK, L, RR, T, arrow, bigText, blank, bolt, clock, countUp, cross, dashes, eye, fig, group, hatch, hbars, ink, mk, mountain, pop, question, rays, st, star, text, timeline, vbars, type P } from './draw'
import { arcArrow, axes, ball, bird, bow, cloud, dot, dplot, drop, earth, eyeFront, flake, flow, foilAt, glide, ground, house, jet, mapRegion, moonFace, pie, plot, rad, rain, ripple, sea, smooth, spin, stars, sun, thermo, travelWave, tree, waveP, wing, wobble } from './kit'

// Physik & Kosmos: Phänomene zum Staunen, je etwa zwei Minuten (Layout-Regeln in kit.ts)

/** Mond mit Kratern (Ränder auf der Schattenseite kräftiger) und dunklen Meeren */
function moon(g: Element, cx: number, cy: number, r: number, d = 0): void {
  blank(g, E(cx, cy, r))
  for (const [a, b, rx, ry] of [[-0.25, -0.2, 0.32, 0.22], [0.2, 0.15, 0.24, 0.3], [-0.3, 0.35, 0.18, 0.12]] as const) hatch(g, E(cx + a * r, cy + b * r, rx * r, ry * r), d + 500)
  ink(g, E(cx, cy, r), { w: 3, d, t: 700 })
  for (const [a, b, k] of [[-0.45, -0.45, 0.14], [0.38, -0.32, 0.12], [-0.05, 0.55, 0.16], [0.5, 0.42, 0.09], [-0.62, 0.12, 0.08], [0.1, -0.62, 0.07]] as const) {
    ink(g, E(cx + a * r, cy + b * r, k * r, k * r, 200, 380), { w: 1.8, d: d + 400, t: 300 })
    ink(g, E(cx + a * r, cy + b * r, k * r, k * r, 20, 200), { w: 0.9, d: d + 450, t: 300 })
  }
}

/** Steinchen-Sterne: kleine Kreuze */
function twinkle(g: Element, pts: P[], d = 0, s = 6): void {
  pts.forEach(([x, y], i) => {
    const p = pop(g, d + i * 60, '50% 50%')
    ink(p, L([x - s, y], [x + s, y]), { w: 1.8, t: 0 })
    ink(p, L([x, y - s], [x, y + s]), { w: 1.8, t: 0 })
  })
}

/** Raumstation (ISS-artig): langer Gitterträger, acht Solarflügel mit Zellenraster, Module in der Mitte; Breite ≈ 130 × s */
function station(g: Element, x: number, y: number, s = 1, d = 0): void {
  const w = Math.min(1.2, Math.max(0.6, s))
  for (const sx of [-1, 1])
    for (const k of [0, 1])
      for (const sy of [-1, 1]) {
        const px = x + sx * (40 + k * 14) * s - 5 * s
        const py = sy < 0 ? y - 38 * s : y + 4 * s
        const pan = RR(px, py, 10 * s, 34 * s, 1)
        blank(g, pan)
        hatch(g, pan, d + 400, true)
        ink(g, pan, { w: 1.4 * w, d: d + 200 + k * 80, t: 250 })
        if (s >= 0.6) for (let j = 1; j < 4; j++) ink(g, L([px, py + j * 8.5 * s], [px + 10 * s, py + j * 8.5 * s]), { w: 0.8 * w, d: d + 500, t: 80 })
      }
  const truss = RR(x - 64 * s, y - 2.5 * s, 128 * s, 5 * s, 1)
  blank(g, truss)
  ink(g, truss, { w: 1.8 * w, d, t: 400 })
  if (s >= 0.6) for (let k = -6; k <= 6; k++) ink(g, L([x + k * 9 * s - 3 * s, y - 2.5 * s], [x + k * 9 * s + 3 * s, y + 2.5 * s]), { w: 0.8 * w, d: d + 300, t: 60 })
  const mod = RR(x - 6 * s, y - 22 * s, 12 * s, 44 * s, 5 * s)
  blank(g, mod)
  ink(g, mod, { w: 2 * w, d: d + 100, t: 400 })
  for (const k of [-12, 0, 12]) ink(g, L([x - 6 * s, y + k * s], [x + 6 * s, y + k * s]), { w: 0.9 * w, d: d + 400, t: 80 })
  const side = RR(x - 18 * s, y + 8 * s, 36 * s, 8 * s, 3 * s)
  blank(g, side)
  ink(g, side, { w: 1.6 * w, d: d + 200, t: 300 })
  const rad1: P[] = [[x + 14 * s, y - 8 * s], [x + 26 * s, y - 16 * s], [x + 26 * s, y - 10 * s], [x + 14 * s, y - 2.5 * s]]
  hatch(g, rad1, d + 500)
  ink(g, [...rad1, rad1[0]], { w: 1 * w, d: d + 300, t: 200 })
}

export const AHA_PHYSIK: Bite[] = [
  {
    id: 'himmel-blau',
    area: 'PHY',
    day: 49,
    hook: 'Warum ist der Himmel blau – und abends rot?',
    mood: 'hell',
    ambience: 'wind',
    images: [],
    draw: {
      himmel(g) {
        sun(g, 276, 140, 28)
        const hill: P[] = smooth([[20, 400], [90, 372], [170, 392], [250, 366], [340, 386]])
        ink(g, hill, { w: 2.8, d: 200, t: 700 })
        ground(g, 20, 340, 440, 300)
        tree(g, 300, 440, 0.5, 400)
        fig(g, 130, 440, 1.9, { d: 500 })
        bird(g, 90, 160, 0.9, 900)
        bird(g, 116, 178, 0.6, 1000)
        // Luftmoleküle am ganzen Himmel blitzen auf, wenn sie Licht streuen
        let seed = 3
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 34; i++) {
          const x = 30 + rnd() * 300
          const y = 70 + rnd() * 280
          if (Math.hypot(x - 276, y - 140) < 62 || (x > 90 && x < 170 && y > 300) || y > 352) continue
          const p = mk('g', { class: 'blink', style: `--d:${900 + (i % 9) * 140}ms` }, g)
          dot(p, x, y, 2.4, 800 + i * 30)
        }
        // ein Lichtweg: Sonne → Molekül → Auge
        dashes(g, L([250, 160], [190, 236]), { w: 1.4, d: 1200, dash: 5, gap: 5 })
        dot(g, 186, 240, 3.4, 1500)
        flow(g, [[186, 240], [133, 380]], { n: 2, ms: 1100, d: 1700, r: 2.4 })
      },
      prisma(g) {
        // Spalt, weißer Strahl, Glasprisma (räumlich), Farbfächer auf einem Schirm
        ink(g, RR(14, 360, 14, 90, 3), { w: 2.4, t: 300 })
        hatch(g, RR(14, 360, 14, 34, 2), 300, true)
        hatch(g, RR(14, 412, 14, 38, 2), 300, true)
        ink(g, L([28, 404], [150, 404]), { w: 4, d: 300, t: 400 })
        flow(g, L([28, 404], [150, 404]), { n: 3, ms: 900, d: 800, r: 2.6 })
        const A: P = [176, 318]
        const Bp: P = [236, 470]
        const C: P = [116, 470]
        const off: P = [22, -16]
        const back = (q: P): P => [q[0] + off[0], q[1] + off[1]]
        const side: P[] = [A, back(A), back(Bp), Bp, A]
        blank(g, side)
        hatch(g, side, 600, true)
        ink(g, side, { w: 2.4, d: 300, t: 500 })
        const front: P[] = [A, Bp, C, A]
        blank(g, front)
        hatch(g, front, 500)
        ink(g, front, { w: 3, d: 200, t: 600 })
        ink(g, L(C, back(C)), { w: 1.4, d: 500, t: 200 })
        ink(g, L(back(C), back(A)), { w: 1.4, d: 500, t: 200 })
        ink(g, L([150, 404], [196, 412]), { w: 2.6, d: 700, t: 200 })
        ink(g, L([292, 330], [292, 520]), { w: 4, d: 600, t: 400 })
        const names = ['Rot', 'Orange', 'Gelb', 'Grün', 'Blau', 'Violett']
        names.forEach((n, i) => {
          const y = 356 + i * 28
          const p = L([206, 410 + i * 4], [288, y])
          ink(g, p, { w: 2, d: 900 + i * 80, t: 300 })
          flow(g, p, { n: 2, ms: 900, d: 1400 + i * 60, r: 2 })
          text(g, 300, y + 5, n, { cls: 's', d: 1000 + i * 80 })
        })
      },
      wellen(g) {
        travelWave(g, 30, 330, 410, 28, 150, { ms: 1500 })
        arrow(g, L([105, 460], [255, 460]), { w: 1.6, d: 1000, t: 300, head: 7 })
        arrow(g, L([255, 460], [105, 460]), { w: 1.6, d: 1000, t: 300, head: 7 })
        text(g, 180, 482, '700 nm', { anchor: 'middle', cls: 's', d: 1200 })
        text(g, 30, 360, 'Rot', { d: 0 })
        travelWave(g, 30, 330, 570, 28, 96, { ms: 960, d: 600 })
        arrow(g, L([132, 620], [228, 620]), { w: 1.6, d: 1600, t: 300, head: 7 })
        arrow(g, L([228, 620], [132, 620]), { w: 1.6, d: 1600, t: 300, head: 7 })
        text(g, 180, 642, '450 nm', { anchor: 'middle', cls: 's', d: 1800 })
        text(g, 30, 520, 'Blau', { d: 600 })
      },
      luft(g) {
        // Lupe auf ein Stück Luft: N₂ und O₂ etwa 4 : 1, sie zittern; dahinter eine Lichtwelle als Größenvergleich
        ink(g, waveP(20, 340, 460, 120, 600, -Math.PI / 2), { w: 1.4, d: 200, t: 900 })
        blank(g, E(180, 460, 130))
        ink(g, E(180, 460, 130), { w: 3.2, t: 800 })
        ink(g, L([272, 552], [322, 612]), { w: 7, d: 600, t: 300 })
        const pos: P[] = [[110, 400], [200, 370], [260, 430], [150, 470], [100, 520], [220, 510], [270, 500], [180, 570], [140, 420], [230, 450]]
        pos.forEach(([x, y], i) => {
          const o2 = i % 5 === 3
          const m = wobble(g, { dx: (i % 2 ? 3 : -3), dy: (i % 3) - 1, ms: 700 + i * 90, d: 1000 })
          const a = rad(i * 47)
          const dx = Math.cos(a) * 7
          const dy = Math.sin(a) * 7
          ball(m, x - dx, y - dy, 7, { d: 400 + i * 70, fill: o2 ? 'dicht' : 'hell', w: 1.8, t: 0 })
          ball(m, x + dx, y + dy, 7, { d: 430 + i * 70, fill: o2 ? 'dicht' : 'hell', w: 1.8, t: 0 })
        })
        text(g, 60, 340, 'N₂', { anchor: 'middle', d: 1300 })
        text(g, 304, 340, 'O₂', { anchor: 'middle', d: 1400 })
        dashes(g, L([70, 346], [96, 388]), { w: 1.2, d: 1300, dash: 4, gap: 4 })
        dashes(g, L([296, 346], [266, 404]), { w: 1.2, d: 1400, dash: 4, gap: 4 })
      },
      streu(g) {
        // ankommende Welle bringt die Elektronenhülle zum Schwingen; das Molekül sendet Kugelwellen aus
        travelWave(g, 14, 128, 450, 12, 30, { ms: 500, w: 2.4 })
        const m = wobble(g, { dy: 5, ms: 500, d: 800 })
        ink(m, E(180, 450, 32, 26), { w: 1.4, d: 300, t: 400 })
        ball(g, 180, 450, 12, { d: 300, fill: 'dicht' })
        dot(m, 206, 440, 3, 600)
        dot(m, 156, 462, 3, 650)
        const a = st(g, 'f1')
        ripple(a, 180, 450, 40, 150, { n: 4, ms: 2000, w: 1.8 })
        for (let k = 0; k < 8; k++) {
          const ang = rad(k * 45 + 22.5)
          arrow(a, L([180 + Math.cos(ang) * 46, 450 + Math.sin(ang) * 46], [180 + Math.cos(ang) * 104, 450 + Math.sin(ang) * 104]), { w: 2.2, t: 0, head: 8 })
        }
      },
      rayleigh(g) {
        // Streuung ∝ 1/λ⁴: steil fallende Kurve über dem Spektrum
        axes(g, 60, 590, 320, 300, { yl: 'Streuung', d: 0 })
        text(g, 320, 640, 'Wellenlänge', { anchor: 'end', cls: 's', d: 300 })
        const f = (t: number) => Math.pow(400 / (400 + t * 320), 4)
        const pts = plot(g, 60, 590, 250, 260, f, { d: 400, t: 1200 })
        const mark = (nm: number, label: string, dd: number) => {
          const t = (nm - 400) / 320
          const x = 60 + 250 * t
          const y = 590 - 260 * f(t)
          dashes(g, L([x, 590], [x, y]), { w: 1.4, d: dd, dash: 5, gap: 4 })
          dot(g, x, y, 5, dd + 200)
          text(g, x, 612, label, { anchor: 'middle', cls: 's', d: dd + 200 })
        }
        mark(450, 'Blau', 1500)
        mark(700, 'Rot', 1800)
        const sc = (t: number) => 590 - 260 * f(t)
        text(g, 60 + 250 * (50 / 320) + 12, sc(50 / 320) - 4, '5,8×', { d: 2200, size: 18 })
        text(g, 60 + 250 * (300 / 320) - 4, sc(300 / 320) - 14, '1×', { anchor: 'end', d: 2300, size: 18 })
        void pts
      },
      tag(g) {
        sun(g, 70, 320, 22)
        ground(g, 20, 340, 620, 200)
        house(g, 40, 620, 44, 300)
        fig(g, 270, 618, 1.7, { d: 300 })
        const src: P[] = [[120, 440], [170, 360], [240, 340], [320, 380], [150, 520], [330, 470], [200, 430]]
        src.forEach(([x, y], i) => {
          const d = 700 + i * 140
          dashes(g, L([88, 330], [x, y]), { w: 1, d, dash: 3, gap: 6 })
          ripple(g, x, y, 4, 16, { n: 2, ms: 1600, d: d + 300, w: 1.2 })
          dot(g, x, y, 3.4, d + 200)
          const ex = 270
          const ey = 566
          const len = Math.hypot(ex - x, ey - y)
          const k = (len - 26) / len
          const p = L([x + (ex - x) * 0.12, y + (ey - y) * 0.12], [x + (ex - x) * k, y + (ey - y) * k])
          arrow(g, p, { w: 1.6, d: d + 300, t: 400, head: 7 })
          flow(g, p, { n: 1, ms: 1200, d: d + 900, r: 2.2 })
        })
      },
      auge(g) {
        eyeFront(g, 180, 380, 1.5)
        // Sonnenspektrum: im Violett schwächer; darunter die Farbskala
        const x0 = 50
        const w = 260
        axes(g, x0, 600, 330, 460, { d: 600 })
        const sunI = (t: number) => 0.45 + 0.55 * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2) - 0.12 * t
        const pts = plot(g, x0, 600, w, 120, sunI, { d: 900, t: 900 })
        hatch(g, [[x0, 600], ...pts, [x0 + w, 600]], 1500)
        ;['Violett', 'Blau', 'Grün', 'Gelb', 'Rot'].forEach((n, i) => text(g, x0 + 12 + i * 60, 624, n, { anchor: 'middle', cls: 's', d: 1200 + i * 80, size: 11.5 }))
      },
      abend(g) {
        const cx = 180
        const cy = 640
        // Erde, darüber die Lufthülle als Band
        const band: P[] = [...E(cx, cy, 380, 380, 230, 310), ...E(cx, cy, 300, 300, 310, 230)]
        hatch(g, band, 500)
        ink(g, E(cx, cy, 300, 300, 222, 318), { w: 3, t: 700 })
        ink(g, E(cx, cy, 380, 380, 230, 310), { w: 1.4, d: 400, t: 700 })
        text(g, 286, 330, 'Lufthülle', { cls: 's halo', d: 600 })
        fig(g, 180, 342, 1.3, { d: 500 })
        const noon = group(g, 'h1')
        sun(noon, 180, 150, 16, 700, 8)
        const np = L([180, 186], [180, 296])
        arrow(noon, np, { w: 2.6, d: 900, t: 400, head: 9 })
        flow(noon, np, { n: 2, ms: 900, d: 1400, r: 2.4 })
        const eve = st(g, 'f1', '--dl:200ms')
        sun(eve, 30, 318, 13, 0, 8)
        const ep = L([52, 322], [164, 322])
        arrow(eve, ep, { w: 2.6, t: 0, head: 9 })
        flow(eve, ep, { n: 3, ms: 1800, r: 2.4 })
        const lost = st(g, 'x2', '--o: 100px 320px')
        for (const x of [72, 102, 132]) arrow(lost, L([x, 316], [x + 12, 276]), { w: 1.8, t: 0, head: 7 })
        text(lost, 102, 264, 'Blau', { anchor: 'middle', cls: 's', fade: false })
      },
      rest(g) {
        // tief stehende Sonne, Licht auf dem langen Weg: Blau und Grün werden nach und nach weggestreut
        sun(g, 30, 350, 14, 0, 8)
        ink(g, smooth([[0, 560], [120, 548], [240, 552], [360, 540]]), { w: 2.6, d: 100, t: 600 })
        const names = ['Violett', 'Blau', 'Grün', 'Gelb', 'Orange', 'Rot']
        names.forEach((n, i) => {
          const y = 410 + i * 24
          const d = 300 + i * 120
          text(g, 56, y + 4, n, { anchor: 'end', cls: 's', d, size: 11 })
          if (i < 4) {
            const xe = 110 + i * 40
            ink(g, L([60, y], [xe, y]), { w: 2, d, t: 300 })
            const up = L([xe, y], [xe + 22, y - 44 - i * 8])
            arrow(g, up, { w: 1.6, d: d + 300, t: 300, head: 6 })
            flow(g, [[60, y], [xe, y], up[up.length - 1]], { n: 1, ms: 1400, d: d + 700, r: 1.8 })
          } else {
            const p = L([60, y], [272, 486])
            arrow(g, p, { w: 2.4, d, t: 600, head: 8 })
            flow(g, p, { n: 2, ms: 1500, d: d + 700, r: 2.2 })
          }
        })
        eyeFront(g, 312, 486, 0.45, 1300)
        cloud(g, 250, 360, 0.5, 900, true)
      },
      wolke(g) {
        cloud(g, 110, 380, 1.1)
        dashes(g, L([150, 360], [204, 404]), { w: 1.2, d: 500, dash: 4, gap: 4 })
        ink(g, E(196, 480, 74), { w: 2.8, d: 600, t: 600 })
        ball(g, 196, 480, 40, { d: 900, fill: 'hell' })
        ink(g, waveP(152, 186, 480, 4, 9), { w: 1.6, d: 1000, t: 300 })
        ;['Rot', 'Grün', 'Blau'].forEach((n, i) => {
          const ang = rad(-60 + i * 60)
          const p = L([196 + Math.cos(ang) * 78, 480 + Math.sin(ang) * 78], [196 + Math.cos(ang) * 110, 480 + Math.sin(ang) * 110])
          arrow(g, p, { w: 2.2, d: 1200 + i * 150, t: 250, head: 8 })
          text(g, 196 + Math.cos(ang) * 130, 480 + Math.sin(ang) * 130 + 4, n, { anchor: 'middle', cls: 's', d: 1300 + i * 150 })
        })
        text(g, 196, 588, 'Tröpfchen', { anchor: 'middle', cls: 's', d: 1000 })
      },
      berge(g) {
        // Gebirgskämme: abwechselnd Gipfel und Sattel, leicht unregelmäßig
        const ridge = (y: number, amp: number, ph: number): P[] => {
          let seed = Math.round(ph * 100)
          const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
          const pts: P[] = [[20, y - amp * 0.3]]
          for (let x = 20, k = 0; x < 340; k++) {
            x = Math.min(340, x + 18 + rnd() * 26)
            pts.push([x, y - (k % 2 ? amp * (0.1 + rnd() * 0.25) : amp * (0.55 + rnd() * 0.45))])
          }
          return [[20, 640], ...smooth(pts, 2), [340, 640]]
        }
        const far = ridge(430, 90, 0.4)
        blank(g, far)
        ink(g, far.slice(1, -1), { w: 1.2, t: 700 })
        const mid = ridge(500, 70, 1.6)
        blank(g, mid)
        hatch(g, mid, 700)
        ink(g, mid.slice(1, -1), { w: 2.2, d: 300, t: 700 })
        const near = ridge(580, 50, 2.4)
        blank(g, near)
        hatch(g, near, 1000, true)
        ink(g, near.slice(1, -1), { w: 3, d: 600, t: 700 })
        for (const [x, y] of [[60, 600], [86, 596], [292, 590]] as const) tree(g, x, y, 0.22, 1100)
        // Streulicht aus der Luft zwischen dir und den fernen Gipfeln
        let seed = 9
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 18; i++) {
          const p = mk('g', { class: 'blink', style: `--d:${1300 + (i % 6) * 160}ms` }, g)
          dot(p, 30 + rnd() * 300, 330 + rnd() * 60, 1.8, 1200 + i * 40)
        }
      },
      meer(g) {
        // Tiefenskala: Rot ist nach wenigen Metern verschluckt, Blau dringt am tiefsten
        sea(g, 20, 300, 320, 0, 1)
        ;(['Rot', 'Gelb', 'Grün', 'Blau'] as const).forEach((n, i) => {
          const x = 50 + i * 64
          const y1 = 380 + i * 80
          const p = L([x, 340], [x, y1])
          arrow(g, p, { w: 2.6, d: 600 + i * 300, t: 400, head: 9 })
          flow(g, p, { n: 2, ms: 1400 + i * 400, d: 1000 + i * 300, r: 2.2 })
          text(g, x + 8, y1 + 20, n, { cls: 's', d: 900 + i * 300 })
        })
        ink(g, L([310, 330], [310, 650]), { w: 2, d: 200, t: 600 })
        ;[['10 m', 380], ['30 m', 460], ['60 m', 540], ['100 m', 620]].forEach(([l, y], i) => {
          ink(g, L([304, y as number], [316, y as number]), { w: 1.6, d: 400 + i * 100, t: 100 })
          text(g, 300, (y as number) + 4, l as string, { anchor: 'end', cls: 's', d: 500 + i * 100, size: 11 })
        })
        const fish = (x: number, y: number, s: number, dd: number) => {
          const f = wobble(g, { dx: -6, ms: 2600, d: dd })
          const b: P[] = [...B([x, y], [x + 8 * s, y - 7 * s], [x + 20 * s, y - 6 * s], [x + 26 * s, y]), ...B([x + 26 * s, y], [x + 20 * s, y + 6 * s], [x + 8 * s, y + 7 * s], [x, y]).slice(1)]
          ink(f, b, { w: 1.8, d: dd, t: 300 })
          ink(f, [[x, y], [x - 8 * s, y - 6 * s], [x - 8 * s, y + 6 * s], [x, y]], { w: 1.6, d: dd + 200, t: 200 })
          dot(f, x + 20 * s, y - 1.5 * s, 1.4 * s, dd + 300)
        }
        fish(250, 420, 1, 1500)
        fish(170, 580, 0.8, 1700)
      },
      mond(g) {
        // schwarzer Himmel, Sonne ohne Himmelsleuchten, die Erde hängt im Dunkeln
        const sky = RR(24, 290, 312, 250, 12)
        hatch(g, sky, 300, true)
        ink(g, sky, { w: 3, t: 700 })
        blank(g, E(270, 350, 22))
        ink(g, E(270, 350, 22), { w: 2.4, d: 500, t: 500 })
        blank(g, E(90, 360, 30))
        earth(g, 90, 360, 30, 600, { lon: -20, lat: 10, w: 1 })
        const grd: P[] = [[24, 540], ...smooth([[24, 500], [100, 488], [200, 496], [336, 486]]), [336, 540]]
        blank(g, grd)
        ink(g, grd.slice(1, -1), { w: 2.8, d: 400, t: 600 })
        for (const [x, y, rx] of [[80, 520, 26], [230, 514, 18], [300, 530, 10]] as const) ink(g, E(x, y, rx, rx * 0.25), { w: 1.6, d: 800, t: 300 })
        // Mondfähre und Astronaut
        const lm: P[] = [[150, 470], [150, 446], [160, 436], [184, 436], [194, 446], [194, 470], [150, 470]]
        blank(g, lm)
        hatch(g, lm, 1100, true)
        ink(g, lm, { w: 2.2, d: 900, t: 400 })
        for (const [a, b] of [[150, 136], [194, 208]] as const) ink(g, L([a, 466], [b, 492]), { w: 1.8, d: 1000, t: 200 })
        ink(g, L([172, 470], [172, 492]), { w: 1.8, d: 1000, t: 200 })
        fig(g, 252, 498, 1.3, { d: 1200, arms: 'up' })
        ink(g, L([284, 498], [284, 446]), { w: 1.6, d: 1400, t: 200 })
        ink(g, RR(284, 446, 24, 14, 1), { w: 1.4, d: 1500, t: 200 })
      },
      mars(g) {
        // Rover auf steinigem Grund; die tiefe Sonne hat einen bläulichen Hof
        const grd: P[] = smooth([[20, 560], [100, 548], [220, 556], [340, 544]])
        ink(g, grd, { w: 3, t: 600 })
        blank(g, E(250, 520, 16))
        ink(g, E(250, 520, 16, 16, 180, 360), { w: 2.4, d: 300, t: 400 })
        for (const r of [34, 52, 72]) dashes(g, E(250, 548, r, r * 0.85, 200, 340), { w: 1.6, d: 600 + r * 6, dash: 6, gap: 5 })
        for (const [x, y, s] of [[60, 590, 1], [140, 610, 0.6], [300, 596, 0.8], [210, 630, 0.5]] as const) {
          const rock: P[] = [[x - 14 * s, y], [x - 10 * s, y - 10 * s], [x + 4 * s, y - 13 * s], [x + 14 * s, y - 4 * s], [x + 12 * s, y], [x - 14 * s, y]]
          hatch(g, rock, 900, true)
          ink(g, rock, { w: 1.8, d: 700, t: 300 })
        }
        // Rover
        const rv: P[] = [[60, 520], [130, 520], [130, 536], [60, 536], [60, 520]]
        blank(g, rv)
        hatch(g, rv, 1100)
        ink(g, rv, { w: 2.2, d: 900, t: 400 })
        for (const x of [68, 95, 122]) {
          blank(g, E(x, 546, 8))
          ink(g, E(x, 546, 8), { w: 2, d: 1000, t: 300 })
        }
        ink(g, L([112, 520], [112, 486]), { w: 2, d: 1100, t: 200 })
        ink(g, RR(104, 476, 18, 10, 2), { w: 1.8, d: 1200, t: 200 })
        ink(g, L([70, 520], [60, 500]), { w: 1.6, d: 1200, t: 200 })
        ink(g, E(56, 496, 7, 3), { w: 1.4, d: 1300, t: 200 })
        let seed = 21
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 20; i++) {
          const p = wobble(g, { dx: 14, dy: -3, ms: 3000 + i * 100, d: 1000 })
          dot(p, 20 + rnd() * 320, 320 + rnd() * 180, 1.4, 1200 + i * 30)
        }
      },
      ende(g) {
        sun(g, 180, 500, 40)
        ripple(g, 180, 500, 70, 160, { n: 3, ms: 3000, d: 800, w: 1.6 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { himmel: {} } },
      { t: T('Sonnenlicht sieht weiß aus. Doch ein Prisma zeigt: Es ist eine Mischung aus **allen Farben** – von Rot bis Violett.', 64), gfx: { prisma: {} } },
      { t: T('Jede Farbe ist eine Welle. Rotes Licht hat **lange** Wellen, blaues Licht deutlich **kürzere**.', 64), gfx: { wellen: {} } },
      { t: T('Luft besteht aus winzigen Molekülen, vor allem Stickstoff und Sauerstoff – viel **kleiner** als jede Lichtwelle.', 64), gfx: { luft: {} } },
      { t: T('Trifft Licht ein Molekül, bringt es dessen Elektronen zum Schwingen. Das Molekül strahlt dann Licht in **alle Richtungen** ab.', 64), gfx: { streu: {} } },
      { t: T('Physiker nennen das **Streuung**. Je kürzer die Welle, desto stärker wird sie aus ihrer Bahn geworfen.', 64), gfx: { streu: { cls: 'a1' } } },
      { t: T('Lord Rayleigh fand 1871 heraus: Es geht mit der **vierten Potenz**. Blau wird gut fünfmal stärker gestreut als Rot.', 64), gfx: { rayleigh: {} } },
      { t: T('Wohin du auch schaust: Von überall am Himmel kommt **gestreutes Blau** zu dir. Der ganze Himmel leuchtet.', 64), gfx: { tag: {} } },
      { t: T('Aber Violett streut noch stärker – warum ist der Himmel nicht lila? Die Sonne liefert weniger davon, und **dein Auge** reagiert auf Blau stärker.', 64), gfx: { auge: {} } },
      { t: T('Mittags fällt das Licht steil ein. Sein Weg durch die Luft ist **kurz**.', 480), gfx: { abend: {} } },
      { t: T('Abends steht die Sonne tief. Ihr Licht muss jetzt einen **viel längeren Weg** durch die Lufthülle nehmen.', 480), gfx: { abend: { cls: 'a1' } } },
      { t: T('Auf diesem langen Weg wird das Blau nach und nach zur Seite **weggestreut**, bevor es dich erreicht.', 480), gfx: { abend: { cls: 'a1 a2' } } },
      { t: T('Übrig bleibt, was kaum streut: **Orange und Rot**. Darum glüht der Himmel bei Sonnenuntergang.', 64), gfx: { rest: {} } },
      { t: T('Wolken dagegen sind **weiß**: Ihre Tröpfchen sind größer als die Lichtwellen und streuen alle Farben gleich stark.', 64), gfx: { wolke: {} } },
      { t: T('Darum wirken auch **ferne Berge** bläulich: Zwischen dir und ihnen liegt viel Luft, die Blau in deinen Blick streut.', 64), gfx: { berge: {} } },
      { t: T('Das Meer ist dagegen aus einem anderen Grund blau: Wasser **schluckt** rotes Licht. Schon nach wenigen Metern Tiefe bleibt vor allem Blau.', 64), gfx: { meer: {} } },
      { t: T('Auf dem Mond gibt es keine Luft, also nichts, was streut. Dort ist der Himmel auch mittags **schwarz**.', 64), gfx: { mond: {} } },
      { t: T('Und auf dem Mars ist es umgekehrt: Der Staub färbt den Taghimmel rötlich – und den **Sonnenuntergang blau**.', 64), gfx: { mars: {} } },
      { t: T('Blau ist einfach die Farbe, die die Luft **am stärksten streut**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Luftmoleküle streuen kurzwelliges Blau gut fünfmal stärker als Rot (Rayleigh-Streuung).', 'Gestreutes Blau kommt von überall – darum leuchtet der ganze Himmel.', 'Abends ist der Weg durch die Luft lang: Das Blau ist weggestreut, Rot und Orange bleiben.'],
    sources: ['Rayleigh 1871, Philosophical Magazine 41', 'NASA Space Place: Why Is the Sky Blue?', 'NASA/JPL 2015: Curiosity – Sonnenuntergang auf dem Mars'],
  },
  {
    id: 'regenbogen',
    area: 'PHY',
    day: 49,
    hook: 'Warum ist ein Regenbogen eigentlich rund?',
    mood: 'hell',
    ambience: 'regen',
    images: [],
    draw: {
      bogen(g) {
        // Landschaft nach dem Schauer: Regenwolke rechts, Bogen über Hügeln
        cloud(g, 270, 150, 1.1, 0, true)
        rain(g, 210, 150, 130, 240, { n: 14, d: 600 })
        bow(g, 180, 420, 150, 34, { d: 400 })
        const hill: P[] = [[20, 440], ...smooth([[20, 404], [100, 380], [180, 398], [260, 376], [340, 396]]), [340, 440]]
        blank(g, hill)
        ink(g, hill.slice(1, -1), { w: 2.6, d: 300, t: 700 })
        ground(g, 20, 340, 440, 500)
        tree(g, 70, 440, 0.42, 700)
        house(g, 230, 440, 40, 800)
        bird(g, 60, 150, 0.8, 1300)
      },
      aufbau(g) {
        ground(g, 20, 340, 620, 0)
        sun(g, 50, 330, 20, 300, 10)
        cloud(g, 286, 360, 0.8, 200, true)
        rain(g, 236, 360, 104, 250, { n: 12, d: 500 })
        fig(g, 140, 618, 1.7, { d: 200 })
        // Lichtweg: über deinen Kopf hinweg in den Regen – und zurück in dein Auge
        const p1 = L([80, 344], [252, 446])
        arrow(g, p1, { w: 2.4, d: 1000, t: 500, head: 9 })
        flow(g, p1, { n: 2, ms: 1200, d: 1500, r: 2.4 })
        const p2 = L([252, 452], [150, 568])
        arrow(g, p2, { w: 2.4, d: 1500, t: 500, head: 9 })
        flow(g, p2, { n: 2, ms: 1000, d: 2000, r: 2.4 })
        dot(g, 254, 448, 4, 1400)
      },
      tropfen(g) {
        // genauer Lichtweg im Tropfen (Brechzahl 1,33, Einfall auf 86 % der Höhe)
        const cx = 200
        const cy = 450
        const R = 112
        const at = (deg: number): P => [cx + R * Math.cos(rad(deg)), cy + R * Math.sin(rad(deg))]
        blank(g, E(cx, cy, R))
        hatch(g, E(cx, cy, R), 600)
        ink(g, E(cx, cy, R), { w: 3, t: 800 })
        const path = (n: number) => {
          const i = Math.asin(0.86) * (180 / Math.PI)
          const r = Math.asin(0.86 / n) * (180 / Math.PI)
          const p1 = at(180 + i)
          const p2 = at(180 + i + 180 - 2 * r)
          const p3 = at(180 + i + 2 * (180 - 2 * r))
          const D = 180 + 2 * i - 4 * r
          return { p1, p2, p3, out: [p3[0] + Math.cos(rad(D)) * 130, p3[1] + Math.sin(rad(D)) * 130] as P }
        }
        const w = path(1.337)
        const inc = L([16, w.p1[1]], w.p1)
        ink(g, inc, { w: 3, d: 300, t: 400 })
        flow(g, [[16, w.p1[1]], w.p1, w.p2, w.p3, w.out], { n: 3, ms: 2600, d: 2300, r: 2.6 })
        dashes(g, L([cx, cy], [w.p1[0] - (cx - w.p1[0]) * 0.3, w.p1[1] - (cy - w.p1[1]) * 0.3]), { w: 1.2, d: 600, dash: 4, gap: 4 })
        dashes(g, L([cx, cy], w.p2), { w: 1.2, d: 1100, dash: 4, gap: 4 })
        ink(g, L(w.p1, w.p2), { w: 2.4, d: 700, t: 500 })
        ink(g, L(w.p2, w.p3), { w: 2.4, d: 1200, t: 500 })
        const one = st(g, 'h1')
        arrow(one, L(w.p3, w.out), { w: 2.6, d: 1700, t: 400, head: 9 })
        // Farben: jede mit eigener Brechzahl, Fächer beim Austritt
        const two = st(g, 'f1')
        ;[1.331, 1.333, 1.335, 1.337, 1.34, 1.343].forEach((n, k) => {
          const c = path(n)
          ink(two, L(c.p1, c.p2), { w: 1, t: 0 })
          ink(two, L(c.p2, c.p3), { w: 1, t: 0 })
          arrow(two, L(c.p3, [c.p3[0] + (c.out[0] - c.p3[0]) * (0.75 + k * 0.05), c.p3[1] + (c.out[1] - c.p3[1]) * (0.75 + k * 0.05)]), { w: 1.8, t: 0, head: 7 })
        })
        const r0 = path(1.331).out
        const v0 = path(1.343).out
        text(two, r0[0] - 30, r0[1] - 2, 'Rot', { anchor: 'end', cls: 's', fade: false })
        text(two, v0[0] + 10, v0[1] + 2, 'Violett', { cls: 's', fade: false })
      },
      winkel(g) {
        // parallele Sonnenstrahlen, ein Tropfen hoch oben, zurück zum Auge; Winkel zur verlängerten Sonnenrichtung
        ground(g, 20, 340, 600, 0)
        for (const y of [300, 330]) {
          const p = L([16, y], [300, y])
          arrow(g, p, { w: 2, d: 100, t: 600, head: 8 })
          flow(g, p, { n: 2, ms: 1500, d: 700, r: 2.2 })
        }
        ball(g, 322, 330, 13, { d: 300, fill: 'hell' })
        fig(g, 96, 598, 1.6, { d: 300 })
        const eyeP: P = [100, 552]
        const back = L([310, 338], [eyeP[0] + 6, eyeP[1] - 6])
        arrow(g, back, { w: 2.6, d: 800, t: 600, head: 9 })
        flow(g, back, { n: 2, ms: 1500, d: 1400, r: 2.4 })
        // Sonnenrichtung durch das Auge verlängert (Sonne steht im Rücken, hier tief)
        dashes(g, L(eyeP, [340, eyeP[1]]), { w: 1.4, d: 1200, dash: 6, gap: 5 })
        ink(g, E(eyeP[0], eyeP[1], 96, 96, 318, 360), { w: 2, d: 1500, t: 400 })
        text(g, 214, 530, '42°', { anchor: 'middle', size: 18, d: 1700 })
      },
      kegel(g) {
        // Blickkegel mit 42° um die Gegenrichtung der Sonne; alle Tropfen auf seinem Rand leuchten
        eye(g, 54, 470, 0.5)
        hatch(g, [...E(272, 470, 36, 150), ...E(272, 470, 28, 128, 360, 0)], 1100)
        ink(g, E(272, 470, 36, 150), { w: 3, d: 300, t: 800 })
        ink(g, E(272, 470, 28, 128), { w: 2, d: 500, t: 800 })
        ink(g, L([76, 462], [266, 322]), { w: 2, d: 900, t: 500 })
        ink(g, L([76, 478], [266, 618]), { w: 2, d: 900, t: 500 })
        dashes(g, L([80, 470], [272, 470]), { w: 1.6, d: 1200 })
        ink(g, E(76, 470, 60, 60, 322, 360), { w: 1.6, d: 1300, t: 300 })
        text(g, 150, 458, '42°', { cls: 's', d: 1400 })
        for (let k = 0; k < 12; k++) {
          const a = rad(k * 30)
          const p = mk('g', { class: 'blink', style: `--d:${1400 + k * 90}ms` }, g)
          dot(p, 272 + Math.cos(a) * 32, 470 + Math.sin(a) * 139, 3, 1500 + k * 60)
        }
        const c = st(g, 'f1')
        dot(c, 272, 470, 6)
        ink(c, L([10, 470], [36, 470]), { w: 1.6, t: 0 })
        sun(c, 22, 400, 12, 0, 8)
        dashes(c, L([28, 410], [272, 470]), { w: 1.2, t: 0, dash: 4, gap: 6 })
      },
      kreisbogen(g) {
        const c = st(g, 'm2', '--m2: translateY(96px)')
        bow(c, 180, 500, 140, 26, { a0: 180, a1: 360 })
        dashes(c, E(180, 500, 140, 140, 0, 180), { w: 1.8, d: 900 })
        dashes(c, E(180, 500, 114, 114, 0, 180), { w: 1.4, d: 1000 })
        dot(c, 180, 500, 4, 600)
        const ground0 = st(g, 'x1', '--o: 180px 520px')
        blank(ground0, RR(14, 522, 332, 150, 4))
        hatch(ground0, RR(14, 522, 332, 150, 4), 0, true)
        ink(ground0, L([16, 522], [344, 522]), { w: 3, t: 0 })
        // Sonnenhöhe: Sonne links oben steigt
        const s = st(g, 'f2', '--dl:300ms')
        ink(s, L([20, 340], [110, 340]), { w: 1.6, t: 0 })
        const sm = st(s, 'm2', '--m2: translateY(-42px); --dl: 400ms')
        sun(sm, 96, 330, 9, 0, 8)
        ink(s, E(20, 340, 50, 50, 300, 360), { w: 1.4, t: 0 })
      },
      descartes(g) {
        // Descartes' Rechnung: viele parallele Strahlen durch eine Wasserkugel – die Austrittsstrahlen drängen sich bei 42°
        const cx = 210
        const cy = 440
        const R = 96
        const at = (deg: number): P => [cx + R * Math.cos(rad(deg)), cy + R * Math.sin(rad(deg))]
        blank(g, E(cx, cy, R))
        ink(g, E(cx, cy, R), { w: 3, t: 800 })
        ink(g, L([cx, cy + R], [cx, 620]), { w: 3, d: 500, t: 300 })
        ink(g, L([cx - 50, 622], [cx + 50, 622]), { w: 3, d: 600, t: 300 })
        ;[0.25, 0.45, 0.62, 0.75, 0.86, 0.93, 0.98].forEach((b, k) => {
          const i = Math.asin(b) * (180 / Math.PI)
          const r = Math.asin(b / 1.333) * (180 / Math.PI)
          const p1 = at(180 + i)
          const p2 = at(180 + i + 180 - 2 * r)
          const p3 = at(180 + i + 2 * (180 - 2 * r))
          const D = rad(180 + 2 * i - 4 * r)
          const out: P = [p3[0] + Math.cos(D) * 150, p3[1] + Math.sin(D) * 150]
          const main = Math.abs(b - 0.86) < 0.01
          const dd = 700 + k * 260
          ink(g, L([20, p1[1]], p1), { w: main ? 2.4 : 1.2, d: dd, t: 250 })
          ink(g, [p1, p2, p3], { w: main ? 2 : 1, d: dd + 250, t: 300 })
          arrow(g, L(p3, out), { w: main ? 2.6 : 1.2, d: dd + 550, t: 250, head: main ? 9 : 6 })
        })
      },
      mondbogen(g) {
        // Nacht am Wasserfall: Mond im Rücken, Gischt, ein blasser Bogen
        stars(g, 20, 290, 320, 120, 26, 0, (x, y) => Math.hypot(x - 60, y - 340) < 40)
        moon(g, 60, 340, 24)
        const cliff: P[] = [[232, 420], [252, 414], [276, 424], [302, 412], [340, 418], [340, 600], [276, 600], [268, 560], [252, 520], [240, 470], [232, 420]]
        blank(g, cliff)
        hatch(g, cliff, 600, true)
        ink(g, cliff.slice(0, 6), { w: 2.6, d: 300, t: 400 })
        ink(g, cliff.slice(6), { w: 2.2, d: 400, t: 400 })
        for (const x of [218, 226, 234]) flow(g, L([x, 420], [x - 6, 600]), { n: 3, ms: 900, d: 700, r: 2.4, kind: 'dash' })
        ink(g, L([20, 600], [340, 600]), { w: 3, d: 200, t: 500 })
        dashes(g, E(200, 600, 130, 130, 180, 360), { w: 2.2, d: 400, dash: 10, gap: 5 })
        dashes(g, E(200, 600, 114, 114, 180, 360), { w: 1.4, d: 500, dash: 10, gap: 5 })
        sea(g, 20, 230, 616, 800, 1)
      },
      nebel(g) {
        // Nebelbogen: breites, fast weißes Band ohne Farbstreifen
        for (let i = 0; i < 7; i++) {
          const y = 320 + i * 26
          const m = wobble(g, { dx: i % 2 ? 10 : -10, ms: 5000 + i * 400, d: 600 })
          dashes(m, smooth([[20, y], [120, y - 4], [240, y + 4], [340, y]]), { w: 1.2, d: i * 100, dash: 18, gap: 14 })
        }
        blank(g, [...E(180, 620, 150, 150, 180, 360), ...E(180, 620, 112, 112, 360, 180)])
        ink(g, E(180, 620, 150, 150, 180, 360), { w: 2.4, d: 600, t: 900 })
        ink(g, E(180, 620, 112, 112, 180, 360), { w: 2.4, d: 700, t: 900 })
        ground(g, 20, 340, 620, 300)
        fig(g, 180, 618, 1.3, { d: 900 })
        ink(g, L([168, 600], [154, 570]), { w: 1.4, d: 1100, t: 200 })
      },
      kreis(g) {
        // Blick aus dem Flugzeug: ganzer Kreis auf der Wolkendecke, in der Mitte der Schatten des Flugzeugs
        for (let i = 0; i < 6; i++) ink(g, smooth([[20, 120 + i * 60], [120, 112 + i * 60], [240, 126 + i * 60], [340, 116 + i * 60]]), { w: 1, d: i * 80, t: 600 })
        blank(g, E(180, 260, 152))
        for (let k = 0; k < 6; k++) {
          const ro = 150 - k * 6
          if (k % 2 === 0) hatch(g, [...E(180, 260, ro), ...E(180, 260, ro - 6, ro - 6, 360, 0)], 1300 + k * 100, k === 0)
        }
        ink(g, E(180, 260, 150), { w: 2.6, t: 1000 })
        ink(g, E(180, 260, 114), { w: 2, d: 250, t: 1000 })
        const P = (a: number, b: number): P => [180 + a, 260 + b]
        const sh: P[] = [P(0, -24), P(4, -16), P(4, -3), P(34, 6), P(34, 10), P(4, 7), P(3, 18), P(12, 23), P(12, 26), P(0, 24), P(-12, 26), P(-12, 23), P(-3, 18), P(-4, 7), P(-34, 10), P(-34, 6), P(-4, -3), P(-4, -16), P(0, -24)]
        hatch(g, sh, 1500, true)
        ink(g, sh, { w: 1.8, d: 1200, t: 400 })
        ripple(g, 180, 260, 30, 60, { n: 2, ms: 2400, d: 1800, w: 1.2 })
      },
      zwei(g) {
        ground(g, 20, 340, 620, 0)
        fig(g, 110, 618, 1.6, { d: 200 })
        fig(g, 250, 618, 1.6, { d: 300 })
        text(g, 110, 650, 'du', { anchor: 'middle', cls: 's', d: 400 })
        text(g, 250, 650, 'Nachbar', { anchor: 'middle', cls: 's', d: 500 })
        bow(g, 110, 620, 220, 16, { a0: 200, a1: 300, d: 500, w: 1.8 })
        dashes(g, E(250, 620, 220, 220, 240, 340), { w: 1.6, d: 800, dash: 8, gap: 6 })
        for (const [fx, tx, ty, d] of [[110, 40, 418, 900], [110, 150, 404, 1100], [250, 210, 404, 1300], [250, 330, 450, 1500]] as const) {
          const p = mk('g', { class: 'blink', style: `--d:${d}ms` }, g)
          dot(p, tx, ty, 5, d)
          dashes(g, L([fx + (tx - fx) * 0.08, 580 + (ty - 580) * 0.08], [tx + (fx - tx) * 0.06, ty + (580 - ty) * 0.06]), { w: 1.3, d: d + 100 })
        }
      },
      doppelt(g) {
        ground(g, 20, 340, 620, 0)
        bow(g, 180, 620, 118, 18, { d: 200 })
        bow(g, 180, 620, 160, 16, { d: 900, rev: true, w: 1.8 })
        text(g, 180, 596, 'Hauptbogen', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 180, 446, 'Nebenbogen', { anchor: 'middle', cls: 's', d: 1300 })
        for (const [r, l, dd] of [[127, 'R', 1500], [104, 'V', 1550], [167, 'V', 1600], [149, 'R', 1650]] as const) text(g, 180 - r, 640, l, { anchor: 'middle', cls: 's', d: dd })
        const band = st(g, 'f1')
        hatch(band, [...E(180, 620, 144, 144, 180, 360), ...E(180, 620, 118, 118, 360, 180)], 0, true)
      },
      laufen(g) {
        ground(g, 20, 340, 600, 0)
        cloud(g, 250, 330, 0.8, 200, true)
        rain(g, 190, 330, 140, 260, { n: 10, d: 400 })
        const w = st(g, 'm1', '--m1: translateX(110px); transition-duration: 2.2s')
        fig(w, 40, 598, 1.6, { d: 200 })
        bow(w, 160, 598, 92, 18, { d: 300 })
        const f = st(g, 'f1')
        arrow(f, L([40, 630], [150, 630]), { w: 2.2, t: 0, head: 9 })
        arrow(f, L([160, 650], [270, 650]), { w: 2.2, t: 0, head: 9 })
      },
      ende(g) {
        ground(g, 20, 340, 640, 0)
        fig(g, 180, 638, 2.2, { d: 200 })
        bow(g, 180, 560, 120, 22, { a0: 160, a1: 380, d: 400 })
        dashes(g, L([180, 568], [180, 610]), { w: 1.2, d: 900, dash: 4, gap: 4 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { bogen: {} } },
      { t: T('Für einen Regenbogen brauchst du zwei Dinge: die **Sonne im Rücken** und Regen vor dir.', 64), gfx: { aufbau: {} } },
      { t: T('Jeder Regentropfen wirkt wie ein winziges **Prisma**. Licht dringt ein, wird gebrochen und an der Rückseite gespiegelt.', 64), gfx: { tropfen: {} } },
      { t: T('Beim Ein- und Austreten wird jede Farbe **unterschiedlich stark** gebrochen: Violett am stärksten, Rot am wenigsten.', 64), gfx: { tropfen: { cls: 'a1' } } },
      { t: T('Rotes Licht verlässt den Tropfen in einem Winkel von etwa **42 Grad** zum Sonnenlicht, Violett bei etwa 40 Grad.', 64), gfx: { winkel: {} } },
      { t: T('Das berechnete schon René Descartes 1637: Er verfolgte unzählige Lichtwege durch eine **Glaskugel voller Wasser**.', 64), gfx: { descartes: {} } },
      { t: T('Für dich leuchten also nur Tropfen, die genau in diesem Winkel stehen. Und alle diese Tropfen liegen auf einem **Kreis**.', 64), gfx: { kegel: {} } },
      { t: T('Seine Mitte liegt genau **gegenüber der Sonne** – dort, wohin der Schatten deines Kopfes fällt.', 64), gfx: { kegel: { cls: 'a1' } } },
      { t: T('Eigentlich ist jeder Regenbogen also ein ganzer Kreis. Doch der Boden schneidet ihn ab – übrig bleibt ein **Bogen**.', 64), gfx: { kreisbogen: { cls: 'a1' } } },
      { t: T('Je höher die Sonne steht, desto tiefer sinkt der Kreis. Steht sie höher als 42 Grad, liegt der Bogen ganz **unter dem Horizont**.', 64), gfx: { kreisbogen: { cls: 'a1 a2' } } },
      { t: T('Darum siehst du Regenbögen vor allem morgens und abends. Und aus dem Flugzeug manchmal einen **ganzen Kreis**.', 480), gfx: { kreis: {} } },
      { t: T('Jeder Mensch sieht übrigens **seinen eigenen** Regenbogen: Dein Nachbar sieht das Licht ganz anderer Tropfen.', 64), gfx: { zwei: {} } },
      { t: T('Manchmal erscheint darüber ein zweiter, blasserer Bogen. Dort wird das Licht **zweimal** gespiegelt – die Farben stehen umgekehrt.', 64), gfx: { doppelt: {} } },
      { t: T('Dazwischen ist der Himmel **dunkler**: das Alexanderband, benannt nach Alexander von Aphrodisias, der es um 200 n. Chr. beschrieb.', 64), gfx: { doppelt: { cls: 'a1' } } },
      { t: T('Nachts gibt es **Mondregenbögen**. Sie sind farbig – doch im Dunkeln sieht dein Auge kaum Farben, also wirken sie meist weiß.', 64), gfx: { mondbogen: {} } },
      { t: T('Und im Nebel entsteht ein breiter **Nebelbogen**: Die Tröpfchen sind so winzig, dass die Farben verschwimmen.', 64), gfx: { nebel: {} } },
      { t: T('Ein Regenbogen ist also kein Ding an einem Ort, sondern eine **Richtung**. Darum kannst du nie zu seinem Ende laufen.', 64), gfx: { laufen: {} } },
      { t: T('Gehst du weiter, wandert er mit – denn mit jedem Schritt leuchten **andere Tropfen** für dich auf.', 64), gfx: { laufen: { cls: 'a1' } } },
      { t: T('Ein Regenbogen ist ein **Kreis aus Licht** um den Schatten deines Kopfes.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Jeder Tropfen bricht und spiegelt Sonnenlicht; Rot kommt unter etwa 42° zurück.', 'Alle Tropfen unter diesem Winkel liegen auf einem Kreis um den Gegenpunkt der Sonne.', 'Der Boden schneidet den Kreis ab – und jeder sieht seinen eigenen Bogen.'],
    sources: ['Nussenzveig 1977, Scientific American 236', 'Minnaert: Licht und Farbe in der Natur', 'Met Office: How is a rainbow formed?'],
  },
  {
    id: 'flugzeug',
    area: 'PHY',
    day: 19,
    hook: 'Wie hält sich ein Flugzeug mit Hunderten Tonnen in der Luft?',
    mood: 'episch',
    ambience: 'wind',
    images: [],
    draw: {
      flieger(g) {
        const c = glide(g, -40, 0, { ms: 9000, d: 300 })
        cloud(c, 80, 170, 0.7, 0)
        cloud(c, 300, 400, 0.55, 200)
        cloud(c, 60, 430, 0.4, 300)
        bird(g, 300, 120, 0.8, 900)
        bird(g, 326, 136, 0.6, 1000)
        const j = wobble(g, { dy: 6, ms: 3200, d: 800 })
        jet(j, 200, 280, 1.45, 100)
        for (const y of [262, 286, 312]) flow(j, L([40, y], [-30, y]), { kind: 'dash', n: 2, ms: 700, d: 900, r: 3 })
        dashes(g, L([20, 300], [52, 300]), { w: 1.6, d: 1200, dash: 6, gap: 6 })
      },
      profil(g) {
        // Wölbung oben, gerade Linie unten: die beiden „Wege“ der Schulbuch-Erklärung
        wing(g, 180, 470, 250, 0)
        const up: P[] = [...L([16, 452], [50, 452]), ...B([50, 452], [84, 404], [180, 398], [312, 466]).slice(1), ...L([312, 466], [344, 470]).slice(1)]
        const lo: P[] = L([16, 492], [344, 492])
        dashes(g, up, { w: 1.6, d: 600, dash: 7, gap: 6 })
        dashes(g, lo, { w: 1.6, d: 700, dash: 7, gap: 6 })
        // Behauptung: zwei Luftteilchen starten zusammen und treffen sich hinten wieder
        const h = st(g, 'h1')
        flow(h, up, { n: 1, ms: 3600, d: 1100, r: 6 })
        flow(h, lo, { n: 1, ms: 3600, d: 1100, r: 6 })
        const f = st(g, 'f1')
        // senkrechte Rauchlinie zu drei Zeitpunkten; der Flügel teilt sie, oben eilt sie voraus
        const pulses: P[][] = [
          [[30, 330], [30, 480], [30, 630]],
          [[120, 330], [126, 390], [146, 438]],
          [[104, 478], [100, 540], [104, 630]],
          [[226, 330], [252, 400], [330, 462]],
          [[262, 482], [228, 556], [220, 630]],
        ]
        pulses.forEach((p, i) => ink(f, smooth(p), { w: 2, d: 200 + Math.ceil(i / 2) * 600, t: 500 }))
        flow(f, up, { n: 1, ms: 2300, r: 6 })
        flow(f, lo, { n: 1, ms: 3600, r: 6 })
      },
      ruecken(g) {
        ground(g, 20, 340, 620, 0)
        tree(g, 56, 620, 0.55, 200)
        tree(g, 300, 620, 0.7, 300)
        house(g, 200, 620, 46, 300)
        // Looping-Bahn mit Rauchringen
        const loop: P[] = [...B([20, 560], [130, 560], [260, 520], [280, 430]), ...B([280, 430], [300, 320], [150, 280], [104, 352]).slice(1)]
        dashes(g, loop, { w: 1.6, d: 400, dash: 4, gap: 7, step: 20 })
        flow(g, loop, { n: 6, ms: 3000, d: 900, r: 3, kind: 'ring' })
        // Kunstflugzeug auf dem Rücken: Rumpf, Haube unten, Flügel, Leitwerk, Propeller
        const r = group(g, '', 'transform: rotate(180deg) scale(1.35); transform-origin: 190px 380px')
        const body: P[] = [...B([130, 376], [150, 368], [220, 368], [244, 374]), ...L([244, 374], [244, 388]).slice(1), ...B([244, 388], [220, 392], [150, 390], [130, 382]).slice(1), [130, 376]]
        blank(r, body)
        ink(r, body, { w: 2.4, t: 600 })
        const canopy: P[] = [...B([194, 369], [198, 352], [222, 352], [230, 370])]
        blank(r, [...canopy, canopy[0]])
        ink(r, canopy, { w: 2, d: 300, t: 300 })
        ink(r, L([212, 356], [212, 369]), { w: 1.2, d: 500, t: 100 })
        const wg: P[] = [[172, 382], [218, 382], [214, 390], [176, 390], [172, 382]]
        hatch(r, wg, 500, true)
        ink(r, wg, { w: 1.8, d: 300, t: 300 })
        const fin: P[] = [[132, 376], [122, 354], [136, 354], [148, 372]]
        hatch(r, fin, 500, true)
        ink(r, fin, { w: 1.8, d: 300, t: 300 })
        ink(r, L([128, 384], [150, 384]), { w: 2, d: 400, t: 200 })
        ink(r, [[200, 390], [196, 402], [206, 402]], { w: 1.6, d: 500, t: 200 })
        ball(r, 201, 404, 3.4, { d: 500, t: 0 })
        const prop = spin(r, 248, 381, 260, 600)
        ink(prop, L([248, 363], [248, 399]), { w: 2.4, d: 600, t: 150 })
        ball(r, 248, 381, 3, { d: 600, fill: 'dicht', t: 0 })
      },
      umlenk(g) {
        const lines: P[][] = [
          B([10, 330], [120, 318], [240, 322], [350, 372]),
          B([10, 384], [110, 364], [230, 372], [350, 440]),
          B([10, 476], [100, 472], [200, 488], [350, 528]),
          B([10, 532], [120, 528], [220, 540], [350, 574]),
        ]
        lines.forEach((p, i) => {
          ink(g, p, { w: 1.8, d: 500 + i * 120, t: 900 })
          flow(g, p, { n: 3, ms: i < 2 ? 2100 : 2700, d: 1300 + i * 100, r: 2.6 })
        })
        wing(g, 180, 448, 200, 10)
        const a = st(g, 'x1', '--o: 180px 372px')
        arrow(a, L([186, 400], [186, 300]), { w: 4.4, t: 0, head: 13 })
        text(a, 202, 324, 'Auftrieb', { fade: false })
        const b = st(g, 'x1', '--o: 310px 560px; --dl: 400ms')
        for (const x of [290, 316]) arrow(b, L([x, 548], [x + 8, 626]), { w: 3.4, t: 0, head: 11 })
        text(b, 280, 610, 'Luft', { anchor: 'end', fade: false })
      },
      kraefte(g) {
        cloud(g, 300, 330, 0.45, 300)
        cloud(g, 60, 630, 0.4, 400)
        const j = wobble(g, { dy: 4, ms: 3400, d: 900 })
        jet(j, 180, 470, 1.15, 0)
        // Auftrieb greift an der Tragfläche an, Gewicht im Schwerpunkt
        arrow(j, L([172, 476], [172, 350]), { w: 3.8, d: 600, t: 400, head: 12 })
        text(j, 186, 366, 'Auftrieb', { d: 800 })
        dot(j, 168, 470, 3.2, 500)
        arrow(j, L([168, 474], [168, 606]), { w: 3.8, d: 900, t: 400, head: 12 })
        text(j, 182, 596, 'Gewicht', { d: 1100 })
        const h = st(j, 'x1', '--o: 180px 490px')
        arrow(h, L([212, 491], [262, 491]), { w: 3, t: 0, head: 10 })
        text(h, 270, 520, 'Schub', { anchor: 'middle', fade: false })
        for (const y of [485, 497]) flow(h, L([150, y], [104, y + (y - 491) * 1.5]), { kind: 'dash', n: 3, ms: 600, r: 2.6 })
        arrow(h, L([64, 470], [18, 470]), { w: 3, t: 0, head: 10 })
        text(h, 16, 500, 'Widerstand', { fade: false })
      },
      druck(g) {
        wing(g, 180, 466, 220, 6)
        const at = foilAt(180, 466, 220, 6)
        // Druckverteilung: Sog oben (größter Pfeil nahe der Nase), Druck unten
        const upper: [number, number][] = [[0.06, 54], [0.14, 62], [0.25, 54], [0.38, 42], [0.52, 32], [0.66, 22], [0.8, 14]]
        upper.forEach(([x, len], i) => {
          const t = 0.6 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4)
          const yc = x < 0.4 ? (0.05 / 0.16) * (0.8 * x - x * x) : (0.05 / 0.36) * (0.2 + 0.8 * x - x * x)
          const s = at([x, yc + t + 0.012])
          arrow(g, L(s, [s[0] - 6, s[1] - len]), { w: 2, d: 700 + i * 90, t: 250, head: 7 })
        })
        ;[0.2, 0.4, 0.6, 0.8].forEach((x, i) => {
          const t = 0.6 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4)
          const yc = x < 0.4 ? (0.05 / 0.16) * (0.8 * x - x * x) : (0.05 / 0.36) * (0.2 + 0.8 * x - x * x)
          const s = at([x, yc - t - 0.012])
          arrow(g, L([s[0] + 3, s[1] + 30 - i * 4], s), { w: 2, d: 1400 + i * 90, t: 250, head: 7 })
        })
        text(g, 180, 340, 'Unterdruck', { anchor: 'middle', d: 1000 })
        text(g, 180, 572, 'Überdruck', { anchor: 'middle', d: 1700 })
        // zweiter Blick: dieselbe Strömung als Linien, oben dichter und schneller
        const f = st(g, 'f1')
        const s1 = B([10, 404], [110, 384], [230, 392], [350, 452])
        const s2 = B([10, 520], [110, 518], [230, 522], [350, 552])
        ink(f, s1, { w: 1.6, t: 0 })
        ink(f, s2, { w: 1.6, t: 0 })
        flow(f, s1, { n: 4, ms: 1800, r: 2.6 })
        flow(f, s2, { n: 4, ms: 2800, r: 2.6 })
      },
      wirbel(g) {
        // Draufsicht: Flugzeug, an den Flügelspitzen beginnen zwei rotierende Wirbel
        const P = (a: number, b: number): P => [180 + a, 330 + b]
        const plane: P[] = [P(0, -34), P(6, -24), P(7, -4), P(110, 22), P(110, 30), P(7, 18), P(6, 44), P(26, 56), P(26, 62), P(0, 58), P(-26, 62), P(-26, 56), P(-6, 44), P(-7, 18), P(-110, 30), P(-110, 22), P(-7, -4), P(-6, -24), P(0, -34)]
        blank(g, plane)
        hatch(g, plane, 500, true)
        ink(g, plane, { w: 2.4, t: 700 })
        for (const k of [-1, 1]) {
          ink(g, E(180 + k * 50, 342, 5, 9), { w: 1.6, d: 400, t: 200 })
          const x0 = 180 + k * 108
          const helix: P[] = Array.from({ length: 120 }, (_, i) => {
            const t = i / 119
            const r = 6 + t * 14
            return [x0 - k * t * 18 + Math.cos(t * Math.PI * 9) * r, 366 + t * 270 + Math.sin(t * Math.PI * 9) * r * 0.35] as P
          })
          ink(g, helix, { w: 1.6, d: 900, t: 1600 })
          flow(g, helix, { n: 5, ms: 3200, d: 1600, r: 2.4 })
        }
        // nachfolgendes Flugzeug wartet
        const q: P[] = [[180, 600], [182, 606], [210, 614], [182, 614], [181, 626], [188, 630], [172, 630], [179, 626], [178, 614], [150, 614], [178, 606], [180, 600]]
        ink(g, q, { w: 2, d: 1500, t: 400 })
        text(g, 180, 655, 'Wirbelschleppen', { anchor: 'middle', d: 1900 })
      },
      klappen(g) {
        // Landestellung: Vorflügel vorn, Spaltklappe hinten, Luft strömt durch die Spalte
        wing(g, 180, 450, 190, 4)
        const slat: P[] = [...E(82, 450, 22, 20, 115, 262), ...E(82, 450, 11, 10.5, 262, 115)]
        blank(g, slat)
        hatch(g, slat, 500, true)
        ink(g, [...slat, slat[0]], { w: 2.2, d: 300, t: 400 })
        wing(g, 313, 487, 74, 28, 400)
        const s1 = B([10, 482], [50, 482], [70, 462], [100, 438])
        const s2 = B([200, 470], [240, 470], [262, 466], [284, 462])
        const s3 = B([284, 462], [306, 470], [330, 488], [350, 506])
        for (const p of [s1, s2, s3]) {
          ink(g, p, { w: 1.4, d: 900, t: 600 })
          flow(g, p, { n: 2, ms: 1500, d: 1400, r: 2.2 })
        }
        text(g, 64, 408, 'Vorflügel', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 318, 548, 'Klappe', { anchor: 'middle', cls: 's', d: 1100 })
      },
      abriss(g) {
        wing(g, 180, 400, 190, 18)
        ink(g, L([20, 360], [80, 366]), { w: 1.8, d: 500, t: 400 })
        flow(g, L([20, 360], [80, 366]), { n: 2, ms: 1400, d: 900, r: 2.2 })
        // abgelöste Strömung: rotierende Wirbel über dem Flügel
        ;[[150, 330, 13], [208, 332, 16], [270, 348, 18]].forEach(([x, y, r], i) => {
          const s = spin(g, x, y, 1600 + i * 300, 800)
          arcArrow(s, x, y, r, 200, 500, { d: 900 + i * 200, t: 400, w: 1.8, head: 6 })
        })
        ink(g, B([20, 452], [140, 452], [240, 460], [340, 474]), { w: 1.8, d: 700, t: 900 })
        // kleines Diagramm: Auftrieb steigt mit dem Winkel – und bricht ab etwa 15° ein
        axes(g, 90, 630, 300, 500, { xl: 'Winkel', yl: 'Auftrieb', d: 1100 })
        const curve = plot(g, 90, 626, 190, 110, (t) => (t < 0.62 ? t / 0.62 : 1 - (t - 0.62) * 1.6), { d: 1500, t: 1000, w: 2.6 })
        dashes(g, L([90 + 190 * 0.62, 630], [90 + 190 * 0.62, 518]), { w: 1.2, d: 2400, dash: 4, gap: 4 })
        text(g, 90 + 190 * 0.62, 652, '15°', { anchor: 'middle', cls: 's', d: 2500 })
        void curve
      },
      segler(g) {
        // Sonne heizt ein dunkles Feld, warme Luft steigt auf, oben bildet sich eine Quellwolke
        sun(g, 306, 300, 16, 0, 10)
        ground(g, 20, 340, 630, 100)
        hatch(g, RR(120, 622, 120, 8, 3), 600, true)
        cloud(g, 180, 350, 1, 300, false)
        const lw = smooth([[122, 620], [110, 560], [128, 480], [116, 410], [130, 356]])
        const rw = smooth([[238, 620], [250, 560], [232, 480], [244, 410], [230, 356]])
        dashes(g, lw, { w: 1.4, d: 500, dash: 6, gap: 8 })
        dashes(g, rw, { w: 1.4, d: 500, dash: 6, gap: 8 })
        for (const x of [150, 180, 210]) flow(g, L([x, 610], [x + (x - 180) * 0.2, 370]), { n: 3, ms: 3200, d: 900, r: 3, kind: 'dash' })
        const helix: P[] = Array.from({ length: 160 }, (_, i) => {
          const t = i / 159
          return [180 + Math.cos(t * Math.PI * 6) * 62, 580 - t * 190 + Math.sin(t * Math.PI * 6) * 14] as P
        })
        ink(g, helix, { w: 1, d: 1000, t: 1500 })
        // Segelflugzeug von oben (lange, schmale Flügel) folgt der Spirale
        const gl = mk('g', { opacity: 0 }, g)
        const wings: P[] = [[-2, -32], [4, -32], [4, 32], [-2, 32], [-2, -32]]
        blank(gl, wings)
        ink(gl, wings, { w: 1.8, t: 0 })
        const fus: P[] = [...B([14, 0], [12, -3], [4, -3], [-20, -1.5]), ...L([-20, -1.5], [-20, 1.5]).slice(1), ...B([-20, 1.5], [4, 3], [12, 3], [14, 0]).slice(1)]
        blank(gl, fus)
        ink(gl, fus, { w: 1.8, t: 0 })
        ink(gl, L([-20, -8], [-20, 8]), { w: 1.8, t: 0 })
        mk('set', { attributeName: 'opacity', to: 1, begin: '1.2s', fill: 'freeze' }, gl)
        mk('animateMotion', { path: `M${helix.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '10s', begin: '1.2s', repeatCount: 'indefinite', rotate: 'auto' }, gl)
      },
      rotor(g) {
        // Windrad: jedes Rotorblatt hat im Schnitt ein Flügelprofil
        ink(g, L([176, 430], [168, 640]), { w: 2.8, t: 500 })
        ink(g, L([184, 430], [192, 640]), { w: 2.8, t: 500 })
        ink(g, RR(166, 410, 40, 20, 8), { w: 2.4, d: 200, t: 300 })
        ground(g, 60, 300, 640, 200)
        const r = spin(g, 172, 420, 5000, 1400)
        for (let k = 0; k < 3; k++) {
          const a = rad(k * 120 - 90)
          const n = rad(k * 120)
          const bl: P[] = [[172 + Math.cos(a) * 14 + Math.cos(n) * 8, 420 + Math.sin(a) * 14 + Math.sin(n) * 8], [172 + Math.cos(a) * 130 + Math.cos(n) * 3, 420 + Math.sin(a) * 130 + Math.sin(n) * 3], [172 + Math.cos(a) * 130 - Math.cos(n) * 3, 420 + Math.sin(a) * 130 - Math.sin(n) * 3], [172 + Math.cos(a) * 14 - Math.cos(n) * 4, 420 + Math.sin(a) * 14 - Math.sin(n) * 4]]
          blank(r, [...bl, bl[0]])
          hatch(r, bl, 400 + k * 100)
          ink(r, [...bl, bl[0]], { w: 2.4, d: 200 + k * 150, t: 400 })
        }
        ball(r, 172, 420, 11, { d: 100, fill: 'dicht', t: 300 })
        // Schnitt durch ein Blatt
        ink(g, E(286, 580, 54, 36), { w: 1.8, d: 1200, t: 500 })
        wing(g, 286, 584, 80, 8, 1400)
        dashes(g, L([236, 556], [196, 500]), { w: 1.4, d: 1300, dash: 5, gap: 5 })
        bird(g, 60, 330, 1, 1600)
        bird(g, 90, 348, 0.7, 1700)
      },
      hand(g) {
        // Autofenster rechts, Arm hinaus, Hand von oben mit den Fingern in den Fahrtwind
        ink(g, B([300, 300], [316, 310], [330, 330], [334, 360]), { w: 3, t: 400 })
        ink(g, L([334, 360], [334, 600]), { w: 3, d: 200, t: 400 })
        hatch(g, [[304, 304], [334, 360], [334, 600], [304, 600]], 600)
        ink(g, L([304, 304], [304, 600]), { w: 2.4, d: 200, t: 400 })
        const a = rad(-8)
        const H = (x: number, y: number): P => [230 + x * Math.cos(a) - y * Math.sin(a), 440 + x * Math.sin(a) + y * Math.cos(a)]
        const arm: P[] = [H(0, -14), H(86, -18), H(86, 18), H(0, 14)]
        blank(g, arm)
        ink(g, L(arm[0], arm[1]), { w: 2.4, d: 300, t: 300 })
        ink(g, L(arm[3], arm[2]), { w: 2.4, d: 300, t: 300 })
        const thumb: P[] = [H(-14, 14), H(-30, 26), H(-44, 30), H(-48, 25), H(-36, 16), H(-26, 6)]
        blank(g, thumb)
        ink(g, [...thumb, thumb[0]], { w: 2.2, d: 500, t: 300 })
        const palm: P[] = [H(4, -16), H(-44, -18), H(-48, 16), H(2, 14), H(4, -16)]
        blank(g, palm)
        ink(g, palm, { w: 2.4, d: 400, t: 400 })
        ;[[-14, 30], [-5, 36], [4.5, 34], [13, 26]].forEach(([y, len], i) => {
          const fg: P[] = [H(-44, y - 4.2), H(-44 - len, y - 3.6), ...B(H(-44 - len, y - 3.6), H(-49 - len, y - 3.6), H(-49 - len, y + 3.6), H(-44 - len, y + 3.6)).slice(1), H(-44, y + 4.2)]
          blank(g, fg)
          ink(g, fg, { w: 2, d: 600 + i * 80, t: 250 })
          ink(g, L(H(-60 - len * 0.35, y - 3), H(-60 - len * 0.35, y + 3)), { w: 0.9, d: 900, t: 80 })
        })
        ink(g, B(H(-6, -10), H(-18, -4), H(-26, 2), H(-30, 10)), { w: 1, d: 950, t: 200 })
        // Luft strömt über die Hand, wird abgelenkt – Kraft nach oben
        for (const [y, dd] of [[380, 400], [470, 500], [540, 600]] as const) {
          const p = B([14, y], [80, y - 4], [180, y - 14], [292, y + 20])
          ink(g, p, { w: 1.3, d: dd, t: 700 })
          flow(g, p, { n: 2, ms: 1300, d: dd + 600, r: 2.2 })
        }
        arrow(g, L([196, 430], [204, 330]), { w: 3.6, d: 1200, t: 400, head: 11 })
        // seitlich gesehen: leicht angekippt wie ein Flügel
        ink(g, E(84, 600, 64, 40), { w: 1.8, d: 1300, t: 500 })
        wing(g, 84, 604, 84, 14, 1500)
        arrow(g, L([20, 604], [42, 604]), { w: 1.6, d: 1700, t: 200, head: 6 })
      },
      a380(g) {
        // A380: zwei Fensterreihen übereinander, darunter ein ganzer Vorhang abwärts geworfener Luft
        const j = wobble(g, { dy: 4, ms: 3600, d: 900 })
        jet(j, 180, 390, 1.55, 0, 2)
        for (let i = 0; i < 9; i++) {
          const x = 70 + i * 26
          const p = L([x, 444], [x + 6, 646])
          ink(g, p, { w: 1.2, d: 1100 + i * 60, t: 500 })
          flow(g, p, { n: 2, ms: 1600, d: 1500 + i * 70, r: 2.4, kind: 'dash' })
        }
      },
      ende(g) {
        const lines: P[][] = [
          B([10, 400], [120, 388], [240, 392], [350, 444]),
          B([10, 454], [110, 436], [230, 446], [350, 512]),
          B([10, 548], [100, 544], [200, 560], [350, 600]),
          B([10, 604], [120, 600], [220, 612], [350, 646]),
        ]
        lines.forEach((p, i) => {
          ink(g, p, { w: 1.6, d: 400 + i * 120, t: 900 })
          flow(g, p, { n: 3, ms: i < 2 ? 2100 : 2700, d: 1200 + i * 100, r: 2.4 })
        })
        wing(g, 180, 518, 200, 10, 0)
        arrow(g, L([186, 476], [186, 372]), { w: 5, d: 600, t: 600, head: 14 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { flieger: {} } },
      { t: T('Die Schulbuch-Erklärung: Oben ist der Flügel gewölbt. Die Luft hat dort einen längeren Weg – und muss **gleichzeitig** hinten ankommen.', 64), gfx: { profil: {} } },
      { t: T('Das klingt logisch, ist aber falsch. Nichts zwingt die Luft, sich hinten wiederzutreffen. Oben ist sie sogar **deutlich schneller**.', 64), gfx: { profil: { cls: 'a1' } } },
      { t: T('Und gälte die Erklärung, könnte kein Flugzeug **auf dem Rücken** fliegen. Kunstflieger tun das aber ständig.', 64), gfx: { ruecken: {} } },
      { t: T('Der eigentliche Trick: Der Flügel ist leicht **schräg angestellt**. So lenkt er riesige Mengen Luft nach unten.', 64), gfx: { umlenk: {} } },
      { t: T('Newtons drittes Gesetz: Drückt der Flügel Luft nach unten, drückt die Luft den Flügel **nach oben**. Das ist der Auftrieb.', 64), gfx: { umlenk: { cls: 'a1' } } },
      { t: T('Im Flug wirken vier Kräfte. Hält der Auftrieb dem **Gewicht** genau die Waage, bleibt das Flugzeug auf seiner Höhe.', 64), gfx: { kraefte: {} } },
      { t: T('Die Triebwerke liefern nur den **Schub** gegen den Luftwiderstand. Den Auftrieb macht allein der Flügel – sobald er schnell genug ist.', 64), gfx: { kraefte: { cls: 'a1' } } },
      { t: T('Gleichzeitig entsteht oben **Unterdruck**: Die Luft folgt der Wölbung, wird beschleunigt – und ihr Druck sinkt.', 64), gfx: { druck: {} } },
      { t: T('Beides gehört zusammen: Druckunterschied und Umlenkung sind **zwei Seiten** derselben Strömung.', 64), gfx: { druck: { cls: 'a1' } } },
      { t: T('Die nach unten geschobene Luft wirbelt hinter den Flügelspitzen weiter. Darum starten Flugzeuge **mit Abstand** – oft zwei, drei Minuten.', 64), gfx: { wirbel: {} } },
      { t: T('Mehr Auftrieb gibt es durch mehr **Tempo**, mehr Fläche oder mehr Anstellwinkel. Bei Start und Landung fährt der Pilot dafür Klappen aus.', 64), gfx: { klappen: {} } },
      { t: T('Aber nicht zu steil: Ab etwa 15 Grad reißt die Strömung oben ab und wirbelt nur noch. Der Auftrieb bricht ein – der **Strömungsabriss**.', 64), gfx: { abriss: {} } },
      { t: T('Segelflugzeuge haben gar keinen Motor. Sie gleiten langsam abwärts – und kreisen in **aufsteigender Warmluft** wieder nach oben.', 64), gfx: { segler: {} } },
      { t: T('Vögel nutzen dasselbe Prinzip – und Hubschrauber, Ventilatoren und Windräder: Jeder Rotor ist ein **drehender Flügel**.', 64), gfx: { rotor: {} } },
      { t: T('Du kennst es auch: Halt die Hand aus dem Autofenster und **kipp sie leicht** – der Fahrtwind drückt sie nach oben.', 64), gfx: { hand: {} } },
      { t: T('Ein Airbus A380 wiegt beim Start bis zu **575 Tonnen**. Getragen wird er von Luft, die er schnell genug nach unten schiebt.', 64), gfx: { a380: {} } },
      { t: T('Fliegen heißt: **Luft nach unten werfen** – und von ihr nach oben gedrückt werden.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Die „Gleichzeitig-ankommen“-Erklärung ist falsch: Oben strömt die Luft sogar schneller.', 'Der angestellte Flügel lenkt Luft nach unten; die Gegenkraft ist der Auftrieb.', 'Zu steil reißt die Strömung ab: Strömungsabriss.'],
    sources: ['NASA Glenn Research Center: Incorrect Lift Theory', 'Anderson & Eberhardt 2010: Understanding Flight', 'Babinsky 2003, Physics Education 38'],
  },
  {
    id: 'schwerelos',
    area: 'PHY',
    day: 19,
    hook: 'Warum schweben Astronauten, obwohl dort oben fast volle Schwerkraft herrscht?',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [],
    draw: {
      iss(g) {
        stars(g, 20, 70, 320, 380, 34, 0, (x, y) => Math.hypot(x - 180, y - 280) < 170)
        earth(g, 180, 280, 110, 0, { lon: 10, lat: 30 })
        ink(g, E(180, 280, 117), { w: 0.9, d: 500, t: 700 })
        dashes(g, E(180, 280, 150), { w: 1.4, d: 600, dash: 6, gap: 8 })
        const o = spin(g, 180, 280, 24000, 900)
        station(o, 180, 130, 0.8, 800)
      },
      hoehe(g) {
        // Erde maßstabsgetreu: Radius 620 px = 6.371 km, die ISS 400 km = 39 px darüber
        const surf = E(180, 1040, 620, 620, 252, 288)
        blank(g, [...surf, [340, 680], [20, 680]])
        hatch(g, [...E(180, 1040, 620, 620, 252, 288), ...E(180, 1040, 560, 560, 288, 252)], 900)
        ink(g, surf, { w: 3.2, t: 900 })
        ink(g, E(180, 1040, 630, 630, 253, 287), { w: 0.9, d: 400, t: 900 })
        dashes(g, E(180, 1040, 659, 659, 255, 285), { w: 1.4, d: 500 })
        station(g, 180, 381, 0.32, 900)
        arrow(g, L([250, 418], [250, 386]), { w: 1.6, d: 1200, t: 200, head: 6 })
        arrow(g, L([250, 386], [250, 418]), { w: 1.6, d: 1200, t: 200, head: 6 })
        text(g, 260, 408, '400 km', { cls: 's', d: 1300 })
        text(g, 180, 560, 'maßstabsgetreu', { anchor: 'middle', cls: 's halo', d: 1400 })
        for (const [x, s] of [[80, 0.12], [118, 0.09], [300, 0.1]] as const) tree(g, x, 1040 - Math.sqrt(620 * 620 - (x - 180) ** 2), s, 1000)
      },
      prozent(g) {
        vbars(g, [
          { label: 'am Boden', v: 100, fmt: (v) => `${Math.round(v)} %` },
          { label: 'auf der ISS', v: 90, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { x: 90, base: 600, w: 70, gap: 110, h: 220 })
        fig(g, 125, 346, 1.3, { d: 900 })
        station(g, 235, 336, 0.4, 1100)
      },
      fallen(g) {
        // Blick in ein Modul: Astronautin, Stift und Apfel schweben – alles fällt gleich schnell mit
        const m = RR(60, 300, 240, 200, 34)
        ink(g, m, { w: 3, t: 700 })
        ink(g, RR(72, 312, 216, 176, 26), { w: 1.2, d: 300, t: 700 })
        for (const x of [110, 180, 250]) ink(g, RR(x - 16, 314, 32, 8, 3), { w: 1.4, d: 500, t: 200 })
        ink(g, E(260, 400, 18), { w: 2, d: 600, t: 300 })
        ink(g, E(260, 400, 12), { w: 1, d: 700, t: 300 })
        const a = wobble(g, { dy: -8, deg: 0, ms: 4200, d: 900 })
        const f = group(a, '', 'transform: rotate(-18deg); transform-origin: 160px 420px')
        fig(f, 160, 450, 2.2, { d: 400, arms: 'up' })
        const p = wobble(g, { dx: 6, dy: -10, ms: 3600, d: 1000 })
        ink(p, L([226, 352], [246, 342]), { w: 2.4, d: 700, t: 200 })
        const ap = wobble(g, { dx: -5, dy: 8, ms: 3000, d: 1100 })
        ball(ap, 104, 360, 8, { d: 800, fill: 'hell', w: 1.8 })
        ink(ap, L([104, 352], [106, 345]), { w: 1.4, d: 900, t: 100 })
        for (const x of [104, 160, 236, 330]) arrow(g, L([x, 520], [x, 600]), { w: x === 330 ? 3.6 : 2.2, d: 1300 + (x % 7) * 40, t: 400, head: x === 330 ? 11 : 8 })
      },
      aufzug(g) {
        // Schacht, gerissenes Seil, die Kabine fällt – darin schwebt die Person
        for (const x of [100, 260]) ink(g, L([x, 290], [x, 650]), { w: 2.6, t: 600 })
        for (let y = 300; y < 650; y += 40) for (const x of [100, 260]) ink(g, L([x, y], [x + (x < 180 ? -8 : 8), y + 8]), { w: 1, d: 300, t: 60 })
        ink(g, L([180, 290], [180, 330]), { w: 2.2, d: 300, t: 300 })
        ink(g, [[180, 330], [176, 338], [182, 342], [178, 350]], { w: 1.4, d: 500, t: 200 })
        const cab = glide(g, 0, 70, { ms: 2600, d: 900 })
        ink(cab, [[180, 404], [176, 396], [183, 390], [179, 382]], { w: 1.4, d: 500, t: 200 })
        ink(cab, L([180, 404], [180, 420]), { w: 2.2, d: 400, t: 200 })
        ink(cab, RR(116, 420, 128, 140, 6), { w: 3, d: 300, t: 600 })
        ink(cab, L([180, 424], [180, 556]), { w: 1, d: 600, t: 300 })
        const fl = wobble(cab, { dy: -6, ms: 2000, d: 1000 })
        fig(fl, 150, 520, 1.6, { d: 600, arms: 'up' })
        for (const x of [290, 306]) dashes(g, L([x, 300], [x, 420]), { w: 1.4, d: 1000, dash: 10, gap: 8 })
      },
      hammer(g) {
        // Mondoberfläche, Astronaut lässt Hammer und Feder gleichzeitig fallen
        earth(g, 300, 330, 22, 0, { lon: -30, lat: 0, w: 0.9 })
        stars(g, 20, 290, 240, 80, 14, 0)
        const grd: P[] = smooth([[20, 620], [110, 606], [230, 614], [340, 602]])
        ink(g, grd, { w: 3, t: 600 })
        for (const [x, y, rx] of [[70, 640, 22], [250, 642, 16]] as const) ink(g, E(x, y, rx, rx * 0.25), { w: 1.4, d: 500, t: 300 })
        fig(g, 180, 616, 3.6, { d: 200, arms: 'down' })
        const a = group(g, 'm1', '--m1: translateY(196px); transition-duration: 1.4s; transition-timing-function: ease-in; --dl: 300ms')
        ink(a, L([110, 400], [110, 430]), { w: 3, d: 200, t: 300 })
        ink(a, RR(96, 388, 28, 12, 3), { w: 2.6, d: 100, t: 300 })
        const b = group(g, 'm1', '--m1: translateY(200px); transition-duration: 1.4s; transition-timing-function: ease-in; --dl: 300ms')
        ink(b, B([250, 430], [240, 412], [252, 390], [262, 380]), { w: 2, d: 200, t: 300 })
        for (let k = 0; k < 5; k++) ink(b, L([250 + k * 2.4, 424 - k * 9], [262 + k * 2.4, 418 - k * 9]), { w: 1.4, d: 400 + k * 50, t: 100 })
        text(g, 110, 376, 'Hammer', { anchor: 'middle', cls: 's', d: 500 })
        text(g, 256, 370, 'Feder', { anchor: 'middle', cls: 's', d: 600 })
      },
      training(g) {
        // Laufband mit Gummigurten, die die Läuferin auf das Band ziehen
        const tb: P[] = [[60, 560], [300, 560], [300, 580], [60, 580], [60, 560]]
        blank(g, tb)
        hatch(g, tb, 500, true)
        ink(g, tb, { w: 2.6, t: 500 })
        for (const x of [70, 290]) ink(g, E(x, 570, 9), { w: 1.6, d: 300, t: 200 })
        flow(g, L([280, 560], [80, 560]), { n: 4, ms: 900, d: 800, r: 2, kind: 'dash' })
        const run = wobble(g, { dy: -4, ms: 500, d: 900 })
        fig(run, 180, 558, 3, { d: 300, arms: 'push' })
        for (const x of [130, 230]) ink(g, L([180, 500], [x, 560]), { w: 1.4, d: 700, t: 300 })
        ink(g, RR(150, 520, 60, 12, 4), { w: 1.6, d: 600, t: 200 })
        clock(g, 296, 360, 32, 60, 0, 600)
        const hand = spin(g, 296, 360, 4000, 1300)
        ink(hand, L([296, 360], [296, 336]), { w: 2, d: 1300, t: 100 })
      },
      kugel(g) {
        // schwebende Wasserkugel, die nachschwingt; kleine Tropfen drumherum; Strohhalm
        const w = mk('g', {}, g)
        mk('animateTransform', { attributeName: 'transform', type: 'scale', values: '1 1;1.06 0.95;0.96 1.04;1 1', dur: '1.6s', repeatCount: 'indefinite', additive: 'sum' }, w)
        const wb = mk('g', { transform: 'translate(180 460)' }, g)
        wb.appendChild(w)
        ball(w, 0, 0, 72, { fill: 'hell', w: 3, t: 800 })
        ink(w, E(-22, -24, 26, 26, 200, 260), { w: 2.6, d: 700, t: 300 })
        mk('ellipse', { cx: -26, cy: -30, rx: 12, ry: 7, fill: '#fff', class: 'fade', style: '--d:1000ms', transform: 'rotate(-30 -26 -30)' }, w)
        ink(g, L([262, 400], [232, 430]), { w: 2.4, d: 900, t: 300 })
        ink(g, L([268, 406], [238, 436]), { w: 2.4, d: 900, t: 300 })
        for (const [x, y, r] of [[80, 360, 10], [290, 380, 7], [270, 570, 8], [90, 560, 12], [60, 470, 5]] as const) {
          const f = wobble(g, { dx: (x % 3) * 3 - 3, dy: -6, ms: 2400 + x * 5, d: 1000 })
          ball(f, x, y, r, { d: 900, fill: 'hell', w: 1.8 })
        }
      },
      kanone(g) {
        earth(g, 180, 340, 100, 0, { lon: 0, lat: 45 })
        // Berg mit Kanone am Nordpol
        mountain(g, 160, 200, 244, [180, 214], 300, true)
        ink(g, RR(178, 202, 24, 8, 3), { w: 2.2, d: 500, t: 200 })
        ink(g, E(182, 212, 5), { w: 1.6, d: 600, t: 200 })
        const a = st(g, 'x1', '--o: 202px 206px')
        arrow(a, B([204, 206], [224, 206], [242, 224], [252, 262]), { w: 2.4, t: 0, head: 8 })
        const b = st(g, 'x2', '--o: 202px 206px')
        arrow(b, B([204, 206], [250, 208], [292, 250], [282, 322]), { w: 2.4, t: 0, head: 8 })
        const c = st(g, 'f3')
        dashes(c, E(180, 340, 134, 134, -84, 268), { w: 2.2, d: 0 })
        const orb = spin(c, 180, 340, 6000, 0)
        ball(orb, 180, 206, 5, { fill: 'dicht', t: 0 })
      },
      orbit(g) {
        stars(g, 20, 290, 320, 360, 26, 0, (x, y) => Math.hypot(x - 180, y - 450) < 160)
        earth(g, 180, 450, 90, 0, { lon: 60, lat: 20 })
        dashes(g, E(180, 450, 140), { w: 1.4, d: 500, dash: 6, gap: 8 })
        const o = spin(g, 180, 450, 9000, 700)
        station(o, 180, 310, 0.45, 700)
        clock(g, 312, 610, 24, 0, 0, 900)
        const h = spin(g, 312, 610, 9000, 900)
        ink(h, L([312, 610], [312, 592]), { w: 2, d: 900, t: 100 })
      },
      aufgaenge(g) {
        // Tag- und Nachtseite: auf jeder Runde einmal Sonnenaufgang
        sun(g, 40, 340, 18, 0, 10)
        for (const y of [380, 420, 460]) {
          const p = L([70, y], [110, y])
          flow(g, p, { n: 2, ms: 900, d: 400, r: 1.8, kind: 'dash' })
        }
        blank(g, E(200, 440, 90))
        hatch(g, E(200, 440, 90, 90, 270, 450), 600, true)
        earth(g, 200, 440, 90, 200, { lon: 20, lat: 10 })
        hatch(g, [...E(200, 440, 90, 90, -90, 90), [200, 530]], 700, true)
        dashes(g, E(200, 440, 122), { w: 1.2, d: 500, dash: 6, gap: 8 })
        const o = spin(g, 200, 440, 6000, 900)
        station(o, 200, 318, 0.3, 900)
        for (let i = 0; i < 16; i++) {
          const x = 36 + i * 19
          const p = pop(g, 1200 + i * 90, '50% 100%')
          ink(p, L([x - 8, 620], [x + 8, 620]), { w: 1.4, t: 0 })
          ink(p, E(x, 620, 5, 5, 180, 360), { w: 1.6, t: 0 })
        }
      },
      wort(g) {
        // Beschleunigungsmesser an Bord: Zeiger fast auf null – ein Millionstel der Schwere am Boden
        const cx = 180
        const cy = 480
        ink(g, E(cx, cy, 120, 120, 180, 360), { w: 3, t: 700 })
        ink(g, L([cx - 120, cy], [cx + 120, cy]), { w: 2.4, d: 200, t: 400 })
        for (let k = 0; k <= 10; k++) {
          const a = rad(180 + k * 18)
          ink(g, L([cx + Math.cos(a) * 104, cy + Math.sin(a) * 104], [cx + Math.cos(a) * (k % 5 ? 112 : 96), cy + Math.sin(a) * (k % 5 ? 112 : 96)]), { w: k % 5 ? 1.4 : 2.4, d: 300 + k * 40, t: 80 })
        }
        text(g, cx - 92, cy - 12, '0', { anchor: 'middle', d: 800 })
        text(g, cx + 88, cy - 12, '1 g', { anchor: 'middle', d: 800 })
        const nd = wobble(g, { deg: 1.2, ox: cx, oy: cy, ms: 900, d: 1400 })
        const n = group(nd, '', `transform: rotate(-89deg); transform-origin: ${cx}px ${cy}px`)
        ink(n, L([cx, cy], [cx + 96, cy]), { w: 3, d: 900, t: 400 })
        ball(g, cx, cy, 8, { d: 900, fill: 'dicht', t: 0 })
        text(g, cx, cy + 40, '≈ 0,000001 g', { anchor: 'middle', size: 20, d: 1500 })
      },
      parabel(g) {
        // Flugbahn: Steigflug, dann Bogen (Schwebephase), dann Abfangen; das Flugzeug folgt der Bahn
        ground(g, 20, 340, 640, 0)
        const path: P[] = [...L([20, 600], [100, 450]), ...B([100, 450], [140, 340], [220, 340], [260, 450]).slice(1), ...L([260, 450], [340, 600]).slice(1)]
        dashes(g, path, { w: 1.4, d: 200, dash: 6, gap: 6 })
        ink(g, B([100, 450], [140, 340], [220, 340], [260, 450]), { w: 4, d: 900, t: 900 })
        const pl = mk('g', { opacity: 0 }, g)
        jet(pl, 0, 0, 0.22, 0)
        mk('set', { attributeName: 'opacity', to: 1, begin: '1.2s', fill: 'freeze' }, pl)
        mk('animateMotion', { path: `M${path.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '6s', begin: '1.2s', repeatCount: 'indefinite', rotate: 'auto' }, pl)
        dashes(g, L([100, 450], [100, 640]), { w: 1, d: 1400, dash: 3, gap: 5 })
        dashes(g, L([260, 450], [260, 640]), { w: 1, d: 1400, dash: 3, gap: 5 })
        arrow(g, L([110, 500], [250, 500]), { w: 1.6, d: 1600, t: 300, head: 7 })
        arrow(g, L([250, 500], [110, 500]), { w: 1.6, d: 1600, t: 300, head: 7 })
        fig(g, 180, 470, 1, { d: 1800, arms: 'up' })
      },
      trampolin(g) {
        // Trampolin mit Federn, die Person hängt oben einen Moment in der Luft; hinten eine Achterbahn
        const track: P[] = smooth([[200, 420], [240, 330], [280, 420], [310, 380], [340, 410]])
        ink(g, track, { w: 1.8, t: 800 })
        for (let i = 4; i < track.length - 2; i += 6) ink(g, L(track[i], [track[i][0], 470]), { w: 1, d: 600, t: 150 })
        const car = mk('g', { opacity: 0 }, g)
        ink(car, RR(-9, -10, 18, 9, 3), { w: 1.6, t: 0 })
        mk('set', { attributeName: 'opacity', to: 1, begin: '1s', fill: 'freeze' }, car)
        mk('animateMotion', { path: `M${track.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '4s', begin: '1s', repeatCount: 'indefinite', rotate: 'auto' }, car)
        ink(g, E(150, 600, 100, 16), { w: 2.8, t: 600 })
        ink(g, E(150, 600, 82, 12), { w: 1.4, d: 200, t: 600 })
        for (let k = 0; k < 16; k++) {
          const a = rad(k * 22.5)
          ink(g, L([150 + Math.cos(a) * 83, 600 + Math.sin(a) * 12.5], [150 + Math.cos(a) * 99, 600 + Math.sin(a) * 15.5]), { w: 1, d: 400 + k * 20, t: 60 })
        }
        for (const x of [60, 240, 110, 190]) ink(g, L([x, 608], [x + (x < 150 ? -4 : 4), 646]), { w: 2.4, d: 300, t: 200 })
        const f = wobble(g, { dy: -40, ms: 1800, d: 800 })
        fig(f, 150, 520, 2.2, { d: 500, arms: 'up' })
      },
      gerade(g) {
        earth(g, 180, 470, 100, 0, { lon: -60, lat: 20 })
        dashes(g, E(180, 470, 140), { w: 1.4, d: 500, dash: 6, gap: 8 })
        station(g, 180, 330, 0.36, 600)
        dashes(g, L([210, 330], [346, 330]), { w: 1.6, d: 1000, dash: 8, gap: 6 })
        arrow(g, L([206, 314], [290, 314]), { w: 2.8, d: 1100, t: 400, head: 10 })
        arrow(g, L([180, 350], [180, 400]), { w: 2.8, d: 1400, t: 300, head: 10 })
        const fl = mk('g', { opacity: 0 }, g)
        ball(fl, 0, 0, 4, { fill: 'dicht', t: 0 })
        mk('set', { attributeName: 'opacity', to: 1, begin: '2s', fill: 'freeze' }, fl)
        mk('animateMotion', { path: 'M210 330L346 330', dur: '2s', begin: '2s', repeatCount: 'indefinite' }, fl)
      },
      ende(g) {
        earth(g, 180, 500, 70, 0, { lon: 100, lat: 10 })
        dashes(g, E(180, 500, 106), { w: 1.4, d: 500, dash: 6, gap: 8 })
        const o = spin(g, 180, 500, 9000, 700)
        station(o, 180, 394, 0.32, 700)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { iss: {} } },
      { t: T('Die Raumstation ISS fliegt nur rund **400 Kilometer** hoch – etwa so weit wie von Berlin nach Hannover.', 64), gfx: { hoehe: {} } },
      { t: T('Dort oben ist die Schwerkraft fast so stark wie bei dir: etwa **90 Prozent**.', 64), gfx: { prozent: {} } },
      { t: T('Warum schweben die Astronauten trotzdem? Weil sie **fallen** – ununterbrochen, zusammen mit der ganzen Station.', 64), gfx: { fallen: {} } },
      { t: T('Stell dir einen Aufzug vor, dessen Seil reißt. Du und die Kabine fallt gleich schnell – du **schwebst** im Inneren.', 64), gfx: { aufzug: {} } },
      { t: T('Schon Galilei wusste: Ohne Luft fallen alle Dinge **gleich schnell**. Apollo-15-Astronaut David Scott zeigte es 1971 mit Hammer und Feder auf dem Mond.', 64), gfx: { hammer: { cls: 'a1' } } },
      { t: T('Newton dachte sich eine Kanone auf einem hohen Berg aus. Schießt sie langsam, schlägt die Kugel bald auf.', 480), gfx: { kanone: { cls: 'a1' } } },
      { t: T('Schießt sie schneller, fliegt die Kugel weiter – und die **Erde krümmt sich** unter ihr weg.', 480), gfx: { kanone: { cls: 'a1 a2' } } },
      { t: T('Bei rund **28.000 km/h** krümmt sich die Erde so schnell weg, wie die Kugel fällt. Sie fällt für immer – um die Erde herum.', 480), gfx: { kanone: { cls: 'a1 a2 a3' } } },
      { t: T('Genau das ist eine **Umlaufbahn**. Die ISS rast mit diesem Tempo und umrundet die Erde alle 90 Minuten.', 64), gfx: { orbit: {} } },
      { t: T('Darum erleben die Astronauten jeden Tag **16 Sonnenaufgänge**.', 64), gfx: { aufgaenge: {} } },
      { t: T('Wasser bildet an Bord schwebende **Kugeln**: Ohne Gewicht, das es breit drückt, zieht die Oberflächenspannung jeden Tropfen rund.', 64), gfx: { kugel: {} } },
      { t: T('Der Dauer-Fall hat Folgen: Ohne Last bauen Muskeln und Knochen ab. Darum trainieren Astronauten jeden Tag rund **zwei Stunden**.', 64), gfx: { training: {} } },
      { t: T('„Schwerelos“ ist also das falsche Wort. Fachleute sagen **Mikrogravitation** – oder schlicht: freier Fall.', 64), gfx: { wort: {} } },
      { t: T('Auf der Erde lässt sich das nachstellen: Bei Parabelflügen fällt ein Flugzeug gut **20 Sekunden** lang frei.', 64), gfx: { parabel: {} } },
      { t: T('Und einen Wimpernschlag lang kennst du es selbst: oben auf dem Trampolin oder in der **Achterbahn**, wenn der Magen hüpft.', 64), gfx: { trampolin: {} } },
      { t: T('Ohne Schwerkraft gäbe es übrigens keine Umlaufbahn: Die ISS würde einfach **geradeaus** ins All fliegen.', 64), gfx: { gerade: {} } },
      { t: T('Astronauten schweben nicht, weil die Schwerkraft fehlt – sondern weil sie **ständig fallen**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['In 400 km Höhe wirkt noch rund 90 % der Schwerkraft.', 'Die ISS fällt ständig – aber so schnell seitwärts, dass sie die Erde verfehlt: Umlaufbahn.', 'Mit der Station fällt alles gleich schnell, darum schwebt alles darin.'],
    sources: ['NASA: What Is Microgravity?', 'Newton 1728: A Treatise of the System of the World', 'ESA: Parabelflüge'],
  },
  {
    id: 'gezeiten',
    area: 'PHY',
    day: 19,
    hook: 'Warum kommt die Flut zweimal am Tag – obwohl der Mond nur einmal vorbeizieht?',
    mood: 'ruhig',
    ambience: 'wellen',
    images: [],
    draw: {
      kueste(g) {
        // Nachtküste: Mond, Leuchtturm auf dem Fels, Pegel am Steg – das Wasser steigt und fällt
        stars(g, 20, 70, 320, 180, 22, 0, (x, y) => Math.hypot(x - 270, y - 140) < 56)
        moon(g, 270, 140, 34)
        const rock: P[] = [[20, 450], [20, 300], [44, 292], [70, 312], [92, 340], [104, 390], [118, 450]]
        blank(g, rock)
        hatch(g, rock, 500, true)
        ink(g, rock, { w: 2.6, d: 200, t: 600 })
        const lt: P[] = [[46, 292], [50, 236], [66, 236], [70, 294]]
        blank(g, lt)
        ink(g, lt, { w: 2.4, d: 400, t: 400 })
        ink(g, RR(46, 222, 24, 14, 2), { w: 2, d: 500, t: 200 })
        ink(g, [[44, 222], [58, 210], [72, 222]], { w: 2, d: 600, t: 200 })
        for (const y of [252, 270]) ink(g, L([49, y], [67, y]), { w: 1.2, d: 600, t: 100 })
        const beam = wobble(g, { deg: 14, ox: 58, oy: 229, ms: 4000, d: 900 })
        dashes(beam, L([72, 229], [170, 214]), { w: 1.2, d: 900, dash: 6, gap: 6 })
        // Steg mit Pegel
        ink(g, L([200, 300], [340, 300]), { w: 2.6, d: 300, t: 400 })
        for (const x of [220, 300]) ink(g, L([x, 300], [x, 450]), { w: 2.4, d: 400, t: 400 })
        for (let k = 0; k < 6; k++) ink(g, L([300, 330 + k * 20], [310, 330 + k * 20]), { w: 1.4, d: 600 + k * 40, t: 80 })
        const w = wobble(g, { dy: -40, ms: 7000, d: 900 })
        for (const [y, d] of [[410, 300], [428, 450], [446, 600]] as const) ink(w, waveP(110, 340, y, 4, 50, y / 40), { w: 2, d, t: 900 })
        const boat = wobble(w, { deg: 5, ox: 160, oy: 404, ms: 2200, d: 1000 })
        ink(boat, [[136, 398], [184, 398], [176, 410], [144, 410], [136, 398]], { w: 2, d: 900, t: 300 })
        ink(boat, L([160, 398], [160, 362]), { w: 1.8, d: 1000, t: 200 })
        const sail: P[] = [[162, 364], [182, 394], [162, 394]]
        hatch(boat, sail, 1200)
        ink(boat, [...sail, sail[0]], { w: 1.6, d: 1100, t: 200 })
      },
      zug(g) {
        earth(g, 120, 470, 76, 0, { lon: -20, lat: 0 })
        moon(g, 306, 470, 22, 300)
        dashes(g, E(120, 470, 186, 186, -20, 20), { w: 1.2, d: 500, dash: 5, gap: 6 })
        // Zug des Mondes auf drei Punkte: nah stark, Mitte mittel, fern schwach
        for (const [x, len, dd] of [[52, 34, 900], [120, 42, 1100], [188, 52, 1300]] as const) {
          dot(g, x, 470, 3.4, dd - 100)
          arrow(g, L([x + 4, 470], [x + 4 + len, 470]), { w: 2.6, d: dd, t: 300, head: 8 })
        }
        text(g, 240, 446, 'Schwerkraft', { anchor: 'middle', cls: 's', d: 1500 })
      },
      berge(g) {
        moon(g, 322, 470, 18, 200)
        const near = st(g, 'x1', '--o: 150px 470px')
        hatch(near, [...E(150, 470, 112, 80, -90, 90), ...E(150, 470, 74, 74, 90, -90)], 0)
        ink(near, E(150, 470, 112, 80, -90, 90), { w: 2.6, t: 0 })
        arrow(near, L([270, 470], [292, 470]), { w: 2, t: 0, head: 7 })
        const far = st(g, 'x2', '--o: 150px 470px')
        hatch(far, [...E(150, 470, 112, 80, 90, 270), ...E(150, 470, 74, 74, 270, 90)], 0)
        ink(far, E(150, 470, 112, 80, 90, 270), { w: 2.6, t: 0 })
        arrow(far, L([30, 470], [8, 470]), { w: 2, t: 0, head: 7 })
        earth(g, 150, 470, 74, 0, { lon: -10, lat: 10 })
        dashes(g, L([150, 470], [300, 470]), { w: 1, d: 800, dash: 4, gap: 6 })
      },
      pfeile(g) {
        // Wasser fern – Erdmitte – Wasser nah: Zug nimmt zum Mond hin zu
        moon(g, 330, 470, 16, 0)
        ink(g, E(160, 470, 104), { w: 1.4, d: 100, t: 600 })
        drop(g, 56, 470, 0.9, 0)
        ball(g, 160, 470, 30, { d: 100, fill: 'hell' })
        drop(g, 264, 470, 0.9, 200)
        text(g, 56, 530, 'fern', { anchor: 'middle', cls: 's', d: 300 })
        text(g, 160, 530, 'Erdmitte', { anchor: 'middle', cls: 's', d: 400 })
        text(g, 264, 530, 'nah', { anchor: 'middle', cls: 's', d: 500 })
        const pull = st(g, 'h1')
        arrow(pull, L([42, 410], [74, 410]), { w: 2.6, d: 800, t: 300, head: 8 })
        arrow(pull, L([136, 404], [190, 404]), { w: 2.6, d: 1000, t: 300, head: 9 })
        arrow(pull, L([240, 410], [314, 410]), { w: 2.6, d: 1200, t: 300, head: 9 })
        const rel = st(g, 'x1', '--o: 160px 590px')
        arrow(rel, L([80, 590], [36, 590]), { w: 3, t: 0, head: 10 })
        dot(rel, 160, 590, 5)
        arrow(rel, L([240, 590], [284, 590]), { w: 3, t: 0, head: 10 })
        dashes(rel, L([56, 500], [56, 576]), { w: 1, t: 0, dash: 4, gap: 4 })
        dashes(rel, L([264, 500], [264, 576]), { w: 1, t: 0, dash: 4, gap: 4 })
      },
      dreh(g) {
        // die Erde dreht sich unter den beiden Flutbergen; das Haus kommt zweimal hindurch
        hatch(g, [...E(160, 460, 112, 80), ...E(160, 460, 72, 72, 360, 0)], 600)
        ink(g, E(160, 460, 112, 80), { w: 2.6, t: 800 })
        moon(g, 326, 460, 16, 400)
        const r = spin(g, 160, 460, 8000, 900)
        earth(r, 160, 460, 72, 200, { lon: 0, lat: 90 })
        const hs = group(r, '', 'transform-origin: 160px 380px')
        ink(hs, RR(154, 378, 12, 10, 1), { w: 1.8, d: 900, t: 200 })
        ink(hs, [[152, 378], [160, 371], [168, 378]], { w: 1.8, d: 1000, t: 150 })
        arcArrow(g, 160, 460, 132, 196, 256, { d: 900, t: 500 })
      },
      uhr(g) {
        // Flut-Uhr: heute 12:00, morgen 12:50 – der Mond ist auf seiner Bahn ein Stück weiter
        clock(g, 180, 440, 92, 0, 0, 0)
        const sec: P[] = [[180, 440], ...E(180, 440, 80, 80, -90, -90 + 300), [180, 440]]
        hatch(g, sec, 1200)
        const m = group(g, '', 'transform-origin: 180px 440px')
        mk('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 180 440', to: '300 180 440', dur: '2.4s', begin: '1s', fill: 'freeze' }, m)
        ink(m, L([180, 440], [180, 372]), { w: 2.6, d: 700, t: 300 })
        earth(g, 300, 600, 18, 1300, { lon: 0, lat: 90, w: 0.8 })
        dashes(g, E(300, 600, 46, 46, 180, 300), { w: 1, d: 1500, dash: 3, gap: 4 })
        moon(g, 254, 600, 6, 1600)
        moon(g, 256, 578, 6, 1800)
        arcArrow(g, 300, 600, 56, 182, 202, { d: 1900, t: 300, w: 1.6, head: 6 })
      },
      sonne(g) {
        hbars(g, [
          { label: 'Mond', v: 100, fmt: (v) => `${Math.round(v)} %` },
          { label: 'Sonne', v: 46, fmt: (v) => `${Math.round(v)} %`, dense: true },
        ], { y: 380, gap: 120, x: 70, w: 260 })
        moon(g, 40, 400, 16, 300)
        sun(g, 40, 520, 12, 700, 8)
        text(g, 30, 620, 'Stärke der Gezeitenkraft', { cls: 's', d: 1200 })
      },
      spring(g) {
        sun(g, 40, 470, 22, 0, 10)
        for (const y of [430, 470, 510]) flow(g, L([72, y], [130, y]), { n: 2, ms: 900, d: 600, r: 1.8, kind: 'dash' })
        hatch(g, [...E(200, 470, 116, 66), ...E(200, 470, 52, 52, 360, 0)], 900)
        ink(g, E(200, 470, 116, 66), { w: 2.6, d: 300, t: 800 })
        earth(g, 200, 470, 52, 200, { lon: 0, lat: 90 })
        moon(g, 336, 470, 14, 500)
        hatch(g, [...E(336, 470, 14, 14, -90, 90)], 900, true)
        dashes(g, L([62, 470], [322, 470]), { w: 1, d: 1000, dash: 4, gap: 6 })
        hatch(g, [...E(200, 470, 52, 52, -90, 90)], 700, true)
      },
      nipp(g) {
        sun(g, 40, 470, 22, 0, 10)
        for (const y of [430, 470, 510]) flow(g, L([72, y], [130, y]), { n: 2, ms: 900, d: 600, r: 1.8, kind: 'dash' })
        hatch(g, [...E(200, 470, 72, 88), ...E(200, 470, 52, 52, 360, 0)], 900)
        ink(g, E(200, 470, 72, 88), { w: 2.6, d: 300, t: 800 })
        earth(g, 200, 470, 52, 200, { lon: 0, lat: 90 })
        hatch(g, [...E(200, 470, 52, 52, -90, 90)], 700, true)
        moon(g, 200, 330, 14, 500)
        hatch(g, [...E(200, 330, 14, 14, -90, 90)], 900, true)
        dashes(g, L([200, 344], [200, 418]), { w: 1, d: 1000, dash: 4, gap: 6 })
        ink(g, RR(200, 452, 14, 14, 0), { w: 0.9, d: 1100, t: 200 })
      },
      fundy(g) {
        // Hafen in der Fundy-Bucht: Kutter liegt bei Ebbe auf dem Schlick, bei Flut schwimmt er 16 m höher
        ink(g, L([20, 620], [340, 620]), { w: 2.6, t: 500 })
        hatch(g, RR(20, 620, 320, 30, 2), 300, true)
        ink(g, L([240, 290], [340, 290]), { w: 2.6, d: 200, t: 400 })
        for (const x of [250, 330]) ink(g, L([x, 290], [x, 620]), { w: 2.6, d: 300, t: 500 })
        for (let k = 0; k <= 4; k++) {
          const y = 616 - k * 75
          ink(g, L([330, y], [340, y]), { w: 1.4, d: 500 + k * 60, t: 80 })
          text(g, 326, y + 4, `${k * 4} m`, { anchor: 'end', cls: 's', d: 600 + k * 60, size: 11 })
        }
        const tide = mk('g', {}, g)
        mk('animateTransform', { attributeName: 'transform', type: 'translate', values: '0 0;0 -300;0 -300;0 0;0 0', keyTimes: '0;0.4;0.5;0.9;1', dur: '9s', begin: '1s', repeatCount: 'indefinite', calcMode: 'spline', keySplines: '.45 0 .55 1;0 0 1 1;.45 0 .55 1;0 0 1 1' }, tide)
        ink(tide, waveP(20, 246, 616, 3, 40), { w: 2, d: 800, t: 600 })
        const hull: P[] = [[90, 598], [190, 598], [178, 616], [100, 616], [90, 598]]
        blank(tide, hull)
        hatch(tide, hull, 1000, true)
        ink(tide, hull, { w: 2.2, d: 900, t: 300 })
        ink(tide, RR(130, 580, 30, 18, 2), { w: 2, d: 1000, t: 200 })
        ink(tide, L([118, 598], [118, 556]), { w: 1.8, d: 1100, t: 200 })
      },
      mittelmeer(g) {
        const pr = mapRegion(g, 20, 330, 320, 220, -10, 37, 29, 47, 0)
        // durch die Straße von Gibraltar strömt nur wenig Wasser
        const [gx, gy] = pr(-5.6, 36)
        for (const dy of [-3, 3]) flow(g, L([gx - 26, gy + dy], [gx + 22, gy + dy]), { n: 2, ms: 1400, d: 1200, r: 1.8, kind: 'dash' })
        text(g, gx - 2, gy - 22, 'Gibraltar', { cls: 's halo', d: 1000 })
        text(g, 180, 584, 'Mittelmeer: oft unter 30 cm', { anchor: 'middle', cls: 's', d: 1200 })
      },
      boden(g) {
        // Boden mit Schichten, Haus und Baum heben und senken sich gemeinsam
        const lift = wobble(g, { dy: -8, ms: 4000, d: 900 })
        ground(lift, 20, 340, 520, 0)
        house(lift, 70, 520, 80, 300)
        tree(lift, 260, 520, 0.6, 400)
        for (const [y, dd] of [[560, 500], [600, 600], [640, 700]] as const) ink(lift, smooth([[20, y], [120, y - 6], [240, y + 4], [340, y - 2]]), { w: 1.4, d: dd, t: 600 })
        hatch(lift, [[20, 600], [120, 594], [240, 604], [340, 598], [340, 640], [20, 640]], 900)
        ink(g, L([336, 470], [336, 540]), { w: 1.6, d: 1000, t: 200 })
        for (const y of [470, 540]) ink(g, L([330, y], [342, y]), { w: 1.6, d: 1100, t: 100 })
        text(g, 328, 510, '30 cm', { anchor: 'end', cls: 's halo', d: 1200 })
      },
      tag(g) {
        // Bremse: Die Erde dreht die Flutberge etwas vor die Mondlinie; der Mond zieht sie zurück
        const r = group(g, '', 'transform: rotate(-12deg); transform-origin: 140px 470px')
        hatch(r, [...E(140, 470, 108, 76), ...E(140, 470, 70, 70, 360, 0)], 600)
        ink(r, E(140, 470, 108, 76), { w: 2.6, t: 800 })
        earth(g, 140, 470, 70, 200, { lon: 0, lat: 90 })
        arcArrow(g, 140, 470, 126, 150, 210, { d: 900, t: 500 })
        moon(g, 326, 470, 14, 400)
        dashes(g, L([140, 470], [312, 470]), { w: 1, d: 900, dash: 4, gap: 6 })
        dashes(g, L([140, 470], [140 + Math.cos(rad(-12)) * 150, 470 + Math.sin(rad(-12)) * 150]), { w: 1.2, d: 1100, dash: 6, gap: 4 })
        arrow(g, L([248, 440], [254, 466]), { w: 2.2, d: 1400, t: 300, head: 8 })
        clock(g, 300, 600, 30, 0, 0, 1500)
      },
      mondweg(g) {
        // Laser von der Sternwarte zum Spiegel der Apollo-Landestelle und zurück; der Mond weicht langsam aus
        earth(g, 70, 470, 52, 0, { lon: -20, lat: 20 })
        const away = glide(g, 30, 0, { ms: 8000, d: 1200 })
        moon(away, 270, 470, 20, 300)
        ink(away, RR(250, 462, 6, 6, 1), { w: 1.4, d: 800, t: 100 })
        for (const dy of [-2, 2]) flow(g, L([122, 466 + dy], [248, 466 + dy]), { n: 3, ms: 900, d: 1000, r: 1.6, kind: 'dash' })
        ink(g, L([122, 466], [248, 466]), { w: 1, d: 900, t: 400 })
        arrow(g, L([296, 520], [334, 520]), { w: 2.4, d: 1500, t: 300, head: 8 })
      },
      ende(g) {
        moon(g, 330, 520, 14, 300)
        hatch(g, [...E(180, 520, 92, 62), ...E(180, 520, 54, 54, 360, 0)], 700)
        ink(g, E(180, 520, 92, 62), { w: 2.6, t: 800 })
        const r = spin(g, 180, 520, 9000, 900)
        earth(r, 180, 520, 54, 200, { lon: 0, lat: 90 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { kueste: {} } },
      { t: T('Ebbe und Flut macht vor allem der **Mond**. Seine Schwerkraft zieht am Wasser der Erde.', 64), gfx: { zug: {} } },
      { t: T('Auf der dem Mond zugewandten Seite zieht er am stärksten. Das Wasser dort wölbt sich zu ihm hin – ein **Flutberg**.', 64), gfx: { berge: { cls: 'a1' } } },
      { t: T('Aber auch auf der **anderen Seite** der Erde gibt es einen Flutberg. Wie kann das sein?', 64), gfx: { berge: { cls: 'a1 a2' } } },
      { t: T('Schwerkraft wird mit der Entfernung schwächer. Die Erdmitte zieht der Mond stärker an als das Wasser auf der **fernen Seite**.', 64), gfx: { pfeile: {} } },
      { t: T('Das ferne Wasser **bleibt zurück**, während die Erde zum Mond gezogen wird. Von der Erde aus gesehen beult es sich nach außen.', 64), gfx: { pfeile: { cls: 'a1' } } },
      { t: T('So entstehen **zwei Flutberge**: einer zum Mond hin, einer genau gegenüber. Der Mond zieht die Erde in die Länge.', 64), gfx: { berge: { cls: 'a1 a2' } } },
      { t: T('Die Erde dreht sich in rund 24 Stunden unter diesen Bergen hindurch. Jeder Ort kommt **zweimal** hindurch – zwei Fluten am Tag.', 64), gfx: { dreh: {} } },
      { t: T('Weil der Mond derweil auf seiner Bahn weiterzieht, kommt die Flut jeden Tag etwa **50 Minuten** später.', 64), gfx: { uhr: {} } },
      { t: T('Auch die **Sonne** erzeugt Gezeiten – wegen ihrer riesigen Entfernung aber nicht einmal halb so starke wie der Mond.', 64), gfx: { sonne: {} } },
      { t: T('Stehen Sonne und Mond in einer Linie, bei Voll- und Neumond, addieren sich ihre Kräfte: **Springflut**.', 64), gfx: { spring: {} } },
      { t: T('Stehen sie im rechten Winkel zueinander, schwächen sie sich gegenseitig: **Nippflut**.', 64), gfx: { nipp: {} } },
      { t: T('Wie hoch die Flut wird, bestimmen Küste und Meeresboden. In der kanadischen Fundy-Bucht steigt das Wasser um bis zu **16 Meter**.', 64), gfx: { fundy: {} } },
      { t: T('Das Mittelmeer hat kaum Gezeiten: Es ist fast geschlossen, durch die schmale Straße von Gibraltar strömt **zu wenig Wasser** nach.', 64), gfx: { mittelmeer: {} } },
      { t: T('Sogar das **feste Land** hebt und senkt sich zweimal am Tag – um einige Dutzend Zentimeter. Du merkst es nur nicht, weil alles mitschwingt.', 64), gfx: { boden: {} } },
      { t: T('Die Gezeiten bremsen sogar die Erde: Ein Tag wird pro Jahrhundert knapp **zwei Millisekunden** länger.', 64), gfx: { tag: {} } },
      { t: T('Und der Mond entfernt sich dadurch jedes Jahr um **3,8 Zentimeter** von uns – gemessen mit Laserstrahlen.', 64), gfx: { mondweg: {} } },
      { t: T('Zwei Fluten, weil der Mond die Erde **in die Länge zieht**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Der Mond zieht die nahe Seite stärker an als die Erdmitte – und die Mitte stärker als die ferne Seite.', 'So entstehen zwei Flutberge; jeder Ort durchläuft zwei pro Tag.', 'Sonne und Mond in einer Linie: Springflut; im rechten Winkel: Nippflut.'],
    sources: ['NOAA: Tides and Water Levels', 'Stephenson et al. 2016, Proceedings of the Royal Society A', 'Dickey et al. 1994, Science 265 (Lunar Laser Ranging)'],
  },
  {
    id: 'jahreszeiten',
    area: 'PHY',
    day: 84,
    hook: 'Im Januar ist die Erde der Sonne am nächsten. Warum ist dann Winter?',
    mood: 'ruhig',
    ambience: 'wind',
    images: [],
    draw: {
      bahn(g) {
        stars(g, 20, 80, 320, 340, 26, 0, (x, y) => Math.abs((x - 180) / 160) ** 2 + Math.abs((y - 250) / 110) ** 2 < 1.1)
        sun(g, 196, 250, 30)
        const orbit = E(180, 250, 150, 100)
        dashes(g, orbit, { w: 1.4, d: 600 })
        for (let k = 0; k < 12; k++) {
          const a = rad(k * 30)
          ink(g, L([180 + Math.cos(a) * 144, 250 + Math.sin(a) * 96], [180 + Math.cos(a) * 156, 250 + Math.sin(a) * 104]), { w: 1.4, d: 900 + k * 30, t: 80 })
        }
        const e = mk('g', { opacity: 0 }, g)
        earth(e, 0, 0, 13, 0, { lon: 0, lat: 20, w: 0.8 })
        mk('set', { attributeName: 'opacity', to: 1, begin: '1.2s', fill: 'freeze' }, e)
        mk('animateMotion', { path: `M${orbit.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '12s', begin: '1.2s', repeatCount: 'indefinite' }, e)
        dot(g, 330, 250, 4, 1500)
      },
      abstand(g) {
        // Lineal in Millionen Kilometern; beide Abstände maßstabsgetreu
        sun(g, 34, 470, 14, 0, 8)
        const x0 = 34
        const k = 1.95
        ink(g, L([x0, 600], [x0 + 160 * k, 600]), { w: 2.4, d: 200, t: 600 })
        for (let v = 0; v <= 150; v += 25) {
          ink(g, L([x0 + v * k, 600], [x0 + v * k, v % 50 ? 608 : 614]), { w: 1.4, d: 300 + v * 4, t: 80 })
          if (v % 50 === 0) text(g, x0 + v * k, 634, `${v}`, { anchor: 'middle', cls: 's', d: 400 + v * 4 })
        }
        text(g, 340, 656, 'Mio. km', { anchor: 'end', cls: 's', d: 900 })
        const jan = x0 + 147 * k
        dashes(g, L([60, 440], [jan - 14, 440]), { w: 1.4, d: 500 })
        earth(g, jan, 440, 12, 800, { lon: 0, lat: 20, w: 0.8 })
        dashes(g, L([jan, 456], [jan, 596]), { w: 1, d: 900, dash: 3, gap: 4 })
        flake(g, jan - 34, 410, 9, 1000)
        const b = st(g, 'f1')
        const jul = x0 + 152 * k
        dashes(b, L([60, 520], [jul - 14, 520]), { w: 1.4, t: 0 })
        earth(b, jul, 520, 12, 0, { lon: 0, lat: 20, w: 0.8 })
        dashes(b, L([jul, 536], [jul, 596]), { w: 1, t: 0, dash: 3, gap: 4 })
        sun(b, jul - 36, 492, 6, 0, 8)
      },
      achse(g) {
        const tilt = group(g, '', 'transform: rotate(23.4deg); transform-origin: 180px 470px')
        earth(tilt, 180, 470, 90, 0, { lon: 10, lat: 0 })
        ink(tilt, L([180, 380], [180, 330]), { w: 3, d: 800, t: 300 })
        ink(tilt, L([180, 560], [180, 610]), { w: 3, d: 800, t: 300 })
        ink(tilt, E(180, 470, 90, 12, 0, 180), { w: 1.4, d: 900, t: 400 })
        dashes(tilt, E(180, 470, 90, 12, 180, 360), { w: 1, d: 900, dash: 4, gap: 4 })
        dashes(tilt, L([180, 330], [180, 230]), { w: 1.2, d: 1200, dash: 4, gap: 6 })
        star(g, 180 + Math.sin(rad(23.4)) * 240, 470 - Math.cos(rad(23.4)) * 240, 9, { d: 1500, fill: true })
        dashes(g, L([180, 380], [180, 300]), { w: 1.4, d: 1000 })
        ink(g, E(180, 470, 132, 132, -90, -66.6), { w: 2, d: 1200, t: 300 })
        text(g, 196, 330, '23,4°', { anchor: 'start', cls: 's', d: 1300 })
      },
      orbit2(g) {
        sun(g, 180, 470, 26)
        dashes(g, E(180, 470, 136, 66, 14, 166), { w: 1.4, d: 500 })
        dashes(g, E(180, 470, 136, 66, 194, 346), { w: 1.4, d: 500 })
        for (const [x, n, k] of [[44, 'Juni', 0], [316, 'Dezember', 1]] as const) {
          const t = group(g, '', `transform: rotate(23.4deg); transform-origin: ${x}px 470px`)
          earth(t, x, 470, 24, 800 + k * 300, { lon: 10, lat: 0, w: 0.8 })
          ink(t, L([x, 444], [x, 418]), { w: 2.4, d: 1000 + k * 300, t: 200 })
          ink(t, L([x, 496], [x, 522]), { w: 2.4, d: 1000 + k * 300, t: 200 })
          // Nachtseite: von der Sonne abgewandt
          hatch(g, k ? [...E(x, 470, 24, 24, -90, 90), [x, 494]] : [...E(x, 470, 24, 24, 90, 270), [x, 446]], 1300 + k * 300, true)
          text(g, x, 556, n, { anchor: 'middle', cls: 's', d: 1100 + k * 300 })
          star(g, x + Math.sin(rad(23.4)) * 80, 470 - Math.cos(rad(23.4)) * 80, 5, { d: 1600, fill: true })
        }
      },
      winkel(g) {
        // gleiches Lichtbündel, steil (62°) und flach (16°): der beleuchtete Streifen wird fast viermal so breit
        ground(g, 30, 330, 440, 0)
        const beam = (x: number, y: number, deg: number, len: number, w: number, gr: Element, d: number) => {
          const dx = Math.cos(rad(deg))
          const dy = Math.sin(rad(deg))
          const nx = -dy
          const ny = dx
          const hits: P[] = []
          for (const s of [-w / 2, 0, w / 2]) {
            const bx = x + nx * s
            const by = y + ny * s
            const t = (440 - by) / dy
            const p = L([bx + dx * (t - len), by + dy * (t - len)], [bx + dx * (t - 3), by + dy * (t - 3)])
            arrow(gr, p, { w: 2.2, d, t: d ? 400 : 0, head: 8 })
            flow(gr, p, { n: 2, ms: 1000, d: d + 500, r: 2 })
            hits.push([bx + dx * t, 440])
          }
          return hits
        }
        const s = beam(180, 440, 62, 140, 70, g, 300)
        hatch(g, RR(s[2][0], 443, s[0][0] - s[2][0], 8, 3), 700, true)
        ink(g, E(s[2][0] - 30, 440, 36, 36, -62, 0), { w: 1.4, d: 900, t: 300 })
        text(g, s[2][0] - 58, 426, '62°', { cls: 's', d: 1000 })
        const w = st(g, 'x1', '--o: 180px 600px')
        ink(w, L([30, 640], [330, 640]), { w: 2.6, t: 0 })
        const lines = [[-35, 0], [0, 0], [35, 0]]
        const hits: P[] = []
        lines.forEach(([s0]) => {
          const dx = Math.cos(rad(16))
          const dy = Math.sin(rad(16))
          const bx = 200 - dy * s0
          const by = 640 + dx * s0 - 8
          const t = (640 - by) / dy
          arrow(w, L([bx + dx * (t - 200), by + dy * (t - 200)], [bx + dx * (t - 3), by + dy * (t - 3)]), { w: 2.2, t: 0, head: 8 })
          hits.push([bx + dx * t, 640])
        })
        hatch(w, RR(Math.min(...hits.map((h) => h[0])), 643, Math.abs(hits[0][0] - hits[2][0]), 8, 3), 0)
        text(w, 330, 628, '16°', { anchor: 'end', cls: 's', fade: false })
      },
      lampe(g) {
        // Taschenlampe: senkrecht ein kleiner, heller Fleck – schräg ein großer, blasser
        ink(g, L([20, 600], [340, 600]), { w: 3, t: 500 })
        const lamp = (ox: number, oy: number, deg: number, d: number): [P, P] => {
          const r = ([x, y]: P): P => [ox + x * Math.cos(rad(deg)) - y * Math.sin(rad(deg)), oy + x * Math.sin(rad(deg)) + y * Math.cos(rad(deg))]
          const body: P[] = [[-9, -80], [9, -80], [9, -10], [-9, -10], [-9, -80]]
          blank(g, body.map(r))
          ink(g, body.map(r), { w: 2.4, d, t: 400 })
          for (const y of [-70, -64, -58]) ink(g, L(r([-9, y]), r([9, y])), { w: 1, d: d + 300, t: 80 })
          ink(g, [r([-4, -40]), r([4, -40]), r([4, -30]), r([-4, -30]), r([-4, -40])], { w: 1.4, d: d + 300, t: 100 })
          const head: P[] = [[-9, -10], [9, -10], [16, 8], [-16, 8], [-9, -10]]
          blank(g, head.map(r))
          ink(g, head.map(r), { w: 2.4, d: d + 200, t: 300 })
          return [r([-14, 10]), r([14, 10])]
        }
        const [a, b] = lamp(70, 440, 0, 200)
        dashes(g, L(a, [44, 592]), { w: 1.2, d: 600 })
        dashes(g, L(b, [96, 592]), { w: 1.2, d: 600 })
        hatch(g, E(70, 600, 28, 6), 900, true)
        ink(g, E(70, 600, 28, 6), { w: 1.4, d: 900, t: 300 })
        const [c, e] = lamp(300, 400, 42, 400)
        dashes(g, L(e, [146, 592]), { w: 1.2, d: 900 })
        dashes(g, L(c, [284, 592]), { w: 1.2, d: 900 })
        hatch(g, E(215, 600, 70, 7), 1200)
        ink(g, E(215, 600, 70, 7), { w: 1, d: 1200, t: 300 })
      },
      weg(g) {
        // Lufthülle über einem Stück Erde: mittags kurzer Weg, abends langer Weg mit viel Streuung
        const band: P[] = [...E(180, 980, 680, 680, 254, 286), ...E(180, 980, 600, 600, 286, 254)]
        hatch(g, band, 600)
        ink(g, E(180, 980, 600, 600, 252, 288), { w: 3, t: 800 })
        ink(g, E(180, 980, 680, 680, 254, 286), { w: 1.2, d: 400, t: 800 })
        fig(g, 180, 382, 1.2, { d: 500 })
        const s = L([180, 270], [180, 340])
        arrow(g, s, { w: 3, d: 800, t: 400, head: 9 })
        flow(g, s, { n: 2, ms: 800, d: 1300, r: 2.4 })
        sun(g, 180, 248, 10, 700, 8)
        const l = L([24, 356], [160, 366])
        arrow(g, l, { w: 1.6, d: 1200, t: 500, head: 8 })
        flow(g, l, { n: 2, ms: 1800, d: 1700, r: 1.8 })
        sun(g, 14, 352, 7, 1100, 8)
        for (const x of [50, 80, 110, 140]) arrow(g, L([x, 360], [x + 6, 334]), { w: 1.2, d: 1400 + x * 3, t: 200, head: 5 })
      },
      tag(g) {
        // Sonnenbahnen über dem Horizont: im Juni hoch und lang, im Dezember flach und kurz (Striche = Stunden)
        ground(g, 20, 340, 600, 0)
        house(g, 160, 600, 40, 200)
        const arc = (rx: number, ry: number, hours: number, d: number, dense: boolean) => {
          const pts = E(180, 600, rx, ry, 180, 360)
          ink(g, pts, { w: dense ? 2.4 : 1.6, d, t: 900 })
          const n = Math.round(hours)
          for (let k = 0; k <= n; k++) {
            const a = rad(180 + (k / n) * 180)
            const p: P = [180 + Math.cos(a) * rx, 600 + Math.sin(a) * ry]
            dot(g, p[0], p[1], 2.4, d + 400 + k * 50)
          }
          return pts
        }
        const jun = arc(150, 240, 16, 300, true)
        arc(70, 80, 8, 900, false)
        const s = mk('g', { opacity: 0 }, g)
        sun(s, 0, 0, 9, 0, 8)
        mk('set', { attributeName: 'opacity', to: 1, begin: '1.6s', fill: 'freeze' }, s)
        mk('animateMotion', { path: `M${jun.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '8s', begin: '1.6s', repeatCount: 'indefinite' }, s)
      },
      thermo2(g) {
        // Sommerbaum mit voller Krone, Winterbaum kahl im Schnee
        thermo(g, 40, 380, 180, 0.85)
        tree(g, 130, 600, 0.8, 300)
        ground(g, 20, 180, 600, 200)
        thermo(g, 320, 380, 180, 0.2, 400)
        ink(g, L([190, 600], [340, 600]), { w: 2.6, d: 500, t: 500 })
        hatch(g, RR(190, 596, 110, 4, 2), 900)
        const x = 250
        ink(g, B([x - 6, 600], [x - 4, 560], [x - 4, 520], [x - 2, 490]), { w: 2.6, d: 600, t: 400 })
        ink(g, B([x + 6, 600], [x + 4, 560], [x + 4, 520], [x + 2, 490]), { w: 2.6, d: 600, t: 400 })
        for (const [a, b, c, dd] of [[[x, 530], [x - 30, 500], [x - 52, 470]], [[x, 516], [x + 28, 486], [x + 44, 452]], [[x, 494], [x - 8, 466], [x - 14, 436]], [[x - 30, 500], [x - 40, 476], [x - 36, 456]], [[x + 28, 486], [x + 46, 476], [x + 60, 480]]].map((p, i) => [...p, 800 + i * 100]) as [P, P, P, number][]) ink(g, [a, b, c], { w: 1.8, d: dd, t: 200 })
        for (let i = 0; i < 10; i++) {
          const f = mk('g', {}, g)
          mk('animateTransform', { attributeName: 'transform', type: 'translate', from: '0 0', to: '-14 180', dur: `${4 + (i % 3)}s`, begin: `${(i * 0.4).toFixed(1)}s`, repeatCount: 'indefinite' }, f)
          dot(f, 200 + ((i * 47) % 130), 400 + ((i * 29) % 40), 2, 0)
        }
      },
      kalt(g) {
        // Licht und Temperatur übers Jahr: die Temperatur hinkt rund einen Monat hinterher
        const x0 = 40
        const w = 290
        axes(g, x0, 600, x0 + w + 10, 320, { d: 0 })
        const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
        months.forEach((m, i) => text(g, x0 + 12 + i * (w / 12), 620, m, { anchor: 'middle', cls: 's', d: 200 + i * 30, size: 11 }))
        const light = (t: number) => 0.5 - 0.42 * Math.cos(2 * Math.PI * (t + 10 / 365))
        const temp = (t: number) => 0.5 - 0.36 * Math.cos(2 * Math.PI * (t - 20 / 365))
        dplot(g, x0, 590, w, 240, light, 500)
        plot(g, x0, 590, w, 240, temp, { d: 1000, t: 1200, w: 3 })
        sun(g, x0 + w * 0.5, 330, 8, 900, 8)
        thermo(g, x0 + w * 0.6 + 4, 380, 50, 0.8, 1500)
        // Minima
        const tl = 1 - 10 / 365
        const tt = 20 / 365
        dot(g, x0 + w * tl, 590 - 240 * light(tl), 4, 1800)
        dot(g, x0 + w * tt, 590 - 240 * temp(tt), 5, 2000)
        arrow(g, L([x0 + w * tl - 4, 580], [x0 + w + 14, 580]), { w: 1.4, d: 2200, t: 200, head: 6 })
        arrow(g, L([x0, 580], [x0 + w * tt, 580]), { w: 1.4, d: 2400, t: 200, head: 6 })
      },
      aequator(g) {
        // Sonnenlicht trifft den Äquator fast senkrecht; dort wechseln Regen- und Trockenzeit
        sun(g, 30, 470, 16, 0, 8)
        for (const y of [380, 430, 470, 510, 560]) {
          const p = L([56, y], [60 + 120 - Math.sqrt(Math.max(0, 120 * 120 - (y - 470) ** 2)) + 50, y])
          arrow(g, p, { w: 1.6, d: 300, t: 400, head: 7 })
        }
        earth(g, 230, 470, 110, 200, { lon: 20, lat: 0 })
        ink(g, E(230, 470, 110, 10, 0, 180), { w: 1.8, d: 900, t: 500 })
        cloud(g, 300, 330, 0.5, 1100, true)
        rain(g, 280, 330, 40, 50, { n: 5, d: 1300 })
        sun(g, 300, 620, 10, 1300, 8)
      },
      pol(g) {
        // links Polartag: die Sonne zieht Kreise über dem Horizont; rechts Polarnacht: Sterne, Polarlicht
        ink(g, L([20, 520], [170, 520]), { w: 2.6, t: 400 })
        hatch(g, RR(20, 520, 150, 10, 2), 500)
        const path = E(95, 470, 62, 18)
        dashes(g, path, { w: 1.2, d: 300 })
        const s = mk('g', { opacity: 0 }, g)
        sun(s, 0, 0, 7, 0, 8)
        mk('set', { attributeName: 'opacity', to: 1, begin: '0.9s', fill: 'freeze' }, s)
        mk('animateMotion', { path: `M${path.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: '6s', begin: '0.9s', repeatCount: 'indefinite' }, s)
        ink(g, [[60, 520], [70, 504], [86, 498], [100, 504], [108, 520]], { w: 1.8, d: 600, t: 300 })
        const night = RR(190, 330, 150, 190, 10)
        hatch(g, night, 600, true)
        ink(g, night, { w: 2.4, d: 300, t: 600 })
        ink(g, L([190, 520], [340, 520]), { w: 2.6, d: 400, t: 400 })
        dashes(g, E(265, 548, 60, 18), { w: 1.2, d: 700 })
        for (let i = 0; i < 3; i++) {
          const a = wobble(g, { dx: 6, ms: 3000 + i * 600, d: 900 })
          ink(a, smooth([[200, 380 + i * 12], [240, 360 + i * 12], [280, 392 + i * 12], [330, 370 + i * 12]]), { w: 2.4, d: 900 + i * 150, t: 600 })
        }
        for (const [x, y] of [[210, 350], [300, 342], [326, 410], [214, 440], [270, 460]] as const) {
          blank(g, E(x, y, 3))
          ink(g, E(x, y, 2), { w: 1.2, d: 1200, t: 100 })
        }
      },
      kepler(g) {
        // Zweites Keplersches Gesetz: gleiche Zeit, gleiche Fläche – nah ein kurzer, breiter Sektor, fern ein schmaler, langer
        const orbit = E(180, 470, 150, 120)
        dashes(g, orbit, { w: 1.4, t: 0 })
        const F: P = [270, 470]
        sun(g, F[0], F[1], 14, 200, 10)
        const at = (deg: number): P => [180 + Math.cos(rad(deg)) * 150, 470 + Math.sin(rad(deg)) * 120]
        hatch(g, [F, ...E(180, 470, 150, 120, -24, 24), F], 900)
        ink(g, [at(-24), F, at(24)], { w: 1.4, d: 800, t: 300 })
        hatch(g, [F, ...E(180, 470, 150, 120, 172, 188), F], 1100)
        ink(g, [at(172), F, at(188)], { w: 1.4, d: 1000, t: 300 })
        const e = mk('g', { opacity: 0 }, g)
        earth(e, 0, 0, 9, 0, { w: 0.6 })
        mk('set', { attributeName: 'opacity', to: 1, begin: '1.4s', fill: 'freeze' }, e)
        // Bahnzeit nach Keplergleichung: nah schneller
        const pts: string[] = []
        const ecc = 0.6
        for (let i = 0; i <= 48; i++) {
          const M = (i / 48) * 2 * Math.PI
          let Ea = M
          for (let j = 0; j < 8; j++) Ea = M + ecc * Math.sin(Ea)
          pts.push(`${(180 + 150 * Math.cos(Ea)).toFixed(1)} ${(470 + 120 * Math.sin(Ea)).toFixed(1)}`)
        }
        mk('animateMotion', { path: `M${pts.join('L')}`, dur: '8s', begin: '1.4s', repeatCount: 'indefinite' }, e)
      },
      mars(g) {
        // Mars mit Polkappen, Krater, Valles Marineris; daneben die beiden Bahnen (365 und 687 Tage)
        const t = group(g, '', 'transform: rotate(25deg); transform-origin: 150px 470px')
        blank(t, E(150, 470, 86))
        hatch(t, E(150, 470, 86), 600)
        hatch(t, [...E(150, 470, 86, 86, 235, 305), [150, 395]], 900, true)
        hatch(t, [...E(150, 470, 86, 86, 60, 120), [150, 548]], 900, true)
        ink(t, E(150, 470, 86), { w: 3, t: 800 })
        ink(t, B([96, 462], [130, 470], [170, 466], [208, 478]), { w: 2, d: 1000, t: 400 })
        for (const [x, y, r] of [[120, 500, 8], [190, 440, 10], [170, 510, 6]] as const) ink(t, E(x, y, r), { w: 1.4, d: 1100, t: 200 })
        ink(t, L([150, 384], [150, 344]), { w: 3, d: 700, t: 300 })
        ink(t, L([150, 556], [150, 596]), { w: 3, d: 700, t: 300 })
        sun(g, 300, 600, 6, 1300, 8)
        ink(g, E(300, 600, 22), { w: 1.4, d: 1400, t: 500 })
        ink(g, E(300, 600, 34), { w: 1.4, d: 1500, t: 500 })
        const e1 = spin(g, 300, 600, 3650, 1600)
        dot(e1, 300, 578, 3, 1600)
        const e2 = spin(g, 300, 600, 6870, 1600)
        dot(e2, 300, 566, 4, 1600)
      },
      ende(g) {
        sun(g, 40, 500, 18, 0, 8)
        for (const y of [470, 500, 530]) flow(g, L([70, y], [110, y]), { n: 2, ms: 900, d: 600, r: 1.8, kind: 'dash' })
        const t = group(g, '', 'transform: rotate(23.4deg); transform-origin: 200px 500px')
        earth(t, 200, 500, 64, 0, { lon: 10, lat: 0 })
        ink(t, L([200, 436], [200, 400]), { w: 3, d: 700, t: 300 })
        ink(t, L([200, 564], [200, 600]), { w: 3, d: 700, t: 300 })
        hatch(g, [...E(200, 500, 64, 64, -90, 90), [200, 564]], 900, true)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { bahn: {} } },
      { t: T('Viele glauben: Im Sommer ist die Erde der Sonne näher. Doch Anfang Januar ist sie ihr am **nächsten** – rund 147 Millionen Kilometer.', 64), gfx: { abstand: {} } },
      { t: T('Anfang Juli sind es 152 Millionen. Der Unterschied ist **klein** – und auf der Südhalbkugel ist im Januar ja gerade Sommer.', 64), gfx: { abstand: { cls: 'a1' } } },
      { t: T('Der wahre Grund: Die Erdachse ist um **23,4 Grad** geneigt. Und sie zeigt das ganze Jahr in dieselbe Richtung, etwa zum Polarstern.', 64), gfx: { achse: {} } },
      { t: T('Darum neigt sich im Juni die Nordhalbkugel zur Sonne hin. Im Dezember ist sie von ihr **abgewandt**.', 64), gfx: { orbit2: {} } },
      { t: T('Ist deine Hälfte zur Sonne geneigt, steht die Sonne mittags **hoch**. Ihre Strahlen treffen steil auf den Boden.', 64), gfx: { winkel: {} } },
      { t: T('Im Winter kommen sie **flach**: Dieselbe Lichtmenge verteilt sich auf eine viel größere Fläche. Jeder Quadratmeter wird weniger erwärmt.', 64), gfx: { winkel: { cls: 'a1' } } },
      { t: T('Probier es mit einer Taschenlampe: Senkrecht ergibt sie einen hellen Kreis, schräg einen **blassen, breiten** Fleck.', 64), gfx: { lampe: {} } },
      { t: T('Flaches Licht muss außerdem einen **längeren Weg** durch die Luft nehmen. Unterwegs wird mehr davon gestreut und geschluckt.', 64), gfx: { weg: {} } },
      { t: T('Dazu kommt die **Tageslänge**: Im Juni kann die Sonne in Deutschland gut 16 Stunden scheinen, im Dezember kaum 8.', 64), gfx: { tag: {} } },
      { t: T('Steiles Licht und lange Tage heizen auf, flaches Licht und kurze Tage kühlen ab. Das sind die **Jahreszeiten**.', 64), gfx: { thermo2: {} } },
      { t: T('Der kälteste Tag kommt übrigens meist **Wochen nach** dem kürzesten: Boden und Meer geben ihre Sommerwärme nur langsam ab.', 64), gfx: { kalt: {} } },
      { t: T('Am Äquator ändert sich wenig. Die Sonne steht dort immer hoch – statt Sommer und Winter gibt es oft **Regen- und Trockenzeit**.', 64), gfx: { aequator: {} } },
      { t: T('An den Polen dagegen wird es extrem: monatelang **Polartag**, an dem die Sonne nie untergeht, und monatelang Polarnacht.', 64), gfx: { pol: {} } },
      { t: T('Und die Sonnennähe im Januar? Weil die Erde fern der Sonne **langsamer** läuft, dauert das Sommerhalbjahr im Norden sogar rund eine Woche länger.', 64), gfx: { kepler: {} } },
      { t: T('Auf dem Mars ist die Achse ähnlich geneigt, um 25 Grad. Auch dort gibt es Jahreszeiten – nur **fast doppelt so lang**.', 64), gfx: { mars: {} } },
      { t: T('Nicht der Abstand macht den Sommer, sondern **der Winkel**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Anfang Januar ist die Erde der Sonne am nächsten (147 statt 152 Mio. km).', 'Die geneigte Erdachse (23,4°) lässt das Licht im Sommer steil, im Winter flach einfallen.', 'Dazu kommen lange Sommer- und kurze Wintertage.'],
    sources: ['NASA Space Place: What Causes the Seasons?', 'Deutscher Wetterdienst: Tageslänge und Sonnenstand', 'NASA: Mars Facts'],
  },
  {
    id: 'mondseite',
    area: 'PHY',
    day: 84,
    hook: 'Warum zeigt uns der Mond immer dasselbe Gesicht?',
    mood: 'kosmisch',
    ambience: 'nacht',
    images: [],
    draw: {
      gross(g) {
        stars(g, 20, 80, 320, 360, 30, 0, (x, y) => Math.hypot(x - 180, y - 250) < 150)
        moonFace(g, 180, 250, 130)
      },
      flecken(g) {
        moonFace(g, 150, 480, 106)
        // Luna 3 fliegt hinter den Mond und fotografiert die Rückseite
        const pr = glide(g, -20, -10, { ms: 6000, d: 900 })
        const body: P[] = [...E(304, 340, 10, 16)]
        blank(pr, body)
        ink(pr, body, { w: 2, d: 600, t: 300 })
        for (const [a, b] of [[[296, 330], [280, 316]], [[312, 330], [328, 316]], [[300, 354], [290, 372]], [[308, 354], [318, 372]]] as [P, P][]) ink(pr, L(a, b), { w: 1.4, d: 800, t: 150 })
        hatch(pr, RR(298, 334, 12, 8, 2), 900, true)
        dashes(g, L([292, 356], [236, 412]), { w: 1.2, d: 1200, dash: 4, gap: 4 })
        dashes(g, L([300, 360], [256, 440]), { w: 1.2, d: 1200, dash: 4, gap: 4 })
      },
      umlauf(g) {
        earth(g, 180, 460, 46, 0, { lon: 0, lat: 90 })
        dashes(g, E(180, 460, 130), { w: 1.4, d: 400 })
        ;[[180, 330], [310, 460], [180, 590], [50, 460]].forEach(([x, y], i) => {
          const d = 700 + i * 250
          blank(g, E(x, y, 16))
          ink(g, E(x, y, 16), { w: 1.4, d, t: 300 })
          const k = Math.hypot(180 - x, 460 - y)
          hatch(g, [...E(x + ((180 - x) / k) * 6, y + ((460 - y) / k) * 6, 7)], d + 200, true)
        })
        const o = spin(g, 180, 460, 10000, 1800)
        moon(o, 180, 330, 18, 1800)
        hatch(o, E(180, 341, 8, 5), 2000, true)
        arcArrow(g, 180, 460, 164, -64, -22, { d: 1800, t: 400 })
      },
      stuhl(g) {
        // Draufsicht: Stuhl mit Lehne, du gehst herum und schaust ihn immer an
        const ch: P[] = [[160, 440], [200, 440], [200, 480], [160, 480], [160, 440]]
        blank(g, ch)
        hatch(g, ch, 400)
        ink(g, ch, { w: 2.6, t: 500 })
        ink(g, RR(156, 432, 48, 8, 3), { w: 2.4, d: 200, t: 300 })
        for (const [x, y] of [[163, 443], [197, 443], [163, 477], [197, 477]] as const) dot(g, x, y, 2.4, 400)
        dashes(g, E(180, 460, 120), { w: 1.2, d: 500, dash: 5, gap: 7 })
        const o = spin(g, 180, 460, 9000, 900)
        // Person von oben: Schultern, Kopf, Nase zum Stuhl
        blank(o, E(180, 340, 20, 9))
        ink(o, E(180, 340, 20, 9), { w: 2.2, d: 700, t: 300 })
        blank(o, E(180, 340, 8))
        ink(o, E(180, 340, 8), { w: 2.2, d: 800, t: 200 })
        ink(o, L([180, 348], [180, 356]), { w: 2, d: 900, t: 100 })
        dashes(o, L([180, 360], [180, 428]), { w: 1, d: 1000, dash: 3, gap: 5 })
        arcArrow(g, 180, 460, 146, 200, 250, { d: 1700, t: 400 })
      },
      gebunden(g) {
        earth(g, 80, 460, 46, 0, { lon: 30, lat: 10 })
        moonFace(g, 280, 460, 40, 300, { rot: -90 })
        dashes(g, L([132, 460], [236, 460]), { w: 1.4, d: 900 })
      },
      beule(g) {
        earth(g, 80, 460, 46, 0, { lon: 30, lat: 10 })
        blank(g, E(276, 460, 46, 28))
        hatch(g, E(276, 460, 46, 28), 500)
        ink(g, E(276, 460, 46, 28), { w: 2.6, d: 300, t: 600 })
        dashes(g, E(276, 460, 30), { w: 1, d: 600, dash: 4, gap: 4 })
        for (const s of [-1, 1]) arrow(g, L([276 + s * 50, 460], [276 + s * 70, 460]), { w: 2, d: 900, t: 300, head: 7 })
        arrow(g, L([226, 440], [140, 448]), { w: 1.6, d: 1100, t: 400, head: 7 })
        text(g, 276, 516, 'Gezeitenbeule', { anchor: 'middle', cls: 's', d: 1300 })
      },
      bremse(g) {
        earth(g, 80, 460, 46, 0, { lon: 30, lat: 10 })
        const tilt = group(g, '', 'transform: rotate(32deg); transform-origin: 270px 460px')
        const m = st(tilt, 'm1', '--m1: rotate(-32deg); transform-origin: 270px 460px; transition-duration: 2.4s')
        blank(m, E(270, 460, 42, 26))
        hatch(m, E(270, 460, 42, 26), 500)
        ink(m, E(270, 460, 42, 26), { w: 2.6, d: 300, t: 600 })
        dot(m, 232, 460, 3.4, 700)
        const sp = st(g, 'h1')
        arcArrow(sp, 270, 460, 62, -150, -40, { d: 800, t: 500 })
        arrow(sp, L([238, 440], [140, 452]), { w: 1.6, d: 1100, t: 400, head: 7 })
      },
      monde(g) {
        // Jupiter mit Wolkenbändern und Großem Roten Fleck; die vier großen Monde zeigen ihm stets dieselbe Seite
        blank(g, E(180, 470, 62))
        for (const [y, h, dd] of [[-34, 8, 0], [-14, 10, 1], [8, 8, 0], [28, 7, 1]] as const) {
          const yy = 470 + y
          const half = Math.sqrt(62 * 62 - y * y)
          const band: P[] = [[180 - half, yy - h / 2], ...smooth([[180 - half, yy - h / 2], [180, yy - h / 2 - 2], [180 + half, yy - h / 2]], 6), [180 + half, yy + h / 2], [180 - half, yy + h / 2]]
          hatch(g, band, 600, !!dd)
        }
        ink(g, E(208, 486, 10, 6), { w: 1.6, d: 900, t: 200 })
        ink(g, E(180, 470, 62), { w: 3, t: 800 })
        ;[[86, 2600], [110, 5200], [140, 10400], [170, 24000]].forEach(([r, ms], i) => {
          dashes(g, E(180, 470, r, r * 0.35), { w: 1, d: 300 + i * 100, dash: 4, gap: 6 })
          const o = mk('g', { opacity: 0 }, g)
          ball(o, 0, 0, 6 + (i % 2) * 2, { fill: 'hell', t: 0, w: 1.6 })
          dot(o, -3, 0, 2, 0)
          const path = E(180, 470, r, r * 0.35)
          mk('set', { attributeName: 'opacity', to: 1, begin: `${0.8 + i * 0.2}s`, fill: 'freeze' }, o)
          mk('animateMotion', { path: `M${path.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}`, dur: `${ms / 1000}s`, begin: `${0.8 + i * 0.2}s`, repeatCount: 'indefinite', rotate: 'auto' }, o)
        })
      },
      pluto(g) {
        // Pluto (mit dem hellen „Herz“) und Charon drehen sich umeinander und schauen sich dabei immer an
        dashes(g, E(150, 460, 18), { w: 1, d: 600, dash: 3, gap: 4 })
        const p = spin(g, 150, 460, 12000, 800)
        ball(p, 110, 460, 40, { fill: 'hell', w: 3 })
        const heart: P[] = [...B([132, 470], [118, 458], [124, 444], [136, 452]), ...B([136, 452], [146, 444], [152, 460], [132, 470]).slice(1)]
        blank(p, heart)
        ink(p, heart, { w: 1.6, d: 900, t: 300 })
        ball(p, 260, 460, 21, { d: 300, fill: 'leer' })
        hatch(p, E(246, 456, 7, 5), 900, true)
        dashes(p, L([154, 460], [236, 460]), { w: 1.4, d: 700 })
        stars(g, 20, 320, 320, 80, 14, 0)
      },
      tageslaenge(g) {
        hbars(g, [
          { label: 'Devon-Zeit', v: 22, fmt: (v) => `${Math.round(v)} h` },
          { label: 'heute', v: 24, fmt: (v) => `${Math.round(v)} h`, dense: true },
        ], { y: 380, gap: 120, max: 24 })
        const e = spin(g, 300, 600, 3000, 1200)
        earth(e, 300, 600, 26, 1000, { lon: 0, lat: 90, w: 0.8 })
        moon(g, 220, 620, 8, 1300)
      },
      koralle(g) {
        // fossile Koralle: grobe Jahres- und feine Tagesringe; die Lupe zeigt die feinen Linien
        const shape: P[] = [...B([60, 630], [40, 500], [120, 350], [180, 340]), ...B([180, 340], [240, 350], [320, 500], [300, 630]).slice(1), [60, 630]]
        blank(g, shape)
        ink(g, shape, { w: 3, t: 800 })
        for (let k = 1; k < 9; k++) {
          const y = 630 - k * 30
          const half = 120 * Math.sqrt(1 - Math.pow((630 - y) / 300, 2)) - 10
          ink(g, B([180 - half, y + 6], [180 - half / 2, y - 6], [180 + half / 2, y - 6], [180 + half, y + 6]), { w: 1.6, d: 500 + k * 80, t: 300 })
        }
        blank(g, E(250, 520, 52))
        for (let k = 0; k < 14; k++) ink(g, L([206, 486 + k * 5], [294, 482 + k * 5]), { w: 0.7, d: 1300 + k * 40, t: 100 })
        blank(g, [...E(250, 520, 60), ...E(250, 520, 52, 52, 360, 0)])
        ink(g, E(250, 520, 54), { w: 3, d: 1200, t: 400 })
        ink(g, L([290, 560], [326, 600]), { w: 6, d: 1400, t: 200 })
      },
      naeher(g) {
        // Urzeit: Vulkane, riesiger naher Mond – heute: kleiner Mond über flachem Land
        const sky1 = RR(20, 330, 154, 250, 10)
        ink(g, sky1, { w: 2.4, t: 500 })
        moonFace(g, 97, 420, 56, 300)
        const v: P[] = [[26, 580], [60, 520], [74, 524], [100, 580]]
        hatch(g, v, 800, true)
        ink(g, v, { w: 2, d: 600, t: 300 })
        const v2: P[] = [[96, 580], [130, 540], [140, 543], [168, 580]]
        hatch(g, v2, 900, true)
        ink(g, v2, { w: 2, d: 700, t: 300 })
        for (const x of [67, 135]) flow(g, L([x, 520], [x + 10, 470]), { n: 2, ms: 1500, d: 1000, r: 3, kind: 'ring' })
        const sky2 = RR(186, 330, 154, 250, 10)
        ink(g, sky2, { w: 2.4, d: 200, t: 500 })
        moonFace(g, 263, 400, 12, 700)
        ground(g, 190, 336, 560, 900)
        tree(g, 300, 560, 0.3, 1000)
        text(g, 97, 606, 'früher', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 263, 606, 'heute', { anchor: 'middle', cls: 's', d: 1200 })
      },
      zukunft(g) {
        // die Sonne bläht sich auf und verschluckt die inneren Bahnen
        dashes(g, E(180, 470, 60), { w: 1, d: 300, dash: 4, gap: 6 })
        dashes(g, E(180, 470, 100), { w: 1, d: 400, dash: 4, gap: 6 })
        dashes(g, E(180, 470, 140), { w: 1, d: 500, dash: 4, gap: 6 })
        const e = spin(g, 180, 470, 8000, 600)
        earth(e, 180, 330, 9, 600, { w: 0.6 })
        sun(g, 180, 470, 26)
        const big = st(g, 'x1', '--o: 180px 470px')
        blank(big, E(180, 470, 120))
        hatch(big, E(180, 470, 120), 0)
        ink(big, E(180, 470, 120), { w: 3, t: 0 })
        for (let k = 0; k < 7; k++) ink(big, E(180 + Math.cos(k) * 50, 470 + Math.sin(k * 1.7) * 50, 14 + (k % 3) * 6), { w: 1, t: 0 })
      },
      rueckseite(g) {
        sun(g, 34, 460, 18, 0, 8)
        for (const y of [430, 460, 490]) flow(g, L([62, y], [140, y]), { n: 2, ms: 1000, d: 500, r: 1.8, kind: 'dash' })
        blank(g, E(180, 460, 30))
        hatch(g, [...E(180, 460, 30, 30, -90, 90)], 600, true)
        ink(g, E(180, 460, 30), { w: 2.8, d: 300, t: 500 })
        earth(g, 308, 460, 28, 400, { lon: 40, lat: 10 })
        hatch(g, [...E(308, 460, 28, 28, -90, 90)], 900, true)
        text(g, 180, 530, 'Mond', { anchor: 'middle', cls: 's', d: 900 })
        text(g, 308, 520, 'Erde', { anchor: 'middle', cls: 's', d: 1000 })
        arrow(st(g, 'f1'), L([110, 590], [152, 484]), { w: 2, t: 0, head: 8 })
        ink(st(g, 'f1'), E(180, 460, 36, 36, 120, 240), { w: 2.4, t: 0 })
      },
      libration(g) {
        // der Mond schwankt: an den Rändern tauchen abwechselnd Stücke der Rückseite auf
        moonFace(g, 180, 430, 104, 0, { libr: 10 })
        const pie: [number, number, string, boolean][] = [[0, 0.41, '41 % immer', true], [0.41, 0.59, '18 % manchmal', false], [0.59, 1, '41 % nie', false]]
        pie.forEach(([a, b, l, dense], i) => {
          const pts: P[] = [[80, 600], ...E(80, 600, 34, 34, -90 + a * 360, -90 + b * 360), [80, 600]]
          if (i < 2) hatch(g, pts, 900 + i * 200, dense)
          ink(g, pts, { w: 1.6, d: 800 + i * 200, t: 300 })
          text(g, 132, 580 + i * 22, l, { cls: 's', d: 1100 + i * 200 })
        })
      },
      ende(g) {
        earth(g, 110, 520, 40, 0, { lon: 30, lat: 10 })
        dashes(g, E(110, 520, 150, 150, -24, 24), { w: 1.2, d: 400, dash: 5, gap: 6 })
        moonFace(g, 260, 520, 22, 300, { rot: -90 })
        dashes(g, L([156, 520], [234, 520]), { w: 1.4, d: 700 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { gross: {} } },
      { t: T('Egal wann du hinschaust: Vom Mond siehst du immer **dieselben Flecken**. Seine Rückseite sah niemand, bis die Sonde Luna 3 sie 1959 fotografierte.', 64), gfx: { flecken: {} } },
      { t: T('Dreht sich der Mond also nicht? Im Gegenteil: Er dreht sich genau **einmal pro Umlauf** um sich selbst – in gut 27 Tagen.', 64), gfx: { umlauf: {} } },
      { t: T('Probier es aus: Geh um einen Stuhl herum und schau ihn dabei immer an. Nach einer Runde hast du dich **einmal ganz gedreht**.', 64), gfx: { stuhl: {} } },
      { t: T('Diese perfekte Abstimmung heißt **gebundene Rotation**. Und sie ist kein Zufall.', 64), gfx: { gebunden: {} } },
      { t: T('Die Schwerkraft der Erde zieht den Mond ein wenig **in die Länge** – so wie der Mond unsere Meere zu Flutbergen zieht.', 64), gfx: { beule: {} } },
      { t: T('Früher drehte sich der Mond schneller. Seine Beule zeigte dadurch immer etwas an der Erde vorbei – und die Erde zog **bremsend** daran.', 64), gfx: { bremse: {} } },
      { t: T('Über Millionen Jahre wurde die Drehung gebremst, bis die Beule **stillstand** – genau zur Erde hin ausgerichtet.', 64), gfx: { bremse: { cls: 'a1' } } },
      { t: T('Das passiert fast überall: Die meisten großen Monde im Sonnensystem zeigen ihrem Planeten **immer dieselbe Seite**.', 64), gfx: { monde: {} } },
      { t: T('Pluto und sein Mond Charon gehen noch weiter: Sie haben sich **gegenseitig** gebremst und zeigen einander stets dieselbe Seite.', 64), gfx: { pluto: {} } },
      { t: T('Auch die Erde wird vom Mond gebremst. Vor rund 400 Millionen Jahren dauerte ein Tag nur **knapp 22 Stunden**.', 64), gfx: { tageslaenge: {} } },
      { t: T('Das verraten fossile Korallen: Ihre feinen Wachstumsringe zeigen damals rund **400 Tage** pro Jahr.', 64), gfx: { koralle: {} } },
      { t: T('Weil der Mond sich langsam entfernt, stand er kurz nach seiner Entstehung **viel näher** – und wirkte am Himmel um ein Vielfaches größer.', 64), gfx: { naeher: {} } },
      { t: T('Eines fernen Tages würde auch die Erde dem Mond nur noch eine Seite zeigen. Vorher bläht sich aber die Sonne **zum Roten Riesen** auf.', 64), gfx: { zukunft: { cls: 'a1' } } },
      { t: T('Übrigens ist die Rückseite nicht dunkel, sie bekommt genauso viel Sonne. „Dunkle Seite“ hieß eigentlich: **unbekannte** Seite.', 64), gfx: { rueckseite: {} } },
      { t: T('Bei Neumond, wenn wir den Mond kaum sehen, liegt seine Rückseite sogar **voll im Sonnenlicht**.', 64), gfx: { rueckseite: { cls: 'a1' } } },
      { t: T('Ganz genau stimmt die eine Seite nicht: Der Mond schwankt leicht hin und her. So sehen wir mit der Zeit **59 Prozent** seiner Oberfläche.', 64), gfx: { libration: {} } },
      { t: T('Der Mond dreht sich – nur **im Takt** seines Umlaufs.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Der Mond dreht sich einmal pro Umlauf um sich selbst: gebundene Rotation.', 'Die Gezeitenkraft der Erde hat seine Drehung gebremst, bis sie im Takt war.', 'Durch sein leichtes Schwanken sehen wir mit der Zeit 59 % der Oberfläche.'],
    sources: ['NASA Science: Tidal Locking', 'Wells 1963, Nature 197 (Korallen-Tagesringe)', 'Williams et al. 2001, Lunar Laser Ranging'],
  },
  {
    id: 'sonnenlicht',
    area: 'PHY',
    day: 84,
    hook: 'Wie alt ist das Sonnenlicht auf deiner Haut?',
    mood: 'kosmisch',
    ambience: 'weltraum',
    images: [],
    draw: {
      gross(g) {
        sun(g, 180, 240, 70, 0, 16)
      },
      reise(g) {
        sun(g, 50, 460, 24, 0, 10)
        earth(g, 300, 460, 30, 300)
        dashes(g, L([100, 460], [264, 460]), { w: 1.6, d: 600 })
        text(g, 183, 440, '8 min 20 s', { anchor: 'middle', d: 900 })
      },
      schnitt(g) {
        ink(g, E(180, 470, 150), { w: 3, t: 800 })
        dashes(g, E(180, 470, 105), { w: 1.6, d: 500 })
        hatch(g, E(180, 470, 40), 900, true)
        ink(g, E(180, 470, 40), { w: 2.6, d: 700, t: 400 })
        text(g, 180, 476, 'Kern', { anchor: 'middle', cls: 'halo', d: 1100 })
        text(g, 180, 408, 'Strahlungszone', { anchor: 'middle', cls: 's', d: 1200 })
        text(g, 180, 348, 'Konvektionszone', { anchor: 'middle', cls: 's', d: 1300 })
      },
      fusion(g) {
        ;[[60, 430], [100, 430], [60, 490], [100, 490]].forEach(([x, y], i) => {
          ball(g, x, y, 14, { d: i * 120, t: 300 })
          text(g, x, y + 5, 'H', { anchor: 'middle', cls: 's', d: i * 120 + 100 })
        })
        arrow(g, L([134, 460], [206, 460]), { w: 3, d: 700, t: 400, head: 10 })
        ;[[249, 449], [272, 449], [249, 472], [272, 472]].forEach(([x, y], i) => ball(g, x, y, 11, { d: 1000 + i * 100, fill: i % 3 ? 'leer' : 'dicht', t: 300 }))
        text(g, 80, 540, 'Wasserstoff', { anchor: 'middle', cls: 's', d: 600 })
        text(g, 260, 540, 'Helium', { anchor: 'middle', cls: 's', d: 1300 })
        const r = st(g, 'x1', '--o: 260px 460px')
        for (let k = 0; k < 10; k++) {
          const a = rad(k * 36 - 90)
          ink(r, L([260 + Math.cos(a) * 40, 460 + Math.sin(a) * 40], [260 + Math.cos(a) * 56, 460 + Math.sin(a) * 56]), { w: 2.4, t: 0 })
        }
        text(r, 260, 380, '0,7 % Masse → Energie', { anchor: 'middle', cls: 's', fade: false })
      },
      masse(g) {
        text(g, 180, 400, 'E = mc²', { anchor: 'middle', size: 54, cls: 'serif', d: 200 })
        text(g, 180, 500, '1 Gramm Masse', { anchor: 'middle', d: 700 })
        arrow(g, L([180, 516], [180, 556]), { w: 2.6, d: 900, t: 300, head: 9 })
        text(g, 180, 590, '≈ 20.000 t Sprengstoff', { anchor: 'middle', d: 1200 })
      },
      tonnen(g) {
        sun(g, 180, 400, 50, 0, 14)
        const t = text(g, 180, 560, '', { anchor: 'middle', size: 34, d: 500 })
        countUp(t, 4, 500, 1400, (v) => `${v.toFixed(1).replace('.', ',')} Mio. t`)
        text(g, 180, 600, 'pro Sekunde', { anchor: 'middle', cls: 's', d: 900 })
      },
      zickzack(g) {
        ink(g, E(180, 470, 150), { w: 3, t: 800 })
        hatch(g, E(180, 470, 20), 500, true)
        ink(g, E(180, 470, 20), { w: 2.2, d: 300, t: 300 })
        const pts: P[] = [[180 + Math.cos(rad(200)) * 22, 470 + Math.sin(rad(200)) * 22]]
        for (let i = 1, r = 26; r <= 140; i++, r += 2.5) {
          const a = rad(200) + Math.sin(i * 0.13) * 0.35 + ((i % 2 ? 1 : -1) * (7 + 5 * Math.abs(Math.sin(i * 2.3)))) / r
          pts.push([180 + Math.cos(a) * r, 470 + Math.sin(a) * r])
        }
        ink(g, pts, { w: 1.4, d: 700, t: 2600 })
        dot(g, pts[pts.length - 1][0], pts[pts.length - 1][1], 4, 3300)
      },
      dauer(g) {
        hbars(g, [
          { label: 'Kern → Oberfläche', v: 170000, fmt: () => 'bis 170.000 Jahre' },
          { label: 'Oberfläche → Erde', v: 1, fmt: () => '8 Minuten', dense: true },
        ], { y: 380, gap: 130 })
      },
      suppe(g) {
        ink(g, E(180, 470, 150), { w: 3, t: 800 })
        ink(g, E(180, 470, 100), { w: 1.8, d: 300, t: 800 })
        for (let k = 0; k < 8; k++) {
          const a = k * 45 + 22
          const cx = 180 + Math.cos(rad(a)) * 125
          const cy = 470 + Math.sin(rad(a)) * 125
          arcArrow(g, cx, cy, 14, a + 60, a + 360, { d: 700 + k * 120, t: 500, w: 1.8, head: 6 })
        }
      },
      raus(g) {
        sun(g, 70, 460, 40, 0, 12)
        earth(g, 300, 460, 26, 300)
        arrow(g, L([136, 460], [268, 460]), { w: 3, d: 800, t: 500, head: 10 })
        text(g, 70, 556, '5.500 °C', { anchor: 'middle', d: 1100 })
      },
      vorrat(g) {
        pie(g, 180, 460, 110, 0.5)
        text(g, 180, 620, 'Wasserstoff im Kern: etwa halb verbraucht', { anchor: 'middle', cls: 's', d: 1100 })
      },
      eiszeit(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.2, label: 'Start im Kern', sub: 'Eiszeit in Europa', up: true },
          { at: 0.85, label: 'heute', sub: 'auf deiner Haut', big: true },
        ], 0, 900)
      },
      neutrino(g) {
        ink(g, E(180, 470, 140), { w: 3, t: 800 })
        hatch(g, E(180, 470, 20), 500, true)
        ink(g, E(180, 470, 20), { w: 2.2, d: 300, t: 300 })
        for (const a of [-60, 0, 60, 120]) arrow(g, L([180 + Math.cos(rad(a)) * 26, 470 + Math.sin(rad(a)) * 26], [180 + Math.cos(rad(a)) * 176, 470 + Math.sin(rad(a)) * 176]), { w: 2, d: 800, t: 400, head: 9 })
        text(g, 180, 660, 'Neutrinos: gut 2 Sekunden', { anchor: 'middle', cls: 's', d: 1300 })
      },
      detektor(g) {
        ink(g, L([20, 330], [340, 330]), { w: 3, t: 500 })
        hatch(g, RR(20, 332, 320, 320, 4), 300, true)
        blank(g, RR(100, 470, 160, 130, 8))
        ink(g, RR(100, 470, 160, 130, 8), { w: 3, d: 500, t: 700 })
        for (let k = 0; k < 6; k++) ink(g, E(124 + k * 22, 584, 7), { w: 1.6, d: 900 + k * 80, t: 200 })
        text(g, 180, 520, 'Wassertank', { anchor: 'middle', cls: 's', d: 1100 })
        text(g, 180, 400, '1.000 m Gestein', { anchor: 'middle', cls: 'halo', d: 1200 })
      },
      haut(g) {
        ink(g, RR(130, 410, 100, 100, 6), { w: 3, t: 600 })
        text(g, 180, 540, '1 cm²', { anchor: 'middle', d: 600 })
        let seed = 5
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 46; i++) {
          const x = 30 + rnd() * 300
          const y = 300 + rnd() * 320
          if (Math.abs(x - 180) < 62 && Math.abs(y - 460) < 62 && !(Math.abs(x - 180) < 42 && Math.abs(y - 460) < 42)) continue
          if (y > 520 && y < 560 && Math.abs(x - 180) < 40) continue
          dot(g, x, y, 2.4, 700 + i * 30)
        }
        text(g, 180, 650, '60 Milliarden pro Sekunde', { anchor: 'middle', cls: 's', d: 1800 })
      },
      ende(g) {
        sun(g, 180, 480, 44)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { gross: {} } },
      { t: T('Von der Sonnenoberfläche bis zu dir braucht Licht nur gut **8 Minuten**. Du siehst die Sonne immer so, wie sie vor 8 Minuten war.', 64), gfx: { reise: {} } },
      { t: T('Doch die **Energie** in diesem Licht ist viel älter. Sie entstand tief im Kern der Sonne.', 64), gfx: { schnitt: {} } },
      { t: T('Dort herrschen rund 15 Millionen Grad. Wasserstoffkerne prallen so heftig zusammen, dass sie zu **Helium** verschmelzen.', 64), gfx: { fusion: {} } },
      { t: T('Ein Heliumkern wiegt **0,7 Prozent weniger** als die vier Wasserstoffkerne, aus denen er entstand. Dieser Rest wird zu Energie.', 64), gfx: { fusion: { cls: 'a1' } } },
      { t: T('Winzige Masse, riesige Energie: Nach Einsteins Formel steckt in einem einzigen Gramm so viel Energie wie in rund **20.000 Tonnen** Sprengstoff.', 64), gfx: { masse: {} } },
      { t: T('So verwandelt die Sonne jede Sekunde rund **4 Millionen Tonnen** Masse in Energie – und hat trotzdem Vorrat für Milliarden Jahre.', 64), gfx: { tonnen: {} } },
      { t: T('Nach 4,6 Milliarden Jahren hat die Sonne erst etwa die **Hälfte** des Wasserstoffs in ihrem Kern verbraucht.', 64), gfx: { vorrat: {} } },
      { t: T('Die Energie startet als Strahlung. Doch das Innere ist so dicht, dass sie nach Bruchteilen eines Millimeters **an ein Teilchen stößt**.', 64), gfx: { zickzack: {} } },
      { t: T('Sie wird geschluckt und wieder ausgesandt – in **zufälliger Richtung**. Ein Zickzack, wie ein Betrunkener auf der Suche nach dem Ausgang.', 64), gfx: { zickzack: {} } },
      { t: T('Für diesen Irrweg braucht die Energie je nach Rechnung **zehntausende** bis über 100.000 Jahre.', 64), gfx: { dauer: {} } },
      { t: T('Im äußeren Drittel geht es schneller: Heißes Gas steigt auf, kühlt ab und sinkt wieder – wie in **kochender Suppe**.', 64), gfx: { suppe: {} } },
      { t: T('An der Oberfläche, bei rund 5.500 Grad, kann das Licht endlich entkommen. Ab hier fliegt es **ungehindert** zu dir.', 64), gfx: { raus: {} } },
      { t: T('Die Wärme auf deiner Haut begann ihre Reise also, als in Europa noch **Eiszeit** herrschte.', 64), gfx: { eiszeit: {} } },
      { t: T('Ein Teilchen nimmt die Abkürzung: **Neutrinos** aus der Kernfusion fliegen fast ungehindert durch alles – in gut zwei Sekunden aus der Sonne.', 64), gfx: { neutrino: {} } },
      { t: T('Forscher fangen ein paar davon in riesigen Wassertanks tief unter der Erde. So schauen sie der Sonne **direkt ins Herz**.', 64), gfx: { detektor: {} } },
      { t: T('Durch jeden Quadratzentimeter deiner Haut rasen jede Sekunde rund **60 Milliarden** Sonnen-Neutrinos. Du merkst nichts davon.', 64), gfx: { haut: {} } },
      { t: T('Sonnenlicht ist **uralte Energie** auf einer 8-Minuten-Reise.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Im Sonnenkern verschmilzt Wasserstoff zu Helium; 0,7 % der Masse werden zu Energie.', 'Die Strahlung irrt zehntausende Jahre im Zickzack bis zur Oberfläche.', 'Von dort braucht das Licht gut 8 Minuten; Neutrinos entkommen dem Kern in Sekunden.'],
    sources: ['Mitalas & Sills 1992, Astrophysical Journal 401', 'NASA: The Sun’s Radiative Zone', 'Bahcall 2000: Solar Neutrinos (Fluss ~6·10¹⁰ cm⁻² s⁻¹)'],
  },
  {
    id: 'dunkle-nacht',
    area: 'PHY',
    day: 84,
    hook: 'Warum ist der Nachthimmel eigentlich dunkel?',
    mood: 'kosmisch',
    ambience: 'nacht',
    images: [],
    draw: {
      himmel(g) {
        twinkle(g, [[60, 110], [140, 80], [250, 120], [310, 210], [90, 230], [200, 200], [40, 340], [280, 330], [170, 300], [120, 400], [320, 420], [230, 410]], 200)
      },
      frage(g) {
        question(g, 180, 470, 2.2, 200)
        twinkle(g, [[60, 340], [300, 330], [80, 590], [290, 600], [40, 460], [320, 480]], 900, 5)
      },
      sterne(g) {
        const pts: P[] = []
        for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) pts.push([40 + c * 56 + (r % 2) * 28, 320 + r * 60])
        twinkle(g, pts.filter(([x]) => x < 340), 0, 5)
      },
      wald(g) {
        const trees: P[] = []
        for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
          const x = 24 + c * 36 + (r % 2) * 18 + Math.sin(r * 3 + c) * 6
          const y = 300 + r * 34 + Math.cos(r + c * 2) * 5
          if (y < 560 && x < 340) trees.push([x, y])
        }
        trees.forEach(([x, y], i) => ball(g, x, y, 7, { d: 200 + i * 10, t: 0, w: 1.8 }))
        const eye0: P = [180, 630]
        eye(g, 180, 640, 0.4, 300)
        for (let a = -160; a <= -20; a += 7) {
          const dx = Math.cos(rad(a))
          const dy = Math.sin(rad(a))
          let best = Infinity
          for (const [x, y] of trees) {
            const px = x - eye0[0]
            const py = y - eye0[1]
            const t = px * dx + py * dy
            const dd = Math.hypot(px - t * dx, py - t * dy)
            if (t > 0 && dd < 7) best = Math.min(best, t - Math.sqrt(49 - dd * dd))
          }
          if (best < Infinity) ink(g, L([eye0[0] + dx * 16, eye0[1] + dy * 16], [eye0[0] + dx * (best - 2), eye0[1] + dy * (best - 2)]), { w: 1.2, d: 1200 + (a + 160) * 6, t: 300 })
        }
      },
      schalen(g) {
        dot(g, 180, 640, 5)
        ;[[60, 1], [120, 4], [180, 9]].forEach(([r, n], k) => {
          ink(g, E(180, 640, r, r, 220, 320), { w: 2, d: 300 + k * 400, t: 500 })
          for (let i = 0; i < n; i++) {
            const a = rad(220 + (100 * (i + 0.5)) / n)
            star(g, 180 + Math.cos(a) * r, 640 + Math.sin(a) * r - 14, 6 - k, { d: 700 + k * 400 + i * 60, fill: true, w: 1.6, t: 200 })
          }
        })
        text(g, 180, 410, 'doppelt so weit: ¼ so hell, 4× so viele', { anchor: 'middle', cls: 's', d: 1800 })
      },
      hell(g) {
        ink(g, RR(30, 310, 300, 300, 12), { w: 3, t: 700 })
        for (let i = 0; i < 9; i++) sun(g, 90 + (i % 3) * 90, 370 + Math.floor(i / 3) * 90, 12, 400 + i * 100, 8)
        text(g, 180, 646, 'Himmel so hell wie die Sonne?', { anchor: 'middle', cls: 's', d: 1400 })
      },
      zeitleiste(g) {
        timeline(g, 30, 330, 470, [
          { at: 0.1, label: '1823', sub: 'Olbers', up: true },
          { at: 0.45, label: '1848', sub: 'Poe' },
          { at: 0.85, label: '1965', sub: 'Hintergrundstrahlung', up: true },
        ])
      },
      alter(g) {
        bigText(g, 180, 480, '13,8', { size: 110 })
        text(g, 180, 540, 'Milliarden Jahre', { anchor: 'middle', size: 22, d: 900 })
      },
      horizont(g) {
        dot(g, 180, 480, 5)
        dashes(g, E(180, 480, 120), { w: 1.8, d: 300 })
        text(g, 180, 334, 'so weit kam Licht bisher', { anchor: 'middle', cls: 's', d: 600 })
        ;[[140, 420], [240, 450], [170, 560]].forEach(([x, y], i) => {
          star(g, x, y, 8, { d: 800 + i * 200, fill: true, w: 1.8, t: 200 })
          const k = Math.hypot(180 - x, 480 - y)
          arrow(g, L([x + ((180 - x) / k) * 14, y + ((480 - y) / k) * 14], [x + ((180 - x) / k) * (k - 12), y + ((480 - y) / k) * (k - 12)]), { w: 1.8, d: 1000 + i * 200, t: 300, head: 7 })
        })
        ;[[50, 380], [320, 560], [300, 380], [60, 600]].forEach(([x, y], i) => star(g, x, y, 8, { d: 1600 + i * 150, w: 1.6, t: 200 }))
      },
      beobachtbar(g) {
        ink(g, E(180, 470, 150), { w: 3, t: 900 })
        dot(g, 180, 470, 5, 500)
        text(g, 180, 500, 'wir', { anchor: 'middle', cls: 's', d: 600 })
        arrow(g, L([180, 470], [326, 470]), { w: 2, d: 800, t: 400, head: 9 })
        text(g, 252, 454, '46,5 Mrd. Lj', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 180, 650, 'beobachtbares Universum', { anchor: 'middle', d: 1200 })
      },
      leben(g) {
        star(g, 90, 460, 30, { fill: true })
        star(g, 180, 460, 30, { d: 300, fill: true })
        star(g, 270, 460, 30, { d: 600 })
        cross(g, 270, 540, 1, 1000)
        text(g, 180, 620, 'Sterne erlöschen', { anchor: 'middle', cls: 's', d: 1200 })
      },
      poe(g) {
        const l: P[] = [[180, 380], [70, 360], [70, 560], [180, 580], [180, 380]]
        const r: P[] = [[180, 380], [290, 360], [290, 560], [180, 580], [180, 380]]
        blank(g, l)
        blank(g, r)
        ink(g, l, { w: 2.8, t: 600 })
        ink(g, r, { w: 2.8, d: 200, t: 600 })
        for (let k = 0; k < 5; k++) {
          ink(g, L([90, 400 + k * 30], [164, 414 + k * 30]), { w: 1.4, d: 700 + k * 80, t: 200 })
          ink(g, L([196, 414 + k * 30], [270, 400 + k * 30]), { w: 1.4, d: 800 + k * 80, t: 200 })
        }
        text(g, 180, 630, '„Eureka“, 1848', { anchor: 'middle', d: 1300 })
      },
      dehnung(g) {
        ink(g, waveP(30, 330, 380, 22, 40), { w: 2.8, t: 900 })
        arrow(g, L([180, 420], [180, 480]), { w: 2.6, d: 900, t: 300, head: 9 })
        ink(g, waveP(30, 330, 540, 22, 110), { w: 2.8, d: 1100, t: 900 })
        text(g, 30, 610, 'gestreckt: rötlicher, schwächer', { cls: 's', d: 1700 })
      },
      mikrowelle(g) {
        ink(g, waveP(20, 340, 470, 40, 320), { w: 3, t: 1200 })
        text(g, 180, 600, 'Mikrowellen, 2,7 Grad über dem Nullpunkt', { anchor: 'middle', cls: 's', d: 1300 })
      },
      antenne(g) {
        ink(g, B([110, 360], [130, 470], [200, 520], [300, 520]), { w: 3.2, t: 700 })
        ink(g, L([110, 360], [300, 520]), { w: 2, d: 300, t: 500 })
        ink(g, L([205, 440], [250, 380]), { w: 2.4, d: 600, t: 300 })
        ink(g, L([196, 498], [196, 620]), { w: 3, d: 500, t: 400 })
        ink(g, L([146, 622], [246, 622]), { w: 3, d: 600, t: 300 })
        for (const [x, y, d] of [[60, 330, 900], [90, 300, 1000], [40, 290, 1100]] as const) ink(g, waveP(x - 20, x + 20, y, 4, 12), { w: 1.6, d, t: 300 })
        text(g, 250, 660, 'Penzias und Wilson, 1965', { anchor: 'middle', cls: 's', d: 1300 })
      },
      fernseher(g) {
        ink(g, RR(60, 360, 240, 180, 22), { w: 3.2, t: 700 })
        ink(g, RR(80, 380, 170, 140, 16), { w: 2.4, d: 300, t: 600 })
        ink(g, L([140, 540], [120, 580]), { w: 2.6, d: 500, t: 200 })
        ink(g, L([220, 540], [240, 580]), { w: 2.6, d: 500, t: 200 })
        let seed = 9
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
        for (let i = 0; i < 60; i++) mk('rect', { x: (92 + rnd() * 144).toFixed(1), y: (392 + rnd() * 114).toFixed(1), width: 3, height: 2, class: 'k blink', style: `--d:${(rnd() * 1100).toFixed(0)}ms` }, g)
        ;[0, 1].forEach((k) => ink(g, E(278, 420 + k * 40, 8), { w: 2, d: 800 + k * 100, t: 200 }))
        text(g, 180, 630, 'Rauschen', { anchor: 'middle', d: 1100 })
      },
      ende(g) {
        twinkle(g, [[90, 420], [180, 380], [270, 430], [130, 520], [240, 540]], 0, 6)
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { himmel: {} } },
      { t: T('Klingt nach einer Kinderfrage. Doch sie hat Astronomen jahrhundertelang **gequält**.', 64), gfx: { frage: {} } },
      { t: T('Stell dir ein Universum vor, das **unendlich groß** ist, unendlich alt und überall gleichmäßig voller Sterne.', 64), gfx: { sterne: {} } },
      { t: T('Dann träfe dein Blick in **jeder Richtung** irgendwann auf einen Stern – wie in einem dichten Wald, wo du überall auf einen Stamm schaust.', 64), gfx: { wald: {} } },
      { t: T('Ferne Sterne sind zwar schwächer. Aber je weiter du schaust, desto **mehr Sterne** gibt es dort. Beides gleicht sich genau aus.', 64), gfx: { schalen: {} } },
      { t: T('Der ganze Himmel müsste also so hell leuchten wie die **Oberfläche der Sonne** – Tag und Nacht.', 64), gfx: { hell: {} } },
      { t: T('Das ist das **Olberssche Paradoxon**, benannt nach dem Bremer Arzt und Astronomen Heinrich Wilhelm Olbers.', 64), gfx: { zeitleiste: {} } },
      { t: T('Die Lösung hat zwei Teile. Erstens: Das Universum ist **nicht unendlich alt**. Es entstand vor 13,8 Milliarden Jahren.', 64), gfx: { alter: {} } },
      { t: T('Licht von Sternen, die weiter weg sind, als Licht in dieser Zeit reisen konnte, hat uns **noch gar nicht erreicht**.', 64), gfx: { horizont: {} } },
      { t: T('Weil sich der Raum seitdem ausgedehnt hat, reicht unser Blick heute **46 Milliarden** Lichtjahre weit – das beobachtbare Universum.', 64), gfx: { beobachtbar: {} } },
      { t: T('Und Sterne leben nicht ewig. Es gibt schlicht **nicht genug** leuchtende Sterne, um jeden Blickwinkel zu füllen.', 64), gfx: { leben: {} } },
      { t: T('Kurioserweise ahnte das zuerst ein Dichter: **Edgar Allan Poe** schrieb die Idee 1848 in sein Prosagedicht „Eureka“.', 64), gfx: { poe: {} } },
      { t: T('Zweitens: Das Universum **dehnt sich aus**. Licht von fernen Galaxien wird dabei gestreckt – rötlicher und schwächer.', 64), gfx: { dehnung: {} } },
      { t: T('Das Leuchten des jungen Universums ist so stark gestreckt, dass es heute als **Mikrowellen** ankommt – unsichtbar für dein Auge.', 64), gfx: { mikrowelle: {} } },
      { t: T('1965 entdeckten Arno Penzias und Robert Wilson dieses Rauschen zufällig. Erst hielten sie es für **Taubendreck** in ihrer Antenne.', 64), gfx: { antenne: {} } },
      { t: T('Ein kleiner Teil des **Rauschens** alter Röhrenfernseher stammte von genau diesem Nachglühen des Urknalls.', 64), gfx: { fernseher: {} } },
      { t: T('Der Himmel leuchtet also wirklich in jeder Richtung – nur in einem Licht, das wir **nicht sehen** können.', 64), gfx: { mikrowelle: {} } },
      { t: T('Die dunkle Nacht verrät: Das Universum hatte **einen Anfang**.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein unendliches, ewiges Universum voller Sterne hätte einen gleißend hellen Himmel (Olbers-Paradoxon).', 'Das Universum ist 13,8 Mrd. Jahre alt – Licht von weiter weg ist noch nicht bei uns.', 'Die Ausdehnung streckt das älteste Licht bis zu Mikrowellen: die Hintergrundstrahlung.'],
    sources: ['Harrison 1987: Darkness at Night', 'Poe 1848: Eureka', 'Penzias & Wilson 1965, Astrophysical Journal 142'],
  },
  {
    id: 'ueberschall',
    area: 'PHY',
    day: 49,
    hook: 'Was knallt eigentlich beim Überschallknall?',
    mood: 'episch',
    ambience: 'wind',
    images: [],
    draw: {
      kegel(g) {
        jet(g, 250, 220, 1)
        ink(g, L([342, 220], [60, 92]), { w: 2.4, d: 900, t: 600 })
        ink(g, L([342, 220], [60, 348]), { w: 2.4, d: 900, t: 600 })
      },
      mauer(g) {
        hatch(g, RR(220, 330, 24, 260, 6), 400, true)
        ink(g, RR(220, 330, 24, 260, 6), { w: 3, t: 600 })
        jet(g, 120, 460, 0.7, 500)
        text(g, 180, 640, 'ein einziges Peng?', { anchor: 'middle', d: 1100 })
      },
      boot(g) {
        const hull: P[] = [[220, 452], [276, 452], [296, 460], [276, 468], [220, 468], [220, 452]]
        blank(g, hull)
        hatch(g, hull, 500, true)
        ink(g, hull, { w: 2.6, t: 500 })
        ink(g, L([296, 460], [40, 350]), { w: 2.2, d: 600, t: 700 })
        ink(g, L([296, 460], [40, 570]), { w: 2.2, d: 600, t: 700 })
        for (const k of [1, 2]) ink(g, L([296 - k * 70, 460 - k * 30 + 8], [296 - k * 70 - 30, 460 - k * 30 - 4]), { w: 1.4, d: 1000 + k * 100, t: 200 })
        text(g, 180, 640, 'Bugwelle', { anchor: 'middle', cls: 's', d: 1300 })
      },
      kreise(g) {
        dot(g, 180, 460, 5)
        ;[30, 60, 90, 120].forEach((r, k) => ink(g, E(180, 460, r), { w: 2, d: 300 + k * 300, t: 600 }))
        text(g, 180, 630, '343 m/s ≈ 1.235 km/h', { anchor: 'middle', cls: 's', d: 1400 })
      },
      langsam(g) {
        ;[4, 3, 2, 1].forEach((t, k) => ink(g, E(250 - 15 * t, 460, 30 * t), { w: 2, d: k * 250, t: 600 }))
        dot(g, 250, 460, 5, 1200)
        text(g, 180, 630, 'langsamer als der Schall', { anchor: 'middle', cls: 's', d: 1300 })
      },
      gleich(g) {
        ;[4, 3, 2, 1].forEach((t, k) => ink(g, E(250 - 30 * t, 460, 30 * t), { w: 2, d: k * 250, t: 600 }))
        dot(g, 250, 460, 5, 1200)
        text(g, 180, 630, 'genau Schallgeschwindigkeit', { anchor: 'middle', cls: 's', d: 1300 })
      },
      schnell(g) {
        ;[108, 36, 12].forEach((r, k) => ink(g, E(340 - 2 * r, 460, r), { w: 2, d: k * 250, t: 600 }))
        dot(g, 340, 460, 5, 900)
        ink(g, L([340, 460], [20, 275]), { w: 2.6, d: 1100, t: 600 })
        ink(g, L([340, 460], [20, 645]), { w: 2.6, d: 1100, t: 600 })
        const a = st(g, 'x1', '--o: 300px 460px')
        text(a, 300, 400, 'Öffnung 60°', { anchor: 'middle', cls: 's', fade: false })
      },
      mach(g) {
        const b: P[] = [[60, 452], [180, 452], ...B([180, 452], [214, 452], [236, 458], [246, 460]).slice(1), ...B([246, 460], [236, 462], [214, 468], [180, 468]).slice(1), [60, 468], [60, 452]]
        blank(g, b)
        hatch(g, b, 500, true)
        ink(g, b, { w: 2.6, t: 600 })
        ink(g, L([246, 460], [60, 330]), { w: 2, d: 700, t: 600 })
        ink(g, L([246, 460], [60, 590]), { w: 2, d: 700, t: 600 })
        text(g, 180, 640, 'Ernst Mach, Geschoss-Foto 1887', { anchor: 'middle', cls: 's', d: 1200 })
      },
      boden(g) {
        ink(g, L([20, 620], [340, 620]), { w: 3, t: 500 })
        jet(g, 289, 440, 0.45, 200)
        ink(g, L([330, 440], [150, 620]), { w: 2.6, d: 700, t: 600 })
        ink(g, L([330, 440], [170, 280]), { w: 2.6, d: 700, t: 600 })
        fig(g, 90, 618, 1.3, { d: 900 })
        fig(g, 250, 618, 1.3, { d: 1000 })
        text(g, 90, 648, 'hört es', { anchor: 'middle', cls: 's', d: 1200 })
        text(g, 250, 648, 'noch still', { anchor: 'middle', cls: 's', d: 1300 })
      },
      teppich(g) {
        hatch(g, RR(40, 420, 210, 80, 30), 800)
        arrow(g, L([30, 460], [300, 460]), { w: 2.4, t: 800, head: 10 })
        jet(g, 322, 460, 0.25, 600)
        text(g, 145, 540, 'Knallteppich', { anchor: 'middle', d: 1200 })
        text(g, 145, 400, 'Flugroute', { anchor: 'middle', cls: 's', d: 900 })
      },
      nwelle(g) {
        axes(g, 40, 600, 330, 320, { xl: 'Zeit', yl: 'Druck' })
        dashes(g, L([50, 470], [320, 470]), { w: 1.2, d: 300 })
        ink(g, [...L([50, 470], [100, 470]), ...L([100, 470], [100, 390]).slice(1), ...L([100, 390], [260, 550]).slice(1), ...L([260, 550], [260, 470]).slice(1), ...L([260, 470], [320, 470]).slice(1)], { w: 3, d: 600, t: 1400 })
        text(g, 100, 376, 'Bug', { anchor: 'middle', cls: 's', d: 1000 })
        text(g, 260, 572, 'Heck', { anchor: 'middle', cls: 's', d: 1800 })
      },
      concorde(g) {
        jet(g, 180, 400, 1.3)
        for (const [y, d] of [[540, 800], [580, 900], [620, 1000]] as const) ink(g, waveP(20, 340, y, 5, 50, y / 30), { w: 2, d, t: 800 })
        text(g, 180, 480, 'Mach 2 nur über dem Meer', { anchor: 'middle', cls: 's', d: 1200 })
      },
      peitsche(g) {
        ink(g, L([40, 560], [90, 500]), { w: 6, t: 300 })
        ink(g, B([90, 500], [160, 420], [200, 620], [300, 400]), { w: 2.2, d: 300, t: 800 })
        rays(g, 300, 400, 16, 34, 8, 1200)
        text(g, 180, 650, 'Spitze schneller als der Schall', { anchor: 'middle', cls: 's', d: 1400 })
      },
      donner(g) {
        bolt(g, [[90, 300], [70, 400], [104, 410], [76, 520], [110, 530], [84, 640]], 0, 4)
        ;[24, 52, 80, 108].forEach((r, k) => ink(g, E(240, 470, r), { w: 2, d: 500 + k * 250, t: 500 }))
        dot(g, 240, 470, 4, 500)
        text(g, 240, 620, 'Druckwelle', { anchor: 'middle', cls: 's', d: 1500 })
      },
      dampf(g) {
        hatch(g, [[206, 452], [130, 400], [112, 470], [134, 532], [206, 474]], 300)
        jet(g, 180, 466, 1.2, 0)
        text(g, 180, 600, 'kurze Dampfwolke', { anchor: 'middle', cls: 's', d: 1000 })
      },
      x59(g) {
        const body: P[] = [[40, 470], [80, 456], [240, 452], [340, 462], [240, 470], [80, 480], [40, 476], [40, 470]]
        blank(g, body)
        ink(g, body, { w: 2.6, t: 800 })
        hatch(g, [[70, 456], [52, 420], [66, 420], [96, 456]], 600, true)
        ink(g, [[70, 456], [52, 420], [66, 420], [96, 456]], { w: 2.2, d: 500, t: 300 })
        hatch(g, [[110, 478], [90, 510], [140, 510], [170, 478]], 700, true)
        ink(g, [[110, 478], [90, 510], [140, 510], [170, 478]], { w: 2.2, d: 600, t: 300 })
        text(g, 180, 590, 'X-59: „Plopp“ statt Knall', { anchor: 'middle', d: 1100 })
      },
      ende(g) {
        dot(g, 320, 480, 6)
        ink(g, L([320, 480], [60, 360]), { w: 2.6, d: 300, t: 600 })
        ink(g, L([320, 480], [60, 600]), { w: 2.6, d: 300, t: 600 })
      },
    },
    scenes: [
      { t: HOOK(476), gfx: { kegel: {} } },
      { t: T('Viele denken: Der Knall entsteht in dem Moment, in dem ein Jet die **Schallmauer durchbricht** – ein einziges Peng.', 64), gfx: { mauer: {} } },
      { t: T('Tatsächlich zieht ein Überschalljet seinen Knall **die ganze Zeit** hinter sich her – wie ein Boot seine Bugwelle.', 64), gfx: { boot: {} } },
      { t: T('Schall ist eine Druckwelle. Jedes Flugzeug schickt sie in alle Richtungen los, mit rund **1.200 km/h**.', 64), gfx: { kreise: {} } },
      { t: T('Fliegt es langsamer, laufen die Wellen **vor ihm her**. Vorne drängen sie sich nur etwas zusammen – du hörst es kommen.', 64), gfx: { langsam: {} } },
      { t: T('Fliegt es genau mit Schallgeschwindigkeit, stapeln sich alle Wellen vorne zu einer **Wand** aus verdichteter Luft: der „Schallmauer“.', 64), gfx: { gleich: {} } },
      { t: T('Fliegt es schneller, überholt es seine eigenen Wellen. Sie legen sich zu einem **Kegel** zusammen, dem Machschen Kegel.', 64), gfx: { schnell: {} } },
      { t: T('Je schneller der Jet, desto **spitzer** der Kegel. Bei doppelter Schallgeschwindigkeit ist er nur noch 60 Grad weit.', 64), gfx: { schnell: { cls: 'a1' } } },
      { t: T('Benannt ist er nach **Ernst Mach**: Der österreichische Physiker fotografierte 1887 als Erster die Kegelwelle eines Geschosses.', 64), gfx: { mach: {} } },
      { t: T('Dieser Kegel fegt mit dem Jet über das Land. Wen er erreicht, der hört den **Knall** – egal, wo der Jet „durchgebrochen“ ist.', 64), gfx: { boden: {} } },
      { t: T('Entlang der ganzen Flugroute hören Menschen so nacheinander einen Knall: ein **Knallteppich**, viele Kilometer breit.', 64), gfx: { teppich: {} } },
      { t: T('Meist ist es sogar ein **Doppelknall**: eine Druckwelle vom Bug, eine vom Heck – dazwischen sinkt der Druck.', 64), gfx: { nwelle: {} } },
      { t: T('Die Concorde flog deshalb nur **über dem Meer** mit Überschall. Über Land war ihr Knall verboten.', 64), gfx: { concorde: {} } },
      { t: T('Eine **Peitsche** knallt ähnlich: Ihre Spitze wird schneller als der Schall – ein Mini-Überschallknall.', 64), gfx: { peitsche: {} } },
      { t: T('Und der **Donner**? Der Blitz heizt die Luft schlagartig auf rund 30.000 Grad. Sie dehnt sich explosionsartig aus – eine Druckwelle.', 64), gfx: { donner: {} } },
      { t: T('Bei feuchter Luft sieht man um sehr schnelle Jets manchmal eine **Dampfwolke**: Wo der Druck fällt, kondensiert kurz Wasser.', 64), gfx: { dampf: {} } },
      { t: T('Die NASA testet einen Jet mit extrem langer Nase. Statt eines Knalls soll er nur ein leises **Plopp** erzeugen.', 64), gfx: { x59: {} } },
      { t: T('Der Knall ist kein Moment, sondern ein **Kegel**, den der Jet hinter sich herzieht.', 230, { kind: 'big', center: true }), gfx: { ende: {} } },
    ],
    summary: ['Ein Überschalljet zieht einen Kegel aus verdichteter Luft hinter sich her.', 'Den Knall hört jeder, über den der Kegel streicht – nicht nur beim „Durchbrechen“.', 'Peitschenknall und Donner sind verwandte Druckwellen.'],
    sources: ['NASA Armstrong: Sonic Booms (Fact Sheet)', 'Krehl et al. 1998, The Physics of the Whip Crack', 'NASA: X-59 Quiet SuperSonic Technology'],
  },
]
