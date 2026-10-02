import { useState } from 'react'
import { AREAS, BLOCKS, defaultVideos, getDay, isBlockMix, youtubeSearch, type Video } from '../data/plan'
import { anchorChat, checkChat, describeError, DONE_MARKER, makeSummary, questionsChat } from '../lib/ai'
import { addCards } from '../lib/srs'
import { dayState, today, updateDay, useStore, videosOf } from '../lib/store'
import { Chat } from '../components/Chat'
import { Markdown } from '../components/Markdown'
import { AreaBadge } from '../components/AreaBadge'

type Tab = 'fragen' | 'check' | 'zusammenfassung'

export function DayView({ day, openDay }: { day: number; openDay: (n: number) => void }) {
  const d = getDay(day)
  const ds = useStore((s) => dayState(s, day))
  const videos = useStore((s) => videosOf(s, day))
  const statuses = useStore((s) => s.days)
  const hasKey = useStore((s) => !!s.settings.apiKey)
  const checkDone = !!ds.check?.some((m) => m.role === 'assistant' && m.content.includes(DONE_MARKER))
  const [tab, setTab] = useState<Tab>(ds.status === 'fertig' ? 'zusammenfassung' : ds.check?.length ? 'check' : 'fragen')
  const [anchorText, setAnchorText] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checkGen, setCheckGen] = useState(0)
  const block = BLOCKS[d.block]
  const mix = isBlockMix(d)
  const watched = new Set(ds.watched ?? [])
  const stars = videos.filter((v) => v.star)
  const starsWatched = stars.filter((v) => watched.has(v.id)).length

  function setVideos(v: Video[]) {
    updateDay(day, (x) => ({ ...x, videos: v }))
  }

  function start() {
    updateDay(day, (x) => ({ ...x, status: x.status === 'offen' ? 'laeuft' : x.status, startedAt: x.startedAt ?? new Date().toISOString() }))
  }

  async function runAnchor() {
    setError(null)
    setAnchorText('')
    try {
      const t = await anchorChat(day, setAnchorText)
      updateDay(day, (x) => ({ ...x, anchor: t }))
    } catch (e) {
      setError(describeError(e))
    } finally {
      setAnchorText(null)
    }
  }

  async function finish() {
    setBusy('Zusammenfassung und Karteikarten werden erstellt …')
    setError(null)
    try {
      const r = await makeSummary(day)
      const firstTime = ds.status !== 'fertig'
      updateDay(day, (x) => ({ ...x, summary: r.summary_markdown, status: 'fertig', completedAt: x.completedAt ?? today() }))
      if (firstTime || confirm('Neue Karteikarten zusätzlich zu den vorhandenen anlegen?')) addCards(day, r.cards)
      setTab('zusammenfassung')
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(null)
    }
  }

  function resetCheck() {
    if (confirm('Verständnischeck neu beginnen? Der bisherige Verlauf wird gelöscht.')) {
      updateDay(day, (x) => ({ ...x, check: [] }))
      setCheckGen((g) => g + 1)
    }
  }

  return (
    <div className="day">
      <div className="day-head">
        <div className="day-nav">
          <button className="btn ghost small" disabled={day <= 1} onClick={() => openDay(day - 1)} aria-label="Vorheriger Tag">‹</button>
          <span className="muted">Tag {day} / 90 · {block.name}</span>
          <button className="btn ghost small" disabled={day >= 90} onClick={() => openDay(day + 1)} aria-label="Nächster Tag">›</button>
        </div>
        <div className="day-title">
          <AreaBadge area={d.area} />
          <h1>{d.title}</h1>
        </div>
        <p className="muted">{d.subtopics.join(' · ')}</p>
        <div className="status-row">
          <span className={`status ${ds.status}`}>{ds.status === 'offen' ? 'offen' : ds.status === 'laeuft' ? 'läuft' : `abgeschlossen ${ds.completedAt ?? ''}`}</span>
          {d.evidence && <span className="chip warn">Evidenzcheck: belegt vs. Hype</span>}
          {ds.status === 'offen' && <button className="btn primary" onClick={start}>Session starten</button>}
        </div>
      </div>

      {!hasKey && <div className="notice">Für Anknüpfen, Fragen und Verständnischeck einen Anthropic-API-Key unter <b>Einstellungen</b> eintragen.</div>}
      {error && <div className="chat-error">{error}</div>}

      <section className="card">
        <h2>1 · Anknüpfen</h2>
        {d.links.length > 0 && (
          <div className="chips">
            {d.links.map((n) => {
              const st = statuses[n]?.status ?? 'offen'
              return (
                <button key={n} className={`chip link ${st}`} onClick={() => openDay(n)} title={getDay(n).title}>
                  <span className="dot" style={{ background: AREAS[getDay(n).area].color }} />
                  Tag {n} · {getDay(n).title.split(':')[0]}
                </button>
              )
            })}
          </div>
        )}
        {anchorText !== null ? (
          anchorText ? <Markdown text={anchorText} /> : <p className="typing">ordnet ein …</p>
        ) : ds.anchor ? (
          <>
            <Markdown text={ds.anchor} />
            <button className="btn ghost small" onClick={runAnchor} disabled={!hasKey}>Neu einordnen</button>
          </>
        ) : (
          <button className="btn" onClick={runAnchor} disabled={!hasKey}>Einordnen lassen: Zeitstrahl, Karte, frühere Sessions</button>
        )}
      </section>

      {!mix && (
        <section className="card">
          <div className="section-head">
            <h2>2 · Lernvideos</h2>
            <span className="muted">{starsWatched}/{stars.length} ★ gesehen · ~{Math.round(videos.length * 9)} min</span>
          </div>
          <VideoList
            videos={videos}
            watched={watched}
            onToggleWatched={(id) =>
              updateDay(day, (x) => {
                const w = new Set(x.watched ?? [])
                if (w.has(id)) w.delete(id)
                else w.add(id)
                return { ...x, watched: [...w], status: x.status === 'offen' ? 'laeuft' : x.status, startedAt: x.startedAt ?? new Date().toISOString() }
              })
            }
            onChange={setVideos}
            onReset={() => setVideos(defaultVideos(d))}
            day={day}
          />
        </section>
      )}

      <section className="card">
        <h2>{mix ? '2' : '3'} · Notizen</h2>
        <textarea
          className="notes"
          rows={3}
          placeholder="Eigene Stichpunkte während der Videos (fließen in Check & Zusammenfassung ein)"
          value={ds.notes ?? ''}
          onChange={(e) => updateDay(day, (x) => ({ ...x, notes: e.target.value }))}
        />
      </section>

      <section className="card">
        <div className="tabs">
          <button className={tab === 'fragen' ? 'active' : ''} onClick={() => setTab('fragen')}>{mix ? 'Fragen' : '4 · Deine Fragen'}</button>
          <button className={tab === 'check' ? 'active' : ''} onClick={() => setTab('check')}>Verständnischeck {checkDone && '✓'}</button>
          <button className={tab === 'zusammenfassung' ? 'active' : ''} onClick={() => setTab('zusammenfassung')}>Zusammenfassung {ds.summary && '✓'}</button>
        </div>

        {tab === 'fragen' && (
          <>
            <Chat
              key={`q-${day}`}
              history={ds.questions ?? []}
              onHistory={(h) => updateDay(day, (x) => ({ ...x, questions: h }))}
              send={(h, cb) => questionsChat(day, h, cb)}
              placeholder="Frag alles zum Thema …"
              disabled={!hasKey}
            />
            <div className="row end">
              <button className="btn primary" disabled={!hasKey} onClick={() => { start(); setTab('check') }}>Verstanden → Verständnischeck</button>
            </div>
          </>
        )}

        {tab === 'check' && (
          <>
            {(ds.check?.length ?? 0) === 0 && !hasKey ? (
              <p className="muted">API-Key fehlt.</p>
            ) : (
              <Chat
                key={`c-${day}-${checkGen}`}
                history={ds.check ?? []}
                onHistory={(h) => updateDay(day, (x) => ({ ...x, check: h }))}
                send={(h, cb) => checkChat(day, h, cb)}
                placeholder="Deine Antwort …"
                kickoff={mix ? 'Bereit für die Block-Abfrage.' : 'verstanden'}
                disabled={!hasKey || checkDone}
              />
            )}
            <div className="row end">
              {(ds.check?.length ?? 0) > 0 && <button className="btn ghost small" onClick={resetCheck}>Check neu starten</button>}
              {checkDone && (
                <button className="btn primary" onClick={finish} disabled={!!busy}>
                  {ds.status === 'fertig' ? 'Zusammenfassung neu erzeugen' : 'Session abschließen'}
                </button>
              )}
            </div>
          </>
        )}

        {tab === 'zusammenfassung' && (
          <div>
            {ds.summary ? (
              <>
                <Markdown text={ds.summary} />
                <div className="row end">
                  <button className="btn ghost small" onClick={() => navigator.clipboard?.writeText(ds.summary ?? '')}>Kopieren</button>
                  <button className="btn ghost small" onClick={finish} disabled={!!busy || !hasKey}>Neu erzeugen</button>
                </div>
              </>
            ) : (
              <p className="muted">Die Zusammenfassung entsteht automatisch, sobald der Verständnischeck sitzt.</p>
            )}
          </div>
        )}
        {busy && <p className="typing">{busy}</p>}
      </section>
    </div>
  )
}

function VideoList({
  videos, watched, onToggleWatched, onChange, onReset, day,
}: {
  videos: Video[]
  watched: Set<string>
  onToggleWatched: (id: string) => void
  onChange: (v: Video[]) => void
  onReset: () => void
  day: number
}) {
  const [editing, setEditing] = useState<string | null>(null)

  function patch(id: string, p: Partial<Video>) {
    onChange(videos.map((v) => (v.id === id ? { ...v, ...p } : v)))
  }

  function add() {
    const id = `${day}-u${Date.now()}`
    onChange([...videos, { id, title: 'Neues Video', url: '', star: false }])
    setEditing(id)
  }

  return (
    <>
      <ul className="videos">
        {videos.map((v) => (
          <li key={v.id} className={watched.has(v.id) ? 'done' : ''}>
            {editing === v.id ? (
              <div className="video-edit">
                <input value={v.title} onChange={(e) => patch(v.id, { title: e.target.value })} placeholder="Titel" />
                <input value={v.url} onChange={(e) => patch(v.id, { url: e.target.value })} placeholder="YouTube-Link einfügen" />
                <div className="row">
                  <button className="btn small" onClick={() => patch(v.id, { url: youtubeSearch(`${v.title} einfach erklärt`) })}>Als Suchlink</button>
                  <button className="btn small danger" onClick={() => onChange(videos.filter((x) => x.id !== v.id))}>Entfernen</button>
                  <button className="btn small primary" onClick={() => setEditing(null)}>Fertig</button>
                </div>
              </div>
            ) : (
              <>
                <input type="checkbox" checked={watched.has(v.id)} onChange={() => onToggleWatched(v.id)} aria-label="gesehen" />
                <button className={`star ${v.star ? 'on' : ''}`} onClick={() => patch(v.id, { star: !v.star })} title={v.star ? 'Pflichtvideo (wird abgefragt)' : 'optional'}>
                  {v.star ? '★' : '☆'}
                </button>
                {v.url ? (
                  <a href={v.url} target="_blank" rel="noreferrer">{v.title}</a>
                ) : (
                  <span>{v.title}</span>
                )}
                <span className="video-kind">{v.url.includes('/results?') ? 'Suche' : v.url ? 'Video' : ''}</span>
                <button className="btn ghost small" onClick={() => setEditing(v.id)} aria-label="Bearbeiten">✎</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="row">
        <button className="btn small" onClick={add}>+ Video</button>
        <button className="btn ghost small" onClick={() => confirm('Videoliste auf Standard zurücksetzen?') && onReset()}>Zurücksetzen</button>
      </div>
      <p className="muted small">★ = Pflichtvideo (wird abgefragt), ☆ = optional. Suchlinks öffnen YouTube mit passender Suche – gutes Video gefunden? Über ✎ den direkten Link einfügen.</p>
    </>
  )
}
