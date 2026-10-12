import { Fragment, type ReactNode } from 'react'
import { Diagram, isDiagram } from './Diagram'
import { inline } from './inline'

// Kleiner, sicherer Markdown-Renderer (kein innerHTML): Ueberschriften, Listen, Tabellen, Code, fett/kursiv,
// Merkkaesten (> …) und Tusche-Diagramme (```kette, ```kreis, … – siehe Diagram.tsx).

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let k = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      blocks.push(isDiagram(lang) ? <Diagram key={k++} kind={lang} src={buf.join('\n')} /> : <pre key={k++}>{buf.join('\n')}</pre>)
      continue
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''))
      blocks.push(
        <blockquote key={k++}>
          {buf.map((p, j) => (
            <Fragment key={j}>{j > 0 && <br />}{inline(p, j)}</Fragment>
          ))}
        </blockquote>,
      )
      continue
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line)
    if (h) {
      const level = Math.min(h[1].length + 1, 5)
      const Tag = `h${level}` as 'h2'
      blocks.push(<Tag key={k++}>{inline(h[2])}</Tag>)
      i++
      continue
    }
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(lines[i + 1])) {
      const head = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(splitRow(lines[i++]))
      blocks.push(
        <div className="table-wrap" key={k++}>
          <table>
            <thead><tr>{head.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead>
            <tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
      continue
    }
    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items: { indent: number; text: string }[] = []
      while (i < lines.length && /^\s*([-*•]|\d+\.)\s+/.test(lines[i])) {
        const mm = /^(\s*)([-*•]|\d+\.)\s+(.*)$/.exec(lines[i])!
        items.push({ indent: mm[1].length, text: mm[3] })
        i++
      }
      const L = ordered ? 'ol' : 'ul'
      blocks.push(
        <L key={k++}>
          {items.map((it, j) => (
            <li key={j} style={it.indent ? { marginLeft: Math.min(it.indent, 8) * 8 } : undefined}>{inline(it.text, j)}</li>
          ))}
        </L>,
      )
      continue
    }
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      blocks.push(<hr key={k++} />)
      i++
      continue
    }
    if (!line.trim()) {
      i++
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*([-*•]|\d+\.)\s+|\s*\|)/.test(lines[i])) para.push(lines[i++])
    if (!para.length) para.push(lines[i++])
    blocks.push(
      <p key={k++}>
        {para.map((p, j) => (
          <Fragment key={j}>{j > 0 && <br />}{inline(p, j)}</Fragment>
        ))}
      </p>,
    )
  }
  return <div className="md">{blocks}</div>
}
