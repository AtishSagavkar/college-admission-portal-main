import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { mockServices } from '../../data/mockServices'
import { createRequest } from '../../services/serviceRequestService'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'

export default function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const service = mockServices.find((item) => item.id === id)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!service) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">Service not found.</div>

  const handleSubmit = async () => {
    if (!currentUser?.uid) {
      setError('You need to be logged in to request a service.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await createRequest({
        studentId: currentUser.uid,
        serviceId: service.id,
        serviceName: service.name,
        description,
      })
      setSubmitted(true)
      setTimeout(() => {
        navigate('/student/services')
      }, 800)
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong while submitting the request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">{service.name}</h1>
      <p className="mt-3 text-slate-600">{service.description}</p>
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Additional Information
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="5" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Tell us more about your request" />
        </label>
        <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</Button>
        {error && <div className="text-sm text-red-600" role="alert">{error}</div>}
        {submitted && <div className="text-sm text-emerald-600">Service request submitted successfully.</div>}
      </div>
    </div>
  )
}
