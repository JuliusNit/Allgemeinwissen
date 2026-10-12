// Lernzettel je Session: lernzettel/NN.md (Plan-Tag zweistellig), Markdown mit Tusche-Diagrammen (components/Diagram.tsx).
// Geschrieben nach den Transkripten der ausgewaehlten Videos (videos.ts), aber nach Thema gegliedert, nicht nach Video.
// Ohne Untertitel (Teilthema nach Titel, Beschreibung und Fachwissen): 45-2, 63-1, 67-2, 76-2, 76-3, 85-0, 85-2.
// Die Dateien werden erst geladen, wenn die Session geoeffnet wird.
const FILES = import.meta.glob<string>('./lernzettel/*.md', { query: '?raw', import: 'default' })

const key = (day: number) => `./lernzettel/${String(day).padStart(2, '0')}.md`

export function hasSheet(day: number): boolean {
  return key(day) in FILES
}

export function loadSheet(day: number): Promise<string> {
  return FILES[key(day)]()
}
