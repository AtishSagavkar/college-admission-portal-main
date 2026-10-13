import PublicNavbar from '../../components/layout/PublicNavbar'
import PublicFooter from '../../components/layout/PublicFooter'

const stats = [
  { value: '5000+', label: 'Students' },
  { value: '25+', label: 'Courses' },
  { value: '100+', label: 'Faculty' },
  { value: '95%', label: 'Student Satisfaction' },
]

const values = ['Excellence', 'Integrity', 'Innovation', 'Student First']

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">About CampusConnect</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Empowering students to thrive</h1>
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-8">
            <h2 className="text-2xl font-bold text-slate-900">About the college</h2>
            <p className="mt-4 text-slate-600">CampusConnect College is built on the belief that a great education should be accessible, practical, and empowering. We combine academic rigor with student-centered support to prepare learners for meaningful careers and life-changing opportunities.</p>
            <p className="mt-4 text-slate-600">Our community values curiosity, innovation, and collaboration, creating a learning environment where students can flourish academically and personally.</p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80" alt="Campus" className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">Mission</h3>
            <p className="mt-4 text-slate-600">To provide inclusive, high-quality education supported by mentorship, technology, and student services that help every learner succeed.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">Vision</h3>
            <p className="mt-4 text-slate-600">To become a leading student-focused institution known for innovation, leadership, and transformative learning outcomes.</p>
          </div>
        </section>

        <section className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900">Our values</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div key={value} className="rounded-2xl bg-emerald-50 px-5 py-4 text-center font-semibold text-emerald-700">{value}</div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-slate-900 p-8 text-white">
          <h3 className="text-2xl font-bold">Why students choose us</h3>
          <ul className="mt-6 space-y-3 text-slate-200">
            <li>• Industry-relevant curriculum and committed faculty</li>
            <li>• Strong academic support and mentoring</li>
            <li>• Flexible online services and student-first systems</li>
            <li>• Inclusive, supportive campus culture</li>
          </ul>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
