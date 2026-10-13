import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function MobileSidebar({ open, onClose, items = [], onLogout }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 md:hidden">
      <div className="h-full w-72 bg-slate-900 p-4 text-slate-100">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-xl font-bold"><span className="text-emerald-400">Campus</span>Connect</div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 p-2"><X size={16} /></button>
        </div>

        <nav className="space-y-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" onClick={onLogout} className="mt-6 w-full rounded-xl bg-red-600 px-3 py-2.5 text-sm font-medium text-white">Logout</button>
      </div>
    </div>
  )
}
