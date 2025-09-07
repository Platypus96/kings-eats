import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace with your own Firebase configuration
// and store it securely in environment variables.
const firebaseConfig = {
  "projectId": "kings-eats",
  "appId": "1:28673527477:web:ceb6ce86bbfdf57910b8fc",
  "storageBucket": "kings-eats.firebasestorage.app",
  "apiKey": "AIzaSyDUZ_mGIyyfDtm30EcKaEHx9Ow76NOS3q4",
  "authDomain": "kings-eats.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "28673527477"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
