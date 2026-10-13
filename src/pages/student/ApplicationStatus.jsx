import { useAuth } from '../../hooks/useAuth'
import { getApplicationsByUser } from '../../services/applicationService'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

const statusFlow = [
  { value: 'submitted', label: 'Application submitted' },
  { value: 'under_review', label: 'Documents under review' },
  { value: 'teacher_approved', label: 'Documents verified' },
  { value: 'approved', label: 'Admission confirmed' },
]

export default function ApplicationStatus() {
  const { currentUser } = useAuth()
  const { data: applications, loading, error } = useRemoteData(
    () => getApplicationsByUser(currentUser.uid),
    currentUser?.uid || '',
    [],
  )
  const current = applications[0]
  const documents = Array.isArray(current?.documents) ? current.documents : []
  const currentStage = statusFlow.findIndex((step) => step.value === current?.status)

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Application Status</h1>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Current status</div>
            <div className="text-2xl font-bold text-slate-900">
              {current?.status === 'approved'
                ? 'Admission Confirmed'
                : current?.status === 'teacher_approved'
                  ? 'Documents verified — awaiting final admission decision'
                  : current?.status?.replaceAll('_', ' ') || 'draft'}
            </div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statusFlow.map((step, index) => {
            const active = current && currentStage >= index
            return (
              <div key={step.value} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <div className={`mx-auto mb-3 h-3 w-3 rounded-full ${active ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <div className="text-sm font-medium text-slate-700">{step.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Uploaded Documents</h2>

        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No documents uploaded yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {documents.map((document, index) => {
              const documentUrl = document.url || document.secure_url || document.link || document.downloadUrl || '#'
              const documentName = document.name || `Document ${index + 1}`

              return (
                <div key={`${document.id || document.publicId || documentName}-${index}`} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{documentName}</p>
                    {document.documentLabel && <p className="text-xs font-medium text-emerald-700">{document.documentLabel}</p>}
                    <p className="text-xs text-slate-500">{document.type || document.format || 'Attachment'}</p>
                  </div>

                  {documentUrl !== '#' ? (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">Unavailable</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
