import { AREAS, DAYS, DEEP_BLOCK, DEEP_DAYS, isBlockMix, MAP_AREAS, type AreaId, type Day } from '../data/plan'
import { DEEP_FROM, PER_AREA } from '../data/deep'
import { parseChoice, type PathChoice } from './choice'
import { FAECHER, type FachId } from '../data/lehrplan'
import { DAY_FACH, isRepeat, type Level } from '../data/school'
import { dayState, type State } from './store'

// Lernpfad je Wissensstand.
//
// Aufbau:
// 1. Der Pfad beginnt direkt mit dem neuen Stoff: alle Sessions, die fuer den Stand kein bekannter Schulstoff
//    sind, + Abruf-Station nach je 4 Sessions. Schulstoff-Sessions stehen nicht im Pfad und gelten als bekannt.
// 2. Grundwissen wird bei Bedarf aufgefrischt: verweist eine Session auf Schulstoff-Sessions, gibt es dort
//    „Auffrischen“ (optional) – Vorwissen genau dann aktivieren, wenn Neues darauf aufbaut. Von dort geht es
//    zur Station des Fachs (`g-<fach>`, Grundcheck bis zur abgeschlossenen Jgst.), die nicht im Pfad steht.
// 3. Am Ende: Abschlusswiederholung aller Karten.
//
// Grundlage (Lernforschung):
// - Verteiltes Lernen schlaegt Massieren (Cepeda et al. 2006, Metaanalyse ueber 254 Studien).
// - Optimaler Abstand ≈ 10–20 % der gewuenschten Behaltensdauer, wachsende Abstaende (Cepeda et al. 2008).
// - Abrufen ist wirksamer als Wiederlesen (Testeffekt, Roediger & Karpicke 2006).
// - Gemischtes Abfragen (Interleaving) verbessert Unterscheiden und Transfer (Rohrer & Taylor 2007).
// - Vorwissen aktivieren erleichtert das Anknuepfen von Neuem (Vorwissenseffekt, Simonsmeier et al. 2022).
// Am Blockende ersetzt der MIX-Tag die 4er-Station (kumulative Block-Abfrage).
//
// Nach Tag 90 (Wahl in focus.choice) geht der Pfad mit der Vertiefung weiter (deepNodes):
// - B/C beginnen mit „Grundlagen <Fach>“ (Karten der Plan-Sessions des Fachs): Vorwissen vor der Tiefe aktivieren.
// - Abruf-Station nach je 4 Sessions wie oben; nach je 8 Sessions „Erhaltung“: unsicherste Karten aus Tag 1–90
//   + Prüfungsaufgabe zum dringendsten Thema – sonst verblasst die Breite, waehrend man vertieft.
// - Am Ende Abschluss der Vertiefung (alle Karten der Vertiefung, unsicherste zuerst).

export const REVIEW_EVERY = 4

/** Block-Nummer der Grundwiederholung (vor Block 0) */
export const BASIS_BLOCK = -1

export type PathNode =
  | { kind: 'day'; id: string; day: number; block: number }
  | {
      kind: 'review'
      id: string
      days: number[]
      block: number
      final?: boolean
      /** Vertiefung: Grundlagen des Fachs bzw. Erhaltung des Plans – offen ab Wahl, nicht erst nach allen Sessions */
      variant?: 'grundlagen' | 'erhaltung'
      /** Fach der Grundlagen-Station */
      area?: AreaId
    }
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

/** Station der Grundwiederholung je Schulfach (nicht im Pfad, erreichbar ueber „Auffrischen“) */
function stations(level: Level | undefined): BasisNode[] {
  const repeat = DAYS.filter((d) => isRepeat(level, d.day))
  const out: BasisNode[] = []
  for (const f of FAECHER) {
    const days = repeat.filter((d) => DAY_FACH[d.day] === f.id).map((d) => d.day)
    if (days.length) out.push({ kind: 'basis', id: `g-${f.id}`, fach: f.id, days, block: BASIS_BLOCK, after: [], variant: 'start' })
  }
  return out
}

function build(level: Level | undefined): PathNode[] {
  const main = DAYS.filter((d) => !isRepeat(level, d.day))
  const out: PathNode[] = []

  // 1. Neuer Stoff mit Abruf-Stationen
  let since: number[] = []
  main.forEach((d, i) => {
    out.push({ kind: 'day', id: `d${d.day}`, day: d.day, block: d.block })
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

  // 3. Abschluss
  const last = main[main.length - 1]
  if (last) out.push({ kind: 'review', id: 'w-ende', days: main.map((d) => d.day), block: last.block, final: true })
  return out
}

/** Session i (0–7) der Vertiefung eines Fachs */
export function deepDay(area: AreaId, i: number): number {
  return DEEP_FROM + MAP_AREAS.indexOf(area) * PER_AREA + i
}

/** Grundmodelle (Stufe 1–3) aller Faecher im Wechsel, nie zweimal dasselbe Fach hintereinander */
function broad(skip?: AreaId): number[] {
  return [0, 1, 2].flatMap((i) => MAP_AREAS.filter((a) => a !== skip).map((a) => deepDay(a, i)))
}

/** Sessions der Vertiefung je Weg: A breit, B alle 8 des Fachs, C Fach + nach je 2 Fach-Sessions eine breite (≈ 70/30) */
export function deepSeq(c: PathChoice): number[] {
  if (c.mode === 'breit' || !c.area) return broad()
  const own = Array.from({ length: PER_AREA }, (_, i) => deepDay(c.area!, i))
  if (c.mode === 'spezial') return own
  const other = broad(c.area)
  return own.flatMap((d, i) => (i % 2 === 1 && i < PER_AREA - 1 ? [d, other[(i - 1) / 2]] : [d]))
}

export const KEEP_EVERY = 8

function deepNodes(c: PathChoice): PathNode[] {
  const seq = deepSeq(c)
  const out: PathNode[] = []
  const block = DEEP_BLOCK
  if (c.mode !== 'breit' && c.area) {
    const area = c.area
    const days = DAYS.filter((d) => d.area === area || (area === 'PHY' && d.area === 'CHE') || (area === 'BIO' && d.area === 'NERV')).map((d) => d.day)
    out.push({ kind: 'review', id: `v-${area}`, days, block, variant: 'grundlagen', area })
  }
  let since: number[] = []
  seq.forEach((day, i) => {
    out.push({ kind: 'day', id: `d${day}`, day, block })
    since.push(day)
    const last = i === seq.length - 1
    if (since.length >= REVIEW_EVERY && !last) {
      out.push({ kind: 'review', id: `w${day}`, days: since, block })
      since = []
    }
    if ((i + 1) % KEEP_EVERY === 0 || (last && seq.length < KEEP_EVERY)) {
      out.push({ kind: 'review', id: `e${day}`, days: DAYS.map((d) => d.day), block, variant: 'erhaltung' })
    }
  })
  out.push({ kind: 'review', id: 'v-ende', days: seq, block, final: true })
  return out
}

/** Was den Pfad bestimmt: Wissensstand und Wahl nach Tag 90 (State passt) */
export interface PathCtx {
  level?: Level
  focus?: { choice?: string }
}

const cache = new Map<string, PathNode[]>()

export function buildPath(c: PathCtx): PathNode[] {
  const choice = parseChoice(c.focus?.choice)
  const key = JSON.stringify([c.level ?? null, choice])
  let p = cache.get(key)
  if (!p) {
    p = build(c.level)
    if (choice) p = [...p, ...deepNodes(choice)]
    cache.set(key, p)
  }
  return p
}

/** Sessions des Pfads in Reihenfolge; ihre Position (1…N) ist die angezeigte Nummer */
export function pathDays(c: PathCtx): number[] {
  return buildPath(c).flatMap((n) => (n.kind === 'day' ? [n.day] : []))
}

/** Laufende Nummer einer Session im Pfad (1…N), undefined fuer Schulstoff ausserhalb des Pfads */
export function sessionNo(c: PathCtx, day: number): number | undefined {
  const i = pathDays(c).indexOf(day)
  return i >= 0 ? i + 1 : undefined
}

/** „Session 3–6“ fuer eine Abruf-Station */
export function sessionRange(c: PathCtx, days: number[]): string {
  const a = sessionNo(c, days[0])
  const b = sessionNo(c, days[days.length - 1])
  return a === b ? `Session ${a}` : `Session ${a}–${b}`
}

/** Kopfzeile + Titel einer Station (Home, Station, Rückblick, Erinnerung) */
export function reviewLabel(c: PathCtx, n: ReviewNode): { head: string; title: string } {
  if (n.variant === 'grundlagen') return { head: 'Grundlagen', title: AREAS[n.area!].name }
  if (n.variant === 'erhaltung') return { head: 'Erhaltung', title: 'Karten und Prüfung aus den 90 Tagen' }
  if (n.final) return { head: 'Abschluss', title: n.block === DEEP_BLOCK ? 'Alle Karten der Vertiefung' : 'Alle Karten wiederholen' }
  return { head: 'Wiederholung', title: sessionRange(c, n.days) }
}

/** Sessions eines Ueberthemas fuer Statistik und Fortschritt: Plan + Vertiefung, soweit im eigenen Pfad oder schon gemacht */
export function areaDays(s: State, area: AreaId): Day[] {
  const deep = new Set(pathDays(s))
  return [...DAYS.filter((d) => d.area === area), ...DEEP_DAYS.filter((d) => d.area === area && (deep.has(d.day) || dayState(s, d.day).status !== 'offen'))]
}

export function pathOf(s: State): PathNode[] {
  return buildPath(s)
}

const stationCache = new Map<string, BasisNode[]>()

export function basisStations(level: Level | undefined): BasisNode[] {
  const key = JSON.stringify(level ?? null)
  let p = stationCache.get(key)
  if (!p) {
    p = stations(level)
    stationCache.set(key, p)
  }
  return p
}

/** Station des Fachs, zu dem eine Schulstoff-Session gehoert */
export function stationOf(level: Level | undefined, day: number): BasisNode | undefined {
  return basisStations(level).find((n) => n.days.includes(day))
}

export function findNode(s: State, id: string): PathNode | undefined {
  return pathOf(s).find((x) => x.id === id) ?? basisStations(s.level).find((x) => x.id === id)
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
  if (n.kind === 'day' || (n.kind === 'review' && n.variant)) return true
  return (n.kind === 'review' ? n.days : n.after).every((d) => fertig(s, d))
}

/** Erste noch offene Station; mit gewaehltem Weg halten liegengebliebene Stationen des Plans nicht auf (bleiben offen) */
export function currentNode(s: State): PathNode {
  const p = pathOf(s)
  const deep = p[p.length - 1].block === DEEP_BLOCK
  const skip = (n: PathNode) => deep && n.kind !== 'day' && n.block !== DEEP_BLOCK
  return p.find((n) => !nodeDone(s, n) && !skip(n)) ?? p.find((n) => !nodeDone(s, n)) ?? p[p.length - 1]
}

/** Erste Station der Vertiefung (nach der Wahl dorthin springen) */
export function firstDeepNode(s: State): PathNode | undefined {
  return pathOf(s).find((n) => n.block === DEEP_BLOCK)
}
