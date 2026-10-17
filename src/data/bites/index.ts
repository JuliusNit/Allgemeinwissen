import type { Bite } from '../feed'
import { AHA_PHYSIK } from './aha-physik'
import { GESELLSCHAFT } from './gesellschaft'
import { KULTUR } from './kultur'
import { MENSCH } from './mensch'
import { NATUR } from './natur'

/** Zwei-Minuten-Häppchen: Phänomene zum Staunen (aha-*.ts) */
export const AHA: Bite[] = [...AHA_PHYSIK]

export const BITES: Bite[] = [...NATUR, ...MENSCH, ...GESELLSCHAFT, ...KULTUR, ...AHA]
