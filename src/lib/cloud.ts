import { useSyncExternalStore } from 'react'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import { parseLevel, type Level } from '../data/school'
import type { Video } from '../data/plan'
import { getState, resetAll, setState, useStore } from './store'

// Supabase: Konten (E-Mail + Passwort), Rollen (user | editor), Austausch-Chat und die vom Editor
// gepflegten Videolisten. Adresse + Publishable Key kommen beim Bauen aus der lokalen .env
// (VITE_SUPABASE_URL, VITE_SUPABASE_KEY). Ohne Konfiguration laeuft alles nur lokal (ohne Konto).
// Der Publishable Key ist oeffentlich gedacht; geschuetzt wird ueber Row Level Security (supabase/schema.sql).
// Die Rolle "editor" laesst sich nur im SQL-Editor vergeben (Trigger in schema.sql).

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

// PKCE: Bestaetigungs-Links kommen mit ?code=… zurueck und stoeren so das Hash-Routing nicht
export const cloud: SupabaseClient | null = url && key ? createClient(url, key, { auth: { flowType: 'pkce' } }) : null

export type Role = 'user' | 'editor'

export interface Auth {
  ready: boolean
  user: User | null
  role: Role
  /** Rueckkehr ueber den "Passwort vergessen"-Link → neues Passwort setzen */
  recovery: boolean
}

const RESET_FLAG = 'aw-reset'
const startRecovery = new URLSearchParams(location.search).get('reset') === '1'
if (startRecovery) {
  try {
    sessionStorage.setItem(RESET_FLAG, '1')
  } catch {
    // ohne sessionStorage: Flag gilt nur fuer diesen Aufruf
  }
}

function recoveryFlag(): boolean {
  try {
    return startRecovery || sessionStorage.getItem(RESET_FLAG) === '1'
  } catch {
    return startRecovery
  }
}

let auth: Auth = { ready: !cloud, user: null, role: 'user', recovery: false }
const listeners = new Set<() => void>()

function setAuth(p: Partial<Auth>) {
  auth = { ...auth, ...p }
  listeners.forEach((l) => l())
}

export function getAuth(): Auth {
  return auth
}

export function useAuth(): Auth {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => auth,
  )
}

/** Darf Inhalte (Videolisten) bearbeiten: Editor – oder ohne Server lokal jeder */
export function useCanEdit(): boolean {
  const a = useAuth()
  return !cloud || a.role === 'editor'
}

function baseUrl(): string {
  return location.origin + location.pathname
}

if (cloud) {
  cloud.auth.onAuthStateChange((event, session) => {
    const u = session?.user
    // fruehere anonyme Sitzungen zaehlen nicht als Konto
    const user = u && !u.is_anonymous ? u : null
    const recovery = !!user && (event === 'PASSWORD_RECOVERY' || recoveryFlag())
    setAuth({ ready: true, user, role: user && user.id === auth.user?.id ? auth.role : 'user', recovery })
    if (location.search.includes('code=') || location.search.includes('reset=')) history.replaceState(null, '', location.pathname + location.hash)
    // Supabase-Aufrufe nicht direkt im Callback abwarten (Sperre im Client)
    if (user && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) window.setTimeout(() => void afterLogin(user), 0)
    if (!user) syncedProfile = ''
  })
}

/** Nach der Anmeldung: Rolle laden, Profil/Wissensstand uebernehmen, Videolisten holen */
async function afterLogin(user: User) {
  if (!cloud) return
  const s = getState()
  if (s.owner && s.owner !== user.id) {
    const hasProgress = Object.keys(s.days).length > 0 || s.cards.length > 0
    if (hasProgress && confirm('Auf diesem Gerät liegt der Fortschritt eines anderen Kontos. Für dieses Konto neu beginnen?\n(Abbrechen = Fortschritt übernehmen)')) resetAll()
  }
  const meta = user.user_metadata as { name?: string; level?: unknown }
  const { data: row } = await cloud.from('profiles').select('name,avatar,role').eq('id', user.id).maybeSingle()
  const p = row as { name: string; avatar: string | null; role?: Role } | null
  setState((x) => ({
    ...x,
    owner: user.id,
    onboarded: true,
    level: parseLevel(meta.level) ?? x.level,
    profile: p ? { name: p.name, avatar: p.avatar ?? x.profile.avatar } : { ...x.profile, name: x.profile.name || meta.name || '' },
  }))
  setAuth({ role: p?.role === 'editor' ? 'editor' : 'user' })
  await syncProfile().catch(() => {})
  await loadContent().catch(() => {})
}

// ---------- Konto ----------

const MESSAGES: [RegExp, string][] = [
  [/invalid login credentials/i, 'E-Mail oder Passwort falsch.'],
  [/email not confirmed/i, 'E-Mail noch nicht bestätigt – bitte den Link in der Mail öffnen.'],
  [/already registered|already been registered/i, 'Diese E-Mail ist schon registriert – bitte anmelden.'],
  [/rate limit/i, 'Zu viele Versuche – bitte später erneut versuchen.'],
  [/password should|weak password/i, 'Passwort zu schwach.'],
  [/invalid.*email|email.*invalid/i, 'Ungültige E-Mail-Adresse.'],
  [/same.*password|different from the old/i, 'Das neue Passwort muss sich vom alten unterscheiden.'],
  [/fetch|network/i, 'Keine Verbindung zum Server.'],
]

function authError(e: { message: string } | null | undefined): Error {
  const m = e?.message ?? 'unbekannter Fehler'
  return new Error(MESSAGES.find(([r]) => r.test(m))?.[1] ?? m)
}

function need(): SupabaseClient {
  if (!cloud) throw new Error('Kein Server konfiguriert.')
  return cloud
}

/** Registrieren. Rueckgabe: true = direkt angemeldet, false = Bestaetigungs-Mail unterwegs */
export async function signUp(email: string, password: string, name: string, level: Level): Promise<boolean> {
  const { data, error } = await need().auth.signUp({
    email,
    password,
    options: { data: { name, level }, emailRedirectTo: baseUrl() },
  })
  if (error) throw authError(error)
  // bei aktivierter Bestaetigung meldet Supabase bekannte Adressen nicht als Fehler, sondern ohne Identitaet
  if (data.user && !data.user.identities?.length) throw authError({ message: 'already registered' })
  setState((s) => ({ ...s, level, profile: { ...s.profile, name } }))
  return !!data.session
}

export async function signIn(email: string, password: string) {
  const { error } = await need().auth.signInWithPassword({ email, password })
  if (error) throw authError(error)
}

export async function signOut() {
  await need().auth.signOut()
  setAuth({ user: null, role: 'user', recovery: false })
}

export async function sendReset(email: string) {
  const { error } = await need().auth.resetPasswordForEmail(email, { redirectTo: `${baseUrl()}?reset=1` })
  if (error) throw authError(error)
}

export async function setNewPassword(password: string) {
  const { error } = await need().auth.updateUser({ password })
  if (error) throw authError(error)
  try {
    sessionStorage.removeItem(RESET_FLAG)
  } catch {
    // egal
  }
  setAuth({ recovery: false })
}

export async function resendConfirmation(email: string) {
  const { error } = await need().auth.resend({ type: 'signup', email, options: { emailRedirectTo: baseUrl() } })
  if (error) throw authError(error)
}

/** Wissensstand lokal und im Konto speichern */
export async function saveLevel(level: Level) {
  setState((s) => ({ ...s, level }))
  if (cloud && auth.user) {
    const { error } = await cloud.auth.updateUser({ data: { level } })
    if (error) throw authError(error)
  }
}

// ---------- Profil + Chat ----------

export interface CloudMsg {
  id: number
  channel: string
  user_id: string
  is_ki: boolean
  text: string
  created_at: string
}

export interface CloudProfile {
  id: string
  name: string
  avatar: string | null
}

let syncedProfile = ''

/** Angemeldetes Konto (Chat & Profil brauchen eins) */
export async function ensureUser(): Promise<string> {
  need()
  if (!auth.user) throw new Error('Bitte anmelden.')
  await syncProfile()
  return auth.user.id
}

export async function syncProfile() {
  const uid = auth.user?.id
  if (!cloud || !uid) return
  const { name, avatar } = getState().profile
  const sig = `${uid}|${name}|${avatar?.length ?? 0}|${avatar?.slice(-32) ?? ''}`
  if (sig === syncedProfile) return
  // "role" wird nie mitgeschickt; der Trigger in der Datenbank schuetzt sie zusaetzlich
  const { error } = await cloud.from('profiles').upsert({ id: uid, name: name.trim().slice(0, 40) || 'Anonym', avatar: avatar ?? null, updated_at: new Date().toISOString() })
  if (error) throw new Error(`Profil konnte nicht gespeichert werden: ${error.message}`)
  syncedProfile = sig
}

const profiles = new Map<string, CloudProfile>()

export async function loadProfiles(ids: string[]): Promise<Map<string, CloudProfile>> {
  const missing = [...new Set(ids)].filter((id) => !profiles.has(id))
  if (cloud && missing.length) {
    const { data } = await cloud.from('profiles').select('id,name,avatar').in('id', missing)
    for (const p of (data ?? []) as CloudProfile[]) profiles.set(p.id, p)
  }
  return profiles
}

/** Eigenes Profil im Cache aktualisieren (nach Namens-/Bildaenderung) */
export function forgetProfile(id: string) {
  profiles.delete(id)
}

export async function fetchMessages(channel: string, limit = 150): Promise<CloudMsg[]> {
  if (!cloud) return []
  const { data, error } = await cloud.from('messages').select('*').eq('channel', channel).order('created_at', { ascending: false }).limit(limit)
  if (error) throw new Error(`Nachrichten konnten nicht geladen werden: ${error.message}`)
  return ((data ?? []) as CloudMsg[]).reverse()
}

export async function postMessage(channel: string, text: string, isKi = false): Promise<CloudMsg> {
  const c = need()
  const uid = await ensureUser()
  const { data, error } = await c.from('messages').insert({ channel, text: text.slice(0, 4000), is_ki: isKi, user_id: uid }).select().single()
  if (error) throw new Error(`Senden fehlgeschlagen: ${error.message}`)
  return data as CloudMsg
}

export async function deleteMessage(id: number) {
  if (!cloud) return
  const { error } = await cloud.from('messages').delete().eq('id', id)
  if (error) throw new Error(`Löschen fehlgeschlagen: ${error.message}`)
}

/** Live: neue und geloeschte Nachrichten eines Kanals */
export function subscribe(channel: string, onInsert: (m: CloudMsg) => void, onDelete: (id: number) => void): () => void {
  if (!cloud) return () => {}
  const c = cloud
  const sub = c
    .channel(`messages:${channel}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel=eq.${channel}` }, (p) => onInsert(p.new as CloudMsg))
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (p) => onDelete((p.old as { id: number }).id))
    .subscribe()
  return () => {
    void c.removeChannel(sub)
  }
}

// ---------- Inhalte (nur Editor schreibt) ----------

/** Vom Editor veroeffentlichte Videolisten laden (fuer alle lesbar) */
export async function loadContent() {
  if (!cloud) return
  const { data, error } = await cloud.from('day_videos').select('day,videos')
  if (error) return
  const content: Record<number, Video[]> = {}
  for (const r of (data ?? []) as { day: number; videos: Video[] }[]) if (Array.isArray(r.videos)) content[r.day] = r.videos
  setState((s) => ({ ...s, content }))
}

/** Videoliste eines Tages speichern: mit Server fuer alle (nur Editor), ohne Server lokal */
export async function saveDayVideos(day: number, videos: Video[] | null) {
  if (!cloud) {
    setState((s) => ({ ...s, days: { ...s.days, [day]: { ...(s.days[day] ?? { status: 'offen' }), videos: videos ?? undefined } } }))
    return
  }
  if (auth.role !== 'editor') throw new Error('Nur der Editor kann Videos ändern.')
  const before = getState().content[day]
  // sofort anzeigen, bei Fehler zuruecknehmen
  setState((s) => {
    const content = { ...s.content }
    if (videos) content[day] = videos
    else delete content[day]
    return { ...s, content }
  })
  const { error } = videos
    ? await cloud.from('day_videos').upsert({ day, videos, updated_at: new Date().toISOString() })
    : await cloud.from('day_videos').delete().eq('day', day)
  if (error) {
    setState((s) => {
      const content = { ...s.content }
      if (before) content[day] = before
      else delete content[day]
      return { ...s, content }
    })
    throw new Error(`Speichern fehlgeschlagen: ${error.message}`)
  }
}

// ---------- KI ueber den Server ----------

/** Zugang zum KI-Proxy (Edge Function "ki") fuer angemeldete Konten; null ohne Server/Konto */
export async function kiProxy(): Promise<{ url: string; headers: Record<string, string> } | null> {
  if (!cloud || !url || !key || !auth.user) return null
  const { data } = await cloud.auth.getSession()
  const token = data.session?.access_token
  if (!token) return null
  return { url: `${url.replace(/\/$/, '')}/functions/v1/ki`, headers: { Authorization: `Bearer ${token}`, apikey: key } }
}

/** KI nutzbar: eigener Key – oder angemeldet mit Server (dann ueber den Proxy) */
export function useAiReady(): boolean {
  const a = useAuth()
  const ownKey = useStore((s) => !!s.settings.apiKey)
  return ownKey || (!!cloud && !!a.user)
}
