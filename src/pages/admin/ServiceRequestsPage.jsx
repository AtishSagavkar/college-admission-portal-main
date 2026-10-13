import { useState } from 'react'
import { getRequests, issuePickupCode } from '../../services/serviceRequestService'
import ServiceRequestTable from '../../components/admin/ServiceRequestTable'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

const adminVisibleStatuses = ['forwarded_to_admin', 'approved', 'processing', 'completed', 'rejected']

export default function ServiceRequestsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [updatingRequestId, setUpdatingRequestId] = useState('')
  const [actionError, setActionError] = useState('')
  const { data: requests, loading, error } = useRemoteData(getRequests, `admin-requests-${refreshKey}`, [])
  const [status, setStatus] = useState('All')

  const adminRequests = requests.filter((request) => adminVisibleStatuses.includes(request.status))
  const filtered = status === 'All' ? adminRequests : adminRequests.filter((request) => request.status === status)

  const handleGeneratePickupCode = async (request) => {
    setUpdatingRequestId(request.id)
    setActionError('')
    try {
      const result = await issuePickupCode(request.id)
      if (!result.success) throw new Error(result.message)
      setRefreshKey((key) => key + 1)
    } catch (statusError) {
      setActionError(statusError.message || 'Could not generate a pickup code for this request.')
    } finally {
      setUpdatingRequestId('')
    }
  }

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Requests</h1>
          <p className="mt-2 text-sm text-slate-600">Generate a pickup code for teacher-reviewed requests. Students show the code at the storeroom to collect their documents.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
          <option value="All">All Status</option>
          <option value="forwarded_to_admin">Forwarded to admin</option>
          <option value="approved">approved</option>
          <option value="processing">processing</option>
          <option value="completed">completed</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      {actionError && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white bg-white p-4 shadow-sm">
        <ServiceRequestTable
          requests={filtered}
          onGeneratePickupCode={handleGeneratePickupCode}
          updatingRequestId={updatingRequestId}
        />
      </div>
    </div>
  )
}
