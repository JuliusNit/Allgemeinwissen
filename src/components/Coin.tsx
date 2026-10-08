import { arc, ellipse, line, type Stroke } from '../lib/ink'
import { IconGroup, type IconName } from './Icons'
import { InkPaths } from './Ink'

// Knopf auf dem Lernpfad: leicht gestauchte Ellipse als Oberseite (Blick minimal schraeg von oben), darunter der Muenzrand mit senkrechten
// Schattenlinien. Beim Druecken sinkt die Oberseite nach unten und verdeckt den Rand.

export const COIN_R = 36
export const COIN_D = 11
/** Stauchung der Oberseite: 1 = Draufsicht, kleiner = flacherer Blickwinkel */
export const COIN_TILT = 0.9
/** halbe Hoehe der Oberseite */
export const COIN_RY = COIN_R * COIN_TILT

const R = COIN_R
const RY = COIN_RY
const D = COIN_D

const RIM: Stroke[] = (() => {
  const s: Stroke[] = [arc(0, D, R, 0, 180, undefined, RY), line([R, 0], [R, D]), line([-R, 0], [-R, D])]
  for (let x = -R + 4.5; x <= R - 4.5; x += 4.5) {
    const y = COIN_TILT * Math.sqrt(R * R - x * x)
    s.push(line([x, y + 1.6], [x, y + D - 0.4], 0.42))
  }
  return s
})()

const FACE: Stroke[] = [ellipse(0, 0, R, RY)]

// Abgeschlossen: leichte Schraffur (45°) auf der Oberseite, mit Abstand zum Rand
const HATCH: Stroke[] = (() => {
  const r = R - 5
  const s: Stroke[] = []
  for (let c = -r * Math.SQRT2 + 5; c < r * Math.SQRT2 - 4; c += 6.5) {
    // Gerade x - y' = c im ungestauchten Kreis, danach y auf die Neigung stauchen
    const q = Math.sqrt(2 * r * r - c * c) / 2
    const x0 = c / 2 - q
    const x1 = c / 2 + q
    s.push(line([x0, (x0 - c) * COIN_TILT], [x1, (x1 - c) * COIN_TILT], 0.38))
  }
  return s
})()

// Abgeschlossene Abruf-Station (Wiederholung Tag x–y): Lorbeerkranz um die untere Haelfte, zwei Zweige von unten nach oben aussen
const LAUREL: Stroke[] = (() => {
  const rx = R + 8
  const ry = RY + 8
  const cy = D * 0.6
  const s: Stroke[] = []
  for (const side of [-1, 1]) {
    const a0 = side < 0 ? 100 : 80
    const a1 = side < 0 ? 222 : -42
    s.push(arc(0, cy, rx, a0, a1, 0.7, ry))
    const n = 7
    for (let i = 1; i <= n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / (n + 0.4)) * Math.PI) / 180
      const px = Math.cos(a) * rx
      const py = cy + Math.sin(a) * ry
      // Blattrichtung = Tangente Richtung Zweigspitze, abwechselnd nach aussen/innen gekippt
      const tx = -Math.sin(a) * rx * Math.sign(a1 - a0)
      const ty = Math.cos(a) * ry * Math.sign(a1 - a0)
      const dir = (Math.atan2(ty, tx) * 180) / Math.PI
      for (const k of [-1, 1]) {
        const rot = dir + k * 38 * -side
        const rr = (rot * Math.PI) / 180
        s.push(ellipse(px + Math.cos(rr) * 3.6, py + Math.sin(rr) * 3.6, 3.8, 1.5, rot, 0.6))
      }
    }
  }
  return s
})()

// Ring liegt auf dem Boden (Hoehe der Muenzunterkante) und ist genauso geneigt wie die Muenze:
// vorne sichtbar, hinten von der Muenze verdeckt
const RING: Stroke[] = Array.from({ length: 14 }, (_, i) => arc(0, D, R + 9, i * (360 / 14), i * (360 / 14) + 13, 0.7, (R + 9) * COIN_TILT))

/** Umriss des Muenzkoerpers (Seite + untere Haelfte), weiss gefuellt – verdeckt den Ring dahinter */
const BODY = `M${-R} 0V${D}A${R} ${RY} 0 0 0 ${R} ${D}V0Z`

export type CoinState = 'done' | 'current' | 'open' | 'locked'

export function Coin({ icon, state, pressed, scale = 1, laurel }: { icon: IconName; state: CoinState; pressed: boolean; scale?: number; laurel?: boolean }) {
  return (
    <g className={`coin ${state}${pressed ? ' pressed' : ''}`} transform={scale !== 1 ? `scale(${scale})` : undefined}>
      {state === 'current' && <InkPaths strokes={RING} w={2.6} />}
      {laurel && <InkPaths strokes={LAUREL} w={2.4} />}
      <path d={BODY} fill="#fff" />
      <ellipse rx={R} ry={RY} fill="#fff" />
      <InkPaths strokes={RIM} w={2.8} />
      <g className="coin-face">
        <ellipse rx={R} ry={RY} fill="#fff" />
        {state === 'done' && <InkPaths strokes={HATCH} w={2.4} />}
        <InkPaths strokes={FACE} w={3.1} />
        <IconGroup name={icon} w={1.5} transform={`translate(-23.5 ${-23.5 * COIN_TILT}) scale(1.958 ${1.958 * COIN_TILT})`} />
      </g>
    </g>
  )
}

/** Einzelner Knopf als eigenstaendiges SVG (z. B. im Kopf einer Session) */
export function CoinBadge({ icon, size = 64 }: { icon: IconName; size?: number }) {
  const pad = 6
  return (
    <svg width={size} height={size * ((2 * R + D + 2 * pad) / (2 * R + 2 * pad))} viewBox={`${-R - pad} ${-R - pad} ${2 * R + 2 * pad} ${2 * R + D + 2 * pad}`} aria-hidden>
      <Coin icon={icon} state="open" pressed={false} />
    </svg>
  )
}
