import { Link } from 'react-router-dom'

export default function ApplicationTable({ applications = [], getDetailsPath = (application) => `/admin/applications/${application.id}` }) {
  if (!applications.length) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">No applications found.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Application No.</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Percentage</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-t border-slate-200 align-top">
              <td className="px-4 py-3 font-medium text-slate-800">{application.applicationNumber}</td>
              <td className="px-4 py-3">{application.personalInfo?.fullName}</td>
              <td className="px-4 py-3">{application.contactInfo?.email}</td>
              <td className="px-4 py-3">{application.courseInfo?.preferredCourse}</td>
              <td className="px-4 py-3">{application.academicInfo?.twelfthPercentage}%</td>
              <td className="px-4 py-3">{new Date(application.submittedAt).toLocaleDateString('en-IN')}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">{application.status}</span></td>
              <td className="px-4 py-3"><Link to={getDetailsPath(application)} className="text-emerald-600 hover:text-emerald-700">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
