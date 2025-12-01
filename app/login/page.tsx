import { Suspense } from "react";
import Login from "@/lib/components/Login";

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-secondary border border-divider rounded-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-foreground-bright mb-2">
              Welcome to Roami
            </h1>
            <p className="text-foreground-secondary text-sm">
              Sign in to your account
            </p>
          </div>
          <div className="space-y-6">
            <div className="h-10 bg-background border border-divider rounded-lg animate-pulse" />
            <div className="h-10 bg-background border border-divider rounded-lg animate-pulse" />
            <div className="h-10 bg-background-secondary rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <Login />
    </Suspense>
  );
}

