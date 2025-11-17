"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the app is running in standalone mode (PWA)
 * @returns true if the app is in standalone mode, false otherwise
 */
export function useStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check for standalone mode using multiple methods for cross-platform support
    const checkStandalone = () => {
      // Method 1: Check display-mode media query (standard PWA)
      if (window.matchMedia("(display-mode: standalone)").matches) {
        return true;
      }

      // Method 2: Check navigator.standalone (iOS Safari)
      if (
        typeof (window.navigator as any).standalone !== "undefined" &&
        (window.navigator as any).standalone
      ) {
        return true;
      }

      // Method 3: Check if running in fullscreen mode (Android Chrome)
      if (window.matchMedia("(display-mode: fullscreen)").matches) {
        return true;
      }

      return false;
    };

    setIsStandalone(checkStandalone());

    // Listen for changes in display mode (in case user switches modes)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => {
      setIsStandalone(checkStandalone());
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return isStandalone;
}

