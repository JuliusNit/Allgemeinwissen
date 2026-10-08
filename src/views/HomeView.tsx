import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BLOCKS, getDay } from '../data/plan'
import { bez, type Stroke } from '../lib/ink'
import { fach } from '../data/lehrplan'
import { blockName, isRepeat, knownUpTo, type Level } from '../data/school'
import { BASIS_BLOCK, currentNode, nodeDone, nodeReady, pathOf, type PathNode } from '../lib/path'
import { basisTitle } from './BasisView'
import { dueCards } from '../lib/srs'
import { getState, setState, useStore } from '../lib/store'
import { markRecapSeen, recapDue } from '../lib/recap'
import { Coin, COIN_D, COIN_R, COIN_RY, type CoinState } from '../components/Coin'
import { Icon, IconGroup, type IconName } from '../components/Icons'
import { Frame, InkPaths } from '../components/Ink'
import { Streak } from '../components/Streak'
import { WeekRecap } from '../components/WeekRecap'
import { AfterNinety } from '../components/AfterNinety'
import { choiceLabel, MODES, parseChoice, planFinished } from '../lib/after90'

const W = 360
const CX = W / 2
const AMP = 88
const STEP = 128
const BLOCK_GAP = 78
/** Abstand an der Trennlinie zwischen Grundwiederholung und neuem Stoff */
const SEP_GAP = 110
const TOP = 118

interface Placed {
  node: PathNode
  x: number
  y: number
  blockStart: boolean
}

interface Layout {
  placed: Placed[]
  height: number
  /** y der Trennlinie (nur mit Grundwiederholung) */
  sepY?: number
  /** Verbindung von placed[i] zu placed[i + 1] */
  connectors: { i: number; strokes: Stroke[] }[]
  separator: Stroke[]
}

function layout(path: PathNode[]): Layout {
  const placed: Placed[] = []
  let y = TOP + (path[0]?.block === BASIS_BLOCK ? 18 : 0)
  let prevBlock: number | null = null
  let sepY: number | undefined
  path.forEach((node, i) => {
    const blockStart = node.block !== prevBlock
    if (blockStart && i > 0) {
      const fromBasis = prevBlock === BASIS_BLOCK
      y += fromBasis ? SEP_GAP : BLOCK_GAP
      if (fromBasis) sepY = y - COIN_R - 104
    }
    prevBlock = node.block
    placed.push({ node, x: CX + AMP * Math.sin(i * 1.05), y, blockStart })
    y += STEP
  })

  const connectors: Layout['connectors'] = []
  for (let i = 0; i < placed.length - 1; i++) {
    const a = placed[i]
    const b = placed[i + 1]
    const y0 = a.y + COIN_RY + COIN_D + 9
    const y1 = b.y - COIN_RY - 10
    if (b.blockStart) {
      // Blockwechsel: Linie laeuft aus, Punkte bzw. Trennlinie, neuer Block beginnt
      connectors.push({ i, strokes: [bez([a.x, y0], [a.x, y0 + 26], [CX, y0 + 18], [CX, y0 + 32]), bez([CX, y1 - 30], [CX, y1 - 16], [b.x, y1 - 26], [b.x, y1])] })
      continue
    }
    const dy = y1 - y0
    connectors.push({ i, strokes: [bez([a.x, y0], [a.x, y0 + dy * 0.55], [b.x, y1 - dy * 0.55], [b.x, y1])] })
  }

  // Trennlinie quer ueber den Pfad, leicht geschwungen wie von Hand gezogen
  const separator: Stroke[] = sepY === undefined ? [] : [bez([14, sepY + 1.5], [W * 0.35, sepY - 2], [W * 0.65, sepY + 2.5], [W - 14, sepY - 1], 1.25)]
  return { placed, height: y + 20, sepY, connectors, separator }
}

function wrap(t: string, max: number): string[] {
  const words = t.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur)
      cur = w
    } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  if (lines.length > 3) return [...lines.slice(0, 2), lines[2] + ' …']
  return lines
}

function label(n: PathNode, level: Level | undefined): { head: string; title: string } {
  if (n.kind === 'basis') return basisTitle(n)
  if (n.kind === 'review' && n.final) return { head: 'Abschluss', title: 'Alle Karten wiederholen' }
  if (n.kind === 'review') return { head: 'Wiederholung', title: `Tag ${n.days[0]}–${n.days[n.days.length - 1]}` }
  const d = getDay(n.day)
  return { head: isRepeat(level, d.day) ? `Tag ${d.day} · Wdh.` : `Tag ${d.day}`, title: d.title.split(/[:(]/)[0].trim() }
}

function iconOf(n: PathNode): IconName {
  if (n.kind === 'basis') return n.fach === 'mix' ? 'REVIEW' : fach(n.fach).icon
  return n.kind === 'review' ? 'REVIEW' : getDay(n.day).area
}

/** Nach Tag 90: großer Kasten mit Auswertung und Wahl des weiteren Wegs; nach der Wahl eine Zeile */
function Finished() {
  const s = useStore((x) => x)
  const [edit, setEdit] = useState(false)
  if (!planFinished(s)) return null
  const chosen = parseChoice(s.focus.choice)
  if (chosen && !edit)
    return (
      <Frame className="card after90-home">
        <p className="small">Dein Weg nach Tag 90: <b>{MODES[chosen.mode].letter} – {choiceLabel(chosen)}</b></p>
        <button className="btn small" onClick={() => setEdit(true)}>ändern</button>
      </Frame>
    )
  return (
    <Frame className="card after90-home">
      <h1>90 Tage geschafft!</h1>
      <h2>Wie geht es weiter?</h2>
      <AfterNinety />
      {chosen && <button className="btn small" onClick={() => setEdit(false)}>fertig</button>}
    </Frame>
  )
}

/** Beschriftung neben dem Knopf; abgeschlossen: Tusche-Haken hinter dem Thema */
function NodeLabel({ x, y, right, head, lines, done }: { x: number; y: number; right: boolean; head: string; lines: string[]; done: boolean }) {
  const headRef = useRef<SVGTSpanElement>(null)
  const [hw, setHw] = useState(0)
  useLayoutEffect(() => {
    if (done && right && headRef.current) setHw(headRef.current.getComputedTextLength())
  }, [done, right, head])
  // links vom Knopf: Kopfzeile um den Haken nach links ruecken
  const hx = done && !right ? x - 17 : x
  const cx = right ? x + hw + 4 : x - 14
  return (
    <>
      <text x={x} y={y} textAnchor={right ? 'start' : 'end'} className="node-label">
        <tspan ref={headRef} x={hx} className="node-head">{head}</tspan>
        {lines.map((ln, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 17 : 15}>{ln}</tspan>
        ))}
      </text>
      {done && (right ? hw > 0 : true) && <IconGroup name="CHECK" w={1.9} transform={`translate(${cx} ${y - 12}) scale(0.58)`} />}
    </>
  )
}

export function HomeView({ go }: { go: (hash: string) => void }) {
  const s = useStore((x) => x)
  const path = pathOf(s)
  const L = useMemo(() => layout(path), [path])
  const cur = currentNode(s)
  const due = dueCards(s.cards).length
  const [pressed, setPressed] = useState<string | null>(null)
  const curRef = useRef<SVGGElement>(null)
  const [recap, setRecap] = useState(() => recapDue(getState()))

  useEffect(() => {
    // nach Tag 90 ohne Wahl bleibt der Kasten oben sichtbar
    const st = getState()
    if (planFinished(st) && !parseChoice(st.focus.choice)) window.scrollTo(0, 0)
    else curRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  const blockLabels = L.placed.filter((p) => p.blockStart)

  function stateOf(n: PathNode): CoinState {
    if (nodeDone(s, n)) return 'done'
    if (n.id === cur.id) return 'current'
    if (!nodeReady(s, n)) return 'locked'
    return 'open'
  }

  function open(n: PathNode) {
    setPressed(n.id)
    window.setTimeout(() => {
      setPressed(null)
      go(n.kind === 'day' ? `/tag/${n.day}` : `/wiederholung/${n.id}`)
    }, 150)
  }

  return (
    <div className="home">
      <Streak />
      {recap && (
        <WeekRecap
          onClose={() => {
            setState(markRecapSeen)
            setRecap(false)
          }}
        />
      )}
      <Finished />
      {due > 0 && (
        <header className="home-head">
          <button className="btn small due" onClick={() => go('/wiederholung/faellig')}>
            <Icon name="REVIEW" size={18} /> {due} fällig
          </button>
        </header>
      )}

      <svg className="path" viewBox={`0 0 ${W} ${L.height}`} role="list">
        {/* Wege nur zwischen noch offenen Einheiten */}
        <InkPaths strokes={L.connectors.filter((c) => !nodeDone(s, L.placed[c.i].node) && !nodeDone(s, L.placed[c.i + 1].node)).flatMap((c) => c.strokes)} w={2.3} />
        {L.sepY !== undefined && (
          <g className="separator">
            <InkPaths strokes={L.separator} w={2.3} />
            <text x={W - 16} y={L.sepY - 9} textAnchor="end">↑ Wiederholung</text>
            <text x={W - 16} y={L.sepY + 19} textAnchor="end">Neuer Stoff ↓</text>
          </g>
        )}
        {blockLabels.map((p, i) => {
          const basis = p.node.block === BASIS_BLOCK
          const first = i === 0
          const y = p.y - COIN_R - (first ? (basis ? 48 : 30) : 44)
          const afterSep = !first && blockLabels[i - 1].node.block === BASIS_BLOCK
          return (
            <g key={p.node.block} className="block-label">
              {!first && !afterSep && (
                <text x={CX} y={y - 40} textAnchor="middle" className="dots">· · ·</text>
              )}
              <text x={CX} y={y} textAnchor="middle">{basis ? 'Grundwiederholung' : blockName(BLOCKS[p.node.block], s.level)}</text>
              {basis && (
                <text x={CX} y={y + 16} textAnchor="middle" className="block-sub">Schulstoff bis Jgst. {knownUpTo(s.level)} · LehrplanPLUS Bayern</text>
              )}
            </g>
          )
        })}
        {L.placed.map((p) => {
          const n = p.node
          const st = stateOf(n)
          const l = label(n, s.level)
          const right = p.x <= CX
          const tx = right ? p.x + COIN_R + 16 : p.x - COIN_R - 16
          const lines = wrap(l.title, right ? Math.floor((W - tx) / 7.4) : Math.floor(tx / 7.4))
          return (
            <g
              key={n.id}
              ref={n.id === cur.id ? curRef : undefined}
              className={`node ${st}`}
              role="listitem button"
              tabIndex={0}
              aria-label={`${l.head}: ${l.title}`}
              onPointerDown={() => setPressed(n.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onClick={() => open(n)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  open(n)
                }
              }}
            >
              <g transform={`translate(${p.x} ${p.y})`}>
                <ellipse rx={COIN_R + 6} ry={COIN_RY + 6} cy={COIN_D / 2} className="hit" />
                <Coin icon={iconOf(n)} state={st} pressed={pressed === n.id} />
              </g>
              <NodeLabel x={tx} y={p.y - 6 - (lines.length - 1) * 7} right={right} head={l.head} lines={lines} done={st === 'done'} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
