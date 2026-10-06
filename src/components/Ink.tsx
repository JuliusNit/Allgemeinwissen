import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { outline, roundRect, type Stroke } from '../lib/ink'

/** Striche als gefuellte Tusche-Pfade (innerhalb eines <svg>) */
export function InkPaths({ strokes, w, className }: { strokes: Stroke[]; w: number; className?: string }) {
  const paths = useMemo(() => strokes.map((s) => ({ d: outline(s, w), closed: !!s.closed })), [strokes, w])
  return (
    <g className={className ?? 'ink'}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fillRule={p.closed ? 'evenodd' : 'nonzero'} />
      ))}
    </g>
  )
}

/** Gemeinsame Schraffur-Muster; einmal in der App eingebunden, ueberall per url(#…) nutzbar */
export function HatchDefs() {
  const pat = (id: string, color: string, gap = 5, sw = 1.3) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width={gap} height={gap} patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth={sw} />
    </pattern>
  )
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        {pat('hatch', '#000', 3.2, 0.9)}
        {pat('hatch-green', '#14892c', 5, 1.6)}
        {pat('hatch-red', '#d0021b', 5, 1.6)}
        {pat('hatch-orange', '#f27a00', 2.6, 1.3)}
      </defs>
    </svg>
  )
}

/** Tusche-Rahmen um das Elternelement (Elternelement braucht position: relative) */
export function InkBorder({ r = 14, w = 2.3 }: { r?: number; w?: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState<[number, number] | null>(null)
  useLayoutEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const measure = () => setSize((old) => (old && old[0] === el.offsetWidth && old[1] === el.offsetHeight ? old : [el.offsetWidth, el.offsetHeight]))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const d = useMemo(() => {
    if (!size || size[0] < 4 || size[1] < 4) return ''
    const pad = w / 2 + 0.6
    return outline(roundRect(pad, pad, size[0] - 2 * pad, size[1] - 2 * pad, r), w)
  }, [size, r, w])
  return (
    <svg ref={ref} className="ink-border" aria-hidden>
      <path d={d} fillRule="evenodd" />
    </svg>
  )
}

/** Karte mit Tusche-Rahmen */
export function Frame({ children, className, r, onClick }: { children: ReactNode; className?: string; r?: number; onClick?: () => void }) {
  return (
    <div className={`frame ${className ?? ''}`} onClick={onClick}>
      <InkBorder r={r} />
      {children}
    </div>
  )
}
