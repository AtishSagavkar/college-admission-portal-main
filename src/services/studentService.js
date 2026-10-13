import { collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { snapshotToRecord } from './firestoreUtils'

export const studentService = {
  async getStudents() {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs
      .map(snapshotToRecord)
      .filter((student) => student.role === 'student')
  },

  async getStudentById(studentId) {
    const snapshot = await getDoc(doc(db, 'users', studentId))
    return snapshot.exists() ? snapshotToRecord(snapshot) : null
  },

  getStudentByUserId(userId) {
    return this.getStudentById(userId)
  },

  async saveProfile(userId, profile) {
    const reference = doc(db, 'users', userId)
    const snapshot = await getDoc(reference)
    if (!snapshot.exists()) return { success: false, message: 'Student record not found.' }

    const nextProfile = {
      ...(snapshot.data().profile || {}),
      ...(profile || {}),
    }

    const updates = {
      name: nextProfile.fullName || snapshot.data().name,
      phone: nextProfile.phone || snapshot.data().phone || '',
      profile: nextProfile,
      updatedAt: serverTimestamp(),
    }
    await updateDoc(reference, updates)

    if (auth.currentUser?.uid === userId && nextProfile.fullName) {
      await updateProfile(auth.currentUser, { displayName: nextProfile.fullName })
    }

    return { success: true, student: { ...snapshotToRecord(snapshot), ...updates } }
  },
}

export const getStudents = studentService.getStudents.bind(studentService)
export const getStudentById = studentService.getStudentById.bind(studentService)
export const getStudentByUserId = studentService.getStudentByUserId.bind(studentService)
export const saveProfile = studentService.saveProfile.bind(studentService)
