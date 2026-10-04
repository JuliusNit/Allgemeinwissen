import { useEffect, useRef, useState } from 'react'
import { getDay } from '../data/plan'
import { reviewNode, reviewReady } from '../lib/path'
import { dueCards, intervalLabel, rateCard, type Rating } from '../lib/srs'
import { getState, setState, today, useStore } from '../lib/store'
import { CoinBadge } from '../components/Coin'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

/** Karten fuer eine Station: alle Karten der abgedeckten Sessions (gemischt) + faellige Karten (max. 20) */
function buildQueue(id: string): string[] {
  const s = getState()
  const node = reviewNode(id)
  const due = dueCards(s.cards).map((c) => c.id)
  if (!node) return due
  const own = s.cards.filter((c) => node.days.includes(c.day)).map((c) => c.id)
  const extra = due.filter((x) => !own.includes(x)).slice(0, 20)
  return shuffle([...own, ...extra])
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

export function ReviewView({ id, go }: { id: string; go: (hash: string) => void }) {
  const node = reviewNode(id)
  const ready = useStore((s) => (node ? reviewReady(s, node) : true))
  const doneAt = useStore((s) => s.reviews[id])
  const cards = useStore((s) => s.cards)
  const [queue, setQueue] = useState<string[]>(() => buildQueue(id))
  const [stats, setStats] = useState({ ok: 0, again: 0 })
  const [flipped, setFlipped] = useState(false)
  const shownAt = useRef(0)
  const revealMs = useRef(0)

  const title = node ? `Wiederholung · Tag ${node.days[0]}–${node.days[node.days.length - 1]}` : 'Fällige Karten'
  const card = cards.find((c) => c.id === queue[0])

  // Zeit bis zum Aufdecken messen, ab dem Moment, in dem die Karte erscheint
  useEffect(() => {
    shownAt.current = Date.now()
  }, [queue])

  function reveal() {
    revealMs.current = Date.now() - shownAt.current
    setFlipped(true)
  }

  function rate(r: Rating) {
    if (!card) return
    rateCard(card.id, r, revealMs.current)
    setStats((x) => (r === 0 ? { ...x, again: x.again + 1 } : { ...x, ok: x.ok + 1 }))
    // "Nochmal" kommt ans Ende der Runde (Lernschritt), sonst raus
    const rest = queue.slice(1)
    const next = r === 0 ? [...rest, card.id] : rest
    setQueue(next)
    setFlipped(false)
    if (!next.length && node) setState((s) => ({ ...s, reviews: { ...s.reviews, [id]: s.reviews[id] ?? today() } }))
  }

  const head = (
    <div className="page-head">
      <button className="icon-btn" onClick={() => go('/')} aria-label="Zurück zum Lernpfad"><Icon name="BACK" size={26} /></button>
      <CoinBadge icon="REVIEW" size={52} />
      <div>
        <h1>{title}</h1>
        {node && <p className="muted small">{node.days.map((d) => getDay(d).title.split(/[:(]/)[0].trim()).join(' · ')}</p>}
      </div>
    </div>
  )

  if (node && !ready) {
    return (
      <div className="review">
        {head}
        <Frame className="card empty">
          <p>Diese Station öffnet sich, wenn die Sessions <b>Tag {node.days.join(', ')}</b> abgeschlossen sind.</p>
          <p className="muted small">Abrufen statt Wiederlesen: hier werden die Karteikarten dieser Sessions gemischt abgefragt, dazu alles, was laut Wiederholungsplan fällig ist.</p>
        </Frame>
      </div>
    )
  }

  if (!card) {
    const finished = stats.ok + stats.again > 0
    return (
      <div className="review">
        {head}
        <Frame className="card empty">
          <p className="big">{finished || doneAt ? 'Station geschafft ✓' : 'Keine Karten'}</p>
          {finished && <p className="muted">{stats.ok} gewusst · {stats.again}× nochmal</p>}
          {!finished && !doneAt && node && (
            <>
              <p className="muted">Für diese Sessions gibt es noch keine Karteikarten.</p>
              <button className="btn" onClick={() => setState((s) => ({ ...s, reviews: { ...s.reviews, [id]: today() } }))}>Trotzdem abhaken</button>
            </>
          )}
          {doneAt && !finished && <p className="muted">Erledigt am {doneAt}. <button className="btn small" onClick={() => setQueue(buildQueue(id))}>Nochmal üben</button></p>}
          <button className="btn primary" onClick={() => go('/')}>Zum Lernpfad</button>
        </Frame>
      </div>
    )
  }

  const d = getDay(card.day)
  return (
    <div className="review">
      {head}
      <Frame className="card flash">
        <div className="flash-meta">
          <Icon name={d.area} size={22} />
          <span className="muted small">Tag {d.day} · {d.title.split(/[:(]/)[0].trim()}</span>
          <span className="muted small right">noch {queue.length}</span>
        </div>
        <p className="flash-q">{card.q}</p>
        {flipped ? (
          <>
            <div className="flash-a"><Markdown text={card.a} /></div>
            <div className="rate">
              {(['Nochmal', 'Schwer', 'Gut', 'Leicht'] as const).map((l, i) => (
                <button key={l} className={`btn rate-${i}`} onClick={() => rate(i as Rating)}>
                  {l}
                  <small>{intervalLabel(card, i as Rating)}</small>
                </button>
              ))}
            </div>
          </>
        ) : (
          <button className="btn primary wide" onClick={reveal}>Antwort zeigen</button>
        )}
        <p className="muted small">Erst selbst beantworten (Active Recall), dann aufdecken.</p>
      </Frame>
    </div>
  )
}
