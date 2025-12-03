"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/useAuth";
import { logout } from "@/lib/firebase/auth";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Agents", href: "/" },
  { label: "Knowledge Bases", href: "/knowledge-bases" },
];

/**
 * Gets user initials from email or display name
 */
function getUserInitials(user: { email: string | null; displayName: string | null }): string {
  if (user.displayName) {
    const names = user.displayName.trim().split(/\s+/);
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  return "?";
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Don't show navigation on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-secondary border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 h-16">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xl font-semibold text-accent-primary mr-4"
              >
                Roami
              </Link>
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent-primary text-foreground-bright"
                          : "text-foreground-secondary hover:text-foreground hover:bg-background"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-primary text-foreground-bright font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-secondary"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  {getUserInitials(user)}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-background-secondary border border-divider rounded-lg shadow-lg py-2">
                    <div className="px-4 py-3 border-b border-divider">
                      <p className="text-sm text-foreground-secondary">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-background transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
}

