// Wissenshäppchen für „Entdecken“: je Häppchen ein durchgehender kleiner Film aus Szenen (lib/scene.ts) – Aufhänger,
// Erklär-Szenen mit gezeichneten Tusche-Animationen, Bildern und Gemälden, Evidenz-Stempel, dann die Zusammenfassung
// (views/FeedView.tsx). Inhalte vorab geschrieben (data/bites/*.ts), Bilder mit freier Lizenz von Wikimedia Commons,
// verkleinert in public/feed/ (scripts/feed-images.mjs).
import type { AreaId } from './plan'

/** Grundstimmung der Musik (lib/sound.ts) */
export type Mood = 'ruhig' | 'raetsel' | 'hell' | 'episch' | 'verspielt' | 'kosmisch' | 'dunkel'

/** Geräuschkulisse passend zum Thema (lib/sound.ts) */
export type Ambience = 'regen' | 'wellen' | 'wind' | 'herz' | 'uhr' | 'feuer' | 'stadt' | 'nacht' | 'blasen' | 'weltraum' | 'glocke' | 'atem'

export type Verdict = 'belegt' | 'umstritten' | 'hype'

export interface BiteImage {
  /** Datei in public/feed/ */
  file: string
  author: string
  license: string
}

/** Bildausschnitt: Mitte in % und Zoom (1 = ganzes Bild) */
export type Cam = [number, number, number]

/** Bühne 360 × 680; oben links (y < 48) liegt die Bereichs-Marke, oben rechts der Ton-Knopf */
export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface PicState extends Box {
  /** Index in images */
  img: number
  /** Eckenradius oder Oval */
  r?: number | 'oval'
  o?: number
  cam?: Cam
  /** Kamerafahrt bis zum Ende der Szene */
  cam2?: Cam
  /** Auftritt beim ersten Erscheinen */
  enter?: 'blot' | 'wipe' | 'fade'
  /** Startlage beim ersten Erscheinen (gleitet von dort an seinen Platz) */
  from?: Partial<Box> & { o?: number }
  /** Kleine Beschriftung unter dem Bild (Maler, Jahr) */
  cap?: string
  z?: number
}

/** Grafik aus Bite.draw: Skalierung + Verschiebung, Zustandsklassen für CSS-Übergänge */
export interface GfxState {
  tf?: [scale: number, x: number, y: number]
  o?: number
  cls?: string
  from?: { tf?: [number, number, number]; o?: number }
  args?: unknown[]
  /** Zeichnung aus Bite.draw, falls anders als der Name (gleiche Zeichnung zweimal mit anderen args) */
  draw?: string
}

export interface TextState {
  /** **fett** = Schlüsselwort (Tusche-Unterstrich), _kursiv_ = Zitat in Serifenschrift; leer im Aufhänger = hook */
  text?: string
  x: number
  y: number
  w: number
  kind?: 'hook' | 'para' | 'mid' | 'big' | 'cap'
  /** Weißer Kasten mit Tusche-Rand (Text über Bildern) */
  card?: boolean
  center?: boolean
}

export interface Scene {
  t?: TextState
  pics?: Record<string, PicState>
  gfx?: Record<string, GfxState>
  /** Evidenz-Stempel auf Höhe y; ohne t erscheint darunter `why` */
  verdict?: { y: number; ty?: number }
  /** feste Dauer (ms), sonst nach Lesezeit */
  dur?: number
}

export type Draw = (g: SVGGElement, ...args: never[]) => void

export interface Bite {
  id: string
  area: AreaId
  /** passende Session im Plan */
  day?: number
  hook: string
  mood: Mood
  ambience?: Ambience
  images: BiteImage[]
  /** gezeichnete Grafiken, in Szenen über ihren Namen eingesetzt */
  draw?: Record<string, Draw>
  scenes: Scene[]
  verdict: Verdict
  /** ein Satz zum Stempel */
  why: string
  summary: string[]
  sources: string[]
}

let cache: Promise<Bite[]> | null = null

/** Alle Häppchen (eigener Chunk, lädt erst beim Öffnen) */
export function loadBites(): Promise<Bite[]> {
  cache ??= import('./bites').then((m) => m.BITES)
  return cache
}

export const VERDICT_LABEL: Record<Verdict, string> = { belegt: 'Belegt', umstritten: 'Umstritten', hype: 'Hype' }

export function imgUrl(file: string): string {
  return `${import.meta.env.BASE_URL}feed/${file}`
}

const words = (s: string) => s.replace(/[*_]/g, '').split(/\s+/).filter(Boolean).length

/** Dauer einer Szene (ms): Aufhänger kurz, sonst Lesezeit (~200 Wörter/min) */
export function sceneDur(b: Bite, i: number): number {
  const s = b.scenes[i]
  if (s.dur) return s.dur
  if (s.t?.kind === 'hook') return 1700 + words(s.t.text ?? b.hook) * 110
  const txt = s.t?.text ?? (s.verdict ? b.why : '')
  return 1500 + words(txt) * 300 + (s.verdict ? 900 : 0)
}

/** Erwartete Gesamtdauer inklusive Zusammenfassung (für die Sehdauer-Wertung) */
export function biteDur(b: Bite): number {
  let d = 0
  for (let i = 0; i < b.scenes.length; i++) d += sceneDur(b, i)
  return d + 3000 + b.summary.reduce((a, x) => a + words(x) * 300, 0)
}
