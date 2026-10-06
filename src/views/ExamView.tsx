import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AREAS, getDay } from '../data/plan'
import { DONE_MARKER, examChat } from '../lib/ai'
import { useAiReady } from '../lib/cloud'
import { examScore, examTopics, type ExamTopic } from '../lib/exam'
import { dayState, examState, getState, updateExam, useStore } from '../lib/store'
import { Chat } from '../components/Chat'
import { Coin, COIN_D, COIN_R, CoinBadge } from '../components/Coin'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

// Pruefungs-Wiederholung: oben der dringendste Vorschlag, darunter alle Themen als Muenzen
// (dringend oben, weniger dringend unten). Antippen faehrt aus der Muenze einen Kasten mit "Test starten" aus.

const COLS = 3

const short = (day: number) => getDay(day).title.split(/[:(]/)[0].trim()

const finished = (day: number) => !!examState(getState(), day).chat?.some((m) => m.role === 'assistant' && m.content.includes(DONE_MARKER))

/** Muenze als eigenes SVG, mit Platz fuer den Ring des Vorschlags */
function CoinSvg({ day, size, ring, pressed }: { day: number; size: number; ring?: boolean; pressed?: boolean }) {
  const pad = ring ? 12 : 5
  const w = 2 * COIN_R + 2 * pad
  const h = 2 * COIN_R + COIN_D + 2 * pad
  return (
    <svg width={size} height={(size * h) / w} viewBox={`${-COIN_R - pad} ${-COIN_R - pad} ${w} ${h}`} aria-hidden className="exam-coin-svg">
      <Coin icon={getDay(day).area} state={ring ? 'current' : 'open'} pressed={!!pressed} />
    </svg>
  )
}

export function ExamView({ day, go }: { day?: number; go: (hash: string) => void }) {
  if (day) return <ExamRun key={day} day={day} go={go} />
  return <ExamList go={go} />
}

function startTest(day: number, go: (hash: string) => void) {
  // abgeschlossenen Test nicht wiederaufnehmen, sondern neu beginnen
  if (finished(day)) updateExam(day, (e) => ({ ...e, chat: [] }))
  go(`/pruefung/${day}`)
}

function startLabel(day: number) {
  const chat = examState(getState(), day).chat
  return chat?.length && !finished(day) ? 'Test fortsetzen' : 'Test starten'
}

function ExamList({ go }: { go: (hash: string) => void }) {
  const s = useStore((x) => x)
  const topics = examTopics(s)
  const [sel, setSel] = useState<{ day: number; col: number } | null>(null)

  if (!topics.length) {
    return (
      <div className="exam">
        <h1>Prüfung</h1>
        <Frame className="card empty">
          <p className="big">Noch keine Themen</p>
          <p className="muted">Hier wiederholst du abgeschlossene Sessions in Prüfungsform – mit Verständnis- und Transferaufgaben. Schließ zuerst eine Session auf dem Lernpfad ab.</p>
          <button className="btn primary" onClick={() => go('/')}>Zum Lernpfad</button>
        </Frame>
      </div>
    )
  }

  const [top, ...rest] = topics
  const rows: ExamTopic[][] = []
  for (let i = 0; i < rest.length; i += COLS) rows.push(rest.slice(i, i + COLS))
  const selTopic = sel ? rest.find((t) => t.day === sel.day) : undefined

  return (
    <div className="exam">
      <h1>Prüfung</h1>
      <p className="muted small">Wiederholen wie in einer Prüfung: Zusammenhänge erklären und Neues mit dem Gelernten erschließen.</p>

      <Frame className="card exam-hero">
        <button className="exam-hero-coin" onClick={() => startTest(top.day, go)} aria-label={`${short(top.day)}: ${startLabel(top.day)}`}>
          <CoinSvg day={top.day} size={132} ring />
        </button>
        <p className="muted small">Vorschlag · {top.reason}</p>
        <h2>{short(top.day)}</h2>
        <p className="muted small">{AREAS[getDay(top.day).area].name} · Tag {top.day}</p>
        <button className="btn primary" onClick={() => startTest(top.day, go)}>{startLabel(top.day)}</button>
      </Frame>

      {rest.length > 0 && <p className="exam-rank muted small">Weitere Themen · dringende zuerst</p>}
      <div className="exam-grid">
        {rows.map((row, ri) => (
          <div key={ri} className="exam-row-wrap">
            <div className="exam-row">
              {row.map((t, ci) => {
                const on = sel?.day === t.day
                return (
                  <button
                    key={t.day}
                    className={`exam-cell${on ? ' on' : ''}`}
                    onClick={() => setSel(on ? null : { day: t.day, col: ci })}
                    aria-expanded={on}
                    aria-label={`Tag ${t.day}: ${short(t.day)} – ${t.reason}`}
                  >
                    <CoinSvg day={t.day} size={78} pressed={on} />
                    <span className="muted small">Tag {t.day}</span>
                  </button>
                )
              })}
            </div>
            {selTopic && row.includes(selTopic) && (
              <ExamPop key={selTopic.day} t={selTopic} col={sel!.col} go={go} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Kasten, der aus der angetippten Muenze herausfaehrt */
function ExamPop({ t, col, go }: { t: ExamTopic; col: number; go: (hash: string) => void }) {
  const d = getDay(t.day)
  const style = { '--ox': `${((col + 0.5) / COLS) * 100}%` } as CSSProperties
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [])
  return (
    <div className="exam-pop" style={style} ref={ref}>
      <Frame className="exam-pop-box">
        <span className="exam-pop-coin"><CoinBadge icon={d.area} size={68} /></span>
        <div className="exam-pop-text">
          <p className="muted small">{AREAS[d.area].name} · Tag {d.day}</p>
          <p className="exam-pop-title">{short(d.day)}</p>
          <p className="muted small">{t.reason}</p>
          <button className="btn primary small" onClick={() => startTest(t.day, go)}>{startLabel(t.day)}</button>
        </div>
      </Frame>
    </div>
  )
}

function ExamRun({ day, go }: { day: number; go: (hash: string) => void }) {
  const d = getDay(day)
  const ex = useStore((s) => examState(s, day))
  const done = useStore((s) => dayState(s, day).status === 'fertig')
  const summary = useStore((s) => dayState(s, day).summary)
  const hasKey = useAiReady()
  const [gen, setGen] = useState(0)
  const chat = ex.chat ?? []
  const isDone = chat.some((m) => m.role === 'assistant' && m.content.includes(DONE_MARKER))
  const last = ex.results[ex.results.length - 1]

  function restart() {
    updateExam(day, (e) => ({ ...e, chat: [] }))
    setGen((g) => g + 1)
  }

  function record() {
    updateExam(day, (e) => ({ ...e, results: [...e.results, { at: new Date().toISOString(), score: examScore(e.chat ?? []) }] }))
  }

  return (
    <div className="exam">
      <div className="page-head">
        <button className="icon-btn" onClick={() => go('/pruefung')} aria-label="Zurück zur Übersicht"><Icon name="BACK" size={26} /></button>
        <CoinBadge icon={d.area} size={52} />
        <div>
          <p className="muted small">Prüfung · {AREAS[d.area].name} · Tag {d.day}</p>
          <h1>{short(day)}</h1>
        </div>
      </div>

      {!done ? (
        <Frame className="card empty">
          <p>Diese Session ist noch nicht abgeschlossen.</p>
          <button className="btn primary" onClick={() => go(`/tag/${day}`)}>Zur Session</button>
        </Frame>
      ) : (
        <>
          {!hasKey && <div className="notice">Für die Prüfung bitte anmelden – oder unter <b>Profil → KI</b> einen eigenen Key eintragen.</div>}
          <Frame className="card">
            <p className="muted small">2 Aufgaben: erst Verständnis, dann Transfer – neues Material, das du mit diesem Thema erschließt.</p>
            {(hasKey || chat.length > 0) && (
              <Chat
                key={`e-${day}-${gen}`}
                history={chat}
                onHistory={(h) => updateExam(day, (e) => ({ ...e, chat: h }))}
                send={(h, cb) => examChat(day, h, cb)}
                placeholder="Deine Antwort – ruhig ausführlich …"
                kickoff="Prüfung starten"
                disabled={!hasKey || isDone}
                onDone={record}
              />
            )}
            {isDone && (
              <div className="exam-result">
                <p className="big">{last?.score == null ? 'Test abgeschlossen' : `${Math.round(last.score * 100)} % richtig`}</p>
                {ex.results.length > 1 && (
                  <p className="muted small">Bisher: {ex.results.map((r) => (r.score == null ? '–' : `${Math.round(r.score * 100)} %`)).join(' · ')}</p>
                )}
              </div>
            )}
            <div className="row end">
              {chat.length > 0 && !isDone && <button className="btn ghost small" onClick={() => confirm('Test neu beginnen? Der bisherige Verlauf wird gelöscht.') && restart()}>Neu beginnen</button>}
              {isDone && <button className="btn" onClick={restart} disabled={!hasKey}>Neuer Test</button>}
              {isDone && <button className="btn primary" onClick={() => go('/pruefung')}>Nächstes Thema</button>}
            </div>
          </Frame>
          {summary && (
            <Frame className="card">
              <details>
                <summary>Lernzettel {isDone ? '' : '(erst nach dem Test spicken)'}</summary>
                <Markdown text={summary} />
              </details>
            </Frame>
          )}
        </>
      )}
    </div>
  )
}
