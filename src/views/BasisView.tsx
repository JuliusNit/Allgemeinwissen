import { getDay } from '../data/plan'
import { FAECHER, fach, topicsUpTo, type Fach } from '../data/lehrplan'
import { DAY_FACH, knownUpTo, levelLabel, SCHOOL_GRADE } from '../data/school'
import { basisChat, DONE_MARKER } from '../lib/ai'
import { useAiReady } from '../lib/cloud'
import { basisNode, nodeDone, nodeReady, type BasisNode } from '../lib/path'
import { dayState, setState, today, useStore, videosOf } from '../lib/store'
import { Chat } from '../components/Chat'
import { CoinBadge } from '../components/Coin'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { VideoWatch } from '../components/VideoWatch'
import type { ChatMsg } from '../lib/store'

const NO_MSGS: ChatMsg[] = []

export function basisTitle(n: BasisNode): { head: string; title: string } {
  if (n.variant === 'auffrischung') return { head: 'Auffrischung', title: 'Grundwissen gemischt' }
  if (n.variant === 'abschluss') return { head: 'Abschluss', title: 'Grundwissen-Check' }
  return { head: fach(n.fach as Exclude<typeof n.fach, 'mix'>).name, title: `Grundcheck · ${n.days.length} ${n.days.length === 1 ? 'Session' : 'Sessions'}` }
}

interface Props {
  id: string
  go: (hash: string) => void
  /** geoeffnetes Video (Route /wiederholung/ID/video/Tag/Video[/Sekunden]) */
  vday?: number
  video?: string
  at?: number
  openVideo: (day: number, id: string, t?: number) => void
  closeVideo: () => void
}

export function BasisView({ id, go, vday, video, at, openVideo, closeVideo }: Props) {
  const node = useStore((s) => basisNode(s, id))
  const level = useStore((s) => s.level)
  const history = useStore((s) => s.basis[id] ?? NO_MSGS)
  const doneAt = useStore((s) => s.reviews[id])
  const done = useStore((s) => (node ? nodeDone(s, node) : false))
  const ready = useStore((s) => (node ? nodeReady(s, node) : false))
  const statuses = useStore((s) => s.days)
  const hasKey = useAiReady()
  const state = useStore((s) => s)

  if (!node) {
    return (
      <div className="review">
        <Frame className="card empty">
          <p>Diese Station gibt es für deinen Wissensstand nicht.</p>
          <button className="btn primary" onClick={() => go('/')}>Zum Lernpfad</button>
        </Frame>
      </div>
    )
  }

  const max = knownUpTo(level)
  const t = basisTitle(node)
  const mix = node.fach === 'mix'
  const faecher = mix ? FAECHER.filter((f) => node.days.some((d) => DAY_FACH[d] === f.id)) : [fach(node.fach as Exclude<typeof node.fach, 'mix'>)]
  const checkDone = history.some((m) => m.role === 'assistant' && m.content.includes(DONE_MARKER))
  const playVideos = vday ? videosOf(state, vday) : []
  const playing = video ? playVideos.find((v) => v.id === video) : undefined
  const markDone = () => setState((s) => ({ ...s, reviews: { ...s.reviews, [id]: s.reviews[id] ?? today() } }))

  return (
    <div className="review basis">
      {playing && vday && (
        <VideoWatch day={vday} videos={playVideos} video={playing} at={at} open={(vid, t) => openVideo(vday, vid, t)} close={closeVideo} />
      )}
      <div className="page-head">
        <button className="icon-btn" onClick={() => go('/')} aria-label="Zurück zum Lernpfad"><Icon name="BACK" size={26} /></button>
        <CoinBadge icon={mix ? 'REVIEW' : faecher[0].icon} size={52} />
        <div>
          <h1>{node.variant === 'start' ? `Grundwiederholung · ${t.head}` : `${t.head} · ${t.title}`}</h1>
          <p className="muted small">
            {level ? levelLabel(level) : ''} · Schulstoff bis Jgst. {max} (LehrplanPLUS Bayern, Gymnasium)
          </p>
        </div>
      </div>

      {!ready ? (
        <Frame className="card empty">
          <p>Diese Station öffnet sich, wenn alle Sessions davor abgeschlossen sind.</p>
        </Frame>
      ) : (
        <Frame className="card">
          <h2>Grundcheck {checkDone && '✓'}</h2>
          {history.length === 0 && !hasKey ? (
            <p className="muted">KI nicht verfügbar – bitte anmelden.</p>
          ) : (
            <Chat
              key={`b-${id}-${history.length === 0 ? 0 : 1}`}
              history={history}
              onHistory={(h) => setState((s) => ({ ...s, basis: { ...s.basis, [id]: h } }))}
              send={(h, cb) => basisChat(node, h, cb)}
              placeholder="Deine Antwort …"
              kickoff="Bereit für den Grundcheck."
              disabled={!hasKey || checkDone}
              onDone={markDone}
            />
          )}
          <div className="row end">
            {history.length > 0 && (
              <button className="btn ghost small" onClick={() => setState((s) => ({ ...s, basis: { ...s.basis, [id]: [] } }))}>
                Check neu starten
              </button>
            )}
            {!done && <button className="btn small" onClick={markDone}>Ohne Check abhaken</button>}
            {doneAt && <span className="muted small">Erledigt am {doneAt}</span>}
          </div>
        </Frame>
      )}

      <Frame className="card">
        <h2>Lehrplan bis Jgst. {max}</h2>
        {faecher.map((f) => (
          <div key={f.id} className="lp-fach">
            {mix && <h3><Icon name={f.icon} size={18} /> {f.name}</h3>}
            <ul className="lp">
              {gradeRows(f, max, node.days).map(([g, ts, days]) => (
                <li key={g}>
                  <b>{g}</b> {ts.join(' · ')}
                  {days.length > 0 && (
                    <ul className="videos lp-videos">
                      {days.flatMap((d) => {
                        const watched = dayState(state, d).watched ?? []
                        return videosOf(state, d).map((v) => (
                          <li key={v.id} className={watched.includes(v.id) ? 'done' : ''}>
                            <button className="video-open" onClick={() => openVideo(d, v.id)}>
                              <span className="video-play" aria-hidden>▶</span>
                              <span>{v.title}{v.source && <small className="video-source"> · {v.source}</small>}</span>
                            </button>
                          </li>
                        ))
                      })}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Frame>

      <Frame className="card">
        <h2>Sessions zum Vertiefen</h2>
        <div className="chips">
          {node.days.map((n) => {
            const st = statuses[n]?.status ?? 'offen'
            return (
              <button key={n} className={`chip link ${st}`} onClick={() => go(`/tag/${n}`)} title={getDay(n).title}>
                <Icon name={getDay(n).area} size={16} />
                Tag {n} · {getDay(n).title.split(/[:(]/)[0].trim()} <span className="muted">· Jgst. {SCHOOL_GRADE[n]}</span>
              </button>
            )
          })}
        </div>
      </Frame>
    </div>
  )
}

/** Lehrplan-Zeilen je Jgst., dazu die Sessions dieser Station aus derselben Jgst. (fuer die Videos) */
function gradeRows(f: Fach, max: number, days: number[]): [number, string[], number[]][] {
  const rows = new Map<number, [string[], number[]]>(topicsUpTo(f, max).map(([g, ts]) => [g, [ts, []]]))
  for (const d of days) {
    const g = SCHOOL_GRADE[d]
    if (DAY_FACH[d] !== f.id || g === undefined) continue
    if (!rows.has(g)) rows.set(g, [[], []])
    rows.get(g)![1].push(d)
  }
  return [...rows].sort((a, b) => a[0] - b[0]).map(([g, [ts, ds]]) => [g, ts, ds])
}
