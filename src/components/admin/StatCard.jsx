export default function StatCard({ title, value, icon: Icon, accent = 'emerald' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
        </div>
        <div className={`rounded-xl p-3 ${accent === 'emerald' ? 'bg-emerald-50 text-emerald-600' : accent === 'blue' ? 'bg-blue-50 text-blue-600' : accent === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-700'}`}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
    </div>
  )
}
