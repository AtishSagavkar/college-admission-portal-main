import { useState } from 'react'
import PublicNavbar from '../../components/layout/PublicNavbar'
import PublicFooter from '../../components/layout/PublicFooter'
import Button from '../../components/common/Button'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((state) => ({ ...state, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Contact</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Get in touch with our team</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold">CampusConnect</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <p>Email: hello@campusconnect.edu</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: 24 Knowledge Avenue, Pune, Maharashtra 411001</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </div>
            <textarea name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Message" className="mt-5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button type="submit">Send Message</Button>
            </div>
            {submitted && <p className="mt-4 text-sm text-emerald-600">Your message has been submitted successfully.</p>}
          </form>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
