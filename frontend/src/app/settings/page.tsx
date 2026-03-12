"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";

type Me = {
  id: string;
  name: string;
  email: string;
  role: "agent" | "admin";
  plan: "free" | "starter" | "professional" | "agency";
  subscription?: {
    status?: string;
    currentPeriodEnd?: string;
  };
};

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Me>("/auth/me");
        setMe(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };
    load();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Settings
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Manage your account details and subscription.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs font-medium text-slate-200">Profile</div>
            {!me ? (
              <p className="mt-2 text-xs text-slate-500">Loading profile…</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="text-slate-400">Name</span>
                  <span className="text-slate-100">{me.name}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-100">{me.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="text-slate-400">Role</span>
                  <span className="text-slate-100">{me.role}</span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs font-medium text-slate-200">Plan</div>
            {!me ? (
              <p className="mt-2 text-xs text-slate-500">Loading plan…</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="text-slate-400">Current plan</span>
                  <span className="text-slate-100">{me.plan}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="text-slate-400">Subscription status</span>
                  <span className="text-slate-100">
                    {me.subscription?.status || "inactive"}
                  </span>
                </div>
                <a
                  href="/billing"
                  className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400"
                >
                  Manage billing
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

