import { useState } from 'react'
import { AREAS, DAYS, getDay } from '../data/plan'
import { addCards, deleteCard, dueCards, intervalLabel, rateCard, type Rating } from '../lib/srs'
import { dayState, useStore } from '../lib/store'
import { Markdown } from '../components/Markdown'

type Seg = 'karten' | 'zusammenfassungen' | 'stapel'

export function ReviewView({ openDay }: { openDay: (n: number) => void }) {
  const [seg, setSeg] = useState<Seg>('karten')
  const cards = useStore((s) => s.cards)
  const due = dueCards(cards)
  return (
    <div className="review">
      <h1>Wiederholen</h1>
      <div className="tabs">
        <button className={seg === 'karten' ? 'active' : ''} onClick={() => setSeg('karten')}>Fällig ({due.length})</button>
        <button className={seg === 'zusammenfassungen' ? 'active' : ''} onClick={() => setSeg('zusammenfassungen')}>Zusammenfassungen</button>
        <button className={seg === 'stapel' ? 'active' : ''} onClick={() => setSeg('stapel')}>Alle Karten ({cards.length})</button>
      </div>
      {seg === 'karten' && <Session />}
      {seg === 'zusammenfassungen' && <Summaries openDay={openDay} />}
      {seg === 'stapel' && <Deck />}
    </div>
  )
}

function Session() {
  const cards = useStore((s) => s.cards)
  const due = dueCards(cards)
  const [flipped, setFlipped] = useState(false)
  const card = due[0]

  if (!card) {
    const next = cards.map((c) => c.due).sort()[0]
    return (
      <div className="card empty">
        <p className="big">Alles wiederholt ✓</p>
        <p className="muted">{cards.length ? `Nächste Karte fällig am ${next}.` : 'Karteikarten entstehen automatisch, wenn du eine Session abschließt.'}</p>
      </div>
    )
  }
  const d = getDay(card.day)
  function rate(r: Rating) {
    rateCard(card.id, r)
    setFlipped(false)
  }
  return (
    <div className="card flash">
      <div className="flash-meta">
        <span className="badge" style={{ background: AREAS[d.area].color }}>{d.area}</span>
        <span className="muted">Tag {d.day} · {d.title.split(':')[0]}</span>
        <span className="muted right">{due.length} fällig</span>
      </div>
      <p className="flash-q">{card.q}</p>
      {flipped ? (
        <>
          <div className="flash-a"><Markdown text={card.a} /></div>
          <div className="rate">
            {(['Nochmal', 'Schwer', 'Gut', 'Leicht'] as const).map((label, i) => (
              <button key={label} className={`btn rate-${i}`} onClick={() => rate(i as Rating)}>
                {label}<small>{intervalLabel(card, i as Rating)}</small>
              </button>
            ))}
          </div>
        </>
      ) : (
        <button className="btn primary wide" onClick={() => setFlipped(true)}>Antwort zeigen</button>
      )}
      <p className="muted small">Erst selbst laut beantworten (Active Recall), dann aufdecken.</p>
    </div>
  )
}

function Summaries({ openDay }: { openDay: (n: number) => void }) {
  const s = useStore((x) => x)
  const done = DAYS.filter((d) => dayState(s, d.day).summary)
  const [open, setOpen] = useState<number | null>(null)
  if (!done.length) return <div className="card empty"><p className="muted">Noch keine Zusammenfassungen – sie entstehen nach jeder abgeschlossenen Session.</p></div>
  return (
    <div>
      {done.map((d) => (
        <section key={d.day} className="card">
          <button className="summary-head" onClick={() => setOpen(open === d.day ? null : d.day)}>
            <span className="badge" style={{ background: AREAS[d.area].color }}>{d.area}</span>
            <span>Tag {d.day} · {d.title}</span>
            <span className="muted right">{open === d.day ? '▲' : '▼'}</span>
          </button>
          {open === d.day && (
            <>
              <Markdown text={dayState(s, d.day).summary!} />
              <button className="btn ghost small" onClick={() => openDay(d.day)}>Zur Session</button>
            </>
          )}
        </section>
      ))}
    </div>
  )
}

function Deck() {
  const cards = useStore((s) => s.cards)
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [day, setDay] = useState(1)
  return (
    <div>
      <section className="card">
        <h2>Eigene Karte</h2>
        <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
          {DAYS.map((d) => <option key={d.day} value={d.day}>Tag {d.day} · {d.title}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Frage" />
        <textarea value={a} onChange={(e) => setA(e.target.value)} placeholder="Antwort" rows={2} />
        <button className="btn primary" disabled={!q.trim() || !a.trim()} onClick={() => { addCards(day, [{ q: q.trim(), a: a.trim() }]); setQ(''); setA('') }}>Hinzufügen</button>
      </section>
      <ul className="deck">
        {[...cards].sort((x, y) => x.day - y.day).map((c) => (
          <li key={c.id} className="card">
            <div className="flash-meta">
              <span className="badge" style={{ background: AREAS[getDay(c.day).area].color }}>{getDay(c.day).area}</span>
              <span className="muted">Tag {c.day} · fällig {c.due}</span>
              <button className="btn ghost small right" onClick={() => confirm('Karte löschen?') && deleteCard(c.id)}>Löschen</button>
            </div>
            <p><b>{c.q}</b></p>
            <p className="muted">{c.a}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
