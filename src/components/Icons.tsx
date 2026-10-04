import type { AreaId } from '../data/plan'
import { arc, arrowHead, bez, circle, curve, ellipse, line, poly, roundRect, type Pt, type Stroke } from '../lib/ink'
import { InkPaths } from './Ink'

// Alle Icons im 24er-Raster, gezeichnet mit der Tusche-Feder aus lib/ink.

export type IconName = AreaId | 'REVIEW' | 'HOME' | 'STATS' | 'PROFILE' | 'CHAT' | 'CHECK' | 'LOCK' | 'BACK' | 'BOLT' | 'CRYSTAL' | 'MAIL'

interface IconDef {
  strokes: Stroke[]
  /** Flaeche fuer die Schraffur (aktiver Zustand) */
  fill?: string
}

function arcArrow(cx: number, cy: number, r: number, a0: number, a1: number): Stroke[] {
  const a = arc(cx, cy, r, a0, a1)
  return [a, ...arrowHead(a, 3)]
}

const helix = (phase: number) =>
  curve((t) => {
    const y = 2.5 + t * 19
    return [12 + 5 * Math.sin(t * 2 * Math.PI * 1.25 + phase), y]
  }, 60)

function gear(): Stroke[] {
  const pts: Pt[] = []
  const teeth = 8
  for (let k = 0; k < teeth; k++) {
    const a = (k / teeth) * 2 * Math.PI
    const step = (2 * Math.PI) / teeth
    const at = (r: number, da: number): Pt => [12 + Math.cos(a + da) * r, 12 + Math.sin(a + da) * r]
    pts.push(at(7, -step * 0.5), at(7, -step * 0.22), at(9.6, -step * 0.16), at(9.6, step * 0.16), at(7, step * 0.22))
  }
  return [...poly(pts, true), circle(12, 12, 3)]
}

const DEFS: Record<IconName, IconDef> = {
  // Geschichte: antiker Tempel
  GESCH: {
    strokes: [
      ...poly([[3, 8.5], [12, 3.5], [21, 8.5]], true),
      ...[6.2, 10, 14, 17.8].map((x) => line([x, 10.5], [x, 18])),
      line([4, 19.5], [20, 19.5]),
      line([2.8, 21.6], [21.2, 21.6]),
    ],
  },
  // Philosophie & Religion: Denkblase mit Fragezeichen
  PHIL: {
    strokes: [
      ellipse(13, 9.5, 9, 6.8),
      circle(5.6, 18.6, 1.6),
      circle(3, 21.4, 0.9),
      arc(13, 7.6, 2.4, 180, 400),
      bez([15.2, 8.5], [14, 9.8], [13, 10], [13, 11.8]),
      line([13, 13.9], [13, 14.1], 1.5),
    ],
  },
  // Physik & Kosmos: Atom
  PHY: {
    strokes: [ellipse(12, 12, 10, 3.8, 0), ellipse(12, 12, 10, 3.8, 60), ellipse(12, 12, 10, 3.8, 120), line([11.9, 12], [12.1, 12], 2.6)],
  },
  // Leben & Koerper: DNA
  BIO: {
    strokes: [
      helix(0),
      helix(Math.PI),
      ...[5.3, 8.6, 15.4, 18.7].map((y) => {
        const t = (y - 2.5) / 19
        const dx = 5 * Math.sin(t * 2 * Math.PI * 1.25)
        return line([12 - Math.abs(dx) + 0.8, y], [12 + Math.abs(dx) - 0.8, y], 0.8)
      }),
    ],
  },
  // Chemie: Kolben
  CHE: {
    strokes: [
      line([8.5, 3], [15.5, 3]),
      ...poly([[10, 3.2], [10, 9.5], [3.8, 20.8], [20.2, 20.8], [14, 9.5], [14, 3.2]]),
      line([6.6, 15.5], [17.4, 15.5], 0.8),
      circle(10.5, 18.2, 0.9),
      circle(13.8, 17.3, 0.6),
    ],
  },
  // Nervensystem: Neuron
  NERV: {
    strokes: [
      circle(9, 9.5, 3.3),
      line([6.8, 7.2], [3.5, 3.8]),
      line([4.6, 5.3], [2.4, 5.6]),
      line([10, 6.3], [10.6, 2.6]),
      line([5.8, 10.6], [2.4, 12]),
      bez([11.4, 11.8], [14, 15], [17, 15], [19.5, 19.5]),
      line([19.5, 19.5], [21.6, 18.4]),
      line([19.5, 19.5], [19.2, 21.8]),
    ],
  },
  // Denkwerkzeuge: Gluehbirne
  DENK: {
    strokes: [
      arc(12, 9.5, 6.5, 130, 410),
      line([7.8, 14.5], [9.2, 17]),
      line([16.2, 14.5], [14.8, 17]),
      line([9.2, 17], [14.8, 17]),
      line([9.4, 19.2], [14.6, 19.2]),
      line([10.6, 21.4], [13.4, 21.4]),
      line([12, 0.6], [12, 1.6], 0.8),
      line([4.2, 3], [5, 3.8], 0.8),
      line([19.8, 3], [19, 3.8], 0.8),
    ],
  },
  // Wirtschaft & Geld: Euro
  WIRT: {
    strokes: [arc(13.5, 12, 7.5, 45, 315), line([4, 10], [14.5, 10]), line([4, 14], [13.5, 14])],
  },
  // Literatur, Mythen & Sprache: offenes Buch
  LIT: {
    strokes: [
      bez([12, 6], [9, 4.2], [6, 4], [2.8, 4.6]),
      line([2.8, 4.6], [2.8, 18.6]),
      bez([2.8, 18.6], [6, 18], [9, 18.3], [12, 20]),
      bez([12, 6], [15, 4.2], [18, 4], [21.2, 4.6]),
      line([21.2, 4.6], [21.2, 18.6]),
      bez([21.2, 18.6], [18, 18], [15, 18.3], [12, 20]),
      line([12, 6], [12, 20]),
      line([5, 8.4], [9.8, 9], 0.8),
      line([5, 11.4], [9.8, 12], 0.8),
      line([14.2, 9], [19, 8.4], 0.8),
      line([14.2, 12], [19, 11.4], 0.8),
    ],
  },
  // Kunst, Architektur, Musik, Film: Bild mit Bergen
  KUL: {
    strokes: [roundRect(2.6, 4.4, 18.8, 15.2, 1.2), ...poly([[4.8, 17.4], [10, 10.8], [13.2, 14.4], [15.6, 12], [19.4, 17.4]]), circle(16.6, 8.4, 1.6)],
  },
  // Staat, Recht & Weltpolitik: Waage
  POL: {
    strokes: [
      line([12, 4.6], [12, 20.6]),
      line([8, 21.2], [16, 21.2]),
      line([3.6, 6.8], [20.4, 6.8]),
      circle(12, 3.4, 0.9),
      line([5, 7], [2.4, 14]),
      line([5, 7], [7.6, 14]),
      arc(5, 14, 3, 0, 180),
      line([1.8, 14], [8.2, 14]),
      line([19, 7], [16.4, 14]),
      line([19, 7], [21.6, 14]),
      arc(19, 14, 3, 0, 180),
      line([15.8, 14], [22.2, 14]),
    ],
  },
  // Psychologie: Psi
  PSY: {
    strokes: [line([12, 2.6], [12, 21.4]), arc(12, 8.6, 6.2, 0, 180), line([5.8, 3.2], [5.8, 8.6]), line([18.2, 3.2], [18.2, 8.6]), line([8.8, 21.4], [15.2, 21.4])],
  },
  // Erde & Geografie: Globus
  GEO: {
    strokes: [
      circle(12, 12, 9.4),
      ellipse(12, 12, 4.2, 9.4),
      line([2.6, 12], [21.4, 12], 0.8),
      line([4.3, 7.2], [19.7, 7.2], 0.8),
      line([4.3, 16.8], [19.7, 16.8], 0.8),
    ],
  },
  // Technik: Zahnrad
  TECH: { strokes: gear() },
  // Gemischte Block-Abfrage: verschraenkte Pfeile
  MIX: {
    strokes: (() => {
      const a = bez([2.6, 7], [10, 7], [13, 17], [21, 17])
      const b = bez([2.6, 17], [10, 17], [13, 7], [21, 7])
      return [a, b, ...arrowHead(a, 3), ...arrowHead(b, 3)]
    })(),
  },
  // Wiederholung: Kreispfeile
  REVIEW: { strokes: [...arcArrow(12, 12, 8, 200, 330), ...arcArrow(12, 12, 8, 20, 150)] },

  // Navigation
  HOME: {
    strokes: [
      ...poly([[2.6, 11.4], [12, 3], [21.4, 11.4]]),
      line([5, 9.6], [5, 21]),
      line([19, 9.6], [19, 21]),
      line([5, 21], [19, 21]),
      line([10, 21], [10, 16.4]),
      arc(12, 16.4, 2, 180, 360),
      line([14, 16.4], [14, 21]),
    ],
    fill: 'M5 9.8L12 3.6L19 9.8V21H14V16.4A2 2 0 0 0 10 16.4V21H5Z',
  },
  STATS: {
    strokes: [circle(12, 12, 9.4), line([12, 12], [12, 2.8]), line([12, 12], [20.1, 16.6])],
    fill: 'M12 12L12 2.6A9.4 9.4 0 0 1 20.15 16.7Z',
  },
  PROFILE: {
    strokes: [circle(12, 7.6, 4.4), arc(12, 22, 8.4, 180, 360), line([3.6, 22], [20.4, 22])],
    fill: 'M7.6 7.6A4.4 4.4 0 1 0 16.4 7.6A4.4 4.4 0 1 0 7.6 7.6ZM3.6 22A8.4 8.4 0 0 1 20.4 22Z',
  },
  CHAT: {
    strokes: [roundRect(2.6, 3.4, 18.8, 12.6, 3.4), ...poly([[7, 16], [6, 20.8], [11.4, 16]]), line([6.8, 8], [17.2, 8], 0.8), line([6.8, 11.4], [14, 11.4], 0.8)],
    fill: 'M6 3.4H18A3.4 3.4 0 0 1 21.4 6.8V12.6A3.4 3.4 0 0 1 18 16H11.4L6 20.8L7 16H6A3.4 3.4 0 0 1 2.6 12.6V6.8A3.4 3.4 0 0 1 6 3.4Z',
  },
  CHECK: { strokes: poly([[4.6, 12.6], [9.8, 17.6], [19.6, 6]]) },
  LOCK: { strokes: [roundRect(5, 11, 14, 10, 2), arc(12, 11, 4.4, 180, 360), line([12, 15], [12, 17.4], 1.2)] },
  BACK: { strokes: [line([20, 12], [4.4, 12]), ...poly([[10.4, 5.6], [4, 12], [10.4, 18.4]])] },

  // Einfuehrung: fluide Intelligenz (Blitz) und kristalline Intelligenz (Kristall)
  BOLT: {
    strokes: poly([[14, 2.4], [5, 13.6], [11.4, 13.6], [9.8, 21.6], [19, 10], [12.6, 10]], true),
    fill: 'M14 2.4L5 13.6H11.4L9.8 21.6L19 10H12.6Z',
  },
  CRYSTAL: {
    strokes: [
      ...poly([[12, 2.4], [18, 7.6], [17, 17.4], [12, 21.6], [7, 17.4], [6, 7.6]], true),
      ...poly([[6, 7.6], [12, 10.4], [18, 7.6]]),
      line([12, 10.4], [12, 21.6], 0.9),
      line([12, 2.4], [12, 10.4], 0.7),
    ],
    fill: 'M12 2.4L18 7.6L17 17.4L12 21.6L7 17.4L6 7.6Z',
  },
  MAIL: { strokes: [roundRect(2.6, 5, 18.8, 14, 2.4), ...poly([[3.4, 6.2], [12, 13], [20.6, 6.2]])] },
}

export function Icon({ name, size = 28, w = 1.55, hatched = false, title }: { name: IconName; size?: number; w?: number; hatched?: boolean; title?: string }) {
  const def = DEFS[name]
  return (
    <svg className="icon" width={size} height={size} viewBox="-1 -1 26 26" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {hatched && def.fill && <path d={def.fill} fill="url(#hatch)" />}
      <InkPaths strokes={def.strokes} w={w} />
    </svg>
  )
}

/** Icon-Inhalt ohne eigenes <svg>, zum Einbetten (24er-Raster) */
export function IconGroup({ name, w = 1.55, transform }: { name: IconName; w?: number; transform?: string }) {
  return (
    <g transform={transform}>
      <InkPaths strokes={DEFS[name].strokes} w={w} />
    </g>
  )
}
