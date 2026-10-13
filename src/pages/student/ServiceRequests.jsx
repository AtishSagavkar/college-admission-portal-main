import { useAuth } from '../../hooks/useAuth'
import { getRequestsByStudent } from '../../services/serviceRequestService'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

export default function ServiceRequestsPage() {
  const { currentUser } = useAuth()
  const { data: requests, loading, error } = useRemoteData(
    () => getRequestsByStudent(currentUser.uid),
    currentUser?.uid || '',
    [],
  )

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Service Requests</h1>
      <div className="mt-6 space-y-4">
        {requests.length ? requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-slate-500">{request.requestNumber}</div>
                <div className="text-xl font-semibold text-slate-900">{request.serviceName}</div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {request.status === 'approved' ? 'Ready for pickup' : request.status === 'completed' ? 'Collected' : request.status.replaceAll('_', ' ')}
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-600">{request.description}</div>
            {request.pickupCode && request.status === 'approved' && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-sm font-semibold text-emerald-900">Your document is ready</div>
                <p className="mt-1 text-sm text-emerald-800">Show this code at the college storeroom to collect your document.</p>
                <div className="mt-3 inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 font-mono text-lg font-bold tracking-[0.2em] text-slate-900">
                  {request.pickupCode}
                </div>
              </div>
            )}
          </div>
        )) : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">No service requests yet.</div>}
      </div>
    </div>
  )
}
