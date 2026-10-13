import { useState } from 'react'
import { useRemoteData } from '../../hooks/useRemoteData'
import { forwardRequestToAdmin, getRequests } from '../../services/serviceRequestService'
import AsyncState from '../../components/common/AsyncState'
import { useAuth } from '../../hooks/useAuth'
import Modal from '../../components/common/Modal'
import Textarea from '../../components/common/Textarea'

export default function TeacherReviewQueue() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [forwardingRequestId, setForwardingRequestId] = useState('')
  const [actionError, setActionError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [reviewConfirmed, setReviewConfirmed] = useState(false)
  const { currentUser } = useAuth()
  const { data: requests = [], loading, error } = useRemoteData(getRequests, `teacher-review-queue-${refreshKey}`, [])

  const pendingRequests = requests.filter((request) => request.status === 'submitted')

  const handleForward = async () => {
    if (!selectedRequest || !reviewConfirmed) return

    const request = selectedRequest
    setForwardingRequestId(request.id)
    setActionError('')
    try {
      const result = await forwardRequestToAdmin(request.id, {
        uid: currentUser.uid,
        name: currentUser.name,
      }, reviewNote)
      if (!result.success) throw new Error(result.message)
      setSelectedRequest(null)
      setReviewNote('')
      setReviewConfirmed(false)
      setRefreshKey((key) => key + 1)
    } catch (forwardError) {
      setActionError(forwardError.message || 'Could not forward this request to admin.')
    } finally {
      setForwardingRequestId('')
    }
  }

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Review queue</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Service requests</h1>
        <p className="mt-2 text-sm text-slate-600">Review student applications and forward them to admin.</p>
      </div>

      {actionError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>}

      {pendingRequests.length ? (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{request.requestNumber}</div>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{request.serviceName}</h2>
                </div>
                <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {request.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <div>
                  <div className="font-medium text-slate-700">Student</div>
                  <div className="mt-1">{request.requesterName || 'Unknown student'}</div>
                  <div className="mt-1 text-xs">Student no: {request.studentNumber || 'Not provided'}</div>
                  <div className="mt-1 text-xs">{request.requesterEmail || ''} {request.requesterPhone ? `· ${request.requesterPhone}` : ''}</div>
                </div>
                <div>
                  <div className="font-medium text-slate-700">Submitted</div>
                  <div className="mt-1">{request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-IN') : 'Recently'}</div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRequest(request)
                    setReviewNote('')
                    setReviewConfirmed(false)
                    setActionError('')
                  }}
                  disabled={Boolean(forwardingRequestId)}
                  className="rounded-xl border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Review Request
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No new service requests are waiting for teacher review.
        </div>
      )}

      <Modal
        open={Boolean(selectedRequest)}
        title={selectedRequest ? `Review ${selectedRequest.serviceName}` : 'Review service request'}
        onClose={() => setSelectedRequest(null)}
      >
        {selectedRequest && (
          <div className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
            <div className="grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Request number</div>
                <div className="mt-1 font-medium text-slate-900">{selectedRequest.requestNumber}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted</div>
                <div className="mt-1 font-medium text-slate-900">
                  {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString('en-IN') : 'Recently'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student name</div>
                <div className="mt-1 font-medium text-slate-900">{selectedRequest.requesterName || 'Not provided'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student number</div>
                <div className="mt-1 font-medium text-slate-900">{selectedRequest.studentNumber || 'Not provided'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</div>
                <div className="mt-1 break-all font-medium text-slate-900">{selectedRequest.requesterEmail || 'Not provided'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</div>
                <div className="mt-1 font-medium text-slate-900">{selectedRequest.requesterPhone || 'Not provided'}</div>
              </div>
            </div>

            <section>
              <h3 className="text-sm font-semibold text-slate-800">Student application details</h3>
              <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                {selectedRequest.description || 'No additional details were provided.'}
              </p>
            </section>

            <Textarea
              label="Teacher review note for admin (optional)"
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
              rows={3}
              placeholder="Add a note for the admin reviewing this request."
            />

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={reviewConfirmed}
                onChange={(event) => setReviewConfirmed(event.target.checked)}
                className="mt-0.5 accent-emerald-600"
              />
              <span>I have reviewed the student details and request information.</span>
            </label>

            {actionError && <div role="alert" className="text-sm text-red-600">{actionError}</div>}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Back to queue
              </button>
              <button
                type="button"
                onClick={handleForward}
                disabled={!reviewConfirmed || forwardingRequestId === selectedRequest.id}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {forwardingRequestId === selectedRequest.id ? 'Forwarding...' : 'Forward to Admin'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
