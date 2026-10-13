import { ClipboardCheck, FileText, LayoutDashboard, Menu, Search, UserCircle2, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import MobileSidebar from './MobileSidebar'
import StaffNotificationBell from './StaffNotificationBell'

const navItems = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/applications', label: 'Student Applications', icon: FileText },
  { to: '/teacher/reviews', label: 'Review Queue', icon: ClipboardCheck },
  { to: '/teacher/service-requests', label: 'Service Requests', icon: FileText },
  { to: '/teacher/students', label: 'Students', icon: Users },
]

export default function TeacherLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} items={navItems} onLogout={handleLogout} />
      <aside className="hidden h-full w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 md:flex">
        <div className="border-b border-slate-800 p-5 text-xl font-bold"><span className="text-emerald-400">Campus</span>Connect</div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="m-4 mt-0 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-medium text-white">Logout</button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="rounded-xl border border-slate-300 p-2 md:hidden" onClick={() => setMobileOpen((value) => !value)}><Menu size={18} /></button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input placeholder="Search students..." className="w-full max-w-[18rem] rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <StaffNotificationBell role="teacher" />
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 sm:px-3">
              <UserCircle2 className="shrink-0 text-slate-600" size={20} />
              <div className="min-w-0 text-sm">
                <div className="truncate font-semibold text-slate-800">{currentUser?.name || 'Teacher'}</div>
                <div className="text-xs text-slate-500">Faculty</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
