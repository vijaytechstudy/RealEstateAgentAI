"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate-listing", label: "Generate Listing" },
  { href: "/social", label: "Social Media Generator" },
  { href: "/leads", label: "Leads" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("rea_jwt");
      if (!token) {
        router.replace("/auth/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rea_jwt");
    }
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-64 border-r border-slate-800 bg-slate-950/80 px-4 py-5 sm:flex sm:flex-col sm:gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            REA
          </div>
          <div className="text-sm font-medium text-slate-100">Agent AI</div>
        </div>
        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  active
                    ? "bg-sky-500/15 text-sky-300"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto w-full rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-900"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-slate-950/90 px-4 py-4 sm:px-8 sm:py-6">
        <div className="mb-4 flex items-center justify-between sm:hidden">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              REA
            </div>
            <div className="text-sm font-medium text-slate-100">Agent AI</div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300"
          >
            Logout
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

