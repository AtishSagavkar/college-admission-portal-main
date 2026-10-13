import process from 'node:process'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const [email, role] = process.argv.slice(2)
const allowedRoles = new Set(['admin', 'teacher', 'student'])

if (!email || !allowedRoles.has(role)) {
  console.error('Usage: npm run set-role -- <email> <admin|teacher|student>')
  process.exitCode = 1
} else {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'school-portal-f2230'
  initializeApp({ credential: applicationDefault(), projectId })

  const auth = getAuth()
  const user = await auth.getUserByEmail(email)
  const claims = { ...user.customClaims, role }
  if (role !== 'admin') delete claims.admin
  await auth.setCustomUserClaims(user.uid, claims)

  const userReference = getFirestore().collection('users').doc(user.uid)
  const profileSnapshot = await userReference.get()
  const existingProfile = profileSnapshot.data() || {}
  await userReference.set({
    uid: user.uid,
    name: existingProfile.name || user.displayName || '',
    email: user.email,
    phone: existingProfile.phone || '',
    role,
    profile: existingProfile.profile || {},
    ...(existingProfile.createdAt ? {} : { createdAt: new Date() }),
  }, { merge: true })

  console.log(`Set ${email} role to ${role}. Sign out and sign in again to refresh the role.`)
}