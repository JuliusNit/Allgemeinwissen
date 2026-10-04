import { useEffect, useMemo, useRef, useState } from 'react'
import { AREAS, type AreaId } from '../data/plan'
import { channelChat, describeError } from '../lib/ai'
import { STAT_AREAS } from '../lib/stats'
import { setState, useStore, type CommunityMsg } from '../lib/store'
import { Avatar } from '../components/Avatar'
import { Icon, type IconName } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

// Themen-Chat im Stil von Discord: ein Kanal pro Ueberthema.
// Ohne Server bleiben die Nachrichten auf diesem Geraet; @KI antwortet im Kanal.

interface Channel {
  id: string
  name: string
  area: AreaId | null
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
        <p className="muted small">Noch lokal auf diesem Gerät – für echten Austausch mit anderen braucht es einen Server. Mit <b>@KI</b> antwortet die KI im Kanal.</p>
      </aside>
      {ch ? <ChannelPane ch={ch} go={go} /> : <div className="channel-empty muted">Kanal wählen</div>}
    </div>
  )
}

function ChannelPane({ ch, go }: { ch: Channel; go: (hash: string) => void }) {
  const all = useStore((s) => s.community)
  const msgs = useMemo(() => all.filter((m) => m.channel === ch.id), [all, ch.id])
  const profile = useStore((s) => s.profile)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs.length, streaming])

  function add(m: Omit<CommunityMsg, 'id' | 'at' | 'channel'>) {
    const msg: CommunityMsg = { ...m, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), channel: ch.id }
    setState((s) => ({ ...s, community: [...s.community, msg] }))
    return msg
  }

  async function send() {
    const t = input.trim()
    if (!t || streaming !== null) return
    setInput('')
    setError(null)
    const mine = add({ author: 'ich', text: t })
    if (!/@ki\b/i.test(t)) return
    setStreaming('')
    try {
      const reply = await channelChat(ch.area, [...msgs, mine], (x) => setStreaming(x))
      add({ author: 'ki', text: reply })
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
        {msgs.length === 0 && streaming === null && <p className="muted small">Noch keine Nachrichten in #{ch.name}. Schreib etwas – oder frag mit @KI.</p>}
        {msgs.map((m) => (
          <Message key={m.id} who={m.author === 'ich' ? profile.name || 'Ich' : 'KI'} avatar={m.author === 'ich' ? profile.avatar : undefined} ki={m.author === 'ki'} at={m.at} text={m.text} />
        ))}
        {streaming !== null && <Message who="KI" ki text={streaming || '…'} />}
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

function Message({ who, avatar, ki, at, text }: { who: string; avatar?: string; ki?: boolean; at?: number; text: string }) {
  return (
    <div className="cmsg">
      <Avatar src={avatar} name={who} size={38} ki={ki} />
      <div className="cmsg-body">
        <div className="cmsg-meta">
          <b>{who}</b> {at && <span className="muted small">{time(at)}</span>}
        </div>
        {ki ? <Markdown text={text} /> : <p>{text}</p>}
      </div>
    </div>
  )
}
