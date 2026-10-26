import { AREAS, MAP_AREAS, type AreaId } from '../data/plan'

// Gespeicherte Wahl des Wegs nach Tag 90 (focus.choice): 'breit' | 'spezial:<Fach>' | 'hybrid:<Fach>'

export type PathMode = 'breit' | 'spezial' | 'hybrid'

export interface PathChoice {
  mode: PathMode
  area?: AreaId
}

/** Chemie und Nervensystem (nur Phase 1) gehen in der Vertiefung in Physik bzw. Leben & Körper auf */
export function deepArea(a: AreaId): AreaId {
  return a === 'CHE' ? 'PHY' : a === 'NERV' ? 'BIO' : a
}

/** gespeicherte Wahl lesen – alte Werte: 'breit' oder Bereichs-ID (= spezialisieren) */
export function parseChoice(c?: string): PathChoice | null {
  if (!c) return null
  if (c === 'breit') return { mode: 'breit' }
  const [m, a] = c.includes(':') ? c.split(':') : ['spezial', c]
  if (m !== 'spezial' && m !== 'hybrid') return null
  const area = a && a in AREAS ? deepArea(a as AreaId) : undefined
  return { mode: m, area: area && MAP_AREAS.includes(area) ? area : undefined }
}

export function choiceKey(c: PathChoice): string {
  return c.mode === 'breit' ? 'breit' : `${c.mode}:${c.area ?? ''}`
}
