// Reihenfolge im Entdecken-Feed: Was gefällt dir, ohne dass du etwas bewerten musst?
//
// Grundlagen (Recherche, Stand 10/2026):
// - Implizites Feedback statt Likes: Nutzer bewerten selten ausdrücklich, Wegwischen ist das häufigste Signal
//   (Kuaishou/Short-Video-Forschung). Wichtigstes Signal ist die Sehdauer – aber relativ zur Länge, sonst gewinnen lange
//   Beiträge („duration bias“, Zhao et al. 2024; Yi et al., RecSys 2014: Verweildauer normalisieren).
// - Ganz durchgesehen, nochmal angesehen, gemerkt, weitergeklickt = stark positiv; sofort weggewischt = stark negativ
//   (YouTube: erwartete Sehdauer statt Klicks, Covington et al. 2016).
// - Lernverhalten: freiwilliges Weitermachen ist das klassische Maß für Interesse (Free-Choice-Paradigma, Deci 1971):
//   eigene Fragen, Notizen, freiwillige Prüfungen. Richtig/falsch ist Können, nicht Gefallen – zählt nur leicht.
//   Entscheidend ist die Reaktion auf Fehler: Wer danach ausführlicher antwortet oder nachfragt, ist neugierig
//   (Informationslücken-Theorie, Loewenstein 1994; Kang et al. 2009). Alles relativ zum eigenen Durchschnitt –
//   manche schreiben immer lang.
// - Selbsteinschätzung (Regler „Was hat dir gefallen?“) ist der Startwert, Verhalten verschiebt ihn (Bayes-artig:
//   je mehr Daten, desto weniger zählt der Startwert).
// - Erkunden vs. Ausnutzen: Zufall proportional zur Unsicherheit (Thompson-Sampling-artig), jede 4. Stelle bewusst ein
//   wenig bekanntes Gebiet, nie dreimal dasselbe Überthema hintereinander (Filterblase vermeiden).
// - Einstieg: zuerst ein anderes Thema als die letzte Session, dann gleich eins aus ihr – Neugier + Anknüpfen.
import type { Bite } from '../data/feed'
import { DAYS, type AreaId } from '../data/plan'
import { LIKE_GROUPS, parseCheck, STAT_AREAS, dayDone } from './stats'
import { pathDays } from './path'
import { dayState, examState, today, type BiteLog, type State } from './store'

export const FREE_PER_DAY = 3

const clamp = (x: number, a = -1, b = 1) => Math.max(a, Math.min(b, x))
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/** Gefallen eines Häppchens aus dem Verhalten (−1 … 1) */
export function biteLike(l: BiteLog, saved: boolean): number {
  const views = Math.max(1, l.views)
  // Sehdauer je Durchlauf relativ zur erwarteten Länge (gegen den Längen-Bias)
  const watch = clamp(l.ms / Math.max(1, l.dur * views), 0, 1)
  const done = l.done / views
  let s = -1 + 1.0 * l.best + 0.6 * watch + 0.4 * done
  s += 0.12 * Math.min(l.back, 3) // zurückgewischt, um etwas nochmal zu sehen
  s += views > 1 && l.done > 0 ? 0.25 : 0 // freiwillig nochmal geöffnet
  s += 0.08 * Math.min(l.holds, 3) // angehalten zum Lesen
  s += l.link > 0 ? 0.4 : 0 // wollte mehr: zur Session gesprungen
  s += saved ? 0.6 : 0
  s -= 0.8 * (l.skips / views) // nach wenigen Sekunden weggewischt
  return clamp(s)
}

export interface Visit {
  ms: number
  dur: number
  frac: number
  done: boolean
  back: number
  holds: number
  link: number
}

/** Besuch eines Häppchens einrechnen (beim Weiterwischen oder Verlassen) */
export function mergeVisit(s: State, id: string, v: Visit): State {
  const old = s.feed.log[id]
  const t = new Date().toISOString()
  const l: BiteLog = {
    first: old?.first ?? t,
    last: t,
    views: (old?.views ?? 0) + 1,
    ms: (old?.ms ?? 0) + v.ms,
    dur: v.dur,
    best: Math.max(old?.best ?? 0, v.frac),
    done: (old?.done ?? 0) + (v.done ? 1 : 0),
    back: (old?.back ?? 0) + v.back,
    skips: (old?.skips ?? 0) + (v.ms < 4000 && v.frac < 0.25 ? 1 : 0),
    holds: (old?.holds ?? 0) + v.holds,
    link: (old?.link ?? 0) + v.link,
    like: 0,
  }
  l.like = biteLike(l, s.feed.saved.includes(id))
  return { ...s, feed: { ...s.feed, log: { ...s.feed.log, [id]: l } } }
}

export function toggleSaved(s: State, id: string): State {
  const saved = s.feed.saved.includes(id) ? s.feed.saved.filter((x) => x !== id) : [id, ...s.feed.saved]
  const l = s.feed.log[id]
  const log = l ? { ...s.feed.log, [id]: { ...l, like: biteLike(l, saved.includes(id)) } } : s.feed.log
  return { ...s, feed: { ...s.feed, saved, log } }
}

// ───────────── Lernverhalten je Überthema ─────────────

interface SessionSignal {
  area: AreaId
  questions: number
  notes: number
  ansLen: number
  precision: number | null
  accuracy: number | null
  /** Antwortzeit (s) richtiger Antworten */
  fastOk: number | null
  /** Reaktion auf Fehler: Länge der nächsten Antwort relativ zur eigenen Durchschnittslänge, Nachfragen */
  afterError: number | null
  exams: number
}

function sessionSignals(s: State): SessionSignal[] {
  const out: SessionSignal[] = []
  for (const d of DAYS) {
    const ds = dayState(s, d.day)
    if (ds.status !== 'fertig' || d.area === 'MIX') continue
    const qa = parseCheck(ds.check)
    const rated = qa.filter((q) => q.verdict)
    const ok = qa.filter((q) => q.verdict === 'richtig' && q.ms)
    const notes = (ds.notes?.length ?? 0) / 160 + Object.values(ds.videoNotes ?? {}).reduce((a, n) => a + n.length, 0)
    // Antwort nach einem Fehler: wie ausfuehrlich ging es weiter?
    const lens = qa.map((q) => q.answer.length)
    const avg = mean(lens) || 1
    const after: number[] = []
    qa.forEach((q, i) => {
      if (q.verdict !== 'falsch' && q.verdict !== 'teilweise') return
      const next = qa[i + 1]
      after.push(next ? clamp(next.answer.length / avg - 1, -1, 1) : -0.3)
    })
    out.push({
      area: d.area,
      questions: (ds.questions ?? []).filter((m) => m.role === 'user').length,
      notes,
      ansLen: avg,
      precision: rated.some((q) => q.precision) ? mean(rated.filter((q) => q.precision).map((q) => q.precision!)) : null,
      accuracy: rated.length ? mean(rated.map((q) => (q.verdict === 'richtig' ? 1 : q.verdict === 'teilweise' ? 0.5 : 0))) : null,
      fastOk: ok.length ? mean(ok.map((q) => q.ms! / 1000)) : null,
      afterError: after.length ? mean(after) + ((ds.questions?.length ?? 0) > 0 ? 0.3 : 0) : null,
      exams: examState(s, d.day).results.length,
    })
  }
  return out
}

/** Abweichung vom eigenen Durchschnitt, −1 … 1 */
const rel = (x: number, avg: number) => clamp((x - avg) / (avg + 1))

function learnByArea(s: State): Map<AreaId, { score: number; n: number }> {
  const sig = sessionSignals(s)
  const res = new Map<AreaId, { score: number; n: number }>()
  if (!sig.length) return res
  const avgQ = mean(sig.map((x) => x.questions))
  const avgN = mean(sig.map((x) => x.notes))
  const avgL = mean(sig.map((x) => x.ansLen))
  const precs = sig.filter((x) => x.precision != null).map((x) => x.precision!)
  const accs = sig.filter((x) => x.accuracy != null).map((x) => x.accuracy!)
  const fasts = sig.filter((x) => x.fastOk != null).map((x) => x.fastOk!)
  const by = new Map<AreaId, number[]>()
  for (const x of sig) {
    let z = 0.35 * rel(x.questions, avgQ) + 0.2 * rel(x.notes, avgN) + 0.15 * rel(x.ansLen, avgL)
    if (x.precision != null && precs.length) z += 0.1 * clamp((x.precision - mean(precs)) / 1.5)
    if (x.accuracy != null && accs.length) z += 0.08 * clamp((x.accuracy - mean(accs)) * 2) // Können, nur leicht
    if (x.fastOk != null && fasts.length) z += 0.07 * clamp((mean(fasts) - x.fastOk) / (mean(fasts) + 1)) // flüssig = leicht positiv
    if (x.afterError != null) z += 0.15 * clamp(x.afterError)
    z += 0.1 * Math.min(x.exams, 2) / 2 // freiwillig geprüft
    by.set(x.area, [...(by.get(x.area) ?? []), z])
  }
  for (const [a, zs] of by) res.set(a, { score: Math.tanh(mean(zs) * 2), n: zs.length })
  return res
}

// ───────────── Interesse je Überthema ─────────────

export interface Interest {
  value: number
  /** Unsicherheit 0–1: wenig Daten → mehr Zufall */
  unc: number
}

export function interests(s: State, bites: Bite[]): Map<AreaId, Interest> {
  const learn = learnByArea(s)
  const byId = new Map(bites.map((b) => [b.id, b]))
  const feed = new Map<AreaId, number[]>()
  for (const [id, l] of Object.entries(s.feed.log)) {
    const b = byId.get(id)
    if (b) feed.set(b.area, [...(feed.get(b.area) ?? []), l.like])
  }
  const likes = s.focus.likes ?? {}
  const out = new Map<AreaId, Interest>()
  for (const a of STAT_AREAS) {
    const g = LIKE_GROUPS.find((x) => x.areas.includes(a))
    const prior = g && likes[g.id] != null ? (likes[g.id] - 2) / 2 : null
    const wp = prior == null ? 0 : 2
    const f = feed.get(a) ?? []
    const l = learn.get(a)
    const wl = l ? 0.8 * Math.min(l.n, 5) : 0
    const w = 1 + wp + f.length + wl
    out.set(a, { value: (wp * (prior ?? 0) + f.reduce((x, y) => x + y, 0) + wl * (l?.score ?? 0)) / w, unc: 1 / Math.sqrt(w) })
  }
  return out
}

/** Überthemen der zuletzt abgeschlossenen Sessions, neueste zuerst */
export function recentAreas(s: State): AreaId[] {
  return DAYS.filter((d) => d.area !== 'MIX' && dayState(s, d.day).completedAt)
    .sort((a, b) => (dayState(s, b.day).completedAt ?? '').localeCompare(dayState(s, a.day).completedAt ?? '') || b.day - a.day)
    .map((d) => d.area)
    .filter((a, i, xs) => xs.indexOf(a) === i)
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return ((h >>> 0) % 10000) / 10000
}

/**
 * Nächstes Häppchen. shown = in dieser Runde schon gezeigt (Reihenfolge).
 * Ungesehene zuerst; sind alle gesehen, kommen gemochte, lange nicht gesehene wieder.
 */
export function pickNext(s: State, bites: Bite[], shown: string[]): Bite | null {
  const pos = shown.length
  const inRound = new Set(shown)
  let pool = bites.filter((b) => !inRound.has(b.id) && !s.feed.log[b.id])
  if (!pool.length) {
    const again = bites
      .filter((b) => !inRound.has(b.id) && (s.feed.log[b.id]?.like ?? 0) > 0)
      .sort((a, b) => (s.feed.log[a.id]?.last ?? '').localeCompare(s.feed.log[b.id]?.last ?? ''))
    return again[0] ?? null
  }
  const ints = interests(s, bites)
  const recent = recentAreas(s)
  const last = recent[0]
  const byId = new Map(bites.map((b) => [b.id, b]))
  const prev = shown.length ? byId.get(shown[shown.length - 1])?.area : undefined
  const prev2 = shown.length > 1 ? byId.get(shown[shown.length - 2])?.area : undefined
  const open = pathDays(s.level).find((d) => !dayDone(s, d))

  // Einstieg: erst etwas anderes, dann die letzte Session
  if (pos === 0 && last && pool.some((b) => b.area !== last)) pool = pool.filter((b) => b.area !== last)
  else if (pos === 1 && last && pool.some((b) => b.area === last)) pool = pool.filter((b) => b.area === last)
  const explore = pos >= 3 && pos % 4 === 3

  const day = today()
  let best: Bite | null = null
  let bestScore = -Infinity
  for (const b of pool) {
    const it = ints.get(b.area) ?? { value: 0, unc: 1 }
    const r = hash(`${day}|${b.id}|${pos}`) - 0.5
    let sc = explore ? it.unc * 2 + r : it.value + r * 0.9 * it.unc
    if (!explore) {
      if (b.area === last) sc += 0.35
      else if (recent.slice(1, 3).includes(b.area)) sc += 0.15
      if (b.day && dayDone(s, b.day)) sc += 0.15 // knüpft an Gelerntes an
      if (b.day && b.day === open) sc += 0.1 // macht neugierig auf die nächste Session
    }
    if (b.area === prev) sc -= 0.6
    if (b.area === prev && b.area === prev2) sc -= 2
    if (sc > bestScore) {
      bestScore = sc
      best = b
    }
  }
  return best
}

/** Kostenlos: FREE_PER_DAY neue Häppchen am Tag; schon heute geöffnete gehen immer */
export function canOpen(s: State, id: string, premium: boolean): boolean {
  if (premium) return true
  const d = s.feed.daily
  if (!d || d.date !== today()) return true
  return d.ids.includes(id) || d.ids.length < FREE_PER_DAY
}

export function markOpened(s: State, id: string): State {
  const d = s.feed.daily?.date === today() ? s.feed.daily : { date: today(), ids: [] }
  if (d.ids.includes(id)) return s
  return { ...s, feed: { ...s.feed, daily: { date: d.date, ids: [...d.ids, id] } } }
}

/** Premium-Grenze an? Vorerst aus: alles für alle frei, bis Premium zu kaufen ist (docs/launch-und-premium.md) */
const PREMIUM_LIMIT = false

export function isPremium(role: string | null | undefined): boolean {
  return !PREMIUM_LIMIT || role === 'editor' || import.meta.env.DEV
}
