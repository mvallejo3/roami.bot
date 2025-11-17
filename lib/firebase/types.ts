/**
 * Minimal user information that can be serialized and passed from server to client
 */
export interface ServerUserInfo {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName?: string | null;
  photoURL?: string | null;
}

