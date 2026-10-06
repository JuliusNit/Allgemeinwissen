import { useMemo } from 'react'
import { streak } from '../lib/streak'
import { useStore } from '../lib/store'
import { Icon } from './Icons'

/** Tages-Streak oben rechts: Flamme schraffiert, wenn heute schon gelernt wurde */
export function Streak() {
  const s = useStore((x) => x)
  const st = useMemo(() => streak(s), [s])
  const title = st.today
    ? `${st.days} ${st.days === 1 ? 'Tag' : 'Tage'} in Folge gelernt`
    : st.days > 0
      ? `${st.days} ${st.days === 1 ? 'Tag' : 'Tage'} in Folge – heute noch lernen, sonst reißt die Serie`
      : 'Noch keine Serie – heute lernen startet sie'
  return (
    <div className={`streak${st.today ? ' on' : ''}`} title={title} aria-label={title} role="status">
      <Icon name="FLAME" size={24} hatched={st.today && 'hatch-orange'} />
      <span>{st.days}</span>
    </div>
  )
}
