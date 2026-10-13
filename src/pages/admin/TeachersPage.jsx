const teachers = [
  { name: 'Dr. Kavya Sharma', department: 'Computer Science', classes: 4, status: 'Available' },
  { name: 'Mr. Rohan Verma', department: 'Business Studies', classes: 3, status: 'On duty' },
  { name: 'Ms. Aditi Sinha', department: 'Humanities', classes: 2, status: 'Available' },
  { name: 'Mr. Vikram Nair', department: 'Mathematics', classes: 5, status: 'Busy' },
]

export default function TeachersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Teachers</h1>
        <p className="mt-2 text-sm text-slate-600">Overview of faculty assignments and department coverage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teachers.map((teacher) => (
          <div key={teacher.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold text-slate-900">{teacher.name}</div>
            <div className="mt-2 text-sm text-slate-500">{teacher.department}</div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-600">Classes</span>
              <span className="font-semibold text-slate-900">{teacher.classes}</span>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">{teacher.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
