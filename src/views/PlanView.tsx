import { AREAS, BLOCKS, DAYS } from '../data/plan'
import { currentDay, dayState, useStore } from '../lib/store'

export function PlanView({ openDay }: { openDay: (n: number) => void }) {
  const s = useStore((x) => x)
  const cur = currentDay(s)
  return (
    <div className="plan">
      <h1>90-Tage-Plan</h1>
      <p className="muted">1 Session = 1 Tag, ca. 45–60 min · ~3/5 Videos, Rest deine Fragen · nie zwei gleiche Bereiche nacheinander</p>
      {BLOCKS.map((b) => {
        const days = DAYS.filter((d) => d.block === b.id)
        const done = days.filter((d) => dayState(s, d.day).status === 'fertig').length
        return (
          <section key={b.id} className="card">
            <div className="section-head">
              <h2>{b.name}</h2>
              <span className="muted">{done}/{days.length}</span>
            </div>
            <div className="progress"><div style={{ width: `${(done / days.length) * 100}%` }} /></div>
            <ul className="plan-list">
              {days.map((d) => {
                const st = dayState(s, d.day).status
                return (
                  <li key={d.day}>
                    <button className={`plan-row ${st} ${d.day === cur ? 'current' : ''}`} onClick={() => openDay(d.day)}>
                      <span className="plan-day">{d.day}</span>
                      <span className="badge" style={{ background: AREAS[d.area].color }}>{d.area}</span>
                      <span className="plan-title">{d.title}</span>
                      <span className="plan-state">{st === 'fertig' ? '☑' : st === 'laeuft' ? '◐' : '☐'}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
