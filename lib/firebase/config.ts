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
  apiKey: "AIzaSyBIJvreJtlT__dknkNZopKAx12u6mAJkF8",
  authDomain: "photon-software-4ef7b.firebaseapp.com",
  databaseURL: "https://photon-software-4ef7b.firebaseio.com",
  projectId: "photon-software-4ef7b",
  storageBucket: "photon-software-4ef7b.appspot.com",
  messagingSenderId: "17878580864",
  appId: "1:17878580864:web:b0b7f2147e0bc1bb1d3065",
  measurementId: "G-7B4BRHVTL6",
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

