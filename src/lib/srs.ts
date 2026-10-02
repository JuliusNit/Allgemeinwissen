import { setState, today, type Card } from './store'

export type Rating = 0 | 1 | 2 | 3 // Nochmal · Schwer · Gut · Leicht

function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Vereinfachtes SM-2: Abstand waechst mit jeder richtigen Antwort, "Nochmal" setzt zurueck. */
export function schedule(c: Card, r: Rating): Card {
  const t = today()
  if (r === 0) return { ...c, reps: 0, interval: 0, ease: Math.max(1.3, c.ease - 0.2), due: t }
  let interval: number
  if (c.reps === 0) interval = r === 3 ? 3 : 1
  else if (c.reps === 1) interval = r === 1 ? 2 : r === 2 ? 3 : 5
  else interval = Math.round(c.interval * (r === 1 ? 1.2 : r === 2 ? c.ease : c.ease * 1.3))
  const ease = Math.min(3, Math.max(1.3, c.ease + (r === 1 ? -0.15 : r === 3 ? 0.15 : 0)))
  return { ...c, reps: c.reps + 1, interval: Math.max(1, interval), ease, due: addDays(t, Math.max(1, interval)) }
}

export function intervalLabel(c: Card, r: Rating): string {
  const n = schedule(c, r)
  return r === 0 ? 'gleich' : `${n.interval} T`
}

export function rateCard(id: string, r: Rating) {
  setState((s) => ({ ...s, cards: s.cards.map((c) => (c.id === id ? schedule(c, r) : c)) }))
}

export function addCards(day: number, items: { q: string; a: string }[]) {
  const t = today()
  const cards: Card[] = items.map((it, i) => ({
    id: `${day}-${Date.now()}-${i}`,
    day,
    q: it.q,
    a: it.a,
    due: addDays(t, 1),
    interval: 0,
    ease: 2.5,
    reps: 0,
  }))
  setState((s) => ({ ...s, cards: [...s.cards, ...cards] }))
}

export function deleteCard(id: string) {
  setState((s) => ({ ...s, cards: s.cards.filter((c) => c.id !== id) }))
}

export function dueCards(cards: Card[]): Card[] {
  const t = today()
  return cards.filter((c) => c.due <= t).sort((a, b) => a.due.localeCompare(b.due))
}
