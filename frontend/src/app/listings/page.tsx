"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";

interface Listing {
  _id: string;
  title: string;
  location: string;
  price: string;
  createdAt: string;
  generated?: {
    headline?: string;
    description?: string;
    highlights?: string[];
    marketingCopy?: string;
  };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Listing[]>("/listings");
        setListings(res.data);
        setSelected(res.data[0] || null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load listings"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              Your listings
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Browse all AI-generated listings you&apos;ve created.
            </p>
          </div>
          <a
            href="/generate-listing"
            className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400 sm:text-sm"
          >
            + Generate new listing
          </a>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs sm:text-sm">
            <div className="mb-2 text-xs font-medium text-slate-200">
              Listings
            </div>
            {loading && (
              <p className="text-xs text-slate-500">Loading listings…</p>
            )}
            {!loading && listings.length === 0 && (
              <p className="text-xs text-slate-500">
                No listings yet. Generate your first one.
              </p>
            )}
            <div className="space-y-1">
              {listings.map((l) => {
                const active = selected?._id === l._id;
                return (
                  <button
                    key={l._id}
                    type="button"
                    onClick={() => setSelected(l)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${
                      active
                        ? "border-sky-500/60 bg-sky-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <div className="font-medium truncate">{l.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {l.location}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      {new Date(l.createdAt).toLocaleDateString()} · {l.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm">
            {!selected && (
              <p className="text-xs text-slate-500">
                Select a listing on the left to view its generated copy.
              </p>
            )}
            {selected && (
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Headline
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-50">
                    {selected.generated?.headline || selected.title}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Description
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {selected.generated?.description}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Highlights
                  </div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-200">
                    {selected.generated?.highlights?.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Marketing copy
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {selected.generated?.marketingCopy}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

