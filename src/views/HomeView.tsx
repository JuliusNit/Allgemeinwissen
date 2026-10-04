import { useEffect, useMemo, useRef, useState } from 'react'
import { BLOCKS, DAYS, getDay } from '../data/plan'
import { bez, type Stroke } from '../lib/ink'
import { blockName, isRepeat, type Level } from '../data/school'
import { currentNode, nodeDone, PATH, reviewReady, type PathNode } from '../lib/path'
import { dueCards } from '../lib/srs'
import { dayState, useStore } from '../lib/store'
import { Coin, COIN_D, COIN_R, COIN_RY, type CoinState } from '../components/Coin'
import { Icon, type IconName } from '../components/Icons'
import { InkPaths } from '../components/Ink'

const W = 360
const CX = W / 2
const AMP = 88
const STEP = 128
const BLOCK_GAP = 78
const TOP = 118

interface Placed {
  node: PathNode
  x: number
  y: number
  blockStart: boolean
}

function layout(): { placed: Placed[]; height: number } {
  const placed: Placed[] = []
  let y = TOP
  let prevBlock = -1
  PATH.forEach((node, i) => {
    const blockStart = node.block !== prevBlock
    if (blockStart && i > 0) y += BLOCK_GAP
    prevBlock = node.block
    placed.push({ node, x: CX + AMP * Math.sin(i * 1.05), y, blockStart })
    y += STEP
  })
  return { placed, height: y + 20 }
}

const LAYOUT = layout()

const CONNECTORS: Stroke[] = (() => {
  const out: Stroke[] = []
  const { placed } = LAYOUT
  for (let i = 0; i < placed.length - 1; i++) {
    const a = placed[i]
    const b = placed[i + 1]
    const y0 = a.y + COIN_RY + COIN_D + 9
    const y1 = b.y - COIN_RY - 10
    if (b.blockStart) {
      // Blockwechsel: Linie laeuft aus, Punkte, neuer Block beginnt
      out.push(bez([a.x, y0], [a.x, y0 + 26], [CX, y0 + 18], [CX, y0 + 32]))
      out.push(bez([CX, y1 - 30], [CX, y1 - 16], [b.x, y1 - 26], [b.x, y1]))
      continue
    }
    const dy = y1 - y0
    out.push(bez([a.x, y0], [a.x, y0 + dy * 0.55], [b.x, y1 - dy * 0.55], [b.x, y1]))
  }
  return out
})()

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
  if (n.kind === 'review') return { head: 'Wiederholung', title: `Tag ${n.days[0]}–${n.days[n.days.length - 1]}` }
  const d = getDay(n.day)
  return { head: isRepeat(level, d.day) ? `Tag ${d.day} · Wdh.` : `Tag ${d.day}`, title: d.title.split(/[:(]/)[0].trim() }
}

function iconOf(n: PathNode): IconName {
  return n.kind === 'review' ? 'REVIEW' : getDay(n.day).area
}

export function HomeView({ go }: { go: (hash: string) => void }) {
  const s = useStore((x) => x)
  const cur = currentNode(s)
  const due = dueCards(s.cards).length
  const doneDays = DAYS.filter((d) => dayState(s, d.day).status === 'fertig').length
  const [pressed, setPressed] = useState<string | null>(null)
  const curRef = useRef<SVGGElement>(null)

  useEffect(() => {
    curRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  const blockLabels = useMemo(() => LAYOUT.placed.filter((p) => p.blockStart), [])

  function stateOf(n: PathNode): CoinState {
    if (nodeDone(s, n)) return 'done'
    if (n.id === cur.id) return 'current'
    if (n.kind === 'review' && !reviewReady(s, n)) return 'locked'
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
      <header className="home-head">
        <h1>Allgemeinwissen</h1>
        <span className="muted">{doneDays}/90</span>
        {due > 0 && (
          <button className="btn small due" onClick={() => go('/wiederholung/faellig')}>
            <Icon name="REVIEW" size={18} /> {due} fällig
          </button>
        )}
      </header>

      <svg className="path" viewBox={`0 0 ${W} ${LAYOUT.height}`} role="list">
        <InkPaths strokes={CONNECTORS} w={2.3} />
        {blockLabels.map((p) => {
          const b = BLOCKS[p.node.block]
          const y = p.y - COIN_R - (p.node.block === 0 ? 30 : 44)
          return (
            <g key={b.id} className="block-label">
              {p.node.block > 0 && (
                <text x={CX} y={y - 40} textAnchor="middle" className="dots">· · ·</text>
              )}
              <text x={CX} y={y} textAnchor="middle">{blockName(b, s.level)}</text>
            </g>
          )
        })}
        {LAYOUT.placed.map((p) => {
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
              <text x={tx} y={p.y - 6 - (lines.length - 1) * 7} textAnchor={right ? 'start' : 'end'} className="node-label">
                <tspan className="node-head">{l.head}</tspan>
                {lines.map((ln, i) => (
                  <tspan key={i} x={tx} dy={i === 0 ? 17 : 15}>{ln}</tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
