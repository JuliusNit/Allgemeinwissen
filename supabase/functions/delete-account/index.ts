// Konto loeschen (App-Store-Pflicht): loescht den angemeldeten Nutzer per Service Role aus auth.users.
// Die Kaskade entfernt Profil, Nachrichten, Freundschaften, Blockierungen, Meldungen und den KI-Zaehler;
// bei Videolisten des Editors bleibt nur updated_by leer.
// Deploy: npx supabase functions deploy delete-account
import { accountOf, adminClient, cors, fail, json } from '../_shared/auth.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return fail(405, 'Nur POST')

  const admin = adminClient()
  const user = await accountOf(req, admin)
  if (!user) return fail(401, 'Bitte anmelden')

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return fail(500, `Löschen fehlgeschlagen: ${error.message}`)
  return json(200, { ok: true })
})
