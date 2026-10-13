function ServiceRequestActions({ request, onGeneratePickupCode, updating }) {
  if (request.status === 'forwarded_to_admin') {
    return (
      <button
        type="button"
        onClick={() => onGeneratePickupCode(request)}
        disabled={updating}
        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {updating ? 'Generating...' : 'Generate pickup code'}
      </button>
    )
  }

  if (request.status === 'approved') return <span className="text-xs text-slate-500">Code issued</span>
  if (request.status === 'completed') return <span className="text-xs font-medium text-emerald-700">Collected</span>
  return <span className="text-xs text-slate-500">No action needed</span>
}

export default function ServiceRequestTable({ requests = [], onGeneratePickupCode, updatingRequestId = '' }) {
  if (!requests.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">No service requests found.</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Request ID</th>
            <th className="px-4 py-3">Applicant</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Teacher review</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-800">{request.requestNumber}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800">{request.requesterName || 'Unknown student'}</div>
                <div className="mt-1 text-xs text-slate-500">Student no: {request.studentNumber || 'Not provided'}</div>
                <div className="mt-1 text-xs text-slate-500">{request.requesterEmail || ''} {request.requesterPhone ? `· ${request.requesterPhone}` : ''}</div>
              </td>
              <td className="px-4 py-3">{request.serviceName}</td>
              <td className="max-w-xs px-4 py-3 text-xs text-slate-600">
                <div>{request.teacherReviewNote || 'No teacher note'}</div>
                {request.teacherReviewedByName && <div className="mt-1 text-slate-400">Reviewed by {request.teacherReviewedByName}</div>}
              </td>
              <td className="px-4 py-3">{new Date(request.createdAt).toLocaleDateString('en-IN')}</td>
              <td className="px-4 py-3">
                <div><span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">{request.status === 'approved' ? 'ready for pickup' : request.status}</span></div>
                {request.pickupCode && <div className="mt-2 font-mono text-xs font-bold tracking-wider text-slate-700">{request.pickupCode}</div>}
              </td>
              <td className="px-4 py-3">
                <ServiceRequestActions
                  request={request}
                  onGeneratePickupCode={onGeneratePickupCode}
                  updating={updatingRequestId === request.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
