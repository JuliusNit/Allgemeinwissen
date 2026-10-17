import type { Bite } from '../feed'
import { GESELLSCHAFT } from './gesellschaft'
import { KULTUR } from './kultur'
import { MENSCH } from './mensch'
import { NATUR } from './natur'

export const BITES: Bite[] = [...NATUR, ...MENSCH, ...GESELLSCHAFT, ...KULTUR]
