/**
 * The shell's own status. This is the foundation's deliverable: the app has to
 * be served over a secure connection, because screen wake lock and
 * installability are unavailable without one. Reporting it on the page makes
 * the check visible on a real device, where it actually matters.
 */
export interface ShellStatus {
  /** Whether the page is running in a secure context. */
  secure: boolean
  /** Short human-readable summary, shown on the shell. */
  label: string
}

/** Narrow slice of the global we depend on, so this stays testable. */
export interface SecureContextCarrier {
  isSecureContext: boolean
}

export function readShellStatus(carrier: SecureContextCarrier): ShellStatus {
  return carrier.isSecureContext
    ? { secure: true, label: 'Served over a secure connection' }
    : { secure: false, label: 'Not a secure context — wake lock and install will not work' }
}
