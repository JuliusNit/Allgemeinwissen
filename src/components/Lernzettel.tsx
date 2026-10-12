import { useEffect, useState } from 'react'
import { loadSheet } from '../data/lernzettel'
import { Markdown } from './Markdown'

export function Lernzettel({ day }: { day: number }) {
  const [sheet, setSheet] = useState<{ day: number; text?: string; error?: boolean } | null>(null)
  useEffect(() => {
    let on = true
    loadSheet(day).then(
      (text) => on && setSheet({ day, text }),
      () => on && setSheet({ day, error: true }),
    )
    return () => {
      on = false
    }
  }, [day])
  if (sheet?.day !== day) return <p className="typing">lädt …</p>
  if (sheet.error) return <p className="chat-error">Lernzettel konnte nicht geladen werden – offline?</p>
  return (
    <div className="lz">
      <Markdown text={sheet.text ?? ''} />
    </div>
  )
}
