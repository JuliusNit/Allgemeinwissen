// Wissenshäppchen für „Entdecken“: je Häppchen Aufhänger → 3 Absätze → Evidenz-Stempel → Zusammenfassung,
// abgespielt wie ein Video (views/FeedView.tsx). Inhalte vorab geschrieben (data/bites/*.ts), Bilder sind Fotos mit
// freier Lizenz von Wikimedia Commons, verkleinert in public/feed/ (scripts/feed-images.mjs).
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

export interface BiteSlide {
  /** kurzer Absatz, **fett** = Schlüsselwort (wird mit Tusche unterstrichen) */
  text: string
  /** Bild (Index in images), sonst das vorige */
  img?: number
  /** Kamerafahrt: Bildausschnitt-Mitte in % und Zoom (1 = ganzes Bild) */
  cam?: [number, number, number]
}

export interface Bite {
  id: string
  area: AreaId
  /** passende Session im Plan */
  day?: number
  hook: string
  mood: Mood
  ambience?: Ambience
  images: BiteImage[]
  /** Kamera auf dem Aufhänger-Bild */
  cam?: [number, number, number]
  slides: [BiteSlide, BiteSlide, BiteSlide]
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
