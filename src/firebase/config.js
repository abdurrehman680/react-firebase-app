// firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8AROlvaTxNHIsda06c6qFYthd1yARmlA",
  authDomain: "single-page-application-a69c8.firebaseapp.com",
  projectId: "single-page-application-a69c8",
  storageBucket: "single-page-application-a69c8.firebasestorage.app",
  messagingSenderId: "618739458487",
  appId: "1:618739458487:web:907f7d09532ba942478832",
  measurementId: "G-5GDQ9EFPBL"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const analytics = getAnalytics(app);