import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'
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
export function InkBorder({ r = 14, w = 3.3 }: { r?: number; w?: number }) {
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
    const box = roundRect(pad, pad, size[0] - 2 * pad, size[1] - 2 * pad, r, undefined, 1.4)
    // gleicher Pinsel-Druckwechsel wie beim Tusche-Stift (lib/pen.ts)
    box.p = 0.16
    box.seed = (size[0] * 7 + size[1] * 13) % 17
    return outline(box, w)
  }, [size, r, w])
  return (
    <svg ref={ref} className="ink-border" aria-hidden>
      <path d={d} fillRule="evenodd" />
    </svg>
  )
}

/** Scrollbereich mit Tusche-Scroller: Schiene als Umriss, Griff schraffiert mit kraeftigerem Rand; ziehbar, Klick auf Schiene springt */
export function InkScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [m, setM] = useState({ top: 0, view: 0, full: 0 })
  const drag = useRef<{ y: number; top: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () =>
      setM((o) => (o.top === el.scrollTop && o.view === el.clientHeight && o.full === el.scrollHeight ? o : { top: el.scrollTop, view: el.clientHeight, full: el.scrollHeight }))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [])

  const W = 14
  const pad = 3.5
  const avail = m.view - 2 * pad
  const range = m.full - m.view
  const th = range > 0 ? Math.max(22, (avail * m.view) / m.full) : avail
  const ty = pad + (range > 0 ? ((avail - th) * m.top) / range : 0)
  const rail = useMemo(() => (m.view > 8 ? roundRect(1.2, 1.2, W - 2.4, m.view - 2.4, (W - 2.4) / 2) : null), [m.view])
  const thumb = useMemo(() => (avail > 0 ? roundRect(pad, ty, W - 2 * pad, th, (W - 2 * pad) / 2) : null), [ty, th, avail])

  const down = (e: PointerEvent<SVGSVGElement>) => {
    const el = ref.current
    if (!el || range <= 0) return
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top
    if (y < ty || y > ty + th) el.scrollTop = ((y - pad - th / 2) / (avail - th)) * range
    drag.current = { y: e.clientY, top: el.scrollTop }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const el = ref.current
    if (!el || !drag.current) return
    el.scrollTop = drag.current.top + ((e.clientY - drag.current.y) * range) / (avail - th)
  }
  const up = () => (drag.current = null)

  return (
    <div className="ink-scroll">
      <div ref={ref} className={`ink-scroll-view ${className ?? ''}`}>
        {children}
      </div>
      {range > 0 && rail && thumb && (
        <svg className="ink-rail" height={m.view} aria-hidden onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <InkPaths strokes={[rail]} w={1.5} />
          <rect x={pad} y={ty} width={W - 2 * pad} height={th} rx={(W - 2 * pad) / 2} fill="url(#hatch)" />
          <InkPaths strokes={[thumb]} w={2.2} />
        </svg>
      )}
    </div>
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
