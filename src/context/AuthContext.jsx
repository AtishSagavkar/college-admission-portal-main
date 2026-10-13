import { useCallback, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { authService } from '../services/authService'
import { auth } from '../lib/firebase'
import { AuthContext } from './AuthContextValue'

const getAuthErrorMessage = (error) => {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'Could not reach Firebase. Check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/weak-password': 'Choose a stronger password.',
    'permission-denied': 'Firebase denied this request. Check your Firestore rules.',
  }

  return messages[error.code] || error.message || 'Something went wrong. Please try again.'
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setCurrentUser(firebaseUser ? await authService.createSessionUser(firebaseUser) : null)
      } catch {
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const user = await authService.login(email, password)
      setCurrentUser(user)
      return { success: true, user }
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error) }
    }
  }, [])

  const register = useCallback(async (payload) => {
    try {
      const user = await authService.register(payload)
      setCurrentUser(user)
      return { success: true, user }
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error) }
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      await authService.resetPassword(email)
      return { success: true }
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error) }
    }
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    if (!auth.currentUser) return
    const user = await authService.createSessionUser(auth.currentUser)
    setCurrentUser(user)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setCurrentUser(null)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      register,
      resetPassword,
      refreshCurrentUser,
      logout,
      isAuthenticated: !!currentUser,
      userRole: currentUser?.role || null,
    }),
    [currentUser, loading, login, register, resetPassword, refreshCurrentUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
