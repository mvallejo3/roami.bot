import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "./constants";

/**
 * Decode JWT token to extract user information
 * Note: This decodes without verification. For production, use Firebase Admin SDK to verify tokens.
 */
function decodeJWT(token: string): {
  uid: string;
  email: string | null;
  email_verified: boolean;
  name?: string;
  picture?: string;
} | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString()
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    return {
      uid: decoded.user_id || decoded.sub,
      email: decoded.email || null,
      email_verified: decoded.email_verified || false,
      name: decoded.name,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}

/**
 * Get user information from server-side cookies
 * Returns null if no valid token is found
 */
export async function getServerUser(): Promise<{
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const decoded = decodeJWT(token);
  if (!decoded) {
    return null;
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
    emailVerified: decoded.email_verified,
    displayName: decoded.name,
    photoURL: decoded.picture,
  };
}

/**
 * Get the Firebase ID token from server-side cookies
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value || null;
}

