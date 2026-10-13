import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { PUBLIC_NAV_ITEMS } from '../../utils/constants'
import { useState } from 'react'

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          <span className="text-emerald-600">Campus</span>Connect
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Login</Link>
          <Link to="/register" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Apply Now</Link>
        </div>

        <button type="button" className="rounded-xl border border-slate-300 p-2 md:hidden" onClick={() => setOpen((state) => !state)} aria-label="Toggle navigation">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                {item.label}
              </NavLink>
            ))}
            <Link to="/login" className="rounded-xl border border-slate-300 px-4 py-2 text-center" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" className="rounded-xl bg-emerald-600 px-4 py-2 text-center text-white" onClick={() => setOpen(false)}>Apply Now</Link>
          </div>
        </div>
      )}
    </header>
  )
}
