import { useMemo, useState } from 'react'
import { getStudents } from '../../services/studentService'
import SearchBar from '../../components/common/SearchBar'
import StudentTable from '../../components/admin/StudentTable'
import FilterSelect from '../../components/common/FilterSelect'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

export default function StudentsPage({ basePath = '/admin/students' }) {
  const { data: students, loading, error } = useRemoteData(getStudents, 'admin-students', [])
  const [search, setSearch] = useState('')
  const [course, setCourse] = useState('All')
  const [status, setStatus] = useState('All')

  const filtered = useMemo(() => {
    let result = [...students]
    if (search) {
      result = result.filter((student) => [student.name, student.email, student.phone, student.id].join(' ').toLowerCase().includes(search.toLowerCase()))
    }
    if (course !== 'All') {
      result = result.filter((student) => student.course === course)
    }
    if (status !== 'All') {
      result = result.filter((student) => (student.admissionStatus || 'pending') === status)
    }
    return result
  }, [students, search, course, status])

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        <p className="mt-2 text-sm text-slate-600">Monitor student profiles and admissions pipeline.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email" />
          <FilterSelect
            label="Filter by course"
            value={course}
            onChange={setCourse}
            options={[
              { value: 'All', label: 'All Courses' },
              { value: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
              { value: 'BBA', label: 'BBA' },
              { value: 'MBA', label: 'MBA' },
              { value: 'B.Com', label: 'B.Com' },
            ]}
          />
          <FilterSelect
            label="Filter by admission status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'under_review', label: 'Under review' },
              { value: 'documents_verified', label: 'Docs verified' },
              { value: 'teacher_approved', label: 'Teacher approved' },
              { value: 'approved', label: 'Admission approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
        </div>
      </div>

      <div className="mt-6">
        <StudentTable students={filtered} basePath={basePath} />
      </div>
    </div>
  )
}
