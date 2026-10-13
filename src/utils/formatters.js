export const formatStatusText = (status = '') =>
  status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const formatCourse = (course = '') => course || 'Not selected'

export const formatStudentName = (student) => student?.name || student?.fullName || 'Student'

export const formatDateTime = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export const shortId = (value = '') => (value ? value.slice(0, 12) : '---')
