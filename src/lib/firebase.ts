import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace with your own Firebase configuration
// and store it securely in environment variables.
const firebaseConfig = {
  "projectId": "kings-eats-2",
  "appId": "1:38834481582:web:23965a36a43130ff2d403f",
  "storageBucket": "kings-eats-2.firebasestorage.app",
  "apiKey": "AIzaSyDiz933vs69LFFoJkLgZ41rBaOO_UfN7ms",
  "authDomain": "kings-eats-2.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "38834481582"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
