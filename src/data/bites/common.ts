// Zeichnungen, die jedes Häppchen benutzen kann (in data/bites/index.ts zu jedem `draw` hinzugefügt):
//   formel   – Wortformel ohne Variablen: ['Entfernung in km', '=', 'Sekunden bis zum Donner', '÷', '3']
//   zahl     – große Zahl mit Beschriftung
//   punkte   – bis zu 4 Stichpunkte, die nacheinander erscheinen
//   vergleich – zwei Spalten gegenüber (Titel + Zeilen)
//   kacheln  – Rahmen + Beschriftungen für das Schlussbild (recap)
// Schlussbild: recap() setzt bis zu vier Grafiken/Bilder des Häppchens als 2 × 2-Bild zusammen.
import { READ_MS, type Cam, type Draw, type GfxState, type PicState, type Scene } from '../feed'
import { RR, blank, group, ink, L, pop, text } from './draw'

const OPS = new Set(['=', '+', '−', '×', '÷', '→', '≈', '<', '>', '·'])

/** Text in Zeilen mit höchstens max Zeichen umbrechen */
export function wrap(s: string, max: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const w of s.split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur)
      cur = w
    } else cur = cur ? `${cur} ${w}` : w
  }
  if (cur) out.push(cur)
  return out
}

function lines(g: Element, x: number, y: number, ls: string[], o: { size?: number; anchor?: 'start' | 'middle' | 'end'; cls?: string; lh?: number }): void {
  const lh = o.lh ?? (o.size ?? 15) * 1.3
  ls.forEach((l, i) => text(g, x, y + i * lh, l, { size: o.size, anchor: o.anchor, cls: o.cls, fade: false }))
}

const formel: Draw = (g, ...a) => {
  const [tokens, y0 = 330, title] = a as unknown as [string[], number?, string?]
  const size = 17
  const cw = size * 0.56
  type Tok = { s: string; op: boolean; w: number; ls: string[] }
  const toks: Tok[] = tokens.map((s) => {
    const op = OPS.has(s)
    if (op) return { s, op, w: 34, ls: [s] }
    const ls = s.length * cw + 24 > 300 ? wrap(s, Math.ceil(s.length / 2) + 2) : [s]
    return { s, op, w: Math.max(...ls.map((l) => l.length)) * cw + 26, ls }
  })
  // Rechenzeichen bleibt beim folgenden Wort (nie am Zeilenende)
  const units: Tok[][] = []
  for (const t of toks) {
    const last = units[units.length - 1]
    if (last && last.length === 1 && last[0].op) last.push(t)
    else units.push([t])
  }
  const rows: Tok[][] = [[]]
  let x = 0
  for (const u of units) {
    const w = u.reduce((s, t) => s + t.w + 6, 0)
    if (x + w > 336 && rows[rows.length - 1].length) {
      rows.push([])
      x = 0
    }
    rows[rows.length - 1].push(...u)
    x += w
  }
  let y = y0
  if (title) {
    text(g, 180, y - 34, title, { anchor: 'middle', cls: 's', d: 0 })
  }
  let k = 0
  for (const row of rows) {
    const h = Math.max(...row.map((t) => (t.op ? 46 : t.ls.length * 22 + 24)))
    const total = row.reduce((s, t) => s + t.w + 6, -6)
    let cx = 180 - total / 2
    for (const t of row) {
      const p = pop(g, 200 + k++ * 380, '50% 50%')
      if (t.op) text(p, cx + t.w / 2, y + h / 2 + 10, t.s, { anchor: 'middle', size: 30, fade: false })
      else {
        blank(p, RR(cx, y, t.w, h, 12))
        ink(p, RR(cx, y, t.w, h, 12), { w: 2.6, t: 0 })
        lines(p, cx + t.w / 2, y + h / 2 + 6 - ((t.ls.length - 1) * 22) / 2, t.ls, { size, anchor: 'middle', lh: 22 })
      }
      cx += t.w + 6
    }
    y += h + 16
  }
}

const zahl: Draw = (g, ...a) => {
  const [value, label, y = 400] = a as unknown as [string, string, number?]
  const size = value.length <= 4 ? 120 : value.length <= 7 ? 86 : 60
  const t = text(g, 180, y, value, { anchor: 'middle', size, cls: 'bigt' })
  t.classList.remove('fade')
  lines(g, 180, y + 50, wrap(label, 30), { size: 18, anchor: 'middle' })
  for (const e of Array.from(g.querySelectorAll('text')).slice(1)) e.classList.add('fade'), e.setAttribute('style', `${e.getAttribute('style') ?? ''};--d:900ms`)
}

const punkte: Draw = (g, ...a) => {
  const [items, y0 = 250] = a as unknown as [string[], number?]
  let y = y0
  items.forEach((it, i) => {
    const p = pop(g, 200 + i * 650, '0% 50%')
    ink(p, L([24, y - 6], [40, y - 6]), { w: 3.4, t: 0 })
    const ls = wrap(it, 26)
    lines(p, 52, y, ls, { size: 19, lh: 26 })
    y += ls.length * 26 + 22
  })
}

const vergleich: Draw = (g, ...a) => {
  const [l, r, y0 = 250] = a as unknown as [string[], string[], number?]
  ink(g, L([180, y0 - 30], [180, y0 + 330]), { w: 2.2, t: 600 })
  ;[l, r].forEach((col, c) => {
    const x = c ? 190 : 20
    const p = pop(g, 200 + c * 700, '50% 0%')
    lines(p, x + 75, y0, wrap(col[0], 14), { size: 20, anchor: 'middle', cls: 'b' })
    let y = y0 + 48
    col.slice(1).forEach((it) => {
      const ls = wrap(it, 16)
      lines(p, x + 75, y, ls, { size: 16, anchor: 'middle', lh: 21 })
      y += ls.length * 21 + 16
    })
  })
}

/** Lage der vier Kacheln im Schlussbild */
const TILES: [number, number][] = [[16, 56], [184, 56], [16, 366], [184, 366]]
const TW = 160
const TH = 300

const kacheln: Draw = (g, ...a) => {
  const [labels] = a as unknown as [string[]]
  labels.forEach((lab, i) => {
    const [x, y] = TILES[i]
    ink(g, RR(x, y, TW, TH, 14), { w: 3, d: i * 250, t: 600 })
    const ls = wrap(lab, 20)
    const bg = group(g)
    blank(bg, RR(x + 6, y + 6, TW - 12, ls.length * 17 + 12, 8))
    lines(bg, x + TW / 2, y + 22, ls, { size: 13.5, anchor: 'middle', lh: 17 })
  })
}

export const COMMON: Record<string, Draw> = { formel, zahl, punkte, vergleich, kacheln }

export type RecapItem = { gfx: string; cls?: string; args?: unknown[]; draw?: string } | { pic: number; id: string; cam?: Cam }

/** Schlussbild: bis zu vier Grafiken/Bilder des Häppchens als 2 × 2-Bild mit Beschriftungen */
export function recap(items: RecapItem[], labels: string[]): Scene {
  const s = TW / 360
  const gfx: Record<string, GfxState> = { kacheln: { args: [labels] } }
  const pics: Record<string, PicState> = {}
  items.forEach((it, i) => {
    const [x, y] = TILES[i]
    if ('gfx' in it) gfx[it.gfx] = { tf: [s, x, y + 2], cls: it.cls, args: it.args, draw: it.draw, clip: true }
    else pics[it.id] = { img: it.pic, x: x + 12, y: y + 52, w: TW - 24, h: TH - 66, r: 10, cam: it.cam ?? [50, 45, 1.05] }
  })
  // feste Dauer: Bild erfassen (je Kachel) + Beschriftungen lesen
  const words = labels.join(' ').split(' ').length
  return { gfx, pics, dur: 2500 + items.length * 1200 + words * READ_MS }
}
