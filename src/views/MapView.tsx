import { AREAS, DAYS, MAP_AREAS } from '../data/plan'
import { dayState, useStore } from '../lib/store'

export function MapView({ openDay }: { openDay: (n: number) => void }) {
  const s = useStore((x) => x)
  return (
    <div className="map">
      <h1>Wissenslandkarte</h1>
      <p className="muted">Naturwissenschaft · Geistes-/Kulturwissenschaft · Gesellschaft/Politik – in jedem Gebiet zuerst ein Gerüst, dann vertiefen.</p>
      <div className="map-grid">
        {MAP_AREAS.map((id) => {
          const a = AREAS[id]
          const days = DAYS.filter((d) => d.area === id && d.phase === 2)
          const done = days.filter((d) => dayState(s, d.day).status === 'fertig').length
          return (
            <section key={id} className="card map-card" style={{ borderTopColor: a.color }}>
              <div className="section-head">
                <h2><span className="badge" style={{ background: a.color }}>{id}</span> {a.name}</h2>
                <span className="muted">{done}/{days.length}</span>
              </div>
              <div className="progress"><div style={{ width: `${(done / days.length) * 100}%`, background: a.color }} /></div>
              <div className="chips">
                {days.map((d) => {
                  const st = dayState(s, d.day).status
                  return (
                    <button key={d.day} className={`chip link ${st}`} onClick={() => openDay(d.day)} title={d.title}>
                      {st === 'fertig' ? '☑' : '☐'} {d.day} · {d.title.split(/[:(]/)[0].trim()}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
