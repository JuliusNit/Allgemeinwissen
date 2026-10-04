import { useEffect, useRef, useState } from 'react'
import type { Video } from '../data/plan'
import { dayState, sortNotes, updateDay, useStore, type VideoNote } from '../lib/store'
import { fmtTime, loadYouTubeApi, parseVideoUrl, YT_ENDED, YT_PLAYING, type YTPlayer } from '../lib/video'
import { Icon } from './Icons'

interface Props {
  day: number
  videos: Video[]
  video: Video
  /** Startzeit aus einem Notiz-Sprung (Sekunden) */
  at?: number
  open: (id: string, t?: number) => void
  close: () => void
}

/** Vollbild-Ansicht: eingebettetes Video, daneben (bzw. darunter) Notizen mit Zeitmarken */
export function VideoWatch({ day, videos, video, at, open, close }: Props) {
  const ds = useStore((s) => dayState(s, day))
  const embed = parseVideoUrl(video.url)
  const idx = videos.findIndex((v) => v.id === video.id)
  const prev = videos[idx - 1]
  const next = videos[idx + 1]
  const watched = (ds.watched ?? []).includes(video.id)
  const notes = sortNotes(ds.videoNotes?.[video.id] ?? [])
  const playerRef = useRef<YTPlayer | null>(null)
  const [now, setNow] = useState(0)
  const [ytError, setYtError] = useState(false)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !(e.target instanceof HTMLTextAreaElement) && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [close])

  function setWatched(on: boolean) {
    updateDay(day, (x) => {
      const w = new Set(x.watched ?? [])
      if (on) w.add(video.id)
      else w.delete(video.id)
      return { ...x, watched: [...w], status: x.status === 'offen' ? 'laeuft' : x.status, startedAt: x.startedAt ?? new Date().toISOString() }
    })
  }

  function setNotes(fn: (n: VideoNote[]) => VideoNote[]) {
    updateDay(day, (x) => ({ ...x, videoNotes: { ...x.videoNotes, [video.id]: fn(x.videoNotes?.[video.id] ?? []) } }))
  }

  function setUrl(url: string) {
    updateDay(day, (x) => ({ ...x, videos: videos.map((v) => (v.id === video.id ? { ...v, url } : v)) }))
  }

  function seek(t: number) {
    const p = playerRef.current
    if (p) {
      p.seekTo(t, true)
      p.playVideo()
    }
  }

  return (
    <div className="watch" role="dialog" aria-label={video.title}>
      <div className="watch-bar">
        <button className="icon-btn" onClick={close} aria-label="Zurück zur Session"><Icon name="BACK" size={26} /></button>
        <div className="watch-title">
          <span className="muted small">Tag {day} · Video {idx + 1}/{videos.length} {video.star ? '· ★ Pflicht' : '· optional'}</span>
          <b>{video.title}</b>
        </div>
        <span className="right">
          <button className="btn ghost small" disabled={!prev} onClick={() => prev && open(prev.id)} aria-label="Vorheriges Video">‹</button>
          <button className="btn ghost small" disabled={!next} onClick={() => next && open(next.id)} aria-label="Nächstes Video">›</button>
        </span>
      </div>

      <div className="watch-body">
        <div className="watch-main">
          {embed.kind === 'youtube' && !ytError ? (
            <YouTube
              key={embed.id}
              id={embed.id}
              start={at ?? ds.videoPos?.[video.id] ?? embed.start}
              playerRef={playerRef}
              onTime={setNow}
              onEnded={() => setWatched(true)}
              onError={() => setYtError(true)}
              onPos={(t) => updateDay(day, (x) => ({ ...x, videoPos: { ...x.videoPos, [video.id]: t } }))}
            />
          ) : embed.kind === 'vimeo' ? (
            <div className="player">
              <iframe src={`https://player.vimeo.com/video/${embed.id}?dnt=1`} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <PickVideo video={video} embedKind={embed.kind} ytError={ytError} onUrl={(u) => { setYtError(false); setUrl(u) }} />
          )}
          <div className="row watch-actions">
            <label className="check-label"><input type="checkbox" checked={watched} onChange={(e) => setWatched(e.target.checked)} /> gesehen</label>
            {video.url && (
              <a className="btn ghost small" href={video.url} target="_blank" rel="noreferrer">extern öffnen</a>
            )}
            {(embed.kind === 'youtube' || embed.kind === 'vimeo') && (
              <button className="btn ghost small" onClick={() => confirm('Anderes Video für dieses Thema wählen?') && setUrl('')}>anderes Video</button>
            )}
            {next && (
              <button className="btn small right" onClick={() => { setWatched(true); open(next.id) }}>Gesehen · weiter ›</button>
            )}
            {!next && (
              <button className="btn small primary right" onClick={() => { setWatched(true); close() }}>Fertig · zur Session</button>
            )}
          </div>
        </div>

        <NotesPane
          key={video.id}
          notes={notes}
          timed={embed.kind === 'youtube' && !ytError}
          now={now}
          playerRef={playerRef}
          onSeek={seek}
          setNotes={setNotes}
        />
      </div>
    </div>
  )
}

function YouTube({
  id, start, playerRef, onTime, onEnded, onError, onPos,
}: {
  id: string
  start: number
  playerRef: React.MutableRefObject<YTPlayer | null>
  onTime: (t: number) => void
  onEnded: () => void
  onError: () => void
  onPos: (t: number) => void
}) {
  const host = useRef<HTMLDivElement>(null)
  // Callbacks per Ref, damit der Player nicht bei jedem Render neu entsteht
  const cb = useRef({ onTime, onEnded, onError, onPos })
  cb.current = { onTime, onEnded, onError, onPos }

  useEffect(() => {
    let player: YTPlayer | null = null
    let timer = 0
    let lastSaved = -1
    let cancelled = false
    const save = () => {
      if (!player) return
      const t = Math.floor(player.getCurrentTime())
      if (Math.abs(t - lastSaved) >= 5) {
        lastSaved = t
        cb.current.onPos(t)
      }
    }
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host.current) return
        const el = document.createElement('div')
        host.current.appendChild(el)
        player = new YT.Player(el, {
          videoId: id,
          host: 'https://www.youtube-nocookie.com',
          playerVars: { start: Math.floor(start), rel: 0, playsinline: 1, modestbranding: 1, hl: 'de' },
          events: {
            onReady: () => {
              playerRef.current = player
              timer = window.setInterval(() => {
                if (!player) return
                cb.current.onTime(player.getCurrentTime())
                if (player.getPlayerState() === YT_PLAYING) save()
              }, 500)
            },
            onStateChange: (e) => {
              if (e.data === YT_ENDED) {
                cb.current.onEnded()
                cb.current.onPos(0)
              } else save()
            },
          },
        })
      })
      .catch(() => cb.current.onError())
    return () => {
      cancelled = true
      clearInterval(timer)
      save()
      playerRef.current = null
      player?.destroy()
      if (host.current) host.current.innerHTML = ''
    }
    // start nur beim ersten Laden – spaetere Spruenge laufen ueber seekTo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return <div className="player" ref={host} />
}

function PickVideo({ video, embedKind, ytError, onUrl }: { video: Video; embedKind: string; ytError: boolean; onUrl: (u: string) => void }) {
  const [val, setVal] = useState('')
  const parsed = parseVideoUrl(val)
  const ok = parsed.kind === 'youtube' || parsed.kind === 'vimeo'
  const searchUrl = embedKind === 'search' ? video.url : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${video.title} einfach erklärt`)}`

  async function paste() {
    try {
      const t = await navigator.clipboard.readText()
      setVal(t)
      if (['youtube', 'vimeo'].includes(parseVideoUrl(t).kind)) onUrl(t.trim())
    } catch {
      // Zugriff verweigert – dann einfach ins Feld einfuegen
    }
  }

  return (
    <div className="player pick">
      <div>
        {ytError ? (
          <p><b>YouTube ließ sich nicht laden.</b> Verbindung prüfen oder extern öffnen.</p>
        ) : embedKind === 'extern' ? (
          <p><b>Diese Seite lässt sich nicht einbetten.</b> Extern öffnen – die Notizen rechts funktionieren trotzdem. Gibt es das Video auch auf YouTube, den Link hier einfügen.</p>
        ) : (
          <>
            <p><b>Noch kein Video gewählt.</b></p>
            <ol className="small">
              <li>Auf YouTube suchen und ein Video aussuchen</li>
              <li>Teilen → Link kopieren</li>
              <li>Hier einfügen – das Video läuft dann direkt in der App</li>
            </ol>
          </>
        )}
        <div className="row">
          <a className="btn small" href={searchUrl} target="_blank" rel="noreferrer">Auf YouTube suchen</a>
          {'clipboard' in navigator && 'readText' in navigator.clipboard && (
            <button className="btn small" onClick={paste}>Link aus Zwischenablage</button>
          )}
        </div>
        <div className="row">
          <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="YouTube- oder Vimeo-Link" onKeyDown={(e) => e.key === 'Enter' && ok && onUrl(val.trim())} />
          <button className="btn small primary" disabled={!ok} onClick={() => onUrl(val.trim())}>Übernehmen</button>
        </div>
        {val && !ok && <p className="small muted">Kein YouTube-/Vimeo-Videolink erkannt.</p>}
      </div>
    </div>
  )
}

function NotesPane({
  notes, timed, now, playerRef, onSeek, setNotes,
}: {
  notes: VideoNote[]
  timed: boolean
  now: number
  playerRef: React.MutableRefObject<YTPlayer | null>
  onSeek: (t: number) => void
  setNotes: (fn: (n: VideoNote[]) => VideoNote[]) => void
}) {
  const [draft, setDraft] = useState('')
  const [draftT, setDraftT] = useState<number | null>(null)
  const [pauseOnType, setPauseOnType] = useState(() => {
    try { return localStorage.getItem('aw-pause-on-type') !== '0' } catch { return true }
  })
  const [editing, setEditing] = useState<string | null>(null)
  const resumeAfter = useRef(false)
  const listRef = useRef<HTMLUListElement>(null)

  function togglePause(on: boolean) {
    setPauseOnType(on)
    try { localStorage.setItem('aw-pause-on-type', on ? '1' : '0') } catch { /* egal */ }
  }

  // Zeitmarke beim ersten Tastendruck festhalten (und ggf. pausieren)
  function onDraft(v: string) {
    if (!draft && v && timed && draftT === null) {
      const p = playerRef.current
      if (p) {
        setDraftT(p.getCurrentTime())
        if (pauseOnType && p.getPlayerState() === YT_PLAYING) {
          p.pauseVideo()
          resumeAfter.current = true
        }
      }
    }
    if (!v) setDraftT(null)
    setDraft(v)
  }

  function save() {
    const text = draft.trim()
    if (!text) return
    const t = draftT ?? (timed && playerRef.current ? playerRef.current.getCurrentTime() : undefined)
    setNotes((n) => [...n, { id: `n${Date.now()}`, t: t === undefined ? undefined : Math.floor(t), text }])
    setDraft('')
    setDraftT(null)
    if (resumeAfter.current) {
      playerRef.current?.playVideo()
      resumeAfter.current = false
    }
  }

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest' })
  }, [notes.length])

  const stamp = draftT ?? (timed ? now : null)

  return (
    <aside className="watch-notes">
      <div className="section-head">
        <h2>Notizen</h2>
        {timed && (
          <label className="check-label small"><input type="checkbox" checked={pauseOnType} onChange={(e) => togglePause(e.target.checked)} /> beim Tippen pausieren</label>
        )}
      </div>
      <ul className="vnotes" ref={listRef}>
        {notes.length === 0 && (
          <li className="muted small">
            {timed ? 'Tippen, während das Video läuft – jede Notiz bekommt die Stelle im Video. Ein Klick auf die Zeit springt dorthin.' : 'Stichpunkte zum Video.'}
          </li>
        )}
        {notes.map((n) => (
          <li key={n.id}>
            {n.t !== undefined ? (
              <button className="stamp" onClick={() => onSeek(n.t!)} disabled={!timed} title="Zu dieser Stelle springen">{fmtTime(n.t)}</button>
            ) : (
              <span className="stamp none">–</span>
            )}
            {editing === n.id ? (
              <textarea
                autoFocus
                rows={2}
                defaultValue={n.text}
                onBlur={(e) => {
                  const text = e.target.value.trim()
                  setNotes((all) => (text ? all.map((x) => (x.id === n.id ? { ...x, text } : x)) : all.filter((x) => x.id !== n.id)))
                  setEditing(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    ;(e.target as HTMLTextAreaElement).blur()
                  }
                }}
              />
            ) : (
              <p onClick={() => setEditing(n.id)} title="Zum Bearbeiten tippen">{n.text}</p>
            )}
            <button className="btn ghost small del" onClick={() => setNotes((all) => all.filter((x) => x.id !== n.id))} aria-label="Notiz löschen">×</button>
          </li>
        ))}
      </ul>
      <div className="vnote-input">
        {stamp !== null && <span className="stamp live">{fmtTime(stamp)}</span>}
        <textarea
          rows={2}
          value={draft}
          placeholder="Notiz … (Enter speichert, Shift+Enter neue Zeile)"
          onChange={(e) => onDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              save()
            }
          }}
        />
        <button className="btn primary small" onClick={save} disabled={!draft.trim()}>+</button>
      </div>
    </aside>
  )
}
