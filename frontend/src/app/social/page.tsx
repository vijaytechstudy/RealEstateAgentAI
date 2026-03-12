"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";

export default function SocialPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        ...form,
        amenities: form.amenities
          ? form.amenities.split(",").map((a) => a.trim())
          : [],
      };
      const res = await api.post("/social/generate", payload);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate social content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Social Media Content Generator
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Generate captions and ad copy for Instagram, Facebook and LinkedIn in one shot.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm"
          >
            <div className="space-y-1">
              <label className="text-slate-200">Property title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-slate-200">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-200">Price</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Amenities</label>
              <input
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
                placeholder="Pool, Gym, Parking"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-200">Short property description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-500"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate social content"}
            </button>
          </form>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm">
            {!result && (
              <p className="text-xs text-slate-500">
                Generated captions and ad copy will appear here.
              </p>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Instagram caption
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {result.instagramCaption}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Facebook ad text
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {result.facebookAdText}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    LinkedIn post
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-200">
                    {result.linkedinPost}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Hashtags
                  </div>
                  <p className="mt-1 text-sm text-slate-200">
                    {result.hashtags?.join(" ")}
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

