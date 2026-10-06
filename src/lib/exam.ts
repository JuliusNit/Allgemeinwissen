import { DAYS, isBlockMix } from '../data/plan'
import { parseCheck, sessionScore, VERDICT_SCORE } from './stats'
import { dayState, examState, type ChatMsg, type State } from './store'

// Pruefungs-Wiederholung: Themen (abgeschlossene Sessions) nach Dringlichkeit sortiert.
// Dringlichkeit = 60 % Schwaeche + 40 % Abstand seit dem letzten Abruf (Session-Abschluss oder Pruefung),
// Abstand gedeckelt bei 4 Wochen. Schwaeche aus letzter Pruefung (doppelt gewichtet), Verstaendnischeck und
// Karteikarten-Quote des Themas.

export interface ExamTopic {
  day: number
  /** 0–1, hoeher = dringender */
  priority: number
  /** 0–1 oder null ohne Messwerte */
  mastery: number | null
  /** Tage seit dem letzten Abruf */
  since: number
  examined: boolean
  reason: string
}

const DAY_MS = 86_400_000

function daysAgo(date: string): number {
  const d = Date.parse(date.length === 10 ? date + 'T12:00:00' : date)
  return Number.isNaN(d) ? 0 : Math.max(0, Math.floor((Date.now() - d) / DAY_MS))
}

export function examTopics(s: State): ExamTopic[] {
  return DAYS.filter((d) => !isBlockMix(d) && dayState(s, d.day).status === 'fertig')
    .map((d) => {
      const ds = dayState(s, d.day)
      const ex = examState(s, d.day)
      const last = ex.results[ex.results.length - 1]
      const parts: { v: number; w: number }[] = []
      if (last?.score != null) parts.push({ v: last.score, w: 2 })
      const sc = sessionScore(s, d.day)
      if (sc != null) parts.push({ v: sc, w: 1 })
      const logs = s.cardLog.filter((l) => l.day === d.day)
      if (logs.length) parts.push({ v: logs.filter((l) => l.rating >= 2).length / logs.length, w: 1 })
      const wsum = parts.reduce((a, p) => a + p.w, 0)
      const mastery = wsum ? parts.reduce((a, p) => a + p.v * p.w, 0) / wsum : null
      const since = daysAgo(last?.at ?? ds.completedAt ?? ds.startedAt ?? '')
      const priority = 0.6 * (1 - (mastery ?? 0.8)) + 0.4 * Math.min(1, since / 28)
      const reason =
        mastery != null && mastery < 0.7
          ? `noch wackelig · ${Math.round(mastery * 100)} % richtig`
          : !last
            ? since > 0
              ? `noch nie geprüft · gelernt vor ${since} ${since === 1 ? 'Tag' : 'Tagen'}`
              : 'noch nie geprüft'
            : since > 0
              ? `zuletzt geprüft vor ${since} ${since === 1 ? 'Tag' : 'Tagen'}`
              : 'heute schon geprüft'
      return { day: d.day, priority, mastery, since, examined: !!last, reason }
    })
    .sort((a, b) => b.priority - a.priority || a.day - b.day)
}

/** Anteil richtig eines Prüfungsverlaufs, null ohne Bewertungen */
export function examScore(chat: ChatMsg[]): number | null {
  const qa = parseCheck(chat).filter((q) => q.verdict)
  return qa.length ? qa.reduce((a, q) => a + VERDICT_SCORE[q.verdict!], 0) / qa.length : null
}
