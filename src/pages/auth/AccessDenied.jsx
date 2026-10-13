import { Link } from 'react-router-dom'

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl font-bold text-red-600">403</div>
        <h1 className="text-3xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-3 text-slate-600">You do not have permission to view this page.</p>
        <Link to="/student/dashboard" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Go to Dashboard</Link>
      </div>
    </div>
  )
}
