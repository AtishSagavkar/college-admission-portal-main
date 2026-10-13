export default function Toast({ toast, onClose }) {
  if (!toast) return null

  return (
    <div className="fixed right-4 top-4 z-[60] w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
          {toast.message && <p className="mt-1 text-xs text-slate-600">{toast.message}</p>}
        </div>
        <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
      </div>
    </div>
  )
}
