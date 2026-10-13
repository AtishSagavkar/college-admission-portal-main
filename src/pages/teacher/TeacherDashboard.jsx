import { BookOpen, FileCheck2, Users, ClipboardCheck, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTeacherDashboardData } from '../../services/teacherService'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

export default function TeacherDashboard() {
  const { data, loading, error } = useRemoteData(getTeacherDashboardData, 'teacher-dashboard', {
    totalStudents: 0,
    applications: 0,
    pendingReviews: 0,
    verifiedDocs: 0,
    serviceRequests: 0,
    reviewQueue: [],
  })

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-6 shrink-0">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Faculty view</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Teacher Dashboard</h1>
      </div>

      <div className="grid shrink-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-500"><span>Total Students</span><Users className="text-emerald-600" size={18} /></div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{data.totalStudents}</div>
        </div>
        <Link to="/teacher/applications" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
          <div className="flex items-center justify-between text-sm text-slate-500"><span>Applications</span><ClipboardCheck className="text-emerald-600" size={18} /></div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{data.applications}</div>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-500"><span>Pending Reviews</span><FileCheck2 className="text-emerald-600" size={18} /></div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{data.pendingReviews}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-500"><span>Verified Docs</span><BookOpen className="text-emerald-600" size={18} /></div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{data.verifiedDocs}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-500"><span>Service Requests</span><ClipboardCheck className="text-emerald-600" size={18} /></div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{data.serviceRequests}</div>
        </div>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Review priorities</h2>
        <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
          {data.reviewQueue.length ? (
            data.reviewQueue.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800">{app.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{app.course} • {app.status.replace(/_/g, ' ')}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Active</span>
                  <Link
                    to={app.studentId ? `/teacher/students/${app.studentId}` : '#'}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Open Student
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No applications need teacher review right now.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
