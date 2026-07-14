import type { Status } from '../types'

const ROTULO: Record<Status, string> = {
  saudavel: 'Saudável',
  atencao: 'Atenção',
  critico: 'Crítico',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" aria-hidden="true" />
      {ROTULO[status]}
    </span>
  )
}
