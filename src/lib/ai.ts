import { ALL_DAYS, AREAS, BLOCKS, DAYS, getDay, isBlockMix, isProject, type AreaId, type Day } from '../data/plan'
import { STAGES, type Stage } from '../data/deep'
import { FAECHER, fach, topicsUpTo, type Fach, type FachId } from '../data/lehrplan'
import { blockName, DAY_FACH, isRepeat, knownUpTo, levelLabel, SCHOOL_GRADE } from '../data/school'
import type { BasisNode } from './path'
import { functionCall, kiProxy, type CloudMsg } from './cloud'
import { examLinks, examPlan } from './exam'
import { checkNotes, dayDone, DONE_MARKER, likesTable, parseCheck, statsTable, VERDICT_SCORE } from './stats'
import { hasSheet, loadSheet } from '../data/lernzettel'
import { dayState, examState, getState, updateExam, videoNotesText, videosOf, type ChatMsg, type ExamAnswer, type ExamAnalysis, type ExamBridge, type ExamMechanism, type ExamQuestion } from './store'

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

// Test statt Chat (Julius, 15.11.2026): nicht noch einmal das ganze Thema pruefen, sondern ob die Mechanismen sitzen und
// sich anwenden lassen, plus ein Zusammenhang zu einer frueheren Session (nur um eine Ecke). Kein Fliesstext: die Aufgabe
// 1–3 Saetze, den Fall traegt das Material daneben (Stichpunkte, Tabelle, Diagramm).

const EXAM_DIAGRAMS = `\`\`\`kette       je Zeile ein Schritt (Kasten), die Pfeile entstehen von selbst; eine Lücke ist ein eigener Schritt „?“
\`\`\`kreis       Kreislauf, je Zeile eine Station
\`\`\`zeitstrahl  je Zeile „Zeit | Ereignis“
\`\`\`baum        Hierarchie, Einrückung mit 2 Leerzeichen
\`\`\`gruppen     Zeile ohne Einrückung = Kastentitel, eingerückte Zeilen = Inhalt (gut für Fall A / Fall B)
\`\`\`pyramide    Stufen von oben nach unten
\`\`\`balken      je Zeile „Name: Zahl | Anzeige“
\`\`\`kurve       Zeilen „x: Achse“, „y: Achse“, dann Reihen „Name: x y, x y, x y“ (nur Zahlen)`

const str = { type: 'string' }
const strs = { type: 'array', items: str }

function jsonSchema(name: string, properties: Record<string, unknown>, think = false) {
  return {
    chat_template_kwargs: { enable_thinking: think },
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
    // eine Anzeige ohne Buchstaben/Ziffern („| ▏“) waere nur Muell neben dem Balken
    const clean = ls.map((l) => l.replace(/\s*\|\s*[^\p{L}\p{N}]*$/u, ''))
    return numbers ? '```' + kind + '\n' + clean.join('\n') + '\n```' : '```gruppen\n' + ls.map((l) => l.trim().replace(/:\s*/, ' | ')).join('\n') + '\n```'
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

// Geruest der Erzeugung (Julius, 20.11.2026: nicht vorab schreiben, sondern das Geruest verbessern, nach dem die KI den
// Test baut; anspruchsvoller, gern etwas mehr Text). Vorher hat das Modell Fall und Haken frei erfunden – daher schiefe
// Faelle („der Nil fliesst durch das Amazonasbecken“) und verkleidete Merksaetze. Jetzt in drei Stufen:
// 1. Analyse der Session (einmal je Session, in exams[day].analysis zwischengespeichert): 3–4 Mechanismen als Kette von
//    Ursache und Wirkung, je mit Voraussetzungen, typischer Fehlvorstellung, nicht offensichtlicher Folge und echten Faellen
//    ausserhalb des Lernzettels; dazu je verknuepfter Session die direkte Verbindung (ein Schritt).
// 2. Je Aufgabe ein anderer Mechanismus und ein Typ, der an genau ein Element der Analyse andockt (Grenzfall ← Voraussetzung,
//    Fehler im Plan ← Fehlvorstellung, Befund ← nicht offensichtliche Folge, Stoerung ← Kette + echter Fall, Bruecke ← staerkste
//    Verbindung). Der Kontext ist klein (nur dieser Mechanismus). Kein Denkmodus: damit kam beim Bau kaputtes JSON.
// 3. Fall und Musterantwort nachrechnen – ohne Denkmodus, aber mit ausgeschriebener Pruefung als erstem JSON-Feld
//    (im Denkmodus dachte das Modell hier ueber 6000 Tokens und brach ab, ~40 s ohne Ergebnis).

const EXAM_LEVEL = `Anspruch: Verständnis, nicht Gedächtnis – lieber zu schwer als zu leicht. Die Lösung braucht ZWEI Denkschritte, die nirgends stehen: (1) im Fall erkennen, welches Glied der Kette betroffen ist bzw. welche Voraussetzung fehlt, (2) daraus die Folge über mindestens ein weiteres Glied bis zu einem sichtbaren oder messbaren Ergebnis ableiten. Wer nur Merksätze und Fachbegriffe kennt, liegt daneben oder bleibt stecken. Wer den Mechanismus verstanden hat, kommt in zwei bis drei Minuten Nachdenken drauf und antwortet in 3–6 Sätzen.`

const EXAM_TYPES = {
  grenzfall: {
    anker: 'Voraussetzungen',
    regel: `Grenzfall. Eine echte Situation, auf die der Mechanismus auf den ersten Blick passt, in der aber eine seiner Voraussetzungen (aus der Analyse) nicht erfüllt ist – deshalb läuft es anders. Im Material beruft sich eine Person mit einem wörtlichen Satz auf die Regel und zieht daraus eine Vorhersage – die im Normalfall RICHTIG wäre (korrekte Richtung von Ursache und Wirkung); falsch wird sie nur, weil in diesem Fall die Voraussetzung fehlt. Aufgabe: Trifft ihre Vorhersage ein? Was passiert stattdessen, und warum? Die fehlende Voraussetzung wird nirgends genannt, nur der Fall zeigt sie.`,
    beispiel: `Thema Angebot und Nachfrage – material: „- Stadion mit 40 000 Plätzen, Karten bisher zu 60 €, jedes Spiel nach vier Minuten ausverkauft\n- Auf dem Zweitmarkt gehen die Karten für 200–250 € weg\n- Die Warteliste für Dauerkarten ist acht Jahre lang\n- Der Geschäftsführer: ‚Höhere Preise senken die Nachfrage. Wenn wir auf 120 € gehen, verkaufen wir nur noch halb so viele Karten – das lohnt sich nicht.‘“, q: „Trifft seine Vorhersage ein? Begründe, wie viele Karten bei 120 € verkauft würden und wer bisher die Differenz zum Marktpreis einstreicht.“`,
  },
  plan: {
    anker: 'Fehlvorstellung',
    regel: `Fehler im Plan. Jemand handelt nach der typischen Fehlvorstellung (aus der Analyse) – oder wendet die richtige Regel an, verletzt aber eine Voraussetzung. Der Plan klingt vernünftig und macht einiges richtig; Material: Ausgangslage, Plan und das enttäuschende Ergebnis nach einiger Zeit (mit Zahlen). Aufgabe: Woran ist der Plan gescheitert – über welchen Weg genau? – und welche EINE Änderung hätte am meisten gebracht? Kein Strohmann, der einfach alles falsch macht.`,
    beispiel: `Thema Preisbildung – material: „- Eine Stadt deckelt alle Mieten auf 8 € je m², die Marktmiete liegt bei 12 €\n- Ziel: Wohnen soll für Familien bezahlbar bleiben\n- Nach fünf Jahren: Wer schon eine Wohnung hat, zahlt deutlich weniger\n- Die Wartelisten der Wohnungsbaugesellschaften sind doppelt so lang\n- Neubau: von 2400 auf 600 Wohnungen im Jahr gesunken“, q: „Jede einzelne Wohnung ist billiger geworden. Erkläre, über welche Schritte trotzdem weniger Familien eine Wohnung finden – und welche Maßnahme an der Ursache angesetzt hätte.“`,
  },
  befund: {
    anker: 'nicht offensichtliche Folge',
    regel: `Überraschender Befund. Eine kleine Markdown-Tabelle (2–4 Zeilen, Zahlen, die nach dem Fachwissen wirklich so herauskämen; keine echte Studie behaupten) plus 1–3 Stichpunkte Kontext. Das Muster zeigt die nicht offensichtliche Folge aus der Analyse: zwei Verläufe kreuzen sich, ein Vorteil kehrt sich um, mehr Aufwand bringt weniger, eine Maßnahme wirkt nur bei einer Gruppe. NICHT: Die Gruppe mit der Lehrbuch-Methode ist einfach besser. Aufgabe: das ganze Muster – jede Auffälligkeit der Tabelle – mit EINEM Mechanismus erklären und daraus etwas vorhersagen, das nicht in der Tabelle steht.`,
    beispiel: `Thema Evolution – material: „| | resistente Infektionen 2019 | 2024 |\n|---|---|---|\n| Klinik A: Antibiotika vorsorglich für alle Patienten | 4 % | 19 % |\n| Klinik B: Antibiotika nur bei nachgewiesener Infektion | 5 % | 7 % |\n\n- Beide Kliniken behandeln ähnliche Patienten, Klinik A hatte 2019 weniger Infektionen insgesamt“, q: „Klinik A behandelt gründlicher und hat am Ende mehr unbehandelbare Infektionen. Erkläre, wie das zustande kommt, und sag voraus, wie sich die Zahlen entwickeln, wenn Klinik A 2025 auf die Praxis von Klinik B umstellt.“`,
  },
  stoerung: {
    anker: 'Kette und echte Fälle',
    regel: `Störung im Ablauf. Einer der echten Fälle aus der Analyse (oder ein ähnlich echter): An EINEM Glied der Kette ist etwas gestört – fällt aus, ist blockiert, läuft zu schnell, kommt zu früh. Der Fall muss so in der Wirklichkeit vorkommen (Krankheit, Gift, Unfall, politischer Eingriff, Naturereignis, Experiment) – nichts Unmögliches. Material: die Situation und was man von außen beobachtet; welches Glied gestört ist, steht NICHT da. Aufgabe: Welches Glied ist betroffen, und wie führt das über die weiteren Glieder zu dem, was man beobachtet? Optional: Was würde helfen und warum?`,
    beispiel: `Thema Zellatmung – material: „- Feuerwehrleute bergen einen Mann aus einem verrauchten Haus, er hatte Blausäure (Cyanid) eingeatmet\n- Er atmet schnell, das Blut in seinen Venen ist auffallend hellrot\n- Die Sauerstoffsättigung im Blut liegt bei 99 %\n- Der Laktatwert im Blut ist stark erhöht“, q: „Sein Blut ist voller Sauerstoff, trotzdem droht er zu ersticken. Erkläre, wo Cyanid eingreift und wie es zu hellrotem Venenblut und hohem Laktat kommt.“`,
  },
  bruecke: {
    anker: 'Verbindung',
    regel: `Zusammenhang mit einer früheren Session – nur um eine Ecke, EIN Schritt. Über dem Material steht schon der Satz aus der früheren Session (frueher, siehe unten). material = NUR die heutige Seite: EIN echter Fall oder eine Beobachtung, in der „heute“ steckt, mit Zahlen oder konkreten Details, ohne den Verbindungsschritt zu nennen – kein Experiment mit zwei Gruppen, kein Vorher-nachher zweier Lernmethoden. Aufgabe: Mit dem Früheren erklären, warum das Heutige so ist – und daraus etwas für den Fall vorhersagen oder entscheiden. Lose Analogien und Wortgleichheit zählen nicht.`,
    beispiel: `Thema Inflation, frühere Session Angebot und Nachfrage – frueher: „Ein Preis steigt, wenn die Nachfrage schneller wächst als das Angebot.“, material: „- Ein Staat zahlt jedem Haushalt einmalig 3000 € aus\n- Fabriken und Handwerker sind seit Monaten ausgebucht, Lieferzeiten für Möbel: 6 Monate\n- Ein halbes Jahr später kosten Alltagswaren 9 % mehr, die verkaufte Menge ist kaum gestiegen“, q: „Erkläre, warum das Geschenk vor allem die Preise erhöht hat statt den Wohlstand – und unter welcher Bedingung die gleiche Auszahlung mehr Güter statt höherer Preise gebracht hätte.“`,
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

/** Version der Analyse – bei Änderungen am Analyse-Prompt erhöhen, dann wird neu analysiert */
const ANALYSIS_V = 1

const mechText = (m: ExamMechanism) =>
  `Mechanismus „${m.name}“
Kette: ${m.kette.join(' → ')}
Voraussetzungen: ${m.voraussetzungen.join(' · ')}
Fehlvorstellung: ${m.fehlvorstellung}
Nicht offensichtliche Folge: ${m.folge}
Echte Fälle: ${m.faelle.join(' · ')}`

/** Analyse schon beim Öffnen der Testseite anstoßen, damit „Test starten“ nur noch die Aufgaben baut */
export function prepareExam(day: number): void {
  examAnalysis(day).catch(() => {
    // beim Start wird es erneut versucht und der Fehler dort gezeigt
  })
}

let analysing: { day: number; p: Promise<ExamAnalysis> } | undefined

/** Stufe 1: Analyse der Session – einmal je Session (und je Stand der gelernten Verknüpfungen), danach aus dem Zustand */
function examAnalysis(day: number): Promise<ExamAnalysis> {
  // läuft schon (vom Öffnen der Seite) → nicht doppelt anfragen
  if (analysing?.day === day) return analysing.p
  // ein zweiter Versuch: die lange JSON-Antwort ist gelegentlich kaputt
  const p = runAnalysis(day)
    .catch(() => runAnalysis(day))
    .finally(() => {
      if (analysing?.p === p) analysing = undefined
    })
  analysing = { day, p }
  return p
}

async function runAnalysis(day: number): Promise<ExamAnalysis> {
  const d = getDay(day)
  const s = getState()
  const links = examLinks(s, day).slice(0, 3)
  const key = `${ANALYSIS_V}:${links.map((l) => l.day.day).join(',')}`
  const cached = examState(s, day).analysis
  if (cached?.key === key && cached.data.mechanismen.length) return cached.data

  const sheet = hasSheet(day) ? await loadSheet(day).catch(() => '') : ''
  const linked = await Promise.all(
    links.map(async (l) => {
      const txt = hasSheet(l.day.day) ? await loadSheet(l.day.day).catch(() => '') : ''
      return `- ${l.day.title} – ${l.day.subtopics.join(' · ')}${txt ? `\n  Auszug Lernzettel: ${clip(txt.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, ' '), 1500)}` : ''}`
    }),
  )
  const system = `${persona()}

Aufgabe: Eine Session analysieren, damit daraus später anspruchsvolle Verständnisaufgaben gebaut werden. Antworte NUR mit JSON. Nur gesichertes Fachwissen – was du nicht sicher weißt, lässt du weg.

mechanismen: die 3–4 wichtigsten Mechanismen der Session – Dinge, die über Ursache und Wirkung funktionieren (Prozesse, Regelkreise, Gesetzmäßigkeiten, Anreize, Wechselwirkungen), keine Fakten oder Definitionen. Hat das Thema eher Fakten (z. B. Geografie, Epochen), nimm die Ursachen dahinter (warum ist das Klima dort so, warum kam es zu …). Je Mechanismus:
- name: 2–5 Wörter
- kette: 3–5 Glieder von der Ursache bis zur sichtbaren Wirkung, je ein kurzer Satz
- voraussetzungen: 2–3 Bedingungen, ohne die der Mechanismus nicht oder anders abläuft (die man leicht übersieht)
- fehlvorstellung: was jemand mit Halbwissen typischerweise glaubt oder falsch macht – und warum es falsch ist (1–2 Sätze)
- folge: eine nicht offensichtliche, aber gesicherte Folge – etwas, das der ersten Erwartung widerspricht (Umkehrung, Zielkonflikt, Schwelle, Nebenwirkung)
- faelle: 3 echte, konkrete Situationen, in denen der Mechanismus wirkt oder gestört ist – aus Alltag, Medizin, Technik, Geschichte, Politik, anderen Ländern; NICHT die Beispiele aus dem Lernzettel; jede in einem Satz mit konkretem Detail
bruecken: je frühere Session (Liste unten) die direkteste sachliche Verbindung zum heutigen Thema, EIN Schritt:
- session: Titel der früheren Session, genau wie in der Liste
- frueher: EIN konkreter Mechanismus oder eine Tatsache von dort, als ein Satz mit Ursache und Wirkung (keine Aufzählung, kein Oberbegriff wie „hängt von vielen Faktoren ab“), ohne das heutige Thema zu nennen
- heute: das konkrete Phänomen im heutigen Thema, das dadurch erklärt wird
- schritt: wie das eine das andere erklärt (1–2 Sätze)
- staerke: 3 = das Frühere ist Ursache/Voraussetzung des Heutigen, 2 = derselbe Mechanismus wirkt in beiden, 1 = nur lose verwandt oder Analogie (Lernen als „Preis“, Gedächtnis als „Markt“ u. ä. = 1)
${links.length ? '' : '(keine früheren Sessions – bruecken leer lassen)'}`
  const user = `THEMA: ${dayLine(d)}
Teilthemen: ${d.subtopics.join(' · ')}
${sheet ? `\nLernzettel:\n${clip(sheet, 8000)}\n` : ''}
Frühere Sessions:
${linked.join('\n') || '(keine)'}`
  const r = parseJson<{ mechanismen?: Partial<ExamMechanism>[]; bruecken?: (Partial<ExamBridge> & { session?: string })[] }>(
    await complete(
      system,
      user,
      5000,
      jsonSchema('analyse', {
        mechanismen: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'kette', 'voraussetzungen', 'fehlvorstellung', 'folge', 'faelle'],
            properties: { name: str, kette: strs, voraussetzungen: strs, fehlvorstellung: str, folge: str, faelle: strs },
          },
        },
        bruecken: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['session', 'frueher', 'heute', 'schritt', 'staerke'],
            properties: { session: str, frueher: str, heute: str, schritt: str, staerke: { type: 'integer', minimum: 1, maximum: 3 } },
          },
        },
      }),
    ),
  )
  const list = (x: unknown) => (Array.isArray(x) ? x.filter((y): y is string => typeof y === 'string' && !!y.trim()).map((y) => y.trim()) : [])
  const text = (x: unknown) => (typeof x === 'string' ? x.trim() : '')
  const short = (t: string) => t.split(/[:(]/)[0].trim()
  const data: ExamAnalysis = {
    mechanismen: (Array.isArray(r.mechanismen) ? r.mechanismen : [])
      .map((m) => ({ name: text(m.name), kette: list(m.kette), voraussetzungen: list(m.voraussetzungen), fehlvorstellung: text(m.fehlvorstellung), folge: text(m.folge), faelle: list(m.faelle) }))
      .filter((m) => m.name && m.kette.length >= 2)
      .slice(0, 4),
    bruecken: (Array.isArray(r.bruecken) ? r.bruecken : [])
      .map((b) => {
        const l = links.find((x) => text(b.session).includes(short(x.day.title)) || short(x.day.title).includes(short(text(b.session))))
        return l && text(b.frueher) && text(b.heute) ? { tag: l.day.day, frueher: text(b.frueher), heute: text(b.heute), schritt: text(b.schritt), staerke: Math.min(3, Math.max(1, Number(b.staerke) || 1)) } : null
      })
      .filter((b): b is ExamBridge => !!b)
      .sort((a, b) => b.staerke - a.staerke),
  }
  if (!data.mechanismen.length) throw new ApiError('Analyse unvollständig – bitte erneut versuchen.')
  updateExam(day, (e) => ({ ...e, analysis: { key, data } }))
  return data
}

/** Test erzeugen: Analyse (zwischengespeichert, beim Öffnen der Seite angestoßen) → je Aufgabe Bau → Prüfung; alle Aufgaben gleichzeitig (~15 s) */
export async function makeExam(day: number, onProgress?: (ready: number) => void): Promise<ExamQuestion[]> {
  const d = getDay(day)
  const s = getState()
  const ex = examState(s, day)
  const plan = examPlan(s, day)
  const weak = checkNotes(dayState(s, day).check).weak
  const a = await examAnalysis(day)

  // Vielfalt legt der Code fest: je Aufgabe ein anderer Mechanismus und ein anderer Typ; die Brücke nimmt die stärkste Verbindung
  const mechs = shuffle(a.mechanismen)
  const types = shuffle<ExamType>(['grenzfall', 'plan', 'befund', 'stoerung'])
  const bridge = a.bruecken.find((b) => b.staerke >= 2) ?? a.bruecken[0]
  // gibt die Analyse keine brauchbare Verbindung her, wird die Brücke zu einer weiteren Anwenden-Aufgabe (Anzahl bleibt wie angekündigt)
  const jobs = plan
    .map((k) => (k === 'zusammenhang' && !bridge ? ('anwenden' as const) : k))
    .map((kind, i) => ({ kind, typ: kind === 'zusammenhang' ? ('bruecke' as const) : types[i % types.length], mech: mechs[i % mechs.length] }))

  const short = (t: string) => t.split(/[:(]/)[0].trim()
  const system = (typ: ExamType) => `${persona()}

Aufgabe: EINE Aufgabe für einen Test bauen. ${nm()} hat das Thema vor einiger Zeit ausführlich gelernt (Videos, Lernzettel, Verständnischeck). Antworte NUR mit JSON.

${EXAM_LEVEL}

Typ der Aufgabe – halte dich genau an diese Bauvorschrift:
${EXAM_TYPES[typ].regel}
Beispiel für Typ, Umfang und Niveau (anderes Thema, nicht übernehmen): ${EXAM_TYPES[typ].beispiel}

Felder:
- haken: welche zwei Denkschritte die Lösung braucht und warum der Merksatz allein nicht reicht (für dich, wird nicht gezeigt).
- material: der Fall neben der Aufgabe, 50–110 Wörter – kein Fließtext, sondern 3–6 Stichpunkte als Markdown-Liste, bei Zahlen dazu eine kleine Markdown-Tabelle; ein Ablauf auch als Codeblock:
${EXAM_DIAGRAMS}
  Echt oder genau so möglich: konkrete Orte, Personen, Zahlen in realistischen Größenordnungen, nichts physikalisch, biologisch oder historisch Unmögliches. Nicht aus dem Lernzettel. Das Material beschreibt nur, was jemand tut, sagt oder misst – es nennt weder den Mechanismus noch seinen Fachbegriff noch die Begründung und bewertet nichts.
- q: die Aufgabe, 1–3 Sätze, höchstens 45 Wörter. Sie darf zwei Teile haben, die aufeinander aufbauen (erklären → vorhersagen/entscheiden), aber keine Liste von Teilfragen. Sie nennt den gesuchten Mechanismus nicht und enthält keinen Merksatz. Beim ersten Lesen ist klar, was gefragt ist.
- kriterien: 3 Gedankenschritte, die eine volle Antwort enthalten muss (je ein kurzer Satz).
- solution: Musterantwort, 3–6 Sätze.

Verboten: zwei Personen oder Gruppen, von denen eine die Lehrbuch-Methode nutzt und die andere nicht („Wer lernt besser?“); nach einem Namen oder Fachbegriff fragen; ein Fall, bei dem schon das Material die Erklärung liefert.`

  const fields = { haken: str, material: str, q: str, kriterien: strs, solution: str }

  // harte Pruefung im Code: was das Modell trotz Verbot oft liefert, bekommt einen zweiten Versuch mit Begruendung
  const flaw = (typ: ExamType, q: string, material: string): string => {
    if (/\b(be)?nenne\b|\bwie hei(ß|ss)t\b/i.test(q)) return 'Die Aufgabe fragt nach einem Namen oder Fachbegriff („nenne“, „benenne“) – frage stattdessen nach Begründung, Vorhersage oder Entscheidung.'
    if (typ !== 'befund' && /Gruppe A[\s\S]*Gruppe B|Gruppe 1[\s\S]*Gruppe 2/i.test(material)) return 'Der Fall vergleicht zwei Gruppen – baue EINEN echten Fall mit einer Person, einem Ort oder einem Ereignis.'
    return ''
  }

  async function one(job: (typeof jobs)[number], i: number, note = ''): Promise<ExamQuestion> {
    const others = jobs.filter((_, k) => k !== i).map((x) => (x.typ === 'bruecke' ? '' : x.mech.name)).filter(Boolean)
    const user = `THEMA: ${dayLine(d)}
Teilthemen: ${d.subtopics.join(' · ')}

${job.typ === 'bruecke' ? `Verbindung zur früheren Session „${short(getDay(bridge!.tag).title)}“:\nfrueher (steht über dem Material): ${bridge!.frueher}\nheute: ${bridge!.heute}\nSchritt (die Lösung, nicht verraten): ${bridge!.schritt}${others.length ? `\nDie anderen Aufgaben behandeln „${others.join('“, „')}“ – nimm einen anderen Fall.` : ''}` : `${mechText(job.mech)}\n\nAnsatzpunkt für diesen Typ: ${EXAM_TYPES[job.typ].anker}.${others.length ? ` Die anderen Aufgaben behandeln „${others.join('“, „')}“ – bleib bei diesem Mechanismus.` : ''}`}
${weak.length ? `\nLücken aus dem Verständnischeck (gern aufgreifen): ${weak.join(' · ')}` : ''}${ex.asked?.length ? `\nAufgaben des letzten Tests (andere Fälle nehmen):\n${ex.asked.map((q) => `- ${q}`).join('\n')}` : ''}${note}`
    const r = parseJson<{ material?: string; q?: string; kriterien?: string[]; solution?: string }>(
      await complete(system(job.typ), user, 3000, jsonSchema('aufgabe', fields)),
    )
    if (typeof r.q !== 'string' || !r.q.trim() || typeof r.material !== 'string' || !r.material.trim()) throw new ApiError('Unvollständige Antwort – bitte erneut versuchen.')
    const q: ExamQuestion = {
      kind: job.kind,
      q: r.q.trim(),
      // bei der Brücke stehen beide Seiten da: der Satz aus der früheren Session, darunter der heutige Fall
      material: (job.typ === 'bruecke' ? `> **${short(getDay(bridge!.tag).title)}:** ${bridge!.frueher}\n\n` : '') + fixMaterial(r.material),
      criteria: Array.isArray(r.kriterien) ? r.kriterien.filter((k) => typeof k === 'string' && k.trim()).slice(0, 3) : [],
      solution: typeof r.solution === 'string' ? r.solution.trim() : '',
    }
    const why = note ? '' : flaw(job.typ, q.q, r.material)
    if (why) return one(job, i, `\n\nDein letzter Entwurf wurde verworfen: ${why}\nVerworfene Aufgabe: ${q.q}`).catch(() => verify(q))
    return verify(q)
  }

  // Musterantwort nachrechnen – die Antwort wird an ihr gemessen; der Entwurf behauptet sonst gelegentlich Falsches („2,5 % ist höher als 3 %“)
  async function verify(q: ExamQuestion): Promise<ExamQuestion> {
    try {
      const r = parseJson<{ material?: string; q?: string; kriterien?: string[]; solution?: string }>(
        await complete(
          `Du prüfst eine Testaufgabe auf sachliche Richtigkeit. Antworte NUR mit JSON.
Prüfe den Fall: Ist er echt oder genau so möglich? Widerspricht er sich selbst (z. B. „ein Flussdelta, das nicht an der Küste liegt“)? Stimmen die Zahlen und Größenordnungen? Zitiert der Fall jemanden mit einer Regel oder Vorhersage, muss diese für den Normalfall stimmen (richtige Richtung, z. B. Zinssenkung → mehr Kredite → eher MEHR Inflation) – sonst ihren Satz korrigieren. Passt die Aufgabe zum Fall (fragt sie nach etwas, das der Fall auch zeigt)? Prüfe die Musterantwort: Rechne nach, vergleiche jede Aussage mit dem Fall und dem Stand des Fachs (Größer/Kleiner, Richtung von Ursache und Wirkung, Fachbegriffe). Ist sie die einzig vertretbare Antwort?
Korrigiere nur, was falsch oder widersprüchlich ist – Umfang, Stil, Niveau und alles Richtige bleiben, wie sie sind. Gib jedes Feld vollständig zurück, auch wenn es unverändert ist.
- pruefung: zuerst nachrechnen und prüfen, Schritt für Schritt in Stichworten: jede Zahl, jede Größer/Kleiner-Aussage, jede Ursache-Wirkung-Richtung im Fall und in der Musterantwort (höchstens 120 Wörter).
- fehler: was falsch war, in einem Satz ("" wenn nichts).
- material: der Fall (Markdown, Codeblöcke unverändert übernehmen, wenn sie stimmen).
- q: die Aufgabe.
- kriterien: die 3 Begründungsschritte.
- solution: die Musterantwort.`,
          `THEMA: ${dayLine(d)}\nMaterial:\n${q.material}\nAufgabe: ${q.q}\nBegründungsschritte:\n${q.criteria.map((k) => `- ${k}`).join('\n')}\nMusterantwort: ${q.solution}`,
          2500,
          jsonSchema('korrektur', { pruefung: str, fehler: str, material: str, q: str, kriterien: strs, solution: str }),
        ),
      )
      const criteria = Array.isArray(r.kriterien) ? r.kriterien.filter((k) => typeof k === 'string' && k.trim()).slice(0, 3) : []
      if (typeof r.solution !== 'string' || !r.solution.trim()) return q
      // Fall und Aufgabe nur übernehmen, wenn sie nicht verloren gingen (das Modell kürzt sonst gelegentlich)
      const keep = (neu: unknown, alt: string) => (typeof neu === 'string' && neu.trim().length >= alt.length * 0.6 ? neu.trim() : alt)
      return { ...q, material: fixMaterial(keep(r.material, q.material)), q: keep(r.q, q.q), solution: r.solution.trim(), criteria: criteria.length ? criteria : q.criteria }
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
Bewertet wird die Begründung, nicht die Schlussfolgerung allein. Maßstab sind die Begründungsschritten; eine andere, sachlich richtige Herleitung zählt genauso. Formulierung, Fachbegriffe und Länge sind egal – auch kurz und umgangssprachlich zählt, wenn der Gedanke da ist.
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
