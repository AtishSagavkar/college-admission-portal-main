import { Activity, FileCheck2, Users, ClipboardList } from 'lucide-react'
import { getApplications } from '../../services/applicationService'
import { getStudents } from '../../services/studentService'
import { getRequests } from '../../services/serviceRequestService'
import StatCard from '../../components/admin/StatCard'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

export default function AdminDashboard() {
  const { data, loading, error } = useRemoteData(async () => {
    const [applications, students, requests] = await Promise.all([
      getApplications(),
      getStudents(),
      getRequests(),
    ])
    return { applications, students, requests }
  }, 'admin-dashboard', { applications: [], students: [], requests: [] })
  const { applications, students, requests } = data
  const statusCounts = ['submitted', 'under_review', 'documents_verified', 'approved', 'rejected'].map((status) => ({
    status,
    count: applications.filter((app) => app.status === status).length,
  }))

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Administration</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={students.length} icon={Users} accent="emerald" />
        <StatCard title="Total Applications" value={applications.length} icon={ClipboardList} accent="blue" />
        <StatCard title="Pending Applications" value={applications.filter((app) => app.status === 'submitted').length} icon={FileCheck2} accent="violet" />
        <StatCard title="Awaiting Admin Review" value={requests.filter((request) => request.status === 'forwarded_to_admin').length} icon={Activity} accent="slate" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Applications by Status</h2>
          <div className="mt-6 space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600"><span>{status.replace(/_/g, ' ')}</span><span>{count}</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${applications.length ? (count / applications.length) * 100 : 0}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Monthly Applications</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {[45, 60, 74, 52, 80, 90].map((value, index) => (
              <div key={index} className="flex-1 rounded-t-xl bg-emerald-500/90" style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
