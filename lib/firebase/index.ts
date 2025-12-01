/**
 * Firebase module exports
 */
export { default as app, auth } from "./config";
export {
  loginWithEmailPassword,
  loginWithGoogle,
  logout,
  getCurrentUser,
  refreshAuthToken,
} from "./auth";
export { useAuth } from "./useAuth";
export { getServerUser, getServerToken } from "./server";
export { AUTH_TOKEN_COOKIE } from "./constants";
export { isAuthenticated, requireAuth } from "./server-utils";
export type { ServerUserInfo } from "./types";

