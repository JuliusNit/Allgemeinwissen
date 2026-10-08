import { useState } from 'react'
import { youtubeSearch, type Video } from '../data/plan'
import { parseVideoUrl } from '../lib/video'

export function VideoList({
  videos, watched, onToggleWatched, onChange, onReset, onOpen, noteCounts, day, canEdit,
}: {
  videos: Video[]
  watched: Set<string>
  onToggleWatched: (id: string) => void
  onChange: (v: Video[]) => void
  onReset: () => void
  onOpen: (id: string) => void
  noteCounts: Record<string, number>
  day: number
  canEdit: boolean
}) {
  // Bearbeiten erst mit "Fertig" speichern (beim Editor geht jede Speicherung an alle)
  const [draft, setDraft] = useState<Video | null>(null)
  const isNew = !!draft && !videos.some((v) => v.id === draft.id)
  const list = isNew && draft ? [...videos, draft] : videos

  function patch(id: string, p: Partial<Video>) {
    onChange(videos.map((v) => (v.id === id ? { ...v, ...p } : v)))
  }

  function commit() {
    if (!draft) return
    onChange(isNew ? [...videos, draft] : videos.map((v) => (v.id === draft.id ? draft : v)))
    setDraft(null)
  }

  function add() {
    setDraft({ id: `${day}-u${Date.now()}`, title: 'Neues Video', url: '', star: false })
  }

  return (
    <>
      <ul className="videos">
        {list.map((v) => (
          <li key={v.id} className={watched.has(v.id) ? 'done' : ''}>
            {draft?.id === v.id ? (
              <div className="video-edit">
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titel" />
                <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value, source: undefined })} placeholder="YouTube-Link einfügen (läuft dann in der App)" />
                <div className="row">
                  <button className="btn small" onClick={() => setDraft({ ...draft, url: youtubeSearch(`${draft.title} einfach erklärt`), source: undefined })}>Als Suchlink</button>
                  <button className="btn small danger" onClick={() => { if (!isNew) onChange(videos.filter((x) => x.id !== v.id)); setDraft(null) }}>Entfernen</button>
                  <button className="btn small" onClick={() => setDraft(null)}>Abbrechen</button>
                  <button className="btn small primary" onClick={commit}>Fertig</button>
                </div>
              </div>
            ) : (
              <>
                <input type="checkbox" checked={watched.has(v.id)} onChange={() => onToggleWatched(v.id)} aria-label="gesehen" />
                {canEdit ? (
                  <button className={`star ${v.star ? 'on' : ''}`} onClick={() => patch(v.id, { star: !v.star })} title={v.star ? 'Pflichtvideo (wird abgefragt)' : 'optional'}>
                    {v.star ? '★' : '☆'}
                  </button>
                ) : (
                  <span className={`star ${v.star ? 'on' : ''}`} title={v.star ? 'Pflichtvideo (wird abgefragt)' : 'optional'}>{v.star ? '★' : '☆'}</span>
                )}
                <button className="video-open" onClick={() => onOpen(v.id)}>
                  <span className="video-play" aria-hidden>▶</span>
                  <span>{v.title}{v.source && <small className="video-source"> · {v.source}</small>}</span>
                </button>
                {noteCounts[v.id] > 0 && <span className="video-kind">{noteCounts[v.id]} ✎</span>}
                <span className="video-kind">{videoKind(v.url)}</span>
                {canEdit && <button className="btn ghost small" onClick={() => setDraft(v)} aria-label="Bearbeiten">✎</button>}
              </>
            )}
          </li>
        ))}
      </ul>
      {canEdit && (
        <div className="row">
          <button className="btn small" onClick={add} disabled={!!draft}>+ Video</button>
          <button className="btn ghost small" onClick={() => confirm('Videoliste auf Standard zurücksetzen?') && onReset()}>Zurücksetzen</button>
        </div>
      )}
    </>
  )
}

function videoKind(url: string): string {
  const k = parseVideoUrl(url).kind
  return k === 'youtube' || k === 'vimeo' ? '' : k === 'extern' ? 'extern' : 'Video wählen'
}
