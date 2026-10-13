import { ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicNavbar from '../../components/layout/PublicNavbar'
import PublicFooter from '../../components/layout/PublicFooter'
import { formatINR, getCourseFeeBreakdown } from '../../data/courseFees'

const reasons = [
  { icon: ClipboardCheck, title: 'Easy Online Admission', text: 'Register, fill, and submit your application in a few guided steps.' },
  { icon: CheckCircle2, title: 'Application Tracking', text: 'Track status and review updates without repeated follow-ups.' },
  { icon: Users, title: 'Student Services', text: 'Access certificates, scholarships, exam forms, and help desk support.' },
  { icon: ShieldCheck, title: 'Secure Student Portal', text: 'Protected profiles and secure communication for every student journey.' },
]

const courses = [
  { name: 'B.Sc Computer Science', description: 'For students preparing for technology, software, and research-driven careers.', duration: '3 Years' },
  { name: 'BCA', description: 'Ideal for aspiring software developers and application specialists.', duration: '3 Years' },
  { name: 'B.Com', description: 'Focused on commerce, accounting, finance, and business management.', duration: '3 Years' },
  { name: 'B.A', description: 'Strong foundation in humanities, social sciences, and public life.', duration: '3 Years' },
  { name: 'B.Sc', description: 'Explores applied sciences, analytics, and interdisciplinary learning.', duration: '3 Years' },
]

const serviceHighlights = ['Bonafide Certificate', 'Leaving Certificate', 'Scholarship', 'Exam Form', 'Student ID', 'Notes', 'Support']

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="home-animate flex flex-col justify-center">
            <div className="home-animate-delay-1 mb-4 inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Admissions Open</div>
            <h1 className="home-animate-delay-2 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Your Future Starts Here</h1>
            <p className="home-animate-delay-3 mt-6 max-w-xl text-lg text-slate-600">Apply for admission, track your application, and access college services from one simple portal.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700">Apply for Admission <ArrowRight className="ml-2" size={16} /></Link>
              <Link to="/services" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50">Explore Services</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-600">
              <div><span className="block text-2xl font-bold text-slate-900">5000+</span> Students</div>
              <div><span className="block text-2xl font-bold text-slate-900">25+</span> Courses</div>
              <div><span className="block text-2xl font-bold text-slate-900">100+</span> Faculty</div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-10 rounded-[2rem] bg-emerald-100 blur-3xl" />
            <div className="home-float relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80" alt="Students collaborating" className="h-[430px] w-full rounded-[1.5rem] object-cover" />
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg shadow-slate-900/10">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-xs text-slate-300">Satisfaction</div>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 text-slate-900 shadow-lg shadow-emerald-100/80">
                  <div className="text-2xl font-bold">12k</div>
                  <div className="text-xs text-slate-600">Applications</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 text-slate-900 shadow-lg shadow-slate-200/50">
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-xs text-slate-600">Portal Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Why choose our portal</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">A smoother student journey</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {reasons.map(({ icon: Icon, title, text }) => (
                <div key={title} className="home-card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600"><Icon size={22} /></div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Admission process</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">How it works</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
            {['Register', 'Complete Application', 'Upload Documents', 'Submit', 'Verification', 'Admission Decision'].map((step, index) => (
              <div key={step} className="home-card-hover rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/20">{index + 1}</div>
                <div className="text-sm font-semibold text-slate-800">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Courses</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Choose your path</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {courses.map((course) => (
                <div key={course.name} className="home-card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-600"><BookOpen size={18} /></div>
                  <h3 className="text-lg font-semibold text-slate-900">{course.name}</h3>
                  <p className="mt-3 text-sm text-slate-600">{course.description}</p>
                  <div className="mt-4 text-sm font-medium text-slate-500">Duration: {course.duration}</div>
                  <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Total course fee</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{formatINR(getCourseFeeBreakdown(course.name).totalFee)}</div>
                  </div>
                  <Link
                    to="/admissions"
                    state={{ selectedCourse: course.name }}
                    className="mt-5 inline-flex rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                  >
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Student services</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Everything you need in one place</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceHighlights.map((service) => (
              <div key={service} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">{service}</div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 py-16 text-white">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Ready to start?</p>
              <h2 className="mt-3 text-3xl font-bold">Ready to start your college journey?</h2>
            </div>
            <Link to="/register" className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Apply Now <ArrowRight className="ml-2" size={16} /></Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
