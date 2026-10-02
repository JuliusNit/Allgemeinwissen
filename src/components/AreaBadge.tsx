import { AREAS, type AreaId } from '../data/plan'

export function AreaBadge({ area, long }: { area: AreaId; long?: boolean }) {
  const a = AREAS[area]
  return (
    <span className="badge" style={{ background: a.color }} title={a.name}>
      {long ? `${a.id} · ${a.name}` : a.id}
    </span>
  )
}
