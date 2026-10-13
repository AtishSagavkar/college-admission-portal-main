import { useState } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import PublicNavbar from '../../components/layout/PublicNavbar'
import PublicFooter from '../../components/layout/PublicFooter'
import { formatINR, getCourseFeeBreakdown } from '../../data/courseFees'

const courses = ['B.Sc Computer Science', 'BCA', 'B.Com', 'B.A', 'B.Sc']

export default function Admissions() {
  const location = useLocation()
  const [selectedCourse, setSelectedCourse] = useState(
    courses.includes(location.state?.selectedCourse) ? location.state.selectedCourse : courses[0],
  )
  const fee = getCourseFeeBreakdown(selectedCourse)

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Admissions</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Start your application journey</h1>
        </div>

        <section className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Selected program</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedCourse}</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-1">
                <div className="rounded-xl border border-slate-200 bg-white p-3"><span className="block text-xs text-slate-500">Total course fee</span><strong className="mt-1 block text-slate-900">{formatINR(fee.totalFee)}</strong></div>
              </div>
            </div>
            <Link
              to="/register"
              state={{ selectedCourse }}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Apply for {selectedCourse}
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-2xl font-bold text-slate-900">Admission process</h2>
            <ol className="mt-6 space-y-4 text-slate-600">
              <li>1. Register with your valid email and mobile number.</li>
              <li>2. Complete the online admission form and academic details.</li>
              <li>3. Upload the required documents and ID proof.</li>
              <li>4. Review the application summary and submit.</li>
              <li>5. Admissions team verifies your application.</li>
              <li>6. Final decision is communicated through your student portal.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Eligibility</h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Completed 10+2 or equivalent from a recognized board.</li>
              <li>• Minimum qualifying marks as per the selected course.</li>
              <li>• Submission of valid academic certificates and identity proof.</li>
              <li>• Applicants with valid category certificates may be eligible for special consideration.</li>
            </ul>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Required documents</h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              <li>• Passport photo</li>
              <li>• 10th marksheet</li>
              <li>• 12th marksheet</li>
              <li>• Leaving certificate</li>
              <li>• Identity proof</li>
              <li>• Caste certificate (optional)</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Available courses</h2>
            <div className="mt-6 grid gap-3">
              {courses.map((course) => {
                const courseFee = getCourseFeeBreakdown(course)
                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    aria-pressed={course === selectedCourse}
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      course === selectedCourse
                        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2"><BookOpen size={16} />{course}</span>
                    <span className="text-xs font-semibold">{formatINR(courseFee.totalFee)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link to="/register" state={{ selectedCourse }} className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Apply Now <ArrowRight className="ml-2" size={16} /></Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
