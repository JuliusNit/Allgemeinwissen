import { AREAS, BLOCKS, DAYS, getDay, isBlockMix, type AreaId, type Day } from '../data/plan'
import { blockName, isRepeat, levelLabel, SCHOOL_GRADE } from '../data/school'
import { DONE_MARKER, statsTable } from './stats'
import { dayState, getState, videoNotesText, videosOf, type ChatMsg } from './store'

export { DONE_MARKER }

// OpenAI-kompatibler Chat-Completions-Endpunkt (Standard: Qwen ueber vLLM), direkt aus dem Browser.
// Persoenliche App ohne Backend: der Key liegt nur im Browser dieses Geraets.

class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

type Msg = { role: 'system' | 'user' | 'assistant'; content: string }

function body(messages: Msg[], maxTokens: number, extra: Record<string, unknown> = {}) {
  const { model, thinking } = getState().settings
  return {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: 0.6,
    // Qwen-Denkmodus ueber das Chat-Template steuern (vLLM)
    ...(/qwen/i.test(model) ? { chat_template_kwargs: { enable_thinking: thinking } } : {}),
    ...extra,
  }
}

async function post(payload: unknown): Promise<Response> {
  const { apiUrl, apiKey } = getState().settings
  if (!apiKey) throw new ApiError('Kein API-Key hinterlegt – bitte unter „Profil → KI“ eintragen.')
  let res: Response
  try {
    res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ApiError('Keine Verbindung zur KI – Internet bzw. API-Adresse prüfen.')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    if (res.status === 401 || res.status === 403) throw new ApiError('API-Key ungültig – bitte im Profil prüfen.', res.status)
    if (res.status === 429) throw new ApiError('Zu viele Anfragen – kurz warten und erneut versuchen.', res.status)
    throw new ApiError(`API-Fehler ${res.status}: ${text.slice(0, 200)}`, res.status)
  }
  return res
}

/** Denk-Abschnitte entfernen, falls der Server sie im Text mitliefert */
function clean(t: string): string {
  return t.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trimStart()
}

async function streamChat(system: string, messages: ChatMsg[], onText: (t: string) => void, maxTokens = 4000): Promise<string> {
  const res = await post(
    body([{ role: 'system', content: system }, ...messages.map((m) => ({ role: m.role, content: m.content }))], maxTokens, { stream: true }),
  )
  if (!res.body) throw new ApiError('Leere Antwort vom Server.')
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  let acc = ''
  let finish = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    let i: number
    while ((i = buf.indexOf('\n')) >= 0) {
      const ln = buf.slice(0, i).trim()
      buf = buf.slice(i + 1)
      if (!ln.startsWith('data:')) continue
      const data = ln.slice(5).trim()
      if (data === '[DONE]') continue
      try {
        const j = JSON.parse(data)
        const ch = j.choices?.[0]
        if (ch?.delta?.content) {
          acc += ch.delta.content
          onText(clean(acc))
        }
        if (ch?.finish_reason) finish = ch.finish_reason
      } catch {
        // unvollstaendige Zeile – ignorieren
      }
    }
  }
  const out = clean(acc).trim()
  if (!out) throw new ApiError(finish === 'length' ? 'Antwort zu lang abgebrochen – Denkmodus ausschalten oder erneut senden.' : 'Leere Antwort – bitte erneut senden.')
  return out
}

async function complete(system: string, user: string, maxTokens: number, extra: Record<string, unknown> = {}): Promise<string> {
  const res = await post(
    body(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      maxTokens,
      extra,
    ),
  )
  const j = await res.json()
  return clean(j.choices?.[0]?.message?.content ?? '').trim()
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
    `Phase ${d.phase}, ${blockName(block, s.level)}`,
    isBlockMix(d)
      ? `MIX-Tag: gemischte Abfrage des ganzen Blocks (${block.from}–${block.to - 1}) + Verknüpfungsfragen zwischen Bereichen. Schwerpunkte: ${d.subtopics.join(' · ')}`
      : `★-Pflichtvideos (nur deren Inhalt wird abgefragt): ${stars.map((v) => v.title).join(' · ') || '—'}`,
  ]
  if (isRepeat(s.level, d.day)) {
    lines.push(`WIEDERHOLUNG: Für ${nm()} ist das Schulstoff (typisch Klasse ${SCHOOL_GRADE[d.day]}), also bekannt. Vorwissen aktivieren, Lücken aufdecken und vor allem mit Neuem und anderen Bereichen verknüpfen. Videos sind nur zum Auffrischen; abgefragt werden die Teilthemen insgesamt.`)
  }
  if (optional.length) lines.push(`Optionale Videos (nicht abfragen): ${optional.map((v) => v.title).join(' · ')}`)
  if (d.evidence) lines.push('Evidenzcheck aktiv: bei Körper/Gesundheit/Psychologie immer „belegt vs. Hype“ einordnen (Studienlage, Evidenzstufe).')
  if (notes) lines.push(`Eigene Notizen von ${nm()} zur Session:\n${clip(notes, 2000)}`)
  const vnotes = videoNotesText(s, d.day)
  if (vnotes) lines.push(`Notizen von ${nm()} während der Videos ([Minute:Sekunde]):\n${clip(vnotes, 3000)}`)
  lines.push('', earlierSessions(d))
  return lines.join('\n')
}

/** Name der lernenden Person (aus dem Profil) */
function nm(): string {
  return getState().profile.name.trim() || 'die lernende Person'
}

function levelLine(): string {
  const l = getState().level
  if (!l) return ''
  if (l.kind === 'schule') return `Wissensstand: ${levelLabel(l)} (Gymnasium). Setze nur Schulwissen bis Klasse ${l.grade - 1} voraus, erkläre Fachbegriffe darüber hinaus und baue Neues auf dem Bekannten auf.`
  return `Wissensstand: ${levelLabel(l)}. Schulwissen bis zum Abitur gilt als bekannt – Schulthemen sind Wiederholung, darauf aufbauen.`
}

// Funktion statt Konstante: Name und Wissensstand koennen sich aendern
const persona = () => `Du bist der Lernbegleiter von ${nm()} im 90-Tage-Lernplan „Allgemeinwissen (kristalline Intelligenz)“.
${levelLine()}
Ziel: breites, vernetztes Wissen, an das sich Neues schnell anhängen lässt. Gerüste: Zeitstrahl, Weltkarte, Größenordnungen, Evolution, Angebot/Nachfrage.
Antworte immer auf Deutsch, klar und knapp, ohne Floskeln. Markdown ist erlaubt (Überschriften, Listen, **fett**, Tabellen).`

// ---------- Session ----------

export function anchorChat(day: number, onText: (t: string) => void) {
  const d = getDay(day)
  const system = `${persona()}

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
  const system = `${persona()}

Phase „Eigene Fragen“: ${nm()} hat die Videos gesehen und stellt eigene Fragen zum Thema.
Erkläre verständlich, mit Beispielen aus Alltag/Nachrichten, und knüpfe wo sinnvoll an Zeitstrahl, Karte und frühere Sessions an.
Wenn du etwas nicht sicher weißt, sag das. ${d.evidence ? 'Ordne Gesundheits-/Psychologie-Aussagen immer nach Evidenz ein („belegt vs. Hype“).' : ''}
Frage NICHT ab – das passiert erst, wenn ${nm()} „verstanden“ sagt.

${sessionContext(d)}`
  return streamChat(system, history, onText)
}

export function checkChat(day: number, history: ChatMsg[], onText: (t: string) => void) {
  const d = getDay(day)
  const system = `${persona()}

Phase „Verständnischeck“: ${nm()} hat „verstanden“ gesagt. Führe den Check nach diesen Regeln:
- ${isBlockMix(d) ? '5' : '3–5'} Verständnisfragen, IMMER nur EINE Frage pro Nachricht, dann auf die Antwort warten.
- ${isBlockMix(d) ? 'Gemischte Abfrage des ganzen Blocks plus Verknüpfungsfragen zwischen den Bereichen.' : isRepeat(getState().level, d.day) ? 'Wiederholung: abgefragt werden die Teilthemen (Schulstoff) – unabhängig davon, welche Videos gesehen wurden; Schwerpunkt Lücken und Verknüpfungen.' : 'Abgefragt wird nur, was in den ★-Pflichtvideos gelehrt wurde.'}
- Keine reinen Wiedergabefragen, sondern: Teilthemen kombinieren („Was passiert mit X, wenn Y ausfällt?“), Anwendung auf Alltag/Nachrichten/Entscheidungen, Vorhersagen & Fallbeispiele („Warum…?“, „Was wäre, wenn…?“), Verknüpfung mit früheren Sessions UND anderen Bereichen.
- Nummeriere die Fragen im Format „**Frage 2/4:** …“.
- Nach JEDER Antwort von ${nm()} beginnt deine Nachricht in der ersten Zeile mit genau einem Bewertungs-Marker:
  [[BEWERTUNG: richtig | P]] oder [[BEWERTUNG: teilweise | P]] oder [[BEWERTUNG: falsch | P]]
  P = Präzision der Antwort von 1 (vage) bis 5 (präzise, Fachbegriffe korrekt). Beispiel: [[BEWERTUNG: teilweise | 3]]
- Danach kurz bewerten (✅ richtig / 🟡 unvollständig / ❌ falsch). Bei falsch/unvollständig: kurz erklären, dann eine Nachfrage zum GLEICHEN Punkt stellen, bevor es mit der nächsten Frage weitergeht.
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

function parseJson<T>(t: string): T {
  const s = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  try {
    return JSON.parse(s) as T
  } catch {
    const a = s.indexOf('{')
    const b = s.lastIndexOf('}')
    if (a >= 0 && b > a) return JSON.parse(s.slice(a, b + 1)) as T
    throw new ApiError('Antwort der KI war kein gültiges JSON – bitte erneut versuchen.')
  }
}

export async function makeSummary(day: number): Promise<SummaryResult> {
  const d = getDay(day)
  const ds = dayState(getState(), day)
  const transcript = (label: string, msgs?: ChatMsg[]) =>
    msgs?.length ? `\n## ${label}\n` + msgs.map((m) => `${m.role === 'user' ? nm() : 'Begleiter'}: ${m.content}`).join('\n\n') : ''

  const system = `${persona()}

Erstelle nach der abgeschlossenen Session den Lernzettel zum Wiederholen und Karteikarten. Antworte NUR mit JSON.

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
${transcript('Eigene Fragen', ds.questions)}
${transcript('Verständnischeck', ds.check)}`

  const text = await complete(system, user, 8000, {
    chat_template_kwargs: { enable_thinking: false },
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'lernzettel',
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
  const r = parseJson<SummaryResult>(text)
  if (typeof r.summary_markdown !== 'string' || !Array.isArray(r.cards)) throw new ApiError('Unvollständige Antwort – bitte erneut versuchen.')
  return r
}

// ---------- Staerkenanalyse ----------

export async function adviseFocus(): Promise<string> {
  const s = getState()
  const done = DAYS.filter((d) => dayState(s, d.day).status === 'fertig').length
  const system = `${persona()}

Du berätst ${nm()}, worin die Stärken liegen und welche Themen liegen. SEHR KURZ, höchstens 5 Zeilen, keine Einleitung:
- 2–3 Zeilen nach dem Muster „**Bereich**: x % richtig, Ø y s, Präzision z/5“ – nur die auffälligsten (stark und schwach).
- 1 Zeile „Deshalb könnte dir … liegen“ mit 1–2 konkreten Vertiefungsrichtungen.
- 1 Zeile: Alternative – breit weitermachen mit gefächertem Allgemeinwissen, und wann das sinnvoller wäre.
Stütze dich nur auf die Zahlen. Wenig Daten? Dann sag das in einem Halbsatz.`
  const user = `Abgeschlossene Sessions: ${done}/90\nKennzahlen je Überthema:\n${statsTable(s) || '(noch keine Daten)'}`
  return complete(system, user, 900)
}

// ---------- Community-Chat ----------

export function channelChat(area: AreaId | null, history: { author: 'ich' | 'ki'; text: string }[], onText: (t: string) => void) {
  const topic = area ? `Kanal #${AREAS[area].name} – nur Themen aus diesem Bereich.` : 'Kanal #allgemein – alle Themen des Lernplans.'
  const system = `${persona()}

Du bist im Themen-Chat der App als „KI“ dabei. ${topic}
Antworte wie in einem Chat: kurz (max. 6 Zeilen), locker, sachlich korrekt. Verweise nur auf Sessions aus dieser Liste (Tag-Nummer), erfinde keine:
${DAYS.filter((d) => !area || d.area === area).map(dayLine).join('\n')}`
  const msgs: ChatMsg[] = history.slice(-20).map((m) => ({ role: m.author === 'ich' ? 'user' : 'assistant', content: m.text }))
  return streamChat(system, msgs, onText, 1500)
}

export function describeError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}
