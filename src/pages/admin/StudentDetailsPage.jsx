import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'
import { useAuth } from '../../hooks/useAuth'
import { getStudentById } from '../../services/studentService'
import { getApplicationsByUser, updateApplicationStatus } from '../../services/applicationService'
import { STATUS_META } from '../../utils/constants'

function formatDate(value) {
  if (!value) return 'Not available'

  if (typeof value?.toDate === 'function') {
    const date = value.toDate()

    return Number.isNaN(date.getTime())
      ? 'Not available'
      : date.toLocaleDateString('en-IN')
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? 'Not available'
      : value.toLocaleDateString('en-IN')
  }

  if (typeof value === 'object' && value?.seconds != null) {
    const date = new Date(value.seconds * 1000)

    return Number.isNaN(date.getTime())
      ? 'Not available'
      : date.toLocaleDateString('en-IN')
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Not available'
    : date.toLocaleDateString('en-IN')
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm shadow-slate-200/60">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
          ? String(value)
          : 'Not provided'}
      </p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const normalized = (status || 'submitted').toLowerCase()
  const meta = STATUS_META[normalized] || {
    label: normalized === 'pending' ? 'Pending' : normalized.replace(/_/g, ' '),
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  }

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${meta.color}`}>
      {meta.label}
    </span>
  )
}

export default function StudentDetailsPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [decisionMessage, setDecisionMessage] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [applicationOverrides, setApplicationOverrides] = useState({})

  const {
    data,
    loading,
    error,
  } = useRemoteData(
    async () => {
      const [student, applications] = await Promise.all([
        getStudentById(id),
        getApplicationsByUser(id),
      ])

      return {
        student,
        applications,
      }
    },
    `admin-student-details:${id}`,
    {
      student: null,
      applications: [],
    },
  )

  if (loading || error) {
    return <AsyncState loading={loading} error={error} />
  }

  const { student, applications = [] } = data
  const localApplications = applications.map((application) => ({
    ...application,
    ...applicationOverrides[application.id],
  }))

  const getDecisionButtons = (status) =>
    currentUser?.role === 'teacher'
      ? status === 'submitted'
        ? [
            { label: 'Mark Under Review', value: 'under_review' },
            { label: 'Verify Documents', value: 'teacher_approved' },
            { label: 'Reject', value: 'rejected' },
          ]
        : status === 'under_review'
          ? [
              { label: 'Verify Documents', value: 'teacher_approved' },
              { label: 'Reject', value: 'rejected' },
            ]
          : []
      : currentUser?.role === 'admin' && status === 'teacher_approved'
        ? [
            { label: 'Approve Admission', value: 'approved' },
            { label: 'Reject', value: 'rejected' },
          ]
        : []

  const handleDecision = async (nextStatus) => {
    if (!latestApplication) return

    setIsUpdating(true)
    setDecisionMessage('')

    const result = await updateApplicationStatus(
      latestApplication.id,
      nextStatus,
      currentUser?.name || currentUser?.role || 'Staff',
      `Admission status updated to ${nextStatus} by ${currentUser?.role || 'staff'}.`,
      currentUser?.uid || '',
    )

    if (!result.success) {
      setDecisionMessage(result.message || 'Unable to update admission status.')
      setIsUpdating(false)
      return
    }

    setApplicationOverrides((previous) => ({
      ...previous,
      [latestApplication.id]: {
        status: nextStatus,
        remarks: result.application.remarks || latestApplication.remarks,
        history: result.application.history || latestApplication.history,
      },
    }))

    setDecisionMessage(`Admission moved to ${result.application.status.replace(/_/g, ' ')}.`)
    setIsUpdating(false)
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Student not found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          The student record could not be found.
        </p>

        <Link
          to={currentUser?.role === 'teacher' ? '/teacher/students' : '/admin/students'}
          className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Back to Students
        </Link>
      </div>
    )
  }

  const profile = student.profile || {}

  const sortedApplications = [...localApplications].sort(
    (a, b) =>
      new Date(b.submittedAt || 0).getTime() -
      new Date(a.submittedAt || 0).getTime(),
  )

  const latestApplication = sortedApplications[0] || null

  const personalInfo = latestApplication?.personalInfo || {}
  const contactInfo = latestApplication?.contactInfo || {}
  const academicInfo = latestApplication?.academicInfo || {}
  const courseInfo = latestApplication?.courseInfo || {}
  const documents = latestApplication?.documents || []
  const history = latestApplication?.history || []

  const course =
    courseInfo.preferredCourse ||
    student.course ||
    'Not selected'

  const admissionStatus =
    latestApplication?.status ||
    student.admissionStatus ||
    'pending'
  const decisionButtons = getDecisionButtons(admissionStatus)

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Student Management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Student Details
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            View the complete student profile and admission information.
          </p>
        </div>

        <Link
          to={currentUser?.role === 'teacher' ? '/teacher/students' : '/admin/students'}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
        >
          ← Back to Students
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <InfoItem
            label="Student ID"
            value={student.id}
          />

          <InfoItem
            label="Name"
            value={student.name}
          />

          <InfoItem
            label="Email"
            value={student.email}
          />

          <InfoItem
            label="Phone"
            value={student.phone}
          />

        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <InfoItem
            label="Course"
            value={course}
          />

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm shadow-slate-200/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Admission Status
            </p>

            <div className="mt-3">
              <StatusBadge status={admissionStatus} />
            </div>
          </div>

          <InfoItem
            label="Joined Date"
            value={formatDate(student.createdAt)}
          />

        </div>
      </div>

      {latestApplication && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Admission Control
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Manage application decision
              </h2>
            </div>
            <StatusBadge status={admissionStatus} />
          </div>

          {decisionMessage && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {decisionMessage}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {decisionButtons.map((button) => {
              const isCurrent = admissionStatus === button.value
              const isTeacherApprove = currentUser?.role === 'teacher' && button.value === 'teacher_approved'
              const isAdminApprove = currentUser?.role === 'admin' && button.value === 'approved'

              return (
                <button
                  key={button.value}
                  type="button"
                  onClick={() => handleDecision(button.value)}
                  disabled={isUpdating || isCurrent}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isTeacherApprove
                      ? 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                      : isAdminApprove
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : button.value === 'rejected'
                          ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                          : 'border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                  }`}
                >
                  {button.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Personal Information */}
      <Section title="Personal Information">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <InfoItem
            label="Full Name"
            value={
              personalInfo.fullName ||
              profile.fullName ||
              student.name
            }
          />

          <InfoItem
            label="Date of Birth"
            value={
              personalInfo.dateOfBirth ||
              profile.dateOfBirth
            }
          />

          <InfoItem
            label="Gender"
            value={
              personalInfo.gender ||
              profile.gender
            }
          />

          <InfoItem
            label="Category"
            value={
              personalInfo.category ||
              profile.category
            }
          />

        </div>
      </Section>

      {/* Contact Information */}
      <Section title="Contact Information">
        <div className="grid gap-4 md:grid-cols-2">

          <InfoItem
            label="Email"
            value={
              contactInfo.email ||
              student.email
            }
          />

          <InfoItem
            label="Phone"
            value={
              contactInfo.phone ||
              student.phone
            }
          />

          <div className="md:col-span-2">
            <InfoItem
              label="Address"
              value={
                contactInfo.address ||
                profile.address
              }
            />
          </div>

          <InfoItem label="District" value={contactInfo.district || profile.district} />
          <InfoItem label="City" value={contactInfo.city || profile.city} />
          <InfoItem label="State" value={contactInfo.state || profile.state} />
          <InfoItem label="Pincode" value={contactInfo.pincode || profile.pincode} />

        </div>
      </Section>

      {/* Academic Information */}
      <Section title="Academic Information">

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            10th / SSC
          </h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <InfoItem
              label="Board"
              value={academicInfo.tenthBoard}
            />

            <InfoItem
              label="School"
              value={academicInfo.tenthSchool}
            />

            <InfoItem
              label="Passing Year"
              value={academicInfo.tenthPassingYear}
            />

            <InfoItem
              label="Percentage"
              value={
                academicInfo.tenthPercentage !== undefined &&
                academicInfo.tenthPercentage !== null
                  ? `${academicInfo.tenthPercentage}%`
                  : ''
              }
            />

          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            12th / HSC
          </h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <InfoItem
              label="Board"
              value={academicInfo.twelfthBoard}
            />

            <InfoItem
              label="College"
              value={academicInfo.twelfthCollege}
            />

            <InfoItem
              label="Passing Year"
              value={academicInfo.twelfthPassingYear}
            />

            <InfoItem
              label="Percentage"
              value={
                academicInfo.twelfthPercentage !== undefined &&
                academicInfo.twelfthPercentage !== null
                  ? `${academicInfo.twelfthPercentage}%`
                  : ''
              }
            />

          </div>
        </div>
      </Section>

      {/* Course Information */}
      <Section title="Course Information">
        <div className="grid gap-4 md:grid-cols-2">

          <InfoItem
            label="Preferred Course"
            value={courseInfo.preferredCourse}
          />

          <InfoItem
            label="Application Number"
            value={latestApplication?.applicationNumber}
          />

        </div>
      </Section>

      {/* Applications */}
      <Section title="Admission Applications">

        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No admission applications found for this student.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">

              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">
                    Application No.
                  </th>

                  <th className="px-4 py-3">
                    Course
                  </th>

                  <th className="px-4 py-3">
                    12th %
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Submitted
                  </th>

                  <th className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {application.applicationNumber ||
                        'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      {application.courseInfo?.preferredCourse ||
                        'Not selected'}
                    </td>

                    <td className="px-4 py-3">
                      {application.academicInfo?.twelfthPercentage ??
                        'N/A'}
                      %
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={application.status}
                      />
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(application.submittedAt)}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/applications/${application.id}`}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        View Application
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </Section>

      {/* Documents */}
      <Section title={`Uploaded Documents (${documents.length})`}>

        {documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No documents uploaded.
          </div>
        ) : (
          <div className="space-y-3">

            {documents.map((document, index) => {
              const documentUrl = document.url || document.secure_url || document.link || document.downloadUrl || '#'
              const documentName = document.name || `Document ${index + 1}`

              return (
                <div
                  key={
                    document.id ||
                    document.publicId ||
                    `${documentName}-${index}`
                  }
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-700">
                      📄
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {documentName}
                      </p>

                      {document.documentLabel && (
                        <p className="mt-1 text-xs font-medium text-emerald-700">
                          {document.documentLabel}
                        </p>
                      )}

                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">

                        {document.type && (
                          <span>
                            {document.type}
                          </span>
                        )}

                        {document.size && (
                          <span>
                            • {document.size}
                          </span>
                        )}

                        {document.status && (
                          <span>
                            • {document.status}
                          </span>
                        )}

                      </div>
                    </div>
                  </div>

                  {documentUrl && documentUrl !== '#' ? (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:brightness-110"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">
                      File unavailable
                    </span>
                  )}

                </div>
              )
            })}

          </div>
        )}

      </Section>

      {/* Admin Remarks */}
      <Section title="Admin Remarks">
        <div className="rounded-xl bg-white p-4">
          <p className="text-sm leading-6 text-slate-700">
            {latestApplication?.remarks ||
              'No remarks added.'}
          </p>
        </div>
      </Section>

      {/* Application History */}
      <Section title="Application History">

        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No application history available.
          </div>
        ) : (
          <div className="space-y-4">

            {history.map((item, index) => (
              <div
                key={`${item.changedAt || 'history'}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                  <div>
                    <p className="font-semibold capitalize text-slate-900">
                      {item.status?.replace(/_/g, ' ') ||
                        'Unknown status'}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Changed by:{' '}
                      {item.changedBy || 'Unknown'}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    {formatDate(item.changedAt)}
                  </p>

                </div>

                {item.remarks && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-600">
                      {item.remarks}
                    </p>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </Section>

    </div>
  )
}