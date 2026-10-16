import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Share } from '@capacitor/share'
import { StatusBar, Style } from '@capacitor/status-bar'

// Native Huelle (Capacitor, capacitor.config.ts): Teilen, Dateien, Haptik, Statusleiste, externe Links.
// Jede Funktion hat einen Web-Fallback – die Web-Version (gh-pages) laeuft unveraendert weiter.

export const NATIVE = Capacitor.isNativePlatform()
export const PLATFORM = Capacitor.getPlatform() as 'ios' | 'android' | 'web'

/** URL-Schema fuer Konto-Mails (= App-ID; Info.plist CFBundleURLSchemes, AndroidManifest intent-filter) */
export const AUTH_SCHEME = 'de.allgemeinwissen.app'
export const AUTH_URL = `${AUTH_SCHEME}://auth`

/** Externe Seiten: nativ im In-App-Browser (SFSafariViewController / Custom Tabs), sonst neuer Tab */
export function openExternal(url: string) {
  if (NATIVE) void Browser.open({ url })
  else window.open(url, '_blank', 'noopener,noreferrer')
}

/** Start der nativen App: Statusleiste dunkel auf weiss, Links mit target=_blank im In-App-Browser */
export function startNative() {
  if (!NATIVE) return
  void StatusBar.setStyle({ style: Style.Light }).catch(() => {})
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || !/^https?:/i.test(a.href) || new URL(a.href).origin === location.origin) return
      e.preventDefault()
      openExternal(a.href)
    },
    true,
  )
}

/** Dezente Rueckmeldung: leicht = Karte bewertet, erfolg = Session/Station abgeschlossen */
export function haptic(kind: 'leicht' | 'erfolg') {
  if (!NATIVE) return
  if (kind === 'leicht') void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  else void Haptics.notification({ type: NotificationType.Success }).catch(() => {})
}

function base64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]*,/, ''))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Datei ueber das Teilen-Menue weitergeben (Fotos, Dateien, Nachrichten …).
 * Nativ: in den Cache schreiben + Share-Plugin; Web: navigator.share mit Datei, sonst herunterladen.
 * Rueckgabe false = abgebrochen.
 */
export async function shareFile(blob: Blob, name: string, title: string): Promise<boolean> {
  if (NATIVE) {
    const { uri } = await Filesystem.writeFile({ path: name, data: await base64(blob), directory: Directory.Cache })
    try {
      await Share.share({ title, files: [uri] })
      return true
    } catch (e) {
      if (/cancel/i.test((e as Error).message)) return false
      throw e
    }
  }
  const file = new File([blob], name, { type: blob.type })
  if (!navigator.canShare?.({ files: [file] })) {
    download(blob, name)
    return true
  }
  try {
    await navigator.share({ files: [file], title })
    return true
  } catch (e) {
    if ((e as Error).name === 'AbortError') return false
    throw e
  }
}

/**
 * Datei speichern. Nativ: Ordner Dokumente (iOS: Dateien-App › Allgemeinwissen, Android: Dokumente).
 * Rueckgabe: Ort fuer die Meldung, im Web leer (Browser-Download).
 */
export async function saveFile(blob: Blob, name: string): Promise<string> {
  if (!NATIVE) {
    download(blob, name)
    return ''
  }
  if (PLATFORM === 'android') await Filesystem.requestPermissions().catch(() => {})
  await Filesystem.writeFile({ path: name, data: await base64(blob), directory: Directory.Documents, recursive: true })
  return PLATFORM === 'ios' ? `Dateien › Allgemeinwissen › ${name}` : `Dokumente › ${name}`
}
