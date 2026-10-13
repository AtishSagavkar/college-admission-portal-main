export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className="block w-full text-sm font-medium text-slate-700">
      {label && <span className="mb-1.5 block">{label}</span>}
      <textarea
        {...props}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
          error ? 'border-red-400' : 'border-slate-300'
        } ${className}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
