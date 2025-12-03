"use client";

import { useEffect } from "react";
import PageHeader from "@/lib/components/PageHeader";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  const errorMessage = error.message || "An unexpected error occurred";
  const errorStack = error.stack;
  const errorDigest = error.digest;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <PageHeader title="Error" description="Something went wrong" />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent-error/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-background-secondary border border-divider rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground-bright mb-2">
              Error Message
            </h2>
            <p className="text-foreground text-base leading-relaxed break-words">
              {errorMessage}
            </p>
            {errorDigest && (
              <p className="text-foreground-secondary text-sm mt-4">
                Error ID: <span className="font-mono">{errorDigest}</span>
              </p>
            )}
          </div>

          {/* Error Stack (if available) */}
          {errorStack && (
            <div className="bg-background-secondary border border-divider rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground-bright mb-3">
                Stack Trace
              </h2>
              <div className="bg-background-deep rounded p-4 overflow-x-auto">
                <pre className="text-sm text-foreground-secondary font-mono whitespace-pre-wrap break-words">
                  {errorStack}
                </pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-accent-primary text-foreground-bright px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-background-secondary text-foreground px-6 py-3 rounded-lg border border-divider hover:bg-background-deep transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-foreground-secondary text-sm">
              If this problem persists, please contact support with the Error ID
              {errorDigest && `: ${errorDigest}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


