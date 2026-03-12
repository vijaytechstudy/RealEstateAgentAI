"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";

interface Listing {
  _id: string;
  title: string;
  location: string;
  createdAt: string;
}

interface Lead {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadError(null);
        const [listingsRes, leadsRes] = await Promise.all([
          api.get<Listing[]>("/listings"),
          api.get<Lead[]>("/leads"),
        ]);
        setListings(listingsRes.data.slice(0, 5));
        setLeads(leadsRes.data.slice(0, 5));
      } catch (err: any) {
        setLoadError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard data"
        );
      }
    };
    fetchData();
  }, []);

  const totalLeads = leads.length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Overview of your AI-generated listings, leads and recent activity.
            </p>
          </div>
          <a
            href="/generate-listing"
            className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400 sm:text-sm"
          >
            + Generate Listing
          </a>
        </div>

        {loadError && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs text-red-200">
            {loadError}
          </div>
        )}

        <div className="grid gap-3 text-xs sm:grid-cols-3 sm:text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400">Generated listings</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {listings.length}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400">Total leads (sample)</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {totalLeads}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400">Recent activity</div>
            <div className="mt-2 text-sm text-slate-200">
              {listings[0]
                ? `Latest listing: ${listings[0].title}`
                : "No activity yet"}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Recent listings</span>
              <a href="/listings" className="text-sky-400 hover:text-sky-300">
                View all
              </a>
            </div>
            <div className="space-y-2">
              {listings.length === 0 && (
                <p className="text-xs text-slate-500">
                  No listings yet. Generate your first one.
                </p>
              )}
              {listings.map((l) => (
                <div
                  key={l._id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
                >
                  <div>
                    <div className="text-sm text-slate-100">{l.title}</div>
                    <div className="text-[11px] text-slate-400">{l.location}</div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Recent leads</span>
              <a href="/leads" className="text-sky-400 hover:text-sky-300">
                View CRM
              </a>
            </div>
            <div className="space-y-2">
              {leads.length === 0 && (
                <p className="text-xs text-slate-500">
                  No leads yet. Add leads from property inquiries.
                </p>
              )}
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
                >
                  <div>
                    <div className="text-sm text-slate-100">{lead.name}</div>
                    <div className="text-[11px] text-slate-400">{lead.status}</div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

