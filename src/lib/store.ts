import { useSyncExternalStore } from 'react'
import { DAYS, defaultVideos, getDay, upgradeVideos, type Video } from '../data/plan'
import { parseLevel, type Level } from '../data/school'
import type { Reminder } from './reminder'
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
  /** „Auffrischen“: Schul-Grundwissen, auf dem die Session aufbaut */
  refresh?: string
  questions?: ChatMsg[]
  check?: ChatMsg[]
  summary?: string
  /** Lernvideo- und Lernzettel-Kasten aufgeklappt (Standard: zu) */
  videosOpen?: boolean
  sheetOpen?: boolean
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

/** Pruefungs-Wiederholung eines Themas: laufender Test + Ergebnisse frueherer Tests */
export interface ExamState {
  chat?: ChatMsg[]
  results: { at: string; score: number | null }[]
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
  likes?: Record<string, number> // Selbsteinschätzung je Grobbereich (LIKE_GROUPS), 0–4
}

/** Wissenshäppchen (Entdecken): Verhalten je Häppchen, daraus lib/feed.ts das Gefallen */
export interface BiteLog {
  first: string
  last: string
  /** wie oft geöffnet */
  views: number
  /** angesehene Zeit gesamt (ms) und erwartete Dauer eines Durchlaufs (ms) */
  ms: number
  dur: number
  /** weitester Stand im Häppchen (0–1) */
  best: number
  /** bis zur Zusammenfassung gekommen */
  done: number
  /** zurückgewischt, um etwas nochmal zu sehen */
  back: number
  /** nach wenigen Sekunden weitergewischt */
  skips: number
  /** angehalten (Finger gehalten) */
  holds: number
  /** zur passenden Session gesprungen */
  link: number
  /** berechnetes Gefallen −1…1 (lib/feed.ts → biteLike) */
  like: number
}

export interface FeedState {
  log: Record<string, BiteLog>
  saved: string[]
  /** heute geöffnete Häppchen (Grenze ohne Premium) */
  daily?: { date: string; ids: string[] }
}

export interface State {
  version: 1
  days: Record<number, DayState>
  cards: Card[]
  cardLog: CardLog[]
  /** abgeschlossene Wiederholungs-Stationen: id → Datum */
  reviews: Record<string, string>
  /** Grundwiederholung: Station → Check-Chat */
  basis: Record<string, ChatMsg[]>
  /** Pruefungsmodus: Tag → Tests */
  exams: Record<number, ExamState>
  community: CommunityMsg[]
  profile: Profile
  focus: Focus
  settings: Settings
  /** Wissensstand (Schule/Studium/Beruf) → bestimmt die Wiederholungstage */
  level?: Level
  /** Montag (YYYY-MM-DD) der Woche, in der der Wochenrückblick zuletzt gezeigt wurde */
  recapSeen?: string
  /** Einführungs-Slides auf diesem Gerät gesehen */
  onboarded?: boolean
  /** Konto, dem der Fortschritt auf diesem Gerät gehört */
  owner?: string
  /** Mit Server, aber ohne Konto gestartet: Lernpfad lokal, Konto erst für KI und Austausch */
  guest?: boolean
  /** Videolisten vom Editor (Supabase), Tag → Videos; lokal zwischengespeichert für offline */
  content: Record<number, Video[]>
  /** Zeitpunkt der letzten Änderung am Fortschritt (Abgleich mit dem Konto, lib/cloud.ts) */
  progressAt?: string
  /** Wissenshäppchen: Verhalten, Gemerkt, Tageszähler */
  feed: FeedState
  /** Ton im Entdecken-Feed (Geräte-Einstellung) */
  feedSound?: boolean
  /** Tägliche Erinnerung der nativen App (lib/reminder.ts), Geräte-Einstellung */
  reminder?: Reminder
}

/** Teil des Zustands, der ins Konto wandert – ohne Einstellungen/API-Key, Editor-Videolisten, Profil (eigene Tabelle) und Geräte-Flags */
export const PROGRESS_KEYS = ['days', 'cards', 'cardLog', 'reviews', 'basis', 'exams', 'community', 'focus', 'recapSeen', 'feed'] as const
export type Progress = Pick<State, (typeof PROGRESS_KEYS)[number]>

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
  basis: {},
  exams: {},
  community: [],
  profile: { name: '' },
  focus: {},
  feed: { log: {}, saved: [] },
  content: {},
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
    feed: { log: {}, saved: [], ...parsed.feed },
    content: { ...parsed.content },
    exams: { ...parsed.exams },
    basis: { ...parsed.basis },
    level: parseLevel(parsed.level),
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
  const prev = state
  let next = fn(state)
  // Fortschritt geaendert → Zeitstempel fuer den Abgleich, ausser der Aufruf setzt ihn selbst (Stand aus dem Konto)
  if (next.progressAt === prev.progressAt && PROGRESS_KEYS.some((k) => next[k] !== prev[k])) next = { ...next, progressAt: new Date().toISOString() }
  state = next
  persist()
  listeners.forEach((l) => l())
}

export function getState(): State {
  return state
}

export function subscribeStore(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
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

// gleiche Eingabe → gleiches Array, sonst rendert useStore endlos neu
const upgraded = new WeakMap<Video[], Video[]>()

export function videosOf(s: State, day: number): Video[] {
  // Reihenfolge: vom Editor veroeffentlicht → fruehere lokale Aenderung → Standard
  const stored = s.content[day] ?? dayState(s, day).videos
  if (!stored) return defaultVideos(getDay(day))
  let v = upgraded.get(stored)
  if (!v) {
    v = upgradeVideos(getDay(day), stored)
    upgraded.set(stored, v)
  }
  return v
}

const EMPTY_EXAM: ExamState = { results: [] }

export function examState(s: State, day: number): ExamState {
  return s.exams[day] ?? EMPTY_EXAM
}

export function updateExam(day: number, fn: (e: ExamState) => ExamState) {
  setState((s) => ({ ...s, exams: { ...s.exams, [day]: fn(examState(s, day)) } }))
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
  setState((s) => normalize({ ...parsed, settings: { ...parsed.settings, apiKey }, owner: s.owner, guest: s.guest, content: s.content, progressAt: new Date().toISOString() }))
}

export function progressOf(s: State): Progress {
  return Object.fromEntries(PROGRESS_KEYS.map((k) => [k, s[k]])) as Progress
}

/** Stand aus dem Konto uebernehmen (Zeitstempel = der des Kontos, damit er nicht gleich wieder hochgeladen wird) */
export function applyProgress(p: Partial<Progress>, at: string) {
  setState((s) => normalize({ ...s, ...Object.fromEntries(PROGRESS_KEYS.map((k) => [k, p[k] ?? initial[k]])), progressAt: at }))
}

/** abgeschlossene Sessions eines Fortschritts */
export function doneCount(p: Partial<Progress>): number {
  return Object.values(p.days ?? {}).filter((d) => d?.status === 'fertig').length
}

export function progressEmpty(p: Partial<Progress>): boolean {
  return !Object.keys(p.days ?? {}).length && !p.cards?.length && !Object.keys(p.reviews ?? {}).length
}

export function resetAll() {
  setState((s) => ({ ...initial, settings: s.settings, feedSound: s.feedSound, profile: s.profile, level: s.level, onboarded: s.onboarded, owner: s.owner, guest: s.guest, content: s.content, reminder: s.reminder }))
}

/** Nach dem Löschen des Kontos: alles Persönliche weg, nur Einstellungen und die öffentlichen Videolisten bleiben */
export function wipeAll() {
  setState((s) => ({ ...initial, settings: { ...s.settings, apiKey: DEV_KEY }, feedSound: s.feedSound, onboarded: s.onboarded, content: s.content, reminder: s.reminder }))
}
