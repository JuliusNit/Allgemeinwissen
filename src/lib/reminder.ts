import { App } from '@capacitor/app'
import { LocalNotifications } from '@capacitor/local-notifications'
import { getDay } from '../data/plan'
import { NATIVE } from './native'
import { currentNode } from './path'
import { getState, setState, subscribeStore, today, type State } from './store'
import { toDate } from './streak'

// Taegliche Erinnerung "Deine Session wartet" (nur native App, ohne Server): lokale Mitteilungen fuer die
// naechsten DAYS_AHEAD Tage, je eine pro Tag. Ist die heutige Session (oder Station) schon fertig, faellt die
// von heute weg. Bei jedem Start/Zurueckkehren und jeder Aenderung am Fortschritt wird neu geplant –
// wer die App laenger nicht oeffnet, bekommt also noch DAYS_AHEAD Tage lang Erinnerungen.

const BASE_ID = 9000
const DAYS_AHEAD = 30 // iOS haelt hoechstens 64 geplante Mitteilungen

export interface Reminder {
  on: boolean
  /** HH:MM */
  time: string
}

export const DEFAULT_REMINDER: Reminder = { on: false, time: '18:00' }

/** Heute schon eine Session oder Station abgeschlossen */
export function doneToday(s: State): boolean {
  const t = today()
  return Object.values(s.days).some((d) => d.completedAt && toDate(d.completedAt) === t) || Object.values(s.reviews).some((v) => toDate(v) === t)
}

function body(s: State): string {
  const n = currentNode(s)
  if (n.kind === 'day') return getDay(n.day).title
  return n.kind === 'review' ? 'Wiederholung' : 'Grundcheck'
}

let lastKey = ''

async function reschedule(force = false) {
  const s = getState()
  const r = s.reminder ?? DEFAULT_REMINDER
  const key = `${r.on}|${r.time}|${today()}|${doneToday(s)}|${body(s)}`
  if (!force && key === lastKey) return
  lastKey = key
  const ids = Array.from({ length: DAYS_AHEAD + 1 }, (_, i) => ({ id: BASE_ID + i }))
  await LocalNotifications.cancel({ notifications: ids }).catch(() => {})
  if (!r.on) return
  if ((await LocalNotifications.checkPermissions()).display !== 'granted') return
  const [h, m] = r.time.split(':').map(Number)
  const now = Date.now()
  const skipToday = doneToday(s)
  const text = body(s)
  const notifications = []
  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const at = new Date()
    at.setDate(at.getDate() + i)
    at.setHours(h, m, 0, 0)
    if (at.getTime() <= now || (i === 0 && skipToday)) continue
    notifications.push({ id: BASE_ID + i, title: 'Deine Session wartet', body: text, schedule: { at, allowWhileIdle: true }, isExactNotification: false })
  }
  if (notifications.length) await LocalNotifications.schedule({ notifications })
}

/** Erinnerung an/aus oder neue Uhrzeit. Rueckgabe: Fehlermeldung oder '' */
export async function setReminder(p: Partial<Reminder>): Promise<string> {
  const next = { ...DEFAULT_REMINDER, ...getState().reminder, ...p }
  if (next.on) {
    let perm = await LocalNotifications.checkPermissions()
    if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions()
    if (perm.display !== 'granted') {
      setState((s) => ({ ...s, reminder: { ...next, on: false } }))
      return 'Mitteilungen sind für Allgemeinwissen ausgeschaltet – in den Einstellungen des Geräts erlauben.'
    }
  }
  setState((s) => ({ ...s, reminder: next }))
  await reschedule(true).catch(() => {})
  return ''
}

export function startReminders() {
  if (!NATIVE) return
  void reschedule(true).catch(() => {})
  let t = 0
  subscribeStore(() => {
    window.clearTimeout(t)
    t = window.setTimeout(() => void reschedule().catch(() => {}), 1000)
  })
  void App.addListener('resume', () => void reschedule(true).catch(() => {}))
}
