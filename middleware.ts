import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE } from "@/lib/firebase/constants";

/**
 * Base64URL decode (edge runtime compatible)
 */
function base64UrlDecode(str: string): string {
  // Convert base64url to base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += "=";
  }
  
  // Decode using atob (available in edge runtime)
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

/**
 * Validate JWT token structure (checks format, not expiration)
 * Returns true if token has valid structure, false otherwise
 * Note: We don't check expiration here - expired tokens are allowed through
 * and will be refreshed by the client
 */
function hasValidTokenStructure(token: string): boolean {
  try {
    // Check if token has the correct JWT structure (3 parts separated by dots)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Decode the payload to verify it's a valid JWT
    const jsonPayload = base64UrlDecode(parts[1]);
    if (!jsonPayload) {
      return false;
    }

    const decoded = JSON.parse(jsonPayload);

    // Token has valid structure if it has a user_id or sub claim
    // We don't check expiration - expired tokens will be refreshed by client
    return !!(decoded.user_id || decoded.sub);
  } catch {
    return false;
  }
}

/**
 * Middleware to protect routes and redirect unauthenticated users to login
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  
  // Check if token exists and has valid structure (but allow expired tokens through - client will refresh)
  const hasToken = !!token;
  const tokenStructureValid = token ? hasValidTokenStructure(token) : false;
  // For expired tokens, we still allow through - the client will refresh them
  // Only redirect if there's no token at all or token structure is invalid

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // If user is on login page and has a valid token structure, redirect to home
  if (pathname === "/login" && tokenStructureValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not authenticated (no token or invalid structure), redirect to login
  // Note: We allow expired tokens through - the client will refresh them automatically
  if (!isPublicRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

