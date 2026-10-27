// Lernzettel je Session: lernzettel/NN.md (Plan-Tag zweistellig), Markdown mit Tusche-Diagrammen (components/Diagram.tsx).
// Geschrieben nach den Transkripten der ausgewaehlten Videos (videos.ts), aber nach Thema gegliedert, nicht nach Video.
// Ohne Untertitel (Teilthema nach Titel, Beschreibung und Fachwissen): 45-2, 63-1, 67-2, 76-2, 76-3, 85-0, 85-2.
// Vertiefung (91–185): nach Transkripten nur 91–105 (ohne 94-1), 107 und 108-0/110-0; der Rest nach Titel, Beschreibung
// und Fachwissen, weil YouTube die Untertitel-Abfrage sperrte (HTTP 429) – bei Gelegenheit gegen die Transkripte prüfen.
// Die Dateien werden erst geladen, wenn die Session geoeffnet wird.
const FILES = import.meta.glob<string>('./lernzettel/*.md', { query: '?raw', import: 'default' })

const key = (day: number) => `./lernzettel/${String(day).padStart(2, '0')}.md`

export function hasSheet(day: number): boolean {
  return key(day) in FILES
}

export function loadSheet(day: number): Promise<string> {
  return FILES[key(day)]()
}
