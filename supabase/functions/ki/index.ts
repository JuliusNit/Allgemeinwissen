// KI-Proxy: angemeldete Nutzer (E-Mail-Konto) bekommen Zugriff auf das LLM, ohne den Key zu kennen.
// Der Key liegt nur hier als Secret (LLM_KEY). Pro Konto gilt ein Tageslimit (KI_DAILY_LIMIT, Standard 300).
// Deploy: npx supabase functions deploy ki   (verify_jwt ist in config.toml aus – geprueft wird unten selbst)
import { createClient } from 'jsr:@supabase/supabase-js@2'

const LLM_URL = Deno.env.get('LLM_URL') ?? 'https://ai.inference2.corpus.music/v1/chat/completions'
const LLM_KEY = Deno.env.get('LLM_KEY') ?? ''
const LIMIT = Number(Deno.env.get('KI_DAILY_LIMIT') ?? '300')
const MODELS = ['qwen3.8-27b', 'qwen3.6-27b']

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json(405, 'Nur POST')
  if (!LLM_KEY) return json(500, 'LLM_KEY fehlt auf dem Server')

  // Konto pruefen
  const auth = req.headers.get('Authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '')
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: u } = await admin.auth.getUser(token)
  const user = u?.user
  if (!user || user.is_anonymous) return json(401, 'Bitte anmelden')

  // Tageslimit
  const { data: n, error } = await admin.rpc('ki_count', { uid: user.id })
  if (error) return json(500, `Zaehler: ${error.message}`)
  if ((n as number) > LIMIT) return json(429, `Tageslimit erreicht (${LIMIT} KI-Anfragen) – morgen geht es weiter.`)

  // Nur erlaubte Felder weiterreichen
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return json(400, 'Ungueltige Anfrage')
  }
  const model = MODELS.includes(String(b.model)) ? String(b.model) : MODELS[0]
  const payload: Record<string, unknown> = {
    model,
    messages: b.messages,
    max_tokens: Math.min(Number(b.max_tokens) || 2000, 8000),
    temperature: typeof b.temperature === 'number' ? b.temperature : 0.6,
    stream: !!b.stream,
  }
  if (b.response_format) payload.response_format = b.response_format
  if (b.chat_template_kwargs) payload.chat_template_kwargs = b.chat_template_kwargs
  if (!Array.isArray(payload.messages) || JSON.stringify(payload.messages).length > 200_000) return json(400, 'Nachrichten fehlen oder zu lang')

  const res = await fetch(LLM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_KEY}` },
    body: JSON.stringify(payload),
  })
  return new Response(res.body, {
    status: res.status,
    headers: { ...cors, 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
})
