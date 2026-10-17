import { useEffect, useState } from 'react'
import { DATENSCHUTZ, IMPRESSUM } from '../data/legal'
import { loadBites, type Bite } from '../data/feed'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

export type LegalPage = 'datenschutz' | 'impressum' | 'bildnachweis'

const TITLE: Record<LegalPage, string> = { datenschutz: 'Datenschutzerklärung', impressum: 'Impressum', bildnachweis: 'Bildnachweis' }

/** Datenschutzerklaerung, Impressum, Bildnachweis (#/datenschutz, #/impressum, #/bildnachweis) – auch vor der Anmeldung erreichbar */
export function LegalView({ page }: { page: LegalPage }) {
  const back = () => (window.history.length > 1 ? window.history.back() : (location.hash = '/profil'))
  return (
    <div className="legal">
      <div className="page-head">
        <button className="icon-btn" onClick={back} aria-label="Zurück"><Icon name="BACK" size={26} /></button>
        <h1>{TITLE[page]}</h1>
      </div>
      <Frame className="card">{page === 'bildnachweis' ? <Credits /> : <Markdown text={page === 'datenschutz' ? DATENSCHUTZ : IMPRESSUM} />}</Frame>
      <div className="row center">
        {(['datenschutz', 'impressum', 'bildnachweis'] as const)
          .filter((x) => x !== page)
          .map((x) => (
            <button key={x} className="btn ghost small" onClick={() => location.replace(`#/${x}`)}>{TITLE[x].replace('erklärung', '')}</button>
          ))}
      </div>
    </div>
  )
}

/** Urheber und Lizenz der Fotos und Gemälde in „Entdecken“, je Häppchen (CC BY/BY-SA verlangen den Nachweis) */
function Credits() {
  const [bites, setBites] = useState<Bite[] | null>(null)
  useEffect(() => {
    void loadBites().then(setBites)
  }, [])
  if (!bites) return <p className="muted">Lädt …</p>
  const md = bites
    .filter((b) => b.images.length)
    .map((b) => `**${b.hook}**  \n${[...new Set(b.images.map((im) => `${im.author} (${im.license})`))].join(' · ')}`)
    .join('\n\n')
  return <Markdown text={`Fotos und Gemälde in „Entdecken“ von Wikimedia Commons:\n\n${md}`} />
}
