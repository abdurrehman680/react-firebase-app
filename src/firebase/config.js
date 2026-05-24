import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD8AROlvaTxNHIsda06c6qFYthd1yARmlA",
  authDomain: "single-page-application-a69c8.firebaseapp.com",
  projectId: "single-page-application-a69c8",
  storageBucket: "single-page-application-a69c8.firebasestorage.app",
  messagingSenderId: "618739458487",
  appId: "1:618739458487:web:907f7d09532ba942478832",
  measurementId: "G-5GDQ9EFPBL"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()