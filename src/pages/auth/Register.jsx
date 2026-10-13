import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { House } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { isValidEmail, isValidPhone, validatePassword } from '../../utils/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export default function Register() {
  const { register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!isValidEmail(form.email)) nextErrors.email = 'Please enter a valid email.'
    if (!isValidPhone(form.phone)) nextErrors.phone = 'Phone number must be 10 digits.'
    const passwordError = validatePassword(form.password)
    if (passwordError) nextErrors.password = passwordError
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((state) => ({ ...state, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    })

    setLoading(false)
    if (!result.success) {
      setErrors({ email: result.message })
      return
    }

    navigate('/student/dashboard', {
      state: location.state?.selectedCourse
        ? { selectedCourse: location.state.selectedCourse }
        : undefined,
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-100 px-4 py-4 sm:py-8">
      <div className="my-auto w-full max-w-xl">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <House size={16} />
            Home
          </Link>
        </div>
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-slate-900"><span className="text-emerald-600">Campus</span>Connect</div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
          <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-emerald-600">Login</Link></p>
      </div>
      </div>
    </div>
  )
}
