import { arc, circle, line, type Stroke } from '../lib/ink'
import { IconGroup, type IconName } from './Icons'
import { InkPaths } from './Ink'

// Knopf auf dem Lernpfad: perfekter Kreis als Oberseite, darunter der Muenzrand mit senkrechten
// Schattenlinien. Beim Druecken sinkt die Oberseite nach unten und verdeckt den Rand.

export const COIN_R = 36
export const COIN_D = 11

const R = COIN_R
const D = COIN_D

const RIM: Stroke[] = (() => {
  const s: Stroke[] = [arc(0, D, R, 0, 180), line([R, 0], [R, D]), line([-R, 0], [-R, D])]
  for (let x = -R + 4.5; x <= R - 4.5; x += 4.5) {
    const y = Math.sqrt(R * R - x * x)
    s.push(line([x, y + 1.6], [x, y + D - 0.4], 0.42))
  }
  return s
})()

const FACE: Stroke[] = [circle(0, 0, R)]

const RING: Stroke[] = Array.from({ length: 14 }, (_, i) => arc(0, D / 2, R + 9, i * (360 / 14), i * (360 / 14) + 13, 0.7))

const BADGE: Stroke[] = [circle(0, 0, 10)]

export type CoinState = 'done' | 'current' | 'open' | 'locked'

export function Coin({ icon, state, pressed, scale = 1 }: { icon: IconName; state: CoinState; pressed: boolean; scale?: number }) {
  return (
    <g className={`coin ${state}${pressed ? ' pressed' : ''}`} transform={scale !== 1 ? `scale(${scale})` : undefined}>
      {state === 'current' && <InkPaths strokes={RING} w={2.6} />}
      <InkPaths strokes={RIM} w={2.8} />
      <g className="coin-face">
        <circle r={R} fill="#fff" />
        <InkPaths strokes={FACE} w={3.1} />
        <IconGroup name={icon} w={1.5} transform="translate(-23.5 -23.5) scale(1.958)" />
        {state === 'done' && (
          <g transform={`translate(${R * 0.74} ${-R * 0.74})`}>
            <circle r={10} fill="#fff" />
            <InkPaths strokes={BADGE} w={2.2} />
            <IconGroup name="CHECK" w={2} transform="translate(-6.6 -6.6) scale(0.55)" />
          </g>
        )}
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
