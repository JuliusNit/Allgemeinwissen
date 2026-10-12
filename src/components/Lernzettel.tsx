import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toBlob } from 'html-to-image'
import { loadSheet } from '../data/lernzettel'
import { line } from '../lib/ink'
import { HatchDefs, InkPaths } from './Ink'
import { Markdown } from './Markdown'

const SVG_PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-linejoin', 'paint-order', 'font-size', 'font-weight', 'font-style', 'opacity']
const X = [line([6, 6], [20, 20]), line([20, 6.5], [6.5, 20])]

export function Lernzettel({ day, title }: { day: number; title: string }) {
  const [sheet, setSheet] = useState<{ day: number; text?: string; error?: boolean } | null>(null)
  const [full, setFull] = useState(false)
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
    <>
      <div className="lz open-full" role="button" tabIndex={0} aria-label="Lernzettel im Vollbild" onClick={() => setFull(true)} onKeyDown={(e) => e.key === 'Enter' && setFull(true)}>
        <Markdown text={sheet.text ?? ''} />
      </div>
      {full && <SheetFull text={sheet.text ?? ''} title={title} onClose={() => setFull(false)} />}
    </>
  )
}

/** Lernzettel im Vollbild: als Bild teilen (Teilen-Menue: Fotos, Dateien, Nachrichten …), als PNG speichern oder als PDF drucken */
function SheetFull({ text, title, onClose }: { text: string; title: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [err, setErr] = useState('')
  const [tries, setTries] = useState(0)
  const name = `Lernzettel ${title}`.replace(/[\\/:*?"<>|]/g, '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('sheet-full-on')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('sheet-full-on')
    }
  }, [onClose])

  // Bild vorab erzeugen: Teilen braucht den Tipp des Nutzers, ein langes Warten davor laesst iOS das Teilen ablehnen
  useEffect(() => {
    let on = true
    const el = ref.current
    if (!el) return
    const t = setTimeout(async () => {
      try {
        // iOS-Canvas fasst hoechstens ~16 Mio. Pixel
        const ratio = Math.min(2, Math.sqrt(16e6 / (el.scrollWidth * el.scrollHeight)))
        // Klassen-Stile innerhalb der Diagramm-SVGs uebernimmt html-to-image nicht – deshalb direkt an die Elemente schreiben
        for (const n of el.querySelectorAll<SVGElement>('svg *')) {
          const cs = getComputedStyle(n)
          for (const p of SVG_PROPS) n.style.setProperty(p, cs.getPropertyValue(p))
        }
        const blob = await toBlob(el, { pixelRatio: ratio, backgroundColor: '#fff' })
        if (on && blob) setFile(new File([blob], `${name}.png`, { type: 'image/png' }))
      } catch {
        if (on) setErr('Bild konnte nicht erzeugt werden.')
      }
    }, 300)
    return () => {
      on = false
      clearTimeout(t)
    }
  }, [name, tries])

  const save = () => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const share = async () => {
    if (!file) return
    if (!navigator.canShare?.({ files: [file] })) return save()
    try {
      await navigator.share({ files: [file], title: name })
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setErr('Teilen nicht möglich.')
    }
  }

  return createPortal(
    <div className="sheet-full" role="dialog" aria-modal="true" aria-label={name}>
      <div className="sheet-bar">
        <button className="recap-x" onClick={onClose} aria-label="Schließen">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
            <InkPaths strokes={X} w={2.3} />
          </svg>
        </button>
        <span className="sheet-actions">
          <button className="btn small" onClick={share} disabled={!file}>Teilen</button>
          <button className="btn small" onClick={save} disabled={!file}>Bild speichern</button>
          <button className="btn small" onClick={() => window.print()}>PDF</button>
        </span>
      </div>
      {err && (
        <p className="chat-error">
          {err}{' '}
          {!file && <button className="btn ghost small" onClick={() => (setErr(''), setTries((t) => t + 1))}>nochmal</button>}
        </p>
      )}
      <div className="sheet-page" ref={ref}>
        <HatchDefs />
        <h1>{title}</h1>
        <div className="lz">
          <Markdown text={text} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
