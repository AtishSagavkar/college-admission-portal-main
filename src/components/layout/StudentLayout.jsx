import { Bell, Menu, Search, UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApplicationsByUser } from '../../services/applicationService'
import { useRemoteData } from '../../hooks/useRemoteData'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import StudentNotificationBell from './StudentNotificationBell'

export default function StudentLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: applications = [], loading: applicationsLoading } = useRemoteData(
    () => getApplicationsByUser(currentUser.uid),
    currentUser?.uid || '',
    []
  )

  const hasSubmittedApplication = applications.length > 0
  const hasApprovedAdmission = applications.some((application) => application.status === 'approved')

  const studentNavItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: UserCircle2 },
    ...(hasSubmittedApplication ? [] : [{ to: '/student/admission', label: 'Admission', icon: UserCircle2 }]),
    { to: '/student/application', label: 'My Application', icon: UserCircle2 },
    { to: '/student/profile', label: 'Profile', icon: UserCircle2 },
    ...(hasApprovedAdmission ? [
      { to: '/student/services', label: 'Services', icon: UserCircle2 },
      { to: '/student/requests', label: 'Service Requests', icon: UserCircle2 },
    ] : []),
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
  ]

  const handleLogout = () => {
    logout();
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar onLogout={handleLogout} items={studentNavItems} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} items={studentNavItems} onLogout={handleLogout} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="rounded-xl border border-slate-300 p-2 md:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input placeholder="Search..." className="w-full max-w-[26rem] rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white" />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <StudentNotificationBell />
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 shadow-sm sm:px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserCircle2 size={22} />
              </div>
              <div className="min-w-0 text-sm">
                <div className="truncate font-semibold text-slate-800">{currentUser?.name || 'Prajakta Mali'}</div>
                <div className="text-xs text-slate-500">Student</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{
            applicationsLoading,
            hasApprovedAdmission,
            hasSubmittedApplication,
          }} />
        </main>
      </div>
    </div>
  )
}
