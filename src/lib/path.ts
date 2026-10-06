import { DAYS, isBlockMix } from '../data/plan'
import { FAECHER, type FachId } from '../data/lehrplan'
import { DAY_FACH, isRepeat, type Level } from '../data/school'
import { dayState, type State } from './store'

// Lernpfad je Wissensstand.
//
// Aufbau:
// 1. Grundwiederholung (nur wenn es fuer den Stand bekannten Schulstoff gibt): je Schulfach eine Station,
//    die den Schulstoff bis zur abgeschlossenen Jahrgangsstufe (LehrplanPLUS Bayern) abfragt und Luecken sucht.
//    Die Schulstoff-Sessions dieses Fachs haengen an der Station (zum Vertiefen) statt im Hauptpfad.
// 2. Trennlinie, danach der neue Stoff: die uebrigen Sessions + Abruf-Station nach je 4 Sessions.
// 3. Auffrischung der Grundwiederholung etwa zur Haelfte (an einem Blockende) – verteiltes Wiederholen.
// 4. Am Ende: Abschlusswiederholung aller Karten + Abschluss-Check des Grundwissens.
//
// Grundlage (Lernforschung):
// - Verteiltes Lernen schlaegt Massieren (Cepeda et al. 2006, Metaanalyse ueber 254 Studien).
// - Optimaler Abstand ≈ 10–20 % der gewuenschten Behaltensdauer, wachsende Abstaende (Cepeda et al. 2008).
// - Abrufen ist wirksamer als Wiederlesen (Testeffekt, Roediger & Karpicke 2006).
// - Gemischtes Abfragen (Interleaving) verbessert Unterscheiden und Transfer (Rohrer & Taylor 2007).
// - Vorwissen aktivieren erleichtert das Anknuepfen von Neuem (Vorwissenseffekt, Simonsmeier et al. 2022).
// Am Blockende ersetzt der MIX-Tag die 4er-Station (kumulative Block-Abfrage).

export const REVIEW_EVERY = 4

/** Block-Nummer der Grundwiederholung (vor Block 0) */
export const BASIS_BLOCK = -1

export type PathNode =
  | { kind: 'day'; id: string; day: number; block: number }
  | { kind: 'review'; id: string; days: number[]; block: number; final?: boolean }
  | {
      kind: 'basis'
      id: string
      /** Fach oder 'mix' (alle Fächer gemischt) */
      fach: FachId | 'mix'
      /** abgedeckte Schulstoff-Sessions */
      days: number[]
      block: number
      /** Sessions, die vorher abgeschlossen sein muessen */
      after: number[]
      variant: 'start' | 'auffrischung' | 'abschluss'
    }

export type ReviewNode = Extract<PathNode, { kind: 'review' }>
export type BasisNode = Extract<PathNode, { kind: 'basis' }>

function build(level: Level | undefined): PathNode[] {
  const repeat = DAYS.filter((d) => isRepeat(level, d.day))
  const main = DAYS.filter((d) => !isRepeat(level, d.day))
  const out: PathNode[] = []

  // 1. Grundwiederholung je Fach (Reihenfolge wie im Lehrplan-Verzeichnis)
  for (const f of FAECHER) {
    const days = repeat.filter((d) => DAY_FACH[d.day] === f.id).map((d) => d.day)
    if (days.length) out.push({ kind: 'basis', id: `g-${f.id}`, fach: f.id, days, block: BASIS_BLOCK, after: [], variant: 'start' })
  }
  const hasBasis = out.length > 0
  const allRepeat = repeat.map((d) => d.day)

  // Auffrischung an dem Blockende (MIX-Tag), das der Mitte des neuen Stoffs am naechsten liegt
  const mixIdx = main.map((d, i) => (isBlockMix(d) ? i : -1)).filter((i) => i >= 0)
  const mid = mixIdx.reduce((best, i) => (Math.abs(i - main.length / 2) < Math.abs(best - main.length / 2) ? i : best), mixIdx[0] ?? -1)

  // 2. Neuer Stoff mit Abruf-Stationen
  let since: number[] = []
  main.forEach((d, i) => {
    out.push({ kind: 'day', id: `d${d.day}`, day: d.day, block: d.block })
    if (hasBasis && i === mid) {
      out.push({ kind: 'basis', id: 'g-auffrischung', fach: 'mix', days: allRepeat, block: d.block, after: main.slice(0, i + 1).map((x) => x.day), variant: 'auffrischung' })
    }
    if (isBlockMix(d)) {
      since = []
      return
    }
    since.push(d.day)
    const next = main[i + 1]
    if (since.length >= REVIEW_EVERY && next && !isBlockMix(next)) {
      out.push({ kind: 'review', id: `w${d.day}`, days: since, block: d.block })
      since = []
    }
  })

  // 4. Abschluss
  const last = main[main.length - 1]
  if (last) {
    out.push({ kind: 'review', id: 'w-ende', days: main.map((d) => d.day), block: last.block, final: true })
    if (hasBasis) out.push({ kind: 'basis', id: 'g-abschluss', fach: 'mix', days: allRepeat, block: last.block, after: main.map((d) => d.day), variant: 'abschluss' })
  }
  return out
}

const cache = new Map<string, PathNode[]>()

export function buildPath(level: Level | undefined): PathNode[] {
  const key = JSON.stringify(level ?? null)
  let p = cache.get(key)
  if (!p) {
    p = build(level)
    cache.set(key, p)
  }
  return p
}

export function pathOf(s: State): PathNode[] {
  return buildPath(s.level)
}

export function findNode(s: State, id: string): PathNode | undefined {
  return pathOf(s).find((x) => x.id === id)
}

export function reviewNode(s: State, id: string): ReviewNode | undefined {
  const n = findNode(s, id)
  return n?.kind === 'review' ? n : undefined
}

export function basisNode(s: State, id: string): BasisNode | undefined {
  const n = findNode(s, id)
  return n?.kind === 'basis' ? n : undefined
}

const fertig = (s: State, d: number) => dayState(s, d).status === 'fertig'

export function nodeDone(s: State, n: PathNode): boolean {
  if (n.kind === 'day') return fertig(s, n.day)
  if (s.reviews[n.id]) return true
  // Start-Station: alle Sessions des Fachs ausfuehrlich gemacht zaehlt auch
  return n.kind === 'basis' && n.variant === 'start' && n.days.every((d) => fertig(s, d))
}

export function nodeReady(s: State, n: PathNode): boolean {
  if (n.kind === 'day') return true
  return (n.kind === 'review' ? n.days : n.after).every((d) => fertig(s, d))
}

/** Erste noch offene Station */
export function currentNode(s: State): PathNode {
  const p = pathOf(s)
  return p.find((n) => !nodeDone(s, n)) ?? p[p.length - 1]
}
