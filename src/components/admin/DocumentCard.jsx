export default function DocumentCard({ document }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-800">{document.name}</div>
          <div className="text-xs text-slate-500">{document.type} • {document.size}</div>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">{document.status}</span>
      </div>
    </div>
  )
}
