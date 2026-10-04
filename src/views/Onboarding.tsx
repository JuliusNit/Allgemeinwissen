import { useMemo, useRef, useState, type ReactNode } from 'react'
import { GRADES, levelLabel, repeatDays, type Level } from '../data/school'
import { cloud, resendConfirmation, saveLevel, sendReset, setNewPassword, signIn, signUp, useAuth } from '../lib/cloud'
import { curve, line, arrowHead, type Stroke } from '../lib/ink'
import { setState, useStore } from '../lib/store'
import { Icon, type IconName } from '../components/Icons'
import { Frame, InkPaths } from '../components/Ink'

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

  if (step === 'slides') return <Slides onRegister={() => toForms('register')} onLogin={() => toForms('login')} />
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

// ---------- Slides ----------

interface Slide {
  title: string
  body: ReactNode
}

const SLIDES: Slide[] = [
  {
    title: 'Zwei Arten, klug zu sein',
    body: (
      <>
        <div className="onb-pair">
          <Feature icon="BOLT" head="Fluide Intelligenz">Neue Probleme lösen, Muster erkennen, schnell umdenken – ohne Vorwissen.</Feature>
          <Feature icon="CRYSTAL" head="Kristalline Intelligenz">Alles, was du weißt und verstanden hast: Wissen, Begriffe, Zusammenhänge.</Feature>
        </div>
        <p className="muted small">Unterscheidung nach Raymond Cattell (1963). Beide zusammen machen aus, wie gut du denkst.</p>
      </>
    ),
  },
  {
    title: 'Die eine sinkt, die andere wächst',
    body: (
      <>
        <AgeChart />
        <p>Die fluide Intelligenz ist mit Mitte zwanzig am stärksten und lässt danach langsam nach. Die kristalline wächst weiter – der Wortschatz zum Beispiel bis über 60.</p>
        <p className="muted small">Schematisch, nach Salthouse (2009) und Hartshorne &amp; Germine (2015).</p>
      </>
    ),
  },
  {
    title: 'Was sich trainieren lässt',
    body: (
      <>
        <Rating icon="BOLT" head="Fluide" score={1}>Gehirnjogging macht vor allem in der geübten Aufgabe besser – kaum im Denken allgemein (Simons et al. 2016).</Rating>
        <Rating icon="CRYSTAL" head="Kristalline" score={5}>Wächst mit jedem Thema, das du wirklich verstehst – ein Leben lang.</Rating>
        <p><b>Und:</b> Wer viel weiß, lernt Neues schneller. Vorwissen ist der Haken, an dem Neues hängen bleibt.</p>
      </>
    ),
  },
  {
    title: 'So trainierst du sie',
    body: (
      <ul className="onb-list">
        <Item icon="GESCH">Gerüste bauen: <b>Zeitstrahl, Weltkarte, Größenordnungen</b> – alles Neue bekommt einen Platz.</Item>
        <Item icon="MIX">Verknüpfen: Epoche ↔ Kunststil ↔ Philosoph – Wissen über Fächer hinweg.</Item>
        <Item icon="REVIEW">Abrufen statt Wiederlesen, in wachsenden Abständen – so bleibt es.</Item>
      </ul>
    ),
  },
  {
    title: 'Genau dafür ist diese App',
    body: (
      <ul className="onb-list">
        <Item icon="HOME">90 Tage Lernpfad mit kurzen, ausgewählten Videos – quer durch alle Bereiche.</Item>
        <Item icon="CHECK">Verständnischeck mit KI: Fragen, die verknüpfen statt abfragen.</Item>
        <Item icon="REVIEW">Karteikarten und Wiederholungs-Stationen im richtigen Abstand.</Item>
        <Item icon="STATS">Statistik: Was liegt dir? Darauf kannst du dich später spezialisieren.</Item>
      </ul>
    ),
  },
]

function Slides({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) {
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)
  const last = i === SLIDES.length - 1
  const go = (n: number) => setI(Math.max(0, Math.min(SLIDES.length - 1, n)))
  const s = SLIDES[i]

  return (
    <div
      className="onb onb-slides"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
      }}
    >
      <div className="onb-top">
        <span className="muted small">{i + 1} / {SLIDES.length}</span>
        {!last && <button className="btn ghost small" onClick={() => go(SLIDES.length - 1)}>Überspringen</button>}
      </div>
      <Frame className="card onb-slide" key={i}>
        <h1>{s.title}</h1>
        {s.body}
      </Frame>
      <div className="onb-dots" role="tablist" aria-label="Folien">
        {SLIDES.map((_, k) => (
          <button key={k} className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={`Folie ${k + 1}`} aria-selected={k === i} role="tab" />
        ))}
      </div>
      {last ? (
        <div className="onb-actions">
          <button className="btn primary wide" onClick={onRegister}>{cloud ? 'Konto anlegen' : 'Loslegen'}</button>
          {cloud && <button className="btn ghost" onClick={onLogin}>Ich habe schon ein Konto</button>}
        </div>
      ) : (
        <div className="onb-actions row">
          <button className="btn" disabled={i === 0} onClick={() => go(i - 1)}>Zurück</button>
          <button className="btn primary right" onClick={() => go(i + 1)}>Weiter</button>
        </div>
      )}
    </div>
  )
}

function Feature({ icon, head, children }: { icon: IconName; head: string; children: ReactNode }) {
  return (
    <div className="onb-feature">
      <Icon name={icon} size={52} hatched w={1.4} />
      <b>{head}</b>
      <p className="small">{children}</p>
    </div>
  )
}

function Rating({ icon, head, score, children }: { icon: IconName; head: string; score: number; children: ReactNode }) {
  return (
    <div className="onb-rating">
      <Icon name={icon} size={40} hatched w={1.4} />
      <div>
        <div className="onb-rating-head">
          <b>{head}</b>
          <span className="small muted right">trainierbar</span>
          <span className="dots" aria-label={`trainierbar: ${score} von 5`}>
            {Array.from({ length: 5 }, (_, k) => <span key={k} className={k < score ? 'on' : ''} />)}
          </span>
        </div>
        <p className="small">{children}</p>
      </div>
    </div>
  )
}

function Item({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <li>
      <Icon name={icon} size={30} />
      <span>{children}</span>
    </li>
  )
}

/** Schematischer Verlauf beider Intelligenzen ueber das Lebensalter */
function AgeChart() {
  const W = 300
  const H = 170
  const x0 = 34
  const y0 = 140
  const xa = (age: number) => x0 + ((age - 15) / 70) * (W - x0 - 14)
  const ya = (v: number) => y0 - v * 118
  const fluid = (a: number) => (a < 25 ? 0.62 + 0.26 * ((a - 15) / 10) : 0.88 - 0.5 * Math.pow((a - 25) / 55, 1.25))
  const cryst = (a: number) => 0.2 + 0.68 * (1 - Math.exp(-(a - 15) / 17)) - (a > 68 ? 0.004 * (a - 68) : 0)
  const age = (t: number) => 15 + t * 67

  const { axes, crystal, fluidDashes, area } = useMemo(() => {
    const yAxis = line([x0, y0 + 4], [x0, 14])
    const xAxis = line([x0 - 4, y0], [W - 6, y0])
    const axes: Stroke[] = [yAxis, xAxis, ...arrowHead(yAxis, 5), ...arrowHead(xAxis, 5)]
    for (const a of [20, 40, 60, 80]) axes.push(line([xa(a), y0], [xa(a), y0 + 5], 0.8))
    const crystal = curve((t) => [xa(age(t)), ya(cryst(age(t)))], 80)
    // fluide gestrichelt: einzelne kurze Kurvenstuecke
    const fluidDashes: Stroke[] = []
    const n = 22
    for (let k = 0; k < n; k++) {
      const t0 = k / n
      const t1 = t0 + 0.6 / n
      fluidDashes.push(curve((t) => {
        const a = age(t0 + (t1 - t0) * t)
        return [xa(a), ya(fluid(a))]
      }, 6))
    }
    const pts = crystal.pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
    const area = `M${x0} ${y0} L${pts.join(' L')} L${crystal.pts[crystal.pts.length - 1][0].toFixed(1)} ${y0} Z`
    return { axes, crystal: [crystal], fluidDashes, area }
  }, [])

  return (
    <svg className="onb-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Fluide Intelligenz sinkt ab Mitte zwanzig, kristalline steigt bis ins hohe Alter">
      <path d={area} fill="url(#hatch)" opacity={0.55} />
      <InkPaths strokes={axes} w={1.8} />
      <InkPaths strokes={crystal} w={3} />
      <InkPaths strokes={fluidDashes} w={2.2} />
      {[20, 40, 60, 80].map((a) => (
        <text key={a} x={xa(a)} y={y0 + 17} textAnchor="middle" className="chart-t">{a}</text>
      ))}
      <text x={W - 8} y={y0 - 6} textAnchor="end" className="chart-t">Alter</text>
      <text x={x0 + 6} y={18} className="chart-t">Leistung</text>
      <text x={xa(70)} y={ya(cryst(70)) - 10} textAnchor="middle" className="chart-l">kristallin</text>
      <text x={xa(66)} y={ya(fluid(66)) + 20} textAnchor="middle" className="chart-l">fluide</text>
    </svg>
  )
}

// ---------- Formulare ----------

function passwordChecks(pw: string) {
  return [
    { ok: pw.length >= 8, label: 'mindestens 8 Zeichen' },
    { ok: /[a-zäöüß]/.test(pw) && /[A-ZÄÖÜ]/.test(pw), label: 'Klein- und Großbuchstaben' },
    { ok: /\d/.test(pw), label: 'eine Zahl' },
    { ok: /[^A-Za-zÄÖÜäöüß0-9]/.test(pw), label: 'ein Sonderzeichen' },
  ]
}

const STRENGTH = ['sehr schwach', 'sehr schwach', 'schwach', 'mittel', 'gut', 'stark']

function PasswordStrength({ pw }: { pw: string }) {
  const checks = passwordChecks(pw)
  const score = checks.filter((c) => c.ok).length + (pw.length >= 12 && checks.every((c) => c.ok) ? 1 : 0)
  return (
    <div className="pw-strength" aria-live="polite">
      <div className="pw-bar" aria-hidden>
        {Array.from({ length: 5 }, (_, k) => <span key={k} className={k < score ? 'on' : ''} />)}
      </div>
      <span className="small">{pw ? `Stärke: ${STRENGTH[score]}` : 'Stärke'}</span>
      <ul className="pw-checks small">
        {checks.map((c) => (
          <li key={c.label} className={c.ok ? 'ok' : ''}>{c.ok ? '✓' : '○'} {c.label}</li>
        ))}
      </ul>
    </div>
  )
}

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

  const pwOk = passwordChecks(pw).every((c) => c.ok)
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
  const ok = passwordChecks(pw).every((c) => c.ok) && pw === pw2
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
