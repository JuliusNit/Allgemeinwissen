import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AREAS, getDay } from '../data/plan'
import { describeError, gradeExam, makeExam } from '../lib/ai'
import { useAiReady } from '../lib/cloud'
import { EXAM_APPLY, examOpen, examPlan, examScore, examTopics, type ExamTopic } from '../lib/exam'
import { haptic } from '../lib/native'
import { dayDone, VERDICT_MARK } from '../lib/stats'
import { examState, getState, updateExam, useStore, type ExamAnswer, type ExamQuestion, type ExamState, type ExamTest } from '../lib/store'
import { Coin, COIN_D, COIN_R, CoinBadge } from '../components/Coin'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { AccountButton } from '../components/NeedAccount'
import { inline } from '../components/inline'
import { Markdown } from '../components/Markdown'

// Pruefungs-Wiederholung: oben der dringendste Vorschlag, darunter alle Themen als Muenzen
// (dringend oben, weniger dringend unten). Antippen faehrt aus der Muenze einen Kasten mit "Test starten" aus.

const COLS = 3

const short = (day: number) => getDay(day).title.split(/[:(]/)[0].trim()

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
  if (examState(getState(), day).test && !examOpen(getState(), day)) updateExam(day, (e) => ({ ...e, test: undefined }))
  go(`/pruefung/${day}`)
}

function startLabel(day: number) {
  return examOpen(getState(), day) ? 'Test fortsetzen' : 'Test starten'
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

      <Frame className="card exam-hero">
        <button className="exam-hero-coin" onClick={() => startTest(top.day, go)} aria-label={`${short(top.day)}: ${startLabel(top.day)}`}>
          <CoinSvg day={top.day} size={132} ring />
        </button>
        <p className="muted small">Vorschlag · {top.reason}</p>
        <h2>{short(top.day)}</h2>
        <p className="muted small">{AREAS[getDay(top.day).area].name}</p>
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
                    aria-label={`${short(t.day)} – ${t.reason}`}
                  >
                    <CoinSvg day={t.day} size={78} pressed={on} />
                    <span className="muted small">{short(t.day)}</span>
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
          <p className="muted small">{AREAS[d.area].name}</p>
          <p className="exam-pop-title">{short(d.day)}</p>
          <p className="muted small">{t.reason}</p>
          <button className="btn primary small" onClick={() => startTest(t.day, go)}>{startLabel(t.day)}</button>
        </div>
      </Frame>
    </div>
  )
}

// Test eines Themas: Übersicht (Anzahl, Dauer, „Test starten“) → Test wird erzeugt → je Frage ein Screen → Ergebnis.
// Frage oben ueber die ganze Breite, darunter links gross das Material, rechts schmaler die Antwort (Handy: untereinander).
function ExamRun({ day, go }: { day: number; go: (hash: string) => void }) {
  const d = getDay(day)
  const ex = useStore((s) => examState(s, day))
  const done = useStore((s) => dayDone(s, day))
  const hasKey = useAiReady()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = ex.test
  // nach der Bewertung bleibt die Frage stehen, bis „Weiter“ – deshalb eigene Position statt answers.length
  const [pos, setPos] = useState(() => t?.answers.length ?? 0)
  const asking = !!t && pos < t.questions.length
  // steht vor dem Erzeugen fest: Aufbau des Tests aus exam.ts
  const total = useStore((s) => examPlan(s, day).length)
  const linked = total - EXAM_APPLY

  async function create() {
    setBusy(true)
    setError(null)
    try {
      const questions = await makeExam(day)
      updateExam(day, (e) => ({ ...e, chat: undefined, test: { questions, answers: [] } }))
      setPos(0)
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(false)
    }
  }

  function answer(a: ExamAnswer) {
    updateExam(day, (e) => {
      if (!e.test) return e
      const test = { ...e.test, answers: [...e.test.answers, a] }
      if (test.answers.length < test.questions.length) return { ...e, test }
      return { ...e, test, asked: test.questions.map((q) => q.q), results: [...e.results, { at: new Date().toISOString(), score: examScore(test) }] }
    })
    if (t && t.answers.length + 1 >= t.questions.length) haptic('erfolg')
  }

  // ohne Test zeigt die Seite die Übersicht im Ladezustand – schlaegt das Erzeugen fehl, steht dort wieder der Knopf
  function again() {
    updateExam(day, (e) => ({ ...e, test: undefined }))
    void create()
  }

  return (
    <div className={`exam${asking ? ' exam-wide' : ''}`}>
      <div className="page-head">
        <button className="icon-btn" onClick={() => go('/pruefung')} aria-label="Zurück zur Übersicht"><Icon name="BACK" size={26} /></button>
        <CoinBadge icon={d.area} size={52} />
        <div>
          <p className="muted small">Prüfung · {AREAS[d.area].name}</p>
          <h1>{short(day)}</h1>
        </div>
      </div>

      {!done ? (
        <Frame className="card empty">
          <p>Diese Session ist noch nicht abgeschlossen.</p>
          <button className="btn primary" onClick={() => go(`/tag/${day}`)}>Zur Session</button>
        </Frame>
      ) : !t ? (
        <>
          {!hasKey && <div className="notice">Für die Prüfung bitte anmelden – oder unter <b>Profil → KI</b> einen eigenen Key eintragen. <AccountButton /></div>}
          <Frame className="card exam-info">
            <p className="exam-count">{total} Fragen</p>
            <p className="muted">ca. {total} Minuten</p>
            <p className="muted small">{EXAM_APPLY} × Anwenden{linked > 0 ? ` · ${linked} × Zusammenhang` : ''}</p>
            {busy ? <p className="typing">Test wird erstellt …</p> : <button className="btn primary" onClick={() => void create()} disabled={!hasKey}>Test starten</button>}
            {error && <div className="chat-error">{error}</div>}
          </Frame>
        </>
      ) : asking ? (
        <ExamAsk
          key={pos}
          day={day}
          q={t.questions[pos]}
          a={t.answers[pos]}
          n={pos + 1}
          total={t.questions.length}
          ready={hasKey}
          onAnswer={answer}
          onNext={() => setPos(pos + 1)}
        />
      ) : (
        <ExamResult ex={ex} test={t} ready={hasKey} onAgain={again} onNext={() => go('/pruefung')} />
      )}
    </div>
  )
}

function ExamAsk({ day, q, a, n, total, ready, onAnswer, onNext }: {
  day: number
  q: ExamQuestion
  a?: ExamAnswer
  n: number
  total: number
  ready: boolean
  onAnswer: (a: ExamAnswer) => void
  onNext: () => void
}) {
  const [text, setText] = useState('')
  const [choice, setChoice] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wahl = q.form === 'wahl'
  const can = !busy && ready && (wahl ? choice != null : !!text.trim())

  async function submit() {
    if (!can) return
    setBusy(true)
    setError(null)
    try {
      const r = await gradeExam(day, q, text.trim(), wahl ? choice! : undefined)
      onAnswer({ text: text.trim(), ...(wahl ? { choice: choice! } : {}), at: Date.now(), ...r })
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="exam-q">
        <p className="muted small">Frage {n}/{total}</p>
        <h2>{inline(q.q)}</h2>
      </div>
      <div className={`exam-body${q.material ? ' two' : ''}`}>
        {q.material && (
          <Frame className="card exam-material">
            <Markdown text={q.material} />
          </Frame>
        )}
        <Frame className="card exam-answer">
          {a ? (
            <>
              <p className="exam-verdict"><span className={`verdict ${a.verdict}`}>{VERDICT_MARK[a.verdict]}</span></p>
              <Given q={q} a={a} />
              <p>{inline(a.feedback || q.solution)}</p>
              <div className="row end"><button className="btn primary" onClick={onNext}>{n === total ? 'Ergebnis' : 'Weiter'}</button></div>
            </>
          ) : (
            <>
              {wahl && (
                <div className="level-opts">
                  {q.options.map((o, i) => (
                    <button key={i} className={`level-opt${choice === i ? ' on' : ''}`} onClick={() => setChoice(i)} disabled={busy} aria-pressed={choice === i}>{inline(o)}</button>
                  ))}
                </div>
              )}
              <textarea
                value={text}
                rows={wahl ? 2 : 5}
                placeholder={wahl ? 'weil …' : 'Deine Antwort …'}
                disabled={busy}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void submit()
                  }
                }}
              />
              {error && <div className="chat-error">{error}</div>}
              {busy ? (
                <p className="typing">wird bewertet …</p>
              ) : (
                <div className="row end">
                  <button className="btn ghost small" onClick={() => onAnswer({ text: '', at: Date.now(), verdict: 'offen', precision: 1, feedback: q.solution })}>Weiß ich nicht</button>
                  <button className="btn primary" onClick={() => void submit()} disabled={!can}>Abgeben</button>
                </div>
              )}
            </>
          )}
        </Frame>
      </div>
    </>
  )
}

/** die eigene Antwort: gewaehlte Option + Text */
function Given({ q, a }: { q: ExamQuestion; a: ExamAnswer }) {
  if (a.choice == null && !a.text) return null
  return (
    <p className="exam-given">
      {a.choice != null && <b>{inline(q.options[a.choice] ?? '')}</b>}
      {a.choice != null && a.text ? ' – ' : ''}
      {a.text}
    </p>
  )
}

function ExamResult({ ex, test, ready, onAgain, onNext }: {
  ex: ExamState
  test: ExamTest
  ready: boolean
  onAgain: () => void
  onNext: () => void
}) {
  const right = test.answers.filter((a) => a.verdict === 'richtig').length
  return (
    <Frame className="card exam-result">
      <p className="exam-count">{right}/{test.questions.length} richtig</p>
      {ex.results.length > 1 && (
        <p className="muted small">Bisher: {ex.results.map((r) => (r.score == null ? '–' : `${Math.round(r.score * 100)} %`)).join(' · ')}</p>
      )}
      <ol className="done-qa exam-qa">
        {test.questions.map((q, i) => {
          const a = test.answers[i]
          return (
            <li key={i}>
              <span className={`verdict ${a.verdict}`}>{VERDICT_MARK[a.verdict]}</span>
              <details>
                <summary>{inline(q.q)}</summary>
                <Given q={q} a={a} />
                {a.verdict !== 'offen' && a.feedback && <p>{inline(a.feedback)}</p>}
                {a.verdict !== 'richtig' && q.solution && <div className="md"><blockquote>{inline(q.solution)}</blockquote></div>}
              </details>
            </li>
          )
        })}
      </ol>
      <div className="row end">
        <button className="btn" onClick={onAgain} disabled={!ready}>Neuer Test</button>
        <button className="btn primary" onClick={onNext}>Nächstes Thema</button>
      </div>
    </Frame>
  )
}
