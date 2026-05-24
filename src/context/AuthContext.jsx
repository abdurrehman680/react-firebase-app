// src/context/AuthContext.jsx
// Provides currentUser + userRole to the whole app
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole,    setUserRole]    = useState(null)   // 'admin' | 'user'
  const [userProfile, setUserProfile] = useState(null)   // full Firestore user doc
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser)
        // Fetch role from Firestore users collection
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (snap.exists()) {
            const data = snap.data()
            setUserRole(data.role ?? 'user')
            setUserProfile(data)
          } else {
            setUserRole('user')
            setUserProfile(null)
          }
        } catch {
          setUserRole('user')
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const value = { currentUser, userRole, userProfile, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
