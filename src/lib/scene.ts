// Abspieler für die Häppchen in „Entdecken“: Jede Szene beschreibt, wo Bilder, Grafiken und Text stehen.
// Was in zwei Szenen vorkommt, gleitet an seinen neuen Platz (Größe, Lage, Ausschnitt, Zustandsklassen der Grafik),
// Neues wird gezeichnet oder eingeblendet, Fehlendes blendet aus – so geht alles ineinander über statt Folie für Folie.
// Bühne 360 × 680, skaliert auf die verfügbare Fläche.
// Dauer je Szene: bis alles gezeichnet ist und der Text gelesen (READ_MS je Wort), dazu Zeit, die Grafik anzusehen
// (Grundzeit + ihre Beschriftungen) – komplexe Szenen stehen länger, einfache kürzer.
import { imgUrl, READ_MS, type Bite, type GfxState, type PicState, type Scene, type TextState } from '../data/feed'
import { B, E, RR, ink, mk } from './inkdraw'

export const STAGE_W = 360
export const STAGE_H = 680

export interface SceneSound {
  words?: () => void
  key?: () => void
}

type El = HTMLElement | SVGSVGElement

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
/** Beschriftungswörter einer Grafik; einzelne Ziffern (Achsen, Skalen) liest man nicht Wort für Wort */
const svgWords = (els: Iterable<Element>) => {
  let n = 0
  for (const e of els) n += (e.textContent ?? '').split(/\s+/).filter((w) => /[A-Za-zÄÖÜäöüß]{2,}|\d{3,}/.test(w)).length
  return n
}

/** Zeit, um eine neue Grafik / einen neuen Zustand / ein neues Bild zu erfassen (ms), dazu je Beschriftungswort READ_MS */
const LOOK_GFX = 1100
const LOOK_STATE = 500
const LOOK_PIC = 500

export class ScenePlayer {
  private stage: HTMLDivElement
  private els = new Map<string, El>()
  private gone = new Map<string, number>()
  private timers: number[] = []
  private ro: ResizeObserver
  private read = 0
  private look = 0
  private dur = 8000

  private host: HTMLElement
  private bite: Bite
  private sound: SceneSound

  constructor(host: HTMLElement, bite: Bite, sound: SceneSound = {}) {
    this.host = host
    this.bite = bite
    this.sound = sound
    this.stage = document.createElement('div')
    this.stage.className = 'stage'
    this.stage.innerHTML =
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
      '<pattern id="sh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-width="1.5"/></pattern>' +
      '<pattern id="sh2" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3.6" stroke="#000" stroke-width="1.3"/></pattern>' +
      '</defs></svg>'
    host.appendChild(this.stage)
    this.ro = new ResizeObserver(() => this.fit())
    this.ro.observe(host)
    this.fit()
  }

  private fit() {
    const w = this.host.clientWidth
    const h = this.host.clientHeight
    if (!w || !h) return
    const s = Math.min(w / STAGE_W, h / STAGE_H)
    this.stage.style.transform = `translate(${(w - STAGE_W * s) / 2}px, 0) scale(${s})`
  }

  destroy() {
    this.ro.disconnect()
    this.timers.forEach(clearTimeout)
    this.gone.forEach(clearTimeout)
    this.stage.remove()
  }

  pause(on: boolean) {
    this.stage.classList.toggle('paused', on)
  }

  private later(ms: number, f: () => void) {
    this.timers.push(window.setTimeout(f, ms))
  }

  /** Szene i zeigen und ihre Dauer (ms) zurückgeben; i = Anzahl Szenen → alles ausblenden (Zusammenfassung) */
  show(i: number): number {
    this.timers.forEach(clearTimeout)
    this.timers = []
    this.read = 0
    this.look = 0
    const sc: Scene = this.bite.scenes[i] ?? {}
    const want = new Map<string, () => void>()

    for (const [id, p] of Object.entries(sc.pics ?? {})) {
      want.set(`p:${id}`, () => this.pic(`p:${id}`, p))
      if (p.cap) want.set(`c:${id}`, () => this.text(`c:${id}`, { text: p.cap, x: p.x + 2, y: p.y + p.h + 6, w: p.w, kind: 'cap' }, p.o))
    }
    for (const [id, g] of Object.entries(sc.gfx ?? {})) want.set(`g:${id}`, () => this.gfx(`g:${id}`, g.draw ?? id, g))
    if (sc.t) want.set('t:main', () => this.text('t:main', { ...sc.t!, text: sc.t!.text ?? this.bite.hook }))

    for (const [id, e] of this.els) {
      if (want.has(id)) continue
      this.els.delete(id)
      if (e instanceof HTMLElement && e.classList.contains('st-txt')) e.classList.add('out')
      else {
        e.style.opacity = '0'
        if (!(e instanceof SVGSVGElement)) e.style.transform = 'scale(.97)'
      }
      this.gone.set(id, window.setTimeout(() => e.remove(), 800))
    }
    want.forEach((f) => f())
    this.dur = i >= this.bite.scenes.length ? Infinity : (sc.dur ?? this.measure())
    return this.dur
  }

  /** Bis alles gezeichnet und gelesen ist, plus Zeit zum Ansehen von Grafik und Bild */
  private measure(): number {
    void this.stage.offsetWidth
    let end = 0
    for (const a of this.stage.getAnimations({ subtree: true })) {
      const e = Number(a.effect?.getComputedTiming().endTime)
      if (Number.isFinite(e)) end = Math.max(end, e - Number(a.currentTime ?? 0))
    }
    return Math.round(Math.max(end + 500, this.read) + this.look)
  }

  private box(e: HTMLElement, p: { x?: number; y?: number; w?: number; h?: number; o?: number }) {
    if (p.x != null) e.style.left = `${p.x}px`
    if (p.y != null) e.style.top = `${p.y}px`
    if (p.w != null) e.style.width = `${p.w}px`
    if (p.h != null) e.style.height = `${p.h}px`
    e.style.opacity = String(p.o ?? 1)
  }

  private pic(id: string, p: PicState) {
    let e = this.els.get(id) as HTMLDivElement | undefined
    const fresh = !e
    if (fresh) this.look = Math.max(this.look, LOOK_PIC)
    const radius = p.r === 'oval' ? '50%' : `${p.r ?? 14}px`
    if (!e) {
      clearTimeout(this.gone.get(id))
      e = document.createElement('div')
      e.className = `st-el st-pic${p.enter ? ` st-${p.enter}` : ''}`
      e.style.zIndex = String(p.z ?? 1)
      const img = document.createElement('img')
      img.src = imgUrl(this.bite.images[p.img].file)
      img.alt = ''
      img.draggable = false
      e.appendChild(img)
      this.box(e, { ...p, ...(p.from ?? {}) })
      e.style.borderRadius = radius
      this.cam(img, p.cam ?? [50, 50, 1], 0)
      this.stage.appendChild(e)
      this.els.set(id, e)
      void e.offsetWidth
    }
    this.box(e, p)
    e.style.borderRadius = radius
    // Tusche-Rahmen in Zielgröße neu zeichnen
    e.querySelector('svg')?.remove()
    if (p.o !== 0 && p.r !== 0) {
      const s = mk('svg', { class: 'st-frame' }, e)
      const pts = p.r === 'oval' ? E(p.w / 2, p.h / 2, p.w / 2 - 1.6, p.h / 2 - 1.6) : RR(1.6, 1.6, p.w - 3.2, p.h - 3.2, Math.max(2, (p.r ?? 14) - 1))
      ink(s, pts, { w: 3.4, d: fresh ? 500 : 650, t: 600 })
    }
    const img = e.firstChild as HTMLImageElement
    if (p.cam) this.cam(img, p.cam, fresh ? 0 : 1200)
    if (p.cam2) {
      const c2 = p.cam2
      this.later(fresh ? 40 : 1200, () => this.cam(img, c2, Math.max(1600, (Number.isFinite(this.dur) ? this.dur : 8000) - (fresh ? 0 : 1200) + 900)))
    }
  }

  private cam(img: HTMLImageElement, c: [number, number, number], ms: number) {
    img.style.transitionDuration = `${ms}ms`
    img.style.objectPosition = `${c[0]}% ${c[1]}%`
    img.style.transformOrigin = `${c[0]}% ${c[1]}%`
    img.style.transform = `scale(${c[2]})`
  }

  private gfx(id: string, name: string, g: GfxState) {
    let e = this.els.get(id) as SVGSVGElement | undefined
    if (!e) {
      clearTimeout(this.gone.get(id))
      e = mk('svg', { class: 'st-gfx', viewBox: `0 0 ${STAGE_W} ${STAGE_H}` })
      const root = mk('g', {}, e)
      this.stage.appendChild(e)
      this.els.set(id, e)
      ;(this.bite.draw?.[name] as ((g: SVGGElement, ...a: unknown[]) => void) | undefined)?.(root, ...(g.args ?? []))
      this.tf(e, g.from ? { ...g, ...g.from } : g, '')
      void e.getBoundingClientRect()
      this.look += LOOK_GFX + svgWords(e.querySelectorAll('text')) * READ_MS
    } else {
      // neue Zustände (a1 … a6): Zeit für das, was dazukommt
      const old = new Set((e.getAttribute('class') ?? '').split(/\s+/))
      const added = (g.cls ?? '').split(/\s+/).filter((c) => /^a\d$/.test(c) && !old.has(c))
      if (added.length) {
        const sel = added.flatMap((c) => [`.x${c[1]} text`, `.f${c[1]} text`]).join(',')
        this.look += LOOK_STATE + svgWords(e.querySelectorAll(sel)) * READ_MS
      }
    }
    this.tf(e, g, g.cls ?? '')
  }

  private tf(e: SVGSVGElement, g: GfxState, cls: string) {
    const [s, x, y] = g.tf ?? [1, 0, 0]
    e.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    e.style.opacity = String(g.o ?? 1)
    if (cls != null) e.setAttribute('class', `st-gfx ${cls}`)
  }

  private text(id: string, p: TextState, o?: number) {
    const old = this.els.get(id) as HTMLDivElement | undefined
    const s = p.text ?? ''
    if (old && old.dataset.t === s && old.dataset.p === `${p.x},${p.y},${p.w}`) {
      old.style.opacity = String(o ?? 1)
      return
    }
    if (old) {
      old.classList.add('out')
      setTimeout(() => old.remove(), 450)
    }
    clearTimeout(this.gone.get(id))
    const e = document.createElement('div')
    e.className = `st-el st-txt ${p.kind ?? 'para'}${p.card ? ' card' : ''}${p.center ? ' center' : ''}`
    e.dataset.t = s
    e.dataset.p = `${p.x},${p.y},${p.w}`
    this.box(e, { x: p.x, y: p.y, w: p.w, o })
    const hook = p.kind === 'hook'
    const delay = hook ? 380 : old ? 280 : 480
    const step = hook ? 70 : p.kind === 'cap' ? 0 : 36
    const keys = this.words(e, s, delay, step)
    this.stage.appendChild(e)
    this.els.set(id, e)
    if (p.kind !== 'cap') this.read = Math.max(this.read, delay + words(s.replace(/[*_]/g, '')) * READ_MS)
    if (p.kind !== 'cap' && !hook) {
      this.later(delay, () => this.sound.words?.())
      keys.slice(0, 3).forEach((ms) => this.later(ms, () => this.sound.key?.()))
    }
    if (p.card)
      requestAnimationFrame(() => {
        const sv = mk('svg', { class: 'st-cardline' }, e)
        ink(sv, RR(0, 0, e.offsetWidth, e.offsetHeight, 14), { w: 3, t: 500 })
      })
  }

  /** Text Wort für Wort; **fett** mit Tusche-Unterstrich, _x_ in Serifenschrift. Gibt Zeitpunkte der Unterstriche zurück. */
  private words(e: HTMLElement, s: string, delay: number, step: number): number[] {
    const keys: number[] = []
    let i = 0
    const segs = s.split(/(\*\*[^*]+\*\*|_[^_]+_)/)
    for (let si = 0; si < segs.length; si++) {
      const seg = segs[si]
      if (!seg) continue
      const key = seg.startsWith('**')
      const voice = !key && seg.length > 2 && seg.startsWith('_') && seg.endsWith('_')
      if (key || voice) {
        const clean = key ? seg.slice(2, -2) : seg.slice(1, -1)
        const sp = document.createElement('span')
        sp.className = `w ${key ? 'key' : 'voice'}`
        sp.style.animationDelay = `${delay + i * step}ms`
        const kw = document.createElement('span')
        if (key) kw.className = 'kw'
        kw.textContent = clean
        sp.appendChild(kw)
        i += words(clean)
        if (key) {
          const at = delay + i * step + 250
          keys.push(at)
          const sv = mk('svg', { class: 'key-line', viewBox: '0 0 100 8', preserveAspectRatio: 'none', style: `animation-delay:${at}ms` }, kw)
          ink(sv, B([1, 5.4], [30, 2.6], [64, 6.4], [99, 3.4]), { w: 2.6, t: 0, p: 0.05 })
        }
        // Satzzeichen direkt dahinter nicht in die nächste Zeile umbrechen
        const punct = (segs[si + 1] ?? '').match(/^[^\s]+/)
        if (punct) {
          sp.appendChild(document.createTextNode(punct[0]))
          segs[si + 1] = segs[si + 1].slice(punct[0].length)
        }
        e.appendChild(sp)
        continue
      }
      for (const w of seg.split(/(\s+)/)) {
        if (!w) continue
        if (/\s/.test(w)) {
          e.appendChild(document.createTextNode(' '))
          continue
        }
        const sp = document.createElement('span')
        sp.className = 'w'
        sp.textContent = w
        sp.style.animationDelay = `${delay + i++ * step}ms`
        e.appendChild(sp)
      }
    }
    return keys
  }
}
