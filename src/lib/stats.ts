import { AREAS, DAYS, MAP_AREAS, type AreaId } from '../data/plan'
import { isRepeat } from '../data/school'
import { stationOf, type BasisNode } from './path'
import { dayState, type ChatMsg, type State } from './store'

// Auswertung des Verstaendnischecks: das Modell setzt nach jeder Antwort einen Marker
// [[BEWERTUNG: richtig|teilweise|falsch | 1-5]] (Ergebnis | Praezision), die Zeitstempel
// der Nachrichten liefern die Antwortzeit.

export type Verdict = 'richtig' | 'teilweise' | 'falsch'

export interface QA {
  question: string
  answer: string
  feedback: string
  verdict?: Verdict
  precision?: number
  ms?: number
}

const MARK = /\[\[BEWERTUNG:\s*(richtig|teilweise|falsch)\s*\|\s*([1-5])\s*\]\]/i
export const DONE_MARKER = '[[SESSION_ABGESCHLOSSEN]]'

export function stripMarks(t: string): string {
  return t.replace(/\[\[BEWERTUNG[^\]]*\]\]\s*/gi, '').replace(DONE_MARKER, '').trim()
}

/** Nur der Frageteil einer Nachricht (ab „Frage n/m“), sonst alles */
function questionPart(t: string): string {
  const clean = stripMarks(t)
  const m = [...clean.matchAll(/(\*\*|#+\s*)?Frage\s+\d/g)]
  return m.length ? clean.slice(m[m.length - 1].index).trim() : clean
}

export function parseCheck(msgs: ChatMsg[] = []): QA[] {
  const out: QA[] = []
  for (let i = 2; i < msgs.length; i++) {
    const m = msgs[i]
    const prev = msgs[i - 1]
    if (m.role !== 'user' || prev?.role !== 'assistant') continue
    const next = msgs[i + 1]
    const mk = next?.role === 'assistant' ? MARK.exec(next.content) : null
    const ms = m.at && prev.at ? m.at - prev.at : undefined
    out.push({
      question: questionPart(prev.content),
      answer: m.content,
      feedback: next?.role === 'assistant' ? stripMarks(next.content) : '',
      verdict: mk ? (mk[1].toLowerCase() as Verdict) : undefined,
      precision: mk ? Number(mk[2]) : undefined,
      ms: ms && ms > 0 && ms < 30 * 60_000 ? ms : undefined,
    })
  }
  return out
}

export const VERDICT_SCORE: Record<Verdict, number> = { richtig: 1, teilweise: 0.5, falsch: 0 }

function scoreOf(msgs: ChatMsg[] | undefined): number | null {
  const qa = parseCheck(msgs).filter((q) => q.verdict)
  if (!qa.length) return null
  return qa.reduce((a, q) => a + VERDICT_SCORE[q.verdict!], 0) / qa.length
}

/** Abgehakte Start-Station der Grundwiederholung, an der die Session haengt */
export function basisCover(s: State, day: number): BasisNode | undefined {
  const n = stationOf(s.level, day)
  return n && s.reviews[n.id] ? n : undefined
}

/** Session gilt als gelernt: selbst abgeschlossen oder Schulstoff (laut Wissensstand bekannt) */
export function dayDone(s: State, day: number): boolean {
  return dayState(s, day).status === 'fertig' || isRepeat(s.level, day)
}

/** Datum, ab dem die Session als gelernt gilt */
export function dayDoneAt(s: State, day: number): string | undefined {
  const ds = dayState(s, day)
  if (ds.status === 'fertig' && ds.completedAt) return ds.completedAt
  const b = basisCover(s, day)
  return b ? s.reviews[b.id] : undefined
}

/** Anteil richtig (0–1) einer Session, null ohne bewertete Antworten; sonst Ergebnis des Grundchecks */
export function sessionScore(s: State, day: number): number | null {
  const own = scoreOf(dayState(s, day).check)
  if (own != null) return own
  const b = basisCover(s, day)
  return b ? scoreOf(s.basis[b.id]) : null
}

/** Ueberthemen fuer Statistik und Chat (MIX-Tage gehoeren zu keinem Bereich) */
export const STAT_AREAS: AreaId[] = [...MAP_AREAS, 'CHE', 'NERV']

export interface AreaStats {
  area: AreaId
  total: number
  done: number
  /** Anteile am ganzen Kreis (0–1) */
  good: number
  bad: number
  answers: number
  accuracy: number | null
  avgSec: number | null
  precision: number | null
  cardReviews: number
  retention: number | null
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

export function areaStats(s: State, area: AreaId): AreaStats {
  const days = DAYS.filter((d) => d.area === area)
  let good = 0
  let bad = 0
  const verdicts: number[] = []
  const secs: number[] = []
  const prec: number[] = []
  let done = 0
  // Grundcheck-Antworten zaehlen einmal je Bereich
  const stations = new Set<string>()
  for (const d of days) {
    const b = basisCover(s, d.day)
    if (b) stations.add(b.id)
  }
  const chats = [...days.map((d) => dayState(s, d.day).check), ...[...stations].map((id) => s.basis[id])]
  for (const c of chats) {
    for (const q of parseCheck(c)) {
      if (q.verdict) verdicts.push(VERDICT_SCORE[q.verdict])
      if (q.ms) secs.push(q.ms / 1000)
      if (q.precision) prec.push(q.precision)
    }
  }
  for (const d of days) {
    if (!dayDone(s, d.day)) continue
    done++
    // ohne Bewertungen zaehlt eine abgeschlossene Session als gut (Check wurde bestanden)
    const sc = sessionScore(s, d.day) ?? 1
    good += sc
    bad += 1 - sc
  }
  const dayset = new Set(days.map((d) => d.day))
  const logs = s.cardLog.filter((l) => dayset.has(l.day))
  return {
    area,
    total: days.length,
    done,
    good: days.length ? good / days.length : 0,
    bad: days.length ? bad / days.length : 0,
    answers: verdicts.length,
    accuracy: mean(verdicts),
    avgSec: mean(secs),
    precision: mean(prec),
    cardReviews: logs.length,
    retention: logs.length ? logs.filter((l) => l.rating >= 2).length / logs.length : null,
  }
}

/** Grobe Bereiche für die Selbsteinschätzung „was hat mir gefallen“ (Regler im Profil) */
export const LIKE_GROUPS: { id: string; name: string; areas: AreaId[] }[] = [
  { id: 'natur', name: 'Naturwissenschaft & Technik', areas: ['PHY', 'CHE', 'BIO', 'NERV', 'GEO', 'TECH'] },
  { id: 'gesellschaft', name: 'Gesellschaft, Politik & Wirtschaft', areas: ['GESCH', 'POL', 'WIRT'] },
  { id: 'mensch', name: 'Mensch & Denken', areas: ['PSY', 'PHIL', 'DENK'] },
  { id: 'kultur', name: 'Kultur, Kunst & Sprache', areas: ['LIT', 'KUL'] },
]
export const LIKE_LABELS = ['gar nicht', 'wenig', 'mittel', 'gern', 'sehr gern']

export function likesTable(s: State): string {
  const likes = s.focus.likes ?? {}
  return LIKE_GROUPS.filter((g) => likes[g.id] != null)
    .map((g) => `${g.name} (${g.areas.map((a) => AREAS[a].name).join(', ')}): ${LIKE_LABELS[likes[g.id]]} (${likes[g.id]}/4)`)
    .join('\n')
}

/** Kompakte Kennzahlen-Tabelle fuer die KI-Beratung */
export function statsTable(s: State): string {
  const rows = STAT_AREAS.map((a) => areaStats(s, a))
    .filter((x) => x.done || x.answers || x.cardReviews)
    .map(
      (x) =>
        `${AREAS[x.area].name}: ${x.done}/${x.total} Sessions, ${x.answers} Antworten, richtig ${x.accuracy == null ? '–' : Math.round(x.accuracy * 100) + ' %'}, Ø Antwortzeit ${x.avgSec == null ? '–' : Math.round(x.avgSec) + ' s'}, Präzision ${x.precision == null ? '–' : x.precision.toFixed(1) + '/5'}, Karten behalten ${x.retention == null ? '–' : Math.round(x.retention * 100) + ' %'} (${x.cardReviews} Abfragen)`,
    )
  return rows.join('\n')
}
