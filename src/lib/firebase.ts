import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
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

// The connectAuthEmulator call is added to handle potential issues with
// origin validation during local development. It ensures that Firebase
// authentication correctly recognizes the local development environment.
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Point to the official Firebase Auth emulator port
  // Note: You don't need to be running the emulator for this to help resolve origin issues
  try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  } catch (e) {
      // It's okay if this fails, it's just a helper for local dev.
      console.log(e);
  }
}

export { app, auth, db, googleProvider };
