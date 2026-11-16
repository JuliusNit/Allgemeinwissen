import { ALL_DAYS, AREAS, BLOCKS, DAYS, getDay, isBlockMix, isProject, type AreaId, type Day } from '../data/plan'
import { STAGES, type Stage } from '../data/deep'
import { FAECHER, fach, topicsUpTo, type Fach, type FachId } from '../data/lehrplan'
import { blockName, DAY_FACH, isRepeat, knownUpTo, levelLabel, SCHOOL_GRADE } from '../data/school'
import type { BasisNode } from './path'
import { functionCall, kiProxy, type CloudMsg } from './cloud'
import { examLinks, examPlan } from './exam'
import { checkNotes, dayDone, DONE_MARKER, likesTable, parseCheck, statsTable, VERDICT_SCORE } from './stats'
import { hasSheet, loadSheet } from '../data/lernzettel'
import { dayState, examState, getState, videoNotesText, videosOf, type ChatMsg, type ExamAnswer, type ExamQuestion } from './store'

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
  // angemeldet → immer ueber den KI-Proxy des Servers (Key liegt nur dort); eigener Key nur ohne Konto
  const proxy = await kiProxy()
  if (!apiKey && !proxy) throw new ApiError('Für die KI bitte anmelden – oder unter „Profil → KI“ einen eigenen Key eintragen.')
  let res: Response
  try {
    res = await fetch(proxy ? proxy.url : apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(proxy ? proxy.headers : { Authorization: `Bearer ${apiKey}` }) },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ApiError(proxy ? 'Keine Verbindung zum KI-Server.' : 'Keine Verbindung zur KI – Internet bzw. API-Adresse prüfen.')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let msg: string | undefined
    try {
      msg = (JSON.parse(text) as { error?: string }).error
    } catch {
      msg = undefined
    }
    if (proxy && res.status === 404) throw new ApiError('KI-Server noch nicht eingerichtet (Edge Function „ki“ fehlt).', 404)
    if (proxy && msg) throw new ApiError(msg, res.status)
    if (res.status === 401 || res.status === 403) throw new ApiError(proxy ? 'Bitte neu anmelden.' : 'API-Key ungültig – bitte im Profil prüfen.', res.status)
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
  return readStream(res, onText)
}

/** SSE-Stream lesen; Ereignisse ohne `choices` (z. B. von ki-chat) gehen an onEvent */
async function readStream(res: Response, onText: (t: string) => void, onEvent?: (e: Record<string, unknown>) => void): Promise<string> {
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
        if (!j.choices && onEvent) onEvent(j)
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
  return `[${d.area} – ${AREAS[d.area].name}] ${d.title}`
}

function earlierSessions(d: Day): string {
  const s = getState()
  const related = isBlockMix(d) ? DAYS.filter((x) => d.links.includes(x.day)) : d.links.map(getDay)
  // dazu: alle bereits abgeschlossenen Sessions als kurze Liste fuer bereichsuebergreifende Verknuepfungen
  const done = ALL_DAYS.filter((x) => x.day !== d.day && dayState(s, x.day).status === 'fertig')
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

/** Vertiefung nach Tag 90: worauf die Stufe zielt */
const STAGE_HINT: Record<Stage, string> = {
  grund: 'ein tragendes Modell des Fachs genauer als im Plan verstehen: Mechanismus, Begriffe, Beispiel.',
  klassik: 'eine große Frage des Fachs: verschiedene Antworten, warum sie sich unterscheiden, was heute gilt.',
  streit: 'eine aktuelle Kontroverse: Positionen, Belege, was gesichert ist und was offen.',
  projekt: 'eine selbst gewählte Frage recherchieren und das Ergebnis in eigenen Worten begründen.',
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
      : isProject(d)
        ? `Projekt-Session ohne Videos. Teilthemen: ${d.subtopics.join(' · ')}`
        : `★-Pflichtvideos (nur deren Inhalt wird abgefragt): ${stars.map((v) => v.title).join(' · ') || '—'}`,
  ]
  if (d.stage) lines.push(`VERTIEFUNG nach den 90 Tagen, Stufe „${STAGES[d.stage]}“: ${STAGE_HINT[d.stage]} Grundwissen aus dem Plan wird vorausgesetzt – darauf aufbauen, nicht wiederholen.`)
  if (isRepeat(s.level, d.day)) {
    lines.push(`WIEDERHOLUNG: Für ${nm()} ist das Schulstoff (LehrplanPLUS Bayern bis Jgst. ${SCHOOL_GRADE[d.day]}), also bekannt. Vorwissen aktivieren, Lücken aufdecken und vor allem mit Neuem und anderen Bereichen verknüpfen. Videos sind nur zum Auffrischen; abgefragt werden die Teilthemen insgesamt.`)
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
  if (l.kind === 'schule') return `Wissensstand: ${levelLabel(l)} (Gymnasium Bayern, LehrplanPLUS). Setze nur Schulwissen bis Jahrgangsstufe ${l.grade - 1} voraus, erkläre Fachbegriffe darüber hinaus und baue Neues auf dem Bekannten auf.`
  return `Wissensstand: ${levelLabel(l)}. Schulwissen bis zum Abitur gilt als bekannt – Schulthemen sind Wiederholung, darauf aufbauen.`
}

// Funktion statt Konstante: Name und Wissensstand koennen sich aendern
const persona = () => `Du bist der Lernbegleiter von ${nm()} im 90-Tage-Lernplan „Allgemeinwissen (kristalline Intelligenz)“.
${levelLine()}
Ziel: breites, vernetztes Wissen, an das sich Neues schnell anhängen lässt. Gerüste: Zeitstrahl, Weltkarte, Größenordnungen, Evolution, Angebot/Nachfrage.
Antworte immer auf Deutsch, klar und knapp, ohne Floskeln. Markdown ist erlaubt (Überschriften, Listen, **fett**, Tabellen). Kein LaTeX, keine $-Formeln: Zahlen und Formeln als normaler Text mit Unicode (10⁻⁹ m, CO₂, a · b).`

// ---------- Session ----------

export function anchorChat(day: number, onText: (t: string) => void) {
  const d = getDay(day)
  if (isProject(d)) return projectStartChat(d, onText)
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

// ---------- Projekt (letzte Session der Vertiefung eines Fachs) ----------

const PROJECT = (d: Day) => `${nm()} schließt die Vertiefung „${AREAS[d.area].name}“ mit einem eigenen kleinen Projekt ab: eine selbst gewählte Frage, ein bis zwei Stunden Recherche, das Ergebnis in eigenen Worten begründet.`

function projectStartChat(d: Day, onText: (t: string) => void) {
  const system = `${persona()}

Aufgabe: Projekt-Start. ${PROJECT(d)}
Schlage 3 Projektfragen vor, die an die Sessions unten anknüpfen und über sie hinausgehen – je eine aus Grundmodellen, klassischen Fragen und Streitfragen, mindestens eine mit Bezug zu einem anderen Bereich. Je Frage:
- die Frage fett, darunter ein Halbsatz, warum sie spannend ist
- 2–3 konkrete Startpunkte (bestimmter Wikipedia-Artikel, bpb, Statistisches Bundesamt, ein Klassiker der Fachliteratur, Museum/Archiv online)
- was am Ende stehen könnte (Begründung, Vergleichstabelle, Zeitstrahl, Pro/Contra)
Eine Frage muss in ein bis zwei Stunden beantwortbar sein: eng genug, nicht nur Meinung. Zum Schluss eine Zeile: Eine eigene Frage ist genauso gut.

${sessionContext(d)}`
  return streamChat(system, [{ role: 'user', content: 'Schlag mir Projektfragen vor.' }], onText, 2000)
}

/** Schulstoff-Sessions, auf die eine Session verweist (Grundlage fürs Auffrischen) */
export function refreshDays(day: number): number[] {
  const level = getState().level
  if (isRepeat(level, day)) return []
  return getDay(day).links.filter((n) => isRepeat(level, n))
}

export function refreshChat(day: number, onText: (t: string) => void) {
  const d = getDay(day)
  const base = refreshDays(day).map(getDay)
  const system = `${persona()}

Aufgabe: „Auffrischen“ vor der Session. Die heutige Session baut auf Schulstoff auf, den ${nm()} kennen sollte, aber vielleicht vergessen hat.
Frische NUR diesen Schulstoff auf (Sessions unten) – und nur den Teil, auf den das heutige Thema aufbaut.
Das heutige Thema selbst ist tabu: seine Teilthemen, Personen und Begriffe weder erklären noch anreißen – das lernt ${nm()} gleich in den Videos.
Form (höchstens ~150 Wörter, ohne Einleitung):
- 4–6 Stichpunkte: Begriff/Ereignis/Jahreszahl/Größe + Halbsatz, wozu man es heute braucht.
- Wenn es hilft, eine kleine Tabelle oder ein Text-Zeitstrahl.
- Zum Schluss 2 kurze Selbsttest-Fragen zum Schulstoff (ohne Lösung).

HEUTIGE SESSION (nicht erklären): ${dayLine(d)} – ${d.subtopics.join(' · ')}

Schulstoff, der aufgefrischt wird:
${base.map((b) => `- ${dayLine(b)} – ${b.subtopics.join(' · ')}`).join('\n')}`
  return streamChat(system, [{ role: 'user', content: 'Frisch mein Grundwissen auf.' }], onText, 1500)
}

export function questionsChat(day: number, history: ChatMsg[], onText: (t: string) => void) {
  const d = getDay(day)
  const system = isProject(d)
    ? `${persona()}

Phase „Projekt-Betreuung“: ${PROJECT(d)} Du betreust wie ein Tutor:
- Frage schärfen: beantwortbar, eng genug, klar, was am Ende stehen soll.
- Quellen finden und prüfen: Wer schreibt, wann, mit welchem Beleg? Primär- vs. Sekundärquelle, Studie vs. Meinung.
- Zwischenergebnisse ordnen, Lücken und Gegenargumente aufzeigen.
Mach die Arbeit nicht selbst: keine fertige Antwort auf die Projektfrage, sondern Hinweise, Rückfragen, Gegenbeispiele. Nennst du Fakten, sag, wie sicher sie sind.${d.evidence ? ' Gesundheits-/Psychologie-Aussagen nach Evidenz einordnen („belegt vs. Hype“).' : ''}
Frage NICHT ab – das passiert erst, wenn ${nm()} das Ergebnis vorstellt.

${sessionContext(d)}`
    : `${persona()}

Phase „Eigene Fragen“: ${nm()} hat die Videos gesehen und stellt eigene Fragen zum Thema.
Erkläre verständlich, mit Beispielen aus Alltag/Nachrichten, und knüpfe wo sinnvoll an Zeitstrahl, Karte und frühere Sessions an.
Wenn du etwas nicht sicher weißt, sag das. ${d.evidence ? 'Ordne Gesundheits-/Psychologie-Aussagen immer nach Evidenz ein („belegt vs. Hype“).' : ''}
Frage NICHT ab – das passiert erst, wenn ${nm()} „verstanden“ sagt.

${sessionContext(d)}`
  return streamChat(system, history, onText)
}

/** Nachfrage nach Fehler: Erklärung anwenden statt wiedergeben */
const FOLLOW_UP = `Die Nachfrage darf NICHT mit deiner Erklärung beantwortbar sein (nicht dieselbe Frage neu formulieren, keine Auswahl „Masse, Energie, Impuls?“). Stelle stattdessen eine neue Situation zum gleichen Prinzip, in der man die Erklärung übertragen und selbst weiterdenken muss – z. B. abgewandelter Fall, Gegenbeispiel, Vorhersage („Was ändert sich, wenn…?“), Begründung eines Details.
  Prüfe vor dem Senden: Steht die Antwort (oder ihr Kernbegriff) schon in deiner Erklärung direkt darüber, ist die Nachfrage wertlos – neu formulieren, bis man einen Schritt weiterdenken muss, den du NICHT hingeschrieben hast.
  Beispiel – schlecht: Erklärung „Beim Abrufen muss das Gehirn die Info aus dem Langzeitgedächtnis holen“, Nachfrage „Warum ist das Suchen der Antwort auf der Karteikarte so wichtig?“ (= Erklärung zurückgeben). Gut: „Eine Freundin sagt: ‚Abfragen bringt mir nichts, ich weiß die Antworten eh nie – dann lese ich sie lieber gleich.‘ Was entgegnest du, und wie sollte sie das Abfragen ändern, damit es ihr hilft?“
  Gibt die Antwort auf eine Nachfrage nur deine eigene Erklärung wieder (dieselben Worte, kein eigener Schritt), ist das noch kein Verständnis: KEIN ✅ und KEIN Marker, sondern freundlich eine Anwendung verlangen („Stimmt – und was heißt das konkret für …?“).`

/** Verständnis statt Wiedergabe – eine Alltags-Einkleidung allein macht aus einer Wiedergabefrage keine Verständnisfrage (Julius, 28.10.2026) */
const UNDERSTAND = `Keine Wiedergabefragen – auch keine verkleideten. Prüfe jede Frage vor dem Senden: Lässt sie sich beantworten, indem man einen Satz aus dem Video/Lernstoff aufsagt (Definition, „laut X passiert …“, „was muss man tun“, „nenne die Ursache“), ist es Wiedergabe – auch wenn ein Alltagsszenario davorsteht. Dann verwerfen.
  Eine Verständnisfrage zwingt dazu, das Gelernte auf etwas anzuwenden, das im Stoff so NICHT vorkam, und dabei selbst zu denken: zwischen Optionen entscheiden und begründen, ein Ergebnis für einen abgewandelten Fall vorhersagen, zwei Fälle vergleichen, einen Fehler in einer Behauptung/einem Plan finden, etwas mit konkreten Zahlen planen, Teilthemen kombinieren („Was passiert mit X, wenn Y ausfällt?“), mit früheren Sessions oder anderen Bereichen verknüpfen. Die Antwort steht nirgends wörtlich, man muss sie herleiten.
  Beispiel – schlecht: „Du vergisst den Stoff nach 24 Stunden. Warum passiert das laut der Vergessenskurve, und was muss man tun?“ (= Kurve + „wiederholen“ aufsagen). Gut: „Lena lernt 3 Stunden am Abend vor der Prüfung, Tom 6 × 30 Minuten über zwei Wochen. Wer schneidet in der Prüfung besser ab, wer in einem Monat – und warum?“
  Wirkt das Thema dafür zu dünn, nicht auf Wiedergabe ausweichen, sondern Anwendung, Grenzfälle („Gilt das auch, wenn …?“) und Verknüpfungen nutzen.`

/** Erst erkennen, was die Nachricht ist – nicht jede Eingabe ist eine Antwort, die richtig oder falsch sein kann */
const adapt = () => `Lies jede Nachricht von ${nm()} zuerst darauf, WAS sie ist, und reagiere passend – nicht alles ist eine Antwort:
  • Antwortversuch (auch kurz, umgangssprachlich, unsicher formuliert oder nur ein Teil): bewerten (Marker richtig/teilweise/falsch, siehe unten). Stimmt der Kern, ist es richtig – nicht auf Fachbegriffe, Vollständigkeit oder Formulierung pochen.
  • „keine Ahnung“, „weiß nicht“, „sag mir die Lösung“, „?“ o. ä.: KEIN ✅/🟡/❌, nicht „falsch“ nennen. Locker bleiben („Kein Problem – so kommst du drauf:“), die Lösung kurz Schritt für Schritt herleiten und an Bekanntes anknüpfen, dann eine leichtere Nachfrage zum gleichen Punkt. Marker: [[BEWERTUNG: offen | 1]]
  • Bitte um Tipp oder Hilfe („gib mir einen Tipp“, „hilf mir“, Ansatz mit Frage dahinter): einen Denkanstoß geben, der die Lösung nicht verrät, die Frage bleibt offen. KEIN Marker.
  • Rückfrage zur Frage („was meinst du mit …?“, „wie genau?“): Frage klarer formulieren oder den Begriff erklären, ohne die Lösung. KEIN Marker.
  • Inhaltliche Gegenfrage zum Thema: kurz beantworten, dann zur offenen Frage zurück. KEIN Marker.
  • Sonstiges (Smalltalk, „weiter“, Off-Topic): kurz reagieren, offene Frage noch einmal stellen. KEIN Marker.
  Passe dich an: Läuft es gut, werden die Fragen anspruchsvoller; hakt es, kleinere Schritte und konkretere Fragen. Ton wie ein Tutor, nicht wie ein Prüfer.`

export function checkChat(day: number, history: ChatMsg[], onText: (t: string) => void) {
  const d = getDay(day)
  if (isProject(d)) return projectCheckChat(d, history, onText)
  const system = `${persona()}

Phase „Verständnischeck“: ${nm()} hat „verstanden“ gesagt. Führe den Check nach diesen Regeln:
- ${isBlockMix(d) ? '5' : '3–5'} Verständnisfragen, IMMER nur EINE Frage pro Nachricht, dann auf die Antwort warten.
- ${isBlockMix(d) ? 'Gemischte Abfrage des ganzen Blocks plus Verknüpfungsfragen zwischen den Bereichen.' : isRepeat(getState().level, d.day) ? 'Wiederholung: abgefragt werden die Teilthemen (Schulstoff) – unabhängig davon, welche Videos gesehen wurden; Schwerpunkt Lücken und Verknüpfungen.' : 'Abgefragt wird nur, was in den ★-Pflichtvideos gelehrt wurde.'}
- ${UNDERSTAND}
- Nummeriere die Fragen im Format „**Frage 2/4:** …“.
- ${adapt()}
- Nach jedem Antwortversuch beginnt deine Nachricht in der ersten Zeile mit genau einem Bewertungs-Marker:
  [[BEWERTUNG: richtig | P]] oder [[BEWERTUNG: teilweise | P]] oder [[BEWERTUNG: falsch | P]]
  P = Präzision der Antwort von 1 (vage) bis 5 (präzise, Fachbegriffe korrekt). Beispiel: [[BEWERTUNG: teilweise | 3]]
- Danach kurz bewerten (✅ richtig / 🟡 unvollständig / ❌ falsch). Bei falsch/unvollständig: kurz erklären, dann eine Nachfrage zum GLEICHEN Punkt stellen, bevor es mit der nächsten Frage weitergeht. ${FOLLOW_UP}
- Erst wenn alles sitzt: ein Satz Fazit, darunter je eine Zeile [[STAERKE: …]] für 1–3 Dinge, die gut saßen, und [[LUECKE: …]] für 0–3 echte Lücken (je höchstens 6 Wörter, konkret zum Inhalt, z. B. [[LUECKE: Ursache der Inflation 1923]]). In die letzte Zeile exakt: ${DONE_MARKER}
- Schreibe ${DONE_MARKER} niemals vorher.

${sessionContext(d)}`
  return streamChat(system, history, onText)
}

function projectCheckChat(d: Day, history: ChatMsg[], onText: (t: string) => void) {
  const system = `${persona()}

Phase „Projekt-Abschluss“: ${PROJECT(d)} Jetzt stellt ${nm()} das Ergebnis vor. Ablauf:
- **Frage 1/4:** Bitte um die Vorstellung in eigenen Worten: Frage, Vorgehen, Ergebnis, wichtigste Quellen (5–10 Sätze reichen).
- Danach genau 3 Fragen zum vorgestellten Projekt, IMMER nur EINE pro Nachricht: **Frage 2/4** Beleg (Woher weißt du das, wie verlässlich ist die Quelle?), **Frage 3/4** Gegenposition (Was spricht dagegen, wer sieht es anders und warum?), **Frage 4/4** Transfer (Was folgt daraus für ein anderes Fach, die Gegenwart oder eine Entscheidung?).
- ${adapt()}
- Nach jedem Antwortversuch (auch der Vorstellung) beginnt deine Nachricht in der ersten Zeile mit genau einem Marker:
  [[BEWERTUNG: richtig | P]] oder [[BEWERTUNG: teilweise | P]] oder [[BEWERTUNG: falsch | P]]  (P = Präzision 1–5)
  Bewertet wird die Begründung, nicht die Meinung: richtig = schlüssig und belegt, teilweise = Lücken im Beleg oder in der Logik, falsch = sachlich falsch oder unbegründet.
- Danach kurz würdigen und konkret sagen, was die Argumentation stärker machen würde. Sachfehler korrigieren.
- Zum Schluss: ein Satz Fazit, darunter je eine Zeile [[STAERKE: …]] für 1–3 Dinge, die gut waren, und [[LUECKE: …]] für 0–3 Punkte zum Weiterdenken (je höchstens 6 Wörter). In die letzte Zeile exakt: ${DONE_MARKER}
- Schreibe ${DONE_MARKER} niemals vorher.

${sessionContext(d)}`
  return streamChat(system, history, onText)
}

// ---------- Pruefungs-Wiederholung ----------

// Kurztest statt Chat (Julius, 15.11.2026): nicht noch einmal das ganze Thema pruefen, sondern ob das Kernprinzip
// sitzt und sich anwenden laesst, plus ein Zusammenhang zu einer frueheren Session (nur um eine Ecke). Kein langer
// Fliesstext: die Aufgabe 1–2 Saetze, den Fall traegt das Material daneben (Diagramm, Tabelle, Fall in Stichpunkten).

const EXAM_DIAGRAMS = `\`\`\`kette       je Zeile ein Schritt (Kasten), die Pfeile entstehen von selbst; eine Lücke ist ein eigener Schritt „?“
\`\`\`kreis       Kreislauf, je Zeile eine Station
\`\`\`zeitstrahl  je Zeile „Zeit | Ereignis“
\`\`\`baum        Hierarchie, Einrückung mit 2 Leerzeichen
\`\`\`gruppen     Zeile ohne Einrückung = Kastentitel, eingerückte Zeilen = Inhalt (gut für Fall A / Fall B)
\`\`\`pyramide    Stufen von oben nach unten
\`\`\`balken      je Zeile „Name: Zahl | Anzeige“
\`\`\`kurve       Zeilen „x: Achse“, „y: Achse“, dann Reihen „Name: x y, x y, x y“ (nur Zahlen)`

const str = { type: 'string' }

function jsonSchema(name: string, properties: Record<string, unknown>) {
  return {
    chat_template_kwargs: { enable_thinking: false },
    response_format: {
      type: 'json_schema',
      json_schema: { name, schema: { type: 'object', additionalProperties: false, required: Object.keys(properties), properties } },
    },
  }
}

/** Material aufraeumen: Fliesstext wird zu Stichpunkten, und jedes Diagramm zeigt auch etwas */
function fixMaterial(m: string): string {
  const out = m.trim().replace(/```(kette|balken|kurve)\n([\s\S]*?)```/g, (_, kind: string, src: string) => {
    const ls = src.split('\n').filter((l) => l.trim())
    if (kind === 'kette') {
      // „→ Text“ ist nur Pfeilbeschriftung – steht kein Schritt davor oder dahinter, ist es selbst der Schritt
      const arrow = (l?: string) => !!l && /^\s*(→|->)/.test(l)
      const fixed = ls.map((l, i) => (arrow(l) && (i === 0 || i === ls.length - 1 || arrow(ls[i - 1])) ? l.replace(/^\s*(→|->)\s*/, '') : l))
      return '```kette\n' + fixed.join('\n') + '\n```'
    }
    // Balken/Kurve ohne Zahlen blieben leer, Balken mit gemischten Einheiten (10000 € neben 5 %) sagen nichts → als Kaesten zeigen
    const units = new Set(ls.map((l) => /:\s*-?[\d.,]+\s*([^\d|]*)/.exec(l)?.[1].trim()))
    const numbers = kind === 'balken' ? units.size === 1 && !units.has(undefined) : ls.some((l) => /:\s*-?\d+([.,]\d+)?\s+-?\d/.test(l))
    return numbers ? '```' + kind + '\n' + ls.join('\n') + '\n```' : '```gruppen\n' + ls.map((l) => l.trim().replace(/:\s*/, ' | ')).join('\n') + '\n```'
  })
  // ein Absatz aus mehreren Saetzen liest sich neben der Aufgabe schlecht → je Satz ein Stichpunkt
  return out
    .split(/\n{2,}/)
    .map((block) => {
      if (/^\s*([-*•|>#]|\d+\.|```)/.test(block) || block.includes('\n')) return block
      const sentences = block.match(/[^.!?]+(?:[.!?](?!\s|$)[^.!?]*)*[.!?]+["“‘’”]?(?=\s|$)|[^.!?]+$/g)?.map((x) => x.trim()).filter(Boolean) ?? []
      return sentences.length >= 3 ? sentences.map((x) => `- ${x}`).join('\n') : block
    })
    .join('\n\n')
}

// Aufgabentypen: jeder zwingt dazu, den Mechanismus zu benutzen – der Merksatz allein fuehrt nicht zur Loesung
// (Julius, 16.11.2026: die ersten Tests waren Wiedererkennen einer gelernten Regel und viel zu leicht).
// Je Typ eine enge Bauvorschrift und ein Beispiel desselben Typs; ein gemeinsamer langer Prompt wurde ignoriert.
const EXAM_TYPES = {
  plan: {
    regel: `Fehler im Plan. Eine Person wendet die im Thema empfohlene Regel tatsächlich AN (nicht ihr Gegenteil – wer einfach alles falsch macht, ist ein Strohmann) und verfehlt trotzdem ihr Ziel, weil sie eine Voraussetzung des Mechanismus übersieht: falsche Dosis, falscher Zeitpunkt, falsches Material, zu früh aufgehört, richtige Maßnahme an der falschen Stelle. Material: der Plan und das enttäuschende Ergebnis. Aufgabe: Woran liegt es, und welche EINE Änderung bringt am meisten?`,
    beispiel: `Thema Preisbildung – material: „- Eine Stadt deckelt alle Mieten auf 8 € je m² (Marktmiete: 12 €)\n- Ziel: Wohnen soll bezahlbar bleiben\n- Fünf Jahre später: Wer eine Wohnung hat, zahlt weniger\n- Die Wartelisten sind doppelt so lang, gebaut wird kaum noch“, q: „Jede einzelne Wohnung ist billiger geworden. Warum finden trotzdem weniger Menschen eine – und welche Maßnahme setzt an der Ursache an?“`,
  },
  befund: {
    regel: `Überraschender Befund. Eine kleine Tabelle mit Zahlen (2–3 Zeilen), in der etwas der ersten Erwartung widerspricht: zwei Verläufe kreuzen sich, mehr Aufwand bringt weniger, ein Vorteil kehrt sich um, eine Maßnahme wirkt nur bei einer Gruppe. NICHT: Die Gruppe mit der Lehrbuch-Methode ist einfach besser. Die Zahlen sind erfunden, müssen aber dem entsprechen, was nach dem Fachwissen wirklich herauskäme. Aufgabe: das ganze Muster mit EINEM Mechanismus erklären.`,
    beispiel: `Thema Evolution – material: „| | resistente Infektionen 2019 | 2024 |\n|---|---|---|\n| Klinik A: Antibiotika vorsorglich für alle | 4 % | 19 % |\n| Klinik B: nur bei Nachweis | 5 % | 7 % |“, q: „Klinik A behandelt gründlicher und hat am Ende mehr unbehandelbare Infektionen. Wie kommt das zustande?“`,
  },
  grenzfall: {
    regel: `Grenzfall. Eine Situation, auf die die Regel des Themas zu passen scheint, in der sie aber nicht oder nur halb gilt, weil eine Voraussetzung des Mechanismus fehlt. Material: die Situation und eine Person, die sich mit einem wörtlichen Satz auf die Regel beruft. Aufgabe: Geht ihre Rechnung hier auf? Die Antwort ist „nein, weil …“ oder „nur zum Teil, weil …“ – weder Material noch Aufgabe verraten das.`,
    beispiel: `Thema Angebot und Nachfrage – material: „- Stadion mit 40 000 Plätzen, Karten zu 60 €, nach vier Minuten ausverkauft\n- Auf dem Zweitmarkt kosten die Karten 240 €\n- Der Veranstalter: ‚Höhere Preise senken die Nachfrage. Bei 120 € verkaufe ich also nur noch halb so viele Karten.‘“, q: „Geht seine Rechnung auf? Begründe, was bei 120 € mit der Zahl der verkauften Karten passiert.“`,
  },
  abwandlung: {
    regel: `Abgewandelte Bedingung. Ein Ablauf aus dem Thema, an dem EINE Stelle verändert ist: ein Teil fällt aus, läuft viel schneller, kommt in anderer Reihenfolge oder doppelt. Material: der Ablauf in Stichpunkten oder als kette, die geänderte Stelle beginnt mit „Geändert:“. Aufgabe: Was passiert danach – bis zu einer Folge, die man von außen sehen oder messen könnte – und warum? Die Folge steht so nicht im Lernzettel. Die Änderung muss in der Wirklichkeit möglich sein (kein Fluss, der den Kontinent wechselt). Hat das Thema keinen echten Ablauf (Prozess, Kette von Ursache und Wirkung), baue stattdessen einen Grenzfall: eine Situation, auf die eine Regel des Themas zu passen scheint, in der sie aber nicht gilt, weil eine Voraussetzung fehlt – Aufgabe dann: Gilt die Regel hier, und warum (nicht)?`,
    beispiel: `Thema Immunsystem – material: „- Erste Impfdosis: Der Körper bildet Antikörper und wenige Gedächtniszellen\n- Üblich: zweite Dosis nach vier Wochen\n- Geändert: Die zweite Dosis kommt schon am nächsten Tag“, q: „Wie gut ist diese Person in einem Jahr geschützt, verglichen mit dem üblichen Abstand – und warum?“`,
  },
  bruecke: {
    regel: `Zusammenhang mit einer früheren Session – nur um eine Ecke, EIN Schritt. Wähle aus „Frühere Sessions“ die mit der stärksten direkten Verbindung: Ein Mechanismus von dort erklärt, verursacht oder begrenzt etwas im heutigen Thema. Lose Analogien und Wortgleichheit („beides wiederholt etwas“) zählen nicht. Zusatzfelder: session = Titel der früheren Session; frueher = der Mechanismus oder die Tatsache von dort in einem Satz (wird ${'${NAME}'} gezeigt). material = NUR die heutige Seite: EINE konkrete Beobachtung, Regel oder ein Fall aus dem heutigen Thema (kein Vergleich zweier Gruppen). Aufgabe: mit dem Früheren erklären, warum das Heutige so ist, oder vorhersagen, was daraus für den Fall folgt. Die Verbindung selbst steht nirgends.`,
    beispiel: `Thema Inflation, frühere Session Angebot und Nachfrage – frueher: „Ein Preis steigt, wenn die Nachfrage schneller wächst als das Angebot.“, material: „- Ein Staat zahlt jedem Haushalt einmalig 3000 € aus\n- Fabriken und Läden arbeiten schon an der Kapazitätsgrenze\n- Sechs Monate später kosten Alltagswaren 9 % mehr“, q: „Warum führt das Geschenk zu höheren Preisen statt zu mehr Wohlstand – und unter welcher Bedingung wäre es anders ausgegangen?“`,
  },
}
type ExamType = keyof typeof EXAM_TYPES

function shuffle<T>(a: T[]): T[] {
  const out = [...a]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Test erzeugen: je Aufgabe Entwurf → Prüfer → bei klarem Mangel ein neuer Entwurf → Musterantwort nachrechnen; alle Aufgaben gleichzeitig (~25 s) */
export async function makeExam(day: number, onProgress?: (ready: number) => void): Promise<ExamQuestion[]> {
  const d = getDay(day)
  const s = getState()
  const ds = dayState(s, day)
  const ex = examState(s, day)
  const plan = examPlan(s, day)
  const links = examLinks(s, day)
  const sheet = hasSheet(day) ? await loadSheet(day).catch(() => '') : ''
  const weak = checkNotes(ds.check).weak
  const DIR = { vor: 'darauf baut das Thema auf', nach: 'baut auf dem Thema auf', nah: 'ohne feste Verknüpfung – nur nehmen, wenn die Verbindung direkt ist' }
  const linked = await Promise.all(
    links.slice(0, 3).map(async (l) => {
      const txt = hasSheet(l.day.day) ? await loadSheet(l.day.day).catch(() => '') : ''
      return `- ${dayLine(l.day)} – ${l.day.subtopics.join(' · ')} (${DIR[l.dir]})${txt ? `\n  Auszug Lernzettel: ${clip(txt.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, ' '), 1800)}` : ''}`
    }),
  )

  // Vielfalt legt der Code fest, nicht das Modell: je Aufgabe ein anderer Typ und ein anderer Schwerpunkt
  const types = shuffle<ExamType>(['plan', 'befund', 'grenzfall', 'abwandlung'])
  const focus = shuffle(d.subtopics)
  const jobs = plan.map((kind, i) => ({ kind, typ: kind === 'zusammenhang' ? ('bruecke' as const) : types[i % types.length], focus: kind === 'zusammenhang' ? '' : focus[i % focus.length] }))

  const context = `THEMA: ${dayLine(d)}
Teilthemen: ${d.subtopics.join(' · ')}
${sheet ? `\nLernzettel (kennt ${nm()}):\n${clip(sheet, 7000)}\n` : ''}${weak.length ? `\nLücken aus dem Verständnischeck: ${weak.join(' · ')}\n` : ''}${ex.asked?.length ? `\nAufgaben des letzten Tests (andere Fälle und andere Punkte nehmen):\n${ex.asked.map((q) => `- ${q}`).join('\n')}\n` : ''}`

  const system = (typ: ExamType) => `${persona()}

Aufgabe: EINE Aufgabe für einen Kurztest bauen. ${nm()} hat das Thema vor einiger Zeit ausführlich gelernt (Videos, Lernzettel, Verständnischeck). Antworte NUR mit JSON.

Maßstab: Verständnis, nicht Gedächtnis. Wer die Merksätze des Themas nur auswendig kann, kommt mit ihnen allein NICHT zur Lösung. Wer den Mechanismus dahinter verstanden hat, kommt mit ein bis zwei Minuten Nachdenken drauf und antwortet in 2–4 Sätzen. Die Antwort steht nirgends im Lernzettel. Lieber zu schwer als zu leicht.

Typ der Aufgabe – halte dich genau an diese Bauvorschrift:
${EXAM_TYPES[typ].regel.replace('${NAME}', nm())}
Beispiel für Typ und Niveau (anderes Thema, nicht übernehmen): ${EXAM_TYPES[typ].beispiel}

Felder, in dieser Reihenfolge:
- merksatz: der Lehrbuchsatz aus dem Thema, den jemand ohne Verständnis zu deinem Fall aufsagen würde.
- haken: warum der Merksatz allein hier nicht zur Lösung führt – welchen Schritt man selbst denken muss. Fällt dir keiner ein, ist der Fall zu leicht: anderen Fall bauen.${typ === 'bruecke' ? '\n- session, frueher: siehe Bauvorschrift.' : ''}
- material: der Fall, den ${nm()} neben der Aufgabe sieht – kein Fließtext, sondern 3–5 Stichpunkte als Markdown-Liste (je höchstens 18 Wörter), bei Zahlen eine kleine Markdown-Tabelle (dazu höchstens zwei Stichpunkte), ein Ablauf auch als Codeblock:
${EXAM_DIAGRAMS}
  Konkret: Personen, Zahlen, Orte, Zeiträume. Der Fall kommt so nicht im Lernzettel vor (anderer Alltag, anderes Land, andere Zeit), bleibt aber beim Stoff des Themas. Das Material sagt nur, was jemand tut oder was gemessen wurde – es nennt weder das Prinzip noch dessen Fachbegriff, begründet und bewertet nichts.
- q: die Aufgabe in 1–2 Sätzen, höchstens 35 Wörter. Sie verlangt eine Begründung und ist nicht mit Ja/Nein, einem Namen oder einer Zahl erledigt. Sie nennt den gesuchten Mechanismus nicht („Erkläre den Mechanismus der Verdrängung“ verrät die Lösung), enthält keinen Merksatz, keine Rechenaufgabe und keine Liste von Teilfragen.
- kriterien: 2–3 Gedankenschritte, die eine gute Antwort enthalten muss (je ein kurzer Satz).
- solution: Musterantwort in 2–4 Sätzen.

Verboten, weil Wiedererkennen statt Verständnis: zwei Personen oder Gruppen vergleichen, von denen eine die Lehrbuch-Methode nutzt und die andere nicht; nach dem Namen eines Prinzips fragen; „Warum ist <empfohlene Methode> besser?“.`

  const fields = { material: str, q: str, kriterien: { type: 'array', items: str }, solution: str }
  const schema = (typ: ExamType) => jsonSchema('aufgabe', { merksatz: str, haken: str, ...(typ === 'bruecke' ? { session: str, frueher: str } : {}), ...fields })
  type Raw = { merksatz?: string; haken?: string; session?: string; frueher?: string; material?: string; q?: string; kriterien?: string[]; solution?: string }

  const short = (t: string) => t.split(/[:(]/)[0].trim()
  // Titel der frueheren Session aus den Verknuepfungen – das Modell schreibt Bereich und Teilthemen mit hinein
  const sessionTitle = (x = '') => short((links.find((l) => x.includes(short(l.day.title))) ?? links[0]).day.title)
  const toQuestion = (kind: ExamQuestion['kind'], r: Raw): ExamQuestion => {
    if (typeof r.q !== 'string' || !r.q.trim() || typeof r.material !== 'string' || !r.material.trim()) throw new ApiError('Unvollständige Antwort – bitte erneut versuchen.')
    const frueher = typeof r.frueher === 'string' && r.frueher.trim()
    return {
      kind,
      q: r.q.trim(),
      // beim Zusammenhang stehen beide Seiten da: die fruehere Session als Satz, darunter der heutige Fall
      material: (frueher && links.length ? `> **${sessionTitle(r.session)}:** ${frueher}\n\n` : '') + fixMaterial(r.material),
      criteria: Array.isArray(r.kriterien) ? r.kriterien.filter((k) => typeof k === 'string' && k.trim()).slice(0, 3) : [],
      solution: typeof r.solution === 'string' ? r.solution.trim() : '',
    }
  }

  // Pruefer: eigener kurzer Aufruf ohne Lernzettel. Er urteilt nur – Umschreiben im selben Aufruf half nicht, das Modell
  // liess seine Wiedergabe-Aufgaben stehen. Bei einem klaren Mangel gibt es einen neuen Entwurf mit dem Grund; mehr
  // Runden kosten nur Zeit. Ohne Denkmodus: mit ihm dauert ein Test ~40 s (statt ~10) und der Pruefer winkt alles durch.
  const judgeSystem = (typ: ExamType) => `Du prüfst eine Aufgabe für einen Verständnistest. Antworte NUR mit JSON. Melde nur klare Mängel – im Zweifel false.
- wiedergabe: true, wenn jemand volle Punkte bekäme, der nur den Merksatz kennt und ihn hinschreibt, ohne über den Fall nachzudenken. Immer true, wenn zwei Personen oder Gruppen verglichen werden, von denen eine die Lehrbuch-Methode nutzt und die andere nicht; wenn nach dem Namen eines Prinzips gefragt wird; bei „Warum ist <empfohlene Methode> besser?“.
- verraten: true, wenn Material oder Aufgabe die Lösung schon aussprechen: den Fachbegriff des gesuchten Mechanismus oder die Begründung. Fachwörter, die nur den Fall beschreiben, sind erlaubt.
- sachfehler: true nur bei einem eindeutigen Fehler: Die Rechnung stimmt nicht, eine Fachaussage ist falsch herum, die Musterantwort widerspricht dem Material. Dass man etwas auch anders sehen könnte, ist kein Sachfehler.${typ === 'bruecke' ? '\n- ohne_bezug: true, wenn man die Aufgabe genauso gut lösen kann, ohne den Satz aus der früheren Session (im Material oben, fett eingeleitet) zu benutzen.' : ''}
- grund: ein Satz, was genau das Problem ist; "" wenn alles false ist.`
  const bool = { type: 'boolean' }
  const judgeSchema = (typ: ExamType) => jsonSchema('urteil', { wiedergabe: bool, verraten: bool, sachfehler: bool, ...(typ === 'bruecke' ? { ohne_bezug: bool } : {}), grund: str })

  async function one(job: (typeof jobs)[number], i: number): Promise<ExamQuestion> {
    const other = jobs.filter((x, k) => k !== i && x.focus).map((x) => x.focus)
    const base = `${context}
${job.kind === 'zusammenhang' ? `Frühere Sessions von ${nm()}:\n${linked.join('\n')}` : `Schwerpunkt dieser Aufgabe: ${job.focus} – gibt der Schwerpunkt keinen Mechanismus her, nimm das Kernprinzip der Session.${other.length ? ` Eine andere Aufgabe des Tests behandelt „${other.join('“, „')}“ – nimm einen anderen Mechanismus.` : ''}`}`
    let best: { q: ExamQuestion; flaws: number } | undefined
    let note = ''
    for (let n = 0; n < 2; n++) {
      const draft = parseJson<Raw>(await complete(system(job.typ), base + note, 2500, schema(job.typ)))
      const q = toQuestion(job.kind, draft)
      let v: { wiedergabe?: boolean; verraten?: boolean; sachfehler?: boolean; ohne_bezug?: boolean; grund?: string } = {}
      try {
        v = parseJson(
          await complete(
            judgeSystem(job.typ),
            `THEMA: ${dayLine(d)}\n\nMerksatz: ${draft.merksatz ?? ''}\nMaterial:\n${q.material}\nAufgabe: ${q.q}\nMusterantwort: ${q.solution}`,
            400,
            judgeSchema(job.typ),
          ),
        )
      } catch {
        // ohne Urteil gilt der Entwurf
      }
      const flaws = [v.wiedergabe, v.verraten, v.sachfehler, v.ohne_bezug].filter(Boolean).length
      if (!best || flaws < best.flaws) best = { q, flaws }
      if (!flaws) break
      note = `\n\nDein letzter Entwurf wurde verworfen: ${v.grund || 'Wiedergabe statt Verständnis'}\nVerworfene Aufgabe: ${q.q}\nBaue einen grundlegend anderen Fall, der diesen Mangel nicht hat.`
    }
    return verify(best!.q)
  }

  // Zum Schluss die Musterantwort nachrechnen – der einzige Schritt im Denkmodus, mit kleinstem Kontext (~10 s).
  // Der Entwurf behauptet sonst gelegentlich Falsches („2,5 % ist höher als 3 %“), und daran wird die Antwort gemessen.
  async function verify(q: ExamQuestion): Promise<ExamQuestion> {
    try {
      const r = parseJson<{ kriterien?: string[]; solution?: string }>(
        await complete(
          `Du prüfst die Musterantwort einer Testaufgabe auf sachliche Richtigkeit. Antworte NUR mit JSON.
Rechne nach und vergleiche jede Aussage mit dem Material und dem Stand des Fachs: Zahlen, Größer/Kleiner, Richtung von Ursache und Wirkung, Fachbegriffe. Korrigiere nur, was falsch ist oder dem Material widerspricht – Umfang, Stil und alles Richtige bleiben, wie sie sind.
- fehler: was falsch war, in einem Satz ("" wenn nichts).
- kriterien: die 2–3 Begründungsschritte, korrigiert.
- solution: die Musterantwort, korrigiert (2–4 Sätze).`,
          `THEMA: ${dayLine(d)}\nMaterial:\n${q.material}\nAufgabe: ${q.q}\nBegründungsschritte:\n${q.criteria.map((k) => `- ${k}`).join('\n')}\nMusterantwort: ${q.solution}`,
          4000,
          { ...jsonSchema('korrektur', { fehler: str, kriterien: { type: 'array', items: str }, solution: str }), chat_template_kwargs: { enable_thinking: true } },
        ),
      )
      const criteria = Array.isArray(r.kriterien) ? r.kriterien.filter((k) => typeof k === 'string' && k.trim()).slice(0, 3) : []
      return typeof r.solution === 'string' && r.solution.trim() ? { ...q, solution: r.solution.trim(), criteria: criteria.length ? criteria : q.criteria } : q
    } catch {
      return q
    }
  }
  let ready = 0
  return Promise.all(
    jobs.map((j, i) =>
      one(j, i)
        .catch(() => one(j, i))
        .then((q) => {
          onProgress?.(++ready)
          return q
        }),
    ),
  )
}

export async function gradeExam(day: number, q: ExamQuestion, answer: string): Promise<Pick<ExamAnswer, 'verdict' | 'precision' | 'feedback'>> {
  const d = getDay(day)
  const system = `${persona()}

Aufgabe: EINE Antwort im Kurztest bewerten. Antworte NUR mit JSON.
Bewertet wird die Begründung, nicht die Schlussfolgerung allein. Maßstab sind die Begründungsschritte; eine andere, sachlich richtige Herleitung zählt genauso. Formulierung, Fachbegriffe und Länge sind egal – auch kurz und umgangssprachlich zählt, wenn der Gedanke da ist.
- verdict: "richtig" = die entscheidenden Schritte sind da (ein Nebenpunkt darf fehlen) · "teilweise" = richtige Richtung oder richtiges Ergebnis, aber der Mechanismus fehlt, oder nur ein Teil der Schritte · "falsch" = die Begründung trägt nicht oder führt in die falsche Richtung · "offen" = keine Antwort („keine Ahnung“, „?“).
  Wer nur einen Merksatz aufsagt, ohne ihn auf den Fall zu beziehen, bekommt höchstens "teilweise".
- precision: 1 (vage) bis 5 (präzise, Begriffe korrekt).
- feedback: höchstens 3 kurze Sätze, zusammen höchstens 50 Wörter, direkt an ${nm()} (du). Bei richtig: der Gedanke, der die Antwort trägt, und – falls einer fehlte – der Nebenpunkt. Sonst: welcher Schritt fehlt oder nicht stimmt, und wie er lautet. Gleich mit dem Inhalt beginnen – kein Lob, keine Ankündigung, keine Wiederholung der Aufgabe, kein ✅/❌.`
  const user = `THEMA: ${dayLine(d)}
Fall:
${q.material || '(keiner)'}
Aufgabe: ${q.q}
Begründungsschritte:
${q.criteria.map((k) => `- ${k}`).join('\n') || '(keine – Musterantwort nehmen)'}
Musterantwort: ${q.solution}

Antwort von ${nm()}: ${answer}`
  const text = await complete(system, user, 800, jsonSchema('bewertung', { verdict: { type: 'string', enum: ['richtig', 'teilweise', 'falsch', 'offen'] }, precision: { type: 'integer', minimum: 1, maximum: 5 }, feedback: str }))
  const r = parseJson<Partial<ExamAnswer>>(text)
  if (!r.verdict || !(r.verdict in VERDICT_SCORE)) throw new ApiError('Unvollständige Antwort – bitte erneut versuchen.')
  return { verdict: r.verdict, precision: Math.min(5, Math.max(1, Math.round(Number(r.precision)) || 3)), feedback: typeof r.feedback === 'string' ? r.feedback.trim() : '' }
}

// ---------- Grundwiederholung ----------

/** Lehrplan-Ausschnitt eines Fachs bis zur bekannten Jahrgangsstufe */
function fachLines(f: Fach, max: number): string {
  return topicsUpTo(f, max).map(([g, t]) => `  Jgst. ${g}: ${t.join(' · ')}`).join('\n')
}

export function basisChat(n: BasisNode, history: ChatMsg[], onText: (t: string) => void) {
  const s = getState()
  const max = knownUpTo(s.level)
  const mix = n.fach === 'mix'
  const faecher = mix ? FAECHER.filter((f) => n.days.some((d) => DAY_FACH[d] === f.id)) : [fach(n.fach as FachId)]
  const what =
    n.variant === 'start'
      ? `Grundwiederholung ${faecher[0].name} zu Beginn des Lernplans: Vorwissen aktivieren und Lücken finden, bevor Neues darauf aufbaut.`
      : n.variant === 'auffrischung'
        ? 'Auffrischung der Grundwiederholung zur Hälfte des Lernplans (verteiltes Wiederholen): Schulstoff aller Fächer gemischt, verknüpft mit dem inzwischen gelernten neuen Stoff.'
        : 'Abschluss-Check des Grundwissens am Ende des Lernplans: Schulstoff aller Fächer gemischt, verknüpft mit allem, was in den 90 Tagen dazukam.'
  const done = DAYS.filter((d) => dayState(s, d.day).status === 'fertig')
  const system = `${persona()}

Aufgabe: ${what}
Grundlage ist der bayerische LehrplanPLUS (Gymnasium) bis einschließlich Jahrgangsstufe ${max}:
${faecher.map((f) => `- ${f.name}:\n${fachLines(f, max)}`).join('\n')}

Zugehörige Sessions im Lernplan (zum Vertiefen bei Lücken):
${n.days.map((d) => `- ${dayLine(getDay(d))} – ${getDay(d).subtopics.join(' · ')}`).join('\n')}

Regeln:
- ${mix ? '6' : '4–6'} Fragen, IMMER nur EINE Frage pro Nachricht, dann auf die Antwort warten. Format „**Frage 2/5:** …“.
- Quer über die Jahrgangsstufen und Lernbereiche; Kernwissen und Zusammenhänge statt Details, Einordnen auf Zeitstrahl/Karte.
- ${UNDERSTAND}
${mix ? '- Jede Frage verknüpft mindestens zwei Fächer oder Schulstoff mit einer neuen Session.\n' : ''}- ${adapt()}
- Nach jedem Antwortversuch beginnt deine Nachricht in der ersten Zeile mit genau einem Marker:
  [[BEWERTUNG: richtig | P]] oder [[BEWERTUNG: teilweise | P]] oder [[BEWERTUNG: falsch | P]]  (P = Präzision 1–5)
- Danach kurz bewerten (✅ / 🟡 / ❌). Bei Fehlern kurz erklären, dann eine Nachfrage zum GLEICHEN Punkt. ${FOLLOW_UP}
- Zum Schluss: Fazit als Tabelle „Lernbereich | sitzt / Lücke“, und für jede Lücke die passende Session nennen („→ <Titel der Session> öffnen“). Dann in die letzte Zeile exakt: ${DONE_MARKER}
- Schreibe ${DONE_MARKER} niemals vorher.
${done.length ? `\nBereits abgeschlossene Sessions (für Verknüpfungen):\n${done.map((d) => `- ${dayLine(d)}`).join('\n')}` : ''}`
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
  // was nicht sass, ausdruecklich auflisten – darauf liegt das Gewicht
  const missed = parseCheck(ds.check)
    .filter((q) => q.verdict && q.verdict !== 'richtig')
    .map((q) => `- [${q.verdict === 'offen' ? 'nicht gewusst' : q.verdict}] ${clip(q.question, 400)}\n  Antwort: ${clip(q.answer, 400)}`)
  const sheet = !isBlockMix(d) && hasSheet(day) ? await loadSheet(day).catch(() => '') : ''
  const own = !!(ds.questions?.length || ds.notes || videoNotesText(getState(), day))

  // Julius (26.10.2026): schematisch das Ganze, ausfuehrlich nur das Nicht-Gekonnte – den Rest hat der feste Lernzettel
  const system = `${persona()}

Erstelle nach der abgeschlossenen Session die persönliche Zusammenfassung und Karteikarten. Antworte NUR mit JSON.

summary_markdown – Stichpunkte und eine Grafik, kein Fließtext, keine Einleitung, kein Titel:
## Überblick
EIN Schema der ganzen Session als Codeblock in einer dieser Formen (Beschriftungen höchstens 6 Wörter, „Titel | Zusatz“ = Zusatz klein darunter):
\`\`\`baum        Hierarchie, Einrückung mit 2 Leerzeichen
\`\`\`kette       je Zeile ein Schritt; „→ Text“ beschriftet den Pfeil davor
\`\`\`gruppen     Zeile ohne Einrückung = Kastentitel, eingerückte Zeilen = Inhalt
\`\`\`zeitstrahl  je Zeile „Zeit | Ereignis“
Nur Gerüst und Zusammenhänge, keine Details – die stehen ${sheet ? 'im Lernzettel' : 'in den Videos'}.
## Nicht gesessen
Je Punkt, der im Verständnischeck falsch, teilweise oder nicht gewusst war (Liste unten), der Kernbegriff fett und darunter die richtige Erklärung: so ausführlich wie nötig, damit ${nm()} es versteht, so knapp wie möglich (2–5 Stichpunkte, bei Bedarf ein Beispiel oder ein Merksatz mit „> “). Was in der Antwort schon stimmte, nicht wiederholen. Ist nichts offen, nur: Alles saß.
${own ? `## Deine Fragen und Notizen
Nur was über den Lernzettel hinausgeht: je Frage oder Notiz eine Zeile mit Kernantwort bzw. Einordnung. Weglassen, was oben schon steht.
` : ''}${d.evidence ? '## Evidenz\nNur falls im Check strittig: belegt vs. Hype, je 1 Zeile.\n' : ''}
Sonst nichts aus dem Lernzettel wiederholen. Keine Tabellen.

cards – 4–8 Karteikarten für Spaced Repetition: vor allem zu den nicht gesessenen Punkten, dazu 1–2 zum Kern der Session. Fragen, die Verständnis prüfen (Warum/Was wäre wenn/Zusammenhang), Antworten in 1–3 Sätzen.`

  const user = `${sessionContext(d)}
${sheet ? `\n## Lernzettel (hat ${nm()} schon)\n${clip(sheet, 9000)}\n` : ''}
## Nicht gesessen im Verständnischeck
${missed.join('\n') || '(nichts – alles richtig)'}
${transcript('Eigene Fragen', ds.questions)}
${transcript('Verständnischeck', ds.check)}`

  const text = await complete(system, user, 8000, {
    chat_template_kwargs: { enable_thinking: false },
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'zusammenfassung',
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
  const done = DAYS.filter((d) => dayDone(s, d.day)).length
  const system = `${persona()}

Du berätst ${nm()}, worin die Stärken liegen und welche Themen liegen. SEHR KURZ, höchstens 6 Zeilen, keine Einleitung:
- 2–3 Zeilen nach dem Muster „**Bereich**: x % richtig, Ø y s, Präzision z/5“ – nur die auffälligsten (stark und schwach).
- 1 Zeile: Abgleich mit der Selbsteinschätzung („gefallen“) – wo Können und Gefallen zusammenpassen, wo nicht.
- 1 Zeile „Deshalb könnte dir … liegen“ mit 1–2 konkreten Vertiefungsrichtungen – bevorzugt dort, wo gut UND gern zusammenkommen.
- 1 Zeile: Alternative – breit weitermachen mit gefächertem Allgemeinwissen, und wann das sinnvoller wäre.
Stütze dich nur auf die Zahlen und die Selbsteinschätzung. Wenig Daten? Dann sag das in einem Halbsatz.`
  const user = `Abgeschlossene Sessions: ${done}/90\nKennzahlen je Überthema:\n${statsTable(s) || '(noch keine Daten)'}\nSelbsteinschätzung, was gefallen hat:\n${likesTable(s) || '(nicht angegeben)'}`
  return complete(system, user, 900)
}

// ---------- Community-Chat ----------

export function channelChat(area: AreaId | null, history: { author: 'ich' | 'ki'; text: string }[], onText: (t: string) => void) {
  const topic = area ? `Kanal „${AREAS[area].name}“ – nur Themen aus diesem Bereich.` : 'Allgemeiner Kanal oder Direktnachricht – alle Themen des Lernplans.'
  const system = `${persona()}

Du bist im Themen-Chat der App als „KI“ dabei. ${topic}
Antworte wie in einem Chat: kurz (max. 6 Zeilen), locker, sachlich korrekt. Verweise nur auf Sessions aus dieser Liste und nenne sie nur beim Titel (ohne Nummer, Kürzel oder Klammern), erfinde keine:
${DAYS.filter((d) => !area || d.area === area).map((d) => `- ${d.title}`).join('\n')}`
  const msgs: ChatMsg[] = history.slice(-20).map((m) => ({ role: m.author === 'ich' ? 'user' : 'assistant', content: m.text }))
  return streamChat(system, msgs, onText, 1500)
}

/** Mit Server: Antwort schreibt die Edge Function "ki-chat" (liest den Verlauf selbst, speichert als KI) */
export async function channelChatCloud(area: AreaId | null, channel: string, to: string | undefined, onText: (t: string) => void): Promise<CloudMsg> {
  const fn = await functionCall('ki-chat')
  if (!fn) throw new ApiError('Für die KI bitte anmelden.')
  const titles = DAYS.filter((d) => !area || d.area === area).map((d) => d.title)
  let res: Response
  try {
    res = await fetch(fn.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...fn.headers },
      body: JSON.stringify({ channel, to, topic: area ? AREAS[area].name : '', titles }),
    })
  } catch {
    throw new ApiError('Keine Verbindung zum KI-Server.')
  }
  if (res.status === 404) throw new ApiError('KI im Austausch ist auf dem Server noch nicht eingerichtet (Edge Function „ki-chat“ fehlt).', 404)
  if (!res.ok) throw new ApiError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? `KI-Fehler ${res.status}`, res.status)
  let saved = null as CloudMsg | null
  let failed = ''
  await readStream(res, onText, (e) => {
    if (e.saved) saved = e.saved as CloudMsg
    if (typeof e.error === 'string') failed = e.error
  }).catch((e) => {
    if (!failed) throw e
  })
  if (failed) throw new ApiError(failed)
  if (!saved) throw new ApiError('Antwort konnte nicht gespeichert werden.')
  return saved
}

export function describeError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}
