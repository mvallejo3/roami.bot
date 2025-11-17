import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  type User,
  type UserCredential,
} from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "./config";
import { AUTH_TOKEN_COOKIE } from "./constants";

/**
 * Google Auth Provider instance
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Store auth token in cookie for server-side access
 */
async function setAuthTokenCookie(user: User): Promise<void> {
  const token = await user.getIdToken();
  // Set cookie with 1 hour expiration (Firebase tokens expire after 1 hour)
  Cookies.set(AUTH_TOKEN_COOKIE, token, {
    expires: 1 / 24, // 1 hour
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Remove auth token cookie
 */
function removeAuthTokenCookie(): void {
  Cookies.remove(AUTH_TOKEN_COOKIE);
}

/**
 * Sign in with Google
 */
export async function loginWithGoogle(): Promise<UserCredential> {
  const credential = await signInWithPopup(auth, googleProvider);
  if (credential.user) {
    await setAuthTokenCookie(credential.user);
  }
  return credential;
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  removeAuthTokenCookie();
  return signOut(auth);
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Refresh the auth token cookie (call this periodically or when token expires)
 */
export async function refreshAuthToken(): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await setAuthTokenCookie(user);
  }
}

/**
 * Delete the current user's account
 * This will permanently delete the user's Firebase account
 */
export async function deleteUserAccount(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in");
  }
  removeAuthTokenCookie();
  return deleteUser(user);
}

