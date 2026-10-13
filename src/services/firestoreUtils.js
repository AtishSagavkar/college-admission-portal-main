export const normalizeTimestamp = (value) => {
  if (!value) return null
  return typeof value.toDate === 'function' ? value.toDate().toISOString() : value
}

export const snapshotToRecord = (snapshot) => ({
  ...snapshot.data(),
  id: snapshot.id,
})