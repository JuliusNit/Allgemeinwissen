import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AREAS, type AreaId } from '../data/plan'
import { channelChat, channelChatCloud, describeError } from '../lib/ai'
import {
  acceptFriend, blockUser, cloud, deleteMessage, ensureUser, fetchBlocks, fetchDirect, fetchFriendships, fetchMessages, fetchReports, loadProfiles, over16,
  postMessage, removeFriend, reportMessage, REPORT_REASONS, requestFriend, resolveReport, searchProfiles, subscribe, subscribeFriends, unblockUser,
  useAuth, type CloudMsg, type CloudProfile, type Friendship, type Report, type ReportReason,
} from '../lib/cloud'
import { STAT_AREAS } from '../lib/stats'
import { setState, useStore, type CommunityMsg } from '../lib/store'
import { Avatar } from '../components/Avatar'
import { Icon, type IconName } from '../components/Icons'
import { Frame } from '../components/Ink'
import { Markdown } from '../components/Markdown'
import { AccountButton } from '../components/NeedAccount'

// Austausch: ein Kanal pro Ueberthema, dazu Freunde mit Direktnachrichten (nur mit Server/Konto).
// Mit Supabase (lib/cloud) geteilt und live, sonst nur auf diesem Geraet. @KI antwortet im Chat.
// Fremde Nachrichten lassen sich melden (Editor sieht sie unter #/chat/meldungen) und ihre Absender blockieren.
// Routen: #/chat/<kanal>, #/chat/freunde, #/chat/dm-<konto-id>, #/chat/meldungen

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
  /** nur mit Server: Absender (bei KI der Fragende) */
  userId?: string
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
  const editor = !!me && auth.role === 'editor'
  // unter 16 (oder ohne Geburtsjahr) nur Freunde + Direktnachrichten; der Server sperrt dasselbe per RLS (006)
  const publicOk = !me || over16(auth.birthYear)
  const fr = useFriends(me)
  const bl = useBlocks(me)
  const ch = CHANNELS.find((c) => c.id === channel)
  const dmId = channel?.startsWith('dm-') ? channel.slice(3) : null
  const open = !!ch || channel === 'freunde' || !!dmId || channel === 'meldungen'
  const incoming = fr.rows.filter((f) => f.status === 'pending' && f.addressee === me).length
  const block = async (id: string) => {
    await blockUser(id)
    await Promise.all([bl.reload(), fr.reload()])
  }

  let main: ReactNode = <div className="channel-empty muted">Kanal oder Freund wählen</div>
  if (cloud && !me && open) main = <NeedAccount go={go} />
  else if (ch && !publicOk) main = <Under16 go={go} />
  else if (ch) main = cloud ? <CloudChat key={ch.id} title={ch.name} area={ch.area} channel={ch.id} blocked={bl.ids} onBlock={block} editor={editor} go={go} /> : <LocalChannel key={ch.id} ch={ch} go={go} />
  else if (channel === 'freunde') main = me ? <FriendsPane me={me} fr={fr} bl={bl} go={go} /> : <NeedServer go={go} />
  else if (channel === 'meldungen' && editor) main = <ReportsPane go={go} />
  else if (dmId) {
    const p = fr.names.get(dmId)
    main = !me ? (
      <NeedServer go={go} />
    ) : fr.friends.includes(dmId) ? (
      <CloudChat key={dmId} title={p?.name ?? '…'} avatar={p?.avatar ?? undefined} area={null} channel="dm" to={dmId} blocked={bl.ids} onBlock={block} editor={editor} go={go} />
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
        {publicOk && (
          <>
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
          </>
        )}
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
            {editor && (
              <>
                <h2 className="side-head">Editor</h2>
                <ul>
                  <li>
                    <button className={channel === 'meldungen' ? 'active' : ''} onClick={() => go('/chat/meldungen')}>
                      <Icon name="CHAT" size={18} />
                      Meldungen
                    </button>
                  </li>
                </ul>
              </>
            )}
          </>
        )}
        <p className="muted small">
          {cloud ? (publicOk ? 'Live mit allen, die die App nutzen. ' : '') : 'Noch lokal auf diesem Gerät (kein Server eingerichtet). '}
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

/** Oeffentlicher Kanal, aber unter 16 */
function Under16({ go }: { go: (hash: string) => void }) {
  return (
    <section className="channel">
      <ChatHead go={go}>Austausch</ChatHead>
      <Frame className="card empty">
        <p>Öffentliche Kanäle gibt es ab 16. Mit Freunden kannst du dich direkt austauschen.</p>
        <button className="btn primary" onClick={() => go('/chat/freunde')}>Freunde</button>
      </Frame>
    </section>
  )
}

/** Mit Server, aber ohne Konto gestartet */
function NeedAccount({ go }: { go: (hash: string) => void }) {
  return (
    <section className="channel">
      <ChatHead go={go}>Austausch</ChatHead>
      <Frame className="card empty">
        <p>Für den Austausch brauchst du ein Konto.</p>
        <AccountButton className="btn primary" />
      </Frame>
    </section>
  )
}

// ---------- Blockieren ----------

interface BlocksState {
  ids: string[]
  reload: () => Promise<void>
}

function useBlocks(me: string | null): BlocksState {
  const [ids, setIds] = useState<string[]>([])
  const reload = useCallback(async () => {
    if (me) setIds(await fetchBlocks())
  }, [me])
  useEffect(() => {
    void reload()
  }, [reload])
  return { ids, reload }
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

function FriendsPane({ me, fr, bl, go }: { me: string; fr: FriendsState; bl: BlocksState; go: (hash: string) => void }) {
  const [blockedNames, setBlockedNames] = useState<Names>(new Map())
  useEffect(() => {
    void loadProfiles(bl.ids).then((p) => setBlockedNames(new Map(p)))
  }, [bl.ids])
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
            {hits.filter((h) => !bl.ids.includes(h.id)).map((h) => {
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

        {bl.ids.length > 0 && (
          <div>
            <h3>Blockiert</h3>
            <ul className="friend-list">
              {bl.ids.map((id) => {
                const p = blockedNames.get(id)
                return (
                  <li key={id} className="friend-row">
                    <Avatar src={p?.avatar ?? undefined} name={p?.name ?? '?'} size={34} />
                    <b>{p?.name ?? '…'}</b>
                    <span className="friend-actions">
                      <button className="btn ghost small" disabled={busy} onClick={() => void act(async () => { await unblockUser(id); await bl.reload() })}>Freigeben</button>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

// ---------- Meldungen (nur Editor) ----------

function ReportsPane({ go }: { go: (hash: string) => void }) {
  const [list, setList] = useState<Report[] | null>(null)
  const [names, setNames] = useState<Names>(new Map())
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await fetchReports()
      const p = await loadProfiles(r.flatMap((x) => [x.reporter, x.reported ?? '']).filter(Boolean))
      setList(r)
      setNames(new Map(p))
      setError(null)
    } catch (e) {
      setError(describeError(e))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function act(fn: () => Promise<void>) {
    setBusy(true)
    try {
      await fn()
      await load()
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(false)
    }
  }

  const name = (id: string | null) => (id ? names.get(id)?.name ?? '…' : 'gelöschtes Konto')
  const where = (c: string | null) => (c === 'dm' ? 'Direktnachricht' : CHANNELS.find((x) => x.id === c)?.name ?? c ?? '')

  return (
    <section className="channel">
      <ChatHead go={go}><b>Meldungen</b></ChatHead>
      <div className="channel-log">
        {error && <div className="chat-error">{error}</div>}
        {list === null && !error && <p className="muted small">lade …</p>}
        {list?.length === 0 && <p className="muted small">Keine offenen Meldungen.</p>}
        {list?.map((r) => (
          <Frame key={r.id} className="card report" r={12}>
            <div className="cmsg-meta">
              <b>{REPORT_REASONS[r.reason] ?? r.reason}</b> <span className="muted small">{time(Date.parse(r.created_at))} · {where(r.channel)} · von {name(r.reporter)}</span>
            </div>
            <p><b>{name(r.reported)}:</b> {r.text}</p>
            <div className="row">
              {r.message_id != null && (
                <button className="btn danger small" disabled={busy} onClick={() => confirm('Nachricht löschen?') && void act(async () => { await deleteMessage(r.message_id!); await resolveReport(r.id) })}>Nachricht löschen</button>
              )}
              <button className="btn small" disabled={busy} onClick={() => void act(() => resolveReport(r.id))}>Erledigt</button>
            </div>
          </Frame>
        ))}
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
      askKi={async (history, onText) => add('ki', await channelChat(ch.area, history, onText))}
      onDelete={(id) => setState((s) => ({ ...s, community: s.community.filter((m) => m.id !== id) }))}
    />
  )
}

// ---------- Supabase ----------

/** Kanal – oder mit `to` Direktnachrichten mit einem Freund */
function CloudChat({
  title, avatar, area, channel, to, blocked, onBlock, editor, go,
}: {
  title: string
  avatar?: string
  area: AreaId | null
  channel: string
  to?: string
  blocked: string[]
  onBlock: (id: string) => Promise<void>
  editor: boolean
  go: (hash: string) => void
}) {
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

  const msgs: ViewMsg[] = raw.filter((m) => !blocked.includes(m.user_id)).map((m) => {
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
      userId: m.user_id,
    }
  })

  const add = (m: CloudMsg) => setRaw((r) => (r.some((x) => x.id === m.id) ? r : [...r, m]))
  const remove = (id: string) => void deleteMessage(Number(id)).then(() => setRaw((r) => r.filter((x) => String(x.id) !== id)), (e) => setStatus(describeError(e)))

  return (
    <ChannelPane
      title={title}
      avatar={to ? avatar ?? '' : undefined}
      area={area}
      go={go}
      msgs={msgs}
      status={status}
      onSend={async (t) => add(await postMessage(channel, t, to))}
      askKi={async (_, onText) => add(await channelChatCloud(area, channel, to, onText))}
      onDelete={remove}
      moderation={{
        report: (id, reason) => reportMessage(Number(id), reason),
        block: (m) => onBlock(m.userId!),
        remove: editor ? remove : undefined,
      }}
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

/** Melden, Blockieren, Loeschen durch den Editor (nur mit Server) */
interface Moderation {
  report: (id: string, reason: ReportReason) => Promise<void>
  block: (m: ViewMsg) => Promise<void>
  remove?: (id: string) => void
}

function ChannelPane({
  title, avatar, area, go, msgs, status, onSend, askKi, onDelete, moderation,
}: {
  title: string
  /** gesetzt (auch leer) = Direktnachricht: Bild statt Bereichs-Symbol */
  avatar?: string
  area: AreaId | null
  go: (hash: string) => void
  msgs: ViewMsg[]
  status?: string | null
  onSend: (t: string) => Promise<void>
  /** KI-Antwort erzeugen und ablegen (lokal im Geraet, mit Server ueber die Edge Function) */
  askKi: (history: { author: 'ich' | 'ki'; text: string }[], onText: (t: string) => void) => Promise<void>
  onDelete: (id: string) => void
  moderation?: Moderation
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
      await askKi(history, (x) => setStreaming(x))
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
          <Message
            key={m.id}
            m={m}
            onDelete={m.mine ? () => confirm('Nachricht löschen?') && onDelete(m.id) : undefined}
            moderation={!m.mine && m.userId ? moderation : undefined}
          />
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

function Message({ m, onDelete, moderation }: { m: ViewMsg; onDelete?: () => void; moderation?: Moderation }) {
  const [menu, setMenu] = useState<'zu' | 'auf' | 'melden' | 'gemeldet'>('zu')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function run(fn: () => Promise<void>, next: typeof menu) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      setMenu(next)
    } catch (e) {
      setError(describeError(e))
    } finally {
      setBusy(false)
    }
  }

  const person = m.ki ? m.who.replace(/^KI · für /, '') : m.who

  return (
    <div className="cmsg">
      <Avatar src={m.avatar} name={m.who} size={38} ki={m.ki} />
      <div className="cmsg-body">
        <div className="cmsg-meta">
          <b>{m.who}</b> {m.at > 0 && <span className="muted small">{time(m.at)}</span>}
          {onDelete && <button className="btn ghost small cmsg-del" onClick={onDelete}>löschen</button>}
          {moderation && (
            <button className="btn ghost small cmsg-del" aria-expanded={menu !== 'zu'} onClick={() => setMenu(menu === 'zu' ? 'auf' : 'zu')}>
              {menu === 'zu' ? '…' : 'schließen'}
            </button>
          )}
        </div>
        {m.ki ? <Markdown text={m.text} /> : <p>{m.text}</p>}
        {moderation && menu !== 'zu' && (
          <div className="cmsg-actions">
            {menu === 'auf' && (
              <>
                <button className="btn small" onClick={() => setMenu('melden')}>Melden</button>
                <button className="btn small" disabled={busy} onClick={() => confirm(`${person} blockieren? Du siehst dann keine Nachrichten mehr von ${person}.`) && void run(() => moderation.block(m), 'zu')}>
                  {person} blockieren
                </button>
                {moderation.remove && <button className="btn danger small" onClick={() => confirm('Nachricht löschen?') && moderation.remove!(m.id)}>löschen</button>}
              </>
            )}
            {menu === 'melden' &&
              (Object.keys(REPORT_REASONS) as ReportReason[]).map((r) => (
                <button key={r} className="btn small" disabled={busy} onClick={() => void run(() => moderation.report(m.id, r), 'gemeldet')}>{REPORT_REASONS[r]}</button>
              ))}
            {menu === 'gemeldet' && (
              <>
                <span className="small">Gemeldet ✓</span>
                <button className="btn small" disabled={busy} onClick={() => confirm(`${person} blockieren?`) && void run(() => moderation.block(m), 'zu')}>{person} blockieren</button>
              </>
            )}
            {error && <div className="chat-error">{error}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
