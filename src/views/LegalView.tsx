import { DATENSCHUTZ, IMPRESSUM } from '../data/legal'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

export type LegalPage = 'datenschutz' | 'impressum'

/** Datenschutzerklaerung + Impressum (#/datenschutz, #/impressum) – auch vor der Anmeldung erreichbar */
export function LegalView({ page }: { page: LegalPage }) {
  const back = () => (window.history.length > 1 ? window.history.back() : (location.hash = '/profil'))
  return (
    <div className="legal">
      <div className="page-head">
        <button className="icon-btn" onClick={back} aria-label="Zurück"><Icon name="BACK" size={26} /></button>
        <h1>{page === 'datenschutz' ? 'Datenschutzerklärung' : 'Impressum'}</h1>
      </div>
      <Frame className="card">
        <Markdown text={page === 'datenschutz' ? DATENSCHUTZ : IMPRESSUM} />
      </Frame>
      <div className="row center">
        <button className="btn ghost small" onClick={() => location.replace(page === 'datenschutz' ? '#/impressum' : '#/datenschutz')}>{page === 'datenschutz' ? 'Impressum' : 'Datenschutz'}</button>
      </div>
    </div>
  )
}
