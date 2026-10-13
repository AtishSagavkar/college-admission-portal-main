import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockServices } from '../../data/mockServices'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import { useAuth } from '../../hooks/useAuth'
import { createRequest } from '../../services/serviceRequestService'

export default function StudentServicesPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [selectedService, setSelectedService] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', studentNumber: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleRequestService = (service) => {
    setSelectedService(service)
    setForm({
      fullName: currentUser?.profile?.fullName || currentUser?.name || '',
      email: currentUser?.profile?.email || currentUser?.email || '',
      phone: currentUser?.profile?.phone || currentUser?.phone || '',
      studentNumber: currentUser?.profile?.studentNumber || '',
      description: '',
    })
    setError('')
  }

  const handleSubmitRequest = async (event) => {
    event.preventDefault()
    if (!selectedService) return

    if (!currentUser?.uid) {
      setError('Please log in before applying for a service.')
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
      setError(requestError.message || 'Something went wrong while submitting your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="service-page">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Services</h1>
          <p className="mt-2 text-sm text-slate-600">Request certificates, support, and academic services.</p>
        </div>
      </div>

      <div className="service-scroll-region grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockServices.map((service, index) => (
          <div
            key={service.id}
            className="service-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{service.category}</div>
            <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
            <p className="mt-3 text-sm text-slate-600">{service.description}</p>
            <button
              type="button"
              onClick={() => handleRequestService(service)}
              className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={Boolean(selectedService)}
        title={selectedService ? `Apply for ${selectedService.name}` : 'Apply for service'}
        onClose={() => setSelectedService(null)}
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Add your contact and student details. Your application will be sent to the teacher and admin for review.
          </p>

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

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
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
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
