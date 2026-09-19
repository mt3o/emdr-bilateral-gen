import { describe, expect, it } from 'vitest'
import { readShellStatus } from './shellStatus'

describe('readShellStatus', () => {
  it('reports a secure context as secure', () => {
    const status = readShellStatus({ isSecureContext: true })
    expect(status.secure).toBe(true)
    expect(status.label).toMatch(/secure connection/i)
  })

  it('reports an insecure context as insecure, and says what breaks', () => {
    const status = readShellStatus({ isSecureContext: false })
    expect(status.secure).toBe(false)
    expect(status.label).toMatch(/wake lock/i)
  })
})
