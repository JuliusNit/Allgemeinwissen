// Gemeinsam fuer die Edge Functions: CORS, JSON-Fehler und Kontopruefung wie in ki/index.ts
// (verify_jwt ist in config.toml aus – das Konto wird hier selbst geprueft, anonyme Sitzungen zaehlen nicht).
import { createClient, type SupabaseClient, type User } from 'jsr:@supabase/supabase-js@2'

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

export const fail = (status: number, error: string) => json(status, { error })

export function adminClient(): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
}

/** Angemeldetes E-Mail-Konto aus dem Bearer-Token, sonst null */
export async function accountOf(req: Request, admin: SupabaseClient): Promise<User | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data } = await admin.auth.getUser(token)
  const user = data?.user
  return user && !user.is_anonymous ? user : null
}
