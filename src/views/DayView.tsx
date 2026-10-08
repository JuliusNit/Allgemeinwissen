import { useState } from 'react'
import { AREAS, BLOCKS, getDay, isBlockMix, type Video } from '../data/plan'
import { anchorChat, checkChat, describeError, DONE_MARKER, makeSummary, questionsChat } from '../lib/ai'
import { saveDayVideos, useAiReady, useCanEdit } from '../lib/cloud'
import { blockName, isRepeat, SCHOOL_GRADE } from '../data/school'
import { addCards } from '../lib/srs'
import { dayState, sortNotes, today, updateDay, useStore, videosOf } from '../lib/store'
import { fmtTime } from '../lib/video'
import { VideoWatch } from '../components/VideoWatch'
import { VideoList } from '../components/VideoList'
import { Chat } from '../components/Chat'
import { Markdown } from '../components/Markdown'
import { CoinBadge } from '../components/Coin'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'

type Tab = 'fragen' | 'check' | 'zusammenfassung'

interface Props {
  day: number
  /** geoeffnetes Video (Route /tag/N/video/ID[/Sekunden]) */
  video?: string
  at?: number
  openDay: (n: number) => void
  openVideo: (id: string, t?: number) => void
  closeVideo: () => void
  back: () => void
}

export function DayView({ day, video, at, openDay, openVideo, closeVideo, back }: Props) {
  const d = getDay(day)
  const ds = useStore((s) => dayState(s, day))
  const videos = useStore((s) => videosOf(s, day))
  const statuses = useStore((s) => s.days)
  const hasKey = useAiReady()
  const level = useStore((s) => s.level)
  const canEdit = useCanEdit()
  const repeat = isRepeat(level, day)
  const grade = SCHOOL_GRADE[day]
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
  const playing = video ? videos.find((v) => v.id === video) : undefined
  const noteCount = Object.values(ds.videoNotes ?? {}).reduce((a, n) => a + n.length, 0)

  function setVideos(v: Video[] | null) {
    setError(null)
    saveDayVideos(day, v).catch((e) => setError(describeError(e)))
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
      {playing && <VideoWatch day={day} videos={videos} video={playing} at={at} open={openVideo} close={closeVideo} />}
      <div className="day-head">
        <div className="day-nav">
          <button className="icon-btn" onClick={back} aria-label="Zurück zum Lernpfad"><Icon name="BACK" size={26} /></button>
          <span className="muted small">Tag {day} / 90 · {blockName(block, level)}</span>
          <span className="right">
            <button className="btn ghost small" disabled={day <= 1} onClick={() => openDay(day - 1)} aria-label="Vorheriger Tag">‹</button>
            <button className="btn ghost small" disabled={day >= 90} onClick={() => openDay(day + 1)} aria-label="Nächster Tag">›</button>
          </span>
        </div>
        <div className="day-title">
          <CoinBadge icon={d.area} size={60} />
          <div>
            <p className="muted small">{AREAS[d.area].name}</p>
            <h1>{d.title}</h1>
          </div>
        </div>
        <p className="muted">{d.subtopics.join(' · ')}</p>
        <div className="status-row">
          <span className={`status ${ds.status}`}>{ds.status === 'offen' ? 'offen' : ds.status === 'laeuft' ? 'läuft' : `abgeschlossen ${ds.completedAt ?? ''}`}</span>
          {repeat && <span className="chip repeat"><Icon name="REVIEW" size={16} /> Wiederholung · Schulstoff Kl. {grade}</span>}
          {!repeat && grade !== undefined && level?.kind === 'schule' && <span className="chip">kommt in Klasse {grade}</span>}
          {d.evidence && <span className="chip warn">Evidenzcheck: belegt vs. Hype</span>}
          {ds.status === 'offen' && <button className="btn primary" onClick={start}>Session starten</button>}
        </div>
      </div>

      {repeat && ds.status !== 'fertig' && (
        <div className="notice">Kennst du aus der Schule. Die Videos sind nur zum Auffrischen – du kannst direkt mit Anknüpfen und Verständnischeck starten. Der Check sucht Lücken und verknüpft den Stoff mit Neuem.</div>
      )}
      {!hasKey && <div className="notice">Für Anknüpfen, Fragen und Verständnischeck bitte anmelden – oder unter <b>Profil → KI</b> einen eigenen Key eintragen.</div>}
      {error && <div className="chat-error">{error}</div>}

      <Frame className="card">
        <h2>1 · Anknüpfen</h2>
        {d.links.length > 0 && (
          <div className="chips">
            {d.links.map((n) => {
              const st = statuses[n]?.status ?? 'offen'
              return (
                <button key={n} className={`chip link ${st}`} onClick={() => openDay(n)} title={getDay(n).title}>
                  <Icon name={getDay(n).area} size={16} />
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
      </Frame>

      {!mix && (
        <Frame className="card">
          <div className="section-head">
            <h2>2 · Lernvideos{repeat ? ' (optional)' : ''}</h2>
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
            canEdit={canEdit}
            onOpen={openVideo}
            noteCounts={Object.fromEntries(Object.entries(ds.videoNotes ?? {}).map(([k, n]) => [k, n.length]))}
            onReset={() => setVideos(null)}
            day={day}
          />
        </Frame>
      )}

      <Frame className="card">
        <div className="section-head">
          <h2>{mix ? '2' : '3'} · Notizen</h2>
          {noteCount > 0 && <span className="muted small">{noteCount} am Video</span>}
        </div>
        {videos.map((v) => {
          const notes = sortNotes(ds.videoNotes?.[v.id] ?? [])
          if (!notes.length) return null
          return (
            <div key={v.id} className="note-group">
              <button className="note-video" onClick={() => openVideo(v.id)}>{v.title}</button>
              <ul className="vnotes static">
                {notes.map((n) => (
                  <li key={n.id}>
                    {n.t !== undefined ? (
                      <button className="stamp" onClick={() => openVideo(v.id, n.t)} title="Video an dieser Stelle öffnen">{fmtTime(n.t)}</button>
                    ) : (
                      <span className="stamp none">–</span>
                    )}
                    <p>{n.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        <textarea
          className="notes"
          rows={2}
          placeholder={mix ? 'Eigene Stichpunkte (fließen in Check & Zusammenfassung ein)' : 'Allgemeine Notizen zur Session'}
          value={ds.notes ?? ''}
          onChange={(e) => updateDay(day, (x) => ({ ...x, notes: e.target.value }))}
        />
      </Frame>

      <Frame className="card">
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
              <p className="muted">KI nicht verfügbar – bitte anmelden.</p>
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
      </Frame>
    </div>
  )
}
