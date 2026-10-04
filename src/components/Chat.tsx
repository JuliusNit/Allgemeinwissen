import { useEffect, useRef, useState } from 'react'
import { describeError, DONE_MARKER } from '../lib/ai'
import { stripMarks } from '../lib/stats'
import type { ChatMsg } from '../lib/store'
import { Markdown } from './Markdown'

interface Props {
  history: ChatMsg[]
  onHistory: (h: ChatMsg[]) => void
  send: (h: ChatMsg[], onText: (t: string) => void) => Promise<string>
  placeholder: string
  /** wird beim ersten Oeffnen automatisch gesendet */
  kickoff?: string
  disabled?: boolean
  onDone?: () => void
}

export function Chat({ history, onHistory, send, placeholder, kickoff, disabled, onDone }: Props) {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  async function run(h: ChatMsg[]) {
    onHistory(h)
    setError(null)
    setStreaming('')
    try {
      const reply = await send(h, (t) => setStreaming(t))
      const next = [...h, { role: 'assistant' as const, content: reply, at: Date.now() }]
      onHistory(next)
      if (reply.includes(DONE_MARKER)) onDone?.()
    } catch (e) {
      setError(describeError(e))
    } finally {
      setStreaming(null)
    }
  }

  useEffect(() => {
    if (kickoff && history.length === 0 && !started.current) {
      started.current = true
      void run([{ role: 'user', content: kickoff, at: Date.now() }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history.length, streaming])

  function submit() {
    const t = input.trim()
    if (!t || streaming !== null) return
    setInput('')
    void run([...history, { role: 'user', content: t, at: Date.now() }])
  }

  const last = history[history.length - 1]
  const canRetry = error && last?.role === 'user'

  return (
    <div className="chat">
      <div className="chat-log" ref={logRef}>
        {history.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'assistant' ? <Markdown text={stripMarks(m.content)} /> : <p>{m.content}</p>}
          </div>
        ))}
        {streaming !== null && (
          <div className="msg assistant">
            {streaming ? <Markdown text={stripMarks(streaming)} /> : <span className="typing">denkt nach …</span>}
          </div>
        )}
        {error && (
          <div className="chat-error">
            {error}
            {canRetry && <button className="btn small" onClick={() => void run(history)}>Erneut senden</button>}
          </div>
        )}
      </div>
      {!disabled && (
        <div className="chat-input">
          <textarea
            value={input}
            rows={2}
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <button className="btn primary" onClick={submit} disabled={!input.trim() || streaming !== null}>Senden</button>
        </div>
      )}
    </div>
  )
}
