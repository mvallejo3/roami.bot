"use client";

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
  { label: "Datasources", href: "/datasources" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground-secondary">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-background rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
}

