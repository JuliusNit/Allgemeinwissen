import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getState } from './store'

// Supabase fuer den Austausch-Chat. Adresse + Publishable Key kommen beim Bauen aus der lokalen .env
// (VITE_SUPABASE_URL, VITE_SUPABASE_KEY). Ohne Konfiguration laeuft der Chat nur lokal.
// Der Publishable Key ist oeffentlich gedacht; geschuetzt wird ueber Row Level Security (supabase/schema.sql).

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

export const cloud: SupabaseClient | null = url && key ? createClient(url, key) : null

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

let userId: string | null = null
let syncedProfile = ''

/** Anonyme Anmeldung (einmal pro Geraet) und eigenes Profil hochladen */
export async function ensureUser(): Promise<string> {
  if (!cloud) throw new Error('Kein Server konfiguriert.')
  if (!userId) {
    const { data } = await cloud.auth.getSession()
    if (data.session) userId = data.session.user.id
    else {
      const { data: d, error } = await cloud.auth.signInAnonymously()
      if (error || !d.user) throw new Error(`Anmeldung fehlgeschlagen: ${error?.message ?? 'unbekannt'}`)
      userId = d.user.id
    }
  }
  await syncProfile()
  return userId
}

export async function syncProfile() {
  if (!cloud || !userId) return
  const { name, avatar } = getState().profile
  const sig = `${name}|${avatar?.length ?? 0}|${avatar?.slice(-32) ?? ''}`
  if (sig === syncedProfile) return
  const { error } = await cloud.from('profiles').upsert({ id: userId, name: name.trim().slice(0, 40) || 'Anonym', avatar: avatar ?? null, updated_at: new Date().toISOString() })
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
  if (!cloud) throw new Error('Kein Server konfiguriert.')
  const uid = await ensureUser()
  const { data, error } = await cloud.from('messages').insert({ channel, text: text.slice(0, 4000), is_ki: isKi, user_id: uid }).select().single()
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
