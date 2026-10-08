import { DAYS, type Block } from './plan'
import type { FachId } from './lehrplan'

// Wissensstand: Schule (mit Klassenstufe, Gymnasium Bayern), Studium oder Ausbildung/Beruf.
// Sessions, deren Kern Schulstoff ist, werden je nach Stand zu Wiederholungstagen:
// - Studium/Beruf: aller Schulstoff (bis Abitur) ist Wiederholung.
// - Schule Klasse G: Stoff der abgeschlossenen Klassen (< G) ist Wiederholung, der Rest baut darauf auf.

export type Level = { kind: 'schule'; grade: number } | { kind: 'studium' } | { kind: 'beruf' }

export const GRADES = [5, 6, 7, 8, 9, 10, 11, 12, 13]

/**
 * Jahrgangsstufe, bis zu der der Kern einer Session im bayerischen LehrplanPLUS (Gymnasium G9) unterrichtet
 * ist (Details: lehrplan.ts). Fehlt der Tag, ist es kein regulärer Schulstoff (oder nur in Teilen).
 */
export const SCHOOL_GRADE: Partial<Record<number, number>> = {
  1: 13, 2: 10, 3: 13, 4: 13, 5: 10,
  7: 10, 8: 9, 9: 7, 10: 9, 11: 10, 13: 10, 15: 10,
  18: 6, 19: 11, 20: 6, 21: 6, 23: 12, 24: 6, 25: 10, 26: 5, 27: 9, 28: 10, 29: 10,
  31: 7, 32: 7, 33: 10, 34: 10, 35: 7, 37: 10, 39: 10, 40: 8,
  44: 8, 47: 10, 48: 13, 50: 8, 51: 10, 52: 8, 53: 10, 54: 13,
  57: 9, 58: 13, 61: 10, 64: 10, 66: 10, 67: 12,
  71: 10, 72: 9, 75: 10, 77: 11,
  86: 10, 88: 10,
}

/** Schulfach, unter dem eine Schulstoff-Session in der Grundwiederholung erscheint */
export const DAY_FACH: Partial<Record<number, FachId>> = {
  1: 'bio', 2: 'che', 3: 'bio', 4: 'bio', 5: 'phy',
  7: 'gesch', 8: 'phy', 9: 'geo', 10: 'bio', 11: 'wr', 13: 'kunst', 15: 'pug',
  18: 'gesch', 19: 'phy', 20: 'gesch', 21: 'gesch', 23: 'bio', 24: 'gesch', 25: 'mathe', 26: 'rel', 27: 'phy', 28: 'wr', 29: 'geo',
  31: 'gesch', 32: 'rel', 33: 'bio', 34: 'kunst', 35: 'gesch', 37: 'phy', 39: 'bio', 40: 'gesch',
  44: 'gesch', 47: 'wr', 48: 'deu', 50: 'gesch', 51: 'kunst', 52: 'gesch', 53: 'bio', 54: 'mathe',
  57: 'gesch', 58: 'phy', 61: 'gesch', 64: 'pug', 66: 'gesch', 67: 'wr',
  71: 'geo', 72: 'rel', 75: 'wr', 77: 'geo',
  86: 'bio', 88: 'deu',
}

/** Videos einer Session aus einem anderen Fach als DAY_FACH (gemischter Tag 5) */
const VIDEO_FACH: Record<string, FachId> = { '5-2': 'bio', '5-3': 'pug', '5-4': 'pug' }

export function videoFach(day: number, videoId: string): FachId | undefined {
  return VIDEO_FACH[videoId] ?? DAY_FACH[day]
}

/** Höchste Jahrgangsstufe, deren Stoff als bekannt gilt (0 = keine) */
export function knownUpTo(level: Level | undefined): number {
  if (!level) return 0
  return level.kind === 'schule' ? level.grade - 1 : 13
}

export function isRepeat(level: Level | undefined, day: number): boolean {
  const g = SCHOOL_GRADE[day]
  return g !== undefined && g <= knownUpTo(level)
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
