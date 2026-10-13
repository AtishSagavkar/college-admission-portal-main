import Spinner from './Spinner'

export default function AsyncState({ loading, error }) {
  if (loading) {
    return <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500" role="status"><Spinner /> Loading data...</div>
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>
  }

  return null
}