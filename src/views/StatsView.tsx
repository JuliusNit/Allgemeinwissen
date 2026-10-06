import { useEffect, useMemo, useState } from 'react'
import { AREAS, DAYS, getDay, type AreaId } from '../data/plan'
import { circle, line, poly, roundRect, sectorPath, type Pt, type Stroke } from '../lib/ink'
import { areaStats, parseCheck, sessionScore, STAT_AREAS } from '../lib/stats'
import { dayState, useStore } from '../lib/store'
import { Icon } from '../components/Icons'
import { Frame, InkPaths, InkScroll } from '../components/Ink'
import { Markdown } from '../components/Markdown'

/** Kreisdiagramm: gut (gruen schraffiert), schlecht (rot schraffiert), Rest weiss; faechert in 1/3 s auf */
export function Pie({ good, bad, size = 140 }: { good: number; bad: number; size?: number }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 333)
      setP(1 - Math.pow(1 - k, 3))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [good, bad])
  const g = good * 360 * p
  const b = bad * 360 * p
  const strokes = useMemo(() => {
    const at = (deg: number): Pt => [50 + Math.sin((deg * Math.PI) / 180) * 44, 50 - Math.cos((deg * Math.PI) / 180) * 44]
    const s: Stroke[] = [circle(50, 50, 44)]
    if (g + b > 0.5 && g + b < 359.5) {
      s.push(line([50, 50], at(0), 0.8))
      s.push(line([50, 50], at(g + b), 0.8))
    }
    if (g > 0.5 && b > 0.5) s.push(line([50, 50], at(g), 0.6))
    return s
  }, [g, b])
  return (
    <svg className="pie" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${Math.round(good * 100)} % gut, ${Math.round(bad * 100)} % schwach`}>
      <circle cx="50" cy="50" r="44" fill="#fff" />
      <path d={sectorPath(50, 50, 44, 0, g)} fill="url(#hatch-green)" />
      <path d={sectorPath(50, 50, 44, g, g + b)} fill="url(#hatch-red)" />
      <InkPaths strokes={strokes} w={2.4} />
    </svg>
  )
}

const BOX: Stroke[] = [roundRect(2, 2, 16, 16, 2.5)]
const TICK: Stroke[] = poly([[5, 10.5], [8.6, 14], [15.5, 5.5]])

export function InkCheck({ checked }: { checked: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden className="ink-check">
      <InkPaths strokes={BOX} w={1.6} />
      {checked && <InkPaths strokes={TICK} w={2} />}
    </svg>
  )
}

const pct = (x: number) => `${Math.round(x * 100)} %`

export function StatsView({ area, day, go }: { area?: AreaId; day?: number; go: (hash: string) => void }) {
  if (area && day) return <TopicDetail area={area} day={day} go={go} />
  return (
    <div className="stats">
      <h1>Statistik</h1>
      <div className="area-list">
        {STAT_AREAS.map((a, i) => (
          <AreaBox key={a} area={a} left={i % 2 === 0} open={area === a} go={go} />
        ))}
      </div>
    </div>
  )
}

function AreaBox({ area, left, open, go }: { area: AreaId; left: boolean; open: boolean; go: (hash: string) => void }) {
  const s = useStore((x) => x)
  const st = areaStats(s, area)
  const days = DAYS.filter((d) => d.area === area)
  const toggle = () => go(open ? '/statistik' : `/statistik/${area}`)
  return (
    <Frame className={`area-box ${open ? 'open' : left ? 'left' : 'right'}`}>
      <button className="area-head" onClick={toggle} aria-expanded={open}>
        <Icon name={area} size={26} />
        <span className="area-name">{AREAS[area].name}</span>
        <span className="area-pct">{pct(st.done / st.total)}</span>
      </button>
      {open && (
        <div className="area-body">
          <Pie good={st.good} bad={st.bad} />
          <InkScroll className="topic-scroll">
            <ul className="topic-list">
              {days.map((d) => {
                const ds = dayState(s, d.day)
                const sc = sessionScore(s, d.day)
                return (
                  <li key={d.day}>
                    <button onClick={() => go(`/statistik/${area}/${d.day}`)}>
                      <InkCheck checked={ds.status === 'fertig'} />
                      <span>
                        <span className="muted small">Tag {d.day}</span> {d.title.split(/[:(]/)[0].trim()}
                      </span>
                      {sc != null && <span className={`score ${sc >= 0.7 ? 'good' : 'bad'}`}>{pct(sc)}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </InkScroll>
        </div>
      )}
      {open && (
        <p className="muted small area-facts">
          {st.answers} Antworten · richtig {st.accuracy == null ? '–' : pct(st.accuracy)} · Ø {st.avgSec == null ? '–' : `${Math.round(st.avgSec)} s`} · Präzision {st.precision == null ? '–' : `${st.precision.toFixed(1)}/5`}
        </p>
      )}
    </Frame>
  )
}

function TopicDetail({ area, day, go }: { area: AreaId; day: number; go: (hash: string) => void }) {
  const d = getDay(day)
  const ds = useStore((s) => dayState(s, day))
  const qa = parseCheck(ds.check)
  return (
    <div className="stats">
      <div className="page-head">
        <button className="icon-btn" onClick={() => go(`/statistik/${area}`)} aria-label="Zurück zur Übersicht"><Icon name="BACK" size={26} /></button>
        <Icon name={area} size={34} />
        <div>
          <p className="muted small">{AREAS[area].name} · Tag {d.day}</p>
          <h1>{d.title}</h1>
        </div>
      </div>

      <Frame className="card">
        <h2>Verständnischeck</h2>
        {qa.length === 0 ? (
          <p className="muted">Noch keine beantworteten Fragen.</p>
        ) : (
          <ol className="qa-list">
            {qa.map((q, i) => (
              <li key={i} className={q.verdict ?? ''}>
                <div className="qa-top">
                  <span className={`verdict ${q.verdict ?? ''}`}>{q.verdict === 'richtig' ? '✓ richtig' : q.verdict === 'teilweise' ? '~ teilweise' : q.verdict === 'falsch' ? '✗ falsch' : '–'}</span>
                  <span className="muted small">
                    {q.ms ? `${Math.round(q.ms / 1000)} s` : ''}
                    {q.precision ? ` · Präzision ${q.precision}/5` : ''}
                  </span>
                </div>
                <Markdown text={q.question} />
                <p className="qa-answer"><b>Deine Antwort:</b> {q.answer}</p>
                {q.feedback && (
                  <details>
                    <summary>Rückmeldung</summary>
                    <Markdown text={q.feedback} />
                  </details>
                )}
              </li>
            ))}
          </ol>
        )}
      </Frame>

      <Frame className="card">
        <h2>Lernzettel</h2>
        {ds.summary ? <Markdown text={ds.summary} /> : <p className="muted">Der Lernzettel entsteht, wenn die Session abgeschlossen wird.</p>}
      </Frame>
      <button className="btn" onClick={() => go(`/tag/${day}`)}>Zur Session</button>
    </div>
  )
}
