import { useEffect, useMemo, useState } from 'react'
import { line, roundRect } from '../lib/ink'
import { weekRecap, type Recap } from '../lib/recap'
import { getState } from '../lib/store'
import { Icon } from './Icons'
import { Frame, InkPaths } from './Ink'
import { Streak } from './Streak'

const fmt = (d: string) => {
  const [, m, t] = d.split('-').map(Number)
  return `${t}.${m}.`
}

const pct = (x: number) => `${Math.round(x)} %`

/** Wochenrueckblick: Kasten ueber Home, mehrere Seiten, X oder letzte Seite schliesst */
export function WeekRecap({ onClose }: { onClose: () => void }) {
  const r = useMemo(() => weekRecap(getState()), [])
  const [i, setI] = useState(0)
  const pages = [<Learned key="l" r={r} />, <Progress key="p" r={r} />, <Ahead key="a" r={r} />]
  const last = i === pages.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="recap-back" role="dialog" aria-modal="true" aria-label="Wochenrückblick">
      <Frame className="card recap">
        <div className="recap-top">
          <button className="recap-x" onClick={onClose} aria-label="Schließen">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <InkPaths strokes={X} w={2.3} />
            </svg>
          </button>
          <span className="muted small">Woche {fmt(r.from)}–{fmt(r.to)}</span>
          <Streak inline />
        </div>
        <div className="recap-page" key={i}>{pages[i]}</div>
        <div className="onb-dots" role="tablist" aria-label="Seiten">
          {pages.map((_, k) => (
            <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Seite ${k + 1}`} aria-selected={k === i} role="tab" />
          ))}
        </div>
        <div className="onb-actions row">
          {i > 0 && <button className="btn" onClick={() => setI(i - 1)}>Zurück</button>}
          <button className="btn primary right" onClick={() => (last ? onClose() : setI(i + 1))}>{last ? 'Los geht’s' : 'Weiter'}</button>
        </div>
      </Frame>
    </div>
  )
}

const X = [line([6, 6], [20, 20]), line([20, 6.5], [6.5, 20])]

function Learned({ r }: { r: Recap }) {
  return (
    <>
      <h1>Deine Woche</h1>
      {r.learned.length ? (
        <ul className="recap-learned">
          {r.learned.map((a) => (
            <li key={a.area}>
              <Icon name={a.area} size={26} />
              <div>
                <b>{a.name}</b>
                <div className="small">{a.titles.join(' · ')}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine neue Session abgeschlossen.</p>
      )}
      <div className="recap-nums">
        <Num v={`${r.sessions}`} l={r.sessions === 1 ? 'Session' : 'Sessions'} />
        <Num v={`${r.activeDays}/7`} l="Lerntage" />
        <Num v={`${r.cards}`} l={r.cards === 1 ? 'Karte' : 'Karten'} />
      </div>
    </>
  )
}

function Progress({ r }: { r: Recap }) {
  const diff = r.indexNow - r.indexBefore
  return (
    <>
      <h1>Fortschritt</h1>
      <div className="recap-index">
        <span className="recap-big">{pct(r.indexNow)}</span>
        <span className={diff >= 0.5 ? 'good' : 'muted'}>{diff >= 0.5 ? `+${Math.round(diff)} Punkte` : '± 0'}</span>
      </div>
      <p className="small recap-index-l">Wissensindex · Anteil des Plans, der sitzt</p>
      <IndexBar before={r.indexBefore} now={r.indexNow} />
      <div className="recap-nums">
        <Num v={`${r.planDone}/90`} l="Sessions" />
        <Num v={r.accuracy == null ? '–' : pct(r.accuracy * 100)} l="richtig" />
        <Num v={`${r.answers}`} l={r.answers === 1 ? 'Antwort' : 'Antworten'} />
      </div>
    </>
  )
}

function Ahead({ r }: { r: Recap }) {
  return (
    <>
      <h1>Diese Woche</h1>
      {r.next.length ? (
        <ol className="recap-next">
          {r.next.map((t, k) => (
            <li key={k}>{t}</li>
          ))}
        </ol>
      ) : (
        <p>Alle 90 Sessions geschafft.</p>
      )}
    </>
  )
}

function Num({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <b>{v}</b>
      <span className="muted small">{l}</span>
    </div>
  )
}

/** Balken 0–100 %: Stand der Vorwoche schraffiert, Zuwachs gruen schraffiert */
function IndexBar({ before, now }: { before: number; now: number }) {
  const W = 300
  const H = 22
  const x = (p: number) => 2 + ((W - 4) * Math.min(100, Math.max(0, p))) / 100
  const box = useMemo(() => [roundRect(1.5, 1.5, W - 3, H - 3, 7)], [])
  const mark = useMemo(() => (now > before ? [line([x(before), 3], [x(before), H - 3])] : []), [before, now])
  return (
    <svg className="recap-bar" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Wissensindex ${pct(now)}, vorher ${pct(before)}`}>
      <rect x={2} y={2} width={x(before) - 2} height={H - 4} rx={6} fill="url(#hatch)" />
      {now > before && <rect x={x(before)} y={2} width={x(now) - x(before)} height={H - 4} fill="url(#hatch-green)" />}
      <InkPaths strokes={mark} w={1.4} />
      <InkPaths strokes={box} w={2.3} />
    </svg>
  )
}
