import { DAYS, isBlockMix } from '../data/plan'
import { dayState, type State } from './store'

// Lernpfad: die 90 Sessions plus eingeschobene Wiederholungs-Stationen.
//
// Grundlage (Lernforschung):
// - Verteiltes Lernen schlaegt Massieren (Cepeda et al. 2006, Metaanalyse ueber 254 Studien).
// - Optimaler Abstand ≈ 10–20 % der gewuenschten Behaltensdauer, wachsende Abstaende (Cepeda et al. 2008).
// - Abrufen ist wirksamer als Wiederlesen (Testeffekt, Roediger & Karpicke 2006).
// - Gemischtes Abfragen (Interleaving) verbessert Unterscheiden und Transfer (Rohrer & Taylor 2007).
// Umsetzung: nach je 4 Sessions eine kurze Abruf-Station (Karten der letzten 4 Sessions gemischt +
// alle faelligen Karten aus dem SM-2-Plan → wachsende Abstaende). Am Blockende ersetzt der MIX-Tag
// die Station (kumulative Block-Abfrage).

export const REVIEW_EVERY = 4

export type PathNode =
  | { kind: 'day'; id: string; day: number; block: number }
  | { kind: 'review'; id: string; after: number; days: number[]; block: number }

function build(): PathNode[] {
  const out: PathNode[] = []
  let since: number[] = []
  DAYS.forEach((d, i) => {
    out.push({ kind: 'day', id: `d${d.day}`, day: d.day, block: d.block })
    if (isBlockMix(d)) {
      since = []
      return
    }
    since.push(d.day)
    const next = DAYS[i + 1]
    if (since.length >= REVIEW_EVERY && next && !isBlockMix(next)) {
      out.push({ kind: 'review', id: `w${d.day}`, after: d.day, days: since, block: d.block })
      since = []
    }
  })
  return out
}

export const PATH: PathNode[] = build()

export function reviewNode(id: string) {
  const n = PATH.find((x) => x.id === id)
  return n?.kind === 'review' ? n : undefined
}

export function nodeDone(s: State, n: PathNode): boolean {
  return n.kind === 'day' ? dayState(s, n.day).status === 'fertig' : !!s.reviews[n.id]
}

export function reviewReady(s: State, n: Extract<PathNode, { kind: 'review' }>): boolean {
  return n.days.every((d) => dayState(s, d).status === 'fertig')
}

/** Erste noch offene Station */
export function currentNode(s: State): PathNode {
  return PATH.find((n) => !nodeDone(s, n)) ?? PATH[PATH.length - 1]
}
