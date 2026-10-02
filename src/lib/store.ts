import { useSyncExternalStore } from 'react'
import { DAYS, defaultVideos, getDay, type Video } from '../data/plan'

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export type DayStatus = 'offen' | 'laeuft' | 'fertig'

export interface DayState {
  status: DayStatus
  videos?: Video[]
  watched?: string[]
  notes?: string
  anchor?: string
  questions?: ChatMsg[]
  check?: ChatMsg[]
  summary?: string
  startedAt?: string
  completedAt?: string
}

export interface Card {
  id: string
  day: number
  q: string
  a: string
  due: string // YYYY-MM-DD
  interval: number // Tage
  ease: number
  reps: number
}

export interface Settings {
  apiKey: string
  model: string
  effort: 'low' | 'medium' | 'high'
}

export interface State {
  version: 1
  days: Record<number, DayState>
  cards: Card[]
  settings: Settings
}

const KEY = 'allgemeinwissen-v1'

const initial: State = {
  version: 1,
  days: {},
  cards: [],
  settings: { apiKey: '', model: 'claude-opus-5-5', effort: 'medium' },
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as State
    return { ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings } }
  } catch {
    return initial
  }
}

let state: State = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Speicher voll oder blockiert – App laeuft im Speicher weiter
  }
}

export function setState(fn: (s: State) => State) {
  state = fn(state)
  persist()
  listeners.forEach((l) => l())
}

export function getState(): State {
  return state
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => select(state),
  )
}

const EMPTY_DAY: DayState = { status: 'offen' }

export function dayState(s: State, day: number): DayState {
  return s.days[day] ?? EMPTY_DAY
}

export function updateDay(day: number, fn: (d: DayState) => DayState) {
  setState((s) => ({ ...s, days: { ...s.days, [day]: fn(dayState(s, day)) } }))
}

export function videosOf(s: State, day: number): Video[] {
  return dayState(s, day).videos ?? defaultVideos(getDay(day))
}

/** Aktuelle Session = erster nicht abgeschlossener Tag */
export function currentDay(s: State): number {
  const open = DAYS.find((d) => dayState(s, d.day).status !== 'fertig')
  return open ? open.day : DAYS.length
}

export function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function exportJson(): string {
  return JSON.stringify(state, null, 2)
}

export function importJson(text: string) {
  const parsed = JSON.parse(text) as State
  if (parsed.version !== 1 || typeof parsed.days !== 'object') throw new Error('Keine gültige Sicherung')
  // API-Key des Geraets behalten, wenn die Sicherung keinen hat
  const apiKey = parsed.settings?.apiKey || state.settings.apiKey
  setState(() => ({ ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings, apiKey } }))
}

export function resetAll() {
  setState((s) => ({ ...initial, settings: s.settings }))
}
