export const isValidEmail = (email = '') => /\S+@\S+\.\S+/.test(email.trim())

export const isValidPhone = (phone = '') => /^\d{10}$/.test(String(phone).replace(/\s+/g, ''))

export const validatePassword = (password = '') => {
  if (!password || password.length < 6) return 'Password must be at least 6 characters long.'
  return ''
}

export const validatePincode = (value = '') => {
  if (!value) return 'Pincode is required.'
  if (!/^\d{6}$/.test(String(value))) return 'Pincode must be 6 digits.'
  return ''
}

export const validatePercentage = (value) => {
  const number = Number(value)
  if (value === '' || value === null || value === undefined) return 'Percentage is required.'
  if (Number.isNaN(number) || number < 0 || number > 100) return 'Percentage must be between 0 and 100.'
  return ''
}

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || String(value).trim() === '') return `${fieldName} is required.`
  return ''
}

export const validateForm = (fields) => {
  const errors = {}
  Object.entries(fields).forEach(([key, value]) => {
    if (value && typeof value === 'object' && 'required' in value) {
      const { required, message } = value
      if (required && (!value.value || String(value.value).trim() === '')) {
        errors[key] = message || `${key} is required.`
      }
    }
  })
  return errors
}
