import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { createApplication, getApplicationsByUser } from '../../services/applicationService'
import { saveProfile } from '../../services/studentService'
import { useRemoteData } from '../../hooks/useRemoteData'
import {
  uploadApplicationDocuments,
  deleteApplicationDocument,
} from '../../services/documentService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import { COURSE_OPTIONS } from '../../utils/constants'
import { validatePercentage } from '../../utils/validation'
import { findEducationPlaces, getCitiesForDistrict, getDistrictsForState, INDIAN_STATES } from '../../services/educationPlaceService'
import { sangliTenthSchools, sangliTwelfthColleges } from '../../data/sangliInstitutions'
import { formatINR, getCourseFeeBreakdown } from '../../data/courseFees'

const steps = ['Personal', 'Contact', 'Academic', 'Course', 'Documents', 'Review']
const requiredDocuments = [
  { type: 'tenth_marksheet', label: '10th Marksheet' },
  { type: 'twelfth_marksheet', label: '12th Marksheet' },
  { type: 'aadhaar_card', label: 'Aadhaar Card' },
]
const boardOptions = [
  'Maharashtra State Board',
  'CBSE',
  'ICSE / ISC',
  'IB',
  'NIOS',
  'Other',
]
const currentYear = new Date().getFullYear()
const passingYearValues = Array.from(
  { length: currentYear - 1950 + 1 },
  (_, index) => String(currentYear - index),
)

const getBoardOptions = (savedBoard) => [
  { value: '', label: 'Select board type' },
  ...boardOptions.map((board) => ({ value: board, label: board })),
  ...(savedBoard && !boardOptions.includes(savedBoard)
    ? [{ value: savedBoard, label: `${savedBoard} (saved)` }]
    : []),
]

const getPassingYearOptions = (savedYear) => [
  { value: '', label: 'Select passing year' },
  ...(savedYear && !passingYearValues.includes(String(savedYear))
    ? [{ value: String(savedYear), label: `${savedYear} (saved)` }]
    : []),
  ...passingYearValues.map((year) => ({ value: year, label: year })),
]

const initialForm = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Male',
  bloodGroup: 'O+',
  nationality: 'Indian',
  category: 'General',
  email: '',
  phone: '',
  alternatePhone: '',
  address: '',
  district: '',
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
  preferredCourse: COURSE_OPTIONS[0],
  documents: [],
  confirm: false,
}

export default function AdmissionForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()

  const { data: applications = [] } = useRemoteData(
    () => getApplicationsByUser(currentUser.uid),
    currentUser?.uid || '',
    []
  )

  useEffect(() => {
    if (applications.length > 0) {
      navigate('/student/application', { replace: true })
    }
  }, [applications, navigate])

  const [form, setForm] = useState(() => {
    const profile = currentUser?.profile || {}

    return {
      ...initialForm,
      ...profile,
      preferredCourse: COURSE_OPTIONS.includes(location.state?.selectedCourse)
        ? location.state.selectedCourse
        : profile.preferredCourse || initialForm.preferredCourse,
      fullName: profile.fullName || currentUser?.name || '',
      email: profile.email || currentUser?.email || '',
      phone: profile.phone || currentUser?.phone || '',
      dateOfBirth: profile.dateOfBirth || '',
      gender: profile.gender || 'Male',
      bloodGroup: profile.bloodGroup || 'O+',
      nationality: profile.nationality || 'Indian',
      category: profile.category || 'General',
      address: profile.address || '',
      district: profile.district || '',
      city: profile.city || '',
      state: profile.state || '',
      pincode: profile.pincode || '',
      tenthSchool: profile.tenthSchool || '',
      tenthBoard: profile.tenthBoard || '',
      tenthPercentage: profile.tenthPercentage ?? '',
      tenthPassingYear: profile.tenthPassingYear ?? '',
      twelfthCollege: profile.twelfthCollege || '',
      twelfthBoard: profile.twelfthBoard || '',
      twelfthPercentage: profile.twelfthPercentage ?? '',
      twelfthPassingYear: profile.twelfthPassingYear ?? '',
    }
  })

  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [removingDocument, setRemovingDocument] = useState(null)
  const [institutionOptions, setInstitutionOptions] = useState({ tenth: [], twelfth: [] })
  const [searchingInstitutions, setSearchingInstitutions] = useState(false)
  const [institutionSearchMessage, setInstitutionSearchMessage] = useState('')
  const [manualInstitutionFields, setManualInstitutionFields] = useState({})
  const [cityOptions, setCityOptions] = useState([])
  const [citiesLoadedFor, setCitiesLoadedFor] = useState('')
  const [cityLookupError, setCityLookupError] = useState('')
  const [manualCity, setManualCity] = useState(false)
  const districtOptions = getDistrictsForState(form.state)
  const cityScope = `${form.state}:${form.district}`

  useEffect(() => {
    if (!form.state || !form.district) return undefined
    let active = true

    getCitiesForDistrict(form.state, form.district)
      .then((cities) => {
        if (!active) return
        setCityOptions(cities)
        setCitiesLoadedFor(cityScope)
        setCityLookupError('')
      })
      .catch((cityError) => {
        if (!active) return
        setCityOptions([])
        setCitiesLoadedFor(cityScope)
        setCityLookupError(cityError.message || 'Unable to load cities. You can enter yours manually.')
      })

    return () => {
      active = false
    }
  }, [form.state, form.district, cityScope])

  const updateField = (field, value) => {
    setForm((state) => ({
      ...state,
      [field]: value,
      ...(field === 'city' || field === 'district' || field === 'state'
        ? { tenthSchool: '', twelfthCollege: '' }
        : {}),
    }))
    if (field === 'city' || field === 'district' || field === 'state') {
      setInstitutionOptions({ tenth: [], twelfth: [] })
      setInstitutionSearchMessage('')
      setManualInstitutionFields({ tenthSchool: false, twelfthCollege: false })
    }
  }

  const handleFindInstitutions = async (location = form) => {
    setSearchingInstitutions(true)
    setInstitutionSearchMessage('')

    if (location.state === 'Maharashtra' && location.district === 'Sangli') {
      setInstitutionOptions({
        tenth: sangliTenthSchools.map((name) => ({ name, kind: 'school' })),
        twelfth: sangliTwelfthColleges.map((name) => ({ name, kind: 'junior college' })),
      })
      setInstitutionSearchMessage('Loaded 30 Sangli schools and 30 Sangli junior colleges.')
      setSearchingInstitutions(false)
      return
    }

    try {
      const places = await findEducationPlaces(location.city, location.district, location.state)
      setInstitutionOptions({
        tenth: places.filter((place) => place.kind === 'school'),
        twelfth: places.filter((place) => ['college', 'university'].includes(place.kind)),
      })
      setInstitutionSearchMessage(
        places.length
          ? `Found ${places.length} nearby institutions. Choose from the matching school or college list.`
          : 'No schools or colleges were listed for this area. Choose manual entry in either list.'
      )
    } catch (searchError) {
      setInstitutionSearchMessage(searchError.message || 'Unable to find nearby institutions. You can type the name instead.')
    } finally {
      setSearchingInstitutions(false)
    }
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Name is required.'
    }

    if (!form.dateOfBirth) {
      nextErrors.dateOfBirth = 'Date of birth is required.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone is required.'
    }

    if (!form.address.trim()) {
      nextErrors.address = 'Address is required.'
    }

    const tenthError = validatePercentage(form.tenthPercentage)
    const twelfthError = validatePercentage(form.twelfthPercentage)
    const tenthYear = Number(form.tenthPassingYear)
    const twelfthYear = Number(form.twelfthPassingYear)

    if (tenthError) nextErrors.tenthPercentage = tenthError
    if (twelfthError) nextErrors.twelfthPercentage = twelfthError

    if (!form.tenthBoard) nextErrors.tenthBoard = 'Select your 10th board type.'
    if (!form.twelfthBoard) nextErrors.twelfthBoard = 'Select your 12th board type.'
    if (!form.tenthPassingYear) nextErrors.tenthPassingYear = 'Select your 10th passing year.'
    if (!form.twelfthPassingYear) nextErrors.twelfthPassingYear = 'Select your 12th passing year.'
    if (form.twelfthPassingYear && form.tenthPassingYear && twelfthYear < tenthYear) {
      nextErrors.twelfthPassingYear = '12th passing year cannot be earlier than 10th passing year.'
    }

    if (!form.tenthSchool.trim()) {
      nextErrors.tenthSchool = '10th school or college name is required.'
    }

    if (!form.twelfthCollege.trim()) {
      nextErrors.twelfthCollege = '12th school or college name is required.'
    }

    requiredDocuments.forEach(({ type, label }) => {
      if (!form.documents.some((document) => document.documentType === type)) {
        nextErrors[type] = `${label} is required.`
      }
    })

    if (!form.confirm) {
      nextErrors.confirm = 'Please confirm your information before submitting.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  // Upload documents
  const handleDocumentUpload = async (event, documentType) => {
    const fileList = Array.from(
      event.target.files || []
    )

    if (!fileList.length) return

    setUploading(true)

    setErrors((state) => ({
      ...state,
      [documentType]: '',
    }))

    try {
      const uploadedDocuments =
        await uploadApplicationDocuments(
          currentUser.uid,
          fileList
        )
      const documentLabel = requiredDocuments.find((document) => document.type === documentType)?.label || 'Supporting Document'

      setForm((state) => ({
        ...state,
        documents: [
          ...state.documents.filter((document) => document.documentType !== documentType),
          ...uploadedDocuments.map((document) => ({ ...document, documentType, documentLabel })),
        ],
      }))
    } catch (error) {
      setErrors((state) => ({
        ...state,
        [documentType]:
          error.message ||
          'Failed to upload document.',
      }))
    } finally {
      setUploading(false)

      // Allows selecting the same file again
      event.target.value = ''
    }
  }

  // Remove document
  const handleRemoveDocument = async (documentId) => {
    const document = form.documents.find(
      (item) => item.id === documentId
    )

    if (!document) return

    setRemovingDocument(documentId)

    setErrors((state) => ({
      ...state,
      [document.documentType]: '',
    }))

    try {
      // Cloudinary deletion requires server-side credentials, so this only removes the current form entry.
      await deleteApplicationDocument(
        document.storagePath
      )

      // Remove document from React state
      setForm((state) => ({
        ...state,
        documents: state.documents.filter(
          (item) => item.id !== documentId
        ),
      }))
    } catch (error) {
      setErrors((state) => ({
        ...state,
        [document.documentType]:
          error.message ||
          'Failed to remove document.',
      }))
    } finally {
      setRemovingDocument(null)
    }
  }

  const handleSubmit = async () => {
    const valid = validateForm()

    if (
      !valid ||
      uploading ||
      submitting
    ) {
      return
    }

    setSubmitting(true)

    setErrors((state) => ({
      ...state,
      submit: '',
    }))

    try {
      const profilePayload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        nationality: form.nationality,
        category: form.category,
        address: form.address,
        district: form.district,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        tenthSchool: form.tenthSchool,
        tenthBoard: form.tenthBoard,
        tenthPercentage: form.tenthPercentage,
        tenthPassingYear: form.tenthPassingYear,
        twelfthCollege: form.twelfthCollege,
        twelfthBoard: form.twelfthBoard,
        twelfthPercentage: form.twelfthPercentage,
        twelfthPassingYear: form.twelfthPassingYear,
      }

      const result = await createApplication({
        userId: currentUser.uid,
        studentId: currentUser.uid,

        personalInfo: {
          fullName: form.fullName,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          bloodGroup: form.bloodGroup,
          nationality: form.nationality,
          category: form.category,
        },

        contactInfo: {
          email: form.email,
          phone: form.phone,
          alternatePhone: form.alternatePhone,
          address: form.address,
          district: form.district,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },

        academicInfo: {
          tenthSchool: form.tenthSchool,
          tenthBoard: form.tenthBoard,
          tenthPercentage:
            Number(form.tenthPercentage),
          tenthPassingYear:
            Number(form.tenthPassingYear),

          twelfthCollege:
            form.twelfthCollege,
          twelfthBoard:
            form.twelfthBoard,
          twelfthPercentage:
            Number(form.twelfthPercentage),
          twelfthPassingYear:
            Number(form.twelfthPassingYear),
        },

        courseInfo: {
          preferredCourse:
            form.preferredCourse,
        },

        documents: form.documents,
      })

      if (result.success) {
        try {
          await saveProfile(currentUser.uid, profilePayload)
        } catch (profileError) {
          console.error('Unable to sync profile after admission submission:', profileError)
        }
        navigate('/student/application')
      }
    } catch (error) {
      setErrors((state) => ({
        ...state,
        submit:
          error.message ||
          'Failed to submit application.',
      }))
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep = (activeStep) => {
    // STEP 1 - PERSONAL
    if (activeStep === 0) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={(e) =>
              updateField(
                'fullName',
                e.target.value
              )
            }
            error={errors.fullName}
          />

          <Input
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) =>
              updateField(
                'dateOfBirth',
                e.target.value
              )
            }
            error={errors.dateOfBirth}
          />

          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) =>
              updateField(
                'gender',
                e.target.value
              )
            }
            options={[
              'Male',
              'Female',
              'Other',
            ]}
          />

          <Select
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(e) =>
              updateField(
                'bloodGroup',
                e.target.value
              )
            }
            options={[
              'A+',
              'A-',
              'B+',
              'B-',
              'AB+',
              'AB-',
              'O+',
              'O-',
            ]}
          />

          <Input
            label="Nationality"
            value={form.nationality}
            onChange={(e) =>
              updateField(
                'nationality',
                e.target.value
              )
            }
          />

          <Select
            label="Category"
            value={form.category}
            onChange={(e) =>
              updateField(
                'category',
                e.target.value
              )
            }
            options={[
              'General',
              'OBC',
              'SC',
              'ST',
              'Other',
            ]}
          />
        </div>
      )
    }

    // STEP 2 - CONTACT
    if (activeStep === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              updateField(
                'email',
                e.target.value
              )
            }
            error={errors.email}
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) =>
              updateField(
                'phone',
                e.target.value
              )
            }
            error={errors.phone}
          />

          <Input
            label="Alternate Phone"
            value={form.alternatePhone}
            onChange={(e) =>
              updateField(
                'alternatePhone',
                e.target.value
              )
            }
          />

          <Input
            label="Address"
            value={form.address}
            onChange={(e) =>
              updateField(
                'address',
                e.target.value
              )
            }
            error={errors.address}
            className="md:col-span-2"
          />

          <Select
            label="State"
            value={form.state}
            onChange={(event) => {
              updateField('state', event.target.value)
              updateField('district', '')
              updateField('city', '')
              setCityOptions([])
              setCitiesLoadedFor('')
              setCityLookupError('')
              setManualCity(false)
            }}
            options={[
              { value: '', label: 'Select state or union territory' },
              ...INDIAN_STATES.map((state) => ({ value: state.name, label: state.name })),
            ]}
          />

          <Select
            label="District"
            value={form.district}
            onChange={(event) => {
              updateField('district', event.target.value)
              updateField('city', '')
              setCityOptions([])
              setCitiesLoadedFor('')
              setCityLookupError('')
              setManualCity(false)
            }}
            disabled={!form.state}
            options={[
              { value: '', label: form.state ? 'Select district' : 'Select a state first' },
              ...(!districtOptions.some((district) => district.name === form.district) && form.district
                ? [{ value: form.district, label: `${form.district} (saved)` }]
                : []),
              ...districtOptions.map((district) => ({ value: district.name, label: district.name })),
            ]}
          />

          {manualCity ? (
            <div className="space-y-2">
              <Input
                label="City"
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder="Type your city"
              />
              <button type="button" onClick={() => setManualCity(false)} className="text-xs font-semibold text-emerald-700 hover:underline">
                Choose from city list
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Select
                label="City"
                value={form.city}
                onChange={(event) => {
                  if (event.target.value === '__manual__') {
                    updateField('city', '')
                    setManualCity(true)
                    return
                  }
                  const selectedCity = event.target.value
                  updateField('city', selectedCity)
                  if (selectedCity) {
                    handleFindInstitutions({
                      city: selectedCity,
                      district: form.district,
                      state: form.state,
                    })
                  }
                }}
                disabled={!form.district || citiesLoadedFor !== cityScope}
                options={[
                  { value: '', label: !form.district ? 'Select a district first' : citiesLoadedFor !== cityScope ? 'Loading cities...' : 'Select city' },
                  ...(!cityOptions.includes(form.city) && form.city
                    ? [{ value: form.city, label: `${form.city} (saved)` }]
                    : []),
                  ...cityOptions,
                  { value: '__manual__', label: 'My city is not listed' },
                ]}
              />
              {cityLookupError && <p role="alert" className="text-xs text-amber-700">{cityLookupError}</p>}
            </div>
          )}

          <Input
            label="Pincode"
            value={form.pincode}
            onChange={(e) =>
              updateField(
                'pincode',
                e.target.value
              )
            }
          />
        </div>
      )
    }

    // STEP 3 - ACADEMIC
    if (activeStep === 2) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 rounded-xl bg-slate-50 p-4 md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Find a school or college near your address</h3>
                <p className="mt-1 text-xs text-slate-500">Nearby school and college choices load after you select State, District, and City in Contact.</p>
              </div>
              <Button type="button" variant="secondary" onClick={() => handleFindInstitutions()} disabled={searchingInstitutions || !form.city.trim()}>
                {searchingInstitutions ? 'Loading list...' : 'Reload list'}
              </Button>
            </div>
            {institutionSearchMessage && <p role="status" className="text-xs text-slate-600">{institutionSearchMessage}</p>}
            <p className="text-[11px] text-slate-500">Institution suggestions from OpenStreetMap contributors. Listings may be incomplete.</p>
          </div>

          {manualInstitutionFields.tenthSchool ? (
            <div className="space-y-2">
              <Input label="10th School / College Name" value={form.tenthSchool} onChange={(event) => updateField('tenthSchool', event.target.value)} error={errors.tenthSchool} />
              <button type="button" onClick={() => setManualInstitutionFields((current) => ({ ...current, tenthSchool: false }))} className="text-xs font-semibold text-emerald-700 hover:underline">Choose from list</button>
            </div>
          ) : (
            <Select
              label="10th School / College Name"
              value={form.tenthSchool}
              onChange={(event) => {
                if (event.target.value === '__manual__') {
                  setManualInstitutionFields((current) => ({ ...current, tenthSchool: true }))
                  updateField('tenthSchool', '')
                  return
                }
                updateField('tenthSchool', event.target.value)
              }}
              error={errors.tenthSchool}
              disabled={searchingInstitutions}
              options={[
                { value: '', label: institutionOptions.tenth.length ? 'Select your 10th school' : 'No nearby schools loaded' },
                ...institutionOptions.tenth.map((institution) => ({ value: institution.name, label: institution.name })),
                { value: '__manual__', label: 'My school is not listed' },
              ]}
            />
          )}

          <Select
            label="10th Board Type"
            value={form.tenthBoard}
            onChange={(event) => updateField('tenthBoard', event.target.value)}
            error={errors.tenthBoard}
            options={getBoardOptions(form.tenthBoard)}
          />

          <Input
            label="10th Percentage (%)"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.tenthPercentage}
            onChange={(e) =>
              updateField(
                'tenthPercentage',
                e.target.value
              )
            }
            error={errors.tenthPercentage}
            placeholder="0 to 100"
          />

          <Select
            label="10th Passing Year"
            value={form.tenthPassingYear}
            onChange={(event) => updateField('tenthPassingYear', event.target.value)}
            error={errors.tenthPassingYear}
            options={getPassingYearOptions(form.tenthPassingYear)}
          />

          {manualInstitutionFields.twelfthCollege ? (
            <div className="space-y-2">
              <Input label="12th School / College Name" value={form.twelfthCollege} onChange={(event) => updateField('twelfthCollege', event.target.value)} error={errors.twelfthCollege} />
              <button type="button" onClick={() => setManualInstitutionFields((current) => ({ ...current, twelfthCollege: false }))} className="text-xs font-semibold text-emerald-700 hover:underline">Choose from list</button>
            </div>
          ) : (
            <Select
              label="12th School / College Name"
              value={form.twelfthCollege}
              onChange={(event) => {
                if (event.target.value === '__manual__') {
                  setManualInstitutionFields((current) => ({ ...current, twelfthCollege: true }))
                  updateField('twelfthCollege', '')
                  return
                }
                updateField('twelfthCollege', event.target.value)
              }}
              error={errors.twelfthCollege}
              disabled={searchingInstitutions}
              options={[
                { value: '', label: institutionOptions.twelfth.length ? 'Select your 12th junior college' : 'No nearby colleges loaded' },
                ...institutionOptions.twelfth.map((institution) => ({ value: institution.name, label: institution.name })),
                { value: '__manual__', label: 'My school or college is not listed' },
              ]}
            />
          )}

          <Select
            label="12th Board Type"
            value={form.twelfthBoard}
            onChange={(event) => updateField('twelfthBoard', event.target.value)}
            error={errors.twelfthBoard}
            options={getBoardOptions(form.twelfthBoard)}
          />

          <Input
            label="12th Percentage (%)"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.twelfthPercentage}
            onChange={(e) =>
              updateField(
                'twelfthPercentage',
                e.target.value
              )
            }
            error={errors.twelfthPercentage}
            placeholder="0 to 100"
          />

          <Select
            label="12th Passing Year"
            value={form.twelfthPassingYear}
            onChange={(event) => updateField('twelfthPassingYear', event.target.value)}
            error={errors.twelfthPassingYear}
            options={getPassingYearOptions(form.twelfthPassingYear)}
          />
        </div>
      )
    }

    // STEP 4 - COURSE
    if (activeStep === 3) {
      return (
        <div className="grid gap-5">
          <Select
            label="Preferred Course"
            value={form.preferredCourse}
            onChange={(e) =>
              updateField(
                'preferredCourse',
                e.target.value
              )
            }
            options={COURSE_OPTIONS}
          />
          {(() => {
            const fee = getCourseFeeBreakdown(form.preferredCourse)
            return fee ? (
              <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5" aria-live="polite">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">Course fee · {fee.academicYear}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{form.preferredCourse}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">INR</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-1">
                  <div className="rounded-xl border border-slate-200 bg-white p-3"><div className="text-xs text-slate-500">Total course fee</div><div className="mt-1 font-bold text-slate-900">{formatINR(fee.totalFee)}</div></div>
                </div>
              </section>
            ) : null
          })()}
        </div>
      )
    }

    // STEP 5 - DOCUMENTS
    if (activeStep === 4) {
      return (
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Upload one PDF, JPG, or PNG file for each required document. Maximum 10 MB per file.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {requiredDocuments.map(({ type, label }) => {
              const uploadedDocument = form.documents.find((document) => document.documentType === type)

              return (
                <div key={type} className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
                    <p className="mt-1 text-xs text-slate-500">Required for your application</p>
                  </div>

                  {uploadedDocument && (
                    <div className="rounded-lg bg-emerald-50 p-3">
                      <p className="break-all text-sm font-medium text-emerald-900">{uploadedDocument.name}</p>
                      <p className="mt-1 text-xs text-emerald-700">{uploadedDocument.size} · {uploadedDocument.status}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(uploadedDocument.id)}
                        disabled={removingDocument === uploadedDocument.id || uploading}
                        className="mt-2 text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
                      >
                        {removingDocument === uploadedDocument.id ? 'Removing...' : 'Remove file'}
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    aria-label={`Upload ${label}`}
                    onChange={(event) => handleDocumentUpload(event, type)}
                    disabled={uploading || Boolean(uploadedDocument)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-emerald-50 file:px-2 file:py-1.5 file:font-semibold file:text-emerald-800"
                  />

                  {errors[type] && <p className="text-xs text-red-600" role="alert">{errors[type]}</p>}
                </div>
              )
            })}
          </div>

          {uploading && (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              Uploading selected document...
            </div>
          )}
        </div>
      )
    }

    // STEP 6 - REVIEW
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Personal Information
          </h3>

          <div className="mt-3 text-sm text-slate-600">
            {form.fullName} • {form.gender} •{' '}
            {form.category}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Contact Information
          </h3>

          <div className="mt-3 text-sm text-slate-600">
            {form.email} • {form.phone} •{' '}
            {form.city}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Academic Information
          </h3>

          <div className="mt-3 text-sm text-slate-600">
            10th: {form.tenthPercentage}% •
            12th: {form.twelfthPercentage}%
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Course Selection
          </h3>

          <div className="mt-3 text-sm text-slate-600">
            {form.preferredCourse}
          </div>
          {(() => {
            const fee = getCourseFeeBreakdown(form.preferredCourse)
            return fee ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-1">
                <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Total course fee</span><strong className="mt-1 block text-slate-900">{formatINR(fee.totalFee)}</strong></div>
              </div>
            ) : null
          })()}
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Documents
          </h3>

          <div className="mt-3 space-y-2">
            {requiredDocuments.map(({ type, label }) => {
              const document = form.documents.find((item) => item.documentType === type)
              return (
                <div key={type} className="flex justify-between gap-3 text-sm text-slate-600">
                  <span>{label}</span>
                  <span className="text-right">{document?.name || 'Not uploaded'}</span>
                </div>
              )
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.confirm}
            onChange={() =>
              updateField(
                'confirm',
                !form.confirm
              )
            }
          />

          I confirm that the information provided
          is correct.
        </label>
        {errors.confirm && <p className="text-sm text-red-600" role="alert">{errors.confirm}</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Admission Application
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Complete each section below, then submit your application.
        </p>
      </div>

      <div className="space-y-9 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {steps.map((item, index) => (
          <section key={item} className="scroll-mt-6 border-b border-slate-200 pb-8 last:border-b-0 last:pb-0">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Section {index + 1}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{item}</h2>
            </div>
            {renderStep(index)}
          </section>
        ))}

        {errors.submit && (
          <div
            className="mt-5 text-sm text-red-600"
            role="alert"
          >
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-200 pt-6">
          <Button onClick={handleSubmit} disabled={uploading || submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  )
}