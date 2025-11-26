import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backAriaLabel?: string;
  rightAction?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  backHref,
  backAriaLabel,
  rightAction,
}: PageHeaderProps) {
  return (
    <header className="border-b border-divider px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className={backHref ? "flex items-center gap-3" : ""}>
          {backHref && (
            <Link
              href={backHref}
              className="text-foreground-secondary hover:text-foreground transition-colors"
              aria-label={backAriaLabel || "Go back"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-accent-primary">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-foreground-secondary mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}

