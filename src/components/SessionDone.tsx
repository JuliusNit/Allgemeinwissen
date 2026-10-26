import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AREAS, BLOCKS, DAYS, getDay } from '../data/plan'
import { hasSheet } from '../data/lernzettel'
import { line, poly, roundRect } from '../lib/ink'
import { areaDays, sessionNo } from '../lib/path'
import { knowledgeIndex } from '../lib/recap'
import { checkNotes, dayDone, parseCheck, type Verdict } from '../lib/stats'
import { dayState, getState, today, type State } from '../lib/store'
import { CoinBadge, CoinButton } from './Coin'
import { InkPaths } from './Ink'
import { LernzettelFull, SheetFull } from './Lernzettel'

// „Session geschafft“: erscheint, sobald der Verstaendnischeck fertig ist. Nacheinander: Thema wird
// abgehakt → Zeit → Antworten mit Staerken/Luecken → Balken Ueberthema (faehrt aus, waechst) →
// Lernstand gesamt (Wissensindex) → Knoepfe. Antippen zeigt sofort alles.

const STEPS = [0, 800, 1500, 2600, 4300, 5900]
const END = '9999-12-31'

/** Zustand mit der Session als offen bzw. abgeschlossen – fuer vorher/nachher */
function withDone(s: State, day: number, done: boolean): State {
  const ds = dayState(s, day)
  const next = done ? { ...ds, status: 'fertig' as const, completedAt: ds.completedAt ?? today() } : { ...ds, status: 'laeuft' as const, completedAt: undefined }
  return { ...s, days: { ...s.days, [day]: next } }
}

const MARKS: Record<Verdict, string> = { richtig: '✓', teilweise: '~', falsch: '✗', offen: '?' }

/** Kurzform einer Frage: ohne „Frage n/m“, bei Nachfragen der letzte Satz mit „?“ */
function shortQ(t: string): { text: string; follow: boolean } {
  const lines = t.replace(/[*_`#>]/g, '').split('\n').map((l) => l.trim()).filter(Boolean)
  const head = /^Frage\s+\d+\s*\/\s*\d+\s*:?\s*/i
  const follow = !head.test(lines[0] ?? '')
  let s = follow ? ([...lines].reverse().find((l) => l.includes('?')) ?? lines[0] ?? '') : lines[0].replace(head, '') || lines[1] || ''
  if (follow) s = s.match(/[^.!:]*\?/g)?.pop()?.trim() ?? s
  return { text: s.length > 120 ? s.slice(0, 117).trimEnd() + ' …' : s, follow }
}

const fmtMin = (ms: number) => {
  const m = Math.max(1, Math.round(ms / 60_000))
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`
}

interface Props {
  day: number
  /** KI-Zusammenfassung: Schema der Session + was nicht sass (entsteht, waehrend der Bildschirm laeuft) */
  summary?: string
  busy: boolean
  onEnd: () => void
}

export function SessionDone({ day, summary, busy, onEnd }: Props) {
  const d = getDay(day)
  const [step, setStep] = useState(0)
  const [sheet, setSheet] = useState<'lz' | 'zf' | null>(null)
  const [pressed, setPressed] = useState(false)

  const r = useMemo(() => {
    const s = getState()
    const ds = dayState(s, day)
    const msgs = ds.check ?? []
    const before = withDone(s, day, false)
    const after = withDone(s, day, true)
    const mix = d.area === 'MIX'
    const group = mix ? DAYS.filter((x) => x.block === d.block) : areaDays(s, d.area)
    const cnt = (st: State) => group.filter((x) => dayDone(st, x.day)).length
    // Zeit: vom Start der Session, sonst (lange Pause dazwischen) nur der Verstaendnischeck
    const last = msgs[msgs.length - 1]?.at ?? Date.now()
    const start = ds.startedAt ? Date.parse(ds.startedAt) : NaN
    let ms = last - start
    if (!(ms > 0 && ms < 6 * 3600_000)) ms = last - (msgs[0]?.at ?? last)
    const qa = parseCheck(msgs).filter((q) => q.verdict)
    const secs = qa.filter((q) => q.ms).map((q) => q.ms! / 1000)
    return {
      no: sessionNo(s, day),
      ms,
      avgSec: secs.length ? secs.reduce((a, b) => a + b, 0) / secs.length : null,
      qa: qa.map((q) => ({ v: q.verdict!, ...shortQ(q.question) })),
      right: qa.filter((q) => q.verdict === 'richtig').length,
      notes: checkNotes(msgs),
      group: mix ? BLOCKS[d.block].name : AREAS[d.area].name,
      total: group.length,
      doneBefore: cnt(before),
      doneAfter: cnt(after),
      idxBefore: knowledgeIndex(before, END),
      idxAfter: knowledgeIndex(after, END),
    }
  }, [day, d])

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setStep(STEPS.length)
    const ts = STEPS.map((t, i) => setTimeout(() => setStep((x) => Math.max(x, i + 1)), t + 150))
    return () => ts.forEach(clearTimeout)
  }, [])

  const on = (i: number) => `done-sec${step > i ? ' on' : ''}`
  const idxDiff = r.idxAfter - r.idxBefore

  return createPortal(
    <div className="done-back" role="dialog" aria-modal="true" aria-label="Session geschafft" onClick={() => setStep(STEPS.length)}>
      <div className="done">
        <div className={on(0)}>
          {r.no && <p className="muted small">Session {r.no}</p>}
          <div className="done-title">
            <span className="done-coin">
              <CoinBadge icon={d.area} size={64} />
              <svg className="done-tick" viewBox="0 0 40 40" aria-hidden>
                <circle cx={21} cy={20} r={19} fill="#fff" />
                <InkPaths strokes={TICK} w={4.2} />
              </svg>
            </span>
            <h1>{d.title}</h1>
          </div>
        </div>

        <div className={`${on(1)} done-nums`}>
          <Num v={fmtMin(r.ms)} l="Zeit" />
          <Num v={r.avgSec == null ? '–' : `${Math.round(r.avgSec)} s`} l="Ø Antwort" />
          <Num v={r.qa.length ? `${r.right}/${r.qa.length}` : '–'} l="richtig" />
        </div>

        <div className={on(2)}>
          {r.qa.length > 0 && (
            <ol className="done-qa">
              {r.qa.map((q, i) => (
                <li key={i} className={q.follow ? 'follow' : ''}>
                  <span className={`verdict ${q.v}`}>{MARKS[q.v]}</span>
                  <span>{q.text}</span>
                </li>
              ))}
            </ol>
          )}
          {(r.notes.strong.length > 0 || r.notes.weak.length > 0) && (
            <div className="done-notes">
              {r.notes.strong.length > 0 && (
                <div>
                  <h3>Stärken</h3>
                  <ul>{r.notes.strong.map((t, i) => <li key={i} className="good">{t}</li>)}</ul>
                </div>
              )}
              {r.notes.weak.length > 0 && (
                <div>
                  <h3>Lücken</h3>
                  <ul>{r.notes.weak.map((t, i) => <li key={i} className="bad">{t}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={on(3)}>
          <div className="done-bar-head">
            <b>{r.group}</b>
            <span>
              {r.doneAfter}/{r.total}
              {r.doneAfter > r.doneBefore && <span className="good gain"> +{r.doneAfter - r.doneBefore}</span>}
            </span>
          </div>
          <GrowBar from={(100 * r.doneBefore) / r.total} to={(100 * r.doneAfter) / r.total} />
        </div>

        <div className={on(4)}>
          <div className="done-bar-head">
            <b>Lernstand gesamt</b>
            <span>
              {Math.round(r.idxAfter)} %
              {idxDiff >= 0.05 && <span className="good gain"> +{idxDiff.toFixed(1).replace('.', ',')}</span>}
            </span>
          </div>
          <GrowBar from={r.idxBefore} to={r.idxAfter} />
        </div>

        <div className={`${on(5)} done-actions`}>
          <span className="done-sheets">
            {hasSheet(day) && <button className="btn" onClick={(e) => (e.stopPropagation(), setSheet('lz'))}>Lernzettel</button>}
            <button className="btn" disabled={!summary} onClick={(e) => (e.stopPropagation(), setSheet('zf'))}>
              {summary || !busy ? 'Zusammenfassung' : 'Zusammenfassung …'}
            </button>
          </span>
          <svg
            className="done-end"
            viewBox="-112 -30 224 72"
            role="button"
            tabIndex={0}
            aria-label="Session beenden"
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            onClick={(e) => (e.stopPropagation(), onEnd())}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEnd()}
          >
            <CoinButton label="Session beenden" hw={104} hh={24} pressed={pressed} />
          </svg>
        </div>
      </div>
      {sheet === 'lz' && <LernzettelFull day={day} title={d.title} onClose={() => setSheet(null)} />}
      {sheet === 'zf' && summary && <SheetFull text={summary} title={d.title} kind="Zusammenfassung" onClose={() => setSheet(null)} />}
    </div>,
    document.body,
  )
}

const TICK = poly([[7, 21], [16, 30], [34, 8]])

function Num({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <b>{v}</b>
      <span className="muted small">{l}</span>
    </div>
  )
}

/** Balken 0–100 %: Rahmen faehrt aus, Stand vorher schraffiert, dann waechst der Zuwachs gruen schraffiert */
function GrowBar({ from, to }: { from: number; to: number }) {
  const W = 300
  const H = 22
  const x = (p: number) => 2 + ((W - 4) * Math.min(100, Math.max(0, p))) / 100
  const box = useMemo(() => [roundRect(1.5, 1.5, W - 3, H - 3, 7)], [])
  const mark = useMemo(() => (to > from ? [line([x(from), 3], [x(from), H - 3])] : []), [from, to])
  return (
    <svg className="recap-bar done-bar" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${Math.round(to)} %, vorher ${Math.round(from)} %`}>
      <g className="gb-out">
        {from > 0 && <rect x={2} y={2} width={x(from) - 2} height={H - 4} rx={6} fill="url(#hatch)" />}
        <InkPaths strokes={box} w={2.3} />
      </g>
      {to > from && (
        <g className="gb-gain">
          <rect x={x(from)} y={2} width={x(to) - x(from)} height={H - 4} fill="url(#hatch-green)" />
          <InkPaths strokes={mark} w={1.4} />
        </g>
      )}
    </svg>
  )
}
