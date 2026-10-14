import { useState, type ReactNode } from 'react'
import { GRADES, levelLabel, repeatDays, type Level } from '../data/school'
import { cloud, resendConfirmation, saveLevel, sendReset, setNewPassword, signIn, signUp, useAuth } from '../lib/cloud'
import { setState, useStore } from '../lib/store'
import { Icon } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Intro } from './Intro'

// Erster Start: Einfuehrung (fluide vs. kristalline Intelligenz) → Konto anlegen bzw. anmelden.
// Ohne Server (keine .env) nur Name + Wissensstand, alles lokal.

type Step = 'slides' | 'register' | 'login' | 'forgot' | 'sent'

export function Onboarding() {
  const auth = useAuth()
  const onboarded = useStore((s) => !!s.onboarded)
  const [step, setStep] = useState<Step>(onboarded ? 'login' : 'slides')
  const [mail, setMail] = useState('')

  if (auth.recovery) return <Shell><NewPassword /></Shell>
  if (auth.user) return <Shell><LevelOnly /></Shell>

  const toForms = (s: Step) => {
    setState((x) => ({ ...x, onboarded: true }))
    setStep(s)
  }

  if (step === 'slides') return <Intro onRegister={() => toForms('register')} onLogin={() => toForms('login')} />
  return (
    <Shell>
      {step === 'register' && (cloud ? <Register onDone={(m) => { setMail(m); setStep('sent') }} onLogin={() => setStep('login')} /> : <LocalStart />)}
      {step === 'login' && (cloud ? <Login onRegister={() => setStep('register')} onForgot={(m) => { setMail(m); setStep('forgot') }} /> : <LocalStart />)}
      {step === 'forgot' && <Forgot initial={mail} back={() => setStep('login')} />}
      {step === 'sent' && <Sent mail={mail} onLogin={() => setStep('login')} />}
      {step !== 'register' && step !== 'sent' && (
        <button className="btn ghost small center" onClick={() => setStep('slides')}>Einführung ansehen</button>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="onb">
      <div className="onb-brand">
        <Icon name="CRYSTAL" size={34} hatched />
        <b>Allgemeinwissen</b>
      </div>
      {children}
    </div>
  )
}

// ---------- Formulare ----------

const PW_MIN = 8

/** Pflicht ist nur die Länge; Groß/klein, Zahl, Sonderzeichen und 12+ Zeichen erhöhen nur die angezeigte Stärke. */
function passwordScore(pw: string) {
  if (pw.length < PW_MIN) return 0
  return 1
    + (/[a-zäöüß]/.test(pw) && /[A-ZÄÖÜ]/.test(pw) ? 1 : 0)
    + (/\d/.test(pw) ? 1 : 0)
    + (/[^A-Za-zÄÖÜäöüß0-9]/.test(pw) ? 1 : 0)
    + (pw.length >= 12 ? 1 : 0)
}

const STRENGTH = ['zu kurz', 'schwach', 'mittel', 'gut', 'stark', 'sehr stark']

function PasswordStrength({ pw }: { pw: string }) {
  const score = passwordScore(pw)
  return (
    <div className="pw-strength" aria-live="polite">
      <div className="pw-bar" aria-hidden>
        {Array.from({ length: 5 }, (_, k) => <span key={k} className={k < score ? 'on' : ''} />)}
      </div>
      <span className="small">{pw ? `Stärke: ${STRENGTH[score]}` : 'Stärke'}</span>
    </div>
  )
}

const tooShort = (pw: string) => `Das Passwort ist zu kurz: ${pw.length} von mindestens ${PW_MIN} Zeichen.`

function PasswordField({ value, onChange, label, autoComplete }: { value: string; onChange: (v: string) => void; label: string; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <label>{label}</label>
      <div className="row tight">
        <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required />
        <button type="button" className="btn small" onClick={() => setShow(!show)}>{show ? 'Verbergen' : 'Zeigen'}</button>
      </div>
    </>
  )
}

export function LevelPicker({ value, onChange }: { value: Level | undefined; onChange: (l: Level) => void }) {
  const grade = value?.kind === 'schule' ? value.grade : 9
  const n = value ? repeatDays(value).length : 0
  const opt = (l: Level, title: string, sub: string) => {
    const on = value?.kind === l.kind
    return (
      <button type="button" className={`level-opt ${on ? 'on' : ''}`} onClick={() => onChange(l)} aria-pressed={on}>
        <b>{title}</b>
        <span className="small muted">{sub}</span>
      </button>
    )
  }
  return (
    <div className="level">
      <div className="level-opts">
        {opt({ kind: 'schule', grade }, 'Schule', 'Ich gehe noch zur Schule')}
        {opt({ kind: 'studium' }, 'Studium', 'Ich studiere oder habe studiert')}
        {opt({ kind: 'beruf' }, 'Ausbildung / Beruf', 'Schule abgeschlossen')}
      </div>
      {value?.kind === 'schule' && (
        <>
          <label>In welcher Klasse bist du?</label>
          <select value={value.grade} onChange={(e) => onChange({ kind: 'schule', grade: Number(e.target.value) })}>
            {GRADES.map((g) => <option key={g} value={g}>Klasse {g}</option>)}
          </select>
        </>
      )}
      {value && (
        <p className="small level-note">
          {value.kind === 'schule'
            ? `Was du bis Klasse ${value.grade - 1} im Lehrplan hattest, wird Wiederholung – alles andere baut darauf auf.`
            : 'Schulthemen (bis zum Abitur) werden für dich zu Wiederholungstagen.'}{' '}
          <b>{n} von 90 Sessions</b> sind damit Wiederholung.
        </p>
      )}
    </div>
  )
}

function Register({ onDone, onLogin }: { onDone: (mail: string) => void; onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const storedName = useStore((s) => s.profile.name)
  const storedLevel = useStore((s) => s.level)
  const [name, setName] = useState(storedName)
  const [level, setLevel] = useState<Level | undefined>(storedLevel)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tried, setTried] = useState(false)

  const pwOk = pw.length >= PW_MIN
  const same = pw === pw2
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const valid = mailOk && pwOk && same && !!name.trim() && !!level

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTried(true)
    if (!valid || !level) return
    setBusy(true)
    setError(null)
    try {
      const loggedIn = await signUp(email.trim(), pw, name.trim(), level)
      if (!loggedIn) onDone(email.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Frame className="card onb-form">
      <form onSubmit={submit} noValidate>
        <h1>Konto anlegen</h1>
        <label>E-Mail-Adresse</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        {tried && !mailOk && <p className="field-err small">Bitte eine gültige E-Mail-Adresse eingeben.</p>}

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={40} required />
        {tried && !name.trim() && <p className="field-err small">Bitte einen Namen eingeben.</p>}

        <PasswordField label="Passwort" value={pw} onChange={setPw} autoComplete="new-password" />
        <PasswordStrength pw={pw} />
        <PasswordField label="Passwort wiederholen" value={pw2} onChange={setPw2} autoComplete="new-password" />
        {pw2 && !same && <p className="field-err small">Die Passwörter stimmen nicht überein.</p>}

        <h2 className="spaced">Dein Wissensstand</h2>
        <LevelPicker value={level} onChange={setLevel} />
        {tried && !level && <p className="field-err small">Bitte deinen Wissensstand wählen.</p>}

        {tried && !pwOk && <div className="chat-error">{tooShort(pw)}</div>}
        {error && <div className="chat-error">{error}</div>}
        <button className="btn primary wide spaced" type="submit" disabled={busy}>{busy ? 'Wird angelegt …' : 'Registrieren'}</button>
        <button type="button" className="btn ghost small center" onClick={onLogin}>Schon ein Konto? Anmelden</button>
      </form>
    </Frame>
  )
}

function Login({ onRegister, onForgot }: { onRegister: () => void; onForgot: (mail: string) => void }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email.trim(), pw)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Frame className="card onb-form">
      <form onSubmit={submit}>
        <h1>Anmelden</h1>
        <label>E-Mail-Adresse</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <PasswordField label="Passwort" value={pw} onChange={setPw} autoComplete="current-password" />
        {error && <div className="chat-error">{error}</div>}
        {error?.includes('bestätigt') && !resent && (
          <button type="button" className="btn small" onClick={() => void resendConfirmation(email.trim()).then(() => setResent(true), (e: Error) => setError(e.message))}>Bestätigungs-Mail erneut senden</button>
        )}
        {resent && <p className="small">Mail ist unterwegs.</p>}
        <button className="btn primary wide spaced" type="submit" disabled={busy || !email || !pw}>{busy ? 'Melde an …' : 'Anmelden'}</button>
        <div className="row between">
          <button type="button" className="btn ghost small" onClick={onRegister}>Konto anlegen</button>
          <button type="button" className="btn ghost small" onClick={() => onForgot(email.trim())}>Passwort vergessen?</button>
        </div>
      </form>
    </Frame>
  )
}

function Forgot({ initial, back }: { initial: string; back: () => void }) {
  const [email, setEmail] = useState(initial)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <Frame className="card onb-form">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setError(null)
          sendReset(email.trim()).then(() => setDone(true), (err: Error) => setError(err.message))
        }}
      >
        <h1>Passwort vergessen</h1>
        {done ? (
          <p>Falls ein Konto zu <b>{email}</b> existiert, ist ein Link unterwegs. Öffne ihn auf diesem Gerät, dann kannst du ein neues Passwort setzen.</p>
        ) : (
          <>
            <label>E-Mail-Adresse</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            {error && <div className="chat-error">{error}</div>}
            <button className="btn primary wide spaced" type="submit" disabled={!email}>Link senden</button>
          </>
        )}
        <button type="button" className="btn ghost small center" onClick={back}>Zurück zur Anmeldung</button>
      </form>
    </Frame>
  )
}

function Sent({ mail, onLogin }: { mail: string; onLogin: () => void }) {
  const [msg, setMsg] = useState<string | null>(null)
  return (
    <Frame className="card onb-form center-text">
      <Icon name="MAIL" size={56} />
      <h1>Fast geschafft</h1>
      <p>Wir haben dir eine Mail an <b>{mail}</b> geschickt. Öffne den Link darin, um dein Konto zu bestätigen – danach bist du drin.</p>
      <p className="muted small">Keine Mail? Auch im Spam-Ordner nachsehen.</p>
      <div className="row center">
        <button className="btn" onClick={() => void resendConfirmation(mail).then(() => setMsg('Erneut gesendet.'), (e: Error) => setMsg(e.message))}>Erneut senden</button>
        <button className="btn primary" onClick={onLogin}>Zur Anmeldung</button>
      </div>
      {msg && <p className="small">{msg}</p>}
    </Frame>
  )
}

function NewPassword() {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const ok = pw.length >= PW_MIN && pw === pw2
  return (
    <Frame className="card onb-form">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!ok) return
          setBusy(true)
          setError(null)
          setNewPassword(pw).catch((err: Error) => setError(err.message)).finally(() => setBusy(false))
        }}
      >
        <h1>Neues Passwort</h1>
        <PasswordField label="Neues Passwort" value={pw} onChange={setPw} autoComplete="new-password" />
        <PasswordStrength pw={pw} />
        <PasswordField label="Passwort wiederholen" value={pw2} onChange={setPw2} autoComplete="new-password" />
        {pw2 && pw !== pw2 && <p className="field-err small">Die Passwörter stimmen nicht überein.</p>}
        {pw2 && pw.length < PW_MIN && <div className="chat-error">{tooShort(pw)}</div>}
        {error && <div className="chat-error">{error}</div>}
        <button className="btn primary wide spaced" type="submit" disabled={!ok || busy}>Speichern</button>
      </form>
    </Frame>
  )
}

/** Angemeldet, aber noch kein Wissensstand (z. B. Konto von einem anderen Gerät) */
function LevelOnly() {
  const [level, setLevel] = useState<Level | undefined>()
  return (
    <Frame className="card onb-form">
      <h1>Dein Wissensstand</h1>
      <LevelPicker value={level} onChange={setLevel} />
      <button
        className="btn primary wide spaced"
        disabled={!level}
        onClick={() => level && void saveLevel(level).catch(() => setState((s) => ({ ...s, level })))}
      >
        Weiter
      </button>
    </Frame>
  )
}

/** Ohne Server: nur Name + Wissensstand, alles bleibt auf dem Geraet */
function LocalStart() {
  const storedName = useStore((s) => s.profile.name)
  const storedLevel = useStore((s) => s.level)
  const [name, setName] = useState(storedName)
  const [level, setLevel] = useState<Level | undefined>(storedLevel)
  return (
    <Frame className="card onb-form">
      <h1>Los geht's</h1>
      <p className="notice small">Kein Server eingerichtet – Konto nicht möglich, alles bleibt auf diesem Gerät.</p>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
      <h2 className="spaced">Dein Wissensstand</h2>
      <LevelPicker value={level} onChange={setLevel} />
      <button className="btn primary wide spaced" disabled={!level || !name.trim()} onClick={() => setState((s) => ({ ...s, level, profile: { ...s.profile, name: name.trim() } }))}>
        Starten{level ? ` · ${levelLabel(level)}` : ''}
      </button>
    </Frame>
  )
}
