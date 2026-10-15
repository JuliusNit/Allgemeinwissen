import { askAccount, cloud, useAuth } from '../lib/cloud'

/** Mit Server, aber ohne Konto ("Ohne Konto starten"): Knopf zurueck zu Registrierung/Anmeldung */
export function AccountButton({ className = 'btn small' }: { className?: string }) {
  const auth = useAuth()
  if (!cloud || auth.user) return null
  return <button className={className} onClick={askAccount}>Konto anlegen / anmelden</button>
}
