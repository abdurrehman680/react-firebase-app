// src/firebase/authService.js
// Centralised auth helper functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile, 
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, serverTimestamp,
} from 'firebase/firestore'
import { auth, db, googleProvider } from './config'

// ── helper: save user to Firestore (no duplicates) ──────────
async function saveUserToFirestore(firebaseUser, extra = {}) {
  const ref  = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    // First time: set role = 'user' (promote manually in Firestore for admin)
    await setDoc(ref, {
      uid:         firebaseUser.uid,
      email:       firebaseUser.email,
      displayName: firebaseUser.displayName ?? extra.displayName ?? '',
      photoURL:    firebaseUser.photoURL    ?? '',
      role:        'user',
      createdAt:   serverTimestamp(),
      ...extra,
    })
  }
  return (await getDoc(ref)).data()
}

// ── Email / Password Sign Up ─────────────────────────────────
export async function signUpWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  await saveUserToFirestore(cred.user, { displayName })
  return cred.user
}

// ── Email / Password Sign In ─────────────────────────────────
export async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

// ── Google Sign In ───────────────────────────────────────────
export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  await saveUserToFirestore(cred.user)
  return cred.user
}

// ── Sign Out ─────────────────────────────────────────────────
export async function logOut() {
  await signOut(auth)
}

// ── Reset Password ───────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

// ── Delete Account ───────────────────────────────────────────
export async function deleteAccount() {
  const user = auth.currentUser
  if (user) await deleteUser(user)
}
