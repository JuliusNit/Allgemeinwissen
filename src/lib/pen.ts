// Tusche-Stift fuer alle CSS-Raender: Knoepfe, Felder, Chips, Trennlinien usw. bekommen dieselbe Optik wie die Muenzen
// auf Home. Die CSS-Regeln bleiben die einzige Quelle (Breite, Farbe, Radius, gestrichelt) – der Stift liest sie aus,
// macht den CSS-Rand unsichtbar und legt den Rand als Tusche-SVG in den Hintergrund (--pen-bg).
// Knoepfe mit --pen-rim > 0 bekommen wie die Muenzen einen Rand mit Schattenstrichen darunter; :active zeigt --pen-bg-down.
// Neue Elemente mit Rand: Klasse in SELECTOR aufnehmen (oder data-pen setzen) – sonst nichts.

import { dashes, line, outline, roundRect, type Pt, type Stroke } from './ink'

const SELECTOR = [
  '[data-pen]',
  '.btn',
  'input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file])',
  'textarea',
  'select',
  '.chip',
  '.notice',
  '.advice',
  '.level-opt',
  '.onb-feature',
  '.status',
  '.stamp',
  '.msg',
  '.avatar-edit',
  '.md pre',
  '.md hr',
  '.pw-bar span',
  '.dots span',
  '.onb-dots button',
  '.video-play',
  '.player',
  '.bottom',
  '.nav-slot',
  '.tabs',
  '.tabs button',
  '.channel-head',
  '.watch-bar',
  '.watch-actions',
  '.watch-notes',
  '.vnote-input',
  '.name-input',
  '.flash-a',
  '.exam-result',
  '.videos li',
  '.vnotes li',
  '.qa-list > li',
  '.friend-row',
  '.onb-rating',
  '.lp li',
].join(',')

/** CSS-Randbreite → Tusche-Grundbreite: kraeftiger als der CSS-Rand, wie die Muenzen auf Home */
const K = 1.45
const PRESSURE = 0.16

const f = (v: number) => (Math.round(v * 10) / 10).toString()

function visible(color: string) {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return color !== 'transparent'
  const parts = m[1].split(/[ ,/]+/).filter(Boolean)
  return parts.length < 4 || parseFloat(parts[3]) > 0
}

function paths(strokes: Stroke[], base: number, color: string) {
  return strokes.map((s) => `<path d="${outline(s, base)}" fill="${color}" fill-rule="${s.closed ? 'evenodd' : 'nonzero'}"/>`).join('')
}

function radius(v: string, w: number, h: number) {
  const n = parseFloat(v) || 0
  return v.endsWith('%') ? (n / 100) * Math.min(w, h) : n
}

function svg(w: number, h: number, body: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}")`
}

/** Seitenlinie mitten im CSS-Rand */
function side(a: Pt, b: Pt, seed: number): Stroke {
  const s = line(a, b)
  const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.4))
  s.pts = Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n] as Pt)
  s.p = PRESSURE
  s.seed = seed
  return s
}

function draw(el: HTMLElement): { up: string; down?: string } | null {
  const w = el.offsetWidth
  const h = el.offsetHeight
  if (w < 2 || h < 2) return null
  const cs = getComputedStyle(el)
  const k = K * (parseFloat(cs.getPropertyValue('--pen-k')) || 1)
  const rim = parseFloat(cs.getPropertyValue('--pen-rim')) || 0
  const fill = cs.getPropertyValue('--pen-fill').trim()
  const seed = (w * 7 + h * 13) % 17
  const bw = { t: parseFloat(cs.borderTopWidth), r: parseFloat(cs.borderRightWidth), b: parseFloat(cs.borderBottomWidth), l: parseFloat(cs.borderLeftWidth) }
  const on = {
    t: bw.t > 0 && cs.borderTopStyle !== 'none' && visible(cs.borderTopColor),
    r: bw.r > 0 && cs.borderRightStyle !== 'none' && visible(cs.borderRightColor),
    b: bw.b > 0 && cs.borderBottomStyle !== 'none' && visible(cs.borderBottomColor),
    l: bw.l > 0 && cs.borderLeftStyle !== 'none' && visible(cs.borderLeftColor),
  }
  const color = cs.borderTopColor
  const r = radius(cs.borderTopLeftRadius, w, h)

  // ringsum gleicher Rand → ein geschlossener Strich (bei Knoepfen mit Muenzrand)
  if (on.t && on.r && on.b && on.l) {
    const base = bw.t * k
    const pad = bw.t / 2
    const dashed = cs.borderTopStyle === 'dashed' || cs.borderTopStyle === 'dotted'
    const box = (y: number, hh: number) => {
      const s = roundRect(pad, y + pad, w - 2 * pad, hh - 2 * pad, r, undefined, 1.4)
      s.p = PRESSURE
      s.seed = seed
      return dashed ? dashes(s, 7, 5) : [s]
    }
    const rr = Math.max(0, Math.min(r, (w - 2 * pad) / 2, (h - rim - 2 * pad) / 2))
    const rect = (y: number, hh: number, c: string) =>
      `<rect x="${f(pad)}" y="${f(y + pad)}" width="${f(w - 2 * pad)}" height="${f(hh - 2 * pad)}" rx="${f(rr)}" fill="${c}"/>`
    const face = (y: number) => (fill ? rect(y, h - rim, fill) : '') + paths(box(y, h - rim), base, color)
    if (!rim) return { up: svg(w, h, face(0)) }

    // Muenzrand: Unterkante um rim versetzt, dazwischen senkrechte Schattenstriche wie auf Home
    const low = roundRect(pad, rim + pad, w - 2 * pad, h - rim - 2 * pad, r, undefined, 1.4)
    low.p = PRESSURE
    low.seed = seed + 3
    const shade: Stroke[] = []
    for (let x = pad + 4.5; x <= w - pad - 4.5; x += 4.5) {
      const dx = Math.min(x - pad, w - pad - x)
      const y = h - rim - pad - (dx < rr ? rr - Math.sqrt(rr * rr - (rr - dx) ** 2) : 0)
      shade.push(line([x, y + 1.2], [x, y + rim - 0.3], 0.42))
    }
    const up = rect(rim, h - rim, cs.getPropertyValue('--paper').trim() || '#fff') + paths([low], base * 0.9, color) + paths(shade, base, color) + face(0)
    return { up: svg(w, h, up), down: svg(w, h, face(rim)) }
  }

  // einzelne Seiten (Trennlinien)
  const strokes: { s: Stroke; base: number; c: string }[] = []
  if (on.t) strokes.push({ s: side([0, bw.t / 2], [w, bw.t / 2], seed), base: bw.t * k, c: cs.borderTopColor })
  if (on.b) strokes.push({ s: side([0, h - bw.b / 2], [w, h - bw.b / 2], seed + 1), base: bw.b * k, c: cs.borderBottomColor })
  if (on.l) strokes.push({ s: side([bw.l / 2, 0], [bw.l / 2, h], seed + 2), base: bw.l * k, c: cs.borderLeftColor })
  if (on.r) strokes.push({ s: side([w - bw.r / 2, 0], [w - bw.r / 2, h], seed + 3), base: bw.r * k, c: cs.borderRightColor })
  if (!strokes.length) return null
  const dashed = cs.borderTopStyle === 'dashed' || cs.borderBottomStyle === 'dashed'
  return { up: svg(w, h, strokes.map((x) => paths(dashed ? dashes(x.s, 7, 5) : [x.s], x.base, x.c)).join('')) }
}

const last = new WeakMap<HTMLElement, string>()
let ro: ResizeObserver | null = null

function apply(el: HTMLElement) {
  // eigenen Stift kurz abnehmen, damit die echten CSS-Raender gelesen werden
  el.classList.remove('pen')
  const res = draw(el)
  if (!res) {
    el.style.removeProperty('--pen-bg')
    el.style.removeProperty('--pen-bg-down')
    last.delete(el)
    return
  }
  el.classList.add('pen')
  if (last.get(el) === res.up + res.down) return
  last.set(el, res.up + res.down)
  el.style.setProperty('--pen-bg', res.up)
  if (res.down) el.style.setProperty('--pen-bg-down', res.down)
  else el.style.removeProperty('--pen-bg-down')
}

function scan(root: Element) {
  const list: HTMLElement[] = []
  if (root instanceof HTMLElement && root.matches(SELECTOR)) list.push(root)
  root.querySelectorAll<HTMLElement>(SELECTOR).forEach((e) => list.push(e))
  for (const el of list) {
    if (!last.has(el)) ro?.observe(el)
    apply(el)
  }
}

/** Einmal beim Start aufrufen: zeichnet alle passenden Elemente und haelt sie aktuell */
export function startPen() {
  ro = new ResizeObserver((entries) => entries.forEach((e) => apply(e.target as HTMLElement)))
  let busy = false
  const mo = new MutationObserver((muts) => {
    if (busy) return
    busy = true
    const roots = new Set<Element>()
    for (const m of muts) {
      if (m.type === 'attributes') roots.add(m.target as Element)
      else m.addedNodes.forEach((n) => n instanceof Element && roots.add(n))
    }
    roots.forEach(scan)
    mo.takeRecords()
    busy = false
  })
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'disabled'] })
  scan(document.body)
  // Webfonts aendern Groessen erst spaeter
  document.fonts?.ready.then(() => scan(document.body))
}
