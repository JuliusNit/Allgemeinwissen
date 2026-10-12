import type { ReactNode } from 'react'

// Inline-Markdown: **fett**, *kursiv* oder _kursiv_, `code`
export function inline(text: string, key = 0): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\$[^$\n]+\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    const k = `${key}-${i++}`
    if (t.startsWith('$')) out.push(<span key={k}>{tex(t.slice(1, -1), k)}</span>)
    else if (t.startsWith('**')) out.push(<strong key={k}>{t.slice(2, -2)}</strong>)
    else if (t.startsWith('`')) out.push(<code key={k}>{t.slice(1, -1)}</code>)
    else out.push(<em key={k}>{t.slice(1, -1)}</em>)
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const TEX: Record<string, string> = { cdot: '·', times: '×', approx: '≈', le: '≤', ge: '≥', rightarrow: '→', to: '→', pm: '±', alpha: 'α', beta: 'β', Delta: 'Δ', pi: 'π', mu: 'µ', infty: '∞' }

/** einfache LaTeX-Formeln ($10^{-9}$, $CO_2$) lesbar darstellen – die KI schreibt sie manchmal trotz Anweisung */
function tex(src: string, key: string): ReactNode[] {
  const s = src
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\(,|;|!| )/g, ' ')
    .replace(/\\([a-zA-Z]+)/g, (m, w: string) => TEX[w] ?? m)
  const out: ReactNode[] = []
  const re = /([\^_])(\{([^}]*)\}|(.))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index))
    const body = m[3] ?? m[4]
    out.push(m[1] === '^' ? <sup key={`${key}-t${i++}`}>{body}</sup> : <sub key={`${key}-t${i++}`}>{body}</sub>)
    last = m.index + m[0].length
  }
  if (last < s.length) out.push(s.slice(last))
  return out
}

/** Inline-Markdown entfernen (fuer SVG-Text) */
export function plain(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/(^|\s)[*_]([^*_\s][^*_]*)[*_]/g, '$1$2')
}
