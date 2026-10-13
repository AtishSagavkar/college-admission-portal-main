import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { auth, db } from '../lib/firebase'


const getRole = (claims) => {
  if (claims.admin === true || claims.role === 'admin') {
    return 'admin'
  }

  if (claims.role === 'teacher') {
    return 'teacher'
  }

  return 'student'
}


const createSessionUser = async (firebaseUser) => {
  // Force-refresh the ID token so newly assigned custom claims are loaded.
  const tokenResult = await getIdTokenResult(firebaseUser, true)
  const role = getRole(tokenResult.claims)

  const userRef = doc(db, 'users', firebaseUser.uid)
  const userSnapshot = await getDoc(userRef)

  let profile = userSnapshot.exists()
    ? userSnapshot.data()
    : null

  if (!profile && role === 'student') {
    profile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      phone: firebaseUser.phoneNumber || '',
      role: 'student',
      profile: {},
      createdAt: serverTimestamp(),
    }

    await setDoc(userRef, profile)
  }

  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: profile?.name || firebaseUser.displayName || '',
    email: firebaseUser.email || profile?.email || '',
    phone: profile?.phone || firebaseUser.phoneNumber || '',
    role,
    profile: profile?.profile || {},
  }
}


export const authService = {

  login: async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    )

    return createSessionUser(credential.user)
  },


  register: async ({
    fullName,
    email,
    phone,
    password,
  }) => {

    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    )

    const user = credential.user

    await updateProfile(user, {
      displayName: fullName.trim(),
    })

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        name: fullName.trim(),
        email: user.email,
        phone,
        role: 'student',
        profile: {},
        createdAt: serverTimestamp(),
      }
    )

    return createSessionUser(user)
  },


  logout: () => signOut(auth),

  resetPassword: (email) =>
    sendPasswordResetEmail(auth, email.trim()),

  createSessionUser,
}