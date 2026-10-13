import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../hooks/useAuth'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await resetPassword(email)
    setLoading(false)
    if (result.success) setSubmitted(true)
    else setError(result.message)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-3 text-sm text-slate-600">Enter the email associated with your account.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          {error && <div className="text-sm text-red-600" role="alert">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset instructions'}</Button>
        </form>
        {submitted && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">If an account exists for that email, Firebase has sent password reset instructions.</div>}
        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-emerald-600">Back to login</Link>
      </div>
    </div>
  )
}
