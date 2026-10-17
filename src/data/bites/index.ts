import type { Bite } from '../feed'
import { AHA_CHEMIE } from './aha-chemie'
import { AHA_DENKEN } from './aha-denken'
import { AHA_KOERPER } from './aha-koerper'
import { AHA_NERVEN } from './aha-nerven'
import { AHA_PHYSIK } from './aha-physik'
import { AHA_PSYCHE } from './aha-psyche'
import { AHA_GELD } from './aha-geld'
import { AHA_ERDE } from './aha-erde'
import { AHA_TECHNIK } from './aha-technik'
import { AHA_GESCHICHTE } from './aha-geschichte'
import { AHA_KULTUR } from './aha-kultur'
import { AHA_PHILOSOPHIE } from './aha-philosophie'
import { COMMON } from './common'
import { GESELLSCHAFT } from './gesellschaft'
import { KULTUR } from './kultur'
import { MENSCH } from './mensch'
import { NATUR } from './natur'

/** Zwei-Minuten-Häppchen: Phänomene zum Staunen (aha-*.ts) */
export const AHA: Bite[] = [...AHA_PHYSIK, ...AHA_KOERPER, ...AHA_NERVEN, ...AHA_CHEMIE, ...AHA_DENKEN, ...AHA_PSYCHE, ...AHA_GELD, ...AHA_ERDE, ...AHA_TECHNIK, ...AHA_GESCHICHTE, ...AHA_KULTUR, ...AHA_PHILOSOPHIE]

// Gemeinsame Zeichnungen (Formeln, Zahlen, Stichpunkte, Schlussbild) stehen jedem Häppchen zur Verfügung
export const BITES: Bite[] = [...NATUR, ...MENSCH, ...GESELLSCHAFT, ...KULTUR, ...AHA].map((b) => ({ ...b, draw: { ...COMMON, ...b.draw } }))
