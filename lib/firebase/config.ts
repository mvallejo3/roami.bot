import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";

/**
 * Firebase configuration
 */
const firebaseConfig = {
  apiKey: "AIzaSyANuMDJ0elIHVohtZhcgo2sZ_rpXaaCfCA",
  authDomain: "roami-bot.firebaseapp.com",
  projectId: "roami-bot",
  storageBucket: "roami-bot.firebasestorage.app",
  messagingSenderId: "619883347250",
  appId: "1:619883347250:web:c7f5750fb357a7220c6b2b",
  measurementId: "G-B6Y1MN4EEV"
};

/**
 * Initialize Firebase app (singleton pattern)
 */
let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

/**
 * Get Firebase Auth instance
 */
export const auth: Auth = getAuth(app);

/**
 * Set authentication persistence to local storage
 * This ensures users remain logged in across browser sessions
 */
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set auth persistence:", error);
});

export default app;

