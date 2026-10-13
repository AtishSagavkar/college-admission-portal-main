export const generateId = (prefix = 'ID') => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export const generateApplicationNumber = () => {
  const year = new Date().getFullYear()
  const next = Math.floor(Math.random() * 9000) + 1000
  return `ADM${year}${next}`
}

export const generateRequestNumber = () => {
  const year = new Date().getFullYear()
  const next = Math.floor(Math.random() * 9000) + 1000
  return `REQ${year}${next}`
}

export const formatDate = (value, fallback = 'N/A') => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toISOString().split('T')[0]
}

export const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const toTitleCase = (value = '') =>
  value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
