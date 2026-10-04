import { useId } from 'react'
import { circle } from '../lib/ink'
import { IconGroup } from './Icons'
import { InkPaths } from './Ink'

const RING = [circle(50, 50, 46)]

/** Rundes Profilbild mit Tusche-Rand; ohne Bild: Initiale, KI: Gluehbirne */
export function Avatar({ src, name, size = 40, ki }: { src?: string; name: string; size?: number; ki?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={name}>
      <defs>
        <clipPath id={`av${id}`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#fff" />
      {src ? (
        <image href={src} x="4" y="4" width="92" height="92" preserveAspectRatio="xMidYMid slice" clipPath={`url(#av${id})`} />
      ) : ki ? (
        <IconGroup name="DENK" w={1.6} transform="translate(22 22) scale(2.33)" />
      ) : (
        <text x="50" y="52" textAnchor="middle" dominantBaseline="middle" className="avatar-initial">
          {(name.trim()[0] ?? '?').toUpperCase()}
        </text>
      )}
      <InkPaths strokes={RING} w={size < 50 ? 6 : 4} />
    </svg>
  )
}
