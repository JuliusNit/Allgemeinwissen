import { useEffect, useMemo, useRef, useState } from 'react'
import { AREAS, type AreaId } from '../data/plan'
import { channelChat, describeError } from '../lib/ai'
import { cloud, deleteMessage, ensureUser, fetchMessages, loadProfiles, postMessage, subscribe, type CloudMsg } from '../lib/cloud'
import { STAT_AREAS } from '../lib/stats'
import { setState, useStore, type CommunityMsg } from '../lib/store'
import { Avatar } from '../components/Avatar'
import { Icon, type IconName } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

// Themen-Chat im Stil von Discord: ein Kanal pro Ueberthema.
// Mit Supabase (lib/cloud) geteilt und live, sonst nur auf diesem Geraet. @KI antwortet im Kanal.

interface Channel {
  id: string
  name: string
  area: AreaId | null
}

/** Einheitliche Nachricht fuer beide Modi */
interface ViewMsg {
  id: string
  who: string
  avatar?: string
  ki: boolean
  mine: boolean
  at: number
  text: string
}

function slug(t: string): string {
  return t
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const CHANNELS: Channel[] = [{ id: 'allgemein', name: 'allgemein', area: null }, ...STAT_AREAS.map((a) => ({ id: slug(AREAS[a].name), name: slug(AREAS[a].name), area: a }))]

const time = (ms: number) => new Date(ms).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function CommunityView({ channel, go }: { channel?: string; go: (hash: string) => void }) {
  const ch = CHANNELS.find((c) => c.id === channel)
  return (
    <div className={`community ${ch ? 'in-channel' : ''}`}>
      <aside className="channels">
        <h1>Austausch</h1>
        <ul>
          {CHANNELS.map((c) => (
            <li key={c.id}>
              <button className={c.id === ch?.id ? 'active' : ''} onClick={() => go(`/chat/${c.id}`)}>
                <span className="hash">#</span>
                {c.area ? <Icon name={c.area as IconName} size={18} /> : null}
                {c.name}
              </button>
            </li>
          ))}
        </ul>
        <p className="muted small">
          {cloud ? 'Live mit allen, die die App nutzen. ' : 'Noch lokal auf diesem Gerät (kein Server eingerichtet). '}
          Mit <b>@KI</b> antwortet die KI im Kanal.
        </p>
      </aside>
      {ch ? cloud ? <CloudChannel key={ch.id} ch={ch} go={go} /> : <LocalChannel key={ch.id} ch={ch} go={go} /> : <div className="channel-empty muted">Kanal wählen</div>}
    </div>
  )
}

// ---------- lokal ----------

function LocalChannel({ ch, go }: { ch: Channel; go: (hash: string) => void }) {
  const all = useStore((s) => s.community)
  const profile = useStore((s) => s.profile)
  const msgs: ViewMsg[] = useMemo(
    () =>
      all
        .filter((m) => m.channel === ch.id)
        .map((m) => ({ id: m.id, who: m.author === 'ich' ? profile.name || 'Ich' : 'KI', avatar: m.author === 'ich' ? profile.avatar : undefined, ki: m.author === 'ki', mine: m.author === 'ich', at: m.at, text: m.text })),
    [all, ch.id, profile],
  )

  function add(author: CommunityMsg['author'], text: string) {
    const msg: CommunityMsg = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), channel: ch.id, author, text }
    setState((s) => ({ ...s, community: [...s.community, msg] }))
  }

  return (
    <ChannelPane
      ch={ch}
      go={go}
      msgs={msgs}
      onSend={async (t) => add('ich', t)}
      onKi={async (t) => add('ki', t)}
      onDelete={(id) => setState((s) => ({ ...s, community: s.community.filter((m) => m.id !== id) }))}
    />
  )
}

// ---------- Supabase ----------

function CloudChannel({ ch, go }: { ch: Channel; go: (hash: string) => void }) {
  const [raw, setRaw] = useState<CloudMsg[]>([])
  const [names, setNames] = useState<Map<string, { name: string; avatar: string | null }>>(new Map())
  const [me, setMe] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>('verbinde …')
  const profile = useStore((s) => s.profile)

  useEffect(() => {
    let alive = true
    const refreshNames = async (ids: string[]) => {
      const p = await loadProfiles(ids)
      if (alive) setNames(new Map(p))
    }
    const unsub = subscribe(
      ch.id,
      (m) => {
        setRaw((r) => (r.some((x) => x.id === m.id) ? r : [...r, m]))
        void refreshNames([m.user_id])
      },
      (id) => setRaw((r) => r.filter((x) => x.id !== id)),
    )
    ;(async () => {
      try {
        const uid = await ensureUser()
        const list = await fetchMessages(ch.id)
        if (!alive) return
        setMe(uid)
        setRaw(list)
        await refreshNames(list.map((m) => m.user_id))
        setStatus(null)
      } catch (e) {
        if (alive) setStatus(describeError(e))
      }
    })()
    return () => {
      alive = false
      unsub()
    }
  }, [ch.id])

  const msgs: ViewMsg[] = raw.map((m) => {
    const mine = m.user_id === me
    const p = names.get(m.user_id)
    const name = mine ? profile.name || 'Ich' : p?.name ?? '…'
    return {
      id: String(m.id),
      who: m.is_ki ? `KI · für ${name}` : name,
      avatar: m.is_ki ? undefined : mine ? profile.avatar : p?.avatar ?? undefined,
      ki: m.is_ki,
      mine,
      at: Date.parse(m.created_at),
      text: m.text,
    }
  })

  const insert = async (t: string, ki: boolean) => {
    const m = await postMessage(ch.id, t, ki)
    setRaw((r) => (r.some((x) => x.id === m.id) ? r : [...r, m]))
  }

  return (
    <ChannelPane
      ch={ch}
      go={go}
      msgs={msgs}
      status={status}
      onSend={(t) => insert(t, false)}
      onKi={(t) => insert(t, true)}
      onDelete={(id) => void deleteMessage(Number(id)).catch((e) => setStatus(describeError(e)))}
    />
  )
}

// ---------- Darstellung ----------

function ChannelPane({
  ch, go, msgs, status, onSend, onKi, onDelete,
}: {
  ch: Channel
  go: (hash: string) => void
  msgs: ViewMsg[]
  status?: string | null
  onSend: (t: string) => Promise<void>
  onKi: (t: string) => Promise<void>
  onDelete: (id: string) => void
}) {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs.length, streaming])

  async function send() {
    const t = input.trim()
    if (!t || streaming !== null) return
    setInput('')
    setError(null)
    try {
      await onSend(t)
    } catch (e) {
      setInput(t)
      setError(describeError(e))
      return
    }
    if (!/@ki\b/i.test(t)) return
    setStreaming('')
    try {
      const history = [...msgs, { ki: false, text: t }].map((m) => ({ author: m.ki ? ('ki' as const) : ('ich' as const), text: m.text }))
      const reply = await channelChat(ch.area, history, (x) => setStreaming(x))
      await onKi(reply)
    } catch (e) {
      setError(describeError(e))
    } finally {
      setStreaming(null)
    }
  }

  return (
    <section className="channel">
      <header className="channel-head">
        <button className="icon-btn only-mobile" onClick={() => go('/chat')} aria-label="Kanäle"><Icon name="BACK" size={24} /></button>
        <span className="hash">#</span>
        <b>{ch.name}</b>
        {ch.area && <span className="muted small">{AREAS[ch.area].name}</span>}
      </header>
      <div className="channel-log" ref={logRef}>
        {status && <p className="muted small">{status}</p>}
        {!status && msgs.length === 0 && streaming === null && <p className="muted small">Noch keine Nachrichten in #{ch.name}. Schreib etwas – oder frag mit @KI.</p>}
        {msgs.map((m) => (
          <Message key={m.id} m={m} onDelete={m.mine ? () => confirm('Nachricht löschen?') && onDelete(m.id) : undefined} />
        ))}
        {streaming !== null && <Message m={{ id: 'stream', who: 'KI', ki: true, mine: false, at: 0, text: streaming || '…' }} />}
        {error && <div className="chat-error">{error}</div>}
      </div>
      <Frame className="channel-input" r={12}>
        <textarea
          rows={1}
          value={input}
          placeholder={`Nachricht an #${ch.name}`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
        />
        <button className="btn primary small" onClick={() => void send()} disabled={!input.trim() || streaming !== null}>Senden</button>
      </Frame>
    </section>
  )
}

function Message({ m, onDelete }: { m: ViewMsg; onDelete?: () => void }) {
  return (
    <div className="cmsg">
      <Avatar src={m.avatar} name={m.who} size={38} ki={m.ki} />
      <div className="cmsg-body">
        <div className="cmsg-meta">
          <b>{m.who}</b> {m.at > 0 && <span className="muted small">{time(m.at)}</span>}
          {onDelete && <button className="btn ghost small cmsg-del" onClick={onDelete}>löschen</button>}
        </div>
        {m.ki ? <Markdown text={m.text} /> : <p>{m.text}</p>}
      </div>
    </div>
  )
}
