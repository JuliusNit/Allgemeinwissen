import { AREAS, DAYS, getDay, type AreaId } from '../data/plan'
import { fach } from '../data/lehrplan'
import { currentNode, pathOf, nodeDone, type PathNode } from './path'
import { dayDone, dayDoneAt, sessionScore, VERDICT_SCORE, type Verdict } from './stats'
import { activeDates, localDate, streak, toDate } from './streak'
import { dayState, examState, today, type State } from './store'

// Wochenrueckblick: ab Montag beim ersten Oeffnen ein Kasten ueber die Vorwoche (Mo–So).
//
// Wissensindex statt IQ: kristalline Intelligenz (Gc) wird in echten Tests (z. B. WAIS-IV
// „Sprachverstaendnis“, Untertest „Allgemeines Wissen“) gegen eine Normstichprobe gemessen –
// Mittelwert 100, SD 15. Ohne Normstichprobe waere ein IQ-Wert aus App-Daten erfunden. Der Index
// misst deshalb nur gegen den eigenen Plan: Anteil der 90 Sessions, die sicher sitzen
// (je Session 0–1, gewichtet wie im Pruefungsmodus: letzte Pruefung doppelt, Verstaendnischeck,
// Karteikarten-Quote; abgeschlossen ohne Messwerte = 1). Vergleich: Stand Sonntagabend vs. eine Woche davor.

function addDays(date: string, n: number): string {
  const d = new Date(date + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return localDate(d.getTime())
}

/** Montag der Woche (lokal) als YYYY-MM-DD */
export function mondayOf(date: string): string {
  const d = new Date(date + 'T12:00:00')
  return addDays(date, -((d.getDay() + 6) % 7))
}

/** Rueckblick faellig: neue Woche, noch nicht gesehen, und vor dieser Woche schon gelernt */
export function recapDue(s: State): boolean {
  const mon = mondayOf(today())
  if (s.recapSeen && s.recapSeen >= mon) return false
  for (const d of activeDates(s)) if (d < mon) return true
  return false
}

export function markRecapSeen(s: State): State {
  return { ...s, recapSeen: mondayOf(today()) }
}

/** Sitzt-Wert einer Session (0–1) mit Stand vor dem Datum `before` */
function mastery(s: State, day: number, before: string): number {
  const at = dayDoneAt(s, day)
  if (!at || toDate(at) >= before) return 0
  const parts: { v: number; w: number }[] = []
  const ex = examState(s, day).results.filter((r) => r.score != null && toDate(r.at) < before)
  if (ex.length) parts.push({ v: ex[ex.length - 1].score!, w: 2 })
  const sc = sessionScore(s, day)
  if (sc != null) parts.push({ v: sc, w: 1 })
  const logs = s.cardLog.filter((l) => l.day === day && toDate(l.at) < before)
  if (logs.length) parts.push({ v: logs.filter((l) => l.rating >= 2).length / logs.length, w: 1 })
  const wsum = parts.reduce((a, p) => a + p.w, 0)
  return wsum ? parts.reduce((a, p) => a + p.v * p.w, 0) / wsum : 1
}

/** Wissensindex in Prozent (0–100) mit Stand vor `before` */
export function knowledgeIndex(s: State, before: string): number {
  return (DAYS.reduce((a, d) => a + mastery(s, d.day, before), 0) / DAYS.length) * 100
}

export interface Recap {
  from: string
  to: string
  /** neu abgeschlossene Sessions, grob nach Ueberthema */
  learned: { area: AreaId; name: string; titles: string[] }[]
  sessions: number
  stations: number
  cards: number
  answers: number
  accuracy: number | null
  indexNow: number
  indexBefore: number
  planDone: number
  streak: number
  activeDays: number
  next: string[]
}

function nodeLabel(n: PathNode): string {
  if (n.kind === 'day') return `Tag ${n.day} · ${getDay(n.day).title.split(/[:(]/)[0].trim()}`
  if (n.kind === 'review') return n.final ? 'Abschlusswiederholung' : `Wiederholung Tag ${n.days[0]}–${n.days[n.days.length - 1]}`
  if (n.variant === 'auffrischung') return 'Auffrischung Grundwissen'
  if (n.variant === 'abschluss') return 'Grundwissen-Check'
  return `Grundcheck ${n.fach === 'mix' ? 'gemischt' : fach(n.fach).name}`
}

const MARK =/\[\[BEWERTUNG:\s*(richtig|teilweise|falsch)/i

export function weekRecap(s: State): Recap {
  const end = mondayOf(today())
  const from = addDays(end, -7)
  const inWeek = (v?: string) => !!v && toDate(v) >= from && toDate(v) < end

  const days = DAYS.filter((d) => inWeek(dayState(s, d.day).completedAt))
  const byArea = new Map<AreaId, string[]>()
  for (const d of days) byArea.set(d.area, [...(byArea.get(d.area) ?? []), d.title.split(/[:(]/)[0].trim()])
  const learned = [...byArea].map(([area, titles]) => ({ area, name: AREAS[area].name, titles }))

  // Antworten im Verstaendnischeck und in Pruefungen der Woche
  const verdicts: number[] = []
  for (const d of DAYS) {
    for (const chat of [dayState(s, d.day).check, examState(s, d.day).chat]) {
      chat?.forEach((m, i) => {
        const v = m.role === 'assistant' ? MARK.exec(m.content) : null
        const a = chat[i - 1]
        if (v && a?.role === 'user' && a.at && inWeek(localDate(a.at))) verdicts.push(VERDICT_SCORE[v[1].toLowerCase() as Verdict])
      })
    }
  }

  const path = pathOf(s)
  const cur = currentNode(s)
  const next = path
    .slice(path.indexOf(cur))
    .filter((n) => !nodeDone(s, n))
    .slice(0, 3)
    .map(nodeLabel)

  const active = [...activeDates(s)].filter((d) => d >= from && d < end)
  return {
    from,
    to: addDays(end, -1),
    learned,
    sessions: days.length,
    stations: Object.values(s.reviews).filter(inWeek).length,
    cards: s.cardLog.filter((l) => inWeek(l.at)).length,
    answers: verdicts.length,
    accuracy: verdicts.length ? verdicts.reduce((a, b) => a + b, 0) / verdicts.length : null,
    indexNow: knowledgeIndex(s, end),
    indexBefore: knowledgeIndex(s, from),
    planDone: DAYS.filter((d) => dayDone(s, d.day)).length,
    streak: streak(s).days,
    activeDays: active.length,
    next,
  }
}
