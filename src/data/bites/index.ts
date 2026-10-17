import type { Bite } from '../feed'
import { AHA_KOERPER } from './aha-koerper'
import { AHA_PHYSIK } from './aha-physik'
import { COMMON } from './common'
import { GESELLSCHAFT } from './gesellschaft'
import { KULTUR } from './kultur'
import { MENSCH } from './mensch'
import { NATUR } from './natur'

/** Zwei-Minuten-Häppchen: Phänomene zum Staunen (aha-*.ts) */
export const AHA: Bite[] = [...AHA_PHYSIK, ...AHA_KOERPER]

// Gemeinsame Zeichnungen (Formeln, Zahlen, Stichpunkte, Schlussbild) stehen jedem Häppchen zur Verfügung
export const BITES: Bite[] = [...NATUR, ...MENSCH, ...GESELLSCHAFT, ...KULTUR, ...AHA].map((b) => ({ ...b, draw: { ...COMMON, ...b.draw } }))
