import { useSyncExternalStore } from 'react'
import { createClient, type EmailOtpType, type SupabaseClient, type User } from '@supabase/supabase-js'
import { App as NativeApp } from '@capacitor/app'
import { parseLevel, type Level } from '../data/school'
import { AUTH_SCHEME, AUTH_URL, NATIVE } from './native'
import type { Video } from '../data/plan'
import { applyProgress, doneCount, getState, progressEmpty, progressOf, resetAll, setState, subscribeStore, useStore, wipeAll, type Progress } from './store'

// Supabase: Konten (E-Mail + Passwort), Rollen (user | editor), Austausch-Chat und die vom Editor
// gepflegten Videolisten. Adresse + Publishable Key kommen beim Bauen aus der lokalen .env
// (VITE_SUPABASE_URL, VITE_SUPABASE_KEY). Ohne Konfiguration laeuft alles nur lokal (ohne Konto).
// Der Publishable Key ist oeffentlich gedacht; geschuetzt wird ueber Row Level Security (supabase/schema.sql).
// Die Rolle "editor" laesst sich nur im SQL-Editor vergeben (Trigger in schema.sql).

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

// Implicit Flow: Bestaetigungs-Links kommen mit #access_token=… zurueck und melden direkt an – auch in einem
// anderen Browser als bei der Registrierung (PKCE ginge nur im selben). supabase-js liest den Hash und leert ihn;
// das Hash-Routing faellt dann auf Home zurueck.
export const cloud: SupabaseClient | null = url && key ? createClient(url, key, { auth: { flowType: 'implicit' } }) : null

export type Role = 'user' | 'editor'

export interface Auth {
  ready: boolean
  user: User | null
  role: Role
  /** Rueckkehr ueber den "Passwort vergessen"-Link → neues Passwort setzen */
  recovery: boolean
  /** Geburtsjahr des Kontos: undefined = noch nicht geladen, null = fehlt (wird einmal abgefragt) */
  birthYear?: number | null
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

function setResetFlag() {
  try {
    sessionStorage.setItem(RESET_FLAG, '1')
  } catch {
    // ohne sessionStorage: PASSWORD_RECOVERY-Ereignis reicht
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

/**
 * Ruecksprung aus Konto-Mails (Bestaetigung, Passwort vergessen). Web: die eigene Adresse.
 * Native App: eigenes URL-Schema (lib/native.ts) – location.origin ist dort capacitor://localhost bzw.
 * https://localhost und aus einer Mail nicht erreichbar. Beide Adressen stehen in Supabase → Auth → Redirect URLs.
 */
function redirectUrl(reset = false): string {
  const base = NATIVE ? AUTH_URL : location.origin + location.pathname
  return reset ? `${base}?reset=1` : base
}

const OTP_TYPES = ['email', 'signup', 'recovery', 'magiclink', 'email_change']

/** Link mit ?token_hash=…&type=… (E-Mail-Vorlage) einloesen */
function verifyTokenHash(c: SupabaseClient, tokenHash: string, type: string) {
  return c.auth.verifyOtp({ token_hash: tokenHash, type: (type === 'signup' ? 'email' : type) as EmailOtpType }).then(({ error }) => {
    if (error) alert('Bestätigungslink ungültig oder abgelaufen – bitte anmelden oder neuen Link anfordern.')
  })
}

/**
 * Native App, geoeffnet ueber de.allgemeinwissen.app://auth…: entweder ?token_hash=…&type=… (eigene Vorlage)
 * oder – nach dem Umweg ueber Supabase /verify – #access_token=…&refresh_token=…&type=… (Implicit Flow).
 */
let lastLink = ''
async function openAuthLink(c: SupabaseClient, link: string) {
  if (!link.startsWith(`${AUTH_SCHEME}:`) || link === lastLink) return
  lastLink = link
  const u = new URL(link)
  const q = u.searchParams
  const h = new URLSearchParams(u.hash.slice(1))
  const type = q.get('type') ?? h.get('type') ?? ''
  if (q.get('reset') === '1' || type === 'recovery') setResetFlag()
  if (h.get('error') || q.get('error')) {
    alert('Bestätigungslink ungültig oder abgelaufen – bitte anmelden oder neuen Link anfordern.')
    return
  }
  const tokenHash = q.get('token_hash')
  if (tokenHash && OTP_TYPES.includes(type)) return verifyTokenHash(c, tokenHash, type)
  const access_token = h.get('access_token')
  const refresh_token = h.get('refresh_token')
  if (access_token && refresh_token) {
    const { error } = await c.auth.setSession({ access_token, refresh_token })
    if (error) alert('Anmeldung über den Link fehlgeschlagen – bitte anmelden.')
  }
}

if (cloud) {
  cloud.auth.onAuthStateChange((event, session) => {
    const u = session?.user
    // fruehere anonyme Sitzungen zaehlen nicht als Konto
    const user = u && !u.is_anonymous ? u : null
    const recovery = !!user && (event === 'PASSWORD_RECOVERY' || recoveryFlag())
    const same = !!user && user.id === auth.user?.id
    setAuth({ ready: true, user, role: same ? auth.role : 'user', birthYear: same ? auth.birthYear : undefined, recovery })
    token = session?.access_token ?? ''
    if (/code=|reset=|token_hash=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash)
    // Supabase-Aufrufe nicht direkt im Callback abwarten (Sperre im Client)
    if (user && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) window.setTimeout(() => void afterLogin(user), 0)
    if (!user) {
      syncedProfile = ''
      stopSync()
    }
  })

  // Bestaetigungs-Mail mit ?token_hash=…&type=… (E-Mail-Vorlage in Supabase): meldet direkt an –
  // anders als ?code=… (PKCE) auch, wenn der Link in einem anderen Browser aufgeht als die Registrierung
  const q = new URLSearchParams(location.search)
  const tokenHash = q.get('token_hash')
  const type = q.get('type') ?? ''
  if (tokenHash && OTP_TYPES.includes(type)) {
    history.replaceState(null, '', location.pathname + location.hash)
    void verifyTokenHash(cloud, tokenHash, type)
  }

  if (NATIVE) {
    const c = cloud
    void NativeApp.addListener('appUrlOpen', ({ url }) => void openAuthLink(c, url))
    void NativeApp.getLaunchUrl().then((r) => (r?.url ? openAuthLink(c, r.url) : undefined)).catch(() => {})
  }
}

/** Nach der Anmeldung: Rolle laden, Profil/Wissensstand uebernehmen, Videolisten holen */
async function afterLogin(user: User) {
  if (!cloud) return
  const s = getState()
  if (s.owner && s.owner !== user.id) {
    const hasProgress = Object.keys(s.days).length > 0 || s.cards.length > 0
    if (hasProgress && confirm('Auf diesem Gerät liegt der Fortschritt eines anderen Kontos. Für dieses Konto neu beginnen?\n(Abbrechen = Fortschritt übernehmen)')) resetAll()
  }
  const meta = user.user_metadata as { name?: string; level?: unknown; birth_year?: unknown }
  const { data: row } = await cloud.from('profiles').select('name,avatar,role').eq('id', user.id).maybeSingle()
  const p = row as { name: string; avatar: string | null; role?: Role } | null
  setState((x) => ({
    ...x,
    owner: user.id,
    onboarded: true,
    guest: false,
    level: parseLevel(meta.level) ?? x.level,
    profile: p ? { name: p.name, avatar: p.avatar ?? x.profile.avatar } : { ...x.profile, name: x.profile.name || meta.name || '' },
  }))
  setAuth({ role: p?.role === 'editor' ? 'editor' : 'user' })
  await loadBirthYear(user).catch(() => setAuth({ birthYear: birthYearOf(meta) }))
  await pullProgress(user.id).catch(() => {})
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
export async function signUp(email: string, password: string, name: string, level: Level, birthYear: number): Promise<boolean> {
  const { data, error } = await need().auth.signUp({
    email,
    password,
    options: { data: { name, level, birth_year: birthYear }, emailRedirectTo: redirectUrl() },
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
  await pushProgress().catch(() => {})
  stopSync()
  await need().auth.signOut()
  setAuth({ user: null, role: 'user', recovery: false })
}

/** Ohne Konto gestartet → zurueck zu Registrierung/Anmeldung (Fortschritt bleibt und geht ins Konto ueber) */
export function askAccount() {
  setState((s) => ({ ...s, guest: false }))
}

/** Konto endgueltig loeschen (Edge Function "delete-account"), danach alles Lokale */
export async function deleteAccount() {
  const fn = await functionCall('delete-account')
  if (!fn) throw new Error('Bitte anmelden.')
  let res: Response
  try {
    res = await fetch(fn.url, { method: 'POST', headers: { ...fn.headers, 'Content-Type': 'application/json' }, body: '{}' })
  } catch {
    throw new Error('Keine Verbindung zum Server.')
  }
  if (res.status === 404) throw new Error('Konto löschen ist auf dem Server noch nicht eingerichtet (Edge Function „delete-account“ fehlt).')
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? `Fehler ${res.status}`)
  stopSync()
  await need().auth.signOut({ scope: 'local' }).catch(() => {})
  wipeAll()
  setAuth({ user: null, role: 'user', recovery: false })
}

export async function sendReset(email: string) {
  const { error } = await need().auth.resetPasswordForEmail(email, { redirectTo: redirectUrl(true) })
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
  const { error } = await need().auth.resend({ type: 'signup', email, options: { emailRedirectTo: redirectUrl() } })
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

// ---------- Alter (006_fortschritt.sql) ----------
// Steht im Konto (user_metadata.birth_year) und in public.birth_years – dort fest und Grundlage der RLS
// (oeffentliche Kanaele erst ab 16). Ohne 006 auf dem Server gilt nur das Feld im Konto.

/** Sicher 16 oder aelter: mit nur dem Geburtsjahr erst im Jahr nach dem 16. (wie public.over_16) */
export function over16(year: number | null | undefined): boolean {
  return !!year && new Date().getFullYear() - year >= 17
}

function birthYearOf(meta: { birth_year?: unknown }): number | null {
  const y = Number(meta.birth_year)
  return Number.isInteger(y) && y > 1900 ? y : null
}

async function loadBirthYear(user: User) {
  const c = need()
  const meta = birthYearOf(user.user_metadata as { birth_year?: unknown })
  const { data, error } = await c.from('birth_years').select('year').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  const row = (data as { year: number } | null)?.year ?? null
  // Registrierung schreibt nur ins Konto (ohne Sitzung) → beim ersten Anmelden in die Tabelle uebernehmen
  if (!row && meta) await c.from('birth_years').insert({ user_id: user.id, year: meta })
  setAuth({ birthYear: row ?? meta })
}

/** Geburtsjahr einmalig nachtragen (Konten von vor der Altersabfrage) */
export async function saveBirthYear(year: number) {
  const c = need()
  const user = auth.user
  if (!user) throw new Error('Bitte anmelden.')
  const { error } = await c.auth.updateUser({ data: { birth_year: year } })
  if (error) throw authError(error)
  const { error: rowErr } = await c.from('birth_years').insert({ user_id: user.id, year })
  // schon eingetragen → der Wert dort gilt; Tabelle fehlt (006 nicht ausgefuehrt) → nur im Konto
  if (rowErr && /duplicate|unique/i.test(rowErr.message)) await loadBirthYear(user).catch(() => setAuth({ birthYear: year }))
  else setAuth({ birthYear: year })
}

// ---------- Fortschritt im Konto (006_fortschritt.sql) ----------
// Beim Anmelden: Stand aus public.progress mit dem Geraet abgleichen – neuerer Zeitstempel gewinnt, ein leerer Stand
// ersetzt nie einen mit Fortschritt, weniger abgeschlossene Sessions nur nach Rueckfrage. Danach jede Aenderung
// 5 s nach der letzten hochladen, beim Verlassen der Seite sofort. Fehlt die Tabelle, bleibt alles lokal.

const SYNC_DELAY = 5000
let token = ''
let syncUser: string | null = null
let uploaded = ''
let seenAt = ''
let timer = 0

function stopSync() {
  syncUser = null
  window.clearTimeout(timer)
  timer = 0
}

const time = (iso: string | undefined) => (iso ? Date.parse(iso) || 0 : 0)

/** Gilt der Stand des Kontos? Neuerer gewinnt – ausser er ist leer oder hat weniger abgeschlossene Sessions (Rueckfrage) */
function pickRemote(local: Progress, localAt: string | undefined, remote: Progress, remoteAt: string): boolean {
  const remoteNewer = time(remoteAt) > time(localAt)
  const [newer, older] = remoteNewer ? [remote, local] : [local, remote]
  if (progressEmpty(newer) && !progressEmpty(older)) return !remoteNewer
  const n = doneCount(newer)
  const o = doneCount(older)
  if (n >= o) return remoteNewer
  const takeNewer = remoteNewer
    ? confirm(`Im Konto liegt ein neuerer Stand mit ${n} abgeschlossenen Sessions, auf diesem Gerät sind es ${o}.\nKonto-Stand laden?\n(Abbrechen = Stand dieses Geräts behalten)`)
    : confirm(`Auf diesem Gerät liegt ein neuerer Stand mit ${n} abgeschlossenen Sessions, im Konto sind es ${o}.\nStand dieses Geräts ins Konto übernehmen?\n(Abbrechen = Konto-Stand laden)`)
  return takeNewer === remoteNewer
}

async function pullProgress(uid: string) {
  const c = need()
  stopSync()
  const { data, error } = await c.from('progress').select('data,updated_at').eq('user_id', uid).maybeSingle()
  if (error) return
  const row = data as { data: Progress; updated_at: string } | null
  const s = getState()
  const local = progressOf(s)
  if (row && time(row.updated_at) === time(s.progressAt)) uploaded = s.progressAt ?? ''
  else if (row && pickRemote(local, s.progressAt, row.data, row.updated_at)) {
    applyProgress(row.data, row.updated_at)
    uploaded = row.updated_at
  } else if (progressEmpty(local)) uploaded = s.progressAt ?? ''
  else {
    // lokaler Stand gilt; ohne Zeitstempel (vor dem Abgleich entstanden) jetzt einen setzen
    if (!s.progressAt) setState((x) => ({ ...x, progressAt: new Date().toISOString() }))
    uploaded = ''
  }
  syncUser = uid
  seenAt = getState().progressAt ?? ''
  if (seenAt !== uploaded) await pushProgress()
}

/** Aktuellen Stand hochladen, falls er sich seit dem letzten Hochladen geaendert hat */
async function pushProgress() {
  window.clearTimeout(timer)
  timer = 0
  const s = getState()
  const uid = syncUser
  const at = s.progressAt
  if (!cloud || !uid || !at || at === uploaded || s.owner !== uid) return
  const { error } = await cloud.from('progress').upsert({ user_id: uid, data: progressOf(s), updated_at: at })
  if (!error) uploaded = at
}

/** Beim Verlassen der Seite: fetch mit keepalive ueberlebt das Schliessen (bis 64 KB) */
function flushProgress() {
  const s = getState()
  const uid = syncUser
  const at = s.progressAt
  if (!url || !key || !token || !uid || !at || at === uploaded || s.owner !== uid) return
  window.clearTimeout(timer)
  timer = 0
  const body = JSON.stringify({ user_id: uid, data: progressOf(s), updated_at: at })
  void fetch(`${url.replace(/\/$/, '')}/rest/v1/progress?on_conflict=user_id`, {
    method: 'POST',
    keepalive: body.length < 60000,
    headers: { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body,
  }).then(
    (r) => {
      if (r.ok) uploaded = at
    },
    () => {},
  )
}

if (cloud) {
  subscribeStore(() => {
    const at = getState().progressAt ?? ''
    if (!syncUser || at === seenAt) return
    seenAt = at
    window.clearTimeout(timer)
    timer = window.setTimeout(() => void pushProgress().catch(() => {}), SYNC_DELAY)
  })
  addEventListener('pagehide', flushProgress)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushProgress()
  })
}

// ---------- Profil + Chat ----------

export interface CloudMsg {
  id: number
  channel: string
  user_id: string
  is_ki: boolean
  text: string
  created_at: string
  recipient?: string | null
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

/** Oeffentlicher Kanal – oder mit `to` Direktnachricht an einen Freund (channel 'dm') */
// KI-Antworten schreibt nur der Server (Edge Function "ki-chat", lib/ai.ts → channelChatCloud)
export async function postMessage(channel: string, text: string, to?: string): Promise<CloudMsg> {
  const c = need()
  const uid = await ensureUser()
  const row = { channel: to ? 'dm' : channel, text: text.slice(0, 4000), user_id: uid, ...(to ? { recipient: to } : {}) }
  const { data, error } = await c.from('messages').insert(row).select().single()
  if (error) throw new Error(`Senden fehlgeschlagen: ${missingSql(error.message) ?? error.message}`)
  return data as CloudMsg
}

/** Direktnachrichten zwischen mir und einem Freund */
export async function fetchDirect(me: string, friend: string, limit = 150): Promise<CloudMsg[]> {
  if (!cloud) return []
  const { data, error } = await cloud
    .from('messages')
    .select('*')
    .eq('channel', 'dm')
    .or(`and(user_id.eq.${me},recipient.eq.${friend}),and(user_id.eq.${friend},recipient.eq.${me})`)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(`Nachrichten konnten nicht geladen werden: ${missingSql(error.message) ?? error.message}`)
  return ((data ?? []) as CloudMsg[]).reverse()
}

/** Hinweis, falls supabase/004_freunde.sql bzw. 005_melden_blockieren.sql noch nicht ausgefuehrt wurde */
function missingSql(m: string): string | null {
  if (/blocks|reports|is_blocked/i.test(m)) return 'Melden und Blockieren sind auf dem Server noch nicht eingerichtet (supabase/005_melden_blockieren.sql ausführen).'
  return /friendships|recipient|are_friends|schema cache/i.test(m) ? 'Freunde sind auf dem Server noch nicht eingerichtet (supabase/004_freunde.sql ausführen).' : null
}

// ---------- Blockieren + Melden ----------

/** IDs der Konten, die ich blockiert habe (leer, solange 005 fehlt) */
export async function fetchBlocks(): Promise<string[]> {
  if (!cloud || !auth.user) return []
  const { data, error } = await cloud.from('blocks').select('blocked')
  if (error) return []
  return ((data ?? []) as { blocked: string }[]).map((r) => r.blocked)
}

/** Blockieren: Nachrichten verschwinden, Freundschaft endet (Trigger in 005) */
export async function blockUser(id: string) {
  const uid = await ensureUser()
  const { error } = await need().from('blocks').insert({ blocker: uid, blocked: id })
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(missingSql(error.message) ?? `Blockieren fehlgeschlagen: ${error.message}`)
}

export async function unblockUser(id: string) {
  const { error } = await need().from('blocks').delete().eq('blocker', auth.user?.id ?? '').eq('blocked', id)
  if (error) throw new Error(`Freigeben fehlgeschlagen: ${error.message}`)
}

export const REPORT_REASONS = { beleidigung: 'Beleidigung', spam: 'Spam', unangemessen: 'Unangemessen', sonstiges: 'Sonstiges' } as const
export type ReportReason = keyof typeof REPORT_REASONS

export async function reportMessage(id: number, reason: ReportReason) {
  await ensureUser()
  const { error } = await need().from('reports').insert({ message_id: id, reason })
  if (error && /duplicate|unique/i.test(error.message)) throw new Error('Schon gemeldet.')
  if (error) throw new Error(missingSql(error.message) ?? `Melden fehlgeschlagen: ${error.message}`)
}

export interface Report {
  id: number
  reporter: string
  message_id: number | null
  reported: string | null
  channel: string | null
  text: string
  reason: ReportReason
  created_at: string
}

/** Nur der Editor sieht Meldungen (RLS) */
export async function fetchReports(): Promise<Report[]> {
  const { data, error } = await need().from('reports').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) throw new Error(missingSql(error.message) ?? `Meldungen konnten nicht geladen werden: ${error.message}`)
  return (data ?? []) as Report[]
}

export async function resolveReport(id: number) {
  const { error } = await need().from('reports').delete().eq('id', id)
  if (error) throw new Error(`Erledigen fehlgeschlagen: ${error.message}`)
}

// ---------- Freunde ----------

export interface Friendship {
  id: number
  requester: string
  addressee: string
  status: 'pending' | 'accepted'
  created_at: string
}

export async function fetchFriendships(): Promise<Friendship[]> {
  const { data, error } = await need().from('friendships').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(missingSql(error.message) ?? `Freunde konnten nicht geladen werden: ${error.message}`)
  return (data ?? []) as Friendship[]
}

/** Konten nach Name suchen (ohne mich selbst) */
export async function searchProfiles(q: string, me: string): Promise<CloudProfile[]> {
  const term = q.trim().replace(/[%_,()\\]/g, '')
  if (term.length < 2) return []
  const { data, error } = await need().from('profiles').select('id,name,avatar').ilike('name', `%${term}%`).neq('id', me).order('name').limit(12)
  if (error) throw new Error(`Suche fehlgeschlagen: ${error.message}`)
  const list = (data ?? []) as CloudProfile[]
  for (const p of list) profiles.set(p.id, p)
  return list
}

export async function requestFriend(id: string) {
  const uid = await ensureUser()
  const { error } = await need().from('friendships').insert({ requester: uid, addressee: id })
  if (error) throw new Error(/duplicate|unique/i.test(error.message) ? 'Ihr seid schon befreundet oder es gibt bereits eine Anfrage.' : missingSql(error.message) ?? `Anfrage fehlgeschlagen: ${error.message}`)
}

export async function acceptFriend(id: number) {
  const { error } = await need().from('friendships').update({ status: 'accepted' }).eq('id', id)
  if (error) throw new Error(`Annehmen fehlgeschlagen: ${error.message}`)
}

/** Anfrage ablehnen/zurueckziehen oder Freundschaft beenden */
export async function removeFriend(id: number) {
  const { error } = await need().from('friendships').delete().eq('id', id)
  if (error) throw new Error(`Entfernen fehlgeschlagen: ${error.message}`)
}

/** Live: jede Aenderung an meinen Freundschaften */
export function subscribeFriends(onChange: () => void): () => void {
  if (!cloud) return () => {}
  const c = cloud
  const sub = c.channel(`friendships:${Math.random().toString(36).slice(2)}`).on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, () => onChange()).subscribe()
  return () => {
    void c.removeChannel(sub)
  }
}

export async function deleteMessage(id: number) {
  if (!cloud) return
  const { error } = await cloud.from('messages').delete().eq('id', id)
  if (error) throw new Error(`Löschen fehlgeschlagen: ${error.message}`)
}

/** Live: neue und geloeschte Nachrichten eines Kanals ('dm' = alle meine Direktnachrichten, RLS filtert) */
export function subscribe(channel: string, onInsert: (m: CloudMsg) => void, onDelete: (id: number) => void): () => void {
  if (!cloud) return () => {}
  const c = cloud
  // eindeutiger Name: removeChannel laeuft asynchron, ein gleichnamiger neuer Kanal bekaeme sonst den alten zurueck
  const sub = c
    .channel(`messages:${channel}:${Math.random().toString(36).slice(2)}`)
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
export function kiProxy() {
  return functionCall('ki')
}

/** Adresse + Anmelde-Header fuer eine Edge Function; null ohne Server/Konto */
export async function functionCall(name: string): Promise<{ url: string; headers: Record<string, string> } | null> {
  if (!cloud || !url || !key || !auth.user) return null
  const { data } = await cloud.auth.getSession()
  const token = data.session?.access_token
  if (!token) return null
  return { url: `${url.replace(/\/$/, '')}/functions/v1/${name}`, headers: { Authorization: `Bearer ${token}`, apikey: key } }
}

/** KI nutzbar: eigener Key – oder angemeldet mit Server (dann ueber den Proxy) */
export function useAiReady(): boolean {
  const a = useAuth()
  const ownKey = useStore((s) => !!s.settings.apiKey)
  return ownKey || (!!cloud && !!a.user)
}
