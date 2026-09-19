import { readShellStatus } from './shellStatus'
import './App.css'

export default function App() {
  const status = readShellStatus(window)

  return (
    <main className="shell">
      <h1>bilateral-gen</h1>
      <p>The shell is running. Nothing else is built yet.</p>
      <p className={status.secure ? 'status status--ok' : 'status status--warn'}>{status.label}</p>
    </main>
  )
}
