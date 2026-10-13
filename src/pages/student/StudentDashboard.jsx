import { FileText, Bell, Briefcase } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApplicationsByUser } from '../../services/applicationService'
import { getRequestsByStudent } from '../../services/serviceRequestService'
import { getNotificationsForUser } from '../../services/notificationService'
import { getStudentByUserId } from '../../services/studentService'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

export default function StudentDashboard() {
  const { currentUser } = useAuth()
  const location = useLocation()
  const admissionState = location.state?.selectedCourse
    ? { state: { selectedCourse: location.state.selectedCourse } }
    : {}
  const { data, loading, error } = useRemoteData(async () => {
    const [student, applications, requests, notifications] = await Promise.all([
      getStudentByUserId(currentUser.uid),
      getApplicationsByUser(currentUser.uid),
      getRequestsByStudent(currentUser.uid),
      getNotificationsForUser(currentUser.uid),
    ])
    return { student, applications, requests, notifications }
  }, currentUser?.uid || '', { student: null, applications: [], requests: [], notifications: [] })
  const { student, applications, requests, notifications } = data
  const latest = applications[0]
  const hasSubmittedApplication = applications.length > 0
  const hasApprovedAdmission = applications.some((application) => application.status === 'approved')

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Portal overview</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {currentUser?.name || 'Student'}</h1>
          <p className="mt-2 text-sm text-slate-600">Here’s what’s happening with your application.</p>
        </div>
        {!hasSubmittedApplication && (
          <Link to="/student/admission" {...admissionState} className="inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Apply for Admission</Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Application Status</span><FileText className="text-emerald-600" size={18} /></div><div className="mt-4 text-xl font-bold text-slate-900">{latest?.status === 'approved' ? 'Admission Confirmed' : latest?.status === 'teacher_approved' ? 'Documents Verified' : latest?.status?.replaceAll('_', ' ') || 'No application'}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Application Number</span><FileText className="text-emerald-600" size={18} /></div><div className="mt-4 text-lg font-bold text-slate-900">{latest?.applicationNumber || 'N/A'}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Selected Course</span><Briefcase className="text-emerald-600" size={18} /></div><div className="mt-4 text-lg font-bold text-slate-900">{latest?.courseInfo?.preferredCourse || student?.course || 'Not selected'}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Service Requests</span><Bell className="text-emerald-600" size={18} /></div><div className="mt-4 text-2xl font-bold text-slate-900">{requests.length}</div></div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {!hasSubmittedApplication && (
              <Link to="/student/admission" {...admissionState} className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Apply for Admission</Link>
            )}
            <Link to="/student/application" className="rounded-xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">View Application</Link>
            <Link to="/student/profile" className="rounded-xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">Update Profile</Link>
            {hasApprovedAdmission && <Link to="/student/services" className="rounded-xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">Request a Service</Link>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li>• Application submitted</li>
            <li>• Documents uploaded</li>
            <li>• Application under review</li>
            <li>• Service request submitted</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
        <div className="mt-4 space-y-3">
          {notifications.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <div className="font-medium text-slate-800">{item.title}</div>
                <div className="text-xs text-slate-500">{item.message}</div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
