import { useMemo, useState } from 'react'
import { getApplications } from '../../services/applicationService'
import SearchBar from '../../components/common/SearchBar'
import ApplicationTable from '../../components/admin/ApplicationTable'
import { COURSE_OPTIONS } from '../../utils/constants'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

const statusOptions = ['All', 'submitted', 'under_review', 'teacher_approved', 'approved', 'rejected']

export default function ApplicationsPage({ teacherView = false }) {
  const { data: applications, loading, error } = useRemoteData(getApplications, 'admin-applications', [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')

  const filtered = useMemo(() => {
    let result = [...applications]
    if (search) {
      result = result.filter((app) => [app.applicationNumber, app.personalInfo?.fullName, app.contactInfo?.email, app.contactInfo?.phone].join(' ').toLowerCase().includes(search.toLowerCase()))
    }
    if (statusFilter !== 'All') {
      result = result.filter((app) => app.status === statusFilter)
    }
    if (courseFilter !== 'All') {
      result = result.filter((app) => app.courseInfo?.preferredCourse === courseFilter)
    }
    if (sortBy === 'Newest') result = result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    if (sortBy === 'Oldest') result = result.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
    if (sortBy === 'Name A-Z') result = result.sort((a, b) => (a.personalInfo?.fullName || '').localeCompare(b.personalInfo?.fullName || ''))
    if (sortBy === 'Name Z-A') result = result.sort((a, b) => (b.personalInfo?.fullName || '').localeCompare(a.personalInfo?.fullName || ''))
    if (sortBy === 'Percentage High-Low') result = result.sort((a, b) => (b.academicInfo?.twelfthPercentage || 0) - (a.academicInfo?.twelfthPercentage || 0))
    if (sortBy === 'Percentage Low-High') result = result.sort((a, b) => (a.academicInfo?.twelfthPercentage || 0) - (b.academicInfo?.twelfthPercentage || 0))
    return result
  }, [applications, search, statusFilter, courseFilter, sortBy])

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{teacherView ? 'Student Applications' : 'Applications'}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {teacherView ? 'Review student admission applications and open student records.' : 'Review admissions, search, and manage applications.'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or application number" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
            {statusOptions.map((status) => <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="All">All Courses</option>
            {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{course}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
            {['Newest', 'Oldest', 'Name A-Z', 'Name Z-A', 'Percentage High-Low', 'Percentage Low-High'].map((sort) => <option key={sort}>{sort}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <ApplicationTable
          applications={filtered}
          getDetailsPath={(application) => teacherView
            ? `/teacher/students/${application.studentId || application.ownerUid}`
            : `/admin/applications/${application.id}`}
        />
      </div>
    </div>
  )
}
