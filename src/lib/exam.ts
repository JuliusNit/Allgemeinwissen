import { ALL_DAYS, getDay, isBlockMix, isProject, type Day } from '../data/plan'
import { dayDone, dayDoneAt, sessionScore, VERDICT_SCORE } from './stats'
import { dayState, examState, type ExamQuestion, type ExamTest, type State } from './store'

// Pruefungs-Wiederholung: Themen (abgeschlossene Sessions) nach Dringlichkeit sortiert; je Thema ein Kurztest
// (Fragen erzeugt `makeExam` in ai.ts, bewertet `gradeExam`; Ablauf in views/ExamView.tsx).
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
  return ALL_DAYS.filter((d) => !isBlockMix(d) && !isProject(d) && dayDone(s, d.day))
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
      const since = daysAgo(last?.at ?? dayDoneAt(s, d.day) ?? ds.startedAt ?? '')
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

/** Anteil richtig eines Tests, null ohne Antworten */
export function examScore(t: ExamTest): number | null {
  return t.answers.length ? t.answers.reduce((a, x) => a + VERDICT_SCORE[x.verdict], 0) / t.answers.length : null
}

/** Test laeuft: erzeugt, aber noch nicht alle Fragen beantwortet */
export function examOpen(s: State, day: number): boolean {
  const t = examTest(s, day)
  return !!t && t.answers.length < t.questions.length
}

// Der Test prueft zwei Dinge (Julius, 15.11.2026): Kernprinzip anwenden + wie das Thema mit einem frueheren
// zusammenhaengt – nur um eine Ecke. Wenige Aufgaben, dafuer zum Nachdenken (1–2 min je Aufgabe).
export const EXAM_APPLY = 2

/** ungefaehre Dauer in Minuten */
export const examMinutes = (questions: number) => Math.round(questions * 1.7)

/** laufender oder letzter Test im aktuellen Format */
export function examTest(s: State, day: number): ExamTest | undefined {
  const t = examState(s, day).test
  return t?.v === 2 ? t : undefined
}

export interface ExamLink {
  day: Day
  /** vor = darauf baut das Thema auf, nach = baut auf dem Thema auf, nah = nur zeitlich benachbart */
  dir: 'vor' | 'nach' | 'nah'
}

/** Was womit zusammenhaengt: gelernte Sessions, die im Plan mit dem Thema verknuepft sind (`links`, beide Richtungen) */
export function examLinks(s: State, day: number): ExamLink[] {
  const d = getDay(day)
  const ok = (x: Day) => x.day !== day && !isBlockMix(x) && !isProject(x) && dayDone(s, x.day)
  const out: ExamLink[] = [
    ...d.links.map(getDay).filter(ok).map((x) => ({ day: x, dir: 'vor' as const })),
    ...ALL_DAYS.filter((x) => x.links.includes(day) && ok(x)).map((x) => ({ day: x, dir: 'nach' as const })),
  ]
  if (out.length) return out
  // nichts direkt verknuepft: die naechstgelegenen gelernten Sessions, das Modell sucht die klarste Verbindung
  return ALL_DAYS.filter(ok)
    .sort((a, b) => Math.abs(a.day - day) - Math.abs(b.day - day))
    .slice(0, 6)
    .map((x) => ({ day: x, dir: 'nah' as const }))
}

/** Fragen eines Tests: erst anwenden, zum Schluss ein Zusammenhang (wenn es ein zweites gelerntes Thema gibt) */
export function examPlan(s: State, day: number): ExamQuestion['kind'][] {
  return [...Array<'anwenden'>(EXAM_APPLY).fill('anwenden'), ...(examLinks(s, day).length ? ['zusammenhang' as const] : [])]
}
