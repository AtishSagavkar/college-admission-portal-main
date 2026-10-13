import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicNavbar from '../../components/layout/PublicNavbar'
import PublicFooter from '../../components/layout/PublicFooter'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import { useAuth } from '../../hooks/useAuth'
import { mockServices } from '../../data/mockServices'
import { createRequest } from '../../services/serviceRequestService'

export default function ServicesPublic() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [selectedService, setSelectedService] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', studentNumber: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!currentUser?.uid) {
      setError('Please log in with your student account to submit this application.')
      return
    }
    if (currentUser.role !== 'student') {
      setError('Only student accounts can apply for services.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await createRequest({
        studentId: currentUser.uid,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        requesterName: form.fullName.trim(),
        requesterEmail: form.email.trim(),
        requesterPhone: form.phone.trim(),
        studentNumber: form.studentNumber.trim(),
        description: form.description.trim(),
      })
      setSelectedService(null)
      navigate('/student/requests')
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong while submitting your application.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Student services</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Support that moves with you</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {mockServices.map((service) => (
            <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{service.category}</div>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">{service.name}</h2>
              <p className="text-sm leading-6 text-slate-600">{service.description}</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedService(service)
                  setForm({
                    fullName: currentUser?.profile?.fullName || currentUser?.name || '',
                    email: currentUser?.profile?.email || currentUser?.email || '',
                    phone: currentUser?.profile?.phone || currentUser?.phone || '',
                    studentNumber: currentUser?.profile?.studentNumber || '',
                    description: '',
                  })
                  setError('')
                }}
                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />

      <Modal
        open={Boolean(selectedService)}
        title={selectedService ? `Apply for ${selectedService.name}` : 'Apply for service'}
        onClose={() => setSelectedService(null)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required autoComplete="name" />
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" />
            <Input label="Phone number" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required autoComplete="tel" />
            <Input label="Student number" value={form.studentNumber} onChange={(event) => setForm({ ...form, studentNumber: event.target.value })} required placeholder="Enter your roll or enrollment number" />
          </div>
          <Textarea
            label="Other details about your request"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            rows={4}
            required
            placeholder="Explain why you need this service and include any important details."
          />
          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="alert">
              {error} {!currentUser?.uid && <Link to="/login" className="font-semibold underline">Log in</Link>}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
