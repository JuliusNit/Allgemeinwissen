// KI im Austausch: Seit 005_melden_blockieren.sql duerfen Nutzer keine Nachricht mit is_ki = true schreiben.
// Diese Funktion liest den Verlauf selbst aus der Datenbank, fragt das LLM (Stream wird an die App
// durchgereicht) und speichert die fertige Antwort als KI-Nachricht. Am Ende kommt ein SSE-Ereignis
// {"saved": <Nachricht>} bzw. {"error": "…"}.
// Deploy: npx supabase functions deploy ki-chat   (Secrets LLM_KEY, KI_DAILY_LIMIT wie bei "ki")
import { accountOf, adminClient, cors, fail } from '../_shared/auth.ts'

const LLM_URL = Deno.env.get('LLM_URL') ?? 'https://ai.inference2.corpus.music/v1/chat/completions'
const LLM_KEY = Deno.env.get('LLM_KEY') ?? ''
const LIMIT = Number(Deno.env.get('KI_DAILY_LIMIT') ?? '300')
const MODEL = 'qwen3.8-27b'

interface Row {
  id: number
  user_id: string
  is_ki: boolean
  text: string
}

const line = (s: unknown, max: number) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
const clean = (t: string) => t.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim()

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return fail(405, 'Nur POST')
  if (!LLM_KEY) return fail(500, 'LLM_KEY fehlt auf dem Server')

  const admin = adminClient()
  const user = await accountOf(req, admin)
  if (!user) return fail(401, 'Bitte anmelden')

  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return fail(400, 'Ungueltige Anfrage')
  }
  const to = typeof b.to === 'string' && /^[0-9a-f-]{36}$/i.test(b.to) ? b.to : null
  const channel = to ? 'dm' : String(b.channel ?? '')
  if (!to && (!/^[a-z0-9-]{1,40}$/.test(channel) || channel === 'dm')) return fail(400, 'Unbekannter Kanal')
  if (to) {
    const { data: friends } = await admin.rpc('are_friends', { a: user.id, b: to })
    const { data: blocked } = await admin.rpc('is_blocked', { a: user.id, b: to })
    if (!friends || blocked) return fail(403, 'Ihr seid nicht befreundet.')
  } else {
    // öffentliche Kanäle erst ab 16 (006_fortschritt.sql); ohne 006 gibt es die Funktion noch nicht → kein Fehler
    const { data: adult, error: ageErr } = await admin.rpc('over_16', { uid: user.id })
    if (!ageErr && !adult) return fail(403, 'Öffentliche Kanäle gibt es erst ab 16.')
  }

  // Verlauf aus der Datenbank (ohne Blockierte), nicht vom Geraet
  const { data: blockRows } = await admin.from('blocks').select('blocked').eq('blocker', user.id)
  const hidden = new Set(((blockRows ?? []) as { blocked: string }[]).map((r) => r.blocked))
  let q = admin.from('messages').select('id,user_id,is_ki,text').eq('channel', channel)
  q = to ? q.or(`and(user_id.eq.${user.id},recipient.eq.${to}),and(user_id.eq.${to},recipient.eq.${user.id})`) : q.is('recipient', null)
  const { data: rows, error: readErr } = await q.order('created_at', { ascending: false }).limit(20)
  if (readErr) return fail(500, `Verlauf: ${readErr.message}`)
  const history = ((rows ?? []) as Row[]).filter((m) => !hidden.has(m.user_id)).reverse()

  // nur als Antwort auf die eigene, juengste @KI-Frage
  const lastMine = [...history].reverse().find((m) => m.user_id === user.id && !m.is_ki)
  if (!lastMine || !/@ki\b/i.test(lastMine.text)) return fail(400, 'Keine Frage an @KI gefunden.')

  const { data: n, error: countErr } = await admin.rpc('ki_count', { uid: user.id })
  if (countErr) return fail(500, `Zaehler: ${countErr.message}`)
  if ((n as number) > LIMIT) return fail(429, `Tageslimit erreicht (${LIMIT} KI-Anfragen) – morgen geht es weiter.`)

  const ids = [...new Set(history.map((m) => m.user_id))]
  const { data: profs } = await admin.from('profiles').select('id,name').in('id', ids)
  const names = new Map(((profs ?? []) as { id: string; name: string }[]).map((p) => [p.id, p.name]))

  const topic = line(b.topic, 60)
  const titles = (Array.isArray(b.titles) ? b.titles : []).slice(0, 100).map((t) => line(t, 120)).filter(Boolean)
  const system = `Du bist die KI im Austausch-Chat der Lern-App „Allgemeinwissen (kristalline Intelligenz)“, einem 90-Tage-Lernplan.
${topic ? `Kanal „${topic}“ – nur Themen aus diesem Bereich.` : 'Allgemeiner Kanal oder Direktnachricht – alle Themen des Lernplans.'}
Antworte immer auf Deutsch wie in einem Chat: kurz (max. 6 Zeilen), locker, sachlich korrekt, ohne Floskeln. Markdown ist erlaubt, kein LaTeX.
Jede Nutzernachricht beginnt mit dem Namen der schreibenden Person. Antworte der Person, die zuletzt @KI gefragt hat.
Verweise nur auf Sessions aus dieser Liste und nenne sie nur beim Titel (ohne Nummer, Kürzel oder Klammern), erfinde keine:
${titles.map((t) => `- ${t}`).join('\n')}`
  const messages = [
    { role: 'system', content: system },
    ...history.map((m) => (m.is_ki ? { role: 'assistant', content: m.text } : { role: 'user', content: `${names.get(m.user_id) ?? 'Jemand'}: ${m.text}` })),
  ]

  let res: Response
  try {
    res = await fetch(LLM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_KEY}` },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: 1500, temperature: 0.6, stream: true, chat_template_kwargs: { enable_thinking: false } }),
    })
  } catch {
    return fail(502, 'Keine Verbindung zum KI-Server.')
  }
  if (!res.ok || !res.body) return fail(res.status || 502, `KI-Fehler ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`)

  // Stream durchreichen, Text mitschreiben, am Ende speichern
  const dec = new TextDecoder()
  const enc = new TextEncoder()
  let buf = ''
  let acc = ''
  const pass = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, ctl) {
      ctl.enqueue(chunk)
      buf += dec.decode(chunk, { stream: true })
      let i: number
      while ((i = buf.indexOf('\n')) >= 0) {
        const ln = buf.slice(0, i).trim()
        buf = buf.slice(i + 1)
        if (!ln.startsWith('data:')) continue
        try {
          acc += JSON.parse(ln.slice(5).trim()).choices?.[0]?.delta?.content ?? ''
        } catch {
          // [DONE] oder unvollstaendige Zeile
        }
      }
    },
    async flush(ctl) {
      const text = clean(acc).slice(0, 4000)
      let event: Record<string, unknown>
      if (!text) event = { error: 'Leere Antwort – bitte erneut fragen.' }
      else {
        const row = { channel, user_id: user.id, is_ki: true, text, ...(to ? { recipient: to } : {}) }
        const { data, error } = await admin.from('messages').insert(row).select().single()
        event = error ? { error: `Speichern fehlgeschlagen: ${error.message}` } : { saved: data }
      }
      ctl.enqueue(enc.encode(`\ndata: ${JSON.stringify(event)}\n\n`))
    },
  })
  return new Response(res.body.pipeThrough(pass), {
    headers: { ...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
})
