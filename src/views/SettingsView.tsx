import { useRef, useState } from 'react'
import { MODELS } from '../lib/ai'
import { exportJson, importJson, resetAll, setState, useStore, type Settings } from '../lib/store'

export function SettingsView() {
  const settings = useStore((s) => s.settings)
  const [show, setShow] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function patch(p: Partial<Settings>) {
    setState((s) => ({ ...s, settings: { ...s.settings, ...p } }))
  }

  function download() {
    // Sicherung ohne API-Key, damit sie gefahrlos zwischen Geraeten wandern kann
    const data = JSON.parse(exportJson())
    data.settings.apiKey = ''
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
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
    <div className="settings">
      <h1>Einstellungen</h1>
      <section className="card">
        <h2>KI (Claude)</h2>
        <label>Anthropic-API-Key</label>
        <div className="row">
          <input type={show ? 'text' : 'password'} value={settings.apiKey} onChange={(e) => patch({ apiKey: e.target.value.trim() })} placeholder="sk-ant-…" autoComplete="off" />
          <button className="btn small" onClick={() => setShow(!show)}>{show ? 'Verbergen' : 'Zeigen'}</button>
        </div>
        <p className="muted small">Der Key bleibt nur in diesem Browser gespeichert und geht direkt an api.anthropic.com. Key erstellen: console.anthropic.com → API Keys. Tipp: dort ein Ausgabenlimit setzen.</p>
        <label>Modell</label>
        <select value={settings.model} onChange={(e) => patch({ model: e.target.value })}>
          {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <label>Gründlichkeit</label>
        <select value={settings.effort} onChange={(e) => patch({ effort: e.target.value as Settings['effort'] })}>
          <option value="low">niedrig – schnell & günstig</option>
          <option value="medium">mittel (Standard)</option>
          <option value="high">hoch – gründlicher</option>
        </select>
      </section>

      <section className="card">
        <h2>Sicherung & Geräte-Wechsel</h2>
        <p className="muted small">Fortschritt, Videolinks, Chats, Zusammenfassungen und Karten liegen lokal im Browser. Zum Wechsel zwischen PC, MacBook und Handy: hier exportieren, auf dem anderen Gerät importieren.</p>
        <div className="row">
          <button className="btn primary" onClick={download}>Exportieren</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Importieren</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </div>
        {msg && <p>{msg}</p>}
      </section>

      <section className="card">
        <h2>Zurücksetzen</h2>
        <button className="btn danger" onClick={() => confirm('Wirklich ALLEN Fortschritt löschen? Vorher exportieren!') && resetAll()}>Fortschritt löschen</button>
      </section>
    </div>
  )
}
