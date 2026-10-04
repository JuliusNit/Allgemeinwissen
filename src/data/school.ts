import { DAYS, type Block } from './plan'

// Wissensstand: Schule (mit Klassenstufe), Studium oder Ausbildung/Beruf.
// Sessions, deren Kern Schulstoff ist, werden je nach Stand zu Wiederholungstagen:
// - Studium/Beruf: aller Schulstoff (bis Abitur) ist Wiederholung.
// - Schule Klasse G: Stoff der abgeschlossenen Klassen (< G) ist Wiederholung, der Rest baut darauf auf.

export type Level = { kind: 'schule'; grade: number } | { kind: 'studium' } | { kind: 'beruf' }

export const GRADES = [5, 6, 7, 8, 9, 10, 11, 12, 13]

/**
 * Klassenstufe, in der der Kern einer Session typischerweise unterrichtet wird (Gymnasium G9,
 * grob gemittelt über die Bundesländer). Fehlt der Tag, ist es kein regulärer Schulstoff.
 */
export const SCHOOL_GRADE: Partial<Record<number, number>> = {
  1: 11, 2: 11, 3: 12, 4: 12, 5: 9,
  7: 10, 8: 9, 9: 5, 10: 10, 11: 9, 15: 9,
  18: 6, 19: 10, 20: 6, 21: 6, 23: 10, 24: 6, 25: 8, 26: 6, 27: 11, 28: 10, 29: 7,
  31: 7, 32: 7, 33: 8, 35: 7, 37: 9, 39: 8, 40: 8,
  44: 8, 47: 10, 48: 11, 49: 12, 50: 9, 51: 9, 52: 9, 53: 9, 54: 12,
  57: 9, 58: 10, 61: 10, 64: 10, 66: 10, 67: 11,
  71: 9, 72: 8, 75: 9, 77: 9, 81: 12,
  86: 12, 88: 10,
}

export function isRepeat(level: Level | undefined, day: number): boolean {
  const g = SCHOOL_GRADE[day]
  if (!level || g === undefined) return false
  return level.kind === 'schule' ? g < level.grade : true
}

export function repeatDays(level: Level | undefined): number[] {
  return DAYS.filter((d) => isRepeat(level, d.day)).map((d) => d.day)
}

export function levelLabel(l: Level): string {
  return l.kind === 'schule' ? `Schule, Klasse ${l.grade}` : l.kind === 'studium' ? 'Studium' : 'Ausbildung / Beruf'
}

export function parseLevel(x: unknown): Level | undefined {
  const o = x as Partial<{ kind: string; grade: number }> | null
  if (!o || typeof o !== 'object') return undefined
  if (o.kind === 'schule' && typeof o.grade === 'number' && GRADES.includes(o.grade)) return { kind: 'schule', grade: o.grade }
  if (o.kind === 'studium' || o.kind === 'beruf') return { kind: o.kind }
  return undefined
}

/** Phase 1 heisst nur dann "Wiederholung", wenn sie fuer diesen Stand wirklich Schulstoff ist */
export function blockName(b: Block, level: Level | undefined): string {
  if (b.id !== 0) return b.name
  const all = DAYS.filter((d) => d.block === 0).every((d) => isRepeat(level, d.day))
  return all ? b.name : 'Phase 1 – Grundlagen'
}
