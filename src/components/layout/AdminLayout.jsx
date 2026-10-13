import { ClipboardCheck, FileText, LayoutDashboard, Menu, Search, Settings, UserCircle2, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import MobileSidebar from './MobileSidebar'
import StaffNotificationBell from './StaffNotificationBell'

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/applications', label: 'Applications', icon: FileText },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/service-requests', label: 'Service Requests', icon: ClipboardCheck },
  { to: '/admin/services', label: 'Services', icon: FileText },
  { to: '/admin/teachers', label: 'Teachers', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen h-dvh min-w-0 overflow-hidden bg-slate-100">
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} items={adminNavItems} onLogout={handleLogout} />
      <aside className="hidden h-full w-72 flex-col border-r border-slate-800 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-slate-100 md:flex">
        <div className="flex items-center gap-3 border-b border-slate-800/80 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg font-black text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
            C
          </div>
          <div className="text-xl font-bold tracking-tight">
            <span className="text-emerald-400">Campus</span>Connect
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {adminNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-white shadow-inner ring-1 ring-emerald-400/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="m-4 mt-0 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/20 transition hover:brightness-110"
        >
          Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-2.5 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur sm:gap-3 sm:px-4 sm:py-3 md:px-8">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="rounded-xl border border-slate-300 bg-white p-2 text-slate-600 shadow-sm md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <Menu size={18} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                placeholder="Search administration..."
                className="w-full max-w-[28rem] rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
            <StaffNotificationBell role="admin" />

            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 shadow-sm sm:gap-3 sm:px-3 sm:py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 sm:h-9 sm:w-9">
                <UserCircle2 size={22} />
              </div>
              <div className="min-w-0 max-w-[108px] text-xs sm:max-w-none sm:text-sm">
                <div className="truncate font-semibold text-slate-800">{currentUser?.name || 'Admin'}</div>
                <div className="hidden text-xs text-slate-500 min-[380px]:block">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-100/70 p-3 sm:p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
