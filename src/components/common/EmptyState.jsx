export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      {action}
    </div>
  )
}
