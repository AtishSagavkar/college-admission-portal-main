import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { saveProfile } from '../../services/studentService'
import Button from '../../components/common/Button'

const emptyProfile = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'Male',
  bloodGroup: 'O+',
  nationality: 'Indian',
  category: 'General',
  address: '',
  city: '',
  state: '',
  pincode: '',
  tenthSchool: '',
  tenthBoard: '',
  tenthPercentage: '',
  tenthPassingYear: '',
  twelfthCollege: '',
  twelfthBoard: '',
  twelfthPercentage: '',
  twelfthPassingYear: '',
  board: '',
}

function getProfileFromUser(currentUser) {
  const userProfile = currentUser?.profile || {}
  return {
    ...emptyProfile,
    ...userProfile,
    fullName: userProfile.fullName || currentUser?.name || '',
    email: userProfile.email || currentUser?.email || '',
    phone: userProfile.phone || currentUser?.phone || '',
    dateOfBirth: userProfile.dateOfBirth || '',
    gender: userProfile.gender || 'Male',
    bloodGroup: userProfile.bloodGroup || 'O+',
    nationality: userProfile.nationality || 'Indian',
    category: userProfile.category || 'General',
    address: userProfile.address || '',
    city: userProfile.city || '',
    state: userProfile.state || '',
    pincode: userProfile.pincode || '',
    tenthSchool: userProfile.tenthSchool || '',
    tenthBoard: userProfile.tenthBoard || '',
    tenthPercentage: userProfile.tenthPercentage ?? '',
    tenthPassingYear: userProfile.tenthPassingYear ?? '',
    twelfthCollege: userProfile.twelfthCollege || '',
    twelfthBoard: userProfile.twelfthBoard || '',
    twelfthPercentage: userProfile.twelfthPercentage ?? '',
    twelfthPassingYear: userProfile.twelfthPassingYear ?? '',
  }
}

export default function StudentProfile() {
  const { currentUser, refreshCurrentUser } = useAuth()
  const [profile, setProfile] = useState(() => getProfileFromUser(currentUser))
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((state) => ({ ...state, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const result = await saveProfile(currentUser.uid, profile)
      if (!result.success) throw new Error(result.message)
      await refreshCurrentUser()
      setSaved(true)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Student Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your personal and academic information.</p>
      </div>

      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <input name="fullName" value={profile.fullName} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Full Name" />
            <input name="email" value={profile.email} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Email" />
            <input name="phone" value={profile.phone} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Phone" />
            <input name="dateOfBirth" type="date" value={profile.dateOfBirth} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            <select name="gender" value={profile.gender} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Address</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <input name="address" value={profile.address} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" placeholder="Address" />
            <input name="city" value={profile.city} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="City" />
            <input name="state" value={profile.state} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="State" />
            <input name="pincode" value={profile.pincode} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Pincode" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Academic</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <input name="tenthSchool" value={profile.tenthSchool} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="10th School" />
            <input name="tenthPercentage" value={profile.tenthPercentage} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="10th Percentage" />
            <input name="tenthPassingYear" value={profile.tenthPassingYear} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="10th Passing Year" />
            <input name="twelfthCollege" value={profile.twelfthCollege} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="12th College" />
            <input name="twelfthPercentage" value={profile.twelfthPercentage} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="12th Percentage" />
            <input name="twelfthPassingYear" value={profile.twelfthPassingYear} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="12th Passing Year" />
            <input name="board" value={profile.board} onChange={handleChange} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" placeholder="Board" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          {saved && <span className="text-sm text-emerald-600">Profile updated successfully.</span>}
          {error && <span className="text-sm text-red-600" role="alert">{error}</span>}
        </div>
      </div>
    </div>
  )
}
