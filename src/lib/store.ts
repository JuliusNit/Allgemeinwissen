import { useSyncExternalStore } from 'react'
import { DAYS, defaultVideos, getDay, type Video } from '../data/plan'
import { fmtTime } from './video'

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  /** Zeitpunkt (ms) – fuer die Antwortzeit-Analyse */
  at?: number
}

export type DayStatus = 'offen' | 'laeuft' | 'fertig'

/** Notiz zu einem Video, optional mit Zeitmarke (Sekunden) */
export interface VideoNote {
  id: string
  t?: number
  text: string
}

export interface DayState {
  status: DayStatus
  videos?: Video[]
  watched?: string[]
  notes?: string
  /** Video-ID → Notizen am Rand des Players */
  videoNotes?: Record<string, VideoNote[]>
  /** Video-ID → zuletzt gesehene Stelle (Sekunden) */
  videoPos?: Record<string, number>
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

/** Protokoll jeder Kartenabfrage (Bewertung + Zeit bis zum Aufdecken) */
export interface CardLog {
  day: number
  rating: 0 | 1 | 2 | 3
  ms: number
  at: string
}

export interface CommunityMsg {
  id: string
  channel: string
  author: 'ich' | 'ki'
  text: string
  at: number
}

export interface Settings {
  apiUrl: string
  apiKey: string
  model: string
  /** Denkmodus (Qwen/vLLM): gruendlicher, aber langsamer */
  thinking: boolean
}

export interface Profile {
  name: string
  /** Profilbild als data-URL (verkleinert) */
  avatar?: string
}

export interface Focus {
  choice?: string // 'breit' oder Bereichs-ID
  advice?: string
  at?: string
}

export interface State {
  version: 1
  days: Record<number, DayState>
  cards: Card[]
  cardLog: CardLog[]
  /** abgeschlossene Wiederholungs-Stationen: id → Datum */
  reviews: Record<string, string>
  community: CommunityMsg[]
  profile: Profile
  focus: Focus
  settings: Settings
}

const KEY = 'allgemeinwissen-v1'

export const DEFAULT_API_URL = 'https://ai.inference2.corpus.music/v1/chat/completions'
export const DEFAULT_MODEL = 'qwen3.8-27b'

// Key aus der lokalen .env nur im Dev-Server; im Build ist DEV false und der Zweig faellt weg
const DEV_KEY: string = import.meta.env.DEV ? (import.meta.env.VITE_DEV_LLM_KEY ?? '') : ''

const initial: State = {
  version: 1,
  days: {},
  cards: [],
  cardLog: [],
  reviews: {},
  community: [],
  profile: { name: 'Julius' },
  focus: {},
  settings: { apiUrl: DEFAULT_API_URL, apiKey: DEV_KEY, model: DEFAULT_MODEL, thinking: false },
}

function migrateSettings(raw: Partial<Settings> | undefined): Settings {
  const s = { ...initial.settings, ...raw }
  // Umstieg von Anthropic auf den OpenAI-kompatiblen Endpunkt
  if (!s.model || s.model.startsWith('claude')) s.model = DEFAULT_MODEL
  if (s.apiKey.startsWith('sk-ant')) s.apiKey = ''
  if (!s.apiKey) s.apiKey = DEV_KEY
  if (!s.apiUrl) s.apiUrl = DEFAULT_API_URL
  return { apiUrl: s.apiUrl, apiKey: s.apiKey, model: s.model, thinking: !!s.thinking }
}

function normalize(parsed: Partial<State>): State {
  return {
    ...initial,
    ...parsed,
    version: 1,
    profile: { ...initial.profile, ...parsed.profile },
    focus: { ...parsed.focus },
    settings: migrateSettings(parsed.settings),
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    return normalize(JSON.parse(raw) as Partial<State>)
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

/** Video-Notizen als Text (fuer KI und Uebersicht), nach Zeitmarke sortiert */
export function videoNotesText(s: State, day: number): string {
  const ds = dayState(s, day)
  return videosOf(s, day)
    .map((v) => {
      const notes = sortNotes(ds.videoNotes?.[v.id] ?? [])
      if (!notes.length) return ''
      return `${v.title}:\n` + notes.map((n) => `- ${n.t !== undefined ? `[${fmtTime(n.t)}] ` : ''}${n.text}`).join('\n')
    })
    .filter(Boolean)
    .join('\n')
}

export function sortNotes(notes: VideoNote[]): VideoNote[] {
  return [...notes].sort((a, b) => (a.t ?? Infinity) - (b.t ?? Infinity))
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
  // Sicherung ohne API-Key, damit sie gefahrlos zwischen Geraeten wandern kann
  return JSON.stringify({ ...state, settings: { ...state.settings, apiKey: '' } }, null, 2)
}

export function importJson(text: string) {
  const parsed = JSON.parse(text) as State
  if (parsed.version !== 1 || typeof parsed.days !== 'object') throw new Error('Keine gültige Sicherung')
  // API-Key des Geraets behalten, wenn die Sicherung keinen hat
  const apiKey = parsed.settings?.apiKey || state.settings.apiKey
  setState(() => normalize({ ...parsed, settings: { ...parsed.settings, apiKey } }))
}

export function resetAll() {
  setState((s) => ({ ...initial, settings: s.settings, profile: s.profile }))
}
