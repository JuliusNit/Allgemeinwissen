// Video-Links erkennen und den YouTube-IFrame-Player laden (fuer Zeitmarken in den Notizen)

export type Embed =
  | { kind: 'youtube'; id: string; start: number }
  | { kind: 'vimeo'; id: string }
  | { kind: 'search'; url: string }
  | { kind: 'extern'; url: string }
  | { kind: 'leer' }

/** "1h2m3s", "123" oder "1:02:03" → Sekunden */
function parseTime(t: string | null): number {
  if (!t) return 0
  if (/^\d+$/.test(t)) return Number(t)
  if (t.includes(':')) return t.split(':').reduce((a, p) => a * 60 + (Number(p) || 0), 0)
  const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/)
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0
}

export function parseVideoUrl(raw: string): Embed {
  const s = raw.trim()
  if (!s) return { kind: 'leer' }
  let u: URL
  try {
    u = new URL(s.startsWith('http') ? s : `https://${s}`)
  } catch {
    return { kind: 'extern', url: s }
  }
  const host = u.hostname.replace(/^(www|m|music)\./, '')
  const start = parseTime(u.searchParams.get('t') ?? u.searchParams.get('start'))
  if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0]
    if (id) return { kind: 'youtube', id, start }
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (u.pathname === '/results') return { kind: 'search', url: u.href }
    const v = u.searchParams.get('v')
    if (v) return { kind: 'youtube', id: v, start }
    const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/)
    if (m) return { kind: 'youtube', id: m[1], start }
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/(\d{5,})/)
    if (m) return { kind: 'vimeo', id: m[1] }
  }
  return { kind: 'extern', url: u.href }
}

export function fmtTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`
}

// ---------- YouTube IFrame API (nur das, was wir brauchen) ----------

export interface YTPlayer {
  getCurrentTime(): number
  getPlayerState(): number
  seekTo(sec: number, allowSeekAhead: boolean): void
  playVideo(): void
  pauseVideo(): void
  destroy(): void
}

interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string
      host?: string
      playerVars?: Record<string, number | string>
      events?: { onReady?: () => void; onStateChange?: (e: { data: number }) => void }
    },
  ) => YTPlayer
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

export const YT_PLAYING = 1
export const YT_ENDED = 0

let apiPromise: Promise<YTNamespace> | null = null

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        resolve(window.YT!)
      }
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.onerror = () => {
        apiPromise = null
        reject(new Error('YouTube nicht erreichbar'))
      }
      document.head.appendChild(tag)
    })
  }
  return apiPromise
}
