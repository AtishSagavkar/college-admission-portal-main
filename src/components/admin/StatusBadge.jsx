import { STATUS_META } from '../../utils/constants'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.submitted
  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${meta.color}`}>{meta.label}</span>
}
