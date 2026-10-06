import { today, type State } from './store'

// Tages-Streak ohne eigenes Protokoll: aus vorhandenen Zeitstempeln abgeleitet
// (eigene Chat-Nachrichten, Session-Start/-Abschluss, Kartenabfragen, Wiederholungs-Stationen).

function localDate(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 'YYYY-MM-DD' oder ISO-Zeitstempel → lokales Datum */
function toDate(v: string): string {
  return v.length === 10 ? v : localDate(Date.parse(v))
}

export function activeDates(s: State): Set<string> {
  const out = new Set<string>()
  for (const d of Object.values(s.days)) {
    if (d.startedAt) out.add(toDate(d.startedAt))
    if (d.completedAt) out.add(toDate(d.completedAt))
    for (const m of [...(d.questions ?? []), ...(d.check ?? [])]) if (m.role === 'user' && m.at) out.add(localDate(m.at))
  }
  for (const l of s.cardLog) out.add(toDate(l.at))
  for (const v of Object.values(s.reviews)) out.add(toDate(v))
  return out
}

/** Anzahl aufeinanderfolgender Lerntage bis heute; ist heute noch nichts passiert, zaehlt die Serie bis gestern weiter */
export function streak(s: State): { days: number; today: boolean } {
  const dates = activeDates(s)
  const t = today()
  const doneToday = dates.has(t)
  const d = new Date()
  if (!doneToday) d.setDate(d.getDate() - 1)
  let n = 0
  while (dates.has(localDate(d.getTime()))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return { days: n, today: doneToday }
}
