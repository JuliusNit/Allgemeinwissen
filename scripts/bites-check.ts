// Prüfseite für die Häppchen (nur Entwicklung, scripts/bites-check.mjs): rendert alle Szenen eines Häppchens im
// Endzustand nebeneinander und sucht Überschneidungen – Text auf Tusche-Strich, Schraffur oder Bild, Text auf Text,
// Grafik außerhalb der Bühne oder unter Bereichs-Marke/Ton-Knopf. Aufruf: /scripts/bites-check.html?id=<id>
import '../src/index.css'
import { loadBites, type Bite } from '../src/data/feed'
import { ScenePlayer, STAGE_H, STAGE_W } from '../src/lib/scene'

export interface Issue {
  scene: number
  kind: string
  what: string
}

type R = { x: number; y: number; w: number; h: number }

const finish = (root: ParentNode & { getAnimations?: Element['getAnimations'] }) => {
  for (const a of document.getAnimations()) {
    const t = a.effect?.getComputedTiming()
    if (t && Number.isFinite(Number(t.endTime))) a.finish()
  }
  void root
}

/** Sichtbarkeit inkl. Vorfahren (Zustandsklassen blenden über opacity/scale aus) */
function visible(e: Element, stop: Element): boolean {
  for (let n: Element | null = e; n && n !== stop; n = n.parentElement) {
    const cs = getComputedStyle(n)
    if (Number(cs.opacity) < 0.05 || cs.display === 'none' || cs.visibility === 'hidden') return false
    if (n instanceof HTMLElement && n.classList.contains('out')) return false
  }
  const r = e.getBoundingClientRect()
  return r.width > 0.5 && r.height > 0.5
}

const rel = (r: DOMRect, o: DOMRect): R => ({ x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height })
const hit = (a: R, b: R) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
const label = (s: string | null | undefined) => (s ?? '').trim().slice(0, 40)

function check(stage: HTMLElement, scene: number): Issue[] {
  const out: Issue[] = []
  const o = stage.getBoundingClientRect()
  const add = (kind: string, what: string) => out.push({ scene, kind, what })

  const texts: { r: R; name: string; halo: boolean; svg: boolean; sc: R[] }[] = []
  // HTML-Text Wort für Wort
  for (const t of stage.querySelectorAll<HTMLElement>('.st-txt')) {
    if (!visible(t, stage)) continue
    const card = t.classList.contains('card')
    for (const w of t.querySelectorAll<HTMLElement>('.w')) {
      for (const cr of w.getClientRects()) {
        const r = rel(cr, o)
        texts.push({ r, name: `„${label(w.textContent)}“`, halo: card, svg: false, sc: [{ x: r.x + 1, y: r.y + r.h * 0.18, w: r.w - 2, h: r.h * 0.64 }] })
      }
    }
    if (card) texts.push({ r: rel(t.getBoundingClientRect(), o), name: 'Textkasten', halo: true, svg: false, sc: [] })
  }
  for (const t of stage.querySelectorAll<SVGTextElement>('.st-gfx text')) {
    if (!visible(t, stage) || !t.textContent?.trim()) continue
    const r = rel(t.getBoundingClientRect(), o)
    texts.push({ r, name: `„${label(t.textContent)}“`, halo: t.classList.contains('halo'), svg: true, sc: [{ x: r.x + 1, y: r.y + r.h * 0.22, w: r.w - 2, h: r.h * 0.6 }] })
  }

  // Text auf Text
  for (let i = 0; i < texts.length; i++)
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i]
      const b = texts[j]
      if (a.name === 'Textkasten' || b.name === 'Textkasten') continue
      if (!a.svg && !b.svg) continue
      const ia = a.sc[0] ?? a.r
      const ib = b.sc[0] ?? b.r
      if (hit(ia, ib)) add('Text×Text', `${a.name} / ${b.name}`)
    }
  // HTML-Text untereinander (verschiedene Textblöcke)
  const blocks = [...stage.querySelectorAll<HTMLElement>('.st-txt')].filter((t) => visible(t, stage))
  for (let i = 0; i < blocks.length; i++)
    for (let j = i + 1; j < blocks.length; j++) {
      const a = rel(blocks[i].getBoundingClientRect(), o)
      const b = rel(blocks[j].getBoundingClientRect(), o)
      if (hit({ x: a.x, y: a.y + 3, w: a.w, h: a.h - 6 }, { x: b.x, y: b.y + 3, w: b.w, h: b.h - 6 })) add('Text×Text', `${label(blocks[i].textContent)} / ${label(blocks[j].textContent)}`)
    }

  // Text auf Bild
  for (const p of stage.querySelectorAll<HTMLElement>('.st-pic')) {
    if (!visible(p, stage)) continue
    const pr = rel(p.getBoundingClientRect(), o)
    for (const t of texts) if (!t.halo && t.sc.some((s) => hit(s, pr))) add('Text×Bild', t.name)
  }

  // Text auf Strich / Schraffur
  const paths = [...stage.querySelectorAll<SVGPathElement>('.st-gfx path')].filter((p) => !p.closest('mask') && visible(p, stage))
  // weiße Flächen verdecken, was vor ihnen gezeichnet wurde
  const blanks = paths.filter((p) => p.getAttribute('fill') === '#fff')
  const covered = (p: SVGPathElement, sx: number, sy: number) =>
    blanks.some((b) => {
      if (!(p.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)) return false
      const bm = b.getScreenCTM()?.inverse()
      return !!bm && b.isPointInFill(new DOMPoint(sx, sy).matrixTransform(bm))
    })
  for (const p of paths) {
    const hatchFill = (p.getAttribute('fill') ?? '').startsWith('url(')
    const white = p.getAttribute('fill') === '#fff'
    if (white) continue
    let pr = rel(p.getBoundingClientRect(), o)
    const m = p.getScreenCTM()?.inverse()
    if (!m) continue
    // zugeschnittene Gruppen (clip-path mit Rechteck): nur der sichtbare Ausschnitt zählt
    const cg = p.closest('[clip-path]')
    const cr = cg && document.getElementById((cg.getAttribute('clip-path') ?? '').replace(/^url\(#|\)$/g, ''))?.querySelector('rect')
    if (cr) {
      const sm = (cg as SVGGraphicsElement).getScreenCTM()!
      const a = new DOMPoint(+cr.getAttribute('x')!, +cr.getAttribute('y')!).matrixTransform(sm)
      const b = new DOMPoint(+cr.getAttribute('x')! + +cr.getAttribute('width')!, +cr.getAttribute('y')! + +cr.getAttribute('height')!).matrixTransform(sm)
      const x0 = Math.max(pr.x, a.x - o.left)
      const y0 = Math.max(pr.y, a.y - o.top)
      pr = { x: x0, y: y0, w: Math.min(pr.x + pr.w, b.x - o.left) - x0, h: Math.min(pr.y + pr.h, b.y - o.top) - y0 }
      if (pr.w <= 0 || pr.h <= 0) continue
    }
    for (const t of texts) {
      if (hatchFill && t.halo) continue
      for (const s of t.sc) {
        if (!hit(s, pr)) continue
        let n = 0
        for (let x = s.x + 1; x < s.x + s.w; x += 2)
          for (let y = s.y + 1; y < s.y + s.h; y += 2) {
            if (x < pr.x || x > pr.x + pr.w || y < pr.y || y > pr.y + pr.h) continue
            const q = new DOMPoint(x + o.left, y + o.top).matrixTransform(m)
            if (p.isPointInFill(q) && !covered(p, x + o.left, y + o.top)) n++
          }
        if (n > (hatchFill ? 6 : 1)) add(hatchFill ? 'Text×Schraffur' : 'Text×Strich', `${t.name} (${n})`)
      }
    }
  }

  // Rand: außerhalb der Bühne oder unter Bereichs-Marke (oben links) / Ton-Knopf (oben rechts)
  const zones: [R, string][] = [
    [{ x: 0, y: 0, w: 150, h: 44 }, 'unter der Bereichs-Marke'],
    [{ x: 312, y: 0, w: 48, h: 54 }, 'unter dem Ton-Knopf'],
  ]
  const things: [R, string][] = [
    ...texts.filter((t) => t.name !== 'Textkasten').map((t) => [t.sc[0] ?? t.r, t.name] as [R, string]),
    ...[...stage.querySelectorAll<HTMLElement>('.st-pic')].filter((p) => visible(p, stage)).map((p) => [rel(p.getBoundingClientRect(), o), 'Bild'] as [R, string]),
  ]
  for (const [r, n] of things) {
    if (r.x < -2 || r.y < -2 || r.x + r.w > STAGE_W + 2 || r.y + r.h > STAGE_H + 2) add('Rand', `${n} ragt aus der Bühne (${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.w)}×${Math.round(r.h)})`)
    for (const [z, zn] of zones) if (hit(r, z)) add('Rand', `${n} ${zn}`)
  }
  for (const x of doubled(stage)) add('Doppelt', x)
  return [...new Map(out.map((x) => [`${x.kind}|${x.what}`, x])).values()]
}

// Doppelter Text: Beschriftung in der Grafik, die den Erzähltext wiederholt (Wortstämme, ohne Füllwörter).
// Einzelne Begriffe an Pfeilen/Teilen sind erlaubt, ganze Sätze oder Satzteile nicht.
const STOP = new Set('aber alle allem auch auf aus bei beim bis das dass dem den der des die dies diese dieser doch dort durch ein eine einem einen einer eines erst etwa für hat hier ihr ihre immer ist jede jeder kann kein keine mal man mehr mit muss nach nicht noch nur oder ohne schon sehr sich sie sind über um und uns unter vom von vor war was weil wenn wer wie wird wo zu zum zur sein seine wir dann denn also ganz viel viele'.split(' '))
const stem = (w: string) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, '').slice(0, 6)
const content = (s: string) =>
  s
    .split(/[\s·–—/]+/)
    .map((w) => w.replace(/[„“”"?!.,:;()…*_]/g, ''))
    .filter((w) => w.length >= 3 && !STOP.has(w.toLowerCase()))
    .map(stem)

function doubled(stage: HTMLElement): string[] {
  const main = [...stage.querySelectorAll<HTMLElement>('.st-txt:not(.cap)')]
    .filter((t) => visible(t, stage))
    .map((t) => t.textContent ?? '')
    .join(' ')
  const have = new Set(content(main))
  const out: string[] = []
  const labels = [
    ...[...stage.querySelectorAll<SVGTextElement>('.st-gfx text')].filter((t) => visible(t, stage)).map((t) => t.textContent ?? ''),
    ...[...stage.querySelectorAll<HTMLElement>('.st-txt.cap')].filter((t) => visible(t, stage)).map((t) => t.textContent ?? ''),
  ]
  for (const l of labels) {
    const c = content(l)
    const n = c.filter((w) => have.has(w)).length
    if (n >= 2 && (n / c.length >= 0.5 || c.length >= 3)) out.push(`„${label(l)}“`)
  }
  return out
}

/** Nur doppelten Text suchen (schnell, ohne Kontaktbogen) */
async function dups(b: Bite): Promise<Issue[]> {
  const out: Issue[] = []
  const host = document.createElement('div')
  host.style.cssText = `position:absolute;left:0;top:0;width:${STAGE_W}px;height:${STAGE_H}px`
  document.body.appendChild(host)
  const p = new ScenePlayer(host, b)
  for (let i = 0; i < b.scenes.length; i++) {
    p.show(i)
    finish(host)
    await Promise.resolve()
    finish(host)
    const stage = host.querySelector('.stage') as HTMLElement
    // ausblendende Reste der vorigen Szene nicht mitzählen
    stage.querySelectorAll('.st-txt.out').forEach((e) => e.remove())
    for (const x of doubled(stage)) out.push({ scene: i + 1, kind: 'Doppelt', what: x })
  }
  p.destroy()
  host.remove()
  return out
}

async function run(b: Bite): Promise<Issue[]> {
  const sheet = document.getElementById('sheet')!
  sheet.innerHTML = ''
  sheet.style.cssText = 'display:flex;flex-wrap:wrap;gap:14px;padding:10px;width:' + (6 * (STAGE_W + 14) + 10) + 'px;font:600 13px system-ui'
  const players: [ScenePlayer, HTMLElement][] = []
  for (let i = 0; i < b.scenes.length; i++) {
    const cell = document.createElement('div')
    cell.innerHTML = `<div style="height:18px">${i + 1}</div>`
    const host = document.createElement('div')
    host.style.cssText = `position:relative;width:${STAGE_W}px;height:${STAGE_H}px;outline:1px solid #bbb;overflow:hidden`
    cell.appendChild(host)
    sheet.appendChild(cell)
    const p = new ScenePlayer(host, b)
    players.push([p, host])
    for (let k = 0; k <= i; k++) {
      p.show(k)
      finish(host)
    }
  }
  // countUp und verzögerte Kamerafahrten laufen über Timer
  await new Promise((r) => setTimeout(r, 2600))
  finish(sheet)
  await new Promise((r) => setTimeout(r, 900))
  finish(sheet)
  return players.flatMap(([, host], i) => check(host.querySelector('.stage') as HTMLElement, i + 1))
}

/** Dauer je Szene (ms), wie beim Abspielen gemessen: vorige Szenen im Endzustand, dann Szene i zeigen */
async function durations(b: Bite): Promise<number[]> {
  const host = document.createElement('div')
  host.style.cssText = `position:absolute;left:-2000px;width:${STAGE_W}px;height:${STAGE_H}px`
  document.body.appendChild(host)
  const out: number[] = []
  for (let i = 0; i < b.scenes.length; i++) {
    const p = new ScenePlayer(host, b)
    for (let k = 0; k < i; k++) {
      p.show(k)
      finish(host)
    }
    out.push(p.show(i))
    p.destroy()
  }
  host.remove()
  return out
}

declare global {
  interface Window {
    biteIds: (neu?: boolean) => Promise<string[]>
    checkBite: (id: string) => Promise<Issue[]>
    biteDurations: (id: string) => Promise<number[]>
    dupBite: (id: string) => Promise<Issue[]>
  }
}

/** Ansicht für kleine Fenster: Szenen i … i+n−1 vorn in einer Reihe (nach checkBite) */
;(window as unknown as { cell: (i: number, n?: number, z?: number) => void }).cell = (i, n = 3, z = 0.75) => {
  const s = document.getElementById('sheet')!
  Object.assign(s.style, { zoom: String(z), width: 'max-content', flexWrap: 'nowrap' })
  ;[...s.children].forEach((c, k) => ((c as HTMLElement).style.order = k >= i - 1 && k < i - 1 + n ? String(k - 100) : '0'))
  window.scrollTo(0, 0)
}

window.dupBite = async (id) => dups((await loadBites()).find((x) => x.id === id)!)

window.biteDurations = async (id) => durations((await loadBites()).find((x) => x.id === id)!)

window.biteIds = async (neu) => (neu ? (await import('../src/data/bites')).AHA : await loadBites()).map((b) => b.id)
window.checkBite = async (id) => {
  const b = (await loadBites()).find((x) => x.id === id)
  if (!b) throw new Error(`Häppchen ${id} fehlt`)
  return run(b)
}
