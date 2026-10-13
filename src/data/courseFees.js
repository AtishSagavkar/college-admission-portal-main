export const COURSE_FEES = {
  'B.Sc Computer Science': 150000,
  BCA: 100000,
  'B.Com': 90000,
  'B.A': 80000,
  'B.Sc': 120000,
}

export const getCourseFeeBreakdown = (courseName) => {
  const totalFee = COURSE_FEES[courseName]

  if (typeof totalFee !== 'number') return null

  return {
    totalFee,
    currency: 'INR',
    academicYear: '2026-2027',
  }
}

export const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount)
