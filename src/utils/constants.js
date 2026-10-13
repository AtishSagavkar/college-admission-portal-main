export const STORAGE_KEYS = {
  USERS: 'campusconnect_users',
  STUDENTS: 'campusconnect_students',
  APPLICATIONS: 'campusconnect_applications',
  SERVICES: 'campusconnect_services',
  REQUESTS: 'campusconnect_requests',
  NOTIFICATIONS: 'campusconnect_notifications',
  CURRENT_USER: 'campusconnect_current_user',
}

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
}

export const COURSE_OPTIONS = [
  'B.Sc Computer Science',
  'BCA',
  'B.Com',
  'B.A',
  'B.Sc',
]

export const SERVICE_CATALOG = [
  'Bonafide Certificate',
  'Leaving Certificate',
  'Scholarship',
  'Exam Form',
  'Student ID Card',
  'Notes',
  'Complaint / Support',
]

export const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  DOCUMENTS_VERIFIED: 'documents_verified',
  TEACHER_APPROVED: 'teacher_approved',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const SERVICE_REQUEST_STATUS = {
  SUBMITTED: 'submitted',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
}

export const STATUS_META = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  under_review: { label: 'Under Review', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  documents_verified: { label: 'Documents Verified', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  teacher_approved: { label: 'Teacher Approved', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  approved: { label: 'Admission Confirmed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
  processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
}

export const PUBLIC_NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
]
