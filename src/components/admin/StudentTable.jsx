import { Link } from 'react-router-dom'

function formatDate(value) {
  if (!value) return 'Not available'

  // Firestore Timestamp
  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleDateString('en-IN')
  }

  // JavaScript Date
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? 'Not available'
      : value.toLocaleDateString('en-IN')
  }

  // Timestamp-like object: { seconds, nanoseconds }
  if (typeof value === 'object' && value?.seconds != null) {
    const date = new Date(value.seconds * 1000)

    return Number.isNaN(date.getTime())
      ? 'Not available'
      : date.toLocaleDateString('en-IN')
  }

  // String or number
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Not available'
    : date.toLocaleDateString('en-IN')
}

export default function StudentTable({ students = [], basePath = '/admin/students' }) {
  if (!students.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        No students found.
      </div>
    )
  }

  return (
    <>
    <div className="space-y-3 md:hidden">
      {students.map((student) => (
        <article key={student.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="break-words font-semibold text-slate-900">{student.name || 'Not provided'}</h2>
              <p className="mt-1 break-all text-xs text-slate-500">{student.email || 'No email provided'}</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              {(student.admissionStatus || 'pending').replace(/_/g, ' ')}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div className="min-w-0">
              <dt className="text-slate-500">Student ID</dt>
              <dd className="mt-0.5 break-all font-medium text-slate-800">{student.id}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-slate-500">Phone</dt>
              <dd className="mt-0.5 break-words font-medium text-slate-800">{student.phone || 'Not provided'}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-slate-500">Course</dt>
              <dd className="mt-0.5 break-words font-medium text-slate-800">{student.course || 'Not selected'}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-slate-500">Joined</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{formatDate(student.createdAt)}</dd>
            </div>
          </dl>
          <Link
            to={`${basePath}/${student.id}`}
            className="mt-4 inline-flex rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            View student
          </Link>
        </article>
      ))}
    </div>
    <div className="hidden max-h-[calc(100dvh-380px)] min-h-[240px] overflow-auto rounded-2xl border border-slate-200 md:block">
      <table className="min-w-[800px] text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Student ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Admission Status</th>
            <th className="px-4 py-3">Joined Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-t border-slate-200 align-top"
            >
              <td className="px-4 py-3 font-medium text-slate-800">
                {student.id}
              </td>

              <td className="px-4 py-3">
                {student.name || 'Not provided'}
              </td>

              <td className="px-4 py-3">
                {student.email || 'Not provided'}
              </td>

              <td className="px-4 py-3">
                {student.phone || 'Not provided'}
              </td>

              <td className="px-4 py-3">
                {student.course || 'Not selected'}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {student.admissionStatus || 'pending'}
                </span>
              </td>

              <td className="px-4 py-3">
                {formatDate(student.createdAt)}
              </td>

              <td className="px-4 py-3">
                <Link
                  to={`${basePath}/${student.id}`}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}