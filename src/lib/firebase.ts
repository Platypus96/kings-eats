import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace with your own Firebase configuration
// and store it securely in environment variables.
const firebaseConfig = {
  apiKey: "AIzaSyB...-placeholder",
  authDomain: "kings-eats-app.firebaseapp.com",
  projectId: "kings-eats-app",
  storageBucket: "kings-eats-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:placeholder"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
