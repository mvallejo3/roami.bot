"use client";

import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { auth } from "./config";
import { refreshAuthToken } from "./auth";
import { AUTH_TOKEN_COOKIE } from "./constants";
import { botPilotApi } from "@/store/api";
import type { ServerUserInfo } from "./types";

interface UseAuthOptions {
  initialServerUser?: ServerUserInfo | null;
}

/**
 * Hook to get the current authentication state
 * The Firebase SDK automatically syncs auth state from cookies/tokens
 * @param options - Optional initial server user info for SSR optimization
 * @returns Object containing user, loading state, and error
 */
export function useAuth(options?: UseAuthOptions) {
  // Start with null - Firebase SDK will sync the actual User object
  const [user, setUser] = useState<User | null>(null);
  // If we have server user info, we know auth state exists (optimistic loading)
  const [loading, setLoading] = useState(!options?.initialServerUser);
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useDispatch();
  // Track previous user ID to detect user changes
  const previousUserIdRef = useRef<string | null>(
    options?.initialServerUser?.uid || null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        const previousUserId = previousUserIdRef.current;
        const currentUserId = currentUser?.uid || null;

        // Clear RTK Query cache if user changed (login, logout, or switch user)
        if (previousUserId !== currentUserId) {
          dispatch(botPilotApi.util.resetApiState());
        }

        // Update previous user ID reference
        previousUserIdRef.current = currentUserId;

        setUser(currentUser);
        setLoading(false);
        setError(null);

        // Update cookie when auth state changes
        if (currentUser) {
          try {
            await refreshAuthToken();
          } catch (err) {
            console.error("Failed to refresh auth token:", err);
          }
        } else {
          // Remove cookie on logout
          Cookies.remove(AUTH_TOKEN_COOKIE);
        }
      },
      (authError) => {
        // Clear cache on auth error
        dispatch(botPilotApi.util.resetApiState());
        previousUserIdRef.current = null;
        setError(authError as Error);
        setLoading(false);
        setUser(null);
        Cookies.remove(AUTH_TOKEN_COOKIE);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  return { user, loading, error };
}

