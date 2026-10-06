import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AREAS, type AreaId } from '../data/plan'
import { channelChat, describeError } from '../lib/ai'
import {
  acceptFriend, cloud, deleteMessage, ensureUser, fetchDirect, fetchFriendships, fetchMessages, loadProfiles, postMessage,
  removeFriend, requestFriend, searchProfiles, subscribe, subscribeFriends, useAuth, type CloudMsg, type CloudProfile, type Friendship,
} from '../lib/cloud'
import { STAT_AREAS } from '../lib/stats'
import { setState, useStore, type CommunityMsg } from '../lib/store'
import { Avatar } from '../components/Avatar'
import { Icon, type IconName } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'

// Austausch: ein Kanal pro Ueberthema, dazu Freunde mit Direktnachrichten (nur mit Server/Konto).
// Mit Supabase (lib/cloud) geteilt und live, sonst nur auf diesem Geraet. @KI antwortet im Chat.
// Routen: #/chat/<kanal>, #/chat/freunde, #/chat/dm-<konto-id>

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

type Names = Map<string, CloudProfile>

function slug(t: string): string {
  return t
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Kanal-IDs bleiben die alten Slugs (gespeicherte Nachrichten), angezeigt wird der Name
const CHANNELS: Channel[] = [{ id: 'allgemein', name: 'Allgemein', area: null }, ...STAT_AREAS.map((a) => ({ id: slug(AREAS[a].name), name: AREAS[a].name, area: a }))]

const time = (ms: number) => new Date(ms).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function CommunityView({ channel, go }: { channel?: string; go: (hash: string) => void }) {
  const auth = useAuth()
  const me = cloud ? auth.user?.id ?? null : null
  const fr = useFriends(me)
  const ch = CHANNELS.find((c) => c.id === channel)
  const dmId = channel?.startsWith('dm-') ? channel.slice(3) : null
  const open = !!ch || channel === 'freunde' || !!dmId
  const incoming = fr.rows.filter((f) => f.status === 'pending' && f.addressee === me).length

  let main: ReactNode = <div className="channel-empty muted">Kanal oder Freund wählen</div>
  if (ch) main = cloud ? <CloudChat key={ch.id} title={ch.name} area={ch.area} channel={ch.id} go={go} /> : <LocalChannel key={ch.id} ch={ch} go={go} />
  else if (channel === 'freunde') main = me ? <FriendsPane me={me} fr={fr} go={go} /> : <NeedServer go={go} />
  else if (dmId) {
    const p = fr.names.get(dmId)
    main = !me ? (
      <NeedServer go={go} />
    ) : fr.friends.includes(dmId) ? (
      <CloudChat key={dmId} title={p?.name ?? '…'} avatar={p?.avatar ?? undefined} area={null} channel="dm" to={dmId} go={go} />
    ) : (
      <section className="channel">
        <ChatHead go={go}>Direktnachricht</ChatHead>
        <p className="muted">{fr.loaded ? 'Ihr seid (noch) nicht befreundet.' : 'lade …'}</p>
      </section>
    )
  }

  return (
    <div className={`community ${open ? 'in-channel' : ''}`}>
      <aside className="channels">
        <h1>Austausch</h1>
        <h2 className="side-head">Kanäle</h2>
        <ul>
          {CHANNELS.map((c) => (
            <li key={c.id}>
              <button className={c.id === ch?.id ? 'active' : ''} onClick={() => go(`/chat/${c.id}`)}>
                {c.area ? <Icon name={c.area as IconName} size={18} /> : <Icon name="CHAT" size={18} />}
                {c.name}
              </button>
            </li>
          ))}
        </ul>
        {cloud && (
          <>
            <h2 className="side-head">Freunde</h2>
            <ul>
              <li>
                <button className={channel === 'freunde' ? 'active' : ''} onClick={() => go('/chat/freunde')}>
                  <Icon name="PROFILE" size={18} />
                  Freunde hinzufügen
                  {incoming > 0 && <span className="badge">{incoming}</span>}
                </button>
              </li>
              {fr.friends.map((id) => {
                const p = fr.names.get(id)
                return (
                  <li key={id}>
                    <button className={dmId === id ? 'active' : ''} onClick={() => go(`/chat/dm-${id}`)}>
                      <Avatar src={p?.avatar ?? undefined} name={p?.name ?? '?'} size={22} />
                      {p?.name ?? '…'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
        <p className="muted small">
          {cloud ? 'Live mit allen, die die App nutzen. ' : 'Noch lokal auf diesem Gerät (kein Server eingerichtet). '}
          Mit <b>@KI</b> antwortet die KI im Chat.
        </p>
      </aside>
      {main}
    </div>
  )
}

function NeedServer({ go }: { go: (hash: string) => void }) {
  return (
    <section className="channel">
      <ChatHead go={go}>Freunde</ChatHead>
      <p className="muted">Freunde gibt es nur mit Konto auf dem App-Server.</p>
    </section>
  )
}

// ---------- Freunde ----------

interface FriendsState {
  rows: Friendship[]
  names: Names
  /** IDs der angenommenen Freunde */
  friends: string[]
  loaded: boolean
  error: string | null
  reload: () => Promise<void>
}

function useFriends(me: string | null): FriendsState {
  const [rows, setRows] = useState<Friendship[]>([])
  const [names, setNames] = useState<Names>(new Map())
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!me) return
    try {
      const list = await fetchFriendships()
      const p = await loadProfiles(list.map((f) => (f.requester === me ? f.addressee : f.requester)))
      setRows(list)
      setNames(new Map(p))
      setError(null)
    } catch (e) {
      setError(describeError(e))
    } finally {
      setLoaded(true)
    }
  }, [me])

  useEffect(() => {
    if (!me) return
    void reload()
    return subscribeFriends(() => void reload())
  }, [me, reload])

  const friends = useMemo(
    () =>
      rows
        .filter((f) => f.status === 'accepted')
        .map((f) => (f.requester === me ? f.addressee : f.requester))
        .sort((a, b) => (names.get(a)?.name ?? '').localeCompare(names.get(b)?.name ?? '', 'de')),
    [rows, names, me],
  )
  return { rows, names, friends, loaded, error, reload }
}

function FriendsPane({ me, fr, go }: { me: string; fr: FriendsState; go: (hash: string) => void }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<CloudProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([])
      return
    }
    let alive = true
    setSearching(true)
    const t = window.setTimeout(() => {
      searchProfiles(q, me)
        .then((h) => alive && setHits(h))
        .catch((e) => alive && setError(describeError(e)))
        .finally(() => alive && setSearching(false))
    }, 300)
    return () => {
      alive = false
      window.clearTimeout(t)
    }
  }, [q, me])

  async function act(fn: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await fr.reload()
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(false)
    }
  }

  const other = (f: Friendship) => (f.requester === me ? f.addressee : f.requester)
  const relation = (id: string) => fr.rows.find((f) => other(f) === id)
  const name = (id: string) => fr.names.get(id)?.name ?? '…'
  const incoming = fr.rows.filter((f) => f.status === 'pending' && f.addressee === me)
  const outgoing = fr.rows.filter((f) => f.status === 'pending' && f.requester === me)

  const row = (id: string, actions: ReactNode, avatar?: string | null) => (
    <li key={id} className="friend-row">
      <Avatar src={(avatar ?? fr.names.get(id)?.avatar) || undefined} name={name(id)} size={34} />
      <b>{fr.names.get(id)?.name ?? hits.find((h) => h.id === id)?.name ?? '…'}</b>
      <span className="friend-actions">{actions}</span>
    </li>
  )

  return (
    <section className="channel">
      <ChatHead go={go}>Freunde</ChatHead>
      <div className="channel-log">
        {(error || fr.error) && <div className="chat-error">{error || fr.error}</div>}

        <div>
          <h3>Freunde hinzufügen</h3>
          <input type="search" value={q} placeholder="Name suchen …" onChange={(e) => setQ(e.target.value)} />
          {q.trim().length >= 2 && !searching && hits.length === 0 && <p className="muted small">Niemand gefunden.</p>}
          <ul className="friend-list">
            {hits.map((h) => {
              const r = relation(h.id)
              const actions = !r ? (
                <button className="btn small" disabled={busy} onClick={() => void act(() => requestFriend(h.id))}>Hinzufügen</button>
              ) : r.status === 'accepted' ? (
                <button className="btn ghost small" onClick={() => go(`/chat/dm-${h.id}`)}>Nachricht</button>
              ) : r.addressee === me ? (
                <button className="btn primary small" disabled={busy} onClick={() => void act(() => acceptFriend(r.id))}>Annehmen</button>
              ) : (
                <span className="muted small">angefragt</span>
              )
              return row(h.id, actions, h.avatar)
            })}
          </ul>
        </div>

        {incoming.length > 0 && (
          <div>
            <h3>Anfragen an dich</h3>
            <ul className="friend-list">
              {incoming.map((f) =>
                row(
                  f.requester,
                  <>
                    <button className="btn primary small" disabled={busy} onClick={() => void act(() => acceptFriend(f.id))}>Annehmen</button>
                    <button className="btn ghost small" disabled={busy} onClick={() => void act(() => removeFriend(f.id))}>Ablehnen</button>
                  </>,
                ),
              )}
            </ul>
          </div>
        )}

        {outgoing.length > 0 && (
          <div>
            <h3>Gesendete Anfragen</h3>
            <ul className="friend-list">
              {outgoing.map((f) =>
                row(f.addressee, <button className="btn ghost small" disabled={busy} onClick={() => void act(() => removeFriend(f.id))}>Zurückziehen</button>),
              )}
            </ul>
          </div>
        )}

        <div>
          <h3>Deine Freunde</h3>
          {fr.friends.length === 0 && <p className="muted small">{fr.loaded ? 'Noch keine – such oben nach einem Namen.' : 'lade …'}</p>}
          <ul className="friend-list">
            {fr.friends.map((id) => {
              const f = relation(id)!
              return row(
                id,
                <>
                  <button className="btn small" onClick={() => go(`/chat/dm-${id}`)}>Nachricht</button>
                  <button className="btn ghost small" disabled={busy} onClick={() => confirm(`${name(id)} als Freund entfernen?`) && void act(() => removeFriend(f.id))}>Entfernen</button>
                </>,
              )
            })}
          </ul>
        </div>
      </div>
    </section>
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
      title={ch.name}
      area={ch.area}
      go={go}
      msgs={msgs}
      onSend={async (t) => add('ich', t)}
      onKi={async (t) => add('ki', t)}
      onDelete={(id) => setState((s) => ({ ...s, community: s.community.filter((m) => m.id !== id) }))}
    />
  )
}

// ---------- Supabase ----------

/** Kanal – oder mit `to` Direktnachrichten mit einem Freund */
function CloudChat({ title, avatar, area, channel, to, go }: { title: string; avatar?: string; area: AreaId | null; channel: string; to?: string; go: (hash: string) => void }) {
  const [raw, setRaw] = useState<CloudMsg[]>([])
  const [names, setNames] = useState<Names>(new Map())
  const [me, setMe] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>('verbinde …')
  const profile = useStore((s) => s.profile)

  useEffect(() => {
    let alive = true
    let uid: string | null = null
    const refreshNames = async (ids: string[]) => {
      const p = await loadProfiles(ids)
      if (alive) setNames(new Map(p))
    }
    const belongs = (m: CloudMsg) => (to ? (m.user_id === uid && m.recipient === to) || (m.user_id === to && m.recipient === uid) : m.channel === channel)
    const load = async () => {
      try {
        uid = await ensureUser()
        const list = to ? await fetchDirect(uid, to) : await fetchMessages(channel)
        if (!alive) return
        setMe(uid)
        setRaw(list)
        await refreshNames(list.map((m) => m.user_id))
        setStatus(null)
      } catch (e) {
        if (alive) setStatus(describeError(e))
      }
    }
    const unsub = subscribe(
      channel,
      (m) => {
        if (!belongs(m)) return
        setRaw((r) => (r.some((x) => x.id === m.id) ? r : [...r, m]))
        void refreshNames([m.user_id])
      },
      (id) => setRaw((r) => r.filter((x) => x.id !== id)),
    )
    void load()
    // Rueckfall, falls Live-Updates ausfallen (Handy im Hintergrund, Verbindung weg)
    const onFocus = () => document.visibilityState === 'visible' && void load()
    const timer = window.setInterval(onFocus, 30000)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      alive = false
      unsub()
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [channel, to])

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
    const m = await postMessage(channel, t, ki, to)
    setRaw((r) => (r.some((x) => x.id === m.id) ? r : [...r, m]))
  }

  return (
    <ChannelPane
      title={title}
      avatar={to ? avatar ?? '' : undefined}
      area={area}
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

function ChatHead({ go, children }: { go: (hash: string) => void; children: ReactNode }) {
  return (
    <header className="channel-head">
      <button className="icon-btn only-mobile" onClick={() => go('/chat')} aria-label="Zurück"><Icon name="BACK" size={24} /></button>
      {children}
    </header>
  )
}

function ChannelPane({
  title, avatar, area, go, msgs, status, onSend, onKi, onDelete,
}: {
  title: string
  /** gesetzt (auch leer) = Direktnachricht: Bild statt Bereichs-Symbol */
  avatar?: string
  area: AreaId | null
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
  const dm = avatar !== undefined

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
      const reply = await channelChat(area, history, (x) => setStreaming(x))
      await onKi(reply)
    } catch (e) {
      setError(describeError(e))
    } finally {
      setStreaming(null)
    }
  }

  return (
    <section className="channel">
      <ChatHead go={go}>
        {dm ? <Avatar src={avatar || undefined} name={title} size={28} /> : area ? <Icon name={area as IconName} size={22} /> : <Icon name="CHAT" size={22} />}
        <b>{title}</b>
      </ChatHead>
      <div className="channel-log" ref={logRef}>
        {status && <p className="muted small">{status}</p>}
        {!status && msgs.length === 0 && streaming === null && (
          <p className="muted small">{dm ? `Noch keine Nachrichten mit ${title}.` : `Noch keine Nachrichten in „${title}“.`} Schreib etwas – oder frag mit @KI.</p>
        )}
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
          placeholder={dm ? `Nachricht an ${title}` : `Nachricht in „${title}“`}
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
