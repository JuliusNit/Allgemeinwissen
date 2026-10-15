import { Component, type ReactNode } from 'react'
import { Icon } from './Icons'
import { Frame } from './Ink'

// Faengt Absturz einer Ansicht ab, statt die ganze App weiss zu lassen. Bei neuem resetKey
// (andere Route) wird die Ansicht neu versucht; der Fortschritt im localStorage bleibt unberuehrt.

interface Props {
  children: ReactNode
  resetKey?: string
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('Ansicht abgestürzt', error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <Frame className="card empty crash">
        <div className="crash-icon"><Icon name="CRYSTAL" size={48} /></div>
        <h2>Etwas ist schiefgelaufen</h2>
        <p className="small crash-msg">{error.message || String(error)}</p>
        <button className="btn primary" onClick={() => location.reload()}>Neu laden</button>
      </Frame>
    )
  }
}
