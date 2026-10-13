import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, UserCog, BriefcaseBusiness, Clock3, Bell, LogOut } from 'lucide-react'

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/admission', label: 'Admission', icon: FileText },
  { to: '/student/application', label: 'My Application', icon: FileText },
  { to: '/student/profile', label: 'Profile', icon: UserCog },
  { to: '/student/services', label: 'Services', icon: BriefcaseBusiness },
  { to: '/student/requests', label: 'Service Requests', icon: Clock3 },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
]

export default function Sidebar({ onLogout, items = navItems }) {
  return (
    <aside className="hidden h-full w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 md:flex">
      <div className="border-b border-slate-800 p-5 text-xl font-bold"><span className="text-emerald-400">Campus</span>Connect</div>
      <nav className="flex-1 space-y-2 p-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button type="button" onClick={onLogout} className="m-4 mt-0 flex items-center gap-3 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-red-700">
        <LogOut size={16} /> Logout
      </button>
    </aside>
  )
}
