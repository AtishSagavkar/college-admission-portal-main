import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, House } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const initialState = { email: '', password: '' }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(form.email, form.password)
    if (!result.success) {
      setError(result.message)
      setLoading(false)
      return
    }

    const role = result.user.role
    if (role === 'admin') navigate('/admin/dashboard')
    else if (role === 'teacher') navigate('/teacher/dashboard')
    else navigate('/student/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-100 px-4 py-4 sm:py-8">
      <div className="my-auto w-full max-w-5xl">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <House size={16} />
          Home
        </Link>
      </div>
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-slate-900 text-white lg:flex lg:flex-col lg:justify-between">
          <img
            src="https://images.unsplash.com/photo-1562771382-84d2a5a84f36?auto=format&fit=crop&w=1200&q=80"
            alt="College campus"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950/90" />

          <div className="relative z-10 p-8">
            <div className="text-2xl font-bold"><span className="text-emerald-400">Campus</span>Connect</div>
            <h1 className="mt-8 text-4xl font-bold">Welcome back</h1>
            <p className="mt-4 max-w-sm text-slate-300">Access your portal, admission tracker, notices, and student services.</p>

          </div>

          <div className="relative z-10 p-8 text-sm text-slate-300">
            Sign in to continue to your applications, student services, and account details.
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-600">Access your student or staff portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <div className="relative">
              <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} />
              <button type="button" onClick={() => setShowPassword((state) => !state)} className="absolute right-3 top-11 text-slate-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" /> Remember me</label>
              <Link to="/forgot-password" className="text-emerald-600">Forgot password?</Link>
            </div>
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">Don't have an account? <Link to="/register" className="font-semibold text-emerald-600">Register</Link></p>
        </div>
      </div>
      </div>
    </div>
  )
}
