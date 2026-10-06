// Weg nach Tag 90: A breit weiter, B spezialisieren, C Hybrid (70 % Vertiefung, 30 % breit + Erhaltungsmodus).
// Empfehlung aus Selbsteinschaetzung (Regler „gefallen“) und Koennen (Anteil richtig im Verstaendnischeck):
// - 3+ Grobbereiche gern → A (Breite ist das Interesse)
// - genau 1 gern → B im besten Fach dieses Bereichs; bei schwachem Koennen mit Grundlagen-Vorlauf
//   (Interesse waechst mit Wissen – Hidi & Renninger, Vier-Phasen-Modell)
// - 2 gern → C mit Schwerpunkt im staerkeren
// - nichts gern: irgendwo stark → A, sonst C
import { AREAS, DAYS, type AreaId } from '../data/plan'
import { areaStats, LIKE_GROUPS } from './stats'
import { dayState, type State } from './store'

export type PathMode = 'breit' | 'spezial' | 'hybrid'

export interface PathChoice {
  mode: PathMode
  area?: AreaId
}

export const MODES: Record<PathMode, { letter: string; name: string; text: string }> = {
  breit: { letter: 'A', name: 'Breit weiter', text: 'Neue Themen mit vielen Anschlüssen, Querschnitt-Sessions, Mechanismus hinter den Nachrichten.' },
  spezial: { letter: 'B', name: 'Spezialisieren', text: 'Ein Fach in die Tiefe: Grundmodelle → klassische Fragen → Streitfragen → eigenes Projekt.' },
  hybrid: { letter: 'C', name: 'Hybrid', text: '70 % Vertiefung, 30 % breit, dazu Erhaltungsmodus mit Prüfung und Karten.' },
}

/** Plan durch: Tag 90 abgeschlossen oder alle Sessions fertig */
export function planFinished(s: State): boolean {
  return dayState(s, 90).status === 'fertig' || DAYS.every((d) => dayState(s, d.day).status === 'fertig')
}

/** gespeicherte Wahl lesen – alte Werte: 'breit' oder Bereichs-ID (= spezialisieren) */
export function parseChoice(c?: string): PathChoice | null {
  if (!c) return null
  if (c === 'breit') return { mode: 'breit' }
  const [m, a] = c.includes(':') ? c.split(':') : ['spezial', c]
  if (m !== 'spezial' && m !== 'hybrid') return null
  return { mode: m, area: a && a in AREAS ? (a as AreaId) : undefined }
}

export function choiceKey(c: PathChoice): string {
  return c.mode === 'breit' ? 'breit' : `${c.mode}:${c.area ?? ''}`
}

export function choiceLabel(c: PathChoice): string {
  return c.mode === 'breit' || !c.area ? MODES[c.mode].name : `${MODES[c.mode].name} · ${AREAS[c.area].name}`
}

export interface Recommendation extends PathChoice {
  why: string
}

/** Anteil richtig je Grobbereich (gewichtet nach Antworten), null ohne Daten; dazu das staerkste Fach */
function groupSkill(s: State, areas: AreaId[]) {
  const st = areas.map((a) => areaStats(s, a))
  const n = st.reduce((x, r) => x + r.answers, 0)
  const acc = n ? st.reduce((x, r) => x + (r.accuracy ?? 0) * r.answers, 0) / n : null
  const best = [...st].sort((a, b) => (b.accuracy ?? -1) - (a.accuracy ?? -1) || b.done - a.done)[0].area
  return { acc, best }
}

const p = (x: number | null) => (x == null ? 'noch ohne Daten' : `${Math.round(x * 100)} % richtig`)

export function recommend(s: State): Recommendation | null {
  const likes = s.focus.likes ?? {}
  if (!LIKE_GROUPS.some((g) => likes[g.id] != null)) return null
  const groups = LIKE_GROUPS.map((g) => ({ ...g, like: likes[g.id] ?? 2, ...groupSkill(s, g.areas) }))
  const liked = groups.filter((g) => g.like >= 3).sort((a, b) => b.like - a.like || (b.acc ?? 0) - (a.acc ?? 0))

  if (liked.length >= 3) return { mode: 'breit', why: 'Dir gefällt fast alles – Breite ist dein Interesse.' }
  if (liked.length === 1) {
    const g = liked[0]
    const weak = g.acc != null && g.acc < 0.7
    return {
      mode: 'spezial',
      area: g.best,
      why: weak
        ? `${g.name} gefällt dir, Können ${p(g.acc)} – erst Grundlagen, dann Tiefe.`
        : `${g.name} gefällt dir und liegt dir (${p(g.acc)}).`,
    }
  }
  if (liked.length === 2) {
    const [g, h] = [...liked].sort((a, b) => (b.acc ?? 0) - (a.acc ?? 0))
    return { mode: 'hybrid', area: g.best, why: `Zwei Lieblingsbereiche – Schwerpunkt ${g.name} (${p(g.acc)}), ${h.name} läuft breit mit.` }
  }
  const strong = groups.filter((g) => g.acc != null && g.acc >= 0.75).sort((a, b) => b.acc! - a.acc!)[0]
  if (strong) return { mode: 'breit', why: `Nichts zieht besonders, aber du kannst viel (${strong.name}: ${p(strong.acc)}).` }
  const top = [...groups].sort((a, b) => b.like - a.like || (b.acc ?? 0) - (a.acc ?? 0))[0]
  return { mode: 'hybrid', area: top.best, why: 'Noch kein klares Profil – Hybrid hält alles offen.' }
}
