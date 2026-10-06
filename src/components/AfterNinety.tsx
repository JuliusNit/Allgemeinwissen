import { useState } from 'react'
import { AREAS, type AreaId } from '../data/plan'
import { choiceKey, choiceLabel, MODES, parseChoice, planFinished, recommend, type PathChoice, type PathMode } from '../lib/after90'
import { LIKE_GROUPS, LIKE_LABELS, STAT_AREAS } from '../lib/stats'
import { setState, useStore } from '../lib/store'

/** Regler „gefallen“ → Empfehlung → Wahl A/B/C. Auf Home als großer Kasten nach Tag 90, im Profil unter Stärken. */
export function AfterNinety() {
  const s = useStore((x) => x)
  const likes = s.focus.likes ?? {}
  const rec = recommend(s)
  const chosen = parseChoice(s.focus.choice)
  const open = planFinished(s)
  const [mode, setMode] = useState<PathMode | null>(chosen?.mode ?? null)
  const [area, setArea] = useState<AreaId | ''>(chosen?.area ?? '')
  const pick = mode ?? rec?.mode ?? null
  const pickArea = area || (rec?.mode === pick ? rec?.area : undefined) || ''

  function like(id: string, v: number) {
    setState((x) => ({ ...x, focus: { ...x.focus, likes: { ...x.focus.likes, [id]: v } } }))
  }

  function save(c: PathChoice) {
    setState((x) => ({ ...x, focus: { ...x.focus, choice: choiceKey(c) } }))
  }

  return (
    <div className="after90">
      <p className="small"><b>Was hat dir gefallen?</b></p>
      {LIKE_GROUPS.map((g) => {
        const v = likes[g.id]
        const pct = ((v ?? 2) / 4) * 100
        return (
          <label key={g.id} className="like-row">
            <span className="small">{g.name} – {v == null ? 'offen' : LIKE_LABELS[v]}</span>
            <span className={`ink-range ${v == null ? 'open' : ''}`}>
              <span className="ink-range-track" data-pen />
              {v != null && v > 0 && <span className="ink-range-fill" data-pen style={{ width: `${pct}%` }} />}
              <span className="ink-range-knob" data-pen style={{ left: `calc(11px + (100% - 22px) * ${pct / 100})` }} />
              <input type="range" min={0} max={4} step={1} value={v ?? 2} onChange={(e) => like(g.id, Number(e.target.value))}
                onPointerUp={(e) => v == null && like(g.id, Number(e.currentTarget.value))} aria-label={g.name} />
            </span>
          </label>
        )
      })}

      {rec && (
        <div className="advice">
          <b>Empfehlung: {MODES[rec.mode].letter} – {choiceLabel(rec)}</b>
          <div className="small">{rec.why}</div>
        </div>
      )}

      <div className="mode-list" role="radiogroup" aria-label="Weg nach Tag 90">
        {(Object.keys(MODES) as PathMode[]).map((m) => (
          <button key={m} role="radio" aria-checked={pick === m} className={`level-opt ${pick === m ? 'on' : ''}`} disabled={!open}
            onClick={() => { setMode(m); if (rec?.mode === m && rec.area && !area) setArea(rec.area) }}>
            <b>{MODES[m].letter} · {MODES[m].name}{rec?.mode === m ? ' ★' : ''}</b>
            <span className="small">{MODES[m].text}</span>
          </button>
        ))}
      </div>

      {open && pick && (
        <div className="focus-choice">
          {pick !== 'breit' && (
            <select value={pickArea} onChange={(e) => setArea(e.target.value as AreaId)} aria-label="Fach">
              <option value="">Fach wählen …</option>
              {STAT_AREAS.map((a) => <option key={a} value={a}>{AREAS[a].name}</option>)}
            </select>
          )}
          <button className="btn primary" disabled={pick !== 'breit' && !pickArea}
            onClick={() => save({ mode: pick, area: pick === 'breit' ? undefined : (pickArea as AreaId) })}>
            {chosen && choiceKey(chosen) === choiceKey({ mode: pick, area: pick === 'breit' ? undefined : (pickArea as AreaId) }) ? 'Gewählt ✓' : 'Diesen Weg wählen'}
          </button>
        </div>
      )}
      {chosen && <p className="small">Dein Weg: <b>{MODES[chosen.mode].letter} – {choiceLabel(chosen)}</b></p>}
    </div>
  )
}
