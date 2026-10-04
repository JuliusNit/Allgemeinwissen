import { useRef, useState } from 'react'
import { AREAS, DAYS } from '../data/plan'
import { adviseFocus, describeError } from '../lib/ai'
import { areaStats, STAT_AREAS } from '../lib/stats'
import { DEFAULT_API_URL, DEFAULT_MODEL, dayState, exportJson, importJson, resetAll, setState, today, useStore, type Settings } from '../lib/store'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

async function resizeImage(f: File, px = 192): Promise<string> {
  const url = URL.createObjectURL(f)
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = () => rej(new Error('Bild konnte nicht geladen werden'))
      i.src = url
    })
    const side = Math.min(img.width, img.height)
    const c = document.createElement('canvas')
    c.width = px
    c.height = px
    c.getContext('2d')!.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, px, px)
    return c.toDataURL('image/jpeg', 0.85)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function ProfileView() {
  const profile = useStore((s) => s.profile)
  const picRef = useRef<HTMLInputElement>(null)

  async function pickAvatar(f: File) {
    const avatar = await resizeImage(f)
    setState((s) => ({ ...s, profile: { ...s.profile, avatar } }))
  }

  return (
    <div className="profile">
      <div className="profile-head">
        <button className="avatar-btn" onClick={() => picRef.current?.click()} aria-label="Profilbild ändern">
          <Avatar src={profile.avatar} name={profile.name} size={96} />
          <span className="avatar-edit">ändern</span>
        </button>
        <input ref={picRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && void pickAvatar(e.target.files[0])} />
        <div>
          <input className="name-input" value={profile.name} onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, name: e.target.value } }))} aria-label="Name" />
          {profile.avatar && (
            <button className="btn ghost small" onClick={() => setState((s) => ({ ...s, profile: { ...s.profile, avatar: undefined } }))}>Bild entfernen</button>
          )}
        </div>
      </div>

      <Strengths />
      <AiSettings />
      <Backup />
    </div>
  )
}

function Strengths() {
  const s = useStore((x) => x)
  const focus = s.focus
  const hasKey = !!s.settings.apiKey
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = DAYS.filter((d) => dayState(s, d.day).status === 'fertig').length
  const rows = STAT_AREAS.map((a) => areaStats(s, a)).filter((x) => x.answers || x.done)
  const allDone = done >= DAYS.length

  async function advise() {
    setBusy(true)
    setError(null)
    try {
      const advice = await adviseFocus()
      setState((x) => ({ ...x, focus: { ...x.focus, advice, at: today() } }))
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(false)
    }
  }

  function choose(choice: string) {
    setState((x) => ({ ...x, focus: { ...x.focus, choice } }))
  }

  return (
    <Frame className="card">
      <h2>Stärken</h2>
      {rows.length === 0 ? (
        <p className="muted">Noch keine Daten – die Analyse füllt sich mit jedem Verständnischeck (richtig, Antwortzeit, Präzision).</p>
      ) : (
        <div className="table-wrap">
          <table className="strengths">
            <thead>
              <tr><th>Überthema</th><th>Sessions</th><th>richtig</th><th>Ø Zeit</th><th>Präzision</th><th>Karten</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.area}>
                  <td><Icon name={r.area} size={18} /> {AREAS[r.area].name}</td>
                  <td>{r.done}/{r.total}</td>
                  <td>{r.accuracy == null ? '–' : `${Math.round(r.accuracy * 100)} %`}</td>
                  <td>{r.avgSec == null ? '–' : `${Math.round(r.avgSec)} s`}</td>
                  <td>{r.precision == null ? '–' : `${r.precision.toFixed(1)}/5`}</td>
                  <td>{r.retention == null ? '–' : `${Math.round(r.retention * 100)} %`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {focus.advice && (
        <div className="advice">
          <Markdown text={focus.advice} />
          <p className="muted small">KI-Einschätzung vom {focus.at}</p>
        </div>
      )}
      {error && <div className="chat-error">{error}</div>}
      <button className="btn" onClick={advise} disabled={busy || !hasKey}>{busy ? 'KI wertet aus …' : focus.advice ? 'Neu einschätzen lassen' : 'KI-Einschätzung: was liegt mir?'}</button>

      <h2 className="spaced">Nach den 90 Tagen</h2>
      {!allDone && <p className="muted small">Noch {DAYS.length - done} Sessions – danach entscheidest du: spezialisieren oder breit weitermachen.</p>}
      <div className="focus-choice">
        <button className={`btn ${focus.choice === 'breit' ? 'primary' : ''}`} disabled={!allDone} onClick={() => choose('breit')}>Breit weitermachen</button>
        <select value={focus.choice && focus.choice !== 'breit' ? focus.choice : ''} disabled={!allDone} onChange={(e) => e.target.value && choose(e.target.value)}>
          <option value="">Spezialisieren auf …</option>
          {STAT_AREAS.map((a) => <option key={a} value={a}>{AREAS[a].name}</option>)}
        </select>
      </div>
      {focus.choice && <p className="small">Gewählt: <b>{focus.choice === 'breit' ? 'gefächertes Allgemeinwissen' : AREAS[focus.choice as keyof typeof AREAS]?.name}</b></p>}
    </Frame>
  )
}

function AiSettings() {
  const settings = useStore((s) => s.settings)
  const [show, setShow] = useState(false)
  const patch = (p: Partial<Settings>) => setState((s) => ({ ...s, settings: { ...s.settings, ...p } }))
  return (
    <Frame className="card">
      <h2>KI</h2>
      <label>API-Key</label>
      <div className="row">
        <input type={show ? 'text' : 'password'} value={settings.apiKey} onChange={(e) => patch({ apiKey: e.target.value.trim() })} placeholder="sk-…" autoComplete="off" />
        <button className="btn small" onClick={() => setShow(!show)}>{show ? 'Verbergen' : 'Zeigen'}</button>
      </div>
      <p className="muted small">Der Key bleibt nur in diesem Browser und geht direkt an die API-Adresse unten. Er wird nicht exportiert.</p>
      <label>API-Adresse (OpenAI-kompatibel)</label>
      <input value={settings.apiUrl} onChange={(e) => patch({ apiUrl: e.target.value.trim() })} placeholder={DEFAULT_API_URL} />
      <label>Modell</label>
      <input value={settings.model} onChange={(e) => patch({ model: e.target.value.trim() })} placeholder={DEFAULT_MODEL} list="models" />
      <datalist id="models">
        <option value="qwen3.8-27b" />
        <option value="qwen3.6-27b" />
      </datalist>
      <label className="check-label">
        <input type="checkbox" checked={settings.thinking} onChange={(e) => patch({ thinking: e.target.checked })} />
        Denkmodus – gründlicher, aber langsamer
      </label>
      <button className="btn ghost small" onClick={() => patch({ apiUrl: DEFAULT_API_URL, model: DEFAULT_MODEL })}>Standard wiederherstellen</button>
    </Frame>
  )
}

function Backup() {
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function download() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `allgemeinwissen-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function upload(f: File) {
    try {
      importJson(await f.text())
      setMsg('Sicherung geladen ✓')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Import fehlgeschlagen')
    }
  }

  return (
    <Frame className="card">
      <h2>Sicherung & Gerätewechsel</h2>
      <p className="muted small">Alles liegt lokal im Browser. Zum Wechsel zwischen Geräten: hier exportieren, dort importieren.</p>
      <div className="row">
        <button className="btn primary" onClick={download}>Exportieren</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>Importieren</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} />
      </div>
      {msg && <p>{msg}</p>}
      <button className="btn danger small spaced" onClick={() => confirm('Wirklich ALLEN Fortschritt löschen? Vorher exportieren!') && resetAll()}>Fortschritt löschen</button>
    </Frame>
  )
}
