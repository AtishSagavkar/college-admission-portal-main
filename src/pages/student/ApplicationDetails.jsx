import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApplicationById } from '../../services/applicationService'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

export default function ApplicationDetails() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const { data: application, loading, error } = useRemoteData(
    () => getApplicationById(id),
    `${currentUser?.uid || ''}:${id}`,
  )

  if (loading || error) return <AsyncState loading={loading} error={error} />

  if (!application) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">Application not found.</div>
  }

  const documents = Array.isArray(application.documents) ? application.documents : []

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Application Details</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div><div className="text-sm text-slate-500">Application Number</div><div className="text-lg font-semibold">{application.applicationNumber}</div></div>
          <div><div className="text-sm text-slate-500">Student Name</div><div className="text-lg font-semibold">{application.personalInfo?.fullName}</div></div>
          <div><div className="text-sm text-slate-500">Course</div><div className="text-lg font-semibold">{application.courseInfo?.preferredCourse}</div></div>
          <div><div className="text-sm text-slate-500">Current Status</div><div className="text-lg font-semibold">{application.status}</div></div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Full Name: {application.personalInfo?.fullName}</p>
              <p>DOB: {application.personalInfo?.dateOfBirth}</p>
              <p>Gender: {application.personalInfo?.gender}</p>
              <p>Category: {application.personalInfo?.category}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Academic Information</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>10th: {application.academicInfo?.tenthPercentage}%</p>
              <p>12th: {application.academicInfo?.twelfthPercentage}%</p>
              <p>Board: {application.academicInfo?.twelfthBoard}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Contact and Address</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Email: {application.contactInfo?.email}</p>
              <p>Phone: {application.contactInfo?.phone}</p>
              <p>Address: {application.contactInfo?.address}</p>
              <p>District: {application.contactInfo?.district}</p>
              <p>City: {application.contactInfo?.city}</p>
              <p>State: {application.contactInfo?.state}</p>
              <p>Pincode: {application.contactInfo?.pincode}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Uploaded Documents</h3>

          {documents.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No documents uploaded for this application.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {documents.map((document, index) => {
                const documentUrl = document.url || document.secure_url || document.link || document.downloadUrl || '#'
                const documentName = document.name || `Document ${index + 1}`

                return (
                  <div key={`${document.id || document.publicId || documentName}-${index}`} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{documentName}</p>
                      {document.documentLabel && <p className="text-xs font-medium text-emerald-700">{document.documentLabel}</p>}
                      <p className="text-xs text-slate-500">{document.type || document.format || 'Attachment'}</p>
                    </div>
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      View Document
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
