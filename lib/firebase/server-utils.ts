import { getServerUser } from "./server";

/**
 * Check if user is authenticated on the server
 * Useful for Server Components and Server Actions
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}

/**
 * Require authentication - throws error if not authenticated
 * Useful for protected Server Components and Server Actions
 */
export async function requireAuth() {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

