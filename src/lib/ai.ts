import Anthropic from '@anthropic-ai/sdk'
import { AREAS, BLOCKS, DAYS, getDay, isBlockMix, type Day } from '../data/plan'
import { dayState, getState, videosOf, type ChatMsg } from './store'

export const MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (beste Qualität)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (günstiger, schnell)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (am günstigsten)' },
]

export const DONE_MARKER = '[[SESSION_ABGESCHLOSSEN]]'

function client(): Anthropic {
  const { apiKey } = getState().settings
  if (!apiKey) throw new Error('Kein API-Key hinterlegt – bitte unter „Einstellungen“ eintragen.')
  // Persoenliche App ohne Backend: der Key liegt nur im Browser dieses Geraets.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

/** Server-seitiger Fallback bei Ablehnungen – nur fuer Modelle, die ihn unterstuetzen */
function fallbackParams(model: string) {
  if (model === 'claude-opus-5-5' || model === 'claude-sonnet-5-5') {
    return { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }
  }
  return {}
}

function requestBase(maxTokens: number) {
  const { model, effort } = getState().settings
  return {
    model,
    max_tokens: maxTokens,
    ...(model.startsWith('claude-haiku') ? {} : { output_config: { effort } }),
    ...fallbackParams(model),
  }
}

function textOf(content: Anthropic.Beta.BetaContentBlock[]): string {
  return content.map((b) => (b.type === 'text' ? b.text : '')).join('')
}

// ---------- Kontext ----------

function clip(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + ' …' : s
}

function dayLine(d: Day): string {
  return `Tag ${d.day} [${d.area} – ${AREAS[d.area].name}]: ${d.title}`
}

function earlierSessions(d: Day): string {
  const s = getState()
  const related = isBlockMix(d) ? DAYS.filter((x) => d.links.includes(x.day)) : d.links.map(getDay)
  // dazu: alle bereits abgeschlossenen Sessions als kurze Liste fuer bereichsuebergreifende Verknuepfungen
  const done = DAYS.filter((x) => x.day < d.day && dayState(s, x.day).status === 'fertig')
  const parts: string[] = []
  if (related.length) {
    parts.push('Direkt verknüpfte frühere Sessions:')
    for (const r of related) {
      const sum = dayState(s, r.day).summary
      parts.push(`- ${dayLine(r)}${sum ? `\n  Zusammenfassung: ${clip(sum.replace(/\n+/g, ' '), isBlockMix(d) ? 1200 : 700)}` : ' (noch keine Zusammenfassung)'}`)
    }
  }
  if (done.length) {
    parts.push('\nAlle bisher abgeschlossenen Sessions (für Verknüpfungen mit anderen Bereichen):')
    parts.push(done.map((x) => `- ${dayLine(x)}`).join('\n'))
  }
  return parts.join('\n')
}

function sessionContext(d: Day): string {
  const s = getState()
  const block = BLOCKS[d.block]
  const vids = videosOf(s, d.day)
  const stars = vids.filter((v) => v.star)
  const optional = vids.filter((v) => !v.star)
  const notes = dayState(s, d.day).notes
  const lines = [
    `HEUTIGE SESSION: ${dayLine(d)}`,
    `Phase ${d.phase}, ${block.name}`,
    isBlockMix(d)
      ? `MIX-Tag: gemischte Abfrage des ganzen Blocks (${block.from}–${block.to - 1}) + Verknüpfungsfragen zwischen Bereichen. Schwerpunkte: ${d.subtopics.join(' · ')}`
      : `★-Pflichtvideos (nur deren Inhalt wird abgefragt): ${stars.map((v) => v.title).join(' · ') || '—'}`,
  ]
  if (optional.length) lines.push(`Optionale Videos (nicht abfragen): ${optional.map((v) => v.title).join(' · ')}`)
  if (d.evidence) lines.push('Evidenzcheck aktiv: bei Körper/Gesundheit/Psychologie immer „belegt vs. Hype“ einordnen (Studienlage, Evidenzstufe).')
  if (notes) lines.push(`Julius' eigene Notizen zur Session:\n${clip(notes, 2000)}`)
  lines.push('', earlierSessions(d))
  return lines.join('\n')
}

const PERSONA = `Du bist der Lernbegleiter von Julius in seinem 90-Tage-Lernplan „Allgemeinwissen (kristalline Intelligenz)“.
Ziel: breites, vernetztes Wissen, an das sich Neues schnell anhängen lässt. Gerüste: Zeitstrahl, Weltkarte, Größenordnungen, Evolution, Angebot/Nachfrage.
Antworte immer auf Deutsch, klar und knapp, ohne Floskeln. Markdown ist erlaubt (Überschriften, Listen, **fett**, Tabellen).`

// ---------- Streaming-Chat ----------

async function streamChat(system: string, messages: ChatMsg[], onText: (t: string) => void, maxTokens = 8000): Promise<string> {
  const stream = client().beta.messages.stream({
    ...requestBase(maxTokens),
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })
  let acc = ''
  for await (const ev of stream) {
    if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
      acc += ev.delta.text
      onText(acc)
    }
  }
  const final = await stream.finalMessage()
  if (final.stop_reason === 'refusal') throw new Error('Die Anfrage wurde vom Modell abgelehnt.')
  return textOf(final.content) || acc
}

export function anchorChat(day: number, onText: (t: string) => void) {
  const d = getDay(day)
  const system = `${PERSONA}

Aufgabe: „Anknüpfen“ zu Beginn der Session. Schreibe 4–6 kurze Stichpunkte:
- Wo liegt das Thema auf dem Zeitstrahl und/oder der Weltkarte (bzw. auf der Größenordnungs-Skala)?
- Welche früheren Sessions hängen dran und wie genau?
- Eine Verbindung zu einem anderen Bereich (z. B. Epoche ↔ Kunststil ↔ Philosoph).
- Eine neugierig machende Leitfrage für die Videos.
Keine Inhalte der Videos vorwegnehmen, nur einordnen.

${sessionContext(d)}`
  return streamChat(system, [{ role: 'user', content: 'Lass uns anknüpfen.' }], onText, 2000)
}

export function questionsChat(day: number, history: ChatMsg[], onText: (t: string) => void) {
  const d = getDay(day)
  const system = `${PERSONA}

Phase „Julius' Fragen“: Julius hat die Videos gesehen und stellt eigene Fragen zum Thema.
Erkläre verständlich, mit Beispielen aus Alltag/Nachrichten, und knüpfe wo sinnvoll an Zeitstrahl, Karte und frühere Sessions an.
Wenn du etwas nicht sicher weißt, sag das. ${d.evidence ? 'Ordne Gesundheits-/Psychologie-Aussagen immer nach Evidenz ein („belegt vs. Hype“).' : ''}
Frage NICHT ab – das passiert erst, wenn Julius „verstanden“ sagt.

${sessionContext(d)}`
  return streamChat(system, history, onText)
}

export function checkChat(day: number, history: ChatMsg[], onText: (t: string) => void) {
  const d = getDay(day)
  const system = `${PERSONA}

Phase „Verständnischeck“: Julius hat „verstanden“ gesagt. Führe den Check nach diesen Regeln:
- ${isBlockMix(d) ? '5' : '3–5'} Verständnisfragen, IMMER nur EINE Frage pro Nachricht, dann auf die Antwort warten.
- ${isBlockMix(d) ? 'Gemischte Abfrage des ganzen Blocks plus Verknüpfungsfragen zwischen den Bereichen.' : 'Abgefragt wird nur, was in den ★-Pflichtvideos gelehrt wurde.'}
- Keine reinen Wiedergabefragen, sondern: Teilthemen kombinieren („Was passiert mit X, wenn Y ausfällt?“), Anwendung auf Alltag/Nachrichten/Entscheidungen, Vorhersagen & Fallbeispiele („Warum…?“, „Was wäre, wenn…?“), Verknüpfung mit früheren Sessions UND anderen Bereichen.
- Nummeriere die Fragen („Frage 2/4“).
- Nach jeder Antwort: kurz bewerten (✅ richtig / 🟡 unvollständig / ❌ falsch). Bei falsch/unvollständig: kurz erklären, dann eine Nachfrage zum GLEICHEN Punkt stellen, bevor es mit der nächsten Frage weitergeht.
- Erst wenn alles sitzt: kurzes Fazit (was saß gut, was wiederholen) und schreibe dann in die letzte Zeile exakt: ${DONE_MARKER}
- Schreibe ${DONE_MARKER} niemals vorher.

${sessionContext(d)}`
  return streamChat(system, history, onText)
}

// ---------- Zusammenfassung + Karteikarten ----------

export interface SummaryResult {
  summary_markdown: string
  cards: { q: string; a: string }[]
}

export async function makeSummary(day: number): Promise<SummaryResult> {
  const d = getDay(day)
  const ds = dayState(getState(), day)
  const transcript = (label: string, msgs?: ChatMsg[]) =>
    msgs?.length ? `\n## ${label}\n` + msgs.map((m) => `${m.role === 'user' ? 'Julius' : 'Begleiter'}: ${m.content}`).join('\n\n') : ''

  const system = `${PERSONA}

Erstelle nach der abgeschlossenen Session die Zusammenfassung zum Wiederholen und Karteikarten.

summary_markdown – NUR Stichpunkte und Grafiken, kein Fließtext:
# Tag ${d.day} · ${d.area} · <kurzer Titel>
## Einordnung  (Zeitstrahl/Karte, 1–2 Stichpunkte)
## Kernpunkte  (je Teilthema 2–4 knappe Stichpunkte)
## Merkgrafik  (eine Grafik als Markdown-Tabelle ODER als einfaches Text-Diagramm in einem \`\`\`-Codeblock, z. B. Ablauf mit Pfeilen → oder Zeitleiste)
## Verknüpfungen  (zu früheren Sessions und anderen Bereichen)
## Wackelig  (was im Verständnischeck nicht sofort saß – nur falls vorhanden)
${d.evidence ? '## Evidenz  (belegt vs. Hype, je 1 Zeile)\n' : ''}
cards – 6–10 Karteikarten für Spaced Repetition. Fragen, die Verständnis prüfen (Warum/Was wäre wenn/Zusammenhang), Antworten in 1–3 Sätzen. Schwerpunkt auf den wackeligen Punkten.`

  const user = `${sessionContext(d)}
${transcript('Julius\' Fragen', ds.questions)}
${transcript('Verständnischeck', ds.check)}`

  const res = await client().beta.messages.create({
    ...requestBase(16000),
    system,
    messages: [{ role: 'user', content: user }],
    output_config: {
      ...(getState().settings.model.startsWith('claude-haiku') ? {} : { effort: getState().settings.effort }),
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['summary_markdown', 'cards'],
          properties: {
            summary_markdown: { type: 'string' },
            cards: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['q', 'a'],
                properties: { q: { type: 'string' }, a: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  })
  if (res.stop_reason === 'refusal') throw new Error('Die Anfrage wurde vom Modell abgelehnt.')
  return JSON.parse(textOf(res.content)) as SummaryResult
}

export function describeError(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'API-Key ungültig – bitte in den Einstellungen prüfen.'
  if (e instanceof Anthropic.RateLimitError) return 'Zu viele Anfragen – kurz warten und erneut versuchen.'
  if (e instanceof Anthropic.APIConnectionError) return 'Keine Verbindung zur API – Internet prüfen.'
  if (e instanceof Anthropic.APIError) return `API-Fehler ${e.status ?? ''}: ${e.message}`
  return e instanceof Error ? e.message : String(e)
}
